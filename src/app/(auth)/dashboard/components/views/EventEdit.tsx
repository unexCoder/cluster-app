'use client'

import { useEventForm } from '@/hooks/useEventForm'
import React, { useEffect, useRef, useState } from 'react'
import styles from './eventCreate.module.css'
import { StepIndicator } from '../components/StepIndicator'
import { Step1BasicInfo } from '../steps/event/Step1BasicInfo'
import { Step2DateVenue } from '../steps/event/Step2DateVenue'
import { Step3EventDetails } from '../steps/event/Step3EventDetails'
import { Step4MediaPolicies } from '../steps/event/Step4MediaPolicies'
import { updateEventAction } from '@/app/actions/events'
import { ValidationErrors } from '../../../../../../types/types'
import {
  eventBasicInfoSchema,
  eventDateVenueSchema,
  eventDetailsSchema,
  eventMediaPoliciesSchema
} from '@/lib/validations/eventProfile'
import { z } from 'zod'

interface EventUpdateProps {
  eventId: string
  initialData: any
  onNavigate: (view: string, eventId?: string) => void
}

export default function EventEdit({ eventId, initialData, onNavigate }: EventUpdateProps) {
  const {
    formData,
    currentStep,
    creating,
    updateField,
    addCategory,
    removeCategory,
    addTag,
    removeTag,
    addMediaUrl,
    removeMediaUrl,
    addProhibitedItem,
    removeProhibitedItem,
    setCurrentStep,
    setCreating,
    setFormData
  } = useEventForm()

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
        short_description: formData.shortDescription || undefined,
        event_type: formData.eventType
      }

      eventBasicInfoSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          const displayField = field === 'short_description' ? 'shortDescription'
            : field === 'event_type' ? 'eventType'
              : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  // Validate Step 2 (Date & Venue)
  const validateStep2 = (): boolean => {
    try {
      const dataToValidate = {
        venue_id: formData.venueId,
        start_date_time: formData.startDateTime,
        end_date_time: formData.endDateTime,
        doors_open_time: formData.doorsOpenTime || undefined,
        timezone: formData.timezone,
        remaining_capacity: formData.remainingCapacity ? Number(formData.remainingCapacity) : undefined
      }

      eventDateVenueSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          const displayField = field === 'venue_id' ? 'venueId'
            : field === 'start_date_time' ? 'startDateTime'
              : field === 'end_date_time' ? 'endDateTime'
                : field === 'doors_open_time' ? 'doorsOpenTime'
                  : field === 'remaining_capacity' ? 'remainingCapacity'
                    : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  // Validate Step 3 (Event Details)
  const validateStep3 = (): boolean => {
    try {
      const dataToValidate = {
        status: formData.status,
        age_restriction: formData.ageRestriction,
        is_featured: formData.isFeatured,
        categories: formData.categories,
        tags: formData.tags
      }

      eventDetailsSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          const displayField = field === 'age_restriction' ? 'ageRestriction'
            : field === 'is_featured' ? 'isFeatured'
              : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  // Validate Step 4 (Media & Policies)
  const validateStep4 = (): boolean => {
    try {
      const dataToValidate = {
        images: formData.mediaUrls.images,
        videos: formData.mediaUrls.videos,
        poster: formData.mediaUrls.poster || undefined,
        refund_policy: formData.eventPolicies.refundPolicy || undefined,
        accessibility_info: formData.eventPolicies.accessibilityInfo || undefined,
        prohibited_items: formData.eventPolicies.prohibitedItems,
        general_rules: formData.eventPolicies.generalRules || undefined
      }

      eventMediaPoliciesSchema.parse(dataToValidate)
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          const field = issue.path[0] as string
          const displayField = field === 'refund_policy' ? 'refundPolicy'
            : field === 'accessibility_info' ? 'accessibilityInfo'
              : field === 'prohibited_items' ? 'prohibitedItems'
                : field === 'general_rules' ? 'generalRules'
                  : field
          setValidationError(displayField, issue.message)
        })
      }
      return false
    }
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: return validateStep1()
      case 2: return validateStep2()
      case 3: return validateStep3()
      case 4: return validateStep4()
      default: return true
    }
  }

  const handleNext = () => {
    console.log('handleNext called, currentStep:', currentStep)
    const valid = validateCurrentStep()
    console.log('valid:', valid)
    if (valid) {
      setCurrentStep(currentStep + 1)
      console.log('setCurrentStep called with:', currentStep + 1)
    }
    // if (validateCurrentStep()) {
    //   setCurrentStep(currentStep + 1)
    // }
  }

  const handlePrevious = () => {
    clearAllErrors()
    setCurrentStep(currentStep - 1)
  }

  const [canSubmit, setCanSubmit] = useState(false)
  const submitAttemptedRef = useRef(false)

  useEffect(() => {
    submitAttemptedRef.current = false

    if (currentStep === 4) {
      setCanSubmit(false)
      const timer = setTimeout(() => setCanSubmit(true), 300)
      return () => clearTimeout(timer)
    } else {
      setCanSubmit(false)
    }
  }, [currentStep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (submitAttemptedRef.current) return
    if (currentStep !== 4) return

    await new Promise(resolve => setTimeout(resolve, 100))

    if (!validateCurrentStep()) return

    submitAttemptedRef.current = true

    try {
      setCreating(true)

      const eventData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription || undefined,
        venue_id: formData.venueId,
        start_date_time: formData.startDateTime,
        end_date_time: formData.endDateTime,
        doors_open_time: formData.doorsOpenTime || null,
        timezone: formData.timezone,
        status: formData.status,
        is_featured: formData.isFeatured,
        age_restriction: formData.ageRestriction,
        event_type: formData.eventType as 'concert' | 'festival' | 'workshop' | 'conference' | 'exhibition' | 'party' | 'other',
        categories: JSON.stringify(formData.categories),
        tags: JSON.stringify(formData.tags),
        media_urls: JSON.stringify(formData.mediaUrls),
        event_policies: JSON.stringify(formData.eventPolicies),
        remaining_capacity: Number(formData.remainingCapacity)
      }

      await updateEventAction(eventId, eventData)

      onNavigate?.('Events', eventId)
    } catch (err) {
      console.error('Error updating event:', err)
      setValidationError('submit', 'Failed to update event. Please try again.')
      submitAttemptedRef.current = false
    } finally {
      setCreating(false)
    }
  }

  // helper to normalize DB datetime → datetime-local format
  const toDateTimeLocal = (value: string | null | undefined): string => {
    if (!value) return ''
    // handles both "2024-11-15T20:00:00.000Z" and "2024-11-15 20:00:00"
    return new Date(value).toISOString().slice(0, 16)  // "YYYY-MM-DDTHH:MM"
  }

  // Populate form with existing event data
  useEffect(() => {
    if (!initialData) return

    const parseJsonArray = (value: any): string[] => {
      if (Array.isArray(value)) return value
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }
      return []
    }

    const parseJsonObject = (value: any, fallback: object) => {
      if (value && typeof value === 'object') return value
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) ?? fallback
        } catch {
          return fallback
        }
      }
      return fallback
    }

    setFormData({
      name: initialData.name ?? '',
      description: initialData.description ?? '',
      shortDescription: initialData.short_description ?? '',
      eventType: initialData.event_type ?? '',
      venueId: initialData.venue_id ?? '',
      startDateTime: toDateTimeLocal(initialData.start_date_time),
      endDateTime: toDateTimeLocal(initialData.end_date_time),
      doorsOpenTime: toDateTimeLocal(initialData.doors_open_time),
      timezone: initialData.timezone ?? 'UTC',
      remainingCapacity: initialData.remaining_capacity?.toString() ?? '',
      status: initialData.status ?? 'draft',
      // isFeatured: initialData.is_featured ?? false,
      isFeatured: Boolean(initialData.is_featured), // ← converts 1/0 to true/false
      ageRestriction: initialData.age_restriction ?? 'all_ages',
      categories: parseJsonArray(initialData.categories),   // ← never null
      tags: parseJsonArray(initialData.tags),               // ← never null
      mediaUrls: parseJsonObject(initialData.media_urls, {
        images: [],
        videos: [],
        poster: ''
      }),
      eventPolicies: parseJsonObject(initialData.event_policies, {
        refundPolicy: '',
        accessibilityInfo: '',
        covidPolicies: '',
        prohibitedItems: [],
        generalRules: ''
      })
    })
  }, [initialData])

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Edit Event</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of 4
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Event List')}
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
            { number: 2, label: 'Date & Venue' },
            { number: 3, label: 'Event Details' },
            { number: 4, label: 'Media & Policies' }
          ]}
        />

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
              setValidationError={setValidationError}
            />
          )}

          {currentStep === 2 && (
            <Step2DateVenue
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}

          {currentStep === 3 && (
            <Step3EventDetails
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
              addCategory={addCategory}
              removeCategory={removeCategory}
              addTag={addTag}
              removeTag={removeTag}
            />
          )}

          {currentStep === 4 && (
            <Step4MediaPolicies
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
              addMediaUrl={addMediaUrl}
              removeMediaUrl={removeMediaUrl}
              addProhibitedItem={addProhibitedItem}
              removeProhibitedItem={removeProhibitedItem}
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
                {creating ? 'Updating...' : 'Update Event'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
