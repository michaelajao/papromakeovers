// Types for middleware (Edge Runtime compatible)
export interface SessionData {
  adminId: string;
  email: string;
  loginTime: number;
  rememberMe: boolean;
}

export function verifySession(token: string): SessionData | null {
  try {
    // Simple JWT verification without node crypto
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    
    // Check if token has expired based on expiresAt field
    if (payload.expiresAt && Date.now() >= payload.expiresAt) {
      return null;
    }
    
    return {
      adminId: payload.adminId,
      email: payload.email,
      loginTime: payload.loginTime,
      rememberMe: payload.rememberMe
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; font-src 'self' data:;",
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
  };
}