import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function HealthRecordsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="records">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
            <p className="text-gray-600">Manage and view your medical records</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Your Health Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No records yet</h3>
                <p className="text-gray-500">Upload your first health record to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
