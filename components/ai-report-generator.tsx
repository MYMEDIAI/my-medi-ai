"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Share2,
  Sparkles,
  Brain,
  Stethoscope,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  User,
  Shield,
  Zap,
  TrendingUp,
  Bell,
  QrCode,
  Loader2,
} from "lucide-react"
import { AIMedicalReportGenerator } from "@/lib/ai-pdf-generator"

interface PatientData {
  personalInfo: {
    name: string
    age: number
    gender: string
    weight: number
    height: number
    phone?: string
    email?: string
  }
  symptoms: {
    primary: string
    secondary: string[]
    duration: string
    severity: number
    onset: string
    triggers?: string[]
  }
  medicalHistory: {
    conditions: string[]
    medications: string[]
    allergies: string[]
    surgeries: string[]
    familyHistory: string[]
  }
  lifestyle: {
    exercise: string
    diet: string
    sleep: string
    smoking: string
    alcohol: string
    stress: number
  }
  vitals?: {
    bloodPressure?: string
    heartRate?: number
    temperature?: number
    weight?: number
  }
}

export default function AIReportGenerator() {
  const [patientData, setPatientData] = useState<PatientData>({
    personalInfo: {
      name: "",
      age: 0,
      gender: "",
      weight: 0,
      height: 0,
      phone: "",
      email: "",
    },
    symptoms: {
      primary: "",
      secondary: [],
      duration: "",
      severity: 1,
      onset: "",
      triggers: [],
    },
    medicalHistory: {
      conditions: [],
      medications: [],
      allergies: [],
      surgeries: [],
      familyHistory: [],
    },
    lifestyle: {
      exercise: "",
      diet: "",
      sleep: "",
      smoking: "",
      alcohol: "",
      stress: 1,
    },
    vitals: {
      bloodPressure: "",
      heartRate: 0,
      temperature: 0,
      weight: 0,
    },
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [reportStatus, setReportStatus] = useState<string>("")

  // Calculate form completion percentage
  const calculateCompletion = () => {
    let completed = 0
    const total = 12

    if (patientData.personalInfo.name) completed++
    if (patientData.personalInfo.age > 0) completed++
    if (patientData.personalInfo.gender) completed++
    if (patientData.personalInfo.weight > 0) completed++
    if (patientData.symptoms.primary) completed++
    if (patientData.symptoms.duration) completed++
    if (patientData.symptoms.severity > 1) completed++
    if (patientData.medicalHistory.conditions.length > 0) completed++
    if (patientData.medicalHistory.medications.length > 0) completed++
    if (patientData.lifestyle.exercise) completed++
    if (patientData.lifestyle.diet) completed++
    if (patientData.lifestyle.sleep) completed++

    return Math.round((completed / total) * 100)
  }

  const generateAIReport = async () => {
    if (!patientData.personalInfo.name || !patientData.symptoms.primary) {
      alert("Please fill in at least patient name and primary symptom")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setReportStatus("Initializing AI analysis...")

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 10, status: "🤖 Connecting to AI medical expert..." },
        { progress: 25, status: "🔬 Analyzing symptoms and medical history..." },
        { progress: 40, status: "📊 Calculating risk assessments..." },
        { progress: 55, status: "💊 Generating medication recommendations..." },
        { progress: 70, status: "🌱 Creating lifestyle modifications..." },
        { progress: 85, status: "📅 Designing follow-up plan..." },
        { progress: 95, status: "📄 Formatting professional report..." },
      ]

      for (const step of progressSteps) {
        setGenerationProgress(step.progress)
        setReportStatus(step.status)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Call AI API
      const response = await fetch("/api/ai-report-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate AI report")
      }

      const result = await response.json()
      setGeneratedReport(result)
      setGenerationProgress(100)
      setReportStatus("✅ AI medical report generated successfully!")

      console.log("🏥 AI Report Generated:", result)
    } catch (error) {
      console.error("❌ Report Generation Error:", error)
      setReportStatus("❌ Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDFReport = async () => {
    if (!generatedReport) return

    try {
      const generator = new AIMedicalReportGenerator()
      await generator.generateAIReport(patientData, generatedReport.report, generatedReport.insights)

      const filename = `MyMedi-AI-Report-${patientData.personalInfo.name.replace(/\s+/g, "-")}-${Date.now()}.pdf`
      generator.downloadPDF(filename)

      console.log("📄 PDF Report Downloaded:", filename)
    } catch (error) {
      console.error("❌ PDF Generation Error:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  const shareReport = async () => {
    if (!generatedReport) return

    const shareData = {
      title: `MyMedi.AI Medical Report - ${patientData.personalInfo.name}`,
      text: `AI-generated medical assessment report with ${generatedReport.report.executiveSummary.confidenceScore}% AI confidence`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback for browsers without Web Share API
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      alert("Report details copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Report Generator</h1>
                <p className="text-sm text-gray-600">Professional medical reports powered by AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Brain className="w-3 h-3 mr-1" />
                GPT-4 Medical
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Information & AI Analysis</h2>
              <p className="text-gray-600 mt-1">Complete patient data for comprehensive AI medical report</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{calculateCompletion()}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          <Progress value={calculateCompletion()} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Data Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter patient name"
                      value={patientData.personalInfo.name}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, name: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={patientData.personalInfo.age || ""}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, age: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientData.personalInfo.gender}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, gender: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                      value={patientData.personalInfo.weight || ""}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, weight: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter height"
                      value={patientData.personalInfo.height || ""}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, height: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={patientData.personalInfo.phone || ""}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-red-600" />
                  Symptoms & Complaints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary-symptom">Primary Symptom *</Label>
                  <Input
                    id="primary-symptom"
                    placeholder="Main complaint (e.g., fever, headache, chest pain)"
                    value={patientData.symptoms.primary}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        symptoms: { ...prev.symptoms, primary: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-symptoms">Secondary Symptoms</Label>
                  <Textarea
                    id="secondary-symptoms"
                    placeholder="Additional symptoms (comma separated)"
                    value={patientData.symptoms.secondary.join(", ")}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        symptoms: {
                          ...prev.symptoms,
                          secondary: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        },
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <select
                      id="duration"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientData.symptoms.duration}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          symptoms: { ...prev.symptoms, duration: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select duration</option>
                      <option value="less-than-1-day">Less than 1 day</option>
                      <option value="1-3-days">1-3 days</option>
                      <option value="4-7-days">4-7 days</option>
                      <option value="1-2-weeks">1-2 weeks</option>
                      <option value="more-than-2-weeks">More than 2 weeks</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity (1-10)</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        id="severity"
                        min="1"
                        max="10"
                        value={patientData.symptoms.severity}
                        onChange={(e) =>
                          setPatientData((prev) => ({
                            ...prev,
                            symptoms: { ...prev.symptoms, severity: Number.parseInt(e.target.value) },
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-blue-600 w-8">{patientData.symptoms.severity}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="onset">Onset</Label>
                  <select
                    id="onset"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={patientData.symptoms.onset}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        symptoms: { ...prev.symptoms, onset: e.target.value },
                      }))
                    }
                  >
                    <option value="">Select onset</option>
                    <option value="sudden">Sudden</option>
                    <option value="gradual">Gradual</option>
                    <option value="intermittent">Intermittent</option>
                    <option value="progressive">Progressive</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="conditions">Current Medical Conditions</Label>
                  <Textarea
                    id="conditions"
                    placeholder="Diabetes, Hypertension, Heart Disease, etc. (comma separated)"
                    value={patientData.medicalHistory.conditions.join(", ")}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          conditions: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    placeholder="Crocin, Dolo, Glycomet, etc. (comma separated)"
                    value={patientData.medicalHistory.medications.join(", ")}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          medications: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    placeholder="Drug allergies, food allergies, etc. (comma separated)"
                    value={patientData.medicalHistory.allergies.join(", ")}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          allergies: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="family-history">Family History</Label>
                  <Textarea
                    id="family-history"
                    placeholder="Family medical conditions (comma separated)"
                    value={patientData.medicalHistory.familyHistory.join(", ")}
                    onChange={(e) =>
                      setPatientData((prev) => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          familyHistory: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Lifestyle Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exercise">Exercise Frequency</Label>
                    <select
                      id="exercise"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientData.lifestyle.exercise}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, exercise: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="3-4-times-week">3-4 times per week</option>
                      <option value="1-2-times-week">1-2 times per week</option>
                      <option value="rarely">Rarely</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="diet">Diet Type</Label>
                    <select
                      id="diet"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientData.lifestyle.diet}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, diet: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select diet type</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="sleep">Sleep Quality</Label>
                    <select
                      id="sleep"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={patientData.lifestyle.sleep}
                      onChange={(e) =>
                        setPatientData((prev) => ({
                          ...prev,
                          lifestyle: { ...prev.lifestyle, sleep: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select sleep quality</option>
                      <option value="excellent">Excellent (7-9 hours)</option>
                      <option value="good">Good (6-7 hours)</option>
                      <option value="fair">Fair (5-6 hours)</option>
                      <option value="poor">Poor (less than 5 hours)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="stress">Stress Level (1-10)</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        id="stress"
                        min="1"
                        max="10"
                        value={patientData.lifestyle.stress}
                        onChange={(e) =>
                          setPatientData((prev) => ({
                            ...prev,
                            lifestyle: { ...prev.lifestyle, stress: Number.parseInt(e.target.value) },
                          }))
                        }
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-blue-600 w-8">{patientData.lifestyle.stress}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Report Generation Sidebar */}
          <div className="space-y-6">
            {/* Generation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI Report Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isGenerating && !generatedReport && (
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🤖</div>
                    <div>
                      <h3 className="font-semibold text-lg">Ready to Generate</h3>
                      <p className="text-sm text-gray-600">
                        AI will analyze patient data and create comprehensive medical report
                      </p>
                    </div>
                    <Button
                      onClick={generateAIReport}
                      className="w-full"
                      disabled={!patientData.personalInfo.name || !patientData.symptoms.primary}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Report
                    </Button>
                  </div>
                )}

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <div className="mt-2 font-semibold">Generating Report...</div>
                      <div className="text-sm text-gray-600">{reportStatus}</div>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                    <div className="text-center text-sm text-gray-500">{generationProgress}% Complete</div>
                  </div>
                )}

                {generatedReport && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                      <div className="mt-2 font-semibold text-green-600">Report Generated!</div>
                      <div className="text-sm text-gray-600">
                        AI analysis complete with {generatedReport.report.executiveSummary.confidenceScore}% confidence
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button onClick={downloadPDFReport} className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF Report
                      </Button>
                      <Button onClick={shareReport} variant="outline" className="w-full bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Report Preview */}
            {generatedReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Report Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Executive Summary */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">🏥 Executive Summary</h4>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {generatedReport.report.executiveSummary.content.substring(0, 150)}...
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      AI Confidence: {generatedReport.report.executiveSummary.confidenceScore}%
                    </Badge>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">📊 Risk Assessment</h4>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          generatedReport.report.riskAssessment.overallRisk === "Low"
                            ? "bg-green-500"
                            : generatedReport.report.riskAssessment.overallRisk === "Moderate"
                              ? "bg-yellow-500"
                              : generatedReport.report.riskAssessment.overallRisk === "High"
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {generatedReport.report.riskAssessment.overallRisk} Risk
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {generatedReport.report.riskAssessment.riskScore}/100
                      </Badge>
                    </div>
                  </div>

                  {/* Medications */}
                  {generatedReport.report.medicationRecommendations.primaryMedications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">💊 Medications</h4>
                      <div className="space-y-1">
                        {generatedReport.report.medicationRecommendations.primaryMedications
                          .slice(0, 2)
                          .map((med: any, index: number) => (
                            <div key={index} className="text-xs bg-blue-50 p-2 rounded">
                              <div className="font-medium">{med.medication}</div>
                              <div className="text-gray-600">
                                {med.dosage} • {med.cost}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* QR Code */}
                  <div className="text-center pt-4 border-t">
                    <QrCode className="w-6 h-6 mx-auto text-gray-400" />
                    <div className="text-xs text-gray-500 mt-1">QR code included in PDF</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  AI Report Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>GPT-4 Medical Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Indian Healthcare Context</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Medication Brand Recommendations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Professional PDF Format</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>QR Code Verification</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Emergency Protocols</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Report Sections */}
        {generatedReport && (
          <div className="mt-8 space-y-6">
            <Separator />

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Medical Report Preview</h2>
              <p className="text-gray-600">
                Comprehensive analysis with {generatedReport.report.executiveSummary.confidenceScore}% AI confidence
              </p>
            </div>

            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Executive Summary
                  <Badge variant="outline" className="ml-2">
                    AI Confidence: {generatedReport.report.executiveSummary.confidenceScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{generatedReport.report.executiveSummary.content}</p>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Key Findings:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {generatedReport.report.executiveSummary.keyFindings.map((finding: string, index: number) => (
                        <li key={index} className="text-sm text-gray-600">
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  Risk Assessment
                  <Badge
                    variant={
                      generatedReport.report.riskAssessment.overallRisk === "Low"
                        ? "default"
                        : generatedReport.report.riskAssessment.overallRisk === "Moderate"
                          ? "secondary"
                          : generatedReport.report.riskAssessment.overallRisk === "High"
                            ? "destructive"
                            : "destructive"
                    }
                    className="ml-2"
                  >
                    {generatedReport.report.riskAssessment.overallRisk} Risk
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Overall Risk Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - generatedReport.report.riskAssessment.riskScore / 100)}`}
                            className={
                              generatedReport.report.riskAssessment.riskScore >= 80
                                ? "text-red-500"
                                : generatedReport.report.riskAssessment.riskScore >= 60
                                  ? "text-orange-500"
                                  : generatedReport.report.riskAssessment.riskScore >= 40
                                    ? "text-yellow-500"
                                    : "text-green-500"
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{generatedReport.report.riskAssessment.riskScore}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{generatedReport.report.riskAssessment.overallRisk}</div>
                        <div className="text-sm text-gray-600">Risk Level</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Specific Risk Categories</h4>
                    <div className="space-y-2">
                      {generatedReport.report.riskAssessment.specificRisks.map((risk: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{risk.category}</span>
                          <Badge
                            variant={
                              risk.level === "High"
                                ? "destructive"
                                : risk.level === "Moderate"
                                  ? "secondary"
                                  : "default"
                            }
                            className="text-xs"
                          >
                            {risk.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Protocols */}
            {(generatedReport.report.emergencyProtocols.warningSignsImmediate.length > 0 ||
              generatedReport.report.emergencyProtocols.warningSignsUrgent.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Emergency Protocols
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedReport.report.emergencyProtocols.warningSignsImmediate.length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <div className="font-semibold mb-2">🚨 IMMEDIATE EMERGENCY SIGNS - Call 108</div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {generatedReport.report.emergencyProtocols.warningSignsImmediate.map(
                            (sign: string, index: number) => (
                              <li key={index}>{sign}</li>
                            ),
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {generatedReport.report.emergencyProtocols.warningSignsUrgent.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <Bell className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <div className="font-semibold mb-2">⚠️ URGENT MEDICAL ATTENTION NEEDED</div>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {generatedReport.report.emergencyProtocols.warningSignsUrgent.map(
                            (sign: string, index: number) => (
                              <li key={index}>{sign}</li>
                            ),
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📞 Emergency Contacts (India)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        Emergency Services: <strong>108</strong>
                      </div>
                      <div>
                        Medical Emergency: <strong>102</strong>
                      </div>
                      <div>
                        Police: <strong>100</strong>
                      </div>
                      <div>
                        Fire: <strong>101</strong>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-gray-600" />
                  Medical Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Important:</strong> This AI-generated report is for informational purposes only and
                        should not replace professional medical advice, diagnosis, or treatment.
                      </p>
                      <p>
                        Always consult with qualified healthcare providers before making medical decisions or starting
                        any treatment based on this report.
                      </p>
                      <p>
                        In case of emergency symptoms, seek immediate medical attention and do not rely solely on this
                        AI analysis.
                      </p>
                      <p>
                        <strong>Report ID:</strong> {generatedReport.metadata.reportId} | <strong>Generated:</strong>{" "}
                        {new Date(generatedReport.metadata.generatedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
