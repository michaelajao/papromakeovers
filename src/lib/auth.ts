import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Types
export interface SessionData {
  adminId: string;
  email: string;
  loginTime: number;
  rememberMe: boolean;
}

export interface ResetToken {
  token: string;
  email: string;
  expiresAt: number;
}

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const SESSION_DURATION = parseInt(process.env.SESSION_DURATION || '1800'); // 30 minutes
const REMEMBER_ME_DURATION = parseInt(process.env.REMEMBER_ME_DURATION || '604800'); // 7 days
const ADMIN_EMAIL = 'papromakeoversstudio@gmail.com';

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session utilities
export function createSession(sessionData: SessionData): string {
  const expiresIn = sessionData.rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
  
  return jwt.sign(
    {
      ...sessionData,
      expiresAt: Date.now() + (expiresIn * 1000)
    },
    JWT_SECRET,
    { expiresIn: `${expiresIn}s` }
  );
}

export function verifySession(token: string): SessionData | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if token is expired
    if (decoded.expiresAt && Date.now() > decoded.expiresAt) {
      return null;
    }
    
    return {
      adminId: decoded.adminId,
      email: decoded.email,
      loginTime: decoded.loginTime,
      rememberMe: decoded.rememberMe
    };
  } catch {
    return null;
  }
}

// Reset token utilities
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createResetToken(email: string): ResetToken {
  return {
    token: generateResetToken(),
    email,
    expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
  };
}

export function isResetTokenValid(resetToken: ResetToken): boolean {
  return Date.now() < resetToken.expiresAt;
}

// Password validation
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
}

// Rate limiting utilities
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const resetAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(
  ip: string, 
  type: 'login' | 'reset', 
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remainingTime?: number } {
  const attempts = type === 'login' ? loginAttempts : resetAttempts;
  const now = Date.now();
  const userAttempts = attempts.get(ip);
  
  if (!userAttempts) {
    attempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }
  
  // Reset if window has passed
  if (now - userAttempts.lastAttempt > windowMs) {
    attempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true };
  }
  
  if (userAttempts.count >= maxAttempts) {
    const remainingTime = windowMs - (now - userAttempts.lastAttempt);
    return { allowed: false, remainingTime };
  }
  
  userAttempts.count++;
  userAttempts.lastAttempt = now;
  return { allowed: true };
}

export function resetRateLimit(ip: string, type: 'login' | 'reset'): void {
  const attempts = type === 'login' ? loginAttempts : resetAttempts;
  attempts.delete(ip);
}

// Admin utilities
export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

export function isValidAdminCredentials(password: string): boolean {
  const envPassword = process.env.ADMIN_PASSCODE;
  return envPassword === password;
}

// Security headers
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  };
}

// Cookie utilities
export function getSessionCookieOptions(rememberMe: boolean = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION,
    path: '/'
  };
}