'use client'

import React, { useEffect, useState } from 'react'
import { fetchArtistByUserIdAction } from '@/app/actions/artists'
import styles from './dashboardViews.module.css'
import styles_local from './artistProfile.module.css'
import Link from 'next/link'

interface Artist {
  id: string
  user_id: string
  name: string
  slug: string
  stage_name: string
  picture_url: string
  bio: string
  genres: any
  contact_info: any
  social_links: any
  rider_url: string
  presskit_url: string
  technical_requirements: string
  popularity_score: number
  is_verified: number
  verified_at?: string
  verification_method: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

interface ArtistProfileProps {
  userId?: string
}

export default function ArtistProfile({ userId }: ArtistProfileProps) {
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchArtistProfile()
    }
  }, [userId])

  const fetchArtistProfile = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)

      const result = await fetchArtistByUserIdAction(userId)

      if (result.success && result.profile) {
        setArtist(result.profile)
      } else if (result.success && !result.profile) {
        // No hay perfil de artista
      } else {
        throw new Error(result.error || 'Failed to fetch artist profile')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>User ID not available</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading artist profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchArtistProfile} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No artist profile found</p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            Create your artist profile to get started
          </p>
          <button className={styles.actionButton} style={{ marginTop: '16px' }}>
            Create Artist Profile
          </button>
        </div>
      </div>
    )
  }

  // Usar directamente, ya vienen parseados desde MySQL
  const genres = artist.genres || []
  const contactInfo = artist.contact_info || {}
  const socialLinks = artist.social_links || {}

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Artist Profile</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.actionButton}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className={styles_local.profileCard}>
        {/* Artist Header with Image */}
        <div className={styles_local.cardHeader}>
          {/* Profile Picture */}
          <div className={styles_local.imgContainer} >
            {artist.picture_url ? (
              <img 
                src={artist.picture_url} 
                alt={artist.name}
                className={styles_local.profileImg}
              />
            ) : (
              <div className={styles_local.imgNotLoaded}>
                🎵
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className={styles_local.artistInfoContainer}>
            <div className={styles_local.artistInfoHeader}>
              <h1 className={styles_local.artistInfoName}>
                {artist.name}
              </h1>
              {artist.is_verified === 1 && (
                <span className={styles_local.verified}>
                  ✓ Verified
                </span>
              )}
            </div>

            {artist.stage_name && (
              <p className={styles_local.stageName}>
                Stage Name: {artist.stage_name}
              </p>
            )}

            {/* Genres */}
            {Array.isArray(genres) && genres.length > 0 && (
              <div className={styles_local.tagsContainer}>
                {genres.map((genre: string, index: number) => (
                  <span 
                    key={index}
                    className={styles_local.tags}
                    >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Popularity Score */}
            <div className={styles_local.scoreContainer}>
              <span className={styles_local.scoreLabel}>Popularity:</span>
              <div className={styles_local.score}>
                {artist.popularity_score.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {artist.bio && (
          <div className={styles_local.formSection}>
            <h3 className={styles_local.sectionTitle}>Biography</h3>
            <p className={styles_local.bio}>
              {artist.bio}
            </p>
          </div>
        )}

        {/* Contact Information */}
        {(contactInfo?.name || contactInfo?.email || contactInfo?.phone) && (
          <div className={styles_local.formSection}>
            <h3 className={styles_local.sectionTitle}>Contact Information</h3>
            <div className={styles_local.contactInfo}>
              {contactInfo.name && (
                <div className={styles.infoGroup}>
                  <label>Name:</label>
                  <span>{contactInfo.name} {contactInfo.last_name || ''}</span>
                </div>
              )}
              {contactInfo.email && (
                <div className={styles.infoGroup}>
                  <label>Email:</label>
                  <a href={`mailto:${contactInfo.email}`} style={{ color: '#3b82f6' }}>
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.phone && (
                <div className={styles.infoGroup}>
                  <label>Phone:</label>
                  <span>{contactInfo.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks && Object.values(socialLinks).some(link => link) && (
          <div className={styles_local.formSection}>
            <h3 className={styles_local.sectionTitle}>Social Media</h3>
            <div className={styles_local.socialMedia}>
              {socialLinks.website && (
                <Link href={socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      >
                    Website
                </Link>
                // <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" 
                //   className={styles.socialLink}>
                // </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  Instagram
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  Facebook
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  Twitter
                </a>
              )}
              {socialLinks.spotify && (
                <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  Spotify
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  YouTube
                </a>
              )}
              {socialLinks.tiktok && (
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer"
                  className={styles.socialLink}>
                  TikTok
                </a>
              )}
            </div>
          </div>
        )}

        {/* Technical Requirements */}
        {artist.technical_requirements && (
          <div className={styles_local.formSection}>
            <h3 className={styles_local.sectionTitle}>Technical Requirements</h3>
            <p className={styles_local.technicalRequirements}>
              {artist.technical_requirements}
            </p>
          </div>
        )}

        {/* Documents */}
        {(artist.rider_url || artist.presskit_url) && (
          <div className={styles_local.formSection}>
            <h3 className={styles_local.sectionTitle}>Documents & Media</h3>
            <div className={styles_local.documents}>
              {artist.rider_url && (
                <a href={artist.rider_url} target="_blank" rel="noopener noreferrer"
                   className={styles.documentLink}>
                  📄 Technical Rider
                </a>
              )}
              {artist.presskit_url && (
                <a href={artist.presskit_url} target="_blank" rel="noopener noreferrer"
                   className={styles.documentLink}>
                  📦 Press Kit
                </a>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className={styles_local.formSection}>
          <h3 className={styles_local.sectionTitle}>Profile Information</h3>
          <div className={styles_local.profileInformationContainer}>
            <div className={styles.infoGroup}>
              <label>Profile URL:</label>
              <span style={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '13px' }}>
                <Link href={`/artist/${artist.slug}`}>/artist/{artist.slug}</Link>
              </span>
            </div>
            {artist.is_verified === 1 && (
              <div className={styles.infoGroup}>
                <label>Verified:</label>
                <span>
                  {artist.verified_at 
                    ? new Date(artist.verified_at).toLocaleDateString()
                    : 'Yes'
                  } ({artist.verification_method})
                </span>
              </div>
            )}
            <div className={styles.infoGroup}>
              <label>Created:</label>
              <span>
                {artist.created_at 
                  ? new Date(artist.created_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className={styles.infoGroup}>
              <label>Last Updated:</label>
              <span>
                {artist.updated_at 
                  ? new Date(artist.updated_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}