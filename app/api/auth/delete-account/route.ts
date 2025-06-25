import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Use server client with service role to bypass RLS
    const supabase = createServerClient()

    // First, anonymize user data (HIPAA compliance)
    const { error: updateError } = await supabase
      .from("users")
      .update({
        email: `deleted_${Date.now()}@deleted.com`,
        first_name: "Deleted",
        last_name: "User",
        phone: null,
        address: null,
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error anonymizing user data:", updateError)
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
    }

    // Then delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return NextResponse.json({ error: "Failed to delete account completely" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
