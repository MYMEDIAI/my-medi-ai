export interface FamilyMember {
  id: string
  name: string
  relationship: FamilyRelationship
  date_of_birth: string
  gender: "male" | "female" | "other"
  profile_photo?: string
  blood_type?: string
  emergency_contact?: string
  emergency_phone?: string
  health_summary?: string
  chronic_conditions?: string[]
  medications?: string[]
  allergies?: string[]
  created_at: string
  updated_at: string
  added_by: string
  family_id: string
}

export type FamilyRelationship = "spouse" | "child" | "parent" | "sibling" | "grandparent" | "grandchild" | "other"

export interface FamilyGroup {
  id: string
  name: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface FamilyPermission {
  id: string
  family_member_id: string
  granted_to: string
  permission_type: "view" | "edit" | "emergency"
  granted_by: string
  created_at: string
}

export interface FamilyHealthGoal {
  id: string
  family_id: string
  title: string
  description: string
  target_date: string
  participants: string[]
  progress: number
  status: "active" | "completed" | "paused"
  created_by: string
  created_at: string
}

export interface HealthInsight {
  type: "genetic_risk" | "shared_condition" | "medication_interaction" | "preventive_care"
  title: string
  description: string
  affected_members: string[]
  severity: "low" | "medium" | "high"
  recommendations: string[]
}
