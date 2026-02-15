import React from 'react'
import styles from './eventDisplay.module.css'

interface EventDisplayProps {
  slug: string
}

export default function EventDisplay({slug}:EventDisplayProps) {
  return (
    <div>EventDisplay {slug}</div>
  )
}
