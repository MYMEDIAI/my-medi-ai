"use client"

import type React from "react"
import { LayoutDashboard, Settings, Calendar, HelpCircle, User2, ShieldCheck, Target, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context" // Fixed import path from /context to /contexts

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User2,
    href: "/dashboard/profile",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
  },
  {
    id: "family-health",
    label: "Family Health",
    icon: ShieldCheck,
    href: "/dashboard/family-health",
  },
  {
    id: "goals",
    label: "Health Goals",
    icon: Target,
    href: "/dashboard/goals",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: HelpCircle,
    href: "/dashboard/help",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // Optionally redirect to home page after logout
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 py-4 px-3">
        <div className="font-bold text-xl mb-6">Health Dashboard</div>
        <nav>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.id} className="mb-2">
                <a href={item.href} className="flex items-center py-2 px-4 rounded-md hover:bg-gray-100">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <div className="flex justify-end mb-4">
          {/* Quick Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
        {children}
      </main>
    </div>
  )
}
