"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, CheckCircle } from "lucide-react"

export default function DemoReportAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setAnalysisResult(
        "Blood Report Analysis:\n• Hemoglobin: 12.5 g/dL (Normal)\n• Blood Sugar: 95 mg/dL (Normal)\n• Cholesterol: 180 mg/dL (Good)\n\nRecommendation: All values are within normal range. Continue healthy lifestyle.",
      )
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Camera className="w-5 h-5 text-green-400" />
          <span className="text-sm">📸 INSTANT REPORT ANALYZER</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysisResult ? (
          <>
            <div
              className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-green-500/30 cursor-pointer hover:border-green-400/50 transition-colors"
              onClick={handleAnalyze}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-xs text-gray-100">Drop/Photograph any medical report</p>
                <p className="text-xs text-gray-200 mt-1">Click to simulate analysis</p>
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <div className="w-full h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded flex items-center justify-center">
                <span className="text-xs text-gray-100">Live camera feed preview</span>
              </div>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-100"
            >
              {isAnalyzing ? "Analyzing..." : "Start OCR Analysis"}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Analysis Complete</span>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <pre className="text-xs text-gray-100 whitespace-pre-wrap">{analysisResult}</pre>
            </div>
            <Button
              onClick={() => setAnalysisResult(null)}
              size="sm"
              className="w-full bg-green-500/20 border-green-500/30 hover:bg-green-500/30 text-green-100"
            >
              Analyze Another Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
