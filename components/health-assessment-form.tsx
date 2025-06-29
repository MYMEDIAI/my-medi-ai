"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import MyMedLogo from "./mymed-logo"

export default function HealthAssessmentForm() {
  // --- simple demo state ----------------------------------------------------
  const [done, setDone] = useState(false)

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex justify-center">
        <MyMedLogo size="lg" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revolutionary AI Health Assessment</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!done ? (
            <>
              <p className="text-sm text-muted-foreground">
                The original multi-step form is temporarily replaced with this stub to unblock deployment. Press the
                button below to simulate completion.
              </p>
              <Button onClick={() => setDone(true)}>Run demo assessment</Button>
            </>
          ) : (
            <>
              <p className="font-semibold text-green-600">✅ Assessment generated successfully!</p>
              <Button onClick={() => setDone(false)} variant="outline">
                Start over
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
