"use client"

import { useState, useEffect } from "react"
import { volunteerEvents } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface VolunteerEvent {
  id: number
  title: string
  location: string
  description: string
  date: string
  startTime: string
  endTime: string
  maxVolunteers: number
  currentVolunteers: number // Assuming your API returns this
  category: string
  difficulty: string
  created_at: string
  // Add other properties as per your API response
}

export function VolunteerEventsList() {
  const { toast } = useToast()
  const [eventsList, setEventsList] = useState<VolunteerEvent[]>([])

  const fetchVolunteerEvents = async () => {
    const { data, error } = await volunteerEvents.getEvents()
    if (data) {
      setEventsList(data as VolunteerEvent[])
    } else {
      console.error("Failed to fetch volunteer events:", error)
      toast({
        title: "Error",
        description: error || "Failed to load volunteer events.",
        variant: "destructive",
      })
    }
  }

  const handleJoinEvent = async (eventId: number) => {
    // Note: The API spec for join_volunteer_event_api_volunteer_events__event_id__join_post
    // does not specify a request body, but it requires authentication.
    // If your backend expects a user_id in the body, you'll need to adjust this.
    const { data, error } = await volunteerEvents.joinEvent(eventId)
    if (data) {
      toast({
        title: "Joined Event",
        description: "You have successfully joined the volunteer event!",
      })
      fetchVolunteerEvents() // Refresh list to show updated volunteer count
    } else {
      toast({
        title: "Failed to Join Event",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchVolunteerEvents()
  }, [])

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Upcoming Volunteer Events</CardTitle>
        <CardDescription>Opportunities to help your community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {eventsList.length === 0 ? (
          <p className="text-gray-600">No upcoming volunteer events found.</p>
        ) : (
          eventsList.map((event) => (
            <div key={event.id} className="border p-4 rounded-md bg-gray-50">
              <p className="font-semibold">{event.title}</p>
              <p className="text-gray-700 mt-1">Location: {event.location}</p>
              <p className="text-gray-700">Description: {event.description}</p>
              <p className="text-gray-700">Date: {event.date}</p>
              <p className="text-gray-700">
                Time: {event.startTime} - {event.endTime}
              </p>
              <p className="text-gray-700">Category: {event.category}</p>
              <p className="text-gray-700">Difficulty: {event.difficulty}</p>
              <p className="text-gray-700">
                Volunteers: {event.currentVolunteers || 0} / {event.maxVolunteers}
              </p>
              <p className="text-sm text-gray-500 mt-2">Created on: {new Date(event.created_at).toLocaleString()}</p>
              <Button onClick={() => handleJoinEvent(event.id)} className="mt-2">
                Join Event
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
