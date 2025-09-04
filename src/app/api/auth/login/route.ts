import { NextRequest, NextResponse } from 'next/server';
import { 
  createSession, 
  isValidAdminCredentials, 
  checkRateLimit, 
  resetRateLimit,
  getSecurityHeaders,
  getSessionCookieOptions,
  SessionData
} from '@/lib/auth';

function getClientIP(req: NextRequest): string {
  // Get IP from various headers (for different proxy setups)
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  return 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req);
    
    // Check rate limiting
    const rateLimit = checkRateLimit(clientIP, 'login');
    if (!rateLimit.allowed) {
      const remainingMinutes = Math.ceil((rateLimit.remainingTime || 0) / (1000 * 60));
      return NextResponse.json(
        { 
          error: 'Too many login attempts', 
          message: `Please wait ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} before trying again.`,
          retryAfter: rateLimit.remainingTime
        },
        { 
          status: 429,
          headers: getSecurityHeaders()
        }
      );
    }

    const body = await req.json();
    const { password, rememberMe = false } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Validate credentials against environment variable
    const isValid = isValidAdminCredentials(password);

    if (!isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          message: 'The password you entered is incorrect.'
        },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Reset rate limiting on successful login
    resetRateLimit(clientIP, 'login');

    // Create session data
    const sessionData: SessionData = {
      adminId: 'admin',
      email: 'papromakeoversstudio@gmail.com',
      loginTime: Date.now(),
      rememberMe: Boolean(rememberMe)
    };

    // Create session token
    const sessionToken = createSession(sessionData);

    // Create response
    const response = NextResponse.json(
      { 
        success: true,
        message: 'Login successful',
        redirectTo: '/admin'
      },
      { 
        status: 200,
        headers: getSecurityHeaders()
      }
    );

    // Set secure session cookie
    response.cookies.set(
      'admin-session',
      sessionToken,
      getSessionCookieOptions(Boolean(rememberMe))
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);
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

export async function DELETE() {
  // Logout endpoint
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200, headers: getSecurityHeaders() }
    );

    // Clear session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}