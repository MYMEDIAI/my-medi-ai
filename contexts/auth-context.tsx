"use client"

import type React from "react"

// Pure demo context - no external imports
export function useAuth() {
  return {
    user: {
      id: "demo-123",
      email: "demo@medi.ai",
      name: "Demo User",
    },
    loading: false,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
