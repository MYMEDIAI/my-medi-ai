"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, Check, X, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { RegisterData } from "@/types/auth"
import { validatePassword, passwordRequirements } from "@/utils/validation"
import Image from "next/image"

export default function RegisterForm() {
  const router = useRouter()
  const { register, loading } = useAuth()

  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "patient",
    dateOfBirth: "",
    phone: "",
    licenseNumber: "",
    specialization: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

  const passwordValidation = validatePassword(formData.password)
  const passwordsMatch = formData.password === formData.confirmPassword

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear messages when user starts typing
    if (error) setError(null)
    if (success) setSuccess(null)
  }

  const handleRoleChange = (value: "patient" | "doctor") => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      licenseNumber: value === "patient" ? "" : prev.licenseNumber,
      specialization: value === "patient" ? "" : prev.specialization,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    if (!agreedToTerms || !agreedToPrivacy) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await register(formData)

      if (result.success) {
        setSuccess("Registration successful! You can now access your account.")
        // Clear form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          role: "patient",
          dateOfBirth: "",
          phone: "",
          licenseNumber: "",
          specialization: "",
        })
        setAgreedToTerms(false)
        setAgreedToPrivacy(false)

        // Redirect to dashboard immediately since no email verification is needed
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        // Handle specific error cases
        if (result.error?.includes("already exists")) {
          setError(
            `${result.error} If this is your account, please try logging in instead or use the "Forgot Password" option if you can't remember your password.`,
          )
        } else {
          setError(result.error || "Registration failed")
        }
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.email.trim() &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    passwordValidation.isValid &&
    passwordsMatch &&
    agreedToTerms &&
    agreedToPrivacy &&
    (formData.role === "patient" || (formData.licenseNumber.trim() && formData.specialization.trim()))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Image src="/images/medi-ai-logo.png" alt="Medi.AI Logo" width={120} height={40} className="h-10 w-auto" />
          </div>
          <CardTitle className="text-2xl text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Join our secure healthcare platform - no email verification required!
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  disabled={isSubmitting || loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={isSubmitting || loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account type</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Healthcare Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "doctor" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License number</Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Enter license number"
                    disabled={isSubmitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="Enter specialization"
                    disabled={isSubmitting || loading}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of birth (optional)</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={isSubmitting || loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
                  disabled={isSubmitting || loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {formData.password && (
                <div className="text-xs space-y-1">
                  <div className="flex items-center space-x-2">
                    {formData.password.length >= passwordRequirements.minLength ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span>At least {passwordRequirements.minLength} characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/[A-Z]/.test(formData.password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span>One uppercase letter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/[a-z]/.test(formData.password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span>One lowercase letter</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/\d/.test(formData.password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span>One number</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span>One special character</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  disabled={isSubmitting || loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting || loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {formData.confirmPassword && (
                <div className="flex items-center space-x-2 text-xs">
                  {passwordsMatch ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                  disabled={isSubmitting || loading}
                />
                <Label htmlFor="agreedToTerms" className="text-sm leading-5">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreedToPrivacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={setAgreedToPrivacy}
                  disabled={isSubmitting || loading}
                />
                <Label htmlFor="agreedToPrivacy" className="text-sm leading-5">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>{" "}
                  and understand how my health data will be protected
                </Label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting || loading}>
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account & sign in"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
