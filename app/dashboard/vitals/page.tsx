import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default function VitalsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="vitals">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vitals Tracking</h1>
            <p className="text-gray-600">Monitor your vital signs and health metrics</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Your Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vitals recorded</h3>
                <p className="text-gray-500">Start tracking your vitals to monitor your health</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
