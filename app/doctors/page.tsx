"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  UserCheck,
  Stethoscope,
  FileText,
  Download,
  Printer,
  Loader2,
  CheckCircle,
  Home,
  User,
  Activity,
  MessageSquare,
  Apple,
  Baby,
} from "lucide-react"
import Link from "next/link"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"

interface PatientInfo {
  name: string
  age: string
  gender: string
  weight: string
  height: string
  contactNumber: string
  emergencyContact: string
  bloodGroup: string
  allergies: string
  currentMedications: string
}

interface DoctorInfo {
  name: string
  specialization: string
  licenseNumber: string
  hospital: string
  consultationDate: string
  consultationType: string
}

interface ClinicalHistory {
  chiefComplaint: string
  historyOfPresentIllness: string
  pastMedicalHistory: string
  familyHistory: string
  socialHistory: string
  reviewOfSystems: string
}

interface PhysicalExamination {
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    temperature: string
    respiratoryRate: string
    oxygenSaturation: string
    weight: string
    height: string
    bmi: string
  }
  generalAppearance: string
  heent: string
  cardiovascular: string
  respiratory: string
  abdominal: string
  neurological: string
  musculoskeletal: string
  skin: string
}

interface AssessmentAndPlan {
  primaryDiagnosis: string
  differentialDiagnosis: string
  diagnosticTests: string
  treatmentPlan: string
  medications: string
  followUpInstructions: string
  patientEducation: string
  prognosis: string
}

interface MedicalAssessment {
  patientInfo: PatientInfo
  doctorInfo: DoctorInfo
  clinicalHistory: ClinicalHistory
  physicalExamination: PhysicalExamination
  assessmentAndPlan: AssessmentAndPlan
}

export default function DoctorsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<string>("")

  const [assessment, setAssessment] = useState<MedicalAssessment>({
    patientInfo: {
      name: "Rajesh Kumar",
      age: "45",
      gender: "Male",
      weight: "75",
      height: "170",
      contactNumber: "+91 9876543210",
      emergencyContact: "+91 9876543211",
      bloodGroup: "B+",
      allergies: "Penicillin, Dust mites",
      currentMedications: "Metformin 500mg BD, Amlodipine 5mg OD",
    },
    doctorInfo: {
      name: "Dr. Priya Sharma",
      specialization: "Internal Medicine",
      licenseNumber: "MCI-12345",
      hospital: "Apollo Hospital, Hyderabad",
      consultationDate: "2024-01-15",
      consultationType: "Follow-up",
    },
    clinicalHistory: {
      chiefComplaint: "Chest pain and shortness of breath for 2 days",
      historyOfPresentIllness:
        "Patient presents with substernal chest pain, non-radiating, associated with mild shortness of breath on exertion. Pain is described as pressure-like, 6/10 intensity. No associated nausea, vomiting, or diaphoresis. Symptoms started 2 days ago after climbing stairs.",
      pastMedicalHistory: "Type 2 Diabetes Mellitus (5 years), Hypertension (3 years), No previous hospitalizations",
      familyHistory: "Father - CAD, Mother - Diabetes, No family history of sudden cardiac death",
      socialHistory: "Non-smoker, occasional alcohol use, sedentary lifestyle, works as software engineer",
      reviewOfSystems: "No fever, no weight loss, no palpitations, no syncope, no leg swelling",
    },
    physicalExamination: {
      vitalSigns: {
        bloodPressure: "140/90",
        heartRate: "88",
        temperature: "98.6",
        respiratoryRate: "18",
        oxygenSaturation: "97",
        weight: "75",
        height: "170",
        bmi: "26.0",
      },
      generalAppearance: "Alert, oriented, appears comfortable at rest, mild anxiety noted",
      heent: "Normocephalic, atraumatic, PERRLA, no JVD, no lymphadenopathy",
      cardiovascular: "Regular rate and rhythm, S1 S2 normal, no murmurs, rubs, or gallops",
      respiratory: "Clear to auscultation bilaterally, no wheezes, rales, or rhonchi",
      abdominal: "Soft, non-tender, non-distended, bowel sounds present",
      neurological: "Alert and oriented x3, cranial nerves II-XII intact, motor strength 5/5",
      musculoskeletal: "No joint swelling or deformity, full range of motion",
      skin: "Warm, dry, no rashes or lesions",
    },
    assessmentAndPlan: {
      primaryDiagnosis: "Atypical chest pain, rule out acute coronary syndrome",
      differentialDiagnosis: "1. Unstable angina 2. GERD 3. Musculoskeletal pain 4. Anxiety",
      diagnosticTests: "ECG, Troponin I, CBC, CMP, Lipid panel, Chest X-ray, Stress test if indicated",
      treatmentPlan: "1. Cardiac monitoring 2. Serial troponins 3. Aspirin 81mg daily 4. Continue current medications",
      medications:
        "1. Aspirin 81mg PO daily 2. Continue Metformin 500mg BD 3. Continue Amlodipine 5mg OD 4. Sublingual nitroglycerin PRN chest pain",
      followUpInstructions:
        "Return to ED if chest pain worsens or associated with SOB, nausea, or diaphoresis. Follow up with cardiology in 1 week. Follow up with PCP in 2 weeks.",
      patientEducation:
        "Discussed signs and symptoms of heart attack, importance of medication compliance, lifestyle modifications including diet and exercise",
      prognosis: "Good with appropriate follow-up and lifestyle modifications",
    },
  })

  const totalSteps = 5

  const updatePatientInfo = (field: keyof PatientInfo, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      patientInfo: { ...prev.patientInfo, [field]: value },
    }))
  }

  const updateDoctorInfo = (field: keyof DoctorInfo, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      doctorInfo: { ...prev.doctorInfo, [field]: value },
    }))
  }

  const updateClinicalHistory = (field: keyof ClinicalHistory, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      clinicalHistory: { ...prev.clinicalHistory, [field]: value },
    }))
  }

  const updatePhysicalExamination = (field: keyof PhysicalExamination, value: string) => {
    if (field === "vitalSigns") return
    setAssessment((prev) => ({
      ...prev,
      physicalExamination: { ...prev.physicalExamination, [field]: value },
    }))
  }

  const updateVitalSigns = (field: keyof PhysicalExamination["vitalSigns"], value: string) => {
    setAssessment((prev) => ({
      ...prev,
      physicalExamination: {
        ...prev.physicalExamination,
        vitalSigns: { ...prev.physicalExamination.vitalSigns, [field]: value },
      },
    }))
  }

  const updateAssessmentAndPlan = (field: keyof AssessmentAndPlan, value: string) => {
    setAssessment((prev) => ({
      ...prev,
      assessmentAndPlan: { ...prev.assessmentAndPlan, [field]: value },
    }))
  }

  const generateMedicalReport = async () => {
    setIsGenerating(true)

    try {
      const medicalPrompt = `
Generate a comprehensive medical assessment report based on the following patient information:

PATIENT INFORMATION:
Name: ${assessment.patientInfo.name}
Age: ${assessment.patientInfo.age}
Gender: ${assessment.patientInfo.gender}
Weight: ${assessment.patientInfo.weight}kg
Height: ${assessment.patientInfo.height}cm
Contact: ${assessment.patientInfo.contactNumber}
Blood Group: ${assessment.patientInfo.bloodGroup}
Allergies: ${assessment.patientInfo.allergies}
Current Medications: ${assessment.patientInfo.currentMedications}

DOCTOR INFORMATION:
Doctor: ${assessment.doctorInfo.name}
Specialization: ${assessment.doctorInfo.specialization}
License: ${assessment.doctorInfo.licenseNumber}
Hospital: ${assessment.doctorInfo.hospital}
Date: ${assessment.doctorInfo.consultationDate}
Type: ${assessment.doctorInfo.consultationType}

CLINICAL HISTORY:
Chief Complaint: ${assessment.clinicalHistory.chiefComplaint}
History of Present Illness: ${assessment.clinicalHistory.historyOfPresentIllness}
Past Medical History: ${assessment.clinicalHistory.pastMedicalHistory}
Family History: ${assessment.clinicalHistory.familyHistory}
Social History: ${assessment.clinicalHistory.socialHistory}
Review of Systems: ${assessment.clinicalHistory.reviewOfSystems}

PHYSICAL EXAMINATION:
Vital Signs: BP ${assessment.physicalExamination.vitalSigns.bloodPressure}, HR ${assessment.physicalExamination.vitalSigns.heartRate}, Temp ${assessment.physicalExamination.vitalSigns.temperature}°F, RR ${assessment.physicalExamination.vitalSigns.respiratoryRate}, O2 Sat ${assessment.physicalExamination.vitalSigns.oxygenSaturation}%
General Appearance: ${assessment.physicalExamination.generalAppearance}
HEENT: ${assessment.physicalExamination.heent}
Cardiovascular: ${assessment.physicalExamination.cardiovascular}
Respiratory: ${assessment.physicalExamination.respiratory}
Abdominal: ${assessment.physicalExamination.abdominal}
Neurological: ${assessment.physicalExamination.neurological}
Musculoskeletal: ${assessment.physicalExamination.musculoskeletal}
Skin: ${assessment.physicalExamination.skin}

ASSESSMENT AND PLAN:
Primary Diagnosis: ${assessment.assessmentAndPlan.primaryDiagnosis}
Differential Diagnosis: ${assessment.assessmentAndPlan.differentialDiagnosis}
Diagnostic Tests: ${assessment.assessmentAndPlan.diagnosticTests}
Treatment Plan: ${assessment.assessmentAndPlan.treatmentPlan}
Medications: ${assessment.assessmentAndPlan.medications}
Follow-up: ${assessment.assessmentAndPlan.followUpInstructions}
Patient Education: ${assessment.assessmentAndPlan.patientEducation}
Prognosis: ${assessment.assessmentAndPlan.prognosis}

Please generate a professional medical report with proper formatting, clinical reasoning, and recommendations. Include sections for:
1. Patient Demographics
2. Clinical Summary
3. Assessment
4. Treatment Plan
5. Follow-up Instructions
6. Medical Certificate (if applicable)
7. Prescription Details
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: medicalPrompt,
          type: "medical_assessment",
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      if (data.response && typeof data.response === "string") {
        setGeneratedReport(data.response)
      } else {
        throw new Error("No response from AI")
      }
    } catch (error) {
      console.error("Error generating report:", error)
      setGeneratedReport(`
MEDICAL ASSESSMENT REPORT

Patient: ${assessment.patientInfo.name}
Date: ${assessment.doctorInfo.consultationDate}
Doctor: ${assessment.doctorInfo.name}
Specialization: ${assessment.doctorInfo.specialization}

CLINICAL SUMMARY:
${assessment.clinicalHistory.chiefComplaint}

ASSESSMENT:
${assessment.assessmentAndPlan.primaryDiagnosis}

TREATMENT PLAN:
${assessment.assessmentAndPlan.treatmentPlan}

MEDICATIONS:
${assessment.assessmentAndPlan.medications}

FOLLOW-UP:
${assessment.assessmentAndPlan.followUpInstructions}

This report has been generated using AI assistance and should be reviewed by a qualified healthcare professional.
      `)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedReport], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `medical_report_${assessment.patientInfo.name.replace(/\s+/g, "_")}_${assessment.doctorInfo.consultationDate}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setGeneratedReport("")
    // Reset to empty form
    setAssessment({
      patientInfo: {
        name: "",
        age: "",
        gender: "",
        weight: "",
        height: "",
        contactNumber: "",
        emergencyContact: "",
        bloodGroup: "",
        allergies: "",
        currentMedications: "",
      },
      doctorInfo: {
        name: "",
        specialization: "",
        licenseNumber: "",
        hospital: "",
        consultationDate: "",
        consultationType: "",
      },
      clinicalHistory: {
        chiefComplaint: "",
        historyOfPresentIllness: "",
        pastMedicalHistory: "",
        familyHistory: "",
        socialHistory: "",
        reviewOfSystems: "",
      },
      physicalExamination: {
        vitalSigns: {
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          respiratoryRate: "",
          oxygenSaturation: "",
          weight: "",
          height: "",
          bmi: "",
        },
        generalAppearance: "",
        heent: "",
        cardiovascular: "",
        respiratory: "",
        abdominal: "",
        neurological: "",
        musculoskeletal: "",
        skin: "",
      },
      assessmentAndPlan: {
        primaryDiagnosis: "",
        differentialDiagnosis: "",
        diagnosticTests: "",
        treatmentPlan: "",
        medications: "",
        followUpInstructions: "",
        patientEducation: "",
        prognosis: "",
      },
    })
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="flex items-center bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Badge className="bg-green-100 text-green-800">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                AI Processing
              </Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-4">Generating Medical Report</h2>
              <p className="text-green-700 text-center mb-6 max-w-md">
                Our advanced AI is analyzing the patient information and generating a comprehensive medical assessment
                report...
              </p>
              <div className="w-full max-w-xs bg-green-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
              </div>
              <p className="text-sm text-green-600 mt-2">Processing clinical data...</p>
            </CardContent>
          </Card>
        </div>
        <PoweredByFooter />
      </div>
    )
  }

  if (generatedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm print:hidden">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <MyMedLogo size="lg" />
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="flex items-center bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700 text-white">
                New Assessment
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center border-b">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-900">Medical Assessment Report</CardTitle>
                  <p className="text-green-700">Generated by AI-Powered Medical Assistant</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                  {generatedReport}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="print:hidden">
          <PoweredByFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-4">
            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/assessment">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  <User className="w-3 h-3 mr-1" />
                  Assessment
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  AI Chat
                </Button>
              </Link>
              <Link href="/vitals">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  Vitals
                </Button>
              </Link>
              <Link href="/diet">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                >
                  <Apple className="w-3 h-3 mr-1" />
                  Diet
                </Button>
              </Link>
              <Link href="/pregnancy">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent"
                >
                  <Baby className="w-3 h-3 mr-1" />
                  Pregnancy
                </Button>
              </Link>
            </nav>

            <Link href="/">
              <Button variant="outline" className="flex items-center bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Badge className="bg-green-100 text-green-800">
              <UserCheck className="w-3 h-3 mr-1" />
              Professional Portal
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Stethoscope className="w-3 h-3 mr-1" />
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <UserCheck className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-green-900">👨‍⚕️ Professional Medical Assessment</CardTitle>
                  <p className="text-green-700 mt-2">Comprehensive Patient Evaluation & Documentation System</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-green-100 rounded-full h-2 mt-6">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Step {currentStep} of {totalSteps}
              </p>
            </CardHeader>
          </Card>

          {/* Step 1: Patient Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Full Name *</Label>
                    <Input
                      id="patientName"
                      value={assessment.patientInfo.name}
                      onChange={(e) => updatePatientInfo("name", e.target.value)}
                      placeholder="Enter patient's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={assessment.patientInfo.age}
                      onChange={(e) => updatePatientInfo("age", e.target.value)}
                      placeholder="Age in years"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={assessment.patientInfo.gender}
                      onValueChange={(value) => updatePatientInfo("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={assessment.patientInfo.weight}
                      onChange={(e) => updatePatientInfo("weight", e.target.value)}
                      placeholder="Weight in kg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={assessment.patientInfo.height}
                      onChange={(e) => updatePatientInfo("height", e.target.value)}
                      placeholder="Height in cm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      value={assessment.patientInfo.contactNumber}
                      onChange={(e) => updatePatientInfo("contactNumber", e.target.value)}
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={assessment.patientInfo.emergencyContact}
                      onChange={(e) => updatePatientInfo("emergencyContact", e.target.value)}
                      placeholder="Emergency contact number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={assessment.patientInfo.bloodGroup}
                      onValueChange={(value) => updatePatientInfo("bloodGroup", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={assessment.patientInfo.allergies}
                    onChange={(e) => updatePatientInfo("allergies", e.target.value)}
                    placeholder="List any known allergies (medications, food, environmental)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="currentMeds">Current Medications</Label>
                  <Textarea
                    id="currentMeds"
                    value={assessment.patientInfo.currentMedications}
                    onChange={(e) => updatePatientInfo("currentMedications", e.target.value)}
                    placeholder="List current medications with dosages"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep(2)} className="bg-green-600 hover:bg-green-700">
                    Next: Doctor Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Doctor Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                  Doctor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctorName">Doctor Name *</Label>
                    <Input
                      id="doctorName"
                      value={assessment.doctorInfo.name}
                      onChange={(e) => updateDoctorInfo("name", e.target.value)}
                      placeholder="Dr. Full Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input
                      id="specialization"
                      value={assessment.doctorInfo.specialization}
                      onChange={(e) => updateDoctorInfo("specialization", e.target.value)}
                      placeholder="Medical specialization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="license">License Number *</Label>
                    <Input
                      id="license"
                      value={assessment.doctorInfo.licenseNumber}
                      onChange={(e) => updateDoctorInfo("licenseNumber", e.target.value)}
                      placeholder="Medical license number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hospital">Hospital/Clinic *</Label>
                    <Input
                      id="hospital"
                      value={assessment.doctorInfo.hospital}
                      onChange={(e) => updateDoctorInfo("hospital", e.target.value)}
                      placeholder="Hospital or clinic name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultationDate">Consultation Date *</Label>
                    <Input
                      id="consultationDate"
                      type="date"
                      value={assessment.doctorInfo.consultationDate}
                      onChange={(e) => updateDoctorInfo("consultationDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultationType">Consultation Type</Label>
                    <Select
                      value={assessment.doctorInfo.consultationType}
                      onValueChange={(value) => updateDoctorInfo("consultationType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Initial">Initial Consultation</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Routine">Routine Check-up</SelectItem>
                        <SelectItem value="Specialist">Specialist Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(1)} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(3)} className="bg-green-600 hover:bg-green-700">
                    Next: Clinical History
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Clinical History */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Clinical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                  <Textarea
                    id="chiefComplaint"
                    value={assessment.clinicalHistory.chiefComplaint}
                    onChange={(e) => updateClinicalHistory("chiefComplaint", e.target.value)}
                    placeholder="Patient's main complaint in their own words"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="hpi">History of Present Illness *</Label>
                  <Textarea
                    id="hpi"
                    value={assessment.clinicalHistory.historyOfPresentIllness}
                    onChange={(e) => updateClinicalHistory("historyOfPresentIllness", e.target.value)}
                    placeholder="Detailed description of current illness including onset, duration, character, location, radiation, timing, context, modifying factors, and associated symptoms"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="pmh">Past Medical History</Label>
                  <Textarea
                    id="pmh"
                    value={assessment.clinicalHistory.pastMedicalHistory}
                    onChange={(e) => updateClinicalHistory("pastMedicalHistory", e.target.value)}
                    placeholder="Previous illnesses, surgeries, hospitalizations, chronic conditions"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="familyHistory">Family History</Label>
                  <Textarea
                    id="familyHistory"
                    value={assessment.clinicalHistory.familyHistory}
                    onChange={(e) => updateClinicalHistory("familyHistory", e.target.value)}
                    placeholder="Relevant family medical history"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="socialHistory">Social History</Label>
                  <Textarea
                    id="socialHistory"
                    value={assessment.clinicalHistory.socialHistory}
                    onChange={(e) => updateClinicalHistory("socialHistory", e.target.value)}
                    placeholder="Smoking, alcohol, drugs, occupation, living situation"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="ros">Review of Systems</Label>
                  <Textarea
                    id="ros"
                    value={assessment.clinicalHistory.reviewOfSystems}
                    onChange={(e) => updateClinicalHistory("reviewOfSystems", e.target.value)}
                    placeholder="Systematic review of body systems"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(2)} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(4)} className="bg-green-600 hover:bg-green-700">
                    Next: Physical Examination
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Physical Examination */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-red-600" />
                  Physical Examination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bp">Blood Pressure</Label>
                      <Input
                        id="bp"
                        value={assessment.physicalExamination.vitalSigns.bloodPressure}
                        onChange={(e) => updateVitalSigns("bloodPressure", e.target.value)}
                        placeholder="120/80"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hr">Heart Rate</Label>
                      <Input
                        id="hr"
                        value={assessment.physicalExamination.vitalSigns.heartRate}
                        onChange={(e) => updateVitalSigns("heartRate", e.target.value)}
                        placeholder="72"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temp">Temperature (°F)</Label>
                      <Input
                        id="temp"
                        value={assessment.physicalExamination.vitalSigns.temperature}
                        onChange={(e) => updateVitalSigns("temperature", e.target.value)}
                        placeholder="98.6"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rr">Respiratory Rate</Label>
                      <Input
                        id="rr"
                        value={assessment.physicalExamination.vitalSigns.respiratoryRate}
                        onChange={(e) => updateVitalSigns("respiratoryRate", e.target.value)}
                        placeholder="16"
                      />
                    </div>
                    <div>
                      <Label htmlFor="o2sat">O2 Saturation (%)</Label>
                      <Input
                        id="o2sat"
                        value={assessment.physicalExamination.vitalSigns.oxygenSaturation}
                        onChange={(e) => updateVitalSigns("oxygenSaturation", e.target.value)}
                        placeholder="98"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examWeight">Weight (kg)</Label>
                      <Input
                        id="examWeight"
                        value={assessment.physicalExamination.vitalSigns.weight}
                        onChange={(e) => updateVitalSigns("weight", e.target.value)}
                        placeholder="70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examHeight">Height (cm)</Label>
                      <Input
                        id="examHeight"
                        value={assessment.physicalExamination.vitalSigns.height}
                        onChange={(e) => updateVitalSigns("height", e.target.value)}
                        placeholder="170"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bmi">BMI</Label>
                      <Input
                        id="bmi"
                        value={assessment.physicalExamination.vitalSigns.bmi}
                        onChange={(e) => updateVitalSigns("bmi", e.target.value)}
                        placeholder="24.2"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="generalAppearance">General Appearance</Label>
                    <Textarea
                      id="generalAppearance"
                      value={assessment.physicalExamination.generalAppearance}
                      onChange={(e) => updatePhysicalExamination("generalAppearance", e.target.value)}
                      placeholder="Overall appearance, distress level, mental status"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="heent">HEENT (Head, Eyes, Ears, Nose, Throat)</Label>
                    <Textarea
                      id="heent"
                      value={assessment.physicalExamination.heent}
                      onChange={(e) => updatePhysicalExamination("heent", e.target.value)}
                      placeholder="Head, eyes, ears, nose, throat examination findings"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardiovascular">Cardiovascular</Label>
                    <Textarea
                      id="cardiovascular"
                      value={assessment.physicalExamination.cardiovascular}
                      onChange={(e) => updatePhysicalExamination("cardiovascular", e.target.value)}
                      placeholder="Heart sounds, murmurs, rhythm, peripheral pulses"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="respiratory">Respiratory</Label>
                    <Textarea
                      id="respiratory"
                      value={assessment.physicalExamination.respiratory}
                      onChange={(e) => updatePhysicalExamination("respiratory", e.target.value)}
                      placeholder="Lung sounds, breathing pattern, chest wall"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="abdominal">Abdominal</Label>
                    <Textarea
                      id="abdominal"
                      value={assessment.physicalExamination.abdominal}
                      onChange={(e) => updatePhysicalExamination("abdominal", e.target.value)}
                      placeholder="Inspection, palpation, percussion, auscultation"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="neurological">Neurological</Label>
                    <Textarea
                      id="neurological"
                      value={assessment.physicalExamination.neurological}
                      onChange={(e) => updatePhysicalExamination("neurological", e.target.value)}
                      placeholder="Mental status, cranial nerves, motor, sensory, reflexes"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="musculoskeletal">Musculoskeletal</Label>
                    <Textarea
                      id="musculoskeletal"
                      value={assessment.physicalExamination.musculoskeletal}
                      onChange={(e) => updatePhysicalExamination("musculoskeletal", e.target.value)}
                      placeholder="Joint examination, range of motion, deformities"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="skin">Skin</Label>
                    <Textarea
                      id="skin"
                      value={assessment.physicalExamination.skin}
                      onChange={(e) => updatePhysicalExamination("skin", e.target.value)}
                      placeholder="Color, temperature, moisture, lesions"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(3)} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={() => setCurrentStep(5)} className="bg-green-600 hover:bg-green-700">
                    Next: Assessment & Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Assessment and Plan */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Assessment & Treatment Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="primaryDiagnosis">Primary Diagnosis *</Label>
                  <Textarea
                    id="primaryDiagnosis"
                    value={assessment.assessmentAndPlan.primaryDiagnosis}
                    onChange={(e) => updateAssessmentAndPlan("primaryDiagnosis", e.target.value)}
                    placeholder="Primary diagnosis with ICD-10 code if applicable"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="differentialDiagnosis">Differential Diagnosis</Label>
                  <Textarea
                    id="differentialDiagnosis"
                    value={assessment.assessmentAndPlan.differentialDiagnosis}
                    onChange={(e) => updateAssessmentAndPlan("differentialDiagnosis", e.target.value)}
                    placeholder="Alternative diagnoses to consider"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="diagnosticTests">Diagnostic Tests</Label>
                  <Textarea
                    id="diagnosticTests"
                    value={assessment.assessmentAndPlan.diagnosticTests}
                    onChange={(e) => updateAssessmentAndPlan("diagnosticTests", e.target.value)}
                    placeholder="Laboratory tests, imaging, procedures ordered"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="treatmentPlan">Treatment Plan *</Label>
                  <Textarea
                    id="treatmentPlan"
                    value={assessment.assessmentAndPlan.treatmentPlan}
                    onChange={(e) => updateAssessmentAndPlan("treatmentPlan", e.target.value)}
                    placeholder="Comprehensive treatment approach"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="medications">Medications</Label>
                  <Textarea
                    id="medications"
                    value={assessment.assessmentAndPlan.medications}
                    onChange={(e) => updateAssessmentAndPlan("medications", e.target.value)}
                    placeholder="Prescribed medications with dosages and instructions"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="followUp">Follow-up Instructions</Label>
                  <Textarea
                    id="followUp"
                    value={assessment.assessmentAndPlan.followUpInstructions}
                    onChange={(e) => updateAssessmentAndPlan("followUpInstructions", e.target.value)}
                    placeholder="When to return, warning signs, next appointments"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="patientEducation">Patient Education</Label>
                  <Textarea
                    id="patientEducation"
                    value={assessment.assessmentAndPlan.patientEducation}
                    onChange={(e) => updateAssessmentAndPlan("patientEducation", e.target.value)}
                    placeholder="Information provided to patient about condition and care"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="prognosis">Prognosis</Label>
                  <Textarea
                    id="prognosis"
                    value={assessment.assessmentAndPlan.prognosis}
                    onChange={(e) => updateAssessmentAndPlan("prognosis", e.target.value)}
                    placeholder="Expected outcome and recovery timeline"
                    rows={2}
                  />
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Review all information carefully before generating the AI-powered medical report. This will create
                    comprehensive documentation including clinical summary, treatment plans, and professional
                    certificates.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button onClick={() => setCurrentStep(4)} variant="outline">
                    Previous
                  </Button>
                  <Button onClick={generateMedicalReport} className="bg-green-600 hover:bg-green-700 text-white">
                    Generate AI Medical Report
                    <FileText className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
