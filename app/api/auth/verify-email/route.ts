import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, type, email } = await request.json()

    const supabase = createServerClient()

    // Verify the email with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any,
      email,
    })

    if (error) {
      console.error("Email verification error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Update user status in our database
      const { error: updateError } = await supabase
        .from("users")
        .update({
          email_verified: true,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.user.id)

      if (updateError) {
        console.error("Error updating user status:", updateError)
        return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
