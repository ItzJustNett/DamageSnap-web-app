"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { posts, damage, helpRequests, volunteerEvents } from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Flame, HeartHandshake, CalendarCheck, Newspaper } from "lucide-react"

interface ActivityItem {
  type: string
  title: string
  date: string
  location?: string
  icon: React.ElementType
}

export function RecentActivityTable() {
  const { toast } = useToast()
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])
  const MAX_ITEMS = 5 // Limit to show only the 5 most recent items

  const fetchRecentActivities = async () => {
    const [postsRes, damageRes, helpRes, volunteerRes] = await Promise.all([
      posts.getPosts(MAX_ITEMS),
      damage.getDamageReports(0, 0, 20000), // Fetch wide range, then limit
      helpRequests.getHelpRequests(),
      volunteerEvents.getEvents(),
    ])

    const activities: ActivityItem[] = []

    if (postsRes.data) {
      postsRes.data.slice(0, MAX_ITEMS).forEach((item: any) =>
        activities.push({
          type: "Post",
          title: item.content.substring(0, 50) + (item.content.length > 50 ? "..." : ""),
          date: new Date(item.created_at).toLocaleDateString(),
          icon: Newspaper,
        }),
      )
    }
    if (damageRes.data) {
      damageRes.data.slice(0, MAX_ITEMS).forEach((item: any) =>
        activities.push({
          type: "Damage Report",
          title: item.description || `Damage at ${item.latitude}, ${item.longitude}`,
          date: new Date(item.created_at).toLocaleDateString(),
          location: `${item.latitude}, ${item.longitude}`,
          icon: Flame,
        }),
      )
    }
    if (helpRes.data) {
      helpRes.data.slice(0, MAX_ITEMS).forEach((item: any) =>
        activities.push({
          type: "Help Request",
          title: item.title,
          date: new Date(item.created_at).toLocaleDateString(),
          location: item.location,
          icon: HeartHandshake,
        }),
      )
    }
    if (volunteerRes.data) {
      volunteerRes.data.slice(0, MAX_ITEMS).forEach((item: any) =>
        activities.push({
          type: "Volunteer Event",
          title: item.title,
          date: new Date(item.created_at).toLocaleDateString(),
          location: item.location,
          icon: CalendarCheck,
        }),
      )
    }

    // Sort all activities by date, newest first, and then take the top MAX_ITEMS
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setRecentActivities(activities.slice(0, MAX_ITEMS))

    if (!postsRes.data && !damageRes.data && !helpRes.data && !volunteerRes.data) {
      toast({
        title: "Error",
        description: "Failed to load recent activities.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchRecentActivities()
  }, [])

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>What You Might Have Missed</CardTitle>
        <CardDescription>Recent activities from the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-gray-600">No recent activities to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivities.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      <activity.icon className="h-4 w-4 mr-2" />
                      {activity.type}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{activity.title}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{activity.location || "N/A"}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{activity.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
