import React from 'react'
import { type TicketData as PassCardProps } from '@/../types/ticket'

export { type PassCardProps }

export interface TicketEmailAttachment {
  filename: string
  path: string
  contentId: string
}

export interface TicketEmailData {
  guest_name: string
  guest_email: string
  order_number: string
  total_amount: string
  event: {
    name: string
    date: string
    time: string
    location: string
  }
  cards: Array<PassCardProps>
}

export interface TicketEmailOutput {
  subject: string
  html: string
  text: string
}

export const welcomeEmailTemplate = (email: string, confirmationToken?: string) => {
  const confirmationUrl = confirmationToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/confirm?token=${confirmationToken}`
    : null
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`

  return {
    subject: '¡Bienvenido a la red Cluster!',
    html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido</title>
  </head>
  <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#231123;padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#CFCBCA;border-radius:8px;">
          <tr><td style="padding:40px 40px 20px;text-align:center;">
            <h1 style="margin:0;color:#231123;font-size:28px;font-weight:600;">¡Bienvenido a la red Cluster!</h1>
          </td></tr>
          <tr><td style="padding:20px 40px;">
            <p style="margin:0 0 20px;color:#231123;font-size:16px;line-height:1.6;">Gracias por unirte a nuestro newsletter.</p>
            ${confirmationUrl ? `
              <p style="margin:0 0 20px;color:#231123;font-size:16px;line-height:1.6;">Para completar tu suscripción, por favor confirma tu email:</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                <tr><td align="center">
                  <a href="${confirmationUrl}" style="display:inline-block;padding:14px 32px;background-color:#c30f45;color:#231123;text-decoration:none;border-radius:6px;font-size:16px;font-weight:600;">Confirmar mi email</a>
                </td></tr>
              </table>
              <p style="margin:20px 0 0;color:#718096;font-size:14px;">Este enlace expira en 24 horas.</p>
            ` : `
              <p style="margin:0 0 20px;color:#231123;font-size:16px;line-height:1.6;">Ahora recibirás todas nuestras novedades directamente en tu inbox.</p>
            `}
          </td></tr>
          <tr><td style="padding:30px 40px;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 10px;color:#231123;font-size:14px;line-height:1.6;">Saludos,<br><strong>El equipo de Cluster</strong></p>
            <p style="margin:20px 0 0;color:#231123;font-size:12px;line-height:1.6;">
              Si no te suscribiste, podés ignorar este email.<br>
              Para darte de baja, <a href="${unsubscribeUrl}" style="color:#3b82f6;">hacé clic aquí</a>.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
    text: confirmationUrl
      ? `¡Bienvenido!\n\nConfirmá tu email: ${confirmationUrl}\n\nExpira en 24 horas.\n\nEl equipo de Cluster`
      : `¡Bienvenido!\n\nGracias por unirte.\n\nEl equipo de Cluster`,
  }
}

export async function PassCardHtml(props: PassCardProps): Promise<string> {
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { PassCard } = await import('@/app/components/utils/PassCard')
  return renderToStaticMarkup(React.createElement(PassCard, props))
}


export async function PassCardEmailTemplate(data: TicketEmailData): Promise<TicketEmailOutput> {
  const { guest_name, order_number, total_amount, event, cards } = data
  
  const total = Number(total_amount);
  const formattedTotal = !isNaN(total) && total > 0
  ? total.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    })
  : "Free";

  const cardHtmlParts = await Promise.all(cards.map(card => PassCardHtml(card)))
  const cardHtml = cardHtmlParts.join('')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tus entradas — ${event.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr><td align="center" style="padding:20px 12px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:0 0 8px;">
          <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Festival Cluster</p>
        </td></tr>
        <tr><td style="padding:0 0 32px;">
          <p style="margin:0;color:#9ca3af;font-size:14px;">Hola ${guest_name}, tus entradas están listas.</p>
        </td></tr>
        <tr><td style="padding:0 0 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1f2937;border-radius:12px;">
            <tr><td style="padding:20px;">
              <p style="margin:0 0 16px;color:#ffffff;font-size:18px;font-weight:700;">${event.name}</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="100%" style="display:block;">
                    <p style="margin:0 0 2px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Fecha</p>
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:500;">${event.date}</p>
                  </td>
                  <td width="100%" style="display:block;">
                    <p style="margin:0 0 2px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Hora</p>
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:500;">${event.time}</p>
                  </td>
                  <td width="100%" style="display:block;">
                    <p style="margin:0 0 2px;color:#9ca3af;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Lugar</p>
                    <p style="margin:0;color:#ffffff;font-size:14px;font-weight:500;">${event.location}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:0 0 24px;">${cardHtml}</td></tr>
        <tr><td style="padding:16px 0;border-top:1px solid #374151;border-bottom:1px solid #374151;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td><p style="margin:0;color:#9ca3af;font-size:13px;">Orden ${order_number}</p></td>
              <td align="right"><p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;">${formattedTotal}</p></td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 0 0;">
          <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;line-height:1.6;">
            Presentá el QR en la entrada del evento.<br>No compartas este código con nadie.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `Tus entradas — ${event.name}

Hola ${guest_name},

${event.name}
Fecha: ${event.date} | Hora: ${event.time} | Lugar: ${event.location}

${cards.map(c => `Entrada: ${c.tier_name}\nN°: ${c.ticket_number}\nTitular: ${guest_name}`).join('\n---\n')}

Orden: ${order_number}
// Total: $${Number(total_amount).toLocaleString('es-AR')}
Total: ${formattedTotal}

Presentá el QR en la entrada del evento.
El equipo de Festival Cluster`

  return { subject: `Tus entradas — ${event.name}`, html, text }
}