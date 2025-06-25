"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, TrendingUp, Calendar, CheckCircle, Activity, Heart, Droplets, Moon } from "lucide-react"

export default function GoalsPage() {
  const healthGoals = [
    {
      id: 1,
      title: "Daily Water Intake",
      description: "Drink 8 glasses of water daily",
      target: 8,
      current: 6,
      unit: "glasses",
      progress: 75,
      category: "Hydration",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      deadline: "Daily",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Weekly Exercise",
      description: "Exercise for 150 minutes per week",
      target: 150,
      current: 120,
      unit: "minutes",
      progress: 80,
      category: "Fitness",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      deadline: "Weekly",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Weight Loss",
      description: "Lose 5 kg in 3 months",
      target: 5,
      current: 2.5,
      unit: "kg",
      progress: 50,
      category: "Weight Management",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      deadline: "3 months",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Sleep Quality",
      description: "Get 8 hours of sleep nightly",
      target: 8,
      current: 8,
      unit: "hours",
      progress: 100,
      category: "Sleep",
      icon: Moon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      deadline: "Daily",
      status: "Completed",
    },
    {
      id: 5,
      title: "Heart Rate Zone",
      description: "Maintain target heart rate during workouts",
      target: 20,
      current: 15,
      unit: "sessions",
      progress: 75,
      category: "Cardio",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      deadline: "Monthly",
      status: "In Progress",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const goalStats = [
    { label: "Active Goals", value: "5", icon: Target, color: "text-blue-600" },
    { label: "Completed This Month", value: "3", icon: CheckCircle, color: "text-green-600" },
    { label: "Average Progress", value: "76%", icon: TrendingUp, color: "text-purple-600" },
    { label: "Days Streak", value: "12", icon: Calendar, color: "text-orange-600" },
  ]

  const achievements = [
    {
      title: "Hydration Hero",
      description: "Completed daily water intake goal for 7 days",
      date: "2024-01-10",
      icon: Droplets,
      color: "text-blue-600",
    },
    {
      title: "Fitness Enthusiast",
      description: "Completed 4 weeks of consistent exercise",
      date: "2024-01-05",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Sleep Champion",
      description: "Maintained 8+ hours sleep for 2 weeks",
      date: "2023-12-28",
      icon: Moon,
      color: "text-indigo-600",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Health Goals</h1>
            <p className="text-gray-600">Set, track, and achieve your wellness objectives</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </div>
        </div>

        {/* Goal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goalStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Goals */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {healthGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${goal.bgColor}`}>
                        <goal.icon className={`w-6 h-6 ${goal.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{goal.progress}% complete</span>
                      <span className="text-xs text-gray-500">{goal.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Achieved on {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">🏆 Achievement</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Weekly Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Progress chart would appear here</p>
                <p className="text-sm text-gray-500">Showing weekly goal completion trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Information */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-900">Health Goals Demo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-800 mb-2">Demo Features:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Sample health goals with progress tracking</li>
                  <li>• Achievement badges and milestones</li>
                  <li>• Progress visualization</li>
                  <li>• Goal categories and deadlines</li>
                  <li>• Statistics and completion rates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-2">Full Version Features:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Custom goal creation and editing</li>
                  <li>• Smart reminders and notifications</li>
                  <li>• Integration with fitness devices</li>
                  <li>• Social sharing and challenges</li>
                  <li>• AI-powered goal recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
