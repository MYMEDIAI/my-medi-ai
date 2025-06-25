import type React from "react"
export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type: "text" | "image" | "voice"
  imageUrl?: string
  voiceUrl?: string
  rating?: "up" | "down" | null
  isTyping?: boolean
}

export interface ChatSession {
  id: string
  userId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  title?: string
}

export interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  color: string
}
