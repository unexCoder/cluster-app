import { z } from "zod";
import { createSocialSchema } from './helpers/helpers'

// Validation schema
export const contactInfoSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => !val || (val.length <= 50 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val)),
      { message: 'Last name must be less than 50 characters and contain only letters, spaces, hyphens, and apostrophes' }
    ),

  last_name: z
    .string()
    .optional()
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => !val || (val.length <= 50 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val)),
      { message: 'Last name must be less than 50 characters and contain only letters, spaces, hyphens, and apostrophes' }
    ),

  email: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() || '')
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      { message: 'Must be a valid email address' }
    ),

  phone: z
    .string()
    .optional()
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => {
        if (!val) return true;

        // Check for + prefix first
        const hasPlus = val.startsWith('+');
        // Remove all non-digit characters
        const cleaned = val.replace(/\D/g, '');
        // Validate: 7-15 digits (with or without + prefix)
        return cleaned.length >= 7 && cleaned.length <= 15;
      },
      { message: 'Must be a valid phone number (7-15 digits)' }
    ),
})

export type ContactInfo = z.infer<typeof contactInfoSchema>;

export const socialLinksSchema = z.object({
  // website: z
  //   .string()
  //   .optional()
  //   .transform((val) => val?.trim() || '')
  //   .refine(
  //     (val) => !val || z.string().url().safeParse(val).success,
  //     { message: 'Must be a valid URL or empty' }
  //   ),
  website: z
  .string()
  .optional()
  .transform((val) => val?.trim() || '')
  .transform((val) => {
    if (!val) return ''
    if (/^www\./i.test(val)) return `https://${val}`
    return val
  })
  .refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: 'Must be a valid URL or empty' }
  ),

  instagram: createSocialSchema(
    /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/[\w.]+\/?$/,
    /^[\w.]{1,30}$/,
    'Must be a valid Instagram URL or username'
  ),

  youtube: createSocialSchema(
    /^https?:\/\/(www\.)?(youtube\.com\/(c\/|channel\/|user\/|@)?|youtu\.be\/)[\w-]+\/?$/,
    /^[\w-]{1,100}$/,
    'Must be a valid YouTube URL or username'
  ),

  twitter: createSocialSchema(
    /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w{1,15}\/?$/,
    /^\w{1,15}$/,
    'Must be a valid Twitter/X URL or username'
  ),

  facebook: createSocialSchema(
    /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/([\w.-]+|profile\.php\?id=\d+)\/?$/,
    /^[\w.-]{5,50}$/,
    'Must be a valid Facebook URL or username'
  ),

  tiktok: createSocialSchema(
    /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/@?[\w.-]+\/?$/,
    /^[\w.]{2,24}$/,
    'Must be a valid TikTok URL or username'
  ),

  spotify: createSocialSchema(
    /^https?:\/\/(open\.)?(spotify\.com)\/(artist|user|playlist)\/[\w-]+\/?$/,
    /^[\w.-]{1,50}$/,
    'Must be a valid Spotify URL or username'
  ),
});

export type SocialLinks = z.infer<typeof socialLinksSchema>;


export const artistInfoSchema = z.object({
  // Artist name - required, trimmed, with length constraints
  name: z
    .string()
    .min(1, 'Artist name is required')
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Artist name cannot be empty' })
    .refine((val) => val.length >= 2, { message: 'Artist name must be at least 2 characters' })
    .refine((val) => val.length <= 100, { message: 'Artist name must be less than 100 characters' }),

  stage_name: z
    .string()
    .optional()
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => !val || val.length >= 2,
      { message: 'Stage name must be at least 2 characters' }
    )
    .refine(
      (val) => !val || val.length <= 100,
      { message: 'Stage name must be less than 100 characters' }
    ),

  bio: z
    .string()
    .min(1, 'Bio is required')
    .transform((val) => val?.trim() || '')
    .refine(
      (val) => !val || val.length <= 1500,
      { message: 'Bio must be less than 1500 characters' }
    ),

  picture_url: z
    .string()
    .min(1, 'Picture URL is required')
    .transform((val) => val.trim() || '')
    .refine(
      (val) => !val || z.string().url().safeParse(val).success,
      { message: 'Must be a valid URL' }
    ),

  genres: z
    .array(z.string().transform((val) => val.trim()))
    .min(1, 'At least one genre is required')
    .refine(
      (genres) => genres.every((g) => g.length > 0),
      { message: 'Genres cannot be empty' }
    )
    .refine(
      (genres) => new Set(genres).size === genres.length,
      { message: 'Duplicate genres are not allowed' }
    )
    .refine(
      (genres) => genres.every((g) => g.length <= 12),
      { message: 'Each genre must be less than 12 characters' }
    ),
})

export type ArtistInfo = z.infer<typeof artistInfoSchema>;

export const techInfoSchema = z.object({
  technical_requirements: z
    .string()

    .min(50, 'Technical requirements must be at less 50 characters or more')
    .max(5000, 'Technical requirements must be less than 5000 characters')
    .optional()
    .transform((val) => val?.trim() || ''),

  // rider_url: z
  //   .string()
  //   .optional()
  //   .transform((val) => val?.trim() || '')
  //   .refine(
  //     (val) => !val || z.string().url().safeParse(val).success,
  //     { message: 'Rider URL must be a valid URL' }
  //   ),
  rider_url: z
  .string()
  .optional()
  .transform((val) => val?.trim() || '')
  .transform((val) => {
    if (!val) return ''
    if (/^www\./i.test(val)) return `https://${val}`
    return val
  })
  .refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: 'Rider url must be a valid URL or empty' }
  ),

  presskit_url: z
  .string()
  .optional()
  .transform((val) => val?.trim() || '')
  .transform((val) => {
    if (!val) return ''
    if (/^www\./i.test(val)) return `https://${val}`
    return val
  })
  .refine(
    (val) => !val || z.string().url().safeParse(val).success,
    { message: 'Presskit url must be a valid URL or empty' }
  )
}).refine(
  (data) => !!(data.technical_requirements || data.rider_url),
  {
    message: 'At least one of the following is required: technical requirements or rider URL',
  }
);

export type TechInfo = z.infer<typeof techInfoSchema>;

export const artistProfileSchema = z.object({
  user_id: z.string().optional(),
  artistInfo: artistInfoSchema,
  contact_info: contactInfoSchema,
  social_links: socialLinksSchema,
  technical_information: techInfoSchema
})

export type artistProfile = z.infer<typeof artistProfileSchema>;