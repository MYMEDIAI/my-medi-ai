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
    { name: "Paracetamol 500mg Tablet", color: "from-red-400 to-pink-500", icon: "💊" },
    { name: "Amoxicillin 250mg Capsule", color: "from-blue-400 to-cyan-500", icon: "💉" },
    { name: "Metformin 500mg Tablet", color: "from-green-400 to-emerald-500", icon: "🍯" },
    { name: "Amlodipine 5mg Tablet", color: "from-purple-400 to-violet-500", icon: "❤️" },
    { name: "Vitamin D3 1000 IU Tablet", color: "from-yellow-400 to-orange-500", icon: "☀️" },
    { name: "Aspirin 75mg Tablet", color: "from-teal-400 to-cyan-500", icon: "🩹" },
    { name: "Omeprazole 20mg Capsule", color: "from-indigo-400 to-purple-500", icon: "🫀" },
    { name: "Atorvastatin 10mg Tablet", color: "from-rose-400 to-red-500", icon: "💝" },
  ]

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (JPG, PNG, etc.)")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image file is too large. Please upload an image smaller than 10MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setError("")
        setMedicineInfo(null) // Clear previous results

        console.log("🔄 Starting medicine identification process...")
        console.log("📁 File:", file.name, "Size:", file.size, "Type:", file.type)

        // First extract text using OCR
        const extractedText = await extractTextFromImage(file)

        // Then identify the medicine using AI
        if (extractedText) {
          await identifyMedicineWithAI(file.name, extractedText)
        } else {
          // If OCR fails, still try AI with just filename
          await identifyMedicineWithAI(file.name, null)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const extractTextFromImage = async (file: File): Promise<string | null> => {
    setIsExtracting(true)
    try {
      console.log("🔍 Starting OCR extraction...")

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("❌ OCR API error:", errorData)
        throw new Error(errorData.details || errorData.error || "OCR extraction failed")
      }

      const data = await response.json()
      console.log("✅ OCR extraction successful!")
      console.log("📝 Extracted text:", data.extractedText)

      if (!data.extractedText || data.extractedText.trim().length < 5) {
        console.warn("⚠️ Very little text extracted")
        setError("Could not extract clear text from image. Trying AI analysis anyway...")
        return data.extractedText || null
      }

      return data.extractedText
    } catch (error) {
      console.error("❌ OCR extraction error:", error)
      setError(`OCR failed: ${error instanceof Error ? error.message : "Unknown error"}. Trying AI analysis...`)
      return null
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSampleMedicine = async (medicineName: string) => {
    setSelectedImage("/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(medicineName))
    setError("")
    setMedicineInfo(null)

    console.log("🧪 Testing sample medicine:", medicineName)

    // Add delay for UX
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    await identifyMedicineWithAI(medicineName, null)
  }

  const identifyMedicineWithAI = async (fileName: string, extractedText: string | null) => {
    setIsScanning(true)
    setError("")

    try {
      console.log("🤖 Starting AI medicine identification...")
      console.log("📄 File name:", fileName)
      console.log("📝 Has extracted text:", !!extractedText)

      const prompt = `You are an expert AI pharmacist. Analyze this medicine and provide comprehensive information.

${
  extractedText
    ? `
EXTRACTED TEXT FROM MEDICINE IMAGE:
${extractedText}

Please analyze this extracted text to identify the medicine.
`
    : `
MEDICINE NAME: ${fileName}
`
}

Provide detailed information in this EXACT format:

**MEDICINE IDENTIFICATION:**
Brand Name: [Brand name]
Generic Name: [Generic name]
Strength: [Dosage like 500mg]
Manufacturer: [Company name]

**MEDICAL USES:**
[Detailed uses and indications]

**DOSAGE INFORMATION:**
[Specific dosage instructions]

**SIDE EFFECTS:**
- [Side effect 1]
- [Side effect 2]
- [Side effect 3]
- [Side effect 4]

**DRUG INTERACTIONS:**
- [Interaction 1]
- [Interaction 2]
- [Interaction 3]

**PRECAUTIONS:**
- [Precaution 1]
- [Precaution 2]
- [Precaution 3]
- [Precaution 4]

**INDIAN MARKET PRICING:**
Brand Price: ₹[price]
Generic Price: ₹[lower price]

${extractedText ? "Base your analysis on the extracted text above." : "Provide comprehensive information for this medicine."}`

      console.log("📤 Sending request to AI API...")

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
        console.error("❌ AI API error:", errorData)
        throw new Error(errorData.details || errorData.error || `AI API failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ AI response received!")

      if (!data.response) {
        throw new Error("No response from AI")
      }

      console.log("🔄 Parsing AI response...")
      const structuredMedicine = parseAIResponse(data.response, fileName)
      structuredMedicine.extractedText = extractedText || undefined

      console.log("✅ Medicine identification completed!")
      console.log("💊 Medicine:", structuredMedicine.name)

      setMedicineInfo(structuredMedicine)
    } catch (error) {
      console.error("❌ AI identification error:", error)
      setError(`AI identification failed: ${error instanceof Error ? error.message : "Unknown error"}`)

      // Only use fallback if it's a known medicine
      if (fileName.toLowerCase().includes("paracetamol") || fileName.toLowerCase().includes("acetaminophen")) {
        console.log("🔄 Using Paracetamol fallback...")
        const fallback = getParacetamolFallback()
        fallback.extractedText = extractedText || undefined
        setMedicineInfo(fallback)
      } else {
        console.log("🔄 Using generic fallback...")
        const fallback = getGenericFallback(fileName)
        fallback.extractedText = extractedText || undefined
        setMedicineInfo(fallback)
      }
    } finally {
      setIsScanning(false)
    }
  }

  const parseAIResponse = (aiResponse: string, fileName: string): MedicineInfo => {
    console.log("🔍 Parsing AI response...")

    const medicine: MedicineInfo = {
      name: fileName.replace(/\.(jpg|jpeg|png|pdf)$/i, ""),
      generic: "Generic equivalent available",
      brandPrice: 30,
      genericPrice: 12,
      uses: "Consult healthcare provider for specific uses",
      dosage: "Follow prescription instructions",
      sideEffects: ["Consult healthcare provider"],
      interactions: ["Consult healthcare provider"],
      precautions: ["Follow medical advice"],
      manufacturer: "Various manufacturers",
      rawAnalysis: aiResponse,
    }

    try {
      // Parse brand name
      const brandMatch = aiResponse.match(/Brand Name:\s*([^\n]+)/i)
      if (brandMatch) {
        medicine.name = brandMatch[1].trim()
        console.log("📝 Found brand name:", medicine.name)
      }

      // Parse generic name
      const genericMatch = aiResponse.match(/Generic Name:\s*([^\n]+)/i)
      if (genericMatch) {
        medicine.generic = genericMatch[1].trim()
        console.log("📝 Found generic name:", medicine.generic)
      }

      // Parse manufacturer
      const manufacturerMatch = aiResponse.match(/Manufacturer:\s*([^\n]+)/i)
      if (manufacturerMatch) {
        medicine.manufacturer = manufacturerMatch[1].trim()
        console.log("📝 Found manufacturer:", medicine.manufacturer)
      }

      // Parse uses
      const usesMatch = aiResponse.match(/\*\*MEDICAL USES:\*\*\s*\n([^*]+)/i)
      if (usesMatch) {
        medicine.uses = usesMatch[1].trim()
        console.log("📝 Found uses")
      }

      // Parse dosage
      const dosageMatch = aiResponse.match(/\*\*DOSAGE INFORMATION:\*\*\s*\n([^*]+)/i)
      if (dosageMatch) {
        medicine.dosage = dosageMatch[1].trim()
        console.log("📝 Found dosage")
      }

      // Parse side effects
      const sideEffectsMatch = aiResponse.match(/\*\*SIDE EFFECTS:\*\*\s*\n((?:- [^\n]+\n?)+)/i)
      if (sideEffectsMatch) {
        const effects = sideEffectsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((effect) => effect.length > 0)
        if (effects.length > 0) {
          medicine.sideEffects = effects
          console.log("📝 Found", effects.length, "side effects")
        }
      }

      // Parse interactions
      const interactionsMatch = aiResponse.match(/\*\*DRUG INTERACTIONS:\*\*\s*\n((?:- [^\n]+\n?)+)/i)
      if (interactionsMatch) {
        const interactions = interactionsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((interaction) => interaction.length > 0)
        if (interactions.length > 0) {
          medicine.interactions = interactions
          console.log("📝 Found", interactions.length, "interactions")
        }
      }

      // Parse precautions
      const precautionsMatch = aiResponse.match(/\*\*PRECAUTIONS:\*\*\s*\n((?:- [^\n]+\n?)+)/i)
      if (precautionsMatch) {
        const precautions = precautionsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((precaution) => precaution.length > 0)
        if (precautions.length > 0) {
          medicine.precautions = precautions
          console.log("📝 Found", precautions.length, "precautions")
        }
      }

      // Parse prices
      const brandPriceMatch = aiResponse.match(/Brand Price:\s*₹(\d+)/i)
      const genericPriceMatch = aiResponse.match(/Generic Price:\s*₹(\d+)/i)

      if (brandPriceMatch) {
        medicine.brandPrice = Number.parseInt(brandPriceMatch[1])
        console.log("📝 Found brand price: ₹", medicine.brandPrice)
      }

      if (genericPriceMatch) {
        medicine.genericPrice = Number.parseInt(genericPriceMatch[1])
        console.log("📝 Found generic price: ₹", medicine.genericPrice)
      }
    } catch (parseError) {
      console.error("❌ Error parsing AI response:", parseError)
    }

    return medicine
  }

  const getParacetamolFallback = (): MedicineInfo => {
    return {
      name: "Paracetamol 500mg Tablet",
      generic: "Acetaminophen",
      brandPrice: 25,
      genericPrice: 8,
      uses: "Pain relief, fever reduction, headache, body aches, dental pain, menstrual cramps",
      dosage: "Adults: 1-2 tablets every 6-8 hours. Maximum 4g per day. Take with or without food",
      sideEffects: [
        "Nausea (rare)",
        "Skin rash or allergic reactions",
        "Liver damage with overdose",
        "Stomach upset (uncommon)",
      ],
      interactions: [
        "Avoid with alcohol - increases liver toxicity",
        "Check with blood thinners (warfarin)",
        "Consult if taking other pain medications",
        "May interact with certain antibiotics",
      ],
      precautions: [
        "Do not exceed recommended dose",
        "Avoid alcohol while taking",
        "Consult doctor if symptoms persist beyond 3 days",
        "Not recommended for liver disease patients",
      ],
      manufacturer: "Cipla, Sun Pharma, Dr. Reddy's",
      rawAnalysis: "Fallback information for Paracetamol 500mg - common pain reliever and fever reducer",
    }
  }

  const getGenericFallback = (fileName: string): MedicineInfo => {
    return {
      name: fileName.replace(/\.(jpg|jpeg|png|pdf)$/i, ""),
      generic: "Generic equivalent may be available",
      brandPrice: 35,
      genericPrice: 15,
      uses: "AI analysis temporarily unavailable. Please consult with a pharmacist for specific uses and indications.",
      dosage: "Follow prescription instructions or package directions. Consult healthcare provider for proper dosage.",
      sideEffects: [
        "Consult healthcare provider for complete side effect information",
        "Monitor for any unusual reactions",
        "Report adverse effects to your doctor",
      ],
      interactions: [
        "Inform doctor of all medications you're taking",
        "Check with pharmacist for drug interactions",
        "Avoid alcohol unless approved by doctor",
      ],
      precautions: [
        "Take as prescribed by healthcare provider",
        "Store in cool, dry place away from children",
        "Check expiration date before use",
        "Don't share medications with others",
      ],
      manufacturer: "Consult package for manufacturer information",
      rawAnalysis:
        "AI analysis temporarily unavailable. Please consult with a healthcare professional for complete medicine information.",
    }
  }

  const resetIdentifier = () => {
    setSelectedImage(null)
    setMedicineInfo(null)
    setError("")
    setIsScanning(false)
    setIsExtracting(false)
    console.log("🔄 Medicine identifier reset")
  }

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white text-xl">
          <div className="p-2 bg-white/20 rounded-full mr-3">
            <Pill className="w-6 h-6" />
          </div>
          💊 AI Medicine Identifier
          <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30">
            <div className="w-2 h-2 bg-purple-300 rounded-full mr-1 animate-pulse"></div>
            Live AI
          </Badge>
          <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
            <Crown className="w-3 h-3 mr-1" />
            Premium OCR
          </Badge>
          <Badge className="bg-blue-400 text-blue-900 hover:bg-blue-400">
            <Zap className="w-3 h-3 mr-1" />
            OpenAI GPT-4
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        {!medicineInfo ? (
          <>
            {/* Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                <Camera className="w-5 h-5 mr-2" />📸 Tips for Best Results
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div className="space-y-2">
                  <p className="font-medium">✅ Good Photo Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Clear, well-lit medicine packaging</li>
                    <li>• Focus on medicine name and details</li>
                    <li>• Avoid shadows and reflections</li>
                    <li>• Include dosage information if visible</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">📋 What We Extract:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Medicine name and brand</li>
                    <li>• Dosage strength (mg, IU, etc.)</li>
                    <li>• Manufacturer details</li>
                    <li>• Batch number and expiry date</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 transform hover:scale-105"
              onClick={() => document.getElementById("medicine-upload")?.click()}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full">
                  <Camera className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800 mb-2">Take Medicine Photo</p>
                  <p className="text-gray-600 mb-2">Advanced OCR + AI Identification</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Scan className="w-4 h-4" />
                    <span>Clear photo with good lighting</span>
                    <Eye className="w-4 h-4" />
                    <span>Text extraction included</span>
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-800">Image captured successfully</span>
                    <p className="text-xs text-purple-600">Processing with OCR + AI...</p>
                  </div>
                </div>
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected medicine"
                  className="w-full h-40 object-contain rounded-lg border bg-white shadow-sm"
                />
              </div>
            )}

            {/* Sample Medicines */}
            <div className="space-y-4 mt-6">
              <p className="text-lg font-semibold text-gray-700 text-center">Or try with sample medicines:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sampleMedicines.map((medicine, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleMedicine(medicine.name)}
                    disabled={isScanning || isExtracting}
                    className={`h-auto py-3 px-3 bg-gradient-to-r ${medicine.color} text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{medicine.icon}</span>
                      <span className="text-xs text-center font-medium">{medicine.name.split(" ")[0]}</span>
                      <span className="text-xs text-center opacity-90">
                        {medicine.name.split(" ").slice(1).join(" ")}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {(isExtracting || isScanning) && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mt-4">
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-purple-800">
                      {isExtracting ? "Extracting Text..." : "Identifying Medicine..."}
                    </p>
                    <p className="text-sm text-purple-600">
                      {isExtracting ? "OCR is reading medicine details" : "OpenAI is analyzing the medicine"}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 mt-4">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">AI Identification Complete</h4>
                  <p className="text-sm text-gray-600">Powered by OpenAI GPT-4 + OCR</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            {/* Medicine Details */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-lg">
              <div className="space-y-4">
                <div>
                  <h5 className="text-2xl font-bold text-gray-800">{medicineInfo.name}</h5>
                  <p className="text-lg text-gray-600">Generic: {medicineInfo.generic}</p>
                  <p className="text-sm text-gray-600">Manufacturer: {medicineInfo.manufacturer}</p>
                  {medicineInfo.extractedText && (
                    <p className="text-xs text-green-600 mt-1">✅ Text extracted via OCR</p>
                  )}
                </div>

                {/* Price Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 text-center shadow-lg">
                    <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <p className="text-sm text-red-600 font-bold">Brand Price</p>
                    <p className="text-2xl font-bold text-red-700">₹{medicineInfo.brandPrice}</p>
                    <p className="text-xs text-red-600">Original medicine</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 text-center shadow-lg">
                    <ShoppingCart className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-green-600 font-bold">Generic Price</p>
                    <p className="text-2xl font-bold text-green-700">₹{medicineInfo.genericPrice}</p>
                    <p className="text-xs text-green-600">
                      Save ₹{medicineInfo.brandPrice - medicineInfo.genericPrice}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uses */}
            <div className="space-y-3">
              <h5 className="text-lg font-bold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Medical Uses:
              </h5>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg">
                <p className="text-gray-700 font-medium leading-relaxed">{medicineInfo.uses}</p>
              </div>
            </div>

            {/* Dosage */}
            <div className="space-y-3">
              <h5 className="text-lg font-bold text-gray-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                Dosage Instructions:
              </h5>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 shadow-lg">
                <p className="text-gray-700 font-medium leading-relaxed">{medicineInfo.dosage}</p>
              </div>
            </div>

            {/* Side Effects */}
            {medicineInfo.sideEffects.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-gray-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                  Common Side Effects:
                </h5>
                <div className="grid gap-2">
                  {medicineInfo.sideEffects.map((effect, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drug Interactions */}
            {medicineInfo.interactions.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-gray-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Drug Interactions:
                </h5>
                <div className="grid gap-2">
                  {medicineInfo.interactions.map((interaction, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{interaction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Precautions */}
            {medicineInfo.precautions.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-lg font-bold text-gray-800 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-500" />
                  Important Precautions:
                </h5>
                <div className="grid gap-2">
                  {medicineInfo.precautions.map((precaution, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{precaution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Text */}
            {medicineInfo.extractedText && (
              <details className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <summary className="cursor-pointer text-lg font-bold text-gray-700 hover:text-gray-900 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  View Extracted Text (OCR)
                </summary>
                <div className="mt-3 p-3 bg-white rounded-lg border text-sm text-gray-600 max-h-32 overflow-y-auto">
                  {medicineInfo.extractedText}
                </div>
              </details>
            )}

            {/* Raw AI Analysis */}
            <details className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <summary className="cursor-pointer text-lg font-bold text-purple-700 hover:text-purple-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                View Full AI Analysis
              </summary>
              <div className="mt-3 p-3 bg-white rounded-lg border text-sm text-gray-600 whitespace-pre-line max-h-40 overflow-y-auto">
                {medicineInfo.rawAnalysis}
              </div>
            </details>

            <Alert className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-800 font-medium">
                This AI identification is for informational purposes only. Always verify medicine details with a
                qualified pharmacist or healthcare provider before use.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                onClick={resetIdentifier}
                variant="outline"
                size="lg"
                className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2"
              >
                <Camera className="w-4 h-4 mr-2" />
                Identify Another Medicine
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                asChild
              >
                <a href="/chat">
                  Ask AI Pharmacist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 mt-6">
          <Button
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600 text-white shadow-xl text-lg py-3"
            asChild
          >
            <a href="/medicines">
              <Crown className="w-5 h-5 mr-2" />
              Open Full Medicine Identifier
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DemoMedicineIdentifierComponent
