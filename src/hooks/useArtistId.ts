// hooks/useArtistId.ts
import { useState, useEffect } from "react"
import { getToken } from "@/lib/auth-client"

export function useArtistId(userId: string | null) {
  const [artistId, setArtistId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchArtistId = async () => {
      const token = getToken()
      const res = await fetch(`/api/artists/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setArtistId(data.artistId)
    }

    fetchArtistId()
  }, [userId])

  return artistId
}