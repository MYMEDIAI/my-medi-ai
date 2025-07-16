"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send, Loader2 } from "lucide-react"

export function ProductionChatWidget() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")

  const handleSend = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type: "chat" }),
      })
      const data = await res.json()
      setResponse(data.response || "I'm here to help with your health questions!")
    } catch {
      setResponse("I'm here to help! Try asking about symptoms, medications, or general health advice.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-700">
          <MessageCircle className="w-5 h-5 mr-2" />
          AI Health Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg min-h-[100px]">
          {response ? (
            <p className="text-sm text-blue-800">{response}</p>
          ) : (
            <p className="text-sm text-blue-600">Ask me anything about your health...</p>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Type your health question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="text-sm"
          />
          <Button onClick={handleSend} disabled={isLoading} size="sm" className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        <Link href="/chat">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Open Full Chat
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
