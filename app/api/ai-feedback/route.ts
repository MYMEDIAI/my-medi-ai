import { type NextRequest, NextResponse } from "next/server"

interface FeedbackRequest {
  type: "helpful" | "not_helpful" | "rating"
  context: string
  recommendation: string
  userProfile?: {
    age: number
    gender: string
    location: string
    diet: string
    familyType: string
    economicStatus: string
    language: string
  }
  rating?: number
  comment?: string
  timestamp: string
}

interface FeedbackResponse {
  success: boolean
  message: string
  learningInsight?: string
}

// In a real application, this would be stored in a database
const feedbackStore: FeedbackRequest[] = []

// Learning patterns from feedback
const learningPatterns = {
  helpful_explanations: [] as string[],
  unhelpful_explanations: [] as string[],
  preferred_cultural_adaptations: [] as string[],
  regional_preferences: {} as { [key: string]: string[] },
  age_group_preferences: {} as { [key: string]: string[] },
}

function analyzeFeedback(feedback: FeedbackRequest): string {
  // Store feedback
  feedbackStore.push(feedback)

  // Analyze patterns
  if (feedback.type === "helpful") {
    if (feedback.context === "explanation") {
      learningPatterns.helpful_explanations.push(feedback.recommendation)
    } else if (feedback.context === "cultural") {
      learningPatterns.preferred_cultural_adaptations.push(feedback.recommendation)
    }

    // Regional learning
    if (feedback.userProfile?.location) {
      const region = feedback.userProfile.location
      if (!learningPatterns.regional_preferences[region]) {
        learningPatterns.regional_preferences[region] = []
      }
      learningPatterns.regional_preferences[region].push(feedback.recommendation)
    }

    // Age group learning
    if (feedback.userProfile?.age) {
      const ageGroup = getAgeGroup(feedback.userProfile.age)
      if (!learningPatterns.age_group_preferences[ageGroup]) {
        learningPatterns.age_group_preferences[ageGroup] = []
      }
      learningPatterns.age_group_preferences[ageGroup].push(feedback.recommendation)
    }

    return generateLearningInsight(feedback)
  } else if (feedback.type === "not_helpful") {
    if (feedback.context === "explanation") {
      learningPatterns.unhelpful_explanations.push(feedback.recommendation)
    }
    return "Thank you for the feedback. We'll improve this type of recommendation."
  }

  return "Feedback recorded successfully."
}

function getAgeGroup(age: number): string {
  if (age < 18) return "child"
  if (age < 30) return "young_adult"
  if (age < 50) return "middle_aged"
  if (age < 65) return "senior"
  return "elderly"
}

function generateLearningInsight(feedback: FeedbackRequest): string {
  const insights = [
    "Your feedback helps our AI better understand Indian healthcare preferences.",
    "We're learning that this type of recommendation works well for your demographic.",
    "Your input contributes to making AI more culturally sensitive for Indian patients.",
    "This feedback helps us improve recommendations for your region and age group.",
    "Thank you! Your feedback makes our AI smarter for future Indian patients.",
  ]

  // Personalized insights based on user profile
  if (feedback.userProfile?.diet === "vegetarian") {
    insights.push("Your feedback helps us better serve vegetarian patients in India.")
  }

  if (feedback.userProfile?.familyType === "joint") {
    insights.push("Your input helps us understand joint family healthcare dynamics better.")
  }

  if (feedback.userProfile?.economicStatus === "low") {
    insights.push("Your feedback helps us provide more affordable healthcare recommendations.")
  }

  return insights[Math.floor(Math.random() * insights.length)]
}

function getImprovementSuggestions(context: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    explanation: [
      "Use simpler language and more examples",
      "Include more visual analogies",
      "Add regional context and local examples",
      "Provide step-by-step explanations",
    ],
    cultural: [
      "Include more Ayurvedic alternatives",
      "Consider regional dietary preferences",
      "Add family involvement strategies",
      "Include economic alternatives",
    ],
    suggestions: [
      "Make questions more specific to Indian context",
      "Include culturally relevant examples",
      "Consider regional health patterns",
      "Add preventive care suggestions",
    ],
  }

  return suggestions[context] || ["Continue improving based on user feedback"]
}

export async function POST(request: NextRequest) {
  try {
    const feedback: FeedbackRequest = await request.json()

    // Validate feedback
    if (!feedback.type || !feedback.context || !feedback.recommendation) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid feedback data",
        },
        { status: 400 },
      )
    }

    // Analyze feedback and generate learning insights
    const learningInsight = analyzeFeedback(feedback)

    // Generate improvement suggestions for the AI system
    const improvements = getImprovementSuggestions(feedback.context)

    // Log for analytics (in real app, this would go to your analytics system)
    console.log("AI Feedback Received:", {
      type: feedback.type,
      context: feedback.context,
      userProfile: feedback.userProfile,
      timestamp: feedback.timestamp,
      improvements,
    })

    const response: FeedbackResponse = {
      success: true,
      message: "Thank you for your feedback! It helps improve our AI for Indian patients.",
      learningInsight,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Feedback processing error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process feedback",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to retrieve learning analytics (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get("type")

    if (type === "analytics") {
      const analytics = {
        totalFeedback: feedbackStore.length,
        helpfulCount: feedbackStore.filter((f) => f.type === "helpful").length,
        unhelpfulCount: feedbackStore.filter((f) => f.type === "not_helpful").length,
        averageRating:
          feedbackStore.filter((f) => f.rating).reduce((sum, f) => sum + (f.rating || 0), 0) /
          feedbackStore.filter((f) => f.rating).length,
        learningPatterns,
        recentFeedback: feedbackStore.slice(-10),
      }

      return NextResponse.json(analytics)
    }

    return NextResponse.json({ message: "AI Feedback API is running" })
  } catch (error) {
    console.error("Analytics retrieval error:", error)
    return NextResponse.json(
      {
        error: "Unable to retrieve analytics",
      },
      { status: 500 },
    )
  }
}
