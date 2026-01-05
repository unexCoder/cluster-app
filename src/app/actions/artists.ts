'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

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