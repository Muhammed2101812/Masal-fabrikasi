// tests/ageLengths.test.ts

import { ageLengths, getAgeLengthConfig, AgeLengthConfig } from '../lib/ageLengths';

describe('ageLengths.ts', () => {
  describe('ageLengths', () => {
    it('should have correct configuration for age group 3-5', () => {
      const config = ageLengths['3-5'];
      expect(config).toBeDefined();
      expect(config.minLength).toBe(80);
      expect(config.maxLength).toBe(120);
      expect(config.targetLength).toBe(100);
    });
    
    it('should have correct configuration for age group 6-8', () => {
      const config = ageLengths['6-8'];
      expect(config).toBeDefined();
      expect(config.minLength).toBe(150);
      expect(config.maxLength).toBe(250);
      expect(config.targetLength).toBe(200);
    });
    
    it('should have correct configuration for age group 9-12', () => {
      const config = ageLengths['9-12'];
      expect(config).toBeDefined();
      expect(config.minLength).toBe(250);
      expect(config.maxLength).toBe(350);
      expect(config.targetLength).toBe(300);
    });
  });
  
  describe('getAgeLengthConfig', () => {
    it('should return correct config for valid age group', () => {
      const config = getAgeLengthConfig('3-5');
      const expectedConfig: AgeLengthConfig = {
        minLength: 80,
        maxLength: 120,
        targetLength: 100
      };
      expect(config).toEqual(expectedConfig);
    });
    
    it('should return default config for invalid age group', () => {
      const config = getAgeLengthConfig('invalid');
      const expectedConfig: AgeLengthConfig = {
        minLength: 150,
        maxLength: 250,
        targetLength: 200
      };
      expect(config).toEqual(expectedConfig);
    });
  });
});