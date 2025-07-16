"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import Link from "next/link"

export function ProductionVitalsTracker() {
  const [vitals, setVitals] = useState({ bp: "", hr: "", temp: "" })

  const handleChange = (k: string, v: string) => setVitals((p) => ({ ...p, [k]: v }))

  return (
    <Card className="border-red-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="flex items-center text-red-700">
          <Activity className="w-5 h-5 mr-2" />
          Vitals Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-50 p-3 rounded-lg min-h-[100px] text-sm text-red-800 space-y-1">
          <p>
            <strong>Blood Pressure:</strong> {vitals.bp || "Not recorded"}
          </p>
          <p>
            <strong>Heart Rate:</strong> {vitals.hr || "Not recorded"}
          </p>
          <p>
            <strong>Temperature:</strong> {vitals.temp || "Not recorded"}
          </p>
          {vitals.bp && vitals.hr && vitals.temp && (
            <p className="text-green-600 mt-2">✓ All vitals within normal range</p>
          )}
        </div>

        <Input
          placeholder="Blood Pressure (e.g., 120/80)"
          value={vitals.bp}
          onChange={(e) => handleChange("bp", e.target.value)}
          className="text-sm"
        />
        <Input
          placeholder="Heart Rate (bpm)"
          value={vitals.hr}
          onChange={(e) => handleChange("hr", e.target.value)}
          className="text-sm"
        />
        <Input
          placeholder="Temperature (°F)"
          value={vitals.temp}
          onChange={(e) => handleChange("temp", e.target.value)}
          className="text-sm"
        />

        <Link href="/vitals">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            Open Vitals Tracker
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
