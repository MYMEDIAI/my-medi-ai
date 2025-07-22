"use client"

import { useState } from "react"
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
  MessageCircle,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface HeartHealthData {
  // Personal Information
  name: string
  age: string
  gender: string
  weight: string
  height: string
  waistCircumference: string

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

export default function HeartHealthAssessment() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<HeartHealthData>({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    waistCircumference: "",
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

  const [assessmentResults, setAssessmentResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof HeartHealthData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateRiskScore = () => {
    let riskScore = 0
    const riskFactors = []

    // Age risk
    const age = Number.parseInt(formData.age)
    if (age > 65) {
      riskScore += 2
      riskFactors.push("Advanced age (>65)")
    } else if (age > 45) {
      riskScore += 1
      riskFactors.push("Middle age (45-65)")
    }

    // Gender risk
    if (formData.gender === "male") {
      riskScore += 1
      riskFactors.push("Male gender")
    }

    // Smoking
    if (formData.smoking === "current") {
      riskScore += 3
      riskFactors.push("Current smoking")
    } else if (formData.smoking === "former") {
      riskScore += 1
      riskFactors.push("Former smoking")
    }

    // Diabetes
    if (formData.diabetes === "yes") {
      riskScore += 2
      riskFactors.push("Diabetes mellitus")
    }

    // Hypertension
    if (formData.hypertension === "yes") {
      riskScore += 2
      riskFactors.push("Hypertension")
    }

    // High cholesterol
    if (formData.cholesterol === "high") {
      riskScore += 2
      riskFactors.push("High cholesterol")
    }

    // Family history
    if (formData.familyHistory === "yes") {
      riskScore += 2
      riskFactors.push("Family history of heart disease")
    }

    // Physical inactivity
    if (formData.physicalActivity === "sedentary") {
      riskScore += 1
      riskFactors.push("Sedentary lifestyle")
    }

    // Symptoms
    if (formData.chestPain === "yes") {
      riskScore += 2
      riskFactors.push("Chest pain")
    }

    if (formData.shortnessOfBreath === "yes") {
      riskScore += 2
      riskFactors.push("Shortness of breath")
    }

    return { riskScore, riskFactors }
  }

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: "Low", color: "green", description: "Low risk for cardiovascular events" }
    if (score <= 6)
      return { level: "Moderate", color: "yellow", description: "Moderate risk - lifestyle changes recommended" }
    if (score <= 10) return { level: "High", color: "orange", description: "High risk - medical evaluation needed" }
    return { level: "Very High", color: "red", description: "Very high risk - immediate medical attention required" }
  }

  const handleSubmit = async () => {
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
- Risk Score: ${riskScore}/15
- Risk Level: ${riskLevel.level}
- Risk Factors: ${riskFactors.join(", ")}

Please provide a comprehensive cardiac assessment following ACC/AHA 2023 guidelines and CSI recommendations for Indian patients, including:

1. CLINICAL ASSESSMENT & DIAGNOSIS
2. RISK STRATIFICATION (10-year cardiovascular risk)
3. IMMEDIATE RECOMMENDATIONS
4. LIFESTYLE MODIFICATIONS
5. MEDICATION RECOMMENDATIONS
6. DIAGNOSTIC TESTS NEEDED
7. SPECIALIST REFERRALS
8. EMERGENCY WARNING SIGNS
9. FOLLOW-UP SCHEDULE
10. COST-EFFECTIVE OPTIONS IN INDIA

Format as a detailed medical report suitable for both patient and healthcare provider.
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

      setAssessmentResults({
        ...data,
        riskScore,
        riskLevel,
        riskFactors,
        bmi: bmi.toFixed(1),
        patientData: formData,
      })

      setCurrentStep(totalSteps + 1) // Move to results step
    } catch (error) {
      console.error("Assessment error:", error)
      // Provide fallback results
      const { riskScore, riskFactors } = calculateRiskScore()
      const riskLevel = getRiskLevel(riskScore)

      setAssessmentResults({
        response: "Unable to connect to AI service. Please consult with a cardiologist for proper evaluation.",
        riskScore,
        riskLevel,
        riskFactors,
        bmi: (Number.parseFloat(formData.weight) / Math.pow(Number.parseFloat(formData.height) / 100, 2)).toFixed(1),
        patientData: formData,
      })
      setCurrentStep(totalSteps + 1)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    max="300"
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
                    min="50"
                    max="250"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="waistCircumference">Waist Circumference (cm)</Label>
                  <Input
                    id="waistCircumference"
                    type="number"
                    value={formData.waistCircumference}
                    onChange={(e) => handleInputChange("waistCircumference", e.target.value)}
                    placeholder="Measure at navel level"
                    min="50"
                    max="200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="systolicBP">Systolic Blood Pressure (mmHg) *</Label>
                  <Input
                    id="systolicBP"
                    type="number"
                    value={formData.systolicBP}
                    onChange={(e) => handleInputChange("systolicBP", e.target.value)}
                    placeholder="e.g., 120"
                    min="70"
                    max="250"
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
                    max="150"
                    required
                  />
                </div>
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
                  <Label htmlFor="temperature">Body Temperature (°F)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                    placeholder="e.g., 98.6"
                    min="95"
                    max="110"
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
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  If you don't have recent measurements, please visit a healthcare provider or pharmacy for accurate
                  readings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Cardiac Symptoms Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chest Pain */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you experience chest pain or discomfort?</Label>
                <RadioGroup value={formData.chestPain} onValueChange={(value) => handleInputChange("chestPain", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="chest-pain-no" />
                    <Label htmlFor="chest-pain-no">No chest pain</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="chest-pain-yes" />
                    <Label htmlFor="chest-pain-yes">Yes, I have chest pain</Label>
                  </div>
                </RadioGroup>

                {formData.chestPain === "yes" && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label>Type of chest pain:</Label>
                      <Select
                        value={formData.chestPainType}
                        onValueChange={(value) => handleInputChange("chestPainType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crushing">Crushing/Squeezing</SelectItem>
                          <SelectItem value="burning">Burning</SelectItem>
                          <SelectItem value="sharp">Sharp/Stabbing</SelectItem>
                          <SelectItem value="dull">Dull ache</SelectItem>
                          <SelectItem value="pressure">Pressure/Tightness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>What triggers the chest pain?</Label>
                      <Select
                        value={formData.chestPainTrigger}
                        onValueChange={(value) => handleInputChange("chestPainTrigger", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exertion">Physical exertion</SelectItem>
                          <SelectItem value="rest">At rest</SelectItem>
                          <SelectItem value="stress">Emotional stress</SelectItem>
                          <SelectItem value="eating">After eating</SelectItem>
                          <SelectItem value="cold">Cold weather</SelectItem>
                          <SelectItem value="random">No specific trigger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Shortness of Breath */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you experience shortness of breath?</Label>
                <RadioGroup
                  value={formData.shortnessOfBreath}
                  onValueChange={(value) => handleInputChange("shortnessOfBreath", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="breath-no" />
                    <Label htmlFor="breath-no">No shortness of breath</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="breath-yes" />
                    <Label htmlFor="breath-yes">Yes, I have shortness of breath</Label>
                  </div>
                </RadioGroup>

                {formData.shortnessOfBreath === "yes" && (
                  <div className="ml-6">
                    <Label>NYHA Functional Class - When do you feel short of breath?</Label>
                    <Select
                      value={formData.breathlessnessLevel}
                      onValueChange={(value) => handleInputChange("breathlessnessLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class1">Class I - Only with strenuous activity</SelectItem>
                        <SelectItem value="class2">Class II - With moderate activity (climbing stairs)</SelectItem>
                        <SelectItem value="class3">Class III - With mild activity (walking on level ground)</SelectItem>
                        <SelectItem value="class4">Class IV - At rest or with minimal activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Palpitations */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Do you experience palpitations (irregular or rapid heartbeat)?
                </Label>
                <RadioGroup
                  value={formData.palpitations}
                  onValueChange={(value) => handleInputChange("palpitations", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="palpitations-no" />
                    <Label htmlFor="palpitations-no">No palpitations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="palpitations-yes" />
                    <Label htmlFor="palpitations-yes">Yes, I have palpitations</Label>
                  </div>
                </RadioGroup>

                {formData.palpitations === "yes" && (
                  <div className="ml-6">
                    <Label>How often do you experience palpitations?</Label>
                    <Select
                      value={formData.palpitationsFrequency}
                      onValueChange={(value) => handleInputChange("palpitationsFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Other Symptoms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-semibold">Unusual fatigue or weakness?</Label>
                  <Select value={formData.fatigue} onValueChange={(value) => handleInputChange("fatigue", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No unusual fatigue</SelectItem>
                      <SelectItem value="mild">Mild fatigue</SelectItem>
                      <SelectItem value="moderate">Moderate fatigue</SelectItem>
                      <SelectItem value="severe">Severe fatigue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold">Dizziness or lightheadedness?</Label>
                  <Select value={formData.dizziness} onValueChange={(value) => handleInputChange("dizziness", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No dizziness</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="frequent">Frequent</SelectItem>
                      <SelectItem value="severe">Severe/Fainting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swelling */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you have swelling in your legs, ankles, or feet?</Label>
                <RadioGroup value={formData.swelling} onValueChange={(value) => handleInputChange("swelling", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="swelling-no" />
                    <Label htmlFor="swelling-no">No swelling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="swelling-yes" />
                    <Label htmlFor="swelling-yes">Yes, I have swelling</Label>
                  </div>
                </RadioGroup>

                {formData.swelling === "yes" && (
                  <div className="ml-6">
                    <Label>Where is the swelling located?</Label>
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
                        <SelectItem value="abdomen">Abdomen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Cardiovascular Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Smoking */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Smoking Status</Label>
                <RadioGroup value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="smoking-never" />
                    <Label htmlFor="smoking-never">Never smoked</Label>
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
                  <div className="ml-6">
                    <Label>Smoking history (pack-years or duration):</Label>
                    <Input
                      value={formData.smokingHistory}
                      onChange={(e) => handleInputChange("smokingHistory", e.target.value)}
                      placeholder="e.g., 20 pack-years or 10 years, 1 pack/day"
                    />
                  </div>
                )}
              </div>

              {/* Alcohol */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Alcohol Consumption</Label>
                <RadioGroup value={formData.alcohol} onValueChange={(value) => handleInputChange("alcohol", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="alcohol-none" />
                    <Label htmlFor="alcohol-none">No alcohol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasional" id="alcohol-occasional" />
                    <Label htmlFor="alcohol-occasional">Occasional (social drinking)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="alcohol-regular" />
                    <Label htmlFor="alcohol-regular">Regular consumption</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="heavy" id="alcohol-heavy" />
                    <Label htmlFor="alcohol-heavy">Heavy drinking</Label>
                  </div>
                </RadioGroup>

                {(formData.alcohol === "regular" || formData.alcohol === "heavy") && (
                  <div className="ml-6">
                    <Label>How often and how much?</Label>
                    <Input
                      value={formData.alcoholFrequency}
                      onChange={(e) => handleInputChange("alcoholFrequency", e.target.value)}
                      placeholder="e.g., 2-3 drinks daily, wine with dinner"
                    />
                  </div>
                )}
              </div>

              {/* Diabetes */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you have diabetes?</Label>
                <RadioGroup value={formData.diabetes} onValueChange={(value) => handleInputChange("diabetes", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="diabetes-no" />
                    <Label htmlFor="diabetes-no">No diabetes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prediabetes" id="diabetes-pre" />
                    <Label htmlFor="diabetes-pre">Pre-diabetes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="diabetes-yes" />
                    <Label htmlFor="diabetes-yes">Yes, I have diabetes</Label>
                  </div>
                </RadioGroup>

                {formData.diabetes === "yes" && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label>Type of diabetes:</Label>
                      <Select
                        value={formData.diabetesType}
                        onValueChange={(value) => handleInputChange("diabetesType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="type1">Type 1</SelectItem>
                          <SelectItem value="type2">Type 2</SelectItem>
                          <SelectItem value="gestational">Gestational</SelectItem>
                          <SelectItem value="unknown">Not sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>How well controlled is your diabetes?</Label>
                      <Select
                        value={formData.diabetesControl}
                        onValueChange={(value) => handleInputChange("diabetesControl", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select control level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (HbA1c &lt; 7%)</SelectItem>
                          <SelectItem value="good">Good (HbA1c 7-8%)</SelectItem>
                          <SelectItem value="fair">Fair (HbA1c 8-9%)</SelectItem>
                          <SelectItem value="poor">Poor (HbA1c &gt; 9%)</SelectItem>
                          <SelectItem value="unknown">Don't know recent HbA1c</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Hypertension */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you have high blood pressure (hypertension)?</Label>
                <RadioGroup
                  value={formData.hypertension}
                  onValueChange={(value) => handleInputChange("hypertension", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hypertension-no" />
                    <Label htmlFor="hypertension-no">No high blood pressure</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="borderline" id="hypertension-borderline" />
                    <Label htmlFor="hypertension-borderline">Borderline/Pre-hypertension</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hypertension-yes" />
                    <Label htmlFor="hypertension-yes">Yes, I have hypertension</Label>
                  </div>
                </RadioGroup>

                {formData.hypertension === "yes" && (
                  <div className="ml-6">
                    <Label>How long have you had high blood pressure?</Label>
                    <Select
                      value={formData.hypertensionDuration}
                      onValueChange={(value) => handleInputChange("hypertensionDuration", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently diagnosed (&lt; 1 year)</SelectItem>
                        <SelectItem value="1-5years">1-5 years</SelectItem>
                        <SelectItem value="5-10years">5-10 years</SelectItem>
                        <SelectItem value="10+years">More than 10 years</SelectItem>
                        <SelectItem value="unknown">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Cholesterol */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Cholesterol Status</Label>
                <RadioGroup
                  value={formData.cholesterol}
                  onValueChange={(value) => handleInputChange("cholesterol", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="cholesterol-normal" />
                    <Label htmlFor="cholesterol-normal">Normal cholesterol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="borderline" id="cholesterol-borderline" />
                    <Label htmlFor="cholesterol-borderline">Borderline high</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="cholesterol-high" />
                    <Label htmlFor="cholesterol-high">High cholesterol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="cholesterol-unknown" />
                    <Label htmlFor="cholesterol-unknown">Never tested/Don't know</Label>
                  </div>
                </RadioGroup>

                {(formData.cholesterol === "borderline" || formData.cholesterol === "high") && (
                  <div className="ml-6">
                    <Label>Recent cholesterol levels (if known):</Label>
                    <Input
                      value={formData.cholesterolLevel}
                      onChange={(e) => handleInputChange("cholesterolLevel", e.target.value)}
                      placeholder="e.g., Total: 240, LDL: 160, HDL: 35"
                    />
                  </div>
                )}
              </div>

              {/* Family History */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Family History of Heart Disease</Label>
                <RadioGroup
                  value={formData.familyHistory}
                  onValueChange={(value) => handleInputChange("familyHistory", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="family-no" />
                    <Label htmlFor="family-no">No family history</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="family-yes" />
                    <Label htmlFor="family-yes">Yes, family history of heart disease</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="family-unknown" />
                    <Label htmlFor="family-unknown">Don't know family history</Label>
                  </div>
                </RadioGroup>

                {formData.familyHistory === "yes" && (
                  <div className="ml-6">
                    <Label>Details of family history:</Label>
                    <Textarea
                      value={formData.familyHistoryDetails}
                      onChange={(e) => handleInputChange("familyHistoryDetails", e.target.value)}
                      placeholder="e.g., Father had heart attack at age 55, Mother has high blood pressure"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Lifestyle Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Physical Activity */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Physical Activity Level</Label>
                <RadioGroup
                  value={formData.physicalActivity}
                  onValueChange={(value) => handleInputChange("physicalActivity", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentary" id="activity-sedentary" />
                    <Label htmlFor="activity-sedentary">Sedentary (little to no exercise)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="activity-light" />
                    <Label htmlFor="activity-light">Light activity (1-3 days/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="activity-moderate" />
                    <Label htmlFor="activity-moderate">Moderate activity (3-5 days/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vigorous" id="activity-vigorous" />
                    <Label htmlFor="activity-vigorous">Vigorous activity (6-7 days/week)</Label>
                  </div>
                </RadioGroup>

                {formData.physicalActivity !== "sedentary" && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label>How often do you exercise per week?</Label>
                      <Input
                        value={formData.exerciseFrequency}
                        onChange={(e) => handleInputChange("exerciseFrequency", e.target.value)}
                        placeholder="e.g., 3-4 times per week, 30 minutes each"
                      />
                    </div>
                    <div>
                      <Label>Type of exercise:</Label>
                      <Input
                        value={formData.exerciseType}
                        onChange={(e) => handleInputChange("exerciseType", e.target.value)}
                        placeholder="e.g., walking, jogging, swimming, yoga, gym"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Diet */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Dietary Habits</Label>
                <RadioGroup value={formData.diet} onValueChange={(value) => handleInputChange("diet", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="diet-poor" />
                    <Label htmlFor="diet-poor">Poor diet (high processed foods, fast food)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="average" id="diet-average" />
                    <Label htmlFor="diet-average">Average diet (mixed healthy and unhealthy foods)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="diet-good" />
                    <Label htmlFor="diet-good">Good diet (mostly healthy foods)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="diet-excellent" />
                    <Label htmlFor="diet-excellent">Excellent diet (heart-healthy, Mediterranean-style)</Label>
                  </div>
                </RadioGroup>

                <div className="ml-6">
                  <Label>Specific dietary preferences or restrictions:</Label>
                  <Input
                    value={formData.dietType}
                    onChange={(e) => handleInputChange("dietType", e.target.value)}
                    placeholder="e.g., vegetarian, low-salt, diabetic diet, traditional Indian"
                  />
                </div>
              </div>

              {/* Stress */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Stress Level</Label>
                <RadioGroup value={formData.stress} onValueChange={(value) => handleInputChange("stress", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="stress-low" />
                    <Label htmlFor="stress-low">Low stress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="stress-moderate" />
                    <Label htmlFor="stress-moderate">Moderate stress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="stress-high" />
                    <Label htmlFor="stress-high">High stress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="stress-severe" />
                    <Label htmlFor="stress-severe">Severe/Overwhelming stress</Label>
                  </div>
                </RadioGroup>

                {(formData.stress === "high" || formData.stress === "severe") && (
                  <div className="ml-6">
                    <Label>Rate your stress level (1-10):</Label>
                    <Select
                      value={formData.stressLevel}
                      onValueChange={(value) => handleInputChange("stressLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1} {i < 3 ? "(Low)" : i < 6 ? "(Moderate)" : i < 8 ? "(High)" : "(Severe)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Sleep */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Sleep Quality</Label>
                <RadioGroup value={formData.sleep} onValueChange={(value) => handleInputChange("sleep", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="sleep-excellent" />
                    <Label htmlFor="sleep-excellent">Excellent sleep quality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="sleep-good" />
                    <Label htmlFor="sleep-good">Good sleep quality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="sleep-fair" />
                    <Label htmlFor="sleep-fair">Fair sleep quality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="sleep-poor" />
                    <Label htmlFor="sleep-poor">Poor sleep quality</Label>
                  </div>
                </RadioGroup>

                <div className="ml-6">
                  <Label>Average hours of sleep per night:</Label>
                  <Select value={formData.sleepHours} onValueChange={(value) => handleInputChange("sleepHours", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<5">Less than 5 hours</SelectItem>
                      <SelectItem value="5-6">5-6 hours</SelectItem>
                      <SelectItem value="6-7">6-7 hours</SelectItem>
                      <SelectItem value="7-8">7-8 hours</SelectItem>
                      <SelectItem value="8-9">8-9 hours</SelectItem>
                      <SelectItem value=">9">More than 9 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Previous Heart Attack */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Have you ever had a heart attack?</Label>
                <RadioGroup
                  value={formData.previousHeartAttack}
                  onValueChange={(value) => handleInputChange("previousHeartAttack", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="heart-attack-no" />
                    <Label htmlFor="heart-attack-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="heart-attack-yes" />
                    <Label htmlFor="heart-attack-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsure" id="heart-attack-unsure" />
                    <Label htmlFor="heart-attack-unsure">Not sure</Label>
                  </div>
                </RadioGroup>

                {formData.previousHeartAttack === "yes" && (
                  <div className="ml-6">
                    <Label>When did this occur?</Label>
                    <Input
                      value={formData.heartAttackDate}
                      onChange={(e) => handleInputChange("heartAttackDate", e.target.value)}
                      placeholder="e.g., January 2020, 2 years ago"
                    />
                  </div>
                )}
              </div>

              {/* Previous Surgery */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Have you had any heart surgery or procedures?</Label>
                <RadioGroup
                  value={formData.previousSurgery}
                  onValueChange={(value) => handleInputChange("previousSurgery", value)}
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
                  <div className="ml-6">
                    <Label>Details of surgery/procedures:</Label>
                    <Textarea
                      value={formData.surgeryDetails}
                      onChange={(e) => handleInputChange("surgeryDetails", e.target.value)}
                      placeholder="e.g., Angioplasty with stent in 2019, Bypass surgery in 2018"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Current Medications */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Are you currently taking any medications?</Label>
                <RadioGroup
                  value={formData.currentMedications}
                  onValueChange={(value) => handleInputChange("currentMedications", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="medications-no" />
                    <Label htmlFor="medications-no">No medications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="medications-yes" />
                    <Label htmlFor="medications-yes">Yes, taking medications</Label>
                  </div>
                </RadioGroup>

                {formData.currentMedications === "yes" && (
                  <div className="ml-6">
                    <Label>List all current medications (include dosage if known):</Label>
                    <Textarea
                      value={formData.medicationsList}
                      onChange={(e) => handleInputChange("medicationsList", e.target.value)}
                      placeholder="e.g., Metoprolol 50mg twice daily, Aspirin 75mg once daily, Atorvastatin 20mg at night"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Do you have any drug allergies?</Label>
                <RadioGroup value={formData.allergies} onValueChange={(value) => handleInputChange("allergies", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="allergies-no" />
                    <Label htmlFor="allergies-no">No known allergies</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="allergies-yes" />
                    <Label htmlFor="allergies-yes">Yes, I have allergies</Label>
                  </div>
                </RadioGroup>

                {formData.allergies === "yes" && (
                  <div className="ml-6">
                    <Label>List allergies and reactions:</Label>
                    <Textarea
                      value={formData.allergiesList}
                      onChange={(e) => handleInputChange("allergiesList", e.target.value)}
                      placeholder="e.g., Penicillin - rash, Aspirin - stomach upset"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Recent Medical Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ECG */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Have you had a recent ECG/EKG?</Label>
                <RadioGroup value={formData.recentECG} onValueChange={(value) => handleInputChange("recentECG", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="ecg-no" />
                    <Label htmlFor="ecg-no">No recent ECG</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="ecg-yes" />
                    <Label htmlFor="ecg-yes">Yes, had recent ECG</Label>
                  </div>
                </RadioGroup>

                {formData.recentECG === "yes" && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label>When was the ECG done?</Label>
                      <Input
                        value={formData.ecgDate}
                        onChange={(e) => handleInputChange("ecgDate", e.target.value)}
                        placeholder="e.g., Last month, 2 weeks ago"
                      />
                    </div>
                    <div>
                      <Label>ECG results (if known):</Label>
                      <Textarea
                        value={formData.ecgResults}
                        onChange={(e) => handleInputChange("ecgResults", e.target.value)}
                        placeholder="e.g., Normal, Abnormal T-waves, Left ventricular hypertrophy"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Echocardiogram */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Have you had a recent Echocardiogram (Echo)?</Label>
                <RadioGroup
                  value={formData.recentEcho}
                  onValueChange={(value) => handleInputChange("recentEcho", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="echo-no" />
                    <Label htmlFor="echo-no">No recent Echo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="echo-yes" />
                    <Label htmlFor="echo-yes">Yes, had recent Echo</Label>
                  </div>
                </RadioGroup>

                {formData.recentEcho === "yes" && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label>When was the Echo done?</Label>
                      <Input
                        value={formData.echoDate}
                        onChange={(e) => handleInputChange("echoDate", e.target.value)}
                        placeholder="e.g., 3 months ago, Last year"
                      />
                    </div>
                    <div>
                      <Label>Echo results (if known):</Label>
                      <Textarea
                        value={formData.echoResults}
                        onChange={(e) => handleInputChange("echoResults", e.target.value)}
                        placeholder="e.g., Normal function, EF 55%, Mild mitral regurgitation"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Blood Tests */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Have you had recent blood tests (lipid profile, cardiac enzymes)?
                </Label>
                <RadioGroup
                  value={formData.bloodTests}
                  onValueChange={(value) => handleInputChange("bloodTests", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="blood-no" />
                    <Label htmlFor="blood-no">No recent blood tests</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="blood-yes" />
                    <Label htmlFor="blood-yes">Yes, had recent blood tests</Label>
                  </div>
                </RadioGroup>

                {formData.bloodTests === "yes" && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <Label>When were the blood tests done?</Label>
                      <Input
                        value={formData.bloodTestDate}
                        onChange={(e) => handleInputChange("bloodTestDate", e.target.value)}
                        placeholder="e.g., Last week, 1 month ago"
                      />
                    </div>
                    <div>
                      <Label>Blood test results (if known):</Label>
                      <Textarea
                        value={formData.bloodTestResults}
                        onChange={(e) => handleInputChange("bloodTestResults", e.target.value)}
                        placeholder="e.g., Total cholesterol: 200, LDL: 120, HDL: 45, Triglycerides: 150"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  If you have copies of recent test results, keep them handy. They will be valuable for your healthcare
                  provider's assessment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const renderResults = () => {
    if (!assessmentResults) return null

    const { riskScore, riskLevel, riskFactors, bmi } = assessmentResults

    return (
      <div className="space-y-6">
        {/* Risk Assessment Summary */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600" />
              Cardiovascular Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{bmi}</div>
                <div className="text-sm text-gray-600">BMI (kg/m²)</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{riskScore}/15</div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Badge
                  className={`text-lg px-4 py-2 ${
                    riskLevel.color === "green"
                      ? "bg-green-100 text-green-800"
                      : riskLevel.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : riskLevel.color === "orange"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {riskLevel.level} Risk
                </Badge>
                <div className="text-sm text-gray-600 mt-1">{riskLevel.description}</div>
              </div>
            </div>

            {riskFactors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Identified Risk Factors:</h4>
                <div className="flex flex-wrap gap-2">
                  {riskFactors.map((factor, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Assessment Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-600" />
              AI-Powered Cardiac Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">
                {typeof assessmentResults.response === "string"
                  ? assessmentResults.response
                  : JSON.stringify(assessmentResults.response, null, 2)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Warning */}
        {(riskLevel.level === "High" || riskLevel.level === "Very High") && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Important:</strong> Your assessment indicates elevated cardiovascular risk. Please consult with a
              cardiologist or your primary care physician as soon as possible. If you experience chest pain, shortness
              of breath, or other cardiac symptoms, seek immediate medical attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button
            onClick={() => {
              setCurrentStep(1)
              setAssessmentResults(null)
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            New Assessment
          </Button>
          <Link href="/chat">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <MessageCircle className="w-4 h-4" />
              Chat with AI Doctor
            </Button>
          </Link>
          <Link href="/location">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <MapPin className="w-4 h-4" />
              Find Cardiologist
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo className="text-2xl" />
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comprehensive Heart Health Assessment</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              World-standard cardiac evaluation following ACC/AHA 2023 guidelines and CSI recommendations for Indian
              patients
            </p>
          </div>

          {/* Progress Bar */}
          {currentStep <= totalSteps && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Form Steps */}
          {currentStep <= totalSteps && (
            <>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep === totalSteps ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Complete Assessment
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Results */}
          {currentStep > totalSteps && renderResults()}
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}
