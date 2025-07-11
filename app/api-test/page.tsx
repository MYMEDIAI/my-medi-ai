"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, Play, RefreshCw } from "lucide-react"

interface TestResult {
  endpoint: string
  method: string
  status: "pending" | "success" | "error" | "running"
  statusCode?: number
  responseTime?: number
  response?: any
  error?: string
}

interface TestSuite {
  name: string
  description: string
  tests: TestCase[]
}

interface TestCase {
  name: string
  endpoint: string
  method: "GET" | "POST"
  payload?: any
  expectedStatus: number
  description: string
}

const testSuites: TestSuite[] = [
  {
    name: "AI Safety Monitor",
    description: "Tests for AI safety assessment and monitoring",
    tests: [
      {
        name: "Safety Assessment - Normal Case",
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
        name: "Emergency Detection",
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
        expectedStatus: 200,
        description: "Test emergency situation detection",
      },
    ],
  },
  {
    name: "AI Accuracy Enhancement",
    description: "Tests for accuracy tracking and improvement",
    tests: [
      {
        name: "Get Accuracy Metrics",
        endpoint: "/api/ai-accuracy-enhancement?type=metrics",
        method: "GET",
        expectedStatus: 200,
        description: "Retrieve current accuracy metrics",
      },
      {
        name: "Submit Feedback",
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
        expectedStatus: 200,
        description: "Submit user feedback for accuracy tracking",
      },
      {
        name: "Request Specialist Review",
        endpoint: "/api/ai-accuracy-enhancement",
        method: "POST",
        payload: {
          action: "request_specialist_review",
          recommendation: "Patient shows symptoms of possible cardiac arrhythmia",
          userCase: "Male, 45, experiencing irregular heartbeat and chest discomfort",
        },
        expectedStatus: 200,
        description: "Request specialist review for complex case",
      },
    ],
  },
  {
    name: "AI Form Helper",
    description: "Tests for form assistance and voice processing",
    tests: [
      {
        name: "Explain Medical Term",
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
        name: "Process Voice Input",
        endpoint: "/api/ai-form-helper",
        method: "POST",
        payload: {
          type: "process_voice",
          data: {
            voiceInput: "I have been having severe headache for the past three days with nausea",
            language: "english",
          },
        },
        expectedStatus: 200,
        description: "Process voice input and extract medical data",
      },
      {
        name: "Generate Question Suggestions",
        endpoint: "/api/ai-form-helper",
        method: "POST",
        payload: {
          type: "suggest_questions",
          data: {
            symptom: "headache",
            context: "initial assessment",
          },
        },
        expectedStatus: 200,
        description: "Generate follow-up questions for symptoms",
      },
    ],
  },
  {
    name: "Gemini Health",
    description: "Tests for health query processing",
    tests: [
      {
        name: "Health Query Assessment",
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
        name: "Get Health Tips",
        endpoint: "/api/gemini-health?action=health_tips",
        method: "GET",
        expectedStatus: 200,
        description: "Retrieve general health tips",
      },
      {
        name: "Get Emergency Contacts",
        endpoint: "/api/gemini-health?action=emergency_contacts",
        method: "GET",
        expectedStatus: 200,
        description: "Get emergency contact information",
      },
    ],
  },
  {
    name: "Gemini Integration",
    description: "Tests for chat integration and responses",
    tests: [
      {
        name: "Health Chat",
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
        expectedStatus: 200,
        description: "Test health chat conversation",
      },
      {
        name: "Emergency Chat",
        endpoint: "/api/gemini-integration",
        method: "POST",
        payload: {
          messages: [
            {
              role: "user",
              content: "I am having severe chest pain and difficulty breathing",
              timestamp: new Date().toISOString(),
            },
          ],
          context: {
            sessionId: "emergency_test_456",
          },
        },
        expectedStatus: 200,
        description: "Test emergency situation handling in chat",
      },
      {
        name: "Get Conversation Starters",
        endpoint: "/api/gemini-integration?action=conversation_starters",
        method: "GET",
        expectedStatus: 200,
        description: "Get suggested conversation starters",
      },
    ],
  },
  {
    name: "Health Assessment",
    description: "Tests for comprehensive health assessment",
    tests: [
      {
        name: "Complete Health Assessment",
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
      {
        name: "Get Assessment Template",
        endpoint: "/api/health-assessment?action=assessment_template",
        method: "GET",
        expectedStatus: 200,
        description: "Get health assessment template structure",
      },
    ],
  },
]

export default function APITestPage() {
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({})
  const [isRunningAll, setIsRunningAll] = useState(false)
  const [selectedSuite, setSelectedSuite] = useState<string>("")

  const runTest = async (test: TestCase, suiteName: string) => {
    const testKey = `${suiteName}-${test.name}`

    setTestResults((prev) => ({
      ...prev,
      [testKey]: {
        endpoint: test.endpoint,
        method: test.method,
        status: "running",
      },
    }))

    const startTime = Date.now()

    try {
      const options: RequestInit = {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (test.method === "POST" && test.payload) {
        options.body = JSON.stringify(test.payload)
      }

      const response = await fetch(test.endpoint, options)
      const responseData = await response.json()
      const responseTime = Date.now() - startTime

      setTestResults((prev) => ({
        ...prev,
        [testKey]: {
          endpoint: test.endpoint,
          method: test.method,
          status: response.status === test.expectedStatus ? "success" : "error",
          statusCode: response.status,
          responseTime,
          response: responseData,
          error:
            response.status !== test.expectedStatus
              ? `Expected ${test.expectedStatus}, got ${response.status}`
              : undefined,
        },
      }))
    } catch (error) {
      const responseTime = Date.now() - startTime

      setTestResults((prev) => ({
        ...prev,
        [testKey]: {
          endpoint: test.endpoint,
          method: test.method,
          status: "error",
          responseTime,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    }
  }

  const runSuiteTests = async (suite: TestSuite) => {
    for (const test of suite.tests) {
      await runTest(test, suite.name)
      // Small delay between tests to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const runAllTests = async () => {
    setIsRunningAll(true)
    setTestResults({})

    for (const suite of testSuites) {
      await runSuiteTests(suite)
    }

    setIsRunningAll(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const variants = {
      success: "default",
      error: "destructive",
      running: "secondary",
      pending: "outline",
    } as const

    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>
  }

  const getSuiteStats = (suite: TestSuite) => {
    const suiteTests = suite.tests.map((test) => testResults[`${suite.name}-${test.name}`]).filter(Boolean)
    const total = suite.tests.length
    const completed = suiteTests.length
    const passed = suiteTests.filter((result) => result.status === "success").length
    const failed = suiteTests.filter((result) => result.status === "error").length

    return { total, completed, passed, failed }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Testing Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive testing suite for all MyMedi.ai API endpoints</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <Button onClick={runAllTests} disabled={isRunningAll} size="lg">
            {isRunningAll ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running All Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          <div className="text-sm text-muted-foreground">
            Total Tests: {testSuites.reduce((acc, suite) => acc + suite.tests.length, 0)}
          </div>
        </div>
      </div>

      <Tabs value={selectedSuite} onValueChange={setSelectedSuite} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {testSuites.map((suite) => {
            const stats = getSuiteStats(suite)
            return (
              <TabsTrigger key={suite.name} value={suite.name} className="relative">
                {suite.name.split(" ")[0]}
                {stats.completed > 0 && (
                  <Badge
                    variant={stats.failed > 0 ? "destructive" : stats.passed === stats.total ? "default" : "secondary"}
                    className="ml-1 text-xs"
                  >
                    {stats.passed}/{stats.total}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {testSuites.map((suite) => (
          <TabsContent key={suite.name} value={suite.name} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{suite.name}</CardTitle>
                    <CardDescription>{suite.description}</CardDescription>
                  </div>
                  <Button onClick={() => runSuiteTests(suite)} variant="outline" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Run Suite
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suite.tests.map((test) => {
                    const testKey = `${suite.name}-${test.name}`
                    const result = testResults[testKey]

                    return (
                      <Card key={test.name} className="border-l-4 border-l-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getStatusIcon(result?.status || "pending")}
                                <h4 className="font-semibold">{test.name}</h4>
                                {getStatusBadge(result?.status || "pending")}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="font-mono bg-muted px-2 py-1 rounded">
                                  {test.method} {test.endpoint}
                                </span>
                                {result?.responseTime && <span>{result.responseTime}ms</span>}
                                {result?.statusCode && <span>Status: {result.statusCode}</span>}
                              </div>
                            </div>
                            <Button
                              onClick={() => runTest(test, suite.name)}
                              variant="outline"
                              size="sm"
                              disabled={result?.status === "running"}
                            >
                              {result?.status === "running" ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>

                        {result && (result.response || result.error) && (
                          <CardContent className="pt-0">
                            {result.error && (
                              <Alert className="mb-4">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Error:</strong> {result.error}
                                </AlertDescription>
                              </Alert>
                            )}

                            {result.response && (
                              <div>
                                <h5 className="font-semibold mb-2 text-sm">Response:</h5>
                                <ScrollArea className="h-32 w-full rounded border">
                                  <pre className="p-3 text-xs">{JSON.stringify(result.response, null, 2)}</pre>
                                </ScrollArea>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Overall Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testSuites.map((suite) => {
              const stats = getSuiteStats(suite)
              return (
                <div key={suite.name} className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{suite.name}</h4>
                  <div className="text-2xl font-bold mb-1">
                    {stats.passed}/{stats.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.failed > 0 && <span className="text-red-500">{stats.failed} failed</span>}
                    {stats.failed === 0 && stats.completed === stats.total && (
                      <span className="text-green-500">All passed</span>
                    )}
                    {stats.completed < stats.total && (
                      <span className="text-gray-500">{stats.total - stats.completed} pending</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
