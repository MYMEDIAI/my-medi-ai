import { createAdminClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Use service-role client to bypass RLS (no RLS recursion)
    const supabase = createAdminClient()

    const { error } = await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", userId)

    if (error) {
      console.error("Error updating last login:", error)
      return NextResponse.json({ error: "Failed to update last login" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
