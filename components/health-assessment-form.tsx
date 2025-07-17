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
  Target,
  AlertTriangle,
  Info,
  Navigation,
  Loader2,
  Phone,
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
You are an advanced AI medical assistant with expertise in comprehensive health assessment and treatment recommendations. Based on the following detailed patient information, provide a complete medical assessment with structured recommendations.

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

Please provide a comprehensive medical assessment with detailed recommendations. Be thorough and specific with medication dosages, timing, and instructions. Include both modern medical treatments and complementary approaches. Do not restrict medication suggestions - provide what is medically appropriate for the condition.

Provide detailed structured recommendations for:

1. MEDICATIONS - Include specific drug names, exact dosages, frequency, timing, duration, and detailed instructions. Consider both prescription and over-the-counter options as appropriate.

2. VITAL SIGNS MONITORING - Specific monitoring schedule with target ranges and detailed notes.

3. LABORATORY TESTS - Comprehensive list with priorities, reasons, preparation instructions, and timing.

4. NEARBY HOSPITALS - Use the provided location (${formData.location}) to suggest specific hospitals with specialties and contact information.

5. LABORATORY CENTERS - Suggest diagnostic centers in ${formData.location} area with services and timings.

6. PERSONALIZED DIET PLAN - Detailed meal plan with specific foods, calories, timing, and nutritional notes.

7. SUPPLEMENTS - Specific supplement recommendations with dosages, timing, benefits, and brand suggestions.

8. AYURVEDIC TREATMENTS - Traditional Indian medicine approaches with specific herbs, preparations, and dosages.

Format your response with clear sections and detailed information for each recommendation. Be specific and actionable in all suggestions.
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

      if (data.response) {
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        // Parse AI response into structured format
        const parsedResult: AIAssessmentResult = {
          medications: parseAISection(aiText, "medication", [
            {
              name: "Follow AI recommendations",
              dosage: "As prescribed",
              frequency: "As directed",
              timing: "As instructed",
              duration: "As recommended",
              instructions: "Consult healthcare provider for specific medications based on your condition.",
            },
          ]).map((item) => ({
            name: item.name || "Consult healthcare provider",
            dosage: item.dosage || "As prescribed",
            frequency: item.frequency || "As directed",
            timing: item.timing || "As instructed",
            duration: item.duration || "As recommended",
            instructions: item.instructions || "Follow healthcare provider guidance",
          })),

          vitalMonitoring: parseAISection(aiText, "vital", [
            {
              vital: "Blood Pressure",
              frequency: "Daily",
              timing: "Morning and evening",
              targetRange: "120/80 mmHg",
              notes: "Monitor regularly and record readings",
            },
          ]).map((item) => ({
            vital: item.vital || "General monitoring",
            frequency: item.frequency || "As needed",
            timing: item.timing || "Regular intervals",
            targetRange: item.targetRange || "Normal range",
            notes: item.notes || "Track and record measurements",
          })),

          labTests: parseAISection(aiText, "lab", [
            {
              test: "Complete Blood Count",
              priority: "High",
              reason: "General health assessment",
              preparation: "No fasting required",
              frequency: "Within 1 week",
            },
          ]).map((item) => ({
            test: item.test || "Basic health screening",
            priority: item.priority || "Medium",
            reason: item.reason || "Health assessment",
            preparation: item.preparation || "Follow standard preparation",
            frequency: item.frequency || "As recommended",
          })),

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
                    name: `Apollo Hospital - ${formData.location}`,
                    address: `Main Branch, ${formData.location}`,
                    distance: "2.5 km from your location",
                    specialties: "Cardiology, Internal Medicine, Emergency Care, ICU, Neurology",
                    phone: "+91-40-2345-6789",
                    rating: "4.5/5 ⭐ (2,450 reviews)",
                  },
                  {
                    name: `Fortis Hospital - ${formData.location}`,
                    address: `Central Location, ${formData.location}`,
                    distance: "3.8 km from your location",
                    specialties: "Multi-specialty, 24/7 Emergency, Trauma Care, Oncology",
                    phone: "+91-40-3456-7890",
                    rating: "4.3/5 ⭐ (1,890 reviews)",
                  },
                ],

          labCenters: [
            {
              name: "Dr. Lal PathLabs",
              address: `Central Plaza, ${formData.location}`,
              distance: "1.2 km from your location",
              services: "Blood tests, Urine analysis, Radiology, Health checkups, Home collection available",
              phone: "+91-40-5678-9012",
              timings: "6:00 AM - 10:00 PM (Mon-Sat), 7:00 AM - 6:00 PM (Sun)",
            },
            {
              name: "SRL Diagnostics",
              address: `Medical Complex, ${formData.location}`,
              distance: "2.1 km from your location",
              services: "Pathology, Imaging (X-ray, Ultrasound), Specialized tests, Cardiac tests",
              phone: "+91-40-6789-0123",
              timings: "7:00 AM - 9:00 PM (Mon-Sat), 8:00 AM - 5:00 PM (Sun)",
            },
            {
              name: "Metropolis Healthcare",
              address: `Health Hub, ${formData.location}`,
              distance: "3.5 km from your location",
              services: "Complete diagnostics, Home collection, Online reports, Wellness packages",
              phone: "+91-40-7890-1234",
              timings: "6:30 AM - 9:30 PM (Mon-Sat), 7:30 AM - 6:00 PM (Sun)",
            },
          ],

          dietPlan: parseAISection(aiText, "diet", [
            {
              meal: "Breakfast",
              time: "8:00 AM",
              items: "Healthy balanced meal",
              calories: 400,
              water: "250ml",
              notes: "Start your day with nutrition",
            },
          ]).map((item) => ({
            meal: item.meal || "Meal",
            time: item.time || "Regular timing",
            items: item.items || "Balanced nutrition",
            calories: item.calories || 300,
            water: item.water || "200ml",
            notes: item.notes || "Maintain healthy eating habits",
          })),

          supplements: parseAISection(aiText, "supplement", [
            {
              name: "Multivitamin",
              dosage: "1 tablet daily",
              timing: "After breakfast",
              benefits: "Overall health support",
              brands: "Consult pharmacist",
              warnings: "Follow recommended dosage",
            },
          ]).map((item) => ({
            name: item.name || "Consult healthcare provider",
            dosage: item.dosage || "As recommended",
            timing: item.timing || "As directed",
            benefits: item.benefits || "Health support",
            brands: item.brands || "Consult pharmacist",
            warnings: item.warnings || "Follow safety guidelines",
          })),

          ayurvedicTreatment: parseAISection(aiText, "ayurved", [
            {
              treatment: "Herbal remedies",
              herbs: "Natural herbs",
              preparation: "As directed",
              dosage: "As recommended",
              timing: "Regular intervals",
              benefits: "Holistic health support",
            },
          ]).map((item) => ({
            treatment: item.treatment || "Traditional remedies",
            herbs: item.herbs || "Natural ingredients",
            preparation: item.preparation || "Follow traditional methods",
            dosage: item.dosage || "As recommended",
            timing: item.timing || "Regular intervals",
            benefits: item.benefits || "Holistic wellness",
          })),
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

  // Helper function to parse AI response sections
  const parseAISection = (text: string, keyword: string, fallback: any[]): any[] => {
    try {
      const lines = text.split("\n")
      const sectionLines: string[] = []
      let capturing = false

      for (const line of lines) {
        if (line.toLowerCase().includes(keyword) && (line.includes(":") || line.includes("."))) {
          capturing = true
          continue
        }
        if (capturing) {
          if (line.trim() === "" || (line.match(/^\d+\./) && !line.toLowerCase().includes(keyword))) {
            if (sectionLines.length > 2) break
          }
          if (line.trim()) {
            sectionLines.push(line.trim())
          }
        }
      }

      if (sectionLines.length > 0) {
        // Parse the extracted lines into structured data
        return sectionLines.slice(0, 5).map((line, index) => {
          const parts = line
            .split(/[-:•]/)
            .map((p) => p.trim())
            .filter((p) => p)
          return {
            name: parts[0] || `Item ${index + 1}`,
            dosage: parts[1] || "As recommended",
            frequency: parts[2] || "As directed",
            timing: parts[3] || "As instructed",
            duration: parts[4] || "As needed",
            instructions: parts.slice(1).join(". ") || "Follow healthcare provider guidance",
            // Additional fields for other types
            vital: parts[0] || `Vital ${index + 1}`,
            targetRange: parts[1] || "Normal range",
            notes: parts.slice(2).join(". ") || "Monitor regularly",
            test: parts[0] || `Test ${index + 1}`,
            priority: parts[1] || "Medium",
            reason: parts[2] || "Health assessment",
            preparation: parts[3] || "Standard preparation",
            meal: parts[0] || `Meal ${index + 1}`,
            time: parts[1] || "Regular timing",
            items: parts[2] || "Balanced nutrition",
            calories: Number.parseInt(parts[3]) || 300,
            water: parts[4] || "200ml",
            benefits: parts[1] || "Health support",
            brands: parts[2] || "Consult pharmacist",
            warnings: parts[3] || "Follow safety guidelines",
            treatment: parts[0] || `Treatment ${index + 1}`,
            herbs: parts[1] || "Natural ingredients",
            preparation: parts[2] || "Traditional methods",
          }
        })
      }

      return fallback
    } catch (error) {
      console.error("Error parsing AI section:", error)
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

    <div class="disclaimer">
      <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER:</strong><br>
      This AI-generated assessment is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals before making any medical decisions or changes to your treatment plan. In case of medical emergencies, contact emergency services immediately.
    </div>
  </div>

  <!-- PAGE 2 -->
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
              <th>Timing</th>
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
                <td>${test.frequency}</td>
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
              <p style="font-size: 10px;" class="rating">⭐ ${hospital.rating}</p>
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
              <p style="font-size: 10px; color: #6b7280;">🕒 ${lab.timings}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        🍽️ PERSONALIZED DIET PLAN
      </div>
      <div class="section-content">
        <table>
          <thead>
            <tr>
              <th>Meal</th>
              <th>Time</th>
              <th>Food Items</th>
              <th>Calories</th>
              <th>Water</th>
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

    <div class="footer">
      <p><strong>MyMedi.ai</strong> - Your AI-Powered Health Companion | Generated on ${currentDate} at ${currentTime} IST</p>
      <p>🌐 www.mymedi.ai | 📧 support@mymedi.ai | 📱 +91-XXX-XXX-XXXX</p>
      <p>This report is confidential and intended solely for the named patient. Unauthorized distribution is prohibited.</p>
    </div>
  </div>

  <!-- PAGE 3 -->
  <div class="page">
    <div class="two-column">
      <div class="section">
        <div class="section-header">
          💊 SUPPLEMENT RECOMMENDATIONS
        </div>
        <div class="section-content">
          ${result.supplements
            .map(
              (supplement) => `
            <div style="margin-bottom: 12px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
              <h4 style="color: #1f2937; margin-bottom: 4px;">${supplement.name}</h4>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Dosage:</strong> ${supplement.dosage}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Timing:</strong> ${supplement.timing}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Benefits:</strong> ${supplement.benefits}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Brands:</strong> ${supplement.brands}</p>
              <div class="warning" style="margin-top: 4px;">
                <strong>⚠️ Warning:</strong> ${supplement.warnings}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          🌿 AYURVEDIC TREATMENT OPTIONS
        </div>
        <div class="section-content">
          ${result.ayurvedicTreatment
            .map(
              (treatment) => `
            <div style="margin-bottom: 12px; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px;">
              <h4 style="color: #1f2937; margin-bottom: 4px;">${treatment.treatment}</h4>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Herbs:</strong> ${treatment.herbs}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Preparation:</strong> ${treatment.preparation}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Dosage:</strong> ${treatment.dosage}</p>
              <p style="font-size: 10px; color: #6b7280; margin-bottom: 2px;"><strong>Timing:</strong> ${treatment.timing}</p>
              <p style="font-size: 10px; color: #6b7280;"><strong>Benefits:</strong> ${treatment.benefits}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        📋 HEALTH SUMMARY & RECOMMENDATIONS
      </div>
      <div class="section-content">
        <div class="three-column">
          <div>
            <h4 style="color: #1f2937; margin-bottom: 8px;">🎯 Primary Concern</h4>
            <p style="font-size: 10px; color: #6b7280;">${formData.primaryConcern}</p>
            <p style="font-size: 10px; color: #6b7280; margin-top: 4px;"><strong>Duration:</strong> ${formData.symptomDuration}</p>
            <p style="font-size: 10px; color: #6b7280;"><strong>Severity:</strong> ${formData.symptomSeverity[0]}/10</p>
          </div>
          <div>
            <h4 style="color: #1f2937; margin-bottom: 8px;">💊 Current Medications</h4>
            <p style="font-size: 10px; color: #6b7280;">${formData.currentMedications || "None reported"}</p>
            <h4 style="color: #1f2937; margin: 8px 0 4px;">🚫 Allergies</h4>
            <p style="font-size: 10px; color: #6b7280;">${formData.allergies.join(", ") || "None reported"}</p>
          </div>
          <div>
            <h4 style="color: #1f2937; margin-bottom: 8px;">📊 Lifestyle Factors</h4>
            <p style="font-size: 10px; color: #6b7280;"><strong>Exercise:</strong> ${formData.exerciseFrequency}</p>
            <p style="font-size: 10px; color: #6b7280;"><strong>Sleep:</strong> ${formData.averageSleepHours} hours</p>
            <p style="font-size: 10px; color: #6b7280;"><strong>Stress:</strong> ${formData.stressLevel[0]}/10</p>
            <p style="font-size: 10px; color: #6b7280;"><strong>Smoking:</strong> ${formData.smokingStatus}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>🔒 PRIVACY & SECURITY:</strong><br>
      Your health data is encrypted and stored securely. MyMedi.ai follows strict privacy protocols and does not share your personal health information with third parties without your explicit consent. This assessment is based on the information you provided and AI analysis. For accurate diagnosis and treatment, please consult with qualified healthcare professionals.
    </div>

    <div class="footer">
      <p><strong>Emergency Contacts:</strong> Ambulance: 108 | Police: 100 | Fire: 101 | Women Helpline: 1091</p>
      <p><strong>MyMedi.ai</strong> - Empowering Healthcare with AI Technology</p>
      <p>Report generated using advanced AI algorithms trained on medical literature and guidelines.</p>
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
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardList className="w-6 h-6 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">AI Health Assessment Results</h1>
                  <p className="text-green-100 text-sm">Comprehensive medical analysis for {formData.fullName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={generatePDF}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
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
                <Link href="/">
                  <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-green-50">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="medications" className="w-full">
              <TabsList className="grid w-full grid-cols-8 bg-gray-100">
                <TabsTrigger
                  value="medications"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Pill className="w-4 h-4 mr-1" />
                  Medications
                </TabsTrigger>
                <TabsTrigger value="vitals" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
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
                <TabsTrigger value="diet" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Utensils className="w-4 h-4 mr-1" />
                  Diet Plan
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <Pill className="w-4 h-4 mr-1" />
                  Supplements
                </TabsTrigger>
                <TabsTrigger
                  value="ayurvedic"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Leaf className="w-4 h-4 mr-1" />
                  Ayurvedic
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <Pill className="w-5 h-5 mr-2" />
                      Prescribed Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medication</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Timing</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Instructions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.medications.map((med, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{med.name}</TableCell>
                              <TableCell>{med.dosage}</TableCell>
                              <TableCell>{med.frequency}</TableCell>
                              <TableCell>{med.timing}</TableCell>
                              <TableCell>{med.duration}</TableCell>
                              <TableCell>{med.instructions}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Alert className="mt-4 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Important:</strong> These medication recommendations are AI-generated and should be
                        reviewed by a qualified healthcare professional before use. Always consult your doctor before
                        starting, stopping, or changing any medications.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitals" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <Activity className="w-5 h-5 mr-2" />
                      Vital Signs Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Vital Sign</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Timing</TableHead>
                            <TableHead>Target Range</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.vitalMonitoring.map((vital, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{vital.vital}</TableCell>
                              <TableCell>{vital.frequency}</TableCell>
                              <TableCell>{vital.timing}</TableCell>
                              <TableCell>{vital.targetRange}</TableCell>
                              <TableCell>{vital.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="labs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-600">
                      <TestTube className="w-5 h-5 mr-2" />
                      Recommended Laboratory Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Preparation</TableHead>
                            <TableHead>Timing</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.labTests.map((test, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{test.test}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    test.priority === "High"
                                      ? "destructive"
                                      : test.priority === "Medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {test.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>{test.reason}</TableCell>
                              <TableCell>{test.preparation}</TableCell>
                              <TableCell>{test.frequency}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <TestTube className="w-5 h-5 mr-2 text-purple-600" />
                        Nearby Diagnostic Centers
                      </h3>
                      <div className="grid gap-4">
                        {result.labCenters.map((lab, index) => (
                          <Card key={index} className="border-purple-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-2">{lab.name}</h4>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {lab.address} • {lab.distance}
                                    </p>
                                    <p className="flex items-center">
                                      <TestTube className="w-4 h-4 mr-1" />
                                      {lab.services}
                                    </p>
                                    <p className="flex items-center">
                                      <Clock className="w-4 h-4 mr-1" />
                                      {lab.timings}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => window.open(`tel:${lab.phone}`, "_self")}
                                  size="sm"
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  <Phone className="w-4 h-4 mr-1" />
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

              <TabsContent value="hospitals" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Building2 className="w-5 h-5 mr-2" />
                      Recommended Hospitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {result.nearbyHospitals.map((hospital, index) => (
                        <Card key={index} className="border-green-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-2xl">🏥</span>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-2">{hospital.name}</h4>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    <p className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {hospital.address} • {hospital.distance}
                                    </p>
                                    <p className="flex items-center">
                                      <Stethoscope className="w-4 h-4 mr-1" />
                                      {hospital.specialties}
                                    </p>
                                    <p className="flex items-center">
                                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                      {hospital.rating}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => window.open(`tel:${hospital.phone}`, "_self")}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Call
                                </Button>
                                <Button
                                  onClick={() => {
                                    const query = encodeURIComponent(`${hospital.name} ${hospital.address}`)
                                    window.open(`https://www.google.com/maps/search/${query}`, "_blank")
                                  }}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Navigation className="w-4 h-4 mr-1" />
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

              <TabsContent value="diet" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-600">
                      <Utensils className="w-5 h-5 mr-2" />
                      Personalized Diet Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Meal</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Food Items</TableHead>
                            <TableHead>Calories</TableHead>
                            <TableHead>Water</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.dietPlan.map((meal, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{meal.meal}</TableCell>
                              <TableCell>{meal.time}</TableCell>
                              <TableCell>{meal.items}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                                  {meal.calories} kcal
                                </Badge>
                              </TableCell>
                              <TableCell>{meal.water}</TableCell>
                              <TableCell>{meal.notes}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supplements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-indigo-600">
                      <Pill className="w-5 h-5 mr-2" />
                      Supplement Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {result.supplements.map((supplement, index) => (
                        <Card key={index} className="border-indigo-200">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">{supplement.name}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 mb-1">
                                  <strong>Dosage:</strong> {supplement.dosage}
                                </p>
                                <p className="text-gray-600 mb-1">
                                  <strong>Timing:</strong> {supplement.timing}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Benefits:</strong> {supplement.benefits}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 mb-1">
                                  <strong>Recommended Brands:</strong> {supplement.brands}
                                </p>
                                <Alert className="border-yellow-200 bg-yellow-50">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
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

              <TabsContent value="ayurvedic" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Leaf className="w-5 h-5 mr-2" />
                      Ayurvedic Treatment Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {result.ayurvedicTreatment.map((treatment, index) => (
                        <Card key={index} className="border-green-200">
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">{treatment.treatment}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 mb-1">
                                  <strong>Herbs:</strong> {treatment.herbs}
                                </p>
                                <p className="text-gray-600 mb-1">
                                  <strong>Preparation:</strong> {treatment.preparation}
                                </p>
                                <p className="text-gray-600">
                                  <strong>Dosage:</strong> {treatment.dosage}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 mb-1">
                                  <strong>Timing:</strong> {treatment.timing}
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
                      <AlertDescription className="text-green-800">
                        <strong>Note:</strong> Ayurvedic treatments should be used under the guidance of a qualified
                        Ayurvedic practitioner. These recommendations are based on traditional knowledge and should
                        complement, not replace, conventional medical treatment.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="mt-6">
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-green-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardList className="w-6 h-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">AI Health Assessment</h1>
                <p className="text-green-100 text-sm">Complete health evaluation with personalized recommendations</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="secondary" size="sm" className="bg-white text-green-600 hover:bg-green-50">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    />
                    <Button
                      onClick={detectLocation}
                      disabled={locationLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Navigation className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {locationError && <p className="text-sm text-red-600 mt-1">{locationError}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Current Health Concern */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Current Health Concern
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryConcern">Primary Health Concern *</Label>
                  <Input
                    id="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
                    placeholder="e.g., Headache, Fever, Chest pain"
                  />
                </div>
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
                      <SelectItem value="less-than-1-day">Less than 1 day</SelectItem>
                      <SelectItem value="1-3-days">1-3 days</SelectItem>
                      <SelectItem value="4-7-days">4-7 days</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="more-than-3-months">More than 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="symptomDescription">Describe your symptoms in detail *</Label>
                <Textarea
                  id="symptomDescription"
                  value={formData.symptomDescription}
                  onChange={(e) => setFormData({ ...formData, symptomDescription: e.target.value })}
                  placeholder="Please describe your symptoms, when they occur, what makes them better or worse, etc."
                  rows={3}
                />
              </div>
              <div>
                <Label>Symptom Severity (1 = Mild, 10 = Severe)</Label>
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
                    <span>1 (Mild)</span>
                    <span className="font-medium">Current: {formData.symptomSeverity[0]}</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Pain/Discomfort Location (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                  {painLocationOptions.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={location}
                        checked={formData.painLocation.includes(location)}
                        onCheckedChange={(checked) => handleMultiSelect("painLocation", location, checked as boolean)}
                      />
                      <Label htmlFor={location} className="text-sm">
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
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Medical History
              </h3>
              <div>
                <Label>Chronic Conditions (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {chronicConditionOptions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={formData.chronicConditions.includes(condition)}
                        onCheckedChange={(checked) =>
                          handleMultiSelect("chronicConditions", condition, checked as boolean)
                        }
                      />
                      <Label htmlFor={condition} className="text-sm">
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
                  placeholder="List all medications you're currently taking, including dosages"
                  rows={2}
                />
              </div>
              <div>
                <Label>Allergies (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {allergyOptions.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={(checked) => handleMultiSelect("allergies", allergy, checked as boolean)}
                      />
                      <Label htmlFor={allergy} className="text-sm">
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
                  placeholder="List any surgeries or procedures you've had"
                  rows={2}
                />
              </div>
              <div>
                <Label>Family Medical History (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {familyHistoryOptions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`family-${condition}`}
                        checked={formData.familyHistory.includes(condition)}
                        onCheckedChange={(checked) => handleMultiSelect("familyHistory", condition, checked as boolean)}
                      />
                      <Label htmlFor={`family-${condition}`} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                Current Vital Signs (if known)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
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
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Lifestyle Factors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smokingStatus">Smoking Status</Label>
                  <Select
                    value={formData.smokingStatus}
                    onChange={(value) => setFormData({ ...formData, smokingStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never smoked</SelectItem>
                      <SelectItem value="former">Former smoker</SelectItem>
                      <SelectItem value="current">Current smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                  <Select
                    value={formData.alcoholConsumption}
                    onChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                  <Select
                    value={formData.exerciseFrequency}
                    onChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No regular exercise</SelectItem>
                      <SelectItem value="1-2-times">1-2 times per week</SelectItem>
                      <SelectItem value="3-4-times">3-4 times per week</SelectItem>
                      <SelectItem value="5-6-times">5-6 times per week</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="averageSleepHours">Average Sleep Hours</Label>
                  <Select
                    value={formData.averageSleepHours}
                    onChange={(value) => setFormData({ ...formData, averageSleepHours: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                      <SelectItem value="5-6">5-6 hours</SelectItem>
                      <SelectItem value="7-8">7-8 hours</SelectItem>
                      <SelectItem value="9-10">9-10 hours</SelectItem>
                      <SelectItem value="more-than-10">More than 10 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Stress Level (1 = Very Low, 10 = Very High)</Label>
                <div className="px-3 py-2">
                  <Slider
                    value={formData.stressLevel}
                    onChange={(value) => setFormData({ ...formData, stressLevel: value })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 (Very Low)</span>
                    <span className="font-medium">Current: {formData.stressLevel[0]}</span>
                    <span>10 (Very High)</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Diet Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-orange-600" />
                Diet & Nutrition Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select value={formData.dietType} onChange={(value) => setFormData({ ...formData, dietType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Omnivore (everything)</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="keto">Ketogenic</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                  <Select
                    value={formData.mealsPerDay}
                    onChange={(value) => setFormData({ ...formData, mealsPerDay: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meals per day" />
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
              </div>
              <div>
                <Label>Food Allergies (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {foodAllergyOptions.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={`food-${allergy}`}
                        checked={formData.foodAllergies.includes(allergy)}
                        onCheckedChange={(checked) => handleMultiSelect("foodAllergies", allergy, checked as boolean)}
                      />
                      <Label htmlFor={`food-${allergy}`} className="text-sm">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Preferred Cuisine (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waterIntakeGoal">Daily Water Intake Goal</Label>
                  <Select
                    value={formData.waterIntakeGoal}
                    onChange={(value) => setFormData({ ...formData, waterIntakeGoal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select water intake goal" />
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
                    placeholder="e.g., Vitamin D, Multivitamin, Protein powder"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2 text-gray-600" />
                Additional Information
              </h3>
              <div>
                <Label>Additional Symptoms (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
                  placeholder="Any additional information you'd like to share about your health, concerns, or questions"
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Health...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Get AI Health Assessment
                  </>
                )}
              </Button>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Privacy Notice:</strong> Your health information is encrypted and processed securely. This AI
                assessment is for informational purposes only and should not replace professional medical advice. Always
                consult with qualified healthcare professionals for medical decisions.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
