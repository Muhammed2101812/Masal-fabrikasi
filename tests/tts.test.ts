/**
 * @jest-environment jsdom
 */

// tests/tts.test.ts

import { TTSManager } from '../lib/tts';

// Mock SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  text: string;
  onend = () => {};
  onstart = () => {};
  onerror = () => {};

  constructor(text: string) {
    this.text = text;
  }
}

global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance as any;

// Mock window.speechSynthesis
const mockSpeechSynthesis = {
  speak: jest.fn((utterance) => {
    // Call onstart callback
    if (utterance.onstart) {
      utterance.onstart();
    }
    // In a real scenario, onend would be called when speech finishes.
    // We call it manually here to simulate the end of speech.
    if (utterance.onend) {
      utterance.onend();
    }
  }),
  cancel: jest.fn(() => {
    mockSpeechSynthesis.speaking = false;
  }),
  pause: jest.fn(() => {
    mockSpeechSynthesis.paused = true;
  }),
  resume: jest.fn(() => {
    mockSpeechSynthesis.paused = false;
  }),
  getVoices: jest.fn(() => [{ lang: 'tr-TR', name: 'Yelda' }]),
  speaking: false,
  paused: false,
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

describe('TTSManager', () => {
  let ttsManager: TTSManager;

  beforeEach(() => {
    jest.clearAllMocks();
    ttsManager = new TTSManager();
    mockSpeechSynthesis.speaking = false;
    mockSpeechSynthesis.paused = false;
  });

  it('should speak a text', () => {
    ttsManager.speak('Merhaba');
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledWith(expect.any(MockSpeechSynthesisUtterance));
    expect(mockSpeechSynthesis.speak.mock.calls[0][0].text).toBe('Merhaba');
  });

  it('should cancel previous speech before starting a new one', () => {
    ttsManager.speak('Merhaba'); // Start speaking
    ttsManager.speak('Dünya'); // Speak again
    // speak() method always calls stop() first, so cancel is called twice
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(2);
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
  });

  it('should stop speech', () => {
    ttsManager.speak('Merhaba');
    ttsManager.stop();
    // speak() calls stop() first, then stop() is called again
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(2);
  });

  it('should pause speech', () => {
    ttsManager.speak('Merhaba');
    ttsManager.pause();
    expect(mockSpeechSynthesis.pause).toHaveBeenCalledTimes(1);
  });

  it('should resume speech', () => {
    ttsManager.speak('Merhaba');
    ttsManager.pause();
    ttsManager.resume();
    expect(mockSpeechSynthesis.resume).toHaveBeenCalledTimes(1);
  });

  it('should get available voices', () => {
    const voices = ttsManager.getVoices();
    expect(mockSpeechSynthesis.getVoices).toHaveBeenCalledTimes(1);
    expect(voices).toEqual([{ lang: 'tr-TR', name: 'Yelda' }]);
  });
});