"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import AISafetyMonitor from "@/components/ai-safety-monitor"
import MedicalDisclaimer from "@/components/medical-disclaimer"
import AIAccuracyTracker from "@/components/ai-accuracy-tracker"
import {
  Shield,
  Brain,
  CheckCircle,
  Activity,
  Stethoscope,
  Phone,
  Target,
  TrendingUp,
  Sparkles,
  Info,
} from "lucide-react"

interface AssessmentData {
  symptoms: string
  duration: string
  severity: number
  medicalHistory: string
  currentMedications: string
  age: number
  gender: string
  location: string
}

interface AIResponse {
  id: string
  content: string
  type: "diagnosis" | "medication" | "lifestyle" | "emergency" | "general"
  confidence: number
  timestamp: string
}

export default function SafeAIAssessmentPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    symptoms: "",
    duration: "",
    severity: 5,
    medicalHistory: "",
    currentMedications: "",
    age: 0,
    gender: "",
    location: "",
  })
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [safetyAssessment, setSafetyAssessment] = useState<any>(null)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [showSafetyDetails, setShowSafetyDetails] = useState(false)
  const [assessmentStep, setAssessmentStep] = useState(0)

  const steps = [
    { title: "Medical Disclaimer", icon: Shield },
    { title: "Health Assessment", icon: Activity },
    { title: "AI Analysis", icon: Brain },
    { title: "Safety Review", icon: CheckCircle },
  ]

  const generateAIResponse = async () => {
    if (!disclaimerAccepted) {
      alert("Please accept the medical disclaimer first")
      return
    }

    setIsAnalyzing(true)
    try {
      // Simulate AI analysis (in real app, this would call your AI service)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResponse: AIResponse = {
        id: `assessment_${Date.now()}`,
        content: `Based on your symptoms of ${assessmentData.symptoms} lasting ${assessmentData.duration} with severity ${assessmentData.severity}/10, here are my recommendations:

**Immediate Care:**
- Monitor symptoms closely
- Stay hydrated and get adequate rest
- Consider over-the-counter pain relief if appropriate

**Medication Suggestions:**
- Paracetamol 500mg every 6 hours for pain/fever
- Adequate fluid intake (8-10 glasses water daily)

**When to Seek Medical Care:**
- If symptoms worsen or persist beyond 3 days
- If fever exceeds 102°F (38.9°C)
- If you experience difficulty breathing or chest pain

**Lifestyle Recommendations:**
- Maintain regular sleep schedule
- Avoid strenuous activities until symptoms improve
- Consider gentle stretching or light walking if tolerated`,
        type: assessmentData.symptoms.toLowerCase().includes("chest")
          ? "emergency"
          : assessmentData.symptoms.toLowerCase().includes("pain")
            ? "medication"
            : "general",
        confidence: 75,
        timestamp: new Date().toISOString(),
      }

      setAiResponse(mockResponse)
      setAssessmentStep(2)
    } catch (error) {
      console.error("AI analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSafetyAssessment = (assessment: any) => {
    setSafetyAssessment(assessment)
    if (assessment.safetyLevel !== "emergency") {
      setAssessmentStep(3)
    }
  }

  const renderDisclaimerStep = () => (
    <div className="space-y-6">
      <MedicalDisclaimer
        type="general"
        severity="high"
        showDetailed={true}
        mandatory={true}
        onAccept={() => {
          setDisclaimerAccepted(true)
          setAssessmentStep(1)
        }}
        onDecline={() => {
          alert("Medical disclaimer must be accepted to continue")
        }}
      />
    </div>
  )

  const renderAssessmentStep = () => (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="font-semibold mb-1">Safe AI Assessment</div>
          <div className="text-sm">
            This assessment includes built-in safety measures, confidence monitoring, and emergency detection.
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="symptoms">Current Symptoms *</Label>
          <Textarea
            id="symptoms"
            placeholder="Describe your symptoms in detail..."
            value={assessmentData.symptoms}
            onChange={(e) => setAssessmentData({ ...assessmentData, symptoms: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g., 2 days, 1 week"
              value={assessmentData.duration}
              onChange={(e) => setAssessmentData({ ...assessmentData, duration: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity (1-10)</Label>
            <div className="space-y-2">
              <Input
                id="severity"
                type="range"
                min="1"
                max="10"
                value={assessmentData.severity}
                onChange={(e) => setAssessmentData({ ...assessmentData, severity: Number.parseInt(e.target.value) })}
              />
              <div className="text-center text-sm text-gray-600">Current: {assessmentData.severity}/10</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Your age"
            value={assessmentData.age || ""}
            onChange={(e) => setAssessmentData({ ...assessmentData, age: Number.parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            placeholder="Male/Female/Other"
            value={assessmentData.gender}
            onChange={(e) => setAssessmentData({ ...assessmentData, gender: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State"
            value={assessmentData.location}
            onChange={(e) => setAssessmentData({ ...assessmentData, location: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalHistory">Medical History</Label>
        <Textarea
          id="medicalHistory"
          placeholder="Any relevant medical conditions, past surgeries, etc."
          value={assessmentData.medicalHistory}
          onChange={(e) => setAssessmentData({ ...assessmentData, medicalHistory: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          placeholder="List any medications you're currently taking"
          value={assessmentData.currentMedications}
          onChange={(e) => setAssessmentData({ ...assessmentData, currentMedications: e.target.value })}
          rows={3}
        />
      </div>

      <Button
        onClick={generateAIResponse}
        disabled={!assessmentData.symptoms || isAnalyzing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Brain className="w-5 h-5 mr-2 animate-pulse" />
            AI Analysis in Progress...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Start Safe AI Analysis
          </>
        )}
      </Button>
    </div>
  )

  const renderAIAnalysisStep = () => (
    <div className="space-y-6">
      {aiResponse && (
        <>
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-green-600" />
                AI Health Analysis
                <Badge variant="outline" className="ml-2 text-green-600 border-green-200">
                  Confidence: {aiResponse.confidence}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line">{aiResponse.content}</div>
              </div>
            </CardContent>
          </Card>

          <AISafetyMonitor
            aiResponse={aiResponse.content}
            userInput={`${assessmentData.symptoms} ${assessmentData.duration} severity:${assessmentData.severity}`}
            context="health_assessment"
            responseType={aiResponse.type}
            userProfile={{
              age: assessmentData.age,
              gender: assessmentData.gender,
              medicalHistory: assessmentData.medicalHistory
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              currentMedications: assessmentData.currentMedications
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }}
            onSafetyAssessment={handleSafetyAssessment}
          />
        </>
      )}
    </div>
  )

  const renderSafetyReviewStep = () => (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="font-semibold mb-1">Safety Review Complete</div>
          <div className="text-sm">Your AI health assessment has passed all safety checks and is ready for review.</div>
        </AlertDescription>
      </Alert>

      {aiResponse && (
        <AIAccuracyTracker
          recommendationId={aiResponse.id}
          recommendation={aiResponse.content}
          category={aiResponse.type}
          userProfile={{
            age: assessmentData.age,
            gender: assessmentData.gender,
            location: assessmentData.location,
            medicalHistory: assessmentData.medicalHistory
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }}
          onFeedbackSubmitted={(feedback) => {
            console.log("Feedback submitted:", feedback)
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="bg-transparent">
          <Stethoscope className="w-4 h-4 mr-2" />
          Book Doctor Consultation
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Phone className="w-4 h-4 mr-2" />
          Telemedicine Consultation
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Activity className="w-4 h-4 mr-2" />
          Track Symptoms
        </Button>
        <Button variant="outline" className="bg-transparent">
          <Target className="w-4 h-4 mr-2" />
          Set Health Goals
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Safe AI Health Assessment</h1>
          <p className="text-gray-600 mb-4">
            AI-powered health analysis with built-in safety measures and emergency detection
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Safety Monitored
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Emergency Detection
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              Accuracy Tracking
            </Badge>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${
                    index === assessmentStep
                      ? "text-blue-600"
                      : index < assessmentStep
                        ? "text-green-600"
                        : "text-gray-400"
                  }`}
                >
                  {React.createElement(step.icon, { className: "w-5 h-5" })}
                  <span className="text-sm font-medium hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={(assessmentStep / (steps.length - 1)) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(steps[assessmentStep].icon, { className: "w-6 h-6 mr-2 text-blue-600" })}
              {steps[assessmentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessmentStep === 0 && renderDisclaimerStep()}
            {assessmentStep === 1 && renderAssessmentStep()}
            {assessmentStep === 2 && renderAIAnalysisStep()}
            {assessmentStep === 3 && renderSafetyReviewStep()}
          </CardContent>
        </Card>

        {/* Safety Information */}
        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="text-sm space-y-1">
              <div className="font-semibold">AI Safety Features Active:</div>
              <div>• Confidence monitoring with human review triggers</div>
              <div>• Emergency symptom detection and immediate alerts</div>
              <div>• Automatic medical disclaimers for all recommendations</div>
              <div>• Continuous accuracy tracking and improvement</div>
              <div>• Integration with latest Indian medical guidelines</div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
