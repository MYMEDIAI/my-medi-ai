"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Camera,
  Search,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Stethoscope,
  UserCheck,
  Lock,
  Eye,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/mymedi-logo.png" alt="My Medi.AI Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-blue-900">
              My Medi<span className="text-pink-500">.AI</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
              Testimonials
            </a>
            <Link href="/assessment">
              <Button variant="outline" className="bg-white text-purple-600 border-purple-200 hover:bg-purple-50">
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
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            Anonymous • No Login • No Data Stored • Powered by Gemini
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4 leading-tight">
            Instant AI Health Advice for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Everyone</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Get Health Suggestions Instantly - No Registration Required
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Check your health symptoms and get AI-powered suggestions instantly using Google's Gemini CLI. Completely
            anonymous, no login required, no data stored. Your privacy is our priority.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/assessment">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                Complete Health Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-purple-600 border-purple-200 hover:bg-purple-50 px-8 py-4 text-lg"
              >
                Quick Chat
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Instant Access</h3>
                  <p className="text-gray-600 text-sm">No registration, no waiting</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">100% Anonymous</h3>
                  <p className="text-gray-600 text-sm">No data stored or tracked</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Gemini AI</h3>
                  <p className="text-gray-600 text-sm">Powered by Google's Gemini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Assessment Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Complete Health Assessment</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive AI recommendations for medications, doctors, labs, diet, and exercise
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-purple-200 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">Personalized Health Recommendations</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        Medication suggestions based on symptoms
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        Local doctor and specialist recommendations
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        Lab tests and pharmacy options in your area
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        Personalized diet and exercise plans
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        Comprehensive health guidance
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-6">
                      <Stethoscope className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-700 font-medium">Complete 4-step health assessment in under 5 minutes</p>
                    </div>
                    <Link href="/assessment">
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4">
                        Start Health Assessment
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Privacy-First AI Healthcare</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant health advice without compromising your privacy or personal data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Instant Access</h3>
                <p className="text-gray-600 mb-4">
                  No registration, no login, no waiting. Just visit the site and start getting AI health advice
                  immediately.
                </p>
                <Badge className="bg-green-100 text-green-800">Zero Friction</Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">100% Anonymous</h3>
                <p className="text-gray-600 mb-4">
                  Your conversations are completely anonymous. No personal data collected, stored, or tracked.
                </p>
                <Badge className="bg-purple-100 text-purple-800">Privacy First</Badge>
              </CardContent>
            </Card>

            <Card className="border-pink-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="flex">
                    <Mic className="w-4 h-4 text-pink-600 mr-1" />
                    <Camera className="w-4 h-4 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Voice & Image Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Describe symptoms through text, voice, or images. AI analyzes and provides suggestions instantly.
                </p>
                <Badge className="bg-pink-100 text-pink-800">Multi-Modal AI</Badge>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">AI Health Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Get intelligent health suggestions powered by advanced AI trained on medical knowledge.
                </p>
                <Badge className="bg-blue-100 text-blue-800">Smart AI</Badge>
              </CardContent>
            </Card>

            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Symptom Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Advanced AI algorithms analyze your symptoms and provide relevant health suggestions.
                </p>
                <Badge className="bg-red-100 text-red-800">Smart Analysis</Badge>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">No Data Storage</h3>
                <p className="text-gray-600 mb-4">
                  Your health information is never stored. Each session is independent and completely private.
                </p>
                <Badge className="bg-orange-100 text-orange-800">Zero Storage</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get AI health advice in just three simple steps - no registration required
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Visit & Start</h3>
              <p className="text-gray-600">
                Simply visit the website and start describing your symptoms. No account creation needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Describe Symptoms</h3>
              <p className="text-gray-600">
                Share your health concerns through text, voice, or images. Our AI understands it all.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Get AI Suggestions</h3>
              <p className="text-gray-600">
                Receive instant, personalized health suggestions and recommendations from our AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Privacy Experts Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Privacy advocates and healthcare professionals praise our anonymous approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-green-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally, a healthcare AI that respects privacy. No login, no data storage - this is how digital
                  health should work."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Dr. Privacy Advocate</div>
                    <div className="text-sm text-gray-500">Digital Rights Expert</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The anonymous approach removes barriers to healthcare access. People can get help without fear of
                  data misuse."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Dr. Health Access</div>
                    <div className="text-sm text-gray-500">Public Health Specialist</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-pink-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Instant access without registration is revolutionary. This makes AI healthcare truly accessible to
                  everyone."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    <UserCheck className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Dr. AI Healthcare</div>
                    <div className="text-sm text-gray-500">Medical AI Researcher</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Try AI Health Check Now</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Get instant AI health advice powered by Google's Gemini. No registration, no data storage, completely
            anonymous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/chat">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Quick Chat
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/assessment">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Full Health Assessment
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-purple-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No Registration</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No Data Stored</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Powered by Gemini</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/mymedi-logo.png" alt="My Medi.AI Logo" className="w-8 h-8" />
                <span className="text-xl font-bold">
                  My Medi<span className="text-pink-400">.AI</span>
                </span>
              </div>
              <p className="text-blue-200 mb-4">
                Anonymous AI health advice for everyone. No login, no data storage, just instant help.
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
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instant Access
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Anonymous Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Voice Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Image Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Suggestions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Privacy</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    No Data Storage
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Anonymous Usage
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
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-blue-200">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href="tel:+919701744770" className="hover:text-white transition-colors">
                    +91 9701744770
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:Harsha.bandarla@gmail.com" className="hover:text-white transition-colors">
                    Harsha.bandarla@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Madanapalle, Andhra Pradesh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
            <p>&copy; 2024 My Medi.AI. All rights reserved. Made with ❤️ in Madanapalle for India's health.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
