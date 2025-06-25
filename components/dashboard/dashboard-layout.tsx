"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  MessageSquare,
  Activity,
  Users,
  Settings,
  HelpCircle,
  Menu,
  X,
  Bell,
  ArrowLeft,
  Phone,
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Health Records", href: "/dashboard/records", icon: FileText },
    { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: MessageSquare },
    { name: "Vitals Tracking", href: "/dashboard/vitals", icon: Activity },
    { name: "Family Health", href: "/dashboard/family", icon: Users },
    { name: "Health Goals", href: "/dashboard/goals", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <img src="/images/medi-ai-logo.png" alt="Medi.AI Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-semibold text-blue-900">Medi.AI</span>
          </div>
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-700" : "text-gray-500 group-hover:text-blue-500"
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Demo Notice */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs font-medium text-purple-800 mb-1">🎯 Demo Mode</div>
            <div className="text-xs text-purple-600">
              This is an interactive demo showcasing AI healthcare features.
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm">
          <div className="flex items-center">
            <button
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              href="/"
              className="ml-2 flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-purple-50 border border-purple-200 rounded-full px-3 py-1">
              <span className="text-xs font-medium text-purple-800">🎯 Live Demo</span>
            </div>

            <button className="rounded-full bg-white p-1 text-gray-500 hover:text-blue-600">
              <Bell className="h-6 w-6" />
            </button>

            <button className="flex items-center rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200">
              <Phone className="mr-2 h-4 w-4" />
              Emergency
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
