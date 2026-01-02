import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT 1 as health");
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Health check failed:", {
      code: error.code,
      errno: error.errno,
      message: error.message,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error.message,
        debug: {
          code: error.code,
          errno: error.errno,
        },
      },
      { status: 503 }
    );
  }
}
