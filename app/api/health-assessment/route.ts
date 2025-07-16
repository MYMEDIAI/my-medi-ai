import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const assessment = await request.json()

    const prompt = `
Analyze this health assessment and provide SIMPLIFIED, ORGANIZED recommendations:

PATIENT: ${assessment.age}yr ${assessment.gender}, ${assessment.weight}kg, ${assessment.height}cm
LOCATION: ${assessment.location}
SYMPTOMS: ${assessment.symptoms} (${assessment.symptomDuration}, ${assessment.symptomSeverity})
CONCERN: ${assessment.primaryConcern}
CONDITIONS: ${assessment.medicalHistory.length > 0 ? assessment.medicalHistory.join(", ") : "None"}
MEDICATIONS: ${assessment.currentMedications || "None"}
ALLERGIES: ${assessment.allergies || "None"}
ACTIVITY: ${assessment.activityLevel}
DIET: ${assessment.dietType}
LIFESTYLE: ${assessment.smokingStatus}, ${assessment.alcoholConsumption}, ${assessment.sleepHours}h sleep

Provide CLEAR, BULLET-POINT recommendations in these exact sections:
MEDICATIONS, DOCTORS, LABS, PHARMACY, DIET, EXERCISE, GENERAL ADVICE

Keep each point short and actionable. Use bullet points (•) only.
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
          "• Consult healthcare provider for appropriate medications\n• Follow prescribed dosages carefully\n• Report any side effects immediately",

        doctors:
          extractSection(aiResponse, "DOCTORS") ||
          "• Schedule appointment with primary care physician\n• Bring list of symptoms and medications\n• Consider specialist if symptoms persist",

        labs:
          extractSection(aiResponse, "LABS") ||
          "• Basic blood work (CBC, metabolic panel)\n• Tests specific to your symptoms\n• Follow up on results with doctor",

        pharmacy:
          extractSection(aiResponse, "PHARMACY") ||
          "• Visit local pharmacy for medications\n• Ask about generic alternatives\n• Use pharmacy consultation services",

        dietPlan:
          extractSection(aiResponse, "DIET") ||
          "• Eat balanced meals with fruits and vegetables\n• Stay hydrated with 8+ glasses water daily\n• Limit processed foods and sugar",

        exercise:
          extractSection(aiResponse, "EXERCISE") ||
          "• Start with 20-30 minutes daily walking\n• Include stretching or light yoga\n• Gradually increase activity level",

        generalAdvice:
          extractSection(aiResponse, "GENERAL ADVICE") ||
          "• Monitor symptoms and keep health diary\n• Get adequate sleep (7-9 hours)\n• Seek immediate care if symptoms worsen",
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
          "• Consult healthcare provider for medication guidance\n• Follow all prescription instructions\n• Report side effects promptly",
        doctors:
          "• Schedule appointment with general practitioner\n• Prepare list of symptoms and concerns\n• Bring current medications list",
        labs: "• Basic health screening recommended\n• Discuss appropriate tests with doctor\n• Follow up on all results",
        pharmacy:
          "• Visit local pharmacy for health products\n• Consult pharmacist for medication questions\n• Consider generic alternatives",
        dietPlan:
          "• Maintain balanced, nutritious diet\n• Stay well-hydrated throughout day\n• Limit processed and sugary foods",
        exercise:
          "• Engage in regular moderate activity\n• Start slowly and increase gradually\n• Listen to your body's limits",
        generalAdvice:
          "• Service temporarily unavailable\n• Seek professional medical advice\n• Contact healthcare provider for urgent symptoms",
      },
    })
  }
}

function extractSection(text: string, sectionName: string): string {
  const lines = text.split("\n")
  let inSection = false
  const sectionContent: string[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    const upperLine = trimmedLine.toUpperCase()

    // Check if this line starts a new section
    if (upperLine.includes(sectionName.toUpperCase()) && upperLine.includes(":")) {
      inSection = true
      // If there's content after the colon, include it
      const colonIndex = line.indexOf(":")
      if (colonIndex !== -1 && colonIndex < line.length - 1) {
        const afterColon = line.substring(colonIndex + 1).trim()
        if (afterColon) {
          sectionContent.push(afterColon)
        }
      }
      continue
    }

    // Check if we've hit another section header
    if (inSection && /^[A-Z][A-Z\s]+:/.test(trimmedLine) && !trimmedLine.startsWith("•")) {
      break
    }

    // Collect content while in the section
    if (inSection && trimmedLine) {
      sectionContent.push(trimmedLine)
    }
  }

  return sectionContent.join("\n").trim()
}
