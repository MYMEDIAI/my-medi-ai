"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  ChevronDown,
  X,
  AlertTriangle,
  User,
  Stethoscope,
  Pill,
  Heart,
  Activity,
  Sparkles,
  Phone,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import LiveAIResults from "@/components/live-ai-results"

// Symptoms database
const SYMPTOMS_DATABASE = [
  { id: "fever", name: "Fever", emoji: "🤒", category: "general", searchTerms: ["fe", "fever", "temperature", "hot"] },
  {
    id: "headache",
    name: "Headache",
    emoji: "🤕",
    category: "neurological",
    searchTerms: ["hea", "head", "headache", "migraine"],
  },
  {
    id: "chest-pain",
    name: "Chest pain",
    emoji: "💔",
    category: "cardiac",
    searchTerms: ["che", "chest", "pain", "heart"],
  },
  {
    id: "stomach-pain",
    name: "Stomach pain",
    emoji: "🤢",
    category: "gastro",
    searchTerms: ["sto", "stomach", "pain", "abdomen"],
  },
  { id: "cough", name: "Cough", emoji: "😷", category: "respiratory", searchTerms: ["co", "cough", "throat"] },
  {
    id: "fatigue",
    name: "Fatigue",
    emoji: "😴",
    category: "general",
    searchTerms: ["fa", "fatigue", "tired", "energy"],
  },
  {
    id: "dizziness",
    name: "Dizziness",
    emoji: "😵",
    category: "neurological",
    searchTerms: ["diz", "dizzy", "vertigo", "balance"],
  },
  { id: "nausea", name: "Nausea", emoji: "🤮", category: "gastro", searchTerms: ["na", "nausea", "sick", "vomit"] },
  {
    id: "shortness-breath",
    name: "Shortness of breath",
    emoji: "😮‍💨",
    category: "respiratory",
    searchTerms: ["sh", "breath", "breathing", "dyspnea"],
  },
  {
    id: "back-pain",
    name: "Back pain",
    emoji: "🦴",
    category: "musculoskeletal",
    searchTerms: ["ba", "back", "pain", "spine"],
  },
]

const COMMON_SYMPTOMS = ["Fever", "Headache", "Cough", "Stomach pain", "Fatigue", "Dizziness"]

const MEDICATIONS_DATABASE = [
  {
    id: "paracetamol",
    name: "Paracetamol",
    category: "Pain Relief",
    searchTerms: ["par", "paracetamol", "fever", "pain", "crocin"],
  },
  { id: "ibuprofen", name: "Ibuprofen", category: "Pain Relief", searchTerms: ["ibu", "ibuprofen", "brufen", "pain"] },
  { id: "omeprazole", name: "Omeprazole", category: "Acidity", searchTerms: ["ome", "omeprazole", "acidity", "omez"] },
  {
    id: "cetirizine",
    name: "Cetirizine",
    category: "Allergy",
    searchTerms: ["cet", "cetirizine", "allergy", "zyrtec"],
  },
  {
    id: "azithromycin",
    name: "Azithromycin",
    category: "Antibiotic",
    searchTerms: ["azi", "azithromycin", "antibiotic", "azee"],
  },
]

const MEDICAL_CONDITIONS = [
  { id: "diabetes-type2", name: "Diabetes Type 2", emoji: "💉", category: "Endocrine" },
  { id: "hypertension", name: "High Blood Pressure", emoji: "❤️", category: "Cardiovascular" },
  { id: "asthma", name: "Asthma", emoji: "🫁", category: "Respiratory" },
  { id: "arthritis", name: "Arthritis", emoji: "🦴", category: "Musculoskeletal" },
  { id: "thyroid-disorder", name: "Thyroid Disorder", emoji: "🦋", category: "Endocrine" },
]

interface AssessmentData {
  personalInfo: {
    age: number
    gender: string
    weight: number
    height: number
  }
  primarySymptom: string
  secondarySymptoms: string[]
  medications: string[]
  conditions: string[]
  duration: string
  severity: number
  lifestyle: {
    exercise: string
    sleep: string
    diet: string
    stress: number
  }
}

export default function LiveAIAssessment() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    personalInfo: { age: 0, gender: "", weight: 0, height: 0 },
    primarySymptom: "",
    secondarySymptoms: [],
    medications: [],
    conditions: [],
    duration: "",
    severity: 1,
    lifestyle: {
      exercise: "",
      sleep: "",
      diet: "",
      stress: 1,
    },
  })

  const [symptomSearch, setSymptomSearch] = useState("")
  const [medicationSearch, setMedicationSearch] = useState("")
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false)
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false)
  const [emergencyAlert, setEmergencyAlert] = useState<any>(null)

  // Filter symptoms based on search
  const filteredSymptoms = SYMPTOMS_DATABASE.filter(
    (symptom) =>
      symptom.searchTerms.some((term) => term.toLowerCase().includes(symptomSearch.toLowerCase())) ||
      symptom.name.toLowerCase().includes(symptomSearch.toLowerCase()),
  ).slice(0, 8)

  // Filter medications based on search
  const filteredMedications = MEDICATIONS_DATABASE.filter(
    (medication) =>
      medication.searchTerms.some((term) => term.toLowerCase().includes(medicationSearch.toLowerCase())) ||
      medication.name.toLowerCase().includes(medicationSearch.toLowerCase()),
  ).slice(0, 6)

  const handleSymptomSelect = (symptom: any) => {
    setAssessmentData((prev) => ({
      ...prev,
      primarySymptom: symptom.name,
    }))
    setSymptomSearch("")
    setShowSymptomDropdown(false)
  }

  const handleMedicationSelect = (medication: any) => {
    setAssessmentData((prev) => ({
      ...prev,
      medications: prev.medications.includes(medication.name)
        ? prev.medications.filter((m) => m !== medication.name)
        : [...prev.medications, medication.name],
    }))
    setMedicationSearch("")
    setShowMedicationDropdown(false)
  }

  const handleConditionToggle = (conditionId: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(conditionId)
        ? prev.conditions.filter((c) => c !== conditionId)
        : [...prev.conditions, conditionId],
    }))
  }

  const handleEmergencyDetected = (alert: any) => {
    setEmergencyAlert(alert)
    // You could also trigger browser notifications, sounds, etc.
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚨 Medical Emergency Detected", {
        body: alert.message,
        icon: "/favicon.ico",
      })
    }
  }

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <MyMedLogo className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">MyMedi.AI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Live AI Analysis
              </Badge>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Emergency: 108
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Alert Banner */}
      {emergencyAlert && (
        <div className="bg-red-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-bold">EMERGENCY DETECTED</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-red-600 bg-transparent"
              onClick={() => setEmergencyAlert(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live AI Health Assessment</h1>
          <p className="text-gray-600 mt-1">Real-time AI analysis as you fill the form</p>
          <div className="flex items-center space-x-4 mt-4">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              Live Analysis Active
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Emergency Detection On
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Zap className="w-3 h-3 mr-1" />
              Real-time Recommendations
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assessment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={assessmentData.personalInfo.age || ""}
                      onChange={(e) =>
                        setAssessmentData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, age: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={assessmentData.personalInfo.gender}
                      onChange={(e) =>
                        setAssessmentData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, gender: e.target.value },
                        }))
                      }
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter weight"
                      value={assessmentData.personalInfo.weight || ""}
                      onChange={(e) =>
                        setAssessmentData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, weight: Number.parseInt(e.target.value) || 0 },
                        }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={assessmentData.personalInfo.height || ""}
                    onChange={(e) =>
                      setAssessmentData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, height: Number.parseInt(e.target.value) || 0 },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Primary Symptom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-red-600" />
                  Primary Symptom
                  <Badge variant="outline" className="ml-2 text-xs">
                    AI analyzes as you type
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Popover open={showSymptomDropdown} onOpenChange={setShowSymptomDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={showSymptomDropdown}
                        className="w-full justify-between h-12 bg-transparent"
                      >
                        {assessmentData.primarySymptom || "Type symptom (e.g., fever, headache...)"}
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search symptoms..."
                          value={symptomSearch}
                          onValueChange={setSymptomSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No symptoms found.</CommandEmpty>
                          <CommandGroup heading="Common Symptoms">
                            {COMMON_SYMPTOMS.map((symptom) => (
                              <CommandItem
                                key={symptom}
                                onSelect={() => handleSymptomSelect({ name: symptom })}
                                className="flex items-center space-x-2"
                              >
                                <span className="text-lg">
                                  {SYMPTOMS_DATABASE.find((s) => s.name === symptom)?.emoji}
                                </span>
                                <span>{symptom}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <CommandGroup heading="All Symptoms">
                            {filteredSymptoms.map((symptom) => (
                              <CommandItem
                                key={symptom.id}
                                onSelect={() => handleSymptomSelect(symptom)}
                                className="flex items-center space-x-2"
                              >
                                <span className="text-lg">{symptom.emoji}</span>
                                <span>{symptom.name}</span>
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {symptom.category}
                                </Badge>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {assessmentData.primarySymptom && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-sm py-1 px-3">
                        {SYMPTOMS_DATABASE.find((s) => s.name === assessmentData.primarySymptom)?.emoji}{" "}
                        {assessmentData.primarySymptom}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-4 w-4 p-0"
                          onClick={() =>
                            setAssessmentData((prev) => ({
                              ...prev,
                              primarySymptom: "",
                            }))
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Symptom Details */}
            {assessmentData.primarySymptom && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-600" />
                    Symptom Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <select
                        id="duration"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={assessmentData.duration}
                        onChange={(e) =>
                          setAssessmentData((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select duration</option>
                        <option value="less-than-1-day">Less than 1 day</option>
                        <option value="1-3-days">1-3 days</option>
                        <option value="4-7-days">4-7 days</option>
                        <option value="1-2-weeks">1-2 weeks</option>
                        <option value="more-than-2-weeks">More than 2 weeks</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="severity">Severity (1-10)</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          id="severity"
                          min="1"
                          max="10"
                          value={assessmentData.severity}
                          onChange={(e) =>
                            setAssessmentData((prev) => ({
                              ...prev,
                              severity: Number.parseInt(e.target.value),
                            }))
                          }
                          className="flex-1"
                        />
                        <span className="text-lg font-bold text-blue-600 w-8">{assessmentData.severity}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-600" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Popover open={showMedicationDropdown} onOpenChange={setShowMedicationDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={showMedicationDropdown}
                        className="w-full justify-between bg-transparent"
                      >
                        <div className="flex items-center">
                          <Search className="w-4 h-4 mr-2 text-gray-400" />
                          Search medications...
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search medications..."
                          value={medicationSearch}
                          onValueChange={setMedicationSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No medications found.</CommandEmpty>
                          <CommandGroup>
                            {filteredMedications.map((medication) => (
                              <CommandItem
                                key={medication.id}
                                onSelect={() => handleMedicationSelect(medication)}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-medium">{medication.name}</div>
                                  <div className="text-sm text-gray-500">{medication.category}</div>
                                </div>
                                {assessmentData.medications.includes(medication.name) && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {assessmentData.medications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {assessmentData.medications.map((medication) => (
                        <Badge key={medication} variant="secondary" className="text-sm py-1 px-3">
                          {medication}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0"
                            onClick={() =>
                              setAssessmentData((prev) => ({
                                ...prev,
                                medications: prev.medications.filter((m) => m !== medication),
                              }))
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Medical Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MEDICAL_CONDITIONS.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={condition.id}
                        checked={assessmentData.conditions.includes(condition.id)}
                        onCheckedChange={() => handleConditionToggle(condition.id)}
                      />
                      <Label htmlFor={condition.id} className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-lg">{condition.emoji}</span>
                        <span>{condition.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live AI Results Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <LiveAIResults assessmentData={assessmentData} onEmergencyDetected={handleEmergencyDetected} />
            </div>
          </div>
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}
