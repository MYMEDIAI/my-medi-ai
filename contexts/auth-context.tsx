"use client"

import type React from "react"

/**
 * Demo-mode stub of the old AuthContext.
 * Provides empty user info and no-op helpers so that
 * legacy imports (`useAuth`, `AuthProvider`) compile.
 */
import { createContext, useContext } from "react"

type AuthContextValue = {
  user: null
  login: () => Promise<void>
  logout: () => Promise<void>
}

const noop = async () => {}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: noop,
  logout: noop,
})

/**
 * Legacy hook – returns an object with `user`, `login`, `logout`
 * but does nothing because the demo is unauthenticated.
 */
export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Stub provider – simply renders children without altering them.
 * Keeps the component tree intact for pages still wrapping with `<AuthProvider>`.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContext.Provider value={{ user: null, login: noop, logout: noop }}>{children}</AuthContext.Provider>
}
