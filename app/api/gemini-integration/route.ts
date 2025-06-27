import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

function isKeyMissing(key: string | undefined): boolean {
  return !key || key === "GEMINI_API_KEY" || key.startsWith("your_") || key.length < 20
}

const KEY_MISSING = isKeyMissing(GEMINI_API_KEY)

function extractPrompt(body: Record<string, unknown>): { prompt: string; mode: "chat" | "assessment" } {
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return { prompt: body.prompt.trim(), mode: "chat" }
  }

  if (typeof body.message === "string" && body.type === "assessment") {
    return { prompt: body.message.trim(), mode: "assessment" }
  }

  return { prompt: JSON.stringify(body), mode: "chat" }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, mode } = extractPrompt(body)

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    if (KEY_MISSING) {
      console.warn("⚠️  GEMINI_API_KEY is not set – returning stub data so the UI keeps working.")

      const stub =
        mode === "assessment"
          ? {
              medications:
                "Based on your symptoms, consider over-the-counter pain relievers like acetaminophen or ibuprofen as directed. Always read labels and follow dosing instructions.",
              doctors:
                "Recommend consulting with a general practitioner for initial evaluation. If symptoms persist, consider seeing a specialist relevant to your primary concern.",
              labs: "Suggested tests may include: Complete Blood Count (CBC), Basic Metabolic Panel, Thyroid Function Tests, and Vitamin D levels based on your symptoms.",
              pharmacy:
                "Visit your local pharmacy chains like CVS, Walgreens, or independent pharmacies. Many offer health consultations and medication reviews.",
              dietPlan:
                "Focus on anti-inflammatory foods: leafy greens, fatty fish, berries, nuts, and whole grains. Limit processed foods, sugar, and excessive caffeine.",
              exercise:
                "Start with 20-30 minutes of moderate activity daily: walking, swimming, or yoga. Gradually increase intensity based on your fitness level and symptoms.",
              generalAdvice:
                "Monitor your symptoms, stay hydrated, maintain regular sleep schedule, and don't hesitate to seek medical attention if symptoms worsen or persist.",
            }
          : "I'm a medical AI assistant. I can help answer health-related questions, but please remember that my responses are for informational purposes only and should not replace professional medical advice."

      return NextResponse.json({ response: stub })
    }

    const systemPreamble =
      mode === "assessment"
        ? "You are a helpful medical AI assistant. Based on the patient assessment provided, give detailed recommendations for: 1) medications (over-the-counter suggestions), 2) doctors/specialists to consult, 3) laboratory tests that might be helpful, 4) pharmacy options, 5) personalized diet plan, 6) exercise recommendations, and 7) general health advice. Always include appropriate medical disclaimers."
        : "You are a helpful medical AI assistant. Answer the user's health question with accurate, helpful information while emphasizing the importance of consulting healthcare professionals."

    const geminiRes = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY!)}`, {
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

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("Gemini API error:", geminiRes.status, errText)
      return NextResponse.json({ error: "Gemini API request failed.", detail: errText }, { status: geminiRes.status })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response generated."

    return NextResponse.json({ response: text })
  } catch (err) {
    console.error("Gemini integration route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
