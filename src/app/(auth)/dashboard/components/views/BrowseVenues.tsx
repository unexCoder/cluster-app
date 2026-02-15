'use client'

import React, { useEffect, useState } from 'react'
import { deleteVenueAction, fetchVenuesAction } from '@/app/actions/venues'
import styles from './dashboardViews.module.css'
import Link from 'next/link'
import { X } from 'lucide-react'

interface Venue {
  id: string
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

interface BrowseVenuesProps {
  onNavigate: (view: string, id?: string | null) => void
}

export default function BrowseVenues({ onNavigate }: BrowseVenuesProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue)
    setShowDeleteModal(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setVenueToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!venueToDelete) return

    try {
      setDeleting(true)
      const result = await deleteVenueAction(venueToDelete.id)

      if (result.success) {
        // Remove the deleted venue from the list
        setVenues(venues.filter(v => v.id !== venueToDelete.id))
        setShowDeleteModal(false)
        setVenueToDelete(null)
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
        <button
          className={styles.refreshButton}
          onClick={() => onNavigate('Create Venue Profile')}
        >
          Add Venue
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
                <th>Capacity</th>
                <th>Address</th>
                <th>City</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                {/* <th>Created At</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map((venue) => {
                // Parse JSON fields
                const contactInfo = typeof venue.contact_info === 'string' 
                  ? JSON.parse(venue.contact_info) 
                  : venue.contact_info
                // const venueInfo = JSON.parse(venue.venue_info)
                // const imageUrls = JSON.parse(venue.image_urls)
                
                return (
                  <tr key={venue.id}>
                    <td>{venue.name}</td>
                    <td><Link href={`/venues/${venue.slug}`} target='_blank'>{venue.slug}</Link></td>
                    <td>{venue.capacity}</td>
                    <td>{venue.address}</td>
                    <td>{venue.city}</td>
                    <td>{contactInfo.name}</td>
                    <td>{contactInfo.email}</td>
                    <td>{ formatPhone(contactInfo.phone)}</td>
                    {/* <td>
                      {venue.created_at
                        ? new Date(venue.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td> */}
                    <td>
                      <button
                        className={styles.actionButton}
                        onClick={() => onNavigate('Venue Profile Edit',venue.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeleteClick(venue)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              }
            )}
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
                onClick={() => setShowDeleteModal(false) }
                disabled={deleting}
              >
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete the venue:</p>
              <p style={{ fontWeight: 'bold', margin: '10px 0' }}>
                {venueToDelete?.name}
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

function formatPhone(phone:string) {
  const cleaned = phone.replace(/[^\d+]/g, '');

  return cleaned.replace(
    /^(\+\d{2})(\d{3})(\d{3})(\d{4})$/,
    '$1-$2-$3-$4'
  );
}