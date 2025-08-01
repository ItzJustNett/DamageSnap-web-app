"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { aiServer, type ServerURL } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function AiServerSettings() {
  const { toast } = useToast()
  const [serverUrl, setServerUrl] = useState("")
  const [serverStatus, setServerStatus] = useState("Checking...")

  const checkStatus = async () => {
    const { data, error } = await aiServer.checkAiServerStatus()
    if (data && data.status === "ok") {
      setServerStatus("Online")
    } else {
      setServerStatus(`Offline: ${error || "Unknown error"}`)
    }
  }

  const handleSetServerUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serverUrl.trim()) {
      toast({
        title: "Input Error",
        description: "Server URL cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const data: ServerURL = { server_url: serverUrl }
    const { data: responseData, error } = await aiServer.setAiServer(data)

    if (responseData) {
      toast({
        title: "AI Server URL Updated",
        description: "The AI server URL has been set.",
      })
      checkStatus() // Re-check status after setting
    } else {
      toast({
        title: "Update Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 10000) // Check status every 10 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>AI Server Settings</CardTitle>
        <CardDescription>Configure and check the AI analysis server</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="aiServerUrl">AI Server URL</Label>
          <Input
            id="aiServerUrl"
            type="url"
            placeholder="e.g., http://your-colab-server.ngrok.io"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
          />
        </div>
        <Button onClick={handleSetServerUrl}>Set Server URL</Button>
        <div className="mt-4">
          <p className="font-semibold">AI Server Status:</p>
          <p className={`text-lg ${serverStatus === "Online" ? "text-green-600" : "text-red-600"}`}>{serverStatus}</p>
        </div>
      </CardContent>
    </Card>
  )
}
