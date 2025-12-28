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

export default function AdminDashboard() {
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
          
          // Check if user has admin role
          if (decoded.role !== "admin") {
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
      userRole="admin"
    >
      <>admin layout</>
      {/* <div>
        <h2>🔧 Admin Dashboard</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Full system access and management capabilities
        </p>
        <div style={{ display: "grid", gap: "15px" }}>
          <div style={cardStyle}>
            <h3>👥 User Management</h3>
            <p>Manage all users, roles, and permissions</p>
          </div>
          <div style={cardStyle}>
            <h3>⚙️ System Settings</h3>
            <p>Configure application settings and preferences</p>
          </div>
          <div style={cardStyle}>
            <h3>📊 Analytics & Reports</h3>
            <p>View comprehensive system analytics</p>
          </div>
          <div style={cardStyle}>
            <h3>🔐 Security Logs</h3>
            <p>Monitor system security and audit logs</p>
          </div>
        </div>
      </div> */}
    </DashboardLayout>
  )
}