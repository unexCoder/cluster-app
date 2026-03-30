import { Order } from '../../../types/types'

const API_BASE = process.env.NEXT_PUBLIC_CLUSTER_TICKET_API
const API_SECRET = process.env.NEXT_PUBLIC_CLUSTER_TICKET_API_SECRET ?? ''

const headers = {
  'Content-Type': 'application/json',
  'X-API-Secret': API_SECRET
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/order`, {
    method: 'GET',
    headers
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch ticket tiers: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

type Item = {
  ticket_tier_id: string;
  quantity: number;
};

export async function createOrder(data: {
  guest_name: string
  guest_email: string
  guest_phone?: string
  event_id: string
  subtotal: number
  discount_amount?: number
  tax_amount?: number
  total_amount: number
  items: Item[]
}) {


  const payload = {
    // id: crypto.randomUUID(), // se genera en backend
    order_number: `ORD-${Date.now()}`,
    guest_name: data.guest_name,
    guest_email: data.guest_email,
    guest_phone: data.guest_phone || null,
    event_id: data.event_id,
    subtotal: data.subtotal.toFixed(2),
    discount_amount: data.discount_amount?.toFixed(2) ?? '0.00',
    tax_amount: data.tax_amount?.toFixed(2) ?? '0.00',
    total_amount: data.total_amount.toFixed(2),
    status: 'pending',
    items: data.items.map(i => ({
      ticket_tier_id: i.ticket_tier_id,
      quantity: i.quantity
    }))
  }
  console.log("payload:: ",payload)  
  const res = await fetch(`${API_BASE}/order`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || `Failed to create order: ${res.status}`)
  }

  return res.json()
}

export async function fetchOrderById(id: string) {
  const res = await fetch(`${API_BASE}/order/${id}`, { headers })
  if (!res.ok) throw new Error(`Order not found: ${res.status}`)
  return res.json()
}