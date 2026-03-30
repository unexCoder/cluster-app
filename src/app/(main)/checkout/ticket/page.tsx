'use client'
import TicketCard from "../components/TicketCard"


export default function TicketPage() {
  const ticket = {
    eventName: 'FESTIVAL CLUSTER',
    description: 'Electronic & Media Arts Festival',
    date: '21 JUN 2026',
    time: '20:00',
    location: 'Warehouse 23',
    zone: 'Main Stage',
    name: 'Juan Pérez',
    ticketId: '95cce602-d49e-47e6-b71e-aa5494406b39',
    ticketClass: 'VIP',
    gate: 'B',
    seat: '—',
    price: '$19.000',
    barcodeValue: 'CF-984721-SECURE',
    barcodeFormat: 'QR' as const,
    qrUrl: '/qr-example.png' // podés usar tu endpoint dinámico acá
  }

  return (
    <>
      {/* BOARDING PASS STYLE */}
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'20px 0'}}>
        <TicketCard
          variant="boarding"
          {...ticket}
        />
      </div>

      {/* MINIMAL / PREMIUM STYLE */}
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <TicketCard
          variant="minimal"
          {...ticket}
        />
      </div>
    </>
  )
}