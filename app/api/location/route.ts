import { type NextRequest, NextResponse } from "next/server"

interface LocationCoordinates {
  lat: number
  lng: number
}

interface LocationInfo {
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  coordinates: LocationCoordinates
}

interface HealthcareFacility {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lat, lng } = body

    if (!lat || !lng) {
      return NextResponse.json({ error: "Coordinates are required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        locationInfo: {
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          coordinates: { lat, lng },
        },
        facilities: [],
        recommendations: [],
        googleStatus: "API_KEY_MISSING",
      })
    }

    // Get location info using reverse geocoding
    const locationInfo: LocationInfo = {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      coordinates: { lat, lng },
    }

    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${encodeURIComponent(apiKey)}`
      const geocodeResponse = await fetch(geocodeUrl)
      const geocodeData = await geocodeResponse.json()

      if (geocodeData.status === "OK" && geocodeData.results.length > 0) {
        const result = geocodeData.results[0]
        locationInfo.address = result.formatted_address

        // Extract address components
        result.address_components?.forEach((component: any) => {
          const types = component.types
          if (types.includes("locality")) {
            locationInfo.city = component.long_name
          } else if (types.includes("administrative_area_level_1")) {
            locationInfo.state = component.long_name
          } else if (types.includes("country")) {
            locationInfo.country = component.long_name
          } else if (types.includes("postal_code")) {
            locationInfo.postalCode = component.long_name
          }
        })
      }
    } catch (error) {
      console.error("Geocoding error:", error)
    }

    // Find nearby healthcare facilities
    let facilities: HealthcareFacility[] = []
    let googleStatus = "OK"

    try {
      // Search for general healthcare facilities
      const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=health&key=${encodeURIComponent(apiKey)}`
      const placesResponse = await fetch(placesUrl)
      const placesData = await placesResponse.json()

      googleStatus = placesData.status

      if (placesData.status === "OK" && placesData.results) {
        facilities = placesData.results
          .map((place: any) => ({
            place_id: place.place_id,
            name: place.name,
            vicinity: place.vicinity || "",
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            opening_hours: place.opening_hours,
            types: place.types || [],
            geometry: place.geometry,
            distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
          }))
          .sort((a: HealthcareFacility, b: HealthcareFacility) => (a.distance || 0) - (b.distance || 0))
      }

      // Additional search for specific lab centers and diagnostic centers
      try {
        const labSearchTerms = ["pathology lab", "diagnostic center", "medical laboratory", "blood test center"]

        for (const term of labSearchTerms) {
          const labUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=${encodeURIComponent(term)}&key=${encodeURIComponent(apiKey)}`
          const labResponse = await fetch(labUrl)
          const labData = await labResponse.json()

          if (labData.status === "OK" && labData.results) {
            const labFacilities = labData.results
              .filter((place: any) => !facilities.some((existing: any) => existing.place_id === place.place_id))
              .map((place: any) => ({
                place_id: place.place_id,
                name: place.name,
                vicinity: place.vicinity || "",
                rating: place.rating,
                user_ratings_total: place.user_ratings_total,
                opening_hours: place.opening_hours,
                types: [...(place.types || []), "laboratory", "medical_lab"],
                geometry: place.geometry,
                distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
              }))

            facilities = [...facilities, ...labFacilities]
          }
        }

        // Sort all facilities by distance
        facilities = facilities.sort(
          (a: HealthcareFacility, b: HealthcareFacility) => (a.distance || 0) - (b.distance || 0),
        )
      } catch (labError) {
        console.error("Lab search error:", labError)
      }
    } catch (error) {
      console.error("Places API error:", error)
      googleStatus = "REQUEST_FAILED"
    }

    // Generate location-based health recommendations
    const recommendations = generateHealthRecommendations(locationInfo)

    return NextResponse.json({
      locationInfo,
      facilities,
      recommendations,
      googleStatus,
    })
  } catch (error) {
    console.error("Location API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function generateHealthRecommendations(locationInfo: LocationInfo): string[] {
  const recommendations: string[] = []

  // Location-based recommendations for India
  if (locationInfo.city || locationInfo.state) {
    const location = `${locationInfo.city} ${locationInfo.state}`.toLowerCase()

    // Air quality recommendations for major cities
    if (location.includes("delhi") || location.includes("mumbai") || location.includes("kolkata")) {
      recommendations.push(
        "Air pollution levels may be high. Consider wearing a mask outdoors and using air purifiers indoors.",
      )
    }

    // Climate-based recommendations
    if (location.includes("rajasthan") || location.includes("gujarat")) {
      recommendations.push("Stay hydrated and avoid prolonged sun exposure during peak hours (10 AM - 4 PM).")
    }

    if (location.includes("kerala") || location.includes("goa")) {
      recommendations.push("High humidity levels. Stay hydrated and watch for heat-related illnesses.")
    }

    if (location.includes("himachal") || location.includes("uttarakhand") || location.includes("kashmir")) {
      recommendations.push("High altitude area. Take time to acclimatize and stay hydrated.")
    }

    // Monsoon season recommendations (general)
    const currentMonth = new Date().getMonth() + 1 // 1-12
    if (currentMonth >= 6 && currentMonth <= 9) {
      recommendations.push(
        "Monsoon season: Be cautious of waterborne diseases. Drink boiled/filtered water and avoid street food.",
      )
    }
  }

  // General health recommendations
  recommendations.push("Keep emergency contacts handy and know the location of nearest hospital.")

  return recommendations
}
