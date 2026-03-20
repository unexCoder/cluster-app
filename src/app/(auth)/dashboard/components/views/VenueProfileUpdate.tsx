import { useVenueForm } from '@/hooks/useVenueForm'
import React, { useEffect, useRef, useState } from 'react'
import { ValidationErrors } from '../../../../../../types/types'
import { venueBasicInfoSchema, venueContactSchema, venueDetailsSchema, venueLocationSchema } from '@/lib/validations/venueProfile'
import { updateVenueAction } from '@/app/actions/venues'
import z from 'zod'
import { StepIndicator } from '../components/StepIndicator'
import { Step1BasicInfo } from '../steps/venue/Step1BasicInfo'
import { Step2LocationInfo } from '../steps/venue/Step2LocationInfo'
import { Step3ContactInfo } from '../steps/venue/Step3ContactInfo'
import { Step4VenueDetails } from '../steps/venue/Step4VenueDetails'
import styles from './venueProfileCreate.module.css'

interface VenueProfileUpdateProps {
  venueId: string
  initialData: any // Replace with your artist profile type
  onNavigate: (view: string, venueId?: string) => void  // Add this prop
}

export default function VenueProfileUpdate({ venueId, initialData, onNavigate }: VenueProfileUpdateProps) {
  const {
    formData,
    currentStep,
    creating,
    updateField,
    addAmenity,
    removeAmenity,
    addImageUrl,
    removeImageUrl,
    setCurrentStep,
    setCreating,
    setFormData
  } = useVenueForm()

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
        description: formData.description,
        capacity: formData.capacity ? Number(formData.capacity) : undefined
      }
      venueBasicInfoSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          setValidationError(field, issue.message)
        })
      }
      return false
    }
  }

  // Validate Step 2 (Location Info)
  const validateStep2 = (): boolean => {
    try {
      const dataToValidate = {
        address: formData.address,
        city: formData.city,
        country: formData.country,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined
      }

      venueLocationSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          setValidationError(field, issue.message)
        })
      }
      return false
    }
  }

  // Validate Step 3 (Contact Info)
  const validateStep3 = (): boolean => {
    try {
      const dataToValidate = {
        name: formData.contactInfo.name,
        email: formData.contactInfo.email,
        phone: formData.contactInfo.phone,
        website: formData.contactInfo.website
      }

      venueContactSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          setValidationError(field, issue.message)
        })
      }
      return false
    }
  }

  // Validate Step 4 (Venue Details)
  const validateStep4 = (): boolean => {
    try {
      const dataToValidate = {
        type: formData.venueInfo.type,
        amenities: formData.venueInfo.amenities,
        accessibility: formData.venueInfo.accessibility,
        parking_info: formData.venueInfo.parkingInfo,
        public_transport: formData.venueInfo.publicTransport,
        image_urls: formData.imageUrls
      }

      venueDetailsSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          // Map snake_case back to camelCase for error display
          const displayField = field === 'parking_info' ? 'parkingInfo'
            : field === 'public_transport' ? 'publicTransport'
              : field === 'image_urls' ? 'imageUrls'
                : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateStep1()
      case 2:
        return validateStep2()
      case 3:
        return validateStep3()
      case 4:
        return validateStep4()
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
    clearAllErrors()
    setCurrentStep(currentStep - 1)
  }


  const [canSubmit, setCanSubmit] = useState(false)
  const submitAttemptedRef = useRef(false)

  // Unified effect for step transitions
  useEffect(() => {
    // Reset submission guard whenever step changes
    submitAttemptedRef.current = false

    if (currentStep === 4) {
      // Disable submission initially
      setCanSubmit(false)

      // Enable submission after component is fully mounted and stable
      const timer = setTimeout(() => {
        setCanSubmit(true)
      }, 300) // 300ms delay

      return () => clearTimeout(timer)
    } else {
      // Disable submission on any other step
      setCanSubmit(false)
    }
  }, [currentStep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Prevent duplicate/accidental submissions
    if (submitAttemptedRef.current) {
      console.log('BLOCKED: Already submitted')
      return
    }

    // Only allow submission on step 4
    if (currentStep !== 4) {
      console.log('BLOCKED: Not on step 4')
      return
    }

    // Add a small delay to ensure step transition is complete
    await new Promise(resolve => setTimeout(resolve, 100))


    if (!validateCurrentStep()) {
      return
    }

    submitAttemptedRef.current = true

    try {
      setCreating(true)

      // Transform to match database schema
      const venueData = {
        name: formData.name,
        description: formData.description,
        capacity: Number(formData.capacity),
        address: formData.address,
        city: formData.city,
        country: formData.country,
        // latitude: formData.latitude ? Number(formData.latitude) : null,
        // longitude: formData.longitude ? Number(formData.longitude) : null,
        latitude: formData.latitude && formData.latitude.trim() !== '' ? Number(formData.latitude) : null,
        longitude: formData.longitude && formData.longitude.trim() !== '' ? Number(formData.longitude) : null,
        contact_info: JSON.stringify(formData.contactInfo),
        venue_info: JSON.stringify(formData.venueInfo),
        image_urls: JSON.stringify(formData.imageUrls)
      }

      await updateVenueAction(venueId, venueData)
      console.log('Venue updated successfully:', formData)

      onNavigate?.('Venues', venueId)
    } catch (err) {
      console.error('Error creating venue:', err)
      setValidationError('submit', 'Failed to create venue. Please try again.')
      submitAttemptedRef.current = false // Reset on error
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        capacity: initialData.capacity?.toString() || '',
        address: initialData.address,
        city: initialData.city,
        country: initialData.country,
        latitude: initialData.latitude?.toString() || '',
        longitude: initialData.longitude?.toString() || '',
        contactInfo: typeof initialData.contact_info === 'string'
          ? JSON.parse(initialData.contact_info)
          : initialData.contact_info,
        venueInfo: typeof initialData.venue_info === 'string'
          ? JSON.parse(initialData.venue_info)
          : initialData.venue_info,
        imageUrls: typeof initialData.image_urls === 'string'
          ? JSON.parse(initialData.image_urls)
          : initialData.image_urls
      })
    }
  }, [initialData])

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Edit Venue Profile</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of 4
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Venues')}
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
        <StepIndicator 
          currentStep={currentStep} 
          steps={[
            { number: 1, label: 'Basic Info' },
            { number: 2, label: 'Location' },
            { number: 3, label: 'Contact Info' },
            { number: 4, label: 'Venue Details' }
          ]} 
        />

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

        <form onSubmit={handleSubmit} >
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}

          {currentStep === 2 && (
            <Step2LocationInfo
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}

          {currentStep === 3 && (
            <Step3ContactInfo
              formData={formData.contactInfo}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}

          {currentStep === 4 && (
            <Step4VenueDetails
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
              addAmenity={addAmenity}
              removeAmenity={removeAmenity}
              addImageUrl={addImageUrl}
              removeImageUrl={removeImageUrl}
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
                disabled={creating || !canSubmit}
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
                {creating ? 'Updating...' : 'Update Venue'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
