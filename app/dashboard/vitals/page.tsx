"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Weight,
  Ruler,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react"

export default function VitalsPage() {
  const vitalsData = [
    {
      title: "Heart Rate",
      value: "72",
      unit: "BPM",
      status: "Normal",
      trend: "stable",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      lastReading: "2 hours ago",
      range: "60-100 BPM",
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "Optimal",
      trend: "down",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      lastReading: "4 hours ago",
      range: "<120/80 mmHg",
    },
    {
      title: "Body Temperature",
      value: "98.6",
      unit: "°F",
      status: "Normal",
      trend: "stable",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      lastReading: "6 hours ago",
      range: "97-99°F",
    },
    {
      title: "Blood Oxygen",
      value: "98",
      unit: "%",
      status: "Excellent",
      trend: "up",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      lastReading: "1 hour ago",
      range: "95-100%",
    },
    {
      title: "Weight",
      value: "70.5",
      unit: "kg",
      status: "Healthy",
      trend: "down",
      icon: Weight,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      lastReading: "1 day ago",
      range: "BMI: 18.5-24.9",
    },
    {
      title: "Height",
      value: "175",
      unit: "cm",
      status: "Recorded",
      trend: "stable",
      icon: Ruler,
      color: "text-green-600",
      bgColor: "bg-green-50",
      lastReading: "1 month ago",
      range: "Adult height",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
      case "optimal":
      case "excellent":
      case "healthy":
        return "bg-green-100 text-green-800"
      case "high":
      case "elevated":
        return "bg-yellow-100 text-yellow-800"
      case "low":
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Vitals Tracking</h1>
            <p className="text-gray-600">Monitor your health metrics and track trends over time</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Reading
            </Button>
          </div>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vitalsData.map((vital, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${vital.bgColor}`}>
                    <vital.icon className={`w-6 h-6 ${vital.color}`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(vital.trend)}
                    <Badge className={getStatusColor(vital.status)}>{vital.status}</Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{vital.title}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-gray-900">{vital.value}</span>
                    <span className="text-sm text-gray-600">{vital.unit}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Last reading:</span>
                    <span>{vital.lastReading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal range:</span>
                    <span>{vital.range}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Heart Rate Trend (7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Chart visualization would appear here</p>
                  <p className="text-sm text-gray-500">Showing heart rate trends over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Blood Pressure History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Blood pressure chart would appear here</p>
                  <p className="text-sm text-gray-500">Tracking systolic and diastolic readings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Readings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "Today, 2:30 PM", vital: "Heart Rate", value: "72 BPM", status: "Normal" },
                { time: "Today, 8:00 AM", vital: "Blood Pressure", value: "118/76 mmHg", status: "Optimal" },
                { time: "Yesterday, 6:00 PM", vital: "Weight", value: "70.5 kg", status: "Healthy" },
                { time: "Yesterday, 9:00 AM", vital: "Blood Oxygen", value: "98%", status: "Excellent" },
              ].map((reading, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{reading.vital}</p>
                    <p className="text-sm text-gray-600">{reading.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{reading.value}</p>
                    <Badge className={getStatusColor(reading.status)} size="sm">
                      {reading.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-900">Vitals Tracking Demo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Demo Features:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Sample vital signs data</li>
                  <li>• Status indicators and trends</li>
                  <li>• Normal range comparisons</li>
                  <li>• Recent readings history</li>
                  <li>• Visual chart placeholders</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Full Version Capabilities:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Connect with health devices</li>
                  <li>• Automatic data synchronization</li>
                  <li>• Interactive charts and graphs</li>
                  <li>• Alerts for abnormal readings</li>
                  <li>• Export data for healthcare providers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
