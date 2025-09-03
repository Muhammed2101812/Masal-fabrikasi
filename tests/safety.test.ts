// tests/safety.test.ts

import { preProcess, postCheck, sanitizeAndRegenerate } from '../lib/safety';

describe('safety.ts', () => {
  describe('preProcess', () => {
    it('should return the same prompt without modification', () => {
      const prompt = 'Bu bir test promptudur.';
      const processedPrompt = preProcess(prompt);
      expect(processedPrompt).toBe(prompt);
    });
  });
  
  describe('postCheck', () => {
    it('should detect banned words and sanitize content', () => {
      const content = 'Bu hikayede şiddet ve korku unsurları var.';
      const result = postCheck(content);
      
      expect(result.isSafe).toBe(false);
      expect(result.sanitizedContent).toBe('Bu hikayede ****** ve ***** unsurları var.');
    });
    
    it('should pass safe content without modification', () => {
      const content = 'Bu hikaye çok eğlenceli ve dostluk temalı.';
      const result = postCheck(content);
      
      expect(result.isSafe).toBe(true);
      expect(result.sanitizedContent).toBe(content);
    });
  });
  
  describe('sanitizeAndRegenerate', () => {
    it('should sanitize content with banned words', async () => {
      const content = 'Bu hikayede şiddet ve korku unsurları var.';
      const sanitizedContent = await sanitizeAndRegenerate(content);
      
      expect(sanitizedContent).toBe('Bu hikayede ****** ve ***** unsurları var.');
    });
  });
});