import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const assessment = await request.json()

    // Create a comprehensive prompt for the AI
    const prompt = `
Based on the following health assessment, provide personalized recommendations in the exact format requested:

PATIENT INFORMATION:
- Age: ${assessment.age}
- Gender: ${assessment.gender}
- Weight: ${assessment.weight} kg
- Height: ${assessment.height} cm
- Location: ${assessment.location}

CURRENT SYMPTOMS:
- Symptoms: ${assessment.symptoms}
- Duration: ${assessment.symptomDuration}
- Severity: ${assessment.symptomSeverity}
- Primary Concern: ${assessment.primaryConcern}

MEDICAL HISTORY:
- Conditions: ${assessment.medicalHistory.join(", ") || "None reported"}
- Current Medications: ${assessment.currentMedications || "None"}
- Allergies: ${assessment.allergies || "None"}

LIFESTYLE:
- Activity Level: ${assessment.activityLevel}
- Diet Type: ${assessment.dietType}
- Smoking: ${assessment.smokingStatus}
- Alcohol: ${assessment.alcoholConsumption}
- Sleep: ${assessment.sleepHours} hours per night

ADDITIONAL NOTES: ${assessment.additionalNotes || "None"}

Please provide recommendations in the following categories:
1. Medication suggestions (over-the-counter or general advice)
2. Doctor/specialist recommendations
3. Laboratory tests that might be helpful
4. Pharmacy options or medication access
5. Personalized diet plan
6. Exercise recommendations
7. General health advice

Format each section as clear, actionable advice. Include disclaimers about consulting healthcare professionals.
`

    // Call the Gemini integration endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/gemini-integration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          type: "assessment",
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API call failed: ${response.status}`)
    }

    const data = await response.json()

    // Parse the AI response into structured recommendations
    const aiResponse = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

    // For structured response, try to parse if it's an object
    let recommendations
    if (typeof data.response === "object" && data.response !== null) {
      recommendations = data.response
    } else {
      // If it's a string response, create a structured format
      recommendations = {
        medications:
          extractSection(aiResponse, "medication") ||
          "Consult with a healthcare provider for appropriate medications based on your symptoms.",
        doctors:
          extractSection(aiResponse, "doctor") ||
          "Consider consulting with a general practitioner or relevant specialist based on your symptoms.",
        labs:
          extractSection(aiResponse, "lab") ||
          "Basic blood work and relevant tests as recommended by your healthcare provider.",
        pharmacy:
          extractSection(aiResponse, "pharmacy") ||
          "Visit your local pharmacy or consult with a pharmacist for over-the-counter options.",
        dietPlan:
          extractSection(aiResponse, "diet") ||
          "Maintain a balanced diet rich in fruits, vegetables, and whole grains.",
        exercise:
          extractSection(aiResponse, "exercise") ||
          "Engage in regular physical activity as appropriate for your condition and fitness level.",
        generalAdvice: aiResponse || "Please consult with healthcare professionals for personalized medical advice.",
      }
    }

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error) {
    console.error("Health assessment error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process health assessment",
        recommendations: {
          medications:
            "Unable to provide medication recommendations at this time. Please consult a healthcare provider.",
          doctors: "Please consult with a general practitioner for proper medical evaluation.",
          labs: "Basic health screening tests may be beneficial. Consult your doctor.",
          pharmacy: "Visit your local pharmacy for over-the-counter health products.",
          dietPlan: "Maintain a balanced, nutritious diet with plenty of fruits and vegetables.",
          exercise: "Engage in regular, moderate physical activity as tolerated.",
          generalAdvice:
            "This service is temporarily unavailable. Please seek professional medical advice for your health concerns.",
        },
      },
      { status: 500 },
    )
  }
}

// Helper function to extract sections from AI response
function extractSection(text: string, section: string): string {
  const patterns = {
    medication: /(?:medication|medicine|drug|treatment)[\s\S]*?(?=(?:\d+\.|[A-Z][a-z]+:|$))/i,
    doctor: /(?:doctor|physician|specialist|medical professional)[\s\S]*?(?=(?:\d+\.|[A-Z][a-z]+:|$))/i,
    lab: /(?:lab|test|screening|blood work|diagnostic)[\s\S]*?(?=(?:\d+\.|[A-Z][a-z]+:|$))/i,
    pharmacy: /(?:pharmacy|pharmacist|over-the-counter|otc)[\s\S]*?(?=(?:\d+\.|[A-Z][a-z]+:|$))/i,
    diet: /(?:diet|nutrition|food|eating|meal)[\s\S]*?(?=(?:\d+\.|[A-Z][a-z]+:|$))/i,
    exercise: /(?:exercise|physical activity|fitness|workout)[\s\S]*?(?=(?:\d+\.|[A-Z][a-z]+:|$))/i,
  }

  const match = text.match(patterns[section as keyof typeof patterns])
  return match ? match[0].trim() : ""
}
