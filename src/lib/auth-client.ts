/**
 * Client-side auth utilities
 * Use these functions in your client components for auth operations
 */

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * Login user with email and password
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Check content type before parsing JSON
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      // Server returned non-JSON response (HTML error page, etc)
      const text = await response.text();
      console.error("Non-JSON response from login endpoint:", text);
      throw new Error("Server error - invalid response format");
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || "Login failed");
    }

    return data;
    
  } catch (error: any) {
    // Handle network errors and JSON parsing errors
    if (error instanceof SyntaxError) {
      console.error("Failed to parse login response:", error);
      throw new Error("Server error - invalid response format");
    }
    throw error;
  }
}

/**
 * Register new user
 */
export async function register(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Check content type before parsing JSON
    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      // Server returned non-JSON response (HTML error page, etc)
      const text = await response.text();
      console.error("Non-JSON response from register endpoint:", text);
      throw new Error("Server error - invalid response format");
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || "Registration failed");
    }

    return data;
  } catch (error: any) {
    // Handle network errors and JSON parsing errors
    if (error instanceof SyntaxError) {
      console.error("Failed to parse register response:", error);
      throw new Error("Server error - invalid response format");
    }
    throw error;
  }
}

/**
 * Get the auth token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

/**
 * Store auth token in localStorage AND as a cookie
 * Cookie is used for server-side middleware validation
 * localStorage is used for client-side access
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  
  // Store in localStorage for client-side access
  localStorage.setItem("authToken", token);
  
  // Also set as cookie for server-side middleware
  // HttpOnly is not set here since we're setting it from client, but we could improve this with an API call
  document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
}

/**
 * Clear auth token from localStorage and cookie
 */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  // Clear the cookie
  document.cookie = "authToken=; path=/; max-age=0; SameSite=Strict";
}

/**
 * Logout user
 */
export function logout(): void {
  clearToken();
  // Optionally call logout endpoint if needed for backend cleanup
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Make authenticated fetch request to protected API endpoint
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Decode JWT token (basic - for client-side only, doesn't verify signature)
 * DO NOT use this for security-critical operations
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired (client-side check only)
 */
export function isTokenExpired(token?: string): boolean {
  const tokenToCheck = token || getToken();
  if (!tokenToCheck) return true;

  try {
    const decoded = decodeToken(tokenToCheck);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, current time is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}
