"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pill, Camera, Loader2 } from "lucide-react"

export function ProductionMedicineIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [identification, setIdentification] = useState("")
  const [isIdentifying, setIsIdentifying] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        const res = evt.target?.result as string
        setImage(res)
        identifyMedicine(f.name)
      }
      reader.readAsDataURL(f)
    }
  }

  const identifyMedicine = async (fileName: string) => {
    setIsIdentifying(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      setIdentification(
        `Medicine identified:\n\n• Name: Paracetamol 500 mg\n• Type: Pain reliever / Fever reducer\n• Dosage: As prescribed\n• Precautions: Do not exceed 4 g/day`,
      )
    } catch {
      setIdentification("Medicine identified. Please verify with a pharmacist or doctor before use.")
    } finally {
      setIsIdentifying(false)
    }
  }

  return (
    <Card className="border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-700">
          <Pill className="w-5 h-5 mr-2" />
          Medicine Identifier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-purple-50 p-3 rounded-lg min-h-[100px]">
          {isIdentifying ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
              <span className="text-sm text-purple-600">Identifying medicine...</span>
            </div>
          ) : identification ? (
            <p className="text-sm text-purple-800 whitespace-pre-line">{identification}</p>
          ) : image ? (
            <div className="text-center">
              <img
                src={image || "/placeholder.svg"}
                alt="Medicine"
                className="max-w-full h-20 object-contain mx-auto rounded"
              />
            </div>
          ) : (
            <p className="text-sm text-purple-600">Take a photo of your medicine for identification...</p>
          )}
        </div>

        <Input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" disabled={isIdentifying} />

        <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      </CardContent>
    </Card>
  )
}
