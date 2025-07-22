"use client"

import { useState } from "react"
import Link from "next/link"
import { Scale, TrendingDown, Download, Home, RotateCcw, Printer, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface WeightLossData {
  // Personal Information
  name: string
  age: string
  gender: string
  height: string
  currentWeight: string
  targetWeight: string

  // Health Information
  healthConditions: string[]
  medications: string
  activityLevel: string

  // Lifestyle
  dietPreference: string
  cuisinePreference: string
  mealsPerDay: string
  waterIntake: string
  sleepHours: string

  // Goals
  timeframe: string
  primaryGoal: string
  motivation: string

  // Contact Information
  phone: string
  email: string
  emergencyContact: string
}

interface WeightLossResults {
  bmi: {
    current: number
    target: number
    category: string
    risk: string
  }
  calories: {
    bmr: number
    tdee: number
    deficit: number
    targetDaily: number
  }
  timeline: {
    weeklyLoss: number
    estimatedWeeks: number
    milestones: Array<{ week: number; weight: number; goal: string }>
  }
  dietPlan: {
    breakfast: string[]
    midMorning: string[]
    lunch: string[]
    evening: string[]
    dinner: string[]
    bedtime: string[]
  }
  exercisePlan: {
    cardio: string[]
    strength: string[]
    flexibility: string[]
    schedule: string
    gymExercises: string[]
  }
  supplements: string[]
  tips: string[]
  riskAssessment: {
    level: string
    factors: string[]
    recommendations: string[]
  }
  followUp: {
    schedule: string
    tests: string[]
    consultations: string[]
  }
}

export default function WeightLossPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<WeightLossResults | null>(null)

  const [formData, setFormData] = useState<WeightLossData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    healthConditions: [],
    medications: "",
    activityLevel: "",
    dietPreference: "",
    cuisinePreference: "",
    mealsPerDay: "",
    waterIntake: "",
    sleepHours: "",
    timeframe: "",
    primaryGoal: "",
    motivation: "",
    phone: "",
    email: "",
    emergencyContact: "",
  })

  const handleInputChange = (field: keyof WeightLossData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleHealthConditionToggle = (condition: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter((c) => c !== condition)
        : [...prev.healthConditions, condition],
    }))
  }

  const calculateBMI = (weight: number, height: number) => {
    const heightInM = height / 100
    return weight / (heightInM * heightInM)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", risk: "Low" }
    if (bmi < 25) return { category: "Normal", risk: "Low" }
    if (bmi < 30) return { category: "Overweight", risk: "Moderate" }
    return { category: "Obese", risk: "High" }
  }

  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === "male") {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    } else {
      return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
    }
  }

  const getActivityMultiplier = (level: string) => {
    switch (level) {
      case "sedentary":
        return 1.2
      case "light":
        return 1.375
      case "moderate":
        return 1.55
      case "active":
        return 1.725
      case "very-active":
        return 1.9
      default:
        return 1.2
    }
  }

  const generateResults = async () => {
    setIsLoading(true)

    try {
      // Call AI API to generate comprehensive weight loss plan
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "weight-loss-plan",
          data: formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate plan")
      }

      const aiResults = await response.json()
      setResults(aiResults)
    } catch (error) {
      console.error("Error generating results:", error)
      // Fallback to local generation if API fails
      await generateLocalResults()
    } finally {
      setIsLoading(false)
    }
  }

  const generateLocalResults = async () => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const weight = Number.parseFloat(formData.currentWeight)
    const height = Number.parseFloat(formData.height)
    const age = Number.parseInt(formData.age)
    const targetWeight = Number.parseFloat(formData.targetWeight)

    const currentBMI = calculateBMI(weight, height)
    const targetBMI = calculateBMI(targetWeight, height)
    const currentBMIInfo = getBMICategory(currentBMI)

    const bmr = calculateBMR(weight, height, age, formData.gender)
    const tdee = bmr * getActivityMultiplier(formData.activityLevel)
    const weightToLose = weight - targetWeight
    const deficit = Math.min(500, weightToLose * 100)
    const targetDaily = tdee - deficit

    const weeklyLoss = (deficit * 7) / 7700
    const estimatedWeeks = Math.ceil(weightToLose / weeklyLoss)

    // Generate AI-like personalized content
    const results: WeightLossResults = {
      bmi: {
        current: currentBMI,
        target: targetBMI,
        category: currentBMIInfo.category,
        risk: currentBMIInfo.risk,
      },
      calories: {
        bmr,
        tdee,
        deficit,
        targetDaily,
      },
      timeline: {
        weeklyLoss,
        estimatedWeeks,
        milestones: generateMilestones(estimatedWeeks, weight, weeklyLoss),
      },
      dietPlan: generatePersonalizedDietPlan(formData),
      exercisePlan: generatePersonalizedExercisePlan(formData),
      supplements: generatePersonalizedSupplements(formData),
      tips: generatePersonalizedTips(formData),
      riskAssessment: generateRiskAssessment(formData, currentBMI),
      followUp: generateFollowUpPlan(formData),
    }

    setResults(results)
  }

  const generateMilestones = (weeks: number, startWeight: number, weeklyLoss: number) => {
    const milestones = []
    for (let week = 2; week <= weeks; week += 2) {
      const currentWeight = startWeight - weeklyLoss * week
      let goal = ""

      if (week <= 4) goal = "Initial adaptation and habit formation"
      else if (week <= 8) goal = "Metabolic adjustment and visible changes"
      else if (week <= 12) goal = "Significant progress and lifestyle integration"
      else if (week <= 16) goal = "Advanced progress and body composition changes"
      else goal = "Maintenance preparation and goal achievement"

      milestones.push({
        week,
        weight: currentWeight,
        goal,
      })
    }
    return milestones
  }

  const generatePersonalizedDietPlan = (data: WeightLossData) => {
    const isVeg = data.dietPreference === "vegetarian" || data.dietPreference === "vegan"
    const cuisine = data.cuisinePreference || "north-indian"

    return {
      breakfast: [
        `${cuisine === "south-indian" ? "Idli with sambar" : "Oats with fruits"} (280-320 cal)`,
        `${cuisine === "gujarati" ? "Dhokla with chutney" : "Vegetable poha"} (250-290 cal)`,
        `${isVeg ? "Moong dal chilla" : "Egg white omelet"} with vegetables (260-300 cal)`,
        `${cuisine === "south-indian" ? "Upma with vegetables" : "Whole wheat toast"} (240-280 cal)`,
      ],
      midMorning: [
        "Green tea with 6-8 almonds (85 cal)",
        "Buttermilk with mint and cumin (65 cal)",
        "Seasonal fruit (apple/guava) (80-90 cal)",
        "Coconut water with lemon (50 cal)",
      ],
      lunch: [
        `Brown rice with ${isVeg ? "dal and sabzi" : "chicken curry"} (380-420 cal)`,
        `2 whole wheat roti with ${cuisine === "punjabi" ? "rajma" : "mixed vegetables"} (350-390 cal)`,
        `Quinoa pulao with ${isVeg ? "paneer" : "lean meat"} and raita (370-410 cal)`,
        `${cuisine === "south-indian" ? "Brown rice with rasam" : "Khichdi"} with vegetables (340-380 cal)`,
      ],
      evening: [
        "Herbal tea with 2 whole grain biscuits (105 cal)",
        "Roasted chana (chickpeas) with spices (125 cal)",
        "Green tea with handful of mixed nuts (95 cal)",
        "Vegetable soup with 1 slice multigrain bread (110 cal)",
      ],
      dinner: [
        `Grilled ${isVeg ? "paneer" : "chicken"} with steamed vegetables (290-330 cal)`,
        `Dal with 1 roti and large salad (270-310 cal)`,
        `${isVeg ? "Tofu curry" : "Fish curry"} with brown rice (310-350 cal)`,
        `Vegetable soup with ${cuisine === "gujarati" ? "khakhra" : "whole grain bread"} (240-280 cal)`,
      ],
      bedtime: [
        "Warm turmeric milk with honey (105 cal)",
        "Chamomile tea (5 cal)",
        "Warm water with lemon and honey (30 cal)",
        "Herbal tea (fennel/mint) (10 cal)",
      ],
    }
  }

  const generatePersonalizedExercisePlan = (data: WeightLossData) => {
    const activityLevel = data.activityLevel || "moderate"
    const age = Number.parseInt(data.age) || 30

    return {
      cardio: [
        `${age > 50 ? "25-30 min" : "30-40 min"} brisk walking daily`,
        `${activityLevel === "sedentary" ? "15-20 min" : "25-30 min"} cycling 3x/week`,
        "20-25 min dancing/Zumba 2x/week",
        `Swimming ${age > 45 ? "25-30 min" : "30-35 min"} 2x/week`,
        "Stair climbing 10-15 min daily",
      ],
      strength: [
        "Bodyweight exercises (push-ups, squats) 3x/week",
        "Resistance band training 20-25 min",
        "Yoga for strength building 2x/week",
        `${activityLevel === "active" ? "Moderate" : "Light"} weight training 2-3x/week`,
        "Functional training (kettlebells) 2x/week",
      ],
      flexibility: [
        "Morning stretching routine 10-15 min",
        "Evening yoga session 20-30 min",
        "Weekend longer yoga class 45-60 min",
        "Daily mobility exercises 5-10 min",
        "Foam rolling session 2x/week",
      ],
      gymExercises: [
        "Treadmill: 20-30 min moderate pace",
        "Elliptical: 15-25 min interval training",
        "Leg press: 3 sets of 12-15 reps",
        "Chest press: 3 sets of 10-12 reps",
        "Lat pulldown: 3 sets of 10-12 reps",
        "Shoulder press: 3 sets of 8-10 reps",
        "Leg curls: 3 sets of 12-15 reps",
        "Planks: 3 sets of 30-60 seconds",
        "Stationary bike: 15-20 min cool down",
      ],
      schedule: generateWorkoutSchedule(activityLevel),
    }
  }

  const generateWorkoutSchedule = (activityLevel: string) => {
    if (activityLevel === "sedentary") {
      return "Mon/Wed/Fri: Light cardio + flexibility, Tue/Thu: Strength training, Sat: Active recovery walk, Sun: Rest"
    } else if (activityLevel === "active" || activityLevel === "very-active") {
      return "Mon/Wed/Fri: Strength + HIIT, Tue/Thu/Sat: Cardio + flexibility, Sun: Active recovery or light yoga"
    } else {
      return "Mon/Wed/Fri: Strength + cardio, Tue/Thu: Cardio + flexibility, Sat: Mixed workout, Sun: Rest or light activity"
    }
  }

  const generatePersonalizedSupplements = (data: WeightLossData) => {
    const supplements = ["Multivitamin (Revital H or Centrum)"]

    if (data.dietPreference === "vegetarian" || data.dietPreference === "vegan") {
      supplements.push("Vitamin B12 supplement")
      supplements.push("Iron supplement (if deficient)")
    }

    if (data.healthConditions.includes("Diabetes")) {
      supplements.push("Chromium supplement (consult doctor)")
    }

    if (Number.parseInt(data.age) > 40) {
      supplements.push("Calcium + Vitamin D3")
      supplements.push("Omega-3 fatty acids")
    }

    supplements.push(
      "Protein powder (whey or plant-based)",
      "Green tea extract (optional)",
      "Probiotics for digestive health",
      "Magnesium for muscle recovery",
    )

    return supplements
  }

  const generatePersonalizedTips = (data: WeightLossData) => {
    const tips = [
      "Drink 500ml water 30 minutes before each meal",
      "Use smaller plates (8-9 inch) to control portions naturally",
      "Include protein in every meal to maintain satiety",
    ]

    if (data.cuisinePreference === "gujarati") {
      tips.push("Reduce oil in traditional preparations, use steaming/grilling")
    }

    if (data.healthConditions.includes("Diabetes")) {
      tips.push("Monitor blood sugar before and after meals")
    }

    if (Number.parseInt(data.sleepHours) < 7) {
      tips.push("Prioritize 7-8 hours of sleep for better metabolism")
    }

    tips.push(
      "Meal prep on weekends to avoid unhealthy choices",
      "Track progress weekly, not daily to avoid fluctuations",
      "Practice mindful eating - chew slowly and avoid distractions",
      "Include fiber-rich foods to feel fuller longer",
      "Stay consistent rather than aiming for perfection",
      "Manage stress through meditation or deep breathing",
    )

    return tips
  }

  const generateRiskAssessment = (data: WeightLossData, bmi: number) => {
    let riskLevel = "Low"
    const riskFactors = []
    const recommendations = []

    if (bmi > 30) {
      riskLevel = "High"
      riskFactors.push("Obesity (BMI > 30)")
      recommendations.push("Medical supervision recommended")
    } else if (bmi > 25) {
      riskLevel = "Moderate"
      riskFactors.push("Overweight (BMI 25-30)")
    }

    if (data.healthConditions.includes("Diabetes")) {
      riskLevel = "High"
      riskFactors.push("Diabetes mellitus")
      recommendations.push("Regular blood glucose monitoring required")
    }

    if (data.healthConditions.includes("Heart Disease")) {
      riskLevel = "High"
      riskFactors.push("Cardiovascular disease")
      recommendations.push("Cardiac clearance needed before exercise")
    }

    if (data.healthConditions.includes("Hypertension")) {
      riskLevel = riskLevel === "Low" ? "Moderate" : "High"
      riskFactors.push("High blood pressure")
      recommendations.push("Monitor BP regularly during weight loss")
    }

    if (Number.parseInt(data.age) > 60) {
      riskLevel = riskLevel === "Low" ? "Moderate" : riskLevel
      riskFactors.push("Age over 60")
      recommendations.push("Gradual exercise progression recommended")
    }

    return { level: riskLevel, factors: riskFactors, recommendations }
  }

  const generateFollowUpPlan = (data: WeightLossData) => {
    const hasHighRisk = data.healthConditions.some((condition) =>
      ["Diabetes", "Heart Disease", "Hypertension"].includes(condition),
    )

    return {
      schedule: hasHighRisk ? "Every 2 weeks" : "Monthly",
      tests: [
        "Complete Blood Count (CBC)",
        "Lipid Profile (Cholesterol, Triglycerides)",
        "Blood Sugar (Fasting & Post-meal)",
        "Liver Function Test (LFT)",
        "Kidney Function Test (KFT)",
        "Thyroid Function Test (TSH, T3, T4)",
        "Vitamin D3 and B12 levels",
        "HbA1c (if diabetic)",
      ],
      consultations: [
        "Registered Dietitian consultation",
        "Certified fitness trainer guidance",
        "Regular physician check-ups",
        "Endocrinologist (if diabetic/thyroid issues)",
        "Cardiologist (if heart conditions)",
        "Mental health counselor (if needed)",
      ],
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      height: "",
      currentWeight: "",
      targetWeight: "",
      healthConditions: [],
      medications: "",
      activityLevel: "",
      dietPreference: "",
      cuisinePreference: "",
      mealsPerDay: "",
      waterIntake: "",
      sleepHours: "",
      timeframe: "",
      primaryGoal: "",
      motivation: "",
      phone: "",
      email: "",
      emergencyContact: "",
    })
    setResults(null)
    setCurrentStep(1)
  }

  const downloadPDF = () => {
    // Add print-specific styles
    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .print-header { margin-bottom: 20px; }
          .print-section { margin-bottom: 15px; }
          .grid { display: block !important; }
          .grid > div { margin-bottom: 10px; }
        }
      </style>
    `

    document.head.insertAdjacentHTML("beforeend", printStyles)
    window.print()
  }

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Weight Loss Plan - MyMedi.ai",
          text: `Check out my personalized weight loss plan from MyMedi.ai!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            background: white !important;
          }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .print-header { 
            margin-bottom: 20px; 
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .print-section { 
            margin-bottom: 20px; 
            page-break-inside: avoid;
          }
          .grid { display: block !important; }
          .grid > div { 
            margin-bottom: 15px; 
            border: 1px solid #ddd;
            padding: 10px;
          }
          .tabs-content { display: block !important; }
          .hidden { display: block !important; }
          h1, h2, h3 { color: #333 !important; }
          .bg-gradient-to-br { background: white !important; }
          .card { border: 1px solid #ddd !important; box-shadow: none !important; }
        }
      `}</style>

        <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm no-print">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button onClick={downloadPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={() => window.print()} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={shareResults} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </header>

        <div className="print-area">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Print Header */}
              <div className="print-header">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalized Weight Loss Plan</h1>
                <p className="text-gray-600">Generated by MYMED.AI for {formData.name}</p>
                <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
              </div>

              {/* All Tabs Content for Print */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Overview & Analysis</h2>
                {/* BMI and metabolic analysis content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold">Current BMI</h3>
                    <p className="text-2xl font-bold text-blue-600">{results.bmi.current.toFixed(1)}</p>
                    <p className="text-sm">{results.bmi.category}</p>
                  </div>
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold">Target BMI</h3>
                    <p className="text-2xl font-bold text-green-600">{results.bmi.target.toFixed(1)}</p>
                    <p className="text-sm">Healthy Range</p>
                  </div>
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold">Daily Calories</h3>
                    <p className="text-2xl font-bold text-orange-600">{Math.round(results.calories.targetDaily)}</p>
                    <p className="text-sm">For weight loss</p>
                  </div>
                  <div className="border p-4 rounded">
                    <h3 className="font-semibold">Timeline</h3>
                    <p className="text-2xl font-bold text-purple-600">{results.timeline.estimatedWeeks}</p>
                    <p className="text-sm">Weeks to goal</p>
                  </div>
                </div>
              </div>

              <div className="page-break"></div>

              {/* Diet Plan Section */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">7-Meal Indian Diet Plan</h2>
                {Object.entries(results.dietPlan).map(([meal, options]) => (
                  <div key={meal} className="mb-4 border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2 capitalize">{meal.replace(/([A-Z])/g, " $1")}</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {options.map((option, index) => (
                        <li key={index} className="text-gray-700">
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="page-break"></div>

              {/* Exercise Plan Section */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Comprehensive Exercise Plan</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-red-600">Cardio Exercises</h3>
                    <ul className="space-y-2">
                      {results.exercisePlan.cardio.map((exercise, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-blue-600">Strength Training</h3>
                    <ul className="space-y-2">
                      {results.exercisePlan.strength.map((exercise, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{exercise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Gym Exercises */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-purple-600">Gym Exercises</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.exercisePlan.gymExercises.map((exercise, index) => (
                      <div key={index} className="border p-3 rounded">
                        <span className="font-medium">{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border p-4 rounded bg-gray-50">
                  <h4 className="font-semibold mb-2">Weekly Schedule:</h4>
                  <p>{results.exercisePlan.schedule}</p>
                </div>
              </div>

              <div className="page-break"></div>

              {/* Timeline & Milestones */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Timeline & Milestones</h2>
                <div className="text-center p-4 bg-gray-100 rounded-lg mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Expected Weekly Loss: {results.timeline.weeklyLoss.toFixed(1)} kg
                  </h3>
                  <p className="text-gray-600">Safe and sustainable weight loss rate</p>
                </div>

                {results.timeline.milestones.map((milestone, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-lg">
                    <h4 className="font-semibold">Week {milestone.week}</h4>
                    <p className="text-gray-600">{milestone.goal}</p>
                    <p className="text-sm text-gray-500">Target weight: {milestone.weight.toFixed(1)} kg</p>
                  </div>
                ))}
              </div>

              <div className="page-break"></div>

              {/* Supplements Section */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Recommended Supplements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.supplements.map((supplement, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="mr-3">•</span>
                      <span>{supplement}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm italic">
                  Consult with a healthcare provider before starting any supplements, especially if you have medical
                  conditions.
                </p>
              </div>

              <div className="page-break"></div>

              {/* Follow-up Section */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Follow-up Schedule & Monitoring</h2>
                <div className="text-center p-4 bg-gray-100 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recommended Check-ups</h3>
                  <p className="text-gray-700">{results.followUp.schedule}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Required Tests</h4>
                    <ul className="space-y-2">
                      {results.followUp.tests.map((test, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          <span className="text-sm">{test}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3">Consultations</h4>
                    <ul className="space-y-2">
                      {results.followUp.consultations.map((consultation, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          <span className="text-sm">{consultation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="page-break"></div>

              {/* Tips Section */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Expert Tips for Success</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.tips.map((tip, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <span className="mr-3">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="print-section">
                <h2 className="text-2xl font-bold mb-4">Medical Disclaimer</h2>
                <p className="text-sm italic">
                  This weight loss plan is for informational purposes only and should not replace professional medical
                  advice. Consult with a healthcare provider before starting any weight loss program, especially if you
                  have medical conditions. Individual results may vary. Always seek immediate medical attention if you
                  experience any adverse symptoms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button onClick={resetForm} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Weight Loss Assessment</h1>
            <p className="text-gray-600">Get your personalized weight loss plan with Indian diet recommendations</p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary">AI-Powered</Badge>
              <Badge variant="secondary">Personalized</Badge>
              <Badge variant="secondary">Indian Diet</Badge>
              <Badge variant="secondary">HIPAA Compliant</Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                Comprehensive Health Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter your age"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      placeholder="Enter height in cm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentWeight">Current Weight (kg) *</Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      step="0.1"
                      value={formData.currentWeight}
                      onChange={(e) => handleInputChange("currentWeight", e.target.value)}
                      placeholder="Enter current weight"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetWeight">Target Weight (kg) *</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      step="0.1"
                      value={formData.targetWeight}
                      onChange={(e) => handleInputChange("targetWeight", e.target.value)}
                      placeholder="Enter target weight"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Emergency contact name and phone number"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Health Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Health Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Health Conditions (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {[
                        "Diabetes",
                        "Hypertension",
                        "Thyroid",
                        "PCOS",
                        "Heart Disease",
                        "Arthritis",
                        "High Cholesterol",
                        "Sleep Apnea",
                        "None",
                      ].map((condition) => (
                        <Button
                          key={condition}
                          variant={formData.healthConditions.includes(condition) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleHealthConditionToggle(condition)}
                          className="justify-start"
                        >
                          {condition}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      placeholder="List any medications you're currently taking..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select
                      value={formData.activityLevel}
                      onValueChange={(value) => handleInputChange("activityLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (desk job, no exercise)</SelectItem>
                        <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (physical job + exercise)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Lifestyle Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Lifestyle & Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dietPreference">Diet Preference</Label>
                    <Select
                      value={formData.dietPreference}
                      onValueChange={(value) => handleInputChange("dietPreference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                        <SelectItem value="eggetarian">Eggetarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cuisinePreference">Cuisine Preference</Label>
                    <Select
                      value={formData.cuisinePreference}
                      onValueChange={(value) => handleInputChange("cuisinePreference", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north-indian">North Indian</SelectItem>
                        <SelectItem value="south-indian">South Indian</SelectItem>
                        <SelectItem value="gujarati">Gujarati</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="punjabi">Punjabi</SelectItem>
                        <SelectItem value="maharashtrian">Maharashtrian</SelectItem>
                        <SelectItem value="rajasthani">Rajasthani</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mealsPerDay">Meals per Day</Label>
                    <Select
                      value={formData.mealsPerDay}
                      onValueChange={(value) => handleInputChange("mealsPerDay", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 meals</SelectItem>
                        <SelectItem value="4">4 meals</SelectItem>
                        <SelectItem value="5">5 meals</SelectItem>
                        <SelectItem value="6">6 meals</SelectItem>
                        <SelectItem value="7">7 meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="waterIntake">Water Intake (glasses/day)</Label>
                    <Input
                      id="waterIntake"
                      type="number"
                      value={formData.waterIntake}
                      onChange={(e) => handleInputChange("waterIntake", e.target.value)}
                      placeholder="e.g., 8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepHours">Sleep Hours</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      value={formData.sleepHours}
                      onChange={(e) => handleInputChange("sleepHours", e.target.value)}
                      placeholder="e.g., 7"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeframe">Desired Timeframe</Label>
                    <Select value={formData.timeframe} onValueChange={(value) => handleInputChange("timeframe", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">1 month</SelectItem>
                        <SelectItem value="3-months">3 months</SelectItem>
                        <SelectItem value="6-months">6 months</SelectItem>
                        <SelectItem value="1-year">1 year</SelectItem>
                        <SelectItem value="no-rush">No rush, sustainable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Goals & Motivation */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Goals & Motivation</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="primaryGoal">Primary Goal</Label>
                    <Select
                      value={formData.primaryGoal}
                      onValueChange={(value) => handleInputChange("primaryGoal", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                        <SelectItem value="fitness">Overall Fitness</SelectItem>
                        <SelectItem value="health">Health Improvement</SelectItem>
                        <SelectItem value="confidence">Confidence Building</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="motivation">What motivates you to lose weight?</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => handleInputChange("motivation", e.target.value)}
                      placeholder="Share your motivation and goals..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={generateResults}
                disabled={isLoading || !formData.name || !formData.currentWeight || !formData.targetWeight}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Your Advanced Weight Loss Plan...
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Generate Advanced Weight Loss Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <PoweredByFooter />
    </div>
  )
}
