"use client"

/*
  A lightweight authentication context.
  – Retrieves the current Supabase user (if any) on mount
  – Exposes user, loading, signIn(), signOut()
  – Provides a `useAuth` hook for convenient access
*/

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@supabase/ssr" // already in deps

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createBrowserSupabaseClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value: AuthContextValue = { user, loading, signIn, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth – hook to access AuthContext
 *
 * Example:
 * const { user, loading, signIn, signOut } = useAuth()
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
