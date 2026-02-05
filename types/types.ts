// types.ts
// types for artist profile creation and error handling
export interface ContactInfo {
  name: string
  lastName: string
  email: string
  phone: string
}

export interface SocialLinks {
  website: string
  instagram: string
  facebook: string
  twitter: string
  spotify: string
  youtube: string
  tiktok: string
}

export interface TechnicalInfo {
  requirements: string
  riderUrl: string
  presskitUrl: string
}

export interface ArtistFormData {
  name: string
  stageName: string
  bio: string
  pictureUrl: string
  genres: string[]
  contactInfo: ContactInfo
  socialLinks: SocialLinks
  technical: TechnicalInfo
}

export interface ValidationErrors {
  [key: string]: string
}

export interface VenueFormData {
  name: string
  description: string
  capacity: string
  address: string
  city: string
  country: string
  latitude: string
  longitude: string
  contactInfo: {
    name: string
    email: string
    phone: string
    website: string
  }
  venueInfo: {
    type: string
    amenities: string[]
    accessibility: string
    parkingInfo: string
    publicTransport: string
  }
  imageUrls: string[]
}

export interface VenueData {
  id: string
  name: string
  slug: string
  description: string | null
  capacity: number
  address: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  contactInfo: {
    name?: string
    email: string
    phone?: string
    website?: string
  } | null
  venueInfo: {
    type?: string
    amenities?: string[]
    accessibility?: string
    parkingInfo?: string
    publicTransport?: string
  } | null
  imageUrls: string[] | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateVenuePayload {
  name: string
  description?: string
  capacity: number
  address: string
  city: string
  country: string
  latitude?: number
  longitude?: number
  contactInfo: {
    name?: string
    email: string
    phone?: string
    website?: string
  }
  venueInfo?: {
    type?: string
    amenities?: string[]
    accessibility?: string
    parkingInfo?: string
    publicTransport?: string
  }
  imageUrls?: string[]
}

export interface EventFormData {
  name: string
  description: string
  shortDescription: string
  venueId: string
  startDateTime: string
  endDateTime: string
  doorsOpenTime: string
  timezone: string
  status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed' | 'sold_out'
  isFeatured: boolean
  ageRestriction: 'all_ages' | '13+' | '16+' | '18+' | '21+'
  eventType: 'concert' | 'festival' | 'workshop' | 'conference' | 'exhibition' | 'party' | 'other' | ''
  categories: string[]
  tags: string[]
  mediaUrls: {
    images: string[]
    videos: string[]
    poster: string
  }
  eventPolicies: {
    refundPolicy: string
    accessibilityInfo: string
    covidPolicies: string
    prohibitedItems: string[]
    generalRules: string
  }
  remainingCapacity: string
}

export interface EventData {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string | null
  venueId: string
  startDateTime: string
  endDateTime: string
  doorsOpenTime: string | null
  timezone: string
  status: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed' | 'sold_out'
  isFeatured: boolean
  ageRestriction: 'all_ages' | '13+' | '16+' | '18+' | '21+'
  eventType: 'concert' | 'festival' | 'workshop' | 'conference' | 'exhibition' | 'party' | 'other'
  categories: string[] | null
  tags: string[] | null
  mediaUrls: {
    images?: string[]
    videos?: string[]
    poster?: string
  } | null
  eventPolicies: {
    refundPolicy?: string
    accessibilityInfo?: string
    covidPolicies?: string
    prohibitedItems?: string[]
    generalRules?: string
  } | null
  remainingCapacity: number
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateEventPayload {
  name: string
  description: string
  shortDescription?: string
  venueId: string
  startDateTime: string
  endDateTime: string
  doorsOpenTime?: string
  timezone: string
  status?: 'draft' | 'published' | 'cancelled' | 'postponed' | 'completed' | 'sold_out'
  isFeatured?: boolean
  ageRestriction?: 'all_ages' | '13+' | '16+' | '18+' | '21+'
  eventType: 'concert' | 'festival' | 'workshop' | 'conference' | 'exhibition' | 'party' | 'other'
  categories?: string[]
  tags?: string[]
  mediaUrls?: {
    images?: string[]
    videos?: string[]
    poster?: string
  }
  eventPolicies?: {
    refundPolicy?: string
    accessibilityInfo?: string
    covidPolicies?: string
    prohibitedItems?: string[]
    generalRules?: string
  }
  remainingCapacity: number
  createdBy: string
}