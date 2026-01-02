'use client'

import React, { useEffect, useState } from 'react'
import { fetchMailingListAction } from '@/app/actions/mailingList'
import styles from './browseUsers.module.css'

interface MailingListRow {
    id: string
    email: string
    name: string
    status: string
    suscribed_at?: string
    confirmed_at?: string
    ip_address?: string
    user_agent?: string
}

export default function BrowseUsers() {
    const [mailingList, setMailingList] = useState<MailingListRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchMailingList()
    }, [])

    const fetchMailingList = async () => {
        try {
            setLoading(true)
            setError(null)

            const result = await fetchMailingListAction()

            if (result.success) {
                setMailingList(result.mailing_list)
            } else {
                throw new Error(result.error || 'Failed to fetch mailing list')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading users...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>Error: {error}</p>
                    <button onClick={fetchMailingList} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Mailing List</h2>
                <button onClick={fetchMailingList} className={styles.refreshButton}>
                    Refresh
                </button>
            </div>

            {mailingList.length === 0 ? (
                <div className={styles.empty}>No users found</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Suscribed At</th>
                                <th>Status</th>
                                <th>IP Address</th>
                                <th>User Agent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mailingList.map((mail) => (
                                <tr key={mail.id}>
                                    <td>{mail.email}</td>

                                    <td>
                                        {mail.confirmed_at
                                            ? new Date(mail.confirmed_at).toLocaleDateString()
                                            : 'N/A'}
                                    </td>
                                    <td
                                        style={{ color: mail.status === 'active' ? '#44ef44' : '#ef4444' }}
                                    >{mail.status}</td>

                                    <td>{mail.ip_address}</td>
                                    <td style={{ fontSize: '12px' }}>{mail.user_agent}</td>

                                    <td>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => console.log('Delete user:', mail.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}