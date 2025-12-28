import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

/**
 * Middleware to protect routes and verify JWT tokens
 * 
 * Protected routes:
 * - /dashboard/*
 * - /api/protected/*
 */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Try to get token from Authorization header first (from localStorage)
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.replace("Bearer ", "");

    // Fallback to cookies if no Authorization header
    if (!token) {
      token = request.cookies.get("authToken")?.value;
    }

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      // Token is valid, continue
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authToken");
      return response;
    }
  }

  // Protect API routes
  if (pathname.startsWith("/api/protected")) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      // Token is valid, continue
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
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
  ],
};
