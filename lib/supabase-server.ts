import { createServerClient as createServerClientBrowser, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/* -------------------------------------------------------------------------- */
/*  Helper: cookie-aware server client (anon key - obeys RLS)                 */
/* -------------------------------------------------------------------------- */

export function createServerClient() {
  const store = cookies()

  return createServerClientBrowser(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
