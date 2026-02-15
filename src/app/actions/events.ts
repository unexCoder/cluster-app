'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache';

interface EventRow extends RowDataPacket {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  venue_id: string
  start_date_time: Date
  end_date_time: Date
  doors_open_time: Date
  timezone: string 
  status: string
  is_featured: number  
  age_restriction: string
  event_type: string
  categories: string
  tags: string
  media_urls: string
  event_polices: string
  remaining_capacity: string
  created_by: string
  created_at: Date
  updated_at: Date
  deleted_at: Date  
}

interface CreateEventData {
  name: string
  description: string
  short_description?: string
  venue_id: string
  start_date_time: string
  end_date_time: string
  doors_open_time?: string | null
  timezone: string
  status?: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed' | 'sold_out'
  is_featured?: boolean
  age_restriction?: 'all_ages' | '13+' | '16+' | '18+' | '21+'
  event_type: 'concert' | 'festival' | 'workshop' | 'conference' | 'exhibition' | 'party' | 'other'
  categories?: string   // JSON stringified
  tags?: string         // JSON stringified
  media_urls?: string   // JSON stringified
  event_policies?: string // JSON stringified
  remaining_capacity: number
  created_by: string
}

// fetch all events
export async function fetchEventsAction() {
  try {
    const events = await query('SELECT * FROM event') as EventRow[];
    return { success: true, events };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch events', events: [] };
  }
}

// fetch event by id
export async function fetchEventByIdAction(eventId: string) {
  try {
    const result = await query(
      'SELECT * FROM event WHERE id = ? AND deleted_at IS NULL LIMIT 1',
      [eventId]
    ) as EventRow[]
    
    if (result.length === 0) {
      return { success: false, error: 'Event not found', event: null }
    }
    
    return { success: true, event: result[0] }
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch event', event: null }
  }
}

// fetch event by slug
export async function fetchEventBySlugAction(slug: string) {
  try {
    const result = await query(
      'SELECT * FROM event WHERE slug = ? AND deleted_at IS NULL LIMIT 1',
      [slug]
    ) as EventRow[]

    if (result.length === 0) {
      return { success: false, error: 'Event not found', event: null }
    }

    return { success: true, event: result[0] }
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch event', event: null }
  }
}

// fetch event by venue
export async function fetchEventsByVenueAction(venueId: string) {
  try {
    const events = await query(
      'SELECT * FROM event WHERE venue_id = ? AND deleted_at IS NULL ORDER BY start_date_time DESC',
      [venueId]
    ) as EventRow[]

    return { success: true, events }
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch events', events: [] }
  }
}

// create event
export async function createEventAction(data: CreateEventData) {
  try {
    // Generate slug from event name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingEvent = await query(
      'SELECT id FROM event WHERE slug = ? AND deleted_at IS NULL',
      [slug]
    ) as EventRow[]

    let finalSlug = slug

    if (existingEvent.length > 0) {
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      finalSlug = `${slug}-${randomSuffix}`
    }

    const eventId = crypto.randomUUID()

    const params = [
      eventId,
      data.name,
      finalSlug,
      data.description,
      data.short_description ?? null,
      data.venue_id,
      data.start_date_time,
      data.end_date_time,
      data.doors_open_time ?? null,
      data.timezone,
      data.status ?? 'draft',
      data.is_featured ? 1 : 0,
      data.age_restriction ?? 'all_ages',
      data.event_type,
      data.categories ?? null,
      data.tags ?? null,
      data.media_urls ?? null,
      data.event_policies ?? null,
      data.remaining_capacity,
      data.created_by
    ]

    const insertQuery = `
      INSERT INTO event (
        id,
        name,
        slug,
        description,
        short_description,
        venue_id,
        start_date_time,
        end_date_time,
        doors_open_time,
        timezone,
        status,
        is_featured,
        age_restriction,
        event_type,
        categories,
        tags,
        media_urls,
        event_policies,
        remaining_capacity,
        created_by,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

    await query(insertQuery, params)

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Event created successfully', eventId }
  } catch (error) {
    console.error('Error creating event:', error)
    return { success: false, error: 'Failed to create event' }
  }
}

// update event
export async function updateEventAction(eventId: string, data: Partial<CreateEventData>) {
  try {
    const updates: string[] = []
    const values: any[] = []

    const fieldMap: Record<string, string> = {
      name: 'name',
      description: 'description',
      short_description: 'short_description',
      venue_id: 'venue_id',
      start_date_time: 'start_date_time',
      end_date_time: 'end_date_time',
      doors_open_time: 'doors_open_time',
      timezone: 'timezone',
      status: 'status',
      is_featured: 'is_featured',
      age_restriction: 'age_restriction',
      event_type: 'event_type',
      categories: 'categories',
      tags: 'tags',
      media_urls: 'media_urls',
      event_policies: 'event_policies',
      remaining_capacity: 'remaining_capacity'
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && fieldMap[key] && key !== 'created_by') {
        updates.push(`${fieldMap[key]} = ?`)
        // Handle boolean for is_featured
        values.push(key === 'is_featured' ? (value ? 1 : 0) : value)
      }
    })

    if (updates.length === 0) {
      return { success: false, error: 'No fields to update' }
    }

    updates.push('updated_at = NOW()')
    values.push(eventId)

    const updateQuery = `
      UPDATE event
      SET ${updates.join(', ')}
      WHERE id = ? AND deleted_at IS NULL
    `

    await query(updateQuery, values)

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Event updated successfully' }
  } catch (error) {
    console.error('Error updating event:', error)
    return { success: false, error: 'Failed to update event' }
  }
}

// update event status
export async function updateEventStatusAction(
  eventId: string,
  status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed' | 'sold_out'
) {
  try {
    await query(
      'UPDATE event SET status = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [status, eventId]
    )

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Event status updated successfully' }
  } catch (error) {
    console.error('Error updating event status:', error)
    return { success: false, error: 'Failed to update event status' }
  }
}

// delete event (soft delete)
export async function deleteEventAction(eventId: string) {
  try {
    await query(
      'UPDATE event SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [eventId]
    )

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Event deleted successfully' }
  } catch (error) {
    console.error('Error deleting event:', error)
    return { success: false, error: 'Failed to delete event' }
  }
}