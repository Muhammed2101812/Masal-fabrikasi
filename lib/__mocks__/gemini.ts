// lib/__mocks__/gemini.ts

export const getGeminiClient = jest.fn(() => ({
  getGenerativeModel: jest.fn(() => ({
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () => 'Mocked story text',
      },
    }),
  })),
}));
