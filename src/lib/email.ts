import { Resend } from 'resend';
import { getBookingConfirmationEmailTemplate } from './email-templates';

// Fallback display names if DB lookup failed.
function getServiceDisplayName(serviceSlug: string): string {
  const serviceMap: Record<string, string> = {
    'studio-makeup': 'Studio makeup',
    'party-guest-makeup': 'Party guest makeup',
    'photoshoot-glam': 'Photoshoot glam',
    'bridesmaids-bookings': 'Bridesmaids bookings',
    'prom-glam': 'Graduation & Prom Glam',
    'travel-makeup': 'Travel to client location makeup service',
    'diy-makeup-class': 'DIY one on one makeup class',
    'gele-tying': 'Gele tying',
    'bridal-civil': 'Civil wedding',
    'bridal-traditional': 'Traditional wedding',
    'bridal-white': 'White wedding',
    'bridal-combination': 'Complete Bridal Package',
    'bridal-trial': 'Bridal trial',
  };
  return serviceMap[serviceSlug] || serviceSlug;
}

export async function sendBookingEmail(payload: {
  name: string;
  email: string;
  phone: string;
  service: string;
  serviceTitle?: string;
  priceFrom?: number | null;
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
    day: 'numeric',
  });

  const serviceDisplayName = payload.serviceTitle || getServiceDisplayName(payload.service);

  const emailTemplate = getBookingConfirmationEmailTemplate(
    payload.name,
    payload.email,
    payload.phone,
    serviceDisplayName,
    formattedDate,
    payload.time,
    payload.priceFrom ?? null,
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
