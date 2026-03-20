import EventDisplay from '@/app/components/layout/EventDisplay'
import React, { use } from 'react'

interface EventPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default function EventPage({params}:EventPageProps) {
    const { id } = use(params) // Usar React.use() para unwrap Promise

    return (
        <EventDisplay id={id}/>
    )
}
