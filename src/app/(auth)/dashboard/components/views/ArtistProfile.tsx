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
  popularity_score?: number
  is_verified?: number
  verified_at?: string
  verification_method?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

interface ArtistProfileProps {
  userId?: string
  onNavigate?: (view: string) => void
}

export default function ArtistProfile({ userId, onNavigate }: ArtistProfileProps) {
  const [artist, setArtist] = useState<Artist[] | null>(null)
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
        console.log(result.profile)
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

  // if (!artist) {
  if (!artist?.length) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No artist profile found</p>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            Create your artist profile to get started
          </p>
          <button
            className={styles.actionButton}
            style={{ marginTop: '16px' }}
            onClick={() => {
              onNavigate?.('Create Artist Profile')
            }}
          >
            Create Artist Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {artist.map((profile) => {
        console.log(profile)
        const genres = profile.genres || []
        const contactInfo = profile.contact_info || {}
        const socialLinks = profile.social_links || {}

        return (
          <div
            key={profile.id} 
            className={styles_local.container}
            >
            {/* Header */}
            <div className={styles_local.profileCard} style={{ marginBottom:'50px' }}>
              <div className={styles.header} style={{ display: 'flex' }}>
                <h2>Artist Profile</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className={styles.actionButton}>
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Main Profile Card */}
              {/* Artist Header with Image */}
              <div className={styles_local.cardHeader}>
                {/* Profile Picture */}
                <div className={styles_local.imgContainer} >
                  {profile.picture_url ? (
                    <img
                      src={profile.picture_url}
                      alt={profile.name}
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
                      {profile.name}
                    </h1>
                    {profile.is_verified === 1 && (
                      <span className={styles_local.verified}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {profile.stage_name && (
                    <p className={styles_local.stageName}>
                      Stage Name: {profile.stage_name}
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
                      {profile.popularity_score && profile.popularity_score.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className={styles_local.formSection}>
                  <h3 className={styles_local.sectionTitle}>Biography</h3>
                  <p className={styles_local.bio}>
                    {profile.bio}
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
                      <Link href={'http://' + socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Website
                      </Link>
                    )}
                    {socialLinks.instagram && (
                      <Link href={'http://' + socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Instagram
                      </Link>
                    )}
                    {socialLinks.facebook && (
                      <Link href={'http://' + socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Facebook
                      </Link>
                    )}
                    {socialLinks.twitter && (
                      <Link href={'http://' + socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Twitter
                      </Link>                      
                    )}
                    {socialLinks.spotify && (
                      <Link href={'http://' + socialLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Spotify
                      </Link>
                    )}
                    {socialLinks.youtube && (
                      <Link href={'http://' + socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Youtube
                      </Link>
                    )}
                    {socialLinks.tiktok && (
                      <Link href={'http://' + socialLinks.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                      >
                        Tiktok
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Technical Requirements */}
              {profile.technical_requirements && (
                <div className={styles_local.formSection}>
                  <h3 className={styles_local.sectionTitle}>Technical Requirements</h3>
                  <p className={styles_local.technicalRequirements}>
                    {profile.technical_requirements}
                  </p>
                </div>
              )}

              {/* Documents */}
              {(profile.rider_url || profile.presskit_url) && (
                <div className={styles_local.formSection}>
                  <h3 className={styles_local.sectionTitle}>Documents & Media</h3>
                  <div className={styles_local.documents}>
                    {profile.rider_url && (
                      <a href={profile.rider_url} target="_blank" rel="noopener noreferrer"
                        className={styles.documentLink}>
                        📄 Technical Rider
                      </a>
                    )}
                    {profile.presskit_url && (
                      <a href={profile.presskit_url} target="_blank" rel="noopener noreferrer"
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
                      <Link href={`/artist/${profile.slug}`}>/artist/{profile.slug}</Link>
                    </span>
                  </div>
                  {profile.is_verified === 1 && (
                    <div className={styles.infoGroup}>
                      <label>Verified:</label>
                      <span>
                        {profile.verified_at
                          ? new Date(profile.verified_at).toLocaleDateString()
                          : 'Yes'
                        } ({profile.verification_method})
                      </span>
                    </div>
                  )}
                  <div className={styles.infoGroup}>
                    <label>Created:</label>
                    <span>
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className={styles.infoGroup}>
                    <label>Last Updated:</label>
                    <span>
                      {profile.updated_at
                        ? new Date(profile.updated_at).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}