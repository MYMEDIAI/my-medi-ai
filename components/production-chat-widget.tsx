"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, Send, Bot, User, Home, RotateCcw, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export function ProductionChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI health assistant. You can ask me about symptoms, medications, or general health advice. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [patientName, setPatientName] = useState("")

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Based on your symptoms "${input}", I recommend getting adequate rest and staying hydrated. If symptoms persist or worsen, please consult with a healthcare provider. Is there anything else you'd like to know?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleReset = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content:
          "Hello! I'm your AI health assistant. You can ask me about symptoms, medications, or general health advice. How can I help you today?",
        timestamp: new Date(),
      },
    ])
    setInput("")
    setPatientName("")
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - AI Health Chat Report</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 800px;
            margin: 0 auto;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin: -30px -30px 30px -30px;
            padding: 30px;
            border-radius: 15px 15px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .chat-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .message {
            margin: 15px 0;
            padding: 15px;
            border-radius: 10px;
            max-width: 80%;
          }
          .user-message {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin-left: auto;
            text-align: right;
          }
          .ai-message {
            background: #e8f2ff;
            color: #333;
            border: 1px solid #d0e7ff;
          }
          .timestamp {
            font-size: 0.8em;
            opacity: 0.7;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9em;
            color: #666;
          }
          .patient-info {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          @media print { 
            body { margin: 0; background: white !important; } 
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏥</div>
            <h1>MyMedi.ai - AI Health Chat</h1>
            <p>Comprehensive AI-Powered Health Consultation</p>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
          </div>
          
          ${
            patientName
              ? `
          <div class="patient-info">
            <h3>👤 Patient Information</h3>
            <p><strong>Name:</strong> ${patientName}</p>
            <p><strong>Consultation Date:</strong> ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: true,
            })}</p>
          </div>
          `
              : ""
          }

          <div class="chat-section">
            <h3>🤖 AI Health Consultation Chat</h3>
            ${messages
              .map(
                (message) => `
              <div class="message ${message.type === "user" ? "user-message" : "ai-message"}">
                <strong>${message.type === "user" ? "👤 You" : "🤖 AI Doctor"}:</strong>
                <p>${message.content}</p>
                <div class="timestamp">${message.timestamp.toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour12: true,
                })}</div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This AI consultation is for educational purposes only and does not replace professional medical advice.</p>
            <p><em>Always consult with qualified healthcare providers for medical decisions.</em></p>
            <p>📧 Contact: Harsha@mymedi.ai | 📱 Made in India with ❤️</p>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    const content = `
MyMedi.ai - AI Health Chat Report
Generated on: ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })}

${
  patientName
    ? `PATIENT INFORMATION:
Name: ${patientName}
Consultation Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
Time: ${new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })}

`
    : ""
}AI HEALTH CONSULTATION CHAT:

${messages
  .map(
    (message) => `
${message.type === "user" ? "👤 You" : "🤖 AI Doctor"}: ${message.content}
Time: ${message.timestamp.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    })}
`,
  )
  .join("\n")}

---
DISCLAIMER: This AI consultation is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-AI-Chat-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-purple-700">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            AI Health Chat
          </div>
          <div className="flex gap-1">
            <Button onClick={handlePrint} variant="ghost" size="sm" title="Print Chat">
              <Printer className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownload} variant="ghost" size="sm" title="Download Chat">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={handleReset} variant="ghost" size="sm" title="Reset Chat">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!patientName && (
          <div className="mb-4">
            <Input
              placeholder="Enter your name (optional)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="text-sm"
            />
          </div>
        )}

        <ScrollArea className="h-48 bg-purple-50 p-3 rounded-lg">
          {messages.map((message) => (
            <div key={message.id} className={`mb-3 flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  message.type === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-purple-200 text-purple-800"
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {message.type === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  <span className="font-medium text-xs">
                    {message.type === "user" ? patientName || "You" : "AI Doctor"}
                  </span>
                </div>
                <p>{message.content}</p>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="bg-white border border-purple-200 text-purple-800 p-2 rounded-lg text-sm">
                <div className="flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  <span className="font-medium text-xs">AI Doctor</span>
                </div>
                <p>AI is analyzing your question...</p>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Type your health question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="text-sm"
            disabled={isLoading}
          />
          <Button onClick={handleSend} size="sm" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
