import HealthAssessmentForm from "@/components/health-assessment-form"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
        </div>
      </header>

      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">MYMED.AI Health Assessment</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get comprehensive AI-powered health analysis with risk assessment, personalized recommendations, and
              detailed action plans
            </p>
          </div>
          <HealthAssessmentForm />
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}
