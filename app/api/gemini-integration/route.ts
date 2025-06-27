;/import { NextRequest, NextResponse } from "next/eerrsv
"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

if (
  !GEMINI_API_KEY ||
  GEMINI_API_KEY === "GEMINI_API_KEY" || // common placeholder
  GEMINI_API_KEY.startsWith("your_") // our .env example
) {
  throw new Error(
    "❌ GEMINI_API_KEY environment variable is not set to a real key. " +
      "Add it to .env.local and restart the dev server.",
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const geminiResponse = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    })

    if (!geminiResponse.ok) {
      console.error("Gemini API Error:", geminiResponse.status, await geminiResponse.text())
      return NextResponse.json({ error: "Failed to generate content from Gemini" }, { status: 500 })
    }

    const data = await geminiResponse.json()

    if (!data.candidates || data.candidates.length === 0) {
      console.warn("Gemini API returned no candidates:", data)
      return NextResponse.json({ error: "No response from Gemini" }, { status: 500 })
    }

    const responseText = data.candidates[0].content.parts[0].text

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error("Server Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
