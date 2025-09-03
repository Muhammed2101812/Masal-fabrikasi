// lib/safety.ts

export interface SafetyFilters {
  preProcess: (prompt: string) => string;
  postCheck: (content: string) => { isSafe: boolean; sanitizedContent: string };
  sanitizeAndRegenerate: (content: string) => Promise<string>;
}

// Basit bir regex tabanlı filtreleme örneği
const bannedWords = ['şiddet', 'korku', 'korkutucu'];

export const preProcess = (prompt: string): string => {
  // Prompt yumuşatma işlemleri
  return prompt;
};

export const postCheck = (content: string): { isSafe: boolean; sanitizedContent: string } => {
  let isSafe = true;
  let sanitizedContent = content;
  
  for (const word of bannedWords) {
    if (content.toLowerCase().includes(word)) {
      isSafe = false;
      // Hassas kelimeyi sansürle
      sanitizedContent = sanitizedContent.replace(new RegExp(word, 'gi'), '*'.repeat(word.length));
    }
  }
  
  return { isSafe, sanitizedContent };
};

export const sanitizeAndRegenerate = async (content: string): Promise<string> => {
  // Yeniden üretim mantığı
  // Bu örnekte, sadece sansürlenmiş içeriğin döndürülmesi yeterli
  const { sanitizedContent } = postCheck(content);
  return sanitizedContent;
};