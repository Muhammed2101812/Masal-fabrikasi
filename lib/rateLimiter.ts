// lib/rateLimiter.ts

// Sliding window rate limiting middleware
// Gerçekte, daha sağlam bir çözüm için redis gibi bir veritabanı kullanılabilir

interface RateLimitInfo {
  timestamps: number[];
}

const rateLimits = new Map<string, RateLimitInfo>();

export const rateLimiter = (maxRequests: number, windowMs: number) => {
  return (ip: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimits.has(ip)) {
      rateLimits.set(ip, {
        timestamps: [now]
      });
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs
      };
    }
    
    const rateLimitInfo = rateLimits.get(ip)!;
    
    // Remove timestamps outside the window
    rateLimitInfo.timestamps = rateLimitInfo.timestamps.filter(timestamp => timestamp > windowStart);
    
    // If the count is below the limit, add timestamp and allow
    if (rateLimitInfo.timestamps.length < maxRequests) {
      rateLimitInfo.timestamps.push(now);
      return {
        allowed: true,
        remaining: maxRequests - rateLimitInfo.timestamps.length,
        resetTime: now + windowMs
      };
    }
    
    // Otherwise, deny the request
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.min(...rateLimitInfo.timestamps) + windowMs
    };
  };
};

// 10 requests per minute
export const defaultRateLimiter = rateLimiter(10, 60 * 1000);