"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  ArrowRight,
  Stethoscope,
  Apple,
  Activity,
  Heart,
  Brain,
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
  Baby,
  Pill,
  Utensils,
  User,
} from "lucide-react"
import HealthAssessmentForm from "@/components/health-assessment-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

/**
 * Safely parse JSON only when the response actually contains JSON.
 * Returns `null` when the body is not JSON or parsing fails.
 */
async function safeJson(res: Response): Promise<any | null> {
  const contentType = res.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return null
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}

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
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [email, setEmail] = useState("")
  const [healthScore, setHealthScore] = useState(87)

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

      const data = await safeJson(response)
      if (!response.ok || !data) {
        throw new Error("AI service returned a non-JSON or error response")
      }

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
          <HealthAssessmentForm />
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
            <Link href="/location">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <MapPin className="w-4 h-4 mr-2" />
                Find Healthcare
              </Button>
            </Link>
            <Link href="/chat">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick Chat
              </Button>
            </Link>
            <Link href="/pregnancy">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                <Baby className="w-4 h-4 mr-2" />
                Pregnancy Care
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
            AI-Powered Healthcare for
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
            <Link href="/pregnancy">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Pregnancy Care
                <Baby className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/diabetes-assessment">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Diabetes Care
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Interactive Features Section - Moved to top */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-Powered Healthcare Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience comprehensive healthcare tools designed for Indian families
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* AI Health Chat */}
            <Link href="/chat">
              <Card className="border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Health Chat</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Chat with AI doctor in your language. Get instant health advice and symptom analysis.
                  </p>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Medicine Identifier */}
            <Link href="/medicine">
              <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Pill className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicine Analyzer</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get detailed medicine information, dosage, interactions, and safety guidelines.
                  </p>
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Analyze Medicine
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Diet Planner */}
            <Link href="/diet">
              <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Utensils className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Diet Planner</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get personalized meal plans based on your health conditions and preferences.
                  </p>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Plan Diet
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Vitals Tracker */}
            <Link href="/vitals">
              <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vitals Tracker</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Monitor blood pressure, heart rate, and other vital signs with AI insights.
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Track Vitals
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Report Analyzer */}
            <Link href="/reports">
              <Card className="border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Analyzer</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload and analyze medical reports with AI-powered insights and recommendations.
                  </p>
                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Analyze Reports
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Body Mapper */}
            <Link href="/body-mapper">
              <Card className="border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <User className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Body Mapper</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Interactive body diagram to identify symptoms and get targeted health advice.
                  </p>
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Map Symptoms
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Diabetes Assessment */}
            <Link href="/diabetes-assessment">
              <Card className="border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Diabetes Assessment</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Complete diabetes evaluation with personalized management plan and downloadable PDF report.
                  </p>
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Location Services */}
            <Link href="/location">
              <Card className="border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                    <MapPin className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Services</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Find nearby healthcare facilities, get location-based health recommendations and emergency services.
                  </p>
                  <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Find Healthcare
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Weight Loss Plan */}
            <Link href="/weight-loss">
              <Card className="border-pink-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Weight Loss Plan</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Personalized weight loss plans with Indian diet recommendations and exercise routines.
                  </p>
                  <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    Start Journey
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Heart Health Assessment */}
            <Link href="/heart-health">
              <Card className="border-red-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Heart Health</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Comprehensive cardiac assessment with risk evaluation and personalized care plan.
                  </p>
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Check Heart Health
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Mental Health Assessment */}
            <Link href="/mental-health">
              <Card className="border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Brain className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Depression, anxiety, and stress assessment with personalized mental wellness plan.
                  </p>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Mental Wellness
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Women's Health */}
            <Link href="/womens-health">
              <Card className="border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                    <User className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Women's Health</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Comprehensive women's health assessment including reproductive and hormonal health.
                  </p>
                  <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                    Women's Care
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Child Health */}
            <Link href="/child-health">
              <Card className="border-yellow-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                    <Baby className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Child Health</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Pediatric health assessment with growth tracking and vaccination schedules.
                  </p>
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Child Care
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Elderly Care */}
            <Link href="/elderly-care">
              <Card className="border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Elderly Care</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Specialized health assessment for senior citizens with age-specific recommendations.
                  </p>
                  <Button size="sm" className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                    Senior Care
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Emergency Care */}
            <Link href="/emergency-care">
              <Card className="border-red-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <Shield className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Care</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Emergency health guidance, first aid instructions, and nearest hospital finder.
                  </p>
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Emergency Help
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Fitness Tracker */}
            <Link href="/fitness-tracker">
              <Card className="border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitness Tracker</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Track workouts, steps, calories, and get personalized fitness recommendations.
                  </p>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Track Fitness
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Sleep Analysis */}
            <Link href="/sleep-analysis">
              <Card className="border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                    <Clock className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sleep Analysis</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Analyze sleep patterns, quality, and get personalized sleep improvement recommendations.
                  </p>
                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    Analyze Sleep
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Nutrition Analysis */}
            <Link href="/nutrition-analysis">
              <Card className="border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Apple className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nutrition Analysis</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Analyze your diet, track nutrients, and get personalized nutrition recommendations.
                  </p>
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Analyze Nutrition
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Health Insurance Guide */}
            <Link href="/insurance-guide">
              <Card className="border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance Guide</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Find the best health insurance plans, compare coverage, and get expert recommendations.
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Insurance Help
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Telemedicine */}
            <Link href="/telemedicine">
              <Card className="border-teal-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                    <Stethoscope className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Telemedicine</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Connect with certified doctors online for consultations and medical advice.
                  </p>
                  <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            </Link>
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
            <Card className="border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Baby className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pregnancy & Baby Care</h3>
                <p className="text-gray-600">
                  Comprehensive pregnancy tracking, baby milestones, vaccination schedules, and feeding guides designed
                  for Indian families.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* About the Founder Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-80 max-w-sm bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/harsha-founder.jpeg"
                  alt="Bandarla Harshavardhan - Founder & CEO of MyMedi.ai"
                  width={320}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
            <div className="flex-1 space-y-6">
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
            <Link href="/pregnancy">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Pregnancy Care
                <Baby className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/diabetes-assessment">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Diabetes Assessment
                <Heart className="ml-2 w-5 h-5" />
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
                    Pregnancy Care
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
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
                  <span>+91 9701744770</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Madanapalle, Andhra Pradesh, India</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyMedi.ai. All rights reserved. Made with ❤️ in India.</p>
          </div>
        </div>
      </footer>
      <PoweredByFooter />
    </div>
  )
}
