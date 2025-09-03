<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Architecture.md

## Amaç ve Kapsam

Bu doküman, çocuklar ve ebeveynler için Türkçe, güvenli ve kişiselleştirilebilir hikaye üreten web uygulamasının teknik mimarisini tanımlar. Hedefler: düşük maliyet, sade altyapı, yüksek güvenlik ve yaşa uygun içerik üretimi. MVP, kalıcı veritabanı olmadan, anonim ve misafir kullanım akışıyla çalışır.

## Yüksek Seviye Mimari

- İstemci (Next.js App Router, React, TypeScript)
    - UI bileşenleri: ChatBox, OptionsBar, StoryView, TTSControls.
    - Durum yönetimi: Client-side state (React state/useReducer).
    - TTS: Web Speech API ile tarayıcı içi seslendirme.
- Sunucu (Next.js Route Handlers, Node runtime)
    - /api/generate: Prompt birleştirme, güvenlik yönergeleri, Gemini 2.5 Flash-Lite çağrısı.
    - /api/cover: Kategoriye göre placeholder kapak görseli üretimi.
- Dış Servisler
    - Gemini 2.5 Flash-Lite (metin üretimi).
    - Opsiyonel: statik CDN (Vercel) ve minimal log.
- Veri Katmanı
    - Kalıcı veritabanı yok; yalnızca istek-yanıt döngüsü ve istemci belleği.
    - Sunucu logları minimal ve anonim.


## Bileşen Diyagramı (Mantıksal)

- UI Katmanı
    - OptionsBar → yaş/kategori/uzunluk seçimleri.
    - ChatBox → kullanıcı girişi ve “Hikaye Oluştur”.
    - StoryView → başlık + kapak görseli + metin.
    - TTSControls → ses/hız seçimi, oynat/durdur.
- Orta Katman (Client helpers)
    - prompts.ts → sistem mesajı ve şablonlar.
    - safety.ts → anahtar kelime filtreleri ve yumuşatma.
    - tts.ts → voice listesi, hız ve okuma kuyruğu.
    - ageLengths.ts → yaşa göre kelime hedefleri.
- Sunucu Katmanı
    - generate/route.ts → prompt ön-işleme, güvenlik yönergeleri ekleme, model çağrısı, çıktı sonrası kontrol.
    - cover/route.ts → placeholder/ikonik SVG üretimi.
    - gemini.ts → model istemcisi/wrapper.
    - logger.ts → anonim, minimal log.
- Harici Bağımlılıklar
    - Gemini API anahtarı (ENV).
    - Vercel deploy (Hobby).


## Akışlar

1) Hikaye Üretimi

- Kullanıcı: yaş/kategori/uzunluk seçer, prompt yazar.
- İstemci: seçimler + kullanıcı prompt’unu POST /api/generate’a gönderir.
- Sunucu:
    - Sistem mesajı ve güvenlik yönergeleri ile prompt birleşimi.
    - Yaşa ve uzunluğa göre kelime aralığı/ton ayarı.
    - Model çağrısı (düşük token hedefi).
    - Üretim sonrası basit anahtar kelime kontrolü; gerekiyorsa yumuşatma ve yeniden üretim.
    - Başlık ve 3–6 paragraf halinde metin döner.
- İstemci: metni gösterir, paralelde GET /api/cover ile kapak görselini alır.

2) Kapak Görseli

- İstemci: kategori parametresiyle GET /api/cover.
- Sunucu: kategoriye göre renk/ikon temalı SVG üretir (veya statik placeholder).
- İstemci: görseli başlıkla birlikte render eder.

3) TTS Okuma

- İstemci: metni paragraflara böler; her paragrafı ayrı utterance olarak okuma kuyruğuna ekler.
- Kullanıcı: kadın/erkek seçimi ve hız ayarı (0.8, 1.0, 1.2); oynat/durdur/tekrar başlat.


## Güvenlik Mimarisi

- Model Öncesi
    - Sistem yönergesi: yaşa uygun dil, şiddet/nefret/cinsellik/korku/tehlikeli davranış yok.
    - Prompt bağlamı: yaş/kategori/uzunluk kuralları; net, pozitif, kültürel uyum.
- Model Sonrası
    - Anahtar kelime/ifade filtreleri (regex/listeler).
    - İhlal şüphesi: otomatik yumuşatma ve yeniden üretim; UI’da “daha uygun sürüm üretildi” bildirimi.
- İstek Kısıtlama
    - Aynı anda tek aktif üretim (UI seviyesinde).
    - Opsiyonel basit rate limit (edge/wrapper).
- Gizlilik
    - Hesap yok, PII toplamayı önleyici metin uyarıları.
    - Loglar anonim ve minimal; içerik metinleri loglanmaz.
- Tarayıcı Güvenliği
    - HTTPS (Vercel).
    - İçerik Güvenlik Politikası (CSP) önerisi; inline script minimum.


## Performans ve Maliyet

- Model: Flash-Lite ile düşük gecikme ve token bütçesi; hedef uzunluk +%20 pay.
- Rendering: Next.js App Router, statik varlıklar Vercel CDN.
- İstemci optimizasyonları: lazy render, düşük JS ayak izi, minimal durum.
- Sunucu: Route Handlers; kısa timeout, hızlı geri dönüş.
- Görsel: SVG placeholder (CPU hafif, network küçük).
- Analitik: başlangıçta kapalı; ileride privacy-first entegrasyon.


## Hata Yönetimi ve Dayanıklılık

- Model gecikmesi: Loader + tahmini süre, tek aktif üretim kilidi.
- Ağ hatası: tekrar dene butonu; kullanıcı metni local state’te saklı.
- TTS hatası: “Tarayıcı TTS desteklemiyor” uyarısı ve metin kopyalama alternatifi.
- Güvenlik reddi: yumuşatılmış sürüm üretimi ve kullanıcı bilgilendirmesi.


## Dağıtım ve Ortamlar

- Ortamlar: Development (local), Production (Vercel).
- ENV Yönetimi: .env.local → GEMINI_API_KEY, opsiyonel LOG_LEVEL.
- Build: Vercel otomatik; TypeScript strict, ESLint/Prettier kontrolü.
- Edge vs Node: Model SDK uyumluluğuna göre Node runtime tercih.


## Dizın Yapısı (Öneri)

- app/
    - layout.tsx, globals.css, page.tsx
    - api/
        - generate/route.ts
        - cover/route.ts
- components/
    - ChatBox.tsx
    - OptionsBar.tsx
    - StoryView.tsx
    - TTSControls.tsx
    - Loader.tsx
    - SafetyNotice.tsx
- lib/
    - prompts.ts
    - safety.ts
    - tts.ts
    - ageLengths.ts
    - gemini.ts
    - image.ts
    - logger.ts
- constants/
    - guards.ts
    - ui.ts
- content/
    - strings.tr.json
    - safety_messages.tr.json
- tests/
    - api/generate.test.ts
    - lib/safety.test.ts
    - e2e/story_flow.spec.ts
- config/
    - tailwind.config.ts
    - postcss.config.js
    - next.config.js
- scripts/
    - lint-and-typecheck.sh
    - check-env.ts


## API Tasarımı

- POST /api/generate
    - Body: { prompt: string, ageRange: '3-5'|'6-8'|'9-12', category: 'uyku'|'macera'|'egitici'|'masalsi', length: 'kısa'|'orta'|'uzun' }
    - İşlem: sistem mesajı + güvenlik kuralları + uzunluk hedefi → model → post-filter.
    - Response: { title: string, paragraphs: string[], wordCount: number, safety: { adjusted: boolean, notes?: string[] } }
- GET /api/cover
    - Query: ?category=uyku|macera|egitici|masalsi\&shape=square|wide
    - Response: image/svg+xml (veya data URL).


## Prompt Stratejisi (Mimari Yansımalar)

- Sistem mesajı: yaş/kategori/uzunluk kuralları, kültürel uyum, güvenlik yasakları.
- Kullanıcı bağlamı: karakter/tema/yer bilgisi; belirsizlikte pozitif varsayımlar.
- Uzunluk kontrolü: modelden kelime aralığına uygunluk; aşımda post-trim yapılmaz, yeniden üretim tercih edilir.
- Dil düzeyi: yaş aralıklarına göre sözcük ve cümle karmaşıklığı yönergesi.


## TTS Mimarisi

- Voice keşfi: window.speechSynthesis.getVoices() ile tr-TR etiketli seslerin bulunması.
- Seçim stratejisi: kullanıcı tercihi (kadın/erkek) + en yakın eşleşme, fallback.
- Okuma kuyruğu: her paragraf ayrı utterance; cümle sonu noktalama doğal duraklama.
- Kontroller: oynat/durdur/tekrar başlat; hız 0.8/1.0/1.2; hatalarda uyarı.


## Güvenlik Filtreleri (Örnek Yaklaşım)

- guards.ts: yasaklı/kısıtlı anahtar kelime listeleri (TR odaklı).
- safety.ts:
    - preProcess(prompt): kullanıcı girdisini normalize et, potansiyel riskleri azalt.
    - enforceSystemGuidelines(ctx): sistem mesajına güvenlik bloklarını enjekte et.
    - postCheck(text): ihlal şüphesi → sanitizeAndRegenerate().
- UI bildirimi: “İçerik daha uygun hale getirildi.”


## Test Stratejisi

- Birim: prompts.ts (yaş/uzunluk eşleşmesi), safety.ts (regex match), tts.ts (voice seçim mantığı).
- API: /api/generate happy-path ve ihlal/yumuşatma senaryoları.
- E2E: seçim → üretim → TTS oynatma akışı; ağ hatası ve yeniden deneme.


## Genişleme ve Esneklik

- Görsel jenerasyon: ileride ücretsiz API’den basit illüstrasyon; aynı endpoint genişletilebilir.
- Kişiselleştirme: isim/ilgi alanı parametreleri; güvenlik yönergeleri sabit tutulur.
- Çok dil: strings.*.json ve i18n katmanı; model yönergeleri dil bazlı şablonlanır.
- Veritabanı: istek üzerine sürümler/galeri için kalıcı depolamaya geçiş (ör. Planetscale, Neon, KV).


## Operasyonel Notlar

- Gözlemlenebilirlik: minimal metrik (istek sayısı, hata oranı, ort. yanıt süresi) — PII yok.
- Rate limit ve maliyet koruması: basit IP/oturum başına limit; model token bütçe kontrolü.
- Sürümleme: Changelog ve Feature flags (ör. premium TTS kapalı başlayacak).


## Riskler ve Önlemler

- Model uyumsuzluğu: flash-lite çıktılarında uzunluk/sadelik sapması → yeniden üretim ve stricter yönerge.
- Tarayıcı TTS farkları: farklı ses kalitesi/etiketleme → fallback stratejisi ve kullanıcıya bilgi.
- İçerik güvenliği: regex kaçakları → negatif örneklerle test seti ve sürekli güncelleme.
- Ücretsiz kotalar: sınır aşımı → geçici servis kapanma mesajı ve tekrar deneme.

***

Bu mimari, sıfıra yakın bütçeyle güvenli, hızlı ve bakım kolaylığı yüksek bir MVP’yi hedefler. Bir sonraki adım olarak Design.md ile etkileşim tasarımı, bileşen sözleşmeleri ve UI akış detaylarını netleştirebiliriz.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

