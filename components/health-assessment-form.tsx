"use client"

import { useState } from "react"
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

    const assessmentPrompt = `
You are an advanced AI medical assistant. Analyze this comprehensive health assessment and provide detailed, accurate medical recommendations. Base all suggestions on current medical guidelines and evidence-based medicine.

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

PROVIDE DETAILED ANALYSIS IN THIS EXACT JSON FORMAT:
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
  "preventiveCare": ["specific preventive measures based on age and risk factors"]
}

IMPORTANT GUIDELINES:
1. Only suggest lab tests if medically necessary based on symptoms/conditions
2. Medications must be accurate and age-appropriate
3. Diet plan should be culturally appropriate for India
4. Medical facilities should be realistic for the specified location
5. All recommendations must be evidence-based
6. Include proper medical disclaimers
7. Consider age-specific recommendations (pediatric, adult, geriatric)
8. Factor in Indian dietary preferences and availability
9. Provide realistic contact information format for Indian medical facilities
10. Water intake should be scheduled throughout the day with specific amounts
`

    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "assessment",
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
  }

  const generateMedicalReport = () => {
    if (!assessmentResult) return ""

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MYMED.AI Health Assessment Report</title>
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
        <h1>AI-POWERED COMPREHENSIVE HEALTH ASSESSMENT</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Report ID:</strong> MYM-${Date.now()}</p>
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

    <div class="contact-info">
        <h2>RECOMMENDED MEDICAL CONTACTS</h2>
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
        <p><strong>AI-Powered Health Assessment Platform</strong></p>
        <p>This report is generated by advanced AI technology for informational purposes only.</p>
        <p>All recommendations must be confirmed by qualified medical practitioners.</p>
        <p>Free healthcare service provided by MYMED.AI startup for India.</p>
        <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Powered by OpenAI & Advanced Medical AI</strong></p>
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

        {/* Results Header */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span>AI Health Assessment - {assessmentData.name}</span>
                <Badge className="bg-purple-100 text-purple-800">AI-Powered</Badge>
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

        {/* AI Insights */}
        <Alert className="border-purple-200 bg-purple-50">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>AI Medical Insights:</strong> {assessmentResult.aiInsights}
          </AlertDescription>
        </Alert>

        {/* Medical Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>AI-Recommended Medical Contacts in {assessmentData.town}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
                  <strong>Phone:</strong> {assessmentResult.medicalFacilities.hospitalPhone}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Lab:</strong> {assessmentResult.medicalFacilities.labName}
                </p>
                <p>
                  <strong>Lab Number:</strong> {assessmentResult.medicalFacilities.labNumber}
                </p>
                <p>
                  <strong>Medical Shop:</strong> {assessmentResult.medicalFacilities.medicalShopName}
                </p>
                <p>
                  <strong>Shop Number:</strong> {assessmentResult.medicalFacilities.medicalShopNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <strong>AI-GENERATED RECOMMENDATIONS:</strong> These medication suggestions are generated by advanced AI
                based on your symptoms and medical history. All medications MUST be confirmed and prescribed by a
                qualified medical practitioner before use.
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
                      <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                        <p className="text-xs text-orange-800 font-medium">{med.warning}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-600">
                    No specific medications recommended by AI at this time. Consult your healthcare provider for
                    personalized medication advice.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <Utensils className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>AI-Generated Diet Plan:</strong> This comprehensive meal plan is customized based on your health
                profile, age, and dietary preferences. All nutritional values are calculated by AI.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessmentResult.dietPlan.map((meal, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <Utensils className="w-5 h-5" />
                      <span>
                        {meal.time} - {meal.meal}
                      </span>
                      <Badge variant="outline">{meal.calories} cal</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Foods:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {meal.foods.map((food, i) => (
                          <li key={i}>{food}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <div className="font-semibold text-blue-700">{meal.protein}g</div>
                        <div className="text-gray-600">Protein</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-700">{meal.carbs}g</div>
                        <div className="text-gray-600">Carbs</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-700">{meal.fat}g</div>
                        <div className="text-gray-600">Fat</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-700">{meal.fiber}g</div>
                        <div className="text-gray-600">Fiber</div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">{meal.instructions}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Water:</strong> {meal.waterIntake}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <Dumbbell className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>AI Exercise Plan:</strong> This exercise schedule is personalized based on your fitness level,
                age, and health conditions. Start gradually and listen to your body.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessmentResult.exerciseSchedule.map((exercise, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-700">
                      <Dumbbell className="w-5 h-5" />
                      <span>
                        {exercise.time} - {exercise.activity}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>
                        <strong>Duration:</strong> {exercise.duration}
                      </span>
                      <Badge variant="outline">{exercise.intensity}</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{exercise.caloriesBurned}</div>
                      <div className="text-sm text-gray-600">Calories Burned</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">{exercise.instructions}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="water" className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Activity className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>AI Water Schedule:</strong> This hydration plan is optimized for your body weight, activity
                level, and climate. Proper hydration is crucial for health.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {assessmentResult.waterSchedule.map((water, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{water.time}</div>
                    <div className="text-lg font-semibold text-blue-800">{water.amount}</div>
                    <div className="text-sm text-gray-600 mt-2">{water.type}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Water Intake Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {assessmentResult.waterSchedule.reduce((total, water) => {
                      const amount = Number.parseInt(water.amount.replace("ml", ""))
                      return total + amount
                    }, 0)}
                    ml
                  </div>
                  <div className="text-gray-600">Total Daily Water Intake</div>
                  <p className="text-sm text-gray-500 mt-2">
                    Approximately{" "}
                    {Math.round(
                      assessmentResult.waterSchedule.reduce((total, water) => {
                        const amount = Number.parseInt(water.amount.replace("ml", ""))
                        return total + amount
                      }, 0) / 250,
                    )}{" "}
                    glasses of water per day
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lab Tests */}
              {assessmentResult.labTests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-purple-700">
                      <FileText className="w-5 h-5" />
                      <span>AI-Recommended Lab Tests</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {assessmentResult.labTests.map((test, index) => (
                      <div key={index} className="border border-purple-200 p-3 rounded-lg">
                        <h4 className="font-medium">{test.test}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{test.urgency}</Badge>
                        </div>
                        <p className="text-sm text-purple-700 mt-2">
                          <strong>Reason:</strong> {test.reason}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{test.instructions}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Follow-up Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-indigo-700">
                    <Clock className="w-5 h-5" />
                    <span>Follow-up Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentResult.followUpSchedule.map((followUp, index) => (
                    <div key={index} className="border border-indigo-200 p-3 rounded-lg">
                      <h4 className="font-medium">{followUp.type}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{followUp.when}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{followUp.instructions}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preventive Care */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <Heart className="w-5 h-5" />
                  <span>AI Preventive Care Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assessmentResult.preventiveCare.map((care, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-green-800">{care}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Emergency Contacts (India)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {assessmentResult.emergencyContacts.map((contact, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                      <h4 className="font-bold text-red-800">{contact.service}</h4>
                      <div className="text-2xl font-bold text-red-600 my-2">{contact.number}</div>
                      <p className="text-sm text-red-700">{contact.when}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Disclaimer */}
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-6 rounded-lg">
          <div className="cursor-pointer mb-3" onClick={() => (window.location.href = "/")}>
            <MyMedLogo size="md" className="mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="font-medium">AI-Powered Health Assessment Service</p>
            <p>
              This comprehensive assessment is powered by advanced AI technology and provided free by MYMED.AI startup.
            </p>
            <p>All AI recommendations must be confirmed by qualified medical practitioners.</p>
            <p>Data is processed securely and not stored on our servers.</p>
            <p className="text-purple-600 font-medium">Powered by OpenAI & Advanced Medical AI</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="cursor-pointer" onClick={() => (window.location.href = "/")}>
          <MyMedLogo size="lg" />
        </div>
        <NavigationButtons onReset={resetForm} showReset={true} variant="compact" />
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={assessmentData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  value={assessmentData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={assessmentData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  value={assessmentData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="Enter weight in kg"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  value={assessmentData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="Enter height in cm (e.g. 175)"
                  type="number"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  value={assessmentData.state}
                  onChange={(e) => {
                    handleInputChange("state", e.target.value)
                    handleInputChange("town", "") // Reset town when state changes
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="town">Town/City *</Label>
                <select
                  id="town"
                  value={assessmentData.town}
                  onChange={(e) => handleInputChange("town", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!assessmentData.state}
                >
                  <option value="">Select Town/City</option>
                  {assessmentData.state &&
                    townsByState[assessmentData.state]?.map((town) => (
                      <option key={town} value={town}>
                        {town}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={assessmentData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="India"
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Vital Signs */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic)</Label>
                <Input
                  id="bloodPressureSystolic"
                  value={assessmentData.vitals.bloodPressureSystolic}
                  onChange={(e) => handleVitalsChange("bloodPressureSystolic", e.target.value)}
                  placeholder="e.g. 120"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="bloodPressureDiastolic">Blood Pressure (Diastolic)</Label>
                <Input
                  id="bloodPressureDiastolic"
                  value={assessmentData.vitals.bloodPressureDiastolic}
                  onChange={(e) => handleVitalsChange("bloodPressureDiastolic", e.target.value)}
                  placeholder="e.g. 80"
                  type="number"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  value={assessmentData.vitals.heartRate}
                  onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
                  placeholder="e.g. 72"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  value={assessmentData.vitals.temperature}
                  onChange={(e) => handleVitalsChange("temperature", e.target.value)}
                  placeholder="e.g. 36.5"
                  type="number"
                  step="0.1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  value={assessmentData.vitals.oxygenSaturation}
                  onChange={(e) => handleVitalsChange("oxygenSaturation", e.target.value)}
                  placeholder="e.g. 98"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  value={assessmentData.vitals.bloodSugar}
                  onChange={(e) => handleVitalsChange("bloodSugar", e.target.value)}
                  placeholder="e.g. 100"
                  type="number"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
              <Input
                id="respiratoryRate"
                value={assessmentData.vitals.respiratoryRate}
                onChange={(e) => handleVitalsChange("respiratoryRate", e.target.value)}
                placeholder="e.g. 16"
                type="number"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Current Symptoms */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="w-5 h-5 mr-2" />
              Current Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="primarySymptom">Primary Symptom *</Label>
              <Textarea
                id="primarySymptom"
                value={assessmentData.primarySymptom}
                onChange={(e) => handleInputChange("primarySymptom", e.target.value)}
                placeholder="Describe your main symptom in detail"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symptomDuration">Duration</Label>
                <select
                  id="symptomDuration"
                  value={assessmentData.symptomDuration}
                  onChange={(e) => handleInputChange("symptomDuration", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option value="less-than-1-day">Less than 1 day</option>
                  <option value="1-3-days">1-3 days</option>
                  <option value="1-week">1 week</option>
                  <option value="more-than-1-week">More than 1 week</option>
                  <option value="more-than-1-month">More than 1 month</option>
                </select>
              </div>
              <div>
                <Label htmlFor="symptomSeverity">Severity (1-10)</Label>
                <select
                  id="symptomSeverity"
                  value={assessmentData.symptomSeverity}
                  onChange={(e) => handleInputChange("symptomSeverity", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
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
                placeholder="List any other symptoms you are experiencing"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Medical History */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label>Chronic Conditions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonConditions.map((condition) => (
                  <Badge
                    key={condition}
                    variant={assessmentData.chronicConditions.includes(condition) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleConditionToggle(condition)}
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                value={assessmentData.currentMedications.join(", ")}
                onChange={(e) => handleInputChange("currentMedications", e.target.value.split(", ").filter(Boolean))}
                placeholder="List medications, separated by commas"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={assessmentData.allergies.join(", ")}
                onChange={(e) => handleInputChange("allergies", e.target.value.split(", ").filter(Boolean))}
                placeholder="List allergies, separated by commas"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Lifestyle */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Lifestyle Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                <select
                  id="exerciseFrequency"
                  value={assessmentData.exerciseFrequency}
                  onChange={(e) => handleInputChange("exerciseFrequency", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option value="never">Never</option>
                  <option value="rarely">Rarely (1-2 times/month)</option>
                  <option value="weekly">Weekly (1-3 times/week)</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dietType">Diet Type</Label>
                <select
                  id="dietType"
                  value={assessmentData.dietType}
                  onChange={(e) => handleInputChange("dietType", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option value="regular">Regular/Mixed</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Ketogenic</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smokingStatus">Smoking Status</Label>
                <select
                  id="smokingStatus"
                  value={assessmentData.smokingStatus}
                  onChange={(e) => handleInputChange("smokingStatus", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option value="never">Never</option>
                  <option value="former">Former</option>
                  <option value="current">Current</option>
                </select>
              </div>
              <div>
                <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                <select
                  id="alcoholConsumption"
                  value={assessmentData.alcoholConsumption}
                  onChange={(e) => handleInputChange("alcoholConsumption", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option value="never">Never</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="sleepHours">Sleep (hours/night)</Label>
                <Input
                  id="sleepHours"
                  value={assessmentData.sleepHours}
                  onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                  type="number"
                  placeholder="e.g. 7"
                />
              </div>
              <div>
                <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                <Input
                  id="stressLevel"
                  value={assessmentData.stressLevel}
                  onChange={(e) => handleInputChange("stressLevel", e.target.value)}
                  type="number"
                  min="1"
                  max="10"
                  placeholder="1-10"
                />
              </div>
              <div>
                <Label htmlFor="waterIntake">Water Intake (glasses/day)</Label>
                <Input
                  id="waterIntake"
                  value={assessmentData.waterIntake}
                  onChange={(e) => handleInputChange("waterIntake", e.target.value)}
                  type="number"
                  placeholder="e.g. 8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={() => setCurrentStep((p) => p + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                AI is analyzing your health data...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Health Assessment
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
