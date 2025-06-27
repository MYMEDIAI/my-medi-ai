import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Call your integrated API
    const response = await fetch(`${request.nextUrl.origin}/api/gemini-integration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        type: "chat",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get AI response")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Gemini Health API Error:", error)
    return NextResponse.json(
      {
        response: "I'm experiencing technical difficulties. Please try again in a moment.",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
