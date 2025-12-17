import { auth  } from "./lib/auth"

export const proxy = auth((req) => {
  // Users without session are redirected to login
  if (!req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl.origin))
  }
})

export const config = {
  matcher: [
    // Protect these routes
    "/dashboard/:path*",
    "/events/:path*",
    // Don't protect: /, /login, /api/auth/*
  ]
}