// app/api/newsletter/unsubscribe/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface MailingListRow {
  id: string;
  email: string;
  status: string;
}

function redirectWithReason(request: Request, reason: string) {
  const url = new URL('/unsubscribe', request.url);
  url.searchParams.set('reason', reason);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  console.log(`[Unsubscribe][${requestId}] Request received`, { email });

  if (!email) {
    return redirectWithReason(request, "missing_email");
  }

  // Decodificar el email por si viene URL encoded
  const decodedEmail = decodeURIComponent(email);

  try {
    const rows = await query(
      `SELECT id, email, status
       FROM mailing_list
       WHERE email = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [decodedEmail]
    ) as MailingListRow[];

    const subscriber = rows[0] ?? null;

    console.log(`[Unsubscribe][${requestId}] Subscriber lookup`, {
      found: !!subscriber,
      status: subscriber?.status,
      email: subscriber?.email
    });

    if (!subscriber) {
      return redirectWithReason(request, "not_found");
    }

    // Si ya está unsubscribed, redirigir a éxito de todos modos
    if (subscriber.status === "unsubscribed") {
      console.log(`[Unsubscribe][${requestId}] Already unsubscribed`);
      return NextResponse.redirect(
        new URL('/unsubscribe?reason=already_unsubscribed', request.url)
      );
    }

    // Actualizar a unsubscribed
    const updateResult = await query(
      `UPDATE mailing_list
       SET status = 'unsubscribed',
           unsubscribed_at = NOW(),
           updated_at = NOW()
       WHERE id = ?`,
      [subscriber.id]
    ) as any;

    console.log(`[Unsubscribe][${requestId}] Update result`, {
      affectedRows: updateResult?.affectedRows,
      email: subscriber.email
    });

    if (updateResult?.affectedRows === 0) {
      return redirectWithReason(request, "update_failed");
    }

    console.log(`[Unsubscribe][${requestId}] Successfully unsubscribed`, {
      email: subscriber.email
    });

    return NextResponse.redirect(
      new URL('/unsubscribe?reason=success', request.url)
    );

  } catch (error) {
    console.error(`[Unsubscribe][${requestId}] Unexpected error`, error);
    return redirectWithReason(request, "server_error");
  }
}