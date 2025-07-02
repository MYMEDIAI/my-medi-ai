"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Heart, Activity, Pill, Utensils, Dumbbell, AlertCircle } from "lucide-react"
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
    try {
      const assessmentPrompt = `
Patient Assessment:
Name: ${formData.name}
Age: ${formData.age}
Gender: ${formData.gender}
Current Symptoms: ${formData.symptoms}
Duration: ${formData.duration}
Severity: ${formData.severity}
Current Medications: ${formData.medications}
Allergies: ${formData.allergies}
Family History: ${formData.familyHistory}
Lifestyle: ${formData.lifestyle}

Please provide comprehensive recommendations for:
1. Medications (over-the-counter suggestions)
2. Doctors/specialists to consult
3. Laboratory tests that might be helpful
4. Pharmacy options
5. Personalized diet plan
6. Exercise recommendations
7. General health advice

Format the response as structured recommendations with clear sections.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "assessment",
        }),
      })

      const data = await response.json()

      if (data.response) {
        // Parse the AI response into structured format
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        setResults({
          medications:
            extractSection(aiText, "medication") ||
            "Consult with a healthcare provider for appropriate medications based on your symptoms.",
          doctors:
            extractSection(aiText, "doctor") ||
            "Schedule an appointment with your primary care physician for initial evaluation.",
          labs: extractSection(aiText, "lab") || "Basic blood work and relevant tests as recommended by your doctor.",
          pharmacy:
            extractSection(aiText, "pharmacy") ||
            "Visit your local pharmacy for over-the-counter medications and health consultations.",
          dietPlan:
            extractSection(aiText, "diet") ||
            "Maintain a balanced diet with plenty of fruits, vegetables, and adequate hydration.",
          exercise:
            extractSection(aiText, "exercise") ||
            "Engage in regular moderate exercise as appropriate for your condition.",
          generalAdvice:
            extractSection(aiText, "advice") ||
            "Monitor your symptoms and seek medical attention if they worsen or persist.",
        })
        setStep(3)
      }
    } catch (error) {
      console.error("Assessment error:", error)
      // Provide fallback results
      setResults({
        medications:
          "Unable to connect to AI service. Please consult with a healthcare provider for medication recommendations.",
        doctors: "Schedule an appointment with your primary care physician for proper evaluation.",
        labs: "Basic health screening tests may be recommended by your doctor.",
        pharmacy: "Visit your local pharmacy for over-the-counter medications and health consultations.",
        dietPlan: "Maintain a balanced diet with plenty of fruits, vegetables, and stay hydrated.",
        exercise: "Engage in regular moderate exercise appropriate for your fitness level.",
        generalAdvice: "Monitor your symptoms and seek immediate medical attention if they worsen.",
      })
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  const extractSection = (text: string, keyword: string): string => {
    const lines = text.split("\n")
    let section = ""
    let capturing = false

    for (const line of lines) {
      if (line.toLowerCase().includes(keyword) && (line.includes(":") || line.includes("."))) {
        capturing = true
        section = line
        continue
      }
      if (capturing) {
        if (line.trim() === "" || line.match(/^\d+\./)) {
          if (section.length > 50) break
        }
        section += "\n" + line
      }
    }

    return section.trim() || ""
  }

  const resetAssessment = () => {
    setStep(1)
    setResults(null)
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
            <p className="text-gray-600 text-center">
              Our advanced AI is analyzing your health information and generating personalized recommendations...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (results) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Your Personalized Health Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Pill className="h-4 w-4" />
                    Medication Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{results.medications}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    Healthcare Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{results.doctors}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4" />
                    Recommended Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{results.labs}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4" />
                    Diet Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{results.dietPlan}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Dumbbell className="h-4 w-4" />
                    Exercise Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{results.exercise}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    General Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{results.generalAdvice}</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex gap-4">
              <Button onClick={resetAssessment} variant="outline">
                Start New Assessment
              </Button>
              <Button onClick={() => window.print()}>Print Results</Button>
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
          <CardTitle>AI Health Assessment - Step {step} of 2</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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

              <div>
                <Label htmlFor="symptoms">Current Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  placeholder="Describe your current symptoms in detail..."
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration of Symptoms</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!formData.name || !formData.age || !formData.symptoms}
              >
                Continue to Medical History
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => handleInputChange("medications", e.target.value)}
                  placeholder="List any medications you're currently taking..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  placeholder="List any known allergies (medications, food, environmental)..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="familyHistory">Family Medical History</Label>
                <Textarea
                  id="familyHistory"
                  value={formData.familyHistory}
                  onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                  placeholder="Any significant family medical history (diabetes, heart disease, etc.)..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="lifestyle">Lifestyle Information</Label>
                <Textarea
                  id="lifestyle"
                  value={formData.lifestyle}
                  onChange={(e) => handleInputChange("lifestyle", e.target.value)}
                  placeholder="Exercise habits, diet, smoking, alcohol consumption, sleep patterns..."
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Generate AI Assessment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
