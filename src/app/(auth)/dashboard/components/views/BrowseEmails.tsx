'use client'

import React, { useEffect, useState } from 'react'
import { fetchReceivedEmailsAction } from '@/app/actions/emails'
import styles from './dashboardViews.module.css'

interface EmailAttachment {
  id?: string
  filename: string
  content_type?: string
  size?: number
  content_disposition?: string
  download_url?: string | null
}

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
  attachments?: EmailAttachment[]
  webhook_type: string
  raw_payload?: unknown
  sent_at?: string
  received_at: string
}

interface BrowseEmailsProps {
  onNavigate?: (view: string, id?: string | null) => void
}

export default function BrowseEmails({ onNavigate }: BrowseEmailsProps) {
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
        setEmails(result.emails as ReceivedEmail[])
      } else {
        throw new Error(result.error || 'Failed to fetch emails')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
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

  const AttachmentLink = ({ attachment }: { attachment: EmailAttachment }) => {
    const name = attachment.filename || 'unnamed'
    const url = attachment.download_url

    if (url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#60a5fa',
            textDecoration: 'none',
            fontSize: '12px',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #1e40af',
            background: '#1e3a5f22',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1e3a5f55')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1e3a5f22')}
          title={`Download ${name}${attachment.size ? ` (${formatBytes(attachment.size)})` : ''}`}
        >
          📎 <span style={{ paddingLeft: '5px' }}>{name}</span>
        </a>
      )
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: '#9ca3af',
          fontSize: '12px',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid #374151',
          whiteSpace: 'nowrap',
        }}
        title={attachment.size ? formatBytes(attachment.size) : undefined}
      >
        📎 {name}
      </span>
    )
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Loading emails...</div></div>
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchEmails} className={styles.retryButton}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Inbox</h2>
        <button onClick={fetchEmails} className={styles.refreshButton}>Refresh</button>
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
                <th>Attachments</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => {
                const attachments = email.attachments ?? []
                return (
                  <React.Fragment key={email.id}>
                    <tr
                      onClick={() => handleRowClick(email.id)}
                      style={{ cursor: 'pointer' }}
                      title="Click to expand"
                    >
                      <td>{email.from_address}</td>
                      <td>{formatAddresses(email.to_addresses)}</td>
                      <td>{truncateSubject(email.subject)}</td>

                      {/* Attachment column: show linked filenames inline */}
                      <td>
                        {attachments.length === 0 ? (
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>None</span>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {attachments.map((a, i) => (
                              <AttachmentLink key={a.id ?? i} attachment={a} />
                            ))}
                          </div>
                        )}
                      </td>

                      <td>{email.received_at ? new Date(email.received_at).toLocaleString() : 'N/A'}</td>
                      <td>
                        <button
                          className={styles.actionButton}
                          onClick={(e) => { e.stopPropagation(); handleRowClick(email.id) }}
                        >
                          {expandedId === email.id ? 'Collapse' : 'View'}
                        </button>
                      </td>
                    </tr>

                    {expandedId === email.id && (
                      <tr>
                        <td colSpan={6}>
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

                            {/* Attachments detail */}
                            {attachments.length > 0 && (
                              <div style={{ marginTop: '8px' }}>
                                <strong>Attachments ({attachments.length}):</strong>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                                  {attachments.map((a, i) => (
                                    <div
                                      key={a.id ?? i}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: '#111',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        gap: '12px',
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                        <span>📎</span>
                                        <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {a.filename}
                                        </span>
                                        {a.content_type && (
                                          <span style={{ color: '#6b7280', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                            {a.content_type}
                                          </span>
                                        )}
                                        {a.size && (
                                          <span style={{ color: '#6b7280', fontSize: '11px', whiteSpace: 'nowrap' }}>
                                            {formatBytes(a.size)}
                                          </span>
                                        )}
                                      </div>
                                      {a.download_url ? (
                                        <a
                                          href={a.download_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          style={{
                                            color: '#60a5fa',
                                            textDecoration: 'none',
                                            fontSize: '12px',
                                            padding: '3px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #1e40af',
                                            background: '#1e3a5f44',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                          }}
                                        >
                                          Download ↓
                                        </a>
                                      ) : (
                                        <span style={{ color: '#6b7280', fontSize: '11px', flexShrink: 0 }}>
                                          No URL
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {email.body_text && (
                              <div style={{ marginTop: '10px' }}>
                                <strong>Body:</strong>
                                <pre style={{ whiteSpace: 'pre-wrap', marginTop: '6px', maxHeight: '200px', overflowY: 'auto', background: '#111', padding: '8px', borderRadius: '4px' }}>
                                  {email.body_text}
                                </pre>
                              </div>
                            )}
                            {/* Reply button */}
                            <div style={{ marginTop: '12px', borderTop: '1px solid #2d2d4e', paddingTop: '12px' }}>
                              <button
                                className={styles.actionButton}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onNavigate?.('Compose', email.from_address)
                                }}
                              >
                                Reply to {email.from_address}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}