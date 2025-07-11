"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Pill,
  DollarSign,
  Shield,
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Sparkles,
  Bot,
  X,
  ShoppingCart,
  Clock,
  AlertCircle,
  TrendingDown,
  Truck,
  CreditCard,
  Building,
  Stethoscope,
} from "lucide-react"

interface MedicationOption {
  brandName: string
  manufacturer: string
  price: number
  availability: string
  prescriptionRequired: boolean
}

interface DosageInstructions {
  adult: string
  elderly?: string
  timing: string
  duration: string
}

interface MedicationRecommendation {
  medicationType: string
  genericName: string
  condition: string
  brandOptions: MedicationOption[]
  dosageInstructions: DosageInstructions
  contraindications: string[]
  sideEffects: string[]
  interactions: string[]
  warnings: string[]
  costSavings: string
  aiReasoning: string
}

interface SafetyAlert {
  severity: string
  message: string
  action: string
}

interface DrugInteraction {
  drug1: string
  drug2: string
  severity: string
  mechanism: string
  clinicalEffect: string
  management: string
  alternatives: string[]
  timingAdjustment?: string
}

interface PriceOption {
  type: string
  name: string
  price: number
  manufacturer: string
  availability: string
}

interface PharmacyInfo {
  pharmacy: string
  distance: string
  availability: string
  deliveryAvailable: boolean
}

interface PatientProfile {
  age: number
  gender: string
  weight: number
  symptoms: string[]
  medicalHistory: string[]
  currentMedications: string[]
  allergies: string[]
}

export default function AIMedicationAnalyzer() {
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    age: 0,
    gender: "",
    weight: 0,
    symptoms: [],
    medicalHistory: [],
    currentMedications: [],
    allergies: [],
  })

  const [medicationInput, setMedicationInput] = useState("")
  const [selectedMedications, setSelectedMedications] = useState<string[]>([])
  const [medicationRecommendations, setMedicationRecommendations] = useState<MedicationRecommendation[]>([])
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([])
  const [priceComparison, setPriceComparison] = useState<any>(null)
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([])

  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [isLoadingSafety, setIsLoadingSafety] = useState(false)

  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)

  // Common Indian medications for quick selection
  const commonMedications = [
    "Paracetamol (Crocin/Dolo)",
    "Ibuprofen (Brufen/Combiflam)",
    "Pantoprazole (Pan-40)",
    "Omeprazole (Omez)",
    "Metformin (Glycomet)",
    "Amlodipine (Amlong)",
    "Azithromycin (Azee)",
    "Cetirizine (Zyrtec)",
    "Domperidone (Domstal)",
    "Ranitidine (Aciloc)",
  ]

  // Real-time medication analysis when medications change
  useEffect(() => {
    if (selectedMedications.length > 0) {
      performComprehensiveAnalysis()
    }
  }, [selectedMedications, patientProfile])

  const performComprehensiveAnalysis = async () => {
    if (selectedMedications.length === 0) return

    setAnalysisProgress(0)

    // Start all analyses in parallel
    const analyses = [
      getMedicationRecommendations(),
      checkDrugInteractions(),
      getPriceComparison(),
      performSafetyMonitoring(),
    ]

    // Update progress as each analysis completes
    let completed = 0
    const updateProgress = () => {
      completed++
      setAnalysisProgress((completed / analyses.length) * 100)
    }

    try {
      const results = await Promise.allSettled(
        analyses.map(async (analysis) => {
          const result = await analysis
          updateProgress()
          return result
        }),
      )

      console.log("All analyses completed:", results)
    } catch (error) {
      console.error("Error in comprehensive analysis:", error)
    }
  }

  const getMedicationRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      const response = await fetch("/api/ai-medication-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: patientProfile.symptoms,
          medicalHistory: patientProfile.medicalHistory,
          currentMedications: patientProfile.currentMedications,
          age: patientProfile.age,
          gender: patientProfile.gender,
          weight: patientProfile.weight,
          allergies: patientProfile.allergies,
          type: "medication_recommendations",
        }),
      })

      const result = await response.json()
      if (result.success && result.data.recommendations) {
        setMedicationRecommendations(result.data.recommendations)
        if (result.data.safetyAlerts) {
          setSafetyAlerts(result.data.safetyAlerts)
        }
      }
    } catch (error) {
      console.error("Error getting medication recommendations:", error)
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  const checkDrugInteractions = async () => {
    if (selectedMedications.length < 2) return

    setIsLoadingInteractions(true)
    try {
      const response = await fetch("/api/ai-medication-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentMedications: patientProfile.currentMedications,
          medicationList: selectedMedications,
          age: patientProfile.age,
          medicalHistory: patientProfile.medicalHistory,
          type: "drug_interaction_check",
        }),
      })

      const result = await response.json()
      if (result.success && result.data.interactions) {
        setDrugInteractions(result.data.interactions)

        // Check for emergency interactions
        const hasEmergency = result.data.interactions.some(
          (interaction: DrugInteraction) =>
            interaction.severity === "contraindicated" || interaction.severity === "severe",
        )
        setShowEmergencyAlert(hasEmergency || result.data.emergencyAlert)
      }
    } catch (error) {
      console.error("Error checking drug interactions:", error)
    } finally {
      setIsLoadingInteractions(false)
    }
  }

  const getPriceComparison = async () => {
    setIsLoadingPrices(true)
    try {
      const response = await fetch("/api/ai-medication-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationList: selectedMedications,
          type: "price_comparison",
        }),
      })

      const result = await response.json()
      if (result.success && result.data) {
        setPriceComparison(result.data)
      }
    } catch (error) {
      console.error("Error getting price comparison:", error)
    } finally {
      setIsLoadingPrices(false)
    }
  }

  const performSafetyMonitoring = async () => {
    setIsLoadingSafety(true)
    try {
      const response = await fetch("/api/ai-medication-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: patientProfile.age,
          gender: patientProfile.gender,
          medicalHistory: patientProfile.medicalHistory,
          currentMedications: patientProfile.currentMedications,
          medicationList: selectedMedications,
          allergies: patientProfile.allergies,
          type: "safety_monitoring",
        }),
      })

      const result = await response.json()
      if (result.success && result.data.alerts) {
        setSafetyAlerts((prev) => [...prev, ...result.data.alerts])

        // Check for critical safety alerts
        const hasCritical = result.data.alerts.some((alert: SafetyAlert) => alert.severity === "critical")
        if (hasCritical) {
          setShowEmergencyAlert(true)
        }
      }
    } catch (error) {
      console.error("Error performing safety monitoring:", error)
    } finally {
      setIsLoadingSafety(false)
    }
  }

  const addMedication = (medication: string) => {
    if (!selectedMedications.includes(medication)) {
      setSelectedMedications([...selectedMedications, medication])
    }
    setMedicationInput("")
  }

  const removeMedication = (medication: string) => {
    setSelectedMedications(selectedMedications.filter((m) => m !== medication))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "contraindicated":
      case "severe":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
      case "minor":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "widely_available":
      case "in_stock":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "limited":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "rare":
      case "out_of_stock":
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-green-100 rounded-full">
            <Pill className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">AI Medication Analyzer</h1>
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <Bot className="w-3 h-3 mr-1" />
            Smart Pharma AI
          </Badge>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-powered medication analysis with Indian pharmaceutical market intelligence, drug interaction checking, and
          smart price comparison.
        </p>
      </div>

      {/* Emergency Alert */}
      {showEmergencyAlert && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-bold text-lg mb-2">🚨 CRITICAL MEDICATION ALERT</div>
            <div className="text-sm">
              AI detected serious drug interactions or contraindications. Seek immediate medical consultation before
              taking these medications.
            </div>
            <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call Doctor Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Patient Information
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
                    value={patientProfile.age || ""}
                    onChange={(e) =>
                      setPatientProfile((prev) => ({
                        ...prev,
                        age: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={patientProfile.gender}
                    onChange={(e) =>
                      setPatientProfile((prev) => ({
                        ...prev,
                        gender: e.target.value,
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
                    value={patientProfile.weight || ""}
                    onChange={(e) =>
                      setPatientProfile((prev) => ({
                        ...prev,
                        weight: Number.parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <Label>Current Symptoms</Label>
                <Textarea
                  placeholder="Describe your symptoms..."
                  value={patientProfile.symptoms.join(", ")}
                  onChange={(e) =>
                    setPatientProfile((prev) => ({
                      ...prev,
                      symptoms: e.target.value.split(", ").filter((s) => s.trim()),
                    }))
                  }
                />
              </div>

              {/* Medical History */}
              <div>
                <Label>Medical History</Label>
                <Textarea
                  placeholder="List medical conditions (diabetes, hypertension, etc.)"
                  value={patientProfile.medicalHistory.join(", ")}
                  onChange={(e) =>
                    setPatientProfile((prev) => ({
                      ...prev,
                      medicalHistory: e.target.value.split(", ").filter((s) => s.trim()),
                    }))
                  }
                />
              </div>

              {/* Current Medications */}
              <div>
                <Label>Current Medications</Label>
                <Textarea
                  placeholder="List current medications..."
                  value={patientProfile.currentMedications.join(", ")}
                  onChange={(e) =>
                    setPatientProfile((prev) => ({
                      ...prev,
                      currentMedications: e.target.value.split(", ").filter((s) => s.trim()),
                    }))
                  }
                />
              </div>

              {/* Allergies */}
              <div>
                <Label>Known Allergies</Label>
                <Input
                  placeholder="List any drug allergies..."
                  value={patientProfile.allergies.join(", ")}
                  onChange={(e) =>
                    setPatientProfile((prev) => ({
                      ...prev,
                      allergies: e.target.value.split(", ").filter((s) => s.trim()),
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Medication Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-purple-600" />
                AI-Powered Medication Analysis
                <Badge variant="outline" className="ml-2">
                  Real-time AI
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Medication Search */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search medications or select from common options..."
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>

                {/* Common Medications Quick Select */}
                <div className="space-y-3">
                  <Label>Common Indian Medications:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonMedications.map((medication, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addMedication(medication)}
                        className="justify-start text-left h-auto py-2 px-3"
                        disabled={selectedMedications.includes(medication)}
                      >
                        <Pill className="w-3 h-3 mr-2" />
                        <span className="text-xs">{medication}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Medications */}
                {selectedMedications.length > 0 && (
                  <div className="space-y-3">
                    <Label>Selected Medications for Analysis:</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedications.map((medication, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="text-sm py-2 px-3 bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          💊 {medication}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-4 w-4 p-0 hover:bg-blue-300"
                            onClick={() => removeMedication(medication)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analysis Progress */}
                {analysisProgress > 0 && analysisProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <Bot className="w-4 h-4 mr-2 text-blue-600" />
                        AI Analysis in Progress
                      </span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="text-xs text-gray-500 text-center">
                      Analyzing interactions, pricing, and safety...
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Analysis Sidebar */}
        <div className="space-y-6">
          {/* Safety Alerts */}
          {safetyAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Safety Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {safetyAlerts.map((alert, index) => (
                  <Alert key={index} className={`${getSeverityColor(alert.severity)}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold text-sm">{alert.message}</div>
                      <div className="text-xs mt-1">{alert.action}</div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Drug Interactions */}
          {drugInteractions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Drug Interactions
                  {isLoadingInteractions && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {drugInteractions.map((interaction, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {interaction.drug1} + {interaction.drug2}
                      </div>
                      <Badge className={getSeverityColor(interaction.severity)}>{interaction.severity}</Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>
                        <strong>Effect:</strong> {interaction.clinicalEffect}
                      </div>
                      <div>
                        <strong>Management:</strong> {interaction.management}
                      </div>
                    </div>
                    {interaction.alternatives.length > 0 && (
                      <div className="text-xs text-blue-600">
                        <strong>Alternatives:</strong> {interaction.alternatives.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Price Comparison Summary */}
          {priceComparison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Cost Analysis
                  {isLoadingPrices && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {priceComparison.totalCostEstimate && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Branded Total:</span>
                      <span className="font-semibold">₹{priceComparison.totalCostEstimate.branded}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Generic Total:</span>
                      <span className="font-semibold text-green-600">₹{priceComparison.totalCostEstimate.generic}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <span className="text-sm font-semibold">Potential Savings:</span>
                      <span className="font-bold text-green-600">
                        <TrendingDown className="w-4 h-4 inline mr-1" />₹{priceComparison.totalCostEstimate.savings}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Nearby Pharmacies */}
          {priceComparison?.pharmacyAvailability && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Pharmacy Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {priceComparison.pharmacyAvailability.map((pharmacy: PharmacyInfo, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm">{pharmacy.pharmacy}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {pharmacy.distance}
                        {pharmacy.deliveryAvailable && (
                          <span className="ml-2 flex items-center">
                            <Truck className="w-3 h-3 mr-1" />
                            Delivery
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getAvailabilityIcon(pharmacy.availability)}
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                AI Features Active
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time interaction checking</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Indian market price analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Safety monitoring</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Generic alternatives</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Prescription requirements</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Analysis Results */}
      {medicationRecommendations.length > 0 && (
        <div className="space-y-8">
          <Separator />

          {/* AI Medication Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-6 h-6 mr-3 text-green-600" />
                AI Medication Recommendations
                <Badge className="ml-3 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Personalized for Indian Market
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {medicationRecommendations.map((recommendation, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{recommendation.genericName}</h3>
                      <p className="text-sm text-gray-600">For: {recommendation.condition}</p>
                      <Badge variant="outline" className="mt-1">
                        {recommendation.medicationType}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-600 font-medium">{recommendation.costSavings}</div>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <Alert className="border-blue-200 bg-blue-50">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>AI Analysis:</strong> {recommendation.aiReasoning}
                    </AlertDescription>
                  </Alert>

                  {/* Brand Options with Pricing */}
                  <div>
                    <h4 className="font-semibold mb-3">Available Options in India:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendation.brandOptions.map((option, optionIndex) => (
                        <div key={optionIndex} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{option.brandName}</div>
                            <div className="flex items-center space-x-1">
                              {getAvailabilityIcon(option.availability)}
                              {option.prescriptionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Rx
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{option.manufacturer}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">₹{option.price}</span>
                            <Button variant="outline" size="sm">
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dosage Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Dosage Instructions:</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <strong>Adult:</strong> {recommendation.dosageInstructions.adult}
                        </div>
                        {recommendation.dosageInstructions.elderly && (
                          <div>
                            <strong>Elderly:</strong> {recommendation.dosageInstructions.elderly}
                          </div>
                        )}
                        <div>
                          <strong>Timing:</strong> {recommendation.dosageInstructions.timing}
                        </div>
                        <div>
                          <strong>Duration:</strong> {recommendation.dosageInstructions.duration}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Important Information:</h4>
                      <div className="space-y-2">
                        {recommendation.warnings.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-orange-600">Warnings:</div>
                            <ul className="text-xs text-orange-700 space-y-1">
                              {recommendation.warnings.map((warning, wIndex) => (
                                <li key={wIndex}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {recommendation.contraindications.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-red-600">Contraindications:</div>
                            <ul className="text-xs text-red-700 space-y-1">
                              {recommendation.contraindications.map((contra, cIndex) => (
                                <li key={cIndex}>• {contra}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {recommendation.sideEffects.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-gray-600">Common Side Effects:</div>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {recommendation.sideEffects.map((effect, eIndex) => (
                                <li key={eIndex}>• {effect}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Drug Interactions */}
                  {recommendation.interactions.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <div className="font-semibold mb-1">Potential Interactions:</div>
                        <div className="text-sm">May interact with: {recommendation.interactions.join(", ")}</div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Detailed Price Comparison */}
          {priceComparison?.priceComparison && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Detailed Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {priceComparison.priceComparison.map((comparison: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold">{comparison.genericName}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {comparison.options.map((option: PriceOption, optionIndex: number) => (
                        <div key={optionIndex} className="border rounded p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={option.type === "generic" ? "default" : "outline"}>{option.type}</Badge>
                            {getAvailabilityIcon(option.availability)}
                          </div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.manufacturer}</div>
                          <div className="text-xl font-bold text-green-600">₹{option.price}</div>
                        </div>
                      ))}
                    </div>

                    <Alert className="border-green-200 bg-green-50">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <div className="font-semibold">AI Recommendation: {comparison.recommendedOption}</div>
                        <div className="text-sm">{comparison.reasoning}</div>
                        <div className="text-sm font-medium">Save ₹{comparison.costSavings} with this choice</div>
                      </AlertDescription>
                    </Alert>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              Download Prescription
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Building className="w-4 h-4 mr-2" />
              Find Pharmacies
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Set Reminders
            </Button>
            <Button variant="outline" className="bg-transparent">
              <Stethoscope className="w-4 h-4 mr-2" />
              Consult Doctor
            </Button>
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-600" />
            Important Medical Disclaimer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2 text-sm">
                <div>
                  • This AI analysis is for informational purposes only and should not replace professional medical
                  advice
                </div>
                <div>
                  • Always consult qualified healthcare professionals before starting, stopping, or changing medications
                </div>
                <div>• Drug interactions and contraindications may vary based on individual health conditions</div>
                <div>• Prices are estimates and may vary by location and pharmacy</div>
                <div>• In case of emergency or severe side effects, seek immediate medical attention</div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
