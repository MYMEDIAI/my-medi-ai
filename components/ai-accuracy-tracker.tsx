"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  TrendingUp,
  Target,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Stethoscope,
  BarChart3,
} from "lucide-react"

interface AccuracyMetrics {
  overallAccuracy: number
  categoryAccuracy: {
    diagnosis: number
    medication: number
    lifestyle: number
    emergency: number
  }
  demographicAccuracy: {
    [key: string]: number
  }
  regionalAccuracy: {
    [key: string]: number
  }
  improvementAreas: string[]
  lastUpdated: string
}

interface AccuracyTrackerProps {
  recommendationId: string
  recommendation: string
  category: "diagnosis" | "medication" | "lifestyle" | "emergency"
  userProfile?: {
    age: number
    gender: string
    location: string
    medicalHistory: string[]
  }
  onFeedbackSubmitted?: (feedback: any) => void
}

export default function AIAccuracyTracker({
  recommendationId,
  recommendation,
  category,
  userProfile,
  onFeedbackSubmitted,
}: AccuracyTrackerProps) {
  const [metrics, setMetrics] = useState<AccuracyMetrics | null>(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackType, setFeedbackType] = useState<"accurate" | "partially_accurate" | "inaccurate" | "harmful" | "">(
    "",
  )
  const [actualOutcome, setActualOutcome] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    fetchAccuracyMetrics()
  }, [])

  const fetchAccuracyMetrics = async () => {
    try {
      const response = await fetch("/api/ai-accuracy-enhancement?type=metrics")
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error("Error fetching accuracy metrics:", error)
    }
  }

  const submitFeedback = async () => {
    if (!feedbackType) return

    setIsSubmitting(true)
    try {
      const feedback = {
        recommendationId,
        userFeedback: feedbackType,
        actualOutcome: actualOutcome || undefined,
        userProfile,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/ai-accuracy-enhancement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_feedback",
          feedback,
        }),
      })

      if (response.ok) {
        setFeedbackSubmitted(true)
        setShowFeedbackForm(false)
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(feedback)
        }
        // Refresh metrics
        fetchAccuracyMetrics()
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const requestSpecialistReview = async () => {
    try {
      const response = await fetch("/api/ai-accuracy-enhancement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_specialist_review",
          recommendation,
          userCase: `User profile: ${JSON.stringify(userProfile)}`,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Specialist review requested. Review ID: ${data.reviewId}. Estimated time: ${data.estimatedTime}`)
      }
    } catch (error) {
      console.error("Error requesting specialist review:", error)
    }
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600"
    if (accuracy >= 80) return "text-yellow-600"
    if (accuracy >= 70) return "text-orange-600"
    return "text-red-600"
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "accurate":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "partially_accurate":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "inaccurate":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "harmful":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Target className="w-4 h-4 text-gray-600" />
    }
  }

  if (feedbackSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-semibold text-green-800">Thank you for your feedback!</div>
              <div className="text-sm text-green-700">Your input helps improve AI accuracy for future patients.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quick Feedback Buttons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>AI Accuracy Feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {category}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setShowMetrics(!showMetrics)} className="h-6 px-2">
                <BarChart3 className="w-3 h-3 mr-1" />
                Metrics
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showFeedbackForm ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">Was this AI recommendation helpful and accurate?</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFeedbackType("accurate")
                    setShowFeedbackForm(true)
                  }}
                  className="bg-transparent"
                >
                  <ThumbsUp className="w-4 h-4 mr-2 text-green-600" />
                  Accurate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFeedbackType("partially_accurate")
                    setShowFeedbackForm(true)
                  }}
                  className="bg-transparent"
                >
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                  Partially Accurate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFeedbackType("inaccurate")
                    setShowFeedbackForm(true)
                  }}
                  className="bg-transparent"
                >
                  <ThumbsDown className="w-4 h-4 mr-2 text-red-600" />
                  Inaccurate
                </Button>
                <Button variant="outline" size="sm" onClick={requestSpecialistReview} className="bg-transparent">
                  <Stethoscope className="w-4 h-4 mr-2 text-purple-600" />
                  Request Specialist Review
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getFeedbackIcon(feedbackType)}
                <span className="font-medium">You selected: {feedbackType.replace("_", " ")}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">What actually happened? (Optional)</label>
                <Textarea
                  placeholder="Describe the actual outcome or what you think should be corrected..."
                  value={actualOutcome}
                  onChange={(e) => setActualOutcome(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFeedbackForm(false)
                    setFeedbackType("")
                    setActualOutcome("")
                  }}
                  className="bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={submitFeedback}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accuracy Metrics */}
      {showMetrics && metrics && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm">
              <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
              AI Accuracy Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Accuracy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall AI Accuracy</span>
                <span className={`font-bold ${getAccuracyColor(metrics.overallAccuracy)}`}>
                  {metrics.overallAccuracy}%
                </span>
              </div>
              <Progress value={metrics.overallAccuracy} className="h-2" />
            </div>

            {/* Category Accuracy */}
            <div className="space-y-3">
              <div className="text-sm font-semibold">Category Performance</div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(metrics.categoryAccuracy).map(([cat, accuracy]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize">{cat}</span>
                      <span className={getAccuracyColor(accuracy)}>{accuracy}%</span>
                    </div>
                    <Progress value={accuracy} className="h-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Performance */}
            {Object.keys(metrics.regionalAccuracy).length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Regional Performance
                </div>
                <div className="space-y-1">
                  {Object.entries(metrics.regionalAccuracy)
                    .slice(0, 3)
                    .map(([region, accuracy]) => (
                      <div key={region} className="flex items-center justify-between text-xs">
                        <span>{region}</span>
                        <span className={getAccuracyColor(accuracy)}>{accuracy}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Improvement Areas */}
            {metrics.improvementAreas.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Areas for Improvement
                </div>
                <div className="space-y-1">
                  {metrics.improvementAreas.map((area, index) => (
                    <div key={index} className="text-xs p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-2 border-t">
              Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Base Info */}
      <Alert className="border-blue-200 bg-blue-50">
        <BookOpen className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="text-sm space-y-1">
            <div className="font-semibold">AI Continuous Learning</div>
            <div>• AI knowledge base is regularly updated with latest Indian medical guidelines</div>
            <div>• Your feedback directly improves AI accuracy for future patients</div>
            <div>• Specialist reviews ensure medical recommendations meet professional standards</div>
            <div>• Regional adaptations based on local health patterns and preferences</div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
