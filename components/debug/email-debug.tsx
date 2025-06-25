"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EmailDebug() {
  const [emailStatus, setEmailStatus] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const checkEmailConfig = async () => {
    setTesting(true)
    try {
      // Check environment variables
      const envCheck = {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        hasResend: !!process.env.RESEND_API_KEY,
        hasSendGrid: !!process.env.SENDGRID_API_KEY,
        hasMailgun: !!process.env.MAILGUN_API_KEY,
        hasPostmark: !!process.env.POSTMARK_API_KEY,
      }

      // Test email API endpoint
      const response = await fetch("/api/auth/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "verification",
          to: "test@example.com",
          firstName: "Test",
          url: "https://example.com/verify",
        }),
      })

      const result = await response.json()

      setEmailStatus({
        envCheck,
        apiTest: {
          status: response.status,
          success: response.ok,
          result,
        },
      })
    } catch (error) {
      setEmailStatus({
        error: error.message,
      })
    } finally {
      setTesting(false)
    }
  }

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          📧 Email Debug
          <Button variant="outline" size="sm" onClick={checkEmailConfig} disabled={testing}>
            {testing ? "Testing..." : "Test Email Config"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        {emailStatus && (
          <>
            {emailStatus.envCheck && (
              <div>
                <strong>Environment Variables:</strong>
                <div className="ml-2 space-y-1">
                  <div>Site URL: {emailStatus.envCheck.siteUrl || "❌ Not set"}</div>
                  <div className="flex gap-2">
                    <Badge variant={emailStatus.envCheck.hasResend ? "default" : "secondary"}>
                      Resend: {emailStatus.envCheck.hasResend ? "✅" : "❌"}
                    </Badge>
                    <Badge variant={emailStatus.envCheck.hasSendGrid ? "default" : "secondary"}>
                      SendGrid: {emailStatus.envCheck.hasSendGrid ? "✅" : "❌"}
                    </Badge>
                    <Badge variant={emailStatus.envCheck.hasMailgun ? "default" : "secondary"}>
                      Mailgun: {emailStatus.envCheck.hasMailgun ? "✅" : "❌"}
                    </Badge>
                    <Badge variant={emailStatus.envCheck.hasPostmark ? "default" : "secondary"}>
                      Postmark: {emailStatus.envCheck.hasPostmark ? "✅" : "❌"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {emailStatus.apiTest && (
              <div>
                <strong>Email API Test:</strong>
                <div className="ml-2">
                  <div>Status: {emailStatus.apiTest.status}</div>
                  <div>Success: {emailStatus.apiTest.success ? "✅" : "❌"}</div>
                  <div>Result: {JSON.stringify(emailStatus.apiTest.result)}</div>
                </div>
              </div>
            )}

            {emailStatus.error && (
              <div>
                <strong className="text-red-600">Error:</strong>
                <div className="ml-2 text-red-600">{emailStatus.error}</div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
