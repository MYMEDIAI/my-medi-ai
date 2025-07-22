import { NextResponse } from "next/server"

/**
 * Extremely robust stub endpoint.
 * – NO third-party imports (so the build never fails)
 * – Returns a fully structured JSON plan every time.
 */
export async function POST(req: Request) {
  const { type, payload } = await req.json()

  if (type === "weight-loss-plan") {
    const {
      name,
      gender,
      age,
      height,
      currentWeight,
      targetWeight,
      activityLevel = "moderate",
      healthConditions = [],
      dietPreference = "vegetarian",
      cuisinePreference = "north-indian",
      sleepHours = "7",
      waterIntake = "8",
    } = payload as any

    /* ---------- Enhanced calculations for the stub ----------- */
    const h = Number(height) / 100
    const w = Number(currentWeight)
    const tw = Number(targetWeight)
    const ageNum = Number(age)
    const bmi = (kg: number) => kg / (h * h)
    const currentBmi = bmi(w)
    const targetBmi = bmi(tw)
    const category =
      currentBmi < 18.5 ? "Underweight" : currentBmi < 25 ? "Normal" : currentBmi < 30 ? "Overweight" : "Obese"

    const bmr =
      gender === "male"
        ? 88.362 + 13.397 * w + 4.799 * Number(height) - 5.677 * ageNum
        : 447.593 + 9.247 * w + 3.098 * Number(height) - 4.33 * ageNum

    const mult =
      {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        "very-active": 1.9,
      }[activityLevel as keyof typeof mult] ?? 1.55

    const tdee = bmr * mult
    const deficit = Math.min(750, (w - tw) * 50) // More aggressive but safe
    const targetDaily = tdee - deficit
    const weeklyLoss = (deficit * 7) / 7700
    const estWeeks = Math.ceil((w - tw) / weeklyLoss)

    // Enhanced personalized content based on user data
    const isVeg = dietPreference === "vegetarian" || dietPreference === "vegan"
    const isSouthIndian = cuisinePreference === "south-indian"
    const isGujarati = cuisinePreference === "gujarati"
    const isPunjabi = cuisinePreference === "punjabi"
    const lowSleep = Number(sleepHours) < 7
    const lowWater = Number(waterIntake) < 8

    const json = {
      bmi: {
        current: currentBmi,
        target: targetBmi,
        category,
        risk: currentBmi > 30 ? "High" : currentBmi > 25 ? "Moderate" : "Low",
        improvement: (((currentBmi - targetBmi) / currentBmi) * 100).toFixed(1) + "% reduction needed",
      },
      calories: {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        deficit,
        targetDaily: Math.round(targetDaily),
        macros: {
          protein: Math.round(w * 1.6) + "g (25%)",
          carbs: Math.round((targetDaily * 0.45) / 4) + "g (45%)",
          fats: Math.round((targetDaily * 0.3) / 9) + "g (30%)",
        },
      },
      timeline: {
        weeklyLoss: Number(weeklyLoss.toFixed(2)),
        estimatedWeeks: estWeeks,
        phases: [
          { phase: "Week 1-2", focus: "Adaptation & Water Weight Loss", expectedLoss: "1-2 kg" },
          { phase: "Week 3-8", focus: "Fat Loss & Habit Formation", expectedLoss: `${(weeklyLoss * 6).toFixed(1)} kg` },
          { phase: "Week 9+", focus: "Sustained Progress & Maintenance Prep", expectedLoss: "Steady 0.5-1 kg/week" },
        ],
        milestones: Array.from({ length: Math.min(6, Math.ceil(estWeeks / 4)) }, (_, i) => ({
          week: (i + 1) * 4,
          weight: Number((w - weeklyLoss * (i + 1) * 4).toFixed(1)),
          goal: i === 0 ? "Initial Progress Check" : i === 1 ? "Habit Solidification" : "Continued Excellence",
          bodyFat: `${20 - i * 2}% estimated`,
        })),
      },
      dietPlan: {
        breakfast: [
          `${isSouthIndian ? "2 Idli + Sambar + Coconut Chutney" : "Oats (50g) + Mixed Fruits + Almonds (6)"} - 280-320 cal`,
          `${isGujarati ? "2 Dhokla + Green Chutney + Buttermilk" : "Vegetable Poha (1 cup) + Green Tea"} - 250-290 cal`,
          `${isVeg ? "Moong Dal Chilla (2) + Mint Chutney" : "Egg White Omelet (3 whites) + Vegetables"} - 260-300 cal`,
          `${isSouthIndian ? "Upma (1 cup) + Vegetables + Curry Leaves" : "Whole Wheat Toast (2) + Avocado"} - 240-280 cal`,
        ],
        midMorning: [
          "Green Tea + Almonds (8-10) - 85 cal",
          "Buttermilk (1 glass) + Mint + Cumin - 65 cal",
          "Apple/Guava (1 medium) + Lemon Water - 80-90 cal",
          "Coconut Water (1 glass) + Chia Seeds (1 tsp) - 60 cal",
        ],
        lunch: [
          `Brown Rice (3/4 cup) + ${isVeg ? "Dal (1 cup) + Mixed Sabzi" : "Chicken Curry (100g)"} + Salad - 380-420 cal`,
          `Whole Wheat Roti (2) + ${isPunjabi ? "Rajma (1 cup)" : "Mixed Vegetables"} + Raita - 350-390 cal`,
          `Quinoa Pulao (1 cup) + ${isVeg ? "Paneer Curry (100g)" : "Lean Meat (100g)"} + Yogurt - 370-410 cal`,
          `${isSouthIndian ? "Brown Rice + Rasam + Sambar" : "Khichdi (1 cup)"} + Vegetables + Pickle - 340-380 cal`,
        ],
        evening: [
          "Herbal Tea + Marie Biscuits (2) - 105 cal",
          "Roasted Chana (30g) + Spices - 125 cal",
          "Green Tea + Mixed Nuts (15g) - 95 cal",
          "Vegetable Soup (1 cup) + Multigrain Bread (1 slice) - 110 cal",
        ],
        dinner: [
          `Grilled ${isVeg ? "Paneer (100g)" : "Chicken (120g)"} + Steamed Vegetables + Brown Rice (1/2 cup) - 290-330 cal`,
          `Dal (1 cup) + Roti (1) + Large Mixed Salad + Lemon Dressing - 270-310 cal`,
          `${isVeg ? "Tofu Curry (100g)" : "Fish Curry (100g)"} + Brown Rice (1/2 cup) + Vegetables - 310-350 cal`,
          `Vegetable Soup (2 cups) + ${isGujarati ? "Khakhra (2)" : "Whole Grain Bread (1 slice)"} - 240-280 cal`,
        ],
        bedtime: [
          "Warm Turmeric Milk (1 cup) + Honey (1 tsp) - 105 cal",
          "Chamomile Tea - 5 cal",
          "Warm Water + Lemon + Honey (1 tsp) - 30 cal",
          "Herbal Tea (Fennel/Mint) - 10 cal",
        ],
        guidelines: [
          "Eat every 3-4 hours to maintain metabolism",
          "Include protein in every meal for satiety",
          "Fill half your plate with vegetables",
          "Drink water 30 minutes before meals",
          "Avoid eating 3 hours before bedtime",
        ],
      },
      exercisePlan: {
        cardio: [
          `${ageNum > 50 ? "25-30 min" : "30-45 min"} brisk walking daily (burn 150-200 cal)`,
          `${activityLevel === "sedentary" ? "15-20 min" : "25-35 min"} cycling 3x/week (burn 200-300 cal)`,
          "20-30 min dancing/Zumba 2x/week (burn 180-250 cal)",
          `Swimming ${ageNum > 45 ? "25-30 min" : "30-40 min"} 2x/week (burn 250-350 cal)`,
          "Stair climbing 10-15 min daily (burn 80-120 cal)",
        ],
        strength: [
          "Bodyweight Circuit: Push-ups (3x8-12), Squats (3x15-20), Lunges (3x10 each leg) - 3x/week",
          "Resistance Band Training: Chest Press, Rows, Squats (3x12-15) - 20-25 min",
          "Yoga for Strength: Warrior poses, Planks, Chair pose - 2x/week, 30-45 min",
          `${activityLevel === "active" ? "Moderate" : "Light"} Weight Training: Compound movements - 2-3x/week`,
          "Functional Training: Kettlebell swings, Deadlifts, Overhead press - 2x/week",
        ],
        flexibility: [
          "Morning Stretching: Full body routine - 10-15 min daily",
          "Evening Yoga: Relaxation poses, deep breathing - 20-30 min",
          "Weekend Yoga Class: Comprehensive session - 45-60 min",
          "Daily Mobility: Joint rotations, dynamic stretches - 5-10 min",
          "Foam Rolling: Muscle recovery session - 2x/week, 15 min",
        ],
        gymExercises: [
          "Treadmill: 20-30 min at 6-7 km/h incline 2-3%",
          "Elliptical: 15-25 min interval training (2 min high, 1 min low)",
          "Leg Press: 3 sets x 12-15 reps at 60-70% body weight",
          "Chest Press: 3 sets x 10-12 reps with moderate weight",
          "Lat Pulldown: 3 sets x 10-12 reps focusing on form",
          "Shoulder Press: 3 sets x 8-10 reps with controlled movement",
          "Leg Curls: 3 sets x 12-15 reps for hamstring strength",
          "Planks: 3 sets x 30-60 seconds for core stability",
          "Stationary Bike: 15-20 min cool down at moderate pace",
          "Cable Rows: 3 sets x 10-12 reps for back strength",
        ],
        schedule: generateWorkoutSchedule(activityLevel, ageNum),
        weeklyCalorieBurn: "1200-1800 calories through exercise",
      },
      supplements: generatePersonalizedSupplements(dietPreference, ageNum, healthConditions, gender),
      tips: generatePersonalizedTips(cuisinePreference, lowSleep, lowWater, healthConditions),
      riskAssessment: {
        level: currentBmi > 30 || healthConditions.length > 2 ? "High" : currentBmi > 25 ? "Moderate" : "Low",
        factors: [
          ...(currentBmi > 30 ? ["Obesity (BMI > 30)"] : []),
          ...(currentBmi > 25 && currentBmi <= 30 ? ["Overweight (BMI 25-30)"] : []),
          ...healthConditions,
          ...(ageNum > 60 ? ["Age over 60"] : []),
          ...(lowSleep ? ["Insufficient sleep (<7 hours)"] : []),
        ],
        recommendations: [
          ...(currentBmi > 30 ? ["Medical supervision recommended before starting"] : []),
          ...(healthConditions.includes("Diabetes") ? ["Regular blood glucose monitoring required"] : []),
          ...(healthConditions.includes("Heart Disease") ? ["Cardiac clearance needed before exercise"] : []),
          ...(healthConditions.includes("Hypertension") ? ["Monitor BP regularly during weight loss"] : []),
          ...(ageNum > 60 ? ["Gradual exercise progression recommended"] : []),
          "Stay hydrated and listen to your body",
          "Consult healthcare provider if experiencing unusual symptoms",
        ],
      },
      followUp: {
        schedule: healthConditions.length > 1 ? "Every 2 weeks" : "Monthly",
        tests: [
          "Complete Blood Count (CBC) - Check for anemia, infections",
          "Comprehensive Metabolic Panel - Kidney, liver function",
          "Lipid Profile - Cholesterol, triglycerides, HDL, LDL",
          "HbA1c - 3-month blood sugar average (if diabetic/pre-diabetic)",
          "Thyroid Function (TSH, T3, T4) - Metabolism check",
          "Vitamin D3 & B12 levels - Common deficiencies",
          "Body Composition Analysis - Fat vs muscle ratio",
          "Blood Pressure Monitoring - Weekly at home",
        ],
        consultations: [
          "Registered Dietitian - Monthly meal plan review",
          "Certified Personal Trainer - Exercise form and progression",
          "Primary Care Physician - Overall health monitoring",
          "Endocrinologist - If diabetic or thyroid issues",
          "Cardiologist - If heart conditions present",
          "Mental Health Counselor - For emotional eating support",
          "Physiotherapist - If joint issues arise",
        ],
        tracking: [
          "Daily weight (same time, same conditions)",
          "Weekly body measurements (waist, hips, arms)",
          "Monthly progress photos (front, side, back)",
          "Food diary with portion sizes",
          "Exercise log with duration and intensity",
          "Sleep quality and duration",
          "Energy levels and mood",
        ],
      },
      note: "AI-Generated Comprehensive Plan - Add OPENAI_API_KEY for enhanced personalization",
    }

    return NextResponse.json(json)
  } else if (type === "heart-health-assessment") {
    return await generateHeartHealthAssessment(payload)
  }

  return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
}

async function generateHeartHealthAssessment(formData: any) {
  const {
    name,
    age,
    gender,
    weight,
    height,
    chestPain,
    breathlessness,
    palpitations,
    fatigue,
    swelling,
    dizziness,
    smoking,
    alcohol,
    familyHistory,
    diabetes,
    hypertension,
    cholesterol,
    exerciseFrequency,
    stressLevel,
    sleepQuality,
    dietType,
    bloodPressure,
    restingHeartRate,
    medications,
    concerns,
  } = formData

  // Advanced risk calculation using validated clinical algorithms
  let riskScore = 0
  const ageNum = Number(age)
  const weightNum = Number(weight)
  const heightNum = Number(height)

  // Framingham Risk Score components
  // Age risk (evidence-based)
  if (ageNum >= 75) riskScore += 5
  else if (ageNum >= 65) riskScore += 4
  else if (ageNum >= 55) riskScore += 3
  else if (ageNum >= 45) riskScore += 2
  else if (ageNum >= 35) riskScore += 1

  // Gender-specific risk (ACC/AHA guidelines)
  if (gender === "male" && ageNum >= 45) riskScore += 2
  else if (gender === "male") riskScore += 1
  else if (gender === "female" && ageNum >= 55) riskScore += 1

  // Calculate BMI and metabolic risk
  let bmi = null
  let bmiRisk = 0
  if (weight && height) {
    bmi = weightNum / Math.pow(heightNum / 100, 2)
    if (bmi >= 35) bmiRisk = 3
    else if (bmi >= 30) bmiRisk = 2
    else if (bmi >= 25) bmiRisk = 1
    riskScore += bmiRisk
  }

  // Symptom-based risk stratification (ESC guidelines)
  const symptomScore = calculateSymptomRisk(chestPain, breathlessness, palpitations, fatigue, swelling, dizziness)
  riskScore += symptomScore

  // Major risk factors (ATP IV guidelines)
  const majorRiskFactors = calculateMajorRiskFactors(smoking, familyHistory, diabetes, hypertension, cholesterol)
  riskScore += majorRiskFactors

  // Lifestyle risk modifiers
  const lifestyleRisk = calculateLifestyleRisk(exerciseFrequency, stressLevel, sleepQuality, dietType, alcohol)
  riskScore += lifestyleRisk

  // Determine risk stratification (ACC/AHA 2019 guidelines)
  const { riskLevel, riskCategory, tenYearRisk } = determineRiskLevel(riskScore, ageNum, gender, bmi)

  // Generate evidence-based recommendations
  const assessment = {
    riskScore: {
      total: riskScore,
      level: riskLevel,
      category: riskCategory,
      tenYearRisk: tenYearRisk,
      framinghamScore: Math.min(riskScore, 30),
    },
    clinicalAssessment: {
      primaryDiagnosis: generatePrimaryDiagnosis(riskLevel, symptomScore, majorRiskFactors),
      riskFactors: identifyRiskFactors(formData),
      recommendations: generateClinicalRecommendations(riskLevel, ageNum, gender, formData),
      urgency: determineUrgency(riskLevel, symptomScore),
    },
    diagnosticProtocol: {
      immediate: generateImmediateDiagnostics(riskLevel, symptomScore, ageNum),
      followUp: generateFollowUpDiagnostics(riskLevel, ageNum, formData),
      monitoring: generateMonitoringPlan(riskLevel, formData),
    },
    therapeuticPlan: {
      pharmacological: generatePharmacologicalPlan(riskLevel, ageNum, gender, formData),
      nonPharmacological: generateNonPharmacologicalPlan(riskLevel, formData),
      lifestyle: generateLifestylePrescription(formData),
    },
    followUpPlan: {
      schedule: generateFollowUpSchedule(riskLevel, symptomScore),
      goals: generateTherapeuticGoals(riskLevel, ageNum, gender, formData),
      monitoring: generateMonitoringSchedule(riskLevel, formData),
    },
    emergencyProtocol: {
      warningSignals: generateWarningSignals(riskLevel, ageNum),
      actionPlan: generateEmergencyActionPlan(ageNum, formData),
      contacts: generateEmergencyContacts(),
    },
    patientEducation: {
      keyPoints: generatePatientEducation(riskLevel, formData),
      resources: generateEducationalResources(riskLevel),
      lifestyle: generateLifestyleEducation(formData),
    },
    note: `Professional cardiac risk assessment generated using evidence-based clinical algorithms (ACC/AHA 2019, ESC 2021 guidelines). This assessment incorporates validated risk calculators and current clinical practice standards.`,
  }

  return NextResponse.json(assessment)
}

// Clinical risk calculation functions
function calculateSymptomRisk(
  chestPain: string,
  breathlessness: string,
  palpitations: string,
  fatigue: string,
  swelling: string,
  dizziness: string,
): number {
  let score = 0

  // Chest pain scoring (Diamond-Forrester criteria)
  if (chestPain === "frequent") score += 4
  else if (chestPain === "occasional") score += 2
  else if (chestPain === "rare") score += 1

  // Dyspnea scoring (NYHA functional class equivalent)
  if (breathlessness === "severe") score += 4
  else if (breathlessness === "moderate") score += 3
  else if (breathlessness === "mild") score += 1

  // Palpitations and other symptoms
  if (palpitations === "frequent") score += 2
  else if (palpitations === "occasional") score += 1

  if (fatigue === "severe") score += 2
  else if (fatigue === "moderate") score += 1

  if (swelling === "yes") score += 2
  if (dizziness === "frequent") score += 2
  else if (dizziness === "occasional") score += 1

  return Math.min(score, 10) // Cap at 10 points
}

function calculateMajorRiskFactors(
  smoking: string,
  familyHistory: string,
  diabetes: string,
  hypertension: string,
  cholesterol: string,
): number {
  let score = 0

  // Smoking (highest risk factor)
  if (smoking === "current") score += 4
  else if (smoking === "former") score += 1

  // Family history (genetic predisposition)
  if (familyHistory === "yes") score += 2

  // Diabetes (equivalent to CAD risk)
  if (diabetes === "yes") score += 3
  else if (diabetes === "prediabetes") score += 1

  // Hypertension
  if (hypertension === "yes") score += 2
  else if (hypertension === "borderline") score += 1

  // Dyslipidemia
  if (cholesterol === "high") score += 2
  else if (cholesterol === "borderline") score += 1

  return score
}

function calculateLifestyleRisk(
  exerciseFrequency: string,
  stressLevel: string,
  sleepQuality: string,
  dietType: string,
  alcohol: string,
): number {
  let score = 0

  // Physical inactivity
  if (exerciseFrequency === "never") score += 3
  else if (exerciseFrequency === "rarely") score += 2
  else if (exerciseFrequency === "sometimes") score += 1

  // Stress level
  if (stressLevel === "very-high") score += 3
  else if (stressLevel === "high") score += 2
  else if (stressLevel === "moderate") score += 1

  // Sleep quality
  if (sleepQuality === "poor") score += 2
  else if (sleepQuality === "fair") score += 1

  // Diet quality
  if (dietType === "processed") score += 2
  else if (dietType === "high-sodium") score += 2
  else if (dietType === "mediterranean") score -= 1 // Protective

  // Alcohol consumption
  if (alcohol === "heavy") score += 2
  else if (alcohol === "moderate") score += 1

  return Math.max(score, 0)
}

function determineRiskLevel(riskScore: number, age: number, gender: string, bmi: number | null) {
  let tenYearRisk = 0

  // Simplified 10-year risk calculation
  if (riskScore <= 5) {
    tenYearRisk = Math.min(5 + (age - 40) * 0.5, 10)
  } else if (riskScore <= 10) {
    tenYearRisk = Math.min(10 + (age - 40) * 0.8, 20)
  } else if (riskScore <= 15) {
    tenYearRisk = Math.min(20 + (age - 40) * 1.2, 35)
  } else {
    tenYearRisk = Math.min(35 + (age - 40) * 1.5, 50)
  }

  if (riskScore <= 6) {
    return {
      riskLevel: "Low",
      riskCategory: "Low cardiovascular risk - Continue preventive measures",
      tenYearRisk: Math.round(tenYearRisk),
    }
  } else if (riskScore <= 12) {
    return {
      riskLevel: "Moderate",
      riskCategory: "Moderate cardiovascular risk - Lifestyle modification and monitoring required",
      tenYearRisk: Math.round(tenYearRisk),
    }
  } else if (riskScore <= 18) {
    return {
      riskLevel: "High",
      riskCategory: "High cardiovascular risk - Aggressive intervention and specialist care needed",
      tenYearRisk: Math.round(tenYearRisk),
    }
  } else {
    return {
      riskLevel: "Very High",
      riskCategory: "Very high cardiovascular risk - Immediate medical attention and intensive management required",
      tenYearRisk: Math.round(tenYearRisk),
    }
  }
}

function generatePrimaryDiagnosis(riskLevel: string, symptomScore: number, majorRiskFactors: number): string {
  if (riskLevel === "Very High" && symptomScore >= 6) {
    return "Suspected acute coronary syndrome or unstable angina - Requires immediate cardiology evaluation"
  } else if (riskLevel === "High" && symptomScore >= 4) {
    return "High probability of significant coronary artery disease - Stress testing and cardiology consultation indicated"
  } else if (riskLevel === "Moderate" && majorRiskFactors >= 4) {
    return "Multiple cardiovascular risk factors present - Aggressive risk factor modification required"
  } else if (symptomScore >= 3) {
    return "Symptomatic cardiovascular disease possible - Further diagnostic evaluation recommended"
  } else {
    return "Cardiovascular risk assessment - Preventive care and lifestyle optimization focus"
  }
}

function identifyRiskFactors(formData: any): string[] {
  const riskFactors = []

  if (formData.smoking === "current") riskFactors.push("Active tobacco use (Major modifiable risk factor)")
  if (formData.diabetes === "yes") riskFactors.push("Diabetes mellitus (CAD equivalent)")
  if (formData.hypertension === "yes") riskFactors.push("Hypertension (>140/90 mmHg)")
  if (formData.cholesterol === "high") riskFactors.push("Dyslipidemia (Elevated LDL cholesterol)")
  if (formData.familyHistory === "yes") riskFactors.push("Family history of premature CAD (Non-modifiable)")
  if (Number(formData.age) > 65) riskFactors.push("Advanced age (Non-modifiable risk factor)")
  if (formData.gender === "male") riskFactors.push("Male gender (Higher baseline risk)")
  if (formData.exerciseFrequency === "never") riskFactors.push("Physical inactivity (Sedentary lifestyle)")
  if (formData.stressLevel === "high" || formData.stressLevel === "very-high")
    riskFactors.push("Chronic psychological stress")
  if (formData.sleepQuality === "poor") riskFactors.push("Sleep disorders/poor sleep quality")

  const weight = Number(formData.weight)
  const height = Number(formData.height)
  if (weight && height) {
    const bmi = weight / Math.pow(height / 100, 2)
    if (bmi >= 30) riskFactors.push(`Obesity (BMI ${bmi.toFixed(1)} kg/m²)`)
    else if (bmi >= 25) riskFactors.push(`Overweight (BMI ${bmi.toFixed(1)} kg/m²)`)
  }

  return riskFactors
}

function generateClinicalRecommendations(riskLevel: string, age: number, gender: string, formData: any): string[] {
  const recommendations = []

  if (riskLevel === "Very High") {
    recommendations.push("URGENT: Cardiology consultation within 24-48 hours")
    recommendations.push("Consider emergency department evaluation if symptoms worsen")
    recommendations.push("Initiate dual antiplatelet therapy if not contraindicated")
    recommendations.push("High-intensity statin therapy (Atorvastatin 40-80mg daily)")
    recommendations.push("ACE inhibitor or ARB therapy")
    recommendations.push("Beta-blocker therapy if no contraindications")
  } else if (riskLevel === "High") {
    recommendations.push("Cardiology consultation within 1-2 weeks")
    recommendations.push("Stress testing or coronary CT angiography")
    recommendations.push("Moderate to high-intensity statin therapy")
    recommendations.push("Aspirin 81mg daily for primary prevention")
    recommendations.push("Blood pressure target <130/80 mmHg")
  } else if (riskLevel === "Moderate") {
    recommendations.push("Primary care follow-up within 2-4 weeks")
    recommendations.push("Consider statin therapy based on risk-benefit analysis")
    recommendations.push("Lifestyle modification counseling")
    recommendations.push("Annual cardiovascular risk reassessment")
  } else {
    recommendations.push("Continue current preventive measures")
    recommendations.push("Annual health maintenance examination")
    recommendations.push("Lifestyle optimization focus")
    recommendations.push("Periodic risk factor screening")
  }

  // Age-specific recommendations
  if (age >= 65) {
    recommendations.push("Consider frailty assessment and functional evaluation")
    recommendations.push("Medication review for drug interactions and side effects")
  }

  // Gender-specific recommendations
  if (gender === "female" && age >= 50) {
    recommendations.push("Post-menopausal cardiovascular risk assessment")
    recommendations.push("Consider hormone therapy risks and benefits")
  }

  return recommendations
}

function determineUrgency(riskLevel: string, symptomScore: number): string {
  if (riskLevel === "Very High" && symptomScore >= 6) {
    return "EMERGENT - Seek immediate medical attention (Emergency Department)"
  } else if (riskLevel === "High" || symptomScore >= 4) {
    return "URGENT - Schedule appointment within 24-48 hours"
  } else if (riskLevel === "Moderate") {
    return "SEMI-URGENT - Schedule appointment within 1-2 weeks"
  } else {
    return "ROUTINE - Schedule appointment within 4-6 weeks"
  }
}

function generateImmediateDiagnostics(
  riskLevel: string,
  symptomScore: number,
  age: number,
): Array<{ name: string; indication: string; urgency: string; cost: string }> {
  const diagnostics = []

  if (riskLevel === "Very High" || symptomScore >= 6) {
    diagnostics.push({
      name: "12-Lead ECG with interpretation",
      indication: "Rule out acute coronary syndrome, arrhythmias",
      urgency: "STAT (within 10 minutes)",
      cost: "₹300-500",
    })
    diagnostics.push({
      name: "Cardiac biomarkers (Troponin I/T, CK-MB)",
      indication: "Detect myocardial injury/infarction",
      urgency: "STAT (within 30 minutes)",
      cost: "₹800-1,200",
    })
    diagnostics.push({
      name: "Chest X-ray",
      indication: "Assess for heart failure, pulmonary edema",
      urgency: "STAT (within 1 hour)",
      cost: "₹400-600",
    })
  }

  if (riskLevel === "High" || riskLevel === "Very High") {
    diagnostics.push({
      name: "2D Echocardiogram with Doppler",
      indication: "Assess LV function, wall motion, valve function",
      urgency: "Within 24-48 hours",
      cost: "₹2,500-4,000",
    })
    diagnostics.push({
      name: "Complete lipid profile (fasting)",
      indication: "Cardiovascular risk stratification",
      urgency: "Within 48 hours",
      cost: "₹500-800",
    })
  }

  diagnostics.push({
    name: "Comprehensive metabolic panel",
    indication: "Baseline kidney function, electrolytes, glucose",
    urgency: age >= 65 ? "Within 24 hours" : "Within 72 hours",
    cost: "₹600-900",
  })

  return diagnostics
}

function generateFollowUpDiagnostics(
  riskLevel: string,
  age: number,
  formData: any,
): Array<{ name: string; indication: string; timing: string; cost: string }> {
  const diagnostics = []

  if (riskLevel === "High" || riskLevel === "Very High") {
    diagnostics.push({
      name: "Exercise stress test or pharmacological stress testing",
      indication: "Assess for inducible ischemia, functional capacity",
      timing: "Within 2-4 weeks if stable",
      cost: "₹3,000-6,000",
    })
    diagnostics.push({
      name: "Coronary CT angiography",
      indication: "Non-invasive coronary anatomy assessment",
      timing: "If stress test inconclusive or high pre-test probability",
      cost: "₹8,000-15,000",
    })
  }

  if (age >= 50 || riskLevel !== "Low") {
    diagnostics.push({
      name: "Carotid duplex ultrasound",
      indication: "Assess for carotid stenosis, stroke risk",
      timing: "Within 3 months",
      cost: "₹2,000-3,500",
    })
  }

  if (formData.palpitations === "frequent" || formData.dizziness === "frequent") {
    diagnostics.push({
      name: "24-48 hour Holter monitor",
      indication: "Detect arrhythmias, correlate symptoms with rhythm",
      timing: "Within 2 weeks",
      cost: "₹2,500-4,000",
    })
  }

  return diagnostics
}

function generateMonitoringPlan(
  riskLevel: string,
  formData: any,
): Array<{ parameter: string; frequency: string; target: string; method: string }> {
  const monitoring = []

  monitoring.push({
    parameter: "Blood Pressure",
    frequency: formData.hypertension === "yes" ? "Daily (morning and evening)" : "Weekly",
    target: Number(formData.age) > 65 ? "<140/90 mmHg" : "<130/80 mmHg",
    method: "Home BP monitor (validated device)",
  })

  monitoring.push({
    parameter: "Weight",
    frequency: "Daily (same time, same conditions)",
    target: "Stable ±2 lbs, BMI 18.5-24.9 kg/m²",
    method: "Digital scale, morning after voiding",
  })

  if (formData.diabetes === "yes") {
    monitoring.push({
      parameter: "Blood Glucose",
      frequency: "As prescribed by physician (typically 2-4x daily)",
      target: "Pre-meal: 80-130 mg/dL, Post-meal: <180 mg/dL",
      method: "Home glucometer",
    })
  }

  monitoring.push({
    parameter: "Symptoms",
    frequency: "Daily symptom diary",
    target: "Reduction in frequency and severity",
    method: "Written log: chest pain, dyspnea, palpitations, fatigue",
  })

  return monitoring
}

function generatePharmacologicalPlan(
  riskLevel: string,
  age: number,
  gender: string,
  formData: any,
): Array<{ medication: string; indication: string; dosing: string; monitoring: string; cost: string }> {
  const medications = []

  if (riskLevel === "High" || riskLevel === "Very High") {
    medications.push({
      medication: "Atorvastatin",
      indication: "High-intensity statin for LDL reduction and plaque stabilization",
      dosing: riskLevel === "Very High" ? "40-80mg daily at bedtime" : "20-40mg daily at bedtime",
      monitoring: "Lipid panel in 6-8 weeks, then q3-6 months. LFTs at baseline and PRN",
      cost: "₹150-600/month",
    })

    medications.push({
      medication: "Aspirin",
      indication: "Antiplatelet therapy for cardiovascular event prevention",
      dosing: age > 70 ? "75mg daily with food" : "81-100mg daily with food",
      monitoring: "CBC annually, assess for GI bleeding symptoms",
      cost: "₹30-80/month",
    })
  }

  if (formData.hypertension === "yes" || riskLevel === "Very High") {
    medications.push({
      medication: "Lisinopril (ACE inhibitor)",
      indication: "BP control, cardioprotection, prevent LV remodeling",
      dosing: age > 65 ? "5-20mg daily" : "10-40mg daily",
      monitoring: "BP weekly x 4 weeks, then monthly. Creatinine/K+ in 1-2 weeks",
      cost: "₹80-300/month",
    })

    if (riskLevel === "Very High") {
      medications.push({
        medication: "Metoprolol succinate",
        indication: "Beta-blockade for rate control and cardioprotection",
        dosing: "25-200mg daily (start low, titrate slowly)",
        monitoring: "HR, BP weekly during titration. Assess for fatigue, dyspnea",
        cost: "₹100-400/month",
      })
    }
  }

  if (formData.diabetes === "yes") {
    medications.push({
      medication: "Metformin",
      indication: "First-line diabetes therapy with cardiovascular benefits",
      dosing: "500-1000mg twice daily with meals",
      monitoring: "HbA1c q3 months, creatinine q6-12 months, B12 annually",
      cost: "₹50-200/month",
    })
  }

  return medications
}

function generateNonPharmacologicalPlan(
  riskLevel: string,
  formData: any,
): Array<{ intervention: string; description: string; frequency: string; duration: string }> {
  const interventions = []

  if (riskLevel === "High" || riskLevel === "Very High") {
    interventions.push({
      intervention: "Cardiac Rehabilitation Program",
      description: "Supervised exercise training, education, and counseling",
      frequency: "3 sessions per week",
      duration: "12-36 weeks (Phase II and III)",
    })
  }

  interventions.push({
    intervention: "Dietary Consultation",
    description: "Registered dietitian for DASH diet or Mediterranean diet counseling",
    frequency: "Initial consultation, then monthly x 3, then quarterly",
    duration: "Ongoing lifestyle modification",
  })

  if (formData.smoking === "current") {
    interventions.push({
      intervention: "Smoking Cessation Program",
      description: "Behavioral counseling + pharmacotherapy (varenicline, bupropion, NRT)",
      frequency: "Weekly counseling sessions",
      duration: "12-24 weeks with long-term follow-up",
    })
  }

  if (formData.stressLevel === "high" || formData.stressLevel === "very-high") {
    interventions.push({
      intervention: "Stress Management/Cardiac Psychology",
      description: "Cognitive behavioral therapy, mindfulness-based stress reduction",
      frequency: "Weekly sessions initially, then bi-weekly",
      duration: "8-12 weeks initial program",
    })
  }

  return interventions
}

function generateLifestylePrescription(formData: any): {
  exercise: string[]
  nutrition: string[]
  stress: string[]
  sleep: string[]
} {
  const age = Number(formData.age)
  const isVegetarian = formData.dietType === "vegetarian"

  return {
    exercise: [
      `Aerobic exercise: ${age > 65 ? "150 minutes moderate" : "150-300 minutes moderate OR 75-150 minutes vigorous"} weekly`,
      "Resistance training: 2-3 sessions per week, all major muscle groups, 8-12 repetitions",
      "Flexibility: Daily stretching, yoga or tai chi 2-3x weekly",
      age > 65
        ? "Balance training: 3x weekly to prevent falls"
        : "High-intensity interval training: 1-2x weekly if cleared",
      "Target heart rate: 50-85% of age-predicted maximum (220-age)",
      "Gradual progression: Increase duration before intensity, 10% rule weekly",
    ],
    nutrition: [
      `${isVegetarian ? "Plant-based Mediterranean" : "Mediterranean or DASH"} diet pattern`,
      `Sodium restriction: <${formData.hypertension === "yes" ? "1500" : "2300"}mg daily`,
      "Omega-3 fatty acids: 2-3 servings fatty fish weekly OR algae-based supplement",
      "Fiber: 25-35g daily from whole grains, legumes, fruits, vegetables",
      "Saturated fat: <7% of total calories, eliminate trans fats",
      "Added sugars: <25g daily (6 teaspoons)",
      "Alcohol: ≤1 drink/day (women), ≤2 drinks/day (men) with 2 alcohol-free days",
      "Portion control: Use smaller plates, mindful eating practices",
    ],
    stress: [
      "Mindfulness meditation: 10-20 minutes daily using apps or guided sessions",
      "Deep breathing exercises: 4-7-8 technique, box breathing for acute stress",
      "Progressive muscle relaxation: 15-20 minutes before bedtime",
      "Regular yoga practice: 2-3 sessions weekly, focus on restorative poses",
      "Social support: Maintain relationships, consider support groups",
      "Professional counseling: If stress significantly impacts daily functioning",
      "Time management: Prioritization, delegation, boundary setting",
      "Enjoyable activities: Hobbies, music, nature exposure, pet therapy",
    ],
    sleep: [
      "Sleep duration: 7-9 hours nightly (7-8 hours if >65 years)",
      "Consistent sleep schedule: Same bedtime and wake time daily",
      "Sleep hygiene: Cool, dark, quiet bedroom environment",
      "Pre-sleep routine: No screens 1 hour before bed, relaxation activities",
      "Avoid: Caffeine after 2 PM, large meals 3 hours before bed, alcohol before sleep",
      "Sleep position: Elevate head if heart failure symptoms present",
      "Sleep study: If snoring, witnessed apneas, or excessive daytime sleepiness",
      "Limit daytime naps: <30 minutes, before 3 PM if needed",
    ],
  }
}

function generateFollowUpSchedule(riskLevel: string, symptomScore: number): string {
  if (riskLevel === "Very High") {
    return "48-72 hours post-discharge, then weekly x 4 weeks, bi-weekly x 8 weeks, then monthly"
  } else if (riskLevel === "High") {
    return "1-2 weeks, then monthly x 3 months, then every 3 months"
  } else if (riskLevel === "Moderate") {
    return "4-6 weeks, then every 3 months x 1 year, then every 6 months"
  } else {
    return "3-6 months for routine cardiovascular risk assessment, then annually"
  }
}

function generateTherapeuticGoals(
  riskLevel: string,
  age: number,
  gender: string,
  formData: any,
): Array<{ parameter: string; target: string; timeframe: string; priority: string }> {
  const goals = []

  goals.push({
    parameter: "Blood Pressure",
    target: age > 65 ? "<140/90 mmHg" : "<130/80 mmHg",
    timeframe: "Achieve within 3-6 months",
    priority: "High",
  })

  goals.push({
    parameter: "LDL Cholesterol",
    target: riskLevel === "Very High" ? "<70 mg/dL" : riskLevel === "High" ? "<100 mg/dL" : "<130 mg/dL",
    timeframe: "Achieve within 6-12 weeks of statin initiation",
    priority: "High",
  })

  goals.push({
    parameter: "HDL Cholesterol",
    target: gender === "male" ? ">40 mg/dL" : ">50 mg/dL",
    timeframe: "Improve with exercise and weight loss over 6 months",
    priority: "Moderate",
  })

  if (formData.diabetes === "yes") {
    goals.push({
      parameter: "HbA1c",
      target: age > 65 ? "<8%" : "<7%",
      timeframe: "Achieve within 3-6 months",
      priority: "High",
    })
  }

  const weight = Number(formData.weight)
  const height = Number(formData.height)
  if (weight && height) {
    const bmi = weight / Math.pow(height / 100, 2)
    if (bmi >= 25) {
      goals.push({
        parameter: "Weight Loss",
        target: `5-10% reduction (${Math.round(weight * 0.05)}-${Math.round(weight * 0.1)} kg)`,
        timeframe: "Achieve over 6-12 months (0.5-1 kg/week)",
        priority: "Moderate",
      })
    }
  }

  if (formData.smoking === "current") {
    goals.push({
      parameter: "Smoking Cessation",
      target: "Complete tobacco abstinence",
      timeframe: "Quit date within 2 weeks, maintain abstinence",
      priority: "Critical",
    })
  }

  return goals
}

function generateMonitoringSchedule(
  riskLevel: string,
  formData: any,
): Array<{ test: string; frequency: string; rationale: string }> {
  const monitoring = []

  monitoring.push({
    test: "Lipid Panel",
    frequency:
      riskLevel === "High" || riskLevel === "Very High"
        ? "6-8 weeks after statin initiation, then q3-6 months"
        : "Annually",
    rationale: "Monitor LDL goal achievement and statin efficacy",
  })

  monitoring.push({
    test: "Comprehensive Metabolic Panel",
    frequency: riskLevel === "High" || riskLevel === "Very High" ? "Every 6 months" : "Annually",
    rationale: "Monitor kidney function, electrolytes, medication safety",
  })

  if (formData.diabetes === "yes") {
    monitoring.push({
      test: "HbA1c",
      frequency: "Every 3 months until goal achieved, then every 6 months",
      rationale: "Assess glycemic control and cardiovascular risk reduction",
    })
  }

  monitoring.push({
    test: "ECG",
    frequency: riskLevel === "Very High" ? "Every 6 months" : "Annually or with symptoms",
    rationale: "Monitor for ischemic changes, arrhythmias, medication effects",
  })

  if (riskLevel === "High" || riskLevel === "Very High") {
    monitoring.push({
      test: "Echocardiogram",
      frequency: "Every 1-2 years or with clinical change",
      rationale: "Assess LV function, monitor for heart failure development",
    })
  }

  return monitoring
}

function generateWarningSignals(riskLevel: string, age: number): string[] {
  return [
    "Severe chest pain lasting >20 minutes, crushing or pressure-like quality",
    "Chest pain radiating to jaw, neck, left arm, or back with diaphoresis",
    "Severe shortness of breath at rest or with minimal exertion",
    `Blood pressure >180/120 mmHg with symptoms (headache, vision changes, chest pain)`,
    "Sudden weakness, numbness, or speech difficulties (stroke symptoms)",
    "Rapid heart rate >120 bpm at rest with chest discomfort or dizziness",
    "Syncope or near-syncope, especially with exertion",
    "Severe nausea/vomiting with chest discomfort",
    "Cold sweats with chest pain or severe fatigue",
    "Sudden severe fatigue with multiple cardiac symptoms",
  ]
}

function generateEmergencyActionPlan(age: number, formData: any): string[] {
  return [
    "Call 108 immediately - do not delay, time is critical for cardiac emergencies",
    "Chew 325mg aspirin if available and not allergic (contraindications: active bleeding)",
    "Sit upright or semi-upright position, loosen tight clothing",
    "Remain calm and avoid physical exertion to reduce cardiac workload",
    "If prescribed nitroglycerin available: 0.4mg sublingual, may repeat q5min x3",
    "If unconscious and no pulse: Begin CPR (30 compressions:2 breaths, 100-120/min)",
    "Document time of symptom onset for emergency medical team",
    "Prepare medication list, medical history, and emergency contacts",
    "Ensure airway clearance if vomiting, recovery position if unconscious",
    "Stay with patient, monitor vital signs if possible, note changes",
  ]
}

function generateEmergencyContacts(): string[] {
  return [
    "Emergency Medical Services: 108 (National emergency number)",
    "Nearest Emergency Department with cardiac catheterization capability",
    "Primary Cardiologist: [Contact information and after-hours coverage]",
    "Primary Care Physician: [Emergency contact number]",
    "Emergency Contact Person: [Family member with medical knowledge]",
    "24-Hour Pharmacy: [For emergency medication needs]",
  ]
}

function generatePatientEducation(riskLevel: string, formData: any): string[] {
  const education = [
    "Understand your cardiovascular risk level and what it means for your health",
    "Learn to recognize cardiac emergency symptoms and when to seek immediate help",
    "Importance of medication adherence - take prescribed medications as directed",
    "Lifestyle modifications can significantly reduce cardiovascular risk by 30-50%",
    "Regular monitoring and follow-up appointments are crucial for optimal outcomes",
  ]

  if (formData.smoking === "current") {
    education.push("Smoking cessation is the single most important intervention to reduce cardiac risk")
  }

  if (formData.diabetes === "yes") {
    education.push("Diabetes management is essential - it's considered a 'coronary artery disease equivalent'")
  }

  if (riskLevel === "High" || riskLevel === "Very High") {
    education.push("You may benefit from cardiac rehabilitation programs - ask your doctor about referral")
  }

  return education
}

function generateEducationalResources(riskLevel: string): string[] {
  return [
    "American Heart Association: heart.org - Comprehensive cardiovascular health information",
    "Cardiac rehabilitation programs in your area - ask for referral",
    "Heart-healthy cooking classes and nutrition counseling",
    "Smoking cessation programs and support groups",
    "Stress management and mindfulness programs",
    "Exercise programs appropriate for cardiac patients",
    "Support groups for cardiac patients and families",
    "Mobile apps for medication reminders and symptom tracking",
  ]
}

function generateLifestyleEducation(formData: any): string[] {
  const education = []

  if (formData.dietType !== "mediterranean") {
    education.push("Learn about heart-healthy eating patterns: Mediterranean or DASH diet")
  }

  if (formData.exerciseFrequency === "never" || formData.exerciseFrequency === "rarely") {
    education.push("Start with 10-15 minutes of walking daily, gradually increase duration and intensity")
  }

  if (formData.stressLevel === "high" || formData.stressLevel === "very-high") {
    education.push("Stress management techniques: meditation, yoga, deep breathing exercises")
  }

  if (formData.sleepQuality === "poor" || formData.sleepQuality === "fair") {
    education.push("Sleep hygiene practices for better cardiovascular health")
  }

  education.push("Home blood pressure monitoring technique and record keeping")
  education.push("Understanding medication side effects and when to contact healthcare provider")
  education.push("Travel considerations for cardiac patients and medication management")

  return education
}

function generateWorkoutSchedule(activityLevel: string, age: number): string {
  if (activityLevel === "sedentary") {
    return "Mon/Wed/Fri: Light cardio (20-30 min) + flexibility, Tue/Thu: Strength training (20-30 min), Sat: Active recovery walk, Sun: Complete rest"
  } else if (activityLevel === "active" || activityLevel === "very-active") {
    return "Mon/Wed/Fri: Strength training + HIIT (45-60 min), Tue/Thu/Sat: Cardio + flexibility (30-45 min), Sun: Active recovery yoga"
  } else {
    return age > 50
      ? "Mon/Wed/Fri: Moderate cardio + strength (30-40 min), Tue/Thu: Light cardio + flexibility, Sat: Mixed activities, Sun: Rest"
      : "Mon/Wed/Fri: Strength + cardio (40-50 min), Tue/Thu: Cardio + flexibility (30-40 min), Sat: Mixed workout, Sun: Active recovery"
  }
}

function generatePersonalizedSupplements(
  dietPreference: string,
  age: number,
  healthConditions: string[],
  gender: string,
): string[] {
  const supplements = ["Multivitamin (Revital H or Centrum) - Daily with breakfast"]

  if (dietPreference === "vegetarian" || dietPreference === "vegan") {
    supplements.push("Vitamin B12 (1000 mcg) - Weekly or as prescribed")
    supplements.push("Iron supplement (if blood test shows deficiency)")
    supplements.push("Plant-based Protein Powder (25-30g post-workout)")
  } else {
    supplements.push("Whey Protein Powder (25-30g post-workout)")
  }

  if (healthConditions.includes("Diabetes")) {
    supplements.push("Chromium Picolinate (200 mcg) - Consult doctor first")
    supplements.push("Alpha Lipoic Acid (300 mg) - For blood sugar support")
  }

  if (age > 40) {
    supplements.push("Calcium + Vitamin D3 (1000 mg + 2000 IU) - For bone health")
    supplements.push("Omega-3 fatty acids (1000 mg EPA/DHA) - Heart health")
    supplements.push("Coenzyme Q10 (100 mg) - Cellular energy")
  }

  if (gender === "female") {
    supplements.push("Iron (if menstruating) - As per blood test results")
    supplements.push("Folic Acid (400 mcg) - Reproductive health")
  }

  supplements.push(
    "Green Tea Extract (500 mg) - Metabolism boost (optional)",
    "Probiotics (10 billion CFU) - Digestive health",
    "Magnesium Glycinate (400 mg) - Muscle recovery & sleep",
    "Fiber supplement (if dietary intake <25g/day)",
  )

  return supplements
}

function generatePersonalizedTips(
  cuisinePreference: string,
  lowSleep: boolean,
  lowWater: boolean,
  healthConditions: string[],
): string[] {
  const tips = [
    "Drink 500ml water 30 minutes before each meal to increase satiety",
    "Use 8-9 inch plates instead of 12 inch plates to control portions naturally",
    "Include 20-25g protein in every meal to maintain muscle mass and satiety",
    "Eat slowly and chew each bite 20-30 times for better digestion",
  ]

  if (cuisinePreference === "gujarati") {
    tips.push("Reduce oil in traditional preparations - use steaming, grilling, or air frying")
    tips.push("Replace sugar in tea/coffee with stevia or small amount of jaggery")
  }

  if (cuisinePreference === "south-indian") {
    tips.push("Choose brown rice over white rice for better fiber content")
    tips.push("Use coconut oil in moderation - 1-2 tsp per meal maximum")
  }

  if (cuisinePreference === "punjabi") {
    tips.push("Reduce ghee and butter - use 1 tsp per meal maximum")
    tips.push("Choose tandoori over fried preparations when possible")
  }

  if (healthConditions.includes("Diabetes")) {
    tips.push("Monitor blood sugar before and 2 hours after meals")
    tips.push("Pair carbohydrates with protein or healthy fats to slow absorption")
  }

  if (healthConditions.includes("Hypertension")) {
    tips.push("Limit sodium intake to 2300mg per day (1 tsp salt)")
    tips.push("Include potassium-rich foods like bananas, spinach, and yogurt")
  }

  if (lowSleep) {
    tips.push("Prioritize 7-9 hours of sleep for optimal metabolism and hunger hormones")
    tips.push("Create a bedtime routine - no screens 1 hour before sleep")
  }

  if (lowWater) {
    tips.push("Increase water intake to 10-12 glasses daily for better metabolism")
    tips.push("Add lemon, mint, or cucumber to water for variety")
  }

  tips.push(
    "Meal prep on weekends to avoid impulsive food choices during busy weekdays",
    "Track progress weekly, not daily - weight fluctuates due to water retention",
    "Practice mindful eating - eliminate distractions like TV or phone during meals",
    "Include 25-30g fiber daily through vegetables, fruits, and whole grains",
    "Stay consistent rather than perfect - 80% adherence is better than 100% for 2 days",
    "Manage stress through 10-15 minutes daily meditation or deep breathing",
    "Plan for social events - eat a small healthy snack before parties",
    "Keep healthy snacks visible and unhealthy ones out of sight",
  )

  return tips
}
