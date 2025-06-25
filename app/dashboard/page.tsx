import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardHome from "@/components/dashboard/dashboard-home"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="dashboard">
        <DashboardHome />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
