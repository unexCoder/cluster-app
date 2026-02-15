'use server'

import { RowDataPacket } from 'mysql2'
import { query } from '@/lib/db' // adjust to your actual db import

interface ReceivedEmailRow extends RowDataPacket {
  id: string
  resend_email_id: string | null
  resend_message_id: string | null
  from_address: string
  to_addresses: string | string[]
  cc_addresses: string | string[] | null
  bcc_addresses: string | string[] | null
  reply_to: string | string[] | null
  subject: string | null
  body_text: string | null
  headers: string | Record<string, string> | null
  attachments: string | unknown[] | null
  webhook_type: string
  sent_at: string | null
  received_at: string
}

export async function fetchReceivedEmailsAction() {
  try {
    const rows = await query<ReceivedEmailRow[]>(`
      SELECT
        id, resend_email_id, resend_message_id,
        from_address, to_addresses, cc_addresses,
        bcc_addresses, reply_to, subject,
        body_text, headers, attachments,
        webhook_type, sent_at, received_at
      FROM received_emails
      ORDER BY received_at DESC
      LIMIT 100
    `)

    const parsed = rows.map((row: ReceivedEmailRow) => ({
      id:                row.id,
      from_address:      row.from_address,
      webhook_type:      row.webhook_type,
      received_at:       row.received_at,
      resend_email_id:   row.resend_email_id   ?? undefined,
      resend_message_id: row.resend_message_id ?? undefined,
      subject:           row.subject           ?? undefined,
      body_text:         row.body_text         ?? undefined,
      sent_at:           row.sent_at           ?? undefined,
      to_addresses:      parseJsonField<string[]>(row.to_addresses,  []),
      cc_addresses:      parseJsonField<string[]>(row.cc_addresses,  []),
      bcc_addresses:     parseJsonField<string[]>(row.bcc_addresses, []),
      reply_to:          parseJsonField<string[]>(row.reply_to,      []),
      attachments:       parseJsonField<unknown[]>(row.attachments,  []),
      headers:           parseJsonField<Record<string, string>>(row.headers, {}),
    }))

    return { success: true, emails: parsed }
  } catch (err) {
    console.error('fetchReceivedEmailsAction error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      emails: [],
    }
  }
}

// mysql2 sometimes returns JSON columns already parsed, sometimes as strings
function parseJsonField<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') {
    try { return JSON.parse(value) } catch { return fallback }
  }
  return value as T
}