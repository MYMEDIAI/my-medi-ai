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
  Award,
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
  Calendar,
  Phone,
  Star,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
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
import AIHealthChat from "./ai-health-chat"

interface AssessmentData {
  // Personal Information
  fullName: string
  age: string
  gender: string
  height: string
  weight: string
  location: string

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

Please provide a comprehensive assessment with the following structured format. Ensure all recommendations are evidence-based and appropriate for the patient's condition, location (${formData.location}), and preferences.

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

      // Simulate comprehensive AI response with structured data
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
        nearbyHospitals: [
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
          {
            name: "Max Super Speciality Hospital",
            address: `Saket Medical District, ${formData.location} - 110017`,
            distance: "5.2 km from your location",
            specialties: "Internal Medicine, Diagnostics, Gastroenterology, Pulmonology",
            phone: "+91-40-4567-8901",
            rating: "4.2/5 ⭐ (1,650 reviews)",
          },
          {
            name: "Manipal Hospital Whitefield",
            address: `ITPL Main Road, ${formData.location} - 560066`,
            distance: "6.1 km from your location",
            specialties: "Emergency Medicine, Critical Care, Nephrology, Endocrinology",
            phone: "+91-40-5678-9012",
            rating: "4.4/5 ⭐ (2,100 reviews)",
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
                  <p className="text-red-100 text-sm">Take medications exactly as prescribed. Do not skip doses.</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-red-50">
                        <TableHead className="text-red-700 font-semibold">
                          <Pill className="w-4 h-4 inline mr-1" />
                          Medication
                        </TableHead>
                        <TableHead className="text-red-700 font-semibold">
                          <Target className="w-4 h-4 inline mr-1" />
                          Dosage
                        </TableHead>
                        <TableHead className="text-red-700 font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Frequency
                        </TableHead>
                        <TableHead className="text-red-700 font-semibold">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Timing
                        </TableHead>
                        <TableHead className="text-red-700 font-semibold">Duration</TableHead>
                        <TableHead className="text-red-700 font-semibold">
                          <Info className="w-4 h-4 inline mr-1" />
                          Instructions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.medications.map((med, index) => (
                        <TableRow key={index} className="hover:bg-red-25">
                          <TableCell className="font-medium text-red-800">{med.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
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
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Vital Signs Monitoring Schedule
                  </h3>
                  <p className="text-blue-100 text-sm">Regular monitoring helps track your health progress</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50">
                        <TableHead className="text-blue-700 font-semibold">
                          <Heart className="w-4 h-4 inline mr-1" />
                          Vital Sign
                        </TableHead>
                        <TableHead className="text-blue-700 font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Frequency
                        </TableHead>
                        <TableHead className="text-blue-700 font-semibold">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Timing
                        </TableHead>
                        <TableHead className="text-blue-700 font-semibold">
                          <Target className="w-4 h-4 inline mr-1" />
                          Target Range
                        </TableHead>
                        <TableHead className="text-blue-700 font-semibold">
                          <Info className="w-4 h-4 inline mr-1" />
                          Notes
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.vitalMonitoring.map((vital, index) => (
                        <TableRow key={index} className="hover:bg-blue-25">
                          <TableCell className="font-medium text-blue-800">{vital.vital}</TableCell>
                          <TableCell>{vital.frequency}</TableCell>
                          <TableCell>{vital.timing}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                              {vital.targetRange}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{vital.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="labs" className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Recommended Laboratory Tests
                  </h3>
                  <p className="text-purple-100 text-sm">Essential tests to diagnose and monitor your condition</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-purple-50">
                        <TableHead className="text-purple-700 font-semibold">
                          <TestTube className="w-4 h-4 inline mr-1" />
                          Test Name
                        </TableHead>
                        <TableHead className="text-purple-700 font-semibold">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          Priority
                        </TableHead>
                        <TableHead className="text-purple-700 font-semibold">
                          <Info className="w-4 h-4 inline mr-1" />
                          Reason
                        </TableHead>
                        <TableHead className="text-purple-700 font-semibold">Preparation</TableHead>
                        <TableHead className="text-purple-700 font-semibold">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Timeline
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.labTests.map((test, index) => (
                        <TableRow key={index} className="hover:bg-purple-25">
                          <TableCell className="font-medium text-purple-800">{test.test}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                test.priority === "High"
                                  ? "destructive"
                                  : test.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className={
                                test.priority === "High"
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : test.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                    : "bg-green-100 text-green-700 border-green-300"
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
              </TabsContent>

              <TabsContent value="hospitals" className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Nearby Hospitals in {formData.location}
                  </h3>
                  <p className="text-green-100 text-sm">Quality healthcare facilities near your location</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="text-green-700 font-semibold">
                          <Building2 className="w-4 h-4 inline mr-1" />
                          Hospital Name
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Address
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">Distance</TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <Stethoscope className="w-4 h-4 inline mr-1" />
                          Specialties
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <Star className="w-4 h-4 inline mr-1" />
                          Rating
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.nearbyHospitals.map((hospital, index) => (
                        <TableRow key={index} className="hover:bg-green-25">
                          <TableCell className="font-medium text-green-800">{hospital.name}</TableCell>
                          <TableCell>{hospital.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                              {hospital.distance}
                            </Badge>
                          </TableCell>
                          <TableCell>{hospital.specialties}</TableCell>
                          <TableCell>{hospital.phone}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              {hospital.rating}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="labcenters" className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Laboratory Centers in {formData.location}
                  </h3>
                  <p className="text-indigo-100 text-sm">Trusted diagnostic centers for your lab tests</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-indigo-50">
                        <TableHead className="text-indigo-700 font-semibold">
                          <TestTube className="w-4 h-4 inline mr-1" />
                          Lab Name
                        </TableHead>
                        <TableHead className="text-indigo-700 font-semibold">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Address
                        </TableHead>
                        <TableHead className="text-indigo-700 font-semibold">Distance</TableHead>
                        <TableHead className="text-indigo-700 font-semibold">
                          <Stethoscope className="w-4 h-4 inline mr-1" />
                          Services
                        </TableHead>
                        <TableHead className="text-indigo-700 font-semibold">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Phone
                        </TableHead>
                        <TableHead className="text-indigo-700 font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Timings
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.labCenters.map((lab, index) => (
                        <TableRow key={index} className="hover:bg-indigo-25">
                          <TableCell className="font-medium text-indigo-800">{lab.name}</TableCell>
                          <TableCell>{lab.address}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
                              {lab.distance}
                            </Badge>
                          </TableCell>
                          <TableCell>{lab.services}</TableCell>
                          <TableCell>{lab.phone}</TableCell>
                          <TableCell>{lab.timings}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="diet" className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Personalized Diet Plan
                  </h3>
                  <div className="text-orange-100 text-sm mt-2 grid grid-cols-3 gap-4">
                    <div>
                      <strong>Total Daily Calories:</strong>{" "}
                      {result.dietPlan.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                    </div>
                    <div>
                      <strong>Total Water Intake:</strong> 2.5-3 liters
                    </div>
                    <div>
                      <strong>Diet Type:</strong> {formData.dietType || "Balanced"}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead className="text-orange-700 font-semibold">
                          <Utensils className="w-4 h-4 inline mr-1" />
                          Meal
                        </TableHead>
                        <TableHead className="text-orange-700 font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Time
                        </TableHead>
                        <TableHead className="text-orange-700 font-semibold">Food Items</TableHead>
                        <TableHead className="text-orange-700 font-semibold">Calories</TableHead>
                        <TableHead className="text-orange-700 font-semibold">
                          <Droplets className="w-4 h-4 inline mr-1" />
                          Water Intake
                        </TableHead>
                        <TableHead className="text-orange-700 font-semibold">
                          <Info className="w-4 h-4 inline mr-1" />
                          Notes
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.dietPlan.map((meal, index) => (
                        <TableRow key={index} className="hover:bg-orange-25">
                          <TableCell className="font-medium text-orange-800">{meal.meal}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                              {meal.time}
                            </Badge>
                          </TableCell>
                          <TableCell>{meal.items}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                              {meal.calories} kcal
                            </Badge>
                          </TableCell>
                          <TableCell>{meal.water}</TableCell>
                          <TableCell className="text-sm">{meal.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="supplements" className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Recommended Supplements
                  </h3>
                  <p className="text-yellow-100 text-sm">Evidence-based supplements to support your health</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-yellow-50">
                        <TableHead className="text-yellow-700 font-semibold">
                          <Pill className="w-4 h-4 inline mr-1" />
                          Supplement
                        </TableHead>
                        <TableHead className="text-yellow-700 font-semibold">
                          <Target className="w-4 h-4 inline mr-1" />
                          Dosage
                        </TableHead>
                        <TableHead className="text-yellow-700 font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Timing
                        </TableHead>
                        <TableHead className="text-yellow-700 font-semibold">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Benefits
                        </TableHead>
                        <TableHead className="text-yellow-700 font-semibold">Recommended Brands</TableHead>
                        <TableHead className="text-yellow-700 font-semibold">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          Warnings
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.supplements.map((supp, index) => (
                        <TableRow key={index} className="hover:bg-yellow-25">
                          <TableCell className="font-medium text-yellow-800">{supp.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                              {supp.dosage}
                            </Badge>
                          </TableCell>
                          <TableCell>{supp.timing}</TableCell>
                          <TableCell>{supp.benefits}</TableCell>
                          <TableCell className="text-sm">{supp.brands}</TableCell>
                          <TableCell className="text-sm text-red-600">{supp.warnings}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="ayurveda" className="space-y-4">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    Ayurvedic Treatment Recommendations
                  </h3>
                  <p className="text-green-100 text-sm">Traditional Indian medicine for holistic healing</p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="text-green-700 font-semibold">
                          <Leaf className="w-4 h-4 inline mr-1" />
                          Treatment
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">Herbs/Ingredients</TableHead>
                        <TableHead className="text-green-700 font-semibold">Preparation</TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <Target className="w-4 h-4 inline mr-1" />
                          Dosage
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Timing
                        </TableHead>
                        <TableHead className="text-green-700 font-semibold">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Benefits
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.ayurvedicTreatment.map((treatment, index) => (
                        <TableRow key={index} className="hover:bg-green-25">
                          <TableCell className="font-medium text-green-800">{treatment.treatment}</TableCell>
                          <TableCell>{treatment.herbs}</TableCell>
                          <TableCell>{treatment.preparation}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                              {treatment.dosage}
                            </Badge>
                          </TableCell>
                          <TableCell>{treatment.timing}</TableCell>
                          <TableCell className="text-sm">{treatment.benefits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="aichat" className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Health Assistant - Personalized for Your Assessment
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    Ask specific questions about your assessment results and get personalized advice
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <AIHealthChat />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-2">⚠️ Important Medical Disclaimer:</p>
                  <p>
                    This AI-powered assessment is for educational purposes only. Always consult with qualified
                    healthcare professionals before starting any medication, treatment, or making significant dietary
                    changes. This assessment should not replace professional medical consultation. In case of emergency,
                    contact your local emergency services immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8 justify-center">
              <Button
                onClick={generatePDF}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Professional PDF Report
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Text Report
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset & New Assessment
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Exit to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="border-blue-200 hover:shadow-2xl transition-all duration-300 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardList className="w-7 h-7 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Comprehensive Health Assessment</h2>
              <p className="text-blue-100 font-normal">AI-powered medical analysis by MyMedi.ai</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Award className="w-3 h-3 mr-1" />
              Personalized Results
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 p-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <p className="text-blue-100 text-sm">Required fields marked with *</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-1 text-blue-500" />
                Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-sm font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="mt-1 border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-1 text-blue-500" />
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="height" className="text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-1 text-green-500" />
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height in cm"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="mt-1 border-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-1 text-green-500" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="mt-1 border-green-200 focus:border-green-500"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                Location (City) *
              </Label>
              <Input
                id="location"
                placeholder="Enter your city (e.g., Hyderabad, Mumbai)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 border-red-200 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-blue-200 to-purple-200 h-1" />

        {/* Current Health Concern */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Current Health Concern
            </h3>
            <p className="text-red-100 text-sm">Tell us about your primary health issue</p>
          </div>

          <div>
            <Label htmlFor="primaryConcern" className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
              What is your main health concern today? *
            </Label>
            <Input
              id="primaryConcern"
              placeholder="e.g., Persistent headache, chest pain, fatigue"
              value={formData.primaryConcern}
              onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
              className="mt-1 border-red-200 focus:border-red-500"
            />
          </div>

          <div>
            <Label htmlFor="symptomDescription" className="text-sm font-medium flex items-center">
              <Info className="w-4 h-4 mr-1 text-red-500" />
              Describe your symptoms in detail *
            </Label>
            <Textarea
              id="symptomDescription"
              placeholder="Please describe your symptoms, when they occur, what makes them better or worse..."
              value={formData.symptomDescription}
              onChange={(e) => setFormData({ ...formData, symptomDescription: e.target.value })}
              className="mt-1 border-red-200 focus:border-red-500"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1 text-orange-500" />
                How long have you had these symptoms? *
              </Label>
              <Select
                value={formData.symptomDuration}
                onValueChange={(value) => setFormData({ ...formData, symptomDuration: value })}
              >
                <SelectTrigger className="mt-1 border-orange-200 focus:border-orange-500">
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

            <div>
              <Label className="text-sm font-medium flex items-center">
                <Target className="w-4 h-4 mr-1 text-purple-500" />
                Rate your symptom severity (1-10) *
              </Label>
              <div className="mt-2">
                <Slider
                  value={formData.symptomSeverity}
                  onValueChange={(value) => setFormData({ ...formData, symptomSeverity: value })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Mild</span>
                  <span>5 - Moderate</span>
                  <span>10 - Very Severe</span>
                </div>
                <p className="text-center mt-2 font-medium text-purple-600">{formData.symptomSeverity[0]}/10</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-red-500" />
              Where is your pain/discomfort located?
            </Label>
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

        <Separator className="bg-gradient-to-r from-red-200 to-orange-200 h-1" />

        {/* Medical History */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Medical History
            </h3>
            <p className="text-yellow-100 text-sm">Important context for accurate assessment</p>
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              Do you have any chronic conditions?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {chronicConditionOptions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.chronicConditions.includes(condition)}
                    onCheckedChange={(checked) => handleMultiSelect("chronicConditions", condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="currentMedications" className="text-sm font-medium flex items-center">
              <Pill className="w-4 h-4 mr-1 text-blue-500" />
              Current Medications (include dosages)
            </Label>
            <Textarea
              id="currentMedications"
              placeholder="List all medications you're currently taking, including dosages and frequency..."
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              className="mt-1 border-blue-200 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
              Do you have any known allergies?
            </Label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="surgicalHistory" className="text-sm font-medium flex items-center">
                <Stethoscope className="w-4 h-4 mr-1 text-green-500" />
                Surgical History
              </Label>
              <Textarea
                id="surgicalHistory"
                placeholder="List any surgeries or procedures you've had..."
                value={formData.surgicalHistory}
                onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })}
                className="mt-1 border-green-200 focus:border-green-500"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center">
                <Heart className="w-4 h-4 mr-1 text-purple-500" />
                Family Medical History
              </Label>
              <div className="grid grid-cols-1 gap-1 mt-2 max-h-32 overflow-y-auto">
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
        </div>

        <Separator className="bg-gradient-to-r from-yellow-200 to-green-200 h-1" />

        {/* Vital Signs */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Vital Signs
            </h3>
            <p className="text-green-100 text-sm">Optional but helpful for accurate assessment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bloodPressure" className="text-sm font-medium flex items-center">
                <Heart className="w-4 h-4 mr-1 text-red-500" />
                Blood Pressure
              </Label>
              <Input
                id="bloodPressure"
                placeholder="e.g., 120/80"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="mt-1 border-red-200 focus:border-red-500"
              />
            </div>
            <div>
              <Label htmlFor="heartRate" className="text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-1 text-blue-500" />
                Heart Rate (bpm)
              </Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="e.g., 72"
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                className="mt-1 border-blue-200 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="temperature" className="text-sm font-medium flex items-center">
                <Thermometer className="w-4 h-4 mr-1 text-orange-500" />
                Temperature (°F)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="e.g., 98.6"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="mt-1 border-orange-200 focus:border-orange-500"
              />
            </div>
            <div>
              <Label htmlFor="oxygenSaturation" className="text-sm font-medium flex items-center">
                <Droplets className="w-4 h-4 mr-1 text-cyan-500" />
                Oxygen Saturation (%)
              </Label>
              <Input
                id="oxygenSaturation"
                type="number"
                placeholder="e.g., 98"
                value={formData.oxygenSaturation}
                onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                className="mt-1 border-cyan-200 focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-green-200 to-blue-200 h-1" />

        {/* Lifestyle Factors */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Lifestyle Factors
            </h3>
            <p className="text-purple-100 text-sm">Lifestyle affects treatment recommendations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                Smoking Status
              </Label>
              <Select
                value={formData.smokingStatus}
                onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
              >
                <SelectTrigger className="mt-1 border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never-smoked">Never smoked</SelectItem>
                  <SelectItem value="former-smoker">Former smoker</SelectItem>
                  <SelectItem value="current-smoker">Current smoker</SelectItem>
                  <SelectItem value="occasional-smoker">Occasional smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center">
                <Droplets className="w-4 h-4 mr-1 text-yellow-500" />
                Alcohol Consumption
              </Label>
              <Select
                value={formData.alcoholConsumption}
                onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
              >
                <SelectTrigger className="mt-1 border-yellow-200 focus:border-yellow-500">
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
              <Label className="text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-1 text-green-500" />
                Exercise Frequency
              </Label>
              <Select
                value={formData.exerciseFrequency}
                onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
              >
                <SelectTrigger className="mt-1 border-green-200 focus:border-green-500">
                  <SelectValue placeholder="Select exercise frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-regular-exercise">No regular exercise</SelectItem>
                  <SelectItem value="1-2-times-per-week">1-2 times per week</SelectItem>
                  <SelectItem value="3-4-times-per-week">3-4 times per week</SelectItem>
                  <SelectItem value="5-plus-times-per-week">5+ times per week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="averageSleepHours" className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1 text-indigo-500" />
                Average Sleep Hours
              </Label>
              <Input
                id="averageSleepHours"
                type="number"
                placeholder="e.g., 7"
                value={formData.averageSleepHours}
                onChange={(e) => setFormData({ ...formData, averageSleepHours: e.target.value })}
                className="mt-1 border-indigo-200 focus:border-indigo-500"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                Stress Level (1-10)
              </Label>
              <div className="mt-2">
                <Slider
                  value={formData.stressLevel}
                  onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Low</span>
                  <span>5 - Moderate</span>
                  <span>10 - Very High</span>
                </div>
                <p className="text-center mt-2 font-medium text-red-600">{formData.stressLevel[0]}/10</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-purple-200 to-pink-200 h-1" />

        {/* Diet Preferences */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              Diet Preferences
            </h3>
            <p className="text-orange-100 text-sm">For personalized nutrition recommendations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center">
                <Utensils className="w-4 h-4 mr-1 text-green-500" />
                Diet Type
              </Label>
              <Select
                value={formData.dietType}
                onValueChange={(value) => setFormData({ ...formData, dietType: value })}
              >
                <SelectTrigger className="mt-1 border-green-200 focus:border-green-500">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="keto">Ketogenic</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                Meals Per Day
              </Label>
              <Select
                value={formData.mealsPerDay}
                onValueChange={(value) => setFormData({ ...formData, mealsPerDay: value })}
              >
                <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Select meals per day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meals</SelectItem>
                  <SelectItem value="4">4 meals</SelectItem>
                  <SelectItem value="5">5 meals</SelectItem>
                  <SelectItem value="6">6 meals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waterIntakeGoal" className="text-sm font-medium flex items-center">
                <Droplets className="w-4 h-4 mr-1 text-cyan-500" />
                Daily Water Intake Goal (liters)
              </Label>
              <Input
                id="waterIntakeGoal"
                type="number"
                step="0.5"
                placeholder="e.g., 2.5"
                value={formData.waterIntakeGoal}
                onChange={(e) => setFormData({ ...formData, waterIntakeGoal: e.target.value })}
                className="mt-1 border-cyan-200 focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
              Food Allergies/Intolerances
            </Label>
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
            <Label className="text-sm font-medium flex items-center">
              <Utensils className="w-4 h-4 mr-1 text-purple-500" />
              Preferred Cuisine Types
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {cuisineOptions.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cuisine-${cuisine}`}
                    checked={formData.preferredCuisine.includes(cuisine)}
                    onCheckedChange={(checked) => handleMultiSelect("preferredCuisine", cuisine, checked as boolean)}
                  />
                  <Label htmlFor={`cuisine-${cuisine}`} className="text-sm">
                    {cuisine}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="supplementsUsed" className="text-sm font-medium flex items-center">
              <Pill className="w-4 h-4 mr-1 text-yellow-500" />
              Current Supplements/Vitamins
            </Label>
            <Textarea
              id="supplementsUsed"
              placeholder="List any supplements, vitamins, or herbal remedies you're currently taking..."
              value={formData.supplementsUsed}
              onChange={(e) => setFormData({ ...formData, supplementsUsed: e.target.value })}
              className="mt-1 border-yellow-200 focus:border-yellow-500"
              rows={2}
            />
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-orange-200 to-red-200 h-1" />

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Additional Information
            </h3>
            <p className="text-indigo-100 text-sm">Complete the picture for better assessment</p>
          </div>

          <div>
            <Label className="text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              Are you experiencing any of these additional symptoms?
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {additionalSymptomsOptions.map((symptom) => (
                <div key={symptom} className="flex items-center space-x-2">
                  <Checkbox
                    id={`additional-${symptom}`}
                    checked={formData.additionalSymptoms.includes(symptom)}
                    onCheckedChange={(checked) => handleMultiSelect("additionalSymptoms", symptom, checked as boolean)}
                  />
                  <Label htmlFor={`additional-${symptom}`} className="text-sm">
                    {symptom}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additionalNotes" className="text-sm font-medium flex items-center">
              <FileText className="w-4 h-4 mr-1 text-blue-500" />
              Additional Notes
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any other information you'd like to share about your health concerns..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="mt-1 border-blue-200 focus:border-blue-500"
              rows={4}
            />
          </div>
        </div>

        <Separator className="bg-gradient-to-r from-indigo-200 to-purple-200 h-1" />

        {/* Privacy Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Privacy & Security
              </p>
              <p>
                Your information is secure and private. This AI assessment provides educational insights and should not
                replace professional medical advice. All data is encrypted and HIPAA compliant.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <div className="flex gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Exit to Home
              </Button>
            </Link>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !formData.fullName ||
              !formData.age ||
              !formData.gender ||
              !formData.primaryConcern ||
              !formData.symptomDescription ||
              !formData.symptomDuration ||
              !formData.location
            }
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing your health data...
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Get AI Health Assessment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
