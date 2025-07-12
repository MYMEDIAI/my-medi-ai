import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const {
      symptoms,
      medicalHistory,
      currentMedications,
      age,
      gender,
      weight,
      allergies,
      type,
      newMedication,
      medicationList,
    } = await request.json()

    let systemPrompt = ""
    let userPrompt = ""

    switch (type) {
      case "medication_recommendations":
        systemPrompt = `You are Dr. PharmAI, an expert pharmaceutical AI specializing in the Indian medication market. You have comprehensive knowledge of:
        - Indian pharmaceutical brands (Crocin, Dolo, Combiflam, Glycomet, Pan-40, Omez, etc.)
        - Generic alternatives and pricing in Indian rupees
        - Drug interactions and contraindications
        - Dosage guidelines for Indian population
        - Prescription requirements in India
        - Common side effects and warnings
        
        Provide medication recommendations in this exact JSON format:
        {
          "recommendations": [
            {
              "medicationType": "primary/supportive/preventive",
              "genericName": "paracetamol",
              "condition": "fever/pain relief",
              "brandOptions": [
                {
                  "brandName": "Crocin 500mg",
                  "manufacturer": "GSK",
                  "price": 35,
                  "availability": "widely_available",
                  "prescriptionRequired": false
                },
                {
                  "brandName": "Dolo 650mg", 
                  "manufacturer": "Micro Labs",
                  "price": 30,
                  "availability": "widely_available",
                  "prescriptionRequired": false
                },
                {
                  "brandName": "Generic Paracetamol",
                  "manufacturer": "Various",
                  "price": 15,
                  "availability": "widely_available",
                  "prescriptionRequired": false
                }
              ],
              "dosageInstructions": {
                "adult": "500-1000mg every 6 hours, maximum 4g/day",
                "elderly": "500mg every 6 hours, maximum 3g/day",
                "timing": "Can be taken with or without food",
                "duration": "3-5 days, consult doctor if no improvement"
              },
              "contraindications": ["severe liver disease", "alcohol dependency"],
              "sideEffects": ["nausea (rare)", "liver damage (overdose)"],
              "interactions": ["warfarin", "alcohol"],
              "warnings": ["Do not exceed recommended dose", "Avoid alcohol"],
              "costSavings": "Save ₹20 with generic option",
              "aiReasoning": "Recommended for fever and pain relief based on symptoms"
            }
          ],
          "safetyAlerts": [
            {
              "severity": "high/medium/low",
              "message": "Alert message",
              "action": "Required action"
            }
          ],
          "overallAssessment": {
            "totalEstimatedCost": 150,
            "treatmentDuration": "5-7 days",
            "prescriptionRequired": false,
            "followUpRequired": true
          }
        }`

        userPrompt = `Patient Profile:
        - Age: ${age || "Not specified"}
        - Gender: ${gender || "Not specified"}
        - Weight: ${weight || "Not specified"}kg
        - Symptoms: ${symptoms?.join(", ") || "Not specified"}
        - Medical History: ${medicalHistory?.join(", ") || "None"}
        - Current Medications: ${currentMedications?.join(", ") || "None"}
        - Allergies: ${allergies?.join(", ") || "None"}
        
        Provide specific medication recommendations with Indian brands, pricing, and safety considerations. Focus on commonly available medications in India.`
        break

      case "drug_interaction_check":
        systemPrompt = `You are a drug interaction specialist AI for the Indian pharmaceutical market. Analyze drug interactions with focus on:
        - Severity levels (minor/moderate/severe/contraindicated)
        - Specific mechanisms of interaction
        - Clinical significance
        - Alternative medication suggestions
        - Timing adjustments to minimize interactions
        
        Respond in this JSON format:
        {
          "interactions": [
            {
              "drug1": "medication name",
              "drug2": "medication name", 
              "severity": "minor/moderate/severe/contraindicated",
              "mechanism": "how the interaction occurs",
              "clinicalEffect": "what happens to the patient",
              "management": "how to handle this interaction",
              "alternatives": ["alternative medication options"],
              "timingAdjustment": "spacing recommendations if applicable"
            }
          ],
          "overallRisk": "low/moderate/high/critical",
          "emergencyAlert": true/false,
          "recommendations": ["specific actions to take"],
          "safeAlternatives": ["safer medication combinations"]
        }`

        userPrompt = `Analyze drug interactions for these medications:
        Current medications: ${currentMedications?.join(", ") || "None"}
        New medication being added: ${newMedication || "None"}
        Full medication list: ${medicationList?.join(", ") || "None"}
        
        Patient age: ${age || "Not specified"}
        Medical conditions: ${medicalHistory?.join(", ") || "None"}
        
        Provide detailed interaction analysis with Indian medication context.`
        break

      case "price_comparison":
        systemPrompt = `You are a pharmaceutical pricing expert for the Indian market. You have real-time knowledge of:
        - Current medication prices across Indian pharmacies
        - Generic vs branded medication costs
        - Pharmacy chain availability (Apollo, MedPlus, 1mg, etc.)
        - Regional price variations
        - Insurance coverage options
        
        Provide pricing analysis in this JSON format:
        {
          "priceComparison": [
            {
              "genericName": "medication name",
              "options": [
                {
                  "type": "branded",
                  "name": "Brand Name",
                  "price": 100,
                  "manufacturer": "Company",
                  "availability": "widely_available/limited/rare"
                },
                {
                  "type": "generic",
                  "name": "Generic Name", 
                  "price": 45,
                  "manufacturer": "Various",
                  "availability": "widely_available"
                }
              ],
              "costSavings": 55,
              "recommendedOption": "generic/branded",
              "reasoning": "why this option is recommended"
            }
          ],
          "totalCostEstimate": {
            "branded": 500,
            "generic": 200,
            "mixed": 350,
            "savings": 300
          },
          "pharmacyAvailability": [
            {
              "pharmacy": "Apollo Pharmacy",
              "distance": "2km",
              "availability": "in_stock/limited/out_of_stock",
              "deliveryAvailable": true
            }
          ]
        }`

        userPrompt = `Provide price comparison for these medications:
        ${medicationList?.join(", ") || "Not specified"}
        
        Include Indian pharmacy chains, generic alternatives, and cost savings analysis.`
        break

      case "safety_monitoring":
        systemPrompt = `You are a medication safety AI specialist. Monitor for:
        - Dangerous drug combinations
        - Age-related contraindications  
        - Condition-specific warnings
        - Overdose risks
        - Prescription requirements
        - Emergency situations requiring immediate medical attention
        
        Respond in this JSON format:
        {
          "safetyStatus": "safe/caution/dangerous/emergency",
          "alerts": [
            {
              "severity": "low/medium/high/critical",
              "type": "interaction/contraindication/overdose/prescription",
              "message": "detailed alert message",
              "action": "required immediate action",
              "timeframe": "immediate/within_hours/within_days"
            }
          ],
          "prescriptionRequired": true/false,
          "prescriptionReasons": ["reasons why prescription is needed"],
          "emergencySignsToWatch": ["symptoms requiring immediate medical attention"],
          "followUpRequired": true/false,
          "followUpTimeframe": "timeframe for follow-up"
        }`

        userPrompt = `Safety analysis for:
        Patient: Age ${age}, Gender ${gender}
        Medical conditions: ${medicalHistory?.join(", ") || "None"}
        Current medications: ${currentMedications?.join(", ") || "None"}
        Proposed medications: ${medicationList?.join(", ") || "None"}
        Allergies: ${allergies?.join(", ") || "None"}
        
        Provide comprehensive safety assessment with emergency detection.`
        break

      default:
        return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    console.log(`💊 AI Medication Analyzer - Type: ${type}`)
    console.log(`📋 Processing for patient age: ${age}, conditions: ${medicalHistory?.join(", ") || "None"}`)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: type === "medication_recommendations" ? 4000 : 2000,
      temperature: 0.2, // Very low temperature for consistent medical advice
      mode: "json", // NEW - force the model to return pure JSON
    })

    console.log(`✅ AI Medication Analysis completed for type: ${type}`)

    // --- Parse JSON response safely ----------------------------------------
    let parsedResponse
    try {
      let cleaned = text.trim()

      // Remove leading / trailing markdown fences if present
      if (cleaned.startsWith("```")) {
        cleaned = cleaned
          .replace(/^```(?:json)?/i, "") // opening fence (with optional \`\`\`json)
          .replace(/```$/i, "") // closing fence
          .trim()
      }

      parsedResponse = JSON.parse(cleaned)
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e, "\nRaw text:\n", text)
      parsedResponse = { analysis: text, error: "Failed to parse structured response" }
    }

    return NextResponse.json({
      success: true,
      type,
      data: parsedResponse,
      timestamp: new Date().toISOString(),
      model: "gpt-4o",
      disclaimer:
        "This AI analysis is for informational purposes only. Always consult healthcare professionals for medical decisions.",
    })
  } catch (error) {
    console.error("❌ AI Medication Analyzer error:", error)

    return NextResponse.json(
      {
        error: "AI medication analysis temporarily unavailable",
        details: error instanceof Error ? error.message : "Unknown error",
        type: "ai-error",
      },
      { status: 500 },
    )
  }
}
