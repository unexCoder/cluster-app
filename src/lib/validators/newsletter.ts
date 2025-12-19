import { z } from "zod";
import { emailRegex } from "@/lib/validators/userCredentials";

export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(emailRegex, "Invalid email"),

  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(100)
    .optional()
    .nullable(),

  source: z
    .string()
    .trim()
    .max(50)
    .optional()
    .default("newsletter_widget"),
});
