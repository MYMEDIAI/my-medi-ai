import AIHealthChat from "@/components/ai-health-chat"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">AI Health Assistant</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered health suggestions. Completely anonymous, no data stored.
          </p>
        </div>
        <AIHealthChat />
      </div>
    </div>
  )
}
