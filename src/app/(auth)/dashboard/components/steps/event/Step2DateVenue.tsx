'use client'

import React, { useEffect, useState } from 'react'
import { EventFormData, ValidationErrors } from '../../../../../../../types/types'
import { fetchVenuesAction } from '@/app/actions/venues'

interface VenueOption {
  id: string
  name: string
  city: string
  capacity: number
}

const TIMEZONES = [
  'UTC',
  'America/Argentina/Buenos_Aires',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'America/Mexico_City',
  'Europe/London',
  'Europe/Paris',
  'Europe/Madrid',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

interface Step2DateVenueProps {
  formData: EventFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

export const Step2DateVenue: React.FC<Step2DateVenueProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError
}) => {
  const [venues, setVenues] = useState<VenueOption[]>([])
  const [loadingVenues, setLoadingVenues] = useState(true)

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const result = await fetchVenuesAction()
        if (result.success) {
          setVenues(result.venues.map((v: any) => ({
            id: v.id,
            name: v.name,
            city: v.city,
            capacity: v.capacity
          })))
        }
      } catch (err) {
        console.error('Failed to load venues:', err)
      } finally {
        setLoadingVenues(false)
      }
    }

    loadVenues()
  }, [])

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
        Date, Time & Venue
      </h3>

      {/* Venue Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="venueId"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Venue <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          id="venueId"
          value={formData.venueId}
          onChange={(e) => {
            updateField('venueId', e.target.value)
            clearFieldError('venueId')
          }}
          disabled={loadingVenues}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.venueId ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: '#3b3b3b'
          }}
        >
          <option value="">{loadingVenues ? 'Loading venues...' : 'Select a venue'}</option>
          {venues.map(venue => (
            <option key={venue.id} value={venue.id}>
              {venue.name} — {venue.city} (cap. {venue.capacity})
            </option>
          ))}
        </select>
        {validationErrors.venueId && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.venueId}</p>
        )}
      </div>

      {/* Start / End DateTime - two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Start DateTime */}
        <div>
          <label
            htmlFor="startDateTime"
            style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
          >
            Start Date & Time <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="startDateTime"
            type="datetime-local"
            value={formData.startDateTime}
            onChange={(e) => {
              updateField('startDateTime', e.target.value)
              clearFieldError('startDateTime')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.startDateTime ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {validationErrors.startDateTime && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.startDateTime}</p>
          )}
        </div>

        {/* End DateTime */}
        <div>
          <label
            htmlFor="endDateTime"
            style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
          >
            End Date & Time <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="endDateTime"
            type="datetime-local"
            value={formData.endDateTime}
            onChange={(e) => {
              updateField('endDateTime', e.target.value)
              clearFieldError('endDateTime')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.endDateTime ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {validationErrors.endDateTime && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.endDateTime}</p>
          )}
        </div>
      </div>

      {/* Doors Open / Timezone - two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Doors Open */}
        <div>
          <label
            htmlFor="doorsOpenTime"
            style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
          >
            Doors Open Time
          </label>
          <input
            id="doorsOpenTime"
            type="datetime-local"
            value={formData.doorsOpenTime}
            onChange={(e) => {
              updateField('doorsOpenTime', e.target.value)
              clearFieldError('doorsOpenTime')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.doorsOpenTime ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {validationErrors.doorsOpenTime && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.doorsOpenTime}</p>
          )}
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
            Must be before start time
          </p>
        </div>

        {/* Timezone */}
        <div>
          <label
            htmlFor="timezone"
            style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
          >
            Timezone <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="timezone"
            value={formData.timezone}
            onChange={(e) => {
              updateField('timezone', e.target.value)
              clearFieldError('timezone')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.timezone ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: '#3b3b3b'
            }}
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          {validationErrors.timezone && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.timezone}</p>
          )}
        </div>
      </div>

      {/* Remaining Capacity */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="remainingCapacity"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Available Capacity <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="remainingCapacity"
          type="number"
          min="0"
          value={formData.remainingCapacity}
          onChange={(e) => {
            updateField('remainingCapacity', e.target.value)
            clearFieldError('remainingCapacity')
          }}
          placeholder="Number of available tickets/spots"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.remainingCapacity ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.remainingCapacity && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.remainingCapacity}</p>
        )}
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
          Cannot exceed the venue's maximum capacity
        </p>
      </div>
    </div>
  )
}