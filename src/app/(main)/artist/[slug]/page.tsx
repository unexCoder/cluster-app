import React, { use } from 'react'
import ArtistDisplay from '@/app/components/layout/ArtistDisplay'
// import FlyerDisplay from '../../components/FlyerDisplay'

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
  
  // const flyerUrl = '/api/postcard?'
  // const flyerUrl2 = '/api/postcard?bckGnda=1241ac00&bckGndb=ac41ac&color=ff00ff&width=2200'
  // const flyerUrl3 = '/api/postcard?bckGnda=1241ac00&bckGndb=ac41ac00&color=ff00ff&width=2200'
  return (
    <>
      <ArtistDisplay slug={slug}/>
      {/* <FlyerDisplay url={flyerUrl} width={400} height={'auto'} />
      <FlyerDisplay url={flyerUrl2} width={400} height={'auto'}/>
      <FlyerDisplay url={flyerUrl3} width={400} height={'auto'}/>
      <FlyerDisplay /> */}
    </>
  )
}