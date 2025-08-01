"use client"

import type React from "react"
import { useState } from "react"
import { helpRequests, type HelpRequestCreate } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CreateHelpRequestFormProps {
  onHelpRequestCreated: () => void
}

export function CreateHelpRequestForm({ onHelpRequestCreated }: CreateHelpRequestFormProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [fundingGoal, setFundingGoal] = useState<number | string>("")
  const [category, setCategory] = useState("")
  const [urgency, setUrgency] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !location || !description || !fundingGoal || !category || !urgency) {
      toast({
        title: "Input Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const requestData: HelpRequestCreate = {
      title,
      location,
      description,
      fundingGoal: typeof fundingGoal === "number" ? fundingGoal : Number.parseInt(fundingGoal as string),
      category,
      urgency,
    }

    const { data, error } = await helpRequests.createHelpRequest(requestData)

    if (data) {
      toast({
        title: "Help Request Created",
        description: "Your help request has been submitted.",
      })
      setTitle("")
      setLocation("")
      setDescription("")
      setFundingGoal("")
      setCategory("")
      setUrgency("")
      onHelpRequestCreated()
    } else {
      toast({
        title: "Help Request Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Create Help Request</CardTitle>
        <CardDescription>Request assistance for recovery efforts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Roof Repair Needed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., 123 Main St, Anytown"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the help needed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
            <Input
              id="fundingGoal"
              type="number"
              step="1"
              placeholder="e.g., 5000"
              value={fundingGoal}
              onChange={(e) => setFundingGoal(Number.parseInt(e.target.value) || e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              placeholder="e.g., Housing, Medical, Food"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Input
              id="urgency"
              type="text"
              placeholder="e.g., High, Medium, Low"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Submit Help Request</Button>
        </form>
      </CardContent>
    </Card>
  )
}
