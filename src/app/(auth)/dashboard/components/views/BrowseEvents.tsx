'use client'

import React, { useEffect, useState } from 'react'
import { deleteEventAction, fetchEventsAction } from '@/app/actions/events'
import styles from './dashboardViews.module.css'
import { X } from 'lucide-react'
import { fetchVenuesAction } from '@/app/actions/venues'

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
  onNavigate: (view: string, id?: string | null) => void
}

interface VenueOption {
  id: string
  name: string
  city: string
  capacity: number
}

export default function BrowseEvents({ onNavigate }: BrowseEventProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [venues, setVenues] = useState<VenueOption[]>([])
  const [loadingVenues, setLoadingVenues] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const result = await fetchVenuesAction()
        if (result.success) {
          setVenues(result.venues.map((v: any) => ({
            id: v.id,
            name: v.name,
            city: v.city,
            capacity: v.capacity
          })))
        }
      } catch (err) {
        console.error('Failed to load venues:', err)
      } finally {
        setLoadingVenues(false)
      }
    }
    loadVenues()
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

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event)
    setShowDeleteModal(true)
    console.log(event.id)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setEventToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return

    try {
      setDeleting(true)
      const result = await deleteEventAction(eventToDelete.id)

      if (result.success) {
        // Remove the deleted venue from the list
        setEvents(events.filter(v => v.id !== eventToDelete.id))
        setShowDeleteModal(false)
        setEventToDelete(null)
      } else {
        throw new Error(result.error || 'Failed to delete venue')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred while deleting')
    } finally {
      setDeleting(false)
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
          onClick={() => onNavigate('Event Create')}
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
                <th>Venue</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Date</th>
                <th>End</th>
                <th>Doors</th>
                <th>Status</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => ( // ✓ Corregido: era "user"
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.slug}</td>
                  <td>{venues.find(v => v.id === event.venue_id)?.name ?? '—'}
                  </td>
                  <td>{venues.find(v => v.id === event.venue_id)?.city ?? '—'}
                  </td>
                  <td>{venues.find(v => v.id === event.venue_id)?.capacity ?? '—'} / { event.remaining_capacity}
                  </td>

                  <td>{  new Date(event.start_date_time).toLocaleString()}</td>
                  <td>{  new Date(event.end_date_time).toLocaleTimeString()}</td>
                  <td>{  new Date(event.doors_open_time).toLocaleTimeString()}</td>

                  <td>{ event.status }</td>
                  <td>{ event.event_type }</td>


                  {/* <td>
                    {event.created_at
                      ? new Date(event.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td> */}
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => onNavigate('Event Edit', event.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleDeleteClick(event)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Confirm Deletion</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete the event:</p>
              <p style={{ fontWeight: 'bold', margin: '10px 0' }}>
                {eventToDelete?.name}
              </p>
              <p style={{ color: '#ef4444', fontSize: '14px' }}>
                This action cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={styles.deleteButton}
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}