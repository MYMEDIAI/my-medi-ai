"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function useSupabase() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side and supabase is ready
    if (typeof window !== "undefined") {
      setIsReady(true)
    }
  }, [])

  return {
    supabase: isReady ? supabase : null,
    isReady,
  }
}
