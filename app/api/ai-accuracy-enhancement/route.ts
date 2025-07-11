import { type NextRequest, NextResponse } from "next/server"

interface AccuracyMetrics {
  overallAccuracy: number
  categoryAccuracy: {
    diagnosis: number
    medication: number
    lifestyle: number
    emergency: number
  }
  demographicAccuracy: {
    [key: string]: number
  }
  regionalAccuracy: {
    [key: string]: number
  }
  improvementAreas: string[]
  lastUpdated: string
}

interface FeedbackSubmission {
  recommendationId: string
  userFeedback: "accurate" | "partially_accurate" | "inaccurate" | "harmful"
  actualOutcome?: string
  userProfile?: {
    age: number
    gender: string
    location: string
    medicalHistory: string[]
  }
  timestamp: string
}

interface SpecialistReviewRequest {
  recommendation: string
  userCase: string
  priority: "low" | "medium" | "high" | "urgent"
  specialtyRequired?: string
}

// Mock data for demonstration - in production, this would come from a database
const mockAccuracyMetrics: AccuracyMetrics = {
  overallAccuracy: 87.3,
  categoryAccuracy: {
    diagnosis: 82.1,
    medication: 91.5,
    lifestyle: 94.2,
    emergency: 78.9,
  },
  demographicAccuracy: {
    "18-30": 89.2,
    "31-50": 87.8,
    "51-70": 85.4,
    "70+": 82.1,
    male: 88.1,
    female: 86.7,
  },
  regionalAccuracy: {
    "North India": 88.5,
    "South India": 87.1,
    "West India": 89.2,
    "East India": 85.8,
    "Northeast India": 84.3,
  },
  improvementAreas: [
    "Emergency symptom recognition for elderly patients",
    "Regional disease pattern recognition",
    "Traditional medicine integration",
    "Pediatric symptom assessment",
    "Mental health screening accuracy",
  ],
  lastUpdated: new Date().toISOString(),
}

// Store feedback submissions (in production, this would be a database)
const feedbackStorage: FeedbackSubmission[] = []

// Store specialist review requests
const specialistReviews: (SpecialistReviewRequest & { id: string; status: string; estimatedTime: string })[] = []

function analyzeFeedback(feedback: FeedbackSubmission): void {
  // In production, this would update the AI model and accuracy metrics
  console.log("Processing feedback:", feedback)

  // Update accuracy metrics based on feedback
  if (feedback.userFeedback === "accurate") {
    // Positive feedback - no immediate action needed
  } else if (feedback.userFeedback === "inaccurate" || feedback.userFeedback === "harmful") {
    // Negative feedback - flag for review and model improvement
    console.log("Flagging for model improvement:", feedback.recommendationId)
  }

  // Store feedback for analysis
  feedbackStorage.push(feedback)
}

function generateReviewId(): string {
  return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function determineSpecialty(recommendation: string): string {
  const specialtyKeywords = {
    cardiology: ["heart", "chest pain", "cardiac", "blood pressure", "cholesterol"],
    neurology: ["headache", "seizure", "stroke", "brain", "neurological"],
    dermatology: ["skin", "rash", "acne", "dermatitis", "eczema"],
    gastroenterology: ["stomach", "digestive", "nausea", "diarrhea", "constipation"],
    orthopedics: ["bone", "joint", "fracture", "arthritis", "back pain"],
    psychiatry: ["depression", "anxiety", "mental health", "stress", "mood"],
    pediatrics: ["child", "infant", "baby", "pediatric", "vaccination"],
    gynecology: ["pregnancy", "menstrual", "reproductive", "gynecological"],
  }

  const lowerRecommendation = recommendation.toLowerCase()

  for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
    if (keywords.some((keyword) => lowerRecommendation.includes(keyword))) {
      return specialty
    }
  }

  return "general medicine"
}

function calculatePriority(recommendation: string, userCase: string): "low" | "medium" | "high" | "urgent" {
  const urgentKeywords = ["emergency", "severe", "critical", "urgent", "immediate"]
  const highKeywords = ["pain", "bleeding", "infection", "fever", "difficulty"]
  const mediumKeywords = ["chronic", "persistent", "recurring", "ongoing"]

  const combinedText = `${recommendation} ${userCase}`.toLowerCase()

  if (urgentKeywords.some((keyword) => combinedText.includes(keyword))) {
    return "urgent"
  } else if (highKeywords.some((keyword) => combinedText.includes(keyword))) {
    return "high"
  } else if (mediumKeywords.some((keyword) => combinedText.includes(keyword))) {
    return "medium"
  }

  return "low"
}

function getEstimatedReviewTime(priority: string): string {
  switch (priority) {
    case "urgent":
      return "Within 1 hour"
    case "high":
      return "Within 4 hours"
    case "medium":
      return "Within 24 hours"
    case "low":
      return "Within 72 hours"
    default:
      return "Within 48 hours"
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "metrics") {
      return NextResponse.json(mockAccuracyMetrics)
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    console.error("Accuracy Enhancement GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch accuracy metrics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "submit_feedback": {
        const { feedback }: { feedback: FeedbackSubmission } = body

        // Validate feedback
        if (!feedback.recommendationId || !feedback.userFeedback) {
          return NextResponse.json({ error: "Invalid feedback data" }, { status: 400 })
        }

        // Process feedback
        analyzeFeedback(feedback)

        return NextResponse.json({
          success: true,
          message: "Feedback submitted successfully",
          feedbackId: `feedback_${Date.now()}`,
        })
      }

      case "request_specialist_review": {
        const { recommendation, userCase }: { recommendation: string; userCase: string } = body

        if (!recommendation) {
          return NextResponse.json({ error: "Recommendation is required" }, { status: 400 })
        }

        const reviewId = generateReviewId()
        const specialty = determineSpecialty(recommendation)
        const priority = calculatePriority(recommendation, userCase || "")
        const estimatedTime = getEstimatedReviewTime(priority)

        const reviewRequest = {
          id: reviewId,
          recommendation,
          userCase: userCase || "",
          priority,
          specialtyRequired: specialty,
          status: "pending",
          estimatedTime,
        }

        specialistReviews.push(reviewRequest)

        return NextResponse.json({
          success: true,
          reviewId,
          specialty,
          priority,
          estimatedTime,
          message: `Specialist review requested. A ${specialty} specialist will review your case.`,
        })
      }

      case "update_knowledge_base": {
        // This would update the AI knowledge base with new medical information
        const { medicalGuidelines, researchPapers, specialistRecommendations } = body

        // In production, this would trigger a model update process
        console.log("Updating knowledge base with:", {
          medicalGuidelines: medicalGuidelines?.length || 0,
          researchPapers: researchPapers?.length || 0,
          specialistRecommendations: specialistRecommendations?.length || 0,
        })

        return NextResponse.json({
          success: true,
          message: "Knowledge base update initiated",
          updateId: `update_${Date.now()}`,
        })
      }

      case "get_improvement_suggestions": {
        const suggestions = [
          {
            area: "Emergency Detection",
            suggestion: "Improve recognition of cardiac emergency symptoms in elderly patients",
            priority: "high",
            estimatedImpact: "15% accuracy improvement",
          },
          {
            area: "Regional Adaptation",
            suggestion: "Add more regional disease patterns for Northeast India",
            priority: "medium",
            estimatedImpact: "8% accuracy improvement",
          },
          {
            area: "Traditional Medicine",
            suggestion: "Better integration of Ayurvedic and traditional remedies",
            priority: "medium",
            estimatedImpact: "12% user satisfaction improvement",
          },
          {
            area: "Pediatric Care",
            suggestion: "Enhanced symptom assessment for children under 5",
            priority: "high",
            estimatedImpact: "20% accuracy improvement for pediatric cases",
          },
        ]

        return NextResponse.json({ suggestions })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Accuracy Enhancement POST Error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
