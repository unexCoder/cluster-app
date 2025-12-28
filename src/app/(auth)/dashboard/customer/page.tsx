"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, isAuthenticated } from "@/lib/auth-client"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import DashboardLayout, { cardStyle } from "../components/DashboardLayout"

interface UserData {
  userId: string
  email: string
  name: string
  role: string
}

export default function CustomerDashboard() {
  const router = useRouter()
  useAuthHeader()
  
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

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
          
          // Check if user has customer role
          if (decoded.role !== "customer") {
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

  return (
    <DashboardLayout
      userName={userData.name}
      userEmail={userData.email}
      userRole="customer"
    >
      <>customer layout</>
      {/* <div>
        <h2>🎫 Customer Dashboard</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Welcome to Festival Cluster!
        </p>
        <div style={{ display: "grid", gap: "15px" }}>
          <div style={cardStyle}>
            <h3>🎪 My Events</h3>
            <p>View and manage your festival registrations</p>
          </div>
          <div style={cardStyle}>
            <h3>🎟️ My Tickets</h3>
            <p>Access your purchased tickets and QR codes</p>
          </div>
          <div style={cardStyle}>
            <h3>👤 Profile Settings</h3>
            <p>Update your personal information</p>
          </div>
          <div style={cardStyle}>
            <h3>💳 Payment History</h3>
            <p>View your transaction history</p>
          </div>
        </div>
      </div> */}
    </DashboardLayout>
  )
}