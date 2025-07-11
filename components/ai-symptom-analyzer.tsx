"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Brain,
  Stethoscope,
  Clock,
  Shield,
  Zap,
  Target,
  Heart,
  Activity,
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Sparkles,
  Bot,
  X,
  Mic,
  Camera,
} from "lucide-react"

interface SymptomSuggestion {
  symptom: string
  category: string
  commonality: string
  urgency: string
}

interface Condition {
  condition: string
  confidence: number
  reasoning: string
  commonInIndia: boolean
  prevalence: string
}

interface AIAnalysis {
  primaryAnalysis: {
    mostLikelyConditions: Condition[]
    severityAssessment: string
    urgencyLevel: string
    overallRiskScore: number
  }
  symptomAnalysis: {
    patternRecognition: string
    redFlags: string[]
    missingSymptoms: string[]
    progressionPattern: string
  }
  indianHealthcareContext: {
    commonCauses: string[]
    seasonalFactors: string
    dietaryFactors: string[]
    environmentalFactors: string[]
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
    whenToSeekHelp: string
  }
  emergencyFlags: {
    isEmergency: boolean
    emergencyReasons: string[]
    emergencyActions: string[]
  }
  culturalConsiderations: {
    homeRemedies: string[]
    dietaryAdvice: string[]
    lifestyleFactors: string[]
  }
}

interface PatientProfile {
  age: number
  gender: string
  weight: number
  height: number
  medicalHistory: string[]
  currentMedications: string[]
  allergies: string[]
}

export default function AISymptomAnalyzer() {
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    age: 0,
    gender: "",
    weight: 0,
    height: 0,
    medicalHistory: [],
    currentMedications: [],
    allergies: [],
  })

  const [symptomInput, setSymptomInput] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [symptomSuggestions, setSymptomSuggestions] = useState<SymptomSuggestion[]>([])
  const [relatedSymptoms, setRelatedSymptoms] = useState<SymptomSuggestion[]>([])
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState(5)
  const [additionalInfo, setAdditionalInfo] = useState("")

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Debounced symptom suggestions
  const debouncedSymptomInput = useMemo(() => {
    const timeoutId = setTimeout(() => {
      if (symptomInput.length >= 2) {
        fetchSymptomSuggestions(symptomInput)
      } else {
        setSymptomSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [symptomInput])

  useEffect(() => {
    return debouncedSymptomInput
  }, [debouncedSymptomInput])

  // Fetch related symptoms when primary symptom is selected
  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      fetchRelatedSymptoms(selectedSymptoms[0])
    }
  }, [selectedSymptoms])

  const fetchSymptomSuggestions = async (input: string) => {
    if (input.length < 2) return

    setIsLoadingSuggestions(true)
    try {
      const response = await fetch("/api/ai-symptom-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: input,
          type: "symptom_suggestions",
        }),
      })

      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setSymptomSuggestions(result.data)
      }
    } catch (error) {
      console.error("Error fetching symptom suggestions:", error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const fetchRelatedSymptoms = async (primarySymptom: string) => {
    try {
      const response = await fetch("/api/ai-symptom-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: [primarySymptom],
          type: "related_symptoms",
        }),
      })

      const result = await response.json()
      if (result.success && Array.isArray(result.data)) {
        setRelatedSymptoms(result.data)
      }
    } catch (error) {
      console.error("Error fetching related symptoms:", error)
    }
  }

  const performComprehensiveAnalysis = async () => {
    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom")
      return
    }

    setIsLoadingAnalysis(true)
    setAnalysisProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("/api/ai-symptom-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          age: patientProfile.age,
          gender: patientProfile.gender,
          medicalHistory: patientProfile.medicalHistory,
          duration,
          severity,
          type: "comprehensive_analysis",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setAiAnalysis(result.data)
        setAnalysisProgress(100)
      } else {
        throw new Error(result.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Error performing analysis:", error)
      alert("Analysis failed. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsLoadingAnalysis(false)
      setTimeout(() => setAnalysisProgress(0), 2000)
    }
  }

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
    setSymptomInput("")
    setSymptomSuggestions([])
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
  }

  const addRelatedSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "routine":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "text-red-600"
      case "moderate":
        return "text-orange-600"
      case "mild":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600"
    if (confidence >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">AI Symptom Analyzer</h1>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            Powered by GPT-4
          </Badge>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Advanced AI-powered medical analysis for Indian healthcare context. Get instant insights into your symptoms
          with professional-grade medical intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={patientProfile.age || ""}
                    onChange={(e) =>
                      setPatientProfile((prev) => ({
                        ...prev,
                        age: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={patientProfile.gender}
                    onChange={(e) =>
                      setPatientProfile((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={patientProfile.weight || ""}
                    onChange={(e) =>
                      setPatientProfile((prev) => ({
                        ...prev,
                        weight: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Symptom Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-purple-600" />
                AI-Powered Symptom Analysis
                <Badge variant="outline" className="ml-2">
                  Real-time AI
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Symptom Search */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Type your symptoms (e.g., headache, fever, stomach pain)..."
                        value={symptomInput}
                        onChange={(e) => setSymptomInput(e.target.value)}
                        className="pl-10 pr-20 h-12 text-lg"
                      />
                      <div className="absolute right-2 top-2 flex items-center space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mic className="h-4 w-4 text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Camera className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    {isLoadingSuggestions && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI analyzing...</span>
                      </div>
                    )}
                  </div>

                  {/* AI Suggestions Dropdown */}
                  {symptomSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      <div className="p-3 border-b bg-blue-50">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">AI Suggestions</span>
                        </div>
                      </div>
                      {symptomSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => addSymptom(suggestion.symptom)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="font-medium">{suggestion.symptom}</span>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={`text-xs ${getUrgencyColor(suggestion.urgency)}`}>
                                {suggestion.urgency}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {suggestion.commonality}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="space-y-3">
                    <Label>Selected Symptoms:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="text-sm py-2 px-3 bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          {symptom}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0 hover:bg-blue-300"
                            onClick={() => removeSymptom(symptom)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI-Suggested Related Symptoms */}
              {relatedSymptoms.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <Label className="text-purple-800">AI suggests you might also have:</Label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {relatedSymptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-2 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer"
                        onClick={() => addRelatedSymptom(symptom.symptom)}
                      >
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom.symptom)}
                          onChange={() => addRelatedSymptom(symptom.symptom)}
                        />
                        <span className="text-sm">{symptom.symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Symptom Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <select
                    id="duration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="">Select duration</option>
                    <option value="less-than-1-day">Less than 1 day</option>
                    <option value="1-3-days">1-3 days</option>
                    <option value="4-7-days">4-7 days</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="more-than-2-weeks">More than 2 weeks</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity (1-10): {severity}</Label>
                  <input
                    type="range"
                    id="severity"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(Number.parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Any additional details about your symptoms, triggers, or concerns..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Analyze Button */}
              <div className="flex justify-center">
                <Button
                  onClick={performComprehensiveAnalysis}
                  disabled={selectedSymptoms.length === 0 || isLoadingAnalysis}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                >
                  {isLoadingAnalysis ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Get AI Analysis
                    </>
                  )}
                </Button>
              </div>

              {/* Analysis Progress */}
              {isLoadingAnalysis && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>AI Analysis Progress</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <div className="text-xs text-gray-500 text-center">
                    {analysisProgress < 30
                      ? "Processing symptoms..."
                      : analysisProgress < 60
                        ? "Analyzing patterns..."
                        : analysisProgress < 90
                          ? "Generating recommendations..."
                          : "Finalizing analysis..."}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6">
          {/* AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time symptom suggestions</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Pattern recognition analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Indian healthcare context</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Emergency detection</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Confidence scoring</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cultural considerations</span>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Services</span>
                <Badge variant="destructive">108</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medical Emergency</span>
                <Badge variant="destructive">102</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Police</span>
                <Badge variant="outline">100</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fire</span>
                <Badge variant="outline">101</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  This AI analysis is for informational purposes only. Always consult qualified healthcare professionals
                  for medical diagnosis and treatment. In case of emergency, call 108 immediately.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <div className="space-y-8">
          <Separator />

          {/* Emergency Alert */}
          {aiAnalysis.emergencyFlags.isEmergency && (
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-bold text-lg mb-2">🚨 EMERGENCY DETECTED</div>
                <div className="space-y-2">
                  {aiAnalysis.emergencyFlags.emergencyReasons.map((reason, index) => (
                    <div key={index} className="text-sm">
                      • {reason}
                    </div>
                  ))}
                </div>
                <div className="mt-3 font-semibold">Immediate Actions:</div>
                <div className="space-y-1">
                  {aiAnalysis.emergencyFlags.emergencyActions.map((action, index) => (
                    <div key={index} className="text-sm">
                      • {action}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Primary Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-6 h-6 mr-3 text-blue-600" />
                AI Medical Analysis
                <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Confidence-Based Results
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {aiAnalysis.primaryAnalysis.overallRiskScore}/10
                  </div>
                  <div className="text-sm text-blue-800">Risk Score</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div
                    className={`text-2xl font-bold ${getSeverityColor(aiAnalysis.primaryAnalysis.severityAssessment)}`}
                  >
                    {aiAnalysis.primaryAnalysis.severityAssessment.toUpperCase()}
                  </div>
                  <div className="text-sm text-orange-800">Severity</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getUrgencyColor(aiAnalysis.primaryAnalysis.urgencyLevel)}`}>
                    {aiAnalysis.primaryAnalysis.urgencyLevel.toUpperCase()}
                  </div>
                  <div className="text-sm text-purple-800">Urgency</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {aiAnalysis.primaryAnalysis.mostLikelyConditions[0]?.confidence || 0}%
                  </div>
                  <div className="text-sm text-green-800">AI Confidence</div>
                </div>
              </div>

              {/* Most Likely Conditions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Most Likely Conditions
                </h3>
                <div className="space-y-4">
                  {aiAnalysis.primaryAnalysis.mostLikelyConditions.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">{condition.condition}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getConfidenceColor(condition.confidence)} bg-transparent border`}>
                            {condition.confidence}% confidence
                          </Badge>
                          {condition.commonInIndia && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Common in India
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-gray-700">
                        <strong>AI Reasoning:</strong> {condition.reasoning}
                      </div>

                      {condition.prevalence && (
                        <div className="text-sm text-blue-600">
                          <strong>Prevalence in India:</strong> {condition.prevalence}
                        </div>
                      )}

                      <Progress value={condition.confidence} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptom Pattern Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Symptom Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Pattern Recognition:</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.symptomAnalysis.patternRecognition}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Progression Pattern:</h4>
                <p className="text-sm text-gray-700">{aiAnalysis.symptomAnalysis.progressionPattern}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Red Flags to Watch:</h4>
                  <ul className="space-y-1">
                    {aiAnalysis.symptomAnalysis.redFlags.map((flag, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 text-red-500" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">Symptoms to Monitor:</h4>
                  <ul className="space-y-1">
                    {aiAnalysis.symptomAnalysis.missingSymptoms.map((symptom, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start">
                        <Clock className="w-3 h-3 mr-1 mt-0.5 text-blue-500" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indian Healthcare Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                Indian Healthcare Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Common Causes in India:</h4>
                  <ul className="space-y-1">
                    {aiAnalysis.indianHealthcareContext.commonCauses.map((cause, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-1.5" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Environmental Factors:</h4>
                  <ul className="space-y-1">
                    {aiAnalysis.indianHealthcareContext.environmentalFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Seasonal Factors:</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {aiAnalysis.indianHealthcareContext.seasonalFactors}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dietary Considerations:</h4>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.indianHealthcareContext.dietaryFactors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Immediate Actions:</h4>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.immediate.map((action, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <Zap className="w-3 h-3 mr-2 mt-0.5 text-red-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-orange-600">Short-term (24-48h):</h4>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.shortTerm.map((action, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <Clock className="w-3 h-3 mr-2 mt-0.5 text-orange-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Long-term:</h4>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendations.longTerm.map((action, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <Calendar className="w-3 h-3 mr-2 mt-0.5 text-green-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="font-semibold mb-1">When to Seek Medical Help:</div>
                  <div className="text-sm">{aiAnalysis.recommendations.whenToSeekHelp}</div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Cultural Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-600" />
                Cultural & Traditional Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Safe Home Remedies:</h4>
                  <ul className="space-y-2">
                    {aiAnalysis.culturalConsiderations.homeRemedies.map((remedy, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-1.5" />
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Dietary Advice:</h4>
                  <ul className="space-y-2">
                    {aiAnalysis.culturalConsiderations.dietaryAdvice.map((advice, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 mt-1.5" />
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Lifestyle Factors:</h4>
                  <ul className="space-y-2">
                    {aiAnalysis.culturalConsiderations.lifestyleFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Phone className="w-4 h-4 mr-2" />
              Find Doctors
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
            <Button variant="outline" className="bg-transparent">
              <MapPin className="w-4 h-4 mr-2" />
              Find Hospitals
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
