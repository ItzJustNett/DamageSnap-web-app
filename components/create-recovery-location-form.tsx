"use client"

import type React from "react"
import { useState } from "react"
import { recovery } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CreateRecoveryLocationFormProps {
  userId: string | undefined
  onLocationCreated: () => void
}

export function CreateRecoveryLocationForm({ userId, onLocationCreated }: CreateRecoveryLocationFormProps) {
  const { toast } = useToast()
  const [latitude, setLatitude] = useState<number | string>("")
  const [longitude, setLongitude] = useState<number | string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [volunteersNeeded, setVolunteersNeeded] = useState<number | string>(1)
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a recovery location.",
        variant: "destructive",
      })
      return
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      toast({
        title: "Input Error",
        description: "Latitude and Longitude must be valid numbers.",
        variant: "destructive",
      })
      return
    }

    if (!title) {
      toast({
        title: "Input Error",
        description: "Title is required.",
        variant: "destructive",
      })
      return
    }

    const locationData = {
      user_id: userId,
      latitude,
      longitude,
      title,
      description,
      volunteers_needed:
        typeof volunteersNeeded === "number" ? volunteersNeeded : Number.parseInt(volunteersNeeded as string),
      photo,
    }

    const { data, error } = await recovery.createRecoveryLocation(locationData)

    if (data) {
      toast({
        title: "Recovery Location Created",
        description: "The recovery location has been added.",
      })
      setLatitude("")
      setLongitude("")
      setTitle("")
      setDescription("")
      setVolunteersNeeded(1)
      setPhoto(null)
      onLocationCreated()
    } else {
      toast({
        title: "Creation Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Create Recovery Location</CardTitle>
        <CardDescription>Post a location needing community restoration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="locLatitude">Latitude</Label>
            <Input
              id="locLatitude"
              type="number"
              step="any"
              placeholder="e.g., 34.0522"
              value={latitude}
              onChange={(e) => setLatitude(Number.parseFloat(e.target.value) || e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="locLongitude">Longitude</Label>
            <Input
              id="locLongitude"
              type="number"
              step="any"
              placeholder="e.g., -118.2437"
              value={longitude}
              onChange={(e) => setLongitude(Number.parseFloat(e.target.value) || e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="locTitle">Title</Label>
            <Input
              id="locTitle"
              type="text"
              placeholder="e.g., Oak Grove Park Reforestation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="locDescription">Description</Label>
            <Textarea
              id="locDescription"
              placeholder="Details about the restoration needed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
            <Input
              id="volunteersNeeded"
              type="number"
              min="1"
              placeholder="e.g., 10"
              value={volunteersNeeded}
              onChange={(e) => setVolunteersNeeded(Number.parseInt(e.target.value) || e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="locPhoto">Photo (Optional)</Label>
            <Input
              id="locPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            />
          </div>
          <Button type="submit">Create Recovery Location</Button>
        </form>
      </CardContent>
    </Card>
  )
}
