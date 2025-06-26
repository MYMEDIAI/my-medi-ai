"use client"

/*
  ProtectedRoute – simple wrapper to guard pages/components that require auth.
  Redirects unauthenticated users to /login (adjust path if needed).
*/

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    // Simple full-page spinner while checking auth
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="sr-only">{"Loading"}</span>
      </div>
    )
  }

  return <>{children}</>
}
