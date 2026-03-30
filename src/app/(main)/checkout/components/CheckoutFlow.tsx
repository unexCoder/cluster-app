'use client'

import { useState } from 'react'
import { CartItem, GuestInfo, CheckoutState, PaymentMethod, CardInfo } from '@/../types/checkout'
import Step1Tickets from './Step1Tickets'
import Step2GuestInfo from './Step2GuestInfo'
import Step3Payment from './Step3Payment'
import OrderSummary from './OrderSummary'
import { createOrder } from '@/lib/api/order'
import { useSearchParams } from 'next/navigation'
import styles from './checkout.module.css'

interface CheckoutFlowProps {
    eventId?: string  // pre-seleccionado si viene desde /event/[slug]
}

export default function CheckoutFlow({ eventId }: CheckoutFlowProps) {
    const searchParams = useSearchParams()
    const preselectedEventId = eventId ?? searchParams.get('event_id') ?? undefined
    const [state, setState] = useState<CheckoutState>({
        step: 1,
        cart: [],
        guest: null,
        order_id: null,
        order_number: null,
        payment_method: null,
        card: null,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const totalAmount = state.cart.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
    )

    const [liveCart, setLiveCart] = useState<CartItem[]>([])
    const liveTotalAmount = liveCart.reduce((acc, i) => acc + i.price * i.quantity, 0)

    // ── Step 1 → Step 2 ───────────────────────────────────────
    const handleCartConfirm = (cart: CartItem[]) => {
        setState(prev => ({ ...prev, cart, step: 2 }))
    }

    // ── Step 2 → Step 3 — crea la order ──────────────────────
    const handleGuestConfirm = async (guest: GuestInfo) => {
        if (state.cart.length === 0) return
        setLoading(true)
        setError(null)
        console.log(state.cart)
        try {
            const event_id = state.cart[0].event_id

            const order = await createOrder({
                guest_name: guest.guest_name,
                guest_email: guest.guest_email,
                guest_phone: guest.guest_phone,
                event_id,
                subtotal: totalAmount,
                total_amount: totalAmount,
                items: state.cart.map(item => ({ // map all items
                    ticket_tier_id: item.tier_id,
                    quantity: item.quantity
                }))
            })
            console.log(order)

            setState(prev => ({
                ...prev,
                guest,
                order_id: order.id,
                order_number: order.order_number,
                step: 3
            }))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order')
        } finally {
            setLoading(false)
        }
    }

    // ── Step 3 → Step 4 — pago completado ────────────────────
    const handlePaymentComplete = (result: {
        payment_id: string
        status: string
        approval_url?: string
        ticket_url?: string
        barcode_content?: string
    }) => {
        if (result.approval_url) {
            window.location.href = result.approval_url
            return
        }
        const params = new URLSearchParams({
            order_id: state.order_id!,
            payment_id: result.payment_id,
            status: result.status,
            ...(result.ticket_url && { ticket_url: result.ticket_url }),
            ...(result.barcode_content && { barcode_content: result.barcode_content }),
        })
        window.location.href = `/checkout/success?${params.toString()}`
    }

    const handleBack = () => {
        setState(prev => ({ ...prev, step: (prev.step - 1) as 1 | 2 | 3 | 4, error: null }))
        setError(null)
    }

    const steps = [
        { n: 1, label: 'Tickets' },
        { n: 2, label: 'Tus datos' },
        { n: 3, label: 'Pago' },
    ]

    return (
        <div className={styles.checkout}>
            {/* ── Main flow ── */}
            <div className={styles.checkout__main}>

                {/* Step indicators */}
                <div className={styles.stepBar}>
                    {steps.map((s, i) => {
                        const isCompleted = state.step > s.n
                        const isActive = state.step === s.n

                        return (
                            <div key={s.n} className={styles.stepBar__item}>
                                <div className={styles.stepBar__content}>
                                    <div className={[
                                        styles.stepBar__circle,
                                        isCompleted ? styles['stepBar__circle--completed'] : '',
                                        isActive ? styles['stepBar__circle--active'] : '',
                                    ].join(' ')}>
                                        {isCompleted ? '✓' : s.n}
                                    </div>
                                    <span className={[
                                        styles.stepBar__label,
                                        isCompleted ? styles['stepBar__label--completed'] : '',
                                        isActive ? styles['stepBar__label--active'] : '',
                                    ].join(' ')}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={[
                                        styles.stepBar__connector,
                                        isCompleted ? styles['stepBar__connector--completed'] : '',
                                    ].join(' ')} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Error global */}
                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                {/* Steps */}
                {state.step === 1 && (
                    <Step1Tickets
                        preselectedEventId={preselectedEventId}
                        onConfirm={handleCartConfirm}
                        onCartChange={setLiveCart}
                    />
                )}

                {state.step === 2 && (
                    <Step2GuestInfo
                        loading={loading}
                        onConfirm={handleGuestConfirm}
                        onBack={handleBack}
                    />
                )}

                {state.step === 3 && state.order_id && state.guest && (
                    <Step3Payment
                        orderId={state.order_id}
                        amount={totalAmount}
                        guest={state.guest}
                        cart={state.cart}
                        onComplete={handlePaymentComplete}
                        onBack={handleBack}
                    />
                )}
            </div>

            {/* ── Order summary sidebar ── */}
            <OrderSummary
                cart={state.step === 1 ? liveCart : state.cart}
                orderNumber={state.order_number}
                total={state.step === 1 ? liveTotalAmount : totalAmount}
            />
        </div>
    )
}