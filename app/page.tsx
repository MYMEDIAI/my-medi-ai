"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  MessageCircle,
  Mic,
  Camera,
  Smile,
  Stethoscope,
  Apple,
  ArrowRight,
  CheckCircle,
  Search,
  Sparkles,
  Shield,
  Rocket,
  Zap,
  Target,
  Globe,
  Heart,
  Languages,
  QrCode,
  TrendingUp,
  Phone,
  Home,
  Info,
  UserCheck,
  Menu,
  X,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const worldFirstFeatures = [
    {
      id: "dual-ai",
      title: "🤖🤖 Dual AI Opinions",
      description: "OpenAI + Gemini analyze together with consensus percentage",
      icon: Brain,
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
      bgGradient: "from-purple-50 via-blue-50 to-cyan-50",
      textColor: "text-purple-700",
      features: ["OpenAI + Gemini analysis", "AI disagreement alerts", "Consensus percentage", "Double verification"],
      accuracy: "99.2%",
      badge: "WORLD'S FIRST",
    },
    {
      id: "whatsapp-bot",
      title: "💬 WhatsApp Health Bot",
      description: "Works on ₹1,500 phones with voice notes in any language",
      icon: MessageCircle,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-50 via-emerald-50 to-teal-50",
      textColor: "text-green-700",
      features: ["No app download needed", "Voice notes support", "22 Indian languages", "Works on basic phones"],
      accuracy: "97.8%",
      badge: "REVOLUTIONARY",
    },
    {
      id: "cough-ai",
      title: "🎤 Cough Sound AI",
      description: "89% accuracy for respiratory issues with COVID/TB/Asthma differentiation",
      icon: Mic,
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      bgGradient: "from-red-50 via-orange-50 to-yellow-50",
      textColor: "text-red-700",
      features: ["Cough pattern analysis", "Disease differentiation", "COVID detection", "TB screening"],
      accuracy: "89.0%",
      badge: "PATENT PENDING",
    },
    {
      id: "food-scanner",
      title: "🍛 Indian Food Scanner",
      description: "Knows dal, dosa, biryani nutrition with diabetic-friendly suggestions",
      icon: Apple,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient: "from-orange-50 via-red-50 to-pink-50",
      textColor: "text-orange-700",
      features: ["Regional cuisine database", "Diabetic suggestions", "Calorie tracking", "Nutrition analysis"],
      accuracy: "94.5%",
      badge: "INDIA FIRST",
    },
    {
      id: "selfie-mental",
      title: "🤳 Selfie Mental Health",
      description: "Daily mood from facial micro-expressions with depression early warning",
      icon: Smile,
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      bgGradient: "from-pink-50 via-purple-50 to-indigo-50",
      textColor: "text-pink-700",
      features: ["Micro-expression analysis", "Depression screening", "Stress tracking", "Daily mood reports"],
      accuracy: "91.7%",
      badge: "BREAKTHROUGH",
    },
  ]

  const allFeatures = [
    "✓ Dual AI Chat (OpenAI + Gemini)",
    "✓ Medicine Photo Identifier",
    "✓ Food Nutrition Scanner (Indian)",
    "✓ Skin Condition Analyzer",
    "✓ Medical Report OCR + Simplifier",
    "✓ Cough Sound Diagnosis",
    "✓ Breathing Pattern Monitor",
    "✓ Baby Cry Translator",
    "✓ WhatsApp Health Bot",
    "✓ Family Disease Predictor",
    "✓ Symptom Progression Timeline",
    "✓ Selfie Health Tracker",
    "✓ Motion/Gait Analysis",
    "✓ Emergency One-Touch",
    "✓ Medicine Expiry Scanner",
    "✓ Voice Health Assistant",
    "✓ 22 Indian Languages",
    "✓ Offline Mode",
    "✓ AR First Aid Guide",
    "✓ Predictive Health Insights",
  ]

  const stats = [
    { label: "AI Accuracy", value: "98.5%", icon: Target, color: "text-green-600" },
    { label: "Response Time", value: "<2s", icon: Zap, color: "text-yellow-600" },
    { label: "Languages", value: "22", icon: Languages, color: "text-purple-600" },
    { label: "Uptime", value: "99.9%", icon: Shield, color: "text-blue-600" },
  ]

  const investorPoints = [
    { label: "Market Size", value: "1.4B Indians", icon: Globe },
    { label: "Patent Features", value: "10 Pending", icon: Shield },
    { label: "Revenue Potential", value: "₹11,880 Cr/year", icon: Target },
    { label: "Innovation", value: "World's First", icon: Rocket },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MyMedLogo size="md" theme="dark" />
              <div className="hidden md:flex items-center space-x-2">
                <Badge className="bg-green-400 text-green-900 animate-pulse">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-ping"></div>
                  Live
                </Badge>
                <Badge className="bg-blue-400 text-blue-900">AI Powered</Badge>
                <Badge className="bg-purple-400 text-purple-900">Secure</Badge>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="#" className="text-white hover:text-blue-200 transition-colors flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <Link href="#about" className="text-white hover:text-blue-200 transition-colors flex items-center">
                <Info className="w-4 h-4 mr-1" />
                About
              </Link>
              <Link href="#features" className="text-white hover:text-blue-200 transition-colors flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                AI Chat
                <Badge className="ml-1 bg-green-400 text-green-900 text-xs">Live</Badge>
              </Link>
              <Link href="#assessment" className="text-white hover:text-blue-200 transition-colors flex items-center">
                <Stethoscope className="w-4 h-4 mr-1" />
                Assessment
                <Badge className="ml-1 bg-green-400 text-green-900 text-xs">Live</Badge>
              </Link>
              <Link href="#doctors" className="text-white hover:text-blue-200 transition-colors flex items-center">
                <UserCheck className="w-4 h-4 mr-1" />
                Doctors
                <Badge className="ml-1 bg-green-400 text-green-900 text-xs">Live</Badge>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
              <nav className="flex flex-col space-y-3">
                <Link href="#" className="text-white hover:text-blue-200 transition-colors flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
                <Link href="#about" className="text-white hover:text-blue-200 transition-colors flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Link>
                <Link href="#features" className="text-white hover:text-blue-200 transition-colors flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  AI Chat
                  <Badge className="ml-2 bg-green-400 text-green-900 text-xs">Live</Badge>
                </Link>
                <Link href="#assessment" className="text-white hover:text-blue-200 transition-colors flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Assessment
                  <Badge className="ml-2 bg-green-400 text-green-900 text-xs">Live</Badge>
                </Link>
                <Link href="#doctors" className="text-white hover:text-blue-200 transition-colors flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Doctors
                  <Badge className="ml-2 bg-green-400 text-green-900 text-xs">Live</Badge>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-12 lg:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Logo and Branding */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <MyMedLogo size="lg" theme="dark" />
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-yellow-400 text-yellow-900 animate-bounce">
                    <Sparkles className="w-3 h-3 mr-1" />
                    .AI
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
              <Badge className="bg-green-400 text-green-900 px-4 py-2 text-sm font-bold animate-pulse">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-ping"></div>
                LIVE NOW
              </Badge>
              <Badge className="bg-orange-400 text-orange-900 px-4 py-2 text-sm font-bold">
                <Rocket className="w-4 h-4 mr-2" />
                LAUNCHING SOON
              </Badge>
              <Badge className="bg-blue-400 text-blue-900 px-4 py-2 text-sm font-bold">
                <Shield className="w-4 h-4 mr-2" />
                HIPAA SECURE
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              India's Most Advanced
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                AI Healthcare Platform
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Experience revolutionary healthcare with AI-powered consultations, instant medicine identification,
              comprehensive health tracking, and personalized medical insights. Built specifically for Indian healthcare
              needs with regional language support and affordable pricing.
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-yellow-300">{currentTime.toLocaleTimeString()}</div>
                <div className="text-sm lg:text-base text-blue-100">Live Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-green-300">98.5%</div>
                <div className="text-sm lg:text-base text-blue-100">Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-orange-300">&lt;2s</div>
                <div className="text-sm lg:text-base text-blue-100">Response</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl lg:text-3xl font-bold text-pink-300">24/7</div>
                <div className="text-sm lg:text-base text-blue-100">Available</div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-yellow-300 font-bold text-lg mb-2">Most Affordable</div>
                <div className="text-blue-100 text-sm">Healthcare for Everyone</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-green-300 font-bold text-lg mb-2">Indian-First</div>
                <div className="text-blue-100 text-sm">Built for Indian Healthcare</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-orange-300 font-bold text-lg mb-2">15+ Languages</div>
                <div className="text-blue-100 text-sm">Regional Language Support</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-3" />
                Start AI Consultation
                <Sparkles className="w-4 h-4 ml-3" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
              >
                <Stethoscope className="w-5 h-5 mr-3" />
                Health Assessment
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* World's First Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🆕 WORLD'S FIRST FEATURES</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Revolutionary healthcare innovations that exist nowhere else on Earth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worldFirstFeatures.map((feature) => (
              <Card
                key={feature.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-gradient-to-br ${feature.bgGradient} overflow-hidden relative`}
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className={`bg-gradient-to-r ${feature.gradient} text-white font-bold text-xs px-3 py-1`}>
                      {feature.badge}
                    </Badge>
                  </div>

                  <CardTitle
                    className={`text-xl font-bold ${feature.textColor} group-hover:text-gray-900 transition-colors mb-3`}
                  >
                    {feature.title}
                  </CardTitle>

                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-bold text-gray-700">{feature.accuracy} Accuracy</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                  <div className="grid grid-cols-1 gap-2 mb-6">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feat}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full ${feature.textColor} border-current hover:bg-current hover:text-white transition-all`}
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Feature List */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">💡 COMPLETE FEATURE LIST</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Copy-paste ready feature list showcasing our comprehensive healthcare platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-gray-900 mb-4">MyMedi.ai Features:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 ONE-LINE PITCH:</h3>
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    "MyMedi.ai: Where OpenAI meets Gemini to revolutionize Indian healthcare - from WhatsApp
                    consultations to cough diagnosis, making quality healthcare accessible in every language, on every
                    device."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Demo Flow */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🏃 QUICK DEMO FLOW</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the magic in under 2 minutes</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Languages className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step 1</h3>
                  <p className="text-gray-600 text-sm">Choose language (22 options)</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step 2</h3>
                  <p className="text-gray-600 text-sm">Try Dual AI - OpenAI vs Gemini</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-cyan-50 to-green-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step 3</h3>
                  <p className="text-gray-600 text-sm">Scan medicine/food/skin</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-yellow-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Step 4</h3>
                  <p className="text-gray-600 text-sm">WhatsApp QR code demo</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 text-xl px-8 py-4 shadow-2xl"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Demo Now
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Platform Performance</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real-time metrics from India's most advanced AI healthcare platform
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 ${stat.color} mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Talking Points */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🚀 INVESTOR TALKING POINTS</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary healthcare platform with massive market opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {investorPoints.map((point, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-50 to-blue-50"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <point.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{point.label}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{point.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Investment Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Market Opportunity</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        1.4 billion Indians need health access
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        500M underserved population
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ₹8.6 trillion healthcare market
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Competitive Moat</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        10 patent-pending features
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Dual AI + Indian language NLP
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Stanford Fellow + MNC experience
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready for the Health Revolution? 🇮🇳</h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join the healthcare revolution with MyMedi.AI. Every feature solves a REAL problem faced by Indians. This
              isn't just an app - it's a health revolution!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Start Free Consultation
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-xl px-8 py-4 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300 font-bold w-full sm:w-auto"
              >
                <Phone className="w-6 h-6 mr-3" />
                WhatsApp Demo
                <QrCode className="w-5 h-5 ml-3" />
              </Button>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-blue-200 mb-4">
                Revenue Model: ₹99/month × 10M users = ₹11,880 Cr/year potential
              </p>
              <Badge className="bg-yellow-400 text-yellow-900 px-6 py-2 text-lg font-bold animate-pulse">
                <TrendingUp className="w-5 h-5 mr-2" />
                Launching Soon - Be the First!
              </Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
