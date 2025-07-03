"use client"

import VitalsTracker from "@/components/vitals-tracker"
import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function VitalsPage() {
  const handleReset = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-4">
            <Button onClick={handleReset} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              <span>Reset Vitals</span>
            </Button>
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">Vitals Tracking</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monitor your vital signs with intelligent analysis and trend tracking
            </p>
          </div>
          <VitalsTracker />
        </div>
      </div>

      <PoweredByFooter />
    </div>
  )
}
