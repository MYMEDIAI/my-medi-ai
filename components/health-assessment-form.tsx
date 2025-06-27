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
import { User, Heart, Activity, AlertTriangle, FileText, Thermometer, ArrowLeft, Download } from "lucide-react"

interface AssessmentData {
  age: string
  weight: string
  height: string
  gender: string
  location: string
  primarySymptom: string
  symptomDuration: string
  symptomSeverity: string
  additionalSymptoms: string
  chronicConditions: string[]
  currentMedications: string[]
  allergies: string[]
  familyHistory: string[]
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
    { value: "1", label: "Mild (1/10)" },
    { value: "3", label: "Moderate (3/10)" },
    { value: "5", label: "Significant (5/10)" },
    { value: "7", label: "Severe (7/10)" },
    { value: "9", label: "Extreme (9/10)" },
  ]

  const handleInputChange = (field: keyof AssessmentData, value: string | string[]) => {
    setAssessmentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleConditionToggle = (condition: string) => {
    const updatedConditions = assessmentData.chronicConditions.includes(condition)
      ? assessmentData.chronicConditions.filter((c) => c !== condition)
      : [...assessmentData.chronicConditions, condition]
    handleInputChange("chronicConditions", updatedConditions)
  }

  const generateAssessment = async (): Promise<AssessmentResult> => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let riskScore = 20
    const age = Number.parseInt(assessmentData.age) || 0
    if (age > 65) riskScore += 20
    else if (age > 50) riskScore += 10

    const severity = Number.parseInt(assessmentData.symptomSeverity) || 0
    riskScore += severity * 5

    riskScore += assessmentData.chronicConditions.length * 10

    if (assessmentData.smokingStatus === "current") riskScore += 15
    if (assessmentData.exerciseFrequency === "never") riskScore += 10
    if (Number.parseInt(assessmentData.stressLevel) > 7) riskScore += 10

    const riskLevel = riskScore > 70 ? "High" : riskScore > 40 ? "Medium" : "Low"

    return {
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
  }

  const handleSubmit = async () => {
    const result = await generateAssessment()
    setAssessmentResult(result)
    setIsProcessing(false)
  }

  const exportReport = () => {
    if (!assessmentResult) return

    const reportContent = `
MYMED.AI HEALTH ASSESSMENT REPORT
Generated: ${new Date().toLocaleDateString()}

PATIENT INFORMATION:
Age: ${assessmentData.age}
Weight: ${assessmentData.weight} lbs
Height: ${assessmentData.height}
Gender: ${assessmentData.gender}
Location: ${assessmentData.location}

SYMPTOMS:
Primary: ${assessmentData.primarySymptom}
Duration: ${assessmentData.symptomDuration}
Severity: ${assessmentData.symptomSeverity}/10
Additional: ${assessmentData.additionalSymptoms || "None"}

ASSESSMENT RESULTS:
Risk Level: ${assessmentResult.riskLevel}
Risk Score: ${assessmentResult.riskScore}/100

RECOMMENDATIONS:
${assessmentResult.recommendations.immediate.map((r) => `• ${r}`).join("\n")}

DIET PLAN:
${assessmentResult.dietPlan.map((d) => `• ${d}`).join("\n")}

EXERCISE PLAN:
${assessmentResult.exercisePlan.map((e) => `• ${e}`).join("\n")}

NOTE: This is not medical advice. Consult a healthcare professional.
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `health-assessment-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
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
      <div className="max-w-4xl mx-auto space-y-6 p-4">
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MyMedLogo size="sm" showText={false} />
                <span>Your Health Assessment Results</span>
              </div>
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
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
                <div className="text-3xl font-bold text-blue-600">{assessmentResult.riskScore}/100</div>
                <p className="text-sm text-gray-600">Risk Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{new Date().toLocaleDateString()}</div>
                <p className="text-sm text-gray-600">Assessment Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {assessmentResult.riskLevel === "High" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>High Risk Detected:</strong> Please contact your healthcare provider within 24 hours.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Immediate Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessmentResult.recommendations.immediate.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-600">
                <Heart className="w-5 h-5" />
                <span>Medical Advice</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Medications:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {assessmentResult.medicationSuggestions.map((med, i) => (
                      <li key={i}>{med}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Specialists:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {assessmentResult.specialistReferrals.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <Activity className="w-5 h-5" />
                <span>Lifestyle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Diet Plan:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {assessmentResult.dietPlan.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Exercise:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {assessmentResult.exercisePlan.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>This assessment is for informational purposes only and does not replace professional medical advice.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

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
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  value={assessmentData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="Enter weight"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={assessmentData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder={"e.g. 5'8\" or 172 cm"}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={assessmentData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
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
                placeholder="Describe your main symptom"
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
                placeholder="Any other symptoms?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
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
                onChange={(e) => handleInputChange("currentMedications", e.target.value.split(", "))}
                placeholder="List medications, separated by commas"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={assessmentData.allergies.join(", ")}
                onChange={(e) => handleInputChange("allergies", e.target.value.split(", "))}
                placeholder="List allergies, separated by commas"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Lifestyle Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
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
                <option value="rarely">Rarely</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
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
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {isProcessing ? "Processing..." : "Get Assessment"}
          </Button>
        )}
      </div>
    </div>
  )
}
