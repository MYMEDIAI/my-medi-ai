"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, Camera, CheckCircle, AlertTriangle } from "lucide-react"

export default function DemoMedicineIdentifier() {
  const [isScanning, setIsScanning] = useState(false)
  const [medicineInfo, setMedicineInfo] = useState<any>(null)

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setMedicineInfo({
        name: "Paracetamol 500mg",
        generic: "Acetaminophen",
        brandPrice: 25,
        genericPrice: 5,
        uses: "Pain relief, fever reduction",
        interactions: ["Avoid with alcohol", "Check with blood thinners"],
        dosage: "1-2 tablets every 6 hours",
      })
      setIsScanning(false)
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Pill className="w-5 h-5 text-blue-400" />
          <span className="text-sm">💊 VISUAL MEDICINE IDENTIFIER</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!medicineInfo ? (
          <>
            <div
              className="bg-black/30 rounded-lg p-4 border-2 border-dashed border-blue-500/30 cursor-pointer hover:border-blue-400/50 transition-colors"
              onClick={handleScan}
            >
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-xs text-gray-100">Snap a photo of any pill/medicine</p>
                <p className="text-xs text-gray-200 mt-1">Click to simulate scan</p>
              </div>
            </div>
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-100"
            >
              {isScanning ? "Scanning..." : "Start Medicine Scan"}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-300">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Medicine Identified</span>
            </div>

            <div className="bg-black/30 rounded p-3 space-y-2">
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
            </div>

            <Button
              onClick={() => setMedicineInfo(null)}
              size="sm"
              className="w-full bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-100"
            >
              Scan Another Medicine
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
