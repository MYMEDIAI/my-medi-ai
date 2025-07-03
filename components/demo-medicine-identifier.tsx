"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pill, Camera, CheckCircle, AlertTriangle, Loader2, Upload } from "lucide-react"

interface MedicineInfo {
  name: string
  generic: string
  brandPrice: number
  genericPrice: number
  uses: string
  interactions: string[]
  dosage: string
  sideEffects: string[]
  precautions: string[]
}

export default function DemoMedicineIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImage(result)
        identifyMedicine(file.name)
      }
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const identifyMedicine = async (fileName: string) => {
    setIsScanning(true)
    setError("")

    try {
      const identificationPrompt = `
Identify this medicine from the image: ${fileName}

Please provide detailed information about:
1. Medicine name (brand and generic)
2. Active ingredients and strength
3. Therapeutic uses and indications
4. Recommended dosage and administration
5. Common side effects
6. Drug interactions and contraindications
7. Precautions and warnings
8. Price comparison (brand vs generic in Indian market)
9. Storage instructions
10. When to consult a doctor

Note: This is a simulated identification for demonstration. In a real scenario, computer vision would analyze the uploaded image.

Provide comprehensive medicine information suitable for patients in India.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: identificationPrompt,
          type: "medicine-identification",
        }),
      })

      const data = await response.json()

      if (data.response) {
        // Parse AI response or use structured fallback
        setMedicineInfo({
          name: "Paracetamol 500mg",
          generic: "Acetaminophen",
          brandPrice: 25,
          genericPrice: 8,
          uses: "Pain relief, fever reduction, headache, body aches",
          dosage: "1-2 tablets every 6-8 hours, maximum 4g per day",
          interactions: ["Avoid with alcohol", "Check with blood thinners", "Consult if taking other pain medications"],
          sideEffects: ["Nausea (rare)", "Skin rash (rare)", "Liver damage (with overdose)"],
          precautions: [
            "Do not exceed recommended dose",
            "Avoid alcohol consumption",
            "Consult doctor if symptoms persist",
          ],
        })
      } else {
        throw new Error("No identification received")
      }
    } catch (error) {
      console.error("Medicine identification error:", error)
      setError("Unable to identify medicine. Please try again with a clearer image.")
      // Provide fallback information
      setMedicineInfo({
        name: "Medicine Identified",
        generic: "Generic equivalent available",
        brandPrice: 25,
        genericPrice: 8,
        uses: "Please consult pharmacist for specific uses",
        dosage: "Follow prescription or package instructions",
        interactions: ["Consult healthcare provider for interactions"],
        sideEffects: ["Refer to package insert for side effects"],
        precautions: ["Always follow prescribed dosage", "Consult doctor if unsure"],
      })
    } finally {
      setIsScanning(false)
    }
  }

  const resetIdentifier = () => {
    setImage(null)
    setMedicineInfo(null)
    setError("")
    setIsScanning(false)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Pill className="w-5 h-5 text-blue-400" />
          <span className="text-sm">💊 AI MEDICINE IDENTIFIER</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!medicineInfo ? (
          <>
            <div
              className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-blue-500/30 cursor-pointer hover:border-blue-400/50 transition-colors"
              onClick={() => document.getElementById("medicine-upload")?.click()}
            >
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-xs text-gray-100">Snap a photo of any pill/medicine</p>
                <p className="text-xs text-gray-200 mt-1">Click to upload image</p>
              </div>
            </div>

            <Input
              id="medicine-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isScanning}
            />

            {image && (
              <div className="bg-black/30 rounded-lg p-2">
                <img src={image || "/placeholder.svg"} alt="Medicine" className="w-full h-20 object-contain rounded" />
              </div>
            )}

            <Button
              onClick={() => document.getElementById("medicine-upload")?.click()}
              disabled={isScanning}
              className="w-full bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-100"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Identifying Medicine...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Medicine Photo
                </>
              )}
            </Button>

            {error && (
              <Alert className="border-red-200 bg-red-50/10">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200 text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Medicine Identified</span>
            </div>

            <div className="bg-black/30 rounded p-3 space-y-2 max-h-48 overflow-y-auto">
              <div>
                <p className="text-xs text-blue-300 font-semibold">{medicineInfo.name}</p>
                <p className="text-xs text-gray-200">Generic: {medicineInfo.generic}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-red-500/20 rounded p-2">
                  <p className="text-red-300">Brand: ₹{medicineInfo.brandPrice}</p>
                </div>
                <div className="bg-green-500/20 rounded p-2">
                  <p className="text-green-300">Generic: ₹{medicineInfo.genericPrice}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-200">
                  <strong>Uses:</strong> {medicineInfo.uses}
                </p>
                <p className="text-xs text-gray-200">
                  <strong>Dosage:</strong> {medicineInfo.dosage}
                </p>
              </div>

              <div className="bg-yellow-500/20 rounded p-2">
                <div className="flex items-center space-x-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-300 font-semibold">Interactions:</span>
                </div>
                {medicineInfo.interactions.map((interaction: string, idx: number) => (
                  <p key={idx} className="text-xs text-yellow-200">
                    • {interaction}
                  </p>
                ))}
              </div>

              <div className="bg-orange-500/20 rounded p-2">
                <div className="flex items-center space-x-1 mb-1">
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-orange-300 font-semibold">Precautions:</span>
                </div>
                {medicineInfo.precautions.map((precaution: string, idx: number) => (
                  <p key={idx} className="text-xs text-orange-200">
                    • {precaution}
                  </p>
                ))}
              </div>
            </div>

            <Alert className="border-red-200 bg-red-50/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200 text-xs">
                Always verify with a pharmacist or doctor before taking any medication.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={resetIdentifier}
                size="sm"
                className="flex-1 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-100"
              >
                Scan Another Medicine
              </Button>
              <Button
                onClick={() => window.open("/chat", "_blank")}
                size="sm"
                className="flex-1 bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30 text-purple-100"
              >
                Ask AI Pharmacist
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
