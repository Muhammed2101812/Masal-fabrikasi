<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# SecurityAndSafety.md

## Amaç ve Kapsam

Bu doküman, çocuklar ve ebeveynler için Türkçe hikaye üreten uygulamanın güvenlik, içerik emniyeti, gizlilik ve operasyonel koruma ilkelerini tanımlar. Hedefler: yaşa uygun ve güvenli içerik, PII toplamaz yapı, düşük maliyetli ama etkili korumalar, şeffaf kullanıcı bilgilendirmesi.

***

## Güvenlik İlkeleri (Üst Düzey)

- Çocuk odaklı koruma: Yaş gruplarına uygun dil, pozitif ve güvenli anlatım.
- Önleyici yaklaşım: Model öncesi yönergeler + model sonrası içerik denetimi.
- Gizlilik-öncelikli: Hesap yok, PII toplamama, minimal anonim log.
- Savunma derinliği: İstemci, API ve model katmanlarında çok katmanlı koruma.
- Şeffaflık: “Daha uygun sürüm üretildi” gibi net bildirimler.

***

## Tehdit Modeli (Özet)

- Uygunsuz içerik riski: Şiddet, nefret, cinsel içerik, korku/karanlık temalar, tehlikeli davranışların olumlanması.
- Kötüye kullanım: Tetikleyici prompt’lar, filtre atlatma denemeleri (obfuscation, slang).
- PII sızıntısı: Kullanıcı metninde kişisel bilgi paylaşımı.
- Servis kötüye kullanımı: Aşırı istek, maliyet artırıcı saldırılar.
- Tarayıcı farklılıkları: TTS ses listesi/okuma sorunlarının güveni zedelemesi.
- Operasyonel risk: Loglarda hassas içerik birikimi.

***

## Yaşa Uygunluk Politikası

- 3–5 yaş: 150–300 kelime; kısa, somut; şiddet/korku yok; basit sözcükler.
- 6–8 yaş: 300–600 kelime; temel betimleme; pozitif ve güvenli kurgular.
- 9–12 yaş: 600–900 kelime; zengin ama güvenli anlatım; risk romantizasyonu yok.
- Kategoriler:
    - Uyku öncesi: Sakin tempo, yumuşak son.
    - Macera: Güvenli keşif; tehlikeli davranışı özendirme yok.
    - Eğitici: Değerler ve küçük bilgi kırıntıları; didaktik aşırılık yok.
    - Masalsı: Pozitif; karanlık/ürkütücü ögeler yok.

***

## İçerik Güvenliği Kuralları

- Yasaklar: Şiddet, nefret söylemi, cinsellik, korku/kabus unsurları, uyuşturucu/alkol/tütün, kendine/başkasına zarar, tehlikeli davranış talimatı veya olumlaması.
- Hassas konular: Sağlık/psikoloji/ideoloji/din/siyaset; mümkün olduğunca nötr ve yüzeysel, çocuk odaklı pozitif çerçeve.
- Dil ve ton: Nazik, güvenli, kültürel olarak uyumlu; hakaret, aşağılayıcı ifadeler yok.
- Görselleştirme: Kapak görselleri korkutucu veya rahatsız edici semboller içermez.

***

## Model Öncesi (Pre-Generation) Koruma

- Sistem yönergesi:
    - Yaş/kategori/uzunluk kuralları açıkça belirtilir.
    - “Şiddet, nefret, cinsel içerik, korku ve tehlikeli davranışlar yok” ifadesi zorunlu.
    - Belirsizlikte güvenli alternatif üret talimatı.
- Prompt birleştirme:
    - Kullanıcı girdisi normalize edilir (lowercase, trim, unicode normalization).
    - Uygunsuz çağrışımları yumuşatan re-writing (örn. “korkunç” → “heyecanlı ama güvenli”).
    - Uzunluk hedefi ve dil seviyesi açıkça verilir.
- Parametre korumaları:
    - Yaş/kategori/uzunluk yalnızca izin verilen değer setinden seçilir.
    - Hedef token/kelime sayısı sınırları net iletilir.

***

## Model Sonrası (Post-Generation) Denetim

- Anahtar kelime/ifade filtreleri:
    - TR odaklı yasaklı ve riskli kelime listeleri (regex).
    - Leetspeak/slang/obfuscation varyantları için genişletilmiş kalıplar.
- Yumuşatma ve yeniden üretim:
    - İhlal şüphesinde: output sanitize → güvenli varyant için model yeniden çağrılır.
    - Maksimum N deneme (örn. N=2). Başarısızsa güvenli fallback kısa hikaye.
- Kullanıcı bildirimi:
    - “İçerik daha uygun hale getirildi.” mesajı, detayları ifşa etmeden.

***

## PII ve Gizlilik

- PII toplama: Form alanları PII istemez; kullanıcıya yönlendirici ipucu (ör. “Kişisel bilgileri yazmayın.”).
- Depolama: Kalıcı veritabanı yok; yalnızca runtime üretim; istemci tarafı state.
- Loglama:
    - Minimal, anonim (timestamp, latency, hata kodu).
    - İçerik ve prompt metni loglanmaz.
    - IP doğrudan loglanmaz; Vercel edge metrikleri harici PII kabul edilmez.
- Çerezler: Gereksiz çerez yok; analitik başlangıçta kapalı.

***

## İstek Oranı ve Maliyet Koruması

- UI düzeyinde tek aktif üretim kilidi.
- Basit oran sınırlama (IP/oturum başına): Örn. 10 istek/10dk (konfigüre).
- Girdi boyutu sınırı: Prompt max uzunluk (örn. 500–1,000 karakter).
- Çıktı boyutu hedefi: Hedef uzunluk +%20 güvenlik payı.

***

## API Güvenliği

- Giriş doğrulama: Yaş/kategori/uzunluk değerleri whitelist; prompt tip ve uzunluk kontrolü.
- Yanıt şekli: Şemalı JSON; beklenmeyen alan yok.
- HTTP güvenliği:
    - Yalnızca HTTPS.
    - Uygun CORS politikası (tek origin).
    - Güvenli başlıklar: X-Content-Type-Options, X-Frame-Options/Frame-Ancestors, Referrer-Policy, Permissions-Policy.
- Hata mesajları: İç ayrıntıları sızdırmayan, kısa ve kullanıcı-dostu.

***

## Tarayıcı ve TTS Güvenliği

- Özellik denetimi: speechSynthesis desteği yoksa açık uyarı.
- Ses listesi ayıklama: yalnızca güvenilir locale (tr-TR) ve yakın eşleşmeler; “erkek/kadın” yönlendirmesi bilgilendirici, garanti değil.
- Oturum kontrolü: Play/Pause/Stop durumları arası tutarlı geçiş, kilitlenme önleme.
- Kaynak tüketimi: Uzun hikayelerde paragraflar arası kısa bekleme ile akıcı okuma, tarayıcı kilitlenmesini azaltma.

***

## UI/İçerik Güvenliği Desenleri

- Boş prompt ve aşırı uzun prompt uyarısı.
- Uygunsuz içerik şüphesi: Yumuşatılmış sürüm üretildi bildirimi.
- PII uyarısı: “Kişisel bilgi paylaşmayın.”
- Hata/yeniden deneme: Kibar ve kısa mesaj, tekrar dene butonu.

***

## Moderasyon Listeleri ve Regex Stratejisi

- Kategori bazlı listeler:
    - Şiddet/zarar: fiziksel şiddet terimleri, silah adları, kendine zarar.
    - Yetişkin/zorbalık: cinsel ifadeler, aşağılama, küfür.
    - Korku/karanlık: kabus, canavar, dehşet; çocukları ürkütecek betimler.
    - Tehlikeli davranış: riskli eylem talimatları, deney/kimyasal yönergeler.
- Yaklaşımlar:
    - Unicode ve diakritik varyantları normalize et.
    - Kelime sınırları ve kök-eşleme (TR ekleri için basit varyantlar).
    - Yanlış-pozitifleri azaltmak için bağlam kısa penceresi (örn. 3–5 kelime komşuluğu).
- Sürdürüm:
    - Negatif test seti ile periyodik gözden geçirme.
    - Üretimde yakalanan sınır vakalarıyla liste zenginleştirme (içerik kaydetmeden).

***

## Operasyonel Güvenlik

- Ortam değişkenleri: Sadece gerekli anahtarlar (Gemini API); .env örneği ve CI’de secret yönetimi.
- Bağımlılıklar: Güvenli sürümler, SCA (dependabot) ve düzenli güncelleme.
- Gözlemlenebilirlik: PII içermeyen metrikler (istek sayısı, ort. yanıt süresi, hata oranı).
- Olay müdahalesi:
    - İçerik şikayeti akışı (MVP’de iletişim e-postası/feedback butonu opsiyonel).
    - Geçici throttling/kapama switch’i (feature flag).

***

## Uyumluluk ve Yasal Notlar

- Gizlilik bildirimi: PII toplamadığımız, verilerin kalıcı saklanmadığı açıkça belirtilir.
- Sorumluluk: “Ebeveyn gözetiminde kullanım” uyarısı görünür.
- Telif ve kullanım: Üretilen içeriğin kullanım hakkı; model sağlayıcı koşullarıyla uyum.
- Çocuklara yönelik içerik: Yaş uygunluğu ve zararlı içeriklerin önlenmesi temel taahhüt.

***

## Test ve Doğrulama

- Birim testler: safety.ts regex ve normalizasyon fonksiyonları.
- Entegrasyon testleri: riskli prompt → yumuşatma → güvenli çıktı.
- E2E testleri: UI uyarıları, hatalar ve yeniden deneme.
- Manuel doğrulama: Farklı yaş/kategori kombinasyonlarında örnek set.

***

## Eskalasyon ve Geri Alma Planı

- Hızlı kapatma anahtarı: Model üretimini geçici durduran güvenli mod (maintenance mesajı).
- Oranlar arttığında: Geçici daha sıkı rate limit.
- Filtre kaçağı şüphesinde: Liste güncellemesi ve sıcak fix, ardından yeniden test.

***

## Versiyonlama ve Sürdürüm

- Changelog: Güvenlik listesi değişiklikleri ve TTS davranış güncellemeleri not edilir.
- Periyodik denetim: Aylık filtre gözden geçirme, test seti güncelleme.
- Geri bildirim döngüsü: Ebeveynlerden gelen geri dönüşlerle iyileştirme.

***

## Örnek Uygulama Kontrolleri (Checklist)

- [ ] Sistem yönergesi yaş/kategori/uzunluk + güvenlik bloklarını içeriyor.
- [ ] Prompt normalize ediliyor; PII uyarısı gösteriliyor.
- [ ] Post-generation regex taraması aktif; sanitizeAndRegenerate akışı çalışıyor.
- [ ] UI “daha uygun sürüm” bildirimi yalnızca gerektiğinde görünüyor.
- [ ] Loglar anonim; prompt/çıktı metni loglanmıyor.
- [ ] CORS, HTTPS ve güvenli başlıklar etkin.
- [ ] Rate limit ve tek aktif üretim kilidi açık.
- [ ] TTS desteği yoksa kullanıcı kibarca bilgilendiriliyor.
- [ ] E2E testte riskli promptlar güvenli sonuca yönlendiriliyor.

***

Bu güvenlik ve emniyet çerçevesi, düşük maliyetli bir MVP’de dahi çocuklara uygun, güvenilir ve gizliliğe saygılı bir deneyim sunmayı hedefler. İlerleyen fazlarda liste/regex’lerin istatistiksel izleme ile güçlendirilmesi, premium TTS ve kişiselleştirme özellikleri eklenirken aynı ilkeler korunmalıdır.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

