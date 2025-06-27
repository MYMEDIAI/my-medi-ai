import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const assessment = await request.json()

    const prompt = `
Please analyze this comprehensive health assessment and provide specific, actionable recommendations:

PATIENT PROFILE:
- Age: ${assessment.age} years old
- Gender: ${assessment.gender}
- Weight: ${assessment.weight} kg
- Height: ${assessment.height} cm
- Location: ${assessment.location}

CURRENT SYMPTOMS:
- Primary symptoms: ${assessment.symptoms}
- Duration: ${assessment.symptomDuration}
- Severity level: ${assessment.symptomSeverity}
- Main concern: ${assessment.primaryConcern}

MEDICAL HISTORY:
- Existing conditions: ${assessment.medicalHistory.length > 0 ? assessment.medicalHistory.join(", ") : "None reported"}
- Current medications: ${assessment.currentMedications || "None"}
- Known allergies: ${assessment.allergies || "None"}

LIFESTYLE FACTORS:
- Physical activity: ${assessment.activityLevel}
- Diet type: ${assessment.dietType}
- Smoking status: ${assessment.smokingStatus}
- Alcohol consumption: ${assessment.alcoholConsumption}
- Sleep duration: ${assessment.sleepHours} hours per night

ADDITIONAL INFORMATION: ${assessment.additionalNotes || "None provided"}

Please provide detailed, personalized recommendations for each of these categories:

1. MEDICATIONS: Suggest appropriate over-the-counter medications, dosages, and precautions
2. DOCTORS: Recommend specific types of healthcare providers, specialists, and when to seek care
3. LABORATORY TESTS: Suggest relevant diagnostic tests, screenings, and monitoring
4. PHARMACY: Provide guidance on pharmacy services, medication access, and health resources
5. DIET PLAN: Create a personalized nutrition plan with specific foods and meal suggestions
6. EXERCISE: Recommend specific physical activities, duration, and intensity suitable for their condition
7. GENERAL ADVICE: Provide comprehensive health guidance, lifestyle modifications, and next steps

Format your response with clear sections and actionable advice. Include appropriate medical disclaimers about consulting healthcare professionals.
`

    const response = await fetch(`${request.nextUrl.origin}/api/ai-integration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        type: "assessment",
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API call failed: ${response.status}`)
    }

    const data = await response.json()
    let recommendations

    if (typeof data.response === "object" && data.response !== null) {
      recommendations = data.response
    } else {
      const aiResponse = data.response || ""

      recommendations = {
        medications:
          extractSection(aiResponse, "MEDICATIONS") ||
          extractSection(aiResponse, "medication") ||
          "Consult with a healthcare provider for appropriate medications. Over-the-counter pain relievers may help with general discomfort, but professional guidance is recommended for proper dosing and safety.",

        doctors:
          extractSection(aiResponse, "DOCTORS") ||
          extractSection(aiResponse, "doctor") ||
          "Schedule an appointment with your primary care physician for initial evaluation. They may refer you to specialists if needed based on your symptoms and medical history.",

        labs:
          extractSection(aiResponse, "LABORATORY") ||
          extractSection(aiResponse, "lab") ||
          "Consider basic health screening including complete blood count, metabolic panel, and tests specific to your symptoms as recommended by your healthcare provider.",

        pharmacy:
          extractSection(aiResponse, "PHARMACY") ||
          extractSection(aiResponse, "pharmacy") ||
          "Visit your local pharmacy for over-the-counter medications and health consultations. Many pharmacies offer health screenings, immunizations, and medication reviews.",

        dietPlan:
          extractSection(aiResponse, "DIET") ||
          extractSection(aiResponse, "nutrition") ||
          "Focus on a balanced diet rich in fruits, vegetables, lean proteins, and whole grains. Stay hydrated and limit processed foods, excessive sugar, and alcohol.",

        exercise:
          extractSection(aiResponse, "EXERCISE") ||
          extractSection(aiResponse, "physical") ||
          "Engage in regular moderate exercise such as walking, swimming, or cycling for 30 minutes most days of the week, adjusted to your current fitness level and health condition.",

        generalAdvice:
          extractSection(aiResponse, "GENERAL") ||
          aiResponse ||
          "Monitor your symptoms closely, maintain good sleep hygiene, manage stress effectively, and don't hesitate to seek immediate medical attention if symptoms worsen. This AI assessment is not a substitute for professional medical advice.",
      }
    }

    return NextResponse.json({
      success: true,
      recommendations,
      provider: data.provider || "unknown",
      message: data.message || null,
    })
  } catch (error) {
    console.error("Health assessment error:", error)

    return NextResponse.json({
      success: false,
      error: "Failed to process health assessment",
      recommendations: {
        medications:
          "Unable to provide specific medication recommendations at this time. Please consult a healthcare provider for appropriate treatment options and proper medication guidance.",
        doctors:
          "Please schedule an appointment with a general practitioner for proper medical evaluation and diagnosis. They can provide personalized care and referrals if needed.",
        labs: "Basic health screening tests may be beneficial. Your doctor can recommend appropriate diagnostic tests based on your symptoms and medical history.",
        pharmacy:
          "Visit your local pharmacy for over-the-counter health products and consultation with a pharmacist about medication options and health resources.",
        dietPlan:
          "Maintain a balanced, nutritious diet with plenty of fruits, vegetables, whole grains, and lean proteins. Stay well-hydrated and consider consulting a nutritionist.",
        exercise:
          "Engage in regular, moderate physical activity as tolerated. Start slowly and gradually increase intensity based on your comfort level and health status.",
        generalAdvice:
          "This service is temporarily unavailable. Please seek professional medical advice for your health concerns. If you have urgent symptoms, contact your healthcare provider immediately.",
      },
    })
  }
}

function extractSection(text: string, sectionName: string): string {
  const lines = text.split("\n")
  let inSection = false
  const sectionContent: string[] = []

  for (const line of lines) {
    const upperLine = line.toUpperCase()

    if (upperLine.includes(sectionName.toUpperCase()) && (upperLine.includes(":") || upperLine.includes("."))) {
      inSection = true
      const colonIndex = line.indexOf(":")
      if (colonIndex !== -1 && colonIndex < line.length - 1) {
        sectionContent.push(line.substring(colonIndex + 1).trim())
      }
      continue
    }

    if (inSection) {
      if (line.trim() === "" || /^\d+\./.test(line.trim()) || /^[A-Z][A-Z\s]+:/.test(line)) {
        if (line.trim() !== "" && !/^\d+\./.test(line.trim())) {
          break
        }
      }

      if (line.trim() !== "") {
        sectionContent.push(line.trim())
      }
    }
  }

  return sectionContent.join(" ").trim()
}
