"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Home, RotateCcw, Printer, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

interface HeartHealthData {
  // Personal Information
  name: string
  age: string
  gender: string
  weight: string
  height: string

  // Contact Information
  phone: string
  email: string
  emergencyContact: string

  // Symptoms
  chestPain: string
  breathlessness: string
  palpitations: string
  fatigue: string
  swelling: string
  dizziness: string

  // Risk Factors
  smoking: string
  alcohol: string
  familyHistory: string
  diabetes: string
  hypertension: string
  cholesterol: string

  // Lifestyle
  exerciseFrequency: string
  stressLevel: string
  sleepQuality: string
  dietType: string

  // Vitals
  bloodPressure: string
  restingHeartRate: string
  lastCheckup: string

  // Current Medications
  medications: string
  concerns: string
}

interface HeartHealthResults {
  riskScore: {
    total: number
    level: string
    category: string
  }
  recommendations: {
    immediate: string[]
    lifestyle: string[]
    dietary: string[]
    exercise: string[]
    monitoring: string[]
  }
  tests: {
    essential: Array<{ name: string; cost: string; description: string; frequency: string }>
    additional: Array<{ name: string; cost: string; description: string; frequency: string }>
  }
  emergencyPlan: {
    warningSignals: string[]
    firstAid: string[]
    contacts: string[]
  }
  followUp: {
    schedule: string
    goals: string[]
    tracking: string[]
  }
  medications: {
    current: string[]
    recommended: Array<{ name: string; purpose: string; cost: string }>
  }
  lifestyle: {
    diet: string[]
    exercise: string[]
    stress: string[]
  }
  supplements?: Array<{ name: string; dosage: string; purpose: string; cost: string }>
}

export default function HeartHealthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<HeartHealthResults | null>(null)

  const [formData, setFormData] = useState<HeartHealthData>({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    phone: "",
    email: "",
    emergencyContact: "",
    chestPain: "",
    breathlessness: "",
    palpitations: "",
    fatigue: "",
    swelling: "",
    dizziness: "",
    smoking: "",
    alcohol: "",
    familyHistory: "",
    diabetes: "",
    hypertension: "",
    cholesterol: "",
    exerciseFrequency: "",
    stressLevel: "",
    sleepQuality: "",
    dietType: "",
    bloodPressure: "",
    restingHeartRate: "",
    lastCheckup: "",
    medications: "",
    concerns: "",
  })

  const handleInputChange = (field: keyof HeartHealthData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateResults = async () => {
    setIsLoading(true)

    try {
      // Call AI API to generate personalized heart health assessment
      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "heart-health-assessment",
          payload: formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate assessment")
      }

      const aiResults = await response.json()
      setResults(aiResults)
    } catch (error) {
      console.error("Error generating assessment:", error)
      // Show error message to user
      alert("Failed to generate assessment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      gender: "",
      weight: "",
      height: "",
      phone: "",
      email: "",
      emergencyContact: "",
      chestPain: "",
      breathlessness: "",
      palpitations: "",
      fatigue: "",
      swelling: "",
      dizziness: "",
      smoking: "",
      alcohol: "",
      familyHistory: "",
      diabetes: "",
      hypertension: "",
      cholesterol: "",
      exerciseFrequency: "",
      stressLevel: "",
      sleepQuality: "",
      dietType: "",
      bloodPressure: "",
      restingHeartRate: "",
      lastCheckup: "",
      medications: "",
      concerns: "",
    })
    setResults(null)
  }

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Heart Health Assessment - MyMedi.ai",
          text: `Check out my heart health assessment from MyMedi.ai!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (results) {
    const getRiskColor = (level: string) => {
      switch (level) {
        case "Low":
          return "text-green-600 bg-green-50 border-green-200"
        case "Moderate":
          return "text-yellow-600 bg-yellow-50 border-yellow-200"
        case "High":
          return "text-orange-600 bg-orange-50 border-orange-200"
        case "Very High":
          return "text-red-600 bg-red-50 border-red-200"
        default:
          return "text-gray-600 bg-gray-50 border-gray-200"
      }
    }

    return (
      <div className="min-h-screen bg-white">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .medical-report {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #1a1a1a;
          }
          .medical-report h1 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
          .medical-report h2 { font-size: 14px; font-weight: 600; margin-bottom: 6px; border-bottom: 1px solid #e5e5e5; padding-bottom: 2px; }
          .medical-report h3 { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
          .medical-report .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .medical-report .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
          .medical-report .section { margin-bottom: 16px; padding: 8px; border: 1px solid #e5e5e5; }
          .medical-report .risk-high { background: #fef2f2; border-left: 4px solid #dc2626; }
          .medical-report .risk-moderate { background: #fffbeb; border-left: 4px solid #d97706; }
          .medical-report .risk-low { background: #f0fdf4; border-left: 4px solid #16a34a; }
          .medical-report ul { margin: 4px 0; padding-left: 16px; }
          .medical-report li { margin-bottom: 2px; }
          .medical-report .compact-list { columns: 2; column-gap: 16px; }
          @media print {
            .medical-report { font-size: 10px; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          }
        `}</style>

        <header className="bg-white border-b-2 border-red-600 p-4 no-print">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <MyMedLogo size="lg" />
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
              <Button onClick={() => window.print()} size="sm">
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button onClick={shareResults} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </header>

        <div className="medical-report max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
            <h1 className="text-red-700">COMPREHENSIVE CARDIAC RISK ASSESSMENT</h1>
            <div className="text-gray-600">
              MyMedi.ai - Advanced AI Health Analytics | Report ID: CRA-{Date.now().toString().slice(-6)}
            </div>
            <div className="text-gray-500">Generated: {new Date().toLocaleDateString()} | Valid for 90 days</div>
          </div>

          <div className="grid-2">
            {/* Patient Info */}
            <div className="section">
              <h2>Patient Demographics</h2>
              <div className="grid-2">
                <div>
                  <strong>Name:</strong> {formData.name}
                </div>
                <div>
                  <strong>Age:</strong> {formData.age} years
                </div>
                <div>
                  <strong>Gender:</strong> {formData.gender}
                </div>
                <div>
                  <strong>BMI:</strong>{" "}
                  {formData.weight && formData.height
                    ? (Number(formData.weight) / Math.pow(Number(formData.height) / 100, 2)).toFixed(1)
                    : "N/A"}
                </div>
                <div>
                  <strong>Contact:</strong> {formData.phone || "Not provided"}
                </div>
                <div>
                  <strong>Emergency:</strong> {formData.emergencyContact || "Not provided"}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div
              className={`section ${results.riskScore.level === "Very High" ? "risk-high" : results.riskScore.level === "High" ? "risk-high" : results.riskScore.level === "Moderate" ? "risk-moderate" : "risk-low"}`}
            >
              <h2>Cardiac Risk Stratification</h2>
              <div className="text-center mb-2">
                <div className="text-2xl font-bold">{results.riskScore.level} RISK</div>
                <div className="text-sm">{results.riskScore.category}</div>
                <div className="text-xs">Score: {results.riskScore.total}/20</div>
              </div>
              <div>
                <strong>Risk Factors Present:</strong>
              </div>
              <ul className="text-xs">
                {formData.smoking === "current" && <li>Active smoking</li>}
                {formData.diabetes === "yes" && <li>Diabetes mellitus</li>}
                {formData.hypertension === "yes" && <li>Hypertension</li>}
                {formData.familyHistory === "yes" && <li>Family history CAD</li>}
                {formData.cholesterol === "high" && <li>Dyslipidemia</li>}
              </ul>
            </div>
          </div>

          {/* Clinical Recommendations */}
          <div className="section">
            <h2>Clinical Management Protocol</h2>
            <div className="grid-3">
              <div>
                <h3>Immediate Actions</h3>
                <ul className="text-xs">
                  {results.recommendations.immediate.slice(0, 4).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Lifestyle Modifications</h3>
                <ul className="text-xs">
                  {results.recommendations.lifestyle.slice(0, 4).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Monitoring Protocol</h3>
                <ul className="text-xs">
                  {results.recommendations.monitoring.slice(0, 4).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Advanced Nutrition & Supplements */}
          <div className="section">
            <h2>Advanced Nutritional Therapy & Supplementation</h2>
            <div className="grid-2">
              <div>
                <h3>Cardioprotective Diet Protocol</h3>
                <ul className="text-xs compact-list">
                  {results.recommendations.dietary.map((diet, i) => (
                    <li key={i}>{diet}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Evidence-Based Supplements</h3>
                <ul className="text-xs">
                  {results.supplements?.map((supplement, i) => (
                    <li key={i}>
                      <strong>{supplement.name}:</strong> {supplement.dosage} - {supplement.purpose}
                    </li>
                  )) || [
                    <li key="omega3">
                      <strong>Omega-3 (EPA/DHA):</strong> 1-2g daily - reduces triglycerides, anti-inflammatory
                    </li>,
                    <li key="coq10">
                      <strong>Coenzyme Q10:</strong> 100-200mg daily - mitochondrial support, statin myopathy
                    </li>,
                    <li key="magnesium">
                      <strong>Magnesium Glycinate:</strong> 400mg daily - BP reduction, arrhythmia prevention
                    </li>,
                    <li key="vitd">
                      <strong>Vitamin D3:</strong> 2000-4000 IU daily - cardiovascular protection, immune support
                    </li>,
                  ]}
                </ul>
              </div>
            </div>
          </div>

          {/* Diagnostic Protocol */}
          <div className="section">
            <h2>Comprehensive Diagnostic Protocol</h2>
            <div className="grid-2">
              <div>
                <h3>Essential Testing (Priority 1)</h3>
                {results.tests.essential.map((test, i) => (
                  <div key={i} className="text-xs mb-1 border-l-2 border-red-500 pl-2">
                    <strong>{test.name}</strong> - {test.cost}
                    <br />
                    <span className="text-gray-600">{test.description}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3>Advanced Testing (If Indicated)</h3>
                {results.tests.additional.map((test, i) => (
                  <div key={i} className="text-xs mb-1 border-l-2 border-blue-500 pl-2">
                    <strong>{test.name}</strong> - {test.cost}
                    <br />
                    <span className="text-gray-600">{test.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Protocol */}
          <div className="section risk-high">
            <h2>Emergency Action Protocol</h2>
            <div className="grid-3">
              <div>
                <h3>Warning Signs</h3>
                <ul className="text-xs">
                  {results.emergencyPlan.warningSignals.slice(0, 6).map((signal, i) => (
                    <li key={i}>{signal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Immediate Response</h3>
                <ol className="text-xs">
                  {results.emergencyPlan.firstAid.slice(0, 6).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h3>Emergency Contacts</h3>
                <ul className="text-xs">
                  {results.emergencyPlan.contacts.map((contact, i) => (
                    <li key={i}>{contact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Medication Protocol */}
          <div className="section">
            <h2>Pharmacological Management</h2>
            <div className="grid-2">
              <div>
                <h3>Current Medications</h3>
                {results.medications.current.length > 0 ? (
                  <ul className="text-xs">
                    {results.medications.current.map((med, i) => (
                      <li key={i}>{med}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-600">No current medications reported</p>
                )}
              </div>
              <div>
                <h3>Evidence-Based Recommendations</h3>
                {results.medications.recommended.slice(0, 4).map((med, i) => (
                  <div key={i} className="text-xs mb-1">
                    <strong>{med.name}</strong> - {med.cost}
                    <br />
                    <span className="text-gray-600">{med.purpose}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Follow-up & Goals */}
          <div className="section">
            <h2>Follow-up Schedule & Treatment Goals</h2>
            <div className="grid-2">
              <div>
                <h3>Monitoring Schedule</h3>
                <p className="text-xs mb-2">
                  <strong>Frequency:</strong> {results.followUp.schedule}
                </p>
                <ul className="text-xs">
                  {results.followUp.tracking.map((track, i) => (
                    <li key={i}>{track}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Target Parameters</h3>
                <ul className="text-xs">
                  {results.followUp.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="section border-2 border-yellow-500 bg-yellow-50">
            <h2>Medical Disclaimer & Legal Notice</h2>
            <p className="text-xs">
              This assessment is for informational purposes only and does not constitute medical advice, diagnosis, or
              treatment. Always consult qualified healthcare professionals for medical decisions. This AI-generated
              report should supplement, not replace, clinical judgment. Emergency symptoms require immediate medical
              attention (Call 108).
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-4 border-t pt-2">
            MyMedi.ai © 2024 | Advanced AI Health Analytics | Report generated on {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button onClick={resetForm} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Heart Health Assessment</h1>
            <p className="text-gray-600">Comprehensive cardiac evaluation with personalized recommendations</p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary">AI-Powered</Badge>
              <Badge variant="secondary">Comprehensive</Badge>
              <Badge variant="secondary">Personalized</Badge>
              <Badge variant="secondary">HIPAA Compliant</Badge>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Heart Health Assessment Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
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
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="Enter weight in kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      placeholder="Enter height in cm"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                      placeholder="Emergency contact name and phone number"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Symptoms Assessment */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Symptoms Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="chestPain">Chest Pain</Label>
                    <Select value={formData.chestPain} onValueChange={(value) => handleInputChange("chestPain", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breathlessness">Shortness of Breath</Label>
                    <Select
                      value={formData.breathlessness}
                      onValueChange={(value) => handleInputChange("breathlessness", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild (on exertion)</SelectItem>
                        <SelectItem value="moderate">Moderate (climbing stairs)</SelectItem>
                        <SelectItem value="severe">Severe (at rest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="palpitations">Heart Palpitations</Label>
                    <Select
                      value={formData.palpitations}
                      onValueChange={(value) => handleInputChange("palpitations", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fatigue">Unusual Fatigue</Label>
                    <Select value={formData.fatigue} onValueChange={(value) => handleInputChange("fatigue", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="swelling">Leg/Ankle Swelling</Label>
                    <Select value={formData.swelling} onValueChange={(value) => handleInputChange("swelling", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dizziness">Dizziness/Fainting</Label>
                    <Select value={formData.dizziness} onValueChange={(value) => handleInputChange("dizziness", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="frequent">Frequent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Risk Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Risk Factors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smoking">Smoking Status</Label>
                    <Select value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">Current smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <Select value={formData.alcohol} onValueChange={(value) => handleInputChange("alcohol", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="occasional">Occasional</SelectItem>
                        <SelectItem value="moderate">Moderate (1-2 drinks/day)</SelectItem>
                        <SelectItem value="heavy">&gt;2 drinks/day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="familyHistory">Family History of Heart Disease</Label>
                    <Select
                      value={formData.familyHistory}
                      onValueChange={(value) => handleInputChange("familyHistory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diabetes">Diabetes</Label>
                    <Select value={formData.diabetes} onValueChange={(value) => handleInputChange("diabetes", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="prediabetes">Pre-diabetes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hypertension">High Blood Pressure</Label>
                    <Select
                      value={formData.hypertension}
                      onValueChange={(value) => handleInputChange("hypertension", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="borderline">Borderline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cholesterol">Cholesterol Levels</Label>
                    <Select
                      value={formData.cholesterol}
                      onValueChange={(value) => handleInputChange("cholesterol", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="borderline">Borderline high</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Lifestyle Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Lifestyle Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                    <Select
                      value={formData.exerciseFrequency}
                      onValueChange={(value) => handleInputChange("exerciseFrequency", value)}
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
                    <Label htmlFor="stressLevel">Stress Level</Label>
                    <Select
                      value={formData.stressLevel}
                      onValueChange={(value) => handleInputChange("stressLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Select
                      value={formData.sleepQuality}
                      onValueChange={(value) => handleInputChange("sleepQuality", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (7-8 hours)</SelectItem>
                        <SelectItem value="good">Good (6-7 hours)</SelectItem>
                        <SelectItem value="fair">Fair (5-6 hours)</SelectItem>
                        <SelectItem value="poor">&lt;5 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dietType">Diet Type</Label>
                    <Select value={formData.dietType} onValueChange={(value) => handleInputChange("dietType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced diet</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="high-sodium">High sodium</SelectItem>
                        <SelectItem value="processed">Lots of processed food</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodPressure">Blood Pressure (if known)</Label>
                    <Input
                      id="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                      placeholder="e.g., 120/80"
                    />
                  </div>
                  <div>
                    <Label htmlFor="restingHeartRate">Resting Heart Rate (if known)</Label>
                    <Input
                      id="restingHeartRate"
                      type="number"
                      value={formData.restingHeartRate}
                      onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
                      placeholder="e.g., 72"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="lastCheckup">Last Cardiac Checkup</Label>
                    <Input
                      id="lastCheckup"
                      value={formData.lastCheckup}
                      onChange={(e) => handleInputChange("lastCheckup", e.target.value)}
                      placeholder="e.g., 6 months ago, Never"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Current Medications and Concerns */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) => handleInputChange("medications", e.target.value)}
                      placeholder="List any medications you're currently taking..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="concerns">Specific Concerns or Questions</Label>
                    <Textarea
                      id="concerns"
                      value={formData.concerns}
                      onChange={(e) => handleInputChange("concerns", e.target.value)}
                      placeholder="Any specific heart-related concerns or questions you have..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={generateResults}
                disabled={isLoading || !formData.name || !formData.age}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Your Heart Health...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Generate Heart Health Assessment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <PoweredByFooter />
    </div>
  )
}
