export interface HealthGoal {
  id: string
  user_id: string
  title: string
  description: string
  category: GoalCategory
  type: GoalType
  target_value: number
  current_value: number
  unit: string
  start_date: string
  target_date: string
  status: GoalStatus
  priority: GoalPriority
  is_family_goal: boolean
  family_participants?: string[]
  milestones: Milestone[]
  progress_entries: ProgressEntry[]
  created_at: string
  updated_at: string
}

export type GoalCategory =
  | "weight_management"
  | "fitness"
  | "nutrition"
  | "mental_health"
  | "chronic_condition"
  | "preventive_care"
  | "medication_adherence"
  | "custom"

export type GoalType = "individual" | "family" | "challenge"

export type GoalStatus = "active" | "completed" | "paused" | "cancelled"

export type GoalPriority = "low" | "medium" | "high"

export interface Milestone {
  id: string
  goal_id: string
  title: string
  description: string
  target_value: number
  achieved: boolean
  achieved_date?: string
  reward_badge?: string
}

export interface ProgressEntry {
  id: string
  goal_id: string
  value: number
  notes?: string
  photo_url?: string
  mood_rating?: number
  created_at: string
}

export interface Achievement {
  id: string
  user_id: string
  badge_type: BadgeType
  title: string
  description: string
  icon: string
  earned_date: string
  goal_id?: string
}

export type BadgeType =
  | "first_goal"
  | "streak_7"
  | "streak_30"
  | "milestone_achieved"
  | "goal_completed"
  | "family_champion"
  | "consistency_king"
  | "improvement_star"

export interface FamilyChallenge {
  id: string
  family_id: string
  title: string
  description: string
  start_date: string
  end_date: string
  participants: string[]
  leaderboard: ChallengeScore[]
  status: "upcoming" | "active" | "completed"
  prize_description?: string
}

export interface ChallengeScore {
  user_id: string
  user_name: string
  score: number
  rank: number
}

export interface AIRecommendation {
  type: "goal_suggestion" | "progress_tip" | "motivation" | "adjustment"
  title: string
  description: string
  action_text?: string
  priority: "low" | "medium" | "high"
  goal_id?: string
}
