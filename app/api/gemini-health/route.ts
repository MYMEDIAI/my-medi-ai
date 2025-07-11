import { type NextRequest, NextResponse } from "next/server"

interface HealthQuery {
  symptoms: string[]
  duration?: string
  severity?: number
  age?: number
  gender?: string
  medicalHistory?: string[]
  currentMedications?: string[]
  location?: string
  language?: string
}

interface HealthResponse {
  assessment: string
  recommendations: string[]
  urgencyLevel: "low" | "medium" | "high" | "critical"
  suggestedSpecialists: string[]
  followUpQuestions: string[]
  disclaimer: string
  confidence: number
}

// Mock Gemini Health API response generator
function generateHealthResponse(query: HealthQuery): HealthResponse {
  const { symptoms, duration, severity, age, gender, medicalHistory, currentMedications, location } = query

  // Determine urgency level based on symptoms
  const criticalSymptoms = ["chest pain", "difficulty breathing", "severe bleeding", "unconscious", "heart attack"]
  const highSymptoms = ["severe pain", "high fever", "blood vomit", "severe headache"]
  const mediumSymptoms = ["persistent pain", "fever", "infection", "moderate pain"]

  let urgencyLevel: "low" | "medium" | "high" | "critical" = "low"
  const symptomsText = symptoms.join(" ").toLowerCase()

  if (criticalSymptoms.some((symptom) => symptomsText.includes(symptom))) {
    urgencyLevel = "critical"
  } else if (highSymptoms.some((symptom) => symptomsText.includes(symptom))) {
    urgencyLevel = "high"
  } else if (mediumSymptoms.some((symptom) => symptomsText.includes(symptom))) {
    urgencyLevel = "medium"
  }

  // Generate assessment based on symptoms
  let assessment = `Based on your reported symptoms of ${symptoms.join(", ")}`
  if (duration) assessment += ` lasting ${duration}`
  if (severity) assessment += ` with severity level ${severity}/10`
  assessment += ", here is my preliminary assessment:\n\n"

  // Add specific assessment based on primary symptom
  const primarySymptom = symptoms[0]?.toLowerCase()
  if (primarySymptom?.includes("headache")) {
    assessment += `Your headache could be related to several factors including stress, dehydration, eye strain, or tension. ${
      severity && severity > 7 ? "Given the high severity, this requires medical attention." : ""
    }`
  } else if (primarySymptom?.includes("fever")) {
    assessment += `Fever indicates your body is fighting an infection or illness. ${
      severity && severity > 8 ? "High fever requires immediate medical attention." : ""
    }`
  } else if (primarySymptom?.includes("chest pain")) {
    assessment += `Chest pain can have various causes ranging from muscle strain to serious cardiac conditions. This symptom requires immediate medical evaluation.`
    urgencyLevel = "critical"
  } else {
    assessment += `Your symptoms suggest a condition that may require medical evaluation for proper diagnosis and treatment.`
  }

  // Generate recommendations
  const recommendations: string[] = []
  switch (urgencyLevel) {
    case "critical":
      recommendations.push("🚨 SEEK IMMEDIATE EMERGENCY MEDICAL ATTENTION")
      recommendations.push("Call emergency services (108) immediately")
      recommendations.push("Do not delay - go to nearest emergency room")
      break
    case "high":
      recommendations.push("Consult a doctor within 24 hours")
      recommendations.push("Monitor symptoms closely")
      recommendations.push("Consider visiting urgent care if symptoms worsen")
      break
    case "medium":
      recommendations.push("Schedule an appointment with your doctor within 2-3 days")
      recommendations.push("Keep track of symptom changes")
      recommendations.push("Consider appropriate over-the-counter remedies")
      break
    case "low":
      recommendations.push("Monitor symptoms for improvement over the next few days")
      recommendations.push("Try appropriate home remedies")
      recommendations.push("Consult doctor if symptoms persist or worsen")
      break
  }

  // Add general recommendations
  recommendations.push("Stay well hydrated")
  recommendations.push("Get adequate rest")
  recommendations.push("Maintain a healthy diet")

  // Suggest specialists based on symptoms
  const suggestedSpecialists: string[] = []
  if (primarySymptom?.includes("heart") || primarySymptom?.includes("chest")) {
    suggestedSpecialists.push("Cardiologist")
  }
  if (primarySymptom?.includes("head") || primarySymptom?.includes("neurological")) {
    suggestedSpecialists.push("Neurologist")
  }
  if (primarySymptom?.includes("skin") || primarySymptom?.includes("rash")) {
    suggestedSpecialists.push("Dermatologist")
  }
  if (primarySymptom?.includes("stomach") || primarySymptom?.includes("digestive")) {
    suggestedSpecialists.push("Gastroenterologist")
  }
  if (suggestedSpecialists.length === 0) {
    suggestedSpecialists.push("General Physician")
  }

  // Generate follow-up questions
  const followUpQuestions = [
    "Have you experienced these symptoms before?",
    "Are there any triggers that seem to worsen your symptoms?",
    "Have you taken any medications for these symptoms?",
    "Do you have any known allergies?",
    "Are there any family history of similar conditions?",
  ]

  // Calculate confidence based on symptom clarity and completeness
  let confidence = 70
  if (symptoms.length > 1) confidence += 10
  if (duration) confidence += 10
  if (severity) confidence += 10
  if (age && gender) confidence += 5
  if (medicalHistory && medicalHistory.length > 0) confidence += 5

  return {
    assessment,
    recommendations,
    urgencyLevel,
    suggestedSpecialists,
    followUpQuestions,
    disclaimer:
      "This AI assessment is for informational purposes only and does not replace professional medical diagnosis. Always consult qualified healthcare professionals for medical decisions.",
    confidence: Math.min(confidence, 95), // Cap at 95% to maintain humility
  }
}

export async function POST(request: NextRequest) {
  try {
    const query: HealthQuery = await request.json()

    // Validate required fields
    if (!query.symptoms || query.symptoms.length === 0) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 })
    }

    // Generate health response
    const healthResponse = generateHealthResponse(query)

    // Add processing metadata
    const response = {
      ...healthResponse,
      timestamp: new Date().toISOString(),
      processingTime: "1.2s",
      apiVersion: "1.0",
      model: "gemini-health-v1",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Gemini Health API Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process health query",
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
      case "health_tips":
        return NextResponse.json({
          tips: [
            "Stay hydrated by drinking 8-10 glasses of water daily",
            "Get 7-9 hours of quality sleep each night",
            "Exercise regularly for at least 30 minutes daily",
            "Eat a balanced diet rich in fruits and vegetables",
            "Practice stress management techniques",
            "Schedule regular health check-ups",
            "Avoid smoking and limit alcohol consumption",
            "Maintain good hygiene practices",
          ],
          timestamp: new Date().toISOString(),
        })

      case "emergency_contacts":
        return NextResponse.json({
          emergencyContacts: {
            "Emergency Services": "108",
            "Medical Emergency": "102",
            Police: "100",
            Fire: "101",
            "Women Helpline": "1091",
            "Child Helpline": "1098",
            "Senior Citizen Helpline": "14567",
          },
          timestamp: new Date().toISOString(),
        })

      case "common_symptoms":
        return NextResponse.json({
          commonSymptoms: [
            "Headache",
            "Fever",
            "Cough",
            "Sore throat",
            "Stomach pain",
            "Back pain",
            "Fatigue",
            "Dizziness",
            "Nausea",
            "Chest pain",
            "Shortness of breath",
            "Joint pain",
            "Skin rash",
            "Sleep problems",
            "Anxiety",
          ],
          timestamp: new Date().toISOString(),
        })

      default:
        return NextResponse.json(
          {
            error: "Invalid action parameter",
            availableActions: ["health_tips", "emergency_contacts", "common_symptoms"],
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Gemini Health GET Error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
