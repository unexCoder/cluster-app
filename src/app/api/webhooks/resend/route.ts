import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { query } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'email.received') {

      // Fetch full email content using the email_id from the webhook
      const { data: email, error } = await resend.emails.receiving.get(data.email_id);

      if (error) {
        console.error('❌ Failed to fetch email content:', error);
        return NextResponse.json({ received: true, error: error.message });
      }

      console.log('FULL EMAIL:', JSON.stringify(email, null, 2)); // log to inspect full shape

      const record = {
        resend_email_id:   data.email_id         ?? null,
        resend_message_id: data.message_id        ?? null,
        from_address:      data.from              ?? null,
        to_addresses:      JSON.stringify(data.to         ?? []),
        cc_addresses:      JSON.stringify(data.cc         ?? []),
        bcc_addresses:     JSON.stringify(data.bcc        ?? []),
        reply_to:          JSON.stringify(data.reply_to   ?? []),
        subject:           data.subject           ?? null,
        html:              email?.html            ?? null,  // ✅ from full fetch
        body_text:         email?.text            ?? null,  // ✅ from full fetch
        headers:           JSON.stringify(email?.headers      ?? {}),
        attachments:       JSON.stringify(data.attachments    ?? []),
        webhook_type:      type,
        raw_payload:       JSON.stringify(body),
        sent_at:           data.created_at        ?? null,
      };

      try {
        await query(`
          INSERT INTO received_emails (
            resend_email_id, resend_message_id,
            from_address, to_addresses, cc_addresses, bcc_addresses, reply_to,
            subject, html, body_text,
            headers, attachments,
            webhook_type, raw_payload, sent_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE resend_email_id = resend_email_id
        `, Object.values(record));

        console.log('✅ Email logged:', record.resend_email_id);
      } catch (dbError: any) {
        console.error('❌ DB insert failed:', dbError.message);
        return NextResponse.json({ received: true, dbError: dbError.message });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
