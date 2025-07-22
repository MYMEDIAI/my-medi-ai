"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import LocationHealthcareFinder from "@/components/location-healthcare-finder"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Home, RotateCcw } from "lucide-react"
import Link from "next/link"

interface LocationInfo {
  address: string
  city: string
  state: string
  country: string
}

interface HealthFacility {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  user_ratings_total?: number
  opening_hours?: {
    open_now: boolean
  }
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  distance?: number
}

interface LocationData {
  locationInfo: LocationInfo
  facilities: HealthFacility[]
  recommendations: string[]
  googleStatus?: string
}

export default function LocationPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(coords)
        await fetchLocationData(coords)
      },
      (error) => {
        setError(`Location error: ${error.message}`)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const fetchLocationData = async (coords: { lat: number; lng: number }) => {
    try {
      const response = await fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coords),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: LocationData = await response.json()
      setLocationData(data)

      if (data.googleStatus && data.googleStatus !== "OK") {
        setError(`Google Maps issue: ${data.googleStatus}`)
      }
    } catch (error) {
      setError(`Failed to fetch location data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getFacilityIcon = (types: string[]) => {
    if (types.includes("hospital")) return "🏥"
    if (types.includes("pharmacy")) return "💊"
    if (types.includes("doctor")) return "👨‍⚕️"
    if (types.includes("dentist")) return "🦷"
    return "🏥"
  }

  const emergencyNumbers = [
    { name: "National Emergency", number: "112", description: "All emergencies" },
    { name: "Ambulance", number: "108", description: "Medical emergencies" },
    { name: "Fire", number: "101", description: "Fire emergencies" },
    { name: "Police", number: "100", description: "Police emergencies" },
    { name: "Women Helpline", number: "1091", description: "Women in distress" },
    { name: "Child Helpline", number: "1098", description: "Child protection" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Healthcare Near You</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find nearby hospitals, clinics, pharmacies, and get location-based health recommendations
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset Location
            </Button>
          </div>

          <Suspense
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Loading Location Services...
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <LocationHealthcareFinder />
          </Suspense>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Location data is used only to find nearby healthcare facilities and provide regional health
              recommendations. Your location is not stored or shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
