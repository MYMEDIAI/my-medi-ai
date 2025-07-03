"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Home,
  RotateCcw,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"
import NavigationButtons from "@/components/navigation-buttons"

interface VitalReading {
  id: string
  date: string
  time: string
  systolic: number
  diastolic: number
  heartRate: number
  temperature: number
  oxygenSaturation: number
  bloodSugar: number
  weight: number
  notes: string
}

export default function VitalsPage() {
  const [currentVitals, setCurrentVitals] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    bloodSugar: "",
    weight: "",
    notes: "",
  })

  const [vitalHistory, setVitalHistory] = useState<VitalReading[]>([
    {
      id: "1",
      date: "2024-01-15",
      time: "08:30",
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      temperature: 98.6,
      oxygenSaturation: 98,
      bloodSugar: 95,
      weight: 70,
      notes: "Morning reading, feeling good",
    },
    {
      id: "2",
      date: "2024-01-14",
      time: "19:15",
      systolic: 118,
      diastolic: 78,
      heartRate: 68,
      temperature: 98.4,
      oxygenSaturation: 99,
      bloodSugar: 110,
      weight: 70.2,
      notes: "Evening reading after dinner",
    },
  ])

  const resetVitals = () => {
    setCurrentVitals({
      systolic: "",
      diastolic: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      bloodSugar: "",
      weight: "",
      notes: "",
    })
    setVitalHistory([])
  }

  const handleInputChange = (field: string, value: string) => {
    setCurrentVitals((prev) => ({ ...prev, [field]: value }))
  }

  const addVitalReading = () => {
    const newReading: VitalReading = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      systolic: Number.parseInt(currentVitals.systolic) || 0,
      diastolic: Number.parseInt(currentVitals.diastolic) || 0,
      heartRate: Number.parseInt(currentVitals.heartRate) || 0,
      temperature: Number.parseFloat(currentVitals.temperature) || 0,
      oxygenSaturation: Number.parseInt(currentVitals.oxygenSaturation) || 0,
      bloodSugar: Number.parseInt(currentVitals.bloodSugar) || 0,
      weight: Number.parseFloat(currentVitals.weight) || 0,
      notes: currentVitals.notes,
    }

    setVitalHistory((prev) => [newReading, ...prev])
    setCurrentVitals({
      systolic: "",
      diastolic: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      bloodSugar: "",
      weight: "",
      notes: "",
    })
  }

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { status: "Normal", color: "text-green-600", icon: CheckCircle }
    if (systolic < 130 && diastolic < 80) return { status: "Elevated", color: "text-yellow-600", icon: AlertTriangle }
    if (systolic < 140 || diastolic < 90)
      return { status: "High Stage 1", color: "text-orange-600", icon: AlertTriangle }
    return { status: "High Stage 2", color: "text-red-600", icon: AlertTriangle }
  }

  const getHeartRateStatus = (hr: number) => {
    if (hr >= 60 && hr <= 100) return { status: "Normal", color: "text-green-600" }
    if (hr < 60) return { status: "Low", color: "text-blue-600" }
    return { status: "High", color: "text-red-600" }
  }

  const getLatestReading = () => vitalHistory[0]
  const latestReading = getLatestReading()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={resetVitals} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Vitals
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vitals Tracker
                <Badge className="bg-white/20 text-white hover:bg-white/20 ml-auto">
                  <Heart className="w-3 h-3 mr-1" />
                  Health Monitoring
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Vitals Input */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Record New Vitals</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="systolic">Systolic BP</Label>
                      <Input
                        id="systolic"
                        type="number"
                        value={currentVitals.systolic}
                        onChange={(e) => handleInputChange("systolic", e.target.value)}
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <Label htmlFor="diastolic">Diastolic BP</Label>
                      <Input
                        id="diastolic"
                        type="number"
                        value={currentVitals.diastolic}
                        onChange={(e) => handleInputChange("diastolic", e.target.value)}
                        placeholder="80"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        value={currentVitals.heartRate}
                        onChange={(e) => handleInputChange("heartRate", e.target.value)}
                        placeholder="72"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={currentVitals.temperature}
                        onChange={(e) => handleInputChange("temperature", e.target.value)}
                        placeholder="98.6"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                      <Input
                        id="oxygenSaturation"
                        type="number"
                        value={currentVitals.oxygenSaturation}
                        onChange={(e) => handleInputChange("oxygenSaturation", e.target.value)}
                        placeholder="98"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                      <Input
                        id="bloodSugar"
                        type="number"
                        value={currentVitals.bloodSugar}
                        onChange={(e) => handleInputChange("bloodSugar", e.target.value)}
                        placeholder="95"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={currentVitals.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="70.0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      value={currentVitals.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any additional notes..."
                    />
                  </div>

                  <Button onClick={addVitalReading} className="w-full bg-red-600 hover:bg-red-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Record Vitals
                  </Button>
                </div>

                {/* Latest Reading Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Reading</h3>

                  {latestReading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {latestReading.date}
                        </span>
                        <span className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {latestReading.time}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Blood Pressure</p>
                                <p className="text-lg font-semibold">
                                  {latestReading.systolic}/{latestReading.diastolic}
                                </p>
                              </div>
                              <Heart className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="mt-2">
                              {(() => {
                                const bpStatus = getBloodPressureStatus(latestReading.systolic, latestReading.diastolic)
                                const StatusIcon = bpStatus.icon
                                return (
                                  <Badge className={`${bpStatus.color} bg-transparent border-current`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {bpStatus.status}
                                  </Badge>
                                )
                              })()}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Heart Rate</p>
                                <p className="text-lg font-semibold">{latestReading.heartRate} bpm</p>
                              </div>
                              <Activity className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="mt-2">
                              {(() => {
                                const hrStatus = getHeartRateStatus(latestReading.heartRate)
                                return (
                                  <Badge className={`${hrStatus.color} bg-transparent border-current`}>
                                    {hrStatus.status}
                                  </Badge>
                                )
                              })()}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">Temperature</p>
                                <p className="text-lg font-semibold">{latestReading.temperature}°F</p>
                              </div>
                              <Thermometer className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="mt-2">
                              <Badge className="text-green-600 bg-transparent border-current">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Normal
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600">O2 Saturation</p>
                                <p className="text-lg font-semibold">{latestReading.oxygenSaturation}%</p>
                              </div>
                              <Droplets className="w-6 h-6 text-cyan-500" />
                            </div>
                            <div className="mt-2">
                              <Badge className="text-green-600 bg-transparent border-current">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Normal
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {latestReading.notes && (
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertDescription className="text-blue-800">
                            <strong>Notes:</strong> {latestReading.notes}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <Alert className="border-gray-200 bg-gray-50">
                      <AlertDescription className="text-gray-600">
                        No vitals recorded yet. Add your first reading to get started.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitals History */}
          {vitalHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Vitals History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitalHistory.map((reading) => (
                    <div key={reading.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{reading.date}</span>
                          <span className="text-sm text-gray-600">{reading.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const bpStatus = getBloodPressureStatus(reading.systolic, reading.diastolic)
                            const StatusIcon = bpStatus.icon
                            return (
                              <Badge className={`${bpStatus.color} bg-transparent border-current`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {bpStatus.status}
                              </Badge>
                            )
                          })()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">BP:</span>
                          <span className="ml-1 font-medium">
                            {reading.systolic}/{reading.diastolic}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">HR:</span>
                          <span className="ml-1 font-medium">{reading.heartRate} bpm</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Temp:</span>
                          <span className="ml-1 font-medium">{reading.temperature}°F</span>
                        </div>
                        <div>
                          <span className="text-gray-600">O2:</span>
                          <span className="ml-1 font-medium">{reading.oxygenSaturation}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Blood Sugar:</span>
                          <span className="ml-1 font-medium">{reading.bloodSugar} mg/dL</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="ml-1 font-medium">{reading.weight} kg</span>
                        </div>
                      </div>

                      {reading.notes && (
                        <div className="mt-3 text-sm text-gray-700">
                          <strong>Notes:</strong> {reading.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              This vitals tracker is for monitoring purposes only. Always consult with healthcare professionals for
              medical advice and if you notice concerning changes in your vitals.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <NavigationButtons />
      <PoweredByFooter />
    </div>
  )
}
