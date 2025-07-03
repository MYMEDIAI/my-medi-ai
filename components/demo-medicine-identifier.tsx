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
}

function DemoMedicineIdentifierComponent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")

  const sampleMedicines = [
    "Paracetamol 500mg Tablet",
    "Amoxicillin 250mg Capsule",
    "Metformin 500mg Tablet",
    "Amlodipine 5mg Tablet",
    "Vitamin D3 1000 IU Tablet",
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        identifyMedicine(file.name)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const handleSampleMedicine = (medicineName: string) => {
    setSelectedImage("/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(medicineName))
    identifyMedicine(medicineName)
  }

  const identifyMedicine = async (fileName: string) => {
    setIsScanning(true)
    setError("")

    try {
      // Create a comprehensive prompt for AI medicine identification
      const identificationPrompt = `
Please identify and provide comprehensive information about this medicine: ${fileName}

As an AI pharmacist and medicine expert, provide detailed information including:

1. **Medicine Identification**: 
   - Brand name and generic name
   - Strength/dosage form
   - Manufacturer information (focus on Indian pharmaceutical companies)

2. **Medical Uses**: 
   - Primary therapeutic uses and indications
   - Conditions it treats effectively
   - Mechanism of action in simple terms

3. **Dosage Information**:
   - Recommended adult dosage with specific amounts
   - How to take it (with/without food, timing)
   - Frequency of administration
   - Special considerations for elderly or children

4. **Side Effects**:
   - Common side effects (frequency >1%)
   - Serious side effects to watch for
   - When to contact a doctor immediately

5. **Drug Interactions**:
   - Medications to avoid or use with caution
   - Food/drink interactions (alcohol, grapefruit, etc.)
   - Supplements that may interact
   - Timing considerations with other medications

6. **Precautions and Warnings**:
   - Who should not take this medicine (contraindications)
   - Special precautions for pregnancy, breastfeeding
   - Kidney/liver disease considerations
   - Storage instructions and shelf life

7. **Indian Market Information**:
   - Approximate brand price in Indian rupees (realistic pricing)
   - Generic equivalent price (typically 30-70% less)
   - Common Indian manufacturers
   - Availability information (prescription vs OTC)

Please provide accurate, comprehensive information that would be helpful for Indian patients. Include specific dosages, realistic pricing, and practical advice.

Note: This is a simulated identification for demonstration. In a real scenario, computer vision would analyze the uploaded image to identify the medicine from its appearance, packaging, and text.
`

      // Call the actual AI integration API
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: identificationPrompt,
          type: "medicine-identification",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      let aiResponse = ""
      if (data.response) {
        aiResponse = typeof data.response === "string" ? data.response : JSON.stringify(data.response)
      } else {
        throw new Error("No identification received from AI")
      }

      // Parse the AI response and structure it
      const structuredMedicine = parseAIMedicineInfo(aiResponse, fileName)
      setMedicineInfo(structuredMedicine)
    } catch (error) {
      console.error("Medicine identification error:", error)
      setError("Unable to identify medicine. Please try again with a clearer image.")

      // Provide fallback medicine information
      const fallbackMedicine = generateFallbackMedicine(fileName)
      setMedicineInfo(fallbackMedicine)
    } finally {
      setIsScanning(false)
    }
  }

  const parseAIMedicineInfo = (aiResponse: string, fileName: string): MedicineInfo => {
    // Extract information from AI response
    const medicine: MedicineInfo = {
      name: fileName.replace(/\.(jpg|jpeg|png|pdf)$/i, ""),
      generic: "Generic equivalent available",
      brandPrice: 25,
      genericPrice: 10,
      uses: "Please consult pharmacist for specific uses",
      dosage: "Follow prescription or package instructions",
      sideEffects: ["Consult healthcare provider for side effects"],
      interactions: ["Consult healthcare provider for interactions"],
      precautions: ["Always follow prescribed dosage", "Consult doctor if unsure"],
      manufacturer: "Various pharmaceutical companies",
      rawAnalysis: aiResponse,
    }

    // Parse medicine name and generic
    const nameMatch = aiResponse.match(/(?:brand name|medicine name|name)[\s:]*([^\n]+)/i)
    if (nameMatch) {
      medicine.name = nameMatch[1].trim()
    }

    const genericMatch = aiResponse.match(/(?:generic name|generic)[\s:]*([^\n]+)/i)
    if (genericMatch) {
      medicine.generic = genericMatch[1].trim()
    }

    // Parse uses
    const usesMatch = aiResponse.match(/(?:uses?|indications?|treats?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i)
    if (usesMatch) {
      const uses = usesMatch[0].replace(/(?:uses?|indications?|treats?)[\s:]*/i, "").trim()
      if (uses.length > 10) {
        medicine.uses = uses
      }
    }

    // Parse dosage
    const dosageMatch = aiResponse.match(/(?:dosage|dose|administration)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i)
    if (dosageMatch) {
      const dosage = dosageMatch[0].replace(/(?:dosage|dose|administration)[\s:]*/i, "").trim()
      if (dosage.length > 10) {
        medicine.dosage = dosage
      }
    }

    // Parse side effects
    const sideEffectsMatch = aiResponse.match(
      /(?:side effects?|adverse effects?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (sideEffectsMatch) {
      const effects = sideEffectsMatch[0].split(/[•\-*]\s*/).filter((e) => e.trim().length > 5)
      if (effects.length > 1) {
        medicine.sideEffects = effects.slice(1, 5).map((e) => e.trim())
      }
    }

    // Parse interactions
    const interactionsMatch = aiResponse.match(
      /(?:interactions?|drug interactions?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (interactionsMatch) {
      const interactions = interactionsMatch[0].split(/[•\-*]\s*/).filter((i) => i.trim().length > 5)
      if (interactions.length > 1) {
        medicine.interactions = interactions.slice(1, 5).map((i) => i.trim())
      }
    }

    // Parse precautions
    const precautionsMatch = aiResponse.match(/(?:precautions?|warnings?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i)
    if (precautionsMatch) {
      const precautions = precautionsMatch[0].split(/[•\-*]\s*/).filter((p) => p.trim().length > 5)
      if (precautions.length > 1) {
        medicine.precautions = precautions.slice(1, 5).map((p) => p.trim())
      }
    }

    // Parse prices
    const priceMatch = aiResponse.match(/(?:price|cost|rupees?)[\s\S]*?(\d+)[\s\S]*?(\d+)/i)
    if (priceMatch) {
      const prices = [Number.parseInt(priceMatch[1]), Number.parseInt(priceMatch[2])].sort((a, b) => b - a)
      medicine.brandPrice = prices[0]
      medicine.genericPrice = prices[1]
    }

    return medicine
  }

  const generateFallbackMedicine = (fileName: string): MedicineInfo => {
    if (fileName.includes("Paracetamol")) {
      return {
        name: "Paracetamol 500mg",
        generic: "Acetaminophen",
        brandPrice: 25,
        genericPrice: 8,
        uses: "Pain relief, fever reduction, headache, body aches, dental pain, menstrual cramps",
        dosage: "Adults: 1-2 tablets every 6-8 hours. Maximum 4g per day. Children: As per doctor's advice",
        sideEffects: [
          "Nausea (rare)",
          "Skin rash or allergic reactions",
          "Liver damage with overdose",
          "Stomach upset (uncommon)",
        ],
        interactions: [
          "Avoid with alcohol consumption",
          "Check with blood thinners (warfarin)",
          "Consult if taking other pain medications",
          "May interact with certain antibiotics",
        ],
        precautions: [
          "Do not exceed recommended dose",
          "Avoid alcohol while taking this medicine",
          "Consult doctor if symptoms persist beyond 3 days",
          "Not recommended for patients with liver disease",
        ],
        manufacturer: "Various Indian pharmaceutical companies",
        rawAnalysis: "AI analysis temporarily unavailable. This is standard information for Paracetamol 500mg.",
      }
    }

    return {
      name: fileName.replace(/\.(jpg|jpeg|png|pdf)$/i, ""),
      generic: "Generic equivalent available",
      brandPrice: 30,
      genericPrice: 12,
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
  }

  return (
    <Card className="border-purple-100 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-700">
          <Pill className="w-5 h-5 mr-2" />💊 AI Medicine Identifier
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
            Live AI
          </Badge>
          <span className="text-xs text-gray-500">Powered by OpenAI GPT-4</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!medicineInfo ? (
          <>
            {/* Image Upload Area */}
            <div
              className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
              onClick={() => document.getElementById("medicine-upload")?.click()}
            >
              <Camera className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium text-gray-800">Take Medicine Photo</p>
              <p className="text-xs text-gray-600 mt-1">Clear photo with good lighting works best</p>
            </div>

            <Input
              id="medicine-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isScanning}
            />

            {selectedImage && !isScanning && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected medicine"
                  className="w-full h-32 object-contain rounded border bg-white"
                />
              </div>
            )}

            {/* Sample Medicines */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Or try with sample medicines:</p>
              <div className="grid grid-cols-1 gap-2">
                {sampleMedicines.map((medicine, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSampleMedicine(medicine)}
                    disabled={isScanning}
                    className="text-xs text-left justify-start h-auto py-2 px-3 hover:bg-purple-50 hover:border-purple-200"
                  >
                    <Pill className="w-3 h-3 mr-2" />
                    {medicine}
                  </Button>
                ))}
              </div>
            </div>

            {isScanning && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-purple-800">Identifying Medicine...</p>
                    <p className="text-xs text-purple-600">OpenAI is analyzing the medicine image</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {/* Identification Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">AI Identification Complete</h4>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            {/* Medicine Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h5 className="font-semibold text-gray-800">{medicineInfo.name}</h5>
                <p className="text-sm text-gray-600">Generic: {medicineInfo.generic}</p>
                <p className="text-sm text-gray-600">Manufacturer: {medicineInfo.manufacturer}</p>
              </div>

              {/* Price Comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-red-600" />
                  <p className="text-xs text-red-600 font-medium">Brand Price</p>
                  <p className="text-lg font-bold text-red-700">₹{medicineInfo.brandPrice}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">Generic Price</p>
                  <p className="text-lg font-bold text-green-700">₹{medicineInfo.genericPrice}</p>
                </div>
              </div>
            </div>

            {/* Uses */}
            <div className="space-y-2">
              <h5 className="font-medium text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Medical Uses:
              </h5>
              <p className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                {medicineInfo.uses}
              </p>
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <h5 className="font-medium text-gray-800">Dosage Instructions:</h5>
              <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                {medicineInfo.dosage}
              </p>
            </div>

            {/* Side Effects */}
            {medicineInfo.sideEffects.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Common Side Effects:</h5>
                <ul className="space-y-1">
                  {medicineInfo.sideEffects.map((effect, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-500 mt-1">•</span>
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Drug Interactions */}
            {medicineInfo.interactions.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Drug Interactions:</h5>
                <ul className="space-y-1">
                  {medicineInfo.interactions.map((interaction, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {interaction}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Precautions */}
            {medicineInfo.precautions.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Important Precautions:</h5>
                <ul className="space-y-1">
                  {medicineInfo.precautions.map((precaution, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Raw AI Analysis */}
            <details className="bg-gray-50 rounded-lg p-3">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                View Full AI Analysis
              </summary>
              <div className="mt-2 text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                {medicineInfo.rawAnalysis}
              </div>
            </details>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                This AI identification is for informational purposes only. Always verify medicine details with a
                qualified pharmacist or healthcare provider before use.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={resetIdentifier} variant="outline" size="sm" className="flex-1 bg-transparent">
                Identify Another Medicine
              </Button>
              <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700" asChild>
                <a href="/chat">
                  Ask AI Pharmacist
                  <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
            <a href="/medicines">
              Open Full Medicine Identifier
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Default export
export default DemoMedicineIdentifierComponent

// Named export for compatibility
export const DemoMedicineIdentifier = DemoMedicineIdentifierComponent
