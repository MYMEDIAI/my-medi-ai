"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  FileText,
} from "lucide-react"

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
      value: "95",
      unit: "mg/dL",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "normal",
    },
  ])

  const [newVital, setNewVital] = useState({
    type: "Blood Pressure",
    value: "",
    unit: "mmHg",
    notes: "",
  })

  const vitalTypes = [
    { name: "Blood Pressure", unit: "mmHg", icon: Activity, normalRange: "90/60 - 140/90" },
    { name: "Heart Rate", unit: "bpm", icon: Heart, normalRange: "60-100" },
    { name: "Blood Glucose", unit: "mg/dL", icon: Droplets, normalRange: "70-140" },
    { name: "Temperature", unit: "°F", icon: Thermometer, normalRange: "97-99" },
    { name: "SpO2", unit: "%", icon: Activity, normalRange: "95-100" },
    { name: "Weight", unit: "lbs", icon: TrendingUp, normalRange: "Individual" },
  ]

  const getVitalStatus = (type: string, value: string): "normal" | "warning" | "critical" => {
    const numValue = Number.parseFloat(value.split("/")[0])

    switch (type) {
      case "Blood Pressure":
        const systolic = Number.parseInt(value.split("/")[0])
        const diastolic = Number.parseInt(value.split("/")[1])
        if (systolic >= 140 || diastolic >= 90) return "critical"
        if (systolic >= 130 || diastolic >= 80) return "warning"
        return "normal"

      case "Heart Rate":
        if (numValue < 60 || numValue > 100) return "warning"
        if (numValue < 50 || numValue > 120) return "critical"
        return "normal"

      case "Blood Glucose":
        if (numValue < 70 || numValue > 140) return "warning"
        if (numValue < 50 || numValue > 200) return "critical"
        return "normal"

      case "Temperature":
        if (numValue < 97 || numValue > 99) return "warning"
        if (numValue < 95 || numValue > 101) return "critical"
        return "normal"

      case "SpO2":
        if (numValue < 95) return "warning"
        if (numValue < 90) return "critical"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const generateReport = () => {
    const reportContent = `
      MYMED.AI VITALS REPORT
      Generated: ${new Date().toLocaleDateString()}
      
      Recent Vital Signs:
      ${vitals
        .slice(0, 10)
        .map(
          (vital) =>
            `${vital.type}: ${vital.value} ${vital.unit} (${vital.status.toUpperCase()}) - ${vital.timestamp.toLocaleDateString()}`,
        )
        .join("\n")}
      
      Status Summary:
      • Normal readings: ${vitals.filter((v) => v.status === "normal").length}
      • Warning readings: ${vitals.filter((v) => v.status === "warning").length}
      • Critical readings: ${vitals.filter((v) => v.status === "critical").length}
      
      Recommendations:
      ${vitals.some((v) => v.status === "critical") ? "• Consult healthcare provider immediately for critical readings" : ""}
      ${vitals.some((v) => v.status === "warning") ? "• Monitor warning readings closely and track trends" : ""}
      • Continue regular monitoring
      • Maintain healthy lifestyle
      
      Powered by MYMED.AI
      This report is for informational purposes only and does not replace professional medical advice.
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mymed-vitals-report-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const criticalAlerts = vitals.filter((v) => v.status === "critical").slice(0, 3)
  const warningAlerts = vitals.filter((v) => v.status === "warning").slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Alert:</strong> You have {criticalAlerts.length} critical vital sign readings. Please
            consult your healthcare provider immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Warning:</strong> {warningAlerts.length} vital signs are outside normal range. Monitor closely and
            consider consulting your healthcare provider.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Record Vitals</TabsTrigger>
          <TabsTrigger value="history">History & Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MyMedLogo size="sm" showText={false} />
                <span>Record New Vital Signs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vital-type">Vital Sign Type</Label>
                  <select
                    id="vital-type"
                    value={newVital.type}
                    onChange={(e) => {
                      const selectedType = vitalTypes.find((v) => v.name === e.target.value)
                      setNewVital({
                        ...newVital,
                        type: e.target.value,
                        unit: selectedType?.unit || "",
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {vitalTypes.map((type) => (
                      <option key={type.name} value={type.name}>
                        {type.name}
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
                    placeholder="e.g., after exercise, fasting"
                    className="focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Normal range: {vitalTypes.find((v) => v.name === newVital.type)?.normalRange}
                </div>
                <Button onClick={handleAddVital} className="bg-purple-600 hover:bg-purple-700">
                  <Activity className="w-4 h-4 mr-2" />
                  Record Vital
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vitalTypes.slice(0, 3).map((vital) => {
              const Icon = vital.icon
              return (
                <Card key={vital.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{vital.name}</h3>
                        <p className="text-sm text-gray-600">Normal: {vital.normalRange}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Vitals History</span>
              </CardTitle>
              <Button onClick={generateReport} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No vital signs recorded yet. Start by recording your first reading above.
                  </div>
                ) : (
                  vitals.map((vital) => {
                    const vitalType = vitalTypes.find((v) => v.name === vital.type)
                    const Icon = vitalType?.icon || Activity

                    return (
                      <div
                        key={vital.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{vital.type}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{vital.timestamp.toLocaleDateString()}</span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{vital.timestamp.toLocaleTimeString()}</span>
                            </div>
                            {vital.notes && <p className="text-sm text-gray-500 mt-1">{vital.notes}</p>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {vital.value} <span className="text-sm font-normal text-gray-600">{vital.unit}</span>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(vital.status)} flex items-center space-x-1`}>
                            {getStatusIcon(vital.status)}
                            <span className="capitalize">{vital.status}</span>
                          </Badge>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MyMedLogo size="sm" showText={false} />
                <span>AI Health Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Normal Readings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {vitals.filter((v) => v.status === "normal").length}
                  </div>
                  <p className="text-sm text-green-600">Your vitals are within healthy ranges</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Warnings</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {vitals.filter((v) => v.status === "warning").length}
                  </div>
                  <p className="text-sm text-yellow-600">Readings that need monitoring</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Critical</span>
                  </div>
                  <div className="text-2xl font-bold text-red-700">
                    {vitals.filter((v) => v.status === "critical").length}
                  </div>
                  <p className="text-sm text-red-600">Require immediate attention</p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <MyMedLogo size="sm" showText={false} className="mr-2" />
                  AI Health Recommendations
                </h3>
                <div className="space-y-2 text-blue-800">
                  {vitals.some((v) => v.status === "critical") && (
                    <p>
                      • <strong>Urgent:</strong> You have critical vital signs. Contact your healthcare provider
                      immediately.
                    </p>
                  )}
                  {vitals.some((v) => v.status === "warning") && (
                    <p>
                      • <strong>Monitor:</strong> Some readings are outside normal range. Track trends and consult your
                      doctor.
                    </p>
                  )}
                  <p>
                    • <strong>Regular Monitoring:</strong> Continue tracking your vitals daily for better health
                    insights.
                  </p>
                  <p>
                    • <strong>Lifestyle:</strong> Maintain a healthy diet, regular exercise, and adequate sleep.
                  </p>
                  <p>
                    • <strong>Hydration:</strong> Ensure adequate water intake throughout the day.
                  </p>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <MyMedLogo size="sm" className="mx-auto mb-2" />
                <p>
                  Powered by MYMED.AI • This information is for educational purposes only and does not replace
                  professional medical advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
