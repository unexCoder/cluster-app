// app/checkout/_components/Step2GuestInfo.tsx
'use client'

import { useState } from 'react'
import { GuestInfo } from '@/../types/checkout'

interface Step2GuestInfoProps {
  loading: boolean
  onConfirm: (guest: GuestInfo) => void
  onBack: () => void
}

const DOC_TYPES = ['DNI', 'CUIL', 'CUIT', 'Passport'] as const

const INITIAL_FORM: GuestInfo = {
  guest_name:  '',
  guest_email: '',
  guest_phone: '',
  doc_type:    'DNI',
  doc_number:  '',
}

export default function Step2GuestInfo({ loading, onConfirm, onBack }: Step2GuestInfoProps) {
  const [form, setForm] = useState<GuestInfo>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof GuestInfo, string>>>({})

  const update = (field: keyof GuestInfo, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GuestInfo, string>> = {}

    if (!form.guest_name.trim())
      newErrors.guest_name = 'El nombre es requerido'
    else if (form.guest_name.trim().length < 3)
      newErrors.guest_name = 'El nombre debe tener al menos 3 caracteres'

    if (!form.guest_email.trim())
      newErrors.guest_email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guest_email))
      newErrors.guest_email = 'El email no es válido'

    if (form.guest_phone && !/^\+?[\d\s\-()]{6,20}$/.test(form.guest_phone))
      newErrors.guest_phone = 'El teléfono no es válido'

    if (!form.doc_number.trim())
      newErrors.doc_number = 'El número de documento es requerido'
    else if (!/^\d{7,11}$/.test(form.doc_number.replace(/\D/g, '')))
      newErrors.doc_number = 'El documento debe tener entre 7 y 11 dígitos'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onConfirm(form)
  }

  const inputStyle = (field: keyof GuestInfo) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#111827',
    color: 'white',
    border: errors[field] ? '1px solid #ef4444' : '1px solid #374151',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const
  })

  const labelStyle = {
    display: 'block' as const,
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#d1d5db'
  }

  const errorStyle = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
        Tus datos
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Nombre completo */}
        <div>
          <label style={labelStyle}>Nombre completo *</label>
          <input
            type="text"
            value={form.guest_name}
            onChange={e => update('guest_name', e.target.value)}
            placeholder="Juan Pérez"
            style={inputStyle('guest_name')}
            autoComplete="name"
          />
          {errors.guest_name && <p style={errorStyle}>{errors.guest_name}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            value={form.guest_email}
            onChange={e => update('guest_email', e.target.value)}
            placeholder="juan@email.com"
            style={inputStyle('guest_email')}
            autoComplete="email"
          />
          {errors.guest_email && <p style={errorStyle}>{errors.guest_email}</p>}
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Tus tickets llegarán a este email
          </p>
        </div>

        {/* Teléfono */}
        <div>
          <label style={labelStyle}>Teléfono</label>
          <input
            type="tel"
            value={form.guest_phone}
            onChange={e => update('guest_phone', e.target.value)}
            placeholder="+54 11 1234 5678"
            style={inputStyle('guest_phone')}
            autoComplete="tel"
          />
          {errors.guest_phone && <p style={errorStyle}>{errors.guest_phone}</p>}
        </div>

        {/* Documento */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Tipo *</label>
            <select
              value={form.doc_type}
              onChange={e => update('doc_type', e.target.value)}
              style={{
                ...inputStyle('doc_type'),
                cursor: 'pointer'
              }}
            >
              {DOC_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Número de documento *</label>
            <input
              type="text"
              value={form.doc_number}
              onChange={e => update('doc_number', e.target.value.replace(/\D/g, ''))}
              placeholder="12345678"
              style={inputStyle('doc_number')}
              maxLength={11}
              inputMode="numeric"
            />
            {errors.doc_number && <p style={errorStyle}>{errors.doc_number}</p>}
          </div>
        </div>

        {/* Privacy note */}
        <p style={{
          fontSize: '12px', color: '#6b7280',
          padding: '12px', background: '#111827',
          borderRadius: '8px', margin: 0,
          border: '1px solid #1f2937'
        }}>
          Tus datos son utilizados únicamente para procesar tu compra y enviarte los tickets.
          No compartimos tu información con terceros.
        </p>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            style={{
              flex: 1, padding: '13px',
              background: 'transparent',
              color: '#9ca3af',
              border: '1px solid #374151',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: '500'
            }}
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2, padding: '13px',
              background: loading ? '#1d4ed8' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '15px', fontWeight: '600',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Procesando...
              </>
            ) : 'Continuar al pago'}
          </button>
        </div>

      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #4b5563; }
        select option { background: #111827; }
      `}</style>
    </div>
  )
}