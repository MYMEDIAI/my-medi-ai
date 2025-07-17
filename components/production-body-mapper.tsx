"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Home, RotateCcw, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ProductionBodyMapper() {
  const [selectedPart, setSelectedPart] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [patientName, setPatientName] = useState("")

  const bodyParts = ["Head", "Neck", "Chest", "Stomach", "Back", "Arms", "Legs", "Joints"]

  const handleReset = () => {
    setSelectedPart("")
    setSymptoms("")
    setPatientName("")
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Body Symptom Mapper Report</title>
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
            <h1>MyMedi.ai - Body Symptom Mapper</h1>
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
            <p><strong>Affected Body Part:</strong> ${selectedPart || "Not selected"}</p>
            <p><strong>Symptoms Description:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
              ${symptoms || "No symptoms described"}
            </div>
            
            ${
              selectedPart && symptoms
                ? `
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
              <h4>🤖 AI Recommendations:</h4>
              <p>• Rest and avoid strain on the affected area</p>
              <p>• If pain persists, consult with a doctor</p>
              <p>• Apply hot or cold compress as appropriate</p>
              <p>• Stay hydrated and maintain a healthy diet</p>
            </div>
            `
                : ""
            }
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
MyMedi.ai - Body Symptom Mapper Report
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
Affected Body Part: ${selectedPart || "Not selected"}
Symptoms Description: ${symptoms || "No symptoms described"}

${
  selectedPart && symptoms
    ? `
AI RECOMMENDATIONS:
• Rest and avoid strain on the affected area
• If pain persists, consult with a doctor
• Apply hot or cold compress as appropriate
• Stay hydrated and maintain a healthy diet
`
    : ""
}

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
    a.download = `MyMedi-Body-Mapper-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-teal-700">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Body Mapper
          </div>
          <div className="flex gap-1">
            <Button
              onClick={handlePrint}
              variant="ghost"
              size="sm"
              title="Print Report"
              disabled={!selectedPart || !symptoms}
            >
              <Printer className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="sm"
              title="Download Report"
              disabled={!selectedPart || !symptoms}
            >
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

        <div className="bg-teal-50 p-3 rounded-lg min-h-[100px]">
          {selectedPart && symptoms ? (
            <div className="text-sm text-teal-800">
              <p>
                <strong>Selected:</strong> {selectedPart}
              </p>
              <p>
                <strong>Symptoms:</strong> {symptoms}
              </p>
              <div className="mt-3 p-2 bg-white rounded border">
                <p className="font-medium">🤖 AI Suggestions:</p>
                <p>• Rest and avoid strain on the affected area</p>
                <p>• If pain persists, consult with a doctor</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-teal-600">Select a body part and describe your symptoms...</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {bodyParts.map((part) => (
            <Button
              key={part}
              variant={selectedPart === part ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPart(part)}
              className="text-xs"
            >
              {part}
            </Button>
          ))}
        </div>

        <Input
          placeholder="Describe your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="text-sm"
        />

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            {selectedPart && symptoms && (
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
