"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, isAuthenticated } from "@/lib/auth-client"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import styles from './page.module.css'
import DashboardLayout from "../components/DashboardLayout"
import NavBar from "../components/NavBar"
import DashboardContent from "../components/DashboardContent"

interface UserData {
  userId: string
  email: string
  name: string
  role: string
}

export default function AdminDashboard() {
  const router = useRouter()
  useAuthHeader()

  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null)
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<string | null>(null)
  const [displayUX, setDisplayUX] = useState('');

  const updateUX = (value: string,  id?: string | null) => {
    setDisplayUX(value);

    // Handle artist ID
    if (value === 'Artist Profile' || value === 'Update Artist Profile') {
      setSelectedArtistId(id || null)
    }
    // Handle venue ID
    if (value === 'Venue Profile Edit') {
      setSelectedVenueId(id || null)
    }
    // Handle event ID
    if (value === 'Event Edit') {
      setSelectedEventId(id || null)
    }
    // Handle performance ID
    if (value === 'Artist Event Link Edit' || 'Performance Detail') {
      setSelectedPerformanceId(id || null)
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const token = getToken()
    if (token) {
      try {
        const parts = token.split(".")
        if (parts.length === 3) {
          const decoded = JSON.parse(
            Buffer.from(parts[1], "base64").toString("utf-8")
          )

          // Check if user has admin role
          if (decoded.role !== "super_admin") {
            router.replace(`/dashboard/${decoded.role}`)
            return
          }

          setUserData({
            userId: decoded.userId || "",
            email: decoded.email || "User",
            name: decoded.name || "User",
            role: decoded.role || "customer"
          })
        }
      } catch (err) {
        console.error("Failed to decode token:", err)
        router.push("/login")
        return
      }
    }

    setLoading(false)
  }, [router])

  if (loading || !userData) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  const navItems = [
    { label: 'System Settings' },
    {
      label: 'User Managment',
      children: [
        { label: 'Browse Users' },
        { label: 'Browse Artists' },
        { label: 'Mailing List' }
      ]
    },
    {
      label: 'Cluster Managment',
      children: [
        { label: 'Venues' },
        { label: 'Event List' },
        { label: 'Artist > Event Link' }
      ]
    },
    { label: 'Financial Control' },
    { label: 'Analitics' },
    { label: 'Security Logs' },
    { label: 'Profile' },
    { label: 'Email'}
  ]

  return (

    <div style={{ height: 'auto' }}>
      <DashboardLayout
        userName={userData.name}
        userEmail={userData.email}
        userRole="super_admin"
      >
        <div className={styles.innerDashboardContainer}>
          <NavBar items={navItems} onUpdate={updateUX} />
          <DashboardContent
            activeView={displayUX}
            userId={userData.userId}
            artistId={selectedArtistId}
            venueId={selectedVenueId}
            eventId={selectedEventId}
            performanceId={selectedPerformanceId}
            onNavigate={updateUX}
          />
        </div>
      </DashboardLayout>
    </div>

  )
}