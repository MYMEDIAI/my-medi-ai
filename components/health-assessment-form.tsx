"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import MyMedLogo from "./mymed-logo"
import {
  User,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Brain,
  Pill,
  UserCheck,
  FlaskConical,
  Apple,
  Dumbbell,
  Lightbulb,
  Download,
  Printer,
  Shield,
  Award,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  Calendar,
  Phone,
  MapPin,
  Zap,
  HeartHandshake,
  BookOpen,
  AlertTriangle,
} from "lucide-react"

interface HealthAssessmentData {
  // Personal Information
  name: string
  age: number
  gender: string
  height: number
  weight: number

  // Current Health Concern
  primaryConcern: string
  symptomDescription: string
  symptomDuration: string
  symptomSeverity: string
  painLocation: string[]

  // Medical History
  chronicConditions: string[]
  currentMedications: string[]
  allergies: string[]
  surgicalHistory: string
  familyHistory: string[]

  // Vital Signs (Optional)
  bloodPressure: string
  heartRate: number
  temperature: number
  oxygenSaturation: number

  // Lifestyle
  smokingStatus: string
  alcoholConsumption: string
  exerciseFrequency: string
  sleepHours: number
  stressLevel: string

  // Additional Information
  additionalSymptoms: string[]
  additionalNotes: string
}

interface AssessmentResults {
  riskLevel: "low" | "moderate" | "high"
  overallScore: number
  medications: {
    recommended: string[]
    precautions: string[]
    interactions: string[]
  }
  doctors: {
    primaryCare: string
    specialists: string[]
    urgency: string
    bookingTips: string[]
  }
  labTests: {
    immediate: string[]
    routine: string[]
    followUp: string[]
    preparation: string[]
  }
  pharmacy: {
    nearbyOptions: string[]
    onlineServices: string[]
    costSaving: string[]
    prescriptionTips: string[]
  }
  dietPlan: {
    recommendations: string[]
    restrictions: string[]
    supplements: string[]
    hydration: string
  }
  exercise: {
    recommended: string[]
    restrictions: string[]
    frequency: string
    duration: string
  }
  lifestyle: {
    sleepTips: string[]
    stressManagement: string[]
    habits: string[]
    monitoring: string[]
  }
  followUp: {
    timeline: string
    redFlags: string[]
    emergencyContacts: string[]
    nextSteps: string[]
  }
}

export default function HealthAssessmentForm() {
  const [formData, setFormData] = useState<HealthAssessmentData>({
    // Personal Information
    name: "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,

    // Current Health Concern
    primaryConcern: "",
    symptomDescription: "",
    symptomDuration: "",
    symptomSeverity: "",
    painLocation: [],

    // Medical History
    chronicConditions: [],
    currentMedications: [],
    allergies: [],
    surgicalHistory: "",
    familyHistory: [],

    // Vital Signs (Optional)
    bloodPressure: "",
    heartRate: 0,
    temperature: 0,
    oxygenSaturation: 0,

    // Lifestyle
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
    sleepHours: 0,
    stressLevel: "",

    // Additional Information
    additionalSymptoms: [],
    additionalNotes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<AssessmentResults | null>(null)

  const chronicConditionsList = [
    "Diabetes Type 1",
    "Diabetes Type 2",
    "High Blood Pressure",
    "High Cholesterol",
    "Heart Disease",
    "Asthma",
    "COPD",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Thyroid Disease",
    "Kidney Disease",
    "Liver Disease",
    "Cancer",
    "None",
  ]

  const commonAllergies = [
    "Penicillin",
    "Sulfa drugs",
    "Aspirin",
    "Ibuprofen",
    "Codeine",
    "Latex",
    "Peanuts",
    "Shellfish",
    "Eggs",
    "Milk",
    "None",
  ]

  const familyHistoryConditions = [
    "Heart Disease",
    "Diabetes",
    "Cancer",
    "High Blood Pressure",
    "Stroke",
    "Mental Health Issues",
    "Kidney Disease",
    "Liver Disease",
    "Autoimmune Disorders",
    "None",
  ]

  const painLocationOptions = [
    "Head/Headache",
    "Neck",
    "Chest",
    "Back",
    "Abdomen",
    "Arms",
    "Legs",
    "Joints",
    "Muscles",
    "Other",
  ]

  const additionalSymptomsList = [
    "Fever",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Dizziness",
    "Shortness of breath",
    "Chest pain",
    "Headache",
    "Muscle aches",
    "Joint pain",
    "Skin rash",
    "Sleep problems",
    "Appetite changes",
    "Weight changes",
    "Mood changes",
  ]

  const generateMockResults = (): AssessmentResults => {
    const severityScore = Number.parseInt(formData.symptomSeverity) || 5
    const ageRisk = formData.age > 65 ? 2 : formData.age > 45 ? 1 : 0
    const chronicRisk = formData.chronicConditions.filter((c) => c !== "None").length

    const totalRisk = severityScore + ageRisk + chronicRisk
    const riskLevel: "low" | "moderate" | "high" = totalRisk <= 5 ? "low" : totalRisk <= 8 ? "moderate" : "high"
    const overallScore = Math.max(10, Math.min(100, 100 - totalRisk * 8))

    return {
      riskLevel,
      overallScore,
      medications: {
        recommended: [
          "Acetaminophen (Tylenol) 500mg every 6-8 hours for pain relief",
          "Ibuprofen (Advil) 200-400mg every 6-8 hours for inflammation",
          "Multivitamin daily to support overall health",
          "Omega-3 supplements (1000mg daily) for heart health",
        ],
        precautions: [
          "Do not exceed recommended dosages",
          "Take with food to prevent stomach irritation",
          "Avoid alcohol while taking pain medications",
          "Check with pharmacist for drug interactions",
        ],
        interactions: [
          "Blood thinners may interact with NSAIDs",
          "Some supplements may affect prescription medications",
          "Always inform healthcare providers of all medications",
        ],
      },
      doctors: {
        primaryCare: "Schedule appointment with your primary care physician within 1-2 weeks",
        specialists: [
          "Cardiologist - if experiencing chest pain or heart-related symptoms",
          "Neurologist - for persistent headaches or neurological symptoms",
          "Rheumatologist - for joint pain and inflammatory conditions",
          "Endocrinologist - for diabetes or thyroid-related concerns",
        ],
        urgency:
          riskLevel === "high"
            ? "Urgent - within 24-48 hours"
            : riskLevel === "moderate"
              ? "Soon - within 1 week"
              : "Routine - within 2-4 weeks",
        bookingTips: [
          "Call early in the morning for same-day appointments",
          "Ask to be put on cancellation list for earlier slots",
          "Prepare list of symptoms and questions beforehand",
          "Bring all current medications and medical records",
        ],
      },
      labTests: {
        immediate: [
          "Complete Blood Count (CBC) to check for infections or anemia",
          "Basic Metabolic Panel (BMP) for kidney and electrolyte function",
          "C-Reactive Protein (CRP) to assess inflammation levels",
        ],
        routine: [
          "Lipid Panel for cholesterol levels",
          "Hemoglobin A1C for diabetes screening",
          "Thyroid Function Tests (TSH, T3, T4)",
          "Vitamin D and B12 levels",
        ],
        followUp: [
          "Repeat tests in 3-6 months to monitor progress",
          "Specialized tests based on initial results",
          "Regular monitoring for chronic conditions",
        ],
        preparation: [
          "Fast for 8-12 hours before lipid panel",
          "Stay hydrated before blood draw",
          "Bring insurance card and ID",
          "List all medications you're taking",
        ],
      },
      pharmacy: {
        nearbyOptions: [
          "CVS Pharmacy - Full service with minute clinic",
          "Walgreens - 24/7 locations available",
          "Local independent pharmacies for personalized service",
          "Hospital pharmacies for specialized medications",
        ],
        onlineServices: [
          "GoodRx for prescription discounts and price comparison",
          "Amazon Pharmacy for home delivery",
          "CVS online refills and delivery service",
          "Walgreens app for easy prescription management",
        ],
        costSaving: [
          "Generic medications cost 80-85% less than brand names",
          "90-day supplies often cost less per dose",
          "Pharmacy discount programs and membership benefits",
          "Patient assistance programs for expensive medications",
        ],
        prescriptionTips: [
          "Set up automatic refills for chronic medications",
          "Use pill organizers to track daily medications",
          "Keep updated medication list in wallet",
          "Review medications annually with pharmacist",
        ],
      },
      dietPlan: {
        recommendations: [
          "Mediterranean diet rich in fruits, vegetables, and healthy fats",
          "Lean proteins: fish, chicken, legumes, and plant-based options",
          "Whole grains: quinoa, brown rice, oats, and whole wheat products",
          "Anti-inflammatory foods: berries, leafy greens, nuts, and seeds",
          "Limit processed foods, added sugars, and excessive sodium",
        ],
        restrictions: [
          "Reduce saturated fats and trans fats",
          "Limit alcohol consumption to moderate levels",
          "Avoid foods you're allergic to",
          "Reduce caffeine if experiencing anxiety or sleep issues",
        ],
        supplements: [
          "Vitamin D3 (2000 IU daily) especially in winter months",
          "Magnesium (200-400mg) for muscle and nerve function",
          "Probiotics for digestive health",
          "B-Complex vitamins for energy metabolism",
        ],
        hydration: "Aim for 8-10 glasses of water daily, more if active or in hot weather",
      },
      exercise: {
        recommended: [
          "30 minutes of moderate aerobic activity 5 days per week",
          "Strength training exercises 2-3 times per week",
          "Flexibility and stretching exercises daily",
          "Low-impact activities: walking, swimming, cycling",
        ],
        restrictions: [
          "Avoid high-intensity exercise if experiencing chest pain",
          "Stop exercise if you feel dizzy or short of breath",
          "Modify activities based on joint pain or mobility issues",
          "Consult doctor before starting new exercise program",
        ],
        frequency: "5-6 days per week with at least one rest day",
        duration: "Start with 15-20 minutes and gradually increase to 30-45 minutes",
      },
      lifestyle: {
        sleepTips: [
          "Maintain consistent sleep schedule (7-9 hours nightly)",
          "Create relaxing bedtime routine",
          "Keep bedroom cool, dark, and quiet",
          "Avoid screens 1 hour before bedtime",
          "Limit caffeine after 2 PM",
        ],
        stressManagement: [
          "Practice deep breathing exercises daily",
          "Try meditation or mindfulness apps",
          "Regular physical activity reduces stress",
          "Connect with friends and family regularly",
          "Consider counseling if stress is overwhelming",
        ],
        habits: [
          "Quit smoking - resources available through quitlines",
          "Limit alcohol to recommended guidelines",
          "Practice good hygiene and handwashing",
          "Regular dental checkups every 6 months",
        ],
        monitoring: [
          "Track symptoms in a daily journal",
          "Monitor blood pressure if hypertensive",
          "Regular weight checks if managing weight",
          "Blood sugar monitoring if diabetic",
        ],
      },
      followUp: {
        timeline: "Follow up in 1-2 weeks or sooner if symptoms worsen",
        redFlags: [
          "Severe chest pain or difficulty breathing",
          "Sudden severe headache or vision changes",
          "High fever (over 103°F) or persistent fever",
          "Severe abdominal pain or vomiting",
          "Signs of allergic reaction or medication side effects",
        ],
        emergencyContacts: [
          "911 for life-threatening emergencies",
          "Poison Control: 1-800-222-1222",
          "Your doctor's after-hours line",
          "Nearest emergency room or urgent care",
        ],
        nextSteps: [
          "Schedule follow-up appointment with primary care physician",
          "Complete recommended laboratory tests",
          "Start implementing lifestyle recommendations",
          "Monitor symptoms and track progress",
        ],
      },
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockResults = generateMockResults()
    setResults(mockResults)
    setIsSubmitting(false)
  }

  const handleCheckboxChange = (
    field: keyof Pick<
      HealthAssessmentData,
      "chronicConditions" | "currentMedications" | "allergies" | "familyHistory" | "painLocation" | "additionalSymptoms"
    >,
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  const resetAssessment = () => {
    setResults(null)
    setFormData({
      name: "",
      age: 0,
      gender: "",
      height: 0,
      weight: 0,
      primaryConcern: "",
      symptomDescription: "",
      symptomDuration: "",
      symptomSeverity: "",
      painLocation: [],
      chronicConditions: [],
      currentMedications: [],
      allergies: [],
      surgicalHistory: "",
      familyHistory: [],
      bloodPressure: "",
      heartRate: 0,
      temperature: 0,
      oxygenSaturation: 0,
      smokingStatus: "",
      alcoholConsumption: "",
      exerciseFrequency: "",
      sleepHours: 0,
      stressLevel: "",
      additionalSymptoms: [],
      additionalNotes: "",
    })
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Health Assessment Results</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin: -30px -30px 30px -30px;
            padding: 30px;
            border-radius: 15px 15px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          .risk-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            margin: 10px 0;
          }
          .risk-low { background: #d4edda; color: #155724; }
          .risk-moderate { background: #fff3cd; color: #856404; }
          .risk-high { background: #f8d7da; color: #721c24; }
          .section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .section h3 { 
            color: #667eea; 
            border-bottom: 2px solid #e0e7ff; 
            padding-bottom: 8px; 
            margin-top: 0;
            font-size: 1.3em;
          }
          .score-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            font-weight: bold;
            margin: 0 auto 20px;
          }
          ul { 
            margin: 8px 0; 
            padding-left: 20px; 
          }
          li {
            margin-bottom: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9em;
            color: #666;
          }
          @media print { 
            body { margin: 0; background: white !important; } 
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 MyMedi.ai Health Assessment</h1>
            <p>Comprehensive AI-Powered Health Analysis</p>
            <p>Patient: ${formData.name} | Age: ${formData.age} | Generated: ${new Date().toLocaleDateString()}</p>
            <div class="risk-badge risk-${results?.riskLevel}">
              Risk Level: ${results?.riskLevel?.toUpperCase()}
            </div>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <div class="score-circle">${results?.overallScore}/100</div>
            <p><strong>Overall Health Score</strong></p>
          </div>

          <div class="section">
            <h3>💊 Medication Recommendations</h3>
            <h4>Recommended:</h4>
            <ul>
              ${results?.medications.recommended.map((med) => `<li>${med}</li>`).join("")}
            </ul>
            <h4>Precautions:</h4>
            <ul>
              ${results?.medications.precautions.map((prec) => `<li>${prec}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>👨‍⚕️ Healthcare Provider Recommendations</h3>
            <p><strong>Primary Care:</strong> ${results?.doctors.primaryCare}</p>
            <p><strong>Urgency:</strong> ${results?.doctors.urgency}</p>
            <h4>Specialists to Consider:</h4>
            <ul>
              ${results?.doctors.specialists.map((spec) => `<li>${spec}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>🔬 Laboratory Tests</h3>
            <h4>Immediate Tests:</h4>
            <ul>
              ${results?.labTests.immediate.map((test) => `<li>${test}</li>`).join("")}
            </ul>
            <h4>Routine Tests:</h4>
            <ul>
              ${results?.labTests.routine.map((test) => `<li>${test}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>🥗 Personalized Diet Plan</h3>
            <h4>Recommendations:</h4>
            <ul>
              ${results?.dietPlan.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
            <p><strong>Hydration:</strong> ${results?.dietPlan.hydration}</p>
          </div>

          <div class="section">
            <h3>🏃‍♂️ Exercise Recommendations</h3>
            <p><strong>Frequency:</strong> ${results?.exercise.frequency}</p>
            <p><strong>Duration:</strong> ${results?.exercise.duration}</p>
            <h4>Recommended Activities:</h4>
            <ul>
              ${results?.exercise.recommended.map((ex) => `<li>${ex}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <h3>🚨 Follow-up & Red Flags</h3>
            <p><strong>Timeline:</strong> ${results?.followUp.timeline}</p>
            <h4>Seek Immediate Care If:</h4>
            <ul>
              ${results?.followUp.redFlags.map((flag) => `<li>${flag}</li>`).join("")}
            </ul>
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This AI-generated assessment is for educational purposes only and does not replace professional medical advice.</p>
            <p><em>Always consult with qualified healthcare providers for medical decisions.</em></p>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownloadPDF = () => {
    const content = `
MyMedi.ai - Comprehensive Health Assessment Results
Generated on: ${new Date().toLocaleDateString()}

PATIENT INFORMATION:
Name: ${formData.name}
Age: ${formData.age} years
Gender: ${formData.gender}
Primary Concern: ${formData.primaryConcern}
Overall Health Score: ${results?.overallScore}/100
Risk Level: ${results?.riskLevel?.toUpperCase()}

MEDICATION RECOMMENDATIONS:
${results?.medications.recommended.map((med) => `• ${med}`).join("\n")}

Precautions:
${results?.medications.precautions.map((prec) => `• ${prec}`).join("\n")}

HEALTHCARE PROVIDERS:
Primary Care: ${results?.doctors.primaryCare}
Urgency: ${results?.doctors.urgency}

Specialists:
${results?.doctors.specialists.map((spec) => `• ${spec}`).join("\n")}

LABORATORY TESTS:
Immediate Tests:
${results?.labTests.immediate.map((test) => `• ${test}`).join("\n")}

Routine Tests:
${results?.labTests.routine.map((test) => `• ${test}`).join("\n")}

PERSONALIZED DIET PLAN:
${results?.dietPlan.recommendations.map((rec) => `• ${rec}`).join("\n")}

Hydration: ${results?.dietPlan.hydration}

Supplements:
${results?.dietPlan.supplements.map((sup) => `• ${sup}`).join("\n")}

EXERCISE RECOMMENDATIONS:
Frequency: ${results?.exercise.frequency}
Duration: ${results?.exercise.duration}

Activities:
${results?.exercise.recommended.map((ex) => `• ${ex}`).join("\n")}

LIFESTYLE RECOMMENDATIONS:
Sleep Tips:
${results?.lifestyle.sleepTips.map((tip) => `• ${tip}`).join("\n")}

Stress Management:
${results?.lifestyle.stressManagement.map((tip) => `• ${tip}`).join("\n")}

FOLLOW-UP CARE:
Timeline: ${results?.followUp.timeline}

Red Flags - Seek Immediate Care:
${results?.followUp.redFlags.map((flag) => `• ${flag}`).join("\n")}

Emergency Contacts:
${results?.followUp.emergencyContacts.map((contact) => `• ${contact}`).join("\n")}

Next Steps:
${results?.followUp.nextSteps.map((step) => `• ${step}`).join("\n")}

---
DISCLAIMER: This AI-generated assessment is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.

Generated by MyMedi.ai - Your AI Healthcare Companion
Visit: https://mymedi.ai
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Health-Assessment-${formData.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Loading State
  if (isSubmitting) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-purple-200 rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-4 w-16 h-16 border-4 border-pink-200 rounded-full animate-spin border-t-pink-600"></div>
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🧠 AI Doctor Analyzing Your Health
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-600">Processing your symptoms and medical history...</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <p className="text-gray-600">Consulting medical databases and guidelines...</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <p className="text-gray-600">Generating personalized recommendations...</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                  <p className="text-gray-600">Creating comprehensive health plan...</p>
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-8">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results Display
  if (results) {
    const getRiskColor = (risk: string) => {
      switch (risk) {
        case "low":
          return "from-green-500 to-emerald-600"
        case "moderate":
          return "from-yellow-500 to-orange-600"
        case "high":
          return "from-red-500 to-pink-600"
        default:
          return "from-gray-500 to-gray-600"
      }
    }

    const getRiskBadgeColor = (risk: string) => {
      switch (risk) {
        case "low":
          return "bg-green-100 text-green-800 border-green-300"
        case "moderate":
          return "bg-yellow-100 text-yellow-800 border-yellow-300"
        case "high":
          return "bg-red-100 text-red-800 border-red-300"
        default:
          return "bg-gray-100 text-gray-800 border-gray-300"
      }
    }

    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Card */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mt-12"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
                <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold">Your Health Assessment Results</h1>
                    <p className="text-emerald-100 text-lg">AI-Powered Medical Analysis by MyMedi.ai</p>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Badge className={`${getRiskBadgeColor(results.riskLevel)} px-4 py-2 text-lg font-semibold border-2`}>
                    <Shield className="w-4 h-4 mr-2" />
                    {results.riskLevel.toUpperCase()} RISK
                  </Badge>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{results.overallScore}/100</div>
                    <div className="text-sm text-emerald-100">Health Score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm text-emerald-100">HIPAA Compliant</div>
                  <div className="font-semibold">Secure & Private</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Brain className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm text-emerald-100">AI-Powered</div>
                  <div className="font-semibold">Advanced Analysis</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm text-emerald-100">Personalized</div>
                  <div className="font-semibold">Just For You</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm text-emerald-100">Generated</div>
                  <div className="font-semibold">Today</div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{formData.name}</div>
                    <div className="text-sm text-emerald-100">Patient Name</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formData.age} years</div>
                    <div className="text-sm text-emerald-100">Age</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formData.symptomSeverity}/10</div>
                    <div className="text-sm text-emerald-100">Symptom Severity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formData.symptomDuration}</div>
                    <div className="text-sm text-emerald-100">Duration</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg px-6 py-3 transform hover:scale-105 transition-all duration-200"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Results
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg px-6 py-3 transform hover:scale-105 transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button
            onClick={resetAssessment}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-3 bg-transparent transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>

        {/* Progress Indicator */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-900">Overall Health Score</h3>
              <Badge className="bg-indigo-100 text-indigo-800">{results.overallScore}/100</Badge>
            </div>
            <Progress value={results.overallScore} className="h-3 mb-2" />
            <p className="text-sm text-indigo-700">
              {results.overallScore >= 80
                ? "Excellent health indicators"
                : results.overallScore >= 60
                  ? "Good health with room for improvement"
                  : "Health concerns that need attention"}
            </p>
          </CardContent>
        </Card>

        {/* Tabbed Results */}
        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 p-1 rounded-lg">
            <TabsTrigger
              value="medications"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <Pill className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <UserCheck className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Doctors
            </TabsTrigger>
            <TabsTrigger
              value="tests"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <FlaskConical className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Tests
            </TabsTrigger>
            <TabsTrigger
              value="pharmacy"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Pharmacy
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <Apple className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Diet
            </TabsTrigger>
            <TabsTrigger
              value="exercise"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <Dumbbell className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Exercise
            </TabsTrigger>
            <TabsTrigger
              value="lifestyle"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <HeartHandshake className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Lifestyle
            </TabsTrigger>
            <TabsTrigger
              value="followup"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md text-xs lg:text-sm"
            >
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              Follow-up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="mt-6">
            <div className="grid gap-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-rose-50 border-l-4 border-l-pink-500 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  <CardTitle className="flex items-center text-xl">
                    <Pill className="w-6 h-6 mr-3" />💊 Medication Recommendations
                    <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                      Over-the-Counter
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-pink-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-pink-600" />
                        Recommended Medications
                      </h4>
                      <div className="space-y-3">
                        {results.medications.recommended.map((med, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
                          >
                            <p className="text-gray-700 font-medium">{med}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-900 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                        Important Precautions
                      </h4>
                      <div className="space-y-3">
                        {results.medications.precautions.map((precaution, index) => (
                          <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <p className="text-orange-800 text-sm">{precaution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Alert className="mt-6 border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Important:</strong> Always consult with a healthcare provider before starting any new
                      medications, even over-the-counter ones. Check for drug interactions and allergies.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <UserCheck className="w-6 h-6 mr-3" />
                  👨‍⚕️ Healthcare Provider Recommendations
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    {results.doctors.urgency.split(" - ")[0]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                        Primary Care Recommendation
                      </h4>
                      <p className="text-gray-700 mb-4">{results.doctors.primaryCare}</p>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          results.doctors.urgency.includes("Urgent")
                            ? "bg-red-100 text-red-800"
                            : results.doctors.urgency.includes("Soon")
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        {results.doctors.urgency}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Booking Tips
                      </h4>
                      <ul className="space-y-2">
                        {results.doctors.bookingTips.map((tip, index) => (
                          <li key={index} className="flex items-start text-sm text-blue-800">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Specialist Consultations
                    </h4>
                    <div className="space-y-3">
                      {results.doctors.specialists.map((specialist, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                        >
                          <p className="text-gray-700">{specialist}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <FlaskConical className="w-6 h-6 mr-3" />🔬 Laboratory Test Recommendations
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    Comprehensive Panel
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-red-600" />
                      Immediate Tests
                    </h4>
                    <div className="space-y-3">
                      {results.labTests.immediate.map((test, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <p className="text-red-800 text-sm font-medium">{test}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      Routine Tests
                    </h4>
                    <div className="space-y-3">
                      {results.labTests.routine.map((test, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                          <p className="text-gray-700 text-sm">{test}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Follow-up Tests
                    </h4>
                    <div className="space-y-3">
                      {results.labTests.followUp.map((test, index) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-sm">{test}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-yellow-600" />
                    Test Preparation Guidelines
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {results.labTests.preparation.map((prep, index) => (
                      <li key={index} className="flex items-start text-sm text-yellow-800">
                        <CheckCircle className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
                        {prep}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacy" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-l-4 border-l-purple-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <MapPin className="w-6 h-6 mr-3" />🏪 Pharmacy & Prescription Guide
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    Cost-Effective Options
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                        Nearby Pharmacy Options
                      </h4>
                      <div className="space-y-3">
                        {results.pharmacy.nearbyOptions.map((option, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                            <p className="text-gray-700">{option}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                        Online Services
                      </h4>
                      <div className="space-y-3">
                        {results.pharmacy.onlineServices.map((service, index) => (
                          <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <p className="text-indigo-800 text-sm">{service}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-green-600" />
                        Cost-Saving Tips
                      </h4>
                      <div className="space-y-3">
                        {results.pharmacy.costSaving.map((tip, index) => (
                          <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-green-800 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                        Prescription Management
                      </h4>
                      <div className="space-y-3">
                        {results.pharmacy.prescriptionTips.map((tip, index) => (
                          <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <p className="text-yellow-800 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-l-orange-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Apple className="w-6 h-6 mr-3" />🥗 Personalized Nutrition Plan
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    Evidence-Based
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Dietary Recommendations
                      </h4>
                      <div className="space-y-3">
                        {results.dietPlan.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
                          >
                            <p className="text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Daily Hydration Goal
                      </h4>
                      <p className="text-blue-800 text-lg font-medium">{results.dietPlan.hydration}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                        Foods to Limit/Avoid
                      </h4>
                      <div className="space-y-3">
                        {results.dietPlan.restrictions.map((restriction, index) => (
                          <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-red-800 text-sm">{restriction}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-orange-900 mb-4 flex items-center">
                        <Pill className="w-5 h-5 mr-2 text-purple-600" />
                        Recommended Supplements
                      </h4>
                      <div className="space-y-3">
                        {results.dietPlan.supplements.map((supplement, index) => (
                          <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <p className="text-purple-800 text-sm">{supplement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercise" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-l-teal-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Dumbbell className="w-6 h-6 mr-3" />
                  🏃‍♂️ Exercise & Fitness Plan
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    Personalized Program
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-teal-100">
                      <h4 className="font-semibold text-teal-900 mb-3 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                        Exercise Schedule
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <strong>Frequency:</strong> {results.exercise.frequency}
                        </p>
                        <p className="text-gray-700">
                          <strong>Duration:</strong> {results.exercise.duration}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-teal-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Recommended Activities
                      </h4>
                      <div className="space-y-3">
                        {results.exercise.recommended.map((activity, index) => (
                          <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-green-800">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-teal-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Exercise Precautions
                    </h4>
                    <div className="space-y-3">
                      {results.exercise.restrictions.map((restriction, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <p className="text-red-800 text-sm">{restriction}</p>
                        </div>
                      ))}
                    </div>

                    <Alert className="mt-6 border-yellow-200 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Remember:</strong> Start slowly and gradually increase intensity. Listen to your body
                        and stop if you experience pain or discomfort.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-rose-50 to-pink-50 border-l-4 border-l-rose-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <HeartHandshake className="w-6 h-6 mr-3" />🌟 Lifestyle Optimization
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    Holistic Wellness
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-rose-900 mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-600" />
                        Sleep Optimization
                      </h4>
                      <div className="space-y-3">
                        {results.lifestyle.sleepTips.map((tip, index) => (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-blue-800 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-rose-900 mb-4 flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-purple-600" />
                        Stress Management
                      </h4>
                      <div className="space-y-3">
                        {results.lifestyle.stressManagement.map((tip, index) => (
                          <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <p className="text-purple-800 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-rose-900 mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-green-600" />
                        Healthy Habits
                      </h4>
                      <div className="space-y-3">
                        {results.lifestyle.habits.map((habit, index) => (
                          <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-green-800 text-sm">{habit}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-rose-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-orange-600" />
                        Health Monitoring
                      </h4>
                      <div className="space-y-3">
                        {results.lifestyle.monitoring.map((monitor, index) => (
                          <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <p className="text-orange-800 text-sm">{monitor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followup" className="mt-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-50 border-l-4 border-l-indigo-500 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="w-6 h-6 mr-3" />📅 Follow-up Care Plan
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white border-white border-opacity-30">
                    Critical Information
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
                      <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                        Follow-up Timeline
                      </h4>
                      <p className="text-gray-700 text-lg">{results.followUp.timeline}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Next Steps
                      </h4>
                      <div className="space-y-3">
                        {results.followUp.nextSteps.map((step, index) => (
                          <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <p className="text-green-800 text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />🚨 Emergency Warning Signs
                      </h4>
                      <div className="space-y-3">
                        {results.followUp.redFlags.map((flag, index) => (
                          <div
                            key={index}
                            className="bg-red-50 p-4 rounded-lg border border-red-200 border-l-4 border-l-red-500"
                          >
                            <p className="text-red-800 font-medium text-sm">{flag}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Emergency Contacts
                      </h4>
                      <ul className="space-y-2">
                        {results.followUp.emergencyContacts.map((contact, index) => (
                          <li key={index} className="text-blue-800 text-sm font-medium">
                            {contact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert className="mt-6 border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Important:</strong> If you experience any of the emergency warning signs listed above, seek
                    immediate medical attention. Do not wait for your scheduled follow-up appointment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <MyMedLogo />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">Powered by MyMedi.ai</h3>
                <p className="text-gray-600 max-w-2xl">
                  This comprehensive health assessment was generated using advanced AI technology. While our AI provides
                  valuable insights, it should not replace professional medical advice.
                </p>
                <p className="text-sm text-gray-500">
                  Always consult with qualified healthcare providers for medical decisions and treatment plans.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
                <span>🔒 HIPAA Compliant</span>
                <span>🛡️ Secure & Private</span>
                <span>🧠 AI-Powered</span>
                <span>⚡ Real-time Analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form Display
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-6">
      <Card className="w-full max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 sm:p-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
                    Comprehensive Health Assessment
                  </CardTitle>
                  <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                    AI-powered medical analysis by MyMedi.ai
                  </p>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end">
                <MyMedLogo />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                <div className="text-xs sm:text-sm">HIPAA Compliant</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                <div className="text-xs sm:text-sm">AI-Powered Analysis</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 text-center backdrop-blur-sm">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" />
                <div className="text-xs sm:text-sm">Personalized Results</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
                <Badge className="ml-2 bg-blue-100 text-blue-800">Required</Badge>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="name" className="text-blue-900 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-blue-900 font-medium">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                    required
                    min="1"
                    max="120"
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-blue-900 font-medium">
                    Gender *
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height" className="text-blue-900 font-medium">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) => setFormData({ ...formData, height: Number.parseInt(e.target.value) })}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Height in cm"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-blue-900 font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: Number.parseInt(e.target.value) })}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Weight in kg"
                  />
                </div>
              </div>
            </div>

            {/* Current Health Concern */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 sm:p-6 rounded-lg border border-red-200">
              <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Current Health Concern
                <Badge className="ml-2 bg-red-100 text-red-800">Primary Focus</Badge>
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="primaryConcern" className="text-red-900 font-medium">
                    What is your main health concern today? *
                  </Label>
                  <Input
                    id="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                    required
                    className="mt-1 border-red-200 focus:border-red-500"
                    placeholder="e.g., Chest pain, Headache, Fever, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="symptomDescription" className="text-red-900 font-medium">
                    Describe your symptoms in detail *
                  </Label>
                  <Textarea
                    id="symptomDescription"
                    value={formData.symptomDescription}
                    onChange={(e) => setFormData({ ...formData, symptomDescription: e.target.value })}
                    required
                    rows={4}
                    className="mt-1 border-red-200 focus:border-red-500"
                    placeholder="Please describe your symptoms, when they started, what makes them better or worse..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="symptomDuration" className="text-red-900 font-medium">
                      How long have you had these symptoms? *
                    </Label>
                    <Select
                      value={formData.symptomDuration}
                      onValueChange={(value) => setFormData({ ...formData, symptomDuration: value })}
                    >
                      <SelectTrigger className="mt-1 border-red-200 focus:border-red-500">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-1-day">Less than 1 day</SelectItem>
                        <SelectItem value="1-3-days">1-3 days</SelectItem>
                        <SelectItem value="4-7-days">4-7 days</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="more-than-3-months">More than 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="symptomSeverity" className="text-red-900 font-medium">
                      Rate your symptom severity (1-10) *
                    </Label>
                    <Select
                      value={formData.symptomSeverity}
                      onValueChange={(value) => setFormData({ ...formData, symptomSeverity: value })}
                    >
                      <SelectTrigger className="mt-1 border-red-200 focus:border-red-500">
                        <SelectValue placeholder="1 (mild) - 10 (severe)" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} - {num <= 3 ? "Mild" : num <= 6 ? "Moderate" : num <= 8 ? "Severe" : "Very Severe"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-red-900 font-medium mb-3 block">Where is your pain/discomfort located?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {painLocationOptions.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pain-${location}`}
                          checked={formData.painLocation.includes(location)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("painLocation", location, checked as boolean)
                          }
                        />
                        <Label htmlFor={`pain-${location}`} className="text-sm text-red-800">
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Medical History
                <Badge className="ml-2 bg-purple-100 text-purple-800">Important Context</Badge>
              </h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-purple-900 font-medium mb-3 block">Do you have any chronic conditions?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {chronicConditionsList.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`chronic-${condition}`}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("chronicConditions", condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={`chronic-${condition}`} className="text-sm text-purple-800">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="currentMedications" className="text-purple-900 font-medium">
                    Current Medications (include dosages)
                  </Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications.join(", ")}
                    onChange={(e) =>
                      setFormData({ ...formData, currentMedications: e.target.value.split(", ").filter(Boolean) })
                    }
                    rows={3}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="List all medications you're currently taking, including over-the-counter drugs and supplements..."
                  />
                </div>
                <div>
                  <Label className="text-purple-900 font-medium mb-3 block">Do you have any known allergies?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {commonAllergies.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergy-${allergy}`}
                          checked={formData.allergies.includes(allergy)}
                          onCheckedChange={(checked) => handleCheckboxChange("allergies", allergy, checked as boolean)}
                        />
                        <Label htmlFor={`allergy-${allergy}`} className="text-sm text-purple-800">
                          {allergy}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="surgicalHistory" className="text-purple-900 font-medium">
                    Surgical History
                  </Label>
                  <Textarea
                    id="surgicalHistory"
                    value={formData.surgicalHistory}
                    onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })}
                    rows={3}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="List any surgeries or procedures you've had, including dates..."
                  />
                </div>
                <div>
                  <Label className="text-purple-900 font-medium mb-3 block">Family Medical History</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {familyHistoryConditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`family-${condition}`}
                          checked={formData.familyHistory.includes(condition)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("familyHistory", condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={`family-${condition}`} className="text-sm text-purple-800">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-900 mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Vital Signs
                <Badge className="ml-2 bg-green-100 text-green-800">Optional but Helpful</Badge>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="bloodPressure" className="text-green-900 font-medium">
                    Blood Pressure
                  </Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <Label htmlFor="heartRate" className="text-green-900 font-medium">
                    Heart Rate (bpm)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate || ""}
                    onChange={(e) => setFormData({ ...formData, heartRate: Number.parseInt(e.target.value) })}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="e.g., 72"
                  />
                </div>
                <div>
                  <Label htmlFor="temperature" className="text-green-900 font-medium">
                    Temperature (°C)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature || ""}
                    onChange={(e) => setFormData({ ...formData, temperature: Number.parseFloat(e.target.value) })}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="e.g., 36.5"
                  />
                </div>
                <div>
                  <Label htmlFor="oxygenSaturation" className="text-green-900 font-medium">
                    Oxygen Saturation (%)
                  </Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    value={formData.oxygenSaturation || ""}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: Number.parseInt(e.target.value) })}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="e.g., 98"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle Factors */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold text-yellow-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Lifestyle Factors
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">Affects Treatment</Badge>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <Label htmlFor="smokingStatus" className="text-yellow-900 font-medium">
                    Smoking Status
                  </Label>
                  <Select
                    value={formData.smokingStatus}
                    onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
                  >
                    <SelectTrigger className="mt-1 border-yellow-200 focus:border-yellow-500">
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never smoked</SelectItem>
                      <SelectItem value="former">Former smoker</SelectItem>
                      <SelectItem value="current">Current smoker</SelectItem>
                      <SelectItem value="occasional">Occasional smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alcoholConsumption" className="text-yellow-900 font-medium">
                    Alcohol Consumption
                  </Label>
                  <Select
                    value={formData.alcoholConsumption}
                    onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
                  >
                    <SelectTrigger className="mt-1 border-yellow-200 focus:border-yellow-500">
                      <SelectValue placeholder="Select alcohol consumption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                      <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exerciseFrequency" className="text-yellow-900 font-medium">
                    Exercise Frequency
                  </Label>
                  <Select
                    value={formData.exerciseFrequency}
                    onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
                  >
                    <SelectTrigger className="mt-1 border-yellow-200 focus:border-yellow-500">
                      <SelectValue placeholder="Select exercise frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No regular exercise</SelectItem>
                      <SelectItem value="1-2-times">1-2 times per week</SelectItem>
                      <SelectItem value="3-4-times">3-4 times per week</SelectItem>
                      <SelectItem value="5-plus-times">5+ times per week</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sleepHours" className="text-yellow-900 font-medium">
                    Average Sleep Hours
                  </Label>
                  <Input
                    id="sleepHours"
                    type="number"
                    value={formData.sleepHours || ""}
                    onChange={(e) => setFormData({ ...formData, sleepHours: Number.parseInt(e.target.value) })}
                    className="mt-1 border-yellow-200 focus:border-yellow-500"
                    placeholder="e.g., 7"
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <Label htmlFor="stressLevel" className="text-yellow-900 font-medium">
                    Stress Level (1-10)
                  </Label>
                  <Select
                    value={formData.stressLevel}
                    onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
                  >
                    <SelectTrigger className="mt-1 border-yellow-200 focus:border-yellow-500">
                      <SelectValue placeholder="1 (low) - 10 (high)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} - {num <= 3 ? "Low" : num <= 6 ? "Moderate" : num <= 8 ? "High" : "Very High"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 sm:p-6 rounded-lg border border-teal-200">
              <h3 className="text-xl font-semibold text-teal-900 mb-6 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Additional Information
                <Badge className="ml-2 bg-teal-100 text-teal-800">Complete Picture</Badge>
              </h3>
              <div className="space-y-6">
                <div>
                  <Label className="text-teal-900 font-medium mb-3 block">
                    Are you experiencing any of these additional symptoms?
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {additionalSymptomsList.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={`additional-${symptom}`}
                          checked={formData.additionalSymptoms.includes(symptom)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("additionalSymptoms", symptom, checked as boolean)
                          }
                        />
                        <Label htmlFor={`additional-${symptom}`} className="text-sm text-teal-800">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalNotes" className="text-teal-900 font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    rows={4}
                    className="mt-1 border-teal-200 focus:border-teal-500"
                    placeholder="Any other information you think might be relevant to your health assessment..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 hover:from-purple-700 hover:via-blue-700 hover:to-teal-700 text-white px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Analyzing Your Health...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-3" />
                    Get AI Health Assessment
                  </>
                )}
              </Button>
              <p className="text-xs sm:text-sm text-gray-600 mt-4 max-w-2xl mx-auto text-center px-2">
                Your information is secure and private. This AI assessment provides educational insights and should not
                replace professional medical advice.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
