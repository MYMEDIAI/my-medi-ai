import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    if (!userData?.email || !userData?.id) {
      return NextResponse.json({ error: "Missing required fields (email, id)" }, { status: 400 })
    }

    // Create a server-side Supabase client with admin privileges
    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id, email, status")
      .eq("email", userData.email)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is expected for new users
      console.error("Error checking existing user:", checkError)
      return NextResponse.json({ error: "Database error while checking user" }, { status: 500 })
    }

    if (existingUser) {
      // User already exists
      if (existingUser.id === userData.id) {
        // Same user ID, this is likely a retry - return success
        console.log("User already exists with same ID, treating as success")
        return NextResponse.json({ success: true })
      } else {
        // Different user ID with same email - this is a conflict
        console.error("Email already exists with different user ID")
        return NextResponse.json(
          {
            error: "An account with this email already exists",
          },
          { status: 409 },
        )
      }
    }

    // Generate a placeholder password hash since the actual auth is handled by Supabase Auth
    const placeholderHash = crypto.createHash("sha256").update("SUPABASE_AUTH_MANAGED_PASSWORD").digest("hex")

    // Add the password_hash to the user data
    const userDataWithHash = {
      ...userData,
      password_hash: placeholderHash,
    }

    // Insert the new user
    const { error: insertError } = await supabase.from("users").insert(userDataWithHash)

    if (insertError) {
      console.error("Error creating user:", insertError)

      // Handle specific error types
      if (insertError.code === "23505") {
        // Unique constraint violation
        if (insertError.message.includes("users_email_key")) {
          return NextResponse.json(
            {
              error: "An account with this email already exists",
            },
            { status: 409 },
          )
        }
      }

      return NextResponse.json(
        {
          error: `Failed to create user: ${insertError.message}`,
        },
        { status: 500 },
      )
    }

    console.log("User created successfully:", userData.email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
