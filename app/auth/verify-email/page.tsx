"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, resendVerification } = useAuth()

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error" | "pending">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string>("")

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (token && type === "signup") {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          })

          if (error) {
            console.error("Verification error:", error)
            setVerificationStatus("error")
            setErrorMessage(error.message || "Email verification failed")
          } else {
            // Update user status in our database
            await supabase
              .from("users")
              .update({
                email_verified: true,
                status: "active",
                updated_at: new Date().toISOString(),
              })
              .eq("id", user?.id)

            setVerificationStatus("success")

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
              router.push("/dashboard")
            }, 3000)
          }
        } catch (error) {
          console.error("Verification error:", error)
          setVerificationStatus("error")
          setErrorMessage("An unexpected error occurred during verification")
        }
      } else if (user && !user.emailVerified) {
        setVerificationStatus("pending")
      } else if (user && user.emailVerified) {
        router.push("/dashboard")
      } else {
        setVerificationStatus("pending")
      }
    }

    handleEmailVerification()
  }, [searchParams, user, router])

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendMessage("")

    try {
      const result = await resendVerification()

      if (result.success) {
        setResendMessage("Verification email sent! Please check your inbox.")
      } else {
        setResendMessage(result.error || "Failed to resend verification email")
      }
    } catch (error) {
      setResendMessage("An unexpected error occurred")
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/medi-ai-logo.png"
                  alt="Medi.AI Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <CardTitle className="text-2xl">Verifying Email</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verifying your email address...</p>
            </CardContent>
          </Card>
        )

      case "success":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/medi-ai-logo.png"
                  alt="Medi.AI Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-700">Email Verified!</CardTitle>
              <CardDescription>Your email has been successfully verified</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Welcome to Medi.AI! Your account is now active and you can access all features.
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500">
                <span>Redirecting to dashboard in 3 seconds...</span>
              </div>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )

      case "error":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/medi-ai-logo.png"
                  alt="Medi.AI Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-red-700">Verification Failed</CardTitle>
              <CardDescription>There was an issue verifying your email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>

              {resendMessage && (
                <Alert>
                  <AlertDescription>{resendMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button onClick={handleResendVerification} disabled={isResending} className="w-full" variant="outline">
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )

      case "pending":
      default:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/images/medi-ai-logo.png"
                  alt="Medi.AI Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We've sent you a verification link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-gray-600">We've sent a verification link to:</p>
                <p className="font-medium text-gray-900">{user?.email || "your email address"}</p>
                <p className="text-sm text-gray-500">
                  Click the link in the email to verify your account and get started with Medi.AI.
                </p>
              </div>

              {resendMessage && (
                <Alert>
                  <AlertDescription>{resendMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button onClick={handleResendVerification} disabled={isResending} className="w-full" variant="outline">
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>Didn't receive the email? Check your spam folder or try resending.</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {renderContent()}
    </div>
  )
}
