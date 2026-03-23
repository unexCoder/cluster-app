import React, { useEffect, useState } from 'react'
import styles from './dashboardViews.module.css'
import { fetchTicketValidationLogs } from '@/lib/api/ticketValidationLog'
import { TicketValidationLog } from '../../../../../../types/types'
import { formatDate } from '@/app/utils/dateFormat'
import { fetchUsersAction } from '@/app/actions/users'

interface BrowseTicketValidationLogProps {
  onNavigate: (view: string, id?: string | null) => void
}

interface User {
  id: string
  name: string
}

export const VALIDATION_COLOR: Record<string, string> = {
  entry: '#22c55e', // green
  re_entry: '#10b981', // emerald
  exit: '#f97316', // orange
  verification: '#3b82f6', // blue
  test: '#9ca3af', // gray
}

export const VALIDATION_STATUS_COLOR: Record<string, string> = {
  success: '#22c55e', // green
  already_used: '#f59e0b', // amber
  invalid_token: '#ef4444', // red
  expired: '#9ca3af', // gray
  cancelled: '#6366f1', // indigo
  wrong_event: '#f97316', // orange
  wrong_date: '#fb923c', // orange light
  wrong_gate: '#8b5cf6', // purple
  suspended: '#ec4899', // pink
  network_error: '#3b82f6', // blue
  device_error: '#0ea5e9', // sky
}

export default function BrowseTicketValidationLogs({ onNavigate }: BrowseTicketValidationLogProps) {
  const [validations, setValidations] = useState<TicketValidationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadValidations()
    loadUsers()
  }, [])

  const loadValidations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTicketValidationLogs()
      setValidations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const result = await fetchUsersAction()
      if (result.success) {
        console.log(result.users)
        setUsers(result.users.map((u: any) => ({
          id: u.id,
          name: u.last_name
        })))
      }

    } catch (err) {
      console.error('Failed to load users:', err)
    }
  }

  console.log('tiers: ', validations)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Browse Ticket Scans</h2>
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

      {!loading && !error && validations.length === 0 && (
        <div className={styles.empty}>No scan logs found</div>
      )}

      {!loading && !error && validations.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Type</th>
                <th>Result</th>
                <th>Failure Reason</th>
                <th>Scanned By</th>
                <th>Gate</th>
                <th>Device</th>
                <th>App Version</th>
                <th>IP</th>
                <th>Duration</th>
                <th>Attempted At</th>
              </tr>
            </thead>
            <tbody>
              {validations.map((log) => (
                <tr key={log.id}>
                  <td>{log.ticket_id}</td>
                  <td style={{ color: VALIDATION_COLOR[log.validation_type] ?? '#888888', fontWeight: 600 }}>{log.validation_type}</td>
                  <td style={{ color: VALIDATION_STATUS_COLOR[log.result] ?? '#888888', fontWeight: 600 }}>{log.result}</td>
                  <td>{log.failure_reason ?? '—'}</td>
                  <td>{users.find(u => u.id === log.scanned_by)?.name ?? log.scanned_by}</td>
                  <td>{log.gate_id ?? '—'}</td>
                  <td>{log.device_id ?? '—'}</td>
                  <td>{log.scanner_app_version ?? '—'}</td>
                  <td>{log.ip_address ?? '—'}</td>
                  <td>{log.scan_duration_ms ? `${log.scan_duration_ms}ms` : '—'}</td>
                  <td>{log.attempted_at ? formatDate(log.attempted_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* {!loading && !error && (
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(validations, null, 2)}
        </pre>
      )} */}
    </div>
  )
}
