'use client'

import React, { useEffect, useState } from 'react'
import { activateArtistProfileAction, deleteArtistProfileAction, fetchArtistsAction } from '@/app/actions/artists'
import styles from './dashboardViews.module.css'
import Link from 'next/link'
import DeleteModal from '../components/DeleteModal'

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
  onNavigate: (view: string,id?:string | null) => void
}

export default function BrowseArtists({ onNavigate }: BrowseArtistsProps) {
  const [artists, setArtists] = useState<Artist[]>([]) // ✓ Corregido: era "artist"
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null) // Add this


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
    if (!selectedArtistId) return // Use selectedArtistId instead
    // if (!artists || artists.length === 0) return


    try {
      setDeleting(true)
      // Call your delete action here
      const result = await deleteArtistProfileAction(selectedArtistId)

      if (result.success) {
        setShowDeleteModal(false)
        setSelectedArtistId(null) // Add this line
        // Refresh the profile view or navigate back
        fetchArtists()
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

  const handleActivate = async () => {
    // console.log('trigger activation')
    // if (!artists || artists.length === 0) return
    if (!selectedArtistId) return // Use selectedArtistId instead
    try {
      setDeleting(true)
      // Call your delete action here
      const result = await activateArtistProfileAction(selectedArtistId)

      if (result.success) {
        setShowDeleteModal(false)
        setSelectedArtistId(null) // Clear selection
        // Refresh the profile view or navigate back
        fetchArtists()
      } else {
        alert(result.error || 'Failed to activate profile')
      }
    } catch (err) {
      alert('Error activating profile')
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
                <th>Status</th>
                <th>Created At</th>
                <th>Deleted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id}>
                  <td>{artist.name}</td>
                  <td>{artist.stage_name || 'N/A'}</td>
                  <td><Link href={`/artist/${artist.slug}`}>{artist.slug}</Link></td>
                  <td>{artist.is_verified ? '✓' : 'No'}</td>
                  <td>{artist.popularity_score}</td>
                  {artist.deleted_at ? <td style={{ color: '#f00' }}>Inactive</td> : <td style={{ color: '#0f0' }}>Active</td>}
                  <td>
                    {artist.created_at
                      ? new Date(artist.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td style={{ color: '#f00' }}>
                    {artist.deleted_at
                      ? new Date(artist.deleted_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <button
                      className={styles.actionButton}
                      // onMouseEnter={ () => setSelectedArtistId(artist.id)} // set the ID first!
                      onClick={() => {
                        setSelectedArtistId(artist.id) // ADD THIS LINE!
                        onNavigate('Artist Profile', artist.id)
                      }}
                    >
                      View
                    </button>
                    <button
                      className={styles.actionButton}
                      // onClick={() => onNavigate('Update Artist Profile')}
                      // onMouseEnter={ () => setSelectedArtistId(artist.id)} // set the ID first!
                      onClick={() => {
                        setSelectedArtistId(artist.id) // ADD THIS LINE!
                        onNavigate('Update Artist Profile', artist.id)
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.actionButton}
                      // onClick={() => onNavigate('Update Artist Profile')}
                      onMouseEnter={ () => setSelectedArtistId(artist.id)} // set the ID first!
                      onClick={() => {
                        setSelectedArtistId(artist.id) // ADD THIS LINE!
                        !artist.deleted_at ? setShowDeleteModal(true) : handleActivate()
                      }
                      }
                      style={{ background: '#dc2626' }}
                    >
                      {!artist.deleted_at ? 'Delete' : 'Activate'}
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Delete Confirmation Modal */}
          {showDeleteModal &&
            <DeleteModal
              onConfirm={handleDeleteProfile}
              onCancel={() => {
                setShowDeleteModal(false)
                setSelectedArtistId(null)
              }} // Clear the selection when canceling
              
              deleting={deleting}
            />}

        </div>
      )}
    </div>
  )
}