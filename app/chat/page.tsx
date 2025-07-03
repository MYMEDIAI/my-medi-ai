"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Bot, User, Loader2, Heart, Brain, Stethoscope, AlertTriangle, Home, RotateCcw } from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI health assistant powered by advanced medical knowledge. I can help you with:\n\n• Symptom analysis and health concerns\n• Medication information and interactions\n• Diet and nutrition advice\n• Exercise recommendations\n• General health questions\n\nHow can I assist you with your health today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const resetChat = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hello! I'm your AI health assistant powered by advanced medical knowledge. I can help you with:\n\n• Symptom analysis and health concerns\n• Medication information and interactions\n• Diet and nutrition advice\n• Exercise recommendations\n• General health questions\n\nHow can I assist you with your health today?",
        timestamp: new Date(),
      },
    ])
    setInputMessage("")
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
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          type: "chat",
        }),
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response || "I'm here to help with your health questions. Could you please rephrase that?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment. For urgent medical concerns, please contact your healthcare provider or emergency services.",
        timestamp: new Date(),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={resetChat} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Health Assistant
                <Badge className="bg-white/20 text-white hover:bg-white/20 ml-auto">
                  <Heart className="w-3 h-3 mr-1" />
                  Powered by Gemini AI
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "ai" && (
                        <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500">
                          <AvatarFallback className="bg-transparent">
                            <Bot className="w-4 h-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.type === "user" && (
                        <Avatar className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500">
                          <AvatarFallback className="bg-transparent">
                            <User className="w-4 h-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500">
                        <AvatarFallback className="bg-transparent">
                          <Bot className="w-4 h-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    This AI assistant provides general health information only. For medical emergencies, contact
                    emergency services immediately.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about your health concerns, symptoms, medications..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("I have a headache that's been bothering me for 2 days")}
                    disabled={isLoading}
                  >
                    <Stethoscope className="w-3 h-3 mr-1" />
                    Headache symptoms
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("What should I eat for better heart health?")}
                    disabled={isLoading}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Heart healthy diet
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage("How much water should I drink daily?")}
                    disabled={isLoading}
                  >
                    💧 Daily water intake
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
