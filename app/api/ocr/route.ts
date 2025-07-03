import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 OCR API: Starting text extraction...")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("❌ OCR API: No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("📁 OCR API: Processing file:", file.name, "Size:", file.size, "Type:", file.type)

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")

    console.log("📤 OCR API: Sending to OpenAI Vision API...")

    // Use OpenAI Vision API for OCR
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract all text from this medicine image with high accuracy. Focus on:

PRIMARY INFORMATION:
- Medicine name (brand name)
- Generic name (if visible)
- Dosage/strength (mg, IU, ml, etc.)
- Manufacturer/company name

SECONDARY INFORMATION:
- Batch number
- Manufacturing date
- Expiry date
- Pack size/quantity
- Any warnings or instructions

FORMATTING:
- Provide extracted text in a clear, organized format
- Separate different types of information
- Include exact spelling as shown on packaging
- Note if text is unclear or partially visible

Please extract ALL visible text accurately, paying special attention to medicine names, dosages, and manufacturer details.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${file.type};base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("❌ OCR API: OpenAI API error:", errorData)

      if (response.status === 400) {
        throw new Error("Invalid image format. Please upload a clear JPG or PNG image.")
      } else if (response.status === 429) {
        throw new Error("Service temporarily busy. Please try again in a moment.")
      } else if (response.status === 401) {
        throw new Error("Authentication error. Please contact support.")
      } else {
        throw new Error(`OCR service error: ${errorData.error?.message || "Unknown error"}`)
      }
    }

    const data = await response.json()
    const extractedText = data.choices[0]?.message?.content || "No text could be extracted from the image."

    console.log("✅ OCR API: Text extraction successful!")
    console.log("📝 OCR API: Extracted text length:", extractedText.length)
    console.log("📝 OCR API: Extracted text preview:", extractedText.substring(0, 200) + "...")

    return NextResponse.json({
      success: true,
      extractedText,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      textLength: extractedText.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ OCR API: Processing error:", error)
    return NextResponse.json(
      {
        error: "Failed to process image for text extraction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
