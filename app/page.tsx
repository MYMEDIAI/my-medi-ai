"use client"

import { Suspense } from "react"
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
  Mail,
  Phone,
  MapPin,
  Pill,
  User,
  Baby,
  UserCheck,
  Target,
  Zap,
  Crown,
  Sparkles,
  Eye,
  Bone,
  TreesIcon as Lungs,
  Linkedin,
  Twitter,
  Github,
  Code,
  TrendingUp,
  Lightbulb,
  Rocket,
} from "lucide-react"
import HealthAssessmentForm from "@/components/health-assessment-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import EnhancedNavigation from "@/components/enhanced-navigation"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import DemoReportAnalyzer from "@/components/demo-report-analyzer"
import DemoMedicineIdentifier from "@/components/demo-medicine-identifier"
import DemoBodyMapper from "@/components/demo-body-mapper"
import DemoChatWidget from "@/components/demo-chat-widget"

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
export default function HomePage() {
  const [showAssessment, setShowAssessment] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [email, setEmail] = useState("")
  const [healthScore, setHealthScore] = useState(87)
  const [showAbout, setShowAbout] = useState(false)

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

  /* ----------  ABOUT SECTION COMPONENT  ---------- */
  const AboutSection = () => (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 hover:from-blue-200 hover:to-purple-200 mb-4">
            <User className="w-4 h-4 mr-2" />
            About MyMedi.ai
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Meet the Visionary Behind MyMedi.ai
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing healthcare accessibility through cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Founder Profile */}
          <div className="space-y-8">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                      <Image
                        src="/images/harsha-founder.jpeg"
                        alt="Harsha - Founder & CEO"
                        width={96}
                        height={96}
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Harsha</h3>
                    <p className="text-lg text-blue-600 font-semibold">Founder & CEO</p>
                    <p className="text-gray-600">AI Healthcare Innovator</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Amavarathi, Andhra Pradesh, India</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-500" />
                    <a href="tel:+919701744770" className="text-blue-600 hover:underline font-medium">
                      +91 9701744770
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-500" />
                    <a href="mailto:contact@mymed.ai" className="text-blue-600 hover:underline font-medium">
                      contact@mymed.ai
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <a href="https://linkedin.com/in/harsha-mymed" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <a href="https://twitter.com/harsha_mymed" target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <a href="https://github.com/harsha-mymed" target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About Content */}
          <div className="space-y-8">
            <Tabs defaultValue="vision" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-blue-100 to-purple-100">
                <TabsTrigger value="vision" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Vision
                </TabsTrigger>
                <TabsTrigger value="journey" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  <Rocket className="w-4 h-4 mr-2" />
                  Journey
                </TabsTrigger>
                <TabsTrigger value="tech" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  <Code className="w-4 h-4 mr-2" />
                  Technology
                </TabsTrigger>
                <TabsTrigger value="impact" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Impact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vision" className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                      Our Vision
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      "To democratize healthcare access across India by leveraging cutting-edge AI technology. Every
                      person, regardless of their location or economic status, deserves access to quality healthcare
                      guidance."
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">AI-powered healthcare for everyone</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Breaking geographical barriers</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Affordable healthcare solutions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journey" className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Rocket className="w-6 h-6 mr-2 text-blue-500" />
                      The Journey
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Identifying the Problem</h5>
                          <p className="text-gray-600 text-sm">
                            Witnessed healthcare accessibility challenges in rural Andhra Pradesh
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">AI Research & Development</h5>
                          <p className="text-gray-600 text-sm">
                            Deep dive into AI/ML technologies for healthcare applications
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800">Building MyMedi.ai</h5>
                          <p className="text-gray-600 text-sm">
                            Creating India's most comprehensive AI healthcare platform
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tech" className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Code className="w-6 h-6 mr-2 text-purple-500" />
                      Technology Stack
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-100 text-blue-800">OpenAI GPT-4</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">Google Gemini</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-purple-100 text-purple-800">Advanced OCR</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-100 text-orange-800">Next.js 14</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-pink-100 text-pink-800">TypeScript</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-cyan-100 text-cyan-800">Tailwind CSS</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-orange-500" />
                      Development Progress
                    </h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">6</div>
                        <div className="text-sm text-gray-600">AI Services in Beta</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">95%</div>
                        <div className="text-sm text-gray-600">AI Accuracy Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">24/7</div>
                        <div className="text-sm text-gray-600">Platform Availability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">Beta</div>
                        <div className="text-sm text-gray-600">Current Stage</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Mission Statement */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold mb-4 flex items-center">
                  <Heart className="w-6 h-6 mr-2" />
                  Our Mission
                </h4>
                <p className="text-lg leading-relaxed opacity-95">
                  "To bridge the healthcare gap in India by providing intelligent, accessible, and affordable AI-powered
                  medical assistance to every individual, empowering them to make informed health decisions and live
                  healthier lives."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Values */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Trust & Privacy</h4>
                <p className="text-gray-600">
                  Your health data is sacred. We employ the highest security standards to protect your privacy and
                  maintain your trust.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Innovation</h4>
                <p className="text-gray-600">
                  Continuously pushing the boundaries of AI technology to deliver cutting-edge healthcare solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">Compassion</h4>
                <p className="text-gray-600">
                  Every feature is designed with empathy, understanding the human need for accessible healthcare.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-gray-50 to-blue-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-6">
                Have questions about MyMedi.ai or want to collaborate? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  asChild
                >
                  <a href="mailto:contact@mymed.ai">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Us
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  asChild
                >
                  <a href="tel:+919701744770">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )

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

  const aiServices = [
    {
      href: "/chat",
      icon: MessageCircle,
      title: "AI Health Chat",
      description: "24/7 AI doctor consultation with instant medical advice powered by OpenAI GPT-4",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50",
      features: ["Instant responses", "Medical expertise", "Symptom analysis"],
      badge: "GPT-4 Powered",
    },
    {
      href: "/assessment",
      icon: User,
      title: "Health Assessment",
      description: "Comprehensive AI-powered health evaluation and risk analysis using Google Gemini",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      features: ["Risk assessment", "Personalized insights", "Health scoring"],
      badge: "Gemini AI",
    },
    {
      href: "/reports",
      icon: FileText,
      title: "Report Analyzer",
      description: "Advanced OCR + AI analysis of medical reports and lab results with 95% accuracy",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      features: ["OCR extraction", "Parameter analysis", "Health insights"],
      badge: "OCR + AI",
    },
    {
      href: "/medicines",
      icon: Pill,
      title: "Medicine Identifier",
      description: "Smart medicine identification with safety information and price comparison",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      features: ["Image recognition", "Price comparison", "Safety alerts"],
      badge: "Vision AI",
    },
    {
      href: "/body-mapper",
      icon: MapPin,
      title: "Body Symptom Mapper",
      description: "Interactive body mapping for symptom analysis and diagnosis support",
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-50",
      features: ["Visual mapping", "Symptom tracking", "Diagnosis support"],
      badge: "Interactive",
    },
    {
      href: "/vitals",
      icon: Activity,
      title: "Vitals Tracker",
      description: "Monitor and track your vital signs with AI insights and trend analysis",
      color: "from-red-500 to-pink-600",
      bgColor: "from-red-50 to-pink-50",
      features: ["Real-time tracking", "Trend analysis", "Health alerts"],
      badge: "Smart Tracking",
    },
  ]

  const healthTools = [
    {
      href: "/diet",
      icon: Apple,
      title: "AI Diet Planner",
      description: "Personalized nutrition plans based on your health profile and dietary preferences",
      color: "from-green-500 to-lime-600",
    },
    {
      href: "/pregnancy",
      icon: Baby,
      title: "Pregnancy Care",
      description: "Comprehensive pregnancy tracking and care guidance for expecting mothers",
      color: "from-pink-500 to-purple-600",
    },
    {
      href: "/doctors",
      icon: UserCheck,
      title: "Find Doctors",
      description: "Connect with verified healthcare professionals across India",
      color: "from-blue-500 to-indigo-600",
    },
  ]

  const specialties = [
    { name: "Cardiology", icon: Heart, color: "text-red-500" },
    { name: "Neurology", icon: Brain, color: "text-purple-500" },
    { name: "Ophthalmology", icon: Eye, color: "text-blue-500" },
    { name: "Orthopedics", icon: Bone, color: "text-gray-500" },
    { name: "Pulmonology", icon: Lungs, color: "text-cyan-500" },
    { name: "General Medicine", icon: Stethoscope, color: "text-green-500" },
  ]

  /* ----------  MAIN LANDING PAGE  ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* SEO-optimized structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "MyMedi.ai - AI-Powered Healthcare Platform",
            description:
              "Advanced AI healthcare platform offering medical consultations, report analysis, medicine identification, and comprehensive health services in India",
            url: "https://mymedi.ai",
            mainEntity: {
              "@type": "MedicalOrganization",
              name: "MyMedi.ai",
              description: "AI-powered healthcare platform",
              founder: {
                "@type": "Person",
                name: "Harsha",
                jobTitle: "Founder & CEO",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Amavarathi",
                  addressRegion: "Andhra Pradesh",
                  addressCountry: "IN",
                },
                telephone: "+919701744770",
                email: "contact@mymed.ai",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Amavarathi",
                addressRegion: "Andhra Pradesh",
                addressCountry: "IN",
              },
              telephone: "+919701744770",
              email: "contact@mymed.ai",
            },
          }),
        }}
      />

      {/* Enhanced Navigation */}
      <EnhancedNavigation currentPage="home" onAboutClick={() => setShowAbout(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {floatingIcons.map((item) => (
            <div
              key={item.id}
              className="absolute opacity-10 animate-pulse"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                animationDelay: `${item.id * 0.5}s`,
                animationDuration: `${3 + item.id}s`,
              }}
            >
              <item.icon className="w-12 h-12 text-blue-500" />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 px-4 py-2 text-sm animate-pulse">
                <Rocket className="w-4 h-4 mr-2" />
                Beta Version - Experience the Future of Healthcare
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Your AI Health
              <br />
              <span className="relative">
                Companion
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-pulse" />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Experience the future of healthcare with our revolutionary AI platform. Get instant medical insights,
              analyze reports, identify medicines, and receive personalized health guidance - all powered by
              cutting-edge artificial intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/chat">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Start AI Consultation
                  <Sparkles className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg shadow-lg bg-transparent"
                asChild
              >
                <Link href="/assessment">
                  <User className="w-6 h-6 mr-2" />
                  Health Assessment
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg bg-transparent"
                onClick={() => setShowAbout(true)}
              >
                <User className="w-6 h-6 mr-2" />
                About Us
              </Button>
            </div>

            {/* Development Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Rocket className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">Beta</div>
                <div className="text-sm text-gray-600">Current Stage</div>
                <div className="text-xs text-orange-600 font-semibold">In Development</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">6</div>
                <div className="text-sm text-gray-600">AI Services</div>
                <div className="text-xs text-green-600 font-semibold">Available</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">95%</div>
                <div className="text-sm text-gray-600">AI Accuracy</div>
                <div className="text-xs text-purple-600 font-semibold">Tested</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">24/7</div>
                <div className="text-sm text-gray-600">Availability</div>
                <div className="text-xs text-orange-600 font-semibold">Always On</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Conditionally Rendered */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-6xl max-h-[90vh] overflow-y-auto w-full relative">
            <Button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 z-10"
              variant="outline"
              size="sm"
            >
              ✕
            </Button>
            <AboutSection />
          </div>
        </div>
      )}

      {/* AI Services Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 hover:from-purple-200 hover:to-pink-200 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Revolutionary Healthcare AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of healthcare with our comprehensive AI-powered services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiServices.map((service, idx) => (
              <Card
                key={idx}
                className={`border-0 shadow-2xl bg-gradient-to-br ${service.bgColor} hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group`}
              >
                <CardHeader className={`bg-gradient-to-r ${service.color} text-white rounded-t-lg relative`}>
                  <Badge className="absolute top-2 right-2 bg-white/20 text-white text-xs">{service.badge}</Badge>
                  <CardTitle className="flex items-center text-white text-xl">
                    <div className="p-2 bg-white/20 rounded-full mr-3 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-6 h-6" />
                    </div>
                    {service.title}
                    <Sparkles className="w-5 h-5 ml-auto animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">{service.description}</p>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${service.color} hover:scale-105 transition-all duration-300 text-white shadow-lg`}
                    asChild
                  >
                    <Link href={service.href}>
                      Try Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 hover:from-green-200 hover:to-blue-200 mb-4">
              <Target className="w-4 h-4 mr-2" />
              Interactive Demos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Try Our AI Tools Live
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our AI capabilities with these fully functional interactive demonstrations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Suspense fallback={<div>Loading...</div>}>
              <DemoReportAnalyzer />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <DemoMedicineIdentifier />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <DemoBodyMapper />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <DemoChatWidget />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  )
}
