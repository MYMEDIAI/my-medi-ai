import type { Metadata } from "next"
import TestImports from "@/components/test-imports"

export const metadata: Metadata = {
  title: "Import Testing - MyMedi.ai",
  description: "Testing component imports for deployment verification",
  robots: {
    index: false,
    follow: false,
  },
}

export default function TestImportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <TestImports />
      </div>
    </div>
  )
}
