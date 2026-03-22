// app/checkout/_components/Step3PayPal.tsx
'use client'

import { useState } from 'react'
import { GuestInfo } from '@/../types/checkout'
import { createPayPalCheckout } from '@/lib/api/payment'

interface Step3PayPalProps {
  orderId: string
  amount: number
  description: string
  guest: GuestInfo
  onComplete: (result: {
    payment_id: string
    status: string
    approval_url?: string
  }) => void
  onBack: () => void
}

export default function Step3PayPal({
  orderId, amount, description, guest, onComplete, onBack
}: Step3PayPalProps) {
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setLoading(true)
    setApiError(null)

    try {
      const result = await createPayPalCheckout({
        order_id:    orderId,
        amount:      amount.toFixed(2),
        currency:    'USD',
        description,
        email:       guest.guest_email,
        name:        guest.guest_name,
      })

      onComplete({
        payment_id:   result.payment_id,
        status:       result.status,
        approval_url: result.approval_url,
      })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al iniciar PayPal')
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
          🅿️ PayPal
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
          <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>USD</span>
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
          'Hacés clic en "Pagar con PayPal"',
          'Te redirigimos al sitio seguro de PayPal',
          'Iniciás sesión y confirmás el pago',
          'Volvés automáticamente y recibís tus tickets',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#0070ba', color: 'white',
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
        display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
          Cuenta asociada
        </p>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
          {guest.guest_name}
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
          {guest.guest_email}
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
          background: loading ? '#003087' : '#0070ba',
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
            Conectando con PayPal...
          </>
        ) : 'Pagar con PayPal →'}
      </button>

      <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
        🔒 Serás redirigido al sitio seguro de PayPal
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}