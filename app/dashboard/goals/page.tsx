"use client"

import { useState } from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import GoalsDashboard from "@/components/health-goals/goals-dashboard"
import CreateGoalForm from "@/components/health-goals/create-goal-form"
import type { HealthGoal, FamilyChallenge } from "@/types/health-goals"

type ViewMode = "dashboard" | "create-goal" | "view-goal" | "challenge"

export default function HealthGoalsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard")
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<FamilyChallenge | null>(null)

  const handleCreateGoal = () => {
    setViewMode("create-goal")
  }

  const handleViewGoal = (goal: HealthGoal) => {
    setSelectedGoal(goal)
    setViewMode("view-goal")
  }

  const handleJoinChallenge = (challenge: FamilyChallenge) => {
    setSelectedChallenge(challenge)
    setViewMode("challenge")
  }

  const handleGoalSubmit = async (goalData: Partial<HealthGoal>) => {
    try {
      console.log("Creating goal:", goalData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setViewMode("dashboard")
      alert("Goal created successfully!")
    } catch (error) {
      console.error("Error creating goal:", error)
      alert("Failed to create goal. Please try again.")
    }
  }

  const handleCancel = () => {
    setViewMode("dashboard")
    setSelectedGoal(null)
    setSelectedChallenge(null)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="goals">
        <div className="space-y-6">
          {viewMode === "dashboard" && (
            <GoalsDashboard
              onCreateGoal={handleCreateGoal}
              onViewGoal={handleViewGoal}
              onJoinChallenge={handleJoinChallenge}
            />
          )}

          {viewMode === "create-goal" && <CreateGoalForm onSubmit={handleGoalSubmit} onCancel={handleCancel} />}

          {viewMode === "view-goal" && selectedGoal && (
            <div>
              <h2>Viewing Goal: {selectedGoal.title}</h2>
              {/* Goal detail view would go here */}
              <button onClick={handleCancel}>Back to Dashboard</button>
            </div>
          )}

          {viewMode === "challenge" && selectedChallenge && (
            <div>
              <h2>Challenge: {selectedChallenge.title}</h2>
              {/* Challenge detail view would go here */}
              <button onClick={handleCancel}>Back to Dashboard</button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
