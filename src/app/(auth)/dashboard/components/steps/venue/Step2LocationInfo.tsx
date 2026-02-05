'use client'

import React from 'react'
import { VenueFormData, ValidationErrors } from '../../../../../../../types/types'

interface Step2LocationInfoProps {
  formData: VenueFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

export const Step2LocationInfo: React.FC<Step2LocationInfoProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError
}) => {
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
        Location Information
      </h3>

      {/* Address */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="address"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Address <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => {
            updateField('address', e.target.value)
            clearFieldError('address')
          }}
          placeholder="Street address, building number, etc."
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.address ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.address && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.address}
          </p>
        )}
      </div>

      {/* City and Country - Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* City */}
        <div>
          <label
            htmlFor="city"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '6px'
            }}
          >
            City <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => {
              updateField('city', e.target.value)
              clearFieldError('city')
            }}
            placeholder="City name"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.city ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {validationErrors.city && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {validationErrors.city}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '6px'
            }}
          >
            Country <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => {
              updateField('country', e.target.value)
              clearFieldError('country')
            }}
            placeholder="Country name"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.country ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          {validationErrors.country && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {validationErrors.country}
            </p>
          )}
        </div>
      </div>

      {/* Coordinates Section */}
      <div style={{
        background: '#f9fafb',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#6b7280'
        }}>
          Coordinates (Optional)
        </h4>
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '12px'
        }}>
          Adding coordinates helps with map integration and precise location services
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Latitude */}
          <div>
            <label
              htmlFor="latitude"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                color: '#374151'
              }}
            >
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="0.00000001"
              min="-90"
              max="90"
              value={formData.latitude}
              onChange={(e) => {
                updateField('latitude', e.target.value)
                clearFieldError('latitude')
              }}
              placeholder="e.g., -32.9442"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: validationErrors.latitude ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {validationErrors.latitude && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {validationErrors.latitude}
              </p>
            )}
            <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>
              Between -90 and 90
            </p>
          </div>

          {/* Longitude */}
          <div>
            <label
              htmlFor="longitude"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                color: '#374151'
              }}
            >
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="0.00000001"
              min="-180"
              max="180"
              value={formData.longitude}
              onChange={(e) => {
                updateField('longitude', e.target.value)
                clearFieldError('longitude')
              }}
              placeholder="e.g., -60.6509"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: validationErrors.longitude ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {validationErrors.longitude && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {validationErrors.longitude}
              </p>
            )}
            <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>
              Between -180 and 180
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}