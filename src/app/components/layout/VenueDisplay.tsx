'use client'

import { getVenueBySlugAction } from '@/app/actions/venues'
import React, { useEffect, useState } from 'react'
import styles from './venueDisplay.module.css'
import { Globe, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface VenueDisplayProps {
  slug: string
}

// Contact info interface
interface ContactInfo {
  name?: string
  email?: string
  phone?: string
  website?: string
}

// Venue info interface
interface VenueInfo {
  type?: string
  amenities?: string[]
  accessibility?: string
  parkingInfo?: string
  publicTransport?: string
}

// Database row interface (MySQL auto-parses JSON)
interface VenuesRow {
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
  contact_info: ContactInfo | string // Could be object or string
  venue_info: VenueInfo | string // Could be object or string
  image_urls: string[] | string // Could be array or string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

// Parsed venue interface (for component state)
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
  contactInfo: ContactInfo
  venueInfo: VenueInfo
  imageUrls: string[]
  created_at: Date
  updated_at: Date
}

export default function VenueDisplay({ slug }: VenueDisplayProps) {
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageAspect, setImageAspect] = useState<'portrait' | 'landscape' | 'square'>('square')

  //  useState hooks to calculate random style just once on mount
  const [layoutStyles] = useState(() => ({
    switchLayout: Math.random() > 0.5,
    altLayout: Math.random() > 0.5,
    colorLayout: (() => {
      const colorRand = Math.random()
      switch (true) {
        case colorRand < 0.33:
          return styles.colorB
        case colorRand < 0.66:
          return styles.colorA
        default:
          return styles.colorC
      }
    })()
  }))

  // image carrousel control
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (slug) {
      fetchVenueProfile()
    }
  }, [slug])

  // hook for auto play carrousel
  useEffect(() => {
    if (!venue?.imageUrls || venue.imageUrls.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === venue.imageUrls.length - 1 ? 0 : prev + 1
      )
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [venue?.imageUrls])


  // Parse JSON fields from database row
  const parseVenue = (venueRow: VenuesRow): Venue => {
    let contactInfo: ContactInfo = {}
    let venueInfo: VenueInfo = {}
    let imageUrls: string[] = []

    // Handle contact_info (might already be parsed by MySQL)
    if (venueRow.contact_info) {
      if (typeof venueRow.contact_info === 'string') {
        try {
          contactInfo = JSON.parse(venueRow.contact_info)
        } catch (e) {
          console.error('Error parsing contact_info:', e)
        }
      } else {
        contactInfo = venueRow.contact_info
      }
    }

    // Handle venue_info (might already be parsed by MySQL)
    if (venueRow.venue_info) {
      if (typeof venueRow.venue_info === 'string') {
        try {
          venueInfo = JSON.parse(venueRow.venue_info)
        } catch (e) {
          console.error('Error parsing venue_info:', e)
        }
      } else {
        venueInfo = venueRow.venue_info
      }
    }

    // Handle image_urls (might already be parsed by MySQL)
    if (venueRow.image_urls) {
      if (typeof venueRow.image_urls === 'string') {
        try {
          imageUrls = JSON.parse(venueRow.image_urls)
        } catch (e) {
          console.error('Error parsing image_urls:', e)
        }
      } else {
        imageUrls = venueRow.image_urls
      }
    }

    return {
      id: venueRow.id,
      name: venueRow.name,
      slug: venueRow.slug,
      description: venueRow.description,
      capacity: venueRow.capacity,
      address: venueRow.address,
      city: venueRow.city,
      country: venueRow.country,
      latitude: venueRow.latitude,
      longitude: venueRow.longitude,
      contactInfo,
      venueInfo,
      imageUrls,
      created_at: venueRow.created_at,
      updated_at: venueRow.updated_at
    }
  }

  const fetchVenueProfile = async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const result = await getVenueBySlugAction(slug)

      if (result.success && result.venue) {
        const parsedVenue = parseVenue(result.venue)
        setVenue(parsedVenue)
      } else if (result.success && !result.venue) {
        setError('Venue not found')
      } else {
        throw new Error(result.error || 'Failed to fetch venue profile')
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
        <div className={styles.loading}>Loading venue profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchVenueProfile} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No venue profile found</p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            The venue "{slug}" does not exist.
          </p>
        </div>
      </div>
    )
  }

  // // styling
  // const switchLayout = Math.random() > 0.5 ? true : false;
  // const altLayout = Math.random() > 0.5 ? true : false;
  // const colorRand = Math.random()

  // const colorLayout = (() => {
  //   switch (true) {
  //     case colorRand < 0.33:
  //       return styles.colorB
  //     case colorRand < 0.66:
  //       return styles.colorA
  //     default:
  //       return styles.colorC
  //   }
  // })()

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const ratio = img.naturalWidth / img.naturalHeight

    if (ratio > 1.1) {
      setImageAspect('landscape')
    } else if (ratio < 0.9) {
      setImageAspect('portrait')
    } else {
      setImageAspect('square')
    }
  }

  return (
    <div className={`${styles.container} ${layoutStyles.colorLayout}`}>
      {/* Venue Info */}
      <div className={styles.profileCard}>
        {/* Venue Image with Auto-Carousel */}
        <div className={`${styles.imgContainer} ${layoutStyles.altLayout ? styles.imgContainerAlt : null} ${layoutStyles.switchLayout ? styles.imgContainerSwitch : null}`}>
          {venue.imageUrls && venue.imageUrls.length > 0 ? (
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={venue.imageUrls[currentImageIndex]}
                width={0}
                height={0}
                alt={`Venue preview ${currentImageIndex + 1}`}
                onLoad={handleImageLoad}
                style={{
                  width: imageAspect === 'portrait' ? '40%' : '75%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
              />
            </div>
          ) : (
            <div style={{
              width: '75%',
              aspectRatio: '1',
              backgroundColor: '#f3f4f600',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
            }}>
              <MapPin size={48} opacity={0.3} />
            </div>
          )}
        </div>

        <div className={`${styles.profile} ${layoutStyles.altLayout ? styles.profileAlt : null} ${layoutStyles.switchLayout ? styles.profileSwitch : null}`}>
          <div className={styles.header}>
            <h1>{venue.name}</h1>
          </div>

          {/* Description */}
          {venue.description && (
            <div className={styles.bioSection}>
              <p>{venue.description}</p>
            </div>
          )}

          {/* Venue Details */}
          <div className={styles.venueDetails}>
            <div className={styles.detailItem}>
              <MapPin size={18} className={styles.icon} />
              {venue.latitude && venue.longitude ? (
                <Link
                  href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ paddingLeft: '5px', textDecoration: 'none', color: 'inherit' }}
                >
                  {venue.address}, {venue.city}, {venue.country}
                </Link>
              ) : (
                <span style={{ paddingLeft: '5px' }}>
                  {venue.address}, {venue.city}, {venue.country}
                </span>
              )}
            </div>
            {venue.capacity && (
              <div className={styles.detailItem}>
                <Users size={18} className={styles.icon} />
                <span style={{ paddingLeft: '5px' }}>Capacidad: {venue.capacity}</span>
              </div>
            )}
            {venue.venueInfo?.type && (
              <div className={styles.detailItem}>
                <span>Type: {venue.venueInfo.type}</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          {venue.venueInfo?.amenities && venue.venueInfo.amenities.length > 0 && (
            <div className={styles.genres}>
              {venue.venueInfo.amenities.map((amenity: string, index: number) => (
                <span key={index} className={styles.genreBadge}>
                  {amenity}
                </span>
              ))}
            </div>
          )}

          {/* Additional Info */}
          {(venue.venueInfo?.accessibility || venue.venueInfo?.parkingInfo || venue.venueInfo?.publicTransport) && (
            <div className={styles.additionalInfo}>
              {venue.venueInfo.accessibility && (
                <p><strong>Accessibility:</strong> {venue.venueInfo.accessibility}</p>
              )}
              {venue.venueInfo.parkingInfo && (
                <p><strong>Parking:</strong> {venue.venueInfo.parkingInfo}</p>
              )}
              {venue.venueInfo.publicTransport && (
                <p><strong>Public Transport:</strong> {venue.venueInfo.publicTransport}</p>
              )}
            </div>
          )}

          {/* Contact Links */}
          {venue.contactInfo && Object.values(venue.contactInfo).some(link => link) && (
            <div className={styles.socialSection}>
              <div className={styles.socialLinks}>
                {venue.contactInfo.website && (
                  <Link
                    href={venue.contactInfo.website.startsWith('http') ? venue.contactInfo.website : `https://${venue.contactInfo.website}`}
                    target='_blank'
                    rel="noopener noreferrer"
                  >
                    <Globe size={20} className={styles.icon} />
                    <span style={{ paddingLeft: '5px' }}>{venue.contactInfo.website}</span>
                  </Link>
                )}
                {/* {venue.contactInfo.email && (
                  <a href={`mailto:${venue.contactInfo.email}`}>
                    <span style={{ fontSize: '14px' }}>📧</span>
                  </a>
                )}
                {venue.contactInfo.phone && (
                  <a href={`tel:${venue.contactInfo.phone}`}>
                    <span style={{ fontSize: '14px' }}>📞</span>
                  </a>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}