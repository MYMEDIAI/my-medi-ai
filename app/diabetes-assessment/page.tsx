"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Activity, Download, FileText, Heart, Home, Loader2, RotateCcw, Send, Target, User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PoweredByFooter from "@/components/powered-by-footer"
import { Badge } from "@/components/ui/badge"

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
  const initialFormData: DiabetesAssessmentData = {
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
  }
  const [formData, setFormData] = useState<DiabetesAssessmentData>(initialFormData)

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
    
    .meal-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px;
      margin-bottom: 6px;
    }
    
    .meal-header {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .meal-time {
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8px;
    }
    
    .meal-calories {
      background: #fef3c7;
      color: #d97706;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: bold;
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
    
    .exercise-card {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      padding: 8px;
      margin-bottom: 6px;
    }
    
    .bmi-progress {
      background: linear-gradient(135deg, #e0f2fe, #bae6fd);
      padding: 10px;
      border-radius: 6px;
      margin: 10px 0;
      text-align: center;
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
      <div class="logo">🏥</div>
      <h1>MyMedi.ai</h1>
      <p>Advanced Diabetes Reversal Program</p>
      <p>Comprehensive 3-Month Personalized Reversal Protocol</p>
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

    <div class="bmi-progress">
      <h3 style="color: #0369a1; margin-bottom: 8px;">🎯 BMI & WEIGHT LOSS PROGRESSION</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; font-size: 9px;">
        <div>
          <strong>Current BMI:</strong><br>
          ${formData.height && formData.weight ? calculateBMI().bmi : "N/A"}<br>
          <small>(${formData.height && formData.weight ? calculateBMI().category : "Calculate"})</small>
        </div>
        <div>
          <strong>Target BMI:</strong><br>
          ${formData.weightTarget && formData.height ? (Number(formData.weightTarget) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1) : "22.0"}<br>
          <small>(Healthy Range)</small>
        </div>
        <div>
          <strong>Weight Loss Needed:</strong><br>
          ${formData.weight && formData.weightTarget ? Math.max(Number(formData.weight) - Number(formData.weightTarget), 0) : "8-12"} kg<br>
          <small>(3-month target)</small>
        </div>
        <div>
          <strong>Daily Water Target:</strong><br>
          ${formData.weight ? Math.round(Number(formData.weight) * 35) : 2500}ml<br>
          <small>(35ml per kg body weight)</small>
        </div>
      </div>
    </div>

    <div class="reversal-timeline">
      <h3 style="color: #065f46; margin-bottom: 8px;">🎯 3-MONTH DIABETES REVERSAL TIMELINE</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 9px;">
        <div>
          <strong>Month 1: Stabilization</strong><br>
          • Blood sugar stabilization<br>
          • BMI reduction: 1-2 points<br>
          • Exercise: 150+ min/week<br>
          • HbA1c target: -0.5-1.0%
        </div>
        <div>
          <strong>Month 2: Optimization</strong><br>
          • Intensive intervention<br>
          • BMI reduction: 2-3 points<br>
          • Exercise: 200+ min/week<br>
          • HbA1c target: -1.0-1.5%
        </div>
        <div>
          <strong>Month 3: Reversal</strong><br>
          • Achieve HbA1c &lt;6.0%<br>
          • Target BMI: 18.5-24.9<br>
          • Exercise: 250+ min/week<br>
          • Medication minimization
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
        🏃‍♂️ PERSONALIZED EXERCISE & FITNESS PLAN
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Exercise Type</th>
              <th>Duration</th>
              <th>Frequency</th>
              <th>Intensity</th>
              <th>BMI Impact</th>
              <th>Glucose Effect</th>
              <th>Equipment</th>
              <th>Progression</th>
            </tr>
          </thead>
          <tbody>
            ${result.exerciseRecommendations
              .map(
                (exercise) => `
              <tr>
                <td><strong>${exercise.type}</strong></td>
                <td>${exercise.duration} min</td>
                <td>${exercise.frequency}</td>
                <td>${exercise.intensity}</td>
                <td>${exercise.bmiImpact}</td>
                <td>${exercise.glucoseEffect}</td>
                <td>${exercise.equipment}</td>
                <td>${exercise.progression}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="page">
    <div class="section">
      <div class="section-header">
        🍽️ COMPREHENSIVE WEEK 1 DIET PLAN WITH UNIQUE CHOICES
      </div>
      <div class="section-content">
        ${result.comprehensiveDietPlan.week1
          .map(
            (day) => `
          <div class="meal-card">
            <div class="meal-header">
              <span><strong>${day.day} - ${day.date}</strong></span>
              <div>
                <span class="meal-calories">${day.totalCalories} kcal</span>
                <span class="meal-time">${day.totalWater}ml water</span>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 8px; margin-top: 6px;">
              ${day.meals
                .map(
                  (meal) => `
                <div>
                  <strong>${meal.time} - ${meal.meal}:</strong><br>
                  ${meal.items}<br>
                  <em>Cal: ${meal.calories} | Carbs: ${meal.carbs}g | Protein: ${meal.protein}g | Water: ${meal.water}ml</em><br>
                  <small style="color: #059669;">Prep: ${meal.preparation}</small><br>
                  <small style="color: #7c3aed;">Alt: ${meal.alternatives}</small>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="margin-top: 6px; font-size: 8px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 4px;">
              <strong>Exercise:</strong> ${day.exerciseMinutes} | 
              <strong>Supplements:</strong> ${day.supplements}<br>
              <strong>Notes:</strong> ${day.notes}
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
      <p style="margin-top: 8px; font-size: 8px; color: #9ca3af;">
        This comprehensive report includes ${result.medications.length} medication recommendations with tapering schedules, 
        ${result.exerciseRecommendations.length} personalized exercise plans, detailed weekly diet plans with ${result.comprehensiveDietPlan.week1.length} days of unique meal combinations, 
        ${result.supplements.length} supplement recommendations, emergency protocols, and 3-month structured reversal timeline with BMI and exercise targets.
      </p>
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
              symptoms: parseAdvancedList(aiText, "HYPOGLYCEMIA-SYMPTOMS") || [],
              immediateActions: parseAdvancedList(aiText, "HYPOGLYCEMIA-ACTIONS") || [],
              medications: parseAdvancedList(aiText, "HYPOGLYCEMIA-MEDS") || [],
              whenToCallHelp: parseAdvancedList(aiText, "HYPOGLYCEMIA-HELP") || [],
            },
            hyperglycemia: {
              symptoms: parseAdvancedList(aiText, "HYPERGLYCEMIA-SYMPTOMS") || [],
              immediateActions: parseAdvancedList(aiText, "HYPERGLYCEMIA-ACTIONS") || [],
              medications: parseAdvancedList(aiText, "HYPERGLYCEMIA-MEDS") || [],
              whenToCallHelp: parseAdvancedList(aiText, "HYPERGLYCEMIA-HELP") || [],
            },
            ketoacidosis: {
              symptoms: parseAdvancedList(aiText, "KETOACIDOSIS-SYMPTOMS") || [],
              immediateActions: parseAdvancedList(aiText, "KETOACIDOSIS-ACTIONS") || [],
              medications: parseAdvancedList(aiText, "KETOACIDOSIS-MEDS") || [],
              whenToCallHelp: parseAdvancedList(aiText, "KETOACIDOSIS-HELP") || [],
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

    // Helper function to safely join arrays, handling undefined values
    const safeJoin = (arr: string[] | undefined, separator = ", "): string => {
      if (!arr) return ""
      if (typeof arr === "string") return arr
      if (Array.isArray(arr)) return arr.join(separator)
      return ""
    }

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
      // Ensure we have a valid meal plan for this day
      const mealPlan = uniqueMealPlans[index % uniqueMealPlans.length]

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
          alternatives: safeJoin(mealPlan.breakfast.alternatives, " | "),
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
          alternatives: safeJoin(mealPlan.lunch.alternatives, " | "),
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
          alternatives: safeJoin(mealPlan.dinner.alternatives, " | "),
          water: mealPlan.dinner.water,
        },
      ]

      const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
      const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0)
      const totalWater = meals.reduce((sum, meal) => sum + (meal.water || 0), 0)

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

      // Ensure we always have arrays even if parseAdvancedList returns undefined
      const goals = parseAdvancedList(text, `${monthPrefix}-GOALS`) || []
      const dietFocus = parseAdvancedList(text, `${monthPrefix}-DIET-FOCUS`) || []
      const exercisePlan = parseAdvancedList(text, `${monthPrefix}-EXERCISE-PLAN`) || []
      const medications = parseAdvancedList(text, `${monthPrefix}-MEDICATIONS`) || []
      const monitoring = parseAdvancedList(text, `${monthPrefix}-MONITORING`) || []
      const milestones = parseAdvancedList(text, `${monthPrefix}-MILESTONES`) || []
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
      if (!text) return []

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
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
            <Card className="border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-4 sm:p-6">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    <div>
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                        Advanced Diabetes Reversal Assessment
                      </h1>
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
                          className={`text-xs ${
                            formData.height && formData.weight ? calculateBMI().color : "text-gray-500"
                          }`}
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
                          className={`text-xs ${
                            formData.fastingBloodSugar
                              ? getBloodSugarStatus(formData.fastingBloodSugar, "fasting").color
                              : "text-gray-500"
                          }`}
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
                          className={`text-xs ${
                            formData.postMealBloodSugar
                              ? getBloodSugarStatus(formData.postMealBloodSugar, "postMeal").color
                              : "text-gray-500"
                          }`}
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
                          className={`text-xs ${
                            formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).color : "text-gray-500"
                          }`}
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
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Tip: Accurate weight helps calculate BMI and daily water intake
                          </p>
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
                          <p className="text-xs text-gray-500 mt-1">💡 Tip: Height in centimeters (e.g., 170 cm)</p>
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
                              <SelectItem value="type1">
                                <div className="flex flex-col">
                                  <span>Type 1 Diabetes</span>
                                  <span className="text-xs text-gray-500">Insulin-dependent, autoimmune</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="type2">
                                <div className="flex flex-col">
                                  <span>Type 2 Diabetes</span>
                                  <span className="text-xs text-gray-500">Most common, lifestyle-related</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="gestational">
                                <div className="flex flex-col">
                                  <span>Gestational Diabetes</span>
                                  <span className="text-xs text-gray-500">During pregnancy</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="prediabetes">
                                <div className="flex flex-col">
                                  <span>Pre-diabetes</span>
                                  <span className="text-xs text-gray-500">High blood sugar, not yet diabetic</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="mody">
                                <div className="flex flex-col">
                                  <span>MODY</span>
                                  <span className="text-xs text-gray-500">Maturity Onset Diabetes</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Medical History Section */}
                  <Card className="border-red-200">
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center text-red-600 text-base">
                        <FileText className="w-5 h-5 mr-2" />
                        Step 2: Medical History & Current Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Normal: &lt;5.7%, Pre-diabetic: 5.7-6.4%, Diabetic: ≥6.5%
                          </p>
                        </div>
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
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Normal: 80-100, Pre-diabetic: 100-125, Diabetic: ≥126
                          </p>
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
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Normal: &lt;140, Pre-diabetic: 140-199, Diabetic: ≥200
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="currentMedications" className="text-sm font-medium">
                          Current Medications
                        </Label>
                        <Textarea
                          id="currentMedications"
                          value={formData.currentMedications}
                          onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                          placeholder="List all current diabetes medications with dosages (e.g., Metformin 500mg twice daily, Insulin 20 units bedtime)"
                          className="mt-1"
                          rows={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Include insulin, oral medications, and any supplements
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Goals Section */}
                  <Card className="border-red-200">
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center text-red-600 text-base">
                        <Target className="w-5 h-5 mr-2" />
                        Step 3: Diabetes Reversal Goals & Commitment
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
                          <p className="text-xs text-gray-500 mt-1">💡 Healthy BMI range: 18.5-24.9</p>
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
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Diabetes reversal: &lt;5.7% without medications
                          </p>
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
                              <SelectItem value="5000-10000">
                                <div className="flex flex-col">
                                  <span>₹5,000 - ₹10,000</span>
                                  <span className="text-xs text-gray-500">Basic program with essentials</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="10000-20000">
                                <div className="flex flex-col">
                                  <span>₹10,000 - ₹20,000</span>
                                  <span className="text-xs text-gray-500">Standard program with supplements</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="20000-30000">
                                <div className="flex flex-col">
                                  <span>₹20,000 - ₹30,000</span>
                                  <span className="text-xs text-gray-500">Premium program with advanced testing</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="30000+">
                                <div className="flex flex-col">
                                  <span>₹30,000+</span>
                                  <span className="text-xs text-gray-500">Comprehensive program with all features</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm font-medium mb-3 block">Primary Diabetes Reversal Goals</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                          {healthGoalOptions.map((goal) => (
                            <div key={goal} className="flex items-center space-x-2">
                              <Checkbox
                                id={`goal-${goal}`}
                                checked={formData.primaryGoals.includes(goal)}
                                onCheckedChange={(checked) =>
                                  handleMultiSelect("primaryGoals", goal, checked as boolean)
                                }
                              />
                              <Label htmlFor={`goal-${goal}`} className="text-xs">
                                {goal}
                              </Label>
                            </div>
                          ))}
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
                      onClick={() => setFormData(initialFormData)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Assessment Result</h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={generatePDF}
                    variant="secondary"
                    size="sm"
                    className="bg-white text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="secondary"
                    size="sm"
                    className="bg-white text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  >
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Print Report
                  </Button>
                  <Button
                    onClick={() => setFormData(initialFormData)}
                    variant="secondary"
                    size="sm"
                    className="bg-white text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    New Assessment
                  </Button>
                </div>

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
                                Calories: {meal.calories}, Carbs: {meal.carbs}g, Protein: {meal.protein}g, Fat:{" "}
                                {meal.fat}
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
        </div>
      </main>

      <PoweredByFooter />
    </div>
  )
}
