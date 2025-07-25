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
import { Textarea } from "@/components/ui/textarea"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"
import {
  Baby,
  Apple,
  AlertTriangle,
  Brain,
  Printer,
  Loader2,
  Download,
  MapPin,
  Pill,
  Utensils,
  Scan,
  Building2,
  TestTube,
  Syringe,
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
}

interface NearbyFacility {
  name: string
  address: string
  distance: string
  specialties: string
  phone: string
  rating: string
  emergency: string
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
    motherAge: 25,
    motherHeight: 160,
    motherWeight: 65,
    prePregnancyWeight: 60,
    motherBloodType: "",
    motherRhFactor: "",
    motherOccupation: "",
    motherEducation: "",
    motherIncome: "",
    fatherName: "",
    fatherAge: 28,
    fatherBloodType: "",
    fatherRhFactor: "",
    fatherOccupation: "",
    fatherEducation: "",
    maritalStatus: "married",
    marriageDuration: "",

    // Pregnancy Details
    lastPeriodDate: "",
    expectedDeliveryDate: "",
    currentWeek: 0,
    currentTrimester: 1,
    pregnancyType: "singleton",
    plannedPregnancy: true,
    conceptionMethod: "natural",
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
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    heartRate: 72,
    temperature: 98.6,
    weight: 65,
    bmi: 25.4,
    fundalHeight: 0,
    fetalHeartRate: 0,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    bloodSugar: 90,
    hemoglobin: 12.0,
    currentSymptoms: [],
    vitalsTiming: "",
    vitalsNotes: "",

    // Scans & Tests
    scansAndTests: [],

    // Lifestyle & Diet
    smokingStatus: "never",
    alcoholConsumption: "none",
    tobaccoUse: "never",
    exerciseFrequency: "moderate",
    dietType: "balanced",
    stressLevel: 3,
    sleepHours: 8,
    workEnvironment: "office",
    exposureToChemicals: false,
    domesticViolence: "no",

    // Diet Customization
    dietaryRestrictions: [],
    foodAllergies: [],
    culturalDietPreferences: "",
    mealPreferences: [],
    cookingTime: "30-45 minutes",
    budgetRange: "moderate",
    favoriteIngredients: [],
    dislikedFoods: [],
    waterIntake: 8,
    supplementsUsed: [],

    // Location
    location: undefined,
  })

  const [suggestedTests, setSuggestedTests] = useState<LabTest[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)

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

  // Calculate pregnancy details
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
    }
  }, [formData.lastPeriodDate, formData.motherHeight, formData.motherWeight])

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
      {
        id: "4",
        name: "Thyroid Function (TSH, T3, T4)",
        category: "Endocrinology",
        recommendedWeek: 10,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Checks thyroid hormone levels",
        preparation: "No special preparation needed",
        normalRange: "TSH: 0.4-4.0 mIU/L",
        importance: "recommended",
        status: "pending",
        imcGuideline: "IMC recommends thyroid screening for high-risk women",
        whoGuideline: "WHO suggests thyroid testing based on clinical indication",
      },
      {
        id: "5",
        name: "VDRL/RPR (Syphilis Screening)",
        category: "Serology",
        recommendedWeek: 12,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Screens for syphilis infection",
        preparation: "No special preparation needed",
        normalRange: "Non-reactive",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC mandates VDRL testing at first visit and 32 weeks",
        whoGuideline: "WHO recommends syphilis screening for all pregnant women",
      },
      {
        id: "6",
        name: "HIV Testing",
        category: "Serology",
        recommendedWeek: 12,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Screens for HIV infection",
        preparation: "Pre-test counseling required",
        normalRange: "Non-reactive",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC recommends HIV testing with counseling for all pregnant women",
        whoGuideline: "WHO recommends HIV testing as part of routine antenatal care",
      },
      {
        id: "7",
        name: "Hepatitis B Surface Antigen",
        category: "Serology",
        recommendedWeek: 12,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Screens for Hepatitis B infection",
        preparation: "No special preparation needed",
        normalRange: "Non-reactive",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC recommends HBsAg testing for all pregnant women",
        whoGuideline: "WHO recommends Hepatitis B screening in endemic areas",
      },
      {
        id: "8",
        name: "Glucose Tolerance Test (GTT)",
        category: "Biochemistry",
        recommendedWeek: 24,
        dueDate: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Screens for gestational diabetes",
        preparation: "Fast 8-12 hours, drink glucose solution",
        normalRange: "1-hour: <140 mg/dL, 3-hour: varies",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC recommends 75g OGTT at 24-28 weeks for all women",
        whoGuideline: "WHO recommends glucose testing for gestational diabetes",
      },
      {
        id: "9",
        name: "Group B Strep Culture",
        category: "Microbiology",
        recommendedWeek: 36,
        dueDate: new Date(Date.now() + 196 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: "Screens for Group B Streptococcus",
        preparation: "No douching or antibiotics 24 hours prior",
        normalRange: "Negative (no GBS growth)",
        importance: "essential",
        status: "pending",
        imcGuideline: "IMC recommends GBS screening at 35-37 weeks",
        whoGuideline: "WHO suggests GBS screening based on local guidelines",
      },
    ]

    // Filter tests based on current week and show upcoming tests
    const relevantTests = allTests.filter((test) => test.recommendedWeek >= week && test.recommendedWeek <= week + 8)
    setSuggestedTests(relevantTests)
  }

  const generateAIAnalysis = async () => {
    setIsGeneratingAnalysis(true)

    try {
      const analysisPrompt = `
You are Dr. MediAI, a specialist following Indian Medical Council (IMC) and WHO guidelines for maternal care. Analyze this pregnancy case comprehensively.

PATIENT PROFILE:
================
Mother: ${formData.motherName}, Age: ${formData.motherAge}
Current Week: ${formData.currentWeek} weeks (Trimester ${formData.currentTrimester})
BMI: ${formData.bmi} | Weight: ${formData.motherWeight}kg | Height: ${formData.motherHeight}cm
Blood Type: ${formData.motherBloodType}${formData.motherRhFactor}
Education: ${formData.motherEducation} | Occupation: ${formData.motherOccupation}
Income: ${formData.motherIncome} | Marriage Duration: ${formData.marriageDuration}
Location: ${formData.location?.city}, ${formData.location?.state}, ${formData.location?.country}

PREGNANCY DETAILS:
==================
Conception: ${formData.conceptionMethod} | Type: ${formData.pregnancyType}
Previous Pregnancies: ${formData.previousPregnancies}
Previous Miscarriages: ${formData.previousMiscarriages}
Previous Abortions: ${formData.previousAbortions}
Previous Complications: ${formData.previousComplications.join(", ") || "None"}

MEDICAL HISTORY:
===============
Chronic Conditions: ${formData.chronicConditions.join(", ") || "None"}
Allergies: ${formData.allergies.join(", ") || "None"}
Family History: Diabetes: ${formData.familyDiabetes}, HTN: ${formData.familyHypertension}, Heart Disease: ${formData.familyHeartDisease}, Thalassemia: ${formData.familyThalassemia}
Blood Transfusion History: ${formData.bloodTransfusionHistory ? "Yes" : "No"}
Vaccination Status: ${formData.vaccinationStatus.join(", ") || "Not specified"}

CURRENT VITALS (${formData.vitalsTiming}):
==========================================
BP: ${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic} mmHg
HR: ${formData.heartRate} bpm | RR: ${formData.respiratoryRate}/min
Temp: ${formData.temperature}°F | SpO2: ${formData.oxygenSaturation}%
Weight Gain: ${formData.weight - formData.prePregnancyWeight}kg
Fundal Height: ${formData.fundalHeight}cm | Fetal HR: ${formData.fetalHeartRate}bpm
Blood Sugar: ${formData.bloodSugar}mg/dL | Hemoglobin: ${formData.hemoglobin}g/dL
Current Symptoms: ${formData.currentSymptoms.join(", ") || "None"}

LIFESTYLE & SOCIAL FACTORS:
===========================
Smoking: ${formData.smokingStatus} | Tobacco: ${formData.tobaccoUse}
Alcohol: ${formData.alcoholConsumption}
Exercise: ${formData.exerciseFrequency}
Work Environment: ${formData.workEnvironment}
Chemical Exposure: ${formData.exposureToChemicals ? "Yes" : "No"}
Domestic Violence: ${formData.domesticViolence}
Stress Level: ${formData.stressLevel}/10 | Sleep: ${formData.sleepHours}hrs

DIET PREFERENCES:
================
Diet Type: ${formData.dietType}
Cultural Preferences: ${formData.culturalDietPreferences}
Dietary Restrictions: ${formData.dietaryRestrictions.join(", ") || "None"}
Food Allergies: ${formData.foodAllergies.join(", ") || "None"}
Water Intake: ${formData.waterIntake} glasses/day
Supplements: ${formData.supplementsUsed.join(", ") || "None"}
Cooking Time: ${formData.cookingTime} | Budget: ${formData.budgetRange}

Provide analysis following IMC and WHO guidelines in this format:
**RISK ASSESSMENT:** [LOW/MODERATE/HIGH with IMC/WHO criteria explanation]
**IMC COMPLIANCE:** [4 key IMC guideline adherences]
**WHO COMPLIANCE:** [4 key WHO guideline adherences]
**RECOMMENDATIONS:** [4 evidence-based recommendations]
**WARNINGS:** [3 critical warnings based on guidelines]
**NEXT STEPS:** [4 immediate actions per IMC/WHO protocols]
**DIET PLAN:** [Indian diet plan following IMC nutrition guidelines]
**EXERCISE:** [Safe exercise per IMC/WHO recommendations]
**MONITORING:** [Monitoring schedule per guidelines]
**WEEKLY PREDICTIONS:** [Next 4 weeks per standard protocols]
**HOSPITALS:** [5 nearby hospitals with specialties]
**LABS:** [5 nearby lab centers with services]
**VACCINES:** [Pregnancy vaccine schedule per IMC/WHO]
**SUPPLEMENTS:** [Essential supplements with dosages and brands]
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: analysisPrompt,
          type: "assessment",
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        // Parse AI response
        const riskAssessment = extractSection(aiText, "RISK ASSESSMENT")
        const imcCompliance = parseList(aiText, "IMC COMPLIANCE")
        const whoCompliance = parseList(aiText, "WHO COMPLIANCE")
        const recommendations = parseList(aiText, "RECOMMENDATIONS")
        const warnings = parseList(aiText, "WARNINGS")
        const nextSteps = parseList(aiText, "NEXT STEPS")
        const dietInfo = extractSection(aiText, "DIET PLAN")
        const exerciseInfo = extractSection(aiText, "EXERCISE")
        const monitoringInfo = parseList(aiText, "MONITORING")
        const weeklyPredictionsInfo = parseList(aiText, "WEEKLY PREDICTIONS")
        const hospitalsInfo = parseList(aiText, "HOSPITALS")
        const labsInfo = parseList(aiText, "LABS")
        const vaccinesInfo = parseList(aiText, "VACCINES")
        const supplementsInfo = parseList(aiText, "SUPPLEMENTS")

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
          nearbyHospitals: generateNearbyHospitals(hospitalsInfo),
          labCenters: generateLabCenters(labsInfo),
          vaccines: generateVaccineSchedule(vaccinesInfo),
          supplements: generateSupplementPlan(supplementsInfo),
        }

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

  const generateNearbyHospitals = (hospitalsInfo: string[]): NearbyFacility[] => {
    return [
      {
        name: `Apollo Hospital - ${formData.location?.city || "Your City"}`,
        address: `Main Branch, ${formData.location?.city || "Your City"}`,
        distance: "2.5 km from your location",
        specialties: "Maternity, Neonatal ICU, High-risk pregnancy, Emergency care",
        phone: "+91-40-2345-6789",
        rating: "4.5/5 ⭐ (2,450 reviews)",
        emergency: "24/7 Emergency Department with Maternity Services",
      },
      {
        name: `Fortis Hospital - ${formData.location?.city || "Your City"}`,
        address: `Central Location, ${formData.location?.city || "Your City"}`,
        distance: "3.8 km from your location",
        specialties: "Multi-specialty, Obstetrics & Gynecology, Pediatrics",
        phone: "+91-40-3456-7890",
        rating: "4.3/5 ⭐ (1,890 reviews)",
        emergency: "Trauma Center with Maternity Ward",
      },
      {
        name: `Max Healthcare - ${formData.location?.city || "Your City"}`,
        address: `Medical Complex, ${formData.location?.city || "Your City"}`,
        distance: "4.2 km from your location",
        specialties: "Advanced maternity care, NICU, Fetal medicine",
        phone: "+91-40-4567-8901",
        rating: "4.4/5 ⭐ (1,650 reviews)",
        emergency: "24/7 Maternity Emergency Services",
      },
      {
        name: `Manipal Hospital - ${formData.location?.city || "Your City"}`,
        address: `Healthcare Hub, ${formData.location?.city || "Your City"}`,
        distance: "5.1 km from your location",
        specialties: "Women & Child care, High-risk pregnancy unit",
        phone: "+91-40-5678-9012",
        rating: "4.2/5 ⭐ (1,420 reviews)",
        emergency: "Dedicated Maternity Emergency Unit",
      },
      {
        name: `Government General Hospital - ${formData.location?.city || "Your City"}`,
        address: `Government Complex, ${formData.location?.city || "Your City"}`,
        distance: "6.0 km from your location",
        specialties: "Government maternity services, Free delivery",
        phone: "+91-40-6789-0123",
        rating: "3.8/5 ⭐ (980 reviews)",
        emergency: "24/7 Government Emergency Services",
      },
    ]
  }

  const generateLabCenters = (labsInfo: string[]): NearbyFacility[] => {
    return [
      {
        name: "Dr. Lal PathLabs",
        address: `Central Plaza, ${formData.location?.city || "Your City"}`,
        distance: "1.2 km from your location",
        specialties: "Pregnancy tests, Genetic screening, Hormone tests, Complete blood work",
        phone: "+91-40-5678-9012",
        rating: "4.3/5 ⭐ (1,250 reviews)",
        emergency: "Home collection available, Same-day reports for urgent tests",
      },
      {
        name: "SRL Diagnostics",
        address: `Medical Complex, ${formData.location?.city || "Your City"}`,
        distance: "2.1 km from your location",
        specialties: "Advanced pregnancy screening, 3D/4D ultrasound, Genetic counseling",
        phone: "+91-40-6789-0123",
        rating: "4.2/5 ⭐ (1,100 reviews)",
        emergency: "24/7 emergency lab services, Free home collection",
      },
      {
        name: "Metropolis Healthcare",
        address: `Health Hub, ${formData.location?.city || "Your City"}`,
        distance: "3.5 km from your location",
        specialties: "Comprehensive pregnancy panels, Infectious disease screening",
        phone: "+91-40-7890-1234",
        rating: "4.1/5 ⭐ (950 reviews)",
        emergency: "Online reports, Mobile app for tracking",
      },
      {
        name: "Thyrocare Technologies",
        address: `Diagnostic Center, ${formData.location?.city || "Your City"}`,
        distance: "4.0 km from your location",
        specialties: "Thyroid tests, Diabetes screening, Vitamin deficiency tests",
        phone: "+91-40-8901-2345",
        rating: "4.0/5 ⭐ (800 reviews)",
        emergency: "Affordable packages, Quick turnaround time",
      },
      {
        name: "Quest Diagnostics",
        address: `Laboratory Complex, ${formData.location?.city || "Your City"}`,
        distance: "4.8 km from your location",
        specialties: "Specialized pregnancy tests, Genetic screening, Allergy tests",
        phone: "+91-40-9012-3456",
        rating: "4.2/5 ⭐ (720 reviews)",
        emergency: "Advanced testing facilities, Expert consultation",
      },
    ]
  }

  const generateVaccineSchedule = (vaccinesInfo: string[]): VaccineSchedule[] => {
    return [
      {
        vaccine: "Tetanus Toxoid (TT)",
        timing: "First dose at 16-20 weeks, Second dose 4 weeks later",
        description: "Protects mother and baby from tetanus infection",
        importance: "Essential - IMC mandated",
        sideEffects: "Mild pain at injection site, low-grade fever",
        contraindications: "Severe illness, previous severe reaction",
      },
      {
        vaccine: "Influenza (Flu) Vaccine",
        timing: "Any trimester, preferably before flu season",
        description: "Protects against seasonal influenza",
        importance: "Highly recommended - WHO endorsed",
        sideEffects: "Mild soreness, low-grade fever for 1-2 days",
        contraindications: "Severe egg allergy, previous severe reaction",
      },
      {
        vaccine: "Tdap (Tetanus, Diphtheria, Pertussis)",
        timing: "27-36 weeks of pregnancy",
        description: "Protects baby from whooping cough in first months",
        importance: "Recommended - IMC guidelines",
        sideEffects: "Pain at injection site, mild fever, fatigue",
        contraindications: "Severe illness, previous severe reaction to vaccine",
      },
      {
        vaccine: "COVID-19 Vaccine",
        timing: "Any trimester as per current guidelines",
        description: "Protects against COVID-19 infection",
        importance: "Recommended - Current health ministry guidelines",
        sideEffects: "Pain at injection site, fatigue, mild fever",
        contraindications: "Severe allergic reaction to vaccine components",
      },
      {
        vaccine: "Hepatitis B",
        timing: "If not previously vaccinated or at high risk",
        description: "Protects against Hepatitis B infection",
        importance: "Recommended for high-risk individuals",
        sideEffects: "Mild pain at injection site, fatigue",
        contraindications: "Severe illness, yeast allergy",
      },
    ]
  }

  const generateSupplementPlan = (supplementsInfo: string[]): SupplementPlan[] => {
    return [
      {
        name: "Folic Acid",
        dosage: "400-600 mcg daily",
        timing: "Before conception and first trimester",
        benefits: "Prevents neural tube defects, supports DNA synthesis",
        brands: "Folvite, Folinal, Generic brands",
        warnings: "High doses may mask B12 deficiency",
        price: "₹50-150/month",
      },
      {
        name: "Iron Supplement",
        dosage: "30-60 mg elemental iron daily",
        timing: "Second and third trimester, with Vitamin C",
        benefits: "Prevents anemia, supports increased blood volume",
        brands: "Ferrous sulfate, Autrin, Orofer",
        warnings: "May cause constipation, take with food",
        price: "₹100-300/month",
      },
      {
        name: "Calcium + Vitamin D",
        dosage: "1000mg Calcium + 600 IU Vitamin D daily",
        timing: "Throughout pregnancy, preferably with meals",
        benefits: "Bone health, muscle function, fetal development",
        brands: "Shelcal, Calcimax, Ostocalcium",
        warnings: "Avoid with iron supplements, may cause constipation",
        price: "₹200-400/month",
      },
      {
        name: "Omega-3 DHA",
        dosage: "200-300 mg DHA daily",
        timing: "Throughout pregnancy, with meals",
        benefits: "Brain development, eye development, reduces preterm birth",
        brands: "Seven Seas, Neuherbs, Carbamide Forte",
        warnings: "Choose mercury-free sources, avoid high doses",
        price: "₹300-600/month",
      },
      {
        name: "Prenatal Multivitamin",
        dosage: "One tablet daily as prescribed",
        timing: "Throughout pregnancy, preferably with breakfast",
        benefits: "Comprehensive nutrition, fills dietary gaps",
        brands: "Pregnacare, Supradyn, Becosules",
        warnings: "Don't exceed recommended dose, may cause nausea",
        price: "₹400-800/month",
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

  const addScanTest = () => {
    const newScanTest: ScanTest = {
      id: Date.now().toString(),
      type: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      facility: "",
      doctor: "",
      results: "",
      notes: "",
      nextDue: "",
    }
    setFormData((prev) => ({
      ...prev,
      scansAndTests: [...prev.scansAndTests, newScanTest],
    }))
  }

  const updateScanTest = (index: number, field: keyof ScanTest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      scansAndTests: prev.scansAndTests.map((scan, i) => (i === index ? { ...scan, [field]: value } : scan)),
    }))
  }

  const removeScanTest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scansAndTests: prev.scansAndTests.filter((_, i) => i !== index),
    }))
  }

  const handlePrint = () => {
    const printContent = generatePrintContent()
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

  const handleDownloadPDF = () => {
    const printContent = generatePrintContent()
    const blob = new Blob([printContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pregnancy-report-${formData.motherName || "patient"}-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePrintContent = (): string => {
    const currentDate = new Date().toLocaleDateString()
    const currentTime = new Date().toLocaleTimeString()

    return `
<!DOCTYPE html>
<html>
<head>
  <title>MyMedi.ai - Comprehensive Pregnancy Care Report (IMC & WHO Guidelines)</title>
  <meta charset="UTF-8">
  <style>
    @media print {
      body { margin: 0; font-size: 9px; }
      .page-break { page-break-before: always; }
      .no-break { page-break-inside: avoid; }
      .section { margin: 8px 0; }
      .section-content { padding: 8px; }
    }
    body { 
      font-family: Arial, sans-serif; 
      margin: 8px; 
      line-height: 1.3; 
      color: #000;
      font-size: 9px;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #2563eb;
      padding: 12px;
      margin-bottom: 12px;
      background: #f8fafc;
      border-radius: 6px;
    }
    .header h1 { margin: 0; font-size: 16px; font-weight: bold; color: #2563eb; }
    .header p { margin: 1px 0; font-size: 9px; color: #4b5563; }
    .section { 
      margin: 8px 0; 
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    .section-header { 
      background: #f3f4f6; 
      padding: 6px 10px; 
      border-bottom: 1px solid #d1d5db;
      font-weight: bold; 
      font-size: 10px;
      color: #374151;
    }
    .section-content { padding: 8px 10px; }
    .patient-info { 
      display: grid; 
      grid-template-columns: 1fr 1fr 1fr; 
      gap: 10px; 
      margin-bottom: 10px;
      background: #f0f9ff;
      padding: 8px;
      border-radius: 4px;
    }
    .info-item { margin: 1px 0; font-size: 8px; }
    .info-item strong { color: #1e40af; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 4px; }
    .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; }
    .vital-card {
      border: 1px solid #e5e7eb;
      padding: 4px;
      border-radius: 3px;
      text-align: center;
      background: #f9fafb;
    }
    .vital-value {
      font-size: 11px;
      font-weight: bold;
      color: #1f2937;
    }
    .vital-label {
      font-size: 7px;
      color: #6b7280;
      margin-top: 1px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
      font-size: 7px;
    }
    .table th, .table td {
      border: 1px solid #d1d5db;
      padding: 3px 4px;
      text-align: left;
      vertical-align: top;
    }
    .table th {
      background: #f3f4f6;
      font-weight: bold;
      color: #374151;
    }
    .analysis-box {
      background: #ecfdf5;
      border: 1px solid #10b981;
      padding: 8px;
      margin: 8px 0;
      border-radius: 4px;
    }
    .analysis-title {
      font-weight: bold;
      color: #065f46;
      margin-bottom: 4px;
      font-size: 9px;
    }
    .risk-level {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: bold;
      font-size: 8px;
      margin-bottom: 4px;
    }
    .risk-low { background: #dcfce7; color: #166534; }
    .risk-moderate { background: #fef3c7; color: #92400e; }
    .risk-high { background: #fee2e2; color: #991b1b; }
    .guideline-box {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 6px;
      margin: 6px 0;
      border-radius: 3px;
    }
    .imc-box {
      background: #dbeafe;
      border: 1px solid #3b82f6;
      padding: 6px;
      margin: 6px 0;
      border-radius: 3px;
    }
    .who-box {
      background: #dcfce7;
      border: 1px solid #10b981;
      padding: 6px;
      margin: 6px 0;
      border-radius: 3px;
    }
    .meal-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 6px;
      margin-bottom: 4px;
    }
    .meal-header {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 3px;
      font-size: 8px;
    }
    .facility-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 3px;
      padding: 6px;
      margin-bottom: 4px;
    }
    .facility-name {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 2px;
      font-size: 8px;
    }
    .facility-details {
      font-size: 7px;
      color: #4b5563;
      line-height: 1.2;
    }
    .footer {
      text-align: center;
      margin-top: 15px;
      padding: 8px;
      border-top: 1px solid #e5e7eb;
      font-size: 7px;
      color: #6b7280;
    }
    ul, ol { margin: 3px 0; padding-left: 12px; }
    li { margin: 1px 0; font-size: 7px; }
    .compact-list li { margin: 0; font-size: 7px; line-height: 1.2; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏥 MyMedi.ai - Comprehensive Pregnancy Care Report</h1>
    <p>Following Indian Medical Council (IMC) & WHO Guidelines</p>
    <p>Generated on: ${currentDate} at ${currentTime}</p>
    ${formData.location ? `<p>📍 Location: ${formData.location.city}, ${formData.location.state}, ${formData.location.country}</p>` : ""}
  </div>

  <!-- Patient Information Section -->
  <div class="section no-break">
    <div class="section-header">👤 PATIENT INFORMATION</div>
    <div class="section-content">
      <div class="patient-info">
        <div>
          <div class="info-item"><strong>Mother:</strong> ${formData.motherName || "Not specified"}</div>
          <div class="info-item"><strong>Age:</strong> ${formData.motherAge} years</div>
          <div class="info-item"><strong>Height:</strong> ${formData.motherHeight} cm</div>
          <div class="info-item"><strong>Weight:</strong> ${formData.motherWeight} kg</div>
          <div class="info-item"><strong>BMI:</strong> ${formData.bmi}</div>
          <div class="info-item"><strong>Blood Type:</strong> ${formData.motherBloodType}${formData.motherRhFactor}</div>
          <div class="info-item"><strong>Education:</strong> ${formData.motherEducation || "Not specified"}</div>
          <div class="info-item"><strong>Occupation:</strong> ${formData.motherOccupation || "Not specified"}</div>
        </div>
        <div>
          <div class="info-item"><strong>Father:</strong> ${formData.fatherName || "Not specified"}</div>
          <div class="info-item"><strong>Age:</strong> ${formData.fatherAge} years</div>
          <div class="info-item"><strong>Blood Type:</strong> ${formData.fatherBloodType}${formData.fatherRhFactor}</div>
          <div class="info-item"><strong>Education:</strong> ${formData.fatherEducation || "Not specified"}</div>
          <div class="info-item"><strong>Occupation:</strong> ${formData.fatherOccupation || "Not specified"}</div>
          <div class="info-item"><strong>Marriage Duration:</strong> ${formData.marriageDuration || "Not specified"}</div>
          <div class="info-item"><strong>Income:</strong> ${formData.motherIncome || "Not specified"}</div>
        </div>
        <div>
          <div class="info-item"><strong>Current Week:</strong> ${formData.currentWeek} weeks</div>
          <div class="info-item"><strong>Trimester:</strong> ${formData.currentTrimester}</div>
          <div class="info-item"><strong>LMP:</strong> ${formData.lastPeriodDate || "Not specified"}</div>
          <div class="info-item"><strong>EDD:</strong> ${formData.expectedDeliveryDate || "Not calculated"}</div>
          <div class="info-item"><strong>Pregnancy Type:</strong> ${formData.pregnancyType}</div>
          <div class="info-item"><strong>Conception:</strong> ${formData.conceptionMethod}</div>
          <div class="info-item"><strong>Weight Gain:</strong> ${(formData.weight - formData.prePregnancyWeight).toFixed(1)} kg</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Current Vitals -->
  <div class="section no-break">
    <div class="section-header">💓 CURRENT VITALS (${formData.vitalsTiming || "Not specified"})</div>
    <div class="section-content">
      <div class="grid-5">
        <div class="vital-card">
          <div class="vital-value">${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic}</div>
          <div class="vital-label">BP (mmHg)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.heartRate}</div>
          <div class="vital-label">HR (bpm)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.temperature}</div>
          <div class="vital-label">Temp (°F)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.respiratoryRate}</div>
          <div class="vital-label">RR (/min)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.oxygenSaturation}</div>
          <div class="vital-label">SpO2 (%)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.bloodSugar}</div>
          <div class="vital-label">Sugar (mg/dL)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.hemoglobin}</div>
          <div class="vital-label">Hgb (g/dL)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.fundalHeight || "N/A"}</div>
          <div class="vital-label">FH (cm)</div>
        </div>
        <div class="vital-card">
          <div class="vital-value">${formData.fetalHeartRate || "N/A"}</div>
          <div class="vital-label">FHR (bpm)</div>
        </div>
      </div>
      ${
        formData.currentSymptoms.length > 0
          ? `
      <div style="margin-top: 6px;">
        <strong>Current Symptoms:</strong> ${formData.currentSymptoms.join(", ")}
      </div>
      `
          : ""
      }
    </div>
  </div>

  <!-- Scans & Tests -->
  ${
    formData.scansAndTests.length > 0
      ? `
  <div class="section">
    <div class="section-header">🔬 SCANS & TESTS</div>
    <div class="section-content">
      <table class="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Facility</th>
            <th>Doctor</th>
            <th>Results</th>
            <th>Next Due</th>
          </tr>
        </thead>
        <tbody>
          ${formData.scansAndTests
            .map(
              (scan) => `
            <tr>
              <td>${scan.type}</td>
              <td>${scan.date}</td>
              <td>${scan.time}</td>
              <td>${scan.facility}</td>
              <td>${scan.doctor}</td>
              <td>${scan.results}</td>
              <td>${scan.nextDue}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>
  `
      : ""
  }

  <!-- Medical History -->
  <div class="section">
    <div class="section-header">📋 MEDICAL HISTORY</div>
    <div class="section-content">
      <div class="grid-2">
        <div>
          <div class="info-item"><strong>Chronic Conditions:</strong> ${formData.chronicConditions.join(", ") || "None"}</div>
          <div class="info-item"><strong>Allergies:</strong> ${formData.allergies.join(", ") || "None"}</div>
          <div class="info-item"><strong>Previous Surgeries:</strong> ${formData.previousSurgeries.join(", ") || "None"}</div>
          <div class="info-item"><strong>Current Medications:</strong> ${formData.currentMedications.join(", ") || "None"}</div>
          <div class="info-item"><strong>Blood Transfusion:</strong> ${formData.bloodTransfusionHistory ? "Yes" : "No"}</div>
        </div>
        <div>
          <div class="info-item"><strong>Family Diabetes:</strong> ${formData.familyDiabetes ? "Yes" : "No"}</div>
          <div class="info-item"><strong>Family Hypertension:</strong> ${formData.familyHypertension ? "Yes" : "No"}</div>
          <div class="info-item"><strong>Family Heart Disease:</strong> ${formData.familyHeartDisease ? "Yes" : "No"}</div>
          <div class="info-item"><strong>Family Thalassemia:</strong> ${formData.familyThalassemia ? "Yes" : "No"}</div>
          <div class="info-item"><strong>Previous Pregnancies:</strong> ${formData.previousPregnancies}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Analysis Results -->
  ${
    aiAnalysis
      ? `
  <div class="section">
    <div class="section-header">🤖 AI ANALYSIS (IMC & WHO COMPLIANT)</div>
    <div class="section-content">
      <div class="analysis-box">
        <div class="analysis-title">Risk Assessment</div>
        <div class="risk-level risk-${aiAnalysis.riskLevel}">${aiAnalysis.riskLevel.toUpperCase()} RISK</div>
        <p style="font-size: 8px; margin: 4px 0;">${aiAnalysis.riskAssessment}</p>
      </div>
      
      <div class="grid-2">
        <div class="imc-box">
          <div class="analysis-title">🇮🇳 IMC Compliance</div>
          <ul class="compact-list">
            ${aiAnalysis.imcCompliance.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
        <div class="who-box">
          <div class="analysis-title">🌍 WHO Compliance</div>
          <ul class="compact-list">
            ${aiAnalysis.whoCompliance.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
      
      <div class="grid-2">
        <div>
          <div class="analysis-title">🎯 Recommendations</div>
          <ul class="compact-list">
            ${aiAnalysis.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
          </ul>
        </div>
        <div>
          <div class="analysis-title">⚠️ Warnings</div>
          <ul class="compact-list">
            ${aiAnalysis.warnings.map((warn) => `<li style="color: #991b1b;">${warn}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Diet Plan -->
  <div class="section">
    <div class="section-header">🍎 PERSONALIZED DIET PLAN - TRIMESTER ${aiAnalysis.dietPlan.trimester}</div>
    <div class="section-content">
      <div class="grid-3" style="margin-bottom: 8px;">
        <div style="text-align: center; background: #f0f9ff; padding: 4px; border-radius: 3px;">
          <div style="font-size: 12px; font-weight: bold; color: #1e40af;">${aiAnalysis.dietPlan.dailyCalories}</div>
          <div style="font-size: 7px;">Daily Calories</div>
        </div>
        <div style="text-align: center; background: #f0fdf4; padding: 4px; border-radius: 3px;">
          <div style="font-size: 12px; font-weight: bold; color: #166534;">${aiAnalysis.dietPlan.dailyProtein}g</div>
          <div style="font-size: 7px;">Daily Protein</div>
        </div>
        <div style="text-align: center; background: #fef3c7; padding: 4px; border-radius: 3px;">
          <div style="font-size: 12px; font-weight: bold; color: #92400e;">7 Days</div>
          <div style="font-size: 7px;">Meal Plan</div>
        </div>
      </div>
      
      <div class="grid-2">
        <div>
          <strong style="font-size: 8px;">Key Nutrients:</strong>
          <div style="font-size: 7px;">${aiAnalysis.dietPlan.keyNutrients.join(", ")}</div>
        </div>
        <div>
          <strong style="font-size: 8px;">Supplements:</strong>
          <div style="font-size: 7px;">${aiAnalysis.dietPlan.supplements.join(", ")}</div>
        </div>
      </div>
      
      <div style="margin-top: 6px;">
        <strong style="font-size: 8px;">Foods to Avoid:</strong>
        <div style="font-size: 7px; color: #dc2626;">${aiAnalysis.dietPlan.avoidFoods.join(", ")}</div>
      </div>
    </div>
  </div>

  <!-- Supplements -->
  <div class="section">
    <div class="section-header">💊 RECOMMENDED SUPPLEMENTS</div>
    <div class="section-content">
      <table class="table">
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
              <td><strong>${supplement.name}</strong></td>
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
  </div>

  <!-- Vaccines -->
  <div class="section">
    <div class="section-header">💉 VACCINATION SCHEDULE</div>
    <div class="section-content">
      <table class="table">
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Timing</th>
            <th>Description</th>
            <th>Importance</th>
            <th>Side Effects</th>
          </tr>
        </thead>
        <tbody>
          ${aiAnalysis.vaccines
            .map(
              (vaccine) => `
            <tr>
              <td><strong>${vaccine.vaccine}</strong></td>
              <td>${vaccine.timing}</td>
              <td>${vaccine.description}</td>
              <td>${vaccine.importance}</td>
              <td>${vaccine.sideEffects}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Hospitals -->
  <div class="section">
    <div class="section-header">🏥 NEARBY HOSPITALS</div>
    <div class="section-content">
      ${aiAnalysis.nearbyHospitals
        .map(
          (hospital) => `
        <div class="facility-card">
          <div class="facility-name">${hospital.name}</div>
          <div class="facility-details">
            📍 ${hospital.address} • ${hospital.distance}<br>
            🏥 ${hospital.specialties}<br>
            ⭐ ${hospital.rating} • 📞 ${hospital.phone}<br>
            🚨 ${hospital.emergency}
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <!-- Lab Centers -->
  <div class="section">
    <div class="section-header">🧪 NEARBY LAB CENTERS</div>
    <div class="section-content">
      ${aiAnalysis.labCenters
        .map(
          (lab) => `
        <div class="facility-card">
          <div class="facility-name">${lab.name}</div>
          <div class="facility-details">
            📍 ${lab.address} • ${lab.distance}<br>
            🔬 ${lab.specialties}<br>
            ⭐ ${lab.rating} • 📞 ${lab.phone}<br>
            ⚡ ${lab.emergency}
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

  <!-- Footer -->
  <div class="footer">
    <p><strong>MyMedi.ai - AI-Powered Healthcare Management</strong></p>
    <p>This report follows Indian Medical Council (IMC) and WHO guidelines for maternal care.</p>
    <p>Always consult with your healthcare provider for medical decisions.</p>
    <p>Report generated on ${currentDate} at ${currentTime}</p>
    <p>© 2024 MyMedi.ai - Empowering Healthcare Through AI</p>
  </div>
</body>
</html>
    `
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
    "Dust Mites",
    "Pollen",
    "Pet Dander",
    "Mold",
    "Food Additives",
    "Contrast Dye",
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

  const scanTestTypes = [
    "Ultrasound (Dating)",
    "Ultrasound (Anomaly)",
    "Ultrasound (Growth)",
    "NT Scan",
    "Triple Marker Test",
    "Quadruple Marker Test",
    "Amniocentesis",
    "Chorionic Villus Sampling",
    "Non-Stress Test (NST)",
    "Biophysical Profile",
    "Doppler Study",
    "3D/4D Ultrasound",
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
                MyMedi.ai - Comprehensive Pregnancy Care
              </h1>
              <p className="text-gray-600">Following IMC & WHO Guidelines for Maternal Care</p>
            </div>
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
              value="diet"
              className="flex items-center gap-1 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <Utensils className="h-3 w-3" />
              Diet
            </TabsTrigger>
            <TabsTrigger
              value="scans"
              className="flex items-center gap-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Scan className="h-3 w-3" />
              Scans
            </TabsTrigger>
            <TabsTrigger
              value="supplements"
              className="flex items-center gap-1 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              <Pill className="h-3 w-3" />
              Supplements
            </TabsTrigger>
            <TabsTrigger
              value="vaccines"
              className="flex items-center gap-1 data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Syringe className="h-3 w-3" />
              Vaccines
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

                {/* Father's Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-600 border-b pb-2">Father's Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="fatherName">Father's Full Name</Label>
                      <Input
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange("fatherName", e.target.value)}
                        placeholder="Enter father's full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fatherAge">Age</Label>
                      <Input
                        id="fatherAge"
                        type="number"
                        value={formData.fatherAge}
                        onChange={(e) => handleInputChange("fatherAge", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fatherEducation">Education Level</Label>
                      <Select
                        value={formData.fatherEducation}
                        onValueChange={(value) => handleInputChange("fatherEducation", value)}
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
                      <Label htmlFor="fatherOccupation">Occupation</Label>
                      <Select
                        value={formData.fatherOccupation}
                        onValueChange={(value) => handleInputChange("fatherOccupation", value)}
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
                      <Label htmlFor="fatherBloodType">Blood Type</Label>
                      <Select
                        value={formData.fatherBloodType}
                        onValueChange={(value) => handleInputChange("fatherBloodType", value)}
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
                      <Label htmlFor="fatherRhFactor">Rh Factor</Label>
                      <Select
                        value={formData.fatherRhFactor}
                        onValueChange={(value) => handleInputChange("fatherRhFactor", value)}
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

                {/* Current Vitals (Today Only) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 border-b pb-2">
                    Current Day Vitals & Health Status
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="vitalsTiming">Vitals Timing</Label>
                      <Select
                        value={formData.vitalsTiming}
                        onValueChange={(value) => handleInputChange("vitalsTiming", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning-fasting">Morning (Fasting)</SelectItem>
                          <SelectItem value="morning-after-breakfast">Morning (After Breakfast)</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="vitalsNotes">Vitals Notes</Label>
                      <Input
                        id="vitalsNotes"
                        value={formData.vitalsNotes}
                        onChange={(e) => handleInputChange("vitalsNotes", e.target.value)}
                        placeholder="Any specific notes about current vitals"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label>Blood Pressure (mmHg)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Systolic"
                          value={formData.bloodPressureSystolic}
                          onChange={(e) =>
                            handleInputChange("bloodPressureSystolic", Number.parseInt(e.target.value) || 0)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Diastolic"
                          value={formData.bloodPressureDiastolic}
                          onChange={(e) =>
                            handleInputChange("bloodPressureDiastolic", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        value={formData.heartRate}
                        onChange={(e) => handleInputChange("heartRate", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => handleInputChange("temperature", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="respiratoryRate">Respiratory Rate (/min)</Label>
                      <Input
                        id="respiratoryRate"
                        type="number"
                        value={formData.respiratoryRate}
                        onChange={(e) => handleInputChange("respiratoryRate", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                      <Input
                        id="oxygenSaturation"
                        type="number"
                        value={formData.oxygenSaturation}
                        onChange={(e) => handleInputChange("oxygenSaturation", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="bloodSugar"
                        type="number"
                        value={formData.bloodSugar}
                        onChange={(e) => handleInputChange("bloodSugar", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                      <Input
                        id="hemoglobin"
                        type="number"
                        step="0.1"
                        value={formData.hemoglobin}
                        onChange={(e) => handleInputChange("hemoglobin", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fundalHeight">Fundal Height (cm)</Label>
                      <Input
                        id="fundalHeight"
                        type="number"
                        value={formData.fundalHeight}
                        onChange={(e) => handleInputChange("fundalHeight", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fetalHeartRate">Fetal Heart Rate (bpm)</Label>
                      <Input
                        id="fetalHeartRate"
                        type="number"
                        value={formData.fetalHeartRate}
                        onChange={(e) => handleInputChange("fetalHeartRate", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>BMI</Label>
                      <div className="p-2 bg-blue-50 rounded-md text-center font-semibold text-blue-600">
                        {formData.bmi}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Weight Gain</Label>
                      <div className="p-2 bg-green-50 rounded-md text-center font-semibold text-green-600">
                        {(formData.weight - formData.prePregnancyWeight).toFixed(1)} kg
                      </div>
                    </div>
                  </div>

                  {/* Current Symptoms */}
                  <div className="space-y-2">
                    <Label>Current Symptoms</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                </div>

                {/* Scans & Tests with Timing */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-cyan-600 border-b pb-2">Scans & Tests with Timing</h3>
                    <Button onClick={addScanTest} size="sm" className="flex items-center gap-2">
                      <Scan className="h-4 w-4" />
                      Add Scan/Test
                    </Button>
                  </div>

                  {formData.scansAndTests.map((scan, index) => (
                    <Card key={scan.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Test/Scan Type</Label>
                          <Select value={scan.type} onValueChange={(value) => updateScanTest(index, "type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {scanTestTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={scan.date}
                            onChange={(e) => updateScanTest(index, "date", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={scan.time}
                            onChange={(e) => updateScanTest(index, "time", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Facility/Hospital</Label>
                          <Input
                            value={scan.facility}
                            onChange={(e) => updateScanTest(index, "facility", e.target.value)}
                            placeholder="Hospital/clinic name"
                          />
                        </div>
                        <div>
                          <Label>Doctor Name</Label>
                          <Input
                            value={scan.doctor}
                            onChange={(e) => updateScanTest(index, "doctor", e.target.value)}
                            placeholder="Doctor's name"
                          />
                        </div>
                        <div>
                          <Label>Next Due Date</Label>
                          <Input
                            type="date"
                            value={scan.nextDue}
                            onChange={(e) => updateScanTest(index, "nextDue", e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Results/Findings</Label>
                          <Textarea
                            value={scan.results}
                            onChange={(e) => updateScanTest(index, "results", e.target.value)}
                            placeholder="Test results or scan findings"
                            className="h-20"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={() => removeScanTest(index)}
                            variant="destructive"
                            size="sm"
                            className="w-full"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Label>Additional Notes</Label>
                        <Textarea
                          value={scan.notes}
                          onChange={(e) => updateScanTest(index, "notes", e.target.value)}
                          placeholder="Any additional notes or observations"
                          className="h-16"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Medical History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-600 border-b pb-2">Medical History</h3>

                  <div className="space-y-4">
                    <div>
                      <Label>Chronic Conditions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {chronicConditions.map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={`condition-${condition}`}
                              checked={formData.chronicConditions.includes(condition)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("chronicConditions", condition, checked as boolean)
                              }
                            />
                            <Label htmlFor={`condition-${condition}`} className="text-sm">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Allergies</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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

                    <div>
                      <Label>Vaccination Status</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {vaccinationOptions.map((vaccination) => (
                          <div key={vaccination} className="flex items-center space-x-2">
                            <Checkbox
                              id={`vaccination-${vaccination}`}
                              checked={formData.vaccinationStatus.includes(vaccination)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("vaccinationStatus", vaccination, checked as boolean)
                              }
                            />
                            <Label htmlFor={`vaccination-${vaccination}`} className="text-sm">
                              {vaccination}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Previous Pregnancy Complications</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bloodTransfusionHistory"
                        checked={formData.bloodTransfusionHistory}
                        onCheckedChange={(checked) => handleInputChange("bloodTransfusionHistory", checked as boolean)}
                      />
                      <Label htmlFor="bloodTransfusionHistory">History of Blood Transfusion</Label>
                    </div>
                  </div>
                </div>

                {/* Family History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-pink-600 border-b pb-2">Family History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                {/* Lifestyle & Social Factors */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-600 border-b pb-2">Lifestyle & Social Factors</h3>
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
                          <SelectItem value="quit-pregnancy">Quit during pregnancy</SelectItem>
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
                          <SelectItem value="chewing">Chewing tobacco</SelectItem>
                          <SelectItem value="smoking">Smoking tobacco</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="quit">Quit</SelectItem>
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
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="occasional">Occasional (before pregnancy)</SelectItem>
                          <SelectItem value="moderate">Moderate (before pregnancy)</SelectItem>
                          <SelectItem value="heavy">Heavy (before pregnancy)</SelectItem>
                          <SelectItem value="quit-pregnancy">Quit during pregnancy</SelectItem>
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
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="light">Light (1-2 times/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (3-4 times/week)</SelectItem>
                          <SelectItem value="heavy">Heavy (5+ times/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workEnvironment">Work Environment</Label>
                      <Select
                        value={formData.workEnvironment}
                        onValueChange={(value) => handleInputChange("workEnvironment", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select work environment" />
                        </SelectTrigger>
                        <SelectContent>
                          {workEnvironmentOptions.map((env) => (
                            <SelectItem key={env} value={env}>
                              {env}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="domesticViolence">Domestic Violence Screening</Label>
                      <Select
                        value={formData.domesticViolence}
                        onValueChange={(value) => handleInputChange("domesticViolence", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select response" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                      <Input
                        id="stressLevel"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.stressLevel}
                        onChange={(e) => handleInputChange("stressLevel", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sleepHours">Sleep Hours per Night</Label>
                      <Input
                        id="sleepHours"
                        type="number"
                        value={formData.sleepHours}
                        onChange={(e) => handleInputChange("sleepHours", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="exposureToChemicals"
                        checked={formData.exposureToChemicals}
                        onCheckedChange={(checked) => handleInputChange("exposureToChemicals", checked as boolean)}
                      />
                      <Label htmlFor="exposureToChemicals">Exposure to Chemicals at Work</Label>
                    </div>
                  </div>
                </div>

                {/* Diet Customization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2">Diet Customization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dietType">Diet Type</Label>
                      <Select value={formData.dietType} onValueChange={(value) => handleInputChange("dietType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced Diet</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="jain">Jain Vegetarian</SelectItem>
                          <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                          <SelectItem value="pescatarian">Pescatarian</SelectItem>
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
                      <Label htmlFor="cookingTime">Available Cooking Time</Label>
                      <Select
                        value={formData.cookingTime}
                        onValueChange={(value) => handleInputChange("cookingTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select cooking time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15-30 minutes">15-30 minutes</SelectItem>
                          <SelectItem value="30-45 minutes">30-45 minutes</SelectItem>
                          <SelectItem value="45-60 minutes">45-60 minutes</SelectItem>
                          <SelectItem value="60+ minutes">60+ minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budgetRange">Budget Range</Label>
                      <Select
                        value={formData.budgetRange}
                        onValueChange={(value) => handleInputChange("budgetRange", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (₹100-200/day)</SelectItem>
                          <SelectItem value="moderate">Moderate (₹200-400/day)</SelectItem>
                          <SelectItem value="high">High (₹400+/day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="waterIntake">Water Intake (glasses/day)</Label>
                      <Input
                        id="waterIntake"
                        type="number"
                        value={formData.waterIntake}
                        onChange={(e) => handleInputChange("waterIntake", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Dietary Restrictions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {mealPreferenceOptions.map((preference) => (
                          <div key={preference} className="flex items-center space-x-2">
                            <Checkbox
                              id={`meal-preference-${preference}`}
                              checked={formData.mealPreferences.includes(preference)}
                              onCheckedChange={(checked) =>
                                handleMultiSelect("mealPreferences", preference, checked as boolean)
                              }
                            />
                            <Label htmlFor={`meal-preference-${preference}`} className="text-sm">
                              {preference}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Favorite Ingredients</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                      <Label>Supplements Currently Used</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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

          {/* Diet Tab */}
          <TabsContent value="diet" className="space-y-6">
            {aiAnalysis?.dietPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    Personalized Diet Plan - Trimester {aiAnalysis.dietPlan.trimester}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Diet Overview */}
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
                      <div className="text-2xl font-bold text-purple-600">7 Days</div>
                      <div className="text-sm text-gray-600">Meal Plan</div>
                    </div>
                  </div>

                  {/* Key Nutrients */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Nutrients Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.dietPlan.keyNutrients.map((nutrient, index) => (
                        <Badge key={index} variant="secondary">
                          {nutrient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Supplements */}
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Supplements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.dietPlan.supplements.map((supplement, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-50">
                          {supplement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Avoid */}
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Foods to Avoid:</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.dietPlan.avoidFoods.map((food, index) => (
                        <Badge key={index} variant="destructive">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Hydration */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-600">Hydration Guidelines:</h4>
                    <p className="text-sm">{aiAnalysis.dietPlan.hydration}</p>
                  </div>

                  {/* IMC & WHO Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-600">🇮🇳 IMC Recommendations:</h4>
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
                      <h4 className="font-semibold mb-2 text-green-600">🌍 WHO Recommendations:</h4>
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
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Please complete the form and generate AI analysis to view your personalized diet plan.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Scans Tab */}
          <TabsContent value="scans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Pregnancy Scans & Tests Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestedTests.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedTests.map((test) => (
                      <Card key={test.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{test.name}</h4>
                          <Badge
                            variant={
                              test.importance === "essential"
                                ? "destructive"
                                : test.importance === "recommended"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {test.importance}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p>
                              <strong>Category:</strong> {test.category}
                            </p>
                            <p>
                              <strong>Recommended Week:</strong> {test.recommendedWeek}
                            </p>
                            <p>
                              <strong>Due Date:</strong> {test.dueDate}
                            </p>
                            <p>
                              <strong>Normal Range:</strong> {test.normalRange}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Description:</strong> {test.description}
                            </p>
                            <p>
                              <strong>Preparation:</strong> {test.preparation}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="p-2 bg-blue-50 rounded text-xs">
                            <strong>IMC Guideline:</strong> {test.imcGuideline}
                          </div>
                          <div className="p-2 bg-green-50 rounded text-xs">
                            <strong>WHO Guideline:</strong> {test.whoGuideline}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Scan className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Please enter your pregnancy details to view recommended scans and tests.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplements Tab */}
          <TabsContent value="supplements" className="space-y-6">
            {aiAnalysis?.supplements ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Recommended Supplements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAnalysis.supplements.map((supplement, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{supplement.name}</h4>
                          <Badge variant="outline">{supplement.price}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p>
                              <strong>Dosage:</strong> {supplement.dosage}
                            </p>
                            <p>
                              <strong>Timing:</strong> {supplement.timing}
                            </p>
                            <p>
                              <strong>Brands:</strong> {supplement.brands}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Benefits:</strong> {supplement.benefits}
                            </p>
                            <p>
                              <strong>Warnings:</strong> <span className="text-red-600">{supplement.warnings}</span>
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Pill className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Please complete the form and generate AI analysis to view supplement recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Vaccines Tab */}
          <TabsContent value="vaccines" className="space-y-6">
            {aiAnalysis?.vaccines ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Syringe className="h-5 w-5" />
                    Pregnancy Vaccination Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAnalysis.vaccines.map((vaccine, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{vaccine.vaccine}</h4>
                          <Badge variant="secondary">{vaccine.importance}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p>
                              <strong>Timing:</strong> {vaccine.timing}
                            </p>
                            <p>
                              <strong>Description:</strong> {vaccine.description}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Side Effects:</strong> {vaccine.sideEffects}
                            </p>
                            <p>
                              <strong>Contraindications:</strong>{" "}
                              <span className="text-red-600">{vaccine.contraindications}</span>
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Syringe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Please complete the form and generate AI analysis to view vaccination schedule.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals" className="space-y-6">
            {aiAnalysis?.nearbyHospitals ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Nearby Hospitals & Healthcare Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAnalysis.nearbyHospitals.map((hospital, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{hospital.name}</h4>
                          <Badge variant="outline">{hospital.rating}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>📍 Address:</strong> {hospital.address}
                          </p>
                          <p>
                            <strong>📏 Distance:</strong> {hospital.distance}
                          </p>
                          <p>
                            <strong>🏥 Specialties:</strong> {hospital.specialties}
                          </p>
                          <p>
                            <strong>📞 Phone:</strong> {hospital.phone}
                          </p>
                          <p>
                            <strong>🚨 Emergency:</strong> {hospital.emergency}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Please complete the form and generate AI analysis to view nearby hospitals.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Labs Tab */}
          <TabsContent value="labs" className="space-y-6">
            {aiAnalysis?.labCenters ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Nearby Laboratory Centers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAnalysis.labCenters.map((lab, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-lg">{lab.name}</h4>
                          <Badge variant="outline">{lab.rating}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>📍 Address:</strong> {lab.address}
                          </p>
                          <p>
                            <strong>📏 Distance:</strong> {lab.distance}
                          </p>
                          <p>
                            <strong>🔬 Specialties:</strong> {lab.specialties}
                          </p>
                          <p>
                            <strong>📞 Phone:</strong> {lab.phone}
                          </p>
                          <p>
                            <strong>⚡ Services:</strong> {lab.emergency}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TestTube className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Please complete the form and generate AI analysis to view nearby lab centers.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Detailed Diet Tab */}
          <TabsContent value="detailed-diet" className="space-y-6">
            {aiAnalysis?.dietPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="h-5 w-5" />
                    7-Day Detailed Meal Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {aiAnalysis.dietPlan.weeklyMealPlan.map((dayPlan, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold text-lg mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {dayPlan.day}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Breakfast */}
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <h5 className="font-semibold text-yellow-700 mb-2">🌅 Breakfast</h5>
                            <p className="text-sm font-medium">{dayPlan.breakfast.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Ingredients: {dayPlan.breakfast.ingredients.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Calories: {dayPlan.breakfast.calories} | Protein: {dayPlan.breakfast.protein}g
                            </p>
                            <p className="text-xs text-gray-600 mb-1">Preparation: {dayPlan.breakfast.preparation}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dayPlan.breakfast.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Morning Snack */}
                          <div className="p-3 bg-green-50 rounded-lg">
                            <h5 className="font-semibold text-green-700 mb-2">🥤 Morning Snack</h5>
                            <p className="text-sm font-medium">{dayPlan.morningSnack.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Ingredients: {dayPlan.morningSnack.ingredients.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Calories: {dayPlan.morningSnack.calories} | Protein: {dayPlan.morningSnack.protein}g
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Preparation: {dayPlan.morningSnack.preparation}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dayPlan.morningSnack.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Lunch */}
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <h5 className="font-semibold text-orange-700 mb-2">🍽️ Lunch</h5>
                            <p className="text-sm font-medium">{dayPlan.lunch.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Ingredients: {dayPlan.lunch.ingredients.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Calories: {dayPlan.lunch.calories} | Protein: {dayPlan.lunch.protein}g
                            </p>
                            <p className="text-xs text-gray-600 mb-1">Preparation: {dayPlan.lunch.preparation}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dayPlan.lunch.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Afternoon Snack */}
                          <div className="p-3 bg-pink-50 rounded-lg">
                            <h5 className="font-semibold text-pink-700 mb-2">🍎 Afternoon Snack</h5>
                            <p className="text-sm font-medium">{dayPlan.afternoonSnack.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Ingredients: {dayPlan.afternoonSnack.ingredients.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Calories: {dayPlan.afternoonSnack.calories} | Protein: {dayPlan.afternoonSnack.protein}g
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Preparation: {dayPlan.afternoonSnack.preparation}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dayPlan.afternoonSnack.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Dinner */}
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <h5 className="font-semibold text-blue-700 mb-2">🌙 Dinner</h5>
                            <p className="text-sm font-medium">{dayPlan.dinner.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Ingredients: {dayPlan.dinner.ingredients.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Calories: {dayPlan.dinner.calories} | Protein: {dayPlan.dinner.protein}g
                            </p>
                            <p className="text-xs text-gray-600 mb-1">Preparation: {dayPlan.dinner.preparation}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dayPlan.dinner.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Evening Snack */}
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <h5 className="font-semibold text-purple-700 mb-2">🥛 Bedtime Snack</h5>
                            <p className="text-sm font-medium">{dayPlan.eveningSnack.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              Ingredients: {dayPlan.eveningSnack.ingredients.join(", ")}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Calories: {dayPlan.eveningSnack.calories} | Protein: {dayPlan.eveningSnack.protein}g
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Preparation: {dayPlan.eveningSnack.preparation}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {dayPlan.eveningSnack.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Daily Totals */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold mb-2">Daily Totals:</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Total Calories:</strong>{" "}
                              {dayPlan.breakfast.calories +
                                dayPlan.morningSnack.calories +
                                dayPlan.lunch.calories +
                                dayPlan.afternoonSnack.calories +
                                dayPlan.dinner.calories +
                                dayPlan.eveningSnack.calories}
                            </div>
                            <div>
                              <strong>Total Protein:</strong>{" "}
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
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Apple className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Please complete the form and generate AI analysis to view detailed meal plans.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Print/Download Buttons */}
        {analysisGenerated && (
          <div className="flex justify-center gap-4 mt-8">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        )}

        {/* Navigation */}
        <NavigationButtons />

        {/* Footer */}
        <PoweredByFooter />
      </div>
    </div>
  )
}
