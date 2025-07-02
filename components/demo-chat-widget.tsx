"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Send, Mic, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "openai" | "gemini"
  content: string
  timestamp: Date
}

export default function DemoChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "openai",
      content: "Hello! I'm OpenAI GPT-4. I can help with your health questions using advanced medical knowledge.",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "gemini",
      content:
        "Hi! I'm Google Gemini. I can provide health insights with cultural context for Indian healthcare needs.",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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

    // Simulate AI responses
    setTimeout(() => {
      const openaiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "openai",
        content: `OpenAI: Based on your query "${inputMessage}", I recommend consulting with a healthcare professional for proper diagnosis. Here are some general considerations...`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, openaiResponse])
    }, 1000)

    setTimeout(() => {
      const geminiResponse: Message = {
        id: (Date.now() + 2).toString(),
        type: "gemini",
        content: `Gemini: I agree with OpenAI's assessment. Additionally, considering Indian healthcare context, you might also explore traditional remedies alongside modern treatment...`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, geminiResponse])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>🧠 DUAL AI HEALTH ASSISTANT</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-100">Ask in any Indian language or dialect</p>

        <div className="h-48 overflow-y-auto space-y-2 bg-black/20 rounded-lg p-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-2 text-xs ${
                  message.type === "user"
                    ? "bg-purple-600 text-white"
                    : message.type === "openai"
                      ? "bg-green-500/20 text-green-100 border border-green-500/30"
                      : "bg-blue-500/20 text-blue-100 border border-blue-500/30"
                }`}
              >
                <div className="flex items-center space-x-1 mb-1">
                  {message.type === "user" && <User className="w-3 h-3" />}
                  {message.type === "openai" && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                  {message.type === "gemini" && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  <span className="text-xs font-medium">
                    {message.type === "user" ? "You" : message.type === "openai" ? "OpenAI" : "Gemini"}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-500/20 text-gray-100 rounded-lg p-2 text-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about symptoms, medications, or health advice..."
            className="bg-black/30 border-purple-500/30 text-white placeholder-gray-300 text-xs"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="bg-red-500/20 border-red-500/30 text-red-100 hover:bg-red-500/30 text-xs">
            <Mic className="w-3 h-3 mr-1" />
            Voice Input
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-purple-500/30 text-purple-200 bg-transparent hover:bg-purple-500/20 text-xs"
          >
            AI Debate Mode
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
