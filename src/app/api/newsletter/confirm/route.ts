import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';

interface MailingListRow extends RowDataPacket {
  id: string;
  email: string;
  status: string;
  confirmation_token_expires_at: Date;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/newsletter/error?reason=invalid_token', request.url));
  }

  try {
    const subscribers = await query(
      `SELECT id, email, status, confirmation_token_expires_at 
       FROM mailing_list 
       WHERE confirmation_token = ? 
       AND deleted_at IS NULL`,
      [token]
    ) as MailingListRow[];

    if (subscribers.length === 0) {
      return NextResponse.redirect(new URL('/newsletter/error?reason=not_found', request.url));
    }

    const subscriber = subscribers[0];

    // Verificar si el token expiró
    if (new Date(subscriber.confirmation_token_expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/newsletter/error?reason=expired', request.url));
    }

    // Activar suscripción
    await query(
      `UPDATE mailing_list 
       SET status = 'active',
           confirmed_at = NOW(),
           confirmation_token = NULL,
           confirmation_token_expires_at = NULL,
           updated_at = NOW()
       WHERE id = ?`,
      [subscriber.id]
    );

    // Redirigir a página de éxito
    return NextResponse.redirect(new URL('/newsletter/confirmed', request.url));

  } catch (error) {
    console.error('Confirmation error:', error);
    return NextResponse.redirect(new URL('/newsletter/error?reason=server_error', request.url));
  }
}
