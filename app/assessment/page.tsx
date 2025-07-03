"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Heart,
  Activity,
  Pill,
  Utensils,
  Dumbbell,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Loader2,
  Home,
  RotateCcw,
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
}

interface AssessmentData {
  name: string
  age: string
  weight: string
  height: string
  gender: string
  primarySymptom: string
  symptomDuration: string
  symptomSeverity: string
  vitals: VitalsData
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

const durationOptions = ["Less than 1 day", "1–3 days", "4–7 days", "1–2 weeks", "More than 2 weeks"]
const severityOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}`)

export default function AssessmentPage() {
  const [form, setForm] = useState<AssessmentData>({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    primarySymptom: "",
    symptomDuration: "",
    symptomSeverity: "",
    vitals: {
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      bloodSugar: "",
    },
  })

  const [assessmentResults, setAssessmentResults] = useState<AIResponse | null>(null)
  const [assessmentLoading, setAssessmentLoading] = useState(false)

  const handle = (k: keyof AssessmentData, v: any) => setForm((p) => ({ ...p, [k]: v }))
  const handleVitals = (k: keyof VitalsData, v: string) => setForm((p) => ({ ...p, vitals: { ...p.vitals, [k]: v } }))

  const resetAssessment = () => {
    setAssessmentResults(null)
    setForm({
      name: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
      primarySymptom: "",
      symptomDuration: "",
      symptomSeverity: "",
      vitals: {
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        temperature: "",
        oxygenSaturation: "",
        bloodSugar: "",
      },
    })
  }

  const handleAssessmentSubmit = async () => {
    setAssessmentLoading(true)
    try {
      const assessmentPrompt = `
Patient Assessment:
Name: ${form.name}
Age: ${form.age}
Gender: ${form.gender}
Weight: ${form.weight}kg
Height: ${form.height}cm
Current Symptoms: ${form.primarySymptom}
Duration: ${form.symptomDuration}
Severity: ${form.symptomSeverity}/10
Vitals: BP ${form.vitals.bloodPressureSystolic}/${form.vitals.bloodPressureDiastolic}, HR ${form.vitals.heartRate}, Temp ${form.vitals.temperature}°F, O2 ${form.vitals.oxygenSaturation}%, Blood Sugar ${form.vitals.bloodSugar}mg/dL

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
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        setAssessmentResults({
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
      }
    } catch (error) {
      console.error("Assessment error:", error)
      setAssessmentResults({
        medications:
          "Unable to connect to AI service. Please consult with a healthcare provider for medication recommendations.",
        doctors: "Schedule an appointment with your primary care physician for proper evaluation.",
        labs: "Basic health-screening tests may be recommended by your doctor.",
        pharmacy: "Visit your local pharmacy for over-the-counter medications and health consultations.",
        dietPlan: "Maintain a balanced diet with plenty of fruits, vegetables, and stay hydrated.",
        exercise: "Engage in regular moderate exercise appropriate for your fitness level.",
        generalAdvice: "Monitor your symptoms and seek immediate medical attention if they worsen.",
      })
    } finally {
      setAssessmentLoading(false)
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
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
              <p className="text-gray-600 text-center">
                Our advanced AI is analyzing your health information and generating personalized recommendations...
              </p>
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
          <div className="max-w-4xl mx-auto space-y-6">
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
                      <p className="text-sm text-gray-700 whitespace-pre-line">{assessmentResults.medications}</p>
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
                      <p className="text-sm text-gray-700 whitespace-pre-line">{assessmentResults.doctors}</p>
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
                      <p className="text-sm text-gray-700 whitespace-pre-line">{assessmentResults.labs}</p>
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
                      <p className="text-sm text-gray-700 whitespace-pre-line">{assessmentResults.dietPlan}</p>
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
                      <p className="text-sm text-gray-700 whitespace-pre-line">{assessmentResults.exercise}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        General Advice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{assessmentResults.generalAdvice}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button onClick={resetAssessment} variant="outline">
                    Start New Assessment
                  </Button>
                  <Button onClick={() => window.print()}>Print Results</Button>
                  <Link href="/chat">
                    <Button className="bg-purple-600 hover:bg-purple-700">Chat with AI Doctor</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <NavigationButtons />
        <PoweredByFooter />
      </div>
    )
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Health Assessment Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handle("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
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
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={form.weight}
                    onChange={(e) => handle("weight", e.target.value)}
                    placeholder="Weight"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={form.height}
                    onChange={(e) => handle("height", e.target.value)}
                    placeholder="Height"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
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

              <div>
                <Label htmlFor="symptom">What is your primary health concern today?</Label>
                <Textarea
                  id="symptom"
                  value={form.primarySymptom}
                  onChange={(e) => handle("primarySymptom", e.target.value)}
                  placeholder="Describe your main symptom or health concern in detail..."
                  rows={4}
                />
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Be as specific as possible. Include location, intensity, and any triggers you've noticed.
                </AlertDescription>
              </Alert>

              <div>
                <Label>How long have you been experiencing this symptom?</Label>
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
                <Label>Rate the severity of your symptom (1 = mild, 10 = severe)</Label>
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

              <div>
                <Label className="text-base font-semibold">Vital Signs (Optional)</Label>
                <p className="text-gray-600 mb-4">
                  Please provide your current vital signs if available. Leave blank if unknown.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Blood Pressure (Systolic)</Label>
                    <Input
                      type="number"
                      value={form.vitals.bloodPressureSystolic}
                      onChange={(e) => handleVitals("bloodPressureSystolic", e.target.value)}
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div>
                    <Label>Blood Pressure (Diastolic)</Label>
                    <Input
                      type="number"
                      value={form.vitals.bloodPressureDiastolic}
                      onChange={(e) => handleVitals("bloodPressureDiastolic", e.target.value)}
                      placeholder="e.g., 80"
                    />
                  </div>
                  <div>
                    <Label>Heart Rate (bpm)</Label>
                    <Input
                      type="number"
                      value={form.vitals.heartRate}
                      onChange={(e) => handleVitals("heartRate", e.target.value)}
                      placeholder="e.g., 72"
                    />
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
                  </div>
                  <div>
                    <Label>Oxygen Saturation (%)</Label>
                    <Input
                      type="number"
                      value={form.vitals.oxygenSaturation}
                      onChange={(e) => handleVitals("oxygenSaturation", e.target.value)}
                      placeholder="e.g., 98"
                    />
                  </div>
                  <div>
                    <Label>Blood Sugar (mg/dL)</Label>
                    <Input
                      type="number"
                      value={form.vitals.bloodSugar}
                      onChange={(e) => handleVitals("bloodSugar", e.target.value)}
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your information will be analyzed by our AI system to provide personalized health recommendations.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end">
                <Button
                  onClick={handleAssessmentSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  disabled={!form.name || !form.primarySymptom}
                >
                  Generate AI Assessment
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
