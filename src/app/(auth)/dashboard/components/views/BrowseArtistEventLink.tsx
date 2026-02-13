'use client'

import React, { useEffect, useState } from 'react'
import { fetchEventArtistPerformancesAction, deleteEventArtistPerformanceAction, type EventArtistPerformanceRow, fetchPerformancesByArtistIdAction } from '@/app/actions/artist-event-link'
import styles from './dashboardViews.module.css'
import DeleteModal from '../components/DeleteModal'
import { fetchEventsAction } from '@/app/actions/events'
import { fetchArtistsAction } from '@/app/actions/artists'

interface BrowseEventArtistPerformancesProps {
  onNavigate: (view: string, id?: string | null) => void
  artistId?: string
}

const BILLING_LABELS: Record<string, string> = {
  headliner: 'Headliner',
  co_headliner: 'Co-Headliner',
  support: 'Support',
  opener: 'Opener',
}

const BILLING_COLORS: Record<string, string> = {
  headliner: '#f59e0b',
  co_headliner: '#a78bfa',
  support: '#60a5fa',
  opener: '#6ee7b7',
}

const BACKSTAGE_COLORS: Record<string, string> = {
  full: '#22c55e',
  limited: '#f59e0b',
  none: '#ef4444',
}

interface EventOption {
  id: string
  name: string
}

interface ArtistOption {
  id: string
  name: string
}

export default function BrowseEventArtistPerformances({ onNavigate, artistId }: BrowseEventArtistPerformancesProps) {
  const [performances, setPerformances] = useState<EventArtistPerformanceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedPerformanceId, setSelectedPerformanceId] = useState<string | null>(null)

  useEffect(() => {
    fetchPerformances()
  }, [])

  const fetchPerformances = async () => {
    try {
      setLoading(true)
      setError(null)

      // const result = await fetchEventArtistPerformancesAction()
      const result =
        artistId
          ? await fetchPerformancesByArtistIdAction(artistId)
          : await fetchEventArtistPerformancesAction()

      if (result.success) {
        setPerformances(result.performances)
      } else {
        throw new Error(result.error || 'Failed to fetch performances')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const [events, setEvents] = useState<EventOption[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await fetchEventsAction()
        if (result.success) {
          setEvents(result.events.map((e: any) => ({
            id: e.id,
            name: e.name
          })))
        }
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        setLoadingEvents(false)
      }
    }
    loadEvents()
  }, [])

  const [artists, setArtists] = useState<ArtistOption[]>([])
  const [loadingArtists, setLoadingArtists] = useState(true)

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const result = await fetchArtistsAction()
        if (result.success) {
          setArtists(result.artists.map((a: any) => ({
            id: a.id,
            name: a.name
          })))
        }
      } catch (err) {
        console.error('Failed to load artists:', err)
      } finally {
        setLoadingArtists(false)
      }
    }
    loadArtists()
  }, [])

  const handleDeletePerformance = async () => {
    if (!selectedPerformanceId) return

    try {
      setDeleting(true)
      const result = await deleteEventArtistPerformanceAction(selectedPerformanceId)

      if (result.success) {
        setShowDeleteModal(false)
        setSelectedPerformanceId(null)
        fetchPerformances()
      } else {
        alert(result.error || 'Failed to delete performance')
      }
    } catch (err) {
      alert('Error deleting performance')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const formatTimestamp = (ts: Date | null) => {
    if (!ts) return 'N/A'
    return new Date(ts).toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (ts: Date | null) => {
    if (!ts) return 'N/A'
    return new Date(ts).toLocaleDateString()
  }

  const formatTime = (ts: Date | null) => {
    if (!ts) return 'N/A'
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading performances...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchPerformances} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  console.log(performances)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Performances</h2>
        <button
          className={styles.refreshButton}
          onClick={() => onNavigate('Artist Event Link Create')}
        >
          Create
        </button>
      </div>

      {performances.length === 0 ? (
        <div className={styles.empty}>No performances found</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/* <th>#</th> */}
                <th>Event</th>
                <th>Artist</th>
                <th>Type</th>
                <th>Stage</th>
                <th>Billing</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Soundcheck</th>
                <th>Backstage</th>
                <th>Rider</th>
                {/* <th>Created At</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {performances.map((performance) => (
                <tr key={performance.id}>
                  <td>{events.find(e => e.id === performance.event_id)?.name ?? '—'}
                  </td>
                  <td>{artists.find(a => a.id === performance.artist_id)?.name ?? '—'}
                  </td>

                  <td title={performance.performance_type}>
                    {performance.performance_type}
                  </td>
                  <td>{performance.stage || 'N/A'}</td>
                  <td>
                    {performance.billing_position ? (
                      <span style={{
                        color: BILLING_COLORS[performance.billing_position] ?? '#fff',
                        fontWeight: 600,
                      }}>
                        {BILLING_LABELS[performance.billing_position]}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td>{formatDate(performance.start_time)}</td>
                  <td>{formatTime(performance.start_time)}</td>
                  <td>{formatTime(performance.end_time)}</td>
                  <td>
                    {performance.set_duration_minutes != null
                      ? `${performance.set_duration_minutes} '`
                      : 'N/A'}
                  </td>
                  <td>{formatTimestamp(performance.soundcheck_time)}</td>
                  <td>
                    <span style={{ color: BACKSTAGE_COLORS[performance.backstage_access] }}>
                      {performance.backstage_access.charAt(0).toUpperCase() +
                        performance.backstage_access.slice(1)}
                    </span>
                  </td>
                  <td>
                    {performance.rider_confirmed
                      ? <span style={{ color: '#22c55e' }}>✓</span>
                      : <span style={{ color: '#ef4444' }}>No</span>}
                  </td>
                  {/* <td>{formatDate(performance.created_at)}</td> */}
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => {
                        // const id = artistId ? performances[0].id : performance.id
                        const id = performance.id
                        setSelectedPerformanceId(id)
                        // onNavigate('Performance Detail', performance.id)
                        console.log(id)
                        onNavigate('Performance Detail', id)
                      }}
                    >
                      View
                    </button>
                    {!artistId && (
                      <>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            setSelectedPerformanceId(performance.id)
                            onNavigate('Artist Event Link Edit', performance.id)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            setSelectedPerformanceId(performance.id)
                            setShowDeleteModal(true)
                          }}
                          style={{ background: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showDeleteModal && (
            <DeleteModal
              onConfirm={handleDeletePerformance}
              onCancel={() => {
                setShowDeleteModal(false)
                setSelectedPerformanceId(null)
              }}
              deleting={deleting}
            />
          )}
        </div>
      )}
    </div>
  )
}