"use client"

import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Search, Calendar, User, Heart, Activity, Pill, TestTube, Download, Eye, Plus } from "lucide-react"
import { useState } from "react"

export default function HealthRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const healthRecords = [
    {
      id: 1,
      type: "Lab Results",
      title: "Complete Blood Count (CBC)",
      date: "2024-01-15",
      doctor: "Dr. Priya Sharma",
      status: "Normal",
      icon: TestTube,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 2,
      type: "Prescription",
      title: "Vitamin D3 Supplement",
      date: "2024-01-10",
      doctor: "Dr. Rajesh Kumar",
      status: "Active",
      icon: Pill,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      type: "Consultation",
      title: "Annual Health Checkup",
      date: "2024-01-05",
      doctor: "Dr. Anita Patel",
      status: "Completed",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 4,
      type: "Imaging",
      title: "Chest X-Ray",
      date: "2023-12-20",
      doctor: "Dr. Suresh Reddy",
      status: "Normal",
      icon: Activity,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: 5,
      type: "Cardiology",
      title: "ECG Report",
      date: "2023-12-15",
      doctor: "Dr. Meera Singh",
      status: "Normal",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  const filteredRecords = healthRecords.filter(
    (record) =>
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const recordStats = [
    { label: "Total Records", value: "24", icon: FileText, color: "text-blue-600" },
    { label: "This Month", value: "3", icon: Calendar, color: "text-green-600" },
    { label: "Pending Reviews", value: "1", icon: Eye, color: "text-orange-600" },
    { label: "Active Prescriptions", value: "2", icon: Pill, color: "text-purple-600" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Health Records</h1>
            <p className="text-gray-600">Manage and view your complete medical history</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recordStats.map((stat, index) => (
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

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search records, doctors, or types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Filter by Date</Button>
                <Button variant="outline">Filter by Type</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${record.bgColor}`}>
                      <record.icon className={`w-6 h-6 ${record.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <Badge
                          variant={
                            record.status === "Normal" || record.status === "Completed" ? "default" : "secondary"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{record.type}</span> • {record.doctor}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(record.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Notice */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-900">Demo Health Records</h3>
            </div>
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                🎯 This is a demonstration of the health records management system. In the full version, you would be
                able to:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Upload and store medical documents securely</li>
                <li>• Share records with healthcare providers</li>
                <li>• Set reminders for medication and appointments</li>
                <li>• Track health trends over time</li>
                <li>• Export records for insurance or referrals</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
