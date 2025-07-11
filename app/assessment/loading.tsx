import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AssessmentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header Skeleton */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Info Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>

                {/* Symptoms Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>

                {/* Medications Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-18" />
                  </div>
                </div>

                {/* Conditions Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="h-6 w-36" />
                  <div className="grid grid-cols-1 gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-4 w-4" />
                          <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24 mt-1" />
                          </div>
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel Skeleton */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Health Score Skeleton */}
                <div className="text-center">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-24 mx-auto mb-2" />
                  <Skeleton className="h-6 w-20 mx-auto mb-4" />
                  <Skeleton className="h-2 w-full" />
                </div>

                {/* Recommendations Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start">
                        <Skeleton className="h-2 w-2 rounded-full mt-2 mr-3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="space-y-3 pt-4 border-t">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
