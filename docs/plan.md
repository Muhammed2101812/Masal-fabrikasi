<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# plan.md

## Proje Özeti

- Hedef: Çocuklar ve ebeveynler için, chat tabanlı AI ile kişiye göre ayarlanabilir, güvenli ve Türkçe hikaye üretimi.
- Platform: Web uygulaması (Next.js). İleride Android’e dönüşüm planlanacak.
- AI: Gemini 2.5 Flash-Lite ile metin üretimi.
- TTS: Tarayıcı içi Web Speech API (ücretsiz), kadın/erkek sesi ve hız seçeneği.
- Görseller: Her hikaye için tek kapak görseli (ücretsiz üretim/placeholder).
- Veri: Üyelik ve kalıcı veri saklama yok; minimal log ve anonim kullanım.
- Bütçe: Sıfıra yakın (Vercel Hobby, Web Speech API, Gemini düşük maliyet).


## Ürün Kapsamı (MVP)

- Chat tabanlı kullanım:
    - Prompt kutusu
    - Üst/alt bantta seçenek butonları:
        - Yaş aralığı: 3-5, 6-8, 9-12
        - Kategori: uyku öncesi, macera, eğitici, masalsı
        - Uzunluk: kısa, orta, uzun
- Hikaye üretimi:
    - Yaşa göre dil ve uzunluk kalibrasyonu
    - Tek hikaye başlığı + 3-6 paragraf metin
    - Türk kültürüne uygun, güvenli anlatım
- Görsel:
    - Hikaye başına tek kapak görseli (başlangıçta ücretsiz/placeholder)
- Seslendirme:
    - Kadın/erkek ses seçimi
    - Hız seçimi (yavaş/normal/hızlı)
    - Duraklama ve tonlama: noktalama ve paragraf bazlı doğal duraksamalar
- Kullanım:
    - Misafir kullanım, hesap yok
    - Veri saklama yok (geçici oturum, sayfa yenilenince kaybolabilir)
- Güvenlik:
    - Yaş grubuna göre içerik güvenliği
    - Üretim öncesi yönergeler + üretim sonrası basit kontrol


## Kullanıcı Akışı

1) Ana sayfa

- Üstte yaş/kategori/uzunluk butonları
- Chat giriş alanı
- “Hikaye oluştur” butonu

2) Üretim

- Sunucu, prompt’u yaş/kategori/uzunluk ve güvenlik yönergeleriyle birleştirir
- Gemini 2.5 Flash-Lite çağrısı ile hikaye metni alınır
- Eşzamanlı olarak görsel oluşturucu (ücretsiz/placeholder) hazırlanır
- Sayfada başlık + kapak görseli + metin gösterilir

3) Seslendirme

- TTS paneli: “Ses: Kadın/Erkek”, “Hız: Yavaş/Normal/Hızlı”
- “Oynat/Durdur” kontrolü
- Paragraf bazlı okuma; duraklamalar doğal noktalama ile

4) Tekrar/Paylaşım

- Yeniden üret butonu
- Kopyala (metin) butonu
- İndir/paylaşım ilk sürümde yok


## İçerik Tasarımı

- Yaş aralıklarına göre dil
    - 3-5: 150-300 kelime; kısa cümleler, basit sözcükler
    - 6-8: 300-600 kelime; basit-orta cümleler
    - 9-12: 600-900 kelime; biraz daha zengin anlatım
- Kategoriler
    - Uyku öncesi: sakin tempo, düşük aksiyon
    - Macera: güvenli ve olumlu, risk içermeyen kurgular
    - Eğitici: temel değerler, basit bilgi kırıntıları
    - Masalsı: pozitif, korku ve karanlık temalardan uzak
- Üslup: Sıcak, güvenli, pozitif ve Türk kültürüne uyumlu


## Güvenlik ve Moderasyon

- Sistem yönergesi (model için)
    - Yaşa göre uygun dil
    - Şiddet, nefret, cinsel içerik, korku ve tehlikeli davranışlar yok
    - Belirsiz durumda güvenli alternatif üret
- Prompt ön işleme
    - Kullanıcı prompt’u yaş/kategori/uzunluk ve güvenlik yönergeleriyle birleşir
- Üretim sonrası kontrol
    - Anahtar kelime/ifade filtreleri (regex/listeler)
    - Reddedilme durumunda otomatik yumuşatma ve yeniden üretim
- Uyarı
    - İhlal şüphesinde kullanıcıya “daha uygun sürüm üretildi” bilgisi


## Teknoloji ve Mimari

- Frontend
    - Next.js 14 (App Router), React, TypeScript
    - TailwindCSS
- Backend
    - Next.js Route Handlers (Node runtime)
    - Vercel deploy (Hobby)
- AI
    - Gemini 2.5 Flash-Lite (metin üretimi)
    - Güvenlik ayarları ve düşük token hedefi
- TTS
    - Web Speech API (tarayıcı içi)
    - Türkçe sesler arasından kadın/erkek seçimi (voice listesi enumerate)
    - Hız seçimi: rate 0.8 (yavaş), 1.0 (normal), 1.2 (hızlı)
- Görsel
    - MVP: Ücretsiz/placeholder kapak görseli üretimi
    - Alternatif: Basit bir renkli illüstrasyon jeneratörü (kütüphane/servis)
- Veri
    - Kalıcı veritabanı yok
    - Sadece runtime’da üretim; client-side state
    - Sunucu logları minimal ve anonim
- Analitik
    - Başlangıçta kapalı; talep olursa privacy-first analitik eklenir


## Sayfa ve Bileşen Yapısı

- app/
    - page.tsx (Ana akış)
    - api/
        - generate/route.ts (Gemini çağrısı)
        - cover/route.ts (görsel üretimi veya placeholder)
- components/
    - ChatBox.tsx (prompt + butonlar)
    - OptionsBar.tsx (yaş/kategori/uzunluk)
    - StoryView.tsx (başlık, görsel, metin)
    - TTSControls.tsx (ses/hız seçimi, oynat/durdur)
    - Loader.tsx (yükleniyor durumu)
    - SafetyNotice.tsx (güvenlik bilgilendirme)
- lib/
    - prompts.ts (şablonlar, güvenlik yönergeleri)
    - safety.ts (kelime filtreleri)
    - tts.ts (voice seçimi, hız ayarı yardımcıları)
    - ageLengths.ts (yaşa göre kelime/hedef uzunluk)


## Prompt ve Sistem Mesajı Taslağı

- Sistem mesajı (özet)
    - “Türk kültürüne uygun, {yasAraligi} yaş için güvenli bir {kategori} hikayesi oluştur. Şiddet, korku, cinsel içerik, nefret söylemi ve tehlikeli davranışlar yok. Yaşa uygun sözcükler ve net cümleler kullan. Başlık ver. {uzunluk} uzunlukta 3-6 paragraf üret. Bölümleme yok. Öğretici modüller ekleme.”
- Kullanıcı prompt birleştirme
    - “Kullanıcının istediği tema/karakter/yer detayları + yaş/kategori/uzunluk” → sistem mesajına ek bağlam
- Uzunluk eşlemesi
    - kısa: 200-350 kelime, orta: 350-650, uzun: 650-900 (yaşa göre otomatik azaltma/arttırma)


## TTS Tasarımı

- Ses seçimi
    - Tarayıcıdan kullanılabilir sesleri enumerate et
    - Türkçe (tr-TR) etiketli sesler arasında kadın/erkek yakın eşleşme
    - Eşleşme yoksa en yakın alternatif
- Hız seçimi
    - yavaş: 0.8, normal: 1.0, hızlı: 1.2
- Doğallık
    - Paragrafları ayrı utterance olarak kuyruğa ekle
    - Cümle sonu noktalama doğal duraklamalar yaratır
    - Oynat/durdur/tekrar başlat kontrolü
- Hata yönetimi
    - TTS desteklenmezse kullanıcıya “Tarayıcı TTS desteklemiyor” uyarısı


## Görsel Tasarımı (MVP)

- Seçenek A: Placeholder
    - Kategoriye göre basit ikon/renk temalı SVG üretimi
- Seçenek B: Ücretsiz jenerasyon
    - Ücret çıkarmayan minimal bir görsel API veya yerel şablon
- Boyut/format
    - 1200×630 veya 1024×1024 (kare)
    - WebP/PNG tek kare

Not: İleride sayfa sayfa görsel için jenerasyon veya prompt tabanlı illüstrasyon eklenebilir.

## Hata ve Kenar Durumlar

- Model gecikmesi/art arda istek
    - Spinner ve tahmini süre
    - Aynı anda sadece 1 aktif üretim
- Uygunsuz içerik şüphesi
    - “Daha uygun sürüme dönüştürüldü” bilgisi ve temiz üretim
- TTS başarısız
    - “TTS desteklenmiyor” veya alternatif bilgisi
- Ağ hatası
    - “Lütfen tekrar deneyin” ve yeniden deneme butonu


## Performans

- Sunucu tarafı çağrı: Route Handler (Node)
- Token sınırı: Hedef uzunluk + %20 güvenlik payı
- Flash-Lite: Hızlı yanıt ve düşük maliyet
- Statik varlıklar Vercel CDN


## UI/UX Notları

- Çocuk dostu renkler ama sade tasarım (ebeveyn hedefli kullanım)
- Büyük başlık ve rahat satır aralığı
- “Tekrar üret” ve “yeniden oku” butonları görünür
- TTS paneli sabit ve kolay erişilebilir


## Zaman Çizelgesi

- Hafta 1
    - Next.js proje kurulumu
    - ChatBox + OptionsBar
    - Prompt şablonları ve güvenlik yönergeleri
    - Gemini 2.5 Flash-Lite entegrasyonu
- Hafta 2
    - StoryView ve TTSControls
    - TTS: kadın/erkek, hız seçenekleri, paragraf kuyruğu
    - Güvenlik denetimi (regex/listeler)
- Hafta 3
    - Kapak görseli (placeholder veya basit jenerasyon)
    - UI cilalama, mobil uyum
    - Hata yönetimi ve edge-case’ler
- Yayın
    - Vercel deploy
    - Light beta ve hızlı düzeltmeler

Zaman esnek; adımlar art arda tamamlandıkça yayınlanabilir.

## Maliyet

- Hosting: Vercel Hobby (ücretsiz)
- AI: Gemini 2.5 Flash-Lite (çok düşük maliyet; ücretsiz kotalar dahilinde kalmayı hedefle)
- TTS: Web Speech API (ücretsiz)
- Alan adı: İsteğe bağlı (~\$10-15/yıl)
- Veritabanı: Yok


## Hukuki

- Gizlilik: Veri saklanmadığı belirtilecek; loglar anonim
- Sorumluluk: “Ebeveyn gözetiminde kullanım” uyarısı
- Telif: Kullanıcıya kullanım hakkı; model sağlayıcı şartlarına uyum
- İçerik moderasyon: Temel kelime filtreleri + yaşa uygunluk yönergeleri


## Gelecek Fazlar

- Premium TTS (daha doğal ve karakter sesleri)
- Kişiselleştirme (çocuk adı/ilgi alanı/okuma seviyesi)
- Serileştirme (aynı karakterle devam hikayeleri)
- Hikaye galerisi ve topluluk (moderasyonla)
- Android: React Native/PWA sarmalama
- Öğretici modüller: soru-cevap, kelime kartları
- Çok dilli destek


## Görev Listesi (MVP)

- Proje iskeleti (Next.js + Tailwind + TS)
- OptionsBar (yaş/kategori/uzunluk)
- ChatBox (prompt girişi, gönder)
- route.ts (POST /api/generate): Gemini Flash-Lite çağrısı
- route.ts (GET /api/cover): placeholder görsel üretimi
- StoryView (başlık + görsel + metin)
- TTSControls (ses/hız seçimi, oynat/durdur)
- safety.ts (regex/listeler)
- prompts.ts (sistem mesajı + şablonlar)
- Loader ve hata bileşenleri
- Vercel deploy ve test


## Notlar ve Araçlar

- Geliştirme: Cursor ile hızlı yineleme, qwen cli opsiyonel
- Kod kalitesi: TypeScript strict, ESLint/Prettier
- Performans: Token hedefi ve Flash-Lite ile düşük gecikme
- Genişleme: Modüler bileşen mimarisi, ileride veritabanına geçişe hazır

Bu plan, sıfıra yakın bütçeyle hızlı bir MVP çıkarırken güvenli, Türkçe odaklı ve ebeveyn/çocuk kullanımına uygun bir deneyim sunmayı hedefler.

