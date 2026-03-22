import React, { useEffect, useState } from 'react'
import styles from './dashboardViews.module.css'
import { fetchTicketCheckIns } from '@/lib/api/ticketCheckin'
import { TicketCheckIn } from '../../../../../../types/types'
import { formatDate } from '@/app/utils/dateFormat'

interface BrowseTicketCheckinsProps {
  onNavigate: (view: string, id?: string | null) => void
}

export default function BrowseTicketCheckins({ onNavigate }: BrowseTicketCheckinsProps) {
  const [checkins, setCheckins] = useState<TicketCheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCheckIns()
  }, [])

  const loadCheckIns = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTicketCheckIns()
      setCheckins(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  console.log('tiers: ', checkins)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Check Ins</h2>
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
      {!loading && !error && checkins.length === 0 && (
        <div className={styles.empty}>No check-ins found</div>
      )}

      {!loading && !error && checkins.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Checked In At</th>
                <th>Checked In By</th>
                <th>Gate</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((checkin) => (
                <tr key={checkin.id}>
                  <td>{checkin.ticket_id}</td>
                  <td>{checkin.checked_in_at ? formatDate(checkin.checked_in_at) : '—'}</td>
                  <td>{checkin.checked_in_by ?? '—'}</td>
                  <td>{checkin.gate_id ?? '—'}</td>
                  <td>{checkin.device_id ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* {!loading && !error && (
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(checkins, null, 2)}
        </pre>
      )} */}
    </div>
  )
}
