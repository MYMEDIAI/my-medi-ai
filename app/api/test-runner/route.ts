import { type NextRequest, NextResponse } from "next/server"

interface TestCase {
  name: string
  endpoint: string
  method: "GET" | "POST"
  payload?: any
  expectedStatus: number
  description: string
}

interface TestResult {
  name: string
  status: "success" | "error"
  statusCode: number
  responseTime: number
  response?: any
  error?: string
}

const testCases: TestCase[] = [
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
    expectedStatus: 200,
    description: "Test normal symptom assessment safety check",
  },
  {
    name: "AI Accuracy Enhancement - Get Metrics",
    endpoint: "/api/ai-accuracy-enhancement?type=metrics",
    method: "GET",
    expectedStatus: 200,
    description: "Retrieve current accuracy metrics",
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
    expectedStatus: 200,
    description: "Get explanation for medical term",
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
    expectedStatus: 200,
    description: "Process health query and provide assessment",
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
    expectedStatus: 200,
    description: "Complete comprehensive health assessment",
  },
]

async function runSingleTest(testCase: TestCase, baseUrl: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const options: RequestInit = {
      method: testCase.method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (testCase.method === "POST" && testCase.payload) {
      options.body = JSON.stringify(testCase.payload)
    }

    const response = await fetch(`${baseUrl}${testCase.endpoint}`, options)
    const responseData = await response.json()
    const responseTime = Date.now() - startTime

    return {
      name: testCase.name,
      status: response.status === testCase.expectedStatus ? "success" : "error",
      statusCode: response.status,
      responseTime,
      response: responseData,
      error:
        response.status !== testCase.expectedStatus
          ? `Expected ${testCase.expectedStatus}, got ${response.status}`
          : undefined,
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    return {
      name: testCase.name,
      status: "error",
      statusCode: 0,
      responseTime,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testNames } = await request.json()
    const baseUrl = request.nextUrl.origin

    // Filter tests if specific test names are provided
    const testsToRun = testNames ? testCases.filter((test) => testNames.includes(test.name)) : testCases

    const results: TestResult[] = []

    // Run tests sequentially to avoid overwhelming the server
    for (const testCase of testsToRun) {
      const result = await runSingleTest(testCase, baseUrl)
      results.push(result)

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Calculate summary statistics
    const totalTests = results.length
    const passedTests = results.filter((r) => r.status === "success").length
    const failedTests = results.filter((r) => r.status === "error").length
    const averageResponseTime = results.reduce((acc, r) => acc + r.responseTime, 0) / totalTests

    return NextResponse.json({
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: Math.round((passedTests / totalTests) * 100),
        averageResponseTime: Math.round(averageResponseTime),
      },
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test runner error:", error)
    return NextResponse.json(
      {
        error: "Failed to run tests",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "list") {
      return NextResponse.json({
        testCases: testCases.map((test) => ({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          description: test.description,
        })),
        total: testCases.length,
      })
    }

    return NextResponse.json({
      message: "API Test Runner",
      availableActions: ["list"],
      totalTests: testCases.length,
    })
  } catch (error) {
    console.error("Test runner GET error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
