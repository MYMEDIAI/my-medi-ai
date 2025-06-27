"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyMedLogo from "./mymed-logo"
import {
  Apple,
  Clock,
  Utensils,
  Calculator,
  Droplets,
  Activity,
  Target,
  FileText,
  Coffee,
  Sunset,
  Moon,
} from "lucide-react"

interface UserProfile {
  age: number
  condition: string
  goal: string
}

interface Meal {
  name: string
  foods: string[]
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  sodium: number
  preparation: string
  tips: string[]
}

interface DietPlan {
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
  totalFiber: number
  totalSodium: number
  meals: {
    breakfast: Meal
    morningSnack: Meal
    lunch: Meal
    afternoonSnack: Meal
    dinner: Meal
    eveningSnack?: Meal
  }
  hydration: string[]
  supplements: string[]
  notes: string[]
}

export default function DietPlanGenerator({ userProfile }: { userProfile: UserProfile }) {
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Sample diet plan for 30yo diabetic with weight loss goals
  const generateDietPlan = async (): Promise<DietPlan> => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const plan: DietPlan = {
      totalCalories: 1270,
      totalProtein: 97,
      totalFat: 62,
      totalCarbs: 68,
      totalFiber: 25,
      totalSodium: 1800,
      meals: {
        breakfast: {
          name: "Diabetic-Friendly Power Breakfast",
          foods: ["2 boiled eggs", "1 slice whole-grain toast", "½ avocado", "1 tsp olive oil"],
          calories: 320,
          protein: 18,
          fat: 22,
          carbs: 12,
          fiber: 8,
          sodium: 380,
          preparation:
            "Boil eggs for 8 minutes. Toast whole grain bread. Mash avocado with olive oil and spread on toast. Serve eggs on the side.",
          tips: [
            "Eggs provide complete protein",
            "Avocado offers healthy fats",
            "Whole grains help stable blood sugar",
          ],
        },
        morningSnack: {
          name: "Greek Yogurt Delight",
          foods: ["½ cup plain Greek yogurt", "10 raw almonds", "Cinnamon sprinkle"],
          calories: 150,
          protein: 12,
          fat: 8,
          carbs: 6,
          fiber: 2,
          sodium: 60,
          preparation: "Mix plain Greek yogurt with cinnamon. Serve with almonds on the side.",
          tips: ["High protein keeps you full", "Almonds provide healthy fats", "Cinnamon may help blood sugar"],
        },
        lunch: {
          name: "Grilled Chicken Power Bowl",
          foods: ["100g grilled chicken breast", "½ cup cooked quinoa", "1 cup steamed broccoli", "1 tsp olive oil"],
          calories: 380,
          protein: 35,
          fat: 8,
          carbs: 28,
          fiber: 6,
          sodium: 320,
          preparation:
            "Season chicken with herbs and grill. Cook quinoa according to package directions. Steam broccoli until tender. Drizzle olive oil over vegetables.",
          tips: [
            "Lean protein for muscle maintenance",
            "Quinoa is a complete protein",
            "Broccoli is rich in fiber and nutrients",
          ],
        },
        afternoonSnack: {
          name: "Apple & Almond Butter",
          foods: ["1 medium apple slices", "1 tbsp natural almond butter"],
          calories: 140,
          protein: 4,
          fat: 8,
          carbs: 16,
          fiber: 4,
          sodium: 2,
          preparation: "Slice apple and serve with almond butter for dipping.",
          tips: ["Apple provides fiber and natural sweetness", "Almond butter adds protein and healthy fats"],
        },
        dinner: {
          name: "Omega-3 Salmon Plate",
          foods: ["120g baked salmon", "1 cup roasted asparagus", "1 tsp olive oil", "Lemon juice", "Herbs"],
          calories: 280,
          protein: 28,
          fat: 16,
          carbs: 6,
          fiber: 3,
          sodium: 180,
          preparation:
            "Season salmon with herbs and bake at 400°F for 12-15 minutes. Roast asparagus with olive oil and lemon.",
          tips: [
            "Salmon is rich in omega-3 fatty acids",
            "Asparagus is low-carb and nutrient-dense",
            "Light dinner aids sleep",
          ],
        },
      },
      hydration: [
        "8-10 glasses of water throughout the day",
        "Herbal tea (chamomile, green tea) - no added sugar",
        "Infused water with cucumber and mint",
        "Avoid sugary drinks and fruit juices",
      ],
      supplements: [
        "Vitamin D3 (consult your doctor for dosage)",
        "Omega-3 fish oil (if not eating fish regularly)",
        "Chromium picolinate (may help with blood sugar - doctor approval needed)",
      ],
      notes: [
        "Monitor blood glucose before and after meals to understand food impact",
        "Eat meals at consistent times to help regulate blood sugar",
        "Include protein with each meal to slow carbohydrate absorption",
        "Choose complex carbohydrates over simple sugars",
        "Stay hydrated - dehydration can affect blood sugar levels",
        "Consider portion control - use smaller plates to manage serving sizes",
      ],
    }

    setIsGenerating(false)
    return plan
  }

  const handleGeneratePlan = async () => {
    const plan = await generateDietPlan()
    setSelectedPlan(plan)
  }

  const exportPlan = () => {
    if (!selectedPlan) return

    const reportContent = `
MYMED.AI PERSONALIZED DIET PLAN
Generated: ${new Date().toLocaleDateString()}
Profile: ${userProfile.age}yo, ${userProfile.condition}, Goal: ${userProfile.goal}

DAILY NUTRITION TARGETS:
• Total Calories: ${selectedPlan.totalCalories} kcal
• Protein: ${selectedPlan.totalProtein}g (${Math.round(((selectedPlan.totalProtein * 4) / selectedPlan.totalCalories) * 100)}%)
• Fat: ${selectedPlan.totalFat}g (${Math.round(((selectedPlan.totalFat * 9) / selectedPlan.totalCalories) * 100)}%)
• Carbohydrates: ${selectedPlan.totalCarbs}g (${Math.round(((selectedPlan.totalCarbs * 4) / selectedPlan.totalCalories) * 100)}%)
• Fiber: ${selectedPlan.totalFiber}g
• Sodium: ${selectedPlan.totalSodium}mg

MEAL PLAN:

BREAKFAST - ${selectedPlan.meals.breakfast.name}
${selectedPlan.meals.breakfast.foods.join(", ")}
Calories: ${selectedPlan.meals.breakfast.calories} | Protein: ${selectedPlan.meals.breakfast.protein}g | Fat: ${selectedPlan.meals.breakfast.fat}g | Carbs: ${selectedPlan.meals.breakfast.carbs}g
Preparation: ${selectedPlan.meals.breakfast.preparation}

MORNING SNACK - ${selectedPlan.meals.morningSnack.name}
${selectedPlan.meals.morningSnack.foods.join(", ")}
Calories: ${selectedPlan.meals.morningSnack.calories} | Protein: ${selectedPlan.meals.morningSnack.protein}g | Fat: ${selectedPlan.meals.morningSnack.fat}g | Carbs: ${selectedPlan.meals.morningSnack.carbs}g

LUNCH - ${selectedPlan.meals.lunch.name}
${selectedPlan.meals.lunch.foods.join(", ")}
Calories: ${selectedPlan.meals.lunch.calories} | Protein: ${selectedPlan.meals.lunch.protein}g | Fat: ${selectedPlan.meals.lunch.fat}g | Carbs: ${selectedPlan.meals.lunch.carbs}g
Preparation: ${selectedPlan.meals.lunch.preparation}

AFTERNOON SNACK - ${selectedPlan.meals.afternoonSnack.name}
${selectedPlan.meals.afternoonSnack.foods.join(", ")}
Calories: ${selectedPlan.meals.afternoonSnack.calories} | Protein: ${selectedPlan.meals.afternoonSnack.protein}g | Fat: ${selectedPlan.meals.afternoonSnack.fat}g | Carbs: ${selectedPlan.meals.afternoonSnack.carbs}g

DINNER - ${selectedPlan.meals.dinner.name}
${selectedPlan.meals.dinner.foods.join(", ")}
Calories: ${selectedPlan.meals.dinner.calories} | Protein: ${selectedPlan.meals.dinner.protein}g | Fat: ${selectedPlan.meals.dinner.fat}g | Carbs: ${selectedPlan.meals.dinner.carbs}g
Preparation: ${selectedPlan.meals.dinner.preparation}

HYDRATION:
${selectedPlan.hydration.map((h) => `• ${h}`).join("\n")}

SUPPLEMENTS:
${selectedPlan.supplements.map((s) => `• ${s}`).join("\n")}

IMPORTANT NOTES:
${selectedPlan.notes.map((n) => `• ${n}`).join("\n")}

Powered by MYMED.AI
This plan is for informational purposes only. Consult with your healthcare provider before making significant dietary changes.
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mymed-diet-plan-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!selectedPlan) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <MyMedLogo size="sm" showText={false} />
            <span>AI Diet Plan Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">Your Profile</h3>
            <div className="flex justify-center space-x-6 text-sm">
              <span>
                <strong>Age:</strong> {userProfile.age} years
              </span>
              <span>
                <strong>Condition:</strong> {userProfile.condition}
              </span>
              <span>
                <strong>Goal:</strong> {userProfile.goal}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Personalized Diet Plan Will Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Apple className="w-5 h-5 text-green-600" />
                <span className="text-green-800">Detailed meal plans with macros</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800">Precise calorie and nutrient breakdown</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Utensils className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800">Easy-to-follow preparation instructions</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-purple-800">Condition-specific recommendations</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
          >
            {isGenerating ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Generating Your Custom Plan...
              </>
            ) : (
              <>
                <Apple className="w-4 h-4 mr-2" />
                Generate My Diet Plan
              </>
            )}
          </Button>

          <p className="text-sm text-gray-600">
            Our AI will create a personalized plan based on your health condition and goals
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MyMedLogo size="sm" showText={false} />
            <span>Your Personalized Diet Plan</span>
          </CardTitle>
          <Button onClick={exportPlan} variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Plan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">{selectedPlan.totalCalories}</div>
              <div className="text-sm text-blue-600">Calories</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">{selectedPlan.totalProtein}g</div>
              <div className="text-sm text-green-600">Protein</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-700">{selectedPlan.totalFat}g</div>
              <div className="text-sm text-orange-600">Fat</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">{selectedPlan.totalCarbs}g</div>
              <div className="text-sm text-purple-600">Carbs</div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-700">{selectedPlan.totalFiber}g</div>
              <div className="text-sm text-pink-600">Fiber</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meals">Daily Meals</TabsTrigger>
          <TabsTrigger value="hydration">Hydration & Supplements</TabsTrigger>
          <TabsTrigger value="tips">Expert Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-4">
          {/* Breakfast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <Coffee className="w-5 h-5" />
                <span>Breakfast - {selectedPlan.meals.breakfast.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {selectedPlan.meals.breakfast.calories} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedPlan.meals.breakfast.foods.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="font-semibold text-blue-700">{selectedPlan.meals.breakfast.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-700">{selectedPlan.meals.breakfast.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">{selectedPlan.meals.breakfast.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-700">{selectedPlan.meals.breakfast.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Preparation:</h4>
                <p className="text-gray-700 text-sm">{selectedPlan.meals.breakfast.preparation}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPlan.meals.breakfast.tips.map((tip, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tip}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Morning Snack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Apple className="w-5 h-5" />
                <span>Morning Snack - {selectedPlan.meals.morningSnack.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {selectedPlan.meals.morningSnack.calories} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedPlan.meals.morningSnack.foods.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="font-semibold text-blue-700">{selectedPlan.meals.morningSnack.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-700">{selectedPlan.meals.morningSnack.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">{selectedPlan.meals.morningSnack.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-700">{selectedPlan.meals.morningSnack.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Preparation:</h4>
                <p className="text-gray-700 text-sm">{selectedPlan.meals.morningSnack.preparation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Lunch */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Utensils className="w-5 h-5" />
                <span>Lunch - {selectedPlan.meals.lunch.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {selectedPlan.meals.lunch.calories} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedPlan.meals.lunch.foods.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="font-semibold text-blue-700">{selectedPlan.meals.lunch.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-700">{selectedPlan.meals.lunch.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">{selectedPlan.meals.lunch.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-700">{selectedPlan.meals.lunch.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Preparation:</h4>
                <p className="text-gray-700 text-sm">{selectedPlan.meals.lunch.preparation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Afternoon Snack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Sunset className="w-5 h-5" />
                <span>Afternoon Snack - {selectedPlan.meals.afternoonSnack.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {selectedPlan.meals.afternoonSnack.calories} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedPlan.meals.afternoonSnack.foods.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="font-semibold text-blue-700">{selectedPlan.meals.afternoonSnack.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-700">{selectedPlan.meals.afternoonSnack.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">{selectedPlan.meals.afternoonSnack.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-700">{selectedPlan.meals.afternoonSnack.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Preparation:</h4>
                <p className="text-gray-700 text-sm">{selectedPlan.meals.afternoonSnack.preparation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dinner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-700">
                <Moon className="w-5 h-5" />
                <span>Dinner - {selectedPlan.meals.dinner.name}</span>
                <Badge variant="outline" className="ml-auto">
                  {selectedPlan.meals.dinner.calories} kcal
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedPlan.meals.dinner.foods.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="font-semibold text-blue-700">{selectedPlan.meals.dinner.protein}g</div>
                    <div className="text-xs text-gray-600">Protein</div>
                  </div>
                  <div>
                    <div className="font-semibold text-orange-700">{selectedPlan.meals.dinner.fat}g</div>
                    <div className="text-xs text-gray-600">Fat</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700">{selectedPlan.meals.dinner.carbs}g</div>
                    <div className="text-xs text-gray-600">Carbs</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-700">{selectedPlan.meals.dinner.fiber}g</div>
                    <div className="text-xs text-gray-600">Fiber</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Preparation:</h4>
                <p className="text-gray-700 text-sm">{selectedPlan.meals.dinner.preparation}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hydration" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-700">
                  <Droplets className="w-5 h-5" />
                  <span>Hydration Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPlan.hydration.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <Activity className="w-5 h-5" />
                  <span>Recommended Supplements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPlan.supplements.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Important:</strong> Always consult your healthcare provider before starting any supplements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MyMedLogo size="sm" showText={false} />
                <span>AI Health & Nutrition Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPlan.notes.map((note, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-purple-800 flex items-start space-x-2">
                      <Target className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                      <span>{note}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Meal Timing Tips
                </h4>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Breakfast: Within 1 hour of waking</li>
                  <li>• Morning Snack: 2-3 hours after breakfast</li>
                  <li>• Lunch: 12:00-1:00 PM</li>
                  <li>• Afternoon Snack: 3:00-4:00 PM</li>
                  <li>• Dinner: 6:00-7:00 PM (at least 3 hours before bedtime)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <MyMedLogo size="sm" className="mx-auto mb-2" />
            <p>
              Powered by MYMED.AI • This diet plan is for educational purposes only and does not replace professional
              nutritional advice.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
