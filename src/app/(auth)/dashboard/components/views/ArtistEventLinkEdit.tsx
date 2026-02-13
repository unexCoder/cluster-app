
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePerformanceForm } from '@/hooks/usePerformanceForm'
import { updateEventArtistPerformanceAction, type EventArtistPerformanceRow } from '@/app/actions/artist-event-link'
import { ValidationErrors } from '../../../../../../types/types'
import {
  performanceLinkSchema,
  performanceScheduleSchema,
  performanceDetailsSchema,
} from '@/lib/validations/artistEventLink'
import { z } from 'zod'
import { StepIndicator } from '../components/StepIndicator'
import { Step1Link } from '../steps/performance/Step1Link'
import { Step2Schedule } from '../steps/performance/Step2Schedule'
import { Step3Details } from '../steps/performance/Step3Details'
import styles from './venueProfileCreate.module.css'

interface ArtistEventLinkEditProps {
  performanceId: string
  initialData: EventArtistPerformanceRow
  onNavigate: (view: string, id?: string) => void
}

export default function ArtistEventLinkEdit({
  performanceId,
  initialData,
  onNavigate,
}: ArtistEventLinkEditProps) {
  const {
    formData,
    currentStep,
    submitting,
    updateField,
    setCurrentStep,
    setSubmitting,
    setFormData,
  } = usePerformanceForm()

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

  const clearAllErrors = () => setValidationErrors({})

  // ── Hydrate form from initialData ────────────────────────────────────────────

  useEffect(() => {
    if (initialData) {
      const toDatetimeLocal = (d: Date | null): string => {
        if (!d) return ''
        const date = new Date(d)
        // datetime-local input expects "YYYY-MM-DDTHH:mm"
        return date.toISOString().slice(0, 16)
      }

      setFormData({
        event_id: initialData.event_id,
        artist_id: initialData.artist_id,
        performance_type: initialData.performance_type,
        performance_order: initialData.performance_order.toString(),
        start_time: toDatetimeLocal(initialData.start_time),
        end_time: toDatetimeLocal(initialData.end_time),
        soundcheck_time: toDatetimeLocal(initialData.soundcheck_time),
        set_duration_minutes: initialData.set_duration_minutes?.toString() ?? '',
        stage: initialData.stage ?? '',
        billing_position: initialData.billing_position ?? 'support',
        backstage_access: initialData.backstage_access,
        rider_confirmed: Boolean(initialData.rider_confirmed),
        notes: initialData.notes ?? '',
      })
    }
  }, [initialData])

  // ── Step validators ──────────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    try {
      performanceLinkSchema.parse({
        event_id: formData.event_id,
        artist_id: formData.artist_id,
        performance_order: formData.performance_order
          ? Number(formData.performance_order)
          : undefined,
      })
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          setValidationError(issue.path[0] as string, issue.message)
        })
      }
      return false
    }
  }

  const validateStep2 = (): boolean => {
    try {
      performanceScheduleSchema.parse({
        start_time: formData.start_time || undefined,
        end_time: formData.end_time || undefined,
        soundcheck_time: formData.soundcheck_time || undefined,
        set_duration_minutes: formData.set_duration_minutes
          ? Number(formData.set_duration_minutes)
          : undefined,
      })
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          setValidationError(issue.path[0] as string, issue.message)
        })
      }
      return false
    }
  }

  const validateStep3 = (): boolean => {
    try {
      performanceDetailsSchema.parse({
        stage: formData.stage || undefined,
        billing_position: formData.billing_position,
        backstage_access: formData.backstage_access,
        rider_confirmed: formData.rider_confirmed,
        notes: formData.notes || undefined,
      })
      clearAllErrors()
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(issue => {
          setValidationError(issue.path[0] as string, issue.message)
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
      default: return true
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    clearAllErrors()
    setCurrentStep(currentStep - 1)
  }

  // ── Submit guard ─────────────────────────────────────────────────────────────

  const [canSubmit, setCanSubmit] = useState(false)
  const submitAttemptedRef = useRef(false)

  useEffect(() => {
    submitAttemptedRef.current = false

    if (currentStep === 3) {
      setCanSubmit(false)
      const timer = setTimeout(() => setCanSubmit(true), 300)
      return () => clearTimeout(timer)
    } else {
      setCanSubmit(false)
    }
  }, [currentStep])

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (submitAttemptedRef.current) return
    if (currentStep !== 3) return

    await new Promise(resolve => setTimeout(resolve, 100))

    if (!validateCurrentStep()) return

    submitAttemptedRef.current = true

    try {
      setSubmitting(true)

      const performanceData = {
        event_id: formData.event_id,
        artist_id: formData.artist_id,
        performance_order: Number(formData.performance_order),
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        soundcheck_time: formData.soundcheck_time || null,
        set_duration_minutes: formData.set_duration_minutes
          ? Number(formData.set_duration_minutes)
          : null,
        stage: formData.stage || null,
        billing_position: formData.billing_position,
        backstage_access: formData.backstage_access,
        rider_confirmed: formData.rider_confirmed,
        notes: formData.notes || null,
      }

      const result = await updateEventArtistPerformanceAction(performanceId, performanceData)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update performance')
      }

      onNavigate('Browse Performances', performanceId)
    } catch (err) {
      console.error('Error updating performance:', err)
      setValidationError('submit', err instanceof Error ? err.message : 'Failed to update performance. Please try again.')
      submitAttemptedRef.current = false
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Edit Performance</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of 3
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Browse Performances')}
          style={cancelButtonStyle}
        >
          Cancel
        </button>
      </div>

      <div style={cardStyle}>
        <StepIndicator
          currentStep={currentStep}
          steps={[
            { number: 1, label: 'Link' },
            { number: 2, label: 'Schedule' },
            { number: 3, label: 'Details' },
          ]}
        />

        {validationErrors.submit && (
          <div style={submitErrorStyle}>{validationErrors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <Step1Link
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}
          {currentStep === 2 && (
            <Step2Schedule
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}
          {currentStep === 3 && (
            <Step3Details
              formData={formData}
              validationErrors={validationErrors}
              updateField={updateField}
              clearFieldError={clearFieldError}
              setValidationError={setValidationError}
            />
          )}

          <div style={navRowStyle}>
            {currentStep > 1 && (
              <button type="button" onClick={handlePrevious} style={prevButtonStyle}>
                Previous
              </button>
            )}

            {currentStep < 3 ? (
              <button type="button" onClick={handleNext} style={nextButtonStyle}>
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                style={submitButtonStyle(submitting)}
              >
                {submitting ? 'Updating...' : 'Update Performance'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  background: '#ff00ff66',
  borderRadius: '12px',
  padding: '32px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  minWidth:'400px'
}

const cancelButtonStyle: React.CSSProperties = {
  padding: '0 16px',
  height: '24px',
  alignSelf: 'flex-end',
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
}

const submitErrorStyle: React.CSSProperties = {
  padding: '12px',
  marginBottom: '16px',
  background: '#fee2e2',
  color: '#991b1b',
  borderRadius: '6px',
  fontSize: '14px',
}

const navRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '32px',
  paddingTop: '24px',
  borderTop: '1px solid #e5e7eb',
}

const prevButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
}

const nextButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  marginLeft: 'auto',
}

const submitButtonStyle = (submitting: boolean): React.CSSProperties => ({
  padding: '10px 24px',
  background: submitting ? '#93c5fd' : '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: submitting ? 'not-allowed' : 'pointer',
  fontSize: '14px',
  marginLeft: 'auto',
})