import { Ticket } from '../../../types/types'

export async function fetchTickets(): Promise<Ticket[]> {
  const url = `${process.env.NEXT_PUBLIC_CLUSTER_TICKET_API}/ticket`
  // console.log('Fetching:', url) // ← ver qué URL está armando
  const res = await fetch(url, {
    headers: {
      'X-API-Secret': process.env.NEXT_PUBLIC_CLUSTER_TICKET_API_SECRET ?? ''
    }
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch ticket tiers: ${res.status} ${res.statusText}`)
  }
  return res.json()
}