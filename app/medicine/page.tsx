"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Pill,
  Camera,
  Search,
  RotateCcw,
  Download,
  Printer,
  AlertTriangle,
  Info,
  Utensils,
  Shield,
  Users,
  FileText,
  Activity,
  MessageCircle,
  Apple,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import MyMedLogo from "@/components/mymed-logo"
import NavigationButtons from "@/components/navigation-buttons"
import PoweredByFooter from "@/components/powered-by-footer"

interface MedicineInfo {
  name: string
  genericName: string
  chemicalFormula: string
  molecularWeight: string
  activeIngredient: string
  strength: string
  mechanismOfAction: string
  dosageGuidelines: {
    adults: string
    children: string
    elderly: string
    maxDaily: string
    frequency: string
  }
  foodInteractions: {
    withFood: boolean
    timing: string
    restrictions: string[]
    recommendations: string[]
  }
  contraindications: {
    conditions: string[]
    medications: string[]
    allergies: string[]
    warnings: string[]
  }
  sideEffects: {
    common: string[]
    serious: string[]
    rare: string[]
  }
  alternatives: {
    generic: string[]
    branded: string[]
    natural: string[]
  }
  storage: {
    temperature: string
    conditions: string[]
    expiry: string
  }
  consultation: {
    pharmacist: string[]
    doctor: string[]
    emergency: string[]
  }
}

export default function MedicinePage() {
  const [medicineName, setMedicineName] = useState("")
  const [result, setResult] = useState<MedicineInfo | null>(null)
  const [patientName, setPatientName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!medicineName.trim()) return

    setIsLoading(true)
    try {
      const prompt = `
Provide comprehensive medicine information for: ${medicineName.trim()}

Please provide detailed information in the following format with bullet points and bold headings:

**BASIC INFORMATION:**
• Brand Name: [name]
• Generic Name: [generic]
• Chemical Formula: [formula]
• Molecular Weight: [weight]
• Active Ingredient: [ingredient]
• Strength: [strength]

**MECHANISM OF ACTION:**
• [Detailed explanation of how the medicine works]

**DOSAGE GUIDELINES:**
• Adults: [dosage]
• Children: [dosage]
• Elderly: [dosage]
• Maximum Daily: [max dose]
• Frequency: [frequency]

**FOOD INTERACTIONS:**
• Take with food: [Yes/No]
• Timing: [timing instructions]
• Restrictions: [list restrictions]
• Recommendations: [list recommendations]

**CONTRAINDICATIONS:**
• Medical Conditions: [list conditions]
• Drug Interactions: [list medications]
• Allergies: [list allergies]
• Warnings: [list warnings]

**SIDE EFFECTS:**
• Common: [list common side effects]
• Serious: [list serious side effects]
• Rare: [list rare side effects]

**ALTERNATIVES:**
• Generic: [list generic alternatives]
• Branded: [list branded alternatives]
• Natural: [list natural alternatives]

**STORAGE:**
• Temperature: [storage temperature]
• Conditions: [storage conditions]
• Expiry: [expiry information]

**CONSULTATION NEEDED:**
• Pharmacist: [when to consult pharmacist]
• Doctor: [when to consult doctor]
• Emergency: [emergency situations]

Please provide accurate, detailed medical information with proper formatting.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          type: "medicine",
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        // Parse AI response into structured format
        const aiText = data.response

        const parsedResult: MedicineInfo = {
          name: extractValue(aiText, "Brand Name") || medicineName,
          genericName: extractValue(aiText, "Generic Name") || "Not specified",
          chemicalFormula: extractValue(aiText, "Chemical Formula") || "Not specified",
          molecularWeight: extractValue(aiText, "Molecular Weight") || "Not specified",
          activeIngredient: extractValue(aiText, "Active Ingredient") || "Not specified",
          strength: extractValue(aiText, "Strength") || "Not specified",
          mechanismOfAction:
            extractSection(aiText, "MECHANISM OF ACTION") ||
            "Please consult healthcare provider for detailed mechanism information.",
          dosageGuidelines: {
            adults: extractValue(aiText, "Adults") || "Follow doctor's prescription",
            children: extractValue(aiText, "Children") || "Consult pediatrician",
            elderly: extractValue(aiText, "Elderly") || "May require dose adjustment",
            maxDaily: extractValue(aiText, "Maximum Daily") || "As prescribed",
            frequency: extractValue(aiText, "Frequency") || "As directed",
          },
          foodInteractions: {
            withFood: extractValue(aiText, "Take with food")?.toLowerCase().includes("yes") || false,
            timing: extractValue(aiText, "Timing") || "Follow label instructions",
            restrictions: extractList(aiText, "Restrictions") || ["Consult healthcare provider"],
            recommendations: extractList(aiText, "Recommendations") || ["Follow prescribed guidelines"],
          },
          contraindications: {
            conditions: extractList(aiText, "Medical Conditions") || ["Inform doctor of all conditions"],
            medications: extractList(aiText, "Drug Interactions") || ["Inform doctor of all medications"],
            allergies: extractList(aiText, "Allergies") || ["Check for drug allergies"],
            warnings: extractList(aiText, "Warnings") || ["Follow safety guidelines"],
          },
          sideEffects: {
            common: extractList(aiText, "Common") || ["Varies by individual"],
            serious: extractList(aiText, "Serious") || ["Contact healthcare provider"],
            rare: extractList(aiText, "Rare") || ["Report unusual symptoms"],
          },
          alternatives: {
            generic: extractList(aiText, "Generic") || ["Consult pharmacist"],
            branded: extractList(aiText, "Branded") || ["Ask about alternatives"],
            natural: extractList(aiText, "Natural") || ["Discuss with doctor"],
          },
          storage: {
            temperature: extractValue(aiText, "Temperature") || "Room temperature",
            conditions: extractList(aiText, "Conditions") || ["Keep in original container"],
            expiry: extractValue(aiText, "Expiry") || "Check expiration date",
          },
          consultation: {
            pharmacist: extractList(aiText, "Pharmacist") || ["Drug interactions", "Proper dosing"],
            doctor: extractList(aiText, "Doctor") || ["Treatment monitoring", "Dose adjustments"],
            emergency: extractList(aiText, "Emergency") || ["Severe reactions", "Overdose symptoms"],
          },
        }

        setResult(parsedResult)
      } else {
        throw new Error("Failed to get medicine information")
      }
    } catch (error) {
      console.error("Medicine search error:", error)
      // Provide fallback with AI-like structure
      setResult({
        name: medicineName,
        genericName: "Information unavailable",
        chemicalFormula: "Not available",
        molecularWeight: "Not available",
        activeIngredient: "Please provide specific medicine name",
        strength: "Varies by formulation",
        mechanismOfAction:
          "AI service temporarily unavailable. Please consult healthcare provider for detailed mechanism information.",
        dosageGuidelines: {
          adults: "Follow doctor's prescription",
          children: "Consult pediatrician for appropriate dosing",
          elderly: "May require dose adjustment - consult doctor",
          maxDaily: "As prescribed by healthcare provider",
          frequency: "As directed on prescription label",
        },
        foodInteractions: {
          withFood: true,
          timing: "Check specific instructions on medication label",
          restrictions: ["Avoid alcohol unless approved by doctor", "Check for food-drug interactions"],
          recommendations: ["Take with water", "Follow prescribed timing", "Read medication labels carefully"],
        },
        contraindications: {
          conditions: ["Inform doctor of all medical conditions", "Discuss current health status"],
          medications: ["Inform doctor of all current medications", "Include supplements and vitamins"],
          allergies: ["Check for drug allergies before taking", "Inform healthcare providers of allergies"],
          warnings: ["Don't exceed recommended dose", "Store safely away from children"],
        },
        sideEffects: {
          common: ["Varies by medication type", "Monitor for any unusual symptoms"],
          serious: [
            "Contact healthcare provider immediately for serious reactions",
            "Seek medical attention if concerned",
          ],
          rare: ["Report any unusual symptoms to doctor", "Emergency care for severe reactions"],
        },
        alternatives: {
          generic: ["Consult pharmacist for generic options", "Ask about cost-effective alternatives"],
          branded: ["Discuss brand alternatives with doctor", "Compare effectiveness with healthcare provider"],
          natural: ["Discuss natural alternatives with doctor", "Consider complementary approaches"],
        },
        storage: {
          temperature: "Follow storage instructions on label",
          conditions: ["Keep in original container", "Store as directed", "Protect from moisture"],
          expiry: "Check expiration date regularly - do not use expired medications",
        },
        consultation: {
          pharmacist: ["Drug interaction checks", "Proper administration guidance", "Side effect management"],
          doctor: ["Treatment monitoring", "Dose adjustments", "Alternative therapy options"],
          emergency: ["Severe allergic reactions", "Overdose symptoms", "Unusual or serious side effects"],
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions to parse AI response
  const extractValue = (text: string, key: string): string => {
    const regex = new RegExp(`${key}:\\s*(.+?)(?=\\n|$)`, "i")
    const match = text.match(regex)
    return match ? match[1].trim().replace(/^\[|\]$/g, "") : ""
  }

  const extractSection = (text: string, sectionName: string): string => {
    const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*([\\s\\S]*?)(?=\\*\\*|$)`, "i")
    const match = text.match(regex)
    return match ? match[1].trim() : ""
  }

  const extractList = (text: string, key: string): string[] => {
    const value = extractValue(text, key)
    if (!value) return []

    // Split by common delimiters and clean up
    return value
      .split(/[,;]|\sand\s/)
      .map((item) => item.trim().replace(/^\[|\]$|^•\s*/, ""))
      .filter((item) => item.length > 0)
  }

  const handleReset = () => {
    setMedicineName("")
    setResult(null)
    setPatientName("")
    setIsLoading(false)
  }

  const handlePrint = () => {
    if (!result) return

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Comprehensive Medicine Information Report</title>
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
            max-width: 1000px;
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
          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .list-item {
            background: white;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border-left: 3px solid #667eea;
          }
          .warning-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
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
            <p>Comprehensive Medicine Analysis & Safety Information</p>
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
            <h3>💊 Medicine Overview</h3>
            <div class="two-column">
              <div>
                <p><strong>Brand Name:</strong> ${result.name}</p>
                <p><strong>Generic Name:</strong> ${result.genericName}</p>
                <p><strong>Active Ingredient:</strong> ${result.activeIngredient}</p>
                <p><strong>Strength:</strong> ${result.strength}</p>
              </div>
              <div>
                <p><strong>Chemical Formula:</strong> ${result.chemicalFormula}</p>
                <p><strong>Molecular Weight:</strong> ${result.molecularWeight}</p>
              </div>
            </div>
          </div>

          <div class="medicine-section">
            <h3>🎯 Mechanism of Action</h3>
            <p>${result.mechanismOfAction}</p>
          </div>

          <div class="medicine-section">
            <h3>💊 Dosage Guidelines</h3>
            <div class="two-column">
              <div>
                <div class="list-item"><strong>Adults:</strong> ${result.dosageGuidelines.adults}</div>
                <div class="list-item"><strong>Children:</strong> ${result.dosageGuidelines.children}</div>
              </div>
              <div>
                <div class="list-item"><strong>Elderly:</strong> ${result.dosageGuidelines.elderly}</div>
                <div class="list-item"><strong>Maximum Daily:</strong> ${result.dosageGuidelines.maxDaily}</div>
              </div>
            </div>
          </div>

          <div class="warning-box">
            <strong>⚠️ IMPORTANT SAFETY REMINDER:</strong> This medicine information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers and pharmacists before taking any medication. Report adverse reactions immediately.
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>Your AI Healthcare Companion - Comprehensive Medicine Information System</p>
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
    if (!result) return

    const content = `
MyMedi.ai - Comprehensive Medicine Information Report
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
Brand Name: ${result.name}
Generic Name: ${result.genericName}
Active Ingredient: ${result.activeIngredient}
Chemical Formula: ${result.chemicalFormula}
Molecular Weight: ${result.molecularWeight}
Strength: ${result.strength}

MECHANISM OF ACTION:
${result.mechanismOfAction}

DOSAGE GUIDELINES:
Adults: ${result.dosageGuidelines.adults}
Children: ${result.dosageGuidelines.children}
Elderly: ${result.dosageGuidelines.elderly}
Maximum Daily: ${result.dosageGuidelines.maxDaily}
Frequency: ${result.dosageGuidelines.frequency}

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
    a.download = `MyMedi-Medicine-Info-${result.name.replace(/\s+/g, "-")}-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 shadow-sm">
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
          <div className="max-w-6xl mx-auto space-y-6">
            <Card className="border-orange-200 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Pill className="w-6 h-6 mr-3" />
                    <div>
                      <h2 className="text-xl font-bold">Comprehensive Medicine Information</h2>
                      <p className="text-orange-100 text-sm">
                        {result.name} • {result.genericName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrint}
                      variant="secondary"
                      size="sm"
                      className="bg-white text-orange-600 hover:bg-orange-50"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      size="sm"
                      className="bg-white text-orange-600 hover:bg-orange-50"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6 bg-gradient-to-r from-orange-100 to-red-100">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      <Info className="w-4 h-4 mr-1" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="mechanism"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      <Activity className="w-4 h-4 mr-1" />
                      Mechanism
                    </TabsTrigger>
                    <TabsTrigger
                      value="dosage"
                      className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                    >
                      <Pill className="w-4 h-4 mr-1" />
                      Dosage
                    </TabsTrigger>
                    <TabsTrigger
                      value="food"
                      className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                    >
                      <Utensils className="w-4 h-4 mr-1" />
                      Food
                    </TabsTrigger>
                    <TabsTrigger
                      value="contraindications"
                      className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Warnings
                    </TabsTrigger>
                    <TabsTrigger
                      value="sideeffects"
                      className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Side Effects
                    </TabsTrigger>
                    <TabsTrigger
                      value="alternatives"
                      className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Alternatives
                    </TabsTrigger>
                    <TabsTrigger
                      value="consultation"
                      className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Consultation
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        Medicine Overview & Chemical Information
                      </h3>
                      <p className="text-orange-100 text-sm">Complete pharmaceutical and chemical details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-orange-200">
                        <CardHeader className="bg-orange-50">
                          <CardTitle className="text-orange-700 flex items-center">
                            <Pill className="w-5 h-5 mr-2" />
                            Basic Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Brand Name:</span>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700">
                              {result.name}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Generic Name:</span>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              {result.genericName}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Active Ingredient:</span>
                            <span className="text-sm font-medium">{result.activeIngredient}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Strength:</span>
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              {result.strength}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200">
                        <CardHeader className="bg-blue-50">
                          <CardTitle className="text-blue-700 flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            Chemical Properties
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Chemical Formula:</span>
                            <Badge variant="outline" className="bg-purple-100 text-purple-700 font-mono">
                              {result.chemicalFormula}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Molecular Weight:</span>
                            <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
                              {result.molecularWeight}
                            </Badge>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Storage:</strong> {result.storage.temperature}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">{result.storage.conditions.join(" • ")}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="mechanism" className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-lg">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Mechanism of Action
                      </h3>
                      <p className="text-blue-100 text-sm">How this medicine works in your body</p>
                    </div>

                    <Card className="border-blue-200">
                      <CardContent className="p-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-900 leading-relaxed">{result.mechanismOfAction}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Add other tab contents with similar AI-driven structure */}
                </Tabs>

                <div className="flex gap-3 mt-8 justify-center">
                  <Button
                    onClick={handlePrint}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Complete Report
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Search
                  </Button>
                </div>

                {/* Cross-navigation section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Related Health Tools
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link href="/chat">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        AI Chat
                      </Button>
                    </Link>
                    <Link href="/diet">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Apple className="w-4 h-4 mr-1" />
                        Diet Plan
                      </Button>
                    </Link>
                    <Link href="/vitals">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Activity className="w-4 h-4 mr-1" />
                        Vitals
                      </Button>
                    </Link>
                    <Link href="/body-mapper">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <User className="w-4 h-4 mr-1" />
                        Body Map
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 shadow-sm">
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
          <Card className="border-orange-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Pill className="w-6 h-6 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold">AI Medicine Analyzer</h1>
                    <p className="text-orange-100 text-sm">Comprehensive medicine information powered by AI</p>
                  </div>
                </div>
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

              <div className="bg-orange-50 p-6 rounded-lg min-h-[150px] flex items-center justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p className="text-orange-600 font-medium">AI is analyzing medicine information...</p>
                    <p className="text-sm text-orange-500">Getting comprehensive details from medical database</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Pill className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-orange-800 mb-2">AI-Powered Medicine Analysis</h3>
                    <p className="text-orange-600 mb-4 max-w-md">
                      Enter any medicine name to get comprehensive AI-generated information including chemical
                      composition, dosage guidelines, food interactions, contraindications, and safety information.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="bg-orange-100 text-orange-700">
                        Chemical Analysis
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700">
                        Dosage Guidelines
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Safety Information
                      </Badge>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700">
                        Interactions
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Input
                  placeholder="Enter medicine name (e.g., Paracetamol, Ibuprofen, Aspirin)"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  disabled={isLoading}
                  className="text-lg"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!medicineName.trim() || isLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Analyze with AI
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center p-4 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Scan Medicine Label
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center p-4 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Pill className="w-5 h-5 mr-2" />
                  Browse Medicine Database
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-2">⚠️ IMPORTANT MEDICAL DISCLAIMER:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        <strong>AI-generated information</strong> is for educational purposes only
                      </li>
                      <li>
                        <strong>Always consult healthcare professionals</strong> before taking any medication
                      </li>
                      <li>
                        <strong>Report adverse reactions</strong> immediately to your doctor
                      </li>
                      <li>
                        <strong>Each medication requires personalized</strong> medical guidance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cross-navigation section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Explore More Health Tools
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      AI Health Chat
                    </Button>
                  </Link>
                  <Link href="/diet">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Apple className="w-4 h-4 mr-1" />
                      Diet Planning
                    </Button>
                  </Link>
                  <Link href="/vitals">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Activity className="w-4 h-4 mr-1" />
                      Vitals Tracker
                    </Button>
                  </Link>
                  <Link href="/assessment">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 mr-1" />
                      Health Assessment
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
