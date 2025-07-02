"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"
import {
  Baby,
  Heart,
  Activity,
  Apple,
  Stethoscope,
  FileText,
  AlertTriangle,
  Pill,
  Camera,
  Coffee,
  Utensils,
  Moon,
  Sun,
  Droplets,
  Shield,
  Smile,
  Brain,
  Star,
  Phone,
} from "lucide-react"

interface PregnancyData {
  lastPeriodDate: string
  expectedDeliveryDate: string
  currentWeek: number
  currentTrimester: number
  babyName: string
  motherAge: number
  weight: number
  height: number
  bloodType: string
  complications: string[]
}

interface BabyData {
  name: string
  birthDate: string
  birthWeight: number
  birthHeight: number
  bloodType: string
  ageInDays: number
  ageInWeeks: number
  ageInMonths: number
  currentWeight: number
  currentHeight: number
  vaccinations: VaccinationRecord[]
  milestones: Milestone[]
}

interface VaccinationRecord {
  id: string
  name: string
  dueDate: string
  givenDate?: string
  status: "due" | "given" | "overdue"
  notes?: string
}

interface Milestone {
  id: string
  name: string
  expectedAge: string
  achievedDate?: string
  status: "pending" | "achieved" | "delayed"
  description: string
}

interface DietPlan {
  day: string
  breakfast: MealDetail
  morningSnack: MealDetail
  lunch: MealDetail
  afternoonSnack: MealDetail
  dinner: MealDetail
  eveningSnack: MealDetail
  totalCalories: number
  totalProtein: number
  totalFiber: number
  hydration: string[]
  supplements: string[]
  avoidFoods: string[]
}

interface MealDetail {
  name: string
  ingredients: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  preparation: string
  benefits: string[]
}

export default function PregnancyPage() {
  const [activeTab, setActiveTab] = useState("pregnancy")
  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({
    lastPeriodDate: "",
    expectedDeliveryDate: "",
    currentWeek: 0,
    currentTrimester: 1,
    babyName: "",
    motherAge: 25,
    weight: 60,
    height: 160,
    bloodType: "",
    complications: [],
  })

  const [babyData, setBabyData] = useState<BabyData>({
    name: "",
    birthDate: "",
    birthWeight: 0,
    birthHeight: 0,
    bloodType: "",
    ageInDays: 0,
    ageInWeeks: 0,
    ageInMonths: 0,
    currentWeight: 0,
    currentHeight: 0,
    vaccinations: [],
    milestones: [],
  })

  const [weeklyDietPlan, setWeeklyDietPlan] = useState<DietPlan[]>([])
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(1)

  // Calculate pregnancy details
  useEffect(() => {
    if (pregnancyData.lastPeriodDate) {
      const lastPeriod = new Date(pregnancyData.lastPeriodDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - lastPeriod.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const currentWeek = Math.floor(diffDays / 7)
      const currentTrimester = currentWeek <= 12 ? 1 : currentWeek <= 28 ? 2 : 3

      // Calculate expected delivery date (280 days from last period)
      const expectedDelivery = new Date(lastPeriod)
      expectedDelivery.setDate(expectedDelivery.getDate() + 280)

      setPregnancyData((prev) => ({
        ...prev,
        currentWeek,
        currentTrimester,
        expectedDeliveryDate: expectedDelivery.toISOString().split("T")[0],
      }))
    }
  }, [pregnancyData.lastPeriodDate])

  // Calculate baby age
  useEffect(() => {
    if (babyData.birthDate) {
      const birthDate = new Date(babyData.birthDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - birthDate.getTime())
      const ageInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const ageInWeeks = Math.floor(ageInDays / 7)
      const ageInMonths = Math.floor(ageInDays / 30)

      setBabyData((prev) => ({
        ...prev,
        ageInDays,
        ageInWeeks,
        ageInMonths,
      }))
    }
  }, [babyData.birthDate])

  const generateWeeklyDietPlan = async () => {
    setIsGeneratingDiet(true)
    try {
      // Generate comprehensive weekly diet plan
      const weeklyPlan: DietPlan[] = []

      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

      for (let i = 0; i < 7; i++) {
        const dayPlan: DietPlan = {
          day: days[i],
          breakfast: {
            name: "Pregnancy Power Breakfast",
            ingredients: ["2 whole grain toast", "1 boiled egg", "1 cup milk", "1 banana", "1 tsp ghee"],
            calories: 420,
            protein: 18,
            carbs: 45,
            fat: 15,
            fiber: 6,
            preparation: "Toast bread, boil egg, slice banana, warm milk with a pinch of turmeric",
            benefits: ["Folic acid", "Protein for baby growth", "Calcium for bones", "Iron for blood"],
          },
          morningSnack: {
            name: "Fruit & Nuts Mix",
            ingredients: ["1 apple", "10 almonds", "5 dates", "1 glass buttermilk"],
            calories: 280,
            protein: 8,
            carbs: 35,
            fat: 12,
            fiber: 5,
            preparation: "Slice apple, soak almonds overnight, remove date seeds, fresh buttermilk",
            benefits: ["Natural sugars", "Healthy fats", "Probiotics", "Vitamin E"],
          },
          lunch: {
            name: "Complete Indian Thali",
            ingredients: [
              "1 cup brown rice",
              "1 cup dal (lentils)",
              "1 cup mixed vegetables",
              "1 roti",
              "1 cup curd",
              "Green salad",
            ],
            calories: 650,
            protein: 25,
            carbs: 85,
            fat: 18,
            fiber: 12,
            preparation:
              "Cook rice and dal with turmeric. Prepare mixed vegetable curry. Make fresh roti. Serve with curd and salad",
            benefits: ["Complete proteins", "Complex carbs", "Probiotics", "Fiber for digestion"],
          },
          afternoonSnack: {
            name: "Healthy Smoothie",
            ingredients: ["1 cup spinach", "1 banana", "1 cup milk", "1 tsp honey", "1 tsp flax seeds"],
            calories: 220,
            protein: 10,
            carbs: 28,
            fat: 8,
            fiber: 4,
            preparation: "Blend all ingredients until smooth. Add ice if desired",
            benefits: ["Iron from spinach", "Omega-3 from flax", "Natural sweetness", "Folate"],
          },
          dinner: {
            name: "Light & Nutritious Dinner",
            ingredients: ["1 cup quinoa", "100g grilled chicken/paneer", "1 cup steamed broccoli", "1 tsp olive oil"],
            calories: 480,
            protein: 32,
            carbs: 45,
            fat: 16,
            fiber: 8,
            preparation: "Cook quinoa, grill protein, steam broccoli, drizzle olive oil",
            benefits: ["Complete amino acids", "Low glycemic index", "Vitamin K", "Lean protein"],
          },
          eveningSnack: {
            name: "Warm Milk & Cookies",
            ingredients: ["1 cup warm milk", "2 oat cookies", "1 tsp turmeric", "1 tsp honey"],
            calories: 200,
            protein: 8,
            carbs: 25,
            fat: 8,
            fiber: 2,
            preparation: "Warm milk with turmeric and honey, serve with homemade oat cookies",
            benefits: ["Better sleep", "Anti-inflammatory", "Calcium", "Comfort food"],
          },
          totalCalories: 2250,
          totalProtein: 101,
          totalFiber: 37,
          hydration: [
            "8-10 glasses of water",
            "2 cups herbal tea (ginger, mint)",
            "1 glass fresh fruit juice",
            "1 glass coconut water",
          ],
          supplements: [
            "Folic acid 400mcg",
            "Iron 30mg (with Vitamin C)",
            "Calcium 1000mg",
            "Vitamin D3 600 IU",
            "Omega-3 DHA 200mg",
          ],
          avoidFoods: [
            "Raw fish and meat",
            "Unpasteurized dairy",
            "High mercury fish",
            "Alcohol and smoking",
            "Excessive caffeine",
            "Raw sprouts",
          ],
        }

        // Vary meals for different days
        if (i === 1) {
          dayPlan.breakfast.name = "South Indian Breakfast"
          dayPlan.breakfast.ingredients = ["2 idli", "1 cup sambar", "1 tbsp coconut chutney", "1 glass milk"]
        } else if (i === 2) {
          dayPlan.breakfast.name = "Paratha Breakfast"
          dayPlan.breakfast.ingredients = ["1 stuffed paratha", "1 cup curd", "1 tsp pickle", "1 glass lassi"]
        } else if (i === 3) {
          dayPlan.breakfast.name = "Poha Breakfast"
          dayPlan.breakfast.ingredients = ["1 cup poha", "1 boiled egg", "1 cup tea", "1 orange"]
        }

        weeklyPlan.push(dayPlan)
      }

      setWeeklyDietPlan(weeklyPlan)
    } catch (error) {
      console.error("Diet plan generation error:", error)
    } finally {
      setIsGeneratingDiet(false)
    }
  }

  const pregnancyVaccinations = [
    { name: "Tetanus Toxoid (TT1)", week: "16-20", importance: "Prevents tetanus in mother and baby" },
    { name: "Tetanus Toxoid (TT2)", week: "20-24", importance: "Booster dose for complete protection" },
    { name: "Influenza Vaccine", week: "Any time", importance: "Protects against seasonal flu" },
    { name: "Tdap Vaccine", week: "27-36", importance: "Protects baby from whooping cough" },
    { name: "COVID-19 Vaccine", week: "Any time", importance: "Safe during pregnancy, protects mother and baby" },
  ]

  const pregnancyTests = [
    { name: "Blood Group & Rh Factor", trimester: 1, frequency: "Once", importance: "Detect Rh incompatibility" },
    { name: "Complete Blood Count", trimester: 1, frequency: "Every trimester", importance: "Check for anemia" },
    { name: "Urine Test", trimester: 1, frequency: "Monthly", importance: "Detect infections, protein" },
    { name: "Blood Sugar Test", trimester: 2, frequency: "24-28 weeks", importance: "Screen for gestational diabetes" },
    { name: "Ultrasound Scan", trimester: 1, frequency: "3-4 times", importance: "Monitor baby development" },
    { name: "Thyroid Function", trimester: 1, frequency: "Once", importance: "Check thyroid levels" },
    { name: "HIV/Hepatitis B", trimester: 1, frequency: "Once", importance: "Prevent mother-to-child transmission" },
  ]

  const babyVaccinations = [
    { name: "BCG", age: "At birth", protects: "Tuberculosis", side_effects: "Mild fever, swelling at injection site" },
    { name: "Hepatitis B", age: "At birth, 1-2 months, 6 months", protects: "Hepatitis B", side_effects: "Mild pain" },
    {
      name: "DPT",
      age: "2, 4, 6 months",
      protects: "Diphtheria, Pertussis, Tetanus",
      side_effects: "Fever, irritability",
    },
    { name: "Polio (OPV/IPV)", age: "2, 4, 6 months", protects: "Poliomyelitis", side_effects: "Very rare" },
    { name: "Hib", age: "2, 4, 6 months", protects: "Haemophilus influenzae", side_effects: "Mild fever" },
    { name: "Pneumococcal", age: "2, 4, 6 months", protects: "Pneumonia, Meningitis", side_effects: "Local swelling" },
    { name: "Rotavirus", age: "2, 4, 6 months", protects: "Severe diarrhea", side_effects: "Mild diarrhea" },
    { name: "MMR", age: "12-15 months", protects: "Measles, Mumps, Rubella", side_effects: "Mild rash, fever" },
    { name: "Varicella", age: "12-15 months", protects: "Chickenpox", side_effects: "Mild rash" },
    { name: "Hepatitis A", age: "12-23 months", protects: "Hepatitis A", side_effects: "Mild pain" },
  ]

  const babyMilestones = [
    { age: "1 month", physical: "Lifts head briefly", social: "Makes eye contact", cognitive: "Responds to sounds" },
    {
      age: "2 months",
      physical: "Holds head up",
      social: "Smiles responsively",
      cognitive: "Follows objects with eyes",
    },
    { age: "3 months", physical: "Pushes up on arms", social: "Laughs", cognitive: "Recognizes familiar faces" },
    { age: "4 months", physical: "Rolls over", social: "Enjoys social play", cognitive: "Reaches for toys" },
    {
      age: "6 months",
      physical: "Sits without support",
      social: "Stranger anxiety begins",
      cognitive: "Explores with mouth",
    },
    { age: "9 months", physical: "Crawls", social: "Plays peek-a-boo", cognitive: "Object permanence develops" },
    { age: "12 months", physical: "Walks with support", social: "Waves bye-bye", cognitive: "Says first words" },
    { age: "18 months", physical: "Walks independently", social: "Parallel play", cognitive: "50+ words vocabulary" },
    { age: "24 months", physical: "Runs, jumps", social: "Plays with others", cognitive: "2-word sentences" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <NavigationButtons showReset={false} />
        </div>
      </header>

      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-pink-900 mb-4">Pregnancy & Baby Care Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI-powered pregnancy tracking and baby care guidance for Indian families
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pregnancy" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Pregnancy Care</span>
              </TabsTrigger>
              <TabsTrigger value="baby" className="flex items-center space-x-2">
                <Baby className="w-4 h-4" />
                <span>Baby Care</span>
              </TabsTrigger>
            </TabsList>

            {/* PREGNANCY TAB */}
            <TabsContent value="pregnancy" className="space-y-6">
              {/* Pregnancy Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span>Pregnancy Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="lastPeriod">Last Menstrual Period Date</Label>
                        <Input
                          id="lastPeriod"
                          type="date"
                          value={pregnancyData.lastPeriodDate}
                          onChange={(e) => setPregnancyData((prev) => ({ ...prev, lastPeriodDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="motherAge">Mother's Age</Label>
                        <Input
                          id="motherAge"
                          type="number"
                          value={pregnancyData.motherAge}
                          onChange={(e) => setPregnancyData((prev) => ({ ...prev, motherAge: Number(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Select
                          value={pregnancyData.bloodType}
                          onValueChange={(value) => setPregnancyData((prev) => ({ ...prev, bloodType: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {pregnancyData.lastPeriodDate && (
                      <div className="space-y-4">
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                          <h3 className="font-semibold text-pink-900 mb-3">Pregnancy Progress</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Current Week:</span>
                              <Badge className="bg-pink-100 text-pink-800">{pregnancyData.currentWeek} weeks</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Trimester:</span>
                              <Badge className="bg-purple-100 text-purple-800">
                                {pregnancyData.currentTrimester}
                                {pregnancyData.currentTrimester === 1
                                  ? "st"
                                  : pregnancyData.currentTrimester === 2
                                    ? "nd"
                                    : "rd"}{" "}
                                Trimester
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Expected Delivery:</span>
                              <span className="font-semibold text-pink-700">
                                {new Date(pregnancyData.expectedDeliveryDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{Math.round((pregnancyData.currentWeek / 40) * 100)}%</span>
                              </div>
                              <Progress value={(pregnancyData.currentWeek / 40) * 100} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Doctor Checkups */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    <span>Doctor Checkup Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-700">First Trimester (1-12 weeks)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Frequency:</strong> Every 4 weeks
                        </div>
                        <div className="text-sm">
                          <strong>Key Checkups:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Confirm pregnancy</li>
                            <li>Initial blood tests</li>
                            <li>First ultrasound (6-8 weeks)</li>
                            <li>Genetic screening</li>
                            <li>Nutrition counseling</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-700">Second Trimester (13-28 weeks)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Frequency:</strong> Every 4 weeks
                        </div>
                        <div className="text-sm">
                          <strong>Key Checkups:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Anatomy scan (18-20 weeks)</li>
                            <li>Glucose screening (24-28 weeks)</li>
                            <li>Blood pressure monitoring</li>
                            <li>Weight gain assessment</li>
                            <li>Fetal movement tracking</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-700">Third Trimester (29-40 weeks)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Frequency:</strong> Every 2 weeks, then weekly
                        </div>
                        <div className="text-sm">
                          <strong>Key Checkups:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Growth scans</li>
                            <li>Group B Strep test</li>
                            <li>Birth plan discussion</li>
                            <li>Cervical checks</li>
                            <li>Labor preparation</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Scans & Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-purple-600" />
                    <span>Essential Scans & Lab Tests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-purple-50">
                          <th className="border border-gray-300 p-2 text-left">Test Name</th>
                          <th className="border border-gray-300 p-2 text-left">Trimester</th>
                          <th className="border border-gray-300 p-2 text-left">Frequency</th>
                          <th className="border border-gray-300 p-2 text-left">Importance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pregnancyTests.map((test, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="border border-gray-300 p-2 font-medium">{test.name}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge
                                className={
                                  test.trimester === 1
                                    ? "bg-blue-100 text-blue-800"
                                    : test.trimester === 2
                                      ? "bg-green-100 text-green-800"
                                      : "bg-orange-100 text-orange-800"
                                }
                              >
                                {test.trimester === 1 ? "1st" : test.trimester === 2 ? "2nd" : "3rd"} Trimester
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">{test.frequency}</td>
                            <td className="border border-gray-300 p-2 text-sm">{test.importance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Vaccinations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Pregnancy Vaccinations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pregnancyVaccinations.map((vaccine, index) => (
                      <Card key={index} className="border-green-200">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-green-800 mb-2">{vaccine.name}</h3>
                          <div className="space-y-1 text-sm">
                            <div>
                              <strong>Timing:</strong> {vaccine.week} weeks
                            </div>
                            <div>
                              <strong>Purpose:</strong> {vaccine.importance}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Diet Plan */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Apple className="w-5 h-5 text-green-600" />
                    <span>Detailed Weekly Diet Plan</span>
                  </CardTitle>
                  <Button
                    onClick={generateWeeklyDietPlan}
                    disabled={isGeneratingDiet}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isGeneratingDiet ? "Generating..." : "Generate Diet Plan"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {weeklyDietPlan.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Label>Select Day:</Label>
                        <Select
                          value={selectedWeek.toString()}
                          onValueChange={(value) => setSelectedWeek(Number(value))}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {weeklyDietPlan.map((day, index) => (
                              <SelectItem key={index} value={(index + 1).toString()}>
                                {day.day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {weeklyDietPlan[selectedWeek - 1] && (
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-900 mb-3">
                              {weeklyDietPlan[selectedWeek - 1].day} - Nutrition Summary
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-700">
                                  {weeklyDietPlan[selectedWeek - 1].totalCalories}
                                </div>
                                <div className="text-green-600">Calories</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-700">
                                  {weeklyDietPlan[selectedWeek - 1].totalProtein}g
                                </div>
                                <div className="text-blue-600">Protein</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-700">
                                  {weeklyDietPlan[selectedWeek - 1].totalFiber}g
                                </div>
                                <div className="text-orange-600">Fiber</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-700">6</div>
                                <div className="text-purple-600">Meals</div>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Meals */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Breakfast */}
                            <Card className="border-orange-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Coffee className="w-4 h-4 text-orange-600" />
                                  <span>Breakfast</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <h4 className="font-semibold text-orange-800">
                                  {weeklyDietPlan[selectedWeek - 1].breakfast.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <strong>Ingredients:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].breakfast.ingredients.map((ingredient, i) => (
                                        <li key={i}>{ingredient}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-2">
                                    <span>Calories: {weeklyDietPlan[selectedWeek - 1].breakfast.calories}</span>
                                    <span>Protein: {weeklyDietPlan[selectedWeek - 1].breakfast.protein}g</span>
                                  </div>
                                  <div className="bg-orange-50 p-2 rounded text-xs">
                                    <strong>Preparation:</strong>{" "}
                                    {weeklyDietPlan[selectedWeek - 1].breakfast.preparation}
                                  </div>
                                  <div className="text-xs">
                                    <strong>Benefits:</strong>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].breakfast.benefits.map((benefit, i) => (
                                        <Badge key={i} className="bg-orange-100 text-orange-700 text-xs">
                                          {benefit}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Morning Snack */}
                            <Card className="border-yellow-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Apple className="w-4 h-4 text-yellow-600" />
                                  <span>Morning Snack</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <h4 className="font-semibold text-yellow-800">
                                  {weeklyDietPlan[selectedWeek - 1].morningSnack.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <strong>Ingredients:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].morningSnack.ingredients.map(
                                        (ingredient, i) => (
                                          <li key={i}>{ingredient}</li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-2">
                                    <span>Calories: {weeklyDietPlan[selectedWeek - 1].morningSnack.calories}</span>
                                    <span>Protein: {weeklyDietPlan[selectedWeek - 1].morningSnack.protein}g</span>
                                  </div>
                                  <div className="bg-yellow-50 p-2 rounded text-xs">
                                    <strong>Preparation:</strong>{" "}
                                    {weeklyDietPlan[selectedWeek - 1].morningSnack.preparation}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Lunch */}
                            <Card className="border-blue-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Utensils className="w-4 h-4 text-blue-600" />
                                  <span>Lunch</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <h4 className="font-semibold text-blue-800">
                                  {weeklyDietPlan[selectedWeek - 1].lunch.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <strong>Ingredients:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].lunch.ingredients.map((ingredient, i) => (
                                        <li key={i}>{ingredient}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-2">
                                    <span>Calories: {weeklyDietPlan[selectedWeek - 1].lunch.calories}</span>
                                    <span>Protein: {weeklyDietPlan[selectedWeek - 1].lunch.protein}g</span>
                                  </div>
                                  <div className="bg-blue-50 p-2 rounded text-xs">
                                    <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek - 1].lunch.preparation}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Afternoon Snack */}
                            <Card className="border-green-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Sun className="w-4 h-4 text-green-600" />
                                  <span>Afternoon Snack</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <h4 className="font-semibold text-green-800">
                                  {weeklyDietPlan[selectedWeek - 1].afternoonSnack.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <strong>Ingredients:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].afternoonSnack.ingredients.map(
                                        (ingredient, i) => (
                                          <li key={i}>{ingredient}</li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-2">
                                    <span>Calories: {weeklyDietPlan[selectedWeek - 1].afternoonSnack.calories}</span>
                                    <span>Protein: {weeklyDietPlan[selectedWeek - 1].afternoonSnack.protein}g</span>
                                  </div>
                                  <div className="bg-green-50 p-2 rounded text-xs">
                                    <strong>Preparation:</strong>{" "}
                                    {weeklyDietPlan[selectedWeek - 1].afternoonSnack.preparation}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Dinner */}
                            <Card className="border-purple-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Moon className="w-4 h-4 text-purple-600" />
                                  <span>Dinner</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <h4 className="font-semibold text-purple-800">
                                  {weeklyDietPlan[selectedWeek - 1].dinner.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <strong>Ingredients:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].dinner.ingredients.map((ingredient, i) => (
                                        <li key={i}>{ingredient}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-2">
                                    <span>Calories: {weeklyDietPlan[selectedWeek - 1].dinner.calories}</span>
                                    <span>Protein: {weeklyDietPlan[selectedWeek - 1].dinner.protein}g</span>
                                  </div>
                                  <div className="bg-purple-50 p-2 rounded text-xs">
                                    <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek - 1].dinner.preparation}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Evening Snack */}
                            <Card className="border-indigo-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Moon className="w-4 h-4 text-indigo-600" />
                                  <span>Evening Snack</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <h4 className="font-semibold text-indigo-800">
                                  {weeklyDietPlan[selectedWeek - 1].eveningSnack.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                  <div>
                                    <strong>Ingredients:</strong>
                                    <ul className="list-disc list-inside mt-1">
                                      {weeklyDietPlan[selectedWeek - 1].eveningSnack.ingredients.map(
                                        (ingredient, i) => (
                                          <li key={i}>{ingredient}</li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 mt-2">
                                    <span>Calories: {weeklyDietPlan[selectedWeek - 1].eveningSnack.calories}</span>
                                    <span>Protein: {weeklyDietPlan[selectedWeek - 1].eveningSnack.protein}g</span>
                                  </div>
                                  <div className="bg-indigo-50 p-2 rounded text-xs">
                                    <strong>Preparation:</strong>{" "}
                                    {weeklyDietPlan[selectedWeek - 1].eveningSnack.preparation}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Hydration & Supplements */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-blue-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Droplets className="w-4 h-4 text-blue-600" />
                                  <span>Daily Hydration</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-1 text-sm">
                                  {weeklyDietPlan[selectedWeek - 1].hydration.map((item, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                      <Droplets className="w-3 h-3 text-blue-500" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="border-green-200">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center space-x-2">
                                  <Pill className="w-4 h-4 text-green-600" />
                                  <span>Daily Supplements</span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-1 text-sm">
                                  {weeklyDietPlan[selectedWeek - 1].supplements.map((item, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                      <Pill className="w-3 h-3 text-green-500" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Foods to Avoid */}
                          <Card className="border-red-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span>Foods to Avoid During Pregnancy</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {weeklyDietPlan[selectedWeek - 1].avoidFoods.map((food, i) => (
                                  <Badge key={i} className="bg-red-100 text-red-800 justify-center">
                                    {food}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Apple className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p className="text-gray-600">
                        Click "Generate Diet Plan" to create your personalized weekly meal plan
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* BABY TAB */}
            <TabsContent value="baby" className="space-y-6">
              {/* Baby Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Baby className="w-5 h-5 text-blue-600" />
                    <span>Baby Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="babyName">Baby's Name</Label>
                        <Input
                          id="babyName"
                          value={babyData.name}
                          onChange={(e) => setBabyData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter baby's name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={babyData.birthDate}
                          onChange={(e) => setBabyData((prev) => ({ ...prev, birthDate: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
                          <Input
                            id="birthWeight"
                            type="number"
                            step="0.1"
                            value={babyData.birthWeight}
                            onChange={(e) => setBabyData((prev) => ({ ...prev, birthWeight: Number(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="birthHeight">Birth Height (cm)</Label>
                          <Input
                            id="birthHeight"
                            type="number"
                            value={babyData.birthHeight}
                            onChange={(e) => setBabyData((prev) => ({ ...prev, birthHeight: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                    </div>

                    {babyData.birthDate && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-3">Baby's Age</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Days Old:</span>
                              <Badge className="bg-blue-100 text-blue-800">{babyData.ageInDays} days</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Weeks Old:</span>
                              <Badge className="bg-green-100 text-green-800">{babyData.ageInWeeks} weeks</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Months Old:</span>
                              <Badge className="bg-purple-100 text-purple-800">{babyData.ageInMonths} months</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Baby Vaccinations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Baby Vaccination Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border border-gray-300 p-2 text-left">Vaccine</th>
                          <th className="border border-gray-300 p-2 text-left">Age</th>
                          <th className="border border-gray-300 p-2 text-left">Protects Against</th>
                          <th className="border border-gray-300 p-2 text-left">Side Effects</th>
                        </tr>
                      </thead>
                      <tbody>
                        {babyVaccinations.map((vaccine, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="border border-gray-300 p-2 font-medium">{vaccine.name}</td>
                            <td className="border border-gray-300 p-2">{vaccine.age}</td>
                            <td className="border border-gray-300 p-2">{vaccine.protects}</td>
                            <td className="border border-gray-300 p-2 text-sm">{vaccine.side_effects}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Baby Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span>Developmental Milestones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {babyMilestones.map((milestone, index) => (
                      <Card key={index} className="border-yellow-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-yellow-800">{milestone.age}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              <Activity className="w-3 h-3 text-blue-600" />
                              <strong>Physical:</strong>
                            </div>
                            <p className="text-xs ml-5">{milestone.physical}</p>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              <Smile className="w-3 h-3 text-green-600" />
                              <strong>Social:</strong>
                            </div>
                            <p className="text-xs ml-5">{milestone.social}</p>
                          </div>
                          <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              <Brain className="w-3 h-3 text-purple-600" />
                              <strong>Cognitive:</strong>
                            </div>
                            <p className="text-xs ml-5">{milestone.cognitive}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Baby Feeding Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Apple className="w-5 h-5 text-orange-600" />
                    <span>Baby Feeding Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-pink-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-pink-800">0-6 Months</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Primary Food:</strong> Breast milk only
                        </div>
                        <div className="text-sm">
                          <strong>Frequency:</strong> Every 2-3 hours (8-12 times/day)
                        </div>
                        <div className="text-sm">
                          <strong>Amount:</strong> As much as baby wants
                        </div>
                        <div className="text-sm">
                          <strong>Notes:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>No water, juice, or solid food</li>
                            <li>Breast milk provides all nutrition</li>
                            <li>Formula if breastfeeding not possible</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-800">6-12 Months</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Primary Food:</strong> Breast milk + solids
                        </div>
                        <div className="text-sm">
                          <strong>First Foods:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Rice cereal</li>
                            <li>Mashed banana</li>
                            <li>Sweet potato puree</li>
                            <li>Apple puree</li>
                            <li>Dal water</li>
                          </ul>
                        </div>
                        <div className="text-sm">
                          <strong>Avoid:</strong> Honey, cow's milk, nuts, salt, sugar
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-800">12+ Months</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Foods:</strong> Family foods (modified)
                        </div>
                        <div className="text-sm">
                          <strong>Can Include:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Whole milk</li>
                            <li>Soft chapati pieces</li>
                            <li>Cooked vegetables</li>
                            <li>Soft fruits</li>
                            <li>Mild spices</li>
                          </ul>
                        </div>
                        <div className="text-sm">
                          <strong>Meals:</strong> 3 meals + 2 snacks
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Baby Health Tests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Essential Baby Health Tests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-purple-800">Newborn Screening Tests</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>When:</strong> 24-48 hours after birth
                        </div>
                        <div className="text-sm">
                          <strong>Tests Include:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Phenylketonuria (PKU)</li>
                            <li>Hypothyroidism</li>
                            <li>Sickle cell disease</li>
                            <li>Cystic fibrosis</li>
                            <li>Hearing test</li>
                            <li>Heart defect screening</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-blue-800">Regular Check-ups</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Schedule:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>1 week, 1 month, 2 months</li>
                            <li>4 months, 6 months, 9 months</li>
                            <li>12 months, 15 months, 18 months</li>
                            <li>24 months, then annually</li>
                          </ul>
                        </div>
                        <div className="text-sm">
                          <strong>What's Checked:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Weight, height, head circumference</li>
                            <li>Physical development</li>
                            <li>Vision and hearing</li>
                            <li>Vaccinations</li>
                            <li>Developmental milestones</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Baby Sleep Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span>Baby Sleep Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-indigo-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-indigo-800">0-3 Months</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Total Sleep:</strong> 14-17 hours/day
                        </div>
                        <div className="text-sm">
                          <strong>Night Sleep:</strong> 8-9 hours (with feedings)
                        </div>
                        <div className="text-sm">
                          <strong>Naps:</strong> 3-5 naps, 30 minutes - 2 hours
                        </div>
                        <div className="text-sm">
                          <strong>Tips:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Sleep when baby sleeps</li>
                            <li>Swaddling helps</li>
                            <li>Room sharing is safe</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-purple-800">4-11 Months</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Total Sleep:</strong> 12-15 hours/day
                        </div>
                        <div className="text-sm">
                          <strong>Night Sleep:</strong> 10-12 hours
                        </div>
                        <div className="text-sm">
                          <strong>Naps:</strong> 2-3 naps, 1-3 hours each
                        </div>
                        <div className="text-sm">
                          <strong>Tips:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Establish bedtime routine</li>
                            <li>Sleep training can begin</li>
                            <li>Consistent schedule helps</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-800">12+ Months</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Total Sleep:</strong> 11-14 hours/day
                        </div>
                        <div className="text-sm">
                          <strong>Night Sleep:</strong> 11-12 hours
                        </div>
                        <div className="text-sm">
                          <strong>Naps:</strong> 1-2 naps, 1-3 hours total
                        </div>
                        <div className="text-sm">
                          <strong>Tips:</strong>
                          <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                            <li>Transition to one nap</li>
                            <li>Consistent bedtime</li>
                            <li>Comfort objects help</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    <span>Emergency Contacts & When to Call Doctor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-red-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-800">Call Doctor Immediately If:</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Fever over 100.4°F (38°C) in babies under 3 months</li>
                          <li>Difficulty breathing or wheezing</li>
                          <li>Persistent vomiting or diarrhea</li>
                          <li>Signs of dehydration (dry mouth, no tears)</li>
                          <li>Unusual lethargy or irritability</li>
                          <li>Rash with fever</li>
                          <li>Seizures or convulsions</li>
                          <li>Any injury to the head</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-800">Important Numbers:</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm">
                          <strong>Emergency:</strong> 108 (India)
                        </div>
                        <div className="text-sm">
                          <strong>Pediatrician:</strong> [Add your doctor's number]
                        </div>
                        <div className="text-sm">
                          <strong>Nearest Hospital:</strong> [Add hospital number]
                        </div>
                        <div className="text-sm">
                          <strong>Poison Control:</strong> 1066 (India)
                        </div>
                        <div className="text-sm">
                          <strong>Ambulance:</strong> 108
                        </div>
                        <Alert className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Keep these numbers easily accessible. In emergencies, don't hesitate to call for help.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}
