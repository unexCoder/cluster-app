import { Payment } from '../../../types/types'

const API_BASE = process.env.NEXT_PUBLIC_CLUSTER_TICKET_API
const API_SECRET = process.env.NEXT_PUBLIC_CLUSTER_TICKET_API_SECRET ?? ''

const headers = {
  'Content-Type': 'application/json',
  'X-API-Secret': API_SECRET
}

export async function fetchPayments(): Promise<Payment[]> {
  const res = await fetch(`${API_BASE}/payment`, {
    method: 'GET',
    headers
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch ticket tiers: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// MercadoPago — tarjeta
export async function createCardCheckout(data: {
  order_id: string
  amount: string
  description: string
  email: string
  name: string
  card_number: string
  expiration_month: number
  expiration_year: number
  security_code: string
  cardholder_name: string
  doc_type: string
  doc_number: string
  installments?: number
}) {
  const res = await fetch(`${API_BASE}/payment/create-checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      provider: 'mercadopago',
      payment_method: 'credit_card',
      installments: 1,
      ...data
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `Checkout failed: ${res.status}`)
  }
  return res.json()
}

// MercadoPago — rapipago / pagofacil
export async function createTicketCheckout(data: {
  order_id: string
  amount: string
  email: string
  name: string
  doc_type: string
  doc_number: string
  payment_method_id: 'rapipago' | 'pagofacil'
  expiration_time?: string
}) {
  const res = await fetch(`${API_BASE}/payment/create-ticket-checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      provider: 'mercadopago',
      expiration_time: 'P3D',
      ...data
    })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `Ticket checkout failed: ${res.status}`)
  }
  return res.json()
}

// PayPal
export async function createPayPalCheckout(data: {
  order_id: string
  amount: string
  currency: string
  description: string
  email: string
  name: string
}) {
  const res = await fetch(`${API_BASE}/payment/create-paypal-checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `PayPal checkout failed: ${res.status}`)
  }
  return res.json()
}

export async function getPaymentStatus(paymentId: string) {
  const res = await fetch(`${API_BASE}/payment/${paymentId}/status`, { headers })
  if (!res.ok) throw new Error(`Payment not found: ${res.status}`)
  return res.json()
}