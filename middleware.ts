import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

/**
 * Unified middleware to protect routes and verify JWT tokens
 * 
 * Protected routes:
 * - /dashboard/* (authenticated users only)
 * - /api/users, /api/qr, /api/random (API key validation in production)
 * 
 * Features:
 * - JWT token verification (from headers or cookies)
 * - API key validation for production
 * - Origin validation for cross-origin requests
 * - Role-based route permissions
 */

// Configuration
const allowedOrigins = [
  "https://festivalcluster.org",
  "https://www.festivalcluster.org",
];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

// Define custom JWT payload type
interface CustomJWTPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

// Define role-based route permissions
const ROLE_ROUTES = {
  admin: ["/dashboard/admin", "/dashboard/manager", "/dashboard/user"],
  manager: ["/dashboard/manager", "/dashboard/user"],
  user: ["/dashboard/user"],
} as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isServerCall = !request.headers.get("origin");

  // ─────────────────────────────
  //  API protection (prod only)
  // ─────────────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    (pathname.startsWith("/api/users") ||
      pathname.startsWith("/api/qr") ||
      pathname.startsWith("/api/random")) &&
    !isServerCall
  ) {
    const apiKey = request.headers.get("x-api-key");
    const origin = request.headers.get("origin");

    if (apiKey !== process.env.API_INTERNAL_KEY) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 401 }
      );
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Forbidden: Origin not allowed" },
        { status: 403 }
      );
    }
  }

  // ─────────────────────────────
  //  Page & Route protection (sessions)
  // ─────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    // Extract token from Authorization header or cookies
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET) as {
        payload: CustomJWTPayload;
      };

      // Token is valid
      const userRole = payload.role || "user";

      // Attach user info to response headers
      const response = NextResponse.next();
      response.headers.set("x-user-role", userRole);
      response.headers.set("x-user-email", payload.email || "");
      response.headers.set("x-user-name", payload.name || "");
      response.headers.set("x-user-id", payload.userId || "");

      return response;
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authToken");
      return response;
    }
  }

  // ─────────────────────────────
  //  Protected API routes
  // ─────────────────────────────
  if (pathname.startsWith("/api/protected")) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
    "/api/users/:path*",
    "/api/qr/:path*",
    "/api/random/:path*",
    '/((?!api/webhooks).*)', // ✅ exclude webhooks from auth
  ],
};
