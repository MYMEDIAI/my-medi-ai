"use client"

import { useState } from "react"
import Link from "next/link"
import { Scale, TrendingDown, Home, RotateCcw, Printer, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import PoweredByFooter from "@/components/powered-by-footer"

interface WeightLossData {
  name: string
  age: string
  gender: string
  height: string
  currentWeight: string
  targetWeight: string
  healthConditions: string[]
  medications: string
  activityLevel: string
  dietPreference: string
  cuisinePreference: string
  mealsPerDay: string
  waterIntake: string
  sleepHours: string
  timeframe: string
  primaryGoal: string
  motivation: string
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
    improvement: string
  }
  calories: {
    bmr: number
    tdee: number
    deficit: number
    targetDaily: number
    macros: {
      protein: string
      carbs: string
      fats: string
    }
  }
  timeline: {
    weeklyLoss: number
    estimatedWeeks: number
    phases: Array<{ phase: string; focus: string; expectedLoss: string }>
    milestones: Array<{ week: number; weight: number; goal: string; bodyFat: string }>
  }
  dietPlan: {
    breakfast: string[]
    midMorning: string[]
    lunch: string[]
    evening: string[]
    dinner: string[]
    bedtime: string[]
    guidelines: string[]
  }
  exercisePlan: {
    cardio: string[]
    strength: string[]
    flexibility: string[]
    schedule: string
    gymExercises: string[]
    weeklyCalorieBurn: string
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
    tracking: string[]
  }
}

export default function WeightLossPage() {
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
    if (bmi < 18.5) return { category: "Underweight", risk: "Low", improvement: "Weight gain needed" }
    if (bmi < 25) return { category: "Normal", risk: "Low", improvement: "Maintain current weight" }
    if (bmi < 30) return { category: "Overweight", risk: "Moderate", improvement: "Weight loss recommended" }
    return { category: "Obese", risk: "High", improvement: "Significant weight loss needed" }
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
      // Simulate API processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
      const deficit = Math.min(750, Math.max(300, weightToLose * 100))
      const targetDaily = Math.round(tdee - deficit)

      const weeklyLoss = (deficit * 7) / 7700
      const estimatedWeeks = Math.ceil(weightToLose / weeklyLoss)

      // Generate comprehensive results
      const generatedResults: WeightLossResults = {
        bmi: {
          current: currentBMI,
          target: targetBMI,
          category: currentBMIInfo.category,
          risk: currentBMIInfo.risk,
          improvement: currentBMIInfo.improvement,
        },
        calories: {
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          deficit: deficit,
          targetDaily: targetDaily,
          macros: {
            protein: `${Math.round((targetDaily * 0.25) / 4)}g (25% of calories)`,
            carbs: `${Math.round((targetDaily * 0.45) / 4)}g (45% of calories)`,
            fats: `${Math.round((targetDaily * 0.3) / 9)}g (30% of calories)`,
          },
        },
        timeline: {
          weeklyLoss: Number.parseFloat(weeklyLoss.toFixed(1)),
          estimatedWeeks: estimatedWeeks,
          phases: [
            {
              phase: "Phase 1 (Weeks 1-4)",
              focus: "Initial adaptation & habit formation",
              expectedLoss: `${(weeklyLoss * 4).toFixed(1)}kg`,
            },
            {
              phase: "Phase 2 (Weeks 5-12)",
              focus: "Steady fat loss & metabolic adaptation",
              expectedLoss: `${(weeklyLoss * 8).toFixed(1)}kg`,
            },
            {
              phase: "Phase 3 (Final phase)",
              focus: "Goal achievement & maintenance prep",
              expectedLoss: `${(weightToLose - weeklyLoss * 12).toFixed(1)}kg`,
            },
          ],
          milestones: [
            {
              week: 2,
              weight: weight - weeklyLoss * 2,
              goal: "Initial water weight & adaptation",
              bodyFat: "1-2% reduction",
            },
            { week: 4, weight: weight - weeklyLoss * 4, goal: "Habit establishment", bodyFat: "2-3% reduction" },
            { week: 8, weight: weight - weeklyLoss * 8, goal: "Midpoint assessment", bodyFat: "4-6% reduction" },
            { week: 12, weight: weight - weeklyLoss * 12, goal: "Significant progress", bodyFat: "6-8% reduction" },
          ],
        },
        dietPlan: {
          breakfast: [
            "Steel-cut oats with almonds, berries & cinnamon (320 cal)",
            "Vegetable poha with curry leaves & green chutney (280 cal)",
            "Moong dal chilla with spinach & mint chutney (300 cal)",
            "Upma with mixed vegetables & coconut (290 cal)",
            "Quinoa porridge with nuts & seasonal fruits (310 cal)",
            "Besan cheela with vegetables & yogurt (285 cal)",
          ],
          midMorning: [
            "Green tea with 6 soaked almonds (85 cal)",
            "Buttermilk with roasted cumin & mint (65 cal)",
            "Apple with 1 tsp peanut butter (95 cal)",
            "Coconut water with lime (50 cal)",
            "Herbal tea with 2 dates (75 cal)",
            "Cucumber slices with chaat masala (25 cal)",
          ],
          lunch: [
            "Brown rice with dal and vegetables (420 cal)",
            "2 multigrain roti with palak paneer + cucumber raita (380 cal)",
            "Quinoa pulao with vegetables + yogurt (400 cal)",
            "Millet khichdi with ghee + pickle + papad (390 cal)",
            "Vegetable biryani (brown rice) + raita (410 cal)",
            "Rajma with brown rice + green salad (395 cal)",
          ],
          evening: [
            "Masala chai with 2 marie biscuits (110 cal)",
            "Roasted chana with onions & lemon (125 cal)",
            "Green tea with handful of roasted peanuts (95 cal)",
            "Coconut water with chia seeds (60 cal)",
            "Herbal tea with 4-5 cashews (90 cal)",
            "Vegetable soup with herbs (70 cal)",
          ],
          dinner: [
            "Grilled paneer/chicken with sautéed vegetables (320 cal)",
            "Dal with 1 roti + mixed vegetable salad (300 cal)",
            "Fish curry with cauliflower rice (310 cal)",
            "Vegetable soup with quinoa + side salad (280 cal)",
            "Egg curry with 1 roti + cucumber salad (295 cal)",
            "Tofu stir-fry with vegetables (285 cal)",
          ],
          bedtime: [
            "Warm turmeric milk with pinch of black pepper (105 cal)",
            "Chamomile tea with 1 tsp honey (25 cal)",
            "Warm water with lemon & ginger (10 cal)",
            "Golden milk (turmeric latte) with almond milk (80 cal)",
            "Herbal tea blend (5 cal)",
            "Warm water with ajwain (carom seeds) (5 cal)",
          ],
          guidelines: [
            "Eat every 2-3 hours to maintain metabolism",
            "Include protein in every meal for muscle preservation",
            "Drink water before meals to increase satiety",
            "Use smaller plates to control portion sizes",
            "Chew food slowly and mindfully",
            "Stop eating 3 hours before bedtime",
          ],
        },
        exercisePlan: {
          cardio: [
            "Brisk walking 45-60 minutes daily (outdoor preferred)",
            "Cycling 30-45 minutes, 4x per week",
            "Swimming 30-40 minutes, 3x per week",
            "Dancing (Bollywood/Zumba) 30-45 minutes, 3x per week",
            "Stair climbing 15-20 minutes daily",
            "Jogging intervals 20-30 minutes, 3x per week",
          ],
          strength: [
            "Bodyweight exercises: Push-ups, squats, lunges (3x12-15)",
            "Resistance band training full body (3x per week)",
            "Yoga for strength: Power yoga, Ashtanga (45 min, 3x/week)",
            "Light weight training with dumbbells (2-3x per week)",
            "Functional movements: Planks, mountain climbers",
            "Pilates core strengthening (2x per week)",
          ],
          flexibility: [
            "Morning stretching routine (15 minutes daily)",
            "Evening yoga flow (20-30 minutes)",
            "Weekend longer yoga sessions (60 minutes)",
            "Daily mobility exercises for joints",
            "Foam rolling for muscle recovery",
            "Meditation with gentle stretches (15 min daily)",
          ],
          schedule:
            "Mon: Cardio + Upper strength | Tue: Yoga + Walk | Wed: Cardio + Lower strength | Thu: Flexibility + Light cardio | Fri: Full body + Cardio | Sat: Active recovery/sports | Sun: Rest or gentle yoga",
          gymExercises: [
            "Treadmill walking (incline 5-8%) - 20-30 minutes",
            "Elliptical machine - 15-20 minutes moderate pace",
            "Leg press machine - 3 sets x 12-15 reps",
            "Chest press machine - 3 sets x 10-12 reps",
            "Lat pulldown - 3 sets x 10-12 reps",
            "Shoulder press - 3 sets x 8-10 reps",
            "Seated row - 3 sets x 10-12 reps",
            "Leg extension/curl - 2 sets x 12-15 reps each",
          ],
          weeklyCalorieBurn: "1,800-2,500 calories through combined cardio and strength training",
        },
        supplements: [
          "High-quality Multivitamin (Centrum/Revital H) - covers micronutrient gaps",
          "Omega-3 fatty acids (1000mg) - if non-vegetarian diet insufficient",
          "Whey/Plant protein powder (20-30g) - if daily protein target not met",
          "Vitamin D3 (2000-4000 IU) - especially if deficient in blood tests",
          "Probiotics (multi-strain) - for gut health and digestion",
          "Green tea extract (optional) - for metabolism support",
          "Magnesium supplement - for muscle function and sleep",
          "B-Complex vitamins - for energy metabolism support",
        ],
        tips: [
          "Drink 500ml water before meals to feel fuller",
          "Use smaller plates to control portions",
          "Include protein in every meal",
          "Plan and prep meals in advance",
          "Track your progress weekly, not daily",
          "Get 7-8 hours of quality sleep",
          "Manage stress through meditation",
          "Stay consistent rather than perfect",
          "Eat slowly and mindfully",
          "Include fiber-rich foods in every meal",
        ],
        riskAssessment: {
          level: currentBMI > 35 ? "Very High" : currentBMI > 30 ? "High" : currentBMI > 25 ? "Moderate" : "Low",
          factors: [
            ...(currentBMI > 30 ? [`BMI ${currentBMI.toFixed(1)} indicates obesity`] : []),
            ...(age > 50 ? ["Age over 50 years"] : []),
            ...formData.healthConditions.filter((c) => c !== "None"),
          ],
          recommendations: [
            ...(currentBMI > 35 ? ["Immediate medical supervision required"] : []),
            ...(formData.healthConditions.includes("Diabetes") ? ["Blood glucose monitoring essential"] : []),
            ...(formData.healthConditions.includes("Heart Disease") ? ["Cardiac clearance required"] : []),
            "Regular health monitoring during weight loss",
          ],
        },
        followUp: {
          schedule: currentBMI > 35 ? "Every 2 weeks" : currentBMI > 30 ? "Monthly" : "Every 6 weeks",
          tests: [
            "Complete Blood Count (CBC) - monitor for anemia, infection",
            "Comprehensive Metabolic Panel - kidney, liver function",
            "Lipid Profile (Total, HDL, LDL, Triglycerides)",
            "HbA1c & Fasting Blood Sugar - diabetes screening",
            "Thyroid Function Test (TSH, T3, T4)",
            "Vitamin D3, B12, Iron levels",
            "Inflammatory markers (CRP) if indicated",
            "Body composition analysis (DEXA scan recommended)",
          ],
          consultations: [
            "Registered Dietitian - personalized meal planning & adjustments",
            "Certified Personal Trainer - exercise form & progression",
            "Primary Care Physician - overall health monitoring",
            "Endocrinologist (if diabetic/thyroid issues)",
            "Mental Health Counselor - psychological support if needed",
            "Physiotherapist (if joint/mobility issues)",
          ],
          tracking: [
            "Daily weight measurements (same time, same conditions)",
            "Weekly body measurements (waist, hips, arms)",
            "Food diary with calorie tracking",
            "Exercise log with duration and intensity",
            "Sleep quality and duration tracking",
            "Energy levels and mood monitoring",
          ],
        },
      }

      setResults(generatedResults)
    } catch (error) {
      console.error("Error generating results:", error)
      // Show user-friendly error message
      alert("There was an error generating your plan. Please try again.")
    } finally {
      setIsLoading(false)
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
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (results) {
    return (
      <div className="min-h-screen bg-white">
        <style jsx global>{`
        .print-format {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.5in;
          font-family: 'Times New Roman', serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: white;
        }
        .print-header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .print-section {
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .print-section h2 {
          font-size: 14px;
          font-weight: bold;
          margin: 10px 0 8px 0;
          color: #000;
          border-bottom: 1px solid #333;
          padding-bottom: 2px;
        }
        .print-section h3 {
          font-size: 12px;
          font-weight: bold;
          margin: 8px 0 4px 0;
          color: #333;
        }
        .print-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        .print-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }
        .print-grid-4 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 6px;
          margin-bottom: 10px;
        }
        .print-card {
          border: 1px solid #333;
          padding: 8px;
          background: #f9f9f9;
        }
        .print-list {
          margin: 4px 0;
          padding-left: 15px;
        }
        .print-list li {
          margin-bottom: 2px;
          font-size: 11px;
        }
        .highlight {
          background: #e6f3ff;
          padding: 2px 4px;
          border-radius: 2px;
          font-weight: bold;
        }
        .patient-info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 11px;
        }
        .no-print {
          display: none;
        }
        @media screen {
          .no-print {
            display: block;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
          }
        }
        @media print {
          .no-print { display: none !important; }
          .print-format { margin: 0; padding: 0.3in; }
        }
      `}</style>

        {/* Action Buttons - Only visible on screen */}
        <div className="no-print">
          <div className="flex gap-2 bg-white p-4 rounded-lg shadow-lg">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
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
              New Plan
            </Button>
          </div>
        </div>

        <div className="print-format">
          {/* Medical Report Header */}
          <div className="print-header">
            <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 5px 0" }}>
              COMPREHENSIVE WEIGHT LOSS PLAN
            </h1>
            <p style={{ fontSize: "12px", margin: "0" }}>Personalized Medical Assessment & Treatment Plan</p>
            <p style={{ fontSize: "10px", margin: "5px 0 0 0" }}>
              Generated by MYMED.AI | Date: {new Date().toLocaleDateString()} | Plan ID: WL-
              {Date.now().toString().slice(-6)}
            </p>
          </div>

          {/* Patient Information */}
          <div className="print-section">
            <h2>PATIENT INFORMATION</h2>
            <div className="patient-info">
              <div>
                <strong>Name:</strong> {formData.name}
                <br />
                <strong>Age:</strong> {formData.age} years
                <br />
                <strong>Gender:</strong> {formData.gender}
                <br />
                <strong>Height:</strong> {formData.height} cm
              </div>
              <div>
                <strong>Current Weight:</strong> {formData.currentWeight} kg
                <br />
                <strong>Target Weight:</strong> {formData.targetWeight} kg
                <br />
                <strong>Weight to Lose:</strong>{" "}
                {(Number(formData.currentWeight) - Number(formData.targetWeight)).toFixed(1)} kg
                <br />
                <strong>Activity Level:</strong> {formData.activityLevel}
              </div>
              <div>
                <strong>Diet Preference:</strong> {formData.dietPreference}
                <br />
                <strong>Cuisine:</strong> {formData.cuisinePreference}
                <br />
                <strong>Health Conditions:</strong> {formData.healthConditions.join(", ") || "None reported"}
                <br />
                <strong>Sleep:</strong> {formData.sleepHours} hours/night
              </div>
            </div>
          </div>

          {/* Clinical Assessment */}
          <div className="print-section">
            <h2>CLINICAL ASSESSMENT & METABOLIC ANALYSIS</h2>
            <div className="print-grid-4">
              <div className="print-card">
                <h3>Current BMI</h3>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#d97706" }}>
                  {results.bmi.current.toFixed(1)}
                </div>
                <div style={{ fontSize: "10px" }}>{results.bmi.category}</div>
                <div style={{ fontSize: "10px" }}>Risk: {results.bmi.risk}</div>
              </div>
              <div className="print-card">
                <h3>Target BMI</h3>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#059669" }}>
                  {results.bmi.target.toFixed(1)}
                </div>
                <div style={{ fontSize: "10px" }}>Healthy Range</div>
                <div style={{ fontSize: "10px" }}>{results.bmi.improvement}</div>
              </div>
              <div className="print-card">
                <h3>Daily Calories</h3>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#dc2626" }}>
                  {results.calories.targetDaily}
                </div>
                <div style={{ fontSize: "10px" }}>For weight loss</div>
                <div style={{ fontSize: "10px" }}>Deficit: {results.calories.deficit} cal</div>
              </div>
              <div className="print-card">
                <h3>Timeline</h3>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: "#7c3aed" }}>
                  {results.timeline.estimatedWeeks}w
                </div>
                <div style={{ fontSize: "10px" }}>{results.timeline.weeklyLoss} kg/week</div>
                <div style={{ fontSize: "10px" }}>Safe rate</div>
              </div>
            </div>

            <div className="print-grid">
              <div>
                <h3>Metabolic Parameters</h3>
                <ul className="print-list">
                  <li>
                    <strong>Basal Metabolic Rate (BMR):</strong> {results.calories.bmr} calories/day
                  </li>
                  <li>
                    <strong>Total Daily Energy Expenditure:</strong> {results.calories.tdee} calories/day
                  </li>
                  <li>
                    <strong>Recommended Caloric Deficit:</strong> {results.calories.deficit} calories/day
                  </li>
                  <li>
                    <strong>Weekly Calorie Burn (Exercise):</strong> {results.exercisePlan.weeklyCalorieBurn}
                  </li>
                </ul>
              </div>
              <div>
                <h3>Macronutrient Distribution</h3>
                <ul className="print-list">
                  <li>
                    <strong>Protein:</strong> {results.calories.macros.protein} - Essential for muscle preservation
                  </li>
                  <li>
                    <strong>Carbohydrates:</strong> {results.calories.macros.carbs} - Primary energy source
                  </li>
                  <li>
                    <strong>Healthy Fats:</strong> {results.calories.macros.fats} - Hormone production & satiety
                  </li>
                  <li>
                    <strong>Fiber Target:</strong> 25-30g daily for digestive health
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="print-section">
            <h2>TREATMENT TIMELINE & EXPECTED OUTCOMES</h2>
            <div className="print-grid-3">
              {results.timeline.phases.map((phase, index) => (
                <div key={index} className="print-card">
                  <h3>{phase.phase}</h3>
                  <div style={{ fontSize: "10px", marginBottom: "4px" }}>
                    <strong>Focus:</strong> {phase.focus}
                  </div>
                  <div className="highlight" style={{ fontSize: "10px" }}>
                    Expected Loss: {phase.expectedLoss}
                  </div>
                </div>
              ))}
            </div>

            <h3>Key Milestones & Progress Markers</h3>
            <div className="print-grid">
              {results.timeline.milestones.slice(0, 4).map((milestone, index) => (
                <div
                  key={index}
                  style={{ border: "1px solid #ccc", padding: "6px", fontSize: "10px", marginBottom: "4px" }}
                >
                  <strong>Week {milestone.week}:</strong> Target {milestone.weight.toFixed(1)} kg | {milestone.goal} |{" "}
                  {milestone.bodyFat}
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Prescription */}
          <div className="print-section">
            <h2>PERSONALIZED DIETARY PRESCRIPTION</h2>

            <div className="print-grid">
              <div>
                <h3>Morning Protocol (6:00 AM - 12:00 PM)</h3>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                  Breakfast Options (280-320 cal):
                </div>
                <ul className="print-list">
                  {results.dietPlan.breakfast.slice(0, 2).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                  Mid-Morning (65-90 cal):
                </div>
                <ul className="print-list">
                  {results.dietPlan.midMorning.slice(0, 2).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Afternoon Protocol (12:00 PM - 6:00 PM)</h3>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                  Lunch Options (350-420 cal):
                </div>
                <ul className="print-list">
                  {results.dietPlan.lunch.slice(0, 2).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                  Evening Snack (95-125 cal):
                </div>
                <ul className="print-list">
                  {results.dietPlan.evening.slice(0, 2).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="print-grid">
              <div>
                <h3>Evening Protocol (6:00 PM - 10:00 PM)</h3>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                  Dinner Options (270-350 cal):
                </div>
                <ul className="print-list">
                  {results.dietPlan.dinner.slice(0, 2).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Bedtime (5-105 cal):</div>
                <ul className="print-list">
                  {results.dietPlan.bedtime.slice(0, 2).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Dietary Guidelines & Compliance</h3>
                <ul className="print-list">
                  {results.dietPlan.guidelines.map((guideline, index) => (
                    <li key={index}>{guideline}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Exercise Prescription */}
          <div className="print-section">
            <h2>EXERCISE PRESCRIPTION & PHYSICAL ACTIVITY PLAN</h2>

            <div className="print-grid-3">
              <div>
                <h3>Cardiovascular Training</h3>
                <ul className="print-list">
                  {results.exercisePlan.cardio.slice(0, 3).map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Resistance Training</h3>
                <ul className="print-list">
                  {results.exercisePlan.strength.slice(0, 3).map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Flexibility & Recovery</h3>
                <ul className="print-list">
                  {results.exercisePlan.flexibility.slice(0, 3).map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </div>

            <h3>Structured Gym Protocol</h3>
            <div className="print-grid">
              {results.exercisePlan.gymExercises.slice(0, 8).map((exercise, index) => (
                <div
                  key={index}
                  style={{ border: "1px solid #ddd", padding: "4px", fontSize: "10px", marginBottom: "2px" }}
                >
                  {exercise}
                </div>
              ))}
            </div>

            <div className="print-card" style={{ marginTop: "8px" }}>
              <h3>Weekly Training Schedule</h3>
              <div style={{ fontSize: "11px" }}>{results.exercisePlan.schedule}</div>
            </div>
          </div>

          {/* Supplementation & Monitoring */}
          <div className="print-section">
            <h2>SUPPLEMENTATION PROTOCOL & HEALTH MONITORING</h2>

            <div className="print-grid">
              <div>
                <h3>Recommended Supplements</h3>
                <ul className="print-list">
                  {results.supplements.slice(0, 6).map((supplement, index) => (
                    <li key={index}>{supplement}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Clinical Success Strategies</h3>
                <ul className="print-list">
                  {results.tips.slice(0, 6).map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Risk Assessment & Follow-up */}
          <div className="print-section">
            <h2>RISK ASSESSMENT & FOLLOW-UP PROTOCOL</h2>

            <div className="print-grid">
              <div>
                <div
                  className="print-card"
                  style={{
                    background:
                      results.riskAssessment.level === "High" || results.riskAssessment.level === "Very High"
                        ? "#fef2f2"
                        : results.riskAssessment.level === "Moderate"
                          ? "#fefce8"
                          : "#f0fdf4",
                  }}
                >
                  <h3>Risk Level: {results.riskAssessment.level}</h3>
                  <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Risk Factors:</div>
                  <ul className="print-list">
                    {results.riskAssessment.factors.slice(0, 4).map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                  {results.riskAssessment.recommendations.length > 0 && (
                    <>
                      <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Recommendations:</div>
                      <ul className="print-list">
                        {results.riskAssessment.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <div>
                <h3>Follow-up Schedule: {results.followUp.schedule}</h3>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                  Required Laboratory Tests:
                </div>
                <ul className="print-list">
                  {results.followUp.tests.slice(0, 4).map((test, index) => (
                    <li key={index}>{test}</li>
                  ))}
                </ul>
                <div style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>Daily Monitoring:</div>
                <ul className="print-list">
                  {results.followUp.tracking.slice(0, 4).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Professional Consultations */}
          <div className="print-section">
            <h2>RECOMMENDED PROFESSIONAL CONSULTATIONS</h2>
            <div className="print-grid">
              {results.followUp.consultations.slice(0, 6).map((consultation, index) => (
                <div
                  key={index}
                  style={{ border: "1px solid #ddd", padding: "6px", fontSize: "10px", marginBottom: "4px" }}
                >
                  <strong>{consultation.split(" - ")[0]}:</strong>{" "}
                  {consultation.split(" - ")[1] || "As needed based on progress"}
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="print-section">
            <div className="print-card" style={{ background: "#fef2f2", border: "2px solid #dc2626" }}>
              <h3>MEDICAL DISCLAIMER & IMPORTANT SAFETY INFORMATION</h3>
              <div style={{ fontSize: "10px", lineHeight: "1.3" }}>
                <strong>IMPORTANT:</strong> This AI-generated weight loss plan is for informational and educational
                purposes only and does not constitute medical advice. This plan should not replace consultation with
                qualified healthcare professionals. Individual results may vary significantly based on genetics, medical
                history, adherence, and other factors. <strong>SEEK IMMEDIATE MEDICAL ATTENTION</strong> if you
                experience chest pain, severe shortness of breath, dizziness, fainting, or any concerning symptoms
                during this program. Consult your physician before starting this or any weight loss program, especially
                if you have pre-existing medical conditions, take medications, or are pregnant/nursing. Regular medical
                monitoring is recommended throughout your weight loss journey.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              fontSize: "10px",
              marginTop: "20px",
              borderTop: "1px solid #333",
              paddingTop: "10px",
            }}
          >
            <strong>MYMED.AI - Advanced Healthcare Technology</strong>
            <br />
            Plan Generated: {new Date().toLocaleString()} | Version: 2.1 | For: {formData.name}
            <br />
            This document contains {results.timeline.estimatedWeeks} weeks of personalized recommendations based on
            current health data.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/images/mymedi-logo.png" alt="MyMedi.ai" className="h-8 w-8 mr-3" />
            <span className="text-xl font-bold text-green-600">MyMedi.ai</span>
          </div>
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
              <Badge variant="secondary">Medical Grade</Badge>
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
