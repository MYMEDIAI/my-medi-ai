"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EmailDebug from "@/components/debug/email-debug"

export default function TestAuthPage() {
  const { user, loading, login, logout, register } = useAuth()
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("TestPassword123!")
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)])
  }

  const handleTestLogin = async () => {
    addResult("Testing login...")
    const result = await login({
      email: testEmail,
      password: testPassword,
      rememberMe: false,
    })

    const message = `Login ${result.success ? "successful" : "failed"}: ${result.error || "Success"}`
    addResult(message)
    console.log("Login result:", result)
  }

  const handleTestRegister = async () => {
    addResult("Testing registration...")
    const result = await register({
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
      firstName: "Test",
      lastName: "User",
      role: "patient",
    })

    const message = `Registration ${result.success ? "successful" : "failed"}: ${result.error || "Check your email for verification"}`
    addResult(message)
    console.log("Registration result:", result)
  }

  const handleTestSupabaseSignup = async () => {
    addResult("Testing direct Supabase signup...")
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: "Test",
          last_name: "User",
        },
      },
    })

    const message = `Supabase signup ${error ? "failed" : "successful"}: ${error?.message || "Check your email"}`
    addResult(message)
    console.log("Supabase signup result:", { data, error })
  }

  const handleTestLogout = async () => {
    addResult("Testing logout...")
    await logout()
    addResult("Logged out")
  }

  const checkSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    const message = `Session: ${session ? "Active" : "None"} - User: ${session?.user?.email || "None"}`
    addResult(message)
    console.log("Current session:", { session, error })
  }

  const testDatabaseConnection = async () => {
    addResult("Testing database connection...")
    try {
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      })

      const result = await response.json()
      addResult(`Database test: ${response.ok ? "Success" : "Failed"} - ${JSON.stringify(result)}`)
    } catch (error) {
      addResult(`Database test failed: ${error}`)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Auth Testing Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Current Status:</strong>
              <div className="ml-4 text-sm">
                Loading: {loading ? "Yes" : "No"}
                <br />
                User: {user ? `${user.email} (${user.role})` : "None"}
                <br />
                Status: {user?.status || "N/A"}
                <br />
                Email Verified: {user?.emailVerified ? "Yes" : "No"}
              </div>
            </div>

            <div className="space-y-2">
              <Input placeholder="Test email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
              <Input
                type="password"
                placeholder="Test password (min 12 chars, uppercase, lowercase, number, special)"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={handleTestRegister} disabled={loading} variant="default">
                Test Register
              </Button>
              <Button onClick={handleTestLogin} disabled={loading} variant="outline">
                Test Login
              </Button>
              <Button onClick={handleTestSupabaseSignup} disabled={loading} variant="outline">
                Direct Supabase
              </Button>
              <Button onClick={handleTestLogout} disabled={loading} variant="outline">
                Test Logout
              </Button>
              <Button onClick={checkSession} variant="outline">
                Check Session
              </Button>
              <Button onClick={testDatabaseConnection} variant="outline">
                Test Database
              </Button>
              <Button onClick={clearResults} variant="ghost">
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">📋 Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs max-h-64 overflow-y-auto">
                {testResults.length > 0 ? (
                  testResults.map((result, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-gray-700">
                      {result}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No test results yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🔧 Quick Setup</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <strong>1. Database:</strong> ✅ Connected and working
              </p>
              <p>
                <strong>2. Email Setup:</strong> Test email configuration below
              </p>
              <p>
                <strong>3. Registration:</strong> Try "Test Register" button
              </p>
              <p>
                <strong>4. Verification:</strong> Check email for verification link
              </p>
              <p>
                <strong>5. Login:</strong> Try "Test Login" after verification
              </p>

              <div className="mt-4 p-3 bg-blue-50 rounded">
                <strong>💡 Tip:</strong> If registration works but no email arrives, you need to configure an email
                provider. Run:
                <code className="block mt-1 p-1 bg-white rounded text-xs">npm run setup-email</code>
              </div>
            </CardContent>
          </Card>
        </div>

        <EmailDebug />
      </div>
    </div>
  )
}
