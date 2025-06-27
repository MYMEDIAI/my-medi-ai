import { type NextRequest, NextResponse } from "next/server"

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

/**
 * Detect if the key is missing or clearly still a placeholder.
 */
function isKeyMissing(key: string | undefined) {
  return (
    !key ||
    key === "GEMINI_API_KEY" || // placeholder value
    key.startsWith("your_") || // from .env.example
    key.length < 20 // real keys are longer
  )
}

const KEY_MISSING = isKeyMissing(GEMINI_API_KEY)

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Normalise payloads sent by /chat and /health-assessment.
 */
function extractPrompt(body: Record<string, unknown>): { prompt: string; mode: "chat" | "assessment" } {
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return { prompt: body.prompt.trim(), mode: "chat" }
  }

  if (typeof body.message === "string" && body.type === "assessment") {
    return { prompt: body.message.trim(), mode: "assessment" }
  }

  // Fallback – stringify unknown payload
  return { prompt: JSON.stringify(body), mode: "chat" }
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
    /*  Local / preview fallback if key is not set                         */
    /* ------------------------------------------------------------------ */
    if (KEY_MISSING) {
      console.warn("⚠️  GEMINI_API_KEY is not set – returning stub data so the UI keeps working.")

      const stub =
        mode === "assessment"
          ? {
              medications: "Paracetamol 500 mg when needed.",
              doctors: "Consult a local GP.",
              labs: "CBC and thyroid profile.",
              pharmacy: "Any licensed pharmacy nearby.",
              dietPlan: "Balanced diet rich in fruit and vegetables.",
              exercise: "30 min brisk walk daily.",
              generalAdvice: "Stay hydrated, rest, and seek medical advice if symptoms persist.",
            }
          : "Stubbed AI response. Add a real GEMINI_API_KEY for live answers."

      return NextResponse.json({ response: stub })
    }

    /* ------------------------------------------------------------------ */
    /*  Real Gemini request                                               */
    /* ------------------------------------------------------------------ */
    const systemPreamble =
      mode === "assessment"
        ? [
            "You are a helpful medical AI.",
            "Return concise HTML paragraphs for:",
            "1) medications, 2) doctors, 3) labs, 4) pharmacy,",
            "5) dietPlan, 6) exercise, 7) generalAdvice",
            "based ONLY on the following patient assessment JSON.",
          ].join(" ")
        : "You are a helpful medical AI. Answer the user's question."

    const geminiRes = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY!)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "system", parts: [{ text: systemPreamble }] },
          { role: "user", parts: [{ text: prompt }] },
        ],
      }),
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("Gemini API error:", geminiRes.status, errText)
      return NextResponse.json({ error: "Gemini API request failed.", detail: errText }, { status: geminiRes.status })
    }

    const data = (await geminiRes.json()) as any
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response."

    return NextResponse.json({ response: text })
  } catch (err) {
    console.error("Gemini integration route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
