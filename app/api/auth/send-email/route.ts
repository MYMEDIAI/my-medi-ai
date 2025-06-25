import { NextResponse } from "next/server"
import { emailService } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const { type, to, firstName, url } = await request.json()

    let success = false

    switch (type) {
      case "verification":
        success = await emailService.sendVerificationEmail({
          to,
          firstName,
          verificationUrl: url,
        })
        break

      case "password-reset":
        success = await emailService.sendPasswordResetEmail({
          to,
          firstName,
          resetUrl: url,
        })
        break

      case "welcome":
        success = await emailService.sendWelcomeEmail({
          to,
          firstName,
          dashboardUrl: url,
        })
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
