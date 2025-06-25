"use server"

import { createAdminClient, createServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

// Server action for user authentication
export async function authenticateUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}

// Server action for user registration
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const role = formData.get("role") as string

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Create user in database
  const adminClient = createAdminClient()

  if (data.user) {
    await adminClient.from("users").insert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      status: "active",
      email_verified: true,
    })
  }

  return { success: true, user: data.user }
}

// Server action for user logout
export async function logoutUser() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect("/")
}
