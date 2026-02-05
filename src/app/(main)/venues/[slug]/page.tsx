import React, { use } from 'react'
import VenueDisplay from '@/app/components/layout/VenueDisplay'

interface VenuePageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default function VenuePage({ params }: VenuePageProps) {
  const { slug } = use(params) // Usar React.use() para unwrap Promise
  return (
    <>
      <VenueDisplay slug={slug}/>
    </>
  )
}