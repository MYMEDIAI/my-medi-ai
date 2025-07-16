"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Stethoscope, ExternalLink, Heart, Activity, Zap } from "lucide-react"

export default function DemoBodyMapper() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState("")

  const bodyParts = [
    { id: "head", name: "Head", x: 50, y: 15, color: "bg-red-500" },
    { id: "neck", name: "Neck", x: 50, y: 25, color: "bg-orange-500" },
    { id: "chest", name: "Chest", x: 50, y: 40, color: "bg-blue-500" },
    { id: "abdomen", name: "Abdomen", x: 50, y: 55, color: "bg-green-500" },
    { id: "left-arm", name: "Left Arm", x: 25, y: 45, color: "bg-purple-500" },
    { id: "right-arm", name: "Right Arm", x: 75, y: 45, color: "bg-purple-500" },
    { id: "left-leg", name: "Left Leg", x: 40, y: 80, color: "bg-indigo-500" },
    { id: "right-leg", name: "Right Leg", x: 60, y: 80, color: "bg-indigo-500" },
  ]

  const handleBodyPartClick = (part: (typeof bodyParts)[0]) => {
    setSelectedPart(part.name)
    // Open assessment page in new tab with pre-filled data
    const assessmentUrl = `/assessment?bodyPart=${encodeURIComponent(part.name)}&symptoms=${encodeURIComponent(symptoms)}`
    window.open(assessmentUrl, "_blank")
  }

  const handleBookDoctor = () => {
    // Open assessment page in new tab
    window.open("/assessment", "_blank")
  }

  return (
    <Card className="border-orange-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <User className="w-5 h-5 mr-2" />
          Interactive Body Symptom Mapper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Interactive Body Diagram */}
        <div className="relative bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl p-8 min-h-[300px]">
          <div className="text-center mb-4">
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
              Click on any body part to start assessment
            </Badge>
          </div>

          {/* Simple Body Outline */}
          <div className="relative mx-auto w-32 h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full opacity-20"></div>

          {/* Interactive Body Parts */}
          {bodyParts.map((part) => (
            <button
              key={part.id}
              onClick={() => handleBodyPartClick(part)}
              className={`absolute w-6 h-6 ${part.color} rounded-full hover:scale-150 transition-all duration-300 hover:shadow-lg cursor-pointer border-2 border-white hover:border-yellow-300`}
              style={{
                left: `${part.x}%`,
                top: `${part.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={`Click to assess ${part.name}`}
            >
              <span className="sr-only">{part.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Part Display */}
        {selectedPart && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-800">Selected: {selectedPart}</span>
            </div>
            {symptoms && (
              <p className="text-sm text-green-700">
                <strong>Symptoms:</strong> {symptoms}
              </p>
            )}
          </div>
        )}

        {/* Symptom Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Describe your symptoms:</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., sharp pain, dull ache, burning sensation..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handleBookDoctor}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            Start Health Assessment
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
              onClick={() => window.open("/chat", "_blank")}
            >
              <Heart className="w-4 h-4 mr-1" />
              AI Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100"
              onClick={() => window.open("/vitals", "_blank")}
            >
              <Activity className="w-4 h-4 mr-1" />
              Track Vitals
            </Button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <Zap className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Quick Tip:</strong> Click on the body part where you feel discomfort for a targeted health
              assessment with AI recommendations.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
