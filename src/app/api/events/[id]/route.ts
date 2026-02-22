import { requireApiKey } from '@/lib/security';
import { NextResponse, type NextRequest } from 'next/server'
import { getEventFrontDataById, getEventFrontDataBySlug } from '@/app/actions/events';

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/events/[id]'>) {

  const authError = requireApiKey(_req);
  if (authError) return authError;

  const { id } = await ctx.params

  try {
    // UUID regex pattern (matches v4 UUIDs)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    let event;
    
    if (uuidRegex.test(id)) {
      // Fetch by UUID
      event = await getEventFrontDataById(id);
    } else {
      // Fetch by slug
      event = await getEventFrontDataBySlug(id);
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
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