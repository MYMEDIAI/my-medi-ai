"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Menu,
  Home,
  MessageCircle,
  Activity,
  Apple,
  Baby,
  UserCheck,
  User,
  FileText,
  Pill,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Heart,
  Brain,
  Eye,
  Bone,
  TreesIcon as Lungs,
  Shield,
  Globe,
  BookOpen,
  Search,
  Microscope,
  Clipboard,
  Calculator,
  Database,
  Store,
  AlertTriangle,
  TestTube,
  Rocket,
  Star,
  Zap,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"

interface EnhancedNavigationProps {
  currentPage?: string
  onAboutClick?: () => void
}

export default function EnhancedNavigation({ currentPage, onAboutClick }: EnhancedNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const aiServices = [
    {
      href: "/chat",
      icon: MessageCircle,
      label: "AI Health Chat",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "24/7 AI doctor consultation",
      badge: "GPT-4",
      status: "Live",
    },
    {
      href: "/assessment",
      icon: Stethoscope,
      label: "Health Assessment",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Comprehensive health evaluation",
      badge: "Gemini AI",
      status: "Live",
    },
    {
      href: "/reports",
      icon: FileText,
      label: "Report Analyzer",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "OCR + AI report analysis",
      badge: "OCR + AI",
      status: "Live",
    },
    {
      href: "/medicines",
      icon: Pill,
      label: "Medicine Identifier",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Smart medicine recognition",
      badge: "Vision AI",
      status: "Live",
    },
    {
      href: "/body-mapper",
      icon: User,
      label: "Body Symptom Mapper",
      color: "text-red-600",
      bg: "bg-red-50",
      description: "Interactive symptom mapping",
      badge: "Interactive",
      status: "Live",
    },
    {
      href: "/vitals",
      icon: Activity,
      label: "Vitals Tracker",
      color: "text-pink-600",
      bg: "bg-pink-50",
      description: "Smart health monitoring",
      badge: "Real-time",
      status: "Live",
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
      status: "Live",
    },
    {
      href: "/pregnancy",
      icon: Baby,
      label: "Pregnancy Care",
      color: "text-pink-600",
      bg: "bg-pink-50",
      description: "Comprehensive pregnancy tracking",
      status: "Live",
    },
    {
      href: "/doctors",
      icon: UserCheck,
      label: "Find Doctors",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Connect with specialists",
      status: "Live",
    },
    {
      href: "/emergency",
      icon: AlertTriangle,
      label: "Emergency Care",
      color: "text-red-600",
      bg: "bg-red-50",
      description: "24/7 emergency assistance",
      status: "Live",
    },
    {
      href: "/pharmacy",
      icon: Store,
      label: "Online Pharmacy",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Medicine delivery service",
      status: "Live",
    },
    {
      href: "/lab-tests",
      icon: TestTube,
      label: "Lab Tests",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      description: "Home sample collection",
      status: "Live",
    },
  ]

  const specialties = [
    { label: "Cardiology", icon: Heart, color: "text-red-500", href: "/doctors?specialty=cardiology", status: "Live" },
    { label: "Neurology", icon: Brain, color: "text-purple-500", href: "/doctors?specialty=neurology", status: "Live" },
    {
      label: "Ophthalmology",
      icon: Eye,
      color: "text-blue-500",
      href: "/doctors?specialty=ophthalmology",
      status: "Live",
    },
    {
      label: "Orthopedics",
      icon: Bone,
      color: "text-gray-500",
      href: "/doctors?specialty=orthopedics",
      status: "Live",
    },
    {
      label: "Pulmonology",
      icon: Lungs,
      color: "text-cyan-500",
      href: "/doctors?specialty=pulmonology",
      status: "Live",
    },
    {
      label: "General Medicine",
      icon: Stethoscope,
      color: "text-green-500",
      href: "/doctors?specialty=general",
      status: "Live",
    },
    {
      label: "Dermatology",
      icon: Sparkles,
      color: "text-yellow-500",
      href: "/doctors?specialty=dermatology",
      status: "Live",
    },
    {
      label: "Gastroenterology",
      icon: Apple,
      color: "text-orange-500",
      href: "/doctors?specialty=gastroenterology",
      status: "Live",
    },
    {
      label: "Endocrinology",
      icon: Zap,
      color: "text-indigo-500",
      href: "/doctors?specialty=endocrinology",
      status: "Live",
    },
    { label: "Psychiatry", icon: Brain, color: "text-pink-500", href: "/doctors?specialty=psychiatry", status: "Live" },
    { label: "Pediatrics", icon: Baby, color: "text-green-400", href: "/doctors?specialty=pediatrics", status: "Live" },
    { label: "Gynecology", icon: Heart, color: "text-rose-500", href: "/doctors?specialty=gynecology", status: "Live" },
  ]

  const cities = [
    { name: "Mumbai", state: "Maharashtra", href: "/city/mumbai", status: "Live" },
    { name: "Delhi", state: "Delhi", href: "/city/delhi", status: "Live" },
    { name: "Bangalore", state: "Karnataka", href: "/city/bangalore", status: "Live" },
    { name: "Chennai", state: "Tamil Nadu", href: "/city/chennai", status: "Live" },
    { name: "Kolkata", state: "West Bengal", href: "/city/kolkata", status: "Live" },
    { name: "Hyderabad", state: "Telangana", href: "/city/hyderabad", status: "Live" },
    { name: "Pune", state: "Maharashtra", href: "/city/pune", status: "Live" },
    { name: "Ahmedabad", state: "Gujarat", href: "/city/ahmedabad", status: "Live" },
    { name: "Jaipur", state: "Rajasthan", href: "/city/jaipur", status: "Live" },
    { name: "Lucknow", state: "Uttar Pradesh", href: "/city/lucknow", status: "Live" },
    { name: "Kanpur", state: "Uttar Pradesh", href: "/city/kanpur", status: "Live" },
    { name: "Nagpur", state: "Maharashtra", href: "/city/nagpur", status: "Live" },
  ]

  const resources = [
    {
      href: "/blog",
      icon: BookOpen,
      label: "Health Blog",
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Latest health articles",
      status: "Live",
    },
    {
      href: "/research",
      icon: Microscope,
      label: "Medical Research",
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Scientific studies & papers",
      status: "Live",
    },
    {
      href: "/guidelines",
      icon: Clipboard,
      label: "Health Guidelines",
      color: "text-green-600",
      bg: "bg-green-50",
      description: "WHO & medical guidelines",
      status: "Live",
    },
    {
      href: "/calculators",
      icon: Calculator,
      label: "Health Calculators",
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "BMI, calorie & health tools",
      status: "Live",
    },
    {
      href: "/symptoms",
      icon: Search,
      label: "Symptom Checker",
      color: "text-red-600",
      bg: "bg-red-50",
      description: "AI-powered symptom analysis",
      status: "Live",
    },
    {
      href: "/drug-database",
      icon: Database,
      label: "Drug Database",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      description: "Comprehensive medicine info",
      status: "Live",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live":
        return <Badge className="text-xs bg-green-100 text-green-700 border-green-200">Live</Badge>
      case "Beta":
        return <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">Beta</Badge>
      case "New":
        return <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200">New</Badge>
      default:
        return null
    }
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <MyMedLogo size="lg" className="text-white" theme="dark" />
            <div className="hidden md:flex items-center space-x-2">
              <Badge className="bg-orange-400 text-orange-900 hover:bg-orange-400 animate-pulse">
                <Rocket className="w-3 h-3 mr-1" />
                Live
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
          </Link>

          {/* Desktop Navigation - Simplified */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link href="/">
              <Button
                variant={currentPage === "home" ? "secondary" : "ghost"}
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              onClick={onAboutClick}
            >
              <BookOpen className="w-4 h-4 mr-2 text-blue-300" />
              About
            </Button>

            <Link href="/chat">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-yellow-300" />
                AI Chat
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Live</Badge>
              </Button>
            </Link>

            <Link href="/assessment">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <Stethoscope className="w-4 h-4 mr-2 text-green-300" />
                Assessment
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Live</Badge>
              </Button>
            </Link>

            <Link href="/doctors">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <UserCheck className="w-4 h-4 mr-2 text-blue-300" />
                Doctors
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Live</Badge>
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden text-white hover:bg-white/20 p-2">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-80 p-0 bg-white">
              <SheetHeader className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-white">
                    <MyMedLogo size="md" theme="dark" />
                  </SheetTitle>
                  <Button variant="ghost" size="sm" onClick={closeMenu} className="text-white hover:bg-white/20">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-green-400 text-green-900">
                    <Zap className="w-3 h-3 mr-1" />
                    All Features Live
                  </Badge>
                  <Badge className="bg-orange-400 text-orange-900">
                    <Shield className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-140px)] px-6 py-4">
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Rocket className="w-4 h-4 mr-2 text-blue-600" />
                    Quick Start
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/chat" onClick={closeMenu}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm h-12">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        AI Chat
                      </Button>
                    </Link>
                    <Link href="/assessment" onClick={closeMenu}>
                      <Button variant="outline" className="w-full text-sm h-12 bg-transparent">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Assessment
                      </Button>
                    </Link>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* AI Services */}
                <Collapsible
                  open={openSections.includes("ai-services")}
                  onOpenChange={() => toggleSection("ai-services")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-3 text-purple-600" />
                      <span className="font-semibold text-gray-900">AI Services</span>
                      <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">6 Live</Badge>
                    </div>
                    {openSections.includes("ai-services") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {aiServices.map((service) => (
                      <Link key={service.href} href={service.href} onClick={closeMenu}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ml-4">
                          <div className={`p-2 rounded-full ${service.bg}`}>
                            <service.icon className={`w-4 h-4 ${service.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 text-sm">{service.label}</span>
                              {getStatusBadge(service.status)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-4" />

                {/* Health Tools */}
                <Collapsible
                  open={openSections.includes("health-tools")}
                  onOpenChange={() => toggleSection("health-tools")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-3 text-red-600" />
                      <span className="font-semibold text-gray-900">Health Tools</span>
                      <Badge className="ml-2 bg-green-100 text-green-700 text-xs">6 Live</Badge>
                    </div>
                    {openSections.includes("health-tools") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {healthTools.map((tool) => (
                      <Link key={tool.href} href={tool.href} onClick={closeMenu}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ml-4">
                          <div className={`p-2 rounded-full ${tool.bg}`}>
                            <tool.icon className={`w-4 h-4 ${tool.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 text-sm">{tool.label}</span>
                              {getStatusBadge(tool.status)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-4" />

                {/* Medical Specialties */}
                <Collapsible
                  open={openSections.includes("specialties")}
                  onOpenChange={() => toggleSection("specialties")}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Stethoscope className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="font-semibold text-gray-900">Specialties</span>
                      <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">12 Live</Badge>
                    </div>
                    {openSections.includes("specialties") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    <div className="grid grid-cols-2 gap-1 ml-4">
                      {specialties.map((specialty) => (
                        <Link key={specialty.label} href={specialty.href} onClick={closeMenu}>
                          <div className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-center">
                            <specialty.icon className={`w-5 h-5 ${specialty.color} mb-1`} />
                            <span className="text-xs font-medium text-gray-900">{specialty.label}</span>
                            <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Live</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-4" />

                {/* Cities */}
                <Collapsible open={openSections.includes("cities")} onOpenChange={() => toggleSection("cities")}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 mr-3 text-cyan-600" />
                      <span className="font-semibold text-gray-900">Cities</span>
                      <Badge className="ml-2 bg-cyan-100 text-cyan-700 text-xs">12 Live</Badge>
                    </div>
                    {openSections.includes("cities") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    <div className="grid grid-cols-2 gap-1 ml-4">
                      {cities.map((city) => (
                        <Link key={city.name} href={city.href} onClick={closeMenu}>
                          <div className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-center">
                            <MapPin className="w-4 h-4 text-cyan-600 mb-1" />
                            <span className="text-xs font-medium text-gray-900">{city.name}</span>
                            <span className="text-xs text-gray-500">{city.state}</span>
                            <Badge className="mt-1 bg-green-100 text-green-700 text-xs">Live</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-4" />

                {/* Resources */}
                <Collapsible open={openSections.includes("resources")} onOpenChange={() => toggleSection("resources")}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="font-semibold text-gray-900">Resources</span>
                      <Badge className="ml-2 bg-indigo-100 text-indigo-700 text-xs">6 Live</Badge>
                    </div>
                    {openSections.includes("resources") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {resources.map((resource) => (
                      <Link key={resource.href} href={resource.href} onClick={closeMenu}>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ml-4">
                          <div className={`p-2 rounded-full ${resource.bg}`}>
                            <resource.icon className={`w-4 h-4 ${resource.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 text-sm">{resource.label}</span>
                              {getStatusBadge(resource.status)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                    Contact & Support
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+919701744770"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Call Harsha</p>
                        <p className="text-xs text-gray-600">+91 9701744770</p>
                      </div>
                    </a>
                    <a
                      href="mailto:contact@mymed.ai"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Support</p>
                        <p className="text-xs text-gray-600">contact@mymed.ai</p>
                      </div>
                    </a>
                    <div className="flex items-center space-x-3 p-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-xs text-gray-600">Amavarathi, Andhra Pradesh</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App Stats */}
                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-600" />
                    Platform Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">50+</p>
                      <p className="text-xs text-gray-600">Live Features</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">24/7</p>
                      <p className="text-xs text-gray-600">AI Support</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">12</p>
                      <p className="text-xs text-gray-600">Specialties</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-orange-600">100%</p>
                      <p className="text-xs text-gray-600">Secure</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
