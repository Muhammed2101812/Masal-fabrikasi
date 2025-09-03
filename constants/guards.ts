// constants/guards.ts

// Yasaklı kelime listesi
export const BANNED_WORDS = [
  'şiddet',
  'korku',
  'korkutucu',
  'silah',
  'ölüm',
  'kan',
  'vurmak',
  'dövmek'
];

// Güvenli kelime listesi (AI'nin kullanması için izin verilen kelimeler)
export const SAFE_WORDS = [
  'dostluk',
  'aile',
  'macera',
  'hayal',
  'eğlence',
  'öğrenme'
];

// Kategori bazlı yasaklı kelimeler
export const CATEGORY_BANNED_WORDS: Record<string, string[]> = {
  fairyTale: ['korku', 'şeytan'],
  animal: ['av', 'ölüm'],
  space: ['savaş', 'patlama']
};