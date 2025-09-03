// tests/api/cover-ai.test.ts

import { POST as coverAiPOST } from '../../app/api/cover-ai/route';

jest.mock('@/lib/gemini');

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body
  };
};

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('POST /api/cover-ai', () => {
  it('should generate a cover image with valid input', async () => {
    const request = createMockRequest({
      category: 'adventure',
      story: 'Bu bir macera hikayesidir.'
    });
    
    // @ts-ignore - Partial mock
    const response = await coverAiPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('coverImage');
    expect(typeof responseBody.coverImage).toBe('string');
    expect(responseBody.coverImage).not.toContain('fallback'); // Should not be a fallback
  });
  
  it('should return error for missing category', async () => {
    const request = createMockRequest({
      story: 'Bu bir macera hikayesidir.'
    });
    
    // @ts-ignore - Partial mock
    const response = await coverAiPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(400);
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe('Kategori ve hikaye gereklidir.');
  });
  
  it('should return error for missing story', async () => {
    const request = createMockRequest({
      category: 'adventure'
    });
    
    // @ts-ignore - Partial mock
    const response = await coverAiPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(400);
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe('Kategori ve hikaye gereklidir.');
  });
  
  it('should handle internal server error gracefully and return fallback', async () => {
    const { getGeminiClient } = require('@/lib/gemini');
    getGeminiClient.mockImplementationOnce(() => ({
      getGenerativeModel: () => ({
        generateContent: () => Promise.reject(new Error('AI service error')),
      }),
    }));

    const request = createMockRequest({
      category: 'adventure',
      story: 'Bu bir macera hikayesidir.'
    });
    
    // @ts-ignore - Partial mock
    const response = await coverAiPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('coverImage');
    expect(typeof responseBody.coverImage).toBe('string');
    expect(responseBody).toHaveProperty('fallback', true);
  });
});