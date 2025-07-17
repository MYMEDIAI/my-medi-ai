"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  Upload,
  RotateCcw,
  Download,
  Printer,
  AlertTriangle,
  MessageCircle,
  Activity,
  User,
  Pill,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import MyMedLogo from "@/components/mymed-logo"
import NavigationButtons from "@/components/navigation-buttons"
import PoweredByFooter from "@/components/powered-by-footer"

export default function ReportsPage() {
  const [analysis, setAnalysis] = useState("")
  const [fileName, setFileName] = useState("")
  const [patientName, setPatientName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsLoading(true)

    try {
      const prompt = `
Analyze this medical report: ${file.name}

Please provide a comprehensive AI analysis in the following format with bullet points and bold headings:

**REPORT ANALYSIS SUMMARY:**
• Report Type: [type of medical report]
• Date Analyzed: [current date]
• File Name: ${file.name}
• Analysis Status: [status]

**KEY FINDINGS:**
• [List key findings from the report]
• [Important values and their interpretations]
• [Any abnormal or concerning results]

**DETAILED INTERPRETATION:**
• [Detailed explanation of results]
• [Medical significance of findings]
• [Comparison with normal ranges]

**RISK ASSESSMENT:**
• Severity Level: [Low/Medium/High]
• Immediate Concerns: [list any urgent issues]
• Long-term Implications: [potential long-term effects]

**RECOMMENDATIONS:**
• Immediate Actions: [what to do right away]
• Follow-up Required: [recommended follow-up care]
• Lifestyle Changes: [suggested lifestyle modifications]
• Specialist Consultation: [if specialist referral needed]

**NEXT STEPS:**
• Doctor Consultation: [when and why to see doctor]
• Additional Tests: [if more tests are needed]
• Monitoring: [what to monitor going forward]

**IMPORTANT NOTES:**
• [Any critical information or warnings]
• [Limitations of the analysis]
• [When to seek immediate medical attention]

Please provide accurate, detailed medical analysis with proper formatting and bullet points.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          type: "report_analysis",
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        setAnalysis(data.response)
      } else {
        throw new Error("Failed to analyze report")
      }
    } catch (error) {
      console.error("Report analysis error:", error)
      setAnalysis(`
**REPORT ANALYSIS SUMMARY:**
• Report Type: Medical Lab Report
• Date Analyzed: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
• File Name: ${file.name}
• Analysis Status: AI Service Temporarily Unavailable

**KEY FINDINGS:**
• **Unable to process report** - AI analysis service is currently unavailable
• **Manual review recommended** - Please consult with healthcare provider
• **File uploaded successfully** - Report file has been received

**DETAILED INTERPRETATION:**
• **Service Status:** AI analysis engine is temporarily offline
• **Alternative Options:** Please share this report directly with your doctor
• **Data Security:** Your uploaded file is processed securely and not stored

**RISK ASSESSMENT:**
• **Severity Level:** Cannot be determined without AI analysis
• **Immediate Concerns:** Consult healthcare provider for proper interpretation
• **Long-term Implications:** Professional medical review required

**RECOMMENDATIONS:**
• **Immediate Actions:** 
  - Schedule appointment with your doctor
  - Bring original report for professional review
  - Don't delay if you have concerning symptoms
• **Follow-up Required:** Professional medical consultation essential
• **Lifestyle Changes:** Maintain healthy lifestyle while awaiting consultation
• **Specialist Consultation:** As recommended by your primary care physician

**NEXT STEPS:**
• **Doctor Consultation:** Schedule within 1-2 weeks or sooner if symptomatic
• **Additional Tests:** As recommended by healthcare provider
• **Monitoring:** Follow doctor's guidance for ongoing monitoring

**IMPORTANT NOTES:**
• **AI Limitation:** This analysis requires functional AI service
• **Professional Review:** Always get professional medical interpretation
• **Emergency:** Seek immediate care for urgent symptoms regardless of report results
`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAnalysis("")
    setFileName("")
    setPatientName("")
    setIsLoading(false)
    // Reset file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Medical Report Analysis</title>
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
          .analysis-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .analysis-section h3 { 
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
            <div class="logo">📋</div>
            <h1>MyMedi.ai - Medical Report Analysis</h1>
            <p>AI-Powered Medical Report Analyzer</p>
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
            <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString("en-IN", {
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

          <div class="analysis-section">
            <h3>📋 Medical Report Analysis</h3>
            <p><strong>Analyzed File:</strong> ${fileName}</p>
            <div style="white-space: pre-line; margin-top: 15px; font-size: 1.1em;">${analysis}</div>
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This AI analysis is for educational purposes only and does not replace professional medical interpretation.</p>
            <p><em>Always consult with qualified healthcare providers for proper diagnosis and treatment based on your reports.</em></p>
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
MyMedi.ai - Medical Report Analysis
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
Analysis Date: ${new Date().toLocaleDateString("en-IN", {
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
}MEDICAL REPORT ANALYSIS:
Analyzed File: ${fileName}

${analysis}

---
DISCLAIMER: This AI analysis is for educational purposes only and should not replace professional medical interpretation. Always consult with qualified healthcare providers for proper diagnosis and treatment based on your reports.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Report-Analysis-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
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
          <Card className="border-indigo-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold">AI Report Analyzer</h1>
                    <p className="text-indigo-100 text-sm">Upload and analyze medical reports with AI insights</p>
                  </div>
                </div>
                {analysis && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrint}
                      variant="secondary"
                      size="sm"
                      className="bg-white text-indigo-600 hover:bg-indigo-50"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      size="sm"
                      className="bg-white text-indigo-600 hover:bg-indigo-50"
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

              <div className="bg-indigo-50 p-6 rounded-lg min-h-[200px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-indigo-600 font-medium">AI is analyzing your medical report...</p>
                    <p className="text-sm text-indigo-500">Processing medical data and generating insights</p>
                  </div>
                ) : analysis ? (
                  <div className="text-sm text-indigo-800">
                    <div className="bg-white p-4 rounded-lg border border-indigo-200 mb-4">
                      <p className="font-medium text-indigo-900 mb-2">📋 Analysis Complete</p>
                      <p className="text-sm text-indigo-700">File: {fileName}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-indigo-200 max-h-96 overflow-y-auto">
                      <div className="whitespace-pre-line text-indigo-900 leading-relaxed">{analysis}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center h-full flex flex-col justify-center">
                    <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">AI-Powered Report Analysis</h3>
                    <p className="text-indigo-600 mb-4 max-w-md mx-auto">
                      Upload your medical reports (lab results, X-rays, blood tests) to get comprehensive AI-powered
                      analysis with detailed insights and recommendations.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
                        Lab Results
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        Blood Tests
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        X-rays
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700">
                        MRI/CT Scans
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => document.getElementById("file-upload")?.click()}
                  variant="outline"
                  size="lg"
                  className="flex-1 p-4 border-indigo-300 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                  disabled={isLoading}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Medical Report
                </Button>
              </div>

              {fileName && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Selected file:</strong> {fileName}
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-2">⚠️ IMPORTANT MEDICAL DISCLAIMER:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        <strong>AI analysis is for educational purposes</strong> only and should not replace
                        professional medical interpretation
                      </li>
                      <li>
                        <strong>Always consult with qualified healthcare providers</strong> for proper diagnosis and
                        treatment
                      </li>
                      <li>
                        <strong>Your uploaded files are processed securely</strong> and not stored permanently
                      </li>
                      <li>
                        <strong>Seek immediate medical attention</strong> for urgent symptoms regardless of report
                        results
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cross-navigation section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
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
                  <Link href="/body-mapper">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <User className="w-4 h-4 mr-1" />
                      Body Mapper
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
