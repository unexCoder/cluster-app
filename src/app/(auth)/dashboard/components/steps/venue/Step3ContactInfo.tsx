'use client'

import React from 'react'
import { ValidationErrors } from '../../../../../../../types/types'

interface ContactInfo {
  name: string
  email: string
  phone: string
  website: string
}

interface Step3ContactInfoProps {
  formData: ContactInfo
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

export const Step3ContactInfo: React.FC<Step3ContactInfoProps> = ({
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
        Contact Information
      </h3>

      <p style={{ fontSize: '14px', marginBottom: '24px' }}>
        Provide contact details for venue management and inquiries
      </p>

      {/* Contact Name */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="contactName"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Contact Name
        </label>
        <input
          id="contactName"
          type="text"
          value={formData.name}
          onChange={(e) => {
            updateField('contactInfo.name', e.target.value)
            clearFieldError('name')
          }}
          placeholder="Full name of contact person"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.name && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Email <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            updateField('contactInfo.email', e.target.value)
            clearFieldError('email')
          }}
          placeholder="contact@venue.com"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.email && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="phone"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            updateField('contactInfo.phone', e.target.value)
            clearFieldError('phone')
          }}
          placeholder="+54 341 123-4567"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.phone && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.phone}
          </p>
        )}
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          Include country code for international calls
        </p>
      </div>

      {/* Website */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="website"
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => {
            updateField('contactInfo.website', e.target.value)
            clearFieldError('website')
          }}
          placeholder="https://www.yourvenue.com"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.website ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.website && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
            {validationErrors.website}
          </p>
        )}
        <p style={{  fontSize: '12px', marginTop: '4px' }}>
          Include full URL with https://
        </p>
      </div>

      {/* <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '6px',
        padding: '12px',
        marginTop: '24px'
      }}>
        <p style={{ fontSize: '13px', color: '#1e40af', margin: 0 }}>
          💡 <strong>Tip:</strong> This contact information will be visible to event organizers and artists looking to book your venue.
        </p>
      </div> */}
    </div>
  )
}