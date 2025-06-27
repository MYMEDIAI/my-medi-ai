import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const assessment = await request.json()

    // Call your integrated API
    const response = await fetch(`${request.nextUrl.origin}/api/gemini-integration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: assessment,
        type: "assessment",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get AI recommendations")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Health Assessment API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process health assessment",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
