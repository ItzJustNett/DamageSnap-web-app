import type React from "react"
import { cn } from "@/lib/utils"

interface AppFooterProps extends React.HTMLAttributes<HTMLElement> {}

export function AppFooter({ className, ...props }: AppFooterProps) {
  return (
    <footer
      className={cn(
        "w-full py-6 px-8 bg-black/30 text-white text-center text-sm border-t border-white/20 z-20",
        className,
      )}
      {...props}
    >
      {/* Content moved to SidebarNav */}
    </footer>
  )
}
