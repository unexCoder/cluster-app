import { Resend } from 'resend'
import { PassCardEmailTemplate, type TicketEmailData } from './email-templates'
const resend = new Resend(process.env.RESEND_API_KEY)

 
export async function sendPassCardEmail(data: TicketEmailData) {
  const { subject, html, text } = await PassCardEmailTemplate(data)
 
  return resend.emails.send({
    from:    process.env.RESEND_TICKET_EMAIL ?? 'info@festivalcluster.org',
    to:          data.guest_email,
    subject,
    html,
    text,
  })
}