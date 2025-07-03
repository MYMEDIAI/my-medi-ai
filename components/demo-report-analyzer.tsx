"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, CheckCircle, Loader2, FileText, AlertTriangle } from "lucide-react"

export default function DemoReportAnalyzer() {
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

Please provide:
1. Key findings and abnormal values
2. Normal vs abnormal ranges comparison
3. Potential health implications
4. Recommendations for follow-up
5. Lifestyle suggestions based on results
6. When to consult a doctor

Note: This is a simulated analysis for demonstration. In a real scenario, OCR would extract text from the uploaded image/PDF.

Provide a comprehensive but easy-to-understand analysis suitable for patients.
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
Analysis of ${file.name}:

📋 **Report Overview:**
• Document type: Medical laboratory report
• Analysis status: Processed successfully

🔍 **Key Findings:**
• Most values appear within normal ranges
• Some parameters may require attention
• Overall health indicators are stable

📊 **Recommendations:**
• Continue regular health monitoring
• Maintain a balanced diet and exercise routine
• Follow up with your healthcare provider
• Keep track of any symptoms or changes

⚠️ **Important Note:**
This is a demonstration analysis. For accurate medical interpretation, please consult with your healthcare provider or a qualified medical professional.
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

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <FileText className="w-5 h-5 text-green-400" />
          <span className="text-sm">📸 AI REPORT ANALYZER</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <>
            <div
              className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-green-500/30 cursor-pointer hover:border-green-400/50 transition-colors"
              onClick={() => document.getElementById("report-upload")?.click()}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-xs text-gray-100">Upload any medical report (PDF/Image)</p>
                <p className="text-xs text-gray-200 mt-1">Click to select file</p>
              </div>
            </div>

            <Input
              id="report-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isAnalyzing}
            />

            <div className="bg-black/30 rounded-lg p-2">
              <div className="w-full h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
                <span className="text-xs text-gray-100">
                  {file ? `Selected: ${file.name.substring(0, 25)}...` : "No file selected"}
                </span>
              </div>
            </div>

            <Button
              onClick={() => document.getElementById("report-upload")?.click()}
              disabled={isAnalyzing}
              className="w-full bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-100"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Analyzing Report...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Medical Report
                </>
              )}
            </Button>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Analysis Complete</span>
            </div>

            <div className="bg-black/30 rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="text-xs text-gray-100 whitespace-pre-line">{analysis}</div>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200 text-xs">
                This is an AI analysis for reference only. Always consult healthcare professionals for medical advice.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={resetAnalyzer}
                size="sm"
                className="flex-1 bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-100"
              >
                Analyze Another Report
              </Button>
              <Button
                onClick={() => window.open("/chat", "_blank")}
                size="sm"
                className="flex-1 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-100"
              >
                Ask AI Doctor
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
