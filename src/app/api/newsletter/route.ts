// app/api/newsletter/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const maxDuration = 10;
export const dynamic = 'force-dynamic';

interface MailingListRow {
  id: string;
  status: string;
}

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    console.log('[Newsletter] Request received');
    
    // 1. Parse body
    const body = await request.json().catch(() => ({}));
    const { email, name, source } = body;
    console.log('[Newsletter] Email:', email);

    // 2. Validación
    if (!email || !email.includes('@')) {
      console.log('[Newsletter] Invalid email');
      return NextResponse.json(
        { error: 'Email inválido' }, 
        { status: 400 }
      );
    }

    // 3. Headers info
    const headers = request.headers;
    const ipAddress = headers.get('x-forwarded-for')?.split(',')[0] || 
                      headers.get('x-real-ip') || 
                      null;
    const userAgent = headers.get('user-agent') || null;
    const referer = headers.get('referer') || null;

    console.log('[Newsletter] IP:', ipAddress, 'Source:', source);

    // 4. Generar token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 5. Verificar si existe
    console.log('[Newsletter] Checking existing subscriber...');
    const existing = await query(
      'SELECT id, status FROM mailing_list WHERE email = ? AND deleted_at IS NULL',
      [email]
    ) as MailingListRow[];

    console.log('[Newsletter] Existing check result:', existing.length > 0);

    if (existing.length > 0) {
      const subscriber = existing[0];
      
      if (subscriber.status === 'active') {
        console.log('[Newsletter] Already active subscriber');
        return NextResponse.json(
          { message: 'Ya estás suscrito' },
          { status: 200 }
        );
      }
      
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
        sendWelcomeEmailAsync(email, confirmationToken);
        
        return NextResponse.json({ 
          success: true,
          message: 'Revisa tu email para confirmar la suscripción'
        });
      }
    }

    // 6. Insertar nuevo suscriptor
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
        email,
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
    sendWelcomeEmailAsync(email, confirmationToken);

    const elapsed = Date.now() - startTime;
    console.log(`[Newsletter] Success in ${elapsed}ms`);

    return NextResponse.json({ 
      success: true,
      message: '¡Gracias por suscribirte! Revisa tu email para confirmar.'
    }, { status: 201 });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[Newsletter] Error after ${elapsed}ms:`, error);
    
    // Log más detallado del error
    if (error instanceof Error) {
      console.error('[Newsletter] Error name:', error.name);
      console.error('[Newsletter] Error message:', error.message);
      console.error('[Newsletter] Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la suscripción',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

// Función auxiliar para enviar emails sin bloquear
async function sendWelcomeEmailAsync(email: string, token: string) {
  try {
    console.log('[Newsletter] Attempting to send welcome email to:', email);
    
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
    console.error('[Newsletter] Failed to send welcome email:', error);
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