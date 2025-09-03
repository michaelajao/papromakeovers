import { Resend } from 'resend';
import { BookingEmailTemplate } from '@/components/email-template';

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

  try {
    const { data, error } = await resend.emails.send({
      from: 'Papromakeovers <bookings@papromakeovers.com>',
      to: [payload.email],
      bcc: ['papromakeoversstudios@gmail.com'],
      replyTo: 'papromakeoversstudios@gmail.com',
      subject: `Booking Confirmation - ${payload.service}`,
      react: BookingEmailTemplate({
        name: payload.name,
        service: payload.service,
        date: payload.date,
        time: payload.time,
        phone: payload.phone,
        notes: payload.notes
      }),
      text: `
Dear ${payload.name},

Thank you for booking with Papromakeovers! Your appointment has been confirmed.

APPOINTMENT DETAILS
Service: ${payload.service}
Date: ${new Date(payload.date).toLocaleDateString()}
Time: ${payload.time}
Phone: ${payload.phone}
${payload.notes ? `Notes: ${payload.notes}` : ''}

We look forward to seeing you! If you need to reschedule or have any questions, please contact us.

You will receive an invoice in your email shortly.

This is an automated confirmation email from Papromakeovers.
      `.trim(),
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


