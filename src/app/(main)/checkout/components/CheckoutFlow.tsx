// app/checkout/_components/CheckoutFlow.tsx
'use client'

import { useState } from 'react'
import { CartItem, GuestInfo, CheckoutState, PaymentMethod, CardInfo } from '@/../types/checkout'
import Step1Tickets from './Step1Tickets'
import Step2GuestInfo from './Step2GuestInfo'
import Step3Payment from './Step3Payment'
import OrderSummary from './OrderSummary'
import { createOrder } from '@/lib/api/order'
import { useSearchParams } from 'next/navigation'

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

        try {
            // usa el event_id del primer item del carrito
            const event_id = state.cart[0].event_id

            const order = await createOrder({
                guest_name: guest.guest_name,
                guest_email: guest.guest_email,
                guest_phone: guest.guest_phone,
                event_id,
                subtotal: totalAmount,
                total_amount: totalAmount,
            })

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
        // PayPal — redirect externo
        if (result.approval_url) {
            window.location.href = result.approval_url
            return
        }
        // card o ticket — ir a success
        const params = new URLSearchParams({
        order_id:   state.order_id!,
        payment_id: result.payment_id,
        status:     result.status,
        ...(result.ticket_url      && { ticket_url:      result.ticket_url }),
        ...(result.barcode_content && { barcode_content: result.barcode_content }),
    })
        window.location.href = `/checkout/success?${params.toString()}`
    }

    const handleBack = () => {
        setState(prev => ({ ...prev, step: (prev.step - 1) as 1 | 2 | 3 | 4, error: null }))
        setError(null)
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: '32px',
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '32px 16px',
        }}>
            {/* ── Main flow ── */}
            <div>
                {/* Step indicators */}
                <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
                    {[
                        { n: 1, label: 'Tickets' },
                        { n: 2, label: 'Tus datos' },
                        { n: 3, label: 'Pago' },
                    ].map((s, i) => (
                        <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: state.step >= s.n ? '#3b82f6' : '#1f2937',
                                    color: 'white', fontSize: '14px', fontWeight: '600',
                                    border: state.step === s.n ? '2px solid #60a5fa' : '2px solid transparent',
                                    flexShrink: 0
                                }}>
                                    {state.step > s.n ? '✓' : s.n}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    color: state.step >= s.n ? '#f9fafb' : '#6b7280',
                                    fontWeight: state.step === s.n ? '600' : '400'
                                }}>
                                    {s.label}
                                </span>
                            </div>
                            {i < 2 && (
                                <div style={{
                                    flex: 1, height: '1px',
                                    background: state.step > s.n ? '#3b82f6' : '#374151',
                                    margin: '0 12px'
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Error global */}
                {error && (
                    <div style={{
                        padding: '12px 16px', marginBottom: '24px',
                        background: '#fef2f2', color: '#991b1b',
                        borderRadius: '8px', fontSize: '14px',
                        border: '1px solid #fecaca'
                    }}>
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