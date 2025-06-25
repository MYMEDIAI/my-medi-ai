import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Activity, Users, Target, MessageSquare, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">My Medi.AI Dashboard</h1>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Health Dashboard</h2>
          <p className="mt-2 text-gray-600">Manage your health journey with AI-powered insights</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/records">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 text-blue-600 mr-2" />
                  Health Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and manage your medical history, prescriptions, and test results.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/vitals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-6 w-6 text-green-600 mr-2" />
                  Vitals Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Monitor your vital signs, symptoms, and daily health metrics.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/ai-assistant">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-purple-600 mr-2" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get personalized health insights and recommendations from our AI.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/family">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 text-orange-600 mr-2" />
                  Family Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect with family members and manage shared health information.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/goals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 text-red-600 mr-2" />
                  Health Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Set and track your health and wellness goals with AI guidance.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/help">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-6 w-6 text-gray-600 mr-2" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get help, view tutorials, and contact our support team.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
