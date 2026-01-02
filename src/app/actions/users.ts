'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  status: string
  created_at?: string
  last_login_at?: string
}

export async function fetchUsersAction() {
  try {
    const users = await query('SELECT * FROM users') as UserRow[];
    return { success: true, users };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch users', users: [] };
  }
}