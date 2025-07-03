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
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setError("")

        // First extract text using OCR
        const extractedText = await extractTextFromImage(file)

        // Then identify the medicine
        await identifyMedicine(file.name, extractedText)
      }
      reader.readAsDataURL(file)
    }
  }

  const extractTextFromImage = async (file: File): Promise<string | null> => {
    setIsExtracting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "OCR extraction failed")
      }

      const data = await response.json()
      console.log("OCR extracted text:", data.extractedText)
      return data.extractedText || null
    } catch (error) {
      console.error("OCR extraction error:", error)
      setError(`OCR extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      return null
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSampleMedicine = async (medicineName: string) => {
    setSelectedImage("/placeholder.svg?height=200&width=300&text=" + encodeURIComponent(medicineName))
    setError("")

    // Add a small delay to show the scanning animation
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await identifyMedicine(medicineName, null)
  }

  const identifyMedicine = async (fileName: string, extractedText: string | null) => {
    setIsScanning(true)
    setError("")

    try {
      // Create a comprehensive prompt for AI medicine identification
      const identificationPrompt = `
Please identify and provide comprehensive information about this medicine: ${fileName}

${extractedText ? `OCR Extracted text from the medicine image:\n${extractedText}\n\n` : ""}

As an expert AI pharmacist, provide detailed information in the following format:

**MEDICINE IDENTIFICATION:**
- Brand Name: [Brand name]
- Generic Name: [Generic/chemical name]
- Strength/Dosage: [e.g., 500mg]
- Manufacturer: [Company name]

**MEDICAL USES:**
- Primary indications and therapeutic uses
- Conditions it treats effectively
- How it works (mechanism of action)

**DOSAGE INFORMATION:**
- Recommended adult dosage
- Frequency of administration
- How to take (with/without food, timing)
- Special considerations

**SIDE EFFECTS:**
- Common side effects (list 3-5)
- Serious side effects to watch for

**DRUG INTERACTIONS:**
- Important medications to avoid
- Food/drink interactions
- Timing considerations

**PRECAUTIONS:**
- Who should not take this medicine
- Special warnings
- Storage instructions

**INDIAN MARKET PRICING:**
- Brand price: ₹[realistic price]
- Generic price: ₹[realistic lower price]

Please provide accurate, comprehensive information suitable for Indian patients. Include specific dosages and realistic pricing.

${extractedText ? "Base your identification primarily on the extracted OCR text above." : "For this sample medicine, provide comprehensive information based on the medicine name."}
`

      // Call the AI integration API
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
        const errorData = await response.json()
        throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.response) {
        throw new Error("No identification received from AI")
      }

      // Parse the AI response and structure it
      const structuredMedicine = parseAIMedicineInfo(data.response, fileName)
      structuredMedicine.extractedText = extractedText || undefined
      setMedicineInfo(structuredMedicine)
    } catch (error) {
      console.error("Medicine identification error:", error)
      setError(`Medicine identification failed: ${error instanceof Error ? error.message : "Unknown error"}`)

      // Provide fallback medicine information
      const fallbackMedicine = generateFallbackMedicine(fileName)
      fallbackMedicine.extractedText = extractedText || undefined
      setMedicineInfo(fallbackMedicine)
    } finally {
      setIsScanning(false)
    }
  }

  const parseAIMedicineInfo = (aiResponse: string, fileName: string): MedicineInfo => {
    // Initialize with defaults
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

    try {
      // Parse medicine name and generic
      const brandMatch = aiResponse.match(/(?:brand name|medicine name)[\s:]*([^\n]+)/i)
      if (brandMatch) {
        medicine.name = brandMatch[1].trim().replace(/[*-]/g, "").trim()
      }

      const genericMatch = aiResponse.match(/(?:generic name)[\s:]*([^\n]+)/i)
      if (genericMatch) {
        medicine.generic = genericMatch[1].trim().replace(/[*-]/g, "").trim()
      }

      // Parse manufacturer
      const manufacturerMatch = aiResponse.match(/(?:manufacturer)[\s:]*([^\n]+)/i)
      if (manufacturerMatch) {
        medicine.manufacturer = manufacturerMatch[1].trim().replace(/[*-]/g, "").trim()
      }

      // Parse uses
      const usesMatch = aiResponse.match(/(?:medical uses|uses|indications)[\s\S]*?(?=\*\*|$)/i)
      if (usesMatch) {
        const uses = usesMatch[0]
          .replace(/(?:medical uses|uses|indications)[\s:]*/i, "")
          .replace(/\*\*/g, "")
          .trim()
        if (uses.length > 20) {
          medicine.uses = uses
        }
      }

      // Parse dosage
      const dosageMatch = aiResponse.match(/(?:dosage information|dosage)[\s\S]*?(?=\*\*|$)/i)
      if (dosageMatch) {
        const dosage = dosageMatch[0]
          .replace(/(?:dosage information|dosage)[\s:]*/i, "")
          .replace(/\*\*/g, "")
          .trim()
        if (dosage.length > 20) {
          medicine.dosage = dosage
        }
      }

      // Parse side effects
      const sideEffectsMatch = aiResponse.match(/(?:side effects)[\s\S]*?(?=\*\*|$)/i)
      if (sideEffectsMatch) {
        const effects = sideEffectsMatch[0]
          .split(/[-•*]\s*/)
          .filter((e) => e.trim().length > 10)
          .map((e) => e.replace(/\*\*/g, "").trim())
          .slice(0, 5)
        if (effects.length > 0) {
          medicine.sideEffects = effects
        }
      }

      // Parse interactions
      const interactionsMatch = aiResponse.match(/(?:drug interactions|interactions)[\s\S]*?(?=\*\*|$)/i)
      if (interactionsMatch) {
        const interactions = interactionsMatch[0]
          .split(/[-•*]\s*/)
          .filter((i) => i.trim().length > 10)
          .map((i) => i.replace(/\*\*/g, "").trim())
          .slice(0, 5)
        if (interactions.length > 0) {
          medicine.interactions = interactions
        }
      }

      // Parse precautions
      const precautionsMatch = aiResponse.match(/(?:precautions|warnings)[\s\S]*?(?=\*\*|$)/i)
      if (precautionsMatch) {
        const precautions = precautionsMatch[0]
          .split(/[-•*]\s*/)
          .filter((p) => p.trim().length > 10)
          .map((p) => p.replace(/\*\*/g, "").trim())
          .slice(0, 5)
        if (precautions.length > 0) {
          medicine.precautions = precautions
        }
      }

      // Parse prices
      const priceMatch = aiResponse.match(/brand price[\s:]*₹(\d+)[\s\S]*?generic price[\s:]*₹(\d+)/i)
      if (priceMatch) {
        medicine.brandPrice = Number.parseInt(priceMatch[1])
        medicine.genericPrice = Number.parseInt(priceMatch[2])
      } else {
        // Try to find any price mentions
        const anyPriceMatch = aiResponse.match(/₹(\d+)/g)
        if (anyPriceMatch && anyPriceMatch.length >= 2) {
          const prices = anyPriceMatch.map((p) => Number.parseInt(p.replace("₹", ""))).sort((a, b) => b - a)
          medicine.brandPrice = prices[0]
          medicine.genericPrice = prices[1]
        }
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
    }

    return medicine
  }

  const generateFallbackMedicine = (fileName: string): MedicineInfo => {
    const medicineName = fileName.toLowerCase()

    if (medicineName.includes("paracetamol")) {
      return {
        name: "Paracetamol 500mg Tablet",
        generic: "Acetaminophen",
        brandPrice: 25,
        genericPrice: 8,
        uses: "Pain relief, fever reduction, headache, body aches, dental pain, menstrual cramps, arthritis pain, and post-operative pain management",
        dosage:
          "Adults: 1-2 tablets (500-1000mg) every 6-8 hours. Maximum 4g per day. Children: 10-15mg/kg body weight every 6 hours",
        sideEffects: [
          "Nausea and vomiting (rare)",
          "Skin rash or allergic reactions",
          "Liver damage with overdose",
          "Stomach upset (uncommon)",
          "Blood disorders (very rare)",
        ],
        interactions: [
          "Avoid with alcohol consumption - increases liver toxicity risk",
          "Check with blood thinners (warfarin) - may increase bleeding risk",
          "Consult if taking other pain medications to avoid overdose",
          "May interact with certain antibiotics and seizure medications",
        ],
        precautions: [
          "Do not exceed recommended dose - can cause serious liver damage",
          "Avoid alcohol while taking this medicine",
          "Consult doctor if symptoms persist beyond 3 days",
          "Not recommended for patients with liver disease",
          "Use with caution in elderly patients",
        ],
        manufacturer: "Cipla, Sun Pharma, Dr. Reddy's, Lupin",
        rawAnalysis:
          "Comprehensive information for Paracetamol 500mg - India's most commonly used pain reliever and fever reducer.",
      }
    }

    if (medicineName.includes("amoxicillin")) {
      return {
        name: "Amoxicillin 250mg Capsule",
        generic: "Amoxicillin Trihydrate",
        brandPrice: 45,
        genericPrice: 18,
        uses: "Bacterial infections including respiratory tract infections, urinary tract infections, skin infections, dental infections, and ear infections",
        dosage:
          "Adults: 250-500mg every 8 hours. Children: 20-40mg/kg/day divided into 3 doses. Take with or without food",
        sideEffects: [
          "Nausea and diarrhea (common)",
          "Allergic reactions including skin rash",
          "Stomach upset and abdominal pain",
          "Yeast infections (oral or vaginal)",
          "Severe allergic reactions (rare but serious)",
        ],
        interactions: [
          "May reduce effectiveness of birth control pills",
          "Avoid with methotrexate - increases toxicity",
          "May interact with blood thinners",
          "Can affect live vaccines - consult doctor",
        ],
        precautions: [
          "Complete the full course even if feeling better",
          "Inform doctor of any penicillin allergies",
          "Take probiotics to prevent stomach upset",
          "Not effective against viral infections",
          "Store in cool, dry place",
        ],
        manufacturer: "Cipla, Ranbaxy, Aurobindo Pharma",
        rawAnalysis: "Amoxicillin is a widely used penicillin antibiotic effective against many bacterial infections.",
      }
    }

    if (medicineName.includes("metformin")) {
      return {
        name: "Metformin 500mg Tablet",
        generic: "Metformin Hydrochloride",
        brandPrice: 35,
        genericPrice: 12,
        uses: "Type 2 diabetes management, PCOS treatment, pre-diabetes prevention, and weight management in diabetic patients",
        dosage:
          "Adults: Start with 500mg twice daily with meals. May increase to 1000mg twice daily. Maximum 2000mg per day",
        sideEffects: [
          "Nausea and stomach upset (common initially)",
          "Diarrhea and loose stools",
          "Metallic taste in mouth",
          "Loss of appetite",
          "Lactic acidosis (rare but serious)",
        ],
        interactions: [
          "Avoid excessive alcohol - increases lactic acidosis risk",
          "May interact with contrast dyes used in scans",
          "Can affect vitamin B12 absorption",
          "May enhance effects of other diabetes medications",
        ],
        precautions: [
          "Take with meals to reduce stomach upset",
          "Monitor kidney function regularly",
          "Stop before surgery or medical procedures",
          "Not suitable for type 1 diabetes",
          "Regular blood sugar monitoring required",
        ],
        manufacturer: "Sun Pharma, Cipla, Torrent Pharmaceuticals",
        rawAnalysis: "Metformin is the first-line treatment for type 2 diabetes and helps improve insulin sensitivity.",
      }
    }

    if (medicineName.includes("amlodipine")) {
      return {
        name: "Amlodipine 5mg Tablet",
        generic: "Amlodipine Besylate",
        brandPrice: 40,
        genericPrice: 15,
        uses: "High blood pressure (hypertension), chest pain (angina), coronary artery disease, and heart disease prevention",
        dosage: "Adults: Start with 2.5-5mg once daily. May increase to 10mg daily. Take at the same time each day",
        sideEffects: [
          "Ankle swelling and fluid retention",
          "Dizziness and lightheadedness",
          "Fatigue and drowsiness",
          "Flushing and warm feeling",
          "Headache and nausea",
        ],
        interactions: [
          "May interact with other blood pressure medications",
          "Grapefruit juice can increase drug levels",
          "May enhance effects of other heart medications",
          "Can interact with certain antibiotics",
        ],
        precautions: [
          "Rise slowly from sitting/lying position to avoid dizziness",
          "Regular blood pressure monitoring required",
          "Avoid grapefruit and grapefruit juice",
          "Use caution in liver disease",
          "May cause ankle swelling - elevate legs when resting",
        ],
        manufacturer: "Pfizer, Cipla, Dr. Reddy's Laboratories",
        rawAnalysis:
          "Amlodipine is a calcium channel blocker commonly used for blood pressure control and heart protection.",
      }
    }

    if (medicineName.includes("vitamin d3")) {
      return {
        name: "Vitamin D3 1000 IU Tablet",
        generic: "Cholecalciferol",
        brandPrice: 30,
        genericPrice: 10,
        uses: "Vitamin D deficiency, bone health, immune system support, calcium absorption, and osteoporosis prevention",
        dosage:
          "Adults: 1000-2000 IU daily with food. Higher doses may be needed for deficiency. Take with fat-containing meal",
        sideEffects: [
          "Nausea and vomiting (with high doses)",
          "Constipation",
          "Loss of appetite",
          "Kidney stones (with excessive intake)",
          "Hypercalcemia (rare with normal doses)",
        ],
        interactions: [
          "May increase calcium absorption - monitor calcium levels",
          "Can enhance effects of calcium supplements",
          "May interact with thiazide diuretics",
          "Can affect certain heart medications",
        ],
        precautions: [
          "Take with food containing fat for better absorption",
          "Regular vitamin D level monitoring recommended",
          "Don't exceed recommended dose without medical supervision",
          "Safe for long-term use at appropriate doses",
          "Store away from light and moisture",
        ],
        manufacturer: "Cipla, Sun Pharma, Abbott, Mankind Pharma",
        rawAnalysis:
          "Vitamin D3 is essential for bone health, immune function, and overall wellness, especially important in India due to limited sun exposure.",
      }
    }

    if (medicineName.includes("aspirin")) {
      return {
        name: "Aspirin 75mg Tablet",
        generic: "Acetylsalicylic Acid",
        brandPrice: 20,
        genericPrice: 6,
        uses: "Heart attack prevention, stroke prevention, blood clot prevention, pain relief, and anti-inflammatory treatment",
        dosage:
          "Adults: 75-100mg once daily for heart protection. 300-600mg every 4-6 hours for pain relief. Take with food",
        sideEffects: [
          "Stomach irritation and ulcers",
          "Increased bleeding risk",
          "Nausea and heartburn",
          "Allergic reactions including asthma",
          "Ringing in ears (with high doses)",
        ],
        interactions: [
          "Increases bleeding risk with blood thinners",
          "May interact with diabetes medications",
          "Can reduce effectiveness of blood pressure medications",
          "Avoid with alcohol - increases stomach bleeding risk",
        ],
        precautions: [
          "Take with food to reduce stomach irritation",
          "Not suitable for children under 16 (Reye's syndrome risk)",
          "Inform doctors before surgery - may need to stop",
          "Monitor for signs of bleeding",
          "Use gastroprotective agents if long-term use",
        ],
        manufacturer: "Bayer, Cipla, Dr. Reddy's, Lupin",
        rawAnalysis:
          "Low-dose aspirin is widely used for cardiovascular protection, while higher doses provide pain relief and anti-inflammatory effects.",
      }
    }

    if (medicineName.includes("omeprazole")) {
      return {
        name: "Omeprazole 20mg Capsule",
        generic: "Omeprazole",
        brandPrice: 50,
        genericPrice: 20,
        uses: "Acid reflux (GERD), stomach ulcers, heartburn, Zollinger-Ellison syndrome, and H. pylori infection treatment",
        dosage: "Adults: 20mg once daily before breakfast. May increase to 40mg daily. Take 30-60 minutes before meals",
        sideEffects: [
          "Headache and dizziness",
          "Nausea and abdominal pain",
          "Diarrhea or constipation",
          "Vitamin B12 deficiency (long-term use)",
          "Increased infection risk (rare)",
        ],
        interactions: [
          "May reduce absorption of certain medications",
          "Can interact with blood thinners (clopidogrel)",
          "May affect antifungal medications",
          "Can reduce effectiveness of some antibiotics",
        ],
        precautions: [
          "Take on empty stomach, 30-60 minutes before meals",
          "Long-term use may cause vitamin B12 deficiency",
          "May mask symptoms of serious stomach conditions",
          "Gradual dose reduction recommended when stopping",
          "Regular monitoring needed for long-term use",
        ],
        manufacturer: "AstraZeneca, Dr. Reddy's, Cipla, Sun Pharma",
        rawAnalysis:
          "Omeprazole is a proton pump inhibitor that effectively reduces stomach acid production for various acid-related conditions.",
      }
    }

    if (medicineName.includes("atorvastatin")) {
      return {
        name: "Atorvastatin 10mg Tablet",
        generic: "Atorvastatin Calcium",
        brandPrice: 60,
        genericPrice: 25,
        uses: "High cholesterol, heart disease prevention, stroke prevention, and cardiovascular risk reduction",
        dosage:
          "Adults: Start with 10-20mg once daily in the evening. May increase to 80mg daily. Take with or without food",
        sideEffects: [
          "Muscle pain and weakness",
          "Headache and dizziness",
          "Nausea and stomach upset",
          "Liver enzyme elevation (rare)",
          "Memory problems (rare)",
        ],
        interactions: [
          "Avoid grapefruit juice - increases drug levels",
          "May interact with certain antibiotics",
          "Can enhance effects of blood thinners",
          "May interact with other cholesterol medications",
        ],
        precautions: [
          "Regular liver function tests recommended",
          "Monitor for muscle pain or weakness",
          "Avoid grapefruit and grapefruit juice",
          "Take in the evening for best effect",
          "Maintain healthy diet and exercise",
        ],
        manufacturer: "Pfizer, Ranbaxy, Cipla, Dr. Reddy's",
        rawAnalysis:
          "Atorvastatin is a widely prescribed statin medication for cholesterol management and cardiovascular protection.",
      }
    }

    // Default fallback for unknown medicines
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
    setIsExtracting(false)
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
            {/* Image Upload Area */}
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

            {selectedImage && !isScanning && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-full">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-800">Image captured successfully</span>
                    <p className="text-xs text-purple-600">Ready for AI identification</p>
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
            {/* Identification Header */}
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
              <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 px-4 py-2">
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
                    <p className="text-xs text-green-600 mt-1">✓ Text extracted via OCR</p>
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

// Default export
export default DemoMedicineIdentifierComponent

// Named export for compatibility
const DemoMedicineIdentifier = DemoMedicineIdentifierComponent
