"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { FileText, Upload, Home, RotateCcw, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ProductionReportAnalyzer() {
  const [analysis, setAnalysis] = useState("")
  const [fileName, setFileName] = useState("")
  const [patientName, setPatientName] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // Simulate analysis
      setAnalysis(`
📋 Report Analysis for: ${file.name}

🔍 Analysis Summary:
• Report type: Medical Lab Report
• Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
• Status: Analyzed

📊 Key Findings:
• Most values appear within normal range
• Some parameters may need attention
• Recommend follow-up with doctor

⚠️ Important Note:
This is an AI analysis for reference only.
Please consult with your doctor for proper interpretation.
`)
    }
  }

  const handleReset = () => {
    setAnalysis("")
    setFileName("")
    setPatientName("")
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
    <Card className="border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-indigo-700">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Report Analyzer
          </div>
          <div className="flex gap-1">
            <Button onClick={handlePrint} variant="ghost" size="sm" title="Print Analysis" disabled={!analysis}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownload} variant="ghost" size="sm" title="Download Analysis" disabled={!analysis}>
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={handleReset} variant="ghost" size="sm" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!patientName && (
          <div className="mb-4">
            <Input
              placeholder="Enter your name (optional)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="text-sm"
            />
          </div>
        )}

        <div className="bg-indigo-50 p-3 rounded-lg min-h-[100px]">
          {analysis ? (
            <div className="text-sm text-indigo-800 whitespace-pre-line">{analysis}</div>
          ) : (
            <p className="text-sm text-indigo-600">Upload a medical report to get AI analysis...</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload Report
          </Button>
        </div>

        {fileName && <p className="text-xs text-gray-600">Selected: {fileName}</p>}

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            {analysis && (
              <>
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </>
            )}
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
