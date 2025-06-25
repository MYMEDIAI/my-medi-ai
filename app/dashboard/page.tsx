"use client"

import { useAuth } from "@/contexts/auth-context"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {user?.user_metadata?.first_name || "User"}!</h2>
        <p className="text-gray-600">
          This is your health dashboard. Here you can track your health records, vitals, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">Health Records</h3>
          <p className="text-gray-600">View and manage your health records</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">AI Assistant</h3>
          <p className="text-gray-600">Chat with our AI health assistant</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-2 text-lg font-medium">Vitals Tracking</h3>
          <p className="text-gray-600">Track your vital signs and health metrics</p>
        </div>
      </div>
    </div>
  )
}
