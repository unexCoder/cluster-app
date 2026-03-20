// components/steps/Step2ContactInfo.tsx
import React from 'react'
import { FormField } from '../../components/FormField'
import type { ContactInfo, ValidationErrors } from '../../../../../../../types/types'
import styles from '../steps.module.css'
import { contactInfoSchema } from '@/lib/validations/artistProfile';
import { z } from 'zod'


interface Step2Props {
  formData: ContactInfo
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError?: (field: string, error: string) => void
}

// Map component field names (camelCase) to schema field names (snake_case)
const fieldNameMap: Record<string, keyof typeof contactInfoSchema.shape> = {
  name: 'name',
  lastName: 'last_name',
  email: 'email',
  phone: 'phone'
}

export const Step2ContactInfo: React.FC<Step2Props> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  setValidationError
}) => {

  // validation logic
  // Validate individual field
  const validateField = (fieldName: string, value: any) => {
    try {
      // Map camelCase field name to snake_case schema field
      const schemaFieldName = fieldNameMap[fieldName]
      if (!schemaFieldName) {
        console.warn(`No schema mapping found for field: ${fieldName}`)
        return false
      }

      const fieldSchema = contactInfoSchema.shape[schemaFieldName]
      if (fieldSchema) {
        fieldSchema.parse(value)
        clearFieldError(fieldName)
        return true
      }
      return false
    } catch (error) {
      if (error instanceof z.ZodError) {
        if (setValidationError && error.issues.length > 0) {
          setValidationError(fieldName, error.issues[0].message)
        }
      }
      return false
    }
  }

  // Enhanced updateField with validation
  const handleFieldChange = (field: string, value: any) => {
    updateField(field, value)
    // Clear error immediately when user starts typing
    clearFieldError(field)
  }

  // Validate on blur
  const handleFieldBlur = (field: string) => {
    let value: any

    switch (field) {
      case 'name':
        value = formData.name
        break
      case 'lastName':
        value = formData.lastName
        break
      case 'email':
        value = formData.email
        break
      case 'phone':
        value = formData.phone
        break
      default:
        return
    }

    validateField(field, value)
  }


  // style
  const fieldClassName = 'infoGroup'

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        Contact Information
      </h3>
      <p style={{ fontSize: '14px', marginBottom: '24px' }}>
        How can venues and promoters reach you?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Two-column grid for names */}
        <div className={styles.innerFormContainer}>
          <FormField
            label="First Name"
            name="contactInfo.name"
            value={formData.name}
            onChange={handleFieldChange}
            onFocus={clearFieldError}
            onBlur={() => handleFieldBlur('name')}
            placeholder="First name"
            error={validationErrors['name']}
            className={fieldClassName}
          />

          <FormField
            label="Last Name"
            name="contactInfo.lastName"
            value={formData.lastName}
            onChange={handleFieldChange}
            onFocus={clearFieldError}
            onBlur={() => handleFieldBlur('lastName')}
            placeholder="Last name"
            error={validationErrors['lastName']}
            className={fieldClassName}
          />
        </div>

        <FormField
          label="Email"
          name="contactInfo.email"
          type="email"
          value={formData.email}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('email')}
          required
          placeholder="you@yourmail.com"
          error={validationErrors['email']}
          className={fieldClassName}
        />

        <FormField
          label="Phone"
          name="contactInfo.phone"
          type="tel"
          value={formData.phone}
          onChange={handleFieldChange}
          onFocus={clearFieldError}
          onBlur={() => handleFieldBlur('phone')}
          placeholder="+54 (555) 123-4567"
          error={validationErrors['phone']}
          className={fieldClassName}
        />
      </div>
    </div>
  )
}