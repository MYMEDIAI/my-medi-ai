import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { symptoms, age, gender, type, medicalHistory, duration, severity } = await request.json()

    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 })
    }

    let systemPrompt = ""
    let userPrompt = ""

    switch (type) {
      case "symptom_suggestions":
        systemPrompt = `You are a medical AI assistant specialized in symptom analysis for Indian patients. 
        Your role is to suggest related symptoms based on user input. Consider common conditions in India like dengue, malaria, diabetes, hypertension, gastritis, and respiratory infections.
        
        Respond with a JSON array of suggested symptoms. Each suggestion should include:
        - symptom: the symptom name
        - category: medical category (respiratory, gastrointestinal, neurological, etc.)
        - commonality: how common this symptom is (common/moderate/rare)
        - urgency: urgency level (routine/urgent/emergency)
        
        Example format: [{"symptom": "fever", "category": "general", "commonality": "common", "urgency": "routine"}]`

        userPrompt = `User is typing: "${symptoms}". Suggest 8-10 related symptoms that commonly occur with or are similar to what they're describing. Focus on symptoms relevant to Indian healthcare context.`
        break

      case "related_symptoms":
        systemPrompt = `You are a medical AI assistant for Indian patients. When given a primary symptom, suggest related symptoms that commonly occur together. Consider Indian disease patterns and climate-related conditions.
        
        Respond with a JSON array of related symptoms that often accompany the primary symptom.`

        userPrompt = `Primary symptom: "${symptoms[0]}". What are 6-8 symptoms that commonly occur together with this? Consider conditions common in India.`
        break

      case "comprehensive_analysis":
        systemPrompt = `You are Dr. MyMedi, an expert medical AI assistant specializing in Indian healthcare. You have extensive knowledge of:
        - Common diseases in India (dengue, malaria, typhoid, diabetes, hypertension, gastritis)
        - Indian healthcare system and accessible treatments
        - Climate-related health issues in India
        - Cultural and dietary factors affecting health in India
        
        Provide comprehensive medical analysis in JSON format with these exact fields:
        {
          "primaryAnalysis": {
            "mostLikelyConditions": [
              {
                "condition": "condition name",
                "confidence": 85,
                "reasoning": "detailed explanation",
                "commonInIndia": true/false,
                "prevalence": "percentage in Indian population"
              }
            ],
            "severityAssessment": "mild/moderate/severe",
            "urgencyLevel": "routine/urgent/emergency",
            "overallRiskScore": 1-10
          },
          "symptomAnalysis": {
            "patternRecognition": "explanation of symptom pattern",
            "redFlags": ["list of concerning symptoms"],
            "missingSymptoms": ["symptoms to watch for"],
            "progressionPattern": "how symptoms typically develop"
          },
          "indianHealthcareContext": {
            "commonCauses": ["causes specific to Indian context"],
            "seasonalFactors": "monsoon/summer/winter related factors",
            "dietaryFactors": ["Indian diet-related considerations"],
            "environmentalFactors": ["pollution, water quality, etc."]
          },
          "recommendations": {
            "immediate": ["immediate actions to take"],
            "shortTerm": ["actions for next 24-48 hours"],
            "longTerm": ["ongoing management"],
            "whenToSeekHelp": "specific criteria for medical consultation"
          },
          "emergencyFlags": {
            "isEmergency": true/false,
            "emergencyReasons": ["why this needs immediate attention"],
            "emergencyActions": ["what to do immediately"]
          },
          "culturalConsiderations": {
            "homeRemedies": ["safe traditional remedies"],
            "dietaryAdvice": ["Indian food recommendations"],
            "lifestyleFactors": ["relevant to Indian lifestyle"]
          }
        }`

        userPrompt = `Patient Profile:
        - Age: ${age || "Not specified"}
        - Gender: ${gender || "Not specified"}
        - Primary Symptoms: ${symptoms.join(", ")}
        - Duration: ${duration || "Not specified"}
        - Severity (1-10): ${severity || "Not specified"}
        - Medical History: ${medicalHistory?.join(", ") || "None specified"}
        
        Provide comprehensive medical analysis considering Indian healthcare context, common diseases in India, and cultural factors. Be thorough but emphasize when professional medical consultation is needed.`
        break

      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    console.log(`🤖 AI Symptom Analyzer - Type: ${type}`)
    console.log(`📝 Processing symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms}`)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: type === "comprehensive_analysis" ? 3000 : 1000,
      temperature: 0.3, // Lower temperature for more consistent medical advice
      mode: "json",
    })

    console.log(`✅ AI Analysis completed for type: ${type}`)

    // Try to parse JSON response for structured data
    let parsedResponse
    try {
      parsedResponse = JSON.parse(text)
    } catch (e) {
      // If not JSON, return as text
      console.error("AI_JSONParseError", e)
      parsedResponse = { analysis: text }
    }

    return NextResponse.json({
      success: true,
      type,
      data: parsedResponse,
      timestamp: new Date().toISOString(),
      model: "gpt-4o",
    })
  } catch (error) {
    console.error("❌ AI Symptom Analyzer error:", error)

    return NextResponse.json(
      {
        error: "AI analysis temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "ai-error",
      },
      { status: 500 },
    )
  }
}
