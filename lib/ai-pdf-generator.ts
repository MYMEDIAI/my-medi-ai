import jsPDF from "jspdf"
import QRCode from "qrcode"

interface PatientData {
  personalInfo: {
    name: string
    age: number
    gender: string
    weight: number
    height: number
    phone?: string
    email?: string
  }
  symptoms: {
    primary: string
    secondary: string[]
    duration: string
    severity: number
    onset: string
  }
  medicalHistory: {
    conditions: string[]
    medications: string[]
    allergies: string[]
    familyHistory: string[]
  }
  lifestyle: {
    exercise: string
    diet: string
    sleep: string
    stress: number
  }
}

interface AIReportSections {
  executiveSummary: {
    content: string
    confidenceScore: number
    keyFindings: string[]
  }
  symptomAnalysis: {
    primaryDiagnosis: {
      condition: string
      confidence: number
      reasoning: string
    }
    differentialDiagnosis: Array<{
      condition: string
      confidence: number
      reasoning: string
    }>
    riskFactors: string[]
  }
  riskAssessment: {
    overallRisk: "Low" | "Moderate" | "High" | "Critical"
    riskScore: number
    specificRisks: Array<{
      category: string
      level: string
      description: string
    }>
  }
  medicationRecommendations: {
    primaryMedications: Array<{
      medication: string
      indianBrands: string[]
      dosage: string
      duration: string
      cost: string
      reasoning: string
    }>
    alternatives: Array<{
      medication: string
      reason: string
    }>
    interactions: string[]
    contraindications: string[]
  }
  lifestyleModifications: {
    diet: {
      recommendations: string[]
      indianFoods: string[]
      restrictions: string[]
    }
    exercise: {
      recommendations: string[]
    }
    lifestyle: {
      recommendations: string[]
    }
  }
  followUpPlan: {
    timeline: Array<{
      timeframe: string
      action: string
      priority: "High" | "Medium" | "Low"
    }>
    monitoring: string[]
    redFlags: string[]
  }
  emergencyProtocols: {
    warningSignsImmediate: string[]
    warningSignsUrgent: string[]
    emergencyContacts: string[]
    actionSteps: string[]
  }
}

export class AIMedicalReportGenerator {
  private doc: jsPDF
  private pageHeight: number
  private pageWidth: number
  private currentY: number
  private margin: number
  private reportId: string
  private qrCodeData: string

  constructor() {
    this.doc = new jsPDF()
    this.pageHeight = this.doc.internal.pageSize.height
    this.pageWidth = this.doc.internal.pageSize.width
    this.currentY = 20
    this.margin = 20
    this.reportId = `AI-RPT-${Date.now()}`
    this.qrCodeData = ""
  }

  async generateAIReport(patientData: PatientData, aiReport: AIReportSections, insights: string) {
    // Generate QR code data
    this.qrCodeData = JSON.stringify({
      reportId: this.reportId,
      patient: patientData.personalInfo.name,
      date: new Date().toISOString(),
      aiAnalysis: "MyMedi.AI Generated Report",
      url: `https://mymedi.ai/report/${this.reportId}`,
    })

    await this.addHeader(patientData)
    this.addExecutiveSummary(aiReport.executiveSummary)
    this.addSymptomAnalysis(aiReport.symptomAnalysis)
    this.addRiskAssessment(aiReport.riskAssessment)
    this.addMedicationRecommendations(aiReport.medicationRecommendations)
    this.addLifestyleModifications(aiReport.lifestyleModifications)
    this.addFollowUpPlan(aiReport.followUpPlan)
    this.addEmergencyProtocols(aiReport.emergencyProtocols)
    await this.addFooter()
  }

  private async addHeader(patientData: PatientData) {
    // Header background
    this.doc.setFillColor(59, 130, 246) // Blue
    this.doc.rect(0, 0, this.pageWidth, 50, "F")

    // MyMedi.AI Logo and Title
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(28)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("MyMedi.AI", this.margin, 25)

    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("AI-Powered Medical Assessment Report", this.margin, 35)

    // AI Badge
    this.doc.setFillColor(34, 197, 94) // Green
    this.doc.roundedRect(this.pageWidth - 80, 15, 60, 20, 3, 3, "F")
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("🤖 AI GENERATED", this.pageWidth - 75, 27)

    // Patient Information Box
    this.doc.setFillColor(248, 250, 252) // Light gray
    this.doc.rect(this.margin, 60, this.pageWidth - 2 * this.margin, 40, "F")
    this.doc.setDrawColor(226, 232, 240)
    this.doc.rect(this.margin, 60, this.pageWidth - 2 * this.margin, 40)

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(16)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("PATIENT INFORMATION", this.margin + 5, 75)

    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "normal")

    // Patient details in two columns
    const leftCol = this.margin + 5
    const rightCol = this.pageWidth / 2 + 10

    this.doc.text(`Name: ${patientData.personalInfo.name}`, leftCol, 85)
    this.doc.text(`Age: ${patientData.personalInfo.age} years`, leftCol, 92)

    this.doc.text(`Gender: ${patientData.personalInfo.gender}`, rightCol, 85)
    this.doc.text(`Weight: ${patientData.personalInfo.weight} kg`, rightCol, 92)

    // Report metadata
    const currentDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    this.doc.setFontSize(10)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`Report ID: ${this.reportId}`, this.margin, 110)
    this.doc.text(`Generated: ${currentDate}`, this.pageWidth - 100, 110)
    this.doc.text(`AI Model: GPT-4 Medical`, this.margin, 117)
    this.doc.text(`Language: English (India)`, this.pageWidth - 100, 117)

    this.currentY = 130
    this.addSeparator()
  }

  private addExecutiveSummary(summary: any) {
    this.addSectionHeader("🏥 EXECUTIVE SUMMARY", "AI-Generated Medical Overview")

    // Confidence Score Badge
    this.doc.setFillColor(59, 130, 246)
    this.doc.roundedRect(this.pageWidth - 100, this.currentY - 25, 80, 15, 2, 2, "F")
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(`AI Confidence: ${summary.confidenceScore}%`, this.pageWidth - 95, this.currentY - 17)

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(11)
    this.doc.setFont("helvetica", "normal")

    // Summary content
    const summaryLines = this.doc.splitTextToSize(summary.content, this.pageWidth - 2 * this.margin)
    summaryLines.forEach((line: string) => {
      this.checkPageBreak(10)
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += 6
    })

    this.currentY += 5

    // Key Findings
    this.doc.setFont("helvetica", "bold")
    this.doc.text("🔍 Key Findings:", this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFont("helvetica", "normal")
    summary.keyFindings.forEach((finding: string, index: number) => {
      this.checkPageBreak(8)
      this.doc.text(`${index + 1}. ${finding}`, this.margin + 5, this.currentY)
      this.currentY += 7
    })

    this.currentY += 10
    this.addSeparator()
  }

  private addSymptomAnalysis(analysis: any) {
    this.addSectionHeader("🔬 SYMPTOM ANALYSIS", "AI Diagnostic Assessment")

    // Primary Diagnosis
    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Primary Diagnosis", this.margin, this.currentY)
    this.currentY += 10

    // Confidence bar for primary diagnosis
    const confidence = analysis.primaryDiagnosis.confidence
    this.doc.setFillColor(34, 197, 94) // Green
    this.doc.rect(this.margin, this.currentY, (confidence / 100) * 100, 8, "F")
    this.doc.setDrawColor(226, 232, 240)
    this.doc.rect(this.margin, this.currentY, 100, 8)

    this.doc.setFontSize(10)
    this.doc.setTextColor(255, 255, 255)
    this.doc.text(`${confidence}%`, this.margin + 2, this.currentY + 6)

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(analysis.primaryDiagnosis.condition, this.margin + 110, this.currentY + 6)

    this.currentY += 15

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(10)
    const reasoningLines = this.doc.splitTextToSize(
      `AI Reasoning: ${analysis.primaryDiagnosis.reasoning}`,
      this.pageWidth - 2 * this.margin,
    )
    reasoningLines.forEach((line: string) => {
      this.doc.text(line, this.margin, this.currentY)
      this.currentY += 6
    })

    this.currentY += 10

    // Differential Diagnosis
    if (analysis.differentialDiagnosis.length > 0) {
      this.doc.setFontSize(14)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("Differential Diagnosis", this.margin, this.currentY)
      this.currentY += 10

      analysis.differentialDiagnosis.forEach((diagnosis: any, index: number) => {
        this.checkPageBreak(25)

        this.doc.setFontSize(11)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`${index + 1}. ${diagnosis.condition}`, this.margin + 5, this.currentY)

        // Confidence indicator
        const color =
          diagnosis.confidence > 70 ? [34, 197, 94] : diagnosis.confidence > 50 ? [234, 179, 8] : [239, 68, 68]
        this.doc.setTextColor(color[0], color[1], color[2])
        this.doc.text(`(${diagnosis.confidence}%)`, this.margin + 120, this.currentY)

        this.currentY += 8
        this.doc.setTextColor(0, 0, 0)
        this.doc.setFont("helvetica", "normal")
        this.doc.setFontSize(10)

        const diagnosisLines = this.doc.splitTextToSize(diagnosis.reasoning, this.pageWidth - 2 * this.margin - 10)
        diagnosisLines.forEach((line: string) => {
          this.doc.text(line, this.margin + 10, this.currentY)
          this.currentY += 6
        })
        this.currentY += 5
      })
    }

    // Risk Factors
    if (analysis.riskFactors.length > 0) {
      this.currentY += 5
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("⚠️ Identified Risk Factors:", this.margin, this.currentY)
      this.currentY += 8

      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      analysis.riskFactors.forEach((factor: string) => {
        this.checkPageBreak(8)
        this.doc.text(`• ${factor}`, this.margin + 5, this.currentY)
        this.currentY += 7
      })
    }

    this.currentY += 10
    this.addSeparator()
  }

  private addRiskAssessment(assessment: any) {
    this.addSectionHeader("📊 RISK ASSESSMENT", "AI-Calculated Health Risk Analysis")

    // Overall Risk Score Circle
    const centerX = this.margin + 40
    const centerY = this.currentY + 25
    const radius = 20

    // Risk color coding
    const riskColors = {
      Low: [34, 197, 94], // Green
      Moderate: [234, 179, 8], // Yellow
      High: [249, 115, 22], // Orange
      Critical: [239, 68, 68], // Red
    }

    const riskColor = riskColors[assessment.overallRisk] || [128, 128, 128]

    // Draw risk circle
    this.doc.setFillColor(riskColor[0], riskColor[1], riskColor[2])
    this.doc.circle(centerX, centerY, radius, "F")

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(16)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(assessment.riskScore.toString(), centerX - 8, centerY + 2)

    this.doc.setFontSize(8)
    this.doc.text("/100", centerX + 8, centerY + 2)

    // Risk level text
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(`Overall Risk: ${assessment.overallRisk}`, centerX + 30, centerY - 5)

    this.doc.setFontSize(10)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(`AI Risk Score: ${assessment.riskScore}/100`, centerX + 30, centerY + 5)

    this.currentY += 60

    // Specific Risk Categories
    if (assessment.specificRisks.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("Specific Risk Categories:", this.margin, this.currentY)
      this.currentY += 10

      assessment.specificRisks.forEach((risk: any) => {
        this.checkPageBreak(20)

        // Risk category header
        this.doc.setFontSize(11)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`📋 ${risk.category}`, this.margin + 5, this.currentY)

        // Risk level badge
        const levelColor =
          risk.level === "High" ? [239, 68, 68] : risk.level === "Moderate" ? [234, 179, 8] : [34, 197, 94]
        this.doc.setFillColor(levelColor[0], levelColor[1], levelColor[2])
        this.doc.roundedRect(this.margin + 100, this.currentY - 8, 30, 12, 2, 2, "F")
        this.doc.setTextColor(255, 255, 255)
        this.doc.setFontSize(8)
        this.doc.text(risk.level, this.margin + 107, this.currentY - 2)

        this.currentY += 8
        this.doc.setTextColor(0, 0, 0)
        this.doc.setFont("helvetica", "normal")
        this.doc.setFontSize(10)

        const descLines = this.doc.splitTextToSize(risk.description, this.pageWidth - 2 * this.margin - 10)
        descLines.forEach((line: string) => {
          this.doc.text(line, this.margin + 10, this.currentY)
          this.currentY += 6
        })
        this.currentY += 5
      })
    }

    this.currentY += 10
    this.addSeparator()
  }

  private addMedicationRecommendations(medications: any) {
    this.addSectionHeader("💊 AI MEDICATION RECOMMENDATIONS", "Personalized Treatment Plan")

    // Primary Medications
    if (medications.primaryMedications.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("🎯 Primary Medications", this.margin, this.currentY)
      this.currentY += 10

      medications.primaryMedications.forEach((med: any, index: number) => {
        this.checkPageBreak(50)

        // Medication card background
        this.doc.setFillColor(248, 250, 252)
        this.doc.roundedRect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 35, 3, 3, "F")
        this.doc.setDrawColor(226, 232, 240)
        this.doc.roundedRect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 35, 3, 3)

        // Medication name
        this.doc.setTextColor(0, 0, 0)
        this.doc.setFontSize(14)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`${index + 1}. ${med.medication}`, this.margin + 5, this.currentY + 5)

        // Indian brands
        this.doc.setFontSize(10)
        this.doc.setFont("helvetica", "normal")
        this.doc.setTextColor(59, 130, 246)
        this.doc.text(`Indian Brands: ${med.indianBrands.join(", ")}`, this.margin + 5, this.currentY + 12)

        // Dosage and cost
        this.doc.setTextColor(0, 0, 0)
        this.doc.text(`💊 Dosage: ${med.dosage}`, this.margin + 5, this.currentY + 19)
        this.doc.text(`⏰ Duration: ${med.duration}`, this.margin + 80, this.currentY + 19)

        this.doc.setTextColor(34, 197, 94)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`💰 Cost: ${med.cost}`, this.margin + 5, this.currentY + 26)

        // AI reasoning
        this.doc.setTextColor(100, 100, 100)
        this.doc.setFont("helvetica", "italic")
        this.doc.setFontSize(9)
        const reasoningLines = this.doc.splitTextToSize(
          `AI Reasoning: ${med.reasoning}`,
          this.pageWidth - 2 * this.margin - 10,
        )
        let reasoningY = this.currentY + 26
        reasoningLines.forEach((line: string) => {
          this.doc.text(line, this.margin + 80, reasoningY)
          reasoningY += 5
        })

        this.currentY += 45
      })
    }

    // Drug Interactions Warning
    if (medications.interactions.length > 0) {
      this.currentY += 5
      this.doc.setFillColor(254, 242, 242) // Light red
      this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 20, 3, 3, "F")

      this.doc.setTextColor(220, 38, 38)
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("⚠️ Drug Interaction Warnings", this.margin + 5, this.currentY + 8)

      this.doc.setTextColor(0, 0, 0)
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      this.doc.text(medications.interactions.join(", "), this.margin + 5, this.currentY + 15)

      this.currentY += 25
    }

    // Contraindications
    if (medications.contraindications.length > 0) {
      this.doc.setFillColor(254, 242, 242) // Light red
      this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 15, 3, 3, "F")

      this.doc.setTextColor(220, 38, 38)
      this.doc.setFontSize(11)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("🚫 Contraindications:", this.margin + 5, this.currentY + 8)

      this.doc.setTextColor(0, 0, 0)
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(9)
      this.doc.text(medications.contraindications.join(", "), this.margin + 5, this.currentY + 12)

      this.currentY += 20
    }

    this.currentY += 10
    this.addSeparator()
  }

  private addLifestyleModifications(lifestyle: any) {
    this.addSectionHeader("🌱 LIFESTYLE MODIFICATIONS", "AI-Personalized Health Plan for Indian Context")

    // Diet Recommendations
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("🍽️ Diet & Nutrition (Indian Context)", this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(10)

    // General recommendations
    lifestyle.diet.recommendations.forEach((rec: string) => {
      this.checkPageBreak(8)
      this.doc.text(`• ${rec}`, this.margin + 5, this.currentY)
      this.currentY += 7
    })

    // Indian foods
    if (lifestyle.diet.indianFoods.length > 0) {
      this.currentY += 5
      this.doc.setFont("helvetica", "bold")
      this.doc.text("🇮🇳 Recommended Indian Foods:", this.margin + 5, this.currentY)
      this.currentY += 7

      this.doc.setFont("helvetica", "normal")
      this.doc.text(lifestyle.diet.indianFoods.join(", "), this.margin + 10, this.currentY)
      this.currentY += 10
    }

    // Restrictions
    if (lifestyle.diet.restrictions.length > 0) {
      this.doc.setFont("helvetica", "bold")
      this.doc.setTextColor(220, 38, 38)
      this.doc.text("⚠️ Dietary Restrictions:", this.margin + 5, this.currentY)
      this.currentY += 7

      this.doc.setTextColor(0, 0, 0)
      this.doc.setFont("helvetica", "normal")
      lifestyle.diet.restrictions.forEach((restriction: string) => {
        this.doc.text(`• ${restriction}`, this.margin + 10, this.currentY)
        this.currentY += 7
      })
    }

    this.currentY += 10

    // Exercise Recommendations
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("🏃 Exercise & Physical Activity", this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(10)
    lifestyle.exercise.recommendations.forEach((rec: string) => {
      this.checkPageBreak(8)
      this.doc.text(`• ${rec}`, this.margin + 5, this.currentY)
      this.currentY += 7
    })

    this.currentY += 10

    // General Lifestyle
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("🧘 General Lifestyle Modifications", this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(10)
    lifestyle.lifestyle.recommendations.forEach((rec: string) => {
      this.checkPageBreak(8)
      this.doc.text(`• ${rec}`, this.margin + 5, this.currentY)
      this.currentY += 7
    })

    this.currentY += 10
    this.addSeparator()
  }

  private addFollowUpPlan(followUp: any) {
    this.addSectionHeader("📅 FOLLOW-UP PLAN", "AI-Generated Monitoring Timeline")

    // Timeline
    if (followUp.timeline.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("⏰ Follow-up Timeline", this.margin, this.currentY)
      this.currentY += 10

      followUp.timeline.forEach((item: any, index: number) => {
        this.checkPageBreak(15)

        // Priority color coding
        const priorityColors = {
          High: [239, 68, 68], // Red
          Medium: [234, 179, 8], // Yellow
          Low: [34, 197, 94], // Green
        }

        const priorityColor = priorityColors[item.priority] || [128, 128, 128]

        // Timeline item
        this.doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2])
        this.doc.circle(this.margin + 5, this.currentY + 2, 3, "F")

        this.doc.setTextColor(0, 0, 0)
        this.doc.setFontSize(11)
        this.doc.setFont("helvetica", "bold")
        this.doc.text(`${item.timeframe}:`, this.margin + 15, this.currentY + 4)

        this.doc.setFont("helvetica", "normal")
        this.doc.text(item.action, this.margin + 50, this.currentY + 4)

        // Priority badge
        this.doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2])
        this.doc.roundedRect(this.pageWidth - 60, this.currentY - 2, 35, 10, 2, 2, "F")
        this.doc.setTextColor(255, 255, 255)
        this.doc.setFontSize(8)
        this.doc.text(item.priority, this.pageWidth - 52, this.currentY + 4)

        this.currentY += 12
      })
    }

    this.currentY += 10

    // Monitoring Requirements
    if (followUp.monitoring.length > 0) {
      this.doc.setTextColor(0, 0, 0)
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("📊 Monitoring Requirements", this.margin, this.currentY)
      this.currentY += 10

      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      followUp.monitoring.forEach((item: string) => {
        this.checkPageBreak(8)
        this.doc.text(`• ${item}`, this.margin + 5, this.currentY)
        this.currentY += 7
      })
    }

    this.currentY += 10

    // Red Flags
    if (followUp.redFlags.length > 0) {
      this.doc.setFillColor(254, 242, 242) // Light red background
      this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 3, 3, "F")

      this.doc.setTextColor(220, 38, 38)
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("🚩 Red Flag Symptoms - Seek Immediate Medical Attention", this.margin + 5, this.currentY + 8)

      this.doc.setTextColor(0, 0, 0)
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      this.doc.text(followUp.redFlags.join(", "), this.margin + 5, this.currentY + 18)

      this.currentY += 30
    }

    this.currentY += 10
    this.addSeparator()
  }

  private addEmergencyProtocols(emergency: any) {
    this.addSectionHeader("🚨 EMERGENCY PROTOCOLS", "Critical Warning Signs & Action Steps")

    // Immediate Warning Signs
    if (emergency.warningSignsImmediate.length > 0) {
      this.doc.setFillColor(254, 226, 226) // Light red
      this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 30, 3, 3, "F")

      this.doc.setTextColor(220, 38, 38)
      this.doc.setFontSize(14)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("🚨 IMMEDIATE EMERGENCY SIGNS", this.margin + 5, this.currentY + 10)

      this.doc.setTextColor(0, 0, 0)
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      this.doc.text("Call 108 immediately if you experience:", this.margin + 5, this.currentY + 18)

      let emergencyY = this.currentY + 25
      emergency.warningSignsImmediate.forEach((sign: string) => {
        this.doc.text(`• ${sign}`, this.margin + 10, emergencyY)
        emergencyY += 6
      })

      this.currentY = emergencyY + 10
    }

    // Urgent Warning Signs
    if (emergency.warningSignsUrgent.length > 0) {
      this.doc.setFillColor(254, 243, 199) // Light yellow
      this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 3, 3, "F")

      this.doc.setTextColor(180, 83, 9)
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("⚠️ URGENT MEDICAL ATTENTION NEEDED", this.margin + 5, this.currentY + 8)

      this.doc.setTextColor(0, 0, 0)
      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      this.doc.text(emergency.warningSignsUrgent.join(", "), this.margin + 5, this.currentY + 18)

      this.currentY += 30
    }

    // Emergency Contacts
    this.doc.setFillColor(239, 246, 255) // Light blue
    this.doc.roundedRect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 25, 3, 3, "F")

    this.doc.setTextColor(29, 78, 216)
    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("📞 EMERGENCY CONTACTS (INDIA)", this.margin + 5, this.currentY + 8)

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(10)
    this.doc.text("Emergency: 108 | Medical: 102 | Police: 100 | Fire: 101", this.margin + 5, this.currentY + 18)

    this.currentY += 35

    // Action Steps
    if (emergency.actionSteps.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont("helvetica", "bold")
      this.doc.text("📋 Emergency Action Steps", this.margin, this.currentY)
      this.currentY += 10

      this.doc.setFont("helvetica", "normal")
      this.doc.setFontSize(10)
      emergency.actionSteps.forEach((step: string, index: number) => {
        this.checkPageBreak(8)
        this.doc.text(`${index + 1}. ${step}`, this.margin + 5, this.currentY)
        this.currentY += 7
      })
    }

    this.currentY += 15
    this.addSeparator()
  }

  private async addFooter() {
    this.checkPageBreak(100)

    // AI Disclaimer Section
    this.doc.setFillColor(248, 250, 252) // Light gray
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 60, "F")

    this.doc.setTextColor(220, 38, 38)
    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("⚠️ IMPORTANT MEDICAL DISCLAIMER", this.margin + 5, this.currentY + 10)

    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(9)

    const disclaimerText = [
      "• This AI-generated report is for informational purposes only and should not replace professional medical advice.",
      "• Always consult with qualified healthcare providers before making medical decisions or starting treatments.",
      "• AI recommendations are based on general medical knowledge and may not account for individual variations.",
      "• In case of emergency symptoms, seek immediate medical attention - do not rely solely on this report.",
      "• MyMedi.AI and its AI systems are not liable for any medical decisions made based on this report.",
    ]

    let disclaimerY = this.currentY + 20
    disclaimerText.forEach((line) => {
      this.doc.text(line, this.margin + 5, disclaimerY)
      disclaimerY += 8
    })

    this.currentY += 70

    // QR Code for digital verification
    try {
      const qrCodeDataURL = await QRCode.toDataURL(this.qrCodeData, {
        width: 60,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      this.doc.addImage(qrCodeDataURL, "PNG", this.pageWidth - 80, this.currentY, 50, 50)

      this.doc.setFontSize(8)
      this.doc.setTextColor(100, 100, 100)
      this.doc.text("Scan for digital verification", this.pageWidth - 80, this.currentY + 55)
    } catch (error) {
      console.error("QR Code generation failed:", error)
    }

    // Report metadata
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`Report ID: ${this.reportId}`, this.margin, this.currentY + 10)
    this.doc.text(`Generated by MyMedi.AI on ${new Date().toLocaleString("en-IN")}`, this.margin, this.currentY + 18)
    this.doc.text("AI Model: GPT-4 Medical | Confidence Level: High | Region: India", this.margin, this.currentY + 26)

    // Footer branding
    this.doc.setTextColor(59, 130, 246)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("MyMedi.AI - India's Most Advanced AI Healthcare Platform", this.margin, this.currentY + 40)
    this.doc.text(
      "🌐 www.mymedi.ai | 📧 support@mymedi.ai | 📱 WhatsApp: +91-9876543210",
      this.margin,
      this.currentY + 48,
    )
  }

  private addSectionHeader(title: string, subtitle?: string) {
    this.checkPageBreak(40)

    // Section header background
    this.doc.setFillColor(59, 130, 246) // Blue
    this.doc.roundedRect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, 25, 3, 3, "F")

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(16)
    this.doc.text(title, this.margin, this.currentY + 8)

    if (subtitle) {
      this.doc.setFontSize(10)
      this.doc.setFont("helvetica", "normal")
      this.doc.text(subtitle, this.margin, this.currentY + 16)
    }

    this.doc.setTextColor(0, 0, 0)
    this.currentY += 35
  }

  private addSeparator() {
    this.doc.setDrawColor(226, 232, 240)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 10
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage()
      this.currentY = 20
    }
  }

  downloadPDF(filename: string) {
    this.doc.save(filename)
  }

  getPDFBlob(): Blob {
    return this.doc.output("blob")
  }
}
