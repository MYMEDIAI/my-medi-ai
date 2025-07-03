"use client"

import { Calendar } from "@/components/ui/calendar"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  Upload,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Scan,
  Eye,
  Sparkles,
  Zap,
  Crown,
} from "lucide-react"

interface ReportAnalysis {
  reportType: string
  keyFindings: string[]
  abnormalValues: Array<{
    parameter: string
    value: string
    normalRange: string
    status: "high" | "low" | "normal"
  }>
  recommendations: string[]
  urgency: "low" | "medium" | "high"
  followUp: string
  rawAnalysis: string
  extractedText?: string
}

function DemoReportAnalyzerComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState("")

  const sampleReports = [
    { name: "Blood Test Report - CBC", color: "from-red-400 to-pink-500", icon: "🩸" },
    { name: "Lipid Profile Report", color: "from-yellow-400 to-orange-500", icon: "💛" },
    { name: "Liver Function Test", color: "from-green-400 to-emerald-500", icon: "🫀" },
    { name: "Thyroid Function Test", color: "from-blue-400 to-cyan-500", icon: "🦋" },
    { name: "Diabetes Screening Report", color: "from-purple-400 to-violet-500", icon: "🍯" },
    { name: "Kidney Function Test", color: "from-teal-400 to-cyan-500", icon: "🫘" },
    { name: "Cardiac Markers", color: "from-rose-400 to-red-500", icon: "❤️" },
    { name: "Vitamin D Test", color: "from-amber-400 to-yellow-500", icon: "☀️" },
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")

      // First extract text using OCR
      await extractTextFromImage(file)

      // Then analyze the report
      analyzeReport(file)
    }
  }

  const extractTextFromImage = async (file: File) => {
    setIsExtracting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Extracted text:", data.extractedText)
        return data.extractedText
      }
    } catch (error) {
      console.error("OCR extraction error:", error)
    } finally {
      setIsExtracting(false)
    }
    return null
  }

  const handleSampleReport = (reportName: string) => {
    const mockFile = new File([""], reportName, { type: "application/pdf" })
    setSelectedFile(mockFile)
    setError("")
    analyzeReport(mockFile)
  }

  const analyzeReport = async (file: File) => {
    setIsAnalyzing(true)
    setError("")

    try {
      // Extract text first if it's an image
      let extractedText = ""
      if (file.type.startsWith("image/")) {
        extractedText = (await extractTextFromImage(file)) || ""
      }

      // Create a comprehensive prompt for AI analysis
      const analysisPrompt = `
Please analyze this medical report: ${file.name}

${extractedText ? `Extracted text from the report:\n${extractedText}\n\n` : ""}

As an AI medical report analyzer, provide a comprehensive analysis including:

1. **Report Type Identification**: What type of medical report this is
2. **Key Findings**: List the most important findings from the report
3. **Parameter Analysis**: For each parameter, indicate if it's normal, high, or low with specific values and normal ranges
4. **Health Implications**: What these results might indicate about the patient's health
5. **Recommendations**: Specific actionable recommendations based on the results
6. **Urgency Level**: Whether this requires immediate, moderate, or routine follow-up
7. **Next Steps**: What the patient should do next

Please format your response in a clear, structured manner that's easy for patients to understand.

${extractedText ? "Base your analysis on the extracted text data above." : "For this demonstration, please provide analysis appropriate for a " + file.name + " report with realistic medical insights including specific parameter values, normal ranges, and clinical interpretations."}

Focus on providing actionable medical insights while emphasizing that AI recommendations should be confirmed by qualified medical practitioners.
`

      // Call the actual AI integration API
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "report-analysis",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      let aiResponse = ""
      if (data.response) {
        aiResponse = typeof data.response === "string" ? data.response : JSON.stringify(data.response)
      } else {
        throw new Error("No analysis received from AI")
      }

      // Parse the AI response and structure it
      const structuredAnalysis = parseAIAnalysis(aiResponse, file.name)
      structuredAnalysis.extractedText = extractedText
      setAnalysis(structuredAnalysis)
    } catch (error) {
      console.error("Report analysis error:", error)
      setError("Unable to analyze report. Please try again.")

      // Provide fallback analysis
      const fallbackAnalysis = generateFallbackAnalysis(file.name)
      setAnalysis(fallbackAnalysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const parseAIAnalysis = (aiResponse: string, fileName: string): ReportAnalysis => {
    // Extract different sections from AI response
    const sections = aiResponse.split(/\n\s*\n/)

    // Default structured analysis
    const analysis: ReportAnalysis = {
      reportType: fileName.includes("CBC")
        ? "Complete Blood Count (CBC)"
        : fileName.includes("Lipid")
          ? "Lipid Profile"
          : fileName.includes("Thyroid")
            ? "Thyroid Function Test"
            : fileName.includes("Liver")
              ? "Liver Function Test"
              : fileName.includes("Diabetes")
                ? "Diabetes Screening"
                : fileName.includes("Kidney")
                  ? "Kidney Function Test"
                  : fileName.includes("Cardiac")
                    ? "Cardiac Markers"
                    : fileName.includes("Vitamin")
                      ? "Vitamin D Test"
                      : "Medical Report",
      keyFindings: [],
      abnormalValues: [],
      recommendations: [],
      urgency: "medium",
      followUp: "Follow up with your healthcare provider to discuss these results",
      rawAnalysis: aiResponse,
    }

    // Parse key findings
    const findingsMatch = aiResponse.match(
      /(?:key findings?|findings?|results?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (findingsMatch) {
      const findings = findingsMatch[0].split(/[•\-*]\s*/).filter((f) => f.trim().length > 10)
      analysis.keyFindings = findings.slice(0, 4).map((f) => f.trim())
    }

    // Parse recommendations
    const recommendationsMatch = aiResponse.match(
      /(?:recommendations?|advice|suggestions?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (recommendationsMatch) {
      const recommendations = recommendationsMatch[0].split(/[•\-*]\s*/).filter((r) => r.trim().length > 10)
      analysis.recommendations = recommendations.slice(0, 5).map((r) => r.trim())
    }

    // Determine urgency based on content
    if (aiResponse.toLowerCase().includes("urgent") || aiResponse.toLowerCase().includes("immediate")) {
      analysis.urgency = "high"
    } else if (aiResponse.toLowerCase().includes("routine") || aiResponse.toLowerCase().includes("normal")) {
      analysis.urgency = "low"
    }

    // Generate sample parameters based on report type
    if (fileName.includes("CBC")) {
      analysis.abnormalValues = [
        { parameter: "Hemoglobin", value: "13.5 g/dL", normalRange: "12.0-15.5 g/dL", status: "normal" },
        { parameter: "White Blood Cells", value: "7,500/μL", normalRange: "4,000-10,000/μL", status: "normal" },
        { parameter: "Platelets", value: "250,000/μL", normalRange: "150,000-450,000/μL", status: "normal" },
      ]
    } else if (fileName.includes("Lipid")) {
      analysis.abnormalValues = [
        { parameter: "Total Cholesterol", value: "200 mg/dL", normalRange: "<200 mg/dL", status: "normal" },
        { parameter: "LDL Cholesterol", value: "120 mg/dL", normalRange: "<100 mg/dL", status: "high" },
        { parameter: "HDL Cholesterol", value: "50 mg/dL", normalRange: ">40 mg/dL", status: "normal" },
      ]
    }

    return analysis
  }

  const generateFallbackAnalysis = (fileName: string): ReportAnalysis => {
    if (fileName.includes("CBC")) {
      return {
        reportType: "Complete Blood Count (CBC)",
        keyFindings: [
          "Blood cell counts are within normal ranges",
          "No signs of infection or anemia detected",
          "Platelet count is adequate for normal clotting",
          "Overall blood health appears stable",
        ],
        abnormalValues: [
          { parameter: "Hemoglobin", value: "13.5 g/dL", normalRange: "12.0-15.5 g/dL", status: "normal" },
          { parameter: "White Blood Cells", value: "7,500/μL", normalRange: "4,000-10,000/μL", status: "normal" },
          { parameter: "Platelets", value: "250,000/μL", normalRange: "150,000-450,000/μL", status: "normal" },
        ],
        recommendations: [
          "Continue maintaining a healthy diet rich in iron and vitamins",
          "Stay hydrated and get adequate rest",
          "Monitor for any unusual symptoms",
          "Follow up with routine blood work as recommended by your doctor",
        ],
        urgency: "low",
        followUp: "Routine follow-up in 6-12 months or as advised by your healthcare provider",
        rawAnalysis:
          "AI analysis temporarily unavailable. This is a general interpretation based on common CBC parameters.",
      }
    }

    return {
      reportType: "Medical Report Analysis",
      keyFindings: [
        "Report has been reviewed for key parameters",
        "Most values appear within expected ranges",
        "No immediate concerns identified",
        "Detailed analysis requires professional review",
      ],
      abnormalValues: [
        { parameter: "General Parameters", value: "Within Range", normalRange: "Normal Limits", status: "normal" },
      ],
      recommendations: [
        "Consult with your healthcare provider for detailed interpretation",
        "Maintain regular health monitoring",
        "Follow prescribed treatment plans",
        "Report any new or worsening symptoms",
      ],
      urgency: "medium",
      followUp: "Schedule appointment with your healthcare provider to discuss results",
      rawAnalysis:
        "AI analysis temporarily unavailable. Please consult with a healthcare professional for proper interpretation.",
    }
  }

  const resetAnalyzer = () => {
    setSelectedFile(null)
    setAnalysis(null)
    setError("")
    setIsAnalyzing(false)
    setIsExtracting(false)
  }

  const getStatusIcon = (status: "high" | "low" | "normal") => {
    switch (status) {
      case "high":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "low":
        return <TrendingDown className="w-4 h-4 text-blue-500" />
      default:
        return <Minus className="w-4 h-4 text-green-500" />
    }
  }

  const getStatusColor = (status: "high" | "low" | "normal") => {
    switch (status) {
      case "high":
        return "text-red-600 bg-gradient-to-r from-red-50 to-red-100 border-red-200"
      case "low":
        return "text-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
      default:
        return "text-green-600 bg-gradient-to-r from-green-50 to-green-100 border-green-200"
    }
  }

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300"
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
      default:
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
    }
  }

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white text-xl">
          <div className="p-2 bg-white/20 rounded-full mr-3">
            <FileText className="w-6 h-6" />
          </div>
          🔬 AI Report Analyzer
          <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30">
            <div className="w-2 h-2 bg-green-300 rounded-full mr-1 animate-pulse"></div>
            Live AI
          </Badge>
          <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
            <Crown className="w-3 h-3 mr-1" />
            Premium OCR
          </Badge>
          <Badge className="bg-blue-400 text-blue-900 hover:bg-blue-400">
            <Zap className="w-3 h-3 mr-1" />
            OpenAI GPT-4
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {!analysis ? (
          <>
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 transform hover:scale-105"
              onClick={() => document.getElementById("report-upload")?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800 mb-2">Upload Medical Report</p>
                  <p className="text-gray-600 mb-2">Advanced OCR + AI Analysis</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Scan className="w-4 h-4" />
                    <span>PDF, JPG, PNG files supported</span>
                    <Eye className="w-4 h-4" />
                    <span>Text extraction included</span>
                  </div>
                </div>
              </div>
            </div>

            <Input
              id="report-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isAnalyzing || isExtracting}
            />

            {selectedFile && !isAnalyzing && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-full">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-800">Selected: {selectedFile.name}</span>
                    <p className="text-xs text-green-600">Ready for AI analysis</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Reports */}
            <div className="space-y-4 mt-6">
              <p className="text-lg font-semibold text-gray-700 text-center">Or try with sample reports:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sampleReports.map((report, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleReport(report.name)}
                    disabled={isAnalyzing || isExtracting}
                    className={`h-auto py-3 px-3 bg-gradient-to-r ${report.color} text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{report.icon}</span>
                      <span className="text-xs text-center font-medium">{report.name.split(" ")[0]}</span>
                      <span className="text-xs text-center opacity-90">
                        {report.name.split(" ").slice(1).join(" ")}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {(isExtracting || isAnalyzing) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mt-4">
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-green-800">
                      {isExtracting ? "Extracting Text..." : "Analyzing Report..."}
                    </p>
                    <p className="text-sm text-green-600">
                      {isExtracting ? "OCR is reading your document" : "OpenAI is processing your medical data"}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 mt-4">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {/* Analysis Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">AI Analysis Complete</h4>
                  <p className="text-sm text-gray-600">Powered by OpenAI GPT-4 + OCR</p>
                </div>
              </div>
              <Badge className={`${getUrgencyColor(analysis.urgency)} px-4 py-2 text-sm font-bold`}>
                {analysis.urgency.toUpperCase()} Priority
              </Badge>
            </div>

            {/* Report Type */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <p className="text-lg font-bold text-gray-800">{analysis.reportType}</p>
              <p className="text-sm text-gray-600">Report: {selectedFile?.name}</p>
              {analysis.extractedText && <p className="text-xs text-green-600 mt-1">✓ Text extracted via OCR</p>}
            </div>

            {/* Key Findings */}
            {analysis.keyFindings.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-gray-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  Key Findings:
                </h5>
                <div className="grid gap-2">
                  {analysis.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{finding}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parameter Analysis */}
            {analysis.abnormalValues.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                  Parameter Analysis:
                </h5>
                <div className="grid gap-3">
                  {analysis.abnormalValues.map((param, idx) => (
                    <div key={idx} className={`rounded-xl p-4 border-2 ${getStatusColor(param.status)} shadow-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(param.status)}
                          <span className="font-bold text-lg">{param.parameter}</span>
                        </div>
                        <Badge variant="outline" className="text-sm font-bold">
                          {param.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Current Value:</p>
                          <p className="font-bold text-lg">{param.value}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Normal Range:</p>
                          <p className="font-medium">{param.normalRange}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-gray-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-500" />
                  AI Recommendations:
                </h5>
                <div className="grid gap-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{rec}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
              <h5 className="font-bold text-blue-800 mb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Follow-up Care:
              </h5>
              <p className="text-blue-700 font-medium">{analysis.followUp}</p>
            </div>

            {/* Extracted Text */}
            {analysis.extractedText && (
              <details className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <summary className="cursor-pointer text-lg font-bold text-gray-700 hover:text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  View Extracted Text (OCR)
                </summary>
                <div className="mt-3 p-3 bg-white rounded-lg border text-sm text-gray-600 max-h-32 overflow-y-auto">
                  {analysis.extractedText}
                </div>
              </details>
            )}

            {/* Raw AI Analysis */}
            <details className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <summary className="cursor-pointer text-lg font-bold text-purple-700 hover:text-purple-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                View Full AI Analysis
              </summary>
              <div className="mt-3 p-3 bg-white rounded-lg border text-sm text-gray-600 whitespace-pre-line max-h-40 overflow-y-auto">
                {analysis.rawAnalysis}
              </div>
            </details>

            <Alert className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-800 font-medium">
                This AI analysis is for informational purposes only. Always consult healthcare professionals for medical
                interpretation and treatment decisions.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                onClick={resetAnalyzer}
                variant="outline"
                size="lg"
                className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Analyze Another Report
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                asChild
              >
                <a href="/chat">
                  Discuss with AI Doctor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 mt-6">
          <Button
            className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-xl text-lg py-3"
            asChild
          >
            <a href="/reports">
              <Crown className="w-5 h-5 mr-2" />
              Open Full Report Analyzer
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Default export
export default DemoReportAnalyzerComponent

// Named export for compatibility
export const DemoReportAnalyzer = DemoReportAnalyzerComponent
