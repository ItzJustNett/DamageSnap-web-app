"use client"
import { useState, useEffect } from "react"
import { posts, type CommentCreate } from "@/lib/api" // Import CommentCreate type
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, ThumbsUp } from "lucide-react" // Import icons

interface Post {
  id: number
  content: string
  author_id: string
  author_name: string
  created_at: string
  likes_count: number
  // Add other post properties as per your API response
}

interface Comment {
  id: number
  content: string
  author_id: string
  author_name: string
  created_at: string
  // Add other comment properties as per your API response
}

export function PostsList() {
  const { toast } = useToast()
  const [postsList, setPostsList] = useState<Post[]>([])
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null)
  const [newCommentContent, setNewCommentContent] = useState("")
  const [commentsForPost, setCommentsForPost] = useState<Comment[]>([])

  const fetchPosts = async () => {
    const { data, error } = await posts.getPosts()
    if (data) {
      setPostsList(data as Post[])
    } else {
      console.error("Failed to fetch posts:", error)
      toast({
        title: "Error",
        description: error || "Failed to load posts.",
        variant: "destructive",
      })
    }
  }

  const handleLikePost = async (postId: number) => {
    const { data, error } = await posts.likePost(postId)
    if (data) {
      toast({
        title: "Post Liked!",
        description: "You've liked this post.",
      })
      fetchPosts() // Refresh posts to update like count
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
      setCommentsForPost(data as Comment[])
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
    fetchPosts()
  }, [])

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Community Posts</CardTitle>
        <CardDescription>Recent activity from other users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {postsList.length === 0 ? (
          <p className="text-gray-600">No posts yet. Be the first to share!</p>
        ) : (
          postsList.map((post) => (
            <div key={post.id} className="border p-4 rounded-md bg-gray-50">
              <p className="font-semibold">{post.author_name || "Anonymous"}</p>
              <p className="text-gray-700 mt-1">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(post.created_at).toLocaleString()} &bull; {post.likes_count} Likes
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Button variant="ghost" size="sm" onClick={() => handleLikePost(post.id)}>
                  <ThumbsUp className="h-4 w-4 mr-1" /> Likes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)}>
                  <MessageCircle className="h-4 w-4 mr-1" /> Comments
                </Button>
              </div>

              {activeCommentPostId === post.id && (
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
                    <Button onClick={() => handleAddComment(post.id)}>Add Comment</Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
