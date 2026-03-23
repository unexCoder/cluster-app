// app/checkout/_components/Step3Card.tsx
'use client'

import { useState } from 'react'
import { GuestInfo } from '@/../types/checkout'
import { createCardCheckout } from '@/lib/api/payment'

interface Step3CardProps {
  orderId: string
  amount: number
  description: string
  guest: GuestInfo
  paymentMethod: 'credit_card' | 'debit_card'
  onComplete: (result: { payment_id: string; status: string }) => void
  onBack: () => void
}

interface CardForm {
  card_number: string
  expiration_month: string
  expiration_year: string
  security_code: string
  cardholder_name: string
  installments: string
}

const INITIAL_CARD: CardForm = {
  card_number: '',
  expiration_month: '',
  expiration_year: '',
  security_code: '',
  cardholder_name: '',
  installments: '1',
}

export default function Step3Card({
  orderId, amount, description, guest, paymentMethod, onComplete, onBack
}: Step3CardProps) {
  const [form, setForm] = useState<CardForm>(INITIAL_CARD)
  const [errors, setErrors] = useState<Partial<Record<keyof CardForm, string>>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const update = (field: keyof CardForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    setApiError(null)
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CardForm, string>> = {}

    const cardClean = form.card_number.replace(/\s/g, '')
    if (!cardClean) newErrors.card_number = 'El número de tarjeta es requerido'
    else if (!/^\d{13,19}$/.test(cardClean)) newErrors.card_number = 'Número de tarjeta inválido'

    if (!form.expiration_month) newErrors.expiration_month = 'Requerido'
    else if (Number(form.expiration_month) < 1 || Number(form.expiration_month) > 12)
      newErrors.expiration_month = 'Mes inválido'

    if (!form.expiration_year) newErrors.expiration_year = 'Requerido'
    else if (Number(form.expiration_year) < new Date().getFullYear() % 100)
      newErrors.expiration_year = 'Tarjeta vencida'

    if (!form.security_code) newErrors.security_code = 'Requerido'
    else if (!/^\d{3,4}$/.test(form.security_code)) newErrors.security_code = 'CVV inválido'

    if (!form.cardholder_name.trim()) newErrors.cardholder_name = 'El nombre es requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError(null)

    try {
      const result = await createCardCheckout({
        order_id:          orderId,
        amount:            amount.toFixed(2),
        description,
        email:             guest.guest_email,
        name:              guest.guest_name,
        card_number:       form.card_number.replace(/\s/g, ''),
        expiration_month:  Number(form.expiration_month),
        expiration_year:   Number(`20${form.expiration_year}`),
        security_code:     form.security_code,
        cardholder_name:   form.cardholder_name,
        doc_type:          guest.doc_type,
        doc_number:        guest.doc_number,
        installments:      Number(form.installments),
      })

      onComplete({
        payment_id: result.payment_id,
        status:     result.status,
      })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16)
    return clean.replace(/(.{4})/g, '$1 ').trim()
  }

  const inputStyle = (field: keyof CardForm) => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    background: '#111827',
    color: 'white',
    border: errors[field] ? '1px solid #ef4444' : '1px solid #374151',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    letterSpacing: field === 'card_number' ? '0.1em' : 'normal'
  })

  const labelStyle = {
    display: 'block' as const,
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#d1d5db'
  }

  const errorStyle = { color: '#ef4444', fontSize: '12px', marginTop: '4px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none',
            color: '#9ca3af', cursor: 'pointer',
            fontSize: '20px', padding: '0', lineHeight: 1
          }}
        >←</button>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          {paymentMethod === 'credit_card' ? 'Tarjeta de crédito' : 'Tarjeta de débito'}
        </h3>
      </div>

      {/* Amount */}
      <div style={{
        padding: '14px 16px', background: '#111827',
        borderRadius: '8px', border: '1px solid #1f2937'
      }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Total a pagar</p>
        <p style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: '700', color: '#f9fafb' }}>
          ${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {apiError && (
        <div style={{
          padding: '12px 16px', background: '#fef2f2',
          color: '#991b1b', borderRadius: '8px',
          fontSize: '14px', border: '1px solid #fecaca'
        }}>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Card number */}
        <div>
          <label style={labelStyle}>Número de tarjeta *</label>
          <input
            type="text"
            value={form.card_number}
            onChange={e => update('card_number', formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            style={inputStyle('card_number')}
            maxLength={19}
            inputMode="numeric"
          />
          {errors.card_number && <p style={errorStyle}>{errors.card_number}</p>}
        </div>

        {/* Expiry + CVV */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Mes *</label>
            <input
              type="text"
              value={form.expiration_month}
              onChange={e => update('expiration_month', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="MM"
              style={inputStyle('expiration_month')}
              maxLength={2}
              inputMode="numeric"
            />
            {errors.expiration_month && <p style={errorStyle}>{errors.expiration_month}</p>}
          </div>
          <div>
            <label style={labelStyle}>Año *</label>
            <input
              type="text"
              value={form.expiration_year}
              onChange={e => update('expiration_year', e.target.value.replace(/\D/g, '').slice(0, 2))}
              placeholder="AA"
              style={inputStyle('expiration_year')}
              maxLength={2}
              inputMode="numeric"
            />
            {errors.expiration_year && <p style={errorStyle}>{errors.expiration_year}</p>}
          </div>
          <div>
            <label style={labelStyle}>CVV *</label>
            <input
              type="password"
              value={form.security_code}
              onChange={e => update('security_code', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="•••"
              style={inputStyle('security_code')}
              maxLength={4}
              inputMode="numeric"
            />
            {errors.security_code && <p style={errorStyle}>{errors.security_code}</p>}
          </div>
        </div>

        {/* Cardholder name */}
        <div>
          <label style={labelStyle}>Nombre en la tarjeta *</label>
          <input
            type="text"
            value={form.cardholder_name}
            onChange={e => update('cardholder_name', e.target.value.toUpperCase())}
            placeholder="JUAN PEREZ"
            style={inputStyle('cardholder_name')}
            autoComplete="cc-name"
          />
          {errors.cardholder_name && <p style={errorStyle}>{errors.cardholder_name}</p>}
        </div>

        {/* Installments — solo crédito */}
        {paymentMethod === 'credit_card' && (
          <div>
            <label style={labelStyle}>Cuotas</label>
            <select
              value={form.installments}
              onChange={e => update('installments', e.target.value)}
              style={{ ...inputStyle('installments'), cursor: 'pointer' }}
            >
              {[1, 3, 6, 12].map(n => (
                <option key={n} value={n}>
                  {n === 1
                    ? `1 pago — $${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`
                    : `${n} cuotas — $${(amount / n).toLocaleString('es-AR', { minimumFractionDigits: 2 })} c/u`
                  }
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Security note */}
        <p style={{
          fontSize: '12px', color: '#6b7280', margin: 0,
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          🔒 Pago seguro procesado por MercadoPago
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#1d4ed8' : '#3b82f6',
            color: 'white', border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px', fontWeight: '600',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            marginTop: '4px'
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
              Procesando pago...
            </>
          ) : `Pagar $${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
        </button>

      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #4b5563; }
        select option { background: #111827; }
      `}</style>
    </div>
  )
}