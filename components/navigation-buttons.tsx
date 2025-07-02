"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, MessageCircle, Activity, Apple, Heart } from "lucide-react"

interface NavigationButtonsProps {
  showReset?: boolean
}

export default function NavigationButtons({ showReset = true }: NavigationButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Link href="/">
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>
      </Link>

      <Link href="/chat">
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Chat</span>
        </Button>
      </Link>

      <Link href="/vitals">
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Vitals</span>
        </Button>
      </Link>

      <Link href="/diet">
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <Apple className="w-4 h-4" />
          <span className="hidden sm:inline">Diet</span>
        </Button>
      </Link>

      <Link href="/pregnancy">
        <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline">Pregnancy</span>
        </Button>
      </Link>
    </div>
  )
}
