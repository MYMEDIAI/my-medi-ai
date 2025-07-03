"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Loader2, ArrowRight } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

function DemoChatWidgetComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI health assistant powered by Google Gemini. I can help you with health questions, symptom analysis, and medical guidance. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    "I have a headache for 2 days",
    "What should I eat for better immunity?",
    "Can I take paracetamol with antibiotics?",
    "How much water should I drink daily?",
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage.trim()
    setInputMessage("")
    setIsLoading(true)

    try {
      // Call the actual AI integration API
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          type: "chat",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      let aiResponse = ""
      if (data.response) {
        aiResponse = typeof data.response === "string" ? data.response : JSON.stringify(data.response)
      } else if (data.error) {
        aiResponse = `I apologize, but I'm experiencing some technical difficulties: ${data.error}. Please try again or contact support if the issue persists.`
      } else {
        aiResponse = "I'm here to help with your health questions! Could you please rephrase your question?"
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("AI chat error:", error)

      // Provide a helpful fallback response
      let fallbackResponse = ""
      const message = currentMessage.toLowerCase()

      if (message.includes("headache")) {
        fallbackResponse = `For headaches lasting 2 days, here are some general recommendations:

**Immediate Relief:**
• Rest in a quiet, dark room
• Apply cold compress to forehead
• Stay hydrated - drink plenty of water
• Consider over-the-counter pain relievers like paracetamol

**When to see a doctor:**
• If headache is severe or worsening
• Accompanied by fever, stiff neck, or vision changes
• Persistent for more than 3 days

**Prevention tips:**
• Maintain regular sleep schedule
• Manage stress levels
• Stay hydrated throughout the day

⚠️ This is general information. For persistent or severe headaches, please consult a healthcare professional.`
      } else if (message.includes("immunity") || message.includes("immune")) {
        fallbackResponse = `Here are foods that can help boost immunity:

**Vitamin C Rich Foods:**
• Citrus fruits (oranges, lemons, amla)
• Bell peppers, broccoli
• Strawberries, kiwi

**Indian Superfoods:**
• Turmeric, ginger
• Tulsi (holy basil)
• Garlic, onions
• Green leafy vegetables

**Daily Habits:**
• 7-8 hours of sleep
• Regular exercise
• Stress management
• Adequate hydration

⚠️ This is general nutritional information. Consult a healthcare provider for personalized advice.`
      } else {
        fallbackResponse = `I'm currently experiencing connectivity issues, but I'm here to help! 

I can assist you with:
• Health questions and symptom guidance
• Medication information
• Nutrition and wellness advice
• When to seek medical care

Please try asking your question again, or visit our full AI chat for more comprehensive assistance.

⚠️ For urgent medical concerns, please contact your healthcare provider immediately.`
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: fallbackResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="border-blue-100 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-700">
          <MessageCircle className="w-5 h-5 mr-2" />💬 AI Health Chat
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Live AI
          </Badge>
          <span className="text-xs text-gray-500">Powered by Gemini AI</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === "ai" && <Bot className="w-4 h-4 mt-0.5 text-blue-600" />}
                  {message.type === "user" && <User className="w-4 h-4 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Try these quick questions:</p>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs text-left justify-start h-auto py-2 px-3 hover:bg-blue-50 hover:border-blue-200"
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your health..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        <div className="pt-2 border-t">
          <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
            <a href="/chat">
              Open Full AI Chat
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Default export
export default DemoChatWidgetComponent

// Named export for compatibility
export const DemoChatWidget = DemoChatWidgetComponent
