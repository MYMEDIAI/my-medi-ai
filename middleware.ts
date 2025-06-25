import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that just passes through requests
export function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match dashboard routes for auth protection
    "/dashboard/:path*",
  ],
}
