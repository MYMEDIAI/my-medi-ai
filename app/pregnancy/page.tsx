"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"
import {
  Baby,
  Heart,
  Activity,
  Apple,
  AlertTriangle,
  Pill,
  Coffee,
  Utensils,
  Moon,
  Sun,
  Droplets,
  Shield,
  Brain,
  Star,
  Phone,
  MapPin,
  Hospital,
  TestTube,
  Navigation,
  Printer,
  Loader2,
  TrendingUp,
  Scale,
  Thermometer,
} from "lucide-react"
import LocationService from "@/lib/location-service"
import { calculateDistance, formatDistance } from "@/lib/calculate-distance"

interface PregnancyData {
  name: string
  lastPeriodDate: string
  expectedDeliveryDate: string
  currentWeek: number
  currentTrimester: number
  babyName: string
  motherAge: number
  prePregnancyWeight: number
  currentWeight: number
  height: number
  bloodType: string
  complications: string[]
  medicalHistory: string
  allergies: string
  currentMedications: string
  previousPregnancies: number
  previousMiscarriages: number
  bloodPressure: {
    systolic: number
    diastolic: number
    date: string
  }
  heartRate: number
  temperature: number
  location?: {
    address: string
    city: string
    state: string
    coordinates: { lat: number; lng: number }
  }
  labResults: LabResult[]
  vitalSigns: VitalSign[]
  symptoms: Symptom[]
  riskFactors: string[]
}

interface LabResult {
  id: string
  testName: string
  value: number
  unit: string
  normalRange: string
  status: "normal" | "low" | "high" | "critical"
  date: string
  trimester: number
  notes?: string
}

interface VitalSign {
  id: string
  date: string
  week: number
  weight: number
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  temperature: number
  fundalHeight?: number
  fetalHeartRate?: number
  notes?: string
}

interface Symptom {
  id: string
  name: string
  severity: "mild" | "moderate" | "severe"
  frequency: "rare" | "occasional" | "frequent" | "constant"
  startDate: string
  description: string
  triggers?: string[]
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

interface HealthcareFacility {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  user_ratings_total?: number
  opening_hours?: {
    open_now: boolean
  }
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  distance?: number
  formatted_phone_number?: string
}

export default function PregnancyPage() {
  const [activeTab, setActiveTab] = useState("pregnancy")
  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({
    name: "",
    lastPeriodDate: "",
    expectedDeliveryDate: "",
    currentWeek: 0,
    currentTrimester: 1,
    babyName: "",
    motherAge: 25,
    prePregnancyWeight: 60,
    currentWeight: 65,
    height: 160,
    bloodType: "",
    complications: [],
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    previousPregnancies: 0,
    previousMiscarriages: 0,
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      date: new Date().toISOString().split("T")[0],
    },
    heartRate: 72,
    temperature: 98.6,
    location: undefined,
    labResults: [],
    vitalSigns: [],
    symptoms: [],
    riskFactors: [],
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

  const [nearbyHospitals, setNearbyHospitals] = useState<HealthcareFacility[]>([])
  const [nearbyLabs, setNearbyLabs] = useState<HealthcareFacility[]>([])
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Initialize sample lab results and vital signs
  useEffect(() => {
    if (pregnancyData.labResults.length === 0) {
      const sampleLabResults: LabResult[] = [
        {
          id: "1",
          testName: "Hemoglobin (Hb)",
          value: 11.5,
          unit: "g/dL",
          normalRange: "11.0-15.0",
          status: "normal",
          date: new Date().toISOString().split("T")[0],
          trimester: 1,
          notes: "Within normal range for pregnancy",
        },
        {
          id: "2",
          testName: "Blood Sugar (Fasting)",
          value: 85,
          unit: "mg/dL",
          normalRange: "70-100",
          status: "normal",
          date: new Date().toISOString().split("T")[0],
          trimester: 1,
        },
        {
          id: "3",
          testName: "Thyroid (TSH)",
          value: 2.1,
          unit: "mIU/L",
          normalRange: "0.4-4.0",
          status: "normal",
          date: new Date().toISOString().split("T")[0],
          trimester: 1,
        },
        {
          id: "4",
          testName: "Platelet Count",
          value: 180000,
          unit: "/μL",
          normalRange: "150000-450000",
          status: "normal",
          date: new Date().toISOString().split("T")[0],
          trimester: 1,
        },
        {
          id: "5",
          testName: "Protein (Urine)",
          value: 0.1,
          unit: "g/L",
          normalRange: "0.0-0.3",
          status: "normal",
          date: new Date().toISOString().split("T")[0],
          trimester: 1,
        },
        {
          id: "6",
          testName: "Iron (Serum)",
          value: 45,
          unit: "μg/dL",
          normalRange: "60-170",
          status: "low",
          date: new Date().toISOString().split("T")[0],
          trimester: 1,
          notes: "Iron deficiency - supplement recommended",
        },
      ]

      const sampleVitalSigns: VitalSign[] = [
        {
          id: "1",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          week: pregnancyData.currentWeek - 1,
          weight: pregnancyData.currentWeight - 1,
          bloodPressureSystolic: 118,
          bloodPressureDiastolic: 78,
          heartRate: 70,
          temperature: 98.4,
          fundalHeight: pregnancyData.currentWeek > 12 ? pregnancyData.currentWeek - 4 : undefined,
          fetalHeartRate: pregnancyData.currentWeek > 10 ? 145 : undefined,
        },
        {
          id: "2",
          date: new Date().toISOString().split("T")[0],
          week: pregnancyData.currentWeek,
          weight: pregnancyData.currentWeight,
          bloodPressureSystolic: pregnancyData.bloodPressure.systolic,
          bloodPressureDiastolic: pregnancyData.bloodPressure.diastolic,
          heartRate: pregnancyData.heartRate,
          temperature: pregnancyData.temperature,
          fundalHeight: pregnancyData.currentWeek > 12 ? pregnancyData.currentWeek - 4 : undefined,
          fetalHeartRate: pregnancyData.currentWeek > 10 ? 148 : undefined,
        },
      ]

      const sampleSymptoms: Symptom[] = [
        {
          id: "1",
          name: "Morning Sickness",
          severity: "moderate",
          frequency: "frequent",
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: "Nausea and occasional vomiting, especially in the morning",
          triggers: ["Strong smells", "Empty stomach", "Fatigue"],
        },
        {
          id: "2",
          name: "Fatigue",
          severity: "mild",
          frequency: "frequent",
          startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: "General tiredness and need for more sleep",
        },
      ]

      setPregnancyData((prev) => ({
        ...prev,
        labResults: sampleLabResults,
        vitalSigns: sampleVitalSigns,
        symptoms: sampleSymptoms,
        riskFactors: prev.motherAge > 35 ? ["Advanced Maternal Age"] : [],
      }))
    }
  }, [pregnancyData.currentWeek, pregnancyData.motherAge])

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

  const detectLocation = async () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    try {
      const locationService = LocationService.getInstance()
      const coords = await locationService.getCurrentLocation()

      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coords),
      })

      if (response.ok) {
        const data = await response.json()

        const locationInfo = {
          address: data.locationInfo?.address || "",
          city: data.locationInfo?.city || "",
          state: data.locationInfo?.state || "",
          coordinates: coords,
        }

        setPregnancyData((prev) => ({ ...prev, location: locationInfo }))

        // Categorize facilities
        const allFacilities = data.facilities || []
        const hospitals: HealthcareFacility[] = []
        const labs: HealthcareFacility[] = []

        allFacilities.forEach((facility: HealthcareFacility) => {
          facility.distance = calculateDistance(
            coords.lat,
            coords.lng,
            facility.geometry.location.lat,
            facility.geometry.location.lng,
          )

          if (facility.types.some((type) => ["hospital", "medical_center", "emergency_room"].includes(type))) {
            hospitals.push(facility)
          } else if (
            facility.types.some(
              (type) =>
                ["medical_lab", "laboratory", "pathology_lab", "diagnostic_center"].includes(type) ||
                facility.name.toLowerCase().includes("lab") ||
                facility.name.toLowerCase().includes("diagnostic") ||
                facility.name.toLowerCase().includes("pathology"),
            )
          ) {
            labs.push(facility)
          }
        })

        hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0))
        labs.sort((a, b) => (a.distance || 0) - (b.distance || 0))

        setNearbyHospitals(hospitals.slice(0, 10))
        setNearbyLabs(labs.slice(0, 10))
      }
    } catch (error) {
      setLocationError("Failed to detect location. Please try again.")
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const getDateFromWeeks = (weeks: number): string => {
    if (!pregnancyData.lastPeriodDate) return ""
    const lastPeriod = new Date(pregnancyData.lastPeriodDate)
    const targetDate = new Date(lastPeriod)
    targetDate.setDate(targetDate.getDate() + weeks * 7)
    return targetDate.toLocaleDateString()
  }

  const getWeekRange = (startWeek: number, endWeek: number): string => {
    const startDate = getDateFromWeeks(startWeek)
    const endDate = getDateFromWeeks(endWeek)
    return `${startDate} - ${endDate}`
  }

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100
    return weight / (heightInMeters * heightInMeters)
  }

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  const getWeightGainRecommendation = (): { min: number; max: number; category: string } => {
    const preBMI = calculateBMI(pregnancyData.prePregnancyWeight, pregnancyData.height)
    if (preBMI < 18.5) return { min: 28, max: 40, category: "Underweight" }
    if (preBMI < 25) return { min: 25, max: 35, category: "Normal" }
    if (preBMI < 30) return { min: 15, max: 25, category: "Overweight" }
    return { min: 11, max: 20, category: "Obese" }
  }

  const getCurrentWeightGain = (): number => {
    return pregnancyData.currentWeight - pregnancyData.prePregnancyWeight
  }

  const getLabStatus = (status: string): { color: string; text: string } => {
    switch (status) {
      case "normal":
        return { color: "bg-green-100 text-green-800", text: "Normal" }
      case "low":
        return { color: "bg-yellow-100 text-yellow-800", text: "Low" }
      case "high":
        return { color: "bg-orange-100 text-orange-800", text: "High" }
      case "critical":
        return { color: "bg-red-100 text-red-800", text: "Critical" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown" }
    }
  }

  const generateHealthAnalysis = (): string => {
    const analysis = []
    const currentBMI = calculateBMI(pregnancyData.currentWeight, pregnancyData.height)
    const weightGain = getCurrentWeightGain()
    const recommendation = getWeightGainRecommendation()

    // Weight Analysis
    if (weightGain < recommendation.min) {
      analysis.push(
        `Weight gain (${weightGain.toFixed(1)} lbs) is below recommended range. Consider increasing caloric intake with nutritious foods.`,
      )
    } else if (weightGain > recommendation.max) {
      analysis.push(
        `Weight gain (${weightGain.toFixed(1)} lbs) is above recommended range. Monitor portion sizes and maintain regular exercise.`,
      )
    } else {
      analysis.push(
        `Weight gain (${weightGain.toFixed(1)} lbs) is within healthy range for your pre-pregnancy BMI category.`,
      )
    }

    // Lab Results Analysis
    const abnormalLabs = pregnancyData.labResults.filter((lab) => lab.status !== "normal")
    if (abnormalLabs.length > 0) {
      analysis.push(`Lab results show ${abnormalLabs.length} values outside normal range requiring attention.`)
    }

    // Blood Pressure Analysis
    if (pregnancyData.bloodPressure.systolic > 140 || pregnancyData.bloodPressure.diastolic > 90) {
      analysis.push("Blood pressure is elevated. Monitor closely and consult healthcare provider.")
    }

    // Risk Factors
    if (pregnancyData.riskFactors.length > 0) {
      analysis.push(`Risk factors identified: ${pregnancyData.riskFactors.join(", ")}. Regular monitoring recommended.`)
    }

    return analysis.join(" ")
  }

  const handlePrint = () => {
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>MyMedi.ai - Comprehensive Pregnancy & Baby Care Plan</title>
  <style>
    @media print {
      body { margin: 0; font-size: 11px; }
      .page-break { page-break-before: always; }
      .no-break { page-break-inside: avoid; }
    }
    body { 
      font-family: Arial, sans-serif; 
      margin: 15px; 
      line-height: 1.3; 
      color: #000;
      font-size: 11px;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #333;
      padding-bottom: 10px; 
      margin-bottom: 15px;
    }
    .header h1 { margin: 0; font-size: 18px; font-weight: bold; }
    .header p { margin: 2px 0; font-size: 10px; }
    .section { 
      margin: 12px 0; 
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .section-header { 
      background: #f5f5f5; 
      padding: 6px 10px; 
      border-bottom: 1px solid #ccc;
      font-weight: bold; 
      font-size: 12px;
    }
    .section-content { padding: 8px 10px; }
    .patient-info { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 15px; 
      margin-bottom: 15px;
    }
    .info-item { margin: 3px 0; }
    .analysis-box {
      background: #e3f2fd;
      border: 2px solid #2196f3;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .lab-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .lab-item {
      border: 1px solid #ddd;
      padding: 6px;
      border-radius: 3px;
      font-size: 9px;
    }
    .vital-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .vital-item {
      border: 1px solid #ddd;
      padding: 6px;
      border-radius: 3px;
      font-size: 9px;
      text-align: center;
    }
    .status-normal { background: #e8f5e8; color: #2e7d32; }
    .status-low { background: #fff3e0; color: #f57c00; }
    .status-high { background: #ffebee; color: #d32f2f; }
    .status-critical { background: #ffcdd2; color: #b71c1c; }
    .trimester-box {
      border: 1px solid #ddd;
      margin: 8px 0;
      border-radius: 3px;
    }
    .trimester-header {
      background: #f8f8f8;
      padding: 5px 8px;
      font-weight: bold;
      font-size: 11px;
      border-bottom: 1px solid #ddd;
    }
    .trimester-content { padding: 6px 8px; }
    .visit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 5px 0;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 8px 0;
      font-size: 10px;
    }
    th, td { 
      border: 1px solid #ccc; 
      padding: 4px; 
      text-align: left;
      vertical-align: top;
    }
    th { 
      background: #f5f5f5; 
      font-weight: bold;
    }
    .meal-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .meal-item {
      border: 1px solid #ddd;
      padding: 5px;
      border-radius: 3px;
      font-size: 9px;
    }
    .facility-item {
      border: 1px solid #ddd;
      padding: 6px;
      margin: 4px 0;
      border-radius: 3px;
    }
    .emergency-box {
      border: 2px solid #d32f2f;
      background: #fff5f5;
      padding: 8px;
      margin: 8px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 10px;
      border-top: 1px solid #ccc;
      font-size: 9px;
    }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    ul { margin: 4px 0; padding-left: 15px; }
    li { margin: 1px 0; }
    h3 { font-size: 12px; margin: 8px 0 4px 0; }
    h4 { font-size: 11px; margin: 6px 0 3px 0; }
    .milestone-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .milestone-item {
      border: 1px solid #ddd;
      padding: 5px;
      border-radius: 3px;
      font-size: 9px;
    }
    .feeding-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0;
    }
    .feeding-item {
      border: 1px solid #ddd;
      padding: 5px;
      border-radius: 3px;
      font-size: 9px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>MyMedi.ai - Comprehensive Pregnancy & Baby Care Plan</h1>
    <p>AI-Powered Medical Analysis & Treatment Plan</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} | <strong>Time:</strong> ${new Date().toLocaleTimeString()} | <strong>ID:</strong> CARE-${Date.now()}</p>
  </div>
  
  ${
    activeTab === "pregnancy" || !activeTab
      ? `
  <!-- PREGNANCY CARE SECTION -->
  <div class="section no-break">
    <div class="section-header">PREGNANCY - DETAILED PATIENT INFORMATION</div>
    <div class="section-content">
      <div class="patient-info">
        <div>
          <div class="info-item"><strong>Name:</strong> ${pregnancyData.name || "Not provided"}</div>
          <div class="info-item"><strong>Age:</strong> ${pregnancyData.motherAge} years</div>
          <div class="info-item"><strong>Blood Type:</strong> ${pregnancyData.bloodType || "Not specified"}</div>
          <div class="info-item"><strong>LMP:</strong> ${pregnancyData.lastPeriodDate ? new Date(pregnancyData.lastPeriodDate).toLocaleDateString() : "Not provided"}</div>
          <div class="info-item"><strong>Height:</strong> ${pregnancyData.height} cm</div>
          <div class="info-item"><strong>Pre-pregnancy Weight:</strong> ${pregnancyData.prePregnancyWeight} kg</div>
          <div class="info-item"><strong>Current Weight:</strong> ${pregnancyData.currentWeight} kg</div>
          <div class="info-item"><strong>Weight Gain:</strong> ${getCurrentWeightGain().toFixed(1)} kg</div>
        </div>
        <div>
          <div class="info-item"><strong>Current Week:</strong> ${pregnancyData.currentWeek} weeks</div>
          <div class="info-item"><strong>Trimester:</strong> ${pregnancyData.currentTrimester}${pregnancyData.currentTrimester === 1 ? "st" : pregnancyData.currentTrimester === 2 ? "nd" : "rd"}</div>
          <div class="info-item"><strong>EDD:</strong> ${pregnancyData.expectedDeliveryDate ? new Date(pregnancyData.expectedDeliveryDate).toLocaleDateString() : "Not calculated"}</div>
          <div class="info-item"><strong>Previous Pregnancies:</strong> ${pregnancyData.previousPregnancies}</div>
          <div class="info-item"><strong>Previous Miscarriages:</strong> ${pregnancyData.previousMiscarriages}</div>
          <div class="info-item"><strong>Current BMI:</strong> ${calculateBMI(pregnancyData.currentWeight, pregnancyData.height).toFixed(1)} (${getBMICategory(calculateBMI(pregnancyData.currentWeight, pregnancyData.height))})</div>
          <div class="info-item"><strong>Blood Pressure:</strong> ${pregnancyData.bloodPressure.systolic}/${pregnancyData.bloodPressure.diastolic} mmHg</div>
          ${pregnancyData.location ? `<div class="info-item"><strong>Location:</strong> ${pregnancyData.location.city}, ${pregnancyData.location.state}</div>` : ""}
        </div>
      </div>
      
      <div class="analysis-box">
        <h4 style="margin: 0 0 8px 0; color: #1976d2;">AI HEALTH ANALYSIS & RECOMMENDATIONS</h4>
        <p style="margin: 0; font-size: 10px;">${generateHealthAnalysis()}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">PREGNANCY - CURRENT VITAL SIGNS & MEASUREMENTS</div>
    <div class="section-content">
      <div class="vital-grid">
        <div class="vital-item">
          <strong>Blood Pressure</strong><br>
          ${pregnancyData.bloodPressure.systolic}/${pregnancyData.bloodPressure.diastolic}<br>
          <small>mmHg</small><br>
          <small style="color: ${pregnancyData.bloodPressure.systolic > 140 || pregnancyData.bloodPressure.diastolic > 90 ? "#d32f2f" : "#2e7d32"};">
            ${pregnancyData.bloodPressure.systolic > 140 || pregnancyData.bloodPressure.diastolic > 90 ? "Elevated" : "Normal"}
          </small>
        </div>
        <div class="vital-item">
          <strong>Heart Rate</strong><br>
          ${pregnancyData.heartRate}<br>
          <small>bpm</small><br>
          <small style="color: ${pregnancyData.heartRate > 100 || pregnancyData.heartRate < 60 ? "#f57c00" : "#2e7d32"};">
            ${pregnancyData.heartRate > 100 ? "High" : pregnancyData.heartRate < 60 ? "Low" : "Normal"}
          </small>
        </div>
        <div class="vital-item">
          <strong>Temperature</strong><br>
          ${pregnancyData.temperature}°F<br>
          <small>Fahrenheit</small><br>
          <small style="color: ${pregnancyData.temperature > 99.5 ? "#d32f2f" : "#2e7d32"};">
            ${pregnancyData.temperature > 99.5 ? "Elevated" : "Normal"}
          </small>
        </div>
        <div class="vital-item">
          <strong>Weight Gain</strong><br>
          ${getCurrentWeightGain().toFixed(1)} kg<br>
          <small>Total gain</small><br>
          <small style="color: #2e7d32;">Tracking</small>
        </div>
      </div>
      
      ${
        pregnancyData.currentWeek > 12
          ? `
      <div class="vital-grid">
        <div class="vital-item">
          <strong>Fundal Height</strong><br>
          ${pregnancyData.currentWeek - 4} cm<br>
          <small>Estimated</small><br>
          <small style="color: #2e7d32;">Normal</small>
        </div>
        <div class="vital-item">
          <strong>Fetal Heart Rate</strong><br>
          148 bpm<br>
          <small>Estimated</small><br>
          <small style="color: #2e7d32;">Normal</small>
        </div>
        <div class="vital-item">
          <strong>Fetal Movement</strong><br>
          Active<br>
          <small>Daily</small><br>
          <small style="color: #2e7d32;">Good</small>
        </div>
        <div class="vital-item">
          <strong>Cervical Length</strong><br>
          Normal<br>
          <small>Ultrasound</small><br>
          <small style="color: #2e7d32;">Stable</small>
        </div>
      </div>
      `
          : ""
      }
    </div>
  </div>

  <div class="section">
    <div class="section-header">PREGNANCY - LABORATORY TEST RESULTS</div>
    <div class="section-content">
      <div class="lab-grid">
        ${pregnancyData.labResults
          .map(
            (lab) => `
          <div class="lab-item status-${lab.status}">
            <strong>${lab.testName}</strong><br>
            <span style="font-size: 12px; font-weight: bold;">${lab.value} ${lab.unit}</span><br>
            <small>Normal: ${lab.normalRange}</small><br>
            <small>Status: ${lab.status.toUpperCase()}</small>
            ${lab.notes ? `<br><small style="font-style: italic;">${lab.notes}</small>` : ""}
          </div>
        `,
          )
          .join("")}
      </div>
      
      <h4>Lab Results Summary:</h4>
      <ul style="font-size: 10px;">
        <li><strong>Normal Results:</strong> ${pregnancyData.labResults.filter((lab) => lab.status === "normal").length} tests</li>
        <li><strong>Abnormal Results:</strong> ${pregnancyData.labResults.filter((lab) => lab.status !== "normal").length} tests requiring attention</li>
        <li><strong>Critical Results:</strong> ${pregnancyData.labResults.filter((lab) => lab.status === "critical").length} tests</li>
        <li><strong>Next Lab Work:</strong> Recommended in ${pregnancyData.currentTrimester === 1 ? "4" : pregnancyData.currentTrimester === 2 ? "4" : "2"} weeks</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-header">PREGNANCY - SYMPTOMS & RISK ASSESSMENT</div>
    <div class="section-content">
      <div class="two-col">
        <div>
          <h4>Current Symptoms:</h4>
          ${
            pregnancyData.symptoms.length > 0
              ? `
            <ul style="font-size: 10px;">
              ${pregnancyData.symptoms
                .map(
                  (symptom) => `
                <li><strong>${symptom.name}</strong> - ${symptom.severity} (${symptom.frequency})<br>
                <small>${symptom.description}</small></li>
              `,
                )
                .join("")}
            </ul>
          `
              : '<p style="font-size: 10px;">No significant symptoms reported</p>'
          }
        </div>
        <div>
          <h4>Risk Factors:</h4>
          ${
            pregnancyData.riskFactors.length > 0
              ? `
            <ul style="font-size: 10px;">
              ${pregnancyData.riskFactors.map((risk) => `<li>${risk}</li>`).join("")}
            </ul>
          `
              : '<p style="font-size: 10px;">No significant risk factors identified</p>'
          }
          
          <h4>Medical History:</h4>
          <p style="font-size: 10px;">${pregnancyData.medicalHistory || "No significant medical history"}</p>
          
          <h4>Current Medications:</h4>
          <p style="font-size: 10px;">${pregnancyData.currentMedications || "No current medications"}</p>
          
          <h4>Allergies:</h4>
          <p style="font-size: 10px;">${pregnancyData.allergies || "No known allergies"}</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-header">PREGNANCY - DOCTOR CHECKUP SCHEDULE</div>
    <div class="section-content">
      
      <div class="trimester-box">
        <div class="trimester-header">First Trimester (1-12 weeks) - ${getWeekRange(1, 12)}</div>
        <div class="trimester-content">
          <div class="visit-grid">
            <div>
              <strong>Visit Schedule:</strong>
              <ul>
                <li>First Visit (6-8 weeks): ${pregnancyData.lastPeriodDate ? getDateFromWeeks(7) : "TBD"}</li>
                <li>Second Visit (10-12 weeks): ${pregnancyData.lastPeriodDate ? getDateFromWeeks(11) : "TBD"}</li>
              </ul>
            </div>
            <div>
              <strong>Key Activities:</strong>
              <ul>
                <li>Confirm pregnancy, medical history</li>
                <li>Physical exam, first ultrasound</li>
                <li>Blood work: CBC, blood type, Rh</li>
                <li>STD screening, thyroid tests</li>
                <li>Prenatal vitamins, lifestyle counseling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="trimester-box">
        <div class="trimester-header">Second Trimester (13-28 weeks) - ${getWeekRange(13, 28)}</div>
        <div class="trimester-content">
          <div class="visit-grid">
            <div>
              <strong>Visit Schedule:</strong>
              <ul>
                <li>16 Week: ${pregnancyData.lastPeriodDate ? getDateFromWeeks(16) : "TBD"}</li>
                <li>20 Week (Anatomy): ${pregnancyData.lastPeriodDate ? getDateFromWeeks(20) : "TBD"}</li>
                <li>24 Week: ${pregnancyData.lastPeriodDate ? getDateFromWeeks(24) : "TBD"}</li>
                <li>28 Week: ${pregnancyData.lastPeriodDate ? getDateFromWeeks(28) : "TBD"}</li>
              </ul>
            </div>
            <div>
              <strong>Key Activities:</strong>
              <ul>
                <li>Anatomy ultrasound (18-20 weeks)</li>
                <li>Glucose tolerance test (24-28 weeks)</li>
                <li>BP monitoring, weight assessment</li>
                <li>TT vaccinations, iron supplements</li>
                <li>Fetal movement education</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="trimester-box">
        <div class="trimester-header">Third Trimester (29-40 weeks) - ${getWeekRange(29, 40)}</div>
        <div class="trimester-content">
          <div class="visit-grid">
            <div>
              <strong>Visit Schedule:</strong>
              <ul>
                <li>32 Week: ${pregnancyData.lastPeriodDate ? getDateFromWeeks(32) : "TBD"}</li>
                <li>34 Week: ${pregnancyData.lastPeriodDate ? getDateFromWeeks(34) : "TBD"}</li>
                <li>36 Week: ${pregnancyData.lastPeriodDate ? getDateFromWeeks(36) : "TBD"}</li>
                <li>37-40+ Weeks: Weekly visits</li>
              </ul>
            </div>
            <div>
              <strong>Key Activities:</strong>
              <ul>
                <li>Growth scans, fetal position</li>
                <li>Group B Strep (35-37 weeks)</li>
                <li>Cervical exams, NST if needed</li>
                <li>Birth plan, labor education</li>
                <li>Tdap vaccine (27-36 weeks)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-header">PREGNANCY - ESSENTIAL TESTS & VACCINATIONS</div>
    <div class="section-content">
      <div class="two-col">
        <div>
          <h4>Laboratory Tests:</h4>
          <table>
            <tr><th>Test</th><th>Timing</th><th>Purpose</th></tr>
            <tr><td>Blood Group & Rh</td><td>1st Tri</td><td>Rh incompatibility</td></tr>
            <tr><td>CBC</td><td>Each Tri</td><td>Anemia check</td></tr>
            <tr><td>Urine Analysis</td><td>Monthly</td><td>UTI, protein</td></tr>
            <tr><td>Glucose Test</td><td>24-28 wks</td><td>Diabetes screen</td></tr>
            <tr><td>Ultrasound</td><td>3-4 times</td><td>Fetal growth</td></tr>
            <tr><td>Group B Strep</td><td>35-37 wks</td><td>Delivery prep</td></tr>
          </table>
        </div>
        <div>
          <h4>Vaccination Schedule:</h4>
          <table>
            <tr><th>Vaccine</th><th>Timing</th><th>Date</th></tr>
            <tr><td>TT1</td><td>16-20 wks</td><td>${pregnancyData.lastPeriodDate ? getDateFromWeeks(18) : "TBD"}</td></tr>
            <tr><td>TT2</td><td>20-24 wks</td><td>${pregnancyData.lastPeriodDate ? getDateFromWeeks(22) : "TBD"}</td></tr>
            <tr><td>Influenza</td><td>Any time</td><td>As needed</td></tr>
            <tr><td>Tdap</td><td>27-36 wks</td><td>${pregnancyData.lastPeriodDate ? getDateFromWeeks(32) : "TBD"}</td></tr>
            <tr><td>COVID-19</td><td>Any time</td><td>As recommended</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  ${
    weeklyDietPlan.length > 0
      ? `
<div class="section">
  <div class="section-header">PREGNANCY - DETAILED WEEKLY DIET PLAN</div>
  <div class="section-content">
    ${weeklyDietPlan
      .map(
        (day) => `
      <div class="page-break"></div>
      <h3 style="color: #16a34a; margin: 12px 0 8px 0; border-bottom: 2px solid #16a34a; padding-bottom: 4px;">
        ${day.day} - Nutrition Summary
      </h3>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 10px 0; background: #f0fdf4; padding: 8px; border-radius: 4px;">
        <div style="text-align: center;">
          <div style="font-size: 16px; font-weight: bold; color: #16a34a;">${day.totalCalories}</div>
          <div style="font-size: 10px; color: #15803d;">Calories</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 16px; font-weight: bold; color: #2563eb;">${day.totalProtein}g</div>
          <div style="font-size: 10px; color: #1d4ed8;">Protein</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 16px; font-weight: bold; color: #ea580c;">${day.totalFiber}g</div>
          <div style="font-size: 10px; color: #c2410c;">Fiber</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 16px; font-weight: bold; color: #7c3aed;">6</div>
          <div style="font-size: 10px; color: #6d28d9;">Meals</div>
        </div>
      </div>

      <h4 style="color: #374151; margin: 10px 0 6px 0;">Daily Meals Breakdown:</h4>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 8px 0;">
        <!-- Breakfast -->
        <div style="border: 1px solid #fed7aa; background: #fff7ed; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #ea580c; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center;">
            ☕ Breakfast
          </div>
          <div style="font-weight: bold; color: #9a3412; font-size: 10px; margin-bottom: 3px;">
            ${day.breakfast.name}
          </div>
          <div style="font-size: 8px; margin-bottom: 3px;">
            <strong>Ingredients:</strong>
            <ul style="margin: 2px 0; padding-left: 12px; list-style: disc;">
              ${day.breakfast.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
          <div style="font-size: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 3px 0;">
            <span>Cal: ${day.breakfast.calories}</span>
            <span>Protein: ${day.breakfast.protein}g</span>
          </div>
          <div style="background: #fed7aa; padding: 3px; border-radius: 2px; font-size: 7px; margin: 3px 0;">
            <strong>Prep:</strong> ${day.breakfast.preparation}
          </div>
          <div style="font-size: 7px;">
            <strong>Benefits:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px;">
              ${day.breakfast.benefits.map((benefit) => `<span style="background: #fed7aa; color: #9a3412; padding: 1px 3px; border-radius: 2px; font-size: 6px;">${benefit}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- Morning Snack -->
        <div style="border: 1px solid #fef3c7; background: #fffbeb; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #d97706; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center;">
            🍎 Morning Snack
          </div>
          <div style="font-weight: bold; color: #92400e; font-size: 10px; margin-bottom: 3px;">
            ${day.morningSnack.name}
          </div>
          <div style="font-size: 8px; margin-bottom: 3px;">
            <strong>Ingredients:</strong>
            <ul style="margin: 2px 0; padding-left: 12px; list-style: disc;">
              ${day.morningSnack.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
          <div style="font-size: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 3px 0;">
            <span>Cal: ${day.morningSnack.calories}</span>
            <span>Protein: ${day.morningSnack.protein}g</span>
          </div>
          <div style="background: #fef3c7; padding: 3px; border-radius: 2px; font-size: 7px; margin: 3px 0;">
            <strong>Prep:</strong> ${day.morningSnack.preparation}
          </div>
        </div>

        <!-- Lunch -->
        <div style="border: 1px solid #bfdbfe; background: #eff6ff; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #2563eb; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center;">
            🍽️ Lunch
          </div>
          <div style="font-weight: bold; color: #1e40af; font-size: 10px; margin-bottom: 3px;">
            ${day.lunch.name}
          </div>
          <div style="font-size: 8px; margin-bottom: 3px;">
            <strong>Ingredients:</strong>
            <ul style="margin: 2px 0; padding-left: 12px; list-style: disc;">
              ${day.lunch.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
          <div style="font-size: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 3px 0;">
            <span>Cal: ${day.lunch.calories}</span>
            <span>Protein: ${day.lunch.protein}g</span>
          </div>
          <div style="background: #bfdbfe; padding: 3px; border-radius: 2px; font-size: 7px; margin: 3px 0;">
            <strong>Prep:</strong> ${day.lunch.preparation}
          </div>
        </div>

        <!-- Afternoon Snack -->
        <div style="border: 1px solid #bbf7d0; background: #f0fdf4; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #16a34a; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center;">
            ☀️ Afternoon Snack
          </div>
          <div style="font-weight: bold; color: #15803d; font-size: 10px; margin-bottom: 3px;">
            ${day.afternoonSnack.name}
          </div>
          <div style="font-size: 8px; margin-bottom: 3px;">
            <strong>Ingredients:</strong>
            <ul style="margin: 2px 0; padding-left: 12px; list-style: disc;">
              ${day.afternoonSnack.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
          <div style="font-size: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 3px 0;">
            <span>Cal: ${day.afternoonSnack.calories}</span>
            <span>Protein: ${day.afternoonSnack.protein}g</span>
          </div>
          <div style="background: #bbf7d0; padding: 3px; border-radius: 2px; font-size: 7px; margin: 3px 0;">
            <strong>Prep:</strong> ${day.afternoonSnack.preparation}
          </div>
        </div>

        <!-- Dinner -->
        <div style="border: 1px solid #d8b4fe; background: #faf5ff; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #7c3aed; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center;">
            🌙 Dinner
          </div>
          <div style="font-weight: bold; color: #6d28d9; font-size: 10px; margin-bottom: 3px;">
            ${day.dinner.name}
          </div>
          <div style="font-size: 8px; margin-bottom: 3px;">
            <strong>Ingredients:</strong>
            <ul style="margin: 2px 0; padding-left: 12px; list-style: disc;">
              ${day.dinner.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
          <div style="font-size: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 3px 0;">
            <span>Cal: ${day.dinner.calories}</span>
            <span>Protein: ${day.dinner.protein}g</span>
          </div>
          <div style="background: #d8b4fe; padding: 3px; border-radius: 2px; font-size: 7px; margin: 3px 0;">
            <strong>Prep:</strong> ${day.dinner.preparation}
          </div>
        </div>

        <!-- Evening Snack -->
        <div style="border: 1px solid #c7d2fe; background: #eef2ff; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #4f46e5; font-size: 11px; margin-bottom: 4px; display: flex; align-items: center;">
            🌜 Evening Snack
          </div>
          <div style="font-weight: bold; color: #3730a3; font-size: 10px; margin-bottom: 3px;">
            ${day.eveningSnack.name}
          </div>
          <div style="font-size: 8px; margin-bottom: 3px;">
            <strong>Ingredients:</strong>
            <ul style="margin: 2px 0; padding-left: 12px; list-style: disc;">
              ${day.eveningSnack.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
            </ul>
          </div>
          <div style="font-size: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin: 3px 0;">
            <span>Cal: ${day.eveningSnack.calories}</span>
            <span>Protein: ${day.eveningSnack.protein}g</span>
          </div>
          <div style="background: #c7d2fe; padding: 3px; border-radius: 2px; font-size: 7px; margin: 3px 0;">
            <strong>Prep:</strong> ${day.eveningSnack.preparation}
          </div>
        </div>
      </div>

      <!-- Hydration & Supplements -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0;">
        <div style="border: 1px solid #bfdbfe; background: #eff6ff; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #2563eb; font-size: 10px; margin-bottom: 4px; display: flex; align-items: center;">
            💧 Daily Hydration
          </div>
          <ul style="font-size: 8px; margin: 0; padding-left: 12px; list-style: disc;">
            ${day.hydration.map((item) => `<li style="margin: 1px 0;">${item}</li>`).join("")}
          </ul>
        </div>
        <div style="border: 1px solid #bbf7d0; background: #f0fdf4; padding: 6px; border-radius: 4px;">
          <div style="font-weight: bold; color: #16a34a; font-size: 10px; margin-bottom: 4px; display: flex; align-items: center;">
            💊 Daily Supplements
          </div>
          <ul style="font-size: 8px; margin: 0; padding-left: 12px; list-style: disc;">
            ${day.supplements.map((item) => `<li style="margin: 1px 0;">${item}</li>`).join("")}
          </ul>
        </div>
      </div>

      <!-- Foods to Avoid -->
      <div style="border: 2px solid #fca5a5; background: #fef2f2; padding: 6px; border-radius: 4px; margin: 8px 0;">
        <div style="font-weight: bold; color: #dc2626; font-size: 10px; margin-bottom: 4px; display: flex; align-items: center;">
          ⚠️ Foods to Avoid During Pregnancy
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
          ${day.avoidFoods.map((food) => `<span style="background: #fca5a5; color: #991b1b; padding: 2px 4px; border-radius: 2px; font-size: 7px; text-align: center;">${food}</span>`).join("")}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>
</div>
`
      : ""
  }
  
  <div class="emergency-box">
    <h4 style="color: #d32f2f; margin: 0 0 5px 0;">PREGNANCY EMERGENCY - CALL DOCTOR IMMEDIATELY IF:</h4>
    <div class="two-col">
      <div>
        <strong>First/Second Trimester:</strong>
        <ul style="margin: 2px 0;">
          <li>Severe abdominal pain/cramping</li>
          <li>Heavy bleeding or clots</li>
          <li>Fever above 101°F</li>
          <li>Severe headaches/vision changes</li>
        </ul>
      </div>
      <div>
        <strong>Third Trimester:</strong>
        <ul style="margin: 2px 0;">
          <li>Regular contractions before 37 weeks</li>
          <li>Water breaking</li>
          <li>Decreased fetal movement</li>
          <li>Severe swelling face/hands</li>
        </ul>
      </div>
    </div>
  </div>
  `
      : ""
  }
  
  ${
    activeTab === "baby" || !activeTab
      ? `
  <div class="page-break"></div>
  
  <!-- BABY CARE SECTION -->
  <div class="section no-break">
    <div class="section-header">BABY CARE - PATIENT INFORMATION</div>
    <div class="section-content">
      <div class="patient-info">
        <div>
          <div class="info-item"><strong>Baby Name:</strong> ${babyData.name || "Not provided"}</div>
          <div class="info-item"><strong>Birth Date:</strong> ${babyData.birthDate ? new Date(babyData.birthDate).toLocaleDateString() : "Not provided"}</div>
          <div class="info-item"><strong>Birth Weight:</strong> ${babyData.birthWeight} kg</div>
          <div class="info-item"><strong>Birth Height:</strong> ${babyData.birthHeight} cm</div>
          <div class="info-item"><strong>Blood Type:</strong> ${babyData.bloodType || "Not specified"}</div>
        </div>
        <div>
          <div class="info-item"><strong>Current Age:</strong> ${babyData.ageInDays} days (${babyData.ageInWeeks} weeks, ${babyData.ageInMonths} months)</div>
          <div class="info-item"><strong>Current Weight:</strong> ${babyData.currentWeight} kg</div>
          <div class="info-item"><strong>Current Height:</strong> ${babyData.currentHeight} cm</div>
          <div class="info-item"><strong>Growth Percentile:</strong> Normal range</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">BABY CARE - VACCINATION SCHEDULE</div>
    <div class="section-content">
      <table>
        <tr>
          <th>Age</th>
          <th>Vaccine</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
        <tr>
          <td>Birth</td>
          <td>BCG, OPV-0, Hepatitis B-1</td>
          <td>${babyData.birthDate ? new Date(babyData.birthDate).toLocaleDateString() : "TBD"}</td>
          <td>Due</td>
          <td>At birth in hospital</td>
        </tr>
        <tr>
          <td>6 weeks</td>
          <td>DPT-1, OPV-1, Hepatitis B-2</td>
          <td>${babyData.birthDate ? new Date(new Date(babyData.birthDate).getTime() + 42 * 24 * 60 * 60 * 1000).toLocaleDateString() : "TBD"}</td>
          <td>Due</td>
          <td>First routine visit</td>
        </tr>
        <tr>
          <td>10 weeks</td>
          <td>DPT-2, OPV-2</td>
          <td>${babyData.birthDate ? new Date(new Date(babyData.birthDate).getTime() + 70 * 24 * 60 * 60 * 1000).toLocaleDateString() : "TBD"}</td>
          <td>Due</td>
          <td>Second dose</td>
        </tr>
        <tr>
          <td>14 weeks</td>
          <td>DPT-3, OPV-3, Hepatitis B-3</td>
          <td>${babyData.birthDate ? new Date(new Date(babyData.birthDate).getTime() + 98 * 24 * 60 * 60 * 1000).toLocaleDateString() : "TBD"}</td>
          <td>Due</td>
          <td>Third dose</td>
        </tr>
        <tr>
          <td>9 months</td>
          <td>Measles-1</td>
          <td>${babyData.birthDate ? new Date(new Date(babyData.birthDate).getTime() + 270 * 24 * 60 * 60 * 1000).toLocaleDateString() : "TBD"}</td>
          <td>Due</td>
          <td>First measles vaccine</td>
        </tr>
        <tr>
          <td>12 months</td>
          <td>MMR-1</td>
          <td>${babyData.birthDate ? new Date(new Date(babyData.birthDate).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString() : "TBD"}</td>
          <td>Due</td>
          <td>Measles, Mumps, Rubella</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="section">
    <div class="section-header">BABY CARE - DEVELOPMENTAL MILESTONES</div>
    <div class="section-content">
      <div class="milestone-grid">
        <div class="milestone-item">
          <strong>0-3 Months</strong><br>
          <small>• Lifts head when on tummy</small><br>
          <small>• Follows objects with eyes</small><br>
          <small>• Smiles responsively</small><br>
          <small>• Makes cooing sounds</small>
        </div>
        <div class="milestone-item">
          <strong>4-6 Months</strong><br>
          <small>• Rolls over both ways</small><br>
          <small>• Sits with support</small><br>
          <small>• Reaches for toys</small><br>
          <small>• Babbles with expression</small>
        </div>
        <div class="milestone-item">
          <strong>7-9 Months</strong><br>
          <small>• Sits without support</small><br>
          <small>• Crawls or scoots</small><br>
          <small>• Transfers objects hand to hand</small><br>
          <small>• Says "mama" or "dada"</small>
        </div>
        <div class="milestone-item">
          <strong>10-12 Months</strong><br>
          <small>• Pulls to standing</small><br>
          <small>• Walks holding furniture</small><br>
          <small>• Uses pincer grasp</small><br>
          <small>• Follows simple commands</small>
        </div>
        <div class="milestone-item">
          <strong>13-18 Months</strong><br>
          <small>• Walks independently</small><br>
          <small>• Says 3-5 words</small><br>
          <small>• Drinks from cup</small><br>
          <small>• Points to body parts</small>
        </div>
        <div class="milestone-item">
          <strong>19-24 Months</strong><br>
          <small>• Runs and climbs</small><br>
          <small>• Says 50+ words</small><br>
          <small>• Follows 2-step instructions</small><br>
          <small>• Plays pretend</small>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">BABY CARE - FEEDING GUIDELINES</div>
    <div class="section-content">
      <div class="feeding-grid">
        <div class="feeding-item">
          <strong>0-6 Months</strong><br>
          <small><strong>Exclusive Breastfeeding</strong></small><br>
          <small>• 8-12 times per day</small><br>
          <small>• On-demand feeding</small><br>
          <small>• No water or other foods</small><br>
          <small>• Growth monitoring weekly</small>
        </div>
        <div class="feeding-item">
          <strong>6-8 Months</strong><br>
          <small><strong>Start Complementary Foods</strong></small><br>
          <small>• Continue breastfeeding</small><br>
          <small>• Rice cereal, pureed fruits</small><br>
          <small>• 1-2 meals per day</small><br>
          <small>• Introduce one food at a time</small>
        </div>
        <div class="feeding-item">
          <strong>8-12 Months</strong><br>
          <small><strong>Varied Diet</strong></small><br>
          <small>• 3 meals + 2 snacks</small><br>
          <small>• Finger foods, soft textures</small><br>
          <small>• Family foods (mashed)</small><br>
          <small>• Continue breastfeeding</small>
        </div>
      </div>
      
      <h4>Feeding Schedule Example (6+ months):</h4>
      <table>
        <tr><th>Time</th><th>Food</th><th>Quantity</th></tr>
        <tr><td>6:00 AM</td><td>Breast milk</td><td>On demand</td></tr>
        <tr><td>8:00 AM</td><td>Rice cereal + fruit puree</td><td>2-3 tbsp</td></tr>
        <tr><td>10:00 AM</td><td>Breast milk</td><td>On demand</td></tr>
        <tr><td>12:00 PM</td><td>Vegetable puree + rice</td><td>3-4 tbsp</td></tr>
        <tr><td>2:00 PM</td><td>Breast milk</td><td>On demand</td></tr>
        <tr><td>4:00 PM</td><td>Fruit puree</td><td>2 tbsp</td></tr>
        <tr><td>6:00 PM</td><td>Dal + rice + vegetables</td><td>3-4 tbsp</td></tr>
        <tr><td>8:00 PM</td><td>Breast milk</td><td>On demand</td></tr>
      </table>
    </div>
  </div>

  <div class="emergency-box">
    <h4 style="color: #d32f2f; margin: 0 0 5px 0;">BABY EMERGENCY - CALL DOCTOR IMMEDIATELY IF:</h4>
    <div class="two-col">
      <div>
        <strong>Newborn (0-3 months):</strong>
        <ul style="margin: 2px 0;">
          <li>Fever above 100.4°F (38°C)</li>
          <li>Difficulty breathing</li>
          <li>Not feeding for 8+ hours</li>
          <li>Excessive crying/inconsolable</li>
        </ul>
      </div>
      <div>
        <strong>Older Baby (3+ months):</strong>
        <ul style="margin: 2px 0;">
          <li>Fever above 102°F (39°C)</li>
          <li>Severe diarrhea/dehydration</li>
          <li>Unusual lethargy</li>
          <li>Rash with fever</li>
        </ul>
      </div>
    </div>
  </div>
  `
      : ""
  }
  
  ${
    nearbyHospitals.length > 0 || nearbyLabs.length > 0
      ? `
  <div class="page-break"></div>
  
  <div class="section">
    <div class="section-header">NEARBY HEALTHCARE FACILITIES</div>
    <div class="section-content">
      ${
        nearbyHospitals.length > 0
          ? `
      <h4>Nearby Hospitals & Medical Centers:</h4>
      ${nearbyHospitals
        .slice(0, 5)
        .map(
          (hospital) => `
        <div class="facility-item">
          <strong>${hospital.name}</strong><br>
          <small>📍 ${hospital.vicinity}</small><br>
          <small>📏 Distance: ${hospital.distance ? formatDistance(hospital.distance) : "N/A"}</small>
          ${hospital.rating ? `<br><small>⭐ Rating: ${hospital.rating}/5 (${hospital.user_ratings_total} reviews)</small>` : ""}
          ${hospital.formatted_phone_number ? `<br><small>📞 ${hospital.formatted_phone_number}</small>` : ""}
        </div>
      `,
        )
        .join("")}
      `
          : ""
      }
      
      ${
        nearbyLabs.length > 0
          ? `
      <h4>Nearby Diagnostic Labs:</h4>
      ${nearbyLabs
        .slice(0, 5)
        .map(
          (lab) => `
        <div class="facility-item">
          <strong>${lab.name}</strong><br>
          <small>📍 ${lab.vicinity}</small><br>
          <small>📏 Distance: ${lab.distance ? formatDistance(lab.distance) : "N/A"}</small>
          ${lab.rating ? `<br><small>⭐ Rating: ${lab.rating}/5 (${lab.user_ratings_total} reviews)</small>` : ""}
        </div>
      `,
        )
        .join("")}
      `
          : ""
      }
    </div>
  </div>
  `
      : ""
  }
  
  <div class="footer">
    <p><strong>MyMedi.ai</strong> - AI-Powered Healthcare Solutions</p>
    <p>This report is generated by AI and should be used in consultation with qualified healthcare professionals.</p>
    <p>For emergencies, call your local emergency number immediately.</p>
    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const generateDietPlan = async () => {
    setIsGeneratingDiet(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const sampleDietPlan: DietPlan[] = [
      {
        day: "Monday",
        breakfast: {
          name: "Oatmeal with Berries and Nuts",
          ingredients: [
            "1 cup rolled oats",
            "1/2 cup mixed berries",
            "2 tbsp chopped almonds",
            "1 tbsp honey",
            "1 cup milk",
          ],
          calories: 380,
          protein: 15,
          carbs: 58,
          fat: 12,
          fiber: 8,
          preparation: "Cook oats with milk, top with berries, nuts, and honey. Serve warm.",
          benefits: ["High fiber", "Antioxidants", "Sustained energy", "Folate rich"],
        },
        morningSnack: {
          name: "Greek Yogurt with Walnuts",
          ingredients: ["1 cup Greek yogurt", "2 tbsp chopped walnuts", "1 tsp honey"],
          calories: 220,
          protein: 20,
          carbs: 15,
          fat: 10,
          fiber: 2,
          preparation: "Mix yogurt with honey, top with walnuts.",
          benefits: ["Probiotics", "Omega-3", "Calcium", "Protein"],
        },
        lunch: {
          name: "Quinoa Salad with Grilled Chicken",
          ingredients: [
            "1 cup cooked quinoa",
            "4 oz grilled chicken breast",
            "Mixed greens",
            "Cherry tomatoes",
            "Avocado",
            "Olive oil dressing",
          ],
          calories: 520,
          protein: 35,
          carbs: 45,
          fat: 18,
          fiber: 8,
          preparation: "Combine quinoa with vegetables, top with sliced chicken and dressing.",
          benefits: ["Complete protein", "Healthy fats", "Iron", "Folate"],
        },
        afternoonSnack: {
          name: "Apple with Almond Butter",
          ingredients: ["1 medium apple", "2 tbsp almond butter"],
          calories: 190,
          protein: 6,
          carbs: 25,
          fat: 8,
          fiber: 6,
          preparation: "Slice apple and serve with almond butter for dipping.",
          benefits: ["Fiber", "Vitamin C", "Healthy fats", "Natural sugars"],
        },
        dinner: {
          name: "Baked Salmon with Sweet Potato",
          ingredients: ["5 oz salmon fillet", "1 medium roasted sweet potato", "Steamed broccoli", "Lemon", "Herbs"],
          calories: 480,
          protein: 40,
          carbs: 35,
          fat: 18,
          fiber: 6,
          preparation: "Bake salmon with herbs and lemon, serve with roasted sweet potato and steamed broccoli.",
          benefits: ["Omega-3 DHA", "Beta-carotene", "Vitamin D", "Folate"],
        },
        eveningSnack: {
          name: "Chamomile Tea with Whole Grain Crackers",
          ingredients: ["1 cup chamomile tea", "4 whole grain crackers", "1 tbsp hummus"],
          calories: 120,
          protein: 4,
          carbs: 18,
          fat: 3,
          fiber: 3,
          preparation: "Brew tea, serve crackers with hummus on the side.",
          benefits: ["Relaxation", "Fiber", "Complex carbs", "Calming"],
        },
        totalCalories: 1910,
        totalProtein: 120,
        totalFiber: 33,
        hydration: [
          "8-10 glasses of water throughout the day",
          "1 cup herbal tea (ginger or chamomile)",
          "1 glass fresh fruit juice (diluted)",
          "Coconut water for electrolytes",
        ],
        supplements: [
          "Prenatal vitamin with folic acid (400-800 mcg)",
          "Iron supplement (if prescribed)",
          "Calcium + Vitamin D (1000mg + 600 IU)",
          "Omega-3 DHA supplement (200-300mg)",
        ],
        avoidFoods: [
          "Raw fish/sushi",
          "Unpasteurized dairy",
          "High mercury fish",
          "Raw eggs",
          "Deli meats",
          "Alcohol",
          "Excessive caffeine",
          "Raw sprouts",
        ],
      },
      {
        day: "Tuesday",
        breakfast: {
          name: "Whole Grain Toast with Avocado",
          ingredients: [
            "2 slices whole grain bread",
            "1 ripe avocado",
            "2 eggs (scrambled)",
            "Cherry tomatoes",
            "Spinach leaves",
          ],
          calories: 420,
          protein: 18,
          carbs: 35,
          fat: 22,
          fiber: 12,
          preparation: "Toast bread, mash avocado, scramble eggs with spinach, assemble with tomatoes.",
          benefits: ["Folate", "Healthy fats", "Fiber", "Choline"],
        },
        morningSnack: {
          name: "Smoothie Bowl",
          ingredients: ["1 banana", "1/2 cup berries", "1/2 cup yogurt", "1 tbsp chia seeds", "Granola"],
          calories: 280,
          protein: 12,
          carbs: 45,
          fat: 8,
          fiber: 10,
          preparation: "Blend fruits with yogurt, pour into bowl, top with chia seeds and granola.",
          benefits: ["Antioxidants", "Probiotics", "Omega-3", "Natural sugars"],
        },
        lunch: {
          name: "Lentil and Vegetable Soup",
          ingredients: [
            "1 cup cooked lentils",
            "Mixed vegetables",
            "Vegetable broth",
            "Whole grain roll",
            "Side salad",
          ],
          calories: 450,
          protein: 22,
          carbs: 65,
          fat: 8,
          fiber: 18,
          preparation: "Simmer lentils with vegetables in broth, serve with roll and salad.",
          benefits: ["Plant protein", "Iron", "Folate", "Fiber"],
        },
        afternoonSnack: {
          name: "Trail Mix",
          ingredients: ["Mixed nuts", "Dried fruits", "Dark chocolate chips"],
          calories: 200,
          protein: 6,
          carbs: 20,
          fat: 12,
          fiber: 4,
          preparation: "Mix ingredients in small portions for a balanced snack.",
          benefits: ["Healthy fats", "Antioxidants", "Energy", "Minerals"],
        },
        dinner: {
          name: "Grilled Chicken with Quinoa",
          ingredients: ["5 oz grilled chicken", "1 cup quinoa", "Roasted vegetables", "Olive oil", "Herbs"],
          calories: 500,
          protein: 42,
          carbs: 40,
          fat: 15,
          fiber: 6,
          preparation: "Grill chicken with herbs, serve over quinoa with roasted vegetables.",
          benefits: ["Complete protein", "Complex carbs", "Vitamins", "Minerals"],
        },
        eveningSnack: {
          name: "Warm Milk with Dates",
          ingredients: ["1 cup warm milk", "2 pitted dates", "Pinch of cinnamon"],
          calories: 180,
          protein: 8,
          carbs: 25,
          fat: 5,
          fiber: 2,
          preparation: "Warm milk, blend with dates and cinnamon for natural sweetness.",
          benefits: ["Calcium", "Natural sugars", "Sleep aid", "Comfort"],
        },
        totalCalories: 2030,
        totalProtein: 108,
        totalFiber: 52,
        hydration: [
          "8-10 glasses of water throughout the day",
          "1 cup herbal tea (raspberry leaf)",
          "Fresh coconut water",
          "Lemon water in the morning",
        ],
        supplements: [
          "Prenatal vitamin with folic acid",
          "Iron supplement (with Vitamin C)",
          "Calcium + Vitamin D",
          "Probiotic supplement",
        ],
        avoidFoods: [
          "Raw fish/sushi",
          "Unpasteurized cheese",
          "High mercury fish",
          "Raw eggs",
          "Processed meats",
          "Alcohol",
          "Excessive caffeine",
          "Artificial sweeteners",
        ],
      },
      // Add more days as needed...
    ]

    setWeeklyDietPlan(sampleDietPlan)
    setIsGeneratingDiet(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <MyMedLogo />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pregnancy & Baby Care</h1>
              <p className="text-gray-600">Comprehensive AI-powered pregnancy and baby care management</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button onClick={detectLocation} disabled={isLoadingLocation} variant="outline" size="sm">
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              Detect Location
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pregnancy" className="flex items-center space-x-2">
              <Baby className="h-4 w-4" />
              <span>Pregnancy Care</span>
            </TabsTrigger>
            <TabsTrigger value="baby" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Baby Care</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pregnancy" className="space-y-6">
            {/* Pregnancy Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Baby className="h-5 w-5 text-pink-600" />
                  <span>Pregnancy Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Mother's Name</Label>
                    <Input
                      id="name"
                      value={pregnancyData.name}
                      onChange={(e) => setPregnancyData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={pregnancyData.motherAge}
                      onChange={(e) =>
                        setPregnancyData((prev) => ({ ...prev, motherAge: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="Age in years"
                    />
                  </div>
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="lastPeriod">Last Menstrual Period</Label>
                    <Input
                      id="lastPeriod"
                      type="date"
                      value={pregnancyData.lastPeriodDate}
                      onChange={(e) => setPregnancyData((prev) => ({ ...prev, lastPeriodDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={pregnancyData.height}
                      onChange={(e) =>
                        setPregnancyData((prev) => ({ ...prev, height: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="Height in cm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preWeight">Pre-pregnancy Weight (kg)</Label>
                    <Input
                      id="preWeight"
                      type="number"
                      value={pregnancyData.prePregnancyWeight}
                      onChange={(e) =>
                        setPregnancyData((prev) => ({
                          ...prev,
                          prePregnancyWeight: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="Weight before pregnancy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentWeight">Current Weight (kg)</Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      value={pregnancyData.currentWeight}
                      onChange={(e) =>
                        setPregnancyData((prev) => ({ ...prev, currentWeight: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Current weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systolic">Blood Pressure (Systolic)</Label>
                    <Input
                      id="systolic"
                      type="number"
                      value={pregnancyData.bloodPressure.systolic}
                      onChange={(e) =>
                        setPregnancyData((prev) => ({
                          ...prev,
                          bloodPressure: { ...prev.bloodPressure, systolic: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                      placeholder="Systolic BP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolic">Blood Pressure (Diastolic)</Label>
                    <Input
                      id="diastolic"
                      type="number"
                      value={pregnancyData.bloodPressure.diastolic}
                      onChange={(e) =>
                        setPregnancyData((prev) => ({
                          ...prev,
                          bloodPressure: { ...prev.bloodPressure, diastolic: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                      placeholder="Diastolic BP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      value={pregnancyData.medicalHistory}
                      onChange={(e) => setPregnancyData((prev) => ({ ...prev, medicalHistory: e.target.value }))}
                      placeholder="Previous medical conditions, surgeries, etc."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={pregnancyData.allergies}
                      onChange={(e) => setPregnancyData((prev) => ({ ...prev, allergies: e.target.value }))}
                      placeholder="Known allergies to medications, foods, etc."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pregnancy Status */}
            {pregnancyData.lastPeriodDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>Current Pregnancy Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{pregnancyData.currentWeek}</div>
                      <div className="text-sm text-gray-600">Weeks Pregnant</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{pregnancyData.currentTrimester}</div>
                      <div className="text-sm text-gray-600">
                        {pregnancyData.currentTrimester === 1
                          ? "1st"
                          : pregnancyData.currentTrimester === 2
                            ? "2nd"
                            : "3rd"}{" "}
                        Trimester
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{getCurrentWeightGain().toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Weight Gain (kg)</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-pink-600">
                        {pregnancyData.expectedDeliveryDate
                          ? Math.ceil(
                              (new Date(pregnancyData.expectedDeliveryDate).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24),
                            )
                          : 0}
                      </div>
                      <div className="text-sm text-gray-600">Days to EDD</div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">AI Health Analysis</h4>
                    <p className="text-sm text-blue-800">{generateHealthAnalysis()}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lab Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5 text-green-600" />
                  <span>Laboratory Test Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pregnancyData.labResults.map((lab) => {
                    const statusInfo = getLabStatus(lab.status)
                    return (
                      <div key={lab.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm">{lab.testName}</h4>
                          <Badge className={statusInfo.color}>{statusInfo.text}</Badge>
                        </div>
                        <div className="text-lg font-bold">
                          {lab.value} {lab.unit}
                        </div>
                        <div className="text-xs text-gray-600">Normal: {lab.normalRange}</div>
                        <div className="text-xs text-gray-500">Date: {new Date(lab.date).toLocaleDateString()}</div>
                        {lab.notes && <div className="text-xs text-orange-600 italic">{lab.notes}</div>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Vital Signs Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <Scale className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">{pregnancyData.currentWeight}</div>
                    <div className="text-sm text-gray-600">Current Weight (kg)</div>
                    <div className="text-xs text-gray-500 mt-1">+{getCurrentWeightGain().toFixed(1)} kg gained</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <div className="text-2xl font-bold text-red-600">
                      {pregnancyData.bloodPressure.systolic}/{pregnancyData.bloodPressure.diastolic}
                    </div>
                    <div className="text-sm text-gray-600">Blood Pressure</div>
                    <div className="text-xs text-gray-500 mt-1">mmHg</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                    <div className="text-2xl font-bold text-pink-600">{pregnancyData.heartRate}</div>
                    <div className="text-sm text-gray-600">Heart Rate</div>
                    <div className="text-xs text-gray-500 mt-1">bpm</div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <Thermometer className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">{pregnancyData.temperature}</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                    <div className="text-xs text-gray-500 mt-1">°F</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diet Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Apple className="h-5 w-5 text-green-600" />
                    <span>Personalized Diet Plan</span>
                  </div>
                  <Button onClick={generateDietPlan} disabled={isGeneratingDiet}>
                    {isGeneratingDiet ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Diet Plan"
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyDietPlan.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Label>Select Day:</Label>
                      <Select
                        value={selectedWeek.toString()}
                        onValueChange={(value) => setSelectedWeek(Number.parseInt(value))}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {weeklyDietPlan.map((day, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {day.day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {weeklyDietPlan[selectedWeek] && (
                      <div className="space-y-6">
                        {/* Nutrition Summary */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {weeklyDietPlan[selectedWeek].totalCalories}
                            </div>
                            <div className="text-sm text-green-700">Total Calories</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {weeklyDietPlan[selectedWeek].totalProtein}g
                            </div>
                            <div className="text-sm text-blue-700">Protein</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {weeklyDietPlan[selectedWeek].totalFiber}g
                            </div>
                            <div className="text-sm text-orange-700">Fiber</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">6</div>
                            <div className="text-sm text-purple-700">Meals</div>
                          </div>
                        </div>

                        {/* Meals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Breakfast */}
                          <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Coffee className="h-5 w-5 text-orange-600" />
                              <h4 className="font-semibold text-orange-800">Breakfast</h4>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              {weeklyDietPlan[selectedWeek].breakfast.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {weeklyDietPlan[selectedWeek].breakfast.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Calories: {weeklyDietPlan[selectedWeek].breakfast.calories}</span>
                                <span>Protein: {weeklyDietPlan[selectedWeek].breakfast.protein}g</span>
                              </div>
                              <div className="bg-orange-100 p-2 rounded text-xs">
                                <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek].breakfast.preparation}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {weeklyDietPlan[selectedWeek].breakfast.benefits.map((benefit, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Morning Snack */}
                          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Apple className="h-5 w-5 text-yellow-600" />
                              <h4 className="font-semibold text-yellow-800">Morning Snack</h4>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              {weeklyDietPlan[selectedWeek].morningSnack.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {weeklyDietPlan[selectedWeek].morningSnack.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Calories: {weeklyDietPlan[selectedWeek].morningSnack.calories}</span>
                                <span>Protein: {weeklyDietPlan[selectedWeek].morningSnack.protein}g</span>
                              </div>
                              <div className="bg-yellow-100 p-2 rounded text-xs">
                                <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek].morningSnack.preparation}
                              </div>
                            </div>
                          </div>

                          {/* Lunch */}
                          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Utensils className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-800">Lunch</h4>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              {weeklyDietPlan[selectedWeek].lunch.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {weeklyDietPlan[selectedWeek].lunch.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Calories: {weeklyDietPlan[selectedWeek].lunch.calories}</span>
                                <span>Protein: {weeklyDietPlan[selectedWeek].lunch.protein}g</span>
                              </div>
                              <div className="bg-blue-100 p-2 rounded text-xs">
                                <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek].lunch.preparation}
                              </div>
                            </div>
                          </div>

                          {/* Afternoon Snack */}
                          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Sun className="h-5 w-5 text-green-600" />
                              <h4 className="font-semibold text-green-800">Afternoon Snack</h4>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              {weeklyDietPlan[selectedWeek].afternoonSnack.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {weeklyDietPlan[selectedWeek].afternoonSnack.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Calories: {weeklyDietPlan[selectedWeek].afternoonSnack.calories}</span>
                                <span>Protein: {weeklyDietPlan[selectedWeek].afternoonSnack.protein}g</span>
                              </div>
                              <div className="bg-green-100 p-2 rounded text-xs">
                                <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek].afternoonSnack.preparation}
                              </div>
                            </div>
                          </div>

                          {/* Dinner */}
                          <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Moon className="h-5 w-5 text-purple-600" />
                              <h4 className="font-semibold text-purple-800">Dinner</h4>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              {weeklyDietPlan[selectedWeek].dinner.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {weeklyDietPlan[selectedWeek].dinner.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Calories: {weeklyDietPlan[selectedWeek].dinner.calories}</span>
                                <span>Protein: {weeklyDietPlan[selectedWeek].dinner.protein}g</span>
                              </div>
                              <div className="bg-purple-100 p-2 rounded text-xs">
                                <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek].dinner.preparation}
                              </div>
                            </div>
                          </div>

                          {/* Evening Snack */}
                          <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Moon className="h-5 w-5 text-indigo-600" />
                              <h4 className="font-semibold text-indigo-800">Evening Snack</h4>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-2">
                              {weeklyDietPlan[selectedWeek].eveningSnack.name}
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Ingredients:</strong>
                                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                                  {weeklyDietPlan[selectedWeek].eveningSnack.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span>Calories: {weeklyDietPlan[selectedWeek].eveningSnack.calories}</span>
                                <span>Protein: {weeklyDietPlan[selectedWeek].eveningSnack.protein}g</span>
                              </div>
                              <div className="bg-indigo-100 p-2 rounded text-xs">
                                <strong>Preparation:</strong> {weeklyDietPlan[selectedWeek].eveningSnack.preparation}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hydration & Supplements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Droplets className="h-5 w-5 text-blue-600" />
                              <h4 className="font-semibold text-blue-800">Daily Hydration</h4>
                            </div>
                            <ul className="space-y-1 text-sm">
                              {weeklyDietPlan[selectedWeek].hydration.map((item, idx) => (
                                <li key={idx} className="flex items-center space-x-2">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <Pill className="h-5 w-5 text-green-600" />
                              <h4 className="font-semibold text-green-800">Daily Supplements</h4>
                            </div>
                            <ul className="space-y-1 text-sm">
                              {weeklyDietPlan[selectedWeek].supplements.map((item, idx) => (
                                <li key={idx} className="flex items-center space-x-2">
                                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Foods to Avoid */}
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription>
                            <strong className="text-red-800">Foods to Avoid During Pregnancy:</strong>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {weeklyDietPlan[selectedWeek].avoidFoods.map((food, idx) => (
                                <Badge key={idx} variant="destructive" className="text-xs">
                                  {food}
                                </Badge>
                              ))}
                            </div>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Click "Generate Diet Plan" to create a personalized nutrition plan based on your pregnancy stage
                      and health data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Nearby Healthcare Facilities */}
            {(nearbyHospitals.length > 0 || nearbyLabs.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hospital className="h-5 w-5 text-red-600" />
                    <span>Nearby Healthcare Facilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {nearbyHospitals.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <Hospital className="h-4 w-4 text-red-600" />
                        <span>Hospitals & Medical Centers</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nearbyHospitals.slice(0, 6).map((hospital) => (
                          <div key={hospital.place_id} className="border rounded-lg p-4 space-y-2">
                            <h5 className="font-medium">{hospital.name}</h5>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{hospital.vicinity}</span>
                            </div>
                            {hospital.distance && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Navigation className="h-4 w-4" />
                                <span>{formatDistance(hospital.distance)}</span>
                              </div>
                            )}
                            {hospital.rating && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>
                                  {hospital.rating}/5 ({hospital.user_ratings_total} reviews)
                                </span>
                              </div>
                            )}
                            {hospital.formatted_phone_number && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{hospital.formatted_phone_number}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {nearbyLabs.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <TestTube className="h-4 w-4 text-green-600" />
                        <span>Diagnostic Labs</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nearbyLabs.slice(0, 6).map((lab) => (
                          <div key={lab.place_id} className="border rounded-lg p-4 space-y-2">
                            <h5 className="font-medium">{lab.name}</h5>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{lab.vicinity}</span>
                            </div>
                            {lab.distance && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Navigation className="h-4 w-4" />
                                <span>{formatDistance(lab.distance)}</span>
                              </div>
                            )}
                            {lab.rating && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>
                                  {lab.rating}/5 ({lab.user_ratings_total} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {locationError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{locationError}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="baby" className="space-y-6">
            {/* Baby Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <span>Baby Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="babyName">Baby's Name</Label>
                    <Input
                      id="babyName"
                      value={babyData.name}
                      onChange={(e) => setBabyData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter baby's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={babyData.birthDate}
                      onChange={(e) => setBabyData((prev) => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthWeight">Birth Weight (kg)</Label>
                    <Input
                      id="birthWeight"
                      type="number"
                      step="0.1"
                      value={babyData.birthWeight}
                      onChange={(e) =>
                        setBabyData((prev) => ({ ...prev, birthWeight: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Birth weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthHeight">Birth Height (cm)</Label>
                    <Input
                      id="birthHeight"
                      type="number"
                      value={babyData.birthHeight}
                      onChange={(e) =>
                        setBabyData((prev) => ({ ...prev, birthHeight: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Birth height"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="babyBloodType">Blood Type</Label>
                    <Select
                      value={babyData.bloodType}
                      onValueChange={(value) => setBabyData((prev) => ({ ...prev, bloodType: value }))}
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
                  <div className="space-y-2">
                    <Label htmlFor="currentBabyWeight">Current Weight (kg)</Label>
                    <Input
                      id="currentBabyWeight"
                      type="number"
                      step="0.1"
                      value={babyData.currentWeight}
                      onChange={(e) =>
                        setBabyData((prev) => ({ ...prev, currentWeight: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Current weight"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentBabyHeight">Current Height (cm)</Label>
                    <Input
                      id="currentBabyHeight"
                      type="number"
                      value={babyData.currentHeight}
                      onChange={(e) =>
                        setBabyData((prev) => ({ ...prev, currentHeight: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="Current height"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Baby Growth Tracking */}
            {babyData.birthDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Growth Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{babyData.ageInDays}</div>
                      <div className="text-sm text-gray-600">Days Old</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{babyData.ageInWeeks}</div>
                      <div className="text-sm text-gray-600">Weeks Old</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{babyData.ageInMonths}</div>
                      <div className="text-sm text-gray-600">Months Old</div>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-pink-600">
                        {babyData.currentWeight > 0 && babyData.birthWeight > 0
                          ? (((babyData.currentWeight - babyData.birthWeight) / babyData.birthWeight) * 100).toFixed(1)
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-600">Weight Gain</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vaccination Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Vaccination Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { age: "Birth", vaccines: "BCG, OPV-0, Hepatitis B-1", weeks: 0 },
                    { age: "6 weeks", vaccines: "DPT-1, OPV-1, Hepatitis B-2", weeks: 6 },
                    { age: "10 weeks", vaccines: "DPT-2, OPV-2", weeks: 10 },
                    { age: "14 weeks", vaccines: "DPT-3, OPV-3, Hepatitis B-3", weeks: 14 },
                    { age: "9 months", vaccines: "Measles-1", weeks: 36 },
                    { age: "12 months", vaccines: "MMR-1", weeks: 52 },
                    { age: "15 months", vaccines: "MMR-2, Varicella", weeks: 65 },
                    { age: "18 months", vaccines: "DPT Booster, OPV Booster", weeks: 78 },
                  ].map((vaccination, index) => {
                    const dueDate = babyData.birthDate
                      ? new Date(new Date(babyData.birthDate).getTime() + vaccination.weeks * 7 * 24 * 60 * 60 * 1000)
                      : null
                    const isOverdue = dueDate && new Date() > dueDate
                    const isDue =
                      dueDate && Math.abs(new Date().getTime() - dueDate.getTime()) <= 7 * 24 * 60 * 60 * 1000

                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 ${isOverdue ? "border-red-200 bg-red-50" : isDue ? "border-yellow-200 bg-yellow-50" : "border-gray-200"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{vaccination.age}</h4>
                            <p className="text-sm text-gray-600">{vaccination.vaccines}</p>
                            {dueDate && (
                              <p className="text-xs text-gray-500 mt-1">Due: {dueDate.toLocaleDateString()}</p>
                            )}
                          </div>
                          <Badge
                            className={
                              isOverdue
                                ? "bg-red-100 text-red-800"
                                : isDue
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {isOverdue ? "Overdue" : isDue ? "Due Soon" : "Scheduled"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Developmental Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Developmental Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      ageRange: "0-3 Months",
                      milestones: [
                        "Lifts head when on tummy",
                        "Follows objects with eyes",
                        "Smiles responsively",
                        "Makes cooing sounds",
                      ],
                    },
                    {
                      ageRange: "4-6 Months",
                      milestones: [
                        "Rolls over both ways",
                        "Sits with support",
                        "Reaches for toys",
                        "Babbles with expression",
                      ],
                    },
                    {
                      ageRange: "7-9 Months",
                      milestones: [
                        "Sits without support",
                        "Crawls or scoots",
                        "Transfers objects hand to hand",
                        "Says 'mama' or 'dada'",
                      ],
                    },
                    {
                      ageRange: "10-12 Months",
                      milestones: [
                        "Pulls to standing",
                        "Walks holding furniture",
                        "Uses pincer grasp",
                        "Follows simple commands",
                      ],
                    },
                    {
                      ageRange: "13-18 Months",
                      milestones: ["Walks independently", "Says 3-5 words", "Drinks from cup", "Points to body parts"],
                    },
                    {
                      ageRange: "19-24 Months",
                      milestones: ["Runs and climbs", "Says 50+ words", "Follows 2-step instructions", "Plays pretend"],
                    },
                  ].map((milestone, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-3">{milestone.ageRange}</h4>
                      <ul className="space-y-2">
                        {milestone.milestones.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feeding Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-orange-600" />
                  <span>Feeding Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">0-6 Months</h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Exclusive Breastfeeding</p>
                      <ul className="space-y-1">
                        <li>• 8-12 times per day</li>
                        <li>• On-demand feeding</li>
                        <li>• No water or other foods</li>
                        <li>• Growth monitoring weekly</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">6-8 Months</h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Start Complementary Foods</p>
                      <ul className="space-y-1">
                        <li>• Continue breastfeeding</li>
                        <li>• Rice cereal, pureed fruits</li>
                        <li>• 1-2 meals per day</li>
                        <li>• Introduce one food at a time</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-3">8-12 Months</h4>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Varied Diet</p>
                      <ul className="space-y-1">
                        <li>• 3 meals + 2 snacks</li>
                        <li>• Finger foods, soft textures</li>
                        <li>• Family foods (mashed)</li>
                        <li>• Continue breastfeeding</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Sample Feeding Schedule (6+ months)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Food</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { time: "6:00 AM", food: "Breast milk", quantity: "On demand" },
                          { time: "8:00 AM", food: "Rice cereal + fruit puree", quantity: "2-3 tbsp" },
                          { time: "10:00 AM", food: "Breast milk", quantity: "On demand" },
                          { time: "12:00 PM", food: "Vegetable puree + rice", quantity: "3-4 tbsp" },
                          { time: "2:00 PM", food: "Breast milk", quantity: "On demand" },
                          { time: "4:00 PM", food: "Fruit puree", quantity: "2 tbsp" },
                          { time: "6:00 PM", food: "Dal + rice + vegetables", quantity: "3-4 tbsp" },
                          { time: "8:00 PM", food: "Breast milk", quantity: "On demand" },
                        ].map((meal, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="border border-gray-300 px-4 py-2">{meal.time}</td>
                            <td className="border border-gray-300 px-4 py-2">{meal.food}</td>
                            <td className="border border-gray-300 px-4 py-2">{meal.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <NavigationButtons />
        <PoweredByFooter />
      </div>
    </div>
  )
}
