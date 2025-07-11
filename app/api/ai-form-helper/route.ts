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
  structuredData?: {
    symptoms: string[]
    duration: string
    severity: number
    associatedSymptoms: string[]
  }
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

// Medical terms dictionary with simple explanations
const MEDICAL_TERMS = {
  hypertension: {
    simple: "High Blood Pressure",
    explanation:
      "When the force of blood against your artery walls is too high. Like water flowing through a pipe with too much pressure.",
    symptoms: ["headache", "dizziness", "chest pain"],
    indianContext:
      "Very common in India due to stress, salt intake, and lifestyle. Can be managed with diet changes and yoga.",
  },
  diabetes: {
    simple: "High Blood Sugar",
    explanation:
      "When your body cannot properly use sugar from food, causing sugar levels in blood to become too high.",
    symptoms: ["frequent urination", "excessive thirst", "fatigue"],
    indianContext:
      "Common in Indian families. Rice, roti, and sweets can affect blood sugar. Regular monitoring is important.",
  },
  gastritis: {
    simple: "Stomach Inflammation",
    explanation:
      "When the lining of your stomach becomes swollen and irritated, often causing pain and burning sensation.",
    symptoms: ["stomach pain", "nausea", "bloating"],
    indianContext: "Often caused by spicy food, irregular eating habits, or stress. Common in Indian diet patterns.",
  },
  migraine: {
    simple: "Severe Headache",
    explanation: "A very painful headache that can last hours or days, often with sensitivity to light and sound.",
    symptoms: ["severe headache", "nausea", "light sensitivity"],
    indianContext: "Can be triggered by heat, dehydration, or stress. Common during summer months in India.",
  },
  arthritis: {
    simple: "Joint Pain and Stiffness",
    explanation: "When joints become swollen, painful, and stiff. Like rusty hinges that don't move smoothly.",
    symptoms: ["joint pain", "stiffness", "swelling"],
    indianContext: "Common in older adults. Monsoon weather can worsen symptoms. Turmeric and warm oil massage help.",
  },
  asthma: {
    simple: "Breathing Difficulty",
    explanation: "When airways in lungs become narrow, making it hard to breathe. Like breathing through a straw.",
    symptoms: ["shortness of breath", "wheezing", "cough"],
    indianContext: "Air pollution in Indian cities can trigger asthma. Dust and smoke are common triggers.",
  },
}

// Ayurvedic considerations for common conditions
const AYURVEDIC_WISDOM = {
  digestive: {
    recommendations: [
      "Drink warm water with lemon in morning",
      "Eat largest meal at lunch when digestion is strongest",
      "Include ginger, cumin, and coriander in cooking",
      "Avoid cold drinks with meals",
    ],
    herbs: ["Triphala for digestion", "Ajwain for gas", "Jeera water for acidity"],
  },
  respiratory: {
    recommendations: [
      "Practice pranayama (breathing exercises)",
      "Steam inhalation with eucalyptus oil",
      "Drink warm turmeric milk before bed",
      "Avoid cold and damp foods",
    ],
    herbs: ["Tulsi for cough", "Mulethi for throat", "Ginger for congestion"],
  },
  stress: {
    recommendations: [
      "Practice meditation or yoga daily",
      "Oil massage (abhyanga) before bath",
      "Maintain regular sleep schedule",
      "Spend time in nature",
    ],
    herbs: ["Ashwagandha for stress", "Brahmi for mental clarity", "Jatamansi for sleep"],
  },
}

// Regional adaptations for different parts of India
const REGIONAL_ADAPTATIONS = {
  north: {
    climate: "Cold winters, hot summers",
    commonIssues: ["joint pain in winter", "heat stroke in summer"],
    dietaryAdvice: ["Include warming spices in winter", "Cooling foods like lassi in summer"],
  },
  south: {
    climate: "Hot and humid",
    commonIssues: ["skin infections", "digestive issues"],
    dietaryAdvice: ["Include coconut water", "Use curry leaves and tamarind"],
  },
  west: {
    climate: "Dry and hot",
    commonIssues: ["dehydration", "respiratory problems"],
    dietaryAdvice: ["Increase water intake", "Include buttermilk and fresh fruits"],
  },
  east: {
    climate: "Humid with monsoons",
    commonIssues: ["fungal infections", "joint pain"],
    dietaryAdvice: ["Include fish for omega-3", "Use mustard oil for cooking"],
  },
}

// Voice processing patterns
const VOICE_PATTERNS = [
  {
    pattern: /feeling (tired|exhausted|weak|fatigue)/i,
    symptom: "fatigue",
    severity: 5,
  },
  {
    pattern: /head(ache|pain)|my head (hurts|is paining)/i,
    symptom: "headache",
    severity: 6,
  },
  {
    pattern: /stomach (pain|ache|hurts)|pet mein dard/i,
    symptom: "stomach pain",
    severity: 6,
  },
  {
    pattern: /fever|bukhar|temperature/i,
    symptom: "fever",
    severity: 7,
  },
  {
    pattern: /cough|khansi|throat/i,
    symptom: "cough",
    severity: 4,
  },
  {
    pattern: /for (\d+) days?/i,
    duration: "days",
    extract: "number",
  },
  {
    pattern: /since (yesterday|morning|evening)/i,
    duration: "1-2 days",
  },
  {
    pattern: /very (bad|severe|painful)/i,
    severity: 8,
  },
  {
    pattern: /little bit|mild|slight/i,
    severity: 3,
  },
]

function explainMedicalTerm(term: string, userProfile?: any): string {
  const termLower = term.toLowerCase()
  const medicalTerm = MEDICAL_TERMS[termLower as keyof typeof MEDICAL_TERMS]

  if (!medicalTerm) {
    return `${term} is a medical condition. Please consult with a healthcare provider for detailed information about this condition.`
  }

  let explanation = `**${medicalTerm.simple}**\n\n${medicalTerm.explanation}\n\n`

  if (medicalTerm.symptoms.length > 0) {
    explanation += `**Common symptoms:** ${medicalTerm.symptoms.join(", ")}\n\n`
  }

  if (medicalTerm.indianContext) {
    explanation += `**In Indian context:** ${medicalTerm.indianContext}\n\n`
  }

  // Add regional considerations if location is provided
  if (userProfile?.location) {
    const region = getRegionFromLocation(userProfile.location)
    const regionalInfo = REGIONAL_ADAPTATIONS[region as keyof typeof REGIONAL_ADAPTATIONS]
    if (regionalInfo) {
      explanation += `**For your region (${region}):** ${regionalInfo.dietaryAdvice.join(", ")}`
    }
  }

  return explanation
}

function generateQuestionSuggestions(symptom: string, context?: string): string[] {
  const suggestions: string[] = []

  // Basic symptom questions
  suggestions.push(
    `When did your ${symptom} start?`,
    `How severe is your ${symptom} on a scale of 1-10?`,
    `What makes your ${symptom} better or worse?`,
  )

  // Symptom-specific questions
  switch (symptom.toLowerCase()) {
    case "headache":
      suggestions.push(
        "Is the headache on one side or both sides?",
        "Do you have sensitivity to light or sound?",
        "Have you been stressed lately?",
        "Are you drinking enough water?",
      )
      break
    case "stomach pain":
      suggestions.push(
        "Is the pain before or after eating?",
        "Do you have nausea or vomiting?",
        "Have you eaten anything unusual?",
        "Is the pain sharp or dull?",
      )
      break
    case "fever":
      suggestions.push(
        "What is your temperature?",
        "Do you have chills or sweating?",
        "Any body aches?",
        "Have you been around sick people?",
      )
      break
    case "cough":
      suggestions.push(
        "Is it a dry cough or with phlegm?",
        "Is it worse at night?",
        "Any chest pain with coughing?",
        "Have you been exposed to dust or smoke?",
      )
      break
  }

  return suggestions.slice(0, 6) // Return top 6 suggestions
}

function generateCulturalAdaptation(symptom: string, userProfile: any) {
  const adaptation = {
    dietaryRecommendations: [] as string[],
    lifestyleAdjustments: [] as string[],
    ayurvedicConsiderations: [] as string[],
    economicAlternatives: [] as string[],
    familyInvolvement: [] as string[],
  }

  // Dietary recommendations based on diet preference
  if (userProfile.diet === "vegetarian") {
    adaptation.dietaryRecommendations.push(
      "Include protein-rich dal and paneer",
      "Add iron-rich spinach and dates",
      "Include vitamin B12 supplements if needed",
    )
  } else {
    adaptation.dietaryRecommendations.push(
      "Include lean chicken or fish for protein",
      "Eggs are good source of nutrients",
      "Balance meat with vegetables",
    )
  }

  // Economic considerations
  if (userProfile.economicStatus === "low") {
    adaptation.economicAlternatives.push(
      "Use home remedies like ginger-honey for cough",
      "Generic medicines are equally effective",
      "Government hospitals provide affordable care",
      "Community health centers offer free consultations",
    )
  }

  // Family involvement for joint families
  if (userProfile.familyType === "joint") {
    adaptation.familyInvolvement.push(
      "Inform family elders about your condition",
      "Ask family to help with medication reminders",
      "Share dietary restrictions with family cook",
      "Family support is important for recovery",
    )
  }

  // Ayurvedic considerations based on symptom
  const symptomCategory = categorizeSymptom(symptom)
  const ayurvedicAdvice = AYURVEDIC_WISDOM[symptomCategory as keyof typeof AYURVEDIC_WISDOM]
  if (ayurvedicAdvice) {
    adaptation.ayurvedicConsiderations = ayurvedicAdvice.recommendations
  }

  return adaptation
}

function processVoiceInput(voiceText: string) {
  const structuredData = {
    symptoms: [] as string[],
    duration: "",
    severity: 5,
    associatedSymptoms: [] as string[],
  }

  // Process voice text through patterns
  for (const pattern of VOICE_PATTERNS) {
    const match = voiceText.match(pattern.pattern)
    if (match) {
      if (pattern.symptom) {
        structuredData.symptoms.push(pattern.symptom)
      }
      if (pattern.severity) {
        structuredData.severity = pattern.severity
      }
      if (pattern.duration) {
        if (pattern.extract === "number" && match[1]) {
          structuredData.duration = `${match[1]} ${pattern.duration}`
        } else {
          structuredData.duration = pattern.duration
        }
      }
    }
  }

  return structuredData
}

function generateAutoComplete(partialInput: string): Array<{
  text: string
  category: string
  confidence: number
}> {
  const suggestions: Array<{
    text: string
    category: string
    confidence: number
  }> = []

  const input = partialInput.toLowerCase()

  // Medical terms auto-complete
  Object.entries(MEDICAL_TERMS).forEach(([term, data]) => {
    if (term.includes(input) || data.simple.toLowerCase().includes(input)) {
      suggestions.push({
        text: data.simple,
        category: "Medical Term",
        confidence: term.startsWith(input) ? 0.9 : 0.7,
      })
    }
  })

  // Common symptoms
  const commonSymptoms = [
    "headache",
    "fever",
    "cough",
    "stomach pain",
    "back pain",
    "chest pain",
    "dizziness",
    "fatigue",
    "nausea",
    "vomiting",
  ]

  commonSymptoms.forEach((symptom) => {
    if (symptom.includes(input)) {
      suggestions.push({
        text: symptom,
        category: "Symptom",
        confidence: symptom.startsWith(input) ? 0.9 : 0.6,
      })
    }
  })

  // Sort by confidence and return top 5
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5)
}

function getRegionFromLocation(location: string): string {
  const northStates = ["delhi", "punjab", "haryana", "rajasthan", "uttar pradesh", "himachal pradesh"]
  const southStates = ["tamil nadu", "kerala", "karnataka", "andhra pradesh", "telangana"]
  const westStates = ["maharashtra", "gujarat", "rajasthan", "goa"]
  const eastStates = ["west bengal", "odisha", "jharkhand", "bihar"]

  const locationLower = location.toLowerCase()

  if (northStates.some((state) => locationLower.includes(state))) return "north"
  if (southStates.some((state) => locationLower.includes(state))) return "south"
  if (westStates.some((state) => locationLower.includes(state))) return "west"
  if (eastStates.some((state) => locationLower.includes(state))) return "east"

  return "general"
}

function categorizeSymptom(symptom: string): string {
  const digestiveSymptoms = ["stomach pain", "nausea", "vomiting", "diarrhea", "constipation", "acidity"]
  const respiratorySymptoms = ["cough", "shortness of breath", "chest pain", "wheezing"]
  const stressSymptoms = ["headache", "fatigue", "insomnia", "anxiety", "depression"]

  const symptomLower = symptom.toLowerCase()

  if (digestiveSymptoms.some((s) => symptomLower.includes(s))) return "digestive"
  if (respiratorySymptoms.some((s) => symptomLower.includes(s))) return "respiratory"
  if (stressSymptoms.some((s) => symptomLower.includes(s))) return "stress"

  return "general"
}

export async function POST(request: NextRequest) {
  try {
    const { type, data }: FormHelperRequest = await request.json()

    const response: FormHelperResponse = {}

    switch (type) {
      case "explain_term":
        if (data.term) {
          response.explanation = explainMedicalTerm(data.term, data.userProfile)
        }
        break

      case "suggest_questions":
        if (data.symptom) {
          response.suggestions = generateQuestionSuggestions(data.symptom, data.context)
        }
        break

      case "cultural_adapt":
        if (data.symptom && data.userProfile) {
          response.culturalAdaptation = generateCulturalAdaptation(data.symptom, data.userProfile)
        }
        break

      case "process_voice":
        if (data.voiceInput) {
          response.structuredData = processVoiceInput(data.voiceInput)
        }
        break

      case "auto_complete":
        if (data.partialInput) {
          response.autoComplete = generateAutoComplete(data.partialInput)
        }
        break

      default:
        throw new Error("Invalid request type")
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("AI Form Helper error:", error)
    return NextResponse.json(
      {
        error: "Unable to process request",
        explanation: "AI assistant is temporarily unavailable. Please try again.",
      },
      { status: 500 },
    )
  }
}
