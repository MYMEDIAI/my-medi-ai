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
import { Apple, AlertTriangle, Loader2, Download, Printer, RotateCcw } from "lucide-react"
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

interface MealDetail {
  name: string
  ingredients: string[]
  calories: number
  protein: number
  preparation: string
  benefits: string[]
  waterIntake: string
  timing: string
  nutrients: string
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

interface DailyMealPlan {
  day: string
  breakfast: MealDetail
  morningSnack: MealDetail
  lunch: MealDetail
  afternoonSnack: MealDetail
  dinner: MealDetail
  eveningSnack: MealDetail
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

    // Generate 7-day Indian meal plan based on preferences with detailed nutritional info
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const weeklyMealPlan: DailyMealPlan[] = days.map((day, dayIndex) => ({
      day,
      breakfast: {
        name: `${day} Traditional Indian Breakfast`,
        ingredients: getBreakfastIngredients(dayIndex, formData.dietType, formData.culturalDietPreferences),
        calories: 380 + dayIndex * 10, // Slight variation per day
        protein: 15 + (dayIndex % 3),
        preparation: getBreakfastPreparation(dayIndex),
        benefits: ["Folic acid", "Iron", "Fiber", "Calcium", "B-vitamins"],
        waterIntake: "250ml",
        timing: "7:00-8:00 AM",
        nutrients: "Carbs: 45g, Fat: 12g, Fiber: 8g",
      },
      morningSnack: {
        name: `${day} Mid-Morning Snack`,
        ingredients: getMorningSnackIngredients(dayIndex),
        calories: 150 + dayIndex * 5,
        protein: 8 + (dayIndex % 2),
        preparation: "Fresh preparation with minimal cooking",
        benefits: ["Protein", "Probiotics", "Healthy fats"],
        waterIntake: "200ml",
        timing: "10:00-10:30 AM",
        nutrients: "Carbs: 15g, Fat: 6g, Fiber: 3g",
      },
      lunch: {
        name: `${day} Complete Indian Thali`,
        ingredients: getLunchIngredients(dayIndex, formData.dietType, formData.culturalDietPreferences),
        calories: 520 + dayIndex * 15,
        protein: 35 + (dayIndex % 4),
        preparation: getLunchPreparation(dayIndex),
        benefits: ["Complete protein", "Complex carbs", "Vitamins", "Minerals", "Antioxidants"],
        waterIntake: "300ml",
        timing: "12:30-1:30 PM",
        nutrients: "Carbs: 65g, Fat: 18g, Fiber: 12g",
      },
      afternoonSnack: {
        name: `${day} Healthy Evening Snack`,
        ingredients: getAfternoonSnackIngredients(dayIndex),
        calories: 180 + dayIndex * 8,
        protein: 6 + (dayIndex % 2),
        preparation: "Quick and nutritious preparation",
        benefits: ["Fiber", "Healthy fats", "Natural sugars", "Vitamins"],
        waterIntake: "200ml",
        timing: "4:00-4:30 PM",
        nutrients: "Carbs: 25g, Fat: 8g, Fiber: 5g",
      },
      dinner: {
        name: `${day} Light Indian Dinner`,
        ingredients: getDinnerIngredients(dayIndex, formData.dietType),
        calories: 480 + dayIndex * 12,
        protein: 40 + (dayIndex % 5),
        preparation: getDinnerPreparation(dayIndex),
        benefits: ["Omega-3", "Beta-carotene", "Folate", "Iron", "Protein"],
        waterIntake: "250ml",
        timing: "7:00-8:00 PM",
        nutrients: "Carbs: 45g, Fat: 15g, Fiber: 10g",
      },
      eveningSnack: {
        name: `${day} Bedtime Snack`,
        ingredients: getEveningSnackIngredients(dayIndex),
        calories: 120 + dayIndex * 3,
        protein: 6 + (dayIndex % 2),
        preparation: "Warm and comforting preparation",
        benefits: ["Calcium", "Protein", "Tryptophan", "Magnesium"],
        waterIntake: "200ml",
        timing: "9:30-10:00 PM",
        nutrients: "Carbs: 18g, Fat: 4g, Fiber: 2g",
      },
    }))

    // Helper functions for ingredient selection based on preferences
    const getBreakfastIngredients = (dayIndex: number, dietType: string, culturalPref: string): string[] => {
      const vegetarianOptions = [
        ["Poha with vegetables", "Peanuts", "Curry leaves", "Mustard seeds", "Green chilies"],
        ["Upma with semolina", "Mixed vegetables", "Cashews", "Ginger", "Coriander"],
        ["Idli with sambar", "Coconut chutney", "Curry leaves", "Dal", "Vegetables"],
        ["Dosa with potato filling", "Coconut chutney", "Sambar", "Onions", "Green chilies"],
        ["Paratha with curd", "Seasonal vegetables", "Ghee", "Pickles", "Mint chutney"],
        ["Oats porridge", "Milk", "Nuts", "Honey", "Fruits"],
        ["Daliya upma", "Vegetables", "Peanuts", "Curry leaves", "Lemon"],
      ]

      const nonVegOptions = [
        ["Egg paratha", "Curd", "Pickles", "Onions", "Green chilies"],
        ["Chicken sandwich", "Whole wheat bread", "Vegetables", "Cheese", "Mint chutney"],
        ["Fish curry with rice", "Coconut", "Curry leaves", "Tamarind", "Spices"],
        ["Egg bhurji with roti", "Onions", "Tomatoes", "Green chilies", "Coriander"],
        ["Chicken upma", "Semolina", "Vegetables", "Curry leaves", "Coconut"],
        ["Mutton keema paratha", "Onions", "Spices", "Curd", "Pickles"],
        ["Egg dosa", "Coconut chutney", "Sambar", "Curry leaves", "Spices"],
      ]

      return dietType === "vegetarian" || dietType === "vegan" ? vegetarianOptions[dayIndex] : nonVegOptions[dayIndex]
    }

    const getMorningSnackIngredients = (dayIndex: number): string[] => {
      const options = [
        ["Buttermilk", "Roasted cumin", "Mint", "Salt"],
        ["Coconut water", "Roasted chana", "Peanuts"],
        ["Fresh fruit", "Almonds", "Walnuts"],
        ["Vegetable juice", "Ginger", "Lemon", "Mint"],
        ["Lassi", "Yogurt", "Honey", "Cardamom"],
        ["Green tea", "Digestive biscuits", "Nuts"],
        ["Lemon water", "Mixed nuts", "Dates"],
      ]
      return options[dayIndex]
    }

    const getLunchIngredients = (dayIndex: number, dietType: string, culturalPref: string): string[] => {
      const vegetarianLunch = [
        ["Dal tadka", "Jeera rice", "Mixed vegetable curry", "Roti", "Curd", "Salad"],
        ["Rajma curry", "Brown rice", "Aloo gobi", "Chapati", "Buttermilk", "Pickle"],
        ["Sambar", "Rice", "Vegetable curry", "Rasam", "Curd", "Papad"],
        ["Chole curry", "Bhature", "Onion salad", "Mint chutney", "Lassi"],
        ["Paneer curry", "Roti", "Dal", "Vegetable stir-fry", "Curd", "Salad"],
        ["Vegetable biryani", "Raita", "Boiled egg", "Pickle", "Papad"],
        ["Mixed dal", "Rice", "Seasonal vegetable", "Chapati", "Curd", "Salad"],
      ]

      const nonVegLunch = [
        ["Chicken curry", "Rice", "Dal", "Vegetable", "Roti", "Salad"],
        ["Fish curry", "Rice", "Sambar", "Vegetable stir-fry", "Curd"],
        ["Mutton curry", "Biryani rice", "Raita", "Boiled egg", "Pickle"],
        ["Chicken biryani", "Raita", "Boiled egg", "Pickle", "Salad"],
        ["Fish fry", "Rice", "Dal", "Vegetable curry", "Curd"],
        ["Egg curry", "Roti", "Dal", "Vegetable", "Curd", "Salad"],
        ["Chicken stir-fry", "Rice", "Sambar", "Vegetable", "Curd"],
      ]

      return dietType === "vegetarian" || dietType === "vegan" ? vegetarianLunch[dayIndex] : nonVegLunch[dayIndex]
    }

    const getAfternoonSnackIngredients = (dayIndex: number): string[] => {
      const options = [
        ["Apple slices", "Peanut butter", "Cinnamon"],
        ["Banana", "Almonds", "Honey"],
        ["Orange", "Walnuts", "Dates"],
        ["Pomegranate", "Cashews", "Raisins"],
        ["Seasonal fruit", "Mixed nuts", "Coconut"],
        ["Fruit salad", "Nuts", "Honey", "Mint"],
        ["Smoothie", "Yogurt", "Fruits", "Nuts"],
      ]
      return options[dayIndex]
    }

    const getDinnerIngredients = (dayIndex: number, dietType: string): string[] => {
      const vegetarianDinner = [
        ["Vegetable khichdi", "Ghee", "Curd", "Pickle", "Papad"],
        ["Roti", "Dal", "Vegetable curry", "Curd", "Salad"],
        ["Rice", "Sambar", "Vegetable stir-fry", "Curd", "Pickle"],
        ["Chapati", "Paneer curry", "Dal", "Salad", "Buttermilk"],
        ["Vegetable pulao", "Raita", "Dal", "Papad", "Pickle"],
        ["Roti", "Mixed vegetable", "Dal", "Curd", "Salad"],
        ["Rice", "Vegetable curry", "Dal", "Curd", "Pickle"],
      ]

      const nonVegDinner = [
        ["Chicken curry", "Rice", "Vegetable", "Curd", "Salad"],
        ["Fish curry", "Roti", "Dal", "Vegetable", "Curd"],
        ["Egg curry", "Rice", "Dal", "Vegetable", "Salad"],
        ["Chicken stir-fry", "Chapati", "Dal", "Curd", "Pickle"],
        ["Fish fry", "Rice", "Sambar", "Vegetable", "Curd"],
        ["Mutton curry", "Roti", "Dal", "Salad", "Buttermilk"],
        ["Chicken biryani", "Raita", "Boiled egg", "Pickle", "Salad"],
      ]

      return dietType === "vegetarian" || dietType === "vegan" ? vegetarianDinner[dayIndex] : nonVegDinner[dayIndex]
    }

    const getEveningSnackIngredients = (dayIndex: number): string[] => {
      const options = [
        ["Warm milk", "Turmeric", "Honey", "Almonds"],
        ["Herbal tea", "Dates", "Walnuts"],
        ["Golden milk", "Turmeric", "Ginger", "Honey"],
        ["Warm milk", "Cardamom", "Pistachios", "Saffron"],
        ["Chamomile tea", "Honey", "Almonds"],
        ["Warm milk", "Cinnamon", "Dates", "Cashews"],
        ["Ginger tea", "Honey", "Mixed nuts"],
      ]
      return options[dayIndex]
    }

    const getBreakfastPreparation = (dayIndex: number): string => {
      const preparations = [
        "Heat oil, add mustard seeds, curry leaves. Add poha, vegetables, peanuts. Cook for 5-7 minutes.",
        "Roast semolina, add water, vegetables, and spices. Cook until thick consistency.",
        "Steam idli batter, serve with sambar and coconut chutney.",
        "Make dosa batter, spread on pan, add potato filling, serve with chutney.",
        "Knead dough, stuff with vegetables, cook on tawa with ghee.",
        "Cook oats in milk, add nuts and honey when warm.",
        "Roast daliya, add vegetables and spices, cook with water until soft.",
      ]
      return preparations[dayIndex]
    }

    const getLunchPreparation = (dayIndex: number): string => {
      const preparations = [
        "Cook dal with turmeric, temper with cumin, serve with rice and vegetables.",
        "Soak rajma overnight, pressure cook, make curry with spices.",
        "Cook dal with vegetables and tamarind, temper with mustard seeds.",
        "Cook chickpeas with spices, serve with fried bread and salad.",
        "Make paneer curry with tomatoes and spices, serve with roti.",
        "Layer rice with vegetables and spices, cook in dum style.",
        "Mix different dals, cook with spices, serve with rice and vegetables.",
      ]
      return preparations[dayIndex]
    }

    const getDinnerPreparation = (dayIndex: number): string => {
      const preparations = [
        "Cook rice and dal together with vegetables and ghee.",
        "Make simple dal and vegetable curry, serve with fresh roti.",
        "Cook sambar with vegetables, serve with rice and stir-fried vegetables.",
        "Make paneer curry with minimal oil, serve with chapati.",
        "Cook rice with vegetables and mild spices, serve with raita.",
        "Prepare mixed vegetables with minimal oil and spices.",
        "Light vegetable curry with dal, easy to digest for dinner.",
      ]
      return preparations[dayIndex]
    }

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
  <div class="section-header">🍎 DETAILED WEEKLY MEAL PLAN WITH NUTRITIONAL INFORMATION</div>
  
  <!-- Daily Totals Summary -->
  <div style="margin-bottom: 10px;">
    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>Total Calories</th>
          <th>Total Protein</th>
          <th>Total Water</th>
          <th>Meals Count</th>
          <th>Key Focus</th>
        </tr>
      </thead>
      <tbody>
        ${aiAnalysis.dietPlan.weeklyMealPlan
          .map(
            (dayPlan) => `
          <tr>
            <td><strong>${dayPlan.day}</strong></td>
            <td>${
              dayPlan.breakfast.calories +
              dayPlan.morningSnack.calories +
              dayPlan.lunch.calories +
              dayPlan.afternoonSnack.calories +
              dayPlan.dinner.calories +
              dayPlan.eveningSnack.calories
            } kcal</td>
            <td>${
              dayPlan.breakfast.protein +
              dayPlan.morningSnack.protein +
              dayPlan.lunch.protein +
              dayPlan.afternoonSnack.protein +
              dayPlan.dinner.protein +
              dayPlan.eveningSnack.protein
            }g</td>
            <td>1400ml</td>
            <td>6 meals</td>
            <td>Balanced nutrition</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <!-- Detailed Daily Meal Plans -->
  ${aiAnalysis.dietPlan.weeklyMealPlan
    .map(
      (dayPlan) => `
    <div style="page-break-inside: avoid; margin-bottom: 15px;">
      <h4 style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px; text-align: center; border-radius: 6px; margin-bottom: 8px; font-size: 12px;">
        📅 ${dayPlan.day.toUpperCase()} - COMPLETE MEAL PLAN
      </h4>
      
      <table style="margin-bottom: 10px;">
        <thead>
          <tr>
            <th style="width: 15%;">Meal Time</th>
            <th style="width: 20%;">Meal Name</th>
            <th style="width: 25%;">Ingredients</th>
            <th style="width: 10%;">Calories</th>
            <th style="width: 8%;">Protein</th>
            <th style="width: 10%;">Water</th>
            <th style="width: 12%;">Nutrients</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background: #fff3cd;">
            <td><strong>${dayPlan.breakfast.timing || "7:00-8:00 AM"}</strong><br><span style="font-size: 6px;">🌅 BREAKFAST</span></td>
            <td><strong>${dayPlan.breakfast.name}</strong><br><span style="font-size: 6px; color: #666;">${dayPlan.breakfast.preparation}</span></td>
            <td style="font-size: 6px;">${dayPlan.breakfast.ingredients.join(", ")}</td>
            <td style="text-align: center; font-weight: bold; color: #d97706;">${dayPlan.breakfast.calories}</td>
            <td style="text-align: center; font-weight: bold; color: #059669;">${dayPlan.breakfast.protein}g</td>
            <td style="text-align: center; color: #0ea5e9;">${dayPlan.breakfast.waterIntake || "250ml"}</td>
            <td style="font-size: 6px;">${dayPlan.breakfast.nutrients || "Carbs: 45g, Fat: 12g, Fiber: 8g"}</td>
          </tr>
          <tr style="background: #dcfce7;">
            <td><strong>${dayPlan.morningSnack.timing || "10:00-10:30 AM"}</strong><br><span style="font-size: 6px;">☕ MID-MORNING</span></td>
            <td><strong>${dayPlan.morningSnack.name}</strong><br><span style="font-size: 6px; color: #666;">${dayPlan.morningSnack.preparation}</span></td>
            <td style="font-size: 6px;">${dayPlan.morningSnack.ingredients.join(", ")}</td>
            <td style="text-align: center; font-weight: bold; color: #d97706;">${dayPlan.morningSnack.calories}</td>
            <td style="text-align: center; font-weight: bold; color: #059669;">${dayPlan.morningSnack.protein}g</td>
            <td style="text-align: center; color: #0ea5e9;">${dayPlan.morningSnack.waterIntake || "200ml"}</td>
            <td style="font-size: 6px;">${dayPlan.morningSnack.nutrients || "Carbs: 15g, Fat: 6g, Fiber: 3g"}</td>
          </tr>
          <tr style="background: #dbeafe;">
            <td><strong>${dayPlan.lunch.timing || "12:30-1:30 PM"}</strong><br><span style="font-size: 6px;">🥗 LUNCH</span></td>
            <td><strong>${dayPlan.lunch.name}</strong><br><span style="font-size: 6px; color: #666;">${dayPlan.lunch.preparation}</span></td>
            <td style="font-size: 6px;">${dayPlan.lunch.ingredients.join(", ")}</td>
            <td style="text-align: center; font-weight: bold; color: #d97706;">${dayPlan.lunch.calories}</td>
            <td style="text-align: center; font-weight: bold; color: #059669;">${dayPlan.lunch.protein}g</td>
            <td style="text-align: center; color: #0ea5e9;">${dayPlan.lunch.waterIntake || "300ml"}</td>
            <td style="font-size: 6px;">${dayPlan.lunch.nutrients || "Carbs: 65g, Fat: 18g, Fiber: 12g"}</td>
          </tr>
          <tr style="background: #fed7aa;">
            <td><strong>${dayPlan.afternoonSnack.timing || "4:00-4:30 PM"}</strong><br><span style="font-size: 6px;">🍎 AFTERNOON</span></td>
            <td><strong>${dayPlan.afternoonSnack.name}</strong><br><span style="font-size: 6px; color: #666;">${dayPlan.afternoonSnack.preparation}</span></td>
            <td style="font-size: 6px;">${dayPlan.afternoonSnack.ingredients.join(", ")}</td>
            <td style="text-align: center; font-weight: bold; color: #d97706;">${dayPlan.afternoonSnack.calories}</td>
            <td style="text-align: center; font-weight: bold; color: #059669;">${dayPlan.afternoonSnack.protein}g</td>
            <td style="text-align: center; color: #0ea5e9;">${dayPlan.afternoonSnack.waterIntake || "200ml"}</td>
            <td style="font-size: 6px;">${dayPlan.afternoonSnack.nutrients || "Carbs: 25g, Fat: 8g, Fiber: 5g"}</td>
          </tr>
          <tr style="background: #e9d5ff;">
            <td><strong>${dayPlan.dinner.timing || "7:00-8:00 PM"}</strong><br><span style="font-size: 6px;">🍽️ DINNER</span></td>
            <td><strong>${dayPlan.dinner.name}</strong><br><span style="font-size: 6px; color: #666;">${dayPlan.dinner.preparation}</span></td>
            <td style="font-size: 6px;">${dayPlan.dinner.ingredients.join(", ")}</td>
            <td style="text-align: center; font-weight: bold; color: #d97706;">${dayPlan.dinner.calories}</td>
            <td style="text-align: center; font-weight: bold; color: #059669;">${dayPlan.dinner.protein}g</td>
            <td style="text-align: center; color: #0ea5e9;">${dayPlan.dinner.waterIntake || "250ml"}</td>
            <td style="font-size: 6px;">${dayPlan.dinner.nutrients || "Carbs: 45g, Fat: 15g, Fiber: 10g"}</td>
          </tr>
          <tr style="background: #e0e7ff;">
            <td><strong>${dayPlan.eveningSnack.timing || "9:30-10:00 PM"}</strong><br><span style="font-size: 6px;">🥛 BEDTIME</span></td>
            <td><strong>${dayPlan.eveningSnack.name}</strong><br><span style="font-size: 6px; color: #666;">${dayPlan.eveningSnack.preparation}</span></td>
            <td style="font-size: 6px;">${dayPlan.eveningSnack.ingredients.join(", ")}</td>
            <td style="text-align: center; font-weight: bold; color: #d97706;">${dayPlan.eveningSnack.calories}</td>
            <td style="text-align: center; font-weight: bold; color: #059669;">${dayPlan.eveningSnack.protein}g</td>
            <td style="text-align: center; color: #0ea5e9;">${dayPlan.eveningSnack.waterIntake || "200ml"}</td>
            <td style="font-size: 6px;">${dayPlan.eveningSnack.nutrients || "Carbs: 18g, Fat: 4g, Fiber: 2g"}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Daily Benefits Summary -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
        <div style="background: #f0fdf4; padding: 4px; border-radius: 4px; font-size: 7px;">
          <strong style="color: #166534;">🌟 Key Benefits:</strong><br>
          ${[...new Set([...dayPlan.breakfast.benefits, ...dayPlan.lunch.benefits, ...dayPlan.dinner.benefits])]
            .slice(0, 6)
            .join(", ")}
        </div>
        <div style="background: #eff6ff; padding: 4px; border-radius: 4px; font-size: 7px;">
          <strong style="color: #1e40af;">💧 Hydration Plan:</strong><br>
          Total: 1400ml water + 200ml milk + herbal teas as needed
        </div>
      </div>
    </div>
  `,
    )
    .join("")}

  <!-- Weekly Nutrition Summary -->
  <div style="margin-top: 15px; page-break-inside: avoid;">
    <h4 style="background: #1f2937; color: white; padding: 8px; text-align: center; border-radius: 6px; margin-bottom: 8px; font-size: 12px;">
      📊 WEEKLY NUTRITION SUMMARY & GUIDELINES
    </h4>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
      <div style="background: #fef3c7; padding: 8px; border-radius: 6px;">
        <div style="font-weight: bold; color: #92400e; margin-bottom: 4px; font-size: 9px;">📈 DAILY AVERAGES</div>
        <div style="font-size: 7px; color: #92400e;">
          • Calories: ${Math.round(aiAnalysis.dietPlan.dailyCalories)} kcal<br>
          • Protein: ${aiAnalysis.dietPlan.dailyProtein}g<br>
          • Water: 1400ml + beverages<br>
          • Meals: 6 per day<br>
          • Fiber: 25-30g daily
        </div>
      </div>
      
      <div style="background: #dcfce7; padding: 8px; border-radius: 6px;">
        <div style="font-weight: bold; color: #166534; margin-bottom: 4px; font-size: 9px;">🥗 KEY NUTRIENTS</div>
        <div style="font-size: 7px; color: #166534;">
          ${aiAnalysis.dietPlan.keyNutrients.map((nutrient) => `• ${nutrient}`).join("<br>")}
        </div>
      </div>
      
      <div style="background: #fecaca; padding: 8px; border-radius: 6px;">
        <div style="font-weight: bold; color: #991b1b; margin-bottom: 4px; font-size: 9px;">⚠️ FOODS TO AVOID</div>
        <div style="font-size: 7px; color: #991b1b;">
          ${aiAnalysis.dietPlan.avoidFoods
            .slice(0, 6)
            .map((food) => `• ${food}`)
            .join("<br>")}
        </div>
      </div>
    </div>
    
</div>
`
      : ""
  }

  ${
    aiAnalysis.exercisePlan
      ? `
  <div class="section">
    <div class="section-header">💪 EXERCISE RECOMMENDATIONS</div>
    <div class="three-column" style="margin-bottom: 6px;">
      <div class="vital-item">
        <div style="font-weight: bold;">${aiAnalysis.exercisePlan.weeklyMinutes}</div>
        <div>Minutes/Week</div>
      </div>
      <div class="vital-item">
        <div style="font-weight: bold;">T${aiAnalysis.exercisePlan.trimester}</div>
        <div>Trimester</div>
      </div>
    </div>
    
    <div style="margin-bottom: 4px;">
      <strong>Recommended Activities:</strong> ${aiAnalysis.exercisePlan.recommendedActivities.join(", ")}
    </div>
    
    <div style="margin-bottom: 4px;">
      <strong>Restrictions:</strong> ${aiAnalysis.exercisePlan.restrictions.join(", ")}
    </div>
    
    <div>
      <strong>Warning Signs:</strong> ${aiAnalysis.exercisePlan.warningSigns.join(", ")}
    </div>
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.monitoringSchedule.length > 0
      ? `
  <div class="section">
    <div class="section-header">📅 MONITORING SCHEDULE</div>
    <div class="compact-list">
      <ul>
        ${aiAnalysis.monitoringSchedule.map((item) => `<li>• ${item}</li>`).join("")}
      </ul>
    </div>
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.weeklyPredictions.length > 0
      ? `
  <div class="section">
    <div class="section-header">🔮 WEEKLY PREDICTIONS</div>
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

  ${
    aiAnalysis.supplements.length > 0
      ? `
  <div class="section">
    <div class="section-header">💊 SUPPLEMENT RECOMMENDATIONS</div>
    <table>
      <thead>
        <tr>
          <th>Supplement</th>
          <th>Dosage</th>
          <th>Timing</th>
          <th>Benefits</th>
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
    aiAnalysis.nearbyHospitals.length > 0
      ? `
  <div class="section">
    <div class="section-header">🏥 NEARBY HOSPITALS</div>
    ${aiAnalysis.nearbyHospitals
      .map(
        (hospital) => `
    <div class="facility-compact">
      <div class="facility-name">${hospital.name}</div>
      <div><strong>Address:</strong> ${hospital.address}</div>
      <div><strong>Distance:</strong> ${hospital.distance}</div>
      <div><strong>Specialties:</strong> ${hospital.specialties}</div>
      <div><strong>Phone:</strong> ${hospital.phone}</div>
      <div><strong>Rating:</strong> ${hospital.rating}</div>
      <div><strong>Emergency:</strong> ${hospital.emergency}</div>
    </div>
    `,
      )
      .join("")}
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.labCenters.length > 0
      ? `
  <div class="section">
    <div class="section-header">🧪 NEARBY LAB CENTERS</div>
    ${aiAnalysis.labCenters
      .map(
        (lab) => `
    <div class="facility-compact">
      <div class="facility-name">${lab.name}</div>
      <div><strong>Address:</strong> ${lab.address}</div>
      <div><strong>Distance:</strong> ${lab.distance}</div>
      <div><strong>Specialties:</strong> ${lab.specialties}</div>
      <div><strong>Phone:</strong> ${lab.phone}</div>
      <div><strong>Rating:</strong> ${lab.rating}</div>
      <div><strong>Emergency:</strong> ${lab.emergency}</div>
    </div>
    `,
      )
      .join("")}
  </div>
  `
      : ""
  }

  ${
    aiAnalysis.clinicalNotes
      ? `
  <div class="section">
    <div class="section-header">🩺 AI CLINICAL NOTES FOR DOCTORS</div>
    <div>${aiAnalysis.clinicalNotes}</div>
  </div>
  `
      : ""
  }
  `
      : ""
  }

  <div class="footer">
    MyMedi.ai - Empowering Maternal Health with AI | Disclaimer: This report is AI-generated and should be reviewed by a qualified healthcare professional.
  </div>
</body>
</html>
`

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(reportContent)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    } else {
      alert("Please allow pop-ups for this site to enable printing.")
    }
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MyMedLogo className="h-8 w-auto" />
            <h1 className="text-2xl font-bold">Pregnancy Care</h1>
          </div>

          <div className="space-x-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Form
            </Button>
            {analysisGenerated && (
              <>
                <Button onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </Button>
                <Button onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="form" className="space-y-4">
          <TabsList>
            <TabsTrigger value="form" onClick={() => setActiveTab("form")}>
              Pregnancy Form
            </TabsTrigger>
            {formData.motherName && (
              <TabsTrigger value="analysis" disabled={!formData.motherName} onClick={() => setActiveTab("analysis")}>
                AI Analysis
              </TabsTrigger>
            )}
            {aiAnalysis && (
              <TabsTrigger value="detailed-diet" onClick={() => setActiveTab("detailed-diet")}>
                Detailed Diet
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            {locationError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input
                    type="text"
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange("motherName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="motherAge">Mother's Age</Label>
                  <Input
                    type="number"
                    id="motherAge"
                    value={formData.motherAge}
                    onChange={(e) => handleInputChange("motherAge", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motherHeight">Mother's Height (cm)</Label>
                  <Input
                    type="number"
                    id="motherHeight"
                    value={formData.motherHeight}
                    onChange={(e) => handleInputChange("motherHeight", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motherWeight">Mother's Weight (kg)</Label>
                  <Input
                    type="number"
                    id="motherWeight"
                    value={formData.motherWeight}
                    onChange={(e) => handleInputChange("motherWeight", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="prePregnancyWeight">Pre-Pregnancy Weight (kg)</Label>
                  <Input
                    type="number"
                    id="prePregnancyWeight"
                    value={formData.prePregnancyWeight}
                    onChange={(e) => handleInputChange("prePregnancyWeight", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="motherBloodType">Mother's Blood Type</Label>
                  <Select onValueChange={(value) => handleInputChange("motherBloodType", value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" defaultValue={formData.motherBloodType} />
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
                  <Label htmlFor="motherRhFactor">Mother's Rh Factor</Label>
                  <Select onValueChange={(value) => handleInputChange("motherRhFactor", value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" defaultValue={formData.motherRhFactor} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">+</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="motherOccupation">Mother's Occupation</Label>
                  <Input
                    type="text"
                    id="motherOccupation"
                    value={formData.motherOccupation}
                    onChange={(e) => handleInputChange("motherOccupation", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="motherEducation">Mother's Education</Label>
                  <Input
                    type="text"
                    id="motherEducation"
                    value={formData.motherEducation}
                    onChange={(e) => handleInputChange("motherEducation", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="motherIncome">Mother's Income</Label>
                  <Input
                    type="text"
                    id="motherIncome"
                    value={formData.motherIncome}
                    onChange={(e) => handleInputChange("motherIncome", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    type="text"
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherAge">Father's Age</Label>
                  <Input
                    type="number"
                    id="fatherAge"
                    value={formData.fatherAge}
                    onChange={(e) => handleInputChange("fatherAge", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherBloodType">Father's Blood Type</Label>
                  <Select onValueChange={(value) => handleInputChange("fatherBloodType", value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" defaultValue={formData.fatherBloodType} />
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
                  <Label htmlFor="fatherRhFactor">Father's Rh Factor</Label>
                  <Select onValueChange={(value) => handleInputChange("fatherRhFactor", value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select" defaultValue={formData.fatherRhFactor} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">+</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                  <Input
                    type="text"
                    id="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={(e) => handleInputChange("fatherOccupation", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fatherEducation">Father's Education</Label>
                  <Input
                    type="text"
                    id="fatherEducation"
                    value={formData.fatherEducation}
                    onChange={(e) => handleInputChange("fatherEducation", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Input
                    type="text"
                    id="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange("maritalStatus", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="marriageDuration">Marriage Duration</Label>
                  <Input
                    type="text"
                    id="marriageDuration"
                    value={formData.marriageDuration}
                    onChange={(e) => handleInputChange("marriageDuration", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pregnancy Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="lastPeriodDate">Last Period Date</Label>
                  <Input
                    type="date"
                    id="lastPeriodDate"
                    value={formData.lastPeriodDate}
                    onChange={(e) => handleInputChange("lastPeriodDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pregnancyType">Pregnancy Type</Label>
                  <Input
                    type="text"
                    id="pregnancyType"
                    value={formData.pregnancyType}
                    onChange={(e) => handleInputChange("pregnancyType", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="plannedPregnancy">Planned Pregnancy</Label>
                  <Checkbox
                    id="plannedPregnancy"
                    checked={formData.plannedPregnancy}
                    onCheckedChange={(checked) => handleInputChange("plannedPregnancy", !!checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="conceptionMethod">Conception Method</Label>
                  <Input
                    type="text"
                    id="conceptionMethod"
                    value={formData.conceptionMethod}
                    onChange={(e) => handleInputChange("conceptionMethod", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="previousMiscarriages">Previous Miscarriages</Label>
                  <Input
                    type="number"
                    id="previousMiscarriages"
                    value={formData.previousMiscarriages}
                    onChange={(e) => handleInputChange("previousMiscarriages", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="previousAbortions">Previous Abortions</Label>
                  <Input
                    type="number"
                    id="previousAbortions"
                    value={formData.previousAbortions}
                    onChange={(e) => handleInputChange("previousAbortions", Number.parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label>Chronic Conditions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="diabetesType1"
                        checked={formData.chronicConditions.includes("Diabetes Type 1")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Diabetes Type 1", !!checked)
                        }
                      />
                      <Label htmlFor="diabetesType1">Diabetes Type 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="diabetesType2"
                        checked={formData.chronicConditions.includes("Diabetes Type 2")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Diabetes Type 2", !!checked)
                        }
                      />
                      <Label htmlFor="diabetesType2">Diabetes Type 2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gestationalDiabetes"
                        checked={formData.chronicConditions.includes("Gestational Diabetes (previous)")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Gestational Diabetes (previous)", !!checked)
                        }
                      />
                      <Label htmlFor="gestationalDiabetes">Gestational Diabetes (previous)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hypertension"
                        checked={formData.chronicConditions.includes("Hypertension")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Hypertension", !!checked)}
                      />
                      <Label htmlFor="hypertension">Hypertension</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="heartDisease"
                        checked={formData.chronicConditions.includes("Heart Disease")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Heart Disease", !!checked)
                        }
                      />
                      <Label htmlFor="heartDisease">Heart Disease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="asthma"
                        checked={formData.chronicConditions.includes("Asthma")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Asthma", !!checked)}
                      />
                      <Label htmlFor="asthma">Asthma</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="copd"
                        checked={formData.chronicConditions.includes("COPD")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "COPD", !!checked)}
                      />
                      <Label htmlFor="copd">COPD</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thyroidDisease"
                        checked={formData.chronicConditions.includes("Thyroid Disease (Hypo/Hyper)")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Thyroid Disease (Hypo/Hyper)", !!checked)
                        }
                      />
                      <Label htmlFor="thyroidDisease">Thyroid Disease (Hypo/Hyper)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kidneyDisease"
                        checked={formData.chronicConditions.includes("Kidney Disease")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Kidney Disease", !!checked)
                        }
                      />
                      <Label htmlFor="kidneyDisease">Kidney Disease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="liverDisease"
                        checked={formData.chronicConditions.includes("Liver Disease")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Liver Disease", !!checked)
                        }
                      />
                      <Label htmlFor="liverDisease">Liver Disease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoimmuneDisease"
                        checked={formData.chronicConditions.includes("Autoimmune Disease")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Autoimmune Disease", !!checked)
                        }
                      />
                      <Label htmlFor="autoimmuneDisease">Autoimmune Disease</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="depression"
                        checked={formData.chronicConditions.includes("Depression")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Depression", !!checked)}
                      />
                      <Label htmlFor="depression">Depression</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anxiety"
                        checked={formData.chronicConditions.includes("Anxiety")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Anxiety", !!checked)}
                      />
                      <Label htmlFor="anxiety">Anxiety</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="epilepsy"
                        checked={formData.chronicConditions.includes("Epilepsy")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Epilepsy", !!checked)}
                      />
                      <Label htmlFor="epilepsy">Epilepsy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="migraine"
                        checked={formData.chronicConditions.includes("Migraine")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Migraine", !!checked)}
                      />
                      <Label htmlFor="migraine">Migraine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="arthritis"
                        checked={formData.chronicConditions.includes("Arthritis")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Arthritis", !!checked)}
                      />
                      <Label htmlFor="arthritis">Arthritis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="osteoporosis"
                        checked={formData.chronicConditions.includes("Osteoporosis")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "Osteoporosis", !!checked)}
                      />
                      <Label htmlFor="osteoporosis">Osteoporosis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cancerHistory"
                        checked={formData.chronicConditions.includes("Cancer History")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Cancer History", !!checked)
                        }
                      />
                      <Label htmlFor="cancerHistory">Cancer History</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pcos"
                        checked={formData.chronicConditions.includes("PCOS")}
                        onCheckedChange={(checked) => handleMultiSelect("chronicConditions", "PCOS", !!checked)}
                      />
                      <Label htmlFor="pcos">PCOS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="endometriosis"
                        checked={formData.chronicConditions.includes("Endometriosis")}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", "Endometriosis", !!checked)
                        }
                      />
                      <Label htmlFor="endometriosis">Endometriosis</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Allergies</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="penicillin"
                        checked={formData.allergies.includes("Penicillin")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Penicillin", !!checked)}
                      />
                      <Label htmlFor="penicillin">Penicillin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sulfaDrugs"
                        checked={formData.allergies.includes("Sulfa Drugs")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Sulfa Drugs", !!checked)}
                      />
                      <Label htmlFor="sulfaDrugs">Sulfa Drugs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="aspirin"
                        checked={formData.allergies.includes("Aspirin")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Aspirin", !!checked)}
                      />
                      <Label htmlFor="aspirin">Aspirin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ibuprofen"
                        checked={formData.allergies.includes("Ibuprofen")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Ibuprofen", !!checked)}
                      />
                      <Label htmlFor="ibuprofen">Ibuprofen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="codeine"
                        checked={formData.allergies.includes("Codeine")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Codeine", !!checked)}
                      />
                      <Label htmlFor="codeine">Codeine</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="latex"
                        checked={formData.allergies.includes("Latex")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Latex", !!checked)}
                      />
                      <Label htmlFor="latex">Latex</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="peanuts"
                        checked={formData.allergies.includes("Peanuts")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Peanuts", !!checked)}
                      />
                      <Label htmlFor="peanuts">Peanuts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="treeNuts"
                        checked={formData.allergies.includes("Tree Nuts")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Tree Nuts", !!checked)}
                      />
                      <Label htmlFor="treeNuts">Tree Nuts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shellfish"
                        checked={formData.allergies.includes("Shellfish")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Shellfish", !!checked)}
                      />
                      <Label htmlFor="shellfish">Shellfish</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fish"
                        checked={formData.allergies.includes("Fish")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Fish", !!checked)}
                      />
                      <Label htmlFor="fish">Fish</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="eggs"
                        checked={formData.allergies.includes("Eggs")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Eggs", !!checked)}
                      />
                      <Label htmlFor="eggs">Eggs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="milk"
                        checked={formData.allergies.includes("Milk")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Milk", !!checked)}
                      />
                      <Label htmlFor="milk">Milk</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="soy"
                        checked={formData.allergies.includes("Soy")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Soy", !!checked)}
                      />
                      <Label htmlFor="soy">Soy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wheat"
                        checked={formData.allergies.includes("Wheat")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Wheat", !!checked)}
                      />
                      <Label htmlFor="wheat">Wheat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sesame"
                        checked={formData.allergies.includes("Sesame")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Sesame", !!checked)}
                      />
                      <Label htmlFor="sesame">Sesame</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mustard"
                        checked={formData.allergies.includes("Mustard")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Mustard", !!checked)}
                      />
                      <Label htmlFor="mustard">Mustard</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="celery"
                        checked={formData.allergies.includes("Celery")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Celery", !!checked)}
                      />
                      <Label htmlFor="celery">Celery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lupin"
                        checked={formData.allergies.includes("Lupin")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Lupin", !!checked)}
                      />
                      <Label htmlFor="lupin">Lupin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mollusks"
                        checked={formData.allergies.includes("Mollusks")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Mollusks", !!checked)}
                      />
                      <Label htmlFor="mollusks">Mollusks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sulfites"
                        checked={formData.allergies.includes("Sulfites")}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", "Sulfites", !!checked)}
                      />
                      <Label htmlFor="sulfites">Sulfites</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="previousSurgeries">Previous Surgeries</Label>
                  <Textarea
                    id="previousSurgeries"
                    value={formData.previousSurgeries.join(", ")}
                    onChange={(e) => handleInputChange("previousSurgeries", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications.join(", ")}
                    onChange={(e) => handleInputChange("currentMedications", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="previousComplications">Previous Pregnancy Complications</Label>
                  <Textarea
                    id="previousComplications"
                    value={formData.previousComplications.join(", ")}
                    onChange={(e) => handleInputChange("previousComplications", e.target.value.split(","))}
                  />
                </div>

                <div>
                  <Label htmlFor="bloodTransfusionHistory">Blood Transfusion History</Label>
                  <Checkbox
                    id="bloodTransfusionHistory"
                    checked={formData.bloodTransfusionHistory}
                    onCheckedChange={(checked) => handleInputChange("bloodTransfusionHistory", !!checked)}
                  />
                </div>
                <div>
                  <Label>Vaccination Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tetanus"
                        checked={formData.vaccinationStatus.includes("Tetanus")}
                        onCheckedChange={(checked) => handleMultiSelect("vaccinationStatus", "Tetanus", !!checked)}
                      />
                      <Label htmlFor="tetanus">Tetanus</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="influenza"
                        checked={formData.vaccinationStatus.includes("Influenza")}
                        onCheckedChange={(checked) => handleMultiSelect("vaccinationStatus", "Influenza", !!checked)}
                      />
                      <Label htmlFor="influenza">Influenza</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mmr"
                        checked={formData.vaccinationStatus.includes("MMR")}
                        onCheckedChange={(checked) => handleMultiSelect("vaccinationStatus", "MMR", !!checked)}
                      />
                      <Label htmlFor="mmr">MMR</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hepatitisB"
                        checked={formData.vaccinationStatus.includes("Hepatitis B")}
                        onCheckedChange={(checked) => handleMultiSelect("vaccinationStatus", "Hepatitis B", !!checked)}
                      />
                      <Label htmlFor="hepatitisB">Hepatitis B</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Family Medical History</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="familyDiabetes">Family History of Diabetes</Label>
                  <Checkbox
                    id="familyDiabetes"
                    checked={formData.familyDiabetes}
                    onCheckedChange={(checked) => handleInputChange("familyDiabetes", !!checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="familyHypertension">Family History of Hypertension</Label>
                  <Checkbox
                    id="familyHypertension"
                    checked={formData.familyHypertension}
                    onCheckedChange={(checked) => handleInputChange("familyHypertension", !!checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="familyHeartDisease">Family History of Heart Disease</Label>
                  <Checkbox
                    id="familyHeartDisease"
                    checked={formData.familyHeartDisease}
                    onCheckedChange={(checked) => handleInputChange("familyHeartDisease", !!checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="familyThalassemia">Family History of Thalassemia</Label>
                  <Checkbox
                    id="familyThalassemia"
                    checked={formData.familyThalassemia}
                    onCheckedChange={(checked) => handleInputChange("familyThalassemia", !!checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="familyMentalHealth">Family History of Mental Health Issues</Label>
                  <Checkbox
                    id="familyMentalHealth"
                    checked={formData.familyMentalHealth}
                    onCheckedChange={(checked) => handleInputChange("familyMentalHealth", !!checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Health & Vitals (Today Only)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="bloodPressureSystolic">Blood Pressure (Systolic)</Label>
                  <Input
                    type="number"
                    id="bloodPressureSystolic"
                    value={formData.bloodPressureSystolic}
                    onChange={(e) => handleInputChange("bloodPressureSystolic", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="bloodPressureDiastolic">Blood Pressure (Diastolic)</Label>
                  <Input
                    type="number"
                    id="bloodPressureDiastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={(e) => handleInputChange("bloodPressureDiastolic", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    id="bloodPressureDiastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={(e) => handleInputChange("bloodPressureDiastolic", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    id="heartRate"
                    value={formData.heartRate}
                    onChange={(e) => handleInputChange("heartRate", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input
                    type="number"
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    type="number"
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fundalHeight">Fundal Height (cm)</Label>
                  <Input
                    type="number"
                    id="fundalHeight"
                    value={formData.fundalHeight}
                    onChange={(e) => handleInputChange("fundalHeight", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fetalHeartRate">Fetal Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    id="fetalHeartRate"
                    value={formData.fetalHeartRate}
                    onChange={(e) => handleInputChange("fetalHeartRate", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                  <Input
                    type="number"
                    id="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={(e) => handleInputChange("respiratoryRate", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                  <Input
                    type="number"
                    id="oxygenSaturation"
                    value={formData.oxygenSaturation}
                    onChange={(e) => handleInputChange("oxygenSaturation", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                  <Input
                    type="number"
                    id="bloodSugar"
                    value={formData.bloodSugar}
                    onChange={(e) => handleInputChange("bloodSugar", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input
                    type="number"
                    id="hemoglobin"
                    value={formData.hemoglobin}
                    onChange={(e) => handleInputChange("hemoglobin", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentSymptoms">Current Symptoms</Label>
                  <Textarea
                    id="currentSymptoms"
                    value={formData.currentSymptoms.join(", ")}
                    onChange={(e) => handleInputChange("currentSymptoms", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="vitalsTiming">Vitals Timing</Label>
                  <Input
                    type="text"
                    id="vitalsTiming"
                    value={formData.vitalsTiming}
                    onChange={(e) => handleInputChange("vitalsTiming", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="vitalsNotes">Vitals Notes</Label>
                  <Textarea
                    id="vitalsNotes"
                    value={formData.vitalsNotes}
                    onChange={(e) => handleInputChange("vitalsNotes", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lifestyle & Diet Customization</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="smokingStatus">Smoking Status</Label>
                  <Input
                    type="text"
                    id="smokingStatus"
                    value={formData.smokingStatus}
                    onChange={(e) => handleInputChange("smokingStatus", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                  <Input
                    type="text"
                    id="alcoholConsumption"
                    value={formData.alcoholConsumption}
                    onChange={(e) => handleInputChange("alcoholConsumption", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tobaccoUse">Tobacco Use</Label>
                  <Input
                    type="text"
                    id="tobaccoUse"
                    value={formData.tobaccoUse}
                    onChange={(e) => handleInputChange("tobaccoUse", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                  <Input
                    type="text"
                    id="exerciseFrequency"
                    value={formData.exerciseFrequency}
                    onChange={(e) => handleInputChange("exerciseFrequency", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Input
                    type="text"
                    id="dietType"
                    value={formData.dietType}
                    onChange={(e) => handleInputChange("dietType", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                  <Input
                    type="number"
                    id="stressLevel"
                    value={formData.stressLevel}
                    onChange={(e) => handleInputChange("stressLevel", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sleepHours">Sleep Hours</Label>
                  <Input
                    type="number"
                    id="sleepHours"
                    value={formData.sleepHours}
                    onChange={(e) => handleInputChange("sleepHours", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="workEnvironment">Work Environment</Label>
                  <Input
                    type="text"
                    id="workEnvironment"
                    value={formData.workEnvironment}
                    onChange={(e) => handleInputChange("workEnvironment", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="exposureToChemicals">Exposure to Chemicals</Label>
                  <Checkbox
                    id="exposureToChemicals"
                    checked={formData.exposureToChemicals}
                    onCheckedChange={(checked) => handleInputChange("exposureToChemicals", !!checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="domesticViolence">Domestic Violence</Label>
                  <Input
                    type="text"
                    id="domesticViolence"
                    value={formData.domesticViolence}
                    onChange={(e) => handleInputChange("domesticViolence", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diet Customization Options</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    value={formData.dietaryRestrictions.join(", ")}
                    onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="foodAllergies">Food Allergies</Label>
                  <Textarea
                    id="foodAllergies"
                    value={formData.foodAllergies.join(", ")}
                    onChange={(e) => handleInputChange("foodAllergies", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="culturalDietPreferences">Cultural Diet Preferences</Label>
                  <Input
                    type="text"
                    id="culturalDietPreferences"
                    value={formData.culturalDietPreferences}
                    onChange={(e) => handleInputChange("culturalDietPreferences", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mealPreferences">Meal Preferences</Label>
                  <Textarea
                    id="mealPreferences"
                    value={formData.mealPreferences.join(", ")}
                    onChange={(e) => handleInputChange("mealPreferences", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="cookingTime">Cooking Time Available</Label>
                  <Input
                    type="text"
                    id="cookingTime"
                    value={formData.cookingTime}
                    onChange={(e) => handleInputChange("cookingTime", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Input
                    type="text"
                    id="budgetRange"
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="favoriteIngredients">Favorite Ingredients</Label>
                  <Textarea
                    id="favoriteIngredients"
                    value={formData.favoriteIngredients.join(", ")}
                    onChange={(e) => handleInputChange("favoriteIngredients", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="dislikedFoods">Disliked Foods</Label>
                  <Textarea
                    id="dislikedFoods"
                    value={formData.dislikedFoods.join(", ")}
                    onChange={(e) => handleInputChange("dislikedFoods", e.target.value.split(","))}
                  />
                </div>
                <div>
                  <Label htmlFor="waterIntake">Water Intake (glasses/day)</Label>
                  <Input
                    type="number"
                    id="waterIntake"
                    value={formData.waterIntake}
                    onChange={(e) => handleInputChange("waterIntake", Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="supplementsUsed">Supplements Used</Label>
                  <Textarea
                    id="supplementsUsed"
                    value={formData.supplementsUsed.join(", ")}
                    onChange={(e) => handleInputChange("supplementsUsed", e.target.value.split(","))}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={generateAIAnalysis} disabled={isGeneratingAnalysis}>
              {isGeneratingAnalysis ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Analysis...
                </>
              ) : (
                "Generate AI Analysis"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="analysis">
            {aiAnalysis ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={
                        aiAnalysis.riskLevel === "high"
                          ? "destructive"
                          : aiAnalysis.riskLevel === "moderate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      Risk Level: {aiAnalysis.riskLevel}
                    </Badge>
                    <p>{aiAnalysis.riskAssessment}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {aiAnalysis.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Lab Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {aiAnalysis.suggestedTests.map((test, index) => (
                        <li key={index}>
                          {test.name} - Due Date: {test.dueDate}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Diet Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Daily Calories: {aiAnalysis.dietPlan.dailyCalories}</p>
                    <p>Daily Protein: {aiAnalysis.dietPlan.dailyProtein}</p>
                    <p>Key Nutrients: {aiAnalysis.dietPlan.keyNutrients.join(", ")}</p>
                    <p>Foods to Avoid: {aiAnalysis.dietPlan.avoidFoods.join(", ")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exercise Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Recommended Activities: {aiAnalysis.exercisePlan.recommendedActivities.join(", ")}</p>
                    <p>Restrictions: {aiAnalysis.exercisePlan.restrictions.join(", ")}</p>
                    <p>Warning Signs: {aiAnalysis.exercisePlan.warningSigns.join(", ")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Hospitals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {aiAnalysis.nearbyHospitals.map((hospital, index) => (
                        <li key={index}>
                          {hospital.name} - {hospital.address}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nearby Lab Centers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {aiAnalysis.labCenters.map((lab, index) => (
                        <li key={index}>
                          {lab.name} - {lab.address}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Alert variant="info">
                <AlertDescription>
                  No AI analysis generated yet. Please fill out the form and click "Generate AI Analysis".
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          {/* Detailed Diet Tab */}
          <TabsContent value="detailed-diet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  Detailed Weekly Meal Plan with Nutritional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiAnalysis?.dietPlan?.weeklyMealPlan ? (
                  <div className="space-y-6">
                    {/* Weekly Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{aiAnalysis.dietPlan.dailyCalories}</div>
                        <div className="text-sm text-gray-600">Daily Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{aiAnalysis.dietPlan.dailyProtein}g</div>
                        <div className="text-sm text-gray-600">Daily Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">1400ml</div>
                        <div className="text-sm text-gray-600">Daily Water</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">6</div>
                        <div className="text-sm text-gray-600">Meals/Day</div>
                      </div>
                    </div>

                    {/* Daily Meal Plans */}
                    {aiAnalysis.dietPlan.weeklyMealPlan.map((dayPlan, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold text-lg mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          📅 {dayPlan.day} - Complete Meal Plan
                        </h4>

                        {/* Tabular Format */}
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left text-sm">Time</th>
                                <th className="border border-gray-300 p-2 text-left text-sm">Meal</th>
                                <th className="border border-gray-300 p-2 text-left text-sm">Ingredients</th>
                                <th className="border border-gray-300 p-2 text-center text-sm">Calories</th>
                                <th className="border border-gray-300 p-2 text-center text-sm">Protein</th>
                                <th className="border border-gray-300 p-2 text-center text-sm">Water</th>
                                <th className="border border-gray-300 p-2 text-left text-sm">Nutrients</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-yellow-50">
                                <td className="border border-gray-300 p-2 text-sm font-medium">
                                  {dayPlan.breakfast.timing || "7:00-8:00 AM"}
                                  <br />
                                  <span className="text-xs text-gray-600">🌅 Breakfast</span>
                                </td>
                                <td className="border border-gray-300 p-2 text-sm">
                                  <div className="font-medium">{dayPlan.breakfast.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{dayPlan.breakfast.preparation}</div>
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.breakfast.ingredients.join(", ")}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">
                                  {dayPlan.breakfast.calories}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-green-600">
                                  {dayPlan.breakfast.protein}g
                                </td>
                                <td className="border border-gray-300 p-2 text-center text-blue-600">
                                  {dayPlan.breakfast.waterIntake || "250ml"}
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.breakfast.nutrients || "Carbs: 45g, Fat: 12g, Fiber: 8g"}
                                </td>
                              </tr>
                              <tr className="bg-green-50">
                                <td className="border border-gray-300 p-2 text-sm font-medium">
                                  {dayPlan.morningSnack.timing || "10:00-10:30 AM"}
                                  <br />
                                  <span className="text-xs text-gray-600">☕ Mid-Morning</span>
                                </td>
                                <td className="border border-gray-300 p-2 text-sm">
                                  <div className="font-medium">{dayPlan.morningSnack.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{dayPlan.morningSnack.preparation}</div>
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.morningSnack.ingredients.join(", ")}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">
                                  {dayPlan.morningSnack.calories}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-green-600">
                                  {dayPlan.morningSnack.protein}g
                                </td>
                                <td className="border border-gray-300 p-2 text-center text-blue-600">
                                  {dayPlan.morningSnack.waterIntake || "200ml"}
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.morningSnack.nutrients || "Carbs: 15g, Fat: 6g, Fiber: 3g"}
                                </td>
                              </tr>
                              <tr className="bg-blue-50">
                                <td className="border border-gray-300 p-2 text-sm font-medium">
                                  {dayPlan.lunch.timing || "12:30-1:30 PM"}
                                  <br />
                                  <span className="text-xs text-gray-600">🥗 Lunch</span>
                                </td>
                                <td className="border border-gray-300 p-2 text-sm">
                                  <div className="font-medium">{dayPlan.lunch.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{dayPlan.lunch.preparation}</div>
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.lunch.ingredients.join(", ")}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">
                                  {dayPlan.lunch.calories}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-green-600">
                                  {dayPlan.lunch.protein}g
                                </td>
                                <td className="border border-gray-300 p-2 text-center text-blue-600">
                                  {dayPlan.lunch.waterIntake || "300ml"}
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.lunch.nutrients || "Carbs: 65g, Fat: 18g, Fiber: 12g"}
                                </td>
                              </tr>
                              <tr className="bg-orange-50">
                                <td className="border border-gray-300 p-2 text-sm font-medium">
                                  {dayPlan.afternoonSnack.timing || "4:00-4:30 PM"}
                                  <br />
                                  <span className="text-xs text-gray-600">🍎 Afternoon</span>
                                </td>
                                <td className="border border-gray-300 p-2 text-sm">
                                  <div className="font-medium">{dayPlan.afternoonSnack.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{dayPlan.afternoonSnack.preparation}</div>
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.afternoonSnack.ingredients.join(", ")}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">
                                  {dayPlan.afternoonSnack.calories}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-green-600">
                                  {dayPlan.afternoonSnack.protein}g
                                </td>
                                <td className="border border-gray-300 p-2 text-center text-blue-600">
                                  {dayPlan.afternoonSnack.waterIntake || "200ml"}
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.afternoonSnack.nutrients || "Carbs: 25g, Fat: 8g, Fiber: 5g"}
                                </td>
                              </tr>
                              <tr className="bg-purple-50">
                                <td className="border border-gray-300 p-2 text-sm font-medium">
                                  {dayPlan.dinner.timing || "7:00-8:00 PM"}
                                  <br />
                                  <span className="text-xs text-gray-600">🍽️ Dinner</span>
                                </td>
                                <td className="border border-gray-300 p-2 text-sm">
                                  <div className="font-medium">{dayPlan.dinner.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{dayPlan.dinner.preparation}</div>
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.dinner.ingredients.join(", ")}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">
                                  {dayPlan.dinner.calories}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-green-600">
                                  {dayPlan.dinner.protein}g
                                </td>
                                <td className="border border-gray-300 p-2 text-center text-blue-600">
                                  {dayPlan.dinner.waterIntake || "250ml"}
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.dinner.nutrients || "Carbs: 45g, Fat: 15g, Fiber: 10g"}
                                </td>
                              </tr>
                              <tr className="bg-indigo-50">
                                <td className="border border-gray-300 p-2 text-sm font-medium">
                                  {dayPlan.eveningSnack.timing || "9:30-10:00 PM"}
                                  <br />
                                  <span className="text-xs text-gray-600">🥛 Bedtime</span>
                                </td>
                                <td className="border border-gray-300 p-2 text-sm">
                                  <div className="font-medium">{dayPlan.eveningSnack.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{dayPlan.eveningSnack.preparation}</div>
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.eveningSnack.ingredients.join(", ")}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">
                                  {dayPlan.eveningSnack.calories}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-green-600">
                                  {dayPlan.eveningSnack.protein}g
                                </td>
                                <td className="border border-gray-300 p-2 text-center text-blue-600">
                                  {dayPlan.eveningSnack.waterIntake || "200ml"}
                                </td>
                                <td className="border border-gray-300 p-2 text-xs">
                                  {dayPlan.eveningSnack.nutrients || "Carbs: 18g, Fat: 4g, Fiber: 2g"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Daily Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">🌟 Daily Benefits</h5>
                            <div className="text-sm text-green-700">
                              {[
                                ...new Set([
                                  ...dayPlan.breakfast.benefits,
                                  ...dayPlan.lunch.benefits,
                                  ...dayPlan.dinner.benefits,
                                ]),
                              ]
                                .slice(0, 6)
                                .join(", ")}
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-2">💧 Hydration Plan</h5>
                            <div className="text-sm text-blue-700">
                              Total: 1400ml water + 200ml milk + herbal teas as needed
                            </div>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <h5 className="font-medium text-orange-800 mb-2">📊 Daily Totals</h5>
                            <div className="text-sm text-orange-700">
                              Calories:{" "}
                              {dayPlan.breakfast.calories +
                                dayPlan.morningSnack.calories +
                                dayPlan.lunch.calories +
                                dayPlan.afternoonSnack.calories +
                                dayPlan.dinner.calories +
                                dayPlan.eveningSnack.calories}{" "}
                              kcal
                              <br />
                              Protein:{" "}
                              {dayPlan.breakfast.protein +
                                dayPlan.morningSnack.protein +
                                dayPlan.lunch.protein +
                                dayPlan.afternoonSnack.protein +
                                dayPlan.dinner.protein +
                                dayPlan.eveningSnack.protein}
                              g
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Weekly Summary */}
                    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                      <h4 className="font-semibold text-lg mb-4 text-center">📊 Weekly Nutrition Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold mb-2 text-blue-700">🇮🇳 IMC Recommendations</h5>
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
                          <h5 className="font-semibold mb-2 text-green-700">🌍 WHO Recommendations</h5>
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
                    </Card>
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
    </>
  )
}
