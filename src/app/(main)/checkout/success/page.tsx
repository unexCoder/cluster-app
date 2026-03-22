// app/checkout/success/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchOrderById } from '@/lib/api/order'
import { getPaymentStatus } from '@/lib/api/payment'
import Link from 'next/link'
import Barcode from 'react-barcode'

interface OrderData {
  id: string
  order_number: string
  guest_name: string
  guest_email: string
  total_amount: string
  status: string
  event_id: string
}

interface PaymentData {
  payment_id: string
  order_id: string
  status: string
  provider: string
  payment_method: string
  reference: string
}

export default function CheckoutSuccess() {
  const params = useSearchParams()
  const orderId = params.get('order_id')
  const paymentId = params.get('payment_id')
  const token = params.get('token')     // ← PayPal token
  const payerId = params.get('PayerID') // ← PayPal PayerID
  const status = params.get('status')
  const ticketUrl = params.get('ticket_url')
  const barcodeContent = params.get('barcode_content')

  const [order, setOrder] = useState<OrderData | null>(null)
  const [payment, setPayment] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // PayPal redirect — tiene token pero no order_id/payment_id
    if (token && !orderId) {
      // buscar el payment por referencia usando el token
      // por ahora mostrar estado pendiente sin fetch
      setLoading(false)
      return
    }

    if (!orderId || !paymentId) {
      setError('Información de orden no disponible')
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const [orderData, paymentData] = await Promise.all([
          fetchOrderById(orderId),
          getPaymentStatus(paymentId)
        ])
        setOrder(orderData)
        setPayment(paymentData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la orden')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [orderId, paymentId, token])

  // ── status config ──────────────────────────────────────────
  const statusConfig: Record<string, {
    icon: string
    title: string
    message: string
    color: string
    bg: string
  }> = {
    completed: {
      icon: '✅',
      title: '¡Pago confirmado!',
      message: 'Tu compra fue procesada exitosamente. Recibirás tus tickets por email en los próximos minutos.',
      color: '#22c55e',
      bg: '#052e16'
    },
    pending: {
      icon: '⏳',
      title: 'Pago pendiente',
      message: 'Tu pago está siendo procesado. Recibirás un email cuando se confirme.',
      color: '#f59e0b',
      bg: '#451a03'
    },
    processing: {
      icon: '🔄',
      title: 'Procesando pago',
      message: 'Tu pago está en proceso. Te notificaremos cuando esté confirmado.',
      color: '#3b82f6',
      bg: '#1e3a5f'
    },
    failed: {
      icon: '❌',
      title: 'Pago fallido',
      message: 'No pudimos procesar tu pago. Por favor intentá nuevamente.',
      color: '#ef4444',
      bg: '#450a0a'
    },
  }

  const currentStatus = status ?? payment?.status ?? 'pending'
  const config = statusConfig[currentStatus] ?? statusConfig.pending

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '3px solid #374151',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Cargando tu orden...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '480px', margin: '60px auto', padding: '0 16px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>⚠️</p>
        <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px' }}>
          Algo salió mal
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px' }}>
          {error}
        </p>
        <Link href="/checkout" style={{
          display: 'inline-block', padding: '12px 24px',
          background: '#3b82f6', color: 'white',
          borderRadius: '8px', textDecoration: 'none',
          fontWeight: '600', fontSize: '14px'
        }}>
          Volver al checkout
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '560px', margin: '0 auto',
      padding: '48px 16px'
    }}>
      {/* Status card */}
      <div style={{
        background: config.bg,
        border: `1px solid ${config.color}33`,
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <p style={{ fontSize: '56px', margin: '0 0 16px' }}>{config.icon}</p>
        <h1 style={{
          fontSize: '24px', fontWeight: '700',
          margin: '0 0 8px', color: config.color
        }}>
          {config.title}
        </h1>
        <p style={{ color: '#d1d5db', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>
          {config.message}
        </p>
      </div>

      {/* Order details */}
      {order && (
        <div style={{
          background: '#1f2937', borderRadius: '12px',
          border: '1px solid #374151', overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '14px 20px', background: '#111827',
            borderBottom: '1px solid #374151'
          }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>
              Detalle de tu orden
            </p>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: '0'
          }}>
            {[
              { label: 'Número de orden', value: order.order_number },
              { label: 'Nombre', value: order.guest_name },
              { label: 'Email', value: order.guest_email },
              { label: 'Total', value: `$${Number(order.total_amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` },
              { label: 'Estado', value: order.status },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 20px',
                borderBottom: i < 4 ? '1px solid #374151' : 'none',
                gap: '16px'
              }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', flexShrink: 0 }}>
                  {row.label}
                </p>
                <p style={{
                  margin: 0, fontSize: '14px', fontWeight: '500',
                  textAlign: 'right', wordBreak: 'break-all',
                  color: row.label === 'Estado'
                    ? statusConfig[order.status]?.color ?? '#f9fafb'
                    : '#f9fafb'
                }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment details */}
      {payment && (
        <div style={{
          background: '#1f2937', borderRadius: '12px',
          border: '1px solid #374151', overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '14px 20px', background: '#111827',
            borderBottom: '1px solid #374151'
          }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>
              Detalle del pago
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: 'Proveedor', value: payment.provider },
              { label: 'Método', value: payment.payment_method.replace('_', ' ') },
              { label: 'Referencia', value: payment.reference },
              { label: 'Estado', value: payment.status },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '12px 20px',
                borderBottom: i < 3 ? '1px solid #374151' : 'none',
                gap: '16px'
              }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', flexShrink: 0 }}>
                  {row.label}
                </p>
                <p style={{
                  margin: 0, fontSize: '14px', fontWeight: '500',
                  textAlign: 'right', wordBreak: 'break-all',
                  color: row.label === 'Estado'
                    ? statusConfig[payment.status]?.color ?? '#f9fafb'
                    : '#f9fafb',
                  textTransform: 'capitalize'
                }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(ticketUrl || barcodeContent) && (
        <div style={{
          background: '#1f2937', borderRadius: '12px',
          border: '1px solid #374151', overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '14px 20px', background: '#111827',
            borderBottom: '1px solid #374151'
          }}>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>
              Cupón de pago
            </p>
          </div>
          <div style={{
            padding: '20px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '16px'
          }}>
            {barcodeContent && (
              <div style={{
                background: 'white', padding: '16px',
                borderRadius: '8px', textAlign: 'center'
              }}>
                <Barcode
                  value={barcodeContent}
                  format="ITF"
                  width={1.5}
                  height={80}
                  displayValue={false}
                  background="#ffffff"
                  lineColor="#111827"
                />
                <p style={{
                  margin: '8px 0 0', fontSize: '13px',
                  color: '#111827', letterSpacing: '0.08em',
                  fontFamily: 'monospace'
                }}>
                  {barcodeContent}
                </p>
              </div>
            )}
            {ticketUrl && (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block', padding: '12px 24px',
                  background: '#10b981', color: 'white',
                  borderRadius: '8px', textDecoration: 'none',
                  fontWeight: '600', fontSize: '14px'
                }}
              >
                Ver cupón completo →
              </a>
            )}
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>
              Presentá este cupón en cualquier sucursal de {payment?.payment_method?.replace('_', ' ')} para abonar en efectivo.
              Vence en 3 días.
            </p>
          </div>
        </div>
      )}


      {/* Email notice */}
      <div style={{
        padding: '14px 16px', background: '#111827',
        borderRadius: '10px', border: '1px solid #1f2937',
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>📧</span>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600' }}>
            Revisá tu email
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
            Tus tickets llegarán a <strong style={{ color: '#d1d5db' }}>{order?.guest_email}</strong> una vez confirmado el pago.
            Revisá también la carpeta de spam.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentStatus === 'failed' ? (
          <Link href="/checkout" style={{
            display: 'block', padding: '14px',
            background: '#3b82f6', color: 'white',
            borderRadius: '8px', textDecoration: 'none',
            fontWeight: '600', fontSize: '15px',
            textAlign: 'center'
          }}>
            Intentar nuevamente
          </Link>
        ) : (
          <Link href="/" style={{
            display: 'block', padding: '14px',
            background: '#3b82f6', color: 'white',
            borderRadius: '8px', textDecoration: 'none',
            fontWeight: '600', fontSize: '15px',
            textAlign: 'center'
          }}>
            Volver al inicio
          </Link>
        )}

        <Link href="/checkout" style={{
          display: 'block', padding: '13px',
          background: 'transparent', color: '#9ca3af',
          border: '1px solid #374151',
          borderRadius: '8px', textDecoration: 'none',
          fontWeight: '500', fontSize: '14px',
          textAlign: 'center'
        }}>
          Comprar más entradas
        </Link>
      </div>

    </div>
  )
}