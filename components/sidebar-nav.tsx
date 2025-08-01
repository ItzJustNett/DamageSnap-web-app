"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link" // Import Link
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Flame,
  HeartHandshake,
  MapPin,
  BarChart2,
  ImageIcon,
  Newspaper,
  UserCircle,
  CalendarCheck,
} from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  activeSection: string
  onSectionChange: (section: string) => void
  currentUser: { id: string; name: string; email: string } | null
  onLogout: () => void
  setOpen?: (open: boolean) => void // New prop to close the sheet on mobile
}

export function SidebarNav({
  activeSection,
  onSectionChange,
  currentUser,
  onLogout,
  className,
  setOpen, // Destructure new prop
  ...props
}: SidebarNavProps) {
  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      section: "dashboard",
    },
    {
      title: "Posts",
      icon: Newspaper,
      section: "posts",
    },
    {
      title: "Damage",
      icon: Flame,
      section: "damage-reports",
    },
    {
      title: "Help",
      icon: HeartHandshake,
      section: "help-requests",
    },
    {
      title: "Volunteer",
      icon: CalendarCheck,
      section: "volunteer-events",
    },
    {
      title: "Recovery",
      icon: MapPin,
      section: "recovery-locations",
    },
    {
      title: "AI Analysis",
      icon: ImageIcon,
      section: "ai-analysis",
    },
    {
      title: "Leaderboard",
      icon: BarChart2,
      section: "leaderboard",
    },
  ]

  const handleSectionClick = (section: string) => {
    onSectionChange(section)
    if (setOpen) {
      setOpen(false) // Close the sheet after clicking a nav item
    }
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full", // Removed fixed positioning, width, and shadow from here
        className,
      )}
      {...props}
    >
      {/* App Title and Icon */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-white/20">
        <Image src="/favicon.png" alt="DamageSnap Icon" width={32} height={32} className="mr-3" />
        <h1 className="text-2xl font-bold text-white">DamageSnap</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.section}
            variant="ghost"
            onClick={() => handleSectionClick(item.section)} // Use new handler
            className={cn(
              "flex items-center justify-start h-12 px-4 rounded-md text-lg", // Adjusted for vertical layout
              activeSection === item.section
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "text-[#D9D9D9] hover:bg-white/20 hover:text-white",
            )}
          >
            <item.icon className="h-6 w-6 mr-3" />
            <span>{item.title}</span>
          </Button>
        ))}
      </nav>

      {/* User Account Dropdown */}
      {currentUser ? (
        <div className="p-4 border-t border-white/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start h-12 px-4 rounded-md text-lg text-white hover:bg-white/20"
              >
                <UserCircle className="h-8 w-8 mr-3" />
                <span>{currentUser.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
              {" "}
              {/* Align to start for sidebar */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="h-16" /> // Placeholder if no user
      )}

      {/* Copyright and Policy Links */}
      <div className="p-4 text-xs text-white/70 space-y-1 border-t border-white/20">
        <p>&copy; {new Date().getFullYear()} DamageSnap. All rights reserved.</p>
        <div className="flex flex-col gap-1">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/safety-guidelines" className="hover:underline">
            Safety Guidelines
          </Link>
        </div>
      </div>
    </aside>
  )
}
