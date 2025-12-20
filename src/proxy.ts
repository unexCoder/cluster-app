// middleware.ts
import { auth } from "./lib/auth";
import { NextResponse } from "next/server";

const allowedOrigins = [
  "https://festivalcluster.org",
  "https://www.festivalcluster.org",
];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;

  // ─────────────────────────────
  //  API protection (prod only)
  // ─────────────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    pathname.startsWith("/api")
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
  if (!req.auth) {
    return NextResponse.redirect(
      new URL("/login", req.nextUrl.origin)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    
    "/dashboard/:path*",
    "/api/:path*"
  ],
};

// legacy
// import { auth  } from "./lib/auth"

// export const proxy = auth((req) => {
//   // Users without session are redirected to login
//   if (!req.auth) {
//     return Response.redirect(new URL("/login", req.nextUrl.origin))
//   }
// })

// export const config = {
//   matcher: [
//     // Protect these routes
//     "/dashboard/:path*",
//     "/events/:path*",
//     // Don't protect: /, /login, /api/auth/*
//   ]
// }

