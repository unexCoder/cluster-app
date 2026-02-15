import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('FULL PAYLOAD:', JSON.stringify(body, null, 2)); // add this
    console.log('TYPE:', body.type);
    console.log('DATA KEYS:', Object.keys(body.data ?? {}));

    const { type, data } = body;

    if (type === 'email.received') {
      await query(`
        INSERT INTO received_emails (
          resend_email_id,
          resend_message_id,
          from_address,
          to_addresses,
          cc_addresses,
          bcc_addresses,
          reply_to,
          subject,
          html,
          text,
          headers,
          attachments,
          webhook_type,
          raw_payload,
          sent_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (resend_email_id) DO NOTHING  -- prevent duplicate webhooks
      `, [
        data.email_id,
        data.message_id,
        data.from,
        data.to,
        data.cc ?? [],
        data.bcc ?? [],
        data.reply_to ?? [],
        data.subject,
        data.html,
        data.text,
        JSON.stringify(data.headers ?? {}),
        JSON.stringify(data.attachments ?? []),
        type,
        JSON.stringify(body),
        data.created_at ?? null,
      ]);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}