"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Shield,
  ArrowRight,
  Stethoscope,
  Apple,
  Activity,
  Heart,
  Brain,
  Sparkles,
  Target,
  CheckCircle,
  Play,
  Award,
  MessageCircle,
  FileText,
  Languages,
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
  Camera,
  Upload,
  Send,
  Loader2,
  User,
  Utensils,
  Dumbbell,
  Menu,
  X,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye,
  Smile,
  Volume2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  ImageIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

/* ----------  TYPES  ---------- */
interface VitalsData {
  bloodPressure: string
  heartRate: string
  temperature: string
  weight: string
  height: string
  bloodSugar: string
}

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

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  confidence?: number
}

interface VitalReading {
  id: string
  type: string
  value: string
  unit: string
  timestamp: Date
  status: "normal" | "warning" | "critical"
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
  const [activeTab, setActiveTab] = useState("home")
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [email, setEmail] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Assessment State
  const [assessmentLoading, setAssessmentLoading] = useState(false)
  const [assessmentResults, setAssessmentResults] = useState<AIResponse | null>(null)
  const [assessmentError, setAssessmentError] = useState<string | null>(null)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
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
    vitals: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      bloodSugar: "",
    },
  })

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I can help you with health questions, symptom analysis, medication information, and wellness advice. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      confidence: 95,
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  // Vitals State
  const [vitalsData, setVitalsData] = useState<VitalsData>({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    bloodSugar: "",
  })
  const [vitalsHistory, setVitalsHistory] = useState<VitalReading[]>([
    {
      id: "1",
      type: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "normal",
    },
    {
      id: "2",
      type: "Heart Rate",
      value: "72",
      unit: "bpm",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: "normal",
    },
  ])
  const [vitalsAnalysis, setVitalsAnalysis] = useState<string | null>(null)
  const [vitalsLoading, setVitalsLoading] = useState(false)

  // Diet State
  const [dietPreferences, setDietPreferences] = useState({
    condition: "",
    goal: "",
    restrictions: "",
  })
  const [dietPlan, setDietPlan] = useState<string | null>(null)
  const [dietLoading, setDietLoading] = useState(false)

  // Demo State
  const [aiMode, setAiMode] = useState("dual")
  const [demoReportAnalysis, setDemoReportAnalysis] = useState("Drop/Photograph any medical report")
  const [demoBodyMapper, setDemoBodyMapper] = useState({ headache: 85, migraine: 72 })
  const [demoMedicine, setDemoMedicine] = useState("Paracetamol 500mg")

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

  /* ----------  HANDLERS  ---------- */
  const handleEmailSignup = () => {
    if (email) {
      alert(`Thank you! We'll notify you at ${email} when early access is available.`)
      setEmail("")
    }
  }

  const handleAssessmentSubmit = async () => {
    setAssessmentLoading(true)
    setAssessmentError(null)

    try {
      const assessmentPrompt = `
COMPREHENSIVE HEALTH ASSESSMENT REQUEST

PATIENT INFORMATION:
- Name: ${assessmentData.name}
- Age: ${assessmentData.age} years old
- Gender: ${assessmentData.gender}

CURRENT SYMPTOMS:
- Primary Symptoms: ${assessmentData.symptoms}
- Duration: ${assessmentData.duration}
- Severity Level: ${assessmentData.severity}

MEDICAL BACKGROUND:
- Current Medications: ${assessmentData.medications || "None reported"}
- Known Allergies: ${assessmentData.allergies || "None reported"}
- Family Medical History: ${assessmentData.familyHistory || "None reported"}
- Lifestyle Factors: ${assessmentData.lifestyle || "Not specified"}

VITAL SIGNS:
- Blood Pressure: ${assessmentData.vitals.bloodPressure || "Not provided"}
- Heart Rate: ${assessmentData.vitals.heartRate || "Not provided"}
- Temperature: ${assessmentData.vitals.temperature || "Not provided"}
- Weight: ${assessmentData.vitals.weight || "Not provided"}
- Height: ${assessmentData.vitals.height || "Not provided"}
- Blood Sugar: ${assessmentData.vitals.bloodSugar || "Not provided"}

Please provide detailed, actionable recommendations in these specific categories:
1. MEDICATIONS & TREATMENTS
2. HEALTHCARE PROVIDERS
3. DIAGNOSTIC TESTS
4. PHARMACY & MEDICATION ACCESS
5. PERSONALIZED DIET PLAN
6. EXERCISE & PHYSICAL ACTIVITY
7. GENERAL WELLNESS ADVICE
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "assessment",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.response

      if (typeof aiResponse === "object" && aiResponse !== null) {
        setAssessmentResults({
          medications: aiResponse.medications || createFallbackMedications(),
          doctors: aiResponse.doctors || createFallbackDoctors(),
          labs: aiResponse.labs || createFallbackLabs(),
          pharmacy: aiResponse.pharmacy || createFallbackPharmacy(),
          dietPlan: aiResponse.dietPlan || createFallbackDiet(),
          exercise: aiResponse.exercise || createFallbackExercise(),
          generalAdvice: aiResponse.generalAdvice || createFallbackAdvice(),
        })
      } else {
        setAssessmentResults({
          medications: extractSection(String(aiResponse), ["medication", "treatment"]) || createFallbackMedications(),
          doctors: extractSection(String(aiResponse), ["doctor", "physician"]) || createFallbackDoctors(),
          labs: extractSection(String(aiResponse), ["test", "lab", "blood"]) || createFallbackLabs(),
          pharmacy: extractSection(String(aiResponse), ["pharmacy", "medication"]) || createFallbackPharmacy(),
          dietPlan: extractSection(String(aiResponse), ["diet", "nutrition"]) || createFallbackDiet(),
          exercise: extractSection(String(aiResponse), ["exercise", "activity"]) || createFallbackExercise(),
          generalAdvice: extractSection(String(aiResponse), ["advice", "recommendation"]) || createFallbackAdvice(),
        })
      }
    } catch (error) {
      setAssessmentError(error instanceof Error ? error.message : "An error occurred")
      setAssessmentResults({
        medications: createFallbackMedications(),
        doctors: createFallbackDoctors(),
        labs: createFallbackLabs(),
        pharmacy: createFallbackPharmacy(),
        dietPlan: createFallbackDiet(),
        exercise: createFallbackExercise(),
        generalAdvice: createFallbackAdvice(),
      })
    } finally {
      setAssessmentLoading(false)
    }
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setChatLoading(true)

    try {
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          type: "chat",
        }),
      })

      const data = await response.json()
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text:
          data.response ||
          "I'm here to help with your health questions! Please ask me about symptoms, medications, or general health advice.",
        sender: "ai",
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 15) + 85,
      }

      setChatMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact support if the issue persists.",
        sender: "ai",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setChatLoading(false)
    }
  }

  const handleVitalsAnalysis = async () => {
    setVitalsLoading(true)
    try {
      const vitalsPrompt = `
Analyze these vital signs and provide health insights:
- Blood Pressure: ${vitalsData.bloodPressure}
- Heart Rate: ${vitalsData.heartRate} bpm
- Temperature: ${vitalsData.temperature}°F
- Weight: ${vitalsData.weight} lbs
- Height: ${vitalsData.height} inches
- Blood Sugar: ${vitalsData.bloodSugar} mg/dL

Provide analysis and recommendations for these vital signs.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: vitalsPrompt,
          type: "vitals",
        }),
      })

      const data = await response.json()
      setVitalsAnalysis(
        data.response ||
          "Your vitals appear to be within normal ranges. Continue monitoring regularly and consult with healthcare providers for any concerns.",
      )

      // Add to vitals history
      if (vitalsData.bloodPressure || vitalsData.heartRate) {
        const newReading: VitalReading = {
          id: Date.now().toString(),
          type: vitalsData.bloodPressure ? "Blood Pressure" : "Heart Rate",
          value: vitalsData.bloodPressure || vitalsData.heartRate,
          unit: vitalsData.bloodPressure ? "mmHg" : "bpm",
          timestamp: new Date(),
          status: "normal", // Simple status for demo
        }
        setVitalsHistory((prev) => [newReading, ...prev])
      }
    } catch (error) {
      setVitalsAnalysis(
        "Unable to analyze vitals at this time. Please consult with a healthcare provider for proper evaluation.",
      )
    } finally {
      setVitalsLoading(false)
    }
  }

  const handleDietGeneration = async () => {
    setDietLoading(true)
    try {
      const dietPrompt = `
Generate a personalized diet plan for:
- Health Condition: ${dietPreferences.condition}
- Goal: ${dietPreferences.goal}
- Dietary Restrictions: ${dietPreferences.restrictions}

Provide a detailed meal plan with Indian cuisine options, including breakfast, lunch, dinner, and snacks.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: dietPrompt,
          type: "diet",
        }),
      })

      const data = await response.json()
      setDietPlan(
        data.response ||
          "Balanced diet with local Indian foods, plenty of vegetables, whole grains, and adequate protein. Stay hydrated and eat regular meals.",
      )
    } catch (error) {
      setDietPlan(
        "Unable to generate diet plan at this time. Please consult with a nutritionist for personalized dietary advice.",
      )
    } finally {
      setDietLoading(false)
    }
  }

  // Fallback functions
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
• Gradually increase activity level as symptoms improve
• Consider physical therapy if pain or mobility issues persist`

  const createFallbackAdvice = () => `• Monitor symptoms daily and keep a detailed health diary
• Get adequate sleep (7-9 hours nightly) for proper healing
• Manage stress through relaxation techniques, meditation, or counseling
• Avoid smoking and limit alcohol consumption
• Maintain good hygiene practices to prevent infections
• Seek immediate medical care if symptoms worsen significantly
• This assessment is not a substitute for professional medical advice
• Always consult qualified healthcare providers for proper diagnosis and treatment`

  const extractSection = (text: string, keywords: string[]): string => {
    const lines = text.split("\n")
    let section = ""
    let capturing = false

    for (const line of lines) {
      const hasKeyword = keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()))
      if (hasKeyword && (line.includes(":") || line.includes("."))) {
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
    return section.trim()
  }

  const resetAssessment = () => {
    setAssessmentResults(null)
    setAssessmentError(null)
    setAssessmentData({
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
      vitals: {
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
        height: "",
        bloodSugar: "",
      },
    })
  }

  const handleDemoReportUpload = () => {
    setDemoReportAnalysis("Analyzing report... Results will appear here.")
    setTimeout(() => {
      setDemoReportAnalysis(
        "Report analyzed: Blood work shows normal values. Cholesterol slightly elevated - consider dietary changes.",
      )
    }, 2000)
  }

  const handleDemoBodyClick = () => {
    setDemoBodyMapper({ headache: 92, migraine: 68, tension: 45 })
  }

  const handleDemoMedicinePhoto = () => {
    setDemoMedicine("Aspirin 325mg - Generic available for ₹8 vs Brand ₹35")
  }

  /* ----------  RENDER  ---------- */
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />

          {/* Desktop Navigation */}
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
            <Button onClick={() => setActiveTab("chat")} className="bg-purple-600 hover:bg-purple-700 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Quick Chat
            </Button>
            <Button onClick={() => setActiveTab("assessment")} className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Assessment
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
            <Button
              onClick={() => {
                setActiveTab("home")
                setMobileMenuOpen(false)
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              onClick={() => {
                setActiveTab("chat")
                setMobileMenuOpen(false)
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
            <Button
              onClick={() => {
                setActiveTab("assessment")
                setMobileMenuOpen(false)
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Health Assessment
            </Button>
            <Button
              onClick={() => {
                setActiveTab("vitals")
                setMobileMenuOpen(false)
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Activity className="w-4 h-4 mr-2" />
              Vitals Tracker
            </Button>
            <Button
              onClick={() => {
                setActiveTab("diet")
                setMobileMenuOpen(false)
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Apple className="w-4 h-4 mr-2" />
              Diet Planner
            </Button>
            <Button
              onClick={() => {
                setActiveTab("demo")
                setMobileMenuOpen(false)
              }}
              variant="ghost"
              className="w-full justify-start"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Advanced Demo
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Assessment</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Demo</span>
            </TabsTrigger>
          </TabsList>

          {/* HOME TAB */}
          <TabsContent value="home" className="space-y-12">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 rounded-2xl overflow-hidden">
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

              <div className="relative z-10 text-center px-8">
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                    onClick={() => setActiveTab("assessment")}
                  >
                    Start Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
                    onClick={() => setActiveTab("demo")}
                  >
                    Try Advanced Demo
                    <Play className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Quick Access Cards */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => setActiveTab("chat")}
              >
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Health Chat</h3>
                  <p className="text-gray-600 text-sm">Get instant answers to your health questions</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => setActiveTab("assessment")}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Health Assessment</h3>
                  <p className="text-gray-600 text-sm">Comprehensive AI-powered health evaluation</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => setActiveTab("vitals")}
              >
                <CardContent className="p-6 text-center">
                  <Activity className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Vitals Tracker</h3>
                  <p className="text-gray-600 text-sm">Monitor and analyze your vital signs</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => setActiveTab("diet")}
              >
                <CardContent className="p-6 text-center">
                  <Apple className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Diet Planner</h3>
                  <p className="text-gray-600 text-sm">Personalized nutrition recommendations</p>
                </CardContent>
              </Card>
            </section>

            {/* Stats Section */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            </section>

            {/* About the Founder Section */}
            <section className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/harsha-founder.jpeg"
                      alt="Bandarla Harshavardhan - Founder & CEO of MyMedi.ai"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
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
                    Harshavardhan combines technical expertise with human-centered design. As a Stanford d.school
                    University Innovation Fellow and MBA graduate, he founded MyMedi.ai to democratize healthcare access
                    for 1.4 billion Indians using AI technology.
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
            </section>

            {/* Email Signup */}
            <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Start Your Health Journey Today</h2>
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
            </section>
          </TabsContent>

          {/* AI CHAT TAB */}
          <TabsContent value="chat" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">AI Health Assistant</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chat with our AI-powered health assistant for instant medical guidance and support
              </p>
            </div>

            {/* Disclaimer Alert */}
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Medical Disclaimer:</strong> This AI provides general health information only and is not a
                substitute for professional medical advice, diagnosis, or treatment. For emergencies, call 911. Always
                consult healthcare professionals for medical concerns.
              </AlertDescription>
            </Alert>

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Health Chat Assistant
                  <Badge className="ml-auto bg-green-100 text-green-800">
                    <Activity className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.sender === "ai" && (
                            <MyMedLogo size="sm" showText={false} className="flex-shrink-0 mt-1" />
                          )}
                          {message.sender === "user" && <User className="w-5 h-5 flex-shrink-0 mt-1" />}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{message.timestamp.toLocaleTimeString()}</span>
                                {message.confidence && (
                                  <>
                                    <span>•</span>
                                    <span className="text-green-600">{message.confidence}% confidence</span>
                                  </>
                                )}
                              </div>
                              {message.sender === "ai" && (
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigator.clipboard.writeText(message.text)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ThumbsUp className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <ThumbsDown className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me about your health concerns..."
                      onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                      disabled={chatLoading}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-100">
                        <Mic className="w-3 h-3 text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-100">
                        <ImageIcon className="w-3 h-3 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleChatSubmit} disabled={chatLoading || !chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("Can I take ibuprofen with antibiotics?")}
                  >
                    Medicine interactions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("What are symptoms of low vitamin D?")}
                  >
                    Vitamin deficiency
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("When should I see a doctor for headaches?")}
                  >
                    When to see doctor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HEALTH ASSESSMENT TAB */}
          <TabsContent value="assessment" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">Comprehensive Health Assessment</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get AI-powered health analysis with personalized recommendations and action plans
              </p>
            </div>

            {assessmentLoading ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-8">
                    <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
                    <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-blue-200 animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">🤖 AI Analysis in Progress</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Our AI is analyzing your health information and generating personalized recommendations...
                  </p>
                  <div className="flex items-center gap-3 text-gray-500 mt-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span className="ml-3">Processing your medical data...</span>
                  </div>
                </CardContent>
              </Card>
            ) : assessmentResults ? (
              <div className="max-w-6xl mx-auto space-y-6">
                {assessmentError && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Note: Using fallback recommendations. {assessmentError}</AlertDescription>
                  </Alert>
                )}

                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl text-green-700">
                      <CheckCircle className="h-6 w-6" />
                      Your Health Assessment Results
                    </CardTitle>
                    <p className="text-gray-600">
                      Generated for <strong>{assessmentData.name}</strong> on {new Date().toLocaleDateString()}
                    </p>
                  </CardHeader>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="border-red-200 bg-red-50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700">
                        <Pill className="h-5 w-5" />💊 Medications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 whitespace-pre-line">{assessmentResults.medications}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <User className="h-5 w-5" />
                        👨‍⚕️ Healthcare Providers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 whitespace-pre-line">{assessmentResults.doctors}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-700">
                        <Activity className="h-5 w-5" />🔬 Recommended Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 whitespace-pre-line">{assessmentResults.labs}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <Utensils className="h-5 w-5" />
                        🍽️ Diet Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 whitespace-pre-line">{assessmentResults.dietPlan}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                        <Dumbbell className="h-5 w-5" />
                        🏃‍♂️ Exercise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 whitespace-pre-line">{assessmentResults.exercise}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-indigo-200 bg-indigo-50 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-indigo-700">
                        <AlertCircle className="h-5 w-5" />💡 General Advice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-700 whitespace-pre-line">{assessmentResults.generalAdvice}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={resetAssessment} variant="outline" size="lg">
                    🔄 New Assessment
                  </Button>
                  <Button onClick={() => window.print()} size="lg">
                    🖨️ Print Results
                  </Button>
                  <Button
                    onClick={() => {
                      const text = `Health Assessment Results for ${assessmentData.name}\n\n${Object.entries(
                        assessmentResults,
                      )
                        .map(([key, value]) => `${key.toUpperCase()}:\n${value}\n\n`)
                        .join("")}`
                      navigator.clipboard.writeText(text)
                      alert("Results copied to clipboard!")
                    }}
                    variant="secondary"
                    size="lg"
                  >
                    📋 Copy Results
                  </Button>
                </div>

                <Alert className="bg-yellow-50 border-yellow-400">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Important Medical Disclaimer:</strong> This AI assessment is for informational purposes only
                    and should not replace professional medical advice, diagnosis, or treatment. Always consult with
                    qualified healthcare providers for proper medical evaluation and treatment decisions.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle>Complete Health Assessment Form</CardTitle>
                  <p className="text-gray-600">Fill out all sections for comprehensive AI analysis</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={assessmentData.name}
                        onChange={(e) => setAssessmentData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={assessmentData.age}
                        onChange={(e) => setAssessmentData((prev) => ({ ...prev, age: e.target.value }))}
                        placeholder="Enter your age"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={assessmentData.gender}
                      onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, gender: value }))}
                    >
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

                  {/* Symptoms */}
                  <div>
                    <Label htmlFor="symptoms">Current Symptoms *</Label>
                    <Textarea
                      id="symptoms"
                      value={assessmentData.symptoms}
                      onChange={(e) => setAssessmentData((prev) => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Describe your current symptoms in detail..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select
                        value={assessmentData.duration}
                        onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, duration: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="severity">Severity (1-10)</Label>
                      <Select
                        value={assessmentData.severity}
                        onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, severity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          {severityOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea
                        id="medications"
                        value={assessmentData.medications}
                        onChange={(e) => setAssessmentData((prev) => ({ ...prev, medications: e.target.value }))}
                        placeholder="List current medications..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="allergies">Known Allergies</Label>
                      <Textarea
                        id="allergies"
                        value={assessmentData.allergies}
                        onChange={(e) => setAssessmentData((prev) => ({ ...prev, allergies: e.target.value }))}
                        placeholder="List known allergies..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="familyHistory">Family Medical History</Label>
                    <Textarea
                      id="familyHistory"
                      value={assessmentData.familyHistory}
                      onChange={(e) => setAssessmentData((prev) => ({ ...prev, familyHistory: e.target.value }))}
                      placeholder="Describe family medical history..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lifestyle">Lifestyle Information</Label>
                    <Textarea
                      id="lifestyle"
                      value={assessmentData.lifestyle}
                      onChange={(e) => setAssessmentData((prev) => ({ ...prev, lifestyle: e.target.value }))}
                      placeholder="Exercise, diet, smoking, alcohol, sleep patterns..."
                      rows={2}
                    />
                  </div>

                  {/* Vitals */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Vital Signs (Optional)</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bloodPressure">Blood Pressure</Label>
                        <Input
                          id="bloodPressure"
                          value={assessmentData.vitals.bloodPressure}
                          onChange={(e) =>
                            setAssessmentData((prev) => ({
                              ...prev,
                              vitals: { ...prev.vitals, bloodPressure: e.target.value },
                            }))
                          }
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                        <Input
                          id="heartRate"
                          value={assessmentData.vitals.heartRate}
                          onChange={(e) =>
                            setAssessmentData((prev) => ({
                              ...prev,
                              vitals: { ...prev.vitals, heartRate: e.target.value },
                            }))
                          }
                          placeholder="72"
                        />
                      </div>
                      <div>
                        <Label htmlFor="temperature">Temperature (°F)</Label>
                        <Input
                          id="temperature"
                          value={assessmentData.vitals.temperature}
                          onChange={(e) =>
                            setAssessmentData((prev) => ({
                              ...prev,
                              vitals: { ...prev.vitals, temperature: e.target.value },
                            }))
                          }
                          placeholder="98.6"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleAssessmentSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4"
                    size="lg"
                    disabled={!assessmentData.name || !assessmentData.age || !assessmentData.symptoms}
                  >
                    🤖 Generate AI Health Assessment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* VITALS TRACKER TAB */}
          <TabsContent value="vitals" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-green-900 mb-4">Vitals Tracker</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Monitor your vital signs and get AI-powered health insights
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Record Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bp">Blood Pressure</Label>
                      <Input
                        id="bp"
                        value={vitalsData.bloodPressure}
                        onChange={(e) => setVitalsData((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                        placeholder="120/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hr">Heart Rate (bpm)</Label>
                      <Input
                        id="hr"
                        value={vitalsData.heartRate}
                        onChange={(e) => setVitalsData((prev) => ({ ...prev, heartRate: e.target.value }))}
                        placeholder="72"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temp">Temperature (°F)</Label>
                      <Input
                        id="temp"
                        value={vitalsData.temperature}
                        onChange={(e) => setVitalsData((prev) => ({ ...prev, temperature: e.target.value }))}
                        placeholder="98.6"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        value={vitalsData.weight}
                        onChange={(e) => setVitalsData((prev) => ({ ...prev, weight: e.target.value }))}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (inches)</Label>
                      <Input
                        id="height"
                        value={vitalsData.height}
                        onChange={(e) => setVitalsData((prev) => ({ ...prev, height: e.target.value }))}
                        placeholder="68"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="sugar"
                        value={vitalsData.bloodSugar}
                        onChange={(e) => setVitalsData((prev) => ({ ...prev, bloodSugar: e.target.value }))}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <Button onClick={handleVitalsAnalysis} className="w-full" disabled={vitalsLoading}>
                    {vitalsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Analyze Vitals
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Vitals History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vitalsHistory.map((reading) => (
                      <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{reading.type}</p>
                          <p className="text-sm text-gray-600">{reading.timestamp.toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {reading.value} {reading.unit}
                          </p>
                          <Badge
                            className={
                              reading.status === "normal"
                                ? "bg-green-100 text-green-800"
                                : reading.status === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {reading.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {vitalsAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{vitalsAnalysis}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* DIET PLANNER TAB */}
          <TabsContent value="diet" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-orange-900 mb-4">AI Diet Planner</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get personalized nutrition recommendations based on your health goals
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-orange-600" />
                  Diet Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="condition">Health Condition</Label>
                  <Select
                    value={dietPreferences.condition}
                    onValueChange={(value) => setDietPreferences((prev) => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select health condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diabetes">Diabetes</SelectItem>
                      <SelectItem value="hypertension">High Blood Pressure</SelectItem>
                      <SelectItem value="heart-disease">Heart Disease</SelectItem>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="weight-gain">Weight Gain</SelectItem>
                      <SelectItem value="general">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Primary Goal</Label>
                  <Select
                    value={dietPreferences.goal}
                    onValueChange={(value) => setDietPreferences((prev) => ({ ...prev, goal: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose-weight">Lose Weight</SelectItem>
                      <SelectItem value="gain-weight">Gain Weight</SelectItem>
                      <SelectItem value="maintain-weight">Maintain Weight</SelectItem>
                      <SelectItem value="build-muscle">Build Muscle</SelectItem>
                      <SelectItem value="improve-energy">Improve Energy</SelectItem>
                      <SelectItem value="better-digestion">Better Digestion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="restrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="restrictions"
                    value={dietPreferences.restrictions}
                    onChange={(e) => setDietPreferences((prev) => ({ ...prev, restrictions: e.target.value }))}
                    placeholder="Allergies, vegetarian, vegan, etc."
                    rows={2}
                  />
                </div>

                <Button onClick={handleDietGeneration} className="w-full" disabled={dietLoading}>
                  {dietLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Utensils className="mr-2 h-4 w-4" />
                      Generate Diet Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {dietPlan && (
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-green-600" />
                    Your Personalized Diet Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{dietPlan}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ADVANCED DEMO TAB */}
          <TabsContent value="demo" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-900 mb-4">Advanced AI Demo</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience cutting-edge AI features for healthcare innovation
              </p>
            </div>

            {/* AI Mode Selector */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Mode Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={aiMode === "openai" ? "default" : "outline"}
                    onClick={() => setAiMode("openai")}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Brain className="h-6 w-6 mb-2" />
                    OpenAI GPT
                  </Button>
                  <Button
                    variant={aiMode === "gemini" ? "default" : "outline"}
                    onClick={() => setAiMode("gemini")}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Sparkles className="h-6 w-6 mb-2" />
                    Google Gemini
                  </Button>
                  <Button
                    variant={aiMode === "dual" ? "default" : "outline"}
                    onClick={() => setAiMode("dual")}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <Target className="h-6 w-6 mb-2" />
                    Dual AI
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Current mode:{" "}
                  <strong>
                    {aiMode === "dual"
                      ? "Dual AI (Best Results)"
                      : aiMode === "openai"
                        ? "OpenAI GPT"
                        : "Google Gemini"}
                  </strong>
                </p>
              </CardContent>
            </Card>

            {/* Demo Features Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Report Analyzer */}
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Medical Report Analyzer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{demoReportAnalysis}</p>
                    <Button onClick={handleDemoReportUpload} variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Upload/Photo Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Body Mapper */}
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Interactive Body Mapper
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className="w-32 h-48 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full mx-auto mb-4 cursor-pointer hover:shadow-lg transition-shadow relative"
                      onClick={handleDemoBodyClick}
                    >
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold">
                        Click me
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Headache:</span>
                        <Badge className="bg-red-100 text-red-800">{demoBodyMapper.headache}%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Migraine Risk:</span>
                        <Badge className="bg-orange-100 text-orange-800">{demoBodyMapper.migraine}%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medicine Identifier */}
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-purple-600" />
                    Medicine Identifier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Pill className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{demoMedicine}</p>
                    <Button onClick={handleDemoMedicinePhoto} variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Photo Medicine
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Assistant */}
              <Card className="hover:shadow-xl transition-shadow border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Emergency Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">24/7 Emergency AI Support</p>
                    <div className="space-y-2">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <Phone className="mr-2 h-4 w-4" />
                        Emergency Call: 108
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Emergency Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Innovation Showcase */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Innovation Showcase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Computer Vision</h4>
                    <p className="text-sm text-gray-600">Analyze medical images and reports</p>
                  </div>
                  <div className="text-center p-4">
                    <Volume2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Voice AI</h4>
                    <p className="text-sm text-gray-600">Voice-powered health consultations</p>
                  </div>
                  <div className="text-center p-4">
                    <Smile className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Emotion AI</h4>
                    <p className="text-sm text-gray-600">Mental health and mood analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Contact Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions? Need support? We're here to help you on your health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">24/7 Health Helpline</p>
                <a href="tel:+919701744770" className="text-blue-600 hover:underline font-semibold">
                  +91-9701744770
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Get detailed responses</p>
                <a href="mailto:Harsha@mymedi.ai" className="text-green-600 hover:underline font-semibold">
                  Harsha@mymedi.ai
                </a>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Quick chat support</p>
                <a
                  href="https://wa.me/919701744770"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-semibold"
                >
                  Chat on WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
              <span>Hyderabad, Telangana, India 🇮🇳</span>
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.linkedin.com/company/my-medi-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/share/19X8ivFr6Z/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/my_medi.ai?igsh=b283cDExejh4cjc1&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a href="https://wa.me/919701744770" target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg">
            <MessageCircle className="w-6 h-6" />
          </Button>
        </a>
      </div>

      <PoweredByFooter />
    </div>
  )
}
