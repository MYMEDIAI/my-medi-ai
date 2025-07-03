"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Menu, X, User, MessageSquare, Activity, Apple, Baby, UserCheck, Home, RefreshCw } from "lucide-react"

interface NavigationButtonsProps {
  showReset?: boolean
}

export default function NavigationButtons({ showReset = true }: NavigationButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleReset = () => {
    window.location.reload()
  }

  const navigationItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      color: "text-gray-600 hover:text-gray-800",
      bgColor: "hover:bg-gray-50",
    },
    {
      href: "/assessment",
      icon: User,
      label: "Assessment",
      color: "text-blue-600 hover:text-blue-800",
      bgColor: "hover:bg-blue-50",
    },
    {
      href: "/chat",
      icon: MessageSquare,
      label: "AI Chat",
      color: "text-purple-600 hover:text-purple-800",
      bgColor: "hover:bg-purple-50",
    },
    {
      href: "/vitals",
      icon: Activity,
      label: "Vitals",
      color: "text-red-600 hover:text-red-800",
      bgColor: "hover:bg-red-50",
    },
    {
      href: "/diet",
      icon: Apple,
      label: "Diet",
      color: "text-green-600 hover:text-green-800",
      bgColor: "hover:bg-green-50",
    },
    {
      href: "/pregnancy",
      icon: Baby,
      label: "Pregnancy",
      color: "text-pink-600 hover:text-pink-800",
      bgColor: "hover:bg-pink-50",
    },
    {
      href: "/doctors",
      icon: UserCheck,
      label: "Doctors",
      color: "text-emerald-600 hover:text-emerald-800",
      bgColor: "hover:bg-emerald-50",
    },
  ]

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-3rem)]" onClick={(e) => e.stopPropagation()}>
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Navigation</h3>
                  <Badge className="bg-blue-100 text-blue-800">MyMedi.ai</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className={`w-full h-16 flex flex-col items-center justify-center space-y-1 ${item.color} ${item.bgColor} border-gray-200 bg-transparent`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>

                {showReset && (
                  <div className="border-t border-gray-200 pt-4">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset Current Page</span>
                    </Button>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">AI-Powered Healthcare Platform</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
