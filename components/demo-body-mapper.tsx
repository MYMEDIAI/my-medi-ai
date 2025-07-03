"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, MapPin, CheckCircle, AlertTriangle, Loader2, ArrowRight, Activity, Clock, Shield } from "lucide-react"

interface SymptomAnalysis {
  bodyPart: string
  symptoms: string[]
  possibleCauses: string[]
  severity: "mild" | "moderate" | "severe"
  urgency: "routine" | "soon" | "urgent"
  recommendations: string[]
  warningSigns: string[]
  selfCare: string[]
  whenToSeek: string
  rawAnalysis: string
}

function DemoBodyMapperComponent() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [symptomAnalysis, setSymptomAnalysis] = useState<SymptomAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const bodyParts = [
    { name: "Head", position: { top: "10%", left: "45%" }, symptoms: "Headache, dizziness, vision problems" },
    { name: "Neck", position: { top: "20%", left: "45%" }, symptoms: "Neck pain, stiffness, swollen glands" },
    { name: "Chest", position: { top: "30%", left: "45%" }, symptoms: "Chest pain, breathing difficulty, cough" },
    { name: "Abdomen", position: { top: "45%", left: "45%" }, symptoms: "Stomach pain, nausea, bloating" },
    { name: "Back", position: { top: "35%", left: "55%" }, symptoms: "Back pain, muscle spasms, stiffness" },
    { name: "Arms", position: { top: "35%", left: "25%" }, symptoms: "Arm pain, numbness, weakness" },
    { name: "Legs", position: { top: "65%", left: "40%" }, symptoms: "Leg pain, swelling, cramps" },
  ]

  const commonSymptoms = [
    "Persistent headache for 3 days",
    "Sharp chest pain when breathing",
    "Lower back pain after lifting",
    "Stomach pain with nausea",
    "Neck stiffness and headache",
    "Leg swelling and pain",
  ]

  const handleBodyPartClick = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart)
    analyzeSymptoms(bodyPart, `General symptoms in ${bodyPart}`)
  }

  const handleSymptomClick = (symptom: string) => {
    const bodyPart =
      symptom.includes("headache") || symptom.includes("neck")
        ? "Head/Neck"
        : symptom.includes("chest")
          ? "Chest"
          : symptom.includes("back")
            ? "Back"
            : symptom.includes("stomach")
              ? "Abdomen"
              : symptom.includes("leg")
                ? "Legs"
                : "General"

    setSelectedBodyPart(bodyPart)
    analyzeSymptoms(bodyPart, symptom)
  }

  const analyzeSymptoms = async (bodyPart: string, symptoms: string) => {
    setIsAnalyzing(true)
    setError("")

    try {
      // Create a comprehensive prompt for AI symptom analysis
      const analysisPrompt = `
Please analyze these symptoms for the ${bodyPart} area: ${symptoms}

As an AI diagnostic assistant specializing in symptom analysis, provide comprehensive assessment including:

1. **Symptom Assessment**: 
   - Detailed interpretation of the reported symptoms
   - How these symptoms typically present and progress
   - Associated symptoms that commonly occur together

2. **Possible Causes**: 
   - Range from most common to less common causes
   - Include both minor and serious conditions to consider
   - Differentiate between acute and chronic conditions
   - Consider age-related and lifestyle factors

3. **Severity Assessment**: 
   - Rate as mild, moderate, or severe based on symptom description
   - Factors that would increase or decrease severity
   - Red flag symptoms that indicate serious conditions

4. **Urgency Level**: 
   - Routine care (can wait for regular appointment)
   - Soon (should be seen within days)
   - Urgent (needs immediate medical attention)

5. **Self-Care Recommendations**: 
   - Safe home remedies and comfort measures
   - Activity modifications and rest recommendations
   - Over-the-counter treatments that may help
   - What to monitor and track

6. **Warning Signs**: 
   - Specific symptoms that require immediate medical attention
   - Changes that indicate worsening condition
   - Emergency situations to watch for

7. **When to Seek Medical Care**: 
   - Clear guidelines on when to contact healthcare provider
   - What type of healthcare provider to see (primary care, specialist, emergency)
   - Information to have ready when calling doctor

8. **Prevention and Lifestyle**: 
   - Ways to prevent recurrence
   - Lifestyle modifications that may help
   - Long-term management strategies

Please provide practical, evidence-based guidance appropriate for Indian healthcare context. Include specific timeframes, clear action steps, and emphasize when professional medical evaluation is essential.

Focus on being helpful while maintaining appropriate medical caution and emphasizing the importance of professional medical assessment for proper diagnosis and treatment.
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

      // Parse the AI response and structure it
      const structuredAnalysis = parseAISymptomAnalysis(aiResponse, bodyPart, symptoms)
      setSymptomAnalysis(structuredAnalysis)
    } catch (error) {
      console.error("Symptom analysis error:", error)
      setError("Unable to analyze symptoms. Please try again.")

      // Provide fallback analysis
      const fallbackAnalysis = generateFallbackAnalysis(bodyPart, symptoms)
      setSymptomAnalysis(fallbackAnalysis)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const parseAISymptomAnalysis = (aiResponse: string, bodyPart: string, symptoms: string): SymptomAnalysis => {
    const analysis: SymptomAnalysis = {
      bodyPart,
      symptoms: [symptoms],
      possibleCauses: [],
      severity: "moderate",
      urgency: "soon",
      recommendations: [],
      warningSigns: [],
      selfCare: [],
      whenToSeek: "Consult healthcare provider if symptoms persist or worsen",
      rawAnalysis: aiResponse,
    }

    // Parse possible causes
    const causesMatch = aiResponse.match(
      /(?:possible causes?|causes?|conditions?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (causesMatch) {
      const causes = causesMatch[0].split(/[•\-*]\s*/).filter((c) => c.trim().length > 10)
      analysis.possibleCauses = causes.slice(0, 5).map((c) => c.trim())
    }

    // Parse recommendations
    const recommendationsMatch = aiResponse.match(
      /(?:recommendations?|self-care|home remedies?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (recommendationsMatch) {
      const recommendations = recommendationsMatch[0].split(/[•\-*]\s*/).filter((r) => r.trim().length > 10)
      analysis.recommendations = recommendations.slice(0, 5).map((r) => r.trim())
    }

    // Parse warning signs
    const warningMatch = aiResponse.match(
      /(?:warning signs?|red flags?|emergency)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (warningMatch) {
      const warnings = warningMatch[0].split(/[•\-*]\s*/).filter((w) => w.trim().length > 10)
      analysis.warningSigns = warnings.slice(0, 4).map((w) => w.trim())
    }

    // Parse self-care
    const selfCareMatch = aiResponse.match(
      /(?:self-care|home care|comfort measures?)[\s\S]*?(?=\n\s*(?:\d+\.|[A-Z][a-z]+:|$))/i,
    )
    if (selfCareMatch) {
      const selfCare = selfCareMatch[0].split(/[•\-*]\s*/).filter((s) => s.trim().length > 10)
      analysis.selfCare = selfCare.slice(0, 4).map((s) => s.trim())
    }

    // Determine severity and urgency
    if (aiResponse.toLowerCase().includes("severe") || aiResponse.toLowerCase().includes("emergency")) {
      analysis.severity = "severe"
      analysis.urgency = "urgent"
    } else if (aiResponse.toLowerCase().includes("mild") || aiResponse.toLowerCase().includes("minor")) {
      analysis.severity = "mild"
      analysis.urgency = "routine"
    }

    return analysis
  }

  const generateFallbackAnalysis = (bodyPart: string, symptoms: string): SymptomAnalysis => {
    if (symptoms.includes("headache")) {
      return {
        bodyPart: "Head",
        symptoms: ["Persistent headache"],
        possibleCauses: [
          "Tension headache from stress or poor posture",
          "Dehydration or lack of sleep",
          "Eye strain from screen time",
          "Sinus congestion or infection",
          "Migraine headache",
        ],
        severity: "moderate",
        urgency: "soon",
        recommendations: [
          "Rest in a quiet, dark room",
          "Apply cold compress to forehead",
          "Stay well hydrated",
          "Consider over-the-counter pain relief",
          "Practice relaxation techniques",
        ],
        warningSigns: [
          "Sudden, severe headache unlike any before",
          "Headache with fever and stiff neck",
          "Headache with vision changes",
          "Headache after head injury",
        ],
        selfCare: [
          "Maintain regular sleep schedule",
          "Manage stress levels",
          "Stay hydrated throughout the day",
          "Take breaks from screen time",
        ],
        whenToSeek: "See a doctor if headache persists more than 3 days or is severe",
        rawAnalysis: "AI analysis temporarily unavailable. This is general guidance for headache symptoms.",
      }
    }

    return {
      bodyPart,
      symptoms: [symptoms],
      possibleCauses: [
        "Common conditions related to this body area",
        "Muscle strain or overuse",
        "Minor injury or inflammation",
        "Stress-related symptoms",
      ],
      severity: "moderate",
      urgency: "soon",
      recommendations: [
        "Rest the affected area",
        "Apply ice or heat as appropriate",
        "Gentle stretching or movement",
        "Over-the-counter pain relief if needed",
      ],
      warningSigns: [
        "Severe or worsening pain",
        "Signs of infection (fever, redness, swelling)",
        "Loss of function or mobility",
        "Numbness or tingling",
      ],
      selfCare: [
        "Monitor symptoms closely",
        "Maintain good posture",
        "Stay active within comfort limits",
        "Get adequate rest",
      ],
      whenToSeek: "Consult healthcare provider if symptoms persist or worsen",
      rawAnalysis:
        "AI analysis temporarily unavailable. Please consult with a healthcare professional for proper assessment.",
    }
  }

  const resetMapper = () => {
    setSelectedBodyPart(null)
    setSymptomAnalysis(null)
    setError("")
    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity: "mild" | "moderate" | "severe") => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 border-red-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getUrgencyColor = (urgency: "routine" | "soon" | "urgent") => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
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
          <span className="text-xs text-gray-500">Powered by OpenAI GPT-4</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!symptomAnalysis ? (
          <>
            {/* Body Map */}
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                Click on a body part to analyze symptoms:
              </p>
              <div className="relative mx-auto w-48 h-64 bg-blue-50 rounded-full border-2 border-blue-200">
                {bodyParts.map((part) => (
                  <Button
                    key={part.name}
                    size="sm"
                    variant="outline"
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs px-2 py-1 h-auto hover:bg-orange-100 hover:border-orange-300 bg-transparent"
                    style={{ top: part.position.top, left: part.position.left }}
                    onClick={() => handleBodyPartClick(part.name)}
                    disabled={isAnalyzing}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    {part.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Common Symptoms */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Or select a common symptom:</p>
              <div className="grid grid-cols-1 gap-2">
                {commonSymptoms.map((symptom, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSymptomClick(symptom)}
                    disabled={isAnalyzing}
                    className="text-xs text-left justify-start h-auto py-2 px-3 hover:bg-orange-50 hover:border-orange-200"
                  >
                    <Activity className="w-3 h-3 mr-2" />
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>

            {isAnalyzing && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-orange-800">Analyzing Symptoms...</p>
                    <p className="text-xs text-orange-600">OpenAI is processing your health data</p>
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
            {/* Analysis Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">AI Symptom Analysis</h4>
              </div>
              <div className="flex gap-2">
                <Badge className={getSeverityColor(symptomAnalysis.severity)}>
                  {symptomAnalysis.severity.toUpperCase()}
                </Badge>
                <Badge className={getUrgencyColor(symptomAnalysis.urgency)}>
                  {symptomAnalysis.urgency.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Body Part & Symptoms */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-gray-800">{symptomAnalysis.bodyPart}</span>
              </div>
              <div className="space-y-1">
                {symptomAnalysis.symptoms.map((symptom, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    • {symptom}
                  </p>
                ))}
              </div>
            </div>

            {/* Possible Causes */}
            {symptomAnalysis.possibleCauses.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800">Possible Causes:</h5>
                <ul className="space-y-1">
                  {symptomAnalysis.possibleCauses.map((cause, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Self-Care Recommendations */}
            {symptomAnalysis.selfCare.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Self-Care Recommendations:
                </h5>
                <ul className="space-y-1">
                  {symptomAnalysis.selfCare.map((care, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {care}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning Signs */}
            {symptomAnalysis.warningSigns.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Warning Signs - Seek Immediate Care:
                </h5>
                <ul className="space-y-1">
                  {symptomAnalysis.warningSigns.map((warning, idx) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* When to Seek Care */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="font-medium text-blue-800 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                When to Seek Medical Care:
              </h5>
              <p className="text-sm text-blue-700">{symptomAnalysis.whenToSeek}</p>
            </div>

            {/* Raw AI Analysis */}
            <details className="bg-gray-50 rounded-lg p-3">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                View Full AI Analysis
              </summary>
              <div className="mt-2 text-xs text-gray-600 whitespace-pre-line max-h-32 overflow-y-auto">
                {symptomAnalysis.rawAnalysis}
              </div>
            </details>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                This AI symptom analysis is for educational purposes only. It does not replace professional medical
                diagnosis. Always consult healthcare providers for proper medical evaluation and treatment.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={resetMapper} variant="outline" size="sm" className="flex-1 bg-transparent">
                Analyze Other Symptoms
              </Button>
              <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700" asChild>
                <a href="/chat">
                  Discuss with AI Doctor
                  <ArrowRight className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
            <a href="/body-mapper">
              Open Full Body Symptom Mapper
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
