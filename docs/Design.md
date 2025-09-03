<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Design.md

## Amaç ve Kapsam

Bu doküman, çocuklar ve ebeveynler için Türkçe, güvenli ve kişiselleştirilebilir hikaye üreten web uygulamasının ürün ve arayüz tasarımını, etkileşim akışlarını, bileşen sözleşmelerini, içerik ilkelerini ve erişilebilirlik/performans gereksinimlerini tanımlar. Hedefler: ebeveyn odaklı sade bir arayüz, çocuk dostu görsel dil, minimum bilişsel yük, net geri bildirimler ve yaşa uygun içerik üretimi.

***

## Tasarım Prensipleri

- Basitlik ve odak: Tek görev akışı (hikaye üretimi) üzerine yalın arayüz.
- Güven ve emniyet: Yaş gruplarına uygun dil, pozitif içerik, açık güvenlik iletişimi.
- Tutarlılık: Bileşen hiyerarşisi, boşluk kullanımı ve renk sistemi tutarlı.
- Erişilebilirlik: Kontrast, klavye navigasyonu, ARIA etiketleri, TTS ile uyum.
- Geri bildirim: Yükleniyor, hata, yumuşatma/yeniden üretim durumlarında net durum mesajları.
- Performans: Az JS ayak izi, hızlı ilk yükleme, görsel ve metinde gecikmeyi gizleyen iskeletler.

***

## Bilgi Mimarisi

- Ana sayfa (tek sayfa MVP)
    - Üst kısım: Başlık, kısa açıklama.
    - Seçenekler çubuğu: Yaş aralığı, kategori, uzunluk.
    - Chat alanı: Prompt girişi ve “Hikaye oluştur” butonu.
    - Çıktı alanı: Başlık, kapak görseli, paragraf metni.
    - TTS paneli: Ses seçimi, hız, oynat/durdur.
    - Sistem mesajları: Güvenlik bilgilendirme, hata/uyarı bileşenleri.

***

## Ana Kullanıcı Akışları

1) Hikaye Üretimi

- Kullanıcı yaş/kategori/uzunluk seçer.
- Prompt yazar ve “Hikaye oluştur”a basar.
- Yükleniyor durumu görünür; ardından başlık + görsel + metin gelir.
- Güvenlik yumuşatması olduysa bilgi mesajı gösterilir.

2) TTS Okuma

- Kullanıcı ses ve hız belirler.
- Oynat: paragraf bazlı okuma başlar.
- Durdur/tekrar başlat kontrolleriyle akış yönetilir.

3) Yeniden Üretim/Kopyalama

- “Tekrar üret” ile aynı seçimlerle yeni hikaye.
- “Metni kopyala” ile içerik pano’ya kopyalanır.

***

## Sayfa Yerleşimi (Layout)

- Header
    - Uygulama adı/marka.
    - Kısa alt başlık: “Türkçe, güvenli, yaşa uygun hikayeler.”
- Main
    - OptionsBar: üçlü seçim grubu, kompakt butonlar.
    - ChatBox: tek satır prompt alanı + “Hikaye oluştur” birincil CTA.
    - StoryView: başlık (H1), kapak görseli (üstte), paragraf metinleri (rahat satır aralığı).
    - TTSControls: sabitlenmiş panel (sticky) veya StoryView altında.
    - SafetyNotice/ErrorState: bağlama göre görünür.
- Footer (MVP kısa)
    - Gizlilik ve sorumluluk notu (tek cümle).

***

## Renk, Tipografi ve Stil

- Renk Paleti
    - Birincil: Sakin mavi veya menekşe (güven ve sakinlik).
    - İkincil: Pastel yeşil/sarı (çocuk dostu vurgu).
    - Durum renkleri: Başarı yeşil, uyarı turuncu, hata kırmızı.
    - Kontrast: Minimum 4.5:1 (WCAG AA).
- Tipografi
    - Başlık: Açık, yuvarlatılmış bir sans-serif; H1 28–32px, H2 22–24px.
    - Gövde: 16–18px, line-height 1.6–1.75.
    - Buton/metin: Net, kısa etiketler.
- Bileşen Stili
    - Kenar yarıçapı: 8–12px.
    - Gölge: Hafif (elevation 1).
    - Boşluk: 8/12/16/24 ölçekli grid.

***

## Bileşen Tasarımları ve Sözleşmeleri

1) OptionsBar

- Amaç: Yaş, kategori, uzunluk seçimleri.
- Elemanlar:
    - Yaş: 3-5, 6-8, 9-12 (toggle group).
    - Kategori: uyku öncesi, macera, eğitici, masalsı.
    - Uzunluk: kısa, orta, uzun.
- Durumlar: seçili/hover/disabled.
- Hata durumu: Zorunlu alanlar yok; varsayılanlar atanır (örn. 6-8, uyku öncesi, orta).
- Props (öneri):
    - value: { ageRange, category, length }
    - onChange(next)

2) ChatBox

- Amaç: Tema/karakter/yer gibi bağlamı almak.
- Elemanlar: Tek satır veya çok satırlı textarea, birincil CTA “Hikaye oluştur”.
- Durumlar: boş, odağa alınmış, gönderim sırasında disabled.
- Kısayol: Cmd/Ctrl+Enter ile gönder.
- Placeholder: “Örn: Deniz kenarında sevimli bir martı ile macera”.
- Props:
    - onSubmit({ prompt })
    - loading (bool)

3) StoryView

- Amaç: Hikaye başlığı, görsel ve metni sunmak.
- Elemanlar: H1 başlık, responsif kapak görseli (aspect-ratio), paragraf listesi.
- Durumlar: skeleton loading, boş durum (henüz üretim yok).
- Aksiyonlar: “Tekrar üret”, “Metni kopyala”.
- Props:
    - story: { title, paragraphs[], wordCount, safety: { adjusted, notes? } }
    - coverSrc (veya inline SVG)
    - onRegenerate()
    - onCopy()

4) TTSControls

- Amaç: Ses, hız ve oynat/durdur.
- Elemanlar: Ses seçimi (Kadın/Erkek), hız (yavaş/normal/hızlı), Play/Pause.
- Durumlar: TTS desteklenmiyor bilgisi, oynuyor/durdu.
- Props:
    - availableVoices: { id, label, gender, locale }[]
    - selected: { voiceId, rate }
    - onChange(next)
    - onPlay(), onPause()
    - supported (bool)

5) Loader

- Amaç: Model yanıtı beklenirken durum göstermek.
- Stil: Progress spinner + “Hikaye hazırlanıyor…”

6) SafetyNotice

- Amaç: İçerik yumuşatma/uyarı iletmek.
- İçerik: “İçerik daha uygun hale getirildi.” + “Detaylar” (isteğe bağlı).
- Renk: Nötr/uyarı tonu; minimal görsel gürültü.

7) ErrorState

- Amaç: Ağ/model hatası.
- İçerik: Kısa açıklama + “Tekrar dene”.
- Props:
    - message, onRetry()

***

## Durum Diyagramları (Özet)

- generate flow: idle → submitting → loading → success | error
- tts flow: idle → playing → paused → ended | error
- cover flow: idle → fetching → ready | fallback

***

## İçerik Tasarım İlkeleri

- Yaş 3-5: 150–300 kelime; kısa, somut cümleler; basit sözcükler.
- Yaş 6-8: 300–600 kelime; kısa-orta cümleler; temel betimlemeler.
- Yaş 9-12: 600–900 kelime; daha zengin anlatım ama pozitif ve güvenli.
- Kategoriler:
    - Uyku öncesi: sakin tempo, yumuşak sonlar.
    - Macera: güvenli keşif, risk romantizasyonu yok.
    - Eğitici: temel değerler, mini bilgi kırıntıları; didaktik olmayan ton.
    - Masalsı: pozitif, karanlık/korku öğeleri yok.
- Üslup: Sıcak, güvenli, Türk kültürüne uyumlu; net başlık + 3–6 paragraf.

***

## Mikro Kopya (Örnekler)

- CTA: “Hikaye oluştur”
- Placeholder: “Örn: Deniz kenarında sevimli bir martı ile macera”
- Loading: “Hikaye hazırlanıyor…”
- Safety: “İçerik daha uygun hale getirildi.”
- TTS yok: “Tarayıcı TTS desteklemiyor.”
- Hata: “Bir sorun oluştu. Lütfen tekrar deneyin.”

***

## Erişilebilirlik (A11y)

- Klavye navigasyonu: Tüm buton ve alanlar Tab ile erişilebilir.
- Focus halkası: Belirgin, kontrastlı.
- ARIA: role, aria-live (Loader/sonuç), buton etiketleri.
- Renk körlüğü: Anlam için yalnız renk kullanma; ikon/etiketle destekle.
- TTS etkileşimi: Eylemler net, buton etiketleri açıklayıcı.
- Dil etiketi: html lang="tr".

***

## Responsif Tasarım

- Mobil (ilk hedef): Tek sütun; OptionsBar yatay kaydırmalı veya grid 2x.
- Tablet: 2 sütunlu yerleşim; StoryView daha geniş.
- Masaüstü: 960–1200px içerik genişliği; bol beyaz alan.
- Görsel: 1200×630 veya 1024×1024; container içinde object-fit: cover.

***

## Hata ve Kenar Durumları (UI)

- Model gecikmesi: Skeleton + metin; tek aktif üretim için CTA disabled.
- Güvenlik yumuşatma: SafetyNotice üstte; “daha uygun sürüm” ibaresi.
- TTS yok: Panel minimal devre dışı, bilgi mesajı görünür.
- Ağ hatası: ErrorState + “Tekrar dene”.
- Boş prompt: CTA disabled veya kısa uyarı.

***

## Performans ve Algılanan Hız

- İskelet ekranlar: StoryView ve kapak görseli için.
- CTA sonrası anında durum değişimi (optimistic UI yok, ama hızlı geri bildirim).
- Assets: SVG ikonlar, minimal font yükü.
- TTS: Ses listesi önceden alınır; seçim menüsü hızlı açılır.

***

## Tasarım Sistem Token’ları (Öneri)

- Spacing: 4,8,12,16,24,32
- Radius: 8,12
- Shadow: sm, md
- Font sizes: 14,16,18,24,32
- Line heights: 1.4,1.6,1.75
- Colors:
    - primary: \#5B6CF0
    - secondary: \#8FD3A6
    - text: \#1C2330
    - subtle text: \#5B667A
    - bg: \#FAFBFF
    - surface: \#FFFFFF
    - border: \#E6EAF2
    - warning: \#F7B955
    - error: \#E35D6A
    - success: \#33B07A

(Not: Renkler örnektir; Tailwind temasıyla eşlenir.)

***

## Etkileşim Durumları

- Buton: default, hover (+4% koyulaşma), active (iç gölge), disabled (50% opaklık).
- Input: focus’ta belirgin border ve gölge.
- Toggle/segmented control: seçili durum yüksek kontrastlı.
- Snackbar/Toast (opsiyonel): kısa onay mesajları (örn. “Metin kopyalandı”).

***

## İçerik Güvenliği UI Desenleri

- Pre-safety: Hiçbir kullanıcı verisi kalıcı değil mesajı footer’da.
- Post-safety: Yumuşatma bilgisi, aşırı detay vermeden.
- Uygunsuz istek: “Daha güvenli alternatif ürettik” mesajı + yine de pozitif sonuç.

***

## Örnek Ekran Durumları

- Boş Durum:
    - Başlık, kısa açıklama, örnek prompt ipuçları (3–4 küçük chip).
- Yükleniyor:
    - Başlık/görsel skeleton, paragraflar için 3–5 satır skeleton.
- Başarılı:
    - H1, kapak, 3–6 paragraf; TTS açık.
- Hata:
    - Kısa açıklama + “Tekrar dene”.

***

## Bileşen API’leri (Type İpuçları)

- OptionsBarValue:
    - ageRange: '3-5' | '6-8' | '9-12'
    - category: 'uyku' | 'macera' | 'egitici' | 'masalsi'
    - length: 'kısa' | 'orta' | 'uzun'
- Story:
    - title: string
    - paragraphs: string[]
    - wordCount: number
    - safety?: { adjusted: boolean; notes?: string[] }
- TTSSelection:
    - voiceId?: string
    - gender?: 'female' | 'male'
    - rate: 0.8 | 1.0 | 1.2

***

## İzleme ve Gözlemlenebilirlik (MVP)

- Basit sayaçlar: üretim denemesi, başarı, hata oranı (PII’siz).
- Kullanıcıya görünür analytics yok; gizlilik metni kısa bilgilendirir.

***

## Tasarım Kararlarının Gerekçesi

- Tek sayfa akışı: Odak ve düşük bilişsel yük.
- SVG kapak: Hızlı, ücretsiz ve tutarlı estetik.
- TTS panelinin sabitliği: Erişim kolaylığı ve kullanım sıklığı.
- Yaş/kategori/uzunluk önde: Üretim başarı oranını artıran net sinyaller.
- Güvenlik mesajlarının düşük gürültülü sunumu: Korkutmadan bilgilendirme.

***

## Hazır Bileşen Durum Metinleri

- SafetyNotice:
    - “İçerik daha uygun hale getirildi.”
- ErrorState:
    - “Bir sorun oluştu. Lütfen tekrar deneyin.”
- TTSControls:
    - “Tarayıcı TTS desteklemiyor.”

***

## Teslim Kriterleri (UI Tamamlama)

- Mobil ve masaüstü uyumlu.
- Kontrast ve klavye erişimi doğrulandı.
- Skeleton ve yükleniyor durumları mevcut.
- TTS paneli tüm durumlarda doğru geri bildirim veriyor.
- Güvenlik mesajları yalnızca gerektiğinde görünüyor.
- Hata ekranı her akışta tutarlı.

***

Bu tasarım, mimari kararlarla uyumlu biçimde düşük maliyetli, güvenli ve hızlı bir MVP arayüzü sağlar. Bir sonraki adım olarak Tasks.md ile görevleri, kabul kriterlerini ve önceliklendirmeyi netleştirebiliriz. Hazır olduğunda onu da üretebilirim.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

