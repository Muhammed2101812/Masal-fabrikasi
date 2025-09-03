// lib/prompts.ts

export interface PromptConfig {
  ageGroup: '3-5' | '6-8' | '9-12';
  category: string;
  length: 'short' | 'medium' | 'long';
}

export const generateSystemPrompt = (config: PromptConfig): string => {
  const basePrompt = `Sen Türkçe hikaye yazarı bir asistansın. ${config.ageGroup} yaş grubundaki çocuklar için hikayeler yazacaksın.`;
  
  const categoryPrompts: Record<string, string> = {
    adventure: 'Hikayen macera temalı olmalı.',
    fairyTale: 'Hikayen masal tarzında olmalı.',
    animal: 'Hikayen hayvan karakterler içermeli.',
    space: 'Hikayen uzay temalı olmalı.'
  };
  
  const lengthPrompts: Record<string, string> = {
    short: 'Hikaye kısa olmalı (yaklaşık 100 kelime).',
    medium: 'Hikaye orta uzunlukta olmalı (yaklaşık 200 kelime).',
    long: 'Hikaye uzun olmalı (yaklaşık 300 kelime).'
  };
  
  return `${basePrompt} ${categoryPrompts[config.category] || ''} ${lengthPrompts[config.length] || ''}`;
};

export const generateUserPrompt = (config: PromptConfig): string => {
  return `Lütfen ${config.ageGroup} yaş grubu için, ${config.category} kategorisinde, ${config.length} uzunluğunda bir hikaye yaz.`;
};