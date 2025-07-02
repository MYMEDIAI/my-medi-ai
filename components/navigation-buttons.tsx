"use client"

import { Button } from "@/components/ui/button"
import { Home, User, Activity, MessageSquare, UserCheck } from "lucide-react"
import Link from "next/link"

export default function NavigationButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-3">
        {/* Back to Home */}
        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 hover:from-blue-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-14 h-14"
          >
            <Home className="w-6 h-6" />
          </Button>
        </Link>

        {/* Quick Access Menu */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
          <div className="text-xs font-semibold text-gray-600 mb-3 text-center">Quick Access</div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/assessment">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                <User className="w-3 h-3 mr-1" />
                Patient
              </Button>
            </Link>
            <Link href="/doctors">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <UserCheck className="w-3 h-3 mr-1" />
                Doctor
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                AI Chat
              </Button>
            </Link>
            <Link href="/vitals">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
              >
                <Activity className="w-3 h-3 mr-1" />
                Vitals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
