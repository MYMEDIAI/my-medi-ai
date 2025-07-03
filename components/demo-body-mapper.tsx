"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, AlertCircle, Stethoscope, ArrowRight, Loader2 } from "lucide-react"

interface BodyPart {
  id: string
  name: string
  x: number
  y: number
  symptoms?: string[]
}

const bodyParts: BodyPart[] = [
  { id: "head", name: "Head", x: 50, y: 15, symptoms: ["Headache", "Dizziness", "Migraine"] },
  { id: "chest", name: "Chest", x: 50, y: 35, symptoms: ["Chest pain", "Breathing difficulty", "Heart palpitations"] },
  { id: "abdomen", name: "Abdomen", x: 50, y: 50, symptoms: ["Stomach pain", "Nausea", "Bloating"] },
  { id: "left-arm", name: "Left Arm", x: 25, y: 40, symptoms: ["Arm pain", "Numbness", "Weakness"] },
  { id: "right-arm", name: "Right Arm", x: 75, y: 40, symptoms: ["Arm pain", "Numbness", "Weakness"] },
  { id: "left-leg", name: "Left Leg", x: 40, y: 75, symptoms: ["Leg pain", "Swelling", "Cramps"] },
  { id: "right-leg", name: "Right Leg", x: 60, y: 75, symptoms: ["Leg pain", "Swelling", "Cramps"] },
]

function DemoBodyMapperComponent() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null)
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handlePartClick = (part: BodyPart) => {
    setSelectedPart(part)
    setSymptoms("")
    setAnalysis("")
  }

  const analyzeSymptoms = async () => {
    if (!selectedPart || !symptoms.trim()) return

    setIsAnalyzing(true)
    try {
      // Create a comprehensive prompt for AI symptom analysis
      const analysisPrompt = `
Please analyze these symptoms for the ${selectedPart.name.toLowerCase()}:

**Body Part**: ${selectedPart.name}
**Symptoms Described**: ${symptoms}

As an AI medical assistant, provide a comprehensive analysis including:

1. **Symptom Assessment**: 
   - Evaluation of the described symptoms
   - Possible severity level
   - Duration considerations

2. **Potential Causes**:
   - Common conditions that could cause these symptoms
   - Less common but important possibilities
   - When symptoms might be related to other body systems

3. **Immediate Care Recommendations**:
   - Self-care measures that might help
   - Over-the-counter treatments to consider
   - Activities to avoid

4. **Warning Signs**:
   - Symptoms that would require immediate medical attention
   - Red flags to watch for
   - When to call emergency services

5. **Follow-up Care**:
   - When to see a doctor
   - What type of specialist might be needed
   - Questions to ask healthcare providers

6. **Prevention Tips**:
   - How to prevent similar symptoms in the future
   - Lifestyle modifications that might help
   - Risk factors to be aware of

Please provide practical, actionable advice while emphasizing the importance of professional medical consultation for proper diagnosis and treatment.

Note: This analysis is for educational purposes and should not replace professional medical advice.
`

      // Call the actual AI integration API
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "symptom-analysis",
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
        throw new Error("No analysis received from AI")
      }

      setAnalysis(aiResponse)
    } catch (error) {
      console.error("Symptom analysis error:", error)

      // Provide fallback analysis
      const fallbackAnalysis = generateFallbackAnalysis(selectedPart, symptoms)
      setAnalysis(fallbackAnalysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateFallbackAnalysis = (part: BodyPart, symptomDescription: string): string => {
    const commonAdvice = `
**AI Analysis for ${part.name} Symptoms**

**Symptom Assessment:**
Based on your description of symptoms in the ${part.name.toLowerCase()}, here are some general considerations:

**Immediate Care Recommendations:**
• Rest and avoid activities that worsen the symptoms
• Apply appropriate hot or cold therapy as comfortable
• Stay hydrated and maintain good nutrition
• Monitor symptom changes over time

**When to Seek Medical Care:**
• If symptoms persist for more than a few days
• If symptoms worsen significantly
• If you experience severe pain or discomfort
• If symptoms interfere with daily activities

**Warning Signs - Seek Immediate Medical Attention:**
• Severe, sudden onset pain
• Difficulty breathing or swallowing
• Signs of infection (fever, redness, swelling)
• Loss of function or mobility
• Any symptoms that concern you

**General Prevention:**
• Maintain good posture and ergonomics
• Stay physically active within your limits
• Manage stress levels
• Follow a healthy diet and lifestyle

**Important Note:**
This is general information only. AI analysis is temporarily unavailable. For proper diagnosis and treatment, please consult with a qualified healthcare professional who can perform a physical examination and consider your complete medical history.

**Next Steps:**
Consider scheduling an appointment with your primary care physician or appropriate specialist for a proper evaluation of your symptoms.
`

    return commonAdvice
  }

  const resetMapper = () => {
    setSelectedPart(null)
    setSymptoms("")
    setAnalysis("")
  }

  return (
    <Card className="border-orange-100 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-700">
          <User className="w-5 h-5 mr-2" />
          🗺️ AI Body Symptom Mapper
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
            Live AI
          </Badge>
          <span className="text-xs text-gray-500">Powered by Gemini AI</span>
        </div>
        <p className="text-sm text-gray-600">Click on a body part and describe your symptoms for AI analysis</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Body Diagram */}
        <div className="relative bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg p-6 min-h-[300px]">
          <div className="relative w-full h-64 mx-auto">
            {/* Simple body outline */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Body outline */}
              <ellipse cx="50" cy="12" rx="8" ry="10" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="42" y="22" width="16" height="25" rx="3" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="42" y="47" width="16" height="20" rx="3" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="25" y="25" width="12" height="20" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="63" y="25" width="12" height="20" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="38" y="67" width="8" height="25" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
              <rect x="54" y="67" width="8" height="25" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
            </svg>

            {/* Clickable body parts */}
            {bodyParts.map((part) => (
              <button
                key={part.id}
                className={`absolute w-4 h-4 rounded-full border-2 transform -translate-x-2 -translate-y-2 transition-all duration-200 ${
                  selectedPart?.id === part.id
                    ? "bg-orange-500 border-orange-600 scale-125"
                    : "bg-orange-300 border-orange-400 hover:bg-orange-400 hover:scale-110"
                }`}
                style={{ left: `${part.x}%`, top: `${part.y}%` }}
                onClick={() => handlePartClick(part)}
                title={part.name}
                disabled={isAnalyzing}
              >
                <MapPin className="w-2 h-2 text-white absolute top-0.5 left-0.5" />
              </button>
            ))}
          </div>

          {selectedPart && (
            <div className="mt-4 text-center">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Selected: {selectedPart.name}</Badge>
            </div>
          )}
        </div>

        {/* Symptom Input */}
        {selectedPart && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your symptoms in the {selectedPart.name.toLowerCase()}:
              </label>
              <Textarea
                placeholder={`Describe any pain, discomfort, or symptoms you're experiencing in your ${selectedPart.name.toLowerCase()}...`}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px]"
                disabled={isAnalyzing}
              />
            </div>

            {selectedPart.symptoms && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Common symptoms for this area:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPart.symptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant="outline"
                      className="cursor-pointer hover:bg-orange-50"
                      onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${symptom}` : symptom))}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={analyzeSymptoms}
                disabled={!symptoms.trim() || isAnalyzing}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
              <Button onClick={resetMapper} variant="outline" disabled={isAnalyzing}>
                Reset
              </Button>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <h4 className="font-semibold text-orange-900">AI Analysis Results</h4>
            </div>
            <div className="text-sm text-orange-800 whitespace-pre-line max-h-64 overflow-y-auto">{analysis}</div>
          </div>
        )}

        {!selectedPart && (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Click on any body part above to start mapping your symptoms</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
            <a href="/body-mapper">
              Open Full Body Mapper
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Default export
export default DemoBodyMapperComponent

// Named export for compatibility
export const DemoBodyMapper = DemoBodyMapperComponent

// Type export
export type { BodyPart }
