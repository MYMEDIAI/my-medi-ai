"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      font-size: 9px;
      line-height: 1.2;
      color: #333;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 8mm;
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
      padding: 10px;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      border-radius: 6px;
    }
    
    .logo {
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: #dc2626;
    }
    
    .header h1 {
      font-size: 16px;
      margin-bottom: 4px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 10px;
      opacity: 0.9;
    }
    
    .patient-info {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      color: #7f1d1d;
      padding: 8px;
      border-radius: 4px;
      margin-bottom: 8px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      border: 1px solid #fecaca;
      font-size: 8px;
    }
    
    .patient-info h3 {
      grid-column: 1 / -1;
      font-size: 10px;
      margin-bottom: 6px;
      text-align: center;
      color: #dc2626;
    }
    
    .section {
      margin-bottom: 8px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    
    .section-header {
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      padding: 6px 8px;
      border-bottom: 1px solid #d1d5db;
      font-weight: bold;
      font-size: 9px;
      color: #374151;
    }
    
    .section-content {
      padding: 6px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7px;
      margin-bottom: 4px;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 2px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f9fafb;
      font-weight: bold;
      font-size: 7px;
    }
    
    .emergency-section {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 8px;
      border-radius: 4px;
      margin: 6px 0;
    }
    
    .critical-emergency {
      background: #fef2f2;
      border: 2px solid #dc2626;
      padding: 8px;
      border-radius: 6px;
      margin: 8px 0;
    }
    
    .emergency-protocol {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 6px;
      margin-bottom: 6px;
    }
    
    .emergency-title {
      font-weight: bold;
      color: #dc2626;
      font-size: 9px;
      margin-bottom: 3px;
    }
    
    .reversal-timeline {
      background: #ecfdf5;
      border: 1px solid #10b981;
      padding: 6px;
      border-radius: 4px;
      margin: 6px 0;
    }
    
    .meal-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 4px;
      margin-bottom: 4px;
    }
    
    .disclaimer {
      background: #fffbeb;
      border: 1px solid #fbbf24;
      padding: 6px;
      border-radius: 4px;
      margin-top: 8px;
      font-size: 7px;
      color: #92400e;
    }
    
    .footer {
      text-align: center;
      margin-top: 8px;
      padding: 6px;
      background: #f9fafb;
      border-radius: 4px;
      font-size: 7px;
      color: #6b7280;
    }
    
    .compact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      font-size: 7px;
    }
    
    .compact-grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 4px;
      font-size: 7px;
    }
    
    @media print {
      body { margin: 0; }
      .page { margin: 0; padding: 6mm; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- Page 1: Patient Profile & Overview -->
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
      <div><strong>BMI:</strong> ${formData.height && formData.weight ? `${calculateBMI().bmi} (${calculateBMI().category})` : "Calculate needed"}</div>
      <div><strong>Diabetes Type:</strong> ${formData.diabetesType}</div>
      <div><strong>Diagnosis:</strong> ${formData.diagnosisDate || "Recent"}</div>
      <div><strong>Assessment Date:</strong> ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}</div>
      <div><strong>Assessment Time:</strong> ${new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })}</div>
      <div><strong>Report ID:</strong> DRV-${Date.now().toString().slice(-8)}</div>
      <div><strong>HbA1c:</strong> ${formData.hba1cLevel || "7.5"}% (${formData.hba1cLevel ? getHbA1cStatus(formData.hba1cLevel).status : "Needs control"})</div>
    </div>

    <div class="section">
      <div class="section-header">💊 DIABETES REVERSAL MEDICATIONS & TAPERING SCHEDULE</div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Timing</th>
              <th>Category</th>
              <th>Tapering Schedule</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${result?.medications
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
      <div class="section-header">📊 COMPREHENSIVE VITAL MONITORING</div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Vital Sign</th>
              <th>Frequency</th>
              <th>Target Range</th>
              <th>Importance</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            ${result?.vitalMonitoring
              .map(
                (vital) => `
              <tr>
                <td><strong>${vital.vital}</strong></td>
                <td>${vital.frequency}</td>
                <td>${vital.targetRange}</td>
                <td>${vital.importance}</td>
                <td>${vital.devices}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-header">🔬 ADVANCED LABORATORY TESTS</div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Priority</th>
              <th>Reason</th>
              <th>Cost (₹)</th>
              <th>Normal Range</th>
              <th>Month</th>
            </tr>
          </thead>
          <tbody>
            ${result?.labTests
              .map(
                (lab) => `
              <tr>
                <td><strong>${lab.test}</strong></td>
                <td>${lab.priority}</td>
                <td>${lab.reason}</td>
                <td>${lab.cost}</td>
                <td>${lab.normalRange}</td>
                <td>${lab.month}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Page 2: Exercise Plan & Diet Plan -->
  <div class="page">
    <div class="section">
      <div class="section-header">🏃‍♂️ PERSONALIZED EXERCISE & FITNESS PLAN</div>
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
            ${result?.exerciseRecommendations
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

    <div class="section">
      <div class="section-header">🍽️ COMPREHENSIVE WEEK 1 DIET PLAN</div>
      <div class="section-content">
        <div class="compact-grid">
          ${result?.comprehensiveDietPlan.week1
            .slice(0, 4)
            .map(
              (day) => `
            <div class="meal-card">
              <div style="font-weight: bold; color: #1e40af; margin-bottom: 2px;">${day.day} - ${day.date}</div>
              <div style="font-size: 6px;">
                <strong>Breakfast:</strong> ${day.meals[0]?.items || "Healthy breakfast"}<br>
                <strong>Lunch:</strong> ${day.meals[2]?.items || "Balanced lunch"}<br>
                <strong>Dinner:</strong> ${day.meals[4]?.items || "Light dinner"}<br>
                <em>Total: ${day.totalCalories} kcal | Water: ${day.totalWater}ml</em>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">💊 PERSONALIZED SUPPLEMENTS</div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Supplement</th>
              <th>Dosage</th>
              <th>Timing</th>
              <th>Benefits</th>
              <th>Brand</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${result?.supplements
              .map(
                (supplement) => `
              <tr>
                <td><strong>${supplement.name}</strong></td>
                <td>${supplement.dosage}</td>
                <td>${supplement.timing}</td>
                <td>${supplement.benefits}</td>
                <td>${supplement.brands}</td>
                <td>${supplement.price}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <div class="section-header">🌿 AYURVEDIC DIABETES REVERSAL</div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Treatment</th>
              <th>Herbs</th>
              <th>Dosage</th>
              <th>Timing</th>
              <th>Benefits</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${result?.ayurvedicTreatment
              .map(
                (treatment) => `
              <tr>
                <td><strong>${treatment.treatment}</strong></td>
                <td>${treatment.herbs}</td>
                <td>${treatment.dosage}</td>
                <td>${treatment.timing}</td>
                <td>${treatment.benefits}</td>
                <td>${treatment.duration}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Page 3: Enhanced Emergency Protocols -->
  <div class="page">
    <div class="critical-emergency">
      <h3 style="color: #dc2626; margin-bottom: 8px; text-align: center;">🚨 CRITICAL DIABETES EMERGENCY PROTOCOLS</h3>
      <p style="text-align: center; font-weight: bold; color: #7f1d1d; margin-bottom: 8px; font-size: 8px;">
        EMERGENCY CONTACT: 108 (India) | Keep this page accessible at all times
      </p>
      
      <div class="compact-grid-3">
        <div class="emergency-protocol">
          <div class="emergency-title">⚠️ HYPOGLYCEMIA (&lt;70 mg/dL)</div>
          <div style="font-size: 6px;">
            <strong>🔍 SYMPTOMS:</strong><br>
            ${result?.emergencyProtocols.hypoglycemia.symptoms.slice(0, 6).join(" • ")}<br><br>
            <strong>⚡ IMMEDIATE ACTIONS:</strong><br>
            ${result?.emergencyProtocols.hypoglycemia.immediateActions.slice(0, 4).join(" • ")}<br><br>
            <strong>💊 EMERGENCY TREATMENTS:</strong><br>
            ${result?.emergencyProtocols.hypoglycemia.medications.slice(0, 4).join(" • ")}<br><br>
            <strong>📞 CALL 108 IF:</strong><br>
            ${result?.emergencyProtocols.hypoglycemia.whenToCallHelp.slice(0, 4).join(" • ")}
          </div>
        </div>

        <div class="emergency-protocol">
          <div class="emergency-title">⚠️ HYPERGLYCEMIA (&gt;250 mg/dL)</div>
          <div style="font-size: 6px;">
            <strong>🔍 SYMPTOMS:</strong><br>
            ${result?.emergencyProtocols.hyperglycemia.symptoms.slice(0, 6).join(" • ")}<br><br>
            <strong>⚡ IMMEDIATE ACTIONS:</strong><br>
            ${result?.emergencyProtocols.hyperglycemia.immediateActions.slice(0, 4).join(" • ")}<br><br>
            <strong>💊 EMERGENCY TREATMENTS:</strong><br>
            ${result?.emergencyProtocols.hyperglycemia.medications.slice(0, 4).join(" • ")}<br><br>
            <strong>📞 CALL 108 IF:</strong><br>
            ${result?.emergencyProtocols.hyperglycemia.whenToCallHelp.slice(0, 4).join(" • ")}
          </div>
        </div>

        <div class="emergency-protocol" style="border: 2px solid #dc2626;">
          <div class="emergency-title" style="color: #dc2626;">🚨 DIABETIC KETOACIDOSIS - LIFE THREATENING</div>
          <div style="font-size: 6px;">
            <strong>🔍 CRITICAL SYMPTOMS:</strong><br>
            ${result?.emergencyProtocols.ketoacidosis.symptoms.slice(0, 6).join(" • ")}<br><br>
            <strong>⚡ EMERGENCY ACTIONS:</strong><br>
            ${result?.emergencyProtocols.ketoacidosis.immediateActions.slice(0, 4).join(" • ")}<br><br>
            <strong>🏥 Hospital Treatment Only:</strong><br>
            ${result?.emergencyProtocols.ketoacidosis.medications.slice(0, 3).join(" • ")}<br><br>
            <strong>📞 CALL 108 IMMEDIATELY:</strong><br>
            ${result?.emergencyProtocols.ketoacidosis.whenToCallHelp.slice(0, 3).join(" • ")}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Page 4: Follow-Up Plan */}
  {result && (
    <div class="page">
      <div class="section">
        <div class="section-header">📅 FOLLOW-UP PLAN</div>
        <div class="section-content">
          <p><strong>Next Appointment:</strong> ${result.followUpPlan.nextAppointment}</p>
          <p><strong>Monitoring Schedule:</strong> ${result.followUpPlan.monitoringSchedule.join(", ")}</p>
          <p><strong>Lifestyle Changes:</strong> ${result.followUpPlan.lifestyleChanges.join(", ")}</p>
          <p><strong>Expected Improvement:</strong> ${result.followUpPlan.expectedImprovement}</p>
          <p><strong>Reversal Timeline:</strong> ${result.followUpPlan.reversalTimeline}</p>
          <p><strong>Success Metrics:</strong> ${result.followUpPlan.successMetrics.join(", ")}</p>
        </div>
      </div>
    </div>
  )}
</body>
</html>
`

    // Function to generate PDF from HTML content
    const generatePDFFromHTML = (htmlContent: string) => {
      const pdf = window.open("", "_blank")
      if (pdf) {
        pdf.document.open()
        pdf.document.write(htmlContent)
        pdf.document.close()
      }
    }

    generatePDFFromHTML(pdfContent)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Diabetes Assessment</h1>
        {/* Form for user input */}
        <form className="w-full space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <Input
              label="Age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              label="Weight (kg)"
              placeholder="Enter your weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
            <Input
              label="Height (cm)"
              placeholder="Enter your height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
            <Select
              label="Diabetes Type"
              value={formData.diabetesType}
              onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diabetes type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Type 1">Type 1</SelectItem>
                <SelectItem value="Type 2">Type 2</SelectItem>
              </SelectContent>
            </Select>
            <Input
              label="Diagnosis Date"
              placeholder="Enter diagnosis date"
              value={formData.diagnosisDate}
              onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="Enter your location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Emergency Contact"
              placeholder="Enter emergency contact number"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>

          {/* Medical History */}
          <div className="grid grid-cols-2 gap-4">
            <Textarea
              label="Current Medications"
              placeholder="List your current medications"
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
            />
            <Input
              label="HbA1c Level (%)"
              placeholder="Enter your HbA1c level"
              value={formData.hba1cLevel}
              onChange={(e) => setFormData({ ...formData, hba1cLevel: e.target.value })}
            />
            <Input
              label="Blood Pressure Systolic (mmHg)"
              placeholder="Enter systolic blood pressure"
              value={formData.bloodPressureSystolic}
              onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
            />
            <Input
              label="Blood Pressure Diastolic (mmHg)"
              placeholder="Enter diastolic blood pressure"
              value={formData.bloodPressureDiastolic}
              onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
            />
            <Select
              label="Allergies"
              value={formData.allergies.join(", ")}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(", ") })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select allergies" />
              </SelectTrigger>
              <SelectContent>
                {allergyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Last Checkup Date"
              placeholder="Enter last checkup date"
              value={formData.lastCheckup}
              onChange={(e) => setFormData({ ...formData, lastCheckup: e.target.value })}
            />
            <Textarea
              label="Family History"
              placeholder="List your family history"
              value={formData.familyHistory}
              onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
            />
            <Select
              label="Complications"
              value={formData.complications.join(", ")}
              onChange={(e) => setFormData({ ...formData, complications: e.target.value.split(", ") })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select complications" />
              </SelectTrigger>
              <SelectContent>
                {complicationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Parameters */}
          {showAdvancedParams && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Insulin Resistance"
                placeholder="Enter insulin resistance level"
                value={formData.insulinResistance}
                onChange={(e) => setFormData({ ...formData, insulinResistance: e.target.value })}
              />
              <Input
                label="C-Peptide Level"
                placeholder="Enter C-peptide level"
                value={formData.cPeptideLevel}
                onChange={(e) => setFormData({ ...formData, cPeptideLevel: e.target.value })}
              />
              <Input
                label="Microalbuminuria"
                placeholder="Enter microalbuminuria level"
                value={formData.microalbuminuria}
                onChange={(e) => setFormData({ ...formData, microalbuminuria: e.target.value })}
              />
              <Input
                label="Lipid Profile"
                placeholder="Enter lipid profile"
                value={formData.lipidProfile}
                onChange={(e) => setFormData({ ...formData, lipidProfile: e.target.value })}
              />
              <Input
                label="Thyroid Function"
                placeholder="Enter thyroid function"
                value={formData.thyroidFunction}
                onChange={(e) => setFormData({ ...formData, thyroidFunction: e.target.value })}
              />
              <Input
                label="Vitamin D"
                placeholder="Enter vitamin D level"
                value={formData.vitaminD}
                onChange={(e) => setFormData({ ...formData, vitaminD: e.target.value })}
              />
              <Input
                label="Inflammation"
                placeholder="Enter inflammation level"
                value={formData.inflammation}
                onChange={(e) => setFormData({ ...formData, inflammation: e.target.value })}
              />
            </div>
          )}

          {/* Lifestyle */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Activity Level"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Select
              label="Diet Preferences"
              value={formData.dietPreferences}
              onChange={(e) => setFormData({ ...formData, dietPreferences: e.target.value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet preferences" />
              </SelectTrigger>
              <SelectContent>
                {dietPreferenceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Exercise Frequency"
              placeholder="Enter exercise frequency"
              value={formData.exerciseFrequency}
              onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
            />
            <Input
              label="Sleep Hours"
              placeholder="Enter sleep hours"
              value={formData.sleepHours}
              onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
            />
            <Select
              label="Smoking Status"
              value={formData.smokingStatus}
              onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select smoking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                <SelectItem value="Occasional smoker">Occasional smoker</SelectItem>
                <SelectItem value="Regular smoker">Regular smoker</SelectItem>
              </SelectContent>
            </Select>
            <Select
              label="Alcohol Consumption"
              value={formData.alcoholConsumption}
              onChange={(e) => setFormData({ ...formData, alcoholConsumption: e.target.value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select alcohol consumption" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Occasional">Occasional</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
              </SelectContent>
            </Select>
            <Select
              label="Stress Level"
              value={formData.stressLevel.join(", ")}
              onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value.split(", ") })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stress level" />
              </SelectTrigger>
              <SelectContent>
                {stressLevelOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Work Schedule"
              placeholder="Enter work schedule"
              value={formData.workSchedule}
              onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
            />
          </div>

          {/* Current Symptoms */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fasting Blood Sugar (mg/dL)"
              placeholder="Enter fasting blood sugar"
              value={formData.fastingBloodSugar}
              onChange={(e) => setFormData({ ...formData, fastingBloodSugar: e.target.value })}
            />
            <Input
              label="Post-Meal Blood Sugar (mg/dL)"
              placeholder="Enter post-meal blood sugar"
              value={formData.postMealBloodSugar}
              onChange={(e) => setFormData({ ...formData, postMealBloodSugar: e.target.value })}
            />
            <Select
              label="Frequent Symptoms"
              value={formData.frequentSymptoms.join(", ")}
              onChange={(e) => setFormData({ ...formData, frequentSymptoms: e.target.value.split(", ") })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequent symptoms" />
              </SelectTrigger>
              <SelectContent>
                {symptomOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Emergency Episodes"
              placeholder="Enter number of emergency episodes"
              value={formData.emergencyEpisodes}
              onChange={(e) => setFormData({ ...formData, emergencyEpisodes: e.target.value })}
            />
            <Textarea
              label="Symptom Severity"
              placeholder="Enter symptom severity levels"
              value={formData.symptomSeverity.join(", ")}
              onChange={(e) => setFormData({ ...formData, symptomSeverity: e.target.value.split(", ").map(Number) })}
            />
          </div>

          {/* Goals & Commitment */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Weight Target (kg)"
              placeholder="Enter weight target"
              value={formData.weightTarget}
              onChange={(e) => setFormData({ ...formData, weightTarget: e.target.value })}
            />
            <Input
              label="HbA1c Target (%)"
              placeholder="Enter HbA1c target"
              value={formData.hba1cTarget}
              onChange={(e) => setFormData({ ...formData, hba1cTarget: e.target.value })}
            />
            <Select
              label="Primary Goals"
              value={formData.primaryGoals.join(", ")}
              onChange={(e) => setFormData({ ...formData, primaryGoals: e.target.value.split(", ") })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary goals" />
              </SelectTrigger>
              <SelectContent>
                {healthGoalOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              label="Dietary Restrictions"
              placeholder="Enter dietary restrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
            />
            <Textarea
              label="Exercise Goals"
              placeholder="Enter exercise goals"
              value={formData.exerciseGoals}
              onChange={(e) => setFormData({ ...formData, exerciseGoals: e.target.value })}
            />
            <Select
              label="Commitment Level"
              value={formData.commitmentLevel.join(", ")}
              onChange={(e) => setFormData({ ...formData, commitmentLevel: e.target.value.split(", ") })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select commitment level" />
              </SelectTrigger>
              <SelectContent>
                {commitmentLevelOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              label="Budget Range (₹)"
              placeholder="Enter budget range"
              value={formData.budgetRange}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            />
            <Textarea
              label="Additional Notes"
              placeholder="Enter any additional notes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            />
          </div>

          {/* Advanced Parameters Toggle */}
          <div className="flex items-center justify-center">
            <Checkbox
              id="advancedParams"
              checked={showAdvancedParams}
              onCheckedChange={(checked) => setShowAdvancedParams(checked)}
            />
            <Label htmlFor="advancedParams" className="ml-2">
              Show Advanced Parameters
            </Label>
          </div>

          {/* Submit Button */}
          <Button type="button" onClick={() => generatePDF()} className="mt-4">
            Generate PDF Report
          </Button>
        </form>
      </main>
    </div>
  )
}
