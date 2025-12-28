'use server'
import { RowDataPacket } from "mysql2";
import { query } from "./db";

// lib/user-service.ts
export async function getUserForSession(userId: string) {
  const result = await query<RowDataPacket[]>(
    `SELECT id, email, session_token, last_login, is_active 
     FROM users 
     WHERE id = ? 
     LIMIT 1`,
    [userId]
  );
  return result[0] || null;
}