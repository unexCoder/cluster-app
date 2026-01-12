'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface VenuesRow extends RowDataPacket {
  id: string
  user_id: string
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

export async function fetchVenuesAction() {
  try {
    const venues = await query('SELECT * FROM venue') as VenuesRow[];
    return { success: true, venues };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch venues', venues: [] };
  }
}