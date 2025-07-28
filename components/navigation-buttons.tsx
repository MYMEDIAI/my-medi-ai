"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Baby, Heart, MapPin, Pill, Utensils, Activity, FileText, User, Home } from "lucide-react"

export default function NavigationButtons() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Link href="/">
        <Button variant="outline" size="sm" className="bg-transparent">
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </Link>
      <Link href="/chat">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          AI Chat
        </Button>
      </Link>
      <Link href="/pregnancy">
        <Button className="bg-pink-600 hover:bg-pink-700 text-white" size="sm">
          <Baby className="w-4 h-4 mr-2" />
          Pregnancy
        </Button>
      </Link>
      <Link href="/diabetes-assessment">
        <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          Diabetes
        </Button>
      </Link>
      <Link href="/location">
        <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
          <MapPin className="w-4 h-4 mr-2" />
          Location
        </Button>
      </Link>
      <Link href="/medicine">
        <Button className="bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Pill className="w-4 h-4 mr-2" />
          Medicine
        </Button>
      </Link>
      <Link href="/diet">
        <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
          <Utensils className="w-4 h-4 mr-2" />
          Diet
        </Button>
      </Link>
      <Link href="/vitals">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          <Activity className="w-4 h-4 mr-2" />
          Vitals
        </Button>
      </Link>
      <Link href="/reports">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Reports
        </Button>
      </Link>
      <Link href="/body-mapper">
        <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
          <User className="w-4 h-4 mr-2" />
          Body Map
        </Button>
      </Link>
    </div>
  )
}
