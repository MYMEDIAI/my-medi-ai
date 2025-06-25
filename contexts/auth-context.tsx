"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  UpdatePasswordData,
  UpdateProfileData,
} from "@/types/auth"
import { validatePassword, validateEmail, sanitizeInput } from "@/utils/validation"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  logoutAllDevices: () => Promise<void>
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; error?: string }>
  updatePassword: (data: UpdatePasswordData) => Promise<{ success: boolean; error?: string }>
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>
  deleteAccount: () => Promise<{ success: boolean; error?: string }>
  resendVerification: () => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }

  const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: userData, error } = await supabase.from("users").select("*").eq("id", supabaseUser.id).single()

      if (error || !userData) {
        console.error("Error fetching user data:", error)
        return null
      }

      return {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        status: userData.status,
        emailVerified: userData.email_verified,
        lastLogin: userData.last_login,
        createdAt: userData.created_at,
      }
    } catch (error) {
      console.error("Error mapping user:", error)
      return null
    }
  }

  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser()

      if (supabaseUser) {
        const user = await mapSupabaseUserToUser(supabaseUser)
        setState((prev) => ({ ...prev, user, loading: false }))
      } else {
        setState((prev) => ({ ...prev, user: null, loading: false }))
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setState((prev) => ({ ...prev, user: null, loading: false, error: "Failed to refresh user" }))
    }
  }, [])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUserToUser(session.user).then((user) => {
          setState((prev) => ({ ...prev, user, loading: false }))
        })
      } else {
        setState((prev) => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = await mapSupabaseUserToUser(session.user)
        setState((prev) => ({ ...prev, user, loading: false, error: null }))

        // Update last login
        await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", session.user.id)
      } else if (event === "SIGNED_OUT") {
        setState((prev) => ({ ...prev, user: null, loading: false, error: null }))
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        const user = await mapSupabaseUserToUser(session.user)
        setState((prev) => ({ ...prev, user }))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      // Validate input
      if (!validateEmail(credentials.email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      if (!credentials.password) {
        return { success: false, error: "Password is required" }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(credentials.email),
        password: credentials.password,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) {
        let errorMessage = "Login failed"
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password"
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please verify your email address before logging in"
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please try again later"
        }
        return { success: false, error: errorMessage }
      }

      if (!data.user) {
        return { success: false, error: "Login failed" }
      }

      // Set session persistence based on remember me
      if (credentials.rememberMe) {
        await supabase.auth.updateUser({
          data: { remember_me: true },
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      // Validate input
      if (!validateEmail(data.email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors[0] }
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, error: "Passwords do not match" }
      }

      if (!data.firstName.trim() || !data.lastName.trim()) {
        return { success: false, error: "First name and last name are required" }
      }

      // Doctor-specific validation
      if (data.role === "doctor") {
        if (!data.licenseNumber?.trim()) {
          return { success: false, error: "License number is required for doctors" }
        }
        if (!data.specialization?.trim()) {
          return { success: false, error: "Specialization is required for doctors" }
        }
      }

      // Check if user already exists in our database first
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, email, status")
        .eq("email", sanitizeInput(data.email))
        .single()

      if (existingUser) {
        if (existingUser.status === "pending_verification") {
          return {
            success: false,
            error:
              "An account with this email already exists and is pending verification. Please check your email or try resending the verification email.",
          }
        } else {
          return {
            success: false,
            error: "An account with this email already exists. Please try logging in instead.",
          }
        }
      }

      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizeInput(data.email),
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
          data: {
            first_name: sanitizeInput(data.firstName),
            last_name: sanitizeInput(data.lastName),
            role: data.role,
          },
        },
      })

      if (authError) {
        let errorMessage = "Registration failed"
        if (authError.message.includes("already registered")) {
          errorMessage = "An account with this email already exists"
        } else if (authError.message.includes("Password should be")) {
          errorMessage = "Password does not meet security requirements"
        } else if (authError.message.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Please try logging in instead."
        }
        return { success: false, error: errorMessage }
      }

      if (!authData.user) {
        return { success: false, error: "Registration failed" }
      }

      // Only create user record if Supabase Auth was successful
      try {
        const response = await fetch("/api/auth/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: authData.user.id,
            email: sanitizeInput(data.email),
            first_name: sanitizeInput(data.firstName),
            last_name: sanitizeInput(data.lastName),
            role: data.role,
            status: "pending_verification",
            date_of_birth: data.dateOfBirth || null,
            phone: data.phone ? sanitizeInput(data.phone) : null,
            license_number: data.licenseNumber ? sanitizeInput(data.licenseNumber) : null,
            specialization: data.specialization ? sanitizeInput(data.specialization) : null,
            email_verified: false,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("User creation error:", errorData)

          // If user creation fails, clean up the auth user
          try {
            await supabase.auth.signOut()
          } catch (cleanupError) {
            console.error("Error cleaning up auth user:", cleanupError)
          }

          // Check if it's a duplicate key error
          if (errorData.error?.includes("duplicate key") || errorData.error?.includes("users_email_key")) {
            return {
              success: false,
              error: "An account with this email already exists. Please try logging in instead.",
            }
          }

          return {
            success: false,
            error: errorData.error || "Registration failed. Please try again.",
          }
        }

        return { success: true }
      } catch (fetchError) {
        console.error("Network error during user creation:", fetchError)

        // Clean up auth user on network error
        try {
          await supabase.auth.signOut()
        } catch (cleanupError) {
          console.error("Error cleaning up auth user:", cleanupError)
        }

        return {
          success: false,
          error: "Network error during registration. Please check your connection and try again.",
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  const logoutAllDevices = async (): Promise<void> => {
    try {
      setLoading(true)
      await supabase.auth.signOut({ scope: "global" })
    } catch (error) {
      console.error("Logout all devices error:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      if (!validateEmail(data.email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(sanitizeInput(data.email), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: "Failed to send reset email. Please try again." }
      }

      return { success: true }
    } catch (error) {
      console.error("Reset password error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (data: UpdatePasswordData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      const passwordValidation = validatePassword(data.newPassword)
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors[0] }
      }

      if (data.newPassword !== data.confirmPassword) {
        return { success: false, error: "New passwords do not match" }
      }

      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (error) {
        return { success: false, error: "Failed to update password. Please try again." }
      }

      return { success: true }
    } catch (error) {
      console.error("Update password error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      if (!state.user) {
        return { success: false, error: "User not authenticated" }
      }

      if (!data.firstName.trim() || !data.lastName.trim()) {
        return { success: false, error: "First name and last name are required" }
      }

      const { error } = await supabase
        .from("users")
        .update({
          first_name: sanitizeInput(data.firstName),
          last_name: sanitizeInput(data.lastName),
          phone: data.phone ? sanitizeInput(data.phone) : null,
          date_of_birth: data.dateOfBirth || null,
          address: data.address || null,
          notification_preferences: data.notificationPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.user.id)

      if (error) {
        return { success: false, error: "Failed to update profile. Please try again." }
      }

      // Refresh user data
      await refreshUser()

      return { success: true }
    } catch (error) {
      console.error("Update profile error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      if (!state.user) {
        return { success: false, error: "User not authenticated" }
      }

      // First, anonymize user data (HIPAA compliance)
      const { error: updateError } = await supabase
        .from("users")
        .update({
          email: `deleted_${Date.now()}@deleted.com`,
          first_name: "Deleted",
          last_name: "User",
          phone: null,
          address: null,
          status: "inactive",
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.user.id)

      if (updateError) {
        return { success: false, error: "Failed to delete account. Please try again." }
      }

      // Then delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(state.user.id)

      if (authError) {
        return { success: false, error: "Failed to delete account. Please contact support." }
      }

      return { success: true }
    } catch (error) {
      console.error("Delete account error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      setError(null)

      if (!state.user) {
        return { success: false, error: "User not authenticated" }
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: state.user.email,
      })

      if (error) {
        return { success: false, error: "Failed to resend verification email. Please try again." }
      }

      return { success: true }
    } catch (error) {
      console.error("Resend verification error:", error)
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    logoutAllDevices,
    resetPassword,
    updatePassword,
    updateProfile,
    deleteAccount,
    resendVerification,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
