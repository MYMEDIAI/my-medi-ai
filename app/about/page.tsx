"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Award, BookOpen, Database, Heart, Users, Globe, Shield, Target, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function AboutPage() {
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About MyMedi.ai</h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Democratizing healthcare access for 1.4 billion Indians through AI-powered technology and human-centered
            design
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-purple-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To make quality healthcare accessible to every Indian, regardless of their location, language, or
                  economic status. We leverage cutting-edge AI technology to bridge the healthcare gap and provide
                  personalized medical guidance that understands India's unique cultural and medical landscape.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To become India's most trusted AI healthcare companion, empowering millions of families to take
                  control of their health journey. We envision a future where every Indian has access to personalized,
                  culturally-aware healthcare guidance at their fingertips, in their own language.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Founder</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the mission to democratize healthcare through technology and innovation
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-shrink-0">
              <div className="w-80 max-w-sm bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/harsha-founder.jpeg"
                  alt="Bandarla Harshavardhan - Founder & CEO of MyMedi.ai"
                  width={320}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Bandarla Harshavardhan</h3>
                <p className="text-xl text-purple-600 font-semibold mb-4">Founder & CEO, MyMedi.ai</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Award className="w-3 h-3 mr-1" />
                    Stanford d.school UIF Fellow
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <BookOpen className="w-3 h-3 mr-1" />
                    MBA Graduate
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    <Database className="w-3 h-3 mr-1" />
                    Ex-Data Architect at MNCs
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  With over a decade of experience as a Data Architect at leading multinational corporations,
                  Harshavardhan combines deep technical expertise with human-centered design principles. His journey
                  from enterprise data architecture to healthcare innovation reflects his passion for solving complex
                  problems that impact millions of lives.
                </p>

                <p className="text-gray-700 leading-relaxed text-lg">
                  As a Stanford d.school University Innovation Fellow and MBA graduate, he brings a unique blend of
                  technical prowess, business acumen, and design thinking to healthcare challenges. His vision for
                  MyMedi.ai stems from witnessing firsthand the healthcare accessibility challenges faced by Indian
                  families across urban and rural areas.
                </p>

                <p className="text-gray-700 leading-relaxed text-lg">
                  Under his leadership, MyMedi.ai has grown to serve thousands of users across India, providing
                  AI-powered healthcare guidance in multiple Indian languages while maintaining the highest standards of
                  medical accuracy and cultural sensitivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at MyMedi.ai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassionate Care</h3>
                <p className="text-gray-600">
                  Every interaction is designed with empathy and understanding, recognizing that health concerns are
                  deeply personal and require sensitive, caring responses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy & Security</h3>
                <p className="text-gray-600">
                  We maintain the highest standards of data protection and privacy, ensuring your health information is
                  secure and confidential at all times.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Inclusive Access</h3>
                <p className="text-gray-600">
                  Healthcare should be accessible to everyone. We break down barriers of language, location, and
                  economic status to serve all Indians equally.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cultural Sensitivity</h3>
                <p className="text-gray-600">
                  We understand India's diverse cultural landscape and provide healthcare guidance that respects
                  traditional practices while embracing modern medicine.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for the highest quality in everything we do, from AI accuracy to user experience, ensuring
                  our platform meets the highest medical and technical standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We continuously innovate and improve our platform, staying at the forefront of AI and healthcare
                  technology to better serve our users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Be part of the healthcare revolution. Start your journey with MyMedi.ai today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PoweredByFooter />
    </div>
  )
}
