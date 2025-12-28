// src/lib/db.ts
import mysql from 'mysql2/promise';
import type { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// The pool will handle thousands of queries efficiently! 
// Just adjust DB_CONNECTION_LIMIT based on your traffic.
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {

    // // 🔍 COMPREHENSIVE DEBUG
    // console.log('==========================================');
    // console.log('🔍 FULL ENVIRONMENT DEBUG:');
    // console.log('==========================================');
    // console.log('DB_HOST:', process.env.DB_HOST);
    // console.log('DB_PORT:', process.env.DB_PORT);
    // console.log('DB_USER:', process.env.DB_USER);
    // console.log('DB_NAME:', process.env.DB_NAME);
    // console.log('DB_PASSWORD (first 3 chars):', process.env.DB_PASSWORD?.substring(0, 3) + '***');
    // console.log('DB_PASSWORD length:', process.env.DB_PASSWORD?.length);
    // console.log('==========================================');
    // console.log('DB_PASSWORD BUFFER',Buffer.from(process.env.DB_PASSWORD || '').toString('hex'));
    // console.log('App sees:', Buffer.from(process.env.DB_PASSWORD || '').toString('hex'));
    // console.log('==========================================');
    // // Check for undefined values
    // if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    //   console.error('❌ MISSING ENVIRONMENT VARIABLES!');
    //   console.error('This will cause connection to fail!');
    // }
    
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: '-03:00', // set timezone for every poll 
      // POOL SETTINGS
      waitForConnections: true,   // Wait if no connections available
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'), // Max concurrent connections
      maxIdle: 10,        // Max idle connections
      idleTimeout: 60000, // Close idle connections after 60s
      queueLimit: 0,      // Unlimited queue
      // PERFORMANCE
      enableKeepAlive: true,      // Keep TCP connection alive
      keepAliveInitialDelay: 0,   // Start keep-alive immediately
      // Connection health checks
      connectTimeout: 10000,      // 10s to establish connection
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
  try {
    const pool = getPool();
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
  } catch (error: any) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sql: error.sql,
      sqlState: error.sqlState,
    });
    throw error;
  }
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