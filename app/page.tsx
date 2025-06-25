"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function HomePage() {
  const router = useRouter()

  const handleViewDemo = () => {
    router.push("/dashboard")
  }

  const handleLearnMore = () => {
    const element = document.getElementById("features")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">My Medi.AI</h1>
            </div>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">View Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            AI Healthcare for
            <span className="text-blue-600"> 1 Billion People</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Experience the future of healthcare with our AI-powered platform. Manage health records, get AI insights,
            and connect with your family's health journey.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Explore Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Health Records</h3>
                <p className="mt-2 text-sm text-gray-500">Secure, comprehensive health record management</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">AI Assistant</h3>
                <p className="mt-2 text-sm text-gray-500">Intelligent health insights and recommendations</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Family Health</h3>
                <p className="mt-2 text-sm text-gray-500">Connect and manage your family's health together</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Secure & Private</h3>
                <p className="mt-2 text-sm text-gray-500">Enterprise-grade security for your health data</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">🎯</div>
                <div className="text-2xl font-bold mb-1">Live Demo</div>
                <div className="text-blue-200">Interactive Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1B+</div>
                <div className="text-blue-200">Target Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-200">AI Support</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2026</div>
                <div className="text-blue-200">Launch Year</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive AI Healthcare Features
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need for better health management, powered by advanced AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Health Records</h3>
                  <p className="text-gray-600 mb-4">Securely manage and access your health records from anywhere.</p>
                  <Badge className="bg-blue-100 text-blue-800">Secure Access</Badge>
                </CardContent>
              </Card>

              <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Health Assistant</h3>
                  <p className="text-gray-600 mb-4">
                    Get instant health advice and support 24/7 from our intelligent AI assistant trained on medical
                    knowledge.
                  </p>
                  <Badge className="bg-indigo-100 text-indigo-800">24/7 Support</Badge>
                </CardContent>
              </Card>

              <Card className="border-green-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Family Health Management</h3>
                  <p className="text-gray-600 mb-4">
                    Manage health records and track wellness for your entire family in one secure platform.
                  </p>
                  <Badge className="bg-green-100 text-green-800">Family Care</Badge>
                </CardContent>
              </Card>

              <Card className="border-red-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
                  <p className="text-gray-600 mb-4">
                    Your health data is encrypted and secure. We follow strict privacy standards to protect your
                    information.
                  </p>
                  <Badge className="bg-red-100 text-red-800">HIPAA Compliant</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience AI-powered healthcare in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Try the Demo</h3>
                <p className="text-gray-600">
                  Click "View Demo" to instantly access the platform. No registration required.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Explore Features</h3>
                <p className="text-gray-600">
                  Navigate through health records, AI assistant, vitals tracking, and family management features.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Experience AI Healthcare</h3>
                <p className="text-gray-600">
                  Interact with AI-powered health insights, personalized recommendations, and smart health management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Healthcare Experts Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Industry professionals are excited about the potential of My Medi.AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="w-5 h-5 text-yellow-400 fill-current">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "AI-powered healthcare accessibility is the future. Platforms like My Medi.AI will revolutionize how
                    Indians access healthcare."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="w-5 h-5 text-blue-600">👨‍⚕️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Priya Sharma</div>
                      <div className="text-sm text-gray-500">Healthcare Technology Expert</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-indigo-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="w-5 h-5 text-yellow-400 fill-current">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The potential for early disease detection through AI could save millions of lives. This is exactly
                    what India needs."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="w-5 h-5 text-indigo-600">🏥</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Rajesh Kumar</div>
                      <div className="text-sm text-gray-500">Public Health Specialist</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="w-5 h-5 text-yellow-400 fill-current">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Family health management through AI will empower every household. The vision behind My Medi.AI is
                    inspiring."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="w-5 h-5 text-green-600">👨‍👩‍👧‍👦</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Anita Patel</div>
                      <div className="text-sm text-gray-500">AI in Medicine Researcher</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="contact-section" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Experience the Future Today</h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Try our interactive demo and see how AI can transform healthcare. No signup required - start exploring
              now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  🎯 Try Live Demo
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                onClick={() => window.open("https://mymedi.ai", "_blank")}
              >
                Visit mymedi.ai
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-8 w-8 text-blue-600 mr-3" />
                  <h1 className="text-2xl font-bold">
                    My Medi<span className="text-blue-300">.AI</span>
                  </h1>
                </div>
                <p className="text-blue-200 mb-4">
                  Making healthcare accessible to 1 billion people through AI-powered solutions.
                </p>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-xs">f</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-xs">t</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-xs">in</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Demo Features</h3>
                <ul className="space-y-2 text-blue-200">
                  <li>
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                      🎯 Interactive Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/ai-assistant" className="hover:text-white transition-colors">
                      🤖 AI Health Assistant
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/records" className="hover:text-white transition-colors">
                      📋 Health Records
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/vitals" className="hover:text-white transition-colors">
                      📊 Vitals Tracking
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/family" className="hover:text-white transition-colors">
                      👨‍👩‍👧‍👦 Family Management
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-blue-200">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
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
                      Medical Disclaimer
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Contact Info</h3>
                <div className="space-y-3 text-blue-200">
                  <div className="flex items-center">
                    <span className="w-4 h-4 text-blue-600 mr-2">📞</span>
                    <a href="tel:+919701744770" className="hover:text-white transition-colors">
                      +91 9701744770
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 text-blue-600 mr-2">📧</span>
                    <a href="mailto:Harsha.bandarla@gmail.com" className="hover:text-white transition-colors">
                      Harsha.bandarla@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 text-blue-600 mr-2">📍</span>
                    <span>Madanapalle, Andhra Pradesh</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
              <p>&copy; 2024 My Medi.AI. All rights reserved. Made with ❤️ in Madanapalle for India's health.</p>
              <p className="mt-2 text-sm">🎯 This is a live demo showcasing AI healthcare features</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
