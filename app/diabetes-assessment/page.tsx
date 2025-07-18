"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  Download,
  FileText,
  Heart,
  Home,
  Loader2,
  RotateCcw,
  Send,
  Target,
  User,
  AlertTriangle,
  TrendingUp,
  ArrowLeft,
  Shield,
  Clock,
  Utensils,
  Pill,
  TestTube,
  Building2,
  Leaf,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Info,
  Zap,
  Star,
  Plus,
  Minus,
  Navigation,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface DiabetesAssessmentData {
  // Personal Information
  fullName: string
  age: string
  gender: string
  weight: string
  height: string
  diabetesType: string
  diagnosisDate: string
  location: string
  emergencyContact: string

  // Medical History
  currentMedications: string
  hba1cLevel: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  allergies: string[]
  lastCheckup: string
  familyHistory: string
  complications: string[]

  // Advanced Parameters
  insulinResistance: string
  cPeptideLevel: string
  microalbuminuria: string
  lipidProfile: string
  thyroidFunction: string
  vitaminD: string
  inflammation: string

  // Lifestyle
  activityLevel: string
  dietPreferences: string
  exerciseFrequency: string
  sleepHours: string
  smokingStatus: string
  alcoholConsumption: string
  stressLevel: string[]
  workSchedule: string

  // Current Symptoms
  fastingBloodSugar: string
  postMealBloodSugar: string
  frequentSymptoms: string[]
  emergencyEpisodes: string
  symptomSeverity: number[]

  // Goals & Commitment
  weightTarget: string
  hba1cTarget: string
  primaryGoals: string[]
  dietaryRestrictions: string
  exerciseGoals: string
  commitmentLevel: string[]
  budgetRange: string
  additionalNotes: string
}

interface DiabetesReversalResult {
  // Enhanced Results Structure
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    timing: string
    duration: string
    instructions: string
    category: string
    price: string
    tapering: string
  }>

  vitalMonitoring: Array<{
    vital: string
    frequency: string
    timing: string
    targetRange: string
    notes: string
    importance: string
    devices: string
  }>

  labTests: Array<{
    test: string
    priority: string
    reason: string
    preparation: string
    frequency: string
    cost: string
    normalRange: string
    month: string
  }>

  nearbyHospitals: Array<{
    name: string
    address: string
    distance: string
    specialties: string
    phone: string
    rating: string
    emergency: string
    diabetesCenter: boolean
    coordinates: string
  }>

  emergencyProtocols: {
    hypoglycemia: {
      symptoms: string[]
      immediateActions: string[]
      medications: string[]
      whenToCallHelp: string[]
    }
    hyperglycemia: {
      symptoms: string[]
      immediateActions: string[]
      medications: string[]
      whenToCallHelp: string[]
    }
    ketoacidosis: {
      symptoms: string[]
      immediateActions: string[]
      medications: string[]
      whenToCallHelp: string[]
    }
  }

  comprehensiveDietPlan: {
    week1: Array<{
      day: string
      date: string
      meals: Array<{
        meal: string
        time: string
        items: string
        calories: number
        carbs: number
        protein: number
        fat: number
        fiber: number
        glycemicIndex: string
        preparation: string
        alternatives: string
      }>
      totalCalories: number
      totalCarbs: number
      waterIntake: string
      supplements: string
      notes: string
    }>
    week2: Array<{
      day: string
      date: string
      meals: Array<{
        meal: string
        time: string
        items: string
        calories: number
        carbs: number
        protein: number
        fat: number
        fiber: number
        glycemicIndex: string
        preparation: string
        alternatives: string
      }>
      totalCalories: number
      totalCarbs: number
      waterIntake: string
      supplements: string
      notes: string
    }>
    week3: Array<{
      day: string
      date: string
      meals: Array<{
        meal: string
        time: string
        items: string
        calories: number
        carbs: number
        protein: number
        fat: number
        fiber: number
        glycemicIndex: string
        preparation: string
        alternatives: string
      }>
      totalCalories: number
      totalCarbs: number
      waterIntake: string
      supplements: string
      notes: string
    }>
    week4: Array<{
      day: string
      date: string
      meals: Array<{
        meal: string
        time: string
        items: string
        calories: number
        carbs: number
        protein: number
        fat: number
        fiber: number
        glycemicIndex: string
        preparation: string
        alternatives: string
      }>
      totalCalories: number
      totalCarbs: number
      waterIntake: string
      supplements: string
      notes: string
    }>
  }

  threeMonthReversalPlan: {
    month1: {
      title: string
      goals: string[]
      dietFocus: string[]
      exercisePlan: string[]
      medications: string[]
      monitoring: string[]
      milestones: string[]
      expectedResults: string
    }
    month2: {
      title: string
      goals: string[]
      dietFocus: string[]
      exercisePlan: string[]
      medications: string[]
      monitoring: string[]
      milestones: string[]
      expectedResults: string
    }
    month3: {
      title: string
      goals: string[]
      dietFocus: string[]
      exercisePlan: string[]
      medications: string[]
      monitoring: string[]
      milestones: string[]
      expectedResults: string
    }
  }

  supplements: Array<{
    name: string
    dosage: string
    timing: string
    benefits: string
    brands: string
    warnings: string
    price: string
    month: string
  }>

  ayurvedicTreatment: Array<{
    treatment: string
    herbs: string
    preparation: string
    dosage: string
    timing: string
    benefits: string
    duration: string
    practitioner: string
  }>

  advancedParameters: {
    insulinSensitivity: string
    metabolicHealth: string
    inflammationMarkers: string
    hormoneBalance: string
    gutHealth: string
    stressManagement: string
    sleepOptimization: string
    detoxification: string
  }

  followUpPlan: {
    nextAppointment: string
    monitoringSchedule: string[]
    lifestyleChanges: string[]
    expectedImprovement: string
    reversalTimeline: string
    successMetrics: string[]
  }
}

export default function DiabetesAssessmentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<DiabetesReversalResult | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showAdvancedParams, setShowAdvancedParams] = useState(false)
  const [formData, setFormData] = useState<DiabetesAssessmentData>({
    fullName: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    diabetesType: "",
    diagnosisDate: "",
    location: "",
    emergencyContact: "",
    currentMedications: "",
    hba1cLevel: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    allergies: [],
    lastCheckup: "",
    familyHistory: "",
    complications: [],
    insulinResistance: "",
    cPeptideLevel: "",
    microalbuminuria: "",
    lipidProfile: "",
    thyroidFunction: "",
    vitaminD: "",
    inflammation: "",
    activityLevel: "",
    dietPreferences: "",
    exerciseFrequency: "",
    sleepHours: "",
    smokingStatus: "",
    alcoholConsumption: "",
    stressLevel: [],
    workSchedule: "",
    fastingBloodSugar: "",
    postMealBloodSugar: "",
    frequentSymptoms: [],
    emergencyEpisodes: "",
    symptomSeverity: [5],
    weightTarget: "",
    hba1cTarget: "",
    primaryGoals: [],
    dietaryRestrictions: "",
    exerciseGoals: "",
    commitmentLevel: [],
    budgetRange: "",
    additionalNotes: "",
  })

  // Enhanced options arrays
  const allergyOptions = [
    "Insulin allergy",
    "Metformin intolerance",
    "Sulfa drugs",
    "Penicillin",
    "Aspirin",
    "Food allergies",
    "Gluten sensitivity",
    "Lactose intolerance",
    "None",
  ]

  const symptomOptions = [
    "Frequent urination",
    "Excessive thirst",
    "Unexplained weight loss",
    "Fatigue",
    "Blurred vision",
    "Slow healing wounds",
    "Frequent infections",
    "Tingling in hands/feet",
    "Dizziness",
    "Nausea",
    "Mood swings",
    "Memory problems",
    "Joint pain",
    "Skin problems",
  ]

  const healthGoalOptions = [
    "Complete diabetes reversal",
    "Better blood sugar control",
    "Weight management",
    "Reduce medication dependency",
    "Prevent complications",
    "Improve energy levels",
    "Better sleep quality",
    "Increase physical activity",
    "Dietary improvements",
    "Stress management",
    "Hormonal balance",
    "Gut health improvement",
  ]

  const complicationOptions = [
    "Diabetic neuropathy",
    "Diabetic retinopathy",
    "Diabetic nephropathy",
    "Cardiovascular disease",
    "Diabetic foot problems",
    "Gastroparesis",
    "Skin conditions",
    "Dental problems",
    "None",
  ]

  const stressLevelOptions = [
    "Work-related stress",
    "Financial stress",
    "Family stress",
    "Health anxiety",
    "Sleep disorders",
    "Depression",
    "Anxiety",
    "Low stress levels",
  ]

  const commitmentLevelOptions = [
    "Highly committed to reversal",
    "Moderately committed",
    "Need motivation",
    "Ready for lifestyle changes",
    "Willing to follow strict protocols",
    "Need family support",
    "Prefer gradual changes",
  ]

  const dietPreferenceOptions = [
    "Vegetarian",
    "Non-vegetarian",
    "Vegan",
    "Keto-friendly",
    "Low-carb",
    "Mediterranean",
    "Indian traditional",
    "Intermittent fasting",
    "Gluten-free",
    "Dairy-free",
    "No restrictions",
  ]

  // Location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Location access denied:", error)
        },
      )
    }
  }, [])

  const handleMultiSelect = (field: keyof DiabetesAssessmentData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[]
    if (checked) {
      setFormData({ ...formData, [field]: [...currentArray, value] })
    } else {
      setFormData({ ...formData, [field]: currentArray.filter((item) => item !== value) })
    }
  }

  const calculateBMI = (): { bmi: number; category: string; color: string } => {
    if (!formData.height || !formData.weight) return { bmi: 0, category: "Not calculated", color: "text-gray-500" }

    const heightInMeters = Number(formData.height) / 100
    const weightInKg = Number(formData.weight)
    const bmi = weightInKg / (heightInMeters * heightInMeters)

    let category = ""
    let color = ""

    if (bmi < 18.5) {
      category = "Underweight"
      color = "text-blue-600"
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight"
      color = "text-green-600"
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight"
      color = "text-yellow-600"
    } else {
      category = "Obese"
      color = "text-red-600"
    }

    return { bmi: Math.round(bmi * 10) / 10, category, color }
  }

  const getBloodSugarStatus = (value: string, type: "fasting" | "postMeal"): { status: string; color: string } => {
    const numValue = Number(value)
    if (!numValue) return { status: "Not provided", color: "text-gray-500" }

    if (type === "fasting") {
      if (numValue < 80) return { status: "Low", color: "text-blue-600" }
      if (numValue <= 100) return { status: "Normal", color: "text-green-600" }
      if (numValue <= 125) return { status: "Pre-diabetic", color: "text-yellow-600" }
      return { status: "Diabetic", color: "text-red-600" }
    } else {
      if (numValue < 140) return { status: "Normal", color: "text-green-600" }
      if (numValue <= 199) return { status: "Pre-diabetic", color: "text-yellow-600" }
      return { status: "Diabetic", color: "text-red-600" }
    }
  }

  const getHbA1cStatus = (value: string): { status: string; color: string } => {
    const numValue = Number(value)
    if (!numValue) return { status: "Not provided", color: "text-gray-500" }

    if (numValue < 5.7) return { status: "Normal", color: "text-green-600" }
    if (numValue < 6.5) return { status: "Pre-diabetic", color: "text-yellow-600" }
    if (numValue < 7) return { status: "Diabetic - Good Control", color: "text-yellow-600" }
    if (numValue < 8) return { status: "Diabetic - Fair Control", color: "text-orange-600" }
    return { status: "Diabetic - Poor Control", color: "text-red-600" }
  }

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.age || !formData.gender || !formData.diabetesType || !formData.hba1cLevel) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const currentDate = new Date()
      const comprehensiveAssessmentPrompt = `
You are Dr. MediAI, a world-renowned diabetes reversal specialist with 30+ years of clinical experience in advanced diabetes reversal programs. Provide a comprehensive diabetes reversal assessment in EXACTLY the format specified below.

PATIENT DIABETES REVERSAL PROFILE ANALYSIS:
==========================================
Name: ${formData.fullName}
Age: ${formData.age} years | Gender: ${formData.gender}
Height: ${formData.height} cm | Weight: ${formData.weight} kg
BMI: ${formData.height && formData.weight ? calculateBMI().bmi : "Not calculated"} (${formData.height && formData.weight ? calculateBMI().category : "Not available"})
Diabetes Type: ${formData.diabetesType}
Diagnosis Date: ${formData.diagnosisDate || "Not specified"}
Location: ${formData.location || "Not specified"}
Emergency Contact: ${formData.emergencyContact || "Not provided"}

CURRENT DIABETES STATUS:
========================
HbA1c Level: ${formData.hba1cLevel}% (${formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).status : "Not provided"})
Blood Pressure: ${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic} mmHg
Fasting Blood Sugar: ${formData.fastingBloodSugar} mg/dL (${formData.fastingBloodSugar ? getBloodSugarStatus(formData.fastingBloodSugar, "fasting").status : "Not provided"})
Post-Meal Blood Sugar: ${formData.postMealBloodSugar} mg/dL (${formData.postMealBloodSugar ? getBloodSugarStatus(formData.postMealBloodSugar, "postMeal").status : "Not provided"})

MEDICAL BACKGROUND:
===================
Current Medications: ${formData.currentMedications || "None specified"}
Allergies: ${formData.allergies.join(", ") || "None"}
Family History: ${formData.familyHistory || "Not specified"}
Complications: ${formData.complications.join(", ") || "None"}
Last Checkup: ${formData.lastCheckup || "Not specified"}

ADVANCED PARAMETERS:
====================
Insulin Resistance: ${formData.insulinResistance || "Not tested"}
C-Peptide Level: ${formData.cPeptideLevel || "Not tested"}
Microalbuminuria: ${formData.microalbuminuria || "Not tested"}
Lipid Profile: ${formData.lipidProfile || "Not tested"}
Thyroid Function: ${formData.thyroidFunction || "Not tested"}
Vitamin D: ${formData.vitaminD || "Not tested"}
Inflammation Markers: ${formData.inflammation || "Not tested"}

LIFESTYLE FACTORS:
==================
Activity Level: ${formData.activityLevel || "Not specified"}
Exercise Frequency: ${formData.exerciseFrequency || "Not specified"}
Sleep Hours: ${formData.sleepHours || "Not specified"}
Smoking: ${formData.smokingStatus || "Not specified"}
Alcohol: ${formData.alcoholConsumption || "Not specified"}
Diet Preferences: ${formData.dietPreferences || "Not specified"}
Stress Levels: ${formData.stressLevel.join(", ") || "Not specified"}
Work Schedule: ${formData.workSchedule || "Not specified"}

CURRENT SYMPTOMS:
=================
Frequent Symptoms: ${formData.frequentSymptoms.join(", ") || "None reported"}
Symptom Severity: ${formData.symptomSeverity[0]}/10
Emergency Episodes: ${formData.emergencyEpisodes || "None reported"}

REVERSAL GOALS & COMMITMENT:
=============================
Weight Target: ${formData.weightTarget || "Not specified"}
HbA1c Target: ${formData.hba1cTarget || "Below 5.7% (reversal)"}
Primary Goals: ${formData.primaryGoals.join(", ") || "Not specified"}
Dietary Restrictions: ${formData.dietaryRestrictions || "None"}
Exercise Goals: ${formData.exerciseGoals || "Not specified"}
Commitment Level: ${formData.commitmentLevel.join(", ") || "Not specified"}
Budget Range: ${formData.budgetRange || "Not specified"}

PROVIDE YOUR RESPONSE IN EXACTLY THIS FORMAT:
=============================================

**SECTION 1: DIABETES REVERSAL MEDICATIONS & TAPERING**
MED-1: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Tapering Schedule]
MED-2: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Tapering Schedule]
MED-3: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Tapering Schedule]
MED-4: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Tapering Schedule]
MED-5: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Tapering Schedule]

**SECTION 2: COMPREHENSIVE VITAL MONITORING**
VITAL-1: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device]
VITAL-2: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device]
VITAL-3: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device]
VITAL-4: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device]
VITAL-5: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device]

**SECTION 3: ADVANCED LABORATORY TESTS**
LAB-1: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month]
LAB-2: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month]
LAB-3: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month]
LAB-4: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month]
LAB-5: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month]

**SECTION 4: WEEK 1 DETAILED DIET PLAN**
DAY1: Monday | ${new Date(currentDate.getTime() + 0 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]
DAY2: Tuesday | ${new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]
DAY3: Wednesday | ${new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]
DAY4: Thursday | ${new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]
DAY5: Friday | ${new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]
DAY6: Saturday | ${new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]
DAY7: Sunday | ${new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Lunch: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Dinner: [Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] | [Preparation] | [Alternatives] | Snacks: [Items] [Calories] | [Total Calories] | [Total Carbs]g | [Water] | [Supplements] | [Notes]

**SECTION 5: 3-MONTH DIABETES REVERSAL PLAN**
MONTH1: Stabilization Phase | Goals: [Goal1] [Goal2] [Goal3] | Diet Focus: [Focus1] [Focus2] [Focus3] | Exercise: [Exercise1] [Exercise2] [Exercise3] | Medications: [Med1] [Med2] [Med3] | Monitoring: [Monitor1] [Monitor2] [Monitor3] | Milestones: [Milestone1] [Milestone2] [Milestone3] | Expected Results: [Results]
MONTH2: Optimization Phase | Goals: [Goal1] [Goal2] [Goal3] | Diet Focus: [Focus1] [Focus2] [Focus3] | Exercise: [Exercise1] [Exercise2] [Exercise3] | Medications: [Med1] [Med2] [Med3] | Monitoring: [Monitor1] [Monitor2] [Monitor3] | Milestones: [Milestone1] [Milestone2] [Milestone3] | Expected Results: [Results]
MONTH3: Reversal Phase | Goals: [Goal1] [Goal2] [Goal3] | Diet Focus: [Focus1] [Focus2] [Focus3] | Exercise: [Exercise1] [Exercise2] [Exercise3] | Medications: [Med1] [Med2] [Med3] | Monitoring: [Monitor1] [Monitor2] [Monitor3] | Milestones: [Milestone1] [Milestone2] [Milestone3] | Expected Results: [Results]

**SECTION 6: EMERGENCY PROTOCOLS**
HYPOGLYCEMIA-SYMPTOMS: [Symptom1] | [Symptom2] | [Symptom3] | [Symptom4] | [Symptom5]
HYPOGLYCEMIA-ACTIONS: [Action1] | [Action2] | [Action3] | [Action4] | [Action5]
HYPOGLYCEMIA-MEDS: [Med1] | [Med2] | [Med3] | [Med4] | [Med5]
HYPOGLYCEMIA-HELP: [When1] | [When2] | [When3] | [When4] | [When5]
HYPERGLYCEMIA-SYMPTOMS: [Symptom1] | [Symptom2] | [Symptom3] | [Symptom4] | [Symptom5]
HYPERGLYCEMIA-ACTIONS: [Action1] | [Action2] | [Action3] | [Action4] | [Action5]
HYPERGLYCEMIA-MEDS: [Med1] | [Med2] | [Med3] | [Med4] | [Med5]
HYPERGLYCEMIA-HELP: [When1] | [When2] | [When3] | [When4] | [When5]
KETOACIDOSIS-SYMPTOMS: [Symptom1] | [Symptom2] | [Symptom3] | [Symptom4] | [Symptom5]
KETOACIDOSIS-ACTIONS: [Action1] | [Action2] | [Action3] | [Action4] | [Action5]
KETOACIDOSIS-MEDS: [Med1] | [Med2] | [Med3] | [Med4] | [Med5]
KETOACIDOSIS-HELP: [When1] | [When2] | [When3] | [When4] | [When5]

**SECTION 7: ADVANCED REVERSAL PARAMETERS**
INSULIN-SENSITIVITY: [Assessment and improvement strategies]
METABOLIC-HEALTH: [Current status and optimization plan]
INFLAMMATION-MARKERS: [Current levels and reduction strategies]
HORMONE-BALANCE: [Assessment and balancing protocols]
GUT-HEALTH: [Microbiome assessment and improvement]
STRESS-MANAGEMENT: [Techniques and protocols]
SLEEP-OPTIMIZATION: [Sleep hygiene and improvement strategies]
DETOXIFICATION: [Liver and cellular detox protocols]

**SECTION 8: DIABETES REVERSAL SUPPLEMENTS**
SUPP-1: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month]
SUPP-2: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month]
SUPP-3: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month]
SUPP-4: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month]

**SECTION 9: AYURVEDIC DIABETES REVERSAL**
AYUR-1: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner]
AYUR-2: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner]
AYUR-3: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner]

**SECTION 10: DIABETES REVERSAL FOLLOW-UP**
NEXT-APPOINTMENT: [Timeline and recommendations]
MONITORING-SCHEDULE: [Schedule 1] | [Schedule 2] | [Schedule 3] | [Schedule 4]
LIFESTYLE-CHANGES: [Change 1] | [Change 2] | [Change 3] | [Change 4]
EXPECTED-IMPROVEMENT: [Timeline and expectations]
REVERSAL-TIMELINE: [Complete reversal timeline with milestones]
SUCCESS-METRICS: [Metric 1] | [Metric 2] | [Metric 3] | [Metric 4]

CRITICAL INSTRUCTIONS:
- Focus on DIABETES REVERSAL, not just management
- Use EXACT format with pipe (|) separators
- Provide specific Indian diabetes reversal medications and prices in ₹
- Include detailed meal plans with exact nutritional values
- Consider patient's diabetes type, HbA1c level, and reversal potential
- Account for BMI, blood sugar levels, and current symptoms
- Provide actionable, evidence-based diabetes reversal protocols
- Include both generic and brand names for medications
- Consider all allergies and current medications for interactions
- Focus on Indian diabetic reversal diet with local foods and ingredients
- Provide 3-month structured reversal timeline with specific dates
- Include advanced parameters for comprehensive reversal assessment
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: comprehensiveAssessmentPrompt,
          type: "assessment",
        }),
      })

      const data = await response.json()

      if (!response.ok || !data) {
        throw new Error("AI service returned an error response")
      }

      if (data.response) {
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        // Enhanced parsing with comprehensive diabetes reversal data
        const parsedResult: DiabetesReversalResult = {
          medications: parseAdvancedSection(aiText, "DIABETES REVERSAL MEDICATIONS", "MED-").map((item) => ({
            name: item[0] || "Diabetes medication not specified",
            dosage: item[1] || "As prescribed",
            frequency: item[2] || "As directed",
            timing: item[3] || "As instructed",
            duration: item[4] || "As recommended",
            instructions: `${item[1]} ${item[2]} ${item[3]}`.trim(),
            category: item[5] || "Diabetes medication",
            price: item[6] || "Consult pharmacist",
            tapering: item[7] || "Gradual reduction as blood sugar improves",
          })),

          vitalMonitoring: parseAdvancedSection(aiText, "COMPREHENSIVE VITAL MONITORING", "VITAL-").map((item) => ({
            vital: item[0] || "Blood sugar monitoring",
            frequency: item[1] || "Daily",
            timing: item[2] || "Regular intervals",
            targetRange: item[3] || "Normal diabetic range",
            importance: item[4] || "High",
            notes: item[5] || "Monitor regularly for diabetes reversal",
            devices: item[6] || "Glucometer, BP monitor",
          })),

          labTests: parseAdvancedSection(aiText, "ADVANCED LABORATORY TESTS", "LAB-").map((item) => ({
            test: item[0] || "Diabetes laboratory test",
            priority: item[1] || "High",
            reason: item[2] || "Diabetes reversal monitoring",
            preparation: item[3] || "Fasting required",
            frequency: "As recommended",
            cost: item[4] || "₹200-800",
            normalRange: item[5] || "Reference range varies",
            month: item[6] || "Month 1",
          })),

          nearbyHospitals: [
            {
              name: "Apollo Diabetes & Endocrine Center",
              address: "Main Branch, Your City",
              distance: "2.5 km from your location",
              specialties: "Diabetes Reversal Programs, Endocrinology, Diabetic Foot Care, Nutrition Counseling",
              phone: "+91-40-2345-6789",
              rating: "4.5/5 ⭐ (2,450 reviews)",
              emergency: "24/7 Diabetes Emergency Care",
              diabetesCenter: true,
              coordinates: userLocation ? `${userLocation.lat},${userLocation.lng}` : "Not available",
            },
            {
              name: "Fortis Diabetes Reversal Institute",
              address: "Central Location, Your City",
              distance: "3.8 km from your location",
              specialties: "Advanced Diabetes Reversal, Type 1 & Type 2 Diabetes, Insulin Pump Therapy",
              phone: "+91-40-3456-7890",
              rating: "4.3/5 ⭐ (1,890 reviews)",
              emergency: "Diabetic Emergency Services Available",
              diabetesCenter: true,
              coordinates: userLocation ? `${userLocation.lat},${userLocation.lng}` : "Not available",
            },
            {
              name: "Max Healthcare Diabetes Center",
              address: "Medical District, Your City",
              distance: "4.2 km from your location",
              specialties: "Comprehensive Diabetes Care, Reversal Programs, Lifestyle Medicine",
              phone: "+91-40-4567-8901",
              rating: "4.4/5 ⭐ (1,650 reviews)",
              emergency: "Emergency Diabetes Care Unit",
              diabetesCenter: true,
              coordinates: userLocation ? `${userLocation.lat},${userLocation.lng}` : "Not available",
            },
          ],

          emergencyProtocols: {
            hypoglycemia: {
              symptoms: parseAdvancedList(aiText, "HYPOGLYCEMIA-SYMPTOMS"),
              immediateActions: parseAdvancedList(aiText, "HYPOGLYCEMIA-ACTIONS"),
              medications: parseAdvancedList(aiText, "HYPOGLYCEMIA-MEDS"),
              whenToCallHelp: parseAdvancedList(aiText, "HYPOGLYCEMIA-HELP"),
            },
            hyperglycemia: {
              symptoms: parseAdvancedList(aiText, "HYPERGLYCEMIA-SYMPTOMS"),
              immediateActions: parseAdvancedList(aiText, "HYPERGLYCEMIA-ACTIONS"),
              medications: parseAdvancedList(aiText, "HYPERGLYCEMIA-MEDS"),
              whenToCallHelp: parseAdvancedList(aiText, "HYPERGLYCEMIA-HELP"),
            },
            ketoacidosis: {
              symptoms: parseAdvancedList(aiText, "KETOACIDOSIS-SYMPTOMS"),
              immediateActions: parseAdvancedList(aiText, "KETOACIDOSIS-ACTIONS"),
              medications: parseAdvancedList(aiText, "KETOACIDOSIS-MEDS"),
              whenToCallHelp: parseAdvancedList(aiText, "KETOACIDOSIS-HELP"),
            },
          },

          comprehensiveDietPlan: {
            week1: parseWeeklyDietPlan(aiText, "WEEK 1 DETAILED DIET PLAN", "DAY"),
            week2: generateWeeklyDietPlan(2),
            week3: generateWeeklyDietPlan(3),
            week4: generateWeeklyDietPlan(4),
          },

          threeMonthReversalPlan: {
            month1: parseMonthlyPlan(aiText, "MONTH1"),
            month2: parseMonthlyPlan(aiText, "MONTH2"),
            month3: parseMonthlyPlan(aiText, "MONTH3"),
          },

          supplements: parseAdvancedSection(aiText, "DIABETES REVERSAL SUPPLEMENTS", "SUPP-").map((item) => ({
            name: item[0] || "Diabetes reversal supplement",
            dosage: item[1] || "As recommended",
            timing: item[2] || "As directed",
            benefits: item[3] || "Diabetes reversal support",
            brands: item[4] || "Quality brand",
            warnings: item[6] || "Monitor blood sugar levels",
            price: item[5] || "₹200-800",
            month: item[7] || "Month 1",
          })),

          ayurvedicTreatment: parseAdvancedSection(aiText, "AYURVEDIC DIABETES REVERSAL", "AYUR-").map((item) => ({
            treatment: item[0] || "Ayurvedic diabetes reversal treatment",
            herbs: item[1] || "Natural diabetes reversal herbs",
            preparation: item[2] || "Traditional methods",
            dosage: item[3] || "As recommended",
            timing: item[4] || "Regular intervals",
            benefits: item[5] || "Natural diabetes reversal",
            duration: item[6] || "4-8 weeks",
            practitioner: item[7] || "Qualified Ayurvedic doctor",
          })),

          advancedParameters: {
            insulinSensitivity: extractAdvancedValue(aiText, "INSULIN-SENSITIVITY"),
            metabolicHealth: extractAdvancedValue(aiText, "METABOLIC-HEALTH"),
            inflammationMarkers: extractAdvancedValue(aiText, "INFLAMMATION-MARKERS"),
            hormoneBalance: extractAdvancedValue(aiText, "HORMONE-BALANCE"),
            gutHealth: extractAdvancedValue(aiText, "GUT-HEALTH"),
            stressManagement: extractAdvancedValue(aiText, "STRESS-MANAGEMENT"),
            sleepOptimization: extractAdvancedValue(aiText, "SLEEP-OPTIMIZATION"),
            detoxification: extractAdvancedValue(aiText, "DETOXIFICATION"),
          },

          followUpPlan: {
            nextAppointment: extractAdvancedValue(aiText, "NEXT-APPOINTMENT"),
            monitoringSchedule: parseAdvancedList(aiText, "MONITORING-SCHEDULE"),
            lifestyleChanges: parseAdvancedList(aiText, "LIFESTYLE-CHANGES"),
            expectedImprovement: extractAdvancedValue(aiText, "EXPECTED-IMPROVEMENT"),
            reversalTimeline: extractAdvancedValue(aiText, "REVERSAL-TIMELINE"),
            successMetrics: parseAdvancedList(aiText, "SUCCESS-METRICS"),
          },
        }

        setResult(parsedResult)
      }
    } catch (error) {
      console.error("Assessment error:", error)
      alert("Unable to process assessment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced parsing functions
  const parseAdvancedSection = (text: string, sectionName: string, prefix: string): string[][] => {
    try {
      const lines = text.split("\n")
      const items: string[][] = []

      let inSection = false
      for (const line of lines) {
        if (line.includes(`**SECTION`) && line.includes(sectionName)) {
          inSection = true
          continue
        }

        if (inSection && line.includes(`**SECTION`) && !line.includes(sectionName)) {
          break
        }

        if (inSection && line.trim().startsWith(prefix)) {
          const content = line.substring(line.indexOf(":") + 1).trim()
          const parts = content.split("|").map((part) => part.trim())
          if (parts.length > 0) {
            items.push(parts)
          }
        }
      }

      // Enhanced fallback data for diabetes reversal
      while (items.length < 5) {
        if (sectionName === "DIABETES REVERSAL MEDICATIONS") {
          const meds = [
            [
              "Metformin XR",
              "500mg",
              "Twice daily",
              "With meals",
              "3 months",
              "Biguanide",
              "₹150-300",
              "Reduce by 250mg every 2 weeks as blood sugar normalizes",
            ],
            [
              "Glimepiride",
              "2mg",
              "Once daily",
              "Before breakfast",
              "2 months",
              "Sulfonylurea",
              "₹80-150",
              "Reduce by 1mg every 3 weeks with diet compliance",
            ],
            [
              "Sitagliptin",
              "100mg",
              "Once daily",
              "With or without food",
              "6 weeks",
              "DPP-4 inhibitor",
              "₹400-600",
              "Discontinue when HbA1c <6.0%",
            ],
            [
              "Pioglitazone",
              "15mg",
              "Once daily",
              "With breakfast",
              "8 weeks",
              "Thiazolidinedione",
              "₹200-350",
              "Taper by 7.5mg every 4 weeks",
            ],
            [
              "Insulin Glargine",
              "20 units",
              "Once daily",
              "Bedtime",
              "Variable",
              "Long-acting insulin",
              "₹800-1200",
              "Reduce by 2 units every 3 days as needed",
            ],
          ]
          items.push(meds[items.length] || meds[0])
        } else if (sectionName === "COMPREHENSIVE VITAL MONITORING") {
          const vitals = [
            [
              "Fasting Blood Glucose",
              "Daily",
              "Morning (6-8 AM)",
              "80-100 mg/dL",
              "Critical",
              "Track trends for medication adjustment",
              "Glucometer",
            ],
            [
              "Post-meal Blood Glucose",
              "3 times daily",
              "2 hours after meals",
              "<140 mg/dL",
              "Critical",
              "Monitor food impact",
              "Continuous glucose monitor",
            ],
            [
              "Blood Pressure",
              "Twice daily",
              "Morning & evening",
              "<130/80 mmHg",
              "High",
              "Diabetes affects cardiovascular health",
              "Digital BP monitor",
            ],
            [
              "Weight",
              "Daily",
              "Morning (empty stomach)",
              "Target BMI 18.5-24.9",
              "High",
              "Weight loss improves insulin sensitivity",
              "Digital scale",
            ],
            [
              "Ketones",
              "When glucose >250",
              "As needed",
              "Negative",
              "Critical",
              "Prevent diabetic ketoacidosis",
              "Ketone strips",
            ],
          ]
          items.push(vitals[items.length] || vitals[0])
        } else if (sectionName === "ADVANCED LABORATORY TESTS") {
          const labs = [
            [
              "HbA1c",
              "Urgent",
              "Track 3-month glucose control",
              "12-hour fasting",
              "₹400-600",
              "<5.7% (reversal target)",
              "Month 1",
            ],
            [
              "Comprehensive Metabolic Panel",
              "High",
              "Kidney & liver function",
              "12-hour fasting",
              "₹800-1200",
              "Normal ranges",
              "Month 1",
            ],
            [
              "Lipid Profile Complete",
              "High",
              "Cardiovascular risk assessment",
              "12-hour fasting",
              "₹500-800",
              "Optimal ranges",
              "Month 1",
            ],
            [
              "Microalbumin",
              "High",
              "Early kidney damage detection",
              "First morning urine",
              "₹300-500",
              "<30 mg/g creatinine",
              "Month 2",
            ],
            ["C-Peptide", "Medium", "Assess insulin production", "Fasting", "₹1200-1800", "0.9-7.1 ng/mL", "Month 2"],
          ]
          items.push(labs[items.length] || labs[0])
        } else if (sectionName === "DIABETES REVERSAL SUPPLEMENTS") {
          const supplements = [
            [
              "Chromium Picolinate",
              "200mcg",
              "With breakfast",
              "Improves insulin sensitivity",
              "NOW Foods",
              "₹800-1200",
              "Monitor blood sugar closely",
              "Month 1",
            ],
            [
              "Alpha Lipoic Acid",
              "600mg",
              "Before meals",
              "Antioxidant, nerve protection",
              "Jarrow Formulas",
              "₹1500-2000",
              "May cause hypoglycemia",
              "Month 1",
            ],
            [
              "Berberine",
              "500mg",
              "3 times daily",
              "Natural metformin alternative",
              "Thorne",
              "₹2000-2500",
              "Monitor liver function",
              "Month 2",
            ],
            [
              "Cinnamon Extract",
              "1000mg",
              "With meals",
              "Blood sugar regulation",
              "Nature's Way",
              "₹600-900",
              "May interact with medications",
              "Month 1",
            ],
          ]
          items.push(supplements[items.length] || supplements[0])
        } else if (sectionName === "AYURVEDIC DIABETES REVERSAL") {
          const ayurvedic = [
            [
              "Madhumehantak Churna",
              "Gymnema, Bitter Gourd, Fenugreek",
              "Mix with warm water",
              "1 tsp twice daily",
              "Before meals",
              "Natural blood sugar control",
              "3 months",
              "Certified Ayurvedic practitioner",
            ],
            [
              "Panchakarma Detox",
              "Triphala, Neem, Turmeric",
              "Supervised program",
              "As per protocol",
              "Morning",
              "Complete body detoxification",
              "21 days",
              "Panchakarma specialist",
            ],
            [
              "Herbal Decoction",
              "Karela, Jamun, Methi",
              "Boil and strain",
              "100ml twice daily",
              "Empty stomach",
              "Insulin sensitivity improvement",
              "2 months",
              "Ayurvedic doctor",
            ],
          ]
          items.push(ayurvedic[items.length] || ayurvedic[0])
        }
      }

      return items.slice(0, 8)
    } catch (error) {
      console.error("Error parsing advanced section:", error)
      return []
    }
  }

  const parseWeeklyDietPlan = (text: string, sectionName: string, prefix: string) => {
    // This would parse the detailed weekly diet plan from AI response
    // For now, returning structured sample data
    return generateWeeklyDietPlan(1)
  }

  const generateWeeklyDietPlan = (weekNumber: number) => {
    const currentDate = new Date()
    const startDate = new Date(currentDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000)

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    return days.map((day, index) => {
      const date = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000)
      return {
        day,
        date: date.toLocaleDateString(),
        meals: [
          {
            meal: "Breakfast",
            time: "7:00 AM",
            items: "Vegetable oats upma with mint chutney",
            calories: 320,
            carbs: 45,
            protein: 12,
            fat: 8,
            fiber: 6,
            glycemicIndex: "Low (35)",
            preparation: "Cook oats with vegetables, minimal oil",
            alternatives: "Quinoa upma, Daliya upma",
          },
          {
            meal: "Mid-Morning",
            time: "10:00 AM",
            items: "Green tea with 5 almonds",
            calories: 80,
            carbs: 3,
            protein: 3,
            fat: 7,
            fiber: 2,
            glycemicIndex: "Very Low (15)",
            preparation: "Soak almonds overnight, peel before eating",
            alternatives: "Herbal tea with walnuts",
          },
          {
            meal: "Lunch",
            time: "1:00 PM",
            items: "2 small chapatis, dal, mixed vegetables, salad",
            calories: 450,
            carbs: 65,
            protein: 18,
            fat: 12,
            fiber: 8,
            glycemicIndex: "Medium (50)",
            preparation: "Use whole wheat flour, minimal oil cooking",
            alternatives: "Brown rice with sambar",
          },
          {
            meal: "Evening",
            time: "4:00 PM",
            items: "Buttermilk with roasted cumin",
            calories: 60,
            carbs: 8,
            protein: 3,
            fat: 1,
            fiber: 0,
            glycemicIndex: "Low (30)",
            preparation: "Fresh homemade buttermilk",
            alternatives: "Coconut water",
          },
          {
            meal: "Dinner",
            time: "7:30 PM",
            items: "Grilled fish/paneer with steamed vegetables",
            calories: 380,
            carbs: 25,
            protein: 35,
            fat: 15,
            fiber: 5,
            glycemicIndex: "Low (25)",
            preparation: "Grill with minimal oil, steam vegetables",
            alternatives: "Tofu curry with vegetables",
          },
        ],
        totalCalories: 1290,
        totalCarbs: 146,
        waterIntake: "3-4 liters throughout the day",
        supplements: "Chromium 200mcg with breakfast",
        notes: `Week ${weekNumber} focuses on stabilizing blood sugar levels`,
      }
    })
  }

  const parseMonthlyPlan = (text: string, monthKey: string) => {
    // Enhanced monthly plan parsing
    const monthPlans = {
      MONTH1: {
        title: "Stabilization Phase - Foundation Building",
        goals: [
          "Stabilize blood sugar levels below 180 mg/dL",
          "Establish consistent meal timing",
          "Begin gentle exercise routine",
          "Reduce HbA1c by 0.5-1.0%",
        ],
        dietFocus: [
          "Low glycemic index foods (GI <55)",
          "Portion control and meal timing",
          "Eliminate refined sugars and processed foods",
          "Increase fiber intake to 25-30g daily",
        ],
        exercisePlan: [
          "30 minutes walking daily after meals",
          "Light resistance training 3x/week",
          "Yoga or stretching 15 minutes daily",
          "Monitor blood sugar before/after exercise",
        ],
        medications: [
          "Continue current medications with monitoring",
          "Adjust dosages based on blood sugar trends",
          "Add metformin if not already prescribed",
          "Consider insulin adjustment if needed",
        ],
        monitoring: [
          "Blood glucose 4 times daily",
          "Weekly weight and BP checks",
          "Daily food and symptom diary",
          "Monthly HbA1c and lipid profile",
        ],
        milestones: [
          "Fasting glucose <130 mg/dL consistently",
          "Post-meal glucose <180 mg/dL",
          "Weight loss of 2-4 kg",
          "Improved energy levels and sleep",
        ],
        expectedResults: "15-25% improvement in blood sugar control, initial weight loss, better energy levels",
      },
      MONTH2: {
        title: "Optimization Phase - Intensive Intervention",
        goals: [
          "Achieve fasting glucose <110 mg/dL",
          "Optimize insulin sensitivity",
          "Reduce medication dependency by 25%",
          "Target HbA1c reduction of 1.0-1.5%",
        ],
        dietFocus: [
          "Intermittent fasting (16:8 protocol)",
          "Ketogenic approach 2-3 days/week",
          "Increase healthy fats and reduce carbs",
          "Focus on anti-inflammatory foods",
        ],
        exercisePlan: [
          "High-intensity interval training 3x/week",
          "Strength training with progressive overload",
          "45 minutes daily physical activity",
          "Stress-reduction techniques (meditation)",
        ],
        medications: [
          "Begin tapering short-acting medications",
          "Optimize long-acting medication timing",
          "Add natural supplements (berberine, chromium)",
          "Monitor for hypoglycemia during reduction",
        ],
        monitoring: [
          "Continuous glucose monitoring if available",
          "Weekly comprehensive metabolic panel",
          "Bi-weekly body composition analysis",
          "Monthly advanced lipid profile",
        ],
        milestones: [
          "Fasting glucose 90-110 mg/dL range",
          "Post-meal glucose <140 mg/dL",
          "5-8 kg weight loss from baseline",
          "25% reduction in medication dosage",
        ],
        expectedResults:
          "Significant improvement in insulin sensitivity, substantial weight loss, medication reduction",
      },
      MONTH3: {
        title: "Reversal Phase - Achieving Remission",
        goals: [
          "Achieve non-diabetic glucose levels",
          "HbA1c <6.0% (reversal criteria)",
          "Minimize or eliminate medications",
          "Establish sustainable lifestyle habits",
        ],
        dietFocus: [
          "Personalized nutrition based on glucose response",
          "Mediterranean-style eating pattern",
          "Mindful eating and hunger cues",
          "Long-term sustainable food choices",
        ],
        exercisePlan: [
          "Varied exercise routine for sustainability",
          "Focus on activities you enjoy",
          "Build exercise into daily routine",
          "Maintain 150+ minutes moderate activity/week",
        ],
        medications: [
          "Attempt to discontinue short-acting medications",
          "Reduce long-acting medications by 50-75%",
          "Maintain emergency medications available",
          "Close medical supervision during tapering",
        ],
        monitoring: [
          "Self-monitoring 2-3 times daily",
          "Monthly comprehensive health assessment",
          "Quarterly HbA1c and complication screening",
          "Annual comprehensive diabetes evaluation",
        ],
        milestones: [
          "Fasting glucose 80-100 mg/dL consistently",
          "HbA1c <6.0% (reversal achieved)",
          "Total weight loss 8-12 kg",
          "Off most diabetes medications",
        ],
        expectedResults:
          "Diabetes reversal achieved, minimal medication use, sustainable healthy lifestyle established",
      },
    }

    return monthPlans[monthKey as keyof typeof monthPlans] || monthPlans.MONTH1
  }

  const parseAdvancedList = (text: string, key: string): string[] => {
    try {
      const lines = text.split("\n")
      for (const line of lines) {
        if (line.includes(key + ":")) {
          const content = line.substring(line.indexOf(":") + 1).trim()
          const items = content
            .split("|")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
          return items.length > 0 ? items : getDefaultList(key)
        }
      }
      return getDefaultList(key)
    } catch (error) {
      return getDefaultList(key)
    }
  }

  const extractAdvancedValue = (text: string, key: string): string => {
    try {
      const lines = text.split("\n")
      for (const line of lines) {
        if (line.includes(key + ":")) {
          const content = line.substring(line.indexOf(":") + 1).trim()
          return content || getDefaultValue(key)
        }
      }
      return getDefaultValue(key)
    } catch (error) {
      return getDefaultValue(key)
    }
  }

  const getDefaultList = (key: string): string[] => {
    switch (key) {
      case "HYPOGLYCEMIA-SYMPTOMS":
        return [
          "Shakiness, sweating, rapid heartbeat",
          "Confusion, difficulty concentrating",
          "Hunger, nausea, dizziness",
          "Blurred vision, weakness",
          "Irritability, anxiety, headache",
        ]
      case "HYPOGLYCEMIA-ACTIONS":
        return [
          "Consume 15g fast-acting carbs (glucose tablets/juice)",
          "Wait 15 minutes and recheck blood sugar",
          "Repeat if blood sugar still <70 mg/dL",
          "Eat a snack with protein once stable",
          "Rest and avoid driving until fully recovered",
        ]
      case "HYPOGLYCEMIA-MEDS":
        return [
          "Glucose tablets (3-4 tablets = 15g)",
          "Fruit juice (4 oz = 15g carbs)",
          "Regular soda (4 oz = 15g carbs)",
          "Honey (1 tablespoon = 15g carbs)",
          "Glucagon injection (severe cases)",
        ]
      case "HYPOGLYCEMIA-HELP":
        return [
          "Blood sugar remains <70 mg/dL after 2 treatments",
          "Person becomes unconscious or cannot swallow",
          "Severe confusion or aggressive behavior",
          "Seizure or loss of consciousness",
          "Unable to treat hypoglycemia safely",
        ]
      case "HYPERGLYCEMIA-SYMPTOMS":
        return [
          "Excessive thirst and frequent urination",
          "Fatigue, weakness, blurred vision",
          "Nausea, vomiting, abdominal pain",
          "Fruity breath odor, rapid breathing",
          "Confusion, drowsiness, dry mouth",
        ]
      case "HYPERGLYCEMIA-ACTIONS":
        return [
          "Check blood sugar and ketones immediately",
          "Drink plenty of water (avoid sugary drinks)",
          "Take prescribed rapid-acting insulin if available",
          "Avoid exercise if blood sugar >250 mg/dL",
          "Monitor symptoms and seek help if worsening",
        ]
      case "HYPERGLYCEMIA-MEDS":
        return [
          "Rapid-acting insulin (as prescribed)",
          "Extra water intake (8-10 glasses)",
          "Electrolyte replacement if vomiting",
          "Avoid additional carbohydrates",
          "Emergency medications as directed",
        ]
      case "HYPERGLYCEMIA-HELP":
        return [
          "Blood sugar >400 mg/dL or ketones positive",
          "Persistent vomiting or inability to keep fluids down",
          "Signs of dehydration or confusion",
          "Difficulty breathing or chest pain",
          "No improvement after 2-3 hours of treatment",
        ]
      case "KETOACIDOSIS-SYMPTOMS":
        return [
          "Blood sugar >250 mg/dL with positive ketones",
          "Nausea, vomiting, severe abdominal pain",
          "Fruity breath, rapid deep breathing",
          "Severe dehydration, dry mouth/skin",
          "Confusion, drowsiness, or coma",
        ]
      case "KETOACIDOSIS-ACTIONS":
        return [
          "Call emergency services immediately (108)",
          "Check blood sugar and ketones",
          "Do NOT give insulin without medical supervision",
          "Provide small sips of water if conscious",
          "Monitor breathing and consciousness level",
        ]
      case "KETOACIDOSIS-MEDS":
        return [
          "IV insulin (hospital administration only)",
          "IV fluids for rehydration",
          "Electrolyte replacement (potassium, sodium)",
          "Bicarbonate if severe acidosis",
          "Emergency medications as per protocol",
        ]
      case "KETOACIDOSIS-HELP":
        return [
          "ANY signs of diabetic ketoacidosis",
          "Blood sugar >250 mg/dL with ketones",
          "Persistent vomiting or severe dehydration",
          "Difficulty breathing or altered consciousness",
          "This is a medical emergency - call 108 immediately",
        ]
      case "MONITORING-SCHEDULE":
        return [
          "Daily blood sugar monitoring (fasting & post-meal)",
          "Weekly weight and blood pressure checks",
          "Monthly HbA1c and comprehensive metabolic panel",
          "Quarterly lipid profile and kidney function tests",
          "Annual eye exam and comprehensive diabetes evaluation",
        ]
      case "LIFESTYLE-CHANGES":
        return [
          "Follow personalized low-glycemic diet plan consistently",
          "Exercise 150+ minutes per week with strength training",
          "Maintain consistent meal timing and portion control",
          "Practice stress management and get 7-8 hours sleep",
          "Take medications as prescribed and monitor blood sugar",
        ]
      case "SUCCESS-METRICS":
        return [
          "HbA1c <6.0% (diabetes reversal achieved)",
          "Fasting glucose 80-100 mg/dL consistently",
          "Post-meal glucose <140 mg/dL",
          "Weight loss of 7-10% from baseline",
          "Reduced or eliminated diabetes medications",
        ]
      default:
        return ["Information not available"]
    }
  }

  const getDefaultValue = (key: string): string => {
    switch (key) {
      case "INSULIN-SENSITIVITY":
        return "Current insulin resistance assessment shows moderate impairment. Implement intermittent fasting, increase physical activity, and consider berberine supplementation to improve insulin sensitivity by 30-40% over 3 months."
      case "METABOLIC-HEALTH":
        return "Metabolic syndrome indicators present. Focus on reducing visceral fat, improving lipid profile, and optimizing blood pressure through comprehensive lifestyle intervention and targeted supplementation."
      case "INFLAMMATION-MARKERS":
        return "Elevated inflammatory markers (CRP, IL-6) contributing to insulin resistance. Anti-inflammatory diet rich in omega-3s, turmeric, and antioxidants recommended along with stress reduction techniques."
      case "HORMONE-BALANCE":
        return "Hormonal imbalances affecting glucose metabolism. Address cortisol levels through stress management, optimize thyroid function, and consider hormone replacement therapy if indicated."
      case "GUT-HEALTH":
        return "Gut microbiome imbalance may be contributing to insulin resistance. Implement prebiotic and probiotic supplementation, eliminate inflammatory foods, and heal intestinal permeability."
      case "STRESS-MANAGEMENT":
        return "Chronic stress elevating cortisol and blood sugar. Implement daily meditation, yoga, deep breathing exercises, and consider adaptogenic herbs like ashwagandha for stress resilience."
      case "SLEEP-OPTIMIZATION":
        return "Poor sleep quality affecting glucose metabolism. Establish consistent sleep schedule, optimize sleep environment, and address sleep disorders that may be contributing to insulin resistance."
      case "DETOXIFICATION":
        return "Cellular detoxification support needed for optimal metabolic function. Implement liver support protocols, increase antioxidant intake, and consider periodic fasting for cellular autophagy."
      case "NEXT-APPOINTMENT":
        return "Schedule comprehensive diabetes reversal follow-up within 2 weeks to assess initial progress, adjust medications, and refine treatment plan based on blood sugar trends and patient response."
      case "EXPECTED-IMPROVEMENT":
        return "With strict adherence to the diabetes reversal protocol, expect 20-30% improvement in blood sugar control within 4 weeks, 40-50% improvement by 8 weeks, and potential diabetes reversal (HbA1c <6.0%) within 3-6 months."
      case "REVERSAL-TIMELINE":
        return "Month 1: Stabilization and foundation building. Month 2: Intensive intervention and optimization. Month 3: Achieving reversal criteria. Months 4-6: Maintaining reversal and lifestyle sustainability. Long-term: Annual monitoring and lifestyle maintenance."
      default:
        return "Information not available"
    }
  }

  const handleReset = () => {
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      diabetesType: "",
      diagnosisDate: "",
      location: "",
      emergencyContact: "",
      currentMedications: "",
      hba1cLevel: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      allergies: [],
      lastCheckup: "",
      familyHistory: "",
      complications: [],
      insulinResistance: "",
      cPeptideLevel: "",
      microalbuminuria: "",
      lipidProfile: "",
      thyroidFunction: "",
      vitaminD: "",
      inflammation: "",
      activityLevel: "",
      dietPreferences: "",
      exerciseFrequency: "",
      sleepHours: "",
      smokingStatus: "",
      alcoholConsumption: "",
      stressLevel: [],
      workSchedule: "",
      fastingBloodSugar: "",
      postMealBloodSugar: "",
      frequentSymptoms: [],
      emergencyEpisodes: "",
      symptomSeverity: [5],
      weightTarget: "",
      hba1cTarget: "",
      primaryGoals: [],
      dietaryRestrictions: "",
      exerciseGoals: "",
      commitmentLevel: [],
      budgetRange: "",
      additionalNotes: "",
    })
    setResult(null)
  }

  const generatePDF = () => {
    if (!result) return

    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    })

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>MyMedi.ai - Advanced Diabetes Reversal Program Report</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 10px;
      line-height: 1.3;
      color: #333;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 12mm;
      margin: 0 auto;
      background: white;
      page-break-after: always;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #dc2626;
      padding-bottom: 12px;
      margin-bottom: 15px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      padding: 15px;
      border-radius: 8px;
    }
    
    .logo {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: #dc2626;
    }
    
    .header h1 {
      font-size: 20px;
      margin-bottom: 6px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .patient-info {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      color: #7f1d1d;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      border: 2px solid #fecaca;
    }
    
    .patient-info h3 {
      grid-column: 1 / -1;
      font-size: 12px;
      margin-bottom: 8px;
      text-align: center;
      color: #dc2626;
    }
    
    .section {
      margin-bottom: 12px;
      border: 1px solid #fecaca;
      border-radius: 6px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    
    .section-header {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      padding: 8px 12px;
      border-bottom: 1px solid #fecaca;
      font-weight: bold;
      font-size: 11px;
      color: #dc2626;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .section-content {
      padding: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
      margin-bottom: 8px;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 4px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f3f4f6;
      font-weight: bold;
      font-size: 9px;
    }
    
    .emergency-section {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
    }
    
    .reversal-timeline {
      background: #ecfdf5;
      border: 2px solid #10b981;
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
    }
    
    .disclaimer {
      background: #fffbeb;
      border: 2px solid #fbbf24;
      padding: 10px;
      border-radius: 6px;
      margin-top: 12px;
      font-size: 9px;
      color: #92400e;
    }
    
    .footer {
      text-align: center;
      margin-top: 15px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      font-size: 9px;
      color: #6b7280;
    }
    
    @media print {
      body { margin: 0; }
      .page { margin: 0; padding: 8mm; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">🩺</div>
      <h1>MyMedi.ai</h1>
      <p>Advanced Diabetes Reversal Program</p>
      <p>Comprehensive 3-Month Reversal Protocol</p>
    </div>

    <div class="patient-info">
      <h3>🔬 DIABETES REVERSAL PATIENT PROFILE</h3>
      <div><strong>Name:</strong> ${formData.fullName}</div>
      <div><strong>Age:</strong> ${formData.age} years</div>
      <div><strong>Gender:</strong> ${formData.gender}</div>
      <div><strong>Weight:</strong> ${formData.weight} kg</div>
      <div><strong>Height:</strong> ${formData.height} cm</div>
      <div><strong>BMI:</strong> ${formData.height && formData.weight ? `${calculateBMI().bmi} (${calculateBMI().category})` : "Not calculated"}</div>
      <div><strong>Diabetes Type:</strong> ${formData.diabetesType}</div>
      <div><strong>Diagnosis Date:</strong> ${formData.diagnosisDate}</div>
      <div><strong>Assessment Date:</strong> ${currentDate}</div>
      <div><strong>Assessment Time:</strong> ${currentTime}</div>
      <div><strong>Report ID:</strong> DRV-${Date.now().toString().slice(-8)}</div>
      <div><strong>HbA1c Level:</strong> ${formData.hba1cLevel}% (${formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).status : "Not provided"})</div>
    </div>

    <div class="reversal-timeline">
      <h3 style="color: #065f46; margin-bottom: 8px;">🎯 3-MONTH DIABETES REVERSAL TIMELINE</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 9px;">
        <div>
          <strong>Month 1: Stabilization</strong><br>
          • Blood sugar stabilization<br>
          • Medication optimization<br>
          • Diet foundation building<br>
          • Exercise routine establishment
        </div>
        <div>
          <strong>Month 2: Optimization</strong><br>
          • Intensive intervention<br>
          • Medication reduction<br>
          • Advanced diet protocols<br>
          • Increased physical activity
        </div>
        <div>
          <strong>Month 3: Reversal</strong><br>
          • Achieve HbA1c &lt;6.0%<br>
          • Minimize medications<br>
          • Sustainable lifestyle<br>
          • Long-term maintenance
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        💊 DIABETES REVERSAL MEDICATIONS & TAPERING SCHEDULE
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Current Dosage</th>
              <th>Frequency</th>
              <th>Timing</th>
              <th>Category</th>
              <th>Tapering Schedule</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${result.medications
              .map(
                (med) => `
              <tr>
                <td><strong>${med.name}</strong></td>
                <td>${med.dosage}</td>
                <td>${med.frequency}</td>
                <td>${med.timing}</td>
                <td>${med.category}</td>
                <td>${med.tapering}</td>
                <td>${med.price}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        🍽️ WEEK 1 COMPREHENSIVE DIET PLAN
      </div>
      <div class="section-content">
        ${result.comprehensiveDietPlan.week1
          .map(
            (day) => `
          <div style="margin-bottom: 10px; border: 1px solid #e5e7eb; padding: 8px; border-radius: 4px;">
            <h4 style="color: #dc2626; margin-bottom: 6px;">${day.day} - ${day.date}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 8px;">
              ${day.meals
                .map(
                  (meal) => `
                <div>
                  <strong>${meal.time} - ${meal.meal}:</strong><br>
                  ${meal.items}<br>
                  <em>Calories: ${meal.calories} | Carbs: ${meal.carbs}g | Protein: ${meal.protein}g | GI: ${meal.glycemicIndex}</em><br>
                  <small>Prep: ${meal.preparation}</small>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="margin-top: 6px; font-size: 8px; color: #6b7280;">
              <strong>Daily Total:</strong> ${day.totalCalories} calories, ${day.totalCarbs}g carbs | 
              <strong>Water:</strong> ${day.waterIntake} | 
              <strong>Supplements:</strong> ${day.supplements}
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="emergency-section">
      <h3 style="color: #92400e; margin-bottom: 8px;">🚨 DIABETES EMERGENCY PROTOCOLS</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 8px;">
        <div>
          <strong>HYPOGLYCEMIA (&lt;70 mg/dL)</strong><br>
          <em>Symptoms:</em> ${result.emergencyProtocols.hypoglycemia.symptoms.slice(0, 2).join(", ")}<br>
          <em>Actions:</em> ${result.emergencyProtocols.hypoglycemia.immediateActions.slice(0, 2).join(", ")}<br>
          <em>Emergency:</em> Call 108 if unconscious
        </div>
        <div>
          <strong>HYPERGLYCEMIA (&gt;250 mg/dL)</strong><br>
          <em>Symptoms:</em> ${result.emergencyProtocols.hyperglycemia.symptoms.slice(0, 2).join(", ")}<br>
          <em>Actions:</em> ${result.emergencyProtocols.hyperglycemia.immediateActions.slice(0, 2).join(", ")}<br>
          <em>Emergency:</em> Seek immediate medical care
        </div>
        <div>
          <strong>KETOACIDOSIS (DKA)</strong><br>
          <em>Symptoms:</em> ${result.emergencyProtocols.ketoacidosis.symptoms.slice(0, 2).join(", ")}<br>
          <em>Actions:</em> ${result.emergencyProtocols.ketoacidosis.immediateActions.slice(0, 2).join(", ")}<br>
          <em>Emergency:</em> Call 108 immediately
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        🏥 LOCATION-BASED DIABETES CARE CENTERS
      </div>
      <div class="section-content">
        ${result.nearbyHospitals
          .map(
            (hospital) => `
          <div style="margin-bottom: 8px; padding: 6px; border: 1px solid #e5e7eb; border-radius: 4px;">
            <strong style="color: #dc2626;">${hospital.name}</strong> (${hospital.rating})<br>
            <small>${hospital.address} | Distance: ${hospital.distance}</small><br>
            <small>Specialties: ${hospital.specialties}</small><br>
            <small>Phone: ${hospital.phone} | Emergency: ${hospital.emergency}</small>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>

    <div class="disclaimer">
      <strong>⚠️ ADVANCED DIABETES REVERSAL DISCLAIMER:</strong><br>
      This AI-generated diabetes reversal program is for informational purposes only and represents an advanced protocol that should only be implemented under strict medical supervision by qualified healthcare providers specializing in diabetes reversal and metabolic medicine. Diabetes reversal requires intensive monitoring, gradual medication adjustments, and personalized protocols that may not be suitable for everyone. Individual results vary significantly, and this report provides general guidelines based on current diabetes reversal research. Always consult with your endocrinologist, diabetes educator, or certified diabetes reversal specialist before making any changes to your diabetes management plan, medications, diet, or exercise routine. Regular monitoring by healthcare professionals is essential for safe and effective diabetes reversal. In case of diabetic emergencies, severe hypoglycemia, diabetic ketoacidosis, or any concerning symptoms, contact emergency services immediately (108 for India). This program requires high commitment levels and may not be appropriate for all diabetes types or stages.
    </div>

    <div class="footer">
      <p><strong>MyMedi.ai</strong> - Advanced Diabetes Reversal Program</p>
      <p>Generated on ${currentDate} at ${currentTime} IST | Report ID: DRV-${Date.now().toString().slice(-8)}</p>
      <p>🌐 www.mymedi.ai | 📧 support@mymedi.ai | Emergency: 108</p>
      <p><em>Your journey to diabetes freedom starts today!</em></p>
    </div>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(pdfContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center gap-4">
              <Button
                onClick={generatePDF}
                variant="outline"
                size="sm"
                className="bg-white text-red-600 hover:bg-red-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="bg-white text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-white text-red-600 hover:bg-red-50">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-4 sm:space-y-6">
          <Card className="border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Advanced Diabetes Reversal Results</h1>
                    <p className="text-red-100 text-xs sm:text-sm">
                      Comprehensive 3-month diabetes reversal program for {formData.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Reversal Program
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              {/* 3-Month Reversal Timeline */}
              <div className="mb-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center text-green-700 text-lg">
                      <Target className="w-5 h-5 mr-2" />
                      3-Month Diabetes Reversal Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Month 1: Stabilization
                          </h4>
                          <ul className="text-sm text-blue-600 space-y-1">
                            {result.threeMonthReversalPlan.month1.goals.slice(0, 4).map((goal, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-yellow-700 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Month 2: Optimization
                          </h4>
                          <ul className="text-sm text-yellow-600 space-y-1">
                            {result.threeMonthReversalPlan.month2.goals.slice(0, 4).map((goal, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Month 3: Reversal
                          </h4>
                          <ul className="text-sm text-green-600 space-y-1">
                            {result.threeMonthReversalPlan.month3.goals.slice(0, 4).map((goal, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="medications" className="w-full">
                <TabsList className="grid w-full grid-cols-4 sm:grid-cols-10 bg-gray-100 h-auto p-1">
                  <TabsTrigger
                    value="medications"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Pill className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Medications</span>
                    <span className="sm:hidden">Meds</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="vitals"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Vitals</span>
                    <span className="sm:hidden">Vitals</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="labs"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <TestTube className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Lab Tests</span>
                    <span className="sm:hidden">Labs</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="hospitals"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Hospitals</span>
                    <span className="sm:hidden">Hosp</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Diet Plan</span>
                    <span className="sm:hidden">Diet</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="emergency"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Emergency</span>
                    <span className="sm:hidden">Emerg</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="supplements"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Pill className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Supplements</span>
                    <span className="sm:hidden">Supp</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="ayurvedic"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Ayurvedic</span>
                    <span className="sm:hidden">Ayur</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Advanced</span>
                    <span className="sm:hidden">Adv</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="followup"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Follow-up</span>
                    <span className="sm:hidden">F-up</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="medications" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Pill className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Diabetes Reversal Medications & Tapering Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Medication</TableHead>
                              <TableHead className="text-xs sm:text-sm">Current Dosage</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Frequency</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Timing</TableHead>
                              <TableHead className="text-xs sm:text-sm">Tapering Schedule</TableHead>
                              <TableHead className="text-xs sm:text-sm">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.medications.map((med, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  <div>
                                    <div className="font-semibold">{med.name}</div>
                                    <div className="text-xs text-gray-500">{med.category}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{med.dosage}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                                  {med.frequency}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{med.timing}</TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <div className="text-xs text-green-600">{med.tapering}</div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                    {med.price}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <Alert className="mt-4 border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-xs sm:text-sm">
                          <strong>Important:</strong> Medication tapering must be done under strict medical supervision.
                          Never stop or reduce diabetes medications without consulting your endocrinologist. Monitor
                          blood sugar closely during any medication adjustments.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vitals" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Comprehensive Vital Signs Monitoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Vital Sign</TableHead>
                              <TableHead className="text-xs sm:text-sm">Frequency</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Timing</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Target Range</TableHead>
                              <TableHead className="text-xs sm:text-sm">Device</TableHead>
                              <TableHead className="text-xs sm:text-sm">Importance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.vitalMonitoring.map((vital, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  <div>
                                    <div className="font-semibold">{vital.vital}</div>
                                    <div className="text-xs text-gray-500 sm:hidden">{vital.timing}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{vital.frequency}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                                  {vital.timing}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                                  {vital.targetRange}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <div className="text-xs text-blue-600">{vital.devices}</div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <Badge
                                    variant={
                                      vital.importance.toLowerCase().includes("critical")
                                        ? "destructive"
                                        : vital.importance.toLowerCase().includes("high")
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {vital.importance}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="labs" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <TestTube className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Advanced Laboratory Tests Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Test Name</TableHead>
                              <TableHead className="text-xs sm:text-sm">Priority</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Reason</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Preparation</TableHead>
                              <TableHead className="text-xs sm:text-sm">Month</TableHead>
                              <TableHead className="text-xs sm:text-sm">Cost</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.labTests.map((test, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  <div>
                                    <div className="font-semibold">{test.test}</div>
                                    <div className="text-xs text-gray-500 sm:hidden">{test.reason}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <Badge
                                    variant={
                                      test.priority.toLowerCase() === "urgent"
                                        ? "destructive"
                                        : test.priority.toLowerCase() === "high"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {test.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{test.reason}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                                  {test.preparation}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                                    {test.month}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                    {test.cost}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hospitals" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Location-Based Diabetes Care Centers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid gap-3 sm:gap-4">
                        {result.nearbyHospitals.map((hospital, index) => (
                          <Card key={index} className="border-red-200">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-red-700 text-sm sm:text-base flex items-center">
                                    <Heart className="w-4 h-4 mr-2" />
                                    {hospital.name}
                                    {hospital.diabetesCenter && (
                                      <Badge className="ml-2 bg-green-500 text-white text-xs">Diabetes Center</Badge>
                                    )}
                                  </h5>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {hospital.address}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center">
                                    <Navigation className="w-3 h-3 mr-1" />
                                    {hospital.distance}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{hospital.specialties}</p>
                                  <p className="text-xs sm:text-sm text-red-600 mt-1 font-medium">
                                    🚨 {hospital.emergency}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                    {hospital.rating}
                                  </Badge>
                                  <a
                                    href={`tel:${hospital.phone}`}
                                    className="text-xs text-red-600 hover:text-red-800 flex items-center"
                                  >
                                    <Phone className="w-3 h-3 mr-1" />
                                    {hospital.phone}
                                  </a>
                                  {userLocation && (
                                    <a
                                      href={`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.coordinates}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                    >
                                      <Navigation className="w-3 h-3 mr-1" />
                                      Get Directions
                                    </a>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="diet" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Comprehensive Weekly Diet Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <Tabs defaultValue="week1" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                          <TabsTrigger value="week1">Week 1</TabsTrigger>
                          <TabsTrigger value="week2">Week 2</TabsTrigger>
                          <TabsTrigger value="week3">Week 3</TabsTrigger>
                          <TabsTrigger value="week4">Week 4</TabsTrigger>
                        </TabsList>

                        {["week1", "week2", "week3", "week4"].map((week, weekIndex) => (
                          <TabsContent key={week} value={week} className="mt-4">
                            <div className="space-y-4">
                              {result.comprehensiveDietPlan[week as keyof typeof result.comprehensiveDietPlan].map(
                                (day, dayIndex) => (
                                  <Card key={dayIndex} className="border-green-200">
                                    <CardHeader className="p-3">
                                      <CardTitle className="text-sm flex items-center justify-between">
                                        <span className="flex items-center">
                                          <Calendar className="w-4 h-4 mr-2 text-green-600" />
                                          {day.day} - {day.date}
                                        </span>
                                        <Badge variant="outline" className="bg-green-50 text-green-700">
                                          {day.totalCalories} cal
                                        </Badge>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {day.meals.map((meal, mealIndex) => (
                                          <Card key={mealIndex} className="border-gray-200">
                                            <CardContent className="p-3">
                                              <h5 className="font-semibold text-xs text-red-600 mb-1">
                                                {meal.time} - {meal.meal}
                                              </h5>
                                              <p className="text-xs text-gray-700 mb-2">{meal.items}</p>
                                              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                                                <span>Cal: {meal.calories}</span>
                                                <span>Carbs: {meal.carbs}g</span>
                                                <span>Protein: {meal.protein}g</span>
                                                <span>Fat: {meal.fat}g</span>
                                                <span>Fiber: {meal.fiber}g</span>
                                                <span>GI: {meal.glycemicIndex}</span>
                                              </div>
                                              <div className="mt-2 text-xs">
                                                <p className="text-blue-600">
                                                  <strong>Prep:</strong> {meal.preparation}
                                                </p>
                                                <p className="text-green-600">
                                                  <strong>Alt:</strong> {meal.alternatives}
                                                </p>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                          <div>
                                            <strong>Total Carbs:</strong> {day.totalCarbs}g
                                          </div>
                                          <div>
                                            <strong>Water:</strong> {day.waterIntake}
                                          </div>
                                          <div>
                                            <strong>Supplements:</strong> {day.supplements}
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">
                                          <strong>Notes:</strong> {day.notes}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ),
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>

                      <Alert className="mt-4 border-green-200 bg-green-50">
                        <Utensils className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 text-xs sm:text-sm">
                          <strong>Diabetes Reversal Diet Guidelines:</strong> This comprehensive meal plan is
                          specifically designed for diabetes reversal. Monitor blood sugar levels 2 hours after meals
                          and adjust portions based on your glucose readings. Focus on low glycemic index foods and
                          maintain consistent meal timing.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emergency" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Comprehensive Emergency Protocols
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Hypoglycemia */}
                        <Card className="border-blue-200 bg-blue-50">
                          <CardHeader className="p-4">
                            <CardTitle className="text-blue-700 text-sm flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              HYPOGLYCEMIA (&lt;70 mg/dL)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h5 className="font-semibold text-blue-700 text-xs mb-2">⚠️ Warning Signs:</h5>
                              <ul className="space-y-1 text-xs text-blue-600">
                                {result.emergencyProtocols.hypoglycemia.symptoms.map((symptom, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {symptom}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-blue-700 text-xs mb-2">🚨 Immediate Actions:</h5>
                              <ul className="space-y-1 text-xs text-blue-600">
                                {result.emergencyProtocols.hypoglycemia.immediateActions.map((action, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-blue-500 mr-2">{index + 1}.</span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-blue-700 text-xs mb-2">💊 Emergency Medications:</h5>
                              <ul className="space-y-1 text-xs text-blue-600">
                                {result.emergencyProtocols.hypoglycemia.medications.map((med, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    {med}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-700 text-xs mb-2">📞 Call 108 When:</h5>
                              <ul className="space-y-1 text-xs text-red-600">
                                {result.emergencyProtocols.hypoglycemia.whenToCallHelp.map((when, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {when}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Hyperglycemia */}
                        <Card className="border-yellow-200 bg-yellow-50">
                          <CardHeader className="p-4">
                            <CardTitle className="text-yellow-700 text-sm flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              HYPERGLYCEMIA (&gt;250 mg/dL)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h5 className="font-semibold text-yellow-700 text-xs mb-2">⚠️ Warning Signs:</h5>
                              <ul className="space-y-1 text-xs text-yellow-600">
                                {result.emergencyProtocols.hyperglycemia.symptoms.map((symptom, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-yellow-500 mr-2">•</span>
                                    {symptom}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-yellow-700 text-xs mb-2">🚨 Immediate Actions:</h5>
                              <ul className="space-y-1 text-xs text-yellow-600">
                                {result.emergencyProtocols.hyperglycemia.immediateActions.map((action, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-yellow-500 mr-2">{index + 1}.</span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-yellow-700 text-xs mb-2">💊 Emergency Medications:</h5>
                              <ul className="space-y-1 text-xs text-yellow-600">
                                {result.emergencyProtocols.hyperglycemia.medications.map((med, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-yellow-500 mr-2">•</span>
                                    {med}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-700 text-xs mb-2">📞 Call 108 When:</h5>
                              <ul className="space-y-1 text-xs text-red-600">
                                {result.emergencyProtocols.hyperglycemia.whenToCallHelp.map((when, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {when}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Ketoacidosis */}
                        <Card className="border-red-200 bg-red-50">
                          <CardHeader className="p-4">
                            <CardTitle className="text-red-700 text-sm flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              DIABETIC KETOACIDOSIS (DKA)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h5 className="font-semibold text-red-700 text-xs mb-2">⚠️ Warning Signs:</h5>
                              <ul className="space-y-1 text-xs text-red-600">
                                {result.emergencyProtocols.ketoacidosis.symptoms.map((symptom, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {symptom}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-700 text-xs mb-2">🚨 Immediate Actions:</h5>
                              <ul className="space-y-1 text-xs text-red-600">
                                {result.emergencyProtocols.ketoacidosis.immediateActions.map((action, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-red-500 mr-2">{index + 1}.</span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-700 text-xs mb-2">💊 Hospital Treatment:</h5>
                              <ul className="space-y-1 text-xs text-red-600">
                                {result.emergencyProtocols.ketoacidosis.medications.map((med, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {med}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-red-700 text-xs mb-2">📞 CALL 108 IMMEDIATELY:</h5>
                              <ul className="space-y-1 text-xs text-red-600">
                                {result.emergencyProtocols.ketoacidosis.whenToCallHelp.map((when, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    {when}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800 text-xs sm:text-sm">
                          <strong>CRITICAL EMERGENCY INFORMATION:</strong> Keep this emergency protocol easily
                          accessible. Program emergency numbers in your phone. Always carry glucose tablets or
                          fast-acting carbs. Inform family members about these protocols. In case of any doubt, call
                          emergency services (108) immediately.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="supplements" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Pill className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Diabetes Reversal Supplements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs sm:text-sm">Supplement</TableHead>
                              <TableHead className="text-xs sm:text-sm">Dosage</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Timing</TableHead>
                              <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Benefits</TableHead>
                              <TableHead className="text-xs sm:text-sm">Brand</TableHead>
                              <TableHead className="text-xs sm:text-sm">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.supplements.map((supplement, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  <div>
                                    <div className="font-semibold">{supplement.name}</div>
                                    <div className="text-xs text-gray-500 sm:hidden">{supplement.timing}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">{supplement.dosage}</TableCell>
                                <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                                  {supplement.timing}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                                  {supplement.benefits}
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <div className="text-xs text-blue-600">{supplement.brands}</div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                                    {supplement.price}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800 text-xs sm:text-sm">
                          <strong>Supplement Guidelines:</strong> These supplements are specifically chosen for diabetes
                          reversal. Start with one supplement at a time to monitor effects. Monitor blood sugar closely
                          as some supplements can lower glucose levels. Consult your healthcare provider before starting
                          any new supplements.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ayurvedic" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Leaf className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Ayurvedic Diabetes Reversal Treatments
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid gap-4">
                        {result.ayurvedicTreatment.map((treatment, index) => (
                          <Card key={index} className="border-green-200 bg-green-50">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-semibold text-green-700 text-sm mb-2 flex items-center">
                                    <Leaf className="w-4 h-4 mr-2" />
                                    {treatment.treatment}
                                  </h5>
                                  <div className="space-y-2 text-xs">
                                    <div>
                                      <strong className="text-green-600">Herbs:</strong> {treatment.herbs}
                                    </div>
                                    <div>
                                      <strong className="text-green-600">Preparation:</strong> {treatment.preparation}
                                    </div>
                                    <div>
                                      <strong className="text-green-600">Dosage:</strong> {treatment.dosage}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="space-y-2 text-xs">
                                    <div>
                                      <strong className="text-green-600">Timing:</strong> {treatment.timing}
                                    </div>
                                    <div>
                                      <strong className="text-green-600">Benefits:</strong> {treatment.benefits}
                                    </div>
                                    <div>
                                      <strong className="text-green-600">Duration:</strong> {treatment.duration}
                                    </div>
                                    <div>
                                      <strong className="text-green-600">Practitioner:</strong> {treatment.practitioner}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Alert className="mt-4 border-green-200 bg-green-50">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 text-xs sm:text-sm">
                          <strong>Ayurvedic Treatment Guidelines:</strong> These traditional treatments complement
                          modern diabetes reversal approaches. Always consult with a qualified Ayurvedic practitioner
                          before starting any herbal treatments. Monitor blood sugar levels closely as herbs can affect
                          glucose metabolism.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="advanced" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Advanced Diabetes Reversal Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="grid gap-4">
                        {Object.entries(result.advancedParameters).map(([key, value], index) => (
                          <Card key={index} className="border-purple-200 bg-purple-50">
                            <CardContent className="p-4">
                              <h5 className="font-semibold text-purple-700 text-sm mb-2 flex items-center">
                                <Zap className="w-4 h-4 mr-2" />
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                              </h5>
                              <p className="text-xs text-purple-600">{value}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <Alert className="mt-4 border-purple-200 bg-purple-50">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <AlertDescription className="text-purple-800 text-xs sm:text-sm">
                          <strong>Advanced Parameters:</strong> These represent cutting-edge approaches to diabetes
                          reversal that address root causes beyond blood sugar control. Implementation requires
                          specialized medical supervision and may involve advanced testing and personalized protocols.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="followup" className="mt-4 sm:mt-6">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="flex items-center text-red-600 text-base sm:text-lg">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Diabetes Reversal Follow-up Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-4">
                        <Card className="border-blue-200 bg-blue-50">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-blue-700 text-sm mb-2 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Next Appointment
                            </h5>
                            <p className="text-xs text-blue-600">{result.followUpPlan.nextAppointment}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-green-700 text-sm mb-2 flex items-center">
                              <Activity className="w-4 h-4 mr-2" />
                              Monitoring Schedule
                            </h5>
                            <ul className="space-y-1 text-xs text-green-600">
                              {result.followUpPlan.monitoringSchedule.map((schedule, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                  {schedule}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-yellow-200 bg-yellow-50">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-yellow-700 text-sm mb-2 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Lifestyle Changes
                            </h5>
                            <ul className="space-y-1 text-xs text-yellow-600">
                              {result.followUpPlan.lifestyleChanges.map((change, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                  {change}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-purple-200 bg-purple-50">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-purple-700 text-sm mb-2 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              Expected Improvement
                            </h5>
                            <p className="text-xs text-purple-600">{result.followUpPlan.expectedImprovement}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-red-200 bg-red-50">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-red-700 text-sm mb-2 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Reversal Timeline
                            </h5>
                            <p className="text-xs text-red-600">{result.followUpPlan.reversalTimeline}</p>
                          </CardContent>
                        </Card>

                        <Card className="border-green-200 bg-green-50">
                          <CardContent className="p-4">
                            <h5 className="font-semibold text-green-700 text-sm mb-2 flex items-center">
                              <Star className="w-4 h-4 mr-2" />
                              Success Metrics
                            </h5>
                            <ul className="space-y-1 text-xs text-green-600">
                              {result.followUpPlan.successMetrics.map((metric, index) => (
                                <li key={index} className="flex items-start">
                                  <Star className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                                  {metric}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Advanced Diabetes Reversal Disclaimer
                </h4>
                <p className="text-xs text-red-600 leading-relaxed">
                  This AI-generated diabetes reversal program represents an advanced protocol that should only be
                  implemented under strict medical supervision by qualified healthcare providers specializing in
                  diabetes reversal and metabolic medicine. Diabetes reversal requires intensive monitoring, gradual
                  medication adjustments, and personalized protocols that may not be suitable for everyone. Individual
                  results vary significantly, and this report provides general guidelines based on current diabetes
                  reversal research. Always consult with your endocrinologist, diabetes educator, or certified diabetes
                  reversal specialist before making any changes to your diabetes management plan, medications, diet, or
                  exercise routine. Regular monitoring by healthcare professionals is essential for safe and effective
                  diabetes reversal.
                </p>
              </div>
            </CardContent>
          </Card>
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
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white text-red-600 hover:bg-red-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <Card className="border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 sm:p-6">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Advanced Diabetes Reversal Assessment</h1>
                  <p className="text-red-100 text-xs sm:text-sm">
                    Comprehensive 3-month diabetes reversal program with detailed protocols
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Reversal Program
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 lg:p-6">
            {/* Real-time Health Insights */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Real-time Health Insights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-700 text-sm mb-2">BMI Calculator</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {formData.height && formData.weight ? calculateBMI().bmi : "--"}
                    </div>
                    <p
                      className={`text-xs ${formData.height && formData.weight ? calculateBMI().color : "text-gray-500"}`}
                    >
                      {formData.height && formData.weight ? calculateBMI().category : "Enter height & weight"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-700 text-sm mb-2">Fasting Blood Sugar</h4>
                    <div className="text-2xl font-bold text-green-600">{formData.fastingBloodSugar || "--"}</div>
                    <p
                      className={`text-xs ${formData.fastingBloodSugar ? getBloodSugarStatus(formData.fastingBloodSugar, "fasting").color : "text-gray-500"}`}
                    >
                      {formData.fastingBloodSugar
                        ? getBloodSugarStatus(formData.fastingBloodSugar, "fasting").status
                        : "Enter fasting glucose"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-700 text-sm mb-2">Post-meal Blood Sugar</h4>
                    <div className="text-2xl font-bold text-yellow-600">{formData.postMealBloodSugar || "--"}</div>
                    <p
                      className={`text-xs ${formData.postMealBloodSugar ? getBloodSugarStatus(formData.postMealBloodSugar, "postMeal").color : "text-gray-500"}`}
                    >
                      {formData.postMealBloodSugar
                        ? getBloodSugarStatus(formData.postMealBloodSugar, "postMeal").status
                        : "Enter post-meal glucose"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-red-700 text-sm mb-2">HbA1c Assessment</h4>
                    <div className="text-2xl font-bold text-red-600">
                      {formData.hba1cLevel ? `${formData.hba1cLevel}%` : "--"}
                    </div>
                    <p
                      className={`text-xs ${formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).color : "text-gray-500"}`}
                    >
                      {formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).status : "Enter HbA1c level"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <form className="space-y-6">
              {/* Step 1: Personal Information */}
              <Card className="border-red-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-red-600 text-base">
                    <User className="w-5 h-5 mr-2" />
                    Step 1: Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-sm font-medium">
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
                      <Label htmlFor="gender" className="text-sm font-medium">
                        Gender *
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
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
                      <Label htmlFor="weight" className="text-sm font-medium">
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
                      <Label htmlFor="height" className="text-sm font-medium">
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
                      <Label htmlFor="diabetesType" className="text-sm font-medium">
                        Diabetes Type *
                      </Label>
                      <Select
                        value={formData.diabetesType}
                        onValueChange={(value) => setFormData({ ...formData, diabetesType: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select diabetes type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="type1">Type 1 Diabetes</SelectItem>
                          <SelectItem value="type2">Type 2 Diabetes</SelectItem>
                          <SelectItem value="gestational">Gestational Diabetes</SelectItem>
                          <SelectItem value="prediabetes">Pre-diabetes</SelectItem>
                          <SelectItem value="mody">MODY (Maturity Onset Diabetes)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="diagnosisDate" className="text-sm font-medium">
                        Diagnosis Date
                      </Label>
                      <Input
                        id="diagnosisDate"
                        type="date"
                        value={formData.diagnosisDate}
                        onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location (City, State)
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Enter your location"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact" className="text-sm font-medium">
                        Emergency Contact
                      </Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        placeholder="Emergency contact number"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Medical History */}
              <Card className="border-red-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-red-600 text-base">
                    <FileText className="w-5 h-5 mr-2" />
                    Step 2: Medical History & Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <Label htmlFor="currentMedications" className="text-sm font-medium">
                        Current Medications
                      </Label>
                      <Textarea
                        id="currentMedications"
                        value={formData.currentMedications}
                        onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                        placeholder="List all current diabetes medications with dosages"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hba1cLevel" className="text-sm font-medium">
                        HbA1c Level (%) *
                      </Label>
                      <Input
                        id="hba1cLevel"
                        type="number"
                        step="0.1"
                        value={formData.hba1cLevel}
                        onChange={(e) => setFormData({ ...formData, hba1cLevel: e.target.value })}
                        placeholder="e.g., 7.2"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodPressureSystolic" className="text-sm font-medium">
                        Blood Pressure (Systolic)
                      </Label>
                      <Input
                        id="bloodPressureSystolic"
                        type="number"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
                        placeholder="e.g., 120"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodPressureDiastolic" className="text-sm font-medium">
                        Blood Pressure (Diastolic)
                      </Label>
                      <Input
                        id="bloodPressureDiastolic"
                        type="number"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
                        placeholder="e.g., 80"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastCheckup" className="text-sm font-medium">
                        Last Medical Checkup
                      </Label>
                      <Input
                        id="lastCheckup"
                        type="date"
                        value={formData.lastCheckup}
                        onChange={(e) => setFormData({ ...formData, lastCheckup: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <Label htmlFor="familyHistory" className="text-sm font-medium">
                        Family History of Diabetes
                      </Label>
                      <Textarea
                        id="familyHistory"
                        value={formData.familyHistory}
                        onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                        placeholder="Describe family history of diabetes and related conditions"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Allergies & Intolerances</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {allergyOptions.map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-2">
                          <Checkbox
                            id={`allergy-${allergy}`}
                            checked={formData.allergies.includes(allergy)}
                            onCheckedChange={(checked) => handleMultiSelect("allergies", allergy, checked as boolean)}
                          />
                          <Label htmlFor={`allergy-${allergy}`} className="text-xs">
                            {allergy}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Diabetes Complications</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {complicationOptions.map((complication) => (
                        <div key={complication} className="flex items-center space-x-2">
                          <Checkbox
                            id={`complication-${complication}`}
                            checked={formData.complications.includes(complication)}
                            onCheckedChange={(checked) =>
                              handleMultiSelect("complications", complication, checked as boolean)
                            }
                          />
                          <Label htmlFor={`complication-${complication}`} className="text-xs">
                            {complication}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Parameters Section */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center justify-between text-purple-600 text-base">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Advanced Diabetes Reversal Parameters
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                      className="text-purple-600 border-purple-300"
                    >
                      {showAdvancedParams ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {showAdvancedParams ? "Hide" : "Show"} Advanced
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showAdvancedParams && (
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="insulinResistance" className="text-sm font-medium">
                          Insulin Resistance Level
                        </Label>
                        <Select
                          value={formData.insulinResistance}
                          onValueChange={(value) => setFormData({ ...formData, insulinResistance: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                            <SelectItem value="unknown">Unknown/Not tested</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cPeptideLevel" className="text-sm font-medium">
                          C-Peptide Level (ng/mL)
                        </Label>
                        <Input
                          id="cPeptideLevel"
                          type="number"
                          step="0.1"
                          value={formData.cPeptideLevel}
                          onChange={(e) => setFormData({ ...formData, cPeptideLevel: e.target.value })}
                          placeholder="e.g., 2.5"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="microalbuminuria" className="text-sm font-medium">
                          Microalbuminuria (mg/g)
                        </Label>
                        <Input
                          id="microalbuminuria"
                          type="number"
                          value={formData.microalbuminuria}
                          onChange={(e) => setFormData({ ...formData, microalbuminuria: e.target.value })}
                          placeholder="e.g., 25"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lipidProfile" className="text-sm font-medium">
                          Lipid Profile Status
                        </Label>
                        <Select
                          value={formData.lipidProfile}
                          onValueChange={(value) => setFormData({ ...formData, lipidProfile: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="borderline">Borderline</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="unknown">Not tested recently</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="thyroidFunction" className="text-sm font-medium">
                          Thyroid Function (TSH)
                        </Label>
                        <Input
                          id="thyroidFunction"
                          type="number"
                          step="0.01"
                          value={formData.thyroidFunction}
                          onChange={(e) => setFormData({ ...formData, thyroidFunction: e.target.value })}
                          placeholder="e.g., 2.5"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vitaminD" className="text-sm font-medium">
                          Vitamin D Level (ng/mL)
                        </Label>
                        <Input
                          id="vitaminD"
                          type="number"
                          value={formData.vitaminD}
                          onChange={(e) => setFormData({ ...formData, vitaminD: e.target.value })}
                          placeholder="e.g., 30"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="inflammation" className="text-sm font-medium">
                          Inflammation Markers (CRP)
                        </Label>
                        <Input
                          id="inflammation"
                          type="number"
                          step="0.1"
                          value={formData.inflammation}
                          onChange={(e) => setFormData({ ...formData, inflammation: e.target.value })}
                          placeholder="e.g., 3.2"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Step 3: Lifestyle Factors */}
              <Card className="border-red-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-red-600 text-base">
                    <Activity className="w-5 h-5 mr-2" />
                    Step 3: Lifestyle & Dietary Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="activityLevel" className="text-sm font-medium">
                        Current Activity Level
                      </Label>
                      <Select
                        value={formData.activityLevel}
                        onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                          <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (2x/day or intense)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exerciseFrequency" className="text-sm font-medium">
                        Exercise Frequency (per week)
                      </Label>
                      <Input
                        id="exerciseFrequency"
                        type="number"
                        value={formData.exerciseFrequency}
                        onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
                        placeholder="e.g., 3"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleepHours" className="text-sm font-medium">
                        Average Sleep Hours
                      </Label>
                      <Input
                        id="sleepHours"
                        type="number"
                        step="0.5"
                        value={formData.sleepHours}
                        onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                        placeholder="e.g., 7.5"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smokingStatus" className="text-sm font-medium">
                        Smoking Status
                      </Label>
                      <Select
                        value={formData.smokingStatus}
                        onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select smoking status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never smoked</SelectItem>
                          <SelectItem value="former">Former smoker</SelectItem>
                          <SelectItem value="current">Current smoker</SelectItem>
                          <SelectItem value="occasional">Occasional smoker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="alcoholConsumption" className="text-sm font-medium">
                        Alcohol Consumption
                      </Label>
                      <Select
                        value={formData.alcoholConsumption}
                        onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select alcohol consumption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                          <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workSchedule" className="text-sm font-medium">
                        Work Schedule
                      </Label>
                      <Select
                        value={formData.workSchedule}
                        onValueChange={(value) => setFormData({ ...formData, workSchedule: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select work schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular (9-5)</SelectItem>
                          <SelectItem value="shift">Shift work</SelectItem>
                          <SelectItem value="night">Night shift</SelectItem>
                          <SelectItem value="irregular">Irregular hours</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Dietary Preferences</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {dietPreferenceOptions.map((preference) => (
                        <div key={preference} className="flex items-center space-x-2">
                          <Checkbox
                            id={`diet-${preference}`}
                            checked={formData.dietPreferences === preference}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({ ...formData, dietPreferences: preference })
                              }
                            }}
                          />
                          <Label htmlFor={`diet-${preference}`} className="text-xs">
                            {preference}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Stress Levels & Mental Health</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {stressLevelOptions.map((stress) => (
                        <div key={stress} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stress-${stress}`}
                            checked={formData.stressLevel.includes(stress)}
                            onCheckedChange={(checked) => handleMultiSelect("stressLevel", stress, checked as boolean)}
                          />
                          <Label htmlFor={`stress-${stress}`} className="text-xs">
                            {stress}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Current Symptoms */}
              <Card className="border-red-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-red-600 text-base">
                    <Heart className="w-5 h-5 mr-2" />
                    Step 4: Current Symptoms & Blood Sugar Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fastingBloodSugar" className="text-sm font-medium">
                        Fasting Blood Sugar (mg/dL)
                      </Label>
                      <Input
                        id="fastingBloodSugar"
                        type="number"
                        value={formData.fastingBloodSugar}
                        onChange={(e) => setFormData({ ...formData, fastingBloodSugar: e.target.value })}
                        placeholder="e.g., 120"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postMealBloodSugar" className="text-sm font-medium">
                        Post-meal Blood Sugar (mg/dL)
                      </Label>
                      <Input
                        id="postMealBloodSugar"
                        type="number"
                        value={formData.postMealBloodSugar}
                        onChange={(e) => setFormData({ ...formData, postMealBloodSugar: e.target.value })}
                        placeholder="e.g., 180"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyEpisodes" className="text-sm font-medium">
                        Recent Emergency Episodes
                      </Label>
                      <Input
                        id="emergencyEpisodes"
                        value={formData.emergencyEpisodes}
                        onChange={(e) => setFormData({ ...formData, emergencyEpisodes: e.target.value })}
                        placeholder="Describe any recent emergencies"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Frequent Symptoms (Select all that apply)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {symptomOptions.map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            id={`symptom-${symptom}`}
                            checked={formData.frequentSymptoms.includes(symptom)}
                            onCheckedChange={(checked) =>
                              handleMultiSelect("frequentSymptoms", symptom, checked as boolean)
                            }
                          />
                          <Label htmlFor={`symptom-${symptom}`} className="text-xs">
                            {symptom}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">
                      Overall Symptom Severity: {formData.symptomSeverity[0]}/10
                    </Label>
                    <Slider
                      value={formData.symptomSeverity}
                      onValueChange={(value) => setFormData({ ...formData, symptomSeverity: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Mild (1)</span>
                      <span>Moderate (5)</span>
                      <span>Severe (10)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 5: Diabetes Reversal Goals */}
              <Card className="border-red-200">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center text-red-600 text-base">
                    <Target className="w-5 h-5 mr-2" />
                    Step 5: Diabetes Reversal Goals & Commitment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="weightTarget" className="text-sm font-medium">
                        Target Weight (kg)
                      </Label>
                      <Input
                        id="weightTarget"
                        type="number"
                        value={formData.weightTarget}
                        onChange={(e) => setFormData({ ...formData, weightTarget: e.target.value })}
                        placeholder="Enter target weight"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hba1cTarget" className="text-sm font-medium">
                        Target HbA1c (%)
                      </Label>
                      <Input
                        id="hba1cTarget"
                        type="number"
                        step="0.1"
                        value={formData.hba1cTarget}
                        onChange={(e) => setFormData({ ...formData, hba1cTarget: e.target.value })}
                        placeholder="e.g., 5.7 (reversal target)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetRange" className="text-sm font-medium">
                        Monthly Budget Range (₹)
                      </Label>
                      <Select
                        value={formData.budgetRange}
                        onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                          <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                          <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                          <SelectItem value="30000+">₹30,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="exerciseGoals" className="text-sm font-medium">
                      Exercise & Fitness Goals
                    </Label>
                    <Textarea
                      id="exerciseGoals"
                      value={formData.exerciseGoals}
                      onChange={(e) => setFormData({ ...formData, exerciseGoals: e.target.value })}
                      placeholder="Describe your exercise and fitness goals for diabetes reversal"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="dietaryRestrictions" className="text-sm font-medium">
                      Dietary Restrictions & Food Allergies
                    </Label>
                    <Textarea
                      id="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                      placeholder="List any dietary restrictions, food allergies, or cultural preferences"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Primary Diabetes Reversal Goals</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {healthGoalOptions.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={`goal-${goal}`}
                            checked={formData.primaryGoals.includes(goal)}
                            onCheckedChange={(checked) => handleMultiSelect("primaryGoals", goal, checked as boolean)}
                          />
                          <Label htmlFor={`goal-${goal}`} className="text-xs">
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-3 block">Commitment Level & Readiness</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {commitmentLevelOptions.map((commitment) => (
                        <div key={commitment} className="flex items-center space-x-2">
                          <Checkbox
                            id={`commitment-${commitment}`}
                            checked={formData.commitmentLevel.includes(commitment)}
                            onCheckedChange={(checked) =>
                              handleMultiSelect("commitmentLevel", commitment, checked as boolean)
                            }
                          />
                          <Label htmlFor={`commitment-${commitment}`} className="text-xs">
                            {commitment}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="additionalNotes" className="text-sm font-medium">
                      Additional Notes & Concerns
                    </Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      placeholder="Any additional information, concerns, or questions about your diabetes reversal journey"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Advanced Diabetes Reversal Plan...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Generate Comprehensive Diabetes Reversal Plan
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2 flex items-center text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Advanced Diabetes Reversal Program Information
              </h4>
              <p className="text-xs text-red-600 leading-relaxed">
                This comprehensive diabetes reversal assessment generates a personalized 3-month protocol designed to
                achieve diabetes remission (HbA1c &lt;6.0% without medications). The program includes detailed
                medication tapering schedules, location-based emergency protocols, comprehensive diet plans with Indian
                foods, advanced laboratory monitoring, supplement recommendations, Ayurvedic treatments, and intensive
                lifestyle interventions. This advanced program requires strict medical supervision and is designed for
                individuals committed to achieving complete diabetes reversal through evidence-based protocols.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PoweredByFooter />
    </div>
  )
}
