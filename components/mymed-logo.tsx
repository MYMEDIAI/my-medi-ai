import { cn } from "@/lib/utils"

interface MyMedLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export default function MyMedLogo({ size = "md", showText = true, className }: MyMedLogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
        <div className="relative h-full w-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-bold text-gray-900", textSizeClasses[size])}>MYMED.AI</span>
          <span className="text-xs text-gray-500 -mt-1">Healthcare AI</span>
        </div>
      )}
    </div>
  )
}
