'use client'

import React, { useEffect, useState } from 'react'
import { fetchReceivedEmailsAction } from '@/app/actions/emails'
import styles from './dashboardViews.module.css'

interface ReceivedEmail {
  id: string
  resend_email_id?: string
  resend_message_id?: string
  from_address: string
  to_addresses: string[]
  cc_addresses?: string[]
  bcc_addresses?: string[]
  reply_to?: string[]
  subject?: string
  html?: string
  body_text?: string
  headers?: Record<string, string>
  attachments?: unknown[]
  webhook_type: string
  raw_payload?: unknown
  sent_at?: string
  received_at: string
}

export default function BrowseEmails() {
  const [emails, setEmails] = useState<ReceivedEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchReceivedEmailsAction()

      if (result.success) {
        setEmails(result.emails)
      } else {
        throw new Error(result.error || 'Failed to fetch emails')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getWebhookTypeBadgeColor = (webhookType: string) => {
    switch (webhookType) {
      case 'email.received':
        return '#059669'
      case 'email.bounced':
        return '#ef4444'
      case 'email.complained':
        return '#f59e0b'
      case 'email.delivery_delayed':
        return '#250fc3'
      default:
        return '#6b7280'
    }
  }

  const formatAddresses = (addresses: string[] | undefined): string => {
    if (!addresses || addresses.length === 0) return 'N/A'
    if (addresses.length === 1) return addresses[0]
    return `${addresses[0]} +${addresses.length - 1} more`
  }

  const truncateSubject = (subject: string | undefined): string => {
    if (!subject) return '(no subject)'
    return subject.length > 60 ? subject.slice(0, 60) + '…' : subject
  }

  const handleRowClick = (emailId: string) => {
    setExpandedId(prev => (prev === emailId ? null : emailId))
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading emails...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchEmails} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Received Emails</h2>
        <button onClick={fetchEmails} className={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {emails.length === 0 ? (
        <div className={styles.empty}>No emails found</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
                {/* <th style={{ paddingLeft: '28px' }}>Type</th> */}
                <th>Attachments</th>
                {/* <th>Sent At</th> */}
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <React.Fragment key={email.id}>
                  <tr
                    onClick={() => handleRowClick(email.id)}
                    style={{ cursor: 'pointer' }}
                    title="Click to expand"
                  >
                    <td>{email.from_address}</td>
                    <td>{formatAddresses(email.to_addresses)}</td>
                    <td>{truncateSubject(email.subject)}</td>
                    {/* <td>
                      <span
                        className={styles.roleBadge}
                        style={{
                          backgroundColor: getWebhookTypeBadgeColor(email.webhook_type),
                        }}
                      >
                        {email.webhook_type}
                      </span>
                    </td> */}
                    <td>
                      {email.attachments && email.attachments.length > 0
                        ? `${email.attachments.length} file${email.attachments.length > 1 ? 's' : ''}`
                        : 'None'}
                    </td>
                    {/* <td>
                      {email.sent_at
                        ? new Date(email.sent_at).toLocaleDateString()
                        : 'N/A'}
                    </td> */}
                    <td>
                      {email.received_at
                        ? new Date(email.received_at).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(email.id)
                        }}
                      >
                        {expandedId === email.id ? 'Collapse' : 'View'}
                      </button>
                    </td>
                  </tr>

                  {expandedId === email.id && (
                    <tr>
                      <td colSpan={8}>
                        <div style={{ padding: '12px 16px', background: '#1a1a2e', borderRadius: '6px', fontSize: '13px', lineHeight: '1.6' }}>
                          {email.cc_addresses && email.cc_addresses.length > 0 && (
                            <p><strong>CC:</strong> {email.cc_addresses.join(', ')}</p>
                          )}
                          {email.reply_to && email.reply_to.length > 0 && (
                            <p><strong>Reply-To:</strong> {email.reply_to.join(', ')}</p>
                          )}
                          {email.resend_email_id && (
                            <p><strong>Resend Email ID:</strong> {email.resend_email_id}</p>
                          )}
                          {email.body_text && (
                            <div>
                              <strong>Body:</strong>
                              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '6px', maxHeight: '200px', overflowY: 'auto', background: '#111', padding: '8px', borderRadius: '4px' }}>
                                {email.body_text}
                              </pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}