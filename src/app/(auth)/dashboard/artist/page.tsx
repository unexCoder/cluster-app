"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, isAuthenticated } from "@/lib/auth-client"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import styles from './page.module.css'
import DashboardLayout from "../components/DashboardLayout"
import NavBar from "../components/NavBar"
import DashboardContent from "../components/DashboardContent"
import { fetchArtistByUserIdAction } from "@/app/actions/artists"

interface UserData {
  userId: string
  email: string
  name: string
  role: string
}

export default function ArtistDashboard() {
  const router = useRouter()
  useAuthHeader()

  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [artistId, setArtistId] = useState<string | undefined>(undefined)
  const [displayUX, setDisplayUX] = useState('Artist Profile');
  
  const [performanceId, setPerformanceId] = useState<string | undefined>(undefined)
  // const updateUX = (value: string) => {
  //   setDisplayUX(value);
  // };

  const updateUX = (value: string, id?: string | null) => {
    setDisplayUX(value)
    if (value === 'Performance Detail') {
      setPerformanceId(id ?? undefined)
    }
  }

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
          if (decoded.role !== "artist") {
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

  // Step 2 — once userId is known, fetch artistId from DB
  useEffect(() => {
    if (!userData?.userId) return

    fetchArtistByUserIdAction(userData.userId)
      .then(result => {
        if (result.success && result.profile?.[0]?.id) {
          setArtistId(result.profile[0].id)
        }
      })
      .catch(err => console.error("Failed to fetch artist profile:", err))
      .finally(() => setLoading(false))   // ← loading ends here, not before
  }, [userData?.userId])

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
    { label: 'Artist Profile' },
    {
      label: 'Gig Managment',
      children: [
        { label: 'Gigs List' }
      ]
    },
    { label: 'Fee Control' },
    { label: 'Profile' }
  ]

  console.log('user id: ', userData.userId)
  console.log('artist id: ', artistId)
  return (
    <div style={{ height: '100%' }}>
      <DashboardLayout
        userName={userData.name}
        userEmail={userData.email}
        userRole="artist"
      >
        <div className={styles.innerDashboardContainer}>
          <NavBar items={navItems} onUpdate={updateUX} />
          <DashboardContent
            activeView={displayUX}
            userId={userData.userId}
            onNavigate={updateUX}
            artistId={artistId}
            performanceId={performanceId}   // ← was missing
          />
        </div>
      </DashboardLayout>
    </div>
  )
}