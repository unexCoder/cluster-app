import React from 'react'
import { PerformanceFormData } from '@/hooks/usePerformanceForm'
import { ValidationErrors } from '../../../../../../../types/types'

interface Step3DetailsProps {
  formData: PerformanceFormData
  validationErrors: ValidationErrors
  updateField: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
}

export function Step3Details({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
}: Step3DetailsProps) {
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
        Performance Details
      </h3>

      {/* Billing Position + Stage row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Billing Position</label>
          <select
            value={formData.billing_position}
            onChange={e => {
              updateField('billing_position', e.target.value as PerformanceFormData['billing_position'])
              clearFieldError('billing_position')
            }}
            style={inputStyle(!!validationErrors.billing_position)}
          >
            <option value="opener">Opener</option>
            <option value="support">Support</option>
            <option value="co_headliner">Co-Headliner</option>
            <option value="headliner">Headliner</option>
          </select>
          {validationErrors.billing_position && (
            <p style={errorStyle}>{validationErrors.billing_position}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Stage</label>
          <input
            type="text"
            value={formData.stage}
            onChange={e => {
              updateField('stage', e.target.value)
              clearFieldError('stage')
            }}
            placeholder="e.g. Main Stage"
            style={inputStyle(!!validationErrors.stage)}
            maxLength={100}
          />
          {validationErrors.stage && (
            <p style={errorStyle}>{validationErrors.stage}</p>
          )}
        </div>
      </div>

      {/* Backstage Access */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Backstage Access</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          {(['full', 'limited', 'none'] as const).map(option => (
            <label key={option} style={radioLabelStyle(formData.backstage_access === option)}>
              <input
                type="radio"
                name="backstage_access"
                value={option}
                checked={formData.backstage_access === option}
                onChange={() => {
                  updateField('backstage_access', option)
                  clearFieldError('backstage_access')
                }}
                style={{ display: 'none' }}
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
        {validationErrors.backstage_access && (
          <p style={errorStyle}>{validationErrors.backstage_access}</p>
        )}
      </div>

      {/* Rider Confirmed */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.rider_confirmed}
            onChange={e => updateField('rider_confirmed', e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          Rider Confirmed
        </label>
        <p style={{ ...hintStyle, marginTop: '4px', marginLeft: '26px' }}>
          Check if the artist rider has been reviewed and confirmed
        </p>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => {
            updateField('notes', e.target.value)
            clearFieldError('notes')
          }}
          placeholder="Any special requirements, instructions, or remarks..."
          rows={4}
          maxLength={2000}
          style={{
            ...inputStyle(!!validationErrors.notes),
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        {validationErrors.notes && (
          <p style={errorStyle}>{validationErrors.notes}</p>
        )}
        <p style={{ ...hintStyle, textAlign: 'right' }}>
          {formData.notes.length} / 2000
        </p>
      </div>
      
      {/* Status */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Performance Status</label>
        <select
          value={formData.status}
          onChange={e => {
            updateField('status', e.target.value as PerformanceFormData['status'])
            clearFieldError('status')
          }}
          style={inputStyle(!!validationErrors.status)}
        >
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="canceled">Canceled</option>
        </select>
        {validationErrors.status && (
          <p style={errorStyle}>{validationErrors.status}</p>
        )}
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

const radioLabelStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 18px',
  borderRadius: '6px',
  border: `1px solid ${active ? '#3b82f6' : '#d1d5db'}`,
  background: active ? '#eff6ff' : '#fff',
  color: active ? '#1d4ed8' : '#374151',
  fontWeight: active ? '600' : '400',
  fontSize: '14px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all 0.15s',
})

const errorStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#ef4444',
  marginTop: '4px',
}

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#9ca3af',
}