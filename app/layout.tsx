import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

export const metadata = {
  title: "My Medi.AI - AI Healthcare Platform",
  description: "AI-powered healthcare platform for 1 billion people",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
