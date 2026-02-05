import { z } from 'zod'

// Step 1: Basic Information Schema
export const venueBasicInfoSchema = z.object({
  name: z
    .string()
    .min(1, 'Venue name is required')
    .min(2, 'Venue name must be at least 2 characters')
    .max(100, 'Venue name must not exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be a positive number')
    .min(1, 'Capacity must be at least 1')
    .max(1000000, 'Capacity seems unreasonably high')
})

// Step 2: Location Information Schema
export const venueLocationSchema = z.object({
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City name must be at least 2 characters')
    .max(50, 'City name must not exceed 50 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .min(2, 'Country name must be at least 2 characters')
    .max(50, 'Country name must not exceed 50 characters'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional()
    .nullable(),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional()
    .nullable()
})

// Step 3: Contact Information Schema
export const venueContactSchema = z.object({
  name: z
    .string()
    .max(100, 'Contact name must not exceed 100 characters')
    .optional(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  phone: z
    .string()
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .url('Please enter a valid URL (include https://)')
    .max(200, 'Website URL must not exceed 200 characters')
    .optional()
    .or(z.literal(''))
})

// Step 4: Venue Details Schema
export const venueDetailsSchema = z.object({
  type: z
    .string()
    .max(50, 'Venue type must not exceed 50 characters')
    .optional(),
  amenities: z
    .array(z.string().max(100, 'Amenity name must not exceed 100 characters'))
    .max(50, 'Maximum 50 amenities allowed')
    .optional()
    .default([]),
  accessibility: z
    .string()
    .max(1000, 'Accessibility information must not exceed 1000 characters')
    .optional(),
  parking_info: z
    .string()
    .max(500, 'Parking information must not exceed 500 characters')
    .optional(),
  public_transport: z
    .string()
    .max(500, 'Public transport information must not exceed 500 characters')
    .optional(),
  image_urls: z
    .array(
      z.string()
        .url('Each image must be a valid URL')
        .max(500, 'Image URL must not exceed 500 characters')
    )
    .max(20, 'Maximum 20 images allowed')
    .optional()
    .default([])
})

// Complete venue profile schema (for final validation)
export const venueProfileSchema = z.object({
  // Basic Info
  name: venueBasicInfoSchema.shape.name,
  description: venueBasicInfoSchema.shape.description,
  capacity: venueBasicInfoSchema.shape.capacity,
  
  // Location
  address: venueLocationSchema.shape.address,
  city: venueLocationSchema.shape.city,
  country: venueLocationSchema.shape.country,
  latitude: venueLocationSchema.shape.latitude,
  longitude: venueLocationSchema.shape.longitude,
  
  // Contact
  contact_info: z.object({
    name: venueContactSchema.shape.name,
    email: venueContactSchema.shape.email,
    phone: venueContactSchema.shape.phone,
    website: venueContactSchema.shape.website
  }),
  
  // Venue Details
  venue_info: z.object({
    type: venueDetailsSchema.shape.type,
    amenities: venueDetailsSchema.shape.amenities,
    accessibility: venueDetailsSchema.shape.accessibility,
    parking_info: venueDetailsSchema.shape.parking_info,
    public_transport: venueDetailsSchema.shape.public_transport
  }).optional(),
  
  image_urls: venueDetailsSchema.shape.image_urls
})

// Type inference
export type VenueBasicInfo = z.infer<typeof venueBasicInfoSchema>
export type VenueLocation = z.infer<typeof venueLocationSchema>
export type VenueContact = z.infer<typeof venueContactSchema>
export type VenueDetails = z.infer<typeof venueDetailsSchema>
export type VenueProfile = z.infer<typeof venueProfileSchema>