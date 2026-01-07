'use client'

import { fetchArtistBySlugAction } from '@/app/actions/artists'
import React, { useEffect, useState, use } from 'react'
import styles from './page.module.css'
import { Globe, Instagram, Music, Youtube, Facebook, Twitter } from 'lucide-react'

interface ArtistPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

interface Artist {
  id: string
  name: string
  slug: string
  picture_url: string
  bio: string
  genres: any
  social_links: any
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = use(params) // Usar React.use() para unwrap Promise
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchArtistProfile()
    }
  }, [slug])

  const fetchArtistProfile = async () => {
    if (!slug) return

    try {
      setLoading(true)
      setError(null)

      const result = await fetchArtistBySlugAction(slug)

      if (result.success && result.profile) {
        setArtist(result.profile)
      } else if (result.success && !result.profile) {
        setError('Artist not found')
      } else {
        throw new Error(result.error || 'Failed to fetch artist profile')
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
            The artist "{slug}" does not exist.
          </p>
        </div>
      </div>
    )
  }

  // Datos ya vienen parseados desde MySQL
  const genres = artist.genres || []
  const socialLinks = artist.social_links || {}

  return (
    <div className={styles.container}>
      
      {/* Artist Info */}
      <div className={styles.profileCard}>
        {/* Profile Picture */}
        {artist.picture_url && (
        <div className={styles.imgContainer}>
            <img 
              src={artist.picture_url} 
              alt={artist.name}
              className={styles.profileImage}
              width={700}
            />
        </div>
        )}

        <div className={styles.profile}>

          <div className={styles.header}>
            <h1>{artist.name}</h1>
          </div>

          {/* Bio */}
          {artist.bio && (
            <div className={styles.bioSection}>
              {/* <h2>Bio</h2> */}
              <p>{artist.bio}</p>
            </div>
          )}

          {/* Genres */}
          {Array.isArray(genres) && genres.length > 0 && (
            <div className={styles.genres}>
              {genres.map((genre: string, index: number) => (
                <span key={index} className={styles.genreBadge}>
                  #{genre}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {socialLinks && Object.values(socialLinks).some(link => link) && (
            <div className={styles.socialSection}>
              {/* <h2>Social Media</h2> */}
              <div className={styles.socialLinks}>
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe size={20} />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram size={20} />
                  </a>
                )}
                {socialLinks.spotify && (
                  <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
                    <Music size={20} />
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube size={20} />
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Facebook size={20} />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}