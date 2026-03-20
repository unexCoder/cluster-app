'use client'

import React, { useState } from 'react'
import { EventFormData, ValidationErrors } from '../../../../../../../types/types'

interface Step3EventDetailsProps {
  formData: EventFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
  addCategory: (category: string) => void
  removeCategory: (category: string) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'postponed', label: 'Postponed' },
  { value: 'completed', label: 'Completed' },
  { value: 'sold_out', label: 'Sold Out' }
]

const AGE_RESTRICTION_OPTIONS = [
  { value: 'all_ages', label: 'All Ages' },
  { value: '13+', label: '13+' },
  { value: '16+', label: '16+' },
  { value: '18+', label: '18+' },
  { value: '21+', label: '21+' }
]

export const Step3EventDetails: React.FC<Step3EventDetailsProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  addCategory,
  removeCategory,
  addTag,
  removeTag
}) => {
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory)
      setNewCategory('')
    }
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag)
      setNewTag('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
        Event Details
      </h3>

      {/* Status / Age Restriction - two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Status */}
        <div>
          <label
            htmlFor="status"
            style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
          >
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => {
              updateField('status', e.target.value)
              clearFieldError('status')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.status ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: '#3b3b3b'
            }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {validationErrors.status && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.status}</p>
          )}
        </div>

        {/* Age Restriction */}
        <div>
          <label
            htmlFor="ageRestriction"
            style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
          >
            Age Restriction
          </label>
          <select
            id="ageRestriction"
            value={formData.ageRestriction}
            onChange={(e) => {
              updateField('ageRestriction', e.target.value)
              clearFieldError('ageRestriction')
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.ageRestriction ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              backgroundColor: '#3b3b3b'
            }}
          >
            {AGE_RESTRICTION_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {validationErrors.ageRestriction && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.ageRestriction}</p>
          )}
        </div>
      </div>

      {/* Featured Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <input
          id="isFeatured"
          type="checkbox"
          checked={formData.isFeatured}
          onChange={(e) => updateField('isFeatured', e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
        <div>
          <label
            htmlFor="isFeatured"
            style={{ fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}
          >
            Featured Event
          </label>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
            Featured events are highlighted on the homepage and search results
          </p>
        </div>
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="categories"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Categories
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            id="categories"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddCategory)}
            placeholder="e.g., Electronic, Rock, Jazz"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add
          </button>
        </div>
        {formData.categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {formData.categories.map((category, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="tags"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Tags
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            id="tags"
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
            placeholder="e.g., outdoor, family-friendly, VIP"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={handleAddTag}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4338ca',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>
          Tags help users discover your event in searches
        </p>
      </div>
    </div>
  )
}