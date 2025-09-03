<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ImageStrategy.md

## Amaç ve Kapsam

Bu doküman, MVP’de kapak görsellerinin nasıl üretileceğini, hangi durumlarda hangi yaklaşımın seçileceğini, teknik detayları, performans, erişilebilirlik ve güvenlik gereksinimlerini tanımlar. Hedef: sıfıra yakın maliyetle, tutarlı ve çocuk dostu tek kapak görseli.

***

## Hedefler ve İlkeler

- Sıfır maliyet: Sunucu/üçüncü parti ücret oluşmadan görsel üretimi.
- Tutarlı estetik: Kategoriye göre renk/ikon dili; sade, pozitif, korkutucu olmayan formlar.
- Hız ve hafiflik: SVG tabanlı, metin boyutuna göre dinamik fakat önbelleklenebilir.
- Erişilebilirlik: Anlamlı alt metin, yeterli kontrast, dekoratifse doğru işaretleme.
- Gizlilik: Üretimde kullanıcı içeriği veya PII görsele gömülmez.

***

## Yaklaşım Seçimi

MVP’de Seçenek A (SVG Placeholder) tercih edilir. İleride Seçenek B (ücretsiz jenerasyon) opsiyonel olarak eklenebilir.

- Seçenek A: Kategori tabanlı SVG placeholder
    - Artılar: Ücretsiz, deterministik, hızlı, min boyut.
    - Eksiler: Foto-gerçekçi/illüstratif zenginlik sınırlı.
- Seçenek B: Ücretsiz jenerasyon (ileride)
    - Artılar: Daha zengin görsellik.
    - Eksiler: Değişken kalite/süre; gizlilik ve lisans kontrolü gerekir.

***

## Görsel Özellikleri

- Boyut/format:
    - Kare: 1024×1024
    - Geniş: 1200×630 (Open Graph uyumu)
    - Format: SVG (öncelik), gerektiğinde otomatik PNG dönüşümü istemci tarafı yapılmaz; OG için sunucu tarafında sabit bir PNG de hazır bulundurulabilir (opsiyonel).
- Renk ve ikon dili:
    - Uyku öncesi: Pastel mor/mavi, ay-yıldız/uyku bulutu ikonografisi.
    - Macera: Canlı turuncu/yeşil, basit pusula/harita/roket ikonografisi.
    - Eğitici: Pastel mavi/yeşil, kitap/ampul/çark ikonografisi.
    - Masalsı: Pembe/lila/altın sarısı, sihirli değnek/yıldız/kalp ikonografisi.
- Kompozisyon:
    - Arka plan: Düz veya yumuşak degrade.
    - İkon: Ortalanmış, 64–128px stroke kalınlığına uygun sade form.
    - Dekoratif motifler: 2–4 küçük, düşük opaklıkta şekil (yıldız, nokta, bulut).

***

## API Tasarımı

- GET /api/cover
    - Query:
        - category: uyku|macera|egitici|masalsi
        - shape: square|wide (varsayılan square)
        - theme?: light|dark (opsiyonel, varsayılan light)
    - Response:
        - Content-Type: image/svg+xml; charset=utf-8
        - Deteministik SVG
- Determinizm:
    - Aynı parametrelerle aynı SVG üretilir (renk ve ikon seçimleri sabit eşleme ile).

***

## Teknik Tasarım (SVG Üretimi)

- Renk eşleme örneği:
    - uyku: bg \#EAEAFE → fg \#5B6CF0
    - macera: bg \#FFF1E6 → fg \#FF8A4C
    - egitici: bg \#E8F7EE → fg \#33B07A
    - masalsı: bg \#F7EAFE → fg \#A55BFF
- Geçiş (gradient):
    - Opsiyonel linearGradient id’si, açık ton → doygun ton.
- İkon seti:
    - Basit path/shape’ler: ay (crescent), yıldız, kitap, ampul, pusula, değnek.
    - Her kategori 1 ana ikon + 2-3 küçük dekor.
- Güvenli alan ve responsive:
    - viewBox: 0 0 1200 630 veya 0 0 1024 1024
    - İkon boyutu: min(width,height)*0.28–0.34
    - Dekorlar: köşelere 0.1–0.2 ölçekli.

***

## Erişilebilirlik

- Alt metin:
    - Eğer görsel bilgi taşıyorsa: “{kategori} hikayesi için kapak görseli, {ikon adı}.”
    - Eğer yalnızca dekoratif ise: role="img" olmadan, aria-hidden="true" veya img alt="".
- Kontrast:
    - İkon/foreground ile arka plan arasında yeterli kontrast (en az 3:1; ideal 4.5:1).

***

## İçerik Güvenliği

- Yasak çağrışımlar:
    - Silah, tehdit, karanlık/korku objeleri yok.
- Metin gömme yok:
    - Kullanıcı prompt’u veya çocuk ismi görsele yazılmaz.
- Telif:
    - Tüm şekiller basit geometriler ve kendi üretimimiz; lisans sorunu yaratmaz.

***

## Performans ve Önbellekleme

- HTTP cache:
    - Cache-Control: public, max-age=86400 (1 gün), immutable
- ETag:
    - Parametre hash’ine göre ETag; aynı istek tekrarında 304 döner.
- Boyut:
    - SVG hedef <5KB–15KB aralığı (kare formda). Dekor sayısı ve path karmaşıklığı sınırlı tutulur.

***

## Tema ve Karanlık Mod

- Query param “theme=dark” seçilirse:
    - Arka plan koyu ton (ör. \#1C2330), ikon açık ton (ör. \#DDE3F0).
    - Dekorların opaklığı düşürülür (0.15–0.25).
- Uygulama, kullanıcının sistem temasına göre paramı aktarabilir.

***

## Genişletme Planı (Seçenek B)

- Ücretsiz jenerasyon sağlayıcıları (ileride):
    - Belirli kota/ücret sınırı olmadan çalışan basit görsel üretim uç noktaları varsa, yalnız kategori+tema kelimeleriyle 1 kare görsel denenebilir.
- Denetim:
    - Üretilen görsel model-sonrası kontrol: korku/şiddet/kötü çağrışımlar regex/etiket taraması (varsa basit heuristikler).
- Gizlilik:
    - Giden prompt’larda PII yok; yalnız “kategori ve pozitif sıfat havuzu”.
- Fallback:
    - Model başarısızsa hemen SVG placeholder’a dön.

***

## UI Entegrasyonu

- StoryView:
    - Kapak alanı container, object-fit: cover; kare veya 1200×630 varyantını seçer.
    - Lazy loading (loading="lazy") ve width/height attribute’ları ile layout shift önlenir.
- Skeleton:
    - Görsel yüklenene kadar sade blok skeleti.
- Hata:
    - Görsel endpoint 4xx/5xx ise default yerel SVG/PNG fallback.

***

## Test Stratejisi

- Snapshot:
    - Aynı parametrelerle aynı SVG çıktısı (deterministik test).
- Erişilebilirlik:
    - Alt metin/doğru işaretleme.
- Performans:
    - SVG boyutu eşik altı; Lighthouse görsel optimizasyon uyarısı yok.
- İçerik:
    - Renk/ikon kategorisi eşleşmesi; yasak çağrışım yok.

***

## Kabul Kriterleri

- /api/cover aynı parametre için her zaman aynı SVG’yi üretir.
- Dört kategori için ayırt edilebilir, çocuk dostu ikon ve renk paleti kullanılır.
- Görsel 1200×630 ve 1024×1024 varyantlarında bozulmadan ölçeklenir.
- Erişilebilirlik: Alt metin doğru; dekoratif seçenekte boş alt veya aria-hidden uygulanır.
- Performans: SVG tek istekle <20KB; cache ve ETag çalışır.
- Hata/fallback akışı: Endpoint başarısız olduğunda varsayılan yerel görsel gösterilir.

***

## Örnek Parametre–Eşleme (Özet)

- uyku (square):
    - bg: \#EAEAFE → \#D6D6FA gradient
    - fg: \#5B6CF0
    - ikon: ay + küçük yıldızlar
- macera (square):
    - bg: \#FFF1E6 → \#FFE1CC
    - fg: \#FF8A4C
    - ikon: pusula + küçük nokta motifleri
- egitici (square):
    - bg: \#E8F7EE → \#D3EEDF
    - fg: \#33B07A
    - ikon: kitap/ampul
- masalsı (square):
    - bg: \#F7EAFE → \#EAD7FD
    - fg: \#A55BFF
    - ikon: sihirli değnek + yıldız tozu

***

## Uygulama Notları

- İkon path’leri basit ve el yapımı tutulur; karmaşık SVG import’ları gereksiz.
- Renk token’ları constants/ui.ts içinde tanımlanır; API bu sabitleri kullanır.
- OG Image:
    - İlk sürümde meta og:image olarak statik bir PNG kullanılabilir.
    - Daha sonra SEO için kategoriye göre SSR OG görsel üreten bir route eklenebilir (performans etkisi dikkate alınarak).

***

Bu strateji, MVP’de hızlı, güvenli ve maliyetsiz kapak görselleri sunarken ileride daha zengin görsel deneyimlere sorunsuz geçişi destekler.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

