"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Baby,
  Heart,
  Pill,
  Utensils,
  FileText,
  MapPin,
  Brain,
  User,
  Shield,
  Activity,
  Clock,
  Apple,
  CreditCard,
  Stethoscope,
} from "lucide-react"

export default function NavigationButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* AI Health Chat */}
      <Link href="/chat">
        <div className="border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
            <MessageCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Health Chat</h3>
          <p className="text-gray-600 text-sm mb-4">
            Chat with AI doctor in your language. Get instant health advice and symptom analysis.
          </p>
          <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Start Chat
          </Button>
        </div>
      </Link>

      {/* Medicine Identifier */}
      <Link href="/medicine">
        <div className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
            <Pill className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicine Analyzer</h3>
          <p className="text-gray-600 text-sm mb-4">
            Get detailed medicine information, dosage, interactions, and safety guidelines.
          </p>
          <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            Analyze Medicine
          </Button>
        </div>
      </Link>

      {/* Diet Planner */}
      <Link href="/diet">
        <div className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
            <Utensils className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Diet Planner</h3>
          <p className="text-gray-600 text-sm mb-4">
            Get personalized meal plans based on your health conditions and preferences.
          </p>
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Plan Diet
          </Button>
        </div>
      </Link>

      {/* Report Analyzer */}
      <Link href="/reports">
        <div className="border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Analyzer</h3>
          <p className="text-gray-600 text-sm mb-4">
            Upload and analyze medical reports with AI-powered insights and recommendations.
          </p>
          <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Analyze Reports
          </Button>
        </div>
      </Link>

      {/* Diabetes Assessment */}
      <Link href="/diabetes-assessment">
        <div className="border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Diabetes Assessment</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete diabetes evaluation with personalized management plan and downloadable PDF report.
          </p>
          <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
            Start Assessment
          </Button>
        </div>
      </Link>

      {/* Location Services */}
      <Link href="/location">
        <div className="border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
            <MapPin className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Services</h3>
          <p className="text-gray-600 text-sm mb-4">
            Find nearby healthcare facilities, get location-based health recommendations and emergency services.
          </p>
          <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            Find Healthcare
          </Button>
        </div>
      </Link>

      {/* Weight Loss Plan */}
      <Link href="/weight-loss">
        <div className="border-pink-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Weight Loss Plan</h3>
          <p className="text-gray-600 text-sm mb-4">
            Personalized weight loss plans with Indian diet recommendations and exercise routines.
          </p>
          <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
            Start Journey
          </Button>
        </div>
      </Link>

      {/* Heart Health Assessment */}
      <Link href="/heart-health">
        <div className="border-red-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Heart Health</h3>
          <p className="text-gray-600 text-sm mb-4">
            Comprehensive cardiac assessment with risk evaluation and personalized care plan.
          </p>
          <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
            Check Heart Health
          </Button>
        </div>
      </Link>

      {/* Pregnancy Care */}
      <Link href="/pregnancy">
        <div className="border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white rounded-lg border p-6 text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
            <Baby className="w-8 h-8 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pregnancy Care</h3>
          <p className="text-gray-600 text-sm mb-4">
            Comprehensive pregnancy tracking with AI-powered insights and personalized care plans.
          </p>
          <Button size="sm" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
            Start Tracking
          </Button>
        </div>
      </Link>

      {/* Mental Health - Coming Soon */}
      <div className="border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health</h3>
        <p className="text-gray-600 text-sm mb-4">
          Depression, anxiety, and stress assessment with personalized mental wellness plan.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Women's Health - Coming Soon */}
      <div className="border-pink-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
          <User className="w-8 h-8 text-pink-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Women's Health</h3>
        <p className="text-gray-600 text-sm mb-4">
          Comprehensive women's health assessment including reproductive and hormonal health.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Child Health - Coming Soon */}
      <div className="border-yellow-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
          <Baby className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Child Health</h3>
        <p className="text-gray-600 text-sm mb-4">
          Pediatric health assessment with growth tracking and vaccination schedules.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Elderly Care - Coming Soon */}
      <div className="border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
          <User className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Elderly Care</h3>
        <p className="text-gray-600 text-sm mb-4">
          Specialized health assessment for senior citizens with age-specific recommendations.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Emergency Care - Coming Soon */}
      <div className="border-red-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Care</h3>
        <p className="text-gray-600 text-sm mb-4">
          Emergency health guidance, first aid instructions, and nearest hospital finder.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Fitness Tracker - Coming Soon */}
      <div className="border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
          <Activity className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fitness Tracker</h3>
        <p className="text-gray-600 text-sm mb-4">
          Track workouts, steps, calories, and get personalized fitness recommendations.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Sleep Analysis - Coming Soon */}
      <div className="border-indigo-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
          <Clock className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sleep Analysis</h3>
        <p className="text-gray-600 text-sm mb-4">
          Analyze sleep patterns, quality, and get personalized sleep improvement recommendations.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Nutrition Analysis - Coming Soon */}
      <div className="border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
          <Apple className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Nutrition Analysis</h3>
        <p className="text-gray-600 text-sm mb-4">
          Analyze your diet, track nutrients, and get personalized nutrition recommendations.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Insurance Guide - Coming Soon */}
      <div className="border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Insurance Guide</h3>
        <p className="text-gray-600 text-sm mb-4">
          Find the best health insurance plans, compare coverage, and get expert recommendations.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>

      {/* Telemedicine - Coming Soon */}
      <div className="border-teal-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-not-allowed group bg-gray-50 rounded-lg border p-6 text-center opacity-75">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
          <Stethoscope className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Telemedicine</h3>
        <p className="text-gray-600 text-sm mb-4">
          Connect with certified doctors online for consultations and medical advice.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">Coming Soon</Badge>
        </div>
      </div>
    </div>
  )
}
