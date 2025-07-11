"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Activity,
  Brain,
  Pill,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Phone,
  Target,
  CheckCircle,
  RefreshCw,
  Sparkles,
  Bell,
  Stethoscope,
  Calendar,
  Apple,
  MessageCircle,
} from "lucide-react"

interface LiveAnalysisData {
  personalInfo: {
    age: number
    gender: string
    weight: number
    height: number
  }
  primarySymptom: string
  secondarySymptoms: string[]
  medications: string[]
  conditions: string[]
  duration: string
  severity: number
  lifestyle: {
    exercise: string
    sleep: string
    diet: string
    stress: number
  }
}

interface LiveAnalysisResponse {
  healthScore: number
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  confidenceScore: number
  isEmergency: boolean
  emergencyAlert?: {
    message: string
    actions: string[]
    emergencyServices: string[]
  }
  recommendations: {
    immediate: string[]
    medications: Array<{
      name: string
      reason: string
      dosage: string
      urgency: "immediate" | "soon" | "routine"
    }>
    lifestyle: string[]
    followUp: string[]
  }
  riskFactors: Array<{
    factor: string
    impact: "high" | "medium" | "low"
    explanation: string
  }>
  aiReasoning: {
    healthScoreRationale: string
    riskAssessment: string
    keyFindings: string[]
  }
}

interface LiveAIResultsProps {
  assessmentData: LiveAnalysisData
  onEmergencyDetected?: (alert: any) => void
}

export default function LiveAIResults({ assessmentData, onEmergencyDetected }: LiveAIResultsProps) {
  const [analysis, setAnalysis] = useState<LiveAnalysisResponse | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastAnalysisTime, setLastAnalysisTime] = useState<Date | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<LiveAnalysisResponse[]>([])

  // Debounced analysis trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      performLiveAnalysis()
    }, 1000) // 1 second debounce

    return () => clearTimeout(timer)
  }, [assessmentData])

  const performLiveAnalysis = async () => {
    // Skip analysis if no meaningful data
    if (!assessmentData.primarySymptom && assessmentData.severity <= 1 && assessmentData.personalInfo.age === 0) {
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/live-ai-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      })

      if (response.ok) {
        const newAnalysis: LiveAnalysisResponse = await response.json()
        setAnalysis(newAnalysis)
        setLastAnalysisTime(new Date())

        // Add to history (keep last 5 analyses)
        setAnalysisHistory((prev) => [newAnalysis, ...prev.slice(0, 4)])

        // Trigger emergency callback if emergency detected
        if (newAnalysis.isEmergency && newAnalysis.emergencyAlert && onEmergencyDetected) {
          onEmergencyDetected(newAnalysis.emergencyAlert)
        }
      }
    } catch (error) {
      console.error("Live analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "soon":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "routine":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  if (!analysis) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Analysis Ready</h3>
                <p className="text-gray-600 mt-1">Start filling the form to get live AI-powered health insights</p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Advanced Medical AI</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      {analysis.isEmergency && analysis.emergencyAlert && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-bold text-lg mb-2">{analysis.emergencyAlert.message}</div>
            <div className="space-y-2">
              <div className="font-semibold">Immediate Actions:</div>
              {analysis.emergencyAlert.actions.map((action, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="font-bold text-red-600">{index + 1}.</span>
                  <span>{action}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <div className="font-semibold mb-2">Emergency Contacts:</div>
                {analysis.emergencyAlert.emergencyServices.map((service, index) => (
                  <div key={index} className="text-sm font-mono">
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Live Analysis Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Live AI Analysis
              {isAnalyzing && <RefreshCw className="w-4 h-4 ml-2 animate-spin text-blue-600" />}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              {lastAnalysisTime && (
                <Badge variant="secondary" className="text-xs">
                  Updated {lastAnalysisTime.toLocaleTimeString()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Score Circle */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.healthScore / 100)}`}
                    className={getHealthScoreColor(analysis.healthScore).replace("text-", "text-")}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 1s ease-in-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
                    {analysis.healthScore}
                  </span>
                  <span className="text-sm text-gray-600">Health Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Level and Confidence */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Risk Level</div>
              <Badge className={`${getRiskLevelColor(analysis.riskLevel)} px-3 py-1`}>{analysis.riskLevel}</Badge>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">AI Confidence</div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-bold text-blue-600">{analysis.confidenceScore}%</span>
                <Progress value={analysis.confidenceScore} className="w-16 h-2" />
              </div>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Brain className="w-4 h-4 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-900">AI Analysis Reasoning</span>
            </div>
            <p className="text-sm text-blue-800">{analysis.aiReasoning.riskAssessment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Live Medication Recommendations */}
      {analysis.recommendations.medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="w-5 h-5 mr-2 text-green-600" />
              Live Medication Suggestions
              <Badge variant="outline" className="ml-2 text-xs">
                Updates as you type
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.recommendations.medications.map((med, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getUrgencyIcon(med.urgency)}
                <div className="flex-1">
                  <div className="font-medium">{med.name}</div>
                  <div className="text-sm text-gray-600">{med.reason}</div>
                  <div className="text-sm text-blue-600 font-mono">{med.dosage}</div>
                </div>
                <Badge
                  variant={
                    med.urgency === "immediate" ? "destructive" : med.urgency === "soon" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {med.urgency}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {analysis.riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-orange-600" />
              Risk Factors Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${
                    risk.impact === "high" ? "bg-red-500" : risk.impact === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium">{risk.factor}</div>
                  <div className="text-sm text-gray-600">{risk.explanation}</div>
                </div>
                <Badge
                  variant={risk.impact === "high" ? "destructive" : risk.impact === "medium" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {risk.impact} impact
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Immediate Recommendations */}
      {analysis.recommendations.immediate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Immediate Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.immediate.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifestyle Recommendations */}
      {analysis.recommendations.lifestyle.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Apple className="w-5 h-5 mr-2 text-green-600" />
              Lifestyle Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.lifestyle.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Follow-up Timeline */}
      {analysis.recommendations.followUp.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Follow-up Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.followUp.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Stethoscope className="w-4 h-4 mr-2" />
            Book Doctor Consultation
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Phone className="w-4 h-4 mr-2" />
            Find Nearby Pharmacy
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <Bell className="w-4 h-4 mr-2" />
            Set Medication Reminder
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            <TrendingUp className="w-4 h-4 mr-2" />
            Track Symptoms
          </Button>
        </CardContent>
      </Card>

      {/* Analysis History */}
      {analysisHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-gray-600" />
              Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysisHistory.slice(1, 4).map((hist, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <span>Health Score: {hist.healthScore}</span>
                  <span>Risk: {hist.riskLevel}</span>
                  <span className="text-gray-500">#{index + 2}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Disclaimer */}
      <Alert className="border-blue-200 bg-blue-50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="font-semibold mb-1">AI Analysis Disclaimer</div>
          <div className="text-sm">
            This live AI analysis is for informational purposes only. Always consult healthcare professionals for
            medical decisions. Emergency symptoms require immediate medical attention.
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
