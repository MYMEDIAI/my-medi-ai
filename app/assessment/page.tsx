"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  User,
  Heart,
  Activity,
  Pill,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Loader2,
  Home,
  RotateCcw,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  FileText,
  Stethoscope,
  Brain,
  Shield,
  Target,
  Info,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"

interface VitalsData {
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  heartRate: string
  temperature: string
  oxygenSaturation: string
  bloodSugar: string
  respiratoryRate: string
  bmi: string
}

interface MedicalHistory {
  currentMedications: string[]
  allergies: string[]
  chronicConditions: string[]
  previousSurgeries: string[]
  familyHistory: string[]
  smokingStatus: string
  alcoholConsumption: string
  exerciseFrequency: string
  sleepHours: string
}

interface SymptomDetails {
  location: string[]
  triggers: string[]
  reliefFactors: string[]
  associatedSymptoms: string[]
  timeOfDay: string
  progression: string
}

interface AssessmentData {
  // Basic Info
  name: string
  age: string
  weight: string
  height: string
  gender: string

  // Primary Complaint
  primarySymptom: string
  symptomDuration: string
  symptomSeverity: string
  symptomDetails: SymptomDetails

  // Medical History
  medicalHistory: MedicalHistory

  // Vitals
  vitals: VitalsData

  // Additional Context
  recentTravel: string
  occupationalExposure: string
  stressLevel: string
  menstrualHistory: string
}

interface StructuredRecommendation {
  title: string
  priority: "High" | "Medium" | "Low"
  category: "Immediate" | "Short-term" | "Long-term"
  description: string
  reasoning: string
  timeframe: string
  cost: "Free" | "Low" | "Medium" | "High"
  actionItems: string[]
}

interface AIResponse {
  riskAssessment: {
    overallRisk: "Low" | "Medium" | "High" | "Critical"
    riskFactors: string[]
    urgencyLevel: string
    followUpTimeframe: string
  }
  medications: StructuredRecommendation[]
  diagnostics: StructuredRecommendation[]
  specialists: StructuredRecommendation[]
  lifestyle: StructuredRecommendation[]
  monitoring: StructuredRecommendation[]
  redFlags: string[]
  differentialDiagnosis: string[]
  patientEducation: string[]
  followUpPlan: {
    immediate: string[]
    oneWeek: string[]
    oneMonth: string[]
    threeMonths: string[]
  }
}

const durationOptions = [
  "Less than 1 hour",
  "1-6 hours",
  "6-12 hours",
  "1 day",
  "2-3 days",
  "4-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "1-3 months",
  "More than 3 months",
]

const severityOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}`)

const symptomLocations = [
  "Head/Headache",
  "Eyes",
  "Ears",
  "Nose/Sinuses",
  "Throat",
  "Neck",
  "Chest",
  "Heart",
  "Lungs",
  "Abdomen",
  "Back",
  "Arms",
  "Legs",
  "Joints",
  "Skin",
  "Whole body",
]

const commonTriggers = [
  "Food/Eating",
  "Exercise",
  "Stress",
  "Weather changes",
  "Sleep changes",
  "Medications",
  "Certain positions",
  "Time of day",
  "Menstrual cycle",
  "None identified",
]

const associatedSymptoms = [
  "Fever",
  "Chills",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Dizziness",
  "Fatigue",
  "Shortness of breath",
  "Chest pain",
  "Headache",
  "Muscle aches",
  "Joint pain",
  "Rash",
  "Swelling",
]

export default function AdvancedAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [form, setForm] = useState<AssessmentData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    primarySymptom: "",
    symptomDuration: "",
    symptomSeverity: "",
    symptomDetails: {
      location: [],
      triggers: [],
      reliefFactors: [],
      associatedSymptoms: [],
      timeOfDay: "",
      progression: "",
    },
    medicalHistory: {
      currentMedications: [],
      allergies: [],
      chronicConditions: [],
      previousSurgeries: [],
      familyHistory: [],
      smokingStatus: "",
      alcoholConsumption: "",
      exerciseFrequency: "",
      sleepHours: "",
    },
    vitals: {
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      bloodSugar: "",
      respiratoryRate: "",
      bmi: "",
    },
    recentTravel: "",
    occupationalExposure: "",
    stressLevel: "",
    menstrualHistory: "",
  })

  const [assessmentResults, setAssessmentResults] = useState<AIResponse | null>(null)
  const [assessmentLoading, setAssessmentLoading] = useState(false)
  const [newMedication, setNewMedication] = useState("")
  const [newAllergy, setNewAllergy] = useState("")

  // Calculate BMI automatically
  useEffect(() => {
    if (form.weight && form.height) {
      const weightKg = Number.parseFloat(form.weight)
      const heightM = Number.parseFloat(form.height) / 100
      const bmi = (weightKg / (heightM * heightM)).toFixed(1)
      setForm((prev) => ({
        ...prev,
        vitals: { ...prev.vitals, bmi },
      }))
    }
  }, [form.weight, form.height])

  // Calculate progress
  useEffect(() => {
    const totalSteps = 5
    const currentProgress = (currentStep / totalSteps) * 100
    setProgress(currentProgress)
  }, [currentStep])

  const handle = (k: keyof AssessmentData, v: any) => setForm((prev) => ({ ...prev, [k]: v }))
  const handleVitals = (k: keyof VitalsData, v: string) =>
    setForm((prev) => ({ ...prev, vitals: { ...prev.vitals, [k]: v } }))
  const handleSymptomDetails = (k: keyof SymptomDetails, v: any) =>
    setForm((prev) => ({
      ...prev,
      symptomDetails: { ...prev.symptomDetails, [k]: v },
    }))
  const handleMedicalHistory = (k: keyof MedicalHistory, v: any) =>
    setForm((prev) => ({
      ...prev,
      medicalHistory: { ...prev.medicalHistory, [k]: v },
    }))

  const addToArray = (category: keyof MedicalHistory, item: string) => {
    if (item.trim()) {
      setForm((prev) => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [category]: [...(prev.medicalHistory[category] as string[]), item.trim()],
        },
      }))
    }
  }

  const removeFromArray = (category: keyof MedicalHistory, index: number) => {
    setForm((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [category]: (prev.medicalHistory[category] as string[]).filter((_, i) => i !== index),
      },
    }))
  }

  const toggleSymptomLocation = (location: string) => {
    setForm((prev) => ({
      ...prev,
      symptomDetails: {
        ...prev.symptomDetails,
        location: prev.symptomDetails.location.includes(location)
          ? prev.symptomDetails.location.filter((l) => l !== location)
          : [...prev.symptomDetails.location, location],
      },
    }))
  }

  const resetAssessment = () => {
    setAssessmentResults(null)
    setCurrentStep(1)
    setProgress(0)
    setForm({
      name: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
      primarySymptom: "",
      symptomDuration: "",
      symptomSeverity: "",
      symptomDetails: {
        location: [],
        triggers: [],
        reliefFactors: [],
        associatedSymptoms: [],
        timeOfDay: "",
        progression: "",
      },
      medicalHistory: {
        currentMedications: [],
        allergies: [],
        chronicConditions: [],
        previousSurgeries: [],
        familyHistory: [],
        smokingStatus: "",
        alcoholConsumption: "",
        exerciseFrequency: "",
        sleepHours: "",
      },
      vitals: {
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        temperature: "",
        oxygenSaturation: "",
        bloodSugar: "",
        respiratoryRate: "",
        bmi: "",
      },
      recentTravel: "",
      occupationalExposure: "",
      stressLevel: "",
      menstrualHistory: "",
    })
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleAssessmentSubmit = async () => {
    setAssessmentLoading(true)
    try {
      const comprehensivePrompt = `
Generate a comprehensive medical assessment based on the following patient data. The output MUST be a valid JSON object that conforms to the AIResponse interface structure provided below.

---PATIENT DATA---
${JSON.stringify(form, null, 2)}
---END PATIENT DATA---

---JSON STRUCTURE---
interface AIResponse {
  riskAssessment: {
    overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
    riskFactors: string[];
    urgencyLevel: string;
    followUpTimeframe: string;
  };
  medications: StructuredRecommendation[];
  diagnostics: StructuredRecommendation[];
  specialists: StructuredRecommendation[];
  lifestyle: StructuredRecommendation[];
  monitoring: StructuredRecommendation[];
  redFlags: string[];
  differentialDiagnosis: string[];
  patientEducation: string[];
  followUpPlan: {
    immediate: string[];
    oneWeek: string[];
    oneMonth: string[];
    threeMonths: string[];
  };
}

interface StructuredRecommendation {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Immediate' | 'Short-term' | 'Long-term';
  description: string;
  reasoning: string;
  timeframe: string;
  cost: 'Free' | 'Low' | 'Medium' | 'High';
  actionItems: string[];
}
---END JSON STRUCTURE---
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: comprehensivePrompt,
          type: "comprehensive-assessment",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.response && typeof data.response === "object") {
        setAssessmentResults(data.response as AIResponse)
      } else {
        throw new Error("Invalid response format from AI")
      }
    } catch (error) {
      console.error("Assessment error:", error)
      setAssessmentResults(getFallbackResponse())
    } finally {
      setAssessmentLoading(false)
    }
  }

  const getFallbackResponse = (): AIResponse => {
    return {
      riskAssessment: {
        overallRisk: "Medium",
        riskFactors: ["Symptom persistence", "Need for professional evaluation"],
        urgencyLevel: "Schedule appointment within 1-2 days",
        followUpTimeframe: "1 week",
      },
      medications: [
        {
          title: "Consult Healthcare Provider",
          priority: "High",
          category: "Immediate",
          description: "Professional evaluation needed for medication recommendations",
          reasoning: "AI service unavailable - medical professional consultation required",
          timeframe: "As soon as possible",
          cost: "Medium",
          actionItems: ["Schedule appointment", "Prepare symptom list", "Bring current medications"],
        },
      ],
      diagnostics: [],
      specialists: [],
      lifestyle: [],
      monitoring: [],
      redFlags: ["Worsening symptoms", "High fever", "Severe pain", "Breathing difficulties"],
      differentialDiagnosis: ["Professional evaluation required"],
      patientEducation: ["Seek professional medical advice", "Monitor symptoms closely"],
      followUpPlan: {
        immediate: ["Contact healthcare provider"],
        oneWeek: ["Follow up as directed"],
        oneMonth: ["Continue monitoring"],
        threeMonths: ["Regular health maintenance"],
      },
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "bg-red-500 text-white"
      case "High":
        return "bg-red-400 text-white"
      case "Medium":
        return "bg-yellow-400 text-black"
      case "Low":
        return "bg-green-400 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const exportResults = () => {
    const content = `
HEALTH ASSESSMENT RESULTS
Generated: ${new Date().toLocaleDateString()}

PATIENT: ${form.name}
AGE: ${form.age}
OVERALL RISK: ${assessmentResults?.riskAssessment.overallRisk}

IMMEDIATE ACTIONS:
${assessmentResults?.followUpPlan.immediate.map((item) => `• ${item}`).join("\n")}

MEDICATIONS:
${assessmentResults?.medications.map((med) => `• ${med.title}: ${med.description}`).join("\n")}

RED FLAGS TO WATCH FOR:
${assessmentResults?.redFlags.map((flag) => `• ${flag}`).join("\n")}

Generated by MyMed AI Health Assessment
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `health-assessment-${form.name}-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (assessmentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button onClick={resetAssessment} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-lg mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced AI Analysis in Progress</h3>
              <p className="text-gray-600 text-center mb-4">
                Our sophisticated AI is performing comprehensive analysis of your health data...
              </p>
              <div className="w-full max-w-xs">
                <Progress value={85} className="mb-2" />
                <p className="text-sm text-gray-500 text-center">Analyzing symptoms and generating recommendations</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <PoweredByFooter />
      </div>
    )
  }

  if (assessmentResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center space-x-2">
              <Button onClick={exportResults} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => window.print()} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button onClick={resetAssessment} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Risk Assessment Summary */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-500" />
                  Risk Assessment & Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Badge
                      className={`text-lg px-4 py-2 ${getRiskColor(assessmentResults.riskAssessment.overallRisk)}`}
                    >
                      {assessmentResults.riskAssessment.overallRisk} Risk
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">Overall Assessment</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Key Risk Factors:</h4>
                    <ul className="text-sm space-y-1">
                      {assessmentResults.riskAssessment.riskFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Next Steps:</h4>
                    <p className="text-sm text-gray-700">{assessmentResults.riskAssessment.urgencyLevel}</p>
                    <p className="text-sm text-gray-600">
                      Follow-up: {assessmentResults.riskAssessment.followUpTimeframe}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Red Flags Alert */}
            {assessmentResults.redFlags.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Important Warning Signs:</strong> Seek immediate medical attention if you experience:{" "}
                  {assessmentResults.redFlags.join(", ")}
                </AlertDescription>
              </Alert>
            )}

            {/* Structured Recommendations */}
            <Tabs defaultValue="immediate" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="immediate">Immediate</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="diagnostics">Tests</TabsTrigger>
                <TabsTrigger value="specialists">Specialists</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              </TabsList>

              <TabsContent value="immediate" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-red-500" />
                      Immediate Action Plan (Next 24-48 Hours)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResults.followUpPlan.immediate.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400"
                        >
                          <CheckCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <span className="text-red-900">{action}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Monitoring Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResults.monitoring.map((item, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{item.title}</h4>
                            <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{item.description}</p>
                          <div className="space-y-1">
                            {item.actionItems.map((action, actionIdx) => (
                              <div key={actionIdx} className="flex items-center gap-2 text-sm">
                                <ChevronRight className="h-3 w-3" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-green-500" />
                      Medication Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResults.medications.map((med, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{med.title}</h4>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(med.priority)}>{med.priority}</Badge>
                              <Badge variant="outline">{med.cost} cost</Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{med.description}</p>
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>Why:</strong> {med.reasoning}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Timeline:</strong> {med.timeframe}
                          </p>
                          <div className="bg-gray-50 rounded p-3">
                            <h5 className="font-medium mb-2">Action Items:</h5>
                            <ul className="space-y-1">
                              {med.actionItems.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagnostics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-purple-500" />
                      Diagnostic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResults.diagnostics.map((test, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{test.title}</h4>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(test.priority)}>{test.priority}</Badge>
                              <Badge variant="outline">{test.cost} cost</Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{test.description}</p>
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>Purpose:</strong> {test.reasoning}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Timeline:</strong> {test.timeframe}
                          </p>
                          <div className="bg-gray-50 rounded p-3">
                            <h5 className="font-medium mb-2">Preparation & Steps:</h5>
                            <ul className="space-y-1">
                              {test.actionItems.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-center gap-2 text-sm">
                                  <Info className="h-3 w-3 text-blue-500" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specialists" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Healthcare Provider Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResults.specialists.map((specialist, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{specialist.title}</h4>
                            <Badge className={getPriorityColor(specialist.priority)}>{specialist.priority}</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{specialist.description}</p>
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>Why this specialist:</strong> {specialist.reasoning}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Timeframe:</strong> {specialist.timeframe}
                          </p>
                          <div className="bg-gray-50 rounded p-3">
                            <h5 className="font-medium mb-2">How to Prepare:</h5>
                            <ul className="space-y-1">
                              {specialist.actionItems.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-3 w-3 text-blue-500" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Lifestyle & Wellness Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessmentResults.lifestyle.map((lifestyle, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{lifestyle.title}</h4>
                            <Badge className={getPriorityColor(lifestyle.priority)}>{lifestyle.priority}</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{lifestyle.description}</p>
                          <p className="text-sm text-blue-600 mb-2">
                            <strong>Benefits:</strong> {lifestyle.reasoning}
                          </p>
                          <p className="text-sm text-gray-600 mb-3">
                            <strong>Implementation:</strong> {lifestyle.timeframe}
                          </p>
                          <div className="bg-green-50 rounded p-3">
                            <h5 className="font-medium mb-2">Getting Started:</h5>
                            <ul className="space-y-1">
                              {lifestyle.actionItems.map((action, actionIdx) => (
                                <li key={actionIdx} className="flex items-center gap-2 text-sm">
                                  <Target className="h-3 w-3 text-green-500" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Follow-up Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Long-term Follow-up Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-700">1 Week Follow-up</h4>
                    <ul className="space-y-1">
                      {assessmentResults.followUpPlan.oneWeek.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-blue-700">1 Month Follow-up</h4>
                    <ul className="space-y-1">
                      {assessmentResults.followUpPlan.oneMonth.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-700">3 Month Follow-up</h4>
                    <ul className="space-y-1">
                      {assessmentResults.followUpPlan.threeMonths.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-orange-500" />
                    Possible Conditions to Consider
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessmentResults.differentialDiagnosis.map((diagnosis, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        {diagnosis}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-500" />
                    Patient Education Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessmentResults.patientEducation.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={resetAssessment} variant="outline" size="lg">
                Start New Assessment
              </Button>
              <Button onClick={exportResults} variant="outline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button onClick={() => window.print()} variant="outline" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                Print Report
              </Button>
              <Link href="/chat">
                <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
                  <Brain className="w-4 h-4 mr-2" />
                  Discuss with AI Doctor
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <NavigationButtons />
        <PoweredByFooter />
      </div>
    )
  }

  // Form Steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handle("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={form.age}
                    onChange={(e) => handle("age", e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={form.weight}
                    onChange={(e) => handle("weight", e.target.value)}
                    placeholder="Weight"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    value={form.height}
                    onChange={(e) => handle("height", e.target.value)}
                    placeholder="Height"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={form.gender} onValueChange={(v) => handle("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {form.vitals.bmi && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Calculated BMI: <strong>{form.vitals.bmi}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stress">Current Stress Level (1-10)</Label>
                  <Select value={form.stressLevel} onValueChange={(v) => handle("stressLevel", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate stress" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                          {i + 1} {i + 1 <= 3 ? "(Low)" : i + 1 <= 6 ? "(Moderate)" : "(High)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="travel">Recent Travel (last 2 weeks)</Label>
                  <Input
                    id="travel"
                    value={form.recentTravel}
                    onChange={(e) => handle("recentTravel", e.target.value)}
                    placeholder="Destinations or 'None'"
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupational Exposures</Label>
                  <Input
                    id="occupation"
                    value={form.occupationalExposure}
                    onChange={(e) => handle("occupationalExposure", e.target.value)}
                    placeholder="Chemicals, dust, etc."
                  />
                </div>
              </div>

              {form.gender === "female" && (
                <div>
                  <Label htmlFor="menstrual">Menstrual History</Label>
                  <Textarea
                    id="menstrual"
                    value={form.menstrualHistory}
                    onChange={(e) => handle("menstrualHistory", e.target.value)}
                    placeholder="Last menstrual period, cycle regularity, etc."
                    rows={2}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                Primary Health Concern
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="symptom">What is your primary health concern today? *</Label>
                <Textarea
                  id="symptom"
                  value={form.primarySymptom}
                  onChange={(e) => handle("primarySymptom", e.target.value)}
                  placeholder="Describe your main symptom or health concern in detail..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>How long have you been experiencing this? *</Label>
                  <Select value={form.symptomDuration} onValueChange={(v) => handle("symptomDuration", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rate the severity (1 = mild, 10 = severe) *</Label>
                  <Select value={form.symptomSeverity} onValueChange={(v) => handle("symptomSeverity", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity} {severity <= "3" ? "(Mild)" : severity <= "6" ? "(Moderate)" : "(Severe)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Where are you experiencing symptoms?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {symptomLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={location}
                        checked={form.symptomDetails.location.includes(location)}
                        onCheckedChange={() => toggleSymptomLocation(location)}
                      />
                      <Label htmlFor={location} className="text-sm">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Associated symptoms (check all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {associatedSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={form.symptomDetails.associatedSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleSymptomDetails("associatedSymptoms", [
                              ...form.symptomDetails.associatedSymptoms,
                              symptom,
                            ])
                          } else {
                            handleSymptomDetails(
                              "associatedSymptoms",
                              form.symptomDetails.associatedSymptoms.filter((s) => s !== symptom),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>What triggers or worsens symptoms?</Label>
                  <Select
                    value={form.symptomDetails.triggers.join(", ")}
                    onValueChange={(v) => handleSymptomDetails("triggers", [v])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select triggers" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTriggers.map((trigger) => (
                        <SelectItem key={trigger} value={trigger}>
                          {trigger}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>How have symptoms progressed?</Label>
                  <Select
                    value={form.symptomDetails.progression}
                    onValueChange={(v) => handleSymptomDetails("progression", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select progression" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="getting worse">Getting worse</SelectItem>
                      <SelectItem value="staying the same">Staying the same</SelectItem>
                      <SelectItem value="getting better">Getting better</SelectItem>
                      <SelectItem value="comes and goes">Comes and goes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="relief">What helps relieve the symptoms?</Label>
                <Textarea
                  id="relief"
                  value={form.symptomDetails.reliefFactors.join(", ")}
                  onChange={(e) => handleSymptomDetails("reliefFactors", e.target.value.split(", "))}
                  placeholder="Rest, medications, heat/cold, position changes, etc."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">Current Medications</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Enter medication name and dosage"
                  />
                  <Button
                    onClick={() => {
                      addToArray("currentMedications", newMedication)
                      setNewMedication("")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {form.medicalHistory.currentMedications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{med}</span>
                      <Button onClick={() => removeFromArray("currentMedications", idx)} variant="ghost" size="sm">
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Allergies</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Enter allergy (medication, food, environmental)"
                  />
                  <Button
                    onClick={() => {
                      addToArray("allergies", newAllergy)
                      setNewAllergy("")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {form.medicalHistory.allergies.map((allergy, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-red-50 p-2 rounded">
                      <span className="text-sm">{allergy}</span>
                      <Button onClick={() => removeFromArray("allergies", idx)} variant="ghost" size="sm">
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Smoking Status</Label>
                  <Select
                    value={form.medicalHistory.smokingStatus}
                    onValueChange={(v) => handleMedicalHistory("smokingStatus", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never smoked</SelectItem>
                      <SelectItem value="former">Former smoker</SelectItem>
                      <SelectItem value="current">Current smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Alcohol Consumption</Label>
                  <Select
                    value={form.medicalHistory.alcoholConsumption}
                    onValueChange={(v) => handleMedicalHistory("alcoholConsumption", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                      <SelectItem value="heavy">Heavy (&gt;7 drinks/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Exercise Frequency</Label>
                  <Select
                    value={form.medicalHistory.exerciseFrequency}
                    onValueChange={(v) => handleMedicalHistory("exerciseFrequency", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="1-2">1-2 times/week</SelectItem>
                      <SelectItem value="3-4">3-4 times/week</SelectItem>
                      <SelectItem value="5+">5+ times/week</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Average Sleep Hours</Label>
                  <Input
                    type="number"
                    value={form.medicalHistory.sleepHours}
                    onChange={(e) => handleMedicalHistory("sleepHours", e.target.value)}
                    placeholder="Hours per night"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="chronic">Chronic Medical Conditions</Label>
                <Textarea
                  id="chronic"
                  value={form.medicalHistory.chronicConditions.join(", ")}
                  onChange={(e) =>
                    handleMedicalHistory(
                      "chronicConditions",
                      e.target.value.split(", ").filter((item) => item.trim()),
                    )
                  }
                  placeholder="Diabetes, hypertension, asthma, etc. (separate with commas)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="family">Family Medical History</Label>
                <Textarea
                  id="family"
                  value={form.medicalHistory.familyHistory.join(", ")}
                  onChange={(e) =>
                    handleMedicalHistory(
                      "familyHistory",
                      e.target.value.split(", ").filter((item) => item.trim()),
                    )
                  }
                  placeholder="Heart disease, cancer, diabetes in family members (separate with commas)"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-green-500" />
                Vital Signs & Measurements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Please provide your current vital signs if available. Leave blank if unknown. These help provide more
                  accurate recommendations.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Blood Pressure (Systolic)</Label>
                  <Input
                    type="number"
                    value={form.vitals.bloodPressureSystolic}
                    onChange={(e) => handleVitals("bloodPressureSystolic", e.target.value)}
                    placeholder="e.g., 120"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 90-120 mmHg</p>
                </div>
                <div>
                  <Label>Blood Pressure (Diastolic)</Label>
                  <Input
                    type="number"
                    value={form.vitals.bloodPressureDiastolic}
                    onChange={(e) => handleVitals("bloodPressureDiastolic", e.target.value)}
                    placeholder="e.g., 80"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 60-80 mmHg</p>
                </div>
                <div>
                  <Label>Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    value={form.vitals.heartRate}
                    onChange={(e) => handleVitals("heartRate", e.target.value)}
                    placeholder="e.g., 72"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
                </div>
                <div>
                  <Label>Respiratory Rate (breaths/min)</Label>
                  <Input
                    type="number"
                    value={form.vitals.respiratoryRate}
                    onChange={(e) => handleVitals("respiratoryRate", e.target.value)}
                    placeholder="e.g., 16"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 12-20 breaths/min</p>
                </div>
                <div>
                  <Label>Temperature (°F)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.vitals.temperature}
                    onChange={(e) => handleVitals("temperature", e.target.value)}
                    placeholder="e.g., 98.6"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 97.8-99.1°F</p>
                </div>
                <div>
                  <Label>Oxygen Saturation (%)</Label>
                  <Input
                    type="number"
                    value={form.vitals.oxygenSaturation}
                    onChange={(e) => handleVitals("oxygenSaturation", e.target.value)}
                    placeholder="e.g., 98"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal: 95-100%</p>
                </div>
                <div>
                  <Label>Blood Sugar (mg/dL)</Label>
                  <Input
                    type="number"
                    value={form.vitals.bloodSugar}
                    onChange={(e) => handleVitals("bloodSugar", e.target.value)}
                    placeholder="e.g., 100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal fasting: 70-100 mg/dL</p>
                </div>
                <div>
                  <Label>BMI (calculated)</Label>
                  <Input value={form.vitals.bmi} disabled placeholder="Auto-calculated" />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.vitals.bmi && (
                      <>
                        {Number.parseFloat(form.vitals.bmi) < 18.5
                          ? "Underweight"
                          : Number.parseFloat(form.vitals.bmi) < 25
                            ? "Normal weight"
                            : Number.parseFloat(form.vitals.bmi) < 30
                              ? "Overweight"
                              : "Obese"}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Please review your information below. Your data will be analyzed by our advanced AI system to provide
                  personalized health recommendations.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Name:</strong> {form.name}
                  </div>
                  <div>
                    <strong>Age:</strong> {form.age}
                  </div>
                  <div>
                    <strong>BMI:</strong> {form.vitals.bmi}
                  </div>
                  <div>
                    <strong>Primary Concern:</strong> {form.primarySymptom.substring(0, 50)}...
                  </div>
                </div>

                <Separator />

                <div className="text-sm">
                  <strong>Symptom Details:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Duration: {form.symptomDuration}</li>
                    <li>Severity: {form.symptomSeverity}/10</li>
                    <li>Locations: {form.symptomDetails.location.join(", ") || "Not specified"}</li>
                    <li>
                      Associated symptoms: {form.symptomDetails.associatedSymptoms.join(", ") || "None specified"}
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="text-sm">
                  <strong>Medical History Summary:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Current medications: {form.medicalHistory.currentMedications.length} listed</li>
                    <li>Known allergies: {form.medicalHistory.allergies.length} listed</li>
                    <li>Smoking: {form.medicalHistory.smokingStatus || "Not specified"}</li>
                    <li>Exercise: {form.medicalHistory.exerciseFrequency || "Not specified"}</li>
                  </ul>
                </div>

                {(form.vitals.bloodPressureSystolic || form.vitals.heartRate || form.vitals.temperature) && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <strong>Vital Signs Provided:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {form.vitals.bloodPressureSystolic && (
                          <li>
                            Blood Pressure: {form.vitals.bloodPressureSystolic}/{form.vitals.bloodPressureDiastolic}
                          </li>
                        )}
                        {form.vitals.heartRate && <li>Heart Rate: {form.vitals.heartRate} bpm</li>}
                        {form.vitals.temperature && <li>Temperature: {form.vitals.temperature}°F</li>}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Important:</strong> This AI assessment is for informational purposes only and does not replace
                  professional medical advice. Always consult with a healthcare provider for medical decisions.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button
                  onClick={handleAssessmentSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg"
                  disabled={!form.name || !form.primarySymptom || !form.age}
                >
                  Generate Comprehensive AI Assessment
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={resetAssessment} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Advanced Health Assessment</h2>
              <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Basic Info</span>
              <span>Symptoms</span>
              <span>History</span>
              <span>Vitals</span>
              <span>Review</span>
            </div>
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button onClick={prevStep} variant="outline" disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={nextStep} disabled={currentStep === 5} className="bg-blue-600 hover:bg-blue-700">
              Next Step
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
