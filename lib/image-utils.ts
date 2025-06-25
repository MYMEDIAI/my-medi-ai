import fs from "fs"
import path from "path"

export const ensureImageExists = (imagePath: string): boolean => {
  try {
    const fullPath = path.join(process.cwd(), "public", imagePath)
    const stat = fs.statSync(fullPath)
    return stat.isFile()
  } catch (error) {
    return false
  }
}

export const getLogoUrl = (baseUrl?: string): string => {
  const defaultUrl = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const logoPath = "/images/medi-ai-logo.png"

  // Check if logo exists
  if (ensureImageExists("images/medi-ai-logo.png")) {
    return `${defaultUrl}${logoPath}`
  }

  // Fallback to placeholder
  return "https://via.placeholder.com/60x60/8b5cf6/ffffff?text=M"
}

export const createPlaceholderLogo = (): string => {
  // SVG placeholder for the logo
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="12" fill="#8b5cf6"/>
      <rect x="10" y="10" width="40" height="40" rx="8" fill="#a855f7"/>
      <rect x="15" y="15" width="30" height="30" rx="6" fill="#c084fc"/>
      <text x="30" y="38" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">M</text>
    </svg>
  `).toString("base64")}`
}
