"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Plus, Heart, Activity, Calendar, AlertCircle, CheckCircle, User, Baby, UserCheck } from "lucide-react"

export default function FamilyPage() {
  const familyMembers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      relationship: "Self",
      age: 35,
      avatar: "RK",
      healthStatus: "Good",
      lastCheckup: "2024-01-15",
      upcomingAppointments: 1,
      medications: 2,
      alerts: 0,
      icon: User,
    },
    {
      id: 2,
      name: "Priya Kumar",
      relationship: "Spouse",
      age: 32,
      avatar: "PK",
      healthStatus: "Excellent",
      lastCheckup: "2024-01-10",
      upcomingAppointments: 0,
      medications: 1,
      alerts: 1,
      icon: UserCheck,
    },
    {
      id: 3,
      name: "Arjun Kumar",
      relationship: "Son",
      age: 8,
      avatar: "AK",
      healthStatus: "Good",
      lastCheckup: "2023-12-20",
      upcomingAppointments: 1,
      medications: 0,
      alerts: 0,
      icon: Baby,
    },
    {
      id: 4,
      name: "Lakshmi Kumar",
      relationship: "Mother",
      age: 62,
      avatar: "LK",
      healthStatus: "Monitoring",
      lastCheckup: "2024-01-05",
      upcomingAppointments: 2,
      medications: 4,
      alerts: 2,
      icon: User,
    },
  ]

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const familyStats = [
    { label: "Family Members", value: "4", icon: Users, color: "text-blue-600" },
    { label: "Upcoming Appointments", value: "4", icon: Calendar, color: "text-green-600" },
    { label: "Active Medications", value: "7", icon: Heart, color: "text-purple-600" },
    { label: "Health Alerts", value: "3", icon: AlertCircle, color: "text-orange-600" },
  ]

  const recentActivity = [
    {
      member: "Priya Kumar",
      activity: "Blood pressure reading recorded",
      time: "2 hours ago",
      type: "vitals",
    },
    {
      member: "Lakshmi Kumar",
      activity: "Medication reminder - Diabetes medication",
      time: "4 hours ago",
      type: "medication",
    },
    {
      member: "Arjun Kumar",
      activity: "Vaccination appointment scheduled",
      time: "1 day ago",
      type: "appointment",
    },
    {
      member: "Rajesh Kumar",
      activity: "Health checkup completed",
      time: "2 days ago",
      type: "checkup",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Family Health</h1>
            <p className="text-gray-600">Manage health records and care for your entire family</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Family Member
            </Button>
          </div>
        </div>

        {/* Family Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {familyStats.map((stat, index) => (
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

        {/* Family Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {familyMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.relationship} • {member.age} years old
                      </p>
                    </div>
                  </div>
                  <Badge className={getHealthStatusColor(member.healthStatus)}>{member.healthStatus}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{member.upcomingAppointments}</p>
                    <p className="text-xs text-gray-600">Appointments</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{member.medications}</p>
                    <p className="text-xs text-gray-600">Medications</p>
                  </div>
                </div>

                {member.alerts > 0 && (
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg mb-4">
                    <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                    <p className="text-sm text-orange-800">
                      {member.alerts} health alert{member.alerts > 1 ? "s" : ""} require attention
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Last checkup:</span>
                  <span>{new Date(member.lastCheckup).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Health Records
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Family Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Family Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === "vitals"
                        ? "bg-green-100"
                        : activity.type === "medication"
                          ? "bg-blue-100"
                          : activity.type === "appointment"
                            ? "bg-purple-100"
                            : "bg-orange-100"
                    }`}
                  >
                    {activity.type === "vitals" && <Activity className="w-4 h-4 text-green-600" />}
                    {activity.type === "medication" && <Heart className="w-4 h-4 text-blue-600" />}
                    {activity.type === "appointment" && <Calendar className="w-4 h-4 text-purple-600" />}
                    {activity.type === "checkup" && <CheckCircle className="w-4 h-4 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.member}</p>
                    <p className="text-sm text-gray-600">{activity.activity}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Information */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-purple-900">Family Health Management Demo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Demo Features:</h4>
                <ul className="space-y-1 text-purple-700">
                  <li>• Sample family member profiles</li>
                  <li>• Health status tracking</li>
                  <li>• Appointment and medication overview</li>
                  <li>• Recent activity timeline</li>
                  <li>• Health alerts and notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 mb-2">Full Version Features:</h4>
                <ul className="space-y-1 text-purple-700">
                  <li>• Complete family health records</li>
                  <li>• Shared calendar for appointments</li>
                  <li>• Medication reminders for all members</li>
                  <li>• Emergency contact integration</li>
                  <li>• Healthcare provider sharing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
