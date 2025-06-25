/**
 * Demo-mode stub for Supabase.
 * It satisfies `import { supabase } from "@/lib/supabase"`
 * without including any auth logic or making network requests.
 *
 * Every method returns a resolved Promise with
 *   { data: null, error: null }
 * so calls like `supabase.from('table').select()` are safe.
 */

type SupabaseResponse<T = unknown> = Promise<{ data: T; error: null }>

function resolved<T = unknown>(data: T = null as unknown as T): SupabaseResponse<T> {
  return Promise.resolve({ data, error: null })
}

function emptyQueryBuilder() {
  /* query builder with noop CRUD methods */
  return {
    select: () => resolved<[]>([]),
    insert: () => resolved(),
    update: () => resolved(),
    delete: () => resolved(),
    single: () => resolved(),
    eq: () => emptyQueryBuilder(), // allow chaining like .eq().select()
  }
}

export const supabase = {
  /* ---------- Auth stubs ---------- */
  auth: {
    signInWithPassword: resolved,
    signUp: resolved,
    signOut: resolved,
    getSession: resolved,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
  },

  /* ---------- Query stubs ---------- */
  from: () => emptyQueryBuilder(),
  rpc: () => resolved(),
  storage: {
    from: () => ({
      upload: resolved,
      download: resolved,
      remove: resolved,
      list: resolved<[]>([]),
    }),
  },

  /* ---------- Edge-case helpers ---------- */
  functions: {
    invoke: resolved,
  },
} as const
