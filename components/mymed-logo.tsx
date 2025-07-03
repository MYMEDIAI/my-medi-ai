"use client"

import Image from "next/image"

interface MyMedLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  variant?: "icon" | "full"
  theme?: "light" | "dark"
}

function MyMedLogoComponent({
  size = "md",
  showText = true,
  className = "",
  variant = "icon",
  theme = "light",
}: MyMedLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  const textColor = theme === "dark" ? "text-white" : "text-purple-700"
  const accentColor = theme === "dark" ? "text-pink-300" : "text-pink-500"

  if (variant === "full") {
    return (
      <div className={`flex items-center ${className}`}>
        <Image
          src="/images/mymed-logo-with-text.png"
          alt="My Medi.AI - AI-Powered Healthcare Platform for India"
          width={size === "sm" ? 120 : size === "md" ? 160 : 200}
          height={size === "sm" ? 40 : size === "md" ? 50 : 60}
          className="object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image
        src="/images/mymed-logo.png"
        alt="My Medi.AI Logo - AI Healthcare Platform"
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className={`object-contain ${sizeClasses[size]}`}
        priority
      />
      {showText && (
        <span className={`font-bold ${textColor} ${textSizes[size]}`}>
          My Medi<span className={accentColor}>.AI</span>
        </span>
      )}
    </div>
  )
}

// Default export
export default MyMedLogoComponent

// Named exports for compatibility
export const MyMediLogo = MyMedLogoComponent
export const MyMedLogo = MyMedLogoComponent

// Type export
export type { MyMedLogoProps }
