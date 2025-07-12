import AIFeatureTester from "@/components/ai-feature-tester"

export default function AIFeatureTestingPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">AI Feature Testing Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Run tests to validate the functionality and performance of AI-powered features.
      </p>
      <AIFeatureTester />
    </div>
  )
}
