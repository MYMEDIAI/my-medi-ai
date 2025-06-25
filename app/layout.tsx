import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata: Metadata = {
  title: "Medi.AI - Secure Healthcare Platform",
  description: "AI-powered healthcare platform with HIPAA-compliant security",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Auth context is now ALWAYS available */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
