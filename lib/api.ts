"use client"

import { getToken } from "./auth"

const BASE_URL = "https://db.xoperr.dev"

// Set this to false to use your real API responses
const MOCK_API_RESPONSES = false // This is now false to load real data

interface APIResponse<T> {
  data: T | null
  error: string | null
  statusCode: number
}

async function request<T>(
  endpoint: string,
  method: string,
  body?: Record<string, any> | FormData,
  requiresAuth = false,
  isFormData = false,
): Promise<APIResponse<T>> {
  // --- MOCK API RESPONSE LOGIC ---
  if (MOCK_API_RESPONSES) {
    if (endpoint.includes("/api/posts") && method === "GET") {
      console.log("MOCKING: Returning mock posts data.")
      return {
        data: [
          {
            id: 1,
            content: "First mock post about community recovery efforts!",
            author_id: "mock-user-1",
            author_name: "Community Helper",
            created_at: new Date().toISOString(),
            likes_count: 5,
          },
          {
            id: 2,
            content: "Another mock post: Volunteers needed for debris cleanup next Saturday.",
            author_id: "mock-user-2",
            author_name: "Volunteer Coordinator",
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            likes_count: 12,
          },
          {
            id: 3,
            content: "Just submitted a damage report for my neighborhood. Stay safe everyone!",
            author_id: "mock-user-3",
            author_name: "Concerned Citizen",
            created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            likes_count: 8,
          },
        ] as T,
        error: null,
        statusCode: 200,
      }
    }
    // You can add more mock responses here for other endpoints if needed
  }
  // --- END MOCK API RESPONSE LOGIC ---

  const url = `${BASE_URL}${endpoint}`

  const headers: HeadersInit = {}

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  if (requiresAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    } else {
      return {
        data: null,
        error: "Authentication token not found.",
        statusCode: 401,
      }
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    })

    const responseData = await response.json().catch(() => ({})) // Handle empty responses

    if (!response.ok) {
      let errorMessage = "An unknown error occurred."

      // Check if responseData.detail is an array of ValidationError
      if (
        Array.isArray(responseData.detail) &&
        responseData.detail.length > 0 &&
        typeof responseData.detail[0] === "object" &&
        "msg" in responseData.detail[0]
      ) {
        errorMessage = responseData.detail.map((err: ValidationError) => err.msg).join("; ")
      } else if (responseData.detail) {
        errorMessage = responseData.detail
      } else if (responseData.message) {
        errorMessage = responseData.message
      }

      return {
        data: null,
        error: errorMessage,
        statusCode: response.status,
      }
    }

    return { data: responseData as T, error: null, statusCode: response.status }
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "Network error or unexpected issue",
      statusCode: 500,
    }
  }
}

// --- Type Definitions from OpenAPI Schema ---

// New interfaces for AI analysis details
export interface DetectedIssue {
  issue: string
  confidence: number
}

export interface AIAnalysisDetails {
  damage_score: number
  severity: string
  primary_damage: string
  confidence: number
  estimated_cost: string
  recommendations: string[]
  model_type: string
}

export interface AIAnalysisResponse {
  analysis: AIAnalysisDetails
}

export interface AnalysisResult {
  success: boolean
  ai_analysis?: AIAnalysisResponse // Changed to optional as it might be missing on error
  request_id: string
  processing_time: number
  error?: string | null // Added error field for direct error messages
}

export interface ChatMessage {
  content: string
}

export interface CommentCreate {
  content: string
}

export interface DonationCreate {
  amount: number
  donorName: string
  email: string
}

export interface HTTPValidationError {
  detail?: ValidationError[]
}

export interface HelpRequestCreate {
  title: string
  location: string
  description: string
  fundingGoal: number
  category: string
  urgency: string
}

export interface PostCreate {
  content: string
  location?: string | null
  tags?: string[] | null
}

export interface ServerURL {
  server_url: string
}

export interface UserCreate {
  name: string
  email: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface VolunteerEventCreate {
  title: string
  location: string
  description: string
  date: string
  startTime: string
  endTime: string
  maxVolunteers: number
  category: string
  difficulty: string
}

export interface VolunteerRequest {
  location_id: number
  user_id: string
  message?: string
}

// Updated interface for Leaderboard Entry based on actual API response
export interface LeaderboardEntry {
  id: number // Changed from user_id: string
  name: string // Changed from user_name: string
  avatar_url: string | null
  join_date: string
  posts_count: number
  damage_reports_count: number
  events_joined_count: number // Changed from volunteer_events_joined_count
  recovery_locations_count: number // Changed from recovery_locations_created_count
  total_donated: number // Changed from donations_total_amount
  donations_count: number
  activity_score: number
  rank: number
  join_date_formatted: string
}

// New interface for the full Leaderboard API response
export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[]
  total_users: number
  scoring_system: {
    posts: number
    damage_reports: number
    events_joined: number
    recovery_locations: number
    donations: number
  }
}

// --- API Client Functions ---

// Auth Endpoints
export const auth = {
  register: (data: UserCreate) => request<any>("/api/auth/register", "POST", data),
  login: (data: UserLogin) => request<any>("/api/auth/login", "POST", data),
  getCurrentUser: () => request<any>("/api/auth/me", "GET", undefined, true),
}

// Posts Endpoints
export const posts = {
  createPost: (data: PostCreate) => request<any>("/api/posts", "POST", data, true),
  getPosts: (limit = 20, offset = 0) => request<any>(`/api/posts?limit=${limit}&offset=${offset}`, "GET"),
  likePost: (postId: number) => request<any>(`/api/posts/${postId}/like`, "POST", undefined, true),
  addComment: (postId: number, data: CommentCreate) =>
    request<any>(`/api/posts/${postId}/comments`, "POST", data, true),
  getComments: (postId: number) => request<any>(`/api/posts/${postId}/comments`, "GET"),
}

// Help Requests Endpoints
export const helpRequests = {
  getHelpRequests: () => request<any>("/api/help-requests", "GET"),
  createHelpRequest: (data: HelpRequestCreate) => request<any>("/api/help-requests", "POST", data, true),
}

// Donations Endpoints
export const donations = {
  makeDonation: (helpRequestId: number, data: DonationCreate) =>
    request<any>(`/api/donations/${helpRequestId}`, "POST", data),
}

// Chat Endpoints
export const chat = {
  sendMessage: (data: ChatMessage) => request<any>("/api/chat", "POST", data, true),
  getMessages: (limit = 50) => request<any>(`/api/chat?limit=${limit}`, "GET", undefined, true),
}

// Volunteer Events Endpoints
export const volunteerEvents = {
  getEvents: () => request<any>("/api/volunteer-events", "GET"),
  createEvent: (data: VolunteerEventCreate) => request<any>("/api/volunteer-events", "POST", data, true),
  joinEvent: (eventId: number) => request<any>(`/api/volunteer-events/${eventId}/join`, "POST", undefined, true),
}

// Damage Analysis & Reports Endpoints
export const damage = {
  analyzeDamagePolling: (photo: File) => {
    const formData = new FormData()
    formData.append("photo", photo)
    return request<AnalysisResult>("/api/analyze-damage", "POST", formData, false, true) // Use AnalysisResult type
  },
  createDamageReport: (data: {
    user_id: string
    latitude: number
    longitude: number
    damage_score?: number
    description?: string
    cost_estimate?: number
    photo?: File | null
  }) => {
    const formData = new FormData()
    formData.append("user_id", data.user_id)
    formData.append("latitude", data.latitude.toString())
    formData.append("longitude", data.longitude.toString())
    if (data.damage_score !== undefined) formData.append("damage_score", data.damage_score.toString())
    if (data.description) formData.append("description", data.description)
    if (data.cost_estimate !== undefined) formData.append("cost_estimate", data.cost_estimate.toString())
    if (data.photo) formData.append("photo", data.photo)
    return request<any>("/api/damage-report", "POST", formData, false, true)
  },
  getDamageReports: (lat: number, lon: number, radius = 10) =>
    request<any>(`/api/damage-reports?lat=${lat}&lon=${lon}&radius=${radius}`, "GET"),
}

// Recovery Locations & Volunteers Endpoints
export const recovery = {
  createRecoveryLocation: (data: {
    user_id: string
    latitude: number
    longitude: number
    title: string
    description?: string
    volunteers_needed?: number
    photo?: File | null
  }) => {
    const formData = new FormData()
    formData.append("user_id", data.user_id)
    formData.append("latitude", data.latitude.toString())
    formData.append("longitude", data.longitude.toString())
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    if (data.volunteers_needed !== undefined) formData.append("volunteers_needed", data.volunteers_needed.toString())
    if (data.photo) formData.append("photo", data.photo)
    return request<any>("/api/recovery-location", "POST", formData, false, true)
  },
  getRecoveryLocations: (lat: number, lon: number, radius = 50) =>
    request<any>(`/api/recovery-locations?lat=${lat}&lon=${lon}&radius=${radius}`, "GET"),
  registerVolunteer: (data: VolunteerRequest) => request<any>("/api/volunteer", "POST", data),
  getVolunteers: (locationId: number) => request<any>(`/api/volunteers/${locationId}`, "GET"),
}

// AI Server Endpoints
export const aiServer = {
  setAiServer: (data: ServerURL) => request<any>("/api/set-ai-server", "POST", data),
  checkAiServerStatus: () => request<any>("/api/ai-server-status", "GET"),
}

// Queue Endpoints
export const queue = {
  getPendingAnalysis: () => request<any>("/api/queue/pending", "GET"),
  completeAnalysis: (data: AnalysisResult) => request<any>("/api/queue/complete", "POST", data),
  getQueueStatus: () => request<any>("/api/queue/status", "GET"),
}

// Debug Endpoints
export const debug = {
  listEndpoints: () => request<any>("/api/endpoints", "GET"),
  getDebugInfo: () => request<any>("/api/debug", "GET"),
}

// New Community Endpoints
export const community = {
  getLeaderboard: () => request<LeaderboardResponse>("/api/community/leaderboard", "GET"),
}

// Geocoding Endpoints (Reverse Geocoding removed)
export const geocoding = {
  geocodeLocation: (locationString: string) =>
    request<{ latitude: number; longitude: number }>("/api/geocode", "POST", { locationString }),
}
