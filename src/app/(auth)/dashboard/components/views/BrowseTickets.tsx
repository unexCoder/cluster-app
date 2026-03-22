import React, { useEffect, useState } from 'react'
import styles from './dashboardViews.module.css'
import { fetchTickets } from '@/lib/api/ticket'
import { Ticket } from '../../../../../../types/types'
import { formatDate } from '@/app/utils/dateFormat'

interface BrowseTicketsProps {
  onNavigate: (view: string, id?: string | null) => void
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b', // amber
  valid: '#22c55e', // green
  used: '#3b82f6', // blue
  active: '#10b981', // emerald
  transferred: '#8b5cf6', // purple
  cancelled: '#ef4444', // red
  refunded: '#6366f1', // indigo
  expired: '#9ca3af', // gray
  suspended: '#f97316', // orange
}

export default function BrowseTickets({ onNavigate }: BrowseTicketsProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTickets()
      setTickets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  console.log('tiers: ', tickets)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Tickets</h2>
        {/* <button
          className={styles.refreshButton}
          onClick={() => onNavigate('Event Create')}
        >
          Add Ticket Tier
        </button> */}
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <pre style={{ color: 'red' }}>
          ERROR: {error}
        </pre>
      )}
      {!loading && !error && tickets.length === 0 && (
        <div className={styles.empty}>No tickets found</div>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Order Id</th>
                <th>Holder</th>
                <th>Email</th>
                <th>Status</th>
                <th>QR Version</th>
                {/* <th>Views</th> */}
                {/* <th>Check-ins</th> */}
                {/* <th>First Check-in</th> */}
                {/* <th>Gate</th> */}
                <th>Transfers</th>
                <th>Issued At</th>
                <th>Expires At</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.ticket_number}</td>
                  <td>{ticket.order_id}</td>
                  <td>{ticket.current_holder_name ?? '—'}</td>
                  <td
                    onClick={() => onNavigate?.('Compose', ticket.current_holder_email)}
                    style={{ color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {ticket.current_holder_email}
                  </td>
                  <td style={{ color: STATUS_COLOR[ticket.status] ?? '#888888', fontWeight: 600 }}>{ticket.status}</td>
                  <td>{ticket.qr_version}</td>
                  {/* <td>{ticket.view_count ?? 0}</td> */}
                  {/* <td>{Array.isArray(ticket.check_ins) ? ticket.check_ins.length : 0}</td> */}
                  {/* <td>{ticket.first_check_in_at ? new Date(ticket.first_check_in_at).toLocaleString() : '—'}</td> */}
                  {/* <td>{ticket.check_in_gate ?? '—'}</td> */}
                  <td>{ticket.transfer_count ?? 0}</td>
                  <td>{ticket.issued_at ? formatDate(ticket.issued_at) : '—'}</td>
                  <td>{ticket.expires_at ? formatDate(ticket.expires_at) : '—'} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* {!loading && !error && (
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(tickets, null, 2)}
        </pre>
      )} */}
    </div>
  )
}
