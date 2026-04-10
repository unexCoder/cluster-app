import { requireApiKey } from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'
import { type TicketEmailData } from '@/lib/email-templates'
import { formatDate, formatDateForEmail } from '@/app/utils/dateFormat'

export const runtime = 'nodejs'
export const maxDuration = 10

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
// const baseUrl = process.env.BASE_URL

function toAbsoluteUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

// async function fetchAsset(url: string): Promise<string> {
//   if (!url) return ''
//   try {
//     const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
//     if (!res.ok) return ''
//     const contentType = res.headers.get('content-type') ?? ''
//     if (contentType.includes('svg')) return await res.text()
//     const buffer = await res.arrayBuffer()
//     return `data:${contentType.split(';')[0]};base64,${Buffer.from(buffer).toString('base64')}`
//   } catch {
//     return url
//   }
// }

export async function POST(request: NextRequest) {
  const authError = requireApiKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { guest_email, guest_name, order_number, event, tickets, total_amount } = body

    if (!guest_email || !tickets?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const cards = tickets.map((ticket: any) => ({
      ticket_id:      ticket.qr_token,
      ticket_number:  ticket.ticket_number,
      background_url: toAbsoluteUrl(ticket.background_url),
      qr_src:         `${baseUrl}/api/qr/${ticket.qr_token}?format=png&${extractBckGnda(ticket.background_url)}`,
      guest_name,
      event_name:     event.name,
      date:           event.date,
      time:           event.time     ?? '',
      location:       event.location ?? '',
      tier_name:      ticket.tier_name,
      tier_price:     ticket.tier_price ?? '',
    }))

    const total = total_amount > 1 ? String(total_amount) : "Free" 
    // const time = Date(event.time). 
    const emailData: TicketEmailData = {
      guest_name,
      guest_email,
      order_number,
      total_amount: total,
      event: {
        name: event.name,
        date: formatDateForEmail(event.date),
        time: event.time ? event.time.slice(0,5) : '',
        location: event.location ?? '',
      },
      cards,
    }

    console.log('[cards]', JSON.stringify(cards, null, 2))
    const { sendPassCardEmail } = await import('@/lib/send-passcard-email').catch(() => ({
      sendPassCardEmail: null
    }))

    if (!sendPassCardEmail) {
      console.warn('[TicketEmail] sendTicketEmail not available')
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 503 })
    }

    const result = await sendPassCardEmail(emailData)
    console.log('[Resend]', JSON.stringify(result))

    if (result.error) {
      console.error('[TicketEmail] Resend error:', result.error)
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (error) {
    console.error('[TicketEmail] Route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function extractBckGnda(url: string) {
  const match = url.match(/bckGnda=[^&?]+/);
  return match ? match[0].replace("bckGnda=", "bg=") : null;
}



    // const cards = await Promise.all(
    //   tickets.map(async (ticket: any) => {
    //     const [qr_src, background_url] = await Promise.all([
    //       fetchAsset(`${baseUrl}/api/qr/${ticket.qr_token}?format=png`),
    //       fetchAsset(toAbsoluteUrl(ticket.background_url)),
    //     ])
    //     return {
    //       ticket_id: ticket.qr_token,
    //       ticket_number: ticket.ticket_number,
    //       background_url,
    //       qr_src,
    //       guest_name,
    //       event_name: event.name,
    //       date: event.date,
    //       time: event.time ?? '',
    //       location: event.location ?? '',
    //       tier_name: ticket.tier_name,
    //       tier_price: ticket.tier_price ?? '',
    //     }
    //   })
    // )
