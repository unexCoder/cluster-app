'use client'

import React, { useEffect, useState } from 'react'
import { getEventArtistPerformanceByIdAction, type EventArtistPerformanceRow } from '@/app/actions/artist-event-link'
import { fetchEventByIdAction } from '@/app/actions/events'
import { fetchArtistByIdAction } from '@/app/actions/artists'
import styles from './dashboardViews.module.css'
import styles_local from './displayProfile.module.css'

interface PerformanceDetailProps {
  performanceId: string
  onNavigate: (view: string, id?: string | null) => void
  artistId?: string   // ← add this
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

export default function PerformanceDetail({ performanceId, onNavigate, artistId }: PerformanceDetailProps) {
  const [performance, setPerformance] = useState<EventArtistPerformanceRow | null>(null)
  const [eventName, setEventName] = useState<string | null>(null)
  const [artistName, setArtistName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPerformance()
  }, [performanceId])

  const fetchPerformance = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getEventArtistPerformanceByIdAction(performanceId)

      if (result.success && result.performance) {
        const perf = result.performance
        setPerformance(perf)

        // Fetch event and artist names in parallel
        const [eventResult, artistResult] = await Promise.all([
          fetchEventByIdAction(perf.event_id),
          fetchArtistByIdAction(perf.artist_id),
        ])

        if (eventResult.success && eventResult.event) {
          setEventName(eventResult.event.name)
        }
        if (artistResult.success && artistResult.profile) {
          setArtistName(artistResult.profile.name)
        }
      } else {
        throw new Error(result.error || 'Failed to fetch performance')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (ts: Date | null) => {
    if (!ts) return 'N/A'
    return new Date(ts).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (ts: Date | null) => {
    if (!ts) return 'N/A'
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading performance...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchPerformance} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!performance) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Performance not found</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>

        {/* ── Header ── */}
        <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Performance Detail</h2>
        </div>

        {/* ── Identity ── */}
        <div className={styles_local.profileSection}>
          <h3>Event & Artist</h3>
          <div className={styles_local.profileField}>
            <label>Event:</label>
            <span>{eventName ?? performance.event_id}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Artist:</label>
            <span>{artistName ?? performance.artist_id}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Performance Type:</label>
            <span>{performance.performance_type}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Performance Order:</label>
            <span>#{performance.performance_order}</span>
          </div>
        </div>

        {/* ── Schedule ── */}
        <div className={styles_local.profileSection}>
          <h3>Schedule</h3>
          <div className={styles_local.profileField}>
            <label>Date:</label>
            <span>{formatDate(performance.start_time)}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Start Time:</label>
            <span>{formatTime(performance.start_time)}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>End Time:</label>
            <span>{formatTime(performance.end_time)}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Set Duration:</label>
            <span>
              {performance.set_duration_minutes != null
                ? `${performance.set_duration_minutes} minutes`
                : 'N/A'}
            </span>
          </div>
          <div className={styles_local.profileField}>
            <label>Soundcheck:</label>
            <span>{formatTime(performance.soundcheck_time)}</span>
          </div>
        </div>

        {/* ── Details ── */}
        <div className={styles_local.profileSection}>
          <h3>Performance Details</h3>
          <div className={styles_local.profileField}>
            <label>Stage:</label>
            <span>{performance.stage || 'N/A'}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Billing Position:</label>
            <span style={{
              color: BILLING_COLORS[performance.billing_position ?? ''] ?? '#fff',
              fontWeight: 600,
            }}>
              {BILLING_LABELS[performance.billing_position ?? ''] ?? 'N/A'}
            </span>
          </div>
          <div className={styles_local.profileField}>
            <label>Backstage Access:</label>
            <span style={{ color: BACKSTAGE_COLORS[performance.backstage_access] ?? '#fff' }}>
              {performance.backstage_access.charAt(0).toUpperCase() +
                performance.backstage_access.slice(1)}
            </span>
          </div>
          <div className={styles_local.profileField}>
            <label>Rider Confirmed:</label>
            {Boolean(performance.rider_confirmed)
              ? <span style={{ color: '#22c55e' }}>✓ Confirmed</span>
              : <span style={{ color: '#ef4444' }}>Not Confirmed</span>}
          </div>
          {performance.notes && (
            <div className={styles_local.profileField}>
              <label>Notes:</label>
              <span>{performance.notes}</span>
            </div>
          )}
        </div>

        {/* ── Metadata ── */}
        <div className={styles_local.profileSection}>
          <h3>Record Info</h3>
          <div className={styles_local.profileField}>
            <label>Created:</label>
            <span>{new Date(performance.created_at).toLocaleString()}</span>
          </div>
          <div className={styles_local.profileField}>
            <label>Last Updated:</label>
            <span>{new Date(performance.updated_at).toLocaleString()}</span>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          {!artistId && (
            <button
              className={styles.actionButton}
              onClick={() => onNavigate('Artist Event Link Edit', performanceId)}
            >
              Edit Performance
            </button>
          )}

          <button
            className={styles.actionButton}
            onClick={() => onNavigate(artistId ? 'Gigs List' : 'Artist > Event Link')}
          >
            Back to List
          </button>
          {/* <button
            className={styles.actionButton}
            onClick={() => onNavigate('Artist Event Link Edit', performanceId)}
          >
            Edit Performance
          </button>
          <button
            className={styles.actionButton}
            onClick={() => onNavigate('Artist > Event Link')}
          >
            Back to List
          </button> */}
        </div>

      </div>
    </div>
  )
}