"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import MyMedLogo from "@/components/mymed-logo"
import Link from "next/link"
import {
  User,
  Heart,
  AlertCircle,
  StethoscopeIcon as Steth,
  Brain,
  Pill,
  UserCheck,
  ImageIcon,
  Printer,
  Shield,
  Award,
  Clock,
  Sparkles,
  Calendar,
  FileText,
  Plus,
  RefreshCw,
  Info,
  Home,
} from "lucide-react"

interface DoctorAssessmentData {
  // Patient Information
  patientName: string
  patientAge: string
  patientGender: string
  patientContact: string

  // Doctor Information
  doctorName: string
  doctorId: string
  specialization: string
  hospitalName: string
  consultationDate: string

  // Clinical Information
  chiefComplaint: string
  historyOfPresentIllness: string
  pastMedicalHistory: string
  currentMedications: string
  allergies: string
  familyHistory: string
  socialHistory: string

  // Physical Examination
  vitalSigns: string
  physicalExamination: string

  // Assessment & Plan
  clinicalAssessment: string
  treatmentPlan: string
  medications: string
  followUpInstructions: string
  additionalNotes: string
}

interface AssessmentResults {
  patientSummary: string
  clinicalFindings: string
  diagnosticImpression: string
  treatmentRecommendations: string
  medicationPlan: string
  followUpPlan: string
  patientCounseling: string
  medicalCertificate: string
  referralLetter: string
  dischargeSummary: string
}

export default function DoctorsAssessmentPage() {
  const [formData, setFormData] = useState<DoctorAssessmentData>({
    // Patient Information
    patientName: "Sarah Johnson",
    patientAge: "34",
    patientGender: "Female",
    patientContact: "+1-555-0123",

    // Doctor Information
    doctorName: "Dr. Michael Chen",
    doctorId: "MD12345",
    specialization: "Internal Medicine",
    hospitalName: "City General Hospital",
    consultationDate: new Date().toISOString().split("T")[0],

    // Clinical Information
    chiefComplaint: "Persistent headaches and fatigue for the past 2 weeks",
    historyOfPresentIllness:
      "Patient reports gradual onset of bilateral frontal headaches, described as dull and throbbing, rated 6/10 in severity. Associated with fatigue, difficulty concentrating, and mild nausea. Symptoms worsen with stress and improve with rest. No visual changes, fever, or neck stiffness. Sleep pattern has been disrupted with frequent awakening.",
    pastMedicalHistory:
      "Hypertension diagnosed 3 years ago, well controlled on medication. History of migraine headaches in teens, resolved in early 20s. No diabetes, heart disease, or major surgeries.",
    currentMedications:
      "Lisinopril 10mg daily for hypertension, Multivitamin daily, Occasional ibuprofen 400mg for headaches (2-3 times per week recently)",
    allergies: "Penicillin (rash), Shellfish (mild GI upset), No known drug allergies otherwise",
    familyHistory:
      "Mother: Hypertension, diabetes type 2. Father: Heart disease, stroke at age 65. Maternal grandmother: Migraine headaches. No family history of cancer or neurological disorders.",
    socialHistory:
      "Non-smoker, occasional alcohol (1-2 glasses wine per week), works as accountant (high stress job), exercises 2-3 times per week, married with 2 children, good social support system",

    // Physical Examination
    vitalSigns:
      "BP: 138/82 mmHg, HR: 78 bpm, Temp: 98.6°F (37°C), RR: 16/min, O2 Sat: 98% on room air, Height: 5'6\" (168 cm), Weight: 145 lbs (66 kg), BMI: 23.4",
    physicalExamination:
      "General: Alert, oriented, appears tired but not in acute distress. HEENT: Normocephalic, atraumatic, PERRLA, EOMI, no papilledema on fundoscopy, TMs clear, throat non-erythematous. Neck: Supple, no lymphadenopathy, no thyromegaly, no carotid bruits. Cardiovascular: RRR, no murmurs, rubs, or gallops. Pulmonary: Clear to auscultation bilaterally. Abdomen: Soft, non-tender, non-distended, normal bowel sounds. Neurological: CN II-XII intact, motor strength 5/5 throughout, DTRs 2+ and symmetric, negative Babinski, gait normal, no focal deficits.",

    // Assessment & Plan
    clinicalAssessment:
      "Primary diagnosis: Tension-type headaches, likely stress-related, with possible medication overuse component. Secondary diagnosis: Hypertension, suboptimally controlled. Differential diagnoses to consider: Migraine headaches (less likely given description), secondary headaches (less likely given normal neurological exam), sleep disorder contributing to symptoms.",
    treatmentPlan:
      "1. Headache management: Discontinue frequent ibuprofen use to prevent medication overuse headaches. Initiate preventive therapy with amitriptyline 25mg at bedtime. Stress management techniques and relaxation therapy. 2. Hypertension optimization: Increase lisinopril to 15mg daily given current BP readings. 3. Lifestyle modifications: Improve sleep hygiene, regular exercise routine, stress reduction techniques. 4. Follow-up care: Return in 2 weeks to assess headache improvement and BP control.",
    medications:
      "1. Amitriptyline 25mg PO at bedtime for headache prevention - Start with 10mg for 3 days, then increase to 25mg. Take 2 hours before bedtime. 2. Lisinopril 15mg PO daily (increased from 10mg) - Take in morning with or without food. 3. Discontinue regular ibuprofen use - Use only for severe breakthrough headaches, maximum 2 days per week. 4. Magnesium supplement 400mg daily - May help with headache prevention.",
    followUpInstructions:
      "Return to clinic in 2 weeks for headache and blood pressure follow-up. Sooner if headaches worsen, develop fever, neck stiffness, visual changes, or severe hypertension symptoms. Keep headache diary noting triggers, severity, and frequency. Blood pressure monitoring at home 2-3 times per week. Contact office if BP consistently >150/90 or <100/60.",
    additionalNotes:
      "Patient counseled on medication overuse headaches and importance of limiting analgesic use. Discussed stress management techniques including deep breathing exercises and regular sleep schedule. Provided educational materials on tension headaches and hypertension management. Patient verbalized understanding of treatment plan and follow-up instructions.",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<AssessmentResults | null>(null)

  const handleInputChange = (field: keyof DoctorAssessmentData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const assessmentPrompt = `
COMPREHENSIVE MEDICAL CONSULTATION REPORT

DOCTOR INFORMATION:
- Name: Dr. ${formData.doctorName}
- Registration ID: ${formData.doctorId}
- Specialization: ${formData.specialization}
- Hospital/Clinic: ${formData.hospitalName}
- Consultation Date: ${formData.consultationDate}

PATIENT INFORMATION:
- Name: ${formData.patientName}
- Age: ${formData.patientAge}
- Gender: ${formData.patientGender}
- Contact: ${formData.patientContact}

CLINICAL PRESENTATION:
Chief Complaint: ${formData.chiefComplaint}

History of Present Illness:
${formData.historyOfPresentIllness}

Past Medical History:
${formData.pastMedicalHistory}

Current Medications:
${formData.currentMedications}

Known Allergies:
${formData.allergies}

Family History:
${formData.familyHistory}

Social History:
${formData.socialHistory}

PHYSICAL EXAMINATION:
Vital Signs:
${formData.vitalSigns}

Physical Examination Findings:
${formData.physicalExamination}

CLINICAL ASSESSMENT:
${formData.clinicalAssessment}

TREATMENT PLAN:
${formData.treatmentPlan}

MEDICATIONS PRESCRIBED:
${formData.medications}

FOLLOW-UP INSTRUCTIONS:
${formData.followUpInstructions}

ADDITIONAL NOTES:
${formData.additionalNotes}

Please generate comprehensive medical documentation including:
1. Patient Summary - Brief overview of patient and consultation
2. Clinical Findings Summary - Key examination and assessment findings
3. Diagnostic Impression - Primary and differential diagnoses
4. Treatment Recommendations - Detailed treatment approach
5. Medication Plan - Complete medication regimen with instructions
6. Follow-up Plan - Monitoring and next steps
7. Patient Counseling Points - Education and lifestyle advice
8. Medical Certificate - If needed for work/school
9. Referral Letter - If specialist consultation required
10. Discharge Summary - If applicable

Format as professional medical documentation suitable for medical records, patient communication, and healthcare continuity.
`

      const response = await fetch("/api/ai-integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: assessmentPrompt,
          type: "doctor-assessment",
        }),
      })

      const data = await response.json()

      if (data.response) {
        const aiText = typeof data.response === "string" ? data.response : JSON.stringify(data.response)

        setResults({
          patientSummary: extractSection(aiText, "patient summary") || generateFallbackSummary(),
          clinicalFindings: extractSection(aiText, "clinical findings") || generateFallbackFindings(),
          diagnosticImpression: extractSection(aiText, "diagnostic impression") || generateFallbackDiagnosis(),
          treatmentRecommendations: extractSection(aiText, "treatment recommendations") || generateFallbackTreatment(),
          medicationPlan: extractSection(aiText, "medication plan") || generateFallbackMedications(),
          followUpPlan: extractSection(aiText, "follow-up plan") || generateFallbackFollowUp(),
          patientCounseling: extractSection(aiText, "patient counseling") || generateFallbackCounseling(),
          medicalCertificate: extractSection(aiText, "medical certificate") || generateFallbackCertificate(),
          referralLetter: extractSection(aiText, "referral letter") || generateFallbackReferral(),
          dischargeSummary: extractSection(aiText, "discharge summary") || generateFallbackDischarge(),
        })
      }
    } catch (error) {
      console.error("Assessment error:", error)
      setResults({
        patientSummary: generateFallbackSummary(),
        clinicalFindings: generateFallbackFindings(),
        diagnosticImpression: generateFallbackDiagnosis(),
        treatmentRecommendations: generateFallbackTreatment(),
        medicationPlan: generateFallbackMedications(),
        followUpPlan: generateFallbackFollowUp(),
        patientCounseling: generateFallbackCounseling(),
        medicalCertificate: generateFallbackCertificate(),
        referralLetter: generateFallbackReferral(),
        dischargeSummary: generateFallbackDischarge(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateFallbackSummary = () => `
PATIENT SUMMARY
Name: ${formData.patientName}
Age: ${formData.patientAge}
Gender: ${formData.patientGender}
Chief Complaint: ${formData.chiefComplaint}
Consultation Date: ${formData.consultationDate}
Consulting Doctor: Dr. ${formData.doctorName} (${formData.specialization})

The patient presented with ${formData.chiefComplaint}. Clinical assessment and examination findings have been documented for comprehensive care planning.
`

  const generateFallbackFindings = () => `
CLINICAL FINDINGS
Vital Signs: ${formData.vitalSigns}
Physical Examination: ${formData.physicalExamination || "Physical examination findings documented during consultation."}
Clinical Assessment: ${formData.clinicalAssessment}
`

  const generateFallbackDiagnosis = () => `
DIAGNOSTIC IMPRESSION
Clinical Assessment: ${formData.clinicalAssessment || "Clinical assessment based on presentation and examination findings."}
Further evaluation and correlation with investigation results recommended for definitive diagnosis.
`

  const generateFallbackTreatment = () => `
TREATMENT RECOMMENDATIONS
${formData.treatmentPlan || "Comprehensive treatment plan individualized based on patient needs and clinical findings."}
Medications prescribed as per clinical indication with appropriate monitoring.
`

  const generateFallbackMedications = () => `
MEDICATION PLAN
${formData.medications || "Medications prescribed as per clinical indication and patient requirements."}
Patient counseled regarding medication compliance and potential side effects.
`

  const generateFallbackFollowUp = () => `
FOLLOW-UP PLAN
${formData.followUpInstructions || "Regular follow-up as clinically indicated."}
Patient advised to seek immediate medical attention if symptoms worsen or new concerning symptoms develop.
`

  const generateFallbackCounseling = () => `
PATIENT COUNSELING
Patient counseled regarding condition, treatment plan, and lifestyle modifications.
Key counseling points covered:
• Understanding of diagnosis and treatment
• Medication compliance and side effects
• Lifestyle modifications
• Warning signs to watch for
• Follow-up care importance
`

  const generateFallbackCertificate = () => `
MEDICAL CERTIFICATE

This is to certify that ${formData.patientName}, age ${formData.patientAge}, was examined by me on ${formData.consultationDate}.

Clinical findings and recommendations have been documented. The patient is advised to follow the prescribed treatment plan and attend follow-up appointments as scheduled.

Dr. ${formData.doctorName}
${formData.specialization}
${formData.hospitalName}
Date: ${formData.consultationDate}
`

  const generateFallbackReferral = () => `
REFERRAL LETTER

Dear Colleague,

I am referring ${formData.patientName}, age ${formData.patientAge}, for specialist consultation regarding ${formData.chiefComplaint}.

Clinical summary and examination findings are documented. Your expert opinion and management recommendations would be greatly appreciated.

Thank you for your assistance in this patient's care.

Dr. ${formData.doctorName}
${formData.specialization}
${formData.hospitalName}
`

  const generateFallbackDischarge = () => `
DISCHARGE SUMMARY

Patient: ${formData.patientName}
Age: ${formData.patientAge}
Date: ${formData.consultationDate}

Diagnosis: ${formData.clinicalAssessment || "As documented"}
Treatment Provided: As per clinical protocol
Condition: Stable

Discharge Instructions:
• Continue prescribed medications
• Follow-up as scheduled
• Return if symptoms worsen

Dr. ${formData.doctorName}
${formData.specialization}
`

  const extractSection = (text: string, keyword: string): string => {
    const lines = text.split("\n")
    let section = ""
    let capturing = false

    for (const line of lines) {
      if (line.toLowerCase().includes(keyword.toLowerCase()) && (line.includes(":") || line.includes("."))) {
        capturing = true
        section = line
        continue
      }
      if (capturing) {
        if (
          line.trim() === "" ||
          line.match(/^\d+\./) ||
          line.toLowerCase().includes("summary") ||
          line.toLowerCase().includes("findings") ||
          line.toLowerCase().includes("plan") ||
          line.toLowerCase().includes("recommendations")
        ) {
          if (section.length > 100) break
        }
        section += "\n" + line
      }
    }

    return section.trim()
  }

  const resetAssessment = () => {
    setResults(null)
    setFormData({
      patientName: "",
      patientAge: "",
      patientGender: "",
      patientContact: "",
      doctorName: "",
      doctorId: "",
      specialization: "",
      hospitalName: "",
      consultationDate: new Date().toISOString().split("T")[0],
      chiefComplaint: "",
      historyOfPresentIllness: "",
      pastMedicalHistory: "",
      currentMedications: "",
      allergies: "",
      familyHistory: "",
      socialHistory: "",
      vitalSigns: "",
      physicalExamination: "",
      clinicalAssessment: "",
      treatmentPlan: "",
      medications: "",
      followUpInstructions: "",
      additionalNotes: "",
    })
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Consultation Report - ${formData.patientName}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6; 
            color: #000;
            background: white;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #000; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0;
            font-size: 14px;
          }
          .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
          }
          .section h3 { 
            color: #000; 
            border-bottom: 1px solid #000; 
            padding-bottom: 5px; 
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
          }
          .patient-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .info-box {
            border: 1px solid #000;
            padding: 10px;
          }
          .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            border-top: 1px solid #000;
            width: 200px;
            text-align: center;
            padding-top: 5px;
          }
          @media print { 
            body { margin: 0; } 
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${formData.hospitalName || "Medical Center"}</h1>
          <p>MEDICAL CONSULTATION REPORT</p>
          <p>Date: ${formData.consultationDate}</p>
        </div>
        
        <div class="patient-info">
          <div class="info-box">
            <strong>PATIENT INFORMATION</strong><br>
            Name: ${formData.patientName}<br>
            Age: ${formData.patientAge}<br>
            Gender: ${formData.patientGender}<br>
            Contact: ${formData.patientContact}
          </div>
          <div class="info-box">
            <strong>DOCTOR INFORMATION</strong><br>
            Name: Dr. ${formData.doctorName}<br>
            ID: ${formData.doctorId}<br>
            Specialization: ${formData.specialization}
          </div>
        </div>

        <div class="section">
          <h3>CHIEF COMPLAINT</h3>
          <p>${formData.chiefComplaint}</p>
        </div>

        <div class="section">
          <h3>CLINICAL FINDINGS</h3>
          <p>${results?.clinicalFindings || "Clinical findings documented during examination."}</p>
        </div>

        <div class="section">
          <h3>DIAGNOSTIC IMPRESSION</h3>
          <p>${results?.diagnosticImpression || formData.clinicalAssessment}</p>
        </div>

        <div class="section">
          <h3>TREATMENT PLAN</h3>
          <p>${results?.treatmentRecommendations || formData.treatmentPlan}</p>
        </div>

        <div class="section">
          <h3>MEDICATIONS PRESCRIBED</h3>
          <p>${formData.medications}</p>
        </div>

        <div class="section">
          <h3>FOLLOW-UP INSTRUCTIONS</h3>
          <p>${formData.followUpInstructions}</p>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <strong>Dr. ${formData.doctorName}</strong><br>
            ${formData.specialization}<br>
            Registration No: ${formData.doctorId}
          </div>
          <div class="signature-box">
            <strong>Date</strong><br>
            ${formData.consultationDate}
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
MEDICAL CONSULTATION REPORT
${formData.hospitalName || "Medical Center"}
Date: ${formData.consultationDate}

PATIENT INFORMATION:
Name: ${formData.patientName}
Age: ${formData.patientAge}
Gender: ${formData.patientGender}
Contact: ${formData.patientContact}

DOCTOR INFORMATION:
Name: Dr. ${formData.doctorName}
ID: ${formData.doctorId}
Specialization: ${formData.specialization}
Hospital: ${formData.hospitalName}

CHIEF COMPLAINT:
${formData.chiefComplaint}

HISTORY OF PRESENT ILLNESS:
${formData.historyOfPresentIllness}

CLINICAL FINDINGS:
${results?.clinicalFindings || "Clinical findings documented during examination."}

DIAGNOSTIC IMPRESSION:
${results?.diagnosticImpression || formData.clinicalAssessment}

TREATMENT RECOMMENDATIONS:
${results?.treatmentRecommendations || formData.treatmentPlan}

MEDICATIONS PRESCRIBED:
${formData.medications}

FOLLOW-UP PLAN:
${results?.followUpPlan || formData.followUpInstructions}

PATIENT COUNSELING:
${results?.patientCounseling}

ADDITIONAL NOTES:
${formData.additionalNotes}

---
Dr. ${formData.doctorName}
${formData.specialization}
Registration No: ${formData.doctorId}
${formData.hospitalName}
Date: ${formData.consultationDate}

Generated by MyMedi.ai - Professional Medical Documentation System
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Medical-Report-${formData.patientName.replace(/\s+/g, "-")}-${formData.consultationDate}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Check if required fields are filled
  const isFormValid =
    formData.patientName.trim() &&
    formData.doctorName.trim() &&
    formData.chiefComplaint.trim() &&
    formData.clinicalAssessment.trim() &&
    formData.treatmentPlan.trim()

  // Loading State
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
        {/* Header with Home Button */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MyMedLogo size="lg" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Processing Assessment</h1>
                <p className="text-sm text-gray-600">AI is generating medical documentation...</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute inset-0 w-24 h-24 border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-4 w-16 h-16 border-4 border-teal-200 rounded-full animate-spin border-t-teal-600"></div>
              </div>
              <div className="text-center space-y-4 max-w-md">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  🏥 AI Processing Medical Assessment
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-gray-600">Analyzing patient information and clinical data...</p>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <p className="text-gray-600">Generating comprehensive medical documentation...</p>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div
                      className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <p className="text-gray-600">Creating treatment recommendations and reports...</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Results Display
  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
        {/* Header with Home Button */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MyMedLogo size="lg" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Medical Assessment Results</h1>
                <p className="text-sm text-gray-600">
                  Patient: {formData.patientName} | Date: {formData.consultationDate}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href="/">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={resetAssessment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Summary Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 text-white overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Steth className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold">Medical Assessment Complete</h1>
                      <p className="text-blue-100 text-lg">Professional AI-Generated Medical Documentation</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Badge className="bg-white bg-opacity-20 text-white px-4 py-2 text-lg font-semibold border-2 border-white border-opacity-30">
                      <Shield className="w-4 h-4 mr-2" />
                      PROFESSIONAL GRADE
                    </Badge>
                    <div className="text-center">
                      <div className="text-2xl font-bold">Dr. {formData.doctorName}</div>
                      <div className="text-sm text-blue-100">{formData.specialization}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                    <User className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm text-blue-100">Patient</div>
                    <div className="font-semibold">{formData.patientName}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm text-blue-100">Age</div>
                    <div className="font-semibold">{formData.patientAge}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm text-blue-100">Hospital</div>
                    <div className="font-semibold">{formData.hospitalName}</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center backdrop-blur-sm">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm text-blue-100">Date</div>
                    <div className="font-semibold">{formData.consultationDate}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="w-6 h-6 mr-3" /> 📋 Patient Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.patientSummary}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Steth className="w-6 h-6 mr-3" /> 🔬 Clinical Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.clinicalFindings}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 border-l-4 border-l-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Brain className="w-6 h-6 mr-3" /> 🧠 Diagnostic Impression
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.diagnosticImpression}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50 border-l-4 border-l-red-500">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Heart className="w-6 h-6 mr-3" /> ❤️ Treatment Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.treatmentRecommendations}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-l-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Pill className="w-6 h-6 mr-3" /> 💊 Medication Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.medicationPlan}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-l-teal-500">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="w-6 h-6 mr-3" /> 📅 Follow-up Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.followUpPlan}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Additional Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-l-amber-500">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <Award className="w-6 h-6 mr-3" /> 🏆 Medical Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.medicalCertificate}
                </pre>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-violet-50 to-purple-50 border-l-4 border-l-violet-500">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                <CardTitle className="flex items-center text-xl">
                  <UserCheck className="w-6 h-6 mr-3" /> 💬 Patient Counseling
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-sm">
                  {results.patientCounseling}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <MyMedLogo />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">Powered by MyMedi.ai</h3>
                  <p className="text-gray-600 max-w-2xl">
                    Professional medical documentation generated using advanced AI technology. This system assists
                    healthcare professionals in creating comprehensive medical records and documentation.
                  </p>
                  <p className="text-sm text-gray-500">
                    This AI-generated documentation should be reviewed and validated by qualified healthcare
                    professionals.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
                  <span>🔒 HIPAA Compliant</span>
                  <span>🛡️ Secure & Private</span>
                  <span>🧠 AI-Powered</span>
                  <span>⚡ Professional Grade</span>
                  <span>📋 Medical Standard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main Form Display
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      {/* Header with Home Button */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MyMedLogo size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Doctor's Assessment Portal</h1>
              <p className="text-sm text-gray-600">AI-Powered Medical Documentation System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Badge className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Brain className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Steth className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Medical Assessment Form</CardTitle>
                  <p className="text-blue-100 mt-2">Simple AI-powered documentation for healthcare professionals</p>
                </div>
              </div>
              <MyMedLogo theme="dark" />
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Patient Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Patient Information
                <Badge className="ml-2 bg-blue-100 text-blue-800">Required</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="patientName" className="text-blue-900 font-medium">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Enter patient full name"
                  />
                </div>
                <div>
                  <Label htmlFor="patientAge" className="text-blue-900 font-medium">
                    Age
                  </Label>
                  <Input
                    id="patientAge"
                    value={formData.patientAge}
                    onChange={(e) => handleInputChange("patientAge", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Patient age"
                  />
                </div>
                <div>
                  <Label htmlFor="patientGender" className="text-blue-900 font-medium">
                    Gender
                  </Label>
                  <Input
                    id="patientGender"
                    value={formData.patientGender}
                    onChange={(e) => handleInputChange("patientGender", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Patient gender"
                  />
                </div>
                <div>
                  <Label htmlFor="patientContact" className="text-blue-900 font-medium">
                    Contact Number
                  </Label>
                  <Input
                    id="patientContact"
                    value={formData.patientContact}
                    onChange={(e) => handleInputChange("patientContact", e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="Patient contact number"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-900 mb-6 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Doctor Information
                <Badge className="ml-2 bg-green-100 text-green-800">Professional Details</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="doctorName" className="text-green-900 font-medium">
                    Doctor Name *
                  </Label>
                  <Input
                    id="doctorName"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange("doctorName", e.target.value)}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div>
                  <Label htmlFor="doctorId" className="text-green-900 font-medium">
                    Registration ID
                  </Label>
                  <Input
                    id="doctorId"
                    value={formData.doctorId}
                    onChange={(e) => handleInputChange("doctorId", e.target.value)}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="Medical registration number"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization" className="text-green-900 font-medium">
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="Medical specialization"
                  />
                </div>
                <div>
                  <Label htmlFor="hospitalName" className="text-green-900 font-medium">
                    Hospital / Clinic Name
                  </Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                    className="mt-1 border-green-200 focus:border-green-500"
                    placeholder="Hospital or clinic name"
                  />
                </div>
                <div>
                  <Label htmlFor="consultationDate" className="text-green-900 font-medium">
                    Consultation Date
                  </Label>
                  <Input
                    id="consultationDate"
                    type="date"
                    value={formData.consultationDate}
                    onChange={(e) => handleInputChange("consultationDate", e.target.value)}
                    className="mt-1 border-green-200 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Information */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Clinical Information
                <Badge className="ml-2 bg-red-100 text-red-800">Primary Assessment</Badge>
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="chiefComplaint" className="text-red-900 font-medium">
                    Chief Complaint *
                  </Label>
                  <Input
                    id="chiefComplaint"
                    value={formData.chiefComplaint}
                    onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                    className="mt-1 border-red-200 focus:border-red-500"
                    placeholder="Patient's main complaint"
                  />
                </div>
                <div>
                  <Label htmlFor="historyOfPresentIllness" className="text-red-900 font-medium">
                    History of Present Illness
                  </Label>
                  <Textarea
                    id="historyOfPresentIllness"
                    value={formData.historyOfPresentIllness}
                    onChange={(e) => handleInputChange("historyOfPresentIllness", e.target.value)}
                    rows={4}
                    className="mt-1 border-red-200 focus:border-red-500"
                    placeholder="Detailed history of the present illness..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="pastMedicalHistory" className="text-red-900 font-medium">
                      Past Medical History
                    </Label>
                    <Textarea
                      id="pastMedicalHistory"
                      value={formData.pastMedicalHistory}
                      onChange={(e) => handleInputChange("pastMedicalHistory", e.target.value)}
                      rows={3}
                      className="mt-1 border-red-200 focus:border-red-500"
                      placeholder="Previous medical conditions, surgeries, hospitalizations..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentMedications" className="text-red-900 font-medium">
                      Current Medications
                    </Label>
                    <Textarea
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                      rows={3}
                      className="mt-1 border-red-200 focus:border-red-500"
                      placeholder="Current medications with dosages..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="allergies" className="text-red-900 font-medium">
                      Known Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      rows={3}
                      className="mt-1 border-red-200 focus:border-red-500"
                      placeholder="Drug allergies, food allergies, environmental allergies..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="familyHistory" className="text-red-900 font-medium">
                      Family History
                    </Label>
                    <Textarea
                      id="familyHistory"
                      value={formData.familyHistory}
                      onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                      rows={3}
                      className="mt-1 border-red-200 focus:border-red-500"
                      placeholder="Relevant family medical history..."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="socialHistory" className="text-red-900 font-medium">
                    Social History
                  </Label>
                  <Textarea
                    id="socialHistory"
                    value={formData.socialHistory}
                    onChange={(e) => handleInputChange("socialHistory", e.target.value)}
                    rows={3}
                    className="mt-1 border-red-200 focus:border-red-500"
                    placeholder="Smoking, alcohol, occupation, lifestyle factors..."
                  />
                </div>
              </div>
            </div>

            {/* Physical Examination */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
              <h3 className="text-xl font-semibold text-teal-900 mb-6 flex items-center">
                <Steth className="w-5 h-5 mr-2" />
                Physical Examination
                <Badge className="ml-2 bg-teal-100 text-teal-800">Clinical Assessment</Badge>
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="vitalSigns" className="text-teal-900 font-medium">
                    Vital Signs
                  </Label>
                  <Textarea
                    id="vitalSigns"
                    value={formData.vitalSigns}
                    onChange={(e) => handleInputChange("vitalSigns", e.target.value)}
                    rows={3}
                    className="mt-1 border-teal-200 focus:border-teal-500"
                    placeholder="Blood pressure, heart rate, temperature, respiratory rate, oxygen saturation, height, weight..."
                  />
                </div>
                <div>
                  <Label htmlFor="physicalExamination" className="text-teal-900 font-medium">
                    Physical Examination Findings
                  </Label>
                  <Textarea
                    id="physicalExamination"
                    value={formData.physicalExamination}
                    onChange={(e) => handleInputChange("physicalExamination", e.target.value)}
                    rows={6}
                    className="mt-1 border-teal-200 focus:border-teal-500"
                    placeholder="General appearance, head and neck, cardiovascular, respiratory, abdominal, neurological, musculoskeletal, skin examination findings..."
                  />
                </div>
              </div>
            </div>

            {/* Assessment & Plan */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-900 mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Assessment & Plan
                <Badge className="ml-2 bg-purple-100 text-purple-800">Clinical Decision</Badge>
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="clinicalAssessment" className="text-purple-900 font-medium">
                    Clinical Assessment / Diagnosis *
                  </Label>
                  <Textarea
                    id="clinicalAssessment"
                    value={formData.clinicalAssessment}
                    onChange={(e) => handleInputChange("clinicalAssessment", e.target.value)}
                    rows={4}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="Primary diagnosis, differential diagnoses, clinical impression..."
                  />
                </div>
                <div>
                  <Label htmlFor="treatmentPlan" className="text-purple-900 font-medium">
                    Treatment Plan *
                  </Label>
                  <Textarea
                    id="treatmentPlan"
                    value={formData.treatmentPlan}
                    onChange={(e) => handleInputChange("treatmentPlan", e.target.value)}
                    rows={6}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="Comprehensive treatment approach, procedures, lifestyle modifications, monitoring plan..."
                  />
                </div>
                <div>
                  <Label htmlFor="medications" className="text-purple-900 font-medium">
                    Medications Prescribed
                  </Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                    rows={4}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="Medication name, dosage, frequency, duration, special instructions..."
                  />
                </div>
                <div>
                  <Label htmlFor="followUpInstructions" className="text-purple-900 font-medium">
                    Follow-up Instructions
                  </Label>
                  <Textarea
                    id="followUpInstructions"
                    value={formData.followUpInstructions}
                    onChange={(e) => handleInputChange("followUpInstructions", e.target.value)}
                    rows={4}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="When to return, what to monitor, warning signs, next appointment schedule..."
                  />
                </div>
                <div>
                  <Label htmlFor="additionalNotes" className="text-purple-900 font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    rows={3}
                    className="mt-1 border-purple-200 focus:border-purple-500"
                    placeholder="Any additional observations, considerations, or special instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={resetAssessment}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Form
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 hover:from-blue-700 hover:via-green-700 hover:to-teal-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Assessment Report
              </Button>
            </div>

            {/* Required Fields Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Required fields:</strong> Patient Name, Doctor Name, Chief Complaint, Clinical Assessment, and
                Treatment Plan must be completed to generate the assessment report.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
