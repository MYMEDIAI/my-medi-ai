"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Utensils, Users, Shield, CheckCircle, Award, Leaf } from "lucide-react"

export default function IndiaFocusFeatures() {
  const statesCovered = [
    "Maharashtra",
    "Delhi",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "West Bengal",
    "Gujarat",
    "Rajasthan",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Kerala",
    "Punjab",
    "Haryana",
    "Bihar",
    "Odisha",
    "Assam",
    "Jharkhand",
    "Chhattisgarh",
    "Uttarakhand",
    "Himachal Pradesh",
    "Goa",
    "Tripura",
    "Manipur",
    "Meghalaya",
    "Nagaland",
    "Mizoram",
    "Arunachal Pradesh",
    "Sikkim",
    "Andaman & Nicobar",
    "Ladakh",
  ]

  const languages = [
    { name: "Hindi", speakers: "600M+", flag: "🇮🇳" },
    { name: "Bengali", speakers: "100M+", flag: "🏴" },
    { name: "Telugu", speakers: "95M+", flag: "🏴" },
    { name: "Marathi", speakers: "90M+", flag: "🏴" },
    { name: "Tamil", speakers: "80M+", flag: "🏴" },
    { name: "Gujarati", speakers: "60M+", flag: "🏴" },
    { name: "Urdu", speakers: "50M+", flag: "🏴" },
    { name: "Kannada", speakers: "45M+", flag: "🏴" },
    { name: "Odia", speakers: "40M+", flag: "🏴" },
    { name: "Malayalam", speakers: "35M+", flag: "🏴" },
    { name: "Punjabi", speakers: "30M+", flag: "🏴" },
    { name: "Assamese", speakers: "15M+", flag: "🏴" },
  ]

  const medicineCategories = [
    {
      category: "Ayurvedic Medicines",
      count: "50,000+",
      icon: Leaf,
      color: "from-green-500 to-emerald-500",
      examples: ["Chyawanprash", "Triphala", "Ashwagandha", "Brahmi"],
    },
    {
      category: "Generic Medicines",
      count: "25,000+",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      examples: ["Paracetamol", "Crocin", "Dolo", "Combiflam"],
    },
    {
      category: "Traditional Remedies",
      count: "15,000+",
      icon: Award,
      color: "from-orange-500 to-yellow-500",
      examples: ["Kadha", "Churna", "Bhasma", "Ras"],
    },
    {
      category: "Local Brands",
      count: "30,000+",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      examples: ["Himalaya", "Dabur", "Patanjali", "Baidyanath"],
    },
  ]

  const indianDiseases = [
    {
      category: "Tropical Diseases",
      diseases: ["Dengue", "Malaria", "Chikungunya", "Typhoid"],
      prevalence: "High in monsoon",
      color: "from-red-500 to-orange-500",
    },
    {
      category: "Lifestyle Diseases",
      diseases: ["Diabetes Type 2", "Hypertension", "Obesity", "PCOD"],
      prevalence: "Urban epidemic",
      color: "from-purple-500 to-pink-500",
    },
    {
      category: "Nutritional Deficiencies",
      diseases: ["Iron Deficiency", "Vitamin D", "B12 Deficiency", "Protein Malnutrition"],
      prevalence: "Widespread",
      color: "from-green-500 to-teal-500",
    },
    {
      category: "Respiratory Issues",
      diseases: ["Asthma", "COPD", "Pollution-related", "Allergic Rhinitis"],
      prevalence: "High in cities",
      color: "from-blue-500 to-indigo-500",
    },
  ]

  return (
    <div className="space-y-12">
      {/* Geographic Coverage */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">🗺️ Complete India Coverage</CardTitle>
          <p className="text-lg text-gray-600">Available across all 28 states and 8 union territories of India</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {statesCovered.map((state, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-green-100 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-800">{state}</span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">28</div>
                <div className="text-gray-600">States Covered</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                <div className="text-gray-600">Union Territories</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">700+</div>
                <div className="text-gray-600">Cities & Towns</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Support */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">🗣️ Regional Language Support</CardTitle>
          <p className="text-lg text-gray-600">
            Communicate in your native language with AI that understands Indian languages
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((lang, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-gray-900">{lang.name}</div>
                      <div className="text-sm text-gray-600">{lang.speakers} speakers</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Voice & Text Support</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medicine Database */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            💊 Comprehensive Indian Medicine Database
          </CardTitle>
          <p className="text-lg text-gray-600">
            Complete database of Indian medicines including Ayurvedic, generic, and local brands
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicineCategories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${category.color} shadow-lg`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.category}</h3>
                <div className="text-2xl font-bold text-orange-600 mb-3">{category.count}</div>
                <div className="space-y-1">
                  {category.examples.map((example, idx) => (
                    <div key={idx} className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indian Disease Patterns */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">🏥 Indian Disease Pattern Recognition</CardTitle>
          <p className="text-lg text-gray-600">
            Specialized knowledge of diseases common in Indian subcontinent and climate
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indianDiseases.map((diseaseGroup, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${diseaseGroup.color} shadow-lg mr-4`}>
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{diseaseGroup.category}</h3>
                    <Badge className="bg-purple-100 text-purple-800 mt-1">{diseaseGroup.prevalence}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {diseaseGroup.diseases.map((disease, idx) => (
                    <div key={idx} className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                      {disease}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Integration */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            🕉️ Cultural & Traditional Medicine Integration
          </CardTitle>
          <p className="text-lg text-gray-600">
            Respecting Indian traditions while providing modern healthcare solutions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ayurveda Integration</h3>
              <p className="text-gray-600 mb-4">
                Complete Ayurvedic medicine database with dosha analysis and traditional treatment recommendations
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Dosha Assessment
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Herbal Remedies
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Lifestyle Guidance
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Indian Nutrition</h3>
              <p className="text-gray-600 mb-4">
                Diet plans based on Indian cuisine, regional preferences, and traditional food wisdom
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Regional Cuisines
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Vegetarian Options
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Festival Diets
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Family Healthcare</h3>
              <p className="text-gray-600 mb-4">
                Understanding Indian family structures and providing care for joint families and elderly
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Joint Family Care
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Elderly Support
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Child Healthcare
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
