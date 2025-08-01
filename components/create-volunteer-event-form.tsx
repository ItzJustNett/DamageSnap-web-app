"use client"

import type React from "react"
import { useState } from "react"
import { volunteerEvents, type VolunteerEventCreate } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CreateVolunteerEventFormProps {
  onEventCreated: () => void
}

export function CreateVolunteerEventForm({ onEventCreated }: CreateVolunteerEventFormProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [maxVolunteers, setMaxVolunteers] = useState<number | string>("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !title ||
      !location ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !maxVolunteers ||
      !category ||
      !difficulty
    ) {
      toast({
        title: "Input Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const eventData: VolunteerEventCreate = {
      title,
      location,
      description,
      date,
      startTime,
      endTime,
      maxVolunteers: typeof maxVolunteers === "number" ? maxVolunteers : Number.parseInt(maxVolunteers as string),
      category,
      difficulty,
    }

    const { data, error } = await volunteerEvents.createEvent(eventData)

    if (data) {
      toast({
        title: "Volunteer Event Created",
        description: "Your event has been scheduled.",
      })
      setTitle("")
      setLocation("")
      setDescription("")
      setDate("")
      setStartTime("")
      setEndTime("")
      setMaxVolunteers("")
      setCategory("")
      setDifficulty("")
      onEventCreated()
    } else {
      toast({
        title: "Event Creation Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Create Volunteer Event</CardTitle>
        <CardDescription>Organize a new community volunteer activity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="eventTitle">Title</Label>
            <Input
              id="eventTitle"
              type="text"
              placeholder="e.g., Park Cleanup Day"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventLocation">Location</Label>
            <Input
              id="eventLocation"
              type="text"
              placeholder="e.g., Central Park"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDescription">Description</Label>
            <Textarea
              id="eventDescription"
              placeholder="Details about the event and tasks"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDate">Date</Label>
            <Input id="eventDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label htmlFor="maxVolunteers">Max Volunteers</Label>
            <Input
              id="maxVolunteers"
              type="number"
              min="1"
              placeholder="e.g., 20"
              value={maxVolunteers}
              onChange={(e) => setMaxVolunteers(Number.parseInt(e.target.value) || e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventCategory">Category</Label>
            <Input
              id="eventCategory"
              type="text"
              placeholder="e.g., Reforestation, Cleanup, Support"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="eventDifficulty">Difficulty</Label>
            <Input
              id="eventDifficulty"
              type="text"
              placeholder="e.g., Easy, Medium, Hard"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Create Event</Button>
        </form>
      </CardContent>
    </Card>
  )
}
