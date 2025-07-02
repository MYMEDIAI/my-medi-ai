"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Activity, Pill, Utensils, Dumbbell, AlertCircle, CheckCircle } from "lucide-react"

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
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState<AIResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [patientData, setPatientData] = useState<AssessmentData>({
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

  const updateFormField = (field: keyof AssessmentData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  const generateAssessment = async () => {
    console.log("Starting AI assessment generation...")
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const healthAssessmentPrompt = `
COMPREHENSIVE HEALTH ASSESSMENT REQUEST

PATIENT INFORMATION:
- Name: ${patientData.name}
- Age: ${patientData.age} years old
- Gender: ${patientData.gender}

CURRENT SYMPTOMS:
- Primary Symptoms: ${patientData.symptoms}
- Duration: ${patientData.duration}
- Severity Level: ${patientData.severity}

MEDICAL BACKGROUND:
- Current Medications: ${patientData.medications || "None reported"}
- Known Allergies: ${patientData.allergies || "None reported"}
- Family Medical History: ${patientData.familyHistory || "None reported"}
- Lifestyle Factors: ${patientData.lifestyle || "Not specified"}

Please provide detailed, actionable recommendations in these specific categories:

1. MEDICATIONS & TREATMENTS:
Suggest appropriate over-the-counter medications, home remedies, or treatment approaches for the symptoms described.

2. HEALTHCARE PROVIDERS:
Recommend which type of doctor, specialist, or healthcare facility the patient should consult based on their symptoms.

3. DIAGNOSTIC TESTS:
Suggest relevant laboratory tests, imaging, or other diagnostic procedures that might be helpful for proper diagnosis.

4. PHARMACY & MEDICATION ACCESS:
Provide guidance on where to obtain medications, generic alternatives, and cost-saving options.

5. PERSONALIZED DIET PLAN:
Create specific dietary recommendations that could help with the symptoms or overall health improvement.

6. EXERCISE & PHYSICAL ACTIVITY:
Suggest appropriate physical activities, exercises, or movement therapies suitable for the patient's condition.

7. GENERAL WELLNESS ADVICE:
Provide comprehensive lifestyle recommendations, preventive measures, and general health guidance.

Please format your response with clear, specific, and actionable recommendations for each category.
`

      console.log("Sending request to AI API...")

      const apiResponse = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: healthAssessmentPrompt,
          type: "assessment",
        }),
      })

      console.log("API Response status:", apiResponse.status)

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error("API Error:", errorText)
        throw new Error(`API request failed: ${apiResponse.status}`)
      }

      const responseData = await apiResponse.json()
      console.log("AI Response data:", responseData)

      if (responseData.error) {
        throw new Error(responseData.error)
      }

      // Process the AI response
      const aiResponseText = responseData.response
      let finalResults: AIResponse

      if (typeof aiResponseText === "object" && aiResponseText !== null) {
        finalResults = {
          medications: aiResponseText.medications || createFallbackMedications(),
          doctors: aiResponseText.doctors || createFallbackDoctors(),
          labs: aiResponseText.labs || createFallbackLabs(),
          pharmacy: aiResponseText.pharmacy || createFallbackPharmacy(),
          dietPlan: aiResponseText.dietPlan || createFallbackDiet(),
          exercise: aiResponseText.exercise || createFallbackExercise(),
          generalAdvice: aiResponseText.generalAdvice || createFallbackAdvice(),
        }
      } else {
        const responseText = String(aiResponseText)
        finalResults = {
          medications:
            extractResponseSection(responseText, ["medication", "treatment", "drug", "remedy"]) ||
            createFallbackMedications(),
          doctors:
            extractResponseSection(responseText, ["doctor", "physician", "specialist", "healthcare"]) ||
            createFallbackDoctors(),
          labs:
            extractResponseSection(responseText, ["test", "lab", "blood", "screening", "diagnostic"]) ||
            createFallbackLabs(),
          pharmacy:
            extractResponseSection(responseText, ["pharmacy", "medication", "prescription"]) ||
            createFallbackPharmacy(),
          dietPlan:
            extractResponseSection(responseText, ["diet", "nutrition", "food", "eat", "meal"]) || createFallbackDiet(),
          exercise:
            extractResponseSection(responseText, ["exercise", "activity", "physical", "fitness"]) ||
            createFallbackExercise(),
          generalAdvice:
            extractResponseSection(responseText, ["advice", "recommendation", "general", "wellness"]) ||
            createFallbackAdvice(),
        }
      }

      console.log("Final processed results:", finalResults)
      setAssessmentResults(finalResults)
      setCurrentStep(3) // Move to results page
    } catch (error) {
      console.error("Assessment generation error:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")

      // Provide comprehensive fallback results
      setAssessmentResults({
        medications: createFallbackMedications(),
        doctors: createFallbackDoctors(),
        labs: createFallbackLabs(),
        pharmacy: createFallbackPharmacy(),
        dietPlan: createFallbackDiet(),
        exercise: createFallbackExercise(),
        generalAdvice: createFallbackAdvice(),
      })
      setCurrentStep(3) // Still move to results page with fallback data
    } finally {
      setIsLoading(false)
    }
  }

  const createFallbackMedications =
    () => `• Over-the-counter pain relievers (acetaminophen, ibuprofen) as needed for pain/fever
• Stay well hydrated with plenty of fluids throughout the day
• Get adequate rest and avoid strenuous activities
• Apply heat or cold therapy for localized pain relief
• Follow all dosage instructions carefully and read labels
• Consult pharmacist about drug interactions with current medications`

  const createFallbackDoctors = () => `• Primary Care Physician - Schedule appointment within 1-2 weeks for evaluation
• Urgent Care Center - If symptoms worsen quickly or new symptoms develop
• Specialist referral may be needed based on primary care evaluation
• Emergency care if experiencing severe symptoms or difficulty breathing
• Telemedicine consultation available for initial assessment and follow-up`

  const createFallbackLabs =
    () => `• Complete Blood Count (CBC) - Check for infections, anemia, or other blood disorders
• Basic Metabolic Panel - Assess kidney and liver function, electrolyte balance
• Inflammatory markers (ESR, CRP) if infection or inflammation suspected
• Thyroid function tests if experiencing fatigue or weight changes
• Additional specialized tests as recommended by healthcare provider`

  const createFallbackPharmacy = () => `• Local pharmacy chains (CVS, Walgreens, Rite Aid) for convenience
• Independent community pharmacies for personalized service
• Generic medications available for significant cost savings
• Pharmacy consultation services available for medication questions
• Online pharmacy options available with valid prescriptions
• GoodRx app or similar for medication discount coupons`

  const createFallbackDiet = () => `• Anti-inflammatory foods: fatty fish, berries, leafy greens, nuts
• Plenty of fresh fruits and vegetables daily (5-9 servings)
• Stay well hydrated with 8-10 glasses of water daily
• Limit processed foods, excess sugar, and refined carbohydrates
• Regular meal times every 3-4 hours to maintain energy
• Consider probiotics for digestive and immune health support`

  const createFallbackExercise = () => `• 20-30 minutes of moderate walking daily as tolerated
• Light stretching or gentle yoga to maintain flexibility
• Avoid high-impact or strenuous activities initially
• Listen to your body and rest when needed
• Gradual increase in activity level as symptoms improve
• Consider physical therapy if pain or mobility issues persist`

  const createFallbackAdvice = () => `• Monitor symptoms daily and keep a detailed health diary
• Get adequate sleep (7-9 hours nightly) for proper healing
• Manage stress through relaxation techniques, meditation, or counseling
• Avoid smoking and limit alcohol consumption
• Maintain good hygiene practices to prevent infections
• Seek immediate medical care if symptoms worsen significantly
• This assessment is not a substitute for professional medical advice
• Always consult qualified healthcare providers for proper diagnosis and treatment`

  const extractResponseSection = (text: string, keywords: string[]): string => {
    const textLines = text.split("\n")
    let extractedSection = ""
    let isCapturing = false
    let lineCount = 0

    for (let i = 0; i < textLines.length; i++) {
      const currentLine = textLines[i].toLowerCase()

      const containsKeyword = keywords.some((keyword) => currentLine.includes(keyword.toLowerCase()))

      if (containsKeyword && (currentLine.includes(":") || currentLine.includes("."))) {
        isCapturing = true
        extractedSection = textLines[i]
        lineCount = 0
        continue
      }

      if (isCapturing) {
        lineCount++
        if (lineCount > 8 || (currentLine.trim() !== "" && currentLine.match(/^\d+\.|^[A-Z][A-Z\s]+:/))) {
          break
        }
        if (textLines[i].trim() !== "") {
          extractedSection += "\n" + textLines[i]
        }
      }
    }

    return extractedSection.trim()
  }

  const resetAssessmentForm = () => {
    setCurrentStep(1)
    setAssessmentResults(null)
    setErrorMessage(null)
    setPatientData({
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

  // Loading Screen
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
              <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-blue-200 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">🤖 AI Assessment in Progress</h2>
            <p className="text-gray-600 text-center max-w-lg mb-6 text-lg">
              Our revolutionary AI is analyzing your comprehensive health information and generating personalized
              recommendations using advanced medical algorithms...
            </p>
            <div className="flex items-center gap-3 text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span className="ml-3 text-lg">Processing your medical data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results Page
  if (assessmentResults) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {errorMessage && (
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-yellow-800">
                <AlertCircle className="h-6 w-6" />
                <span className="font-medium text-lg">
                  Note: Using comprehensive fallback recommendations. {errorMessage}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-green-300 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader className="text-center py-8">
            <CardTitle className="flex items-center justify-center gap-4 text-4xl text-green-700">
              <CheckCircle className="h-10 w-10" />✅ Your Personalized Health Assessment Results
            </CardTitle>
            <p className="text-gray-600 mt-4 text-xl">
              AI-powered recommendations for <strong>{patientData.name}</strong> • Generated on{" "}
              {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-red-300 bg-red-50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-red-700">
                <Pill className="h-7 w-7" />💊 Medication Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                {assessmentResults.medications}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-300 bg-blue-50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-blue-700">
                <User className="h-7 w-7" />
                👨‍⚕️ Healthcare Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                {assessmentResults.doctors}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-300 bg-purple-50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-purple-700">
                <Activity className="h-7 w-7" />🔬 Recommended Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                {assessmentResults.labs}
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-300 bg-green-50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-700">
                <Utensils className="h-7 w-7" />
                🍽️ Personalized Diet Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                {assessmentResults.dietPlan}
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-300 bg-orange-50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-orange-700">
                <Dumbbell className="h-7 w-7" />
                🏃‍♂️ Exercise Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                {assessmentResults.exercise}
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-300 bg-indigo-50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-indigo-700">
                <AlertCircle className="h-7 w-7" />💡 General Health Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
                {assessmentResults.generalAdvice}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300">
          <CardContent className="pt-8">
            <div className="flex flex-wrap gap-6 justify-center">
              <Button
                onClick={resetAssessmentForm}
                variant="outline"
                size="lg"
                className="min-w-[220px] bg-white hover:bg-gray-50 text-lg py-3"
              >
                🔄 Start New Assessment
              </Button>
              <Button
                onClick={() => window.print()}
                size="lg"
                className="min-w-[220px] bg-blue-600 hover:bg-blue-700 text-lg py-3"
              >
                🖨️ Print Results
              </Button>
              <Button
                onClick={() => {
                  const assessmentText = `Health Assessment Results for ${patientData.name}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n${Object.entries(
                    assessmentResults,
                  )
                    .map(
                      ([key, value]) =>
                        `${key
                          .toUpperCase()
                          .replace(/([A-Z])/g, " $1")
                          .trim()}:\n${value}\n\n`,
                    )
                    .join("")}`
                  navigator.clipboard.writeText(assessmentText)
                  alert("Assessment results copied to clipboard!")
                }}
                variant="secondary"
                size="lg"
                className="min-w-[220px] text-lg py-3"
              >
                📋 Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-400">
          <CardContent className="pt-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-8 w-8 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-800 mb-3 text-xl">Important Medical Disclaimer</h3>
                <p className="text-yellow-700 leading-relaxed text-base">
                  This AI assessment is for informational purposes only and should not replace professional medical
                  advice, diagnosis, or treatment. Always consult with qualified healthcare providers for proper medical
                  evaluation and treatment decisions. In case of emergency, contact your local emergency services
                  immediately (dial 911 in the US or your local emergency number).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Form Steps (Only 2 steps now)
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card className="border-blue-300">
        <CardHeader className="text-center py-8">
          <CardTitle className="text-3xl text-blue-800">🚀 Revolutionary AI Health Assessment</CardTitle>
          <p className="text-gray-600 mt-3 text-lg">
            Step {currentStep} of 2 • Get personalized health recommendations powered by advanced AI
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-8 pb-8">
          {currentStep === 1 && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={patientData.name}
                    onChange={(e) => updateFormField("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2 border-gray-300 focus:border-blue-500 text-base py-3"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-base font-semibold text-gray-700">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={patientData.age}
                    onChange={(e) => updateFormField("age", e.target.value)}
                    placeholder="Enter your age"
                    className="mt-2 border-gray-300 focus:border-blue-500 text-base py-3"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender" className="text-base font-semibold text-gray-700">
                  Gender *
                </Label>
                <Select value={patientData.gender} onValueChange={(value) => updateFormField("gender", value)}>
                  <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500 text-base py-3">
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
                <Label htmlFor="symptoms" className="text-base font-semibold text-gray-700">
                  Current Symptoms *
                </Label>
                <Textarea
                  id="symptoms"
                  value={patientData.symptoms}
                  onChange={(e) => updateFormField("symptoms", e.target.value)}
                  placeholder="Describe your current symptoms in detail (e.g., headache, fever, fatigue, pain location, when it started, what makes it better or worse, etc.)"
                  rows={5}
                  className="mt-2 border-gray-300 focus:border-blue-500 text-base"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="duration" className="text-base font-semibold text-gray-700">
                    Duration of Symptoms *
                  </Label>
                  <Select value={patientData.duration} onValueChange={(value) => updateFormField("duration", value)}>
                    <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500 text-base py-3">
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
                  <Label htmlFor="severity" className="text-base font-semibold text-gray-700">
                    Severity Level *
                  </Label>
                  <Select value={patientData.severity} onValueChange={(value) => updateFormField("severity", value)}>
                    <SelectTrigger className="mt-2 border-gray-300 focus:border-blue-500 text-base py-3">
                      <SelectValue placeholder="Rate the severity (1-10 scale)" />
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
                onClick={() => setCurrentStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-4"
                size="lg"
                disabled={
                  !patientData.name ||
                  !patientData.age ||
                  !patientData.gender ||
                  !patientData.symptoms ||
                  !patientData.duration ||
                  !patientData.severity
                }
              >
                Continue to Medical History →
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <Label htmlFor="medications" className="text-base font-semibold text-gray-700">
                  Current Medications
                </Label>
                <Textarea
                  id="medications"
                  value={patientData.medications}
                  onChange={(e) => updateFormField("medications", e.target.value)}
                  placeholder="List any medications you're currently taking (include dosage if known). Write 'None' if not taking any medications."
                  rows={4}
                  className="mt-2 border-gray-300 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label htmlFor="allergies" className="text-base font-semibold text-gray-700">
                  Known Allergies
                </Label>
                <Textarea
                  id="allergies"
                  value={patientData.allergies}
                  onChange={(e) => updateFormField("allergies", e.target.value)}
                  placeholder="List any known allergies (medications, food, environmental). Write 'None' if no known allergies."
                  rows={3}
                  className="mt-2 border-gray-300 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label htmlFor="familyHistory" className="text-base font-semibold text-gray-700">
                  Family Medical History
                </Label>
                <Textarea
                  id="familyHistory"
                  value={patientData.familyHistory}
                  onChange={(e) => updateFormField("familyHistory", e.target.value)}
                  placeholder="Any significant family medical history (diabetes, heart disease, cancer, high blood pressure, etc.). Write 'None' if no significant history."
                  rows={3}
                  className="mt-2 border-gray-300 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <Label htmlFor="lifestyle" className="text-base font-semibold text-gray-700">
                  Lifestyle Information
                </Label>
                <Textarea
                  id="lifestyle"
                  value={patientData.lifestyle}
                  onChange={(e) => updateFormField("lifestyle", e.target.value)}
                  placeholder="Exercise habits, diet, smoking, alcohol consumption, sleep patterns, stress levels, occupation, etc."
                  rows={4}
                  className="mt-2 border-gray-300 focus:border-blue-500 text-base"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🚀 Generate AI Assessment</h3>
                <p className="text-blue-700 mb-4">
                  Click "Generate Assessment" to run the revolutionary AI assessment and get your personalized health
                  recommendations.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-lg py-4"
                    size="lg"
                  >
                    ← Previous
                  </Button>
                  <Button
                    onClick={generateAssessment}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4"
                    size="lg"
                  >
                    🚀 Generate Assessment
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
