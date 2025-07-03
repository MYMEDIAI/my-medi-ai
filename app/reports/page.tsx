import type { Metadata } from "next"
import ReportsPageClient from "./ReportsPageClient"

// SEO Metadata for this page
export const metadata: Metadata = {
  title: "AI Medical Report Analyzer | Free Lab Report Analysis | MyMedi.ai",
  description:
    "Upload medical reports for instant AI analysis. Get comprehensive insights, key findings, and health recommendations from lab results, blood tests, and diagnostic reports. Free medical report analyzer for India.",
  keywords:
    "medical report analysis, lab report analyzer, blood test analysis, AI medical report, diagnostic report analysis, health report insights, medical report interpretation, lab results analysis India",
  openGraph: {
    title: "AI Medical Report Analyzer - Free Lab Report Analysis",
    description:
      "Upload medical reports for instant AI analysis. Get comprehensive insights and health recommendations.",
    url: "https://mymedi.ai/reports",
  },
}

export default function ReportsPage() {
  return <ReportsPageClient />
}
