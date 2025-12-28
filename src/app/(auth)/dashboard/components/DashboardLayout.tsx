"use client"

import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-client"

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
        return "#2563eb"
      case "customer":
      default:
        return "#059669"
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <h1 style={{ margin: "0 0 10px 0" }}>Dashboard</h1>
          <p style={{ margin: "5px 0", fontSize: "16px" }}>
            Welcome back, <strong>{userName}</strong>!
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
            {userEmail}
          </p>
          <span style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "4px 12px",
            backgroundColor: getRoleBadgeColor(),
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase"
          }}>
            {userRole}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 24px",
            backgroundColor: "#c30f45",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s"
          }}
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

export const cardStyle: React.CSSProperties = {
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#fff",
  cursor: "pointer",
  transition: "all 0.2s",
}