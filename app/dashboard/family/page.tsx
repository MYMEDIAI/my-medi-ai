"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import FamilyDashboard from "@/components/family/family-dashboard"
import AddMemberForm from "@/components/family/add-member-form"
import type { FamilyMember } from "@/types/family"

type ViewMode = "dashboard" | "add-member" | "view-member" | "privacy-settings"

export default function FamilyHealthPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  const handleAddMember = () => {
    setViewMode("add-member")
  }

  const handleViewMember = (member: FamilyMember) => {
    setSelectedMember(member)
    setViewMode("view-member")
  }

  const handleManagePrivacy = () => {
    setViewMode("privacy-settings")
  }

  const handleMemberSubmit = async (memberData: Partial<FamilyMember>) => {
    try {
      // Here you would typically save to your backend
      console.log("Adding family member:", memberData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Return to dashboard
      setViewMode("dashboard")

      // Show success message
      alert("Family member added successfully!")
    } catch (error) {
      console.error("Error adding family member:", error)
      alert("Failed to add family member. Please try again.")
    }
  }

  const handleCancel = () => {
    setViewMode("dashboard")
    setSelectedMember(null)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="family">
        <div className="space-y-6">
          {viewMode === "dashboard" && (
            <FamilyDashboard
              onAddMember={handleAddMember}
              onViewMember={handleViewMember}
              onManagePrivacy={handleManagePrivacy}
            />
          )}

          {viewMode === "add-member" && <AddMemberForm onSubmit={handleMemberSubmit} onCancel={handleCancel} />}

          {viewMode === "view-member" && selectedMember && (
            <div>
              <h2>Viewing {selectedMember.name}</h2>
              {/* Member detail view would go here */}
              <button onClick={handleCancel}>Back to Dashboard</button>
            </div>
          )}

          {viewMode === "privacy-settings" && (
            <div>
              <h2>Privacy Settings</h2>
              {/* Privacy settings would go here */}
              <button onClick={handleCancel}>Back to Dashboard</button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
