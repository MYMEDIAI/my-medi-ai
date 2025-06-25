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

  // Ensure we're only running on the client side
  useEffect(() => {
    if (typeof window === "undefined") return

    // Clear any duplicate auth listeners
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {})
    subscription.unsubscribe()
  }, [])

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }))
  }

  const mapSupabaseUserToUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      console.log("Mapping user:", supabaseUser.id, supabaseUser.email)

      // Use service role client to avoid RLS issues when fetching user data
      const response = await fetch("/api/auth/get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: supabaseUser.id }),
      })

      if (!response.ok) {
        console.error("Error fetching user data from API:", response.status, response.statusText)

        // If user doesn't exist in database, create a basic user object from Supabase user
        if (response.status === 404) {
          console.log("User not found in database, using Supabase user data")
          return {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            firstName: supabaseUser.user_metadata?.first_name || "User",
            lastName: supabaseUser.user_metadata?.last_name || "",
            role: supabaseUser.user_metadata?.role || "patient",
            status: "active", // Always active since we removed email verification
            emailVerified: true, // Always true since we removed email verification
            lastLogin: supabaseUser.last_sign_in_at,
            createdAt: supabaseUser.created_at,
          }
        }
        return null
      }

      const { user: userData } = await response.json()

      if (!userData) {
        console.error("No user data returned from API")
        return null
      }

      return {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        status: userData.status,
        emailVerified: true, // Always true since we removed email verification
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
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting initial session:", error)
          if (mounted) {
            setState((prev) => ({ ...prev, loading: false, error: "Failed to get session" }))
          }
          return
        }

        console.log("Initial session:", session ? "Found" : "None", session?.user?.id)

        if (session?.user && mounted) {
          const user = await mapSupabaseUserToUser(session.user)
          setState((prev) => ({ ...prev, user, loading: false }))
        } else if (mounted) {
          setState((prev) => ({ ...prev, user: null, loading: false }))
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        if (mounted) {
          setState((prev) => ({ ...prev, user: null, loading: false, error: "Session initialization failed" }))
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("Auth state change:", event, session?.user?.id || "no user")

      try {
        switch (event) {
          case "INITIAL_SESSION":
            // Handle initial session (this might be called with null session)
            if (session?.user) {
              const user = await mapSupabaseUserToUser(session.user)
              setState((prev) => ({ ...prev, user, loading: false, error: null }))
            } else {
              setState((prev) => ({ ...prev, user: null, loading: false, error: null }))
            }
            break

          case "SIGNED_IN":
            if (session?.user) {
              const user = await mapSupabaseUserToUser(session.user)
              setState((prev) => ({ ...prev, user, loading: false, error: null }))

              // Update last login using API route to avoid RLS issues
              try {
                await fetch("/api/auth/update-last-login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ userId: session.user.id }),
                })
              } catch (error) {
                console.error("Error updating last login:", error)
              }
            }
            break

          case "SIGNED_OUT":
            setState((prev) => ({ ...prev, user: null, loading: false, error: null }))
            break

          case "TOKEN_REFRESHED":
            if (session?.user) {
              const user = await mapSupabaseUserToUser(session.user)
              setState((prev) => ({ ...prev, user }))
            }
            break

          case "USER_UPDATED":
            if (session?.user) {
              const user = await mapSupabaseUserToUser(session.user)
              setState((prev) => ({ ...prev, user }))
            }
            break

          default:
            console.log("Unhandled auth event:", event)
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
        setState((prev) => ({ ...prev, error: "Authentication error occurred" }))
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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

      // Check if user already exists using API route to avoid RLS issues
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: sanitizeInput(data.email) }),
      })

      if (checkResponse.ok) {
        const { exists } = await checkResponse.json()
        if (exists) {
          return {
            success: false,
            error: "An account with this email already exists. Please try logging in instead.",
          }
        }
      }

      // Register with Supabase Auth - NO EMAIL CONFIRMATION REQUIRED
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: sanitizeInput(data.email),
        password: data.password,
        options: {
          emailRedirectTo: undefined, // Remove email redirect
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
            status: "active", // Set to active immediately
            date_of_birth: data.dateOfBirth || null,
            phone: data.phone ? sanitizeInput(data.phone) : null,
            license_number: data.licenseNumber ? sanitizeInput(data.licenseNumber) : null,
            specialization: data.specialization ? sanitizeInput(data.specialization) : null,
            email_verified: true, // Set to true immediately
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

      // Use API route to avoid RLS issues
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: state.user.id,
          first_name: sanitizeInput(data.firstName),
          last_name: sanitizeInput(data.lastName),
          phone: data.phone ? sanitizeInput(data.phone) : null,
          date_of_birth: data.dateOfBirth || null,
          address: data.address || null,
          notification_preferences: data.notificationPreferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, error: errorData.error || "Failed to update profile. Please try again." }
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

      // Use API route to delete account
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: state.user.id }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { success: false, error: errorData.error || "Failed to delete account. Please try again." }
      }

      return { success: true }
    } catch (error) {
      console.error("Delete account error:", error)
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
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
