'use client'

import React, { useEffect, useState } from 'react'
import { fetchEventsAction } from '@/app/actions/events'
import styles from './dashboardViews.module.css'

interface Event {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  venue_id: string
  start_date_time: Date
  end_date_time: Date
  doors_open_time: Date
  timezone: string 
  status: string
  is_featured: number  
  age_restriction: string
  event_type: string
  categories: string
  tags: string
  media_urls: string
  event_polices: string
  remaining_capacity: string
  created_by: string
  created_at: Date
  updated_at: Date
  deleted_at: Date  
}

interface BrowseEventProps {
  onNavigate: (view: string,id?:string | null) => void
}

export default function BrowseEvents( {onNavigate}: BrowseEventProps ) {
  const [events, setEvents] = useState<Event[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchEventsAction()

      if (result.success) {
        setEvents(result.events)
      } else {
        throw new Error(result.error || 'Failed to fetch events')
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
        <div className={styles.loading}>Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchEvents} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Events List</h2>
        <button 
          className={styles.refreshButton}
          onClick={() => onNavigate('Create Event Profile')}
        >
          Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className={styles.empty}>No events found</div>
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
              {events.map((event) => ( // ✓ Corregido: era "user"
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.slug}</td>

                  <td>
                    {event.created_at
                      ? new Date(event.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Edit event:', event.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Delete evet:', event.id)}
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