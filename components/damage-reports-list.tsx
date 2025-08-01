"use client"

import { useState, useEffect } from "react"
import { damage } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
// Removed Input, Label, Button imports as they are no longer needed for search

interface DamageReport {
  id: number
  user_id: string
  latitude: number
  longitude: number
  damage_score: number
  description: string
  cost_estimate: number
  photo_url?: string
  created_at: string
  // Add other properties as per your API response
}

export function DamageReportsList() {
  const { toast } = useToast()
  const [reportsList, setReportsList] = useState<DamageReport[]>([])

  const fetchDamageReports = async () => {
    // Fetch reports for a very wide area by default
    // Assuming (0,0) latitude/longitude and a large radius covers most relevant reports
    const defaultLat = 0
    const defaultLon = 0
    const defaultRadius = 20000 // A very large radius in km to cover a significant portion of the globe

    const { data, error } = await damage.getDamageReports(defaultLat, defaultLon, defaultRadius)
    if (data) {
      setReportsList(data as DamageReport[])
    } else {
      console.error("Failed to fetch damage reports:", error)
      toast({
        title: "Error",
        description: error || "Failed to load damage reports.",
        variant: "destructive",
      })
    }
  }

  // Fetch reports on component mount
  useEffect(() => {
    fetchDamageReports()
  }, []) // Empty dependency array means it runs once on mount

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Damage Reports</CardTitle>
        <CardDescription>Reports of wildfire damage in specified areas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reportsList.length === 0 ? (
          <p className="text-gray-600">No damage reports found.</p>
        ) : (
          reportsList.map((report) => (
            <div key={report.id} className="border p-4 rounded-md bg-gray-50">
              <p className="font-semibold">Report ID: {report.id}</p>
              {/* Removed the line displaying latitude and longitude */}
              <p className="text-gray-700">Damage Score: {report.damage_score}</p>
              <p className="text-gray-700">Description: {report.description || "N/A"}</p>
              <p className="text-gray-700">Cost Estimate: ${report.cost_estimate?.toFixed(2) || "N/A"}</p>
              {report.photo_url && (
                <img
                  src={report.photo_url || "/placeholder.svg"}
                  alt={`Damage Report ${report.id}`}
                  className="mt-2 max-w-full h-auto rounded-md"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">Reported on: {new Date(report.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
