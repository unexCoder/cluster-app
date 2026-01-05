'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

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

export async function fetchEventsAction() {
  try {
    const events = await query('SELECT * FROM event') as EventRow[];
    return { success: true, events };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch events', events: [] };
  }
}