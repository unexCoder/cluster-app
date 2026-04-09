import { Resend } from 'resend';
import { welcomeEmailTemplate } from './email-templates';
import { TicketEmail, type TicketEmailData } from '@/lib/email-templates'


export const resend = new Resend(process.env.RESEND_API_KEY);
export const runtime = "nodejs";
export const maxDuration = 10;

export async function sendWelcomeEmail(
  email: string, 
  confirmationToken?: string
) {
  try {
    const template = welcomeEmailTemplate(email, confirmationToken);
    
    const { data, error } = await resend.emails.send({
      // from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      from: 'Festival Cluster <hola@festivalcluster.org>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    return { success: false, error };
  }
}


export async function sendTicketEmail(data: TicketEmailData) {
  try {
    const template =  await TicketEmail(data)
    const { data: result, error } = await resend.emails.send({
      from:    'Festival Cluster <tickets@festivalcluster.org>',
      to:      data.guest_email,
      subject: template.subject,
      html:    template.html,
      text:    template.text,
    })
    if (error) {
      console.error('[TicketEmail] Resend error:', error)
      return { success: false, error }
    }
    return { success: true, data: result }
  } catch (error) {
    console.error('[TicketEmail] Unexpected error:', error)
    return { success: false, error }
  }
}