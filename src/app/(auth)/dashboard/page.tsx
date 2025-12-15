"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") return <p>Loading...</p>

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.email}!</p>
      
      <button
        onClick={() => signOut({ redirect: true, redirectTo: "/login" })}
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