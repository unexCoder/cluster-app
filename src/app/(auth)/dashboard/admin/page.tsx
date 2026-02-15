"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getToken, isAuthenticated } from "@/lib/auth-client"
import styles from './page.module.css'
import { useAuthHeader } from "@/hooks/useAuthHeader"
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

  const navItems = [
  { label: 'Managment', href: '/managment' },
  { label: 'Profile', href: '/profile' }
];
  return (
    <div>
      <DashboardLayout
        userName={userData.name}
        userEmail={userData.email}
        userRole="admin"
      >
        <div className={styles.innerDashboardContainer}>
          <NavBar items={navItems} onUpdate={updateUX} />
          <DashboardContent activeView={displayUX} onNavigate={updateUX} userId={userData.userId}/>
        </div>
      </DashboardLayout>
    </div>
  )
}