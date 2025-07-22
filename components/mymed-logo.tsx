import type React from "react"

interface MyMedLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const MyMedLogo: React.FC<MyMedLogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img src="/images/mymedi-logo.png" alt="MyMedi.ai" className={`${sizeClasses[size]} mr-2 sm:mr-3`} />
      <span
        className={`font-bold text-green-600 ${
          size === "sm" ? "text-lg" : size === "md" ? "text-xl" : size === "lg" ? "text-2xl" : "text-3xl"
        }`}
      >
        MyMedi.ai
      </span>
    </div>
  )
}

export default MyMedLogo
