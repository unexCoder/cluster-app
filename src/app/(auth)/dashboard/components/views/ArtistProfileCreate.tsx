'use client'

import { useArtistForm } from '@/hooks/useArtistForm'
import React, { useState, useRef } from 'react'
import styles from './artistProfileCreate.module.css'
import { StepIndicator } from '../components/StepIndicator'
import { Step1BasicInfo } from '../steps/Step1BasicInfo'
import { Step2ContactInfo } from '../steps/Step2ContactInfo'
import { Step3socialLinks } from '../steps/Step3SocialLinks'
import { Step4TechInfo } from '../steps/Step4TechInfo'
import { createArtistProfileAction } from '@/app/actions/artists'
import { ValidationErrors } from '../../../../../../types/types'
import { artistInfoSchema } from '@/lib/validations/artistProfile'
import { z } from 'zod'

interface ArtistProfileCreateProps {
  userId: string
  onNavigate?: (view: string) => void
}

export default function ArtistProfileCreate({ userId, onNavigate }: ArtistProfileCreateProps) {
  const {
    formData,
    currentStep,
    error,
    creating,
    updateField,
    addGenre,
    removeGenre,
    validateStep,
    setCurrentStep,
    setCreating
  } = useArtistForm()

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const setValidationError = (field: string, error: string) => {
    setValidationErrors(prev => ({ ...prev, [field]: error }))
  }

  const clearFieldError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const clearAllErrors = () => {
    setValidationErrors({})
  }

  // Validate Step 1 (Basic Info)
  const validateStep1 = (): boolean => {
    try {
      const dataToValidate = {
        name: formData.name,
        stage_name: formData.stageName,
        bio: formData.bio,
        picture_url: formData.pictureUrl,
        genres: formData.genres
      }

      artistInfoSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          // Map snake_case back to camelCase for error display
          const displayField = field === 'stage_name' ? 'stageName'
            : field === 'picture_url' ? 'pictureUrl'
            : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  // Add validation for other steps as needed
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1()
      case 2:
        // Add Step 2 validation here
        return validateStep(currentStep)
      case 3:
        // Add Step 3 validation here
        return validateStep(currentStep)
      case 4:
        // Add Step 4 validation here
        return validateStep(currentStep)
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    // Clear errors when going back
    clearAllErrors()
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all steps before submission
    if (!validateCurrentStep()) {
      return
    }

    try {
      setCreating(true)

      // Transform to match database schema
      const artistData = {
        user_id: userId,
        name: formData.name,
        stage_name: formData.stageName,
        bio: formData.bio,
        picture_url: formData.pictureUrl,
        genres: formData.genres,
        contact_info: JSON.stringify(formData.contactInfo),
        social_links: JSON.stringify(formData.socialLinks),
        technical_requirements: formData.technical.requirements,
        rider_url: formData.technical.riderUrl,
        presskit_url: formData.technical.presskitUrl
      }

      await createArtistProfileAction(artistData)
      console.log('Profile created successfully:', formData)
      
      // Navigate back or show success message
      onNavigate?.('Artist Profile')
    } catch (err) {
      console.error('Error creating profile:', err)
      setValidationError('submit', 'Failed to create profile. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Create Artist Profile</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of 4
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('Artist Profile')}
          style={{
            padding: '0 16px',
            height: '24px',
            alignSelf: 'flex-end',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>

      <div style={{ background: '#ff00ff66', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <StepIndicator currentStep={currentStep} />

        {/* Show general submission errors */}
        {validationErrors.submit && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            {validationErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              addGenre={addGenre}
              removeGenre={removeGenre}
              setValidationError={setValidationError}
            />
          )}

          {currentStep === 2 && (
            <Step2ContactInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
            />
          )}

          {currentStep === 3 && (
            <Step3socialLinks
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
            />
          )}

          {currentStep === 4 && (
            <Step4TechInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
            />
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                style={{
                  padding: '10px 24px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: '10px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginLeft: 'auto'
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={creating}
                style={{
                  padding: '10px 24px',
                  background: creating ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: creating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  marginLeft: 'auto'
                }}
              >
                {creating ? 'Creating...' : 'Create Profile'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}