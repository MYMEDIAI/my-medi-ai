"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Rocket,
  Bell,
  Mail,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Clock,
  Gift,
  Zap,
  Heart,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function ComingSoonPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Launch date - 30 days from now
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = launchDate.getTime() - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && name) {
      setIsSubscribed(true)
      // Here you would typically send the data to your backend
      console.log("Subscription:", { email, name, feedback })
    }
  }

  const upcomingFeatures = [
    {
      title: "AI Dermatology Scanner",
      description: "Advanced skin condition analysis using computer vision",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      eta: "Week 1",
    },
    {
      title: "Mental Health Assistant",
      description: "AI-powered mental wellness support and therapy sessions",
      icon: Heart,
      color: "from-purple-500 to-pink-500",
      eta: "Week 2",
    },
    {
      title: "Lab Test Booking",
      description: "Home sample collection and lab test scheduling",
      icon: Shield,
      color: "from-cyan-500 to-blue-500",
      eta: "Week 3",
    },
    {
      title: "Pharmacy Network",
      description: "Medicine delivery and pharmacy partnerships across India",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      eta: "Week 4",
    },
  ]

  const earlyAccessBenefits = [
    "🎁 Free 3-month premium access",
    "⚡ Priority customer support",
    "🔥 Exclusive beta features",
    "💰 50% discount on family plans",
    "🏆 VIP community access",
    "📱 Early mobile app access",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MyMedLogo size="md" />
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-orange-400 text-orange-900 px-6 py-3 text-lg font-bold mb-8 animate-bounce">
              <Rocket className="w-5 h-5 mr-2" />
              COMING SOON
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Revolutionary Features
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Are Almost Here!
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get ready for the next generation of AI-powered healthcare features. Be among the first to experience
              cutting-edge medical technology designed specifically for Indian healthcare needs.
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">{countdown.days}</div>
                <div className="text-sm text-blue-100">Days</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-green-300">{countdown.hours}</div>
                <div className="text-sm text-blue-100">Hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-orange-300">{countdown.minutes}</div>
                <div className="text-sm text-blue-100">Minutes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-pink-300">{countdown.seconds}</div>
                <div className="text-sm text-blue-100">Seconds</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Bell className="w-5 h-5 mr-2" />
                Get Early Access
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Try Current Features
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🚀 What's Coming Next</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionary healthcare features launching in the next 30 days
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative"
              >
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    {feature.eta}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <div
                      className={`p-4 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300 w-fit`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Launching {feature.eta}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id="early-access" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">🎁 Get Early Access</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Be among the first 1,000 users to experience these revolutionary features and get exclusive benefits
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Benefits */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Early Access Benefits</h3>
                <div className="space-y-4">
                  {earlyAccessBenefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-3">
                    <Gift className="w-6 h-6 text-orange-600 mr-3" />
                    <h4 className="text-lg font-bold text-gray-900">Limited Time Offer</h4>
                  </div>
                  <p className="text-gray-600">
                    First 1,000 early access users get <strong>lifetime 50% discount</strong> on all premium features!
                  </p>
                </div>
              </div>

              {/* Form */}
              <div>
                {!isSubscribed ? (
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 text-center">Join the Waitlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubscribe} className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="w-full"
                          />
                        </div>

                        <div>
                          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                            What feature are you most excited about? (Optional)
                          </label>
                          <Textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us which upcoming feature interests you most..."
                            rows={4}
                            className="w-full"
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4"
                        >
                          <Bell className="w-5 h-5 mr-2" />
                          Get Early Access
                          <Sparkles className="w-5 h-5 ml-2" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">You're In! 🎉</h3>
                      <p className="text-gray-600 mb-6">
                        Thank you for joining our early access program. We'll notify you as soon as the new features are
                        ready!
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>Check your email</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Launch in 30 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Community</h2>
            <p className="text-lg text-gray-600">Thousands of users are already waiting for these features</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">25K+</div>
              <div className="text-gray-600">Waitlist Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98.5%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">30</div>
              <div className="text-gray-600">Days to Launch</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't Miss Out!</h2>
            <p className="text-xl mb-8 text-blue-100">
              Be part of the healthcare revolution. Get notified the moment these amazing features go live.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById("early-access")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Bell className="w-5 h-5 mr-2" />
                Join Waitlist Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
                asChild
              >
                <Link href="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PoweredByFooter />
    </div>
  )
}
