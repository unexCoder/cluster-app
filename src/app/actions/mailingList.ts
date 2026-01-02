'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface MailingListRow extends RowDataPacket {
  id: string
  email: string
  name: string
  status: string
  suscribed_at?: string
  confirmed_at?: string
  ip_address?: string
  user_agent?: string
}

export async function fetchMailingListAction() {
  try {
    const mailing_list = await query('SELECT * FROM mailing_list') as MailingListRow[];
    return { success: true, mailing_list };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch mailing list', mailing_list: [] };
  }
}