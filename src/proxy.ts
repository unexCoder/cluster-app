// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const allowedOrigins = [
  "https://festivalcluster.org",
  "https://www.festivalcluster.org",
];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

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
      await jwtVerify(token, JWT_SECRET);
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

