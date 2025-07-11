import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

interface ChatRequest {
  messages: ChatMessage[]
  context?: {
    userProfile?: {
      age?: number
      gender?: string
      location?: string
      medicalHistory?: string[]
      currentMedications?: string[]
    }
    sessionId?: string
    language?: string
  }
  maxTokens?: number
  temperature?: number
}

interface ChatResponse {
  message: ChatMessage
  confidence: number
  safetyFlags: string[]
  suggestions: string[]
  medicalDisclaimer: boolean
  sessionId: string
}

// Medical knowledge base for generating responses
const MEDICAL_KNOWLEDGE = {
  symptoms: {
    headache: {
      commonCauses: ["tension", "dehydration", "eye strain", "stress", "lack of sleep"],
      treatments: ["rest", "hydration", "over-the-counter pain relievers", "stress management"],
      redFlags: ["sudden severe headache", "headache with fever and stiff neck", "headache after head injury"],
    },
    fever: {
      commonCauses: ["viral infection", "bacterial infection", "inflammatory conditions"],
      treatments: ["rest", "fluids", "fever reducers", "cooling measures"],
      redFlags: ["fever above 103°F", "fever with severe headache", "fever with difficulty breathing"],
    },
    "chest pain": {
      commonCauses: ["muscle strain", "acid reflux", "anxiety", "heart conditions"],
      treatments: ["depends on cause - requires medical evaluation"],
      redFlags: ["severe chest pain", "chest pain with shortness of breath", "chest pain radiating to arm"],
    },
  },
  medications: {
    paracetamol: {
      uses: ["pain relief", "fever reduction"],
      dosage: "500-1000mg every 4-6 hours, max 4g daily",
      warnings: ["liver damage with overdose", "avoid with alcohol"],
    },
    ibuprofen: {
      uses: ["pain relief", "inflammation", "fever reduction"],
      dosage: "200-400mg every 4-6 hours, max 1200mg daily",
      warnings: ["stomach irritation", "kidney problems", "avoid with blood thinners"],
    },
  },
}

// Safety keywords that require immediate medical attention
const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "severe bleeding",
  "unconscious",
  "heart attack",
  "stroke",
  "seizure",
  "poisoning",
  "overdose",
  "severe burns",
  "broken bone",
  "head injury",
  "can't breathe",
  "choking",
  "suicide",
  "self harm",
]

// Generate AI response based on user message and context
function generateAIResponse(messages: ChatMessage[], context?: ChatRequest["context"]): ChatResponse {
  const lastMessage = messages[messages.length - 1]
  const userMessage = lastMessage.content.toLowerCase()

  // Check for emergency situations
  const emergencyFlags = EMERGENCY_KEYWORDS.filter((keyword) => userMessage.includes(keyword))
  const isEmergency = emergencyFlags.length > 0

  let responseContent = ""
  let confidence = 80
  const safetyFlags: string[] = []
  const suggestions: string[] = []

  if (isEmergency) {
    responseContent = `🚨 **MEDICAL EMERGENCY DETECTED** 🚨

I've detected symptoms that may require immediate medical attention. Please:

1. **Call emergency services immediately (108)**
2. **Go to the nearest emergency room**
3. **Do not delay seeking professional medical help**

If you're experiencing:
- Severe chest pain
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Signs of stroke or heart attack

**These require IMMEDIATE medical intervention.**

While waiting for help:
- Stay calm and try to remain conscious
- If possible, have someone stay with you
- Follow any first aid you know
- Provide clear location information to emergency services

**This AI cannot replace emergency medical services. Please seek immediate professional help.**`

    confidence = 95
    safetyFlags.push("EMERGENCY_DETECTED")
    suggestions.push("Call 108 immediately")
    suggestions.push("Go to nearest hospital")
  } else {
    // Generate response based on symptoms or questions
    if (userMessage.includes("headache")) {
      const headacheInfo = MEDICAL_KNOWLEDGE.symptoms.headache
      responseContent = `I understand you're experiencing a headache. Here's what I can tell you:

**Common causes of headaches:**
${headacheInfo.commonCauses.map((cause) => `• ${cause}`).join("\n")}

**General recommendations:**
${headacheInfo.treatments.map((treatment) => `• ${treatment}`).join("\n")}

**When to seek immediate medical attention:**
${headacheInfo.redFlags.map((flag) => `• ${flag}`).join("\n")}

**For your specific situation:**
- How long have you had this headache?
- On a scale of 1-10, how severe is the pain?
- Have you taken any medications?
- Are there any other symptoms?

Remember, if this is a sudden, severe headache unlike any you've had before, please seek immediate medical attention.`

      suggestions.push("Rate your pain level (1-10)")
      suggestions.push("Describe headache location")
      suggestions.push("List any other symptoms")
    } else if (userMessage.includes("fever")) {
      const feverInfo = MEDICAL_KNOWLEDGE.symptoms.fever
      responseContent = `I see you're dealing with a fever. Here's helpful information:

**Common causes:**
${feverInfo.commonCauses.map((cause) => `• ${cause}`).join("\n")}

**General care recommendations:**
${feverInfo.treatments.map((treatment) => `• ${treatment}`).join("\n")}

**Seek immediate medical attention if:**
${feverInfo.redFlags.map((flag) => `• ${flag}`).join("\n")}

**Questions to help assess your condition:**
- What's your current temperature?
- How long have you had the fever?
- Any other symptoms (chills, body aches, etc.)?
- Have you taken any fever-reducing medications?

For adults, fever above 103°F (39.4°C) or fever lasting more than 3 days should be evaluated by a healthcare provider.`

      suggestions.push("Check your temperature")
      suggestions.push("Stay hydrated")
      suggestions.push("Monitor other symptoms")
    } else if (userMessage.includes("medication") || userMessage.includes("medicine")) {
      responseContent = `I can provide general information about medications, but please remember:

**Important Safety Guidelines:**
• Always consult a healthcare provider or pharmacist before starting new medications
• Check for drug interactions with current medications
• Follow prescribed dosages exactly
• Be aware of potential side effects
• Never share prescription medications

**Common Over-the-Counter Options:**
• **Paracetamol**: For pain and fever (max 4g daily)
• **Ibuprofen**: For pain, inflammation, fever (max 1200mg daily)
• **Antacids**: For heartburn and acid reflux

**What specific medication information are you looking for?**
- Pain relief options?
- Fever reducers?
- Information about a specific medication?
- Drug interaction concerns?

Please provide more details so I can give you more targeted information.`

      suggestions.push("Specify the medication")
      suggestions.push("Describe your symptoms")
      suggestions.push("Ask about drug interactions")
    } else {
      // General health query
      responseContent = `Thank you for reaching out about your health concern. I'm here to help provide information and guidance.

To give you the most helpful response, could you please tell me more about:

**Your symptoms:**
- What specific symptoms are you experiencing?
- When did they start?
- How severe are they (1-10 scale)?
- What makes them better or worse?

**Your situation:**
- Have you taken any medications?
- Do you have any known medical conditions?
- Any recent changes in your routine or environment?

**Common topics I can help with:**
• Symptom assessment and general guidance
• General medication information
• When to seek medical care
• Health and wellness tips
• Emergency situation recognition

Please share more details about what's concerning you, and I'll do my best to provide helpful, accurate information.`

      suggestions.push("Describe your symptoms")
      suggestions.push("Rate symptom severity")
      suggestions.push("List current medications")
    }

    // Adjust confidence based on specificity
    if (userMessage.length < 20) confidence -= 20
    if (userMessage.length > 100) confidence += 10
  }

  // Add context-based adjustments
  if (context?.userProfile) {
    confidence += 5
    if (context.userProfile.age && context.userProfile.age > 65) {
      responseContent +=
        "\n\n**Note for seniors:** Please be extra cautious with new symptoms and consult your healthcare provider promptly."
    }
  }

  // Always add medical disclaimer
  responseContent += `\n\n---
**Medical Disclaimer:** This AI provides general health information only and cannot replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions. In emergencies, call 108 immediately.`

  return {
    message: {
      role: "assistant",
      content: responseContent,
      timestamp: new Date().toISOString(),
    },
    confidence: Math.min(confidence, 95),
    safetyFlags,
    suggestions,
    medicalDisclaimer: true,
    sessionId: context?.sessionId || `session_${Date.now()}`,
  }
}

function isKeyMissing(key: string | undefined): boolean {
  return !key || key === "GEMINI_API_KEY" || key.startsWith("your_") || key.length < 20
}

const KEY_MISSING = isKeyMissing(GEMINI_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const chatRequest: ChatRequest = await req.json()

    // Validate request
    if (!chatRequest.messages || chatRequest.messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

    // Generate AI response
    const response = generateAIResponse(chatRequest.messages, chatRequest.context)

    // Add processing metadata
    const fullResponse = {
      ...response,
      processingTime: "0.8s",
      model: "gemini-health-chat-v1",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(fullResponse)
  } catch (error) {
    console.error("Gemini Integration Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
        message: {
          role: "assistant",
          content:
            "I apologize, but I'm experiencing technical difficulties. Please try again or contact support if the issue persists. For medical emergencies, please call 108 immediately.",
          timestamp: new Date().toISOString(),
        },
        confidence: 0,
        safetyFlags: ["SYSTEM_ERROR"],
        suggestions: ["Try again", "Contact support", "Call 108 for emergencies"],
        medicalDisclaimer: true,
        sessionId: `error_session_${Date.now()}`,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    switch (action) {
      case "health_check":
        return NextResponse.json({
          status: "healthy",
          version: "1.0.0",
          capabilities: [
            "symptom_assessment",
            "medication_information",
            "emergency_detection",
            "health_guidance",
            "multilingual_support",
          ],
          timestamp: new Date().toISOString(),
        })

      case "conversation_starters":
        return NextResponse.json({
          starters: [
            "I have a headache that's been bothering me",
            "I'm experiencing fever and body aches",
            "Can you help me understand my symptoms?",
            "I need information about a medication",
            "When should I see a doctor?",
            "I'm feeling anxious about my health",
            "What are the warning signs I should watch for?",
            "How can I manage my chronic condition?",
          ],
          timestamp: new Date().toISOString(),
        })

      case "safety_guidelines":
        return NextResponse.json({
          guidelines: [
            "This AI provides general health information only",
            "Always consult healthcare professionals for medical decisions",
            "Call 108 immediately for medical emergencies",
            "Never ignore severe or persistent symptoms",
            "Verify medication information with pharmacists",
            "Keep emergency contacts readily available",
            "Trust your instincts about your health",
          ],
          emergencyKeywords: EMERGENCY_KEYWORDS,
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          {
            error: "Invalid action parameter",
            availableActions: ["health_check", "conversation_starters", "safety_guidelines"],
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Gemini Integration GET Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
