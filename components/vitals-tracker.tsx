"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MyMedLogo from "./mymed-logo"
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Printer,
  BrainCircuit,
  Sparkles,
  Info,
} from "lucide-react"
import type { ElementType } from "react"

interface VitalReading {
  id: string
  type: string
  value: string
  unit: string
  timestamp: Date
  status: "normal" | "warning" | "critical"
  notes?: string
}

export default function VitalsTracker() {
  const [vitals, setVitals] = useState<VitalReading[]>([
    {
      id: "1",
      type: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "normal",
    },
    {
      id: "2",
      type: "Heart Rate",
      value: "72",
      unit: "bpm",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: "normal",
    },
    {
      id: "3",
      type: "Blood Glucose",
      value: "150",
      unit: "mg/dL",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "warning",
    },
    {
      id: "4",
      type: "Temperature",
      value: "101.5",
      unit: "°F",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "critical",
    },
  ])

  const [newVital, setNewVital] = useState({
    type: "Blood Pressure",
    value: "",
    unit: "mmHg",
    notes: "",
  })

  const vitalMeta: {
    [key: string]: {
      unit: string
      icon: ElementType
      normalRange: string
      color: string
    }
  } = {
    "Blood Pressure": { unit: "mmHg", icon: Activity, normalRange: "90/60 - 140/90", color: "text-red-500" },
    "Heart Rate": { unit: "bpm", icon: Heart, normalRange: "60-100", color: "text-pink-500" },
    "Blood Glucose": { unit: "mg/dL", icon: Droplets, normalRange: "70-140", color: "text-blue-500" },
    Temperature: { unit: "°F", icon: Thermometer, normalRange: "97-99", color: "text-orange-500" },
    SpO2: { unit: "%", icon: Activity, normalRange: "95-100", color: "text-cyan-500" },
    Weight: { unit: "lbs", icon: TrendingUp, normalRange: "Individual", color: "text-indigo-500" },
  }

  const getVitalStatus = (type: string, value: string): "normal" | "warning" | "critical" => {
    const numValue = Number.parseFloat(value.split("/")[0])
    if (isNaN(numValue)) return "normal"

    switch (type) {
      case "Blood Pressure":
        const parts = value.split("/")
        if (parts.length !== 2) return "normal"
        const systolic = Number.parseInt(parts[0])
        const diastolic = Number.parseInt(parts[1])
        if (isNaN(systolic) || isNaN(diastolic)) return "normal"
        if (systolic >= 140 || diastolic >= 90) return "critical"
        if (systolic >= 130 || diastolic >= 80) return "warning"
        return "normal"
      case "Heart Rate":
        if (numValue < 50 || numValue > 120) return "critical"
        if (numValue < 60 || numValue > 100) return "warning"
        return "normal"
      case "Blood Glucose":
        if (numValue < 50 || numValue > 200) return "critical"
        if (numValue < 70 || numValue > 140) return "warning"
        return "normal"
      case "Temperature":
        if (numValue < 95 || numValue > 101) return "critical"
        if (numValue < 97 || numValue > 99) return "warning"
        return "normal"
      case "SpO2":
        if (numValue < 90) return "critical"
        if (numValue < 95) return "warning"
        return "normal"
      default:
        return "normal"
    }
  }

  const handleAddVital = () => {
    if (!newVital.value) return
    const status = getVitalStatus(newVital.type, newVital.value)
    const vital: VitalReading = {
      id: Date.now().toString(),
      type: newVital.type,
      value: newVital.value,
      unit: newVital.unit,
      timestamp: new Date(),
      status,
      notes: newVital.notes || undefined,
    }
    setVitals([vital, ...vitals])
    setNewVital({ ...newVital, value: "", notes: "" })
  }

  const getStatusStyles = (status: "normal" | "warning" | "critical") => {
    switch (status) {
      case "normal":
        return {
          border: "border-green-500",
          text: "text-green-700",
          bg: "bg-green-50",
          icon: <CheckCircle className="w-4 h-4" />,
        }
      case "warning":
        return {
          border: "border-yellow-500",
          text: "text-yellow-700",
          bg: "bg-yellow-50",
          icon: <AlertTriangle className="w-4 h-4" />,
        }
      case "critical":
        return {
          border: "border-red-500",
          text: "text-red-700",
          bg: "bg-red-50",
          icon: <AlertTriangle className="w-4 h-4" />,
        }
    }
  }

  const criticalAlerts = vitals.filter((v) => v.status === "critical")
  const warningAlerts = vitals.filter((v) => v.status === "warning")

  return (
    <div className="max-w-6xl mx-auto space-y-6 printable-report">
      <Card className="no-print">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MyMedLogo size="sm" showText={false} />
              <span>Record New Vital Signs</span>
            </div>
            <Button onClick={() => window.print()} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </CardTitle>
          <CardDescription>Enter your latest vital readings below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vital-type">Vital Sign Type</Label>
              <select
                id="vital-type"
                value={newVital.type}
                onChange={(e) => {
                  setNewVital({
                    ...newVital,
                    type: e.target.value,
                    unit: vitalMeta[e.target.value]?.unit || "",
                  })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.keys(vitalMeta).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="vital-value">Value</Label>
              <div className="flex">
                <Input
                  id="vital-value"
                  value={newVital.value}
                  onChange={(e) => setNewVital({ ...newVital, value: e.target.value })}
                  placeholder={newVital.type === "Blood Pressure" ? "120/80" : "0"}
                  className="focus:ring-purple-500"
                />
                <span className="flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600">
                  {newVital.unit}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="vital-notes">Notes (Optional)</Label>
              <Input
                id="vital-notes"
                value={newVital.notes}
                onChange={(e) => setNewVital({ ...newVital, notes: e.target.value })}
                placeholder="e.g., after exercise"
                className="focus:ring-purple-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-600">Normal range: {vitalMeta[newVital.type]?.normalRange}</div>
          <Button onClick={handleAddVital} className="bg-purple-600 hover:bg-purple-700">
            <Activity className="w-4 h-4 mr-2" />
            Record Vital
          </Button>
        </CardFooter>
      </Card>

      {/* Printable Report Section */}
      <div className="space-y-6">
        <Card className="print-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span>Vitals History & Report</span>
            </CardTitle>
            <CardDescription>A summary of your recent vital signs.</CardDescription>
          </CardHeader>
          <CardContent>
            {criticalAlerts.length > 0 && (
              <Alert className="border-red-500 bg-red-50 mb-4">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Critical Alert:</strong> You have {criticalAlerts.length} critical readings. Please consult
                  your healthcare provider immediately.
                </AlertDescription>
              </Alert>
            )}
            {warningAlerts.length > 0 && (
              <Alert className="border-yellow-500 bg-yellow-50 mb-4">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Warning:</strong> {warningAlerts.length} readings are outside the normal range. Monitor
                  closely.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vitals.map((vital) => {
                const meta = vitalMeta[vital.type]
                const statusStyle = getStatusStyles(vital.status)
                const Icon = meta?.icon || Activity

                return (
                  <div
                    key={vital.id}
                    className={`p-4 rounded-lg border-2 ${statusStyle.border} ${statusStyle.bg} print-card`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-6 h-6 ${meta?.color || "text-gray-500"}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{vital.type}</h3>
                          <p className="text-2xl font-bold text-gray-800">
                            {vital.value} <span className="text-base font-normal text-gray-600">{vital.unit}</span>
                          </p>
                        </div>
                      </div>
                      <Badge className={`${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                        {statusStyle.icon}
                        <span className="ml-1 capitalize">{vital.status}</span>
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{vital.timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{vital.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    {vital.notes && (
                      <div className="mt-2 text-sm text-gray-700 bg-white/50 p-2 rounded-md">
                        <Info className="w-4 h-4 inline-block mr-2" />
                        {vital.notes}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="print-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <BrainCircuit className="w-6 h-6 text-blue-600" />
              <span>AI Health Insights</span>
            </CardTitle>
            <CardDescription>Personalized recommendations based on your vitals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Normal</span>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {vitals.filter((v) => v.status === "normal").length}
                </div>
              </div>
              <div className="p-4 rounded-lg border-2 border-yellow-500 bg-yellow-50">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Warnings</span>
                </div>
                <div className="text-3xl font-bold text-yellow-700">{warningAlerts.length}</div>
              </div>
              <div className="p-4 rounded-lg border-2 border-red-500 bg-red-50">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-800">Critical</span>
                </div>
                <div className="text-3xl font-bold text-red-700">{criticalAlerts.length}</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Sparkles size={20} className="mr-2 text-blue-600" />
                AI Recommendations
              </h3>
              <ul className="space-y-2 text-blue-800 list-none">
                {criticalAlerts.length > 0 && (
                  <li className="flex items-start">
                    <strong className="text-red-600 mr-2">Urgent:</strong>
                    <span>You have critical vital signs. Contact your healthcare provider immediately.</span>
                  </li>
                )}
                {warningAlerts.length > 0 && (
                  <li className="flex items-start">
                    <strong className="text-yellow-600 mr-2">Monitor:</strong>
                    <span>Some readings are outside normal range. Track trends and consult your doctor.</span>
                  </li>
                )}
                <li className="flex items-start">
                  <strong className="text-green-600 mr-2">Continue:</strong>
                  <span>Keep tracking your vitals daily for better health insights and early detection.</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-b-lg">
            <MyMedLogo size="sm" className="mx-auto mb-2" />
            <p>
              Powered by MYMED.AI • This report is for informational purposes only and does not replace professional
              medical advice.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
