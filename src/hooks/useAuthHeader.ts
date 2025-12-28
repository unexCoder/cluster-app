/**
 * Hook to send Authorization header to middleware for protected routes
 * This ensures the middleware can verify the token from localStorage
 */

import { useEffect } from "react";
import { getToken } from "@/lib/auth-client";

export function useAuthHeader() {
  useEffect(() => {
    // Add Authorization header to all fetch requests
    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      const [resource, config] = args;
      
      try {
        const token = getToken();

        if (token && typeof resource === "string") {
          // Only add header to same-origin requests
          const url = new URL(resource, window.location.origin);
          if (url.origin === window.location.origin) {
            const headers = {
              ...(config?.headers || {}),
              Authorization: `Bearer ${token}`,
            } as Record<string, string>;

            return originalFetch(resource, { ...config, headers });
          }
        }
      } catch (error) {
        console.error("Error adding authorization header:", error);
      }

      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}

