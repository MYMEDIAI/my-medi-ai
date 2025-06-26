"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, Trophy, Flame, Calendar, Users, Star, Award, CheckCircle, Zap } from "lucide-react"
import type { HealthGoal, Achievement, FamilyChallenge, AIRecommendation } from "@/types/health-goals"

interface GoalsDashboardProps {
  onCreateGoal: () => void
  onViewGoal: (goal: HealthGoal) => void
  onJoinChallenge: (challenge: FamilyChallenge) => void
}

export default function GoalsDashboard({ onCreateGoal, onViewGoal, onJoinChallenge }: GoalsDashboardProps) {
  const [goals, setGoals] = useState<HealthGoal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [challenges, setChallenges] = useState<FamilyChallenge[]>([])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStreak, setCurrentStreak] = useState(0)

  useEffect(() => {
    loadGoalsData()
  }, [])

  const loadGoalsData = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration
      const mockGoals: HealthGoal[] = [
        {
          id: "1",
          user_id: "user1",
          title: "Lose 10 pounds",
          description: "Healthy weight loss through diet and exercise",
          category: "weight_management",
          type: "individual",
          target_value: 10,
          current_value: 6.5,
          unit: "lbs",
          start_date: "2024-01-01",
          target_date: "2024-04-01",
          status: "active",
          priority: "high",
          is_family_goal: false,
          milestones: [
            {
              id: "m1",
              goal_id: "1",
              title: "First 5 pounds",
              description: "Halfway to goal",
              target_value: 5,
              achieved: true,
              achieved_date: "2024-02-15",
              reward_badge: "milestone_achieved",
            },
          ],
          progress_entries: [],
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          user_id: "user1",
          title: "Family Fitness Challenge",
          description: "Exercise together 4 times per week",
          category: "fitness",
          type: "family",
          target_value: 16,
          current_value: 12,
          unit: "sessions",
          start_date: "2024-01-01",
          target_date: "2024-02-01",
          status: "active",
          priority: "medium",
          is_family_goal: true,
          family_participants: ["user1", "user2", "user3"],
          milestones: [],
          progress_entries: [],
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-15T00:00:00Z",
        },
      ]

      const mockAchievements: Achievement[] = [
        {
          id: "a1",
          user_id: "user1",
          badge_type: "streak_7",
          title: "7-Day Streak",
          description: "Logged progress for 7 consecutive days",
          icon: "🔥",
          earned_date: "2024-01-08T00:00:00Z",
          goal_id: "1",
        },
        {
          id: "a2",
          user_id: "user1",
          badge_type: "milestone_achieved",
          title: "Milestone Master",
          description: "Achieved your first milestone",
          icon: "🎯",
          earned_date: "2024-02-15T00:00:00Z",
          goal_id: "1",
        },
      ]

      const mockChallenges: FamilyChallenge[] = [
        {
          id: "c1",
          family_id: "family1",
          title: "March Madness Fitness",
          description: "Who can complete the most workouts this month?",
          start_date: "2024-03-01",
          end_date: "2024-03-31",
          participants: ["user1", "user2", "user3"],
          leaderboard: [
            { user_id: "user1", user_name: "You", score: 15, rank: 1 },
            { user_id: "user2", user_name: "John", score: 12, rank: 2 },
            { user_id: "user3", user_name: "Emma", score: 8, rank: 3 },
          ],
          status: "active",
          prize_description: "Winner chooses next family activity!",
        },
      ]

      const mockRecommendations: AIRecommendation[] = [
        {
          type: "motivation",
          title: "You're doing great!",
          description: "You've made excellent progress on your weight loss goal. Keep up the momentum!",
          priority: "medium",
          goal_id: "1",
        },
        {
          type: "goal_suggestion",
          title: "Consider adding a nutrition goal",
          description: "Based on your weight loss progress, tracking daily water intake could boost your results.",
          action_text: "Create Goal",
          priority: "low",
        },
      ]

      setGoals(mockGoals)
      setAchievements(mockAchievements)
      setChallenges(mockChallenges)
      setRecommendations(mockRecommendations)
      setCurrentStreak(12)
    } catch (error) {
      console.error("Error loading goals data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGoalProgress = (goal: HealthGoal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100)
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "weight_management":
        return "⚖️"
      case "fitness":
        return "💪"
      case "nutrition":
        return "🥗"
      case "mental_health":
        return "🧠"
      case "chronic_condition":
        return "🏥"
      case "preventive_care":
        return "🛡️"
      case "medication_adherence":
        return "💊"
      default:
        return "🎯"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Health Goals</h1>
          <p className="text-gray-600">Track your progress and achieve your health objectives</p>
        </div>
        <Button onClick={onCreateGoal} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Goals</p>
                <p className="text-2xl font-bold">{goals.filter((g) => g.status === "active").length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Completed</p>
                <p className="text-2xl font-bold">{goals.filter((g) => g.status === "completed").length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Current Streak</p>
                <p className="text-2xl font-bold">{currentStreak} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Achievements</p>
                <p className="text-2xl font-bold">{achievements.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-900">
              <Zap className="w-5 h-5 mr-2" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-indigo-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      {rec.action_text && (
                        <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-200">
                          {rec.action_text}
                        </Button>
                      )}
                    </div>
                    <Badge
                      className={
                        rec.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : rec.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Active Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals
              .filter((goal) => goal.status === "active")
              .map((goal) => (
                <Card
                  key={goal.id}
                  className={`border-l-4 ${getPriorityColor(goal.priority)} hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => onViewGoal(goal)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600">{goal.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {goal.is_family_goal && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            <Users className="w-3 h-3 mr-1" />
                            Family
                          </Badge>
                        )}
                        <Badge className={getGoalStatusColor(goal.status)}>{goal.status}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">
                            {goal.current_value} / {goal.target_value} {goal.unit}
                          </span>
                        </div>
                        <Progress value={getGoalProgress(goal)} className="h-2" />
                        <div className="text-right mt-1">
                          <span className="text-sm text-gray-500">{Math.round(getGoalProgress(goal))}% complete</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Due {new Date(goal.target_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          <span>{goal.priority} priority</span>
                        </div>
                      </div>

                      {goal.milestones.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Next milestone</span>
                            <span className="text-sm font-medium">
                              {goal.milestones.find((m) => !m.achieved)?.title || "All completed! 🎉"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Family Challenges */}
      {challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Family Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{challenge.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                        {challenge.prize_description && (
                          <p className="text-sm text-purple-600 font-medium">🏆 {challenge.prize_description}</p>
                        )}
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">{challenge.status}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>
                          {new Date(challenge.start_date).toLocaleDateString()} -{" "}
                          {new Date(challenge.end_date).toLocaleDateString()}
                        </span>
                        <span>{challenge.participants.length} participants</span>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Leaderboard</h4>
                        <div className="space-y-2">
                          {challenge.leaderboard.slice(0, 3).map((score) => (
                            <div
                              key={score.user_id}
                              className="flex items-center justify-between bg-white rounded-lg p-2"
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    score.rank === 1
                                      ? "bg-yellow-400 text-yellow-900"
                                      : score.rank === 2
                                        ? "bg-gray-300 text-gray-700"
                                        : "bg-orange-300 text-orange-900"
                                  }`}
                                >
                                  {score.rank}
                                </div>
                                <span className="font-medium">{score.user_name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold">{score.score}</span>
                                {score.rank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => onJoinChallenge(challenge)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        View Challenge Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      Earned {new Date(achievement.earned_date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
