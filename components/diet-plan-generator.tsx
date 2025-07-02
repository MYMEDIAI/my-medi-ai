"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Apple,
  Utensils,
  Target,
  Heart,
  Zap,
  Droplets,
  Loader2,
  Download,
  Printer,
  Star,
  CheckCircle,
  TrendingUp,
  Calendar,
  Coffee,
  Sun,
  Moon,
  Sunset,
} from "lucide-react"

interface DietFormData {
  age: string
  gender: string
  height: string
  weight: string
  activityLevel: string
  healthConditions: string[]
  allergies: string
  dietaryPreferences: string
  goals: string
  targetWeight: string
  cookingTime: string
  budget: string
  mealsPerDay: string
  additionalNotes: string
}

interface DietPlan {
  calories: number
  protein: number
  carbs: number
  fats: number
  meals: {
    breakfast: string[]
    lunch: string[]
    dinner: string[]
    snacks: string[]
  }
  supplements: string[]
  tips: string[]
  waterIntake: number
}

export default function DietPlanGenerator() {
  const [formData, setFormData] = useState<DietFormData>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    healthConditions: [],
    allergies: "",
    dietaryPreferences: "",
    goals: "",
    targetWeight: "",
    cookingTime: "",
    budget: "",
    mealsPerDay: "3",
    additionalNotes: "",
  })

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDietPlan = async () => {
    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Calculate BMR and daily calories
    const age = Number.parseInt(formData.age)
    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height)

    let bmr = 0
    if (formData.gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    const multiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers] || 1.2
    let dailyCalories = Math.round(bmr * multiplier)

    // Adjust for goals
    if (formData.goals === "weight_loss") {
      dailyCalories -= 500
    } else if (formData.goals === "weight_gain") {
      dailyCalories += 500
    }

    const protein = Math.round(weight * 2.2) // 2.2g per kg
    const fats = Math.round((dailyCalories * 0.25) / 9) // 25% of calories
    const carbs = Math.round((dailyCalories - protein * 4 - fats * 9) / 4)

    const samplePlan: DietPlan = {
      calories: dailyCalories,
      protein,
      carbs,
      fats,
      meals: {
        breakfast: [
          "Oats with mixed berries and almonds (350 cal)",
          "Greek yogurt with honey and walnuts (280 cal)",
          "Vegetable upma with coconut chutney (320 cal)",
          "Whole wheat toast with avocado (290 cal)",
        ],
        lunch: [
          "Brown rice with dal and mixed vegetables (450 cal)",
          "Quinoa salad with grilled chicken (420 cal)",
          "Roti with paneer curry and salad (480 cal)",
          "Lentil soup with whole grain bread (380 cal)",
        ],
        dinner: [
          "Grilled fish with roasted vegetables (380 cal)",
          "Chicken curry with cauliflower rice (350 cal)",
          "Vegetable stir-fry with tofu (320 cal)",
          "Dal with roti and green vegetables (400 cal)",
        ],
        snacks: [
          "Mixed nuts and dried fruits (150 cal)",
          "Apple with peanut butter (180 cal)",
          "Homemade protein smoothie (200 cal)",
          "Roasted chickpeas (120 cal)",
        ],
      },
      supplements: [
        "Vitamin D3 (2000 IU daily)",
        "Omega-3 fish oil (1000mg daily)",
        "Multivitamin (as per age and gender)",
        "Probiotics (if digestive issues)",
      ],
      tips: [
        "Eat every 3-4 hours to maintain metabolism",
        "Include protein in every meal",
        "Choose complex carbohydrates over simple sugars",
        "Stay hydrated throughout the day",
        "Practice portion control",
        "Include colorful vegetables in every meal",
      ],
      waterIntake: Math.round(weight * 35), // 35ml per kg body weight
    }

    setDietPlan(samplePlan)
    setIsGenerating(false)
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Personalized Diet Plan</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
          .section { margin: 20px 0; padding: 15px; border-radius: 8px; }
          .nutrition { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
          .meals { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
          .tips { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; }
          .meal-item { margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🍎 MyMedi.ai - Personalized Diet Plan</h1>
          <p>Generated for: ${formData.age} year old ${formData.gender}</p>
        </div>
        
        <div class="section nutrition">
          <h2>📊 Daily Nutrition Targets</h2>
          <p><strong>Calories:</strong> ${dietPlan?.calories} kcal</p>
          <p><strong>Protein:</strong> ${dietPlan?.protein}g</p>
          <p><strong>Carbohydrates:</strong> ${dietPlan?.carbs}g</p>
          <p><strong>Fats:</strong> ${dietPlan?.fats}g</p>
          <p><strong>Water:</strong> ${dietPlan?.waterIntake}ml</p>
        </div>
        
        <div class="section meals">
          <h2>🍽️ Meal Plan</h2>
          <h3>Breakfast Options:</h3>
          ${dietPlan?.meals.breakfast.map((meal) => `<div class="meal-item">${meal}</div>`).join("")}
          
          <h3>Lunch Options:</h3>
          ${dietPlan?.meals.lunch.map((meal) => `<div class="meal-item">${meal}</div>`).join("")}
          
          <h3>Dinner Options:</h3>
          ${dietPlan?.meals.dinner.map((meal) => `<div class="meal-item">${meal}</div>`).join("")}
          
          <h3>Snack Options:</h3>
          ${dietPlan?.meals.snacks.map((meal) => `<div class="meal-item">${meal}</div>`).join("")}
        </div>
        
        <div class="section tips">
          <h2>💡 Health Tips</h2>
          ${dietPlan?.tips.map((tip) => `<div class="meal-item">• ${tip}</div>`).join("")}
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownloadPDF = () => {
    const content = `
MyMedi.ai - Personalized Diet Plan
Generated on: ${new Date().toLocaleDateString()}

PERSONAL INFORMATION:
- Age: ${formData.age} years
- Gender: ${formData.gender}
- Height: ${formData.height} cm
- Weight: ${formData.weight} kg
- Activity Level: ${formData.activityLevel}
- Goal: ${formData.goals}

DAILY NUTRITION TARGETS:
- Calories: ${dietPlan?.calories} kcal
- Protein: ${dietPlan?.protein}g
- Carbohydrates: ${dietPlan?.carbs}g
- Fats: ${dietPlan?.fats}g
- Water Intake: ${dietPlan?.waterIntake}ml

MEAL PLAN:

BREAKFAST OPTIONS:
${dietPlan?.meals.breakfast.map((meal) => `• ${meal}`).join("\n")}

LUNCH OPTIONS:
${dietPlan?.meals.lunch.map((meal) => `• ${meal}`).join("\n")}

DINNER OPTIONS:
${dietPlan?.meals.dinner.map((meal) => `• ${meal}`).join("\n")}

SNACK OPTIONS:
${dietPlan?.meals.snacks.map((meal) => `• ${meal}`).join("\n")}

RECOMMENDED SUPPLEMENTS:
${dietPlan?.supplements.map((sup) => `• ${sup}`).join("\n")}

HEALTH TIPS:
${dietPlan?.tips.map((tip) => `• ${tip}`).join("\n")}

---
Generated by MyMedi.ai - AI-Powered Healthcare Platform
Visit: https://mymedi.ai
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Diet-Plan-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isGenerating) {
    return (
      <Card className="border-teal-200 hover:shadow-2xl transition-all duration-500">
        <CardContent className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600 mb-4" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-teal-200 animate-pulse"></div>
          </div>
          <h3 className="text-xl font-bold text-teal-800 mb-2">🧠 AI Nutritionist at Work</h3>
          <p className="text-teal-600 text-center max-w-md">
            Analyzing your profile, calculating nutritional needs, and creating your personalized meal plan...
          </p>
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (dietPlan) {
    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Your Personalized Diet Plan</h2>
                    <p className="text-purple-100">Crafted by AI Nutritionist</p>
                  </div>
                </div>
                <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-30">
                  <Star className="w-3 h-3 mr-1" />
                  Premium Plan
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{dietPlan.calories}</div>
                  <div className="text-sm text-purple-100">Daily Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{dietPlan.protein}g</div>
                  <div className="text-sm text-purple-100">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{dietPlan.carbs}g</div>
                  <div className="text-sm text-purple-100">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{dietPlan.fats}g</div>
                  <div className="text-sm text-purple-100">Healthy Fats</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Plan
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            onClick={() => setDietPlan(null)}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Create New Plan
          </Button>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="meals" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-pink-100">
            <TabsTrigger value="meals" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <Utensils className="w-4 h-4 mr-2" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <Target className="w-4 h-4 mr-2" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger
              value="supplements"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Supplements
            </TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-6">
            {/* Breakfast */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-l-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Coffee className="w-5 h-5 mr-2" />
                  Breakfast Options
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white">300-350 cal</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {dietPlan.meals.breakfast.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-orange-100"
                    >
                      <CheckCircle className="w-4 h-4 text-orange-500 mr-3" />
                      <span className="text-gray-700">{meal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lunch */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Sun className="w-5 h-5 mr-2" />
                  Lunch Options
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white">400-480 cal</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {dietPlan.meals.lunch.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-blue-100"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-3" />
                      <span className="text-gray-700">{meal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dinner */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 border-l-4 border-l-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Moon className="w-5 h-5 mr-2" />
                  Dinner Options
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white">320-400 cal</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {dietPlan.meals.dinner.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-purple-100"
                    >
                      <CheckCircle className="w-4 h-4 text-purple-500 mr-3" />
                      <span className="text-gray-700">{meal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Snacks */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50 border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Sunset className="w-5 h-5 mr-2" />
                  Healthy Snacks
                  <Badge className="ml-auto bg-white bg-opacity-20 text-white">120-200 cal</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3">
                  {dietPlan.meals.snacks.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-green-100"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-gray-700">{meal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Macronutrients */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Daily Targets
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Calories</span>
                    <Badge className="bg-pink-100 text-pink-800">{dietPlan.calories} kcal</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Protein</span>
                    <Badge className="bg-blue-100 text-blue-800">{dietPlan.protein}g</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Carbohydrates</span>
                    <Badge className="bg-green-100 text-green-800">{dietPlan.carbs}g</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-700">Healthy Fats</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{dietPlan.fats}g</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Hydration */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Droplets className="w-5 h-5 mr-2" />
                    Hydration Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-600 mb-2">{dietPlan.waterIntake}ml</div>
                    <p className="text-gray-600 mb-4">Daily Water Intake</p>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-700">
                        💧 Aim for {Math.round(dietPlan.waterIntake / 250)} glasses of water throughout the day
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="supplements" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Recommended Supplements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {dietPlan.supplements.map((supplement, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-emerald-100"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                        <Heart className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{supplement}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Consult with your healthcare provider before starting any new supplements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Expert Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {dietPlan.tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-violet-100"
                    >
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                        <TrendingUp className="w-4 h-4 text-violet-600" />
                      </div>
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Plan generated on {new Date().toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-gray-500">
              This plan is AI-generated and should be used as a guide. Consult with a registered dietitian for
              personalized advice.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="border-teal-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-teal-50 to-blue-50">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center text-white">
          <Apple className="w-5 h-5 mr-2" />
          AI-Powered Diet Plan Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="text-sm font-medium text-gray-700">
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Enter your age"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gender *
            </Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger className="mt-1">
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
            <Label htmlFor="height" className="text-sm font-medium text-gray-700">
              Height (cm) *
            </Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              placeholder="Enter height in cm"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Weight (kg) *
            </Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              placeholder="Enter weight in kg"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="activityLevel" className="text-sm font-medium text-gray-700">
              Activity Level *
            </Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="goals" className="text-sm font-medium text-gray-700">
              Primary Goal *
            </Label>
            <Select value={formData.goals} onValueChange={(value) => setFormData({ ...formData, goals: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Weight Loss</SelectItem>
                <SelectItem value="weight_gain">Weight Gain</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="muscle_gain">Build Muscle</SelectItem>
                <SelectItem value="general_health">General Health</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dietaryPreferences" className="text-sm font-medium text-gray-700">
              Dietary Preferences
            </Label>
            <Select
              value={formData.dietaryPreferences}
              onValueChange={(value) => setFormData({ ...formData, dietaryPreferences: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select dietary preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Ketogenic</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="cookingTime" className="text-sm font-medium text-gray-700">
              Cooking Time Available
            </Label>
            <Select
              value={formData.cookingTime}
              onValueChange={(value) => setFormData({ ...formData, cookingTime: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select cooking time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal (15 min or less)</SelectItem>
                <SelectItem value="moderate">Moderate (15-30 min)</SelectItem>
                <SelectItem value="extended">Extended (30+ min)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">
            Food Allergies & Restrictions
          </Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            placeholder="List any food allergies, intolerances, or foods to avoid..."
            className="mt-1"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
            Additional Notes
          </Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            placeholder="Any specific preferences, health conditions, or requirements..."
            className="mt-1"
            rows={3}
          />
        </div>

        <Button
          onClick={generateDietPlan}
          disabled={
            !formData.age ||
            !formData.gender ||
            !formData.height ||
            !formData.weight ||
            !formData.activityLevel ||
            !formData.goals
          }
          className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          Generate My Personalized Diet Plan
        </Button>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <Zap className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>AI-Powered:</strong> Our advanced AI considers your age, gender, activity level, and goals to
              create a scientifically-backed nutrition plan tailored just for you.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
