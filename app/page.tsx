"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { analytics } from '../lib/analytics';

// --- Type Definitions ---
interface Story {
  title: string;
  paragraphs: string[];
}

// --- Icon Components ---
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

// --- Main App Component ---
export default function App() {
  // --- State Management ---
  // API key is now handled server-side for security
    const [prompt, setPrompt] = useState('');
    
  // Story options
    const [ageRange, setAgeRange] = useState('6-8');
    const [category, setCategory] = useState('macera');
    const [length, setLength] = useState('orta');

  // Application state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [story, setStory] = useState<Story | null>(null);
    const [imageUrl, setImageUrl] = useState('');


    // TTS state
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetchingAudio, setIsFetchingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [ttsAvailable, setTtsAvailable] = useState(true);

    // Analytics - page view
    useEffect(() => {
        analytics.track('page_view');
    }, []);

  // --- TTS Functions ---
  const handlePlayPause = async () => {
    // 1. If audio is currently playing, pause it.
    if (isPlaying && audio) {
      audio.pause();
      return;
    }

    // 2. If audio is paused, resume playing.
    if (!isPlaying && audio) {
      audio.play();
      return;
    }

    // 3. If audio URL is already fetched, create a new audio element and play.
    if (audioUrl) {
      const newAudio = new Audio(audioUrl);
      newAudio.playbackRate = speechRate;
      setAudio(newAudio);
      newAudio.onplay = () => setIsPlaying(true);
      newAudio.onpause = () => setIsPlaying(false);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play();
      return;
    }
    
    // 4. If this is the first play, fetch the audio from the API.
    if (story) {
      setIsFetchingAudio(true);
      setError(null);
      try {
        const fullText = [story.title, ...story.paragraphs].join('\n');
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: fullText }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }));
          throw new Error(`TTS API Hatası: ${errorData.error || `HTTP ${response.status}`}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const newAudio = new Audio(url);
        newAudio.playbackRate = speechRate;
        setAudio(newAudio);
        
        newAudio.onplay = () => setIsPlaying(true);
        newAudio.onpause = () => setIsPlaying(false);
        newAudio.onended = () => setIsPlaying(false);
        
        newAudio.play();

                analytics.track('tts_played', { 
          storyLength: fullText.length
        });

            } catch (err: unknown) {
        console.error('TTS Error:', err);
        const errorMessage = (err instanceof Error ? err.message : "Seslendirme sırasında bir hata oluştu.");
        
        // Check if it's an API key configuration error
        if (errorMessage.includes('API anahtarı yapılandırılmamış') || errorMessage.includes('API anahtarınızı kontrol edin')) {
          setTtsAvailable(false);
          setError("Seslendirme özelliği şu anda kullanılamıyor. Hikayeyi okuyarak devam edebilirsiniz.");
        } else {
          setError(errorMessage);
        }
        
        setIsPlaying(false);
      } finally {
        setIsFetchingAudio(false);
      }
        }
    };
    
    const stopSpeaking = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setSpeechRate(rate);
    if (audio) {
      audio.playbackRate = rate;
    }
  };

  // --- API Functions ---


    async function generateStoryViaAPI(userPrompt: string, currentAge: string, currentCategory: string, currentLength: string) {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userPrompt,
                ageRange: currentAge,
                category: currentCategory,
                length: currentLength,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.story;
    }

    async function generateImage(userPrompt: string, currentCategory: string) {
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    category: currentCategory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen hata' }));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.warn("AI görsel oluşturulamadı, yer tutucu kullanılıyor:", error);
            return generatePlaceholderImage(currentCategory);
        }
    }

          function generatePlaceholderImage(category: string) {
    const themes: Record<string, { bg: string; icon: string }> = {
      'macera': { bg: '#60a5fa', icon: '⛰️' },
      'uyku öncesi': { bg: '#818cf8', icon: '🌙' },
      'eğitici': { bg: '#34d399', icon: '📚' },
      'masalsı': { bg: '#f472b6', icon: '✨' },
    };
    const theme = themes[category] || { bg: '#94a3b8', icon: '📖' };
    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${theme.bg}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="200" fill="white" text-anchor="middle" dy=".3em">${theme.icon}</text>
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="50" fill="white" text-anchor="middle" dy=".3em" style="text-transform:capitalize;">${category}</text>
      </svg>
    `;
    // Use encodeURIComponent instead of btoa to handle Unicode characters
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  // --- Helper Functions ---
    const handleCopy = () => {
        if (story) {
            const fullText = [story.title, ...story.paragraphs].join('\n\n');
            navigator.clipboard.writeText(fullText).then(() => {
                analytics.track('story_copied', { 
                    storyLength: fullText.length
                });
            }, () => {
                console.error('Failed to copy text');
            });
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Lütfen bir hikaye fikri yazın.');
            return;
        }
        
        stopSpeaking();
        setLoading(true);
        setError(null);
        setStory(null);
        setImageUrl('');


    // Reset previous audio state
    if (audio) {
      audio.pause();
    }
    setAudio(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setIsFetchingAudio(false);

        try {
            const storyText = await generateStoryViaAPI(prompt, ageRange, category, length);
            const parts = storyText.split('\n\n').filter((p: string) => p.trim() !== '');
            const title = parts[0] || "Başlıksız Hikaye";
            const paragraphs = parts.slice(1);
            setStory({ title, paragraphs });
            
            analytics.track('story_generated', { 
                ageRange, 
                category, 
                length,
                storyLength: storyText.length
            });

            try {
                const generatedImageUrl = await generateImage(prompt, category);
                setImageUrl(generatedImageUrl);
            } catch (imageError) {
                console.warn("AI görsel oluşturulamadı, yer tutucu kullanılıyor:", imageError);
                const placeholderUrl = generatePlaceholderImage(category);
                setImageUrl(placeholderUrl);
            }

        } catch (err: unknown) {
      setError((err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu"));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

  // --- Render ---
    return (
    <div className="bg-[#F0F8FF] min-h-screen">
      <main className="flex-1">
        {!story && !loading ? (
          // Creation View
          <>
            <section className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 px-4 sm:px-6 lg:px-8" style={{backgroundImage: "url('https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=2874&auto=format&fit=crop')"}}>
              <div className="absolute inset-0 bg-sky-300/30"></div>
              <div className="relative z-10 flex flex-col items-center gap-6 text-center text-white">
                <h1 className="font-chewy text-6xl md:text-8xl font-bold" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>Masal Fabrikası</h1>
                <p className="text-xl md:text-2xl max-w-2xl" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.6)'}}>
                  Yapay zeka destekli, çocuğunuzun hayal gücünü geliştiren, Türkçe, güvenli ve yaşa uygun hikayeler.
                </p>
              </div>
            </section>
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8" id="create-story">
              <div className="mx-auto max-w-4xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                  <h2 className="text-center font-chewy text-4xl md:text-5xl font-bold text-gray-800 mb-10">Harika Bir Hikaye Yaratalım!</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                      <label className="flex flex-col items-center text-center gap-2 text-lg font-semibold text-gray-800" htmlFor="age-range">
                        <span className="material-symbols-outlined text-5xl text-[var(--primary-color)]">child_care</span>
                        Yaş Aralığı
                      </label>
                      <select 
                        className="mt-2 form-select w-full rounded-lg border-2 border-gray-300 bg-white h-14 text-center text-lg text-gray-800 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] transition" 
                        id="age-range" 
                        name="age"
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                      >
                        <option value="3-5">3-5 Yaş</option>
                        <option value="6-8">6-8 Yaş</option>
                        <option value="9-12">9-12 Yaş</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex flex-col items-center text-center gap-2 text-lg font-semibold text-gray-800" htmlFor="category">
                        <span className="material-symbols-outlined text-5xl text-[var(--secondary-color)]">auto_stories</span>
                        Kategori
                      </label>
                      <select 
                        className="mt-2 form-select w-full rounded-lg border-2 border-gray-300 bg-white h-14 text-center text-lg text-gray-800 focus:border-[var(--secondary-color)] focus:ring-[var(--secondary-color)] transition" 
                        id="category" 
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="uyku öncesi">Uyku Öncesi</option>
                        <option value="macera">Macera</option>
                        <option value="eğitici">Eğitici</option>
                        <option value="masalsı">Masalsı</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex flex-col items-center text-center gap-2 text-lg font-semibold text-gray-800" htmlFor="length">
                        <span className="material-symbols-outlined text-5xl text-[var(--accent-color)]">straighten</span>
                        Uzunluk
                      </label>
                      <select 
                        className="mt-2 form-select w-full rounded-lg border-2 border-gray-300 bg-white h-14 text-center text-lg text-gray-800 focus:border-[var(--accent-color)] focus:ring-[var(--accent-color)] transition" 
                        id="length" 
                        name="length"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      >
                        <option value="kısa">Kısa</option>
                        <option value="orta">Orta</option>
                        <option value="uzun">Uzun</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="text-lg font-semibold text-gray-800 block mb-2 text-center" htmlFor="idea">Fikir Giriş Alanı</label>
                    <div className="relative">
                        <textarea
                        className="form-textarea w-full rounded-lg border-2 border-gray-300 bg-white min-h-36 p-4 text-lg text-gray-800 placeholder:text-gray-500 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] transition" 
                        id="idea" 
                        placeholder="Aklındaki harika hikaye ne hakkında olsun? Mesela: Uzayda kaybolan bir kedi..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                      />
                      <div className="absolute bottom-3 right-3 opacity-50">
                        <span className="material-symbols-outlined text-4xl text-gray-400 animate-pulse">edit_note</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                        <button
                            onClick={handleGenerate}
                      className="flex items-center justify-center gap-3 min-w-[200px] max-w-xs mx-auto cursor-pointer rounded-full h-16 px-8 bg-gradient-to-r from-[var(--accent-color)] to-[var(--secondary-color)] text-white text-2xl font-bold tracking-wider shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                      <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                      <span className="truncate">Hayal Et!</span>
                        </button>
                    </div>
                        </div>
                                    </div>
            </section>
          </>
        ) : story && !loading ? (
          // Reading View
          <div className="px-4 sm:px-8 lg:px-40 flex flex-1 justify-center py-12">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {/* Cover Image */}
              <div className="w-full aspect-square bg-center bg-no-repeat bg-contain flex flex-col justify-end overflow-hidden rounded-2xl mb-8" style={{backgroundImage: `url(${imageUrl})`}}></div>
              
              {/* Story Title - Clearly Separated */}
              <div className="text-center mb-8">
                <h1 className="text-gray-900 tracking-tight text-4xl sm:text-5xl font-bold leading-tight px-4">
                  {story.title}
                </h1>
              </div>
              
              {/* TTS Controls */}
              {ttsAvailable && (
                <div className="px-4 mb-8">
                  <div className="flex items-center gap-6 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                  <button 
                    onClick={handlePlayPause} 
                    className="flex shrink-0 items-center justify-center rounded-full size-16 bg-[#13a4ec] text-white"
                    disabled={isFetchingAudio}
                  >
                    {isFetchingAudio ? (
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-8">
                    <button 
                      onClick={() => handleSpeedChange(0.8)}
                      className={`flex flex-col items-center gap-2 transition-colors ${speechRate === 0.8 ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <div className={`w-6 h-6 bg-center bg-no-repeat ${speechRate === 0.8 ? 'icon-turtle active' : 'icon-turtle'}`}></div>
                      <span className="text-xs font-medium">Yavaş</span>
                    </button>
                    <button 
                      onClick={() => handleSpeedChange(1.0)}
                      className={`flex flex-col items-center gap-2 transition-colors ${speechRate === 1.0 ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <div className={`w-6 h-6 bg-center bg-no-repeat ${speechRate === 1.0 ? 'icon-rabbit active' : 'icon-rabbit'}`}></div>
                      <span className="text-xs font-medium">Normal</span>
                    </button>
                    <button 
                      onClick={() => handleSpeedChange(1.2)}
                      className={`flex flex-col items-center gap-2 transition-colors ${speechRate === 1.2 ? 'text-gray-800' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <div className={`w-6 h-6 bg-center bg-no-repeat ${speechRate === 1.2 ? 'icon-cheetah active' : 'icon-cheetah'}`}></div>
                      <span className="text-xs font-medium">Hızlı</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex shrink-0 items-center justify-center rounded-full size-12 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <CopyIcon />
                    </button>
                    <button 
                      onClick={handleGenerate}
                      className="flex shrink-0 items-center justify-center rounded-full size-12 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <RefreshIcon />
                    </button>
                  </div>
                </div>
                </div>
              )}
              
              {/* Story Content - Clearly Separated */}
              <div className="px-4">
                <div className="text-gray-700 text-lg font-normal leading-relaxed" style={{lineHeight: '2.2rem'}}>
                  {story.paragraphs.map((paragraph, index) => (
                    <p key={index} className="mb-6 last:mb-0">
                      {paragraph.split('<br>').map((line, lineIndex, array) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex < array.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Loading View - Centered and Beautiful
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center space-y-8 max-w-md mx-auto">
              {/* Logo with Animation */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-white rounded-full p-6 shadow-xl">
                  <Image 
                    src="/logo.svg" 
                    alt="Masal Fabrikası" 
                    width={80} 
                    height={80}
                    className="animate-bounce"
                  />
                </div>
              </div>
              
              {/* Loading Animation */}
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">Masal Fabrikası Çalışıyor</h3>
                  <p className="text-gray-600">Harika bir hikaye ve resim hazırlanıyor...</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4" role="alert">
            <strong className="font-bold">Bir Hata Oluştu! </strong>
            <span>{error}</span>
          </div>
        )}
      </main>
        </div>
    );
}