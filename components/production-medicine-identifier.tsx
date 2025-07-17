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
  Eye,
  Scan,
  Target,
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
  mechanismOfAction: string
  pharmacokinetics: string
  clinicalStudies: string
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
      const comprehensiveMedicineAnalysisPrompt = `
You are Dr. PharmAI, a world-renowned pharmaceutical expert with 25+ years of experience in clinical pharmacology, drug identification, and medication safety. You have access to comprehensive drug databases, clinical studies, and the latest pharmaceutical research.

MEDICINE IMAGE ANALYSIS TASK:
============================
Analyze the provided medicine image with extreme precision and provide a complete pharmaceutical profile. Use your expertise to identify every detail visible in the image including:

- Pill/tablet shape, size, color, and markings
- Imprinted numbers, letters, or symbols
- Scoring lines or special features
- Packaging information if visible
- Brand markings or manufacturer codes

COMPREHENSIVE PHARMACEUTICAL ANALYSIS REQUIRED:
==============================================

1. PRECISE MEDICINE IDENTIFICATION:
   - Exact medicine name (brand and generic)
   - Complete list of brand names and manufacturers
   - Pharmaceutical category and therapeutic class
   - Exact strength/dosage and pharmaceutical form
   - Active ingredient(s) with chemical names
   - Mechanism of action at molecular level

2. DETAILED CLINICAL INFORMATION:
   - Primary and secondary medical indications
   - Complete dosage guidelines for all age groups
   - Pharmacokinetics (absorption, distribution, metabolism, excretion)
   - Clinical efficacy data and study results
   - Onset of action and duration of effect

3. COMPREHENSIVE SAFETY PROFILE:
   - Complete side effect profile with frequencies
   - Serious adverse reactions and black box warnings
   - Drug interactions (major, moderate, minor)
   - Food and alcohol interactions
   - Contraindications and precautions

4. DETAILED USAGE INSTRUCTIONS:
   - Exact dosing for adults, children, elderly
   - Special population dosing (pregnancy, kidney/liver disease)
   - Administration instructions and timing
   - What to do if dose is missed
   - Duration of treatment recommendations

5. SAFETY AND STORAGE INFORMATION:
   - Proper storage conditions and temperature
   - Shelf life and expiration considerations
   - Signs of medication deterioration
   - Overdose symptoms and emergency management
   - When to seek immediate medical attention

6. MARKET AND AVAILABILITY DATA:
   - Current market availability (prescription/OTC)
   - Price ranges in Indian market (₹)
   - Insurance coverage information
   - Generic alternatives and bioequivalence
   - Where to purchase and pharmacy availability

7. PREGNANCY AND SPECIAL POPULATIONS:
   - FDA pregnancy category and safety data
   - Breastfeeding safety and recommendations
   - Pediatric and geriatric considerations
   - Renal and hepatic impairment dosing

8. ALTERNATIVE MEDICATIONS:
   - Therapeutic alternatives in same class
   - Generic equivalents and brand options
   - Natural/herbal alternatives if applicable
   - Cost-effective alternatives

ANALYSIS REQUIREMENTS:
=====================
- Provide specific, accurate, and detailed information
- Include exact dosages, frequencies, and durations
- Cite clinical evidence where relevant
- Consider Indian pharmaceutical market context
- Include both immediate and long-term considerations
- Provide actionable medical guidance
- Include emergency information and warning signs

IMPORTANT INSTRUCTIONS:
======================
- Be extremely thorough and precise in identification
- Provide complete pharmaceutical information as found in medical references
- Include specific brand names, manufacturers, and market data
- Give detailed safety warnings and precautions
- Provide comprehensive drug interaction information
- Include exact pricing and availability data for India
- Consider cultural and dietary factors relevant to Indian patients
- Provide both English and common Hindi/regional names if applicable

If you cannot clearly identify the medicine from the image, explain what specific features you can observe and what additional information would help with identification. Provide general safety advice about unidentified medications.

Do not provide generic responses. Give specific, detailed, professional pharmaceutical analysis as if you were providing information for a medical professional or informed patient.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: comprehensiveMedicineAnalysisPrompt,
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

        // Enhanced parsing with comprehensive extraction
        const parsedResult: MedicineInfo = {
          name: extractDetailedSection(aiText, "medicine name", "Identified Medicine") || "Medicine Identified",
          genericName: extractDetailedSection(aiText, "generic", "Generic Name") || "Generic equivalent",
          brandNames: extractDetailedList(aiText, "brand", ["Brand Name 1", "Brand Name 2", "Brand Name 3"]),
          category: extractDetailedSection(aiText, "category", "Therapeutic Category") || "Pharmaceutical Category",
          strength: extractDetailedSection(aiText, "strength", "Standard Strength") || "Standard dosage",
          form: extractDetailedSection(aiText, "form", "Tablet/Capsule") || "Oral form",
          manufacturer:
            extractDetailedSection(aiText, "manufacturer", "Pharmaceutical Company") || "Licensed manufacturer",
          uses: extractDetailedList(aiText, "use", ["Primary indication", "Secondary uses", "Therapeutic application"]),
          dosage: {
            adults: extractDetailedSection(aiText, "adult", "Adult Dosage") || "As prescribed by healthcare provider",
            children:
              extractDetailedSection(aiText, "child", "Pediatric Dosage") ||
              "Consult pediatrician for appropriate dosing",
            elderly: extractDetailedSection(aiText, "elderly", "Elderly Dosage") || "May require dose adjustment",
            special:
              extractDetailedSection(aiText, "special", "Special Populations") ||
              "Consult healthcare provider for special conditions",
          },
          sideEffects: {
            common: extractDetailedList(aiText, "common side", [
              "Mild side effects may occur",
              "Monitor for adverse reactions",
            ]),
            serious: extractDetailedList(aiText, "serious", [
              "Seek immediate medical attention if serious reactions occur",
            ]),
            rare: extractDetailedList(aiText, "rare", ["Rare but significant reactions possible"]),
          },
          contraindications: extractDetailedList(aiText, "contraindication", [
            "Consult healthcare provider before use",
          ]),
          interactions: {
            drugs: extractDetailedList(aiText, "drug interaction", ["May interact with other medications"]),
            food: extractDetailedList(aiText, "food", ["Follow dietary recommendations"]),
            conditions: extractDetailedList(aiText, "condition", ["Consider medical conditions"]),
          },
          precautions: extractDetailedList(aiText, "precaution", [
            "Use as directed by healthcare provider",
            "Follow safety guidelines",
          ]),
          storage: extractDetailedSection(aiText, "storage", "Store as directed") || "Store in cool, dry place",
          overdose:
            extractDetailedSection(aiText, "overdose", "Seek immediate medical attention") ||
            "Contact emergency services if overdose suspected",
          pregnancy:
            extractDetailedSection(aiText, "pregnancy", "Consult healthcare provider") ||
            "Consult doctor before use during pregnancy",
          breastfeeding:
            extractDetailedSection(aiText, "breastfeeding", "Consult healthcare provider") ||
            "Consult doctor before use while breastfeeding",
          price: {
            range:
              extractDetailedSection(aiText, "price", "Variable pricing") || "Consult pharmacist for current pricing",
            insurance: extractDetailedSection(aiText, "insurance", "May be covered") || "Check with insurance provider",
          },
          availability:
            extractDetailedSection(aiText, "availability", "Available by prescription") ||
            "Consult healthcare provider",
          alternatives: extractDetailedList(aiText, "alternative", ["Consult healthcare provider for alternatives"]),
          warnings: extractDetailedList(aiText, "warning", ["Follow all safety warnings", "Use only as directed"]),
          mechanismOfAction:
            extractDetailedSection(aiText, "mechanism", "Mechanism of action") ||
            "Consult healthcare provider for detailed mechanism",
          pharmacokinetics:
            extractDetailedSection(aiText, "pharmacokinetic", "Pharmacokinetic profile") ||
            "Standard pharmacokinetic profile",
          clinicalStudies:
            extractDetailedSection(aiText, "clinical", "Clinical study data") || "Refer to clinical literature",
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

  // Enhanced helper functions for better extraction
  const extractDetailedSection = (text: string, keyword: string, fallback: string): string => {
    try {
      const lines = text.split("\n")
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase()
        if (line.includes(keyword)) {
          // Look for content in the same line or next few lines
          for (let j = i; j < Math.min(i + 5, lines.length); j++) {
            const content = lines[j].replace(/^[*\-•\d.\s]*/, "").trim()
            if (content && !content.toLowerCase().includes(keyword) && content.length > 5) {
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

  const extractDetailedList = (text: string, keyword: string, fallback: string[]): string[] => {
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
          if (item && item.length > 3) {
            items.push(item)
          }
        }
      }

      return items.length > 0 ? items.slice(0, 8) : fallback
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
      page-break-inside: avoid;
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
    
    @media screen and (max-width: 768px) {
      .page { width: 100%; padding: 10px; }
      .two-column { grid-template-columns: 1fr; }
      .medicine-info { grid-template-columns: 1fr; }
      .dosage-grid { grid-template-columns: 1fr; }
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
        🧬 MECHANISM OF ACTION
      </div>
      <div class="section-content">
        <p>${result.mechanismOfAction}</p>
        <div class="info-box">
          <strong>Pharmacokinetics:</strong> ${result.pharmacokinetics}
        </div>
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

    <div class="disclaimer">
      <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER:</strong><br>
      This AI-generated medicine identification is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals and pharmacists before taking any medication. Verify all information with official drug references and your healthcare provider.
    </div>
  </div>

  <div class="page">
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
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
        <Card className="border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Medicine Identification Results</h1>
                  <p className="text-blue-100 text-xs sm:text-sm">AI-powered pharmaceutical analysis</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={generatePDF}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  PDF
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  New
                </Button>
                <Link href="/">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                  >
                    <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Home
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 lg:p-6">
            {/* Medicine Overview */}
            <Card className="mb-4 sm:mb-6 border-blue-200">
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <strong className="text-blue-600">Medicine Name:</strong>
                    <p className="font-semibold text-gray-900">{result.name}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Generic Name:</strong>
                    <p className="text-gray-700">{result.genericName}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Category:</strong>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">{result.category}</Badge>
                  </div>
                  <div>
                    <strong className="text-blue-600">Strength:</strong>
                    <p className="text-gray-700">{result.strength}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Form:</strong>
                    <p className="text-gray-700">{result.form}</p>
                  </div>
                  <div>
                    <strong className="text-blue-600">Manufacturer:</strong>
                    <p className="text-gray-700">{result.manufacturer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="uses" className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-gray-100 h-auto p-1">
                <TabsTrigger
                  value="uses"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Uses</span>
                  <span className="sm:hidden">Uses</span>
                </TabsTrigger>
                <TabsTrigger
                  value="dosage"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Dosage</span>
                  <span className="sm:hidden">Dose</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sideeffects"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Side Effects</span>
                  <span className="sm:hidden">Effects</span>
                </TabsTrigger>
                <TabsTrigger
                  value="interactions"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Interactions</span>
                  <span className="sm:hidden">Inter</span>
                </TabsTrigger>
                <TabsTrigger
                  value="safety"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Safety</span>
                  <span className="sm:hidden">Safe</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Pricing</span>
                  <span className="sm:hidden">Price</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="uses" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-green-600 text-base sm:text-lg">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Medical Uses & Indications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Primary Uses:</h4>
                        <ul className="space-y-1 text-xs sm:text-sm">
                          {result.uses.map((use, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{use}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Mechanism of Action:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                          {result.mechanismOfAction}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Pharmacokinetics:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {result.pharmacokinetics}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dosage" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-blue-600 text-base sm:text-lg">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Dosage Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <Card className="border-blue-200">
                        <CardContent className="p-3 sm:p-4">
                          <h4 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">Adults</h4>
                          <p className="text-xs sm:text-sm text-gray-700">{result.dosage.adults}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-green-200">
                        <CardContent className="p-3 sm:p-4">
                          <h4 className="font-semibold text-green-600 mb-2 text-sm sm:text-base">Children</h4>
                          <p className="text-xs sm:text-sm text-gray-700">{result.dosage.children}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-orange-200">
                        <CardContent className="p-3 sm:p-4">
                          <h4 className="font-semibold text-orange-600 mb-2 text-sm sm:text-base">Elderly</h4>
                          <p className="text-xs sm:text-sm text-gray-700">{result.dosage.elderly}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-purple-200">
                        <CardContent className="p-3 sm:p-4">
                          <h4 className="font-semibold text-purple-600 mb-2 text-sm sm:text-base">
                            Special Populations
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-700">{result.dosage.special}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Alert className="mt-4 border-blue-200 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 text-xs sm:text-sm">
                        <strong>Important:</strong> Always follow the dosage prescribed by your healthcare provider. Do
                        not exceed the recommended dose without medical supervision.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sideeffects" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Side Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h4 className="font-semibold text-yellow-600 mb-3 text-sm sm:text-base flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          Common Side Effects
                        </h4>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.sideEffects.common.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                <span>{effect}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-600 mb-3 text-sm sm:text-base flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Serious Side Effects
                        </h4>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.sideEffects.serious.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{effect}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3 text-sm sm:text-base flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Rare Side Effects
                        </h4>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.sideEffects.rare.map((effect, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                                <span>{effect}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-xs sm:text-sm">
                          <strong>Emergency Warning:</strong> Seek immediate medical attention if you experience any
                          serious side effects. Contact emergency services (108) or your healthcare provider
                          immediately.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interactions" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-orange-600 text-base sm:text-lg">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Drug Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h4 className="font-semibold text-red-600 mb-3 text-sm sm:text-base">Drug Interactions</h4>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.interactions.drugs.map((drug, index) => (
                              <li key={index} className="flex items-start">
                                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{drug}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-600 mb-3 text-sm sm:text-base">Food Interactions</h4>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.interactions.food.map((food, index) => (
                              <li key={index} className="flex items-start">
                                <Info className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{food}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-600 mb-3 text-sm sm:text-base">Medical Conditions</h4>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.interactions.conditions.map((condition, index) => (
                              <li key={index} className="flex items-start">
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{condition}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-purple-600 text-base sm:text-lg">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Safety Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h4 className="font-semibold text-red-600 mb-3 text-sm sm:text-base">Contraindications</h4>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.contraindications.map((contra, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{contra}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="border-pink-200">
                          <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-pink-600 mb-2 text-sm sm:text-base">Pregnancy</h4>
                            <p className="text-xs sm:text-sm text-gray-700">{result.pregnancy}</p>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200">
                          <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">Breastfeeding</h4>
                            <p className="text-xs sm:text-sm text-gray-700">{result.breastfeeding}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Storage Instructions</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-700">{result.storage}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-red-600 mb-3 text-sm sm:text-base">Overdose Information</h4>
                        <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                          <p className="text-xs sm:text-sm text-red-800">{result.overdose}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-teal-600 text-base sm:text-lg">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Pricing & Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="border-green-200">
                          <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-green-600 mb-2 text-sm sm:text-base">Price Range</h4>
                            <p className="text-xs sm:text-sm text-gray-700">{result.price.range}</p>
                          </CardContent>
                        </Card>
                        <Card className="border-blue-200">
                          <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">
                              Insurance Coverage
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-700">{result.price.insurance}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Availability</h4>
                        <div className="bg-teal-50 p-3 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-700">{result.availability}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Brand Names</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.brandNames.map((brand, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {brand}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                          Alternative Medications
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {result.alternatives.map((alt, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{alt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
      <Card className="border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <Pill className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">AI Medicine Identifier</h1>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Upload or capture medicine image for instant identification
                </p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Home
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Upload Medicine Image
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 sm:h-14 text-sm sm:text-base"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
                    id="camera-upload"
                  />
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 h-12 sm:h-14 text-sm sm:text-base"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {selectedImage && (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected medicine"
                      className="w-full max-w-md mx-auto rounded-lg border-2 border-blue-200 shadow-lg"
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={identifyMedicine}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Analyzing Medicine...
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Identify Medicine
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base flex items-center">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Tips for Best Results
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ensure good lighting and clear focus</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Include any visible text, numbers, or markings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Capture both sides if markings are on both</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Include packaging if available</span>
                </li>
              </ul>
            </div>

            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-xs sm:text-sm">
                <strong>Important Medical Disclaimer:</strong> This AI medicine identification tool is for informational
                purposes only and should not replace professional medical advice. Always consult with qualified
                healthcare professionals and pharmacists before taking any medication. Verify all information with
                official drug references and your healthcare provider.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
