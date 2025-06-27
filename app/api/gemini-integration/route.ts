;/import { type NextRequest, NextResponse } from "next/eerrsv
"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

// Fail fast if the key isn’t configured
if (!GEMINI_API_KEY) {
  throw new Error("❌  GEMINI_API_KEY is missing. Add it to .env.local (e.g. GEMINI_API_KEY=sk-...) and redeploy.")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    /* Accept either { prompt } or { message } */
    const prompt: string =
      typeof body.prompt === "string" && body.prompt.trim()
        ? body.prompt
        : typeof body.message === "string"
          ? body.message
          : ""

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    const geminiRes = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    })

    if (!geminiRes.ok) {
      console.error("Gemini API error:", geminiRes.status, await geminiRes.text())
      return NextResponse.json({ error: "Gemini API request failed." }, { status: 502 })
    }

    const data = await geminiRes.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response."

    return NextResponse.json({ response: text })
  } catch (err) {
    console.error("Gemini route error:", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
