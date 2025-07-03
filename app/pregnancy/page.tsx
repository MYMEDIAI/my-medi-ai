"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Baby, Heart, Apple, AlertTriangle, CheckCircle, Clock, Stethoscope, Home, RotateCcw } from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"

interface PregnancyData {
  lastPeriodDate: string
  dueDate: string
  currentWeek: number
  currentWeight: string
  prePregnancyWeight: string
  height: string
  bloodPressure: string
  symptoms: string
}

interface BabyData {
  name: string
  birthDate: string
  birthWeight: string
  birthLength: string
  currentWeight: string
  currentLength: string
  milestones: string[]
  vaccinations: string[]
  feedingSchedule: string
  sleepPattern: string
}

export default function PregnancyPage() {
  const [activeTab, setActiveTab] = useState("pregnancy")

  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({
    lastPeriodDate: "",
    dueDate: "",
    currentWeek: 0,
    currentWeight: "",
    prePregnancyWeight: "",
    height: "",
    bloodPressure: "",
    symptoms: "",
  })

  const [babyData, setBabyData] = useState<BabyData>({
    name: "",
    birthDate: "",
    birthWeight: "",
    birthLength: "",
    currentWeight: "",
    currentLength: "",
    milestones: [],
    vaccinations: [],
    feedingSchedule: "",
    sleepPattern: "",
  })

  const [dietPlan, setDietPlan] = useState<string | null>(null)
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false)

  const resetAll = () => {
    // Reset pregnancy data
    setPregnancyData({
      lastPeriodDate: "",
      dueDate: "",
      currentWeek: 0,
      currentWeight: "",
      prePregnancyWeight: "",
      height: "",
      bloodPressure: "",
      symptoms: "",
    })

    // Reset baby data
    setBabyData({
      name: "",
      birthDate: "",
      birthWeight: "",
      birthLength: "",
      currentWeight: "",
      currentLength: "",
      milestones: [],
      vaccinations: [],
      feedingSchedule: "",
      sleepPattern: "",
    })

    // Reset diet plan
    setDietPlan(null)
    setIsGeneratingDiet(false)

    // Reset to pregnancy tab
    setActiveTab("pregnancy")
  }

  const handlePregnancyChange = (field: keyof PregnancyData, value: string | number) => {
    setPregnancyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBabyChange = (field: keyof BabyData, value: string | string[]) => {
    setBabyData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateDueDate = (lastPeriodDate: string) => {
    if (!lastPeriodDate) return ""
    const date = new Date(lastPeriodDate)
    date.setDate(date.getDate() + 280) // 40 weeks
    return date.toISOString().split("T")[0]
  }

  const calculateCurrentWeek = (lastPeriodDate: string) => {
    if (!lastPeriodDate) return 0
    const today = new Date()
    const lmp = new Date(lastPeriodDate)
    const diffTime = Math.abs(today.getTime() - lmp.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.floor(diffDays / 7)
  }

  const generatePregnancyDiet = async () => {
    setIsGeneratingDiet(true)
    try {
      const dietPrompt = `
Create a personalized pregnancy diet plan for:
Current Week: ${pregnancyData.currentWeek}
Current Weight: ${pregnancyData.currentWeight}kg
Pre-pregnancy Weight: ${pregnancyData.prePregnancyWeight}kg
Height: ${pregnancyData.height}cm
Current Symptoms: ${pregnancyData.symptoms}

Please provide:
1. Trimester-specific nutritional needs
2. Foods to eat and avoid during pregnancy
3. Meal suggestions for morning sickness (if applicable)
4. Calcium, iron, and folic acid rich foods
5. Hydration recommendations
6. Healthy weight gain guidelines

Format as a comprehensive pregnancy nutrition guide.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: dietPrompt,
          type: "pregnancy-diet",
        }),
      })

      const data = await response.json()
      setDietPlan(
        data.response ||
          "Personalized pregnancy diet plan generated. Focus on balanced nutrition with adequate folic acid, iron, and calcium.",
      )
    } catch (error) {
      console.error("Diet generation error:", error)
      setDietPlan(
        "Focus on balanced nutrition during pregnancy: plenty of fruits, vegetables, whole grains, lean proteins, and dairy. Take prenatal vitamins as recommended by your healthcare provider.",
      )
    } finally {
      setIsGeneratingDiet(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={resetAll} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Pregnancy & Baby Care Center
                <Badge className="bg-white/20 text-white hover:bg-white/20 ml-auto">
                  <Heart className="w-3 h-3 mr-1" />
                  Family Health
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pregnancy">Pregnancy Tracker</TabsTrigger>
                  <TabsTrigger value="baby">Baby Care</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition Guide</TabsTrigger>
                </TabsList>

                <TabsContent value="pregnancy" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-pink-800">Pregnancy Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lastPeriod">Last Menstrual Period</Label>
                        <Input
                          id="lastPeriod"
                          type="date"
                          value={pregnancyData.lastPeriodDate}
                          onChange={(e) => {
                            const date = e.target.value
                            handlePregnancyChange("lastPeriodDate", date)
                            handlePregnancyChange("dueDate", calculateDueDate(date))
                            handlePregnancyChange("currentWeek", calculateCurrentWeek(date))
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Expected Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={pregnancyData.dueDate}
                          onChange={(e) => handlePregnancyChange("dueDate", e.target.value)}
                        />
                      </div>
                    </div>

                    {pregnancyData.currentWeek > 0 && (
                      <Card className="bg-pink-50 border-pink-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-pink-800">Pregnancy Progress</span>
                            <span className="text-sm text-pink-600">Week {pregnancyData.currentWeek} of 40</span>
                          </div>
                          <Progress value={(pregnancyData.currentWeek / 40) * 100} className="h-2" />
                          <p className="text-xs text-pink-600 mt-2">
                            {pregnancyData.currentWeek <= 12
                              ? "First Trimester"
                              : pregnancyData.currentWeek <= 27
                                ? "Second Trimester"
                                : "Third Trimester"}
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                        <Input
                          id="currentWeight"
                          type="number"
                          value={pregnancyData.currentWeight}
                          onChange={(e) => handlePregnancyChange("currentWeight", e.target.value)}
                          placeholder="65"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preWeight">Pre-pregnancy Weight (kg)</Label>
                        <Input
                          id="preWeight"
                          type="number"
                          value={pregnancyData.prePregnancyWeight}
                          onChange={(e) => handlePregnancyChange("prePregnancyWeight", e.target.value)}
                          placeholder="60"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={pregnancyData.height}
                          onChange={(e) => handlePregnancyChange("height", e.target.value)}
                          placeholder="165"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="symptoms">Current Symptoms</Label>
                      <Textarea
                        id="symptoms"
                        value={pregnancyData.symptoms}
                        onChange={(e) => handlePregnancyChange("symptoms", e.target.value)}
                        placeholder="Describe any symptoms you're experiencing..."
                        rows={3}
                      />
                    </div>

                    <Alert className="border-pink-200 bg-pink-50">
                      <Heart className="h-4 w-4 text-pink-600" />
                      <AlertDescription className="text-pink-800">
                        Regular prenatal checkups are essential. Always consult with your healthcare provider for
                        personalized medical advice during pregnancy.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                <TabsContent value="baby" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-800">Baby Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="babyName">Baby's Name</Label>
                        <Input
                          id="babyName"
                          value={babyData.name}
                          onChange={(e) => handleBabyChange("name", e.target.value)}
                          placeholder="Enter baby's name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={babyData.birthDate}
                          onChange={(e) => handleBabyChange("birthDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
                        <Input
                          id="birthWeight"
                          type="number"
                          step="0.1"
                          value={babyData.birthWeight}
                          onChange={(e) => handleBabyChange("birthWeight", e.target.value)}
                          placeholder="3.2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthLength">Birth Length (cm)</Label>
                        <Input
                          id="birthLength"
                          type="number"
                          value={babyData.birthLength}
                          onChange={(e) => handleBabyChange("birthLength", e.target.value)}
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentBabyWeight">Current Weight (kg)</Label>
                        <Input
                          id="currentBabyWeight"
                          type="number"
                          step="0.1"
                          value={babyData.currentWeight}
                          onChange={(e) => handleBabyChange("currentWeight", e.target.value)}
                          placeholder="5.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentLength">Current Length (cm)</Label>
                        <Input
                          id="currentLength"
                          type="number"
                          value={babyData.currentLength}
                          onChange={(e) => handleBabyChange("currentLength", e.target.value)}
                          placeholder="60"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="feedingSchedule">Feeding Schedule</Label>
                      <Textarea
                        id="feedingSchedule"
                        value={babyData.feedingSchedule}
                        onChange={(e) => handleBabyChange("feedingSchedule", e.target.value)}
                        placeholder="Describe feeding times and amounts..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sleepPattern">Sleep Pattern</Label>
                      <Textarea
                        id="sleepPattern"
                        value={babyData.sleepPattern}
                        onChange={(e) => handleBabyChange("sleepPattern", e.target.value)}
                        placeholder="Describe sleep schedule and patterns..."
                        rows={3}
                      />
                    </div>

                    <Alert className="border-blue-200 bg-blue-50">
                      <Baby className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Track your baby's growth and development. Regular pediatric checkups are important for
                        monitoring healthy development.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>

                <TabsContent value="nutrition" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-green-800">Pregnancy Nutrition Guide</h3>
                      <Button
                        onClick={generatePregnancyDiet}
                        disabled={isGeneratingDiet || !pregnancyData.currentWeek}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isGeneratingDiet ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Apple className="w-4 h-4 mr-2" />
                            Generate Diet Plan
                          </>
                        )}
                      </Button>
                    </div>

                    {dietPlan ? (
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-5 w-5" />
                            Your Personalized Pregnancy Diet Plan
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="whitespace-pre-line text-sm text-green-900">{dietPlan}</div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <Apple className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Personalized Nutrition Plan</h4>
                            <p className="text-gray-600 mb-4">
                              Fill in your pregnancy information to generate a customized nutrition plan based on your
                              current trimester and health needs.
                            </p>
                            <Alert className="border-yellow-200 bg-yellow-50 text-left">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-yellow-800">
                                Please complete your pregnancy information in the "Pregnancy Tracker" tab first.
                              </AlertDescription>
                            </Alert>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Foods to Include
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>• Leafy greens (spinach, kale)</li>
                            <li>• Citrus fruits (oranges, lemons)</li>
                            <li>• Whole grains (brown rice, quinoa)</li>
                            <li>• Lean proteins (chicken, fish, lentils)</li>
                            <li>• Dairy products (milk, yogurt, cheese)</li>
                            <li>• Nuts and seeds</li>
                            <li>• Avocados</li>
                            <li>• Sweet potatoes</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Foods to Avoid
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>• Raw or undercooked meat/eggs</li>
                            <li>• High-mercury fish</li>
                            <li>• Unpasteurized dairy products</li>
                            <li>• Excessive caffeine</li>
                            <li>• Alcohol</li>
                            <li>• Raw sprouts</li>
                            <li>• Unwashed fruits/vegetables</li>
                            <li>• Processed meats</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Alert className="border-green-200 bg-green-50">
                      <Stethoscope className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Always consult with your healthcare provider or a registered dietitian for personalized
                        nutrition advice during pregnancy.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
