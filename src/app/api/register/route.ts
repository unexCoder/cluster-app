import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";
import { query } from '@/lib/db';
import { randomUUID } from 'crypto';
import { RowDataPacket } from "mysql2";
import { emailRegex, passwordSchema } from "@/lib/validators/userCredentials";


const registerSchema = z.object({
    email: z.string().regex(emailRegex, 'Invalid email'),
    password: passwordSchema
});

interface User extends RowDataPacket {
    id: string;
    email: string;
}

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 10);

export async function POST(req: Request) {
    
    try {
        const body = await req.json();
        const { email, password } = registerSchema.parse(body);
        const normalEmail = email.toLowerCase().trim();

        const existingUser = await query(
            `SELECT id 
           FROM users 
           WHERE email = ?
           LIMIT 1
           `,
            [normalEmail]
        ) as User[];

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const id = randomUUID();
        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        await query(
            `INSERT INTO users (
            id,
            email,
            password_hash,
            role,
            status,
            created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                id,
                normalEmail,
                hashedPassword,
                'customer',
                'pending_verification'
            ]
        );

        return NextResponse.json(
            { user: { id: id, email: normalEmail } },
            { status: 201 }
        );
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: error.issues },
                { status: 400 }
            );
        }

        if (error.code === "ER_DUP_ENTRY") {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}