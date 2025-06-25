import ProtectedRoute from "@/components/auth/protected-route"
import ProfileForm from "@/components/auth/profile-form"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <ProfileForm />
      </div>
    </ProtectedRoute>
  )
}
