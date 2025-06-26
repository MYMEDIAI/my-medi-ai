"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Target, CalendarIcon, Users, Plus, X, Lightbulb } from "lucide-react"
import { format } from "date-fns"
import type { HealthGoal, GoalCategory, GoalPriority, Milestone } from "@/types/health-goals"

interface CreateGoalFormProps {
  onSubmit: (goal: Partial<HealthGoal>) => void
  onCancel: () => void
}

const predefinedGoals = [
  {
    title: "Lose Weight",
    description: "Achieve healthy weight loss through diet and exercise",
    category: "weight_management" as GoalCategory,
    unit: "lbs",
    suggestions: [5, 10, 15, 20, 25],
  },
  {
    title: "Lower Blood Pressure",
    description: "Maintain healthy blood pressure levels",
    category: "chronic_condition" as GoalCategory,
    unit: "mmHg",
    suggestions: [5, 10, 15, 20],
  },
  {
    title: "Exercise Regularly",
    description: "Build a consistent exercise routine",
    category: "fitness" as GoalCategory,
    unit: "sessions/week",
    suggestions: [2, 3, 4, 5],
  },
  {
    title: "Drink More Water",
    description: "Stay hydrated throughout the day",
    category: "nutrition" as GoalCategory,
    unit: "glasses/day",
    suggestions: [6, 8, 10, 12],
  },
  {
    title: "Improve Sleep",
    description: "Get consistent, quality sleep",
    category: "mental_health" as GoalCategory,
    unit: "hours/night",
    suggestions: [7, 8, 9],
  },
  {
    title: "Take Medications",
    description: "Maintain medication adherence",
    category: "medication_adherence" as GoalCategory,
    unit: "days/week",
    suggestions: [7],
  },
]

export default function CreateGoalForm({ onSubmit, onCancel }: CreateGoalFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof predefinedGoals)[0] | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as GoalCategory,
    target_value: 0,
    unit: "",
    priority: "medium" as GoalPriority,
    is_family_goal: false,
    target_date: new Date(),
  })
  const [milestones, setMilestones] = useState<Omit<Milestone, "id" | "goal_id" | "achieved" | "achieved_date">[]>([])
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", target_value: 0 })
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: "weight_management", label: "Weight Management", icon: "⚖️" },
    { value: "fitness", label: "Fitness & Exercise", icon: "💪" },
    { value: "nutrition", label: "Nutrition & Diet", icon: "🥗" },
    { value: "mental_health", label: "Mental Health", icon: "🧠" },
    { value: "chronic_condition", label: "Chronic Condition", icon: "🏥" },
    { value: "preventive_care", label: "Preventive Care", icon: "🛡️" },
    { value: "medication_adherence", label: "Medication", icon: "💊" },
    { value: "custom", label: "Custom Goal", icon: "🎯" },
  ]

  const handleTemplateSelect = (template: (typeof predefinedGoals)[0]) => {
    setSelectedTemplate(template)
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      description: template.description,
      category: template.category,
      unit: template.unit,
    }))
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.target_value > 0) {
      setMilestones((prev) => [...prev, { ...newMilestone }])
      setNewMilestone({ title: "", description: "", target_value: 0 })
    }
  }

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  const generateSmartSuggestions = () => {
    const suggestions = []

    if (!formData.target_date) {
      suggestions.push("Set a specific target date for better motivation")
    }

    if (formData.target_value <= 0) {
      suggestions.push("Define a measurable target value")
    }

    if (milestones.length === 0) {
      suggestions.push("Add milestones to track progress along the way")
    }

    if (!formData.description) {
      suggestions.push("Add a description explaining why this goal matters to you")
    }

    return suggestions
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title || !formData.category || formData.target_value <= 0) {
        alert("Please fill in all required fields")
        return
      }

      const goalData: Partial<HealthGoal> = {
        ...formData,
        type: formData.is_family_goal ? "family" : "individual",
        current_value: 0,
        status: "active",
        start_date: new Date().toISOString(),
        target_date: formData.target_date.toISOString(),
        milestones: milestones.map((m, index) => ({
          ...m,
          id: `milestone_${index}`,
          goal_id: "temp",
          achieved: false,
        })),
        progress_entries: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await onSubmit(goalData)
    } catch (error) {
      console.error("Error creating goal:", error)
      alert("Failed to create goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const smartSuggestions = generateSmartSuggestions()

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Create Health Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Templates */}
            <div>
              <Label className="text-base font-semibold">Choose a Goal Template</Label>
              <p className="text-sm text-gray-600 mb-3">Select a pre-defined goal or create a custom one</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {predefinedGoals.map((template, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate?.title === template.title
                        ? "border-green-500 bg-green-50"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{categories.find((c) => c.value === template.category)?.icon}</span>
                        <h3 className="font-medium text-sm">{template.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600">{template.description}</p>
                      {selectedTemplate?.title === template.title && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {template.suggestions.map((suggestion) => (
                            <Badge
                              key={suggestion}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-green-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleInputChange("target_value", suggestion)
                              }}
                            >
                              {suggestion} {template.unit}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Goal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter your goal title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target_value">Target Value *</Label>
                <Input
                  id="target_value"
                  type="number"
                  value={formData.target_value || ""}
                  onChange={(e) => handleInputChange("target_value", Number.parseFloat(e.target.value) || 0)}
                  placeholder="Enter target value"
                  required
                />
              </div>

              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  placeholder="e.g., lbs, sessions, glasses"
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.target_date ? format(formData.target_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.target_date}
                      onSelect={(date) => date && handleInputChange("target_date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your goal and why it's important to you..."
                rows={3}
              />
            </div>

            {/* Family Goal Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="family_goal"
                checked={formData.is_family_goal}
                onCheckedChange={(checked) => handleInputChange("is_family_goal", checked)}
              />
              <Label htmlFor="family_goal" className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Make this a family goal
              </Label>
            </div>

            {/* Milestones */}
            <div>
              <Label className="text-base font-semibold">Milestones</Label>
              <p className="text-sm text-gray-600 mb-3">Break your goal into smaller, achievable milestones</p>

              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{milestone.title}</h4>
                          <p className="text-xs text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Target: {milestone.target_value} {formData.unit}
                          </p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-dashed border-gray-300">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input
                        placeholder="Milestone title"
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone((prev) => ({ ...prev, title: e.target.value }))}
                      />
                      <Input
                        placeholder="Description"
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone((prev) => ({ ...prev, description: e.target.value }))}
                      />
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Target"
                          value={newMilestone.target_value || ""}
                          onChange={(e) =>
                            setNewMilestone((prev) => ({
                              ...prev,
                              target_value: Number.parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                        <Button type="button" onClick={addMilestone} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* SMART Goal Suggestions */}
            {smartSuggestions.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-2">SMART Goal Suggestions</h3>
                      <ul className="space-y-1">
                        {smartSuggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-blue-800">
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
