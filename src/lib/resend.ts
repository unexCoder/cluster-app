import { Resend } from 'resend';
import { welcomeEmailTemplate } from './email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  email: string, 
  confirmationToken?: string
) {
  try {
    const template = welcomeEmailTemplate(email, confirmationToken);
    
    const { data, error } = await resend.emails.send({
      // from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      from: 'hello@festivalcluster.org',
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