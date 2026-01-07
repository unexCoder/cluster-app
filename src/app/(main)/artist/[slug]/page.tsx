import React, { use } from 'react'
import ArtistDisplay from '@/app/components/layout/ArtistDisplay'

interface ArtistPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = use(params) // Usar React.use() para unwrap Promise
  
  return (
    <>
      <ArtistDisplay slug={slug}/>
    </>
  )
}