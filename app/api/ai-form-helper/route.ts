import { type NextRequest, NextResponse } from "next/server"

interface FormHelperRequest {
  type: "explain_term" | "suggest_questions" | "cultural_adapt" | "process_voice" | "auto_complete"
  data: {
    term?: string
    symptom?: string
    userProfile?: {
      age: number
      gender: string
      location: string
      diet: "vegetarian" | "non-vegetarian" | "vegan"
      familyType: "nuclear" | "joint"
      economicStatus: "low" | "middle" | "high"
      language: string
    }
    voiceInput?: string
    partialInput?: string
    context?: string
  }
}

interface FormHelperResponse {
  explanation?: string
  suggestions?: string[]
  culturalAdaptation?: {
    dietaryRecommendations: string[]
    lifestyleAdjustments: string[]
    ayurvedicConsiderations: string[]
    economicAlternatives: string[]
    familyInvolvement: string[]
  }
  structuredData?: StructuredMedicalData
  autoComplete?: Array<{
    text: string
    category: string
    confidence: number
  }>
  translation?: {
    originalText: string
    translatedText: string
    language: string
  }
}

interface VoiceProcessingRequest {
  type: "process_voice" | "analyze_symptoms" | "extract_medical_terms" | "generate_suggestions"
  data: {
    voiceInput?: string
    symptoms?: string[]
    medicalHistory?: string[]
    currentMedications?: string[]
    language?: string
  }
}

interface MedicalTermExtraction {
  symptoms: string[]
  medications: string[]
  bodyParts: string[]
  timeReferences: string[]
  severityIndicators: string[]
  medicalConditions: string[]
}

interface StructuredMedicalData {
  primarySymptoms: string[]
  secondarySymptoms: string[]
  duration: string
  severity: number
  bodyParts: string[]
  associatedFactors: string[]
  medicalTerms: MedicalTermExtraction
  urgencyLevel: "low" | "medium" | "high" | "critical"
  suggestedQuestions: string[]
  recommendedActions: string[]
}

// Medical conditions dictionary for explanations
const MEDICAL_CONDITIONS = [
  {
    term: "hypertension",
    explanation: "High blood pressure - when blood pressure in arteries is consistently too high",
  },
  { term: "diabetes", explanation: "A group of metabolic disorders characterized by high blood sugar levels" },
  {
    term: "asthma",
    explanation: "A respiratory condition marked by attacks of spasm in the bronchi causing difficulty breathing",
  },
  { term: "migraine", explanation: "A recurrent throbbing headache that typically affects one side of the head" },
  { term: "arthritis", explanation: "Inflammation of one or more joints, causing pain and stiffness" },
  { term: "fever", explanation: "Elevated body temperature, usually indicating infection or illness" },
  { term: "cough", explanation: "A sudden expulsion of air from the lungs to clear irritants from airways" },
  { term: "headache", explanation: "Pain in the head or upper neck, can be tension, cluster, or migraine type" },
  { term: "nausea", explanation: "Feeling of sickness with an inclination to vomit" },
  { term: "fatigue", explanation: "Extreme tiredness resulting from mental or physical exertion or illness" },
  { term: "chest pain", explanation: "Discomfort in the chest area, can indicate heart, lung, or muscle issues" },
  { term: "shortness of breath", explanation: "Difficulty breathing or feeling of not getting enough air" },
  { term: "dizziness", explanation: "Feeling of being lightheaded, unsteady, or having a spinning sensation" },
  { term: "insomnia", explanation: "Inability to fall asleep or stay asleep regularly" },
  {
    term: "anxiety",
    explanation: "Feeling of worry, nervousness, or unease about something with an uncertain outcome",
  },
]

// Common medical terms for autocomplete
const MEDICAL_TERMS = [
  "fever",
  "headache",
  "cough",
  "sore throat",
  "nausea",
  "vomiting",
  "diarrhea",
  "constipation",
  "chest pain",
  "shortness of breath",
  "dizziness",
  "fatigue",
  "insomnia",
  "anxiety",
  "depression",
  "hypertension",
  "diabetes",
  "asthma",
  "arthritis",
  "migraine",
  "allergies",
  "rash",
  "itching",
  "stomach ache",
  "back pain",
  "joint pain",
  "muscle pain",
  "burning sensation",
  "numbness",
  "swelling",
  "weight loss",
  "weight gain",
  "loss of appetite",
  "increased appetite",
]

function explainMedicalTerm(term: string): string {
  const normalizedTerm = term.toLowerCase().trim()
  const condition = MEDICAL_CONDITIONS.find(
    (condition) =>
      condition.term.toLowerCase() === normalizedTerm ||
      condition.term.toLowerCase().includes(normalizedTerm) ||
      normalizedTerm.includes(condition.term.toLowerCase()),
  )

  if (condition) {
    return condition.explanation
  }

  // Fallback explanations for common terms
  const fallbackExplanations: { [key: string]: string } = {
    pain: "Physical suffering or discomfort caused by illness or injury",
    ache: "A continuous or prolonged dull pain",
    swelling: "Enlargement of a body part due to fluid buildup or inflammation",
    rash: "Area of irritated or swollen skin",
    burning: "A hot, stinging sensation",
    numbness: "Loss of sensation or feeling in a body part",
    weakness: "Lack of physical strength or energy",
  }

  for (const [key, explanation] of Object.entries(fallbackExplanations)) {
    if (normalizedTerm.includes(key)) {
      return explanation
    }
  }

  return `${term} is a medical term that may require professional evaluation. Please consult with a healthcare provider for detailed information.`
}

function generateAutoComplete(query: string): string[] {
  if (!query || query.length < 2) return []

  const normalizedQuery = query.toLowerCase().trim()
  return MEDICAL_TERMS.filter((term) => term.toLowerCase().includes(normalizedQuery)).slice(0, 5) // Return top 5 matches
}

function processVoiceInput(transcript: string): { processedText: string; suggestions: string[] } {
  // Clean up common voice recognition errors
  const processed = transcript
    .replace(/\bfever\b/gi, "fever")
    .replace(/\bhead ache\b/gi, "headache")
    .replace(/\bstomach ache\b/gi, "stomach ache")
    .replace(/\bsore throat\b/gi, "sore throat")
    .replace(/\bchest pain\b/gi, "chest pain")

  // Extract potential symptoms
  const suggestions = MEDICAL_TERMS.filter((term) => processed.toLowerCase().includes(term.toLowerCase())).slice(0, 3)

  return {
    processedText: processed,
    suggestions,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "explain_term":
        const { term } = data || {}
        if (!term) {
          return NextResponse.json({ error: "Term is required" }, { status: 400 })
        }
        return NextResponse.json({
          success: true,
          explanation: explainMedicalTerm(term),
          term,
        })

      case "autocomplete":
        const { query } = data || {}
        if (!query) {
          return NextResponse.json({ error: "Query is required" }, { status: 400 })
        }
        return NextResponse.json({
          success: true,
          suggestions: generateAutoComplete(query),
        })

      case "process_voice":
        const { transcript } = data || {}
        if (!transcript) {
          return NextResponse.json({ error: "Transcript is required" }, { status: 400 })
        }
        const voiceResult = processVoiceInput(transcript)
        return NextResponse.json({
          success: true,
          ...voiceResult,
        })

      case "form_validation":
        const { formData } = data || {}
        if (!formData) {
          return NextResponse.json({ error: "Form data is required" }, { status: 400 })
        }

        const validation = {
          isValid: true,
          errors: [] as string[],
          suggestions: [] as string[],
        }

        // Basic validation
        if (formData.symptoms && formData.symptoms.length < 3) {
          validation.errors.push("Please provide more detailed symptom description")
        }

        if (formData.age && (formData.age < 0 || formData.age > 120)) {
          validation.errors.push("Please enter a valid age")
        }

        if (validation.errors.length > 0) {
          validation.isValid = false
        }

        return NextResponse.json({
          success: true,
          validation,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("AI Form Helper Error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
