'use client'

import React, { useState } from 'react'
import { VenueFormData, ValidationErrors } from '../../../../../../../types/types'

interface Step4VenueDetailsProps {
  formData: VenueFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
  addAmenity: (amenity: string) => void
  removeAmenity: (amenity: string) => void
  addImageUrl: (url: string) => void
  removeImageUrl: (url: string) => void
}

export const Step4VenueDetails: React.FC<Step4VenueDetailsProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  addAmenity,
  removeAmenity,
  addImageUrl,
  removeImageUrl
}) => {
  const [newAmenity, setNewAmenity] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  const handleAddAmenity = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (newAmenity.trim()) {
      addAmenity(newAmenity)
      setNewAmenity('')
    }
  }

  const handleAddImageUrl = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (newImageUrl.trim()) {
      addImageUrl(newImageUrl)
      setNewImageUrl('')
    }
  }

  // Prevent form submission on Enter key in input fields
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: (e?: React.MouseEvent | React.KeyboardEvent) => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      action(e)
    }
  }

  return (
    <div>
      <style>{`
      label,select,p,
      input::placeholder,
      textarea::placeholder {
        color: #fff;  /* Change this to your desired color */
        opacity: 1;
      }
    `}</style>

      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
        Venue Details & Media
      </h3>

      <p style={{ fontSize: '14px', color: '#fff', marginBottom: '24px' }}>
        Add additional information about your venue to help event organizers make informed decisions
      </p>

      {/* Venue Type */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="venueType"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#fff'
          }}
        >
          Venue Type
        </label>
        <select
          id="venueType"
          autoFocus  // Add this
          value={formData.venueInfo.type}
          onChange={(e) => {
            updateField('venueInfo.type', e.target.value)
            clearFieldError('type')
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.type ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: '#374151'
          }}
        >
          <option value="">Select venue type</option>
          <option value="concert_hall">Concert Hall</option>
          <option value="club">Club</option>
          <option value="bar">Bar</option>
          <option value="theater">Theater</option>
          <option value="arena">Arena</option>
          <option value="stadium">Stadium</option>
          <option value="outdoor">Outdoor Space</option>
          <option value="festival_grounds">Festival Grounds</option>
          <option value="conference_center">Conference Center</option>
          <option value="other">Other</option>
        </select>
        {validationErrors.type && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.type}
          </p>
        )}
      </div>

      {/* Amenities */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="amenities"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#fff'
          }}
        >
          Amenities
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            id="amenities"
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddAmenity)}
            placeholder="e.g., Sound System, Stage Lighting, Green Room"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={(e) => handleAddAmenity(e)}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add
          </button>
        </div>
        {formData.venueInfo.amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {formData.venueInfo.amenities.map((amenity, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(amenity)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4338ca',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    marginLeft: '4px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p style={{ fontSize: '12px', marginTop: '8px' }}>
          Press Enter or click Add to include amenities like sound systems, parking, catering, etc.
        </p>
      </div>

      {/* Accessibility Information */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="accessibility"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Accessibility Information
        </label>
        <textarea
          id="accessibility"
          value={formData.venueInfo.accessibility}
          onChange={(e) => {
            updateField('venueInfo.accessibility', e.target.value)
            clearFieldError('accessibility')
          }}
          placeholder="Describe wheelchair access, elevators, accessible restrooms, etc."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.accessibility ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.accessibility && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.accessibility}
          </p>
        )}
      </div>

      {/* Parking Information */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="parkingInfo"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Parking Information
        </label>
        <textarea
          id="parkingInfo"
          value={formData.venueInfo.parkingInfo}
          onChange={(e) => {
            updateField('venueInfo.parkingInfo', e.target.value)
            clearFieldError('parkingInfo')
          }}
          placeholder="Details about parking availability, pricing, nearby garages, etc."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.parkingInfo ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.parkingInfo && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.parkingInfo}
          </p>
        )}
      </div>

      {/* Public Transport */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="publicTransport"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Public Transport Access
        </label>
        <textarea
          id="publicTransport"
          value={formData.venueInfo.publicTransport}
          onChange={(e) => {
            updateField('venueInfo.publicTransport', e.target.value)
            clearFieldError('publicTransport')
          }}
          placeholder="Nearby bus stops, metro stations, train lines, etc."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.publicTransport ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.publicTransport && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.publicTransport}
          </p>
        )}
      </div>

      {/* Image URLs */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="imageUrls"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Venue Images
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            id="imageUrls"
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddImageUrl)}
            placeholder="https://example.com/image.jpg"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={(e) => handleAddImageUrl(e)}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add
          </button>
        </div>
        {formData.imageUrls.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            {formData.imageUrls.map((url, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}
              >
                <span style={{
                  fontSize: '13px',
                  color: '#374151',
                  wordBreak: 'break-all',
                  marginRight: '12px'
                }}>
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeImageUrl(url)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <p style={{ fontSize: '12px', marginTop: '8px' }}>
          Add image URLs to showcase your venue. Include interior, exterior, and stage photos.
        </p>
      </div>

      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '6px',
        padding: '12px',
        marginTop: '24px'
      }}>
        <p style={{ fontSize: '13px', color: '#166534', margin: 0 }}>
          ✓ <strong>Almost done!</strong> Review your information and click "Create Venue" to complete your profile.
        </p>
      </div>
    </div>
  )
}