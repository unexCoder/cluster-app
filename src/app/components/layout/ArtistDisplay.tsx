'use client'

import { fetchArtistBySlugAction } from '@/app/actions/artists'
import React, { useEffect, useState } from 'react'
import styles from './artistDisplay.module.css'
import { Globe, Instagram, Music, Youtube, Facebook, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ArtistDisplayProps {
  slug: string
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


export default function ArtistDisplay({ slug }: ArtistDisplayProps) {
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

  // styling
  const switchLayout = Math.random() > 0.5 ? true : false;
  const altLayout = Math.random() > 0.5 ? true : false;
  const colorRand = Math.random();

  const colorLayout = (() => {
    switch (true) {
      case colorRand < 0.33:
        return styles.colorB

      case colorRand < 0.66:
        return styles.colorA

      default:
        return styles.colorC
    }
  })()

  return (
    <div className={`${styles.container} ${colorLayout}`}>

      {/* Artist Info */}
      <div className={styles.profileCard}>
        {/* Profile Picture */}
        {artist.picture_url && (
          <div className={`${styles.imgContainer} ${altLayout ? styles.imgContainerAlt : null} ${switchLayout ? styles.imgContainerSwitch : null}`}>
            <Image
              src={artist.picture_url}
              width={700}
              height={0} // ignored
              alt={artist.name}
              className={styles.profileImage}
              style={{ height: 'auto' }}
            />
          </div>
        )}

        {/* <div className={styles.profile}> */}
        <div className={`${styles.profile} ${altLayout ? styles.profileAlt : null} ${switchLayout ? styles.profileSwitch : null}`}>

          <div className={styles.header}>
            <h1>{artist.name}</h1>
          </div>

          {/* Bio */}
          {artist.bio && (
            <div className={styles.bioSection}>
              {/* <h2>Bio</h2> */}
              <p>{artist.bio}</p>  {/* 150 chars max. */}
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
          {console.log(socialLinks)}
          {socialLinks && Object.values(socialLinks).some(link => link) && (
            <div className={styles.socialSection}>
              {/* <h2>Social Media</h2> */}
              <div className={styles.socialLinks}>
                {socialLinks.website && (
                  <Link href={'http://' + socialLinks.website} target='_blank' rel="noopener noreferrer"><Globe size={20} /></Link>
                )}
                {socialLinks.instagram && (
                  <Link href={'http://' + socialLinks.instagram} target='_blank' rel="noopener noreferrer"><Instagram size={20} /></Link>
                )}
                {socialLinks.spotify && (
                  <Link href={'http://' + socialLinks.spotify} target='_blank' rel="noopener noreferrer"><Music size={20} /></Link>
                )}
                {socialLinks.youtube && (
                  <Link href={'http://' + socialLinks.youtube} target='_blank' rel="noopener noreferrer"><Youtube size={20} /></Link>
                )}
                {socialLinks.facebook && (
                  <Link href={'http://' + socialLinks.facebook} target='_blank' rel="noopener noreferrer"><Facebook size={20} /></Link>
                )}
                {socialLinks.twitter && (
                  <Link href={'http://' + socialLinks.twitter} target='_blank' rel="noopener noreferrer"><Twitter size={20} /></Link>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
