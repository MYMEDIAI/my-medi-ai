import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ProfileForm from "@/components/auth/profile-form"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="settings">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <ProfileForm />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
