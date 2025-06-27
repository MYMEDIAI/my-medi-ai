import AIHealthChat from "@/components/ai-health-chat"
import NavigationButtons from "@/components/navigation-buttons"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">AI Health Assistant</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant AI-powered health suggestions. Completely anonymous, no data stored.
            </p>
          </div>
          <div className="hidden md:block">
            <NavigationButtons showReset={false} />
          </div>
        </div>
        <AIHealthChat />
      </div>
    </div>
  )
}
