"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Target,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import DemoAIHealthChat from "@/components/ai-health-chat"
import DemoVitalsTracker from "@/components/vitals-tracker"
import DemoDietPlanGenerator from "@/components/diet-plan-generator"
import DemoBodyMapper from "@/components/demo-body-mapper"
import DemoReportAnalyzer from "@/components/demo-report-analyzer"
import DemoMedicineIdentifier from "@/components/demo-medicine-identifier"
import ContactInfo from "@/components/contact-info"
import EnhancedNavigation from "@/components/enhanced-navigation"

export default function HomePage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const features = [
    {
      id: "ai-chat",
      title: "AI Health Chat",
      description: "24/7 AI doctor consultation with personalized health advice",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
      href: "/chat",
      status: "live",
      component: DemoAIHealthChat,
    },
    {
      id: "vitals-tracker",
      title: "Vitals Tracker",
      description: "Monitor blood pressure, heart rate, and health metrics",
      icon: Activity,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      textColor: "text-red-700",
      href: "/vitals",
      status: "live",
      component: DemoVitalsTracker,
    },
    {
      id: "diet-planner",
      title: "AI Diet Planner",
      description: "Personalized nutrition plans based on your health goals",
      icon: Apple,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-green-700",
      href: "/diet",
      status: "live",
      component: DemoDietPlanGenerator,
    },
    {
      id: "health-assessment",
      title: "Health Assessment",
      description: "Comprehensive health evaluation and risk analysis",
      icon: Stethoscope,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      textColor: "text-purple-700",
      href: "/assessment",
      status: "live",
      component: null,
    },
    {
      id: "body-mapper",
      title: "Body Symptom Mapper",
      description: "Interactive body mapping for symptom analysis",
      icon: User,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      textColor: "text-orange-700",
      href: "/body-mapper",
      status: "live",
      component: DemoBodyMapper,
    },
    {
      id: "report-analyzer",
      title: "Medical Report Analyzer",
      description: "AI-powered analysis of lab reports and medical documents",
      icon: FileText,
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50",
      textColor: "text-teal-700",
      href: "/reports",
      status: "live",
      component: DemoReportAnalyzer,
    },
    {
      id: "medicine-identifier",
      title: "Medicine Identifier",
      description: "Identify medicines using AI with photo recognition",
      icon: Pill,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      textColor: "text-indigo-700",
      href: "/medicines",
      status: "live",
      component: DemoMedicineIdentifier,
    },
    {
      id: "pregnancy-care",
      title: "Pregnancy Care",
      description: "Specialized care and monitoring for expecting mothers",
      icon: Baby,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      textColor: "text-pink-700",
      href: "/pregnancy",
      status: "live",
      component: null,
    },
    {
      id: "doctor-network",
      title: "Doctor Network",
      description: "Connect with verified healthcare professionals",
      icon: UserCheck,
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      textColor: "text-emerald-700",
      href: "/doctors",
      status: "live",
      component: null,
    },
  ]

  const stats = [
    { label: "Active Users", value: "50,000+", icon: Users },
    { label: "Health Consultations", value: "200,000+", icon: MessageCircle },
    { label: "Reports Analyzed", value: "75,000+", icon: FileText },
    { label: "Accuracy Rate", value: "95%+", icon: Target },
  ]

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "General Physician, Mumbai",
      content:
        "MyMedi.ai has revolutionized how I provide preliminary consultations. The AI insights are remarkably accurate.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Patient, Delhi",
      content:
        "The medicine identifier saved me from taking the wrong medication. Incredibly useful for elderly patients like me.",
      rating: 5,
    },
    {
      name: "Dr. Amit Patel",
      role: "Cardiologist, Bangalore",
      content: "The vitals tracking and report analysis features help me monitor my patients remotely with confidence.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Navigation */}
      <EnhancedNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <MyMedLogo size="xl" className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your AI-Powered
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Health Companion
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience the future of healthcare with AI-driven consultations, instant medicine identification,
              comprehensive health tracking, and personalized medical insights - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start AI Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              >
                <Pill className="w-5 h-5 mr-2" />
                Identify Medicine
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Comprehensive Health Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From AI consultations to medicine identification, we provide cutting-edge healthcare technology to keep
              you and your family healthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br ${feature.bgColor} overflow-hidden`}
                onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color}`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      className={`${feature.status === "live" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {feature.status === "live" ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Live
                        </>
                      ) : (
                        "Coming Soon"
                      )}
                    </Badge>
                  </div>
                  <CardTitle
                    className={`text-xl font-bold ${feature.textColor} group-hover:text-gray-900 transition-colors`}
                  >
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${feature.textColor} border-current hover:bg-current hover:text-white transition-all`}
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

          {/* Demo Section */}
          {activeDemo && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Interactive Demo: {features.find((f) => f.id === activeDemo)?.title}
                </h3>
                <p className="text-gray-600">Try the feature below with live AI integration</p>
              </div>
              <div className="max-w-4xl mx-auto">
                {(() => {
                  const feature = features.find((f) => f.id === activeDemo)
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

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How MyMedi.ai Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and intelligent healthcare at your fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">1. Describe Your Symptoms</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with our AI doctor, upload medical reports, or take photos of medicines. Our advanced AI
                understands natural language and medical imagery.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Brain className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">2. AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI processes your information using advanced medical knowledge, providing accurate insights and
                personalized recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">3. Get Recommendations</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed health insights, treatment suggestions, and when to consult a healthcare professional
                for further care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trusted by Healthcare Professionals</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what doctors and patients are saying about MyMedi.ai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Healthcare?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who trust MyMedi.ai for their health needs. Start your AI-powered health journey
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4" asChild>
              <Link href="/chat">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Free Consultation
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              asChild
            >
              <Link href="/assessment">
                <Stethoscope className="w-5 h-5 mr-2" />
                Take Health Assessment
              </Link>
            </Button>
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
