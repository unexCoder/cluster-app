'use client'

import React, { useEffect, useState } from 'react'
import { fetchArtistsAction } from '@/app/actions/artists'
import styles from './dashboardViews.module.css'
import Link from 'next/link'

interface Artist {
  id: string
  user_id: string
  name: string
  slug: string
  stage_name: string
  picture_url: string
  bio: string
  genres: string
  contact_info: string
  social_links: string
  rider_url: string
  presskit_url: string
  technical_requirements: string
  popularity_score?: number
  is_verified?: number
  verified_at?: string
  verification_method?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

interface BrowseArtistsProps {
  onNavigate: (view: string) => void
}

export default function BrowseArtists({ onNavigate }: BrowseArtistsProps) {
  const [artists, setArtists] = useState<Artist[]>([]) // ✓ Corregido: era "artist"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchArtistsAction()

      if (result.success) {
        setArtists(result.artists)
      } else {
        throw new Error(result.error || 'Failed to fetch artists')
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
        <div className={styles.loading}>Loading artists...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchArtists} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{width:'100%'}}>
        <h2>Browse Artists</h2>
        <button 
          className={styles.refreshButton}
          onClick={() => onNavigate('Create Artist Profile')}
        >
          Create
        </button>
      </div>

      {artists.length === 0 ? (
        <div className={styles.empty}>No artists found</div>
      ) : (
        <div className={styles.tableContainer} style={{width:'100%'}}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Stage Name</th>
                <th>Slug</th>
                <th>Verified</th>
                <th>Popularity</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id}>
                  <td>{artist.name}</td>
                  <td>{artist.stage_name || 'N/A'}</td>
                  <td><Link href={`/artist/${artist.slug}`}>{artist.slug}</Link></td>
                  <td>{artist.is_verified ? '✓' : '✗'}</td>
                  <td>{artist.popularity_score}</td>
                  <td>
                    {artist.created_at
                      ? new Date(artist.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Edit artist:', artist.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={() => console.log('Delete artist:', artist.id)}
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