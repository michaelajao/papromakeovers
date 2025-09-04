import { NextRequest } from 'next/server';

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function rateLimit(options: RateLimitOptions) {
  const {
    maxRequests,
    windowMs,
    keyGenerator = (req: NextRequest) => getClientIP(req)
  } = options;

  return {
    check: (req: NextRequest): { success: boolean; limit: number; remaining: number; resetTime: number } => {
      const key = keyGenerator(req);
      const now = Date.now();
      const resetTime = now + windowMs;

      const current = rateLimitMap.get(key);

      if (!current || now > current.resetTime) {
        // First request or window expired
        rateLimitMap.set(key, { count: 1, resetTime });
        return {
          success: true,
          limit: maxRequests,
          remaining: maxRequests - 1,
          resetTime
        };
      }

      if (current.count >= maxRequests) {
        // Rate limit exceeded
        return {
          success: false,
          limit: maxRequests,
          remaining: 0,
          resetTime: current.resetTime
        };
      }

      // Increment count
      current.count += 1;
      rateLimitMap.set(key, current);

      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - current.count,
        resetTime: current.resetTime
      };
    },

    reset: (req: NextRequest): void => {
      const key = keyGenerator(req);
      rateLimitMap.delete(key);
    }
  };
}

// Helper function to get client IP
function getClientIP(req: NextRequest): string {
  // Try various headers for client IP
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default if no IP can be determined
  return 'unknown';
}

// Pre-configured rate limiters for different endpoints
export const bookingRateLimit = rateLimit({
  maxRequests: 5, // 5 booking attempts
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const availabilityRateLimit = rateLimit({
  maxRequests: 60, // 60 requests
  windowMs: 60 * 1000, // 1 minute
});

export const authRateLimit = rateLimit({
  maxRequests: 5, // 5 login attempts
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const generalAPIRateLimit = rateLimit({
  maxRequests: 100, // 100 requests
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Middleware helper for rate limiting
export function withRateLimit(
  rateLimiter: ReturnType<typeof rateLimit>,
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest): Promise<Response> => {
    const result = rateLimiter.check(req);
    
    if (!result.success) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler(req);
    
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    
    return response;
  };
}