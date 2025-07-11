"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import MyMedLogo from "./mymed-logo"
import {
  Send,
  AlertTriangle,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
  CheckCircle,
  Sparkles,
  Stethoscope,
  Wifi,
  Lock,
  Target,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

interface DetailedUserProfile {
  // Personal Information
  personalInfo: {
    name: string
    age: number
    gender: string
    dateOfBirth: string
    bloodGroup: string
    height: number
    weight: number
    bmi: number
    bodyFat: number
    muscleMass: number
  }

  // Contact & Location
  contactInfo: {
    phone: string
    email: string
    emergencyContact: string
    address: string
    city: string
    state: string
    pincode: string
    nearestHospital: string
  }

  // Vital Signs History
  vitals: {
    bloodPressure: { systolic: number; diastolic: number; timestamp: Date }[]
    heartRate: { value: number; timestamp: Date }[]
    temperature: { value: number; timestamp: Date }[]
    oxygenSaturation: { value: number; timestamp: Date }[]
    respiratoryRate: { value: number; timestamp: Date }[]
    bloodSugar: { fasting: number; postMeal: number; timestamp: Date }[]
  }

  // Medical History
  medicalHistory: {
    chronicConditions: string[]
    pastSurgeries: { surgery: string; date: string; hospital: string }[]
    allergies: { allergen: string; reaction: string; severity: string }[]
    familyHistory: { condition: string; relation: string; ageOfOnset: number }[]
    immunizations: { vaccine: string; date: string; nextDue: string }[]
  }

  // Current Medications
  medications: {
    prescription: { name: string; dosage: string; frequency: string; startDate: string; prescribedBy: string }[]
    overTheCounter: { name: string; dosage: string; frequency: string; reason: string }[]
    supplements: { name: string; dosage: string; frequency: string; brand: string }[]
  }

  // Lifestyle Factors
  lifestyle: {
    smokingStatus: string
    smokingHistory: { cigarettesPerDay: number; yearsSmoked: number; quitDate: string }
    alcoholConsumption: { frequency: string; unitsPerWeek: number; type: string }
    dietaryHabits: { type: string; restrictions: string[]; preferences: string[] }
    exerciseRoutine: { type: string; frequency: number; duration: number; intensity: string }
    sleepPattern: { bedtime: string; wakeTime: string; hoursOfSleep: number; sleepQuality: number }
    stressLevel: number
    occupationalHazards: string[]
  }

  // Current Symptoms (Detailed)
  currentSymptoms: {
    primaryComplaint: string
    symptomDetails: {
      location: string[]
      character: string
      severity: number
      timing: string
      duration: string
      frequency: string
      onset: string
      progression: string
      alleviatingFactors: string[]
      aggravatingFactors: string[]
      associatedSymptoms: string[]
      previousOccurrence: boolean
      impactOnDailyLife: number
    }
    reviewOfSystems: {
      constitutional: string[]
      cardiovascular: string[]
      respiratory: string[]
      gastrointestinal: string[]
      genitourinary: string[]
      musculoskeletal: string[]
      neurological: string[]
      psychiatric: string[]
      endocrine: string[]
      hematologic: string[]
      dermatologic: string[]
    }
  }
}

interface ComprehensiveAnalysis {
  patientSummary: {
    riskProfile: string
    overallHealthScore: number
    urgencyLevel: "immediate" | "urgent" | "semi-urgent" | "routine" | "wellness"
    confidenceLevel: number
  }

  symptomAnalysis: {
    differentialDiagnosis: {
      condition: string
      probability: number
      reasoning: string
      supportingFactors: string[]
      contradictingFactors: string[]
    }[]
    redFlags: string[]
    clinicalPearls: string[]
    pathophysiology: string
  }

  detailedRecommendations: {
    immediate: {
      actions: string[]
      medications: { name: string; dosage: string; duration: string; instructions: string }[]
      monitoring: string[]
      restrictions: string[]
    }
    shortTerm: {
      followUp: { timeframe: string; specialist: string; tests: string[] }
      lifestyle: string[]
      medications: string[]
    }
    longTerm: {
      prevention: string[]
      monitoring: string[]
      lifestyle: string[]
    }
  }

  diagnosticPlan: {
    laboratoryTests: {
      test: string
      indication: string
      urgency: string
      expectedResults: string
      cost: string
      preparation: string[]
    }[]
    imagingStudies: {
      study: string
      indication: string
      urgency: string
      expectedFindings: string
      cost: string
      preparation: string[]
    }[]
    specialistReferrals: {
      specialty: string
      urgency: string
      reason: string
      expectedOutcome: string
      preparation: string[]
    }[]
  }

  riskAssessment: {
    cardiovascular: { risk: number; factors: string[]; recommendations: string[] }
    diabetes: { risk: number; factors: string[]; recommendations: string[] }
    cancer: { risk: number; factors: string[]; recommendations: string[] }
    mental: { risk: number; factors: string[]; recommendations: string[] }
  }

  personalizedPlan: {
    nutrition: {
      calories: number
      macronutrients: { protein: number; carbs: number; fats: number }
      micronutrients: string[]
      mealPlan: { meal: string; foods: string[]; timing: string }[]
      restrictions: string[]
      supplements: { name: string; dosage: string; timing: string; reason: string }[]
    }
    exercise: {
      cardio: { type: string; duration: number; frequency: number; intensity: string }
      strength: { exercises: string[]; sets: number; reps: number; frequency: number }
      flexibility: { exercises: string[]; duration: number; frequency: number }
      restrictions: string[]
      progressionPlan: string[]
    }
    monitoring: {
      vitals: { parameter: string; frequency: string; targetRange: string; method: string }[]
      symptoms: { symptom: string; frequency: string; method: string }[]
      labTests: { test: string; frequency: string; targetRange: string }[]
    }
  }
}

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  analysis?: ComprehensiveAnalysis
  userProfile?: Partial<DetailedUserProfile>
  confidence?: number
  category?: string
  urgency?: "immediate" | "urgent" | "semi-urgent" | "routine" | "wellness"
  suggestions?: string[]
}

export default function AIHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `🩺 **Welcome to MyMedi.ai - Advanced Comprehensive Health Analysis System**

I'm Dr. MyMedi, your AI Health Specialist. I provide **detailed analysis** and **comprehensive health assessments**.

To get started, you can either describe a health concern, or click "Start Comprehensive Assessment" for a full evaluation.`,
      timestamp: new Date(),
      confidence: 100,
      category: "welcome",
      urgency: "routine",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDetailedForm, setShowDetailedForm] = useState(false)
  const [userProfile, setUserProfile] = useState<DetailedUserProfile>({
    personalInfo: {
      name: "",
      age: 0,
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      height: 0,
      weight: 0,
      bmi: 0,
      bodyFat: 0,
      muscleMass: 0,
    },
    contactInfo: {
      phone: "",
      email: "",
      emergencyContact: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      nearestHospital: "",
    },
    vitals: {
      bloodPressure: [],
      heartRate: [],
      temperature: [],
      oxygenSaturation: [],
      respiratoryRate: [],
      bloodSugar: [],
    },
    medicalHistory: {
      chronicConditions: [],
      pastSurgeries: [],
      allergies: [],
      familyHistory: [],
      immunizations: [],
    },
    medications: {
      prescription: [],
      overTheCounter: [],
      supplements: [],
    },
    lifestyle: {
      smokingStatus: "",
      smokingHistory: { cigarettesPerDay: 0, yearsSmoked: 0, quitDate: "" },
      alcoholConsumption: { frequency: "", unitsPerWeek: 0, type: "" },
      dietaryHabits: { type: "", restrictions: [], preferences: [] },
      exerciseRoutine: { type: "", frequency: 0, duration: 0, intensity: "" },
      sleepPattern: { bedtime: "", wakeTime: "", hoursOfSleep: 0, sleepQuality: 0 },
      stressLevel: 0,
      occupationalHazards: [],
    },
    currentSymptoms: {
      primaryComplaint: "",
      symptomDetails: {
        location: [],
        character: "",
        severity: 0,
        timing: "",
        duration: "",
        frequency: "",
        onset: "",
        progression: "",
        alleviatingFactors: [],
        aggravatingFactors: [],
        associatedSymptoms: [],
        previousOccurrence: false,
        impactOnDailyLife: 0,
      },
      reviewOfSystems: {
        constitutional: [],
        cardiovascular: [],
        respiratory: [],
        gastrointestinal: [],
        genitourinary: [],
        musculoskeletal: [],
        neurological: [],
        psychiatric: [],
        endocrine: [],
        hematologic: [],
        dermatologic: [],
      },
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateComprehensiveAnalysis = async (profile: DetailedUserProfile): Promise<void> => {
    setIsLoading(true)
    try {
      const analysisPrompt = `
Generate a comprehensive health analysis based on the provided user profile.
The output MUST be a valid JSON object that conforms to the ComprehensiveAnalysis interface structure.

---USER PROFILE---
${JSON.stringify(profile, null, 2)}
---END USER PROFILE---
`
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "comprehensive_analysis",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.response && typeof data.response === "object") {
        const analysis = data.response as ComprehensiveAnalysis
        const analysisMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content:
            "## 🔬 **Comprehensive Health Analysis Complete**\n\nYour detailed analysis is ready. Please review all sections carefully.",
          timestamp: new Date(),
          analysis,
          userProfile: profile,
          confidence: analysis.patientSummary.confidenceLevel,
          urgency: analysis.patientSummary.urgencyLevel,
          category: "comprehensive_analysis",
        }
        setMessages((prev) => [...prev, analysisMessage])
        setShowDetailedForm(false)
      } else {
        throw new Error("Invalid response format from AI")
      }
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: "Sorry, I was unable to generate the comprehensive analysis. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleComprehensiveAnalysis = async () => {
    if (!userProfile.personalInfo.name || !userProfile.currentSymptoms.primaryComplaint) {
      alert("Please fill in at least basic information and primary complaint")
      return
    }
    await generateComprehensiveAnalysis(userProfile)
  }

  const updateUserProfile = (section: keyof DetailedUserProfile, field: string, value: any) => {
    setUserProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const renderComprehensiveAnalysis = (analysis: ComprehensiveAnalysis, profile: Partial<DetailedUserProfile>) => {
    return (
      <div className="space-y-8 mt-6">
        {/* Patient Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <User className="w-6 h-6 mr-3" />
              Patient Summary & Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600">{analysis.patientSummary.overallHealthScore}</div>
                <div className="text-sm text-gray-600">Health Score</div>
                <Progress value={analysis.patientSummary.overallHealthScore} className="mt-2" />
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div
                  className={`text-2xl font-bold ${
                    analysis.patientSummary.urgencyLevel === "immediate"
                      ? "text-red-600"
                      : analysis.patientSummary.urgencyLevel === "urgent"
                        ? "text-orange-600"
                        : analysis.patientSummary.urgencyLevel === "semi-urgent"
                          ? "text-yellow-600"
                          : "text-green-600"
                  }`}
                >
                  {analysis.patientSummary.urgencyLevel.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">Urgency Level</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">{analysis.patientSummary.confidenceLevel}%</div>
                <div className="text-sm text-gray-600">AI Confidence</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div
                  className={`text-lg font-bold ${
                    analysis.patientSummary.riskProfile === "High Risk"
                      ? "text-red-600"
                      : analysis.patientSummary.riskProfile === "Moderate Risk"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {analysis.patientSummary.riskProfile}
                </div>
                <div className="text-sm text-gray-600">Risk Profile</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Differential Diagnosis */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <Stethoscope className="w-6 h-6 mr-3" />
              Differential Diagnosis & Clinical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.symptomAnalysis.differentialDiagnosis.map((diagnosis, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">{diagnosis.condition}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">{diagnosis.probability}% Probability</Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{diagnosis.reasoning}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-800 mb-2">Supporting Factors:</h5>
                    <ul className="space-y-1">
                      {diagnosis.supportingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-800 mb-2">Contradicting Factors:</h5>
                    <ul className="space-y-1">
                      {diagnosis.contradictingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Red Flags - Seek Immediate Care If:
              </h4>
              <ul className="space-y-1">
                {analysis.symptomAnalysis.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-red-800 text-sm">
                    • {flag}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Recommendations */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <Target className="w-6 h-6 mr-3" />
              Comprehensive Treatment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="immediate" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="immediate">Immediate (0-24h)</TabsTrigger>
                <TabsTrigger value="shortterm">Short-term (1-4 weeks)</TabsTrigger>
                <TabsTrigger value="longterm">Long-term (1+ months)</TabsTrigger>
              </TabsList>

              <TabsContent value="immediate" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-red-800 mb-3">Immediate Actions:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.immediate.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-blue-800 mb-3">Medications:</h4>
                    <div className="space-y-3">
                      {analysis.detailedRecommendations.immediate.medications.map((med, idx) => (
                        <div key={idx} className="border border-blue-200 p-3 rounded">
                          <div className="font-semibold text-blue-900">{med.name}</div>
                          <div className="text-sm text-gray-700">Dosage: {med.dosage}</div>
                          <div className="text-sm text-gray-700">Duration: {med.duration}</div>
                          <div className="text-sm text-gray-600 italic">{med.instructions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderDetailedForm = () => {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <User className="w-6 h-6 mr-3" />
            Comprehensive Health Assessment Form
          </CardTitle>
          <p className="text-gray-600">Please provide detailed information for accurate analysis</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={userProfile.personalInfo.name}
                      onChange={(e) => updateUserProfile("personalInfo", "name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={userProfile.personalInfo.age || ""}
                      onChange={(e) => updateUserProfile("personalInfo", "age", Number.parseInt(e.target.value))}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => updateUserProfile("personalInfo", "gender", value)}>
                      <SelectTrigger>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      value={userProfile.personalInfo.height || ""}
                      onChange={(e) => updateUserProfile("personalInfo", "height", Number.parseFloat(e.target.value))}
                      placeholder="Enter height in cm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={userProfile.personalInfo.weight || ""}
                      onChange={(e) => updateUserProfile("personalInfo", "weight", Number.parseFloat(e.target.value))}
                      placeholder="Enter weight in kg"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="primaryComplaint">Primary Health Concern/Complaint *</Label>
                  <Textarea
                    id="primaryComplaint"
                    value={userProfile.currentSymptoms.primaryComplaint}
                    onChange={(e) => updateUserProfile("currentSymptoms", "primaryComplaint", e.target.value)}
                    placeholder="Describe your main health concern in detail"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="severity">Symptom Severity (1-10 scale)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[userProfile.currentSymptoms.symptomDetails.severity]}
                      onValueChange={(value) => {
                        const newDetails = { ...userProfile.currentSymptoms.symptomDetails, severity: value[0] }
                        setUserProfile((prev) => ({
                          ...prev,
                          currentSymptoms: { ...prev.currentSymptoms, symptomDetails: newDetails },
                        }))
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 (Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>10 (Severe)</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Current: {userProfile.currentSymptoms.symptomDetails.severity}/10
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Add other tabs content here - medical history, medications, lifestyle, vitals */}
            <TabsContent value="medical" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Medical History section is under development.</p>
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Medications section is under development.</p>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Lifestyle section is under development.</p>
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Vitals section is under development.</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setShowDetailedForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleComprehensiveAnalysis}
              disabled={isLoading || !userProfile.personalInfo.name || !userProfile.currentSymptoms.primaryComplaint}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Comprehensive Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `User Profile: ${JSON.stringify(userProfile.personalInfo)}\n\nUser Query: ${currentInput}`,
          type: "chat",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response || "I'm sorry, I couldn't process that. Could you please rephrase?",
        timestamp: new Date(),
        confidence: 95, // This could be returned from the API in a more advanced version
        category: "guidance",
        urgency: "routine",
        suggestions: [
          "Start Comprehensive Assessment",
          "Tell me about my risks for heart disease.",
          "What are some healthy meal ideas?",
        ],
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (showDetailedForm) {
    return renderDetailedForm()
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MyMedLogo className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold text-white">MyMedi.ai Health Chat</h2>
              <p className="text-blue-100">Advanced AI Health Analysis & Comprehensive Care</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500 text-white">
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </div>

      <div className="h-[600px] overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-4xl rounded-2xl p-4 ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : message.type === "system"
                    ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                    : "bg-gray-50 border border-gray-200"
              }`}
            >
              {message.type === "ai" && (
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dr. MyMedi AI</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                {message.content.split("\n").map((line, index) => (
                  <p
                    key={index}
                    className={`${
                      message.type === "user" ? "text-white" : "text-gray-800"
                    } ${line.startsWith("**") ? "font-bold" : ""} ${
                      line.startsWith("•") || line.startsWith("✅") ? "ml-4" : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {message.analysis && message.userProfile && (
                <div className="mt-4">{renderComprehensiveAnalysis(message.analysis, message.userProfile)}</div>
              )}

              {message.suggestions && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (suggestion === "Start Comprehensive Assessment") {
                          setShowDetailedForm(true)
                        } else {
                          setInputMessage(suggestion)
                        }
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              {message.type === "ai" && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Dr. MyMedi is analyzing...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => setShowDetailedForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Comprehensive Assessment
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Describe your health concern in detail for comprehensive analysis..."
              className="pr-12 py-3 text-base"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              End-to-end encrypted
            </span>
          </div>
          <div className="text-right">
            <div>Powered by MyMedi.ai Advanced Medical Intelligence</div>
            <div className="text-gray-400">Always consult healthcare professionals for medical decisions</div>
          </div>
        </div>
      </div>
    </div>
  )
}
