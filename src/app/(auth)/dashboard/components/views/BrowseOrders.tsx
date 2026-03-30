// 'use client'
import React, { useEffect, useState } from 'react'
import styles from './dashboardViews.module.css'
import { fetchOrders } from '@/lib/api/order'
import { Order } from '@/../types/types'

interface BrowseOrdersProps {
  onNavigate: (view: string, id?: string | null) => void
}

const STATUS_COLOR: Record<string, string> = {
  pending:            '#f59e0b', // amber
  confirmed:          '#22c55e', // green
  cancelled:          '#ef4444', // red
  refunded:           '#3b82f6', // blue
  partially_refunded: '#8b5cf6', // purple
}

export default function BrowseOrders({ onNavigate }: BrowseOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  console.log(orders)
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Orders</h2>
        {/* <button
          className={styles.refreshButton}
          onClick={() => onNavigate('Event Create')}
        >
          Add Ticket Tier
        </button> */}
      </div>

      {!loading && !error && orders.length === 0 && (
        <div className={styles.empty}>No orders found</div>
      )}

      {loading && <p>Loading...</p>}

      {error && (
        <pre style={{ color: 'red' }}>
          ERROR: {error}
        </pre>
      )}
      {!loading && !error && orders.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Guest</th>
                <th>Email</th>
                {/* <th>Phone</th> */}
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_number}</td>
                  <td>{order.guest_name}</td>
                  <td
                      onClick={() => onNavigate?.('Compose', order.guest_email)}
                      style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {order.guest_email}
                    </td>
                  {/* <td>{order.guest_phone ?? '—'}</td> */}
                  <td>${Number(order.subtotal).toFixed(2)}</td>
                  <td>${Number(order.discount_amount ?? 0).toFixed(2)}</td>
                  <td>${Number(order.tax_amount ?? 0).toFixed(2)}</td>
                  <td>${Number(order.total_amount).toFixed(2)}</td>
                  <td  style={{ color: STATUS_COLOR[order.status] ?? '#888888', fontWeight: 600 }}>{order.status}</td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* {!loading && !error && (
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(orders, null, 2)}
        </pre>
      )} */}
    </div>
  )
}
