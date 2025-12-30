"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, isAuthenticated } from "@/lib/auth-client"
import { useAuthHeader } from "@/hooks/useAuthHeader"

export default function DashboardRedirect() {
  const router = useRouter()
  useAuthHeader()
  const [loading, setLoading] = useState(true)

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
          const role = decoded.role || "customer"
          
          // Redirect to role-specific dashboard
          router.replace(`/dashboard/${role}`)
        }
      } catch (err) {
        console.error("Failed to decode token:", err)
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
    }}>
      <p>Loading dashboard...</p>
    </div>
  )
}