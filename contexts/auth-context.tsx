"use client"

import type React from "react"
import { createContext } from "react"

type AuthContextValue = {
  user: null
  loading: false
  login: () => Promise<void>
  logout: () => Promise<void>
}

const noop = async () => {}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  login: noop,
  logout: noop,
})

/**
 * Demo auth hook - returns static values, no Supabase calls
 */
export function useAuth() {
  return {
    user: null,
    loading: false,
    login: noop,
    logout: noop,
  }
}

/**
 * Demo auth provider - just renders children, no auth logic
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = {
    user: null,
    loading: false,
    login: noop,
    logout: noop,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
