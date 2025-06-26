"use client"

import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import FamilyDashboard from "@/components/family/family-dashboard"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function FamilyPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="family">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family Health</h1>
            <p className="text-gray-600">Manage your family's health information</p>
          </div>

          <FamilyDashboard />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
