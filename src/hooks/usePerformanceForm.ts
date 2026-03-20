import { useState } from 'react'

export type PerformanceType =
  | 'live_set'
  | 'dj_set'
  | 'a/v_set'
  | 'visuals'
  | 'live_cinema'
  | 'sound_installation'
  | 'other'

export type PerformanceStatusType =
  | 'scheduled'
  | 'confirmed'
  | 'canceled'

export interface PerformanceFormData {
  // Step 1 — Link
  event_id: string
  artist_id: string
  performance_type: PerformanceType
  status: PerformanceStatusType
  performance_order: string // kept as string for input, parsed on submit

  // Step 2 — Schedule
  start_time: string
  end_time: string
  soundcheck_time: string
  set_duration_minutes: string // string for input

  // Step 3 — Details
  stage: string
  billing_position: 'headliner' | 'co_headliner' | 'support' | 'opener'
  backstage_access: 'full' | 'limited' | 'none'
  rider_confirmed: boolean
  notes: string
}

const defaultFormData: PerformanceFormData = {
  event_id: '',
  artist_id: '',
  performance_type: 'live_set',
  status: 'scheduled',
  performance_order: '1',
  start_time: '',
  end_time: '',
  soundcheck_time: '',
  set_duration_minutes: '',
  stage: '',
  billing_position: 'support',
  backstage_access: 'limited',
  rider_confirmed: false,
  notes: '',
}

export function usePerformanceForm() {
  const [formData, setFormData] = useState<PerformanceFormData>(defaultFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const updateField = <K extends keyof PerformanceFormData>(
    field: K,
    value: PerformanceFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const reset = () => {
    setFormData(defaultFormData)
    setCurrentStep(1)
  }

  return {
    formData,
    setFormData,
    currentStep,
    setCurrentStep,
    submitting,
    setSubmitting,
    updateField,
    reset,
  }
}