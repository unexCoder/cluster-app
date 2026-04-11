'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import styles from './dashboardViews.module.css'
import { fetchTicketTiers, deleteTicketTier } from '@/lib/api/ticketTier'
import { fetchEventsAction } from '@/app/actions/events'
import { TicketTier } from '@/../types/types'
import { formatDate } from '@/app/utils/dateFormat'

interface Event {
    id: string
    name: string
    slug: string
    remaining_capacity: string
}

interface BrowseTicketTierProps {
    onNavigate: (view: string, id?: string | null) => void
}

export default function BrowseTicketTier({ onNavigate }: BrowseTicketTierProps) {
    const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [events, setEvents] = useState<Event[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [tierToDelete, setTierToDelete] = useState<TicketTier | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        loadTiers()
        loadEvents()
    }, [])

    const loadTiers = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchTicketTiers()
            setTicketTiers(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const loadEvents = async () => {
        try {
            const result = await fetchEventsAction()
            if (result.success) setEvents(result.events)
        } catch (err) {
            console.error('Failed to load events:', err)
        }
    }

    const handleDeleteClick = (tier: TicketTier) => {
        setTierToDelete(tier)
        setShowDeleteModal(true)
    }

    const handleCancelDelete = () => {
        setShowDeleteModal(false)
        setTierToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (!tierToDelete) return
        try {
            setDeleting(true)
            await deleteTicketTier(tierToDelete.id)
            setTicketTiers(ticketTiers.filter(t => t.id !== tierToDelete.id))
            setShowDeleteModal(false)
            setTierToDelete(null)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'An error occurred while deleting')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h2>Ticket Tier</h2>
                <button
                    className={styles.refreshButton}
                    onClick={() => onNavigate('Ticket Tier Create')}
                >
                    Add Ticket Tier
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {error && (
                <pre style={{ color: 'red' }}>ERROR: {error}</pre>
            )}

            {!loading && !error && ticketTiers.length === 0 && (
                <div className={styles.empty}>No ticket tiers found</div>
            )}

            {!loading && !error && ticketTiers.length > 0 && (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Event</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Sold</th>
                                <th>Reserved</th>
                                <th>Available</th>
                                <th>Max/Order</th>
                                <th>Sales Start</th>
                                <th>Sales End</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ticketTiers.map((tier) => {
                                const event = events.find(e => e.id === tier.event_id)
                                return (
                                    <tr key={tier.id}>
                                        <td>{tier.name}</td>
                                        <td>
                                            {event
                                                ? <Link href={`/event/${event.slug}`} target="_blank">{event.name}</Link>
                                                : '—'
                                            }
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            {Number(tier.price) > 0
                                                ? Number(tier.price).toLocaleString("es-AR", {
                                                    style: "decimal",
                                                    maximumFractionDigits: 0,
                                                })
                                                : "Free"}
                                        </td>
                                        <td>{tier.quantity}</td>
                                        <td>{tier.quantity_sold}</td>
                                        <td>{tier.quantity_reserved}</td>
                                        <td>{tier.quantity - tier.quantity_sold - tier.quantity_reserved}</td>
                                        <td>{tier.max_per_order ?? '—'}</td>
                                        <td>{formatDate(tier.sales_start)} hs.</td>
                                        <td>{formatDate(tier.sales_end)} hs.</td>
                                        <td style={{ color: tier.is_active ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                                            {tier.is_active ? 'Active' : 'Inactive'}
                                        </td>
                                        <td>
                                            <button
                                                className={styles.actionButton}
                                                onClick={() => onNavigate('Ticket Tier Edit', tier.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={() => handleDeleteClick(tier)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Confirm Deletion</h3>
                            <button
                                className={styles.closeButton}
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Are you sure you want to delete:</p>
                            <p style={{ fontWeight: 'bold', margin: '10px 0' }}>
                                {tierToDelete?.name}
                            </p>
                            <p style={{ color: '#ef4444', fontSize: '14px' }}>
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.deleteButton}
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}