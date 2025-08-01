"use client"

import { useState, useEffect } from "react"
import { recovery } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
// Removed Input, Label imports as they are no longer needed for search

interface RecoveryLocation {
  id: number
  user_id: string
  latitude: number
  longitude: number
  title: string
  description: string
  volunteers_needed: number
  current_volunteers: number // Assuming your API returns this
  photo_url?: string
  created_at: string
  // Add other properties as per your API response
}

interface RecoveryLocationsListProps {
  userId: string | undefined
}

export function RecoveryLocationsList({ userId }: RecoveryLocationsListProps) {
  const { toast } = useToast()
  const [locationsList, setLocationsList] = useState<RecoveryLocation[]>([])

  const fetchRecoveryLocations = async () => {
    // Fetch locations for a very wide area by default
    // Assuming (0,0) latitude/longitude and a large radius covers most relevant locations
    const defaultLat = 0
    const defaultLon = 0
    const defaultRadius = 20000 // A very large radius in km to cover a significant portion of the globe

    const { data, error } = await recovery.getRecoveryLocations(defaultLat, defaultLon, defaultRadius)
    if (data) {
      setLocationsList(data as RecoveryLocation[])
    } else {
      console.error("Failed to fetch recovery locations:", error)
      toast({
        title: "Error",
        description: error || "Failed to load recovery locations.",
        variant: "destructive",
      })
    }
  }

  const handleRegisterVolunteer = async (locationId: number) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to register as a volunteer.",
        variant: "destructive",
      })
      return
    }
    const { data, error } = await recovery.registerVolunteer({ location_id: locationId, user_id: userId })
    if (data) {
      toast({
        title: "Volunteer Registered",
        description: "You have successfully registered for this location!",
      })
      fetchRecoveryLocations() // Refresh list to show updated volunteer count
    } else {
      toast({
        title: "Registration Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  // Fetch locations on component mount
  useEffect(() => {
    fetchRecoveryLocations()
  }, []) // Empty dependency array means it runs once on mount

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Recovery Locations</CardTitle>
        <CardDescription>Areas needing volunteers for restoration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Removed search input fields and button */}

        {locationsList.length === 0 ? (
          <p className="text-gray-600">No recovery locations found.</p>
        ) : (
          locationsList.map((location) => (
            <div key={location.id} className="border p-4 rounded-md bg-gray-50">
              <p className="font-semibold">{location.title}</p>
              {/* Removed the line displaying latitude and longitude */}
              <p className="text-gray-700">Description: {location.description || "N/A"}</p>
              <p className="text-gray-700">
                Volunteers Needed: {location.volunteers_needed} (Current: {location.current_volunteers || 0})
              </p>
              {location.photo_url && (
                <img
                  src={location.photo_url || "/placeholder.svg"}
                  alt={`Recovery Location ${location.id}`}
                  className="mt-2 max-w-full h-auto rounded-md"
                />
              )}
              <p className="text-sm text-gray-500 mt-2">Posted on: {new Date(location.created_at).toLocaleString()}</p>
              <Button onClick={() => handleRegisterVolunteer(location.id)} className="mt-2">
                Volunteer for this Location
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
