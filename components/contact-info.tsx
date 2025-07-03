"use client"

import { Phone, MapPin, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface ContactInfoProps {
  className?: string
}

export default function ContactInfo({ className }: ContactInfoProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Phone</p>
              <a href="tel:+919701744770" className="text-blue-600 hover:underline">
                +91 9701744770
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-gray-600">Amavarathi, Andhra Pradesh, India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:contact@mymed.ai" className="text-blue-600 hover:underline">
                contact@mymed.ai
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const ContactInfoComponent = ContactInfo
