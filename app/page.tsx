"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Stethoscope,
  Pill,
  FileText,
  MessageCircle,
  Activity,
  Apple,
  User,
  Star,
  ArrowRight,
  CheckCircle,
  Users,
  Search,
  Sparkles,
  Shield,
  Rocket,
  Eye,
  AlertTriangle,
  TestTube,
  Verified,
  TrendingUp,
  Menu,
  X,
  Home,
  Settings,
  BarChart3,
  Globe,
  Heart,
  Smartphone,
  Baby,
  MapPin,
  Zap,
  Target,
  Bell,
  Camera,
  WallpaperIcon as Wall,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import AIHealthChat from "@/components/ai-health-chat"
import VitalsTracker from "@/components/vitals-tracker"
import DietPlanGenerator from "@/components/diet-plan-generator"
import HealthAssessmentForm from "@/components/health-assessment-form"
import ContactInfo from "@/components/contact-info"
import IndiaFocusFeatures from "@/components/india-focus-features"

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // All AI Health Assessment and Medical Features
  const allMedicalFeatures = [
    {
      id: "ai-health-assessment",
      title: "🩺 AI Health Assessment",
      description: "Comprehensive health evaluation with AI-powered risk analysis and personalized recommendations",
      icon: Stethoscope,
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgGradient: "from-purple-50 via-violet-50 to-indigo-50",
      textColor: "text-purple-700",
      href: "/assessment",
      status: "live",
      component: HealthAssessmentForm,
      features: ["Risk assessment", "Health scoring", "Personalized plans", "Medical insights"],
      rating: 4.9,
      users: "45K+",
      badge: "Comprehensive",
      category: "assessment",
    },
    {
      id: "intelligent-assessment",
      title: "🧠 Intelligent Assessment",
      description: "Advanced AI-powered health assessment with machine learning insights",
      icon: Brain,
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
      bgGradient: "from-cyan-50 via-blue-50 to-purple-50",
      textColor: "text-cyan-700",
      href: "/intelligent-assessment",
      status: "live",
      component: null,
      features: ["ML algorithms", "Predictive analysis", "Smart recommendations", "Continuous learning"],
      rating: 4.8,
      users: "30K+",
      badge: "AI Powered",
      category: "assessment",
    },
    {
      id: "live-ai-assessment",
      title: "⚡ Live AI Assessment",
      description: "Real-time health assessment with instant AI analysis and immediate results",
      icon: Zap,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      bgGradient: "from-yellow-50 via-orange-50 to-red-50",
      textColor: "text-yellow-700",
      href: "/live-ai-assessment",
      status: "live",
      component: null,
      features: ["Real-time analysis", "Instant results", "Live monitoring", "Immediate feedback"],
      rating: 4.7,
      users: "25K+",
      badge: "Real-time",
      category: "assessment",
    },
    {
      id: "safe-ai-assessment",
      title: "🛡️ Safe AI Assessment",
      description: "Medical-grade AI assessment with safety monitoring and human oversight",
      icon: Shield,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 via-emerald-50 to-teal-50",
      textColor: "text-green-700",
      href: "/safe-ai-assessment",
      status: "live",
      component: null,
      features: ["Safety monitoring", "Human oversight", "Medical compliance", "Risk mitigation"],
      rating: 4.9,
      users: "40K+",
      badge: "Medical Grade",
      category: "assessment",
    },
    {
      id: "ai-chat",
      title: "💬 AI Health Chat",
      description: "24/7 AI doctor consultation with GPT-4 powered medical insights",
      icon: MessageCircle,
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      bgGradient: "from-blue-50 via-purple-50 to-pink-50",
      textColor: "text-blue-700",
      href: "/chat",
      status: "live",
      component: AIHealthChat,
      features: ["Real-time responses", "Medical database", "Symptom analysis", "Treatment suggestions"],
      rating: 4.9,
      users: "50K+",
      badge: "GPT-4",
      category: "consultation",
    },
    {
      id: "ai-symptom-analyzer",
      title: "🔍 AI Symptom Analyzer",
      description: "Advanced symptom analysis with AI-powered differential diagnosis",
      icon: Search,
      gradient: "from-red-500 via-pink-500 to-purple-500",
      bgGradient: "from-red-50 via-pink-50 to-purple-50",
      textColor: "text-red-700",
      href: "/ai-symptom-analyzer",
      status: "live",
      component: null,
      features: ["Symptom tracking", "Differential diagnosis", "Risk assessment", "Treatment options"],
      rating: 4.8,
      users: "35K+",
      badge: "Diagnostic AI",
      category: "analysis",
    },
    {
      id: "ai-medication-analyzer",
      title: "💊 AI Medication Analyzer",
      description: "Smart medication analysis with drug interactions and side effects",
      icon: Pill,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50 via-red-50 to-pink-50",
      textColor: "text-orange-700",
      href: "/ai-medication-analyzer",
      status: "live",
      component: null,
      features: ["Drug interactions", "Side effects", "Dosage optimization", "Safety alerts"],
      rating: 4.8,
      users: "60K+",
      badge: "Pharmacy AI",
      category: "medication",
    },
    {
      id: "ai-report-generator",
      title: "📄 AI Report Generator",
      description: "Automated medical report generation with AI-powered insights",
      icon: FileText,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      bgGradient: "from-teal-50 via-cyan-50 to-blue-50",
      textColor: "text-teal-700",
      href: "/ai-report-generator",
      status: "live",
      component: null,
      features: ["Auto generation", "Medical formatting", "Data visualization", "PDF export"],
      rating: 4.6,
      users: "25K+",
      badge: "Report AI",
      category: "reporting",
    },
    {
      id: "vitals-tracker",
      title: "📊 Smart Vitals Tracker",
      description: "Advanced health monitoring with AI-powered trend analysis",
      icon: Activity,
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      bgGradient: "from-red-50 via-orange-50 to-yellow-50",
      textColor: "text-red-700",
      href: "/vitals",
      status: "live",
      component: VitalsTracker,
      features: ["Blood pressure", "Heart rate", "Trend analysis", "Health alerts"],
      rating: 4.8,
      users: "35K+",
      badge: "Real-time",
      category: "monitoring",
    },
    {
      id: "diet-planner",
      title: "🍎 AI Diet Planner",
      description: "Personalized nutrition plans with Indian cuisine focus",
      icon: Apple,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 via-emerald-50 to-teal-50",
      textColor: "text-green-700",
      href: "/diet",
      status: "live",
      component: DietPlanGenerator,
      features: ["Custom meal plans", "Calorie tracking", "Indian recipes", "Nutrition analysis"],
      rating: 4.7,
      users: "40K+",
      badge: "AI Powered",
      category: "nutrition",
    },
    {
      id: "medicine-identifier",
      title: "🔍 Smart Medicine Scanner",
      description: "AI-powered medicine identification with price comparison",
      icon: Camera,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50 via-red-50 to-pink-50",
      textColor: "text-orange-700",
      href: "/medicines",
      status: "live",
      component: null,
      features: ["Photo recognition", "Price comparison", "Side effects", "Drug interactions"],
      rating: 4.8,
      users: "60K+",
      badge: "Vision AI",
      category: "medication",
    },
    {
      id: "report-analyzer",
      title: "📋 Medical Report Analyzer",
      description: "OCR + AI analysis of lab reports and medical documents",
      icon: FileText,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      bgGradient: "from-teal-50 via-cyan-50 to-blue-50",
      textColor: "text-teal-700",
      href: "/reports",
      status: "live",
      component: null,
      features: ["OCR extraction", "AI analysis", "Trend tracking", "Report insights"],
      rating: 4.6,
      users: "25K+",
      badge: "OCR + AI",
      category: "analysis",
    },
    {
      id: "body-mapper",
      title: "🗺️ Interactive Body Mapper",
      description: "Visual symptom mapping with anatomical precision",
      icon: MapPin,
      gradient: "from-purple-500 via-pink-500 to-red-500",
      bgGradient: "from-purple-50 via-pink-50 to-red-50",
      textColor: "text-purple-700",
      href: "/body-mapper",
      status: "live",
      component: null,
      features: ["Visual mapping", "Symptom tracking", "Anatomical precision", "Pain assessment"],
      rating: 4.7,
      users: "30K+",
      badge: "Interactive",
      category: "assessment",
    },
    {
      id: "pregnancy-care",
      title: "🤱 Pregnancy Care AI",
      description: "Comprehensive pregnancy monitoring and care guidance",
      icon: Baby,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 via-rose-50 to-red-50",
      textColor: "text-pink-700",
      href: "/pregnancy",
      status: "live",
      component: null,
      features: ["Pregnancy tracking", "Fetal development", "Health monitoring", "Care guidance"],
      rating: 4.9,
      users: "20K+",
      badge: "Specialized",
      category: "specialized",
    },
    {
      id: "doctors-network",
      title: "👨‍⚕️ Doctors Network",
      description: "Connect with verified doctors and specialists",
      icon: User,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
      textColor: "text-blue-700",
      href: "/doctors",
      status: "live",
      component: null,
      features: ["Verified doctors", "Specializations", "Online consultations", "Appointment booking"],
      rating: 4.8,
      users: "15K+",
      badge: "Network",
      category: "consultation",
    },
  ]

  const newFeatures = [
    {
      title: "AI Dermatology Scanner",
      description: "Skin condition analysis using computer vision",
      icon: Eye,
      href: "/coming-soon",
      badge: "New",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Mental Health Assistant",
      description: "AI-powered mental wellness support and therapy",
      icon: Brain,
      href: "/coming-soon",
      badge: "New",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Lab Test Booking",
      description: "Home sample collection and lab test scheduling",
      icon: TestTube,
      href: "/coming-soon",
      badge: "New",
      color: "from-cyan-500 to-blue-500",
    },
  ]

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Senior Cardiologist, AIIMS Delhi",
      content: "MyMedi.AI has revolutionized patient care. The AI insights are remarkably accurate.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      specialty: "Cardiology",
    },
    {
      name: "Rajesh Kumar",
      role: "Patient, Mumbai",
      content: "The medicine scanner is incredibly accurate with Indian medicines and very affordable.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      specialty: "Patient",
    },
  ]

  const stats = [
    { label: "Active Users", value: "500K+", icon: Users, color: "text-blue-600" },
    { label: "Accuracy Rate", value: "98.5%", icon: Target, color: "text-green-600" },
    { label: "Response Time", value: "<2s", icon: Zap, color: "text-yellow-600" },
    { label: "Uptime", value: "99.9%", icon: Shield, color: "text-purple-600" },
  ]

  const filteredFeatures = allMedicalFeatures.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group features by category
  const featuresByCategory = {
    assessment: filteredFeatures.filter((f) => f.category === "assessment"),
    consultation: filteredFeatures.filter((f) => f.category === "consultation"),
    analysis: filteredFeatures.filter((f) => f.category === "analysis"),
    medication: filteredFeatures.filter((f) => f.category === "medication"),
    monitoring: filteredFeatures.filter((f) => f.category === "monitoring"),
    nutrition: filteredFeatures.filter((f) => f.category === "nutrition"),
    reporting: filteredFeatures.filter((f) => f.category === "reporting"),
    specialized: filteredFeatures.filter((f) => f.category === "specialized"),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <MyMedLogo size="sm" />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mobile-testing">
                <Smartphone className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1 bg-gray-100 rounded-xl">
                  <TabsTrigger value="overview" className="flex items-center text-xs px-2 py-2">
                    <Home className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex items-center text-xs px-2 py-2">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Features</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center text-xs px-2 py-2">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="global" className="flex items-center text-xs px-2 py-2">
                    <Globe className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Global</span>
                  </TabsTrigger>
                  <TabsTrigger value="safety" className="flex items-center text-xs px-2 py-2">
                    <Shield className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Safety</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center text-xs px-2 py-2">
                    <Settings className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Settings</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <MyMedLogo size="md" />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 max-w-2xl mx-8">
              <TabsList className="grid w-full grid-cols-6 h-12 p-1 bg-gray-100 rounded-xl">
                <TabsTrigger value="overview" className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  Features
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="global" className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mobile-testing">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Test Mobile
                </Link>
              </Button>
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="flex justify-center mb-6">
                    <MyMedLogo size="xl" className="text-white" />
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
                    <Badge className="bg-green-400 text-green-900 px-3 py-1 text-sm font-bold animate-pulse">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-ping"></div>
                      LIVE NOW
                    </Badge>
                    <Badge className="bg-orange-400 text-orange-900 px-3 py-1 text-sm font-bold">
                      <Rocket className="w-4 h-4 mr-2" />
                      500K+ USERS
                    </Badge>
                    <Badge className="bg-blue-400 text-blue-900 px-3 py-1 text-sm font-bold">
                      <Shield className="w-4 h-4 mr-2" />
                      HIPAA SECURE
                    </Badge>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    India's Most Advanced
                    <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                      AI Healthcare Platform
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                    Experience revolutionary healthcare with AI-powered consultations, instant medicine identification,
                    comprehensive health tracking, and personalized medical insights.
                  </p>

                  {/* Live Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-lg lg:text-2xl font-bold text-yellow-300">
                        {currentTime.toLocaleTimeString()}
                      </div>
                      <div className="text-xs lg:text-sm text-blue-100">Live Support</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-lg lg:text-2xl font-bold text-green-300">98.5%</div>
                      <div className="text-xs lg:text-sm text-blue-100">Accuracy</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-lg lg:text-2xl font-bold text-orange-300">&lt;2s</div>
                      <div className="text-xs lg:text-sm text-blue-100">Response</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="text-lg lg:text-2xl font-bold text-pink-300">24/7</div>
                      <div className="text-xs lg:text-sm text-blue-100">Available</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-6 py-3 shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/chat">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Start AI Consultation
                        <Sparkles className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 text-lg px-6 py-3 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                      asChild
                    >
                      <Link href="/assessment">
                        <Stethoscope className="w-5 h-5 mr-2" />
                        Health Assessment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 ${stat.color} mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center`}
                        >
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Access to All AI Health Features */}
            <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">🩺 All AI Health Features</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Complete suite of AI-powered healthcare tools and assessments
                  </p>
                </div>

                {/* Featured AI Health Assessment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {featuresByCategory.assessment.map((feature) => (
                    <Card
                      key={feature.id}
                      className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br ${feature.bgGradient} overflow-hidden relative`}
                      onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-green-100 text-green-800 font-bold text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            {feature.status.toUpperCase()}
                          </Badge>
                        </div>

                        <CardTitle
                          className={`text-lg font-bold ${feature.textColor} group-hover:text-gray-900 transition-colors mb-2`}
                        >
                          {feature.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">{feature.description}</p>

                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${feature.textColor} border-current hover:bg-current hover:text-white transition-all text-xs px-3 py-1`}
                            asChild
                          >
                            <Link href={feature.href}>
                              Try Now
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-bold text-gray-700 ml-1">{feature.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Access Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {allMedicalFeatures.slice(0, 12).map((feature) => (
                    <Button
                      key={feature.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-lg transition-all duration-300 bg-transparent"
                      asChild
                    >
                      <Link href={feature.href}>
                        <feature.icon className="w-8 h-8 text-gray-600" />
                        <span className="text-xs text-center font-medium">{feature.title.replace(/🩺|💬|🔍|💊|📄|📊|🍎|🔍|📋|🗺️|🤱|👨‍⚕️|🧠|⚡|🛡️/g, '').trim()}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="mt-0">
            <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Complete AI Healthcare Solutions</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Comprehensive healthcare technology powered by advanced AI
                  </p>

                  {/* Search */}
                  <div className="max-w-xl mx-auto">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="Search features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Features by Category */}
                {Object.entries(featuresByCategory).map(([category, features]) => {
                  if (features.length === 0) return null
                  
                  return (
                    <div key={category} className="mb-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
                        {category === 'assessment' && '🩺 Health Assessment'}
                        {category === 'consultation' && '💬 AI Consultation'}
                        {category === 'analysis' && '🔍 Medical Analysis'}
                        {category === 'medication' && '💊 Medication Management'}
                        {category === 'monitoring' && '📊 Health Monitoring'}
                        {category === 'nutrition' && '🍎 Nutrition & Diet'}
                        {category === 'reporting' && '📄 Medical Reporting'}
                        {category === 'specialized' && '🤱 Specialized Care'}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                          <Card
                            key={feature.id}
                            className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br ${feature.bgGradient} overflow-hidden relative`}
                            onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between mb-4">
                                <div
                                  className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                  <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  <Badge className="bg-green-100 text-green-800 font-bold text-xs">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                    {feature.status.toUpperCase()}
                                  </Badge>
                                  <Badge className={`bg-gradient-to-r ${feature.gradient} text-white font-bold text-xs`}>
                                    {feature.badge}
                                  </Badge>
                                </div>
                              </div>

                              <CardTitle
                                className={`text-lg lg:text-xl font-bold ${feature.textColor} group-hover:text-gray-900 transition-colors mb-2`}
                              >
                                {feature.title}
                              </CardTitle>

                              <div className="flex items-center space-x-4 mb-3">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm font-bold text-gray-700 ml-1">{feature.rating}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 ml-1">{feature.users}</span>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent>
                              <p className="text-gray-600 mb-4 leading-relaxed text-sm">{feature.description}</p>

                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {feature.features.map((feat, idx) => (
                                  <div key={idx} className="flex items-center text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                                    {feat}
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${feature.textColor} border-current hover:bg-current hover:text-white transition-all text-xs px-3 py-1`}
                                  asChild
                                >
                                  <Link href={feature.href}>
                                    Try Now
                                    <ArrowRight className="w-3 h-3 ml-1" />
                                  </Link>
                                </Button>
                                {feature.component && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`${feature.textColor} hover:bg-current/10 text-xs px-3 py-1`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setActiveDemo(activeDemo === feature.id ? null : feature.id)
                                    }}
                                  >
                                    {activeDemo === feature.id ? "Hide" : "Demo"}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* Interactive Demo */}
                {activeDemo && (
                  <div className="mt-12 animate-in slide-in-from-bottom duration-500">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        🚀 Interactive Demo: {allMedicalFeatures.find((f) => f.id === activeDemo)?.title}
                      </h3>
                    </div>
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 lg:p-8 border-4 border-gradient-to-r from-blue-500 to-purple-500">
                      {(() => {
                        const feature = allMedicalFeatures.find((f) => f.id === activeDemo)
                        if (feature?.component) {
                          const Component = feature.component
                          return <Component />
                        }
                        return null
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-0">
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Analytics & Insights</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Real-time platform performance and user engagement metrics
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        User Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Active Users</span>
                          <span className="font-bold text-2xl text-green-600">500,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Growth</span>
                          <span className="font-bold text-green-600">+23.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">New Registrations Today</span>
                          <span className="font-bold text-blue-600">1,247</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Platform Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">API Response Time</span>
                          <span className="font-bold text-2xl text-green-600">0.8s</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Uptime</span>
                          <span className="font-bold text-green-600">99.98%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">AI Accuracy</span>
                          <span className="font-bold text-purple-600">98.5%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feature Usage */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Feature Usage Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allMedicalFeatures.slice(0, 9).map((feature, index) => (
                      <Card key={index} className="border-0 shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <feature.icon className={`w-8 h-8 ${feature.textColor}`} />
                            <Badge className="bg-blue-100 text-blue-800">{feature.users}</Badge>
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                          <div className="flex items-center">
                            <div className="flex items-center mr-4">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-bold text-gray-700 ml-1">{feature.rating}</span>
                            </div>
                            <span className="text-sm text-gray-600">Active</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Global Tab */}
          <TabsContent value="global" className="mt-0">
            <section className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">🇮🇳 Made in India, for India</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Unlike international platforms, MyMedi.AI is built from ground up for Indian healthcare needs
                  </p>
                </div>
                <IndiaFocusFeatures />
              </div>
            </section>

          {/* Safety Tab */}
          <TabsContent value="safety" className="mt-0">
            <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">🛡️ AI Safety & Trust</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Industry-leading AI safety measures ensuring reliable, accurate, and safe medical recommendations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-red-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Confidence Monitoring</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Every AI response includes confidence scores with automatic human review
                      </p>
                      <Badge className="bg-red-100 text-red-800">98.5% Accuracy</Badge>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-orange-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Emergency Detection</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        AI automatically detects emergency symptoms and provides immediate escalation.
                      </p>
                      <Badge className="bg-orange-100 text-orange-800">24/7 Monitoring</Badge>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-yellow-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Medical Disclaimers</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Comprehensive medical disclaimers and safety warnings for all AI recommendations.
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800">Legal Compliance</Badge>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-green-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Accuracy Tracking</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Continuous accuracy monitoring with feedback loops and specialist reviews.
                      </p>
                      <Badge className="bg-green-100 text-green-800">Continuous Learning</Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center mt-12">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
                    <Link href="/safe-ai-assessment">
                      <Shield className="w-5 h-5 mr-2" />
                      Try Safe AI Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Settings & Preferences</h2>
                  <p className="text-xl text-gray-600">Customize your MyMedi.AI experience</p>
                </div>

                <div className="space-y-8">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Account Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Profile Information</h4>
                          <p className="text-sm text-gray-600">Update your personal details</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit Profile
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Privacy Settings</h4>
                          <p className="text-sm text-gray-600">Control your data privacy</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage Privacy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="w-5 h-5 mr-2" />
                        Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Health Alerts</h4>
                          <p className="text-sm text-gray-600">Receive important health notifications</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Medication Reminders</h4>
                          <p className="text-sm text-gray-600">Get reminded about your medications</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Language & Region
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Language</h4>
                          <p className="text-sm text-gray-600">Choose your preferred language</p>
                        </div>
                        <select className="border rounded px-3 py-1">
                          <option>English</option>
                          <option>हिंदी</option>
                          <option>বাংলা</option>
                          <option>தமிழ்</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Region</h4>
                          <p className="text-sm text-gray-600">Set your location for local services</p>
                        </div>
                        <select className="border rounded px-3 py-1">
                          <option>India</option>
                          <option>Mumbai</option>
                          <option>Delhi</option>
                          <option>Bangalore</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      {/* Testimonials Section - Always visible */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What Healthcare Professionals Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Trusted by doctors, loved by patients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Verified className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center mb-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{testimonial.specialty}</Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 italic leading-relaxed">"{testimonial.content}"</p>

                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Always visible */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Healthcare?</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join 500,000+ Indians who trust MyMedi.AI for their healthcare needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
                asChild
              >
                <Link href="/chat">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Start Free Consultation
                  <Sparkles className="w-5 h-5 ml-3" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-xl px-8 py-4 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
                asChild
              >
                <Link href="/assessment">
                  <Stethoscope className="w-6 h-6 mr-3" />
                  Health Assessment
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <ContactInfo />
      <PoweredByFooter />
    </div>
  )\
}
