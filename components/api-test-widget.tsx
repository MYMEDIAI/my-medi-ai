"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Play, Activity } from "lucide-react"

interface TestSummary {
  total: number
  passed: number
  failed: number
  successRate: number
  averageResponseTime: number
}

interface TestResult {
  name: string
  status: "success" | "error"
  statusCode: number
  responseTime: number
  response?: any
  error?: string
}

interface TestRunResponse {
  summary: TestSummary
  results: TestResult[]
  timestamp: string
}

export function APITestWidget() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestRunResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    setError(null)

    try {
      const response = await fetch("/api/test-runner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: TestRunResponse = await response.json()
      setTestResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          API Health Check
        </CardTitle>
        <CardDescription>Test all API endpoints to ensure they're working correctly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={runTests} disabled={isRunning} size="lg">
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run API Tests
              </>
            )}
          </Button>

          {testResults && (
            <div className="text-sm text-muted-foreground">
              Last run: {new Date(testResults.timestamp).toLocaleString()}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Test Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {testResults && (
          <div className="space-y-4">
            {/* Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{testResults.summary.total}</div>
                    <div className="text-sm text-muted-foreground">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{testResults.summary.passed}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{testResults.summary.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{testResults.summary.averageResponseTime}ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-semibold">{testResults.summary.successRate}%</span>
                  </div>
                  <Progress value={testResults.summary.successRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Individual Test Results */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <div className="font-medium">{result.name}</div>
                          {result.error && <div className="text-sm text-red-600">{result.error}</div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={result.status === "success" ? "default" : "destructive"}>
                          {result.statusCode}
                        </Badge>
                        <div className="text-sm text-muted-foreground">{result.responseTime}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-muted-foreground">Running API tests...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
