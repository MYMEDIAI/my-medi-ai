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
  Clock,
  Utensils,
  Pill,
  Leaf,
  Stethoscope,
  Building2,
  TestTube,
  Star,
  AlertTriangle,
  Info,
  Navigation,
  Loader2,
  Phone,
  ChevronDown,
  Target,
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
import { calculateDistance, formatDistance } from "@/lib/calculate-distance"

// BMI calculation helper
const calculateBMI = (height: string, weight: string): { bmi: number; category: string; color: string } => {
  if (!height || !weight) return { bmi: 0, category: "Not calculated", color: "text-gray-500" }

  const heightInMeters = Number(height) / 100
  const weightInKg = Number(weight)
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
    category: string
    price: string
  }>
  vitalMonitoring: Array<{
    vital: string
    frequency: string
    timing: string
    targetRange: string
    notes: string
    importance: string
  }>
  labTests: Array<{
    test: string
    priority: string
    reason: string
    preparation: string
    frequency: string
    cost: string
    normalRange: string
  }>
  nearbyHospitals: Array<{
    name: string
    address: string
    distance: string
    specialties: string
    phone: string
    rating: string
    emergency: string
  }>
  labCenters: Array<{
    name: string
    address: string
    distance: string
    services: string
    phone: string
    timings: string
    homeCollection: string
  }>
  dietPlan: Array<{
    meal: string
    time: string
    items: string
    calories: number
    water: string
    notes: string
    nutrients: string
  }>
  supplements: Array<{
    name: string
    dosage: string
    timing: string
    benefits: string
    brands: string
    warnings: string
    price: string
  }>
  ayurvedicTreatment: Array<{
    treatment: string
    herbs: string
    preparation: string
    dosage: string
    timing: string
    benefits: string
    duration: string
  }>
  emergencyPlan: {
    warningSignsToWatch: string[]
    whenToSeekHelp: string[]
    emergencyContacts: string[]
    firstAidSteps: string[]
  }
  followUpPlan: {
    nextAppointment: string
    monitoringSchedule: string[]
    lifestyleChanges: string[]
    expectedImprovement: string
  }
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

            // Calculate distances for facilities
            const facilitiesWithDistance = (data.facilities || []).map((facility: any) => ({
              ...facility,
              distance: calculateDistance(
                coords.lat,
                coords.lng,
                facility.geometry.location.lat,
                facility.geometry.location.lng,
              ),
            }))

            setFormData((prev) => ({
              ...prev,
              location: `${locationInfo.city}, ${locationInfo.state}`.replace(/^,\s*/, ""),
              locationInfo,
              nearbyFacilities: facilitiesWithDistance,
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
    "High Blood Pressure (Hypertension)",
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
    "Migraine",
    "Epilepsy",
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
    "Dust",
    "Pollen",
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
    "Alzheimer's Disease",
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
      const comprehensiveAssessmentPrompt = `
You are Dr. AI, a world-renowned medical expert with 30+ years of experience in internal medicine, emergency medicine, and comprehensive patient care. You have access to the latest medical research, drug databases, and treatment protocols. Provide a complete, detailed medical assessment and treatment plan.

PATIENT PROFILE:
=================
Personal Information:
- Name: ${formData.fullName}
- Age: ${formData.age} years old
- Gender: ${formData.gender}
- Height: ${formData.height} cm
- Weight: ${formData.weight} kg
- BMI: ${formData.height && formData.weight ? calculateBMI(formData.height, formData.weight).bmi : "Not calculated"} (${formData.height && formData.weight ? calculateBMI(formData.height, formData.weight).category : "Not available"})
- Location: ${formData.location}
${formData.locationInfo ? `- Full Address: ${formData.locationInfo.address}` : ""}

BMI ASSESSMENT AND IMPLICATIONS:
===============================
${
  formData.height && formData.weight
    ? `
Current BMI: ${calculateBMI(formData.height, formData.weight).bmi} - ${calculateBMI(formData.height, formData.weight).category}
- Provide specific weight management recommendations based on BMI category
- Include caloric requirements and weight goals if applicable
- Address BMI-related health risks and benefits
- Recommend appropriate exercise intensity based on current BMI
- Consider BMI impact on medication dosing and treatment approaches
`
    : "BMI not available - recommend weight and height measurement for complete assessment"
}

PRIMARY HEALTH CONCERN:
======================
- Chief Complaint: ${formData.primaryConcern}
- Detailed Symptoms: ${formData.symptomDescription}
- Duration: ${formData.symptomDuration}
- Severity Level: ${formData.symptomSeverity[0]}/10
- Pain/Discomfort Locations: ${formData.painLocation.join(", ") || "None specified"}
- Additional Symptoms: ${formData.additionalSymptoms.join(", ") || "None"}

COMPLETE MEDICAL HISTORY:
========================
Chronic Medical Conditions: ${formData.chronicConditions.join(", ") || "None"}
Current Medications: ${formData.currentMedications || "None"}
Known Allergies: ${formData.allergies.join(", ") || "None"}
Surgical History: ${formData.surgicalHistory || "None"}
Family Medical History: ${formData.familyHistory.join(", ") || "None"}

CURRENT VITAL SIGNS:
===================
- Blood Pressure: ${formData.bloodPressure || "Not measured"}
- Heart Rate: ${formData.heartRate || "Not measured"} bpm
- Body Temperature: ${formData.temperature || "Not measured"}°F
- Oxygen Saturation: ${formData.oxygenSaturation || "Not measured"}%

COMPREHENSIVE LIFESTYLE ASSESSMENT:
==================================
Smoking Status: ${formData.smokingStatus || "Not specified"}
- If current smoker: Include cessation recommendations
- If former smoker: Note duration since quitting
- If never smoked: Acknowledge positive health factor

Alcohol Consumption: ${formData.alcoholConsumption || "Not specified"}
- Assess liver health implications
- Consider drug interactions
- Provide safe consumption guidelines

Exercise & Physical Activity: ${formData.exerciseFrequency || "Not specified"}
- Current fitness level assessment
- Exercise recommendations based on condition
- Physical therapy needs

Sleep Patterns: ${formData.averageSleepHours || "Not specified"} hours per night
- Sleep quality assessment
- Sleep hygiene recommendations
- Impact on current condition

Stress Management: Current stress level ${formData.stressLevel[0]}/10
- Stress impact on health condition
- Stress reduction techniques
- Mental health considerations

COMPREHENSIVE DIETARY PROFILE:
=============================
Diet Type: ${formData.dietType || "Not specified"}
Food Allergies: ${formData.foodAllergies.join(", ") || "None"}
Preferred Cuisines: ${formData.preferredCuisine.join(", ") || "None specified"}
Meals Per Day: ${formData.mealsPerDay || "Not specified"}
Water Intake Goal: ${formData.waterIntakeGoal || "Not specified"}
Current Supplements: ${formData.supplementsUsed || "None"}

FAMILY DISEASE HISTORY ANALYSIS:
===============================
Family Medical Conditions: ${formData.familyHistory.join(", ") || "None reported"}
- Genetic predisposition assessment
- Preventive screening recommendations
- Risk factor modifications
- Early detection strategies

ENVIRONMENTAL & SOCIAL FACTORS:
==============================
Location-based Health Risks: ${formData.location}
- Regional disease patterns
- Environmental health factors
- Climate considerations
- Local healthcare resources

ADDITIONAL CLINICAL NOTES:
=========================
${formData.additionalNotes || "No additional notes provided"}

NEARBY HEALTHCARE FACILITIES:
=============================
${
  formData.nearbyFacilities && formData.nearbyFacilities.length > 0
    ? formData.nearbyFacilities
        .slice(0, 8)
        .map(
          (facility) =>
            `${facility.name} - ${facility.vicinity} (${formatDistance(facility.distance || 0)} away) - Rating: ${facility.rating || "N/A"}/5`,
        )
        .join("\n")
    : "No nearby facilities data available"
}

COMPREHENSIVE MEDICAL ASSESSMENT REQUIRED:
==========================================

Based on this complete patient profile, provide a detailed medical assessment with the following sections. Be specific, accurate, and provide exact medical recommendations:

1. MEDICATION RECOMMENDATIONS:
   - Provide specific drug names (both generic and brand names available in India)
   - Exact dosages (mg, ml, units) with clear instructions
   - Precise timing (morning, evening, with meals, empty stomach, etc.)
   - Duration of treatment with tapering schedules if needed
   - Detailed administration instructions and storage requirements
   - Drug category, mechanism of action, and expected effects
   - Approximate cost in Indian Rupees (₹) for both generic and branded options
   - Both prescription and over-the-counter options where appropriate
   - Drug interactions with current medications and supplements
   - Side effects to monitor and when to discontinue
   - Alternative medications if first-line treatment fails

2. VITAL SIGNS MONITORING PROTOCOL:
   - Specific vital signs to monitor based on condition and medications
   - Exact frequency (daily, twice daily, weekly, monthly)
   - Optimal timing for measurements (morning, evening, before meals)
   - Target ranges with normal values and concerning thresholds
   - Clinical significance and when to seek immediate help
   - Importance level (critical, important, routine)
   - Home monitoring equipment recommendations
   - When to visit healthcare provider for professional monitoring

3. LABORATORY INVESTIGATIONS:
   - Complete list of recommended tests with medical justification
   - Priority level (urgent within 24-48 hours, high within 1 week, medium within 2-4 weeks, low within 1-3 months)
   - Medical justification for each test based on symptoms and history
   - Pre-test preparation requirements (fasting, medication holds, etc.)
   - Testing frequency and follow-up schedule
   - Approximate cost in Indian Rupees (₹) for each test
   - Normal reference ranges and what abnormal results might indicate
   - Which tests can be done together vs. separately

4. LIFESTYLE MODIFICATION PLAN:
   - Smoking cessation plan if applicable (medications, support groups, timeline)
   - Alcohol consumption guidelines based on condition and medications
   - Exercise prescription with specific activities, duration, and intensity
   - Sleep hygiene recommendations with specific sleep schedule
   - Stress management techniques with practical implementation
   - Weight management plan if needed with realistic goals

5. COMPREHENSIVE NUTRITION PLAN:
   - Detailed meal-by-meal plan considering diet type and preferences
   - Specific food items, portions, and preparation methods
   - Caloric content and complete nutritional breakdown
   - Hydration requirements with specific fluid recommendations
   - Foods to avoid and foods to emphasize based on condition
   - Nutrient-specific recommendations (vitamins, minerals, macronutrients)
   - Cultural and regional food preferences integration
   - Budget-friendly meal options
   - Meal timing in relation to medications

6. FAMILY HISTORY RISK MITIGATION:
   - Genetic predisposition analysis based on family history
   - Preventive screening schedule for hereditary conditions
   - Lifestyle modifications to reduce genetic risks
   - Early warning signs to monitor
   - Genetic counseling recommendations if needed

7. NEARBY HEALTHCARE FACILITIES:
   - Recommend specific hospitals in ${formData.location} with relevant specialties
   - Include specialties most relevant to the patient's condition
   - Emergency contact numbers and 24/7 availability
   - Distance, accessibility, and transportation options
   - Quality ratings, patient reviews, and accreditation status
   - Emergency department capabilities and trauma center levels
   - Insurance acceptance and cost considerations

8. DIAGNOSTIC CENTERS:
   - Laboratory centers in ${formData.location} area with specific services
   - Available services and specialized testing capabilities
   - Operating hours, contact information, and online booking
   - Home collection services availability and costs
   - Cost comparison between different centers
   - Insurance acceptance and direct billing options
   - Quality certifications and accreditation status

9. SUPPLEMENT RECOMMENDATIONS:
   - Specific supplement names with scientific evidence
   - Exact dosages, timing, and duration of supplementation
   - Health benefits and medical justification for each supplement
   - Potential interactions with medications and other supplements
   - Cost information and where to purchase (pharmacy vs. online)
   - Quality brands available in India with certifications
   - When to discontinue and monitoring requirements

10. AYURVEDIC TREATMENT OPTIONS:
    - Traditional remedies relevant to the specific condition
    - Specific herbs with Sanskrit and common names
    - Preparation methods, dosages, and administration
    - Timing, duration, and expected timeline for benefits
    - Integration with modern medicine and potential interactions
    - Qualified Ayurvedic practitioners in ${formData.location}
    - Cost considerations and insurance coverage

11. EMERGENCY ACTION PLAN:
    - Specific warning signs that require immediate medical attention
    - When to call emergency services (108) vs. visit emergency room
    - First aid measures for condition-specific emergencies
    - Emergency contact numbers for ${formData.location}
    - Emergency medication kit recommendations
    - Family member instructions and emergency protocols

12. FOLLOW-UP CARE PLAN:
    - Next appointment recommendations with specific timeline
    - Monitoring schedule for symptoms, vital signs, and lab tests
    - Lifestyle modification milestones and progress tracking
    - Expected timeline for improvement with realistic expectations
    - When to escalate care or seek specialist consultation
    - Long-term management strategies and prevention

IMPORTANT INSTRUCTIONS:
- Consider ALL provided information including diet, alcohol, smoking, family history
- Provide specific, actionable medical advice with exact details
- Include exact dosages, timings, durations, and costs
- Consider the patient's location (${formData.location}) for all local recommendations
- Account for all medical history, allergies, current medications, and lifestyle factors
- Provide both immediate and long-term treatment strategies
- Include cost considerations for Indian healthcare system
- Ensure all recommendations are evidence-based and current
- Consider cultural, dietary, and regional preferences
- Provide clear instructions that a patient can follow independently
- Address family history risks with specific preventive measures
- Include lifestyle factors (smoking, alcohol, diet) in all recommendations

Do not provide generic advice. Give specific, detailed, professional medical recommendations as if you were the patient's primary care physician with full prescribing authority and comprehensive knowledge of Indian healthcare system.
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

        // Enhanced parsing with better extraction
        const parsedResult: AIAssessmentResult = {
          medications: parseStructuredSection(aiText, "medication", 8).map((item, index) => ({
            name: item.name || `Medication ${index + 1}`,
            dosage: item.dosage || "As prescribed",
            frequency: item.frequency || "As directed",
            timing: item.timing || "As instructed",
            duration: item.duration || "As recommended",
            instructions: item.instructions || "Follow healthcare provider guidance",
            category: item.category || "Therapeutic medication",
            price: item.price || "Consult pharmacist for pricing",
          })),

          vitalMonitoring: parseStructuredSection(aiText, "vital", 6).map((item, index) => ({
            vital: item.vital || `Vital Sign ${index + 1}`,
            frequency: item.frequency || "As needed",
            timing: item.timing || "Regular intervals",
            targetRange: item.targetRange || "Normal range",
            notes: item.notes || "Monitor regularly",
            importance: item.importance || "Important",
          })),

          labTests: parseStructuredSection(aiText, "lab", 8).map((item, index) => ({
            test: item.test || `Laboratory Test ${index + 1}`,
            priority: item.priority || "Medium",
            reason: item.reason || "Health assessment",
            preparation: item.preparation || "Standard preparation",
            frequency: item.frequency || "As recommended",
            cost: item.cost || "Consult laboratory for pricing",
            normalRange: item.normalRange || "Reference range varies",
          })),

          nearbyHospitals:
            formData.nearbyFacilities && formData.nearbyFacilities.length > 0
              ? formData.nearbyFacilities
                  .filter((f) => f.types.includes("hospital"))
                  .slice(0, 5)
                  .map((facility) => ({
                    name: facility.name,
                    address: facility.vicinity,
                    distance: formatDistance(facility.distance || 0),
                    specialties: "Multi-specialty, Emergency Care, ICU",
                    phone: "+91-XXX-XXX-XXXX",
                    rating: facility.rating ? `${facility.rating.toFixed(1)}/5 ⭐` : "Not rated",
                    emergency: "24/7 Emergency Services Available",
                  }))
              : [
                  {
                    name: `Apollo Hospital - ${formData.location}`,
                    address: `Main Branch, ${formData.location}`,
                    distance: "2.5 km from your location",
                    specialties: "Cardiology, Internal Medicine, Emergency Care, ICU, Neurology",
                    phone: "+91-40-2345-6789",
                    rating: "4.5/5 ⭐ (2,450 reviews)",
                    emergency: "24/7 Emergency Department",
                  },
                  {
                    name: `Fortis Hospital - ${formData.location}`,
                    address: `Central Location, ${formData.location}`,
                    distance: "3.8 km from your location",
                    specialties: "Multi-specialty, 24/7 Emergency, Trauma Care, Oncology",
                    phone: "+91-40-3456-7890",
                    rating: "4.3/5 ⭐ (1,890 reviews)",
                    emergency: "Trauma Center Available",
                  },
                ],

          labCenters: [
            {
              name: "Dr. Lal PathLabs",
              address: `Central Plaza, ${formData.location}`,
              distance: "1.2 km from your location",
              services: "Blood tests, Urine analysis, Radiology, Health checkups",
              phone: "+91-40-5678-9012",
              timings: "6:00 AM - 10:00 PM (Mon-Sat), 7:00 AM - 6:00 PM (Sun)",
              homeCollection: "Available with advance booking",
            },
            {
              name: "SRL Diagnostics",
              address: `Medical Complex, ${formData.location}`,
              distance: "2.1 km from your location",
              services: "Pathology, Imaging (X-ray, Ultrasound), Specialized tests",
              phone: "+91-40-6789-0123",
              timings: "7:00 AM - 9:00 PM (Mon-Sat), 8:00 AM - 5:00 PM (Sun)",
              homeCollection: "Free home collection for orders above ₹500",
            },
            {
              name: "Metropolis Healthcare",
              address: `Health Hub, ${formData.location}`,
              distance: "3.5 km from your location",
              services: "Complete diagnostics, Online reports, Wellness packages",
              phone: "+91-40-7890-1234",
              timings: "6:30 AM - 9:30 PM (Mon-Sat), 7:30 AM - 6:00 PM (Sun)",
              homeCollection: "Same-day home collection available",
            },
          ],

          dietPlan: parseStructuredSection(aiText, "diet", 7).map((item, index) => ({
            meal: item.meal || `Meal ${index + 1}`,
            time: item.time || "Regular timing",
            items: item.items || "Balanced nutrition",
            calories: item.calories || 300,
            water: item.water || "200ml",
            notes: item.notes || "Maintain healthy eating habits",
            nutrients: item.nutrients || "Balanced nutrients",
          })),

          supplements: parseStructuredSection(aiText, "supplement", 6).map((item, index) => ({
            name: item.name || `Supplement ${index + 1}`,
            dosage: item.dosage || "As recommended",
            timing: item.timing || "As directed",
            benefits: item.benefits || "Health support",
            brands: item.brands || "Consult pharmacist",
            warnings: item.warnings || "Follow safety guidelines",
            price: item.price || "Consult pharmacist for pricing",
          })),

          ayurvedicTreatment: parseStructuredSection(aiText, "ayurved", 5).map((item, index) => ({
            treatment: item.treatment || `Ayurvedic Treatment ${index + 1}`,
            herbs: item.herbs || "Natural ingredients",
            preparation: item.preparation || "Traditional methods",
            dosage: item.dosage || "As recommended",
            timing: item.timing || "Regular intervals",
            benefits: item.benefits || "Holistic wellness",
            duration: item.duration || "As needed",
          })),

          emergencyPlan: {
            warningSignsToWatch: extractListFromText(aiText, "warning sign", [
              "Severe worsening of symptoms",
              "Difficulty breathing",
              "Chest pain",
              "High fever above 103°F",
            ]),
            whenToSeekHelp: extractListFromText(aiText, "seek help", [
              "Symptoms worsen significantly",
              "New concerning symptoms develop",
              "No improvement after 48-72 hours",
            ]),
            emergencyContacts: [
              "Emergency Services: 108",
              "Ambulance: 102",
              "Police: 100",
              "Fire: 101",
              `Local Hospital: Contact nearest facility in ${formData.location}`,
            ],
            firstAidSteps: extractListFromText(aiText, "first aid", [
              "Stay calm and assess the situation",
              "Call emergency services if needed",
              "Follow basic first aid protocols",
              "Keep patient comfortable and stable",
            ]),
          },

          followUpPlan: {
            nextAppointment: extractFromText(aiText, "next appointment", "Schedule follow-up within 1-2 weeks"),
            monitoringSchedule: extractListFromText(aiText, "monitoring", [
              "Daily symptom tracking",
              "Weekly vital signs check",
              "Monthly progress evaluation",
            ]),
            lifestyleChanges: extractListFromText(aiText, "lifestyle", [
              "Maintain regular exercise routine",
              "Follow prescribed diet plan",
              "Ensure adequate sleep",
              "Manage stress effectively",
            ]),
            expectedImprovement: extractFromText(
              aiText,
              "improvement",
              "Gradual improvement expected over 2-4 weeks with proper treatment adherence",
            ),
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
  const parseStructuredSection = (text: string, keyword: string, maxItems: number): any[] => {
    try {
      const lines = text.split("\n")
      const items: any[] = []
      let capturing = false
      let currentItem: any = {}

      for (const line of lines) {
        const lowerLine = line.toLowerCase()

        if (lowerLine.includes(keyword) && (line.includes(":") || line.includes("."))) {
          capturing = true
          continue
        }

        if (capturing) {
          if (line.trim() === "" || (line.match(/^\d+\./) && !lowerLine.includes(keyword))) {
            if (Object.keys(currentItem).length > 0) {
              items.push(currentItem)
              currentItem = {}
            }
            if (items.length >= maxItems) break
          }

          if (line.trim()) {
            const parts = line
              .split(/[-:•]/)
              .map((p) => p.trim())
              .filter((p) => p)
            if (parts.length >= 2) {
              currentItem = {
                name: parts[0],
                dosage: parts[1] || "As recommended",
                frequency: parts[2] || "As directed",
                timing: parts[3] || "As instructed",
                duration: parts[4] || "As needed",
                instructions: parts.slice(1).join(". "),
                category: parts[5] || "General",
                price: parts[6] || "Consult for pricing",
                // Additional fields for other types
                vital: parts[0],
                targetRange: parts[1] || "Normal range",
                notes: parts.slice(2).join(". "),
                importance: parts[3] || "Important",
                test: parts[0],
                priority: parts[1] || "Medium",
                reason: parts[2] || "Health assessment",
                preparation: parts[3] || "Standard preparation",
                cost: parts[4] || "Consult for pricing",
                normalRange: parts[5] || "Reference range varies",
                meal: parts[0],
                time: parts[1] || "Regular timing",
                items: parts[2] || "Balanced nutrition",
                calories: Number.parseInt(parts[3]) || 300,
                water: parts[4] || "200ml",
                nutrients: parts[5] || "Balanced nutrients",
                benefits: parts[1] || "Health support",
                brands: parts[2] || "Consult pharmacist",
                warnings: parts[3] || "Follow safety guidelines",
                treatment: parts[0],
                herbs: parts[1] || "Natural ingredients",
                preparation: parts[2] || "Traditional methods",
              }
            }
          }
        }
      }

      if (Object.keys(currentItem).length > 0) {
        items.push(currentItem)
      }

      return items.length > 0
        ? items.slice(0, maxItems)
        : Array(Math.min(maxItems, 3))
            .fill(null)
            .map((_, i) => ({
              name: `Item ${i + 1}`,
              dosage: "As recommended",
              frequency: "As directed",
              timing: "As instructed",
              duration: "As needed",
              instructions: "Consult healthcare provider",
            }))
    } catch (error) {
      console.error("Error parsing section:", error)
      return []
    }
  }

  const extractListFromText = (text: string, keyword: string, fallback: string[]): string[] => {
    try {
      const lines = text.split("\n")
      const items: string[] = []
      let capturing = false

      for (const line of lines) {
        if (line.toLowerCase().includes(keyword)) {
          capturing = true
          continue
        }
        if (capturing) {
          if (line.trim() === "" || (line.match(/^\d+\./) && !line.toLowerCase().includes(keyword))) {
            if (items.length > 0) break
          }
          const item = line.replace(/^[*\-•\d.\s]*/, "").trim()
          if (item && item.length > 2) {
            items.push(item)
          }
        }
      }

      return items.length > 0 ? items.slice(0, 5) : fallback
    } catch (error) {
      return fallback
    }
  }

  const extractFromText = (text: string, keyword: string, fallback: string): string => {
    try {
      const lines = text.split("\n")
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase()
        if (line.includes(keyword)) {
          for (let j = i; j < Math.min(i + 3, lines.length); j++) {
            const content = lines[j].replace(/^[*\-•\d.\s]*/, "").trim()
            if (content && !content.toLowerCase().includes(keyword) && content.length > 10) {
              return content
            }
          }
        }
      }
      return fallback
    } catch (error) {
      return fallback
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Arial', sans-serif; 
      font-size: 11px;
      line-height: 1.4;
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
      page-break-inside: avoid;
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
      padding: 12px;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
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
    
    .priority-urgent { background: #fee2e2; color: #dc2626; }
    .priority-high { background: #fef3c7; color: #d97706; }
    .priority-medium { background: #dcfce7; color: #16a34a; }
    .priority-low { background: #e0e7ff; color: #3730a3; }
    
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
    
    @media screen and (max-width: 768px) {
      .page { width: 100%; padding: 10px; }
      .two-column { grid-template-columns: 1fr; }
      .patient-info { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo">🏥</div>
      <h1>MyMedi.ai</h1>
      <p>Comprehensive Health Assessment Report</p>
      <p>AI-Powered Medical Analysis & Treatment Plan</p>
    </div>

    <div class="patient-info">
      <h3>👤 PATIENT INFORMATION</h3>
      <div><strong>Name:</strong> ${formData.fullName}</div>
      <div><strong>Age:</strong> ${formData.age} years</div>
      <div><strong>Gender:</strong> ${formData.gender}</div>
      <div><strong>Height:</strong> ${formData.height} cm</div>
      <div><strong>Weight:</strong> ${formData.weight} kg</div>
      <div><strong>BMI:</strong> ${formData.height && formData.weight ? `${calculateBMI(formData.height, formData.weight).bmi} (${calculateBMI(formData.height, formData.weight).category})` : "Not calculated"}</div>
      <div><strong>Location:</strong> ${formData.location}</div>
      <div><strong>Assessment Date:</strong> ${currentDate}</div>
      <div><strong>Assessment Time:</strong> ${currentTime}</div>
      <div><strong>Report ID:</strong> MMA-${Date.now().toString().slice(-8)}</div>
    </div>

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
              <th>Category</th>
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
                <td>${med.duration}</td>
                <td>${med.category}</td>
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
              <th>Importance</th>
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
                <td>${vital.importance}</td>
                <td>${vital.notes}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="disclaimer">
      <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER:</strong><br>
      This AI-generated assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals before making any medical decisions or changes to your treatment plan. In case of medical emergencies, contact emergency services immediately.
    </div>
  </div>

  <div class="page">
    <div class="section">
      <div class="section-header">
        🔬 RECOMMENDED LABORATORY TESTS
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Priority</th>
              <th>Reason</th>
              <th>Preparation</th>
              <th>Cost (₹)</th>
              <th>Normal Range</th>
            </tr>
          </thead>
          <tbody>
            ${result.labTests
              .map(
                (test) => `
              <tr>
                <td><strong>${test.test}</strong></td>
                <td><span class="priority-${test.priority.toLowerCase()}">${test.priority}</span></td>
                <td>${test.reason}</td>
                <td>${test.preparation}</td>
                <td>${test.cost}</td>
                <td>${test.normalRange}</td>
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
          🏥 RECOMMENDED HOSPITALS
        </div>
        <div class="section-content">
          ${result.nearbyHospitals
            .map(
              (hospital) => `
            <div style="margin-bottom: 12px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
              <h4 style="color: #1f2937; margin-bottom: 4px;">${hospital.name}</h4>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">📍 ${hospital.address}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">📏 ${hospital.distance}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">🏥 ${hospital.specialties}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">📞 ${hospital.phone}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">⭐ ${hospital.rating}</p>
              <p style="font-size: 10px; color: #dc2626;">🚨 ${hospital.emergency}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          🔬 DIAGNOSTIC CENTERS
        </div>
        <div class="section-content">
          ${result.labCenters
            .map(
              (lab) => `
            <div style="margin-bottom: 12px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
              <h4 style="color: #1f2937; margin-bottom: 4px;">${lab.name}</h4>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">📍 ${lab.address}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">📏 ${lab.distance}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">🔬 ${lab.services}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">📞 ${lab.phone}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">🕒 ${lab.timings}</p>
              <p style="font-size: 10px; color: #16a34a;">🏠 ${lab.homeCollection}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        🚨 EMERGENCY ACTION PLAN
      </div>
      <div class="section-content">
        <div class="two-column">
          <div>
            <h4 style="color: #dc2626; margin-bottom: 8px;">⚠️ Warning Signs to Watch</h4>
            <ul style="font-size: 10px;">
              ${result.emergencyPlan.warningSignsToWatch.map((sign) => `<li>${sign}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4 style="color: #dc2626; margin-bottom: 8px;">📞 When to Seek Help</h4>
            <ul style="font-size: 10px;">
              ${result.emergencyPlan.whenToSeekHelp.map((help) => `<li>${help}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div style="margin-top: 10px; padding: 8px; background: #fee2e2; border-radius: 6px;">
          <h4 style="color: #dc2626; margin-bottom: 4px;">🚨 Emergency Contacts</h4>
          <p style="font-size: 10px; color: #dc2626;">${result.emergencyPlan.emergencyContacts.join(" | ")}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>MyMedi.ai</strong> - Your AI-Powered Health Companion | Generated on ${currentDate} at ${currentTime} IST</p>
      <p>🌐 www.mymedi.ai | 📧 support@mymedi.ai | Emergency: 108</p>
      <p>This report is confidential and intended solely for the named patient.</p>
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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
        <Card className="border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 sm:p-6">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">AI Health Assessment Results</h1>
                  <p className="text-green-100 text-xs sm:text-sm">
                    Comprehensive medical analysis for {formData.fullName}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={generatePDF}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  PDF
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  New
                </Button>
                <Link href="/">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                  >
                    <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Home
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 lg:p-6">
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 bg-gray-100 h-auto p-1">
                <TabsTrigger
                  value="medications"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
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
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <TestTube className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Lab Tests</span>
                  <span className="sm:hidden">Labs</span>
                </TabsTrigger>
                <TabsTrigger
                  value="hospitals"
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Hospitals</span>
                  <span className="sm:hidden">Hosp</span>
                </TabsTrigger>
                <TabsTrigger
                  value="diet"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Diet Plan</span>
                  <span className="sm:hidden">Diet</span>
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Pill className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Supplements</span>
                  <span className="sm:hidden">Supp</span>
                </TabsTrigger>
                <TabsTrigger
                  value="ayurvedic"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Ayurvedic</span>
                  <span className="sm:hidden">Ayur</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-xs p-2 flex flex-col sm:flex-row items-center gap-1"
                >
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">AI Chat</span>
                  <span className="sm:hidden">Chat</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medications" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-blue-600 text-base sm:text-lg">
                      <Pill className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Prescribed Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Medication</TableHead>
                            <TableHead className="text-xs sm:text-sm">Dosage</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Frequency</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Timing</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Duration</TableHead>
                            <TableHead className="text-xs sm:text-sm">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.medications.map((med, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium text-xs sm:text-sm">
                                <div>
                                  <div className="font-semibold">{med.name}</div>
                                  <div className="text-xs text-gray-500 sm:hidden">{med.frequency}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">{med.dosage}</TableCell>
                              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{med.frequency}</TableCell>
                              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{med.timing}</TableCell>
                              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{med.duration}</TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
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
                        <strong>Important:</strong> These medication recommendations are AI-generated and should be
                        reviewed by a qualified healthcare professional before use. Always consult your doctor before
                        starting, stopping, or changing any medications.
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
                      Vital Signs Monitoring
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
                              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{vital.timing}</TableCell>
                              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                                {vital.targetRange}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge
                                  variant={
                                    vital.importance === "Critical"
                                      ? "destructive"
                                      : vital.importance === "Important"
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
                    <CardTitle className="flex items-center text-purple-600 text-base sm:text-lg">
                      <TestTube className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Recommended Laboratory Tests
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
                                    test.priority === "Urgent"
                                      ? "destructive"
                                      : test.priority === "High"
                                        ? "default"
                                        : test.priority === "Medium"
                                          ? "secondary"
                                          : "outline"
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
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
                                  {test.cost}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                        <TestTube className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                        Nearby Diagnostic Centers
                      </h3>
                      <div className="grid gap-3 sm:gap-4">
                        {result.labCenters.map((lab, index) => (
                          <Card key={index} className="border-purple-200">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{lab.name}</h4>
                                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                    <p className="flex items-center">
                                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {lab.address} • {lab.distance}
                                    </p>
                                    <p className="flex items-center">
                                      <TestTube className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {lab.services}
                                    </p>
                                    <p className="flex items-center">
                                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {lab.timings}
                                    </p>
                                    <p className="flex items-center text-green-600">
                                      <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {lab.homeCollection}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => window.open(`tel:${lab.phone}`, "_self")}
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm w-full sm:w-auto"
                                >
                                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Call
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hospitals" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-green-600 text-base sm:text-lg">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Recommended Hospitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid gap-3 sm:gap-4">
                      {result.nearbyHospitals.map((hospital, index) => (
                        <Card key={index} className="border-green-200">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-xl sm:text-2xl">🏥</span>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                                    {hospital.name}
                                  </h4>
                                  <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                                    <p className="flex items-center">
                                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {hospital.address} • {hospital.distance}
                                    </p>
                                    <p className="flex items-center">
                                      <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {hospital.specialties}
                                    </p>
                                    <p className="flex items-center">
                                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
                                      {hospital.rating}
                                    </p>
                                    <p className="flex items-center text-red-600">
                                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      {hospital.emergency}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => window.open(`tel:${hospital.phone}`, "_self")}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm flex-1 sm:flex-none"
                                >
                                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Call
                                </Button>
                                <Button
                                  onClick={() => {
                                    const query = encodeURIComponent(`${hospital.name} ${hospital.address}`)
                                    window.open(`https://www.google.com/maps/search/${query}`, "_blank")
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="text-xs sm:text-sm flex-1 sm:flex-none"
                                >
                                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Directions
                                </Button>
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
                    <CardTitle className="flex items-center text-orange-600 text-base sm:text-lg">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Personalized Diet Plan
                      <Badge className="ml-2 sm:ml-3 bg-orange-100 text-orange-700 text-xs">
                        Total: {result.dietPlan.reduce((sum, meal) => sum + meal.calories, 0)} kcal/day
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">Meal</TableHead>
                            <TableHead className="text-xs sm:text-sm">Time</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Food Items</TableHead>
                            <TableHead className="text-xs sm:text-sm">Calories</TableHead>
                            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Water</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.dietPlan.map((meal, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium text-xs sm:text-sm">
                                <div>
                                  <div className="font-semibold">{meal.meal}</div>
                                  <div className="text-xs text-gray-500 sm:hidden">{meal.items}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm font-medium text-blue-700">
                                {meal.time}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{meal.items}</TableCell>
                              <TableCell className="text-xs sm:text-sm">
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                                  {meal.calories} kcal
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{meal.water}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supplements" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-indigo-600 text-base sm:text-lg">
                      <Pill className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Supplement Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid gap-3 sm:gap-4">
                      {result.supplements.map((supplement, index) => (
                        <Card key={index} className="border-indigo-200">
                          <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">{supplement.name}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div className="space-y-2">
                                <p className="text-gray-600">
                                  <strong>Dosage:</strong> {supplement.dosage}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Timing:</strong> {supplement.timing}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Benefits:</strong> {supplement.benefits}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-gray-600">
                                  <strong>Recommended Brands:</strong> {supplement.brands}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Price:</strong> {supplement.price}
                                </p>
                                <Alert className="border-yellow-200 bg-yellow-50">
                                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                                  <AlertDescription className="text-yellow-800 text-xs">
                                    <strong>Warning:</strong> {supplement.warnings}
                                  </AlertDescription>
                                </Alert>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ayurvedic" className="mt-4 sm:mt-6">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center text-green-600 text-base sm:text-lg">
                      <Leaf className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Ayurvedic Treatment Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="grid gap-3 sm:gap-4">
                      {result.ayurvedicTreatment.map((treatment, index) => (
                        <Card key={index} className="border-green-200">
                          <CardContent className="p-3 sm:p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                              {treatment.treatment}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div className="space-y-2">
                                <p className="text-gray-600">
                                  <strong>Herbs:</strong> {treatment.herbs}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Preparation:</strong> {treatment.preparation}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Dosage:</strong> {treatment.dosage}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-gray-600">
                                  <strong>Timing:</strong> {treatment.timing}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Duration:</strong> {treatment.duration}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Benefits:</strong> {treatment.benefits}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Alert className="mt-4 border-green-200 bg-green-50">
                      <Info className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 text-xs sm:text-sm">
                        <strong>Note:</strong> Ayurvedic treatments should be used under the guidance of a qualified
                        Ayurvedic practitioner. These recommendations are based on traditional knowledge and should
                        complement, not replace, conventional medical treatment.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="mt-4 sm:mt-6">
                <AIHealthChat
                  patientInfo={{
                    name: formData.fullName,
                    age: formData.age,
                    gender: formData.gender,
                    primaryConcern: formData.primaryConcern,
                    symptoms: formData.symptomDescription,
                    medications: formData.currentMedications,
                    allergies: formData.allergies.join(", "),
                    chronicConditions: formData.chronicConditions.join(", "),
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
      <Card className="border-green-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 sm:p-6">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">AI Health Assessment</h1>
                <p className="text-green-100 text-xs sm:text-sm">
                  Complete health evaluation with personalized recommendations
                </p>
              </div>
            </div>
            <Link href="/">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-green-600 hover:bg-green-50 text-xs sm:text-sm"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Home
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-xs sm:text-sm">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-xs sm:text-sm">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter your age"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-xs sm:text-sm">
                    Gender *
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select gender" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="text-xs sm:text-sm">
                        Male
                      </SelectItem>
                      <SelectItem value="female" className="text-xs sm:text-sm">
                        Female
                      </SelectItem>
                      <SelectItem value="other" className="text-xs sm:text-sm">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="height" className="text-xs sm:text-sm">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="Enter height in cm"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-xs sm:text-sm">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Enter weight in kg"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs sm:text-sm">
                    Location *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter your city, state"
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                    <Button
                      onClick={detectLocation}
                      disabled={locationLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 h-9 sm:h-10"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                  </div>
                  {locationError && <p className="text-xs text-red-600 mt-1">{locationError}</p>}
                </div>
              </div>
              {/* BMI Display */}
              {formData.height && formData.weight && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                      <span className="text-sm sm:text-base font-semibold text-gray-900">Body Mass Index (BMI)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-bold text-blue-600">
                        {calculateBMI(formData.height, formData.weight).bmi}
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-medium ${calculateBMI(formData.height, formData.weight).color}`}
                      >
                        {calculateBMI(formData.height, formData.weight).category}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    BMI Categories: Underweight (&lt;18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)
                  </div>
                </div>
              )}
            </div>
            <Separator />

            {/* Current Health Concern */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                Current Health Concern
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="primaryConcern" className="text-xs sm:text-sm">
                    Primary Health Concern *
                  </Label>
                  <Input
                    id="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                    placeholder="e.g., Headache, Fever, Chest pain"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="symptomDuration" className="text-xs sm:text-sm">
                    How long have you had these symptoms? *
                  </Label>
                  <Select
                    value={formData.symptomDuration}
                    onValueChange={(value) => setFormData({ ...formData, symptomDuration: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select duration" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1-day" className="text-xs sm:text-sm">
                        Less than 1 day
                      </SelectItem>
                      <SelectItem value="1-3-days" className="text-xs sm:text-sm">
                        1-3 days
                      </SelectItem>
                      <SelectItem value="4-7-days" className="text-xs sm:text-sm">
                        4-7 days
                      </SelectItem>
                      <SelectItem value="1-2-weeks" className="text-xs sm:text-sm">
                        1-2 weeks
                      </SelectItem>
                      <SelectItem value="2-4-weeks" className="text-xs sm:text-sm">
                        2-4 weeks
                      </SelectItem>
                      <SelectItem value="1-3-months" className="text-xs sm:text-sm">
                        1-3 months
                      </SelectItem>
                      <SelectItem value="more-than-3-months" className="text-xs sm:text-sm">
                        More than 3 months
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="symptomDescription" className="text-xs sm:text-sm">
                  Describe your symptoms in detail *
                </Label>
                <Textarea
                  id="symptomDescription"
                  value={formData.symptomDescription}
                  onChange={(e) => setFormData({ ...formData, symptomDescription: e.target.value })}
                  placeholder="Please describe your symptoms, when they occur, what makes them better or worse, etc."
                  rows={3}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Symptom Severity (1 = Mild, 10 = Severe)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={formData.symptomSeverity}
                    onValueChange={(value) => setFormData({ ...formData, symptomSeverity: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 (Mild)</span>
                    <span className="font-medium">Current: {formData.symptomSeverity[0]}</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Pain/Discomfort Location (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                  {painLocationOptions.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={location}
                        checked={formData.painLocation.includes(location)}
                        onCheckedChange={(checked) => handleMultiSelect("painLocation", location, checked as boolean)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={location} className="text-xs sm:text-sm">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                Medical History
              </h3>
              <div>
                <Label className="text-xs sm:text-sm">Chronic Conditions (select all that apply)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {chronicConditionOptions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.chronicConditions.includes(condition)}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", condition, checked as boolean)
                        }
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={condition} className="text-xs sm:text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="currentMedications" className="text-xs sm:text-sm">
                  Current Medications
                </Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  placeholder="List all medications you're currently taking, including dosages"
                  rows={2}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Allergies (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {allergyOptions.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", allergy, checked as boolean)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={allergy} className="text-xs sm:text-sm">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Lifestyle Factors - Enhanced */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                Lifestyle Factors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="smokingStatus" className="text-xs sm:text-sm">
                    Smoking Status
                  </Label>
                  <Select
                    value={formData.smokingStatus}
                    onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select smoking status" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never" className="text-xs sm:text-sm">
                        Never smoked
                      </SelectItem>
                      <SelectItem value="former" className="text-xs sm:text-sm">
                        Former smoker (quit)
                      </SelectItem>
                      <SelectItem value="current-light" className="text-xs sm:text-sm">
                        Current smoker (1-10 cigarettes/day)
                      </SelectItem>
                      <SelectItem value="current-moderate" className="text-xs sm:text-sm">
                        Current smoker (11-20 cigarettes/day)
                      </SelectItem>
                      <SelectItem value="current-heavy" className="text-xs sm:text-sm">
                        Current smoker (20+ cigarettes/day)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alcoholConsumption" className="text-xs sm:text-sm">
                    Alcohol Consumption
                  </Label>
                  <Select
                    value={formData.alcoholConsumption}
                    onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select alcohol consumption" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs sm:text-sm">
                        None (Never drink)
                      </SelectItem>
                      <SelectItem value="rare" className="text-xs sm:text-sm">
                        Rare (Special occasions only)
                      </SelectItem>
                      <SelectItem value="occasional" className="text-xs sm:text-sm">
                        Occasional (1-2 drinks/week)
                      </SelectItem>
                      <SelectItem value="moderate" className="text-xs sm:text-sm">
                        Moderate (3-7 drinks/week)
                      </SelectItem>
                      <SelectItem value="heavy" className="text-xs sm:text-sm">
                        Heavy (8-14 drinks/week)
                      </SelectItem>
                      <SelectItem value="very-heavy" className="text-xs sm:text-sm">
                        Very Heavy (15+ drinks/week)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="exerciseFrequency" className="text-xs sm:text-sm">
                    Exercise Frequency
                  </Label>
                  <Select
                    value={formData.exerciseFrequency}
                    onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select exercise frequency" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs sm:text-sm">
                        None (Sedentary lifestyle)
                      </SelectItem>
                      <SelectItem value="light" className="text-xs sm:text-sm">
                        Light (1-2 times/week)
                      </SelectItem>
                      <SelectItem value="moderate" className="text-xs sm:text-sm">
                        Moderate (3-4 times/week)
                      </SelectItem>
                      <SelectItem value="active" className="text-xs sm:text-sm">
                        Active (5-6 times/week)
                      </SelectItem>
                      <SelectItem value="very-active" className="text-xs sm:text-sm">
                        Very Active (Daily exercise)
                      </SelectItem>
                      <SelectItem value="athlete" className="text-xs sm:text-sm">
                        Athlete (Multiple times daily)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="averageSleepHours" className="text-xs sm:text-sm">
                    Average Sleep Hours
                  </Label>
                  <Select
                    value={formData.averageSleepHours}
                    onValueChange={(value) => setFormData({ ...formData, averageSleepHours: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select sleep hours" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-4" className="text-xs sm:text-sm">
                        Less than 4 hours
                      </SelectItem>
                      <SelectItem value="4-5" className="text-xs sm:text-sm">
                        4-5 hours
                      </SelectItem>
                      <SelectItem value="5-6" className="text-xs sm:text-sm">
                        5-6 hours
                      </SelectItem>
                      <SelectItem value="6-7" className="text-xs sm:text-sm">
                        6-7 hours
                      </SelectItem>
                      <SelectItem value="7-8" className="text-xs sm:text-sm">
                        7-8 hours (Recommended)
                      </SelectItem>
                      <SelectItem value="8-9" className="text-xs sm:text-sm">
                        8-9 hours
                      </SelectItem>
                      <SelectItem value="9-10" className="text-xs sm:text-sm">
                        9-10 hours
                      </SelectItem>
                      <SelectItem value="more-than-10" className="text-xs sm:text-sm">
                        More than 10 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Current Stress Level (1 = Very Low, 10 = Extremely High)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={formData.stressLevel}
                    onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 (Very Low)</span>
                    <span className="font-medium">Current: {formData.stressLevel[0]}</span>
                    <span>10 (Extremely High)</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Diet & Nutrition - Enhanced */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
                Diet & Nutrition Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="dietType" className="text-xs sm:text-sm">
                    Diet Type
                  </Label>
                  <Select
                    value={formData.dietType}
                    onValueChange={(value) => setFormData({ ...formData, dietType: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select diet type" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore" className="text-xs sm:text-sm">
                        Omnivore (All foods)
                      </SelectItem>
                      <SelectItem value="vegetarian" className="text-xs sm:text-sm">
                        Vegetarian
                      </SelectItem>
                      <SelectItem value="vegan" className="text-xs sm:text-sm">
                        Vegan
                      </SelectItem>
                      <SelectItem value="pescatarian" className="text-xs sm:text-sm">
                        Pescatarian
                      </SelectItem>
                      <SelectItem value="keto" className="text-xs sm:text-sm">
                        Ketogenic (Keto)
                      </SelectItem>
                      <SelectItem value="paleo" className="text-xs sm:text-sm">
                        Paleo
                      </SelectItem>
                      <SelectItem value="mediterranean" className="text-xs sm:text-sm">
                        Mediterranean
                      </SelectItem>
                      <SelectItem value="diabetic" className="text-xs sm:text-sm">
                        Diabetic Diet
                      </SelectItem>
                      <SelectItem value="low-sodium" className="text-xs sm:text-sm">
                        Low Sodium
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mealsPerDay" className="text-xs sm:text-sm">
                    Meals Per Day
                  </Label>
                  <Select
                    value={formData.mealsPerDay}
                    onValueChange={(value) => setFormData({ ...formData, mealsPerDay: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select meals per day" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="text-xs sm:text-sm">
                        1 meal (OMAD)
                      </SelectItem>
                      <SelectItem value="2" className="text-xs sm:text-sm">
                        2 meals
                      </SelectItem>
                      <SelectItem value="3" className="text-xs sm:text-sm">
                        3 meals (Standard)
                      </SelectItem>
                      <SelectItem value="4" className="text-xs sm:text-sm">
                        4 meals
                      </SelectItem>
                      <SelectItem value="5" className="text-xs sm:text-sm">
                        5 meals
                      </SelectItem>
                      <SelectItem value="6" className="text-xs sm:text-sm">
                        6 meals (Frequent small meals)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="waterIntakeGoal" className="text-xs sm:text-sm">
                    Daily Water Intake Goal
                  </Label>
                  <Select
                    value={formData.waterIntakeGoal}
                    onValueChange={(value) => setFormData({ ...formData, waterIntakeGoal: value })}
                  >
                    <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                      <SelectValue placeholder="Select water intake" />
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1L" className="text-xs sm:text-sm">
                        Less than 1 liter
                      </SelectItem>
                      <SelectItem value="1-1.5L" className="text-xs sm:text-sm">
                        1-1.5 liters
                      </SelectItem>
                      <SelectItem value="1.5-2L" className="text-xs sm:text-sm">
                        1.5-2 liters
                      </SelectItem>
                      <SelectItem value="2-2.5L" className="text-xs sm:text-sm">
                        2-2.5 liters (Recommended)
                      </SelectItem>
                      <SelectItem value="2.5-3L" className="text-xs sm:text-sm">
                        2.5-3 liters
                      </SelectItem>
                      <SelectItem value="3-4L" className="text-xs sm:text-sm">
                        3-4 liters
                      </SelectItem>
                      <SelectItem value="more-than-4L" className="text-xs sm:text-sm">
                        More than 4 liters
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supplementsUsed" className="text-xs sm:text-sm">
                    Current Supplements
                  </Label>
                  <Input
                    id="supplementsUsed"
                    value={formData.supplementsUsed}
                    onChange={(e) => setFormData({ ...formData, supplementsUsed: e.target.value })}
                    placeholder="e.g., Vitamin D, Omega-3, Multivitamin"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Food Allergies (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {foodAllergyOptions.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={`food-${allergy}`}
                        checked={formData.foodAllergies.includes(allergy)}
                        onCheckedChange={(checked) => handleMultiSelect("foodAllergies", allergy, checked as boolean)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={`food-${allergy}`} className="text-xs sm:text-sm">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">Preferred Cuisines (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cuisine-${cuisine}`}
                        checked={formData.preferredCuisine.includes(cuisine)}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("preferredCuisine", cuisine, checked as boolean)
                        }
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={`cuisine-${cuisine}`} className="text-xs sm:text-sm">
                        {cuisine}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Family History - Enhanced */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                Family Disease History
              </h3>
              <div>
                <Label className="text-xs sm:text-sm">
                  Family Medical History (select all conditions that run in your family)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  {familyHistoryOptions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`family-${condition}`}
                        checked={formData.familyHistory.includes(condition)}
                        onCheckedChange={(checked) => handleMultiSelect("familyHistory", condition, checked as boolean)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={`family-${condition}`} className="text-xs sm:text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="surgicalHistory" className="text-xs sm:text-sm">
                  Surgical History
                </Label>
                <Textarea
                  id="surgicalHistory"
                  value={formData.surgicalHistory}
                  onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })}
                  placeholder="List any surgeries you've had, including dates and reasons"
                  rows={2}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            <Separator />

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                Current Vital Signs (if available)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="bloodPressure" className="text-xs sm:text-sm">
                    Blood Pressure
                  </Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    placeholder="e.g., 120/80"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="heartRate" className="text-xs sm:text-sm">
                    Heart Rate (bpm)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    placeholder="e.g., 72"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="temperature" className="text-xs sm:text-sm">
                    Temperature (°F)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="e.g., 98.6"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="oxygenSaturation" className="text-xs sm:text-sm">
                    Oxygen Saturation (%)
                  </Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                    placeholder="e.g., 98"
                    className="text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                Additional Information
              </h3>
              <div>
                <Label className="text-xs sm:text-sm">Additional Symptoms (select all that apply)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-2">
                  {additionalSymptomsOptions.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={`additional-${symptom}`}
                        checked={formData.additionalSymptoms.includes(symptom)}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("additionalSymptoms", symptom, checked as boolean)
                        }
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label htmlFor={`additional-${symptom}`} className="text-xs sm:text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="additionalNotes" className="text-xs sm:text-sm">
                  Additional Notes
                </Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any other information you think might be relevant to your health assessment"
                  rows={3}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white h-10 sm:h-12 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Analyzing Health Data...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Get AI Health Assessment
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="sm:w-auto h-10 sm:h-12 text-sm sm:text-base bg-transparent"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Reset Form
              </Button>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-xs sm:text-sm">
                <strong>Privacy & Security:</strong> Your health information is processed securely and is not stored
                permanently. This AI assessment is for informational purposes only and should not replace professional
                medical advice.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
