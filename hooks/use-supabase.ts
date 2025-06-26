"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useState } from "react"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function useSupabase() {
  const [supabaseClient] = useState(() => createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY))

  return supabaseClient
}
