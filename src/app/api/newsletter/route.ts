// app/api/newsletter/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { newsletterSubscribeSchema } from "@/lib/validators/newsletter";
import { formatZodError } from '@/lib/zod';


export const maxDuration = 10;

interface MailingListRow {
  id: string;
  status: "active" | "pending_confirmation" | "unsubscribed";
}

export async function POST(request: Request) {
  const startTime = Date.now();
  const requestId =
    request.headers.get("x-request-id") ??
    crypto.randomUUID();

  try {
    // debug logs
    console.log(`[Newsletter][${requestId}] Request received`);
    // console.warn(`[Newsletter][${requestId}] Validation failed`, issues);
    // console.error(`[Newsletter][${requestId}] DB error`, error);

    // ── parse body ──────────────────────────────
    // ── w/new safeParse zog ---------------------
    const body = await request.json().catch(() => ({}));
    const validation = newsletterSubscribeSchema.safeParse(body);
    // const { email, name, source } = newsletterSubscribeSchema.parse(body);

    if (!validation.success) {
      // server side visibility
      console.warn(`[Newsletter][${requestId}] Validation failed`, {
        issues: validation.error.issues,
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            issues: formatZodError(validation.error),
          },
          meta: {
            requestId
          },
        },
        { status: 400 }
      );
    }
    const { email, name, source } = validation.data;
    const normalEmail = email.trim().toLowerCase();
    console.log(`[Newsletter][${requestId}] Email:`, normalEmail);


    // ── headers info ──────────────────────────────
    const headers = request.headers;
    const ipAddress = headers.get('x-forwarded-for')?.split(',')[0] ||
      headers.get('x-real-ip') ||
      null;
    const userAgent = headers.get('user-agent') || null;
    const referer = headers.get('referer') || null;
    console.log('[Newsletter] IP:', ipAddress, 'Source:', source);

    // ── token gen ──────────────────────────────
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // ── check duplicated ──────────────────────────────
    console.log(`[Newsletter][${requestId}] Checking existing subscriber...`);

    const existing = await query(
      'SELECT id, status FROM mailing_list WHERE email = ? AND deleted_at IS NULL',
      [normalEmail]
    ) as MailingListRow[];

    console.log('[Newsletter] Existing check result:', existing.length > 0);

    if (existing.length > 0) {
      const subscriber = existing[0];

      if (subscriber.status === 'active') {
        console.log('[Newsletter] Already active subscriber');
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ALREADY_SUBSCRIBED",
              message: "Ya estás suscripto"
            },
            meta: {
              requestId
            },
          },
          { status: 409 }
        );
      }

      // ── re suscribe if existing unsuscribed  ─────────
      if (subscriber.status === 'unsubscribed') {
        console.log('[Newsletter] Reactivating unsubscribed user');
        await query(
          `UPDATE mailing_list 
            SET status = 'pending_confirmation',
                confirmation_token = ?,
                confirmation_token_expires_at = ?,
                subscribed_at = NOW(),
                unsubscribed_at = NULL,
                updated_at = NOW()
            WHERE id = ?`,
          [confirmationToken, tokenExpiry, subscriber.id]
        );

        // Enviar email de forma asíncrona sin esperar
        sendWelcomeEmailAsync(normalEmail, confirmationToken, requestId);

        return NextResponse.json({
          success: true,
          data: {
            message: 'Revisa tu email para confirmar la suscripción'
          },
          meta: {
            requestId,
          },
        });
      }
    }

    // ── insert new subscriber ─────────────────────
    console.log('[Newsletter] Inserting new subscriber...');
    const id = crypto.randomUUID();

    await query(
      `INSERT INTO mailing_list (
        id,
        email,
        name,
        status,
        source,
        source_url,
        referrer,
        ip_address,
        user_agent,
        confirmation_token,
        confirmation_token_expires_at,
        subscribed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        normalEmail,
        name || null,
        'pending_confirmation',
        source || 'newsletter_widget',
        referer,
        referer,
        ipAddress,
        userAgent,
        confirmationToken,
        tokenExpiry
      ]
    );

    console.log('[Newsletter] Subscriber inserted successfully');

    // Enviar email de forma asíncrona sin bloquear la respuesta
    sendWelcomeEmailAsync(normalEmail, confirmationToken, requestId);

    const elapsed = Date.now() - startTime;
    console.log(`[Newsletter] Success in ${elapsed}ms`);

    return NextResponse.json({
      success: true,
      data: {
        message: '¡Gracias por suscribirte! Revisa tu email para confirmar.'
      },
      meta: {
        requestId,
      },
    }, { status: 201 });

  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error(`[Newsletter] Error after ${elapsed}ms:`, error);

    // MySQL unique constraint
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DUPLICATE_SUBSCRIPTION",
            message: "User already exists",
          },
        }, { status: 409 }
      );
    }

    console.error("[Newsletter] Unexpected error", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al procesar la suscripción",
        },
        meta: {
          requestId
        },
      },
      { status: 500 }
    );
  }
}

// Función auxiliar para enviar emails sin bloquear
async function sendWelcomeEmailAsync(email: string, token: string, requestId: string) {
  try {
    console.log(`[Email][${requestId}] Attempting to send welcome email`, {
      email,
    });
    // console.log(`[Email][${requestId}] Sending welcome email`);

    // Importación dinámica para evitar errores de módulo
    const { sendWelcomeEmail } = await import('@/lib/resend').catch(() => ({
      sendWelcomeEmail: null
    }));

    if (!sendWelcomeEmail) {
      console.warn('[Newsletter] sendWelcomeEmail not available, skipping email');
      return;
    }

    await sendWelcomeEmail(email, token);
    console.log('[Newsletter] Welcome email sent successfully');

  } catch (error) {
    // No fallar la request si el email falla
    console.error(`[Email][${requestId}] Failed to send welcome email`, error);
    console.error('[Newsletter] Email error details:', {
      email,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Endpoint GET para verificar estado
export async function GET() {
  try {
    const result = await query(
      'SELECT COUNT(*) as total FROM mailing_list WHERE deleted_at IS NULL'
    ) as Array<{ total: number }>;

    return NextResponse.json({
      success: true,
      totalSubscribers: result[0].total
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}