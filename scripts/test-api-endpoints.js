// Node.js script to test API endpoints programmatically
import fetch from "node-fetch"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

const testCases = [
  {
    name: "AI Safety Monitor - Normal Case",
    endpoint: "/api/ai-safety-monitor",
    method: "POST",
    payload: {
      aiResponse: "You should rest and drink plenty of fluids for your cold symptoms.",
      userInput: "I have a runny nose and mild cough",
      context: "symptom assessment",
      responseType: "lifestyle",
      userProfile: {
        age: 30,
        gender: "male",
        medicalHistory: [],
        currentMedications: [],
      },
    },
  },
  {
    name: "AI Safety Monitor - Emergency Case",
    endpoint: "/api/ai-safety-monitor",
    method: "POST",
    payload: {
      aiResponse: "This could be a heart attack. Seek immediate medical attention.",
      userInput: "I have severe chest pain and difficulty breathing",
      context: "emergency assessment",
      responseType: "emergency",
      userProfile: {
        age: 55,
        gender: "male",
        medicalHistory: ["hypertension"],
        currentMedications: ["lisinopril"],
      },
    },
  },
  {
    name: "AI Accuracy Enhancement - Get Metrics",
    endpoint: "/api/ai-accuracy-enhancement?type=metrics",
    method: "GET",
  },
  {
    name: "AI Accuracy Enhancement - Submit Feedback",
    endpoint: "/api/ai-accuracy-enhancement",
    method: "POST",
    payload: {
      action: "submit_feedback",
      feedback: {
        recommendationId: "test_recommendation_123",
        userFeedback: "accurate",
        actualOutcome: "Patient recovered as expected",
        userProfile: {
          age: 35,
          gender: "female",
          location: "Mumbai, Maharashtra",
          medicalHistory: [],
        },
        timestamp: new Date().toISOString(),
      },
    },
  },
  {
    name: "AI Form Helper - Explain Term",
    endpoint: "/api/ai-form-helper",
    method: "POST",
    payload: {
      type: "explain_term",
      data: {
        term: "hypertension",
        userProfile: {
          age: 45,
          gender: "male",
          location: "Delhi, India",
          diet: "vegetarian",
          familyType: "joint",
          economicStatus: "middle",
          language: "english",
        },
      },
    },
  },
  {
    name: "AI Form Helper - Process Voice",
    endpoint: "/api/ai-form-helper",
    method: "POST",
    payload: {
      type: "process_voice",
      data: {
        voiceInput: "I have been having severe headache for the past three days with nausea",
        language: "english",
      },
    },
  },
  {
    name: "Gemini Health - Health Query",
    endpoint: "/api/gemini-health",
    method: "POST",
    payload: {
      symptoms: ["headache", "nausea"],
      duration: "2 days",
      severity: 6,
      age: 28,
      gender: "female",
      medicalHistory: [],
      currentMedications: [],
      location: "Bangalore, India",
    },
  },
  {
    name: "Gemini Health - Get Health Tips",
    endpoint: "/api/gemini-health?action=health_tips",
    method: "GET",
  },
  {
    name: "Gemini Integration - Health Chat",
    endpoint: "/api/gemini-integration",
    method: "POST",
    payload: {
      messages: [
        {
          role: "user",
          content: "I have been experiencing headaches and fatigue lately. What could be causing this?",
          timestamp: new Date().toISOString(),
        },
      ],
      context: {
        userProfile: {
          age: 32,
          gender: "male",
          location: "Chennai, India",
          medicalHistory: [],
          currentMedications: [],
        },
        sessionId: "test_session_123",
        language: "english",
      },
    },
  },
  {
    name: "Health Assessment - Complete Assessment",
    endpoint: "/api/health-assessment",
    method: "POST",
    payload: {
      personalInfo: {
        age: 35,
        gender: "female",
        height: 165,
        weight: 60,
        location: "Mumbai, Maharashtra",
      },
      symptoms: {
        primary: ["headache", "fatigue"],
        secondary: ["nausea"],
        duration: "1 week",
        severity: 5,
        bodyParts: ["head"],
      },
      medicalHistory: {
        conditions: [],
        surgeries: [],
        allergies: ["peanuts"],
        familyHistory: ["diabetes"],
      },
      lifestyle: {
        smoking: false,
        alcohol: false,
        exercise: "moderate",
        diet: "good",
        sleep: 7,
        stress: 4,
      },
      currentMedications: [],
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 98.6,
      },
    },
  },
]

async function runTest(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`)
  console.log(`📍 ${testCase.method} ${testCase.endpoint}`)

  const startTime = Date.now()

  try {
    const options = {
      method: testCase.method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (testCase.method === "POST" && testCase.payload) {
      options.body = JSON.stringify(testCase.payload)
    }

    const response = await fetch(`${BASE_URL}${testCase.endpoint}`, options)
    const responseTime = Date.now() - startTime
    const data = await response.json()

    if (response.ok) {
      console.log(`✅ SUCCESS (${response.status}) - ${responseTime}ms`)
      console.log(`📊 Response keys: ${Object.keys(data).join(", ")}`)

      // Log specific important fields
      if (data.safetyLevel) console.log(`🛡️  Safety Level: ${data.safetyLevel}`)
      if (data.confidenceScore) console.log(`🎯 Confidence: ${data.confidenceScore}%`)
      if (data.overallAccuracy) console.log(`📈 Accuracy: ${data.overallAccuracy}%`)
      if (data.urgencyLevel) console.log(`⚠️  Urgency: ${data.urgencyLevel}`)
      if (data.riskLevel) console.log(`🚨 Risk Level: ${data.riskLevel}`)
    } else {
      console.log(`❌ FAILED (${response.status}) - ${responseTime}ms`)
      console.log(`💬 Error: ${data.error || "Unknown error"}`)
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    console.log(`💥 ERROR - ${responseTime}ms`)
    console.log(`💬 ${error.message}`)
  }
}

async function runAllTests() {
  console.log("🚀 Starting API Endpoint Tests")
  console.log(`🌐 Base URL: ${BASE_URL}`)
  console.log(`📋 Total Tests: ${testCases.length}`)

  let passed = 0
  let failed = 0

  for (const testCase of testCases) {
    try {
      await runTest(testCase)
      passed++
    } catch (error) {
      failed++
    }

    // Small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log("\n📊 TEST SUMMARY")
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${Math.round((passed / testCases.length) * 100)}%`)
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error)
}

export { runAllTests, runTest, testCases }
