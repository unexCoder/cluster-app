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