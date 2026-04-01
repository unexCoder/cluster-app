'use client'

import React, { useEffect, useState } from 'react'
import styles from './eventCreate.module.css'
import { fetchEventsAction } from '@/app/actions/events'
import { createTicketTier } from '@/lib/api/ticketTier'

interface TicketTierCreateProps {
  onNavigate: (view: string) => void
}

interface TicketTierForm {
  event_id: string
  name: string
  description: string
  price: string
  quantity: string
  max_per_order: string
  sort_order: string
  is_active: boolean
  sales_start: string
  sales_end: string
  benefits: string[]
  background_url: string
}

interface Event {
  id: string
  name: string
  slug: string
}

const INITIAL_FORM: TicketTierForm = {
  event_id: '',
  name: '',
  description: '',
  price: '',
  quantity: '',
  max_per_order: '',
  sort_order: '0',
  is_active: true,
  sales_start: '',
  sales_end: '',
  benefits: [],
  background_url: ''
}

const formatDateTime = (dt: string): string => {
  if (!dt) return ''
  return dt.replace('T', ' ') + ':00'
}

export default function TicketTierCreate({ onNavigate }: TicketTierCreateProps) {
  const [formData, setFormData] = useState<TicketTierForm>(INITIAL_FORM)
  const [currentStep, setCurrentStep] = useState(1)
  const [creating, setCreating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [events, setEvents] = useState<Event[]>([])
  const [newBenefit, setNewBenefit] = useState('')

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await fetchEventsAction()
        if (result.success) setEvents(result.events)
      } catch (err) {
        console.error('Failed to load events:', err)
      }
    }
    loadEvents()
  }, [])

  const updateField = (field: keyof TicketTierForm, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const addBenefit = () => {
    if (!newBenefit.trim()) return
    updateField('benefits', [...formData.benefits, newBenefit.trim()])
    setNewBenefit('')
  }

  const removeBenefit = (index: number) => {
    updateField('benefits', formData.benefits.filter((_, i) => i !== index))
  }

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.event_id) newErrors.event_id = 'Event is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0)
      newErrors.price = 'Valid price is required'
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1)
      newErrors.quantity = 'Valid quantity is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.sales_start) newErrors.sales_start = 'Sales start date is required'
    if (!formData.sales_end) newErrors.sales_end = 'Sales end date is required'
    if (formData.sales_start && formData.sales_end && formData.sales_start >= formData.sales_end)
      newErrors.sales_end = 'Sales end must be after sales start'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep1()) setCurrentStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    try {
      setCreating(true)

      const payload = {
        event_id: formData.event_id,
        name: formData.name,
        description: formData.description || null,
        price: formData.price,
        quantity: Number(formData.quantity),
        max_per_order: formData.max_per_order ? Number(formData.max_per_order) : null,
        sort_order: Number(formData.sort_order),
        is_active: formData.is_active ? 1 : 0,
        sales_start: formatDateTime(formData.sales_start),
        sales_end: formatDateTime(formData.sales_end),
        benefits: formData.benefits.length > 0 ? formData.benefits : null,
        background_url: formData.background_url,
      }

      await createTicketTier(payload)
      onNavigate('Ticket Tier List')

    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create ticket tier' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Create Ticket Tier</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Step {currentStep} of 2
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('Ticket Tier List')}
          style={{
            padding: '0 16px', height: '24px', alignSelf: 'flex-end',
            background: '#6b7280', color: 'white', border: 'none',
            borderRadius: '6px', cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
        {[{ n: 1, label: 'Basic Info' }, { n: 2, label: 'Sales & Benefits' }].map(s => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: currentStep >= s.n ? '#3b82f6' : '#374151',
              color: 'white', fontSize: '13px', fontWeight: '600'
            }}>{s.n}</div>
            <span style={{ fontSize: '13px', color: currentStep >= s.n ? '#3b82f6' : '#6b7280' }}>
              {s.label}
            </span>
            {s.n < 2 && <div style={{ width: '40px', height: '1px', background: '#374151' }} />}
          </div>
        ))}
      </div>

      <div style={{ background: '#1f2937', borderRadius: '12px', padding: '32px' }}>

        {errors.submit && (
          <div style={{ padding: '12px', marginBottom: '16px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '14px' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── STEP 1 ── */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Event */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                  Event *
                </label>
                <select
                  value={formData.event_id}
                  onChange={e => updateField('event_id', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.event_id ? '1px solid #ef4444' : '1px solid #374151' }}
                >
                  <option value="">Select an event...</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
                {errors.event_id && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.event_id}</p>}
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. VIP, General Admission"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.name ? '1px solid #ef4444' : '1px solid #374151' }}
                />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Optional description..."
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: '1px solid #374151', resize: 'vertical' }}
                />
              </div>

              {/* Price + Quantity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Price *</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={formData.price}
                    onChange={e => updateField('price', e.target.value)}
                    placeholder="0.00"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.price ? '1px solid #ef4444' : '1px solid #374151' }}
                  />
                  {errors.price && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.price}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Quantity *</label>
                  <input
                    type="number" min="1"
                    value={formData.quantity}
                    onChange={e => updateField('quantity', e.target.value)}
                    placeholder="100"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.quantity ? '1px solid #ef4444' : '1px solid #374151' }}
                  />
                  {errors.quantity && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.quantity}</p>}
                </div>
              </div>

              {/* Max per order + Sort order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Max per Order</label>
                  <input
                    type="number" min="1"
                    value={formData.max_per_order}
                    onChange={e => updateField('max_per_order', e.target.value)}
                    placeholder="No limit"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: '1px solid #374151' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Sort Order</label>
                  <input
                    type="number" min="0"
                    value={formData.sort_order}
                    onChange={e => updateField('sort_order', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: '1px solid #374151' }}
                  />
                </div>
              </div>

              {/* Is Active */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => updateField('is_active', e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="is_active" style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                  Active — visible and available for purchase
                </label>
              </div>

            </div>
          )}

          {/* ── STEP 2 ── */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Sales Start + End */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Sales Start *</label>
                  <input
                    type="datetime-local"
                    value={formData.sales_start}
                    onChange={e => updateField('sales_start', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.sales_start ? '1px solid #ef4444' : '1px solid #374151' }}
                  />
                  {errors.sales_start && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.sales_start}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Sales End *</label>
                  <input
                    type="datetime-local"
                    value={formData.sales_end}
                    onChange={e => updateField('sales_end', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.sales_end ? '1px solid #ef4444' : '1px solid #374151' }}
                  />
                  {errors.sales_end && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.sales_end}</p>}
                </div>
              </div>

              {/* Background url */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Background url</label>
                <input
                  type="text"
                  value={formData.background_url}
                  onChange={e => updateField('background_url', e.target.value)}
                  placeholder="http://localhost:3000/api/postcard"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: errors.name ? '1px solid #ef4444' : '1px solid #374151' }}
                />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
              </div>


              {/* Benefits */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Benefits</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={e => setNewBenefit(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    placeholder="e.g. Free drink, VIP lounge access"
                    style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#111827', color: 'white', border: '1px solid #374151' }}
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    style={{ padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Add
                  </button>
                </div>
                {formData.benefits.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.benefits.map((b, i) => (
                      <span key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '4px 10px', background: '#1e3a5f', borderRadius: '20px',
                        fontSize: '13px', color: '#93c5fd'
                      }}>
                        {b}
                        <button
                          type="button"
                          onClick={() => removeBenefit(i)}
                          style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', padding: '0', fontSize: '14px', lineHeight: 1 }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #374151' }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{ padding: '10px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
              >
                Previous
              </button>
            )}

            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: 'auto' }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={creating}
                style={{ padding: '10px 24px', background: creating ? '#93c5fd' : '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: creating ? 'not-allowed' : 'pointer', fontSize: '14px', marginLeft: 'auto' }}
              >
                {creating ? 'Creating...' : 'Create Ticket Tier'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  )
}