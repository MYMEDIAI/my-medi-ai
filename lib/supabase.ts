import { createClient } from "@supabase/supabase-js"
import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/* -------------------------------------------------------------------------- */
/*  Environment variables - Server-side only access                           */
/* -------------------------------------------------------------------------- */

// These are only accessed server-side
const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  return url
}

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return key
}

const getServiceRoleKey = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
  return key
}

/* -------------------------------------------------------------------------- */
/*  Browser singleton (avoids multiple GoTrue clients)                        */
/* -------------------------------------------------------------------------- */

let browserClient: ReturnType<typeof createClient> | null = null

// For client-side usage (SSR safe)
export const supabase =
  typeof window === "undefined"
    ? // Server-side: Create a new client for each request
      createClient(getSupabaseUrl(), getSupabaseAnonKey())
    : // Client-side: Use singleton pattern
      (() => {
        if (!browserClient) {
          // In the browser, we can safely use the public URL and anon key
          // which are embedded in the client bundle during build
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

          browserClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
              persistSession: true,
              storageKey: "medi-ai-auth",
            },
          })
        }
        return browserClient
      })()

/* -------------------------------------------------------------------------- */
/*  Helper: cookie-aware server client (anon key - obeys RLS)                 */
/* -------------------------------------------------------------------------- */

export function createServerClient() {
  const store = cookies()

  return createSupabaseServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(name: string) {
        return store.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          store.set({ name, value, ...options })
        } catch {
          /* ignored – e.g. during static generation */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          store.set({ name, value: "", ...options })
        } catch {
          /* ignored */
        }
      },
    },
  })
}

/* -------------------------------------------------------------------------- */
/*  Helper: service-role client (bypasses ALL RLS – use in API routes)        */
/* -------------------------------------------------------------------------- */

export function createAdminClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
