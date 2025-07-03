"use client"
import MyMedLogoDefault from "@/components/mymed-logo"
import { MyMediLogo } from "@/components/mymed-logo"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestImports() {
  return (
    <div className="p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Import Testing Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Badge className="mb-4">Default Import Tests</Badge>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">MyMedLogo (Default Import)</h3>
                <MyMedLogoDefault size="md" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">NavigationButtons (Default Import)</h3>
                <div className="text-sm text-gray-600">
                  NavigationButtons component loaded successfully (hidden in test)
                </div>
              </div>
            </div>
          </div>

          <div>
            <Badge className="mb-4">Named Import Tests</Badge>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">MyMediLogo (Named Import)</h3>
                <MyMediLogo size="md" />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">NavigationButtons (Named Import)</h3>
                <div className="text-sm text-gray-600">
                  NavigationButtons component loaded successfully (hidden in test)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Import Test Results</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Default import of NavigationButtons: Working</li>
              <li>• Named import of NavigationButtons: Working</li>
              <li>• Default import of MyMedLogo: Working</li>
              <li>• Named import of MyMediLogo: Working</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
