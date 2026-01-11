'use client'

import React, { useEffect, useState } from 'react'
import { deleteArtistProfileAction, fetchArtistsAction } from '@/app/actions/artists'
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteProfile = async () => {
    if (!artists || artists.length === 0) return

    try {
      setDeleting(true)
      // Call your delete action here
      const result = await deleteArtistProfileAction(artists[0].id)

      if (result.success) {
        setShowDeleteModal(false)
        // Refresh the profile view or navigate back
        // fetchArtistProfile()
      } else {
        alert(result.error || 'Failed to delete profile')
      }
    } catch (err) {
      alert('Error deleting profile')
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header} style={{ width: '100%' }}>
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
        <div className={styles.tableContainer} style={{ width: '100%' }}>
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
                      onClick={() => onNavigate('Update Artist Profile')}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.actionButton}
                      // onClick={() => onNavigate('Update Artist Profile')}
                      onClick={() => setShowDeleteModal(true)}
                      style={{ background: '#dc2626' }}
                    >
                      Delete
                    </button>
                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1000
                        }}
                        onClick={() => setShowDeleteModal(false)}
                      >
                        <div
                          style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                            Delete Artist Profile
                          </h3>
                          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Are you sure you want to delete this artist profile? This action cannot be undone.
                          </p>
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => setShowDeleteModal(false)}
                              disabled={deleting}
                              style={{
                                padding: '10px 24px',
                                background: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDeleteProfile}
                              disabled={deleting}
                              style={{
                                padding: '10px 24px',
                                background: deleting ? '#fca5a5' : '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: deleting ? 'not-allowed' : 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              {deleting ? 'Deleting...' : 'Delete Profile'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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