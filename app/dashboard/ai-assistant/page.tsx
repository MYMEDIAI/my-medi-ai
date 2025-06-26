"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Bot,
  User,
  Heart,
  Activity,
  Brain,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Clock,
  Mic,
  Camera,
  FileText,
} from "lucide-react"
import { useState } from "react"

export default function AIAssistantPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI Health Assistant. I'm here to help you with health questions, symptom analysis, and wellness guidance. How can I assist you today?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: 2,
      type: "user",
      content: "I've been having headaches for the past few days. What could be causing this?",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
    },
    {
      id: 3,
      type: "ai",
      content:
        "I understand you're experiencing headaches. There are several potential causes including stress, dehydration, lack of sleep, or eye strain. Can you tell me more about: 1) When do they occur most? 2) How would you rate the pain (1-10)? 3) Any other symptoms like nausea or sensitivity to light?",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
    },
    {
      id: 4,
      type: "user",
      content: "They usually happen in the afternoon, around 7/10 pain level, and I do feel a bit nauseous.",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: 5,
      type: "ai",
      content:
        "Based on your symptoms (afternoon timing, 7/10 pain, nausea), this could indicate tension headaches or possibly migraines. I recommend: 1) Stay hydrated 2) Take regular breaks from screens 3) Practice stress management 4) Consider seeing a doctor if symptoms persist. Would you like me to help you track these symptoms or provide relaxation techniques?",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
    },
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newUserMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: message,
      timestamp: new Date(),
    }

    const aiResponse = {
      id: messages.length + 2,
      type: "ai" as const,
      content:
        "Thank you for your question! In this demo, I would analyze your symptoms and provide personalized health insights. The full AI assistant would offer real-time medical guidance, symptom tracking, and wellness recommendations.",
      timestamp: new Date(),
    }

    setMessages([...messages, newUserMessage, aiResponse])
    setMessage("")
  }

  const quickActions = [
    { label: "Symptom Checker", icon: Stethoscope, color: "bg-red-50 text-red-600" },
    { label: "Medication Reminder", icon: Clock, color: "bg-blue-50 text-blue-600" },
    { label: "Health Tips", icon: Heart, color: "bg-green-50 text-green-600" },
    { label: "Wellness Plan", icon: Activity, color: "bg-purple-50 text-purple-600" },
  ]

  const aiCapabilities = [
    {
      title: "Symptom Analysis",
      description: "Analyze symptoms and provide preliminary health insights",
      icon: Brain,
      status: "Active",
    },
    {
      title: "Voice Recognition",
      description: "Speak your symptoms for hands-free interaction",
      icon: Mic,
      status: "Demo",
    },
    {
      title: "Image Analysis",
      description: "Upload images for visual health assessment",
      icon: Camera,
      status: "Demo",
    },
    {
      title: "Health Records Integration",
      description: "Access your medical history for personalized advice",
      icon: FileText,
      status: "Active",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h1>
            <p className="text-gray-600">Get personalized health insights and medical guidance</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800 mt-2 md:mt-0">🤖 AI-Powered</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {msg.type === "ai" && <Bot className="w-4 h-4 mt-0.5 text-purple-600" />}
                        {msg.type === "user" && <User className="w-4 h-4 mt-0.5 text-white" />}
                        <div className="flex-1">
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.type === "user" ? "text-blue-200" : "text-gray-500"}`}>
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask about symptoms, medications, or health concerns..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Mic className="w-4 h-4 mr-1" />
                      Voice
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-1" />
                      Image
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Press Enter to send</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="outline" className="w-full justify-start">
                    <div className={`p-1 rounded mr-3 ${action.color}`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <capability.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{capability.title}</h4>
                        <Badge variant={capability.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {capability.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Great hydration!</p>
                    <p className="text-xs text-green-700">You've met 80% of your daily water goal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Sleep reminder</p>
                    <p className="text-xs text-yellow-700">Consider sleeping earlier for better rest</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Information */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Brain className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-purple-900">AI Assistant Demo Features</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Current Demo Capabilities:</h4>
                <ul className="space-y-1 text-purple-700">
                  <li>• Interactive chat interface</li>
                  <li>• Symptom discussion simulation</li>
                  <li>• Health guidance examples</li>
                  <li>• Quick action buttons</li>
                  <li>• Real-time conversation flow</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Full Version Features:</h4>
                <ul className="space-y-1 text-purple-700">
                  <li>• Advanced AI medical analysis</li>
                  <li>• Voice and image recognition</li>
                  <li>• Integration with health records</li>
                  <li>• Personalized recommendations</li>
                  <li>• 24/7 intelligent health support</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
