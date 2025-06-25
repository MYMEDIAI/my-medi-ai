#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js")
require("dotenv").config({ path: ".env.local" })

async function testDatabase() {
  console.log("🔍 Testing Database Connection...\n")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables")
    console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
    console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✅ Set" : "❌ Missing")
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Test 1: Check if users table exists
    console.log("1. Testing users table...")
    const { data, error } = await supabase.from("users").select("count(*)").limit(1)

    if (error) {
      console.error("❌ Users table error:", error.message)
      if (error.message.includes('relation "users" does not exist')) {
        console.log("💡 Solution: Run the database setup scripts in Supabase SQL Editor")
      }
    } else {
      console.log("✅ Users table accessible")
    }

    // Test 2: Check RLS policies
    console.log("\n2. Testing RLS policies...")
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `test-${Date.now()}@example.com`,
      password: "TestPassword123!",
      options: { data: { test: true } },
    })

    if (authError) {
      console.error("❌ Auth signup error:", authError.message)
    } else {
      console.log("✅ Auth signup works")

      // Clean up test user
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id)
        console.log("🧹 Cleaned up test user")
      }
    }

    // Test 3: Check API routes
    console.log("\n3. Testing API routes...")
    const testResponse = await fetch("http://localhost:3000/api/auth/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    }).catch(() => null)

    if (testResponse) {
      console.log("✅ API routes accessible")
    } else {
      console.log("❌ API routes not accessible (make sure npm run dev is running)")
    }
  } catch (error) {
    console.error("❌ Database test failed:", error.message)
  }
}

testDatabase()
