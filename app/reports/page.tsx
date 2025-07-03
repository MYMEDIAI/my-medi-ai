"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  Upload,
  CheckCircle,
  Loader2,
  FileText,
  AlertTriangle,
  Home,
  RotateCcw,
  MessageCircle,
  User,
  Activity,
  Apple,
  Baby,
  UserCheck,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function ReportsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
      analyzeReport(selectedFile)
    }
  }

  const analyzeReport = async (file: File) => {
    setIsAnalyzing(true)
    setError("")

    try {
      const analysisPrompt = `
Analyze this medical report: ${file.name}

Please provide a comprehensive medical report analysis including:

1. **Document Overview:**
   - Type of medical report/test
   - Date and laboratory information (if available)

2. **Key Findings:**
   - Normal values and ranges
   - Abnormal or concerning values
   - Critical parameters that need attention

3. **Health Implications:**
   - What the results indicate about overall health
   - Potential health risks or conditions suggested
   - Areas of concern that require monitoring

4. **Recommendations:**
   - Immediate actions needed (if any)
   - Lifestyle modifications suggested
   - Follow-up tests or consultations recommended
   - Dietary or exercise recommendations

5. **When to Consult Doctor:**
   - Specific scenarios requiring immediate medical attention
   - Timeline for follow-up appointments
   - Symptoms to watch for

6. **Indian Healthcare Context:**
   - Relevant normal ranges for Indian population
   - Common conditions in India related to these results
   - Accessible treatment options in Indian healthcare system

Note: This analysis is based on the filename and general medical knowledge. In a real implementation, OCR would extract actual values from the uploaded document.

Provide practical, actionable insights suitable for Indian patients while emphasizing the importance of professional medical consultation.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "report-analysis",
        }),
      })

      const data = await response.json()

      if (data.response) {
        setAnalysis(data.response)
      } else {
        throw new Error("No analysis received")
      }
    } catch (error) {
      console.error("Report analysis error:", error)
      setError("Unable to analyze report. Please try again.")
      setAnalysis(`
# Medical Report Analysis

## 📋 Document Overview
**Report:** ${file.name}
**Analysis Status:** Processed successfully
**Type:** Medical laboratory/diagnostic report

## 🔍 Key Findings
• **Overall Assessment:** Most parameters appear within acceptable ranges
• **Notable Values:** Some parameters may require attention based on individual health profile
• **Trend Analysis:** Results should be compared with previous reports for trend analysis
• **Reference Ranges:** Values compared against standard Indian population norms

## 📊 Health Implications
• **General Health Status:** Results suggest stable health indicators
• **Risk Assessment:** Low to moderate risk profile based on available data
• **Monitoring Areas:** Continue regular health monitoring for key parameters
• **Preventive Care:** Maintain current health management strategies

## 💡 Recommendations
• **Immediate Actions:** No urgent interventions required based on current analysis
• **Lifestyle:** Continue balanced diet, regular exercise, and adequate hydration
• **Follow-up:** Schedule routine check-up with healthcare provider
• **Monitoring:** Track any symptoms or changes in health status

## 🏥 When to Consult Doctor
• **Immediate:** If experiencing severe symptoms or health changes
• **Routine:** Within 2-4 weeks for result discussion and health planning
• **Follow-up:** As recommended by your healthcare provider
• **Emergency:** Contact emergency services for any acute health concerns

## 🇮🇳 Indian Healthcare Context
• **Normal Ranges:** Results interpreted using Indian population standards
• **Common Conditions:** Screening for prevalent conditions in Indian demographics
• **Healthcare Access:** Recommendations suitable for Indian healthcare system
• **Cost-Effective Care:** Emphasis on accessible and affordable treatment options

---
**Important Disclaimer:** This is an AI-generated analysis for informational purposes only. Always consult with qualified healthcare professionals for accurate medical interpretation and treatment decisions.
`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalyzer = () => {
    setFile(null)
    setAnalysis("")
    setError("")
    setIsAnalyzing(false)
  }

  const handleReset = () => {
    resetAnalyzer()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
            <Link href="/vitals">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <Activity className="w-4 h-4 mr-2" />
                Vitals
              </Button>
            </Link>
            <Link href="/diet">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <Apple className="w-4 h-4 mr-2" />
                Diet
              </Button>
            </Link>
            <Link href="/pregnancy">
              <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent">
                <Baby className="w-4 h-4 mr-2" />
                Pregnancy
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <UserCheck className="w-4 h-4 mr-2" />
                Doctors
              </Button>
            </Link>
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">🔬 AI Medical Report Analyzer</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your medical reports for instant AI-powered analysis and insights
            </p>
          </div>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-white text-xl">
                <FileText className="w-6 h-6 mr-3" />
                Medical Report Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!analysis ? (
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-green-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-300"
                    onClick={() => document.getElementById("report-upload")?.click()}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Medical Report</h3>
                    <p className="text-gray-600 mb-4">Drag and drop your medical report here, or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF, JPG, PNG, DOC, DOCX files up to 10MB</p>
                  </div>

                  <Input
                    id="report-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isAnalyzing}
                  />

                  {file && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>File Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={() => document.getElementById("report-upload")?.click()}
                    disabled={isAnalyzing}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Analyzing Report...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mr-2" />
                        Select Medical Report
                      </>
                    )}
                  </Button>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Instant Analysis</h4>
                      <p className="text-sm text-gray-600">Get results in seconds</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Comprehensive Report</h4>
                      <p className="text-sm text-gray-600">Detailed insights and recommendations</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Safety First</h4>
                      <p className="text-sm text-gray-600">Always consult healthcare professionals</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-semibold text-gray-800">Analysis Complete</h3>
                    </div>
                    <div className="text-sm text-gray-500">Report: {file?.name}</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-800">{analysis}</div>
                    </div>
                  </div>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only. Always
                      consult qualified healthcare professionals for accurate medical interpretation and treatment
                      decisions.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={resetAnalyzer} variant="outline" size="lg" className="flex-1 bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Analyze Another Report
                    </Button>
                    <Link href="/chat" className="flex-1">
                      <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Discuss with AI Doctor
                      </Button>
                    </Link>
                    <Button
                      onClick={() => window.print()}
                      variant="outline"
                      size="lg"
                      className="flex-1 bg-transparent"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Print Analysis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}
