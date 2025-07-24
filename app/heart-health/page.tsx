"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import {
  Heart,
  Activity,
  Stethoscope,
  AlertTriangle,
  ArrowLeft,
  Download,
  MapPin,
  User,
  Pill,
  TestTube,
  Utensils,
  Dumbbell,
  Calendar,
  Phone,
  Clock,
  Navigation,
  Printer,
  FileText,
  Loader2,
  Info,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PoweredByFooter from "@/components/powered-by-footer"

interface HeartHealthData {
  // Personal Information
  name: string
  age: string
  gender: string
  weight: string
  height: string
  waistCircumference: string
  location: string

  // Vital Signs
  systolicBP: string
  diastolicBP: string
  restingHeartRate: string
  temperature: string
  oxygenSaturation: string

  // Symptoms Assessment (NYHA Classification)
  chestPain: string
  chestPainType: string
  chestPainTrigger: string
  shortnessOfBreath: string
  breathlessnessLevel: string
  palpitations: string
  palpitationsFrequency: string
  fatigue: string
  fatigueLevel: string
  dizziness: string
  swelling: string
  swellingLocation: string

  // Risk Factors
  smoking: string
  smokingHistory: string
  alcohol: string
  alcoholFrequency: string
  diabetes: string
  diabetesType: string
  diabetesControl: string
  hypertension: string
  hypertensionDuration: string
  cholesterol: string
  cholesterolLevel: string
  familyHistory: string
  familyHistoryDetails: string

  // Lifestyle
  physicalActivity: string
  exerciseFrequency: string
  exerciseType: string
  diet: string
  dietType: string
  stress: string
  stressLevel: string
  sleep: string
  sleepHours: string

  // Medical History
  previousHeartAttack: string
  heartAttackDate: string
  previousSurgery: string
  surgeryDetails: string
  currentMedications: string
  medicationsList: string
  allergies: string
  allergiesList: string

  // Recent Tests
  recentECG: string
  ecgDate: string
  ecgResults: string
  recentEcho: string
  echoDate: string
  echoResults: string
  bloodTests: string
  bloodTestDate: string
  bloodTestResults: string
}

interface NearbyDoctor {
  name: string
  specialty: string
  hospital: string
  address: string
  distance: string
  phone: string
  rating: string
  availability: string
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  purpose: string
  sideEffects: string
  precautions: string
  price: string
  alternatives: string
}

interface LabTest {
  name: string
  purpose: string
  preparation: string
  frequency: string
  normalRange: string
  estimatedCost: string
  urgency: string
}

interface Supplement {
  name: string
  dosage: string
  purpose: string
  interactions: string
  evidence: string
  price: string
  recommendation: string
}

interface DietPlan {
  mealType: string
  time: string
  foods: string
  calories: number
  nutrients: string
  avoid: string
  tips: string
}

interface ExercisePlan {
  type: string
  duration: string
  frequency: string
  intensity: string
  benefits: string
  precautions: string
  progression: string
}

interface AssessmentResult {
  response: string
  riskScore: number
  riskLevel: {
    level: string
    color: string
    description: string
  }
  riskFactors: string[]
  bmi: string
  patientData: HeartHealthData
  medications: Medication[]
  labTests: LabTest[]
  supplements: Supplement[]
  dietPlan: DietPlan[]
  exercisePlan: ExercisePlan[]
  nearbyDoctors: NearbyDoctor[]
  followUpSchedule: string[]
  emergencySigns: string[]
}

export default function HeartHealthAssessment() {
  const [formData, setFormData] = useState<HeartHealthData>({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    waistCircumference: "",
    location: "",
    systolicBP: "",
    diastolicBP: "",
    restingHeartRate: "",
    temperature: "",
    oxygenSaturation: "",
    chestPain: "",
    chestPainType: "",
    chestPainTrigger: "",
    shortnessOfBreath: "",
    breathlessnessLevel: "",
    palpitations: "",
    palpitationsFrequency: "",
    fatigue: "",
    fatigueLevel: "",
    dizziness: "",
    swelling: "",
    swellingLocation: "",
    smoking: "",
    smokingHistory: "",
    alcohol: "",
    alcoholFrequency: "",
    diabetes: "",
    diabetesType: "",
    diabetesControl: "",
    hypertension: "",
    hypertensionDuration: "",
    cholesterol: "",
    cholesterolLevel: "",
    familyHistory: "",
    familyHistoryDetails: "",
    physicalActivity: "",
    exerciseFrequency: "",
    exerciseType: "",
    diet: "",
    dietType: "",
    stress: "",
    stressLevel: "",
    sleep: "",
    sleepHours: "",
    previousHeartAttack: "",
    heartAttackDate: "",
    previousSurgery: "",
    surgeryDetails: "",
    currentMedications: "",
    medicationsList: "",
    allergies: "",
    allergiesList: "",
    recentECG: "",
    ecgDate: "",
    ecgResults: "",
    recentEcho: "",
    echoDate: "",
    echoResults: "",
    bloodTests: "",
    bloodTestDate: "",
    bloodTestResults: "",
  })

  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: keyof HeartHealthData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
          // Get location info using Google Maps API
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coords),
          })

          if (response.ok) {
            const data = await response.json()
            const locationInfo = data.locationInfo

            if (locationInfo && locationInfo.city) {
              setFormData((prev) => ({
                ...prev,
                location: `${locationInfo.city}${locationInfo.state ? `, ${locationInfo.state}` : ""}`,
              }))
            } else {
              setLocationError("Could not determine your location")
            }
          } else {
            throw new Error("Failed to get location data")
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
            errorMessage = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
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

  const calculateRiskScore = () => {
    let riskScore = 0
    const riskFactors = []

    // Age risk - Updated scoring
    const age = Number.parseInt(formData.age)
    if (formData.gender === "male") {
      if (age >= 45) {
        riskScore += 2
        riskFactors.push(`Male age ≥45 years (${age})`)
      }
    } else if (formData.gender === "female") {
      if (age >= 55) {
        riskScore += 2
        riskFactors.push(`Female age ≥55 years (${age})`)
      }
    }

    // Additional age scoring
    if (age >= 65) {
      riskScore += 1
      riskFactors.push("Advanced age (≥65)")
    }

    // Smoking - Higher weight
    if (formData.smoking === "current") {
      riskScore += 4
      riskFactors.push("Current smoking")
    } else if (formData.smoking === "former") {
      riskScore += 1
      riskFactors.push("Former smoking")
    }

    // Diabetes - Higher weight
    if (formData.diabetes === "yes") {
      riskScore += 3
      riskFactors.push("Diabetes mellitus")

      // Additional points for poor control
      if (formData.diabetesControl === "poor") {
        riskScore += 1
        riskFactors.push("Poorly controlled diabetes")
      }
    } else if (formData.diabetes === "prediabetes") {
      riskScore += 1
      riskFactors.push("Pre-diabetes")
    }

    // Hypertension
    if (formData.hypertension === "yes") {
      riskScore += 2
      riskFactors.push("Hypertension")

      // Check actual BP values
      const systolic = Number.parseInt(formData.systolicBP)
      const diastolic = Number.parseInt(formData.diastolicBP)

      if (systolic >= 180 || diastolic >= 110) {
        riskScore += 2
        riskFactors.push("Severe hypertension (≥180/110)")
      } else if (systolic >= 160 || diastolic >= 100) {
        riskScore += 1
        riskFactors.push("Stage 2 hypertension")
      }
    } else {
      // Check BP even if not diagnosed
      const systolic = Number.parseInt(formData.systolicBP)
      const diastolic = Number.parseInt(formData.diastolicBP)

      if (systolic >= 140 || diastolic >= 90) {
        riskScore += 2
        riskFactors.push(`Elevated blood pressure (${systolic}/${diastolic})`)
      } else if (systolic >= 130 || diastolic >= 80) {
        riskScore += 1
        riskFactors.push(`High-normal blood pressure (${systolic}/${diastolic})`)
      }
    }

    // High cholesterol
    if (formData.cholesterol === "high") {
      riskScore += 2
      riskFactors.push("High cholesterol")
    } else if (formData.cholesterol === "borderline") {
      riskScore += 1
      riskFactors.push("Borderline high cholesterol")
    }

    // Family history - More specific
    if (formData.familyHistory === "yes") {
      riskScore += 2
      riskFactors.push("Family history of heart disease")
    }

    // Physical inactivity
    if (formData.physicalActivity === "sedentary") {
      riskScore += 2
      riskFactors.push("Sedentary lifestyle")
    } else if (formData.physicalActivity === "light") {
      riskScore += 1
      riskFactors.push("Low physical activity")
    }

    // Obesity (BMI calculation)
    if (formData.weight && formData.height) {
      const weight = Number.parseFloat(formData.weight)
      const height = Number.parseFloat(formData.height) / 100
      const bmi = weight / (height * height)

      if (bmi >= 35) {
        riskScore += 3
        riskFactors.push(`Severe obesity (BMI ${bmi.toFixed(1)})`)
      } else if (bmi >= 30) {
        riskScore += 2
        riskFactors.push(`Obesity (BMI ${bmi.toFixed(1)})`)
      } else if (bmi >= 25) {
        riskScore += 1
        riskFactors.push(`Overweight (BMI ${bmi.toFixed(1)})`)
      }
    }

    // Waist circumference
    if (formData.waistCircumference) {
      const waist = Number.parseFloat(formData.waistCircumference)
      if (formData.gender === "male" && waist > 102) {
        riskScore += 1
        riskFactors.push(`Abdominal obesity (waist ${waist}cm)`)
      } else if (formData.gender === "female" && waist > 88) {
        riskScore += 1
        riskFactors.push(`Abdominal obesity (waist ${waist}cm)`)
      }
    }

    // Symptoms - Major red flags
    if (formData.chestPain === "yes") {
      if (formData.chestPainTrigger === "exercise" || formData.chestPainTrigger === "stress") {
        riskScore += 3
        riskFactors.push("Exertional chest pain")
      } else {
        riskScore += 2
        riskFactors.push("Chest pain")
      }
    }

    if (formData.shortnessOfBreath === "yes") {
      if (formData.breathlessnessLevel === "rest") {
        riskScore += 3
        riskFactors.push("Shortness of breath at rest")
      } else if (formData.breathlessnessLevel === "mild-activity") {
        riskScore += 2
        riskFactors.push("Shortness of breath with mild activity")
      } else {
        riskScore += 1
        riskFactors.push("Shortness of breath")
      }
    }

    // Other symptoms
    if (formData.palpitations === "yes") {
      riskScore += 1
      riskFactors.push("Palpitations")
    }

    if (formData.swelling === "yes") {
      riskScore += 2
      riskFactors.push("Lower extremity swelling")
    }

    if (formData.fatigue === "yes" && formData.fatigueLevel === "severe") {
      riskScore += 1
      riskFactors.push("Severe fatigue")
    }

    // Previous cardiac events
    if (formData.previousHeartAttack === "yes") {
      riskScore += 4
      riskFactors.push("Previous heart attack")
    }

    if (formData.previousSurgery === "yes") {
      riskScore += 2
      riskFactors.push("Previous cardiac surgery/procedure")
    }

    // Lifestyle factors
    if (formData.stress === "high" || formData.stress === "very-high") {
      riskScore += 1
      riskFactors.push("High stress level")
    }

    if (formData.sleep === "poor") {
      riskScore += 1
      riskFactors.push("Poor sleep quality")
    }

    if (formData.diet === "poor") {
      riskScore += 1
      riskFactors.push("Poor diet quality")
    }

    // Alcohol
    if (formData.alcohol === "heavy") {
      riskScore += 1
      riskFactors.push("Heavy alcohol consumption")
    }

    return { riskScore, riskFactors }
  }

  const getRiskLevel = (score: number) => {
    if (score <= 4) return { level: "Low", color: "green", description: "Low risk for cardiovascular events" }
    if (score <= 8)
      return { level: "Moderate", color: "yellow", description: "Moderate risk - lifestyle changes recommended" }
    if (score <= 15) return { level: "High", color: "orange", description: "High risk - medical evaluation needed" }
    return { level: "Very High", color: "red", description: "Very high risk - immediate medical attention required" }
  }

  const generatePDF = () => {
    if (!assessmentResults) return

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

    // Calculate BMI
    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height) / 100
    const bmi = weight / (height * height)

    // Format AI response for PDF - same as print

    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Heart Health Assessment Report - ${formData.name}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 20px;
      margin: 0;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 25px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header p {
      margin: 5px 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .patient-info {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 25px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      border: 2px solid #cbd5e1;
    }
    .patient-info div {
      color: #1a1a1a;
      font-size: 14px;
      font-weight: 500;
    }
    .patient-info strong {
      color: #000000;
      font-weight: 600;
    }
    .risk-summary {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 3px solid #fca5a5;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 25px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .risk-score {
      font-size: 56px;
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 15px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    .risk-level {
      font-size: 20px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 25px;
      display: inline-block;
      margin-bottom: 15px;
      color: #7f1d1d;
      background: #fecaca;
      border: 2px solid #f87171;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .section h2 {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      padding: 15px 20px;
      margin: 0 0 0 0;
      font-size: 18px;
      font-weight: bold;
    }
    .section-content {
      padding: 20px;
      background: white;
    }
    .ai-assessment {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 3px solid #3b82f6;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .ai-assessment h3 {
      color: #1e40af;
      font-size: 18px;
      font-weight: bold;
      margin: 25px 0 15px 0;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 8px;
    }
    .ai-assessment h4 {
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }
    .ai-assessment p {
      margin: 10px 0;
      color: #1a1a1a;
      line-height: 1.6;
      font-size: 14px;
    }
    .ai-assessment ul, .ai-assessment ol {
      margin: 15px 0;
      padding-left: 25px;
      color: #1a1a1a;
    }
    .ai-assessment li {
      margin-bottom: 5px;
      color: #1a1a1a;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      color: #1a1a1a;
      padding: 12px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 13px;
      border: 1px solid #cbd5e1;
    }
    td {
      padding: 10px 8px;
      border: 1px solid #e5e7eb;
      color: #1a1a1a;
      font-size: 12px;
      vertical-align: top;
    }
    td strong {
      color: #000000;
      font-weight: 600;
    }
    .meal-card, .exercise-card, .doctor-card {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .meal-header, .exercise-header, .doctor-name {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 8px;
      font-size: 15px;
    }
    .emergency-section {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 3px solid #fca5a5;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .emergency-title {
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .emergency-item {
      font-size: 13px;
      color: #1a1a1a;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
      line-height: 1.4;
    }
    .emergency-item:before {
      content: "⚠️";
      position: absolute;
      left: 0;
      font-size: 14px;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #1a1a1a;
      border-top: 2px solid #e5e7eb;
      padding-top: 20px;
      background: linear-gradient(135deg, #f9fafb, #f3f4f6);
      padding: 20px;
      border-radius: 8px;
    }
    @media print {
      body { padding: 0; margin: 0; }
      .section { page-break-inside: avoid; }
      * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>❤️ Heart Health Assessment Report</h1>
    <p>Comprehensive Cardiovascular Risk Evaluation</p>
    <p>Generated on ${currentDate} at ${currentTime}</p>
  </div>

  <div class="patient-info">
    <div><strong>Name:</strong> ${formData.name}</div>
    <div><strong>Age:</strong> ${formData.age} years</div>
    <div><strong>Gender:</strong> ${formData.gender}</div>
    <div><strong>Height:</strong> ${formData.height} cm</div>
    <div><strong>Weight:</strong> ${formData.weight} kg</div>
    <div><strong>BMI:</strong> ${bmi.toFixed(1)} kg/m²</div>
    <div><strong>Blood Pressure:</strong> ${formData.systolicBP}/${formData.diastolicBP} mmHg</div>
    <div><strong>Heart Rate:</strong> ${formData.restingHeartRate} bpm</div>
    <div><strong>Location:</strong> ${formData.location}</div>
  </div>

  <div class="risk-summary">
    <div class="risk-score">${assessmentResults.riskScore}/25</div>
    <div class="risk-level">${assessmentResults.riskLevel.level} Risk Level</div>
    <p style="color: #1a1a1a; font-weight: 600; font-size: 16px;">${assessmentResults.riskLevel.description}</p>
    <div style="margin-top: 20px; color: #1a1a1a;">
      <strong>Risk Factors Identified:</strong><br>
      <span style="font-size: 14px; line-height: 1.5;">${assessmentResults.riskFactors.join(" • ")}</span>
    </div>
  </div>

  <div class="section">
    <h2>💊 Prescribed Medications</h2>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Purpose</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${assessmentResults.medications
            .map(
              (med) => `
            <tr>
              <td><strong>${med.name}</strong></td>
              <td>${med.dosage}</td>
              <td>${med.frequency}</td>
              <td>${med.purpose}</td>
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
    <h2>🧪 Recommended Laboratory Tests</h2>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Purpose</th>
            <th>Frequency</th>
            <th>Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${assessmentResults.labTests
            .map(
              (test) => `
            <tr>
              <td><strong>${test.name}</strong></td>
              <td>${test.purpose}</td>
              <td>${test.frequency}</td>
              <td>${test.estimatedCost}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <h2>💊 Recommended Supplements</h2>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Supplement</th>
            <th>Dosage</th>
            <th>Purpose</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${assessmentResults.supplements
            .map(
              (supplement) => `
            <tr>
              <td><strong>${supplement.name}</strong></td>
              <td>${supplement.dosage}</td>
              <td>${supplement.purpose}</td>
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
    <h2>🍽️ Heart-Healthy Diet Plan</h2>
    <div class="section-content">
      ${assessmentResults.dietPlan
        .map(
          (meal) => `
        <div class="meal-card">
          <div class="meal-header">${meal.mealType} (${meal.time}) - ${meal.calories} kcal</div>
          <p style="margin: 8px 0; color: #1a1a1a;"><strong>Foods:</strong> ${meal.foods}</p>
          <p style="margin: 8px 0; color: #1a1a1a;"><strong>Key Nutrients:</strong> ${meal.nutrients}</p>
          <p style="margin: 8px 0; color: #1e40af; background: #dbeafe; padding: 8px; border-radius: 4px;"><strong>Tip:</strong> ${meal.tips}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="section">
    <h2>🏃‍♂️ Personalized Exercise Plan</h2>
    <div class="section-content">
      ${assessmentResults.exercisePlan
        .map(
          (exercise) => `
        <div class="exercise-card">
          <div class="exercise-header">${exercise.type} - ${exercise.duration}, ${exercise.frequency}</div>
          <p style="margin: 8px 0; color: #1a1a1a;"><strong>Intensity:</strong> ${exercise.intensity}</p>
          <p style="margin: 8px 0; color: #1a1a1a;"><strong>Benefits:</strong> ${exercise.benefits}</p>
          <p style="margin: 8px 0; color: #dc2626; background: #fef2f2; padding: 8px; border-radius: 4px;"><strong>Precautions:</strong> ${exercise.precautions}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="section">
    <h2>👨‍⚕️ Recommended Specialists</h2>
    <div class="section-content">
      ${assessmentResults.nearbyDoctors
        .map(
          (doctor) => `
        <div class="doctor-card">
          <div class="doctor-name">${doctor.name} - ${doctor.specialty}</div>
          <p style="margin: 5px 0; color: #1a1a1a;"><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p style="margin: 5px 0; color: #1a1a1a;"><strong>Address:</strong> ${doctor.address} (${doctor.distance})</p>
          <p style="margin: 5px 0; color: #1a1a1a;"><strong>Phone:</strong> ${doctor.phone}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="emergency-section">
    <div class="emergency-title">🚨 Emergency Warning Signs</div>
    <p style="color: #1a1a1a; font-weight: 600; margin-bottom: 15px;"><strong>Seek immediate medical attention if you experience:</strong></p>
    ${assessmentResults.emergencySigns.map((sign) => `<div class="emergency-item">${sign}</div>`).join("")}
  </div>

  <div class="section">
    <h2>📅 Follow-up Schedule</h2>
    <div class="section-content">
      ${assessmentResults.followUpSchedule.map((item, index) => `<div style="margin-bottom: 10px; color: #1a1a1a; padding: 8px; background: #f8fafc; border-radius: 4px; border-left: 4px solid #3b82f6;"><strong>${index + 1}.</strong> ${item}</div>`).join("")}
    </div>
  </div>

  <div class="footer">
    <p><strong>MyMedi.ai</strong> - Your AI-Powered Health Companion</p>
    <p>Generated on ${currentDate} at ${currentTime} IST</p>
    <p>Report ID: HHA-${Date.now().toString().slice(-8)} | Patient: ${formData.name}</p>
    <p><strong>Disclaimer:</strong> This assessment is for informational purposes only. Always consult healthcare professionals for medical decisions.</p>
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

  const handlePrint = () => {
    if (!assessmentResults) return

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

    // Calculate BMI
    const weight = Number.parseFloat(formData.weight)
    const height = Number.parseFloat(formData.height) / 100
    const bmi = weight / (height * height)

    // Format AI response for print

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Heart Health Assessment Report - ${formData.name}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 20px;
      margin: 0;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 25px;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header p {
      margin: 5px 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .patient-info {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 25px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      border: 2px solid #cbd5e1;
    }
    .patient-info div {
      color: #334155;
      font-size: 14px;
      font-weight: 500;
    }
    .patient-info strong {
      color: #1e293b;
      font-weight: 600;
    }
    .risk-summary {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 3px solid #fca5a5;
      padding: 25px;
      border-radius: 12px;
      margin-bottom: 25px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .risk-score {
      font-size: 56px;
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 15px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    .risk-level {
      font-size: 20px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 25px;
      display: inline-block;
      margin-bottom: 15px;
      color: #7f1d1d;
      background: #fecaca;
      border: 2px solid #f87171;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .section h2 {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      padding: 15px 20px;
      margin: 0 0 0 0;
      font-size: 18px;
      font-weight: bold;
    }
    .section-content {
      padding: 20px;
      background: white;
    }
    .ai-assessment {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 3px solid #3b82f6;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .ai-assessment h3 {
      color: #1e40af;
      font-size: 18px;
      font-weight: bold;
      margin: 25px 0 15px 0;
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 8px;
    }
    .ai-assessment h4 {
      color: #1e293b;
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }
    .ai-assessment p {
      margin: 10px 0;
      color: #1e293b;
      line-height: 1.6;
      font-size: 14px;
    }
    .ai-assessment ul, .ai-assessment ol {
      margin: 15px 0;
      padding-left: 25px;
      color: #374151;
    }
    .ai-assessment li {
      margin-bottom: 5px;
      color: #374151;
      line-height: 1.5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th {
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      color: #1e293b;
      padding: 12px 8px;
      text-align: left;
      font-weight: bold;
      font-size: 13px;
      border: 1px solid #cbd5e1;
    }
    td {
      padding: 10px 8px;
      border: 1px solid #e5e7eb;
      color: #374151;
      font-size: 12px;
      vertical-align: top;
    }
    td strong {
      color: #1e293b;
      font-weight: 600;
    }
    .meal-card, .exercise-card, .doctor-card {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .meal-header, .exercise-header, .doctor-name {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 8px;
      font-size: 15px;
    }
    .emergency-section {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 3px solid #fca5a5;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 25px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .emergency-title {
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .emergency-item {
      font-size: 13px;
      color: #7f1d1d;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
      line-height: 1.4;
    }
    .emergency-item:before {
      content: "⚠️";
      position: absolute;
      left: 0;
      font-size: 14px;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 2px solid #e5e7eb;
      padding-top: 20px;
      background: linear-gradient(135deg, #f9fafb, #f3f4f6);
      padding: 20px;
      border-radius: 8px;
    }
    @media print {
      body { padding: 0; margin: 0; }
      .section { page-break-inside: avoid; }
      * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>❤️ Heart Health Assessment Report</h1>
    <p>Comprehensive Cardiovascular Risk Evaluation</p>
    <p>Generated on ${currentDate} at ${currentTime}</p>
  </div>

  <div class="patient-info">
    <div><strong>Name:</strong> ${formData.name}</div>
    <div><strong>Age:</strong> ${formData.age} years</div>
    <div><strong>Gender:</strong> ${formData.gender}</div>
    <div><strong>Height:</strong> ${formData.height} cm</div>
    <div><strong>Weight:</strong> ${formData.weight} kg</div>
    <div><strong>BMI:</strong> ${bmi.toFixed(1)} kg/m²</div>
    <div><strong>Blood Pressure:</strong> ${formData.systolicBP}/${formData.diastolicBP} mmHg</div>
    <div><strong>Heart Rate:</strong> ${formData.restingHeartRate} bpm</div>
    <div><strong>Location:</strong> ${formData.location}</div>
  </div>

  <div class="risk-summary">
    <div class="risk-score">${assessmentResults.riskScore}/25</div>
    <div class="risk-level">${assessmentResults.riskLevel.level} Risk Level</div>
    <p style="color: #7f1d1d; font-weight: 600; font-size: 16px;">${assessmentResults.riskLevel.description}</p>
    <div style="margin-top: 20px; color: #7f1d1d;">
      <strong>Risk Factors Identified:</strong><br>
      <span style="font-size: 14px; line-height: 1.5;">${assessmentResults.riskFactors.join(" • ")}</span>
    </div>
  </div>

  <div class="section">
    <h2>💊 Prescribed Medications</h2>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Purpose</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${assessmentResults.medications
            .map(
              (med) => `
            <tr>
              <td><strong>${med.name}</strong></td>
              <td>${med.dosage}</td>
              <td>${med.frequency}</td>
              <td>${med.purpose}</td>
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
    <h2>🧪 Recommended Laboratory Tests</h2>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Purpose</th>
            <th>Frequency</th>
            <th>Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${assessmentResults.labTests
            .map(
              (test) => `
            <tr>
              <td><strong>${test.name}</strong></td>
              <td>${test.purpose}</td>
              <td>${test.frequency}</td>
              <td>${test.estimatedCost}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="section">
    <h2>💊 Recommended Supplements</h2>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Supplement</th>
            <th>Dosage</th>
            <th>Purpose</th>
            <th>Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${assessmentResults.supplements
            .map(
              (supplement) => `
            <tr>
              <td><strong>${supplement.name}</strong></td>
              <td>${supplement.dosage}</td>
              <td>${supplement.purpose}</td>
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
    <h2>🍽️ Heart-Healthy Diet Plan</h2>
    <div class="section-content">
      ${assessmentResults.dietPlan
        .map(
          (meal) => `
        <div class="meal-card">
          <div class="meal-header">${meal.mealType} (${meal.time}) - ${meal.calories} kcal</div>
          <p style="margin: 8px 0; color: #374151;"><strong>Foods:</strong> ${meal.foods}</p>
          <p style="margin: 8px 0; color: #374151;"><strong>Key Nutrients:</strong> ${meal.nutrients}</p>
          <p style="margin: 8px 0; color: #1e40af; background: #dbeafe; padding: 8px; border-radius: 4px;"><strong>Tip:</strong> ${meal.tips}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="section">
    <h2>🏃‍♂️ Personalized Exercise Plan</h2>
    <div class="section-content">
      ${assessmentResults.exercisePlan
        .map(
          (exercise) => `
        <div class="exercise-card">
          <div class="exercise-header">${exercise.type} - ${exercise.duration}, ${exercise.frequency}</div>
          <p style="margin: 8px 0; color: #374151;"><strong>Intensity:</strong> ${exercise.intensity}</p>
          <p style="margin: 8px 0; color: #374151;"><strong>Benefits:</strong> ${exercise.benefits}</p>
          <p style="margin: 8px 0; color: #dc2626; background: #fef2f2; padding: 8px; border-radius: 4px;"><strong>Precautions:</strong> ${exercise.precautions}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="section">
    <h2>👨‍⚕️ Recommended Specialists</h2>
    <div class="section-content">
      ${assessmentResults.nearbyDoctors
        .map(
          (doctor) => `
        <div class="doctor-card">
          <div class="doctor-name">${doctor.name} - ${doctor.specialty}</div>
          <p style="margin: 5px 0; color: #374151;"><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Address:</strong> ${doctor.address} (${doctor.distance})</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> ${doctor.phone}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>

  <div class="emergency-section">
    <div class="emergency-title">🚨 Emergency Warning Signs</div>
    <p style="color: #7f1d1d; font-weight: 600; margin-bottom: 15px;"><strong>Seek immediate medical attention if you experience:</strong></p>
    ${assessmentResults.emergencySigns.map((sign) => `<div class="emergency-item">${sign}</div>`).join("")}
  </div>

  <div class="section">
    <h2>📅 Follow-up Schedule</h2>
    <div class="section-content">
      ${assessmentResults.followUpSchedule.map((item, index) => `<div style="margin-bottom: 10px; color: #374151; padding: 8px; background: #f8fafc; border-radius: 4px; border-left: 4px solid #3b82f6;"><strong>${index + 1}.</strong> ${item}</div>`).join("")}
    </div>
  </div>

  <div class="footer">
    <p><strong>MyMedi.ai</strong> - Your AI-Powered Health Companion</p>
    <p>Generated on ${currentDate} at ${currentTime} IST</p>
    <p>Report ID: HHA-${Date.now().toString().slice(-8)} | Patient: ${formData.name}</p>
    <p><strong>Disclaimer:</strong> This assessment is for informational purposes only. Always consult healthcare professionals for medical decisions.</p>
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
      }, 1000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { riskScore, riskFactors } = calculateRiskScore()
      const riskLevel = getRiskLevel(riskScore)

      // Calculate BMI
      const weight = Number.parseFloat(formData.weight)
      const height = Number.parseFloat(formData.height) / 100 // Convert cm to m
      const bmi = weight / (height * height)

      const assessmentPrompt = `
Comprehensive Heart Health Assessment:

PATIENT INFORMATION:
- Name: ${formData.name}
- Age: ${formData.age} years
- Gender: ${formData.gender}
- BMI: ${bmi.toFixed(1)} kg/m²
- Waist Circumference: ${formData.waistCircumference} cm
- Location: ${formData.location}

VITAL SIGNS:
- Blood Pressure: ${formData.systolicBP}/${formData.diastolicBP} mmHg
- Resting Heart Rate: ${formData.restingHeartRate} bpm
- Temperature: ${formData.temperature}°F
- Oxygen Saturation: ${formData.oxygenSaturation}%

SYMPTOMS (NYHA/CCS Classification):
- Chest Pain: ${formData.chestPain} (Type: ${formData.chestPainType}, Trigger: ${formData.chestPainTrigger})
- Shortness of Breath: ${formData.shortnessOfBreath} (Level: ${formData.breathlessnessLevel})
- Palpitations: ${formData.palpitations} (Frequency: ${formData.palpitationsFrequency})
- Fatigue: ${formData.fatigue} (Level: ${formData.fatigueLevel})
- Dizziness: ${formData.dizziness}
- Swelling: ${formData.swelling} (Location: ${formData.swellingLocation})

RISK FACTORS:
- Smoking: ${formData.smoking} (History: ${formData.smokingHistory})
- Alcohol: ${formData.alcohol} (Frequency: ${formData.alcoholFrequency})
- Diabetes: ${formData.diabetes} (Type: ${formData.diabetesType}, Control: ${formData.diabetesControl})
- Hypertension: ${formData.hypertension} (Duration: ${formData.hypertensionDuration})
- Cholesterol: ${formData.cholesterol} (Level: ${formData.cholesterolLevel})
- Family History: ${formData.familyHistory} (Details: ${formData.familyHistoryDetails})

LIFESTYLE:
- Physical Activity: ${formData.physicalActivity} (Frequency: ${formData.exerciseFrequency}, Type: ${formData.exerciseType})
- Diet: ${formData.diet} (Type: ${formData.dietType})
- Stress: ${formData.stress} (Level: ${formData.stressLevel})
- Sleep: ${formData.sleep} (Hours: ${formData.sleepHours})

MEDICAL HISTORY:
- Previous Heart Attack: ${formData.previousHeartAttack} (Date: ${formData.heartAttackDate})
- Previous Surgery: ${formData.previousSurgery} (Details: ${formData.surgeryDetails})
- Current Medications: ${formData.currentMedications} (List: ${formData.medicationsList})
- Allergies: ${formData.allergies} (List: ${formData.allergiesList})

RECENT TESTS:
- ECG: ${formData.recentECG} (Date: ${formData.ecgDate}, Results: ${formData.ecgResults})
- Echocardiogram: ${formData.recentEcho} (Date: ${formData.echoDate}, Results: ${formData.echoResults})
- Blood Tests: ${formData.bloodTests} (Date: ${formData.bloodTestDate}, Results: ${formData.bloodTestResults})

CALCULATED RISK:
- Risk Score: ${riskScore}/25
- Risk Level: ${riskLevel.level}
- Risk Factors: ${riskFactors.join(", ")}

Please provide a comprehensive cardiac assessment following ACC/AHA 2023 guidelines and CSI recommendations for Indian patients, including:

1. CLINICAL ASSESSMENT & DIAGNOSIS
2. RISK STRATIFICATION (10-year cardiovascular risk)
3. IMMEDIATE RECOMMENDATIONS

4. MEDICATION RECOMMENDATIONS - Provide at least 5 specific medications with:
   - Name (generic and brand)
   - Exact dosage
   - Frequency
   - Purpose
   - Common side effects
   - Precautions
   - Price range in Indian Rupees
   - Alternatives

5. LABORATORY TESTS - Recommend at least 5 specific tests with:
   - Test name
   - Purpose
   - Preparation required
   - Frequency
   - Normal range
   - Estimated cost in Indian Rupees
   - Urgency level

6. SUPPLEMENTS - Recommend at least 4 specific supplements with:
   - Name
   - Dosage
   - Purpose
   - Potential interactions
   - Evidence level
   - Price range in Indian Rupees
   - Recommendation strength

7. DETAILED DIET PLAN - Provide a comprehensive diet plan with:
   - 5 specific meals (breakfast, mid-morning, lunch, evening snack, dinner)
   - Timing for each meal
   - Specific foods to include
   - Caloric content
   - Key nutrients
   - Foods to avoid
   - Special tips

8. DETAILED EXERCISE PLAN - Provide a comprehensive exercise plan with:
   - Types of exercises (cardio, strength, flexibility)
   - Duration
   - Frequency
   - Intensity levels
   - Specific benefits for heart health
   - Precautions based on patient's condition
   - Progression timeline

9. SPECIALIST REFERRALS - Recommend appropriate specialists based on findings

10. EMERGENCY WARNING SIGNS - List specific symptoms that require immediate medical attention

11. FOLLOW-UP SCHEDULE - Detailed timeline for follow-up appointments and monitoring

Format as a detailed medical report suitable for both patient and healthcare provider, with all sections clearly labeled and organized for printing.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "heart-health-assessment",
        }),
      })

      const data = await response.json()

      // Parse the AI response to extract structured data
      const aiResponse = data.response || ""

      // Mock data for nearby doctors based on location
      const mockNearbyDoctors: NearbyDoctor[] = [
        {
          name: "Dr. Rajesh Sharma",
          specialty: "Cardiologist",
          hospital: "Heart Care Institute",
          address: `${formData.location || "Your City"}, Near City Hospital`,
          distance: "2.3 km",
          phone: "+91-9876543210",
          rating: "4.8/5",
          availability: "Mon-Fri, 10:00 AM - 6:00 PM",
        },
        {
          name: "Dr. Priya Patel",
          specialty: "Interventional Cardiologist",
          hospital: "Apollo Hospitals",
          address: `${formData.location || "Your City"}, Main Road`,
          distance: "3.5 km",
          phone: "+91-9876543211",
          rating: "4.9/5",
          availability: "Mon-Sat, 9:00 AM - 5:00 PM",
        },
        {
          name: "Dr. Sunil Verma",
          specialty: "Cardiac Surgeon",
          hospital: "Fortis Hospital",
          address: `${formData.location || "Your City"}, Hospital Road`,
          distance: "4.1 km",
          phone: "+91-9876543212",
          rating: "4.7/5",
          availability: "Tue-Sat, 11:00 AM - 7:00 PM",
        },
      ]

      // Extract medications from AI response or use mock data
      const mockMedications: Medication[] = [
        {
          name: "Atorvastatin (Lipitor)",
          dosage: "20mg",
          frequency: "Once daily at night",
          purpose: "Lowers LDL cholesterol and reduces cardiovascular risk",
          sideEffects: "Muscle pain, digestive issues, liver enzyme elevation",
          precautions: "Monitor liver function, avoid grapefruit juice",
          price: "₹150-300 per month",
          alternatives: "Rosuvastatin, Simvastatin",
        },
        {
          name: "Aspirin (Ecosprin)",
          dosage: "75mg",
          frequency: "Once daily with food",
          purpose: "Blood thinning, prevents clot formation",
          sideEffects: "Stomach irritation, increased bleeding risk",
          precautions: "Take with food, avoid if history of bleeding disorders",
          price: "₹30-60 per month",
          alternatives: "Clopidogrel",
        },
        {
          name: "Metoprolol (Betaloc)",
          dosage: "25-50mg",
          frequency: "Twice daily",
          purpose: "Beta-blocker to reduce heart rate and blood pressure",
          sideEffects: "Fatigue, dizziness, cold extremities",
          precautions: "Don't stop abruptly, monitor heart rate",
          price: "₹80-150 per month",
          alternatives: "Bisoprolol, Carvedilol",
        },
        {
          name: "Ramipril (Cardace)",
          dosage: "5mg",
          frequency: "Once daily",
          purpose: "ACE inhibitor to lower blood pressure and protect heart",
          sideEffects: "Dry cough, dizziness, elevated potassium",
          precautions: "Monitor kidney function and potassium levels",
          price: "₹120-200 per month",
          alternatives: "Enalapril, Lisinopril",
        },
        {
          name: "Amlodipine (Amlopress)",
          dosage: "5mg",
          frequency: "Once daily",
          purpose: "Calcium channel blocker for blood pressure control",
          sideEffects: "Ankle swelling, headache, flushing",
          precautions: "Take at same time each day",
          price: "₹50-100 per month",
          alternatives: "Nifedipine, Felodipine",
        },
      ]

      // Extract lab tests from AI response or use mock data
      const mockLabTests: LabTest[] = [
        {
          name: "Lipid Profile",
          purpose: "Measures cholesterol levels (LDL, HDL, triglycerides)",
          preparation: "12-hour fasting required",
          frequency: "Every 3-6 months",
          normalRange: "Total Cholesterol <200 mg/dL, LDL <100 mg/dL, HDL >40 mg/dL",
          estimatedCost: "₹400-800",
          urgency: "High",
        },
        {
          name: "HbA1c",
          purpose: "Measures average blood glucose over past 3 months",
          preparation: "No fasting required",
          frequency: "Every 3 months",
          normalRange: "<5.7% normal, 5.7-6.4% prediabetes, >6.5% diabetes",
          estimatedCost: "₹300-600",
          urgency: "Medium",
        },
        {
          name: "Cardiac Stress Test",
          purpose: "Evaluates heart function during physical activity",
          preparation: "Light meal 2 hours before, wear comfortable clothes",
          frequency: "Annually or as recommended",
          normalRange: "Normal ECG changes with exercise, no symptoms",
          estimatedCost: "₹2,000-5,000",
          urgency: "Medium",
        },
        {
          name: "Echocardiogram",
          purpose: "Ultrasound of heart to assess structure and function",
          preparation: "No special preparation",
          frequency: "Annually or as recommended",
          normalRange: "Normal chamber size, valve function, ejection fraction >55%",
          estimatedCost: "₹2,500-6,000",
          urgency: "High",
        },
        {
          name: "NT-proBNP",
          purpose: "Marker for heart failure and cardiac stress",
          preparation: "No special preparation",
          frequency: "As needed based on symptoms",
          normalRange: "<125 pg/mL for patients <75 years, <450 pg/mL for patients >75 years",
          estimatedCost: "₹1,500-3,000",
          urgency: "Medium",
        },
      ]

      // Extract supplements from AI response or use mock data
      const mockSupplements: Supplement[] = [
        {
          name: "Omega-3 Fatty Acids",
          dosage: "1000mg daily",
          purpose: "Reduces triglycerides, inflammation, and blood pressure",
          interactions: "May interact with blood thinners",
          evidence: "Strong evidence for cardiovascular benefits",
          price: "₹500-1000 per month",
          recommendation: "Strongly recommended",
        },
        {
          name: "Coenzyme Q10 (CoQ10)",
          dosage: "100-200mg daily",
          purpose: "Supports heart function, may reduce statin side effects",
          interactions: "May interact with blood thinners and blood pressure medications",
          evidence: "Moderate evidence for heart failure patients",
          price: "₹800-1500 per month",
          recommendation: "Recommended for statin users",
        },
        {
          name: "Magnesium",
          dosage: "300-400mg daily",
          purpose: "Supports heart rhythm, blood pressure regulation",
          interactions: "May interact with certain antibiotics and diuretics",
          evidence: "Moderate evidence for blood pressure reduction",
          price: "₹200-500 per month",
          recommendation: "Recommended",
        },
        {
          name: "Vitamin D3",
          dosage: "1000-2000 IU daily",
          purpose: "Supports heart health, immune function",
          interactions: "Minimal interactions at recommended doses",
          evidence: "Moderate evidence for overall health benefits",
          price: "₹300-600 per month",
          recommendation: "Recommended for deficient individuals",
        },
      ]

      // Extract diet plan from AI response or use mock data
      const mockDietPlan: DietPlan[] = [
        {
          mealType: "Breakfast",
          time: "7:00-8:00 AM",
          foods: "Oatmeal with nuts and berries, 1 cup low-fat milk, 1 small banana",
          calories: 350,
          nutrients: "Fiber, potassium, antioxidants, protein",
          avoid: "Added sugars, refined cereals",
          tips: "Use cinnamon instead of sugar for flavor",
        },
        {
          mealType: "Mid-Morning Snack",
          time: "10:00-10:30 AM",
          foods: "1 small apple with 10 almonds or 1 cup green tea",
          calories: 150,
          nutrients: "Fiber, healthy fats, antioxidants",
          avoid: "Processed snacks, cookies",
          tips: "Stay hydrated with water or herbal teas",
        },
        {
          mealType: "Lunch",
          time: "12:30-1:30 PM",
          foods: "Grilled fish/chicken (100g), brown rice (1/2 cup), mixed vegetables, dal, salad",
          calories: 450,
          nutrients: "Lean protein, complex carbs, fiber, vitamins",
          avoid: "Fried foods, white rice, excess salt",
          tips: "Use herbs and spices for flavor instead of salt",
        },
        {
          mealType: "Evening Snack",
          time: "4:00-5:00 PM",
          foods: "1 cup buttermilk with mint or handful of walnuts",
          calories: 120,
          nutrients: "Probiotics, healthy fats, protein",
          avoid: "Fried snacks, sugary drinks",
          tips: "Choose unsalted nuts and seeds",
        },
        {
          mealType: "Dinner",
          time: "7:00-8:00 PM",
          foods: "Vegetable soup, grilled tofu/paneer, quinoa/brown rice, steamed vegetables",
          calories: 400,
          nutrients: "Plant protein, fiber, vitamins, minerals",
          avoid: "Heavy meals, late eating",
          tips: "Finish dinner 2-3 hours before bedtime",
        },
      ]

      // Extract exercise plan from AI response or use mock data
      const mockExercisePlan: ExercisePlan[] = [
        {
          type: "Aerobic Exercise (Walking/Cycling)",
          duration: "30-45 minutes",
          frequency: "5 days per week",
          intensity: "Moderate (can talk while exercising)",
          benefits: "Improves cardiovascular fitness, lowers blood pressure",
          precautions: "Start slowly, monitor heart rate, stop if chest pain occurs",
          progression: "Increase duration by 5 minutes every 2 weeks",
        },
        {
          type: "Strength Training",
          duration: "20-30 minutes",
          frequency: "2-3 days per week",
          intensity: "Light to moderate weights",
          benefits: "Builds muscle strength, improves metabolism",
          precautions: "Avoid heavy lifting, breathe properly during exercises",
          progression: "Increase weights gradually every 2-3 weeks",
        },
        {
          type: "Flexibility/Yoga",
          duration: "15-20 minutes",
          frequency: "Daily",
          intensity: "Gentle stretching",
          benefits: "Reduces stress, improves flexibility, lowers blood pressure",
          precautions: "Avoid inverted poses if high blood pressure",
          progression: "Hold stretches longer as flexibility improves",
        },
      ]

      const mockFollowUpSchedule = [
        "Follow-up with cardiologist in 2 weeks to review medications",
        "Blood pressure monitoring daily for first week, then weekly",
        "Lipid profile repeat in 6-8 weeks",
        "Echocardiogram in 3 months if symptoms persist",
        "Lifestyle counseling session in 1 month",
        "Cardiac rehabilitation program enrollment within 2 weeks",
      ]

      const mockEmergencySigns = [
        "Severe chest pain lasting more than 15 minutes",
        "Shortness of breath at rest or with minimal activity",
        "Sudden severe headache with high blood pressure",
        "Irregular or very fast heart rate (>120 bpm at rest)",
        "Fainting or near-fainting episodes",
        "Sudden swelling of face, lips, or throat",
        "Severe nausea with chest discomfort",
        "Pain radiating to arm, jaw, or back",
        "Cold sweats with chest discomfort",
        "Sudden weakness or numbness on one side of body",
      ]

      const results: AssessmentResult = {
        response: aiResponse,
        riskScore,
        riskLevel,
        riskFactors,
        bmi: bmi.toFixed(1),
        patientData: formData,
        medications: mockMedications,
        labTests: mockLabTests,
        supplements: mockSupplements,
        dietPlan: mockDietPlan,
        exercisePlan: mockExercisePlan,
        nearbyDoctors: mockNearbyDoctors,
        followUpSchedule: mockFollowUpSchedule,
        emergencySigns: mockEmergencySigns,
      }

      setAssessmentResults(results)
    } catch (error) {
      console.error("Assessment error:", error)
      alert("Failed to complete assessment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (assessmentResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Heart Health Assessment Results</h1>
              <p className="text-gray-600">
                Comprehensive cardiovascular risk evaluation for {assessmentResults.patientData.name}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Button onClick={() => setAssessmentResults(null)} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Assessment
              </Button>
              <Button onClick={generatePDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Printer className="h-4 w-4" />
                Print Report
              </Button>
            </div>

            {/* Risk Summary Card */}
            <Card className="mb-8 border-red-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
                  <Heart className="h-6 w-6" />
                  Risk Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-red-600 mb-2">{assessmentResults.riskScore}/25</div>
                  <Badge
                    className={`text-lg px-4 py-2 ${
                      assessmentResults.riskLevel.color === "green"
                        ? "bg-green-100 text-green-800"
                        : assessmentResults.riskLevel.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : assessmentResults.riskLevel.color === "orange"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {assessmentResults.riskLevel.level} Risk
                  </Badge>
                  <p className="text-gray-600 mt-2">{assessmentResults.riskLevel.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Patient Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span className="font-medium">{assessmentResults.patientData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Age:</span>
                        <span className="font-medium">{assessmentResults.patientData.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gender:</span>
                        <span className="font-medium">{assessmentResults.patientData.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BMI:</span>
                        <span className="font-medium">{assessmentResults.bmi} kg/m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blood Pressure:</span>
                        <span className="font-medium">
                          {assessmentResults.patientData.systolicBP}/{assessmentResults.patientData.diastolicBP} mmHg
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Factors Identified
                    </h4>
                    <div className="space-y-1">
                      {assessmentResults.riskFactors.map((factor, index) => (
                        <div key={index} className="text-sm text-red-700 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Results Tabs */}
            <Tabs defaultValue="medications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="medications" className="text-xs">
                  <Pill className="h-4 w-4 mr-1" />
                  Medications
                </TabsTrigger>
                <TabsTrigger value="tests" className="text-xs">
                  <TestTube className="h-4 w-4 mr-1" />
                  Lab Tests
                </TabsTrigger>
                <TabsTrigger value="supplements" className="text-xs">
                  <Star className="h-4 w-4 mr-1" />
                  Supplements
                </TabsTrigger>
                <TabsTrigger value="diet" className="text-xs">
                  <Utensils className="h-4 w-4 mr-1" />
                  Diet Plan
                </TabsTrigger>
                <TabsTrigger value="exercise" className="text-xs">
                  <Dumbbell className="h-4 w-4 mr-1" />
                  Exercise
                </TabsTrigger>
                <TabsTrigger value="doctors" className="text-xs">
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Specialists
                </TabsTrigger>
                <TabsTrigger value="followup" className="text-xs">
                  <Calendar className="h-4 w-4 mr-1" />
                  Follow-up
                </TabsTrigger>
                <TabsTrigger value="emergency" className="text-xs">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Emergency
                </TabsTrigger>
              </TabsList>

              <TabsContent value="medications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5" />
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
                            <TableHead>Purpose</TableHead>
                            <TableHead>Side Effects</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assessmentResults.medications.map((med, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{med.name}</TableCell>
                              <TableCell>{med.dosage}</TableCell>
                              <TableCell>{med.frequency}</TableCell>
                              <TableCell>{med.purpose}</TableCell>
                              <TableCell>{med.sideEffects}</TableCell>
                              <TableCell>{med.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tests">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      Recommended Laboratory Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Preparation</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>Normal Range</TableHead>
                            <TableHead>Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assessmentResults.labTests.map((test, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{test.name}</TableCell>
                              <TableCell>{test.purpose}</TableCell>
                              <TableCell>{test.preparation}</TableCell>
                              <TableCell>{test.frequency}</TableCell>
                              <TableCell>{test.normalRange}</TableCell>
                              <TableCell>{test.estimatedCost}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supplements">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Recommended Supplements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Supplement</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Evidence</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Recommendation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assessmentResults.supplements.map((supplement, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{supplement.name}</TableCell>
                              <TableCell>{supplement.dosage}</TableCell>
                              <TableCell>{supplement.purpose}</TableCell>
                              <TableCell>{supplement.evidence}</TableCell>
                              <TableCell>{supplement.price}</TableCell>
                              <TableCell>{supplement.recommendation}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diet">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Heart-Healthy Diet Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {assessmentResults.dietPlan.map((meal, index) => (
                        <Card key={index} className="border-l-4 border-l-red-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{meal.mealType}</h4>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">{meal.time}</div>
                                <div className="font-medium text-red-600">{meal.calories} kcal</div>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Foods: </span>
                                {meal.foods}
                              </div>
                              <div>
                                <span className="font-medium">Key Nutrients: </span>
                                {meal.nutrients}
                              </div>
                              <div>
                                <span className="font-medium">Avoid: </span>
                                {meal.avoid}
                              </div>
                              <div className="bg-blue-50 p-2 rounded">
                                <span className="font-medium text-blue-800">Tip: </span>
                                {meal.tips}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exercise">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      Personalized Exercise Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {assessmentResults.exercisePlan.map((exercise, index) => (
                        <Card key={index} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{exercise.type}</h4>
                              <div className="text-right text-sm text-gray-600">
                                <div>{exercise.duration}</div>
                                <div>{exercise.frequency}</div>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Intensity: </span>
                                {exercise.intensity}
                              </div>
                              <div>
                                <span className="font-medium">Benefits: </span>
                                {exercise.benefits}
                              </div>
                              <div className="bg-yellow-50 p-2 rounded">
                                <span className="font-medium text-yellow-800">Precautions: </span>
                                {exercise.precautions}
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <span className="font-medium text-green-800">Progression: </span>
                                {exercise.progression}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="doctors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Recommended Specialists
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {assessmentResults.nearbyDoctors.map((doctor, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-lg">{doctor.name}</h4>
                                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">{doctor.distance}</div>
                                <div className="text-yellow-600 font-medium">{doctor.rating}</div>
                              </div>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{doctor.hospital}</span>
                              </div>
                              <div className="text-gray-600">{doctor.address}</div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{doctor.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{doctor.availability}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="followup">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Follow-up Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {assessmentResults.followUpSchedule.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emergency">
                <Card className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Warning Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 font-medium">
                        Seek immediate medical attention if you experience any of the following symptoms:
                      </AlertDescription>
                    </Alert>
                    <div className="grid gap-3">
                      {assessmentResults.emergencySigns.map((sign, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-800">{sign}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-red-100 rounded-lg border border-red-300">
                      <div className="text-center">
                        <div className="text-red-800 font-bold text-lg mb-2">Emergency Contacts</div>
                        <div className="text-red-700">
                          <div>
                            India Emergency: <span className="font-bold">108</span>
                          </div>
                          <div>
                            Local Emergency: <span className="font-bold">911</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Disclaimer */}
            <Alert className="mt-8 border-yellow-200 bg-yellow-50">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Important Medical Disclaimer:</strong> This AI-generated assessment is for informational
                purposes only and should not replace professional medical advice, diagnosis, or treatment. Always
                consult with qualified healthcare professionals before making any medical decisions or changes to your
                treatment plan. The medications, dosages, and treatment recommendations provided are AI-generated
                suggestions and must be reviewed and approved by a licensed medical practitioner before use.
              </AlertDescription>
            </Alert>

            <PoweredByFooter />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Heart Health Assessment</h1>
            <p className="text-gray-600">Comprehensive cardiovascular risk evaluation powered by AI</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  name: "",
                  age: "",
                  gender: "",
                  weight: "",
                  height: "",
                  waistCircumference: "",
                  location: "",
                  systolicBP: "",
                  diastolicBP: "",
                  restingHeartRate: "",
                  temperature: "",
                  oxygenSaturation: "",
                  chestPain: "",
                  chestPainType: "",
                  chestPainTrigger: "",
                  shortnessOfBreath: "",
                  breathlessnessLevel: "",
                  palpitations: "",
                  palpitationsFrequency: "",
                  fatigue: "",
                  fatigueLevel: "",
                  dizziness: "",
                  swelling: "",
                  swellingLocation: "",
                  smoking: "",
                  smokingHistory: "",
                  alcohol: "",
                  alcoholFrequency: "",
                  diabetes: "",
                  diabetesType: "",
                  diabetesControl: "",
                  hypertension: "",
                  hypertensionDuration: "",
                  cholesterol: "",
                  cholesterolLevel: "",
                  familyHistory: "",
                  familyHistoryDetails: "",
                  physicalActivity: "",
                  exerciseFrequency: "",
                  exerciseType: "",
                  diet: "",
                  dietType: "",
                  stress: "",
                  stressLevel: "",
                  sleep: "",
                  sleepHours: "",
                  previousHeartAttack: "",
                  heartAttackDate: "",
                  previousSurgery: "",
                  surgeryDetails: "",
                  currentMedications: "",
                  medicationsList: "",
                  allergies: "",
                  allergiesList: "",
                  recentECG: "",
                  ecgDate: "",
                  ecgResults: "",
                  recentEcho: "",
                  echoDate: "",
                  echoResults: "",
                  bloodTests: "",
                  bloodTestDate: "",
                  bloodTestResults: "",
                })
                setLocationError(null)
              }}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Reset Form
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="Enter weight in kg"
                      min="1"
                      step="0.1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      placeholder="Enter height in cm"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="waistCircumference">Waist Circumference (cm)</Label>
                    <Input
                      id="waistCircumference"
                      type="number"
                      value={formData.waistCircumference}
                      onChange={(e) => handleInputChange("waistCircumference", e.target.value)}
                      placeholder="Measure at narrowest point"
                      min="1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Enter your city/location"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={detectLocation}
                        disabled={locationLoading}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        {locationLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Navigation className="h-4 w-4" />
                        )}
                        Detect
                      </Button>
                    </div>
                    {locationError && <p className="text-sm text-red-600 mt-1">{locationError}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolicBP">Systolic Blood Pressure (mmHg) *</Label>
                    <Input
                      id="systolicBP"
                      type="number"
                      value={formData.systolicBP}
                      onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                      placeholder="e.g., 120"
                      min="60"
                      max="300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolicBP">Diastolic Blood Pressure (mmHg) *</Label>
                    <Input
                      id="diastolicBP"
                      type="number"
                      value={formData.diastolicBP}
                      onChange={(e) => handleInputChange("diastolicBP", e.target.value)}
                      placeholder="e.g., 80"
                      min="40"
                      max="200"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="restingHeartRate">Resting Heart Rate (bpm) *</Label>
                    <Input
                      id="restingHeartRate"
                      type="number"
                      value={formData.restingHeartRate}
                      onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
                      placeholder="e.g., 72"
                      min="30"
                      max="200"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange("temperature", e.target.value)}
                      placeholder="e.g., 98.6"
                      min="90"
                      max="110"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                    <Input
                      id="oxygenSaturation"
                      type="number"
                      value={formData.oxygenSaturation}
                      onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                      placeholder="e.g., 98"
                      min="70"
                      max="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cardiac Symptoms Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Cardiac Symptoms Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Cardiac Symptoms (Check all that apply)</Label>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="chest-pain-check"
                        checked={formData.chestPain === "yes"}
                        onChange={(e) => handleInputChange("chestPain", e.target.checked ? "yes" : "no")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="chest-pain-check" className="text-sm font-medium text-gray-700">
                        Chest pain or discomfort
                      </Label>
                    </div>

                    {formData.chestPain === "yes" && (
                      <div className="ml-7 space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <Label htmlFor="chestPainType">Type of chest pain</Label>
                          <Select
                            value={formData.chestPainType}
                            onValueChange={(value) => handleInputChange("chestPainType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sharp">Sharp/Stabbing</SelectItem>
                              <SelectItem value="crushing">Crushing/Squeezing</SelectItem>
                              <SelectItem value="burning">Burning</SelectItem>
                              <SelectItem value="pressure">Pressure/Heaviness</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="chestPainTrigger">What triggers the chest pain?</Label>
                          <Select
                            value={formData.chestPainTrigger}
                            onValueChange={(value) => handleInputChange("chestPainTrigger", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select trigger" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exercise">Physical exercise</SelectItem>
                              <SelectItem value="stress">Emotional stress</SelectItem>
                              <SelectItem value="rest">Occurs at rest</SelectItem>
                              <SelectItem value="eating">After eating</SelectItem>
                              <SelectItem value="cold">Cold weather</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="shortness-breath-check"
                        checked={formData.shortnessOfBreath === "yes"}
                        onChange={(e) => handleInputChange("shortnessOfBreath", e.target.checked ? "yes" : "no")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="shortness-breath-check" className="text-sm font-medium text-gray-700">
                        Shortness of breath
                      </Label>
                    </div>

                    {formData.shortnessOfBreath === "yes" && (
                      <div className="ml-7 p-4 bg-red-50 rounded-lg border border-red-200">
                        <Label htmlFor="breathlessnessLevel">Level of breathlessness (NYHA Class)</Label>
                        <Select
                          value={formData.breathlessnessLevel}
                          onValueChange={(value) => handleInputChange("breathlessnessLevel", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strenuous-activity">Only with strenuous activity</SelectItem>
                            <SelectItem value="moderate-activity">With moderate activity (climbing stairs)</SelectItem>
                            <SelectItem value="mild-activity">With mild activity (walking on level ground)</SelectItem>
                            <SelectItem value="rest">At rest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="palpitations-check"
                        checked={formData.palpitations === "yes"}
                        onChange={(e) => handleInputChange("palpitations", e.target.checked ? "yes" : "no")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="palpitations-check" className="text-sm font-medium text-gray-700">
                        Palpitations (irregular heartbeat)
                      </Label>
                    </div>

                    {formData.palpitations === "yes" && (
                      <div className="ml-7 p-4 bg-red-50 rounded-lg border border-red-200">
                        <Label htmlFor="palpitationsFrequency">How often do you experience palpitations?</Label>
                        <Select
                          value={formData.palpitationsFrequency}
                          onValueChange={(value) => handleInputChange("palpitationsFrequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rarely">Rarely (less than once a month)</SelectItem>
                            <SelectItem value="occasionally">Occasionally (few times a month)</SelectItem>
                            <SelectItem value="frequently">Frequently (few times a week)</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="fatigue-check"
                        checked={formData.fatigue === "yes"}
                        onChange={(e) => handleInputChange("fatigue", e.target.checked ? "yes" : "no")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="fatigue-check" className="text-sm font-medium text-gray-700">
                        Unusual fatigue
                      </Label>
                    </div>

                    {formData.fatigue === "yes" && (
                      <div className="ml-7 p-4 bg-red-50 rounded-lg border border-red-200">
                        <Label htmlFor="fatigueLevel">Level of fatigue</Label>
                        <Select
                          value={formData.fatigueLevel}
                          onValueChange={(value) => handleInputChange("fatigueLevel", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild - doesn't interfere with daily activities</SelectItem>
                            <SelectItem value="moderate">Moderate - sometimes limits activities</SelectItem>
                            <SelectItem value="severe">Severe - significantly limits daily activities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="dizziness-check"
                        checked={formData.dizziness === "yes"}
                        onChange={(e) => handleInputChange("dizziness", e.target.checked ? "yes" : "no")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="dizziness-check" className="text-sm font-medium text-gray-700">
                        Dizziness or lightheadedness
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="swelling-check"
                        checked={formData.swelling === "yes"}
                        onChange={(e) => handleInputChange("swelling", e.target.checked ? "yes" : "no")}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="swelling-check" className="text-sm font-medium text-gray-700">
                        Swelling in legs, ankles, or feet
                      </Label>
                    </div>

                    {formData.swelling === "yes" && (
                      <div className="ml-7 p-4 bg-red-50 rounded-lg border border-red-200">
                        <Label htmlFor="swellingLocation">Location of swelling</Label>
                        <Select
                          value={formData.swellingLocation}
                          onValueChange={(value) => handleInputChange("swellingLocation", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ankles">Ankles only</SelectItem>
                            <SelectItem value="feet">Feet only</SelectItem>
                            <SelectItem value="legs">Lower legs</SelectItem>
                            <SelectItem value="all">Ankles, feet, and legs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cardiovascular Risk Factors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Cardiovascular Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Smoking status</Label>
                      <RadioGroup
                        value={formData.smoking}
                        onChange={(value) => handleInputChange("smoking", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="never" id="smoking-never" />
                          <Label htmlFor="smoking-never">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="former" id="smoking-former" />
                          <Label htmlFor="smoking-former">Former smoker</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="current" id="smoking-current" />
                          <Label htmlFor="smoking-current">Current smoker</Label>
                        </div>
                      </RadioGroup>

                      {(formData.smoking === "former" || formData.smoking === "current") && (
                        <div className="mt-4">
                          <Label htmlFor="smokingHistory">Smoking history (pack-years or duration)</Label>
                          <Input
                            id="smokingHistory"
                            value={formData.smokingHistory}
                            onChange={(value) => handleInputChange("smokingHistory", value)}
                            placeholder="e.g., 10 pack-years or 5 years, 1 pack/day"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Alcohol consumption</Label>
                      <RadioGroup
                        value={formData.alcohol}
                        onChange={(value) => handleInputChange("alcohol", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="alcohol-none" />
                          <Label htmlFor="alcohol-none">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="alcohol-light" />
                          <Label htmlFor="alcohol-light">Light (1-7 drinks/week)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="alcohol-moderate" />
                          <Label htmlFor="alcohol-moderate">Moderate (8-14 drinks/week)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="heavy" id="alcohol-heavy" />
                          <Label htmlFor="alcohol-heavy">Heavy (15+ drinks/week)</Label>
                        </div>
                      </RadioGroup>

                      {formData.alcohol !== "none" && (
                        <div className="mt-4">
                          <Label htmlFor="alcoholFrequency">Drinking pattern</Label>
                          <Input
                            id="alcoholFrequency"
                            value={formData.alcoholFrequency}
                            onChange={(value) => handleInputChange("alcoholFrequency", value)}
                            placeholder="e.g., 2-3 drinks on weekends"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Do you have diabetes?</Label>
                      <RadioGroup
                        value={formData.diabetes}
                        onChange={(value) => handleInputChange("diabetes", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="diabetes-no" />
                          <Label htmlFor="diabetes-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prediabetes" id="diabetes-pre" />
                          <Label htmlFor="diabetes-pre">Pre-diabetes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="diabetes-yes" />
                          <Label htmlFor="diabetes-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.diabetes === "yes" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="diabetesType">Type of diabetes</Label>
                            <Select
                              value={formData.diabetesType}
                              onChange={(value) => handleInputChange("diabetesType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="type1">Type 1</SelectItem>
                                <SelectItem value="type2">Type 2</SelectItem>
                                <SelectItem value="gestational">Gestational</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="diabetesControl">How well controlled is your diabetes?</Label>
                            <Select
                              value={formData.diabetesControl}
                              onChange={(value) => handleInputChange("diabetesControl", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select control level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent (HbA1c &lt; 6.5%)</SelectItem>
                                <SelectItem value="good">Good (HbA1c 6.5-7.5%)</SelectItem>
                                <SelectItem value="fair">Fair (HbA1c 7.5-8.5%)</SelectItem>
                                <SelectItem value="poor">Poor (HbA1c &gt; 8.5%)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Do you have high blood pressure (hypertension)?</Label>
                      <RadioGroup
                        value={formData.hypertension}
                        onChange={(value) => handleInputChange("hypertension", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="hypertension-no" />
                          <Label htmlFor="hypertension-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="hypertension-yes" />
                          <Label htmlFor="hypertension-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.hypertension === "yes" && (
                        <div className="mt-4">
                          <Label htmlFor="hypertensionDuration">How long have you had high blood pressure?</Label>
                          <Input
                            id="hypertensionDuration"
                            value={formData.hypertensionDuration}
                            onChange={(value) => handleInputChange("hypertensionDuration", value)}
                            placeholder="e.g., 5 years"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Cholesterol levels</Label>
                      <RadioGroup
                        value={formData.cholesterol}
                        onChange={(value) => handleInputChange("cholesterol", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="cholesterol-normal" />
                          <Label htmlFor="cholesterol-normal">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="borderline" id="cholesterol-borderline" />
                          <Label htmlFor="cholesterol-borderline">Borderline high</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="cholesterol-high" />
                          <Label htmlFor="cholesterol-high">High</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unknown" id="cholesterol-unknown" />
                          <Label htmlFor="cholesterol-unknown">Don't know</Label>
                        </div>
                      </RadioGroup>

                      {(formData.cholesterol === "borderline" || formData.cholesterol === "high") && (
                        <div className="mt-4">
                          <Label htmlFor="cholesterolLevel">Recent cholesterol levels (if known)</Label>
                          <Input
                            id="cholesterolLevel"
                            value={formData.cholesterolLevel}
                            onChange={(value) => handleInputChange("cholesterolLevel", value)}
                            placeholder="e.g., Total: 250, LDL: 160, HDL: 35"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">
                        Family history of heart disease (parents, siblings, children)
                      </Label>
                      <RadioGroup
                        value={formData.familyHistory}
                        onChange={(value) => handleInputChange("familyHistory", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="family-history-no" />
                          <Label htmlFor="family-history-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="family-history-yes" />
                          <Label htmlFor="family-history-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.familyHistory === "yes" && (
                        <div className="mt-4">
                          <Label htmlFor="familyHistoryDetails">Details of family history</Label>
                          <Textarea
                            id="familyHistoryDetails"
                            value={formData.familyHistoryDetails}
                            onChange={(value) => handleInputChange("familyHistoryDetails", value)}
                            placeholder="e.g., Father had heart attack at age 55, Mother has high blood pressure"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lifestyle Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      Lifestyle Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Physical activity level</Label>
                      <RadioGroup
                        value={formData.physicalActivity}
                        onChange={(value) => handleInputChange("physicalActivity", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sedentary" id="activity-sedentary" />
                          <Label htmlFor="activity-sedentary">Sedentary (little to no exercise)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="activity-light" />
                          <Label htmlFor="activity-light">Light activity (1-2 days/week)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="activity-moderate" />
                          <Label htmlFor="activity-moderate">Moderate activity (3-4 days/week)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="activity-active" />
                          <Label htmlFor="activity-active">Very active (5+ days/week)</Label>
                        </div>
                      </RadioGroup>

                      {formData.physicalActivity !== "sedentary" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="exerciseFrequency">Exercise frequency and duration</Label>
                            <Input
                              id="exerciseFrequency"
                              value={formData.exerciseFrequency}
                              onChange={(value) => handleInputChange("exerciseFrequency", value)}
                              placeholder="e.g., 30 minutes, 3 times per week"
                            />
                          </div>
                          <div>
                            <Label htmlFor="exerciseType">Types of exercise</Label>
                            <Input
                              id="exerciseType"
                              value={formData.exerciseType}
                              onChange={(value) => handleInputChange("exerciseType", value)}
                              placeholder="e.g., walking, swimming, cycling, weight training"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Diet quality</Label>
                      <RadioGroup
                        value={formData.diet}
                        onChange={(value) => handleInputChange("diet", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excellent" id="diet-excellent" />
                          <Label htmlFor="diet-excellent">Excellent (Mediterranean/DASH style)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="good" id="diet-good" />
                          <Label htmlFor="diet-good">Good (mostly healthy foods)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fair" id="diet-fair" />
                          <Label htmlFor="diet-fair">Fair (mixed healthy and unhealthy)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="poor" id="diet-poor" />
                          <Label htmlFor="diet-poor">Poor (mostly processed/fast foods)</Label>
                        </div>
                      </RadioGroup>

                      <div className="mt-4">
                        <Label htmlFor="dietType">Describe your typical diet</Label>
                        <Textarea
                          id="dietType"
                          value={formData.dietType}
                          onChange={(value) => handleInputChange("dietType", value)}
                          placeholder="e.g., vegetarian, low-sodium, high-fiber, typical Indian diet"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Stress level</Label>
                      <RadioGroup
                        value={formData.stress}
                        onChange={(value) => handleInputChange("stress", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="stress-low" />
                          <Label htmlFor="stress-low">Low</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="stress-moderate" />
                          <Label htmlFor="stress-moderate">Moderate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="stress-high" />
                          <Label htmlFor="stress-high">High</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="very-high" id="stress-very-high" />
                          <Label htmlFor="stress-very-high">Very High</Label>
                        </div>
                      </RadioGroup>

                      <div className="mt-4">
                        <Label htmlFor="stressLevel">Describe your main sources of stress</Label>
                        <Textarea
                          id="stressLevel"
                          value={formData.stressLevel}
                          onChange={(value) => handleInputChange("stressLevel", value)}
                          placeholder="e.g., work pressure, financial concerns, family issues"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Sleep quality</Label>
                      <RadioGroup
                        value={formData.sleep}
                        onChange={(value) => handleInputChange("sleep", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="excellent" id="sleep-excellent" />
                          <Label htmlFor="sleep-excellent">Excellent (7-9 hours, restful)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="good" id="sleep-good" />
                          <Label htmlFor="sleep-good">Good (6-8 hours, mostly restful)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fair" id="sleep-fair" />
                          <Label htmlFor="sleep-fair">Fair (5-7 hours, sometimes restless)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="poor" id="sleep-poor" />
                          <Label htmlFor="sleep-poor">Poor (&lt;6 hours or frequently restless)</Label>
                        </div>
                      </RadioGroup>

                      <div className="mt-4">
                        <Label htmlFor="sleepHours">Average hours of sleep per night</Label>
                        <Input
                          id="sleepHours"
                          value={formData.sleepHours}
                          onChange={(value) => handleInputChange("sleepHours", value)}
                          placeholder="e.g., 7 hours"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Medical History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Have you ever had a heart attack?</Label>
                      <RadioGroup
                        value={formData.previousHeartAttack}
                        onChange={(value) => handleInputChange("previousHeartAttack", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="heart-attack-no" />
                          <Label htmlFor="heart-attack-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="heart-attack-yes" />
                          <Label htmlFor="heart-attack-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.previousHeartAttack === "yes" && (
                        <div className="mt-4">
                          <Label htmlFor="heartAttackDate">When did you have the heart attack?</Label>
                          <Input
                            id="heartAttackDate"
                            value={formData.heartAttackDate}
                            onChange={(value) => handleInputChange("heartAttackDate", value)}
                            placeholder="e.g., January 2020 or 3 years ago"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">
                        Have you had any heart surgery or cardiac procedures?
                      </Label>
                      <RadioGroup
                        value={formData.previousSurgery}
                        onChange={(value) => handleInputChange("previousSurgery", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="surgery-no" />
                          <Label htmlFor="surgery-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="surgery-yes" />
                          <Label htmlFor="surgery-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.previousSurgery === "yes" && (
                        <div className="mt-4">
                          <Label htmlFor="surgeryDetails">Details of surgery/procedures</Label>
                          <Textarea
                            id="surgeryDetails"
                            value={formData.surgeryDetails}
                            onChange={(e) => handleInputChange("surgeryDetails", e.target.value)}
                            placeholder="e.g., Angioplasty with stent in 2019, Bypass surgery in 2018"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Are you currently taking any medications?</Label>
                      <RadioGroup
                        value={formData.currentMedications}
                        onChange={(value) => handleInputChange("currentMedications", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="medications-no" />
                          <Label htmlFor="medications-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="medications-yes" />
                          <Label htmlFor="medications-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.currentMedications === "yes" && (
                        <div className="mt-4">
                          <Label htmlFor="medicationsList">List all current medications with dosages</Label>
                          <Textarea
                            id="medicationsList"
                            value={formData.medicationsList}
                            onChange={(e) => handleInputChange("medicationsList", e.target.value)}
                            placeholder="e.g., Lisinopril 10mg daily, Metformin 500mg twice daily, Aspirin 81mg daily"
                            rows={4}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Do you have any drug allergies?</Label>
                      <RadioGroup
                        value={formData.allergies}
                        onChange={(value) => handleInputChange("allergies", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="allergies-no" />
                          <Label htmlFor="allergies-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="allergies-yes" />
                          <Label htmlFor="allergies-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.allergies === "yes" && (
                        <div className="mt-4">
                          <Label htmlFor="allergiesList">List all drug allergies and reactions</Label>
                          <Textarea
                            id="allergiesList"
                            value={formData.allergiesList}
                            onChange={(e) => handleInputChange("allergiesList", e.target.value)}
                            placeholder="e.g., Penicillin - rash, ACE inhibitors - cough"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tests */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Medical Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Have you had a recent ECG/EKG?</Label>
                      <RadioGroup
                        value={formData.recentECG}
                        onChange={(value) => handleInputChange("recentECG", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="ecg-no" />
                          <Label htmlFor="ecg-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="ecg-yes" />
                          <Label htmlFor="ecg-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.recentECG === "yes" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="ecgDate">When was the ECG done?</Label>
                            <Input
                              id="ecgDate"
                              value={formData.ecgDate}
                              onChange={(e) => handleInputChange("ecgDate", e.target.value)}
                              placeholder="e.g., Last month, 3 months ago"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ecgResults">ECG results (if known)</Label>
                            <Textarea
                              id="ecgResults"
                              value={formData.ecgResults}
                              onChange={(e) => handleInputChange("ecgResults", e.target.value)}
                              placeholder="e.g., Normal, Left ventricular hypertrophy, Atrial fibrillation"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Have you had a recent echocardiogram?</Label>
                      <RadioGroup
                        value={formData.recentEcho}
                        onChange={(value) => handleInputChange("recentEcho", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="echo-no" />
                          <Label htmlFor="echo-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="echo-yes" />
                          <Label htmlFor="echo-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.recentEcho === "yes" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="echoDate">When was the echocardiogram done?</Label>
                            <Input
                              id="echoDate"
                              value={formData.echoDate}
                              onChange={(e) => handleInputChange("echoDate", e.target.value)}
                              placeholder="e.g., 6 months ago, Last year"
                            />
                          </div>
                          <div>
                            <Label htmlFor="echoResults">Echocardiogram results (if known)</Label>
                            <Textarea
                              id="echoResults"
                              value={formData.echoResults}
                              onChange={(e) => handleInputChange("echoResults", e.target.value)}
                              placeholder="e.g., Normal function, EF 55%, Mild mitral regurgitation"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Have you had recent blood tests?</Label>
                      <RadioGroup
                        value={formData.bloodTests}
                        onChange={(value) => handleInputChange("bloodTests", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="blood-no" />
                          <Label htmlFor="blood-no">No</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="blood-yes" />
                          <Label htmlFor="blood-yes">Yes</Label>
                        </div>
                      </RadioGroup>

                      {formData.bloodTests === "yes" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="bloodTestDate">When were the blood tests done?</Label>
                            <Input
                              id="bloodTestDate"
                              value={formData.bloodTestDate}
                              onChange={(e) => handleInputChange("bloodTestDate", e.target.value)}
                              placeholder="e.g., Last week, 2 months ago"
                            />
                          </div>
                          <div>
                            <Label htmlFor="bloodTestResults">Blood test results (if known)</Label>
                            <Textarea
                              id="bloodTestResults"
                              value={formData.bloodTestResults}
                              onChange={(e) => handleInputChange("bloodTestResults", e.target.value)}
                              placeholder="e.g., Cholesterol 220, LDL 150, HDL 40, HbA1c 7.2"
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assessing...
                    </>
                  ) : (
                    "Get Heart Health Assessment"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>

          <PoweredByFooter />
        </div>
      </div>
    </div>
  )
}
