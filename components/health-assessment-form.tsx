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
import {
  User,
  Heart,
  Activity,
  AlertTriangle,
  FileText,
  Thermometer,
  ArrowLeft,
  Download,
  Clock,
  MapPin,
  Utensils,
  Pill,
  Dumbbell,
  Hospital,
  TestTube,
  ShoppingCart,
  Calendar,
  Timer,
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
  age: string
  weight: string // in kg
  height: string
  gender: string
  location: string

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

interface NearbyServices {
  hospitals: Array<{ name: string; address: string; distance: string; phone: string }>
  labs: Array<{ name: string; address: string; distance: string; phone: string }>
  pharmacies: Array<{ name: string; address: string; distance: string; phone: string }>
}

interface AssessmentResult {
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  riskScore: number
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
  nearbyServices: NearbyServices
  labTests: Array<{ test: string; urgency: string; instructions: string }>
  followUpSchedule: Array<{ type: string; when: string; instructions: string }>
  emergencyContacts: Array<{ service: string; number: string; when: string }>
}

export default function HealthAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    age: "",
    weight: "",
    height: "",
    gender: "",
    location: "",
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

    // Calculate risk based on multiple factors
    if (age > 65) riskScore += 25
    else if (age > 50) riskScore += 15

    const severity = Number.parseInt(assessmentData.symptomSeverity) || 0
    riskScore += severity * 8

    riskScore += assessmentData.chronicConditions.length * 12

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
        instructions: "Take with meals to reduce stomach upset",
        duration: "Ongoing - as prescribed by doctor",
      })
    }

    if (assessmentData.chronicConditions.includes("Hypertension") || systolic > 140) {
      medications.push({
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        timing: ["08:00"],
        instructions: "Take at same time daily, monitor blood pressure",
        duration: "Ongoing - as prescribed by doctor",
      })
    }

    if (assessmentData.primarySymptom.toLowerCase().includes("pain")) {
      medications.push({
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "Every 6-8 hours as needed",
        timing: ["08:00", "14:00", "20:00"],
        instructions: "Take with food, do not exceed 1200mg daily",
        duration: "3-5 days maximum",
      })
    }

    // Generate detailed diet plan with timings
    const dietPlan: MealPlan[] = [
      {
        time: "07:00",
        meal: "Breakfast",
        foods: assessmentData.chronicConditions.includes("Diabetes Type 2")
          ? ["2 boiled eggs", "1 slice whole grain toast", "1/2 avocado", "Green tea"]
          : ["Oatmeal with berries", "Greek yogurt", "Almonds", "Coffee"],
        calories: 350,
        instructions: "Eat within 1 hour of waking. Include protein and fiber.",
      },
      {
        time: "10:00",
        meal: "Mid-Morning Snack",
        foods: ["Apple slices", "10 almonds", "Water"],
        calories: 120,
        instructions: "Light snack to maintain energy levels",
      },
      {
        time: "13:00",
        meal: "Lunch",
        foods: assessmentData.chronicConditions.includes("Diabetes Type 2")
          ? ["Grilled chicken breast (100g)", "Quinoa (1/2 cup)", "Steamed broccoli", "Olive oil (1 tsp)"]
          : ["Salmon fillet", "Brown rice", "Mixed vegetables", "Lemon dressing"],
        calories: 450,
        instructions: "Balanced meal with lean protein, complex carbs, and vegetables",
      },
      {
        time: "16:00",
        meal: "Afternoon Snack",
        foods: ["Carrot sticks", "Hummus (2 tbsp)", "Herbal tea"],
        calories: 100,
        instructions: "Healthy snack to prevent evening overeating",
      },
      {
        time: "19:00",
        meal: "Dinner",
        foods: ["Grilled fish", "Sweet potato", "Green salad", "Olive oil dressing"],
        calories: 400,
        instructions: "Light dinner, finish eating 3 hours before bedtime",
      },
      {
        time: "21:00",
        meal: "Evening Snack (if needed)",
        foods: ["Greek yogurt", "Berries"],
        calories: 80,
        instructions: "Only if hungry, keep it light and protein-rich",
      },
    ]

    // Generate exercise schedule
    const exerciseSchedule: ExerciseSchedule[] = [
      {
        time: "06:30",
        activity: "Morning Walk",
        duration: "30 minutes",
        intensity: "Moderate",
        instructions: "Brisk walk in fresh air, maintain steady pace",
      },
      {
        time: "17:00",
        activity: "Strength Training",
        duration: "20 minutes",
        intensity: "Light to Moderate",
        instructions: "Focus on major muscle groups, 2-3 times per week",
      },
      {
        time: "21:30",
        activity: "Stretching/Yoga",
        duration: "15 minutes",
        intensity: "Light",
        instructions: "Relaxing stretches to improve flexibility and sleep",
      },
    ]

    // Generate nearby services (mock data based on location)
    const nearbyServices: NearbyServices = {
      hospitals: [
        {
          name: "City General Hospital",
          address: "123 Main St, " + (assessmentData.location || "Your City"),
          distance: "2.3 km",
          phone: "+1-555-0123",
        },
        {
          name: "Regional Medical Center",
          address: "456 Health Ave, " + (assessmentData.location || "Your City"),
          distance: "4.1 km",
          phone: "+1-555-0456",
        },
      ],
      labs: [
        {
          name: "QuickLab Diagnostics",
          address: "789 Test St, " + (assessmentData.location || "Your City"),
          distance: "1.8 km",
          phone: "+1-555-0789",
        },
        {
          name: "MedTest Laboratory",
          address: "321 Lab Rd, " + (assessmentData.location || "Your City"),
          distance: "3.2 km",
          phone: "+1-555-0321",
        },
      ],
      pharmacies: [
        {
          name: "HealthPlus Pharmacy",
          address: "654 Pill St, " + (assessmentData.location || "Your City"),
          distance: "0.9 km",
          phone: "+1-555-0654",
        },
        {
          name: "MediCare Drugstore",
          address: "987 Medicine Ave, " + (assessmentData.location || "Your City"),
          distance: "1.5 km",
          phone: "+1-555-0987",
        },
      ],
    }

    const result: AssessmentResult = {
      riskLevel,
      riskScore: Math.min(riskScore, 100),
      vitalsAnalysis,
      medications,
      dietPlan,
      exerciseSchedule,
      nearbyServices,
      labTests: [
        {
          test: "Complete Blood Count (CBC)",
          urgency: riskLevel === "Critical" ? "Within 24 hours" : "Within 1 week",
          instructions: "Fasting not required, bring ID and insurance card",
        },
        {
          test: "Comprehensive Metabolic Panel",
          urgency: riskLevel === "Critical" ? "Within 24 hours" : "Within 1 week",
          instructions: "Fast for 8-12 hours before test",
        },
        {
          test: "Lipid Panel",
          urgency: "Within 2 weeks",
          instructions: "Fast for 9-12 hours, avoid alcohol 24 hours prior",
        },
      ],
      followUpSchedule: [
        {
          type: "Primary Care Physician",
          when:
            riskLevel === "Critical" ? "Within 24 hours" : riskLevel === "High" ? "Within 3 days" : "Within 2 weeks",
          instructions: "Bring medication list, symptom diary, and test results",
        },
        {
          type: "Specialist Consultation",
          when: riskLevel === "Critical" ? "Within 48 hours" : "Within 1 month",
          instructions: "Based on primary care referral and specific conditions",
        },
      ],
      emergencyContacts: [
        {
          service: "Emergency Services",
          number: "911",
          when: "Severe chest pain, difficulty breathing, loss of consciousness",
        },
        {
          service: "Poison Control",
          number: "1-800-222-1222",
          when: "Accidental overdose or poisoning",
        },
        {
          service: "Mental Health Crisis",
          number: "988",
          when: "Suicidal thoughts or severe mental health crisis",
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

  const exportDetailedReport = () => {
    if (!assessmentResult) return

    const reportContent = `
MYMED.AI COMPREHENSIVE HEALTH ASSESSMENT REPORT
Generated: ${new Date().toLocaleString()}
Patient Location: ${assessmentData.location}

=== PATIENT INFORMATION ===
Age: ${assessmentData.age} years
Weight: ${assessmentData.weight} kg
Height: ${assessmentData.height}
Gender: ${assessmentData.gender}

=== VITAL SIGNS ANALYSIS ===
Blood Pressure: ${assessmentData.vitals.bloodPressureSystolic}/${assessmentData.vitals.bloodPressureDiastolic} mmHg
Status: ${assessmentResult.vitalsAnalysis.bloodPressure.status}
Recommendation: ${assessmentResult.vitalsAnalysis.bloodPressure.recommendation}

Heart Rate: ${assessmentData.vitals.heartRate} bpm
Status: ${assessmentResult.vitalsAnalysis.heartRate.status}
Recommendation: ${assessmentResult.vitalsAnalysis.heartRate.recommendation}

Temperature: ${assessmentData.vitals.temperature}°C
Status: ${assessmentResult.vitalsAnalysis.temperature.status}
Recommendation: ${assessmentResult.vitalsAnalysis.temperature.recommendation}

Oxygen Saturation: ${assessmentData.vitals.oxygenSaturation}%
Status: ${assessmentResult.vitalsAnalysis.oxygenSaturation.status}
Recommendation: ${assessmentResult.vitalsAnalysis.oxygenSaturation.recommendation}

Blood Sugar: ${assessmentData.vitals.bloodSugar} mg/dL
Status: ${assessmentResult.vitalsAnalysis.bloodSugar.status}
Recommendation: ${assessmentResult.vitalsAnalysis.bloodSugar.recommendation}

=== RISK ASSESSMENT ===
Risk Level: ${assessmentResult.riskLevel}
Risk Score: ${assessmentResult.riskScore}/100

=== MEDICATION SCHEDULE ===
${assessmentResult.medications
  .map(
    (med) => `
${med.name} - ${med.dosage}
Frequency: ${med.frequency}
Timing: ${med.timing.join(", ")}
Instructions: ${med.instructions}
Duration: ${med.duration}
`,
  )
  .join("\n")}

=== DETAILED DIET PLAN ===
${assessmentResult.dietPlan
  .map(
    (meal) => `
${meal.time} - ${meal.meal} (${meal.calories} calories)
Foods: ${meal.foods.join(", ")}
Instructions: ${meal.instructions}
`,
  )
  .join("\n")}

=== EXERCISE SCHEDULE ===
${assessmentResult.exerciseSchedule
  .map(
    (exercise) => `
${exercise.time} - ${exercise.activity}
Duration: ${exercise.duration}
Intensity: ${exercise.intensity}
Instructions: ${exercise.instructions}
`,
  )
  .join("\n")}

=== NEARBY HEALTHCARE SERVICES ===

HOSPITALS:
${assessmentResult.nearbyServices.hospitals
  .map(
    (hospital) => `
${hospital.name}
Address: ${hospital.address}
Distance: ${hospital.distance}
Phone: ${hospital.phone}
`,
  )
  .join("\n")}

LABORATORIES:
${assessmentResult.nearbyServices.labs
  .map(
    (lab) => `
${lab.name}
Address: ${lab.address}
Distance: ${lab.distance}
Phone: ${lab.phone}
`,
  )
  .join("\n")}

PHARMACIES:
${assessmentResult.nearbyServices.pharmacies
  .map(
    (pharmacy) => `
${pharmacy.name}
Address: ${pharmacy.address}
Distance: ${pharmacy.distance}
Phone: ${pharmacy.phone}
`,
  )
  .join("\n")}

=== RECOMMENDED LAB TESTS ===
${assessmentResult.labTests
  .map(
    (test) => `
${test.test}
Urgency: ${test.urgency}
Instructions: ${test.instructions}
`,
  )
  .join("\n")}

=== FOLLOW-UP SCHEDULE ===
${assessmentResult.followUpSchedule
  .map(
    (followUp) => `
${followUp.type}: ${followUp.when}
Instructions: ${followUp.instructions}
`,
  )
  .join("\n")}

=== EMERGENCY CONTACTS ===
${assessmentResult.emergencyContacts
  .map(
    (contact) => `
${contact.service}: ${contact.number}
When to call: ${contact.when}
`,
  )
  .join("\n")}

IMPORTANT DISCLAIMER:
This assessment is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

Report generated by MYMED.AI - Your AI Healthcare Assistant
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mymed-detailed-health-assessment-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
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

  if (assessmentResult) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Results Header */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MyMedLogo size="sm" showText={false} />
                <span>Comprehensive Health Assessment Results</span>
              </div>
              <Button onClick={exportDetailedReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Detailed Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="text-3xl font-bold text-purple-600">{new Date().toLocaleDateString()}</div>
                <p className="text-sm text-gray-600">Assessment Date</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{assessmentData.location}</div>
                <p className="text-sm text-gray-600">Location</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alert */}
        {assessmentResult.riskLevel === "Critical" && (
          <Alert className="border-red-600 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>CRITICAL RISK DETECTED:</strong> Seek immediate medical attention. Contact emergency services if
              experiencing severe symptoms.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="vitals">Vitals Analysis</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="services">Nearby Services</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-4">
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
            {assessmentResult.medications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessmentResult.medications.map((med, index) => (
                  <Card key={index}>
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

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hospitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <Hospital className="w-5 h-5" />
                    <span>Nearby Hospitals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentResult.nearbyServices.hospitals.map((hospital, index) => (
                    <div key={index} className="border-l-4 border-red-200 pl-4">
                      <h4 className="font-medium">{hospital.name}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{hospital.address}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-blue-600">{hospital.distance}</span>
                        <span className="text-green-600">{hospital.phone}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Labs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-700">
                    <TestTube className="w-5 h-5" />
                    <span>Nearby Labs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentResult.nearbyServices.labs.map((lab, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <h4 className="font-medium">{lab.name}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{lab.address}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-blue-600">{lab.distance}</span>
                        <span className="text-green-600">{lab.phone}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pharmacies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-700">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Nearby Pharmacies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessmentResult.nearbyServices.pharmacies.map((pharmacy, index) => (
                    <div key={index} className="border-l-4 border-green-200 pl-4">
                      <h4 className="font-medium">{pharmacy.name}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{pharmacy.address}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-blue-600">{pharmacy.distance}</span>
                        <span className="text-green-600">{pharmacy.phone}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="followup" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lab Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-purple-700">
                    <TestTube className="w-5 h-5" />
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
                    <Calendar className="w-5 h-5" />
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
                  <span>Emergency Contacts</span>
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

        <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <MyMedLogo size="sm" className="mx-auto mb-2" />
          <p>
            This comprehensive assessment is for informational purposes only and does not replace professional medical
            advice.
          </p>
          <p className="mt-1">Data is processed locally and not stored on our servers.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
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
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  value={assessmentData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="e.g. 175 cm or 5'9&quot;"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location (City, State/Country) *</Label>
              <Input
                id="location"
                value={assessmentData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g. New York, NY or London, UK"
              />
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
            {isProcessing ? "Processing Assessment..." : "Generate Comprehensive Report"}
          </Button>
        )}
      </div>
    </div>
  )
}
