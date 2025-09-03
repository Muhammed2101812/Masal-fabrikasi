import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    const voiceId = "pNInz6obpgDQGcFmaJgB"; // Voice ID for "Rachel" (a good default)

    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error("ElevenLabs API key is not configured.");
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API Error: ${errorText}`);
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Stream the audio directly to the client
    return new NextResponse(response.body, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error: unknown) {
    console.error('TTS Route Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Ses üretimi sırasında bir hata oluştu.';
    let statusCode = 500;
    
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    if (errorMsg === "ElevenLabs API key is not configured.") {
      errorMessage = "ElevenLabs API anahtarı yapılandırılmamış. Lütfen .env.local dosyasında ELEVENLABS_API_KEY değişkenini ayarlayın.";
      statusCode = 500;
    } else if (errorMsg.includes('API request failed with status:')) {
      const statusMatch = errorMsg.match(/status: (\d+)/);
      const status = statusMatch ? statusMatch[1] : 'unknown';
      errorMessage = `ElevenLabs API hatası (HTTP ${status}). API anahtarınızı kontrol edin.`;
      statusCode = 500;
    } else if (errorMsg) {
      errorMessage = errorMsg;
    }
    
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: statusCode });
  }
}
