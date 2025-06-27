"use client"

import MyMedLogo from "./mymed-logo"

export default function PoweredByFooter() {
  return (
    <div className="bg-gray-50 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Powered by</span>
          <MyMedLogo size="sm" />
        </div>
        <div className="text-center mt-2 text-xs text-gray-500">
          Your AI Healthcare Assistant • HIPAA Compliant • Secure & Private
        </div>
      </div>
    </div>
  )
}
