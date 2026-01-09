'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';

interface ArtistRow extends RowDataPacket {
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
  popularity_score: number
  is_verified: number
  verified_at?: string
  verification_method: string
  created_at?: string
  updated_at?: string
  deleted_at?: string
}

export async function fetchArtistsAction() {
  try {
    const artists = await query('SELECT * FROM artist') as ArtistRow[];
    return { success: true, artists };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch artists', artists: [] };
  }
}

export async function fetchArtistByUserIdAction(id: string) {
  try {
    const profile = await query('SELECT * FROM artist WHERE user_id = ?', [id]) as ArtistRow[];
    return { success: true, profile: profile[0] || null };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch artist', profile: null };
  }
}

export async function fetchArtistBySlugAction(slug: string) {
  try {
    const profile = await query('SELECT * FROM artist WHERE slug = ?', [slug]) as ArtistRow[];
    return { success: true, profile: profile[0] || null };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch artist', profile: null };
  }
}

interface ActionResult {
  success: boolean
  data?: any
  error?: string
}

export async function createArtistProfileAction(
  formData: ArtistRow
): Promise<ActionResult> {
  try {
    // Check if user already has a profile
    const existingProfile:[] = await query(
      'SELECT id FROM artist WHERE user_id = ? AND deleted_at IS NULL',
      [formData.user_id]
    )

    if (existingProfile && existingProfile.length > 0) {
      return { success: false, error: 'Artist profile already exists' }
    }

    // Generate unique slug
    const baseSlug = generateSlug(formData.name)
    let slug = baseSlug
    let counter = 0

    while (true) {
      const slugExists:[] = await query(
        'SELECT id FROM artist WHERE slug = ? AND deleted_at IS NULL',
        [slug]
      )
      if (!slugExists || slugExists.length === 0) break
      counter++
      slug = `${baseSlug}-${counter}`
    }

    // Prepare JSON fields
    const genres = typeof formData.genres === 'string' 
      ? formData.genres 
      : JSON.stringify(formData.genres)
    
    const contactInfo = typeof formData.contact_info === 'string'
      ? formData.contact_info
      : JSON.stringify(formData.contact_info)
    
    const socialLinks = typeof formData.social_links === 'string'
      ? formData.social_links
      : JSON.stringify(formData.social_links)

    // Insert artist profile
    await query(
      `INSERT INTO artist (
        id, user_id, name, slug, stage_name, picture_url, bio,
        genres, contact_info, social_links, technical_requirements,
        rider_url, presskit_url, created_at, updated_at
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        formData.user_id,
        formData.name,
        slug,
        formData.stage_name || null,
        formData.picture_url || null,
        formData.bio || null,
        genres,
        contactInfo,
        socialLinks,
        formData.technical_requirements || null,
        formData.rider_url || null,
        formData.presskit_url || null
      ]
    )
    // Get created profile
    const createdProfile = await query(
      'SELECT * FROM artist WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1',
      [formData.user_id]
    ) as ArtistRow[]

    if (!createdProfile || createdProfile.length === 0) {
      throw new Error('Failed to retrieve created profile')
    }

    const artistId = createdProfile[0].id

    // Create audit log
    // await query(
    //   `INSERT INTO artist_profiles_audit (
    //     artist_id, user_id, action, changed_fields, created_at
    //   ) VALUES (?, ?, 'CREATE', ?, NOW())`,
    //   [artistId, formData.user_id, JSON.stringify({ new_data: formData })]
    // )

    // Update user role to artist
    // await query(
    //   'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
    //   ['artist', formData.user_id]
    // )

    revalidatePath('/dashboard')
    revalidatePath('/artist-profile')

    return { success: true, data: createdProfile[0] }
  } catch (error) {
    console.error('Database error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create profile' 
    }
  }
}



// utils
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}