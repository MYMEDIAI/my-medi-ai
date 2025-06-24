"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Shield,
  Users,
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
  Activity,
  UserCheck,
  Clock,
} from "lucide-react"

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started Free</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            100% Free Healthcare AI Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4 leading-tight">
            Free AI Healthcare for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              1 Billion People
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Your Smart Health Companion for a Better Tomorrow
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            To empower every Indian with preventive, predictive, and personalized healthcare through technology, data,
            and empathy. Revolutionizing healthcare accessibility with AI-powered solutions - completely free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
              Start Your Free Health Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-purple-600 border-purple-200 hover:bg-purple-50 px-8 py-4 text-lg"
            >
              Visit mymedi.ai
            </Button>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">AI Health Assistant</h3>
                  <p className="text-gray-600 text-sm">24/7 intelligent health support</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Early Detection</h3>
                  <p className="text-gray-600 text-sm">Prevent diseases before they start</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-900 mb-2">Family Care</h3>
                  <p className="text-gray-600 text-sm">Manage entire family health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-purple-200">Users Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-purple-200">Early Detections</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-purple-200">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Comprehensive AI Healthcare Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for better health management, powered by advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">AI Health Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Get instant health advice and support 24/7 from our intelligent AI assistant trained on medical
                  knowledge.
                </p>
                <Badge className="bg-purple-100 text-purple-800">24/7 Support</Badge>
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
                  Analyze symptoms through voice descriptions and image uploads for accurate health assessments.
                </p>
                <Badge className="bg-pink-100 text-pink-800">Multi-Modal AI</Badge>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Family Health Management</h3>
                <p className="text-gray-600 mb-4">
                  Manage health records and track wellness for your entire family in one secure platform.
                </p>
                <Badge className="bg-blue-100 text-blue-800">Family Care</Badge>
              </CardContent>
            </Card>

            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Early Disease Detection</h3>
                <p className="text-gray-600 mb-4">
                  Advanced AI algorithms help identify potential health issues before they become serious problems.
                </p>
                <Badge className="bg-red-100 text-red-800">Preventive Care</Badge>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">100% Free Forever</h3>
                <p className="text-gray-600 mb-4">
                  No hidden costs, no premium plans. Our mission is to make healthcare accessible to everyone in India.
                </p>
                <Badge className="bg-green-100 text-green-800">Always Free</Badge>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Secure & Private</h3>
                <p className="text-gray-600 mb-4">
                  Your health data is encrypted and secure. We follow strict privacy standards to protect your
                  information.
                </p>
                <Badge className="bg-purple-100 text-purple-800">HIPAA Compliant</Badge>
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
              Get started with AI-powered healthcare in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Sign Up Free</h3>
              <p className="text-gray-600">
                Create your free account in seconds. No credit card required, no hidden fees.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Share Your Symptoms</h3>
              <p className="text-gray-600">
                Describe your health concerns through text, voice, or images. Our AI understands it all.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Get AI Insights</h3>
              <p className="text-gray-600">
                Receive personalized health insights, recommendations, and early detection alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from people whose lives have been improved by My Medi.AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "My Medi.AI helped me detect early signs of diabetes. The AI assistant guided me to get proper tests
                  done. Truly life-saving!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Priya Sharma</div>
                    <div className="text-sm text-gray-500">Mumbai, Maharashtra</div>
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
                  "Managing my family's health has never been easier. The voice analysis feature is amazing for my
                  elderly parents."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                    <UserCheck className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Rajesh Kumar</div>
                    <div className="text-sm text-gray-500">Delhi, NCR</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a working mother, having 24/7 health support is invaluable. The AI gives me peace of mind about my
                  children's health."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Anita Patel</div>
                    <div className="text-sm text-gray-500">Bangalore, Karnataka</div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Free Health Journey Today</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians who are taking control of their health with AI-powered assistance. No cost, no
            commitment - just better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg"
              onClick={() => window.open("https://mymedi.ai", "_blank")}
            >
              Visit mymedi.ai
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-purple-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Instant Access</span>
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
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Health Assistant
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
                    Family Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Early Detection
                  </a>
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
