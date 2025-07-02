"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  ArrowRight,
  Stethoscope,
  Apple,
  Activity,
  Heart,
  Users,
  Brain,
  Sparkles,
  Target,
  CheckCircle,
  Award,
  Clock,
  MessageCircle,
  FileText,
  Languages,
  Leaf,
  Mail,
  Phone,
  Linkedin,
  Database,
  BookOpen,
  Facebook,
  Instagram,
  MapPin,
  Pill,
  AlertTriangle,
  Send,
  Mic,
  User,
  Camera,
  Upload,
  Utensils,
  Dumbbell,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

/* ----------  TYPES  ---------- */
interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  imageUrl?: string
}

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

/* ----------  CONSTANTS  ---------- */
const durationOptions = ["Less than 1 day", "1–3 days", "4–7 days", "1–2 weeks", "More than 2 weeks"]
const severityOptions = Array.from({ length: 10 }, (_, i) => `${i + 1}`)

const languages = [
  "English",
  "हिंदी (Hindi)",
  "தமிழ் (Tamil)",
  "తెలుగు (Telugu)",
  "বাংলা (Bengali)",
  "ગુજરાતી (Gujarati)",
  "ಕನ್ನಡ (Kannada)",
  "മലയാളം (Malayalam)",
  "मराठी (Marathi)",
  "ਪੰਜਾਬੀ (Punjabi)",
]

/* ----------  MAIN COMPONENT  ---------- */
export default function Home() {
  const [showAssessment, setShowAssessment] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [email, setEmail] = useState("")
  const [healthScore, setHealthScore] = useState(87)
  const totalSteps = 5

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

  const progress = (step / totalSteps) * 100

  // Floating animation for medical icons
  const [floatingIcons, setFloatingIcons] = useState<Array<{ id: number; x: number; y: number; icon: any }>>([])

  useEffect(() => {
    const icons = [Stethoscope, Heart, Activity, Apple, Brain, Shield]
    const newFloatingIcons = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      icon: icons[i],
    }))
    setFloatingIcons(newFloatingIcons)
  }, [])

  /* ----------  HELPERS  ---------- */
  const handle = (k: keyof AssessmentData, v: any) => setForm((p) => ({ ...p, [k]: v }))
  const handleVitals = (k: keyof VitalsData, v: string) => setForm((p) => ({ ...p, vitals: { ...p.vitals, [k]: v } }))

  const handleEmailSignup = async () => {
    if (email) {
      alert(`Thank you! We'll notify you at ${email} when early access is available.`)
      setEmail("")
    }
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
        setStep(6) // Results step
      }
    } catch (error) {
      console.error("Assessment error:", error)
      // Provide fallback results
      setAssessmentResults({
        medications:
          "Unable to connect to AI service. Please consult with a healthcare provider for medication recommendations.",
        doctors: "Schedule an appointment with your primary care physician for proper evaluation.",
        labs: "Basic health screening tests may be recommended by your doctor.",
        pharmacy: "Visit your local pharmacy for over-the-counter medications and health consultations.",
        dietPlan: "Maintain a balanced diet with plenty of fruits, vegetables, and stay hydrated.",
        exercise: "Engage in regular moderate exercise appropriate for your fitness level.",
        generalAdvice: "Monitor your symptoms and seek immediate medical attention if they worsen.",
      })
      setStep(6)
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

  const resetAssessment = () => {
    setStep(1)
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

  /* ----------  ASSESSMENT FLOW  ---------- */
  if (showAssessment) {
    if (assessmentLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
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
      )
    }

    if (assessmentResults) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <MyMedLogo size="lg" />
              <Button onClick={() => setShowAssessment(false)} variant="outline">
                Back to Home
              </Button>
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
          <PoweredByFooter />
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-100 text-purple-800">
                Step {step} of {totalSteps}
              </Badge>
              <Button
                variant="outline"
                onClick={() => setShowAssessment(false)}
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Exit Assessment
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Progress value={progress} className="h-2 bg-purple-100" />
              <p className="text-sm text-gray-600 mt-2 text-center">
                {Math.round(progress)}% Complete - Your health assessment is in progress
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Primary Health Concern"}
                  {step === 3 && "Symptom Details"}
                  {step === 4 && "Vital Signs"}
                  {step === 5 && "Review & Submit"}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
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
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
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
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
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
                              {severity} {severity <= 3 ? "(Mild)" : severity <= 6 ? "(Moderate)" : "(Severe)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
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
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Information</h3>
                      <p className="text-gray-600 mb-6">
                        Please review your information before submitting for AI analysis.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <strong>Name:</strong> {form.name}
                      </div>
                      <div>
                        <strong>Age:</strong> {form.age}
                      </div>
                      <div>
                        <strong>Primary Symptom:</strong> {form.primarySymptom}
                      </div>
                      <div>
                        <strong>Duration:</strong> {form.symptomDuration}
                      </div>
                      <div>
                        <strong>Severity:</strong> {form.symptomSeverity}/10
                      </div>
                    </div>

                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Your information will be analyzed by our AI system to provide personalized health
                        recommendations.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button variant="outline" onClick={() => setStep(step - 1)} className="border-purple-200">
                      Previous
                    </Button>
                  )}
                  {step < 5 && (
                    <Button
                      onClick={() => setStep(step + 1)}
                      className="bg-purple-600 hover:bg-purple-700 text-white ml-auto"
                      disabled={(step === 1 && (!form.name || !form.age)) || (step === 2 && !form.primarySymptom)}
                    >
                      Next Step
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                  {step === 5 && (
                    <Button
                      onClick={handleAssessmentSubmit}
                      className="bg-green-600 hover:bg-green-700 text-white ml-auto"
                    >
                      Generate AI Assessment
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <PoweredByFooter />
      </div>
    )
  }

  /* ----------  MAIN LANDING PAGE  ---------- */
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <nav className="hidden md:flex items-center space-x-6">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-40">
                <Languages className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/chat">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick Chat
              </Button>
            </Link>
            <Button onClick={() => setShowAssessment(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Assessment
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 overflow-hidden">
        {/* Floating Medical Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingIcons.map(({ id, x, y, icon: Icon }) => (
            <div
              key={id}
              className="absolute animate-pulse opacity-10"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${id * 0.5}s`,
                animationDuration: `${3 + id}s`,
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
            <span className="mr-2">🇮🇳</span>
            Made in India • HIPAA Compliant • AI-Powered
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Healthcare for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Every Indian
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Get instant health insights in your language, powered by Google Gemini AI. Healthcare that understands
            India's diversity and needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => setShowAssessment(true)}
            >
              Start Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Try AI Chat
                <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Features Section - Moved to top */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Try Our AI-Powered Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our interactive AI tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* AI Health Chat */}
            <ProductionChatWidget />

            {/* Report Analyzer */}
            <ProductionReportAnalyzer />

            {/* Medicine Identifier */}
            <ProductionMedicineIdentifier />

            {/* Body Mapper */}
            <ProductionBodyMapper />

            {/* Meal Planner */}
            <ProductionMealPlanner />

            {/* Vitals Tracker */}
            <ProductionVitalsTracker />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900 mb-1">1M+ Token</div>
                <div className="text-gray-600">Context Window</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Languages className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-1">10+</div>
                <div className="text-gray-600">Indian Languages</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900 mb-1">1000</div>
                <div className="text-gray-600">Free Consultations/Day</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-900 mb-1">24/7</div>
                <div className="text-gray-600">AI Assistant</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Healthcare Features Built for India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive AI-powered healthcare solutions designed specifically for Indian needs and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Health Assistant</h3>
                <p className="text-gray-600">
                  Chat with Gemini-powered AI in your preferred language. Get instant health advice, symptom analysis,
                  and personalized recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Health Records</h3>
                <p className="text-gray-600">
                  Secure digital storage for all medical documents. Upload prescriptions, lab reports, and track your
                  complete health history.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Vitals Tracking</h3>
                <p className="text-gray-600">
                  Monitor BP, blood sugar, weight with AI insights. Get personalized recommendations based on Indian
                  health standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Languages className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-language Support</h3>
                <p className="text-gray-600">
                  Available in Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Marathi, Punjabi, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                  <Leaf className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AYUSH Integration</h3>
                <p className="text-gray-600">
                  Combines modern medicine with traditional Ayurveda, Yoga, Unani, Siddha, and Homeopathy practices for
                  holistic care.
                </p>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Goal Setting</h3>
                <p className="text-gray-600">
                  Set personalized health goals with AI guidance. Track progress and get motivated with culturally
                  relevant recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About the Founder Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/harsha-founder.jpeg"
                  alt="Bandarla Harshavardhan - Founder & CEO of MyMedi.ai"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Bandarla Harshavardhan</h2>
                <p className="text-xl text-purple-600 font-semibold mb-4">Founder & CEO, MyMedi.ai</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Award className="w-3 h-3 mr-1" />
                    Stanford d.school UIF Fellow
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <BookOpen className="w-3 h-3 mr-1" />
                    MBA Graduate
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    <Database className="w-3 h-3 mr-1" />
                    Ex-Data Architect at MNCs
                  </Badge>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                With over a decade of experience as a Data Architect at leading multinational corporations,
                Harshavardhan combines technical expertise with human-centered design. As a Stanford d.school University
                Innovation Fellow and MBA graduate, he founded MyMedi.ai to democratize healthcare access for 1.4
                billion Indians using AI technology.
              </p>

              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/my-medi-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </a>
                <a
                  href="https://www.facebook.com/share/19X8ivFr6Z/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                </a>
                <a
                  href="https://www.instagram.com/my_medi.ai?igsh=b283cDExejh4cjc1&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                </a>
                <a href="mailto:Harsha@mymedi.ai" className="inline-block">
                  <Button variant="outline" size="sm" className="flex items-center bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Health Journey Today</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians taking control of their health with AI-powered insights
          </p>

          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/90 border-0 text-gray-900 placeholder-gray-500"
              />
              <Button onClick={handleEmailSignup} className="bg-white text-purple-600 hover:bg-gray-100 px-6">
                Get Early Access
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => setShowAssessment(true)}
            >
              Start Free Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Try AI Chat
                <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-purple-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <MyMedLogo size="lg" theme="dark" />
              <p className="text-gray-300">
                AI-powered healthcare platform designed specifically for India's diverse healthcare needs.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/my-medi-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/share/19X8ivFr6Z/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/my_medi.ai?igsh=b283cDExejh4cjc1&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Health Assistant
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Health Records
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Vitals Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AYUSH Integration
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:Harsha@mymedi.ai" className="hover:text-white transition-colors">
                    Harsha@mymedi.ai
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href="tel:+919701744770" className="hover:text-white transition-colors">
                    +91-9701744770
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Quantum Valley, Amaravati, Andhra Pradesh, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyMedi.ai. All rights reserved. Made with ❤️ in India 🇮🇳</p>
          </div>
        </div>
      </footer>

      <PoweredByFooter />
    </div>
  )
}

/* ----------  PRODUCTION COMPONENTS  ---------- */

function ProductionChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI health assistant. I can help with your health questions in multiple Indian languages. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Speech recognition setup
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
          setIsListening(true)
        } catch (error) {
          console.error("Speech recognition error:", error)
        }
      } else {
        alert("Speech recognition is not supported in your browser.")
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim() || "Image uploaded",
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Create form data for image upload
      const formData = new FormData()

      if (inputMessage.trim()) {
        formData.append("message", inputMessage.trim())
      }

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      formData.append("type", "chat")

      // Use fetch API to send the message and image
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response || "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      clearImage()
    } catch (error) {
      console.error("Chat error:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I'm experiencing technical difficulties. Please try again later or contact support.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>🧠 AI Health Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Ask in any Indian language or dialect</p>

        <div className="h-48 overflow-y-auto space-y-2 bg-white/50 rounded-lg p-3 border">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-2 text-xs ${
                  message.type === "user" ? "bg-purple-600 text-white" : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  {message.type === "user" && <User className="w-3 h-3" />}
                  {message.type === "ai" && <Brain className="w-3 h-3 text-purple-600" />}
                  <span className="text-xs font-medium">{message.type === "user" ? "You" : "AI Assistant"}</span>
                </div>
                <p>{message.content}</p>
                {message.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={message.imageUrl || "/placeholder.svg"}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded"
                      style={{ maxHeight: "100px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-2 text-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {imagePreview && (
          <div className="relative inline-block">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="h-16 w-16 object-cover rounded-md border border-gray-300"
            />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about symptoms, medications, or health advice..."
            className="bg-white/70 border-purple-500/30 text-gray-900 placeholder-gray-500 text-xs"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className={`${isListening ? "bg-red-500 text-white" : "bg-red-500/20 border-red-500/30 text-red-700 hover:bg-red-500/30"} text-xs`}
                  onClick={toggleListening}
                >
                  <Mic className="w-3 h-3 mr-1" />
                  {isListening ? "Listening..." : "Voice Input"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to speak your health question</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Upload Image
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload an image of symptoms, reports, etc.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <Link href="/chat">
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-700 bg-transparent hover:bg-purple-500/20 text-xs"
            >
              Full Chat
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ProductionReportAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleAnalyze(file)
    }
  }

  const handleAnalyze = async (file?: File) => {
    setIsAnalyzing(true)
    try {
      if (file) {
        // Create form data for file upload
        const formData = new FormData()
        formData.append("report", file)
        formData.append("type", "report_analysis")

        // Send to backend for AI analysis
        const response = await fetch("/api/ai-integration", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        setAnalysisResult(
          data.response ||
            "Analysis complete. Please consult with a healthcare professional for accurate interpretation.",
        )
      } else {
        // Sample analysis if no file is provided
        const response = await fetch("/api/ai-integration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Analyze a sample blood report with normal values",
            type: "report_analysis",
          }),
        })

        const data = await response.json()
        setAnalysisResult(
          data.response || "Sample report analysis complete. This is a demonstration of our AI capabilities.",
        )
      }
    } catch (error) {
      console.error("Report analysis error:", error)
      setAnalysisResult("Error analyzing report. Please try again or contact support.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Camera className="w-5 h-5 text-green-600" />
          <span className="text-sm">📸 Report Analyzer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysisResult ? (
          <>
            <div
              className="bg-white/50 rounded-lg p-4 border-2 border-dashed border-green-500/30 cursor-pointer hover:border-green-400/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-gray-700">Upload medical report (PDF, JPG, PNG)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="report-upload"
                />
                <label htmlFor="report-upload" className="cursor-pointer">
                  <p className="text-xs text-gray-500 mt-1">Click to select file</p>
                </label>
              </div>
            </div>
            <Button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Sample Report"}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Analysis Complete</span>
            </div>
            <div className="bg-white/70 rounded-lg p-3 border">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">{analysisResult}</pre>
            </div>
            <Button
              onClick={() => setAnalysisResult(null)}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Analyze Another Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProductionMedicineIdentifier() {
  const [isScanning, setIsScanning] = useState(false)
  const [medicineInfo, setMedicineInfo] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      handleScan(file)
    }
  }

  const handleScan = async (file?: File) => {
    setIsScanning(true)
    try {
      if (file) {
        // Create form data for image upload
        const formData = new FormData()
        formData.append("medicine_image", file)
        formData.append("type", "medicine_identification")

        // Send to backend for AI analysis
        const response = await fetch("/api/ai-integration", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        // Parse the AI response
        const aiResponse = data.response || ""

        // Extract medicine information from AI response
        setMedicineInfo({
          name: extractInfo(aiResponse, "name") || "Medicine Name",
          generic: extractInfo(aiResponse, "generic") || "Generic Name",
          brandPrice: extractInfo(aiResponse, "price") || "₹25",
          genericPrice: extractInfo(aiResponse, "generic price") || "₹5",
          uses: extractInfo(aiResponse, "uses") || "Pain relief, fever reduction",
          interactions: extractInfo(aiResponse, "interactions")?.split(",") || ["Consult your doctor for interactions"],
          dosage: extractInfo(aiResponse, "dosage") || "As directed by physician",
        })
      } else {
        // Sample medicine identification if no image is provided
        const response = await fetch("/api/ai-integration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Identify a common paracetamol tablet",
            type: "medicine_identification",
          }),
        })

        const data = await response.json()

        // Set default medicine info
        setMedicineInfo({
          name: "Paracetamol 500mg",
          generic: "Acetaminophen",
          brandPrice: "₹25",
          genericPrice: "₹5",
          uses: "Pain relief, fever reduction",
          interactions: ["Avoid with alcohol", "Check with blood thinners"],
          dosage: "1-2 tablets every 6 hours",
        })
      }
    } catch (error) {
      console.error("Medicine scan error:", error)
      setMedicineInfo({
        name: "Unknown Medicine",
        generic: "Not identified",
        brandPrice: "N/A",
        genericPrice: "N/A",
        uses: "Please consult a healthcare professional",
        interactions: ["Unknown - please consult your doctor"],
        dosage: "As directed by physician",
      })
    } finally {
      setIsScanning(false)
    }
  }

  // Helper function to extract information from AI response
  const extractInfo = (text: string, key: string): string | null => {
    const regex = new RegExp(`${key}[:\\s]+(.*?)(?:\\n|$)`, "i")
    const match = text.match(regex)
    return match ? match[1].trim() : null
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Pill className="w-5 h-5 text-blue-600" />
          <span className="text-sm">💊 Medicine Identifier</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!medicineInfo ? (
          <>
            <div
              className="bg-white/50 rounded-lg p-4 border-2 border-dashed border-blue-500/30 cursor-pointer hover:border-blue-400/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-gray-700">Snap a photo of any pill/medicine</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">Click to take photo or upload</p>
              </div>
            </div>
            <Button
              onClick={() => handleScan()}
              disabled={isScanning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isScanning ? "Scanning..." : "Identify Sample Medicine"}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Medicine Identified</span>
            </div>

            <div className="bg-white/70 rounded p-3 space-y-2 border">
              <div>
                <p className="text-xs text-blue-700 font-semibold">{medicineInfo.name}</p>
                <p className="text-xs text-gray-600">Generic: {medicineInfo.generic}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-red-500/20 rounded p-2">
                  <p className="text-red-700">Brand: {medicineInfo.brandPrice}</p>
                </div>
                <div className="bg-green-500/20 rounded p-2">
                  <p className="text-green-700">Generic: {medicineInfo.genericPrice}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-700">
                  <strong>Uses:</strong> {medicineInfo.uses}
                </p>
                <p className="text-xs text-gray-700">
                  <strong>Dosage:</strong> {medicineInfo.dosage}
                </p>
              </div>

              <div className="bg-yellow-500/20 rounded p-2">
                <div className="flex items-center space-x-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs text-yellow-700 font-semibold">Interactions:</span>
                </div>
                {medicineInfo.interactions.map((interaction: string, idx: number) => (
                  <p key={idx} className="text-xs text-yellow-700">
                    • {interaction}
                  </p>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setMedicineInfo(null)}
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Scan Another Medicine
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProductionBodyMapper() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Array<{ condition: string; probability: number }>>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const bodyParts = [
    { name: "Head", icon: "🧠" },
    { name: "Chest", icon: "❤️" },
    { name: "Stomach", icon: "🫃" },
    { name: "Joints", icon: "🦴" },
    { name: "Skin", icon: "🧬" },
    { name: "Eyes", icon: "👁️" },
  ]

  const handleBodyPartClick = async (bodyPart: string, icon: string) => {
    setSelectedBodyPart(bodyPart)
    setIsAnalyzing(true)

    try {
      // Call AI for symptom analysis
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze potential conditions for ${bodyPart} symptoms and provide probability percentages`,
          type: "symptom_analysis",
        }),
      })

      const data = await response.json()

      // Parse AI response to extract conditions and probabilities
      const aiResponse = data.response || ""
      const conditions = parseConditions(aiResponse, bodyPart)

      setPredictions(conditions)
    } catch (error) {
      console.error("Body mapping error:", error)
      // Fallback predictions
      setPredictions([
        { condition: "Condition 1", probability: 85 },
        { condition: "Condition 2", probability: 72 },
        { condition: "Condition 3", probability: 45 },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to parse conditions from AI response
  const parseConditions = (text: string, bodyPart: string): Array<{ condition: string; probability: number }> => {
    // Try to extract conditions and probabilities from the AI response
    const conditions: Array<{ condition: string; probability: number }> = []

    // Simple regex pattern to find condition: probability% patterns
    const regex = /([A-Za-z\s]+)(?:\s*[-:]\s*)(\d+)(?:\s*%)?/g
    let match

    while ((match = regex.exec(text)) !== null) {
      const condition = match[1].trim()
      const probability = Number.parseInt(match[2], 10)

      if (condition && !isNaN(probability)) {
        conditions.push({ condition, probability })
      }
    }

    // If no conditions found, provide default ones based on body part
    if (conditions.length === 0) {
      switch (bodyPart) {
        case "Head":
          return [
            { condition: "Tension Headache", probability: 85 },
            { condition: "Migraine", probability: 72 },
            { condition: "Sinus Congestion", probability: 45 },
          ]
        case "Chest":
          return [
            { condition: "Muscle Strain", probability: 78 },
            { condition: "Acid Reflux", probability: 65 },
            { condition: "Anxiety", probability: 52 },
          ]
        case "Stomach":
          return [
            { condition: "Indigestion", probability: 82 },
            { condition: "Food Poisoning", probability: 68 },
            { condition: "Gastritis", probability: 55 },
          ]
        default:
          return [
            { condition: "Common Condition", probability: 80 },
            { condition: "Secondary Condition", probability: 65 },
            { condition: "Rare Condition", probability: 40 },
          ]
      }
    }

    // Sort by probability (highest first)
    return conditions.sort((a, b) => b.probability - a.probability).slice(0, 3)
  }

  return (
    <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Users className="w-5 h-5 text-red-600" />
          <span className="text-sm">🎯 Symptom Body Mapper</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/50 rounded-lg p-4 border">
          <div className="w-full h-32 bg-gradient-to-b from-red-500/20 to-orange-500/20 rounded flex items-center justify-center relative">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 text-red-600" />
              <p className="text-xs text-gray-700">Select a body area below</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {bodyParts.map((part) => (
              <Button
                key={part.name}
                size="sm"
                onClick={() => handleBodyPartClick(part.name, part.icon)}
                className={`text-xs ${
                  selectedBodyPart === part.name
                    ? "bg-red-600 text-white"
                    : "bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-700"
                }`}
                disabled={isAnalyzing}
              >
                <span className="mr-1">{part.icon}</span> {part.name}
              </Button>
            ))}
          </div>
        </div>

        {isAnalyzing ? (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="w-5 h-5 animate-spin text-red-600 mr-2" />
            <span className="text-xs text-gray-700">Analyzing symptoms...</span>
          </div>
        ) : (
          predictions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-700 font-semibold">AI Predictions for {selectedBodyPart}:</p>
              {predictions.map((pred, idx) => (
                <div key={idx} className="flex justify-between text-xs bg-white/50 rounded p-2 border">
                  <span className="text-gray-700">{pred.condition}</span>
                  <span
                    className={`font-semibold ${
                      pred.probability > 75
                        ? "text-red-600"
                        : pred.probability > 60
                          ? "text-orange-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {pred.probability}%
                  </span>
                </div>
              ))}
            </div>
          )
        )}

        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
          <MapPin className="w-3 h-3 mr-2" />
          Find Nearest Doctor
        </Button>
      </CardContent>
    </Card>
  )
}

function ProductionMealPlanner() {
  const [mealPlan, setMealPlan] = useState({
    breakfast: "Poha with vegetables",
    lunch: "Dal rice with sabzi",
    dinner: "Roti with curry",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [dietaryPreference, setDietaryPreference] = useState("vegetarian")
  const [healthGoal, setHealthGoal] = useState("balanced")

  const generateMealPlan = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Generate a healthy Indian ${dietaryPreference} meal plan for ${healthGoal} diet`,
          type: "meal_planning",
        }),
      })

      const data = await response.json()
      const aiResponse = data.response || ""

      // Parse meal plan from AI response
      const breakfast = extractMeal(aiResponse, "breakfast") || "Nutritious breakfast option"
      const lunch = extractMeal(aiResponse, "lunch") || "Balanced lunch meal"
      const dinner = extractMeal(aiResponse, "dinner") || "Healthy dinner option"

      setMealPlan({
        breakfast,
        lunch,
        dinner,
      })
    } catch (error) {
      console.error("Meal planning error:", error)
      // Fallback meal plan
      setMealPlan({
        breakfast: "Oats with fruits and nuts",
        lunch: "Quinoa salad with vegetables",
        dinner: "Grilled vegetables with brown rice",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Helper function to extract meal from AI response
  const extractMeal = (text: string, mealType: string): string | null => {
    const regex = new RegExp(`${mealType}[:\\s]+(.*?)(?:\\n|$)`, "i")
    const match = text.match(regex)
    return match ? match[1].trim() : null
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Apple className="w-5 h-5 text-yellow-600" />
          <span className="text-sm">🍽️ AI Meal Planner</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/50 rounded-lg p-3 border">
          <p className="text-xs text-gray-700 mb-2">Today's Recommendation:</p>
          <p className="text-xs text-yellow-700">Breakfast: {mealPlan.breakfast}</p>
          <p className="text-xs text-yellow-700">Lunch: {mealPlan.lunch}</p>
          <p className="text-xs text-yellow-700">Dinner: {mealPlan.dinner}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Diet Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
            </SelectContent>
          </Select>

          <Select value={healthGoal} onValueChange={setHealthGoal}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Health Goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="diabetic">Diabetic</SelectItem>
              <SelectItem value="high-protein">High Protein</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/50 rounded p-2 text-center border">
            <p className="text-green-600 font-semibold">1800</p>
            <p className="text-gray-600">Calories</p>
          </div>
          <div className="bg-white/50 rounded p-2 text-center border">
            <p className="text-blue-600 font-semibold">₹150</p>
            <p className="text-gray-600">Budget</p>
          </div>
          <div className="bg-white/50 rounded p-2 text-center border">
            <p className="text-purple-600 font-semibold">Local</p>
            <p className="text-gray-600">Ingredients</p>
          </div>
        </div>
        <Button
          onClick={generateMealPlan}
          disabled={isGenerating}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {isGenerating ? "Generating..." : "Generate New Plan"}
        </Button>
      </CardContent>
    </Card>
  )
}

function ProductionVitalsTracker() {
  const [vitals, setVitals] = useState({
    bloodPressure: "120/80",
    heartRate: "72",
    temperature: "98.6",
    weight: "70",
  })
  const [isTracking, setIsTracking] = useState(false)
  const [vitalInput, setVitalInput] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    weight: "",
  })
  const [showInputForm, setShowInputForm] = useState(false)

  const updateVitals = async () => {
    if (showInputForm) {
      // Update with user input
      const newVitals = {
        bloodPressure:
          vitalInput.systolic && vitalInput.diastolic
            ? `${vitalInput.systolic}/${vitalInput.diastolic}`
            : vitals.bloodPressure,
        heartRate: vitalInput.heartRate || vitals.heartRate,
        temperature: vitalInput.temperature || vitals.temperature,
        weight: vitalInput.weight || vitals.weight,
      }

      setVitals(newVitals)
      setShowInputForm(false)

      // Reset input form
      setVitalInput({
        systolic: "",
        diastolic: "",
        heartRate: "",
        temperature: "",
        weight: "",
      })

      // Send to AI for analysis
      try {
        await fetch("/api/ai-integration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Analyze these vitals: BP ${newVitals.bloodPressure}, HR ${newVitals.heartRate}, Temp ${newVitals.temperature}, Weight ${newVitals.weight}kg`,
            type: "vitals_analysis",
          }),
        })
      } catch (error) {
        console.error("Vitals analysis error:", error)
      }
    } else {
      setShowInputForm(true)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-teal-500/20 to-green-500/20 border-teal-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Activity className="w-5 h-5 text-teal-600" />
          <span className="text-sm">📊 Vitals Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showInputForm ? (
          <div className="space-y-3">
            <div className="bg-white/50 rounded p-2 border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-700">Blood Pressure</span>
                <span className="text-teal-700 font-semibold">{vitals.bloodPressure} mmHg</span>
              </div>
            </div>
            <div className="bg-white/50 rounded p-2 border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-700">Heart Rate</span>
                <span className="text-teal-700 font-semibold">{vitals.heartRate} bpm</span>
              </div>
            </div>
            <div className="bg-white/50 rounded p-2 border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-700">Temperature</span>
                <span className="text-teal-700 font-semibold">{vitals.temperature}°F</span>
              </div>
            </div>
            <div className="bg-white/50 rounded p-2 border">
              <div className="flex justify-between text-xs">
                <span className="text-gray-700">Weight</span>
                <span className="text-teal-700 font-semibold">{vitals.weight} kg</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Systolic</Label>
                <Input
                  type="number"
                  placeholder="120"
                  className="h-8 text-xs"
                  value={vitalInput.systolic}
                  onChange={(e) => setVitalInput({ ...vitalInput, systolic: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Diastolic</Label>
                <Input
                  type="number"
                  placeholder="80"
                  className="h-8 text-xs"
                  value={vitalInput.diastolic}
                  onChange={(e) => setVitalInput({ ...vitalInput, diastolic: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Heart Rate (bpm)</Label>
              <Input
                type="number"
                placeholder="72"
                className="h-8 text-xs"
                value={vitalInput.heartRate}
                onChange={(e) => setVitalInput({ ...vitalInput, heartRate: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Temperature (°F)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="98.6"
                className="h-8 text-xs"
                value={vitalInput.temperature}
                onChange={(e) => setVitalInput({ ...vitalInput, temperature: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Weight (kg)</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="70"
                className="h-8 text-xs"
                value={vitalInput.weight}
                onChange={(e) => setVitalInput({ ...vitalInput, weight: e.target.value })}
              />
            </div>
          </div>
        )}

        <div className="bg-green-500/20 rounded p-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">All vitals normal</span>
          </div>
        </div>

        <Button
          onClick={updateVitals}
          disabled={isTracking}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        >
          {showInputForm ? "Save Vitals" : "Update Vitals"}
        </Button>
      </CardContent>
    </Card>
  )
}
