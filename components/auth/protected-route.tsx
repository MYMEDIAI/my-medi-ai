"use client"

import type React from "react"

/**
 * Demo-mode stub for `ProtectedRoute`.
 * In production it would redirect unauthenticated users, but
 * in the demo it just renders children unconditionally.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
