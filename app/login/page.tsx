"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/api"
import { clearToken, getToken } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FilePlus, List, Brain, Loader2, Menu } from "lucide-react" // Added Menu icon
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // Import Sheet components

// Import components
import { LoginForm } from "@/components/login-form"
import { CreatePostForm } from "@/components/create-post-form"
import { CreateDamageReportForm } from "@/components/create-damage-report-form"
import { DamageReportsList } from "@/components/damage-reports-list"
import { CreateHelpRequestForm } from "@/components/create-help-request-form"
import { HelpRequestsList } from "@/components/help-requests-list"
import { CreateVolunteerEventForm } from "@/components/create-volunteer-event-form"
import { VolunteerEventsList } from "@/components/volunteer-events-list"
import { CreateRecoveryLocationForm } from "@/components/create-recovery-location-form"
import { RecoveryLocationsList } from "@/components/recovery-locations-list"
import { RequestDamageAnalysisForm } from "@/components/request-damage-analysis-form"
import { CommunityLeaderboard } from "@/components/community-leaderboard"
import { SidebarNav } from "@/components/sidebar-nav"
import { BackgroundImage } from "@/components/background-image"
import { CommunityFeed } from "@/components/community-feed"
import { RecentActivityTable } from "@/components/recent-activity-table"
import { AppFooter } from "@/components/app-footer"

interface User {
  id: string
  name: string
  email: string
  // Add other user properties as per your API response
}

export default function LoginPage() {
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true) // New loading state for auth
  const [activeSection, setActiveSection] = useState("dashboard") // Default active section
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State for mobile sidebar

  // States for toggling creation forms
  const [showCreateDamageForm, setShowCreateDamageForm] = useState(false)
  const [showCreateHelpRequestForm, setShowCreateHelpRequestForm] = useState(false)
  const [showCreateVolunteerEventForm, setShowCreateVolunteerEventForm] = useState(false)
  const [showCreateRecoveryLocationForm, setShowCreateRecoveryLocationForm] = useState(false)

  // States for refreshing lists
  const [refreshPosts, setRefreshPosts] = useState(0)
  const [refreshDamageReports, setRefreshDamageReports] = useState(0)
  const [refreshHelpRequests, setRefreshHelpRequests] = useState(0)
  const [refreshVolunteerEvents, setRefreshVolunteerEvents] = useState(0)
  const [refreshRecoveryLocations, setRefreshRecoveryLocations] = useState(0)

  const checkAuthStatus = async () => {
    setLoadingAuth(true) // Set loading true when checking auth
    const token = getToken()
    if (token) {
      const { data, error } = await auth.getCurrentUser()
      if (data) {
        setCurrentUser(data as User)
        setIsLoggedIn(true)
      } else {
        console.error("Failed to fetch current user:", error)
        clearToken()
        setIsLoggedIn(false)
        setCurrentUser(null)
        toast({
          title: "Authentication Error",
          description: error || "Session expired or invalid token.",
          variant: "destructive",
        })
      }
    } else {
      setIsLoggedIn(false)
      setCurrentUser(null)
    }
    setLoadingAuth(false) // Set loading false after check
  }

  const handleLoginSuccess = () => {
    checkAuthStatus()
  }

  const handleLogout = () => {
    clearToken()
    setIsLoggedIn(false)
    setCurrentUser(null)
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    })
    setActiveSection("dashboard") // Reset to dashboard on logout
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            {" "}
            {/* Added padding to the grid container */}
            {/* Left Half: What You Might Have Missed */}
            <div className="flex flex-col space-y-6">
              {" "}
              {/* Increased space-y */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {" "}
                  {/* Adjusted font size and margin */}
                  Your AI-powered wildfire recovery tool
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {" "}
                  {/* Adjusted font size and line height */}
                  DamageSnap analyzes photos and videos to detect damage, suggest repairs, estimate costs, and connect
                  communities to restore and rebuild together.
                </p>
              </div>
              <RecentActivityTable />
            </div>
            {/* Right Half: AI Analysis Button */}
            <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-emerald-50/50 rounded-lg shadow-inner border border-emerald-100 text-center">
              {" "}
              {/* Increased padding, added text-center */}
              <Brain className="h-16 w-16 text-emerald-600 mb-6" /> {/* Added icon, increased size and margin */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {" "}
                {/* Adjusted font size and margin */}
                Ready for AI Analysis?
              </h3>
              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                {" "}
                {/* Adjusted font size and line height */}
                Upload a photo and let our AI assess the damage severity.
              </p>
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6"
                onClick={() => setActiveSection("ai-analysis")}
              >
                Go to AI Analysis
              </Button>
            </div>
          </div>
        )
      case "posts":
        return (
          <>
            <CreatePostForm onPostCreated={() => setRefreshPosts((prev) => prev + 1)} />
            <CommunityFeed />
          </>
        )
      case "damage-reports":
        return (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowCreateDamageForm(!showCreateDamageForm)} variant="outline">
                {showCreateDamageForm ? (
                  <>
                    <List className="h-4 w-4 mr-2" /> View Reports
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4 mr-2" /> Create Report
                  </>
                )}
              </Button>
            </div>
            {showCreateDamageForm ? (
              <CreateDamageReportForm
                userId={currentUser?.id}
                onReportCreated={() => {
                  setRefreshDamageReports((prev) => prev + 1)
                  setShowCreateDamageForm(false) // Hide form after creation
                }}
              />
            ) : (
              <DamageReportsList />
            )}
          </>
        )
      case "help-requests":
        return (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowCreateHelpRequestForm(!showCreateHelpRequestForm)} variant="outline">
                {showCreateHelpRequestForm ? (
                  <>
                    <List className="h-4 w-4 mr-2" /> View Requests
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4 mr-2" /> Create Request
                  </>
                )}
              </Button>
            </div>
            {showCreateHelpRequestForm ? (
              <CreateHelpRequestForm
                onHelpRequestCreated={() => {
                  setRefreshHelpRequests((prev) => prev + 1)
                  setShowCreateHelpRequestForm(false)
                }}
              />
            ) : (
              <HelpRequestsList />
            )}
          </>
        )
      case "volunteer-events":
        return (
          <>
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowCreateVolunteerEventForm(!showCreateVolunteerEventForm)} variant="outline">
                {showCreateVolunteerEventForm ? (
                  <>
                    <List className="h-4 w-4 mr-2" /> View Events
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4 mr-2" /> Create Event
                  </>
                )}
              </Button>
            </div>
            {showCreateVolunteerEventForm ? (
              <CreateVolunteerEventForm
                onEventCreated={() => {
                  setRefreshVolunteerEvents((prev) => prev + 1)
                  setShowCreateVolunteerEventForm(false)
                }}
              />
            ) : (
              <VolunteerEventsList />
            )}
          </>
        )
      case "recovery-locations":
        return (
          <>
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setShowCreateRecoveryLocationForm(!showCreateRecoveryLocationForm)}
                variant="outline"
              >
                {showCreateRecoveryLocationForm ? (
                  <>
                    <List className="h-4 w-4 mr-2" /> View Locations
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4 mr-2" /> Create Location
                  </>
                )}
              </Button>
            </div>
            {showCreateRecoveryLocationForm ? (
              <CreateRecoveryLocationForm
                userId={currentUser?.id}
                onLocationCreated={() => {
                  setRefreshRecoveryLocations((prev) => prev + 1)
                  setShowCreateRecoveryLocationForm(false)
                }}
              />
            ) : (
              <RecoveryLocationsList userId={currentUser?.id} />
            )}
          </>
        )
      case "ai-analysis":
        return (
          <RequestDamageAnalysisForm
            userId={currentUser?.id}
            onReportCreated={() => setRefreshDamageReports((prev) => prev + 1)}
          />
        )
      case "leaderboard":
        return <CommunityLeaderboard />
      default:
        return <p>Select a section from the navigation.</p>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {loadingAuth ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="ml-2 text-gray-700">Loading user session...</p>
        </div>
      ) : !isLoggedIn ? (
        <BackgroundImage>
          <header className="flex items-center justify-center h-16 px-8 bg-white/10 border-b border-white/20 shadow-sm z-20">
            <div className="flex items-center">
              <Image src="/favicon.png" alt="DamageSnap Icon" width={32} height={32} className="mr-3" />
              <h1 className="text-2xl font-bold text-white">DamageSnap</h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 pt-0 flex items-center justify-center">
            <div className="flex justify-center">
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
          </main>
          <AppFooter />
        </BackgroundImage>
      ) : (
        <BackgroundImage>
          {/* Top Navigation Bar for Logged-in State (visible on mobile) */}
          <header className="flex md:hidden items-center h-16 px-4 bg-white/10 border-b border-white/20 shadow-sm z-30">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white/10 border-r border-white/20">
                <SidebarNav
                  activeSection={activeSection}
                  onSectionChange={(section) => {
                    setActiveSection(section)
                    setIsSidebarOpen(false) // Close sidebar on item click
                  }}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              </SheetContent>
            </Sheet>
            <div className="flex items-center justify-center flex-1">
              <Image src="/favicon.png" alt="DamageSnap Icon" width={32} height={32} className="mr-3" />
              <h1 className="text-2xl font-bold text-white">DamageSnap</h1>
            </div>
          </header>

          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <SidebarNav
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              currentUser={currentUser}
              onLogout={handleLogout}
              className="fixed inset-y-0 left-0 w-64 bg-white/10 border-r border-white/20 shadow-lg z-20 flex flex-col" // Re-apply fixed styles for desktop
            />
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 md:ml-64">
            <div className="w-full max-w-4xl mx-auto space-y-8 bg-white/80 p-4 sm:p-6 rounded-lg shadow-lg">
              {renderContent()}
            </div>
          </main>
        </BackgroundImage>
      )}
    </div>
  )
}
