'use client'

import React from 'react'
import { VenueFormData, ValidationErrors } from '../../../../../../../types/types'
import { FormField } from '../../components/FormField'
import { venueBasicInfoSchema } from '@/lib/validations/venueProfile'
import z from 'zod'

interface Step1BasicInfoProps {
  formData: VenueFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

// Map component field names (camelCase) to schema field names (snake_case)
const fieldNameMap: Record<string, keyof typeof venueBasicInfoSchema.shape> = {
  name: 'name',
  description: 'description',
  capacity: 'capacity'
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  setValidationError
}) => {
  // Enhanced updateField with validation
  const handleFieldChange = (field: string, value: any) => {
    updateField(field, value)
    // Clear error immediately when user starts typing
    clearFieldError(field)
  }

  // Validate individual field
  const validateField = (fieldName: string, value: any) => {
    try {
      // Map camelCase field name to snake_case schema field
      const schemaFieldName = fieldNameMap[fieldName]
      if (!schemaFieldName) {
        console.warn(`No schema mapping found for field: ${fieldName}`)
        return false
      }

      const fieldSchema = venueBasicInfoSchema.shape[schemaFieldName]
      if (fieldSchema) {
        fieldSchema.parse(value)
        clearFieldError(fieldName)
        return true
      }
      return false
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (validationErrors && error.issues.length > 0) {
          setValidationError(fieldName, error.issues[0].message)
        }
      }
      return false
    }
  }


  // Validate on blur
  const handleFieldBlur = (field: string) => {
    let value: any

    switch (field) {
      case 'name':
        value = formData.name
        break
      case 'description':
        value = formData.description
        break
      case 'capacity':
        value = formData.capacity
        break
      default:
        return
    }

    validateField(field, value)
  }

  const fieldClassName = 'infoGroup'

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
        Basic Information
      </h3>

      {/* Venue Name */}
      <div style={{ marginBottom: '20px' }}>
        <FormField
          label="Venue Name"
          name="name"
          value={formData.name}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('name')}
          required
          placeholder="Enter your artist name"
          error={validationErrors.name}
          className={fieldClassName}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '20px' }}>        
        <FormField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('description')}
          required
          placeholder="Tell us about your venue..."
          rows={5}
          error={validationErrors.description}
          className={fieldClassName}
        />
      </div>


      {/* Capacity */}
      <div style={{ marginBottom: '20px' }}>
        <FormField
          label="Capacity"
          name="capacity"
          value={formData.capacity}
          type="number"
          min={1}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('capacity')}
          required
          placeholder="Enter venue capacity"
          error={validationErrors.capacity}
          className={fieldClassName}
        />
        <p style={{ fontSize: '12px', marginTop: '4px' }}>
          Enter the maximum capacity of your venue
        </p>
      </div>
    </div>
  )
}