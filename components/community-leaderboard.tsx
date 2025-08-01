"use client"

import { useState, useEffect } from "react"
import { community, type LeaderboardEntry, type LeaderboardResponse } from "@/lib/api" // Import LeaderboardResponse
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function CommunityLeaderboard() {
  const { toast } = useToast()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const fetchLeaderboard = async () => {
    const { data, error } = await community.getLeaderboard()
    if (data && typeof data === "object" && "leaderboard" in data && Array.isArray(data.leaderboard)) {
      // Access the leaderboard array from the response object
      const leaderboardData = (data as LeaderboardResponse).leaderboard
      // Sort by activity_score, then by rank (if activity_score is tied)
      const sortedData = leaderboardData.sort((a, b) => b.activity_score - a.activity_score || a.rank - b.rank)
      setLeaderboard(sortedData)
    } else {
      console.error("Failed to fetch leaderboard or data format is incorrect:", error || data)
      toast({
        title: "Error",
        description: error || "Failed to load community leaderboard or data format is incorrect.",
        variant: "destructive",
      })
      setLeaderboard([]) // Ensure leaderboard is an empty array on error/invalid data
    }
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  return (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Community Leaderboard</CardTitle>
        <CardDescription>Top contributors in the DamageSnap community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.length === 0 ? (
          <p className="text-gray-600">No leaderboard data available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posts
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Damage Reports
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteer Events
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recovery Locations
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donations
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map(
                  (
                    entry, // Removed index as rank is provided by API
                  ) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{entry.rank}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{entry.name || "N/A"}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{entry.posts_count}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {entry.damage_reports_count}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{entry.events_joined_count}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        {entry.recovery_locations_count}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                        ${entry.total_donated?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{entry.activity_score}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
