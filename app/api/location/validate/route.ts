import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        valid: false,
        error: "GOOGLE_MAPS_API_KEY environment variable is not set",
        setup: {
          step: 1,
          message: "Please add your Google Maps API key to environment variables",
        },
      })
    }

    // Test Geocoding API
    const geocodingTest = await testGeocodingAPI(apiKey)

    // Test Places API
    const placesTest = await testPlacesAPI(apiKey)

    // Test billing by checking if Places API works (requires billing)
    const billingTest = {
      enabled: placesTest.enabled,
      error: placesTest.enabled ? null : "Billing required for Places API",
    }

    const allValid = geocodingTest.enabled && placesTest.enabled && billingTest.enabled

    return NextResponse.json({
      valid: allValid,
      results: {
        apiKey: `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
        geocoding: geocodingTest,
        places: placesTest,
        billing: billingTest,
      },
      setup: allValid
        ? null
        : {
            step: getNextSetupStep(geocodingTest, placesTest, billingTest),
            message: getSetupMessage(geocodingTest, placesTest, billingTest),
          },
    })
  } catch (error) {
    return NextResponse.json({
      valid: false,
      error: `Validation error: ${error.message}`,
    })
  }
}

async function testGeocodingAPI(apiKey: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=28.6139,77.2090&key=${encodeURIComponent(apiKey)}`,
    )

    const data = await response.json()

    if (data.status === "OK") {
      return { enabled: true, error: null }
    } else if (data.status === "REQUEST_DENIED") {
      return { enabled: false, error: "API key invalid or Geocoding API not enabled" }
    } else if (data.status === "OVER_QUERY_LIMIT") {
      return { enabled: false, error: "Quota exceeded - check billing and limits" }
    } else {
      return { enabled: false, error: `Geocoding API error: ${data.status}` }
    }
  } catch (error) {
    return { enabled: false, error: `Network error: ${error.message}` }
  }
}

async function testPlacesAPI(apiKey: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.6139,77.2090&radius=1000&type=hospital&key=${encodeURIComponent(apiKey)}`,
    )

    const data = await response.json()

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return { enabled: true, error: null }
    } else if (data.status === "REQUEST_DENIED") {
      return { enabled: false, error: "API key invalid, Places API not enabled, or billing not set up" }
    } else if (data.status === "OVER_QUERY_LIMIT") {
      return { enabled: false, error: "Quota exceeded - check billing and limits" }
    } else {
      return { enabled: false, error: `Places API error: ${data.status}` }
    }
  } catch (error) {
    return { enabled: false, error: `Network error: ${error.message}` }
  }
}

function getNextSetupStep(geocoding: any, places: any, billing: any) {
  if (!geocoding.enabled) return 2
  if (!places.enabled) return 3
  if (!billing.enabled) return 4
  return 5
}

function getSetupMessage(geocoding: any, places: any, billing: any) {
  if (!geocoding.enabled) return "Enable Geocoding API in Google Cloud Console"
  if (!places.enabled) return "Enable Places API in Google Cloud Console"
  if (!billing.enabled) return "Set up billing account for Places API"
  return "Configuration complete"
}
