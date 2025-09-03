import { Resend } from 'resend';

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
      from: 'PaproMakeovers <bookings@papromakeovers.com>',
      to: [payload.email],
      replyTo: 'papromakeoversstudios@gmail.com',
      subject: `Booking Confirmation - ${payload.service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b49b82;">Booking Confirmation</h2>
          <p>Dear ${payload.name},</p>
          <p>Thank you for booking with PaproMakeovers! Your appointment has been confirmed.</p>
          
          <div style="background-color: #faf8f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a4037; margin-top: 0;">Appointment Details</h3>
            <p><strong>Service:</strong> ${payload.service}</p>
            <p><strong>Date:</strong> ${new Date(payload.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${payload.time}</p>
            <p><strong>Phone:</strong> ${payload.phone}</p>
            ${payload.notes ? `<p><strong>Notes:</strong> ${payload.notes}</p>` : ''}
          </div>
          
          <p>We look forward to seeing you! If you need to reschedule or have any questions, please contact us.</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated confirmation email from PaproMakeovers.
          </p>
        </div>
      `,
      text: `
Dear ${payload.name},

Thank you for booking with PaproMakeovers! Your appointment has been confirmed.

APPOINTMENT DETAILS
Service: ${payload.service}
Date: ${new Date(payload.date).toLocaleDateString()}
Time: ${payload.time}
Phone: ${payload.phone}
${payload.notes ? `Notes: ${payload.notes}` : ''}

We look forward to seeing you! If you need to reschedule or have any questions, please contact us.

This is an automated confirmation email from PaproMakeovers.
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


