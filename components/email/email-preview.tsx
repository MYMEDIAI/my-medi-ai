"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateEmailHtml } from "@/lib/email-templates"

export default function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<"emailVerification" | "passwordReset" | "welcome">(
    "emailVerification",
  )
  const [previewHtml, setPreviewHtml] = useState("")

  const mockData = {
    emailVerification: {
      firstName: "John",
      verificationUrl: "https://medi.ai/auth/verify-email?token=abc123",
    },
    passwordReset: {
      firstName: "John",
      resetUrl: "https://medi.ai/auth/reset-password?token=xyz789",
    },
    welcome: {
      firstName: "John",
      dashboardUrl: "https://medi.ai/dashboard",
    },
  }

  const generatePreview = () => {
    const data = mockData[selectedTemplate]
    const html = generateEmailHtml(selectedTemplate, data, "Email Preview")
    setPreviewHtml(html)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Template Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate as any}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emailVerification">Email Verification</SelectItem>
                <SelectItem value="passwordReset">Password Reset</SelectItem>
                <SelectItem value="welcome">Welcome Email</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generatePreview}>Generate Preview</Button>
          </div>

          {previewHtml && (
            <div className="border rounded-lg overflow-hidden">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-96"
                title="Email Preview"
                style={{ minHeight: "600px" }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
