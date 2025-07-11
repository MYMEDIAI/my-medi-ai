import { type NextRequest, NextResponse } from "next/server"

interface HealthAssessmentRequest {
  personalInfo: {
    age: number
    gender: string
    height: number
    weight: number
    location: string
  }
  symptoms: {
    primary: string[]
    secondary: string[]
    duration: string
    severity: number
    bodyParts: string[]
  }
  medicalHistory: {
    conditions: string[]
    surgeries: string[]
    allergies: string[]
    familyHistory: string[]
  }
  lifestyle: {
    smoking: boolean
    alcohol: boolean
    exercise: string
    diet: string
    sleep: number
    stress: number
  }
  currentMedications: string[]
  vitalSigns?: {
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    oxygenSaturation?: number
  }
}

interface HealthAssessmentResponse {
  overallScore: number
  riskLevel: "low" | "moderate" | "high" | "critical"
  primaryConcerns: string[]
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  specialistReferrals: string[]
  followUpSchedule: string
  healthPlan: {
    diet: string[]
    exercise: string[]
    lifestyle: string[]
    monitoring: string[]
  }
  riskFactors: {
    modifiable: string[]
    nonModifiable: string[]
  }
  confidence: number
  disclaimer: string
}

// Calculate BMI and health metrics
function calculateHealthMetrics(personalInfo: HealthAssessmentRequest["personalInfo"]) {
  const { height, weight, age } = personalInfo
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  let bmiCategory = ""
  let bmiRisk = 0

  if (bmi < 18.5) {
    bmiCategory = "Underweight"
    bmiRisk = 2
  } else if (bmi < 25) {
    bmiCategory = "Normal weight"
    bmiRisk = 0
  } else if (bmi < 30) {
    bmiCategory = "Overweight"
    bmiRisk = 3
  } else {
    bmiCategory = "Obese"
    bmiRisk = 5
  }

  // Age-related risk factors
  let ageRisk = 0
  if (age > 65) ageRisk = 3
  else if (age > 50) ageRisk = 2
  else if (age > 35) ageRisk = 1

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmiRisk,
    ageRisk,
  }
}

// Assess symptom severity and urgency
function assessSymptoms(symptoms: HealthAssessmentRequest["symptoms"]) {
  const { primary, secondary, severity, duration } = symptoms

  let symptomRisk = 0
  let urgencyLevel = "low"

  // Critical symptoms that require immediate attention
  const criticalSymptoms = [
    "chest pain",
    "difficulty breathing",
    "severe bleeding",
    "unconscious",
    "heart attack",
    "stroke",
    "seizure",
  ]

  // High-risk symptoms
  const highRiskSymptoms = [
    "severe pain",
    "high fever",
    "blood vomit",
    "severe headache",
    "vision problems",
    "severe allergic reaction",
  ]

  const allSymptoms = [...primary, ...secondary].join(" ").toLowerCase()

  if (criticalSymptoms.some((symptom) => allSymptoms.includes(symptom))) {
    symptomRisk = 10
    urgencyLevel = "critical"
  } else if (highRiskSymptoms.some((symptom) => allSymptoms.includes(symptom))) {
    symptomRisk = 7
    urgencyLevel = "high"
  } else if (severity > 7) {
    symptomRisk = 6
    urgencyLevel = "high"
  } else if (severity > 5) {
    symptomRisk = 4
    urgencyLevel = "moderate"
  } else {
    symptomRisk = 2
    urgencyLevel = "low"
  }

  // Duration factor
  if (duration.includes("week") || duration.includes("month")) {
    symptomRisk += 2
  }

  return {
    symptomRisk: Math.min(symptomRisk, 10),
    urgencyLevel,
    primaryConcerns: primary,
  }
}

// Assess medical history risk
function assessMedicalHistory(medicalHistory: HealthAssessmentRequest["medicalHistory"]) {
  const { conditions, surgeries, allergies, familyHistory } = medicalHistory

  let historyRisk = 0

  // High-risk conditions
  const highRiskConditions = ["diabetes", "heart disease", "hypertension", "cancer", "stroke", "kidney disease"]

  conditions.forEach((condition) => {
    if (highRiskConditions.some((risk) => condition.toLowerCase().includes(risk.toLowerCase()))) {
      historyRisk += 3
    } else {
      historyRisk += 1
    }
  })

  // Surgery history
  historyRisk += surgeries.length * 0.5

  // Allergies
  historyRisk += allergies.length * 0.5

  // Family history
  familyHistory.forEach((condition) => {
    if (highRiskConditions.some((risk) => condition.toLowerCase().includes(risk.toLowerCase()))) {
      historyRisk += 2
    } else {
      historyRisk += 0.5
    }
  })

  return Math.min(historyRisk, 10)
}

// Assess lifestyle risk factors
function assessLifestyle(lifestyle: HealthAssessmentRequest["lifestyle"]) {
  const { smoking, alcohol, exercise, diet, sleep, stress } = lifestyle

  let lifestyleRisk = 0

  // Smoking
  if (smoking) lifestyleRisk += 4

  // Alcohol
  if (alcohol) lifestyleRisk += 2

  // Exercise
  if (exercise === "none" || exercise === "sedentary") lifestyleRisk += 3
  else if (exercise === "light") lifestyleRisk += 1

  // Diet
  if (diet === "poor" || diet === "fast food") lifestyleRisk += 3
  else if (diet === "average") lifestyleRisk += 1

  // Sleep
  if (sleep < 6 || sleep > 9) lifestyleRisk += 2

  // Stress
  if (stress > 7) lifestyleRisk += 3
  else if (stress > 5) lifestyleRisk += 2

  return Math.min(lifestyleRisk, 10)
}

// Generate health recommendations
function generateRecommendations(
  assessment: any,
  symptoms: any,
  lifestyle: HealthAssessmentRequest["lifestyle"],
): HealthAssessmentResponse["recommendations"] {
  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[],
  }

  // Immediate recommendations based on urgency
  if (symptoms.urgencyLevel === "critical") {
    recommendations.immediate.push("🚨 SEEK IMMEDIATE EMERGENCY MEDICAL ATTENTION")
    recommendations.immediate.push("Call emergency services (108) immediately")
    recommendations.immediate.push("Do not delay - go to nearest emergency room")
  } else if (symptoms.urgencyLevel === "high") {
    recommendations.immediate.push("Consult a doctor within 24 hours")
    recommendations.immediate.push("Monitor symptoms closely")
    recommendations.immediate.push("Consider visiting urgent care if symptoms worsen")
  } else {
    recommendations.immediate.push("Schedule appointment with healthcare provider")
    recommendations.immediate.push("Monitor symptoms and keep a symptom diary")
    recommendations.immediate.push("Stay hydrated and get adequate rest")
  }

  // Short-term recommendations (1-4 weeks)
  if (assessment.bmiRisk > 3) {
    recommendations.shortTerm.push("Consult nutritionist for weight management plan")
    recommendations.shortTerm.push("Start gradual exercise program")
  }

  if (lifestyle.smoking) {
    recommendations.shortTerm.push("Consider smoking cessation program")
    recommendations.shortTerm.push("Consult doctor about nicotine replacement therapy")
  }

  if (lifestyle.stress > 6) {
    recommendations.shortTerm.push("Practice stress management techniques")
    recommendations.shortTerm.push("Consider counseling or therapy")
  }

  recommendations.shortTerm.push("Schedule comprehensive health check-up")
  recommendations.shortTerm.push("Update vaccinations as needed")

  // Long-term recommendations (1+ months)
  recommendations.longTerm.push("Maintain regular exercise routine")
  recommendations.longTerm.push("Follow balanced, nutritious diet")
  recommendations.longTerm.push("Schedule annual health screenings")
  recommendations.longTerm.push("Build strong support network")
  recommendations.longTerm.push("Practice preventive healthcare measures")

  return recommendations
}

// Generate health plan
function generateHealthPlan(
  personalInfo: HealthAssessmentRequest["personalInfo"],
  lifestyle: HealthAssessmentRequest["lifestyle"],
  assessment: any,
): HealthAssessmentResponse["healthPlan"] {
  const plan = {
    diet: [] as string[],
    exercise: [] as string[],
    lifestyle: [] as string[],
    monitoring: [] as string[],
  }

  // Diet recommendations
  if (assessment.bmiRisk > 2) {
    plan.diet.push("Reduce caloric intake by 300-500 calories daily")
    plan.diet.push("Increase fiber intake with fruits and vegetables")
    plan.diet.push("Limit processed foods and sugary drinks")
  }

  plan.diet.push("Eat 5-6 servings of fruits and vegetables daily")
  plan.diet.push("Choose whole grains over refined grains")
  plan.diet.push("Include lean proteins in each meal")
  plan.diet.push("Stay hydrated with 8-10 glasses of water daily")

  // Exercise recommendations
  if (lifestyle.exercise === "none") {
    plan.exercise.push("Start with 10-15 minutes of walking daily")
    plan.exercise.push("Gradually increase to 30 minutes, 5 days per week")
  } else {
    plan.exercise.push("Maintain 150 minutes of moderate exercise weekly")
    plan.exercise.push("Include strength training 2-3 times per week")
  }

  plan.exercise.push("Add flexibility and balance exercises")
  plan.exercise.push("Find activities you enjoy to maintain consistency")

  // Lifestyle recommendations
  if (lifestyle.smoking) {
    plan.lifestyle.push("Quit smoking with professional support")
  }

  if (lifestyle.alcohol) {
    plan.lifestyle.push("Limit alcohol consumption")
  }

  plan.lifestyle.push("Maintain regular sleep schedule (7-9 hours)")
  plan.lifestyle.push("Practice stress management techniques")
  plan.lifestyle.push("Build and maintain social connections")

  // Monitoring recommendations
  plan.monitoring.push("Track daily symptoms and energy levels")
  plan.monitoring.push("Monitor weight weekly")
  plan.monitoring.push("Check blood pressure regularly")
  plan.monitoring.push("Schedule regular follow-up appointments")

  return plan
}

// Determine specialist referrals
function determineSpecialistReferrals(
  symptoms: HealthAssessmentRequest["symptoms"],
  medicalHistory: HealthAssessmentRequest["medicalHistory"],
): string[] {
  const referrals: string[] = []
  const allSymptoms = [...symptoms.primary, ...symptoms.secondary].join(" ").toLowerCase()
  const conditions = medicalHistory.conditions.join(" ").toLowerCase()

  // Cardiology
  if (
    allSymptoms.includes("chest pain") ||
    allSymptoms.includes("heart") ||
    conditions.includes("heart disease") ||
    conditions.includes("hypertension")
  ) {
    referrals.push("Cardiologist")
  }

  // Neurology
  if (
    allSymptoms.includes("headache") ||
    allSymptoms.includes("seizure") ||
    allSymptoms.includes("neurological") ||
    conditions.includes("stroke")
  ) {
    referrals.push("Neurologist")
  }

  // Endocrinology
  if (conditions.includes("diabetes") || allSymptoms.includes("thyroid")) {
    referrals.push("Endocrinologist")
  }

  // Gastroenterology
  if (allSymptoms.includes("stomach") || allSymptoms.includes("digestive") || allSymptoms.includes("abdominal")) {
    referrals.push("Gastroenterologist")
  }

  // Dermatology
  if (allSymptoms.includes("skin") || allSymptoms.includes("rash")) {
    referrals.push("Dermatologist")
  }

  // Default to General Physician if no specific specialist needed
  if (referrals.length === 0) {
    referrals.push("General Physician")
  }

  return referrals
}

export async function POST(request: NextRequest) {
  try {
    const assessmentRequest: HealthAssessmentRequest = await request.json()

    // Validate required fields
    if (!assessmentRequest.personalInfo || !assessmentRequest.symptoms) {
      return NextResponse.json({ error: "Personal info and symptoms are required" }, { status: 400 })
    }

    // Calculate health metrics
    const healthMetrics = calculateHealthMetrics(assessmentRequest.personalInfo)

    // Assess symptoms
    const symptomAssessment = assessSymptoms(assessmentRequest.symptoms)

    // Assess medical history
    const historyRisk = assessMedicalHistory(assessmentRequest.medicalHistory)

    // Assess lifestyle
    const lifestyleRisk = assessLifestyle(assessmentRequest.lifestyle)

    // Calculate overall score (0-100, higher is better)
    const totalRisk = healthMetrics.bmiRisk + symptomAssessment.symptomRisk + historyRisk + lifestyleRisk
    const overallScore = Math.max(0, 100 - totalRisk * 2.5)

    // Determine risk level
    let riskLevel: "low" | "moderate" | "high" | "critical" = "low"
    if (symptomAssessment.urgencyLevel === "critical") {
      riskLevel = "critical"
    } else if (overallScore < 40) {
      riskLevel = "high"
    } else if (overallScore < 70) {
      riskLevel = "moderate"
    }

    // Generate recommendations
    const recommendations = generateRecommendations(healthMetrics, symptomAssessment, assessmentRequest.lifestyle)

    // Generate health plan
    const healthPlan = generateHealthPlan(assessmentRequest.personalInfo, assessmentRequest.lifestyle, healthMetrics)

    // Determine specialist referrals
    const specialistReferrals = determineSpecialistReferrals(
      assessmentRequest.symptoms,
      assessmentRequest.medicalHistory,
    )

    // Determine follow-up schedule
    let followUpSchedule = "4-6 weeks"
    if (riskLevel === "critical") followUpSchedule = "Immediate"
    else if (riskLevel === "high") followUpSchedule = "1-2 weeks"
    else if (riskLevel === "moderate") followUpSchedule = "2-4 weeks"

    // Identify risk factors
    const riskFactors = {
      modifiable: [] as string[],
      nonModifiable: [] as string[],
    }

    if (assessmentRequest.lifestyle.smoking) riskFactors.modifiable.push("Smoking")
    if (assessmentRequest.lifestyle.exercise === "none") riskFactors.modifiable.push("Sedentary lifestyle")
    if (healthMetrics.bmiRisk > 2) riskFactors.modifiable.push("Weight management")
    if (assessmentRequest.lifestyle.stress > 6) riskFactors.modifiable.push("High stress levels")

    riskFactors.nonModifiable.push(`Age: ${assessmentRequest.personalInfo.age}`)
    riskFactors.nonModifiable.push(`Gender: ${assessmentRequest.personalInfo.gender}`)
    if (assessmentRequest.medicalHistory.familyHistory.length > 0) {
      riskFactors.nonModifiable.push("Family history")
    }

    // Calculate confidence
    let confidence = 75
    if (assessmentRequest.symptoms.primary.length > 1) confidence += 5
    if (assessmentRequest.medicalHistory.conditions.length > 0) confidence += 5
    if (assessmentRequest.vitalSigns) confidence += 10
    if (assessmentRequest.symptoms.duration) confidence += 5

    const response: HealthAssessmentResponse = {
      overallScore: Math.round(overallScore),
      riskLevel,
      primaryConcerns: symptomAssessment.primaryConcerns,
      recommendations,
      specialistReferrals,
      followUpSchedule,
      healthPlan,
      riskFactors,
      confidence: Math.min(confidence, 95),
      disclaimer:
        "This AI health assessment is for informational purposes only and does not replace professional medical diagnosis or treatment. Always consult qualified healthcare professionals for medical decisions. In emergencies, call 108 immediately.",
    }

    return NextResponse.json({
      ...response,
      timestamp: new Date().toISOString(),
      processingTime: "2.1s",
      assessmentId: `assessment_${Date.now()}`,
      bmiInfo: {
        value: healthMetrics.bmi,
        category: healthMetrics.bmiCategory,
      },
    })
  } catch (error) {
    console.error("Health Assessment Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process health assessment",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
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
      case "assessment_template":
        return NextResponse.json({
          template: {
            personalInfo: {
              age: "number (required)",
              gender: "string (required)",
              height: "number in cm (required)",
              weight: "number in kg (required)",
              location: "string (required)",
            },
            symptoms: {
              primary: "array of strings (required)",
              secondary: "array of strings (optional)",
              duration: "string (required)",
              severity: "number 1-10 (required)",
              bodyParts: "array of strings (optional)",
            },
            medicalHistory: {
              conditions: "array of strings",
              surgeries: "array of strings",
              allergies: "array of strings",
              familyHistory: "array of strings",
            },
            lifestyle: {
              smoking: "boolean",
              alcohol: "boolean",
              exercise: "string (none/light/moderate/heavy)",
              diet: "string (poor/average/good/excellent)",
              sleep: "number (hours per night)",
              stress: "number 1-10",
            },
            currentMedications: "array of strings",
            vitalSigns: {
              bloodPressure: "string (optional)",
              heartRate: "number (optional)",
              temperature: "number (optional)",
              oxygenSaturation: "number (optional)",
            },
          },
          timestamp: new Date().toISOString(),
        })

      case "risk_factors":
        return NextResponse.json({
          riskFactors: {
            modifiable: [
              "Smoking",
              "Alcohol consumption",
              "Physical inactivity",
              "Poor diet",
              "Obesity",
              "High stress",
              "Poor sleep habits",
            ],
            nonModifiable: ["Age", "Gender", "Genetics", "Family history", "Ethnicity"],
          },
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          {
            error: "Invalid action parameter",
            availableActions: ["assessment_template", "risk_factors"],
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Health Assessment GET Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
