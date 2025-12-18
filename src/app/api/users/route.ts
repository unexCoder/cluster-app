import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await query('SELECT * FROM user');
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const result = await query(
//       'INSERT INTO users (name, email) VALUES (?, ?)',
//       [body.name, body.email]
//     );
//     return NextResponse.json({ id: result.insertId }, { status: 201 });
//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create user' },
//       { status: 500 }
//     );
//   }
// }