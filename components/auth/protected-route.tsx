"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "patient" | "doctor" | "admin"
  requireEmailVerification?: boolean
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireEmailVerification = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
        return
      }

      if (requireEmailVerification && !user.emailVerified) {
        router.push("/auth/verify-email")
        return
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized")
        return
      }

      if (user.status !== "active") {
        router.push("/account-suspended")
        return
      }
    }
  }, [user, loading, router, requiredRole, requireEmailVerification])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireEmailVerification && !user.emailVerified) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  if (user.status !== "active") {
    return null
  }

  return <>{children}</>
}
