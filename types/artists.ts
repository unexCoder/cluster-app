// types/artist.ts
export interface ArtistProfileCreateDTO {
  user_id: string
  name: string
  stage_name: string
  bio: string
  picture_url: string
  genres: string[]
  contact_info: string
  social_links: string
  technical_requirements: string
  rider_url: string
  presskit_url: string
}
