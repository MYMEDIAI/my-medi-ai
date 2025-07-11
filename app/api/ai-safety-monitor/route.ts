import { type NextRequest, NextResponse } from "next/server"

interface SafetyAssessmentRequest {
  aiResponse: string
  userInput: string
  context: string
  responseType: "diagnosis" | "medication" | "lifestyle" | "emergency" | "general"
  userProfile?: {
    age: number
    gender: string
    medicalHistory: string[]
    currentMedications: string[]
  }
}

interface SafetyAssessmentResponse {
  confidenceScore: number
  safetyLevel: "safe" | "caution" | "review_required" | "emergency"
  emergencyFlags: string[]
  disclaimerRequired: boolean
  humanReviewRequired: boolean
  safetyRecommendations: string[]
  accuracyIndicators: {
    dataQuality: number
    symptomClarity: number
    medicalComplexity: number
    riskLevel: number
  }
  emergencyProtocol?: {
    isEmergency: boolean
    emergencyType: string
    immediateActions: string[]
    emergencyContacts: string[]
  }
}

// Emergency keywords that require immediate attention
const EMERGENCY_KEYWORDS = [
  // Cardiovascular emergencies
  "chest pain",
  "heart attack",
  "cardiac arrest",
  "severe chest pressure",
  "crushing chest pain",
  "radiating arm pain",
  "jaw pain with chest discomfort",

  // Respiratory emergencies
  "difficulty breathing",
  "shortness of breath",
  "can't breathe",
  "choking",
  "severe asthma attack",
  "blue lips",
  "gasping for air",

  // Neurological emergencies
  "stroke",
  "sudden weakness",
  "facial drooping",
  "slurred speech",
  "severe headache",
  "sudden confusion",
  "loss of consciousness",
  "seizure",

  // Trauma and bleeding
  "severe bleeding",
  "heavy bleeding",
  "uncontrolled bleeding",
  "deep cut",
  "head injury",
  "severe burns",
  "broken bone",
  "severe pain",

  // Poisoning and overdose
  "poisoning",
  "overdose",
  "swallowed poison",
  "drug overdose",
  "severe allergic reaction",
  "anaphylaxis",
  "swelling throat",

  // Other critical conditions
  "severe abdominal pain",
  "vomiting blood",
  "blood in stool",
  "high fever with stiff neck",
  "severe dehydration",
  "diabetic emergency",
]

// Critical symptom combinations
const CRITICAL_COMBINATIONS = [
  ["chest pain", "shortness of breath"],
  ["chest pain", "sweating", "nausea"],
  ["severe headache", "vision changes"],
  ["fever", "neck stiffness"],
  ["abdominal pain", "vomiting blood"],
  ["difficulty breathing", "chest tightness"],
  ["sudden weakness", "speech problems"],
  ["severe allergic reaction", "difficulty breathing"],
]

// High-risk medical conditions
const HIGH_RISK_CONDITIONS = [
  "diabetes",
  "heart disease",
  "hypertension",
  "kidney disease",
  "liver disease",
  "cancer",
  "immunocompromised",
  "pregnancy complications",
]

function assessConfidenceScore(request: SafetyAssessmentRequest): number {
  let confidence = 50 // Base confidence

  // Data quality assessment
  const inputLength = request.userInput.length
  if (inputLength > 100) confidence += 15
  else if (inputLength > 50) confidence += 10
  else if (inputLength < 20) confidence -= 15

  // Symptom clarity
  const symptomKeywords = ["pain", "fever", "headache", "nausea", "dizzy", "tired", "cough"]
  const mentionedSymptoms = symptomKeywords.filter((keyword) =>
    request.userInput.toLowerCase().includes(keyword),
  ).length

  if (mentionedSymptoms >= 3) confidence += 10
  else if (mentionedSymptoms >= 2) confidence += 5
  else if (mentionedSymptoms === 0) confidence -= 10

  // Medical history availability
  if (request.userProfile?.medicalHistory && request.userProfile.medicalHistory.length > 0) {
    confidence += 10
  }

  // Age factor (more data usually available for adults)
  if (request.userProfile?.age) {
    if (request.userProfile.age >= 18 && request.userProfile.age <= 65) confidence += 5
    else confidence -= 5 // Children and elderly need more careful assessment
  }

  // Response type complexity
  switch (request.responseType) {
    case "emergency":
      confidence += 20 // Emergency detection is usually clear
      break
    case "diagnosis":
      confidence -= 10 // Diagnosis requires high certainty
      break
    case "medication":
      confidence -= 5 // Medication recommendations need caution
      break
    case "lifestyle":
      confidence += 10 // Lifestyle advice is generally safer
      break
  }

  // Ensure confidence stays within bounds
  return Math.max(10, Math.min(95, confidence))
}

function detectEmergencyConditions(
  userInput: string,
  userProfile?: any,
): {
  isEmergency: boolean
  emergencyType: string
  emergencyFlags: string[]
  immediateActions: string[]
} {
  const input = userInput.toLowerCase()
  const emergencyFlags: string[] = []
  let emergencyType = ""
  const immediateActions: string[] = []

  // Check for emergency keywords
  const detectedEmergencies = EMERGENCY_KEYWORDS.filter((keyword) => input.includes(keyword.toLowerCase()))

  if (detectedEmergencies.length > 0) {
    emergencyFlags.push(...detectedEmergencies)
  }

  // Check for critical combinations
  const criticalCombination = CRITICAL_COMBINATIONS.find((combination) =>
    combination.every((symptom) => input.includes(symptom.toLowerCase())),
  )

  if (criticalCombination) {
    emergencyFlags.push(`Critical combination: ${criticalCombination.join(" + ")}`)
  }

  // Determine emergency type and actions
  if (input.includes("chest pain") || input.includes("heart attack")) {
    emergencyType = "Cardiac Emergency"
    immediateActions.push(
      "Call emergency services immediately (108)",
      "Have patient sit upright and stay calm",
      "Give aspirin if not allergic and no bleeding risk",
      "Monitor breathing and pulse",
      "Do not leave patient alone",
    )
  } else if (input.includes("difficulty breathing") || input.includes("can't breathe")) {
    emergencyType = "Respiratory Emergency"
    immediateActions.push(
      "Call emergency services immediately (108)",
      "Keep patient upright",
      "Loosen tight clothing",
      "Ensure clear airway",
      "Use rescue inhaler if available",
    )
  } else if (input.includes("stroke") || input.includes("sudden weakness")) {
    emergencyType = "Neurological Emergency"
    immediateActions.push(
      "Call emergency services immediately (108)",
      "Note time of symptom onset",
      "Keep patient calm and still",
      "Do not give food or water",
      "Monitor vital signs",
    )
  } else if (input.includes("severe bleeding") || input.includes("heavy bleeding")) {
    emergencyType = "Trauma/Bleeding Emergency"
    immediateActions.push(
      "Call emergency services immediately (108)",
      "Apply direct pressure to wound",
      "Elevate injured area if possible",
      "Do not remove embedded objects",
      "Monitor for shock",
    )
  } else if (emergencyFlags.length > 0) {
    emergencyType = "Medical Emergency"
    immediateActions.push(
      "Call emergency services immediately (108)",
      "Stay with patient",
      "Monitor vital signs",
      "Follow emergency operator instructions",
    )
  }

  return {
    isEmergency: emergencyFlags.length > 0 || criticalCombination !== undefined,
    emergencyType,
    emergencyFlags,
    immediateActions,
  }
}

function assessSafetyLevel(
  confidenceScore: number,
  emergencyDetected: boolean,
  responseType: string,
  userProfile?: any,
): "safe" | "caution" | "review_required" | "emergency" {
  if (emergencyDetected) return "emergency"

  if (confidenceScore < 30) return "review_required"

  if (responseType === "diagnosis" && confidenceScore < 70) return "review_required"
  if (responseType === "medication" && confidenceScore < 60) return "caution"

  // High-risk patients need more caution
  if (userProfile?.medicalHistory) {
    const hasHighRiskCondition = HIGH_RISK_CONDITIONS.some((condition) =>
      userProfile.medicalHistory.some((history: string) => history.toLowerCase().includes(condition.toLowerCase())),
    )
    if (hasHighRiskCondition && confidenceScore < 80) return "caution"
  }

  if (confidenceScore < 50) return "caution"

  return "safe"
}

function generateSafetyRecommendations(safetyLevel: string, confidenceScore: number, responseType: string): string[] {
  const recommendations: string[] = []

  switch (safetyLevel) {
    case "emergency":
      recommendations.push(
        "🚨 EMERGENCY: Seek immediate medical attention",
        "Call emergency services (108) without delay",
        "Do not rely on AI recommendations for emergency care",
        "Follow emergency protocols provided",
      )
      break

    case "review_required":
      recommendations.push(
        "⚠️ Human medical review strongly recommended",
        "AI confidence is low for this assessment",
        "Consult healthcare professional within 24 hours",
        "Do not make medical decisions based solely on AI",
      )
      break

    case "caution":
      recommendations.push(
        "⚡ Use AI recommendations with caution",
        "Consider consulting healthcare professional",
        "Monitor symptoms closely",
        "Seek medical help if symptoms worsen",
      )
      break

    case "safe":
      recommendations.push(
        "✅ AI recommendations appear reliable",
        "Still recommended to consult healthcare professional",
        "Monitor your condition regularly",
        "Seek help if symptoms change or worsen",
      )
      break
  }

  // Response type specific recommendations
  if (responseType === "medication") {
    recommendations.push(
      "💊 Verify all medications with pharmacist or doctor",
      "Check for drug interactions and allergies",
      "Follow prescribed dosages exactly",
    )
  }

  if (responseType === "diagnosis") {
    recommendations.push(
      "🔍 AI cannot provide definitive medical diagnosis",
      "Professional medical examination required",
      "Consider multiple medical opinions for complex cases",
    )
  }

  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const safetyRequest: SafetyAssessmentRequest = await request.json()

    // Assess confidence score
    const confidenceScore = assessConfidenceScore(safetyRequest)

    // Detect emergency conditions
    const emergencyAssessment = detectEmergencyConditions(safetyRequest.userInput, safetyRequest.userProfile)

    // Assess overall safety level
    const safetyLevel = assessSafetyLevel(
      confidenceScore,
      emergencyAssessment.isEmergency,
      safetyRequest.responseType,
      safetyRequest.userProfile,
    )

    // Generate safety recommendations
    const safetyRecommendations = generateSafetyRecommendations(
      safetyLevel,
      confidenceScore,
      safetyRequest.responseType,
    )

    // Calculate accuracy indicators
    const accuracyIndicators = {
      dataQuality: Math.min(100, Math.max(0, (safetyRequest.userInput.length / 200) * 100)),
      symptomClarity: Math.min(100, (safetyRequest.userInput.split(" ").length / 20) * 100),
      medicalComplexity: safetyRequest.userProfile?.medicalHistory?.length
        ? Math.min(100, safetyRequest.userProfile.medicalHistory.length * 20)
        : 50,
      riskLevel: emergencyAssessment.isEmergency
        ? 100
        : safetyLevel === "review_required"
          ? 80
          : safetyLevel === "caution"
            ? 60
            : 30,
    }

    const response: SafetyAssessmentResponse = {
      confidenceScore,
      safetyLevel,
      emergencyFlags: emergencyAssessment.emergencyFlags,
      disclaimerRequired: true, // Always require disclaimers for medical content
      humanReviewRequired: safetyLevel === "review_required" || confidenceScore < 40,
      safetyRecommendations,
      accuracyIndicators,
      emergencyProtocol: emergencyAssessment.isEmergency
        ? {
            isEmergency: true,
            emergencyType: emergencyAssessment.emergencyType,
            immediateActions: emergencyAssessment.immediateActions,
            emergencyContacts: [
              "Emergency Services: 108",
              "Medical Emergency: 102",
              "Police: 100",
              "Fire: 101",
              "Women Helpline: 1091",
              "Child Helpline: 1098",
            ],
          }
        : undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("AI Safety Monitor error:", error)

    // Return safe defaults in case of error
    return NextResponse.json(
      {
        confidenceScore: 30,
        safetyLevel: "review_required",
        emergencyFlags: [],
        disclaimerRequired: true,
        humanReviewRequired: true,
        safetyRecommendations: [
          "⚠️ AI safety assessment failed",
          "Consult healthcare professional immediately",
          "Do not rely on AI recommendations",
          "Seek human medical review",
        ],
        accuracyIndicators: {
          dataQuality: 30,
          symptomClarity: 30,
          medicalComplexity: 50,
          riskLevel: 80,
        },
      },
      { status: 200 },
    )
  }
}

// GET endpoint for safety analytics
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get("type")

    if (type === "guidelines") {
      return NextResponse.json({
        emergencyKeywords: EMERGENCY_KEYWORDS,
        criticalCombinations: CRITICAL_COMBINATIONS,
        highRiskConditions: HIGH_RISK_CONDITIONS,
        safetyLevels: {
          safe: "AI recommendations appear reliable",
          caution: "Use AI recommendations with caution",
          review_required: "Human medical review strongly recommended",
          emergency: "Seek immediate medical attention",
        },
      })
    }

    return NextResponse.json({
      message: "AI Safety Monitor is active",
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Safety monitor unavailable" }, { status: 500 })
  }
}
