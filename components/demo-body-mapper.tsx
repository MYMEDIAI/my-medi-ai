"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin } from "lucide-react"

export default function DemoBodyMapper() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Array<{ condition: string; probability: number }>>([])

  const bodyParts = [
    {
      name: "Head",
      conditions: [
        { condition: "Tension Headache", probability: 85 },
        { condition: "Migraine", probability: 72 },
        { condition: "Sinus Congestion", probability: 45 },
      ],
    },
    {
      name: "Chest",
      conditions: [
        { condition: "Muscle Strain", probability: 78 },
        { condition: "Acid Reflux", probability: 65 },
        { condition: "Anxiety", probability: 52 },
      ],
    },
    {
      name: "Stomach",
      conditions: [
        { condition: "Indigestion", probability: 82 },
        { condition: "Food Poisoning", probability: 68 },
        { condition: "Gastritis", probability: 55 },
      ],
    },
  ]

  const handleBodyPartClick = (bodyPart: (typeof bodyParts)[0]) => {
    setSelectedBodyPart(bodyPart.name)
    setPredictions(bodyPart.conditions)
  }

  return (
    <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Users className="w-5 h-5 text-red-400" />
          <span className="text-sm">🎯 SYMPTOM BODY MAPPER</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="w-full h-32 bg-gradient-to-b from-red-500/20 to-orange-500/20 rounded flex items-center justify-center relative">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 text-red-400" />
              <p className="text-xs text-gray-100">3D Human Body Model</p>
              <p className="text-xs text-gray-200">(Click areas below to simulate)</p>
            </div>
          </div>

          {/* Interactive Body Parts */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {bodyParts.map((part) => (
              <Button
                key={part.name}
                size="sm"
                onClick={() => handleBodyPartClick(part)}
                className={`text-xs ${
                  selectedBodyPart === part.name
                    ? "bg-red-500/40 border-red-400"
                    : "bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                } text-red-100`}
              >
                {part.name}
              </Button>
            ))}
          </div>
        </div>

        {predictions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-100 font-semibold">AI Predictions for {selectedBodyPart}:</p>
            {predictions.map((pred, idx) => (
              <div key={idx} className="flex justify-between text-xs bg-black/20 rounded p-2">
                <span className="text-gray-100">{pred.condition}</span>
                <span
                  className={`font-semibold ${
                    pred.probability > 75
                      ? "text-red-400"
                      : pred.probability > 60
                        ? "text-orange-400"
                        : "text-yellow-400"
                  }`}
                >
                  {pred.probability}%
                </span>
              </div>
            ))}
          </div>
        )}

        <Button className="w-full bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-100">
          <MapPin className="w-3 h-3 mr-2" />
          Book Nearest Doctor
        </Button>
      </CardContent>
    </Card>
  )
}
