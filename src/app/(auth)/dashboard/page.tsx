"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { logout, getToken, isAuthenticated } from "@/lib/auth-client"
import { useAuthHeader } from "@/hooks/useAuthHeader"

export default function DashboardPage() {
  const router = useRouter()
  // Send Authorization header to middleware
  useAuthHeader()
  
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Check if authenticated
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    // Get user info from token (basic client-side decode)
    const token = getToken()
    if (token) {
      try {
        const parts = token.split(".")
        if (parts.length === 3) {
          const decoded = JSON.parse(
            Buffer.from(parts[1], "base64").toString("utf-8")
          )
          setUserEmail(decoded.name || "User")
        }
      } catch (err) {
        console.error("Failed to decode token:", err)
      }
    }

    setIsAuth(true)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (loading) return <p>Loading...</p>

  if (!isAuth) {
    return <p>Redirecting...</p>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {userEmail}!</p>
      
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#c30f45",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Sign Out
      </button>
    </div>
  )
}