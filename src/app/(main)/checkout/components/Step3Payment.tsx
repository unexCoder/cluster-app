// app/checkout/_components/Step3Payment.tsx
'use client'

import { useState } from 'react'
import { GuestInfo, CartItem, PaymentMethod } from '@/../types/checkout'
import Step3Card from './Step3Card'
import Step3Ticket from './Step3Ticket'
import Step3PayPal from './Step3PayPal'

interface Step3PaymentProps {
  orderId: string
  amount: number
  guest: GuestInfo
  cart: CartItem[]
  onComplete: (result: {
    payment_id: string
    status: string
    approval_url?: string
    ticket_url?: string
    barcode_content?: string
  }) => void
  onBack: () => void
}

interface PaymentOption {
  id: PaymentMethod
  label: string
  description: string
  icon: string
  group: 'card' | 'cash' | 'paypal'
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'credit_card',
    label: 'Tarjeta de crédito',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
    group: 'card'
  },
  {
    id: 'debit_card',
    label: 'Tarjeta de débito',
    description: 'Visa Débito, Maestro',
    icon: '🏧',
    group: 'card'
  },
  {
    id: 'rapipago',
    label: 'Rapipago',
    description: 'Pagá en efectivo en cualquier sucursal',
    icon: '🏪',
    group: 'cash'
  },
  {
    id: 'pagofacil',
    label: 'Pago Fácil',
    description: 'Pagá en efectivo en cualquier sucursal',
    icon: '🏬',
    group: 'cash'
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Pagá con tu cuenta PayPal',
    icon: '🅿️',
    group: 'paypal'
  },
]

const GROUP_LABELS: Record<string, string> = {
  card:   'Tarjeta — MercadoPago',
  cash:   'Efectivo — MercadoPago',
  paypal: 'PayPal',
}

export default function Step3Payment({
  orderId, amount, guest, cart, onComplete, onBack
}: Step3PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  const description = cart
    .map(i => `${i.quantity}x ${i.tier_name}`)
    .join(', ')

  const groups = ['card', 'cash', 'paypal'] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
        Método de pago
      </h2>

      {/* ── Method selector ── */}
      {!selectedMethod && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {groups.map(group => {
            const options = PAYMENT_OPTIONS.filter(o => o.group === group)
            return (
              <div key={group}>
                <p style={{
                  fontSize: '12px', fontWeight: '600',
                  color: '#6b7280', textTransform: 'uppercase',
                  letterSpacing: '0.08em', margin: '0 0 10px'
                }}>
                  {GROUP_LABELS[group]}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedMethod(option.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 16px',
                        background: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'border-color 0.15s, background 0.15s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#3b82f6'
                        e.currentTarget.style.background = '#1e3a5f22'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#374151'
                        e.currentTarget.style.background = '#1f2937'
                      }}
                    >
                      <span style={{ fontSize: '24px', flexShrink: 0 }}>
                        {option.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0, fontWeight: '600',
                          fontSize: '15px', color: '#f9fafb'
                        }}>
                          {option.label}
                        </p>
                        <p style={{
                          margin: '2px 0 0', fontSize: '13px', color: '#9ca3af'
                        }}>
                          {option.description}
                        </p>
                      </div>
                      <span style={{ color: '#4b5563', fontSize: '18px', flexShrink: 0 }}>
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          <button
            onClick={onBack}
            style={{
              padding: '12px',
              background: 'transparent',
              color: '#9ca3af',
              border: '1px solid #374151',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Volver
          </button>
        </div>
      )}

      {/* ── Card form (credit / debit) ── */}
      {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
        <Step3Card
          orderId={orderId}
          amount={amount}
          description={description}
          guest={guest}
          paymentMethod={selectedMethod}
          onComplete={onComplete}
          onBack={() => setSelectedMethod(null)}
        />
      )}

      {/* ── Cash ticket (rapipago / pagofacil) ── */}
      {(selectedMethod === 'rapipago' || selectedMethod === 'pagofacil') && (
        <Step3Ticket
          orderId={orderId}
          amount={amount}
          guest={guest}
          paymentMethodId={selectedMethod}
          onComplete={onComplete}
          onBack={() => setSelectedMethod(null)}
        />
      )}

      {/* ── PayPal ── */}
      {selectedMethod === 'paypal' && (
        <Step3PayPal
          orderId={orderId}
          amount={amount}
          description={description}
          guest={guest}
          onComplete={onComplete}
          onBack={() => setSelectedMethod(null)}
        />
      )}
    </div>
  )
}