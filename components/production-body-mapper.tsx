"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

export function ProductionBodyMapper() {
  const [selectedPart, setSelectedPart] = useState("")
  const [symptoms, setSymptoms] = useState("")

  const bodyParts = ["Head", "Chest", "Abdomen", "Arms", "Legs", "Back"]

  return (
    <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-700">
          <User className="w-5 h-5 mr-2" />
          Body Symptom Mapper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 p-3 rounded-lg min-h-[100px]">
          {selectedPart ? (
            <div className="text-sm text-orange-800">
              <p>
                <strong>Selected:</strong> {selectedPart}
              </p>
              {symptoms && (
                <p className="mt-2">
                  <strong>Symptoms:</strong> {symptoms}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-orange-600">Select a body part and describe your symptoms...</p>
          )}
        </div>

        <Select value={selectedPart} onValueChange={setSelectedPart}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select body part" />
          </SelectTrigger>
          <SelectContent>
            {bodyParts.map((part) => (
              <SelectItem key={part} value={part}>
                {part}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Describe symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="text-sm"
        />

        <Button variant="outline" size="sm" className="w-full bg-transparent">
          Analyze Symptoms
        </Button>
      </CardContent>
    </Card>
  )
}
