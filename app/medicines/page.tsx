import type { Metadata } from "next"
import MedicinesClientPage from "./MedicinesClientPage"

// SEO Metadata for this page
export const metadata: Metadata = {
  title: "AI Medicine Identifier | Free Medicine Scanner App | MyMedi.ai",
  description:
    "Identify any medicine instantly with AI. Take a photo to get detailed information about uses, dosage, side effects, interactions, and price comparison. Free medicine identifier for India.",
  keywords:
    "medicine identifier, medicine scanner, pill identifier, drug identifier, medicine information, tablet identifier, medicine price comparison, drug interactions, medicine side effects India",
  openGraph: {
    title: "AI Medicine Identifier - Free Medicine Scanner App",
    description:
      "Identify any medicine instantly with AI. Get detailed information about uses, dosage, and price comparison.",
    url: "https://mymedi.ai/medicines",
  },
}

export default function MedicinesPage() {
  return <MedicinesClientPage />
}
