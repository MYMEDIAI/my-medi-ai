"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  MessageCircle,
  User,
  Activity,
  Apple,
  Baby,
  UserCheck,
  FileText,
  Pill,
  MapPin,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  TreesIcon as Lungs,
  Shield,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  Sparkles,
  Zap,
  Star,
  Gem,
  BookOpen,
  Users,
  Building,
  Award,
  TrendingUp,
  Search,
  Microscope,
  Clipboard,
  Calculator,
  Database,
  Store,
  Leaf,
  Megaphone,
  AlertTriangle,
  TestTube,
  Code,
  Hand,
  Rocket,
  Clock,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"

interface EnhancedNavigationProps {
  currentPage?: string
  onAboutClick?: () => void
}

export default function EnhancedNavigation({ currentPage, onAboutClick }: EnhancedNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const aiServices = [
    {
      href: "/chat",
      icon: MessageCircle,
      label: "AI Health Chat",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "24/7 AI doctor consultation",
      badge: "GPT-4",
      status: "Beta",
    },
    {
      href: "/assessment",
      icon: User,
      label: "Health Assessment",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Comprehensive health evaluation",
      badge: "Gemini AI",
      status: "Beta",
    },
    {
      href: "/reports",
      icon: FileText,
      label: "Report Analyzer",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "OCR + AI report analysis",
      badge: "OCR + AI",
      status: "Beta",
    },
    {
      href: "/medicines",
      icon: Pill,
      label: "Medicine Identifier",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Smart medicine recognition",
      badge: "Vision AI",
      status: "Beta",
    },
    {
      href: "/body-mapper",
      icon: MapPin,
      label: "Body Symptom Mapper",
      color: "text-red-600",
      bg: "bg-red-50",
      description: "Interactive symptom mapping",
      badge: "Interactive",
      status: "Beta",
    },
    {
      href: "/vitals",
      icon: Activity,
      label: "Vitals Tracker",
      color: "text-pink-600",
      bg: "bg-pink-50",
      description: "Smart health monitoring",
      badge: "Real-time",
      status: "Beta",
    },
  ]

  const healthTools = [
    {
      href: "/diet",
      icon: Apple,
      label: "AI Diet Planner",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Personalized nutrition plans",
      status: "Beta",
    },
    {
      href: "/pregnancy",
      icon: Baby,
      label: "Pregnancy Care",
      color: "text-pink-600",
      bg: "bg-pink-50",
      description: "Comprehensive pregnancy tracking",
      status: "Beta",
    },
    {
      href: "/doctors",
      icon: UserCheck,
      label: "Find Doctors",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Connect with specialists",
      status: "Coming Soon",
    },
    {
      href: "/emergency",
      icon: AlertTriangle,
      label: "Emergency Care",
      color: "text-red-600",
      bg: "bg-red-50",
      description: "24/7 emergency assistance",
      status: "Coming Soon",
    },
    {
      href: "/pharmacy",
      icon: Store,
      label: "Online Pharmacy",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Medicine delivery service",
      status: "Coming Soon",
    },
    {
      href: "/lab-tests",
      icon: TestTube,
      label: "Lab Tests",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      description: "Home sample collection",
      status: "Coming Soon",
    },
  ]

  const specialties = [
    { label: "Cardiology", icon: Heart, color: "text-red-500", status: "Coming Soon" },
    { label: "Neurology", icon: Brain, color: "text-purple-500", status: "Coming Soon" },
    { label: "Ophthalmology", icon: Eye, color: "text-blue-500", status: "Coming Soon" },
    { label: "Orthopedics", icon: Bone, color: "text-gray-500", status: "Coming Soon" },
    { label: "Pulmonology", icon: Lungs, color: "text-cyan-500", status: "Coming Soon" },
    { label: "General Medicine", icon: Stethoscope, color: "text-green-500", status: "Coming Soon" },
    { label: "Dermatology", icon: Sparkles, color: "text-yellow-500", status: "Coming Soon" },
    { label: "Gastroenterology", icon: Apple, color: "text-orange-500", status: "Coming Soon" },
    { label: "Endocrinology", icon: Zap, color: "text-indigo-500", status: "Coming Soon" },
    { label: "Psychiatry", icon: Brain, color: "text-pink-500", status: "Coming Soon" },
    { label: "Pediatrics", icon: Baby, color: "text-green-400", status: "Coming Soon" },
    { label: "Gynecology", icon: Heart, color: "text-rose-500", status: "Coming Soon" },
  ]

  const cities = [
    { name: "Mumbai", state: "Maharashtra", status: "Coming Soon" },
    { name: "Delhi", state: "Delhi", status: "Coming Soon" },
    { name: "Bangalore", state: "Karnataka", status: "Coming Soon" },
    { name: "Chennai", state: "Tamil Nadu", status: "Coming Soon" },
    { name: "Kolkata", state: "West Bengal", status: "Coming Soon" },
    { name: "Hyderabad", state: "Telangana", status: "Coming Soon" },
    { name: "Pune", state: "Maharashtra", status: "Coming Soon" },
    { name: "Ahmedabad", state: "Gujarat", status: "Coming Soon" },
    { name: "Jaipur", state: "Rajasthan", status: "Coming Soon" },
    { name: "Lucknow", state: "Uttar Pradesh", status: "Coming Soon" },
    { name: "Kanpur", state: "Uttar Pradesh", status: "Coming Soon" },
    { name: "Nagpur", state: "Maharashtra", status: "Coming Soon" },
    { name: "Indore", state: "Madhya Pradesh", status: "Coming Soon" },
    { name: "Bhopal", state: "Madhya Pradesh", status: "Coming Soon" },
    { name: "Visakhapatnam", state: "Andhra Pradesh", status: "Coming Soon" },
    { name: "Patna", state: "Bihar", status: "Coming Soon" },
  ]

  const resources = [
    {
      href: "/blog",
      icon: BookOpen,
      label: "Health Blog",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Latest health articles",
      status: "Coming Soon",
    },
    {
      href: "/research",
      icon: Microscope,
      label: "Medical Research",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Scientific studies & papers",
      status: "Coming Soon",
    },
    {
      href: "/guidelines",
      icon: Clipboard,
      label: "Health Guidelines",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "WHO & medical guidelines",
      status: "Coming Soon",
    },
    {
      href: "/calculators",
      icon: Calculator,
      label: "Health Calculators",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "BMI, calorie & health tools",
      status: "Coming Soon",
    },
    {
      href: "/symptoms",
      icon: Search,
      label: "Symptom Checker",
      color: "text-red-600",
      bg: "bg-red-50",
      description: "AI-powered symptom analysis",
      status: "Coming Soon",
    },
    {
      href: "/drug-database",
      icon: Database,
      label: "Drug Database",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      description: "Comprehensive medicine info",
      status: "Coming Soon",
    },
  ]

  const supportOptions = [
    {
      href: "/help",
      icon: BookOpen,
      label: "Help Center",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "FAQs & tutorials",
      status: "Available",
    },
    {
      href: "/contact",
      icon: Phone,
      label: "Contact Support",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "24/7 customer support",
      status: "Available",
    },
    {
      href: "/feedback",
      icon: MessageCircle,
      label: "Feedback",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Share your experience",
      status: "Available",
    },
    {
      href: "/community",
      icon: Users,
      label: "Community",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Connect with others",
      status: "Coming Soon",
    },
    {
      href: "/api",
      icon: Code,
      label: "API Documentation",
      color: "text-gray-600",
      bg: "bg-gray-50",
      description: "Developer resources",
      status: "Coming Soon",
    },
    {
      href: "/status",
      icon: Activity,
      label: "System Status",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Service availability",
      status: "Available",
    },
  ]

  const companyInfo = [
    {
      href: "/careers",
      icon: Building,
      label: "Careers",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Join our team",
      status: "Available",
    },
    {
      href: "/investors",
      icon: TrendingUp,
      label: "Investors",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Investment information",
      status: "Available",
    },
    {
      href: "/press",
      icon: Megaphone,
      label: "Press & Media",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "News & press releases",
      status: "Available",
    },
    {
      href: "/partnerships",
      icon: Hand,
      label: "Partnerships",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Business partnerships",
      status: "Available",
    },
    {
      href: "/awards",
      icon: Award,
      label: "Awards & Recognition",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      description: "Our achievements",
      status: "Available",
    },
    {
      href: "/sustainability",
      icon: Leaf,
      label: "Sustainability",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Environmental commitment",
      status: "Available",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Beta":
        return <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">Beta</Badge>
      case "Coming Soon":
        return (
          <Badge className="text-xs bg-orange-100 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        )
      case "Available":
        return <Badge className="text-xs bg-green-100 text-green-700 border-green-200">Available</Badge>
      default:
        return null
    }
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <MyMedLogo size="lg" className="text-white" />
            <div className="hidden md:flex items-center space-x-2">
              <Badge className="bg-orange-400 text-orange-900 hover:bg-orange-400 animate-pulse">
                <Rocket className="w-3 h-3 mr-1" />
                Beta
              </Badge>
              <Badge className="bg-green-400 text-green-900 hover:bg-green-400">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Badge className="bg-blue-400 text-blue-900 hover:bg-blue-400">
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link href="/">
              <Button
                variant={currentPage === "home" ? "secondary" : "ghost"}
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>

            {/* About */}
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              onClick={onAboutClick}
            >
              <BookOpen className="w-4 h-4 mr-2 text-blue-300" />
              About
            </Button>

            {/* AI Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-300 animate-pulse" />
                  AI Services
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-purple-700 py-3">
                  <Gem className="w-5 h-5 inline mr-2" />
                  AI-Powered Health Services (Beta)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {aiServices.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <Link href={service.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg hover:${service.bg} transition-all duration-200 w-full`}
                      >
                        <div className={`p-2 rounded-full ${service.bg} shadow-sm`}>
                          <service.icon className={`w-5 h-5 ${service.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">{service.label}</div>
                            <div className="flex items-center space-x-1">
                              <Badge className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                                {service.badge}
                              </Badge>
                              {getStatusBadge(service.status)}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Health Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Shield className="w-4 h-4 mr-2 text-green-300" />
                  Health Tools
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-green-700 py-3">
                  <Heart className="w-5 h-5 inline mr-2" />
                  Comprehensive Health Tools
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {healthTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg hover:${tool.bg} transition-all duration-200 w-full`}
                      >
                        <div className={`p-2 rounded-full ${tool.bg} shadow-sm`}>
                          <tool.icon className={`w-5 h-5 ${tool.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">{tool.label}</div>
                            {getStatusBadge(tool.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{tool.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Medical Specialties Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Stethoscope className="w-4 h-4 mr-2 text-blue-300" />
                  Specialties
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-blue-700 py-3">
                  <Star className="w-5 h-5 inline mr-2" />
                  Medical Specialties (Coming Soon)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid grid-cols-1 gap-1">
                  {specialties.map((specialty) => (
                    <DropdownMenuItem key={specialty.label} asChild>
                      <Link href={`/doctors?specialty=${specialty.label.toLowerCase()}`} className="cursor-pointer">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 w-full">
                          <div className="flex items-center space-x-3">
                            <specialty.icon className={`w-5 h-5 ${specialty.color}`} />
                            <div>
                              <div className="font-semibold text-gray-800">{specialty.label}</div>
                              <div className="text-xs text-gray-500">Expert specialists</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">{getStatusBadge(specialty.status)}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cities & Locations Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Globe className="w-4 h-4 mr-2 text-cyan-300" />
                  Locations
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-cyan-700 py-3">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Healthcare Locations (Coming Soon)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="grid grid-cols-1 gap-1">
                  {cities.map((city) => (
                    <DropdownMenuItem key={city.name} asChild>
                      <Link href={`/city/${city.name.toLowerCase()}`} className="cursor-pointer">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-cyan-50 transition-all duration-200 w-full">
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-cyan-600" />
                            <div>
                              <div className="font-semibold text-gray-800">{city.name}</div>
                              <div className="text-xs text-gray-500">{city.state}</div>
                            </div>
                          </div>
                          <div className="text-right">{getStatusBadge(city.status)}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 mr-2 text-indigo-300" />
                  Resources
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-indigo-700 py-3">
                  <BookOpen className="w-5 h-5 inline mr-2" />
                  Health Resources
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {resources.map((resource) => (
                  <DropdownMenuItem key={resource.href} asChild>
                    <Link href={resource.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg hover:${resource.bg} transition-all duration-200 w-full`}
                      >
                        <div className={`p-2 rounded-full ${resource.bg} shadow-sm`}>
                          <resource.icon className={`w-5 h-5 ${resource.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">{resource.label}</div>
                            {getStatusBadge(resource.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{resource.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Support Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <BookOpen className="w-4 h-4 mr-2 text-orange-300" />
                  Support
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-orange-700 py-3">
                  <BookOpen className="w-5 h-5 inline mr-2" />
                  Support & Help
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {supportOptions.map((option) => (
                  <DropdownMenuItem key={option.href} asChild>
                    <Link href={option.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg hover:${option.bg} transition-all duration-200 w-full`}
                      >
                        <div className={`p-2 rounded-full ${option.bg} shadow-sm`}>
                          <option.icon className={`w-5 h-5 ${option.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">{option.label}</div>
                            {getStatusBadge(option.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="tel:+919701744770" className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-200 w-full">
                      <div className="p-2 rounded-full bg-green-50 shadow-sm">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Call Harsha</div>
                        <div className="text-xs text-gray-500 mt-1">+91 9701744770 - Direct support</div>
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="mailto:contact@mymed.ai" className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 w-full">
                      <div className="p-2 rounded-full bg-blue-50 shadow-sm">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Email Support</div>
                        <div className="text-xs text-gray-500 mt-1">contact@mymed.ai - 24/7 support</div>
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Building className="w-4 h-4 mr-2 text-purple-300" />
                  Company
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-purple-700 py-3">
                  <Building className="w-5 h-5 inline mr-2" />
                  Company Information
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companyInfo.map((info) => (
                  <DropdownMenuItem key={info.href} asChild>
                    <Link href={info.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg hover:${info.bg} transition-all duration-200 w-full`}
                      >
                        <div className={`p-2 rounded-full ${info.bg} shadow-sm`}>
                          <info.icon className={`w-5 h-5 ${info.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800">{info.label}</div>
                            {getStatusBadge(info.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{info.description}</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="lg:hidden text-white hover:bg-white/20" onClick={() => setIsOpen(!isOpen)}>
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
              ></span>
            </div>
          </Button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button
                variant="ghost"
                className="w-full text-white hover:bg-white/20 justify-start h-auto p-3"
                onClick={() => {
                  onAboutClick?.()
                  setIsOpen(false)
                }}
              >
                <div className="flex flex-col items-center space-y-1">
                  <BookOpen className="w-5 h-5 text-blue-300" />
                  <span className="text-xs text-center">About</span>
                </div>
              </Button>

              {[...aiServices.slice(0, 5), ...healthTools.slice(0, 3)].map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/20 justify-start h-auto p-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs text-center">{item.label}</span>
                      {item.status === "Beta" && (
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">Beta</Badge>
                      )}
                    </div>
                  </Button>
                </Link>
              ))}

              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/20 justify-start h-auto p-3"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Phone className="w-5 h-5 text-orange-300" />
                    <span className="text-xs text-center">Contact</span>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Quick Contact in Mobile */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-center space-x-4">
                <a href="tel:+919701744770" className="text-white hover:text-green-300 transition-colors">
                  <Phone className="w-6 h-6" />
                </a>
                <a href="mailto:contact@mymed.ai" className="text-white hover:text-blue-300 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="/help" className="text-white hover:text-orange-300 transition-colors">
                  <BookOpen className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
