"use client"

import { Button } from "@/components/ui/button"
import { Home, RotateCcw, MessageCircle } from "lucide-react"
import Link from "next/link"

interface NavigationButtonsProps {
  onReset?: () => void
  showReset?: boolean
  variant?: "default" | "compact"
  className?: string
}

export default function NavigationButtons({
  onReset,
  showReset = true,
  variant = "default",
  className = "",
}: NavigationButtonsProps) {
  const isCompact = variant === "compact"

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Link href="/">
        <Button variant="outline" size={isCompact ? "sm" : "default"} className="bg-white hover:bg-gray-50">
          <Home className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mr-2`} />
          {isCompact ? "Home" : "Return to Home"}
        </Button>
      </Link>

      {showReset && onReset && (
        <Button
          variant="outline"
          size={isCompact ? "sm" : "default"}
          onClick={onReset}
          className="bg-white hover:bg-gray-50"
        >
          <RotateCcw className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mr-2`} />
          Reset
        </Button>
      )}

      <Link href="/chat">
        <Button size={isCompact ? "sm" : "default"} className="bg-purple-600 hover:bg-purple-700 text-white">
          <MessageCircle className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mr-2`} />
          Quick Chat
        </Button>
      </Link>
    </div>
  )
}
