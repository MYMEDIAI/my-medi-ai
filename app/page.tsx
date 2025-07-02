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
  Users,
  Brain,
  Sparkles,
  Target,
  CheckCircle,
  Play,
  Zap,
  Microscope,
  TrendingUp,
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
  Cloud,
  Cpu,
  Lock,
  BookOpen,
  Facebook,
  Instagram,
  Camera,
  Mic,
  Upload,
  MapPin,
  Pill,
  AlertTriangle,
  Eye,
  Smile,
  Volume2,
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

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

/* ----------  SIMPLE TYPES  ---------- */
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

/* ----------  COMPONENT  ---------- */
export default function Home() {
  const [showAssessment, setShowAssessment] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [email, setEmail] = useState("")
  const [healthScore, setHealthScore] = useState(87)
  const [aiMode, setAiMode] = useState("dual")
  const [isListening, setIsListening] = useState(false)
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

  const handleEmailSignup = () => {
    if (email) {
      alert(`Thank you! We'll notify you at ${email} when early access is available.`)
      setEmail("")
    }
  }

  const startVoiceCommand = () => {
    setIsListening(true)
    setTimeout(() => setIsListening(false), 3000)
  }

  /* ----------  DEMO SCREEN  ---------- */
  if (showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
        {/* Demo Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <span className="text-xl font-bold">MyMedi.ai</span>
                </div>
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">🟢 OpenAI Active</Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">🟢 Gemini Active</Badge>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">🇮🇳 Hindi</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-gray-300">Welcome, </span>
                  <span className="text-white font-semibold">Demo User</span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">∞ Unlimited (Demo Mode)</Badge>
                <Button
                  onClick={() => setShowDemo(false)}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  Exit Demo
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <div className="container mx-auto px-4 py-8">
          {/* AI Mode Selector */}
          <div className="mb-8 flex items-center justify-center space-x-4">
            <span className="text-sm text-gray-300">AI Mode:</span>
            <div className="flex bg-black/30 rounded-lg p-1">
              <Button
                size="sm"
                variant={aiMode === "single" ? "default" : "ghost"}
                onClick={() => setAiMode("single")}
                className="text-xs"
              >
                Single AI
              </Button>
              <Button
                size="sm"
                variant={aiMode === "dual" ? "default" : "ghost"}
                onClick={() => setAiMode("dual")}
                className="text-xs"
              >
                Dual AI
              </Button>
              <Button
                size="sm"
                variant={aiMode === "consensus" ? "default" : "ghost"}
                onClick={() => setAiMode("consensus")}
                className="text-xs"
              >
                AI Consensus
              </Button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {/* Dual AI Health Assistant */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 backdrop-blur-sm col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>🧠 DUAL AI HEALTH ASSISTANT</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-300">Ask in any Indian language or dialect</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-300">OpenAI GPT-4</span>
                      </div>
                      <p className="text-sm text-gray-300">Based on your symptoms, this could be...</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-300">Google Gemini</span>
                      </div>
                      <p className="text-sm text-gray-300">I agree, but also consider...</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={startVoiceCommand}
                      className={`bg-red-500/20 border-red-500/30 ${isListening ? "animate-pulse" : ""}`}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      {isListening ? "Listening..." : "Voice Input"}
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-300 bg-transparent">
                      AI Debate Mode
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instant Report Analyzer */}
            <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Camera className="w-5 h-5 text-green-400" />
                  <span className="text-sm">📸 INSTANT REPORT ANALYZER</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-green-500/30">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <p className="text-xs text-gray-300">Drop/Photograph any medical report</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <div className="w-full h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-300">Live camera feed preview</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-green-500/20 border-green-500/30">
                    Start OCR Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Body Mapper */}
            <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5 text-red-400" />
                  <span className="text-sm">🎯 SYMPTOM BODY MAPPER</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="w-full h-32 bg-gradient-to-b from-red-500/20 to-orange-500/20 rounded flex items-center justify-center">
                      <div className="text-center">
                        <Users className="w-12 h-12 mx-auto mb-2 text-red-400" />
                        <p className="text-xs text-gray-300">3D Human Body Model</p>
                        <p className="text-xs text-gray-400">(Rotatable)</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Headache</span>
                      <span className="text-red-400">85%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Migraine</span>
                      <span className="text-orange-400">72%</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-red-500/20 border-red-500/30">
                    Book Nearest Doctor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visual Medicine Identifier */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Pill className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">💊 VISUAL MEDICINE IDENTIFIER</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-blue-500/30">
                    <div className="text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <p className="text-xs text-gray-300">Snap a photo of any pill/medicine</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-black/30 rounded p-2">
                      <p className="text-xs text-blue-300">Paracetamol 500mg</p>
                      <p className="text-xs text-gray-400">Generic: ₹5 vs Brand: ₹25</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-blue-500/20 border-blue-500/30">
                    Check Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Meal Planner */}
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Apple className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">🍽️ AI MEAL PLANNER</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-xs text-gray-300 mb-2">Today's Recommendation:</p>
                    <p className="text-xs text-yellow-300">Breakfast: Poha with vegetables</p>
                    <p className="text-xs text-yellow-300">Lunch: Dal rice with sabzi</p>
                    <p className="text-xs text-yellow-300">Dinner: Roti with curry</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-black/30 rounded p-2 text-center">
                      <p className="text-green-400">1800</p>
                      <p className="text-gray-400">Calories</p>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <p className="text-blue-400">₹150</p>
                      <p className="text-gray-400">Budget</p>
                    </div>
                    <div className="bg-black/30 rounded p-2 text-center">
                      <p className="text-purple-400">Local</p>
                      <p className="text-gray-400">Ingredients</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-yellow-500/20 border-yellow-500/30">
                    Generate Grocery List
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Fusion */}
            <Card className="bg-gradient-to-br from-teal-500/20 to-green-500/20 border-teal-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="w-5 h-5 text-teal-400" />
                  <span className="text-sm">🧘 WELLNESS FUSION</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-xs text-gray-300 mb-2">Today's Routine:</p>
                    <p className="text-xs text-teal-300">• 10 min Pranayama</p>
                    <p className="text-xs text-teal-300">• 15 min Yoga Asanas</p>
                    <p className="text-xs text-teal-300">• 20 min Cardio Walk</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-teal-400" />
                      <span className="text-xs text-gray-300">AR Exercise Preview</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-teal-500/20 border-teal-500/30">
                    Start Workout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Health Insights */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">🔬 PREDICTIVE HEALTH INSIGHTS</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <p className="text-xs text-gray-300 mb-2">Your health in 5 years:</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Diabetes Risk</span>
                        <span className="text-yellow-400">15%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Heart Disease</span>
                        <span className="text-green-400">8%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Overall Health</span>
                        <span className="text-blue-400">Good</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-purple-500/20 border-purple-500/30">
                    View Prevention Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Second Opinion */}
            <Card className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border-indigo-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Stethoscope className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm">👨‍⚕️ AI SECOND OPINION</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-indigo-500/30">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
                      <p className="text-xs text-gray-300">Upload doctor's prescription</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-xs text-indigo-300">Questions to ask your doctor:</p>
                    <p className="text-xs text-gray-400">• Are there alternative treatments?</p>
                    <p className="text-xs text-gray-400">• What are the side effects?</p>
                  </div>
                  <Button size="sm" className="w-full bg-indigo-500/20 border-indigo-500/30">
                    Analyze Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Assistant */}
            <Card className="bg-gradient-to-br from-red-600/30 to-red-500/20 border-red-500/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-sm">🚨 EMERGENCY ASSISTANT</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg animate-pulse">
                    🚨 EMERGENCY
                  </Button>
                  <div className="bg-black/30 rounded p-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span className="text-gray-300">Auto-location detected</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Medical history ready to share</p>
                  </div>
                  <Button size="sm" className="w-full bg-red-500/20 border-red-500/30">
                    First-Aid AR Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Family Health Tree */}
            <Card className="bg-gradient-to-br from-green-600/20 to-teal-500/20 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-sm">🧬 FAMILY HEALTH TREE</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="text-center">
                      <div className="w-full h-20 bg-gradient-to-b from-green-500/20 to-teal-500/20 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-300">Visual Family Tree</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-green-300">Genetic Risk: Diabetes (Mother's side)</p>
                    <p className="text-yellow-300">Screening due: Cholesterol check</p>
                  </div>
                  <Button size="sm" className="w-full bg-green-500/20 border-green-500/30">
                    Share with Family
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Vaccination Tracker */}
            <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm">💉 SMART VACCINATION TRACKER</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/30 rounded p-2">
                    <p className="text-xs text-cyan-300 mb-1">Next Due:</p>
                    <p className="text-xs text-gray-300">COVID Booster - 2 months</p>
                    <p className="text-xs text-gray-300">Pet Vaccination - 1 week</p>
                  </div>
                  <div className="bg-black/30 rounded p-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span className="text-gray-300">3 centers nearby</span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-cyan-500/20 border-cyan-500/30">
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hospital Wait Time */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-sm">🏥 HOSPITAL WAIT TIME</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="bg-black/30 rounded p-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">City Hospital ER</span>
                        <span className="text-green-400">15 min</span>
                      </div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Metro Medical</span>
                        <span className="text-yellow-400">45 min</span>
                      </div>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Apollo Clinic</span>
                        <span className="text-red-400">2 hours</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-orange-500/20 border-orange-500/30">
                    Check Insurance Coverage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Features Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Voice Commands */}
            <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">🎙️ VOICE COMMANDS</span>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <p>"Hey MyMedi" activation</p>
                  <p>• "What should I eat today?"</p>
                  <p>• "Analyze my sleep pattern"</p>
                  <p>• "Is this rash serious?"</p>
                  <p>• "Remind me to take medicine"</p>
                </div>
              </CardContent>
            </Card>

            {/* Live Health Score */}
            <Card className="bg-black/30 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">📊 LIVE HEALTH SCORE</span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{healthScore}</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${healthScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2">Excellent Health</p>
                </div>
              </CardContent>
            </Card>

            {/* Community Features */}
            <Card className="bg-black/30 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">🌍 COMMUNITY</span>
                </div>
                <div className="space-y-2 text-xs text-gray-300">
                  <p>• Anonymous health discussions</p>
                  <p>• Local health alerts</p>
                  <p>• Find health buddies</p>
                  <p>• Medicine availability</p>
                </div>
              </CardContent>
            </Card>

            {/* Innovation Demos */}
            <Card className="bg-black/30 border-yellow-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">🚀 TRY THESE</span>
                </div>
                <div className="space-y-1 text-xs">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start p-1 h-auto text-xs text-gray-300 hover:text-white"
                  >
                    🗣️ Cough into phone
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start p-1 h-auto text-xs text-gray-300 hover:text-white"
                  >
                    🤳 Selfie skin analysis
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start p-1 h-auto text-xs text-gray-300 hover:text-white"
                  >
                    👁️ Eye movement test
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start p-1 h-auto text-xs text-gray-300 hover:text-white"
                  >
                    🦷 Smile for dental check
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Floating Widgets */}
          <div className="fixed bottom-6 right-6 space-y-4 z-40">
            {/* Medicine Reminder */}
            <Card className="bg-black/80 border-purple-500/30 backdrop-blur-sm w-48">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Pill className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-white">Next Dose</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">2h 15m</div>
                  <Button size="sm" className="w-full mt-2 bg-purple-500/20 border-purple-500/30">
                    Mark as Taken
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Tracker */}
            <Card className="bg-black/80 border-blue-500/30 backdrop-blur-sm w-48">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Smile className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-white">Mood Today</span>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-lg p-1">
                    😊
                  </Button>
                  <Button size="sm" variant="ghost" className="text-lg p-1">
                    😐
                  </Button>
                  <Button size="sm" variant="ghost" className="text-lg p-1">
                    😔
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Footer */}
        <footer className="bg-black/40 border-t border-purple-500/30 py-4">
          <div className="container mx-auto px-4">
            <div className="text-center text-xs text-gray-400">
              Powered by OpenAI GPT-4 + Google Gemini | 256-bit Encryption | HIPAA Compliant | Made in India 🇮🇳
            </div>
          </div>
        </footer>
      </div>
    )
  }

  /* ----------  DEFAULT LANDING  ---------- */
  if (!showAssessment) {
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
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Learn More
                <Play className="ml-2 w-5 h-5" />
              </Button>
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
                    Available in Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Marathi, Punjabi, and
                    more.
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
                    Combines modern medicine with traditional Ayurveda, Yoga, Unani, Siddha, and Homeopathy practices
                    for holistic care.
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
          </div>
        </section>

        {/* Why MyMedi.ai Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built for India, Powered by Innovation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding India's unique healthcare challenges and providing AI-powered solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🇮🇳</span>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-900 mb-4">Truly Indian</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Designed for Indian health standards, dietary habits, cultural needs, and traditional medicine
                    practices. Understanding the diversity of India's healthcare landscape.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">AI-First Approach</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Google Gemini integration with massive context understanding. Advanced machine learning algorithms
                    trained on Indian health data and medical practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-teal-50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4">Privacy Focused</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your health data is encrypted and never shared without consent. HIPAA compliant infrastructure with
                    Indian data protection standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to get started with AI-powered healthcare
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 transform -translate-y-1/2"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900 mb-3">Sign Up</h3>
                  <p className="text-gray-600">Create your free account in seconds. No credit card required.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">Add Health Info</h3>
                  <p className="text-gray-600">Upload medical records, add vitals, and share your health history.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-3">Ask AI</h3>
                  <p className="text-gray-600">Get instant health insights in your preferred Indian language.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-900 mb-3">Track Progress</h3>
                  <p className="text-gray-600">Monitor health goals and track improvements over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powered by Cutting-Edge Technology</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built with the latest AI and cloud technologies for reliability and performance
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Google Gemini AI</h3>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Cpu className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Python</h3>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Flask</h3>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Microscope className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Machine Learning</h3>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-teal-50 to-cyan-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Cloud className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Cloud Infrastructure</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial/Vision Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users className="w-12 h-12 text-white" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
                "Technology should empower, not exclude. At MyMedi.ai, we're ensuring every Indian has access to quality
                healthcare advice, regardless of language or location."
              </blockquote>
              <div className="text-purple-200 text-lg">— Bandarla Harshavardhan, Founder & CEO</div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience the Future of Healthcare</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Try our revolutionary AI-powered healthcare platform with advanced features
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <Play className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">Advanced Demo Dashboard</h3>
                  </div>
                  <p className="mb-6 text-purple-100">
                    Experience our futuristic healthcare dashboard with dual AI integration, 3D body mapping, instant
                    report analysis, and revolutionary features not available anywhere else.
                  </p>
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>Dual AI (OpenAI + Google Gemini)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>3D Symptom Body Mapper</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>Visual Medicine Identifier</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>AI Meal Planner & Emergency Assistant</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 w-full"
                    onClick={() => setShowDemo(true)}
                  >
                    Launch Advanced Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600 to-teal-600 text-white">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <MessageCircle className="w-8 h-8" />
                    <h3 className="text-2xl font-bold">AI Chat Assistant</h3>
                  </div>
                  <p className="mb-6 text-green-100">
                    Chat with our AI health assistant and get instant answers to your health questions in your preferred
                    Indian language.
                  </p>
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>10+ Indian Languages</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>Voice Input Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>Instant Health Insights</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-300" />
                      <span>24/7 Availability</span>
                    </div>
                  </div>
                  <Link href="/chat">
                    <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 w-full">
                      Try AI Chat Demo
                      <MessageCircle className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
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

        {/* Trust Badges */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">
                <Lock className="w-4 h-4 mr-2" />
                Data Encrypted
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                HIPAA Compliant
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">
                <Award className="w-4 h-4 mr-2" />
                ISO Certified
              </Badge>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <MyMedLogo size="md" />
                <p className="text-gray-400">
                  AI-powered healthcare for every Indian. Democratizing access to quality medical advice.
                </p>
                <div className="text-sm text-gray-500">Made with ❤️ in India for Indians</div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
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
                      Data Protection
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
                <h3 className="font-semibold mb-4">Connect</h3>
                <div className="flex space-x-4 mb-4">
                  <a
                    href="https://www.linkedin.com/company/my-medi-ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-white"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </a>
                  <a
                    href="https://www.facebook.com/share/19X8ivFr6Z/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-white"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                  </a>
                  <a
                    href="https://www.instagram.com/my_medi.ai?igsh=b283cDExejh4cjc1&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-white"
                    >
                      <Instagram className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:Harsha@mymedi.ai" className="hover:text-white transition-colors">
                      Harsha@mymedi.ai
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href="tel:+919701744770" className="hover:text-white transition-colors">
                      +91-9701744770
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>© 2024 MyMedi.ai. Democratizing Healthcare with AI.</p>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <a href="https://wa.me/919701744770" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </a>
        </div>
      </div>
    )
  }

  /* ----------  ASSESSMENT FLOW  ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Top bar */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div onClick={() => setShowAssessment(false)} className="cursor-pointer">
            <MyMedLogo size="lg" />
          </div>
          <Button onClick={() => setShowAssessment(false)} variant="outline">
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-600">
              Step {step} / {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-8">
          {/* STEP 1 */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Personal Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputRow label="Full Name*" value={form.name} onChange={(v) => handle("name", v)} />
                <InputRow label="Age*" type="number" value={form.age} onChange={(v) => handle("age", v)} />
                <InputRow
                  label="Weight (kg)*"
                  type="number"
                  value={form.weight}
                  onChange={(v) => handle("weight", v)}
                />
                <InputRow
                  label="Height (cm)*"
                  type="number"
                  value={form.height}
                  onChange={(v) => handle("height", v)}
                />
                <SelectRow
                  label="Gender*"
                  value={form.gender}
                  options={["male", "female", "other"]}
                  onChange={(v) => handle("gender", v)}
                />
                <NavButtons
                  next={() => setStep(2)}
                  disableNext={!form.name || !form.age || !form.weight || !form.height || !form.gender}
                />
              </CardContent>
            </Card>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                  <span>Current Symptom</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Primary Symptom*</Label>
                <Textarea
                  value={form.primarySymptom}
                  onChange={(e) => handle("primarySymptom", e.target.value)}
                  placeholder="Describe your main symptom"
                />
                <SelectRow
                  label="Duration"
                  value={form.symptomDuration}
                  options={durationOptions}
                  onChange={(v) => handle("symptomDuration", v)}
                />
                <SelectRow
                  label="Severity"
                  value={form.symptomSeverity}
                  options={severityOptions}
                  onChange={(v) => handle("symptomSeverity", v)}
                />
                <NavButtons prev={() => setStep(1)} next={() => setStep(3)} disableNext={!form.primarySymptom} />
              </CardContent>
            </Card>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span>Vital Signs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InputRow
                  label="BP Systolic (mmHg)"
                  type="number"
                  value={form.vitals.bloodPressureSystolic}
                  onChange={(v) => handleVitals("bloodPressureSystolic", v)}
                />
                <InputRow
                  label="BP Diastolic (mmHg)"
                  type="number"
                  value={form.vitals.bloodPressureDiastolic}
                  onChange={(v) => handleVitals("bloodPressureDiastolic", v)}
                />
                <InputRow
                  label="Heart Rate (bpm)"
                  type="number"
                  value={form.vitals.heartRate}
                  onChange={(v) => handleVitals("heartRate", v)}
                />
                <InputRow
                  label="Temperature (°C)"
                  type="number"
                  value={form.vitals.temperature}
                  onChange={(v) => handleVitals("temperature", v)}
                />
                <InputRow
                  label="O₂ Saturation (%)"
                  type="number"
                  value={form.vitals.oxygenSaturation}
                  onChange={(v) => handleVitals("oxygenSaturation", v)}
                />
                <InputRow
                  label="Blood Sugar (mg/dL)"
                  type="number"
                  value={form.vitals.bloodSugar}
                  onChange={(v) => handleVitals("bloodSugar", v)}
                />
                <NavButtons prev={() => setStep(2)} next={() => setStep(4)} />
              </CardContent>
            </Card>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span>Lifestyle (quick)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">Quick lifestyle assessment questions would go here.</p>
                <NavButtons prev={() => setStep(3)} next={() => setStep(5)} />
              </CardContent>
            </Card>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>Review & Generate AI Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertDescription>Click "Generate" to run the revolutionary AI assessment.</AlertDescription>
                </Alert>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(4)}>
                    Previous
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => alert("🎉 AI assessment would run here")}
                  >
                    Generate Assessment
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}

/* ----------  REUSABLE SUB-COMPONENTS  ---------- */

function InputRow({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={value} placeholder={label} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function NavButtons({
  prev,
  next,
  disableNext,
}: {
  prev?: () => void
  next?: () => void
  disableNext?: boolean
}) {
  return (
    <div className="flex justify-between pt-4">
      {prev ? (
        <Button variant="outline" onClick={prev}>
          Previous
        </Button>
      ) : (
        <span />
      )}
      {next && (
        <Button onClick={next} disabled={disableNext}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
