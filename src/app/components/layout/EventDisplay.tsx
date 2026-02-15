'use client'
import React, { useEffect, useState } from 'react'
import styles from './eventDisplay.module.css'
import Link from 'next/link'

interface EventDisplayProps {
  slug: string
}

interface Artist {
  artist_name: string
  artist_slug: string
  artist_genres: string[]
  performance_type: string
  stage: string
}

interface Media {
  images: string[]
  poster: string
  videos: string[]
}

interface Venue {
  name: string
  address: string
  city: string
  slug: string
}

interface Event {
  name: string
  description: string
  short_description: string
  event_type: string
  age_restriction: string
  doors_open_time: string
  start_date_time: string
  end_date_time: string
  remaining_capacity: number
  categories: string[]
  tags: string[]
  artists: Artist[]
  media: Media
  venue: Venue
}

export default function EventDisplay({ slug }: EventDisplayProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/events/${slug}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status} ${response.statusText}`)
        }

        const data: { event: Event } = await response.json()
        setEvent(data.event) // unwrap the nested { event: {...} }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [slug])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('es-AR', {
      weekday: 'short',
      // year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) return <div className={styles.loading}>Loading event...</div>
  if (error)   return <div className={styles.error}>Error: {error}</div>
  if (!event)  return <div className={styles.empty}>No event found.</div>

  return (
    <div className={styles.container}>

      {/* Header */}
      {event.media.poster && (
        <img src={event.media.poster} alt={event.name} className={styles.poster} />
      )}
      <h1 className={styles.title}>{event.name}</h1>
      <p className={styles.shortDescription}>{event.short_description}</p>

      {/* Meta */}
      <div className={styles.meta}>
        <span className={styles.eventType}>{event.event_type}</span>
        <span className={styles.ageRestriction}>{event.age_restriction}</span>
        <span className={styles.capacity}>🎟 {event.remaining_capacity} spots left</span>
      </div>

      {/* Times */}
      <div className={styles.times}>
        <p>🚪 Doors open: {formatDate(event.doors_open_time)}</p>
        <p>▶️ Start: {formatDate(event.start_date_time)}</p>
        <p>⏹ End: {formatDate(event.end_date_time)}</p>
      </div>

      {/* Venue */}
      <div className={styles.venue}>
        <h2>Venue</h2>
        <Link href={`/venues/${event.venue.slug}`} target='blank'><p>{event.venue.name}</p></Link>
        <p>{event.venue.address}, {event.venue.city}</p>
      </div>

      {/* Artists */}
      <div className={styles.artists}>
        <h2>Artists</h2>
        {event.artists.map((artist) => (
          <div key={artist.artist_slug} className={styles.artistCard}>
            <Link href={`/artist/${artist.artist_slug}`} target='blank'><h3>{artist.artist_name}</h3></Link>
            <p>{artist.performance_type} — {artist.stage}</p>
            <p className={styles.genres}>{artist.artist_genres.join(', ')}</p>
          </div>
        ))}
      </div>

      {/* Categories & Tags */}
      <div className={styles.taxonomy}>
        <div className={styles.categories}>
          {event.categories.map((cat) => (
            <span key={cat} className={styles.tag}>{cat}</span>
          ))}
        </div>
        <div className={styles.tags}>
          {event.tags.map((tag) => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={styles.description}>
        <h2>About</h2>
        <p>{event.description}</p>
      </div>

    </div>
  )
}