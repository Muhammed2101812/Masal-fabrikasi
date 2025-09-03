// tests/api/cover.test.ts

import { POST as coverPOST } from '../../app/api/cover/route';

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body
  };
};

describe('POST /api/cover', () => {
  it('should generate a cover image with valid category', async () => {
    const request = createMockRequest({
      category: 'adventure'
    });
    
    // @ts-ignore - Partial mock
    const response = await coverPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('coverImage');
    expect(typeof responseBody.coverImage).toBe('string');
    expect(responseBody.coverImage).toMatch(/^data:image\/svg\+xml;base64,/);
  });
  
  it('should return error for missing category', async () => {
    const request = createMockRequest({});
    
    // @ts-ignore - Partial mock
    const response = await coverPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(400);
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toBe('Kategori gereklidir.');
  });
  
  it('should use default category for unknown category', async () => {
    const request = createMockRequest({
      category: 'unknown'
    });
    
    // @ts-ignore - Partial mock
    const response = await coverPOST(request);
    const responseBody = await response.json();
    
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('coverImage');
    expect(typeof responseBody.coverImage).toBe('string');
    expect(responseBody.coverImage).toMatch(/^data:image\/svg\+xml;base64,/);
  });
});