// components/steps/Step2ContactInfo.tsx
import React from 'react'
import { FormField } from '../components/FormField'
import type { ArtistFormData, ValidationErrors } from '../../../../../../types/types'
import styles from './steps.module.css'

interface Step2Props {
  formData: ArtistFormData  // ✅ Use full form data
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
}

export const Step2ContactInfo: React.FC<Step2Props> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError
}) => {
  const fieldClassName = 'infoGroup'

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        Contact Information
      </h3>
      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
        How can venues and promoters reach you?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Two-column grid for names */}
        <div className={styles.innerFormContainer}>
          <FormField
            label="First Name"
            name="contactInfo.name"
            value={formData.contactInfo.name}
            onChange={updateField}
            onFocus={clearFieldError}
            placeholder="First name"
            error={validationErrors['contactInfo.name']}
            className={fieldClassName}
          />

          <FormField
            label="Last Name"
            name="contactInfo.lastName"
            value={formData.contactInfo.lastName}
            onChange={updateField}
            onFocus={clearFieldError}
            placeholder="Last name"
            error={validationErrors['contactInfo.lastName']}
            className={fieldClassName}
          />
        </div>

        <FormField
          label="Email"
          name="contactInfo.email"
          type="email"
          value={formData.contactInfo.email}
          onChange={updateField}
          onFocus={clearFieldError}
          required
          placeholder="you@yourmail.com"
          error={validationErrors['contactInfo.email']}
          className={fieldClassName}
        />

        <FormField
          label="Phone"
          name="contactInfo.phone"
          type="tel"
          value={formData.contactInfo.phone}
          onChange={updateField}
          onFocus={clearFieldError}
          placeholder="+54 (555) 123-4567"
          error={validationErrors['contactInfo.phone']}
          className={fieldClassName}
        />
      </div>
    </div>
  )
}