import { Resend } from 'resend';
import { getBookingConfirmationEmailTemplate } from './email-templates';

export async function sendBookingEmail(payload: {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("Resend API key not configured; skipping email send");
    return { skipped: true } as const;
  }

  const resend = new Resend(resendApiKey);
  
  const formattedDate = new Date(payload.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Determine location based on service
  const location = payload.service === 'Travel to client location makeup service' 
    ? 'At your location' 
    : 'PaproMakeovers Studio, Coventry';

  const emailTemplate = getBookingConfirmationEmailTemplate(
    payload.name,
    payload.service,
    formattedDate,
    payload.time,
    location
  );

  try {
    const { data, error } = await resend.emails.send({
      from: 'Papromakeovers <bookings@papromakeovers.com>',
      to: [payload.email],
      bcc: ['papromakeoversstudio@gmail.com'],
      replyTo: 'papromakeoversstudio@gmail.com',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(`Email send failed: ${error.message}`);
    }

    return { ok: true, data } as const;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}


