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
      ? "You are a helpful medical AI assistant. Based on the patient assessment provided, give detailed recommendations for: 1) medications (over-the-counter suggestions), 2) doctors/specialists to consult, 3) laboratory tests that might be helpful, 4) pharmacy options, 5) personalized diet plan, 6) exercise recommendations, and 7) general health advice. Always include appropriate medical disclaimers."
      : "You are a helpful medical AI assistant. Answer the user's health question with accurate, helpful information while emphasizing the importance of consulting healthcare professionals."

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
      max_tokens: 2048,
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
      ? "You are a helpful medical AI assistant. Based on the patient assessment provided, give detailed recommendations for: 1) medications (over-the-counter suggestions), 2) doctors/specialists to consult, 3) laboratory tests that might be helpful, 4) pharmacy options, 5) personalized diet plan, 6) exercise recommendations, and 7) general health advice. Always include appropriate medical disclaimers."
      : "You are a helpful medical AI assistant. Answer the user's health question with accurate, helpful information while emphasizing the importance of consulting healthcare professionals."

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY!)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `${systemPreamble}\n\n${prompt}` }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
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
      console.warn("⚠️  No AI API keys found – returning enhanced stub data")

      const stub =
        mode === "assessment"
          ? {
              medications:
                "Based on your symptoms, consider over-the-counter pain relievers like acetaminophen (500mg every 6 hours) or ibuprofen (200-400mg every 6-8 hours) as directed. Always read labels carefully and follow dosing instructions. Avoid if you have allergies to these medications.",
              doctors:
                "Recommend scheduling an appointment with your primary care physician within 1-2 weeks for initial evaluation. If symptoms worsen or are severe, consider urgent care. Based on your symptoms, you may need referral to specialists such as cardiology, gastroenterology, or rheumatology.",
              labs: "Suggested diagnostic tests may include: Complete Blood Count (CBC) to check for infections or anemia, Basic Metabolic Panel (BMP) for kidney and electrolyte function, Thyroid Function Tests (TSH, T3, T4), Vitamin D levels, and inflammatory markers (ESR, CRP) based on your symptoms.",
              pharmacy:
                "Visit major pharmacy chains like CVS, Walgreens, Rite Aid, or local independent pharmacies. Many offer health consultations, medication reviews, blood pressure checks, and immunizations. Consider pharmacy apps for prescription management and refill reminders.",
              dietPlan:
                "Focus on anti-inflammatory foods: leafy greens (spinach, kale), fatty fish (salmon, mackerel), berries (blueberries, strawberries), nuts (walnuts, almonds), and whole grains. Limit processed foods, refined sugars, and excessive caffeine. Stay hydrated with 8-10 glasses of water daily.",
              exercise:
                "Start with 20-30 minutes of moderate activity daily: brisk walking, swimming, or yoga. Gradually increase intensity based on your fitness level. Include strength training 2-3 times per week and flexibility exercises. Listen to your body and adjust based on symptoms.",
              generalAdvice:
                "Monitor your symptoms closely and keep a health diary. Maintain regular sleep schedule (7-9 hours nightly), manage stress through meditation or relaxation techniques, and don't hesitate to seek immediate medical attention if symptoms worsen significantly. This AI assessment is not a substitute for professional medical advice.",
            }
          : "I'm a medical AI assistant powered by advanced AI technology. I can help answer health-related questions and provide general medical information, but please remember that my responses are for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for proper diagnosis and treatment."

      return NextResponse.json({
        response: stub,
        provider: "stub",
        message: "Using enhanced stub data. Add OPENAI_API_KEY or GEMINI_API_KEY for live AI responses.",
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
