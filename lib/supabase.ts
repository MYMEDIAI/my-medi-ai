;/import { createClient } from '@supabase/aabepssu - js
'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // ⬅️  do not store access/refresh tokens
    autoRefreshToken: false, // ⬅️  do not attempt silent refresh
  },
})
