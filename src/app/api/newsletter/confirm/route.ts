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

  console.log('Confirmation request received:', { token }); // Debug

  if (!token) {
    const redirectUrl = new URL('/error', request.url);
    redirectUrl.searchParams.set('reason', 'invalid_token');
    return NextResponse.redirect(redirectUrl);
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
      const redirectUrl = new URL('/error', request.url);
      redirectUrl.searchParams.set('reason', 'not_found');
      return NextResponse.redirect(redirectUrl);
    }

    const subscriber = subscribers[0];

    // Verificar si el token expiró
    if (new Date(subscriber.confirmation_token_expires_at) < new Date()) {
      const redirectUrl = new URL('/error', request.url);
      redirectUrl.searchParams.set('reason', 'expired');
      return NextResponse.redirect(redirectUrl);
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

    console.log('Subscription confirmed:', subscriber.email); // Debug

    // Redirigir a página de éxito
    return NextResponse.redirect(new URL('/confirmed', request.url));

  } catch (error) {
    console.error('Confirmation error:', error);
    const redirectUrl = new URL('/error', request.url);
    redirectUrl.searchParams.set('reason', 'server_error');
    return NextResponse.redirect(redirectUrl);
  }
}
