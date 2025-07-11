"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Stethoscope, Phone, Clock, Users, Brain, CheckCircle, X, Info } from "lucide-react"

interface MedicalDisclaimerProps {
  type?: "general" | "diagnosis" | "medication" | "emergency" | "lifestyle"
  severity?: "low" | "medium" | "high" | "critical"
  showDetailed?: boolean
  onAccept?: () => void
  onDecline?: () => void
  mandatory?: boolean
}

export default function MedicalDisclaimer({
  type = "general",
  severity = "medium",
  showDetailed = false,
  onAccept,
  onDecline,
  mandatory = false,
}: MedicalDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(showDetailed)
  const [hasAccepted, setHasAccepted] = useState(false)

  const getDisclaimerContent = () => {
    const baseDisclaimer = {
      title: "⚕️ Medical AI Disclaimer",
      warning: "This AI analysis is for informational purposes only and does not constitute medical advice.",
      points: [
        "AI recommendations do not replace professional medical diagnosis or treatment",
        "Always consult qualified healthcare professionals for medical decisions",
        "Individual medical conditions may require personalized professional assessment",
        "AI accuracy may vary based on input quality and medical complexity",
      ],
    }

    switch (type) {
      case "diagnosis":
        return {
          ...baseDisclaimer,
          title: "🔍 AI Diagnostic Disclaimer",
          warning: "AI cannot provide definitive medical diagnosis. Professional medical examination is required.",
          points: [
            ...baseDisclaimer.points,
            "Diagnostic accuracy requires clinical examination and medical tests",
            "Similar symptoms may indicate different medical conditions",
            "Self-diagnosis based on AI recommendations can be dangerous",
          ],
        }

      case "medication":
        return {
          ...baseDisclaimer,
          title: "💊 Medication Safety Disclaimer",
          warning: "AI medication suggestions require professional medical verification before use.",
          points: [
            ...baseDisclaimer.points,
            "Verify all medications with licensed pharmacist or doctor",
            "Check for drug interactions with current medications",
            "Dosage recommendations must be confirmed by healthcare provider",
            "Never stop or start medications without professional guidance",
          ],
        }

      case "emergency":
        return {
          ...baseDisclaimer,
          title: "🚨 Emergency Medical Disclaimer",
          warning: "For medical emergencies, call emergency services immediately (108). Do not rely solely on AI.",
          points: [
            "Emergency symptoms require immediate professional medical attention",
            "AI cannot replace emergency medical services or first aid training",
            "Time-sensitive conditions need immediate human medical intervention",
            "Follow emergency protocols and contact emergency services",
          ],
        }

      case "lifestyle":
        return {
          ...baseDisclaimer,
          title: "🏃‍♂️ Lifestyle Recommendation Disclaimer",
          warning: "AI lifestyle suggestions should be adapted to your individual health conditions.",
          points: [
            ...baseDisclaimer.points,
            "Consult healthcare provider before starting new exercise routines",
            "Dietary changes may interact with medical conditions or medications",
            "Individual health status affects suitability of lifestyle recommendations",
          ],
        }

      default:
        return baseDisclaimer
    }
  }

  const getSeverityColor = () => {
    switch (severity) {
      case "low":
        return "border-blue-200 bg-blue-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "high":
        return "border-orange-200 bg-orange-50"
      case "critical":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getSeverityIcon = () => {
    switch (severity) {
      case "low":
        return <Info className="h-4 w-4 text-blue-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const disclaimer = getDisclaimerContent()

  const handleAccept = () => {
    setHasAccepted(true)
    if (onAccept) onAccept()
  }

  const handleDecline = () => {
    if (onDecline) onDecline()
  }

  if (hasAccepted && !mandatory) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span className="text-sm">Medical disclaimer acknowledged</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHasAccepted(false)}
              className="h-6 px-2 text-green-600 hover:text-green-700"
            >
              Review
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={`border-2 ${getSeverityColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            {getSeverityIcon()}
            <span>{disclaimer.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={
                severity === "critical"
                  ? "text-red-600 border-red-200"
                  : severity === "high"
                    ? "text-orange-600 border-orange-200"
                    : severity === "medium"
                      ? "text-yellow-600 border-yellow-200"
                      : "text-blue-600 border-blue-200"
              }
            >
              {severity.toUpperCase()}
            </Badge>
            {!mandatory && (
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 px-2">
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Warning */}
        <Alert className={getSeverityColor()}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">{disclaimer.warning}</AlertDescription>
        </Alert>

        {/* Detailed Points */}
        {(isExpanded || mandatory) && (
          <div className="space-y-3">
            <div className="text-sm font-semibold">Important Safety Information:</div>
            <div className="space-y-2">
              {disclaimer.points.map((point, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Information */}
        {(type === "emergency" || severity === "critical") && (
          <div className="bg-red-100 p-3 rounded-lg border border-red-200">
            <div className="font-semibold text-red-800 mb-2">Emergency Contacts (India):</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-red-700">
              <div>Emergency Services: 108</div>
              <div>Medical Emergency: 102</div>
              <div>Police: 100</div>
              <div>Fire: 101</div>
            </div>
          </div>
        )}

        {/* Professional Resources */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            <div className="text-sm font-semibold">Recommended Actions:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <Stethoscope className="w-4 h-4 mr-2" />
                Consult Doctor
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Telemedicine
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button variant="outline" size="sm" className="justify-start bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Second Opinion
              </Button>
            </div>
          </div>
        )}

        {/* Acceptance Buttons */}
        {(onAccept || onDecline) && (
          <div className="flex justify-end space-x-2 pt-3 border-t">
            {onDecline && (
              <Button variant="outline" size="sm" onClick={handleDecline} className="bg-transparent">
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
            )}
            {onAccept && (
              <Button size="sm" onClick={handleAccept} className="bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />I Understand
              </Button>
            )}
          </div>
        )}

        {/* Legal Footer */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span>AI Safety Protocol v1.0 | Last updated: {new Date().toLocaleDateString()}</span>
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>MyMedi.ai</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
