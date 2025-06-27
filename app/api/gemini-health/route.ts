import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Call the unified AI integration endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/ai-integration`, {
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
    console.error("AI Health API Error:", error)
    return NextResponse.json(
      {
        response: "I'm experiencing technical difficulties. Please try again in a moment.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
