import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ChatInterface from "@/components/ai-assistant/chat-interface"

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="ai-assistant">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Assistant</h1>
            <p className="text-gray-600">
              Chat with your personal AI health assistant for medical guidance and support
            </p>
          </div>

          <ChatInterface />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
