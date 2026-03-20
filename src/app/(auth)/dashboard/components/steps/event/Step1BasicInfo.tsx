'use client'

import React from 'react'
import { EventFormData, ValidationErrors } from '../../../../../../../types/types'
import { FormField } from '../../components/FormField'

const EVENT_TYPES = [
  { value: 'concert', label: 'Concert' },
  { value: 'festival', label: 'Festival' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'exhibition', label: 'Exhibition' },
  { value: 'party', label: 'Party' },
  { value: 'other', label: 'Other' }
]

interface Step1BasicInfoProps {
  formData: EventFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError
}) => {

  // Enhanced updateField with validation
  const handleFieldChange = (field: string, value: any) => {
    updateField(field, value)
    // Clear error immediately when user starts typing
    clearFieldError(field)
  }
 
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
        Basic Information
      </h3>

      {/* Event Name */}
      <div style={{ marginBottom: '20px' }}>
        <FormField
          label="Event Name"
          name="name"
          value={formData.name}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          // onBlur={() => handleFieldBlur('name')}
          required
          placeholder="Enter event name"
          error={validationErrors.name}
        />
      </div>

      {/* Event Type */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="eventType"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#DADEE5' }}
        >
          Event Type <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          id="eventType"
          value={formData.eventType}
          onChange={(e) => {
            updateField('eventType', e.target.value)
            clearFieldError('eventType')
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.eventType ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: '#3b3b3b'
          }}
        >
          <option value="">Select event type</option>
          {EVENT_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {validationErrors.eventType && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.eventType}</p>
        )}
      </div>

      {/* Description */}
      <div style={{ marginBottom: '20px' }}>
        <FormField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          // onBlur={() => handleFieldBlur('bio')}
          required
          placeholder="Describe your event in detail..."
          rows={5}
          error={validationErrors.description}        
          />
      </div>

      {/* Short Description */}
      <div style={{ marginBottom: '20px' }}>
        <FormField
          label="Short Description"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          // onBlur={() => handleFieldBlur('bio')}
          required
          placeholder="A brief summary shown in event listings (max 500 characters)"
          rows={3}
          error={validationErrors.shortDescription}        
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          {validationErrors.shortDescription
            ? <p style={{ color: '#ef4444', fontSize: '12px' }}>{validationErrors.shortDescription}</p>
            : <span />
          }
          <p style={{ color: '#DADEE5', fontSize: '12px' }}>
            {formData.shortDescription.length}/500
          </p>
        </div>
      </div>
    </div>
  )
}