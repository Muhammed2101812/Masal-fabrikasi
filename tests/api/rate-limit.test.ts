// tests/api/rate-limit.test.ts

import { POST as generatePOST } from '../../app/api/generate/route';
import { defaultRateLimiter } from '../../lib/rateLimiter';

// Mock NextRequest
const createMockRequest = (body: any, ip: string = '127.0.0.1') => {
  return {
    json: async () => body,
    headers: {
      get: (header: string) => {
        if (header === 'x-forwarded-for') {
          return ip;
        }
        return null;
      }
    }
  };
};

// Reset rate limits before each test
beforeEach(() => {
  // This is a hack to reset the rate limits
  // In a real application, you would use a database or cache
  jest.resetModules();
});

describe('Rate Limiting', () => {
  it('should allow requests under the limit', async () => {
    const request = createMockRequest({
      ageGroup: '3-5',
      category: 'adventure',
      length: 'short'
    }, '192.168.1.1');
    
    // @ts-ignore - Partial mock
    const response = await generatePOST(request);
    
    expect(response.status).toBe(200);
  });
  
  it('should block requests over the limit', async () => {
    const ip = '192.168.1.2';
    
    // Make 10 requests to reach the limit
    for (let i = 0; i < 10; i++) {
      const request = createMockRequest({
        ageGroup: '3-5',
        category: 'adventure',
        length: 'short'
      }, ip);
      
      // @ts-ignore - Partial mock
      await generatePOST(request);
    }
    
    // The 11th request should be blocked
    const request = createMockRequest({
      ageGroup: '3-5',
      category: 'adventure',
      length: 'short'
      }, ip);
    
    // @ts-ignore - Partial mock
    const response = await generatePOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(429);
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe('Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.');
  });
});