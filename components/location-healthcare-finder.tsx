"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Navigation,
  Phone,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Hospital,
  TestTube,
  Pill,
  Stethoscope,
  RotateCcw,
} from "lucide-react"
import { calculateDistance, formatDistance } from "@/lib/calculate-distance"

interface LocationInfo {
  address: string
  city: string
  state: string
  country: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface NearbyFacility {
  place_id: string
  name: string
  vicinity: string
  rating?: number
  user_ratings_total?: number
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  distance?: number
  opening_hours?: {
    open_now: boolean
    weekday_text?: string[]
  }
  formatted_phone_number?: string
  website?: string
  price_level?: number
}

interface CategorizedFacilities {
  hospitals: NearbyFacility[]
  labs: NearbyFacility[]
  pharmacies: NearbyFacility[]
  doctors: NearbyFacility[]
}

const emergencyNumbers = [
  { service: "Emergency Services", number: "108", description: "Medical Emergency, Fire, Police" },
  { service: "Police", number: "100", description: "Police Emergency" },
  { service: "Fire Department", number: "101", description: "Fire Emergency" },
  { service: "Ambulance", number: "102", description: "Medical Emergency" },
  { service: "Women Helpline", number: "1091", description: "Women in Distress" },
  { service: "Child Helpline", number: "1098", description: "Child Emergency" },
  { service: "Tourist Helpline", number: "1363", description: "Tourist Emergency" },
  { service: "Railway Enquiry", number: "139", description: "Railway Information" },
]

export default function LocationHealthcareFinder() {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [facilities, setFacilities] = useState<CategorizedFacilities>({
    hospitals: [],
    labs: [],
    pharmacies: [],
    doctors: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const detectLocation = async () => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(coords)

        try {
          const response = await fetch("/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coords),
          })

          if (response.ok) {
            const data = await response.json()

            const locationInfo: LocationInfo = {
              address: data.locationInfo?.address || "",
              city: data.locationInfo?.city || "",
              state: data.locationInfo?.state || "",
              country: data.locationInfo?.country || "",
              coordinates: coords,
            }
            setLocationInfo(locationInfo)

            // Categorize facilities
            const allFacilities = data.facilities || []
            const categorized: CategorizedFacilities = {
              hospitals: [],
              labs: [],
              pharmacies: [],
              doctors: [],
            }

            allFacilities.forEach((facility: NearbyFacility) => {
              // Calculate distance
              facility.distance = calculateDistance(
                coords.lat,
                coords.lng,
                facility.geometry.location.lat,
                facility.geometry.location.lng,
              )

              // Categorize based on types
              if (facility.types.some((type) => ["hospital", "medical_center", "emergency_room"].includes(type))) {
                categorized.hospitals.push(facility)
              } else if (
                facility.types.some(
                  (type) =>
                    ["medical_lab", "laboratory", "pathology_lab", "diagnostic_center"].includes(type) ||
                    facility.name.toLowerCase().includes("lab") ||
                    facility.name.toLowerCase().includes("diagnostic") ||
                    facility.name.toLowerCase().includes("pathology"),
                )
              ) {
                categorized.labs.push(facility)
              } else if (facility.types.some((type) => ["pharmacy", "drugstore", "medical_store"].includes(type))) {
                categorized.pharmacies.push(facility)
              } else if (
                facility.types.some((type) => ["doctor", "clinic", "medical_clinic", "dentist"].includes(type))
              ) {
                categorized.doctors.push(facility)
              }
            })

            // Sort each category by distance
            Object.keys(categorized).forEach((key) => {
              categorized[key as keyof CategorizedFacilities].sort((a, b) => (a.distance || 0) - (b.distance || 0))
            })

            setFacilities(categorized)
          } else {
            throw new Error("Failed to get location data")
          }
        } catch (error) {
          console.error("Location API error:", error)
          setError("Failed to get location details")
        }

        setIsLoading(false)
      },
      (error) => {
        let errorMessage = "Unable to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const getFacilityIcon = (types: string[]) => {
    if (types.includes("hospital") || types.includes("medical_center")) return "🏥"
    if (types.includes("pharmacy") || types.includes("drugstore")) return "💊"
    if (types.includes("doctor") || types.includes("clinic")) return "👨‍⚕️"
    if (types.includes("dentist")) return "🦷"
    if (types.some((type) => type.includes("lab")) || types.includes("medical_lab")) return "🔬"
    return "🏥"
  }

  const openInMaps = (facility: NearbyFacility) => {
    const { lat, lng } = facility.geometry.location
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${facility.place_id}`
    window.open(url, "_blank")
  }

  const callFacility = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const FacilityCard = ({ facility }: { facility: NearbyFacility }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl">{getFacilityIcon(facility.types)}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{facility.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{facility.vicinity}</p>

              <div className="flex flex-wrap gap-2 mb-2">
                {facility.distance && (
                  <Badge variant="outline" className="text-xs">
                    📍 {formatDistance(facility.distance)}
                  </Badge>
                )}
                {facility.rating && (
                  <Badge variant="outline" className="text-xs">
                    ⭐ {facility.rating.toFixed(1)}
                    {facility.user_ratings_total && ` (${facility.user_ratings_total})`}
                  </Badge>
                )}
                {facility.opening_hours && (
                  <Badge variant={facility.opening_hours.open_now ? "default" : "secondary"} className="text-xs">
                    {facility.opening_hours.open_now ? "🟢 Open" : "🔴 Closed"}
                  </Badge>
                )}
                {facility.price_level && (
                  <Badge variant="outline" className="text-xs">
                    💰 {"$".repeat(facility.price_level)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => openInMaps(facility)}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Directions
          </Button>
          {facility.formatted_phone_number && (
            <Button
              onClick={() => callFacility(facility.formatted_phone_number!)}
              size="sm"
              variant="outline"
              className="bg-transparent"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
          )}
          {facility.website && (
            <Button
              onClick={() => window.open(facility.website, "_blank")}
              size="sm"
              variant="outline"
              className="bg-transparent"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const FacilitySection = ({
    title,
    icon,
    facilities,
    color,
  }: {
    title: string
    icon: React.ReactNode
    facilities: NearbyFacility[]
    color: string
  }) => (
    <div className="space-y-4">
      <div className={`bg-gradient-to-r ${color} text-white p-4 rounded-lg`}>
        <h3 className="text-lg font-semibold flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
          <Badge className="ml-3 bg-white text-gray-800">{facilities.length} found</Badge>
        </h3>
        <p className="text-sm opacity-90 mt-1">
          {facilities.length > 0
            ? `Found ${facilities.length} ${title.toLowerCase()} near your location`
            : `No ${title.toLowerCase()} found in your area`}
        </p>
      </div>

      {facilities.length > 0 ? (
        <div className="grid gap-4">
          {facilities.map((facility) => (
            <FacilityCard key={facility.place_id} facility={facility} />
          ))}
        </div>
      ) : (
        <Card className="border-gray-200">
          <CardContent className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No {title.toLowerCase()} found in your immediate area.</p>
            <p className="text-sm mt-1">Try expanding your search radius or check nearby areas.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-green-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Healthcare Finder</h1>
                <p className="text-green-100 text-sm">Find nearby hospitals, labs, pharmacies & clinics</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!locationInfo ? (
            <div className="text-center py-12">
              {isLoading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-600" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">Detecting your location...</p>
                    <p className="text-sm text-gray-600">Finding nearby healthcare facilities</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-6xl mb-4">🏥</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Healthcare Near You</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Discover hospitals, diagnostic labs, pharmacies, and clinics in your area with ratings,
                      directions, and contact information.
                    </p>
                  </div>
                  <Button
                    onClick={detectLocation}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Find Healthcare Nearby
                  </Button>
                  {error && (
                    <Alert className="border-red-200 bg-red-50 max-w-md mx-auto">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Location Info */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Your Location</p>
                        <p className="text-sm text-blue-700">
                          {locationInfo.city && locationInfo.state
                            ? `${locationInfo.city}, ${locationInfo.state}`
                            : locationInfo.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={detectLocation}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Refresh
                      </Button>
                      <Button
                        onClick={() => {
                          setLocationInfo(null)
                          setFacilities({
                            hospitals: [],
                            labs: [],
                            pharmacies: [],
                            doctors: [],
                          })
                          setUserLocation(null)
                          setError(null)
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Facilities Tabs */}
              <Tabs defaultValue="hospitals" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100">
                  <TabsTrigger
                    value="hospitals"
                    className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                  >
                    <Hospital className="w-4 h-4 mr-1" />
                    Hospitals
                  </TabsTrigger>
                  <TabsTrigger
                    value="labs"
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                  >
                    <TestTube className="w-4 h-4 mr-1" />
                    Lab Centers
                  </TabsTrigger>
                  <TabsTrigger
                    value="pharmacies"
                    className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    <Pill className="w-4 h-4 mr-1" />
                    Pharmacies
                  </TabsTrigger>
                  <TabsTrigger
                    value="doctors"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    <Stethoscope className="w-4 h-4 mr-1" />
                    Doctors
                  </TabsTrigger>
                  <TabsTrigger
                    value="emergency"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Emergency
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hospitals" className="mt-6">
                  <FacilitySection
                    title="Hospitals & Medical Centers"
                    icon={<Hospital className="w-5 h-5" />}
                    facilities={facilities.hospitals}
                    color="from-red-500 to-red-600"
                  />
                </TabsContent>

                <TabsContent value="labs" className="mt-6">
                  <FacilitySection
                    title="Laboratory & Diagnostic Centers"
                    icon={<TestTube className="w-5 h-5" />}
                    facilities={facilities.labs}
                    color="from-purple-500 to-purple-600"
                  />
                </TabsContent>

                <TabsContent value="pharmacies" className="mt-6">
                  <FacilitySection
                    title="Pharmacies & Medical Stores"
                    icon={<Pill className="w-5 h-5" />}
                    facilities={facilities.pharmacies}
                    color="from-green-500 to-green-600"
                  />
                </TabsContent>

                <TabsContent value="doctors" className="mt-6">
                  <FacilitySection
                    title="Doctors & Clinics"
                    icon={<Stethoscope className="w-5 h-5" />}
                    facilities={facilities.doctors}
                    color="from-blue-500 to-blue-600"
                  />
                </TabsContent>

                <TabsContent value="emergency" className="mt-6">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Phone className="w-5 h-5 mr-2" />
                        Emergency Contact Numbers
                        <Badge className="ml-3 bg-white text-red-600">India</Badge>
                      </h3>
                      <p className="text-red-100 text-sm mt-1">Important emergency numbers for immediate assistance</p>
                    </div>

                    <div className="grid gap-3">
                      {emergencyNumbers.map((emergency, index) => (
                        <Card key={index} className="border-red-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                  <Phone className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{emergency.service}</h4>
                                  <p className="text-sm text-gray-600">{emergency.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-red-600 mb-1">{emergency.number}</div>
                                <Button
                                  onClick={() => callFacility(emergency.number)}
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Call Now
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Emergency Tip:</strong> In life-threatening situations, call 108 immediately. Keep your
                        location and medical information ready when calling emergency services.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
