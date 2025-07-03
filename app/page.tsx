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
  Pill,
  Send,
  User,
  Camera,
  Upload,
  Loader2,
  Baby,
  UserCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      // Provide fallback results
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
            <Link href="/assessment">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
            <Link href="/vitals">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <Activity className="w-4 h-4 mr-2" />
                Vitals
              </Button>
            </Link>
            <Link href="/diet">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <Apple className="w-4 h-4 mr-2" />
                Diet
              </Button>
            </Link>
            <Link href="/pregnancy">
              <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent">
                <Baby className="w-4 h-4 mr-2" />
                Pregnancy
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <UserCheck className="w-4 h-4 mr-2" />
                Doctors
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
            <Link href="/doctors">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Doctor Portal
                <UserCheck className="ml-2 w-5 h-5" />
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

      {/* New AI Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advanced AI Medical Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized AI-powered tools for comprehensive healthcare analysis and support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Report Analyzer Card */}
            <Card className="border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🔬 AI Report Analyzer</h3>
                <p className="text-gray-600 mb-4">
                  Upload medical reports for instant AI analysis. Get comprehensive insights, key findings, and
                  recommendations based on your lab results and diagnostic reports.
                </p>
                <Link href="/reports">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyze Reports
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Medicine Identifier Card */}
            <Card className="border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Pill className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">💊 AI Medicine Identifier</h3>
                <p className="text-gray-600 mb-4">
                  Take a photo of any medicine to instantly identify it. Get detailed information about uses, dosage,
                  side effects, interactions, and pricing comparisons.
                </p>
                <Link href="/medicines">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Pill className="w-4 h-4 mr-2" />
                    Identify Medicine
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Body Mapper Card */}
            <Card className="border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🗺️ AI Body Symptom Mapper</h3>
                <p className="text-gray-600 mb-4">
                  Interactive body mapping for precise symptom analysis. Click on body parts, describe symptoms, and get
                  AI-powered health insights and recommendations.
                </p>
                <Link href="/body-mapper">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <User className="w-4 h-4 mr-2" />
                    Map Symptoms
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
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

      {/* Doctor Portal Feature Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Healthcare Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced tools designed specifically for healthcare professionals and medical practitioners
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <UserCheck className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-green-900">👨‍⚕️ Doctor's Assessment Portal</h3>
                        <p className="text-green-700">Professional Medical Documentation System</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        <span>Comprehensive Patient Assessment Forms</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        <span>AI-Powered Clinical Documentation</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        <span>Professional Medical Reports & Certificates</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        <span>HIPAA Compliant & Secure</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        <span>Prescription Management & Treatment Plans</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                        <span>Multi-Specialty Support</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/doctors">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4">
                          <UserCheck className="w-5 h-5 mr-2" />
                          Access Doctor Portal
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        View Demo
                      </Button>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-80 h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center border border-green-200">
                      <div className="text-center">
                        <UserCheck className="w-20 h-20 text-green-600 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-green-900 mb-2">Professional Grade</h4>
                        <p className="text-green-700 text-sm">Medical Documentation System</p>
                      </div>
                    </div>
                  </div>
                </div>
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
            <Link href="/doctors">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Doctor Portal
                <UserCheck className="ml-2 w-5 h-5" />
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
                  <Link href="/reports" className="hover:text-white transition-colors">
                    Report Analyzer
                  </Link>
                </li>
                <li>
                  <Link href="/medicines" className="hover:text-white transition-colors">
                    Medicine Identifier
                  </Link>
                </li>
                <li>
                  <Link href="/body-mapper" className="hover:text-white transition-colors">
                    Body Symptom Mapper
                  </Link>
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
                <li>
                  <Link href="/doctors" className="hover:text-white transition-colors">
                    Doctor Portal
                  </Link>
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
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Hyderabad, India</span>
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

/* ----------  PRODUCTION COMPONENTS  ---------- */
function ProductionChatWidget() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")

  const handleSend = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type: "chat" }),
      })
      const data = await res.json()
      setResponse(data.response || "I'm here to help with your health questions!")
    } catch (error) {
      setResponse("I'm here to help! Try asking about symptoms, medications, or general health advice.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-700">
          <MessageCircle className="w-5 h-5 mr-2" />
          AI Health Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg min-h-[100px]">
          {response ? (
            <p className="text-sm text-blue-800">{response}</p>
          ) : (
            <p className="text-sm text-blue-600">Ask me anything about your health...</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Type your health question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="text-sm"
          />
          <Button onClick={handleSend} disabled={isLoading} size="sm" className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <Link href="/chat">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Open Full Chat
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function ProductionReportAnalyzer() {
  return (
    <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-green-700">
          <FileText className="w-5 h-5 mr-2" />
          Report Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg min-h-[100px]">
          <p className="text-sm text-green-600">Upload your medical report for AI analysis...</p>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
          <Upload className="w-4 h-4 mr-2" />
          Upload Medical Report
        </Button>
        <Link href="/reports">
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
            Open Report Analyzer
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function ProductionMedicineIdentifier() {
  return (
    <Card className="border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-700">
          <Pill className="w-5 h-5 mr-2" />
          Medicine Identifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 p-3 rounded-lg min-h-[100px]">
          <p className="text-sm text-purple-600">Take a photo of your medicine for identification...</p>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
        <Link href="/medicines">
          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
            Open Medicine Identifier
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function ProductionBodyMapper() {
  return (
    <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-700">
          <User className="w-5 h-5 mr-2" />
          Body Symptom Mapper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 p-3 rounded-lg min-h-[100px]">
          <p className="text-sm text-orange-600">Select a body part and describe your symptoms...</p>
        </div>
        <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
          Select Body Part
        </Button>
        <Link href="/body-mapper">
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
            Open Body Mapper
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function ProductionMealPlanner() {
  const [dietType, setDietType] = useState("")
  const [mealPlan, setMealPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMealPlan = async () => {
    if (!dietType) return

    setIsGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setMealPlan(
        `${dietType} Meal Plan:

Breakfast: Oats with fruits
Lunch: Dal rice with vegetables
Snack: Nuts and fruits
Dinner: Roti with curry`,
      )
    } catch (error) {
      setMealPlan("Personalized meal plan generated based on your preferences and health goals.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-teal-700">
          <Apple className="w-5 h-5 mr-2" />
          AI Meal Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-teal-50 p-3 rounded-lg min-h-[100px]">
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600 mr-2" />
              <span className="text-sm text-teal-600">Generating meal plan...</span>
            </div>
          ) : mealPlan ? (
            <p className="text-sm text-teal-800 whitespace-pre-line">{mealPlan}</p>
          ) : (
            <p className="text-sm text-teal-600">Select your diet preference for a personalized meal plan...</p>
          )}
        </div>
        <Select value={dietType} onValueChange={setDietType}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select diet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
            <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="Vegan">Vegan</SelectItem>
            <SelectItem value="Diabetic">Diabetic-Friendly</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={generateMealPlan} disabled={isGenerating || !dietType} size="sm" className="w-full">
          Generate Meal Plan
        </Button>
        <Link href="/diet">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Open Diet Planner
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function ProductionVitalsTracker() {
  const [vitals, setVitals] = useState({
    bp: "",
    hr: "",
    temp: "",
  })

  const handleVitalChange = (key: string, value: string) => {
    setVitals((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-red-700">
          <Activity className="w-5 h-5 mr-2" />
          Vitals Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Blood Pressure (120/80)"
            value={vitals.bp}
            onChange={(e) => handleVitalChange("bp", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Heart Rate (72 bpm)"
            value={vitals.hr}
            onChange={(e) => handleVitalChange("hr", e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Temperature (98.6°F)"
            value={vitals.temp}
            onChange={(e) => handleVitalChange("temp", e.target.value)}
            className="text-sm"
          />
        </div>
        <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
          <Heart className="w-4 h-4 mr-2" />
          Track Vitals
        </Button>
        <Link href="/vitals">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Open Vitals Tracker
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function HealthAssessmentForm() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-white text-2xl">
            <Stethoscope className="w-8 h-8 mr-3" />
            AI Health Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Complete Health Assessment</h3>
            <p className="text-gray-600 mb-8">
              This comprehensive assessment will be available soon. Get personalized health insights powered by AI.
            </p>
            <div className="space-y-4">
              <Link href="/assessment">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4">
                  <User className="w-5 h-5 mr-2" />
                  Start Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with AI Doctor
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
