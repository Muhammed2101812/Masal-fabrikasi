import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, category } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured.");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

    // Updated prompt structure for better results (from working example)
    const imagePrompt = `Çocuk kitabı için çizilmiş, renkli, sevimli ve fantastik bir illüstrasyon: ${prompt}`;

    const payload = {
      contents: [{
        parts: [{ text: imagePrompt }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    };

    // Retry mechanism for API overload
    let response;
    let retries = 3;
    let delay = 1000; // Start with 1 second delay

    while (retries > 0) {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        break; // Success, exit retry loop
      }

      if (response.status === 503) {
        // API overload - wait and retry
        retries--;
        if (retries > 0) {
          console.log(`API overload (503), retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
      }

      // For other errors, don't retry
      const errorText = await response.text();
      console.error(`Gemini API Error: ${errorText}`);
      throw new Error(`API request failed with status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(`API request failed after retries with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Debug: Log the response structure
    console.log('Gemini API Response:', JSON.stringify(result, null, 2));

    // Parse response using the same format as the working example
    const base64Data = result?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
    
    // Debug: Log if no data found
    if (!base64Data) {
      console.log('No base64 data found in response, checking structure...');
      console.log('Full response structure:', JSON.stringify(result, null, 2));
    }
    
    if (base64Data) {
      return NextResponse.json({ 
        imageUrl: `data:image/png;base64,${base64Data}` 
      });
    }
    
    throw new Error('API yanıtından geçerli bir görsel verisi alınamadı.');

  } catch (error: any) {
    console.error('Image Generation Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Görsel oluşturulurken bir hata oluştu.';
    let statusCode = 500;
    
    if (error.message.includes('503')) {
      errorMessage = 'Görsel oluşturma servisi şu anda yoğun. Lütfen daha sonra tekrar deneyin.';
      statusCode = 503;
    } else if (error.message.includes('API key is not configured')) {
      errorMessage = 'Görsel oluşturma API anahtarı yapılandırılmamış.';
      statusCode = 500;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: statusCode }
    );
  }
}
