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
import { Checkbox } from "@/components/ui/checkbox"
import MyMedLogo from "@/components/mymed-logo"
import { Textarea } from "@/components/ui/textarea"
import {
  Baby,
  Apple,
  AlertTriangle,
  Brain,
  Loader2,
  MapPin,
  Pill,
  Utensils,
  Building2,
  TestTube,
  Syringe,
  Calendar,
  Download,
  Printer,
  RotateCcw,
} from "lucide-react"
import LocationService from "@/lib/location-service"

interface PregnancyFormData {
  // Personal Information
  motherName: string
  motherAge: number
  motherHeight: number
  motherWeight: number
  prePregnancyWeight: number
  motherBloodType: string
  motherRhFactor: string
  motherOccupation: string
  motherEducation: string
  motherIncome: string
  fatherName: string
  fatherAge: number
  fatherBloodType: string
  fatherRhFactor: string
  fatherOccupation: string
  fatherEducation: string
  maritalStatus: string
  marriageDuration: string

  // Pregnancy Details
  lastPeriodDate: string
  expectedDeliveryDate: string
  currentWeek: number
  currentTrimester: number
  pregnancyType: string
  plannedPregnancy: boolean
  conceptionMethod: string
  previousMiscarriages: number
  previousAbortions: number

  // Medical History
  chronicConditions: string[]
  allergies: string[]
  previousSurgeries: string[]
  currentMedications: string[]
  familyDiabetes: boolean
  familyHypertension: boolean
  familyHeartDisease: boolean
  familyThalassemia: boolean
  familyMentalHealth: boolean
  previousPregnancies: number
  previousComplications: string[]
  bloodTransfusionHistory: boolean
  vaccinationStatus: string[]

  // Current Health & Vitals (Today Only)
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  temperature: number
  weight: number
  bmi: number
  fundalHeight: number
  fetalHeartRate: number
  respiratoryRate: number
  oxygenSaturation: number
  bloodSugar: number
  hemoglobin: number
  currentSymptoms: string[]
  vitalsTiming: string
  vitalsNotes: string

  // Scans & Tests with Timing
  scansAndTests: ScanTest[]

  // Lifestyle & Diet Customization
  smokingStatus: string
  alcoholConsumption: string
  tobaccoUse: string
  exerciseFrequency: string
  dietType: string
  stressLevel: number
  sleepHours: number
  workEnvironment: string
  exposureToChemicals: boolean
  domesticViolence: string

  // Diet Customization Options
  dietaryRestrictions: string[]
  foodAllergies: string[]
  culturalDietPreferences: string
  mealPreferences: string[]
  cookingTime: string
  budgetRange: string
  favoriteIngredients: string[]
  dislikedFoods: string[]
  waterIntake: number
  supplementsUsed: string[]

  // Location
  location?: {
    address: string
    city: string
    state: string
    country: string
    coordinates: { lat: number; lng: number }
  }

  // Selected facilities for printing
  selectedHospital?: NearbyFacility
  selectedLabCenter?: NearbyFacility
}

interface ScanTest {
  id: string
  type: string
  date: string
  time: string
  facility: string
  doctor: string
  results: string
  notes: string
  nextDue: string
}

interface PregnancyScanSchedule {
  id: string
  scanName: string
  recommendedWeek: number
  scheduledDate: string
  actualDate?: string
  facility?: string
  doctor?: string
  results?: string
  status: "upcoming" | "completed" | "overdue"
  description: string
  importance: "essential" | "recommended" | "optional"
  imcGuideline: string
  whoGuideline: string
  cost: string
}

interface VaccineScheduleWithDates {
  id: string
  vaccine: string
  recommendedWeek: number
  scheduledDate: string
  actualDate?: string
  facility?: string
  doctor?: string
  batchNumber?: string
  status: "upcoming" | "completed" | "overdue"
  description: string
  importance: string
  sideEffects: string
  contraindications: string
  imcGuideline: string
  whoGuideline: string
}

interface LabTest {
  id: string
  name: string
  category: string
  recommendedWeek: number
  dueDate: string
  description: string
  preparation: string
  normalRange: string
  importance: "essential" | "recommended" | "optional"
  result?: string
  status?: "pending" | "completed" | "overdue"
  imcGuideline: string
  whoGuideline: string
}

interface AIAnalysis {
  riskLevel: "low" | "moderate" | "high"
  riskAssessment: string
  recommendations: string[]
  warnings: string[]
  nextSteps: string[]
  suggestedTests: LabTest[]
  dietPlan: DietPlan
  exercisePlan: ExercisePlan
  monitoringSchedule: string[]
  weeklyPredictions: WeeklyPrediction[]
  imcCompliance: string[]
  whoCompliance: string[]
  nearbyHospitals: NearbyFacility[]
  labCenters: NearbyFacility[]
  vaccines: VaccineSchedule[]
  supplements: SupplementPlan[]
  scanSchedule: PregnancyScanSchedule[]
  vaccineScheduleWithDates: VaccineScheduleWithDates[]
  clinicalNotes: string
}

interface NearbyFacility {
  id: string
  name: string
  address: string
  distance: string
  specialties: string
  phone: string
  rating: string
  emergency: string
  selected?: boolean
}

interface VaccineSchedule {
  vaccine: string
  timing: string
  description: string
  importance: string
  sideEffects: string
  contraindications: string
}

interface SupplementPlan {
  name: string
  dosage: string
  timing: string
  benefits: string
  brands: string
  warnings: string
  price: string
}

interface DietPlan {
  trimester: number
  dailyCalories: number
  dailyProtein: number
  keyNutrients: string[]
  weeklyMealPlan: DailyMealPlan[]
  avoidFoods: string[]
  supplements: string[]
  hydration: string
  specialConsiderations: string[]
  customizations: string[]
  imcRecommendations: string[]
  whoRecommendations: string[]
}

interface DailyMealPlan {
  day: string
  breakfast: MealDetail
  morningSnack: MealDetail
  lunch: MealDetail
  afternoonSnack: MealDetail
  dinner: MealDetail
  eveningSnack: MealDetail
}

interface MealDetail {
  name: string
  ingredients: string[]
  calories: number
  protein: number
  preparation: string
  benefits: string[]
}

interface ExercisePlan {
  trimester: number
  weeklyMinutes: number
  recommendedActivities: string[]
  restrictions: string[]
  warningSigns: string[]
  modifications: string[]
}

interface WeeklyPrediction {
  week: number
  expectedChanges: string[]
  recommendedActions: string[]
  warningSignsToWatch: string[]
}

export default function PregnancyPage() {
  const [activeTab, setActiveTab] = useState("form")
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [analysisGenerated, setAnalysisGenerated] = useState(false)

  const [formData, setFormData] = useState<PregnancyFormData>({
    // Personal Information
    motherName: "",
    motherAge: 0,
    motherHeight: 0,
    motherWeight: 0,
    prePregnancyWeight: 0,
    motherBloodType: "",
    motherRhFactor: "",
    motherOccupation: "",
    motherEducation: "",
    motherIncome: "",
    fatherName: "",
    fatherAge: 0,
    fatherBloodType: "",
    fatherRhFactor: "",
    fatherOccupation: "",
    fatherEducation: "",
    maritalStatus: "",
    marriageDuration: "",

    // Pregnancy Details
    lastPeriodDate: "",
    expectedDeliveryDate: "",
    currentWeek: 0,
    currentTrimester: 1,
    pregnancyType: "",
    plannedPregnancy: false,
    conceptionMethod: "",
    previousMiscarriages: 0,
    previousAbortions: 0,

    // Medical History
    chronicConditions: [],
    allergies: [],
    previousSurgeries: [],
    currentMedications: [],
    familyDiabetes: false,
    familyHypertension: false,
    familyHeartDisease: false,
    familyThalassemia: false,
    familyMentalHealth: false,
    previousPregnancies: 0,
    previousComplications: [],
    bloodTransfusionHistory: false,
    vaccinationStatus: [],

    // Current Health & Vitals
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    heartRate: 0,
    temperature: 0,
    weight: 0,
    bmi: 0,
    fundalHeight: 0,
    fetalHeartRate: 0,
    respiratoryRate: 0,
    oxygenSaturation: 0,
    bloodSugar: 0,
    hemoglobin: 0,
    currentSymptoms: [],
    vitalsTiming: "",
    vitalsNotes: "",

    // Scans & Tests
    scansAndTests: [],

    // Lifestyle & Diet
    smokingStatus: "",
    alcoholConsumption: "",
    tobaccoUse: "",
    exerciseFrequency: "",
    dietType: "",
    stressLevel: 0,
    sleepHours: 0,
    workEnvironment: "",
    exposureToChemicals: false,
    domesticViolence: "",

    // Diet Customization
    dietaryRestrictions: [],
    foodAllergies: [],
    culturalDietPreferences: "",
    mealPreferences: [],
    cookingTime: "",
    budgetRange: "",
    favoriteIngredients: [],
    dislikedFoods: [],
    waterIntake: 0,
    supplementsUsed: [],

    // Location
    location: undefined,
  })

  const [availableHospitals, setAvailableHospitals] = useState<NearbyFacility[]>([])
  const [availableLabCenters, setAvailableLabCenters] = useState<NearbyFacility[]>([])

  const [suggestedTests, setSuggestedTests] = useState<LabTest[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [pregnancyScanSchedule, setPregnancyScanSchedule] = useState<PregnancyScanSchedule[]>([])
  const [vaccineScheduleWithDates, setVaccineScheduleWithDates] = useState<VaccineScheduleWithDates[]>([])

  // Auto-detect location on component mount
  useEffect(() => {
    const detectLocationAutomatically = async () => {
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
            country: data.locationInfo?.country || "India",
            coordinates: coords,
          }

          setFormData((prev) => ({ ...prev, location: locationInfo }))
        }
      } catch (error) {
        setLocationError("Location detection failed. Some features may be limited.")
      } finally {
        setIsLoadingLocation(false)
      }
    }

    detectLocationAutomatically()
  }, [])

  // Calculate pregnancy details and generate schedules
  useEffect(() => {
    if (formData.lastPeriodDate) {
      const lastPeriod = new Date(formData.lastPeriodDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - lastPeriod.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const currentWeek = Math.floor(diffDays / 7)
      const currentTrimester = currentWeek <= 12 ? 1 : currentWeek <= 28 ? 2 : 3

      // Calculate expected delivery date (280 days from last period)
      const expectedDelivery = new Date(lastPeriod)
      expectedDelivery.setDate(expectedDelivery.getDate() + 280)

      // Calculate BMI
      const heightInMeters = formData.motherHeight / 100
      const bmi = formData.motherWeight / (heightInMeters * heightInMeters)

      setFormData((prev) => ({
        ...prev,
        currentWeek,
        currentTrimester,
        expectedDeliveryDate: expectedDelivery.toISOString().split("T")[0],
        bmi: Math.round(bmi * 10) / 10,
      }))

      // Generate suggested tests based on current week
      generateSuggestedTests(currentWeek, currentTrimester)

      // Generate pregnancy scan schedule
      generatePregnancyScanSchedule(lastPeriod, currentWeek)

      // Generate vaccine schedule with dates
      generateVaccineScheduleWithDates(lastPeriod, currentWeek)
    }
  }, [formData.lastPeriodDate, formData.motherHeight, formData.motherWeight])

  const generatePregnancyScanSchedule = (lmpDate: Date, currentWeek: number) => {
    const scanSchedule: PregnancyScanSchedule[] = [
      {
        id: "1",
        scanName: "Dating Scan (First Trimester)",
        recommendedWeek: 8,
        scheduledDate: getDateFromWeek(lmpDate, 8),
        status: currentWeek > 8 ? "overdue" : "upcoming",
        description: "Confirms pregnancy, estimates due date, checks for multiple pregnancies",
        importance: "essential",
        imcGuideline: "IMC recommends first ultrasound at 6-10 weeks",
        whoGuideline: "WHO recommends early ultrasound for dating and viability",
        cost: "₹800-1500",
      },
      {
        id: "2",
        scanName: "NT Scan (Nuchal Translucency)",
        recommendedWeek: 12,
        scheduledDate: getDateFromWeek(lmpDate, 12),
        status: currentWeek > 12 ? "overdue" : "upcoming",
        description: "Screens for chromosomal abnormalities like Down syndrome",
        importance: "recommended",
        imcGuideline: "IMC recommends NT scan at 11-14 weeks for high-risk pregnancies",
        whoGuideline: "WHO suggests genetic screening based on maternal age and risk factors",
        cost: "₹2000-3500",
      },
      {
        id: "3",
        scanName: "Anomaly Scan (Level 2)",
        recommendedWeek: 20,
        scheduledDate: getDateFromWeek(lmpDate, 20),
        status: currentWeek > 20 ? "overdue" : "upcoming",
        description: "Detailed scan to check baby's organs and development",
        importance: "essential",
        imcGuideline: "IMC mandates anomaly scan at 18-22 weeks",
        whoGuideline: "WHO recommends mid-pregnancy ultrasound for fetal anomalies",
        cost: "₹1500-2500",
      },
      {
        id: "4",
        scanName: "Growth Scan (Third Trimester)",
        recommendedWeek: 28,
        scheduledDate: getDateFromWeek(lmpDate, 28),
        status: currentWeek > 28 ? "overdue" : "upcoming",
        description: "Monitors baby's growth, amniotic fluid, and placental position",
        importance: "recommended",
        imcGuideline: "IMC recommends growth monitoring in third trimester",
        whoGuideline: "WHO suggests third trimester ultrasound for growth assessment",
        cost: "₹1000-1800",
      },
      {
        id: "5",
        scanName: "Doppler Study",
        recommendedWeek: 32,
        scheduledDate: getDateFromWeek(lmpDate, 32),
        status: currentWeek > 32 ? "overdue" : "upcoming",
        description: "Checks blood flow to baby through umbilical cord and placenta",
        importance: "recommended",
        imcGuideline: "IMC recommends Doppler for high-risk pregnancies",
        whoGuideline: "WHO suggests Doppler studies for suspected growth restriction",
        cost: "₹1200-2000",
      },
      {
        id: "6",
        scanName: "Pre-delivery Scan",
        recommendedWeek: 36,
        scheduledDate: getDateFromWeek(lmpDate, 36),
        status: currentWeek > 36 ? "overdue" : "upcoming",
        description: "Final assessment before delivery - baby position, weight estimation",
        importance: "essential",
        imcGuideline: "IMC recommends pre-delivery assessment at 36-38 weeks",
        whoGuideline: "WHO recommends late pregnancy ultrasound for delivery planning",
        cost: "₹1000-1500",
      },
    ]

    setPregnancyScanSchedule(scanSchedule)
  }

  const generateVaccineScheduleWithDates = (lmpDate: Date, currentWeek: number) => {
    const vaccineSchedule: VaccineScheduleWithDates[] = [
      {
        id: "1",
        vaccine: "Tetanus Toxoid (TT1)",
        recommendedWeek: 16,
        scheduledDate: getDateFromWeek(lmpDate, 16),
        status: currentWeek > 16 ? "overdue" : "upcoming",
        description: "First dose of tetanus toxoid to protect mother and baby from tetanus",
        importance: "Essential - IMC mandated",
        sideEffects: "Mild pain at injection site, low-grade fever for 1-2 days",
        contraindications: "Severe illness, previous severe reaction to vaccine",
        imcGuideline: "IMC mandates TT1 at 16-20 weeks of pregnancy",
        whoGuideline: "WHO recommends tetanus vaccination for all pregnant women",
      },
      {
        id: "2",
        vaccine: "Tetanus Toxoid (TT2)",
        recommendedWeek: 20,
        scheduledDate: getDateFromWeek(lmpDate, 20),
        status: currentWeek > 20 ? "overdue" : "upcoming",
        description: "Second dose of tetanus toxoid (4 weeks after TT1)",
        importance: "Essential - IMC mandated",
        sideEffects: "Mild pain at injection site, low-grade fever for 1-2 days",
        contraindications: "Severe illness, previous severe reaction to vaccine",
        imcGuideline: "IMC mandates TT2 at 4 weeks after TT1",
        whoGuideline: "WHO recommends second dose 4 weeks after first dose",
      },
      {
        id: "3",
        vaccine: "Influenza (Flu) Vaccine",
        recommendedWeek: 14,
        scheduledDate: getDateFromWeek(lmpDate, 14),
        status: currentWeek > 14 ? "overdue" : "upcoming",
        description: "Annual flu vaccine to protect against seasonal influenza",
        importance: "Highly recommended - WHO endorsed",
        sideEffects: "Mild soreness at injection site, low-grade fever for 1-2 days",
        contraindications: "Severe egg allergy, previous severe reaction to vaccine",
        imcGuideline: "IMC recommends flu vaccination during pregnancy",
        whoGuideline: "WHO strongly recommends influenza vaccination for pregnant women",
      },
      {
        id: "4",
        vaccine: "Tdap (Tetanus, Diphtheria, Pertussis)",
        recommendedWeek: 28,
        scheduledDate: getDateFromWeek(lmpDate, 28),
        status: currentWeek > 28 ? "overdue" : "upcoming",
        description: "Protects baby from whooping cough in first months of life",
        importance: "Recommended - IMC guidelines",
        sideEffects: "Pain at injection site, mild fever, fatigue for 1-2 days",
        contraindications: "Severe illness, previous severe reaction to vaccine",
        imcGuideline: "IMC recommends Tdap at 27-36 weeks of pregnancy",
        whoGuideline: "WHO recommends pertussis vaccination during pregnancy",
      },
      {
        id: "5",
        vaccine: "COVID-19 Vaccine",
        recommendedWeek: 12,
        scheduledDate: getDateFromWeek(lmpDate, 12),
        status: currentWeek > 12 ? "overdue" : "upcoming",
        description: "COVID-19 vaccination as per current health ministry guidelines",
        importance: "Recommended - Current health ministry guidelines",
        sideEffects: "Pain at injection site, fatigue, mild fever, headache",
        contraindications: "Severe allergic reaction to vaccine components",
        imcGuideline: "IMC follows current MoHFW guidelines for COVID-19 vaccination",
        whoGuideline: "WHO recommends COVID-19 vaccination for pregnant women",
      },
      {
        id: "6",
        vaccine: "Hepatitis B (if not immune)",
        recommendedWeek: 18,
        scheduledDate: getDateFromWeek(lmpDate, 18),
        status: currentWeek > 18 ? "overdue" : "upcoming",
        description: "Hepatitis B vaccination if not previously vaccinated or immune",
        importance: "Recommended for high-risk individuals",
        sideEffects: "Mild pain at injection site, fatigue",
        contraindications: "Severe illness, yeast allergy",
        imcGuideline: "IMC recommends Hepatitis B vaccination for high-risk pregnant women",
        whoGuideline: "WHO recommends Hepatitis B vaccination in endemic areas",
      },
    ]

    setVaccineScheduleWithDates(vaccineSchedule)
  }

  const getDateFromWeek = (lmpDate: Date, week: number): string => {
    const targetDate = new Date(lmpDate)
    targetDate.setDate(targetDate.getDate() + week * 7)
    return targetDate.toISOString().split("T")[0]
  }

  const generateSuggestedTests = (week: number, trimester: number) => {
    const allTests: LabTest[] = [
      {
        id: "1",
        name: "Complete Blood Count (CBC)",
        category: "Hematology",
        recommendedWeek: 8,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Checks for anemia, infection, and blood disorders",
        preparation: "No special preparation needed",
        normalRange: "Hgb: 11-15 g/dL, Hct: 33-45%",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC recommends CBC at first visit and 28-32 weeks",
        whoGuideline: "WHO recommends hemoglobin testing at first contact and 28 weeks",
      },
      {
        id: "2",
        name: "Blood Type & Rh Factor",
        category: "Serology",
        recommendedWeek: 8,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Determines blood type and Rh compatibility",
        preparation: "No special preparation needed",
        normalRange: "A, B, AB, or O; Rh positive or negative",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC mandates ABO and Rh typing at first antenatal visit",
        whoGuideline: "WHO recommends blood grouping and Rh typing for all pregnant women",
      },
      {
        id: "3",
        name: "Fasting Blood Sugar",
        category: "Biochemistry",
        recommendedWeek: 10,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Screens for diabetes and glucose intolerance",
        preparation: "Fast for 8-12 hours before test",
        normalRange: "70-100 mg/dL",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC recommends glucose screening at 24-28 weeks for all women",
        whoGuideline: "WHO recommends glucose testing for women with risk factors",
      },
    ]

    // Filter tests based on current week and show upcoming tests
    const relevantTests = allTests.filter((test) => test.recommendedWeek >= week && test.recommendedWeek <= week + 8)
    setSuggestedTests(relevantTests)
  }

  const generateAIAnalysis = async () => {
    setIsGeneratingAnalysis(true)

    try {
      const comprehensiveAssessmentPrompt = `
You are Dr. MediAI, a world-renowned maternal-fetal medicine specialist with 30+ years of experience, following Indian Medical Council (IMC) and WHO guidelines. Provide a comprehensive, evidence-based pregnancy assessment.

PATIENT PROFILE ANALYSIS:
==========================
Mother: ${formData.motherName}, Age: ${formData.motherAge} years
Current Pregnancy: Week ${formData.currentWeek} (Trimester ${formData.currentTrimester})
Physical: Height ${formData.motherHeight}cm, Weight ${formData.motherWeight}kg, BMI ${formData.bmi}
Blood Type: ${formData.motherBloodType}${formData.motherRhFactor}
Socioeconomic: Education: ${formData.motherEducation}, Occupation: ${formData.motherOccupation}, Income: ${formData.motherIncome}
Location: ${formData.location?.city}, ${formData.location?.state}, ${formData.location?.country}

PREGNANCY DETAILS:
==================
LMP: ${formData.lastPeriodDate}, EDD: ${formData.expectedDeliveryDate}
Conception: ${formData.conceptionMethod}, Type: ${formData.pregnancyType}
Planned: ${formData.plannedPregnancy ? "Yes" : "No"}
Obstetric History: G${formData.previousPregnancies + 1}P${formData.previousPregnancies}A${formData.previousAbortions}L${formData.previousPregnancies - formData.previousMiscarriages}
Previous Complications: ${formData.previousComplications.join(", ") || "None"}
Weight Gain: ${(formData.weight - formData.prePregnancyWeight).toFixed(1)}kg

COMPREHENSIVE MEDICAL HISTORY:
===============================
Chronic Conditions: ${formData.chronicConditions.join(", ") || "None"}
Current Medications: ${formData.currentMedications.join(", ") || "None"}
Allergies: ${formData.allergies.join(", ") || "None"}
Previous Surgeries: ${formData.previousSurgeries.join(", ") || "None"}
Blood Transfusion History: ${formData.bloodTransfusionHistory ? "Yes" : "No"}
Vaccination Status: ${formData.vaccinationStatus.join(", ") || "Not specified"}

FAMILY MEDICAL HISTORY:
========================
Diabetes: ${formData.familyDiabetes ? "Positive" : "Negative"}
Hypertension: ${formData.familyHypertension ? "Positive" : "Negative"}
Heart Disease: ${formData.familyHeartDisease ? "Positive" : "Negative"}
Thalassemia: ${formData.familyThalassemia ? "Positive" : "Negative"}
Mental Health: ${formData.familyMentalHealth ? "Positive" : "Negative"}

CURRENT VITALS & CLINICAL STATUS (${formData.vitalsTiming || "Recent"}):
========================================================================
Blood Pressure: ${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic} mmHg
Heart Rate: ${formData.heartRate} bpm, Respiratory Rate: ${formData.respiratoryRate}/min
Temperature: ${formData.temperature}°F, SpO2: ${formData.oxygenSaturation}%
Blood Sugar: ${formData.bloodSugar} mg/dL, Hemoglobin: ${formData.hemoglobin} g/dL
Fundal Height: ${formData.fundalHeight}cm, Fetal Heart Rate: ${formData.fetalHeartRate} bpm
Current Symptoms: ${formData.currentSymptoms.join(", ") || "None"}
Additional Notes: ${formData.vitalsNotes || "None"}

LIFESTYLE & SOCIAL ASSESSMENT:
===============================
Smoking: ${formData.smokingStatus}, Tobacco: ${formData.tobaccoUse}
Alcohol: ${formData.alcoholConsumption}
Exercise: ${formData.exerciseFrequency}, Sleep: ${formData.sleepHours}hrs
Stress Level: ${formData.stressLevel}/10
Work Environment: ${formData.workEnvironment}
Chemical Exposure: ${formData.exposureToChemicals ? "Yes" : "No"}
Domestic Violence: ${formData.domesticViolence}

COMPREHENSIVE DIET & NUTRITION PROFILE:
========================================
Diet Type: ${formData.dietType}
Cultural Preferences: ${formData.culturalDietPreferences}
Dietary Restrictions: ${formData.dietaryRestrictions.join(", ") || "None"}
Food Allergies: ${formData.foodAllergies.join(", ") || "None"}
Meal Preferences: ${formData.mealPreferences.join(", ") || "Standard"}
Favorite Ingredients: ${formData.favoriteIngredients.join(", ") || "Standard"}
Foods to Avoid: ${formData.dislikedFoods.join(", ") || "None"}
Water Intake: ${formData.waterIntake} glasses/day
Current Supplements: ${formData.supplementsUsed.join(", ") || "None"}
Cooking Time Available: ${formData.cookingTime}
Food Budget: ${formData.budgetRange}

Based on this comprehensive assessment, provide detailed analysis in EXACTLY this format:

**RISK ASSESSMENT:** [Provide detailed risk stratification: LOW/MODERATE/HIGH with specific IMC/WHO criteria and reasoning based on all factors including age, BMI, medical history, family history, current vitals, and lifestyle factors]

**IMC COMPLIANCE ANALYSIS:** 
• [Specific IMC guideline compliance point 1 based on patient data]
• [Specific IMC guideline compliance point 2 based on patient data]
• [Specific IMC guideline compliance point 3 based on patient data]
• [Specific IMC guideline compliance point 4 based on patient data]

**WHO COMPLIANCE ANALYSIS:**
• [Specific WHO guideline compliance point 1 based on patient data]
• [Specific WHO guideline compliance point 2 based on patient data]
• [Specific WHO guideline compliance point 3 based on patient data]
• [Specific WHO guideline compliance point 4 based on patient data]

**CLINICAL RECOMMENDATIONS:**
• [Evidence-based recommendation 1 specific to patient's condition and risk factors]
• [Evidence-based recommendation 2 specific to patient's medical history]
• [Evidence-based recommendation 3 specific to patient's lifestyle and social factors]
• [Evidence-based recommendation 4 specific to patient's nutritional needs]

**CRITICAL WARNINGS:**
• [Critical warning 1 based on patient's specific risk factors]
• [Critical warning 2 based on current vitals and symptoms]
• [Critical warning 3 based on family history and lifestyle]

**IMMEDIATE NEXT STEPS:**
• [Immediate action 1 based on current week and trimester]
• [Immediate action 2 based on current symptoms and vitals]
• [Immediate action 3 based on risk assessment]
• [Immediate action 4 based on IMC/WHO protocols]

**PERSONALIZED DIET PLAN:** [Create detailed Indian diet plan considering: diet type (${formData.dietType}), cultural preferences (${formData.culturalDietPreferences}), restrictions (${formData.dietaryRestrictions.join(", ")}), allergies (${formData.foodAllergies.join(", ") || "None"} ), favorite ingredients (${formData.favoriteIngredients.join(", ") || "Standard"} ), cooking time (${formData.cookingTime}), budget (${formData.budgetRange}), and current trimester nutritional needs]

**EXERCISE RECOMMENDATIONS:** [Safe exercise plan based on current fitness level (${formData.exerciseFrequency}), trimester (${formData.currentTrimester}), and any medical restrictions]

**MONITORING SCHEDULE:** 
• [Monitoring recommendation 1 based on risk level and current week]
• [Monitoring recommendation 2 based on family history and medical conditions]
• [Monitoring recommendation 3 based on current symptoms and vitals]
• [Monitoring recommendation 4 based on IMC/WHO protocols]

**WEEKLY PREDICTIONS:** [Provide specific predictions for next 4 weeks based on current week ${formData.currentWeek} and individual risk factors]

**SUPPLEMENT RECOMMENDATIONS:** [Specific supplements based on current supplements used (${formData.supplementsUsed.join(", ")}), dietary restrictions, and trimester needs with exact dosages and Indian brands]

**AI CLINICAL NOTES FOR DOCTORS:** [Comprehensive clinical summary highlighting key risk factors, recommended interventions, monitoring priorities, and specific areas requiring medical attention based on the complete patient profile]

Ensure all recommendations are:
1. Specific to this patient's unique profile
2. Evidence-based per IMC/WHO guidelines
3. Culturally appropriate for Indian context
4. Practical and actionable
5. Consider all provided medical, social, and lifestyle factors
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

      if (response.ok && data.response) {
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        // Parse AI response with enhanced parsing
        const riskAssessment = extractSection(aiText, "RISK ASSESSMENT")
        const imcCompliance = parseList(aiText, "IMC COMPLIANCE ANALYSIS")
        const whoCompliance = parseList(aiText, "WHO COMPLIANCE ANALYSIS")
        const recommendations = parseList(aiText, "CLINICAL RECOMMENDATIONS")
        const warnings = parseList(aiText, "CRITICAL WARNINGS")
        const nextSteps = parseList(aiText, "IMMEDIATE NEXT STEPS")
        const dietInfo = extractSection(aiText, "PERSONALIZED DIET PLAN")
        const exerciseInfo = extractSection(aiText, "EXERCISE RECOMMENDATIONS")
        const monitoringInfo = parseList(aiText, "MONITORING SCHEDULE")
        const weeklyPredictionsInfo = parseList(aiText, "WEEKLY PREDICTIONS")
        const supplementsInfo = parseList(aiText, "SUPPLEMENT RECOMMENDATIONS")
        const clinicalNotes = extractSection(aiText, "AI CLINICAL NOTES FOR DOCTORS")

        // Determine risk level
        let riskLevel: "low" | "moderate" | "high" = "low"
        if (riskAssessment.toLowerCase().includes("high")) riskLevel = "high"
        else if (riskAssessment.toLowerCase().includes("moderate")) riskLevel = "moderate"

        // Generate comprehensive analysis
        const analysis: AIAnalysis = {
          riskLevel,
          riskAssessment,
          imcCompliance: imcCompliance.slice(0, 4),
          whoCompliance: whoCompliance.slice(0, 4),
          recommendations: recommendations.slice(0, 4),
          warnings: warnings.slice(0, 3),
          nextSteps: nextSteps.slice(0, 4),
          suggestedTests: suggestedTests,
          dietPlan: generateCustomDietPlan(formData.currentTrimester, dietInfo),
          exercisePlan: generateExercisePlan(formData.currentTrimester, exerciseInfo),
          monitoringSchedule: monitoringInfo,
          weeklyPredictions: generateWeeklyPredictions(weeklyPredictionsInfo),
          nearbyHospitals: [],
          labCenters: [],
          vaccines: generateVaccineSchedule([]),
          supplements: generateSupplementPlan(supplementsInfo.join(" ")),
          scanSchedule: pregnancyScanSchedule,
          vaccineScheduleWithDates: vaccineScheduleWithDates,
          clinicalNotes: clinicalNotes,
        }

        const hospitals = await generateNearbyHospitals([])
        analysis.nearbyHospitals = hospitals

        const labs = generateLabCenters([])
        analysis.labCenters = labs

        setAiAnalysis(analysis)
        setAnalysisGenerated(true)
      }
    } catch (error) {
      console.error("AI Analysis error:", error)
      alert("Unable to generate AI analysis. Please try again.")
    } finally {
      setIsGeneratingAnalysis(false)
    }
  }

  const generateCustomDietPlan = (trimester: number, aiDietInfo: string): DietPlan => {
    const baseCalories = trimester === 1 ? 2000 : trimester === 2 ? 2340 : 2450
    const baseProtein = trimester === 1 ? 71 : trimester === 2 ? 81 : 91

    // Generate 7-day Indian meal plan based on preferences
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const weeklyMealPlan: DailyMealPlan[] = days.map((day) => ({
      day,
      breakfast: {
        name: `${day} Indian Breakfast`,
        ingredients: ["Poha/Upma", "Milk", "Fruits", "Nuts"],
        calories: 380,
        protein: 15,
        preparation: "Traditional Indian preparation with vegetables",
        benefits: ["Folic acid", "Iron", "Fiber", "Calcium"],
      },
      morningSnack: {
        name: "Mid-Morning Snack",
        ingredients: ["Buttermilk", "Roasted chana"],
        calories: 150,
        protein: 8,
        preparation: "Fresh buttermilk with roasted gram",
        benefits: ["Protein", "Probiotics"],
      },
      lunch: {
        name: `${day} Indian Lunch`,
        ingredients: ["Dal", "Rice/Roti", "Vegetables", "Curd"],
        calories: 520,
        protein: 35,
        preparation: "Balanced Indian thali with seasonal vegetables",
        benefits: ["Complete protein", "Complex carbs", "Vitamins"],
      },
      afternoonSnack: {
        name: "Evening Snack",
        ingredients: ["Seasonal fruit", "Dry fruits"],
        calories: 180,
        protein: 6,
        preparation: "Fresh seasonal fruit with almonds/walnuts",
        benefits: ["Fiber", "Healthy fats"],
      },
      dinner: {
        name: `${day} Indian Dinner`,
        ingredients: ["Fish/Chicken curry", "Rice", "Green vegetables"],
        calories: 480,
        protein: 40,
        preparation: "Light Indian curry with steamed rice and vegetables",
        benefits: ["Omega-3", "Beta-carotene", "Folate"],
      },
      eveningSnack: {
        name: "Bedtime Snack",
        ingredients: ["Warm milk", "Dates"],
        calories: 120,
        protein: 6,
        preparation: "Warm milk with dates or almonds",
        benefits: ["Calcium", "Protein"],
      },
    }))

    return {
      trimester,
      dailyCalories: baseCalories,
      dailyProtein: baseProtein,
      keyNutrients: ["Folic Acid (600mcg)", "Iron (27mg)", "Calcium (1000mg)", "DHA (200mg)", "Vitamin D (600 IU)"],
      weeklyMealPlan,
      avoidFoods: [
        "Raw fish/sushi",
        "Unpasteurized dairy",
        "High mercury fish",
        "Raw eggs",
        "Alcohol",
        "Excessive caffeine",
        "Papaya (raw)",
        "Pineapple (excess)",
      ],
      supplements: ["Prenatal multivitamin", "Iron supplement", "Calcium + Vitamin D", "Omega-3 DHA"],
      hydration: "8-10 glasses of water daily, coconut water, fresh fruit juices (diluted)",
      specialConsiderations: aiDietInfo
        ? [aiDietInfo]
        : ["Focus on traditional Indian foods", "Small frequent meals", "Adequate protein intake"],
      customizations: [
        `Adapted for ${formData.dietType} diet`,
        `Considers ${formData.culturalDietPreferences} preferences`,
        `Cooking time: ${formData.cookingTime}`,
        `Budget-friendly options for ${formData.budgetRange} range`,
      ],
      imcRecommendations: [
        "Follow IMC recommended weight gain guidelines",
        "Include iron-rich foods as per IMC nutrition guidelines",
        "Consume iodized salt as recommended by IMC",
        "Follow IMC guidelines for calcium supplementation",
      ],
      whoRecommendations: [
        "Meet WHO daily energy requirements for pregnancy",
        "Follow WHO recommendations for micronutrient supplementation",
        "Adhere to WHO guidelines for safe food practices",
        "Maintain WHO recommended protein intake levels",
      ],
    }
  }

  const generateExercisePlan = (trimester: number, aiExerciseInfo: string): ExercisePlan => {
    return {
      trimester,
      weeklyMinutes: 150,
      recommendedActivities: ["Walking", "Swimming", "Prenatal yoga", "Light strength training", "Stationary cycling"],
      restrictions: [
        "No contact sports",
        "Avoid lying flat on back after 1st trimester",
        "No scuba diving",
        "Avoid high altitude activities",
      ],
      warningSigns: [
        "Chest pain",
        "Dizziness",
        "Headache",
        "Calf pain/swelling",
        "Decreased fetal movement",
        "Vaginal bleeding",
      ],
      modifications: aiExerciseInfo
        ? [aiExerciseInfo]
        : ["Reduce intensity as pregnancy progresses", "Stay hydrated", "Avoid overheating"],
    }
  }

  const generateWeeklyPredictions = (predictionsInfo: string[]): WeeklyPrediction[] => {
    const currentWeek = formData.currentWeek
    return [
      {
        week: currentWeek + 1,
        expectedChanges: ["Continued fetal growth", "Possible morning sickness changes"],
        recommendedActions: ["Continue prenatal vitamins", "Monitor symptoms"],
        warningSignsToWatch: ["Severe nausea", "Bleeding", "Cramping"],
      },
      {
        week: currentWeek + 2,
        expectedChanges: ["Increased energy levels", "Breast tenderness"],
        recommendedActions: ["Regular exercise", "Balanced nutrition"],
        warningSignsToWatch: ["Persistent headaches", "Vision changes"],
      },
      {
        week: currentWeek + 3,
        expectedChanges: ["Visible belly growth", "Possible heartburn"],
        recommendedActions: ["Prenatal appointment", "Lab tests if due"],
        warningSignsToWatch: ["Severe abdominal pain", "Fever"],
      },
      {
        week: currentWeek + 4,
        expectedChanges: ["Fetal movement may be felt", "Weight gain"],
        recommendedActions: ["Track fetal movements", "Continue monitoring"],
        warningSignsToWatch: ["No fetal movement", "Unusual discharge"],
      },
    ]
  }

  const generateNearbyHospitals = async (hospitalsInfo: string[]): Promise<NearbyFacility[]> => {
    if (!formData.location?.coordinates) {
      // Fallback to sample data if no location
      const sampleHospitals = [
        {
          id: "1",
          name: "Apollo Hospital",
          address: `Medical Complex, ${formData.location?.city || "Your City"}`,
          distance: "1.2 km from your location",
          specialties: "Maternity care, NICU, Emergency services, Gynecology",
          phone: "+91-40-5678-9012",
          rating: "4.5/5 ⭐ (2,250 reviews)",
          emergency: "24/7 emergency services, Ambulance available",
        },
        {
          id: "2",
          name: "Fortis Hospital",
          address: `Healthcare Hub, ${formData.location?.city || "Your City"}`,
          distance: "2.1 km from your location",
          specialties: "High-risk pregnancy care, Advanced NICU, Fetal medicine",
          phone: "+91-40-6789-0123",
          rating: "4.3/5 ⭐ (1,800 reviews)",
          emergency: "24/7 maternity emergency, Cesarean facilities",
        },
        {
          id: "3",
          name: "Max Healthcare",
          address: `Medical Center, ${formData.location?.city || "Your City"}`,
          distance: "3.5 km from your location",
          specialties: "Normal delivery, Painless delivery, Lactation support",
          phone: "+91-40-7890-1234",
          rating: "4.2/5 ⭐ (1,500 reviews)",
          emergency: "Emergency obstetric care, Blood bank facility",
        },
      ]
      setAvailableHospitals(sampleHospitals)
      return sampleHospitals
    }

    try {
      // Fetch real hospital data from location API
      const response = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData.location.coordinates,
          type: "hospitals",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const realHospitals =
          data.facilities?.filter((facility: any) =>
            facility.types?.some((type: string) => ["hospital", "medical_center", "emergency_room"].includes(type)),
          ) || []

        const formattedHospitals: NearbyFacility[] = realHospitals.slice(0, 10).map((hospital: any, index: number) => ({
          id: hospital.place_id || `hospital-${index}`,
          name: hospital.name || `Hospital ${index + 1}`,
          address: hospital.vicinity || hospital.formatted_address || `Address not available`,
          distance: hospital.distance
            ? `${(hospital.distance / 1000).toFixed(1)} km from your location`
            : "Distance not available",
          specialties: hospital.types?.includes("hospital")
            ? "General Hospital, Emergency services, Maternity care"
            : hospital.types?.includes("medical_center")
              ? "Medical Center, Outpatient services"
              : "Healthcare facility",
          phone: hospital.formatted_phone_number || "Phone not available",
          rating: hospital.rating
            ? `${hospital.rating}/5 ⭐ (${hospital.user_ratings_total || 0} reviews)`
            : "Rating not available",
          emergency: hospital.opening_hours?.open_now ? "Currently Open" : "Hours not available",
        }))

        setAvailableHospitals(formattedHospitals)
        return formattedHospitals
      }
    } catch (error) {
      console.error("Error fetching real hospital data:", error)
    }

    // Fallback to sample data
    const fallbackHospitals = [
      {
        id: "1",
        name: "Apollo Hospital",
        address: `Medical Complex, ${formData.location?.city || "Your City"}`,
        distance: "1.2 km from your location",
        specialties: "Maternity care, NICU, Emergency services, Gynecology",
        phone: "+91-40-5678-9012",
        rating: "4.5/5 ⭐ (2,250 reviews)",
        emergency: "24/7 emergency services, Ambulance available",
      },
      {
        id: "2",
        name: "Fortis Hospital",
        address: `Healthcare Hub, ${formData.location?.city || "Your City"}`,
        distance: "2.1 km from your location",
        specialties: "High-risk pregnancy care, Advanced NICU, Fetal medicine",
        phone: "+91-40-6789-0123",
        rating: "4.3/5 ⭐ (1,800 reviews)",
        emergency: "24/7 maternity emergency, Cesarean facilities",
      },
      {
        id: "3",
        name: "Max Healthcare",
        address: `Medical Center, ${formData.location?.city || "Your City"}`,
        distance: "3.5 km from your location",
        specialties: "Normal delivery, Painless delivery, Lactation support",
        phone: "+91-40-7890-1234",
        rating: "4.2/5 ⭐ (1,500 reviews)",
        emergency: "Emergency obstetric care, Blood bank facility",
      },
    ]

    setAvailableHospitals(fallbackHospitals)
    return fallbackHospitals
  }

  const generateLabCenters = (labsInfo: string[]): NearbyFacility[] => {
    const labs = [
      {
        id: "1",
        name: "Dr. Lal PathLabs",
        address: `Central Plaza, ${formData.location?.city || "Your City"}`,
        distance: "1.2 km from your location",
        specialties: "Pregnancy tests, Genetic screening, Hormone tests, Complete blood work",
        phone: "+91-40-5678-9012",
        rating: "4.3/5 ⭐ (1,250 reviews)",
        emergency: "Home collection available, Same-day reports for urgent tests",
      },
      {
        id: "2",
        name: "SRL Diagnostics",
        address: `Medical Complex, ${formData.location?.city || "Your City"}`,
        distance: "2.1 km from your location",
        specialties: "Advanced pregnancy screening, 3D/4D ultrasound, Genetic counseling",
        phone: "+91-40-6789-0123",
        rating: "4.2/5 ⭐ (1,100 reviews)",
        emergency: "24/7 emergency lab services, Free home collection",
      },
      {
        id: "3",
        name: "Metropolis Healthcare",
        address: `Health Hub, ${formData.location?.city || "Your City"}`,
        distance: "3.5 km from your location",
        specialties: "Comprehensive pregnancy panels, Infectious disease screening",
        phone: "+91-40-7890-1234",
        rating: "4.1/5 ⭐ (950 reviews)",
        emergency: "Online reports, Mobile app for tracking",
      },
    ]

    setAvailableLabCenters(labs)
    return labs
  }

  const generateVaccineSchedule = (vaccinesInfo: string[]): VaccineSchedule[] => {
    return [
      {
        vaccine: "Tetanus Toxoid (TT)",
        timing: "16-20 weeks, then 4 weeks later",
        description: "Protects against tetanus",
        importance: "Essential",
        sideEffects: "Soreness, fever",
        contraindications: "Severe allergic reaction",
      },
      {
        vaccine: "Influenza",
        timing: "Any trimester during flu season",
        description: "Protects against seasonal flu",
        importance: "Recommended",
        sideEffects: "Soreness, fever",
        contraindications: "Severe egg allergy",
      },
    ]
  }

  const generateSupplementPlan = (supplementsInfo: string): SupplementPlan[] => {
    return [
      {
        name: "Folic Acid",
        dosage: "400-800 mcg daily",
        timing: "Before and during pregnancy",
        benefits: "Prevents neural tube defects",
        brands: "Various",
        warnings: "Consult doctor",
        price: "Affordable",
      },
      {
        name: "Iron",
        dosage: "27mg daily",
        timing: "During pregnancy",
        benefits: "Prevents anemia",
        brands: "Various",
        warnings: "May cause constipation",
        price: "Affordable",
      },
    ]
  }

  // Helper functions for parsing AI response
  const extractSection = (text: string, sectionName: string): string => {
    const lines = text.split("\n")
    let inSection = false
    let content = ""

    for (const line of lines) {
      if (line.includes(`**${sectionName}:`)) {
        inSection = true
        const sectionContent = line.split(`**${sectionName}:`)[1]
        if (sectionContent) content += sectionContent.trim() + " "
        continue
      }
      if (inSection && line.includes("**") && !line.includes(sectionName)) {
        break
      }
      if (inSection && line.trim()) {
        content += line.trim() + " "
      }
    }

    return content.trim() || `${sectionName} analysis not available`
  }

  const parseList = (text: string, sectionName: string): string[] => {
    const section = extractSection(text, sectionName)
    if (!section || section.includes("not available")) return [`${sectionName} recommendations not available`]

    // Split by common delimiters and clean up
    const items = section.split(/[•\-\n]/).filter((item) => item.trim().length > 10)
    return items.slice(0, 5).map((item) => item.trim())
  }

  const handleInputChange = (field: keyof PregnancyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelect = (field: keyof PregnancyFormData, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] }
      } else {
        return { ...prev, [field]: currentArray.filter((item) => item !== value) }
      }
    })
  }

  const updateScanSchedule = (id: string, field: keyof PregnancyScanSchedule, value: string) => {
    setPregnancyScanSchedule((prev) => prev.map((scan) => (scan.id === id ? { ...scan, [field]: value } : scan)))
  }

  const updateVaccineSchedule = (id: string, field: keyof VaccineScheduleWithDates, value: string) => {
    setVaccineScheduleWithDates((prev) =>
      prev.map((vaccine) => (vaccine.id === id ? { ...vaccine, [field]: value } : vaccine)),
    )
  }

  const handleHospitalSelection = (hospital: NearbyFacility) => {
    setFormData((prev) => ({ ...prev, selectedHospital: hospital }))
  }

  const handleLabSelection = (lab: NearbyFacility) => {
    setFormData((prev) => ({ ...prev, selectedLabCenter: lab }))
  }

  const handlePrint = () => {
    generateComprehensivePrintReport()
  }

  const handleDownloadPDF = () => {
    generateComprehensivePrintReport()
  }

  const generateComprehensivePrintReport = () => {
    if (!formData.motherName) {
      alert("Please fill in basic information before generating report")
      return
    }

    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })

    const currentTime = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    })

    const chronicConditionsList = [
      "Diabetes Type 1",
      "Diabetes Type 2",
      "Gestational Diabetes (previous)",
      "Hypertension",
      "Heart Disease",
      "Asthma",
      "COPD",
      "Thyroid Disease (Hypo/Hyper)",
      "Kidney Disease",
      "Liver Disease",
      "Autoimmune Disease",
      "Depression",
      "Anxiety",
      "Epilepsy",
      "Migraine",
      "Arthritis",
      "Osteoporosis",
      "Cancer History",
      "PCOS",
      "Endometriosis",
    ]

    const allergyOptionsList = [
      "Penicillin",
      "Sulfa Drugs",
      "Aspirin",
      "Ibuprofen",
      "Codeine",
      "Latex",
      "Peanuts",
      "Tree Nuts",
      "Shellfish",
      "Fish",
      "Eggs",
      "Milk",
      "Soy",
      "Wheat",
      "Sesame",
      "Mustard",
      "Celery",
      "Lupin",
      "Mollusks",
      "Sulfites",
    ]

    const reportContent = `
<!DOCTYPE html>
<html>
<head>
  <title>MyMedi.ai - Comprehensive Pregnancy Care Report</title>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: Arial, sans-serif; 
      font-size: 9px;
      line-height: 1.2;
      color: #000;
      background: white;
      padding: 8mm;
    }
    
    .header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    
    .header h1 {
      font-size: 16px;
      margin-bottom: 2px;
      font-weight: bold;
    }
    
    .header p {
      font-size: 8px;
      color: #666;
    }
    
    .patient-summary {
      background: #f8f9fa;
      padding: 6px;
      border-radius: 4px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
    }
    
    .patient-summary h3 {
      font-size: 10px;
      margin-bottom: 4px;
      text-align: center;
      font-weight: bold;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
      font-size: 8px;
    }
    
    .section {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    
    .section-header {
      background: #e9ecef;
      padding: 3px 6px;
      font-weight: bold;
      font-size: 9px;
      border-left: 3px solid #007bff;
      margin-bottom: 4px;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .three-column {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 6px;
    }
    
    .four-column {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 4px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7px;
      margin-bottom: 6px;
    }
    
    th, td {
      border: 1px solid #ccc;
      padding: 2px 3px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f1f3f4;
      font-weight: bold;
      font-size: 7px;
    }
    
    .compact-list {
      font-size: 8px;
      line-height: 1.1;
    }
    
    .compact-list li {
      margin-bottom: 1px;
    }
    
    .badge {
      display: inline-block;
      padding: 1px 4px;
      background: #e9ecef;
      border-radius: 2px;
      font-size: 7px;
      margin: 1px;
    }
    
    .badge-success { background: #d4edda; color: #155724; }
    .badge-warning { background: #fff3cd; color: #856404; }
    .badge-danger { background: #f8d7da; color: #721c24; }
    .badge-info { background: #d1ecf1; color: #0c5460; }
    
    .meal-compact {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 3px;
      padding: 4px;
      margin-bottom: 3px;
      font-size: 7px;
    }
    
    .meal-header {
      font-weight: bold;
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;
    }
    
    .vital-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4px;
      font-size: 8px;
    }
    
    .vital-item {
      background: #f8f9fa;
      padding: 3px;
      border-radius: 2px;
      text-align: center;
    }
    
    .facility-compact {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 3px;
      padding: 4px;
      margin-bottom: 3px;
      font-size: 7px;
    }
    
    .facility-name {
      font-weight: bold;
      margin-bottom: 1px;
    }
    
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      font-size: 7px;
    }
    
    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    
    .checkbox {
      width: 8px;
      height: 8px;
      border: 1px solid #333;
      display: inline-block;
      margin-right: 2px;
    }
    
    .checked {
      background: #333;
    }
    
    .footer {
      text-align: center;
      margin-top: 12px;
      padding: 6px;
      border-top: 1px solid #ddd;
      font-size: 7px;
      color: #666;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    @media print {
      body { margin: 0; padding: 5mm; }
      .section { page-break-inside: avoid; }
      @page { margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏥 MyMedi.ai - Comprehensive Pregnancy Care Report</h1>
    <p>AI-Powered Maternal Health Analysis | Generated: ${currentDate} ${currentTime} | Report ID: PRC-${Date.now().toString().slice(-8)}</p>
  </div>

  <div class="patient-summary">
    <h3>👤 PATIENT SUMMARY</h3>
    <div class="summary-grid">
      <div><strong>Name:</strong> ${formData.motherName}</div>
      <div><strong>Age:</strong> ${formData.motherAge} years</div>
      <div><strong>Week:</strong> ${formData.currentWeek} (T${formData.currentTrimester})</div>
      <div><strong>BMI:</strong> ${formData.bmi || "Not calculated"}</div>
      <div><strong>Blood Type:</strong> ${formData.motherBloodType}${formData.motherRhFactor}</div>
      <div><strong>EDD:</strong> ${formData.expectedDeliveryDate || "Not set"}</div>
      <div><strong>Location:</strong> ${formData.location?.city || "Not specified"}</div>
      <div><strong>Weight Gain:</strong> ${formData.weight && formData.prePregnancyWeight ? (formData.weight - formData.prePregnancyWeight).toFixed(1) + "kg" : "N/A"}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">📋 PREGNANCY DETAILS</div>
    <div class="four-column">
      <div><strong>LMP:</strong> ${formData.lastPeriodDate || "Not specified"}</div>
      <div><strong>Type:</strong> ${formData.pregnancyType || "Not specified"}</div>
      <div><strong>Planned:</strong> ${formData.plannedPregnancy ? "Yes" : "No"}</div>
      <div><strong>Method:</strong> ${formData.conceptionMethod || "Natural"}</div>
      <div><strong>Previous:</strong> G${formData.previousPregnancies + 1}P${formData.previousPregnancies}A${formData.previousAbortions}</div>
      <div><strong>Miscarriages:</strong> ${formData.previousMiscarriages}</div>
      <div><strong>Marriage:</strong> ${formData.marriageDuration || "Not specified"}</div>
      <div><strong>Education:</strong> ${formData.motherEducation || "Not specified"}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">🩺 CURRENT VITALS & HEALTH STATUS</div>
    <div class="vital-grid">
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.bloodPressureSystolic || "--"}/${formData.bloodPressureDiastolic || "--"}</div>
        <div>BP (mmHg)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.heartRate || "--"}</div>
        <div>HR (bpm)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.temperature || "--"}</div>
        <div>Temp (°F)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.oxygenSaturation || "--"}</div>
        <div>SpO2 (%)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.bloodSugar || "--"}</div>
        <div>BS (mg/dL)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.hemoglobin || "--"}</div>
        <div>Hgb (g/dL)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.fundalHeight || "--"}</div>
        <div>FH (cm)</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${formData.fetalHeartRate || "--"}</div>
        <div>FHR (bpm)</div>
      </div>
    </div>
    ${
      formData.currentSymptoms.length > 0
        ? `
    <div style="margin-top: 4px;">
      <strong>Current Symptoms:</strong> ${formData.currentSymptoms.join(", ")}
    </div>
    `
        : ""
    }
    ${
      formData.vitalsNotes
        ? `
    <div style="margin-top: 2px; font-size: 7px;">
      <strong>Notes:</strong> ${formData.vitalsNotes}
    </div>
    `
        : ""
    }
  </div>

  <div class="section">
    <div class="section-header">🏥 MEDICAL HISTORY</div>
    <div class="two-column">
      <div>
        <strong>Chronic Conditions:</strong><br>
        <div class="checkbox-grid">
          ${chronicConditionsList
            .slice(0, 12)
            .map(
              (condition) => `
            <div class="checkbox-item">
              <span class="checkbox ${formData.chronicConditions.includes(condition) ? "checked" : ""}"></span>
              ${condition}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
      <div>
        <strong>Allergies:</strong><br>
        <div class="checkbox-grid">
          ${allergyOptionsList
            .slice(0, 12)
            .map(
              (allergy) => `
            <div class="checkbox-item">
              <span class="checkbox ${formData.allergies.includes(allergy) ? "checked" : ""}"></span>
              ${allergy}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="two-column" style="margin-top: 4px;">
      <div>
        <strong>Current Medications:</strong><br>
        ${formData.currentMedications.length > 0 ? formData.currentMedications.join(", ") : "None reported"}
      </div>
      <div>
        <strong>Previous Complications:</strong><br>
        ${formData.previousComplications.length > 0 ? formData.previousComplications.join(", ") : "None reported"}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">👨‍👩‍👧‍👦 FAMILY HISTORY</div>
    <div class="checkbox-grid">
      <div class="checkbox-item">
        <span class="checkbox ${formData.familyDiabetes ? "checked" : ""}"></span>
        Diabetes
      </div>
      <div class="checkbox-item">
        <span class="checkbox ${formData.familyHypertension ? "checked" : ""}"></span>
        Hypertension
      </div>
      <div class="checkbox-item">
        <span class="checkbox ${formData.familyHeartDisease ? "checked" : ""}"></span>
        Heart Disease
      </div>
      <div class="checkbox-item">
        <span class="checkbox ${formData.familyThalassemia ? "checked" : ""}"></span>
        Thalassemia
      </div>
      <div class="checkbox-item">
        <span class="checkbox ${formData.familyMentalHealth ? "checked" : ""}"></span>
        Mental Health
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">🍽️ DIET & LIFESTYLE</div>
    <div class="four-column">
      <div><strong>Diet Type:</strong> ${formData.dietType || "Not specified"}</div>
      <div><strong>Cultural Pref:</strong> ${formData.culturalDietPreferences || "Not specified"}</div>
      <div><strong>Water Intake:</strong> ${formData.waterIntake || "--"} glasses/day</div>
      <div><strong>Sleep:</strong> ${formData.sleepHours || "--"} hours</div>
      <div><strong>Exercise:</strong> ${formData.exerciseFrequency || "Not specified"}</div>
      <div><strong>Stress Level:</strong> ${formData.stressLevel || "--"}/10</div>
      <div><strong>Smoking:</strong> ${formData.smokingStatus || "Not specified"}</div>
      <div><strong>Alcohol:</strong> ${formData.alcoholConsumption || "Not specified"}</div>
    </div>
    ${
      formData.dietaryRestrictions.length > 0
        ? `
    <div style="margin-top: 4px;">
      <strong>Dietary Restrictions:</strong> ${formData.dietaryRestrictions.join(", ")}
    </div>
    `
        : ""
    }
    ${
      formData.foodAllergies.length > 0
        ? `
    <div style="margin-top: 2px;">
      <strong>Food Allergies:</strong> ${formData.foodAllergies.join(", ")}
    </div>
    `
        : ""
    }
  </div>

  ${
    suggestedTests.length > 0
      ? `
  <div class="section">
    <div class="section-header">🧪 RECOMMENDED LAB TESTS</div>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Category</th>
          <th>Week</th>
          <th>Due Date</th>
          <th>Importance</th>
          <th>Description</th>
          <th>Normal Range</th>
        </tr>
      </thead>
      <tbody>
        ${suggestedTests
          .map(
            (test) => `
          <tr>
            <td>${test.name}</td>
            <td>${test.category}</td>
            <td>${test.recommendedWeek}</td>
            <td>${test.dueDate}</td>
            <td><span class="badge badge-${test.importance === "essential" ? "danger" : test.importance === "recommended" ? "warning" : "info"}">${test.importance}</span></td>
            <td>${test.description}</td>
            <td>${test.normalRange}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }

  ${
    pregnancyScanSchedule.length > 0
      ? `
  <div class="section">
    <div class="section-header">📅 SCAN SCHEDULE</div>
    <table>
      <thead>
        <tr>
          <th>Scan</th>
          <th>Week</th>
          <th>Scheduled</th>
          <th>Status</th>
          <th>Cost</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        ${pregnancyScanSchedule
          .map(
            (scan) => `
          <tr>
            <td>${scan.scanName}</td>
            <td>${scan.recommendedWeek}</td>
            <td>${scan.scheduledDate}</td>
            <td><span class="badge badge-${scan.status === "completed" ? "success" : scan.status === "overdue" ? "danger" : "info"}">${scan.status}</span></td>
            <td>${scan.cost}</td>
            <td>${scan.description}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }

  ${
    vaccineScheduleWithDates.length > 0
      ? `
  <div class="section">
    <div class="section-header">💉 VACCINATION SCHEDULE</div>
    <table>
      <thead>
        <tr>
          <th>Vaccine</th>
          <th>Week</th>
          <th>Scheduled</th>
          <th>Status</th>
          <th>Importance</th>
          <th>Side Effects</th>
        </tr>
      </thead>
      <tbody>
        ${vaccineScheduleWithDates
          .map(
            (vaccine) => `
          <tr>
            <td>${vaccine.vaccine}</td>
            <td>${vaccine.recommendedWeek}</td>
            <td>${vaccine.scheduledDate}</td>
            <td><span class="badge badge-${vaccine.status === "completed" ? "success" : vaccine.status === "overdue" ? "danger" : "info"}">${vaccine.status}</span></td>
            <td>${vaccine.importance}</td>
            <td>${vaccine.sideEffects}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }

  ${
    aiAnalysis
      ? `
  <div class="page-break"></div>
  
  <div class="section">
    <div class="section-header">🤖 AI ANALYSIS & RECOMMENDATIONS</div>
    <div class="two-column">
      <div>
        <strong>Risk Level:</strong> 
        <span class="badge badge-${aiAnalysis.riskLevel === "high" ? "danger" : aiAnalysis.riskLevel === "moderate" ? "warning" : "success"}">${aiAnalysis.riskLevel.toUpperCase()}</span>
      </div>
      <div>
        <strong>Assessment:</strong> ${aiAnalysis.riskAssessment.substring(0, 100)}...
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-header">📋 CLINICAL RECOMMENDATIONS</div>
    <div class="compact-list">
      <ul>
        ${aiAnalysis.recommendations.map((rec) => `<li>• ${rec}</li>`).join("")}
      </ul>
    </div>
  </div>

  ${
    aiAnalysis.warnings.length > 0
      ? `
  <div class="section">
    <div class="section-header">⚠️ CRITICAL WARNINGS</div>
    <div class="compact-list">
      <ul>
        ${aiAnalysis.warnings.map((warning) => `<li>• ${warning}</li>`).join("")}
      </ul>
    </div>
  </div>
  `
      : ""
  }

  <div class="section">
    <div class="section-header">📝 IMMEDIATE NEXT STEPS</div>
    <div class="compact-list">
      <ul>
        ${aiAnalysis.nextSteps.map((step) => `<li>• ${step}</li>`).join("")}
      </ul>
    </div>
  </div>

  ${
    aiAnalysis.dietPlan
      ? `
  <div class="section">
    <div class="section-header">🍽️ PERSONALIZED DIET PLAN</div>
    <div class="three-column" style="margin-bottom: 6px;">
      <div class="vital-item">
        <div style="font-weight: bold;">${aiAnalysis.dietPlan.dailyCalories}</div>
        <div>Daily Calories</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">${aiAnalysis.dietPlan.dailyProtein}g</div>
        <div>Daily Protein</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">T${aiAnalysis.dietPlan.trimester}</div>
        <div>Trimester</div>
      </div>
    </div>
    
    <div style="margin-bottom: 4px;">
      <strong>Key Nutrients:</strong> ${aiAnalysis.dietPlan.keyNutrients.join(", ")}
    </div>
    
    <div style="margin-bottom: 4px;">
      <strong>Foods to Avoid:</strong> ${aiAnalysis.dietPlan.avoidFoods.join(", ")}
    </div>
    
    <div>
      <strong>Hydration:</strong> ${aiAnalysis.dietPlan.hydration}
    </div>
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.dietPlan?.weeklyMealPlan
      ? `
  <div class="section">
    <div class="section-header">🍎 DETAILED WEEKLY MEAL PLAN</div>
    ${aiAnalysis.dietPlan.weeklyMealPlan
      .map(
        (dayPlan) => `
      <div class="meal-compact">
        <div class="meal-header">
          <span>${dayPlan.day}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; font-size: 6px;">
          <div>
            <strong>🌅 Breakfast:</strong> ${dayPlan.breakfast.name}<br>
            <em>Cal: ${dayPlan.breakfast.calories}, Protein: ${dayPlan.breakfast.protein}g</em>
          </div>
          <div>
            <strong>🥗 Lunch:</strong> ${dayPlan.lunch.name}<br>
            <em>Cal: ${dayPlan.lunch.calories}, Protein: ${dayPlan.lunch.protein}g</em>
          </div>
          <div>
            <strong>🍽️ Dinner:</strong> ${dayPlan.dinner.name}<br>
            <em>Cal: ${dayPlan.dinner.calories}, Protein: ${dayPlan.dinner.protein}g</em>
          </div>
        </div>
        <div style="margin-top: 2px; font-size: 6px;">
          <strong>Snacks:</strong> ${dayPlan.morningSnack.name}, ${dayPlan.afternoonSnack.name}, ${dayPlan.eveningSnack.name}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.supplements && aiAnalysis.supplements.length > 0
      ? `
  <div class="section">
    <div class="section-header">💊 RECOMMENDED SUPPLEMENTS</div>
    <table>
      <thead>
        <tr>
          <th>Supplement</th>
          <th>Dosage</th>
          <th>Timing</th>
          <th>Benefits</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${aiAnalysis.supplements
          .map(
            (supplement) => `
          <tr>
            <td>${supplement.name}</td>
            <td>${supplement.dosage}</td>
            <td>${supplement.timing}</td>
            <td>${supplement.benefits}</td>
            <td>${supplement.price}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.weeklyPredictions && aiAnalysis.weeklyPredictions.length > 0
      ? `
  <div class="section">
    <div class="section-header">📈 WEEKLY PREDICTIONS</div>
    <table>
      <thead>
        <tr>
          <th>Week</th>
          <th>Expected Changes</th>
          <th>Recommended Actions</th>
          <th>Warning Signs</th>
        </tr>
      </thead>
      <tbody>
        ${aiAnalysis.weeklyPredictions
          .map(
            (prediction) => `
          <tr>
            <td>${prediction.week}</td>
            <td>${prediction.expectedChanges.join(", ")}</td>
            <td>${prediction.recommendedActions.join(", ")}</td>
            <td>${prediction.warningSignsToWatch.join(", ")}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }
  `
      : ""
  }

  ${
    formData.selectedHospital || availableHospitals.length > 0
      ? `
  <div class="section">
    <div class="section-header">🏥 SELECTED HOSPITAL FOR DELIVERY</div>
    ${
      formData.selectedHospital
        ? `
      <div class="facility-compact">
        <div class="facility-name">✓ SELECTED: ${formData.selectedHospital.name}</div>
        <div>📍 ${formData.selectedHospital.address} • 📏 ${formData.selectedHospital.distance} • ⭐ ${formData.selectedHospital.rating}</div>
        <div>🏥 ${formData.selectedHospital.specialties}</div>
        <div>📞 ${formData.selectedHospital.phone} • 🚨 ${formData.selectedHospital.emergency}</div>
      </div>
    `
        : availableHospitals.length > 0
          ? `
      <div style="font-size: 8px; color: #666; margin-bottom: 4px;">No hospital selected. Available options:</div>
      ${availableHospitals
        .slice(0, 3)
        .map(
          (hospital) => `
        <div class="facility-compact">
          <div class="facility-name">${hospital.name}</div>
          <div>📍 ${hospital.address} • 📏 ${hospital.distance} • ⭐ ${hospital.rating}</div>
          <div>🏥 ${hospital.specialties}</div>
          <div>📞 ${hospital.phone} • 🚨 ${hospital.emergency}</div>
        </div>
      `,
        )
        .join("")}
    `
          : ""
    }
  </div>
  `
      : ""
  }

  ${
    formData.selectedLabCenter || availableLabCenters.length > 0
      ? `
  <div class="section">
    <div class="section-header">🧪 SELECTED LAB CENTER</div>
    ${
      formData.selectedLabCenter
        ? `
      <div class="facility-compact">
        <div class="facility-name">✓ SELECTED: ${formData.selectedLabCenter.name}</div>
        <div>📍 ${formData.selectedLabCenter.address} • 📏 ${formData.selectedLabCenter.distance} • ⭐ ${formData.selectedLabCenter.rating}</div>
        <div>🔬 ${formData.selectedLabCenter.specialties}</div>
        <div>📞 ${formData.selectedLabCenter.phone} • 🏠 ${formData.selectedLabCenter.emergency}</div>
      </div>
    `
        : availableLabCenters.length > 0
          ? `
      <div style="font-size: 8px; color: #666; margin-bottom: 4px;">No lab center selected. Available options:</div>
      ${availableLabCenters
        .slice(0, 3)
        .map(
          (lab) => `
        <div class="facility-compact">
          <div class="facility-name">${lab.name}</div>
          <div>📍 ${lab.address} • 📏 ${lab.distance} • ⭐ ${lab.rating}</div>
          <div>🔬 ${lab.specialties}</div>
          <div>📞 ${lab.phone} • 🏠 ${lab.emergency}</div>
        </div>
      `,
        )
        .join("")}
    `
          : ""
    }
  </div>
  `
      : ""
  }

  ${
    aiAnalysis?.clinicalNotes
      ? `
  <div class="section">
    <div class="section-header">👨‍⚕️ CLINICAL NOTES FOR HEALTHCARE PROVIDERS</div>
    <div style="font-size: 8px; line-height: 1.3;">
      ${aiAnalysis.clinicalNotes}
    </div>
  </div>
  `
      : ""
  }

  <div class="section">
    <div class="section-header">⚠️ MEDICAL DISCLAIMER</div>
    <div style="font-size: 7px; line-height: 1.2;">
      <strong>IMPORTANT:</strong> This AI-generated report is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. All recommendations must be reviewed and approved by qualified healthcare professionals before implementation. In case of medical emergencies, contact emergency services immediately (108 for India). The medications, dosages, and treatment recommendations are AI-generated suggestions that require medical validation. Always consult with licensed medical practitioners before making any medical decisions.
    </div>
  </div>

  <div class="footer">
    <p><strong>MyMedi.ai</strong> - AI-Powered Maternal Health Care | Report Generated: ${currentDate} ${currentTime} IST</p>
    <p>🌐 www.mymedi.ai | 📧 support@mymedi.ai | Emergency: 108 | Report ID: PRC-${Date.now().toString().slice(-8)}</p>
    <p>This report contains comprehensive pregnancy care information including ${formData.currentWeek ? `Week ${formData.currentWeek}` : "pregnancy"} details, medical history, lifestyle factors, and AI-driven recommendations.</p>
  </div>
</body>
</html>
  `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 1000)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      // Reset all form data to initial state
      setFormData({
        // Personal Information
        motherName: "",
        motherAge: 0,
        motherHeight: 0,
        motherWeight: 0,
        prePregnancyWeight: 0,
        motherBloodType: "",
        motherRhFactor: "",
        motherOccupation: "",
        motherEducation: "",
        motherIncome: "",
        fatherName: "",
        fatherAge: 0,
        fatherBloodType: "",
        fatherRhFactor: "",
        fatherOccupation: "",
        fatherEducation: "",
        maritalStatus: "",
        marriageDuration: "",

        // Pregnancy Details
        lastPeriodDate: "",
        expectedDeliveryDate: "",
        currentWeek: 0,
        currentTrimester: 1,
        pregnancyType: "",
        plannedPregnancy: false,
        conceptionMethod: "",
        previousMiscarriages: 0,
        previousAbortions: 0,

        // Medical History
        chronicConditions: [],
        allergies: [],
        previousSurgeries: [],
        currentMedications: [],
        familyDiabetes: false,
        familyHypertension: false,
        familyHeartDisease: false,
        familyThalassemia: false,
        familyMentalHealth: false,
        previousPregnancies: 0,
        previousComplications: [],
        bloodTransfusionHistory: false,
        vaccinationStatus: [],

        // Current Health & Vitals
        bloodPressureSystolic: 0,
        bloodPressureDiastolic: 0,
        heartRate: 0,
        temperature: 0,
        weight: 0,
        bmi: 0,
        fundalHeight: 0,
        fetalHeartRate: 0,
        respiratoryRate: 0,
        oxygenSaturation: 0,
        bloodSugar: 0,
        hemoglobin: 0,
        currentSymptoms: [],
        vitalsTiming: "",
        vitalsNotes: "",

        // Scans & Tests
        scansAndTests: [],

        // Lifestyle & Diet
        smokingStatus: "",
        alcoholConsumption: "",
        tobaccoUse: "",
        exerciseFrequency: "",
        dietType: "",
        stressLevel: 0,
        sleepHours: 0,
        workEnvironment: "",
        exposureToChemicals: false,
        domesticViolence: "",

        // Diet Customization
        dietaryRestrictions: [],
        foodAllergies: [],
        culturalDietPreferences: "",
        mealPreferences: [],
        cookingTime: "",
        budgetRange: "",
        favoriteIngredients: [],
        dislikedFoods: [],
        waterIntake: 0,
        supplementsUsed: [],

        // Location
        location: undefined,
      })

      // Reset other states
      setAiAnalysis(null)
      setAnalysisGenerated(false)
      setPregnancyScanSchedule([])
      setVaccineScheduleWithDates([])
      setAvailableHospitals([])
      setAvailableLabCenters([])
      setSuggestedTests([])
      setActiveTab("form")
    }
  }

  // Options for form dropdowns
  const educationOptions = [
    "No formal education",
    "Primary education",
    "Secondary education",
    "Higher secondary",
    "Graduate",
    "Post-graduate",
    "Professional degree",
  ]

  const occupationOptions = [
    "Homemaker",
    "Student",
    "Teacher",
    "Healthcare worker",
    "Government employee",
    "Private employee",
    "Business owner",
    "Farmer",
    "Laborer",
    "Professional",
    "Retired",
    "Unemployed",
  ]

  const incomeOptions = [
    "Below ₹1 lakh/year",
    "₹1-3 lakhs/year",
    "₹3-5 lakhs/year",
    "₹5-10 lakhs/year",
    "₹10-20 lakhs/year",
    "Above ₹20 lakhs/year",
  ]

  const conceptionMethodOptions = [
    "Natural conception",
    "IUI (Intrauterine Insemination)",
    "IVF (In Vitro Fertilization)",
    "ICSI (Intracytoplasmic Sperm Injection)",
    "Donor egg",
    "Donor sperm",
    "Surrogacy",
  ]

  const chronicConditions = [
    "Diabetes Type 1",
    "Diabetes Type 2",
    "Gestational Diabetes (previous)",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "COPD",
    "Thyroid Disease (Hypo/Hyper)",
    "Kidney Disease",
    "Liver Disease",
    "Autoimmune Disease",
    "Depression",
    "Anxiety",
    "Epilepsy",
    "Migraine",
    "Arthritis",
    "Osteoporosis",
    "Cancer History",
    "PCOS",
    "Endometriosis",
  ]

  const allergyOptions = [
    "Penicillin",
    "Sulfa Drugs",
    "Aspirin",
    "Ibuprofen",
    "Codeine",
    "Latex",
    "Peanuts",
    "Tree Nuts",
    "Shellfish",
    "Fish",
    "Eggs",
    "Milk",
    "Soy",
    "Wheat",
    "Sesame",
    "Mustard",
    "Celery",
    "Lupin",
    "Mollusks",
    "Sulfites",
  ]

  const surgeryOptions = [
    "Appendectomy",
    "Gallbladder Surgery",
    "Hernia Repair",
    "C-Section",
    "Hysterectomy",
    "Ovarian Surgery",
    "Breast Surgery",
    "Thyroid Surgery",
    "Heart Surgery",
    "Orthopedic Surgery",
    "Laparoscopy",
    "D&C (Dilation and Curettage)",
  ]

  const medicationOptions = [
    "Insulin",
    "Metformin",
    "Blood Pressure Medications",
    "Thyroid Medications",
    "Antidepressants",
    "Anti-anxiety Medications",
    "Asthma Inhalers",
    "Birth Control Pills",
    "Pain Medications",
    "Vitamins",
    "Iron supplements",
    "Calcium supplements",
    "Folic acid",
  ]

  const complicationOptions = [
    "Gestational Diabetes",
    "Preeclampsia",
    "Eclampsia",
    "Placenta Previa",
    "Placental Abruption",
    "Preterm Labor",
    "IUGR (Intrauterine Growth Restriction)",
    "Polyhydramnios",
    "Oligohydramnios",
    "Hyperemesis Gravidarum",
    "Cholestasis",
    "HELLP Syndrome",
    "Postpartum Hemorrhage",
    "Postpartum Depression",
    "Cervical Incompetence",
    "Antepartum Hemorrhage",
  ]

  const vaccinationOptions = [
    "Tetanus Toxoid (TT)",
    "Hepatitis B",
    "Influenza",
    "COVID-19",
    "Tdap (Tetanus, Diphtheria, Pertussis)",
    "MMR (Measles, Mumps, Rubella)",
    "Varicella (Chickenpox)",
    "HPV",
  ]

  const dietaryRestrictionOptions = [
    "Vegetarian",
    "Vegan",
    "Jain Vegetarian",
    "Gluten-Free",
    "Dairy-Free",
    "Low-Sodium",
    "Low-Sugar",
    "Diabetic Diet",
    "High-Protein",
    "Low-Fat",
    "DASH Diet",
  ]

  const foodAllergyOptions = [
    "Peanuts",
    "Tree Nuts",
    "Shellfish",
    "Fish",
    "Eggs",
    "Milk",
    "Soy",
    "Wheat",
    "Sesame",
    "Mustard",
    "Celery",
    "Lupin",
    "Mollusks",
    "Sulfites",
  ]

  const mealPreferenceOptions = [
    "Traditional Indian",
    "North Indian",
    "South Indian",
    "Bengali",
    "Gujarati",
    "Punjabi",
    "Quick & Easy",
    "Home-cooked",
    "Spicy Food",
    "Mild Flavors",
    "Fresh & Raw",
    "Cooked & Warm",
  ]

  const ingredientOptions = [
    "Chicken",
    "Fish",
    "Mutton",
    "Eggs",
    "Paneer",
    "Tofu",
    "Dal/Lentils",
    "Beans",
    "Quinoa",
    "Rice",
    "Wheat/Roti",
    "Vegetables",
    "Fruits",
    "Nuts",
    "Seeds",
    "Dairy",
    "Coconut",
    "Ghee",
  ]

  const symptomOptions = [
    "Nausea",
    "Vomiting",
    "Fatigue",
    "Headache",
    "Back Pain",
    "Heartburn",
    "Constipation",
    "Swelling",
    "Shortness of Breath",
    "Dizziness",
    "Mood Changes",
    "Sleep Issues",
    "Breast Tenderness",
    "Frequent Urination",
    "Food Cravings",
    "Food Aversions",
  ]

  const workEnvironmentOptions = [
    "Office/Indoor",
    "Factory/Industrial",
    "Healthcare facility",
    "Educational institution",
    "Outdoor/Field work",
    "Home-based",
    "Laboratory",
    "Construction site",
    "Agricultural",
    "Transportation",
  ]

  const supplementOptions = [
    "Prenatal Multivitamin",
    "Folic Acid",
    "Iron",
    "Calcium",
    "Vitamin D",
    "Omega-3/DHA",
    "Vitamin B12",
    "Zinc",
    "Magnesium",
    "Probiotics",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MyMedLogo className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Comprehensive Pregnancy Care
              </h1>
              <p className="text-gray-600">Following IMC & WHO Guidelines for Maternal Care</p>
            </div>
          </div>

          {/* Home and Reset Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="flex items-center gap-2 bg-transparent border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <MapPin className="h-4 w-4" />
              Home
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All Data
            </Button>
          </div>

          {/* Location Status */}
          {isLoadingLocation && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Detecting location...</span>
            </div>
          )}

          {formData.location && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                📍 {formData.location.city}, {formData.location.state}, {formData.location.country}
              </span>
            </div>
          )}

          {locationError && (
            <Alert className="mb-4 max-w-md mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Print/Download Buttons */}
        {aiAnalysis && (
          <div className="flex justify-center gap-4 mb-6">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        )}

        {/* Colored Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6 bg-gradient-to-r from-blue-100 to-purple-100">
            <TabsTrigger
              value="form"
              className="flex items-center gap-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Baby className="h-3 w-3" />
              Form
            </TabsTrigger>
            <TabsTrigger
              value="scan-schedule"
              className="flex items-center gap-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Calendar className="h-3 w-3" />
              Scan Schedule
            </TabsTrigger>
            <TabsTrigger
              value="vaccine-schedule"
              className="flex items-center gap-1 data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Syringe className="h-3 w-3" />
              Vaccines
            </TabsTrigger>
            <TabsTrigger
              value="diet"
              className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Utensils className="h-3 w-3" />
              Diet
            </TabsTrigger>
            <TabsTrigger
              value="supplements"
              className="flex items-center gap-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Pill className="h-3 w-3" />
              Supplements
            </TabsTrigger>
            <TabsTrigger
              value="hospitals"
              className="flex items-center gap-1 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
            >
              <Building2 className="h-3 w-3" />
              Hospitals
            </TabsTrigger>
            <TabsTrigger
              value="labs"
              className="flex items-center gap-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
            >
              <TestTube className="h-3 w-3" />
              Labs
            </TabsTrigger>
            <TabsTrigger
              value="detailed-diet"
              className="flex items-center gap-1 data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              <Apple className="h-3 w-3" />
              Detailed Diet
            </TabsTrigger>
          </TabsList>

          {/* Form Tab - Full Pregnancy Form */}
          <TabsContent value="form" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  Comprehensive Pregnancy Care Form (IMC & WHO Guidelines)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="motherName">Mother's Full Name *</Label>
                      <Input
                        id="motherName"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange("motherName", e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherAge">Age *</Label>
                      <Input
                        id="motherAge"
                        type="number"
                        value={formData.motherAge}
                        onChange={(e) => handleInputChange("motherAge", Number.parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherHeight">Height (cm) *</Label>
                      <Input
                        id="motherHeight"
                        type="number"
                        value={formData.motherHeight}
                        onChange={(e) => handleInputChange("motherHeight", Number.parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherWeight">Current Weight (kg) *</Label>
                      <Input
                        id="motherWeight"
                        type="number"
                        value={formData.motherWeight}
                        onChange={(e) => handleInputChange("motherWeight", Number.parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prePregnancyWeight">Pre-pregnancy Weight (kg) *</Label>
                      <Input
                        id="prePregnancyWeight"
                        type="number"
                        value={formData.prePregnancyWeight}
                        onChange={(e) => handleInputChange("prePregnancyWeight", Number.parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherEducation">Education Level</Label>
                      <Select
                        value={formData.motherEducation}
                        onValueChange={(value) => handleInputChange("motherEducation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationOptions.map((education) => (
                            <SelectItem key={education} value={education}>
                              {education}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="motherOccupation">Occupation</Label>
                      <Select
                        value={formData.motherOccupation}
                        onValueChange={(value) => handleInputChange("motherOccupation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          {occupationOptions.map((occupation) => (
                            <SelectItem key={occupation} value={occupation}>
                              {occupation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="motherIncome">Annual Income</Label>
                      <Select
                        value={formData.motherIncome}
                        onValueChange={(value) => handleInputChange("motherIncome", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeOptions.map((income) => (
                            <SelectItem key={income} value={income}>
                              {income}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="motherBloodType">Blood Type</Label>
                      <Select
                        value={formData.motherBloodType}
                        onValueChange={(value) => handleInputChange("motherBloodType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="O">O</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="motherRhFactor">Rh Factor</Label>
                      <Select
                        value={formData.motherRhFactor}
                        onValueChange={(value) => handleInputChange("motherRhFactor", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Rh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+">Positive (+)</SelectItem>
                          <SelectItem value="-">Negative (-)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select
                        value={formData.maritalStatus}
                        onValueChange={(value) => handleInputChange("maritalStatus", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="unmarried">Unmarried</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="marriageDuration">Marriage Duration</Label>
                      <Input
                        id="marriageDuration"
                        value={formData.marriageDuration}
                        onChange={(e) => handleInputChange("marriageDuration", e.target.value)}
                        placeholder="e.g., 2 years"
                      />
                    </div>
                  </div>
                </div>

                {/* Pregnancy Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600 border-b pb-2">Pregnancy Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="lastPeriodDate">Last Menstrual Period (LMP) *</Label>
                      <Input
                        id="lastPeriodDate"
                        type="date"
                        value={formData.lastPeriodDate}
                        onChange={(e) => handleInputChange("lastPeriodDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pregnancyType">Pregnancy Type</Label>
                      <Select
                        value={formData.pregnancyType}
                        onValueChange={(value) => handleInputChange("pregnancyType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pregnancy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="singleton">Singleton</SelectItem>
                          <SelectItem value="twins">Twins</SelectItem>
                          <SelectItem value="triplets">Triplets</SelectItem>
                          <SelectItem value="higher-order">Higher Order Multiple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="conceptionMethod">Conception Method</Label>
                      <Select
                        value={formData.conceptionMethod}
                        onValueChange={(value) => handleInputChange("conceptionMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select conception method" />
                        </SelectTrigger>
                        <SelectContent>
                          {conceptionMethodOptions.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="plannedPregnancy"
                        checked={formData.plannedPregnancy}
                        onCheckedChange={(checked) => handleInputChange("plannedPregnancy", checked as boolean)}
                      />
                      <Label htmlFor="plannedPregnancy">This is a planned pregnancy</Label>
                    </div>
                    <div>
                      <Label htmlFor="previousPregnancies">Number of Previous Pregnancies</Label>
                      <Input
                        id="previousPregnancies"
                        type="number"
                        value={formData.previousPregnancies}
                        onChange={(e) => handleInputChange("previousPregnancies", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="previousMiscarriages">Previous Miscarriages</Label>
                      <Input
                        id="previousMiscarriages"
                        type="number"
                        value={formData.previousMiscarriages}
                        onChange={(e) =>
                          handleInputChange("previousMiscarriages", Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="previousAbortions">Previous Abortions</Label>
                      <Input
                        id="previousAbortions"
                        type="number"
                        value={formData.previousAbortions}
                        onChange={(e) => handleInputChange("previousAbortions", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  {formData.currentWeek > 0 && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div>
                        <Label>Current Week</Label>
                        <div className="text-2xl font-bold text-blue-600">{formData.currentWeek} weeks</div>
                      </div>
                      <div>
                        <Label>Trimester</Label>
                        <div className="text-2xl font-bold text-purple-600">{formData.currentTrimester}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Medical History - Enhanced */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 border-b pb-2">Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Chronic Conditions</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {chronicConditions.map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={`chronic-${condition}`}
                              checked={formData.chronicConditions.includes(condition)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("chronicConditions", condition, checked as boolean)
                              }
                            />
                            <Label htmlFor={`chronic-${condition}`} className="text-sm">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Known Allergies</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {allergyOptions.map((allergy) => (
                          <div key={allergy} className="flex items-center space-x-2">
                            <Checkbox
                              id={`allergy-${allergy}`}
                              checked={formData.allergies.includes(allergy)}
                              onCheckedChange={(checked) => handleMultiSelect("allergies", allergy, checked as boolean)}
                            />
                            <Label htmlFor={`allergy-${allergy}`} className="text-sm">
                              {allergy}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Previous Surgeries</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {surgeryOptions.map((surgery) => (
                          <div key={surgery} className="flex items-center space-x-2">
                            <Checkbox
                              id={`surgery-${surgery}`}
                              checked={formData.previousSurgeries.includes(surgery)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("previousSurgeries", surgery, checked as boolean)
                              }
                            />
                            <Label htmlFor={`surgery-${surgery}`} className="text-sm">
                              {surgery}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Current Medications</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {medicationOptions.map((medication) => (
                          <div key={medication} className="flex items-center space-x-2">
                            <Checkbox
                              id={`medication-${medication}`}
                              checked={formData.currentMedications.includes(medication)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("currentMedications", medication, checked as boolean)
                              }
                            />
                            <Label htmlFor={`medication-${medication}`} className="text-sm">
                              {medication}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Previous Pregnancy Complications</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {complicationOptions.map((complication) => (
                          <div key={complication} className="flex items-center space-x-2">
                            <Checkbox
                              id={`complication-${complication}`}
                              checked={formData.previousComplications.includes(complication)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("previousComplications", complication, checked as boolean)
                              }
                            />
                            <Label htmlFor={`complication-${complication}`} className="text-sm">
                              {complication}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Vaccination Status</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {vaccinationOptions.map((vaccine) => (
                          <div key={vaccine} className="flex items-center space-x-2">
                            <Checkbox
                              id={`vaccine-${vaccine}`}
                              checked={formData.vaccinationStatus.includes(vaccine)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("vaccinationStatus", vaccine, checked as boolean)
                              }
                            />
                            <Label htmlFor={`vaccine-${vaccine}`} className="text-sm">
                              {vaccine}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Medical History - Enhanced */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-600 border-b pb-2">Family Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="familyDiabetes"
                        checked={formData.familyDiabetes}
                        onCheckedChange={(checked) => handleInputChange("familyDiabetes", checked as boolean)}
                      />
                      <Label htmlFor="familyDiabetes">Family History of Diabetes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="familyHypertension"
                        checked={formData.familyHypertension}
                        onCheckedChange={(checked) => handleInputChange("familyHypertension", checked as boolean)}
                      />
                      <Label htmlFor="familyHypertension">Family History of Hypertension</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="familyHeartDisease"
                        checked={formData.familyHeartDisease}
                        onCheckedChange={(checked) => handleInputChange("familyHeartDisease", checked as boolean)}
                      />
                      <Label htmlFor="familyHeartDisease">Family History of Heart Disease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="familyThalassemia"
                        checked={formData.familyThalassemia}
                        onCheckedChange={(checked) => handleInputChange("familyThalassemia", checked as boolean)}
                      />
                      <Label htmlFor="familyThalassemia">Family History of Thalassemia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="familyMentalHealth"
                        checked={formData.familyMentalHealth}
                        onCheckedChange={(checked) => handleInputChange("familyMentalHealth", checked as boolean)}
                      />
                      <Label htmlFor="familyMentalHealth">Family History of Mental Health Issues</Label>
                    </div>
                  </div>
                </div>

                {/* Current Vitals - Enhanced */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-600 border-b pb-2">Current Vitals & Health Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic)</Label>
                      <Input
                        id="bloodPressureSystolic"
                        type="number"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) =>
                          handleInputChange("bloodPressureSystolic", Number.parseInt(e.target.value) || 0)
                        }
                        placeholder="e.g., 120"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodPressureDiastolic">Blood Pressure (Diastolic)</Label>
                      <Input
                        id="bloodPressureDiastolic"
                        type="number"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) =>
                          handleInputChange("bloodPressureDiastolic", Number.parseInt(e.target.value) || 0)
                        }
                        placeholder="e.g., 80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        value={formData.heartRate}
                        onChange={(e) => handleInputChange("heartRate", Number.parseInt(e.target.value) || 0)}
                        placeholder="e.g., 72"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange("temperature", Number.parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 98.6"
                      />
                    </div>
                    <div>
                      <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                      <Input
                        id="respiratoryRate"
                        type="number"
                        value={formData.respiratoryRate}
                        onChange={(e) => handleInputChange("respiratoryRate", Number.parseInt(e.target.value) || 0)}
                        placeholder="e.g., 16"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                      <Input
                        id="oxygenSaturation"
                        type="number"
                        value={formData.oxygenSaturation}
                        onChange={(e) => handleInputChange("oxygenSaturation", Number.parseInt(e.target.value) || 0)}
                        placeholder="e.g., 98"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="bloodSugar"
                        type="number"
                        value={formData.bloodSugar}
                        onChange={(e) => handleInputChange("bloodSugar", Number.parseInt(e.target.value) || 0)}
                        placeholder="e.g., 90"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                      <Input
                        id="hemoglobin"
                        type="number"
                        step="0.1"
                        value={formData.hemoglobin}
                        onChange={(e) => handleInputChange("hemoglobin", Number.parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 12.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fundalHeight">Fundal Height (cm)</Label>
                      <Input
                        id="fundalHeight"
                        type="number"
                        value={formData.fundalHeight}
                        onChange={(e) => handleInputChange("fundalHeight", Number.parseInt(e.target.value) || 0)}
                        placeholder="e.g., 24"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fetalHeartRate">Fetal Heart Rate (bpm)</Label>
                      <Input
                        id="fetalHeartRate"
                        type="number"
                        value={formData.fetalHeartRate}
                        onChange={(e) => handleInputChange("fetalHeartRate", Number.parseInt(e.target.value) || 0)}
                        placeholder="e.g., 140"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vitalsTiming">When were vitals taken?</Label>
                      <Input
                        id="vitalsTiming"
                        value={formData.vitalsTiming}
                        onChange={(e) => handleInputChange("vitalsTiming", e.target.value)}
                        placeholder="e.g., Today morning, Yesterday"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Current Symptoms</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                      {symptomOptions.map((symptom) => (
                        <div key={symptom} className="flex items-center space-x-2">
                          <Checkbox
                            id={`symptom-${symptom}`}
                            checked={formData.currentSymptoms.includes(symptom)}
                            onCheckedChange={(checked) =>
                              handleMultiSelect("currentSymptoms", symptom, checked as boolean)
                            }
                          />
                          <Label htmlFor={`symptom-${symptom}`} className="text-sm">
                            {symptom}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="vitalsNotes">Additional Notes about Current Health</Label>
                    <Textarea
                      id="vitalsNotes"
                      value={formData.vitalsNotes}
                      onChange={(e) => handleInputChange("vitalsNotes", e.target.value)}
                      placeholder="Any additional information about your current health status..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Lifestyle & Diet Preferences - Enhanced */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2">Lifestyle & Diet Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="smokingStatus">Smoking Status</Label>
                      <Select
                        value={formData.smokingStatus}
                        onValueChange={(value) => handleInputChange("smokingStatus", value)}
                      >
                        <SelectTrigger>
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
                      <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                      <Select
                        value={formData.alcoholConsumption}
                        onValueChange={(value) => handleInputChange("alcoholConsumption", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select alcohol consumption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="rarely">Rarely</SelectItem>
                          <SelectItem value="occasionally">Occasionally</SelectItem>
                          <SelectItem value="regularly">Regularly</SelectItem>
                          <SelectItem value="stopped-for-pregnancy">Stopped for pregnancy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tobaccoUse">Tobacco Use</Label>
                      <Select
                        value={formData.tobaccoUse}
                        onValueChange={(value) => handleInputChange("tobaccoUse", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tobacco use" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never used</SelectItem>
                          <SelectItem value="former">Former user</SelectItem>
                          <SelectItem value="current">Current user</SelectItem>
                          <SelectItem value="chewing">Chewing tobacco</SelectItem>
                          <SelectItem value="smoking">Smoking tobacco</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                      <Select
                        value={formData.exerciseFrequency}
                        onValueChange={(value) => handleInputChange("exerciseFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exercise frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No exercise</SelectItem>
                          <SelectItem value="light">Light (1-2 times/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-4 times/week)</SelectItem>
                          <SelectItem value="active">Active (5-6 times/week)</SelectItem>
                          <SelectItem value="very-active">Very active (daily)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dietType">Diet Type</Label>
                      <Select value={formData.dietType} onValueChange={(value) => handleInputChange("dietType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="omnivore">Omnivore</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="jain-vegetarian">Jain Vegetarian</SelectItem>
                          <SelectItem value="pescatarian">Pescatarian</SelectItem>
                          <SelectItem value="eggetarian">Eggetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="culturalDietPreferences">Cultural Diet Preferences</Label>
                      <Input
                        id="culturalDietPreferences"
                        value={formData.culturalDietPreferences}
                        onChange={(e) => handleInputChange("culturalDietPreferences", e.target.value)}
                        placeholder="e.g., North Indian, South Indian, Bengali"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                      <Input
                        id="stressLevel"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.stressLevel}
                        onChange={(e) => handleInputChange("stressLevel", Number.parseInt(e.target.value) || 5)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleepHours">Average Sleep Hours</Label>
                      <Input
                        id="sleepHours"
                        type="number"
                        min="1"
                        max="12"
                        value={formData.sleepHours}
                        onChange={(e) => handleInputChange("sleepHours", Number.parseInt(e.target.value) || 8)}
                        placeholder="e.g., 8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="waterIntake">Daily Water Intake (glasses)</Label>
                      <Input
                        id="waterIntake"
                        type="number"
                        value={formData.waterIntake}
                        onChange={(e) => handleInputChange("waterIntake", Number.parseInt(e.target.value) || 8)}
                        placeholder="e.g., 8"
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Diet Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-600 border-b pb-2">Detailed Diet Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Dietary Restrictions</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {dietaryRestrictionOptions.map((restriction) => (
                          <div key={restriction} className="flex items-center space-x-2">
                            <Checkbox
                              id={`diet-restriction-${restriction}`}
                              checked={formData.dietaryRestrictions.includes(restriction)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("dietaryRestrictions", restriction, checked as boolean)
                              }
                            />
                            <Label htmlFor={`diet-restriction-${restriction}`} className="text-sm">
                              {restriction}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Food Allergies</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {foodAllergyOptions.map((allergy) => (
                          <div key={allergy} className="flex items-center space-x-2">
                            <Checkbox
                              id={`food-allergy-${allergy}`}
                              checked={formData.foodAllergies.includes(allergy)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("foodAllergies", allergy, checked as boolean)
                              }
                            />
                            <Label htmlFor={`food-allergy-${allergy}`} className="text-sm">
                              {allergy}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Meal Preferences</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {mealPreferenceOptions.map((preference) => (
                          <div key={preference} className="flex items-center space-x-2">
                            <Checkbox
                              id={`meal-pref-${preference}`}
                              checked={formData.mealPreferences.includes(preference)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("mealPreferences", preference, checked as boolean)
                              }
                            />
                            <Label htmlFor={`meal-pref-${preference}`} className="text-sm">
                              {preference}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Favorite Ingredients</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {ingredientOptions.map((ingredient) => (
                          <div key={ingredient} className="flex items-center space-x-2">
                            <Checkbox
                              id={`ingredient-${ingredient}`}
                              checked={formData.favoriteIngredients.includes(ingredient)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("favoriteIngredients", ingredient, checked as boolean)
                              }
                            />
                            <Label htmlFor={`ingredient-${ingredient}`} className="text-sm">
                              {ingredient}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Current Supplements</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                        {supplementOptions.map((supplement) => (
                          <div key={supplement} className="flex items-center space-x-2">
                            <Checkbox
                              id={`supplement-${supplement}`}
                              checked={formData.supplementsUsed.includes(supplement)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("supplementsUsed", supplement, checked as boolean)
                              }
                            />
                            <Label htmlFor={`supplement-${supplement}`} className="text-sm">
                              {supplement}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cookingTime">Available Cooking Time</Label>
                      <Select
                        value={formData.cookingTime}
                        onValueChange={(value) => handleInputChange("cookingTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cooking time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal (15-30 min)</SelectItem>
                          <SelectItem value="moderate">Moderate (30-60 min)</SelectItem>
                          <SelectItem value="extensive">Extensive (1+ hours)</SelectItem>
                          <SelectItem value="meal-prep">Meal prep on weekends</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budgetRange">Food Budget Range</Label>
                      <Select
                        value={formData.budgetRange}
                        onValueChange={(value) => handleInputChange("budgetRange", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (₹3000-5000/month)</SelectItem>
                          <SelectItem value="moderate">Moderate (₹5000-8000/month)</SelectItem>
                          <SelectItem value="high">High (₹8000-12000/month)</SelectItem>
                          <SelectItem value="premium">Premium (₹12000+/month)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Generate Analysis Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={generateAIAnalysis}
                    disabled={isGeneratingAnalysis || !formData.motherName || !formData.lastPeriodDate}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGeneratingAnalysis ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating AI Analysis...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-5 w-5" />
                        Generate AI Analysis (IMC & WHO Guidelines)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scan Schedule Tab */}
          <TabsContent value="scan-schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Pregnancy Scan Schedule with Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pregnancyScanSchedule.length > 0 ? (
                  <div className="space-y-4">
                    {pregnancyScanSchedule.map((scan) => (
                      <Card
                        key={scan.id}
                        className={`p-4 border-l-4 ${
                          scan.status === "completed"
                            ? "border-l-green-500 bg-green-50"
                            : scan.status === "overdue"
                              ? "border-l-red-500 bg-red-50"
                              : "border-l-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg">{scan.scanName}</h4>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                scan.importance === "essential"
                                  ? "destructive"
                                  : scan.importance === "recommended"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {scan.importance}
                            </Badge>
                            <Badge
                              variant={
                                scan.status === "completed"
                                  ? "default"
                                  : scan.status === "overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {scan.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Recommended Week</Label>
                            <div className="text-sm font-medium">Week {scan.recommendedWeek}</div>
                          </div>
                          <div>
                            <Label>Scheduled Date</Label>
                            <Input
                              type="date"
                              value={scan.scheduledDate}
                              onChange={(e) => updateScanSchedule(scan.id, "scheduledDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Actual Date (if completed)</Label>
                            <Input
                              type="date"
                              value={scan.actualDate || ""}
                              onChange={(e) => updateScanSchedule(scan.id, "actualDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Cost</Label>
                            <div className="text-sm font-medium text-green-600">{scan.cost}</div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Description:</strong> {scan.description}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-blue-50 rounded">
                            <strong>IMC Guideline:</strong> {scan.imcGuideline}
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <strong>WHO Guideline:</strong> {scan.whoGuideline}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Please enter your pregnancy details to view the scan schedule.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vaccine Schedule Tab */}
          <TabsContent value="vaccine-schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5" />
                  Pregnancy Vaccination Schedule with Dates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vaccineScheduleWithDates.length > 0 ? (
                  <div className="space-y-4">
                    {vaccineScheduleWithDates.map((vaccine) => (
                      <Card
                        key={vaccine.id}
                        className={`p-4 border-l-4 ${
                          vaccine.status === "completed"
                            ? "border-l-green-500 bg-green-50"
                            : vaccine.status === "overdue"
                              ? "border-l-red-500 bg-red-50"
                              : "border-l-blue-500 bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg">{vaccine.vaccine}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{vaccine.importance}</Badge>
                            <Badge
                              variant={
                                vaccine.status === "completed"
                                  ? "default"
                                  : vaccine.status === "overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {vaccine.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Recommended Week</Label>
                            <div className="text-sm font-medium">Week {vaccine.recommendedWeek}</div>
                          </div>
                          <div>
                            <Label>Scheduled Date</Label>
                            <Input
                              type="date"
                              value={vaccine.scheduledDate}
                              onChange={(e) => updateVaccineSchedule(vaccine.id, "scheduledDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Actual Date (if given)</Label>
                            <Input
                              type="date"
                              value={vaccine.actualDate || ""}
                              onChange={(e) => updateVaccineSchedule(vaccine.id, "actualDate", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Description:</strong> {vaccine.description}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-2">
                          <div className="p-2 bg-yellow-50 rounded">
                            <strong>Side Effects:</strong> {vaccine.sideEffects}
                          </div>
                          <div className="p-2 bg-red-50 rounded">
                            <strong>Contraindications:</strong> {vaccine.contraindications}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-blue-50 rounded">
                            <strong>IMC Guideline:</strong> {vaccine.imcGuideline}
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <strong>WHO Guideline:</strong> {vaccine.whoGuideline}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Syringe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Please enter your pregnancy details to view the vaccination schedule.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diet Tab */}
          <TabsContent value="diet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Personalized Diet Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysis?.dietPlan ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{aiAnalysis.dietPlan.dailyCalories}</div>
                        <div className="text-sm text-gray-600">Daily Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{aiAnalysis.dietPlan.dailyProtein}g</div>
                        <div className="text-sm text-gray-600">Daily Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          Trimester {aiAnalysis.dietPlan.trimester}
                        </div>
                        <div className="text-sm text-gray-600">Current Phase</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Nutrients</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.dietPlan.keyNutrients.map((nutrient, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50">
                            {nutrient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Foods to Avoid</h4>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-sm text-red-700">{aiAnalysis.dietPlan.avoidFoods.join(", ")}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Hydration Guidelines</h4>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700">{aiAnalysis.dietPlan.hydration}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2 text-blue-700">IMC Recommendations</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.dietPlan.imcRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold mb-2 text-green-700">WHO Recommendations</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.dietPlan.whoRecommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Generate AI analysis to view your personalized diet plan.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplements Tab */}
          <TabsContent value="supplements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Recommended Supplements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysis?.supplements ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiAnalysis.supplements.map((supplement, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg">{supplement.name}</h4>
                          <Badge variant="outline">{supplement.price}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Dosage:</strong> {supplement.dosage}
                          </div>
                          <div>
                            <strong>Timing:</strong> {supplement.timing}
                          </div>
                          <div>
                            <strong>Benefits:</strong> {supplement.benefits}
                          </div>
                          <div>
                            <strong>Brands:</strong> {supplement.brands}
                          </div>
                          {supplement.warnings && (
                            <div className="p-2 bg-yellow-50 rounded text-yellow-800">
                              <strong>Warnings:</strong> {supplement.warnings}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Generate AI analysis to view your supplement recommendations.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Nearby Hospitals for Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Hospital Selection for Report */}
                {availableHospitals.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Select Hospital for Report</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Choose your preferred hospital to include in the printed report:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableHospitals.map((hospital) => (
                        <Button
                          key={hospital.id}
                          onClick={() => handleHospitalSelection(hospital)}
                          variant={formData.selectedHospital?.id === hospital.id ? "default" : "outline"}
                          className={`text-sm ${
                            formData.selectedHospital?.id === hospital.id
                              ? "bg-blue-600 text-white"
                              : "bg-transparent border-blue-300 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          {hospital.name}
                          {formData.selectedHospital?.id === hospital.id && " ✓"}
                        </Button>
                      ))}
                    </div>
                    {formData.selectedHospital && (
                      <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                        <p className="text-sm text-green-700">
                          ✓ Selected: <strong>{formData.selectedHospital.name}</strong> will be included in your report
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {availableHospitals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableHospitals.map((hospital) => (
                      <Card
                        key={hospital.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          formData.selectedHospital?.id === hospital.id
                            ? "border-blue-500 bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleHospitalSelection(hospital)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg">{hospital.name}</h4>
                          <Badge variant="outline">{hospital.rating}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Address:</strong> {hospital.address}
                          </div>
                          <div>
                            <strong>Distance:</strong> {hospital.distance}
                          </div>
                          <div>
                            <strong>Specialties:</strong> {hospital.specialties}
                          </div>
                          <div>
                            <strong>Phone:</strong> {hospital.phone}
                          </div>
                          <div className="p-2 bg-green-50 rounded text-green-800">
                            <strong>Emergency:</strong> {hospital.emergency}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Location detection required to show nearby hospitals.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Labs Tab */}
          <TabsContent value="labs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Nearby Lab Centers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Lab Selection for Report */}
                {availableLabCenters.length > 0 && (
                  <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">Select Lab Center for Report</h4>
                    <p className="text-sm text-purple-700 mb-3">
                      Choose your preferred lab center to include in the printed report:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableLabCenters.map((lab) => (
                        <Button
                          key={lab.id}
                          onClick={() => handleLabSelection(lab)}
                          variant={formData.selectedLabCenter?.id === lab.id ? "default" : "outline"}
                          className={`text-sm ${
                            formData.selectedLabCenter?.id === lab.id
                              ? "bg-purple-600 text-white"
                              : "bg-transparent border-purple-300 text-purple-700 hover:bg-purple-100"
                          }`}
                        >
                          {lab.name}
                          {formData.selectedLabCenter?.id === lab.id && " ✓"}
                        </Button>
                      ))}
                    </div>
                    {formData.selectedLabCenter && (
                      <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                        <p className="text-sm text-green-700">
                          ✓ Selected: <strong>{formData.selectedLabCenter.name}</strong> will be included in your report
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {availableLabCenters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableLabCenters.map((lab) => (
                      <Card
                        key={lab.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          formData.selectedLabCenter?.id === lab.id
                            ? "border-purple-500 bg-purple-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleLabSelection(lab)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-lg">{lab.name}</h4>
                          <Badge variant="outline">{lab.rating}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Address:</strong> {lab.address}
                          </div>
                          <div>
                            <strong>Distance:</strong> {lab.distance}
                          </div>
                          <div>
                            <strong>Specialties:</strong> {lab.specialties}
                          </div>
                          <div>
                            <strong>Phone:</strong> {lab.phone}
                          </div>
                          <div className="p-2 bg-blue-50 rounded text-blue-800">
                            <strong>Services:</strong> {lab.emergency}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TestTube className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Location detection required to show nearby lab centers.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Diet Tab */}
          <TabsContent value="detailed-diet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Detailed Weekly Meal Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysis?.dietPlan?.weeklyMealPlan ? (
                  <div className="space-y-6">
                    {aiAnalysis.dietPlan.weeklyMealPlan.map((dayPlan, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold text-lg mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {dayPlan.day}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <div className="p-3 bg-yellow-50 rounded-lg">
                              <h5 className="font-medium text-yellow-800 mb-2">🌅 Breakfast</h5>
                              <div className="text-sm">
                                <div className="font-medium">{dayPlan.breakfast.name}</div>
                                <div className="text-gray-600">
                                  Ingredients: {dayPlan.breakfast.ingredients.join(", ")}
                                </div>
                                <div className="text-gray-600">
                                  Calories: {dayPlan.breakfast.calories} | Protein: {dayPlan.breakfast.protein}g
                                </div>
                                <div className="text-green-600 text-xs mt-1">
                                  Benefits: {dayPlan.breakfast.benefits.join(", ")}
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <h5 className="font-medium text-green-800 mb-2">☕ Morning Snack</h5>
                              <div className="text-sm">
                                <div className="font-medium">{dayPlan.morningSnack.name}</div>
                                <div className="text-gray-600">
                                  Calories: {dayPlan.morningSnack.calories} | Protein: {dayPlan.morningSnack.protein}g
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">🥗 Lunch</h5>
                              <div className="text-sm">
                                <div className="font-medium">{dayPlan.lunch.name}</div>
                                <div className="text-gray-600">Ingredients: {dayPlan.lunch.ingredients.join(", ")}</div>
                                <div className="text-gray-600">
                                  Calories: {dayPlan.lunch.calories} | Protein: {dayPlan.lunch.protein}g
                                </div>
                                <div className="text-green-600 text-xs mt-1">
                                  Benefits: {dayPlan.lunch.benefits.join(", ")}
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                              <h5 className="font-medium text-orange-800 mb-2">🍎 Afternoon Snack</h5>
                              <div className="text-sm">
                                <div className="font-medium">{dayPlan.afternoonSnack.name}</div>
                                <div className="text-gray-600">
                                  Calories: {dayPlan.afternoonSnack.calories} | Protein:{" "}
                                  {dayPlan.afternoonSnack.protein}g
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <h5 className="font-medium text-purple-800 mb-2">🍽️ Dinner</h5>
                              <div className="text-sm">
                                <div className="font-medium">{dayPlan.dinner.name}</div>
                                <div className="text-gray-600">
                                  Ingredients: {dayPlan.dinner.ingredients.join(", ")}
                                </div>
                                <div className="text-gray-600">
                                  Calories: {dayPlan.dinner.calories} | Protein: {dayPlan.dinner.protein}g
                                </div>
                                <div className="text-green-600 text-xs mt-1">
                                  Benefits: {dayPlan.dinner.benefits.join(", ")}
                                </div>
                              </div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                              <h5 className="font-medium text-indigo-800 mb-2">🥛 Evening Snack</h5>
                              <div className="text-sm">
                                <div className="font-medium">{dayPlan.eveningSnack.name}</div>
                                <div className="text-gray-600">
                                  Calories: {dayPlan.eveningSnack.calories} | Protein: {dayPlan.eveningSnack.protein}g
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Generate AI analysis to view your detailed weekly meal plan.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
