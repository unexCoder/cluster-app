import TicketCard from '@/app/components/utils/TicketCard'
import { PassCard }  from '@/app/components/utils/PassCard'
import { type TicketData } from '@/../types/ticket'

export function randomHex24(): string {
  const value = Math.floor(Math.random() * 0xffffff);
  return value.toString(16).padStart(6, "0");
}

export default function TicketPage() {
  // const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const BASE_URL = process.env.BASE_URL ?? ''
  // const BG       = `${BASE_URL}/api/postcard?bckGnda=2ec4b6&bckGndb=ccff66&color=2eb4c6`
  const a = randomHex24();
  const b = randomHex24();
  // const BG       = `${BASE_URL}/api/postcard?bckGnda=${a}&bckGndb=${b}&color=2e3ac6`
  const BG       = `${process.env.BASE_URL}/api/postcard?bckGnda=${a}&bckGndb=${b}&color=2e3ac6`
  const TICKET_ID = '95cce602-d49e-47e6-b71e-aa5494406b39'

  const ticket: TicketData = {
    // — Identificación
    ticket_id:   TICKET_ID,
    // — Evento
    event_name:  'FESTIVAL CLUSTER',
    date:        '21 JUN 2026',
    time:        '20:00',
    location:    'Warehouse 23',
    // — Tier / Zona
    tier_name:   'Main Stage',
    tier_price:  '$19.000',
    // — Titular
    guest_name:  'Juan Pérez',
    // — Assets
    background_url: BG,
    // qr_src: `${BASE_URL}/api/qr/${TICKET_ID}`,
    qr_src: `${process.env.BASE_URL}/api/qr/${TICKET_ID}?bg=${a}`,
  }

  return (
    <>
      {/* BOARDING PASS STYLE */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
        <TicketCard {...ticket} variant="boarding" />
      </div>

      {/* MINIMAL / PREMIUM STYLE */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TicketCard {...ticket} variant="minimal" />
      </div>

      {/* PASSCARD */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
        <PassCard {...ticket} />
      </div>
    </>
  )
}