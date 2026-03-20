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
        // Get URL string from resource (handle both string and Request object)
        let urlString: string;
        
        if (typeof resource === "string") {
          urlString = resource;
        } else if (resource instanceof Request) {
          urlString = resource.url;
        } else {
          // Unknown type, use original fetch
          return originalFetch(...args);
        }

        // Parse URL (handle relative URLs)
        const url = new URL(urlString, window.location.origin);
        
        // Skip S3 URLs - they have their own authentication via presigned URLs
        const isS3 = url.hostname.includes('amazonaws.com') || 
                     url.hostname.includes('s3.');
        
        if (isS3) {
          console.log('🔓 Skipping auth for S3:', url.hostname);
          return originalFetch(...args);
        }

        // Skip external URLs (not same origin)
        const isSameOrigin = url.origin === window.location.origin;
        
        if (!isSameOrigin) {
          console.log('🔓 Skipping auth for external URL:', url.hostname);
          return originalFetch(...args);
        }

        // Add Authorization header for same-origin requests
        const token = getToken();
        
        if (token) {
          console.log('🔒 Adding auth to:', url.pathname);
          const headers = {
            ...(config?.headers || {}),
            Authorization: `Bearer ${token}`,
          } as Record<string, string>;

          return originalFetch(resource, { ...config, headers });
        }

        // No token, use original fetch
        return originalFetch(...args);
        
      } catch (error) {
        console.error("Error in auth interceptor:", error);
        // Return original fetch on error
        return originalFetch(...args);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}

// ```

// **Cambios clave:**

// 1. ✅ **Primero** obtiene el URL string (maneja string y Request)
// 2. ✅ **Primero** verifica si es S3 (antes de verificar token)
// 3. ✅ **Primero** verifica si es mismo origen (antes de verificar token)
// 4. ✅ **Solo entonces** verifica token y añade header
// 5. ✅ El `catch` retorna `originalFetch(...args)` correctamente
// 6. ✅ Logs para debug

// **Ahora en la consola deberías ver:**
// ```
// 🔓 Skipping auth for S3: your-bucket.s3.amazonaws.com