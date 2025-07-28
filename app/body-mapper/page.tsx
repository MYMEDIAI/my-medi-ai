"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User,
  RotateCcw,
  Download,
  Printer,
  MessageCircle,
  Activity,
  Pill,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import MyMedLogo from "@/components/mymed-logo"
import NavigationButtons from "@/components/navigation-buttons"
import PoweredByFooter from "@/components/powered-by-footer"

export default function BodyMapperPage() {
  const [selectedPart, setSelectedPart] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [patientName, setPatientName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const bodyParts = [
    "Head",
    "Neck",
    "Chest",
    "Stomach",
    "Back",
    "Arms",
    "Legs",
    "Joints",
    "Hands",
    "Feet",
    "Shoulders",
    "Hips",
  ]

  const handleAnalyze = async () => {
    if (!selectedPart || !symptoms.trim()) return

    setIsLoading(true)
    try {
      const prompt = `
Analyze symptoms for body part: ${selectedPart}
Symptoms described: ${symptoms}

Please provide comprehensive AI analysis in the following format with bullet points and bold headings:

**SYMPTOM ANALYSIS SUMMARY:**
• Body Part: ${selectedPart}
• Symptoms: ${symptoms}
• Analysis Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
• Severity Assessment: [Low/Medium/High]

**POSSIBLE CAUSES:**
• **Most Likely:** [most probable causes]
• **Common Conditions:** [list common conditions for this body part]
• **Less Common:** [less frequent but possible causes]
• **Serious Conditions:** [conditions requiring immediate attention]

**DETAILED ANALYSIS:**
• **Symptom Pattern:** [analysis of symptom characteristics]
• **Associated Factors:** [what might worsen or improve symptoms]
• **Duration Considerations:** [acute vs chronic implications]
• **Age/Gender Factors:** [relevant demographic considerations]

**IMMEDIATE RECOMMENDATIONS:**
• **First Aid/Self Care:** [immediate steps to take]
• **Pain Management:** [safe pain relief options]
• **Activity Modifications:** [what to avoid or modify]
• **Home Remedies:** [safe home treatments]

**WHEN TO SEEK MEDICAL CARE:**
• **Urgent (Same Day):** [symptoms requiring same-day care]
• **Soon (Within Week):** [symptoms needing prompt attention]
• **Emergency (Immediate):** [red flag symptoms requiring ER visit]
• **Specialist Referral:** [when specialist consultation needed]

**SPECIALIST RECOMMENDATIONS:**
• **Primary Care:** [when to see family doctor]
• **Specialist Type:** [specific specialist for this body part]
• **Preparation for Visit:** [what to prepare for doctor visit]

**PREVENTION & LIFESTYLE:**
• **Preventive Measures:** [how to prevent recurrence]
• **Lifestyle Changes:** [beneficial lifestyle modifications]
• **Exercise Recommendations:** [safe exercises for this condition]
• **Dietary Considerations:** [relevant dietary advice]

**MONITORING GUIDELINES:**
• **Warning Signs:** [symptoms that indicate worsening]
• **Improvement Indicators:** [signs of healing/recovery]
• **Follow-up Timeline:** [when to reassess condition]

Please provide accurate, detailed medical analysis with proper formatting and bullet points.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          type: "body_analysis",
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        setAnalysis(data.response)
      } else {
        throw new Error("Failed to analyze symptoms")
      }
    } catch (error) {
      console.error("Body analysis error:", error)
      setAnalysis(`
**SYMPTOM ANALYSIS SUMMARY:**
• Body Part: ${selectedPart}
• Symptoms: ${symptoms}
• Analysis Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
• Severity Assessment: Cannot be determined - AI service unavailable

**POSSIBLE CAUSES:**
• **Service Status:** AI analysis engine is temporarily offline
• **Alternative Action:** Please consult with healthcare provider
• **General Guidance:** Most ${selectedPart.toLowerCase()} symptoms are manageable with proper care

**DETAILED ANALYSIS:**
• **Current Status:** Unable to provide detailed AI analysis
• **Recommendation:** Schedule appointment with healthcare provider
• **Safety First:** Don't ignore persistent or worsening symptoms

**IMMEDIATE RECOMMENDATIONS:**
• **First Aid/Self Care:** 
  - Rest the affected area
  - Apply ice for acute injuries or heat for muscle tension
  - Avoid activities that worsen symptoms
• **Pain Management:** Over-the-counter pain relievers as directed
• **Activity Modifications:** Limit strenuous activities until evaluated
• **Home Remedies:** Gentle stretching, adequate hydration, proper rest

**WHEN TO SEEK MEDICAL CARE:**
• **Urgent (Same Day):** Severe pain, sudden onset, inability to function
• **Soon (Within Week):** Persistent symptoms, gradual worsening
• **Emergency (Immediate):** Severe trauma, loss of function, signs of infection
• **Specialist Referral:** As recommended by primary care physician

**SPECIALIST RECOMMENDATIONS:**
• **Primary Care:** Schedule appointment for proper evaluation
• **Specialist Type:** Will be determined based on primary care assessment
• **Preparation for Visit:** 
  - Document symptom timeline
  - List current medications
  - Note what makes symptoms better or worse

**PREVENTION & LIFESTYLE:**
• **Preventive Measures:** Maintain good posture, regular exercise, proper ergonomics
• **Lifestyle Changes:** Stress management, adequate sleep, balanced nutrition
• **Exercise Recommendations:** Consult healthcare provider for specific guidance
• **Dietary Considerations:** Anti-inflammatory foods may help

**MONITORING GUIDELINES:**
• **Warning Signs:** Worsening pain, new symptoms, fever, swelling
• **Improvement Indicators:** Reduced pain, increased mobility, better function
• **Follow-up Timeline:** As directed by healthcare provider

**IMPORTANT NOTE:**
• **AI Limitation:** This analysis requires functional AI service
• **Professional Care:** Always consult healthcare providers for proper diagnosis
• **Emergency:** Seek immediate care for severe or concerning symptoms
`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedPart("")
    setSymptoms("")
    setAnalysis("")
    setPatientName("")
    setIsLoading(false)
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Body Symptom Analysis</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin: -30px -30px 30px -30px;
            padding: 30px;
            border-radius: 15px 15px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .symptom-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .symptom-section h3 { 
            color: #667eea; 
            border-bottom: 2px solid #e0e7ff; 
            padding-bottom: 8px; 
            margin-top: 0;
            font-size: 1.3em;
          }
          .patient-info {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9em;
            color: #666;
          }
          @media print { 
            body { margin: 0; background: white !important; } 
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🗺️</div>
            <h1>MyMedi.ai - Body Symptom Analysis</h1>
            <p>AI-Powered Body Part Symptom Analysis</p>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
          </div>
          
          ${
            patientName
              ? `
          <div class="patient-info">
            <h3>👤 Patient Information</h3>
            <p><strong>Name:</strong> ${patientName}</p>
            <p><strong>Assessment Date:</strong> ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: true,
            })}</p>
          </div>
          `
              : ""
          }

          <div class="symptom-section">
            <h3>🗺️ Body Part Symptom Analysis</h3>
            <p><strong>Affected Body Part:</strong> ${selectedPart}</p>
            <p><strong>Symptoms Description:</strong> ${symptoms}</p>
            <div style="white-space: pre-line; margin-top: 15px; font-size: 1.1em;">${analysis}</div>
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This symptom analysis is for educational purposes only and does not replace professional medical advice.</p>
            <p><em>Always consult with qualified healthcare providers for proper diagnosis and treatment.</em></p>
            <p>📧 Contact: Harsha@mymedi.ai | 📱 Made in India with ❤️</p>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    const content = `
MyMedi.ai - Body Symptom Analysis Report
Generated on: ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })}

${
  patientName
    ? `PATIENT INFORMATION:
Name: ${patientName}
Assessment Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
Time: ${new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })}

`
    : ""
}BODY PART SYMPTOM ANALYSIS:
Affected Body Part: ${selectedPart}
Symptoms Description: ${symptoms}

${analysis}

---
DISCLAIMER: This symptom analysis is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for proper diagnosis and treatment.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Body-Analysis-${selectedPart}-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-4">
            <NavigationButtons />
            <Button onClick={handleReset} variant="outline" className="bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold">AI Body Symptom Mapper</h1>
                    <p className="text-red-100 text-sm">Interactive body mapping with AI symptom analysis</p>
                  </div>
                </div>
                {analysis && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrint}
                      variant="secondary"
                      size="sm"
                      className="bg-white text-red-600 hover:bg-red-50"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      size="sm"
                      className="bg-white text-red-600 hover:bg-red-50"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {!patientName && (
                <div className="mb-6">
                  <Input
                    placeholder="Enter your name (optional)"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="bg-red-50 p-6 rounded-lg min-h-[200px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <p className="text-red-600 font-medium">AI is analyzing your symptoms...</p>
                    <p className="text-sm text-red-500">Processing body part symptoms and generating recommendations</p>
                  </div>
                ) : analysis ? (
                  <div className="text-sm text-red-800">
                    <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
                      <p className="font-medium text-red-900 mb-2">🗺️ Analysis Complete</p>
                      <p className="text-sm text-red-700">Body Part: {selectedPart}</p>
                      <p className="text-sm text-red-700">Symptoms: {symptoms}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200 max-h-96 overflow-y-auto">
                      <div className="whitespace-pre-line text-red-900 leading-relaxed">{analysis}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center h-full flex flex-col justify-center">
                    <User className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-800 mb-2">AI Body Symptom Mapper</h3>
                    <p className="text-red-600 mb-4 max-w-md mx-auto">
                      Select a body part and describe your symptoms to get comprehensive AI analysis with
                      recommendations and specialist guidance.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="bg-red-100 text-red-700">
                        Symptom Analysis
                      </Badge>
                      <Badge variant="outline" className="bg-pink-100 text-pink-700">
                        Specialist Recommendations
                      </Badge>
                      <Badge variant="outline" className="bg-orange-100 text-orange-700">
                        Treatment Guidance
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Body Part:</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {bodyParts.map((part) => (
                      <Button
                        key={part}
                        variant={selectedPart === part ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPart(part)}
                        className={`text-xs ${
                          selectedPart === part
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        }`}
                      >
                        {part}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Describe Your Symptoms:</label>
                  <Input
                    placeholder="Describe your symptoms in detail (e.g., sharp pain, dull ache, swelling, stiffness...)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    disabled={isLoading}
                    className="text-sm"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedPart || !symptoms.trim() || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  size="lg"
                >
                  <User className="w-5 h-5 mr-2" />
                  Analyze Symptoms with AI
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-2">⚠️ IMPORTANT MEDICAL DISCLAIMER:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        <strong>AI symptom analysis is for educational purposes</strong> only and should not replace
                        professional medical diagnosis
                      </li>
                      <li>
                        <strong>Always consult with qualified healthcare providers</strong> for proper evaluation and
                        treatment
                      </li>
                      <li>
                        <strong>Seek immediate medical attention</strong> for severe, persistent, or worsening symptoms
                      </li>
                      <li>
                        <strong>Emergency situations require immediate care</strong> - don't delay for serious symptoms
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cross-navigation section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Explore More Health Tools
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      AI Health Chat
                    </Button>
                  </Link>
                  <Link href="/medicine">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Pill className="w-4 h-4 mr-1" />
                      Medicine Info
                    </Button>
                  </Link>
                  <Link href="/vitals">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Activity className="w-4 h-4 mr-1" />
                      Vitals Tracker
                    </Button>
                  </Link>
                  <Link href="/reports">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 mr-1" />
                      Report Analyzer
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <PoweredByFooter />
    </div>
  )
}
