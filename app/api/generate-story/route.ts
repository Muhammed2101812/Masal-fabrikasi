import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, ageRange, category, length } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured.");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const storyPrompt = `Sen çocuklar için hikaye yazan bir yazarsın. ${ageRange} yaş aralığındaki çocuklar için ${category} temalı, ${length} uzunlukta bir hikaye yaz. Hikaye fikri: ${prompt}

Hikayeyi şu formatta yaz:
- İlk paragraf başlık olacak
- Her paragraf arasında boş satır bırak
- Çocuklar için uygun, eğitici ve eğlenceli olsun
- Türkçe yaz`;

    const payload = {
      contents: [{ parts: [{ text: storyPrompt }] }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error: ${errorText}`);
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      return NextResponse.json({ 
        story: result.candidates[0].content.parts[0].text 
      });
    }
    
    throw new Error('API yanıtından geçerli bir hikaye metni alınamadı.');

  } catch (error: any) {
    console.error('Story Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Hikaye oluşturulurken bir hata oluştu.' }, 
      { status: 500 }
    );
  }
}
