"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  User,
  Activity,
  Heart,
  Pill,
  Stethoscope,
  TestTube,
  ShoppingCart,
  Apple,
  Dumbbell,
  Bot,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react"

interface HealthAssessment {
  age: string
  gender: string
  weight: string
  height: string
  location: string
  symptoms: string
  symptomDuration: string
  symptomSeverity: string
  medicalHistory: string[]
  currentMedications: string
  allergies: string
  activityLevel: string
  dietType: string
  smokingStatus: string
  alcoholConsumption: string
  sleepHours: string
  primaryConcern: string
  additionalNotes: string
}

interface AIRecommendations {
  medications: string
  doctors: string
  labs: string
  pharmacy: string
  dietPlan: string
  exercise: string
  generalAdvice: string
}

export default function HealthAssessmentForm() {
  const [assessment, setAssessment] = useState<HealthAssessment>({
    age: "",
    gender: "",
    weight: "",
    height: "",
    location: "",
    symptoms: "",
    symptomDuration: "",
    symptomSeverity: "",
    medicalHistory: [],
    currentMedications: "",
    allergies: "",
    activityLevel: "",
    dietType: "",
    smokingStatus: "",
    alcoholConsumption: "",
    sleepHours: "",
    primaryConcern: "",
    additionalNotes: "",
  })

  const [recommendations, setRecommendations] = useState<AIRecommendations | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [aiProvider, setAiProvider] = useState<string | null>(null)

  const medicalConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Thyroid Issues",
    "Kidney Disease",
    "Liver Disease",
  ]

  const handleMedicalHistoryChange = (condition: string, checked: boolean) => {
    if (checked) {
      setAssessment((prev) => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, condition],
      }))
    } else {
      setAssessment((prev) => ({
        ...prev,
        medicalHistory: prev.medicalHistory.filter((c) => c !== condition),
      }))
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/health-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessment),
      })

      const data = await response.json()

      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations)
        setAiProvider(data.provider)
      } else {
        setError("Failed to get AI recommendations. Please try again.")
        if (data.recommendations) {
          setRecommendations(data.recommendations)
          setAiProvider(data.provider)
        }
      }
    } catch (error) {
      console.error("Assessment error:", error)
      setError("An error occurred while processing your assessment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderBadge = () => {
    if (!aiProvider) return null

    const providerConfig = {
      openai: { label: "OpenAI GPT-4", color: "bg-green-100 text-green-800", icon: Zap },
      gemini: { label: "Google Gemini", color: "bg-blue-100 text-blue-800", icon: Bot },
      stub: { label: "Demo Mode", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
    }

    const config = providerConfig[aiProvider as keyof typeof providerConfig]
    if (!config) return null

    const IconComponent = config.icon

    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatRecommendation = (text: string) => {
    return text
      .split("\n")
      .map((line, index) => {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith("•")) {
          return (
            <li key={index} className="ml-4 mb-2">
              {trimmedLine.substring(1).trim()}
            </li>
          )
        }
        return trimmedLine ? (
          <p key={index} className="mb-2">
            {trimmedLine}
          </p>
        ) : null
      })
      .filter(Boolean)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={assessment.age}
            onChange={(e) => setAssessment((prev) => ({ ...prev, age: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={assessment.gender}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, gender: value }))}
          >
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

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight in kg"
            value={assessment.weight}
            onChange={(e) => setAssessment((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="Enter height in cm"
            value={assessment.height}
            onChange={(e) => setAssessment((prev) => ({ ...prev, height: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location (City, State)</Label>
        <Input
          id="location"
          placeholder="e.g., Madanapalle, Andhra Pradesh"
          value={assessment.location}
          onChange={(e) => setAssessment((prev) => ({ ...prev, location: e.target.value }))}
        />
        <p className="text-xs text-gray-500 mt-1">This helps us suggest nearby doctors, labs, and pharmacies</p>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-blue-900">Current Symptoms</h3>
      </div>

      <div>
        <Label htmlFor="symptoms">Describe your symptoms</Label>
        <Textarea
          id="symptoms"
          placeholder="Please describe your current symptoms in detail..."
          value={assessment.symptoms}
          onChange={(e) => setAssessment((prev) => ({ ...prev, symptoms: e.target.value }))}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="symptomDuration">How long have you had these symptoms?</Label>
          <Select
            value={assessment.symptomDuration}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, symptomDuration: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less-than-day">Less than a day</SelectItem>
              <SelectItem value="1-3-days">1-3 days</SelectItem>
              <SelectItem value="4-7-days">4-7 days</SelectItem>
              <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
              <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
              <SelectItem value="more-than-month">More than a month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Symptom Severity</Label>
          <RadioGroup
            value={assessment.symptomSeverity}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, symptomSeverity: value }))}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mild" id="mild" />
              <Label htmlFor="mild">Mild</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Moderate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="severe" id="severe" />
              <Label htmlFor="severe">Severe</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <Label htmlFor="primaryConcern">What is your primary health concern?</Label>
        <Input
          id="primaryConcern"
          placeholder="e.g., Persistent headache, chest pain, etc."
          value={assessment.primaryConcern}
          onChange={(e) => setAssessment((prev) => ({ ...prev, primaryConcern: e.target.value }))}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-blue-900">Medical History</h3>
      </div>

      <div>
        <Label>Do you have any of these medical conditions?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {medicalConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={assessment.medicalHistory.includes(condition)}
                onCheckedChange={(checked) => handleMedicalHistoryChange(condition, checked as boolean)}
              />
              <Label htmlFor={condition} className="text-sm">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="currentMedications">Current Medications</Label>
        <Textarea
          id="currentMedications"
          placeholder="List any medications you're currently taking..."
          value={assessment.currentMedications}
          onChange={(e) => setAssessment((prev) => ({ ...prev, currentMedications: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          placeholder="List any known allergies (medications, food, environmental)..."
          value={assessment.allergies}
          onChange={(e) => setAssessment((prev) => ({ ...prev, allergies: e.target.value }))}
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Apple className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-blue-900">Lifestyle Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Activity Level</Label>
          <Select
            value={assessment.activityLevel}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, activityLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
              <SelectItem value="light">Light (1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (6-7 days/week)</SelectItem>
              <SelectItem value="very-active">Very Active (2x/day or intense)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Diet Type</Label>
          <Select
            value={assessment.dietType}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, dietType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Smoking Status</Label>
          <Select
            value={assessment.smokingStatus}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, smokingStatus: value }))}
          >
            <SelectTrigger>
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
          <Label>Alcohol Consumption</Label>
          <Select
            value={assessment.alcoholConsumption}
            onValueChange={(value) => setAssessment((prev) => ({ ...prev, alcoholConsumption: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alcohol consumption" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="sleepHours">Average Sleep Hours per Night</Label>
        <Input
          id="sleepHours"
          type="number"
          placeholder="e.g., 7"
          value={assessment.sleepHours}
          onChange={(e) => setAssessment((prev) => ({ ...prev, sleepHours: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          placeholder="Any additional information you'd like to share..."
          value={assessment.additionalNotes}
          onChange={(e) => setAssessment((prev) => ({ ...prev, additionalNotes: e.target.value }))}
        />
      </div>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-blue-900 mb-2">Your Health Recommendations</h3>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <p className="text-gray-600">AI-powered suggestions</p>
          {getProviderBadge()}
        </div>
        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-red-600" />
              <CardTitle className="text-lg">Medications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.medications || "")}</ul>
          </CardContent>
        </Card>

        <Card className="border-blue-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Doctors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.doctors || "")}</ul>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <TestTube className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Lab Tests</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.labs || "")}</ul>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Pharmacy</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.pharmacy || "")}</ul>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Apple className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Diet Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.dietPlan || "")}</ul>
          </CardContent>
        </Card>

        <Card className="border-pink-100">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-pink-600" />
              <CardTitle className="text-lg">Exercise</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.exercise || "")}</ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-indigo-100">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg">General Advice</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">{formatRecommendation(recommendations?.generalAdvice || "")}</ul>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> These are AI-generated suggestions for informational purposes only. Always
              consult qualified healthcare professionals before making medical decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={() => {
            setRecommendations(null)
            setCurrentStep(1)
            setError(null)
            setAiProvider(null)
            setAssessment({
              age: "",
              gender: "",
              weight: "",
              height: "",
              location: "",
              symptoms: "",
              symptomDuration: "",
              symptomSeverity: "",
              medicalHistory: [],
              currentMedications: "",
              allergies: "",
              activityLevel: "",
              dietType: "",
              smokingStatus: "",
              alcoholConsumption: "",
              sleepHours: "",
              primaryConcern: "",
              additionalNotes: "",
            })
          }}
          variant="outline"
          className="mr-4"
        >
          Start New Assessment
        </Button>
        <Button onClick={() => window.print()}>Print Recommendations</Button>
      </div>
    </div>
  )

  if (recommendations) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card>
          <CardContent className="p-6">{renderRecommendations()}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-blue-900">Health Assessment</CardTitle>
            <Badge className="bg-green-100 text-green-800">Step {currentStep} of 4</Badge>
          </div>
          <p className="text-gray-600">Get personalized AI recommendations in organized, easy-to-read format.</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button onClick={() => setCurrentStep((prev) => prev + 1)} className="bg-purple-600 hover:bg-purple-700">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Recommendations...
                  </>
                ) : (
                  "Get AI Recommendations"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
