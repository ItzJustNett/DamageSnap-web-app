import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BackgroundImageProps {
  children: React.ReactNode
  className?: string
}

export function BackgroundImage({ children, className }: BackgroundImageProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      <Image
        src="/images/wildfire-background.jpg"
        alt="Wildfire background"
        quality={75} // Adjust quality for performance if needed
        // Removed fill, using h-screen w-screen fixed directly for explicit sizing
        className="z-0 blur-sm brightness-75 fixed h-screen w-screen object-cover" // Explicitly h-screen w-screen and object-cover
        priority // Load immediately as it's a background
      />
      <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dark overlay for readability */}
      <div className="relative z-20 flex flex-col min-h-screen">{children}</div>
    </div>
  )
}
