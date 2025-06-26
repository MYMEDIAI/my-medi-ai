"use client"

import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import GoalsDashboard from "@/components/health-goals/goals-dashboard"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function GoalsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="goals">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Goals</h1>
            <p className="text-gray-600">Track and manage your health goals</p>
          </div>

          <GoalsDashboard />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
