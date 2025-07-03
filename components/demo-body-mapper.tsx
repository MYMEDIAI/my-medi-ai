"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  MapPin,
  Stethoscope,
  ExternalLink,
  Heart,
  Activity,
  Zap,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface SymptomAnalysis {
  bodyPart: string
  symptoms: string
  possibleCauses: string[]
  recommendations: string[]
  urgencyLevel: "Low" | "Medium" | "High"
  whenToSeeDoctor: string
  homeRemedies: string[]
}

export default function DemoBodyMapper() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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

  const handleBodyPartClick = async (part: (typeof bodyParts)[0]) => {
    setSelectedPart(part.name)
    if (symptoms.trim()) {
      await analyzeSymptoms(part.name, symptoms)
    }
  }

  const analyzeSymptoms = async (bodyPart: string, symptomDescription: string) => {
    setIsAnalyzing(true)

    try {
      const analysisPrompt = `
Analyze these symptoms for medical assessment:
Body Part: ${bodyPart}
Symptoms: ${symptomDescription}

Please provide:
1. Possible causes for these symptoms in this body part
2. Urgency level (Low/Medium/High)
3. Specific recommendations for care
4. When to see a doctor immediately
5. Safe home remedies or self-care measures
6. Warning signs to watch for
7. Lifestyle modifications that might help

Provide practical, safe medical guidance suitable for Indian patients. Always emphasize consulting healthcare professionals for proper diagnosis.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "symptom-analysis",
        }),
      })

      const data = await response.json()

      if (data.response) {
        // Parse AI response into structured format
        const aiText = data.response

        setAnalysis({
          bodyPart,
          symptoms: symptomDescription,
          possibleCauses: extractListFromText(aiText, "cause") || [
            "Multiple factors could contribute to these symptoms",
            "Proper medical evaluation needed for accurate diagnosis",
          ],
          recommendations: extractListFromText(aiText, "recommend") || [
            "Rest and monitor symptoms",
            "Stay hydrated",
            "Avoid strenuous activities",
          ],
          urgencyLevel: extractUrgencyLevel(aiText),
          whenToSeeDoctor:
            extractSection(aiText, "doctor") || "Consult a healthcare provider if symptoms persist or worsen",
          homeRemedies: extractListFromText(aiText, "home") || [
            "Apply appropriate hot/cold therapy",
            "Get adequate rest",
            "Maintain proper posture",
          ],
        })
      } else {
        throw new Error("No analysis received")
      }
    } catch (error) {
      console.error("Symptom analysis error:", error)
      // Provide fallback analysis
      setAnalysis({
        bodyPart,
        symptoms: symptomDescription,
        possibleCauses: [
          "Various factors could be contributing to your symptoms",
          "Professional medical evaluation recommended",
        ],
        recommendations: [
          "Monitor symptoms closely",
          "Rest and avoid aggravating activities",
          "Consult healthcare provider for proper diagnosis",
        ],
        urgencyLevel: "Medium",
        whenToSeeDoctor: "Consult a doctor if symptoms persist for more than 2-3 days or worsen",
        homeRemedies: ["Apply appropriate hot or cold therapy", "Get adequate rest", "Stay hydrated"],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const extractListFromText = (text: string, keyword: string): string[] => {
    const lines = text.split("\n")
    const items: string[] = []
    let capturing = false

    for (const line of lines) {
      if (line.toLowerCase().includes(keyword)) {
        capturing = true
        continue
      }
      if ((capturing && line.trim().startsWith("•")) || line.trim().startsWith("-") || line.match(/^\d+\./)) {
        items.push(line.trim().replace(/^[•\-\d.]\s*/, ""))
      } else if (capturing && line.trim() === "") {
        break
      }
    }

    return items.slice(0, 4) // Limit to 4 items
  }

  const extractSection = (text: string, keyword: string): string => {
    const lines = text.split("\n")
    let section = ""
    let capturing = false

    for (const line of lines) {
      if (line.toLowerCase().includes(keyword)) {
        capturing = true
        section = line
        continue
      }
      if (capturing) {
        if (line.trim() === "" || line.match(/^\d+\./)) {
          if (section.length > 30) break
        }
        section += " " + line.trim()
      }
    }

    return section.trim()
  }

  const extractUrgencyLevel = (text: string): "Low" | "Medium" | "High" => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("high") || lowerText.includes("urgent") || lowerText.includes("emergency")) {
      return "High"
    } else if (lowerText.includes("medium") || lowerText.includes("moderate")) {
      return "Medium"
    }
    return "Low"
  }

  const resetMapper = () => {
    setSelectedPart(null)
    setSymptoms("")
    setAnalysis(null)
    setIsAnalyzing(false)
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  return (
    <Card className="border-orange-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <User className="w-5 h-5 mr-2" />
          AI Body Symptom Mapper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {!analysis ? (
          <>
            {/* Interactive Body Diagram */}
            <div className="relative bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl p-8 min-h-[300px]">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Click on the body part where you feel symptoms</h3>
                <p className="text-sm text-gray-600">Interactive body mapping for symptom analysis</p>
              </div>

              {/* Simple Body Outline */}
              <div className="relative mx-auto w-48 h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full opacity-20"></div>

              {/* Body Part Buttons */}
              <div className="absolute inset-0">
                {bodyParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handleBodyPartClick(part)}
                    className={`absolute w-8 h-8 rounded-full ${part.color} hover:scale-125 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white`}
                    style={{ left: `${part.x}%`, top: `${part.y}%`, transform: "translate(-50%, -50%)" }}
                    title={part.name}
                  >
                    <MapPin className="w-4 h-4 text-white mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            {selectedPart && (
              <Alert className="border-blue-200 bg-blue-50">
                <MapPin className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Selected: <strong>{selectedPart}</strong>. Describe your symptoms below for AI analysis.
                </AlertDescription>
              </Alert>
            )}

            {/* Symptom Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your symptoms in detail</label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe the pain, discomfort, or symptoms you're experiencing..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <Button
                onClick={() => selectedPart && analyzeSymptoms(selectedPart, symptoms)}
                disabled={!selectedPart || !symptoms.trim() || isAnalyzing}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Analyze Symptoms with AI
                  </>
                )}
              </Button>
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                This tool provides general information only. For medical emergencies, contact emergency services
                immediately.
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Symptom Analysis Complete</h3>
              </div>
              <Badge className={getUrgencyColor(analysis.urgencyLevel)}>{analysis.urgencyLevel} Priority</Badge>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Analysis for: {analysis.bodyPart}</h4>
              <p className="text-sm text-gray-700">{analysis.symptoms}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-500" />
                    Possible Causes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1">
                    {analysis.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-green-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-purple-500" />
                  Home Remedies & Self-Care
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {analysis.homeRemedies.map((remedy, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="text-purple-500 mr-2">•</span>
                      {remedy}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Alert className={`border-2 ${getUrgencyColor(analysis.urgencyLevel)}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>When to see a doctor:</strong> {analysis.whenToSeeDoctor}
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button onClick={resetMapper} variant="outline" className="flex-1 bg-transparent">
                Analyze Another Symptom
              </Button>
              <Button
                onClick={() => window.open("/chat", "_blank")}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Consult AI Doctor
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
