<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Roadmap.md

## Amaç

Bu yol haritası, MVP’yi 3 haftada yayınlamak ve ardından düşük maliyetle sürdürülebilir şekilde geliştirmek için kilometre taşlarını, hedefleri ve başarı kriterlerini tanımlar. Odak: güvenli içerik, Türkçe odaklı deneyim, verisiz mimari, tarayıcı içi TTS ve SVG kapak görselleri.

***

## Yüksek Seviye Hedefler

- Hafta 1: Uçtan uca üretim akışının çalışır hale getirilmesi (UI → API → model → çıktı).
- Hafta 2: TTS, güvenlik filtresi ve hata yönetimi ile “güvenilir kullanım”.
- Hafta 3: Kapak görseli, erişilebilirlik/perf cilası ve üretim dağıtımı.
- Sonrası (Faz 2–3): Kullanıcı değeri yüksek iyileştirmeler, maliyet ve güvenlik dengesini koruyarak genişleme.

***

## Zaman Çizelgesi ve Kilometre Taşları

### Hafta 1 — Çekirdek Akış ve Altyapı (MVP-Çekirdek)

Milestones

- Proje iskeleti (Next.js, TS, Tailwind) hazır.
- Prompt şablonları, yaş/uzunluk kuralları ve temel güvenlik yönergeleri tanımlı.
- /api/generate endpoint’i ilk hikayeyi döndürüyor (başlık + 3–6 paragraf).
- UI: OptionsBar + ChatBox + StoryView (skeleton) akışı bağlı.

Teslim Kriterleri

- Örnek prompt ile 2–6s aralığında cevap; yapı kurallarına uyumlu metin.
- Mobil/masaüstü temel düzenler çalışır; CTA’lar ve loading durumu net.

Riskler ve Önlemler

- Model uzunluk sapması: daha sıkı sistem mesajı + yeniden üretim denemesi.
- Çevresel değişken eksikleri: check-env scripti ve README güncel.


### Hafta 2 — TTS, Güvenlik ve Hata Yönetimi (MVP-Güvenilirlik)

Milestones

- TTSControls + paragraf bazlı okuma (Play/Pause/Stop).
- Güvenlik post-check (regex) ve yumuşatma/yeniden üretim akışı.
- ErrorState + yeniden dene; iskelet ekranlar; tek aktif üretim kilidi.

Teslim Kriterleri

- TTS destekleyen tarayıcılarda akıcı okuma; destek yoksa kibar uyarı.
- Riskli promptlarda “daha uygun sürüm” mesajı ve temiz çıktı.
- Ağ/model hatasında kullanıcı toparlanabilir ve yeniden deneyebilir.

Riskler ve Önlemler

- TTS tarayıcı farklılıkları: en yakın ses eşlemesi ve bilgilendirici metin.
- Regex yanlış-pozitifleri: negatif/pozitif test seti, ince ayar.


### Hafta 3 — Görsel, A11y/Perf ve Yayın (MVP-Teslim)

Milestones

- /api/cover ile kategoriye özgü SVG kapak görselleri.
- WCAG AA kontrast, klavye erişimi, ARIA etiketleri.
- Vercel production dağıtımı, minimal gözlemlenebilirlik (PII’siz metrikler).

Teslim Kriterleri

- Dört kategori için ayırt edilebilir kapak; OG için statik fallback kabul edilebilir.
- Lighthouse: Performans ve Erişilebilirlik 90+ hedefi (makul sapma toleransı).
- Production URL’de tüm akış stabil.

Riskler ve Önlemler

- Görsel boyutu/performans: SVG <20KB, cache ve ETag.
- Dağıtım sorunları: çevre değişkenleri ve alan adı yapılandırma rehberi.

***

## Faz 2 — Deneyim İyileştirmeleri (4–6. hafta)

Hedefler

- UI cilalama, mikro kopya iyileştirmeleri, boş durum ipuçları.
- Basit rate limit ve anonim logger; daha iyi hata açıklamaları.
- Prompt kalite iyileştirme: yaş/kategori mikro talimat kütüphanesi.

Önemli İşler

- Rate limit (IP/oturum bazlı) ve token bütçe koruması.
- Güvenlik listesi güncellemeleri; test seti genişletme.
- “Metni kopyala” akışında kullanıcıya ölçülü geri bildirim (toast).
- strings.tr.json ile mikro kopyaların merkezi yönetimi.

Başarı Kriterleri

- Hata oranında düşüş; kullanıcı geri bildirimlerinde anlaşılır metinler.
- Riskli promptların yumuşatma sonrası başarı oranında artış.

***

## Faz 3 — Değer Odaklı Genişleme (6–10. hafta)

Opsiyonlar (Öncelik sırasına göre uyarlanabilir)

- Premium TTS (isteğe bağlı, maliyetli): Daha doğal ses ve karakter tonları.
- Basit kişiselleştirme: Çocuk adı ve ilgi alanı; güvenlik yönergeleri sabit kalır.
- Çok dilli destek: strings.*.json ve model yönergelerinin dil blokları.
- OG Image SSR: Kategoriye göre paylaşım görseli üretimi (performans/önbellek dikkat).
- Hafif analitik (privacy-first): PII’siz metrikler, açık onay ile etkinleştirme.

Başarı Kriterleri

- Etkileşim süresi ve tekrarlı kullanımda artış.
- Geri bildirimlerde ses ve okuma deneyimi memnuniyetinin yükselmesi.

Riskler

- Maliyet artışı (premium TTS): kullanım kotaları ve devre anahtarı.
- Çok dil: kalite/ton sapmaları; dil başına test seti ve yönerge ayarı.

***

## Teknik Yol Haritası (Öncelik Bazlı)

P0 — Bloklayıcılar

- Next.js+TS+Tailwind kurulum ve çekirdek akış
- /api/generate ve prompt şablonları
- Güvenlik yönergeleri (pre) ve post-check iskeleti
- UI akışı (OptionsBar, ChatBox, StoryView)

P1 — Güvenilirlik ve Deneyim

- TTSControls + tts yardımcıları (voices, rate)
- ErrorState ve yükleniyor iskeletleri
- /api/cover: SVG placeholder
- Yumuşatma/yeniden üretim, tek aktif üretim kilidi

P2 — Operasyonel ve Kalite

- Basit rate limit, anonim logger
- Test kapsamı genişletme (unit/API/E2E)
- A11y (kontrast, klavye), performans (assets, lazy init)

P3 — Genişleme

- Premium TTS (opsiyonel)
- Kişiselleştirme (isim/ilgi alanı)
- Çok dilli destek
- OG Image SSR ve/veya dinamik paylaşım görselleri

***

## Ölçüm ve Başarı Metrikleri

Çekirdek

- Üretim başarı oranı (%): 200–900 kelime hedefinde temiz çıktı.
- Ortalama yanıt süresi (s): 2–6s aralığı.
- Yumuşatma oranı (%): Riskli promptlarda güvenli çıktıya geçiş oranı.

Deneyim

- TTS etkin kullanım oranı (%): Play başlatma sayısı / toplam hikaye.
- Hata/yeniden deneme oranı: Ağ/model hatalarında toparlanma.

Kalite ve Güvenlik

- Yasaklı içerik kaçak oranı: Testte yakalanmayan durumlar (hedef ~0).
- Erişilebilirlik skoru: Lighthouse A11y 90+.

Operasyonel

- Maliyet kontrolü: Token kullanımı ve istek sayısı; rate limit etkinliği.

***

## Riskler ve Azaltma

- Model sapmaları: Prompt sadeleştirme, örnek sinyal blokları, yeniden üretim.
- TTS tarayıcı uyumsuzlukları: En yakın eşleşme, bilgilendirici UI metni, fallback.
- Ücretsiz kota limitleri: Kibar bakım modu, geçici kısıtlama ve uyarı.
- Regex false positive/negative: Liste iyileştirme, geniş test ve düzenli gözden geçirme.
- Kullanıcı PII girişi: UI uyarıları, prompt normalize etme ve PII çıkarma.

***

## Bağımlılıklar ve Hazırlıklar

- Ortam değişkenleri: GEMINI_API_KEY; dokümante ve CI’da doğrulama.
- Güvenlik başlıkları ve CORS: Production’da doğru yapılandırma.
- Tasarım token’ları: Renk, spacing, tipografi; Tailwind temasıyla uyum.

***

## Yayın Stratejisi

- Light beta: Kısıtlı kullanıcı grubuyla 1–2 hafta gözlem.
- Geri bildirim: Mikro kopya, TTS hız/ton tercihleri, güvenlik mesajı anlaşılır mı?
- Hızlı düzeltmeler: Prompt ve regex güncellemeleri minimum sürüm artışıyla.
- Stabil sürüm: Faz 2 işlerine geçmeden önce borçların kapatılması.

***

## İletişim ve Dokümantasyon

- README: Kurulum, çalıştırma, deploy adımları, çevre değişkenleri.
- Architecture.md, Design.md, Tasks.md: Güncel tutulur.
- Güvenlik ve gizlilik metinleri: Kısa özet + ayrıntı sayfası.
- Changelog: Önemli değişiklikler ve güvenlik listesi güncellemeleri.

***

Bu yol haritası, sıfıra yakın bütçe ve sade mimariyle kullanışlı bir MVP’yi hızlıca hayata geçirip, güvenlik ve kaliteyi koruyarak adım adım geliştirmeyi hedefler. Hazır olduğunda, sıradaki doküman olarak Changelog.md veya DeploymentGuide.md üretilebilir.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

