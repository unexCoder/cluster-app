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

export default function StaffDashboard() {
  const router = useRouter()
  useAuthHeader()
  
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)

  const [displayUX, setDisplayUX] = useState('');
  const updateUX = (value: string) => {
    setDisplayUX(value);
    console.log(value)
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
          
          // Check if user has manager role
          if (decoded.role !== "staff") {
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
    { label: 'Managment' },
    { label: 'Task Control' },
    { label: 'Profile' }
  ];

  return (
    <DashboardLayout
      userName={userData.name}
      userEmail={userData.email}
      userRole="staff"
    >
      <div className={styles.innerDashboardContainer}>
          <NavBar items={navItems} onUpdate={updateUX} />
          <DashboardContent
            activeView={displayUX}
            userId={userData.userId}
            onNavigate={updateUX}
          />
        </div>
    </DashboardLayout>
  )
}