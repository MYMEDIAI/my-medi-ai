import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

function isKeyMissing(key: string | undefined): boolean {
  return !key || !key.startsWith("sk-") || key.length < 20
}

const NO_API_KEY = isKeyMissing(OPENAI_API_KEY)

function extractPrompt(body: Record<string, unknown>): {
  prompt: string
  mode: "chat" | "assessment" | "report-analysis" | "medicine-identification" | "symptom-analysis"
} {
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return { prompt: body.prompt.trim(), mode: "chat" }
  }

  if (typeof body.message === "string") {
    let mode: "chat" | "assessment" | "report-analysis" | "medicine-identification" | "symptom-analysis" = "chat"

    if (body.type === "assessment") mode = "assessment"
    else if (body.type === "report-analysis") mode = "report-analysis"
    else if (body.type === "medicine-identification") mode = "medicine-identification"
    else if (body.type === "symptom-analysis") mode = "symptom-analysis"

    return { prompt: body.message.trim(), mode }
  }

  return { prompt: JSON.stringify(body), mode: "chat" }
}

async function callOpenAI(
  prompt: string,
  mode: "chat" | "assessment" | "report-analysis" | "medicine-identification" | "symptom-analysis",
) {
  let systemMessage = ""

  switch (mode) {
    case "medicine-identification":
      systemMessage = `You are an expert AI pharmacist and medicine specialist with comprehensive knowledge of Indian pharmaceutical market. 

Your task is to analyze medicine information and provide accurate, detailed, and helpful information about medicines, health conditions, and medical advice. 

For medicine identification requests, you MUST provide structured information in the EXACT format requested by the user. Pay special attention to:

1. **Accurate Medicine Names** - Use exact brand and generic names
2. **Proper Dosage Information** - Include specific mg, IU, or other measurements
3. **Indian Market Context** - Provide realistic Indian pricing and manufacturer information
4. **Safety Information** - Include comprehensive side effects, interactions, and precautions
5. **Practical Guidance** - Offer actionable advice for Indian patients

Always provide practical, safe, and India-specific pharmaceutical guidance. When analyzing extracted text from medicine images, use that text as the primary source of information.

IMPORTANT: Always follow the exact format requested in the user's prompt for consistency and proper parsing.`
      break

    case "assessment":
      systemMessage = `You are a revolutionary AI medical assistant with cutting-edge capabilities. Provide comprehensive health assessments based on user input.`
      break

    case "report-analysis":
      systemMessage = `You are an expert AI medical report analyzer. Provide detailed analysis of medical test results and reports.`
      break

    case "symptom-analysis":
      systemMessage = `You are an expert AI diagnostic assistant specializing in symptom analysis and clinical assessment.`
      break

    default:
      systemMessage = `You are a helpful AI medical assistant. Provide clear, accurate health information with appropriate medical disclaimers.`
  }

  console.log("🤖 AI API: Calling OpenAI with mode:", mode)

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
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ AI API: OpenAI API error:", errorText)
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const aiResponse = data.choices?.[0]?.message?.content || "No response generated."

  console.log("✅ AI API: Response generated successfully")
  console.log("📝 AI API: Response length:", aiResponse.length)

  return aiResponse
}

async function parseBody(req: NextRequest): Promise<Record<string, any>> {
  const contentType = req.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    try {
      return await req.json()
    } catch {
      return {}
    }
  }

  try {
    const form = await req.formData()
    const obj: Record<string, any> = {}
    form.forEach((value, key) => {
      if (typeof value === "string") obj[key] = value
    })
    return obj
  } catch {
    return {}
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 AI API: Starting request processing...")

    const body = await parseBody(req)
    const { prompt, mode } = extractPrompt(body)

    console.log("📝 AI API: Extracted prompt length:", prompt.length)
    console.log("🎯 AI API: Mode:", mode)

    if (!prompt) {
      console.error("❌ AI API: No prompt provided")
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    if (NO_API_KEY) {
      console.warn("⚠️ AI API: No OpenAI API key found – returning stub data")

      const stub =
        mode === "medicine-identification"
          ? "**MEDICINE IDENTIFICATION:**\nBrand Name: Sample Medicine\nGeneric Name: Generic Equivalent\nStrength: 500mg\nManufacturer: Sample Pharma\n\n**MEDICAL USES:**\nSample medical uses for demonstration\n\n**DOSAGE INFORMATION:**\nSample dosage instructions\n\n**SIDE EFFECTS:**\n- Sample side effect 1\n- Sample side effect 2\n\n**DRUG INTERACTIONS:**\n- Sample interaction 1\n- Sample interaction 2\n\n**PRECAUTIONS:**\n- Sample precaution 1\n- Sample precaution 2\n\n**INDIAN MARKET PRICING:**\nBrand Price: ₹30\nGeneric Price: ₹12"
          : "I'm a medical AI assistant. Please add your OpenAI API key to enable full AI capabilities."

      return NextResponse.json({
        response: stub,
        provider: "stub",
        message: "Using demo data. Add OPENAI_API_KEY for live AI responses.",
      })
    }

    const aiResponse = await callOpenAI(prompt, mode)

    console.log("✅ AI API: Request completed successfully")

    return NextResponse.json({
      response: aiResponse,
      type: body.type || "general",
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error("❌ AI API: Request failed:", err)
    return NextResponse.json(
      {
        error: "AI service temporarily unavailable",
        provider: "openai",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
