import { type NextRequest, NextResponse } from "next/server"

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is missing. Add it to .env.local and redeploy.")
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function buildPrompt(body: Record<string, unknown>): { prompt: string; mode: "chat" | "assessment" } {
  // Accept flexible payloads coming from /chat or /health-assessment
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return { prompt: body.prompt.trim(), mode: "chat" }
  }

  if (typeof body.message === "string" && body.type === "assessment") {
    // Health-assessment route sends a JSON-stringified object in `message`
    return { prompt: body.message.trim(), mode: "assessment" }
  }

  // Fallback: stringify whatever we got
  return { prompt: JSON.stringify(body), mode: "chat" }
}

/* -------------------------------------------------------------------------- */
/*  Route Handler                                                             */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, mode } = buildPrompt(body)

    const systemPreamble =
      mode === "assessment"
        ? "You are a helpful medical AI. Return concise HTML paragraphs for: " +
          "1) medications, 2) doctors, 3) labs, 4) pharmacy, 5) dietPlan, 6) exercise, 7) generalAdvice " +
          "based ONLY on the following patient assessment JSON.\n"
        : "You are a helpful medical AI. Answer the user's question.\n"

    const geminiRes = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
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
      const errTxt = await geminiRes.text()
      console.error("Gemini API error:", geminiRes.status, errTxt)
      return NextResponse.json({ error: "Gemini API request failed.", detail: errTxt }, { status: 502 })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response."

    return NextResponse.json({ response: text })
  } catch (err) {
    console.error("Gemini integration route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
