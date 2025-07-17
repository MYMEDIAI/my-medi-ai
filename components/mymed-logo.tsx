"use client"

import Image from "next/image"
import Link from "next/link"

interface MyMedLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  variant?: "icon" | "full"
  theme?: "light" | "dark"
}

export default function MyMedLogo({
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
  const accentColor = theme === "dark" ? "text-gray-300" : "text-pink-500"

  if (variant === "full") {
    return (
      <Link href="/" className={`flex items-center hover:opacity-80 transition-opacity cursor-pointer ${className}`}>
        <Image
          src="/images/mymed-logo-with-text.png"
          alt="My Medi.AI - Home"
          width={size === "sm" ? 120 : size === "md" ? 160 : 200}
          height={size === "sm" ? 40 : size === "md" ? 50 : 60}
          className="object-contain"
        />
      </Link>
    )
  }

  return (
    <Link
      href="/"
      className={`flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer ${className}`}
    >
      <Image
        src="/images/mymed-logo.png"
        alt="My Medi.AI Logo - Home"
        width={size === "sm" ? 32 : size === "md" ? 48 : 64}
        height={size === "sm" ? 32 : size === "md" ? 48 : 64}
        className={`object-contain ${sizeClasses[size]}`}
      />
      {showText && (
        <span className={`font-bold ${textColor} ${textSizes[size]}`}>
          My Medi<span className={accentColor}>.AI</span>
        </span>
      )}
    </Link>
  )
}
