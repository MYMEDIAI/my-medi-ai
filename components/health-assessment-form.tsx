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
import MyMedLogo from "./mymed-logo"
import {
  User,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Weight,
  Ruler,
  Thermometer,
  Clock,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Download,
  Loader2,
} from "lucide-react"

interface AssessmentData {
  // Personal Information
  age: string
  weight: string
  height: string
  gender: string
  location: string

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
}

interface AssessmentResult {
  riskLevel: "Low" | "Medium" | "High"
  riskScore: number
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  medicationSuggestions: string[]
  specialistReferrals: string[]
  labTests: string[]
  dietPlan: string[]
  exercisePlan: string[]
  followUp: string
}

export default function HealthAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    age: "",
    weight: "",
    height: "",
    gender: "",
    location: "",
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
  })
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const commonConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Migraine",
    "COPD",
    "Thyroid Disorders",
  ]

  const severityLevels = [
    { value: "1", label: "Mild (1/10)", color: "text-green-600" },
    { value: "3", label: "Moderate (3/10)", color: "text-yellow-600" },
    { value: "5", label: "Significant (5/10)", color: "text-orange-600" },
    { value: "7", label: "Severe (7/10)", color: "text-red-600" },
    { value: "9", label: "Extreme (9/10)", color: "text-red-800" },
  ]

  const handleInputChange = (field: keyof AssessmentData, value: string | string[]) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleConditionToggle = (condition: string, field: keyof AssessmentData) => {
    const currentConditions = assessmentData[field] as string[]
    const updatedConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c) => c !== condition)
      : [...currentConditions, condition]
    handleInputChange(field, updatedConditions)
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(assessmentData.age && assessmentData.gender)
      case 2:
        return !!(assessmentData.primarySymptom && assessmentData.symptomDuration && assessmentData.symptomSeverity)
      case 3:
        return true // Medical history is optional
      case 4:
        return true // Lifestyle is optional
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (validateCurrentStep()) {
        setCurrentStep((prev) => prev + 1)
      } else {
        alert("Please fill in all required fields before proceeding.")
      }
    } else {
      handleSubmit()
    }
  }

  const generateAssessment = async (): Promise<AssessmentResult> => {
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Calculate risk score based on assessment data
    let riskScore = 20 // Base score

    // Age factor
    const age = Number.parseInt(assessmentData.age)
    if (age > 65) riskScore += 20
    else if (age > 50) riskScore += 10

    // Symptom severity
    const severity = Number.parseInt(assessmentData.symptomSeverity)
    riskScore += severity * 5

    // Chronic conditions
    riskScore += assessmentData.chronicConditions.length * 10

    // Lifestyle factors
    if (assessmentData.smokingStatus === "current") riskScore += 15
    if (assessmentData.exerciseFrequency === "never") riskScore += 10
    if (Number.parseInt(assessmentData.stressLevel) > 7) riskScore += 10

    // Determine risk level
    let riskLevel: "Low" | "Medium" | "High"
    if (riskScore <= 40) riskLevel = "Low"
    else if (riskScore <= 70) riskLevel = "Medium"
    else riskLevel = "High"

    const result: AssessmentResult = {
      riskLevel,
      riskScore: Math.min(riskScore, 100),
      recommendations: {
        immediate:
          riskLevel === "High"
            ? [
                "Contact your healthcare provider within 24 hours",
                "Monitor symptoms closely",
                "Keep emergency contacts handy",
              ]
            : riskLevel === "Medium"
              ? [
                  "Schedule appointment with primary care physician within 1-2 weeks",
                  "Continue monitoring symptoms",
                  "Implement lifestyle modifications",
                ]
              : ["Continue monitoring symptoms", "Maintain healthy lifestyle", "Consider routine check-up"],
        shortTerm: [
          "Follow prescribed medication regimen",
          "Implement dietary modifications",
          "Start gradual exercise program",
          "Schedule recommended lab tests",
        ],
        longTerm: [
          "Maintain regular medical check-ups",
          "Continue healthy lifestyle habits",
          "Monitor chronic conditions",
          "Update health records regularly",
        ],
      },
      medicationSuggestions: assessmentData.primarySymptom.toLowerCase().includes("pain")
        ? ["Over-the-counter pain relievers (as directed)", "Anti-inflammatory medications", "Topical pain relief"]
        : assessmentData.primarySymptom.toLowerCase().includes("headache")
          ? ["Acetaminophen or ibuprofen", "Stay hydrated", "Consider magnesium supplements"]
          : ["Consult healthcare provider for appropriate medications"],
      specialistReferrals:
        riskLevel === "High"
          ? [
              "Cardiologist (for heart-related symptoms)",
              "Endocrinologist (for diabetes management)",
              "Neurologist (for persistent headaches)",
            ]
          : ["Primary care physician consultation recommended"],
      labTests: [
        "Complete Blood Count (CBC)",
        "Comprehensive Metabolic Panel",
        "Lipid Panel",
        "HbA1c (if diabetic)",
        "Thyroid Function Tests",
      ],
      dietPlan: assessmentData.chronicConditions.includes("Diabetes")
        ? [
            "Low-carbohydrate, high-fiber diet",
            "Monitor portion sizes",
            "Include lean proteins",
            "Limit processed foods and sugars",
            "Regular meal timing",
          ]
        : [
            "Balanced Mediterranean-style diet",
            "Increase fruits and vegetables",
            "Choose whole grains",
            "Limit processed foods",
            "Stay adequately hydrated",
          ],
      exercisePlan:
        assessmentData.exerciseFrequency === "never"
          ? [
              "Start with 10-15 minutes of light walking daily",
              "Gradually increase duration and intensity",
              "Include flexibility and strength exercises",
              "Consult doctor before starting new exercise program",
            ]
          : [
              "Maintain current activity level",
              "Add variety to prevent boredom",
              "Include both cardio and strength training",
              "Listen to your body and rest when needed",
            ],
      followUp:
        riskLevel === "High"
          ? "Schedule follow-up within 1-2 weeks or sooner if symptoms worsen"
          : riskLevel === "Medium"
            ? "Schedule follow-up within 1 month"
            : "Schedule routine check-up within 3-6 months",
    }

    setIsProcessing(false)
    return result
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      alert("Please fill in all required fields before submitting.")
      return
    }

    const result = await generateAssessment()
    setAssessmentResult(result)
  }

  const exportReport = () => {
    if (!assessmentResult) return

    const reportContent = `
MYMED.AI COMPREHENSIVE HEALTH ASSESSMENT REPORT
Generated: ${new Date().toLocaleDateString()}

PATIENT INFORMATION:
• Age: ${assessmentData.age} years
• Weight: ${assessmentData.weight} lbs
• Height: ${assessmentData.height}
• Gender: ${assessmentData.gender}
• Location: ${assessmentData.location}

CURRENT SYMPTOMS:
• Primary Symptom: ${assessmentData.primarySymptom}
• Duration: ${assessmentData.symptomDuration}
• Severity: ${assessmentData.symptomSeverity}/10
• Additional Symptoms: ${assessmentData.additionalSymptoms || "None reported"}

MEDICAL HISTORY:
• Chronic Conditions: ${assessmentData.chronicConditions.join(", ") || "None reported"}
• Current Medications: ${assessmentData.currentMedications.join(", ") || "None reported"}
• Allergies: ${assessmentData.allergies.join(", ") || "None reported"}
• Family History: ${assessmentData.familyHistory.join(", ") || "None reported"}

LIFESTYLE FACTORS:
• Exercise Frequency: ${assessmentData.exerciseFrequency}
• Smoking Status: ${assessmentData.smokingStatus}
• Alcohol Consumption: ${assessmentData.alcoholConsumption}
• Sleep Hours: ${assessmentData.sleepHours} hours/night
• Stress Level: ${assessmentData.stressLevel}/10

AI ASSESSMENT RESULTS:
• Risk Level: ${assessmentResult.riskLevel}
• Risk Score: ${assessmentResult.riskScore}/100

IMMEDIATE RECOMMENDATIONS:
${assessmentResult.recommendations.immediate.map((r) => `• ${r}`).join("\n")}

SHORT-TERM RECOMMENDATIONS:
${assessmentResult.recommendations.shortTerm.map((r) => `• ${r}`).join("\n")}

LONG-TERM RECOMMENDATIONS:
${assessmentResult.recommendations.longTerm.map((r) => `• ${r}`).join("\n")}

MEDICATION SUGGESTIONS:
${assessmentResult.medicationSuggestions.map((m) => `• ${m}`).join("\n")}

SPECIALIST REFERRALS:
${assessmentResult.specialistReferrals.map((s) => `• ${s}`).join("\n")}

RECOMMENDED LAB TESTS:
${assessmentResult.labTests.map((t) => `• ${t}`).join("\n")}

DIET PLAN RECOMMENDATIONS:
${assessmentResult.dietPlan.map((d) => `• ${d}`).join("\n")}

EXERCISE PLAN:
${assessmentResult.exercisePlan.map((e) => `• ${e}`).join("\n")}

FOLLOW-UP:
${assessmentResult.followUp}

IMPORTANT DISCLAIMER:
This assessment is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

Powered by MYMED.AI
Your AI Healthcare Assistant
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mymed-health-assessment-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-100 border-green-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "High":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setAssessmentData({
      age: "",
      weight: "",
      height: "",
      gender: "",
      location: "",
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
    })
    setAssessmentResult(null)
    setIsProcessing(false)
  }

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900">Processing Your Assessment</h3>
              <p className="text-gray-600 text-center max-w-md">
                Our AI is analyzing your health information and generating personalized recommendations. This may take a
                few moments.
              </p>
              <div className="w-full max-w-xs">
                <Progress value={66} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (assessmentResult) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MyMedLogo size="sm" showText={false} />
                <span>Your Health Assessment Results</span>
              </div>
              <div className="flex space-x-2">
                <Button onClick={resetForm} variant="outline" size="sm">
                  New Assessment
                </Button>
                <Button onClick={exportReport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${getRiskColor(assessmentResult.riskLevel)}`}
                >
                  <span className="font-bold text-lg">{assessmentResult.riskLevel} Risk</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Overall Risk Level</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{assessmentResult.riskScore}/100</div>
                <p className="text-sm text-gray-600">Risk Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{new Date().toLocaleDateString()}</div>
                <p className="text-sm text-gray-600">Assessment Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk-specific Alert */}
        {assessmentResult.riskLevel === "High" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>High Risk Detected:</strong> Your assessment indicates elevated health risks. Please contact your
              healthcare provider within 24 hours or seek immediate medical attention if symptoms worsen.
            </AlertDescription>
          </Alert>
        )}

        {assessmentResult.riskLevel === "Medium" && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Moderate Risk:</strong> Your assessment shows some health concerns that warrant medical attention.
              Schedule an appointment with your healthcare provider within 1-2 weeks.
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <span>Immediate Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessmentResult.recommendations.immediate.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <Clock className="w-5 h-5" />
                <span>Short-term Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessmentResult.recommendations.shortTerm.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Long-term Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessmentResult.recommendations.longTerm.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Heart className="w-5 h-5" />
                <span>Medical Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Medication Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {assessmentResult.medicationSuggestions.map((med, idx) => (
                    <li key={idx}>{med}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Specialist Referrals:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {assessmentResult.specialistReferrals.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Lab Tests:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {assessmentResult.labTests.map((test, idx) => (
                    <li key={idx}>{test}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Activity className="w-5 h-5" />
                <span>Lifestyle Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Diet Plan:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {assessmentResult.dietPlan.map((diet, idx) => (
                    <li key={idx}>{diet}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Exercise Plan:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {assessmentResult.exercisePlan.map((exercise, idx) => (
                    <li key={idx}>{exercise}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">Follow-up Schedule:</h4>
                <p className="text-sm text-blue-800">{assessmentResult.followUp}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => (window.location.href = "/diet")} className="bg-green-600 hover:bg-green-700">
                View Detailed Diet Plan
              </Button>
              <Button onClick={() => (window.location.href = "/vitals")} variant="outline">
                Start Vitals Tracking
              </Button>
              <Button onClick={() => (window.location.href = "/chat")} variant="outline">
                Ask AI Follow-up Questions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <MyMedLogo size="sm" className="mx-auto mb-2" />
          <p>
            Powered by MYMED.AI • This assessment is for informational purposes only and does not replace professional
            medical advice, diagnosis, or treatment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 &&
        (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={assessmentData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  className="focus:ring-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={assessmentData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <div className="relative">
                  <Weight className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    value={assessmentData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="Enter weight"
                    className="pl-10 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <div className="relative">
                  <Ruler className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="height"
                    value={assessmentData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="e.g., 5'8\" or 172 cm"
                    className=\"pl-10 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location (City, State)</Label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="location"
                  value={assessmentData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Los Angeles, CA"
                  className="pl-10 focus:ring-purple-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        )}

      {/* Step 2: Current Symptoms */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span>Current Symptoms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primarySymptom">Primary Symptom or Concern *</Label>
              <Textarea
                id="primarySymptom"
                value={assessmentData.primarySymptom}
                onChange={(e) => handleInputChange("primarySymptom", e.target.value)}
                placeholder="Describe your main health concern or symptom in detail"
                className="focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symptomDuration">How long have you had this symptom? *</Label>
                <select
                  id="symptomDuration"
                  value={assessmentData.symptomDuration}
                  onChange={(e) => handleInputChange("symptomDuration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select duration</option>
                  <option value="less-than-1-day">Less than 1 day</option>
                  <option value="1-3-days">1-3 days</option>
                  <option value="4-7-days">4-7 days</option>
                  <option value="1-week">1 week</option>
                  <option value="2-weeks">2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="more-than-1-month">More than 1 month</option>
                </select>
              </div>
              <div>
                <Label htmlFor="symptomSeverity">Severity of Symptom (1-10) *</Label>
                <select
                  id="symptomSeverity"
                  value={assessmentData.symptomSeverity}
                  onChange={(e) => handleInputChange("symptomSeverity", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <Label htmlFor="additionalSymptoms">Additional Symptoms (if any)</Label>
              <Textarea
                id="additionalSymptoms"
                value={assessmentData.additionalSymptoms}
                onChange={(e) => handleInputChange("additionalSymptoms", e.target.value)}
                placeholder="List any other symptoms you are experiencing"
                className="focus:ring-purple-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Medical History */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Medical History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chronicConditions">Chronic Conditions</Label>
              <p className="text-sm text-gray-600 mb-2">Click to select any conditions that apply to you:</p>
              <div className="flex flex-wrap gap-2">
                {commonConditions.map((condition) => (
                  <Badge
                    key={condition}
                    onClick={() => handleConditionToggle(condition, "chronicConditions")}
                    className={`cursor-pointer transition-colors ${
                      assessmentData.chronicConditions.includes(condition)
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
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
                placeholder="List all medications you are currently taking (separate with commas)"
                className="focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={assessmentData.allergies.join(", ")}
                onChange={(e) => handleInputChange("allergies", e.target.value.split(", ").filter(Boolean))}
                placeholder="List any known allergies (separate with commas)"
                className="focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="familyHistory">Family History</Label>
              <Textarea
                id="familyHistory"
                value={assessmentData.familyHistory.join(", ")}
                onChange={(e) => handleInputChange("familyHistory", e.target.value.split(", ").filter(Boolean))}
                placeholder="List any significant health issues in your family (separate with commas)"
                className="focus:ring-purple-500"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Lifestyle */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>Lifestyle</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
              <select
                id="exerciseFrequency"
                value={assessmentData.exerciseFrequency}
                onChange={(e) => handleInputChange("exerciseFrequency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select frequency</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally (1-2 times per week)</option>
                <option value="regularly">Regularly (3+ times per week)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="smokingStatus">Smoking Status</Label>
              <select
                id="smokingStatus"
                value={assessmentData.smokingStatus}
                onChange={(e) => handleInputChange("smokingStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select status</option>
                <option value="never">Never smoked</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
              </select>
            </div>

            <div>
              <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
              <select
                id="alcoholConsumption"
                value={assessmentData.alcoholConsumption}
                onChange={(e) => handleInputChange("alcoholConsumption", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select consumption</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally (1-2 drinks per week)</option>
                <option value="regularly">Regularly (3+ drinks per week)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="sleepHours">Average Sleep Hours per Night</Label>
              <Input
                id="sleepHours"
                type="number"
                value={assessmentData.sleepHours}
                onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                placeholder="e.g., 7"
                className="focus:ring-purple-500"
                min="1"
                max="12"
              />
            </div>

            <div>
              <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
              <select
                id="stressLevel"
                value={assessmentData.stressLevel}
                onChange={(e) => handleInputChange("stressLevel", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select stress level</option>
                {severityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          variant="outline"
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700" disabled={!validateCurrentStep()}>
          {currentStep === totalSteps ? (
            <>
              Submit Assessment
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Step Summary */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {currentStep === 1 && "Fill in your basic information to get started"}
        {currentStep === 2 && "Describe your current symptoms and concerns"}
        {currentStep === 3 && "Share your medical history (optional but helpful)"}
        {currentStep === 4 && "Tell us about your lifestyle habits"}
      </div>
    </div>
  )
}
