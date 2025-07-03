import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Users,
  Building2,
  Heart,
  Phone,
  Languages,
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Home,
  MessageCircle,
  User,
  Apple,
  Baby,
  UserCheck,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

// City data with comprehensive information
const cityData = {
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    population: "12.5 million",
    coordinates: { lat: 19.076, lng: 72.8777 },
    languages: ["Hindi", "Marathi", "English", "Gujarati"],
    hospitals: 150,
    doctors: 25000,
    lifeExpectancy: 74.2,
    commonIssues: [
      "Air pollution-related respiratory problems",
      "Monsoon-related infections",
      "Stress and lifestyle diseases",
      "Traffic accident injuries",
      "Waterborne diseases during monsoons",
    ],
    topHospitals: [
      { name: "Tata Memorial Hospital", specialty: "Cancer Care", rating: 4.8 },
      { name: "Kokilaben Dhirubhai Ambani Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "Lilavati Hospital", specialty: "Cardiac Care", rating: 4.6 },
      { name: "Hinduja Hospital", specialty: "Multi-specialty", rating: 4.5 },
      { name: "Breach Candy Hospital", specialty: "General Medicine", rating: 4.4 },
    ],
    emergencyNumbers: ["108", "102", "022-24177777"],
    description:
      "India's financial capital with world-class healthcare infrastructure and leading medical institutions.",
  },
  delhi: {
    name: "Delhi",
    state: "National Capital Territory",
    population: "11.0 million",
    coordinates: { lat: 28.6139, lng: 77.209 },
    languages: ["Hindi", "English", "Punjabi", "Urdu"],
    hospitals: 180,
    doctors: 30000,
    lifeExpectancy: 73.8,
    commonIssues: [
      "Severe air pollution and smog",
      "Respiratory diseases and asthma",
      "Heat-related illnesses in summer",
      "Vector-borne diseases",
      "Lifestyle and stress-related disorders",
    ],
    topHospitals: [
      { name: "AIIMS Delhi", specialty: "Multi-specialty", rating: 4.9 },
      { name: "Fortis Escorts Heart Institute", specialty: "Cardiac Care", rating: 4.8 },
      { name: "Max Super Speciality Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "Apollo Hospital", specialty: "Multi-specialty", rating: 4.6 },
      { name: "Sir Ganga Ram Hospital", specialty: "General Medicine", rating: 4.5 },
    ],
    emergencyNumbers: ["108", "102", "011-23921000"],
    description: "India's capital with premier medical institutions and comprehensive healthcare facilities.",
  },
  bangalore: {
    name: "Bangalore",
    state: "Karnataka",
    population: "8.4 million",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    languages: ["Kannada", "English", "Tamil", "Telugu", "Hindi"],
    hospitals: 120,
    doctors: 20000,
    lifeExpectancy: 75.1,
    commonIssues: [
      "Traffic pollution and respiratory issues",
      "Lifestyle diseases in IT professionals",
      "Stress and mental health concerns",
      "Seasonal allergies",
      "Dengue and chikungunya during monsoons",
    ],
    topHospitals: [
      { name: "Narayana Health City", specialty: "Cardiac Care", rating: 4.8 },
      { name: "Manipal Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "Apollo Hospital", specialty: "Multi-specialty", rating: 4.6 },
      { name: "Fortis Hospital", specialty: "Multi-specialty", rating: 4.5 },
      { name: "St. John's Medical College Hospital", specialty: "General Medicine", rating: 4.4 },
    ],
    emergencyNumbers: ["108", "102", "080-22227788"],
    description: "India's Silicon Valley with excellent healthcare infrastructure and medical research facilities.",
  },
  chennai: {
    name: "Chennai",
    state: "Tamil Nadu",
    population: "7.0 million",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    languages: ["Tamil", "English", "Telugu", "Hindi"],
    hospitals: 100,
    doctors: 18000,
    lifeExpectancy: 74.8,
    commonIssues: [
      "Heat stroke and dehydration",
      "Monsoon-related infections",
      "Dengue and chikungunya",
      "Coastal humidity-related skin issues",
      "Lifestyle diseases",
    ],
    topHospitals: [
      { name: "Apollo Hospital", specialty: "Multi-specialty", rating: 4.8 },
      { name: "Fortis Malar Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "MIOT International", specialty: "Orthopedics", rating: 4.6 },
      { name: "Stanley Medical College Hospital", specialty: "General Medicine", rating: 4.4 },
      { name: "Vijaya Hospital", specialty: "Multi-specialty", rating: 4.3 },
    ],
    emergencyNumbers: ["108", "102", "044-28190000"],
    description: "Major healthcare hub in South India with renowned medical colleges and hospitals.",
  },
  hyderabad: {
    name: "Hyderabad",
    state: "Telangana",
    population: "6.9 million",
    coordinates: { lat: 17.385, lng: 78.4867 },
    languages: ["Telugu", "Hindi", "English", "Urdu"],
    hospitals: 90,
    doctors: 15000,
    lifeExpectancy: 74.5,
    commonIssues: [
      "Heat-related illnesses",
      "Water scarcity health impacts",
      "Air pollution in IT corridors",
      "Lifestyle diseases in tech workers",
      "Seasonal viral infections",
    ],
    topHospitals: [
      { name: "Apollo Hospital", specialty: "Multi-specialty", rating: 4.8 },
      { name: "CARE Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "Continental Hospital", specialty: "Multi-specialty", rating: 4.6 },
      { name: "Yashoda Hospital", specialty: "Multi-specialty", rating: 4.5 },
      { name: "NIMS Hospital", specialty: "General Medicine", rating: 4.3 },
    ],
    emergencyNumbers: ["108", "102", "040-23607777"],
    description: "Emerging IT hub with growing healthcare infrastructure and medical tourism facilities.",
  },
  kolkata: {
    name: "Kolkata",
    state: "West Bengal",
    population: "4.5 million",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    languages: ["Bengali", "Hindi", "English"],
    hospitals: 80,
    doctors: 12000,
    lifeExpectancy: 73.2,
    commonIssues: [
      "Monsoon-related waterborne diseases",
      "Air pollution and respiratory issues",
      "Dengue and malaria",
      "Seasonal flu and viral infections",
      "Lifestyle and dietary disorders",
    ],
    topHospitals: [
      { name: "Apollo Gleneagles Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "AMRI Hospital", specialty: "Multi-specialty", rating: 4.6 },
      { name: "Fortis Hospital", specialty: "Multi-specialty", rating: 4.5 },
      { name: "Medical College Hospital", specialty: "General Medicine", rating: 4.2 },
      { name: "Ruby General Hospital", specialty: "Multi-specialty", rating: 4.1 },
    ],
    emergencyNumbers: ["108", "102", "033-22875000"],
    description: "Cultural capital with established medical institutions and traditional healthcare practices.",
  },
  pune: {
    name: "Pune",
    state: "Maharashtra",
    population: "3.1 million",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    languages: ["Marathi", "Hindi", "English"],
    hospitals: 70,
    doctors: 10000,
    lifeExpectancy: 75.3,
    commonIssues: [
      "Traffic pollution effects",
      "Monsoon-related infections",
      "Student stress and mental health",
      "Lifestyle diseases",
      "Seasonal allergies",
    ],
    topHospitals: [
      { name: "Ruby Hall Clinic", specialty: "Multi-specialty", rating: 4.7 },
      { name: "Jehangir Hospital", specialty: "Multi-specialty", rating: 4.6 },
      { name: "Deenanath Mangeshkar Hospital", specialty: "Multi-specialty", rating: 4.5 },
      { name: "Sahyadri Hospital", specialty: "Multi-specialty", rating: 4.4 },
      { name: "KEM Hospital", specialty: "General Medicine", rating: 4.2 },
    ],
    emergencyNumbers: ["108", "102", "020-26127777"],
    description: "Educational hub with quality healthcare facilities and medical research institutions.",
  },
  ahmedabad: {
    name: "Ahmedabad",
    state: "Gujarat",
    population: "5.6 million",
    coordinates: { lat: 23.0225, lng: 72.5714 },
    languages: ["Gujarati", "Hindi", "English"],
    hospitals: 85,
    doctors: 12000,
    lifeExpectancy: 74.1,
    commonIssues: [
      "Extreme heat and heat stroke",
      "Air pollution and dust storms",
      "Water quality issues",
      "Industrial pollution effects",
      "Lifestyle and dietary disorders",
    ],
    topHospitals: [
      { name: "Apollo Hospital", specialty: "Multi-specialty", rating: 4.7 },
      { name: "Sterling Hospital", specialty: "Multi-specialty", rating: 4.6 },
      { name: "Zydus Hospital", specialty: "Multi-specialty", rating: 4.5 },
      { name: "Civil Hospital", specialty: "General Medicine", rating: 4.1 },
      { name: "SAL Hospital", specialty: "Multi-specialty", rating: 4.3 },
    ],
    emergencyNumbers: ["108", "102", "079-26577777"],
    description: "Commercial capital of Gujarat with growing healthcare infrastructure and medical facilities.",
  },
}

// Additional cities for broader coverage
const additionalCities = [
  "jaipur",
  "surat",
  "lucknow",
  "kanpur",
  "nagpur",
  "indore",
  "thane",
  "bhopal",
  "visakhapatnam",
  "patna",
  "vadodara",
  "ghaziabad",
]

type CityName = keyof typeof cityData

interface PageProps {
  params: {
    cityName: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityName = params.cityName.toLowerCase() as CityName
  const city = cityData[cityName]

  if (!city) {
    return {
      title: "City Not Found - MyMedi.ai",
      description: "The requested city page was not found.",
    }
  }

  return {
    title: `AI Doctor in ${city.name} | Free Medical Consultation - MyMedi.ai`,
    description: `Get free AI-powered medical consultation in ${city.name}, ${city.state}. 24/7 healthcare support in ${city.languages.join(", ")}. ${city.hospitals}+ hospitals, ${city.doctors}+ doctors available.`,
    keywords: [
      `AI doctor ${city.name}`,
      `medical consultation ${city.name}`,
      `healthcare ${city.name}`,
      `free doctor consultation ${city.name}`,
      `health assessment ${city.name}`,
      `symptom checker ${city.name}`,
      `medicine identifier ${city.name}`,
      `${city.name} hospitals`,
      `${city.name} doctors`,
      `${city.languages[0]} medical consultation`,
    ].join(", "),
    openGraph: {
      title: `AI Doctor in ${city.name} | MyMedi.ai`,
      description: `Free AI-powered healthcare consultation for ${city.name} residents. Available in ${city.languages.join(", ")}.`,
      url: `https://mymedi.ai/city/${cityName}`,
      siteName: "MyMedi.ai",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `AI Doctor in ${city.name} | MyMedi.ai`,
      description: `Free AI healthcare consultation in ${city.name}. Available in ${city.languages.join(", ")}.`,
    },
    alternates: {
      canonical: `/city/${cityName}`,
    },
  }
}

export async function generateStaticParams() {
  const cityNames = Object.keys(cityData)
  return cityNames.map((cityName) => ({
    cityName: cityName,
  }))
}

export default function CityPage({ params }: PageProps) {
  const cityName = params.cityName.toLowerCase() as CityName
  const city = cityData[cityName]

  if (!city) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Structured Data for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalOrganization",
            name: `MyMedi.ai - ${city.name}`,
            description: `AI-powered healthcare platform serving ${city.name}, ${city.state}`,
            url: `https://mymedi.ai/city/${cityName}`,
            logo: "https://mymedi.ai/images/mymedi-logo.png",
            address: {
              "@type": "PostalAddress",
              addressLocality: city.name,
              addressRegion: city.state,
              addressCountry: "India",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: city.coordinates.lat,
              longitude: city.coordinates.lng,
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: city.emergencyNumbers[0],
              contactType: "emergency",
              availableLanguage: city.languages,
            },
            areaServed: {
              "@type": "City",
              name: city.name,
            },
            availableLanguage: city.languages,
            serviceType: "AI Healthcare Consultation",
            medicalSpecialty: ["General Medicine", "Emergency Medicine", "Preventive Medicine", "Telemedicine"],
          }),
        }}
      />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <MyMedLogo size="lg" />
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/assessment">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Assessment
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
            <Link href="/vitals">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
                <Activity className="w-4 h-4 mr-2" />
                Vitals
              </Button>
            </Link>
            <Link href="/diet">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <Apple className="w-4 h-4 mr-2" />
                Diet
              </Button>
            </Link>
            <Link href="/pregnancy">
              <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50 bg-transparent">
                <Baby className="w-4 h-4 mr-2" />
                Pregnancy
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent">
                <UserCheck className="w-4 h-4 mr-2" />
                Doctors
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AI Doctor in {city.name}</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Get instant AI-powered medical consultation in {city.name}, {city.state}. Available 24/7 in{" "}
              {city.languages.join(", ")} languages. Free healthcare support for all residents.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {city.languages.map((lang) => (
                <Badge key={lang} className="bg-blue-100 text-blue-800">
                  <Languages className="w-3 h-3 mr-1" />
                  {lang}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start AI Consultation
                </Button>
              </Link>
              <Link href="/assessment">
                <Button variant="outline" size="lg" className="px-8 py-4 bg-transparent">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Health Assessment
                </Button>
              </Link>
            </div>
          </section>

          {/* City Statistics */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Healthcare in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{city.population}</div>
                  <div className="text-gray-600">Population</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{city.hospitals}+</div>
                  <div className="text-gray-600">Hospitals</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Stethoscope className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{city.doctors.toLocaleString()}+</div>
                  <div className="text-gray-600">Doctors</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{city.lifeExpectancy}</div>
                  <div className="text-gray-600">Life Expectancy</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Top Hospitals */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Hospitals in {city.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {city.topHospitals.map((hospital, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{hospital.name}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-normal">{hospital.rating}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-blue-100 text-blue-800 mb-3">{hospital.specialty}</Badge>
                    <p className="text-sm text-gray-600">
                      Leading healthcare facility in {city.name} with excellent patient care and modern medical
                      equipment.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Common Health Issues */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Health Issues in {city.name}</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                      Health Concerns
                    </h3>
                    <ul className="space-y-2">
                      {city.commonIssues.map((issue, index) => (
                        <li key={index} className="text-gray-700 flex items-start">
                          <span className="text-orange-500 mr-2 mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      AI Health Solutions
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        24/7 symptom analysis and health advice
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Preventive care recommendations
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Emergency guidance and hospital referrals
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Medicine identification and interactions
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        Health monitoring and vitals tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Emergency Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Information</h2>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-red-800">Emergency Numbers for {city.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {city.emergencyNumbers.map((number, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">{number}</div>
                      <div className="text-sm text-gray-600">
                        {index === 0 ? "Emergency Services" : index === 1 ? "Ambulance" : "Local Emergency"}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      For non-emergency health questions, use our AI consultation service available 24/7
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Get Instant Healthcare Support in {city.name}</h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of {city.name} residents using AI-powered healthcare consultation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Free Consultation
                </Button>
              </Link>
              <Link href="/assessment">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 bg-transparent"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Health Assessment
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <PoweredByFooter />
    </div>
  )
}
