import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user by email
    let rows;
    try {
      rows = await query<UserRow[]>(
        "SELECT id, email, password_hash, first_name, last_name, role, status FROM users WHERE email = ? AND status = 'active' LIMIT 1",
        [email.toLowerCase().trim()]
      );
    } catch (dbError: any) {
      console.error("Database query failed in login:", {
        code: dbError.code,
        errno: dbError.errno,
        message: dbError.message,
      });
      return NextResponse.json(
        { 
          error: "Database connection failed. Please try again later.",
          debug: process.env.NODE_ENV === "development" ? dbError.message : undefined
        },
        { status: 503 }
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Check if account is active (already filtered in query)
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    const token = await new SignJWT({ userId: user.id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Update last login (non-blocking)
    query(
      "UPDATE users SET last_login_at = NOW() WHERE id = ?",
      [user.id]
    ).catch((err) => console.error("Failed to update last login:", err));

    // Return user and token
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
