// app/api/generate/route.ts

import { NextRequest } from 'next/server';
import { generateSystemPrompt, generateUserPrompt } from '@/lib/prompts';
import { getGeminiClient } from '@/lib/gemini';
import { postCheck, sanitizeAndRegenerate } from '@/lib/safety';
import { defaultRateLimiter } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Apply rate limiting
    const rateLimitResult = defaultRateLimiter(ip);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.',
          resetTime: rateLimitResult.resetTime
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          } 
        }
      );
    }
    
    const { ageGroup, category, length } = await request.json();
    
    // Validate input
    if (!ageGroup || !category || !length) {
      return new Response(
        JSON.stringify({ error: 'Yaş grubu, kategori ve uzunluk gereklidir.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Generate prompts
    const systemPrompt = generateSystemPrompt({ ageGroup, category, length });
    const userPrompt = generateUserPrompt({ ageGroup, category, length });
    
    // Get AI client
    const geminiClient = getGeminiClient();
    
    // Generate story
    const rawStory = await geminiClient.generateStory(`${systemPrompt}
${userPrompt}`);
    
    // Safety check
    const { isSafe } = postCheck(rawStory);
    
    let finalStory = rawStory;
    if (!isSafe) {
      finalStory = await sanitizeAndRegenerate(rawStory);
    }
    
    return new Response(
      JSON.stringify({ story: finalStory }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Hikaye üretimi sırasında bir hata oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}