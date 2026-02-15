import EventDisplay from '@/app/components/layout/EventDisplay'
import React, { use } from 'react'

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default function EventPage({params}:EventPageProps) {
    const { slug } = use(params) // Usar React.use() para unwrap Promise
    
    return (
        <EventDisplay slug={slug}/>
    )
}
