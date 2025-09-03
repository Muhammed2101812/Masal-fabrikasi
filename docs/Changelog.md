<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Changelog.md

Tarih formatı: YYYY-MM-DD. Ana değişiklikler öne çıkarılmıştır. Bu dosya, MVP’den itibaren tüm mimari/ürün değişimlerini izler.

***

## 2025-08-20 — v0.4.0 “Road to Release”

- Özellik: ImageStrategy.md eklendi; /api/cover için kategorilere özel SVG stratejisi tanımlandı.
- Özellik: PrivacyAndLegal.md eklendi; PII’siz mimari, log politikası ve sorumluluk metinleri netleştirildi.
- Özellik: TTSDesign.md eklendi; tr-TR ses önceliği, hız (0.8/1.0/1.2) ve paragraf kuyruğu.
- Özellik: PromptEngineering.md eklendi; yaş/kategori/uzunluk odaklı sistem mesajı şablonları.
- Özellik: ContentGuidelines.md eklendi; yasaklı/hassas içerik ve yaşa uygun dil kuralları.
- Özellik: SecurityAndSafety.md eklendi; pre/post güvenlik, yumuşatma ve oran sınırlama prensipleri.
- Özellik: Tasks.md güncellendi; P0–P3 önceliklendirme, kabul kriterleri ve test planı.
- Özellik: Design.md ve Architecture.md tamamlandı; bileşen sözleşmeleri ve API akışları net.
- Not: Faz 2–3 genişleme başlıkları (premium TTS, kişiselleştirme, çok dil) yol haritasına taşındı.


## 2025-08-18 — v0.3.0 “Safety Pass”

- Özellik: Post-generation güvenlik denetimi akışı tasarlandı (regex + yumuşatma → yeniden üretim).
- İyileştirme: Sistem mesajına “pozitif sonla bitir” ve “yalnızca başlık+paragraflar” kısıtı eklendi.
- İyileştirme: TTS için erişilebilirlik gereksinimleri (klavye kısayolları, aria-live) belirlendi.
- İyileştirme: OptionsBar varsayılanları (6–8, uyku öncesi, orta) önerildi.
- Not: PII uyarısı UI mikro-kopyasına eklendi (“Kişisel bilgi paylaşmayın.”).


## 2025-08-15 — v0.2.0 “Core Flow”

- Özellik: Çekirdek kullanıcı akışı tanımlandı (OptionsBar → ChatBox → StoryView → TTS).
- Özellik: /api/generate ve yanıt sözleşmesi taslağı: { title, paragraphs[], wordCount, safety }.
- Özellik: Yaş/uzunluk kelime hedefleri belirlendi (3–5:150–300, 6–8:300–600, 9–12:600–900).
- İyileştirme: Tek aktif üretim kilidi ve loader/skeleton durumları eklendi.
- Not: Kapak görseli için SVG placeholder yaklaşımı ilk kez önerildi.


## 2025-08-12 — v0.1.0 “MVP Plan”

- Başlangıç: MVP kapsamı, teknoloji seçimi (Next.js, TS, Tailwind, tarayıcı içi TTS, Gemini 2.5 Flash-Lite).
- Tanım: Misafir kullanım, kalıcı veritabanı yok, anonim-minimal log stratejisi.
- Çerçeve: Güvenlik hedefleri, içerik ilkeleri ve performans hedefleri (2–6s yanıt) belirlendi.

***

# Değişiklik Türleri (Etiketler)

- Özellik: Yeni bir fonksiyon veya dosya/doküman.
- İyileştirme: Mevcut davranışın kalite, a11y ya da performans iyileştirmesi.
- Düzeltme: Hata veya uyumsuzluk giderimi.
- Not: Geliştiriciye/operasyona yönelik bilgi.

***

# Sürümleme Politikası

- 0.x: MVP geliştirme aşaması; kırılabilir değişiklikler mümkündür.
- 1.0.0: Üretim istikrarı hedeflendiğinde; API sözleşmeleri donuklaştığında.
- Artış kuralları:
    - major: API sözleşmesi kırıcı değişiklikler.
    - minor: Geriye dönük uyumlu yeni özellikler.
    - patch: Düzeltmeler ve küçük iyileştirmeler.

***

# Yayın Kontrol Listesi

- [ ] Architecture.md ve Design.md güncel mi?
- [ ] SecurityAndSafety.md’daki filtre listeleri ve akışlar uyumlu mu?
- [ ] PromptEngineering.md hedef kelime/uzunluk aralıkları ile tutarlı mı?
- [ ] ContentGuidelines.md ile üretim kalitesi örnek testlerde doğrulandı mı?
- [ ] TTSDesign.md kontrolleri tüm desteklenen tarayıcılarda çalışıyor mu?
- [ ] ImageStrategy.md SVG’leri deterministik ve <20KB mi?
- [ ] PrivacyAndLegal.md kısa metinleri UI’da görünür mü?
- [ ] Tasks.md’deki P0 işleri tamamlandı mı? Testler yeşil mi?

***

# Gelecek Sürümler (Öngörü)

- v0.5.0: /api/cover için OG görsel fallback’i ve cache başlıkları; test snapshot’ları.
- v0.6.0: Güvenlik regex kapsamı genişletme + negatif/pozitif test setleri.
- v0.7.0: Basit rate limit ve anonim logger entegrasyonu.
- v0.8.0: A11y/Perf cilası; Lighthouse 90+ hedefi.
- v1.0.0: Üretim kararlılığı; sürüm dondurma ve Faz 2’ye geçiş.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

