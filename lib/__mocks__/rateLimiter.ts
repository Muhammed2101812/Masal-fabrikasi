// lib/__mocks__/rateLimiter.ts

export const defaultRateLimiter = jest.fn(() => ({ allowed: true, remaining: 10, resetTime: Date.now() + 60000 }));
