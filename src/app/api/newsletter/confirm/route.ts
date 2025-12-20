import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface MailingListRow {
  id: string;
  email: string;
  status: 'active' | 'inactive' | 'unsubscribed' | 'bounced' | 'complained' | 'pending_confirmation';
  confirmation_token_expires_at: Date | null;
}

// Cache simple para evitar procesamiento duplicado
  const processingTokens = new Set<string>();
  
function redirectWithReason(request: Request, reason: string) {
  const url = new URL('/error', request.url);
  url.searchParams.set('reason', reason);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const requestId =
    request.headers.get("x-request-id") ??
    crypto.randomUUID();
  const now = Date.now();

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  console.log(`[Confirm][${requestId}] Request received`, { token });

  if (!token) {
    return redirectWithReason(request, "invalid_token");
  }

  // Verificar si ya se está procesando este token
  if (processingTokens.has(token)) {
    console.log(`[Confirm][${requestId}] Token already being processed, waiting...`);
    // Esperar un poco y redirigir a confirmed de todos modos
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.redirect(new URL('/confirmed', request.url));
  }

  // Marcar token como en proceso
  processingTokens.add(token);

  try {
    const rows = await query(
      `SELECT id, email, status, confirmation_token_expires_at
       FROM mailing_list
       WHERE confirmation_token = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [token]
    ) as MailingListRow[];

    const subscriber = rows[0] ?? null;

    if (!subscriber) {
      processingTokens.delete(token);
      return redirectWithReason(request, "not_found");
    }
    
    if (subscriber.status === "active") {
      processingTokens.delete(token);
      return redirectWithReason(request, "already_confirmed");
    }
    
    if (
      !subscriber.confirmation_token_expires_at ||
      subscriber.confirmation_token_expires_at.getTime() < now
    ) {
      processingTokens.delete(token);
      return redirectWithReason(request, "expired");
    }

    await query(
      `UPDATE mailing_list
       SET status = 'active',
           confirmed_at = NOW(),
           confirmation_token = NULL,
           confirmation_token_expires_at = NULL,
           updated_at = NOW()
       WHERE id = ? 
        AND status = 'pending_confirmation'`,
      [subscriber.id]
    );

    console.log(
      `[Confirm][${requestId}] Subscription confirmed`,
      { email: subscriber.email }
    );

    // clean cache
    processingTokens.delete(token);

    return NextResponse.redirect(
      new URL('/confirmed', request.url)
    );

  } catch (error) {
    processingTokens.delete(token);
    console.error(
      `[Confirm][${requestId}] Unexpected error`,
      error
    );

    return redirectWithReason(request, "server_error");
  }
}
