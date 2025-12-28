// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const allowedOrigins = [
  "https://festivalcluster.org",
  "https://www.festivalcluster.org",
];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// Define your custom JWT payload type
interface CustomJWTPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isServerCall = !req.headers.get("origin");

  // ─────────────────────────────
  //  API protection (prod only)
  // ─────────────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    pathname.startsWith("/api") &&
    !isServerCall
  ) {
    const apiKey = req.headers.get("x-api-key");
    const origin = req.headers.get("origin");

    if (apiKey !== process.env.API_INTERNAL_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Forbidden origin" },
        { status: 403 }
      );
    }
  }

  // ─────────────────────────────
  //  Page protection (sessions)
  // ─────────────────────────────
  // Check for valid JWT token
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || req.cookies.get("authToken")?.value;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/protected")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.nextUrl.origin)
      );
    }

    try {
      // await jwtVerify(token, JWT_SECRET);
      const { payload } = await jwtVerify(token, JWT_SECRET) as { payload: CustomJWTPayload };
      
      // Token is valid, continue
      // Debug logs
      console.log('=== JWT Payload Debug ===');
      console.log('Full payload:', payload);
      console.log('Role:', payload.role);
      console.log('Email:', payload.email);
      console.log('========================');

      const userRole = payload.role || "customer";
      const response = NextResponse.next();
      response.headers.set("x-user-role", userRole);

      return response;
      
    } catch {
      return NextResponse.redirect(
        new URL("/login", req.nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/api/:path*"
    "/dashboard/:path*",
    "/api/users",
    "/api/qr",
    "/api/random"
  ],
};

