import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener el último token creado
    const result = await query(
      `SELECT confirmation_token, email 
       FROM mailing_list 
       WHERE status = 'pending_confirmation' 
       AND deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT 1`
    ) as any[];

    if (result.length === 0) {
      return NextResponse.json({ 
        message: 'No hay suscripciones pendientes' 
      });
    }

    const token = result[0].confirmation_token;
    const confirmUrl = `${process.env.APP_URL}/api/mailing-list/confirm?token=${token}`;

    return NextResponse.json({
      email: result[0].email,
      confirmationUrl: confirmUrl,
      message: 'Copia esta URL en tu navegador para confirmar'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}