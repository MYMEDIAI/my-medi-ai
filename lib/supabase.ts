import { createClient } from "@supabase/supabase-js"
import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/* -------------------------------------------------------------------------- */
/*  Environment variables                                                     */
/* -------------------------------------------------------------------------- */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL/ANON_KEY")
}

/* -------------------------------------------------------------------------- */
/*  Browser singleton (avoids multiple GoTrue clients)                        */
/* -------------------------------------------------------------------------- */

let browserClient: ReturnType<typeof createClient> | null = null

export const supabase =
  typeof window === "undefined"
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) // each server request
    : (() => {
        if (!browserClient) {
          browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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

  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env var")
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/* -------------------------------------------------------------------------- */
/*  (Optional) re-export generated DB types                                   */
/* -------------------------------------------------------------------------- */
/* export type { Database } from "./__generated__/supabase" */
