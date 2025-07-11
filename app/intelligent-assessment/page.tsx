"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIFormAssistant from "@/components/ai-form-assistant"
import VoiceMedicalInput from "@/components/voice-medical-input"
import { Brain, User, Heart, Languages, Sparkles, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface UserProfile {
  age: number
  gender: string
  location: string
  diet: "vegetarian" | "non-vegetarian" | "vegan"
  familyType: "nuclear" | "joint"
  economicStatus: "low" | "middle" | "high"
  language: string
}

interface AssessmentData {
  symptoms: string
  duration: string
  severity: number
  medications: string
  allergies: string
  medicalHistory: string
  lifestyle: string
}

export default function IntelligentAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 0,
    gender: "",
    location: "",
    diet: "vegetarian",
    familyType: "nuclear",
    economicStatus: "middle",
    language: "en-IN",
  })
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    symptoms: "",
    duration: "",
    severity: 5,
    medications: "",
    allergies: "",
    medicalHistory: "",
    lifestyle: "",
  })
  const [currentField, setCurrentField] = useState("")
  const [showAIAssistant, setShowAIAssistant] = useState(true)
  const [completionProgress, setCompletionProgress] = useState(0)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const steps = [
    {
      id: "profile",
      title: "Personal Profile",
      description: "Help AI understand your background for personalized recommendations",
      icon: User,
    },
    {
      id: "symptoms",
      title: "Symptoms & Health",
      description: "Describe your current health concerns with AI assistance",
      icon: Heart,
    },
    {
      id: "medical-history",
      title: "Medical Background",
      description: "Share your medical history for comprehensive analysis",
      icon: Brain,
    },
    {
      id: "review",
      title: "AI Review",
      description: "Review your information and get AI recommendations",
      icon: CheckCircle,
    },
  ]

  // Calculate completion progress
  useEffect(() => {
    const totalFields = Object.keys({ ...userProfile, ...assessmentData }).length
    const completedFields = Object.values({ ...userProfile, ...assessmentData }).filter(
      (value) => value !== "" && value !== 0,
    ).length
    setCompletionProgress(Math.round((completedFields / totalFields) * 100))
  }, [userProfile, assessmentData])

  // Validate current step
  const validateStep = (step: number): string[] => {
    const errors: string[] = []

    switch (step) {
      case 0: // Profile
        if (!userProfile.age || userProfile.age < 1) errors.push("Please enter your age")
        if (!userProfile.gender) errors.push("Please select your gender")
        if (!userProfile.location) errors.push("Please enter your location")
        break
      case 1: // Symptoms
        if (!assessmentData.symptoms.trim()) errors.push("Please describe your symptoms")
        if (!assessmentData.duration.trim()) errors.push("Please specify duration of symptoms")
        break
      case 2: // Medical History
        // Optional fields, no validation required
        break
    }

    return errors
  }

  const handleNext = () => {
    const errors = validateStep(currentStep)
    setValidationErrors(errors)

    if (errors.length === 0 && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setValidationErrors([])
    }
  }

  const handleVoiceInput = (result: any) => {
    if (result.structuredData) {
      const structured = result.structuredData
      if (structured.symptoms?.length > 0) {
        setAssessmentData((prev) => ({
          ...prev,
          symptoms: prev.symptoms + " " + structured.symptoms.join(", "),
        }))
      }
      if (structured.duration) {
        setAssessmentData((prev) => ({
          ...prev,
          duration: structured.duration,
        }))
      }
      if (structured.severity) {
        setAssessmentData((prev) => ({
          ...prev,
          severity: structured.severity,
        }))
      }
    } else {
      // Fallback to raw text
      setAssessmentData((prev) => ({
        ...prev,
        symptoms: prev.symptoms + " " + result.text,
      }))
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    if (currentField === "symptoms") {
      setAssessmentData((prev) => ({
        ...prev,
        symptoms: prev.symptoms + " " + suggestion,
      }))
    }
  }

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={userProfile.age || ""}
            onChange={(e) => setUserProfile({ ...userProfile, age: Number.parseInt(e.target.value) || 0 })}
            onFocus={() => setCurrentField("age")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={userProfile.gender}
            onValueChange={(value) => setUserProfile({ ...userProfile, gender: value })}
          >
            <SelectTrigger onFocus={() => setCurrentField("gender")}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (City, State) *</Label>
          <Input
            id="location"
            placeholder="e.g., Mumbai, Maharashtra"
            value={userProfile.location}
            onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
            onFocus={() => setCurrentField("location")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Preferred Language</Label>
          <Select
            value={userProfile.language}
            onValueChange={(value) => setUserProfile({ ...userProfile, language: value })}
          >
            <SelectTrigger onFocus={() => setCurrentField("language")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-IN">🇮🇳 English (India)</SelectItem>
              <SelectItem value="hi-IN">🇮🇳 हिंदी</SelectItem>
              <SelectItem value="ta-IN">🇮🇳 தமிழ்</SelectItem>
              <SelectItem value="te-IN">🇮🇳 తెలుగు</SelectItem>
              <SelectItem value="bn-IN">🇮🇳 বাংলা</SelectItem>
              <SelectItem value="mr-IN">🇮🇳 मराठी</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diet">Dietary Preference</Label>
          <Select
            value={userProfile.diet}
            onValueChange={(value: any) => setUserProfile({ ...userProfile, diet: value })}
          >
            <SelectTrigger onFocus={() => setCurrentField("diet")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">🥬 Vegetarian</SelectItem>
              <SelectItem value="non-vegetarian">🍖 Non-Vegetarian</SelectItem>
              <SelectItem value="vegan">🌱 Vegan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyType">Family Type</Label>
          <Select
            value={userProfile.familyType}
            onValueChange={(value: any) => setUserProfile({ ...userProfile, familyType: value })}
          >
            <SelectTrigger onFocus={() => setCurrentField("familyType")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nuclear">👨‍👩‍👧‍👦 Nuclear Family</SelectItem>
              <SelectItem value="joint">👪 Joint Family</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="economicStatus">Economic Status (for appropriate recommendations)</Label>
        <Select
          value={userProfile.economicStatus}
          onValueChange={(value: any) => setUserProfile({ ...userProfile, economicStatus: value })}
        >
          <SelectTrigger onFocus={() => setCurrentField("economicStatus")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">💰 Budget-conscious</SelectItem>
            <SelectItem value="middle">💰💰 Middle income</SelectItem>
            <SelectItem value="high">💰💰💰 Higher income</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderSymptomsStep = () => (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text Input</TabsTrigger>
          <TabsTrigger value="voice">Voice Input</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe what you're experiencing... (e.g., headache, fever, stomach pain)"
              value={assessmentData.symptoms}
              onChange={(e) => setAssessmentData({ ...assessmentData, symptoms: e.target.value })}
              onFocus={() => setCurrentField("symptoms")}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                placeholder="e.g., 3 days, 1 week, since morning"
                value={assessmentData.duration}
                onChange={(e) => setAssessmentData({ ...assessmentData, duration: e.target.value })}
                onFocus={() => setCurrentField("duration")}
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
                  onFocus={() => setCurrentField("severity")}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mild (1)</span>
                  <span className="font-semibold">Current: {assessmentData.severity}</span>
                  <span>Severe (10)</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <VoiceMedicalInput onVoiceResult={handleVoiceInput} currentLanguage={userProfile.language} />
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderMedicalHistoryStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            placeholder="List any medications you're currently taking..."
            value={assessmentData.medications}
            onChange={(e) => setAssessmentData({ ...assessmentData, medications: e.target.value })}
            onFocus={() => setCurrentField("medications")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Known Allergies</Label>
          <Textarea
            id="allergies"
            placeholder="List any known allergies to medications, foods, or other substances..."
            value={assessmentData.allergies}
            onChange={(e) => setAssessmentData({ ...assessmentData, allergies: e.target.value })}
            onFocus={() => setCurrentField("allergies")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalHistory">Medical History</Label>
          <Textarea
            id="medicalHistory"
            placeholder="Any past medical conditions, surgeries, or ongoing health issues..."
            value={assessmentData.medicalHistory}
            onChange={(e) => setAssessmentData({ ...assessmentData, medicalHistory: e.target.value })}
            onFocus={() => setCurrentField("medicalHistory")}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lifestyle">Lifestyle Information</Label>
          <Textarea
            id="lifestyle"
            placeholder="Exercise habits, sleep patterns, stress levels, work environment..."
            value={assessmentData.lifestyle}
            onChange={(e) => setAssessmentData({ ...assessmentData, lifestyle: e.target.value })}
            onFocus={() => setCurrentField("lifestyle")}
            rows={3}
          />
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Review your information below. AI will analyze this data to provide personalized health recommendations.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <User className="w-4 h-4 mr-2" />
              Personal Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Age:</strong> {userProfile.age} years
            </div>
            <div>
              <strong>Gender:</strong> {userProfile.gender}
            </div>
            <div>
              <strong>Location:</strong> {userProfile.location}
            </div>
            <div>
              <strong>Diet:</strong> {userProfile.diet}
            </div>
            <div>
              <strong>Family:</strong> {userProfile.familyType}
            </div>
            <div>
              <strong>Language:</strong> {userProfile.language}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Current Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Symptoms:</strong> {assessmentData.symptoms || "Not specified"}
            </div>
            <div>
              <strong>Duration:</strong> {assessmentData.duration || "Not specified"}
            </div>
            <div>
              <strong>Severity:</strong> {assessmentData.severity}/10
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Medical Background
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong>Current Medications:</strong> {assessmentData.medications || "None specified"}
          </div>
          <div>
            <strong>Allergies:</strong> {assessmentData.allergies || "None specified"}
          </div>
          <div>
            <strong>Medical History:</strong> {assessmentData.medicalHistory || "None specified"}
          </div>
          <div>
            <strong>Lifestyle:</strong> {assessmentData.lifestyle || "Not specified"}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          <Sparkles className="w-5 h-5 mr-2" />
          Generate AI Health Assessment
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Intelligent Health Assessment</h1>
          <p className="text-gray-600 mb-4">AI-powered health analysis with cultural adaptation for Indian patients</p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Brain className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Languages className="w-3 h-3 mr-1" />
              Multi-language
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Culturally Adapted
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Assessment Progress</span>
              <span className="text-sm text-gray-600">{completionProgress}% Complete</span>
            </div>
            <Progress value={completionProgress} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Assessment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {React.createElement(steps[currentStep].icon, { className: "w-6 h-6 text-blue-600" })}
                    <div>
                      <CardTitle>{steps[currentStep].title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{steps[currentStep].description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <div className="font-semibold mb-1">Please fix the following:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Step Content */}
                {currentStep === 0 && renderProfileStep()}
                {currentStep === 1 && renderSymptomsStep()}
                {currentStep === 2 && renderMedicalHistoryStep()}
                {currentStep === 3 && renderReviewStep()}

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {currentStep === steps.length - 2 ? "Review" : "Next"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-4">
            {showAIAssistant && (
              <AIFormAssistant
                currentField={currentField}
                currentValue={
                  currentField === "symptoms"
                    ? assessmentData.symptoms
                    : currentField === "duration"
                      ? assessmentData.duration
                      : currentField === "medications"
                        ? assessmentData.medications
                        : ""
                }
                userProfile={userProfile}
                onVoiceInput={handleVoiceInput}
                onSuggestionSelect={handleSuggestionSelect}
              />
            )}

            {/* Step Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Assessment Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        index === currentStep
                          ? "bg-blue-100 border border-blue-200"
                          : index < currentStep
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => {
                        if (index < currentStep || validateStep(currentStep).length === 0) {
                          setCurrentStep(index)
                        }
                      }}
                    >
                      {React.createElement(step.icon, {
                        className: `w-4 h-4 ${
                          index === currentStep
                            ? "text-blue-600"
                            : index < currentStep
                              ? "text-green-600"
                              : "text-gray-400"
                        }`,
                      })}
                      <div className="flex-1">
                        <div className="text-sm font-medium">{step.title}</div>
                      </div>
                      {index < currentStep && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
