"use client"

import { useState } from "react"
import Link from "next/link"
import { Pill, Camera, Search, Home, RotateCcw, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function ProductionMedicineIdentifier() {
  const [medicineName, setMedicineName] = useState("")
  const [result, setResult] = useState("")
  const [patientName, setPatientName] = useState("")

  const handleSearch = () => {
    if (medicineName.trim()) {
      setResult(`
Medicine Information: ${medicineName}

🔍 Description: This is a common medication
💊 Dosage: As prescribed by doctor
⚠️ Precautions: Take with food
🕒 Timing: 2-3 times daily

⚠️ Important: Please consult with a doctor
`)
    }
  }

  const handleReset = () => {
    setMedicineName("")
    setResult("")
    setPatientName("")
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Medicine Information Report</title>
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
          .medicine-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .medicine-section h3 { 
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
            <div class="logo">💊</div>
            <h1>MyMedi.ai - Medicine Information</h1>
            <p>AI-Powered Medicine Identifier & Information System</p>
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
            <p><strong>Search Date:</strong> ${new Date().toLocaleDateString("en-IN", {
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

          <div class="medicine-section">
            <h3>💊 Medicine Information</h3>
            <p><strong>Searched Medicine:</strong> ${medicineName}</p>
            <div style="white-space: pre-line; margin-top: 15px;">${result}</div>
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This medicine information is for educational purposes only and does not replace professional medical advice.</p>
            <p><em>Always consult with qualified healthcare providers and pharmacists before taking any medication.</em></p>
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
MyMedi.ai - Medicine Information Report
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
Search Date: ${new Date().toLocaleDateString("en-IN", {
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
}MEDICINE INFORMATION:
Searched Medicine: ${medicineName}

${result}

---
DISCLAIMER: This medicine information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers and pharmacists before taking any medication.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Medicine-Info-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-700">
          <div className="flex items-center">
            <Pill className="w-5 h-5 mr-2" />
            Medicine Identifier
          </div>
          <div className="flex gap-1">
            <Button onClick={handlePrint} variant="ghost" size="sm" title="Print Report" disabled={!result}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownload} variant="ghost" size="sm" title="Download Report" disabled={!result}>
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

        <div className="bg-orange-50 p-3 rounded-lg min-h-[100px]">
          {result ? (
            <div className="text-sm text-orange-800 whitespace-pre-line">{result}</div>
          ) : (
            <p className="text-sm text-orange-600">Type medicine name or upload photo to identify...</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter medicine name..."
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="text-sm"
          />
          <Button onClick={handleSearch} size="sm" disabled={!medicineName.trim()}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Camera className="w-4 h-4 mr-1" />
              Photo
            </Button>
            {result && (
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
