"use client"

import { useState } from "react"
import Link from "next/link"
import { Activity, Plus, Home, RotateCcw, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface VitalReading {
  id: string
  type: string
  value: string
  timestamp: Date
  status: "normal" | "warning" | "critical"
}

export function ProductionVitalsTracker() {
  const [vitals, setVitals] = useState<VitalReading[]>([])
  const [newVital, setNewVital] = useState({ type: "Blood Pressure", value: "" })
  const [patientName, setPatientName] = useState("")

  const addVital = () => {
    if (newVital.value) {
      const vital: VitalReading = {
        id: Date.now().toString(),
        type: newVital.type,
        value: newVital.value,
        timestamp: new Date(),
        status: "normal", // Simplified for demo
      }
      setVitals([vital, ...vitals])
      setNewVital({ ...newVital, value: "" })
    }
  }

  const handleReset = () => {
    setVitals([])
    setNewVital({ type: "Blood Pressure", value: "" })
    setPatientName("")
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Vitals Tracking Report</title>
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
          .vitals-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .vitals-section h3 { 
            color: #667eea; 
            border-bottom: 2px solid #e0e7ff; 
            padding-bottom: 8px; 
            margin-top: 0;
            font-size: 1.3em;
          }
          .vital-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
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
            <div class="logo">📊</div>
            <h1>MyMedi.ai - Vitals Tracking</h1>
            <p>AI-Powered Health Vitals Monitoring System</p>
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
            <p><strong>Tracking Date:</strong> ${new Date().toLocaleDateString("en-IN", {
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

          <div class="vitals-section">
            <h3>📊 Vital Signs Tracking</h3>
            ${
              vitals.length > 0
                ? vitals
                    .map(
                      (vital) => `
              <div class="vital-item">
                <p><strong>${vital.type}:</strong> ${vital.value}</p>
                <p><small>Recorded: ${vital.timestamp.toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour12: true,
                })}</small></p>
              </div>
            `,
                    )
                    .join("")
                : "<p>No vital signs recorded yet.</p>"
            }
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This vitals tracking is for educational purposes only and does not replace professional medical monitoring.</p>
            <p><em>Always consult with qualified healthcare providers for proper health monitoring and interpretation.</em></p>
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
MyMedi.ai - Vitals Tracking Report
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
Tracking Date: ${new Date().toLocaleDateString("en-IN", {
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
}VITAL SIGNS TRACKING:

${
  vitals.length > 0
    ? vitals
        .map(
          (vital) => `
${vital.type}: ${vital.value}
Recorded: ${vital.timestamp.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true,
          })}
`,
        )
        .join("\n")
    : "No vital signs recorded yet."
}

---
DISCLAIMER: This vitals tracking is for educational purposes only and should not replace professional medical monitoring. Always consult with qualified healthcare providers for proper health monitoring and interpretation.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Vitals-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const vitalTypes = ["Blood Pressure", "Heart Rate", "Temperature", "Blood Sugar", "Weight", "Height"]

  return (
    <Card className="border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-red-700">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Vitals Tracker
          </div>
          <div className="flex gap-1">
            <Button onClick={handlePrint} variant="ghost" size="sm" title="Print Report" disabled={vitals.length === 0}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              variant="ghost"
              size="sm"
              title="Download Report"
              disabled={vitals.length === 0}
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

        <div className="bg-red-50 p-3 rounded-lg min-h-[100px]">
          {vitals.length > 0 ? (
            <div className="space-y-2">
              {vitals.slice(0, 3).map((vital) => (
                <div key={vital.id} className="text-sm text-red-800 bg-white p-2 rounded border">
                  <div className="flex justify-between">
                    <span>
                      <strong>{vital.type}:</strong> {vital.value}
                    </span>
                    <span className="text-xs opacity-70">
                      {vital.timestamp.toLocaleTimeString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {vitals.length > 3 && <p className="text-xs text-red-600">+{vitals.length - 3} more readings...</p>}
            </div>
          ) : (
            <p className="text-sm text-red-600">No vitals recorded yet. Add your first reading...</p>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={newVital.type}
            onChange={(e) => setNewVital({ ...newVital, type: e.target.value })}
            className="text-sm border rounded px-2 py-1 flex-1"
          >
            {vitalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Input
            placeholder="Value"
            value={newVital.value}
            onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && addVital()}
            className="text-sm flex-1"
          />
          <Button onClick={addVital} size="sm" disabled={!newVital.value}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            {vitals.length > 0 && (
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
