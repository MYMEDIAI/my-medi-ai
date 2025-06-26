"use client"

import ProtectedRoute from "@/components/auth/protected-route"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardHome from "@/components/dashboard/dashboard-home"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Shield } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout activeTab="dashboard">
        <DashboardHome />
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Your Health Dashboard</h1>
                <p className="text-purple-100 mb-4">
                  🎯 This is a live demo showcasing AI-powered healthcare management
                </p>
                <Badge className="bg-white/20 text-white border-white/30">Demo Mode Active</Badge>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Health Metrics will be handled by DashboardHome component */}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights will be handled by DashboardHome component */}
            {/* Recent Activities will be handled by DashboardHome component */}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quick Actions will be handled by DashboardHome component */}
          </div>

          {/* Demo Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-blue-900">Demo Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">What you can explore:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Interactive AI health assistant</li>
                    <li>• Health records management</li>
                    <li>• Vitals tracking and monitoring</li>
                    <li>• Family health management</li>
                    <li>• Personalized health goals</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Demo features:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• All data is simulated for demonstration</li>
                    <li>• No real medical data is stored</li>
                    <li>• Experience full AI healthcare platform</li>
                    <li>• No registration required</li>
                    <li>• Explore all features freely</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
