import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2/promise';
import { sendWelcomeEmail } from '@/lib/resend';

interface MailingListRow extends RowDataPacket {
  id: string;
  status: string;
}

export async function POST(request: Request) {
  try {
    const { email, name, source } = await request.json();
    const headers = request.headers;

    // Validación
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' }, 
        { status: 400 }
      );
    }

    // Generar token de confirmación para double opt-in
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Obtener IP y User Agent
    const ipAddress = headers.get('x-forwarded-for')?.split(',')[0] || 
                      headers.get('x-real-ip') || 
                      null;
    const userAgent = headers.get('user-agent') || null;
    const referer = headers.get('referer') || null;

    // Verificar si el email ya existe
    const result = await query(
      'SELECT id, status FROM mailing_list WHERE email = ? AND deleted_at IS NULL',
      [email]
    ) as MailingListRow[];

    if (result.length > 0) {
      const subscriber = result[0];
      
      // Si ya está activo o confirmado
      if (subscriber.status === 'active') {
        return NextResponse.json(
          { message: 'Ya estás suscrito' },
          { status: 200 }
        );
      }
      
      // Si se había dado de baja, reactivar
      if (subscriber.status === 'unsubscribed') {
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
        
        // Enviar email de confirmación
        await sendWelcomeEmail(email, confirmationToken);
        
        return NextResponse.json({ 
          success: true,
          message: 'Revisa tu email para confirmar la suscripción'
        });
      }
    }

    // Insertar nuevo suscriptor
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

    // Enviar email de confirmación
    await sendWelcomeEmail(email, confirmationToken);

    return NextResponse.json({ 
      success: true,
      message: '¡Gracias por suscribirte!'
    }, { status: 201 });

  } catch (error) {
    console.error('Mailing list subscription error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    );
  }
}