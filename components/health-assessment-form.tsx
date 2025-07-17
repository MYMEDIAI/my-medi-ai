"use client"

import { useState } from "react"
import Link from "next/link"
import { ClipboardList, Send, Home, RotateCcw, Download, Printer, Shield, Brain, Award } from "lucide-react"
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

interface AssessmentData {
  // Personal Information
  fullName: string
  age: string
  gender: string
  height: string
  weight: string

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

  // Additional Information
  additionalSymptoms: string[]
  additionalNotes: string
}

export default function HealthAssessmentForm() {
  const [formData, setFormData] = useState<AssessmentData>({
    fullName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
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
    additionalSymptoms: [],
    additionalNotes: "",
  })

  const [result, setResult] = useState("")
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
      !formData.symptomDuration
    ) {
      alert("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    // Simulate AI assessment
    setTimeout(() => {
      const assessment = `
🏥 COMPREHENSIVE HEALTH ASSESSMENT REPORT
AI-powered medical analysis by MyMedi.ai

👤 PATIENT INFORMATION
Name: ${formData.fullName}
Age: ${formData.age} years
Gender: ${formData.gender}
Height: ${formData.height} cm
Weight: ${formData.weight} kg
Assessment Date: ${new Date().toLocaleDateString()}

🎯 PRIMARY HEALTH CONCERN
Main Concern: ${formData.primaryConcern}
Symptom Description: ${formData.symptomDescription}
Duration: ${formData.symptomDuration}
Severity Level: ${formData.symptomSeverity[0]}/10
Pain/Discomfort Location: ${formData.painLocation.join(", ") || "Not specified"}

📋 MEDICAL HISTORY
Chronic Conditions: ${formData.chronicConditions.join(", ") || "None reported"}
Current Medications: ${formData.currentMedications || "None reported"}
Known Allergies: ${formData.allergies.join(", ") || "None reported"}
Surgical History: ${formData.surgicalHistory || "None reported"}
Family History: ${formData.familyHistory.join(", ") || "None reported"}

📊 VITAL SIGNS
Blood Pressure: ${formData.bloodPressure || "Not provided"}
Heart Rate: ${formData.heartRate || "Not provided"} bpm
Temperature: ${formData.temperature || "Not provided"}°C
Oxygen Saturation: ${formData.oxygenSaturation || "Not provided"}%

🏃 LIFESTYLE FACTORS
Smoking Status: ${formData.smokingStatus || "Not specified"}
Alcohol Consumption: ${formData.alcoholConsumption || "Not specified"}
Exercise Frequency: ${formData.exerciseFrequency || "Not specified"}
Average Sleep: ${formData.averageSleepHours || "Not specified"} hours
Stress Level: ${formData.stressLevel[0]}/10

🔍 ADDITIONAL SYMPTOMS
${formData.additionalSymptoms.join(", ") || "None reported"}

🤖 AI HEALTH ANALYSIS & RECOMMENDATIONS

Based on your comprehensive health assessment, here are personalized insights:

✅ IMMEDIATE RECOMMENDATIONS:
• Monitor your symptoms closely
• Maintain adequate hydration (8-10 glasses of water daily)
• Ensure 7-9 hours of quality sleep
• Practice stress management techniques

⚠️ WHEN TO SEEK MEDICAL ATTENTION:
• If symptoms worsen or new symptoms develop
• If pain level exceeds 7/10
• If you experience difficulty breathing
• If you have concerns about medication interactions

🏥 SUGGESTED NEXT STEPS:
• Schedule appointment with primary care physician
• Keep a symptom diary
• Monitor vital signs regularly
• Consider lifestyle modifications based on assessment

📝 ADDITIONAL NOTES:
${formData.additionalNotes || "None provided"}

⚠️ IMPORTANT MEDICAL DISCLAIMER:
This AI-powered assessment is for educational and informational purposes only. 
It does not constitute medical advice, diagnosis, or treatment recommendations.
Always consult with qualified healthcare professionals for proper medical care.
This assessment should not replace professional medical consultation.

🔒 PRIVACY & SECURITY:
Your health information is processed securely and confidentially.
MyMedi.ai is HIPAA compliant and follows strict data protection protocols.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai | Made in India with ❤️
      `
      setResult(assessment)
      setIsLoading(false)
    }, 3000)
  }

  const handleReset = () => {
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
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
      additionalSymptoms: [],
      additionalNotes: "",
    })
    setResult("")
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Comprehensive Health Assessment Report</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 900px;
            margin: 0 auto;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #667eea; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            margin: -30px -30px 30px -30px;
            padding: 30px;
            border-radius: 15px 15px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
          }
          .badges {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
          }
          .badge {
            background: rgba(255,255,255,0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;
          }
          .assessment-content { 
            background: #f8f9ff;
            padding: 25px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            white-space: pre-line;
            font-size: 1.1em;
            line-height: 1.7;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.9em;
            color: #666;
          }
          @media print { 
            body { margin: 0; background: white !important; } 
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 MyMedi.ai</h1>
            <p>Comprehensive Health Assessment Report</p>
            <p>AI-powered medical analysis</p>
            <div class="badges">
              <span class="badge">🔒 HIPAA Compliant</span>
              <span class="badge">🤖 AI-Powered Analysis</span>
              <span class="badge">📊 Personalized Results</span>
            </div>
          </div>

          <div class="assessment-content">${result}</div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>This comprehensive health assessment is for educational purposes only.</p>
            <p><em>Always consult with qualified healthcare providers for proper diagnosis and treatment.</em></p>
            <p>📧 Contact: Harsha@mymedi.ai | 📱 Made in India with ❤️</p>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownload = () => {
    const content = `
MyMedi.ai - Comprehensive Health Assessment Report
Generated on: ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })}

${result}

---
Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Comprehensive-Health-Assessment-${formData.fullName ? formData.fullName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (result) {
    return (
      <Card className="border-green-200 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-green-700">
            <div className="flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Comprehensive Health Assessment Report
            </div>
            <div className="flex gap-1">
              <Button onClick={handlePrint} variant="ghost" size="sm" title="Print Assessment">
                <Printer className="w-4 h-4" />
              </Button>
              <Button onClick={handleDownload} variant="ghost" size="sm" title="Download Assessment">
                <Download className="w-4 h-4" />
              </Button>
              <Button onClick={handleReset} variant="ghost" size="sm" title="New Assessment">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="text-sm text-green-800 whitespace-pre-line font-mono">{result}</div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-1" />
                Print Report
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download Report
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                New Assessment
              </Button>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-blue-700">
          <div className="flex items-center">
            <ClipboardList className="w-6 h-6 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Comprehensive Health Assessment</h2>
              <p className="text-sm text-gray-600 font-normal">AI-powered medical analysis by MyMedi.ai</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered Analysis
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Award className="w-3 h-3 mr-1" />
              Personalized Results
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-600">Required</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-sm font-medium">
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="mt-1">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height" className="text-sm font-medium">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height in cm"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-sm font-medium">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Current Health Concern */}
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Health Concern</h3>
            <p className="text-sm text-gray-600">Primary Focus</p>
          </div>

          <div>
            <Label htmlFor="primaryConcern" className="text-sm font-medium">
              What is your main health concern today? *
            </Label>
            <Input
              id="primaryConcern"
              placeholder="e.g., Persistent headache, chest pain, fatigue"
              value={formData.primaryConcern}
              onChange={(e) => setFormData({ ...formData, primaryConcern: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="symptomDescription" className="text-sm font-medium">
              Describe your symptoms in detail *
            </Label>
            <Textarea
              id="symptomDescription"
              placeholder="Please describe your symptoms, when they occur, what makes them better or worse..."
              value={formData.symptomDescription}
              onChange={(e) => setFormData({ ...formData, symptomDescription: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">How long have you had these symptoms? *</Label>
              <Select
                value={formData.symptomDuration}
                onValueChange={(value) => setFormData({ ...formData, symptomDuration: value })}
              >
                <SelectTrigger className="mt-1">
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
              <Label className="text-sm font-medium">Rate your symptom severity (1-10) *</Label>
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
                <p className="text-center mt-2 font-medium">{formData.symptomSeverity[0]}/10</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Where is your pain/discomfort located?</Label>
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
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900">Medical History</h3>
            <p className="text-sm text-gray-600">Important Context</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Do you have any chronic conditions?</Label>
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
            <Label htmlFor="currentMedications" className="text-sm font-medium">
              Current Medications (include dosages)
            </Label>
            <Textarea
              id="currentMedications"
              placeholder="List all medications you're currently taking, including dosages and frequency..."
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Do you have any known allergies?</Label>
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
              <Label htmlFor="surgicalHistory" className="text-sm font-medium">
                Surgical History
              </Label>
              <Textarea
                id="surgicalHistory"
                placeholder="List any surgeries or procedures you've had..."
                value={formData.surgicalHistory}
                onChange={(e) => setFormData({ ...formData, surgicalHistory: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Family Medical History</Label>
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

        <Separator />

        {/* Vital Signs */}
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
            <p className="text-sm text-gray-600">Optional but Helpful</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="bloodPressure" className="text-sm font-medium">
                Blood Pressure
              </Label>
              <Input
                id="bloodPressure"
                placeholder="e.g., 120/80"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="heartRate" className="text-sm font-medium">
                Heart Rate (bpm)
              </Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="e.g., 72"
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="temperature" className="text-sm font-medium">
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="e.g., 37.0"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="oxygenSaturation" className="text-sm font-medium">
                Oxygen Saturation (%)
              </Label>
              <Input
                id="oxygenSaturation"
                type="number"
                placeholder="e.g., 98"
                value={formData.oxygenSaturation}
                onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Lifestyle Factors */}
        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900">Lifestyle Factors</h3>
            <p className="text-sm text-gray-600">Affects Treatment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Smoking Status</Label>
              <Select
                value={formData.smokingStatus}
                onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
              >
                <SelectTrigger className="mt-1">
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
              <Label className="text-sm font-medium">Alcohol Consumption</Label>
              <Select
                value={formData.alcoholConsumption}
                onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
              >
                <SelectTrigger className="mt-1">
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
              <Label className="text-sm font-medium">Exercise Frequency</Label>
              <Select
                value={formData.exerciseFrequency}
                onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
              >
                <SelectTrigger className="mt-1">
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
              <Label htmlFor="averageSleepHours" className="text-sm font-medium">
                Average Sleep Hours
              </Label>
              <Input
                id="averageSleepHours"
                type="number"
                placeholder="e.g., 7"
                value={formData.averageSleepHours}
                onChange={(e) => setFormData({ ...formData, averageSleepHours: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Stress Level (1-10)</Label>
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
                <p className="text-center mt-2 font-medium">{formData.stressLevel[0]}/10</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="border-l-4 border-indigo-500 pl-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            <p className="text-sm text-gray-600">Complete Picture</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Are you experiencing any of these additional symptoms?</Label>
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
            <Label htmlFor="additionalNotes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any other information you'd like to share about your health concerns..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>
        </div>

        <Separator />

        {/* Privacy Notice */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Privacy & Security</p>
              <p>
                Your information is secure and private. This AI assessment provides educational insights and should not
                replace professional medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset Form
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4" />
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
              !formData.symptomDuration
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
            size="lg"
          >
            {isLoading ? (
              "Analyzing your health data..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Get AI Health Assessment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
