"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle, Send, Clock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Thank you for your message! We'll get back to you within 24 hours.")
    setFormData({ name: "", email: "", subject: "", category: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <Link href="/">
            <Button variant="outline" className="flex items-center bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Have questions about MyMedi.ai? We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm mb-3">Get in touch via email for any inquiries</p>
                <a href="mailto:Harsha@mymedi.ai" className="text-purple-600 hover:underline font-medium">
                  Harsha@mymedi.ai
                </a>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm mb-3">Speak directly with our founder</p>
                <a href="tel:+919701744770" className="text-blue-600 hover:underline font-medium">
                  +91 9701744770
                </a>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600 text-sm mb-3">Based in India, serving globally</p>
                <p className="text-green-600 font-medium">Madanapalle, Andhra Pradesh</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Email inquiries: Within 24 hours</li>
                  <li>• Technical support: Within 48 hours</li>
                  <li>• Partnership requests: Within 3-5 days</li>
                  <li>• Media inquiries: Within 2-3 days</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-teal-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-6 h-6 text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Office Hours</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Monday - Friday: 9:00 AM - 6:00 PM IST</li>
                  <li>• Saturday: 10:00 AM - 4:00 PM IST</li>
                  <li>• Sunday: Closed</li>
                  <li>• Emergency support: 24/7 via email</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <Card className="border-purple-100 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="mt-1"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Inquiry Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership/Business</SelectItem>
                      <SelectItem value="media">Media/Press</SelectItem>
                      <SelectItem value="feedback">Feedback/Suggestions</SelectItem>
                      <SelectItem value="privacy">Privacy/Data Concerns</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className="mt-1"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="mt-1 min-h-[120px]"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> For medical emergencies, do not use this form. Contact your local emergency
                    services (108 in India) or visit the nearest hospital immediately.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-purple-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is MyMedi.ai free to use?</h3>
                <p className="text-gray-700">
                  Yes! We offer a comprehensive free plan with access to our AI health assistant, basic assessments, and
                  health tracking features.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate is the AI?</h3>
                <p className="text-gray-700">
                  Our AI is powered by Google Gemini and trained on medical data, but it's for informational purposes
                  only. Always consult healthcare professionals for medical decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my health data secure?</h3>
                <p className="text-gray-700">
                  Absolutely. We follow HIPAA-compliant security standards with end-to-end encryption and secure cloud
                  storage to protect your health information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you support multiple languages?</h3>
                <p className="text-gray-700">
                  Yes! We support 10+ Indian languages including Hindi, Tamil, Telugu, Bengali, Gujarati, and more,
                  making healthcare accessible to all Indians.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <PoweredByFooter />
    </div>
  )
}
