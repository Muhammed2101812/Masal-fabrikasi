<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# qwen-rules.md

Bu dosya, projeyi Qwen ile geliştirirken tutarlı, güvenli, performanslı ve kolay bakım yapılabilir bir çalışma biçimi sağlamayı amaçlar. Tüm kurallar Türkçe hazırlanmıştır ve Qwen’den gelen/üretilen tüm içerikler varsayılan olarak Türkçe olmalıdır.

## Genel İlkeler

- Her zaman Türkçe yanıt ver.
- MVP odağı: Basit, güvenli, hızlı ve düşük maliyetli.
- Çocuk güvenliği: Yaşa uygun dil ve pozitif anlatım birincil öncelik.
- Gizlilik-öncelikli: Kalıcı veri yok; PII isteme/işleme yok.
- Şeffaflık: Hatalarda kısa ve anlaşılır geri bildirim; teknik detaylar log’lara sızdırılmaz.


## Kullanım Biçimi ve Sınırlar

- Qwen’i şu amaçlarla kullan:
    - Prompt şablonlarının üretilmesi ve iyileştirilmesi.
    - Güvenli alternatif metin üretimi (yumuşatma).
    - UI mikro kopya önerileri (Türkçe, kısa ve sade).
- Şu amaçlarla kullanma:
    - PII işleme, saklama, paylaşma.
    - Üretimi doğrudan log’lama veya veritabanına yazma (MVP’de kalıcı depolama yok).


## Dil, Ton ve İçerik Kuralları

- Dil: Sade, net, çocuk dostu.
- Ton: Sıcak, güvenli, pozitif; didaktik olmayan “nazik öğretici”.
- Sınırlar:
    - Yasaklı: şiddet, nefret, cinsellik, korku/kabus, tehlikeli davranış talimatı.
    - Hassas: sağlık/din/siyaset — mümkün olduğunca kaçın; gerekirse yüzeysel ve nötr kal.
- Yapı: Başlık + 3–6 paragraf; her paragraf 2–5 cümle.


## Prompt Mühendisliği Kuralları (Qwen Özel)

- Sistem mesajı mutlaka içersin:
    - Yaş/kategori/uzunluk talimatları.
    - Güvenlik yasakları ve “belirsizlikte güvenli alternatif” kuralı.
    - “Yalnızca başlık ve paragraflar” biçim kısıtı.
- Parametreler:
    - ageRange: '3-5' | '6-8' | '9-12'
    - category: 'uyku öncesi' | 'macera' | 'eğitici' | 'masalsı'
    - length: 'kısa' | 'orta' | 'uzun'
    - wordTarget: yaş+uzunluğa göre aralık (3–5:150–300, 6–8:300–600, 9–12:600–900; kısa/orta/uzun eşlemesi: 200–350/350–650/650–900)
- Kullanıcı bağlamı:
    - Normalize et (trim/Unicode).
    - Aşırı uzunsa özetle; uygunsuz ifadeleri güvenli eşdeğerle yumuşat.
- Kategori ipuçları:
    - Uyku: sakin tempo, huzurlu final.
    - Macera: güvenli keşif, işbirliği, tehlike romantizasyonu yok.
    - Eğitici: doğal bilgi kırıntıları; ders verir gibi değil.
    - Masalsı: pozitif sihir; karanlık/korku öğeleri yok.

Örnek sistem şablonu (özet):
“Türk kültürüne uygun, {ageRange} yaş için güvenli bir {category} hikayesi yaz. Şiddet, nefret, cinsellik, korku ve tehlikeli davranışlar kesinlikle yok. Başlık ver. {length} uzunlukta, {wordTargetMin}–{wordTargetMax} kelime aralığında 3–6 paragraf üret. Bölümleme yapma, soru-cevap ve öğretici modüller ekleme. Belirsizlikte güvenli alternatifi seç ve pozitif sonla bitir. Yalnızca başlık ve paragrafları döndür.”

## Yumuşatma ve Yeniden Üretim

- Tetikleyiciler:
    - Yasaklı içerik şüphesi (regex).
    - Yapı ihlali (başlık/paragraf sayısı/kelime bandı).
    - Yaşa uygunluk sapması (cümle uzunluğu, kelime karmaşıklığı).
- Akış:
    - İlk üretim sonrası post-check → uygunsuzsa yumuşatma promptu ile yeniden üret.
    - Maks 2 deneme; başarısızsa kısa güvenli fallback şablonu.
- UI:
    - “İçerik daha uygun hale getirildi.” mesajını yalnızca gerektiğinde göster.


## TTS Uyumu (Qwen’in Ürettiği Metin İçin)

- Cümleleri 8–15 kelime bandında tut (yaşa göre kısalabilir).
- Noktalama doğal duraklama sağlar; çoklu ünlem/soru işaretinden kaçın.
- Paragraflar arası akış net; diyaloglar kısa ve anlaşılır.


## Qwen Yanıt Formatı

- Varsayılan: Sadece “Başlık” satırı ve onu izleyen 3–6 paragraf.
- Meta bilgi, liste, alt başlık veya markdown biçimleme yok.
- Kod blokları ve JSON üretme: Yalnız geliştirici açıkça isterse.


## Güvenlik ve Gizlilik

- PII: Ad, adres, telefon, okul vb. verileri kullanma/üretme.
- Log: Prompt/çıktı metni loglama; yalnızca anonim teknik metrikler (istek sayısı, süre, hata).
- Model çağrıları: Gerekli minimum bağlam gönder; kullanıcı metnini kısalt/özetle.


## Test ve Doğrulama (Qwen Çıktıları)

- Birim: Kelime sayısı, paragraf sayısı, yasaklı kelime taraması.
- Kalite: Ton, yaşa uygunluk, kategori ipuçları ile uyum.
- TTS: Paragraf/cümle yapısı akıcı okuma sağlıyor mu?
- Negatif set: Şiddet/korku/tehlike terimleri → yumuşatma sonrası temiz çıktı.


## Qwen İçin İyi İstem Örnekleri

1) Standart hikaye:
“6–8 yaş, macera, orta uzunluk; kelime hedefi 350–650. Tema: ‘Deniz kıyısında martı ile küçük bir keşif.’ Yukarıdaki güvenlik ve biçim kurallarına sıkı uy. Yalnızca başlık ve paragrafları döndür.”
2) Yumuşatma tekrarı:
“Önceki kurallara ek: korku veya tehlike çağrışımlarını tamamen çıkar; cümleleri kısalt; pozitif sonu güçlendir. 3–5 paragraf, {wordMin}–{wordMax} kelime.”
3) Kısa fallback:
“3–5 yaş, uyku öncesi, kısa; 150–260 kelime. Huzurlu ton, basit sözcükler. Başlık + 3 paragraf.”

## İstem Anti-Pattern’leri

- Çok uzun, birbiriyle çelişen talimatlar.
- Sadece negatif talimatlar (yapma/yasakla); pozitif alternatifle dengele.
- Biçim belirsizliği (başlık/paragraf kuralı yoksa sapma artar).
- Uygunsuz tema örnekleri (modeli istenmeyen stile çeker).


## Entegrasyon Kuralları

- lib/gemini.ts yerine Qwen istemcisi kullanılıyorsa:
    - Wrapper oluştur: lib/qwen.ts (tek sorumluluk; timeout, hata yönetimi).
    - Ortam değişkeni: QWEN_API_KEY (DeploymentGuide yönergeleriyle aynı disiplin).
- API sözleşmeleri değişmez:
    - POST /api/generate → { title, paragraphs[], wordCount, safety }
- Post-check ve sanitize akışı değişmez:
    - lib/safety.ts ile ortak kullan.


## Performans ve Maliyet

- Token hedefi: Kelime hedefi +%20 güvenlik payı.
- Zaman aşımı: Mantıklı üst limit; uzun isteklerde kısa fallback’a dön.
- Tek aktif üretim kilidi (UI); rate limit opsiyonel.


## tasks.md Güncelleme Kuralı

- Qwen’den görevleri ilerletmesini istediğinde:
    - Tamamlanan her görevin önüne “[x]” koysun.
    - Devam eden/planned görevler “[ ]” ile kalsın.
    - Değişiklik sonrası kısa “Değişiklik özeti” eklesin.
- Örnek:
    - [x] app/api/generate/route.ts — input doğrulama ve model çağrısı
    - [ ] app/api/cover/route.ts — SVG üretimi (kategori/shape)
Değişiklik özeti: generate endpoint happy-path testleri eklendi.


## Hata Yönetimi

- Model hatası/timeout:
    - Kısa kullanıcı mesajı; yeniden dene seçeneği.
    - Gerekirse kısa güvenli fallback hikayesi üret.
- Yapı ihlali:
    - Yeniden üretim; 2 deneme sonrası fallback.
- Güvenlik ihlali:
    - Yumuşatma promptu; UI’da “daha uygun sürüm” bilgisi.


## Hızlı Kontrol Listesi

- [ ] Yanıt Türkçe mi?
- [ ] Başlık + 3–6 paragraf kuralları uygulandı mı?
- [ ] Yaş/kategori/uzunluk ve kelime hedefi tutarlı mı?
- [ ] Yasaklı içerik yok; gerekirse yumuşatma uygulandı mı?
- [ ] TTS uyumlu cümle/paragraf yapısı var mı?
- [ ] tasks.md’de “[x]” işaretleri doğru güncellendi mi? (Qwen görev güncellemesi istendiyse)

Bu kurallar, Qwen ile üretken, güvenli ve sürdürülebilir bir içerik/akış geliştirme süreci için çerçeve sunar. Değişiklik önerileri PR ile sunulmalı ve Changelog.md’de kayda geçirilmelidir.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

