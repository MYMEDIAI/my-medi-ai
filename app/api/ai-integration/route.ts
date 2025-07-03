import { type NextRequest, NextResponse } from "next/server"

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

function isKeyMissing(key: string | undefined): boolean {
  return !key || !key.startsWith("sk-") || key.length < 20
}

const NO_API_KEY = isKeyMissing(OPENAI_API_KEY)

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function extractPrompt(body: Record<string, unknown>): {
  prompt: string
  mode: "chat" | "assessment" | "report-analysis" | "medicine-identification" | "symptom-analysis"
} {
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return { prompt: body.prompt.trim(), mode: "chat" }
  }

  if (typeof body.message === "string") {
    let mode: "chat" | "assessment" | "report-analysis" | "medicine-identification" | "symptom-analysis" = "chat"

    if (body.type === "assessment") mode = "assessment"
    else if (body.type === "report-analysis") mode = "report-analysis"
    else if (body.type === "medicine-identification") mode = "medicine-identification"
    else if (body.type === "symptom-analysis") mode = "symptom-analysis"

    return { prompt: body.message.trim(), mode }
  }

  return { prompt: JSON.stringify(body), mode: "chat" }
}

async function callOpenAI(
  prompt: string,
  mode: "chat" | "assessment" | "report-analysis" | "medicine-identification" | "symptom-analysis",
) {
  let systemMessage = ""

  switch (mode) {
    case "assessment":
      systemMessage = `You are a revolutionary AI medical assistant with cutting-edge capabilities. You have expertise in:

1. 🧬 AI Genetic Health Prediction - Analyze family history and predict genetic risks 10 years before symptoms
2. 🗣️ Voice Biomarker Detection - Detect 47+ conditions from voice analysis including COVID, depression, Alzheimer's
3. 👁️ Real-Time Health Vision AI - Camera-based disease screening for cancer, diabetes complications, skin conditions
4. 🌿 AI Ayurveda Integration - World's first platform combining modern medicine with validated Ayurvedic treatments
5. 👨‍👩‍👧‍👦 Family Health Ecosystem - AI manages entire family health with collective genetic insights
6. 💰 Healthcare Economics AI - Finds cheapest treatments, optimizes insurance, medical tourism planning
7. 🧠 AI Mental Health Screening - Comprehensive psychological assessment integration
8. ⚡ Real-time AI Analysis - Immediate symptom analysis and risk alerts
9. 🔬 Smart Medical Validation - AI validates medical inputs for accuracy
10. 🚨 AI Emergency Detection - Automatic emergency service recommendations

Based on the health assessment request, provide revolutionary insights that are evidence-based, culturally appropriate for India, and utilize cutting-edge AI capabilities.

IMPORTANT: Always provide actionable, accurate medical insights while emphasizing that AI recommendations should be confirmed by qualified medical practitioners.`
      break

    case "report-analysis":
      systemMessage = `You are an expert AI medical report analyzer with advanced capabilities in interpreting medical test results. You specialize in:

1. 📊 Comprehensive Report Analysis - Detailed interpretation of lab results, imaging, and diagnostic tests
2. 🎯 Parameter Assessment - Identifying normal, abnormal, and borderline values with clinical significance
3. 🔍 Pattern Recognition - Detecting trends and correlations across multiple parameters
4. ⚠️ Risk Stratification - Assessing urgency levels and potential health implications
5. 💡 Clinical Insights - Providing evidence-based interpretations and recommendations
6. 🏥 Indian Healthcare Context - Understanding local reference ranges and population-specific factors
7. 📋 Structured Analysis - Organizing findings into clear, actionable categories
8. 🚨 Red Flag Detection - Identifying critical values requiring immediate attention

Provide comprehensive, structured analysis that includes:
- Report type identification
- Key findings summary
- Parameter-by-parameter analysis with normal ranges
- Clinical significance and implications
- Actionable recommendations
- Follow-up care guidance
- Urgency assessment

Always emphasize that AI analysis supplements but does not replace professional medical interpretation.`
      break

    case "medicine-identification":
      systemMessage = `You are an expert AI pharmacist and medicine identifier with comprehensive knowledge of:

1. 💊 Medicine Identification - Accurate identification of medications from descriptions or images
2. 🧪 Drug Information Database - Comprehensive knowledge of generic and brand medications
3. 💰 Price Analysis - Indian pharmaceutical market pricing for brand vs generic options
4. ⚠️ Safety Profiles - Complete side effects, contraindications, and drug interactions
5. 📋 Dosage Guidelines - Proper administration, timing, and dosing recommendations
6. 🏥 Indian Pharmacy Context - Local availability, manufacturers, and regulatory information
7. 🔄 Drug Interactions - Comprehensive interaction checking and warnings
8. 👥 Patient Safety - Age-specific, condition-specific, and pregnancy-related considerations

Provide detailed medicine information including:
- Accurate identification with generic and brand names
- Therapeutic uses and mechanism of action
- Proper dosage and administration guidelines
- Complete side effect profile
- Drug interaction warnings
- Precautions and contraindications
- Indian market pricing information
- Storage and handling instructions

Always emphasize verification with qualified pharmacists and healthcare providers.`
      break

    case "symptom-analysis":
      systemMessage = `You are an expert AI diagnostic assistant specializing in symptom analysis and clinical assessment. Your expertise includes:

1. 🎯 Symptom Pattern Recognition - Advanced analysis of symptom combinations and presentations
2. 🔍 Differential Diagnosis - Systematic evaluation of possible conditions and causes
3. ⚡ Triage Assessment - Determining urgency levels and appropriate care pathways
4. 🏥 Clinical Decision Support - Evidence-based recommendations for next steps
5. 🚨 Red Flag Detection - Identifying warning signs requiring immediate medical attention
6. 🌍 Indian Healthcare Context - Understanding local disease patterns and healthcare access
7. 💡 Patient Education - Clear explanations of symptoms and their implications
8. 📋 Structured Assessment - Organized evaluation following clinical protocols

Provide comprehensive symptom analysis including:
- Detailed symptom assessment and interpretation
- Possible causes ranging from common to serious conditions
- Immediate self-care recommendations
- Warning signs requiring urgent medical attention
- Appropriate follow-up care guidance
- Prevention strategies and lifestyle modifications
- When and what type of healthcare provider to consult

Always emphasize that symptom analysis is for educational purposes and professional medical evaluation is essential for proper diagnosis and treatment.`
      break

    default:
      systemMessage = `You are a helpful AI medical assistant powered by OpenAI. Provide clear, accurate health information with appropriate medical disclaimers. Focus on being helpful while emphasizing the importance of consulting healthcare professionals for medical advice.`
  }

  const response = await fetch(OPENAI_API_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "No response generated."
}

/* -------------------------------------------------------------------------- */
/*  Route Handler                                                             */
/* -------------------------------------------------------------------------- */

async function parseBody(req: NextRequest): Promise<Record<string, any>> {
  const contentType = req.headers.get("content-type") || ""

  // 1. If JSON → parse directly
  if (contentType.includes("application/json")) {
    try {
      return await req.json()
    } catch {
      return {}
    }
  }

  // 2. Otherwise try multipart / urlencoded as FormData
  try {
    const form = await req.formData()
    const obj: Record<string, any> = {}
    form.forEach((value, key) => {
      if (typeof value === "string") obj[key] = value
      // Files are ignored for now – add handling later if needed
    })
    return obj
  } catch {
    return {}
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body (works for JSON *or* multipart)
    const body = await parseBody(req)

    const { prompt, mode } = extractPrompt(body)

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    /* ------------------------------------------------------------------ */
    /*  Local / preview fallback if no API keys are set                  */
    /* ------------------------------------------------------------------ */
    if (NO_API_KEY) {
      console.warn("⚠️  No OpenAI API key found – returning simplified stub data")

      const stub =
        mode === "assessment"
          ? {
              medications: `• Acetaminophen 500mg every 6 hours for pain
• Ibuprofen 200mg every 8 hours for inflammation  
• Take with food to prevent stomach upset
• Do not exceed recommended dosage`,

              doctors: `• Primary Care Physician - Schedule within 1-2 weeks
• Urgent Care - If symptoms worsen quickly
• Specialist referral may be needed based on evaluation
• Bring list of current medications and symptoms`,

              labs: `• Complete Blood Count (CBC) - Check for infections
• Basic Metabolic Panel - Kidney and liver function
• Thyroid Function Tests - If fatigue is present
• Inflammatory markers (ESR, CRP) if needed`,

              pharmacy: `• CVS, Walgreens, or local pharmacy chains
• Generic medications available for cost savings
• Pharmacy consultation services available
• Prescription delivery options available`,

              dietPlan: `• Anti-inflammatory foods: salmon, berries, leafy greens
• Avoid processed foods and excess sugar
• Drink 8-10 glasses of water daily
• Eat regular meals every 3-4 hours`,

              exercise: `• 20-30 minutes walking daily
• Light stretching or yoga 3x per week
• Avoid high-impact activities initially
• Listen to your body and rest when needed`,

              generalAdvice: `• Monitor symptoms daily and keep a health diary
• Get 7-9 hours of sleep nightly
• Seek immediate care if symptoms worsen significantly
• This is not a substitute for professional medical advice`,
            }
          : "I'm a medical AI assistant powered by OpenAI. I provide general health information, but always consult healthcare professionals for proper medical advice and treatment. Please add your OpenAI API key to enable full AI capabilities."

      return NextResponse.json({
        response: stub,
        provider: "stub",
        message: "Using simplified demo data. Add OPENAI_API_KEY for live AI responses.",
      })
    }

    /* ------------------------------------------------------------------ */
    /*  Real OpenAI API calls                                             */
    /* ------------------------------------------------------------------ */
    const aiResponse = await callOpenAI(prompt, mode)

    return NextResponse.json({
      response: aiResponse,
      provider: "openai",
    })
  } catch (err) {
    console.error("OpenAI integration route error:", err)
    return NextResponse.json(
      {
        error: "AI service temporarily unavailable",
        provider: "openai",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
