"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { damage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react" // Import Loader2 for loading state

interface CreateDamageReportFormProps {
  userId: string | undefined
  onReportCreated: () => void
  initialLatitude?: number
  initialLongitude?: number
  initialDamageScore?: number
  initialDescription?: string
  initialCostEstimate?: number
  onCancel?: () => void
}

export function CreateDamageReportForm({
  userId,
  onReportCreated,
  initialLatitude,
  initialLongitude,
  initialDamageScore,
  initialDescription,
  initialCostEstimate,
  onCancel,
}: CreateDamageReportFormProps) {
  const { toast } = useToast()

  const [reportLatitude, setReportLatitude] = useState<number | string>(initialLatitude ?? "")
  const [reportLongitude, setReportLongitude] = useState<number | string>(initialLongitude ?? "")
  const [reportDamageScore, setReportDamageScore] = useState<number | string>(initialDamageScore ?? 0)
  const [reportDescription, setReportDescription] = useState(initialDescription ?? "")
  const [reportCostEstimate, setReportCostEstimate] = useState<number | string>(initialCostEstimate ?? 0)
  const [reportPhoto, setReportPhoto] = useState<File | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // Effect to handle initial values and attempt geolocation if not provided
  useEffect(() => {
    setReportLatitude(initialLatitude ?? "")
    setReportLongitude(initialLongitude ?? "")
    setReportDamageScore(initialDamageScore ?? 0)
    setReportDescription(initialDescription ?? "")
    setReportCostEstimate(initialCostEstimate ?? 0)
    setReportPhoto(null) // Clear photo when initial values change

    // If initial latitude/longitude are not provided, try to get current geolocation
    if (initialLatitude === undefined || initialLongitude === undefined) {
      if (navigator.geolocation) {
        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setReportLatitude(position.coords.latitude)
            setReportLongitude(position.coords.longitude)
            setIsLocating(false)
          },
          (error) => {
            console.error("Geolocation failed:", error)
            // Do not show a toast to the user, as per request.
            // Latitude/Longitude will remain empty strings, triggering validation later.
            setIsLocating(false)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        )
      } else {
        console.warn("Geolocation is not supported by this browser.")
        // Latitude/Longitude will remain empty strings, triggering validation later.
      }
    }
  }, [initialLatitude, initialLongitude, initialDamageScore, initialDescription, initialCostEstimate])

  const handleCreateDamageReport = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a damage report.",
        variant: "destructive",
      })
      return
    }

    if (typeof reportLatitude !== "number" || typeof reportLongitude !== "number") {
      toast({
        title: "Error",
        description: "Latitude and Longitude must be valid numbers.",
        variant: "destructive",
      })
      return
    }

    const reportData = {
      user_id: userId,
      latitude: reportLatitude,
      longitude: reportLongitude,
      damage_score:
        typeof reportDamageScore === "number" ? reportDamageScore : Number.parseInt(reportDamageScore as string),
      description: reportDescription,
      cost_estimate:
        typeof reportCostEstimate === "number" ? reportCostEstimate : Number.parseFloat(reportCostEstimate as string),
      photo: reportPhoto,
    }

    const { data, error } = await damage.createDamageReport(reportData)

    if (data) {
      toast({
        title: "Damage Report Created",
        description: "Your damage report has been submitted successfully!",
      })
      // Clear form fields
      setReportLatitude("")
      setReportLongitude("")
      setReportDamageScore(0)
      setReportDescription("")
      setReportCostEstimate(0)
      setReportPhoto(null)
      const fileInput = document.getElementById("reportPhoto") as HTMLInputElement
      if (fileInput) fileInput.value = ""
      onReportCreated() // Trigger refresh in parent
    } else {
      toast({
        title: "Damage Report Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Create Damage Report</CardTitle>
        <CardDescription>Submit a new damage report with photo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateDamageReport} className="space-y-4">
          {/* Hidden inputs for Latitude and Longitude */}
          <input type="hidden" name="latitude" value={reportLatitude} />
          <input type="hidden" name="longitude" value={reportLongitude} />

          <div>
            <Label htmlFor="reportDamageScore">Damage Score (0-10)</Label>
            <Input
              id="reportDamageScore"
              type="number"
              min="0"
              max="10" // Corrected: Removed the extra backslash
              placeholder="e.g., 3"
              value={reportDamageScore}
              onChange={(e) => setReportDamageScore(Number.parseInt(e.target.value) || e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reportDescription">Description</Label>
            <Textarea
              id="reportDescription"
              placeholder="Describe the damage"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reportCostEstimate">Cost Estimate</Label>
            <Input
              id="reportCostEstimate"
              type="number"
              step="0.01"
              placeholder="e.g., 1500.00"
              value={reportCostEstimate}
              onChange={(e) => setReportCostEstimate(Number.parseFloat(e.target.value) || e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reportPhoto">Photo</Label>
            <Input
              id="reportPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => setReportPhoto(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLocating}>
              {isLocating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Location...
                </>
              ) : (
                "Submit Damage Report"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
