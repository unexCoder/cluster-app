import { query } from '@/lib/db';
import { requireApiKey } from '@/lib/security';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  
  // API KEY CHECK (prod only)
  const authError = requireApiKey(request);
  if (authError) return authError;

  try {
    const users = await query('SELECT * FROM users');
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

