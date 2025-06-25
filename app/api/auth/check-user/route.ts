import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Use server client with service role to bypass RLS
    const supabase = createServerClient()

    const { data: user, error } = await supabase.from("users").select("id, email, status").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") {
        // User not found
        return NextResponse.json({ exists: false })
      }
      console.error("Error checking user:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({
      exists: true,
      status: user.status,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
