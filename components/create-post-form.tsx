"use client"

import type React from "react"
import { useState } from "react"
import { posts } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CreatePostFormProps {
  onPostCreated: () => void
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const { toast } = useToast()
  const [newPostContent, setNewPostContent] = useState("")

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty.",
        variant: "destructive",
      })
      return
    }
    const { data, error } = await posts.createPost({ content: newPostContent })
    if (data) {
      toast({
        title: "Post Created",
        description: "Your post has been published.",
      })
      setNewPostContent("")
      onPostCreated() // Trigger refresh in parent
    } else {
      toast({
        title: "Post Creation Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>Share an update with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <Label htmlFor="postContent">Post Content</Label>
            <Textarea
              id="postContent"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Publish Post</Button>
        </form>
      </CardContent>
    </Card>
  )
}
