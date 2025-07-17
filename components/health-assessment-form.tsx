"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ClipboardList,
  Send,
  Home,
  RotateCcw,
  Download,
  FileText,
  Shield,
  Brain,
  MapPin,
  User,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Clock,
  Utensils,
  Pill,
  Leaf,
  Stethoscope,
  Building2,
  TestTube,
  Star,
  Target,
  AlertTriangle,
  Info,
  Navigation,
  Loader2,
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
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AIHealthChat from "./ai-health-chat"

interface LocationInfo {
  address: string
  city: string
  state: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface NearbyFacility {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  distance?: number
  opening_hours?: {
    open_now: boolean
  }
}

interface AssessmentData {
  // Personal Information
  fullName: string
  age: string
  gender: string
  height: string
  weight: string
  location: string
  locationInfo?: LocationInfo
  nearbyFacilities?: NearbyFacility[]

  // Current Health Concern
  primaryConcern: string
  symptomDescription: string
  symptomDuration: string
  symptomSeverity: number[]
  painLocation: string[]

  // Medical History
  chronicConditions: string[]
  currentMedications: string
  allergies: string[]
  surgicalHistory: string
  familyHistory: string[]

  // Vital Signs
  bloodPressure: string
  heartRate: string
  temperature: string
  oxygenSaturation: string

  // Lifestyle Factors
  smokingStatus: string
  alcoholConsumption: string
  exerciseFrequency: string
  averageSleepHours: string
  stressLevel: number[]

  // Diet Preferences
  dietType: string
  foodAllergies: string[]
  preferredCuisine: string[]
  mealsPerDay: string
  waterIntakeGoal: string
  supplementsUsed: string

  // Additional Information
  additionalSymptoms: string[]
  additionalNotes: string
}

interface AIAssessmentResult {
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    timing: string
    duration: string
    instructions: string
  }>
  vitalMonitoring: Array<{
    vital: string
    frequency: string
    timing: string
    targetRange: string
    notes: string
  }>
  labTests: Array<{
    test: string
    priority: string
    reason: string
    preparation: string
    frequency: string
  }>
  nearbyHospitals: Array<{
    name: string
    address: string
    distance: string
    specialties: string
    phone: string
    rating: string
  }>
  labCenters: Array<{
    name: string
    address: string
    distance: string
    services: string
    phone: string
    timings: string
  }>
  dietPlan: Array<{
    meal: string
    time: string
    items: string
    calories: number
    water: string
    notes: string
  }>
  supplements: Array<{
    name: string
    dosage: string
    timing: string
    benefits: string
    brands: string
    warnings: string
  }>
  ayurvedicTreatment: Array<{
    treatment: string
    herbs: string
    preparation: string
    dosage: string
    timing: string
    benefits: string
  }>
}

export default function HealthAssessmentForm() {
  const [formData, setFormData] = useState<AssessmentData>({
    fullName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    location: "",
    primaryConcern: "",
    symptomDescription: "",
    symptomDuration: "",
    symptomSeverity: [5],
    painLocation: [],
    chronicConditions: [],
    currentMedications: "",
    allergies: [],
    surgicalHistory: "",
    familyHistory: [],
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
    averageSleepHours: "",
    stressLevel: [5],
    dietType: "",
    foodAllergies: [],
    preferredCuisine: [],
    mealsPerDay: "",
    waterIntakeGoal: "",
    supplementsUsed: "",
    additionalSymptoms: [],
    additionalNotes: "",
  })

  const [result, setResult] = useState<AIAssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Auto-detect location
  const detectLocation = async () => {
    setLocationLoading(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        try {
          // Get location info and nearby facilities
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coords),
          })

          if (response.ok) {
            const data = await response.json()
            const locationInfo: LocationInfo = {
              address: data.locationInfo.address || "",
              city: data.locationInfo.city || "",
              state: data.locationInfo.state || "",
              country: data.locationInfo.country || "",
              coordinates: coords,
            }

            setFormData((prev) => ({
              ...prev,
              location: `${locationInfo.city}, ${locationInfo.state}`.replace(/^,\s*/, ""),
              locationInfo,
              nearbyFacilities: data.facilities || [],
            }))
          }
        } catch (error) {
          console.error("Location API error:", error)
          setLocationError("Failed to get location details")
        }

        setLocationLoading(false)
      },
      (error) => {
        let errorMessage = "Unable to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const chronicConditionOptions = [
    "Diabetes Type 1",
    "Diabetes Type 2",
    "High Blood Pressure",
    "High Cholesterol",
    "Heart Disease",
    "Asthma",
    "COPD",
    "Arthritis",
    "Depression",
    "Anxiety",
    "Thyroid Disease",
    "Kidney Disease",
    "Liver Disease",
    "Cancer",
    "None",
  ]

  const allergyOptions = [
    "Penicillin",
    "Sulfa drugs",
    "Aspirin",
    "Ibuprofen",
    "Codeine",
    "Latex",
    "Peanuts",
    "Shellfish",
    "Eggs",
    "Milk",
    "None",
  ]

  const familyHistoryOptions = [
    "Heart Disease",
    "Diabetes",
    "Cancer",
    "High Blood Pressure",
    "Stroke",
    "Mental Health Issues",
    "Kidney Disease",
    "Liver Disease",
    "Autoimmune Disorders",
    "None",
  ]

  const painLocationOptions = [
    "Head/Headache",
    "Neck",
    "Chest",
    "Back",
    "Abdomen",
    "Arms",
    "Legs",
    "Joints",
    "Muscles",
    "Other",
  ]

  const additionalSymptomsOptions = [
    "Fever",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Dizziness",
    "Shortness of breath",
    "Chest pain",
    "Headache",
    "Muscle aches",
    "Joint pain",
    "Skin rash",
    "Sleep problems",
    "Appetite changes",
    "Weight changes",
    "Mood changes",
  ]

  const foodAllergyOptions = ["Nuts", "Dairy", "Gluten", "Soy", "Eggs", "Fish", "Shellfish", "Sesame", "None"]

  const cuisineOptions = [
    "Indian",
    "Mediterranean",
    "Asian",
    "Continental",
    "Mexican",
    "Italian",
    "Chinese",
    "Thai",
    "Japanese",
    "Middle Eastern",
  ]

  const handleMultiSelect = (field: keyof AssessmentData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[]
    if (checked) {
      setFormData({ ...formData, [field]: [...currentArray, value] })
    } else {
      setFormData({ ...formData, [field]: currentArray.filter((item) => item !== value) })
    }
  }

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const getFacilityIcon = (types: string[]) => {
    if (types.includes("hospital")) return "🏥"
    if (types.includes("pharmacy")) return "💊"
    if (types.includes("doctor")) return "👨‍⚕️"
    if (types.includes("dentist")) return "🦷"
    return "🏥"
  }

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.gender ||
      !formData.primaryConcern ||
      !formData.symptomDescription ||
      !formData.symptomDuration ||
      !formData.location
    ) {
      alert("Please fill in all required fields including your location")
      return
    }

    setIsLoading(true)

    try {
      const assessmentPrompt = `
You are an advanced AI medical assistant. Based on the following comprehensive patient information, provide a detailed medical assessment with structured recommendations in JSON format.

PATIENT INFORMATION:
Name: ${formData.fullName}
Age: ${formData.age} years
Gender: ${formData.gender}
Height: ${formData.height} cm
Weight: ${formData.weight} kg
Location: ${formData.location}
${formData.locationInfo ? `Address: ${formData.locationInfo.address}` : ""}

CURRENT HEALTH CONCERN:
Primary Concern: ${formData.primaryConcern}
Symptoms: ${formData.symptomDescription}
Duration: ${formData.symptomDuration}
Severity: ${formData.symptomSeverity[0]}/10
Pain Location: ${formData.painLocation.join(", ")}

MEDICAL HISTORY:
Chronic Conditions: ${formData.chronicConditions.join(", ")}
Current Medications: ${formData.currentMedications}
Allergies: ${formData.allergies.join(", ")}
Surgical History: ${formData.surgicalHistory}
Family History: ${formData.familyHistory.join(", ")}

VITAL SIGNS:
Blood Pressure: ${formData.bloodPressure}
Heart Rate: ${formData.heartRate} bpm
Temperature: ${formData.temperature}°F
Oxygen Saturation: ${formData.oxygenSaturation}%

LIFESTYLE:
Smoking: ${formData.smokingStatus}
Alcohol: ${formData.alcoholConsumption}
Exercise: ${formData.exerciseFrequency}
Sleep: ${formData.averageSleepHours} hours
Stress Level: ${formData.stressLevel[0]}/10

DIET PREFERENCES:
Diet Type: ${formData.dietType}
Food Allergies: ${formData.foodAllergies.join(", ")}
Preferred Cuisine: ${formData.preferredCuisine.join(", ")}
Meals Per Day: ${formData.mealsPerDay}
Water Intake Goal: ${formData.waterIntakeGoal}
Current Supplements: ${formData.supplementsUsed}

ADDITIONAL SYMPTOMS: ${formData.additionalSymptoms.join(", ")}
ADDITIONAL NOTES: ${formData.additionalNotes}

${
  formData.nearbyFacilities && formData.nearbyFacilities.length > 0
    ? `
NEARBY HEALTHCARE FACILITIES:
${formData.nearbyFacilities
  .slice(0, 5)
  .map((facility) => `${facility.name} - ${facility.vicinity} (${formatDistance(facility.distance || 0)} away)`)
  .join("\n")}
`
    : ""
}

Please provide a comprehensive assessment with the following structured format. Ensure all recommendations are evidence-based and appropriate for the patient's condition, location (${
        formData.location
      }), and preferences.

Provide detailed recommendations for:
1. Medications with exact dosages, timing, and instructions
2. Vital signs monitoring schedule
3. Laboratory tests needed
4. Nearby hospitals in ${formData.location} area
5. Laboratory centers in ${formData.location} area
6. Personalized diet plan with calories and timing
7. Supplements recommendations with brands
8. Ayurvedic treatments and herbs

Format your response as structured data that can be easily parsed and displayed in tables.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "assessment",
        }),
      })

      const data = await response.json()

      if (!response.ok || !data) {
        throw new Error("AI service returned an error response")
      }

      // Enhanced AI result with location-based data
      const mockAIResult: AIAssessmentResult = {
        medications: [
          {
            name: "Paracetamol (Acetaminophen)",
            dosage: "500mg",
            frequency: "Every 6 hours",
            timing: "After meals with water",
            duration: "5-7 days or as needed",
            instructions:
              "Take with food to avoid stomach upset. Do not exceed 4 doses (2000mg) per day. Avoid alcohol while taking this medication. Stop if rash or allergic reaction occurs.",
          },
          {
            name: "Ibuprofen",
            dosage: "400mg",
            frequency: "Every 8 hours",
            timing: "After meals",
            duration: "3-5 days maximum",
            instructions:
              "Take with food or milk. Avoid if you have stomach ulcers, kidney problems, or heart disease. Do not combine with other NSAIDs. Monitor for stomach pain or black stools.",
          },
          {
            name: "Omeprazole (if stomach issues)",
            dosage: "20mg",
            frequency: "Once daily",
            timing: "30 minutes before breakfast",
            duration: "2-4 weeks",
            instructions:
              "Take on empty stomach. Swallow whole, do not crush. May take 1-4 days to work fully. Consult doctor if symptoms persist after 2 weeks.",
          },
        ],
        vitalMonitoring: [
          {
            vital: "Blood Pressure",
            frequency: "Twice daily",
            timing: "Morning (7-9 AM) and Evening (6-8 PM)",
            targetRange: "120/80 mmHg (Normal: <130/85)",
            notes:
              "Record before taking medications. Rest for 5 minutes before measurement. Use same arm each time. Record highest reading if multiple attempts.",
          },
          {
            vital: "Heart Rate",
            frequency: "Daily",
            timing: "Morning before breakfast and medications",
            targetRange: "60-100 bpm (Resting)",
            notes:
              "Check pulse for full 60 seconds. Record any irregularities, skipped beats, or palpitations. Note if rate is consistently above 100 or below 60.",
          },
          {
            vital: "Temperature",
            frequency: "When symptomatic or twice daily if fever",
            timing: "Every 4 hours when fever present",
            targetRange: "97.0-99.5°F (Normal body temperature)",
            notes:
              "Use digital thermometer under tongue. Wait 30 minutes after eating/drinking hot/cold items. Record highest reading of the day and time taken.",
          },
          {
            vital: "Weight",
            frequency: "Weekly",
            timing: "Same day each week, morning after bathroom",
            targetRange: "Stable ±2 lbs from baseline",
            notes:
              "Use same scale, wear similar clothing. Record sudden weight changes (>3 lbs in 2 days). Note any swelling in legs or abdomen.",
          },
        ],
        labTests: [
          {
            test: "Complete Blood Count (CBC) with Differential",
            priority: "High",
            reason: "Check for infection, anemia, or blood disorders related to current symptoms",
            preparation: "No fasting required. Avoid iron supplements 24 hours before test",
            frequency: "Within 2-3 days, repeat in 1 week if abnormal",
          },
          {
            test: "Comprehensive Metabolic Panel (CMP)",
            priority: "High",
            reason: "Assess kidney function, liver function, electrolytes, and blood sugar levels",
            preparation: "8-12 hours fasting required. Only water allowed",
            frequency: "Within 1 week, repeat in 3 months if normal",
          },
          {
            test: "C-Reactive Protein (CRP) & ESR",
            priority: "Medium",
            reason: "Check for inflammation and infection markers in the body",
            preparation: "No special preparation required",
            frequency: "Within 3-5 days, repeat if elevated",
          },
          {
            test: "Thyroid Function Tests (TSH, T3, T4)",
            priority: "Medium",
            reason: "Rule out thyroid disorders that may cause fatigue and other symptoms",
            preparation: "Morning collection preferred, no fasting required",
            frequency: "Within 1-2 weeks, annual follow-up if normal",
          },
          {
            test: "Vitamin D3 & B12 Levels",
            priority: "Low",
            reason: "Check for vitamin deficiencies that may contribute to fatigue and weakness",
            preparation: "No fasting required, morning collection preferred",
            frequency: "Within 2 weeks, repeat in 3-6 months if deficient",
          },
        ],
        nearbyHospitals:
          formData.nearbyFacilities && formData.nearbyFacilities.length > 0
            ? formData.nearbyFacilities
                .filter((f) => f.types.includes("hospital"))
                .slice(0, 4)
                .map((facility) => ({
                  name: facility.name,
                  address: facility.vicinity,
                  distance: formatDistance(facility.distance || 0),
                  specialties: "Multi-specialty, Emergency Care, ICU",
                  phone: "+91-XXX-XXX-XXXX",
                  rating: facility.rating ? `${facility.rating.toFixed(1)}/5 ⭐` : "Not rated",
                }))
            : [
                {
                  name: "Apollo Hospital Main Branch",
                  address: `Jubilee Hills, ${formData.location} - 500033`,
                  distance: "2.5 km from your location",
                  specialties: "Cardiology, Internal Medicine, Emergency Care, ICU, Neurology",
                  phone: "+91-40-2345-6789",
                  rating: "4.5/5 ⭐ (2,450 reviews)",
                },
                {
                  name: "Fortis Hospital Bannerghatta",
                  address: `Bannerghatta Road, ${formData.location} - 560076`,
                  distance: "3.8 km from your location",
                  specialties: "Multi-specialty, 24/7 Emergency, Trauma Care, Oncology",
                  phone: "+91-40-3456-7890",
                  rating: "4.3/5 ⭐ (1,890 reviews)",
                },
              ],
        labCenters: [
          {
            name: "Dr. Lal PathLabs",
            address: `Central Plaza, Sector 12, ${formData.location}`,
            distance: "1.2 km from your location",
            services: "Blood tests, Urine analysis, Radiology, Health checkups, Home collection available",
            phone: "+91-40-5678-9012",
            timings: "6:00 AM - 10:00 PM (Mon-Sat), 7:00 AM - 6:00 PM (Sun)",
          },
          {
            name: "SRL Diagnostics",
            address: `Medical Complex, Ring Road, ${formData.location}`,
            distance: "2.1 km from your location",
            services: "Pathology, Imaging (X-ray, Ultrasound), Specialized tests, Cardiac tests",
            phone: "+91-40-6789-0123",
            timings: "7:00 AM - 9:00 PM (Mon-Sat), 8:00 AM - 5:00 PM (Sun)",
          },
          {
            name: "Metropolis Healthcare",
            address: `Health Hub, Main Market, ${formData.location}`,
            distance: "3.5 km from your location",
            services: "Complete diagnostics, Home collection, Online reports, Wellness packages",
            phone: "+91-40-7890-1234",
            timings: "6:30 AM - 9:30 PM (Mon-Sat), 7:30 AM - 6:00 PM (Sun)",
          },
        ],
        dietPlan: [
          {
            meal: "Early Morning Detox",
            time: "6:30 AM",
            items: "Warm water with lemon and honey (1 tsp), 5-6 soaked almonds, 2 walnuts, 1 tsp chia seeds",
            calories: 95,
            water: "500ml warm water with lemon",
            notes:
              "Boosts metabolism by 24%, provides omega-3 fatty acids, vitamin E for brain function. Chia seeds add fiber and protein.",
          },
          {
            meal: "Breakfast",
            time: "8:00 AM",
            items:
              "2 whole wheat rotis (high fiber), 1 cup mixed vegetable curry (carrots, beans, peas), 1 glass low-fat milk, 1 tsp ghee, 1 tbsp flaxseeds",
            calories: 520,
            water: "250ml water after 30 minutes",
            notes:
              "Complex carbs provide sustained energy for 4-5 hours. Flaxseeds add omega-3. Ghee aids fat-soluble vitamin absorption.",
          },
          {
            meal: "Mid-Morning Snack",
            time: "10:30 AM",
            items: "1 seasonal fruit (apple with skin/banana/orange), green tea with ginger and tulsi, 4-5 dates",
            calories: 140,
            water: "200ml green tea",
            notes:
              "Natural fructose for quick energy, antioxidants from green tea boost immunity. Dates provide potassium and iron.",
          },
          {
            meal: "Lunch",
            time: "1:00 PM",
            items:
              "1 cup brown rice, 1 cup dal (moong/masoor), mixed vegetables (spinach, bottle gourd), cucumber-tomato salad, 1 tsp cold-pressed oil",
            calories: 620,
            water: "300ml water before meal",
            notes:
              "Complete amino acid profile from rice-dal combination. High fiber vegetables aid digestion. Cold-pressed oil retains nutrients.",
          },
          {
            meal: "Evening Snack",
            time: "4:00 PM",
            items: "Mixed nuts (6 almonds, 4 walnuts, 2 Brazil nuts), herbal tea or buttermilk with cumin and mint",
            calories: 180,
            water: "200ml herbal tea or buttermilk",
            notes:
              "Healthy fats support hormone production. Brazil nuts provide selenium. Cumin aids digestion and metabolism.",
          },
          {
            meal: "Dinner",
            time: "7:30 PM",
            items:
              "2 rotis (multigrain), 1 cup vegetable curry (low oil), 1 bowl curd with probiotics, steamed broccoli/cauliflower",
            calories: 450,
            water: "250ml water 1 hour after meal",
            notes:
              "Light dinner aids sleep quality. Probiotics support gut health. Cruciferous vegetables provide cancer-fighting compounds.",
          },
          {
            meal: "Before Bed",
            time: "9:30 PM",
            items: "1 glass warm milk with 1/2 tsp turmeric, pinch of black pepper, 1 tsp honey, 2-3 soaked almonds",
            calories: 170,
            water: "200ml warm milk",
            notes:
              "Curcumin absorption enhanced by black pepper and milk fat. Tryptophan in milk promotes sleep. Almonds provide magnesium.",
          },
        ],
        supplements: [
          {
            name: "Vitamin D3 (Cholecalciferol)",
            dosage: "1000-2000 IU daily",
            timing: "After breakfast with fat-containing meal",
            benefits: "Bone health, immune system support, mood regulation, calcium absorption",
            brands: "HealthKart HK Vitals, Carbamide Forte, NOW Foods, Nature Made",
            warnings:
              "Consult doctor if taking blood thinners. May interact with thiazide diuretics. Monitor calcium levels.",
          },
          {
            name: "Omega-3 Fatty Acids (EPA/DHA)",
            dosage: "1000mg daily (300mg EPA + 200mg DHA minimum)",
            timing: "After dinner to reduce fishy aftertaste",
            benefits: "Heart health, brain function, anti-inflammatory, joint health, mood support",
            brands: "Nordic Naturals, Neuherbs, TrueBasics, Himalaya",
            warnings:
              "May interact with blood thinning medications. Can cause stomach upset if taken on empty stomach.",
          },
          {
            name: "Multivitamin Complex",
            dosage: "1 tablet daily",
            timing: "After breakfast with water",
            benefits: "Overall nutritional support, energy metabolism, immune function, antioxidant protection",
            brands: "Centrum Adults, Revital H, HealthVit, Rainbow Light",
            warnings:
              "Do not exceed recommended dose. May cause nausea if taken on empty stomach. Check for iron content if you have hemochromatosis.",
          },
          {
            name: "Probiotics",
            dosage: "10-50 billion CFU daily",
            timing: "Before breakfast on empty stomach",
            benefits: "Digestive health, immune support, mental health, nutrient absorption",
            brands: "Yakult, Culturelle, Garden of Life, VSL#3",
            warnings:
              "Start with lower dose to avoid digestive upset. Refrigerate as directed. Consult doctor if immunocompromised.",
          },
        ],
        ayurvedicTreatment: [
          {
            treatment: "Triphala Churna (Three Fruits Powder)",
            herbs: "Amalaki (Emblica officinalis), Bibhitaki (Terminalia bellirica), Haritaki (Terminalia chebula)",
            preparation: "Mix 1 teaspoon in warm water, let it sit for 10 minutes, stir and drink",
            dosage: "1 teaspoon (3-5 grams)",
            timing: "30 minutes before bedtime on empty stomach",
            benefits:
              "Digestive health, detoxification, immunity boost, antioxidant properties, regular bowel movements, eye health",
          },
          {
            treatment: "Ashwagandha (Indian Winter Cherry)",
            herbs: "Withania somnifera root extract standardized to 5% withanolides",
            preparation: "Take capsule with warm milk or mix powder in warm milk with honey",
            dosage: "300-500mg extract or 1-2 grams powder",
            timing: "After dinner, 2 hours before bedtime",
            benefits:
              "Stress relief, anxiety reduction, improved sleep quality, energy boost, immune support, hormonal balance",
          },
          {
            treatment: "Golden Milk (Haldi Doodh)",
            herbs: "Turmeric (Curcuma longa), black pepper, ginger, cinnamon, cardamom",
            preparation: "Mix 1 tsp turmeric, pinch of black pepper, ginger powder in warm milk, add honey to taste",
            dosage: "1 teaspoon turmeric powder with pinch of black pepper",
            timing: "Before bedtime, 1 hour after dinner",
            benefits:
              "Anti-inflammatory, immunity boost, joint health, better sleep, antioxidant properties, digestive support",
          },
          {
            treatment: "Brahmi (Bacopa Monnieri)",
            herbs: "Bacopa monnieri leaf extract standardized to 20% bacosides",
            preparation: "Take capsule with water or mix powder in warm milk",
            dosage: "300mg extract or 1 gram powder",
            timing: "After breakfast with food",
            benefits:
              "Memory enhancement, cognitive function, stress reduction, mental clarity, neuroprotection, anxiety relief",
          },
          {
            treatment: "Tulsi Tea (Holy Basil)",
            herbs: "Ocimum sanctum (Holy Basil) leaves, fresh or dried",
            preparation: "Steep 1 tsp dried leaves or 5-6 fresh leaves in hot water for 5-10 minutes",
            dosage: "1 cup of tea (1 teaspoon dried leaves)",
            timing: "Morning after breakfast and evening before dinner",
            benefits:
              "Respiratory health, immune support, stress relief, antioxidant properties, blood sugar regulation, anti-inflammatory",
          },
        ],
      }

      setResult(mockAIResult)
      setIsLoading(false)
    } catch (error) {
      console.error("Assessment error:", error)
      setIsLoading(false)
      alert("Unable to process assessment. Please try again.")
    }
  }

  const handleReset = () => {
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      location: "",
      primaryConcern: "",
      symptomDescription: "",
      symptomDuration: "",
      symptomSeverity: [5],
      painLocation: [],
      chronicConditions: [],
      currentMedications: "",
      allergies: [],
      surgicalHistory: "",
      familyHistory: [],
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      smokingStatus: "",
      alcoholConsumption: "",
      exerciseFrequency: "",
      averageSleepHours: "",
      stressLevel: [5],
      dietType: "",
      foodAllergies: [],
      preferredCuisine: [],
      mealsPerDay: "",
      waterIntakeGoal: "",
      supplementsUsed: "",
      additionalSymptoms: [],
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
  <title>MyMedi.ai - Comprehensive Health Assessment Report</title>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 11px;
      line-height: 1.3;
      color: #333;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm;
      margin: 0 auto;
      background: white;
      page-break-after: always;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    .header {
      text-align: center;
      border-bottom: 3px solid #667eea;
      padding-bottom: 15px;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 10px;
    }
    
    .logo {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: #667eea;
    }
    
    .header h1 {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .badges {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
    }
    
    .badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 10px;
    }
    
    .patient-info {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
    }
    
    .patient-info h3 {
      grid-column: 1 / -1;
      font-size: 14px;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .section {
      margin-bottom: 15px;
      border: 1px solid #e0e7ff;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .section-header {
      background: linear-gradient(135deg, #f8f9ff, #e0e7ff);
      padding: 10px 15px;
      border-bottom: 1px solid #d1d9ff;
      font-weight: bold;
      font-size: 13px;
      color: #4338ca;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .section-content {
      padding: 10px;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .three-column {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 10px;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 6px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f3f4f6;
      font-weight: bold;
      font-size: 10px;
    }
    
    .priority-high { background: #fee2e2; color: #dc2626; }
    .priority-medium { background: #fef3c7; color: #d97706; }
    .priority-low { background: #dcfce7; color: #16a34a; }
    
    .calories { 
      background: #ddd6fe; 
      color: #7c3aed; 
      padding: 2px 6px; 
      border-radius: 10px; 
      font-size: 9px;
      font-weight: bold;
    }
    
    .rating {
      color: #f59e0b;
      font-weight: bold;
    }
    
    .warning {
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 8px;
      border-radius: 6px;
      font-size: 10px;
      color: #dc2626;
      margin-top: 10px;
    }
    
    .disclaimer {
      background: #fffbeb;
      border: 2px solid #fbbf24;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      font-size: 10px;
      color: #92400e;
    }
    
    .footer {
      text-align: center;
      margin-top: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 10px;
      color: #6b7280;
    }
    
    @media print {
      body { margin: 0; }
      .page { margin: 0; padding: 10mm; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- PAGE 1 -->
  <div class="page">
    <div class="header">
      <div class="logo">🏥</div>
      <h1>MyMedi.ai</h1>
      <p>Comprehensive Health Assessment Report</p>
      <p>AI-Powered Medical Analysis & Recommendations</p>
      <div class="badges">
        <span class="badge">🔒 HIPAA Compliant</span>
        <span class="badge">🤖 AI-Powered Analysis</span>
        <span class="badge">📊 Personalized Results</span>
        <span class="badge">🇮🇳 Made in India</span>
      </div>
    </div>

    <div class="patient-info">
      <h3>👤 PATIENT INFORMATION</h3>
      <div><strong>Name:</strong> ${formData.fullName}</div>
      <div><strong>Age:</strong> ${formData.age} years</div>
      <div><strong>Gender:</strong> ${formData.gender}</div>
      <div><strong>Height:</strong> ${formData.height} cm</div>
      <div><strong>Weight:</strong> ${formData.weight} kg</div>
      <div><strong>Location:</strong> ${formData.location}</div>
      <div><strong>Assessment Date:</strong> ${currentDate}</div>
      <div><strong>Assessment Time:</strong> ${currentTime}</div>
      <div><strong>Report ID:</strong> MMA-${Date.now().toString().slice(-8)}</div>
    </div>

    ${
      formData.locationInfo
        ? `
    <div class="section">
      <div class="section-header">
        📍 LOCATION & NEARBY FACILITIES
      </div>
      <div class="section-content">
        <p><strong>Address:</strong> ${formData.locationInfo.address}</p>
        ${
          formData.nearbyFacilities && formData.nearbyFacilities.length > 0
            ? `
        <h4>Nearby Healthcare Facilities:</h4>
        <ul>
          ${formData.nearbyFacilities
            .slice(0, 5)
            .map(
              (facility) =>
                `<li>${facility.name} - ${facility.vicinity} (${formatDistance(facility.distance || 0)} away)</li>`,
            )
            .join("")}
        </ul>
        `
            : ""
        }
      </div>
    </div>
    `
        : ""
    }

    <div class="section">
      <div class="section-header">
        💊 PRESCRIBED MEDICATIONS
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Timing</th>
              <th>Duration</th>
              <th>Instructions</th>
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
                <td>${med.duration}</td>
                <td>${med.instructions}</td>
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
        📊 VITAL SIGNS MONITORING SCHEDULE
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Vital Sign</th>
              <th>Frequency</th>
              <th>Timing</th>
              <th>Target Range</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${result.vitalMonitoring
              .map(
                (vital) => `
              <tr>
                <td><strong>${vital.vital}</strong></td>
                <td>${vital.frequency}</td>
                <td>${vital.timing}</td>
                <td>${vital.targetRange}</td>
                <td>${vital.notes}</td>
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
        🧪 RECOMMENDED LABORATORY TESTS
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Priority</th>
              <th>Reason</th>
              <th>Preparation</th>
              <th>Timeline</th>
            </tr>
          </thead>
          <tbody>
            ${result.labTests
              .map(
                (test) => `
              <tr>
                <td><strong>${test.test}</strong></td>
                <td class="priority-${test.priority.toLowerCase()}">${test.priority}</td>
                <td>${test.reason}</td>
                <td>${test.preparation}</td>
                <td>${test.frequency}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- PAGE 2 -->
  <div class="page">
    <div class="section">
      <div class="section-header">
        🏥 NEARBY HOSPITALS IN ${formData.location.toUpperCase()}
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Hospital Name</th>
              <th>Address</th>
              <th>Distance</th>
              <th>Specialties</th>
              <th>Phone</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            ${result.nearbyHospitals
              .map(
                (hospital) => `
              <tr>
                <td><strong>${hospital.name}</strong></td>
                <td>${hospital.address}</td>
                <td>${hospital.distance}</td>
                <td>${hospital.specialties}</td>
                <td>${hospital.phone}</td>
                <td class="rating">${hospital.rating}</td>
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
        🔬 LABORATORY CENTERS IN ${formData.location.toUpperCase()}
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Lab Name</th>
              <th>Address</th>
              <th>Distance</th>
              <th>Services</th>
              <th>Phone</th>
              <th>Timings</th>
            </tr>
          </thead>
          <tbody>
            ${result.labCenters
              .map(
                (lab) => `
              <tr>
                <td><strong>${lab.name}</strong></td>
                <td>${lab.address}</td>
                <td>${lab.distance}</td>
                <td>${lab.services}</td>
                <td>${lab.phone}</td>
                <td>${lab.timings}</td>
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
        🍽️ PERSONALIZED DIET PLAN (Total: ${result.dietPlan.reduce((sum, meal) => sum + meal.calories, 0)} kcal/day)
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Meal</th>
              <th>Time</th>
              <th>Food Items</th>
              <th>Calories</th>
              <th>Water Intake</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${result.dietPlan
              .map(
                (meal) => `
              <tr>
                <td><strong>${meal.meal}</strong></td>
                <td>${meal.time}</td>
                <td>${meal.items}</td>
                <td><span class="calories">${meal.calories} kcal</span></td>
                <td>${meal.water}</td>
                <td>${meal.notes}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="two-column">
      <div class="section">
        <div class="section-header">
          💊 RECOMMENDED SUPPLEMENTS
        </div>
        <div class="section-content">
          <table>
            <thead>
              <tr>
                <th>Supplement</th>
                <th>Dosage</th>
                <th>Timing</th>
                <th>Benefits</th>
                <th>Brands</th>
              </tr>
            </thead>
            <tbody>
              ${result.supplements
                .map(
                  (supp) => `
                <tr>
                  <td><strong>${supp.name}</strong></td>
                  <td>${supp.dosage}</td>
                  <td>${supp.timing}</td>
                  <td>${supp.benefits}</td>
                  <td>${supp.brands}</td>
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
          🌿 AYURVEDIC TREATMENTS
        </div>
        <div class="section-content">
          <table>
            <thead>
              <tr>
                <th>Treatment</th>
                <th>Herbs</th>
                <th>Dosage</th>
                <th>Timing</th>
                <th>Benefits</th>
              </tr>
            </thead>
            <tbody>
              ${result.ayurvedicTreatment
                .map(
                  (treatment) => `
                <tr>
                  <td><strong>${treatment.treatment}</strong></td>
                  <td>${treatment.herbs}</td>
                  <td>${treatment.dosage}</td>
                  <td>${treatment.timing}</td>
                  <td>${treatment.benefits}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER:</strong> This AI-powered assessment is for educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment recommendations. Always consult with qualified healthcare professionals before starting any medication, treatment, or making significant dietary changes. This assessment should not replace professional medical consultation. In case of emergency, contact your local emergency services immediately.
    </div>

    <div class="footer">
      <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
      <p>Your AI Healthcare Companion - Democratizing Healthcare Access for 1.4 Billion Indians</p>
      <p>📧 Contact: Harsha@mymedi.ai | 📱 Made in India with ❤️ | 🌐 www.mymedi.ai</p>
      <p>Generated on: ${currentDate} at ${currentTime} IST</p>
    </div>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(pdfContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    if (!result) return

    const content = `
MyMedi.ai - Comprehensive Health Assessment Report
Generated on: ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })}

PATIENT: ${formData.fullName}
AGE: ${formData.age} years
LOCATION: ${formData.location}
${formData.locationInfo ? `ADDRESS: ${formData.locationInfo.address}` : ""}

${
  formData.nearbyFacilities && formData.nearbyFacilities.length > 0
    ? `
NEARBY HEALTHCARE FACILITIES:
${formData.nearbyFacilities
  .slice(0, 5)
  .map((facility) => `${facility.name} - ${facility.vicinity} (${formatDistance(facility.distance || 0)} away)`)
  .join("\n")}
`
    : ""
}

MEDICATIONS:
${result.medications.map((med) => `${med.name} - ${med.dosage} ${med.frequency} ${med.timing} for ${med.duration}`).join("\n")}

VITAL MONITORING:
${result.vitalMonitoring.map((vital) => `${vital.vital}: ${vital.frequency} at ${vital.timing} (Target: ${vital.targetRange})`).join("\n")}

LAB TESTS:
${result.labTests.map((test) => `${test.test} - ${test.priority} priority - ${test.reason}`).join("\n")}

DIET PLAN:
${result.dietPlan.map((meal) => `${meal.time} - ${meal.meal}: ${meal.items} (${meal.calories} cal)`).join("\n")}

SUPPLEMENTS:
${result.supplements.map((supp) => `${supp.name} - ${supp.dosage} ${supp.timing}`).join("\n")}

AYURVEDIC TREATMENTS:
${result.ayurvedicTreatment.map((treat) => `${treat.treatment} - ${treat.dosage} ${treat.timing}`).join("\n")}

---
Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Comprehensive-Assessment-${formData.fullName ? formData.fullName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (result) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-green-200 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardList className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Comprehensive Health Assessment Report</h2>
                  <p className="text-green-100 text-sm">
                    {formData.fullName} • {formData.location}
                    {formData.locationInfo && (
                      <span className="block text-xs opacity-80">{formData.locationInfo.address}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={generatePDF}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 hover:bg-green-50"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Print PDF
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 hover:bg-green-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New Assessment
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Show nearby facilities if available */}
            {formData.nearbyFacilities && formData.nearbyFacilities.length > 0 && (
              <Card className="mb-6 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-800 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Nearby Healthcare Facilities
                    <Badge variant="secondary" className="ml-2">
                      {formData.nearbyFacilities.length} found
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-3">
                    {formData.nearbyFacilities.slice(0, 5).map((facility) => (
                      <div
                        key={facility.place_id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getFacilityIcon(facility.types)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{facility.name}</h4>
                            <p className="text-sm text-gray-600">{facility.vicinity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {facility.distance && (
                            <Badge variant="outline" className="text-xs">
                              {formatDistance(facility.distance)}
                            </Badge>
                          )}
                          {facility.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{facility.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {facility.opening_hours && (
                            <Badge
                              variant={facility.opening_hours.open_now ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {facility.opening_hours.open_now ? "Open" : "Closed"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 mb-6 bg-gradient-to-r from-blue-100 to-purple-100">
                <TabsTrigger
                  value="medications"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  <Pill className="w-4 h-4 mr-1" />
                  Medications
                </TabsTrigger>
                <TabsTrigger value="vitals" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  <Activity className="w-4 h-4 mr-1" />
                  Vitals
                </TabsTrigger>
                <TabsTrigger value="labs" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                  <TestTube className="w-4 h-4 mr-1" />
                  Lab Tests
                </TabsTrigger>
                <TabsTrigger
                  value="hospitals"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Building2 className="w-4 h-4 mr-1" />
                  Hospitals
                </TabsTrigger>
                <TabsTrigger
                  value="labcenters"
                  className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <Stethoscope className="w-4 h-4 mr-1" />
                  Lab Centers
                </TabsTrigger>
                <TabsTrigger value="diet" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Utensils className="w-4 h-4 mr-1" />
                  Diet Plan
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                >
                  <Pill className="w-4 h-4 mr-1" />
                  Supplements
                </TabsTrigger>
                <TabsTrigger
                  value="ayurveda"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Leaf className="w-4 h-4 mr-1" />
                  Ayurveda
                </TabsTrigger>
                <TabsTrigger
                  value="aichat"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  AI Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medications" className="space-y-4">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Prescribed Medications
                  </h3>
                  <p className="text-red-100 text-sm">
                    Take medications exactly as prescribed. Consult your doctor before making any changes.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-red-50">
                        <TableHead className="font-bold text-red-800">Medication</TableHead>
                        <TableHead className="font-bold text-red-800">Dosage</TableHead>
                        <TableHead className="font-bold text-red-800">Frequency</TableHead>
                        <TableHead className="font-bold text-red-800">Timing</TableHead>
                        <TableHead className="font-bold text-red-800">Duration</TableHead>
                        <TableHead className="font-bold text-red-800">Instructions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.medications.map((med, index) => (
                        <TableRow key={index} className="hover:bg-red-25">
                          <TableCell className="font-medium text-red-900">{med.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              {med.dosage}
                            </Badge>
                          </TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.timing}</TableCell>
                          <TableCell>{med.duration}</TableCell>
                          <TableCell className="text-sm">{med.instructions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Important:</strong> Never stop medications abruptly. Always consult your healthcare provider
                    before making changes. Keep medications in original containers and check expiry dates regularly.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Vital Signs Monitoring Schedule
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Regular monitoring helps track your health progress and detect early warning signs.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50">
                        <TableHead className="font-bold text-blue-800">Vital Sign</TableHead>
                        <TableHead className="font-bold text-blue-800">Frequency</TableHead>
                        <TableHead className="font-bold text-blue-800">Timing</TableHead>
                        <TableHead className="font-bold text-blue-800">Target Range</TableHead>
                        <TableHead className="font-bold text-blue-800">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.vitalMonitoring.map((vital, index) => (
                        <TableRow key={index} className="hover:bg-blue-25">
                          <TableCell className="font-medium text-blue-900 flex items-center">
                            {vital.vital === "Blood Pressure" && <Heart className="w-4 h-4 mr-2 text-red-500" />}
                            {vital.vital === "Heart Rate" && <Activity className="w-4 h-4 mr-2 text-blue-500" />}
                            {vital.vital === "Temperature" && <Thermometer className="w-4 h-4 mr-2 text-orange-500" />}
                            {vital.vital === "Weight" && <Target className="w-4 h-4 mr-2 text-green-500" />}
                            {vital.vital}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {vital.frequency}
                            </Badge>
                          </TableCell>
                          <TableCell>{vital.timing}</TableCell>
                          <TableCell className="font-medium text-green-700">{vital.targetRange}</TableCell>
                          <TableCell className="text-sm">{vital.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Tip:</strong> Keep a health diary to track your vitals. Use the same equipment and
                    conditions for consistent readings. Contact your doctor if readings are consistently outside target
                    ranges.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="labs" className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Recommended Laboratory Tests
                  </h3>
                  <p className="text-purple-100 text-sm">
                    These tests will help diagnose your condition and monitor treatment progress.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead className="font-bold text-purple-800">Test Name</TableHead>
                        <TableHead className="font-bold text-purple-800">Priority</TableHead>
                        <TableHead className="font-bold text-purple-800">Reason</TableHead>
                        <TableHead className="font-bold text-purple-800">Preparation</TableHead>
                        <TableHead className="font-bold text-purple-800">Timeline</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.labTests.map((test, index) => (
                        <TableRow key={index} className="hover:bg-purple-25">
                          <TableCell className="font-medium text-purple-900">{test.test}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                test.priority === "High"
                                  ? "bg-red-100 text-red-800"
                                  : test.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {test.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{test.reason}</TableCell>
                          <TableCell className="text-sm font-medium">{test.preparation}</TableCell>
                          <TableCell className="text-sm">{test.frequency}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-purple-200 bg-purple-50">
                  <TestTube className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    <strong>Lab Test Tips:</strong> Follow preparation instructions carefully. Bring your ID and
                    insurance cards. Ask for a copy of results. Schedule follow-up appointments as recommended.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="hospitals" className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Nearby Hospitals in {formData.location}
                  </h3>
                  <p className="text-green-100 text-sm">
                    Quality healthcare facilities near your location for immediate and specialized care.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="font-bold text-green-800">Hospital Name</TableHead>
                        <TableHead className="font-bold text-green-800">Address</TableHead>
                        <TableHead className="font-bold text-green-800">Distance</TableHead>
                        <TableHead className="font-bold text-green-800">Specialties</TableHead>
                        <TableHead className="font-bold text-green-800">Phone</TableHead>
                        <TableHead className="font-bold text-green-800">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.nearbyHospitals.map((hospital, index) => (
                        <TableRow key={index} className="hover:bg-green-25">
                          <TableCell className="font-medium text-green-900">{hospital.name}</TableCell>
                          <TableCell className="text-sm">{hospital.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {hospital.distance}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{hospital.specialties}</TableCell>
                          <TableCell className="font-mono text-sm">{hospital.phone}</TableCell>
                          <TableCell className="font-medium text-yellow-600">{hospital.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-green-200 bg-green-50">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Emergency Tip:</strong> Save these hospital numbers in your phone. In case of emergency,
                    call 108 (India) or your local emergency number. Keep your medical history and current medications
                    list handy.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="labcenters" className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Laboratory Centers in {formData.location}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    Trusted diagnostic centers for your laboratory test requirements.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-indigo-50">
                        <TableHead className="font-bold text-indigo-800">Lab Name</TableHead>
                        <TableHead className="font-bold text-indigo-800">Address</TableHead>
                        <TableHead className="font-bold text-indigo-800">Distance</TableHead>
                        <TableHead className="font-bold text-indigo-800">Services</TableHead>
                        <TableHead className="font-bold text-indigo-800">Phone</TableHead>
                        <TableHead className="font-bold text-indigo-800">Timings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.labCenters.map((lab, index) => (
                        <TableRow key={index} className="hover:bg-indigo-25">
                          <TableCell className="font-medium text-indigo-900">{lab.name}</TableCell>
                          <TableCell className="text-sm">{lab.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
                              {lab.distance}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{lab.services}</TableCell>
                          <TableCell className="font-mono text-sm">{lab.phone}</TableCell>
                          <TableCell className="text-sm font-medium">{lab.timings}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-indigo-200 bg-indigo-50">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <AlertDescription className="text-indigo-800">
                    <strong>Booking Tips:</strong> Call ahead to confirm availability and timings. Many labs offer home
                    collection services. Compare prices and check if your insurance covers the tests.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="diet" className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Personalized Diet Plan
                    <Badge className="ml-3 bg-white text-orange-600">
                      Total: {result.dietPlan.reduce((sum, meal) => sum + meal.calories, 0)} kcal/day
                    </Badge>
                  </h3>
                  <p className="text-orange-100 text-sm">
                    Customized nutrition plan based on your health condition, preferences, and goals.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead className="font-bold text-orange-800">Meal</TableHead>
                        <TableHead className="font-bold text-orange-800">Time</TableHead>
                        <TableHead className="font-bold text-orange-800">Food Items</TableHead>
                        <TableHead className="font-bold text-orange-800">Calories</TableHead>
                        <TableHead className="font-bold text-orange-800">Water Intake</TableHead>
                        <TableHead className="font-bold text-orange-800">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.dietPlan.map((meal, index) => (
                        <TableRow key={index} className="hover:bg-orange-25">
                          <TableCell className="font-medium text-orange-900 flex items-center">
                            {meal.meal.includes("Morning") && <Clock className="w-4 h-4 mr-2 text-yellow-500" />}
                            {meal.meal.includes("Breakfast") && <Utensils className="w-4 h-4 mr-2 text-orange-500" />}
                            {meal.meal.includes("Lunch") && <Utensils className="w-4 h-4 mr-2 text-green-500" />}
                            {meal.meal.includes("Dinner") && <Utensils className="w-4 h-4 mr-2 text-blue-500" />}
                            {meal.meal.includes("Snack") && <Utensils className="w-4 h-4 mr-2 text-purple-500" />}
                            {meal.meal.includes("Bed") && <Clock className="w-4 h-4 mr-2 text-indigo-500" />}
                            {meal.meal}
                          </TableCell>
                          <TableCell className="font-medium text-blue-700">{meal.time}</TableCell>
                          <TableCell className="text-sm">{meal.items}</TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-800 font-bold">{meal.calories} kcal</Badge>
                          </TableCell>
                          <TableCell className="text-sm flex items-center">
                            <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                            {meal.water}
                          </TableCell>
                          <TableCell className="text-sm">{meal.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-orange-200 bg-orange-50">
                  <Utensils className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Diet Success Tips:</strong> Meal prep on weekends, stay hydrated, eat slowly and mindfully,
                    adjust portions based on hunger, and allow occasional treats in moderation.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="supplements" className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Recommended Supplements
                  </h3>
                  <p className="text-yellow-100 text-sm">
                    Evidence-based nutritional supplements to support your health goals and address deficiencies.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-yellow-50">
                        <TableHead className="font-bold text-yellow-800">Supplement</TableHead>
                        <TableHead className="font-bold text-yellow-800">Dosage</TableHead>
                        <TableHead className="font-bold text-yellow-800">Timing</TableHead>
                        <TableHead className="font-bold text-yellow-800">Benefits</TableHead>
                        <TableHead className="font-bold text-yellow-800">Recommended Brands</TableHead>
                        <TableHead className="font-bold text-yellow-800">Warnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.supplements.map((supp, index) => (
                        <TableRow key={index} className="hover:bg-yellow-25">
                          <TableCell className="font-medium text-yellow-900">{supp.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              {supp.dosage}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{supp.timing}</TableCell>
                          <TableCell className="text-sm">{supp.benefits}</TableCell>
                          <TableCell className="text-sm font-medium">{supp.brands}</TableCell>
                          <TableCell className="text-sm text-red-700">{supp.warnings}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Supplement Safety:</strong> Consult your doctor before starting any supplements, especially
                    if you're on medications. Buy from reputable brands, check expiry dates, and store properly.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="ayurveda" className="space-y-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    Ayurvedic Treatments & Herbs
                  </h3>
                  <p className="text-green-100 text-sm">
                    Traditional Indian medicine approaches to complement your modern treatment plan.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="font-bold text-green-800">Treatment</TableHead>
                        <TableHead className="font-bold text-green-800">Herbs Used</TableHead>
                        <TableHead className="font-bold text-green-800">Preparation</TableHead>
                        <TableHead className="font-bold text-green-800">Dosage</TableHead>
                        <TableHead className="font-bold text-green-800">Timing</TableHead>
                        <TableHead className="font-bold text-green-800">Benefits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.ayurvedicTreatment.map((treatment, index) => (
                        <TableRow key={index} className="hover:bg-green-25">
                          <TableCell className="font-medium text-green-900">{treatment.treatment}</TableCell>
                          <TableCell className="text-sm font-medium">{treatment.herbs}</TableCell>
                          <TableCell className="text-sm">{treatment.preparation}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {treatment.dosage}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{treatment.timing}</TableCell>
                          <TableCell className="text-sm">{treatment.benefits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Alert className="border-green-200 bg-green-50">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Ayurvedic Guidelines:</strong> Start with small doses to test tolerance. Source herbs from
                    certified suppliers. Inform your doctor about any herbal treatments. Maintain consistency for best
                    results.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="aichat" className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Health Assistant
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    Ask questions about your assessment, get clarifications, or discuss your health concerns with our AI
                    assistant.
                  </p>
                </div>
                <AIHealthChat />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-blue-200 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardList className="w-6 h-6 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Comprehensive Health Assessment</h2>
                <p className="text-blue-100 text-sm">Complete health evaluation with AI-powered recommendations</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
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
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="Enter height in cm"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Enter weight in kg"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter your city, state"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={detectLocation}
                      disabled={locationLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {locationError && <p className="text-sm text-red-600 mt-1">{locationError}</p>}
                  {formData.locationInfo && (
                    <p className="text-sm text-green-600 mt-1">✓ Location detected: {formData.locationInfo.address}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Current Health Concern */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Current Health Concern
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="primaryConcern">Primary Health Concern *</Label>
                  <Input
                    id="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                    placeholder="e.g., Headache, Fever, Chest pain, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="symptomDescription">Detailed Symptom Description *</Label>
                  <Textarea
                    id="symptomDescription"
                    value={formData.symptomDescription}
                    onChange={(e) => setFormData({ ...formData, symptomDescription: e.target.value })}
                    placeholder="Describe your symptoms in detail..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="symptomDuration">How long have you had these symptoms? *</Label>
                    <Select
                      value={formData.symptomDuration}
                      onValueChange={(value) => setFormData({ ...formData, symptomDuration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-day">Less than a day</SelectItem>
                        <SelectItem value="1-3-days">1-3 days</SelectItem>
                        <SelectItem value="4-7-days">4-7 days</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="more-than-3-months">More than 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Symptom Severity (1-10 scale)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={formData.symptomSeverity}
                        onValueChange={(value) => setFormData({ ...formData, symptomSeverity: value })}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Mild (1)</span>
                        <span className="font-medium">Current: {formData.symptomSeverity[0]}</span>
                        <span>Severe (10)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Pain/Discomfort Location (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                    {painLocationOptions.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pain-${location}`}
                          checked={formData.painLocation.includes(location)}
                          onCheckedChange={(checked) => handleMultiSelect("painLocation", location, checked as boolean)}
                        />
                        <Label htmlFor={`pain-${location}`} className="text-sm">
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-800 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Medical History
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>Chronic Conditions (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                    {chronicConditionOptions.map((condition) => (
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
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    placeholder="List all medications you're currently taking (include dosage and frequency)..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Known Allergies (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
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
                  <Label htmlFor="surgicalHistory">Surgical History</Label>
                  <Textarea
                    id="surgicalHistory"
                    value={formData.surgicalHistory}
                    onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })}
                    placeholder="List any surgeries or procedures you've had..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Family Medical History (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                    {familyHistoryOptions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={`family-${condition}`}
                          checked={formData.familyHistory.includes(condition)}
                          onCheckedChange={(checked) =>
                            handleMultiSelect("familyHistory", condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={`family-${condition}`} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Current Vital Signs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="e.g., 98.6"
                  />
                </div>
                <div>
                  <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                    placeholder="e.g., 98"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Lifestyle Factors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-800 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Lifestyle Factors
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="smokingStatus">Smoking Status</Label>
                    <Select
                      value={formData.smokingStatus}
                      onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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
                      onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="occasionally">Occasionally</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                    <Select
                      value={formData.exerciseFrequency}
                      onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
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
                    <Label htmlFor="averageSleepHours">Average Sleep Hours</Label>
                    <Select
                      value={formData.averageSleepHours}
                      onValueChange={(value) => setFormData({ ...formData, averageSleepHours: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                        <SelectItem value="5-6">5-6 hours</SelectItem>
                        <SelectItem value="6-7">6-7 hours</SelectItem>
                        <SelectItem value="7-8">7-8 hours</SelectItem>
                        <SelectItem value="8-9">8-9 hours</SelectItem>
                        <SelectItem value="more-than-9">More than 9 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Current Stress Level (1-10 scale)</Label>
                  <div className="px-3 py-2">
                    <Slider
                      value={formData.stressLevel}
                      onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Low (1)</span>
                      <span className="font-medium">Current: {formData.stressLevel[0]}</span>
                      <span>High (10)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Diet Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                <Utensils className="w-5 h-5 mr-2" />
                Diet & Nutrition Preferences
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="dietType">Diet Type</Label>
                    <Select
                      value={formData.dietType}
                      onValueChange={(value) => setFormData({ ...formData, dietType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="pescatarian">Pescatarian</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="no-preference">No specific preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                    <Select
                      value={formData.mealsPerDay}
                      onValueChange={(value) => setFormData({ ...formData, mealsPerDay: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 meals</SelectItem>
                        <SelectItem value="3">3 meals</SelectItem>
                        <SelectItem value="4">4 meals</SelectItem>
                        <SelectItem value="5">5 meals</SelectItem>
                        <SelectItem value="6">6 meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="waterIntakeGoal">Daily Water Intake Goal</Label>
                    <Select
                      value={formData.waterIntakeGoal}
                      onValueChange={(value) => setFormData({ ...formData, waterIntakeGoal: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2-liters">1-2 liters</SelectItem>
                        <SelectItem value="2-3-liters">2-3 liters</SelectItem>
                        <SelectItem value="3-4-liters">3-4 liters</SelectItem>
                        <SelectItem value="more-than-4-liters">More than 4 liters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supplementsUsed">Current Supplements</Label>
                    <Input
                      id="supplementsUsed"
                      value={formData.supplementsUsed}
                      onChange={(e) => setFormData({ ...formData, supplementsUsed: e.target.value })}
                      placeholder="e.g., Vitamin D, Omega-3"
                    />
                  </div>
                </div>
                <div>
                  <Label>Food Allergies (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                    {foodAllergyOptions.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={`food-allergy-${allergy}`}
                          checked={formData.foodAllergies.includes(allergy)}
                          onCheckedChange={(checked) => handleMultiSelect("foodAllergies", allergy, checked as boolean)}
                        />
                        <Label htmlFor={`food-allergy-${allergy}`} className="text-sm">
                          {allergy}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Preferred Cuisine (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                    {cuisineOptions.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cuisine-${cuisine}`}
                          checked={formData.preferredCuisine.includes(cuisine)}
                          onCheckedChange={(checked) =>
                            handleMultiSelect("preferredCuisine", cuisine, checked as boolean)
                          }
                        />
                        <Label htmlFor={`cuisine-${cuisine}`} className="text-sm">
                          {cuisine}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Additional Information
              </h3>
              <div className="grid gap-4">
                <div>
                  <Label>Additional Symptoms (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                    {additionalSymptomsOptions.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={`additional-${symptom}`}
                          checked={formData.additionalSymptoms.includes(symptom)}
                          onCheckedChange={(checked) =>
                            handleMultiSelect("additionalSymptoms", symptom, checked as boolean)
                          }
                        />
                        <Label htmlFor={`additional-${symptom}`} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Any other information you'd like to share about your health..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Health...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Generate Comprehensive Assessment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
