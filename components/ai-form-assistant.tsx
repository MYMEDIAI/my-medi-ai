"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
  Lightbulb,
  Globe,
  MessageSquare,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Star,
  BookOpen,
  Users,
  Heart,
  Leaf,
} from "lucide-react"

interface UserProfile {
  age: number
  gender: string
  location: string
  diet: "vegetarian" | "non-vegetarian" | "vegan"
  familyType: "nuclear" | "joint"
  economicStatus: "low" | "middle" | "high"
  language: string
}

interface AIFormAssistantProps {
  currentField?: string
  currentValue?: string
  userProfile?: UserProfile
  onVoiceInput?: (text: string) => void
  onSuggestionSelect?: (suggestion: string) => void
}

interface CulturalAdaptation {
  dietaryRecommendations: string[]
  lifestyleAdjustments: string[]
  ayurvedicConsiderations: string[]
  economicAlternatives: string[]
  familyInvolvement: string[]
}

export default function AIFormAssistant({
  currentField,
  currentValue,
  userProfile,
  onVoiceInput,
  onSuggestionSelect,
}: AIFormAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [explanation, setExplanation] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [culturalAdaptation, setCulturalAdaptation] = useState<CulturalAdaptation | null>(null)
  const [autoComplete, setAutoComplete] = useState<Array<{ text: string; category: string; confidence: number }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: string]: boolean }>({})
  const [showTermExplanation, setShowTermExplanation] = useState(false)
  const [voiceText, setVoiceText] = useState("")

  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = userProfile?.language === "hindi" ? "hi-IN" : "en-IN"

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setVoiceText(transcript)
        processVoiceInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [userProfile?.language])

  // Auto-complete as user types
  useEffect(() => {
    if (currentValue && currentValue.length > 2) {
      const timer = setTimeout(() => {
        fetchAutoComplete(currentValue)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setAutoComplete([])
    }
  }, [currentValue])

  // Generate suggestions when field changes
  useEffect(() => {
    if (currentField && currentValue) {
      generateSuggestions(currentField, currentValue)
    }
  }, [currentField, currentValue])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = userProfile?.language === "hindi" ? "hi-IN" : "en-IN"
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const explainTerm = async (term: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-form-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "explain_term",
          data: { term, userProfile },
        }),
      })

      const data = await response.json()
      if (data.explanation) {
        setExplanation(data.explanation)
        setShowTermExplanation(true)
      }
    } catch (error) {
      console.error("Error explaining term:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSuggestions = async (field: string, value: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai-form-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "suggest_questions",
          data: { symptom: value, context: field },
        }),
      })

      const data = await response.json()
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      }

      // Also get cultural adaptation
      if (userProfile) {
        const culturalResponse = await fetch("/api/ai-form-helper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "cultural_adapt",
            data: { symptom: value, userProfile },
          }),
        })

        const culturalData = await culturalResponse.json()
        if (culturalData.culturalAdaptation) {
          setCulturalAdaptation(culturalData.culturalAdaptation)
        }
      }
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const processVoiceInput = async (voiceInput: string) => {
    try {
      const response = await fetch("/api/ai-form-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "process_voice",
          data: { voiceInput },
        }),
      })

      const data = await response.json()
      if (data.structuredData && onVoiceInput) {
        onVoiceInput(JSON.stringify(data.structuredData))
      }
    } catch (error) {
      console.error("Error processing voice input:", error)
    }
  }

  const fetchAutoComplete = async (partialInput: string) => {
    try {
      const response = await fetch("/api/ai-form-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "auto_complete",
          data: { partialInput },
        }),
      })

      const data = await response.json()
      if (data.autoComplete) {
        setAutoComplete(data.autoComplete)
      }
    } catch (error) {
      console.error("Error fetching auto-complete:", error)
    }
  }

  const provideFeedback = async (type: "helpful" | "not_helpful", context: string) => {
    setFeedbackGiven({ ...feedbackGiven, [context]: true })
    // In a real app, you'd send this to your analytics/learning system
    console.log(`Feedback: ${type} for ${context}`)
  }

  return (
    <div className="space-y-4">
      {/* AI Assistant Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            AI Medical Assistant
            <Badge variant="outline" className="ml-2 text-xs text-blue-600 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Culturally Adapted for India
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => explainTerm(currentValue || "")}
              disabled={!currentValue || isLoading}
              className="bg-transparent"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Explain Medical Term
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isListening ? stopListening : startListening}
              className={`bg-transparent ${isListening ? "text-red-600 border-red-200" : ""}`}
            >
              {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isListening ? "Stop Listening" : "Voice Input"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isSpeaking ? stopSpeaking : () => speakText(explanation || "No text to read")}
              disabled={!explanation}
              className="bg-transparent"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
              {isSpeaking ? "Stop Reading" : "Read Aloud"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Input Display */}
      {voiceText && (
        <Alert className="border-green-200 bg-green-50">
          <Mic className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold mb-1">Voice Input Detected:</div>
            <div className="italic">"{voiceText}"</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Auto-complete Suggestions */}
      {autoComplete.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {autoComplete.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSuggestionSelect?.(suggestion.text)}
                >
                  <div>
                    <span className="font-medium">{suggestion.text}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.round(suggestion.confidence * 5) }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medical Term Explanation */}
      {showTermExplanation && explanation && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-sm">
                <BookOpen className="w-4 h-4 mr-2 text-purple-600" />
                Medical Term Explanation
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowTermExplanation(false)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-purple-900">{explanation}</div>
            </div>
            {!feedbackGiven.explanation && (
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-purple-200">
                <span className="text-sm text-purple-700">Was this explanation helpful?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => provideFeedback("helpful", "explanation")}
                  className="h-6 px-2"
                >
                  <ThumbsUp className="w-3 h-3 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => provideFeedback("not_helpful", "explanation")}
                  className="h-6 px-2"
                >
                  <ThumbsDown className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Question Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm">
              <MessageSquare className="w-4 h-4 mr-2 text-orange-600" />
              AI Suggests These Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 border border-orange-200 rounded-lg hover:bg-orange-100 cursor-pointer transition-colors"
                  onClick={() => onSuggestionSelect?.(suggestion)}
                >
                  <div className="text-sm text-orange-900">{suggestion}</div>
                </div>
              ))}
            </div>
            {!feedbackGiven.suggestions && (
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-orange-200">
                <span className="text-sm text-orange-700">Are these suggestions helpful?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => provideFeedback("helpful", "suggestions")}
                  className="h-6 px-2"
                >
                  <ThumbsUp className="w-3 h-3 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => provideFeedback("not_helpful", "suggestions")}
                  className="h-6 px-2"
                >
                  <ThumbsDown className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cultural Adaptation */}
      {culturalAdaptation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm">
              <Globe className="w-4 h-4 mr-2 text-green-600" />
              Personalized for Indian Lifestyle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {culturalAdaptation.dietaryRecommendations.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  <span className="font-semibold text-sm">Dietary Recommendations</span>
                </div>
                <div className="space-y-1">
                  {culturalAdaptation.dietaryRecommendations.map((rec, index) => (
                    <div key={index} className="text-sm text-green-800 pl-6">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {culturalAdaptation.ayurvedicConsiderations.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Leaf className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-semibold text-sm">Ayurvedic Wisdom</span>
                </div>
                <div className="space-y-1">
                  {culturalAdaptation.ayurvedicConsiderations.map((rec, index) => (
                    <div key={index} className="text-sm text-green-800 pl-6">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {culturalAdaptation.familyInvolvement.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="font-semibold text-sm">Family Support</span>
                </div>
                <div className="space-y-1">
                  {culturalAdaptation.familyInvolvement.map((rec, index) => (
                    <div key={index} className="text-sm text-green-800 pl-6">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {culturalAdaptation.economicAlternatives.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💰</span>
                  <span className="font-semibold text-sm">Budget-Friendly Options</span>
                </div>
                <div className="space-y-1">
                  {culturalAdaptation.economicAlternatives.map((rec, index) => (
                    <div key={index} className="text-sm text-green-800 pl-6">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!feedbackGiven.cultural && (
              <div className="flex items-center space-x-2 pt-3 border-t border-green-200">
                <span className="text-sm text-green-700">Is this cultural adaptation helpful?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => provideFeedback("helpful", "cultural")}
                  className="h-6 px-2"
                >
                  <ThumbsUp className="w-3 h-3 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => provideFeedback("not_helpful", "cultural")}
                  className="h-6 px-2"
                >
                  <ThumbsDown className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Learning Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="text-sm">
            <strong>AI Learning:</strong> This assistant learns from your feedback to provide better recommendations.
            Your interactions help improve medical AI for Indian patients.
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
