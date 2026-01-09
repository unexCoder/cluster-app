import { z } from "zod";

// Validation schema
const contactInfoSchema = z.object({
  name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
})

const socialLinksSchema = z.object({
  website: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  spotify: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
})

const artistProfileSchema = z.object({
  user_id: z.string().optional(),
  name: z.string().min(1, 'Artist name is required'),
  stage_name: z.string().optional(),
  bio: z.string().optional(),
  picture_url: z.string().url().optional().or(z.literal('')),
  genres: z.array(z.string()),
  contact_info: contactInfoSchema,
  social_links: socialLinksSchema,
  technical_requirements: z.string().optional(),
  rider_url: z.string().url().optional().or(z.literal('')),
  presskit_url: z.string().url().optional().or(z.literal('')),
})