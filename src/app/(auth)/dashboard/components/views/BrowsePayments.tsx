import React, { useEffect, useState } from 'react'
import styles from './dashboardViews.module.css'
import { fetchPayments } from '@/lib/api/payment'
import { Payment } from '../../../../../../types/types'
import { formatDate } from '@/app/utils/dateFormat'

interface BrowsePaymentsProps {
  onNavigate: (view: string, id?: string | null) => void
}

const STATUS_COLOR: Record<string, string> = {
  pending:            '#f59e0b', // amber
  processing:         '#3b82f6', // blue
  completed:          '#22c55e', // green
  failed:             '#ef4444', // red
  refunded:           '#6366f1', // indigo
  partially_refunded: '#8b5cf6', // purple
  cancelled:          '#9ca3af', // gray
}

const METHOD_COLOR: Record<string, string> = {
  credit_card:    '#3b82f6', // blue
  debit_card:     '#6366f1', // indigo
  paypal:         '#0ea5e9', // sky
  mercadopago:    '#22c55e', // green
  bank_transfer:  '#f59e0b', // amber
  cash:           '#84cc16', // lime
  crypto:         '#8b5cf6', // purple
  pagofacil:      '#f97316', // orange
  rapipago:       '#ec4899', // pink
}

export default function BrowsePayments({ onNavigate }: BrowsePaymentsProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPayments()
      setPayments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  console.log('tiers: ', payments)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Payments</h2>
        {/* <button
          className={styles.refreshButton}
          onClick={() => onNavigate('Event Create')}
        >
          Add Ticket Tier
        </button> */}
      </div>
      {loading && <p>Loading...</p>}

      {!loading && !error && payments.length === 0 && (
        <div className={styles.empty}>No payments found</div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order Id</th>
                <th>Amount</th>
                <th>Method</th>
                {/* <th>Provider</th> */}
                <th>Status</th>
                <th>Fraud Score</th>
                <th>KYC</th>
                <th>Flagged</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.transaction_id ?? '—'}</td>
                  <td>{payment.order_id}</td>
                  <td>${Number(payment.amount).toFixed(2)}</td>
                  <td style={{ color: METHOD_COLOR[payment.payment_method] ?? '#888888', fontWeight: 600 }}>{payment.payment_method}</td>
                  {/* <td>{payment.provider ?? '—'}</td> */}
                  <td style={{ color: STATUS_COLOR[payment.status] ?? '#888888', fontWeight: 600 }}>{payment.status}</td>
                  <td>{payment.fraud_score ?? '—'}</td>
                  <td>{payment.requires_kyc_verification ? 'Yes' : 'No'}</td>
                  <td>{payment.flagged_for_review ? '⚠️' : '—'}</td>
                  <td>{payment.paid_at ? formatDate(payment.paid_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* {!loading && !error && (
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(payments, null, 2)}
        </pre>
      )} */}
    </div>
  )
}
