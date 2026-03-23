import { TicketTier } from '../../../types/types'

const API_BASE = process.env.NEXT_PUBLIC_CLUSTER_TICKET_API
const API_SECRET = process.env.NEXT_PUBLIC_CLUSTER_TICKET_API_SECRET ?? ''

const headers = {
  'Content-Type': 'application/json',
  'X-API-Secret': API_SECRET
}

export async function fetchTicketTiers(): Promise<TicketTier[]> {
  const res = await fetch(`${API_BASE}/ticket-tier`, { headers })
  if (!res.ok) throw new Error(`Failed to fetch ticket tiers: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchTicketTierById(id: string): Promise<TicketTier> {
  const res = await fetch(`${API_BASE}/ticket-tier/${id}`, { headers })
  if (!res.ok) throw new Error(`Failed to fetch ticket tier: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function createTicketTier(payload: unknown): Promise<TicketTier> {
  const res = await fetch(`${API_BASE}/ticket-tier`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || `Failed to create ticket tier: ${res.status}`)
  }
  return res.json()
}

export async function updateTicketTier(id: string, payload: unknown): Promise<TicketTier> {
  const res = await fetch(`${API_BASE}/ticket-tier/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || `Failed to update ticket tier: ${res.status}`)
  }
  return res.json()
}

export async function deleteTicketTier(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/ticket-tier/${id}`, {
    method: 'DELETE',
    headers
  })
  if (!res.ok) throw new Error(`Failed to delete ticket tier: ${res.status}`)
}

// export async function fetchTicketTiersByEvent(eventId: string): Promise<TicketTier[]> {
//   const res = await fetch(`${API_BASE}/events/${eventId}/ticket-tiers`, {
//     headers: { 'Authorization': `Bearer ${token}` }, // si tu API requiere auth
//     next: { revalidate: 60 } // opcional: caché de Next
//   })
//   if (!res.ok) throw new Error('Failed to fetch ticket tiers')
//   return res.json()
// }
