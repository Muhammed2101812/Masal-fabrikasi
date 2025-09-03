"use client"; // Bu satır, bileşenin tarayıcıda çalışmasını sağlar.

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { analytics } from '../lib/analytics';

// --- Type Definitions ---
interface Story {
  title: string;
  paragraphs: string[];
}

// --- Ikon Bileşenleri (SVG) ---
// Projeyi tek dosyada tutmak için ikonları doğrudan burada tanımlıyoruz.
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);


// --- Ana Uygulama Bileşeni ---
export default function App() {
    // --- STATE YÖNETİMİ ---
    // API ve kullanıcı girdileri için state'ler
    const [apiKey] = useState("AIzaSyA3ztKpnlSLtzf5jFUocZNCTCv4zpkYuDg"); // Örnek anahtar, kendi anahtarınızla değiştirin.
    const [prompt, setPrompt] = useState('');
    
    // Hikaye seçenekleri için state'ler (plan.md'den)
    const [ageRange, setAgeRange] = useState('6-8');
    const [category, setCategory] = useState('macera');
    const [length, setLength] = useState('orta');

    // Uygulama durumu için state'ler
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [story, setStory] = useState<Story | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    // Metin Okuma (TTS) için state'ler
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supportedTTS, setSupportedTTS] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
    const [speechRate, setSpeechRate] = useState(1.0);

    // --- METİN OKUMA (TTS) FONKSİYONLARI ---
    const populateVoiceList = useCallback(() => {
        if (typeof speechSynthesis === 'undefined') {
            setSupportedTTS(false);
            return;
        }
        const availableVoices = speechSynthesis.getVoices();
        const trVoices = availableVoices.filter(voice => voice.lang === 'tr-TR');
        setVoices(trVoices);
        if (trVoices.length > 0) {
            setSelectedVoice(trVoices[0].name);
        }
        setSupportedTTS(true);
    }, []);

    useEffect(() => {
        populateVoiceList();
        if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }
    }, [populateVoiceList]);

    // Analytics - page view
    useEffect(() => {
        analytics.track('page_view');
    }, []);

    const handlePlayPause = () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            if (story && story.title && story.paragraphs) {
                speechSynthesis.cancel(); 
                const textToSpeak = [story.title, ...story.paragraphs].join('\n');
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                const voice = voices.find(v => v.name === selectedVoice);
                if (voice) {
                    utterance.voice = voice;
                }
                utterance.rate = speechRate;
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = () => {
                    setError("Seslendirme sırasında bir hata oluştu.");
                    setIsSpeaking(false);
                };
                speechSynthesis.speak(utterance);
                setIsSpeaking(true);
                
                // Analytics - TTS played
                analytics.track('tts_played', { 
                    storyLength: textToSpeak.length,
                    speechRate
                });
            }
        }
    };
    
    const stopSpeaking = () => {
        if (typeof speechSynthesis !== 'undefined') {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // --- API FONKSİYONLARI ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function fetchWithBackoff(url: string, payload: any, maxRetries = 3) {
        let delay = 1000;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    if (response.status === 429) { // Rate limit
                        await new Promise(resolve => setTimeout(resolve, delay));
                        delay *= 2;
                        continue;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data;
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }

    async function generateStory(userPrompt: string, currentAge: string, currentCategory: string, currentLength: string) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const systemPrompt = `Türk kültürüne uygun, ${currentAge} yaş için güvenli bir ${currentCategory} hikayesi yaz. Şiddet, nefret, cinsellik, korku ve tehlikeli davranışlar kesinlikle yok. Yaşa uygun sözcükler ve net cümleler kullan. Bir başlık ver. ${currentLength} uzunlukta, 3-6 paragraf üret. Sadece başlık ve hikaye metnini döndür, başka bir şey yazma. Başlık ile hikaye arasına iki alt satır koy. Kullanıcının isteği: "${userPrompt}"`;
        const payload = { contents: [{ role: "user", parts: [{ text: systemPrompt }] }] };
        const result = await fetchWithBackoff(apiUrl, payload);

        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        }
        throw new Error('API yanıtından geçerli bir hikaye metni alınamadı.');
    }

    async function generateImage(userPrompt: string, currentCategory: string) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;
        const imagePrompt = `Çocuk kitabı için çizilmiş, ${currentCategory} temalı, renkli, sevimli ve fantastik bir illüstrasyon: ${userPrompt}`;
        const payload = {
            contents: [{ parts: [{ text: imagePrompt }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        };

        const result = await fetchWithBackoff(apiUrl, payload);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const base64Data = result?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
        if (base64Data) {
            return `data:image/png;base64,${base64Data}`;
        }
        throw new Error('API yanıtından geçerli bir görsel verisi alınamadı.');
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
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    // --- YARDIMCI FONKSİYONLAR ---
    const handleCopy = () => {
        if (story) {
            const fullText = [story.title, ...story.paragraphs].join('\n\n');
            navigator.clipboard.writeText(fullText).then(() => {
                setCopySuccess('Kopyalandı!');
                setTimeout(() => setCopySuccess(''), 2000);
                
                // Analytics - story copied
                analytics.track('story_copied', { 
                    storyLength: fullText.length
                });
            }, () => {
                setCopySuccess('Hata!');
                setTimeout(() => setCopySuccess(''), 2000);
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
        setCopySuccess('');

        try {
            const storyText = await generateStory(prompt, ageRange, category, length);
            const parts = storyText.split('\n\n').filter((p: string) => p.trim() !== '');
            const title = parts[0] || "Başlıksız Hikaye";
            const paragraphs = parts.slice(1);
            setStory({ title, paragraphs });
            
            // Analytics - story generated
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Bilinmeyen bir hata oluÅtu");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER (ARAYÜZ) ---
    return (
        <div className="bg-slate-100 min-h-screen font-sans p-4 flex justify-center items-start" role="main" aria-label="Hikaye üretici uygulaması">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:text-slate-900 focus:z-50">
                Ana içeriğe geç
            </a>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-3xl" id="main-content">
                <header className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Hayal Et ve Oku</h1>
                    <p className="text-slate-600 mt-2">Türkçe, güvenli ve yaşa uygun hikayeler</p>
                </header>

                <main>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <OptionSelect label="Yaş Aralığı" options={[{value: '3-5', label: '3-5'}, {value: '6-8', label: '6-8'}, {value: '9-12', label: '9-12'}]} selected={ageRange} setSelected={setAgeRange} />
                        <OptionSelect label="Kategori" options={[{value: 'uyku öncesi', label: 'Uyku Öncesi'}, {value: 'macera', label: 'Macera'}, {value: 'eğitici', label: 'Eğitici'}, {value: 'masalsı', label: 'Masalsı'}]} selected={category} setSelected={setCategory} />
                        <OptionSelect label="Uzunluk" options={[{value: 'kısa', label: 'Kısa'}, {value: 'orta', label: 'Orta'}, {value: 'uzun', label: 'Uzun'}]} selected={length} setSelected={setLength} />
                    </div>

                    <div className="space-y-4 mb-8">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-24 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none text-slate-900 placeholder:text-slate-400"
                            placeholder="Örnek: Ormanda kaybolan meraklı bir tilki..."
                            disabled={loading}
                        />
                        <button
                            onClick={handleGenerate}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                            disabled={loading}
                            aria-label="Hikaye oluştur"
                            aria-live="polite"
                        >
                            {loading ? 'Hikaye Oluşturuluyor...' : 'Hikaye Oluştur'}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Bir Hata Oluştu! </strong>
                            <span>{error}</span>
                        </div>
                    )}

                    {loading && <Loader />}
                    
                    {story && !loading && (
                        <div className="mt-8 space-y-6 fade-in">
                            <div className="space-y-4">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">{story.title}</h1>
                                {imageUrl && (
                                    <div className="relative w-full h-auto max-h-[500px] rounded-xl shadow-lg border-4 border-white">
                                        <Image 
                                            src={imageUrl} 
                                            alt="Hikaye için oluşturulan görsel" 
                                            width={1200} 
                                            height={630} 
                                            className="w-full h-auto max-h-[500px] object-cover rounded-xl" 
                                            unoptimized={true}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjwvc3ZnPg=="
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {supportedTTS && (
                                <div className="bg-slate-50 p-4 rounded-lg flex flex-wrap items-center justify-center gap-4 sticky top-2 z-10 shadow-sm">
                                    <button 
                                        onClick={handlePlayPause} 
                                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                        aria-label={isSpeaking ? "Sesli okumayı durdur" : "Hikayeyi sesli oku"}
                                    >
                                        {isSpeaking ? <PauseIcon /> : <PlayIcon />}
                                        <span>{isSpeaking ? 'Durdur' : 'Sesli Oku'}</span>
                                    </button>
                                    <select value={selectedVoice || ''} onChange={(e) => setSelectedVoice(e.target.value)} className="p-2 border rounded-lg bg-white text-slate-900">
                                        {voices.map(voice => <option key={voice.name} value={voice.name}>{voice.name}</option>)}
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <span>Hız:</span>
                                        <button 
                                            onClick={() => setSpeechRate(0.8)} 
                                            className={`px-3 py-1 rounded-md ${speechRate === 0.8 ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}
                                            aria-label="Yavaş konuşma hızı"
                                            aria-pressed={speechRate === 0.8}
                                        >
                                            Yavaş
                                        </button>
                                        <button 
                                            onClick={() => setSpeechRate(1.0)} 
                                            className={`px-3 py-1 rounded-md ${speechRate === 1.0 ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}
                                            aria-label="Normal konuşma hızı"
                                            aria-pressed={speechRate === 1.0}
                                        >
                                            Normal
                                        </button>
                                        <button 
                                            onClick={() => setSpeechRate(1.2)} 
                                            className={`px-3 py-1 rounded-md ${speechRate === 1.2 ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}
                                            aria-label="Hızlı konuşma hızı"
                                            aria-pressed={speechRate === 1.2}
                                        >
                                            Hızlı
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 p-6 rounded-lg">
                                <div className="text-slate-700 text-lg leading-relaxed space-y-4">
                                    {story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button onClick={handleCopy} className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-lg hover:bg-slate-300 transition">
                                    <CopyIcon /> {copySuccess || 'Metni Kopyala'}
                                </button>
                                <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 bg-slate-200 px-4 py-2 rounded-lg hover:bg-slate-300 transition">
                                    <RefreshIcon /> Tekrar Üret
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// --- Alt Bileşenler ---

function OptionSelect({ label, options, selected, setSelected }: { label: string; options: Array<{ value: string; label: string }>; selected: string; setSelected: (value: string) => void }) {
    return (
        <div>
            <label htmlFor={label} className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
            <select
                id={label}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow capitalize bg-white text-slate-900"
                aria-label={`${label} seçimi`}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value} className="capitalize">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Loader() {
    return (
        <div className="text-center my-8">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-500 mt-4">Harika bir hikaye ve resim hazırlanıyor...</p>
        </div>
    );
}
