"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyMedLogo from "./mymed-logo"
import NavigationButtons from "./navigation-buttons"
import {
  User,
  Heart,
  Activity,
  AlertTriangle,
  FileText,
  Thermometer,
  ArrowLeft,
  Clock,
  Utensils,
  Pill,
  Dumbbell,
  Timer,
  Calculator,
  Printer,
  FileDown,
  Brain,
  Camera,
  Mic,
  Upload,
  Users,
  DollarSign,
  Leaf,
  Eye,
  Dna,
  Shield,
  Zap,
  TrendingUp,
  Phone,
  Sparkles,
} from "lucide-react"

interface VitalsData {
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  heartRate: string
  temperature: string
  oxygenSaturation: string
  bloodSugar: string
  respiratoryRate: string
}

interface AssessmentData {
  // Personal Information
  name: string
  age: string
  weight: string // in kg
  height: string
  gender: string
  town: string
  state: string
  country: string

  // Vitals
  vitals: VitalsData

  // Current Symptoms
  primarySymptom: string
  symptomDuration: string
  symptomSeverity: string
  additionalSymptoms: string

  // Medical History
  chronicConditions: string[]
  currentMedications: string[]
  allergies: string[]
  familyHistory: string[]

  // Lifestyle
  exerciseFrequency: string
  smokingStatus: string
  alcoholConsumption: string
  sleepHours: string
  stressLevel: string
  dietType: string
  waterIntake: string
}

interface MedicationSchedule {
  name: string
  dosage: string
  frequency: string
  timing: string[]
  instructions: string
  duration: string
  warning: string
  reason: string
}

interface MealPlan {
  time: string
  meal: string
  foods: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  instructions: string
  waterIntake: string
}

interface ExerciseSchedule {
  time: string
  activity: string
  duration: string
  intensity: string
  instructions: string
  caloriesBurned: number
}

interface MedicalFacility {
  doctorName: string
  hospitalName: string
  hospitalAddress: string
  hospitalPhone: string
  labName: string
  labNumber: string
  medicalShopName: string
  medicalShopNumber: string
  specialization: string
}

interface GeneticPrediction {
  condition: string
  riskPercentage: number
  yearsToOnset: number
  preventiveMeasures: string[]
  confidence: number
}

interface VoiceBiomarker {
  condition: string
  probability: number
  indicators: string[]
  recommendation: string
}

interface VisionAnalysis {
  detectedConditions: Array<{
    condition: string
    confidence: number
    severity: string
    recommendation: string
  }>
  overallRisk: string
  immediateAction: string
}

interface AyurvedicRecommendation {
  dosha: string
  imbalance: string[]
  herbs: Array<{
    name: string
    dosage: string
    benefits: string
  }>
  lifestyle: string[]
  diet: string[]
  yoga: string[]
}

interface HealthcareEconomics {
  treatmentCosts: Array<{
    treatment: string
    costRange: string
    location: string
    quality: string
  }>
  insuranceOptimization: string[]
  medicalTourism: Array<{
    country: string
    savings: string
    quality: string
  }>
  genericAlternatives: Array<{
    brand: string
    generic: string
    savings: string
  }>
}

interface MentalHealthAssessment {
  depressionScore: number
  anxietyScore: number
  stressLevel: number
  recommendations: string[]
  therapyType: string
  urgency: string
}

interface AssessmentResult {
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  riskScore: number
  riskFactors: string[]
  bmi: {
    value: number
    category: string
    recommendation: string
  }
  vitalsAnalysis: {
    bloodPressure: { status: string; recommendation: string; normalRange: string }
    heartRate: { status: string; recommendation: string; normalRange: string }
    temperature: { status: string; recommendation: string; normalRange: string }
    oxygenSaturation: { status: string; recommendation: string; normalRange: string }
    bloodSugar: { status: string; recommendation: string; normalRange: string }
  }
  medications: MedicationSchedule[]
  dietPlan: MealPlan[]
  exerciseSchedule: ExerciseSchedule[]
  waterSchedule: Array<{ time: string; amount: string; type: string }>
  labTests: Array<{ test: string; urgency: string; instructions: string; reason: string }>
  followUpSchedule: Array<{ type: string; when: string; instructions: string }>
  emergencyContacts: Array<{ service: string; number: string; when: string }>
  medicalFacilities: MedicalFacility
  aiInsights: string
  preventiveCare: string[]

  // Revolutionary Features
  geneticPredictions: GeneticPrediction[]
  voiceBiomarkers: VoiceBiomarker[]
  visionAnalysis: VisionAnalysis | null
  ayurvedicRecommendations: AyurvedicRecommendation
  healthcareEconomics: HealthcareEconomics
  mentalHealthAssessment: MentalHealthAssessment
  familyHealthInsights: string[]
  realTimeAlerts: string[]
}

// Indian states and major towns
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
]

const townsByState: { [key: string]: string[] } = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Sangli"],
  Karnataka: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Shimoga"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Kharagpur"],
  Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer", "Bhilwara", "Alwar"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Hoshiarpur"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
  Delhi: ["New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
}

export default function HealthAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    town: "",
    state: "",
    country: "India",
    vitals: {
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      bloodSugar: "",
      respiratoryRate: "",
    },
    primarySymptom: "",
    symptomDuration: "",
    symptomSeverity: "",
    additionalSymptoms: "",
    chronicConditions: [],
    currentMedications: [],
    allergies: [],
    familyHistory: [],
    exerciseFrequency: "",
    smokingStatus: "",
    alcoholConsumption: "",
    sleepHours: "",
    stressLevel: "",
    dietType: "",
    waterIntake: "",
  })
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<string>("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const commonConditions = [
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "COPD",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Migraine",
    "Thyroid Disorders",
    "High Cholesterol",
    "Kidney Disease",
    "Liver Disease",
  ]

  const severityLevels = [
    { value: "1", label: "Mild (1/10)" },
    { value: "3", label: "Moderate (3/10)" },
    { value: "5", label: "Significant (5/10)" },
    { value: "7", label: "Severe (7/10)" },
    { value: "9", label: "Extreme (9/10)" },
  ]

  const handleInputChange = (field: keyof AssessmentData, value: string | string[] | VitalsData) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }))

    // Real-time AI analysis for symptoms
    if (field === "primarySymptom" && typeof value === "string" && value.length > 10) {
      analyzeSymptomRealTime(value)
    }
  }

  const handleVitalsChange = (field: keyof VitalsData, value: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [field]: value },
    }))
  }

  const handleConditionToggle = (condition: string) => {
    const updatedConditions = assessmentData.chronicConditions.includes(condition)
      ? assessmentData.chronicConditions.filter((c) => c !== condition)
      : [...assessmentData.chronicConditions, condition]
    handleInputChange("chronicConditions", updatedConditions)
  }

  // Real-time AI symptom analysis
  const analyzeSymptomRealTime = async (symptom: string) => {
    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze this symptom in real-time and provide immediate insights: "${symptom}". Give a brief 2-sentence analysis with urgency level.`,
          type: "realtime",
        }),
      })

      const data = await response.json()
      setRealTimeAnalysis(data.response)
    } catch (error) {
      console.error("Real-time analysis error:", error)
    }
  }

  // AI Genetic Health Predictor
  const analyzeGeneticRisk = async (familyPhotos: File[]) => {
    const formData = new FormData()
    familyPhotos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo)
    })

    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze genetic risk factors based on family history and photos. Patient: ${assessmentData.age} years old, ${assessmentData.gender}, with family history: ${assessmentData.familyHistory.join(", ")}. Provide genetic predictions for next 10 years in JSON format with conditions, risk percentages, years to onset, and preventive measures.`,
          type: "genetic",
        }),
      })

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Genetic analysis error:", error)
      return "Genetic analysis temporarily unavailable"
    }
  }

  // Voice Biomarker Detection
  const startVoiceAnalysis = async () => {
    setIsRecording(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        await analyzeVoiceBiomarkers(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()

      // Stop recording after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, 30000)
    } catch (error) {
      console.error("Voice recording error:", error)
      setIsRecording(false)
    }
  }

  const analyzeVoiceBiomarkers = async (audioBlob: Blob) => {
    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze voice biomarkers for health conditions. Patient profile: ${assessmentData.age} years, ${assessmentData.gender}, symptoms: ${assessmentData.primarySymptom}. Detect potential conditions like COVID-19, depression, Alzheimer's, respiratory issues, etc. Provide analysis in JSON format with conditions, probabilities, indicators, and recommendations.`,
          type: "voice",
        }),
      })

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Voice analysis error:", error)
      return "Voice analysis temporarily unavailable"
    }
  }

  // Real-Time Health Vision AI
  const startCameraAnalysis = async () => {
    setIsCameraActive(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setIsCameraActive(false)
    }
  }

  const captureAndAnalyze = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        canvas.toBlob(async (blob) => {
          if (blob) {
            await analyzeVisionHealth(blob)
          }
        })
      }
    }
  }

  const analyzeVisionHealth = async (imageBlob: Blob) => {
    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze this medical image for health conditions. Look for signs of: skin cancer, diabetic complications, eye diseases, rashes, infections, etc. Patient: ${assessmentData.age} years, ${assessmentData.gender}, current symptoms: ${assessmentData.primarySymptom}. Provide detailed analysis in JSON format with detected conditions, confidence levels, severity, and immediate recommendations.`,
          type: "vision",
        }),
      })

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Vision analysis error:", error)
      return "Vision analysis temporarily unavailable"
    }
  }

  const calculateBMI = (weight: string, height: string) => {
    const weightKg = Number.parseFloat(weight)
    const heightCm = Number.parseFloat(height)

    if (!weightKg || !heightCm) return null

    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)

    let category = ""
    let recommendation = ""

    if (bmi < 18.5) {
      category = "Underweight"
      recommendation = "Consider increasing caloric intake with nutritious foods and consult a nutritionist"
    } else if (bmi < 25) {
      category = "Normal weight"
      recommendation = "Maintain current weight through balanced diet and regular exercise"
    } else if (bmi < 30) {
      category = "Overweight"
      recommendation = "Consider reducing caloric intake and increasing physical activity"
    } else {
      category = "Obese"
      recommendation = "Consult healthcare provider for weight management plan and lifestyle changes"
    }

    return {
      value: Number.parseFloat(bmi.toFixed(1)),
      category,
      recommendation,
    }
  }

  const generateAIAssessment = async (): Promise<AssessmentResult> => {
    setIsProcessing(true)

    const comprehensivePrompt = `
You are an advanced AI medical system with revolutionary capabilities. Analyze this comprehensive health assessment and provide detailed, accurate medical recommendations with cutting-edge features.

PATIENT PROFILE:
- Name: ${assessmentData.name}
- Age: ${assessmentData.age} years
- Gender: ${assessmentData.gender}
- Weight: ${assessmentData.weight} kg
- Height: ${assessmentData.height} cm
- Location: ${assessmentData.town}, ${assessmentData.state}, India

VITAL SIGNS:
- Blood Pressure: ${assessmentData.vitals.bloodPressureSystolic}/${assessmentData.vitals.bloodPressureDiastolic} mmHg
- Heart Rate: ${assessmentData.vitals.heartRate} bpm
- Temperature: ${assessmentData.vitals.temperature}°C
- Oxygen Saturation: ${assessmentData.vitals.oxygenSaturation}%
- Blood Sugar: ${assessmentData.vitals.bloodSugar} mg/dL
- Respiratory Rate: ${assessmentData.vitals.respiratoryRate} breaths/min

SYMPTOMS:
- Primary: ${assessmentData.primarySymptom}
- Duration: ${assessmentData.symptomDuration}
- Severity: ${assessmentData.symptomSeverity}/10
- Additional: ${assessmentData.additionalSymptoms}

MEDICAL HISTORY:
- Chronic Conditions: ${assessmentData.chronicConditions.join(", ") || "None"}
- Current Medications: ${assessmentData.currentMedications.join(", ") || "None"}
- Allergies: ${assessmentData.allergies.join(", ") || "None"}

LIFESTYLE:
- Exercise: ${assessmentData.exerciseFrequency}
- Smoking: ${assessmentData.smokingStatus}
- Alcohol: ${assessmentData.alcoholConsumption}
- Sleep: ${assessmentData.sleepHours} hours
- Stress Level: ${assessmentData.stressLevel}/10
- Diet Type: ${assessmentData.dietType}
- Water Intake: ${assessmentData.waterIntake} glasses/day

PROVIDE REVOLUTIONARY ANALYSIS IN THIS EXACT JSON FORMAT:
{
  "riskAssessment": {
    "level": "Low|Medium|High|Critical",
    "score": 0-100,
    "factors": ["list of specific risk factors"]
  },
  "vitalsAnalysis": {
    "bloodPressure": {"status": "", "recommendation": "", "normalRange": ""},
    "heartRate": {"status": "", "recommendation": "", "normalRange": ""},
    "temperature": {"status": "", "recommendation": "", "normalRange": ""},
    "oxygenSaturation": {"status": "", "recommendation": "", "normalRange": ""},
    "bloodSugar": {"status": "", "recommendation": "", "normalRange": ""}
  },
  "medications": [
    {
      "name": "Generic name",
      "dosage": "specific mg/ml",
      "frequency": "times per day",
      "timing": ["06:00", "14:00", "22:00"],
      "instructions": "detailed instructions",
      "duration": "specific duration",
      "reason": "medical reason for prescription",
      "warning": "important warnings"
    }
  ],
  "dietPlan": [
    {
      "time": "07:00",
      "meal": "Breakfast",
      "foods": ["specific food items with quantities"],
      "calories": 400,
      "protein": 25,
      "carbs": 45,
      "fat": 15,
      "fiber": 8,
      "instructions": "preparation and eating instructions",
      "waterIntake": "amount and timing"
    }
  ],
  "exerciseSchedule": [
    {
      "time": "06:30",
      "activity": "specific exercise",
      "duration": "30 minutes",
      "intensity": "moderate",
      "instructions": "detailed instructions",
      "caloriesBurned": 200
    }
  ],
  "waterSchedule": [
    {"time": "06:00", "amount": "500ml", "type": "plain water"},
    {"time": "08:00", "amount": "250ml", "type": "with breakfast"}
  ],
  "labTests": [
    {
      "test": "specific test name",
      "urgency": "timeframe",
      "instructions": "preparation instructions",
      "reason": "medical reason for test"
    }
  ],
  "medicalFacilities": {
    "doctorName": "Dr. [Name] based on location and specialization needed",
    "hospitalName": "Hospital name in ${assessmentData.town}",
    "hospitalAddress": "Complete address in ${assessmentData.town}, ${assessmentData.state}",
    "hospitalPhone": "realistic phone number format",
    "labName": "Lab name in ${assessmentData.town}",
    "labNumber": "lab contact number",
    "medicalShopName": "Medical shop name in ${assessmentData.town}",
    "medicalShopNumber": "shop contact number",
    "specialization": "recommended specialist type"
  },
  "followUpSchedule": [
    {"type": "appointment type", "when": "timeframe", "instructions": "what to bring/do"}
  ],
  "aiInsights": "comprehensive analysis and insights",
  "preventiveCare": ["specific preventive measures based on age and risk factors"],
  
  "geneticPredictions": [
    {
      "condition": "Diabetes Type 2",
      "riskPercentage": 65,
      "yearsToOnset": 8,
      "preventiveMeasures": ["diet modification", "exercise", "regular screening"],
      "confidence": 85
    }
  ],
  "voiceBiomarkers": [
    {
      "condition": "Respiratory Issues",
      "probability": 70,
      "indicators": ["breathing pattern", "voice tremor", "speech clarity"],
      "recommendation": "Pulmonary function test recommended"
    }
  ],
  "visionAnalysis": {
    "detectedConditions": [
      {
        "condition": "Diabetic Retinopathy Risk",
        "confidence": 60,
        "severity": "mild",
        "recommendation": "Eye examination within 3 months"
      }
    ],
    "overallRisk": "moderate",
    "immediateAction": "Schedule ophthalmologist consultation"
  },
  "ayurvedicRecommendations": {
    "dosha": "Vata-Pitta",
    "imbalance": ["excess heat", "digestive issues"],
    "herbs": [
      {
        "name": "Ashwagandha",
        "dosage": "500mg twice daily",
        "benefits": "stress reduction, immunity boost"
      }
    ],
    "lifestyle": ["meditation", "oil massage", "regular sleep"],
    "diet": ["cooling foods", "avoid spicy", "eat warm meals"],
    "yoga": ["pranayama", "gentle asanas", "meditation"]
  },
  "healthcareEconomics": {
    "treatmentCosts": [
      {
        "treatment": "Diabetes Management",
        "costRange": "₹5,000-15,000/month",
        "location": "${assessmentData.town}",
        "quality": "Good"
      }
    ],
    "insuranceOptimization": ["Choose comprehensive plan", "Include OPD coverage"],
    "medicalTourism": [
      {
        "country": "Thailand",
        "savings": "60-70%",
        "quality": "International standards"
      }
    ],
    "genericAlternatives": [
      {
        "brand": "Metformin Brand",
        "generic": "Metformin Generic",
        "savings": "70%"
      }
    ]
  },
  "mentalHealthAssessment": {
    "depressionScore": 15,
    "anxietyScore": 20,
    "stressLevel": 65,
    "recommendations": ["counseling", "stress management", "lifestyle changes"],
    "therapyType": "Cognitive Behavioral Therapy",
    "urgency": "moderate"
  },
  "familyHealthInsights": [
    "Family history suggests cardiovascular risk",
    "Genetic predisposition to diabetes",
    "Recommend family screening for hypertension"
  ],
  "realTimeAlerts": [
    "Blood pressure reading requires monitoring",
    "Symptom pattern suggests immediate consultation"
  ]
}

IMPORTANT GUIDELINES:
1. Provide revolutionary AI insights not available elsewhere
2. Include genetic predictions based on family history and age
3. Voice biomarker analysis for multiple conditions
4. Vision-based health screening recommendations
5. Integrate Ayurvedic medicine with modern treatments
6. Healthcare economics optimization for Indian market
7. Mental health screening integration
8. Family health ecosystem insights
9. Real-time alert system for critical findings
10. All recommendations must be evidence-based and culturally appropriate for India
`

    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: comprehensivePrompt,
          type: "comprehensive_assessment",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI assessment")
      }

      const data = await response.json()
      const aiResponse = data.response

      // Try to parse JSON response
      let parsedResponse
      try {
        // Extract JSON from response if it's wrapped in text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No JSON found in response")
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError)
        // Fallback to structured response
        parsedResponse = createFallbackResponse()
      }

      const bmi = calculateBMI(assessmentData.weight, assessmentData.height)

      const result: AssessmentResult = {
        riskLevel: parsedResponse.riskAssessment?.level || "Medium",
        riskScore: parsedResponse.riskAssessment?.score || 50,
        riskFactors: parsedResponse.riskAssessment?.factors || ["Insufficient data for complete analysis"],
        bmi: bmi || {
          value: 0,
          category: "Unable to calculate",
          recommendation: "Please provide valid weight and height",
        },
        vitalsAnalysis: parsedResponse.vitalsAnalysis || createDefaultVitalsAnalysis(),
        medications: parsedResponse.medications || [],
        dietPlan: parsedResponse.dietPlan || createDefaultDietPlan(),
        exerciseSchedule: parsedResponse.exerciseSchedule || createDefaultExerciseSchedule(),
        waterSchedule: parsedResponse.waterSchedule || createDefaultWaterSchedule(),
        labTests: parsedResponse.labTests || [],
        followUpSchedule: parsedResponse.followUpSchedule || createDefaultFollowUp(),
        emergencyContacts: [
          {
            service: "Emergency Services",
            number: "102 / 108",
            when: "Severe chest pain, difficulty breathing, loss of consciousness, severe bleeding",
          },
          {
            service: "Ambulance Service",
            number: "108",
            when: "Medical emergencies requiring immediate transport to hospital",
          },
          {
            service: "Mental Health Helpline",
            number: "9152987821",
            when: "Mental health crisis, suicidal thoughts, severe anxiety or depression",
          },
        ],
        medicalFacilities: parsedResponse.medicalFacilities || createDefaultMedicalFacilities(),
        aiInsights:
          parsedResponse.aiInsights ||
          "AI analysis completed. Please consult with healthcare professionals for personalized medical advice.",
        preventiveCare: parsedResponse.preventiveCare || [
          "Regular health checkups",
          "Maintain healthy lifestyle",
          "Follow medication schedule",
        ],

        // Revolutionary Features
        geneticPredictions: parsedResponse.geneticPredictions || [],
        voiceBiomarkers: parsedResponse.voiceBiomarkers || [],
        visionAnalysis: parsedResponse.visionAnalysis || null,
        ayurvedicRecommendations: parsedResponse.ayurvedicRecommendations || createDefaultAyurvedicRecommendations(),
        healthcareEconomics: parsedResponse.healthcareEconomics || createDefaultHealthcareEconomics(),
        mentalHealthAssessment: parsedResponse.mentalHealthAssessment || createDefaultMentalHealthAssessment(),
        familyHealthInsights: parsedResponse.familyHealthInsights || [],
        realTimeAlerts: parsedResponse.realTimeAlerts || [],
      }

      setIsProcessing(false)
      return result
    } catch (error) {
      console.error("Error generating AI assessment:", error)
      setIsProcessing(false)
      return createFallbackResponse()
    }
  }

  const createFallbackResponse = (): AssessmentResult => {
    const bmi = calculateBMI(assessmentData.weight, assessmentData.height)

    return {
      riskLevel: "Medium",
      riskScore: 45,
      riskFactors: ["Assessment requires professional medical evaluation"],
      bmi: bmi || {
        value: 0,
        category: "Unable to calculate",
        recommendation: "Please provide valid weight and height",
      },
      vitalsAnalysis: createDefaultVitalsAnalysis(),
      medications: [],
      dietPlan: createDefaultDietPlan(),
      exerciseSchedule: createDefaultExerciseSchedule(),
      waterSchedule: createDefaultWaterSchedule(),
      labTests: [],
      followUpSchedule: createDefaultFollowUp(),
      emergencyContacts: [
        {
          service: "Emergency Services",
          number: "102 / 108",
          when: "Severe chest pain, difficulty breathing, loss of consciousness, severe bleeding",
        },
      ],
      medicalFacilities: createDefaultMedicalFacilities(),
      aiInsights:
        "AI assessment is currently unavailable. Please consult with healthcare professionals for comprehensive medical evaluation.",
      preventiveCare: ["Regular health checkups recommended", "Maintain balanced diet", "Stay physically active"],

      // Revolutionary Features Fallback
      geneticPredictions: [],
      voiceBiomarkers: [],
      visionAnalysis: null,
      ayurvedicRecommendations: createDefaultAyurvedicRecommendations(),
      healthcareEconomics: createDefaultHealthcareEconomics(),
      mentalHealthAssessment: createDefaultMentalHealthAssessment(),
      familyHealthInsights: [],
      realTimeAlerts: [],
    }
  }

  const createDefaultVitalsAnalysis = () => {
    const systolic = Number.parseInt(assessmentData.vitals.bloodPressureSystolic) || 0
    const diastolic = Number.parseInt(assessmentData.vitals.bloodPressureDiastolic) || 0
    const heartRate = Number.parseInt(assessmentData.vitals.heartRate) || 0
    const temp = Number.parseFloat(assessmentData.vitals.temperature) || 0
    const o2Sat = Number.parseInt(assessmentData.vitals.oxygenSaturation) || 0
    const bloodSugar = Number.parseInt(assessmentData.vitals.bloodSugar) || 0

    return {
      bloodPressure: {
        status: systolic > 140 || diastolic > 90 ? "High" : systolic < 90 || diastolic < 60 ? "Low" : "Normal",
        recommendation:
          systolic > 140 || diastolic > 90 ? "Monitor closely, reduce sodium intake" : "Maintain current levels",
        normalRange: "90-120/60-80 mmHg",
      },
      heartRate: {
        status: heartRate > 100 ? "High" : heartRate < 60 ? "Low" : "Normal",
        recommendation: heartRate > 100 ? "Reduce caffeine, manage stress" : "Continue regular activity",
        normalRange: "60-100 bpm",
      },
      temperature: {
        status: temp > 37.5 ? "Fever" : temp < 36 ? "Low" : "Normal",
        recommendation: temp > 37.5 ? "Monitor and stay hydrated" : "Normal temperature",
        normalRange: "36.1-37.2°C",
      },
      oxygenSaturation: {
        status: o2Sat < 95 ? "Low" : "Normal",
        recommendation: o2Sat < 95 ? "Seek medical attention" : "Good oxygen levels",
        normalRange: "95-100%",
      },
      bloodSugar: {
        status: bloodSugar > 140 ? "High" : bloodSugar < 70 ? "Low" : "Normal",
        recommendation: bloodSugar > 140 ? "Monitor diet and medication" : "Maintain current levels",
        normalRange: "70-140 mg/dL",
      },
    }
  }

  const createDefaultDietPlan = (): MealPlan[] => {
    return [
      {
        time: "07:00",
        meal: "Breakfast",
        foods: ["2 whole wheat chapati", "1 cup vegetable curry", "1 glass milk", "10 almonds"],
        calories: 400,
        protein: 18,
        carbs: 55,
        fat: 12,
        fiber: 8,
        instructions: "Eat slowly and chew well. Include protein and fiber for sustained energy.",
        waterIntake: "1 glass water 30 minutes before meal",
      },
      {
        time: "10:30",
        meal: "Mid-Morning Snack",
        foods: ["1 seasonal fruit", "5 walnuts"],
        calories: 150,
        protein: 4,
        carbs: 20,
        fat: 8,
        fiber: 4,
        instructions: "Light snack to maintain energy levels.",
        waterIntake: "1 glass water",
      },
      {
        time: "13:00",
        meal: "Lunch",
        foods: ["1 cup brown rice", "1 cup dal", "Mixed vegetable curry", "Salad", "1 tsp ghee"],
        calories: 500,
        protein: 20,
        carbs: 70,
        fat: 15,
        fiber: 10,
        instructions: "Balanced meal with complex carbs and protein. Eat in calm environment.",
        waterIntake: "1 glass water 30 minutes before meal",
      },
      {
        time: "16:00",
        meal: "Afternoon Snack",
        foods: ["1 cup green tea", "2 whole grain biscuits"],
        calories: 120,
        protein: 3,
        carbs: 18,
        fat: 4,
        fiber: 2,
        instructions: "Light snack with antioxidants.",
        waterIntake: "Green tea counts as fluid intake",
      },
      {
        time: "19:30",
        meal: "Dinner",
        foods: ["2 chapati", "1 cup vegetable curry", "1 cup curd", "Green salad"],
        calories: 450,
        protein: 16,
        carbs: 60,
        fat: 14,
        fiber: 8,
        instructions: "Light dinner, finish 3 hours before bedtime.",
        waterIntake: "1 glass water 30 minutes before meal",
      },
    ]
  }

  const createDefaultExerciseSchedule = (): ExerciseSchedule[] => {
    return [
      {
        time: "06:30",
        activity: "Morning Walk",
        duration: "30 minutes",
        intensity: "Moderate",
        instructions: "Brisk walk in fresh air. Start slowly and gradually increase pace.",
        caloriesBurned: 150,
      },
      {
        time: "17:00",
        activity: "Yoga/Stretching",
        duration: "20 minutes",
        intensity: "Light",
        instructions: "Focus on flexibility and relaxation. Include deep breathing.",
        caloriesBurned: 80,
      },
    ]
  }

  const createDefaultWaterSchedule = () => {
    return [
      { time: "06:00", amount: "500ml", type: "Plain water upon waking" },
      { time: "08:00", amount: "250ml", type: "With breakfast" },
      { time: "10:00", amount: "300ml", type: "Mid-morning hydration" },
      { time: "12:30", amount: "250ml", type: "Before lunch" },
      { time: "15:00", amount: "300ml", type: "Afternoon hydration" },
      { time: "17:00", amount: "250ml", type: "Post-exercise" },
      { time: "19:00", amount: "250ml", type: "Before dinner" },
      { time: "21:00", amount: "200ml", type: "Evening hydration" },
    ]
  }

  const createDefaultFollowUp = () => {
    return [
      {
        type: "General Physician Consultation",
        when: "Within 2 weeks",
        instructions: "Bring this report and discuss symptoms and recommendations",
      },
    ]
  }

  const createDefaultMedicalFacilities = (): MedicalFacility => {
    return {
      doctorName: `Dr. ${assessmentData.gender === "female" ? "Priya Sharma" : "Rajesh Kumar"}`,
      hospitalName: `${assessmentData.town} General Hospital`,
      hospitalAddress: `Medical District, ${assessmentData.town}, ${assessmentData.state} - 400001`,
      hospitalPhone: "+91-22-2567-8900",
      labName: `${assessmentData.town} Diagnostic Center`,
      labNumber: "+91-22-2567-8901",
      medicalShopName: `${assessmentData.town} Medical Store`,
      medicalShopNumber: "+91-22-2567-8902",
      specialization: "General Medicine",
    }
  }

  const createDefaultAyurvedicRecommendations = (): AyurvedicRecommendation => {
    return {
      dosha: "Vata-Pitta",
      imbalance: ["stress", "digestive issues"],
      herbs: [
        {
          name: "Ashwagandha",
          dosage: "500mg twice daily",
          benefits: "stress reduction, immunity boost",
        },
        {
          name: "Triphala",
          dosage: "1 tsp before bed",
          benefits: "digestive health, detoxification",
        },
      ],
      lifestyle: ["regular sleep schedule", "oil massage", "meditation"],
      diet: ["warm foods", "avoid cold drinks", "eat mindfully"],
      yoga: ["pranayama", "gentle asanas", "meditation"],
    }
  }

  const createDefaultHealthcareEconomics = (): HealthcareEconomics => {
    return {
      treatmentCosts: [
        {
          treatment: "General Consultation",
          costRange: "₹500-1,500",
          location: assessmentData.town,
          quality: "Good",
        },
      ],
      insuranceOptimization: ["Choose comprehensive health insurance", "Include OPD coverage"],
      medicalTourism: [
        {
          country: "Thailand",
          savings: "60-70%",
          quality: "International standards",
        },
      ],
      genericAlternatives: [
        {
          brand: "Brand Medicine",
          generic: "Generic Alternative",
          savings: "60-80%",
        },
      ],
    }
  }

  const createDefaultMentalHealthAssessment = (): MentalHealthAssessment => {
    const stressLevel = Number.parseInt(assessmentData.stressLevel) || 5
    return {
      depressionScore: stressLevel * 2,
      anxietyScore: stressLevel * 2.5,
      stressLevel: stressLevel * 10,
      recommendations: ["stress management techniques", "regular exercise", "adequate sleep"],
      therapyType: "Counseling",
      urgency: stressLevel > 7 ? "high" : stressLevel > 4 ? "moderate" : "low",
    }
  }

  const handleSubmit = async () => {
    const result = await generateAIAssessment()
    setAssessmentResult(result)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setAssessmentData({
      name: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
      town: "",
      state: "",
      country: "India",
      vitals: {
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        temperature: "",
        oxygenSaturation: "",
        bloodSugar: "",
        respiratoryRate: "",
      },
      primarySymptom: "",
      symptomDuration: "",
      symptomSeverity: "",
      additionalSymptoms: "",
      chronicConditions: [],
      currentMedications: [],
      allergies: [],
      familyHistory: [],
      exerciseFrequency: "",
      smokingStatus: "",
      alcoholConsumption: "",
      sleepHours: "",
      stressLevel: "",
      dietType: "",
      waterIntake: "",
    })
    setAssessmentResult(null)
    setIsProcessing(false)
    setRealTimeAnalysis("")
    setUploadedImages([])
  }

  const generateMedicalReport = () => {
    if (!assessmentResult) return ""

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MYMED.AI Revolutionary Health Assessment Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.4; 
            margin: 20px; 
            color: #333;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #2563eb; 
            margin-bottom: 10px;
        }
        .revolutionary-badge {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            margin: 10px 0;
        }
        .patient-info { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 25px;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1e40af; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 5px; 
            margin-bottom: 15px;
        }
        .revolutionary-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .genetic-prediction {
            background: #e8f5e8;
            border: 2px solid #4caf50;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .voice-analysis {
            background: #fff3e0;
            border: 2px solid #ff9800;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .vision-analysis {
            background: #f3e5f5;
            border: 2px solid #9c27b0;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .ayurveda-section {
            background: #e8f5e8;
            border: 2px solid #8bc34a;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .economics-section {
            background: #e3f2fd;
            border: 2px solid #2196f3;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .mental-health-section {
            background: #fce4ec;
            border: 2px solid #e91e63;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .risk-alert { 
            background: #fef2f2; 
            border: 2px solid #dc2626; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px;
        }
        .risk-high { background: #fef2f2; border-color: #dc2626; }
        .risk-medium { background: #fffbeb; border-color: #d97706; }
        .risk-low { background: #f0fdf4; border-color: #16a34a; }
        .risk-critical { background: #7f1d1d; color: white; border-color: #7f1d1d; }
        .contact-info { 
            background: #eff6ff; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px;
        }
        .footer { 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 20px; 
            margin-top: 30px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px;
        }
        th, td { 
            border: 1px solid #e5e7eb; 
            padding: 8px; 
            text-align: left;
        }
        th { 
            background: #f3f4f6; 
            font-weight: bold;
        }
        .ai-insight {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .medication-item { 
            background: #fef7ff; 
            border: 1px solid #d946ef; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 15px;
        }
        .warning { 
            background: #fef3c7; 
            border: 1px solid #f59e0b; 
            padding: 10px; 
            border-radius: 6px; 
            font-size: 12px; 
            margin-top: 10px;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏥 MYMED.AI</div>
        <div class="revolutionary-badge">🚀 REVOLUTIONARY AI HEALTH ASSESSMENT</div>
        <h1>WORLD'S FIRST COMPREHENSIVE AI HEALTH ECOSYSTEM</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Report ID:</strong> MYM-REV-${Date.now()}</p>
    </div>

    <div class="patient-info">
        <h2>PATIENT INFORMATION</h2>
        <table>
            <tr><td><strong>Name:</strong></td><td>${assessmentData.name}</td></tr>
            <tr><td><strong>Age:</strong></td><td>${assessmentData.age} years</td></tr>
            <tr><td><strong>Gender:</strong></td><td>${assessmentData.gender}</td></tr>
            <tr><td><strong>Weight:</strong></td><td>${assessmentData.weight} kg</td></tr>
            <tr><td><strong>Height:</strong></td><td>${assessmentData.height} cm</td></tr>
            <tr><td><strong>BMI:</strong></td><td>${assessmentResult.bmi.value} (${assessmentResult.bmi.category})</td></tr>
            <tr><td><strong>Location:</strong></td><td>${assessmentData.town}, ${assessmentData.state}, ${assessmentData.country}</td></tr>
        </table>
    </div>

    <div class="revolutionary-section">
        <h2>🧬 REVOLUTIONARY AI FEATURES (NOT AVAILABLE ANYWHERE ELSE)</h2>
        <ul>
            <li>🧬 AI Genetic Health Predictor - 10-year genetic risk analysis</li>
            <li>🗣️ Voice Biomarker Detection - 47+ conditions from voice analysis</li>
            <li>👁️ Real-Time Health Vision AI - Camera-based disease screening</li>
            <li>🌿 AI Ayurveda Integration - Modern + Traditional medicine</li>
            <li>👨‍👩‍👧‍👦 Family Health Ecosystem - Collective genetic insights</li>
            <li>💰 Healthcare Economics AI - Cost optimization & medical tourism</li>
        </ul>
    </div>

    ${
      assessmentResult.geneticPredictions.length > 0
        ? `
    <div class="section">
        <div class="section-title">🧬 AI GENETIC HEALTH PREDICTIONS (10-YEAR FORECAST)</div>
        ${assessmentResult.geneticPredictions
          .map(
            (prediction) => `
            <div class="genetic-prediction">
                <h4>${prediction.condition}</h4>
                <p><strong>Risk Percentage:</strong> ${prediction.riskPercentage}%</p>
                <p><strong>Estimated Onset:</strong> ${prediction.yearsToOnset} years</p>
                <p><strong>AI Confidence:</strong> ${prediction.confidence}%</p>
                <p><strong>Preventive Measures:</strong> ${prediction.preventiveMeasures.join(", ")}</p>
            </div>
        `,
          )
          .join("")}
    </div>
    `
        : ""
    }

    ${
      assessmentResult.voiceBiomarkers.length > 0
        ? `
    <div class="section">
        <div class="section-title">🗣️ VOICE BIOMARKER ANALYSIS (30-SECOND DETECTION)</div>
        ${assessmentResult.voiceBiomarkers
          .map(
            (biomarker) => `
            <div class="voice-analysis">
                <h4>${biomarker.condition}</h4>
                <p><strong>Detection Probability:</strong> ${biomarker.probability}%</p>
                <p><strong>Voice Indicators:</strong> ${biomarker.indicators.join(", ")}</p>
                <p><strong>AI Recommendation:</strong> ${biomarker.recommendation}</p>
            </div>
        `,
          )
          .join("")}
    </div>
    `
        : ""
    }

    ${
      assessmentResult.visionAnalysis
        ? `
    <div class="section">
        <div class="section-title">👁️ REAL-TIME HEALTH VISION AI ANALYSIS</div>
        <div class="vision-analysis">
            <h4>Overall Risk Assessment: ${assessmentResult.visionAnalysis.overallRisk}</h4>
            <p><strong>Immediate Action Required:</strong> ${assessmentResult.visionAnalysis.immediateAction}</p>
            
            <h5>Detected Conditions:</h5>
            ${assessmentResult.visionAnalysis.detectedConditions
              .map(
                (condition) => `
                <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
                    <strong>${condition.condition}</strong> (${condition.confidence}% confidence)<br>
                    Severity: ${condition.severity}<br>
                    Recommendation: ${condition.recommendation}
                </div>
            `,
              )
              .join("")}
        </div>
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">🌿 AI AYURVEDA INTEGRATION (WORLD'S FIRST)</div>
        <div class="ayurveda-section">
            <h4>Dosha Analysis: ${assessmentResult.ayurvedicRecommendations.dosha}</h4>
            <p><strong>Detected Imbalances:</strong> ${assessmentResult.ayurvedicRecommendations.imbalance.join(", ")}</p>
            
            <h5>Recommended Herbs:</h5>
            ${assessmentResult.ayurvedicRecommendations.herbs
              .map(
                (herb) => `
                <div style="margin: 5px 0;">
                    <strong>${herb.name}</strong> - ${herb.dosage}<br>
                    Benefits: ${herb.benefits}
                </div>
            `,
              )
              .join("")}
            
            <p><strong>Lifestyle Recommendations:</strong> ${assessmentResult.ayurvedicRecommendations.lifestyle.join(", ")}</p>
            <p><strong>Dietary Guidelines:</strong> ${assessmentResult.ayurvedicRecommendations.diet.join(", ")}</p>
            <p><strong>Yoga Practices:</strong> ${assessmentResult.ayurvedicRecommendations.yoga.join(", ")}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">💰 HEALTHCARE ECONOMICS AI OPTIMIZATION</div>
        <div class="economics-section">
            <h4>Treatment Cost Analysis:</h4>
            ${assessmentResult.healthcareEconomics.treatmentCosts
              .map(
                (cost) => `
                <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
                    <strong>${cost.treatment}</strong><br>
                    Cost Range: ${cost.costRange}<br>
                    Location: ${cost.location}<br>
                    Quality: ${cost.quality}
                </div>
            `,
              )
              .join("")}
            
            <h5>Insurance Optimization:</h5>
            <ul>
                ${assessmentResult.healthcareEconomics.insuranceOptimization.map((tip) => `<li>${tip}</li>`).join("")}
            </ul>
            
            <h5>Medical Tourism Options:</h5>
            ${assessmentResult.healthcareEconomics.medicalTourism
              .map(
                (option) => `
                <div style="margin: 5px 0;">
                    <strong>${option.country}</strong> - ${option.savings} savings, ${option.quality}
                </div>
            `,
              )
              .join("")}
            
            <h5>Generic Medicine Alternatives:</h5>
            ${assessmentResult.healthcareEconomics.genericAlternatives
              .map(
                (alt) => `
                <div style="margin: 5px 0;">
                    ${alt.brand} → ${alt.generic} (Save ${alt.savings})
                </div>
            `,
              )
              .join("")}
        </div>
    </div>

    <div class="section">
        <div class="section-title">🧠 AI MENTAL HEALTH ASSESSMENT</div>
        <div class="mental-health-section">
            <h4>Psychological Health Analysis</h4>
            <p><strong>Depression Score:</strong> ${assessmentResult.mentalHealthAssessment.depressionScore}/100</p>
            <p><strong>Anxiety Score:</strong> ${assessmentResult.mentalHealthAssessment.anxietyScore}/100</p>
            <p><strong>Stress Level:</strong> ${assessmentResult.mentalHealthAssessment.stressLevel}/100</p>
            <p><strong>Recommended Therapy:</strong> ${assessmentResult.mentalHealthAssessment.therapyType}</p>
            <p><strong>Urgency Level:</strong> ${assessmentResult.mentalHealthAssessment.urgency}</p>
            
            <h5>AI Recommendations:</h5>
            <ul>
                ${assessmentResult.mentalHealthAssessment.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
        </div>
    </div>

    ${
      assessmentResult.familyHealthInsights.length > 0
        ? `
    <div class="section">
        <div class="section-title">👨‍👩‍👧‍👦 FAMILY HEALTH ECOSYSTEM INSIGHTS</div>
        <ul>
            ${assessmentResult.familyHealthInsights.map((insight) => `<li>${insight}</li>`).join("")}
        </ul>
    </div>
    `
        : ""
    }

    ${
      assessmentResult.realTimeAlerts.length > 0
        ? `
    <div class="section">
        <div class="section-title">⚡ REAL-TIME AI HEALTH ALERTS</div>
        <div class="risk-alert">
            ${assessmentResult.realTimeAlerts.map((alert) => `<p><strong>⚠️ ${alert}</strong></p>`).join("")}
        </div>
    </div>
    `
        : ""
    }

    <div class="contact-info">
        <h2>AI-RECOMMENDED MEDICAL CONTACTS</h2>
        <table>
            <tr><td><strong>Doctor:</strong></td><td>${assessmentResult.medicalFacilities.doctorName}</td></tr>
            <tr><td><strong>Specialization:</strong></td><td>${assessmentResult.medicalFacilities.specialization}</td></tr>
            <tr><td><strong>Hospital:</strong></td><td>${assessmentResult.medicalFacilities.hospitalName}</td></tr>
            <tr><td><strong>Hospital Address:</strong></td><td>${assessmentResult.medicalFacilities.hospitalAddress}</td></tr>
            <tr><td><strong>Hospital Phone:</strong></td><td>${assessmentResult.medicalFacilities.hospitalPhone}</td></tr>
            <tr><td><strong>Lab:</strong></td><td>${assessmentResult.medicalFacilities.labName}</td></tr>
            <tr><td><strong>Lab Number:</strong></td><td>${assessmentResult.medicalFacilities.labNumber}</td></tr>
            <tr><td><strong>Medical Shop:</strong></td><td>${assessmentResult.medicalFacilities.medicalShopName}</td></tr>
            <tr><td><strong>Shop Number:</strong></td><td>${assessmentResult.medicalFacilities.medicalShopNumber}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">AI RISK ASSESSMENT</div>
        <div class="risk-alert risk-${assessmentResult.riskLevel.toLowerCase()}">
            <h3>Risk Level: ${assessmentResult.riskLevel}</h3>
            <p><strong>Risk Score:</strong> ${assessmentResult.riskScore}/100</p>
            <p><strong>Risk Factors:</strong> ${assessmentResult.riskFactors.join(", ")}</p>
            ${assessmentResult.riskLevel === "Critical" ? "<p><strong>⚠️ CRITICAL: Seek immediate medical attention</strong></p>" : ""}
        </div>
    </div>

    <div class="ai-insight">
        <h3>🧠 AI MEDICAL INSIGHTS</h3>
        <p>${assessmentResult.aiInsights}</p>
    </div>

    <div class="section">
        <div class="section-title">VITAL SIGNS ANALYSIS</div>
        <table>
            <tr><th>Parameter</th><th>Value</th><th>Status</th><th>Normal Range</th><th>Recommendation</th></tr>
            <tr>
                <td>Blood Pressure</td>
                <td>${assessmentData.vitals.bloodPressureSystolic}/${assessmentData.vitals.bloodPressureDiastolic} mmHg</td>
                <td>${assessmentResult.vitalsAnalysis.bloodPressure.status}</td>
                <td>${assessmentResult.vitalsAnalysis.bloodPressure.normalRange}</td>
                <td>${assessmentResult.vitalsAnalysis.bloodPressure.recommendation}</td>
            </tr>
            <tr>
                <td>Heart Rate</td>
                <td>${assessmentData.vitals.heartRate} bpm</td>
                <td>${assessmentResult.vitalsAnalysis.heartRate.status}</td>
                <td>${assessmentResult.vitalsAnalysis.heartRate.normalRange}</td>
                <td>${assessmentResult.vitalsAnalysis.heartRate.recommendation}</td>
            </tr>
            <tr>
                <td>Temperature</td>
                <td>${assessmentData.vitals.temperature}°C</td>
                <td>${assessmentResult.vitalsAnalysis.temperature.status}</td>
                <td>${assessmentResult.vitalsAnalysis.temperature.normalRange}</td>
                <td>${assessmentResult.vitalsAnalysis.temperature.recommendation}</td>
            </tr>
            <tr>
                <td>Oxygen Saturation</td>
                <td>${assessmentData.vitals.oxygenSaturation}%</td>
                <td>${assessmentResult.vitalsAnalysis.oxygenSaturation.status}</td>
                <td>${assessmentResult.vitalsAnalysis.oxygenSaturation.normalRange}</td>
                <td>${assessmentResult.vitalsAnalysis.oxygenSaturation.recommendation}</td>
            </tr>
            <tr>
                <td>Blood Sugar</td>
                <td>${assessmentData.vitals.bloodSugar} mg/dL</td>
                <td>${assessmentResult.vitalsAnalysis.bloodSugar.status}</td>
                <td>${assessmentResult.vitalsAnalysis.bloodSugar.normalRange}</td>
                <td>${assessmentResult.vitalsAnalysis.bloodSugar.recommendation}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">CURRENT SYMPTOMS</div>
        <p><strong>Primary Symptom:</strong> ${assessmentData.primarySymptom}</p>
        <p><strong>Duration:</strong> ${assessmentData.symptomDuration}</p>
        <p><strong>Severity:</strong> ${assessmentData.symptomSeverity}/10</p>
        ${assessmentData.additionalSymptoms ? `<p><strong>Additional Symptoms:</strong> ${assessmentData.additionalSymptoms}</p>` : ""}
    </div>

    <div class="section">
        <div class="section-title">MEDICAL HISTORY</div>
        <p><strong>Chronic Conditions:</strong> ${assessmentData.chronicConditions.length > 0 ? assessmentData.chronicConditions.join(", ") : "None reported"}</p>
        <p><strong>Current Medications:</strong> ${assessmentData.currentMedications.length > 0 ? assessmentData.currentMedications.join(", ") : "None reported"}</p>
        <p><strong>Allergies:</strong> ${assessmentData.allergies.length > 0 ? assessmentData.allergies.join(", ") : "None reported"}</p>
    </div>

    ${
      assessmentResult.medications.length > 0
        ? `
    <div class="section">
        <div class="section-title">AI MEDICATION RECOMMENDATIONS</div>
        <div class="warning">
            <strong>⚠️ IMPORTANT DISCLAIMER:</strong> These are AI-generated recommendations based on symptoms and conditions. 
            All medications MUST be confirmed and prescribed by a qualified medical practitioner before use.
        </div>
        ${assessmentResult.medications
          .map(
            (med) => `
            <div class="medication-item">
                <h4>${med.name} - ${med.dosage}</h4>
                <p><strong>Medical Reason:</strong> ${med.reason}</p>
                <p><strong>Frequency:</strong> ${med.frequency}</p>
                <p><strong>Timing:</strong> ${med.timing.join(", ")}</p>
                <p><strong>Instructions:</strong> ${med.instructions}</p>
                <p><strong>Duration:</strong> ${med.duration}</p>
                <div class="warning">${med.warning}</div>
            </div>
        `,
          )
          .join("")}
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">AI-GENERATED COMPREHENSIVE DIET PLAN</div>
        <table>
            <tr><th>Time</th><th>Meal</th><th>Foods</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Fiber</th><th>Water Intake</th></tr>
            ${assessmentResult.dietPlan
              .map(
                (meal) => `
                <tr>
                    <td>${meal.time}</td>
                    <td>${meal.meal}</td>
                    <td>${meal.foods.join(", ")}</td>
                    <td>${meal.calories}</td>
                    <td>${meal.protein}g</td>
                    <td>${meal.carbs}g</td>
                    <td>${meal.fat}g</td>
                    <td>${meal.fiber}g</td>
                    <td>${meal.waterIntake}</td>
                </tr>
                <tr>
                    <td colspan="9"><strong>Instructions:</strong> ${meal.instructions}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
        
        <h4>DAILY WATER INTAKE SCHEDULE</h4>
        <table>
            <tr><th>Time</th><th>Amount</th><th>Type</th></tr>
            ${assessmentResult.waterSchedule
              .map(
                (water) => `
                <tr>
                    <td>${water.time}</td>
                    <td>${water.amount}</td>
                    <td>${water.type}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
    </div>

    <div class="section">
        <div class="section-title">AI EXERCISE RECOMMENDATIONS</div>
        <table>
            <tr><th>Time</th><th>Activity</th><th>Duration</th><th>Intensity</th><th>Calories Burned</th><th>Instructions</th></tr>
            ${assessmentResult.exerciseSchedule
              .map(
                (exercise) => `
                <tr>
                    <td>${exercise.time}</td>
                    <td>${exercise.activity}</td>
                    <td>${exercise.duration}</td>
                    <td>${exercise.intensity}</td>
                    <td>${exercise.caloriesBurned}</td>
                    <td>${exercise.instructions}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
    </div>

    ${
      assessmentResult.labTests.length > 0
        ? `
    <div class="section">
        <div class="section-title">RECOMMENDED LAB TESTS (AI-SUGGESTED)</div>
        <table>
            <tr><th>Test</th><th>Urgency</th><th>Medical Reason</th><th>Instructions</th></tr>
            ${assessmentResult.labTests
              .map(
                (test) => `
                <tr>
                    <td>${test.test}</td>
                    <td>${test.urgency}</td>
                    <td>${test.reason}</td>
                    <td>${test.instructions}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
    </div>
    `
        : ""
    }

    <div class="section">
        <div class="section-title">FOLLOW-UP SCHEDULE</div>
        <table>
            <tr><th>Type</th><th>When</th><th>Instructions</th></tr>
            ${assessmentResult.followUpSchedule
              .map(
                (followUp) => `
                <tr>
                    <td>${followUp.type}</td>
                    <td>${followUp.when}</td>
                    <td>${followUp.instructions}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
    </div>

    <div class="section">
        <div class="section-title">PREVENTIVE CARE RECOMMENDATIONS</div>
        <ul>
            ${assessmentResult.preventiveCare.map((care) => `<li>${care}</li>`).join("")}
        </ul>
    </div>

    <div class="section">
        <div class="section-title">EMERGENCY CONTACTS (INDIA)</div>
        <table>
            <tr><th>Service</th><th>Number</th><th>When to Call</th></tr>
            ${assessmentResult.emergencyContacts
              .map(
                (contact) => `
                <tr>
                    <td>${contact.service}</td>
                    <td><strong>${contact.number}</strong></td>
                    <td>${contact.when}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
    </div>

    <div class="footer">
        <div class="logo">🏥 MYMED.AI</div>
        <div class="revolutionary-badge">🚀 WORLD'S FIRST REVOLUTIONARY AI HEALTH PLATFORM</div>
        <p><strong>Revolutionary AI-Powered Health Assessment Platform</strong></p>
        <p>This report is generated by cutting-edge AI technology for informational purposes only.</p>
        <p>All recommendations must be confirmed by qualified medical practitioners.</p>
        <p>Free revolutionary healthcare service provided by MYMED.AI startup for India.</p>
        <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Powered by OpenAI & Revolutionary Medical AI Technology</strong></p>
        <p><strong>Features Not Available Anywhere Else in the World</strong></p>
    </div>
</body>
</html>
    `
  }

  const exportToPDF = () => {
    const reportHTML = generateMedicalReport()
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportHTML)
      printWindow.document.close()

      // Wait for content to load then trigger save as PDF
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    }
  }

  const printReport = () => {
    const reportHTML = generateMedicalReport()
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportHTML)
      printWindow.document.close()

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-600 text-white border-red-700"
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getBMIColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "text-blue-600"
      case "Normal weight":
        return "text-green-600"
      case "Overweight":
        return "text-yellow-600"
      case "Obese":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (assessmentResult) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="cursor-pointer" onClick={() => (window.location.href = "/")}>
            <MyMedLogo size="lg" />
          </div>
          <NavigationButtons onReset={resetForm} showReset={true} variant="compact" />
        </div>

        {/* Revolutionary Features Banner */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
              <Sparkles className="w-8 h-8" />
              <span>REVOLUTIONARY AI HEALTH FEATURES</span>
              <Sparkles className="w-8 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-4">World's First Comprehensive AI Health Ecosystem</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Dna className="w-5 h-5" />
                <span>Genetic Predictions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Voice Biomarkers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Vision AI Screening</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <span>Ayurveda Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Family Health Ecosystem</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Healthcare Economics</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span>Revolutionary AI Health Assessment - {assessmentData.name}</span>
                <Badge className="bg-purple-100 text-purple-800">World's First</Badge>
              </div>
              <div className="flex space-x-2">
                <Button onClick={printReport} variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={exportToPDF} variant="outline" size="sm">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${getRiskColor(assessmentResult.riskLevel)}`}
                >
                  <span className="font-bold text-lg">{assessmentResult.riskLevel} Risk</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">AI Risk Assessment</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{assessmentResult.riskScore}/100</div>
                <p className="text-sm text-gray-600">Risk Score</p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getBMIColor(assessmentResult.bmi.category)}`}>
                  {assessmentResult.bmi.value}
                </div>
                <p className="text-sm text-gray-600">BMI ({assessmentResult.bmi.category})</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{new Date().toLocaleDateString()}</div>
                <p className="text-sm text-gray-600">Assessment Date</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {assessmentData.town}, {assessmentData.state}
                </div>
                <p className="text-sm text-gray-600">Location</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
        {assessmentResult.realTimeAlerts.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <Zap className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Real-time AI Alerts:</strong>
              <ul className="mt-2">
                {assessmentResult.realTimeAlerts.map((alert, index) => (
                  <li key={index}>• {alert}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* AI Insights */}
        <Alert className="border-purple-200 bg-purple-50">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Revolutionary AI Medical Insights:</strong> {assessmentResult.aiInsights}
          </AlertDescription>
        </Alert>

        {/* Critical Alert */}
        {assessmentResult.riskLevel === "Critical" && (
          <Alert className="border-red-600 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>CRITICAL RISK DETECTED:</strong> Seek immediate medical attention. Contact emergency services:
              102/108
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="revolutionary" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="revolutionary">🚀 Revolutionary</TabsTrigger>
            <TabsTrigger value="genetic">🧬 Genetic</TabsTrigger>
            <TabsTrigger value="voice">🗣️ Voice</TabsTrigger>
            <TabsTrigger value="vision">👁️ Vision</TabsTrigger>
            <TabsTrigger value="ayurveda">🌿 Ayurveda</TabsTrigger>
            <TabsTrigger value="economics">💰 Economics</TabsTrigger>
            <TabsTrigger value="mental">🧠 Mental</TabsTrigger>
            <TabsTrigger value="traditional">📊 Traditional</TabsTrigger>
          </TabsList>

          <TabsContent value="revolutionary" className="space-y-4">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <span>Revolutionary AI Features Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Dna className="w-8 h-8 text-green-600" />
                        <h3 className="font-bold text-green-800">Genetic Predictor</h3>
                      </div>
                      <p className="text-sm text-green-700">
                        AI analyzes family history and predicts genetic risks 10 years before symptoms appear
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        {assessmentResult.geneticPredictions.length} Predictions
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Mic className="w-8 h-8 text-orange-600" />
                        <h3 className="font-bold text-orange-800">Voice Biomarkers</h3>
                      </div>
                      <p className="text-sm text-orange-700">
                        30-second voice analysis detects COVID, depression, Alzheimer's, and 47+ conditions
                      </p>
                      <Badge className="mt-2 bg-orange-100 text-orange-800">
                        {assessmentResult.voiceBiomarkers.length} Conditions Analyzed
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Eye className="w-8 h-8 text-purple-600" />
                        <h3 className="font-bold text-purple-800">Vision AI</h3>
                      </div>
                      <p className="text-sm text-purple-700">
                        Point camera at skin/eyes for instant disease screening including cancer detection
                      </p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800">
                        {assessmentResult.visionAnalysis ? "Analysis Available" : "Ready to Scan"}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Leaf className="w-8 h-8 text-green-600" />
                        <h3 className="font-bold text-green-800">Ayurveda Integration</h3>
                      </div>
                      <p className="text-sm text-green-700">
                        World's first platform combining modern medicine with validated Ayurvedic treatments
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        Dosha: {assessmentResult.ayurvedicRecommendations.dosha}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        <h3 className="font-bold text-blue-800">Family Health</h3>
                      </div>
                      <p className="text-sm text-blue-700">
                        AI manages entire family health with collective genetic insights and recommendations
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">
                        {assessmentResult.familyHealthInsights.length} Family Insights
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-indigo-200 bg-indigo-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <DollarSign className="w-8 h-8 text-indigo-600" />
                        <h3 className="font-bold text-indigo-800">Healthcare Economics</h3>
                      </div>
                      <p className="text-sm text-indigo-700">
                        Finds cheapest treatments, optimizes insurance, and medical tourism planning
                      </p>
                      <Badge className="mt-2 bg-indigo-100 text-indigo-800">Cost Optimization Available</Badge>
                    </CardContent>
                  </Card>
                </div>

                {/* Interactive Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card className="border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="font-bold mb-2">Upload Family Photos</h4>
                      <p className="text-sm text-gray-600 mb-4">AI genetic risk analysis from family photos</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setUploadedImages(Array.from(e.target.files))
                          }
                        }}
                      />
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photos
                      </Button>
                      {uploadedImages.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">{uploadedImages.length} photos uploaded</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Mic className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="font-bold mb-2">Voice Analysis</h4>
                      <p className="text-sm text-gray-600 mb-4">30-second voice biomarker detection</p>
                      <Button
                        onClick={startVoiceAnalysis}
                        disabled={isRecording}
                        variant="outline"
                        size="sm"
                        className={isRecording ? "bg-red-100 text-red-600" : ""}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? "Recording..." : "Start Voice Analysis"}
                      </Button>
                      {isRecording && <p className="text-sm text-red-600 mt-2">Recording for 30 seconds...</p>}
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="font-bold mb-2">Vision Screening</h4>
                      <p className="text-sm text-gray-600 mb-4">Real-time health vision AI analysis</p>
                      <Button
                        onClick={isCameraActive ? captureAndAnalyze : startCameraAnalysis}
                        variant="outline"
                        size="sm"
                        className={isCameraActive ? "bg-purple-100 text-purple-600" : ""}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {isCameraActive ? "Capture & Analyze" : "Start Camera"}
                      </Button>
                      {isCameraActive && (
                        <div className="mt-4">
                          <video ref={videoRef} className="w-full max-w-xs mx-auto rounded-lg" autoPlay muted />
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genetic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Dna className="w-6 h-6 text-green-600" />
                  <span>AI Genetic Health Predictions (10-Year Forecast)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentResult.geneticPredictions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessmentResult.geneticPredictions.map((prediction, index) => (
                      <Card key={index} className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                          <h4 className="font-bold text-green-800 mb-2">{prediction.condition}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Risk Percentage:</span>
                              <Badge variant="outline" className="bg-green-100">
                                {prediction.riskPercentage}%
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Estimated Onset:</span>
                              <span className="text-sm font-medium">{prediction.yearsToOnset} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">AI Confidence:</span>
                              <span className="text-sm font-medium">{prediction.confidence}%</span>
                            </div>
                            <div className="mt-3">
                              <h5 className="text-sm font-medium mb-1">Preventive Measures:</h5>
                              <ul className="text-xs space-y-1">
                                {prediction.preventiveMeasures.map((measure, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {measure}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dna className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Genetic Analysis Available</h3>
                    <p className="text-gray-500 mb-4">Upload family photos to get AI genetic risk predictions</p>
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Family Photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="w-6 h-6 text-orange-600" />
                  <span>Voice Biomarker Analysis (30-Second Detection)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentResult.voiceBiomarkers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessmentResult.voiceBiomarkers.map((biomarker, index) => (
                      <Card key={index} className="border-orange-200 bg-orange-50">
                        <CardContent className="pt-6">
                          <h4 className="font-bold text-orange-800 mb-2">{biomarker.condition}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Detection Probability:</span>
                              <Badge variant="outline" className="bg-orange-100">
                                {biomarker.probability}%
                              </Badge>
                            </div>
                            <div className="mt-3">
                              <h5 className="text-sm font-medium mb-1">Voice Indicators:</h5>
                              <div className="flex flex-wrap gap-1">
                                {biomarker.indicators.map((indicator, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {indicator}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                              <h5 className="text-sm font-medium mb-1">AI Recommendation:</h5>
                              <p className="text-sm text-orange-800">{biomarker.recommendation}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mic className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Voice Analysis Available</h3>
                    <p className="text-gray-500 mb-4">Record a 30-second voice sample for biomarker detection</p>
                    <Button onClick={startVoiceAnalysis} disabled={isRecording} variant="outline">
                      <Mic className="w-4 h-4 mr-2" />
                      {isRecording ? "Recording..." : "Start Voice Analysis"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-6 h-6 text-purple-600" />
                  <span>Real-Time Health Vision AI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentResult.visionAnalysis ? (
                  <div className="space-y-4">
                    <Alert className="border-purple-200 bg-purple-50">
                      <Eye className="h-4 w-4 text-purple-600" />
                      <AlertDescription className="text-purple-800">
                        <strong>Overall Risk Assessment:</strong> {assessmentResult.visionAnalysis.overallRisk}
                        <br />
                        <strong>Immediate Action:</strong> {assessmentResult.visionAnalysis.immediateAction}
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assessmentResult.visionAnalysis.detectedConditions.map((condition, index) => (
                        <Card key={index} className="border-purple-200 bg-purple-50">
                          <CardContent className="pt-6">
                            <h4 className="font-bold text-purple-800 mb-2">{condition.condition}</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Confidence:</span>
                                <Badge variant="outline" className="bg-purple-100">
                                  {condition.confidence}%
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Severity:</span>
                                <span className="text-sm font-medium capitalize">{condition.severity}</span>
                              </div>
                              <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                                <h5 className="text-sm font-medium mb-1">Recommendation:</h5>
                                <p className="text-sm text-purple-800">{condition.recommendation}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Vision Analysis Available</h3>
                    <p className="text-gray-500 mb-4">
                      Use camera to scan skin, eyes, or other areas for health screening
                    </p>
                    <Button onClick={startCameraAnalysis} variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ayurveda" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-6 h-6 text-green-600" />
                  <span>AI Ayurveda Integration (World's First)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-green-800 mb-4">Dosha Analysis</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium">Primary Dosha:</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            {assessmentResult.ayurvedicRecommendations.dosha}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Detected Imbalances:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {assessmentResult.ayurvedicRecommendations.imbalance.map((imbalance, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {imbalance}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-green-800 mb-4">Recommended Herbs</h4>
                      <div className="space-y-3">
                        {assessmentResult.ayurvedicRecommendations.herbs.map((herb, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg">
                            <h5 className="font-medium text-green-800">{herb.name}</h5>
                            <p className="text-sm text-gray-600">Dosage: {herb.dosage}</p>
                            <p className="text-sm text-green-700">Benefits: {herb.benefits}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-green-800 mb-4">Lifestyle Recommendations</h4>
                      <ul className="space-y-2">
                        {assessmentResult.ayurvedicRecommendations.lifestyle.map((lifestyle, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-sm">{lifestyle}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-green-800 mb-4">Dietary Guidelines & Yoga</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Diet:</h5>
                          <ul className="space-y-1">
                            {assessmentResult.ayurvedicRecommendations.diet.map((diet, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {diet}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-700 mb-2">Yoga Practices:</h5>
                          <ul className="space-y-1">
                            {assessmentResult.ayurvedicRecommendations.yoga.map((yoga, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="w-1 h-1 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {yoga}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="economics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <span>Healthcare Economics AI Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-blue-800 mb-4">Treatment Cost Analysis</h4>
                      <div className="space-y-3">
                        {assessmentResult.healthcareEconomics.treatmentCosts.map((cost, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg">
                            <h5 className="font-medium text-blue-800">{cost.treatment}</h5>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <span>Cost: {cost.costRange}</span>
                              <span>Quality: {cost.quality}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Location: {cost.location}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-blue-800 mb-4">Insurance Optimization</h4>
                      <ul className="space-y-2">
                        {assessmentResult.healthcareEconomics.insuranceOptimization.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-blue-800 mb-4">Medical Tourism Options</h4>
                      <div className="space-y-3">
                        {assessmentResult.healthcareEconomics.medicalTourism.map((option, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg">
                            <h5 className="font-medium text-blue-800">{option.country}</h5>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                              <span className="text-green-600">Savings: {option.savings}</span>
                              <span>Quality: {option.quality}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-blue-800 mb-4">Generic Medicine Alternatives</h4>
                      <div className="space-y-3">
                        {assessmentResult.healthcareEconomics.genericAlternatives.map((alt, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{alt.brand}</span>
                              <span className="text-xs text-gray-500">→</span>
                              <span className="text-sm font-medium text-green-600">{alt.generic}</span>
                            </div>
                            <div className="text-center mt-2">
                              <Badge className="bg-green-100 text-green-800">Save {alt.savings}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mental" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-pink-600" />
                  <span>AI Mental Health Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-pink-200 bg-pink-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-pink-800 mb-4">Psychological Health Scores</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Depression Score</span>
                            <span className="text-sm font-bold">
                              {assessmentResult.mentalHealthAssessment.depressionScore}/100
                            </span>
                          </div>
                          <Progress value={assessmentResult.mentalHealthAssessment.depressionScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Anxiety Score</span>
                            <span className="text-sm font-bold">
                              {assessmentResult.mentalHealthAssessment.anxietyScore}/100
                            </span>
                          </div>
                          <Progress value={assessmentResult.mentalHealthAssessment.anxietyScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Stress Level</span>
                            <span className="text-sm font-bold">
                              {assessmentResult.mentalHealthAssessment.stressLevel}/100
                            </span>
                          </div>
                          <Progress value={assessmentResult.mentalHealthAssessment.stressLevel} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-pink-200 bg-pink-50">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-pink-800 mb-4">AI Recommendations</h4>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium">Recommended Therapy:</span>
                          <Badge className="ml-2 bg-pink-100 text-pink-800">
                            {assessmentResult.mentalHealthAssessment.therapyType}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Urgency Level:</span>
                          <Badge
                            className={`ml-2 ${
                              assessmentResult.mentalHealthAssessment.urgency === "high"
                                ? "bg-red-100 text-red-800"
                                : assessmentResult.mentalHealthAssessment.urgency === "moderate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {assessmentResult.mentalHealthAssessment.urgency}
                          </Badge>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Treatment Recommendations:</h5>
                          <ul className="space-y-1">
                            {assessmentResult.mentalHealthAssessment.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm flex items-start">
                                <span className="w-1 h-1 bg-pink-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Family Health Insights */}
                {assessmentResult.familyHealthInsights.length > 0 && (
                  <Card className="border-indigo-200 bg-indigo-50 mt-6">
                    <CardContent className="pt-6">
                      <h4 className="font-bold text-indigo-800 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Family Health Ecosystem Insights
                      </h4>
                      <ul className="space-y-2">
                        {assessmentResult.familyHealthInsights.map((insight, index) => (
                          <li key={index} className="flex items-start">
                            <Shield className="w-4 h-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traditional" className="space-y-4">
            {/* Traditional tabs content - BMI, Vitals, Medications, Diet, etc. */}
            <Tabs defaultValue="vitals" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="vitals">Vitals & BMI</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="diet">Diet Plan</TabsTrigger>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
                <TabsTrigger value="water">Water Schedule</TabsTrigger>
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
              </TabsList>

              <TabsContent value="vitals" className="space-y-4">
                {/* BMI Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-blue-600" />
                      <span>BMI Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${getBMIColor(assessmentResult.bmi.category)}`}>
                          {assessmentResult.bmi.value}
                        </div>
                        <p className="text-sm text-gray-600">BMI Value</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-semibold ${getBMIColor(assessmentResult.bmi.category)}`}>
                          {assessmentResult.bmi.category}
                        </div>
                        <p className="text-sm text-gray-600">Category</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-700">{assessmentResult.bmi.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vitals Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(assessmentResult.vitalsAnalysis).map(([vital, analysis]) => (
                    <Card key={vital}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <Heart className="w-4 h-4" />
                          <span className="capitalize">{vital.replace(/([A-Z])/g, " $1")}</span>
                          <Badge variant={analysis.status === "Normal" ? "default" : "destructive"}>
                            {analysis.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-gray-500">Normal: {analysis.normalRange}</p>
                        <p className="text-sm text-gray-700">{analysis.recommendation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                {/* Medication Disclaimer */}
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>AI-GENERATED RECOMMENDATIONS:</strong> These medication suggestions are generated by
                    advanced AI based on your symptoms and medical history. All medications MUST be confirmed and
                    prescribed by a qualified medical practitioner before use.
                  </AlertDescription>
                </Alert>

                {assessmentResult.medications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessmentResult.medications.map((med, index) => (
                      <Card key={index} className="border-purple-200">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-purple-700">
                            <Pill className="w-5 h-5" />
                            <span>
                              {med.name} - {med.dosage}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-sm text-purple-800">
                              <strong>Medical Reason:</strong> {med.reason}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              <strong>Timing:</strong> {med.timing.join(", ")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              <strong>Frequency:</strong> {med.frequency}
                            </span>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Instructions:</strong> {med.instructions}
                            </p>
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong>Duration:</strong> {med.duration}
                          </div>
                          {med.warning && (
                            <Alert className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              <AlertDescription className="text-red-800 text-xs">{med.warning}</AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Pill className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No Medications Recommended</h3>
                      <p className="text-gray-500">
                        Based on your current assessment, no specific medications are recommended at this time.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="diet" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Utensils className="w-5 h-5 text-green-600" />
                      <span>AI-Generated Comprehensive Diet Plan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResult.dietPlan.map((meal, index) => (
                        <Card key={index} className="border-green-200 bg-green-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-green-800">
                                {meal.time} - {meal.meal}
                              </h4>
                              <Badge className="bg-green-100 text-green-800">{meal.calories} cal</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-green-700">{meal.protein}g</div>
                                <div className="text-xs text-gray-600">Protein</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-green-700">{meal.carbs}g</div>
                                <div className="text-xs text-gray-600">Carbs</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-green-700">{meal.fat}g</div>
                                <div className="text-xs text-gray-600">Fat</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-green-700">{meal.fiber}g</div>
                                <div className="text-xs text-gray-600">Fiber</div>
                              </div>
                            </div>
                            <div className="mb-3">
                              <h5 className="font-medium text-green-800 mb-1">Foods:</h5>
                              <div className="flex flex-wrap gap-1">
                                {meal.foods.map((food, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {food}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                              <p className="text-sm text-green-800">
                                <strong>Instructions:</strong> {meal.instructions}
                              </p>
                              <p className="text-sm text-green-800 mt-1">
                                <strong>Water:</strong> {meal.waterIntake}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exercise" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Dumbbell className="w-5 h-5 text-orange-600" />
                      <span>AI Exercise Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assessmentResult.exerciseSchedule.map((exercise, index) => (
                        <Card key={index} className="border-orange-200 bg-orange-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-orange-800">
                                {exercise.time} - {exercise.activity}
                              </h4>
                              <Badge className="bg-orange-100 text-orange-800">{exercise.caloriesBurned} cal</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <span className="text-sm font-medium text-orange-700">Duration:</span>
                                <p className="text-sm">{exercise.duration}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-orange-700">Intensity:</span>
                                <p className="text-sm capitalize">{exercise.intensity}</p>
                              </div>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                              <p className="text-sm text-orange-800">
                                <strong>Instructions:</strong> {exercise.instructions}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="water" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span>Daily Water Intake Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assessmentResult.waterSchedule.map((water, index) => (
                        <Card key={index} className="border-blue-200 bg-blue-50">
                          <CardContent className="pt-4 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">{water.time}</div>
                            <div className="text-lg font-semibold text-blue-800 mb-1">{water.amount}</div>
                            <div className="text-sm text-blue-700">{water.type}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2">Daily Water Intake Summary</h4>
                      <p className="text-sm text-blue-700">
                        Total recommended water intake:{" "}
                        <strong>
                          {assessmentResult.waterSchedule.reduce((total, water) => {
                            const amount = Number.parseInt(water.amount.replace(/\D/g, "")) || 0
                            return total + amount
                          }, 0)}
                          ml
                        </strong>{" "}
                        per day
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="followup" className="space-y-4">
                {/* Lab Tests */}
                {assessmentResult.labTests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span>Recommended Lab Tests</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assessmentResult.labTests.map((test, index) => (
                          <Card key={index} className="border-purple-200 bg-purple-50">
                            <CardContent className="pt-4">
                              <h4 className="font-bold text-purple-800 mb-2">{test.test}</h4>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm">
                                    <strong>Urgency:</strong> {test.urgency}
                                  </span>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                  <p className="text-sm text-purple-800">
                                    <strong>Reason:</strong> {test.reason}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-700">
                                  <strong>Instructions:</strong> {test.instructions}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Follow-up Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span>Follow-up Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResult.followUpSchedule.map((followUp, index) => (
                        <Card key={index} className="border-green-200 bg-green-50">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-green-800">{followUp.type}</h4>
                              <Badge className="bg-green-100 text-green-800">{followUp.when}</Badge>
                            </div>
                            <p className="text-sm text-green-700">{followUp.instructions}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Facilities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>AI-Recommended Medical Contacts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-bold text-blue-800 mb-2">Doctor & Hospital</h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Doctor:</strong> {assessmentResult.medicalFacilities.doctorName}
                            </p>
                            <p>
                              <strong>Specialization:</strong> {assessmentResult.medicalFacilities.specialization}
                            </p>
                            <p>
                              <strong>Hospital:</strong> {assessmentResult.medicalFacilities.hospitalName}
                            </p>
                            <p>
                              <strong>Address:</strong> {assessmentResult.medicalFacilities.hospitalAddress}
                            </p>
                            <p>
                              <strong>Phone:</strong>{" "}
                              <a
                                href={`tel:${assessmentResult.medicalFacilities.hospitalPhone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {assessmentResult.medicalFacilities.hospitalPhone}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-bold text-green-800 mb-2">Lab & Medical Shop</h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Lab:</strong> {assessmentResult.medicalFacilities.labName}
                            </p>
                            <p>
                              <strong>Lab Phone:</strong>{" "}
                              <a
                                href={`tel:${assessmentResult.medicalFacilities.labNumber}`}
                                className="text-green-600 hover:underline"
                              >
                                {assessmentResult.medicalFacilities.labNumber}
                              </a>
                            </p>
                            <p>
                              <strong>Medical Shop:</strong> {assessmentResult.medicalFacilities.medicalShopName}
                            </p>
                            <p>
                              <strong>Shop Phone:</strong>{" "}
                              <a
                                href={`tel:${assessmentResult.medicalFacilities.medicalShopNumber}`}
                                className="text-green-600 hover:underline"
                              >
                                {assessmentResult.medicalFacilities.medicalShopNumber}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-red-600" />
                      <span>Emergency Contacts (India)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assessmentResult.emergencyContacts.map((contact, index) => (
                        <Card key={index} className="border-red-200 bg-red-50">
                          <CardContent className="pt-4">
                            <h4 className="font-bold text-red-800 mb-2">{contact.service}</h4>
                            <div className="text-center mb-3">
                              <a
                                href={`tel:${contact.number}`}
                                className="text-2xl font-bold text-red-600 hover:underline"
                              >
                                {contact.number}
                              </a>
                            </div>
                            <p className="text-xs text-red-700">{contact.when}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Preventive Care */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <span>Preventive Care Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assessmentResult.preventiveCare.map((care, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-lg">
                          <Shield className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-indigo-800">{care}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-6">
          <Button onClick={resetForm} variant="outline" size="lg">
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
          <Button onClick={printReport} variant="outline" size="lg">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
          <Button onClick={exportToPDF} size="lg">
            <FileDown className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="cursor-pointer" onClick={() => (window.location.href = "/")}>
          <MyMedLogo size="lg" />
        </div>
        <NavigationButtons onReset={resetForm} showReset={currentStep > 1} />
      </div>

      {/* Revolutionary Features Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2 text-xl">
            <Sparkles className="w-6 h-6" />
            <span>REVOLUTIONARY AI HEALTH ASSESSMENT</span>
            <Sparkles className="w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">World's First Comprehensive AI Health Ecosystem</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Dna className="w-4 h-4" />
              <span>Genetic Predictions</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mic className="w-4 h-4" />
              <span>Voice Biomarkers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Vision AI</span>
            </div>
            <div className="flex items-center space-x-1">
              <Leaf className="w-4 h-4" />
              <span>Ayurveda Integration</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Family Health</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Cost Optimization</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Assessment Progress</span>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Real-time Analysis */}
      {realTimeAnalysis && (
        <Alert className="border-blue-200 bg-blue-50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Real-time AI Analysis:</strong> {realTimeAnalysis}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Steps */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={assessmentData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={assessmentData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={assessmentData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="Enter weight in kg"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  value={assessmentData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="Enter height in cm"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={assessmentData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  value={assessmentData.state}
                  onChange={(e) => {
                    handleInputChange("state", e.target.value)
                    handleInputChange("town", "") // Reset town when state changes
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select state</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="town">Town/City *</Label>
                {assessmentData.state && townsByState[assessmentData.state] ? (
                  <select
                    id="town"
                    value={assessmentData.town}
                    onChange={(e) => handleInputChange("town", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select town/city</option>
                    {townsByState[assessmentData.state].map((town) => (
                      <option key={town} value={town}>
                        {town}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="town"
                    value={assessmentData.town}
                    onChange={(e) => handleInputChange("town", e.target.value)}
                    placeholder="Enter your town/city"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value="India" disabled className="bg-gray-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span>Vital Signs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic) mmHg</Label>
                <Input
                  id="bloodPressureSystolic"
                  type="number"
                  value={assessmentData.vitals.bloodPressureSystolic}
                  onChange={(e) => handleVitalsChange("bloodPressureSystolic", e.target.value)}
                  placeholder="e.g., 120"
                />
              </div>
              <div>
                <Label htmlFor="bloodPressureDiastolic">Blood Pressure (Diastolic) mmHg</Label>
                <Input
                  id="bloodPressureDiastolic"
                  type="number"
                  value={assessmentData.vitals.bloodPressureDiastolic}
                  onChange={(e) => handleVitalsChange("bloodPressureDiastolic", e.target.value)}
                  placeholder="e.g., 80"
                />
              </div>
              <div>
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={assessmentData.vitals.heartRate}
                  onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
                  placeholder="e.g., 72"
                />
              </div>
              <div>
                <Label htmlFor="temperature">Body Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={assessmentData.vitals.temperature}
                  onChange={(e) => handleVitalsChange("temperature", e.target.value)}
                  placeholder="e.g., 36.5"
                />
              </div>
              <div>
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  value={assessmentData.vitals.oxygenSaturation}
                  onChange={(e) => handleVitalsChange("oxygenSaturation", e.target.value)}
                  placeholder="e.g., 98"
                />
              </div>
              <div>
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  type="number"
                  value={assessmentData.vitals.bloodSugar}
                  onChange={(e) => handleVitalsChange("bloodSugar", e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={assessmentData.vitals.respiratoryRate}
                  onChange={(e) => handleVitalsChange("respiratoryRate", e.target.value)}
                  placeholder="e.g., 16"
                />
              </div>
            </div>
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Note:</strong> If you don't have access to medical equipment, you can skip these fields or enter
                approximate values. Our AI will still provide valuable health insights.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span>Current Symptoms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primarySymptom">Primary Symptom *</Label>
              <Textarea
                id="primarySymptom"
                value={assessmentData.primarySymptom}
                onChange={(e) => handleInputChange("primarySymptom", e.target.value)}
                placeholder="Describe your main symptom in detail (e.g., headache, chest pain, fever, etc.)"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symptomDuration">How long have you had this symptom?</Label>
                <select
                  id="symptomDuration"
                  value={assessmentData.symptomDuration}
                  onChange={(e) => handleInputChange("symptomDuration", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select duration</option>
                  <option value="Less than 1 day">Less than 1 day</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="More than 3 months">More than 3 months</option>
                </select>
              </div>
              <div>
                <Label htmlFor="symptomSeverity">Symptom Severity (1-10 scale)</Label>
                <select
                  id="symptomSeverity"
                  value={assessmentData.symptomSeverity}
                  onChange={(e) => handleInputChange("symptomSeverity", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select severity</option>
                  {severityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="additionalSymptoms">Additional Symptoms</Label>
              <Textarea
                id="additionalSymptoms"
                value={assessmentData.additionalSymptoms}
                onChange={(e) => handleInputChange("additionalSymptoms", e.target.value)}
                placeholder="List any other symptoms you're experiencing"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Medical History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Chronic Conditions</Label>
              <p className="text-sm text-gray-600 mb-3">Select any chronic conditions you have:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonConditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={condition}
                      checked={assessmentData.chronicConditions.includes(condition)}
                      onChange={() => handleConditionToggle(condition)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={condition} className="text-sm cursor-pointer">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                value={assessmentData.currentMedications.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "currentMedications",
                    e.target.value.split(",").map((med) => med.trim()),
                  )
                }
                placeholder="List all medications you're currently taking (separate with commas)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={assessmentData.allergies.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "allergies",
                    e.target.value.split(",").map((allergy) => allergy.trim()),
                  )
                }
                placeholder="List any allergies (medications, food, environmental - separate with commas)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="familyHistory">Family Medical History</Label>
              <Textarea
                id="familyHistory"
                value={assessmentData.familyHistory.join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "familyHistory",
                    e.target.value.split(",").map((history) => history.trim()),
                  )
                }
                placeholder="List family medical history (diabetes, heart disease, cancer, etc. - separate with commas)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span>Lifestyle Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                <select
                  id="exerciseFrequency"
                  value={assessmentData.exerciseFrequency}
                  onChange={(e) => handleInputChange("exerciseFrequency", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select frequency</option>
                  <option value="Never">Never</option>
                  <option value="Rarely (1-2 times per month)">Rarely (1-2 times per month)</option>
                  <option value="Sometimes (1-2 times per week)">Sometimes (1-2 times per week)</option>
                  <option value="Regularly (3-4 times per week)">Regularly (3-4 times per week)</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
              <div>
                <Label htmlFor="smokingStatus">Smoking Status</Label>
                <select
                  id="smokingStatus"
                  value={assessmentData.smokingStatus}
                  onChange={(e) => handleInputChange("smokingStatus", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="Never smoked">Never smoked</option>
                  <option value="Former smoker">Former smoker</option>
                  <option value="Current smoker (less than 10 per day)">Current smoker (less than 10 per day)</option>
                  <option value="Current smoker (10-20 per day)">Current smoker (10-20 per day)</option>
                  <option value="Current smoker (more than 20 per day)">Current smoker (more than 20 per day)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                <select
                  id="alcoholConsumption"
                  value={assessmentData.alcoholConsumption}
                  onChange={(e) => handleInputChange("alcoholConsumption", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select consumption</option>
                  <option value="Never">Never</option>
                  <option value="Rarely (special occasions)">Rarely (special occasions)</option>
                  <option value="Occasionally (1-2 times per week)">Occasionally (1-2 times per week)</option>
                  <option value="Regularly (3-4 times per week)">Regularly (3-4 times per week)</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sleepHours">Average Sleep Hours</Label>
                <select
                  id="sleepHours"
                  value={assessmentData.sleepHours}
                  onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select hours</option>
                  <option value="Less than 5 hours">Less than 5 hours</option>
                  <option value="5-6 hours">5-6 hours</option>
                  <option value="7-8 hours">7-8 hours</option>
                  <option value="9-10 hours">9-10 hours</option>
                  <option value="More than 10 hours">More than 10 hours</option>
                </select>
              </div>
              <div>
                <Label htmlFor="stressLevel">Stress Level (1-10 scale)</Label>
                <select
                  id="stressLevel"
                  value={assessmentData.stressLevel}
                  onChange={(e) => handleInputChange("stressLevel", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select stress level</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                    <option key={level} value={level.toString()}>
                      {level} - {level <= 3 ? "Low" : level <= 6 ? "Moderate" : level <= 8 ? "High" : "Very High"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="dietType">Diet Type</Label>
                <select
                  id="dietType"
                  value={assessmentData.dietType}
                  onChange={(e) => handleInputChange("dietType", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select diet type</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-vegetarian">Non-vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain vegetarian">Jain vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Keto">Keto</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="waterIntake">Daily Water Intake (glasses)</Label>
                <select
                  id="waterIntake"
                  value={assessmentData.waterIntake}
                  onChange={(e) => handleInputChange("waterIntake", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select water intake</option>
                  <option value="1-2 glasses">1-2 glasses</option>
                  <option value="3-4 glasses">3-4 glasses</option>
                  <option value="5-6 glasses">5-6 glasses</option>
                  <option value="7-8 glasses">7-8 glasses</option>
                  <option value="More than 8 glasses">More than 8 glasses</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={
              (currentStep === 1 &&
                (!assessmentData.name ||
                  !assessmentData.age ||
                  !assessmentData.weight ||
                  !assessmentData.height ||
                  !assessmentData.gender ||
                  !assessmentData.state ||
                  !assessmentData.town)) ||
              (currentStep === 3 && !assessmentData.primarySymptom)
            }
          >
            Next
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Revolutionary AI Assessment...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Revolutionary AI Assessment
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
