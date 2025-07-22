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

  // Calculate dynamic risk score
  let riskScore = 0
  const ageNum = Number(age)

  // Age-based risk
  if (ageNum > 65) riskScore += 3
  else if (ageNum > 55) riskScore += 2
  else if (ageNum > 45) riskScore += 1

  // Gender risk
  if (gender === "male") riskScore += 1

  // Symptom-based risk
  if (chestPain === "frequent") riskScore += 3
  else if (chestPain === "occasional") riskScore += 1

  if (breathlessness === "severe") riskScore += 3
  else if (breathlessness === "moderate") riskScore += 2
  else if (breathlessness === "mild") riskScore += 1

  if (palpitations === "frequent") riskScore += 2
  if (fatigue === "severe") riskScore += 2
  if (swelling === "yes") riskScore += 2
  if (dizziness === "frequent") riskScore += 1

  // Risk factor scoring
  if (smoking === "current") riskScore += 3
  else if (smoking === "former") riskScore += 1

  if (familyHistory === "yes") riskScore += 2
  if (diabetes === "yes") riskScore += 2
  if (hypertension === "yes") riskScore += 2
  if (cholesterol === "high") riskScore += 2

  // Lifestyle factors
  if (exerciseFrequency === "never") riskScore += 2
  else if (exerciseFrequency === "rarely") riskScore += 1

  if (stressLevel === "high") riskScore += 2
  else if (stressLevel === "moderate") riskScore += 1

  // Determine risk level
  let riskLevel, riskCategory
  if (riskScore <= 5) {
    riskLevel = "Low"
    riskCategory = "Good heart health with minimal risk factors"
  } else if (riskScore <= 10) {
    riskLevel = "Moderate"
    riskCategory = "Some cardiovascular risk factors present"
  } else if (riskScore <= 15) {
    riskLevel = "High"
    riskCategory = "Multiple risk factors requiring intervention"
  } else {
    riskLevel = "Very High"
    riskCategory = "Immediate medical attention and aggressive management needed"
  }

  // Generate personalized recommendations based on user data
  const isHighRisk = riskScore > 15
  const isModerateRisk = riskScore > 10
  const isMale = gender === "male"
  const hasDiabetes = diabetes === "yes"
  const hasHypertension = hypertension === "yes"
  const isSmoker = smoking === "current"
  const isVegetarian = dietType === "vegetarian"
  const isOlder = ageNum > 65
  const hasSymptoms = chestPain !== "none" || breathlessness !== "none" || palpitations !== "none"

  // Calculate BMI if available
  let bmi = null
  if (weight && height) {
    bmi = (Number(weight) / Math.pow(Number(height) / 100, 2)).toFixed(1)
  }

  const assessment = {
    riskScore: {
      total: riskScore,
      level: riskLevel,
      category: riskCategory,
    },
    recommendations: {
      immediate: generateImmediateRecommendations(isHighRisk, isModerateRisk, hasSymptoms, ageNum),
      lifestyle: generateLifestyleRecommendations(isSmoker, isMale, hasHypertension, hasDiabetes, bmi),
      dietary: generateDietaryRecommendations(isVegetarian, hasHypertension, hasDiabetes, cholesterol),
      exercise: generateExerciseRecommendations(ageNum, isHighRisk, exerciseFrequency, hasSymptoms),
      monitoring: generateMonitoringRecommendations(hasHypertension, hasDiabetes, isHighRisk, medications),
    },
    tests: {
      essential: generateEssentialTests(isHighRisk, hasDiabetes, ageNum),
      additional: generateAdditionalTests(isModerateRisk, isHighRisk, ageNum, hasSymptoms),
    },
    emergencyPlan: {
      warningSignals: generateWarningSignals(ageNum, hasHypertension),
      firstAid: generateFirstAidSteps(ageNum),
      contacts: generateEmergencyContacts(),
    },
    followUp: {
      schedule: generateFollowUpSchedule(isHighRisk, isModerateRisk),
      goals: generateHealthGoals(isHighRisk, isMale, ageNum, hasDiabetes, hasHypertension, bmi),
      tracking: generateTrackingRecommendations(hasHypertension, hasDiabetes, isHighRisk),
    },
    medications: {
      current: medications ? medications.split(",").map((med: string) => med.trim()) : [],
      recommended: generateMedicationRecommendations(isHighRisk, hasHypertension, hasDiabetes, ageNum, isMale),
    },
    lifestyle: {
      diet: generateAdvancedDietPlan(isVegetarian, hasHypertension, hasDiabetes),
      exercise: generateExercisePlan(ageNum, isHighRisk, exerciseFrequency),
      stress: generateStressManagement(ageNum, stressLevel),
    },
    supplements: generateSupplementRecommendations(ageNum, gender, isVegetarian, hasDiabetes, hasHypertension),
    note: "AI-Generated Personalized Cardiac Assessment - Based on current medical evidence and guidelines",
  }

  return NextResponse.json(assessment)
}

// Helper functions for generating personalized recommendations
function generateImmediateRecommendations(
  isHighRisk: boolean,
  isModerateRisk: boolean,
  hasSymptoms: boolean,
  age: number,
) {
  if (isHighRisk) {
    return [
      "URGENT: Schedule cardiology consultation within 24-48 hours for comprehensive evaluation",
      "Monitor blood pressure 3x daily with automatic cuff, maintain detailed log",
      "Restrict physical activity to light daily activities until medical clearance obtained",
      "Keep prescribed emergency medications (nitroglycerin) readily accessible at all times",
      "Seek immediate emergency care if chest pain persists >15 minutes or worsens",
      "Arrange urgent diagnostic testing: ECG, echocardiogram, cardiac biomarkers, chest X-ray",
    ]
  } else if (isModerateRisk) {
    return [
      "Schedule cardiology consultation within 1-2 weeks for risk stratification and management",
      "Begin daily vital signs monitoring: blood pressure, heart rate, weight at consistent times",
      "Start medically supervised exercise program or cardiac rehabilitation if available",
      "Comprehensive medication review with cardiologist or clinical pharmacist",
      "Implement evidence-based DASH diet with registered dietitian consultation",
      "Consider stress testing evaluation to assess for exercise-induced ischemia",
    ]
  } else {
    return [
      "Continue annual preventive cardiology screening with comprehensive risk assessment",
      "Maintain current healthy lifestyle habits with periodic medical review",
      "Monitor for new cardiac symptoms: chest pain, shortness of breath, palpitations",
      "Annual laboratory screening: lipid panel, glucose, inflammatory markers",
      "Optimize modifiable cardiovascular risk factors through lifestyle medicine",
      age > 50
        ? "Consider coronary calcium scoring for refined risk assessment"
        : "Focus on primary prevention strategies",
    ]
  }
}

function generateLifestyleRecommendations(
  isSmoker: boolean,
  isMale: boolean,
  hasHypertension: boolean,
  hasDiabetes: boolean,
  bmi: string | null,
) {
  const recommendations = []

  if (isSmoker) {
    recommendations.push(
      "CRITICAL PRIORITY: Complete smoking cessation immediately - reduces cardiovascular risk by 50% within 1 year",
    )
  } else {
    recommendations.push("Maintain tobacco-free status - avoid secondhand smoke exposure in all environments")
  }

  recommendations.push(
    `Alcohol moderation: ${isMale ? "≤2 standard drinks/day" : "≤1 standard drink/day"} with 2 alcohol-free days weekly`,
  )

  if (bmi && Number(bmi) > 25) {
    recommendations.push(
      `Weight management: Target BMI 18.5-24.9 kg/m² (current: ${bmi}) - aim for 5-10% weight reduction`,
    )
  } else {
    recommendations.push("Maintain healthy weight within BMI range 18.5-24.9 kg/m²")
  }

  recommendations.push(
    "Sleep optimization: 7-9 hours nightly with consistent sleep-wake cycle, screen sleep apnea if indicated",
    "Stress management: evidence-based techniques including mindfulness meditation, progressive muscle relaxation",
    "Optimal hydration: 8-10 glasses water daily, limit caffeine <400mg, avoid energy drinks completely",
    "Social connections: maintain strong support network, consider joining cardiac support groups",
    hasHypertension || hasDiabetes
      ? "Strict medical adherence: consistent follow-up appointments and medication compliance"
      : "Regular preventive medical care with annual comprehensive examinations",
  )

  return recommendations
}

function generateDietaryRecommendations(
  isVegetarian: boolean,
  hasHypertension: boolean,
  hasDiabetes: boolean,
  cholesterol: string,
) {
  const recommendations = [
    `DASH Diet Protocol: <${hasHypertension ? "1500" : "2300"}mg sodium daily, emphasize potassium-rich foods (3500-4700mg daily)`,
    isVegetarian
      ? "Plant-based omega-3: algae-based EPA/DHA 1-2g daily, walnuts, flaxseeds, chia seeds"
      : "Omega-3 fatty acids: 2-3 servings fatty fish weekly (salmon, mackerel, sardines) plus 1g EPA/DHA supplement",
    "Soluble fiber optimization: 25-35g daily from oats, beans, lentils, vegetables, fruits - reduces LDL 5-10%",
    "Antioxidant-rich foods: berries, dark leafy greens, nuts, seeds - combat oxidative stress and inflammation",
    "Healthy fats: limit saturated fat <7% total calories, eliminate trans fats, emphasize monounsaturated fats",
    "Plant sterols/stanols: 2g daily from fortified foods or supplements - additional 6-15% LDL reduction",
  ]

  if (hasDiabetes) {
    recommendations.push("Carbohydrate management: choose low glycemic index foods, pair carbs with protein/fiber")
  }

  if (cholesterol === "high") {
    recommendations.push("Cholesterol-lowering foods: oats, barley, beans, eggplant, okra, apples, grapes, citrus")
  }

  recommendations.push(
    "Potassium-rich foods: bananas, oranges, spinach, potatoes, tomatoes, yogurt - supports healthy blood pressure",
    "Magnesium sources: nuts, seeds, whole grains, dark chocolate - essential for cardiovascular health",
    "Minimize processed foods: choose whole, unprocessed foods, read nutrition labels carefully",
    isVegetarian
      ? "Plant-based protein optimization: legumes, quinoa, nuts, seeds - ensure complete amino acid profile"
      : "Mediterranean diet pattern: olive oil as primary fat, moderate fish consumption, abundant vegetables",
  )

  return recommendations
}

function generateExerciseRecommendations(
  age: number,
  isHighRisk: boolean,
  exerciseFrequency: string,
  hasSymptoms: boolean,
) {
  const recommendations = []

  if (isHighRisk || hasSymptoms) {
    recommendations.push("Medical clearance required: obtain physician approval before starting any exercise program")
  }

  recommendations.push(
    `Aerobic exercise: ${age > 65 ? "120-150" : "150-300"} minutes moderate OR ${age > 65 ? "60-75" : "75-150"} minutes vigorous weekly`,
    "Resistance training: 2-3 sessions weekly, major muscle groups, 8-12 repetitions with progressive overload",
    "Flexibility training: daily stretching routine, yoga or tai chi 2-3 sessions weekly for mobility",
    `Target heart rate: ${Math.round((220 - age) * 0.5)}-${Math.round((220 - age) * 0.85)} bpm during moderate exercise`,
  )

  if (exerciseFrequency === "never" || exerciseFrequency === "rarely") {
    recommendations.push(
      `Gradual progression: start with ${age > 60 ? "5-10" : "10-15"} minutes daily, increase duration before intensity`,
    )
  }

  recommendations.push(
    "Low-impact options: swimming, cycling, elliptical, water aerobics - ideal for joint protection",
    "Exercise monitoring: maintain conversational pace during moderate exercise, use perceived exertion scale",
    "Recovery protocol: 5-10 minutes cool-down with stretching, adequate rest between training sessions",
  )

  return recommendations
}

function generateMonitoringRecommendations(
  hasHypertension: boolean,
  hasDiabetes: boolean,
  isHighRisk: boolean,
  medications: string,
) {
  return [
    `Blood pressure monitoring: ${hasHypertension ? "daily morning and evening" : "weekly"} home readings with validated device`,
    "Weight tracking: daily morning measurements after voiding, before eating, track weekly trends",
    "Resting heart rate: measure upon waking before getting out of bed, note irregularities or changes",
    "Symptom diary: document chest pain, shortness of breath, fatigue, palpitations with triggers and timing",
    "Exercise tolerance: monitor distance, duration, perceived exertion, recovery time improvements",
    "Sleep quality assessment: duration, interruptions, daytime fatigue, snoring patterns, sleep apnea screening",
    medications
      ? "Medication adherence: strict timing, side effects monitoring, effectiveness tracking"
      : "Supplement compliance: timing, interactions, effectiveness monitoring",
    hasDiabetes
      ? "Blood glucose monitoring: as prescribed by physician, pre/post meal readings"
      : "Dietary compliance: sodium intake estimation, portion control, meal timing consistency",
  ]
}

function generateEssentialTests(isHighRisk: boolean, hasDiabetes: boolean, age: number) {
  return [
    {
      name: "12-Lead ECG with Computer Interpretation",
      cost: "₹300-600",
      description: "Baseline cardiac rhythm, conduction system evaluation, ischemic changes, arrhythmia detection",
      frequency: isHighRisk ? "Every 6 months" : "Annually or with new symptoms",
    },
    {
      name: "2D Echocardiogram with Doppler Studies",
      cost: "₹2,500-5,000",
      description: "Left ventricular function assessment, valve evaluation, wall motion analysis, diastolic function",
      frequency: isHighRisk ? "Every 12-18 months" : "Every 2-3 years or as clinically indicated",
    },
    {
      name: "Comprehensive Lipid Profile",
      cost: "₹500-1,000",
      description: "Total cholesterol, LDL-C, HDL-C, triglycerides, non-HDL cholesterol, calculated ratios",
      frequency: isHighRisk ? "Every 3-6 months" : "Every 6-12 months with treatment monitoring",
    },
    {
      name: "Glycemic Assessment (HbA1c + Fasting Glucose)",
      cost: "₹400-700",
      description: "Diabetes screening, glycemic control evaluation, cardiovascular risk stratification",
      frequency: hasDiabetes ? "Every 3 months" : "Every 6-12 months for screening",
    },
    {
      name: "High-sensitivity C-Reactive Protein",
      cost: "₹600-1,000",
      description: "Inflammatory biomarker for cardiovascular risk assessment, plaque instability evaluation",
      frequency: "Annually or with cardiovascular risk reassessment",
    },
    {
      name: "Comprehensive Metabolic Panel",
      cost: "₹500-800",
      description:
        "Kidney function (creatinine, eGFR), electrolyte balance, liver function, medication safety monitoring",
      frequency: isHighRisk ? "Every 6 months" : "Annually with medication monitoring",
    },
  ]
}

function generateAdditionalTests(isModerateRisk: boolean, isHighRisk: boolean, age: number, hasSymptoms: boolean) {
  return [
    {
      name: "Exercise Stress Test (Treadmill/Bicycle)",
      cost: "₹3,000-6,000",
      description:
        "Exercise-induced ischemia detection, functional capacity assessment, exercise prescription guidance",
      frequency: isModerateRisk ? "Every 2-3 years" : "If symptomatic or abnormal resting ECG",
    },
    {
      name: "Coronary CT Angiography (CCTA)",
      cost: "₹10,000-18,000",
      description: "Non-invasive coronary anatomy visualization, plaque characterization, stenosis quantification",
      frequency: "Intermediate risk patients or inconclusive stress testing results",
    },
    {
      name: "Invasive Coronary Angiography",
      cost: "₹25,000-50,000",
      description: "Gold standard coronary anatomy assessment, hemodynamic evaluation, intervention planning",
      frequency: "Abnormal non-invasive testing or acute coronary syndrome presentation",
    },
    {
      name: "24-48 Hour Holter Monitoring",
      cost: "₹2,500-5,000",
      description: "Continuous cardiac rhythm monitoring, arrhythmia detection, heart rate variability analysis",
      frequency: hasSymptoms
        ? "If palpitations or syncope reported"
        : "If clinically indicated for arrhythmia screening",
    },
    {
      name: "Carotid Duplex Ultrasound",
      cost: "₹2,000-4,000",
      description: "Carotid artery stenosis assessment, stroke risk evaluation, peripheral atherosclerosis screening",
      frequency: age > 65 || isHighRisk ? "Every 2-3 years" : "If multiple cardiovascular risk factors present",
    },
    {
      name: "Coronary Artery Calcium Score",
      cost: "₹3,000-6,000",
      description:
        "Subclinical atherosclerosis quantification, cardiovascular risk reclassification, treatment intensity guidance",
      frequency: "Once for intermediate-risk patients aged 40-75 for risk stratification",
    },
  ]
}

function generateWarningSignals(age: number, hasHypertension: boolean) {
  return [
    "Severe crushing chest pain lasting >20 minutes, not relieved by rest or prescribed nitroglycerin",
    "Chest pain radiating to jaw, left arm, back, or epigastrium accompanied by diaphoresis",
    "Severe shortness of breath at rest or with minimal exertion, inability to lie flat (orthopnea)",
    `Hypertensive crisis: blood pressure >${age > 65 ? "180" : "160"}/${age > 65 ? "110" : "100"} mmHg with neurological symptoms`,
    "Sudden onset weakness, numbness, speech difficulties, or facial drooping (stroke symptoms)",
    "Rapid irregular heartbeat >120 bpm at rest with chest discomfort, dizziness, or near-syncope",
    "Syncope or near-syncope episodes, especially with exertion or sudden position changes",
    "Severe nausea and vomiting associated with chest discomfort or upper abdominal pain",
    "Profuse cold sweats (diaphoresis) with chest pain or unexplained severe fatigue",
    "Sudden onset severe fatigue with multiple associated cardiovascular symptoms",
  ]
}

function generateFirstAidSteps(age: number) {
  return [
    "Call 108 immediately - do not delay transport, time-sensitive cardiac emergency",
    "Chew 325mg aspirin if not allergic (contraindications: active bleeding, severe asthma, allergy)",
    "Position patient upright or semi-upright, loosen restrictive clothing around neck and chest",
    "Remain calm and still, avoid all physical exertion to minimize cardiac oxygen demand",
    "If unconscious with no pulse: begin high-quality CPR (30 chest compressions:2 rescue breaths, rate 100-120/min)",
    "Administer prescribed nitroglycerin if available (0.4mg sublingual, may repeat every 5 minutes x3)",
    "Document exact time of symptom onset and progression for emergency medical team",
    "Prepare complete medication list, medical history, emergency contacts, and insurance information",
    "Ensure clear airway if vomiting occurs, place in recovery position if unconscious but breathing",
    "Monitor and document vital signs if equipment available, note any changes for medical team",
  ]
}

function generateEmergencyContacts() {
  return [
    "National Emergency Medical Services: 108 (24/7 ambulance with advanced cardiac life support)",
    "Nearest Cardiac Emergency Center: [Local hospital with 24/7 catheterization laboratory capabilities]",
    "Primary Cardiologist: [Your cardiologist's emergency contact number and backup coverage]",
    "Family Physician: [Your primary care doctor's after-hours emergency consultation line]",
    "Emergency Contact Person: [Family member with medical knowledge, transportation, and key access]",
    "24-Hour Cardiac Pharmacy: [For emergency medication refills and cardiac drug interactions]",
  ]
}

function generateFollowUpSchedule(isHighRisk: boolean, isModerateRisk: boolean) {
  if (isHighRisk) {
    return "Weekly cardiology visits x 4 weeks, then bi-weekly x 8 weeks, then monthly with ongoing specialist care"
  } else if (isModerateRisk) {
    return "Bi-weekly physician visits x 6 weeks, then monthly x 6 months, then quarterly with annual specialist review"
  } else {
    return "Every 3-6 months for routine cardiovascular risk assessment, annual comprehensive evaluation"
  }
}

function generateHealthGoals(
  isHighRisk: boolean,
  isMale: boolean,
  age: number,
  hasDiabetes: boolean,
  hasHypertension: boolean,
  bmi: string | null,
) {
  const goals = [
    `Blood Pressure Target: <${age > 65 ? "140" : "130"}/${age > 65 ? "90" : "80"} mmHg (individualized based on comorbidities and tolerance)`,
    `LDL Cholesterol Goal: <${isHighRisk ? "70" : "100"} mg/dL (or achieve 50% reduction from baseline if higher target appropriate)`,
    `HDL Cholesterol Target: >${isMale ? "40" : "50"} mg/dL, optimize through regular exercise and healthy dietary fats`,
    "Triglycerides Goal: <150 mg/dL (ideally <100 mg/dL for optimal cardiovascular health)",
  ]

  if (hasDiabetes) {
    goals.push("HbA1c Target: <7% (individualized 6.5-8% based on age, comorbidities, and hypoglycemia risk)")
  } else {
    goals.push("HbA1c Maintenance: <5.7% to prevent progression to diabetes")
  }

  if (bmi && Number(bmi) > 25) {
    goals.push(`Weight Management: BMI 18.5-24.9 kg/m² or achieve 5-10% weight reduction from current ${bmi}`)
  } else {
    goals.push("Weight Maintenance: BMI 18.5-24.9 kg/m² with stable body composition")
  }

  goals.push(
    `Exercise Capacity: ${age > 65 ? "120-150" : "150-300"} minutes moderate aerobic activity weekly with strength training`,
    "Smoking Status: 100% tobacco-free with ongoing cessation support and relapse prevention",
    "Medication Adherence: >95% compliance rate with therapeutic drug monitoring and side effect management",
    "Stress Management: Daily evidence-based relaxation practice with anxiety and depression screening",
  )

  return goals
}

function generateTrackingRecommendations(hasHypertension: boolean, hasDiabetes: boolean, isHighRisk: boolean) {
  return [
    `Daily Monitoring: Blood pressure ${hasHypertension ? "(morning and evening)" : "(weekly)"}, weight, symptoms, medication adherence`,
    "Weekly Assessments: Exercise duration and intensity, dietary sodium intake, sleep quality scores, stress levels",
    "Monthly Evaluations: Physician visits, medication effectiveness and side effects, laboratory result review",
    "Quarterly Reviews: Comprehensive cardiovascular risk reassessment, treatment goal achievement, therapy modifications",
    "Annual Evaluations: Complete cardiac evaluation, risk stratification updates, preventive care screening",
    "Ongoing Documentation: Detailed symptom diary, emergency action plan familiarity, lifestyle modification progress tracking",
  ]
}

function generateMedicationRecommendations(
  isHighRisk: boolean,
  hasHypertension: boolean,
  hasDiabetes: boolean,
  age: number,
  isMale: boolean,
) {
  const medications = [
    {
      name: `ACE Inhibitors (${age > 65 ? "Lisinopril 5-20mg" : "Lisinopril 10-40mg"} daily)`,
      purpose:
        "Reduce cardiac afterload, prevent ventricular remodeling, provide nephroprotection, proven mortality benefit",
      cost: "₹60-250/month",
    },
    {
      name: `Beta-blockers (${isMale ? "Metoprolol 50-200mg" : "Metoprolol 25-100mg"} daily, divided doses)`,
      purpose: "Reduce heart rate and blood pressure, provide anti-ischemic effects, post-MI mortality reduction",
      cost: "₹50-200/month",
    },
    {
      name: `Statins (${isHighRisk ? "Atorvastatin 40-80mg" : "Atorvastatin 20-40mg"} daily at bedtime)`,
      purpose:
        "LDL cholesterol reduction, plaque stabilization, anti-inflammatory effects, cardiovascular event prevention",
      cost: "₹120-600/month",
    },
    {
      name: `Aspirin (${age > 70 ? "75mg" : "81-100mg"} daily with food)`,
      purpose:
        "Primary/secondary prevention antiplatelet therapy, thrombosis prevention, cardiovascular event reduction",
      cost: "₹25-60/month",
    },
  ]

  if (isHighRisk) {
    medications.push({
      name: "Clopidogrel (75mg daily)",
      purpose:
        "Dual antiplatelet therapy for high-risk patients, P2Y12 receptor inhibition, enhanced thrombosis prevention",
      cost: "₹180-500/month",
    })
  }

  if (hasHypertension) {
    medications.push({
      name: `Calcium Channel Blockers (Amlodipine ${age > 65 ? "2.5-5mg" : "5-10mg"} daily)`,
      purpose: "Arterial vasodilation, blood pressure control, anti-anginal effects, stroke prevention",
      cost: "₹80-300/month",
    })
  }

  if (hasDiabetes) {
    medications.push({
      name: "SGLT2 Inhibitors (Empagliflozin 10-25mg daily)",
      purpose: "Glucose control with cardiovascular benefits, heart failure risk reduction, renal protection",
      cost: "₹300-800/month",
    })
  }

  return medications
}

function generateAdvancedDietPlan(isVegetarian: boolean, hasHypertension: boolean, hasDiabetes: boolean) {
  const dietPlan = [
    `${isVegetarian ? "Plant-based Mediterranean" : "Traditional Mediterranean"} diet: olive oil, nuts, legumes, whole grains, abundant vegetables`,
    `DASH Protocol: <${hasHypertension ? "1500" : "2300"}mg sodium daily, high potassium (3500-4700mg), minimal processed foods`,
    "Soluble fiber optimization: 25-35g daily (10-25g soluble fiber) - naturally reduces LDL cholesterol 5-10%",
    isVegetarian
      ? "Plant-based omega-3: algae-based EPA/DHA 1-2g daily, walnuts, flaxseeds, chia seeds, hemp hearts"
      : "Marine omega-3: fatty fish 2-3x weekly (salmon, mackerel, sardines) plus 1g EPA/DHA supplement daily",
    "Plant sterols/stanols: 2g daily from fortified foods or supplements - provides additional 6-15% LDL reduction",
    "Antioxidant optimization: vitamin C (citrus, berries), vitamin E (nuts, seeds), polyphenols (colorful produce)",
  ]

  if (hasDiabetes) {
    dietPlan.push("Glycemic control: low glycemic index foods, carbohydrate counting, consistent meal timing")
  }

  dietPlan.push(
    "Refined carbohydrate limitation: <25g added sugars daily, choose complex carbohydrates with fiber",
    "Portion control strategies: smaller plates, mindful eating practices, hunger and satiety awareness training",
  )

  return dietPlan
}

function generateExercisePlan(age: number, isHighRisk: boolean, exerciseFrequency: string) {
  const exercisePlan = [
    `Aerobic foundation: ${age > 65 ? "30-40" : "30-60"} minutes moderate intensity, 5 days weekly (walking, swimming, cycling)`,
    "Resistance training: 2-3 sessions weekly, 8-12 repetitions, progressive overload principle, all major muscle groups",
    "Flexibility and mobility: daily 10-15 minute stretching routine, yoga or tai chi 2-3 sessions weekly",
  ]

  if (isHighRisk) {
    exercisePlan.push(
      "Supervised cardiac rehabilitation: medically monitored exercise program with ECG telemetry if available",
    )
  } else {
    exercisePlan.push(
      "High-intensity interval training: 1-2 sessions weekly if medically cleared and exercise-experienced",
    )
  }

  exercisePlan.push(
    "Functional activities: gardening, dancing, recreational sports, stair climbing, active household tasks",
    "Exercise progression: increase duration before intensity, follow 10% weekly increase rule, listen to body signals",
    "Recovery optimization: 1-2 complete rest days weekly, adequate sleep, proper hydration and nutrition",
    "Activity monitoring: heart rate zones, perceived exertion scales, symptom awareness during and after exercise",
  )

  return exercisePlan
}

function generateStressManagement(age: number, stressLevel: string) {
  const stressManagement = [
    "Mindfulness meditation: 10-20 minutes daily practice, use apps like Headspace, Calm, or Insight Timer",
    "Deep breathing techniques: 4-7-8 breathing, box breathing, diaphragmatic breathing for acute stress episodes",
    "Progressive muscle relaxation: systematic tension-release cycles, guided body scan meditation",
    `Yoga practice: ${age > 65 ? "gentle hatha, chair yoga, or restorative styles" : "hatha, vinyasa, or power yoga"} 2-3x weekly`,
  ]

  if (stressLevel === "high" || stressLevel === "very-high") {
    stressManagement.push(
      "Professional mental health support: counseling, cognitive behavioral therapy for anxiety and depression",
    )
  }

  stressManagement.push(
    "Social support optimization: maintain relationships, join cardiac support groups, involve family in health journey",
    "Time management skills: prioritization techniques, delegation strategies, boundary setting, work-life balance",
    "Enjoyable activities: hobbies, music therapy, reading, nature exposure, laughter therapy, pet companionship",
  )

  return stressManagement
}

function generateSupplementRecommendations(
  age: number,
  gender: string,
  isVegetarian: boolean,
  hasDiabetes: boolean,
  hasHypertension: boolean,
) {
  const supplements = [
    {
      name: "Omega-3 Fatty Acids (EPA/DHA)",
      dosage: isVegetarian ? "1-2g daily (algae-based)" : "1-2g daily (fish oil)",
      purpose: "Reduce triglycerides, anti-inflammatory effects, cardiovascular protection",
      cost: "₹200-600/month",
    },
    {
      name: "Coenzyme Q10 (Ubiquinol preferred)",
      dosage: "100-200mg daily with meals",
      purpose: "Mitochondrial support, statin-induced myopathy prevention, heart failure support",
      cost: "₹300-800/month",
    },
    {
      name: "Magnesium Glycinate",
      dosage: "400-600mg daily (divided doses)",
      purpose: "Blood pressure reduction, arrhythmia prevention, muscle relaxation, sleep quality",
      cost: "₹150-400/month",
    },
    {
      name: "Vitamin D3",
      dosage: "2000-4000 IU daily (adjust based on blood levels)",
      purpose: "Cardiovascular protection, immune support, bone health, mood regulation",
      cost: "₹100-300/month",
    },
    {
      name: "Vitamin K2 (MK-7 form)",
      dosage: "100-200mcg daily",
      purpose: "Arterial calcification prevention, bone health, works synergistically with Vitamin D",
      cost: "₹200-500/month",
    },
  ]

  if (hasDiabetes) {
    supplements.push({
      name: "Berberine",
      dosage: "500mg twice daily with meals",
      purpose: "Glucose control, lipid management, insulin sensitivity improvement",
      cost: "₹250-600/month",
    })
  }

  if (hasHypertension) {
    supplements.push({
      name: "Hawthorn Extract",
      dosage: "300-600mg daily (standardized extract)",
      purpose: "Heart failure support, blood pressure reduction, improved circulation",
      cost: "₹200-500/month",
    })
  }

  supplements.push(
    {
      name: "Garlic Extract (Aged)",
      dosage: "600-1200mg daily (allicin-standardized)",
      purpose: "Blood pressure reduction, cholesterol management, immune support",
      cost: "₹150-400/month",
    },
    {
      name: "Taurine",
      dosage: "1-3g daily (divided doses)",
      purpose: "Heart rhythm support, blood pressure regulation, exercise performance",
      cost: "₹200-500/month",
    },
  )

  if (isVegetarian) {
    supplements.push({
      name: "Vitamin B12 (Methylcobalamin)",
      dosage: "1000mcg daily or 2500mcg weekly",
      purpose: "Prevent deficiency, support cardiovascular health, neurological function",
      cost: "₹100-300/month",
    })
  }

  if (gender === "female" && age < 50) {
    supplements.push({
      name: "Iron (if deficient)",
      dosage: "18-25mg daily with Vitamin C",
      purpose: "Prevent iron deficiency anemia, support cardiovascular health",
      cost: "₹100-250/month",
    })
  }

  return supplements
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
