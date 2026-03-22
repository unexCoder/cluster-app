// app/checkout/_components/Step3Ticket.tsx
'use client'

import { useState } from 'react'
import { GuestInfo } from '@/../types/checkout'
import { createTicketCheckout } from '@/lib/api/payment'

interface Step3TicketProps {
  orderId: string
  amount: number
  guest: GuestInfo
  paymentMethodId: 'rapipago' | 'pagofacil'
  onComplete: (result: {
    payment_id: string
    status: string
    ticket_url?: string
    barcode_content?: string
  }) => void
  onBack: () => void
}

export default function Step3Ticket({
  orderId, amount, guest, paymentMethodId, onComplete, onBack
}: Step3TicketProps) {
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const label = paymentMethodId === 'rapipago' ? 'Rapipago' : 'Pago Fácil'
  const icon  = paymentMethodId === 'rapipago' ? '🏪' : '🏬'

  const handleConfirm = async () => {
    setLoading(true)
    setApiError(null)

    try {
      const result = await createTicketCheckout({
        order_id:          orderId,
        amount:            amount.toFixed(2),
        email:             guest.guest_email,
        name:              guest.guest_name,
        doc_type:          guest.doc_type,
        doc_number:        guest.doc_number,
        payment_method_id: paymentMethodId,
        expiration_time:   'P3D',
      })

      onComplete({
        payment_id:      result.payment_id,
        status:          result.status,
        ticket_url:      result.ticket_url,
        barcode_content: result.barcode_content,
      })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al generar el cupón')
    } finally {
      setLoading(false)
    }
  }

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
          {icon} {label}
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

      {/* Info */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '10px',
        padding: '16px', background: '#1f2937',
        borderRadius: '10px', border: '1px solid #374151'
      }}>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>
          ¿Cómo funciona?
        </p>
        {[
          `Generamos un cupón de pago para ${label}`,
          'Llevá el cupón (impreso o en tu celular) a cualquier sucursal',
          'Abonás en efectivo — el cupón vence en 3 días',
          'Una vez confirmado el pago recibís tus tickets por email',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#3b82f6', color: 'white',
              fontSize: '11px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '1px'
            }}>
              {i + 1}
            </span>
            <p style={{ margin: 0, fontSize: '13px', color: '#d1d5db' }}>{step}</p>
          </div>
        ))}
      </div>

      {/* Guest summary */}
      <div style={{
        padding: '14px 16px', background: '#111827',
        borderRadius: '8px', border: '1px solid #1f2937',
        display: 'flex', flexDirection: 'column', gap: '6px'
      }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
          El cupón se enviará a
        </p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
          {guest.guest_name} — {guest.guest_email}
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
          {guest.doc_type}: {guest.doc_number}
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

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: loading ? '#065f46' : '#10b981',
          color: 'white', border: 'none',
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
            Generando cupón...
          </>
        ) : `Generar cupón ${label}`}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}