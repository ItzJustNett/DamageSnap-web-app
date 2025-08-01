"use client"

import { RegisterForm } from "@/components/register-form"
import Image from "next/image"
import { BackgroundImage } from "@/components/background-image"
import { AppFooter } from "@/components/app-footer" // Import AppFooter

export default function RegisterPage() {
  return (
    <BackgroundImage>
      <header className="flex items-center justify-center h-16 px-8 bg-white/10 border-b border-white/20 shadow-sm z-20">
        <div className="flex items-center">
          <Image src="/favicon.png" alt="DamageSnap Icon" width={32} height={32} className="mr-3" />
          <h1 className="text-2xl font-bold text-white">DamageSnap</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <div className="flex justify-center">
          <RegisterForm />
        </div>
      </main>
      <AppFooter /> {/* Added AppFooter */}
    </BackgroundImage>
  )
}
