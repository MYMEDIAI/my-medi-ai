import jsPDF from "jspdf"

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

interface AIRecommendation {
  healthScore: number
  confidenceScore: number
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
  recommendations: string[]
  medicationSuggestions: any[]
  lifestyleSuggestions: any[]
  followUpTimeline: any[]
  emergencyWarnings: string[]
  nextSteps: string[]
  safetyAlerts: string[]
}

export class HealthReportPDFGenerator {
  private doc: jsPDF
  private pageHeight: number
  private pageWidth: number
  private currentY: number
  private margin: number

  constructor() {
    this.doc = new jsPDF()
    this.pageHeight = this.doc.internal.pageSize.height
    this.pageWidth = this.doc.internal.pageSize.width
    this.currentY = 20
    this.margin = 20
  }

  generateReport(assessmentData: AssessmentData, aiRecommendations: AIRecommendation, patientName: string) {
    this.addHeader(patientName)
    this.addHealthSummary(aiRecommendations)
    this.addSymptomsAnalysis(assessmentData)
    this.addMedicationRecommendations(aiRecommendations)
    this.addLifestyleRecommendations(aiRecommendations)
    this.addActionPlan(aiRecommendations)
    this.addFooter()
  }

  private addHeader(patientName: string) {
    // MyMedi.AI Logo and Header
    this.doc.setFillColor(59, 130, 246) // Blue color
    this.doc.rect(0, 0, this.pageWidth, 40, "F")

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(24)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("MyMedi.AI", this.margin, 25)

    this.doc.setFontSize(12)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("AI-Powered Health Assessment Report", this.margin, 35)

    // Patient Info
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(14)
    this.doc.setFont("helvetica", "bold")
    this.currentY = 55
    this.doc.text(`Patient: ${patientName}`, this.margin, this.currentY)

    const currentDate = new Date().toLocaleDateString("en-IN")
    const assessmentId = `MA-${Date.now().toString().slice(-6)}`

    this.doc.text(`Date: ${currentDate}`, this.pageWidth - 80, this.currentY)
    this.currentY += 10
    this.doc.text(`Assessment ID: ${assessmentId}`, this.pageWidth - 80, this.currentY)

    this.currentY += 20
    this.addSeparator()
  }

  private addHealthSummary(aiRecommendations: AIRecommendation) {
    this.addSectionHeader("HEALTH SUMMARY")

    // Health Score Circle (represented as text)
    this.doc.setFontSize(16)
    this.doc.setFont("helvetica", "bold")

    const scoreColor = this.getScoreColor(aiRecommendations.healthScore)
    this.doc.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
    this.doc.text(`Health Score: ${aiRecommendations.healthScore}/100`, this.margin, this.currentY)

    // Risk Level
    const riskColor = this.getRiskColor(aiRecommendations.riskLevel)
    this.doc.setTextColor(riskColor.r, riskColor.g, riskColor.b)
    this.doc.text(`Risk Level: ${aiRecommendations.riskLevel}`, this.margin + 100, this.currentY)

    this.currentY += 15

    // Confidence Score
    this.doc.setTextColor(59, 130, 246)
    this.doc.setFontSize(12)
    this.doc.text(`AI Confidence: ${aiRecommendations.confidenceScore}%`, this.margin, this.currentY)

    this.currentY += 20

    // Key Findings
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Key Findings:", this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFont("helvetica", "normal")
    aiRecommendations.recommendations.slice(0, 3).forEach((finding) => {
      this.doc.text(`• ${finding}`, this.margin + 5, this.currentY)
      this.currentY += 8
    })

    this.currentY += 10
    this.addSeparator()
  }

  private addSymptomsAnalysis(assessmentData: AssessmentData) {
    this.addSectionHeader("SYMPTOMS & ANALYSIS")

    // Primary Complaint
    this.doc.setFont("helvetica", "bold")
    this.doc.text("Primary Complaint:", this.margin, this.currentY)
    this.doc.setFont("helvetica", "normal")
    this.doc.text(assessmentData.primarySymptom || "Not specified", this.margin + 50, this.currentY)
    this.currentY += 15

    // Secondary Symptoms
    if (assessmentData.secondarySymptoms.length > 0) {
      this.doc.setFont("helvetica", "bold")
      this.doc.text("Related Symptoms:", this.margin, this.currentY)
      this.currentY += 10

      this.doc.setFont("helvetica", "normal")
      assessmentData.secondarySymptoms.forEach((symptom) => {
        this.doc.text(`• ${symptom}`, this.margin + 5, this.currentY)
        this.currentY += 8
      })
      this.currentY += 5
    }

    // Severity and Duration
    this.doc.setFont("helvetica", "bold")
    this.doc.text(`Severity: ${assessmentData.severity}/10`, this.margin, this.currentY)
    this.doc.text(`Duration: ${assessmentData.duration || "Not specified"}`, this.margin + 80, this.currentY)
    this.currentY += 15

    // Medical Conditions
    if (assessmentData.conditions.length > 0) {
      this.doc.setFont("helvetica", "bold")
      this.doc.text("Medical Conditions:", this.margin, this.currentY)
      this.currentY += 10

      this.doc.setFont("helvetica", "normal")
      assessmentData.conditions.forEach((condition) => {
        this.doc.text(
          `• ${condition.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
          this.margin + 5,
          this.currentY,
        )
        this.currentY += 8
      })
    }

    this.currentY += 10
    this.addSeparator()
  }

  private addMedicationRecommendations(aiRecommendations: AIRecommendation) {
    this.addSectionHeader("AI MEDICATION RECOMMENDATIONS")

    if (aiRecommendations.medicationSuggestions.length === 0) {
      this.doc.setFont("helvetica", "italic")
      this.doc.text("No specific medication recommendations at this time.", this.margin, this.currentY)
      this.currentY += 15
    } else {
      aiRecommendations.medicationSuggestions.forEach((suggestion, index) => {
        this.checkPageBreak(60)

        // Medication Name
        this.doc.setFont("helvetica", "bold")
        this.doc.setFontSize(14)
        this.doc.text(`${index + 1}. ${suggestion.medication.name}`, this.margin, this.currentY)
        this.currentY += 10

        // Category and Prescription Status
        this.doc.setFontSize(10)
        this.doc.setFont("helvetica", "normal")
        this.doc.text(`Category: ${suggestion.medication.category}`, this.margin + 5, this.currentY)
        this.doc.text(
          `${suggestion.medication.prescriptionRequired ? "Prescription Required" : "Over-the-Counter"}`,
          this.margin + 100,
          this.currentY,
        )
        this.currentY += 10

        // Dosage Information
        this.doc.setFont("helvetica", "bold")
        this.doc.text("Recommended Dosage:", this.margin + 5, this.currentY)
        this.currentY += 8
        this.doc.setFont("helvetica", "normal")
        this.doc.text(`• ${suggestion.dosage}`, this.margin + 10, this.currentY)
        this.currentY += 8
        this.doc.text(`• Timing: ${suggestion.timing}`, this.margin + 10, this.currentY)
        this.currentY += 8
        this.doc.text(`• Duration: ${suggestion.duration}`, this.margin + 10, this.currentY)
        this.currentY += 10

        // Cost Savings
        if (suggestion.costSaving > 0) {
          this.doc.setTextColor(34, 197, 94) // Green
          this.doc.setFont("helvetica", "bold")
          this.doc.text(`💰 Save ₹${suggestion.costSaving} with generic option`, this.margin + 5, this.currentY)
          this.doc.setTextColor(0, 0, 0)
          this.currentY += 10
        }

        // Warnings
        if (suggestion.warnings.length > 0) {
          this.doc.setTextColor(234, 179, 8) // Yellow
          this.doc.setFont("helvetica", "bold")
          this.doc.text("⚠️ Important Warnings:", this.margin + 5, this.currentY)
          this.currentY += 8
          this.doc.setFont("helvetica", "normal")
          suggestion.warnings.forEach((warning: string) => {
            this.doc.text(`• ${warning}`, this.margin + 10, this.currentY)
            this.currentY += 8
          })
          this.doc.setTextColor(0, 0, 0)
        }

        this.currentY += 10
      })
    }

    this.addSeparator()
  }

  private addLifestyleRecommendations(aiRecommendations: AIRecommendation) {
    this.addSectionHeader("LIFESTYLE RECOMMENDATIONS")

    if (aiRecommendations.lifestyleSuggestions.length === 0) {
      // Default lifestyle recommendations
      this.doc.setFont("helvetica", "bold")
      this.doc.text("🍎 Diet & Nutrition (Indian Context):", this.margin, this.currentY)
      this.currentY += 10
      this.doc.setFont("helvetica", "normal")
      this.doc.text("• Include turmeric, ginger, and garlic in daily cooking", this.margin + 5, this.currentY)
      this.currentY += 8
      this.doc.text("• Replace refined grains with millets (jowar, bajra, ragi)", this.margin + 5, this.currentY)
      this.currentY += 8
      this.doc.text("• Drink warm water with lemon and honey in the morning", this.margin + 5, this.currentY)
      this.currentY += 15

      this.doc.setFont("helvetica", "bold")
      this.doc.text("🏃 Exercise & Activity:", this.margin, this.currentY)
      this.currentY += 10
      this.doc.setFont("helvetica", "normal")
      this.doc.text("• 30-minute brisk walk daily, preferably in the morning", this.margin + 5, this.currentY)
      this.currentY += 8
      this.doc.text("• Practice yoga or pranayama for 15 minutes daily", this.margin + 5, this.currentY)
      this.currentY += 8
      this.doc.text("• Take stairs instead of elevators when possible", this.margin + 5, this.currentY)
      this.currentY += 15
    } else {
      aiRecommendations.lifestyleSuggestions.forEach((suggestion) => {
        this.checkPageBreak(40)

        this.doc.setFont("helvetica", "bold")
        this.doc.text(
          `${this.getCategoryIcon(suggestion.category)} ${suggestion.category}:`,
          this.margin,
          this.currentY,
        )
        this.currentY += 10

        this.doc.setFont("helvetica", "normal")
        suggestion.recommendations.forEach((rec: string) => {
          this.doc.text(`• ${rec}`, this.margin + 5, this.currentY)
          this.currentY += 8
        })
        this.currentY += 10
      })
    }

    this.addSeparator()
  }

  private addActionPlan(aiRecommendations: AIRecommendation) {
    this.addSectionHeader("ACTION PLAN")

    // Immediate Actions
    this.doc.setFont("helvetica", "bold")
    this.doc.setTextColor(220, 38, 38) // Red
    this.doc.text("🚨 Immediate Actions (Today):", this.margin, this.currentY)
    this.currentY += 10
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "normal")

    if (aiRecommendations.emergencyWarnings.length > 0) {
      aiRecommendations.emergencyWarnings.forEach((warning) => {
        this.doc.text(`• ${warning}`, this.margin + 5, this.currentY)
        this.currentY += 8
      })
    } else {
      this.doc.text("• Start recommended medications as advised", this.margin + 5, this.currentY)
      this.currentY += 8
      this.doc.text("• Monitor symptoms and maintain a health diary", this.margin + 5, this.currentY)
      this.currentY += 8
    }
    this.currentY += 10

    // Short-term Monitoring
    this.doc.setFont("helvetica", "bold")
    this.doc.setTextColor(234, 179, 8) // Yellow
    this.doc.text("📊 Short-term Monitoring (This Week):", this.margin, this.currentY)
    this.currentY += 10
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("• Track symptom severity daily (1-10 scale)", this.margin + 5, this.currentY)
    this.currentY += 8
    this.doc.text("• Monitor medication effectiveness and side effects", this.margin + 5, this.currentY)
    this.currentY += 8
    this.doc.text("• Maintain regular sleep and meal timings", this.margin + 5, this.currentY)
    this.currentY += 15

    // Follow-up Timeline
    this.doc.setFont("helvetica", "bold")
    this.doc.setTextColor(34, 197, 94) // Green
    this.doc.text("📅 Follow-up Timeline:", this.margin, this.currentY)
    this.currentY += 10
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "normal")

    if (aiRecommendations.followUpTimeline.length > 0) {
      aiRecommendations.followUpTimeline.forEach((item) => {
        this.doc.text(`• ${item.action} - ${item.timeframe}`, this.margin + 5, this.currentY)
        this.currentY += 8
      })
    } else {
      this.doc.text("• Reassess symptoms in 3-5 days", this.margin + 5, this.currentY)
      this.currentY += 8
      this.doc.text("• Schedule follow-up if no improvement in 1 week", this.margin + 5, this.currentY)
      this.currentY += 8
    }
    this.currentY += 15

    // Emergency Warning Signs
    this.doc.setFont("helvetica", "bold")
    this.doc.setTextColor(220, 38, 38) // Red
    this.doc.text("🚨 Emergency Warning Signs - Seek Immediate Medical Attention:", this.margin, this.currentY)
    this.currentY += 10
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFont("helvetica", "normal")
    this.doc.text("• Severe chest pain or difficulty breathing", this.margin + 5, this.currentY)
    this.currentY += 8
    this.doc.text("• High fever (>102°F) with severe symptoms", this.margin + 5, this.currentY)
    this.currentY += 8
    this.doc.text("• Severe allergic reactions or medication side effects", this.margin + 5, this.currentY)
    this.currentY += 8
    this.doc.text("• Sudden severe headache or vision changes", this.margin + 5, this.currentY)

    this.currentY += 20
    this.addSeparator()
  }

  private addFooter() {
    this.checkPageBreak(80)

    // Medical Disclaimers
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(12)
    this.doc.text("MEDICAL DISCLAIMERS", this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(9)
    const disclaimers = [
      "• This AI-generated report is for informational purposes only and should not replace professional medical advice.",
      "• Always consult with qualified healthcare providers before making medical decisions.",
      "• Medication recommendations are based on general guidelines and may not suit individual cases.",
      "• Emergency symptoms require immediate medical attention - do not delay seeking help.",
      "• MyMedi.AI is not liable for any medical decisions made based on this report.",
    ]

    disclaimers.forEach((disclaimer) => {
      this.doc.text(disclaimer, this.margin, this.currentY)
      this.currentY += 6
    })

    this.currentY += 10

    // Emergency Contacts
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(12)
    this.doc.text("EMERGENCY CONTACTS (India)", this.margin, this.currentY)
    this.currentY += 10

    this.doc.setFont("helvetica", "normal")
    this.doc.setFontSize(10)
    this.doc.text(
      "• Emergency Services: 108 | Police: 100 | Fire: 101 | Medical Emergency: 102",
      this.margin,
      this.currentY,
    )
    this.currentY += 8
    this.doc.text("• MyMedi.AI Support: support@mymedi.ai | WhatsApp: +91-9876543210", this.margin, this.currentY)
    this.currentY += 15

    // Next Assessment
    const nextAssessmentDate = new Date()
    nextAssessmentDate.setDate(nextAssessmentDate.getDate() + 30)
    this.doc.setFont("helvetica", "bold")
    this.doc.text(
      `Next Recommended Assessment: ${nextAssessmentDate.toLocaleDateString("en-IN")}`,
      this.margin,
      this.currentY,
    )

    // Footer
    this.doc.setFontSize(8)
    this.doc.setFont("helvetica", "normal")
    this.doc.setTextColor(128, 128, 128)
    this.doc.text(
      "Generated by MyMedi.AI - India's Most Advanced AI Healthcare Platform",
      this.margin,
      this.pageHeight - 10,
    )
    this.doc.text(
      `Report ID: MA-${Date.now().toString().slice(-8)} | ${new Date().toLocaleString("en-IN")}`,
      this.pageWidth - 120,
      this.pageHeight - 10,
    )
  }

  private addSectionHeader(title: string) {
    this.checkPageBreak(30)
    this.doc.setFillColor(59, 130, 246)
    this.doc.rect(this.margin - 5, this.currentY - 5, this.pageWidth - 2 * this.margin + 10, 15, "F")

    this.doc.setTextColor(255, 255, 255)
    this.doc.setFont("helvetica", "bold")
    this.doc.setFontSize(14)
    this.doc.text(title, this.margin, this.currentY + 5)

    this.doc.setTextColor(0, 0, 0)
    this.currentY += 20
  }

  private addSeparator() {
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 10
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage()
      this.currentY = 20
    }
  }

  private getScoreColor(score: number) {
    if (score >= 80) return { r: 34, g: 197, b: 94 } // Green
    if (score >= 60) return { r: 234, g: 179, b: 8 } // Yellow
    if (score >= 40) return { r: 249, g: 115, b: 22 } // Orange
    return { r: 220, g: 38, b: 38 } // Red
  }

  private getRiskColor(risk: string) {
    switch (risk) {
      case "Low":
        return { r: 34, g: 197, b: 94 } // Green
      case "Moderate":
        return { r: 234, g: 179, b: 8 } // Yellow
      case "High":
        return { r: 249, g: 115, b: 22 } // Orange
      case "Critical":
        return { r: 220, g: 38, b: 38 } // Red
      default:
        return { r: 128, g: 128, b: 128 } // Gray
    }
  }

  private getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case "diet & nutrition":
        return "🍎"
      case "exercise & activity":
        return "🏃"
      case "sleep hygiene":
        return "😴"
      case "health monitoring":
        return "📊"
      default:
        return "📋"
    }
  }

  downloadPDF(filename: string) {
    this.doc.save(filename)
  }
}
