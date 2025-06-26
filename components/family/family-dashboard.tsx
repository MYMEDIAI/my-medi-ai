"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Plus, Heart, Calendar, AlertTriangle, Shield, Target, Activity, Phone, Eye } from "lucide-react"
import type { FamilyMember, FamilyHealthGoal, HealthInsight } from "@/types/family"

interface FamilyDashboardProps {
  onAddMember: () => void
  onViewMember: (member: FamilyMember) => void
  onManagePrivacy: () => void
}

export default function FamilyDashboard({ onAddMember, onViewMember, onManagePrivacy }: FamilyDashboardProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [healthGoals, setHealthGoals] = useState<FamilyHealthGoal[]>([])
  const [insights, setInsights] = useState<HealthInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadFamilyData = async () => {
      setLoading(true)
      try {
        // Mock data for demonstration
        const mockMembers: FamilyMember[] = [
          {
            id: "1",
            name: "John Doe",
            relationship: "spouse",
            date_of_birth: "1985-03-15",
            gender: "male",
            profile_photo: "/placeholder.svg?height=40&width=40",
            blood_type: "O+",
            emergency_contact: "Jane Doe",
            emergency_phone: "+1-555-0123",
            health_summary: "Generally healthy, monitors blood pressure",
            chronic_conditions: ["Hypertension"],
            medications: ["Lisinopril 10mg"],
            allergies: ["Penicillin"],
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            added_by: "current_user",
            family_id: "family_1",
          },
          {
            id: "2",
            name: "Emma Doe",
            relationship: "child",
            date_of_birth: "2015-08-22",
            gender: "female",
            profile_photo: "/placeholder.svg?height=40&width=40",
            blood_type: "A+",
            emergency_contact: "Parent",
            emergency_phone: "+1-555-0123",
            health_summary: "Healthy child, up to date on vaccinations",
            chronic_conditions: [],
            medications: [],
            allergies: ["Nuts"],
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            added_by: "current_user",
            family_id: "family_1",
          },
        ]

        const mockGoals: FamilyHealthGoal[] = [
          {
            id: "1",
            family_id: "family_1",
            title: "Family Fitness Challenge",
            description: "Exercise together 3 times per week",
            target_date: "2024-06-30",
            participants: ["1", "2"],
            progress: 65,
            status: "active",
            created_by: "current_user",
            created_at: "2024-01-01T00:00:00Z",
          },
        ]

        const mockInsights: HealthInsight[] = [
          {
            type: "genetic_risk",
            title: "Cardiovascular Health Alert",
            description: "Family history indicates increased risk for heart disease",
            affected_members: ["1"],
            severity: "medium",
            recommendations: ["Regular cardiovascular screening", "Maintain healthy diet", "Regular exercise routine"],
          },
        ]

        setFamilyMembers(mockMembers)
        setHealthGoals(mockGoals)
        setInsights(mockInsights)
      } catch (error) {
        console.error("Error loading family data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFamilyData()
  }, [])

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case "spouse":
        return "💑"
      case "child":
        return "👶"
      case "parent":
        return "👨‍👩‍👧"
      case "sibling":
        return "👫"
      case "grandparent":
        return "👴"
      case "grandchild":
        return "🧒"
      default:
        return "👤"
    }
  }

  const getHealthStatusColor = (conditions: string[]) => {
    if (conditions.length === 0) return "bg-green-100 text-green-800"
    if (conditions.length <= 2) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getInsightSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Health Dashboard</h1>
          <p className="text-gray-600">Manage your family's health together</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onManagePrivacy} variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            Privacy Settings
          </Button>
          <Button onClick={onAddMember} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Family Member
          </Button>
        </div>
      </div>

      {/* Family Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Family Members</p>
                <p className="text-2xl font-bold text-gray-900">{familyMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthGoals.filter((g) => g.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Health Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {insights.filter((i) => i.severity === "medium" || i.severity === "high").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm text-gray-600">Overall Health</p>
                <p className="text-2xl font-bold text-gray-900">Good</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Family Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {familyMembers.map((member) => (
              <Card
                key={member.id}
                className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onViewMember(member)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src={member.profile_photo || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-1">{getRelationshipIcon(member.relationship)}</span>
                        {member.relationship}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Health Status</span>
                      <Badge className={getHealthStatusColor(member.chronic_conditions || [])}>
                        {(member.chronic_conditions || []).length === 0
                          ? "Healthy"
                          : `${member.chronic_conditions?.length} conditions`}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Age</span>
                      <span className="text-sm font-medium">
                        {new Date().getFullYear() - new Date(member.date_of_birth).getFullYear()}
                      </span>
                    </div>

                    {member.emergency_contact && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{member.emergency_contact}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Family Health Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <Badge variant={goal.status === "active" ? "default" : "secondary"}>{goal.status}</Badge>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{goal.participants.length} participants</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Due {new Date(goal.target_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Family Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <Badge className={getInsightSeverityColor(insight.severity)}>{insight.severity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Affected Members: </span>
                        <span className="text-sm text-gray-600">
                          {insight.affected_members
                            .map((id) => familyMembers.find((m) => m.id === id)?.name)
                            .join(", ")}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Recommendations:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                          {insight.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
