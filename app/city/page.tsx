import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Users,
  Building2,
  Stethoscope,
  Search,
  Home,
  MessageCircle,
  User,
  Activity,
  Apple,
  Baby,
  UserCheck,
} from "lucide-react"

import MyMedLogo from "@/components/mymed-logo"
import PoweredByFooter from "@/components/powered-by-footer"

export const metadata: Metadata = {
  title: "AI Healthcare Services in Indian Cities | MyMedi.ai",
  description:
    "Find AI-powered healthcare consultation services in major Indian cities. Free medical consultation available in Mumbai, Delhi, Bangalore, Chennai, Hyderabad, and 15+ more cities.",
  keywords: [
    "AI healthcare India",
    "medical consultation cities",
    "healthcare Mumbai Delhi Bangalore",
    "AI doctor Indian cities",
    "free medical consultation India",
    "healthcare services India",
    "telemedicine India cities",
    "AI health assistant India",
  ].join(", "),
  openGraph: {
    title: "AI Healthcare Services in Indian Cities | MyMedi.ai",
    description:
      "Free AI-powered medical consultation available in 20+ Indian cities. Get instant healthcare support in your local language.",
    url: "https://mymedi.ai/city",
    siteName: "MyMedi.ai",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Healthcare in Indian Cities | MyMedi.ai",
    description: "Free AI medical consultation in 20+ Indian cities. Available in local languages.",
  },
  alternates: {
    canonical: "/city",
  },
}

// City data for the directory
const cities = [
  {
    name: "Mumbai",
    state: "Maharashtra",
    population: "12.5M",
    hospitals: 150,
    slug: "mumbai",
    languages: ["Hindi", "Marathi", "English"],
    description: "India's financial capital with world-class healthcare infrastructure",
  },
  {
    name: "Delhi",
    state: "National Capital Territory",
    population: "11.0M",
    hospitals: 180,
    slug: "delhi",
    languages: ["Hindi", "English", "Punjabi"],
    description: "India's capital with premier medical institutions",
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    population: "8.4M",
    hospitals: 120,
    slug: "bangalore",
    languages: ["Kannada", "English", "Tamil"],
    description: "India's Silicon Valley with excellent healthcare facilities",
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    population: "7.0M",
    hospitals: 100,
    slug: "chennai",
    languages: ["Tamil", "English", "Telugu"],
    description: "Major healthcare hub in South India",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    population: "6.9M",
    hospitals: 90,
    slug: "hyderabad",
    languages: ["Telugu", "Hindi", "English"],
    description: "Emerging IT hub with growing healthcare infrastructure",
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    population: "4.5M",
    hospitals: 80,
    slug: "kolkata",
    languages: ["Bengali", "Hindi", "English"],
    description: "Cultural capital with established medical institutions",
  },
  {
    name: "Pune",
    state: "Maharashtra",
    population: "3.1M",
    hospitals: 70,
    slug: "pune",
    languages: ["Marathi", "Hindi", "English"],
    description: "Educational hub with quality healthcare facilities",
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    population: "5.6M",
    hospitals: 85,
    slug: "ahmedabad",
    languages: ["Gujarati", "Hindi", "English"],
    description: "Commercial capital of Gujarat with growing medical facilities",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    population: "3.1M",
    hospitals: 60,
    slug: "jaipur",
    languages: ["Hindi", "English", "Rajasthani"],
    description: "Pink City with traditional and modern healthcare blend",
  },
  {
    name: "Surat",
    state: "Gujarat",
    population: "4.5M",
    hospitals: 55,
    slug: "surat",
    languages: ["Gujarati", "Hindi", "English"],
    description: "Diamond city with expanding healthcare services",
  },
  {
    name: "Lucknow",
    state: "Uttar Pradesh",
    population: "2.8M",
    hospitals: 65,
    slug: "lucknow",
    languages: ["Hindi", "English", "Urdu"],
    description: "City of Nawabs with historic medical institutions",
  },
  {
    name: "Kanpur",
    state: "Uttar Pradesh",
    population: "2.7M",
    hospitals: 50,
    slug: "kanpur",
    languages: ["Hindi", "English"],
    description: "Industrial city with developing healthcare infrastructure",
  },
  {
    name: "Nagpur",
    state: "Maharashtra",
    population: "2.4M",
    hospitals: 45,
    slug: "nagpur",
    languages: ["Marathi", "Hindi", "English"],
    description: "Orange city with central India's medical hub",
  },
  {
    name: "Indore",
    state: "Madhya Pradesh",
    population: "1.9M",
    hospitals: 40,
    slug: "indore",
    languages: ["Hindi", "English"],
    description: "Commercial capital of MP with quality healthcare",
  },
  {
    name: "Thane",
    state: "Maharashtra",
    population: "1.8M",
    hospitals: 35,
    slug: "thane",
    languages: ["Marathi", "Hindi", "English"],
    description: "Mumbai's satellite city with modern medical facilities",
  },
  {
    name: "Bhopal",
    state: "Madhya Pradesh",
    population: "1.8M",
    hospitals: 42,
    slug: "bhopal",
    languages: ["Hindi", "English"],
    description: "City of Lakes with comprehensive healthcare services",
  },
  {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    population: "1.7M",
    hospitals: 38,
    slug: "visakhapatnam",
    languages: ["Telugu", "Hindi", "English"],
    description: "Port city with coastal healthcare excellence",
  },
  {
    name: "Patna",
    state: "Bihar",
    population: "1.7M",
    hospitals: 35,
    slug: "patna",
    languages: ["Hindi", "English"],
    description: "Historic city with emerging medical infrastructure",
  },
  {
    name: "Vadodara",
    state: "Gujarat",
    population: "1.7M",
    hospitals: 40,
    slug: "vadodara",
    languages: ["Gujarati", "Hindi", "English"],
    description: "Cultural city with quality healthcare facilities",
  },
  {
    name: "Ghaziabad",
    state: "Uttar Pradesh",
    population: "1.6M",
    hospitals: 30,
    slug: "ghaziabad",
    languages: ["Hindi", "English"],
    description: "NCR city with accessible healthcare services",
  },
]

export default function CityDirectoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Structured Data for City Directory */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "AI Healthcare Services in Indian Cities",
            description: "Directory of AI-powered healthcare consultation services available in major Indian cities",
            url: "https://mymedi.ai/city",
            mainEntity: {
              "@type": "ItemList",
              name: "Indian Cities with AI Healthcare Services",
              numberOfItems: cities.length,
              itemListElement: cities.map((city, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Place",
                  name: city.name,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: city.name,
                    addressRegion: city.state,
                    addressCountry: "India",
                  },
                  url: `https://mymedi.ai/city/${city.slug}`,
                },
              })),
            },
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">AI Healthcare in Indian Cities</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find AI-powered healthcare consultation services in your city. Free medical consultation available 24/7 in
              local languages across 20+ major Indian cities.
            </p>
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

          {/* Statistics Overview */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">20+</div>
                  <div className="text-gray-600">Cities Covered</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">100M+</div>
                  <div className="text-gray-600">People Served</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Building2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">1500+</div>
                  <div className="text-gray-600">Partner Hospitals</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Stethoscope className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-gray-600">AI Support</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Cities Grid */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Choose Your City</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.map((city) => (
                <Link key={city.slug} href={`/city/${city.slug}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{city.name}</span>
                        <MapPin className="w-5 h-5 text-blue-500" />
                      </CardTitle>
                      <p className="text-sm text-gray-600">{city.state}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-500 mr-1" />
                          <span>{city.population}</span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-500 mr-1" />
                          <span>{city.hospitals} hospitals</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {city.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} className="text-xs bg-blue-100 text-blue-800">
                            {lang}
                          </Badge>
                        ))}
                        {city.languages.length > 2 && (
                          <Badge className="text-xs bg-gray-100 text-gray-600">+{city.languages.length - 2}</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{city.description}</p>

                      <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        Get Healthcare Support
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Available in All Cities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">AI Health Chat</h3>
                  <p className="text-gray-600">
                    24/7 AI-powered medical consultation in your local language. Get instant health advice and symptom
                    analysis.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <User className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Health Assessment</h3>
                  <p className="text-gray-600">
                    Comprehensive health evaluation with personalized recommendations based on your symptoms and medical
                    history.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Activity className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Vitals Tracking</h3>
                  <p className="text-gray-600">
                    Monitor your vital signs and health metrics with AI-powered analysis and trend tracking.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Apple className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Diet Planning</h3>
                  <p className="text-gray-600">
                    Personalized nutrition plans based on your health goals, dietary preferences, and local food
                    availability.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Baby className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Pregnancy Care</h3>
                  <p className="text-gray-600">
                    Specialized AI guidance for expectant mothers with week-by-week pregnancy tracking and advice.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <UserCheck className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Doctor Network</h3>
                  <p className="text-gray-600">
                    Connect with verified doctors in your city when you need professional medical consultation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Start Your Healthcare Journey Today</h2>
            <p className="text-xl mb-6 opacity-90">
              Join millions of Indians using AI-powered healthcare consultation across the country
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
                  Take Health Assessment
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
