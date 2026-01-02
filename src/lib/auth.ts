/**
 * Authentication Configuration
 * 
 * This project uses API-based authentication:
 * - POST /api/auth/login - User login (returns JWT token)
 * - POST /api/register - User registration
 * 
 * DO NOT import from this file in client components.
 * Use the API endpoints directly via fetch().
 * 
 * Token Flow:
 * 1. Client submits credentials to /api/auth/login or /api/register
 * 2. API validates and returns JWT token
 * 3. Client stores token in httpOnly cookie (via server Set-Cookie header)
 * 4. Client includes token in Authorization header for protected endpoints
 * 5. Middleware validates token on protected routes
 * 
 * DEPRECATED: NextAuth configuration removed.
 * The application now uses pure JWT-based API authentication.
 */

export const authConfig = {
  // API-based auth configuration
  loginEndpoint: "/api/auth/login",
  registerEndpoint: "/api/register",
  tokenExpiresIn: "7d",
  tokenAlgorithm: "HS256",
} as const;