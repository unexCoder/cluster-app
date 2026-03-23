// app/checkout/_components/OrderSummary.tsx
'use client'

import { CartItem } from '@/../types/checkout'

interface OrderSummaryProps {
  cart: CartItem[]
  orderNumber: string | null
  total: number
}

export default function OrderSummary({ cart, orderNumber, total }: OrderSummaryProps) {
  // agrupar items por evento
  const byEvent = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.event_id]) acc[item.event_id] = []
    acc[item.event_id].push(item)
    return acc
  }, {})

  return (
    <div style={{
      position: 'sticky',
      top: '32px',
      background: '#1f2937',
      borderRadius: '12px',
      border: '1px solid #374151',
      overflow: 'hidden',
      height: 'fit-content'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: '#111827',
        borderBottom: '1px solid #374151'
      }}>
        <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>
          Resumen de compra
        </p>
        {orderNumber && (
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
            Orden #{orderNumber}
          </p>
        )}
      </div>

      {/* Cart items */}
      <div style={{ padding: '16px 20px' }}>
        {cart.length === 0 ? (
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>
            No hay entradas seleccionadas
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(byEvent).map(([eventId, items]) => (
              <div key={eventId}>
                {/* Event name */}
                <p style={{
                  margin: '0 0 8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  {items[0].event_name}
                </p>

                {/* Tiers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map(item => (
                    <div key={item.tier_id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                          {item.tier_name}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280' }}>
                          {item.quantity} × ${Number(item.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p style={{
                        margin: 0, fontSize: '14px',
                        fontWeight: '600', flexShrink: 0
                      }}>
                        ${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      {cart.length > 0 && (
        <>
          <div style={{ height: '1px', background: '#374151', margin: '0 20px' }} />

          {/* Subtotal breakdown */}
          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
                Subtotal ({cart.reduce((acc, i) => acc + i.quantity, 0)} entrada{cart.reduce((acc, i) => acc + i.quantity, 0) !== 1 ? 's' : ''})
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
                ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Descuentos</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#22c55e' }}>—</p>
            </div>
          </div>

          <div style={{ height: '1px', background: '#374151', margin: '0 20px' }} />

          {/* Total */}
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Total</p>
            <p style={{
              margin: 0, fontWeight: '700',
              fontSize: '20px', color: '#f9fafb'
            }}>
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </>
      )}

      {/* Security badge */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #374151',
        background: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '14px' }}>🔒</span>
        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
          Compra 100% segura y encriptada
        </p>
      </div>
    </div>
  )
}