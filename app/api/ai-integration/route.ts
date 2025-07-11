import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, type } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Enhanced system prompts based on type
    const systemPrompts = {
      "health-chat": `You are Dr. MyMedi, an expert AI health assistant specializing in Indian healthcare. 
      Provide comprehensive, evidence-based medical guidance while emphasizing the importance of professional medical consultation.
      Always consider Indian healthcare context, common conditions, and accessible treatments.`,

      "vitals-analysis": `You are a medical AI specializing in vital signs analysis and health monitoring.
      Analyze the provided vital signs data and provide detailed health insights, risk assessments, and recommendations.
      Consider normal ranges for Indian population and provide actionable health advice.`,

      "diet-planning": `You are a certified nutritionist AI specializing in Indian dietary patterns and nutrition.
      Create personalized, culturally appropriate meal plans considering Indian food preferences, regional availability, and health goals.
      Include specific Indian foods, cooking methods, and practical meal preparation advice.`,

      "symptom-analysis": `You are a diagnostic AI assistant specializing in symptom analysis and health assessment.
      Provide comprehensive symptom evaluation, possible causes, urgency assessment, and clear guidance on when to seek medical care.
      Consider common conditions in Indian healthcare context.`,

      "report-analysis": `You are a medical report analysis AI specializing in interpreting lab results and diagnostic reports.
      Provide detailed analysis of medical reports, explain values in simple terms, identify abnormalities, and suggest follow-up actions.
      Use Indian population reference ranges and consider common health conditions in India.`,

      "medicine-identification": `You are a pharmaceutical AI expert specializing in medicine identification and drug information.
      Provide comprehensive medicine information including uses, dosage, side effects, interactions, and pricing in Indian market.
      Emphasize safety, proper usage, and the importance of consulting healthcare providers.`,

      "pregnancy-care": `You are a maternal health AI specialist providing pregnancy care guidance.
      Offer week-by-week pregnancy information, symptom management, nutrition advice, and prenatal care recommendations.
      Consider Indian maternal health practices and accessible prenatal care options.`,

      "health-assessment": `You are a comprehensive health assessment AI providing detailed health evaluations.
      Analyze health information, assess risk factors, provide health scores, and create personalized health improvement plans.
      Consider Indian lifestyle factors, common health issues, and preventive care strategies.`,

      default: `You are Dr. MyMedi, a helpful AI health assistant. Provide accurate, helpful medical information while always recommending consultation with healthcare professionals for serious concerns.`,
    }

    const systemPrompt = systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.default

    console.log(`🤖 AI Integration - Type: ${type}`)
    console.log(`📝 Message length: ${message.length} characters`)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 2000,
      temperature: 0.7,
    })

    console.log(`✅ AI Response generated successfully`)
    console.log(`📤 Response length: ${text.length} characters`)

    return NextResponse.json({
      response: text,
      type: type,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ AI Integration error:", error)

    return NextResponse.json(
      {
        error: "AI service temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "ai-error",
      },
      { status: 500 },
    )
  }
}
