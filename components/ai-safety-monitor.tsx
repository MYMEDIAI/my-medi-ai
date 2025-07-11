"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Brain,
  Activity,
  Users,
  Stethoscope,
  AlertCircle,
  Info,
  Eye,
} from "lucide-react"

interface SafetyMonitorProps {
  aiResponse: string
  userInput: string
  context: string
  responseType: "diagnosis" | "medication" | "lifestyle" | "emergency" | "general"
  userProfile?: {
    age: number
    gender: string
    medicalHistory: string[]
    currentMedications: string[]
  }
  onSafetyAssessment?: (assessment: any) => void
}

interface SafetyAssessment {
  confidenceScore: number
  safetyLevel: "safe" | "caution" | "review_required" | "emergency"
  emergencyFlags: string[]
  disclaimerRequired: boolean
  humanReviewRequired: boolean
  safetyRecommendations: string[]
  accuracyIndicators: {
    dataQuality: number
    symptomClarity: number
    medicalComplexity: number
    riskLevel: number
  }
  emergencyProtocol?: {
    isEmergency: boolean
    emergencyType: string
    immediateActions: string[]
    emergencyContacts: string[]
  }
}

export default function AISafetyMonitor({
  aiResponse,
  userInput,
  context,
  responseType,
  userProfile,
  onSafetyAssessment,
}: SafetyMonitorProps) {
  const [safetyAssessment, setSafetyAssessment] = useState<SafetyAssessment | null>(null)
  const [isAssessing, setIsAssessing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (aiResponse && userInput) {
      performSafetyAssessment()
    }
  }, [aiResponse, userInput, responseType])

  const performSafetyAssessment = async () => {
    setIsAssessing(true)
    try {
      const response = await fetch("/api/ai-safety-monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiResponse,
          userInput,
          context,
          responseType,
          userProfile,
        }),
      })

      if (response.ok) {
        const assessment: SafetyAssessment = await response.json()
        setSafetyAssessment(assessment)
        if (onSafetyAssessment) {
          onSafetyAssessment(assessment)
        }
      }
    } catch (error) {
      console.error("Safety assessment error:", error)
      // Set safe defaults
      setSafetyAssessment({
        confidenceScore: 30,
        safetyLevel: "review_required",
        emergencyFlags: [],
        disclaimerRequired: true,
        humanReviewRequired: true,
        safetyRecommendations: ["Consult healthcare professional for safety"],
        accuracyIndicators: {
          dataQuality: 30,
          symptomClarity: 30,
          medicalComplexity: 50,
          riskLevel: 80,
        },
      })
    } finally {
      setIsAssessing(false)
    }
  }

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "caution":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "review_required":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "emergency":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSafetyIcon = (level: string) => {
    switch (level) {
      case "safe":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "caution":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "review_required":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case "emergency":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Shield className="w-5 h-5 text-gray-600" />
    }
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  if (isAssessing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 animate-pulse text-blue-600" />
            <span className="text-sm text-blue-800">AI Safety Assessment in progress...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!safetyAssessment) return null

  return (
    <div className="space-y-4">
      {/* Emergency Alert */}
      {safetyAssessment.emergencyProtocol?.isEmergency && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="space-y-3">
              <div className="font-bold text-lg">🚨 MEDICAL EMERGENCY DETECTED</div>
              <div className="font-semibold">Emergency Type: {safetyAssessment.emergencyProtocol.emergencyType}</div>

              <div>
                <div className="font-semibold mb-2">IMMEDIATE ACTIONS REQUIRED:</div>
                <ol className="list-decimal list-inside space-y-1">
                  {safetyAssessment.emergencyProtocol.immediateActions.map((action, index) => (
                    <li key={index} className="text-sm">
                      {action}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-red-100 p-3 rounded-lg">
                <div className="font-semibold mb-2">Emergency Contacts:</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {safetyAssessment.emergencyProtocol.emergencyContacts.map((contact, index) => (
                    <div key={index} className="font-mono">
                      {contact}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => window.open("tel:108")}>
                <Phone className="w-4 h-4 mr-2" />
                CALL EMERGENCY SERVICES (108)
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Safety Assessment Card */}
      <Card className={`border-2 ${getSafetyLevelColor(safetyAssessment.safetyLevel)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getSafetyIcon(safetyAssessment.safetyLevel)}
              <span>AI Safety Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={getSafetyLevelColor(safetyAssessment.safetyLevel)}>
                {safetyAssessment.safetyLevel.replace("_", " ").toUpperCase()}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="h-6 px-2">
                <Eye className="w-3 h-3 mr-1" />
                {showDetails ? "Hide" : "Details"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-blue-600" />
                AI Confidence Level
              </span>
              <span className={`font-bold ${getConfidenceColor(safetyAssessment.confidenceScore)}`}>
                {safetyAssessment.confidenceScore}%
              </span>
            </div>
            <Progress value={safetyAssessment.confidenceScore} className="h-2" />
            <div className="text-xs text-gray-600">
              {safetyAssessment.confidenceScore >= 80 && "High confidence in AI assessment"}
              {safetyAssessment.confidenceScore >= 60 &&
                safetyAssessment.confidenceScore < 80 &&
                "Moderate confidence - consider professional consultation"}
              {safetyAssessment.confidenceScore < 60 && "Low confidence - human medical review recommended"}
            </div>
          </div>

          {/* Emergency Flags */}
          {safetyAssessment.emergencyFlags.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-red-600">⚠️ Emergency Indicators Detected:</div>
              <div className="space-y-1">
                {safetyAssessment.emergencyFlags.map((flag, index) => (
                  <Badge key={index} variant="destructive" className="mr-2 mb-1">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Safety Recommendations */}
          <div className="space-y-2">
            <div className="text-sm font-semibold flex items-center">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              Safety Recommendations
            </div>
            <div className="space-y-1">
              {safetyAssessment.safetyRecommendations.map((rec, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                  {rec}
                </div>
              ))}
            </div>
          </div>

          {/* Human Review Required */}
          {safetyAssessment.humanReviewRequired && (
            <Alert className="border-orange-200 bg-orange-50">
              <Users className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="font-semibold mb-1">Human Medical Review Required</div>
                <div className="text-sm">
                  AI confidence is insufficient for this medical assessment. Please consult a qualified healthcare
                  professional.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Detailed Accuracy Indicators */}
          {showDetails && (
            <div className="space-y-3 pt-3 border-t">
              <div className="text-sm font-semibold">Accuracy Indicators</div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Data Quality</span>
                    <span>{safetyAssessment.accuracyIndicators.dataQuality}%</span>
                  </div>
                  <Progress value={safetyAssessment.accuracyIndicators.dataQuality} className="h-1" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Symptom Clarity</span>
                    <span>{safetyAssessment.accuracyIndicators.symptomClarity}%</span>
                  </div>
                  <Progress value={safetyAssessment.accuracyIndicators.symptomClarity} className="h-1" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Medical Complexity</span>
                    <span>{safetyAssessment.accuracyIndicators.medicalComplexity}%</span>
                  </div>
                  <Progress value={safetyAssessment.accuracyIndicators.medicalComplexity} className="h-1" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Risk Level</span>
                    <span>{safetyAssessment.accuracyIndicators.riskLevel}%</span>
                  </div>
                  <Progress value={safetyAssessment.accuracyIndicators.riskLevel} className="h-1" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Stethoscope className="w-3 h-3 mr-1" />
              Find Doctor
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Phone className="w-3 h-3 mr-1" />
              Telemedicine
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Activity className="w-3 h-3 mr-1" />
              Track Symptoms
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medical Disclaimer */}
      {safetyAssessment.disclaimerRequired && (
        <Alert className="border-gray-300 bg-gray-50">
          <Info className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            <div className="space-y-2 text-sm">
              <div className="font-semibold">⚕️ Medical AI Disclaimer</div>
              <div className="space-y-1">
                <div>• This AI analysis is for informational purposes only</div>
                <div>• AI recommendations do not replace professional medical diagnosis</div>
                <div>• Always consult qualified healthcare professionals for medical decisions</div>
                <div>• Seek immediate medical attention for emergency symptoms</div>
                <div>• AI accuracy may vary based on input quality and medical complexity</div>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                Last updated: {new Date().toLocaleDateString()} | AI Safety Protocol v1.0
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
