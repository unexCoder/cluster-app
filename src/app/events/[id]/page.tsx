import React from 'react'

export default async function EventDetail({ params }: { params: Promise<{ id: string }>  }) {
    const { id } = await params;
  return (
    <>
        <div>EventDetail</div>
        <div>Event ID: {id}</div>
    </>
  )
}
