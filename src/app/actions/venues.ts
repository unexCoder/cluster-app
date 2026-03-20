'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache'

interface VenuesRow extends RowDataPacket {
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

interface CreateVenueData {
  name: string
  description: string
  capacity: number
  address: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  contact_info: string // JSON stringified
  venue_info: string // JSON stringified
  image_urls: string // JSON stringified
}

export async function fetchVenuesAction() {
  try {
    const venues = await query('SELECT * FROM venue WHERE deleted_at IS NULL;') as VenuesRow[];
    return { success: true, venues };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch venues', venues: [] };
  }
}

export async function createVenueProfileAction(data: CreateVenueData) {
  try {
    // Generate slug from venue name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingVenue = await query(
      'SELECT id FROM venue WHERE slug = ? AND deleted_at IS NULL',
      [slug]
    ) as VenuesRow[]

    let finalSlug = slug
    
    if (existingVenue.length > 0) {
      // Add a random suffix to make slug unique
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      finalSlug = `${slug}-${randomSuffix}`
    }

    // Generate UUID for the venue
    const venueId = crypto.randomUUID()

    const latitude = data.latitude !== null && !isNaN(data.latitude) ? data.latitude : null
    const longitude = data.longitude !== null && !isNaN(data.longitude) ? data.longitude : null
    
    // Insert venue into database
    const insertQuery = `
      INSERT INTO venue (
        id,
        name,
        slug,
        description,
        capacity,
        address,
        city,
        country,
        latitude,
        longitude,
        contact_info,
        venue_info,
        image_urls,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

    await query(insertQuery, [
      venueId,
      data.name,
      finalSlug,
      data.description,
      data.capacity,
      data.address,
      data.city,
      data.country,
      data.latitude,
      data.longitude,
      data.contact_info,
      data.venue_info,
      data.image_urls
    ])

    // Revalidate the venues page
    revalidatePath('/dashboard/venues')
    
    return { success: true, message: 'Venue created successfully', venueId }
  } catch (error) {
    console.error('Error creating venue:', error)
    return { success: false, error: 'Failed to create venue profile' }
  }
}

export async function getVenueByIdAction(venueId: string) {
  try {
    const result = await query(
      'SELECT * FROM venue WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [venueId]
    ) as VenuesRow[]

    if (result.length === 0) {
      return { success: false, error: 'Venue not found', venue: null }
    }

    return { success: true, venue: result[0] }
  } catch (error) {
    console.error('Error fetching venue:', error)
    return { success: false, error: 'Failed to fetch venue', venue: null }
  }
}

export async function getVenueBySlugAction(slug: string) {
  try {
    const result = await query(
      'SELECT * FROM venue WHERE slug = ? AND deleted_at IS NULL LIMIT 1',
      [slug]
    ) as VenuesRow[]

    if (result.length === 0) {
      return { success: false, error: 'Venue not found', venue: null }
    }

    return { success: true, venue: result[0] }
  } catch (error) {
    console.error('Error fetching venue:', error)
    return { success: false, error: 'Failed to fetch venue', venue: null }
  }
}

export async function updateVenueAction(venueId: string, data: Partial<CreateVenueData>) {
  try {
    const updates: string[] = []
    const values: any[] = []

    // Build dynamic UPDATE query based on provided fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'user_id') {
        updates.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (updates.length === 0) {
      return { success: false, error: 'No fields to update' }
    }

    // Add updated_at
    updates.push('updated_at = NOW()')
    
    // Add venueId to values for WHERE clause
    values.push(venueId)

    const updateQuery = `
      UPDATE venue
      SET ${updates.join(', ')}
      WHERE id = ? AND deleted_at IS NULL
    `

    await query(updateQuery, values)

    // Revalidate the venues page
    revalidatePath('/dashboard/venues')
    
    return { success: true, message: 'Venue updated successfully' }
  } catch (error) {
    console.error('Error updating venue:', error)
    return { success: false, error: 'Failed to update venue' }
  }
}

export async function deleteVenueAction(venueId: string) {
  try {
    // Soft delete
    await query(
      'UPDATE venue SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [venueId]
    )

    // Revalidate the venues page
    revalidatePath('/dashboard/venues')
    
    return { success: true, message: 'Venue deleted successfully' }
  } catch (error) {
    console.error('Error deleting venue:', error)
    return { success: false, error: 'Failed to delete venue' }
  }
}

export async function fetchVenuesByUserIdAction(userId: string) {
  try {
    const venues = await query(
      'SELECT * FROM venue WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
      [userId]
    ) as VenuesRow[]
    
    return { success: true, venues }
  } catch (error) {
    console.error('Error fetching user venues:', error)
    return { success: false, error: 'Failed to fetch venues', venues: [] }
  }
}