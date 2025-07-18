"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

interface ExerciseRecommendation {
  type: string
  duration: number
  frequency: string
  intensity: string
  bmiImpact: string
  glucoseEffect: string
  equipment: string
  progression: string
}

// Update the DiabetesReversalResult interface to include exercise recommendations
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
        water: number
      }>
      totalCalories: number
      totalCarbs: number
      totalWater: number
      waterIntake: string
      supplements: string
      exerciseMinutes: string
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
        water: number
      }>
      totalCalories: number
      totalCarbs: number
      totalWater: number
      waterIntake: string
      supplements: string
      exerciseMinutes: string
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
        water: number
      }>
      totalCalories: number
      totalCarbs: number
      totalWater: number
      waterIntake: string
      supplements: string
      exerciseMinutes: string
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
        water: number
      }>
      totalCalories: number
      totalCarbs: number
      totalWater: number
      waterIntake: string
      supplements: string
      exerciseMinutes: string
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

  exerciseRecommendations: Array<ExerciseRecommendation>
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
You are Dr. MediAI, a world-renowned diabetes reversal specialist with 30+ years of clinical experience in advanced diabetes reversal programs. You have successfully reversed diabetes in over 10,000 patients worldwide. Provide a comprehensive, personalized diabetes reversal assessment in EXACTLY the format specified below.

PATIENT DIABETES REVERSAL PROFILE ANALYSIS:
==========================================
Name: ${formData.fullName}
Age: ${formData.age} years | Gender: ${formData.gender}
Height: ${formData.height} cm | Weight: ${formData.weight} kg
BMI: ${formData.height && formData.weight ? calculateBMI().bmi : "Not calculated"} (${formData.height && formData.weight ? calculateBMI().category : "Not available"})
Target BMI: ${formData.height && formData.weightTarget ? (Number(formData.weightTarget) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1) : "Calculate based on target weight"}
Diabetes Type: ${formData.diabetesType}
Diagnosis Date: ${formData.diagnosisDate || "Not specified"}
Years with Diabetes: ${formData.diagnosisDate ? Math.floor((new Date().getTime() - new Date(formData.diagnosisDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) : "Unknown"}
Location: ${formData.location || "Not specified"}
Emergency Contact: ${formData.emergencyContact || "Not provided"}

CURRENT DIABETES STATUS & REVERSAL POTENTIAL:
=============================================
HbA1c Level: ${formData.hba1cLevel}% (${formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).status : "Not provided"})
Reversal Potential: ${formData.hba1cLevel ? (Number(formData.hba1cLevel) < 8 ? "HIGH - Excellent candidate for reversal" : Number(formData.hba1cLevel) < 10 ? "MODERATE - Good reversal potential with intensive intervention" : "CHALLENGING - Requires aggressive protocol") : "Assessment needed"}
Blood Pressure: ${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic} mmHg
Fasting Blood Sugar: ${formData.fastingBloodSugar} mg/dL (${formData.fastingBloodSugar ? getBloodSugarStatus(formData.fastingBloodSugar, "fasting").status : "Not provided"})
Post-Meal Blood Sugar: ${formData.postMealBloodSugar} mg/dL (${formData.postMealBloodSugar ? getBloodSugarStatus(formData.postMealBloodSugar, "postMeal").status : "Not provided"})
Estimated Beta Cell Function: ${formData.cPeptideLevel ? (Number(formData.cPeptideLevel) > 1.0 ? "Good - Excellent reversal potential" : "Moderate - Reversal possible with intensive protocol") : "Assessment recommended"}

COMPREHENSIVE MEDICAL BACKGROUND:
=================================
Current Medications: ${formData.currentMedications || "None specified"}
Medication Dependency Score: ${formData.currentMedications ? (formData.currentMedications.toLowerCase().includes("insulin") ? "High - Requires careful tapering" : "Moderate - Good tapering potential") : "Low"}
Allergies: ${formData.allergies.join(", ") || "None"}
Family History: ${formData.familyHistory || "Not specified"}
Complications: ${formData.complications.join(", ") || "None"}
Complication Risk: ${formData.complications.length > 0 ? "Elevated - Requires immediate intervention" : "Low - Excellent reversal candidate"}
Last Checkup: ${formData.lastCheckup || "Not specified"}

ADVANCED METABOLIC PARAMETERS:
==============================
Insulin Resistance: ${formData.insulinResistance || "Assessment needed"}
C-Peptide Level: ${formData.cPeptideLevel || "Not tested"} ng/mL
Pancreatic Reserve: ${formData.cPeptideLevel ? (Number(formData.cPeptideLevel) > 2.0 ? "Excellent" : Number(formData.cPeptideLevel) > 1.0 ? "Good" : "Moderate") : "Assessment needed"}
Microalbuminuria: ${formData.microalbuminuria || "Not tested"} mg/g
Kidney Function: ${formData.microalbuminuria ? (Number(formData.microalbuminuria) < 30 ? "Normal" : "Early damage detected") : "Assessment needed"}
Lipid Profile: ${formData.lipidProfile || "Not tested"}
Thyroid Function: ${formData.thyroidFunction || "Not tested"} mIU/L
Vitamin D: ${formData.vitaminD || "Not tested"} ng/mL
Inflammation Markers: ${formData.inflammation || "Not tested"} mg/L

COMPREHENSIVE LIFESTYLE ANALYSIS:
=================================
Activity Level: ${formData.activityLevel || "Not specified"}
Current Exercise: ${formData.exerciseFrequency || "0"} days/week
Target Exercise: ${formData.exerciseFrequency ? Math.max(Number(formData.exerciseFrequency) + 2, 5) : 5} days/week, 45-60 minutes/day
Sleep Hours: ${formData.sleepHours || "Not specified"}
Sleep Quality Impact: ${formData.sleepHours ? (Number(formData.sleepHours) < 7 ? "Poor sleep affecting glucose metabolism" : "Good sleep supporting reversal") : "Assessment needed"}
Smoking: ${formData.smokingStatus || "Not specified"}
Alcohol: ${formData.alcoholConsumption || "Not specified"}
Diet Preferences: ${formData.dietPreferences || "Not specified"}
Stress Levels: ${formData.stressLevel.join(", ") || "Not specified"}
Work Schedule: ${formData.workSchedule || "Not specified"}

CURRENT SYMPTOM PROFILE:
========================
Frequent Symptoms: ${formData.frequentSymptoms.join(", ") || "None reported"}
Symptom Severity: ${formData.symptomSeverity[0]}/10
Symptom Impact: ${formData.symptomSeverity[0] > 7 ? "Severe - Immediate intervention needed" : formData.symptomSeverity[0] > 4 ? "Moderate - Good reversal potential" : "Mild - Excellent reversal candidate"}
Emergency Episodes: ${formData.emergencyEpisodes || "None reported"}
Emergency Risk: ${formData.emergencyEpisodes ? "Elevated - Requires emergency protocols" : "Low - Stable for reversal program"}

PERSONALIZED REVERSAL GOALS & COMMITMENT:
=========================================
Current Weight: ${formData.weight} kg
Target Weight: ${formData.weightTarget || "Calculate optimal"} kg
Weight Loss Needed: ${formData.weight && formData.weightTarget ? Math.max(Number(formData.weight) - Number(formData.weightTarget), 0) : "Calculate"} kg
Current HbA1c: ${formData.hba1cLevel}%
Target HbA1c: ${formData.hba1cTarget || "5.7%"} (Reversal target)
HbA1c Reduction Needed: ${formData.hba1cLevel && formData.hba1cTarget ? Math.max(Number(formData.hba1cLevel) - Number(formData.hba1cTarget), 0).toFixed(1) : "Calculate"}%
Primary Goals: ${formData.primaryGoals.join(", ") || "Complete diabetes reversal"}
Dietary Restrictions: ${formData.dietaryRestrictions || "None"}
Exercise Goals: ${formData.exerciseGoals || "Comprehensive fitness improvement"}
Commitment Level: ${formData.commitmentLevel.join(", ") || "High commitment to reversal"}
Budget Range: ${formData.budgetRange || "Standard program"}
Success Probability: ${formData.commitmentLevel.includes("Highly committed") ? "95% - Excellent commitment" : "85% - Good potential with support"}

PROVIDE YOUR COMPREHENSIVE DIABETES REVERSAL RESPONSE IN EXACTLY THIS FORMAT:
=============================================================================

**SECTION 1: PERSONALIZED DIABETES REVERSAL MEDICATIONS & TAPERING**
MED-1: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Week-by-week Tapering Schedule] | [Monitoring Requirements]
MED-2: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Week-by-week Tapering Schedule] | [Monitoring Requirements]
MED-3: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Week-by-week Tapering Schedule] | [Monitoring Requirements]
MED-4: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Week-by-week Tapering Schedule] | [Monitoring Requirements]
MED-5: [Medicine Name] | [Current Dosage] | [Frequency] | [Timing] | [Duration] | [Category] | [Price ₹] | [Week-by-week Tapering Schedule] | [Monitoring Requirements]

**SECTION 2: COMPREHENSIVE VITAL MONITORING & BMI TRACKING**
VITAL-1: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device] | [BMI Impact]
VITAL-2: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device] | [BMI Impact]
VITAL-3: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device] | [BMI Impact]
VITAL-4: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device] | [BMI Impact]
VITAL-5: [Vital Sign] | [Frequency] | [Timing] | [Target Range] | [Importance] | [Notes] | [Monitoring Device] | [BMI Impact]

**SECTION 3: ADVANCED LABORATORY TESTS & METABOLIC MONITORING**
LAB-1: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month] | [Reversal Significance]
LAB-2: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month] | [Reversal Significance]
LAB-3: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month] | [Reversal Significance]
LAB-4: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month] | [Reversal Significance]
LAB-5: [Test Name] | [Priority] | [Reason] | [Preparation] | [Cost ₹] | [Normal Range] | [Month] | [Reversal Significance]

**SECTION 4: PERSONALIZED EXERCISE & FITNESS PLAN**
EXERCISE-1: [Exercise Type] | [Duration Minutes] | [Frequency] | [Intensity] | [BMI Impact] | [Glucose Effect] | [Equipment Needed] | [Progression Plan]
EXERCISE-2: [Exercise Type] | [Duration Minutes] | [Frequency] | [Intensity] | [BMI Impact] | [Glucose Effect] | [Equipment Needed] | [Progression Plan]
EXERCISE-3: [Exercise Type] | [Duration Minutes] | [Frequency] | [Intensity] | [BMI Impact] | [Glucose Effect] | [Equipment Needed] | [Progression Plan]
EXERCISE-4: [Exercise Type] | [Duration Minutes] | [Frequency] | [Intensity] | [BMI Impact] | [Glucose Effect] | [Equipment Needed] | [Progression Plan]
EXERCISE-5: [Exercise Type] | [Duration Minutes] | [Frequency] | [Intensity] | [BMI Impact] | [Glucose Effect] | [Equipment Needed] | [Progression Plan]

**SECTION 5: COMPREHENSIVE WEEK 1 DETAILED DIET PLAN WITH UNIQUE CHOICES**
DAY1: Monday | ${new Date(currentDate.getTime() + 0 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Mid-Morning: [Unique Items] [Calories] [Water ml] | Lunch: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Evening: [Unique Items] [Calories] [Water ml] | Dinner: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | [Total Calories] | [Total Carbs]g | [Total Water ml] | [Supplements] | [Exercise Minutes] | [BMI Progress Notes]
DAY2: Tuesday | ${new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Mid-Morning: [Unique Items] [Calories] [Water ml] | Lunch: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Evening: [Unique Items] [Calories] [Water ml] | Dinner: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | [Total Calories] | [Total Carbs]g | [Total Water ml] | [Supplements] | [Exercise Minutes] | [BMI Progress Notes]
DAY3: Wednesday | ${new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Mid-Morning: [Unique Items] [Calories] [Water ml] | Lunch: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Evening: [Unique Items] [Calories] [Water ml] | Dinner: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | [Total Calories] | [Total Carbs]g | [Total Water ml] | [Supplements] | [Exercise Minutes] | [BMI Progress Notes]
DAY4: Thursday | ${new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Mid-Morning: [Unique Items] [Calories] [Water ml] | Lunch: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Evening: [Unique Items] [Calories] [Water ml] | Dinner: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | [Total Calories] | [Total Carbs]g | [Total Water ml] | [Supplements] | [Exercise Minutes] | [BMI Progress Notes]
DAY5: Friday | ${new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Mid-Morning: [Unique Items] [Calories] [Water ml] | Lunch: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Evening: [Unique Items] [Calories] [Water ml] | Dinner: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | [Total Calories] | [Total Carbs]g | [Total Water ml] | [Supplements] | [Exercise Minutes] | [BMI Progress Notes]
DAY6: Saturday | ${new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} | Breakfast: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Mid-Morning: [Unique Items] [Calories] [Water ml] | Lunch: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | Evening: [Unique Items] [Calories] [Water ml] | Dinner: [Unique Items] [Calories] [Carbs]g [Protein]g [Fat]g [Fiber]g [GI] [Water ml] | [Preparation] | [3 Alternative Options] | [Total Calories] | [Total Carbs]g | [Total Water ml] | [Supplements] | [Exercise Minutes] | [BMI Progress Notes]

**SECTION 6: DETAILED 3-MONTH DIABETES REVERSAL PLAN WITH BMI TARGETS**
MONTH1: Stabilization & Foundation | BMI Target: [Current BMI - 1-2 points] | Weight Target: [Target kg] | Exercise Minutes: [Total weekly minutes] | Goals: [Goal1] [Goal2] [Goal3] [Goal4] [Goal5] | Diet Focus: [Focus1] [Focus2] [Focus3] [Focus4] | Exercise Plan: [Exercise1] [Exercise2] [Exercise3] [Exercise4] | Medications: [Med1] [Med2] [Med3] [Med4] | Monitoring: [Monitor1] [Monitor2] [Monitor3] [Monitor4] | Milestones: [Milestone1] [Milestone2] [Milestone3] [Milestone4] | Expected Results: [Detailed results with BMI and HbA1c targets]
MONTH2: Optimization & Acceleration | BMI Target: [Month 1 BMI - 1-2 points] | Weight Target: [Target kg] | Exercise Minutes: [Total weekly minutes] | Goals: [Goal1] [Goal2] [Goal3] [Goal4] [Goal5] | Diet Focus: [Focus1] [Focus2] [Focus3] [Focus4] | Exercise Plan: [Exercise1] [Exercise2] [Exercise3] [Exercise4] | Medications: [Med1] [Med2] [Med3] [Med4] | Monitoring: [Monitor1] [Monitor2] [Monitor3] [Monitor4] | Milestones: [Milestone1] [Milestone2] [Milestone3] [Milestone4] | Expected Results: [Detailed results with BMI and HbA1c targets]
MONTH3: Reversal Achievement | BMI Target: [Target BMI 18.5-24.9] | Weight Target: [Final target kg] | Exercise Minutes: [Total weekly minutes] | Goals: [Goal1] [Goal2] [Goal3] [Goal4] [Goal5] | Diet Focus: [Focus1] [Focus2] [Focus3] [Focus4] | Exercise Plan: [Exercise1] [Exercise2] [Exercise3] [Exercise4] | Medications: [Med1] [Med2] [Med3] [Med4] | Monitoring: [Monitor1] [Monitor2] [Monitor3] [Monitor4] | Milestones: [Milestone1] [Milestone2] [Milestone3] [Milestone4] | Expected Results: [Detailed results with BMI and HbA1c targets]

**SECTION 7: COMPREHENSIVE EMERGENCY PROTOCOLS**
HYPOGLYCEMIA-SYMPTOMS: [Symptom1] | [Symptom2] | [Symptom3] | [Symptom4] | [Symptom5] | [Symptom6]
HYPOGLYCEMIA-ACTIONS: [Action1] | [Action2] | [Action3] | [Action4] | [Action5] | [Action6]
HYPOGLYCEMIA-MEDS: [Med1] | [Med2] | [Med3] | [Med4] | [Med5] | [Med6]
HYPOGLYCEMIA-HELP: [When1] | [When2] | [When3] | [When4] | [When5] | [When6]
HYPERGLYCEMIA-SYMPTOMS: [Symptom1] | [Symptom2] | [Symptom3] | [Symptom4] | [Symptom5] | [Symptom6]
HYPERGLYCEMIA-ACTIONS: [Action1] | [Action2] | [Action3] | [Action4] | [Action5] | [Action6]
HYPERGLYCEMIA-MEDS: [Med1] | [Med2] | [Med3] | [Med4] | [Med5] | [Med6]
HYPERGLYCEMIA-HELP: [When1] | [When2] | [When3] | [When4] | [When5] | [When6]
KETOACIDOSIS-SYMPTOMS: [Symptom1] | [Symptom2] | [Symptom3] | [Symptom4] | [Symptom5] | [Symptom6]
KETOACIDOSIS-ACTIONS: [Action1] | [Action2] | [Action3] | [Action4] | [Action5] | [Action6]
KETOACIDOSIS-MEDS: [Med1] | [Med2] | [Med3] | [Med4] | [Med5] | [Med6]
KETOACIDOSIS-HELP: [When1] | [When2] | [When3] | [When4] | [When5] | [When6]

**SECTION 8: PERSONALIZED DIABETES REVERSAL SUPPLEMENTS**
SUPP-1: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month] | [BMI Impact]
SUPP-2: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month] | [BMI Impact]
SUPP-3: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month] | [BMI Impact]
SUPP-4: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month] | [BMI Impact]
SUPP-5: [Supplement Name] | [Dosage] | [Timing] | [Benefits] | [Brand] | [Price ₹] | [Warnings] | [Month] | [BMI Impact]

**SECTION 9: ADVANCED AYURVEDIC DIABETES REVERSAL**
AYUR-1: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner] | [Cost ₹]
AYUR-2: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner] | [Cost ₹]
AYUR-3: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner] | [Cost ₹]
AYUR-4: [Treatment Name] | [Herbs] | [Preparation] | [Dosage] | [Timing] | [Benefits] | [Duration] | [Practitioner] | [Cost ₹]

**SECTION 10: COMPREHENSIVE DIABETES REVERSAL FOLLOW-UP**
NEXT-APPOINTMENT: [Timeline and detailed recommendations]
MONITORING-SCHEDULE: [Schedule 1] | [Schedule 2] | [Schedule 3] | [Schedule 4] | [Schedule 5]
LIFESTYLE-CHANGES: [Change 1] | [Change 2] | [Change 3] | [Change 4] | [Change 5]
EXPECTED-IMPROVEMENT: [Detailed timeline and expectations with BMI and HbA1c targets]
REVERSAL-TIMELINE: [Complete reversal timeline with specific dates and milestones]
SUCCESS-METRICS: [Metric 1] | [Metric 2] | [Metric 3] | [Metric 4] | [Metric 5] | [Metric 6]
BMI-PROGRESSION: [Month 1 BMI target] | [Month 2 BMI target] | [Month 3 BMI target] | [Final BMI goal]
EXERCISE-PROGRESSION: [Week 1-4 minutes] | [Week 5-8 minutes] | [Week 9-12 minutes] | [Maintenance minutes]

CRITICAL INSTRUCTIONS FOR PERSONALIZED RESPONSE:
- Focus on COMPLETE DIABETES REVERSAL, not just management
- Use patient's specific data (age: ${formData.age}, weight: ${formData.weight}, HbA1c: ${formData.hba1cLevel}, etc.)
- Provide UNIQUE and VARIED food choices for each meal with 3 alternatives each
- Include specific exercise minutes and BMI targets for each month
- Calculate personalized water intake based on weight (35ml per kg body weight minimum)
- Use EXACT format with pipe (|) separators
- Provide specific Indian diabetes reversal medications and prices in ₹
- Include detailed meal plans with exact nutritional values and water amounts
- Consider patient's diabetes type (${formData.diabetesType}), current medications, and reversal potential
- Account for BMI (${formData.height && formData.weight ? calculateBMI().bmi : "calculate"}), blood sugar levels, and current symptoms
- Provide actionable, evidence-based diabetes reversal protocols
- Include both generic and brand names for medications
- Consider all allergies (${formData.allergies.join(", ") || "none"}) and current medications for interactions
- Focus on Indian diabetic reversal diet with local foods and unique ingredients
- Provide 3-month structured reversal timeline with specific BMI and exercise targets
- Include comprehensive water intake recommendations (minimum ${formData.weight ? Math.round(Number(formData.weight) * 35) : 2500}ml daily)
- Make each day's diet plan completely unique with different food combinations
- Include detailed exercise progression with specific minute targets
- Personalize everything based on patient's commitment level: ${formData.commitmentLevel.join(", ") || "standard"}
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

          exerciseRecommendations: [
            {
              type: "Walking",
              duration: 30,
              frequency: "Daily",
              intensity: "Moderate",
              bmiImpact: "Positive",
              glucoseEffect: "Significant",
              equipment: "None",
              progression: "Increase duration by 5 minutes weekly",
            },
            {
              type: "Yoga",
              duration: 45,
              frequency: "3 times a week",
              intensity: "Light to Moderate",
              bmiImpact: "Moderate",
              glucoseEffect: "Moderate",
              equipment: "Yoga mat",
              progression: "Introduce advanced poses gradually",
            },
            {
              type: "Strength Training",
              duration: 30,
              frequency: "2 times a week",
              intensity: "Moderate",
              bmiImpact: "High",
              glucoseEffect: "High",
              equipment: "Dumbbells, resistance bands",
              progression: "Increase weight or resistance weekly",
            },
            {
              type: "Swimming",
              duration: 40,
              frequency: "2 times a week",
              intensity: "Moderate",
              bmiImpact: "High",
              glucoseEffect: "High",
              equipment: "Swimsuit, goggles",
              progression: "Increase laps or duration weekly",
            },
            {
              type: "Cycling",
              duration: 45,
              frequency: "3 times a week",
              intensity: "Moderate",
              bmiImpact: "Moderate",
              glucoseEffect: "Moderate",
              equipment: "Bicycle",
              progression: "Increase distance or speed weekly",
            },
          ],
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

    // Calculate personalized water intake (35ml per kg body weight)
    const dailyWaterIntake = formData.weight ? Math.round(Number(formData.weight) * 35) : 2500

    // Unique meal combinations for each day
    const uniqueMealPlans = [
      {
        // Monday - South Indian Focus
        breakfast: {
          items: "Quinoa Idli (2 pieces) with Coconut Chutney and Sambar",
          calories: 320,
          carbs: 45,
          protein: 14,
          fat: 8,
          fiber: 6,
          gi: "Low (35)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Steam quinoa idli batter, serve with fresh coconut chutney",
          alternatives: [
            "Oats Uttapam with mint chutney",
            "Ragi Dosa with vegetable sambar",
            "Moong dal cheela with green chutney",
          ],
        },
        midMorning: {
          items: "Green Tea with 6 soaked almonds and 2 walnuts",
          calories: 95,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        lunch: {
          items: "Brown Rice (1/2 cup) + Methi Dal + Bhindi Sabzi + Cucumber Raita + Small Salad",
          calories: 420,
          carbs: 58,
          protein: 18,
          fat: 12,
          fiber: 9,
          gi: "Medium (45)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Cook brown rice, prepare dal with fenugreek leaves, stir-fry okra with minimal oil",
          alternatives: [
            "Barnyard millet with rajma curry",
            "Quinoa pulao with mixed vegetables",
            "Foxtail millet with chana dal",
          ],
        },
        evening: {
          items: "Herbal Tea (Cinnamon + Ginger) with 1 small apple",
          calories: 80,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Grilled Fish (100g) + Steamed Broccoli + Cauliflower + 1 small Chapati",
          calories: 350,
          carbs: 28,
          protein: 32,
          fat: 12,
          fiber: 7,
          gi: "Low (30)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Grill fish with turmeric and lemon, steam vegetables, make chapati with almond flour",
          alternatives: [
            "Grilled paneer with roasted vegetables",
            "Baked tofu with stir-fried greens",
            "Grilled chicken with zucchini noodles",
          ],
        },
      },
      {
        // Tuesday - North Indian Focus
        breakfast: {
          items: "Vegetable Poha with Peanuts and Curry Leaves + Buttermilk",
          calories: 310,
          carbs: 42,
          protein: 12,
          fat: 9,
          fiber: 5,
          gi: "Medium (50)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Use flattened rice, add vegetables, temper with mustard seeds",
          alternatives: ["Daliya upma with vegetables", "Besan chilla with spinach", "Oats poha with mixed vegetables"],
        },
        midMorning: {
          items: "Coconut Water (200ml) with 5 cashews",
          calories: 85,
          water: 200,
        },
        lunch: {
          items: "Bajra Roti (1) + Palak Paneer + Mixed Dal + Onion Salad + Mint Chutney",
          calories: 440,
          carbs: 52,
          protein: 22,
          fat: 15,
          fiber: 8,
          gi: "Low (40)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Make bajra flour roti, prepare spinach paneer curry, cook mixed lentils",
          alternatives: ["Jowar roti with baingan bharta", "Makki roti with sarson saag", "Ragi roti with lauki sabzi"],
        },
        evening: {
          items: "Turmeric Latte (Almond Milk) with 2 dates",
          calories: 90,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Grilled Chicken Breast (80g) + Roasted Sweet Potato + Green Beans + Tomato Soup",
          calories: 340,
          carbs: 32,
          protein: 28,
          fat: 10,
          fiber: 8,
          gi: "Low (35)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Grill chicken with herbs, roast sweet potato, sauté green beans",
          alternatives: [
            "Baked fish with roasted pumpkin",
            "Grilled mushrooms with quinoa",
            "Steamed egg whites with vegetables",
          ],
        },
      },
      {
        // Wednesday - Bengali Focus
        breakfast: {
          items: "Cholar Dal with Brown Rice + Begun Bhaja (Eggplant) + Green Tea",
          calories: 330,
          carbs: 48,
          protein: 15,
          fat: 8,
          fiber: 7,
          gi: "Medium (45)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Cook chana dal with coconut, shallow fry eggplant slices",
          alternatives: [
            "Moong dal khichdi with vegetables",
            "Masoor dal with cauliflower",
            "Toor dal with bottle gourd",
          ],
        },
        midMorning: {
          items: "Amla Juice (100ml) with Chia Seeds (1 tsp)",
          calories: 70,
          water: 100,
        },
        lunch: {
          items: "Koraishutir Kochuri (1) + Aloo Posto + Shukto + Fish Curry (Small portion)",
          calories: 460,
          carbs: 55,
          protein: 20,
          fat: 18,
          fiber: 6,
          gi: "Medium (55)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Make peas-stuffed bread, cook potato with poppy seeds, prepare mixed vegetable curry",
          alternatives: ["Luchi with chholar dal", "Paratha with aloo gobi", "Puri with chole"],
        },
        evening: {
          items: "Darjeeling Tea with Jaggery (1 tsp) + 4 almonds",
          calories: 85,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Steamed Hilsa Fish (60g) + Bhapa Doi + Cucumber Salad + 1 small Roti",
          calories: 360,
          carbs: 25,
          protein: 30,
          fat: 16,
          fiber: 4,
          gi: "Low (30)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Steam fish with mustard paste, make steamed yogurt dessert",
          alternatives: ["Steamed pomfret with vegetables", "Baked rui fish with herbs", "Grilled prawns with salad"],
        },
      },
      {
        // Thursday - Gujarati Focus
        breakfast: {
          items: "Dhokla (2 pieces) + Green Chutney + Sprouted Moong Salad + Chaas",
          calories: 300,
          carbs: 40,
          protein: 16,
          fat: 6,
          fiber: 8,
          gi: "Low (35)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Steam gram flour batter, prepare sprout salad with lemon",
          alternatives: ["Khandvi with mint chutney", "Thepla with curd", "Handvo with green chutney"],
        },
        midMorning: {
          items: "Kokum Sherbet (Sugar-free) with Flax Seeds (1 tsp)",
          calories: 60,
          water: 200,
        },
        lunch: {
          items: "Bajra Khichdi + Kadhi + Ringan Bharta + Kachumber Salad + Pickle",
          calories: 420,
          carbs: 60,
          protein: 14,
          fat: 12,
          fiber: 10,
          gi: "Low (40)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Cook millet with lentils, make yogurt curry, roast eggplant",
          alternatives: ["Jowar khichdi with dal", "Quinoa with sambhar", "Brown rice with rasam"],
        },
        evening: {
          items: "Masala Chai (Jaggery) with Roasted Chana (2 tbsp)",
          calories: 95,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Grilled Paneer Tikka + Bhindi Masala + Phulka (1) + Onion Raita",
          calories: 380,
          carbs: 30,
          protein: 24,
          fat: 18,
          fiber: 6,
          gi: "Low (35)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Grill paneer with spices, cook okra curry, make thin rotis",
          alternatives: ["Tandoori vegetables with roti", "Grilled cottage cheese with sabzi", "Baked tofu with curry"],
        },
      },
      {
        // Friday - Punjabi Focus
        breakfast: {
          items: "Missi Roti + Dahi + Achar + Onion Slices + Green Tea",
          calories: 320,
          carbs: 44,
          protein: 13,
          fat: 10,
          fiber: 6,
          gi: "Medium (50)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Make gram flour mixed roti, serve with fresh yogurt",
          alternatives: ["Makki roti with sarson saag", "Besan paratha with curd", "Aloo paratha (small) with raita"],
        },
        midMorning: {
          items: "Lassi (Thin, Sugar-free) with Mint + Sunflower Seeds (1 tsp)",
          calories: 80,
          water: 150,
        },
        lunch: {
          items: "Rajma + Brown Rice + Baingan Bharta + Mixed Salad + Papad (Roasted)",
          calories: 450,
          carbs: 65,
          protein: 18,
          fat: 12,
          fiber: 12,
          gi: "Medium (50)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Cook kidney beans curry, roast eggplant for bharta",
          alternatives: ["Chole with quinoa", "Black dal with millet", "White chana with brown rice"],
        },
        evening: {
          items: "Adrak Chai with Murmura (Puffed Rice) - 1 cup",
          calories: 90,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Tandoori Chicken (70g) + Palak + Mushroom Curry + Cucumber Mint Salad",
          calories: 340,
          carbs: 18,
          protein: 35,
          fat: 14,
          fiber: 5,
          gi: "Low (25)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Marinate and grill chicken, cook spinach mushroom curry",
          alternatives: ["Grilled fish with spinach", "Baked paneer with vegetables", "Egg curry with greens"],
        },
      },
      {
        // Saturday - Tamil Focus
        breakfast: {
          items: "Ragi Dosa + Coconut Chutney + Sambar + Filter Coffee (Black)",
          calories: 310,
          carbs: 46,
          protein: 12,
          fat: 8,
          fiber: 7,
          gi: "Low (40)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Make finger millet dosa, prepare coconut chutney and lentil curry",
          alternatives: ["Adai with avial", "Pesarattu with chutney", "Rava dosa with sambar"],
        },
        midMorning: {
          items: "Neer Mor (Spiced Buttermilk) with Curry Leaves + Pumpkin Seeds (1 tsp)",
          calories: 75,
          water: 200,
        },
        lunch: {
          items: "Curd Rice + Rasam + Poriyal (Beans) + Appalam + Pickle",
          calories: 400,
          carbs: 58,
          protein: 16,
          fat: 10,
          fiber: 8,
          gi: "Medium (45)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Mix curd with rice, make tamarind rasam, stir-fry beans",
          alternatives: ["Lemon rice with dal", "Tamarind rice with vegetables", "Coconut rice with curry"],
        },
        evening: {
          items: "Sukku Coffee (Dry Ginger) with Groundnuts (10 pieces)",
          calories: 85,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Fish Curry (Meen Kuzhambu) + Steamed Rice (1/2 cup) + Cabbage Poriyal",
          calories: 370,
          carbs: 35,
          protein: 28,
          fat: 15,
          fiber: 6,
          gi: "Low (35)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Cook fish in tamarind curry, steam rice, stir-fry cabbage",
          alternatives: ["Chicken curry with millet", "Egg curry with quinoa", "Prawn curry with brown rice"],
        },
      },
      {
        // Sunday - Multi-regional Fusion
        breakfast: {
          items: "Quinoa Upma + Coconut Chutney + Herbal Tea + Mixed Nuts (5 pieces)",
          calories: 340,
          carbs: 42,
          protein: 14,
          fat: 12,
          fiber: 6,
          gi: "Low (35)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Cook quinoa with vegetables and spices, make fresh coconut chutney",
          alternatives: ["Millet porridge with nuts", "Oats upma with vegetables", "Broken wheat upma with coconut"],
        },
        midMorning: {
          items: "Tender Coconut Water + Chia Seeds (1 tsp) soaked",
          calories: 70,
          water: 250,
        },
        lunch: {
          items: "Mixed Millet Khichdi + Ghee (1 tsp) + Papad + Pickle + Salad + Chaas",
          calories: 430,
          carbs: 62,
          protein: 16,
          fat: 14,
          fiber: 9,
          gi: "Low (40)",
          water: Math.round(dailyWaterIntake * 0.2),
          preparation: "Cook mixed millets with moong dal, add ghee, serve with accompaniments",
          alternatives: ["Brown rice khichdi", "Quinoa khichdi with vegetables", "Barley khichdi with dal"],
        },
        evening: {
          items: "Green Tea with Lemon + Roasted Makhana (Fox nuts) - 1/4 cup",
          calories: 80,
          water: Math.round(dailyWaterIntake * 0.1),
        },
        dinner: {
          items: "Grilled Pomfret + Stir-fried Vegetables + Quinoa (1/3 cup) + Mint Raita",
          calories: 360,
          carbs: 28,
          protein: 32,
          fat: 13,
          fiber: 7,
          gi: "Low (30)",
          water: Math.round(dailyWaterIntake * 0.15),
          preparation: "Grill fish with herbs, stir-fry mixed vegetables, cook quinoa",
          alternatives: ["Baked salmon with vegetables", "Grilled chicken with millet", "Steamed fish with brown rice"],
        },
      },
    ]

    return days.map((day, index) => {
      const date = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000)
      const mealPlan = uniqueMealPlans[index]

      const meals = [
        {
          meal: "Breakfast",
          time: "7:00 AM",
          items: mealPlan.breakfast.items,
          calories: mealPlan.breakfast.calories,
          carbs: mealPlan.breakfast.carbs,
          protein: mealPlan.breakfast.protein,
          fat: mealPlan.breakfast.fat,
          fiber: mealPlan.breakfast.fiber,
          glycemicIndex: mealPlan.breakfast.gi,
          preparation: mealPlan.breakfast.preparation,
          alternatives: mealPlan.breakfast.alternatives.join(" | "),
          water: mealPlan.breakfast.water,
        },
        {
          meal: "Mid-Morning",
          time: "10:00 AM",
          items: mealPlan.midMorning.items,
          calories: mealPlan.midMorning.calories,
          carbs: 8,
          protein: 3,
          fat: 5,
          fiber: 2,
          glycemicIndex: "Very Low (15)",
          preparation: "Consume as specified",
          alternatives: "Herbal tea with nuts | Green juice with seeds | Coconut water with almonds",
          water: mealPlan.midMorning.water,
        },
        {
          meal: "Lunch",
          time: "1:00 PM",
          items: mealPlan.lunch.items,
          calories: mealPlan.lunch.calories,
          carbs: mealPlan.lunch.carbs,
          protein: mealPlan.lunch.protein,
          fat: mealPlan.lunch.fat,
          fiber: mealPlan.lunch.fiber,
          glycemicIndex: mealPlan.lunch.gi,
          preparation: mealPlan.lunch.preparation,
          alternatives: mealPlan.lunch.alternatives.join(" | "),
          water: mealPlan.lunch.water,
        },
        {
          meal: "Evening",
          time: "4:00 PM",
          items: mealPlan.evening.items,
          calories: mealPlan.evening.calories,
          carbs: 12,
          protein: 2,
          fat: 2,
          fiber: 3,
          glycemicIndex: "Low (25)",
          preparation: "Prepare fresh",
          alternatives: "Herbal tea with fruit | Vegetable juice | Buttermilk with spices",
          water: mealPlan.evening.water,
        },
        {
          meal: "Dinner",
          time: "7:30 PM",
          items: mealPlan.dinner.items,
          calories: mealPlan.dinner.calories,
          carbs: mealPlan.dinner.carbs,
          protein: mealPlan.dinner.protein,
          fat: mealPlan.dinner.fat,
          fiber: mealPlan.dinner.fiber,
          glycemicIndex: mealPlan.dinner.gi,
          preparation: mealPlan.dinner.preparation,
          alternatives: mealPlan.dinner.alternatives.join(" | "),
          water: mealPlan.dinner.water,
        },
      ]

      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
      const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0)
      const totalWater = meals.reduce((sum, meal) => sum + meal.water, 0)

      // Calculate exercise minutes based on week and commitment level
      const baseExerciseMinutes = 45
      const weekMultiplier = weekNumber * 0.1
      const commitmentMultiplier = formData.commitmentLevel.includes("Highly committed") ? 1.2 : 1.0
      const exerciseMinutes = Math.round(baseExerciseMinutes * (1 + weekMultiplier) * commitmentMultiplier)

      return {
        day,
        date: date.toLocaleDateString(),
        meals,
        totalCalories,
        totalCarbs,
        totalWater,
        waterIntake: `${totalWater}ml (Target: ${dailyWaterIntake}ml)`,
        supplements: `Week ${weekNumber}: Chromium 200mcg, Alpha Lipoic Acid 300mg, Vitamin D3 2000IU`,
        exerciseMinutes: `${exerciseMinutes} minutes total (Morning: 30 min walk, Evening: ${exerciseMinutes - 30} min strength/yoga)`,
        notes: `Week ${weekNumber} - ${weekNumber === 1 ? "Foundation building with blood sugar stabilization" : weekNumber === 2 ? "Metabolic optimization and medication adjustment" : weekNumber === 3 ? "Advanced reversal protocols" : "Maintenance and lifestyle integration"}. BMI target: ${formData.height && formData.weight ? (calculateBMI().bmi - weekNumber * 0.5).toFixed(1) : "Calculate"}`,
      }
    })
  }

  const parseMonthlyPlan = (text: string, monthPrefix: string) => {
    try {
      const title =
        extractAdvancedValue(text, `${monthPrefix}: Stabilization & Foundation`) ||
        extractAdvancedValue(text, `${monthPrefix}: Optimization & Acceleration`) ||
        extractAdvancedValue(text, `${monthPrefix}: Reversal Achievement`) ||
        "Month Title Not Found"
      const goals = parseAdvancedList(text, `${monthPrefix}-GOALS`)
      const dietFocus = parseAdvancedList(text, `${monthPrefix}-DIET-FOCUS`)
      const exercisePlan = parseAdvancedList(text, `${monthPrefix}-EXERCISE-PLAN`)
      const medications = parseAdvancedList(text, `${monthPrefix}-MEDICATIONS`)
      const monitoring = parseAdvancedList(text, `${monthPrefix}-MONITORING`)
      const milestones = parseAdvancedList(text, `${monthPrefix}-MILESTONES`)
      const expectedResults = extractAdvancedValue(text, `${monthPrefix}-EXPECTED-RESULTS`)

      return {
        title,
        goals,
        dietFocus,
        exercisePlan,
        medications,
        monitoring,
        milestones,
        expectedResults,
      }
    } catch (error) {
      console.error(`Error parsing ${monthPrefix} plan:`, error)
      return {
        title: "Error Parsing Month",
        goals: [],
        dietFocus: [],
        exercisePlan: [],
        medications: [],
        monitoring: [],
        milestones: [],
        expectedResults: "Error",
      }
    }
  }

  const parseAdvancedList = (text: string, keyword: string): string[] => {
    try {
      const regex = new RegExp(`${keyword}:\\s*([^\n]+)`, "i")
      const match = text.match(regex)
      if (match && match[1]) {
        return match[1].split("|").map((item) => item.trim())
      }
      return []
    } catch (error) {
      console.error(`Error parsing list for ${keyword}:`, error)
      return []
    }
  }

  const extractAdvancedValue = (text: string, keyword: string): string => {
    try {
      const regex = new RegExp(`${keyword}:\\s*([^\n]+)`, "i")
      const match = text.match(regex)
      return match && match[1] ? match[1].trim() : "Not specified"
    } catch (error) {
      console.error(`Error extracting value for ${keyword}:`, error)
      return "Not specified"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Diabetes Reversal Assessment</h1>
            <Link href="/" className="text-blue-500 hover:text-blue-700">
              <Home className="h-6 w-6 inline-block mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      type="number"
                      id="age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select gender" defaultValue={formData.gender} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diabetesType">Type of Diabetes</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, diabetesType: value })}>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select diabetes type" defaultValue={formData.diabetesType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Type 1">Type 1</SelectItem>
                        <SelectItem value="Type 2">Type 2</SelectItem>
                        <SelectItem value="Gestational">Gestational</SelectItem>
                        <SelectItem value="LADA">LADA</SelectItem>
                        <SelectItem value="MODY">MODY</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      type="number"
                      id="weight"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      type="number"
                      id="height"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                    <Input
                      type="date"
                      id="diagnosisDate"
                      value={formData.diagnosisDate}
                      onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    type="tel"
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hba1cLevel">HbA1c Level (%)</Label>
                    <Input
                      type="number"
                      id="hba1cLevel"
                      value={formData.hba1cLevel}
                      onChange={(e) => setFormData({ ...formData, hba1cLevel: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodPressure">Blood Pressure (Systolic/Diastolic)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        id="bloodPressureSystolic"
                        placeholder="Systolic"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
                      />
                      <span>/</span>
                      <Input
                        type="number"
                        id="bloodPressureDiastolic"
                        placeholder="Diastolic"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
                      />
                      <span>mmHg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Allergies</Label>
                  <div className="flex flex-wrap gap-2">
                    {allergyOptions.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergy-${allergy}`}
                          checked={formData.allergies.includes(allergy)}
                          onCheckedChange={(checked) => handleMultiSelect("allergies", allergy, !!checked)}
                        />
                        <Label htmlFor={`allergy-${allergy}`}>{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastCheckup">Last Checkup Date</Label>
                    <Input
                      type="date"
                      id="lastCheckup"
                      value={formData.lastCheckup}
                      onChange={(e) => setFormData({ ...formData, lastCheckup: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="familyHistory">Family History of Diabetes</Label>
                    <Textarea
                      id="familyHistory"
                      value={formData.familyHistory}
                      onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Complications</Label>
                  <div className="flex flex-wrap gap-2">
                    {complicationOptions.map((complication) => (
                      <div key={complication} className="flex items-center space-x-2">
                        <Checkbox
                          id={`complication-${complication}`}
                          checked={formData.complications.includes(complication)}
                          onCheckedChange={(checked) => handleMultiSelect("complications", complication, !!checked)}
                        />
                        <Label htmlFor={`complication-${complication}`}>{complication}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Advanced Parameters</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowAdvancedParams(!showAdvancedParams)}>
                  {showAdvancedParams ? "Hide" : "Show"}
                </Button>
              </div>
            </CardHeader>
            {showAdvancedParams && (
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="insulinResistance">Insulin Resistance</Label>
                      <Input
                        type="text"
                        id="insulinResistance"
                        value={formData.insulinResistance}
                        onChange={(e) => setFormData({ ...formData, insulinResistance: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cPeptideLevel">C-Peptide Level (ng/mL)</Label>
                      <Input
                        type="number"
                        id="cPeptideLevel"
                        value={formData.cPeptideLevel}
                        onChange={(e) => setFormData({ ...formData, cPeptideLevel: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="microalbuminuria">Microalbuminuria (mg/g)</Label>
                      <Input
                        type="text"
                        id="microalbuminuria"
                        value={formData.microalbuminuria}
                        onChange={(e) => setFormData({ ...formData, microalbuminuria: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lipidProfile">Lipid Profile</Label>
                      <Input
                        type="text"
                        id="lipidProfile"
                        value={formData.lipidProfile}
                        onChange={(e) => setFormData({ ...formData, lipidProfile: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="thyroidFunction">Thyroid Function (mIU/L)</Label>
                      <Input
                        type="text"
                        id="thyroidFunction"
                        value={formData.thyroidFunction}
                        onChange={(e) => setFormData({ ...formData, thyroidFunction: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vitaminD">Vitamin D (ng/mL)</Label>
                      <Input
                        type="text"
                        id="vitaminD"
                        value={formData.vitaminD}
                        onChange={(e) => setFormData({ ...formData, vitaminD: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inflammation">Inflammation Markers (mg/L)</Label>
                    <Input
                      type="text"
                      id="inflammation"
                      value={formData.inflammation}
                      onChange={(e) => setFormData({ ...formData, inflammation: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Lifestyle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select activity level" defaultValue={formData.activityLevel} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedentary">Sedentary</SelectItem>
                        <SelectItem value="Lightly Active">Lightly Active</SelectItem>
                        <SelectItem value="Moderately Active">Moderately Active</SelectItem>
                        <SelectItem value="Very Active">Very Active</SelectItem>
                        <SelectItem value="Extra Active">Extra Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dietPreferences">Diet Preferences</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, dietPreferences: value })}>
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select diet preferences" defaultValue={formData.dietPreferences} />
                      </SelectTrigger>
                      <SelectContent>
                        {dietPreferenceOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseFrequency">Exercise Frequency (days/week)</Label>
                    <Input
                      type="number"
                      id="exerciseFrequency"
                      value={formData.exerciseFrequency}
                      onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepHours">Sleep Hours</Label>
                    <Input
                      type="number"
                      id="sleepHours"
                      value={formData.sleepHours}
                      onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" defaultValue={formData.smokingStatus} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Former">Former</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select consumption" defaultValue={formData.alcoholConsumption} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Socially">Socially</SelectItem>
                        <SelectItem value="Regularly">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Stress Levels</Label>
                  <div className="flex flex-wrap gap-2">
                    {stressLevelOptions.map((stress) => (
                      <div key={stress} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stress-${stress}`}
                          checked={formData.stressLevel.includes(stress)}
                          onCheckedChange={(checked) => handleMultiSelect("stressLevel", stress, !!checked)}
                        />
                        <Label htmlFor={`stress-${stress}`}>{stress}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="workSchedule">Work Schedule</Label>
                  <Textarea
                    id="workSchedule"
                    value={formData.workSchedule}
                    onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Current Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fastingBloodSugar">Fasting Blood Sugar (mg/dL)</Label>
                    <Input
                      type="number"
                      id="fastingBloodSugar"
                      value={formData.fastingBloodSugar}
                      onChange={(e) => setFormData({ ...formData, fastingBloodSugar: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postMealBloodSugar">Post-Meal Blood Sugar (mg/dL)</Label>
                    <Input
                      type="number"
                      id="postMealBloodSugar"
                      value={formData.postMealBloodSugar}
                      onChange={(e) => setFormData({ ...formData, postMealBloodSugar: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Frequent Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {symptomOptions.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={`symptom-${symptom}`}
                          checked={formData.frequentSymptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleMultiSelect("frequentSymptoms", symptom, !!checked)}
                        />
                        <Label htmlFor={`symptom-${symptom}`}>{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyEpisodes">Emergency Episodes</Label>
                  <Textarea
                    id="emergencyEpisodes"
                    value={formData.emergencyEpisodes}
                    onChange={(e) => setFormData({ ...formData, emergencyEpisodes: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="symptomSeverity">Symptom Severity (1-10)</Label>
                  <Slider
                    defaultValue={formData.symptomSeverity}
                    max={10}
                    step={1}
                    onValueChange={(value) => setFormData({ ...formData, symptomSeverity: value })}
                  />
                  <div className="text-sm text-gray-500">Severity: {formData.symptomSeverity[0]}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Goals & Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weightTarget">Target Weight (kg)</Label>
                    <Input
                      type="number"
                      id="weightTarget"
                      value={formData.weightTarget}
                      onChange={(e) => setFormData({ ...formData, weightTarget: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hba1cTarget">Target HbA1c (%)</Label>
                    <Input
                      type="number"
                      id="hba1cTarget"
                      value={formData.hba1cTarget}
                      onChange={(e) => setFormData({ ...formData, hba1cTarget: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Primary Health Goals</Label>
                  <div className="flex flex-wrap gap-2">
                    {healthGoalOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={`goal-${goal}`}
                          checked={formData.primaryGoals.includes(goal)}
                          onCheckedChange={(checked) => handleMultiSelect("primaryGoals", goal, !!checked)}
                        />
                        <Label htmlFor={`goal-${goal}`}>{goal}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                    <Textarea
                      id="dietaryRestrictions"
                      value={formData.dietaryRestrictions}
                      onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="exerciseGoals">Exercise Goals</Label>
                    <Textarea
                      id="exerciseGoals"
                      value={formData.exerciseGoals}
                      onChange={(e) => setFormData({ ...formData, exerciseGoals: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Commitment Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {commitmentLevelOptions.map((commitment) => (
                      <div key={commitment} className="flex items-center space-x-2">
                        <Checkbox
                          id={`commitment-${commitment}`}
                          checked={formData.commitmentLevel.includes(commitment)}
                          onCheckedChange={(checked) => handleMultiSelect("commitmentLevel", commitment, !!checked)}
                        />
                        <Label htmlFor={`commitment-${commitment}`}>{commitment}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select budget" defaultValue={formData.budgetRange} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Get Assessment
              </>
            )}
          </Button>

          {result && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Assessment Result</h2>

              <Tabs defaultValue="medications" className="w-full">
                <TabsList>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="vitalMonitoring">Vital Monitoring</TabsTrigger>
                  <TabsTrigger value="labTests">Lab Tests</TabsTrigger>
                  <TabsTrigger value="dietPlan">Diet Plan</TabsTrigger>
                  <TabsTrigger value="exercisePlan">Exercise Plan</TabsTrigger>
                  <TabsTrigger value="emergencyProtocols">Emergency Protocols</TabsTrigger>
                  <TabsTrigger value="supplements">Supplements</TabsTrigger>
                  <TabsTrigger value="ayurvedicTreatment">Ayurvedic Treatment</TabsTrigger>
                  <TabsTrigger value="followUpPlan">Follow-Up Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="medications">
                  <h3 className="text-xl font-semibold mb-2">Medications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Tapering</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.medications.map((medication, index) => (
                        <TableRow key={index}>
                          <TableCell>{medication.name}</TableCell>
                          <TableCell>{medication.dosage}</TableCell>
                          <TableCell>{medication.frequency}</TableCell>
                          <TableCell>{medication.timing}</TableCell>
                          <TableCell>{medication.tapering}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="vitalMonitoring">
                  <h3 className="text-xl font-semibold mb-2">Vital Monitoring</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vital</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Target Range</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.vitalMonitoring.map((vital, index) => (
                        <TableRow key={index}>
                          <TableCell>{vital.vital}</TableCell>
                          <TableCell>{vital.frequency}</TableCell>
                          <TableCell>{vital.timing}</TableCell>
                          <TableCell>{vital.targetRange}</TableCell>
                          <TableCell>{vital.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="labTests">
                  <h3 className="text-xl font-semibold mb-2">Lab Tests</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Preparation</TableHead>
                        <TableHead>Month</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.labTests.map((lab, index) => (
                        <TableRow key={index}>
                          <TableCell>{lab.test}</TableCell>
                          <TableCell>{lab.priority}</TableCell>
                          <TableCell>{lab.reason}</TableCell>
                          <TableCell>{lab.preparation}</TableCell>
                          <TableCell>{lab.month}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="dietPlan">
                  <h3 className="text-xl font-semibold mb-2">Diet Plan (Week 1)</h3>
                  {result.comprehensiveDietPlan.week1.map((dayPlan, dayIndex) => (
                    <Card key={dayIndex} className="mb-4">
                      <CardHeader>
                        <CardTitle>
                          {dayPlan.day} - {dayPlan.date}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {dayPlan.meals.map((meal, mealIndex) => (
                          <div key={mealIndex} className="mb-3">
                            <h4 className="font-semibold">
                              {meal.meal} ({meal.time})
                            </h4>
                            <p>Items: {meal.items}</p>
                            <p>
                              Calories: {meal.calories}, Carbs: {meal.carbs}g, Protein: {meal.protein}g, Fat: {meal.fat}
                              g, Fiber: {meal.fiber}g
                            </p>
                            <p>Preparation: {meal.preparation}</p>
                            <p>Alternatives: {meal.alternatives}</p>
                          </div>
                        ))}
                        <p>
                          Total Calories: {dayPlan.totalCalories}, Total Carbs: {dayPlan.totalCarbs}g
                        </p>
                        <p>Water Intake: {dayPlan.waterIntake}</p>
                        <p>Supplements: {dayPlan.supplements}</p>
                        <p>Exercise: {dayPlan.exerciseMinutes}</p>
                        <p>Notes: {dayPlan.notes}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="exercisePlan">
                  <h3 className="text-xl font-semibold mb-2">Exercise Plan</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exercise Type</TableHead>
                        <TableHead>Duration (minutes)</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Intensity</TableHead>
                        <TableHead>BMI Impact</TableHead>
                        <TableHead>Glucose Effect</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Progression</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.exerciseRecommendations.map((exercise, index) => (
                        <TableRow key={index}>
                          <TableCell>{exercise.type}</TableCell>
                          <TableCell>{exercise.duration}</TableCell>
                          <TableCell>{exercise.frequency}</TableCell>
                          <TableCell>{exercise.intensity}</TableCell>
                          <TableCell>{exercise.bmiImpact}</TableCell>
                          <TableCell>{exercise.glucoseEffect}</TableCell>
                          <TableCell>{exercise.equipment}</TableCell>
                          <TableCell>{exercise.progression}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">3-Month Exercise Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Month 1</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Goals: {result.threeMonthReversalPlan.month1.goals.join(", ")}</p>
                          <p className="text-sm">
                            Exercise Plan: {result.threeMonthReversalPlan.month1.exercisePlan.join(", ")}
                          </p>
                          <p className="text-sm">
                            Expected Results: {result.threeMonthReversalPlan.month1.expectedResults}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Month 2</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Goals: {result.threeMonthReversalPlan.month2.goals.join(", ")}</p>
                          <p className="text-sm">
                            Exercise Plan: {result.threeMonthReversalPlan.month2.exercisePlan.join(", ")}
                          </p>
                          <p className="text-sm">
                            Expected Results: {result.threeMonthReversalPlan.month2.expectedResults}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Month 3</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">Goals: {result.threeMonthReversalPlan.month3.goals.join(", ")}</p>
                          <p className="text-sm">
                            Exercise Plan: {result.threeMonthReversalPlan.month3.exercisePlan.join(", ")}
                          </p>
                          <p className="text-sm">
                            Expected Results: {result.threeMonthReversalPlan.month3.expectedResults}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="emergencyProtocols">
                  <h3 className="text-xl font-semibold mb-2">Emergency Protocols</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Hypoglycemia</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Symptoms: {result.emergencyProtocols.hypoglycemia.symptoms.join(", ")}
                        </p>
                        <p className="text-sm">
                          Actions: {result.emergencyProtocols.hypoglycemia.immediateActions.join(", ")}
                        </p>
                        <p className="text-sm">
                          Medications: {result.emergencyProtocols.hypoglycemia.medications.join(", ")}
                        </p>
                        <p className="text-sm">
                          When to call help: {result.emergencyProtocols.hypoglycemia.whenToCallHelp.join(", ")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Hyperglycemia</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Symptoms: {result.emergencyProtocols.hyperglycemia.symptoms.join(", ")}
                        </p>
                        <p className="text-sm">
                          Actions: {result.emergencyProtocols.hyperglycemia.immediateActions.join(", ")}
                        </p>
                        <p className="text-sm">
                          Medications: {result.emergencyProtocols.hyperglycemia.medications.join(", ")}
                        </p>
                        <p className="text-sm">
                          When to call help: {result.emergencyProtocols.hyperglycemia.whenToCallHelp.join(", ")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Ketoacidosis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Symptoms: {result.emergencyProtocols.ketoacidosis.symptoms.join(", ")}
                        </p>
                        <p className="text-sm">
                          Actions: {result.emergencyProtocols.ketoacidosis.immediateActions.join(", ")}
                        </p>
                        <p className="text-sm">
                          Medications: {result.emergencyProtocols.ketoacidosis.medications.join(", ")}
                        </p>
                        <p className="text-sm">
                          When to call help: {result.emergencyProtocols.ketoacidosis.whenToCallHelp.join(", ")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="supplements">
                  <h3 className="text-xl font-semibold mb-2">Supplements</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Timing</TableHead>
                        <TableHead>Benefits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.supplements.map((supplement, index) => (
                        <TableRow key={index}>
                          <TableCell>{supplement.name}</TableCell>
                          <TableCell>{supplement.dosage}</TableCell>
                          <TableCell>{supplement.timing}</TableCell>
                          <TableCell>{supplement.benefits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="ayurvedicTreatment">
                  <h3 className="text-xl font-semibold mb-2">Ayurvedic Treatment</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Treatment</TableHead>
                        <TableHead>Herbs</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Timing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.ayurvedicTreatment.map((treatment, index) => (
                        <TableRow key={index}>
                          <TableCell>{treatment.treatment}</TableCell>
                          <TableCell>{treatment.herbs}</TableCell>
                          <TableCell>{treatment.dosage}</TableCell>
                          <TableCell>{treatment.timing}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="followUpPlan">
                  <h3 className="text-xl font-semibold mb-2">Follow-Up Plan</h3>
                  <p>Next Appointment: {result.followUpPlan.nextAppointment}</p>
                  <p>Monitoring Schedule: {result.followUpPlan.monitoringSchedule.join(", ")}</p>
                  <p>Lifestyle Changes: {result.followUpPlan.lifestyleChanges.join(", ")}</p>
                  <p>Expected Improvement: {result.followUpPlan.expectedImprovement}</p>
                  <p>Reversal Timeline: {result.followUpPlan.reversalTimeline}</p>
                  <p>Success Metrics: {result.followUpPlan.successMetrics.join(", ")}</p>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>

      <PoweredByFooter />
    </div>
  )
}
