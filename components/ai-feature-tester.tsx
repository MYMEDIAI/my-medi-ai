"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  ImageIcon,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Zap,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Stethoscope,
  Wifi,
  Database,
  Target,
  FileText,
  Play,
  RotateCcw,
  TestTube,
  Server,
  Monitor,
  Code,
} from "lucide-react"

interface TestResult {
  feature: string
  status: "pass" | "fail" | "pending"
  message?: string
  responseTime?: number
  data?: any
  timestamp?: Date
}

interface AIFeature {
  id: string
  name: string
  description: string
  endpoint: string
  icon: any
  category: string
  testData: any
  expectedResponse: string[]
  criticalFeature: boolean
}

const AI_FEATURES: AIFeature[] = [
  {
    id: "health-assessment",
    name: "AI Health Assessment",
    description: "Comprehensive health evaluation with AI analysis",
    endpoint: "/api/health-assessment",
    icon: Stethoscope,
    category: "Core Assessment",
    criticalFeature: true,
    testData: {
      personalInfo: {
        age: 35,
        gender: "male",
        height: 175,
        weight: 70,
        location: "Mumbai, India",
      },
      symptoms: {
        primary: ["headache", "fatigue"],
        secondary: ["dizziness"],
        duration: "3 days",
        severity: 6,
        bodyParts: ["head"],
      },
      medicalHistory: {
        conditions: ["hypertension"],
        surgeries: [],
        allergies: ["peanuts"],
        familyHistory: ["diabetes"],
      },
      lifestyle: {
        smoking: false,
        alcohol: false,
        exercise: "moderate",
        diet: "average",
        sleep: 7,
        stress: 5,
      },
      currentMedications: ["lisinopril"],
    },
    expectedResponse: ["overallScore", "riskLevel", "recommendations", "specialistReferrals"],
  },
  {
    id: "ai-chat",
    name: "AI Health Chat",
    description: "24/7 AI doctor consultation with medical expertise",
    endpoint: "/api/gemini-integration",
    icon: MessageSquare,
    category: "Consultation",
    criticalFeature: true,
    testData: {
      messages: [
        {
          role: "user",
          content:
            "I have been experiencing headaches for the past 3 days. The pain is moderate, around 6/10, and seems to get worse in the evening. I'm 35 years old and generally healthy. What could be causing this?",
        },
      ],
      context: {
        userProfile: {
          age: 35,
          gender: "male",
          location: "India",
        },
      },
    },
    expectedResponse: ["message", "confidence", "suggestions", "medicalDisclaimer"],
  },
  {
    id: "symptom-analyzer",
    name: "AI Symptom Analyzer",
    description: "Advanced symptom analysis with differential diagnosis",
    endpoint: "/api/ai-symptom-analyzer",
    icon: Brain,
    category: "Analysis",
    criticalFeature: true,
    testData: {
      symptoms: ["headache", "nausea", "sensitivity to light"],
      age: 28,
      gender: "female",
      type: "comprehensive_analysis",
      medicalHistory: [],
      duration: "2 days",
      severity: 7,
    },
    expectedResponse: ["primaryAnalysis", "symptomAnalysis", "recommendations", "emergencyFlags"],
  },
  {
    id: "medication-analyzer",
    name: "AI Medication Analyzer",
    description: "Smart medication analysis with Indian brands and pricing",
    endpoint: "/api/ai-medication-analyzer",
    icon: ImageIcon,
    category: "Medication",
    criticalFeature: true,
    testData: {
      symptoms: ["fever", "headache"],
      age: 30,
      gender: "male",
      weight: 70,
      currentMedications: [],
      allergies: [],
      type: "medication_recommendations",
    },
    expectedResponse: ["recommendations", "safetyAlerts", "overallAssessment"],
  },
  {
    id: "live-ai-analysis",
    name: "Live AI Assessment",
    description: "Real-time health analysis with emergency detection",
    endpoint: "/api/live-ai-analysis",
    icon: Zap,
    category: "Real-time",
    criticalFeature: true,
    testData: {
      personalInfo: {
        age: 45,
        gender: "female",
        weight: 65,
        height: 160,
      },
      primarySymptom: "chest pain",
      secondarySymptoms: ["shortness of breath"],
      medications: [],
      conditions: [],
      duration: "30 minutes",
      severity: 8,
      lifestyle: {
        exercise: "moderate",
        sleep: "good",
        diet: "healthy",
        stress: 6,
      },
    },
    expectedResponse: ["healthScore", "riskLevel", "isEmergency", "recommendations"],
  },
  {
    id: "report-generator",
    name: "AI Report Generator",
    description: "Automated comprehensive medical report generation",
    endpoint: "/api/ai-report-generator",
    icon: FileText,
    category: "Documentation",
    criticalFeature: false,
    testData: {
      personalInfo: {
        name: "Test Patient",
        age: 40,
        gender: "male",
        weight: 75,
        height: 180,
        phone: "+91-9876543210",
        email: "test@example.com",
      },
      symptoms: {
        primary: "back pain",
        secondary: ["muscle stiffness"],
        duration: "1 week",
        severity: 5,
        onset: "gradual",
      },
      medicalHistory: {
        conditions: [],
        medications: [],
        allergies: [],
        surgeries: [],
        familyHistory: [],
      },
      lifestyle: {
        exercise: "light",
        diet: "average",
        sleep: "fair",
        smoking: "no",
        alcohol: "occasional",
        stress: 4,
      },
    },
    expectedResponse: ["report", "metadata", "insights"],
  },
  {
    id: "safety-monitor",
    name: "AI Safety Monitor",
    description: "Medical-grade safety monitoring and validation",
    endpoint: "/api/ai-safety-monitor",
    icon: Shield,
    category: "Safety",
    criticalFeature: true,
    testData: {
      assessment: {
        symptoms: ["severe chest pain", "difficulty breathing"],
        medications: ["aspirin", "metformin"],
        age: 65,
        conditions: ["diabetes", "hypertension"],
      },
      riskFactors: ["age", "multiple conditions"],
      urgencyLevel: "high",
    },
    expectedResponse: ["safetyScore", "alerts", "recommendations", "emergencyProtocol"],
  },
  {
    id: "accuracy-enhancement",
    name: "AI Accuracy Enhancement",
    description: "Continuous learning and accuracy improvement system",
    endpoint: "/api/ai-accuracy-enhancement",
    icon: Target,
    category: "Quality",
    criticalFeature: false,
    testData: {
      predictionData: {
        symptoms: ["fever", "cough"],
        prediction: "viral infection",
        confidence: 85,
      },
      actualOutcome: "confirmed viral infection",
      feedbackType: "positive",
      improvementSuggestions: ["consider seasonal patterns"],
    },
    expectedResponse: ["accuracyScore", "learningUpdates", "modelImprovements"],
  },
]

export default function AIFeatureTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTesting, setIsTesting] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null)
  const [customTestData, setCustomTestData] = useState<string>("")
  const [overallProgress, setOverallProgress] = useState(0)
  const [testMode, setTestMode] = useState<"all" | "critical" | "individual">("all")

  const testFeatures = [
    "AI Health Assessment",
    "AI Health Chat",
    "AI Symptom Analyzer",
    "AI Medication Analyzer",
    "Live AI Assessment",
    "AI Report Generator",
    "AI Safety Monitor",
    "AI Accuracy Enhancement",
  ]

  // Test individual feature
  const testFeature = async (feature: AIFeature, customData?: any) => {
    const startTime = Date.now()
    setCurrentTest(feature.id)

    try {
      const testData = customData || feature.testData

      const response = await fetch(feature.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const duration = Date.now() - startTime
      const responseData = await response.json()

      // Check if response contains expected fields
      const hasExpectedFields = feature.expectedResponse.every(
        (field) => responseData.hasOwnProperty(field) || (responseData.data && responseData.data.hasOwnProperty(field)),
      )

      const result: TestResult = {
        feature: feature.name,
        status: response.ok && hasExpectedFields ? "pass" : "fail",
        message: response.ok
          ? hasExpectedFields
            ? `✅ All expected fields present (${feature.expectedResponse.join(", ")})`
            : `⚠️ Missing expected fields: ${feature.expectedResponse
                .filter(
                  (field) =>
                    !responseData.hasOwnProperty(field) &&
                    !(responseData.data && responseData.data.hasOwnProperty(field)),
                )
                .join(", ")}`
          : `❌ HTTP ${response.status}: ${responseData.error || "Unknown error"}`,
        responseTime: duration,
        data: responseData,
        timestamp: new Date(),
      }

      setTestResults((prev) => {
        const filtered = prev.filter((r) => r.feature !== feature.name)
        return [...filtered, result]
      })
    } catch (error) {
      const duration = Date.now() - startTime
      const result: TestResult = {
        feature: feature.name,
        status: "fail",
        message: `❌ Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
        responseTime: duration,
        timestamp: new Date(),
      }

      setTestResults((prev) => {
        const filtered = prev.filter((r) => r.feature !== feature.name)
        return [...filtered, result]
      })
    } finally {
      setCurrentTest(null)
    }
  }

  // Run all tests
  const runAllTests = async () => {
    setIsTesting(true)
    setTestResults([])
    setTestProgress(0)
    setOverallProgress(0)

    const featuresToTest = testMode === "critical" ? AI_FEATURES.filter((f) => f.criticalFeature) : AI_FEATURES

    for (let i = 0; i < featuresToTest.length; i++) {
      await testFeature(featuresToTest[i])
      setTestProgress(((i + 1) / featuresToTest.length) * 100)
      setOverallProgress(((i + 1) / featuresToTest.length) * 100)

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsTesting(false)
  }

  // Test with custom data
  const testWithCustomData = async () => {
    if (!selectedFeature || !customTestData) return

    try {
      const customData = JSON.parse(customTestData)
      await testFeature(selectedFeature, customData)
    } catch (error) {
      alert("Invalid JSON format in custom test data")
    }
  }

  // Get test statistics
  const getTestStats = () => {
    const total = testResults.length
    const passed = testResults.filter((r) => r.status === "pass").length
    const failed = testResults.filter((r) => r.status === "fail").length
    const avgDuration = total > 0 ? testResults.reduce((sum, r) => sum + r.responseTime!, 0) / total : 0

    return { total, passed, failed, avgDuration }
  }

  const stats = getTestStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <TestTube className="w-8 h-8 mr-3 text-blue-600" />
                AI Feature Testing Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive testing suite for all AI health assessment features</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Database className="w-3 h-3 mr-1" />
                {AI_FEATURES.length} Features
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Wifi className="w-3 h-3 mr-1" />
                Live Testing
              </Badge>
            </div>
          </div>

          {/* Test Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Label>Test Mode:</Label>
              <select
                value={testMode}
                onChange={(e) => setTestMode(e.target.value as any)}
                className="px-3 py-1 border rounded-md"
                disabled={isTesting}
              >
                <option value="all">All Features ({AI_FEATURES.length})</option>
                <option value="critical">Critical Only ({AI_FEATURES.filter((f) => f.criticalFeature).length})</option>
                <option value="individual">Individual Testing</option>
              </select>
            </div>

            <Button
              onClick={runAllTests}
              disabled={isTesting || testMode === "individual"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTesting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run {testMode === "critical" ? "Critical" : "All"} Tests
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setTestResults([])
                setOverallProgress(0)
              }}
              variant="outline"
              disabled={isTesting}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Results
            </Button>

            {isTesting && (
              <div className="flex items-center space-x-2">
                <Progress value={overallProgress} className="w-32" />
                <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
              </div>
            )}
          </div>

          {/* Test Statistics */}
          {testResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.total - stats.passed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(stats.avgDuration)}ms</div>
                  <div className="text-sm text-gray-600">Avg Duration</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* AI Features Tab */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_FEATURES.map((feature) => {
              const result = testResults.find((r) => r.feature === feature.name)
              const isCurrentlyTesting = currentTest === feature.id

              return (
                <Card key={feature.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <feature.icon className="w-5 h-5 text-blue-600" />
                        <CardTitle className="text-lg">{feature.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        {feature.criticalFeature && (
                          <Badge variant="destructive" className="text-xs">
                            Critical
                          </Badge>
                        )}
                        {result && (
                          <div className="flex items-center">
                            {result.status === "pass" && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {result.status === "fail" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </div>
                        )}
                        {isCurrentlyTesting && <Clock className="w-4 h-4 text-blue-500 animate-spin" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Badge variant="outline" className="text-xs mb-2">
                        {feature.category}
                      </Badge>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>

                    <div className="text-xs text-gray-500">
                      <div>
                        <strong>Endpoint:</strong> {feature.endpoint}
                      </div>
                      <div>
                        <strong>Expected:</strong> {feature.expectedResponse.join(", ")}
                      </div>
                    </div>

                    {result && (
                      <Alert
                        className={`${
                          result.status === "pass" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                        }`}
                      >
                        <AlertDescription className="text-sm">
                          <div className="font-medium">{result.message}</div>
                          <div className="text-xs mt-1">
                            Duration: {result.responseTime}ms | {result.timestamp?.toLocaleTimeString()}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => testFeature(feature)}
                        disabled={isTesting || isCurrentlyTesting}
                        className="flex-1"
                      >
                        {isCurrentlyTesting ? (
                          <>
                            <Clock className="w-3 h-3 mr-1 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Test
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFeature(feature)
                          setCustomTestData(JSON.stringify(feature.testData, null, 2))
                        }}
                      >
                        <Code className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Test Results Tab */}
        <div className="space-y-6">
          {testResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Test Results Yet</h3>
                <p className="text-gray-500 mb-4">Run some tests to see detailed results here</p>
                <Button onClick={runAllTests} disabled={isTesting}>
                  <Play className="w-4 h-4 mr-2" />
                  Run All Tests
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result) => (
                  <div key={result.feature} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {result.status === "pass" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{result.feature}</span>
                    </div>
                    <Badge variant={result.status === "pass" ? "outline" : "destructive"}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Testing Tab */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Test Data</CardTitle>
              <p className="text-sm text-gray-600">Test AI features with your own custom data</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="feature-select">Select Feature</Label>
                <select
                  id="feature-select"
                  className="w-full px-3 py-2 border rounded-md mt-1"
                  value={selectedFeature?.id || ""}
                  onChange={(e) => {
                    const feature = AI_FEATURES.find((f) => f.id === e.target.value)
                    setSelectedFeature(feature || null)
                    if (feature) {
                      setCustomTestData(JSON.stringify(feature.testData, null, 2))
                    }
                  }}
                >
                  <option value="">Select a feature to test</option>
                  {AI_FEATURES.map((feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.name} - {feature.category}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFeature && (
                <>
                  <div>
                    <Label htmlFor="test-data">Test Data (JSON)</Label>
                    <Input
                      id="test-data"
                      value={customTestData}
                      onChange={(e) => setCustomTestData(e.target.value)}
                      className="font-mono text-sm mt-1"
                      placeholder="Enter custom test data in JSON format"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={testWithCustomData} disabled={!selectedFeature || !customTestData || isTesting}>
                      <Play className="w-4 h-4 mr-2" />
                      Run Custom Test
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (selectedFeature) {
                          setCustomTestData(JSON.stringify(selectedFeature.testData, null, 2))
                        }
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Expected Response Fields:</strong> {selectedFeature.expectedResponse.join(", ")}
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Monitoring Tab */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2 text-green-600" />
                  API Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>~{Math.round(stats.avgDuration)}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {stats.passed}/{stats.total} tests passed
                  </div>
                  <Progress value={stats.total > 0 ? (stats.passed / stats.total) * 100 : 0} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-600" />
                  Test Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Last Test:</span>
                    <span className="text-sm">
                      {testResults.length > 0
                        ? testResults[testResults.length - 1].timestamp?.toLocaleTimeString()
                        : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Runs:</span>
                    <span>{testResults.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currently Testing:</span>
                    <span>{currentTest ? "Yes" : "No"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Test Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-gray-600" />
                Real-time Test Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-64 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-gray-500">Waiting for test activity...</div>
                ) : (
                  testResults.slice(-10).map((result, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-500">[{result.timestamp?.toLocaleTimeString()}]</span>{" "}
                      <span
                        className={
                          result.status === "pass"
                            ? "text-green-400"
                            : result.status === "fail"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }
                      >
                        {result.status.toUpperCase()}
                      </span>{" "}
                      <span className="text-blue-400">{result.feature}</span>{" "}
                      <span className="text-gray-300">({result.responseTime}ms)</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="outline">
            <Stethoscope className="w-4 h-4 mr-2" />
            Try Health Assessment
          </Button>
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Try AI Chat
          </Button>
          <Button variant="outline">
            <Zap className="w-4 h-4 mr-2" />
            Try Live Assessment
          </Button>
          <Button variant="outline">
            <Brain className="w-4 h-4 mr-2" />
            Try Symptom Analyzer
          </Button>
        </div>
      </div>
    </div>
  )
}
