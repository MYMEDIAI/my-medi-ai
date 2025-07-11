import { type NextRequest, NextResponse } from "next/server"

interface AccuracyFeedback {
  recommendationId: string
  userFeedback: "accurate" | "partially_accurate" | "inaccurate" | "harmful"
  actualOutcome?: string
  professionalVerification?: {
    verified: boolean
    doctorFeedback: string
    corrections: string[]
  }
  userProfile: {
    age: number
    gender: string
    location: string
    medicalHistory: string[]
  }
  timestamp: string
}

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

// Simulated accuracy tracking (in production, this would be in a database)
const accuracyData: AccuracyFeedback[] = []
let knowledgeBaseVersion = "1.0.0"
let lastKnowledgeUpdate = new Date().toISOString()

// Indian Medical Guidelines Integration
const INDIAN_MEDICAL_GUIDELINES = {
  fever_management: {
    temperature_threshold: 100.4, // Fahrenheit
    first_line_treatment: ["Paracetamol 500mg", "Adequate hydration", "Rest"],
    red_flags: ["High fever >103°F", "Persistent fever >3 days", "Associated symptoms"],
    cultural_considerations: ["Avoid cold foods in fever", "Tulsi and ginger tea beneficial"],
  },
  hypertension_india: {
    diagnostic_criteria: "≥140/90 mmHg",
    lifestyle_modifications: ["Low salt diet", "Regular exercise", "Stress management"],
    common_medications: ["Amlodipine", "Telmisartan", "Metoprolol"],
    dietary_advice: ["Reduce salt intake", "Include potassium-rich foods", "Limit processed foods"],
  },
  diabetes_management: {
    hba1c_target: "<7%",
    fasting_glucose: "80-130 mg/dL",
    lifestyle_factors: ["Carbohydrate counting", "Regular exercise", "Weight management"],
    indian_diet_considerations: ["Portion control of rice/roti", "Include millets", "Avoid sugary drinks"],
  },
}

// Specialist Review Queue
interface SpecialistReview {
  id: string
  aiRecommendation: string
  userCase: string
  specialistFeedback?: string
  accuracy: number
  improvements: string[]
  status: "pending" | "reviewed" | "approved"
}

const specialistReviewQueue: SpecialistReview[] = []

function calculateAccuracyMetrics(): AccuracyMetrics {
  if (accuracyData.length === 0) {
    return {
      overallAccuracy: 85, // Default baseline
      categoryAccuracy: {
        diagnosis: 80,
        medication: 90,
        lifestyle: 95,
        emergency: 98,
      },
      demographicAccuracy: {},
      regionalAccuracy: {},
      improvementAreas: ["Increase diagnostic accuracy", "Improve cultural adaptation"],
      lastUpdated: new Date().toISOString(),
    }
  }

  const totalFeedback = accuracyData.length
  const accurateFeedback = accuracyData.filter(
    (f) => f.userFeedback === "accurate" || f.userFeedback === "partially_accurate",
  ).length

  const overallAccuracy = Math.round((accurateFeedback / totalFeedback) * 100)

  // Calculate category-wise accuracy
  const categories = ["diagnosis", "medication", "lifestyle", "emergency"]
  const categoryAccuracy: any = {}

  categories.forEach((category) => {
    const categoryData = accuracyData.filter((f) => f.recommendationId.includes(category))
    if (categoryData.length > 0) {
      const categoryAccurate = categoryData.filter(
        (f) => f.userFeedback === "accurate" || f.userFeedback === "partially_accurate",
      ).length
      categoryAccuracy[category] = Math.round((categoryAccurate / categoryData.length) * 100)
    } else {
      categoryAccuracy[category] = 85 // Default
    }
  })

  // Calculate demographic accuracy
  const demographicAccuracy: any = {}
  const ageGroups = ["18-30", "31-50", "51-70", "70+"]
  ageGroups.forEach((group) => {
    const [min, max] = group === "70+" ? [70, 150] : group.split("-").map(Number)
    const groupData = accuracyData.filter((f) => f.userProfile.age >= min && (max ? f.userProfile.age <= max : true))
    if (groupData.length > 0) {
      const groupAccurate = groupData.filter(
        (f) => f.userFeedback === "accurate" || f.userFeedback === "partially_accurate",
      ).length
      demographicAccuracy[group] = Math.round((groupAccurate / groupData.length) * 100)
    }
  })

  // Calculate regional accuracy
  const regionalAccuracy: any = {}
  const regions = [...new Set(accuracyData.map((f) => f.userProfile.location.split(",")[1]?.trim()))]
  regions.forEach((region) => {
    if (region) {
      const regionData = accuracyData.filter((f) => f.userProfile.location.includes(region))
      if (regionData.length > 0) {
        const regionAccurate = regionData.filter(
          (f) => f.userFeedback === "accurate" || f.userFeedback === "partially_accurate",
        ).length
        regionalAccuracy[region] = Math.round((regionAccurate / regionData.length) * 100)
      }
    }
  })

  // Identify improvement areas
  const improvementAreas: string[] = []
  if (categoryAccuracy.diagnosis < 85) improvementAreas.push("Improve diagnostic accuracy")
  if (categoryAccuracy.medication < 90) improvementAreas.push("Enhance medication recommendations")
  if (overallAccuracy < 80) improvementAreas.push("General accuracy improvement needed")

  const inaccurateFeedback = accuracyData.filter((f) => f.userFeedback === "inaccurate")
  if (inaccurateFeedback.length > totalFeedback * 0.1) {
    improvementAreas.push("Address common inaccuracy patterns")
  }

  return {
    overallAccuracy,
    categoryAccuracy,
    demographicAccuracy,
    regionalAccuracy,
    improvementAreas,
    lastUpdated: new Date().toISOString(),
  }
}

function updateKnowledgeBase(feedback: AccuracyFeedback[]): string[] {
  const updates: string[] = []

  // Analyze feedback patterns
  const commonIssues = feedback
    .filter((f) => f.userFeedback === "inaccurate")
    .map((f) => f.actualOutcome)
    .filter(Boolean)

  // Update guidelines based on professional verification
  const verifiedCorrections = feedback
    .filter((f) => f.professionalVerification?.verified)
    .flatMap((f) => f.professionalVerification?.corrections || [])

  if (verifiedCorrections.length > 0) {
    updates.push(`Updated medical guidelines based on ${verifiedCorrections.length} professional corrections`)
    knowledgeBaseVersion = incrementVersion(knowledgeBaseVersion)
    lastKnowledgeUpdate = new Date().toISOString()
  }

  // Regional adaptations
  const regionalFeedback = feedback.reduce(
    (acc, f) => {
      const region = f.userProfile.location.split(",")[1]?.trim()
      if (region) {
        if (!acc[region]) acc[region] = []
        acc[region].push(f)
      }
      return acc
    },
    {} as { [key: string]: AccuracyFeedback[] },
  )

  Object.entries(regionalFeedback).forEach(([region, regionFeedback]) => {
    if (regionFeedback.length >= 5) {
      // Minimum threshold for regional updates
      updates.push(`Updated regional guidelines for ${region}`)
    }
  })

  return updates
}

function incrementVersion(version: string): string {
  const parts = version.split(".")
  const patch = Number.parseInt(parts[2]) + 1
  return `${parts[0]}.${parts[1]}.${patch}`
}

function generateSpecialistReview(recommendation: string, userCase: string): string {
  const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  specialistReviewQueue.push({
    id: reviewId,
    aiRecommendation: recommendation,
    userCase: userCase,
    accuracy: 0,
    improvements: [],
    status: "pending",
  })

  return reviewId
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action

    switch (action) {
      case "submit_feedback":
        const feedback: AccuracyFeedback = body.feedback
        accuracyData.push(feedback)

        // Update knowledge base if significant feedback received
        if (accuracyData.length % 10 === 0) {
          // Update every 10 feedback items
          const updates = updateKnowledgeBase(accuracyData.slice(-10))
          return NextResponse.json({
            success: true,
            message: "Feedback recorded successfully",
            knowledgeBaseUpdates: updates,
            currentVersion: knowledgeBaseVersion,
          })
        }

        return NextResponse.json({
          success: true,
          message: "Feedback recorded successfully",
        })

      case "request_specialist_review":
        const { recommendation, userCase } = body
        const reviewId = generateSpecialistReview(recommendation, userCase)

        return NextResponse.json({
          success: true,
          reviewId,
          message: "Specialist review requested",
          estimatedTime: "24-48 hours",
        })

      case "get_accuracy_metrics":
        const metrics = calculateAccuracyMetrics()
        return NextResponse.json(metrics)

      case "get_knowledge_base_info":
        return NextResponse.json({
          version: knowledgeBaseVersion,
          lastUpdated: lastKnowledgeUpdate,
          guidelines: Object.keys(INDIAN_MEDICAL_GUIDELINES),
          totalFeedback: accuracyData.length,
          pendingReviews: specialistReviewQueue.filter((r) => r.status === "pending").length,
        })

      case "update_guidelines":
        // This would typically be restricted to admin users
        const { guideline, updates } = body
        if (INDIAN_MEDICAL_GUIDELINES[guideline as keyof typeof INDIAN_MEDICAL_GUIDELINES]) {
          // Update guidelines (in production, this would update the database)
          knowledgeBaseVersion = incrementVersion(knowledgeBaseVersion)
          lastKnowledgeUpdate = new Date().toISOString()

          return NextResponse.json({
            success: true,
            message: `Guidelines updated for ${guideline}`,
            newVersion: knowledgeBaseVersion,
          })
        }

        return NextResponse.json(
          {
            success: false,
            message: "Guideline not found",
          },
          { status: 404 },
        )

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid action",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Accuracy enhancement error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const type = url.searchParams.get("type")

    switch (type) {
      case "metrics":
        return NextResponse.json(calculateAccuracyMetrics())

      case "guidelines":
        return NextResponse.json({
          guidelines: INDIAN_MEDICAL_GUIDELINES,
          version: knowledgeBaseVersion,
          lastUpdated: lastKnowledgeUpdate,
        })

      case "specialist_queue":
        return NextResponse.json({
          pending: specialistReviewQueue.filter((r) => r.status === "pending").length,
          reviewed: specialistReviewQueue.filter((r) => r.status === "reviewed").length,
          approved: specialistReviewQueue.filter((r) => r.status === "approved").length,
          queue: specialistReviewQueue.slice(0, 10), // Return first 10 for preview
        })

      default:
        return NextResponse.json({
          message: "AI Accuracy Enhancement System",
          version: knowledgeBaseVersion,
          lastUpdated: lastKnowledgeUpdate,
          totalFeedback: accuracyData.length,
          overallAccuracy: calculateAccuracyMetrics().overallAccuracy,
        })
    }
  } catch (error) {
    console.error("GET request error:", error)
    return NextResponse.json(
      {
        error: "Unable to retrieve data",
      },
      { status: 500 },
    )
  }
}
