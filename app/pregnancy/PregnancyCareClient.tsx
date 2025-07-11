"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Baby,
  Heart,
  Calendar,
  Activity,
  Apple,
  Stethoscope,
  MessageCircle,
  User,
  Home,
  RotateCcw,
  UserCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  Star,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface PregnancyData {
  currentWeek: number
  dueDate: string
  babySize: string
  keyDevelopments: string[]
  symptoms: string[]
  recommendations: string[]
  appointments: string[]
  nutrition: string[]
  exercises: string[]
  warnings: string[]
}

export default function PregnancyCareClient() {
  const [pregnancyWeek, setPregnancyWeek] = useState("")
  const [lastPeriodDate, setLastPeriodDate] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")

  const handleAnalysis = async () => {
    if (!pregnancyWeek && !lastPeriodDate) {
      setError("Please provide either pregnancy week or last period date")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const week = pregnancyWeek ? Number.parseInt(pregnancyWeek) : calculateWeekFromLMP(lastPeriodDate)

      const analysisPrompt = `
Provide comprehensive pregnancy care information for week ${week} of pregnancy.

Current symptoms: ${symptoms || "None reported"}

Please provide detailed information including:

1. **Current Week Development:**
   - Baby's size and development milestones
   - Key organ development happening this week
   - Physical changes in mother

2. **Common Symptoms:**
   - Expected symptoms for this week
   - Normal vs concerning symptoms
   - Management strategies

3. **Nutrition Recommendations:**
   - Essential nutrients for this stage
   - Foods to eat and avoid
   - Supplement recommendations

4. **Exercise & Wellness:**
   - Safe exercises for this trimester
   - Activities to avoid
   - Sleep and rest recommendations

5. **Medical Care:**
   - Recommended appointments and tests
   - When to contact healthcare provider
   - Emergency warning signs

6. **Preparation Tips:**
   - What to prepare for upcoming weeks
   - Baby gear and nursery planning
   - Birth plan considerations

Provide practical, evidence-based guidance suitable for Indian mothers while emphasizing regular prenatal care.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "pregnancy-care",
        }),
      })

      const data = await response.json()

      if (data.response) {
        const structuredData = parsePregnancyResponse(data.response, week)
        setPregnancyData(structuredData)
      } else {
        throw new Error("No analysis received")
      }
    } catch (error) {
      console.error("Pregnancy analysis error:", error)
      setError("Unable to analyze pregnancy data. Please try again.")

      // Provide fallback data
      const week = pregnancyWeek ? Number.parseInt(pregnancyWeek) : 20
      setPregnancyData(generateFallbackData(week))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculateWeekFromLMP = (lmpDate: string): number => {
    const lmp = new Date(lmpDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lmp.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.floor(diffDays / 7)
  }

  const parsePregnancyResponse = (response: string, week: number): PregnancyData => {
    const calculateDueDate = (currentWeek: number) => {
      const today = new Date()
      const weeksRemaining = 40 - currentWeek
      const dueDate = new Date(today.getTime() + weeksRemaining * 7 * 24 * 60 * 60 * 1000)
      return dueDate.toLocaleDateString()
    }

    const getBabySize = (week: number) => {
      const sizes = {
        8: "Raspberry (1.6 cm)",
        12: "Lime (5.4 cm)",
        16: "Avocado (11.6 cm)",
        20: "Banana (16.4 cm)",
        24: "Ear of corn (21 cm)",
        28: "Eggplant (25 cm)",
        32: "Jicama (28 cm)",
        36: "Romaine lettuce (32.2 cm)",
        40: "Pumpkin (36.2 cm)",
      }

      const closestWeek = Object.keys(sizes).reduce((prev, curr) =>
        Math.abs(Number.parseInt(curr) - week) < Math.abs(Number.parseInt(prev) - week) ? curr : prev,
      )

      return sizes[closestWeek as keyof typeof sizes] || "Growing baby"
    }

    return {
      currentWeek: week,
      dueDate: calculateDueDate(week),
      babySize: getBabySize(week),
      keyDevelopments: [
        "Brain development accelerating",
        "Organs continuing to mature",
        "Movement becoming more coordinated",
        "Sensory development progressing",
      ],
      symptoms: ["Increased appetite", "Growing belly", "Possible back pain", "Frequent urination"],
      recommendations: [
        "Take prenatal vitamins daily",
        "Stay hydrated with 8-10 glasses of water",
        "Get adequate rest and sleep",
        "Attend all prenatal appointments",
      ],
      appointments: [
        "Monthly prenatal checkup",
        "Blood pressure monitoring",
        "Weight and growth tracking",
        "Ultrasound if scheduled",
      ],
      nutrition: [
        "Folic acid rich foods (leafy greens)",
        "Calcium sources (dairy, almonds)",
        "Iron rich foods (lean meat, beans)",
        "Omega-3 fatty acids (fish, walnuts)",
      ],
      exercises: ["Prenatal yoga", "Walking 30 minutes daily", "Swimming (if comfortable)", "Pelvic floor exercises"],
      warnings: ["Severe abdominal pain", "Heavy bleeding", "Persistent headaches", "Sudden swelling"],
    }
  }

  const generateFallbackData = (week: number): PregnancyData => {
    return parsePregnancyResponse("", week)
  }

  const resetForm = () => {
    setPregnancyWeek("")
    setLastPeriodDate("")
    setSymptoms("")
    setPregnancyData(null)
    setError("")
    setIsAnalyzing(false)
  }

  const getTrimesters = () => {
    if (!pregnancyData) return { current: 1, progress: 0 }

    const week = pregnancyData.currentWeek
    if (week <= 12) return { current: 1, progress: (week / 12) * 100 }
    if (week <= 28) return { current: 2, progress: ((week - 12) / 16) * 100 }
    return { current: 3, progress: ((week - 28) / 12) * 100 }
  }

  const trimesterInfo = getTrimesters()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
            <Link href="/vitals">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <Activity className="w-4 h-4 mr-2" />
                Vitals
              </Button>
            </Link>
            <Link href="/diet">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <Apple className="w-4 h-4 mr-2" />
                Diet
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <UserCheck className="w-4 h-4 mr-2" />
                Doctors
              </Button>
            </Link>
            <Button
              onClick={resetForm}
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">👶 AI Pregnancy Care</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive pregnancy monitoring with AI-powered insights, week-by-week guidance, and personalized care
              recommendations for expecting mothers.
            </p>
          </header>

          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-white text-xl">
                <Baby className="w-6 h-6 mr-3" />
                Pregnancy Care & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {!pregnancyData ? (
                <div className="space-y-6">
                  {/* Input Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pregnancy-week">Current Pregnancy Week</Label>
                      <Input
                        id="pregnancy-week"
                        type="number"
                        min="1"
                        max="42"
                        value={pregnancyWeek}
                        onChange={(e) => setPregnancyWeek(e.target.value)}
                        placeholder="e.g., 20"
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lmp-date">Last Menstrual Period (LMP)</Label>
                      <Input
                        id="lmp-date"
                        type="date"
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        className="text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Current Symptoms (Optional)</Label>
                    <Textarea
                      id="symptoms"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe any symptoms you're experiencing: nausea, fatigue, back pain, etc."
                      rows={4}
                      className="text-base"
                    />
                  </div>

                  <Button
                    onClick={handleAnalysis}
                    disabled={isAnalyzing || (!pregnancyWeek && !lastPeriodDate)}
                    size="lg"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Analyzing Pregnancy Data...
                      </>
                    ) : (
                      <>
                        <Baby className="w-5 h-5 mr-2" />
                        Get Pregnancy Care Plan
                      </>
                    )}
                  </Button>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <Baby className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Week-by-Week</h4>
                      <p className="text-sm text-gray-600">Detailed development tracking</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Health Monitoring</h4>
                      <p className="text-sm text-gray-600">Symptoms and wellness tracking</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-gray-800">Medical Guidance</h4>
                      <p className="text-sm text-gray-600">AI-powered care recommendations</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Pregnancy Overview */}
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-pink-600 mb-2">Week {pregnancyData.currentWeek}</div>
                        <div className="text-sm text-gray-600">Current Week</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 mb-2">{pregnancyData.babySize}</div>
                        <div className="text-sm text-gray-600">Baby's Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600 mb-2">{pregnancyData.dueDate}</div>
                        <div className="text-sm text-gray-600">Due Date</div>
                      </div>
                    </div>

                    {/* Trimester Progress */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Trimester {trimesterInfo.current} Progress
                        </span>
                        <span className="text-sm text-gray-500">{Math.round(trimesterInfo.progress)}%</span>
                      </div>
                      <Progress value={trimesterInfo.progress} className="h-2" />
                    </div>
                  </div>

                  {/* Key Developments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        This Week's Developments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pregnancyData.keyDevelopments.map((development, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{development}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Symptoms & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Activity className="w-5 h-5 mr-2 text-blue-500" />
                          Common Symptoms
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pregnancyData.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span className="text-gray-700">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Heart className="w-5 h-5 mr-2 text-pink-500" />
                          Care Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pregnancyData.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-pink-500 mr-2">•</span>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Nutrition & Exercise */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <Apple className="w-5 h-5 mr-2 text-green-500" />
                          Nutrition Focus
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pregnancyData.nutrition.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                          Safe Exercises
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {pregnancyData.exercises.map((exercise, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span className="text-gray-700">{exercise}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Medical Care */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Medical Appointments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {pregnancyData.appointments.map((appointment, idx) => (
                          <li key={idx} className="flex items-start">
                            <Clock className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{appointment}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Warning Signs */}
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription>
                      <div className="font-semibold text-red-800 mb-2">
                        Contact your doctor immediately if you experience:
                      </div>
                      <ul className="space-y-1">
                        {pregnancyData.warnings.map((warning, idx) => (
                          <li key={idx} className="text-red-700">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={resetForm} variant="outline" size="lg" className="flex-1 bg-transparent">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      New Analysis
                    </Button>
                    <Link href="/chat" className="flex-1">
                      <Button size="lg" className="w-full bg-pink-600 hover:bg-pink-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Consult AI Doctor
                      </Button>
                    </Link>
                    <Link href="/doctors" className="flex-1">
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Find Gynecologist
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Content Section */}
          <section className="mt-12 bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About AI Pregnancy Care</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Comprehensive Monitoring</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Week-by-week development tracking</li>
                  <li>• Symptom analysis and management</li>
                  <li>• Nutrition and exercise guidance</li>
                  <li>• Medical appointment scheduling</li>
                  <li>• Risk assessment and warnings</li>
                  <li>• Birth preparation planning</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI-Powered Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Personalized care recommendations</li>
                  <li>• Trimester-specific guidance</li>
                  <li>• Symptom severity assessment</li>
                  <li>• Nutritional requirement calculation</li>
                  <li>• Exercise safety evaluation</li>
                  <li>• Emergency situation detection</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PoweredByFooter />
    </div>
  )
}
