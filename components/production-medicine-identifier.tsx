"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Pill,
  Camera,
  Search,
  Home,
  RotateCcw,
  Download,
  Printer,
  AlertTriangle,
  Info,
  Clock,
  Utensils,
  Shield,
  Users,
  FileText,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface MedicineInfo {
  name: string
  genericName: string
  chemicalFormula: string
  molecularWeight: string
  activeIngredient: string
  strength: string
  mechanismOfAction: string
  dosageGuidelines: {
    adults: string
    children: string
    elderly: string
    maxDaily: string
    frequency: string
  }
  foodInteractions: {
    withFood: boolean
    timing: string
    restrictions: string[]
    recommendations: string[]
  }
  contraindications: {
    conditions: string[]
    medications: string[]
    allergies: string[]
    warnings: string[]
  }
  sideEffects: {
    common: string[]
    serious: string[]
    rare: string[]
  }
  alternatives: {
    generic: string[]
    branded: string[]
    natural: string[]
  }
  storage: {
    temperature: string
    conditions: string[]
    expiry: string
  }
  consultation: {
    pharmacist: string[]
    doctor: string[]
    emergency: string[]
  }
}

export function ProductionMedicineIdentifier() {
  const [medicineName, setMedicineName] = useState("")
  const [result, setResult] = useState<MedicineInfo | null>(null)
  const [patientName, setPatientName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getMedicineInfo = (medicine: string): MedicineInfo => {
    const lowerMedicine = medicine.toLowerCase()

    if (lowerMedicine.includes("alkemvert") || lowerMedicine.includes("16")) {
      return {
        name: "ALKEMvert 16",
        genericName: "Betahistine Dihydrochloride",
        chemicalFormula: "C8H12N2·2HCl",
        molecularWeight: "209.12 g/mol",
        activeIngredient: "Betahistine Dihydrochloride 16mg",
        strength: "16mg per tablet",
        mechanismOfAction:
          "Betahistine is a histamine H1 receptor agonist and H3 receptor antagonist. It improves microcirculation in the inner ear by increasing blood flow, reduces endolymphatic pressure, and helps restore balance function. It works by dilating blood vessels in the inner ear and reducing the asymmetry in vestibular tone.",
        dosageGuidelines: {
          adults: "16mg three times daily (48mg total daily)",
          children: "Not recommended for children under 18 years",
          elderly: "Same as adults, but monitor for side effects",
          maxDaily: "48mg per day (3 tablets)",
          frequency: "Every 8 hours with meals",
        },
        foodInteractions: {
          withFood: true,
          timing: "Take with or immediately after meals",
          restrictions: ["Avoid excessive alcohol", "Limit caffeine intake"],
          recommendations: [
            "Take with food to reduce stomach irritation",
            "Maintain consistent timing",
            "Drink plenty of water",
          ],
        },
        contraindications: {
          conditions: ["Pheochromocytoma", "Active peptic ulcer", "Severe asthma", "Pregnancy (first trimester)"],
          medications: [
            "MAO inhibitors",
            "Antihistamines (may reduce effectiveness)",
            "Blood pressure medications (monitor closely)",
          ],
          allergies: ["Betahistine hypersensitivity", "Any component of the formulation"],
          warnings: ["Use caution in asthma patients", "Monitor blood pressure", "Avoid in active ulcers"],
        },
        sideEffects: {
          common: ["Nausea", "Indigestion", "Headache", "Mild stomach upset", "Drowsiness"],
          serious: ["Severe allergic reactions", "Breathing difficulties", "Chest pain", "Irregular heartbeat"],
          rare: ["Skin rash", "Swelling of face/lips", "Severe dizziness", "Fainting"],
        },
        alternatives: {
          generic: ["Betahistine 8mg", "Betahistine 24mg", "Vertin", "Betaserc"],
          branded: ["Vertin 16", "Betaserc 16", "Histigo 16", "Vertizac 16"],
          natural: ["Ginkgo Biloba", "Ginger supplements", "Vitamin B6", "Magnesium supplements"],
        },
        storage: {
          temperature: "Store below 25°C (77°F)",
          conditions: [
            "Keep in original container",
            "Protect from moisture",
            "Keep away from children",
            "Do not freeze",
          ],
          expiry: "Check expiration date - typically 2-3 years from manufacture",
        },
        consultation: {
          pharmacist: [
            "Drug interactions check",
            "Proper administration technique",
            "Side effect management",
            "Generic alternatives",
          ],
          doctor: ["Dosage adjustments", "Treatment duration", "Underlying condition management", "Regular monitoring"],
          emergency: ["Severe allergic reactions", "Breathing difficulties", "Chest pain", "Loss of consciousness"],
        },
      }
    }

    if (lowerMedicine.includes("paracetamol") || lowerMedicine.includes("acetaminophen")) {
      return {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        chemicalFormula: "C8H9NO2",
        molecularWeight: "151.16 g/mol",
        activeIngredient: "Paracetamol/Acetaminophen",
        strength: "500mg per tablet (common)",
        mechanismOfAction:
          "Paracetamol inhibits cyclooxygenase (COX) enzymes in the central nervous system, reducing prostaglandin synthesis. It acts primarily in the brain to reduce pain and fever by affecting the hypothalamic heat-regulating center. Unlike NSAIDs, it has minimal anti-inflammatory effects peripherally.",
        dosageGuidelines: {
          adults: "500-1000mg every 4-6 hours",
          children: "10-15mg/kg every 4-6 hours",
          elderly: "Same as adults, monitor liver function",
          maxDaily: "4000mg (4g) per day maximum",
          frequency: "Every 4-6 hours as needed",
        },
        foodInteractions: {
          withFood: false,
          timing: "Can be taken with or without food",
          restrictions: ["Avoid alcohol (increases liver toxicity risk)", "Limit to 3 drinks per day maximum"],
          recommendations: ["Take with water", "Maintain adequate hydration", "Space doses evenly"],
        },
        contraindications: {
          conditions: ["Severe liver disease", "Severe kidney disease", "Alcohol dependence", "G6PD deficiency"],
          medications: ["Warfarin (monitor INR)", "Isoniazid", "Carbamazepine", "Other paracetamol-containing drugs"],
          allergies: ["Paracetamol hypersensitivity", "Aspirin allergy (cross-sensitivity possible)"],
          warnings: ["Liver damage with overdose", "Chronic alcohol use increases risk", "Monitor in liver disease"],
        },
        sideEffects: {
          common: ["Generally well tolerated", "Rare: mild nausea", "Occasional skin rash"],
          serious: [
            "Liver damage (overdose)",
            "Severe skin reactions (Stevens-Johnson syndrome)",
            "Blood disorders (rare)",
          ],
          rare: ["Kidney damage (chronic high-dose use)", "Severe allergic reactions", "Thrombocytopenia"],
        },
        alternatives: {
          generic: ["Ibuprofen", "Aspirin", "Diclofenac", "Naproxen"],
          branded: ["Tylenol", "Panadol", "Calpol", "Fevadol"],
          natural: ["Willow bark", "Turmeric", "Ginger", "Cold compress"],
        },
        storage: {
          temperature: "Store at room temperature (15-30°C)",
          conditions: ["Keep in dry place", "Original container", "Away from children", "Protect from light"],
          expiry: "Typically 3-5 years from manufacture date",
        },
        consultation: {
          pharmacist: [
            "Dosage calculations",
            "Drug interactions",
            "Over-the-counter combinations",
            "Proper use guidance",
          ],
          doctor: [
            "Chronic pain management",
            "Liver function monitoring",
            "Alternative pain relief",
            "Underlying condition treatment",
          ],
          emergency: ["Overdose symptoms", "Severe allergic reactions", "Liver toxicity signs", "Unusual bleeding"],
        },
      }
    }

    if (lowerMedicine.includes("ibuprofen")) {
      return {
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        chemicalFormula: "C13H18O2",
        molecularWeight: "206.28 g/mol",
        activeIngredient: "Ibuprofen",
        strength: "200mg, 400mg, 600mg tablets",
        mechanismOfAction:
          "Ibuprofen is a non-selective COX-1 and COX-2 inhibitor that reduces prostaglandin synthesis. This results in anti-inflammatory, analgesic, and antipyretic effects. It also inhibits platelet aggregation and can affect kidney function by reducing prostaglandin-mediated vasodilation.",
        dosageGuidelines: {
          adults: "200-400mg every 4-6 hours",
          children: "5-10mg/kg every 6-8 hours",
          elderly: "Start with lower doses, monitor closely",
          maxDaily: "1200mg OTC, 3200mg prescription maximum",
          frequency: "Every 4-6 hours with food",
        },
        foodInteractions: {
          withFood: true,
          timing: "Always take with food or milk",
          restrictions: ["Avoid alcohol", "Limit sodium intake", "Monitor with blood thinners"],
          recommendations: ["Take with meals", "Drink plenty of water", "Avoid on empty stomach"],
        },
        contraindications: {
          conditions: [
            "Active peptic ulcer",
            "Severe heart failure",
            "Severe kidney disease",
            "Third trimester pregnancy",
          ],
          medications: ["Warfarin", "ACE inhibitors", "Lithium", "Methotrexate", "Aspirin"],
          allergies: ["NSAID hypersensitivity", "Aspirin allergy", "Asthma with nasal polyps"],
          warnings: ["Cardiovascular risk", "GI bleeding risk", "Kidney function impairment", "Hypertension"],
        },
        sideEffects: {
          common: ["Stomach upset", "Nausea", "Heartburn", "Dizziness", "Headache"],
          serious: ["GI bleeding", "Heart attack", "Stroke", "Kidney damage", "Liver toxicity"],
          rare: ["Severe allergic reactions", "Blood disorders", "Aseptic meningitis", "Skin reactions"],
        },
        alternatives: {
          generic: ["Naproxen", "Diclofenac", "Celecoxib", "Acetaminophen"],
          branded: ["Advil", "Motrin", "Nurofen", "Brufen"],
          natural: ["Turmeric", "Willow bark", "Boswellia", "Ice therapy"],
        },
        storage: {
          temperature: "Store at room temperature (20-25°C)",
          conditions: ["Keep dry", "Original container", "Away from children", "Protect from moisture"],
          expiry: "Typically 2-3 years from manufacture",
        },
        consultation: {
          pharmacist: ["Drug interactions", "Proper dosing", "Side effect management", "OTC combinations"],
          doctor: [
            "Long-term use monitoring",
            "Cardiovascular risk assessment",
            "GI protection strategies",
            "Alternative therapies",
          ],
          emergency: ["Signs of GI bleeding", "Chest pain", "Severe allergic reactions", "Kidney problems"],
        },
      }
    }

    // Default generic medicine information
    return {
      name: medicineName,
      genericName: "Generic Medicine",
      chemicalFormula: "Not specified",
      molecularWeight: "Not specified",
      activeIngredient: "Please provide specific medicine name",
      strength: "Varies by formulation",
      mechanismOfAction:
        "Each medication has unique molecular structure and mechanisms. Please provide specific medicine name for detailed chemical analysis and mechanism of action information.",
      dosageGuidelines: {
        adults: "Follow doctor's prescription",
        children: "Pediatric dosing varies by age and weight",
        elderly: "May require dose adjustment",
        maxDaily: "As prescribed by healthcare provider",
        frequency: "As directed on prescription label",
      },
      foodInteractions: {
        withFood: true,
        timing: "Check specific instructions on label",
        restrictions: ["Avoid alcohol unless approved", "Check for food-drug interactions"],
        recommendations: [
          "Read medication labels carefully",
          "Follow prescribed dosages exactly",
          "Note active ingredients to avoid duplicates",
        ],
      },
      contraindications: {
        conditions: ["Inform doctor of all medical conditions"],
        medications: ["Inform doctor of all current medications"],
        allergies: ["Check for drug allergies before taking"],
        warnings: ["Don't mix with alcohol unless approved", "Always check for contraindications"],
      },
      sideEffects: {
        common: ["Varies by medication type"],
        serious: ["Contact healthcare provider for serious reactions"],
        rare: ["Report any unusual symptoms immediately"],
      },
      alternatives: {
        generic: ["Consult pharmacist for generic options"],
        branded: ["Ask about brand alternatives"],
        natural: ["Discuss natural alternatives with doctor"],
      },
      storage: {
        temperature: "Follow storage instructions on label",
        conditions: ["Keep in original container", "Store as directed", "Keep away from children"],
        expiry: "Check expiration date regularly",
      },
      consultation: {
        pharmacist: [
          "Speak with pharmacist for specific interactions",
          "Ask about proper administration",
          "Discuss side effect management",
        ],
        doctor: ["Consult doctor for personalized advice", "Regular monitoring if needed", "Discuss treatment goals"],
        emergency: [
          "Report adverse reactions immediately",
          "Seek emergency care for severe reactions",
          "Contact poison control if overdose suspected",
        ],
      },
    }
  }

  const handleSearch = async () => {
    if (medicineName.trim()) {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const medicineInfo = getMedicineInfo(medicineName.trim())
      setResult(medicineInfo)
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMedicineName("")
    setResult(null)
    setPatientName("")
    setIsLoading(false)
  }

  const handlePrint = () => {
    if (!result) return

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MyMedi.ai - Comprehensive Medicine Information Report</title>
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
            max-width: 1000px;
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
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .medicine-section { 
            margin-bottom: 25px; 
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
          }
          .medicine-section h3 { 
            color: #667eea; 
            border-bottom: 2px solid #e0e7ff; 
            padding-bottom: 8px; 
            margin-top: 0;
            font-size: 1.3em;
          }
          .patient-info {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .list-item {
            background: white;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border-left: 3px solid #667eea;
          }
          .warning-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
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
            <div class="logo">💊</div>
            <h1>MyMedi.ai - Medicine Information</h1>
            <p>Comprehensive Medicine Analysis & Safety Information</p>
            <p>Generated on: ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
          </div>
          
          ${
            patientName
              ? `
          <div class="patient-info">
            <h3>👤 Patient Information</h3>
            <p><strong>Name:</strong> ${patientName}</p>
            <p><strong>Search Date:</strong> ${new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "Asia/Kolkata",
            })}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: true,
            })}</p>
          </div>
          `
              : ""
          }

          <div class="medicine-section">
            <h3>💊 Medicine Overview</h3>
            <div class="two-column">
              <div>
                <p><strong>Brand Name:</strong> ${result.name}</p>
                <p><strong>Generic Name:</strong> ${result.genericName}</p>
                <p><strong>Active Ingredient:</strong> ${result.activeIngredient}</p>
                <p><strong>Strength:</strong> ${result.strength}</p>
              </div>
              <div>
                <p><strong>Chemical Formula:</strong> ${result.chemicalFormula}</p>
                <p><strong>Molecular Weight:</strong> ${result.molecularWeight}</p>
              </div>
            </div>
          </div>

          <div class="medicine-section">
            <h3>🎯 Mechanism of Action</h3>
            <p>${result.mechanismOfAction}</p>
          </div>

          <div class="medicine-section">
            <h3>💊 Dosage Guidelines</h3>
            <div class="two-column">
              <div>
                <div class="list-item"><strong>Adults:</strong> ${result.dosageGuidelines.adults}</div>
                <div class="list-item"><strong>Children:</strong> ${result.dosageGuidelines.children}</div>
              </div>
              <div>
                <div class="list-item"><strong>Elderly:</strong> ${result.dosageGuidelines.elderly}</div>
                <div class="list-item"><strong>Maximum Daily:</strong> ${result.dosageGuidelines.maxDaily}</div>
              </div>
            </div>
          </div>

          <div class="medicine-section">
            <h3>🍽️ Food Interactions</h3>
            <p><strong>Take with food:</strong> ${result.foodInteractions.withFood ? "Yes" : "No"}</p>
            <p><strong>Timing:</strong> ${result.foodInteractions.timing}</p>
            <div class="two-column">
              <div>
                <h4>Restrictions:</h4>
                ${result.foodInteractions.restrictions.map((item) => `<div class="list-item">${item}</div>`).join("")}
              </div>
              <div>
                <h4>Recommendations:</h4>
                ${result.foodInteractions.recommendations.map((item) => `<div class="list-item">${item}</div>`).join("")}
              </div>
            </div>
          </div>

          <div class="medicine-section">
            <h3>🚫 Contraindications & Warnings</h3>
            <div class="two-column">
              <div>
                <h4>Medical Conditions:</h4>
                ${result.contraindications.conditions.map((item) => `<div class="list-item">${item}</div>`).join("")}
                <h4>Drug Interactions:</h4>
                ${result.contraindications.medications.map((item) => `<div class="list-item">${item}</div>`).join("")}
              </div>
              <div>
                <h4>Allergies:</h4>
                ${result.contraindications.allergies.map((item) => `<div class="list-item">${item}</div>`).join("")}
                <h4>Warnings:</h4>
                ${result.contraindications.warnings.map((item) => `<div class="list-item">${item}</div>`).join("")}
              </div>
            </div>
          </div>

          <div class="medicine-section">
            <h3>⚠️ Side Effects</h3>
            <div class="two-column">
              <div>
                <h4>Common:</h4>
                ${result.sideEffects.common.map((item) => `<div class="list-item">${item}</div>`).join("")}
              </div>
              <div>
                <h4>Serious:</h4>
                ${result.sideEffects.serious.map((item) => `<div class="list-item">${item}</div>`).join("")}
              </div>
            </div>
          </div>

          <div class="warning-box">
            <strong>⚠️ IMPORTANT SAFETY REMINDER:</strong> This medicine information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers and pharmacists before taking any medication. Report adverse reactions immediately.
          </div>

          <div class="footer">
            <p><strong>🌟 Powered by MyMedi.ai 🌟</strong></p>
            <p>Your AI Healthcare Companion - Comprehensive Medicine Information System</p>
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
    if (!result) return

    const content = `
MyMedi.ai - Comprehensive Medicine Information Report
Generated on: ${new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })}

${
  patientName
    ? `PATIENT INFORMATION:
Name: ${patientName}
Search Date: ${new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata",
      })}
Time: ${new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
      })}

`
    : ""
}MEDICINE INFORMATION:
Brand Name: ${result.name}
Generic Name: ${result.genericName}
Active Ingredient: ${result.activeIngredient}
Chemical Formula: ${result.chemicalFormula}
Molecular Weight: ${result.molecularWeight}
Strength: ${result.strength}

MECHANISM OF ACTION:
${result.mechanismOfAction}

DOSAGE GUIDELINES:
Adults: ${result.dosageGuidelines.adults}
Children: ${result.dosageGuidelines.children}
Elderly: ${result.dosageGuidelines.elderly}
Maximum Daily: ${result.dosageGuidelines.maxDaily}
Frequency: ${result.dosageGuidelines.frequency}

FOOD INTERACTIONS:
Take with food: ${result.foodInteractions.withFood ? "Yes" : "No"}
Timing: ${result.foodInteractions.timing}
Restrictions: ${result.foodInteractions.restrictions.join(", ")}
Recommendations: ${result.foodInteractions.recommendations.join(", ")}

CONTRAINDICATIONS:
Medical Conditions: ${result.contraindications.conditions.join(", ")}
Drug Interactions: ${result.contraindications.medications.join(", ")}
Allergies: ${result.contraindications.allergies.join(", ")}
Warnings: ${result.contraindications.warnings.join(", ")}

SIDE EFFECTS:
Common: ${result.sideEffects.common.join(", ")}
Serious: ${result.sideEffects.serious.join(", ")}
Rare: ${result.sideEffects.rare.join(", ")}

ALTERNATIVES:
Generic: ${result.alternatives.generic.join(", ")}
Branded: ${result.alternatives.branded.join(", ")}
Natural: ${result.alternatives.natural.join(", ")}

STORAGE:
Temperature: ${result.storage.temperature}
Conditions: ${result.storage.conditions.join(", ")}
Expiry: ${result.storage.expiry}

CONSULTATION NEEDED:
Pharmacist: ${result.consultation.pharmacist.join(", ")}
Doctor: ${result.consultation.doctor.join(", ")}
Emergency: ${result.consultation.emergency.join(", ")}

---
DISCLAIMER: This medicine information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers and pharmacists before taking any medication.

Generated by MyMedi.ai - Your AI Healthcare Companion
Contact: Harsha@mymedi.ai
Made in India with ❤️
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `MyMedi-Medicine-Info-${result.name.replace(/\s+/g, "-")}-${patientName ? patientName.replace(/\s+/g, "-") : "Report"}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (result) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="border-orange-200 shadow-2xl bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Pill className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Comprehensive Medicine Information</h2>
                  <p className="text-orange-100 text-sm">
                    {result.name} • {result.genericName}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrint}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-orange-50"
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-orange-50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-orange-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New Search
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6 bg-gradient-to-r from-orange-100 to-red-100">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <Info className="w-4 h-4 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="mechanism"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Activity className="w-4 h-4 mr-1" />
                  Mechanism
                </TabsTrigger>
                <TabsTrigger value="dosage" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  <Pill className="w-4 h-4 mr-1" />
                  Dosage
                </TabsTrigger>
                <TabsTrigger value="food" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                  <Utensils className="w-4 h-4 mr-1" />
                  Food
                </TabsTrigger>
                <TabsTrigger
                  value="contraindications"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Warnings
                </TabsTrigger>
                <TabsTrigger
                  value="sideeffects"
                  className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Side Effects
                </TabsTrigger>
                <TabsTrigger
                  value="alternatives"
                  className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Alternatives
                </TabsTrigger>
                <TabsTrigger
                  value="consultation"
                  className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Consultation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Medicine Overview & Chemical Information
                  </h3>
                  <p className="text-orange-100 text-sm">Complete pharmaceutical and chemical details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50">
                      <CardTitle className="text-orange-700 flex items-center">
                        <Pill className="w-5 h-5 mr-2" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Brand Name:</span>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700">
                          {result.name}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Generic Name:</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700">
                          {result.genericName}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Active Ingredient:</span>
                        <span className="text-sm font-medium">{result.activeIngredient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Strength:</span>
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {result.strength}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-700 flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Chemical Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Chemical Formula:</span>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 font-mono">
                          {result.chemicalFormula}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Molecular Weight:</span>
                        <Badge variant="outline" className="bg-indigo-100 text-indigo-700">
                          {result.molecularWeight}
                        </Badge>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Storage:</strong> {result.storage.temperature}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">{result.storage.conditions.join(" • ")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="mechanism" className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Mechanism of Action
                  </h3>
                  <p className="text-blue-100 text-sm">How this medicine works in your body</p>
                </div>

                <Card className="border-blue-200">
                  <CardContent className="p-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-900 leading-relaxed">{result.mechanismOfAction}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dosage" className="space-y-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Dosage Guidelines
                  </h3>
                  <p className="text-green-100 text-sm">Proper dosing for different age groups</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-200">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-700 text-lg">Age-Specific Dosing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-medium text-green-800">Adults</p>
                        <p className="text-sm text-green-700">{result.dosageGuidelines.adults}</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="font-medium text-yellow-800">Children</p>
                        <p className="text-sm text-yellow-700">{result.dosageGuidelines.children}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="font-medium text-orange-800">Elderly</p>
                        <p className="text-sm text-orange-700">{result.dosageGuidelines.elderly}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-700 text-lg">Dosing Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                        <p className="font-medium text-red-800">Maximum Daily Dose</p>
                        <p className="text-sm text-red-700">{result.dosageGuidelines.maxDaily}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-medium text-blue-800">Frequency</p>
                        <p className="text-sm text-blue-700">{result.dosageGuidelines.frequency}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-700">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Always follow your doctor's specific instructions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="food" className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    Food Interactions & Timing
                  </h3>
                  <p className="text-yellow-100 text-sm">Important food and timing considerations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-yellow-200">
                    <CardHeader className="bg-yellow-50">
                      <CardTitle className="text-yellow-700 text-lg">Food Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div
                        className={`p-3 rounded-lg ${result.foodInteractions.withFood ? "bg-green-50 border-l-4 border-green-400" : "bg-blue-50 border-l-4 border-blue-400"}`}
                      >
                        <p
                          className={`font-medium ${result.foodInteractions.withFood ? "text-green-800" : "text-blue-800"}`}
                        >
                          Take with food: {result.foodInteractions.withFood ? "YES" : "NO"}
                        </p>
                        <p
                          className={`text-sm ${result.foodInteractions.withFood ? "text-green-700" : "text-blue-700"}`}
                        >
                          {result.foodInteractions.timing}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50">
                      <CardTitle className="text-orange-700 text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.foodInteractions.recommendations.map((rec, index) => (
                        <div key={index} className="bg-green-50 p-2 rounded-lg border-l-3 border-green-400">
                          <p className="text-sm text-green-700">✓ {rec}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-red-700 text-lg flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Food & Drink Restrictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.foodInteractions.restrictions.map((restriction, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                          <p className="text-sm text-red-700">⚠️ {restriction}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contraindications" className="space-y-4">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Contraindications & Warnings
                  </h3>
                  <p className="text-red-100 text-sm">Important safety information and warnings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-700 text-lg">Medical Conditions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.contraindications.conditions.map((condition, index) => (
                        <div key={index} className="bg-red-50 p-2 rounded-lg border-l-3 border-red-400">
                          <p className="text-sm text-red-700">⚠️ {condition}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50">
                      <CardTitle className="text-orange-700 text-lg">Drug Interactions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.contraindications.medications.map((med, index) => (
                        <div key={index} className="bg-orange-50 p-2 rounded-lg border-l-3 border-orange-400">
                          <p className="text-sm text-orange-700">🚫 {med}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-purple-200">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="text-purple-700 text-lg">Allergies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.contraindications.allergies.map((allergy, index) => (
                        <div key={index} className="bg-purple-50 p-2 rounded-lg border-l-3 border-purple-400">
                          <p className="text-sm text-purple-700">🚨 {allergy}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200">
                    <CardHeader className="bg-yellow-50">
                      <CardTitle className="text-yellow-700 text-lg">General Warnings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.contraindications.warnings.map((warning, index) => (
                        <div key={index} className="bg-yellow-50 p-2 rounded-lg border-l-3 border-yellow-400">
                          <p className="text-sm text-yellow-700">⚠️ {warning}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sideeffects" className="space-y-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Side Effects & Adverse Reactions
                  </h3>
                  <p className="text-purple-100 text-sm">Potential side effects and when to seek help</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-green-200">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-700 text-lg">Common (Mild)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.sideEffects.common.map((effect, index) => (
                        <div key={index} className="bg-green-50 p-2 rounded-lg">
                          <p className="text-sm text-green-700">• {effect}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50">
                      <CardTitle className="text-orange-700 text-lg">Serious</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.sideEffects.serious.map((effect, index) => (
                        <div key={index} className="bg-orange-50 p-2 rounded-lg border-l-3 border-orange-400">
                          <p className="text-sm text-orange-700">⚠️ {effect}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-700 text-lg">Rare (Severe)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.sideEffects.rare.map((effect, index) => (
                        <div key={index} className="bg-red-50 p-2 rounded-lg border-l-3 border-red-400">
                          <p className="text-sm text-red-700">🚨 {effect}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-2">⚠️ When to Seek Immediate Medical Attention:</p>
                      <p>
                        Contact your doctor or emergency services immediately if you experience any serious or rare side
                        effects, allergic reactions, or if common side effects become severe or persistent.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Alternative Medications & Options
                  </h3>
                  <p className="text-indigo-100 text-sm">Other treatment options and alternatives</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-700 text-lg">Generic Alternatives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.alternatives.generic.map((alt, index) => (
                        <div key={index} className="bg-blue-50 p-2 rounded-lg">
                          <p className="text-sm text-blue-700">💊 {alt}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="text-purple-700 text-lg">Branded Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.alternatives.branded.map((alt, index) => (
                        <div key={index} className="bg-purple-50 p-2 rounded-lg">
                          <p className="text-sm text-purple-700">🏷️ {alt}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-700 text-lg">Natural Alternatives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.alternatives.natural.map((alt, index) => (
                        <div key={index} className="bg-green-50 p-2 rounded-lg">
                          <p className="text-sm text-green-700">🌿 {alt}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="w-6 h-6 text-yellow-600 mt-1" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-2">💡 Important Note:</p>
                      <p>
                        Always consult with your doctor or pharmacist before switching medications. Different
                        alternatives may have different dosing, side effects, and effectiveness for your specific
                        condition.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="consultation" className="space-y-4">
                <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 rounded-lg">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    When to Consult Healthcare Professionals
                  </h3>
                  <p className="text-teal-100 text-sm">Professional guidance and consultation needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-700 text-lg">Pharmacist Consultation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.consultation.pharmacist.map((item, index) => (
                        <div key={index} className="bg-blue-50 p-2 rounded-lg">
                          <p className="text-sm text-blue-700">💊 {item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-green-200">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-700 text-lg">Doctor Consultation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.consultation.doctor.map((item, index) => (
                        <div key={index} className="bg-green-50 p-2 rounded-lg">
                          <p className="text-sm text-green-700">👨‍⚕️ {item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-700 text-lg">Emergency Situations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {result.consultation.emergency.map((item, index) => (
                        <div key={index} className="bg-red-50 p-2 rounded-lg border-l-3 border-red-400">
                          <p className="text-sm text-red-700">🚨 {item}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        Safety Reminder
                      </p>
                      <p className="mb-2">
                        This medicine information is for educational purposes only and should not replace professional
                        medical advice. Always consult with qualified healthcare providers and pharmacists before taking
                        any medication.
                      </p>
                      <p className="font-medium">
                        📞 Emergency: Call your local emergency number immediately for severe reactions
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3 mt-8 justify-center">
              <Button
                onClick={handlePrint}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Complete Report
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Search
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-700">
          <div className="flex items-center">
            <Pill className="w-5 h-5 mr-2" />
            Medicine Identifier & Information System
          </div>
          <div className="flex gap-1">
            <Button onClick={handleReset} variant="ghost" size="sm" title="Reset">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!patientName && (
          <div className="mb-4">
            <Input
              placeholder="Enter your name (optional)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="text-sm"
            />
          </div>
        )}

        <div className="bg-orange-50 p-4 rounded-lg min-h-[120px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="text-sm text-orange-600">Analyzing medicine information...</p>
            </div>
          ) : (
            <div className="text-center">
              <Pill className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <p className="text-sm text-orange-600">
                Enter medicine name to get comprehensive information including chemical composition, dosage guidelines,
                food interactions, contraindications, and safety information.
              </p>
              <p className="text-xs text-orange-500 mt-2">Try: "ALKEMvert 16", "Paracetamol", "Ibuprofen"</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter medicine name (e.g., ALKEMvert 16, Paracetamol)"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            disabled={isLoading}
          />
          <Button
            onClick={handleSearch}
            disabled={!medicineName.trim() || isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Search className="w-4 h-4 mr-1" />
            Analyze
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <Camera className="w-3 h-3 mr-1" />
            Scan Medicine
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <Pill className="w-3 h-3 mr-1" />
            Browse Database
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-xs text-yellow-700">
              <p className="font-medium mb-1">⚠️ SAFETY REMINDER:</p>
              <p>
                This is general information only. Always consult healthcare professionals and report adverse reactions
                immediately. Each medication requires personalized medical guidance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
