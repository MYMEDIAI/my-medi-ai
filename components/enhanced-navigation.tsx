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
  Calendar,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  Sparkles,
  Zap,
  Star,
  Crown,
  Gem,
  Info,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"

interface EnhancedNavigationProps {
  currentPage?: string
  onAboutClick?: () => void
}

export default function EnhancedNavigation({ currentPage, onAboutClick }: EnhancedNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const aiServices = [
    { href: "/chat", icon: MessageCircle, label: "AI Health Chat", color: "text-purple-600", bg: "bg-purple-50" },
    { href: "/assessment", icon: User, label: "Health Assessment", color: "text-blue-600", bg: "bg-blue-50" },
    { href: "/reports", icon: FileText, label: "Report Analyzer", color: "text-green-600", bg: "bg-green-50" },
    { href: "/medicines", icon: Pill, label: "Medicine Identifier", color: "text-orange-600", bg: "bg-orange-50" },
    { href: "/body-mapper", icon: MapPin, label: "Body Symptom Mapper", color: "text-red-600", bg: "bg-red-50" },
    { href: "/vitals", icon: Activity, label: "Vitals Tracker", color: "text-pink-600", bg: "bg-pink-50" },
  ]

  const healthTools = [
    { href: "/diet", icon: Apple, label: "Diet Planner", color: "text-green-600", bg: "bg-green-50" },
    { href: "/pregnancy", icon: Baby, label: "Pregnancy Care", color: "text-pink-600", bg: "bg-pink-50" },
    { href: "/doctors", icon: UserCheck, label: "Find Doctors", color: "text-blue-600", bg: "bg-blue-50" },
  ]

  const specialties = [
    { label: "Cardiology", icon: Heart, color: "text-red-500" },
    { label: "Neurology", icon: Brain, color: "text-purple-500" },
    { label: "Ophthalmology", icon: Eye, color: "text-blue-500" },
    { label: "Orthopedics", icon: Bone, color: "text-gray-500" },
    { label: "Pulmonology", icon: Lungs, color: "text-cyan-500" },
    { label: "General Medicine", icon: Stethoscope, color: "text-green-500" },
  ]

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Nagpur",
  ]

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <MyMedLogo size="lg" className="text-white" />
            <div className="hidden md:flex items-center space-x-2">
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 animate-pulse">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
              <Badge className="bg-green-400 text-green-900 hover:bg-green-400">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
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
              <Info className="w-4 h-4 mr-2 text-blue-300" />
              About
            </Button>

            {/* AI Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                  AI Services
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <DropdownMenuLabel className="text-center font-bold text-purple-700">
                  <Gem className="w-4 h-4 inline mr-2" />
                  AI-Powered Health Tools
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {aiServices.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <Link href={service.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-2 rounded-lg hover:${service.bg} transition-all duration-200`}
                      >
                        <div className={`p-2 rounded-full ${service.bg}`}>
                          <service.icon className={`w-4 h-4 ${service.color}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{service.label}</div>
                          <div className="text-xs text-gray-500">AI-powered analysis</div>
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
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <DropdownMenuLabel className="text-center font-bold text-green-700">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Wellness & Care
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {healthTools.map((tool) => (
                  <DropdownMenuItem key={tool.href} asChild>
                    <Link href={tool.href} className="cursor-pointer">
                      <div
                        className={`flex items-center space-x-3 p-2 rounded-lg hover:${tool.bg} transition-all duration-200`}
                      >
                        <div className={`p-2 rounded-full ${tool.bg}`}>
                          <tool.icon className={`w-4 h-4 ${tool.color}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{tool.label}</div>
                          <div className="text-xs text-gray-500">Personalized care</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Specialties Dropdown */}
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
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <DropdownMenuLabel className="text-center font-bold text-blue-700">
                  <Star className="w-4 h-4 inline mr-2" />
                  Medical Specialties
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {specialties.map((specialty) => (
                  <DropdownMenuItem key={specialty.label} asChild>
                    <Link href={`/doctors?specialty=${specialty.label.toLowerCase()}`} className="cursor-pointer">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                        <specialty.icon className={`w-5 h-5 ${specialty.color}`} />
                        <div>
                          <div className="font-medium text-gray-800">{specialty.label}</div>
                          <div className="text-xs text-gray-500">Expert doctors</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cities Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Globe className="w-4 h-4 mr-2 text-cyan-300" />
                  Cities
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-80 overflow-y-auto">
                <DropdownMenuLabel className="text-center font-bold text-cyan-700">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Available Cities
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {cities.map((city) => (
                  <DropdownMenuItem key={city} asChild>
                    <Link href={`/city/${city.toLowerCase()}`} className="cursor-pointer">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-cyan-50 transition-all duration-200">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                        <div>
                          <div className="font-medium text-gray-800">{city}</div>
                          <div className="text-xs text-gray-500">Healthcare services</div>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2 text-orange-300" />
                  Contact
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <DropdownMenuLabel className="text-center font-bold text-orange-700">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Get in Touch
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="tel:+919701744770" className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-800">Call Harsha</div>
                        <div className="text-xs text-gray-500">+91 9701744770</div>
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="mailto:contact@mymed.ai" className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200">
                      <Mail className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-800">Email Us</div>
                        <div className="text-xs text-gray-500">contact@mymed.ai</div>
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="cursor-pointer">
                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-orange-50 transition-all duration-200">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-800">Book Appointment</div>
                        <div className="text-xs text-gray-500">Schedule consultation</div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
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

        {/* Mobile Menu */}
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
                  <Info className="w-5 h-5" />
                  <span className="text-xs text-center">About</span>
                </div>
              </Button>
              {[...aiServices, ...healthTools].map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-white/20 justify-start h-auto p-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs text-center">{item.label}</span>
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
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="text-xs text-center">Contact</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
