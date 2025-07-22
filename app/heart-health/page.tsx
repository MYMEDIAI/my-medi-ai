"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  Activity,
  AlertTriangle,
  Shield,
  Stethoscope,
  Phone,
  Download,
  Home,
  RotateCcw,
  CheckCircle,
  Info,
  Clock,
  Target,
  Zap,
  Printer,
  Share2,
  Calendar,
  User,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface HeartHealthData {
  // Personal Information
  name: string
  age: string
  gender: string
  weight: string
  height: string

  // Contact Information
  phone: string
  email: string
  emergencyContact: string

  // Symptoms
  chestPain: string
  breathlessness: string
  palpitations: string
  fatigue: string
  swelling: string
  dizziness: string

  // Risk Factors
  smoking: string
  alcohol: string
  familyHistory: string
  diabetes: string
  hypertension: string
  cholesterol: string

  // Lifestyle
  exerciseFrequency: string
  stressLevel: string
  sleepQuality: string
  dietType: string

  // Vitals
  bloodPressure: string
  restingHeartRate: string
  lastCheckup: string

  // Current Medications
  medications: string
  concerns: string
}

interface HeartHealthResults {
  riskScore: {
    total: number
    level: string
    category: string
  }
  recommendations: {
    immediate: string[]
    lifestyle: string[]
    dietary: string[]
    exercise: string[]
    monitoring: string[]
  }
  tests: {
    essential: Array<{ name: string; cost: string; description: string; frequency: string }>
    additional: Array<{ name: string; cost: string; description: string; frequency: string }>
  }
  emergencyPlan: {
    warningSignals: string[]
    firstAid: string[]
    contacts: string[]
  }
  followUp: {
    schedule: string
    goals: string[]
    tracking: string[]
  }
  medications: {
    current: string[]
    recommended: Array<{ name: string; purpose: string; cost: string }>
  }
  lifestyle: {
    diet: string[]
    exercise: string[]
    stress: string[]
  }
}

export default function HeartHealthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<HeartHealthResults | null>(null)

  const [formData, setFormData] = useState<HeartHealthData>({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    phone: "",
    email: "",
    emergencyContact: "",
    chestPain: "",
    breathlessness: "",
    palpitations: "",
    fatigue: "",
    swelling: "",
    dizziness: "",
    smoking: "",
    alcohol: "",
    familyHistory: "",
    diabetes: "",
    hypertension: "",
    cholesterol: "",
    exerciseFrequency: "",
    stressLevel: "",
    sleepQuality: "",
    dietType: "",
    bloodPressure: "",
    restingHeartRate: "",
    lastCheckup: "",
    medications: "",
    concerns: "",
  })

  const handleInputChange = (field: keyof HeartHealthData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateRiskScore = () => {
    let score = 0

    // Age factor
    const age = Number.parseInt(formData.age)
    if (age > 65) score += 3
    else if (age > 55) score += 2
    else if (age > 45) score += 1

    // Gender factor
    if (formData.gender === "male") score += 1

    // Symptoms
    if (formData.chestPain === "frequent") score += 3
    else if (formData.chestPain === "occasional") score += 1

    if (formData.breathlessness === "severe") score += 3
    else if (formData.breathlessness === "moderate") score += 2
    else if (formData.breathlessness === "mild") score += 1

    if (formData.palpitations === "frequent") score += 2
    if (formData.fatigue === "severe") score += 2
    if (formData.swelling === "yes") score += 2
    if (formData.dizziness === "frequent") score += 1

    // Risk factors
    if (formData.smoking === "current") score += 3
    else if (formData.smoking === "former") score += 1

    if (formData.familyHistory === "yes") score += 2
    if (formData.diabetes === "yes") score += 2
    if (formData.hypertension === "yes") score += 2
    if (formData.cholesterol === "high") score += 2

    // Lifestyle
    if (formData.exerciseFrequency === "never") score += 2
    else if (formData.exerciseFrequency === "rarely") score += 1

    if (formData.stressLevel === "high") score += 2
    else if (formData.stressLevel === "moderate") score += 1

    return score
  }

  const getRiskLevel = (score: number) => {
    if (score <= 5) return { level: "Low", category: "Good heart health" }
    if (score <= 10) return { level: "Moderate", category: "Some risk factors present" }
    if (score <= 15) return { level: "High", category: "Multiple risk factors" }
    return { level: "Very High", category: "Immediate attention needed" }
  }

  const generateResults = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const riskScore = calculateRiskScore()
    const riskInfo = getRiskLevel(riskScore)

    const results: HeartHealthResults = {
      riskScore: {
        total: riskScore,
        level: riskInfo.level,
        category: riskInfo.category,
      },
      recommendations: {
        immediate:
          riskScore > 15
            ? [
                "Consult a cardiologist within 24-48 hours",
                "Monitor blood pressure daily",
                "Avoid strenuous activities until cleared",
                "Keep emergency medications handy",
                "Consider emergency room visit if symptoms worsen",
              ]
            : riskScore > 10
              ? [
                  "Schedule cardiology appointment within 2 weeks",
                  "Start monitoring vital signs",
                  "Begin gentle exercise program",
                  "Review current medications",
                  "Lifestyle modifications needed",
                ]
              : [
                  "Continue regular health checkups",
                  "Maintain current healthy habits",
                  "Annual cardiac screening recommended",
                  "Stay active and eat well",
                  "Monitor for any new symptoms",
                ],
        lifestyle: [
          "Quit smoking completely if applicable",
          "Limit alcohol to 1-2 drinks per day maximum",
          "Maintain healthy weight (BMI 18.5-24.9)",
          "Get 7-8 hours of quality sleep",
          "Practice stress management techniques",
          "Stay hydrated (8-10 glasses water daily)",
          "Avoid excessive caffeine",
          "Regular meditation or yoga",
        ],
        dietary: [
          "Follow DASH diet principles",
          "Reduce sodium intake (<2300mg/day)",
          "Include omega-3 rich foods (fish, walnuts)",
          "Eat 5-7 servings fruits/vegetables daily",
          "Choose whole grains over refined",
          "Limit saturated and trans fats",
          "Include Indian heart-healthy foods: oats, dal, green tea",
          "Avoid processed and packaged foods",
          "Use herbs and spices instead of salt",
          "Include garlic, turmeric, and ginger",
        ],
        exercise: [
          "150 minutes moderate aerobic activity weekly",
          "Start with 10-15 minutes daily walking",
          "Include strength training 2x/week",
          "Practice yoga or meditation",
          "Avoid sudden intense exercise",
          "Monitor heart rate during exercise",
          "Swimming or cycling for low impact",
          "Gradual increase in intensity",
        ],
        monitoring: [
          "Check blood pressure weekly",
          "Monitor resting heart rate daily",
          "Track weight weekly",
          "Log symptoms in diary",
          "Regular lipid profile every 6 months",
          "Annual ECG and echo if recommended",
          "Blood sugar monitoring if diabetic",
          "Regular medication compliance check",
        ],
      },
      tests: {
        essential: [
          {
            name: "ECG (Electrocardiogram)",
            cost: "₹200-500",
            description: "Checks heart rhythm and electrical activity",
            frequency: "Annually or as needed",
          },
          {
            name: "Echocardiogram",
            cost: "₹1,500-3,000",
            description: "Ultrasound of heart structure and function",
            frequency: "Every 2 years",
          },
          {
            name: "Lipid Profile",
            cost: "₹300-800",
            description: "Cholesterol and triglyceride levels",
            frequency: "Every 6 months",
          },
          {
            name: "Blood Pressure Monitoring",
            cost: "₹100-300",
            description: "24-hour ambulatory BP monitoring",
            frequency: "As recommended",
          },
        ],
        additional: [
          {
            name: "Stress Test (TMT)",
            cost: "₹2,000-4,000",
            description: "Heart function during exercise",
            frequency: "As needed",
          },
          {
            name: "Coronary Angiography",
            cost: "₹15,000-30,000",
            description: "Detailed view of coronary arteries",
            frequency: "If indicated",
          },
          {
            name: "CT Coronary Angiogram",
            cost: "₹8,000-15,000",
            description: "Non-invasive coronary imaging",
            frequency: "If indicated",
          },
          {
            name: "Holter Monitor",
            cost: "₹2,000-4,000",
            description: "24-48 hour heart rhythm monitoring",
            frequency: "If arrhythmia suspected",
          },
        ],
      },
      emergencyPlan: {
        warningSignals: [
          "Severe chest pain or pressure",
          "Shortness of breath at rest",
          "Sudden severe headache",
          "Weakness or numbness in face/arms",
          "Rapid or irregular heartbeat",
          "Fainting or near-fainting",
          "Severe nausea with chest discomfort",
          "Cold sweats with chest pain",
        ],
        firstAid: [
          "Call 108 (emergency) immediately",
          "Chew aspirin 325mg if not allergic",
          "Sit upright, loosen tight clothing",
          "Stay calm and avoid physical activity",
          "If unconscious, start CPR if trained",
          "Keep emergency medications accessible",
          "Note time of symptom onset",
          "Prepare medical history for paramedics",
        ],
        contacts: [
          "Emergency Services: 108",
          "Nearest Hospital Emergency: [Your local hospital]",
          "Family Doctor: [Your doctor's number]",
          "Cardiologist: [If you have one]",
          "Family Emergency Contact: [Family member]",
        ],
      },
      followUp: {
        schedule:
          riskScore > 15
            ? "Every 2-4 weeks initially, then monthly"
            : riskScore > 10
              ? "Every 2-3 months"
              : "Every 6 months",
        goals: [
          "Blood pressure <130/80 mmHg",
          "LDL cholesterol <100 mg/dL",
          "Regular exercise 5 days/week",
          "Maintain healthy weight",
          "Stress management daily",
          "Medication compliance 100%",
          "No smoking or tobacco use",
          "Limit alcohol consumption",
        ],
        tracking: [
          "Daily: Blood pressure, weight, symptoms",
          "Weekly: Exercise duration and intensity",
          "Monthly: Medication review",
          "Quarterly: Lab tests as recommended",
          "Annually: Comprehensive cardiac evaluation",
          "Ongoing: Symptom diary maintenance",
        ],
      },
      medications: {
        current: formData.medications ? formData.medications.split(",").map((med) => med.trim()) : [],
        recommended: [
          {
            name: "ACE Inhibitors (Enalapril/Lisinopril)",
            purpose: "Lower blood pressure and reduce heart workload",
            cost: "₹50-200/month",
          },
          {
            name: "Beta Blockers (Metoprolol/Atenolol)",
            purpose: "Reduce heart rate and blood pressure",
            cost: "₹30-150/month",
          },
          {
            name: "Statins (Atorvastatin/Rosuvastatin)",
            purpose: "Lower cholesterol levels",
            cost: "₹100-500/month",
          },
          {
            name: "Aspirin (Low-dose)",
            purpose: "Blood thinner to prevent clots",
            cost: "₹20-50/month",
          },
        ],
      },
      lifestyle: {
        diet: [
          "Mediterranean or DASH diet pattern",
          "Increase fiber intake (25-35g daily)",
          "Reduce sodium to <2300mg daily",
          "Include 2 servings fish per week",
          "Limit red meat consumption",
          "Choose healthy cooking oils",
          "Increase antioxidant-rich foods",
          "Stay hydrated adequately",
        ],
        exercise: [
          "Brisk walking 30 minutes daily",
          "Swimming 2-3 times per week",
          "Yoga or tai chi for flexibility",
          "Strength training twice weekly",
          "Avoid isometric exercises initially",
          "Monitor heart rate during activity",
          "Cool down properly after exercise",
          "Listen to your body's signals",
        ],
        stress: [
          "Practice deep breathing exercises",
          "Regular meditation (10-20 minutes)",
          "Maintain work-life balance",
          "Get adequate sleep (7-8 hours)",
          "Engage in hobbies you enjoy",
          "Social support and connections",
          "Professional counseling if needed",
          "Limit exposure to stressors",
        ],
      },
    }

    setResults(results)
    setIsLoading(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      phone: "",
      email: "",
      emergencyContact: "",
      chestPain: "",
      breathlessness: "",
      palpitations: "",
      fatigue: "",
      swelling: "",
      dizziness: "",
      smoking: "",
      alcohol: "",
      familyHistory: "",
      diabetes: "",
      hypertension: "",
      cholesterol: "",
      exerciseFrequency: "",
      stressLevel: "",
      sleepQuality: "",
      dietType: "",
      bloodPressure: "",
      restingHeartRate: "",
      lastCheckup: "",
      medications: "",
      concerns: "",
    })
    setResults(null)
  }

  const downloadPDF = () => {
    window.print()
  }

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Heart Health Assessment - MyMedi.ai",
          text: `Check out my heart health assessment from MyMedi.ai!`,
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
    const getRiskColor = (level: string) => {
      switch (level) {
        case "Low":
          return "text-green-600 bg-green-50 border-green-200"
        case "Moderate":
          return "text-yellow-600 bg-yellow-50 border-yellow-200"
        case "High":
          return "text-orange-600 bg-orange-50 border-orange-200"
        case "Very High":
          return "text-red-600 bg-red-50 border-red-200"
        default:
          return "text-gray-600 bg-gray-50 border-gray-200"
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
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

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Heart Health Assessment</h1>
              <p className="text-gray-600">Comprehensive cardiac evaluation for {formData.name}</p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary">AI-Powered</Badge>
                <Badge variant="secondary">Comprehensive</Badge>
                <Badge variant="secondary">Personalized</Badge>
                <Badge variant="secondary">HIPAA Compliant</Badge>
              </div>
            </div>

            <div className="mb-8">
              <Card className={`border-2 ${getRiskColor(results.riskScore.level)}`}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="w-12 h-12 text-red-500 mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold">Risk Level: {results.riskScore.level}</h2>
                      <p className="text-gray-600">{results.riskScore.category}</p>
                      <p className="text-sm text-gray-500">Score: {results.riskScore.total}/20</p>
                    </div>
                  </div>
                  <Progress value={(results.riskScore.total / 20) * 100} className="w-full max-w-md mx-auto" />
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Personal Information Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-lg">{formData.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Age</Label>
                        <p className="text-lg">{formData.age} years</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Gender</Label>
                        <p className="text-lg capitalize">{formData.gender}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Weight</Label>
                        <p className="text-lg">{formData.weight} kg</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Blood Pressure</Label>
                        <p className="text-lg">{formData.bloodPressure || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Resting Heart Rate</Label>
                        <p className="text-lg">
                          {formData.restingHeartRate ? `${formData.restingHeartRate} bpm` : "Not provided"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Factors Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Risk Factors Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Current Risk Factors</h4>
                        <ul className="space-y-2">
                          {formData.smoking === "current" && (
                            <li className="flex items-center text-red-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Current smoker
                            </li>
                          )}
                          {formData.diabetes === "yes" && (
                            <li className="flex items-center text-orange-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Diabetes
                            </li>
                          )}
                          {formData.hypertension === "yes" && (
                            <li className="flex items-center text-orange-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Hypertension
                            </li>
                          )}
                          {formData.familyHistory === "yes" && (
                            <li className="flex items-center text-yellow-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Family history
                            </li>
                          )}
                          {formData.exerciseFrequency === "never" && (
                            <li className="flex items-center text-orange-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Sedentary lifestyle
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Symptoms Reported</h4>
                        <ul className="space-y-2">
                          {formData.chestPain && formData.chestPain !== "none" && (
                            <li className="flex items-center">
                              <Heart className="w-4 h-4 mr-2 text-red-500" />
                              Chest pain: {formData.chestPain}
                            </li>
                          )}
                          {formData.breathlessness && formData.breathlessness !== "none" && (
                            <li className="flex items-center">
                              <Activity className="w-4 h-4 mr-2 text-blue-500" />
                              Breathlessness: {formData.breathlessness}
                            </li>
                          )}
                          {formData.palpitations && formData.palpitations !== "none" && (
                            <li className="flex items-center">
                              <Heart className="w-4 h-4 mr-2 text-purple-500" />
                              Palpitations: {formData.palpitations}
                            </li>
                          )}
                          {formData.fatigue && formData.fatigue !== "none" && (
                            <li className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-orange-500" />
                              Fatigue: {formData.fatigue}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <Zap className="w-5 h-5 mr-2" />
                        Immediate Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.recommendations.immediate.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                            <span className="text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Activity className="w-5 h-5 mr-2" />
                        Exercise Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.recommendations.exercise.map((exercise, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span className="text-sm">{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Heart className="w-5 h-5 mr-2" />
                      Heart-Healthy Diet Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.recommendations.dietary.map((diet, index) => (
                        <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm">{diet}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-600">
                      <Target className="w-5 h-5 mr-2" />
                      Monitoring Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.recommendations.monitoring.map((monitor, index) => (
                        <div key={index} className="flex items-start p-3 bg-purple-50 rounded-lg">
                          <Info className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                          <span className="text-sm">{monitor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tests" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <Stethoscope className="w-5 h-5 mr-2" />
                        Essential Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.tests.essential.map((test, index) => (
                        <div key={index} className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-semibold">{test.name}</h4>
                          <p className="text-sm text-gray-600">{test.description}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm font-medium text-red-600">Cost: {test.cost}</p>
                            <p className="text-xs text-gray-500">{test.frequency}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Target className="w-5 h-5 mr-2" />
                        Additional Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.tests.additional.map((test, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold">{test.name}</h4>
                          <p className="text-sm text-gray-600">{test.description}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm font-medium text-blue-600">Cost: {test.cost}</p>
                            <p className="text-xs text-gray-500">{test.frequency}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Important:</strong> If you experience any warning signals, seek immediate medical attention.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-red-600">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Warning Signals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.emergencyPlan.warningSignals.map((signal, index) => (
                          <li key={index} className="flex items-start">
                            <AlertTriangle className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                            <span className="text-sm">{signal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <Shield className="w-5 h-5 mr-2" />
                        First Aid Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {results.emergencyPlan.firstAid.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <Phone className="w-5 h-5 mr-2" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.emergencyPlan.contacts.map((contact, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <Phone className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm">{contact}</span>
                        </div>
                      ))}
                    </div>

                    {/* Personal Emergency Contacts */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-3">Your Emergency Contacts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Your Contact</Label>
                          <p className="text-sm">{formData.phone || "Not provided"}</p>
                          <p className="text-sm text-gray-600">{formData.email || "Not provided"}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Emergency Contact</Label>
                          <p className="text-sm">{formData.emergencyContact || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.medications.current.length > 0 ? (
                      <ul className="space-y-2">
                        {results.medications.current.map((medication, index) => (
                          <li key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span>{medication}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No current medications reported</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Commonly Recommended Cardiac Medications</CardTitle>
                    <p className="text-sm text-gray-600">Information only - always follow your doctor's prescription</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.medications.recommended.map((medication, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold">{medication.name}</div>
                          <div className="text-sm text-gray-600">{medication.purpose}</div>
                          <div className="text-xs text-gray-500 mt-1">{medication.cost}</div>
                        </div>
                      ))}
                    </div>

                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Important:</strong> Never start, stop, or change medications without consulting your
                        doctor. Regular monitoring and blood tests may be required.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-600">
                        <Heart className="w-5 h-5 mr-2" />
                        Diet Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.lifestyle.diet.map((diet, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-sm">{diet}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-600">
                        <Activity className="w-5 h-5 mr-2" />
                        Exercise Guidelines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.lifestyle.exercise.map((exercise, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <span className="text-sm">{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-purple-600">
                        <Shield className="w-5 h-5 mr-2" />
                        Stress Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.lifestyle.stress.map((stress, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                            <span className="text-sm">{stress}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="followup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Follow-up Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-blue-50 rounded-lg mb-6">
                      <h3 className="text-xl font-bold text-blue-900 mb-2">Recommended Check-ups</h3>
                      <p className="text-blue-700">{results.followUp.schedule}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3">Health Goals</h4>
                        <ul className="space-y-2">
                          {results.followUp.goals.map((goal, index) => (
                            <li key={index} className="flex items-center">
                              <Target className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-sm">{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-3">Tracking Schedule</h4>
                        <ul className="space-y-2">
                          {results.followUp.tracking.map((track, index) => (
                            <li key={index} className="flex items-center">
                              <Clock className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-sm">{track}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button onClick={downloadPDF} className="bg-red-600 hover:bg-red-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
              <Button onClick={() => window.print()} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
              <Button onClick={shareResults} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Assessment
              </Button>
              <Button onClick={resetForm} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <Alert className="border-red-200 bg-red-50">
              <Shield className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Medical Disclaimer:</strong> This heart health assessment is for informational purposes only and
                should not replace professional medical advice. Always consult with a qualified cardiologist or
                healthcare provider for proper diagnosis and treatment. Seek immediate medical attention for any cardiac
                emergency symptoms.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <PoweredByFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Heart Health Assessment</h1>
            <p className="text-gray-600">Comprehensive cardiac evaluation with personalized recommendations</p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary">AI-Powered</Badge>
              <Badge variant="secondary">Comprehensive</Badge>
              <Badge variant="secondary">Personalized</Badge>
              <Badge variant="secondary">HIPAA Compliant</Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Heart Health Assessment Form
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
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      placeholder="Enter height in cm"
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

              {/* Symptoms Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Symptoms Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chestPain">Chest Pain</Label>
                    <Select value={formData.chestPain} onValueChange={(value) => handleInputChange("chestPain", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breathlessness">Shortness of Breath</Label>
                    <Select
                      value={formData.breathlessness}
                      onValueChange={(value) => handleInputChange("breathlessness", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild (on exertion)</SelectItem>
                        <SelectItem value="moderate">Moderate (climbing stairs)</SelectItem>
                        <SelectItem value="severe">Severe (at rest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="palpitations">Heart Palpitations</Label>
                    <Select
                      value={formData.palpitations}
                      onValueChange={(value) => handleInputChange("palpitations", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fatigue">Unusual Fatigue</Label>
                    <Select value={formData.fatigue} onValueChange={(value) => handleInputChange("fatigue", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="swelling">Leg/Ankle Swelling</Label>
                    <Select value={formData.swelling} onValueChange={(value) => handleInputChange("swelling", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dizziness">Dizziness/Fainting</Label>
                    <Select value={formData.dizziness} onValueChange={(value) => handleInputChange("dizziness", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Risk Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smoking">Smoking Status</Label>
                    <Select value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <Select value={formData.alcohol} onValueChange={(value) => handleInputChange("alcohol", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate (1-2 drinks/day)</SelectItem>
                        <SelectItem value="heavy">Heavy (&gt;2 drinks/day)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="familyHistory">Family History of Heart Disease</Label>
                    <Select
                      value={formData.familyHistory}
                      onValueChange={(value) => handleInputChange("familyHistory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diabetes">Diabetes</Label>
                    <Select value={formData.diabetes} onValueChange={(value) => handleInputChange("diabetes", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="prediabetes">Pre-diabetes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hypertension">High Blood Pressure</Label>
                    <Select
                      value={formData.hypertension}
                      onValueChange={(value) => handleInputChange("hypertension", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="borderline">Borderline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cholesterol">Cholesterol Levels</Label>
                    <Select
                      value={formData.cholesterol}
                      onValueChange={(value) => handleInputChange("cholesterol", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="borderline">Borderline high</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Lifestyle Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Lifestyle Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                    <Select
                      value={formData.exerciseFrequency}
                      onValueChange={(value) => handleInputChange("exerciseFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="rarely">Rarely (1-2 times/month)</SelectItem>
                        <SelectItem value="sometimes">Sometimes (1-2 times/week)</SelectItem>
                        <SelectItem value="regularly">Regularly (3-4 times/week)</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="stressLevel">Stress Level</Label>
                    <Select
                      value={formData.stressLevel}
                      onValueChange={(value) => handleInputChange("stressLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Select
                      value={formData.sleepQuality}
                      onValueChange={(value) => handleInputChange("sleepQuality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (7-8 hours)</SelectItem>
                        <SelectItem value="good">Good (6-7 hours)</SelectItem>
                        <SelectItem value="fair">Fair (5-6 hours)</SelectItem>
                        <SelectItem value="poor">Poor (&lt;5 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dietType">Diet Type</Label>
                    <Select value={formData.dietType} onValueChange={(value) => handleInputChange("dietType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced diet</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="high-sodium">High sodium</SelectItem>
                        <SelectItem value="processed">Lots of processed food</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodPressure">Blood Pressure (if known)</Label>
                    <Input
                      id="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="restingHeartRate">Resting Heart Rate (if known)</Label>
                    <Input
                      id="restingHeartRate"
                      type="number"
                      value={formData.restingHeartRate}
                      onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
                      placeholder="e.g., 72"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="lastCheckup">Last Cardiac Checkup</Label>
                    <Input
                      id="lastCheckup"
                      value={formData.lastCheckup}
                      onChange={(e) => handleInputChange("lastCheckup", e.target.value)}
                      placeholder="e.g., 6 months ago, Never"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Current Medications and Concerns */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
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
                    <Label htmlFor="concerns">Specific Concerns or Questions</Label>
                    <Textarea
                      id="concerns"
                      value={formData.concerns}
                      onChange={(e) => handleInputChange("concerns", e.target.value)}
                      placeholder="Any specific heart-related concerns or questions you have..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={generateResults}
                disabled={isLoading || !formData.name || !formData.age}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Your Heart Health...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Generate Heart Health Assessment
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
