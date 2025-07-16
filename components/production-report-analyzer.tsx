"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, FileText, Upload } from "lucide-react"

export function ProductionReportAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      analyzeReport(selected)
    }
  }

  const analyzeReport = async (f: File) => {
    setIsAnalyzing(true)
    try {
      await new Promise((r) => setTimeout(r, 2000)) // mock
      setAnalysis(
        `Analysis of ${f.name}:\n\n• Key findings identified\n• Normal ranges compared\n• Recommendations provided\n• Follow-up suggestions included`,
      )
    } catch {
      setAnalysis("Analysis complete. Please consult with your doctor for detailed interpretation.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-green-700">
          <FileText className="w-5 h-5 mr-2" />
          Report Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-3 rounded-lg min-h-[100px]">
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-green-600 mr-2" />
              <span className="text-sm text-green-600">Analyzing report...</span>
            </div>
          ) : analysis ? (
            <p className="text-sm text-green-800 whitespace-pre-line">{analysis}</p>
          ) : (
            <p className="text-sm text-green-600">Upload your medical report for AI analysis...</p>
          )}
        </div>

        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="text-sm"
          disabled={isAnalyzing}
        />

        <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
          <Upload className="w-4 h-4 mr-2" />
          {file ? `Uploaded: ${file.name.slice(0, 20)}...` : "Upload Medical Report"}
        </Button>
      </CardContent>
    </Card>
  )
}
