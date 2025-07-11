"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  Zap,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Home,
  RotateCcw,
  MessageCircle,
  Apple,
  Baby,
  UserCheck,
  Target,
  Clock,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface SymptomAnalysis {
  bodyPart: string
  symptoms: string
  possibleCauses: string[]
  recommendations: string[]
  urgencyLevel: "Low" | "Medium" | "High"
  whenToSeeDoctor: string
  homeRemedies: string[]
  warningSigns: string[]
  followUpCare: string[]
}

export default function BodyMapperClientPage() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const bodyParts = [
    { id: "head", name: "Head", x: 50, y: 15, color: "bg-red-500", description: "Head, scalp, face" },
    { id: "neck", name: "Neck", x: 50, y: 25, color: "bg-orange-500", description: "Neck, throat" },
    { id: "chest", name: "Chest", x: 50, y: 40, color: "bg-blue-500", description: "Chest, lungs, heart" },
    { id: "abdomen", name: "Abdomen", x: 50, y: 55, color: "bg-green-500", description: "Stomach, abdomen" },
    { id: "left-arm", name: "Left Arm", x: 25, y: 45, color: "bg-purple-500", description: "Left arm, shoulder" },
    { id: "right-arm", name: "Right Arm", x: 75, y: 45, color: "bg-purple-500", description: "Right arm, shoulder" },
    { id: "left-leg", name: "Left Leg", x: 40, y: 80, color: "bg-indigo-500", description: "Left leg, hip" },
    { id: "right-leg", name: "Right Leg", x: 60, y: 80, color: "bg-indigo-500", description: "Right leg, hip" },
  ]

  const handleBodyPartClick = async (part: (typeof bodyParts)[0]) => {
    setSelectedPart(part.name)
  }

  const analyzeSymptoms = async () => {
    if (!selectedPart || !symptoms.trim()) return
    setIsAnalyzing(true)

    try {
      const analysisPrompt = `
Analyze the following symptoms. The output MUST be a valid JSON object that conforms to the SymptomAnalysis interface structure provided below.

---USER DATA---
Body Part Affected: ${selectedPart}
Symptom Description: ${symptoms}
---END USER DATA---

---JSON STRUCTURE---
interface SymptomAnalysis {
  bodyPart: string;
  symptoms: string;
  possibleCauses: string[];
  recommendations: string[];
  urgencyLevel: "Low" | "Medium" | "High";
  whenToSeeDoctor: string;
  homeRemedies: string[];
  warningSigns: string[];
  followUpCare: string[];
}
---END JSON STRUCTURE---
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "symptom-analysis",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.response && typeof data.response === "object") {
        setAnalysis(data.response as SymptomAnalysis)
      } else {
        throw new Error("Invalid response format from AI")
      }
    } catch (error) {
      console.error("Symptom analysis error:", error)
      setAnalysis({
        bodyPart: selectedPart!,
        symptoms: symptoms,
        possibleCauses: ["Error communicating with AI. Please try again."],
        recommendations: ["Consult a healthcare provider for any medical concerns."],
        urgencyLevel: "Medium",
        whenToSeeDoctor: "If symptoms persist or worsen, see a doctor.",
        homeRemedies: [],
        warningSigns: ["Severe pain, high fever, difficulty breathing."],
        followUpCare: [],
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetMapper = () => {
    setSelectedPart(null)
    setSymptoms("")
    setAnalysis(null)
    setIsAnalyzing(false)
  }

  const handleReset = () => {
    resetMapper()
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* SEO-optimized structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "AI Body Symptom Mapper",
            description: "Interactive body mapping tool for symptom analysis and health assessment",
            url: "https://mymedi.ai/body-mapper",
            medicalAudience: {
              "@type": "Patient",
            },
            about: {
              "@type": "MedicalCondition",
              name: "Symptom Analysis and Body Mapping",
            },
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "AI Body Symptom Mapper",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            },
          }),
        }}
      />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <nav className="hidden md:flex items-center space-x-4" role="navigation" aria-label="Main navigation">
            <Link href="/">
              <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
            <Link href="/vitals">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <Activity className="w-4 h-4 mr-2" />
                Vitals
              </Button>
            </Link>
            <Link href="/diet">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <Apple className="w-4 h-4 mr-2" />
                Diet
              </Button>
            </Link>
            <Link href="/pregnancy">
              <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent">
                <Baby className="w-4 h-4 mr-2" />
                Pregnancy
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <UserCheck className="w-4 h-4 mr-2" />
                Doctors
              </Button>
            </Link>
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">🗺️ AI Body Symptom Mapper</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Interactive body mapping for precise symptom analysis and AI-powered health insights. Click on body parts,
              describe symptoms, and get comprehensive health recommendations.
            </p>
          </header>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-white text-xl">
                <User className="w-6 h-6 mr-3" />
                Interactive Symptom Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!analysis ? (
                <div className="space-y-8">
                  {/* Interactive Body Diagram */}
                  <div className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Select Body Part</h3>
                      <p className="text-gray-600">Click on the body part where you're experiencing symptoms</p>
                    </div>

                    {/* Body Diagram Container */}
                    <div className="relative mx-auto max-w-md">
                      {/* Simple Body Outline */}
                      <div className="relative mx-auto w-48 h-80 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full opacity-30"></div>

                      {/* Interactive Body Parts */}
                      {bodyParts.map((part) => (
                        <button
                          key={part.id}
                          onClick={() => handleBodyPartClick(part)}
                          className={`absolute w-10 h-10 rounded-full ${part.color} hover:scale-125 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white ${
                            selectedPart === part.name ? "ring-4 ring-yellow-300 scale-110" : ""
                          }`}
                          style={{ left: `${part.x}%`, top: `${part.y}%`, transform: "translate(-50%, -50%)" }}
                          title={part.description}
                          aria-label={`Select ${part.description} for symptom analysis`}
                        >
                          <MapPin className="w-5 h-5 text-white mx-auto" />
                        </button>
                      ))}
                    </div>

                    {/* Body Parts Legend */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                      {bodyParts.map((part) => (
                        <button
                          key={part.id}
                          onClick={() => handleBodyPartClick(part)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            selectedPart === part.name
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${part.color} mx-auto mb-1`}></div>
                          <p className="text-sm font-medium text-gray-800">{part.name}</p>
                          <p className="text-xs text-gray-600">{part.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPart && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <Target className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        <strong>Selected:</strong> {selectedPart}. Now describe your symptoms in detail below.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Symptom Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-3">Describe Your Symptoms</label>
                      <Textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Please describe your symptoms in detail:
- What type of pain or discomfort? (sharp, dull, throbbing, burning)
- When did it start?
- What makes it better or worse?
- Any other associated symptoms?
- Rate the intensity (1-10 scale)"
                        rows={6}
                        className="w-full text-base"
                        aria-label="Describe your symptoms in detail"
                      />
                    </div>

                    <Button
                      onClick={analyzeSymptoms}
                      disabled={!selectedPart || !symptoms.trim() || isAnalyzing}
                      size="lg"
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Analyzing Symptoms...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="w-5 h-5 mr-2" />
                          Analyze Symptoms with AI
                        </>
                      )}
                    </Button>
                  </div>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Medical Emergency:</strong> For severe symptoms, chest pain, difficulty breathing, or
                      other emergency situations, contact emergency services immediately (108/102).
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-2xl font-semibold text-gray-800">Symptom Analysis Complete</h3>
                    </div>
                    <Badge className={`text-lg px-4 py-2 ${getUrgencyColor(analysis.urgencyLevel)}`}>
                      {analysis.urgencyLevel} Priority
                    </Badge>
                  </div>

                  {/* Analysis Summary */}
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Analysis Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Body Part:</p>
                          <p className="text-base text-gray-800">{analysis.bodyPart}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Urgency Level:</p>
                          <Badge className={getUrgencyColor(analysis.urgencyLevel)}>{analysis.urgencyLevel}</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Symptoms Described:</p>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border">{analysis.symptoms}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Activity className="w-5 h-5 mr-2 text-blue-500" />
                          Possible Causes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.possibleCauses.map((cause, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-blue-500 mr-2 mt-1">•</span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Heart className="w-5 h-5 mr-2 text-green-500" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-green-500 mr-2 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-purple-500" />
                          Home Remedies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.homeRemedies.map((remedy, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-purple-500 mr-2 mt-1">•</span>
                              {remedy}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                          Warning Signs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.warningSigns.map((sign, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-red-500 mr-2 mt-1">•</span>
                              {sign}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* When to See Doctor */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-orange-500" />
                        When to See a Doctor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{analysis.whenToSeeDoctor}</p>
                    </CardContent>
                  </Card>

                  {/* Follow-up Care */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-teal-500" />
                        Follow-up Care
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.followUpCare.map((care, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-teal-500 mr-2 mt-1">•</span>
                            {care}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Alert className={`border-2 ${getUrgencyColor(analysis.urgencyLevel)}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> This AI analysis is for informational purposes only. Always consult
                      qualified healthcare professionals for accurate diagnosis and treatment. Seek immediate medical
                      attention if you experience severe or worsening symptoms.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={resetMapper} variant="outline" size="lg" className="flex-1 bg-transparent">
                      <User className="w-4 h-4 mr-2" />
                      Analyze Another Symptom
                    </Button>
                    <Link href="/chat" className="flex-1">
                      <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Consult AI Doctor
                      </Button>
                    </Link>
                    <Link href="/assessment" className="flex-1">
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Full Assessment
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Content Section */}
          <section className="mt-12 bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Body Symptom Mapping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Symptoms We Analyze</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Headaches and migraines</li>
                  <li>• Chest pain and breathing issues</li>
                  <li>• Abdominal pain and digestive problems</li>
                  <li>• Joint and muscle pain</li>
                  <li>• Back and neck pain</li>
                  <li>• Skin conditions and rashes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Analysis Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Interactive body part selection</li>
                  <li>• Urgency level assessment</li>
                  <li>• Possible causes identification</li>
                  <li>• Home remedy suggestions</li>
                  <li>• Warning signs detection</li>
                  <li>• Follow-up care recommendations</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PoweredByFooter />
    </div>
  )
}
