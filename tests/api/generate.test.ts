// tests/api/generate.test.ts

import { POST as generatePOST } from '../../app/api/generate/route';
import * as gemini from '@/lib/gemini';

jest.mock('@/lib/rateLimiter');

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body,
    headers: {
      get: (key: string) => {
        if (key === 'x-forwarded-for') {
          return '127.0.0.1';
        }
        return null;
      },
    },
  } as any;
};

describe('POST /api/generate', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate a story with valid input', async () => {
    const mockGenerateStory = jest.fn().mockResolvedValue('Bir zamanlar uzak bir galakside...');

    jest.spyOn(gemini, 'getGeminiClient').mockReturnValue({
      generateStory: mockGenerateStory,
    } as any);

    const request = createMockRequest({
      ageGroup: '3-5',
      category: 'adventure',
      length: 'short',
    });

    const response = await generatePOST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('story');
    expect(responseBody.story).toBe('Bir zamanlar uzak bir galakside...');
  });

  it('should return error for missing ageGroup', async () => {
    const request = createMockRequest({
      category: 'adventure',
      length: 'short',
    });

    const response = await generatePOST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toHaveProperty('error');
  });

  it('should handle internal server error gracefully', async () => {
    jest.spyOn(gemini, 'getGeminiClient').mockImplementation(() => {
      throw new Error('AI service error');
    });

    const request = createMockRequest({
      ageGroup: '3-5',
      category: 'adventure',
      length: 'short',
    });

    const response = await generatePOST(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody).toHaveProperty('error');
  });
});
