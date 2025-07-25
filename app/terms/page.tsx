"use client"

import Link from "next/link"
import { ArrowLeft, FileText, AlertTriangle, Shield, Users, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Please read these terms carefully before using MyMedi.ai. They govern your use of our platform and services.
          </p>
          <p className="text-purple-200">Last updated: January 25, 2025</p>
        </div>
      </section>

      {/* Medical Disclaimer Alert */}
      <section className="py-8 bg-red-50">
        <div className="container mx-auto px-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Important Medical Disclaimer:</strong> MyMedi.ai is an AI-powered health information platform and
              is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified
              healthcare providers for medical decisions. In emergencies, contact local emergency services immediately.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="mb-8 border-blue-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Acceptance of Terms
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    By accessing or using MyMedi.ai ("the Platform"), you agree to be bound by these Terms of Service
                    ("Terms"). If you do not agree to these Terms, please do not use our Platform.
                  </p>
                  <p>
                    These Terms constitute a legally binding agreement between you and MyMedi.ai, operated by Bandarla
                    Harshavardhan ("we," "us," or "our"). We may update these Terms from time to time, and your
                    continued use of the Platform constitutes acceptance of any changes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-green-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-green-600" />
                  Platform Description & Services
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What We Provide</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>AI-powered health information and educational content</li>
                      <li>Symptom analysis and general health guidance</li>
                      <li>Health assessment tools and tracking features</li>
                      <li>Multi-language support for Indian users</li>
                      <li>Integration with traditional and modern healthcare approaches</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">What We Do NOT Provide</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Medical diagnosis or treatment recommendations</li>
                      <li>Prescription of medications or medical devices</li>
                      <li>Emergency medical services or urgent care</li>
                      <li>Professional medical consultations</li>
                      <li>Replacement for licensed healthcare providers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-purple-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-purple-600" />
                  User Responsibilities
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Appropriate Use</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Use the Platform for informational and educational purposes only</li>
                      <li>Provide accurate information when using our assessment tools</li>
                      <li>Respect the intellectual property rights of MyMedi.ai</li>
                      <li>Do not attempt to reverse engineer or misuse our AI systems</li>
                      <li>Report any technical issues or concerns promptly</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Prohibited Activities</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Using the Platform for commercial purposes without permission</li>
                      <li>Sharing false or misleading health information</li>
                      <li>Attempting to hack, disrupt, or damage our systems</li>
                      <li>Violating any applicable laws or regulations</li>
                      <li>Impersonating healthcare professionals or MyMedi.ai staff</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-red-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                  Medical Disclaimers & Limitations
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold mb-2 text-red-800">Critical Health Disclaimer</h3>
                    <p className="text-red-700">
                      <strong>MyMedi.ai is NOT a medical device, diagnostic tool, or healthcare provider.</strong>
                      Our AI-powered insights are for informational purposes only and should never replace professional
                      medical advice, diagnosis, or treatment.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Emergency Situations</h3>
                    <p>
                      <strong>In case of medical emergencies, do NOT use MyMedi.ai.</strong> Contact your local
                      emergency services (108 in India, 911 in US) or visit the nearest hospital immediately. Our
                      Platform is not designed for emergency medical situations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Limitations</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>AI responses may contain errors or inaccuracies</li>
                      <li>Our system cannot replace human medical judgment</li>
                      <li>Individual health conditions may vary significantly</li>
                      <li>Cultural and regional health factors may not be fully captured</li>
                      <li>AI models are continuously improving but not perfect</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-orange-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-orange-600" />
                  Privacy & Data Protection
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Your privacy is important to us. Our collection, use, and protection of your personal and health
                    information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Privacy Points</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>We follow HIPAA-compliant data protection standards</li>
                      <li>Your health information is encrypted and securely stored</li>
                      <li>We do not sell your personal health data to third parties</li>
                      <li>You have control over your data and can request deletion</li>
                      <li>We use data to improve our AI models (anonymized when possible)</li>
                    </ul>
                  </div>

                  <p>
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                      Read our complete Privacy Policy →
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-teal-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Gavel className="w-6 h-6 mr-2 text-teal-600" />
                  Limitation of Liability
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      <strong>Important Legal Notice:</strong> To the fullest extent permitted by law, MyMedi.ai and its
                      founders, employees, and partners shall not be liable for any direct, indirect, incidental,
                      special, or consequential damages arising from your use of the Platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Specific Limitations</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>We are not liable for medical decisions made based on our AI insights</li>
                      <li>We do not guarantee the accuracy or completeness of health information</li>
                      <li>We are not responsible for third-party content or services</li>
                      <li>Technical issues or Platform downtime do not create liability</li>
                      <li>Maximum liability is limited to the amount paid for our services (if any)</li>
                    </ul>
                  </div>

                  <p>
                    <strong>User Acknowledgment:</strong> By using MyMedi.ai, you acknowledge that you understand these
                    limitations and agree to use the Platform at your own risk for informational purposes only.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-indigo-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law & Dispute Resolution</h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Applicable Law</h3>
                    <p>
                      These Terms are governed by the laws of India. Any disputes arising from your use of MyMedi.ai
                      will be subject to the jurisdiction of courts in Andhra Pradesh, India.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dispute Resolution Process</h3>
                    <ol className="list-decimal list-inside space-y-1 ml-4">
                      <li>First, contact us directly to resolve any issues: Harsha@mymedi.ai</li>
                      <li>If direct resolution fails, we encourage mediation</li>
                      <li>Legal proceedings, if necessary, will be conducted in Andhra Pradesh, India</li>
                      <li>You agree to resolve disputes individually, not as part of a class action</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-gray-100">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4 text-gray-700">
                  <p>If you have questions about these Terms of Service, please contact us:</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Email:</strong> legal@mymedi.ai
                    </p>
                    <p>
                      <strong>Primary Contact:</strong> Harsha@mymedi.ai
                    </p>
                    <p>
                      <strong>Founder:</strong> Bandarla Harshavardhan
                    </p>
                    <p>
                      <strong>Address:</strong> Madanapalle, Andhra Pradesh, India
                    </p>
                  </div>
                  <p className="text-sm">We will respond to legal inquiries within 30 days of receipt.</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Acknowledgment</h3>
              <p className="text-blue-800 text-sm">
                By using MyMedi.ai, you acknowledge that you have read, understood, and agree to be bound by these Terms
                of Service. You also acknowledge that you understand the limitations of our AI-powered platform and will
                use it responsibly for informational purposes only.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PoweredByFooter />
    </div>
  )
}
