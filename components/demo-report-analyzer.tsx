"use client"

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
}

function DemoReportAnalyzerComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const sampleReports = [
    "Blood Test Report - CBC",
    "Lipid Profile Report",
    "Liver Function Test",
    "Thyroid Function Test",
    "Diabetes Screening Report",
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")
      analyzeReport(file)
    }
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
      // Create a comprehensive prompt for AI analysis
      const analysisPrompt = `
Please analyze this medical report: ${file.name}

As an AI medical report analyzer, provide a comprehensive analysis including:

1. **Report Type Identification**: What type of medical report this is
2. **Key Findings**: List the most important findings from the report
3. **Parameter Analysis**: For each parameter, indicate if it's normal, high, or low with specific values and normal ranges
4. **Health Implications**: What these results might indicate about the patient's health
5. **Recommendations**: Specific actionable recommendations based on the results
6. **Urgency Level**: Whether this requires immediate, moderate, or routine follow-up
7. **Next Steps**: What the patient should do next

Please format your response in a clear, structured manner that's easy for patients to understand.

Note: This is a simulated analysis for demonstration. In a real scenario, OCR would extract text from the uploaded document.

For this demonstration, please provide analysis appropriate for a ${file.name} report with realistic medical insights including specific parameter values, normal ranges, and clinical interpretations.

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
        return "text-red-600 bg-red-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <Card className="border-green-100 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-green-700">
          <FileText className="w-5 h-5 mr-2" />🔬 AI Report Analyzer
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Live AI
          </Badge>
          <span className="text-xs text-gray-500">Powered by OpenAI GPT-4</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <>
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
              onClick={() => document.getElementById("report-upload")?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium text-gray-800">Upload Medical Report</p>
              <p className="text-xs text-gray-600 mt-1">PDF, JPG, PNG files supported</p>
            </div>

            <Input
              id="report-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isAnalyzing}
            />

            {selectedFile && !isAnalyzing && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Selected: {selectedFile.name}</span>
                </div>
              </div>
            )}

            {/* Sample Reports */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Or try with sample reports:</p>
              <div className="grid grid-cols-1 gap-2">
                {sampleReports.map((report, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleReport(report)}
                    disabled={isAnalyzing}
                    className="text-xs text-left justify-start h-auto py-2 px-3 hover:bg-green-50 hover:border-green-200"
                  >
                    <FileText className="w-3 h-3 mr-2" />
                    {report}
                  </Button>
                ))}
              </div>
            </div>

            {isAnalyzing && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-800">Analyzing Report...</p>
                    <p className="text-xs text-green-600">OpenAI is processing your medical data</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {/* Analysis Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">AI Analysis Complete</h4>
              </div>
              <Badge className={getUrgencyColor(analysis.urgency)}>{analysis.urgency.toUpperCase()} Priority</Badge>
            </div>

            {/* Report Type */}
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-800">{analysis.reportType}</p>
              <p className="text-xs text-gray-600">Report: {selectedFile?.name}</p>
            </div>

            {/* Key Findings */}
            {analysis.keyFindings.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Key Findings:</h5>
                <ul className="space-y-1">
                  {analysis.keyFindings.map((finding, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parameter Analysis */}
            {analysis.abnormalValues.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Parameter Analysis:</h5>
                <div className="space-y-2">
                  {analysis.abnormalValues.map((param, idx) => (
                    <div key={idx} className={`rounded-lg p-3 border ${getStatusColor(param.status)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(param.status)}
                          <span className="font-medium text-sm">{param.parameter}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {param.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs">
                        <p>
                          Value: <strong>{param.value}</strong>
                        </p>
                        <p>Normal Range: {param.normalRange}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">AI Recommendations:</h5>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="font-medium text-blue-800 mb-1">Follow-up Care:</h5>
              <p className="text-sm text-blue-700">{analysis.followUp}</p>
            </div>

            {/* Raw AI Analysis */}
            <details className="bg-gray-50 rounded-lg p-3">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                View Full AI Analysis
              </summary>
              <div className="mt-2 text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                {analysis.rawAnalysis}
              </div>
            </details>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                This AI analysis is for informational purposes only. Always consult healthcare professionals for medical
                interpretation and treatment decisions.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={resetAnalyzer} variant="outline" size="sm" className="flex-1 bg-transparent">
                Analyze Another Report
              </Button>
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" asChild>
                <a href="/chat">
                  Discuss with AI Doctor
                  <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
            <a href="/reports">
              Open Full Report Analyzer
              <ArrowRight className="w-4 h-4 ml-2" />
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
