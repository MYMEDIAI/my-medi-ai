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
  Info,
  Printer,
  FileDown,
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

  // Medical Contact Information
  doctorName: string
  hospitalAddress: string
  hospitalPhone: string
  labNumber: string
  medicalShopNumber: string

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
}

interface MealPlan {
  time: string
  meal: string
  foods: string[]
  calories: number
  instructions: string
}

interface ExerciseSchedule {
  time: string
  activity: string
  duration: string
  intensity: string
  instructions: string
}

interface AssessmentResult {
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  riskScore: number
  bmi: {
    value: number
    category: string
    recommendation: string
  }
  vitalsAnalysis: {
    bloodPressure: { status: string; recommendation: string }
    heartRate: { status: string; recommendation: string }
    temperature: { status: string; recommendation: string }
    oxygenSaturation: { status: string; recommendation: string }
    bloodSugar: { status: string; recommendation: string }
  }
  medications: MedicationSchedule[]
  dietPlan: MealPlan[]
  exerciseSchedule: ExerciseSchedule[]
  labTests: Array<{ test: string; urgency: string; instructions: string }>
  followUpSchedule: Array<{ type: string; when: string; instructions: string }>
  emergencyContacts: Array<{ service: string; number: string; when: string }>
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
    doctorName: "",
    hospitalAddress: "",
    hospitalPhone: "",
    labNumber: "",
    medicalShopNumber: "",
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

  const totalSteps = 6
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

  const analyzeVitals = (vitals: VitalsData) => {
    const systolic = Number.parseInt(vitals.bloodPressureSystolic) || 0
    const diastolic = Number.parseInt(vitals.bloodPressureDiastolic) || 0
    const heartRate = Number.parseInt(vitals.heartRate) || 0
    const temp = Number.parseFloat(vitals.temperature) || 0
    const o2Sat = Number.parseInt(vitals.oxygenSaturation) || 0
    const bloodSugar = Number.parseInt(vitals.bloodSugar) || 0

    return {
      bloodPressure: {
        status: systolic > 140 || diastolic > 90 ? "High" : systolic < 90 || diastolic < 60 ? "Low" : "Normal",
        recommendation:
          systolic > 140 || diastolic > 90
            ? "Monitor closely, reduce sodium, take prescribed medications"
            : systolic < 90 || diastolic < 60
              ? "Stay hydrated, avoid sudden position changes"
              : "Maintain current lifestyle",
      },
      heartRate: {
        status: heartRate > 100 ? "High" : heartRate < 60 ? "Low" : "Normal",
        recommendation:
          heartRate > 100
            ? "Reduce caffeine, manage stress, check for underlying conditions"
            : heartRate < 60
              ? "Monitor during activity, consult if symptomatic"
              : "Continue regular exercise",
      },
      temperature: {
        status: temp > 37.5 ? "Fever" : temp < 36 ? "Low" : "Normal",
        recommendation:
          temp > 37.5
            ? "Rest, hydrate, monitor symptoms, seek care if persistent"
            : temp < 36
              ? "Keep warm, monitor for other symptoms"
              : "Normal temperature range",
      },
      oxygenSaturation: {
        status: o2Sat < 95 ? "Low" : "Normal",
        recommendation:
          o2Sat < 95
            ? "Seek immediate medical attention, avoid exertion"
            : "Good oxygen levels, continue normal activities",
      },
      bloodSugar: {
        status: bloodSugar > 140 ? "High" : bloodSugar < 70 ? "Low" : "Normal",
        recommendation:
          bloodSugar > 140
            ? "Monitor diet, take medications as prescribed, check regularly"
            : bloodSugar < 70
              ? "Consume quick-acting carbs, monitor closely"
              : "Maintain current diet and medication routine",
      },
    }
  }

  const generateDetailedAssessment = async (): Promise<AssessmentResult> => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    let riskScore = 20
    const age = Number.parseInt(assessmentData.age) || 0
    const vitalsAnalysis = analyzeVitals(assessmentData.vitals)
    const bmi = calculateBMI(assessmentData.weight, assessmentData.height)

    // Calculate risk based on multiple factors
    if (age > 65) riskScore += 25
    else if (age > 50) riskScore += 15

    const severity = Number.parseInt(assessmentData.symptomSeverity) || 0
    riskScore += severity * 8

    riskScore += assessmentData.chronicConditions.length * 12

    // BMI impact on risk
    if (bmi) {
      if (bmi.value < 18.5 || bmi.value > 30) riskScore += 15
      else if (bmi.value > 25) riskScore += 8
    }

    // Vitals impact on risk
    const systolic = Number.parseInt(assessmentData.vitals.bloodPressureSystolic) || 0
    const heartRate = Number.parseInt(assessmentData.vitals.heartRate) || 0
    const temp = Number.parseFloat(assessmentData.vitals.temperature) || 0
    const o2Sat = Number.parseInt(assessmentData.vitals.oxygenSaturation) || 0

    if (systolic > 160 || systolic < 80) riskScore += 20
    if (heartRate > 120 || heartRate < 50) riskScore += 15
    if (temp > 38.5 || temp < 35.5) riskScore += 25
    if (o2Sat < 92) riskScore += 30

    if (assessmentData.smokingStatus === "current") riskScore += 20
    if (assessmentData.exerciseFrequency === "never") riskScore += 15

    const riskLevel = riskScore > 85 ? "Critical" : riskScore > 70 ? "High" : riskScore > 40 ? "Medium" : "Low"

    // Generate detailed medication schedule
    const medications: MedicationSchedule[] = []

    if (assessmentData.chronicConditions.includes("Diabetes Type 2")) {
      medications.push({
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        timing: ["08:00", "20:00"],
        instructions: "Take with meals to reduce stomach upset. Monitor blood sugar levels.",
        duration: "Ongoing - as prescribed by doctor",
        warning:
          "⚠️ IMPORTANT: This is a general recommendation. Please consult your doctor before taking any medication.",
      })
    }

    if (assessmentData.chronicConditions.includes("Hypertension") || systolic > 140) {
      medications.push({
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "Once daily",
        timing: ["08:00"],
        instructions: "Take at same time daily, preferably in the morning. Monitor blood pressure regularly.",
        duration: "Ongoing - as prescribed by doctor",
        warning:
          "⚠️ IMPORTANT: This is a general recommendation. Please consult your doctor before taking any medication.",
      })
    }

    if (assessmentData.primarySymptom.toLowerCase().includes("pain")) {
      medications.push({
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "Every 6-8 hours as needed",
        timing: ["08:00", "14:00", "20:00"],
        instructions: "Take with food if stomach upset occurs. Do not exceed 4g (8 tablets) in 24 hours.",
        duration: "3-5 days maximum for acute pain",
        warning:
          "⚠️ IMPORTANT: This is a general recommendation. Please consult your doctor before taking any medication.",
      })
    }

    if (
      assessmentData.primarySymptom.toLowerCase().includes("fever") ||
      Number.parseFloat(assessmentData.vitals.temperature) > 37.5
    ) {
      medications.push({
        name: "Paracetamol",
        dosage: "650mg",
        frequency: "Every 6 hours as needed",
        timing: ["06:00", "12:00", "18:00", "00:00"],
        instructions: "Take for fever reduction. Ensure adequate fluid intake. Monitor temperature.",
        duration: "Until fever subsides, maximum 3 days",
        warning:
          "⚠️ IMPORTANT: This is a general recommendation. Please consult your doctor before taking any medication.",
      })
    }

    // Generate detailed diet plan with timings
    const dietPlan: MealPlan[] = [
      {
        time: "07:00",
        meal: "Breakfast",
        foods: assessmentData.chronicConditions.includes("Diabetes Type 2")
          ? ["2 boiled eggs", "1 slice whole grain bread", "1/2 avocado", "Green tea without sugar"]
          : ["Oats upma with vegetables", "1 glass milk", "10 almonds", "1 banana"],
        calories: 350,
        instructions: "Eat within 1 hour of waking. Include protein and fiber for sustained energy.",
      },
      {
        time: "10:00",
        meal: "Mid-Morning Snack",
        foods: ["1 apple", "10 almonds", "1 glass water"],
        calories: 120,
        instructions: "Light snack to maintain energy levels and prevent overeating at lunch.",
      },
      {
        time: "13:00",
        meal: "Lunch",
        foods: assessmentData.chronicConditions.includes("Diabetes Type 2")
          ? ["100g grilled chicken/fish", "1/2 cup brown rice", "Mixed vegetable curry", "1 tsp ghee"]
          : ["2 chapati", "Dal (lentils)", "Vegetable curry", "Curd", "Salad"],
        calories: 450,
        instructions: "Balanced meal with lean protein, complex carbs, and vegetables. Eat slowly.",
      },
      {
        time: "16:00",
        meal: "Afternoon Snack",
        foods: ["Carrot and cucumber sticks", "2 tbsp hummus", "Herbal tea"],
        calories: 100,
        instructions: "Healthy snack to prevent evening hunger and maintain blood sugar levels.",
      },
      {
        time: "19:00",
        meal: "Dinner",
        foods: ["Grilled fish/paneer", "Quinoa/brown rice", "Steamed vegetables", "Green salad"],
        calories: 400,
        instructions: "Light dinner, finish eating 3 hours before bedtime for better digestion.",
      },
      {
        time: "21:00",
        meal: "Evening Snack (if needed)",
        foods: ["1 glass warm milk", "2-3 dates"],
        calories: 80,
        instructions: "Only if hungry. Light and easily digestible. Helps with sleep.",
      },
    ]

    // Generate exercise schedule
    const exerciseSchedule: ExerciseSchedule[] = [
      {
        time: "06:30",
        activity: "Morning Walk/Yoga",
        duration: "30 minutes",
        intensity: "Moderate",
        instructions: "Brisk walk in fresh air or gentle yoga. Start slowly and gradually increase pace.",
      },
      {
        time: "17:00",
        activity: "Strength Training/Bodyweight Exercises",
        duration: "20 minutes",
        intensity: "Light to Moderate",
        instructions: "Push-ups, squats, lunges. Focus on major muscle groups, 2-3 times per week.",
      },
      {
        time: "21:30",
        activity: "Stretching/Meditation",
        duration: "15 minutes",
        intensity: "Light",
        instructions: "Relaxing stretches and deep breathing to improve flexibility and prepare for sleep.",
      },
    ]

    const result: AssessmentResult = {
      riskLevel,
      riskScore: Math.min(riskScore, 100),
      bmi: bmi || {
        value: 0,
        category: "Unable to calculate",
        recommendation: "Please provide valid weight and height",
      },
      vitalsAnalysis,
      medications,
      dietPlan,
      exerciseSchedule,
      labTests: [
        {
          test: "Complete Blood Count (CBC)",
          urgency: riskLevel === "Critical" ? "Within 24 hours" : "Within 1 week",
          instructions: "Fasting not required. Bring ID and any insurance documents.",
        },
        {
          test: "Comprehensive Metabolic Panel",
          urgency: riskLevel === "Critical" ? "Within 24 hours" : "Within 1 week",
          instructions: "Fast for 8-12 hours before test. Only water allowed during fasting.",
        },
        {
          test: "Lipid Panel",
          urgency: "Within 2 weeks",
          instructions: "Fast for 9-12 hours. Avoid alcohol 24 hours prior to test.",
        },
        {
          test: "HbA1c (if diabetic)",
          urgency: assessmentData.chronicConditions.some((c) => c.includes("Diabetes"))
            ? "Within 1 week"
            : "Within 1 month",
          instructions: "No fasting required. Shows average blood sugar over 3 months.",
        },
      ],
      followUpSchedule: [
        {
          type: "Primary Care Physician",
          when:
            riskLevel === "Critical" ? "Within 24 hours" : riskLevel === "High" ? "Within 3 days" : "Within 2 weeks",
          instructions: "Bring this report, medication list, and symptom diary. Discuss all recommendations.",
        },
        {
          type: "Specialist Consultation",
          when: riskLevel === "Critical" ? "Within 48 hours" : "Within 1 month",
          instructions:
            "Based on primary care referral. May include cardiologist, endocrinologist, or other specialists.",
        },
      ],
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
    }

    setIsProcessing(false)
    return result
  }

  const handleSubmit = async () => {
    const result = await generateDetailedAssessment()
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
      doctorName: "",
      hospitalAddress: "",
      hospitalPhone: "",
      labNumber: "",
      medicalShopNumber: "",
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
        .vitals-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 15px; 
            margin-bottom: 20px;
        }
        .vital-item { 
            background: white; 
            border: 1px solid #e5e7eb; 
            padding: 12px; 
            border-radius: 6px;
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
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏥 MYMED.AI</div>
        <h1>COMPREHENSIVE HEALTH ASSESSMENT REPORT</h1>
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
        <h2>MEDICAL CONTACT INFORMATION</h2>
        <table>
            <tr><td><strong>Doctor Name:</strong></td><td>${assessmentData.doctorName || "Not provided"}</td></tr>
            <tr><td><strong>Hospital Address:</strong></td><td>${assessmentData.hospitalAddress || "Not provided"}</td></tr>
            <tr><td><strong>Hospital Phone:</strong></td><td>${assessmentData.hospitalPhone || "Not provided"}</td></tr>
            <tr><td><strong>Lab Number:</strong></td><td>${assessmentData.labNumber || "Not provided"}</td></tr>
            <tr><td><strong>Medical Shop Number:</strong></td><td>${assessmentData.medicalShopNumber || "Not provided"}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">RISK ASSESSMENT</div>
        <div class="risk-alert risk-${assessmentResult.riskLevel.toLowerCase()}">
            <h3>Risk Level: ${assessmentResult.riskLevel}</h3>
            <p><strong>Risk Score:</strong> ${assessmentResult.riskScore}/100</p>
            ${assessmentResult.riskLevel === "Critical" ? "<p><strong>⚠️ CRITICAL: Seek immediate medical attention</strong></p>" : ""}
        </div>
    </div>

    <div class="section">
        <div class="section-title">VITAL SIGNS ANALYSIS</div>
        <table>
            <tr><th>Parameter</th><th>Value</th><th>Status</th><th>Recommendation</th></tr>
            <tr>
                <td>Blood Pressure</td>
                <td>${assessmentData.vitals.bloodPressureSystolic}/${assessmentData.vitals.bloodPressureDiastolic} mmHg</td>
                <td>${assessmentResult.vitalsAnalysis.bloodPressure.status}</td>
                <td>${assessmentResult.vitalsAnalysis.bloodPressure.recommendation}</td>
            </tr>
            <tr>
                <td>Heart Rate</td>
                <td>${assessmentData.vitals.heartRate} bpm</td>
                <td>${assessmentResult.vitalsAnalysis.heartRate.status}</td>
                <td>${assessmentResult.vitalsAnalysis.heartRate.recommendation}</td>
            </tr>
            <tr>
                <td>Temperature</td>
                <td>${assessmentData.vitals.temperature}°C</td>
                <td>${assessmentResult.vitalsAnalysis.temperature.status}</td>
                <td>${assessmentResult.vitalsAnalysis.temperature.recommendation}</td>
            </tr>
            <tr>
                <td>Oxygen Saturation</td>
                <td>${assessmentData.vitals.oxygenSaturation}%</td>
                <td>${assessmentResult.vitalsAnalysis.oxygenSaturation.status}</td>
                <td>${assessmentResult.vitalsAnalysis.oxygenSaturation.recommendation}</td>
            </tr>
            <tr>
                <td>Blood Sugar</td>
                <td>${assessmentData.vitals.bloodSugar} mg/dL</td>
                <td>${assessmentResult.vitalsAnalysis.bloodSugar.status}</td>
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

    <div class="section">
        <div class="section-title">MEDICATION RECOMMENDATIONS</div>
        <div class="warning">
            <strong>⚠️ IMPORTANT DISCLAIMER:</strong> These are AI-generated recommendations based on symptoms and conditions. 
            All medications MUST be confirmed and prescribed by a qualified medical practitioner before use.
        </div>
        ${assessmentResult.medications
          .map(
            (med) => `
            <div class="medication-item">
                <h4>${med.name} - ${med.dosage}</h4>
                <p><strong>Frequency:</strong> ${med.frequency}</p>
                <p><strong>Timing:</strong> ${med.timing.join(", ")}</p>
                <p><strong>Instructions:</strong> ${med.instructions}</p>
                <p><strong>Duration:</strong> ${med.duration}</p>
            </div>
        `,
          )
          .join("")}
    </div>

    <div class="section">
        <div class="section-title">RECOMMENDED LAB TESTS</div>
        <table>
            <tr><th>Test</th><th>Urgency</th><th>Instructions</th></tr>
            ${assessmentResult.labTests
              .map(
                (test) => `
                <tr>
                    <td>${test.test}</td>
                    <td>${test.urgency}</td>
                    <td>${test.instructions}</td>
                </tr>
            `,
              )
              .join("")}
        </table>
    </div>

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
        <p>This report is generated by MYMED.AI for informational purposes only.</p>
        <p>All recommendations must be confirmed by qualified medical practitioners.</p>
        <p>Free healthcare service provided by MYMED.AI startup for India.</p>
        <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
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
                <span>Health Assessment Report - {assessmentData.name}</span>
                <Badge className="bg-green-100 text-green-800">Free Service</Badge>
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
                <p className="text-sm text-gray-600 mt-2">Overall Risk Level</p>
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

        {/* Free Service Notice */}
        <Alert className="border-green-200 bg-green-50">
          <Info className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Free Service:</strong> This comprehensive health assessment is provided free by MYMED.AI startup.
            This service is designed for health awareness in India. All medication recommendations must be confirmed by
            your medical practitioner.
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

        <Tabs defaultValue="bmi" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bmi">BMI & Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="bmi" className="space-y-4">
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
                  <CardContent>
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
                <strong>IMPORTANT:</strong> These are general medication recommendations based on your symptoms. Please
                consult with a qualified medical practitioner before taking any medication. Do not self-medicate based
                on this assessment alone.
              </AlertDescription>
            </Alert>

            {assessmentResult.medications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessmentResult.medications.map((med, index) => (
                  <Card key={index} className="border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-blue-700">
                        <Pill className="w-5 h-5" />
                        <span>
                          {med.name} - {med.dosage}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                    No specific medications recommended at this time. Consult your healthcare provider for personalized
                    medication advice.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
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
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">{meal.instructions}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">{exercise.instructions}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="followup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lab Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-700">
                    <FileText className="w-5 h-5" />
                    <span>Recommended Lab Tests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentResult.labTests.map((test, index) => (
                    <div key={index} className="border border-purple-200 p-3 rounded-lg">
                      <h4 className="font-medium">{test.test}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{test.urgency}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{test.instructions}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

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
            <p className="font-medium">Free AI-Powered Health Assessment Service</p>
            <p>This comprehensive assessment is provided free by MYMED.AI startup for health awareness in India.</p>
            <p>All medication recommendations must be confirmed by a qualified medical practitioner.</p>
            <p>Data is processed locally and not stored on our servers.</p>
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

      {/* Step 2: Medical Contact Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Medical Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                value={assessmentData.doctorName}
                onChange={(e) => handleInputChange("doctorName", e.target.value)}
                placeholder="Enter your doctor's name"
              />
            </div>
            <div>
              <Label htmlFor="hospitalAddress">Hospital Address</Label>
              <Textarea
                id="hospitalAddress"
                value={assessmentData.hospitalAddress}
                onChange={(e) => handleInputChange("hospitalAddress", e.target.value)}
                placeholder="Enter hospital address"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hospitalPhone">Hospital Phone</Label>
                <Input
                  id="hospitalPhone"
                  value={assessmentData.hospitalPhone}
                  onChange={(e) => handleInputChange("hospitalPhone", e.target.value)}
                  placeholder="Hospital phone number"
                />
              </div>
              <div>
                <Label htmlFor="labNumber">Lab Number</Label>
                <Input
                  id="labNumber"
                  value={assessmentData.labNumber}
                  onChange={(e) => handleInputChange("labNumber", e.target.value)}
                  placeholder="Lab contact number"
                />
              </div>
              <div>
                <Label htmlFor="medicalShopNumber">Medical Shop Number</Label>
                <Input
                  id="medicalShopNumber"
                  value={assessmentData.medicalShopNumber}
                  onChange={(e) => handleInputChange("medicalShopNumber", e.target.value)}
                  placeholder="Medical shop number"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Vital Signs */}
      {currentStep === 3 && (
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

      {/* Step 4: Current Symptoms */}
      {currentStep === 4 && (
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

      {/* Step 5: Medical History */}
      {currentStep === 5 && (
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

      {/* Step 6: Lifestyle */}
      {currentStep === 6 && (
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
            {isProcessing ? "Processing Assessment..." : "Generate Comprehensive Report"}
          </Button>
        )}
      </div>
    </div>
  )
}
