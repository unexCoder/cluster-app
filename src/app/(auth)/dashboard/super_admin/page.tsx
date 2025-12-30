"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, isAuthenticated } from "@/lib/auth-client"
import { useAuthHeader } from "@/hooks/useAuthHeader"
import DashboardLayout from "../components/DashboardLayout"
import NavBar from "../components/NavBar"

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
    { label: 'System Settings', href: '/user-managment' },
    { label: 'User Managment', href: '/user-managment' },
    { label: 'Cluster Managment', href: '/cluster-managment' },
    { label: 'Financial Control', href: '/financial-control' },
    { label: 'Analitics', href: '/analitics' },
    { label: 'Security Logs', href: '/security-logs' },
    { label: 'Profile', href: '/profile' }
  ]

  return (
    <DashboardLayout
      userName={userData.name}
      userEmail={userData.email}
      userRole="super_admin"
    >
      <NavBar items={navItems}/>
    </DashboardLayout>
  )
}