import { query } from '@/lib/db';
import { requireApiKey } from '@/lib/security';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/events/[id]'>) {

  const authError = requireApiKey(_req);
  if (authError) return authError;

  const { id } = await ctx.params

  try {
    const rows = await query(`SELECT 
      e.name              AS event_name,
      e.start_date_time,
      e.end_date_time,
      e.event_type,
      e.description,
      e.short_description,
      e.doors_open_time,
      e.age_restriction,
      e.categories,
      e.tags,
      e.event_policies,
      e.remaining_capacity,
      e.media_urls,

      v.name              AS venue_name,
      v.address           AS venue_address,
      v.city              AS venue_city,
      v.slug              AS venue_slug,
      
      ael.performance_type,
      ael.stage,
      
      a.name              AS artist_name,
      a.slug              AS artist_slug,
      a.genres            AS artist_genres

    FROM artist_event_link ael
    INNER JOIN event  e ON ael.event_id  = e.id
    INNER JOIN venue  v ON e.venue_id    = v.id
    INNER JOIN artist a ON ael.artist_id = a.id
    WHERE e.id = ?
    AND e.deleted_at IS NULL
    AND ael.status = 'confirmed'
    ORDER BY e.start_date_time ASC, ael.performance_order ASC`, [id]) as any[]

    // No rows — event not found
    if (!rows.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Sanitize — collapse repeated event/venue rows into one object with artists array
    const first = rows[0]
    const event = {
      name:            first.event_name,
      start_date_time: first.start_date_time,
      end_date_time:   first.end_date_time,
      event_type:      first.event_type,
      description:      first.description,
      short_description: first.short_description,
      doors_open_time:  first.doors_open_time,
      age_restriction:  first.age_restriction,
      categories:       first.categories,
      tags:             first.tags,
      policies:         first.policies,
      remaining_capacity:first.remaining_capacity,
      media:            first.media_urls,
       

      venue: {
        name:     first.venue_name,
        address:  first.venue_address,
        city:     first.venue_city,
        slug:     first.venue_slug
      },

      artists: rows.map(row => ({
        artist_name:         row.artist_name,
        artist_slug:         row.artist_slug,
        artist_genres:       row.artist_genres,
        performance_type:    row.performance_type,
        stage:               row.stage
      }))
    }

    return NextResponse.json({ event });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}