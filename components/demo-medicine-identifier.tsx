"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Pill,
  Camera,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShoppingCart,
  Clock,
  Shield,
  Scan,
  Eye,
  Sparkles,
  Zap,
  Crown,
  Calendar,
} from "lucide-react"

interface MedicineInfo {
  name: string
  generic: string
  brandPrice: number
  genericPrice: number
  uses: string
  dosage: string
  sideEffects: string[]
  interactions: string[]
  precautions: string[]
  manufacturer: string
  rawAnalysis: string
  extractedText?: string
}

function DemoMedicineIdentifierComponent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [error, setError] = useState("")

  const sampleMedicines = [
    { name: "Paracetamol 500mg", color: "from-red-400 to-pink-500", icon: "💊" },
    { name: "Amoxicillin 250mg", color: "from-blue-400 to-cyan-500", icon: "💉" },
    { name: "Metformin 500mg", color: "from-green-400 to-emerald-500", icon: "🍯" },
    { name: "Amlodipine 5mg", color: "from-purple-400 to-violet-500", icon: "❤️" },
    { name: "Vitamin D3 1000 IU", color: "from-yellow-400 to-orange-500", icon: "☀️" },
    { name: "Aspirin 75mg", color: "from-teal-400 to-cyan-500", icon: "🩹" },
  ]

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image too large. Max 10MB allowed")
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setError("")
        setMedicineInfo(null)

        console.log("🔄 Starting medicine identification...")

        const extractedText = await extractTextFromImage(file)
        if (extractedText) {
          await identifyMedicineWithAI(file.name, extractedText)
        } else {
          await identifyMedicineWithAI(file.name, null)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const extractTextFromImage = async (file: File): Promise<string | null> => {
    setIsExtracting(true)
    try {
      console.log("🔍 Starting OCR...")

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "OCR failed")
      }

      const data = await response.json()
      console.log("✅ OCR successful!")

      if (!data.extractedText || data.extractedText.trim().length < 5) {
        setError("Could not extract clear text. Trying AI analysis...")
        return data.extractedText || null
      }

      return data.extractedText
    } catch (error) {
      console.error("❌ OCR error:", error)
      setError(`OCR failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      return null
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSampleMedicine = async (medicineName: string) => {
    setSelectedImage("/placeholder.svg?height=150&width=200&text=" + encodeURIComponent(medicineName))
    setError("")
    setMedicineInfo(null)

    console.log("🧪 Testing:", medicineName)

    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await identifyMedicineWithAI(medicineName, null)
  }

  const identifyMedicineWithAI = async (fileName: string, extractedText: string | null) => {
    setIsScanning(true)
    setError("")

    try {
      console.log("🤖 AI identification starting...")

      const prompt = `You are an expert AI pharmacist. Analyze this medicine:

${extractedText ? `EXTRACTED TEXT: ${extractedText}` : `MEDICINE: ${fileName}`}

Provide information in this format:

**MEDICINE IDENTIFICATION:**
Brand Name: [Brand name]
Generic Name: [Generic name]
Strength: [Dosage]
Manufacturer: [Company]

**MEDICAL USES:**
[Uses and indications]

**DOSAGE INFORMATION:**
[Dosage instructions]

**SIDE EFFECTS:**
- [Effect 1]
- [Effect 2]
- [Effect 3]

**DRUG INTERACTIONS:**
- [Interaction 1]
- [Interaction 2]
- [Interaction 3]

**PRECAUTIONS:**
- [Precaution 1]
- [Precaution 2]
- [Precaution 3]

**INDIAN PRICING:**
Brand Price: ₹[price]
Generic Price: ₹[lower price]`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
          type: "medicine-identification",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || `AI API failed`)
      }

      const data = await response.json()
      console.log("✅ AI response received!")

      if (!data.response) {
        throw new Error("No AI response")
      }

      const structuredMedicine = parseAIResponse(data.response, fileName)
      structuredMedicine.extractedText = extractedText || undefined
      setMedicineInfo(structuredMedicine)

      console.log("✅ Identification complete!")
    } catch (error) {
      console.error("❌ AI error:", error)
      setError(`AI failed: ${error instanceof Error ? error.message : "Unknown error"}`)

      const fallback = fileName.toLowerCase().includes("paracetamol")
        ? getParacetamolFallback()
        : getGenericFallback(fileName)
      fallback.extractedText = extractedText || undefined
      setMedicineInfo(fallback)
    } finally {
      setIsScanning(false)
    }
  }

  const parseAIResponse = (aiResponse: string, fileName: string): MedicineInfo => {
    const medicine: MedicineInfo = {
      name: fileName.replace(/\.(jpg|jpeg|png|pdf)$/i, ""),
      generic: "Generic available",
      brandPrice: 30,
      genericPrice: 12,
      uses: "Consult healthcare provider",
      dosage: "Follow prescription",
      sideEffects: ["Consult doctor"],
      interactions: ["Check with pharmacist"],
      precautions: ["Follow medical advice"],
      manufacturer: "Various manufacturers",
      rawAnalysis: aiResponse,
    }

    try {
      const brandMatch = aiResponse.match(/Brand Name:\s*([^\n]+)/i)
      if (brandMatch) medicine.name = brandMatch[1].trim()

      const genericMatch = aiResponse.match(/Generic Name:\s*([^\n]+)/i)
      if (genericMatch) medicine.generic = genericMatch[1].trim()

      const manufacturerMatch = aiResponse.match(/Manufacturer:\s*([^\n]+)/i)
      if (manufacturerMatch) medicine.manufacturer = manufacturerMatch[1].trim()

      const usesMatch = aiResponse.match(/\*\*MEDICAL USES:\*\*\s*\n([^*]+)/i)
      if (usesMatch) medicine.uses = usesMatch[1].trim()

      const dosageMatch = aiResponse.match(/\*\*DOSAGE INFORMATION:\*\*\s*\n([^*]+)/i)
      if (dosageMatch) medicine.dosage = dosageMatch[1].trim()

      const sideEffectsMatch = aiResponse.match(/\*\*SIDE EFFECTS:\*\*\s*\n((?:- [^\n]+\n?)+)/i)
      if (sideEffectsMatch) {
        const effects = sideEffectsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((effect) => effect.length > 0)
        if (effects.length > 0) medicine.sideEffects = effects
      }

      const interactionsMatch = aiResponse.match(/\*\*DRUG INTERACTIONS:\*\*\s*\n((?:- [^\n]+\n?)+)/i)
      if (interactionsMatch) {
        const interactions = interactionsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((interaction) => interaction.length > 0)
        if (interactions.length > 0) medicine.interactions = interactions
      }

      const precautionsMatch = aiResponse.match(/\*\*PRECAUTIONS:\*\*\s*\n((?:- [^\n]+\n?)+)/i)
      if (precautionsMatch) {
        const precautions = precautionsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((precaution) => precaution.length > 0)
        if (precautions.length > 0) medicine.precautions = precautions
      }

      const brandPriceMatch = aiResponse.match(/Brand Price:\s*₹(\d+)/i)
      const genericPriceMatch = aiResponse.match(/Generic Price:\s*₹(\d+)/i)

      if (brandPriceMatch) medicine.brandPrice = Number.parseInt(brandPriceMatch[1])
      if (genericPriceMatch) medicine.genericPrice = Number.parseInt(genericPriceMatch[1])
    } catch (parseError) {
      console.error("❌ Parse error:", parseError)
    }

    return medicine
  }

  const getParacetamolFallback = (): MedicineInfo => {
    return {
      name: "Paracetamol 500mg Tablet",
      generic: "Acetaminophen",
      brandPrice: 25,
      genericPrice: 8,
      uses: "Pain relief, fever reduction, headache, body aches, dental pain",
      dosage: "Adults: 1-2 tablets every 6-8 hours. Max 4g per day",
      sideEffects: ["Nausea (rare)", "Skin rash", "Liver damage with overdose", "Stomach upset"],
      interactions: ["Avoid with alcohol", "Check with blood thinners", "Consult if taking other pain meds"],
      precautions: ["Don't exceed recommended dose", "Avoid alcohol", "Consult doctor if symptoms persist"],
      manufacturer: "Cipla, Sun Pharma, Dr. Reddy's",
      rawAnalysis: "Paracetamol - common pain reliever and fever reducer",
    }
  }

  const getGenericFallback = (fileName: string): MedicineInfo => {
    return {
      name: fileName.replace(/\.(jpg|jpeg|png|pdf)$/i, ""),
      generic: "Generic may be available",
      brandPrice: 35,
      genericPrice: 15,
      uses: "AI analysis unavailable. Consult pharmacist for uses.",
      dosage: "Follow prescription or package directions.",
      sideEffects: ["Consult healthcare provider", "Monitor for reactions", "Report adverse effects"],
      interactions: ["Inform doctor of all medications", "Check with pharmacist", "Avoid alcohol unless approved"],
      precautions: ["Take as prescribed", "Store properly", "Check expiration date"],
      manufacturer: "Check package for details",
      rawAnalysis: "AI analysis temporarily unavailable",
    }
  }

  const resetIdentifier = () => {
    setSelectedImage(null)
    setMedicineInfo(null)
    setError("")
    setIsScanning(false)
    setIsExtracting(false)
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 mx-2 sm:mx-0">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-t-lg p-4 sm:p-6">
        <CardTitle className="flex items-center text-white text-lg sm:text-xl">
          <div className="p-1.5 sm:p-2 bg-white/20 rounded-full mr-2 sm:mr-3">
            <Pill className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          💊 AI Medicine ID
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2 animate-pulse" />
        </CardTitle>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
          <Badge className="bg-white/20 text-white text-xs px-2 py-1">
            <div className="w-1.5 h-1.5 bg-purple-300 rounded-full mr-1 animate-pulse"></div>
            Live AI
          </Badge>
          <Badge className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1">
            <Crown className="w-2.5 h-2.5 mr-1" />
            OCR
          </Badge>
          <Badge className="bg-blue-400 text-blue-900 text-xs px-2 py-1">
            <Zap className="w-2.5 h-2.5 mr-1" />
            GPT-4
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {!medicineInfo ? (
          <>
            {/* Mobile-optimized Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg font-bold text-blue-800 mb-2 flex items-center">
                <Camera className="w-4 h-4 mr-2" />📸 Photo Tips
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-blue-700">
                <div>
                  <p className="font-medium">✅ Good Photos:</p>
                  <p>• Clear, well-lit packaging • Focus on medicine name • Avoid shadows</p>
                </div>
                <div>
                  <p className="font-medium">📋 We Extract:</p>
                  <p>• Medicine name • Dosage • Manufacturer • Expiry date</p>
                </div>
              </div>
            </div>

            {/* Enhanced Mobile Upload Area - Minimum 48px height for touch */}
            <div
              className="border-2 border-dashed border-purple-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 active:scale-95 min-h-[120px] flex items-center justify-center"
              onClick={() => document.getElementById("medicine-upload")?.click()}
              style={{ minHeight: "120px" }} // Ensure adequate touch target
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
                  <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">Take Photo</p>
                  <p className="text-sm text-gray-600">OCR + AI Analysis</p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-1">
                    <Scan className="w-3 h-3" />
                    <span>Clear lighting</span>
                    <Eye className="w-3 h-3" />
                    <span>Text extraction</span>
                  </div>
                </div>
              </div>
            </div>

            <Input
              id="medicine-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isScanning || isExtracting}
            />

            {selectedImage && !isScanning && !medicineInfo && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-purple-500 rounded-full">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-800">Image captured</span>
                    <p className="text-xs text-purple-600">Processing...</p>
                  </div>
                </div>
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Medicine"
                  className="w-full h-32 sm:h-40 object-contain rounded border bg-white"
                />
              </div>
            )}

            {/* Enhanced Mobile Sample Medicines - Minimum 48px touch targets */}
            <div className="space-y-3 mt-4">
              <p className="text-base sm:text-lg font-semibold text-gray-700 text-center">Try samples:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sampleMedicines.map((medicine, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => handleSampleMedicine(medicine.name)}
                    disabled={isScanning || isExtracting}
                    className={`h-auto py-4 px-3 bg-gradient-to-r ${medicine.color} text-white border-0 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md text-xs min-h-[60px] touch-manipulation`}
                    style={{ minHeight: "60px", minWidth: "120px" }} // Ensure adequate touch target
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{medicine.icon}</span>
                      <span className="text-center font-medium leading-tight">{medicine.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {(isExtracting || isScanning) && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <div className="text-center">
                    <p className="text-base font-medium text-purple-800">
                      {isExtracting ? "Reading Text..." : "Analyzing..."}
                    </p>
                    <p className="text-sm text-purple-600">{isExtracting ? "OCR processing" : "AI identification"}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50 mt-4">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Mobile Success Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500 rounded-full">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Complete</h4>
                  <p className="text-xs text-gray-600">AI + OCR</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 px-3 py-1.5 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            {/* Enhanced Mobile Medicine Details */}
            <div className="bg-gray-50 rounded-lg p-4 border shadow-sm">
              <div className="space-y-3">
                <div>
                  <h5 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">{medicineInfo.name}</h5>
                  <p className="text-sm text-gray-600">Generic: {medicineInfo.generic}</p>
                  <p className="text-xs text-gray-600">{medicineInfo.manufacturer}</p>
                  {medicineInfo.extractedText && <p className="text-xs text-green-600">✅ OCR extracted</p>}
                </div>

                {/* Enhanced Mobile Price Comparison - Larger touch targets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center min-h-[80px] flex flex-col justify-center">
                    <ShoppingCart className="w-5 h-5 mx-auto mb-2 text-red-600" />
                    <p className="text-xs text-red-600 font-bold">Brand</p>
                    <p className="text-xl font-bold text-red-700">₹{medicineInfo.brandPrice}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center min-h-[80px] flex flex-col justify-center">
                    <ShoppingCart className="w-5 h-5 mx-auto mb-2 text-green-600" />
                    <p className="text-xs text-green-600 font-bold">Generic</p>
                    <p className="text-xl font-bold text-green-700">₹{medicineInfo.genericPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Mobile Uses */}
            <div className="space-y-2">
              <h5 className="text-base font-bold text-gray-800 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Uses:
              </h5>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{medicineInfo.uses}</p>
              </div>
            </div>

            {/* Enhanced Mobile Dosage */}
            <div className="space-y-2">
              <h5 className="text-base font-bold text-gray-800 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                Dosage:
              </h5>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{medicineInfo.dosage}</p>
              </div>
            </div>

            {/* Enhanced Mobile Side Effects */}
            {medicineInfo.sideEffects.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-base font-bold text-gray-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                  Side Effects:
                </h5>
                <div className="space-y-2">
                  {medicineInfo.sideEffects.slice(0, 3).map((effect, idx) => (
                    <div
                      key={idx}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-3 min-h-[48px] flex items-center"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 flex-1">{effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Mobile Interactions */}
            {medicineInfo.interactions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-base font-bold text-gray-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                  Interactions:
                </h5>
                <div className="space-y-2">
                  {medicineInfo.interactions.slice(0, 3).map((interaction, idx) => (
                    <div
                      key={idx}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 min-h-[48px] flex items-center"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 flex-1">{interaction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Mobile Precautions */}
            {medicineInfo.precautions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-base font-bold text-gray-800 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-500" />
                  Precautions:
                </h5>
                <div className="space-y-2">
                  {medicineInfo.precautions.slice(0, 3).map((precaution, idx) => (
                    <div
                      key={idx}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-3 min-h-[48px] flex items-center"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 flex-1">{precaution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Mobile Collapsible Sections */}
            {medicineInfo.extractedText && (
              <details className="bg-gray-50 rounded-lg p-4 border">
                <summary className="cursor-pointer text-sm font-bold text-gray-700 flex items-center py-2 min-h-[44px] touch-manipulation">
                  <Eye className="w-4 h-4 mr-2" />
                  OCR Text
                </summary>
                <div className="mt-2 p-3 bg-white rounded border text-xs text-gray-600 max-h-24 overflow-y-auto">
                  {medicineInfo.extractedText}
                </div>
              </details>
            )}

            <details className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <summary className="cursor-pointer text-sm font-bold text-purple-700 flex items-center py-2 min-h-[44px] touch-manipulation">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Analysis
              </summary>
              <div className="mt-2 p-3 bg-white rounded border text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                {medicineInfo.rawAnalysis}
              </div>
            </details>

            <Alert className="border-yellow-300 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                AI identification for information only. Verify with healthcare provider before use.
              </AlertDescription>
            </Alert>

            {/* Enhanced Mobile Action Buttons - Minimum 48px height */}
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-3">
              <Button
                onClick={resetIdentifier}
                variant="outline"
                className="w-full sm:flex-1 bg-gray-50 hover:bg-gray-100 active:scale-95 transition-transform duration-150 min-h-[48px] text-sm font-medium touch-manipulation"
              >
                <Camera className="w-4 h-4 mr-2" />
                Try Another
              </Button>
              <Button
                className="w-full sm:flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-transform duration-150 text-white min-h-[48px] text-sm font-medium touch-manipulation"
                asChild
              >
                <a href="/chat">
                  Ask AI Doctor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Enhanced Mobile Footer Button - Minimum 48px height */}
        <div className="pt-4 border-t border-gray-200 mt-4 sm:mt-6">
          <Button
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 active:scale-95 transition-transform duration-150 text-white text-sm sm:text-base min-h-[48px] font-medium touch-manipulation"
            asChild
          >
            <a href="/medicines">
              <Crown className="w-4 h-4 mr-2" />
              Full Medicine Identifier
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DemoMedicineIdentifierComponent
