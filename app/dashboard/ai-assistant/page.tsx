"use client"

import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ChatInterface from "@/components/ai-assistant/chat-interface"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="ai-assistant">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Chat with your personal health AI assistant</p>
          </div>

          <ChatInterface />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
