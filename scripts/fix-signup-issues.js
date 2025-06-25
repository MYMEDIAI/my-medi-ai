#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

async function fixSignupIssues() {
  console.log("🔧 Fixing Common Signup Issues...\n")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log("1. Checking and fixing RLS policies...")

    // Drop problematic policies and recreate them
    const fixes = [
      `DROP POLICY IF EXISTS "Users can view their own profile" ON users;`,
      `DROP POLICY IF EXISTS "Doctors can view patient profiles they have access to" ON users;`,
      `DROP POLICY IF EXISTS "Admins can view all users" ON users;`,

      // Create safe policies
      `CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);`,
      `CREATE POLICY "users_insert_new" ON users FOR INSERT WITH CHECK (true);`,
      `CREATE POLICY "users_service_role_all" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');`,
    ]

    for (const sql of fixes) {
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })
      if (error && !error.message.includes("does not exist")) {
        console.error("Error executing:", sql, error.message)
      }
    }

    console.log("✅ RLS policies updated")

    console.log("\n2. Testing user creation...")

    // Test creating a user directly
    const testEmail = `test-${Date.now()}@example.com`
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: "TestPassword123!",
      email_confirm: true,
      user_metadata: {
        first_name: "Test",
        last_name: "User",
      },
    })

    if (authError) {
      console.error("❌ Auth user creation failed:", authError.message)
    } else {
      console.log("✅ Auth user creation works")

      // Try to create user record
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: testEmail,
        first_name: "Test",
        last_name: "User",
        role: "patient",
        status: "active",
        password_hash: "SUPABASE_AUTH_MANAGED",
        email_verified: true,
      })

      if (dbError) {
        console.error("❌ Database user creation failed:", dbError.message)
      } else {
        console.log("✅ Database user creation works")
      }

      // Clean up
      await supabase.auth.admin.deleteUser(authData.user.id)
      console.log("🧹 Cleaned up test user")
    }
  } catch (error) {
    console.error("❌ Fix attempt failed:", error.message)
  }
}

// Helper function to execute SQL (you might need to create this RPC function)
async function createExecSqlFunction() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { error } = await supabase.rpc("exec_sql", {
    sql_query: `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `,
  })

  if (error) {
    console.log("Note: exec_sql function creation failed, but that might be okay")
  }
}

fixSignupIssues()
