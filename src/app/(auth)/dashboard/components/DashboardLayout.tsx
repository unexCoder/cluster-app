"use client"

import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-client"
import styles from './dashboard.module.css'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userEmail: string
  userRole: "super_admin" | "admin" | "staff" | "customer" | "artist"
}

export default function DashboardLayout({ 
  children, 
  userName, 
  userEmail, 
  userRole 
}: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "super_admin":
        return "#c30f45"
      case "admin":
        return "#c30f45"
      case "staff":
        return "#2563eb"
      case "artist":
        return "#2EC4B6"
      case "customer":
      default:
        return "#059669"
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.header}>
          <h1>Cluster <span style={{fontSize:'14px'}}>Dashboard</span></h1>
          <p>
            Bienvenido, <strong>{userName}</strong>!
          </p>
          <p className={styles.userEmail}>
            {userEmail}
          </p>
          <span 
            style={{ backgroundColor: getRoleBadgeColor()}}
            className={styles.roleDisplay}
            >
            {userRole}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className={styles.signOutBtn}
        >
          Sign Out
        </button>
      </div>

      <hr style={{ margin: "30px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />

      {/* Content */}
      {children}
    </div>
  )
}
