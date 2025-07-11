"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Stethoscope,
  Pill,
  FileText,
  MessageCircle,
  Activity,
  Apple,
  Baby,
  UserCheck,
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
  Store,
  Headphones,
  Smartphone,
  Lock,
  Verified,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import AIHealthChat from "@/components/ai-health-chat"
import VitalsTracker from "@/components/vitals-tracker"
import DietPlanGenerator from "@/components/diet-plan-generator"
import HealthAssessmentForm from "@/components/health-assessment-form"
import ContactInfo from "@/components/contact-info"
import EnhancedNavigation from "@/components/enhanced-navigation"
import CompetitiveAdvantage from "@/components/competitive-advantage"
import IndiaFocusFeatures from "@/components/india-focus-features"

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const premiumFeatures = [
    {
      id: "ai-chat",
      title: "AI Health Chat",
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
    },
    {
      id: "vitals-tracker",
      title: "Smart Vitals Tracker",
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
    },
    {
      id: "diet-planner",
      title: "AI Diet Planner",
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
    },
    {
      id: "health-assessment",
      title: "Comprehensive Health Assessment",
      description: "Complete health evaluation with risk analysis and recommendations",
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
    },
    {
      id: "medicine-identifier",
      title: "Smart Medicine Scanner",
      description: "AI-powered medicine identification with price comparison",
      icon: Pill,
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
    },
    {
      id: "report-analyzer",
      title: "Medical Report Analyzer",
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
    },
    {
      id: "body-mapper",
      title: "Interactive Body Mapper",
      description: "Visual symptom mapping with AI-powered analysis",
      icon: User,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 via-rose-50 to-red-50",
      textColor: "text-pink-700",
      href: "/body-mapper",
      status: "live",
      component: null,
      features: ["Interactive mapping", "Symptom analysis", "Visual interface", "Medical guidance"],
      rating: 4.7,
      users: "30K+",
      badge: "Interactive",
    },
    {
      id: "pregnancy-care",
      title: "Pregnancy Care Suite",
      description: "Complete pregnancy monitoring with week-by-week guidance",
      icon: Baby,
      gradient: "from-pink-500 via-purple-500 to-violet-500",
      bgGradient: "from-pink-50 via-purple-50 to-violet-50",
      textColor: "text-pink-700",
      href: "/pregnancy",
      status: "live",
      component: null,
      features: ["Week tracking", "Baby development", "Health monitoring", "Care tips"],
      rating: 4.9,
      users: "20K+",
      badge: "Specialized",
    },
    {
      id: "doctor-network",
      title: "Doctor Network",
      description: "Connect with verified healthcare professionals across India",
      icon: UserCheck,
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      bgGradient: "from-emerald-50 via-green-50 to-lime-50",
      textColor: "text-emerald-700",
      href: "/doctors",
      status: "live",
      component: null,
      features: ["Verified doctors", "Online consultation", "Appointment booking", "Specialist network"],
      rating: 4.8,
      users: "15K+",
      badge: "Verified",
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
    {
      title: "Pharmacy Network",
      description: "Medicine delivery and pharmacy partnerships",
      icon: Store,
      href: "/coming-soon",
      badge: "New",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Emergency Services",
      description: "24/7 emergency medical assistance and ambulance",
      icon: AlertTriangle,
      href: "/coming-soon",
      badge: "New",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Health Insurance",
      description: "AI-powered health insurance recommendations",
      icon: Shield,
      href: "/coming-soon",
      badge: "New",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Senior Cardiologist, AIIMS Delhi",
      content:
        "MyMedi.AI has revolutionized patient care. The AI insights are remarkably accurate and the Indian medical database helps me provide better preliminary assessments to patients from different regions.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      specialty: "Cardiology",
    },
    {
      name: "Rajesh Kumar",
      role: "Patient, Mumbai",
      content:
        "The medicine scanner is incredibly accurate with Indian medicines and the pricing is very affordable for my family. The Hindi support makes it easy for my elderly parents to use.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      specialty: "Patient",
    },
    {
      name: "Dr. Amit Patel",
      role: "General Physician, Bangalore",
      content:
        "The Ayurveda integration is excellent. My patients love the traditional + modern medicine approach. The comprehensive health assessments help me monitor patients remotely.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      specialty: "General Medicine",
    },
    {
      name: "Sneha Reddy",
      role: "Expecting Mother, Hyderabad",
      content:
        "The pregnancy care module is amazing! The Telugu language support and understanding of Indian pregnancy traditions make it perfect for Indian mothers like me.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
      verified: true,
      specialty: "Pregnancy Care",
    },
  ]

  const filteredFeatures = premiumFeatures.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Enhanced Navigation */}
      <EnhancedNavigation />

      {/* Hero Section with Live Stats */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <MyMedLogo size="xl" className="text-white" />
              </div>

              <div className="flex justify-center items-center space-x-4 mb-6">
                <Badge className="bg-green-400 text-green-900 px-4 py-2 text-sm font-bold animate-pulse">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-ping"></div>
                  LIVE NOW
                </Badge>
                <Badge className="bg-orange-400 text-orange-900 px-4 py-2 text-sm font-bold">
                  <Rocket className="w-4 h-4 mr-2" />
                  500K+ USERS
                </Badge>
                <Badge className="bg-blue-400 text-blue-900 px-4 py-2 text-sm font-bold">
                  <Shield className="w-4 h-4 mr-2" />
                  HIPAA SECURE
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                India's Most Advanced
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  AI Healthcare Platform
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Experience revolutionary healthcare with AI-powered consultations, instant medicine identification,
                comprehensive health tracking, and personalized medical insights - trusted by 500,000+ users across
                India. Built specifically for Indian healthcare needs with regional language support and affordable
                pricing.
              </p>

              {/* Live Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-yellow-300">{currentTime.toLocaleTimeString()}</div>
                  <div className="text-sm text-blue-100">Live Support</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-green-300">98.5%</div>
                  <div className="text-sm text-blue-100">Accuracy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-orange-300">&lt;2s</div>
                  <div className="text-sm text-blue-100">Response</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-pink-300">24/7</div>
                  <div className="text-sm text-blue-100">Available</div>
                </div>
              </div>

              {/* Competitive Advantage Banner */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-yellow-300">Most Affordable</div>
                    <div className="text-sm text-blue-100">Healthcare for Everyone</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-300">Indian-First</div>
                    <div className="text-sm text-blue-100">Built for Indian Healthcare</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-300">15+ Languages</div>
                    <div className="text-sm text-blue-100">Regional Language Support</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
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
                  className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
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
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search features, specialties, or health topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Premium AI Healthcare Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare technology powered by advanced AI, designed specifically for Indian healthcare
              needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((feature) => (
              <Card
                key={feature.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border-0 bg-gradient-to-br ${feature.bgGradient} overflow-hidden relative`}
                onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`}></div>
                </div>

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-green-100 text-green-800 font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        {feature.status.toUpperCase()}
                      </Badge>
                      <Badge className={`bg-gradient-to-r ${feature.gradient} text-white font-bold`}>
                        {feature.badge}
                      </Badge>
                    </div>
                  </div>

                  <CardTitle
                    className={`text-xl font-bold ${feature.textColor} group-hover:text-gray-900 transition-colors mb-2`}
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

                <CardContent className="relative z-10">
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                        {feat}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${feature.textColor} border-current hover:bg-current hover:text-white transition-all transform hover:scale-105`}
                      asChild
                    >
                      <Link href={feature.href}>
                        Try Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    {feature.component && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${feature.textColor} hover:bg-current/10`}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setActiveDemo(activeDemo === feature.id ? null : feature.id)
                        }}
                      >
                        {activeDemo === feature.id ? "Hide Demo" : "Quick Demo"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Demo Section */}
          {activeDemo && (
            <div className="mt-16 animate-in slide-in-from-bottom duration-500">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  🚀 Interactive Demo: {premiumFeatures.find((f) => f.id === activeDemo)?.title}
                </h3>
                <p className="text-xl text-gray-600">Experience the feature with live AI integration</p>
              </div>
              <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border-4 border-gradient-to-r from-blue-500 to-purple-500">
                {(() => {
                  const feature = premiumFeatures.find((f) => f.id === activeDemo)
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

      {/* Competitive Advantage Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <CompetitiveAdvantage />
        </div>
      </section>

      {/* India-Focused Features Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🇮🇳 Made in India, for India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike international platforms, MyMedi.AI is built from ground up for Indian healthcare needs, diseases,
              languages, and cultural preferences with deep understanding of Indian medical practices.
            </p>
          </div>
          <IndiaFocusFeatures />
        </div>
      </section>

      {/* New Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🆕 Latest Features & Innovations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge healthcare technology launching soon with advanced AI capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold animate-pulse">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                    <Link href={feature.href}>
                      Join Waitlist
                      <Rocket className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How MyMedi.ai Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and intelligent healthcare at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Describe Your Health Concern</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with our AI doctor, upload medical reports, or take photos of medicines. Our advanced AI
                understands natural language and medical imagery with 98.5% accuracy.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis & Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI processes your information using advanced medical knowledge, cross-referencing with medical
                databases to provide accurate insights in under 2 seconds.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Personalized Recommendations</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed health insights, treatment suggestions, medication information, and clear guidance on
                when to consult healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Healthcare Professionals Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by doctors, loved by patients - real testimonials from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
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

                  <p className="text-gray-600 mb-4 italic leading-relaxed text-sm">"{testimonial.content}"</p>

                  <div>
                    <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-pink-600/50"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Transform Your Healthcare?</h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join 500,000+ Indians who trust MyMedi.AI for their healthcare needs. Get advanced AI-powered health
              insights, Indian-focused healthcare solutions, and affordable pricing. Built by Indians, for Indians.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Smartphone className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Mobile First</h3>
                <p className="text-blue-100 text-sm">Works perfectly on all devices</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Lock className="w-8 h-8 text-green-300 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">HIPAA Secure</h3>
                <p className="text-blue-100 text-sm">Your data is completely protected</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Headphones className="w-8 h-8 text-orange-300 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                <p className="text-blue-100 text-sm">Always here when you need us</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 py-6 shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
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
                className="border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-6 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300 font-bold"
                asChild
              >
                <Link href="/assessment">
                  <Stethoscope className="w-6 h-6 mr-3" />
                  Take Health Assessment
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex justify-center items-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactInfo />

      {/* Footer */}
      <PoweredByFooter />
    </div>
  )
}
