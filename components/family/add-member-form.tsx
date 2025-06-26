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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Upload, Shield, AlertCircle, Plus, X } from "lucide-react"
import type { FamilyMember, FamilyRelationship } from "@/types/family"

interface AddMemberFormProps {
  onSubmit: (member: Partial<FamilyMember>) => void
  onCancel: () => void
}

export default function AddMemberForm({ onSubmit, onCancel }: AddMemberFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "" as FamilyRelationship,
    date_of_birth: "",
    gender: "" as "male" | "female" | "other",
    blood_type: "",
    emergency_contact: "",
    emergency_phone: "",
    health_summary: "",
    chronic_conditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    profile_photo: "",
  })

  const [permissions, setPermissions] = useState({
    view_basic: true,
    view_medical: true,
    edit_basic: false,
    edit_medical: false,
    emergency_access: true,
  })

  const [newCondition, setNewCondition] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const relationships: { value: FamilyRelationship; label: string; icon: string }[] = [
    { value: "spouse", label: "Spouse/Partner", icon: "💑" },
    { value: "child", label: "Child", icon: "👶" },
    { value: "parent", label: "Parent", icon: "👨‍👩‍👧" },
    { value: "sibling", label: "Sibling", icon: "👫" },
    { value: "grandparent", label: "Grandparent", icon: "👴" },
    { value: "grandchild", label: "Grandchild", icon: "🧒" },
    { value: "other", label: "Other", icon: "👤" },
  ]

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayAdd = (field: "chronic_conditions" | "medications" | "allergies", value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
    }
  }

  const handleArrayRemove = (field: "chronic_conditions" | "medications" | "allergies", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.relationship || !formData.date_of_birth || !formData.gender) {
        alert("Please fill in all required fields")
        return
      }

      // Submit form data
      await onSubmit({
        ...formData,
        id: `member_${Date.now()}`, // Temporary ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        added_by: "current_user", // This would come from auth context
        family_id: "family_1", // This would come from family context
      })
    } catch (error) {
      console.error("Error adding family member:", error)
      alert("Failed to add family member. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isMinor = () => {
    if (!formData.date_of_birth) return false
    const age = new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear()
    return age < 18
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Add Family Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={formData.profile_photo || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </div>
                </Label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <p className="text-sm text-gray-500 mt-1">Optional profile picture</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relationship *</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => handleInputChange("relationship", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel.value} value={rel.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{rel.icon}</span>
                          {rel.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                  required
                />
                {isMinor() && (
                  <p className="text-sm text-orange-600 mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Minor - Additional privacy protections will apply
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value as "male" | "female" | "other")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="blood_type">Blood Type</Label>
                <Select value={formData.blood_type} onValueChange={(value) => handleInputChange("blood_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange("emergency_contact", e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <Label htmlFor="emergency_phone">Emergency Phone</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) => handleInputChange("emergency_phone", e.target.value)}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>

            {/* Health Summary */}
            <div>
              <Label htmlFor="health_summary">Health Summary</Label>
              <Textarea
                id="health_summary"
                value={formData.health_summary}
                onChange={(e) => handleInputChange("health_summary", e.target.value)}
                placeholder="Brief overview of current health status..."
                rows={3}
              />
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Medical Information</h3>

              {/* Chronic Conditions */}
              <div>
                <Label>Chronic Conditions</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add condition..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleArrayAdd("chronic_conditions", newCondition)
                        setNewCondition("")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleArrayAdd("chronic_conditions", newCondition)
                      setNewCondition("")
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.chronic_conditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="flex items-center">
                      {condition}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("chronic_conditions", condition)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div>
                <Label>Current Medications</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add medication..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleArrayAdd("medications", newMedication)
                        setNewMedication("")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleArrayAdd("medications", newMedication)
                      setNewMedication("")
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medications.map((medication) => (
                    <Badge key={medication} variant="secondary" className="flex items-center">
                      {medication}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("medications", medication)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <Label>Allergies</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleArrayAdd("allergies", newAllergy)
                        setNewAllergy("")
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleArrayAdd("allergies", newAllergy)
                      setNewAllergy("")
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergies.map((allergy) => (
                    <Badge key={allergy} variant="secondary" className="flex items-center">
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("allergies", allergy)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy & Permission Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isMinor() && (
                  <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-orange-800">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Special protections apply for minors under 18</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view_basic"
                      checked={permissions.view_basic}
                      onCheckedChange={(checked) =>
                        setPermissions((prev) => ({ ...prev, view_basic: checked as boolean }))
                      }
                    />
                    <Label htmlFor="view_basic">Allow viewing basic information</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view_medical"
                      checked={permissions.view_medical}
                      onCheckedChange={(checked) =>
                        setPermissions((prev) => ({ ...prev, view_medical: checked as boolean }))
                      }
                    />
                    <Label htmlFor="view_medical">Allow viewing medical information</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit_basic"
                      checked={permissions.edit_basic}
                      onCheckedChange={(checked) =>
                        setPermissions((prev) => ({ ...prev, edit_basic: checked as boolean }))
                      }
                    />
                    <Label htmlFor="edit_basic">Allow editing basic information</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit_medical"
                      checked={permissions.edit_medical}
                      onCheckedChange={(checked) =>
                        setPermissions((prev) => ({ ...prev, edit_medical: checked as boolean }))
                      }
                      disabled={isMinor()}
                    />
                    <Label htmlFor="edit_medical" className={isMinor() ? "text-gray-400" : ""}>
                      Allow editing medical information {isMinor() && "(Disabled for minors)"}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emergency_access"
                      checked={permissions.emergency_access}
                      onCheckedChange={(checked) =>
                        setPermissions((prev) => ({ ...prev, emergency_access: checked as boolean }))
                      }
                    />
                    <Label htmlFor="emergency_access">Allow emergency access to all information</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? "Adding..." : "Add Family Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
