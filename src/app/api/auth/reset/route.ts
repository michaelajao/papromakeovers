import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { 
  createResetToken, 
  checkRateLimit,
  getAdminEmail,
  getSecurityHeaders,
  ResetToken
} from '@/lib/auth';
import { getPasswordResetEmailTemplate } from '@/lib/email-templates';

// In-memory storage for reset tokens (in production, use Redis or database)
const resetTokens = new Map<string, ResetToken>();

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfIP) return cfIP;
  
  return 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req);
    
    // Check rate limiting (3 attempts per hour for reset requests)
    const rateLimit = checkRateLimit(clientIP, 'reset', 3, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      const remainingMinutes = Math.ceil((rateLimit.remainingTime || 0) / (1000 * 60));
      return NextResponse.json(
        { 
          error: 'Too many reset attempts', 
          message: `Please wait ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} before requesting another reset.`
        },
        { 
          status: 429,
          headers: getSecurityHeaders()
        }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Verify this is the admin email
    const adminEmail = getAdminEmail();
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Create reset token
    const resetTokenData = createResetToken(email);
    resetTokens.set(resetTokenData.token, resetTokenData);

    // Clean up expired tokens
    for (const [token, data] of resetTokens.entries()) {
      if (Date.now() > data.expiresAt) {
        resetTokens.delete(token);
      }
    }

    // Send reset email
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('Resend API key not configured; password reset email not sent');
      // Still return success to prevent email enumeration
      return NextResponse.json(
        { 
          success: true,
          message: 'If this email is associated with an admin account, you will receive password reset instructions.'
        },
        { headers: getSecurityHeaders() }
      );
    }

    const resend = new Resend(resendApiKey);
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://papromakeovers.com' 
      : `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const emailTemplate = getPasswordResetEmailTemplate(resetTokenData.token, baseUrl);

    try {
      await resend.emails.send({
        from: 'PaproMakeovers <noreply@papromakeovers.com>',
        to: [email],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });

      console.log('Password reset email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Still return success to prevent email enumeration attacks
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'If this email is associated with an admin account, you will receive password reset instructions.'
      },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.'
      },
      { 
        status: 500,
        headers: getSecurityHeaders()
      }
    );
  }
}

// Export the token storage for use in the verification endpoint
export { resetTokens };