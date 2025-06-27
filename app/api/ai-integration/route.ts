import { type NextRequest, NextResponse } from "next/server"

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Prefer OpenAI if available, fallback to Gemini
const AI_PROVIDER = OPENAI_API_KEY ? "openai" : GEMINI_API_KEY ? "gemini" : "none"

const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions"
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

function isKeyMissing(key: string | undefined): boolean {
  return !key || (key.startsWith("sk-") === false && key.startsWith("AIza") === false) || key.length < 20
}

const NO_API_KEY = AI_PROVIDER === "none"

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function extractPrompt(body: Record<string, unknown>): { prompt: string; mode: "chat" | "assessment" } {
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return { prompt: body.prompt.trim(), mode: "chat" }
  }

  if (typeof body.message === "string") {
    const mode = body.type === "assessment" ? "assessment" : "chat"
    return { prompt: body.message.trim(), mode }
  }

  return { prompt: JSON.stringify(body), mode: "chat" }
}

async function callOpenAI(prompt: string, mode: "chat" | "assessment") {
  const systemMessage =
    mode === "assessment"
      ? `You are a medical AI assistant. Provide clear, organized recommendations in exactly this format:

MEDICATIONS:
• [Specific medication name and dosage]
• [When to take it]
• [Important warnings]

DOCTORS:
• [Type of doctor to see]
• [When to schedule appointment]
• [What to expect]

LABS:
• [Specific test name]
• [Why it's needed]
• [Normal ranges if relevant]

PHARMACY:
• [Where to get medications]
• [Services available]
• [Cost-saving tips]

DIET:
• [Specific foods to eat]
• [Foods to avoid]
• [Meal timing]

EXERCISE:
• [Specific activities]
• [Duration and frequency]
• [Precautions]

GENERAL ADVICE:
• [Key action items]
• [Warning signs to watch]
• [Follow-up timeline]

Keep each point concise and actionable. Use bullet points only.`
      : "You are a helpful medical AI assistant. Provide clear, concise health information with appropriate medical disclaimers."

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
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || "No response generated."
}

async function callGemini(prompt: string, mode: "chat" | "assessment") {
  const systemPreamble =
    mode === "assessment"
      ? `You are a medical AI assistant. Provide clear, organized recommendations in exactly this format:

MEDICATIONS:
• [Specific medication name and dosage]
• [When to take it]
• [Important warnings]

DOCTORS:
• [Type of doctor to see]
• [When to schedule appointment]
• [What to expect]

LABS:
• [Specific test name]
• [Why it's needed]
• [Normal ranges if relevant]

PHARMACY:
• [Where to get medications]
• [Services available]
• [Cost-saving tips]

DIET:
• [Specific foods to eat]
• [Foods to avoid]
• [Meal timing]

EXERCISE:
• [Specific activities]
• [Duration and frequency]
• [Precautions]

GENERAL ADVICE:
• [Key action items]
• [Warning signs to watch]
• [Follow-up timeline]

Keep each point concise and actionable. Use bullet points only.`
      : "You are a helpful medical AI assistant. Provide clear, concise health information with appropriate medical disclaimers."

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY!)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${systemPreamble}\n\n${prompt}` }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
}

/* -------------------------------------------------------------------------- */
/*  Route Handler                                                             */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, mode } = extractPrompt(body)

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    /* ------------------------------------------------------------------ */
    /*  Local / preview fallback if no API keys are set                  */
    /* ------------------------------------------------------------------ */
    if (NO_API_KEY) {
      console.warn("⚠️  No AI API keys found – returning simplified stub data")

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
          : "I'm a medical AI assistant. I provide general health information, but always consult healthcare professionals for proper medical advice and treatment."

      return NextResponse.json({
        response: stub,
        provider: "stub",
        message: "Using simplified demo data. Add OPENAI_API_KEY or GEMINI_API_KEY for live AI responses.",
      })
    }

    /* ------------------------------------------------------------------ */
    /*  Real AI API calls                                                 */
    /* ------------------------------------------------------------------ */
    let aiResponse: string

    if (AI_PROVIDER === "openai") {
      aiResponse = await callOpenAI(prompt, mode)
    } else {
      aiResponse = await callGemini(prompt, mode)
    }

    return NextResponse.json({
      response: aiResponse,
      provider: AI_PROVIDER,
    })
  } catch (err) {
    console.error("AI integration route error:", err)
    return NextResponse.json(
      {
        error: "AI service temporarily unavailable",
        provider: AI_PROVIDER,
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
