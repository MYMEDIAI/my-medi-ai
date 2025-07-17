"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  ExternalLink,
  AlertTriangle,
  Shield,
  Loader2,
  Home,
  TestTube,
  Pill,
  Building2,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import { calculateDistance } from "@/lib/calculate-distance"

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

export default function LocationHealthcareFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoLocationAttempted, setAutoLocationAttempted] = useState(false)

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
        let errorMessage = "Unable to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  // Update the fetchLocationData function to search for lab centers specifically
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

      // Handle different Google API statuses gracefully
      if (data.googleStatus && data.googleStatus !== "OK") {
        if (data.googleStatus === "REQUEST_DENIED") {
          setError("Google Maps API access denied. Please check your API key configuration.")
        } else if (data.googleStatus === "ZERO_RESULTS") {
          // This is normal - just means no facilities found
          setError(null)
        } else if (data.googleStatus === "API_KEY_MISSING") {
          setError("Google Maps API key not configured. Please set up your API key.")
        } else {
          setError(`Google Maps API issue: ${data.googleStatus}`)
        }
      }
    } catch (error) {
      setError(`Failed to fetch location data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Update the getFacilityIcon function to include lab centers
  const getFacilityIcon = (types: string[]) => {
    if (types.includes("hospital")) return "🏥"
    if (types.includes("pharmacy")) return "💊"
    if (types.includes("doctor")) return "👨‍⚕️"
    if (types.includes("dentist")) return "🦷"
    if (types.includes("laboratory") || types.includes("medical_lab") || types.includes("diagnostic_center"))
      return "🔬"
    if (types.includes("physiotherapist")) return "🏃‍♂️"
    if (types.includes("veterinary_care")) return "🐕"
    return "🏥"
  }

  // Update the getFacilityType function to include lab centers
  const getFacilityType = (types: string[]) => {
    if (types.includes("hospital")) return "Hospital"
    if (types.includes("pharmacy")) return "Pharmacy"
    if (types.includes("doctor")) return "Doctor"
    if (types.includes("dentist")) return "Dentist"
    if (types.includes("laboratory") || types.includes("medical_lab") || types.includes("diagnostic_center"))
      return "Lab Center"
    if (types.includes("physiotherapist")) return "Physiotherapy"
    if (types.includes("veterinary_care")) return "Veterinary"
    return "Healthcare Facility"
  }

  const emergencyNumbers = [
    { name: "National Emergency", number: "112", description: "All emergencies", color: "bg-red-100 text-red-800" },
    { name: "Ambulance", number: "108", description: "Medical emergencies", color: "bg-blue-100 text-blue-800" },
    { name: "Fire", number: "101", description: "Fire emergencies", color: "bg-orange-100 text-orange-800" },
    { name: "Police", number: "100", description: "Police emergencies", color: "bg-gray-100 text-gray-800" },
    {
      name: "Women Helpline",
      number: "1091",
      description: "Women in distress",
      color: "bg-purple-100 text-purple-800",
    },
    { name: "Child Helpline", number: "1098", description: "Child protection", color: "bg-green-100 text-green-800" },
  ]

  return (
    <div className="w-full">
      {/* Home Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="finder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="finder">Healthcare Finder</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Update the TabsContent for finder to show categorized facilities */}
        <TabsContent value="finder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Healthcare Near You
              </CardTitle>
              <CardDescription>
                {loading && !location
                  ? "Automatically detecting your location..."
                  : "Your location is being used to find nearby hospitals, clinics, pharmacies, and lab centers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Show manual button only if auto-detection failed or user wants to retry */}
              {(!loading && !location) || error ? (
                <Button onClick={getCurrentLocation} disabled={loading} className="w-full mb-4">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      {error ? "Retry Location Detection" : "Get Current Location"}
                    </>
                  )}
                </Button>
              ) : loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Automatically detecting your location...</span>
                </div>
              ) : null}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {location && locationData && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Current Location
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locationData.locationInfo.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                    </p>
                    {locationData.locationInfo.city && (
                      <p className="text-sm text-gray-500">
                        {locationData.locationInfo.city}
                        {locationData.locationInfo.state && `, ${locationData.locationInfo.state}`}
                      </p>
                    )}
                  </div>

                  {locationData.recommendations.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Health Recommendations
                      </h3>
                      <ul className="space-y-1">
                        {locationData.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-600 mt-1 flex-shrink-0">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {locationData && (
            <div className="space-y-6">
              {/* Hospitals Section */}
              {locationData.facilities.filter((f) => f.types.includes("hospital")).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <Building2 className="h-5 w-5" />
                      Nearby Hospitals
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {locationData.facilities.filter((f) => f.types.includes("hospital")).length} found
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {locationData.facilities
                        .filter((f) => f.types.includes("hospital"))
                        .slice(0, 5)
                        .map((facility) => {
                          const distance = location
                            ? calculateDistance(
                                location.lat,
                                location.lng,
                                facility.geometry.location.lat,
                                facility.geometry.location.lng,
                              )
                            : 0

                          return (
                            <div
                              key={facility.place_id}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-red-50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl flex-shrink-0">🏥</span>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold truncate text-red-900">{facility.name}</h3>
                                    <p className="text-sm text-red-700 mb-1">{facility.vicinity}</p>
                                    <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                                      Hospital
                                    </Badge>
                                    {distance > 0 && (
                                      <p className="text-sm text-red-600 mt-1 font-medium">
                                        {distance.toFixed(1)} km away
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  {facility.opening_hours && (
                                    <Badge
                                      variant={facility.opening_hours.open_now ? "default" : "secondary"}
                                      className="bg-green-100 text-green-800"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {facility.opening_hours.open_now ? "Open" : "Closed"}
                                    </Badge>
                                  )}
                                  {facility.rating && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{facility.rating.toFixed(1)}</span>
                                      {facility.user_ratings_total && (
                                        <span className="text-gray-500">({facility.user_ratings_total})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.geometry.location.lat},${facility.geometry.location.lng}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <Navigation className="h-3 w-3 mr-1" />
                                  Directions
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/place/?q=place_id:${facility.place_id}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lab Centers Section */}
              {locationData.facilities.filter((f) =>
                f.types.some((type) => ["laboratory", "medical_lab", "diagnostic_center"].includes(type)),
              ).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600">
                      <TestTube className="h-5 w-5" />
                      Nearby Lab Centers
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {
                          locationData.facilities.filter((f) =>
                            f.types.some((type) => ["laboratory", "medical_lab", "diagnostic_center"].includes(type)),
                          ).length
                        }{" "}
                        found
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {locationData.facilities
                        .filter((f) =>
                          f.types.some((type) => ["laboratory", "medical_lab", "diagnostic_center"].includes(type)),
                        )
                        .slice(0, 5)
                        .map((facility) => {
                          const distance = location
                            ? calculateDistance(
                                location.lat,
                                location.lng,
                                facility.geometry.location.lat,
                                facility.geometry.location.lng,
                              )
                            : 0

                          return (
                            <div
                              key={facility.place_id}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-purple-50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl flex-shrink-0">🔬</span>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold truncate text-purple-900">{facility.name}</h3>
                                    <p className="text-sm text-purple-700 mb-1">{facility.vicinity}</p>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-purple-100 text-purple-800 border-purple-300"
                                    >
                                      Lab Center
                                    </Badge>
                                    {distance > 0 && (
                                      <p className="text-sm text-purple-600 mt-1 font-medium">
                                        {distance.toFixed(1)} km away
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  {facility.opening_hours && (
                                    <Badge
                                      variant={facility.opening_hours.open_now ? "default" : "secondary"}
                                      className="bg-green-100 text-green-800"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {facility.opening_hours.open_now ? "Open" : "Closed"}
                                    </Badge>
                                  )}
                                  {facility.rating && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{facility.rating.toFixed(1)}</span>
                                      {facility.user_ratings_total && (
                                        <span className="text-gray-500">({facility.user_ratings_total})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.geometry.location.lat},${facility.geometry.location.lng}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <Navigation className="h-3 w-3 mr-1" />
                                  Directions
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/place/?q=place_id:${facility.place_id}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pharmacies Section */}
              {locationData.facilities.filter((f) => f.types.includes("pharmacy")).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <Pill className="h-5 w-5" />
                      Nearby Pharmacies
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {locationData.facilities.filter((f) => f.types.includes("pharmacy")).length} found
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {locationData.facilities
                        .filter((f) => f.types.includes("pharmacy"))
                        .slice(0, 5)
                        .map((facility) => {
                          const distance = location
                            ? calculateDistance(
                                location.lat,
                                location.lng,
                                facility.geometry.location.lat,
                                facility.geometry.location.lng,
                              )
                            : 0

                          return (
                            <div
                              key={facility.place_id}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl flex-shrink-0">💊</span>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold truncate text-green-900">{facility.name}</h3>
                                    <p className="text-sm text-green-700 mb-1">{facility.vicinity}</p>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-100 text-green-800 border-green-300"
                                    >
                                      Pharmacy
                                    </Badge>
                                    {distance > 0 && (
                                      <p className="text-sm text-green-600 mt-1 font-medium">
                                        {distance.toFixed(1)} km away
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  {facility.opening_hours && (
                                    <Badge
                                      variant={facility.opening_hours.open_now ? "default" : "secondary"}
                                      className="bg-blue-100 text-blue-800"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {facility.opening_hours.open_now ? "Open" : "Closed"}
                                    </Badge>
                                  )}
                                  {facility.rating && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{facility.rating.toFixed(1)}</span>
                                      {facility.user_ratings_total && (
                                        <span className="text-gray-500">({facility.user_ratings_total})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.geometry.location.lat},${facility.geometry.location.lng}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <Navigation className="h-3 w-3 mr-1" />
                                  Directions
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/place/?q=place_id:${facility.place_id}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Doctors/Clinics Section */}
              {locationData.facilities.filter((f) => f.types.includes("doctor") || f.types.includes("dentist")).length >
                0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-600">
                      <Stethoscope className="h-5 w-5" />
                      Nearby Doctors & Clinics
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {
                          locationData.facilities.filter(
                            (f) => f.types.includes("doctor") || f.types.includes("dentist"),
                          ).length
                        }{" "}
                        found
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {locationData.facilities
                        .filter((f) => f.types.includes("doctor") || f.types.includes("dentist"))
                        .slice(0, 5)
                        .map((facility) => {
                          const distance = location
                            ? calculateDistance(
                                location.lat,
                                location.lng,
                                facility.geometry.location.lat,
                                facility.geometry.location.lng,
                              )
                            : 0

                          return (
                            <div
                              key={facility.place_id}
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start gap-3">
                                  <span className="text-2xl flex-shrink-0">{getFacilityIcon(facility.types)}</span>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold truncate text-blue-900">{facility.name}</h3>
                                    <p className="text-sm text-blue-700 mb-1">{facility.vicinity}</p>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-100 text-blue-800 border-blue-300"
                                    >
                                      {getFacilityType(facility.types)}
                                    </Badge>
                                    {distance > 0 && (
                                      <p className="text-sm text-blue-600 mt-1 font-medium">
                                        {distance.toFixed(1)} km away
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  {facility.opening_hours && (
                                    <Badge
                                      variant={facility.opening_hours.open_now ? "default" : "secondary"}
                                      className="bg-green-100 text-green-800"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {facility.opening_hours.open_now ? "Open" : "Closed"}
                                    </Badge>
                                  )}
                                  {facility.rating && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{facility.rating.toFixed(1)}</span>
                                      {facility.user_ratings_total && (
                                        <span className="text-gray-500">({facility.user_ratings_total})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.geometry.location.lat},${facility.geometry.location.lng}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <Navigation className="h-3 w-3 mr-1" />
                                  Directions
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps/place/?q=place_id:${facility.place_id}`
                                    window.open(url, "_blank")
                                  }}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No facilities found message */}
              {locationData.googleStatus &&
              locationData.googleStatus !== "OK" &&
              locationData.googleStatus !== "ZERO_RESULTS" ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Unable to search for healthcare facilities: {locationData.googleStatus}
                  </AlertDescription>
                </Alert>
              ) : locationData.facilities.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No healthcare facilities found in your immediate area. This could be normal for rural areas. Try
                    searching for facilities in the nearest town or city.
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          )}
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Phone className="h-5 w-5" />
                Emergency Numbers (India)
              </CardTitle>
              <CardDescription>Important emergency contact numbers for immediate assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {emergencyNumbers.map((emergency) => (
                  <div key={emergency.number} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{emergency.name}</h3>
                      <Badge variant="destructive" className="text-lg font-bold">
                        {emergency.number}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{emergency.description}</p>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => window.open(`tel:${emergency.number}`, "_self")}
                      className="w-full"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call {emergency.number}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy Notice:</strong> Location data is only used to find nearby healthcare facilities and
              provide relevant health recommendations. Your location is not stored or shared.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
