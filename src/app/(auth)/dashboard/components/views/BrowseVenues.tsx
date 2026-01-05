'use client'

import React, { useEffect, useState } from 'react'
import { fetchVenuesAction } from '@/app/actions/venues'
import styles from './dashboardViews.module.css'

interface Venue {
  id: string
  user_id: string
  name: string
  slug: string
  description: string
  capacity: number
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  contact_info: string
  venue_info: string
  image_urls: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export default function BrowseArtists() {
  const [venues, setVenues] = useState<Venue[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchVenuesAction()

      if (result.success) {
        setVenues(result.venues)
      } else {
        throw new Error(result.error || 'Failed to fetch venues')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading venues...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchVenues} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Venues</h2>
        <button onClick={fetchVenues} className={styles.refreshButton}> {/* ✓ Corregido: era "fetchUsers" */}
          Refresh
        </button>
      </div>

      {venues.length === 0 ? (
        <div className={styles.empty}>No venues found</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => ( // ✓ Corregido: era "user"
                <tr key={venue.id}>
                  <td>{venue.name}</td>
                  <td>{venue.slug}</td>
                  <td>
                    {venue.created_at
                      ? new Date(venue.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Edit venue:', venue.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Delete venue:', venue.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}