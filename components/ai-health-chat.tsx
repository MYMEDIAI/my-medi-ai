"use client"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import MyMedLogo from "./mymed-logo"
import {
  Send,
  Mic,
  ImageIcon,
  AlertTriangle,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Shield,
  Activity,
  Heart,
  Zap,
  TrendingUp,
  CheckCircle,
  Sparkles,
  MessageSquare,
  Stethoscope,
  Phone,
  Globe,
  Wifi,
  Database,
  Lock,
  Award,
  Apple,
  Calendar,
  Timer,
  Target,
  FileText,
  BarChart3,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react"

interface DetailedUserProfile {
  // Personal Information
  personalInfo: {
    name: string
    age: number
    gender: string
    dateOfBirth: string
    bloodGroup: string
    height: number
    weight: number
    bmi: number
    bodyFat: number
    muscleMass: number
  }

  // Contact & Location
  contactInfo: {
    phone: string
    email: string
    emergencyContact: string
    address: string
    city: string
    state: string
    pincode: string
    nearestHospital: string
  }

  // Vital Signs History
  vitals: {
    bloodPressure: { systolic: number; diastolic: number; timestamp: Date }[]
    heartRate: { value: number; timestamp: Date }[]
    temperature: { value: number; timestamp: Date }[]
    oxygenSaturation: { value: number; timestamp: Date }[]
    respiratoryRate: { value: number; timestamp: Date }[]
    bloodSugar: { fasting: number; postMeal: number; timestamp: Date }[]
  }

  // Medical History
  medicalHistory: {
    chronicConditions: string[]
    pastSurgeries: { surgery: string; date: string; hospital: string }[]
    allergies: { allergen: string; reaction: string; severity: string }[]
    familyHistory: { condition: string; relation: string; ageOfOnset: number }[]
    immunizations: { vaccine: string; date: string; nextDue: string }[]
  }

  // Current Medications
  medications: {
    prescription: { name: string; dosage: string; frequency: string; startDate: string; prescribedBy: string }[]
    overTheCounter: { name: string; dosage: string; frequency: string; reason: string }[]
    supplements: { name: string; dosage: string; frequency: string; brand: string }[]
  }

  // Lifestyle Factors
  lifestyle: {
    smokingStatus: string
    smokingHistory: { cigarettesPerDay: number; yearsSmoked: number; quitDate: string }
    alcoholConsumption: { frequency: string; unitsPerWeek: number; type: string }
    dietaryHabits: { type: string; restrictions: string[]; preferences: string[] }
    exerciseRoutine: { type: string; frequency: number; duration: number; intensity: string }
    sleepPattern: { bedtime: string; wakeTime: string; hoursOfSleep: number; sleepQuality: number }
    stressLevel: number
    occupationalHazards: string[]
  }

  // Current Symptoms (Detailed)
  currentSymptoms: {
    primaryComplaint: string
    symptomDetails: {
      location: string[]
      character: string
      severity: number
      timing: string
      duration: string
      frequency: string
      onset: string
      progression: string
      alleviatingFactors: string[]
      aggravatingFactors: string[]
      associatedSymptoms: string[]
      previousOccurrence: boolean
      impactOnDailyLife: number
    }
    reviewOfSystems: {
      constitutional: string[]
      cardiovascular: string[]
      respiratory: string[]
      gastrointestinal: string[]
      genitourinary: string[]
      musculoskeletal: string[]
      neurological: string[]
      psychiatric: string[]
      endocrine: string[]
      hematologic: string[]
      dermatologic: string[]
    }
  }
}

interface ComprehensiveAnalysis {
  patientSummary: {
    riskProfile: string
    overallHealthScore: number
    urgencyLevel: "immediate" | "urgent" | "semi-urgent" | "routine" | "wellness"
    confidenceLevel: number
  }

  symptomAnalysis: {
    differentialDiagnosis: {
      condition: string
      probability: number
      reasoning: string
      supportingFactors: string[]
      contradictingFactors: string[]
    }[]
    redFlags: string[]
    clinicalPearls: string[]
    pathophysiology: string
  }

  detailedRecommendations: {
    immediate: {
      actions: string[]
      medications: { name: string; dosage: string; duration: string; instructions: string }[]
      monitoring: string[]
      restrictions: string[]
    }
    shortTerm: {
      followUp: { timeframe: string; specialist: string; tests: string[] }
      lifestyle: string[]
      medications: string[]
    }
    longTerm: {
      prevention: string[]
      monitoring: string[]
      lifestyle: string[]
    }
  }

  diagnosticPlan: {
    laboratoryTests: {
      test: string
      indication: string
      urgency: string
      expectedResults: string
      cost: string
      preparation: string[]
    }[]
    imagingStudies: {
      study: string
      indication: string
      urgency: string
      expectedFindings: string
      cost: string
      preparation: string[]
    }[]
    specialistReferrals: {
      specialty: string
      urgency: string
      reason: string
      expectedOutcome: string
      preparation: string[]
    }[]
  }

  riskAssessment: {
    cardiovascular: { risk: number; factors: string[]; recommendations: string[] }
    diabetes: { risk: number; factors: string[]; recommendations: string[] }
    cancer: { risk: number; factors: string[]; recommendations: string[] }
    mental: { risk: number; factors: string[]; recommendations: string[] }
  }

  personalizedPlan: {
    nutrition: {
      calories: number
      macronutrients: { protein: number; carbs: number; fats: number }
      micronutrients: string[]
      mealPlan: { meal: string; foods: string[]; timing: string }[]
      restrictions: string[]
      supplements: { name: string; dosage: string; timing: string; reason: string }[]
    }
    exercise: {
      cardio: { type: string; duration: number; frequency: number; intensity: string }
      strength: { exercises: string[]; sets: number; reps: number; frequency: number }
      flexibility: { exercises: string[]; duration: number; frequency: number }
      restrictions: string[]
      progressionPlan: string[]
    }
    monitoring: {
      vitals: { parameter: string; frequency: string; targetRange: string; method: string }[]
      symptoms: { symptom: string; frequency: string; method: string }[]
      labTests: { test: string; frequency: string; targetRange: string }[]
    }
  }
}

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  analysis?: ComprehensiveAnalysis
  userProfile?: Partial<DetailedUserProfile>
  confidence?: number
  category?: string
  urgency?: "immediate" | "urgent" | "semi-urgent" | "routine" | "wellness"
  suggestions?: string[]
}

export default function AIHealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `🩺 **Welcome to MyMedi.ai - Advanced Comprehensive Health Analysis System**

I'm Dr. MyMedi, your AI Health Specialist powered by advanced medical AI and trained on comprehensive medical databases. I provide **minute-level detailed analysis** and **comprehensive health assessments**.

**🔬 What Makes Me Different:**
• **Comprehensive Data Collection** - I gather detailed health information
• **Minute-Level Analysis** - Every symptom analyzed in detail
• **Personalized Risk Assessment** - Individual health risk profiling
• **Detailed Treatment Plans** - Step-by-step health management
• **Continuous Monitoring** - Track your health journey

**📊 Comprehensive Analysis Includes:**
• **Differential Diagnosis** with probability percentages
• **Detailed Risk Assessment** for major health conditions
• **Personalized Treatment Plans** with specific timelines
• **Laboratory & Imaging Recommendations** with cost estimates
• **Lifestyle Modifications** with measurable targets
• **Follow-up Schedules** with specialist referrals

**🎯 To Get Started:**
I'll need to collect comprehensive information about you. This includes:
- Personal & contact information
- Detailed medical history
- Current medications & supplements
- Lifestyle factors & habits
- Comprehensive symptom analysis
- Vital signs & measurements

**Ready for a comprehensive health analysis?** 
Click "Start Comprehensive Assessment" or describe your health concern in detail.`,
      timestamp: new Date(),
      confidence: 100,
      category: "welcome",
      urgency: "routine",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDetailedForm, setShowDetailedForm] = useState(false)
  const [userProfile, setUserProfile] = useState<DetailedUserProfile>({
    personalInfo: {
      name: "",
      age: 0,
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      height: 0,
      weight: 0,
      bmi: 0,
      bodyFat: 0,
      muscleMass: 0,
    },
    contactInfo: {
      phone: "",
      email: "",
      emergencyContact: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      nearestHospital: "",
    },
    vitals: {
      bloodPressure: [],
      heartRate: [],
      temperature: [],
      oxygenSaturation: [],
      respiratoryRate: [],
      bloodSugar: [],
    },
    medicalHistory: {
      chronicConditions: [],
      pastSurgeries: [],
      allergies: [],
      familyHistory: [],
      immunizations: [],
    },
    medications: {
      prescription: [],
      overTheCounter: [],
      supplements: [],
    },
    lifestyle: {
      smokingStatus: "",
      smokingHistory: { cigarettesPerDay: 0, yearsSmoked: 0, quitDate: "" },
      alcoholConsumption: { frequency: "", unitsPerWeek: 0, type: "" },
      dietaryHabits: { type: "", restrictions: [], preferences: [] },
      exerciseRoutine: { type: "", frequency: 0, duration: 0, intensity: "" },
      sleepPattern: { bedtime: "", wakeTime: "", hoursOfSleep: 0, sleepQuality: 0 },
      stressLevel: 0,
      occupationalHazards: [],
    },
    currentSymptoms: {
      primaryComplaint: "",
      symptomDetails: {
        location: [],
        character: "",
        severity: 0,
        timing: "",
        duration: "",
        frequency: "",
        onset: "",
        progression: "",
        alleviatingFactors: [],
        aggravatingFactors: [],
        associatedSymptoms: [],
        previousOccurrence: false,
        impactOnDailyLife: 0,
      },
      reviewOfSystems: {
        constitutional: [],
        cardiovascular: [],
        respiratory: [],
        gastrointestinal: [],
        genitourinary: [],
        musculoskeletal: [],
        neurological: [],
        psychiatric: [],
        endocrine: [],
        hematologic: [],
        dermatologic: [],
      },
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateComprehensiveAnalysis = async (profile: DetailedUserProfile): Promise<ComprehensiveAnalysis> => {
    // Simulate comprehensive AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const bmi = profile.personalInfo.weight / Math.pow(profile.personalInfo.height / 100, 2)
    const age = profile.personalInfo.age
    const severity = profile.currentSymptoms.symptomDetails.severity

    return {
      patientSummary: {
        riskProfile: severity > 7 ? "High Risk" : severity > 4 ? "Moderate Risk" : "Low Risk",
        overallHealthScore: Math.max(20, 100 - severity * 8 - (age > 65 ? 15 : 0) - (bmi > 30 ? 10 : 0)),
        urgencyLevel: severity > 8 ? "immediate" : severity > 6 ? "urgent" : severity > 4 ? "semi-urgent" : "routine",
        confidenceLevel: 94,
      },

      symptomAnalysis: {
        differentialDiagnosis: [
          {
            condition: "Primary Condition Based on Symptoms",
            probability: 75,
            reasoning: "Based on symptom pattern, duration, and associated factors",
            supportingFactors: ["Symptom severity", "Duration of symptoms", "Associated symptoms"],
            contradictingFactors: ["Age factor", "No fever present"],
          },
          {
            condition: "Secondary Differential",
            probability: 20,
            reasoning: "Alternative diagnosis considering patient history",
            supportingFactors: ["Medical history", "Family history"],
            contradictingFactors: ["Symptom pattern doesn't fully match"],
          },
        ],
        redFlags: [
          "Monitor for worsening symptoms",
          "Watch for signs of complications",
          "Seek immediate care if symptoms worsen",
        ],
        clinicalPearls: [
          "Early intervention improves outcomes",
          "Patient education is crucial for management",
          "Regular monitoring prevents complications",
        ],
        pathophysiology:
          "Detailed explanation of the underlying disease process and how it relates to the patient's symptoms and presentation.",
      },

      detailedRecommendations: {
        immediate: {
          actions: [
            "Rest and avoid strenuous activities",
            "Monitor symptoms every 2-4 hours",
            "Maintain adequate hydration (8-10 glasses water daily)",
            "Apply appropriate hot/cold therapy as needed",
          ],
          medications: [
            {
              name: "Paracetamol",
              dosage: "500-1000mg",
              duration: "Every 6-8 hours as needed",
              instructions: "Take with food, maximum 4g per day",
            },
          ],
          monitoring: [
            "Temperature every 4 hours",
            "Pain level on 1-10 scale every 6 hours",
            "Sleep quality and duration",
            "Appetite and fluid intake",
          ],
          restrictions: [
            "Avoid alcohol consumption",
            "No driving if experiencing dizziness",
            "Limit physical exertion",
          ],
        },
        shortTerm: {
          followUp: {
            timeframe: "48-72 hours if no improvement",
            specialist: "General Physician or relevant specialist",
            tests: ["Complete Blood Count", "Basic Metabolic Panel"],
          },
          lifestyle: [
            "Maintain regular sleep schedule (7-9 hours)",
            "Eat balanced, nutritious meals",
            "Stay hydrated throughout the day",
            "Practice stress reduction techniques",
          ],
          medications: [
            "Continue current medications as prescribed",
            "Consider probiotics if on antibiotics",
            "Vitamin D supplementation if deficient",
          ],
        },
        longTerm: {
          prevention: [
            "Regular health screenings as per age guidelines",
            "Maintain healthy weight (BMI 18.5-24.9)",
            "Regular exercise routine (150 min/week moderate activity)",
            "Stress management and mental health care",
          ],
          monitoring: [
            "Annual comprehensive health checkup",
            "Blood pressure monitoring if hypertensive",
            "Blood sugar monitoring if diabetic",
            "Regular specialist follow-ups as needed",
          ],
          lifestyle: [
            "Mediterranean-style diet rich in fruits and vegetables",
            "Regular physical activity appropriate for age and condition",
            "Adequate sleep hygiene practices",
            "Social engagement and mental stimulation",
          ],
        },
      },

      diagnosticPlan: {
        laboratoryTests: [
          {
            test: "Complete Blood Count (CBC)",
            indication: "Rule out infection, anemia, or blood disorders",
            urgency: "Within 24-48 hours",
            expectedResults: "Normal values: WBC 4,000-11,000, Hgb 12-16 g/dL",
            cost: "₹300-500",
            preparation: ["No fasting required", "Bring previous reports"],
          },
          {
            test: "Comprehensive Metabolic Panel",
            indication: "Assess kidney function, electrolytes, liver function",
            urgency: "Within 48-72 hours",
            expectedResults: "Normal kidney and liver function expected",
            cost: "₹800-1200",
            preparation: ["8-12 hour fasting required", "Only water allowed"],
          },
        ],
        imagingStudies: [
          {
            study: "Chest X-ray",
            indication: "Rule out pulmonary pathology",
            urgency: "If respiratory symptoms present",
            expectedFindings: "Normal lung fields expected",
            cost: "₹200-400",
            preparation: ["Remove metal objects", "Wear hospital gown"],
          },
        ],
        specialistReferrals: [
          {
            specialty: "Internal Medicine",
            urgency: "Within 1-2 weeks",
            reason: "Comprehensive evaluation and management",
            expectedOutcome: "Detailed diagnosis and treatment plan",
            preparation: ["Bring all medical records", "List of current medications", "Insurance documents"],
          },
        ],
      },

      riskAssessment: {
        cardiovascular: {
          risk: age > 45 ? 25 : 10,
          factors: ["Age", "Family history", "Lifestyle factors"],
          recommendations: ["Regular BP monitoring", "Cholesterol screening", "Exercise routine"],
        },
        diabetes: {
          risk: bmi > 25 ? 20 : 8,
          factors: ["BMI", "Family history", "Sedentary lifestyle"],
          recommendations: ["Blood sugar monitoring", "Weight management", "Dietary modifications"],
        },
        cancer: {
          risk: 5,
          factors: ["Age", "Environmental factors"],
          recommendations: ["Regular screenings", "Healthy lifestyle", "Avoid carcinogens"],
        },
        mental: {
          risk: 15,
          factors: ["Stress level", "Social support", "Work-life balance"],
          recommendations: ["Stress management", "Regular exercise", "Social connections"],
        },
      },

      personalizedPlan: {
        nutrition: {
          calories: Math.round(1800 + profile.personalInfo.weight * 10 + profile.personalInfo.height * 6.25 - age * 5),
          macronutrients: { protein: 120, carbs: 200, fats: 70 },
          micronutrients: ["Vitamin D", "Vitamin B12", "Iron", "Calcium", "Omega-3"],
          mealPlan: [
            { meal: "Breakfast", foods: ["Oats with fruits", "Greek yogurt", "Nuts"], timing: "7:00-8:00 AM" },
            { meal: "Lunch", foods: ["Brown rice", "Dal", "Vegetables", "Salad"], timing: "12:00-1:00 PM" },
            { meal: "Dinner", foods: ["Roti", "Vegetable curry", "Soup"], timing: "7:00-8:00 PM" },
          ],
          restrictions: ["Limit processed foods", "Reduce sodium intake", "Avoid trans fats"],
          supplements: [
            { name: "Vitamin D3", dosage: "2000 IU", timing: "With breakfast", reason: "Bone health and immunity" },
            { name: "Omega-3", dosage: "1000mg", timing: "With dinner", reason: "Heart and brain health" },
          ],
        },
        exercise: {
          cardio: { type: "Brisk walking", duration: 30, frequency: 5, intensity: "Moderate" },
          strength: { exercises: ["Push-ups", "Squats", "Planks"], sets: 3, reps: 12, frequency: 3 },
          flexibility: { exercises: ["Yoga", "Stretching"], duration: 15, frequency: 7 },
          restrictions: ["Avoid high-impact if joint pain", "Start slowly and progress gradually"],
          progressionPlan: ["Week 1-2: Build routine", "Week 3-4: Increase intensity", "Month 2+: Add variety"],
        },
        monitoring: {
          vitals: [
            { parameter: "Blood Pressure", frequency: "Weekly", targetRange: "<120/80 mmHg", method: "Home monitor" },
            { parameter: "Weight", frequency: "Weekly", targetRange: "BMI 18.5-24.9", method: "Digital scale" },
            {
              parameter: "Heart Rate",
              frequency: "During exercise",
              targetRange: "50-85% max HR",
              method: "Fitness tracker",
            },
          ],
          symptoms: [
            { symptom: "Pain level", frequency: "Daily", method: "1-10 scale diary" },
            { symptom: "Sleep quality", frequency: "Daily", method: "Sleep diary" },
            { symptom: "Energy level", frequency: "Daily", method: "Subjective rating" },
          ],
          labTests: [
            { test: "HbA1c", frequency: "Every 3 months", targetRange: "<7%" },
            { test: "Lipid profile", frequency: "Every 6 months", targetRange: "LDL <100 mg/dL" },
          ],
        },
      },
    }
  }

  const handleComprehensiveAnalysis = async () => {
    if (!userProfile.personalInfo.name || !userProfile.currentSymptoms.primaryComplaint) {
      alert("Please fill in at least basic information and primary complaint")
      return
    }

    setIsLoading(true)

    try {
      const analysis = await generateComprehensiveAnalysis(userProfile)

      const analysisMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content:
          "## 🔬 **Comprehensive Health Analysis Complete**\n\nYour detailed analysis is ready. Please review all sections carefully.",
        timestamp: new Date(),
        analysis,
        userProfile,
        confidence: analysis.patientSummary.confidenceLevel,
        urgency: analysis.patientSummary.urgencyLevel,
        category: "comprehensive_analysis",
      }

      setMessages((prev) => [...prev, analysisMessage])
      setShowDetailedForm(false)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = (section: keyof DetailedUserProfile, field: string, value: any) => {
    setUserProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const renderComprehensiveAnalysis = (analysis: ComprehensiveAnalysis, profile: Partial<DetailedUserProfile>) => {
    return (
      <div className="space-y-8 mt-6">
        {/* Patient Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <User className="w-6 h-6 mr-3" />
              Patient Summary & Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600">{analysis.patientSummary.overallHealthScore}</div>
                <div className="text-sm text-gray-600">Health Score</div>
                <Progress value={analysis.patientSummary.overallHealthScore} className="mt-2" />
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div
                  className={`text-2xl font-bold ${
                    analysis.patientSummary.urgencyLevel === "immediate"
                      ? "text-red-600"
                      : analysis.patientSummary.urgencyLevel === "urgent"
                        ? "text-orange-600"
                        : analysis.patientSummary.urgencyLevel === "semi-urgent"
                          ? "text-yellow-600"
                          : "text-green-600"
                  }`}
                >
                  {analysis.patientSummary.urgencyLevel.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">Urgency Level</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">{analysis.patientSummary.confidenceLevel}%</div>
                <div className="text-sm text-gray-600">AI Confidence</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div
                  className={`text-lg font-bold ${
                    analysis.patientSummary.riskProfile === "High Risk"
                      ? "text-red-600"
                      : analysis.patientSummary.riskProfile === "Moderate Risk"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {analysis.patientSummary.riskProfile}
                </div>
                <div className="text-sm text-gray-600">Risk Profile</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Differential Diagnosis */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <Stethoscope className="w-6 h-6 mr-3" />
              Differential Diagnosis & Clinical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.symptomAnalysis.differentialDiagnosis.map((diagnosis, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">{diagnosis.condition}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">{diagnosis.probability}% Probability</Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{diagnosis.reasoning}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-green-800 mb-2">Supporting Factors:</h5>
                    <ul className="space-y-1">
                      {diagnosis.supportingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-800 mb-2">Contradicting Factors:</h5>
                    <ul className="space-y-1">
                      {diagnosis.contradictingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Red Flags - Seek Immediate Care If:
              </h4>
              <ul className="space-y-1">
                {analysis.symptomAnalysis.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-red-800 text-sm">
                    • {flag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Clinical Pearls:
              </h4>
              <ul className="space-y-1">
                {analysis.symptomAnalysis.clinicalPearls.map((pearl, idx) => (
                  <li key={idx} className="text-blue-800 text-sm">
                    • {pearl}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">Pathophysiology:</h4>
              <p className="text-purple-800 text-sm">{analysis.symptomAnalysis.pathophysiology}</p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Recommendations */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <Target className="w-6 h-6 mr-3" />
              Comprehensive Treatment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="immediate" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="immediate">Immediate (0-24h)</TabsTrigger>
                <TabsTrigger value="shortterm">Short-term (1-4 weeks)</TabsTrigger>
                <TabsTrigger value="longterm">Long-term (1+ months)</TabsTrigger>
              </TabsList>

              <TabsContent value="immediate" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-red-800 mb-3">Immediate Actions:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.immediate.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-blue-800 mb-3">Medications:</h4>
                    <div className="space-y-3">
                      {analysis.detailedRecommendations.immediate.medications.map((med, idx) => (
                        <div key={idx} className="border border-blue-200 p-3 rounded">
                          <div className="font-semibold text-blue-900">{med.name}</div>
                          <div className="text-sm text-gray-700">Dosage: {med.dosage}</div>
                          <div className="text-sm text-gray-700">Duration: {med.duration}</div>
                          <div className="text-sm text-gray-600 italic">{med.instructions}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-purple-800 mb-3">Monitoring Parameters:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.immediate.monitoring.map((param, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Timer className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                          {param}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-orange-800 mb-3">Restrictions:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.immediate.restrictions.map((restriction, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5" />
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shortterm" className="space-y-4 mt-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-bold text-green-800 mb-4">Follow-up Plan:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded">
                      <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="font-semibold">
                        {analysis.detailedRecommendations.shortTerm.followUp.timeframe}
                      </div>
                      <div className="text-sm text-gray-600">Timeline</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded">
                      <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="font-semibold">
                        {analysis.detailedRecommendations.shortTerm.followUp.specialist}
                      </div>
                      <div className="text-sm text-gray-600">Specialist</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded">
                      <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold">
                        {analysis.detailedRecommendations.shortTerm.followUp.tests.length} Tests
                      </div>
                      <div className="text-sm text-gray-600">Recommended</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2">Recommended Tests:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysis.detailedRecommendations.shortTerm.followUp.tests.map((test, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-blue-800 mb-3">Lifestyle Modifications:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.shortTerm.lifestyle.map((lifestyle, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Apple className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          {lifestyle}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-purple-800 mb-3">Medication Adjustments:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.shortTerm.medications.map((med, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Zap className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="longterm" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-green-800 mb-3">Prevention Strategies:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.longTerm.prevention.map((prevention, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Shield className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          {prevention}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-blue-800 mb-3">Long-term Monitoring:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.longTerm.monitoring.map((monitor, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Activity className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                          {monitor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-purple-800 mb-3">Lifestyle Maintenance:</h4>
                    <ul className="space-y-2">
                      {analysis.detailedRecommendations.longTerm.lifestyle.map((lifestyle, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <Heart className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                          {lifestyle}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Diagnostic Plan */}
        <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center text-cyan-900">
              <FileText className="w-6 h-6 mr-3" />
              Comprehensive Diagnostic Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lab" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lab">Laboratory Tests</TabsTrigger>
                <TabsTrigger value="imaging">Imaging Studies</TabsTrigger>
                <TabsTrigger value="referrals">Specialist Referrals</TabsTrigger>
              </TabsList>

              <TabsContent value="lab" className="mt-6">
                <div className="space-y-4">
                  {analysis.diagnosticPlan.laboratoryTests.map((test, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow border-l-4 border-cyan-500">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{test.test}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${
                              test.urgency.includes("24")
                                ? "bg-red-100 text-red-800"
                                : test.urgency.includes("48")
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {test.urgency}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">{test.cost}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Indication:</h5>
                          <p className="text-sm text-gray-700">{test.indication}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Expected Results:</h5>
                          <p className="text-sm text-gray-700">{test.expectedResults}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Preparation Instructions:</h5>
                        <ul className="space-y-1">
                          {test.preparation.map((prep, prepIdx) => (
                            <li key={prepIdx} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              {prep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="imaging" className="mt-6">
                <div className="space-y-4">
                  {analysis.diagnosticPlan.imagingStudies.map((study, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{study.study}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-purple-100 text-purple-800">{study.urgency}</Badge>
                          <Badge className="bg-green-100 text-green-800">{study.cost}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Clinical Indication:</h5>
                          <p className="text-sm text-gray-700">{study.indication}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Expected Findings:</h5>
                          <p className="text-sm text-gray-700">{study.expectedFindings}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Preparation Required:</h5>
                        <ul className="space-y-1">
                          {study.preparation.map((prep, prepIdx) => (
                            <li key={prepIdx} className="flex items-center text-sm text-gray-700">
                              <Info className="w-4 h-4 text-blue-500 mr-2" />
                              {prep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="referrals" className="mt-6">
                <div className="space-y-4">
                  {analysis.diagnosticPlan.specialistReferrals.map((referral, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{referral.specialty}</h4>
                        <Badge
                          className={`${
                            referral.urgency.includes("week")
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {referral.urgency}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Reason for Referral:</h5>
                          <p className="text-sm text-gray-700">{referral.reason}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Expected Outcome:</h5>
                          <p className="text-sm text-gray-700">{referral.expectedOutcome}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Preparation for Visit:</h5>
                        <ul className="space-y-1">
                          {referral.preparation.map((prep, prepIdx) => (
                            <li key={prepIdx} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                              {prep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-900">
              <BarChart3 className="w-6 h-6 mr-3" />
              Comprehensive Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(analysis.riskAssessment).map(([category, data]) => (
                <div key={category} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold capitalize text-gray-900">{category} Risk</h4>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`text-2xl font-bold ${
                          data.risk > 30 ? "text-red-600" : data.risk > 15 ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        {data.risk}%
                      </div>
                    </div>
                  </div>

                  <Progress
                    value={data.risk}
                    className={`mb-4 ${
                      data.risk > 30
                        ? "[&>div]:bg-red-500"
                        : data.risk > 15
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                    }`}
                  />

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Risk Factors:</h5>
                      <ul className="space-y-1">
                        {data.factors.map((factor, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {data.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Plan */}
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center text-teal-900">
              <Target className="w-6 h-6 mr-3" />
              Personalized Health Management Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="nutrition" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="nutrition">Nutrition Plan</TabsTrigger>
                <TabsTrigger value="exercise">Exercise Program</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="nutrition" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-teal-600">
                      {analysis.personalizedPlan.nutrition.calories}
                    </div>
                    <div className="text-sm text-gray-600">Daily Calories</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.personalizedPlan.nutrition.macronutrients.protein}g
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.personalizedPlan.nutrition.macronutrients.carbs}g
                    </div>
                    <div className="text-sm text-gray-600">Carbohydrates</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analysis.personalizedPlan.nutrition.macronutrients.fats}g
                    </div>
                    <div className="text-sm text-gray-600">Fats</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.personalizedPlan.nutrition.mealPlan.map((meal, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow">
                      <h4 className="font-bold text-gray-900 mb-2">{meal.meal}</h4>
                      <div className="text-sm text-gray-600 mb-2">{meal.timing}</div>
                      <ul className="space-y-1">
                        {meal.foods.map((food, foodIdx) => (
                          <li key={foodIdx} className="flex items-center text-sm text-gray-700">
                            <Apple className="w-4 h-4 text-green-500 mr-2" />
                            {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-900 mb-3">Recommended Supplements:</h4>
                    <div className="space-y-3">
                      {analysis.personalizedPlan.nutrition.supplements.map((supplement, idx) => (
                        <div key={idx} className="border border-teal-200 p-3 rounded">
                          <div className="font-semibold text-teal-900">{supplement.name}</div>
                          <div className="text-sm text-gray-700">Dosage: {supplement.dosage}</div>
                          <div className="text-sm text-gray-700">Timing: {supplement.timing}</div>
                          <div className="text-sm text-gray-600 italic">{supplement.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-900 mb-3">Dietary Restrictions:</h4>
                    <ul className="space-y-2">
                      {analysis.personalizedPlan.nutrition.restrictions.map((restriction, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                          {restriction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="exercise" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Cardiovascular Exercise
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <strong>Type:</strong> {analysis.personalizedPlan.exercise.cardio.type}
                      </div>
                      <div>
                        <strong>Duration:</strong> {analysis.personalizedPlan.exercise.cardio.duration} minutes
                      </div>
                      <div>
                        <strong>Frequency:</strong> {analysis.personalizedPlan.exercise.cardio.frequency} times/week
                      </div>
                      <div>
                        <strong>Intensity:</strong> {analysis.personalizedPlan.exercise.cardio.intensity}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-green-900 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Strength Training
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <strong>Sets:</strong> {analysis.personalizedPlan.exercise.strength.sets}
                      </div>
                      <div>
                        <strong>Reps:</strong> {analysis.personalizedPlan.exercise.strength.reps}
                      </div>
                      <div>
                        <strong>Frequency:</strong> {analysis.personalizedPlan.exercise.strength.frequency} times/week
                      </div>
                    </div>
                    <div className="mt-3">
                      <strong>Exercises:</strong>
                      <ul className="mt-1 space-y-1">
                        {analysis.personalizedPlan.exercise.strength.exercises.map((exercise, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Flexibility & Recovery
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <strong>Duration:</strong> {analysis.personalizedPlan.exercise.flexibility.duration} minutes
                      </div>
                      <div>
                        <strong>Frequency:</strong> {analysis.personalizedPlan.exercise.flexibility.frequency}{" "}
                        times/week
                      </div>
                    </div>
                    <div className="mt-3">
                      <strong>Activities:</strong>
                      <ul className="mt-1 space-y-1">
                        {analysis.personalizedPlan.exercise.flexibility.exercises.map((exercise, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-bold text-red-900 mb-3">Exercise Restrictions & Precautions:</h4>
                  <ul className="space-y-2">
                    {analysis.personalizedPlan.exercise.restrictions.map((restriction, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                        {restriction}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="font-bold text-green-900 mb-3">Progression Plan:</h4>
                  <ul className="space-y-2">
                    {analysis.personalizedPlan.exercise.progressionPlan.map((step, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="monitoring" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Vital Signs Monitoring
                    </h4>
                    <div className="space-y-3">
                      {analysis.personalizedPlan.monitoring.vitals.map((vital, idx) => (
                        <div key={idx} className="border border-blue-200 p-3 rounded">
                          <div className="font-semibold text-blue-900">{vital.parameter}</div>
                          <div className="text-sm text-gray-700">Frequency: {vital.frequency}</div>
                          <div className="text-sm text-gray-700">Target: {vital.targetRange}</div>
                          <div className="text-sm text-gray-600">Method: {vital.method}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-green-900 mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Symptom Tracking
                    </h4>
                    <div className="space-y-3">
                      {analysis.personalizedPlan.monitoring.symptoms.map((symptom, idx) => (
                        <div key={idx} className="border border-green-200 p-3 rounded">
                          <div className="font-semibold text-green-900">{symptom.symptom}</div>
                          <div className="text-sm text-gray-700">Frequency: {symptom.frequency}</div>
                          <div className="text-sm text-gray-600">Method: {symptom.method}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h4 className="font-bold text-purple-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Laboratory Monitoring
                    </h4>
                    <div className="space-y-3">
                      {analysis.personalizedPlan.monitoring.labTests.map((test, idx) => (
                        <div key={idx} className="border border-purple-200 p-3 rounded">
                          <div className="font-semibold text-purple-900">{test.test}</div>
                          <div className="text-sm text-gray-700">Frequency: {test.frequency}</div>
                          <div className="text-sm text-gray-700">Target: {test.targetRange}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Phone className="w-4 h-4 mr-2" />
            Schedule Follow-up
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Calendar className="w-4 h-4 mr-2" />
            Book Tests
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <FileText className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask Follow-up Question
          </Button>
        </div>
      </div>
    )
  }

  const renderDetailedForm = () => {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <User className="w-6 h-6 mr-3" />
            Comprehensive Health Assessment Form
          </CardTitle>
          <p className="text-gray-600">Please provide detailed information for accurate analysis</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={userProfile.personalInfo.name}
                      onChange={(e) => updateUserProfile("personalInfo", "name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={userProfile.personalInfo.age}
                      onChange={(e) => updateUserProfile("personalInfo", "age", Number.parseInt(e.target.value))}
                      placeholder="Enter your age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => updateUserProfile("personalInfo", "gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={userProfile.personalInfo.dateOfBirth}
                      onChange={(e) => updateUserProfile("personalInfo", "dateOfBirth", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select onValueChange={(value) => updateUserProfile("personalInfo", "bloodGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
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

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      value={userProfile.personalInfo.height}
                      onChange={(e) => updateUserProfile("personalInfo", "height", Number.parseFloat(e.target.value))}
                      placeholder="Enter height in cm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={userProfile.personalInfo.weight}
                      onChange={(e) => updateUserProfile("personalInfo", "weight", Number.parseFloat(e.target.value))}
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyFat">Body Fat % (if known)</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      value={userProfile.personalInfo.bodyFat}
                      onChange={(e) => updateUserProfile("personalInfo", "bodyFat", Number.parseFloat(e.target.value))}
                      placeholder="Enter body fat percentage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={userProfile.contactInfo.phone}
                      onChange={(e) => updateUserProfile("contactInfo", "phone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.contactInfo.email}
                      onChange={(e) => updateUserProfile("contactInfo", "email", e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Complete Address</Label>
                  <Textarea
                    id="address"
                    value={userProfile.contactInfo.address}
                    onChange={(e) => updateUserProfile("contactInfo", "address", e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={userProfile.contactInfo.city}
                      onChange={(e) => updateUserProfile("contactInfo", "city", e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={userProfile.contactInfo.state}
                      onChange={(e) => updateUserProfile("contactInfo", "state", e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={userProfile.contactInfo.pincode}
                      onChange={(e) => updateUserProfile("contactInfo", "pincode", e.target.value)}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-6 mt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="primaryComplaint">Primary Health Concern/Complaint *</Label>
                  <Textarea
                    id="primaryComplaint"
                    value={userProfile.currentSymptoms.primaryComplaint}
                    onChange={(e) => updateUserProfile("currentSymptoms", "primaryComplaint", e.target.value)}
                    placeholder="Describe your main health concern in detail"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="character">Character of Symptoms</Label>
                    <Select
                      onValueChange={(value) => {
                        const newDetails = { ...userProfile.currentSymptoms.symptomDetails, character: value }
                        setUserProfile((prev) => ({
                          ...prev,
                          currentSymptoms: { ...prev.currentSymptoms, symptomDetails: newDetails },
                        }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select symptom character" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sharp">Sharp</SelectItem>
                        <SelectItem value="dull">Dull</SelectItem>
                        <SelectItem value="throbbing">Throbbing</SelectItem>
                        <SelectItem value="burning">Burning</SelectItem>
                        <SelectItem value="cramping">Cramping</SelectItem>
                        <SelectItem value="stabbing">Stabbing</SelectItem>
                        <SelectItem value="aching">Aching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration of Symptoms</Label>
                    <Select
                      onValueChange={(value) => {
                        const newDetails = { ...userProfile.currentSymptoms.symptomDetails, duration: value }
                        setUserProfile((prev) => ({
                          ...prev,
                          currentSymptoms: { ...prev.currentSymptoms, symptomDetails: newDetails },
                        }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="severity">Symptom Severity (1-10 scale)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[userProfile.currentSymptoms.symptomDetails.severity]}
                      onValueChange={(value) => {
                        const newDetails = { ...userProfile.currentSymptoms.symptomDetails, severity: value[0] }
                        setUserProfile((prev) => ({
                          ...prev,
                          currentSymptoms: { ...prev.currentSymptoms, symptomDetails: newDetails },
                        }))
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 (Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>10 (Severe)</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Current: {userProfile.currentSymptoms.symptomDetails.severity}/10
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timing">When do symptoms occur?</Label>
                  <Select
                    onValueChange={(value) => {
                      const newDetails = { ...userProfile.currentSymptoms.symptomDetails, timing: value }
                      setUserProfile((prev) => ({
                        ...prev,
                        currentSymptoms: { ...prev.currentSymptoms, symptomDetails: newDetails },
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="constant">Constant</SelectItem>
                      <SelectItem value="intermittent">Intermittent</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="after-meals">After meals</SelectItem>
                      <SelectItem value="before-meals">Before meals</SelectItem>
                      <SelectItem value="with-activity">With activity</SelectItem>
                      <SelectItem value="at-rest">At rest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="impactOnLife">Impact on Daily Life (1-10 scale)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[userProfile.currentSymptoms.symptomDetails.impactOnDailyLife]}
                      onValueChange={(value) => {
                        const newDetails = {
                          ...userProfile.currentSymptoms.symptomDetails,
                          impactOnDailyLife: value[0],
                        }
                        setUserProfile((prev) => ({
                          ...prev,
                          currentSymptoms: { ...prev.currentSymptoms, symptomDetails: newDetails },
                        }))
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 (No impact)</span>
                      <span>5 (Moderate impact)</span>
                      <span>10 (Severe impact)</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-purple-100 text-purple-800">
                        Impact: {userProfile.currentSymptoms.symptomDetails.impactOnDailyLife}/10
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Add other tabs content here - medical history, medications, lifestyle, vitals */}
            <TabsContent value="medical" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Medical History section - Add chronic conditions, past surgeries, allergies, family history, etc.</p>
                <p className="text-sm mt-2">This section would contain detailed medical history forms</p>
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Medications section - Add current prescriptions, OTC medications, supplements</p>
                <p className="text-sm mt-2">This section would contain detailed medication forms</p>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Lifestyle section - Add smoking, alcohol, diet, exercise, sleep patterns</p>
                <p className="text-sm mt-2">This section would contain detailed lifestyle assessment forms</p>
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-6 mt-6">
              <div className="text-center text-gray-500">
                <p>Vitals section - Add blood pressure, heart rate, temperature, etc.</p>
                <p className="text-sm mt-2">This section would contain detailed vital signs input forms</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setShowDetailedForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleComprehensiveAnalysis}
              disabled={isLoading || !userProfile.personalInfo.name || !userProfile.currentSymptoms.primaryComplaint}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Comprehensive Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Simulate AI response with detailed analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Thank you for your detailed question: "${inputMessage}"

I understand you're looking for comprehensive health guidance. To provide you with the most accurate and detailed analysis, I recommend completing our **Comprehensive Health Assessment Form**.

**Why the detailed form is important:**
• **Personalized Analysis** - Every individual is unique
• **Risk Assessment** - Identify potential health risks early
• **Targeted Recommendations** - Specific to your health profile
• **Monitoring Plan** - Track your health journey effectively

**What you'll get:**
✅ **Differential Diagnosis** with probability percentages
✅ **Detailed Risk Assessment** for major health conditions  
✅ **Personalized Treatment Plan** with specific timelines
✅ **Laboratory & Imaging Recommendations** with cost estimates
✅ **Lifestyle Modifications** with measurable targets
✅ **Follow-up Schedule** with specialist referrals

Would you like to start the comprehensive assessment, or do you have specific questions about your symptoms?`,
        timestamp: new Date(),
        confidence: 95,
        category: "guidance",
        urgency: "routine",
        suggestions: [
          "Start Comprehensive Assessment",
          "Ask about specific symptoms",
          "Get medication guidance",
          "Discuss lifestyle changes",
          "Emergency consultation",
        ],
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (showDetailedForm) {
    return renderDetailedForm()
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MyMedLogo className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold text-white">MyMedi.ai Health Chat</h2>
              <p className="text-blue-100">Advanced AI Health Analysis & Comprehensive Care</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500 text-white">
              <Wifi className="w-3 h-3 mr-1" />
              Online
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </div>
      </div>

      <div className="h-[600px] overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-4xl rounded-2xl p-4 ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : message.type === "system"
                    ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                    : "bg-gray-50 border border-gray-200"
              }`}
            >
              {message.type === "ai" && (
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dr. MyMedi AI</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {message.timestamp.toLocaleTimeString()}
                      {message.confidence && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-green-600">{message.confidence}% Confidence</span>
                        </>
                      )}
                      {message.urgency && (
                        <>
                          <span className="mx-2">•</span>
                          <Badge
                            className={`text-xs ${
                              message.urgency === "immediate"
                                ? "bg-red-100 text-red-800"
                                : message.urgency === "urgent"
                                  ? "bg-orange-100 text-orange-800"
                                  : message.urgency === "semi-urgent"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {message.urgency}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="prose prose-sm max-w-none">
                {message.content.split("\n").map((line, index) => (
                  <p
                    key={index}
                    className={`${
                      message.type === "user" ? "text-white" : "text-gray-800"
                    } ${line.startsWith("**") ? "font-bold" : ""} ${
                      line.startsWith("•") || line.startsWith("✅") ? "ml-4" : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {message.analysis && message.userProfile && (
                <div className="mt-4">{renderComprehensiveAnalysis(message.analysis, message.userProfile)}</div>
              )}

              {message.suggestions && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (suggestion === "Start Comprehensive Assessment") {
                          setShowDetailedForm(true)
                        } else {
                          setInputMessage(suggestion)
                        }
                      }}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              {message.type === "ai" && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Database className="w-3 h-3 mr-1" />
                    Powered by Advanced Medical AI
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">Dr. MyMedi is analyzing...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => setShowDetailedForm(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Comprehensive Assessment
          </Button>
          <Button variant="outline" size="sm">
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          <Button variant="outline" size="sm">
            <Mic className="w-4 h-4 mr-2" />
            Voice Input
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Describe your health concern in detail for comprehensive analysis..."
              className="pr-12 py-3 text-base"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              End-to-end encrypted
            </span>
            <span className="flex items-center">
              <Award className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </span>
            <span className="flex items-center">
              <Globe className="w-3 h-3 mr-1" />
              Available 24/7
            </span>
          </div>
          <div className="text-right">
            <div>Powered by MyMedi.ai Advanced Medical Intelligence</div>
            <div className="text-gray-400">Always consult healthcare professionals for medical decisions</div>
          </div>
        </div>
      </div>
    </div>
  )
}
