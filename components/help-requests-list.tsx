"use client"

import { useState, useEffect } from "react"
import { helpRequests } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface HelpRequest {
  id: number
  title: string
  location: string
  description: string
  fundingGoal: number
  category: string
  urgency: string
  currentFunding: number // Assuming your API returns this
  created_at: string
  // Add other properties as per your API response
}

export function HelpRequestsList() {
  const { toast } = useToast()
  const [requestsList, setRequestsList] = useState<HelpRequest[]>([])

  const fetchHelpRequests = async () => {
    const { data, error } = await helpRequests.getHelpRequests()
    if (data) {
      setRequestsList(data as HelpRequest[])
    } else {
      console.error("Failed to fetch help requests:", error)
      toast({
        title: "Error",
        description: error || "Failed to load help requests.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchHelpRequests()
  }, [])

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Active Help Requests</CardTitle>
        <CardDescription>Community members seeking assistance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {requestsList.length === 0 ? (
          <p className="text-gray-600">No help requests found.</p>
        ) : (
          requestsList.map((request) => (
            <div key={request.id} className="border p-4 rounded-md bg-gray-50">
              <p className="font-semibold">{request.title}</p>
              <p className="text-gray-700 mt-1">Location: {request.location}</p>
              <p className="text-gray-700">Description: {request.description}</p>
              <p className="text-gray-700">Category: {request.category}</p>
              <p className="text-gray-700">Urgency: {request.urgency}</p>
              <p className="text-gray-700">
                Funding Goal: ${request.fundingGoal?.toFixed(2)} (Current: ${request.currentFunding?.toFixed(2) || 0})
              </p>
              <p className="text-sm text-gray-500 mt-2">Posted on: {new Date(request.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
