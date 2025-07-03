import type { Metadata } from "next"
import BodyMapperClientPage from "./BodyMapperClientPage"

// SEO Metadata for this page
export const metadata: Metadata = {
  title: "AI Body Symptom Mapper | Interactive Health Assessment | MyMedi.ai",
  description:
    "Interactive body mapping for precise symptom analysis. Click on body parts, describe symptoms, and get AI-powered health insights, recommendations, and urgency assessment. Free symptom checker for India.",
  keywords:
    "body symptom mapper, symptom checker, interactive body map, health assessment, symptom analysis, body pain checker, medical symptom tracker, AI health diagnosis India",
  openGraph: {
    title: "AI Body Symptom Mapper - Interactive Health Assessment",
    description: "Interactive body mapping for precise symptom analysis and AI-powered health insights.",
    url: "https://mymedi.ai/body-mapper",
  },
}

export default function BodyMapperPage() {
  return <BodyMapperClientPage />
}
