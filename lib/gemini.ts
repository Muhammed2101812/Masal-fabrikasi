// lib/gemini.ts

// Bu dosya, Gemini API'si ile etkileşim kurmak için bir istemci sağlar.
// Gerçek bir uygulamada, burada API anahtarlarını ve istekleri yöneten kodlar yer alır.

export interface GeminiClient {
  generateStory: (prompt: string) => Promise<string>;
  generateImage: (prompt: string) => Promise<string>; // Base64 string
}

// Mock bir uygulama, gerçek API çağrısı yapmaz
export const createGeminiClient = (apiKey: string): GeminiClient => {
  return {
    generateStory: async (prompt: string): Promise<string> => {
      // Gerçek uygulamada burada API çağrısı yapılır
      return `Bu, "${prompt}" istemi için oluşturulan örnek bir hikayedir.`;
    },
    
    generateImage: async (prompt: string): Promise<string> => {
      // Gerçek uygulamada burada API çağrısı yapılır
      // Base64 encoded SVG placeholder
      return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIHN0cm9rZT0iZ3JlZW4iIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ieWVsbG93IiAvPjwvc3ZnPg==`;
    }
  };
};

// Varsayılan istemci
let defaultClient: GeminiClient | null = null;

export const getGeminiClient = (): GeminiClient => {
  if (!defaultClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    defaultClient = createGeminiClient(apiKey);
  }
  return defaultClient;
};