import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { query } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'email.received') {

      const { data: email, error } = await resend.emails.receiving.get(data.email_id);

      if (error) {
        console.error('❌ Failed to fetch email content:', error);
        return NextResponse.json({ received: true, error: error.message });
      }

      // Fetch attachments list to get per-attachment download_url
      const attachmentResponse = await resend.emails.receiving.attachments.list({
        emailId: data.email_id,
      });

      console.log('ATTACHMENT RESPONSE:', JSON.stringify(attachmentResponse, null, 2));

      // Build a map of attachment id -> download_url from the list response
      const attachmentItems: any[] = Array.isArray(attachmentResponse.data)
        ? attachmentResponse.data
        : (attachmentResponse.data as any)?.data ?? [];

      const downloadUrlMap = new Map<string, string>(
        attachmentItems
          .filter((a: any) => a.id && a.download_url)
          .map((a: any) => [a.id, a.download_url])
      );

      // Merge email.attachments metadata with download URLs from the list
      const emailAttachments: any[] = Array.isArray((email as any)?.attachments)
        ? (email as any).attachments
        : [];

      const attachments = emailAttachments.map((a: any) => ({
        id:                  a.id,
        filename:            a.filename,
        content_type:        a.content_type,
        size:                a.size,
        content_disposition: a.content_disposition,
        download_url:        downloadUrlMap.get(a.id) ?? null,
      }));

      console.log('MERGED ATTACHMENTS:', JSON.stringify(attachments, null, 2));

      const record = {
        resend_email_id:   data.email_id               ?? null,
        resend_message_id: data.message_id              ?? null,
        from_address:      data.from                    ?? null,
        to_addresses:      JSON.stringify(data.to       ?? []),
        cc_addresses:      JSON.stringify(data.cc       ?? []),
        bcc_addresses:     JSON.stringify(data.bcc      ?? []),
        reply_to:          JSON.stringify(data.reply_to ?? []),
        subject:           data.subject                 ?? null,
        html:              (email as any)?.html         ?? null,
        body_text:         (email as any)?.text         ?? null,
        headers:           JSON.stringify((email as any)?.headers ?? {}),
        attachments:       JSON.stringify(attachments),
        webhook_type:      type,
        raw_payload:       JSON.stringify(body),
        sent_at:           toMySQLDatetime(data.created_at) ?? null,
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

        console.log(`✅ Email logged: ${record.resend_email_id} with ${attachments.length} attachment(s)`);
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

const toMySQLDatetime = (isoString: string | null | undefined): string | null => {
  if (!isoString) return null;
  return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
};