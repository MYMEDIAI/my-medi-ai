import { type NextRequest, NextResponse } from "next/server"

interface LiveAnalysisRequest {
  personalInfo: {
    age: number
    gender: string
    weight: number
    height: number
  }
  primarySymptom: string
  secondarySymptoms: string[]
  medications: string[]
  conditions: string[]
  duration: string
  severity: number
  lifestyle: {
    exercise: string
    sleep: string
    diet: string
    stress: number
  }
}

interface LiveAnalysisResponse {
  healthScore: number
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  confidenceScore: number
  isEmergency: boolean
  emergencyAlert?: {
    message: string
    actions: string[]
    emergencyServices: string[]
  }
  recommendations: {
    immediate: string[]
    medications: Array<{
      name: string
      reason: string
      dosage: string
      urgency: "immediate" | "soon" | "routine"
    }>
    lifestyle: string[]
    followUp: string[]
  }
  riskFactors: Array<{
    factor: string
    impact: "high" | "medium" | "low"
    explanation: string
  }>
  aiReasoning: {
    healthScoreRationale: string
    riskAssessment: string
    keyFindings: string[]
  }
}

// Emergency symptoms that require immediate attention
const EMERGENCY_SYMPTOMS = [
  "chest pain",
  "severe chest pain",
  "difficulty breathing",
  "shortness of breath",
  "severe headache",
  "sudden severe headache",
  "loss of consciousness",
  "severe abdominal pain",
  "high fever",
  "severe bleeding",
  "stroke symptoms",
  "heart attack symptoms",
  "severe allergic reaction",
  "poisoning",
  "severe burns",
]

// Critical symptom combinations
const CRITICAL_COMBINATIONS = [
  ["chest pain", "shortness of breath"],
  ["chest pain", "sweating"],
  ["chest pain", "nausea"],
  ["severe headache", "vision changes"],
  ["fever", "neck stiffness"],
  ["abdominal pain", "vomiting blood"],
]

// Medication database for quick recommendations
const QUICK_MEDICATIONS = {
  fever: [
    {
      name: "Paracetamol 500mg",
      reason: "Fever reduction",
      dosage: "1 tablet every 6 hours",
      urgency: "soon" as const,
    },
    {
      name: "Ibuprofen 400mg",
      reason: "Fever and inflammation",
      dosage: "1 tablet every 8 hours",
      urgency: "soon" as const,
    },
  ],
  headache: [
    { name: "Paracetamol 500mg", reason: "Pain relief", dosage: "1-2 tablets every 6 hours", urgency: "soon" as const },
    {
      name: "Ibuprofen 400mg",
      reason: "Pain and inflammation",
      dosage: "1 tablet every 8 hours",
      urgency: "soon" as const,
    },
  ],
  "stomach pain": [
    {
      name: "Antacid",
      reason: "Stomach acid neutralization",
      dosage: "2 tablets after meals",
      urgency: "routine" as const,
    },
    {
      name: "Omeprazole 20mg",
      reason: "Acid reduction",
      dosage: "1 tablet before breakfast",
      urgency: "routine" as const,
    },
  ],
  acidity: [
    {
      name: "Omeprazole 20mg",
      reason: "Acid suppression",
      dosage: "1 tablet before breakfast",
      urgency: "routine" as const,
    },
    { name: "Pantoprazole 40mg", reason: "Acid control", dosage: "1 tablet daily", urgency: "routine" as const },
  ],
  cough: [
    {
      name: "Dextromethorphan syrup",
      reason: "Cough suppression",
      dosage: "10ml every 6 hours",
      urgency: "routine" as const,
    },
    {
      name: "Honey and warm water",
      reason: "Natural cough relief",
      dosage: "1 tsp honey in warm water",
      urgency: "routine" as const,
    },
  ],
}

function calculateHealthScore(data: LiveAnalysisRequest): { score: number; rationale: string } {
  let score = 85 // Base healthy score
  const factors: string[] = []

  // Age factor
  if (data.personalInfo.age > 65) {
    score -= 10
    factors.push("Advanced age increases health risks")
  } else if (data.personalInfo.age > 45) {
    score -= 5
    factors.push("Middle age requires increased health monitoring")
  }

  // BMI calculation if height and weight available
  if (data.personalInfo.height > 0 && data.personalInfo.weight > 0) {
    const bmi = data.personalInfo.weight / Math.pow(data.personalInfo.height / 100, 2)
    if (bmi > 30) {
      score -= 15
      factors.push("Obesity significantly impacts health score")
    } else if (bmi > 25) {
      score -= 8
      factors.push("Overweight status affects overall health")
    } else if (bmi < 18.5) {
      score -= 10
      factors.push("Underweight status indicates potential health concerns")
    }
  }

  // Symptom severity impact
  if (data.severity > 8) {
    score -= 20
    factors.push("High symptom severity significantly impacts health")
  } else if (data.severity > 6) {
    score -= 12
    factors.push("Moderate to high symptom severity affects wellbeing")
  } else if (data.severity > 4) {
    score -= 6
    factors.push("Moderate symptoms require attention")
  }

  // Chronic conditions impact
  const highRiskConditions = ["diabetes-type2", "heart-disease", "kidney-disease"]
  const moderateRiskConditions = ["hypertension", "high-cholesterol", "asthma"]

  data.conditions.forEach((condition) => {
    if (highRiskConditions.includes(condition)) {
      score -= 15
      factors.push(`${condition.replace("-", " ")} significantly impacts health management`)
    } else if (moderateRiskConditions.includes(condition)) {
      score -= 8
      factors.push(`${condition.replace("-", " ")} requires ongoing monitoring`)
    }
  })

  // Lifestyle factors
  if (data.lifestyle.exercise === "sedentary" || data.lifestyle.exercise === "rarely") {
    score -= 10
    factors.push("Sedentary lifestyle negatively impacts health")
  }

  if (data.lifestyle.sleep === "poor" || data.lifestyle.sleep === "irregular") {
    score -= 8
    factors.push("Poor sleep quality affects overall health")
  }

  if (data.lifestyle.stress > 7) {
    score -= 10
    factors.push("High stress levels significantly impact health")
  } else if (data.lifestyle.stress > 5) {
    score -= 5
    factors.push("Moderate stress affects wellbeing")
  }

  // Duration of symptoms
  if (data.duration === "more-than-2-weeks") {
    score -= 10
    factors.push("Prolonged symptoms indicate need for medical attention")
  } else if (data.duration === "1-2-weeks") {
    score -= 5
    factors.push("Extended symptom duration requires monitoring")
  }

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score))

  const rationale = `Health score calculated based on multiple factors: ${factors.join("; ")}. Score reflects current health status and risk factors.`

  return { score, rationale }
}

function assessRiskLevel(
  data: LiveAnalysisRequest,
  healthScore: number,
): {
  level: "Low" | "Moderate" | "High" | "Critical"
  assessment: string
} {
  // Check for emergency symptoms first
  const hasEmergencySymptom = EMERGENCY_SYMPTOMS.some(
    (emergency) =>
      data.primarySymptom.toLowerCase().includes(emergency) ||
      data.secondarySymptoms.some((symptom) => symptom.toLowerCase().includes(emergency)),
  )

  if (hasEmergencySymptom) {
    return {
      level: "Critical",
      assessment:
        "Emergency symptoms detected requiring immediate medical attention. Critical risk level due to potentially life-threatening conditions.",
    }
  }

  // Check for critical symptom combinations
  const allSymptoms = [data.primarySymptom, ...data.secondarySymptoms].map((s) => s.toLowerCase())
  const hasCriticalCombination = CRITICAL_COMBINATIONS.some((combination) =>
    combination.every((symptom) => allSymptoms.some((userSymptom) => userSymptom.includes(symptom))),
  )

  if (hasCriticalCombination) {
    return {
      level: "Critical",
      assessment:
        "Critical symptom combination detected. Immediate medical evaluation required due to high risk of serious complications.",
    }
  }

  // Risk based on health score and other factors
  if (healthScore < 40 || data.severity > 8) {
    return {
      level: "High",
      assessment:
        "High risk due to low health score or severe symptoms. Prompt medical attention recommended within 24-48 hours.",
    }
  }

  if (healthScore < 60 || data.severity > 6 || data.conditions.length > 2) {
    return {
      level: "Moderate",
      assessment:
        "Moderate risk requiring medical consultation. Multiple risk factors present that need professional evaluation.",
    }
  }

  return {
    level: "Low",
    assessment:
      "Low risk based on current assessment. Continue monitoring symptoms and maintain healthy lifestyle practices.",
  }
}

function detectEmergency(data: LiveAnalysisRequest): {
  isEmergency: boolean
  alert?: {
    message: string
    actions: string[]
    emergencyServices: string[]
  }
} {
  const allSymptoms = [data.primarySymptom, ...data.secondarySymptoms].map((s) => s.toLowerCase())

  // Check for emergency symptoms
  const emergencySymptoms = EMERGENCY_SYMPTOMS.filter((emergency) =>
    allSymptoms.some((symptom) => symptom.includes(emergency)),
  )

  // Check for critical combinations
  const criticalCombinations = CRITICAL_COMBINATIONS.filter((combination) =>
    combination.every((symptom) => allSymptoms.some((userSymptom) => userSymptom.includes(symptom))),
  )

  // Check for high severity with concerning symptoms
  const highSeverityEmergency =
    data.severity > 8 &&
    allSymptoms.some(
      (symptom) => symptom.includes("chest") || symptom.includes("breathing") || symptom.includes("severe"),
    )

  if (emergencySymptoms.length > 0 || criticalCombinations.length > 0 || highSeverityEmergency) {
    let message = "🚨 EMERGENCY ALERT: "
    const actions: string[] = []

    if (emergencySymptoms.includes("chest pain")) {
      message += "Chest pain detected - possible cardiac emergency"
      actions.push("Call emergency services immediately (108)")
      actions.push("Do not drive yourself to hospital")
      actions.push("Chew aspirin if not allergic (unless bleeding)")
      actions.push("Sit upright and stay calm")
    } else if (
      emergencySymptoms.includes("difficulty breathing") ||
      emergencySymptoms.includes("shortness of breath")
    ) {
      message += "Severe breathing difficulty detected"
      actions.push("Call emergency services immediately (108)")
      actions.push("Sit upright, do not lie down")
      actions.push("Loosen tight clothing")
      actions.push("Use rescue inhaler if available")
    } else if (emergencySymptoms.includes("severe headache")) {
      message += "Severe headache - possible neurological emergency"
      actions.push("Call emergency services immediately (108)")
      actions.push("Avoid bright lights and loud sounds")
      actions.push("Do not take multiple pain medications")
      actions.push("Monitor for vision changes or confusion")
    } else {
      message += "Critical symptoms detected requiring immediate attention"
      actions.push("Call emergency services immediately (108)")
      actions.push("Do not delay seeking medical care")
      actions.push("Have someone stay with you")
    }

    return {
      isEmergency: true,
      alert: {
        message,
        actions,
        emergencyServices: ["Emergency Services: 108", "Medical Emergency: 102", "Police: 100", "Fire: 101"],
      },
    }
  }

  return { isEmergency: false }
}

function generateMedicationRecommendations(data: LiveAnalysisRequest): Array<{
  name: string
  reason: string
  dosage: string
  urgency: "immediate" | "soon" | "routine"
}> {
  const recommendations: Array<{
    name: string
    reason: string
    dosage: string
    urgency: "immediate" | "soon" | "routine"
  }> = []

  // Get recommendations based on primary symptom
  const primarySymptomLower = data.primarySymptom.toLowerCase()

  Object.entries(QUICK_MEDICATIONS).forEach(([symptom, meds]) => {
    if (primarySymptomLower.includes(symptom)) {
      recommendations.push(...meds)
    }
  })

  // Add recommendations based on secondary symptoms
  data.secondarySymptoms.forEach((symptom) => {
    const symptomLower = symptom.toLowerCase()
    Object.entries(QUICK_MEDICATIONS).forEach(([medSymptom, meds]) => {
      if (symptomLower.includes(medSymptom)) {
        // Avoid duplicates
        meds.forEach((med) => {
          if (!recommendations.some((rec) => rec.name === med.name)) {
            recommendations.push(med)
          }
        })
      }
    })
  })

  // Adjust urgency based on severity
  if (data.severity > 7) {
    recommendations.forEach((rec) => {
      if (rec.urgency === "routine") rec.urgency = "soon"
      if (rec.urgency === "soon" && data.severity > 8) rec.urgency = "immediate"
    })
  }

  return recommendations.slice(0, 4) // Limit to top 4 recommendations
}

function calculateConfidenceScore(data: LiveAnalysisRequest): number {
  let confidence = 50 // Base confidence

  // Increase confidence based on available data
  if (data.personalInfo.age > 0) confidence += 10
  if (data.personalInfo.gender) confidence += 5
  if (data.personalInfo.weight > 0 && data.personalInfo.height > 0) confidence += 10
  if (data.primarySymptom) confidence += 15
  if (data.secondarySymptoms.length > 0) confidence += 10
  if (data.duration) confidence += 5
  if (data.severity > 1) confidence += 5
  if (data.conditions.length > 0) confidence += 10
  if (data.medications.length > 0) confidence += 5

  // Reduce confidence for complex cases
  if (data.conditions.length > 3) confidence -= 5
  if (data.medications.length > 5) confidence -= 5
  if (data.severity > 8 && !data.primarySymptom) confidence -= 10

  return Math.min(95, Math.max(30, confidence))
}

export async function POST(request: NextRequest) {
  try {
    const data: LiveAnalysisRequest = await request.json()

    // Calculate health score
    const { score: healthScore, rationale: healthScoreRationale } = calculateHealthScore(data)

    // Assess risk level
    const { level: riskLevel, assessment: riskAssessment } = assessRiskLevel(data, healthScore)

    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(data)

    // Detect emergency
    const { isEmergency, alert: emergencyAlert } = detectEmergency(data)

    // Generate medication recommendations
    const medicationRecommendations = generateMedicationRecommendations(data)

    // Generate immediate recommendations
    const immediateRecommendations: string[] = []

    if (data.severity > 6) {
      immediateRecommendations.push("Monitor symptoms closely and track changes")
    }

    if (data.primarySymptom.toLowerCase().includes("fever")) {
      immediateRecommendations.push("Stay hydrated with plenty of fluids")
      immediateRecommendations.push("Rest and avoid strenuous activities")
    }

    if (data.primarySymptom.toLowerCase().includes("pain")) {
      immediateRecommendations.push("Apply appropriate hot/cold therapy")
      immediateRecommendations.push("Avoid activities that worsen pain")
    }

    // Generate lifestyle recommendations
    const lifestyleRecommendations: string[] = []

    if (data.lifestyle.exercise === "sedentary") {
      lifestyleRecommendations.push("Start with 15-minute daily walks")
    }

    if (data.lifestyle.sleep === "poor") {
      lifestyleRecommendations.push("Establish regular sleep schedule")
    }

    if (data.lifestyle.stress > 6) {
      lifestyleRecommendations.push("Practice stress reduction techniques")
    }

    // Generate follow-up recommendations
    const followUpRecommendations: string[] = []

    if (data.severity > 7 || riskLevel === "High") {
      followUpRecommendations.push("Schedule doctor appointment within 24-48 hours")
    } else if (data.severity > 5 || riskLevel === "Moderate") {
      followUpRecommendations.push("Consider medical consultation within 1 week")
    }

    if (data.conditions.length > 0) {
      followUpRecommendations.push("Regular monitoring of existing conditions")
    }

    // Generate risk factors
    const riskFactors: Array<{
      factor: string
      impact: "high" | "medium" | "low"
      explanation: string
    }> = []

    if (data.personalInfo.age > 65) {
      riskFactors.push({
        factor: "Advanced Age",
        impact: "medium",
        explanation: "Age increases susceptibility to various health conditions",
      })
    }

    if (data.conditions.includes("diabetes-type2")) {
      riskFactors.push({
        factor: "Diabetes",
        impact: "high",
        explanation: "Diabetes significantly increases cardiovascular and other health risks",
      })
    }

    if (data.severity > 7) {
      riskFactors.push({
        factor: "High Symptom Severity",
        impact: "high",
        explanation: "Severe symptoms may indicate serious underlying conditions",
      })
    }

    const response: LiveAnalysisResponse = {
      healthScore,
      riskLevel,
      confidenceScore,
      isEmergency,
      emergencyAlert,
      recommendations: {
        immediate: immediateRecommendations,
        medications: medicationRecommendations,
        lifestyle: lifestyleRecommendations,
        followUp: followUpRecommendations,
      },
      riskFactors,
      aiReasoning: {
        healthScoreRationale,
        riskAssessment,
        keyFindings: [
          `Primary symptom: ${data.primarySymptom || "Not specified"}`,
          `Severity level: ${data.severity}/10`,
          `Risk level: ${riskLevel}`,
          `Confidence: ${confidenceScore}%`,
        ],
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Live AI analysis error:", error)

    return NextResponse.json(
      {
        healthScore: 75,
        riskLevel: "Moderate",
        confidenceScore: 50,
        isEmergency: false,
        recommendations: {
          immediate: ["Consult healthcare provider for proper evaluation"],
          medications: [],
          lifestyle: ["Maintain healthy lifestyle practices"],
          followUp: ["Schedule routine health checkup"],
        },
        riskFactors: [],
        aiReasoning: {
          healthScoreRationale: "Analysis temporarily unavailable",
          riskAssessment: "Unable to complete full assessment",
          keyFindings: ["Please try again or consult healthcare provider"],
        },
      },
      { status: 200 },
    )
  }
}
