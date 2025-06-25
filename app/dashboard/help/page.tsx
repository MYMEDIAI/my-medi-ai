"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Book,
  Video,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const faqItems = [
    {
      question: "How do I add a new health record?",
      answer:
        "Navigate to the Health Records section and click the 'Add Record' button. You can upload documents, enter manual data, or import from connected devices.",
      category: "Health Records",
    },
    {
      question: "Can I share my health data with my doctor?",
      answer:
        "Yes, you can securely share your health records with healthcare providers through the sharing feature in each record's details page.",
      category: "Data Sharing",
    },
    {
      question: "How accurate is the AI health assistant?",
      answer:
        "Our AI assistant provides general health information and should not replace professional medical advice. Always consult with healthcare professionals for medical decisions.",
      category: "AI Assistant",
    },
    {
      question: "Is my health data secure and private?",
      answer:
        "Yes, we use enterprise-grade encryption and follow HIPAA compliance standards to protect your health information. Your data is never shared without your explicit consent.",
      category: "Privacy & Security",
    },
    {
      question: "How do I set up family member profiles?",
      answer:
        "Go to the Family Health section and click 'Add Family Member'. You can create profiles for family members and manage their health information with appropriate permissions.",
      category: "Family Health",
    },
    {
      question: "Can I connect my fitness tracker or smartwatch?",
      answer:
        "Yes, we support integration with popular fitness devices and health apps. Go to Settings > Connected Devices to set up your integrations.",
      category: "Device Integration",
    },
  ]

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using My Medi.AI",
      icon: Book,
      articles: 12,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Health Records",
      description: "Managing your medical documents and data",
      icon: FileText,
      articles: 8,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "AI Assistant",
      description: "Using the AI health assistant effectively",
      icon: MessageSquare,
      articles: 6,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Family Health",
      description: "Managing health for family members",
      icon: HelpCircle,
      articles: 5,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageSquare,
      availability: "24/7",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Phone Support",
      description: "Call us for immediate assistance",
      icon: Phone,
      availability: "Mon-Fri 9AM-6PM",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Email Support",
      description: "Send us your questions via email",
      icon: Mail,
      availability: "Response within 24 hours",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers to your questions and get the help you need</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-center"
              />
            </div>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}
                >
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <Badge variant="outline" className="text-xs">
                  {category.articles} articles
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFAQ.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex-1">{faq.question}</h4>
                    <Badge variant="outline" className="text-xs ml-2">
                      {faq.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <option.icon className={`w-8 h-8 ${option.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <p className="text-xs text-gray-500 mb-4">{option.availability}</p>
                  <Button variant="outline" size="sm">
                    Get Help
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2 text-purple-600" />
                Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Getting Started with My Medi.AI",
                  "Using the AI Health Assistant",
                  "Managing Family Health Records",
                  "Setting Up Health Goals",
                ].map((tutorial, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Video className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-900">{tutorial}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { service: "AI Assistant", status: "Operational" },
                  { service: "Health Records", status: "Operational" },
                  { service: "Data Sync", status: "Operational" },
                  { service: "Mobile App", status: "Operational" },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{service.service}</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-900">Demo Help & Support</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Demo Features:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Comprehensive FAQ section</li>
                  <li>• Help article categories</li>
                  <li>• Contact support options</li>
                  <li>• Video tutorial links</li>
                  <li>• System status monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Full Version Support:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• 24/7 live chat support</li>
                  <li>• Phone support with medical experts</li>
                  <li>• Comprehensive knowledge base</li>
                  <li>• Interactive tutorials and guides</li>
                  <li>• Community forums and discussions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
