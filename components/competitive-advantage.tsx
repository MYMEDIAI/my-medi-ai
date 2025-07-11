"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, Languages, Heart, Banknote, Globe } from "lucide-react"

export default function CompetitiveAdvantage() {
  const indianFeatures = [
    {
      title: "Indian Disease Database",
      description:
        "Specialized knowledge of diseases common in India like dengue, malaria, typhoid, diabetes patterns specific to Indian population",
      icon: Heart,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Regional Medicine Names",
      description: "Recognizes local medicine names in Hindi, Tamil, Telugu, Bengali and other regional languages",
      icon: Languages,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Indian Food & Nutrition",
      description: "Diet plans based on Indian cuisine, regional food habits, vegetarian/non-vegetarian preferences",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Affordable Healthcare",
      description:
        "Pricing designed for Indian middle-class families with flexible payment options and insurance integration",
      icon: Banknote,
      color: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <div className="space-y-12">
      {/* Main Features Highlight */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            🇮🇳 MyMedi.AI - India's Most Advanced Healthcare Platform
          </CardTitle>
          <p className="text-lg text-gray-600">
            See why 500,000+ Indians choose MyMedi.AI for comprehensive, affordable, and culturally-relevant healthcare
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Banknote className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Most Affordable</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Free basic consultations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Family sharing features</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>No hidden charges</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Languages className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">15+ Languages</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Hindi, Tamil, Telugu, Bengali</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Marathi, Gujarati, Kannada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>And many more regional languages</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Indian Healthcare</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Indian disease database</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Ayurveda integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>Indian medicine recognition</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* India-Specific Features */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            🇮🇳 Built Specifically for Indian Healthcare
          </CardTitle>
          <p className="text-lg text-gray-600">
            Features designed exclusively for Indian patients, diseases, and healthcare system
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indianFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Testimonials - India Specific */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
            🗣️ What Indian Users Say About MyMedi.AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/placeholder-user.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-gray-900">Rajesh Sharma</div>
                  <div className="text-sm text-gray-600">Mumbai • Healthcare Professional</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "MyMedi.AI understands Hindi much better than other platforms. The medicine scanner works perfectly with
                Indian medicines and the features are very comprehensive for my family."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/placeholder-user.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-gray-900">Priya Patel</div>
                  <div className="text-sm text-gray-600">Ahmedabad • Patient</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "The Ayurveda integration is amazing! Other platforms don't have this. MyMedi.AI gives both modern and
                traditional treatment options which is perfect for Indian families."
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <img src="/placeholder-user.jpg" alt="User" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="font-bold text-gray-900">Dr. Suresh Kumar</div>
                  <div className="text-sm text-gray-600">Chennai • Doctor</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic">
                "As a doctor, I recommend MyMedi.AI to my patients. It has better understanding of Indian diseases and
                the regional language support helps my patients from rural areas."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
