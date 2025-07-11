"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Apple,
  Utensils,
  Heart,
  Activity,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Home,
  RotateCcw,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"

interface DietPlan {
  breakfast: string
  lunch: string
  dinner: string
  snacks: string
  tips: string
  calories: string
}

export default function DietPage() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    dietaryRestrictions: "",
    healthGoals: "",
    medicalConditions: "",
    foodPreferences: "",
  })

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const resetDietPlan = () => {
    setDietPlan(null)
    setFormData({
      age: "",
      weight: "",
      height: "",
      gender: "",
      activityLevel: "",
      dietaryRestrictions: "",
      healthGoals: "",
      medicalConditions: "",
      foodPreferences: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateDietPlan = async () => {
    setIsGenerating(true)
    try {
      const dietPrompt = `
Create a personalized Indian diet plan based on the user's profile. The output MUST be a valid JSON object that conforms to the DietPlan interface structure provided below.

---USER DATA---
${JSON.stringify(formData, null, 2)}
---END USER DATA---

---JSON STRUCTURE---
interface DietPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
  tips: string;
  calories: string;
}
---END JSON STRUCTURE---
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: dietPrompt,
          type: "diet",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.response && typeof data.response === "object") {
        setDietPlan(data.response as DietPlan)
      } else {
        throw new Error("Invalid response format from AI")
      }
    } catch (error) {
      console.error("Diet plan generation error:", error)
      // Fallback
      setDietPlan({
        breakfast: "Oats with fruits and nuts, or whole wheat paratha with yogurt",
        lunch: "Brown rice with dal, mixed vegetables, and salad",
        dinner: "Roti with vegetable curry and a bowl of dal",
        snacks: "Fresh fruits, nuts, or healthy homemade snacks",
        tips: "Stay hydrated, eat balanced meals, and maintain regular eating schedule",
        calories: "Consult with a nutritionist for personalized calorie recommendations",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const extractSection = (text: string, keyword: string): string => {
    const lines = text.split("\n")
    let section = ""
    let capturing = false

    for (const line of lines) {
      if (line.toLowerCase().includes(keyword) && (line.includes(":") || line.includes("."))) {
        capturing = true
        section = line
        continue
      }
      if (capturing) {
        if (line.trim() === "" || line.match(/^\d+\./) || line.toLowerCase().includes("lunch|dinner|snack|tip")) {
          if (section.length > 30) break
        }
        section += "\n" + line
      }
    }

    return section.trim() || ""
  }

  const extractCalories = (text: string): string => {
    const calorieMatch = text.match(/(\d{3,4})\s*[-–]\s*(\d{3,4})\s*calories?/i)
    if (calorieMatch) {
      return `${calorieMatch[1]}-${calorieMatch[2]} calories per day`
    }
    const singleCalorieMatch = text.match(/(\d{3,4})\s*calories?/i)
    if (singleCalorieMatch) {
      return `${singleCalorieMatch[1]} calories per day`
    }
    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={resetDietPlan} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Diet Plan
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5" />
                AI-Powered Personalized Diet Planner
                <Badge className="bg-white/20 text-white hover:bg-white/20 ml-auto">
                  <Heart className="w-3 h-3 mr-1" />
                  Indian Nutrition
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!dietPlan ? (
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-50">
                    <Apple className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Get a personalized Indian diet plan based on your health goals, dietary preferences, and medical
                      conditions.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="Enter your age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="Enter your weight"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        placeholder="Enter your height"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select
                      value={formData.activityLevel}
                      onValueChange={(value) => handleInputChange("activityLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                        <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="healthGoals">Health Goals</Label>
                    <Select
                      value={formData.healthGoals}
                      onValueChange={(value) => handleInputChange("healthGoals", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary health goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="weight-gain">Weight Gain</SelectItem>
                        <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Weight Maintenance</SelectItem>
                        <SelectItem value="heart-health">Heart Health</SelectItem>
                        <SelectItem value="diabetes-management">Diabetes Management</SelectItem>
                        <SelectItem value="general-wellness">General Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                    <Select
                      value={formData.dietaryRestrictions}
                      onValueChange={(value) => handleInputChange("dietaryRestrictions", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select any dietary restrictions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No restrictions</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                        <SelectItem value="gluten-free">Gluten-free</SelectItem>
                        <SelectItem value="dairy-free">Dairy-free</SelectItem>
                        <SelectItem value="low-sodium">Low Sodium</SelectItem>
                        <SelectItem value="diabetic">Diabetic-friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="medicalConditions">Medical Conditions (Optional)</Label>
                    <Textarea
                      id="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                      placeholder="List any medical conditions (diabetes, hypertension, thyroid, etc.)"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="foodPreferences">Food Preferences & Allergies</Label>
                    <Textarea
                      id="foodPreferences"
                      value={formData.foodPreferences}
                      onChange={(e) => handleInputChange("foodPreferences", e.target.value)}
                      placeholder="Mention your favorite foods, cuisines, and any allergies"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={generateDietPlan}
                      disabled={
                        isGenerating ||
                        !formData.age ||
                        !formData.weight ||
                        !formData.height ||
                        !formData.gender ||
                        !formData.activityLevel ||
                        !formData.healthGoals
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Generating Diet Plan...
                        </>
                      ) : (
                        <>
                          <Utensils className="w-4 h-4 mr-2" />
                          Generate AI Diet Plan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-green-800">Your Personalized Diet Plan</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-orange-500" />
                          Breakfast
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{dietPlan.breakfast}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Utensils className="h-4 w-4 text-blue-500" />
                          Lunch
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{dietPlan.lunch}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Utensils className="h-4 w-4 text-purple-500" />
                          Dinner
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{dietPlan.dinner}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Apple className="h-4 w-4 text-green-500" />
                          Snacks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{dietPlan.snacks}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-red-500" />
                        Daily Calorie Target
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{dietPlan.calories}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-pink-500" />
                        Nutritional Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{dietPlan.tips}</p>
                    </CardContent>
                  </Card>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      This diet plan is AI-generated for informational purposes. Please consult with a registered
                      dietitian or healthcare provider before making significant dietary changes.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4">
                    <Button onClick={resetDietPlan} variant="outline">
                      Generate New Plan
                    </Button>
                    <Button onClick={() => window.print()}>Print Diet Plan</Button>
                    <Link href="/chat">
                      <Button className="bg-green-600 hover:bg-green-700">Ask AI Nutritionist</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
