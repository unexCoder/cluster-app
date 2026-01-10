import { z } from "zod";

// Helper 
export const createSocialSchema = (
  urlPattern: RegExp,
  usernamePattern: RegExp,
  message: string
) => {
  return z
    .string()
    .optional()
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => {
        if (!val) return true;
        
        // Check if it's a URL
        if (/^https?:\/\//.test(val)) {
          return urlPattern.test(val);
        }
        
        // Check username format
        const username = val.replace(/^@/, '');
        return usernamePattern.test(username);
      },
      { message }
    );
};

