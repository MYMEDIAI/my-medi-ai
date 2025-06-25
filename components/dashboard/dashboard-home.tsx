"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  FileText,
  Calendar,
  Upload,
  MessageCircle,
  Phone,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from "lucide-react"

export default function DashboardHome() {
  const { user } = useAuth()

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"

  const quickStats = [
    {
      title: "Health Score",
      value: "85/100",
      change: "+5 from last month",
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Health Records",
      value: "12",
      change: "2 added this week",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Last Checkup",
      value: "15 days ago",
      change: "Next due in 2 weeks",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "record",
      title: "Blood Test Results Uploaded",
      time: "2 hours ago",
      status: "completed",
      icon: Upload,
    },
    {
      id: 2,
      type: "ai",
      title: "AI Health Assessment Completed",
      time: "1 day ago",
      status: "completed",
      icon: MessageCircle,
    },
    {
      id: 3,
      type: "appointment",
      title: "Appointment Scheduled",
      time: "3 days ago",
      status: "pending",
      icon: Calendar,
    },
    {
      id: 4,
      type: "vitals",
      title: "Blood Pressure Recorded",
      time: "5 days ago",
      status: "completed",
      icon: Activity,
    },
  ]

  const healthTips = [
    "Drink at least 8 glasses of water daily to stay hydrated",
    "Take a 10-minute walk after meals to aid digestion",
    "Get 7-9 hours of quality sleep for optimal health",
    "Practice deep breathing for 5 minutes to reduce stress",
  ]

  const todaysTip = healthTips[Math.floor(Math.random() * healthTips.length)]

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h2>
        <p className="text-blue-100">Here's your health overview for today. Stay on top of your wellness journey.</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge
                      variant={activity.status === "completed" ? "default" : "secondary"}
                      className={activity.status === "completed" ? "bg-green-100 text-green-800" : ""}
                    >
                      {activity.status === "completed" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {activity.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Health Tip of the Day */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              Health Tip of the Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">{todaysTip}</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Quick Actions</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Health Record
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with AI Assistant
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
