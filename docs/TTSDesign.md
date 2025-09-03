<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# TTSDesign.md

## Amaç ve Kapsam

Bu doküman, uygulamadaki metin-okuma (Text-to-Speech) deneyiminin uçtan uca tasarımını, teknik kararlarını, kullanıcı etkileşimlerini, erişilebilirlik ve güvenlik gereksinimlerini tanımlar. Hedefler: tarayıcı içi, ücretsiz, düşük gecikmeli, Türkçe odaklı ve çocuklara uygun doğal bir okuma.

***

## Hedefler ve İlkeler

- Doğal akış: Paragraf bazlı okuma, cümle sonlarında duraklama.
- Türkçe desteği: tr-TR locale önceliği, kadın/erkek sesi için makul eşleştirme.
- Basit kontrol: Oynat/Durdur/Devam et, hız seçimi (0.8/1.0/1.2).
- Düşük maliyet: Tarayıcı yerleşik TTS; sunucu maliyeti yok.
- Erişilebilirlik: Klavye ve ekran okuyucu uyumluluğu; net durum geri bildirimleri.
- Güvenlik: PII içermeyen, güvenli ve yaşa uygun içerik okuması.

***

## Mimari Genel Bakış

- İstemci tarafı TTS:
    - Tarayıcı TTS (speechSynthesis) üzerinden ses listesi enumerate edilir.
    - Seçilen ses ve hız ile paragraf bazlı okuma yönetilir.
- Uygulama katmanı:
    - TTSControls bileşeni: ses/hız seçimi, Play/Pause/Stop.
    - tts yardımcıları: ses seçimi mantığı, okuma kuyruğu, durum yönetimi.

***

## Kullanıcı Akışı

1) İçerik üretildiğinde TTSControls görünür.
2) Kullanıcı ses ve hız seçer (varsayılan: “Kadın” benzeri bir ses, hız 1.0).
3) Play’e basıldığında paragraflar sırayla okunur.
4) Durdur/Pause ile akış kontrol edilir; tekrar başlatılabilir.
5) Hikaye değiştiğinde önceki okuma durdurulur, kuyruk sıfırlanır.

***

## Bileşen Sözleşmesi (TTSControls)

Props (öneri):

- supported: boolean
- availableVoices: { id: string; label: string; gender?: 'male'|'female'|'unknown'; locale: string }[]
- selected: { voiceId?: string; gender?: 'male'|'female'; rate: 0.8|1.0|1.2 }
- onChange(nextSelected)
- onPlay()
- onPause()
- onStop?()

Durumlar:

- supported=false → “Tarayıcı TTS desteklemiyor.” uyarısı ve kontroller devre dışı.
- playing, paused, idle.

***

## Ses Keşfi ve Seçimi

- Ses listesi:
    - Uygulama açılışında ve “voiceschanged” olayında sesler alınır.
    - Filtre: locale tr-TR öncelikli; bulunamazsa tr, sonra yakın diller (ör. az, kk) kesin fallback değil; en yakın Türkçe benzeri sesler denenir.
- Cinsiyet eşlemesi:
    - Tarayıcı ses objelerinde cinsiyet her zaman gelmeyebilir; isim/deskripsiyon heuristics (örn. “female”, “male”, “woman”, “man”, “kadın”, “erkek” anahtarları) ile tahmin edilir.
    - Kullanıcı “Kadın/Erkek” tercihi bir niyet ifadesi olarak değerlendirilir; garanti edilmez. UI metni bilgilendirici olmalı: “Seçilen ses, tercihinize en yakın eşleşmedir.”
- Varsayılan seçim:
    - İlk tr-TR ses ve kadın benzeri eşleşme; yoksa ilk tr-TR; o da yoksa liste ilk eleman.

***

## Hız (Rate) ve Prosodi

- Hız değerleri: 0.8 (yavaş), 1.0 (normal), 1.2 (hızlı).
- Tonlama:
    - Cümle sonu (., !, ?) doğal duraklama sağlar.
    - Uzun cümlelerde virgül/semi-kolon sonrası mikro duraksamalar tarayıcıya bırakılır.
- Yaşa göre öneri:
    - 3–5 yaş: 0.8–1.0 daha uygun.
    - 6–8 yaş: 1.0 varsayılan.
    - 9–12 yaş: 1.0–1.2 tolere edilebilir.

***

## Okuma Kuyruğu ve Senkronizasyon

- Paragraf bazlı:
    - Her paragraf için ayrı utterance oluşturulur.
    - Sıra: paragraphs[0..n] → tek tek okunur.
- Durum yönetimi:
    - Play: sıradaki paragrafı başlat, bittiğinde otomatik sonraki.
    - Pause: aktif utterance duraklatılır (destek varsa); Stop: tüm kuyruk temizlenir.
    - Hikaye değişirse: mevcut okuma stop ve kuyruk reset.
- Olaylar:
    - onstart, onend, onerror ile UI güncellenir (playing/idle).
- Kenar durumlar:
    - Çok kısa paragraflar: tek utterance olarak kalır.
    - Çok uzun paragraflar: opsiyonel cümle bazlı bölme (gerekirse geliştirme fazında).

***

## Metin Ön İşleme (TTS İçin)

- HTML/Markdown temizliği: yalnız düz metin.
- Paragraf bölme: “\n\n” ile ayrılan bloklar; boş paragraflar atlanır.
- Cümle sınırları: Nokta, soru, ünlem; TTS doğal duraklama kullanır.
- Noktalama düzeltme:
    - Çoklu ünlem/soru işaretlerini sadeleştir (ör. “!!!” → “!”).
    - Aşırı emojileri sınırlı tut; okunabilirliği bozar.

***

## Erişilebilirlik (A11y)

- Klavye:
    - Space/Enter: Play/Pause (odak TTSControls üzerindeyken).
    - Esc: Stop (opsiyonel).
    - Tab sırası: Seçimler → Play/Pause → Stop.
- ARIA:
    - Play/Pause toggle için aria-pressed.
    - Canlı durum: “okuma başladı/bitti” için aria-live=polite kısa metin.
- Kontrast ve hedef alan:
    - Butonlar yeterli boyut ve kontrastta.

***

## Hata Yönetimi ve Geri Bildirim

- TTS desteklenmiyor:
    - Mesaj: “Tarayıcı TTS desteklemiyor.” + “Metni kopyala” alternatifi.
- Ses listesi boş:
    - Mesaj: “Kullanılabilir ses bulunamadı.”; Play devre dışı.
- Okuma hatası (onerror):
    - Kısa mesaj ve yeniden dene önerisi; gerekirse bir sonraki paragrafa geç.
- Çakışma:
    - Aynı anda ikinci Play basılırsa mevcut akışa devam edilir veya yeniden başlatma opsiyonu sunulur (ayarlarla belirlenir).

***

## Performans ve Kaynak Kullanımı

- Hafiflik:
    - Sunucuya ek yük yok; yalnızca istemci TTS.
- Uzun metinler:
    - Paragraflar tek tek okunur; paragraflar arası 150–250ms bekleme (akışı doğal hissettirmek için opsiyonel).
- Bellek:
    - Utterance nesneleri paragraf bittiğinde serbest bırakılır.

***

## Güvenlik ve Gizlilik

- PII:
    - TTS metni yalnızca istemci bellekte; sunucuya geri gönderilmez.
- Çocuk güvenliği:
    - TTS, post-filter’den geçmiş güvenli metni okur.
- İzinler:
    - Ek mikrofon/medya izni gerektirmez; yalnızca ses sentezi.

***

## UI Metinleri (Öneri)

- “Ses”
- “Hız”
- “Yavaş / Normal / Hızlı”
- “Oynat / Durdur”
- Destek yok: “Tarayıcı TTS desteklemiyor.”
- Ses seçimi notu: “Seçilen ses, tercihinize en yakın eşleşmedir.”

***

## API Tasarımı (İç Bileşen)

Yardımcı fonksiyonlar (öneri imzalar):

- getVoices(): Promise<VoiceInfo[]>
- pickVoice(voices, { gender, locale }): VoiceInfo | undefined
- speakParagraphs(textBlocks: string[], options: { voice: Voice; rate: number; onStart?; onEnd?; onError? }): Controller
- Controller API:
    - play(), pause(), resume(), stop()
    - state: 'idle'|'playing'|'paused'

Not: Tarayıcıya göre pause/resume davranışı farklılık gösterebilir; gerekirse stop+kaldığı yerden tekrar başlat fallback’i uygulanır.

***

## Test Stratejisi

- Birim:
    - Ses filtreleme ve seçim heuristics.
    - Metin ön işleme (paragraf/cümle bölme).
- Entegrasyon:
    - Play → okuma başlar, paragraf sıralaması korunur.
    - Pause/Resume/Stop geçişleri stabil.
    - Ses listesi değiştiğinde UI güncellenir (voiceschanged).
- Manuel:
    - Chrome, Edge, Safari, Android Chrome üzerinde temel senaryolar.
    - Türkçe ses mevcudiyetine göre fallback doğrulaması.

***

## Kenar Durumları

- Çok kısa hikaye: TTS yine çalışır; tek paragraf olabilir.
- Çok uzun cümleler: İleride cümle bazlı bölme eklenecek.
- Ses değiştirirken oynatma açık: Yeni ses bir sonraki paragraftan devreye girer veya kullanıcıya “yeniden başlat” seçeneği sunulur.
- Hız değişimi:
    - Anında uygulamak mümkün değilse (tarayıcıya göre), bir sonraki paragrafta devreye alınır.

***

## Geliştirme Yol Haritası

- Faz 1 (MVP):
    - tr-TR odaklı ses seçimi, hız 0.8/1.0/1.2, Play/Pause, paragraf kuyruğu.
- Faz 2:
    - Cümle bazlı bölme, vurgu/tonlama ipuçları (SSML benzeri sade kurallar, destek varsa).
- Faz 3:
    - Premium TTS (bulut tabanlı, karakter sesleri), kişiselleştirilmiş ses profilleri.

***

## Kabul Kriterleri

- TTS destekleyen tarayıcılarda 3–6 paragraf akıcı şekilde okunur.
- Ses ve hız değişimi kullanılabilir; en az bir Türkçe sesle çalışır.
- TTS desteklenmiyorsa kullanıcı kibarca bilgilendirilir.
- Play/Pause/Stop durumları UI’da net yansıtılır; odak ve klavye kontrolü çalışır.

***

Bu tasarım, maliyetsiz ve tarayıcı içi TTS ile tutarlı, çocuklara uygun bir okuma deneyimi sağlar. İlerleyen fazlarda premium TTS ve SSML benzeri geliştirmeler eklenebilir.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

