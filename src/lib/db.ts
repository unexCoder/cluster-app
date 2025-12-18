// src/lib/db.ts
import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// The pool will handle thousands of queries efficiently! 
// Just adjust DB_CONNECTION_LIMIT based on your traffic.
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      maxIdle: 10, // Max idle connections
      idleTimeout: 60000, // Close idle connections after 60s
      queueLimit: 0, // Unlimited queue
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // Connection health checks
      connectTimeout: 10000,
      // Prevent connection drops
      charset: 'utf8mb4',
      ssl: {
        rejectUnauthorized: false
      }

    });
    
    console.log('✅ Database connection pool created and running');
  }
  return pool;
}

export async function query<T extends RowDataPacket[] | RowDataPacket[][] | ResultSetHeader>(
  sql: string, 
  params?: any[]
): Promise<T> {
  const pool = getPool();
  const [rows] = await pool.execute<T>(sql, params);
  return rows;
}

export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}