// tests/prompts.test.ts

import { generateSystemPrompt, generateUserPrompt, PromptConfig } from '../lib/prompts';

describe('prompts.ts', () => {
  describe('generateSystemPrompt', () => {
    it('should generate a system prompt for age group 3-5 with adventure category and short length', () => {
      const config: PromptConfig = {
        ageGroup: '3-5',
        category: 'adventure',
        length: 'short'
      };
      
      const prompt = generateSystemPrompt(config);
      expect(prompt).toContain('3-5 yaş grubundaki çocuklar için hikayeler yazacaksın');
      expect(prompt).toContain('Hikayen macera temalı olmalı');
      expect(prompt).toContain('Hikaye kısa olmalı');
    });
    
    it('should generate a system prompt for age group 6-8 with fairyTale category and medium length', () => {
      const config: PromptConfig = {
        ageGroup: '6-8',
        category: 'fairyTale',
        length: 'medium'
      };
      
      const prompt = generateSystemPrompt(config);
      expect(prompt).toContain('6-8 yaş grubundaki çocuklar için hikayeler yazacaksın');
      expect(prompt).toContain('Hikayen masal tarzında olmalı');
      expect(prompt).toContain('Hikaye orta uzunlukta olmalı');
    });
    
    it('should generate a system prompt for age group 9-12 with animal category and long length', () => {
      const config: PromptConfig = {
        ageGroup: '9-12',
        category: 'animal',
        length: 'long'
      };
      
      const prompt = generateSystemPrompt(config);
      expect(prompt).toContain('9-12 yaş grubundaki çocuklar için hikayeler yazacaksın');
      expect(prompt).toContain('Hikayen hayvan karakterler içermeli');
      expect(prompt).toContain('Hikaye uzun olmalı');
    });
    
    it('should handle unknown category gracefully', () => {
      const config: PromptConfig = {
        ageGroup: '6-8',
        category: 'unknown',
        length: 'medium'
      };
      
      const prompt = generateSystemPrompt(config);
      expect(prompt).toContain('6-8 yaş grubundaki çocuklar için hikayeler yazacaksın');
      expect(prompt).not.toContain('Hikayen');
      expect(prompt).toContain('Hikaye orta uzunlukta olmalı');
    });
  });
  
  describe('generateUserPrompt', () => {
    it('should generate a user prompt for age group 3-5 with space category and short length', () => {
      const config: PromptConfig = {
        ageGroup: '3-5',
        category: 'space',
        length: 'short'
      };
      
      const prompt = generateUserPrompt(config);
      expect(prompt).toBe('Lütfen 3-5 yaş grubu için, space kategorisinde, short uzunluğunda bir hikaye yaz.');
    });
  });
});