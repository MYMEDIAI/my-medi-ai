"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Stethoscope, Heart, Activity, Brain, User, Calendar, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

interface AssessmentData {
  personalInfo: {
    age: string
    gender: string
    height: string
    weight: string
  }
  symptoms: string[]
  medicalHistory: string[]
  lifestyle: {
    exercise: string
    smoking: string
    alcohol: string
    sleep: string
  }
  currentSymptoms: string
  duration: string
  severity: string
}

interface AIResponse {
  riskScore: number
  riskLevel: string
  recommendations: string[]
  urgency: string
  followUp: string
}

export default function HealthAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    personalInfo: {
      age: "",
      gender: "",
      height: "",
      weight: "",
    },
    symptoms: [],
    medicalHistory: [],
    lifestyle: {
      exercise: "",
      smoking: "",
      alcohol: "",
      sleep: "",
    },
    currentSymptoms: "",
    duration: "",
    severity: "",
  })
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
    "Abdominal Pain",
    "Joint Pain",
    "Back Pain",
    "Skin Rash",
  ]

  const medicalConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Allergies",
    "Thyroid Issues",
    "Kidney Disease",
    "Liver Disease",
    "Cancer History",
    "Mental Health Issues",
    "Arthritis",
    "Osteoporosis",
  ]

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setAssessmentData((prev) => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter((s) => s !== symptom),
    }))
  }

  const handleMedicalHistoryChange = (condition: string, checked: boolean) => {
    setAssessmentData((prev) => ({
      ...prev,
      medicalHistory: checked
        ? [...prev.medicalHistory, condition]
        : prev.medicalHistory.filter((c) => c !== condition),
    }))
  }

  const handleSubmitAssessment = async () => {
    setIsLoading(true)
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    
    // Mock AI response based on assessment data
    const mockResponse: AIResponse = {
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: assessmentData.symptoms.length > 3 ? "Moderate" : "Low",
      recommendations: [
        "Consult with a healthcare professional within 7 days",
        "Monitor symptoms daily and keep a health diary",
        "Maintain a balanced diet rich in fruits and vegetables",
        "Get adequate sleep (7-8 hours per night)",
        "Stay hydrated and exercise regularly",
      ],
      urgency: assessmentData.severity === "severe" ? "High" : "Medium",
      followUp: "Schedule follow-up in 2 weeks",
    }
    
    setAiResponse(mockResponse)
    setIsLoading(false)
    setCurrentStep(6)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={assessmentData.personalInfo.age}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, age: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={assessmentData.personalInfo.gender}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, gender: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (cm)</label>
                  <Input
                    type="number"
                    placeholder="Enter height in cm"
                    value={assessmentData.personalInfo.height}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, height: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <Input
                    type="number"
                    placeholder="Enter weight in kg"
                    value={assessmentData.personalInfo.weight}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, weight: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Activity className="w-6 h-6 mr-3 text-red-600" />
                Current Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4">
                  Select all symptoms you are currently experiencing:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={assessmentData.symptoms.includes(symptom)}
                        onCheckedChange={(checked) =>
                          handleSymptomChange(symptom, checked as boolean)
                        }
                      />
                      <label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your symptoms in detail:
                </label>
                <Textarea
                  placeholder="Please describe your symptoms, when they started, and any patterns you've noticed..."
                  value={assessmentData.currentSymptoms}
                  onChange={(e) =>
                    setAssessmentData((prev) => ({
                      ...prev,
                      currentSymptoms: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Heart className="w-6 h-6 mr-3 text-purple-600" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-4">
                  Select any medical conditions you have or have had:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medicalConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={assessmentData.medicalHistory.includes(condition)}
                        onCheckedChange={(checked) =>
                          handleMedicalHistoryChange(condition, checked as boolean)
                        }
                      />
                      <label htmlFor={condition} className="text-sm">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Brain className="w-6 h-6 mr-3 text-green-600" />
                Lifestyle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Exercise Frequency</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={assessmentData.lifestyle.exercise}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, exercise: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">3-5 times per week</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Smoking Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={assessmentData.lifestyle.smoking}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, smoking: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select status</option>
                    <option value="never">Never smoked</option>
                    <option value="former">Former smoker</option>
                    <option value="current">Current smoker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Alcohol Consumption</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={assessmentData.lifestyle.alcohol}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, alcohol: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select frequency</option>
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sleep Hours</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={assessmentData.lifestyle.sleep}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        lifestyle: { ...prev.lifestyle, sleep: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select hours</option>
                    <option value="less-than-5">Less than 5 hours</option>
                    <option value="5-6">5-6 hours</option>
                    <option value="7-8">7-8 hours</option>
                    <option value="more-than-8">More than 8 hours</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Calendar className="w-6 h-6 mr-3 text-orange-600" />
                Symptom Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">How long have you had these symptoms?</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={assessmentData.duration}
                  onChange={(e) =>
                    setAssessmentData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                >
                  <option value="">Select duration</option>
                  <option value="less-than-day">Less than a day</option>
                  <option value="1-3-days">1-3 days</option>
                  <option value="1-week">About a week</option>
                  <option value="2-weeks">2 weeks</option>
                  <option value="1-month">About a month</option>
                  <option value="more-than-month">More than a month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">How would you rate the severity?</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={assessmentData.severity}
                  onChange={(e) =>
                    setAssessmentData((prev) => ({
                      ...prev,
                      severity: e.target.value,
                    }))
                  }
                >
                  <option value="">Select severity</option>
                  <option value="mild">Mild - Doesn't interfere with daily activities</option>
                  <option value="moderate">Moderate - Some interference with daily activities</option>
                  <option value="severe">Severe - Significantly affects daily activities</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Stethoscope className="w-6 h-6 mr-3 text-blue-600" />
                Your Health Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiResponse && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {aiResponse.riskScore}/100
                        </div>
                        <div className="text-sm text-blue-700">Health Score</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-xl font-bold text-green-600 mb-2">
                          {aiResponse.riskLevel}
                        </div>
                        <div className="text-sm text-green-700">Risk Level</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-xl font-bold text-orange-600 mb-2">
                          {aiResponse.urgency}
                        </div>
                        <div className="text-sm text-orange-700">Priority</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-800">
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {aiResponse.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                    <div>
                      <div className="font-semibold text-yellow-800">Important Note</div>
                      <div className="text-yellow-700 text-sm">
                        This assessment is for informational purposes only and should not replace professional medical advice.
                        Please consult with a healthcare provider for proper diagnosis and treatment.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analyzing Your Health Data</h3>
            <p className="text-gray-600 mb-4">
              Our AI is processing your assessment and generating personalized recommendations...
            </p>
            <Progress value={66} className="w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Health Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized health insights powered by AI. Complete this assessment to receive
            tailored recommendations for your wellbeing.
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep <= totalSteps && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Assessment Steps */}
        <div className="mb-8">{renderStep()}</div>

        {/* Navigation Buttons */}
        {currentStep <= totalSteps && (
          <div className="flex justify-center space-x-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitAssessment}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                Complete Assessment
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Results Navigation */}
        {currentStep === 6 && (
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1)
                setAiResponse(null)
                setAssessmentData({
                  personalInfo: { age: "", gender: "", height: "", weight: "" },
                  symptoms: [],
                  medicalHistory: [],
                  lifestyle: { exercise: "", smoking: "", alcohol: "", sleep: "" },
                  currentSymptoms: "",
                  duration: "",
                  severity: "",
                })
              }}
            >
              Take New Assessment
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Download Report
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
