// lib/tts.ts

// Bu dosya, tarayıcı tabanlı Web Speech API'yi kullanarak metin okuma işlevselliği sağlar.

export interface TTSOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class TTSManager {
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  
  public speak(text: string, options: TTSOptions = {}): void {
    // Her zaman önceki konuşmayı durdur
    this.stop();
    
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Varsayılan ayarlar
    this.utterance.rate = options.rate || 1;
    this.utterance.pitch = options.pitch || 1;
    this.utterance.volume = options.volume || 1;
    
    if (options.voice) {
      this.utterance.voice = options.voice;
    }
    
    this.utterance.onstart = () => {
      this.isSpeaking = true;
    };
    
    this.utterance.onend = () => {
      this.isSpeaking = false;
    };
    
    this.utterance.onerror = () => {
      this.isSpeaking = false;
    };
    
    speechSynthesis.speak(this.utterance);
  }
  
  public stop(): void {
    speechSynthesis.cancel();
    this.isSpeaking = false;
  }
  
  public pause(): void {
    speechSynthesis.pause();
    // Not: paused durumu speechSynthesis nesnesinden kontrol edilir
  }
  
  public resume(): void {
    speechSynthesis.resume();
    // Not: paused durumu speechSynthesis nesnesinden kontrol edilir
  }
  
  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }
  
  public getVoices(): SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices();
  }
}

// Singleton instance
export const ttsManager = new TTSManager();