'use server'

import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

interface Profile extends RowDataPacket {
  id: string
  email: string
  email_verified_at: Date
  phone: string
  phone_verified_at: Date
  password_hash: string
  first_name: string
  last_name: string
  ssn_encrypted: string
  role: string
  status: string
  last_login_at: Date
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

export async function fetchProfileAction(id: string) {
  try {
    const profile = await query('SELECT * FROM users WHERE id = ?', [id]) as Profile[];
    return { success: true, profile: profile[0] || null };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to fetch profile', profile: null };
  }
}

export async function updateProfileAction(userId: string, data: UpdateProfileData) {
  try {
    // Construir query dinámicamente solo con campos proporcionados
    const fields: string[] = [];
    const values: any[] = [];

    if (data.first_name) {
      fields.push('first_name = ?');
      values.push(data.first_name);
    }
    if (data.last_name) {
      fields.push('last_name = ?');
      values.push(data.last_name);
    }
    if (data.phone) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.email) {
      fields.push('email = ?');
      values.push(data.email);
    }

    if (fields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }

    // Agregar userId al final
    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    
    await query(sql, values);

    // Obtener perfil actualizado
    const result = await query('SELECT * FROM users WHERE id = ?', [userId]) as RowDataPacket[];
    
    return { 
      success: true, 
      message: 'Profile updated successfully',
      profile: result[0] 
    };
  } catch (error: any) {
    console.error('Database error:', error);
    
    // Manejar error de email duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Email already exists' };
    }
    
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function changePasswordAction(
  userId: string, 
  currentPassword: string, 
  newPassword: string
) {
  try {
    // Obtener el usuario con su contraseña actual
    const users = await query(
      'SELECT id, password_hash FROM users WHERE id = ?', 
      [userId]
    ) as Profile[];

    if (!users || users.length === 0) {
      return { success: false, error: 'User not found' };
    }

    const user = users[0];

    // Verificar que la contraseña actual sea correcta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isPasswordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validar nueva contraseña
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long' };
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    await query(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );

    return { 
      success: true, 
      message: 'Password changed successfully' 
    };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}