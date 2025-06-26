"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Heart,
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Stethoscope,
  Brain,
  Shield,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const healthMetrics = [
    {
      title: "Heart Rate",
      value: "72 BPM",
      status: "Normal",
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      status: "Optimal",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "BMI",
      value: "23.5",
      status: "Healthy",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Sleep Quality",
      value: "8.2/10",
      status: "Excellent",
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  const recentActivities = [
    {
      type: "Health Check",
      description: "AI health assessment completed",
      time: "2 hours ago",
      status: "completed",
    },
    {
      type: "Medication",
      description: "Vitamin D supplement reminder",
      time: "4 hours ago",
      status: "pending",
    },
    {
      type: "Exercise",
      description: "30-minute walk logged",
      time: "6 hours ago",
      status: "completed",
    },
    {
      type: "Appointment",
      description: "Dr. Sharma consultation scheduled",
      time: "1 day ago",
      status: "scheduled",
    },
  ]

  const aiInsights = [
    {
      title: "Hydration Reminder",
      message: "You're 20% below your daily water intake goal. Consider drinking more water.",
      priority: "medium",
      icon: AlertCircle,
    },
    {
      title: "Sleep Pattern",
      message: "Your sleep quality has improved by 15% this week. Great progress!",
      priority: "low",
      icon: CheckCircle,
    },
    {
      title: "Exercise Goal",
      message: "You're on track to meet your weekly exercise goal. Keep it up!",
      priority: "low",
      icon: TrendingUp,
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Your Health Dashboard</h1>
              <p className="text-purple-100 mb-4">🎯 This is a live demo showcasing AI-powered healthcare management</p>
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
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metric.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.priority === "high"
                      ? "border-red-500 bg-red-50"
                      : insight.priority === "medium"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-green-500 bg-green-50"
                  }`}
                >
                  <div className="flex items-start">
                    <insight.icon
                      className={`w-5 h-5 mr-3 mt-0.5 ${
                        insight.priority === "high"
                          ? "text-red-600"
                          : insight.priority === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Link href="/dashboard/ai-assistant">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat with AI Assistant
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === "completed"
                          ? "bg-green-500"
                          : activity.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/records">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Health Records</h3>
                <p className="text-sm text-gray-600">View and manage your medical history</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/vitals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Track Vitals</h3>
                <p className="text-sm text-gray-600">Monitor your health metrics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/family">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Family Health</h3>
                <p className="text-sm text-gray-600">Manage family member health</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/goals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Health Goals</h3>
                <p className="text-sm text-gray-600">Set and track wellness goals</p>
              </CardContent>
            </Card>
          </Link>
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
  )
}
