"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BackgroundImage } from "@/components/background-image"
import { Flame, HeartHandshake, MapPin, BarChart2, ImageIcon, Newspaper, CalendarCheck } from "lucide-react"
import { AppFooter } from "@/components/app-footer" // Import AppFooter

export default function MarketingPage() {
  const features = [
    {
      title: "AI Damage Analysis",
      description: "Upload photos and videos for advanced AI assessment of damage severity and repair suggestions.",
      icon: ImageIcon,
    },
    {
      title: "Community Connection",
      description: "Share updates, find support, and connect with other users and volunteers in affected areas.",
      icon: Newspaper,
    },
    {
      title: "Help & Volunteer",
      description: "Request or offer assistance for those in need, from supplies to physical aid.",
      icon: HeartHandshake,
    },
    {
      title: "Coordinated Recovery",
      description: "Discover and join hands-on efforts to restore and rebuild affected areas and infrastructure.",
      icon: MapPin,
    },
    {
      title: "Volunteer Events",
      description: "Find and organize community volunteer activities, from cleanups to rebuilding projects.",
      icon: CalendarCheck,
    },
    {
      title: "Impact Leaderboard",
      description: "See top contributors and track your positive impact in the DamageSnap community.",
      icon: BarChart2,
    },
    {
      title: "Damage Reporting",
      description: "Quickly report wildfire damage with location and photo evidence to inform recovery efforts.",
      icon: Flame,
    },
  ]

  return (
    <BackgroundImage>
      <header className="flex items-center justify-center h-16 px-8 bg-white/10 border-b border-white/20 shadow-sm z-20">
        <div className="flex items-center">
          <Image src="/favicon.png" alt="DamageSnap Icon" width={32} height={32} className="mr-3" />
          <h1 className="text-2xl font-bold text-white">DamageSnap</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8 pt-0 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mx-auto space-y-12 py-12">
          {/* Hero Section */}
          <section className="text-center p-8 bg-black/30 rounded-lg shadow-lg">
            <h2 className="text-5xl font-bold text-white mb-4">Empowering Communities in Wildfire Recovery</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              DamageSnap: AI-powered assessment, community support, and coordinated rebuilding for a stronger tomorrow.
            </p>
            <Link href="/login" passHref>
              <Button size="lg" className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6">
                Proceed to App
              </Button>
            </Link>
          </section>

          {/* Features Section */}
          <section className="bg-white/80 p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">What DamageSnap Offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col items-center text-center p-6">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-emerald-600 mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Call to Action at the bottom */}
          <section className="text-center p-8 bg-black/30 rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold text-white mb-6">Ready to make a difference?</h3>
            <p className="text-lg text-white/90 mb-8">
              Join the DamageSnap community and contribute to wildfire recovery efforts.
            </p>
            <Link href="/login" passHref>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6">
                Proceed to App
              </Button>
            </Link>
          </section>
        </div>
      </main>
      <AppFooter /> {/* Added AppFooter */}
    </BackgroundImage>
  )
}
