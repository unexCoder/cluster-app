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

export interface TicketTier {
  id: string
  event_id: string
  name: string
  description: string | null
  price: number
  quantity: number
  quantity_sold: number
  quantity_reserved: number
  max_per_order: number | null
  sales_start: Date
  sales_end: Date
  benefits: Record<string, unknown> | null
  sort_order: number | null
  is_active: number | null
  created_at: Date | null
  updated_at: Date | null
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  guest_name: string
  guest_email: string
  guest_phone: string | null
  event_id: string
  subtotal: number
  discount_amount: number | null
  tax_amount: number | null
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'partially_refunded'
  promo_code_id: string | null
  created_at: Date | null
  updated_at: Date | null
  deleted_at: Date | null
  refunded_at: Date | null
  refund_reason: string | null
  refund_processed_by: string | null
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  payment_method: 'credit_card' | 'debit_card' | 'paypal' | 'mercadopago' | 'bank_transfer' | 'cash' | 'crypto' | 'rapipago' | 'pagofacil'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded' | 'cancelled'
  provider: string | null
  transaction_id: string | null
  provider_response: Record<string, unknown> | null
  failure_reason: string | null
  paid_at: Date | null
  created_at: Date | null
  updated_at: Date | null
  requires_kyc_verification: number | null
  kyc_verified_at: Date | null
  secure_3d_required: number | null  // renombrado — 3d_secure_required no es identificador válido en TS
  fraud_score: number | null
  flagged_for_review: number | null
}

export interface Ticket {
  id: string
  order_id: string
  ticket_tier_id: string
  ticket_number: string
  qr_token: string
  qr_secret: string
  qr_code_data: string
  qr_version: number
  owner_user_id: string | null
  current_holder_name: string | null
  current_holder_email: string | null
  status: 'pending' | 'valid' | 'used' | 'active' | 'transferred' | 'cancelled' | 'refunded' | 'expired' | 'suspended'
  issued_at: Date | null
  expires_at: Date | null
  generation_fingerprint: string | null
  device_fingerprint: string | null
  view_count: number | null
  last_viewed_at: Date | null
  last_viewed_ip: string | null
  check_ins: Record<string, unknown>[] | null
  first_check_in_at: Date | null
  last_check_in_at: Date | null
  checked_in_by: string | null
  check_in_gate: string | null
  check_in_device_id: string | null
  transferred_at: Date | null
  transfer_count: number | null
  deleted_at: Date | null
}

export interface TicketCheckIn {
  id: string
  ticket_id: string
  checked_in_at: Date | null
  checked_in_by: string | null
  gate_id: string | null
  device_id: string | null
}

export interface TicketValidationLog {
  id: string
  ticket_id: string
  qr_token_scanned: string
  validation_type: 'entry' | 're_entry' | 'exit' | 'verification' | 'test'
  result: 'success' | 'already_used' | 'invalid_token' | 'expired' | 'cancelled' | 'wrong_event' | 'wrong_date' | 'wrong_gate' | 'suspended' | 'network_error' | 'device_error'
  failure_reason: string | null
  scanned_by: string
  gate_id: string | null
  device_id: string | null
  scanner_app_version: string | null
  ip_address: string | null
  user_agent: string | null
  gps_coordinates: { lat: number; lng: number } | null  // point de MySQL → coordenadas
  scan_duration_ms: number | null
  attempted_at: Date | null
}