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

interface SafetyAssessment {
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

// Emergency keywords that trigger immediate escalation
const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "severe bleeding",
  "unconscious",
  "heart attack",
  "stroke",
  "seizure",
  "severe allergic reaction",
  "poisoning",
  "suicide",
  "overdose",
  "severe burns",
  "broken bone",
  "head injury",
  "can't breathe",
  "choking",
  "severe pain",
  "blood vomit",
  "severe headache",
  "vision loss",
  "paralysis",
]

// High-risk medication keywords
const HIGH_RISK_MEDICATIONS = [
  "warfarin",
  "insulin",
  "chemotherapy",
  "immunosuppressant",
  "anticoagulant",
  "blood thinner",
  "heart medication",
  "psychiatric medication",
]

// Calculate confidence score based on multiple factors
function calculateConfidenceScore(
  userInput: string,
  aiResponse: string,
  responseType: string,
  userProfile?: any,
): number {
  let confidence = 70 // Base confidence

  // Input quality assessment
  const inputLength = userInput.length
  if (inputLength > 100) confidence += 10
  if (inputLength > 200) confidence += 5

  // Symptom clarity
  const medicalTerms = [
    "pain",
    "fever",
    "headache",
    "nausea",
    "fatigue",
    "cough",
    "rash",
    "swelling",
    "dizziness",
    "vomiting",
  ]
  const foundTerms = medicalTerms.filter((term) => userInput.toLowerCase().includes(term))
  confidence += foundTerms.length * 2

  // Response type adjustment
  switch (responseType) {
    case "emergency":
      confidence -= 20 // Lower confidence for emergency situations
      break
    case "medication":
      confidence -= 10 // Lower confidence for medication advice
      break
    case "lifestyle":
      confidence += 10 // Higher confidence for lifestyle advice
      break
  }

  // User profile completeness
  if (userProfile) {
    if (userProfile.age > 0) confidence += 5
    if (userProfile.medicalHistory?.length > 0) confidence += 5
    if (userProfile.currentMedications?.length > 0) confidence += 5
  }

  // Response quality
  if (aiResponse.length > 200) confidence += 5
  if (aiResponse.includes("consult") || aiResponse.includes("doctor")) confidence += 10

  return Math.min(Math.max(confidence, 0), 100)
}

// Detect emergency situations
function detectEmergency(userInput: string, aiResponse: string): any {
  const input = userInput.toLowerCase()
  const response = aiResponse.toLowerCase()

  const emergencyFlags = EMERGENCY_KEYWORDS.filter((keyword) => input.includes(keyword) || response.includes(keyword))

  if (emergencyFlags.length > 0) {
    return {
      isEmergency: true,
      emergencyType: emergencyFlags[0],
      immediateActions: [
        "Call emergency services immediately (108)",
        "Do not delay seeking professional medical help",
        "If unconscious, check breathing and pulse",
        "Stay with the patient until help arrives",
        "Provide clear location information to emergency services",
      ],
      emergencyContacts: ["Emergency Services: 108", "Medical Emergency: 102", "Police: 100", "Fire: 101"],
    }
  }

  return null
}

// Assess data quality and medical complexity
function assessAccuracyIndicators(
  userInput: string,
  aiResponse: string,
  responseType: string,
): SafetyAssessment["accuracyIndicators"] {
  const inputWords = userInput.split(" ").length
  const responseWords = aiResponse.split(" ").length

  // Data quality based on input completeness
  let dataQuality = 50
  if (inputWords > 20) dataQuality += 20
  if (inputWords > 50) dataQuality += 15
  if (userInput.includes("duration") || userInput.includes("days") || userInput.includes("weeks")) dataQuality += 15

  // Symptom clarity
  let symptomClarity = 60
  const specificSymptoms = ["sharp", "dull", "throbbing", "burning", "tingling", "severe", "mild", "moderate"]
  const foundDescriptors = specificSymptoms.filter((desc) => userInput.toLowerCase().includes(desc))
  symptomClarity += foundDescriptors.length * 10

  // Medical complexity
  let medicalComplexity = 40
  switch (responseType) {
    case "emergency":
      medicalComplexity = 90
      break
    case "medication":
      medicalComplexity = 80
      break
    case "diagnosis":
      medicalComplexity = 70
      break
    case "lifestyle":
      medicalComplexity = 30
      break
  }

  // Risk level assessment
  let riskLevel = 30
  if (HIGH_RISK_MEDICATIONS.some((med) => aiResponse.toLowerCase().includes(med))) riskLevel += 40
  if (EMERGENCY_KEYWORDS.some((keyword) => userInput.toLowerCase().includes(keyword))) riskLevel += 50

  return {
    dataQuality: Math.min(dataQuality, 100),
    symptomClarity: Math.min(symptomClarity, 100),
    medicalComplexity,
    riskLevel: Math.min(riskLevel, 100),
  }
}

// Generate safety recommendations
function generateSafetyRecommendations(
  confidenceScore: number,
  emergencyFlags: string[],
  responseType: string,
): string[] {
  const recommendations: string[] = []

  if (confidenceScore < 60) {
    recommendations.push("AI confidence is low - strongly recommend consulting a healthcare professional")
    recommendations.push("Consider seeking a second opinion from a qualified doctor")
  }

  if (emergencyFlags.length > 0) {
    recommendations.push("EMERGENCY: Seek immediate medical attention")
    recommendations.push("Call emergency services (108) without delay")
    recommendations.push("Do not rely solely on AI recommendations for emergency situations")
  }

  switch (responseType) {
    case "medication":
      recommendations.push("Verify all medication suggestions with a licensed pharmacist or doctor")
      recommendations.push("Check for drug interactions with current medications")
      recommendations.push("Never start or stop medications without professional guidance")
      break
    case "diagnosis":
      recommendations.push("AI cannot provide definitive medical diagnosis")
      recommendations.push("Professional medical examination is required for accurate diagnosis")
      recommendations.push("Use AI insights as preliminary information only")
      break
    case "emergency":
      recommendations.push("Emergency situations require immediate professional medical intervention")
      recommendations.push("Follow emergency protocols and contact emergency services")
      break
  }

  recommendations.push("Always consult qualified healthcare professionals for medical decisions")
  recommendations.push("Monitor symptoms and seek help if condition worsens")

  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const body: SafetyAssessmentRequest = await request.json()
    const { aiResponse, userInput, context, responseType, userProfile } = body

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(userInput, aiResponse, responseType, userProfile)

    // Detect emergency situations
    const emergencyProtocol = detectEmergency(userInput, aiResponse)
    const emergencyFlags = emergencyProtocol ? [emergencyProtocol.emergencyType] : []

    // Assess accuracy indicators
    const accuracyIndicators = assessAccuracyIndicators(userInput, aiResponse, responseType)

    // Determine safety level
    let safetyLevel: SafetyAssessment["safetyLevel"] = "safe"
    if (emergencyProtocol) {
      safetyLevel = "emergency"
    } else if (confidenceScore < 40 || accuracyIndicators.riskLevel > 70) {
      safetyLevel = "review_required"
    } else if (confidenceScore < 60 || accuracyIndicators.riskLevel > 50) {
      safetyLevel = "caution"
    }

    // Generate safety recommendations
    const safetyRecommendations = generateSafetyRecommendations(confidenceScore, emergencyFlags, responseType)

    // Determine if human review is required
    const humanReviewRequired = confidenceScore < 60 || safetyLevel === "review_required" || safetyLevel === "emergency"

    // Always require disclaimer for medical content
    const disclaimerRequired = true

    const assessment: SafetyAssessment = {
      confidenceScore,
      safetyLevel,
      emergencyFlags,
      disclaimerRequired,
      humanReviewRequired,
      safetyRecommendations,
      accuracyIndicators,
      emergencyProtocol: emergencyProtocol || undefined,
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("AI Safety Monitor Error:", error)
    return NextResponse.json(
      {
        error: "Safety assessment failed",
        confidenceScore: 30,
        safetyLevel: "review_required",
        emergencyFlags: [],
        disclaimerRequired: true,
        humanReviewRequired: true,
        safetyRecommendations: ["Error in safety assessment - please consult healthcare professional immediately"],
        accuracyIndicators: {
          dataQuality: 30,
          symptomClarity: 30,
          medicalComplexity: 50,
          riskLevel: 80,
        },
      },
      { status: 500 },
    )
  }
}
