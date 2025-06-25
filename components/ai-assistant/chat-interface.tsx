"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Mic,
  ImageIcon,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Trash2,
  Bot,
  Stethoscope,
  Pill,
  Heart,
  Phone,
  Calendar,
  MicOff,
  Loader2,
} from "lucide-react"
import type { ChatMessage, QuickAction } from "@/types/chat"
import { useAuth } from "@/contexts/auth-context"

const quickActions: QuickAction[] = [
  {
    id: "symptoms",
    label: "I have symptoms",
    icon: Stethoscope,
    prompt: "I'm experiencing some symptoms and would like to discuss them with you.",
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
  {
    id: "medications",
    label: "Check my medications",
    icon: Pill,
    prompt: "Can you help me review my current medications and check for any interactions?",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "health-tips",
    label: "Health tips",
    icon: Heart,
    prompt: "Can you give me some personalized health tips based on my profile?",
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  {
    id: "emergency",
    label: "Emergency help",
    icon: Phone,
    prompt: "I need emergency medical guidance. This is urgent.",
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
  {
    id: "appointment",
    label: "Book appointment",
    icon: Calendar,
    prompt: "I'd like to book an appointment with a healthcare provider.",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
]

export default function ChatInterface() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: `Hello ${user?.user_metadata?.full_name || "there"}! I'm your AI health assistant. How can I help you today? You can ask me about symptoms, medications, health tips, or any health-related questions.`,
      sender: "ai",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string, type: "text" | "image" = "text") => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setCharacterCount(0)
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Thank you for sharing that with me. Based on what you've described, I'd recommend consulting with a healthcare professional for a proper evaluation. In the meantime, here are some general suggestions...",
      "I understand your concern. While I can provide general health information, it's important to remember that I'm not a substitute for professional medical advice. Here's what I can tell you...",
      "That's a great question about your health. Let me provide you with some evidence-based information that might be helpful...",
      "I appreciate you trusting me with your health concerns. For symptoms like these, it's always best to get a proper medical evaluation. However, I can share some general guidance...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt)
  }

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording)
    // Implement voice recording logic here
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Implement image upload logic here
      handleSendMessage(`Uploaded image: ${file.name}`, "image")
    }
  }

  const handleRateMessage = (messageId: string, rating: "up" | "down") => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg)))
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleClearConversation = () => {
    setMessages([
      {
        id: "welcome",
        content: `Hello ${user?.user_metadata?.full_name || "there"}! I'm your AI health assistant. How can I help you today?`,
        sender: "ai",
        timestamp: new Date(),
        type: "text",
      },
    ])
  }

  const handleExportChat = () => {
    const chatText = messages
      .map((msg) => `${msg.sender.toUpperCase()} (${msg.timestamp.toLocaleString()}): ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `health-chat-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setCharacterCount(value.length)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Health Assistant</h3>
            <p className="text-sm text-gray-500">Always here to help with your health questions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportChat}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearConversation}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className={`${action.color} text-xs`}
                onClick={() => handleQuickAction(action)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
              <div
                className={`
                  rounded-2xl px-4 py-3 shadow-sm
                  ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-white text-gray-900 border border-gray-200"
                  }
                `}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === "ai" && (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-green-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.sender === "ai" && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={() => handleCopyMessage(message.content)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${message.rating === "up" ? "text-green-600 bg-green-50" : "hover:bg-gray-100"}`}
                            onClick={() => handleRateMessage(message.id, "up")}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${message.rating === "down" ? "text-red-600 bg-red-50" : "hover:bg-gray-100"}`}
                            onClick={() => handleRateMessage(message.id, "down")}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md xl:max-w-lg">
              <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                className={`${isRecording ? "bg-red-50 text-red-600 border-red-200" : ""}`}
                onClick={handleVoiceRecording}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleImageUpload}>
                <ImageIcon className="w-4 h-4" />
              </Button>
              {characterCount > 0 && <span className="text-xs text-gray-500">{characterCount}/500</span>}
            </div>
            <div className="flex items-end space-x-2">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask me about your health..."
                className="flex-1 min-h-[44px] resize-none"
                maxLength={500}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(inputValue)
                  }
                }}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-[44px]"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>
    </div>
  )
}
