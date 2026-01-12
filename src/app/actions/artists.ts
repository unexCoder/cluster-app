'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';
import { ArtistProfileCreateDTO } from '../../../types/artists'; 

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
  popularity_score?: number
  is_verified?: number
  verified_at?: string
  verification_method?: string
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
    // const profile = await query('SELECT * FROM artist WHERE user_id = ? AND deleted_at = NULL', [id]) as ArtistRow[];
    const profile = await query('SELECT * FROM artist WHERE user_id = ?', [id]) as ArtistRow[];
    return { success: true, profile: profile || null };
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
  formData: ArtistProfileCreateDTO
): Promise<ActionResult> {
  try {
    // Check if user already has a profile
    const existingProfile:[] = await query(
      'SELECT id FROM artist WHERE name = ? AND deleted_at IS NULL',
      [formData.name]
    )

    if (existingProfile && existingProfile.length > 0) {
      return { success: false, error: 'Artist name already exists' }
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

export async function updateArtistProfileAction(
  formData: ArtistProfileCreateDTO & { id: string }
): Promise<ActionResult> {
  try {
    // Verify the artist exists and belongs to the user
    const existingArtist = await query(
      'SELECT id, user_id, name, slug FROM artist WHERE id = ? AND deleted_at IS NULL',
      [formData.id]
    ) as ArtistRow[]

    if (!existingArtist || existingArtist.length === 0) {
      return { success: false, error: 'Artist profile not found' }
    }

    // Verify ownership
    if (existingArtist[0].user_id !== formData.user_id) {
      return { success: false, error: 'Unauthorized to update this profile' }
    }

    // Check if name is being changed and if new name already exists
    if (existingArtist[0].name !== formData.name) {
      const nameExists = await query(
        'SELECT id FROM artist WHERE name = ? AND id != ? AND deleted_at IS NULL',
        [formData.name, formData.id]
      ) as ArtistRow[]

      if (nameExists && nameExists.length > 0) {
        return { success: false, error: 'Artist name already exists' }
      }

      // Generate new slug if name changed
      const baseSlug = generateSlug(formData.name)
      let slug = baseSlug
      let counter = 0

      while (true) {
        const slugExists = await query(
          'SELECT id FROM artist WHERE slug = ? AND id != ? AND deleted_at IS NULL',
          [slug, formData.id]
        ) as ArtistRow[]
        
        if (!slugExists || slugExists.length === 0) break
        counter++
        slug = `${baseSlug}-${counter}`
      }

      // Update with new slug
      formData.slug = slug
    } else {
      // Keep existing slug
      formData.slug = existingArtist[0].slug
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

    // Update artist profile
    await query(
      `UPDATE artist SET
        name = ?,
        slug = ?,
        stage_name = ?,
        picture_url = ?,
        bio = ?,
        genres = ?,
        contact_info = ?,
        social_links = ?,
        technical_requirements = ?,
        rider_url = ?,
        presskit_url = ?,
        updated_at = NOW()
      WHERE id = ? AND deleted_at IS NULL`,
      [
        formData.name,
        formData.slug,
        formData.stage_name || null,
        formData.picture_url || null,
        formData.bio || null,
        genres,
        contactInfo,
        socialLinks,
        formData.technical_requirements || null,
        formData.rider_url || null,
        formData.presskit_url || null,
        formData.id
      ]
    )

    // Get updated profile
    const updatedProfile = await query(
      'SELECT * FROM artist WHERE id = ? AND deleted_at IS NULL',
      [formData.id]
    ) as ArtistRow[]

    if (!updatedProfile || updatedProfile.length === 0) {
      throw new Error('Failed to retrieve updated profile')
    }

    // Create audit log (optional - uncomment if you have audit table)
    // await query(
    //   `INSERT INTO artist_profiles_audit (
    //     artist_id, user_id, action, changed_fields, created_at
    //   ) VALUES (?, ?, 'UPDATE', ?, NOW())`,
    //   [formData.id, formData.user_id, JSON.stringify({ updated_data: formData })]
    // )

    revalidatePath('/dashboard')
    revalidatePath('/artist-profile')
    revalidatePath(`/artist/${formData.slug}`)

    return { success: true, data: updatedProfile[0] }
  } catch (error) {
    console.error('Database error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    }
  }
}


export async function deleteArtistProfileAction(artistId: string): Promise<ActionResult> {
  try {
    // Soft delete - set deleted_at timestamp
    await query(
      'UPDATE artist SET deleted_at = NOW() WHERE id = ?',
      [artistId]
    )

    revalidatePath('/dashboard')
    revalidatePath('/artist-profile')

    return { success: true }
  } catch (error) {
    console.error('Database error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete profile' 
    }
  }
}

export async function activateArtistProfileAction(artistId: string): Promise<ActionResult> {
  try {
    // Soft delete - set deleted_at timestamp
    await query(
      'UPDATE artist SET deleted_at = NULL WHERE id = ?',
      [artistId]
    )

    revalidatePath('/dashboard')
    revalidatePath('/artist-profile')

    return { success: true }
  } catch (error) {
    console.error('Database error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to activate profile' 
    }
  }
}

export async function fetchArtistByIdAction(artistId: string) {
  try {
    const profile = await query(
      'SELECT * FROM artist WHERE id = ? AND deleted_at IS NULL', 
      [artistId]
    ) as ArtistRow[];
    
    return { success: true, profile: profile[0] || null };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch artist', profile: null };
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