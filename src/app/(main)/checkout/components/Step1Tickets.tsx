// app/checkout/_components/Step1Tickets.tsx
'use client'

import { useEffect, useState } from 'react'
import { CartItem } from '@/../types/checkout'
import { fetchTicketTiers } from '@/lib/api/ticketTier'
import { fetchEventsAction } from '@/app/actions/events'
import { TicketTier } from '@/../types/types'

interface Event {
  id: string
  name: string
  slug: string
  start_date_time: Date
  status: string
}

interface Step1TicketsProps {
  preselectedEventId?: string
  onConfirm: (cart: CartItem[]) => void
  onCartChange?: (cart: CartItem[]) => void
}

export default function Step1Tickets({ preselectedEventId, onConfirm, onCartChange }: Step1TicketsProps) {
  const [tiers, setTiers] = useState<TicketTier[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [tiersData, eventsResult] = await Promise.all([
          fetchTicketTiers(),
          fetchEventsAction()
        ])

        const now = new Date()
        const activeTiers = tiersData.filter(t => {
          const start = new Date(t.sales_start)
          const end = new Date(t.sales_end)
          const available = t.quantity - t.quantity_sold - t.quantity_reserved
          return t.is_active && start <= now && end >= now && available > 0
        })

        const activeEvents = eventsResult.success
          ? eventsResult.events.filter((e: Event) =>
            e.status === 'published' || e.status === 'on_sale'
          )
          : []

        setTiers(activeTiers)
        setEvents(activeEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getEvent = (eventId: string) =>
    events.find(e => e.id === eventId)

  const getAvailable = (tier: TicketTier) =>
    tier.quantity - tier.quantity_sold - tier.quantity_reserved

  const updateQuantity = (tierId: string, delta: number, max: number) => {
    setQuantities(prev => {
      const current = prev[tierId] ?? 0
      const next = Math.min(Math.max(0, current + delta), max)
      return { ...prev, [tierId]: next }
    })
  }

  // agregar useEffect que notifica al padre cuando cambian quantities
  useEffect(() => {
    const updatedCart = tiers
      .filter(t => (quantities[t.id] ?? 0) > 0)
      .map(t => ({
        tier_id: t.id,
        tier_name: t.name,
        event_id: t.event_id,
        event_name: getEvent(t.event_id)?.name ?? '—',
        price: Number(t.price),
        quantity: quantities[t.id],
      }))
    onCartChange?.(updatedCart)
  }, [quantities])

  const cartItems: CartItem[] = tiers
    .filter(t => (quantities[t.id] ?? 0) > 0)
    .map(t => {
      const event = getEvent(t.event_id)
      return {
        tier_id: t.id,
        tier_name: t.name,
        event_id: t.event_id,
        event_name: event?.name ?? '—',
        price: Number(t.price),
        quantity: quantities[t.id],
      }
    })

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0)

  // agrupar tiers por evento
  const filteredTiers = preselectedEventId
    ? tiers.filter(t => t.event_id === preselectedEventId)
    : tiers

  const tiersByEvent = filteredTiers.reduce<Record<string, TicketTier[]>>(
    (acc, tier) => {
      if (!acc[tier.event_id]) acc[tier.event_id] = []
      acc[tier.event_id].push(tier)
      return acc
    }, {}
  )

  if (loading) return <p style={{ color: '#9ca3af' }}>Loading tickets...</p>

  if (error) return (
    <div style={{ color: '#ef4444', padding: '16px', background: '#fef2f2', borderRadius: '8px' }}>
      {error}
    </div>
  )

  if (Object.keys(tiersByEvent).length === 0) return (
    <div style={{ color: '#9ca3af', padding: '32px', textAlign: 'center' }}>
      No tickets available at this time.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
        Seleccioná tus entradas
      </h2>

      {Object.entries(tiersByEvent).map(([eventId, eventTiers]) => {
        const event = getEvent(eventId)
        return (
          <div key={eventId} style={{
            background: '#1f2937',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #374151'
          }}>
            {/* Event header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #374151',
              background: '#111827'
            }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>
                {event?.name ?? '—'}
              </p>
              {event?.start_date_time && (
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                  {new Date(event.start_date_time).toLocaleString('es-AR', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              )}
            </div>

            {/* Tiers */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {eventTiers.map((tier, i) => {
                const available = getAvailable(tier)
                const qty = quantities[tier.id] ?? 0
                const maxQty = Math.min(
                  available,
                  tier.max_per_order ?? available
                )

                return (
                  <div key={tier.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderTop: i > 0 ? '1px solid #374151' : 'none',
                    gap: '16px'
                  }}>
                    {/* Tier info */}
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
                          {(tier.benefits as string[]).map((b, bi) => (
                            <span key={bi} style={{
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
                        {available} disponibles
                        {tier.max_per_order && ` · máx ${tier.max_per_order} por orden`}
                      </p>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontWeight: '700', fontSize: '18px', color: '#f9fafb' }}>
                        ${Number(tier.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {/* Quantity selector */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0
                    }}>
                      <button
                        onClick={() => updateQuantity(tier.id, -1, maxQty)}
                        disabled={qty === 0}
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: '1px solid #374151',
                          background: qty === 0 ? '#111827' : '#1f2937',
                          color: qty === 0 ? '#4b5563' : '#f9fafb',
                          cursor: qty === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '18px', display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}
                      >−</button>

                      <span style={{
                        minWidth: '24px', textAlign: 'center',
                        fontWeight: '600', fontSize: '16px'
                      }}>
                        {qty}
                      </span>

                      <button
                        onClick={() => updateQuantity(tier.id, 1, maxQty)}
                        disabled={qty >= maxQty}
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: '1px solid #374151',
                          background: qty >= maxQty ? '#111827' : '#3b82f6',
                          color: qty >= maxQty ? '#4b5563' : 'white',
                          cursor: qty >= maxQty ? 'not-allowed' : 'pointer',
                          fontSize: '18px', display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}
                      >+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* CTA */}
      <button
        onClick={() => onConfirm(cartItems)}
        disabled={totalItems === 0}
        style={{
          width: '100%', padding: '14px',
          background: totalItems === 0 ? '#1f2937' : '#3b82f6',
          color: totalItems === 0 ? '#4b5563' : 'white',
          border: 'none', borderRadius: '8px',
          cursor: totalItems === 0 ? 'not-allowed' : 'pointer',
          fontSize: '16px', fontWeight: '600',
          transition: 'background 0.2s'
        }}
      >
        {totalItems === 0
          ? 'Seleccioná al menos una entrada'
          : `Continuar con ${totalItems} entrada${totalItems > 1 ? 's' : ''}`
        }
      </button>
    </div>
  )
}