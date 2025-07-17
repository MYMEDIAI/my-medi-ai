"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Copy, ExternalLink } from "lucide-react"

interface ValidationResult {
  valid: boolean
  results?: {
    apiKey: string
    geocoding: { enabled: boolean; error: string | null }
    places: { enabled: boolean; error: string | null }
    billing: { enabled: boolean; error: string | null }
  }
  setup?: {
    step: number
    message: string
  }
  error?: string
}

export default function ApiKeyValidator() {
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [newApiKey, setNewApiKey] = useState("")

  const validateApiKey = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/location/validate")
      const data = await response.json()
      setValidation(data)
    } catch (error) {
      setValidation({
        valid: false,
        error: `Validation failed: ${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (enabled: boolean, error: string | null) => {
    if (enabled) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (error) return <XCircle className="h-4 w-4 text-red-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusBadge = (enabled: boolean, error: string | null) => {
    if (enabled)
      return (
        <Badge variant="default" className="bg-green-500">
          Enabled
        </Badge>
      )
    if (error) return <Badge variant="destructive">Error</Badge>
    return <Badge variant="secondary">Unknown</Badge>
  }

  const setupSteps = [
    {
      step: 1,
      title: "Create Google Cloud Project",
      description: "Go to Google Cloud Console and create a new project",
      link: "https://console.cloud.google.com/projectcreate",
    },
    {
      step: 2,
      title: "Enable Geocoding API",
      description: "Enable the Geocoding API for address lookups",
      link: "https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com",
    },
    {
      step: 3,
      title: "Enable Places API",
      description: "Enable the Places API for nearby facility searches",
      link: "https://console.cloud.google.com/apis/library/places-backend.googleapis.com",
    },
    {
      step: 4,
      title: "Set up Billing",
      description: "Enable billing account (required for Places API)",
      link: "https://console.cloud.google.com/billing",
    },
    {
      step: 5,
      title: "Create API Key",
      description: "Generate an API key in the Credentials section",
      link: "https://console.cloud.google.com/apis/credentials",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Google Maps API Configuration
          </CardTitle>
          <CardDescription>Set up and validate your Google Maps API key for location services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="space-y-4">
            <Button onClick={validateApiKey} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                "Check Current Configuration"
              )}
            </Button>

            {validation && (
              <div className="space-y-4">
                {validation.error ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{validation.error}</AlertDescription>
                  </Alert>
                ) : validation.results ? (
                  <>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(true, null)}
                          <span className="font-medium">API Key</span>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{validation.results.apiKey}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(validation.results.geocoding.enabled, validation.results.geocoding.error)}
                          <span className="font-medium">Geocoding API</span>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(validation.results.geocoding.enabled, validation.results.geocoding.error)}
                          {validation.results.geocoding.error && (
                            <p className="text-sm text-red-500 mt-1">{validation.results.geocoding.error}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(validation.results.places.enabled, validation.results.places.error)}
                          <span className="font-medium">Places API</span>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(validation.results.places.enabled, validation.results.places.error)}
                          {validation.results.places.error && (
                            <p className="text-sm text-red-500 mt-1">{validation.results.places.error}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(validation.results.billing.enabled, validation.results.billing.error)}
                          <span className="font-medium">Billing</span>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(validation.results.billing.enabled, validation.results.billing.error)}
                          {validation.results.billing.error && (
                            <p className="text-sm text-red-500 mt-1">{validation.results.billing.error}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {validation.valid ? (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          ✅ Your Google Maps API is properly configured and ready to use!
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          ❌ Your Google Maps API needs configuration. Follow the setup guide below.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* New API Key Input */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Add New API Key</h3>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Google Maps API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIzaSy..."
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(`GOOGLE_MAPS_API_KEY=${newApiKey}`)}
                  disabled={!newApiKey}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {newApiKey && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Add this to your environment variables:</p>
                  <code className="text-sm bg-gray-200 px-2 py-1 rounded">GOOGLE_MAPS_API_KEY={newApiKey}</code>
                </div>
              )}
            </div>
          </div>

          {/* Setup Guide */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">📋 Complete Setup Guide</h3>
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={step.step} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        validation?.setup && validation.setup.step > step.step
                          ? "bg-green-500 text-white"
                          : validation?.setup && validation.setup.step === step.step
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {validation?.setup && validation.setup.step > step.step ? "✓" : step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    <Button variant="outline" size="sm" onClick={() => window.open(step.link, "_blank")}>
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in Google Cloud
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variable Instructions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">🔧 Environment Variable Setup</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">For Vercel Deployment:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Go to your Vercel project dashboard</li>
                  <li>Navigate to Settings → Environment Variables</li>
                  <li>
                    Add: <code className="bg-white px-1 rounded">GOOGLE_MAPS_API_KEY</code>
                  </li>
                  <li>Paste your API key as the value</li>
                  <li>Redeploy your application</li>
                </ol>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium mb-2">For Local Development:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>
                    Create a <code className="bg-white px-1 rounded">.env.local</code> file in your project root
                  </li>
                  <li>
                    Add: <code className="bg-white px-1 rounded">GOOGLE_MAPS_API_KEY=your_api_key_here</code>
                  </li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
