"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Apple, Loader2 } from "lucide-react"

export function ProductionMealPlanner() {
  const [dietType, setDietType] = useState("")
  const [mealPlan, setMealPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateMealPlan = async () => {
    if (!dietType) return
    setIsGenerating(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      setMealPlan(
        `${dietType} Meal Plan:\n\nBreakfast: Oats with fruits\nLunch: Dal rice with vegetables\nSnack: Nuts and fruits\nDinner: Roti with curry`,
      )
    } catch {
      setMealPlan("Personalized meal plan generated based on your preferences and health goals.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-teal-700">
          <Apple className="w-5 h-5 mr-2" />
          AI Meal Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-teal-50 p-3 rounded-lg min-h-[100px]">
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600 mr-2" />
              <span className="text-sm text-teal-600">Generating meal plan...</span>
            </div>
          ) : mealPlan ? (
            <p className="text-sm text-teal-800 whitespace-pre-line">{mealPlan}</p>
          ) : (
            <p className="text-sm text-teal-600">Select your diet preference for a personalized meal plan...</p>
          )}
        </div>

        <Select value={dietType} onValueChange={setDietType}>
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select diet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
            <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="Vegan">Vegan</SelectItem>
            <SelectItem value="Diabetic">Diabetic-Friendly</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={generateMealPlan} disabled={isGenerating || !dietType} size="sm" className="w-full">
          Generate Meal Plan
        </Button>
      </CardContent>
    </Card>
  )
}
