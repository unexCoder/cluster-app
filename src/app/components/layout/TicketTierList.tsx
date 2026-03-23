// app/components/layout/TicketTierList.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchTicketTiers } from '@/lib/api/ticketTier'
import { TicketTier } from '@/../types/types'

interface TicketTierListProps {
  eventId: string
  eventSlug: string
}

export default function TicketTierList({ eventId, eventSlug }: TicketTierListProps) {
  const router = useRouter()
  const [tiers, setTiers] = useState<TicketTier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTicketTiers()
      .then(data => {
        const now = new Date()
        const eventTiers = data.filter(t => {
          const start = new Date(t.sales_start)
          const end = new Date(t.sales_end)
          const available = t.quantity - t.quantity_sold - t.quantity_reserved
          return (
            t.event_id === eventId &&
            t.is_active &&
            start <= now &&
            end >= now &&
            available > 0
          )
        })
        setTiers(eventTiers.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
      })
      .catch(err => console.error('Failed to load tiers:', err))
      .finally(() => setLoading(false))
  }, [eventId])

  if (loading) return (
    <p style={{ color: '#9ca3af', fontSize: '14px' }}>Cargando entradas...</p>
  )

  if (tiers.length === 0) return (
    <p style={{ color: '#6b7280', fontSize: '14px' }}>
      No hay entradas disponibles en este momento.
    </p>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
      {tiers.map(tier => {
        const available = tier.quantity - tier.quantity_sold - tier.quantity_reserved
        const soldOut = available <= 0

        return (
          <div key={tier.id} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '16px',
            padding: '16px 20px',
            background: '#1f2937',
            borderRadius: '10px',
            border: '1px solid #374151',
            opacity: soldOut ? 0.5 : 1
          }}>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '15px' }}>
                {tier.name}
              </p>
              {tier.description && (
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                  {tier.description}
                </p>
              )}
              {Array.isArray(tier.benefits) && tier.benefits.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {(tier.benefits as string[]).map((b, i) => (
                    <span key={i} style={{
                      fontSize: '11px', padding: '2px 8px',
                      background: '#1e3a5f', color: '#93c5fd',
                      borderRadius: '20px'
                    }}>
                      {b}
                    </span>
                  ))}
                </div>
              )}
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#6b7280' }}>
                {soldOut ? 'Agotado' : `${available} disponibles`}
                {tier.max_per_order && !soldOut && ` · máx ${tier.max_per_order} por orden`}
              </p>
            </div>

            {/* Price + CTA */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-end', gap: '8px', flexShrink: 0
            }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '20px' }}>
                ${Number(tier.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
              <button
                disabled={soldOut}
                onClick={() => router.push(`/checkout?event_id=${eventId}`)}
                style={{
                  padding: '8px 20px',
                  background: soldOut ? '#374151' : '#3b82f6',
                  color: soldOut ? '#6b7280' : 'white',
                  border: 'none', borderRadius: '6px',
                  cursor: soldOut ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                {soldOut ? 'Agotado' : 'Comprar'}
              </button>
            </div>
          </div>
        )
      })}

      {/* Checkout CTA */}
      {tiers.length > 1 && (
        <button
          onClick={() => router.push(`/checkout?event_id=${eventId}`)}
          style={{
            width: '100%', padding: '14px',
            background: '#3b82f6', color: 'white',
            border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontSize: '15px',
            fontWeight: '600', marginTop: '4px'
          }}
        >
          Ver todas las entradas →
        </button>
      )}
    </div>
  )
}