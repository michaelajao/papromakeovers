import { NextRequest, NextResponse } from 'next/server';
import { verifySession, getSecurityHeaders } from '@/lib/auth';

// Define routes that require authentication
const protectedRoutes = ['/admin'];
const authRoutes = ['/admin/login', '/admin/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply security headers to all responses
  const response = NextResponse.next();
  const headers = getSecurityHeaders();
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Check if this is a protected admin route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !isAuthRoute) {
    // Get session token from cookie
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie) {
      // No session cookie, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Verify session token
    const sessionData = verifySession(sessionCookie.value);
    
    if (!sessionData) {
      // Invalid session, clear cookie and redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('expired', '1');
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete('admin-session');
      
      // Apply security headers to redirect response
      Object.entries(headers).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      
      return redirectResponse;
    }
    
    // Session is valid, add user data to request headers for use in components
    response.headers.set('X-Admin-Email', sessionData.email);
    response.headers.set('X-Admin-Login-Time', sessionData.loginTime.toString());
  }
  
  // If user is already authenticated and trying to access auth routes, redirect to admin
  if (isAuthRoute && pathname !== '/admin/reset-password') {
    const sessionCookie = request.cookies.get('admin-session');
    
    if (sessionCookie) {
      const sessionData = verifySession(sessionCookie.value);
      
      if (sessionData) {
        // User is already logged in, redirect to admin panel
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }
  
  return response;
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes that handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};