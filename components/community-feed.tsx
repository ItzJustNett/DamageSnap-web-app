"use client"

import { useState, useEffect } from "react"
import { posts, damage, helpRequests, volunteerEvents, type CommentCreate } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, ThumbsUp, Flame, HeartHandshake, CalendarCheck, Newspaper } from "lucide-react"

// Define interfaces for combined feed items
interface PostItem {
  type: "post"
  id: number
  content: string
  author_id: string
  author_name: string
  created_at: string
  likes_count: number
}

interface DamageReportItem {
  type: "damage-report"
  id: number
  latitude: number
  longitude: number
  damage_score: number
  description: string
  cost_estimate: number
  photo_url?: string
  created_at: string
}

interface HelpRequestItem {
  type: "help-request"
  id: number
  title: string
  location: string
  description: string
  fundingGoal: number
  category: string
  urgency: string
  currentFunding: number
  created_at: string
}

interface VolunteerEventItem {
  type: "volunteer-event"
  id: number
  title: string
  location: string
  description: string
  date: string
  startTime: string
  endTime: string
  maxVolunteers: number
  currentVolunteers: number
  category: string
  difficulty: string
  created_at: string
}

type FeedItem = PostItem | DamageReportItem | HelpRequestItem | VolunteerEventItem

export function CommunityFeed() {
  const { toast } = useToast()
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [newCommentContent, setNewCommentContent] = useState("")
  const [commentsForPost, setCommentsForPost] = useState<any[]>([]) // Use 'any' for comments for now

  const fetchFeed = async () => {
    const [postsRes, damageRes, helpRes, volunteerRes] = await Promise.all([
      posts.getPosts(),
      damage.getDamageReports(0, 0, 20000), // Fetch wide range of damage reports
      helpRequests.getHelpRequests(),
      volunteerEvents.getEvents(),
    ])

    const allItems: FeedItem[] = []

    if (postsRes.data) {
      postsRes.data.forEach((item: any) => allItems.push({ ...item, type: "post" }))
    }
    if (damageRes.data) {
      damageRes.data.forEach((item: any) => allItems.push({ ...item, type: "damage-report" }))
    }
    if (helpRes.data) {
      helpRes.data.forEach((item: any) => allItems.push({ ...item, type: "help-request" }))
    }
    if (volunteerRes.data) {
      volunteerRes.data.forEach((item: any) => allItems.push({ ...item, type: "volunteer-event" }))
    }

    // Sort all items by creation date, newest first
    allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFeedItems(allItems)
  }

  const handleLikePost = async (postId: number) => {
    const { data, error } = await posts.likePost(postId)
    if (data) {
      toast({
        title: "Post Liked!",
        description: "You've liked this post.",
      })
      fetchFeed() // Refresh feed to update like count
    } else {
      toast({
        title: "Failed to Like Post",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  const fetchComments = async (postId: number) => {
    const { data, error } = await posts.getComments(postId)
    if (data) {
      setCommentsForPost(data as any[])
    } else {
      console.error("Failed to fetch comments:", error)
      toast({
        title: "Error",
        description: error || "Failed to load comments.",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async (postId: number) => {
    if (!newCommentContent.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty.",
        variant: "destructive",
      })
      return
    }
    const commentData: CommentCreate = { content: newCommentContent }
    const { data, error } = await posts.addComment(postId, commentData)
    if (data) {
      toast({
        title: "Comment Added",
        description: "Your comment has been added.",
      })
      setNewCommentContent("")
      fetchComments(postId) // Refresh comments for the active post
    } else {
      toast({
        title: "Comment Failed",
        description: error || "An unknown error occurred.",
        variant: "destructive",
      })
    }
  }

  const toggleComments = (postId: number) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null)
      setCommentsForPost([])
    } else {
      setActiveCommentPostId(postId)
      fetchComments(postId)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  const renderFeedItem = (item: FeedItem) => {
    const commonClasses = "border p-4 rounded-md bg-gray-50"
    const timestamp = new Date(item.created_at).toLocaleString()

    switch (item.type) {
      case "post":
        return (
          <div key={item.id} className={commonClasses}>
            <div className="flex items-center mb-2">
              <Newspaper className="h-5 w-5 mr-2 text-blue-600" />
              <p className="font-semibold">{item.author_name || "Anonymous"}</p>
            </div>
            <p className="text-gray-700 mt-1">{item.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {timestamp} &bull; {item.likes_count} Likes
            </p>
            <div className="flex items-center gap-4 mt-3">
              <Button variant="ghost" size="sm" onClick={() => handleLikePost(item.id)}>
                <ThumbsUp className="h-4 w-4 mr-1" /> Likes
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleComments(item.id)}>
                <MessageCircle className="h-4 w-4 mr-1" /> Comments
              </Button>
            </div>

            {activeCommentPostId === item.id && (
              <div className="mt-4 border-t pt-4 space-y-3">
                <h4 className="font-semibold text-md">Comments:</h4>
                {commentsForPost.length === 0 ? (
                  <p className="text-gray-600 text-sm">No comments yet. Be the first!</p>
                ) : (
                  commentsForPost.map((comment) => (
                    <div key={comment.id} className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-sm font-medium">{comment.author_name || "Anonymous"}</p>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(comment.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
                <div className="flex gap-2 mt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button onClick={() => handleAddComment(item.id)}>Add Comment</Button>
                </div>
              </div>
            )}
          </div>
        )
      case "damage-report":
        return (
          <div key={item.id} className={commonClasses}>
            <div className="flex items-center mb-2">
              <Flame className="h-5 w-5 mr-2 text-red-600" />
              <p className="font-semibold">New Damage Report</p>
            </div>
            <p className="text-gray-700 mt-1">Description: {item.description || "N/A"}</p>
            <p className="text-gray-700">
              Location: {item.latitude}, {item.longitude}
            </p>
            <p className="text-gray-700">Damage Score: {item.damage_score}</p>
            <p className="text-gray-700">Cost Estimate: ${item.cost_estimate?.toFixed(2) || "N/A"}</p>
            {item.photo_url && (
              <img
                src={item.photo_url || "/placeholder.svg"}
                alt={`Damage Report ${item.id}`}
                className="mt-2 max-w-full h-auto rounded-md"
              />
            )}
            <p className="text-sm text-gray-500 mt-2">Reported on: {timestamp}</p>
          </div>
        )
      case "help-request":
        return (
          <div key={item.id} className={commonClasses}>
            <div className="flex items-center mb-2">
              <HeartHandshake className="h-5 w-5 mr-2 text-purple-600" />
              <p className="font-semibold">Help Request: {item.title}</p>
            </div>
            <p className="text-gray-700 mt-1">Location: {item.location}</p>
            <p className="text-gray-700">Description: {item.description}</p>
            <p className="text-gray-700">Category: {item.category}</p>
            <p className="text-gray-700">Urgency: {item.urgency}</p>
            <p className="text-gray-700">
              Funding Goal: ${item.fundingGoal?.toFixed(2)} (Current: ${item.currentFunding?.toFixed(2) || 0})
            </p>
            <p className="text-sm text-gray-500 mt-2">Posted on: {timestamp}</p>
          </div>
        )
      case "volunteer-event":
        return (
          <div key={item.id} className={commonClasses}>
            <div className="flex items-center mb-2">
              <CalendarCheck className="h-5 w-5 mr-2 text-green-600" />
              <p className="font-semibold">Volunteer Event: {item.title}</p>
            </div>
            <p className="text-gray-700 mt-1">Location: {item.location}</p>
            <p className="text-gray-700">Description: {item.description}</p>
            <p className="text-gray-700">
              Date: {item.date} from {item.startTime} to {item.endTime}
            </p>
            <p className="text-gray-700">Category: {item.category}</p>
            <p className="text-gray-700">Difficulty: {item.difficulty}</p>
            <p className="text-gray-700">
              Volunteers: {item.currentVolunteers || 0} / {item.maxVolunteers}
            </p>
            <p className="text-sm text-gray-500 mt-2">Created on: {timestamp}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Community Feed</CardTitle>
        <CardDescription>Recent activity from across the DamageSnap community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedItems.length === 0 ? (
          <p className="text-gray-600">No recent activity found. Be the first to contribute!</p>
        ) : (
          feedItems.map(renderFeedItem)
        )}
      </CardContent>
    </Card>
  )
}
