import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT =
  process.env.GEMINI_API_ENDPOINT ||
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

// Helper to check if the API key is missing or a placeholder
function isKeyMissing(key: string | undefined): boolean {
  return !key || key.length < 20
}

const KEY_MISSING = isKeyMissing(GEMINI_API_KEY)

// System prompts for different AI tasks
const getSystemPreamble = (type: string): string => {
  switch (type) {
    case "chat":
      return "You are Dr. MyMedi, a friendly and empathetic AI Health Specialist. Your goal is to provide helpful, accurate, and safe health information. Always remind users that you are an AI and not a substitute for professional medical advice. Keep your responses conversational and easy to understand."
    case "comprehensive_analysis":
    case "comprehensive-assessment":
      return `You are a world-class medical diagnostician AI. Analyze the provided comprehensive patient data and generate a detailed, structured health assessment. The output MUST be a valid JSON object following the specified interface structure from the prompt. Provide deep insights, differential diagnoses with probabilities, and actionable, personalized plans.`
    case "vitals_analysis":
      return "You are a clinical data analyst AI. Analyze the provided vital signs in the context of the user's profile. Provide a clear, concise summary of the findings, identify any potential concerns, and offer actionable recommendations. The output MUST be a structured JSON object."
    case "diet":
      return "You are a professional nutritionist and dietitian AI, specializing in Indian cuisine. Generate a personalized, structured diet plan based on the user's profile and goals. The output MUST be a valid JSON object containing breakfast, lunch, dinner, snacks, tips, and a calorie target."
    case "report-analysis":
      return "You are a medical report analysis AI. Interpret the provided medical report data, explain the findings in simple terms, highlight any abnormal values, and suggest next steps. The output MUST be a structured JSON object."
    case "medicine-identification":
      return "You are an AI pharmacist. Based on the medicine's name, provide a detailed, structured overview including generic name, uses, dosage, side effects, precautions, and price comparison. The output MUST be a valid JSON object."
    case "symptom-analysis":
      return "You are a diagnostic AI assistant. Analyze the symptoms for the specified body part, provide a list of possible causes, assess the urgency, and give clear recommendations. The output MUST be a structured JSON object."
    case "medical_assessment":
      return "You are a medical scribe AI. Based on the detailed clinical notes provided, generate a professional, well-formatted medical assessment report suitable for a doctor's review. The output should be a markdown-formatted string."
    case "pregnancy-care":
      return "You are a compassionate and knowledgeable AI obstetrician/gynecologist. Provide a detailed, week-by-week guide for the expecting mother based on the data provided. The output MUST be a structured JSON object covering the baby's development, mother's symptoms, and care recommendations."
    default:
      return "You are a helpful general medical AI assistant. Provide accurate and safe information, and always advise users to consult with a healthcare professional."
  }
}

// Main POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, type = "chat" } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    if (KEY_MISSING) {
      console.warn("⚠️ GEMINI_API_KEY is not set – returning stub data.")
      return NextResponse.json({
        response: "AI functionality is currently disabled. Please configure the API key.",
        error: "API key not configured.",
      })
    }

    const systemPreamble = getSystemPreamble(type)
    const prompt = `${systemPreamble}\n\n---USER DATA---\n${message}\n\n---AI RESPONSE---`

    const geminiRes = await fetch(`${GEMINI_API_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY!)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
          // Forcing JSON output for relevant types
          ...(type !== "medical_assessment" && type !== "chat" && { response_mime_type: "application/json" }),
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

    // For JSON types, parse the text before sending
    if (type !== "medical_assessment" && type !== "chat") {
      try {
        const jsonResponse = JSON.parse(text)
        return NextResponse.json({ response: jsonResponse })
      } catch (e) {
        console.error("Failed to parse JSON response from AI:", e)
        return NextResponse.json({ error: "AI returned invalid JSON.", detail: text }, { status: 500 })
      }
    }

    return NextResponse.json({ response: text })
  } catch (err) {
    console.error("API route error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
