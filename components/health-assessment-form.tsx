"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Activity, Pill, Utensils, Dumbbell, AlertCircle, CheckCircle } from "lucide-react"
import MyMedLogo from "./mymed-logo"

interface AssessmentData {
  name: string
  age: string
  gender: string
  symptoms: string
  duration: string
  severity: string
  medications: string
  allergies: string
  familyHistory: string
  lifestyle: string
}

interface AIResponse {
  medications: string
  doctors: string
  labs: string
  pharmacy: string
  dietPlan: string
  exercise: string
  generalAdvice: string
}

export default function HealthAssessmentForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AIResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AssessmentData>({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    duration: "",
    severity: "",
    medications: "",
    allergies: "",
    familyHistory: "",
    lifestyle: "",
  })

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const assessmentPrompt = `
Please provide a comprehensive health assessment for the following patient:

PATIENT INFORMATION:
- Name: ${formData.name}
- Age: ${formData.age} years old
- Gender: ${formData.gender}

CURRENT CONDITION:
- Symptoms: ${formData.symptoms}
- Duration: ${formData.duration}
- Severity: ${formData.severity}

MEDICAL BACKGROUND:
- Current Medications: ${formData.medications || "None reported"}
- Known Allergies: ${formData.allergies || "None reported"}
- Family History: ${formData.familyHistory || "None reported"}
- Lifestyle: ${formData.lifestyle || "Not specified"}

Please provide detailed recommendations in the following categories:

1. MEDICATIONS: Suggest appropriate over-the-counter medications or treatments
2. HEALTHCARE PROVIDERS: Recommend which type of doctor or specialist to consult
3. LABORATORY TESTS: Suggest relevant tests that might be helpful
4. PHARMACY OPTIONS: Provide guidance on where to get medications
5. DIET PLAN: Create a personalized nutrition plan
6. EXERCISE RECOMMENDATIONS: Suggest appropriate physical activities
7. GENERAL HEALTH ADVICE: Provide overall wellness guidance

Please format your response clearly with specific, actionable recommendations for each category.
`

      console.log("Sending assessment request...")

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "assessment",
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("AI Response:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      // Handle both structured and text responses
      const aiResponse = data.response

      if (typeof aiResponse === "object" && aiResponse !== null) {
        // If response is already structured
        setResults({
          medications: aiResponse.medications || "Consult with a healthcare provider for appropriate medications.",
          doctors: aiResponse.doctors || "Schedule an appointment with your primary care physician.",
          labs: aiResponse.labs || "Basic blood work may be recommended by your doctor.",
          pharmacy: aiResponse.pharmacy || "Visit your local pharmacy for medications and consultations.",
          dietPlan: aiResponse.dietPlan || "Maintain a balanced diet with fruits and vegetables.",
          exercise: aiResponse.exercise || "Engage in regular moderate exercise as appropriate.",
          generalAdvice: aiResponse.generalAdvice || "Monitor symptoms and seek medical attention if they worsen.",
        })
      } else {
        // Parse text response
        const responseText = String(aiResponse)
        setResults({
          medications:
            extractSection(responseText, ["medication", "treatment", "drug"]) ||
            "• Consult with a healthcare provider for appropriate medications\n• Over-the-counter pain relievers may help with discomfort\n• Follow dosage instructions carefully",
          doctors:
            extractSection(responseText, ["doctor", "physician", "specialist", "healthcare"]) ||
            "• Primary Care Physician - for initial evaluation\n• Specialist consultation if symptoms persist\n• Emergency care if symptoms worsen rapidly",
          labs:
            extractSection(responseText, ["test", "lab", "blood", "screening"]) ||
            "• Complete Blood Count (CBC)\n• Basic Metabolic Panel\n• Additional tests as recommended by your doctor",
          pharmacy:
            extractSection(responseText, ["pharmacy", "medication", "prescription"]) ||
            "• Local pharmacy chains (CVS, Walgreens)\n• Generic alternatives available\n• Pharmacist consultation services",
          dietPlan:
            extractSection(responseText, ["diet", "nutrition", "food", "eat"]) ||
            "• Balanced diet with fruits and vegetables\n• Stay hydrated (8-10 glasses water daily)\n• Limit processed foods and sugar",
          exercise:
            extractSection(responseText, ["exercise", "activity", "physical", "fitness"]) ||
            "• 20-30 minutes walking daily\n• Light stretching or yoga\n• Avoid strenuous activity initially",
          generalAdvice:
            extractSection(responseText, ["advice", "recommendation", "general", "wellness"]) ||
            "• Monitor symptoms daily\n• Get adequate sleep (7-9 hours)\n• Seek immediate care if symptoms worsen\n• This assessment is not a substitute for professional medical advice",
        })
      }

      setStep(3)
    } catch (error) {
      console.error("Assessment error:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")

      // Provide comprehensive fallback results
      setResults({
        medications: `• Consult with a healthcare provider for appropriate medications based on your symptoms
• Over-the-counter pain relievers (acetaminophen, ibuprofen) may help with discomfort
• Follow all dosage instructions carefully
• Avoid medications you're allergic to`,
        doctors: `• Primary Care Physician - Schedule within 1-2 weeks for evaluation
• Urgent Care - If symptoms worsen or new symptoms develop
• Specialist referral may be needed based on your condition
• Emergency care if you experience severe symptoms`,
        labs: `• Complete Blood Count (CBC) - to check for infections or other issues
• Basic Metabolic Panel - kidney and liver function
• Additional tests as recommended by your healthcare provider
• Bring this assessment to your doctor appointment`,
        pharmacy: `• Local pharmacy chains (CVS, Walgreens, Rite Aid)
• Independent pharmacies in your area
• Generic medications available for cost savings
• Pharmacist consultation services available`,
        dietPlan: `• Balanced diet with plenty of fruits and vegetables
• Stay well hydrated (8-10 glasses of water daily)
• Limit processed foods, excess sugar, and alcohol
• Eat regular meals every 3-4 hours
• Consider anti-inflammatory foods if appropriate`,
        exercise: `• Light to moderate exercise as tolerated
• 20-30 minutes of walking daily
• Gentle stretching or yoga
• Avoid strenuous activities until symptoms improve
• Listen to your body and rest when needed`,
        generalAdvice: `• Monitor your symptoms daily and keep a health diary
• Get adequate sleep (7-9 hours per night)
• Manage stress through relaxation techniques
• Seek immediate medical attention if symptoms worsen significantly
• This AI assessment is not a substitute for professional medical advice
• Always consult with qualified healthcare providers for proper diagnosis and treatment`,
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const extractSection = (text: string, keywords: string[]): string => {
    const lines = text.split("\n")
    let section = ""
    let capturing = false
    let captureCount = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase()

      // Check if this line contains any of our keywords
      const hasKeyword = keywords.some((keyword) => line.includes(keyword.toLowerCase()))

      if (hasKeyword && (line.includes(":") || line.includes("."))) {
        capturing = true
        section = lines[i]
        captureCount = 0
        continue
      }

      if (capturing) {
        captureCount++
        // Stop capturing if we hit another section or after reasonable amount of content
        if (captureCount > 10 || (line.trim() !== "" && line.match(/^\d+\.|^[A-Z][A-Z\s]+:/))) {
          break
        }
        if (lines[i].trim() !== "") {
          section += "\n" + lines[i]
        }
      }
    }

    return section.trim()
  }

  const resetAssessment = () => {
    setStep(1)
    setResults(null)
    setError(null)
    setFormData({
      name: "",
      age: "",
      gender: "",
      symptoms: "",
      duration: "",
      severity: "",
      medications: "",
      allergies: "",
      familyHistory: "",
      lifestyle: "",
    })
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-center mb-6">
          <MyMedLogo size="lg" />
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-blue-200 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">🤖 AI Analysis in Progress</h3>
            <p className="text-gray-600 text-center max-w-md">
              Our revolutionary AI is analyzing your health information and generating personalized recommendations
              using advanced medical algorithms...
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span className="ml-2">Processing medical data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (results) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-center">
          <MyMedLogo size="lg" />
        </div>

        {error && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Note: Using fallback recommendations due to: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Your Personalized Health Assessment Results
            </CardTitle>
            <p className="text-gray-600 mt-2">
              AI-powered recommendations for {formData.name} • Generated on {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-red-100 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                    <Pill className="h-5 w-5" />💊 Medication Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{results.medications}</div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                    <User className="h-5 w-5" />
                    👨‍⚕️ Healthcare Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{results.doctors}</div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
                    <Activity className="h-5 w-5" />🔬 Recommended Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{results.labs}</div>
                </CardContent>
              </Card>

              <Card className="border-green-100 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                    <Utensils className="h-5 w-5" />
                    🍽️ Personalized Diet Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{results.dietPlan}</div>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-orange-700">
                    <Dumbbell className="h-5 w-5" />
                    🏃‍♂️ Exercise Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{results.exercise}</div>
                </CardContent>
              </Card>

              <Card className="border-indigo-100 bg-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-indigo-700">
                    <AlertCircle className="h-5 w-5" />💡 General Health Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {results.generalAdvice}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button onClick={resetAssessment} variant="outline" size="lg">
                🔄 Start New Assessment
              </Button>
              <Button onClick={() => window.print()} size="lg">
                🖨️ Print Results
              </Button>
              <Button
                onClick={() => {
                  const text = `Health Assessment Results for ${formData.name}\n\n${Object.entries(results)
                    .map(([key, value]) => `${key.toUpperCase()}:\n${value}\n\n`)
                    .join("")}`
                  navigator.clipboard.writeText(text)
                }}
                variant="secondary"
                size="lg"
              >
                📋 Copy to Clipboard
              </Button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                <strong>Important:</strong> This AI assessment is for informational purposes only and should not replace
                professional medical advice. Always consult with qualified healthcare providers for proper diagnosis and
                treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-center">
        <MyMedLogo size="lg" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">🚀 Revolutionary AI Health Assessment</CardTitle>
          <p className="text-center text-gray-600">
            Step {step} of 2 • Get personalized health recommendations powered by advanced AI
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-sm font-medium">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter your age"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender *
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your gender" />
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
                <Label htmlFor="symptoms" className="text-sm font-medium">
                  Current Symptoms *
                </Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  placeholder="Describe your current symptoms in detail (e.g., headache, fever, fatigue, pain location, etc.)"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration of Symptoms *
                  </Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How long have you had these symptoms?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less than 24 hours">Less than 24 hours</SelectItem>
                      <SelectItem value="1-2 days">1-2 days</SelectItem>
                      <SelectItem value="3-7 days">3-7 days</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="more than 3 months">More than 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity" className="text-sm font-medium">
                    Severity Level *
                  </Label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Rate the severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild (1-3/10)</SelectItem>
                      <SelectItem value="moderate">Moderate (4-6/10)</SelectItem>
                      <SelectItem value="severe">Severe (7-8/10)</SelectItem>
                      <SelectItem value="very severe">Very Severe (9-10/10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                size="lg"
                disabled={
                  !formData.name ||
                  !formData.age ||
                  !formData.gender ||
                  !formData.symptoms ||
                  !formData.duration ||
                  !formData.severity
                }
              >
                Continue to Medical History →
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="medications" className="text-sm font-medium">
                  Current Medications
                </Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange("medications", e.target.value)}
                  placeholder="List any medications you're currently taking (include dosage if known). Write 'None' if not taking any."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="allergies" className="text-sm font-medium">
                  Known Allergies
                </Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  placeholder="List any known allergies (medications, food, environmental). Write 'None' if no known allergies."
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="familyHistory" className="text-sm font-medium">
                  Family Medical History
                </Label>
                <Textarea
                  id="familyHistory"
                  value={formData.familyHistory}
                  onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                  placeholder="Any significant family medical history (diabetes, heart disease, cancer, etc.). Write 'None' if no significant history."
                  rows={2}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lifestyle" className="text-sm font-medium">
                  Lifestyle Information
                </Label>
                <Textarea
                  id="lifestyle"
                  value={formData.lifestyle}
                  onChange={(e) => handleInputChange("lifestyle", e.target.value)}
                  placeholder="Exercise habits, diet, smoking, alcohol consumption, sleep patterns, stress levels, occupation, etc."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1" size="lg">
                  ← Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  🚀 Generate AI Assessment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
