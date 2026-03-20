'use client'

import React, { useEffect, useState } from 'react'
import { PerformanceFormData, PerformanceType } from '@/hooks/usePerformanceForm'
import { ValidationErrors } from '../../../../../../../types/types'
import { fetchEventsAction } from '@/app/actions/events'
import { fetchArtistsAction } from '@/app/actions/artists'
import styles from '../steps.module.css'

interface Step1LinkProps {
  formData: PerformanceFormData
  validationErrors: ValidationErrors
  updateField: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

interface EventOption {
  id: string
  name: string
}

interface ArtistOption {
  id: string
  name: string
}

const PERFORMANCE_TYPES = [
  { value: 'live_set', label: 'Live Set' },
  { value: 'dj_set', label: 'DJ Set' },
  { value: 'a/v_set', label: 'A/V Set' },
  { value: 'visuals', label: 'Visuals' },
  { value: 'live_cinema', label: 'Live Cinema' },
  { value: 'sound_installation', label: 'Sound Installation' },
  { value: 'other', label: 'Other' },
] as const

export function Step1Link({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
}: Step1LinkProps) {

  const [events, setEvents] = useState<EventOption[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  useEffect(() => {

    const loadEvents = async () => {
      try {
        const result = await fetchEventsAction()
        if (result.success) {
          setEvents(result.events.map((e: any) => ({
            id: e.id,
            name: e.name
          })))
        }
      } catch (err) {
        console.error('Failed to load events:', err)
      } finally {
        setLoadingEvents(false)
      }
    }

    loadEvents()
  }, [])

  const [artists, setArtists] = useState<ArtistOption[]>([])
  const [loadingArtists, setLoadingArtists] = useState(true)
  useEffect(() => {

    const loadArtists = async () => {
      try {
        const result = await fetchArtistsAction()
        if (result.success) {
          setArtists(result.artists.map((a: any) => ({
            id: a.id,
            name: a.name
          })))
        }
      } catch (err) {
        console.error('Failed to load artists:', err)
      } finally {
        setLoadingArtists(false)
      }
    }

    loadArtists()
  }, [])

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        Link Event &amp; Artist
      </h3>

      {/* Event */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Event <span style={{ color: '#ef4444' }}>*</span>
        </label>

        <select
          value={formData.event_id}
          onChange={e => {
            updateField('event_id', e.target.value)
            clearFieldError('event_id')
          }}
          style={inputStyle(!!validationErrors.event_id)}
          disabled={loadingEvents}
        >
          <option value="">
            {loadingEvents ? 'Loading events...' : 'Select an event'}
          </option>

          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        {validationErrors.event_id && (
          <p style={errorStyle}>{validationErrors.event_id}</p>
        )}

        <p style={hintStyle}>Select the event this performance belongs to</p>
      </div>

      {/* Artist */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Artist <span style={{ color: '#ef4444' }}>*</span>
        </label>

        <select
          value={formData.artist_id}
          onChange={e => {
            updateField('artist_id', e.target.value)
            clearFieldError('artist_id')
          }}
          style={inputStyle(!!validationErrors.artist_id)}
          disabled={loadingArtists}
        >
          <option value="">
            {loadingArtists ? 'Loading artists...' : 'Select an artist'}
          </option>

          {artists.map(artist => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        {validationErrors.artist_id && (
          <p style={errorStyle}>{validationErrors.artist_id}</p>
        )}

        <p style={hintStyle}>Select the artist this performance belongs to</p>
      </div>


      {/* Performance Type */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Performance Type <span style={{ color: '#ef4444' }}>*</span>
        </label>

        <select
          value={formData.performance_type || ''}
          onChange={e => {
            updateField('performance_type', e.target.value as PerformanceType)
            clearFieldError('performance_type')
          }}
          style={inputStyle(!!validationErrors.performance_type)}
        >
          <option value="">Select performance type</option>

          {PERFORMANCE_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {validationErrors.performance_type && (
          <p style={errorStyle}>{validationErrors.performance_type}</p>
        )}

        <p style={hintStyle}>Select the type of performance</p>
      </div>

      {/* Performance Order */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          Performance Order <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="number"
          min={1}
          value={formData.performance_order}
          onChange={e => {
            updateField('performance_order', e.target.value)
            clearFieldError('performance_order')
          }}
          style={inputStyle(!!validationErrors.performance_order)}
        />
        {validationErrors.performance_order && (
          <p style={errorStyle}>{validationErrors.performance_order}</p>
        )}
        <p style={hintStyle}>Position in the lineup (1 = first to perform)</p>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '16px',
  fontWeight: '500',
  color: '#fff',
  marginBottom: '6px',
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  // background: '#fff',
})

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#ef4444',
  marginTop: '4px',
}

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  marginTop: '4px',
}