import Image from "next/image"
import Link from "next/link" // Import Link
import { Button } from "@/components/ui/button" // Import Button
import { BackgroundImage } from "@/components/background-image"
import { AppFooter } from "@/components/app-footer"

export default function SafetyGuidelinesPage() {
  return (
    <BackgroundImage>
      <header className="flex items-center justify-center h-16 px-8 bg-white/10 border-b border-white/20 shadow-sm z-20">
        <div className="flex items-center">
          <Image src="/favicon.png" alt="DamageSnap Icon" width={32} height={32} className="mr-3" />
          <h1 className="text-2xl font-bold text-white">DamageSnap</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="w-full max-w-4xl mx-auto space-y-8 bg-white/80 p-6 rounded-lg shadow-lg text-gray-800">
          <div className="mb-6">
            <Link href="/" passHref>
              <Button variant="outline" className="bg-white/20 text-gray-800 hover:bg-white/30 hover:text-gray-900">
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-center">Safety Guidelines</h1>
          <p className="text-lg text-center text-gray-700">
            Your safety is our top priority. Please review these guidelines before engaging in any activities related to
            wildfire recovery.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-6 mb-3">General Safety Precautions</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Assess the Situation:</strong> Before entering any affected area, ensure it has been declared
                safe by local authorities. Do not enter areas still under active fire or evacuation orders.
              </li>
              <li>
                <strong>Personal Protective Equipment (PPE):</strong> Always wear appropriate PPE, including sturdy
                footwear, long pants, long-sleeved shirts, gloves, eye protection, and a dust mask or respirator.
              </li>
              <li>
                <strong>Stay Hydrated:</strong> Carry plenty of water and drink regularly, especially in hot or smoky
                conditions.
              </li>
              <li>
                <strong>Communicate:</strong> Inform someone of your plans, location, and expected return time. Carry a
                fully charged mobile phone.
              </li>
              <li>
                <strong>Hazard Awareness:</strong> Be aware of potential hazards such as unstable structures, downed
                power lines, hot spots, falling debris, and hazardous materials.
              </li>
              <li>
                <strong>First Aid:</strong> Carry a basic first aid kit and know how to use it.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-6 mb-3">Wildfire-Specific Guidelines</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Smoke Inhalation:</strong> Limit exposure to smoke. If you experience respiratory issues, seek
                medical attention immediately.
              </li>
              <li>
                <strong>Ash and Debris:</strong> Ash can conceal dangerous hot spots and sharp objects. Avoid walking
                through deep ash.
              </li>
              <li>
                <strong>Wildlife:</strong> Be aware that displaced wildlife may be present and can be unpredictable.
              </li>
              <li>
                <strong>Equipment Safety:</strong> If using tools or heavy equipment, ensure you are properly trained
                and follow all safety protocols.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold mt-6 mb-3">Reporting and Communication</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Accurate Reporting:</strong> When submitting damage reports, provide accurate and detailed
                information. Do not put yourself at risk to get a photo.
              </li>
              <li>
                <strong>Emergency Services:</strong> In case of immediate danger or emergency, contact local emergency
                services (e.g., 911 or your local equivalent) first.
              </li>
              <li>
                <strong>Respect Privacy:</strong> When sharing information or photos, respect the privacy of individuals
                and properties.
              </li>
            </ul>
          </section>

          <p className="text-center text-gray-700 mt-8">
            These guidelines are for informational purposes only and do not replace professional training or official
            instructions from emergency services. Always prioritize your safety and the safety of others.
          </p>
        </div>
      </main>
      <AppFooter />
    </BackgroundImage>
  )
}
