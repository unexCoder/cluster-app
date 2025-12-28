import { query } from '@/lib/db';
import { requireApiKey } from '@/lib/security';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/users/[id]'>) {

  // API KEY CHECK (prod only)
  const authError = requireApiKey(_req);
  if (authError) return authError;

  const { id } = await ctx.params
  try {
      const user = await query(`SELECT * FROM users WHERE id = ?`,[id]);
      return NextResponse.json({ user });
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }
}