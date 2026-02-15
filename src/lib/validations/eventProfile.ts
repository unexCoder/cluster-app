import { z } from 'zod'

// Step 1: Basic Information Schema
export const eventBasicInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Event name is required')
    .min(2, 'Event name must be at least 2 characters')
    .max(200, 'Event name must not exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters'),
  short_description: z
    .string()
    .max(500, 'Short description must not exceed 500 characters')
    .optional(),
  event_type: z
    .enum(
      ['concert', 'festival', 'workshop', 'conference', 'exhibition', 'party', 'other'],
      { message: 'Please select a valid event type' }
    )
})

// Step 2: Date, Time & Venue Schema
export const eventDateVenueSchema = z
  .object({
    venue_id: z
      .string()
      .min(1, 'Venue is required'),
    start_date_time: z
      .string()
      .min(1, 'Start date and time is required'),
    end_date_time: z
      .string()
      .min(1, 'End date and time is required'),
    doors_open_time: z
      .string()
      .optional(),
    timezone: z
      .string()
      .min(1, 'Timezone is required'),
    remaining_capacity: z
      .number()
      .int('Capacity must be a whole number')
      .min(0, 'Capacity cannot be negative')
  })
  .refine(
    (data) => {
      if (data.start_date_time && data.end_date_time) {
        return new Date(data.end_date_time) > new Date(data.start_date_time)
      }
      return true
    },
    { message: 'End date must be after start date', path: ['end_date_time'] }
  )
  .refine(
    (data) => {
      if (data.doors_open_time && data.start_date_time) {
        return new Date(data.doors_open_time) < new Date(data.start_date_time)
      }
      return true
    },
    { message: 'Doors open time must be before start time', path: ['doors_open_time'] }
  )

// Step 3: Event Details Schema
export const eventDetailsSchema = z.object({
  status: z
    .enum(['draft', 'published', 'cancelled', 'postponed', 'completed', 'sold_out'])
    .optional()
    .default('draft'),
  age_restriction: z
    .enum(['all_ages', '13+', '16+', '18+', '21+'])
    .optional()
    .default('all_ages'),
  is_featured: z
    .boolean()
    .optional()
    .default(false),
  categories: z
    .array(z.string().max(100, 'Category must not exceed 100 characters'))
    .max(20, 'Maximum 20 categories allowed')
    .optional()
    .default([]),
  tags: z
    .array(z.string().max(100, 'Tag must not exceed 100 characters'))
    .max(50, 'Maximum 50 tags allowed')
    .optional()
    .default([])
})

// Step 4: Media & Policies Schema
export const eventMediaPoliciesSchema = z.object({
  images: z
    .array(
      z.string()
        .url('Each image must be a valid URL')
        .max(500, 'Image URL must not exceed 500 characters')
    )
    .max(20, 'Maximum 20 images allowed')
    .optional()
    .default([]),
  videos: z
    .array(
      z.string()
        .url('Each video must be a valid URL')
        .max(500, 'Video URL must not exceed 500 characters')
    )
    .max(10, 'Maximum 10 videos allowed')
    .optional()
    .default([]),
  poster: z
    .string()
    .url('Poster must be a valid URL')
    .max(500, 'Poster URL must not exceed 500 characters')
    .optional(),
  refund_policy: z
    .string()
    .max(2000, 'Refund policy must not exceed 2000 characters')
    .optional(),
  accessibility_info: z
    .string()
    .max(1000, 'Accessibility info must not exceed 1000 characters')
    .optional(),
  prohibited_items: z
    .array(z.string().max(100, 'Item must not exceed 100 characters'))
    .max(50, 'Maximum 50 prohibited items allowed')
    .optional()
    .default([]),
  general_rules: z
    .string()
    .max(2000, 'General rules must not exceed 2000 characters')
    .optional()
})

// Complete event schema (for final validation)
// Complete event schema (for final validation)
export const eventCreateSchema = z.object({
  name: eventBasicInfoSchema.shape.name,
  description: eventBasicInfoSchema.shape.description,
  short_description: eventBasicInfoSchema.shape.short_description,
  event_type: eventBasicInfoSchema.shape.event_type,

  // Redeclare date/venue fields directly (can't access .shape on refined schemas)
  venue_id: z
    .string()
    .min(1, 'Venue is required'),
  start_date_time: z
    .string()
    .min(1, 'Start date and time is required'),
  end_date_time: z
    .string()
    .min(1, 'End date and time is required'),
  doors_open_time: z
    .string()
    .optional(),
  timezone: z
    .string()
    .min(1, 'Timezone is required'),
  remaining_capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(0, 'Capacity cannot be negative'),

  status: eventDetailsSchema.shape.status,
  age_restriction: eventDetailsSchema.shape.age_restriction,
  is_featured: eventDetailsSchema.shape.is_featured,
  categories: eventDetailsSchema.shape.categories,
  tags: eventDetailsSchema.shape.tags,

  media_urls: z.object({
    images: eventMediaPoliciesSchema.shape.images,
    videos: eventMediaPoliciesSchema.shape.videos,
    poster: eventMediaPoliciesSchema.shape.poster
  }).optional(),

  event_policies: z.object({
    refund_policy: eventMediaPoliciesSchema.shape.refund_policy,
    accessibility_info: eventMediaPoliciesSchema.shape.accessibility_info,
    prohibited_items: eventMediaPoliciesSchema.shape.prohibited_items,
    general_rules: eventMediaPoliciesSchema.shape.general_rules
  }).optional()
})

// Type inference
export type EventBasicInfo = z.infer<typeof eventBasicInfoSchema>
export type EventDateVenue = z.infer<typeof eventDateVenueSchema>
export type EventDetails = z.infer<typeof eventDetailsSchema>
export type EventMediaPolicies = z.infer<typeof eventMediaPoliciesSchema>
export type EventCreate = z.infer<typeof eventCreateSchema>