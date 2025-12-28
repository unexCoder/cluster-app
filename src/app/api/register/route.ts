import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { registerSchema } from "@/lib/validations/auth";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

interface UserRow extends RowDataPacket {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 12);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);
    const normalEmail = email.toLowerCase().trim();
    const normalName = name.trim();

    // Check if user already exists
    let existingUsers;
    try {
      existingUsers = await query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [normalEmail]
      );
    } catch (dbError: any) {
      console.error("Database query failed in register (check email):", {
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

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Parse name into first and last name
    const nameParts = normalName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Generate UUID for user ID
    const crypto = require('crypto');
    const userId = crypto.randomUUID();

    // Insert user into database
    let result;
    try {
      await query<ResultSetHeader>(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, role, status, created_at) 
         VALUES (?, ?, ?, ?, ?, 'customer', 'active', NOW())`,
        [userId, normalEmail, hashedPassword, firstName, lastName]
      );
    } catch (dbError: any) {
      console.error("Failed to insert user:", {
        code: dbError.code,
        errno: dbError.errno,
        message: dbError.message,
      });
      return NextResponse.json(
        { 
          error: "Failed to create user. Please try again later.",
          debug: process.env.NODE_ENV === "development" ? dbError.message : undefined
        },
        { status: 503 }
      );
    }

    // Fetch the created user
    let newUser;
    try {
      newUser = await query<UserRow[]>(
        "SELECT id, email, first_name, last_name, role FROM users WHERE id = ?",
        [userId]
      );
    } catch (dbError: any) {
      console.error("Failed to fetch created user:", {
        code: dbError.code,
        errno: dbError.errno,
        message: dbError.message,
      });
      return NextResponse.json(
        { 
          error: "User created but failed to retrieve. Please try logging in.",
          debug: process.env.NODE_ENV === "development" ? dbError.message : undefined
        },
        { status: 503 }
      );
    }

    if (!newUser || newUser.length === 0) {
      throw new Error("Failed to create user");
    }

    // Generate JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-in-production"
    );

    const token = await new SignJWT({ userId: newUser[0].id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json(
      {
        message: "Registration successful",
        token,
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          name: `${newUser[0].first_name} ${newUser[0].last_name}`,
          role: newUser[0].role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }
    }

    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}