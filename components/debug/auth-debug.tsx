"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AuthDebug() {
  const { user, loading, error } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [authEvents, setAuthEvents] = useState<string[]>([])

  useEffect(() => {
    // Get current session
    const getCurrentSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      setSessionInfo({
        session: session
          ? {
              user_id: session.user.id,
              email: session.user.email,
              email_confirmed_at: session.user.email_confirmed_at,
              last_sign_in_at: session.user.last_sign_in_at,
              created_at: session.user.created_at,
              user_metadata: session.user.user_metadata,
              app_metadata: session.user.app_metadata,
            }
          : null,
        error: error?.message,
      })
    }

    getCurrentSession()

    // Listen to auth events for debugging
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const timestamp = new Date().toLocaleTimeString()
      const eventInfo = `${timestamp}: ${event} - ${session?.user?.email || "no user"}`
      setAuthEvents((prev) => [eventInfo, ...prev.slice(0, 9)]) // Keep last 10 events
    })

    return () => subscription.unsubscribe()
  }, [])

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      })

      const result = await response.json()
      alert(`Database test: ${response.ok ? "Success" : "Failed"} - ${JSON.stringify(result)}`)
    } catch (error) {
      alert(`Database test failed: ${error}`)
    }
  }

  const clearAuthEvents = () => {
    setAuthEvents([])
  }

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto z-50">
      <Card className="bg-white/95 backdrop-blur shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            🐛 Auth Debug
            <Badge variant={user ? "default" : "secondary"}>
              {loading ? "Loading" : user ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          {/* Current User */}
          <div>
            <strong>Current User:</strong>
            {user ? (
              <div className="ml-2 text-green-600">
                <div>ID: {user.id}</div>
                <div>Email: {user.email}</div>
                <div>Role: {user.role}</div>
                <div>Status: {user.status}</div>
                <div>Verified: {user.emailVerified ? "Yes" : "No"}</div>
              </div>
            ) : (
              <span className="text-red-600 ml-2">None</span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div>
              <strong className="text-red-600">Error:</strong>
              <div className="ml-2 text-red-600">{error}</div>
            </div>
          )}

          {/* Session Info */}
          <div>
            <strong>Supabase Session:</strong>
            {sessionInfo?.session ? (
              <div className="ml-2 text-green-600">
                <div>User ID: {sessionInfo.session.user_id}</div>
                <div>Email: {sessionInfo.session.email}</div>
                <div>Confirmed: {sessionInfo.session.email_confirmed_at ? "Yes" : "No"}</div>
              </div>
            ) : (
              <span className="text-red-600 ml-2">None</span>
            )}
          </div>

          {/* Auth Events */}
          <div>
            <div className="flex items-center justify-between">
              <strong>Recent Events:</strong>
              <Button variant="ghost" size="sm" onClick={clearAuthEvents} className="h-6 px-2 text-xs">
                Clear
              </Button>
            </div>
            <div className="ml-2 max-h-24 overflow-y-auto">
              {authEvents.length > 0 ? (
                authEvents.map((event, index) => (
                  <div key={index} className="text-gray-600 text-xs">
                    {event}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No events yet</div>
              )}
            </div>
          </div>

          {/* Test Button */}
          <Button variant="outline" size="sm" onClick={testDatabaseConnection} className="w-full h-8 text-xs">
            Test Database Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
