
'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { revalidatePath } from 'next/cache'

export interface EventArtistPerformanceRow extends RowDataPacket {
  id: string
  event_id: string
  artist_id: string
  performance_type: 'live_set' | 'dj_set' | 'a/v_set' | 'visuals' | 'live_cinema' | 'sound_installation' | 'other'
  performance_order: number
  start_time: Date | null
  end_time: Date | null
  set_duration_minutes: number | null
  stage: string | null
  billing_position: 'headliner' | 'co_headliner' | 'support' | 'opener' | null
  rider_confirmed: boolean
  soundcheck_time: Date | null
  backstage_access: 'full' | 'limited' | 'none'
  notes: string | null
  created_at: Date
  updated_at: Date
}

interface CreateEventArtistPerformanceData {
  event_id: string
  artist_id: string
  performance_type: 'live_set' | 'dj_set' | 'a/v_set' | 'visuals' | 'live_cinema' | 'sound_installation' | 'other'
  performance_order: number
  start_time?: string | null
  end_time?: string | null
  set_duration_minutes?: number | null
  stage?: string | null
  billing_position?: 'headliner' | 'co_headliner' | 'support' | 'opener'
  rider_confirmed?: boolean
  soundcheck_time?: string | null
  backstage_access?: 'full' | 'limited' | 'none'
  notes?: string | null
}

export async function fetchEventArtistPerformancesAction() {
  try {
    const performances = await query(
      'SELECT * FROM artist_event_link;'
    ) as EventArtistPerformanceRow[]
    return { success: true, performances }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, error: 'Failed to fetch performances', performances: [] }
  }
}

export async function fetchPerformancesByEventIdAction(eventId: string) {
  try {
    const performances = await query(
      'SELECT * FROM artist_event_link WHERE event_id = ? ORDER BY performance_order ASC',
      [eventId]
    ) as EventArtistPerformanceRow[]
    return { success: true, performances }
  } catch (error) {
    console.error('Error fetching performances by event:', error)
    return { success: false, error: 'Failed to fetch performances', performances: [] }
  }
}

export async function fetchPerformancesByArtistIdAction(artistId: string) {
  try {
    const performances = await query(
      'SELECT * FROM artist_event_link WHERE artist_id = ? ORDER BY start_time ASC',
      [artistId]
    ) as EventArtistPerformanceRow[]
    return { success: true, performances }
  } catch (error) {
    console.error('Error fetching performances by artist:', error)
    return { success: false, error: 'Failed to fetch performances', performances: [] }
  }
}

export async function getEventArtistPerformanceByIdAction(performanceId: string) {
  try {
    const result = await query(
      'SELECT * FROM artist_event_link WHERE id = ? LIMIT 1',
      [performanceId]
    ) as EventArtistPerformanceRow[]

    if (result.length === 0) {
      return { success: false, error: 'Performance not found', performance: null }
    }

    return { success: true, performance: result[0] }
  } catch (error) {
    console.error('Error fetching performance:', error)
    return { success: false, error: 'Failed to fetch performance', performance: null }
  }
}

export async function createEventArtistPerformanceAction(data: CreateEventArtistPerformanceData) {
  try {
    const performanceId = crypto.randomUUID()

    const insertQuery = `
      INSERT INTO artist_event_link (
        id,
        event_id,
        artist_id,
        performance_type,
        performance_order,
        start_time,
        end_time,
        set_duration_minutes,
        stage,
        billing_position,
        rider_confirmed,
        soundcheck_time,
        backstage_access,
        notes,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `

    await query(insertQuery, [
      performanceId,
      data.event_id,
      data.artist_id,
      data.performance_type,
      data.performance_order,
      data.start_time ?? null,
      data.end_time ?? null,
      data.set_duration_minutes ?? null,
      data.stage ?? null,
      data.billing_position ?? 'support',
      data.rider_confirmed ? 1 : 0,
      data.soundcheck_time ?? null,
      data.backstage_access ?? 'limited',
      data.notes ?? null,
    ])

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Performance created successfully', performanceId }
  } catch (error) {
    console.error('Error creating performance:', error)
    return { success: false, error: 'Failed to create performance' }
  }
}

export async function updateEventArtistPerformanceAction(
  performanceId: string,
  data: Partial<CreateEventArtistPerformanceData>
) {
  try {
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (updates.length === 0) {
      return { success: false, error: 'No fields to update' }
    }

    updates.push('updated_at = NOW()')
    values.push(performanceId)

    const updateQuery = `
      UPDATE artist_event_link
      SET ${updates.join(', ')}
      WHERE id = ?
    `

    await query(updateQuery, values)

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Performance updated successfully' }
  } catch (error) {
    console.error('Error updating performance:', error)
    return { success: false, error: 'Failed to update performance' }
  }
}

export async function deleteEventArtistPerformanceAction(performanceId: string) {
  try {
    await query(
      'DELETE FROM artist_event_link WHERE id = ?',
      [performanceId]
    )

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Performance deleted successfully' }
  } catch (error) {
    console.error('Error deleting performance:', error)
    return { success: false, error: 'Failed to delete performance' }
  }
}

export async function deletePerformancesByEventIdAction(eventId: string) {
  try {
    await query(
      'DELETE FROM artist_event_link WHERE event_id = ?',
      [eventId]
    )

    revalidatePath('/dashboard/events')

    return { success: true, message: 'Performances deleted successfully' }
  } catch (error) {
    console.error('Error deleting performances for event:', error)
    return { success: false, error: 'Failed to delete performances' }
  }
}