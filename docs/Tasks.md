<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Tasks.md

## Amaç

Bu doküman, MVP’yi uçtan uca çıkarmak için yapılacak işleri, önceliklendirmeyi, teslim kriterlerini ve sorumlulukları tanımlar. Hedef: 3 haftada, düşük maliyetli, güvenli ve yaşa uygun hikaye üretimi yapan web uygulamasını yayınlamak.

***

## Yol Haritası ve Öncelikler

- P0 (bloklayıcı): Proje iskeleti, model entegrasyonu, güvenlik filtresi, temel UI akışları.
- P1 (yüksek öncelik): Kapak görseli, TTS kontrolleri, hata yönetimi.
- P2 (iyi olur): Basit rate limit, logger, test kapsamının genişletilmesi.
- P3 (gelecek faz): Premium TTS, kişiselleştirme, çok dilli destek.

***

## Haftalık Plan

### Hafta 1 — Proje İskeleti ve Üretim Akışı (P0)

1. Proje Kurulumu

- Next.js 14 (App Router), TypeScript strict, TailwindCSS yapılandırması.
- ESLint + Prettier + temel scriptler (lint, typecheck).
- Teslim kriteri: Proje dev sunucusu ayağa kalkar, örnek sayfa render eder.

2. Kök Dosyalar

- README.md, .env.example (GEMINI_API_KEY), .gitignore, tsconfig.json, next.config.js, tailwind.config.ts, postcss.config.js.
- Teslim kriteri: .env kontrol scripti ile eksik değişken uyarısı.

3. Lib Altyapısı

- lib/ageLengths.ts: yaş/uzunluk hedefleri.
- lib/prompts.ts: sistem mesajı ve prompt şablonları.
- lib/safety.ts: pre/post filtre arayüzü ve boş implementasyon.
- lib/gemini.ts: Gemini 2.5 Flash-Lite istemcisi (ENV üzerinden).
- Teslim kriteri: Unit testlerle temel fonksiyonlar çağrılabilir.

4. API: /api/generate

- Input şeması (Zod veya TS type check), sistem mesajı birleştirme.
- Model çağrısı, üretim sonrası güvenlik kontrolü, response şeması.
- Teslim kriteri: Örnek prompt ile başlık + 3–6 paragraf döner.

5. UI: OptionsBar + ChatBox

- Yaş/kategori/uzunluk seçimleri; prompt girişi; CTA “Hikaye oluştur”.
- Form geçerlilikleri (boş prompt engeli veya min karakter uyarısı).
- Teslim kriteri: Form gönderiminde /api/generate çağrılır, loading state görünür.

6. UI: StoryView (İskelet)

- Başlık, paragraf listesi, skeleton durumu.
- “Tekrar üret” ve “Metni kopyala” butonları (stub).
- Teslim kriteri: Sunucudan gelen metin render edilir, kopyalama çalışır.

7. Güvenlik Mesajı (İskelet)

- SafetyNotice: “İçerik daha uygun hale getirildi.” koşullu gösterim.
- Teslim kriteri: API’dan adjusted=true geldiğinde mesaj görünür.

8. Temel Testler

- Unit: prompts.ts, ageLengths.ts.
- API smoke test: generate endpoint happy path.
- Teslim kriteri: CI’de testler yeşil.


### Hafta 2 — TTS, Güvenlik ve Hata Yönetimi (P0–P1)

1. Web Speech API Entegrasyonu

- lib/tts.ts: voice enumerasyon, seçim ve hız ayarı yardımcıları.
- TTSControls: kadın/erkek seçimi, hız (0.8/1.0/1.2), Play/Pause.
- Teslim kriteri: Paragraf bazlı okuma çalışır, TTS desteklenmiyorsa uyarı görünür.

2. Güvenlik Filtreleri

- constants/guards.ts: yasaklı/kısıtlı kelimeler (TR odaklı).
- safety.ts: preProcess (prompt yumuşatma), postCheck (regex tarama), sanitizeAndRegenerate akışı.
- Teslim kriteri: Bilinen anahtar kelimelerde yumuşatma devreye girer; UI bilgilendirir.

3. Hata Yönetimi

- ErrorState bileşeni: mesaj + “Tekrar dene”.
- Ağ ve model hatalarında kullanıcıya geri bildirim.
- Teslim kriteri: Ağ kesintisi simülasyonunda UI doğru toparlanır.

4. Yükleniyor ve İskelet Ekranları

- StoryView skeleton; CTA disable; tahmini süre metni (statik).
- Teslim kriteri: Loading sırasında görsel iskelet ve metin satırları görünür.

5. E2E Test (temel)

- Üretim akışı: seçim → prompt → sonuç → TTS Play.
- Hata durumu: 500/timeout simülasyonu → tekrar dene.
- Teslim kriteri: Yerel E2E senaryoları stabil geçer.


### Hafta 3 — Kapak Görseli, İnce Rötuşlar ve Yayın (P1)

1. Kapak Görseli

- /api/cover: kategoriye göre SVG placeholder üretimi (renk/ikon varyasyonu).
- StoryView’de responsif görsel gösterimi.
- Teslim kriteri: Her kategori için belirgin farklılıkta görsel döner.

2. UI Cilalama ve Erişilebilirlik

- Kontrast denetimi, focus halkaları, ARIA etiketleri.
- Mobil/masaüstü düzenleri ve spacing ayarları.
- Teslim kriteri: WCAG AA kontrast hedefi; klavye navigasyonu tam.

3. Performans İyileştirmeleri

- Assets küçültme (SVG), gereksiz JS azaltma, lazy init.
- Teslim kriteri: İlk yük hızlı; Lighthouse perf ve a11y 90+ hedefi.

4. Dağıtım ve Ortam

- Vercel yapılandırması; environment setupları; minimal vercel.json (opsiyonel).
- Teslim kriteri: Production URL’de tüm akış çalışır.

5. Dokümantasyon

- README: kurulum, çalıştırma, deploy adımları.
- Changelog başlangıcı, kısa runbook (opsiyonel).
- Teslim kriteri: Yeni geliştirici 15 dakikada projeyi ayağa kaldırabilir.

***

## Değişiklik Özeti

**Hafta 1 — Proje İskeleti ve Üretim Akışı (P0) Tamamlandı**

- ✅ Next.js 14 (App Router) + TypeScript strict + TailwindCSS proje kurulumu
- ✅ Temel konfigürasyon dosyaları (tsconfig.json, next.config.js, tailwind.config.ts)
- ✅ Ortam değişkenleri yönetimi (.env.example, check-env scripti)
- ✅ Lib altyapısı: ageLengths.ts, prompts.ts, safety.ts, gemini.ts
- ✅ API endpoint: /api/generate route.ts (Zod validation, Gemini entegrasyonu)
- ✅ UI bileşenleri: OptionsBar, ChatBox, StoryView (skeleton dahil)
- ✅ Ana sayfa ve layout (güvenlik uyarıları dahil)
- ✅ README.md ve proje dokümantasyonu

**Hafta 2 — TTS, Güvenlik ve Hata Yönetimi (P0–P1) Tamamlandı**

- ✅ constants/guards.ts (yasaklı kelime listesi ve güvenlik kuralları)
- ✅ lib/tts.ts (Web Speech API entegrasyonu)
- ✅ components/TTSControls.tsx (sesli okuma kontrolleri)
- ✅ StoryView'a TTS entegrasyonu
- ✅ Güvenlik filtreleri güncellendi (safety.ts)

**Hafta 2 — Hata Yönetimi ve UI İyileştirmeleri Tamamlandı**

- ✅ ErrorState.tsx (hata durumları için bileşen)
- ✅ Ana sayfaya hata yönetimi entegrasyonu
- ✅ Yükleniyor ekranları iyileştirildi (skeleton + spinner)
- ✅ ChatBox loading state güncellendi
- ✅ Retry ve Reset fonksiyonları eklendi

**Hafta 3 — AI Görsel Üretimi Sistemi Tamamlandı**

- ✅ /api/cover endpoint'i (SVG üretimi)
- ✅ /api/cover-ai endpoint'i (Gemini AI görsel üretimi)
- ✅ Kategoriye göre renk/ikon eşlemeleri (masalsi, macera, egitici, uyku)
- ✅ StoryView'a AI görsel entegrasyonu
- ✅ Fallback sistemi (AI başarısız olursa SVG)
- ✅ Cache-Control ve ETag başlıkları
- ✅ Next.js 14 uyarıları düzeltildi (viewport, appDir)

**AI Görsel Özellikleri:**
- 🎨 **Gemini 1.5 Pro** ile görsel üretimi
- 📝 **Kategori bazlı prompt'lar** (masalsi, macera, egitici, uyku)
- 🔄 **Otomatik fallback** (AI başarısız olursa SVG)
- ⚡ **Hızlı önbellekleme** (1 saat AI, 24 saat SVG)

**Kalan Görevler:**
- E2E testler
- UI cilalama ve erişilebilirlik
- Performans iyileştirmeleri

***

## İş Listesi (Detaylı)

P0 — Bloklayıcı

- [x] Next.js + TS + Tailwind proje kurulumu
- [x] Lint, typecheck scriptleri ve CI workflow
- [x] .env.example ve check-env scripti
- [x] lib/ageLengths.ts (kurallar)
- [x] lib/prompts.ts (sistem mesajı, şablonlar)
- [x] lib/gemini.ts (istemci)
- [x] app/api/generate/route.ts (POST) — input doğrulama, model çağrısı
- [x] components/OptionsBar.tsx
- [x] components/ChatBox.tsx
- [x] components/StoryView.tsx (metin render, skeleton)
- [x] constants/guards.ts (temel liste)
- [x] lib/safety.ts (pre/post iskelet)
- [x] SafetyNotice.tsx (koşullu)
- [x] lib/tts.ts (Web Speech API entegrasyonu)
- [x] TTSControls.tsx (sesli okuma kontrolleri)
- [x] ErrorState.tsx (hata yönetimi)
- [x] Yükleniyor ekranları iyileştirildi
- [ ] Temel unit testler
- [ ] Basit e2e: üretim akışı

P1 — Yüksek

- [ ] TTSControls.tsx + lib/tts.ts (voices, hız, play/pause)
- [ ] Hata yönetimi: ErrorState.tsx, RetryButton.tsx
- [ ] app/api/cover/route.ts (kategori tabanlı SVG)
- [ ] StoryView’da “Tekrar üret” ve “Metni kopyala”
- [ ] Güvenlik yumuşatma: sanitizeAndRegenerate akışı
- [ ] E2E: hata/yeniden dene, TTS yok fallbacks

P2 — İyileştirmeler

- [ ] lib/logger.ts (anonim, minimal)
- [ ] lib/rateLimit.ts (IP/oturum bazlı basit kısıt)
- [ ] Test kapsamı genişletme (safety edge case’ler)
- [ ] UI mikro kopya iyileştirmeleri ve boş durum ipuçları

P3 — Gelecek

- [ ] Premium TTS desteği
- [ ] Kişiselleştirme (isim/ilgi) — güvenlikten bağımsız tut
- [ ] Çok dilli destek — i18n + strings.*.json
- [ ] Basit galeri (geçici depolama veya export paylaşımı)

***

## Kabul Kriterleri (Definition of Done)

Genel

- Tüm akışlar mobil ve masaüstünde çalışır.
- Gizlilik metni ve “ebeveyn gözetimi” uyarısı görünür.
- PII toplanmaz; içerik loglanmaz.

/api/generate

- Geçerli input ile 2s–6s içinde yanıt; başlık + 3–6 paragraf.
- Yaş/uzunluk hedeflerine kabaca uygun; güvenlik yönergeleri dahil.
- İhlal şüphesinde yumuşatma ve bilgilendirme.

UI

- OptionsBar ve ChatBox hatasız; CTA loading’de disabled.
- StoryView skeleton ve sonuç gösterimi tutarlı.
- TTSControls: destek varsa oynat/durdur çalışır, yoksa uyarı.
- Hata senaryosunda ErrorState → “Tekrar dene” çalışır.

Erişilebilirlik

- Kontrast AA.
- Klavye navigasyonu tam.
- ARIA etiketleri kritik bileşenlerde mevcut.

Performans

- Başlangıç yüklemesi hızlı; gereksiz render yok.
- Kapak görselleri SVG ve küçültülmüş.

Testler

- Unit: prompts, safety, tts yardımcıları.
- API: generate en az 1 happy, 1 riskli senaryo.
- E2E: üretim ve TTS akışı.

***

## Teknik Notlar ve Bağımlılıklar

- Bağımlılıklar: Next.js 14, React 18, TailwindCSS, (opsiyonel) Zod, testing framework (Vitest/Jest), E2E (Playwright/Cypress).
- ENV: GEMINI_API_KEY zorunlu. Production’da sadece gereken domainlere izin ver.
- Runtime: Node (Route Handlers). CDN: Vercel statik varlıklar.

***

## Riskler ve Azaltma

- Model tutarsız uzunluk: prompt güçlendirme + gerekirse yeniden üretim.
- TTS tarayıcı farkları: fallback ses ve kullanıcı bilgilendirmesi.
- Güvenlik regex kaçakları: negatif örneklerle sürekli güncelleme ve test.
- Ücretsiz kota sınırları: kibar hata mesajı + tekrar dene + geçici throttling.

***

## Sorumluluklar (Öneri)

- Frontend: OptionsBar, ChatBox, StoryView, TTSControls, durum yönetimi.
- Backend/API: generate ve cover route’ları, safety post-check.
- QA: Unit/API/E2E senaryoları, a11y ve performans denetimleri.
- Ops: Vercel deploy, ENV yönetimi, minimal gözlemlenebilirlik.

***

## Teslimatlar

- Çalışan Production dağıtımı (Vercel).
- Kaynak kod (repo) + README + .env.example.
- Architecture.md, Design.md, Tasks.md (güncel).
- Temel test raporları (CI çıktısı).
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

