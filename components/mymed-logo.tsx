"use client"

import Image from "next/image"

interface MyMedLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  variant?: "icon" | "full"
}

export default function MyMedLogo({ size = "md", showText = true, className = "", variant = "icon" }: MyMedLogoProps) {
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

  if (variant === "full") {
    return (
      <div className={`flex items-center ${className}`}>
        <Image
          src="/images/mymed-logo-with-text.png"
          alt="My Medi.AI"
          width={size === "sm" ? 120 : size === "md" ? 160 : 200}
          height={size === "sm" ? 40 : size === "md" ? 50 : 60}
          className="object-contain"
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Image
        src="/images/mymed-logo.png"
        alt="My Medi.AI Logo"
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className={`object-contain ${sizeClasses[size]}`}
      />
      {showText && (
        <span className={`font-bold text-purple-700 ${textSizes[size]}`}>
          My Medi<span className="text-pink-500">.AI</span>
        </span>
      )}
    </div>
  )
}
