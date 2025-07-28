"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MyMedLogo from "./mymed-logo"
import {
  Send,
  Mic,
  ImageIcon,
  AlertTriangle,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
  Activity,
  Home,
  RotateCcw,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  sources?: string[]
  confidence?: number
}

export default function AIHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hello! I'm your MYMED.AI health assistant. I'm here to help you with:

• Quick health questions and symptom guidance
• Medication information and interactions
• General wellness advice
• When to seek medical care

⚠️ **Important Disclaimer**: I provide general health information only. For medical emergencies, call 911. Always consult healthcare professionals for diagnosis and treatment.

What health question can I help you with today?`,
      timestamp: new Date(),
      confidence: 95,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Sample responses based on common health queries
    const message = userMessage.toLowerCase()

    if (message.includes("ibuprofen") && message.includes("antibiotic")) {
      return `**Ibuprofen and Antibiotics Interaction:**

✅ **Generally Safe**: Most antibiotics can be taken with ibuprofen without significant interactions.

**Key Points:**
• Ibuprofen may reduce effectiveness of some antibiotics like quinolones
• Take medications as prescribed and space them apart if possible
• Monitor for increased side effects like stomach upset

**Recommendations:**
• Take ibuprofen with food to reduce stomach irritation
• Stay hydrated while on antibiotics
• Complete the full antibiotic course even if feeling better

⚠️ **Consult your pharmacist or doctor** if you experience unusual symptoms or have concerns about specific medications.

*Confidence: 92% | Sources: FDA Drug Interaction Database, Mayo Clinic*`
    }

    if (message.includes("vitamin d") && message.includes("symptom")) {
      return `**Low Vitamin D Symptoms:**

🔍 **Common Signs & Symptoms:**
• Fatigue and tiredness
• Bone and back pain
• Depression or mood changes
• Impaired wound healing
• Hair loss
• Muscle pain and weakness
• Frequent infections or illnesses

**Risk Factors:**
• Limited sun exposure
• Dark skin pigmentation
• Age over 65
• Obesity
• Certain medical conditions

**Recommendations:**
• Get blood test (25-hydroxyvitamin D) to check levels
• Increase sun exposure (10-30 minutes daily)
• Include vitamin D rich foods: fatty fish, egg yolks, fortified foods
• Consider vitamin D3 supplements (consult doctor for dosage)

**Normal Levels:**
• Sufficient: 30+ ng/mL (75+ nmol/L)
• Insufficient: 12-30 ng/mL (30-75 nmol/L)
• Deficient: <12 ng/mL (<30 nmol/L)

⚠️ **See your doctor** if you experience persistent fatigue, bone pain, or multiple symptoms.

*Confidence: 94% | Sources: National Institutes of Health, Endocrine Society Guidelines*`
    }

    if (message.includes("headache") || message.includes("head pain")) {
      return `**Headache Assessment & Guidance:**

🧠 **Types of Headaches:**
• **Tension headaches**: Band-like pressure, stress-related
• **Migraines**: Throbbing, often with nausea, light sensitivity
• **Cluster headaches**: Severe, one-sided, around eye area
• **Sinus headaches**: Pressure in forehead, cheeks, around eyes

**Immediate Relief Options:**
• Rest in a quiet, dark room
• Apply cold or warm compress
• Stay hydrated (drink water)
• Over-the-counter pain relievers (follow package directions)
• Gentle neck and shoulder stretches

**When to Seek Medical Care:**
🚨 **Seek immediate care if headache:**
• Sudden, severe ("worst headache of life")
• With fever, stiff neck, confusion
• After head injury
• With vision changes, weakness, difficulty speaking
• Different from usual pattern

**Prevention Tips:**
• Maintain regular sleep schedule
• Stay hydrated
• Manage stress
• Identify and avoid triggers
• Regular exercise

*Confidence: 91% | Sources: American Migraine Foundation, Mayo Clinic*`
    }

    if (message.includes("chest pain") || message.includes("heart")) {
      return `**Chest Pain - Important Information:**

🚨 **EMERGENCY SIGNS - Call 911 if you have:**
• Crushing, squeezing chest pain
• Pain radiating to arm, jaw, or back
• Shortness of breath
• Nausea, sweating, dizziness
• Pain lasting more than a few minutes

**Non-Emergency Chest Discomfort:**
• Sharp, stabbing pain that's brief
• Pain that worsens with movement or breathing
• Muscle strain from exercise
• Anxiety-related chest tightness

**Common Causes:**
• Heart-related: Angina, heart attack, heart disease
• Lung-related: Pneumonia, pleurisy, pulmonary embolism
• Digestive: Acid reflux, heartburn
• Musculoskeletal: Muscle strain, rib injury
• Anxiety: Panic attacks, stress

**When to Contact Healthcare Provider:**
• Recurring chest discomfort
• Pain with physical activity
• Persistent heartburn
• Unexplained shortness of breath

⚠️ **Don't delay care** - chest pain can be serious. When in doubt, seek medical evaluation immediately.

*This is an emergency-sensitive topic. Please consult healthcare professionals for proper evaluation.*`
    }

    // Default response for general queries
    return `Thank you for your health question. I'd be happy to help provide general information.

**For the most accurate assistance, please provide more specific details about:**
• Your specific symptoms or concerns
• How long you've experienced them
• Any relevant medical history
• Current medications

**I can help with:**
• General health information
• Symptom guidance (non-emergency)
• Medication questions
• Wellness tips
• When to seek care

**Common Questions I Answer:**
• "Can I take [medication] with [medication]?"
• "What are symptoms of [condition]?"
• "When should I see a doctor for [symptom]?"
• "How can I improve my [health aspect]?"

Please feel free to ask a more specific health question, and I'll provide detailed, helpful information.

*Confidence: 88% | Always consult healthcare professionals for medical advice*`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await simulateAIResponse(inputMessage.trim())

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 15) + 85, // 85-99% confidence
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment. For urgent health concerns, contact your healthcare provider or emergency services.",
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "ai",
        content: `Hello! I'm your MYMED.AI health assistant. I'm here to help you with:

• Quick health questions and symptom guidance
• Medication information and interactions
• General wellness advice
• When to seek medical care

⚠️ **Important Disclaimer**: I provide general health information only. For medical emergencies, call 911. Always consult healthcare professionals for diagnosis and treatment.

What health question can I help you with today?`,
        timestamp: new Date(),
        confidence: 95,
      },
    ])
    setInputMessage("")
  }

  const quickQuestions = [
    "Can I take ibuprofen with antibiotics?",
    "What are the symptoms of low vitamin D?",
    "When should I see a doctor for a headache?",
    "How much water should I drink daily?",
    "What's normal blood pressure range?",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Disclaimer Alert */}
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Medical Disclaimer:</strong> This AI provides general health information only and is not a substitute
          for professional medical advice, diagnosis, or treatment. For emergencies, call 911. Always consult healthcare
          professionals for medical concerns.
        </AlertDescription>
      </Alert>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center space-x-2">
            <MyMedLogo size="sm" showText={false} />
            <span>MYMED.AI Quick Chat</span>
            <Badge variant="outline" className="ml-auto bg-green-100 text-green-800">
              <Activity className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Secure • Private • AI-Powered</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === "user" ? "bg-purple-600 text-white" : "bg-gray-100 border border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === "ai" && <MyMedLogo size="sm" showText={false} className="flex-shrink-0 mt-1" />}
                  {message.type === "user" && <User className="w-5 h-5 flex-shrink-0 mt-1" />}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.confidence && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">{message.confidence}% confidence</span>
                          </>
                        )}
                      </div>
                      {message.type === "ai" && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <MyMedLogo size="sm" showText={false} className="animate-pulse" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4 space-y-3">
          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">Quick questions to get started:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-xs hover:bg-purple-50 hover:border-purple-200"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me a health question... (e.g., 'Can I take medicine X with Y?')"
                className="pr-20 focus:ring-purple-500"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-purple-100"
                  onClick={() => setIsListening(!isListening)}
                >
                  <Mic className={`w-3 h-3 ${isListening ? "text-red-500" : "text-gray-400"}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-purple-100">
                  <ImageIcon className="w-3 h-3 text-gray-400" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={resetChat}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset Chat
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
            </div>
            <p className="text-xs text-gray-500">Powered by MYMED.AI • For emergencies, call 911</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
