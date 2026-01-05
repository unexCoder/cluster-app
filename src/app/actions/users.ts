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

// acción para actualizar rol
export async function updateUserRoleAction(userId: string, newRole: string) {
  try {
    // Validar que el rol sea válido
    const validRoles = ['customer', 'artist', 'staff', 'admin', 'super_admin'];
    if (!validRoles.includes(newRole)) {
      return { success: false, error: 'Invalid role' };
    }

    // Actualizar el rol
    await query(
      'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
      [newRole, userId]
    );

    return { 
      success: true, 
      message: `Role updated to ${newRole}` 
    };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

// acción para actualizar status
export async function updateUserStatusAction(userId: string, newStatus: string) {
  try {
    // Validar que el status sea válido
    const validStatuses = ['active', 'inactive', 'suspended', 'banned'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status' };
    }

    // Actualizar el status
    await query(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
      [newStatus, userId]
    );

    return { 
      success: true, 
      message: `Status updated to ${newStatus}` 
    };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to update status' };
  }
}