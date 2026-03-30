// app/checkout/_components/OrderSummary.tsx
'use client'

import { CartItem } from '@/../types/checkout'
import styles from './checkout.module.css'

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

  const totalQty = cart.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <div className={styles.summary}>

      {/* Header */}
      <div className={styles.summary__header}>
        <p className={styles.summary__title}>Resumen de compra</p>
        {orderNumber && (
          <p className={styles.summary__orderNumber}>Orden #{orderNumber}</p>
        )}
      </div>

      {/* Cart items */}
      <div className={styles.summary__body}>
        {cart.length === 0 ? (
          <p className={styles.summary__empty}>No hay entradas seleccionadas</p>
        ) : (
          <div className={styles.summary__itemList}>
            {Object.entries(byEvent).map(([eventId, items]) => (
              <div key={eventId} className={styles.summary__eventGroup}>

                {/* Event name */}
                <p className={styles.summary__eventName}>
                  {items[0].event_name}
                </p>

                {/* Tiers */}
                <div className={styles.summary__tierList}>
                  {items.map(item => (
                    <div key={item.tier_id} className={styles.summary__tierRow}>
                      <div className={styles.summary__tierInfo}>
                        <p className={styles.summary__tierName}>
                          {item.tier_name}
                        </p>
                        <p className={styles.summary__tierQty}>
                          {item.quantity} × ${Number(item.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className={styles.summary__tierSubtotal}>
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

      {/* Breakdown + total — solo si hay items */}
      {cart.length > 0 && (
        <>
          <div className={styles.summary__divider} />

          {/* Subtotal breakdown */}
          <div className={styles.summary__breakdown}>
            <div className={styles.summary__breakdownRow}>
              <p className={styles.summary__breakdownLabel}>
                Subtotal ({totalQty} entrada{totalQty !== 1 ? 's' : ''})
              </p>
              <p className={styles.summary__breakdownValue}>
                ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={styles.summary__breakdownRow}>
              <p className={styles.summary__breakdownLabel}>Descuentos</p>
              <p className={[styles.summary__breakdownValue, styles['summary__breakdownValue--discount']].join(' ')}>
                —
              </p>
            </div>
          </div>

          <div className={styles.summary__divider} />

          {/* Total */}
          <div className={styles.summary__total}>
            <p className={styles.summary__totalLabel}>Total</p>
            <p className={styles.summary__totalAmount}>
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </>
      )}

      {/* Security badge */}
      <div className={styles.summary__securityBadge}>
        <span className={styles.summary__securityIcon}>🔒</span>
        <p className={styles.summary__securityText}>Compra 100% segura y encriptada</p>
      </div>

    </div>
  )
}