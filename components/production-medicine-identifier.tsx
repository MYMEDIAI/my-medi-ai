"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Camera,
  Upload,
  Loader2,
  Home,
  RotateCcw,
  Download,
  AlertTriangle,
  Pill,
  Clock,
  Shield,
  Info,
  CheckCircle,
  XCircle,
  FileText,
  Zap,
  Brain,
  Search,
  Eye,
  Scan,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface MedicineInfo {
  name: string
  genericName: string
  brandNames: string[]
  category: string
  strength: string
  form: string
  manufacturer: string
  uses: string[]
  dosage: {
    adults: string
    children: string
    elderly: string
    special: string
  }
  sideEffects: {
    common: string[]
    serious: string[]
    rare: string[]
  }
  contraindications: string[]
  interactions: {
    drugs: string[]
    food: string[]
    conditions: string[]
  }
  precautions: string[]
  storage: string
  overdose: string
  pregnancy: string
  breastfeeding: string
  price: {
    range: string
    insurance: string
  }
  availability: string
  alternatives: string[]
  warnings: string[]
}

export default function ProductionMedicineIdentifier() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MedicineInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const identifyMedicine = async () => {
    if (!selectedImage) {
      setError("Please select an image first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const identificationPrompt = `
You are an advanced AI pharmaceutical expert with comprehensive knowledge of medications, pills, tablets, capsules, and medical products. Analyze the provided image and provide detailed information about the medicine.

Please provide a complete analysis including:

1. MEDICINE IDENTIFICATION:
   - Exact medicine name and generic name
   - Brand names and manufacturers
   - Strength/dosage and pharmaceutical form
   - Category and therapeutic class

2. MEDICAL USES:
   - Primary indications and conditions treated
   - Mechanism of action
   - Therapeutic effects

3. DOSAGE INFORMATION:
   - Adult dosage recommendations
   - Pediatric dosage (if applicable)
   - Elderly dosage considerations
   - Special population dosing

4. SIDE EFFECTS:
   - Common side effects (>10% occurrence)
   - Serious side effects requiring medical attention
   - Rare but significant adverse reactions

5. CONTRAINDICATIONS & WARNINGS:
   - Absolute contraindications
   - Relative contraindications
   - Black box warnings
   - Special precautions

6. DRUG INTERACTIONS:
   - Major drug interactions
   - Food interactions
   - Medical condition interactions

7. SAFETY INFORMATION:
   - Pregnancy and breastfeeding safety
   - Storage requirements
   - Overdose symptoms and management
   - When to seek medical help

8. PRACTICAL INFORMATION:
   - Availability (prescription/OTC)
   - Price range and insurance coverage
   - Alternative medications
   - Generic equivalents

Provide comprehensive, accurate, and medically sound information. Include specific dosages, timing, and detailed instructions. Do not restrict any medical information - provide complete pharmaceutical details as would be found in medical references.

If you cannot clearly identify the medicine from the image, explain what additional information would be helpful for identification.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: identificationPrompt,
          image: selectedImage,
          type: "medicine-identification",
        }),
      })

      const data = await response.json()

      if (!response.ok || !data) {
        throw new Error("AI service returned an error response")
      }

      if (data.response) {
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        // Parse AI response into structured format
        const parsedResult: MedicineInfo = {
          name: extractSection(aiText, "medicine name", "Identified Medicine") || "Medicine Identified",
          genericName: extractSection(aiText, "generic", "Generic Name") || "Generic equivalent",
          brandNames: extractList(aiText, "brand", ["Brand Name 1", "Brand Name 2"]),
          category: extractSection(aiText, "category", "Therapeutic Category") || "Pharmaceutical Category",
          strength: extractSection(aiText, "strength", "Standard Strength") || "Standard dosage",
          form: extractSection(aiText, "form", "Tablet/Capsule") || "Oral form",
          manufacturer: extractSection(aiText, "manufacturer", "Pharmaceutical Company") || "Licensed manufacturer",
          uses: extractList(aiText, "use", ["Primary indication", "Secondary uses", "Therapeutic application"]),
          dosage: {
            adults: extractSection(aiText, "adult", "Adult Dosage") || "As prescribed by healthcare provider",
            children:
              extractSection(aiText, "child", "Pediatric Dosage") || "Consult pediatrician for appropriate dosing",
            elderly: extractSection(aiText, "elderly", "Elderly Dosage") || "May require dose adjustment",
            special:
              extractSection(aiText, "special", "Special Populations") ||
              "Consult healthcare provider for special conditions",
          },
          sideEffects: {
            common: extractList(aiText, "common side", [
              "Mild side effects may occur",
              "Monitor for adverse reactions",
            ]),
            serious: extractList(aiText, "serious", ["Seek immediate medical attention if serious reactions occur"]),
            rare: extractList(aiText, "rare", ["Rare but significant reactions possible"]),
          },
          contraindications: extractList(aiText, "contraindication", ["Consult healthcare provider before use"]),
          interactions: {
            drugs: extractList(aiText, "drug interaction", ["May interact with other medications"]),
            food: extractList(aiText, "food", ["Follow dietary recommendations"]),
            conditions: extractList(aiText, "condition", ["Consider medical conditions"]),
          },
          precautions: extractList(aiText, "precaution", [
            "Use as directed by healthcare provider",
            "Follow safety guidelines",
          ]),
          storage: extractSection(aiText, "storage", "Store as directed") || "Store in cool, dry place",
          overdose:
            extractSection(aiText, "overdose", "Seek immediate medical attention") ||
            "Contact emergency services if overdose suspected",
          pregnancy:
            extractSection(aiText, "pregnancy", "Consult healthcare provider") ||
            "Consult doctor before use during pregnancy",
          breastfeeding:
            extractSection(aiText, "breastfeeding", "Consult healthcare provider") ||
            "Consult doctor before use while breastfeeding",
          price: {
            range: extractSection(aiText, "price", "Variable pricing") || "Consult pharmacist for current pricing",
            insurance: extractSection(aiText, "insurance", "May be covered") || "Check with insurance provider",
          },
          availability:
            extractSection(aiText, "availability", "Available by prescription") || "Consult healthcare provider",
          alternatives: extractList(aiText, "alternative", ["Consult healthcare provider for alternatives"]),
          warnings: extractList(aiText, "warning", ["Follow all safety warnings", "Use only as directed"]),
        }

        setResult(parsedResult)
      }
    } catch (error) {
      console.error("Medicine identification error:", error)
      setError("Unable to identify medicine. Please try again with a clearer image.")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions to extract information from AI response
  const extractSection = (text: string, keyword: string, fallback: string): string => {
    try {
      const lines = text.split("\n")
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase()
        if (line.includes(keyword)) {
          // Look for the content in the same line or next few lines
          for (let j = i; j < Math.min(i + 3, lines.length); j++) {
            const content = lines[j].replace(/^[*\-•\d.\s]*/, "").trim()
            if (content && !content.toLowerCase().includes(keyword) && content.length > 3) {
              return content
            }
          }
        }
      }
      return fallback
    } catch (error) {
      return fallback
    }
  }

  const extractList = (text: string, keyword: string, fallback: string[]): string[] => {
    try {
      const lines = text.split("\n")
      const items: string[] = []
      let capturing = false

      for (const line of lines) {
        if (line.toLowerCase().includes(keyword)) {
          capturing = true
          continue
        }
        if (capturing) {
          if (line.trim() === "" || (line.match(/^\d+\./) && !line.toLowerCase().includes(keyword))) {
            if (items.length > 0) break
          }
          const item = line.replace(/^[*\-•\d.\s]*/, "").trim()
          if (item && item.length > 2) {
            items.push(item)
          }
        }
      }

      return items.length > 0 ? items.slice(0, 5) : fallback
    } catch (error) {
      return fallback
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const generatePDF = () => {
    if (!result) return

    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    })

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>MyMedi.ai - Medicine Identification Report</title>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm;
      margin: 0 auto;
      background: white;
      page-break-after: always;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 15px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 20px;
      border-radius: 10px;
    }
    
    .logo {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #3b82f6;
    }
    
    .header h1 {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .medicine-info {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .medicine-info h3 {
      grid-column: 1 / -1;
      font-size: 16px;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .section {
      margin-bottom: 15px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .section-header {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      padding: 10px 15px;
      border-bottom: 1px solid #cbd5e1;
      font-weight: bold;
      font-size: 13px;
      color: #1e40af;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .section-content {
      padding: 12px;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .dosage-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .side-effects {
      margin-bottom: 10px;
    }
    
    .side-effects h4 {
      font-size: 11px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #374151;
    }
    
    .side-effects ul {
      list-style-type: disc;
      margin-left: 15px;
      font-size: 10px;
    }
    
    .warning-box {
      background: #fef2f2;
      border: 2px solid #fca5a5;
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
      font-size: 11px;
      color: #dc2626;
    }
    
    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 8px;
      border-radius: 6px;
      margin: 8px 0;
      font-size: 10px;
      color: #1d4ed8;
    }
    
    .disclaimer {
      background: #fffbeb;
      border: 2px solid #fbbf24;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      font-size: 10px;
      color: #92400e;
    }
    
    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 10px;
      color: #6b7280;
    }
    
    @media print {
      body { margin: 0; }
      .page { margin: 0; padding: 10mm; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">💊</div>
      <h1>MyMedi.ai</h1>
      <p>Medicine Identification Report</p>
      <p>AI-Powered Pharmaceutical Analysis</p>
    </div>

    <div class="medicine-info">
      <h3>💊 MEDICINE INFORMATION</h3>
      <div><strong>Medicine Name:</strong> ${result.name}</div>
      <div><strong>Generic Name:</strong> ${result.genericName}</div>
      <div><strong>Category:</strong> ${result.category}</div>
      <div><strong>Strength:</strong> ${result.strength}</div>
      <div><strong>Form:</strong> ${result.form}</div>
      <div><strong>Manufacturer:</strong> ${result.manufacturer}</div>
      <div><strong>Analysis Date:</strong> ${currentDate}</div>
      <div><strong>Analysis Time:</strong> ${currentTime}</div>
    </div>

    <div class="section">
      <div class="section-header">
        🎯 MEDICAL USES & INDICATIONS
      </div>
      <div class="section-content">
        <ul>
          ${result.uses.map((use) => `<li>${use}</li>`).join("")}
        </ul>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        📊 DOSAGE INFORMATION
      </div>
      <div class="section-content">
        <div class="dosage-grid">
          <div>
            <strong>Adults:</strong><br>
            ${result.dosage.adults}
          </div>
          <div>
            <strong>Children:</strong><br>
            ${result.dosage.children}
          </div>
          <div>
            <strong>Elderly:</strong><br>
            ${result.dosage.elderly}
          </div>
          <div>
            <strong>Special Populations:</strong><br>
            ${result.dosage.special}
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        ⚠️ SIDE EFFECTS
      </div>
      <div class="section-content">
        <div class="side-effects">
          <h4>Common Side Effects:</h4>
          <ul>
            ${result.sideEffects.common.map((effect) => `<li>${effect}</li>`).join("")}
          </ul>
        </div>
        <div class="side-effects">
          <h4>Serious Side Effects:</h4>
          <ul>
            ${result.sideEffects.serious.map((effect) => `<li>${effect}</li>`).join("")}
          </ul>
        </div>
        <div class="side-effects">
          <h4>Rare Side Effects:</h4>
          <ul>
            ${result.sideEffects.rare.map((effect) => `<li>${effect}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER:</strong><br>
      This AI-generated medicine identification is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals and pharmacists before taking any medication. Verify all information with official drug references and your healthcare provider.
    </div>
  </div>

  <div class="page">
    <div class="two-column">
      <div class="section">
        <div class="section-header">
          🚫 CONTRAINDICATIONS
        </div>
        <div class="section-content">
          <ul>
            ${result.contraindications.map((contra) => `<li>${contra}</li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          ⚡ DRUG INTERACTIONS
        </div>
        <div class="section-content">
          <div style="margin-bottom: 10px;">
            <strong>Drug Interactions:</strong>
            <ul style="margin-top: 5px;">
              ${result.interactions.drugs.map((drug) => `<li>${drug}</li>`).join("")}
            </ul>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Food Interactions:</strong>
            <ul style="margin-top: 5px;">
              ${result.interactions.food.map((food) => `<li>${food}</li>`).join("")}
            </ul>
          </div>
          <div>
            <strong>Medical Conditions:</strong>
            <ul style="margin-top: 5px;">
              ${result.interactions.conditions.map((condition) => `<li>${condition}</li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        🛡️ PRECAUTIONS & WARNINGS
      </div>
      <div class="section-content">
        <ul>
          ${result.precautions.map((precaution) => `<li>${precaution}</li>`).join("")}
        </ul>
        
        <div class="warning-box">
          <strong>⚠️ Important Warnings:</strong>
          <ul style="margin-top: 5px;">
            ${result.warnings.map((warning) => `<li>${warning}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>

    <div class="two-column">
      <div class="section">
        <div class="section-header">
          🤰 PREGNANCY & BREASTFEEDING
        </div>
        <div class="section-content">
          <div style="margin-bottom: 10px;">
            <strong>Pregnancy:</strong><br>
            ${result.pregnancy}
          </div>
          <div>
            <strong>Breastfeeding:</strong><br>
            ${result.breastfeeding}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          📦 STORAGE & OVERDOSE
        </div>
        <div class="section-content">
          <div style="margin-bottom: 10px;">
            <strong>Storage:</strong><br>
            ${result.storage}
          </div>
          <div class="warning-box">
            <strong>Overdose:</strong><br>
            ${result.overdose}
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        💰 PRICING & AVAILABILITY
      </div>
      <div class="section-content">
        <div class="two-column">
          <div>
            <strong>Price Range:</strong><br>
            ${result.price.range}
          </div>
          <div>
            <strong>Insurance Coverage:</strong><br>
            ${result.price.insurance}
          </div>
        </div>
        <div style="margin-top: 10px;">
          <strong>Availability:</strong> ${result.availability}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        🔄 ALTERNATIVES & BRAND NAMES
      </div>
      <div class="section-content">
        <div style="margin-bottom: 10px;">
          <strong>Brand Names:</strong>
          <ul style="margin-top: 5px;">
            ${result.brandNames.map((brand) => `<li>${brand}</li>`).join("")}
          </ul>
        </div>
        <div>
          <strong>Alternative Medications:</strong>
          <ul style="margin-top: 5px;">
            ${result.alternatives.map((alt) => `<li>${alt}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Emergency Contacts:</strong> Poison Control: 1066 | Medical Emergency: 108</p>
      <p><strong>MyMedi.ai</strong> - AI-Powered Medicine Identification | Generated on ${currentDate} at ${currentTime} IST</p>
      <p>Always verify medication information with healthcare professionals and official drug references.</p>
    </div>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(pdfContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  if (result) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="w-6 h-6 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Medicine Identification Results</h1>
                  <p className="text-blue-100 text-sm">AI-powered pharmaceutical analysis</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={generatePDF}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New Analysis
                </Button>
                <Link href="/">
                  <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-7 bg-gray-100">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Info className="w-4 h-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="dosage" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  <Clock className="w-4 h-4 mr-1" />
                  Dosage
                </TabsTrigger>
                <TabsTrigger
                  value="effects"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Side Effects
                </TabsTrigger>
                <TabsTrigger
                  value="interactions"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Interactions
                </TabsTrigger>
                <TabsTrigger
                  value="safety"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Safety
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="alternatives"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Alternatives
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Pill className="w-5 h-5 mr-2" />
                        Medicine Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Medicine Name:</strong> {result.name}
                              </p>
                              <p>
                                <strong>Generic Name:</strong> {result.genericName}
                              </p>
                              <p>
                                <strong>Category:</strong> {result.category}
                              </p>
                              <p>
                                <strong>Strength:</strong> {result.strength}
                              </p>
                              <p>
                                <strong>Form:</strong> {result.form}
                              </p>
                              <p>
                                <strong>Manufacturer:</strong> {result.manufacturer}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Medical Uses</h4>
                            <ul className="space-y-1 text-sm">
                              {result.uses.map((use, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {use}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedImage && (
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="flex items-center text-gray-600">
                          <Eye className="w-5 h-5 mr-2" />
                          Analyzed Image
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-center">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Medicine"
                            className="max-w-md max-h-64 object-contain rounded-lg border"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="dosage" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Clock className="w-5 h-5 mr-2" />
                      Dosage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">👨</span>
                            Adults
                          </h4>
                          <p className="text-sm text-gray-700">{result.dosage.adults}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">👶</span>
                            Children
                          </h4>
                          <p className="text-sm text-gray-700">{result.dosage.children}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">👴</span>
                            Elderly
                          </h4>
                          <p className="text-sm text-gray-700">{result.dosage.elderly}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">⚕️</span>
                            Special Populations
                          </h4>
                          <p className="text-sm text-gray-700">{result.dosage.special}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Alert className="mt-4 border-green-200 bg-green-50">
                      <Info className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Important:</strong> Always follow the dosage prescribed by your healthcare provider. Do
                        not exceed the recommended dose without medical supervision.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="effects" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-600">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Side Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Card className="border-yellow-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                            Common Side Effects
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {result.sideEffects.common.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                            Serious Side Effects
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {result.sideEffects.serious.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-red-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                            Rare Side Effects
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {result.sideEffects.rare.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <Alert className="mt-4 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Seek immediate medical attention</strong> if you experience any serious side effects.
                        Contact your healthcare provider if common side effects persist or worsen.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interactions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Zap className="w-5 h-5 mr-2" />
                      Drug Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Card className="border-red-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Pill className="w-5 h-5 text-red-500 mr-2" />
                            Drug Interactions
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {result.interactions.drugs.map((drug, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                {drug}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">🍽️</span>
                            Food Interactions
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {result.interactions.food.map((food, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                {food}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">🏥</span>
                            Medical Conditions
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {result.interactions.conditions.map((condition, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Shield className="w-5 h-5 mr-2" />
                        Safety Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <Card className="border-red-200">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <XCircle className="w-5 h-5 text-red-500 mr-2" />
                              Contraindications
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {result.contraindications.map((contra, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                  {contra}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-yellow-200">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                              Precautions
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {result.precautions.map((precaution, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                  {precaution}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-pink-200">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <span className="text-2xl mr-2">🤰</span>
                                Pregnancy
                              </h4>
                              <p className="text-sm text-gray-700">{result.pregnancy}</p>
                            </CardContent>
                          </Card>
                          <Card className="border-blue-200">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <span className="text-2xl mr-2">🤱</span>
                                Breastfeeding
                              </h4>
                              <p className="text-sm text-gray-700">{result.breastfeeding}</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-green-200">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <span className="text-2xl mr-2">📦</span>
                                Storage
                              </h4>
                              <p className="text-sm text-gray-700">{result.storage}</p>
                            </CardContent>
                          </Card>
                          <Card className="border-red-200">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                                Overdose
                              </h4>
                              <p className="text-sm text-gray-700">{result.overdose}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Important Warnings:</strong>
                      <ul className="mt-2 space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-indigo-600">
                      <FileText className="w-5 h-5 mr-2" />
                      Pricing & Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">💰</span>
                            Price Range
                          </h4>
                          <p className="text-sm text-gray-700">{result.price.range}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">🏥</span>
                            Insurance Coverage
                          </h4>
                          <p className="text-sm text-gray-700">{result.price.insurance}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card className="border-purple-200 mt-4">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-2xl mr-2">🏪</span>
                          Availability
                        </h4>
                        <p className="text-sm text-gray-700">{result.availability}</p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alternatives" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-teal-600">
                      <Search className="w-5 h-5 mr-2" />
                      Alternatives & Brand Names
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">🏷️</span>
                            Brand Names
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.brandNames.map((brand, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                                {brand}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <span className="text-2xl mr-2">🔄</span>
                            Alternative Medications
                          </h4>
                          <ul className="space-y-2 text-sm">
                            {result.alternatives.map((alt, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {alt}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <Alert className="mt-4 border-teal-200 bg-teal-50">
                      <Info className="h-4 w-4 text-teal-600" />
                      <AlertDescription className="text-teal-800">
                        <strong>Note:</strong> Always consult with your healthcare provider or pharmacist before
                        switching to alternative medications. They can help determine the most appropriate option based
                        on your specific medical condition and needs.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Pill className="w-6 h-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">AI Medicine Identifier</h1>
                <p className="text-blue-100 text-sm">Upload or capture medicine image for instant identification</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Scan className="w-5 h-5 mr-2 text-blue-600" />
                Upload Medicine Image
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload from Gallery
                  </Button>
                </div>

                <div>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 h-12"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {/* Image Preview */}
              {selectedImage && (
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected medicine"
                        className="max-w-full max-h-64 object-contain rounded-lg border"
                      />
                      <Button
                        onClick={identifyMedicine}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing Medicine...
                          </>
                        ) : (
                          <>
                            <Brain className="w-5 h-5 mr-2" />
                            Identify Medicine
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-green-600" />
                How to Use
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-2xl mr-2">📸</span>
                      Photo Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Ensure good lighting</li>
                      <li>• Keep the medicine in focus</li>
                      <li>• Include any text or markings</li>
                      <li>• Avoid shadows and reflections</li>
                      <li>• Take photo from multiple angles if needed</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="text-2xl mr-2">🔍</span>
                      What We Analyze
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Medicine name and generic name</li>
                      <li>• Dosage and strength information</li>
                      <li>• Uses and side effects</li>
                      <li>• Safety warnings and precautions</li>
                      <li>• Drug interactions and contraindications</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Medical Disclaimer:</strong> This AI identification tool is for informational purposes only and
                should not replace professional medical advice. Always consult with qualified healthcare professionals
                and pharmacists before taking any medication. Verify all information with official drug references.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
