"use client"

import type React from "react"
import Image from "next/image"

interface MyMedLogoProps {
  className?: string
}

const MyMedLogo: React.FC<MyMedLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/images/mymedi-ai-logo.png" alt="MyMedi.ai Logo" width={32} height={32} className="w-8 h-8" />
      <span className="font-semibold">
        <span style={{ color: "#AE57EA" }}>mymedi</span>
        <span style={{ color: "#8045c6" }}>.</span>
        <span style={{ color: "#fb80bd" }}>ai</span>
      </span>
    </div>
  )
}

export default MyMedLogo
