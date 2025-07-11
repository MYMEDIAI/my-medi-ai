"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  User,
  TrendingUp,
  Clock,
  FileText,
  MapPin,
  Shield,
  Zap,
  Download,
  Share2,
  Bell,
  Target,
  Apple,
  Moon,
  Calendar,
  Phone,
  Star,
  Mic,
  Camera,
  Filter,
  RotateCcw,
  Sparkles,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import { HealthReportPDFGenerator } from "@/lib/pdf-generator"

// Comprehensive symptom database with emojis
const SYMPTOMS_DATABASE = [
  // Fever related
  { id: "fever", name: "Fever", emoji: "🤒", category: "general", searchTerms: ["fe", "fever", "temperature", "hot"] },
  {
    id: "feeling-weak",
    name: "Feeling weak",
    emoji: "😴",
    category: "general",
    searchTerms: ["fe", "weak", "weakness", "tired"],
  },
  {
    id: "fatigue",
    name: "Fatigue",
    emoji: "😴",
    category: "general",
    searchTerms: ["fa", "fatigue", "exhausted", "energy"],
  },

  // Chest related
  {
    id: "chest-pain",
    name: "Chest pain",
    emoji: "💔",
    category: "cardiac",
    searchTerms: ["che", "chest", "pain", "heart"],
  },
  {
    id: "chest-congestion",
    name: "Chest congestion",
    emoji: "🫁",
    category: "respiratory",
    searchTerms: ["che", "chest", "congestion", "phlegm"],
  },
  {
    id: "chest-tightness",
    name: "Chest tightness",
    emoji: "🫁",
    category: "respiratory",
    searchTerms: ["che", "chest", "tight", "breathing"],
  },

  // Stomach related
  {
    id: "stomach-pain",
    name: "Stomach pain",
    emoji: "🤢",
    category: "gastro",
    searchTerms: ["sto", "stomach", "pain", "abdomen"],
  },
  {
    id: "stomach-upset",
    name: "Stomach upset",
    emoji: "🤢",
    category: "gastro",
    searchTerms: ["sto", "stomach", "upset", "nausea"],
  },
  {
    id: "stomach-burning",
    name: "Stomach burning",
    emoji: "🔥",
    category: "gastro",
    searchTerms: ["sto", "stomach", "burning", "acidity"],
  },
  {
    id: "acidity",
    name: "Acidity",
    emoji: "🔥",
    category: "gastro",
    searchTerms: ["ac", "acidity", "heartburn", "acid"],
  },

  // Head related
  {
    id: "headache",
    name: "Headache",
    emoji: "🤕",
    category: "neurological",
    searchTerms: ["hea", "head", "headache", "migraine"],
  },
  {
    id: "dizziness",
    name: "Dizziness",
    emoji: "😵",
    category: "neurological",
    searchTerms: ["diz", "dizzy", "vertigo", "balance"],
  },

  // Feet related
  {
    id: "feet-swelling",
    name: "Feet swelling",
    emoji: "🦶",
    category: "circulation",
    searchTerms: ["fe", "feet", "swelling", "edema"],
  },
  {
    id: "foot-pain",
    name: "Foot pain",
    emoji: "🦶",
    category: "musculoskeletal",
    searchTerms: ["fo", "foot", "pain", "ankle"],
  },

  // Respiratory
  { id: "cough", name: "Cough", emoji: "😷", category: "respiratory", searchTerms: ["co", "cough", "throat"] },
  {
    id: "shortness-breath",
    name: "Shortness of breath",
    emoji: "😮‍💨",
    category: "respiratory",
    searchTerms: ["sh", "breath", "breathing", "dyspnea"],
  },

  // Skin
  {
    id: "skin-rash",
    name: "Skin rash",
    emoji: "🔴",
    category: "dermatological",
    searchTerms: ["sk", "skin", "rash", "itching"],
  },
  {
    id: "itching",
    name: "Itching",
    emoji: "🔴",
    category: "dermatological",
    searchTerms: ["it", "itch", "scratching"],
  },

  // Sleep
  {
    id: "sleep-problems",
    name: "Sleep problems",
    emoji: "😴",
    category: "general",
    searchTerms: ["sl", "sleep", "insomnia", "rest"],
  },

  // Mental health
  {
    id: "anxiety",
    name: "Anxiety",
    emoji: "😰",
    category: "mental",
    searchTerms: ["an", "anxiety", "worry", "stress"],
  },
  {
    id: "depression",
    name: "Depression",
    emoji: "😔",
    category: "mental",
    searchTerms: ["de", "depression", "sad", "mood"],
  },

  // Blood pressure
  {
    id: "high-bp",
    name: "High Blood Pressure",
    emoji: "💓",
    category: "cardiovascular",
    searchTerms: ["bp", "blood", "pressure", "hypertension"],
  },
]

// Common symptoms for quick access
const COMMON_SYMPTOMS = ["Fever", "Headache", "Cough", "Stomach pain", "Fatigue", "Dizziness"]

// Secondary symptoms based on primary selection
const SECONDARY_SYMPTOMS = {
  fever: [
    { id: "body-ache", name: "Body ache" },
    { id: "chills", name: "Chills" },
    { id: "headache-fever", name: "Headache" },
    { id: "loss-appetite", name: "Loss of appetite" },
    { id: "sweating", name: "Sweating" },
    { id: "nausea-fever", name: "Nausea" },
  ],
  "chest-pain": [
    { id: "shortness-breath-chest", name: "Shortness of breath" },
    { id: "sweating-chest", name: "Sweating" },
    { id: "arm-pain", name: "Arm pain" },
    { id: "jaw-pain", name: "Jaw pain" },
    { id: "dizziness-chest", name: "Dizziness" },
    { id: "nausea-chest", name: "Nausea" },
  ],
  "stomach-pain": [
    { id: "nausea-stomach", name: "Nausea" },
    { id: "vomiting", name: "Vomiting" },
    { id: "diarrhea", name: "Diarrhea" },
    { id: "constipation", name: "Constipation" },
    { id: "bloating", name: "Bloating" },
    { id: "gas", name: "Gas" },
  ],
  headache: [
    { id: "sensitivity-light", name: "Sensitivity to light" },
    { id: "sensitivity-sound", name: "Sensitivity to sound" },
    { id: "nausea-headache", name: "Nausea" },
    { id: "vision-changes", name: "Vision changes" },
    { id: "neck-stiffness", name: "Neck stiffness" },
  ],
  cough: [
    { id: "phlegm", name: "Phlegm/Mucus" },
    { id: "sore-throat", name: "Sore throat" },
    { id: "runny-nose", name: "Runny nose" },
    { id: "sneezing", name: "Sneezing" },
    { id: "wheezing", name: "Wheezing" },
  ],
  acidity: [
    { id: "heartburn", name: "Heartburn" },
    { id: "bloating-acid", name: "Bloating" },
    { id: "nausea-acid", name: "Nausea" },
    { id: "burping", name: "Excessive burping" },
    { id: "throat-burning", name: "Throat burning" },
  ],
}

// Comprehensive medication database with Indian brands and pricing
const MEDICATIONS_DATABASE = [
  // Pain relievers
  {
    id: "paracetamol",
    name: "Paracetamol",
    category: "Pain Relief",
    genericName: "Acetaminophen",
    brands: [
      { name: "Crocin 500mg", price: 35, manufacturer: "GSK", availability: "available", stock: "In Stock" },
      { name: "Dolo 650mg", price: 30, manufacturer: "Micro Labs", availability: "available", stock: "In Stock" },
      { name: "Calpol 500mg", price: 28, manufacturer: "GSK", availability: "limited", stock: "Limited Stock" },
      { name: "Generic Paracetamol", price: 15, manufacturer: "Various", availability: "available", stock: "In Stock" },
    ],
    searchTerms: ["par", "paracetamol", "acetaminophen", "fever", "pain", "crocin", "dolo"],
    interactions: ["alcohol", "warfarin"],
    sideEffects: ["liver-damage-overdose", "nausea"],
    prescriptionRequired: false,
    ageRestrictions: "Safe for all ages with proper dosing",
    dosageInfo: {
      adult: "500-1000mg every 6 hours, max 4g/day",
      child: "10-15mg/kg every 6 hours",
      timing: "Can be taken with or without food",
      duration: "3-5 days, consult doctor if no improvement",
    },
  },

  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Pain Relief",
    genericName: "Ibuprofen",
    brands: [
      { name: "Brufen 400mg", price: 40, manufacturer: "Abbott", availability: "available", stock: "In Stock" },
      { name: "Combiflam", price: 45, manufacturer: "Sanofi", availability: "available", stock: "In Stock" },
      { name: "Advil 400mg", price: 55, manufacturer: "Pfizer", availability: "limited", stock: "Limited Stock" },
      { name: "Generic Ibuprofen", price: 20, manufacturer: "Various", availability: "available", stock: "In Stock" },
    ],
    searchTerms: ["ibu", "ibuprofen", "brufen", "headache", "pain", "inflammation"],
    interactions: ["aspirin", "warfarin", "ACE-inhibitors"],
    sideEffects: ["stomach-upset", "kidney-problems", "heart-risk"],
    prescriptionRequired: false,
    ageRestrictions: "Not recommended for children under 6 months",
    dosageInfo: {
      adult: "400mg twice daily with food, max 1200mg/day",
      child: "5-10mg/kg every 6-8 hours",
      timing: "Take with food to reduce stomach upset",
      duration: "3-5 days for pain, consult doctor for longer use",
    },
  },

  // Acidity medications
  {
    id: "pantoprazole",
    name: "Pantoprazole",
    category: "Acidity",
    genericName: "Pantoprazole",
    brands: [
      { name: "Pan-40", price: 120, manufacturer: "Alkem", availability: "available", stock: "In Stock" },
      { name: "Pantop 40mg", price: 95, manufacturer: "Aristo", availability: "available", stock: "In Stock" },
      {
        name: "Protonix 40mg",
        price: 140,
        manufacturer: "Pfizer",
        availability: "out-of-stock",
        stock: "Out of Stock",
      },
      {
        name: "Generic Pantoprazole",
        price: 35,
        manufacturer: "Various",
        availability: "available",
        stock: "In Stock",
      },
    ],
    searchTerms: ["pan", "pantoprazole", "acidity", "heartburn", "acid", "reflux"],
    interactions: ["clopidogrel", "warfarin", "iron-supplements"],
    sideEffects: ["headache", "diarrhea", "vitamin-b12-deficiency"],
    prescriptionRequired: false,
    ageRestrictions: "Not recommended for children under 5 years",
    dosageInfo: {
      adult: "40mg once daily before breakfast",
      child: "Consult pediatrician for appropriate dosing",
      timing: "30-60 minutes before first meal of the day",
      duration: "2-8 weeks, consult doctor for long-term use",
    },
  },

  {
    id: "omeprazole",
    name: "Omeprazole",
    category: "Acidity",
    genericName: "Omeprazole",
    brands: [
      { name: "Omez 20mg", price: 85, manufacturer: "Dr. Reddy's", availability: "available", stock: "In Stock" },
      { name: "Prilosec 20mg", price: 110, manufacturer: "P&G", availability: "limited", stock: "Limited Stock" },
      {
        name: "Losec 20mg",
        price: 95,
        manufacturer: "AstraZeneca",
        availability: "out-of-stock",
        stock: "Out of Stock",
      },
      { name: "Generic Omeprazole", price: 25, manufacturer: "Various", availability: "available", stock: "In Stock" },
    ],
    searchTerms: ["ome", "omeprazole", "omez", "acidity", "ulcer", "gerd"],
    interactions: ["clopidogrel", "warfarin", "phenytoin"],
    sideEffects: ["headache", "nausea", "diarrhea", "bone-fracture-risk"],
    prescriptionRequired: false,
    ageRestrictions: "Safe for children over 1 year with proper dosing",
    dosageInfo: {
      adult: "20mg once daily before breakfast",
      child: "0.7-3.3mg/kg once daily",
      timing: "Before first meal of the day",
      duration: "4-8 weeks for ulcers, 2-4 weeks for GERD",
    },
  },

  // Blood pressure medications
  {
    id: "amlodipine",
    name: "Amlodipine",
    category: "Blood Pressure",
    genericName: "Amlodipine",
    brands: [
      { name: "Amlong 5mg", price: 50, manufacturer: "Micro Labs", availability: "available", stock: "In Stock" },
      { name: "Stamlo 5mg", price: 48, manufacturer: "Dr. Reddy's", availability: "available", stock: "In Stock" },
      { name: "Norvasc 5mg", price: 85, manufacturer: "Pfizer", availability: "limited", stock: "Limited Stock" },
      { name: "Generic Amlodipine", price: 25, manufacturer: "Various", availability: "available", stock: "In Stock" },
    ],
    searchTerms: ["aml", "amlodipine", "blood pressure", "hypertension", "amlong"],
    interactions: ["grapefruit", "simvastatin", "cyclosporine"],
    sideEffects: ["ankle-swelling", "dizziness", "flushing", "fatigue"],
    prescriptionRequired: true,
    ageRestrictions: "Not recommended for children under 6 years",
    dosageInfo: {
      adult: "5mg once daily, may increase to 10mg",
      child: "Consult pediatric cardiologist",
      timing: "Same time each day, with or without food",
      duration: "Long-term therapy, regular monitoring required",
    },
  },

  // Diabetes medications
  {
    id: "metformin",
    name: "Metformin",
    category: "Diabetes",
    genericName: "Metformin",
    brands: [
      { name: "Glycomet 500mg", price: 45, manufacturer: "USV", availability: "available", stock: "In Stock" },
      { name: "Obimet 500mg", price: 38, manufacturer: "Mankind", availability: "available", stock: "In Stock" },
      { name: "Glucophage 500mg", price: 65, manufacturer: "Merck", availability: "limited", stock: "Limited Stock" },
      { name: "Generic Metformin", price: 25, manufacturer: "Various", availability: "available", stock: "In Stock" },
    ],
    searchTerms: ["met", "metformin", "diabetes", "sugar", "glycomet"],
    interactions: ["alcohol", "contrast-dye", "iodine"],
    sideEffects: ["nausea", "diarrhea", "metallic-taste", "vitamin-b12-deficiency"],
    prescriptionRequired: true,
    ageRestrictions: "Not recommended for children under 10 years",
    dosageInfo: {
      adult: "500mg twice daily with meals, may increase gradually",
      child: "Consult pediatric endocrinologist",
      timing: "With meals to reduce stomach upset",
      duration: "Long-term therapy with regular monitoring",
    },
  },

  // Antibiotics
  {
    id: "azithromycin",
    name: "Azithromycin",
    category: "Antibiotic",
    genericName: "Azithromycin",
    brands: [
      { name: "Azee 500mg", price: 85, manufacturer: "Cipla", availability: "available", stock: "In Stock" },
      { name: "Zithromax 500mg", price: 120, manufacturer: "Pfizer", availability: "available", stock: "In Stock" },
      { name: "Azithral 500mg", price: 90, manufacturer: "Alkem", availability: "limited", stock: "Limited Stock" },
      {
        name: "Generic Azithromycin",
        price: 65,
        manufacturer: "Various",
        availability: "available",
        stock: "In Stock",
      },
    ],
    searchTerms: ["azi", "azithromycin", "antibiotic", "infection", "azee"],
    interactions: ["antacids", "warfarin", "digoxin"],
    sideEffects: ["nausea", "diarrhea", "stomach-pain", "heart-rhythm-changes"],
    prescriptionRequired: true,
    ageRestrictions: "Safe for children over 6 months with proper dosing",
    dosageInfo: {
      adult: "500mg once daily for 3-5 days",
      child: "10mg/kg once daily for 3 days",
      timing: "1 hour before or 2 hours after meals",
      duration: "Complete the full course as prescribed",
    },
  },
]

// Symptom to medication mapping
const SYMPTOM_MEDICATION_MAP = {
  fever: ["paracetamol", "ibuprofen"],
  headache: ["ibuprofen", "paracetamol"],
  acidity: ["pantoprazole", "omeprazole"],
  "stomach-burning": ["pantoprazole", "omeprazole"],
  "high-bp": ["amlodipine"],
  "chest-pain": [], // Emergency - no self-medication
  "stomach-pain": ["omeprazole"], // Mild cases only
}

// Emergency symptoms that require immediate medical attention
const EMERGENCY_SYMPTOMS = ["chest-pain", "shortness-breath", "severe-headache", "high-fever", "severe-abdominal-pain"]

// Pharmacy locations (mock data)
const NEARBY_PHARMACIES = [
  { name: "Apollo Pharmacy", distance: "2km", phone: "+91-9876543210", availability: "24/7" },
  { name: "MedPlus", distance: "3km", phone: "+91-9876543211", availability: "8AM-10PM" },
  { name: "Local Chemist", distance: "1km", phone: "+91-9876543212", availability: "9AM-9PM" },
  { name: "Wellness Forever", distance: "4km", phone: "+91-9876543213", availability: "24/7" },
]

// Medical conditions database with emojis
const MEDICAL_CONDITIONS = [
  { id: "diabetes-type2", name: "Diabetes Type 2", emoji: "💉", category: "Endocrine", prevalence: "8.7%" },
  { id: "hypertension", name: "High Blood Pressure", emoji: "❤️", category: "Cardiovascular", prevalence: "25.3%" },
  { id: "thyroid-disorder", name: "Thyroid Disorder", emoji: "🦋", category: "Endocrine", prevalence: "11%" },
  { id: "heart-disease", name: "Heart Disease", emoji: "❤️", category: "Cardiovascular", prevalence: "3.7%" },
  { id: "kidney-disease", name: "Kidney Disease", emoji: "🫘", category: "Renal", prevalence: "2.1%" },
  { id: "arthritis", name: "Arthritis", emoji: "🦴", category: "Musculoskeletal", prevalence: "15%" },
  { id: "asthma", name: "Asthma", emoji: "🫁", category: "Respiratory", prevalence: "6.1%" },
  { id: "depression", name: "Depression", emoji: "🧠", category: "Mental Health", prevalence: "4.5%" },
  { id: "anxiety", name: "Anxiety Disorder", emoji: "😰", category: "Mental Health", prevalence: "3.1%" },
  { id: "high-cholesterol", name: "High Cholesterol", emoji: "🩸", category: "Cardiovascular", prevalence: "13.9%" },
]

// Lifestyle recommendations based on conditions
const LIFESTYLE_RECOMMENDATIONS = {
  "diabetes-type2": {
    diet: [
      "Reduce rice and wheat, increase millets like jowar and bajra",
      "Eat small frequent meals",
      "Include bitter gourd and fenugreek in diet",
    ],
    exercise: ["30-minute walk after each meal", "Yoga and pranayama daily", "Strength training 2-3 times per week"],
    monitoring: [
      "Check blood sugar before and after meals",
      "HbA1c test every 3 months",
      "Regular eye and foot checkups",
    ],
  },
  hypertension: {
    diet: [
      "Reduce salt intake to less than 5g per day",
      "Increase potassium-rich foods like bananas",
      "Limit processed and packaged foods",
    ],
    exercise: [
      "Brisk walking for 30 minutes daily",
      "Swimming or cycling 3 times per week",
      "Avoid heavy weight lifting",
    ],
    monitoring: ["Check blood pressure twice daily", "Maintain BP diary", "Regular cardiac checkups"],
  },
  "sleep-problems": {
    habits: [
      "Maintain regular bedtime and wake time",
      "Avoid screens 1 hour before bed",
      "Create a cool, dark sleeping environment",
    ],
    diet: ["Avoid caffeine after 2 PM", "Light dinner 2 hours before bed", "Herbal tea like chamomile before sleep"],
    exercise: [
      "Light stretching or yoga before bed",
      "Avoid vigorous exercise 3 hours before sleep",
      "Morning sunlight exposure",
    ],
  },
}

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
  familyHistory: string[]
  duration: string
  severity: number
  lifestyle: {
    exercise: string
    sleep: string
    diet: string
    stress: number
  }
}

interface MedicationSuggestion {
  medication: any
  dosage: string
  timing: string
  duration: string
  costSaving: number
  availability: string[]
  warnings: string[]
  interactions: string[]
  alternative?: string
}

interface LifestyleSuggestion {
  category: string
  recommendations: string[]
  icon: any
}

interface FollowUpItem {
  action: string
  timeframe: string
  priority: "high" | "medium" | "low"
  icon: any
}

interface AIRecommendation {
  healthScore: number
  confidenceScore: number
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  recommendations: string[]
  medicationSuggestions: MedicationSuggestion[]
  lifestyleSuggestions: LifestyleSuggestion[]
  followUpTimeline: FollowUpItem[]
  emergencyWarnings: string[]
  nextSteps: string[]
  safetyAlerts: string[]
}

export default function SmartHealthAssessment() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    personalInfo: { age: 0, gender: "", weight: 0, height: 0 },
    primarySymptom: "",
    secondarySymptoms: [],
    medications: [],
    conditions: [],
    familyHistory: [],
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
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>(null)
  const [medicationFilters, setMedicationFilters] = useState({
    genericOnly: false,
    availableOnly: false,
    otcOnly: false,
  })

  // Filter symptoms based on search
  const filteredSymptoms = useMemo(() => {
    if (!symptomSearch) return SYMPTOMS_DATABASE.slice(0, 10)

    return SYMPTOMS_DATABASE.filter(
      (symptom) =>
        symptom.searchTerms.some((term) => term.toLowerCase().includes(symptomSearch.toLowerCase())) ||
        symptom.name.toLowerCase().includes(symptomSearch.toLowerCase()),
    ).slice(0, 10)
  }, [symptomSearch])

  // Filter medications based on search and filters
  const filteredMedications = useMemo(() => {
    let medications = MEDICATIONS_DATABASE

    // Apply filters
    if (medicationFilters.genericOnly) {
      medications = medications.filter((med) =>
        med.brands.some((brand) => brand.name.toLowerCase().includes("generic")),
      )
    }

    if (medicationFilters.availableOnly) {
      medications = medications.filter((med) => med.brands.some((brand) => brand.availability === "available"))
    }

    if (medicationFilters.otcOnly) {
      medications = medications.filter((med) => !med.prescriptionRequired)
    }

    // Apply search
    if (!medicationSearch) return medications.slice(0, 8)

    return medications
      .filter(
        (medication) =>
          medication.searchTerms.some((term) => term.toLowerCase().includes(medicationSearch.toLowerCase())) ||
          medication.name.toLowerCase().includes(medicationSearch.toLowerCase()) ||
          medication.brands.some((brand) => brand.name.toLowerCase().includes(medicationSearch.toLowerCase())),
      )
      .slice(0, 8)
  }, [medicationSearch, medicationFilters])

  // Get secondary symptoms for selected primary symptom
  const secondarySymptomOptions = useMemo(() => {
    const primarySymptom = SYMPTOMS_DATABASE.find((s) => s.name === assessmentData.primarySymptom)
    if (!primarySymptom) return []

    return SECONDARY_SYMPTOMS[primarySymptom.id] || []
  }, [assessmentData.primarySymptom])

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    let completed = 0
    const total = 8

    if (assessmentData.personalInfo.age > 0) completed++
    if (assessmentData.personalInfo.gender) completed++
    if (assessmentData.personalInfo.weight > 0) completed++
    if (assessmentData.primarySymptom) completed++
    if (assessmentData.severity > 1) completed++
    if (assessmentData.conditions.length > 0) completed++
    if (assessmentData.medications.length > 0) completed++
    if (assessmentData.duration) completed++

    return Math.round((completed / total) * 100)
  }, [assessmentData])

  // Calculate dosage based on age and weight
  const calculateDosage = (medication: any, age: number, weight: number) => {
    if (age < 18 && medication.dosageInfo.child) {
      return `Child dosage: ${medication.dosageInfo.child}`
    }
    return `Adult dosage: ${medication.dosageInfo.adult}`
  }

  // Check for drug interactions
  const checkInteractions = (newMedication: any, currentMedications: string[]) => {
    const interactions: string[] = []

    currentMedications.forEach((medName) => {
      const currentMed = MEDICATIONS_DATABASE.find((m) => m.name === medName)
      if (currentMed) {
        // Check if any interactions exist between medications
        const commonInteractions = newMedication.interactions.filter((interaction: string) =>
          currentMed.interactions.includes(interaction),
        )
        if (commonInteractions.length > 0) {
          interactions.push(`Interaction with ${medName}: ${commonInteractions.join(", ")}`)
        }
      }
    })

    return interactions
  }

  // Generate lifestyle suggestions based on conditions and symptoms
  const generateLifestyleSuggestions = (): LifestyleSuggestion[] => {
    const suggestions: LifestyleSuggestion[] = []

    // Based on conditions
    assessmentData.conditions.forEach((conditionId) => {
      const recommendations = LIFESTYLE_RECOMMENDATIONS[conditionId]
      if (recommendations) {
        if (recommendations.diet) {
          suggestions.push({
            category: "Diet & Nutrition",
            recommendations: recommendations.diet,
            icon: Apple,
          })
        }
        if (recommendations.exercise) {
          suggestions.push({
            category: "Exercise & Activity",
            recommendations: recommendations.exercise,
            icon: Activity,
          })
        }
        if (recommendations.monitoring) {
          suggestions.push({
            category: "Health Monitoring",
            recommendations: recommendations.monitoring,
            icon: Target,
          })
        }
      }
    })

    // Based on lifestyle inputs
    if (assessmentData.lifestyle.exercise === "sedentary" || assessmentData.lifestyle.exercise === "rarely") {
      suggestions.push({
        category: "Exercise & Activity",
        recommendations: [
          "Start with 15-minute walks after meals",
          "Take stairs instead of elevators",
          "Do desk exercises every hour if working",
        ],
        icon: Activity,
      })
    }

    if (assessmentData.lifestyle.sleep === "poor" || assessmentData.lifestyle.sleep === "irregular") {
      suggestions.push({
        category: "Sleep Hygiene",
        recommendations: [
          "Maintain regular bedtime and wake time",
          "Avoid screens 1 hour before bed",
          "Create a cool, dark sleeping environment",
        ],
        icon: Moon,
      })
    }

    // Remove duplicates and limit to 3 categories
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => index === self.findIndex((s) => s.category === suggestion.category))
      .slice(0, 3)

    return uniqueSuggestions
  }

  // Generate follow-up timeline
  const generateFollowUpTimeline = (): FollowUpItem[] => {
    const timeline: FollowUpItem[] = []

    // Based on symptoms
    if (assessmentData.primarySymptom === "Fever") {
      timeline.push({
        action: "Reassess symptoms if no improvement",
        timeframe: "3 days",
        priority: "medium",
        icon: Clock,
      })
      timeline.push({
        action: "See doctor if fever persists",
        timeframe: "5 days",
        priority: "high",
        icon: Stethoscope,
      })
    }

    if (assessmentData.primarySymptom === "Headache" && assessmentData.severity > 7) {
      timeline.push({
        action: "Monitor headache pattern and triggers",
        timeframe: "Daily for 1 week",
        priority: "medium",
        icon: Target,
      })
    }

    // Based on conditions
    if (assessmentData.conditions.includes("hypertension")) {
      timeline.push({
        action: "Monitor blood pressure daily",
        timeframe: "1 week",
        priority: "high",
        icon: Heart,
      })
      timeline.push({
        action: "Schedule follow-up appointment",
        timeframe: "2 weeks",
        priority: "medium",
        icon: Calendar,
      })
    }

    if (assessmentData.conditions.includes("diabetes-type2")) {
      timeline.push({
        action: "Check blood sugar levels",
        timeframe: "Daily",
        priority: "high",
        icon: Target,
      })
      timeline.push({
        action: "HbA1c test",
        timeframe: "3 months",
        priority: "medium",
        icon: FileText,
      })
    }

    // Default follow-up if no specific conditions
    if (timeline.length === 0) {
      timeline.push({
        action: "General health checkup",
        timeframe: "1 month",
        priority: "low",
        icon: Stethoscope,
      })
    }

    return timeline.slice(0, 4) // Limit to 4 items
  }

  // Generate AI recommendations based on current data
  useEffect(() => {
    generateAIRecommendations()
  }, [assessmentData])

  const generateAIRecommendations = () => {
    let healthScore = 85
    let confidenceScore = 50 // Base confidence
    let riskLevel: "Low" | "Moderate" | "High" | "Critical" = "Low"
    const recommendations: string[] = []
    const medicationSuggestions: MedicationSuggestion[] = []
    const emergencyWarnings: string[] = []
    const nextSteps: string[] = []
    const safetyAlerts: string[] = []

    // Increase confidence based on completed fields
    if (assessmentData.personalInfo.age > 0) confidenceScore += 10
    if (assessmentData.personalInfo.gender) confidenceScore += 5
    if (assessmentData.primarySymptom) confidenceScore += 15
    if (assessmentData.secondarySymptoms.length > 0) confidenceScore += 10
    if (assessmentData.conditions.length > 0) confidenceScore += 10
    if (assessmentData.severity > 1) confidenceScore += 5

    // Check for emergency symptoms
    const primarySymptom = SYMPTOMS_DATABASE.find((s) => s.name === assessmentData.primarySymptom)
    if (primarySymptom && EMERGENCY_SYMPTOMS.includes(primarySymptom.id)) {
      healthScore -= 30
      riskLevel = "Critical"
      emergencyWarnings.push("🚨 This symptom requires immediate medical attention")

      if (primarySymptom.id === "chest-pain") {
        emergencyWarnings.push("🚨 Chest pain + any associated symptoms → Call emergency services immediately")
        safetyAlerts.push("Do not drive yourself to hospital")
        safetyAlerts.push("Call 108 (Emergency) or go to nearest ER")
      }
    }

    // Generate medication suggestions based on symptoms
    if (primarySymptom && SYMPTOM_MEDICATION_MAP[primarySymptom.id]) {
      const suggestedMedIds = SYMPTOM_MEDICATION_MAP[primarySymptom.id]

      suggestedMedIds.forEach((medId) => {
        const medication = MEDICATIONS_DATABASE.find((m) => m.id === medId)
        if (medication) {
          const interactions = checkInteractions(medication, assessmentData.medications)
          const dosage = calculateDosage(
            medication,
            assessmentData.personalInfo.age,
            assessmentData.personalInfo.weight,
          )

          // Calculate cost savings
          const brandPrice = Math.max(...medication.brands.map((b) => b.price))
          const genericPrice = Math.min(...medication.brands.map((b) => b.price))
          const costSaving = brandPrice - genericPrice

          const warnings: string[] = []

          // Age-based warnings
          if (assessmentData.personalInfo.age < 18 && medication.ageRestrictions.includes("children")) {
            warnings.push("⚠️ Age restriction applies - consult pediatrician")
          }

          if (assessmentData.personalInfo.age > 65) {
            warnings.push("⚠️ Elderly patients may need dose adjustment")
          }

          // Prescription warnings
          if (medication.prescriptionRequired) {
            warnings.push("⚠️ Prescription required - consult doctor")
          }

          // Add alternative medication
          let alternative = ""
          if (medId === "paracetamol") {
            alternative = "Ibuprofen 400mg if paracetamol doesn't help"
          } else if (medId === "ibuprofen") {
            alternative = "Paracetamol 500mg if ibuprofen causes stomach upset"
          }

          medicationSuggestions.push({
            medication,
            dosage: medication.dosageInfo.adult,
            timing: medication.dosageInfo.timing,
            duration: medication.dosageInfo.duration,
            costSaving,
            availability: NEARBY_PHARMACIES.map((p) => `${p.name} (${p.distance})`),
            warnings,
            interactions,
            alternative,
          })
        }
      })
    }

    // Adjust health score based on conditions
    assessmentData.conditions.forEach((conditionId) => {
      switch (conditionId) {
        case "diabetes-type2":
          healthScore -= 15
          if (riskLevel === "Low") riskLevel = "Moderate"
          recommendations.push("🩸 Monitor blood sugar levels regularly")
          break
        case "hypertension":
          healthScore -= 10
          if (riskLevel === "Low") riskLevel = "Moderate"
          recommendations.push("❤️ Monitor blood pressure daily")
          break
        case "heart-disease":
          healthScore -= 20
          riskLevel = "High"
          recommendations.push("❤️ Cardiac monitoring and regular checkups essential")
          break
      }
    })

    // Adjust based on severity
    if (assessmentData.severity > 7) {
      healthScore -= 15
      if (riskLevel === "Low") riskLevel = "Moderate"
      recommendations.push("⚠️ High symptom severity requires medical attention")
    }

    // Lifestyle-based recommendations
    if (assessmentData.lifestyle.exercise === "sedentary") {
      healthScore -= 10
      recommendations.push("🏃 Increase physical activity gradually")
    }

    if (assessmentData.lifestyle.stress > 7) {
      healthScore -= 10
      recommendations.push("🧘 Stress management techniques recommended")
    }

    // Generate next steps
    if (medicationSuggestions.length > 0) {
      nextSteps.push("💊 Start recommended medications as advised")
    }

    nextSteps.push("📊 Monitor symptoms daily and maintain a health diary")

    if (assessmentData.conditions.length > 0) {
      nextSteps.push("🏥 Schedule follow-up with your regular doctor")
    }

    nextSteps.push("📱 Use MyMedi.AI app for ongoing health tracking")

    // Ensure health score is within bounds
    healthScore = Math.max(0, Math.min(100, healthScore))

    // Generate lifestyle suggestions
    const lifestyleSuggestions = generateLifestyleSuggestions()

    // Generate follow-up timeline
    const followUpTimeline = generateFollowUpTimeline()

    setAiRecommendations({
      healthScore,
      confidenceScore: Math.min(95, confidenceScore),
      riskLevel,
      recommendations,
      medicationSuggestions,
      lifestyleSuggestions,
      followUpTimeline,
      emergencyWarnings,
      nextSteps,
      safetyAlerts,
    })
  }

  const handleSymptomSelect = (symptom: any) => {
    setAssessmentData((prev) => ({
      ...prev,
      primarySymptom: symptom.name,
    }))
    setSymptomSearch("")
    setShowSymptomDropdown(false)
  }

  const handleSecondarySymptomToggle = (symptom: any) => {
    setAssessmentData((prev) => ({
      ...prev,
      secondarySymptoms: prev.secondarySymptoms.includes(symptom.name)
        ? prev.secondarySymptoms.filter((s) => s !== symptom.name)
        : [...prev.secondarySymptoms, symptom.name],
    }))
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

  const clearAllSymptoms = () => {
    setAssessmentData((prev) => ({
      ...prev,
      primarySymptom: "",
      secondarySymptoms: [],
    }))
  }

  const clearAllMedications = () => {
    setAssessmentData((prev) => ({
      ...prev,
      medications: [],
    }))
  }

  const downloadReport = () => {
    if (!aiRecommendations) return

    const generator = new HealthReportPDFGenerator()
    const patientName = `Patient (Age: ${assessmentData.personalInfo.age})`

    generator.generateReport(assessmentData, aiRecommendations, patientName)
    generator.downloadPDF(`MyMedi-AI-Health-Report-${Date.now()}.pdf`)
  }

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: "MyMedi.AI Health Assessment Report",
        text: `Health Score: ${aiRecommendations?.healthScore}/100 | Risk Level: ${aiRecommendations?.riskLevel}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Report link copied to clipboard!")
    }
  }

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
                AI-Powered
              </Badge>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Emergency: 108
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Health Assessment</h1>
              <p className="text-gray-600 mt-1">AI-powered health analysis with personalized recommendations</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
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
              </CardContent>
            </Card>

            {/* Primary Symptom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-red-600" />
                  Primary Symptom
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Symptom Search Dropdown */}
                  <Popover open={showSymptomDropdown} onOpenChange={setShowSymptomDropdown}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={showSymptomDropdown}
                        className="w-full justify-between h-12 bg-transparent"
                      >
                        {assessmentData.primarySymptom || "Type symptom (e.g., fever, headache...)"}
                        <div className="flex items-center space-x-2">
                          <Mic className="w-4 h-4 text-gray-400" />
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
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

                  {/* Selected Primary Symptom */}
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

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={clearAllSymptoms}>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Clear all
                    </Button>
                    <Button variant="outline" size="sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Common symptoms
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Symptoms */}
            {secondarySymptomOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-orange-600" />
                    Related Symptoms
                    <Badge variant="secondary" className="ml-2">
                      Also check
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {secondarySymptomOptions.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.id}
                          checked={assessmentData.secondarySymptoms.includes(symptom.name)}
                          onCheckedChange={() => handleSecondarySymptomToggle(symptom)}
                        />
                        <Label htmlFor={symptom.id} className="text-sm">
                          {symptom.name}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Selected Secondary Symptoms */}
                  {assessmentData.secondarySymptoms.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.secondarySymptoms.map((symptom) => (
                          <Badge key={symptom} variant="outline" className="text-xs">
                            {symptom}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-3 w-3 p-0"
                              onClick={() =>
                                setAssessmentData((prev) => ({
                                  ...prev,
                                  secondarySymptoms: prev.secondarySymptoms.filter((s) => s !== symptom),
                                }))
                              }
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Symptom Details */}
            {assessmentData.primarySymptom && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
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
                  {/* Medication Search with Filters */}
                  <div className="space-y-3">
                    <Popover open={showMedicationDropdown} onOpenChange={setShowMedicationDropdown}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={showMedicationDropdown}
                          className="w-full justify-between h-12 bg-transparent"
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <span>Search medications...</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Camera className="w-4 h-4 text-gray-400" />
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search medications..."
                            value={medicationSearch}
                            onValueChange={setMedicationSearch}
                          />
                          <div className="p-2 border-b">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant={medicationFilters.genericOnly ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setMedicationFilters((prev) => ({
                                    ...prev,
                                    genericOnly: !prev.genericOnly,
                                  }))
                                }
                              >
                                <Filter className="w-3 h-3 mr-1" />
                                Generic only
                              </Button>
                              <Button
                                variant={medicationFilters.availableOnly ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setMedicationFilters((prev) => ({
                                    ...prev,
                                    availableOnly: !prev.availableOnly,
                                  }))
                                }
                              >
                                Available only
                              </Button>
                              <Button
                                variant={medicationFilters.otcOnly ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setMedicationFilters((prev) => ({
                                    ...prev,
                                    otcOnly: !prev.otcOnly,
                                  }))
                                }
                              >
                                OTC only
                              </Button>
                            </div>
                          </div>
                          <CommandList>
                            <CommandEmpty>No medications found.</CommandEmpty>
                            <CommandGroup>
                              {filteredMedications.map((medication) => (
                                <CommandItem
                                  key={medication.id}
                                  onSelect={() => handleMedicationSelect(medication)}
                                  className="flex flex-col items-start space-y-1 p-3"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">{medication.name}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {medication.category}
                                      </Badge>
                                    </div>
                                    {!medication.prescriptionRequired && (
                                      <Badge variant="outline" className="text-xs text-green-600">
                                        OTC
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 w-full">
                                    {medication.brands.slice(0, 2).map((brand, index) => (
                                      <div key={brand.name} className="flex items-center justify-between">
                                        <span>
                                          {brand.name} | {medication.genericName}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">₹{brand.price}</span>
                                          <div
                                            className={`w-2 h-2 rounded-full ${
                                              brand.availability === "available"
                                                ? "bg-green-500"
                                                : brand.availability === "limited"
                                                  ? "bg-yellow-500"
                                                  : "bg-red-500"
                                            }`}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                    {medication.brands.length > 2 && (
                                      <span className="text-xs text-gray-400">
                                        +{medication.brands.length - 2} more options
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={clearAllMedications}>
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Clear all
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="w-3 h-3 mr-1" />
                        Scan prescription
                      </Button>
                    </div>
                  </div>

                  {/* Selected Medications */}
                  {assessmentData.medications.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Medications:</Label>
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.medications.map((medication) => (
                          <Badge key={medication} variant="outline" className="text-sm py-1 px-3">
                            💊 {medication}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEDICAL_CONDITIONS.map((condition) => (
                    <div
                      key={condition.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        assessmentData.conditions.includes(condition.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleConditionToggle(condition.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{condition.emoji}</span>
                          <div>
                            <div className="font-medium">{condition.name}</div>
                            <div className="text-sm text-gray-500">{condition.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Prevalence</div>
                          <div className="text-sm font-medium">{condition.prevalence}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Conditions */}
                {assessmentData.conditions.length > 0 && (
                  <div className="mt-4">
                    <Label>Selected Conditions:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {assessmentData.conditions.map((conditionId) => {
                        const condition = MEDICAL_CONDITIONS.find((c) => c.id === conditionId)
                        return (
                          <Badge key={conditionId} variant="default" className="text-sm py-1 px-3">
                            {condition?.emoji} {condition?.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0"
                              onClick={() => handleConditionToggle(conditionId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            {aiRecommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    AI Health Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Health Score Circle */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - aiRecommendations.healthScore / 100)}`}
                          className={
                            aiRecommendations.healthScore >= 80
                              ? "text-green-500"
                              : aiRecommendations.healthScore >= 60
                                ? "text-yellow-500"
                                : "text-red-500"
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{aiRecommendations.healthScore}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-lg font-semibold">Health Score</div>
                      <Badge
                        variant={
                          aiRecommendations.riskLevel === "Low"
                            ? "default"
                            : aiRecommendations.riskLevel === "Moderate"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {aiRecommendations.riskLevel} Risk
                      </Badge>
                    </div>
                  </div>

                  {/* AI Confidence */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600">AI Confidence</div>
                    <div className="text-lg font-semibold text-blue-600">{aiRecommendations.confidenceScore}%</div>
                    <Progress value={aiRecommendations.confidenceScore} className="h-2 mt-1" />
                  </div>

                  {/* Emergency Warnings */}
                  {aiRecommendations.emergencyWarnings.length > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <div className="font-semibold mb-2">Emergency Alert</div>
                        {aiRecommendations.emergencyWarnings.map((warning, index) => (
                          <div key={index} className="text-sm">
                            {warning}
                          </div>
                        ))}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Key Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Recommendations</h4>
                    <div className="space-y-2">
                      {aiRecommendations.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button onClick={downloadReport} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" onClick={shareReport} className="w-full bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medication Suggestions */}
            {aiRecommendations && aiRecommendations.medicationSuggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-green-600" />
                    AI Medication Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiRecommendations.medicationSuggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{suggestion.medication.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.medication.category}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div>💊 {suggestion.dosage}</div>
                        <div>⏰ {suggestion.timing}</div>
                        <div>📅 {suggestion.duration}</div>
                      </div>

                      {suggestion.costSaving > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          💰 Save ₹{suggestion.costSaving} with generic option
                        </div>
                      )}

                      {suggestion.warnings.length > 0 && (
                        <div className="text-xs text-yellow-600">⚠️ {suggestion.warnings[0]}</div>
                      )}

                      <div className="text-xs text-gray-500">Available at: {suggestion.availability[0]}</div>
                    </div>
                  ))}

                  {aiRecommendations.medicationSuggestions.length > 2 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        View all {aiRecommendations.medicationSuggestions.length} suggestions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Nearby Pharmacies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Nearby Pharmacies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NEARBY_PHARMACIES.slice(0, 3).map((pharmacy, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">{pharmacy.name}</div>
                      <div className="text-xs text-gray-500">
                        {pharmacy.distance} • {pharmacy.availability}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with AI Doctor
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Medication Reminder
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Star className="w-4 h-4 mr-2" />
                  Rate this Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed AI Recommendations */}
        {aiRecommendations && (
          <div className="mt-8 space-y-6">
            <Separator />

            {/* Medication Details */}
            {aiRecommendations.medicationSuggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-green-600" />
                    Detailed Medication Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aiRecommendations.medicationSuggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">{suggestion.medication.name}</h4>
                          <p className="text-sm text-gray-600">{suggestion.medication.genericName}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{suggestion.medication.category}</Badge>
                          {!suggestion.medication.prescriptionRequired && (
                            <Badge variant="outline" className="ml-2 text-green-600">
                              OTC
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Dosage Information</h5>
                          <div className="space-y-1 text-sm">
                            <div>
                              💊 <strong>Dosage:</strong> {suggestion.dosage}
                            </div>
                            <div>
                              ⏰ <strong>Timing:</strong> {suggestion.timing}
                            </div>
                            <div>
                              📅 <strong>Duration:</strong> {suggestion.duration}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Available Options</h5>
                          <div className="space-y-2">
                            {suggestion.medication.brands.slice(0, 3).map((brand: any, brandIndex: number) => (
                              <div key={brandIndex} className="flex items-center justify-between text-sm">
                                <span>{brand.name}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">₹{brand.price}</span>
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      brand.availability === "available"
                                        ? "bg-green-500"
                                        : brand.availability === "limited"
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {suggestion.costSaving > 0 && (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            💰 <strong>Cost Savings:</strong> Save ₹{suggestion.costSaving} by choosing generic option
                          </AlertDescription>
                        </Alert>
                      )}

                      {suggestion.warnings.length > 0 && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            <div className="font-semibold mb-1">Important Warnings:</div>
                            {suggestion.warnings.map((warning, wIndex) => (
                              <div key={wIndex} className="text-sm">
                                • {warning}
                              </div>
                            ))}
                          </AlertDescription>
                        </Alert>
                      )}

                      {suggestion.interactions.length > 0 && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            <div className="font-semibold mb-1">Drug Interactions:</div>
                            {suggestion.interactions.map((interaction, iIndex) => (
                              <div key={iIndex} className="text-sm">
                                • {interaction}
                              </div>
                            ))}
                          </AlertDescription>
                        </Alert>
                      )}

                      {suggestion.alternative && (
                        <div className="text-sm text-blue-600">
                          <strong>Alternative:</strong> {suggestion.alternative}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Lifestyle Recommendations */}
            {aiRecommendations.lifestyleSuggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Apple className="w-5 h-5 mr-2 text-green-600" />
                    Lifestyle Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aiRecommendations.lifestyleSuggestions.map((suggestion, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="flex items-center text-lg font-semibold">
                        <suggestion.icon className="w-5 h-5 mr-2 text-blue-600" />
                        {suggestion.category}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {suggestion.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Follow-up Timeline */}
            {aiRecommendations.followUpTimeline.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Follow-up Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiRecommendations.followUpTimeline.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <item.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{item.action}</div>
                          <div className="text-sm text-gray-600">{item.timeframe}</div>
                        </div>
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Important Safety Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="font-semibold mb-2">Medical Disclaimer</div>
                    <div className="text-sm space-y-1">
                      <div>• This AI assessment is for informational purposes only</div>
                      <div>• Always consult healthcare professionals for medical decisions</div>
                      <div>• Seek immediate medical attention for emergency symptoms</div>
                      <div>• Do not stop prescribed medications without doctor consultation</div>
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <Bell className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="font-semibold mb-2">Emergency Contacts (India)</div>
                    <div className="text-sm space-y-1">
                      <div>
                        • Emergency Services: <strong>108</strong>
                      </div>
                      <div>
                        • Police: <strong>100</strong>
                      </div>
                      <div>
                        • Fire: <strong>101</strong>
                      </div>
                      <div>
                        • Medical Emergency: <strong>102</strong>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {aiRecommendations.safetyAlerts.length > 0 && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <div className="font-semibold mb-2">Additional Safety Alerts</div>
                      <div className="text-sm space-y-1">
                        {aiRecommendations.safetyAlerts.map((alert, index) => (
                          <div key={index}>• {alert}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <PoweredByFooter />
    </div>
  )
}
