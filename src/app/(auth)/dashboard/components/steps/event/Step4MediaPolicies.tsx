'use client'

import React, { useState } from 'react'
import { EventFormData, ValidationErrors } from '../../../../../../../types/types'

interface Step4MediaPoliciesProps {
  formData: EventFormData
  validationErrors: ValidationErrors
  updateField: (field: string, value: any) => void
  clearFieldError: (field: string) => void
  setValidationError: (field: string, error: string) => void
  addMediaUrl: (type: 'images' | 'videos', url: string) => void
  removeMediaUrl: (type: 'images' | 'videos', url: string) => void
  addProhibitedItem: (item: string) => void
  removeProhibitedItem: (item: string) => void
}

export const Step4MediaPolicies: React.FC<Step4MediaPoliciesProps> = ({
  formData,
  validationErrors,
  updateField,
  clearFieldError,
  addMediaUrl,
  removeMediaUrl,
  addProhibitedItem,
  removeProhibitedItem
}) => {
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newProhibitedItem, setNewProhibitedItem] = useState('')

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      addMediaUrl('images', newImageUrl)
      setNewImageUrl('')
    }
  }

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      addMediaUrl('videos', newVideoUrl)
      setNewVideoUrl('')
    }
  }

  const handleAddProhibitedItem = () => {
    if (newProhibitedItem.trim()) {
      addProhibitedItem(newProhibitedItem)
      setNewProhibitedItem('')
    }
  }

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
        Media & Policies
      </h3>

      {/* Poster URL */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="poster"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Event Poster URL
        </label>
        <input
          id="poster"
          type="url"
          value={formData.mediaUrls.poster}
          onChange={(e) => {
            updateField('mediaUrls.poster', e.target.value)
            clearFieldError('poster')
          }}
          placeholder="https://example.com/poster.jpg"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: validationErrors.poster ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
        {validationErrors.poster && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.poster}</p>
        )}
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
          Main promotional image for the event
        </p>
      </div>

      {/* Image URLs */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="imageUrls"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Event Images
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            id="imageUrls"
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddImage)}
            placeholder="https://example.com/image.jpg"
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
            onClick={handleAddImage}
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
        {formData.mediaUrls.images.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {formData.mediaUrls.images.map((url, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '6px'
                }}
              >
                <span style={{ fontSize: '13px', color: '#374151', wordBreak: 'break-all', marginRight: '12px' }}>
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeMediaUrl('images', url)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video URLs */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="videoUrls"
          style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: '#d1d5db' }}
        >
          Event Videos
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            id="videoUrls"
            type="url"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddVideo)}
            placeholder="https://youtube.com/watch?v=..."
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
            onClick={handleAddVideo}
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
        {formData.mediaUrls.videos.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {formData.mediaUrls.videos.map((url, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '6px'
                }}
              >
                <span style={{ fontSize: '13px', color: '#374151', wordBreak: 'break-all', marginRight: '12px' }}>
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeMediaUrl('videos', url)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Policies Section */}
      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
          Event Policies
        </h4>

        {/* Refund Policy */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="refundPolicy"
            style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}
          >
            Refund Policy
          </label>
          <textarea
            id="refundPolicy"
            value={formData.eventPolicies.refundPolicy}
            onChange={(e) => {
              updateField('eventPolicies.refundPolicy', e.target.value)
              clearFieldError('refundPolicy')
            }}
            placeholder="Describe your refund and cancellation policy..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.refundPolicy ? '1px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          {validationErrors.refundPolicy && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{validationErrors.refundPolicy}</p>
          )}
        </div>

        {/* Accessibility Info */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="accessibilityInfo"
            style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}
          >
            Accessibility Information
          </label>
          <textarea
            id="accessibilityInfo"
            value={formData.eventPolicies.accessibilityInfo}
            onChange={(e) => {
              updateField('eventPolicies.accessibilityInfo', e.target.value)
              clearFieldError('accessibilityInfo')
            }}
            placeholder="Describe accessibility accommodations available at this event..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* General Rules */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="generalRules"
            style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}
          >
            General Rules
          </label>
          <textarea
            id="generalRules"
            value={formData.eventPolicies.generalRules}
            onChange={(e) => {
              updateField('eventPolicies.generalRules', e.target.value)
              clearFieldError('generalRules')
            }}
            placeholder="Any general rules or guidelines attendees should follow..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Prohibited Items */}
        <div>
          <label
            htmlFor="prohibitedItems"
            style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}
          >
            Prohibited Items
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              id="prohibitedItems"
              type="text"
              value={newProhibitedItem}
              onChange={(e) => setNewProhibitedItem(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddProhibitedItem)}
              placeholder="e.g., Outside food, Cameras, Weapons"
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
              onClick={handleAddProhibitedItem}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
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
          {formData.eventPolicies.prohibitedItems.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {formData.eventPolicies.prohibitedItems.map((item, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                >
                  🚫 {item}
                  <button
                    type="button"
                    onClick={() => removeProhibitedItem(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#991b1b',
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
      </div>

      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '6px',
        padding: '12px',
        marginTop: '8px'
      }}>
        <p style={{ fontSize: '13px', color: '#166534', margin: 0 }}>
          ✓ <strong>Almost done!</strong> Review your event details and click "Create Event" to publish.
        </p>
      </div>
    </div>
  )
}