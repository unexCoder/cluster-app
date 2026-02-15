import React from 'react'
import { PerformanceFormData } from '@/hooks/usePerformanceForm'
import { ValidationErrors } from '../../../../../../../types/types'

interface Step2ScheduleProps {
  formData: PerformanceFormData
  validationErrors: ValidationErrors
  updateField: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

export function Step2Schedule({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
}: Step2ScheduleProps) {
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        Schedule
      </h3>

      {/* Start / End time row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Start Time</label>
          <input
            type="datetime-local"
            value={formData.start_time}
            onChange={e => {
              updateField('start_time', e.target.value)
              clearFieldError('start_time')
              clearFieldError('end_time') // re-validate end_time when start changes
            }}
            style={inputStyle(!!validationErrors.start_time)}
          />
          {validationErrors.start_time && (
            <p style={errorStyle}>{validationErrors.start_time}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>End Time</label>
          <input
            type="datetime-local"
            value={formData.end_time}
            onChange={e => {
              updateField('end_time', e.target.value)
              clearFieldError('end_time')
            }}
            style={inputStyle(!!validationErrors.end_time)}
          />
          {validationErrors.end_time && (
            <p style={errorStyle}>{validationErrors.end_time}</p>
          )}
        </div>
      </div>

      {/* Soundcheck Time */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Soundcheck Time</label>
        <input
          type="datetime-local"
          value={formData.soundcheck_time}
          onChange={e => {
            updateField('soundcheck_time', e.target.value)
            clearFieldError('soundcheck_time')
          }}
          style={inputStyle(!!validationErrors.soundcheck_time)}
        />
        {validationErrors.soundcheck_time && (
          <p style={errorStyle}>{validationErrors.soundcheck_time}</p>
        )}
        <p style={hintStyle}>Optional — leave blank if not yet scheduled</p>
      </div>

      {/* Set Duration */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Set Duration (minutes)</label>
        <input
          type="number"
          min={1}
          value={formData.set_duration_minutes}
          onChange={e => {
            updateField('set_duration_minutes', e.target.value)
            clearFieldError('set_duration_minutes')
          }}
          placeholder="e.g. 45"
          style={inputStyle(!!validationErrors.set_duration_minutes)}
        />
        {validationErrors.set_duration_minutes && (
          <p style={errorStyle}>{validationErrors.set_duration_minutes}</p>
        )}
        <p style={hintStyle}>Optional — total stage time in minutes</p>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '16px',
  fontWeight: '500',
  color: '#fff',
  marginBottom: '6px',
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
  borderRadius: '6px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  // background: '#fff',
})

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#ef4444',
  marginTop: '4px',
}

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
  marginTop: '4px',
}