import { NextRequest, NextResponse } from 'next/server';
import { 
  validatePassword,
  getSecurityHeaders,
  createSession,
  getSessionCookieOptions,
  SessionData
} from '@/lib/auth';
import { resetTokens } from '../reset/route';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Find and validate reset token
    const resetTokenData = resetTokens.get(token);
    if (!resetTokenData) {
      return NextResponse.json(
        { 
          error: 'Invalid reset token',
          message: 'This reset link is invalid or has expired.'
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check if token is expired
    if (Date.now() > resetTokenData.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json(
        { 
          error: 'Reset token expired',
          message: 'This reset link has expired. Please request a new one.'
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid password',
          message: passwordValidation.message
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Update the environment variable (in production, this would update a secure database)
    // For now, we'll update the running environment
    process.env.ADMIN_PASSCODE = newPassword;

    // Remove used token
    resetTokens.delete(token);

    // Create a new session for the user (auto-login after password reset)
    const sessionData: SessionData = {
      adminId: 'admin',
      email: resetTokenData.email,
      loginTime: Date.now(),
      rememberMe: false
    };

    const sessionToken = createSession(sessionData);

    // Create response
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Password updated successfully. You are now logged in.',
        redirectTo: '/admin'
      },
      { status: 200, headers: getSecurityHeaders() }
    );

    // Set secure session cookie
    response.cookies.set(
      'admin-session',
      sessionToken,
      getSessionCookieOptions(false)
    );

    console.log('Password reset completed successfully for:', resetTokenData.email);
    return response;

  } catch (error) {
    console.error('Password reset verification error:', error);
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

export async function GET(req: NextRequest) {
  // Validate reset token (for checking if token is valid before showing form)
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const resetTokenData = resetTokens.get(token);
    if (!resetTokenData) {
      return NextResponse.json(
        { 
          error: 'Invalid token',
          valid: false,
          message: 'This reset link is invalid.'
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Check if token is expired
    if (Date.now() > resetTokenData.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json(
        { 
          error: 'Token expired',
          valid: false,
          message: 'This reset link has expired. Please request a new one.'
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    const timeRemaining = resetTokenData.expiresAt - Date.now();
    const minutesRemaining = Math.ceil(timeRemaining / (1000 * 60));

    return NextResponse.json(
      { 
        valid: true,
        email: resetTokenData.email,
        expiresIn: minutesRemaining
      },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        valid: false
      },
      { 
        status: 500,
        headers: getSecurityHeaders()
      }
    );
  }
}