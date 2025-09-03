<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# cursor-rules.md

Bu dosya, projeyi Cursor ile geliştirirken tutarlı, güvenli, performanslı ve kolay bakım yapılabilir bir çalışma biçimi sağlamayı amaçlar. Tüm kurallar Türkçe hazırlanmıştır ve Cursor’dan gelen/üretilen her içerik varsayılan olarak Türkçe olmalıdır.

## Genel İlke ve Hedefler

- Her zaman Türkçe yanıt ver.
- MVP odağı: Basit, güvenli, hızlı ve düşük maliyetli.
- Çocuk güvenliği ve içerik uygunluğu birincil önceliktir.
- Değiştirilebilir ve modüler mimari: bileşen, lib ve API katmanları net ayrışır.
- Gizlilik-öncelikli: Kalıcı veri yok; PII isteme/işleme yok.
- Kod kalitesi: TypeScript strict, ESLint/Prettier, küçük ve anlaşılır PR’lar.


## Proje Standartları

- Dil: TypeScript (strict), React 18, Next.js App Router.
- Stil: TailwindCSS; tasarım token’larını constants/ui.ts’de topla.
- Dosya/klasör isimleri: kebab-case, TS tipleri PascalCase.
- Yerleşim:
    - app/: sayfalar, layout, API route’ları.
    - components/: saf UI bileşenleri (sunucusuz mantık).
    - lib/: iş kuralları ve yardımcılar (prompts, safety, tts, gemini wrapper).
    - constants/: sabitler (ui, guards).
    - content/: UI metinleri (strings.tr.json).
    - tests/: unit, integration, e2e.
    - scripts/: lint, typecheck, check-env.


## Kod Yazım Kuralları

- Tür güvenliği:
    - Dış sınırlar (API body/query) Zod veya tip güvenli kontrol ile doğrulanır.
    - any kaçınılır; bilinçli kullanımda açıklama yorumu eklenir.
- Hatalar:
    - Kullanıcıya sızmayan kısa mesajlar; log’da teknik detay (PII yok).
    - Try/catch ile kontrollü hata yüzeyi.
- UI:
    - Bileşenler saf ve yan etkisiz; I/O lib katmanında.
    - Erişilebilirlik (tab, aria, kontrast) kontrol edilir.
- Performans:
    - Gereksiz re-render engellenir; memo/usCallback gerekli noktalarda.
    - Ağ çağrıları minimum; tek aktif üretim kilidi uygulanır.


## Güvenlik ve İçerik Kuralları

- Pre-instruction: Sistem mesajı yaş/kategori/uzunluk kuralları ve yasakları açıkça içerir.
- Post-check: safety.ts regex’leriyle yasaklı/hassas içerik taraması; gerekiyorsa yumuşatma ve yeniden üretim.
- PII: Prompt/çıktı loglanmaz; IP kaydı tutulmaz veya anonimleştirilir.
- UI uyarıları:
    - “Kişisel bilgi paylaşmayın.”
    - “İçerik daha uygun hale getirildi.” (yalnızca gerektiğinde).


## TTS Kuralları

- Tarayıcı içi TTS (Web Speech API).
- Varsayılan hız: 1.0; seçenekler: 0.8/1.0/1.2.
- Ses seçimi: tr-TR öncelik; kadın/erkek eşleştirme heuristik; garanti değil.
- Paragraf bazlı okuma; Play/Pause/Stop kontrolleri.
- Destek yoksa kibar uyarı ve “Metni kopyala” alternatifi.


## Kapak Görseli (SVG) Kuralları

- /api/cover deterministik SVG döndürür.
- Kategoriye göre sabit renk/ikon eşlemesi.
- Hedef boyutlar: 1024×1024 (kare) veya 1200×630 (wide).
- Cache-Control ve ETag başlıkları ile önbellekleme.


## Gizlilik ve Yasal

- Kalıcı veritabanı yok; yalnızca istek ömrü.
- Gizli anahtarlar yalnızca ortam değişkenlerinde.
- UI’de kısa gizlilik ve ebeveyn gözetimi notu.


## Test ve Kalite

- Unit: lib/ageLengths, lib/prompts, lib/safety, lib/tts.
- Integration: /api/generate, /api/cover.
- E2E: üretim akışı + TTS + hata senaryoları.
- Lighthouse hedefi: A11y/Perf 90+ (makul toleransla).
- CI: lint, typecheck, test zorunlu; kırmızı PR merge edilmez.


## Commit, PR ve Sürümleme

- Konvansiyonel commit formatı (örn. feat:, fix:, docs:).
- Küçük ve odaklı PR’lar; açıklayıcı başlık ve değişiklik özeti.
- Sürüm: 0.x geliştirme; Changelog güncel tutulur.


## Cursor Özel Kurallar

- Cursor’dan gelecek tüm yanıtlar Türkçe olmalıdır.
- Kod önerilerinde:
    - Dosya yollarını net ver.
    - Gerekli tipleri ve import’ları ekle.
    - Mock veri önermeyin; örneklerde açıkça “örnek” ibaresi kullanın.
- Otomatik düzenlemelerde:
    - ESLint/Prettier ile uyumlu değişiklik yap.
    - Büyük refactor’lerde neden-sonuç notu bırak.
- Prompt/metin oluştururken:
    - ContentGuidelines ve PromptEngineering ilkesine uy.
    - Güvenlik filtrelerinden geçmeyen hiçbir içeriği UI’a iletme.


## Görev Yönetimi ve tasks.md Kuralı

- tasks.md içinde tamamlanan her görevin önüne “[x]” işareti koy.
- Devam eden veya planlanan görevler “[ ]” ile işaretli kalır.
- Cursor, otomatik görev güncellemelerinde yalnız mark-up değiştirir; görev tanımı içeriklerini izinsiz değiştirmez.
- Görev güncellemesinden sonra kısa bir “Değişiklik özeti” ekle.

Örnek:

- [x] app/api/generate/route.ts — input doğrulama ve model çağrısı
- [ ] app/api/cover/route.ts — SVG üretimi (kategori/shape)
Değişiklik özeti: generate endpoint happy-path testleri eklendi.


## Dosya ve Yapı Sözleşmesi

- app/api/generate/route.ts
    - POST; body doğrulama; sistem mesajı birleştirme; model çağrısı; post-check; { title, paragraphs[], wordCount, safety } döner.
- app/api/cover/route.ts
    - GET; category/shape; image/svg+xml; deterministik SVG; cache/etag.
- lib/prompts.ts
    - Sistem mesajı şablonları, kelime hedefi hesapları.
- lib/safety.ts
    - preProcess, postCheck, sanitizeAndRegenerate; regex liste kullanımı.
- lib/tts.ts
    - getVoices/pickVoice; speakParagraphs controller API.
- constants/guards.ts
    - Yasaklı/hassas kelime kalıpları; TR odaklı varyantlar.
- components/… (UI)
    - OptionsBar, ChatBox, StoryView, TTSControls, Loader, SafetyNotice, ErrorState.


## Performans ve Dayanıklılık

- Token bütçesi: Hedef uzunluk +%20.
- Tek aktif üretim kilidi (UI).
- Zaman aşımı ve yeniden deneme politikaları (makul sınırlar).
- Görsel ve font optimizasyonu; ağır bağımlılıklardan kaçın.


## Hata Yönetimi ve Geri Alma

- Hata mesajları kısa ve kullanıcı dostu; teknik detay sızdırma.
- “Bakım modu/üretimi durdur” bayrağı ile hızlı kapatma.
- PR tabanlı dağıtım; başarısızsa önceki başarılı build’e anında rollback.


## İletişim ve Dokümantasyon

- README, Architecture.md, Design.md, SecurityAndSafety.md güncel tutulur.
- Değişiklikler Changelog.md’de kayıt altına alınır.
- QA_TestPlan.md: sürüm öncesi kontrol listesi uygulanır.
- DeploymentGuide.md: Vercel dağıtım adımlarına sadık kal.


## Hızlı Kontrol Listesi

- [ ] Kod Türkçe yorumlarla yeterince açıklanmış mı?
- [ ] A11y: klavye, ARIA, kontrast kontrolleri yapıldı mı?
- [ ] Güvenlik: pre/post kontroller ve PII politikası uygulandı mı?
- [ ] Performans: gereksiz render ve büyük bağımlılık yok mu?
- [ ] tasks.md güncellemeleri “[x]” işaretleriyle yapıldı mı?
- [ ] Changelog değişiklikleri işlendi mi?

Bu kurallar, Cursor ile üretken, güvenli ve sürdürülebilir bir geliştirme süreci sağlayacak şekilde tasarlanmıştır. Tüm ekip üyeleri bu dosyaya uymalı; değişiklik önerileri PR ile sunulmalıdır.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

