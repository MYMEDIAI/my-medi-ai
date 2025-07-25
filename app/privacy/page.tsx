"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Your privacy and data security are our top priorities. Learn how we protect your health information.
          </p>
          <p className="text-purple-200">Last updated: January 25, 2025</p>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">HIPAA Compliant</h3>
                <p className="text-gray-600 text-sm">
                  We follow international healthcare data protection standards to keep your information secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-gray-600 text-sm">
                  Clear information about what data we collect, how we use it, and your rights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Control</h3>
                <p className="text-gray-600 text-sm">
                  You have full control over your data with options to access, modify, or delete it anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="mb-8 border-blue-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Information We Collect
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Health Information</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Symptoms and health concerns you share</li>
                      <li>Vital signs and health measurements</li>
                      <li>Medical history and current medications</li>
                      <li>Health assessment responses</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Name, age, and basic demographic information</li>
                      <li>Email address for communication</li>
                      <li>Language preferences</li>
                      <li>Location data (only when explicitly provided)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technical Information</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Device information and browser type</li>
                      <li>Usage patterns and interaction data</li>
                      <li>IP address and general location</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-green-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  How We Use Your Information
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Primary Uses</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Provide personalized health insights and recommendations</li>
                      <li>Generate AI-powered health assessments</li>
                      <li>Improve our AI models and platform functionality</li>
                      <li>Communicate important health information and updates</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Secondary Uses</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Analyze usage patterns to improve user experience</li>
                      <li>Conduct research to advance healthcare AI (anonymized data only)</li>
                      <li>Ensure platform security and prevent misuse</li>
                      <li>Comply with legal and regulatory requirements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-purple-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-purple-600" />
                  Data Security & Protection
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technical Safeguards</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>End-to-end encryption for all data transmission</li>
                      <li>Secure cloud storage with enterprise-grade protection</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      <li>Multi-factor authentication for administrative access</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Organizational Safeguards</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Limited access to health data on a need-to-know basis</li>
                      <li>Regular staff training on privacy and security protocols</li>
                      <li>Incident response procedures for potential breaches</li>
                      <li>Compliance with international healthcare data standards</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-orange-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-orange-600" />
                  Your Rights & Choices
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data Access Rights</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Request a copy of all personal data we hold about you</li>
                      <li>Access your health assessment history and results</li>
                      <li>Download your data in a portable format</li>
                      <li>Receive information about how your data is processed</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data Control Rights</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Correct or update inaccurate personal information</li>
                      <li>Delete your account and associated data</li>
                      <li>Restrict processing of your data for specific purposes</li>
                      <li>Opt-out of non-essential communications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-red-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-red-600" />
                  Data Sharing & Third Parties
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p className="font-semibold text-lg">
                    We do NOT sell your personal health information to third parties.
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Limited Sharing Scenarios</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>With your explicit consent for specific services</li>
                      <li>To comply with legal obligations or court orders</li>
                      <li>For emergency medical situations (anonymized when possible)</li>
                      <li>With service providers under strict confidentiality agreements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Service Providers</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Google Cloud Platform (for AI processing and secure storage)</li>
                      <li>Email service providers (for essential communications)</li>
                      <li>Analytics providers (using anonymized data only)</li>
                      <li>Security monitoring services</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-teal-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us About Privacy</h2>
                <div className="space-y-4 text-gray-700">
                  <p>If you have questions about this Privacy Policy or how we handle your data, please contact us:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Email:</strong> privacy@mymedi.ai
                    </p>
                    <p>
                      <strong>Primary Contact:</strong> Harsha@mymedi.ai
                    </p>
                    <p>
                      <strong>Address:</strong> Madanapalle, Andhra Pradesh, India
                    </p>
                  </div>
                  <p className="text-sm">We will respond to privacy-related inquiries within 30 days of receipt.</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Medical Disclaimer</h3>
              <p className="text-blue-800 text-sm">
                MyMedi.ai provides health information and AI-powered insights for educational purposes only. Our
                platform is not a substitute for professional medical advice, diagnosis, or treatment. Always consult
                with qualified healthcare providers for medical decisions. In case of medical emergencies, contact your
                local emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PoweredByFooter />
    </div>
  )
}
