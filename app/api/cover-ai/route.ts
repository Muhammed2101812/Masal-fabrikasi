// app/api/cover-ai/route.ts

import { NextRequest } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { category, story } = await request.json();
    
    // Validate input
    if (!category || !story) {
      return new Response(
        JSON.stringify({ error: 'Kategori ve hikaye gereklidir.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get AI client
    const geminiClient = getGeminiClient();
    
    // Create a prompt for image generation
    const imagePrompt = `Lütfen ${category} kategorisine uygun, aşağıdaki hikaye için bir kapak görseli oluştur: "${story.substring(0, 100)}..."`;
    
    // Generate image
    const base64Image = await geminiClient.generateImage(imagePrompt);
    
    return new Response(
      JSON.stringify({ coverImage: base64Image }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to SVG placeholder
    const fallbackSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#9CA3AF"/>
      <circle cx="100" cy="100" r="50" fill="#D1D5DB"/>
      <text x="100" y="105" text-anchor="middle" fill="#4B5563" font-family="Arial" font-size="16">AI</text>
    </svg>`;
    
    const base64Fallback = Buffer.from(fallbackSvg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64Fallback}`;
    
    return new Response(
      JSON.stringify({ coverImage: dataUrl, fallback: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}