"use client"

import type React from "react"
import { useState } from "react"
import { damage, geocoding, type AnalysisResult, type AIAnalysisDetails } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CreateDamageReportForm } from "./create-damage-report-form"
import { Loader2, CheckCircle, XCircle, FilePlus, Lightbulb, DollarSign } from "lucide-react"

interface RequestDamageAnalysisFormProps {
  userId: string | undefined
  onReportCreated: () => void
}

export function RequestDamageAnalysisForm({ userId, onReportCreated }: RequestDamageAnalysisFormProps) {
  const { toast } = useToast()
  const [photo, setPhoto] = useState<File | null>(null)
  const [locationString, setLocationString] = useState<string>("") // State for location string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false) // State for geocoding loading
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [geocodedLat, setGeocodedLat] = useState<number | undefined>(undefined)
  const [geocodedLon, setGeocodedLon] = useState<number | undefined>(undefined)
  const [reportDescriptionWithLocation, setReportDescriptionWithLocation] = useState<string | undefined>(undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo) {
      toast({
        title: "Error",
        description: "Please select a photo to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setAnalysisResult(null)
    setShowReportForm(false)
    setGeocodedLat(undefined)
    setGeocodedLon(undefined)
    setReportDescriptionWithLocation(undefined)

    let currentLat: number | undefined = undefined
    let currentLon: number | undefined = undefined
    let descriptionSuffix = ""

    if (locationString.trim()) {
      setIsGeocoding(true)
      const { data: geoData, error: geoError } = await geocoding.geocodeLocation(locationString.trim())
      setIsGeocoding(false)

      if (geoData) {
        currentLat = geoData.latitude
        currentLon = geoData.longitude
        setGeocodedLat(currentLat)
        setGeocodedLon(currentLon)
        descriptionSuffix = ` (Location: ${locationString.trim()})`
        toast({
          title: "Location Geocoded",
          description: `Found coordinates for "${locationString}".`,
        })
      } else {
        // Removed the toast for "Geocoding Failed" as per user request
        console.error("Geocoding failed:", geoError || "Unknown error")
        // Do not stop submission, just proceed without geocoded location
      }
    }

    const { data, error } = await damage.analyzeDamagePolling(photo)
    setIsSubmitting(false)

    if (data) {
      setAnalysisResult(data)
      const primaryDamage = data.ai_analysis?.analysis?.primary_damage ?? ""
      setReportDescriptionWithLocation(`${primaryDamage}${descriptionSuffix}`)
      toast({
        title: "Analysis Complete",
        description: `AI analysis for request ID ${data.request_id} is ready.`,
      })
      setPhoto(null)
      setLocationString("") // Clear location string after successful analysis
      const fileInput = document.getElementById("analysisPhoto") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } else {
      toast({
        title: "Analysis Failed",
        description: error || "An unknown error occurred while queuing analysis.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setPhoto(null)
    setLocationString("")
    setIsSubmitting(false)
    setIsGeocoding(false)
    setAnalysisResult(null)
    setShowReportForm(false)
    setGeocodedLat(undefined)
    setGeocodedLon(undefined)
    setReportDescriptionWithLocation(undefined)
    const fileInput = document.getElementById("analysisPhoto") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleReportFromAnalysis = () => {
    setShowReportForm(true)
  }

  const handleReportFormCancel = () => {
    setShowReportForm(false)
  }

  const handleReportCreatedAndReset = () => {
    onReportCreated()
    handleReset()
  }

  // Helper to parse cost estimate string to number
  const parseCostEstimate = (costString: string): number => {
    const numbers = costString.match(/\d[\d,]*/g)?.map((s) => Number.parseFloat(s.replace(/,/g, ""))) || []
    if (numbers.length === 1) {
      return numbers[0]
    } else if (numbers.length > 1) {
      return numbers[0] // Using the lower bound for simplicity
    }
    return 0
  }

  const analysisDetails: AIAnalysisDetails | undefined = analysisResult?.ai_analysis?.analysis

  if (showReportForm && analysisDetails) {
    return (
      <CreateDamageReportForm
        userId={userId}
        onReportCreated={handleReportCreatedAndReset}
        initialLatitude={geocodedLat} // Pass geocoded latitude
        initialLongitude={geocodedLon} // Pass geocoded longitude
        initialDamageScore={analysisDetails.damage_score}
        initialDescription={reportDescriptionWithLocation} // Pass the combined description
        initialCostEstimate={parseCostEstimate(analysisDetails.estimated_cost)}
        onCancel={handleReportFormCancel}
      />
    )
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Request AI Damage Analysis</CardTitle>
        <CardDescription>Upload a photo for AI to assess damage severity.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="analysisPhoto">Upload Photo</Label>
            <Input
              id="analysisPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              required
              disabled={isSubmitting || isGeocoding}
            />
          </div>
          <div>
            <Label htmlFor="locationString">Location (Optional, for better context)</Label>
            <Input
              id="locationString"
              type="text"
              placeholder="e.g., 123 Main St, Anytown, CA"
              value={locationString}
              onChange={(e) => setLocationString(e.target.value)}
              disabled={isSubmitting || isGeocoding}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || isGeocoding}>
              {isSubmitting || isGeocoding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isGeocoding ? "Geocoding..." : "Analyzing..."}
                </>
              ) : (
                "Submit for Analysis"
              )}
            </Button>
            {analysisResult || isSubmitting || isGeocoding ? (
              <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting || isGeocoding}>
                Reset
              </Button>
            ) : null}
          </div>
        </form>

        {analysisResult && (
          <div className="mt-6 p-4 border rounded-md bg-emerald-50 space-y-3">
            <h4 className="text-lg font-semibold flex items-center">
              {analysisResult.error || !analysisDetails ? (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
              )}
              Analysis Result (ID: {analysisResult.request_id})
            </h4>
            {analysisResult.error ? (
              <p className="text-red-700">Error: {analysisResult.error}</p>
            ) : !analysisDetails ? (
              <p className="text-gray-700">No detailed analysis results returned.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Damage Score:</strong> {analysisDetails.damage_score ?? "N/A"} (0-10)
                    </p>
                    <p>
                      <strong>Severity:</strong> {analysisDetails.severity ?? "N/A"}
                    </p>
                    <p>
                      <strong>Primary Damage:</strong> {analysisDetails.primary_damage ?? "N/A"}
                    </p>
                    {/* Removed Model Type display */}
                  </div>
                  <div>
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <strong>Estimated Cost:</strong> {analysisDetails.estimated_cost ?? "N/A"}
                    </p>
                    {geocodedLat !== undefined && geocodedLon !== undefined && (
                      <p className="flex items-center">
                        <strong>Geocoded Coordinates:</strong> Lat: {geocodedLat}, Lon: {geocodedLon}
                      </p>
                    )}
                  </div>
                </div>

                {analysisDetails.detected_issues && analysisDetails.detected_issues.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold">Detected Issues:</p>
                    <ul className="list-disc list-inside ml-4">
                      {analysisDetails.detected_issues.map((issue, index) => (
                        <li key={index}>
                          {issue.issue} (Confidence: {issue.confidence}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisDetails.recommendations && analysisDetails.recommendations.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1" /> Recommendations:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {analysisDetails.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button onClick={handleReportFromAnalysis} className="mt-4">
                  <FilePlus className="h-4 w-4 mr-2" /> Create Damage Report from Analysis
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
