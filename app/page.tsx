"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import {
  Stethoscope,
  Activity,
  Apple,
  FileText,
  MessageCircle,
  Shield,
  ArrowRight,
  Heart,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <Link href="/vitals">
              <Button variant="outline" className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50">
                Track Vitals
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="bg-white text-green-600 border-green-200 hover:bg-green-50">
                Health Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Quick Chat</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Compliant • AI-Powered • Secure
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4 leading-tight">
            Your Personal AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              Health Assistant
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Comprehensive Health Management with AI Intelligence
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Get personalized health assessments, detailed diet plans, vitals tracking, and instant AI consultations.
            Your complete healthcare companion powered by advanced medical AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Health Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50 px-8 py-4 text-lg"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Quick Chat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Complete Health Management Suite</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to monitor, assess, and improve your health with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">AI Health Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive health evaluation with risk analysis and personalized recommendations based on your
                  symptoms and medical history.
                </p>
                <Badge className="bg-blue-100 text-blue-800">Smart Analysis</Badge>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Apple className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Personalized Diet Plans</h3>
                <p className="text-gray-600 mb-4">
                  Full-day meal plans with detailed macros, calories, and nutritional information tailored to your
                  health goals and conditions.
                </p>
                <Badge className="bg-green-100 text-green-800">Nutrition Expert</Badge>
              </CardContent>
            </Card>

            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Vitals Tracking</h3>
                <p className="text-gray-600 mb-4">
                  Monitor blood pressure, glucose, heart rate, and more with trend analysis and intelligent alerts for
                  abnormal values.
                </p>
                <Badge className="bg-red-100 text-red-800">Real-time Monitoring</Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Quick Chat Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Instant AI responses for health queries, medication interactions, symptoms, and general medical
                  advice.
                </p>
                <Badge className="bg-purple-100 text-purple-800">24/7 Available</Badge>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Health Reports</h3>
                <p className="text-gray-600 mb-4">
                  Generate comprehensive PDF reports with assessments, diet plans, vitals history, and recommendations.
                </p>
                <Badge className="bg-orange-100 text-orange-800">Export Ready</Badge>
              </CardContent>
            </Card>

            <Card className="border-teal-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Privacy & Security</h3>
                <p className="text-gray-600 mb-4">
                  HIPAA-compliant data protection with end-to-end encryption and secure cloud storage for your health
                  information.
                </p>
                <Badge className="bg-teal-100 text-teal-800">HIPAA Compliant</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How MYMED.AI Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, intelligent, and comprehensive health management in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Health Assessment</h3>
              <p className="text-gray-600">
                Complete our comprehensive health questionnaire with symptoms, medical history, and current concerns.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your data, assesses risk levels, and generates personalized recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Track & Monitor</h3>
              <p className="text-gray-600">
                Input your vitals, follow diet plans, and monitor your health progress with intelligent tracking.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Ongoing Support</h3>
              <p className="text-gray-600">
                Get continuous AI support through quick chat, updated recommendations, and health insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4 text-blue-300" />
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Health Assessments</div>
            </div>
            <div>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Accuracy Rate</div>
            </div>
            <div>
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <div className="text-3xl font-bold mb-2">25K+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div>
              <Clock className="w-12 h-12 mx-auto mb-4 text-orange-300" />
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Health Journey Today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust MYMED.AI for their health management needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg bg-transparent"
              >
                Try Quick Chat
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      <PoweredByFooter />
    </div>
  )
}
