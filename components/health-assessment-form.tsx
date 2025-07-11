"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Heart,
  Activity,
  Brain,
  Pill,
  Apple,
  Scale,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  FileText,
  Stethoscope,
  Shield,
  Award,
  Sparkles,
  RefreshCw,
  Save,
  Plus,
  Trash2,
} from "lucide-react"

interface ComprehensiveHealthData {
  // Personal Demographics
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: string
    age: number
    gender: string
    maritalStatus: string
    occupation: string
    education: string
    income: string
    insurance: string
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }

  // Physical Measurements
  physicalMeasurements: {
    height: number
    weight: number
    bmi: number
    waistCircumference: number
    hipCircumference: number
    bodyFatPercentage: number
    muscleMass: number
    boneDensity: number
    bloodPressure: {
      systolic: number
      diastolic: number
      measurementTime: string
      position: string
    }
    restingHeartRate: number
    bodyTemperature: number
    respiratoryRate: number
    oxygenSaturation: number
  }

  // Comprehensive Medical History
  medicalHistory: {
    chronicConditions: {
      condition: string
      diagnosisDate: string
      severity: string
      currentStatus: string
      treatingPhysician: string
    }[]
    pastSurgeries: {
      surgery: string
      date: string
      hospital: string
      surgeon: string
      complications: string
      outcome: string
    }[]
    hospitalizations: {
      reason: string
      date: string
      duration: string
      hospital: string
      outcome: string
    }[]
    allergies: {
      allergen: string
      reaction: string
      severity: string
      firstOccurrence: string
      treatment: string
    }[]
    immunizations: {
      vaccine: string
      date: string
      location: string
      nextDue: string
      reactions: string
    }[]
    familyHistory: {
      relation: string
      condition: string
      ageOfOnset: number
      ageAtDeath: number
      causeOfDeath: string
    }[]
  }

  // Current Medications & Supplements
  medications: {
    prescriptions: {
      name: string
      genericName: string
      dosage: string
      frequency: string
      route: string
      startDate: string
      prescribedBy: string
      indication: string
      sideEffects: string[]
      adherence: string
    }[]
    overTheCounter: {
      name: string
      dosage: string
      frequency: string
      reason: string
      duration: string
    }[]
    supplements: {
      name: string
      dosage: string
      frequency: string
      brand: string
      reason: string
      duration: string
    }[]
    herbalRemedies: {
      name: string
      dosage: string
      frequency: string
      reason: string
      source: string
    }[]
  }

  // Detailed Lifestyle Assessment
  lifestyle: {
    smoking: {
      status: string
      cigarettesPerDay: number
      yearsSmoked: number
      quitDate: string
      quitAttempts: number
      secondhandExposure: string
    }
    alcohol: {
      frequency: string
      unitsPerWeek: number
      typePreferred: string[]
      bingeDrinking: boolean
      problemDrinking: boolean
      lastDrink: string
    }
    substanceUse: {
      recreationalDrugs: string[]
      frequency: string
      lastUse: string
    }
    diet: {
      type: string
      restrictions: string[]
      allergies: string[]
      mealsPerDay: number
      snackingHabits: string
      waterIntake: number
      caffeineIntake: number
      fastFood: string
      homeCooking: string
      portionSizes: string
    }
    exercise: {
      type: string[]
      frequency: number
      duration: number
      intensity: string
      limitations: string[]
      personalTrainer: boolean
      gymMembership: boolean
      sportsParticipation: string[]
    }
    sleep: {
      bedtime: string
      wakeTime: string
      hoursOfSleep: number
      sleepQuality: number
      sleepDisorders: string[]
      sleepAids: string[]
      snoring: boolean
      sleepApnea: boolean
    }
    stress: {
      level: number
      sources: string[]
      copingMechanisms: string[]
      mentalHealthSupport: boolean
      workLifeBalance: number
    }
    environment: {
      livingCondition: string
      airQuality: string
      waterQuality: string
      occupationalHazards: string[]
      chemicalExposures: string[]
      radiationExposure: string[]
    }
  }

  // Comprehensive Symptom Analysis
  currentSymptoms: {
    primaryComplaint: string
    chiefConcern: string
    symptomHistory: {
      symptom: string
      onset: string
      duration: string
      frequency: string
      severity: number
      character: string
      location: string[]
      radiation: string
      timing: string
      alleviatingFactors: string[]
      aggravatingFactors: string[]
      associatedSymptoms: string[]
      previousOccurrence: boolean
      previousTreatment: string
      impactOnLife: number
      worryLevel: number
    }[]
    systemsReview: {
      constitutional: string[]
      cardiovascular: string[]
      respiratory: string[]
      gastrointestinal: string[]
      genitourinary: string[]
      musculoskeletal: string[]
      neurological: string[]
      psychiatric: string[]
      endocrine: string[]
      hematologic: string[]
      dermatologic: string[]
      eyes: string[]
      ears: string[]
      noseThroat: string[]
    }
  }

  // Women's Health (if applicable)
  womensHealth?: {
    menstrualHistory: {
      ageOfMenarche: number
      cycleLength: number
      flowDuration: number
      flowAmount: string
      lastMenstrualPeriod: string
      irregularities: string[]
      painLevel: number
    }
    pregnancyHistory: {
      totalPregnancies: number
      livebirths: number
      miscarriages: number
      abortions: number
      complications: string[]
      deliveryMethods: string[]
    }
    contraception: {
      currentMethod: string
      pastMethods: string[]
      sideEffects: string[]
    }
    menopause: {
      status: string
      ageOfOnset: number
      symptoms: string[]
      hormoneTherapy: boolean
    }
  }

  // Men's Health (if applicable)
  mensHealth?: {
    prostate: {
      symptoms: string[]
      screeningHistory: string[]
      familyHistory: boolean
    }
    reproductiveHealth: {
      concerns: string[]
      fertilityIssues: boolean
      testosteroneTherapy: boolean
    }
  }

  // Mental Health Assessment
  mentalHealth: {
    currentMood: string
    moodDisorders: string[]
    anxietyLevel: number
    depressionScreening: {
      feelingDown: number
      lossOfInterest: number
      sleepProblems: number
      energyLevel: number
      appetite: number
      selfWorth: number
      concentration: number
      psychomotor: number
      suicidalThoughts: number
    }
    anxietyScreening: {
      nervousness: number
      uncontrollableWorry: number
      excessiveWorry: number
      troubleRelaxing: number
      restlessness: number
      irritability: number
      fearfulness: number
    }
    stressAssessment: {
      workStress: number
      relationshipStress: number
      financialStress: number
      healthStress: number
      familyStress: number
    }
    copingStrategies: string[]
    socialSupport: number
    mentalHealthTreatment: {
      currentTherapy: boolean
      pastTherapy: boolean
      medications: string[]
      hospitalization: boolean
    }
  }

  // Preventive Care History
  preventiveCare: {
    lastPhysicalExam: string
    lastDentalExam: string
    lastEyeExam: string
    screeningTests: {
      test: string
      lastDate: string
      result: string
      nextDue: string
    }[]
    vaccinations: {
      vaccine: string
      lastDate: string
      nextDue: string
    }[]
  }

  // Health Goals & Priorities
  healthGoals: {
    primaryGoals: string[]
    timeframe: string
    motivationLevel: number
    barriers: string[]
    supportSystem: string[]
    previousAttempts: string[]
    successFactors: string[]
  }
}

export default function ComprehensiveHealthAssessmentForm() {
  const [formData, setFormData] = useState<ComprehensiveHealthData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      age: 0,
      gender: "",
      maritalStatus: "",
      occupation: "",
      education: "",
      income: "",
      insurance: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
    physicalMeasurements: {
      height: 0,
      weight: 0,
      bmi: 0,
      waistCircumference: 0,
      hipCircumference: 0,
      bodyFatPercentage: 0,
      muscleMass: 0,
      boneDensity: 0,
      bloodPressure: {
        systolic: 0,
        diastolic: 0,
        measurementTime: "",
        position: "",
      },
      restingHeartRate: 0,
      bodyTemperature: 0,
      respiratoryRate: 0,
      oxygenSaturation: 0,
    },
    medicalHistory: {
      chronicConditions: [],
      pastSurgeries: [],
      hospitalizations: [],
      allergies: [],
      immunizations: [],
      familyHistory: [],
    },
    medications: {
      prescriptions: [],
      overTheCounter: [],
      supplements: [],
      herbalRemedies: [],
    },
    lifestyle: {
      smoking: {
        status: "",
        cigarettesPerDay: 0,
        yearsSmoked: 0,
        quitDate: "",
        quitAttempts: 0,
        secondhandExposure: "",
      },
      alcohol: {
        frequency: "",
        unitsPerWeek: 0,
        typePreferred: [],
        bingeDrinking: false,
        problemDrinking: false,
        lastDrink: "",
      },
      substanceUse: {
        recreationalDrugs: [],
        frequency: "",
        lastUse: "",
      },
      diet: {
        type: "",
        restrictions: [],
        allergies: [],
        mealsPerDay: 0,
        snackingHabits: "",
        waterIntake: 0,
        caffeineIntake: 0,
        fastFood: "",
        homeCooking: "",
        portionSizes: "",
      },
      exercise: {
        type: [],
        frequency: 0,
        duration: 0,
        intensity: "",
        limitations: [],
        personalTrainer: false,
        gymMembership: false,
        sportsParticipation: [],
      },
      sleep: {
        bedtime: "",
        wakeTime: "",
        hoursOfSleep: 0,
        sleepQuality: 0,
        sleepDisorders: [],
        sleepAids: [],
        snoring: false,
        sleepApnea: false,
      },
      stress: {
        level: 0,
        sources: [],
        copingMechanisms: [],
        mentalHealthSupport: false,
        workLifeBalance: 0,
      },
      environment: {
        livingCondition: "",
        airQuality: "",
        waterQuality: "",
        occupationalHazards: [],
        chemicalExposures: [],
        radiationExposure: [],
      },
    },
    currentSymptoms: {
      primaryComplaint: "",
      chiefConcern: "",
      symptomHistory: [],
      systemsReview: {
        constitutional: [],
        cardiovascular: [],
        respiratory: [],
        gastrointestinal: [],
        genitourinary: [],
        musculoskeletal: [],
        neurological: [],
        psychiatric: [],
        endocrine: [],
        hematologic: [],
        dermatologic: [],
        eyes: [],
        ears: [],
        noseThroat: [],
      },
    },
    mentalHealth: {
      currentMood: "",
      moodDisorders: [],
      anxietyLevel: 0,
      depressionScreening: {
        feelingDown: 0,
        lossOfInterest: 0,
        sleepProblems: 0,
        energyLevel: 0,
        appetite: 0,
        selfWorth: 0,
        concentration: 0,
        psychomotor: 0,
        suicidalThoughts: 0,
      },
      anxietyScreening: {
        nervousness: 0,
        uncontrollableWorry: 0,
        excessiveWorry: 0,
        troubleRelaxing: 0,
        restlessness: 0,
        irritability: 0,
        fearfulness: 0,
      },
      stressAssessment: {
        workStress: 0,
        relationshipStress: 0,
        financialStress: 0,
        healthStress: 0,
        familyStress: 0,
      },
      copingStrategies: [],
      socialSupport: 0,
      mentalHealthTreatment: {
        currentTherapy: false,
        pastTherapy: false,
        medications: [],
        hospitalization: false,
      },
    },
    preventiveCare: {
      lastPhysicalExam: "",
      lastDentalExam: "",
      lastEyeExam: "",
      screeningTests: [],
      vaccinations: [],
    },
    healthGoals: {
      primaryGoals: [],
      timeframe: "",
      motivationLevel: 0,
      barriers: [],
      supportSystem: [],
      previousAttempts: [],
      successFactors: [],
    },
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const formSections = [
    { id: "personal", title: "Personal Information", icon: User },
    { id: "physical", title: "Physical Measurements", icon: Scale },
    { id: "medical", title: "Medical History", icon: FileText },
    { id: "medications", title: "Medications & Supplements", icon: Pill },
    { id: "lifestyle", title: "Lifestyle Assessment", icon: Apple },
    { id: "symptoms", title: "Current Symptoms", icon: Stethoscope },
    { id: "mental", title: "Mental Health", icon: Brain },
    { id: "preventive", title: "Preventive Care", icon: Shield },
    { id: "goals", title: "Health Goals", icon: Target },
  ]

  const calculateBMI = (height: number, weight: number) => {
    if (height > 0 && weight > 0) {
      return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10
    }
    return 0
  }

  const updateFormData = (section: keyof ComprehensiveHealthData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const calculateCompletionPercentage = () => {
    // Calculate based on filled required fields
    let totalFields = 0
    let filledFields = 0

    // Count personal info fields
    const personalFields = Object.values(formData.personalInfo)
    totalFields += personalFields.length
    filledFields += personalFields.filter((field) =>
      typeof field === "string"
        ? field.trim() !== ""
        : typeof field === "number"
          ? field > 0
          : typeof field === "object"
            ? Object.values(field).some((v) => v !== "")
            : false,
    ).length

    // Add other sections...
    return Math.round((filledFields / totalFields) * 100)
  }

  const validateCurrentSection = () => {
    const errors: string[] = []

    switch (formSections[currentStep].id) {
      case "personal":
        if (!formData.personalInfo.firstName) errors.push("First name is required")
        if (!formData.personalInfo.lastName) errors.push("Last name is required")
        if (!formData.personalInfo.dateOfBirth) errors.push("Date of birth is required")
        if (!formData.personalInfo.gender) errors.push("Gender is required")
        break
      case "physical":
        if (formData.physicalMeasurements.height <= 0) errors.push("Height is required")
        if (formData.physicalMeasurements.weight <= 0) errors.push("Weight is required")
        break
      case "symptoms":
        if (!formData.currentSymptoms.primaryComplaint) errors.push("Primary complaint is required")
        break
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleNext = () => {
    if (validateCurrentSection()) {
      setCurrentStep((prev) => Math.min(prev + 1, formSections.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateCurrentSection()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Process comprehensive health assessment
      console.log("Comprehensive Health Data:", formData)

      // Redirect to results or show success message
      alert("Comprehensive health assessment completed successfully!")
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPersonalInfoSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.personalInfo.firstName}
            onChange={(e) => updateFormData("personalInfo", "firstName", e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.personalInfo.lastName}
            onChange={(e) => updateFormData("personalInfo", "lastName", e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => {
              updateFormData("personalInfo", "dateOfBirth", e.target.value)
              // Calculate age
              const today = new Date()
              const birthDate = new Date(e.target.value)
              const age = today.getFullYear() - birthDate.getFullYear()
              updateFormData("personalInfo", "age", age)
            }}
          />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={formData.personalInfo.age} readOnly className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(value) => updateFormData("personalInfo", "gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select onValueChange={(value) => updateFormData("personalInfo", "maritalStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
              <SelectItem value="separated">Separated</SelectItem>
              <SelectItem value="domestic-partner">Domestic Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={formData.personalInfo.occupation}
            onChange={(e) => updateFormData("personalInfo", "occupation", e.target.value)}
            placeholder="Enter your occupation"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="education">Education Level</Label>
          <Select onValueChange={(value) => updateFormData("personalInfo", "education", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="some-college">Some College</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="income">Annual Income Range</Label>
          <Select onValueChange={(value) => updateFormData("personalInfo", "income", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-25k">Under ₹25,000</SelectItem>
              <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
              <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
              <SelectItem value="100k-200k">₹1,00,000 - ₹2,00,000</SelectItem>
              <SelectItem value="200k-500k">₹2,00,000 - ₹5,00,000</SelectItem>
              <SelectItem value="over-500k">Over ₹5,00,000</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="insurance">Health Insurance</Label>
        <Input
          id="insurance"
          value={formData.personalInfo.insurance}
          onChange={(e) => updateFormData("personalInfo", "insurance", e.target.value)}
          placeholder="Enter your health insurance provider"
        />
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Emergency Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={formData.personalInfo.emergencyContact.name}
                onChange={(e) =>
                  updateFormData("personalInfo", "emergencyContact", {
                    ...formData.personalInfo.emergencyContact,
                    name: e.target.value,
                  })
                }
                placeholder="Emergency contact name"
              />
            </div>
            <div>
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Input
                id="emergencyRelationship"
                value={formData.personalInfo.emergencyContact.relationship}
                onChange={(e) =>
                  updateFormData("personalInfo", "emergencyContact", {
                    ...formData.personalInfo.emergencyContact,
                    relationship: e.target.value,
                  })
                }
                placeholder="Relationship to you"
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={formData.personalInfo.emergencyContact.phone}
                onChange={(e) =>
                  updateFormData("personalInfo", "emergencyContact", {
                    ...formData.personalInfo.emergencyContact,
                    phone: e.target.value,
                  })
                }
                placeholder="Emergency contact phone"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPhysicalMeasurementsSection = () => (
    <div className="space-y-6">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center">
            <Scale className="w-5 h-5 mr-2" />
            Basic Measurements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                value={formData.physicalMeasurements.height}
                onChange={(e) => {
                  const height = Number.parseFloat(e.target.value)
                  updateFormData("physicalMeasurements", "height", height)
                  const bmi = calculateBMI(height, formData.physicalMeasurements.weight)
                  updateFormData("physicalMeasurements", "bmi", bmi)
                }}
                placeholder="Enter height in cm"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.physicalMeasurements.weight}
                onChange={(e) => {
                  const weight = Number.parseFloat(e.target.value)
                  updateFormData("physicalMeasurements", "weight", weight)
                  const bmi = calculateBMI(formData.physicalMeasurements.height, weight)
                  updateFormData("physicalMeasurements", "bmi", bmi)
                }}
                placeholder="Enter weight in kg"
              />
            </div>
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input id="bmi" value={formData.physicalMeasurements.bmi} readOnly className="bg-gray-50" />
              {formData.physicalMeasurements.bmi > 0 && (
                <div className="mt-2">
                  <Badge
                    className={`${
                      formData.physicalMeasurements.bmi < 18.5
                        ? "bg-blue-100 text-blue-800"
                        : formData.physicalMeasurements.bmi < 25
                          ? "bg-green-100 text-green-800"
                          : formData.physicalMeasurements.bmi < 30
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {formData.physicalMeasurements.bmi < 18.5
                      ? "Underweight"
                      : formData.physicalMeasurements.bmi < 25
                        ? "Normal"
                        : formData.physicalMeasurements.bmi < 30
                          ? "Overweight"
                          : "Obese"}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="waistCircumference">Waist Circumference (cm)</Label>
              <Input
                id="waistCircumference"
                type="number"
                value={formData.physicalMeasurements.waistCircumference}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "waistCircumference", Number.parseFloat(e.target.value))
                }
                placeholder="Measure at narrowest point"
              />
            </div>
            <div>
              <Label htmlFor="hipCircumference">Hip Circumference (cm)</Label>
              <Input
                id="hipCircumference"
                type="number"
                value={formData.physicalMeasurements.hipCircumference}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "hipCircumference", Number.parseFloat(e.target.value))
                }
                placeholder="Measure at widest point"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="bodyFatPercentage">Body Fat Percentage (%)</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                value={formData.physicalMeasurements.bodyFatPercentage}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "bodyFatPercentage", Number.parseFloat(e.target.value))
                }
                placeholder="If known"
              />
            </div>
            <div>
              <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
              <Input
                id="muscleMass"
                type="number"
                value={formData.physicalMeasurements.muscleMass}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "muscleMass", Number.parseFloat(e.target.value))
                }
                placeholder="If known"
              />
            </div>
            <div>
              <Label htmlFor="boneDensity">Bone Density (T-score)</Label>
              <Input
                id="boneDensity"
                type="number"
                value={formData.physicalMeasurements.boneDensity}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "boneDensity", Number.parseFloat(e.target.value))
                }
                placeholder="If known"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Blood Pressure (mmHg)</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={formData.physicalMeasurements.bloodPressure.systolic}
                  onChange={(e) =>
                    updateFormData("physicalMeasurements", "bloodPressure", {
                      ...formData.physicalMeasurements.bloodPressure,
                      systolic: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="Systolic"
                />
                <span className="self-center">/</span>
                <Input
                  type="number"
                  value={formData.physicalMeasurements.bloodPressure.diastolic}
                  onChange={(e) =>
                    updateFormData("physicalMeasurements", "bloodPressure", {
                      ...formData.physicalMeasurements.bloodPressure,
                      diastolic: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="Diastolic"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="restingHeartRate">Resting Heart Rate (bpm)</Label>
              <Input
                id="restingHeartRate"
                type="number"
                value={formData.physicalMeasurements.restingHeartRate}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "restingHeartRate", Number.parseInt(e.target.value))
                }
                placeholder="Beats per minute"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="bodyTemperature">Body Temperature (°C)</Label>
              <Input
                id="bodyTemperature"
                type="number"
                step="0.1"
                value={formData.physicalMeasurements.bodyTemperature}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "bodyTemperature", Number.parseFloat(e.target.value))
                }
                placeholder="Normal: 36.5-37.5"
              />
            </div>
            <div>
              <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
              <Input
                id="respiratoryRate"
                type="number"
                value={formData.physicalMeasurements.respiratoryRate}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "respiratoryRate", Number.parseInt(e.target.value))
                }
                placeholder="Normal: 12-20"
              />
            </div>
            <div>
              <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
              <Input
                id="oxygenSaturation"
                type="number"
                value={formData.physicalMeasurements.oxygenSaturation}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "oxygenSaturation", Number.parseInt(e.target.value))
                }
                placeholder="Normal: 95-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="measurementTime">Measurement Time</Label>
              <Input
                id="measurementTime"
                type="time"
                value={formData.physicalMeasurements.bloodPressure.measurementTime}
                onChange={(e) =>
                  updateFormData("physicalMeasurements", "bloodPressure", {
                    ...formData.physicalMeasurements.bloodPressure,
                    measurementTime: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="measurementPosition">Measurement Position</Label>
              <Select
                onValueChange={(value) =>
                  updateFormData("physicalMeasurements", "bloodPressure", {
                    ...formData.physicalMeasurements.bloodPressure,
                    position: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sitting">Sitting</SelectItem>
                  <SelectItem value="standing">Standing</SelectItem>
                  <SelectItem value="lying">Lying down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentSymptomsSection = () => (
    <div className="space-y-6">
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Primary Health Concerns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primaryComplaint">Primary Complaint/Chief Concern *</Label>
            <Textarea
              id="primaryComplaint"
              value={formData.currentSymptoms.primaryComplaint}
              onChange={(e) => updateFormData("currentSymptoms", "primaryComplaint", e.target.value)}
              placeholder="Describe your main health concern in detail..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="chiefConcern">What brought you here today?</Label>
            <Textarea
              id="chiefConcern"
              value={formData.currentSymptoms.chiefConcern}
              onChange={(e) => updateFormData("currentSymptoms", "chiefConcern", e.target.value)}
              placeholder="Describe what prompted you to seek medical attention..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Detailed Symptom Analysis
          </CardTitle>
          <p className="text-sm text-purple-700">
            For each symptom you're experiencing, please provide detailed information
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              const newSymptom = {
                symptom: "",
                onset: "",
                duration: "",
                frequency: "",
                severity: 5,
                character: "",
                location: [],
                radiation: "",
                timing: "",
                alleviatingFactors: [],
                aggravatingFactors: [],
                associatedSymptoms: [],
                previousOccurrence: false,
                previousTreatment: "",
                impactOnLife: 5,
                worryLevel: 5,
              }
              updateFormData("currentSymptoms", "symptomHistory", [
                ...formData.currentSymptoms.symptomHistory,
                newSymptom,
              ])
            }}
            className="mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Symptom
          </Button>

          {formData.currentSymptoms.symptomHistory.map((symptom, index) => (
            <Card key={index} className="mb-4 border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Symptom {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const updatedSymptoms = formData.currentSymptoms.symptomHistory.filter((_, i) => i !== index)
                      updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Symptom Description</Label>
                    <Input
                      value={symptom.symptom}
                      onChange={(e) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].symptom = e.target.value
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      placeholder="e.g., headache, chest pain, fatigue"
                    />
                  </div>
                  <div>
                    <Label>Character/Quality</Label>
                    <Select
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].character = value
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select character" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sharp">Sharp</SelectItem>
                        <SelectItem value="dull">Dull</SelectItem>
                        <SelectItem value="throbbing">Throbbing</SelectItem>
                        <SelectItem value="burning">Burning</SelectItem>
                        <SelectItem value="cramping">Cramping</SelectItem>
                        <SelectItem value="stabbing">Stabbing</SelectItem>
                        <SelectItem value="aching">Aching</SelectItem>
                        <SelectItem value="pressure">Pressure</SelectItem>
                        <SelectItem value="tingling">Tingling</SelectItem>
                        <SelectItem value="numbness">Numbness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Onset</Label>
                    <Select
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].onset = value
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select onset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sudden">Sudden</SelectItem>
                        <SelectItem value="gradual">Gradual</SelectItem>
                        <SelectItem value="insidious">Insidious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Select
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].duration = value
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">Seconds</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].frequency = value
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="constant">Constant</SelectItem>
                        <SelectItem value="intermittent">Intermittent</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Severity (1-10 scale)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[symptom.severity]}
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].severity = value[0]
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 (Mild)</span>
                      <span>5 (Moderate)</span>
                      <span>10 (Severe)</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-blue-100 text-blue-800">Current: {symptom.severity}/10</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Impact on Daily Life (1-10 scale)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[symptom.impactOnLife]}
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].impactOnLife = value[0]
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 (No impact)</span>
                      <span>5 (Moderate impact)</span>
                      <span>10 (Severe impact)</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-purple-100 text-purple-800">Impact: {symptom.impactOnLife}/10</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Worry Level (1-10 scale)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[symptom.worryLevel]}
                      onValueChange={(value) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].worryLevel = value[0]
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>1 (Not worried)</span>
                      <span>5 (Somewhat worried)</span>
                      <span>10 (Very worried)</span>
                    </div>
                    <div className="text-center mt-2">
                      <Badge className="bg-orange-100 text-orange-800">Worry: {symptom.worryLevel}/10</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>What makes it better?</Label>
                    <Textarea
                      value={symptom.alleviatingFactors.join(", ")}
                      onChange={(e) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].alleviatingFactors = e.target.value.split(", ").filter((f) => f.trim())
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      placeholder="e.g., rest, medication, heat, cold"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>What makes it worse?</Label>
                    <Textarea
                      value={symptom.aggravatingFactors.join(", ")}
                      onChange={(e) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].aggravatingFactors = e.target.value.split(", ").filter((f) => f.trim())
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      placeholder="e.g., movement, stress, certain foods"
                      rows={2}
                    />
                  </div>
                </div>

                <div>
                  <Label>Associated Symptoms</Label>
                  <Textarea
                    value={symptom.associatedSymptoms.join(", ")}
                    onChange={(e) => {
                      const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                      updatedSymptoms[index].associatedSymptoms = e.target.value.split(", ").filter((s) => s.trim())
                      updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                    }}
                    placeholder="Other symptoms that occur with this one"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`previousOccurrence-${index}`}
                    checked={symptom.previousOccurrence}
                    onCheckedChange={(checked) => {
                      const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                      updatedSymptoms[index].previousOccurrence = checked as boolean
                      updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                    }}
                  />
                  <Label htmlFor={`previousOccurrence-${index}`}>Have you experienced this symptom before?</Label>
                </div>

                {symptom.previousOccurrence && (
                  <div>
                    <Label>Previous Treatment</Label>
                    <Textarea
                      value={symptom.previousTreatment}
                      onChange={(e) => {
                        const updatedSymptoms = [...formData.currentSymptoms.symptomHistory]
                        updatedSymptoms[index].previousTreatment = e.target.value
                        updateFormData("currentSymptoms", "symptomHistory", updatedSymptoms)
                      }}
                      placeholder="What treatments have you tried before?"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderMentalHealthSection = () => (
    <div className="space-y-6">
      <Card className="bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Mental Health Assessment
          </CardTitle>
          <p className="text-sm text-indigo-700">
            Your mental health is just as important as your physical health. Please answer honestly.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="currentMood">How would you describe your current mood?</Label>
            <Select onValueChange={(value) => updateFormData("mentalHealth", "currentMood", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="very-poor">Very Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Overall Anxiety Level (1-10 scale)</Label>
            <div className="mt-2">
              <Slider
                value={[formData.mentalHealth.anxietyLevel]}
                onValueChange={(value) => updateFormData("mentalHealth", "anxietyLevel", value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 (No anxiety)</span>
                <span>5 (Moderate)</span>
                <span>10 (Severe anxiety)</span>
              </div>
              <div className="text-center mt-2">
                <Badge className="bg-indigo-100 text-indigo-800">
                  Anxiety Level: {formData.mentalHealth.anxietyLevel}/10
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label>Social Support Level (1-10 scale)</Label>
            <div className="mt-2">
              <Slider
                value={[formData.mentalHealth.socialSupport]}
                onValueChange={(value) => updateFormData("mentalHealth", "socialSupport", value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 (No support)</span>
                <span>5 (Moderate support)</span>
                <span>10 (Strong support)</span>
              </div>
              <div className="text-center mt-2">
                <Badge className="bg-green-100 text-green-800">
                  Social Support: {formData.mentalHealth.socialSupport}/10
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-pink-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-900">Depression Screening (PHQ-9)</CardTitle>
          <p className="text-sm text-pink-700">
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "feelingDown", label: "Feeling down, depressed, or hopeless" },
            { key: "lossOfInterest", label: "Little interest or pleasure in doing things" },
            { key: "sleepProblems", label: "Trouble falling or staying asleep, or sleeping too much" },
            { key: "energyLevel", label: "Feeling tired or having little energy" },
            { key: "appetite", label: "Poor appetite or overeating" },
            { key: "selfWorth", label: "Feeling bad about yourself or that you are a failure" },
            { key: "concentration", label: "Trouble concentrating on things" },
            { key: "psychomotor", label: "Moving or speaking slowly, or being fidgety/restless" },
            { key: "suicidalThoughts", label: "Thoughts that you would be better off dead or hurting yourself" },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <Label>{item.label}</Label>
              <RadioGroup
                value={formData.mentalHealth.depressionScreening[
                  item.key as keyof typeof formData.mentalHealth.depressionScreening
                ].toString()}
                onValueChange={(value) =>
                  updateFormData("mentalHealth", "depressionScreening", {
                    ...formData.mentalHealth.depressionScreening,
                    [item.key]: Number.parseInt(value),
                  })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id={`${item.key}-0`} />
                  <Label htmlFor={`${item.key}-0`} className="text-sm">
                    Not at all
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id={`${item.key}-1`} />
                  <Label htmlFor={`${item.key}-1`} className="text-sm">
                    Several days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id={`${item.key}-2`} />
                  <Label htmlFor={`${item.key}-2`} className="text-sm">
                    More than half the days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id={`${item.key}-3`} />
                  <Label htmlFor={`${item.key}-3`} className="text-sm">
                    Nearly every day
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">Stress Assessment</CardTitle>
          <p className="text-sm text-yellow-700">Rate your stress level in different areas of your life (1-10 scale)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "workStress", label: "Work/Career Stress" },
            { key: "relationshipStress", label: "Relationship Stress" },
            { key: "financialStress", label: "Financial Stress" },
            { key: "healthStress", label: "Health-related Stress" },
            { key: "familyStress", label: "Family Stress" },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <Label>{item.label}</Label>
              <Slider
                value={[
                  formData.mentalHealth.stressAssessment[
                    item.key as keyof typeof formData.mentalHealth.stressAssessment
                  ],
                ]}
                onValueChange={(value) =>
                  updateFormData("mentalHealth", "stressAssessment", {
                    ...formData.mentalHealth.stressAssessment,
                    [item.key]: value[0],
                  })
                }
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 (No stress)</span>
                <span>10 (Extreme stress)</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderHealthGoalsSection = () => (
    <div className="space-y-6">
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Health Goals & Priorities
          </CardTitle>
          <p className="text-sm text-emerald-700">Setting clear health goals helps create a personalized care plan</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Primary Health Goals (Select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {[
                "Weight management",
                "Improve fitness",
                "Better sleep",
                "Stress reduction",
                "Pain management",
                "Chronic disease management",
                "Preventive care",
                "Mental health improvement",
                "Nutrition improvement",
                "Quit smoking",
                "Reduce alcohol consumption",
                "Increase energy levels",
              ].map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={formData.healthGoals.primaryGoals.includes(goal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("healthGoals", "primaryGoals", [...formData.healthGoals.primaryGoals, goal])
                      } else {
                        updateFormData(
                          "healthGoals",
                          "primaryGoals",
                          formData.healthGoals.primaryGoals.filter((g) => g !== goal),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={goal} className="text-sm">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="timeframe">Desired Timeframe for Goals</Label>
            <Select onValueChange={(value) => updateFormData("healthGoals", "timeframe", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-month">1 Month</SelectItem>
                <SelectItem value="3-months">3 Months</SelectItem>
                <SelectItem value="6-months">6 Months</SelectItem>
                <SelectItem value="1-year">1 Year</SelectItem>
                <SelectItem value="long-term">Long-term (1+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Motivation Level (1-10 scale)</Label>
            <div className="mt-2">
              <Slider
                value={[formData.healthGoals.motivationLevel]}
                onValueChange={(value) => updateFormData("healthGoals", "motivationLevel", value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1 (Not motivated)</span>
                <span>5 (Moderately motivated)</span>
                <span>10 (Extremely motivated)</span>
              </div>
              <div className="text-center mt-2">
                <Badge className="bg-emerald-100 text-emerald-800">
                  Motivation: {formData.healthGoals.motivationLevel}/10
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label>Potential Barriers to Achieving Goals</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {[
                "Lack of time",
                "Financial constraints",
                "Lack of motivation",
                "Physical limitations",
                "Work schedule",
                "Family responsibilities",
                "Lack of knowledge",
                "Social pressures",
                "Past failures",
                "Health conditions",
                "Lack of support",
                "Access to resources",
              ].map((barrier) => (
                <div key={barrier} className="flex items-center space-x-2">
                  <Checkbox
                    id={barrier}
                    checked={formData.healthGoals.barriers.includes(barrier)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("healthGoals", "barriers", [...formData.healthGoals.barriers, barrier])
                      } else {
                        updateFormData(
                          "healthGoals",
                          "barriers",
                          formData.healthGoals.barriers.filter((b) => b !== barrier),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={barrier} className="text-sm">
                    {barrier}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Support System (Select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {[
                "Family support",
                "Friends support",
                "Healthcare team",
                "Support groups",
                "Online communities",
                "Personal trainer",
                "Nutritionist",
                "Mental health counselor",
                "Workplace wellness programs",
                "Religious/spiritual community",
                "No support system",
              ].map((support) => (
                <div key={support} className="flex items-center space-x-2">
                  <Checkbox
                    id={support}
                    checked={formData.healthGoals.supportSystem.includes(support)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("healthGoals", "supportSystem", [...formData.healthGoals.supportSystem, support])
                      } else {
                        updateFormData(
                          "healthGoals",
                          "supportSystem",
                          formData.healthGoals.supportSystem.filter((s) => s !== support),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={support} className="text-sm">
                    {support}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentSection = () => {
    switch (formSections[currentStep].id) {
      case "personal":
        return renderPersonalInfoSection()
      case "physical":
        return renderPhysicalMeasurementsSection()
      case "symptoms":
        return renderCurrentSymptomsSection()
      case "mental":
        return renderMentalHealthSection()
      case "goals":
        return renderHealthGoalsSection()
      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <FileText className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Section Under Development</h3>
              <p>This section is being developed with comprehensive forms</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Comprehensive Health Assessment</h1>
            <p className="text-emerald-100 mt-2">Complete detailed health evaluation for personalized care</p>
          </div>
          <div className="text-right">
            <div className="text-white text-2xl font-bold">{Math.round(calculateCompletionPercentage())}%</div>
            <div className="text-emerald-100 text-sm">Complete</div>
          </div>
        </div>

        <div className="mt-6">
          <Progress value={calculateCompletionPercentage()} className="h-3" />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            {React.createElement(formSections[currentStep].icon, { className: "w-6 h-6 mr-3 text-emerald-600" })}
            {formSections[currentStep].title}
          </h2>
          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
            Step {currentStep + 1} of {formSections.length}
          </Badge>
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          {formSections.map((section, index) => (
            <Button
              key={section.id}
              variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCurrentStep(index)}
              className={`flex items-center space-x-2 whitespace-nowrap ${
                index === currentStep
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : index < currentStep
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "text-gray-500"
              }`}
            >
              {React.createElement(section.icon, { className: "w-4 h-4" })}
              <span className="hidden md:inline">{section.title}</span>
              {index < currentStep && <CheckCircle className="w-4 h-4" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="font-semibold mb-2">Please correct the following errors:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6 min-h-[600px]">{renderCurrentSection()}</div>

      {/* Navigation Buttons */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 bg-transparent"
          >
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Save className="w-4 h-4" />
              <span>Save Progress</span>
            </Button>

            {currentStep === formSections.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Assessment</span>
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2">
                <span>Next</span>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              HIPAA Compliant
            </span>
            <span className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              Secure & Encrypted
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Auto-save enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
