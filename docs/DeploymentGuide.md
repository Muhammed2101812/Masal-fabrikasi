<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# DeploymentGuide.md

## Amaç ve Kapsam

Bu rehber, uygulamayı yerelde çalıştırmaktan üretime dağıtıma (Vercel) kadar tüm adımları kapsar. Hedef: hızlı, güvenli ve tekrarlanabilir bir dağıtım süreci.

***

## Önkoşullar

- Hesaplar
    - Vercel hesabı (Hobby plan yeterli)
    - Kod deposu (GitHub/GitLab/Bitbucket)
- Yerel ortam
    - Node.js 18+ (öneri: LTS)
    - pnpm veya npm/yarn (öneri: pnpm)
- Gizli anahtarlar
    - GEMINI_API_KEY (zorunlu)

***

## Ortam Değişkenleri

. env.example içeriği (örnek):

- GEMINI_API_KEY=your_key_here
- LOG_LEVEL=info (opsiyonel)
- NODE_ENV=production (otomatik yönetilir)

Kurallar:

- .env.local sadece yerelde kullanılmalı, repoya eklenmemeli.
- Production anahtarları Vercel proje ayarlarında “Environment Variables” altında tanımlanır.
- Anahtar kapsamını en aza indirin; yalnız gerekli izinler.

***

## Proje Kurulumu (Yerel)

1) Depoyu klonlayın

- git clone <repo>
- cd <repo>

2) Bağımlılıkları yükleyin

- pnpm install (veya npm install / yarn)

3) Ortam değişkenlerini ayarlayın

- cp .env.example .env.local
- .env.local içinde GEMINI_API_KEY’i doldurun

4) Geliştirme sunucusu

- pnpm dev
- http://localhost:3000 üzerinde açılır

5) Kontroller

- Lint/typecheck: pnpm lint \&\& pnpm typecheck
- Birim testleri (varsa): pnpm test

***

## Üretim Derleme ve Doğrulama (Yerel)

- Derleme: pnpm build
- Üretim sunucusu: pnpm start
- Hızlı duman testi:
    - Ana sayfa açılıyor mu?
    - /api/generate örnek prompt’a yanıt veriyor mu?
    - /api/cover kategori parametresine göre SVG döndürüyor mu?
    - TTS destekleniyorsa Play/Pause çalışıyor mu?

***

## Vercel’e Dağıtım

1) Vercel Projesi Oluşturma

- “New Project” → deposunuza bağlayın
- Framework: Next.js otomatik algılanır
- Build komutu: varsayılan (next build)
- Output: Next.js varsayılan

2) Ortam Değişkenleri

- Vercel → Project → Settings → Environment Variables
- GEMINI_API_KEY (Production ve Preview)
- LOG_LEVEL (opsiyonel)

3) Rota Çalışma Ortamı

- Route Handlers Node runtime (varsayılan)
- Gerekirse edge kullanımından kaçın (model SDK uyumluluğu için)

4) Build ve Deploy

- İlk deploy otomatik tetiklenir (main/master branch)
- Başarılıysa Production URL aktif olur

5) Domain (Opsiyonel)

- Vercel → Domains → Add
- DNS yönlendirme adımlarını izleyin
- HTTPS sertifikası otomatik sağlanır

***

## Güvenlik ve HTTP Başlıkları

Önerilen başlıklar (Vercel/Next entegrasyonu ile headers):

- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
- X-Frame-Options veya Frame-Ancestors (CSP içinde): sameorigin
- Content-Security-Policy (özet yaklaşım):
    - default-src 'self';
    - script-src 'self' 'unsafe-inline' vercel-insights domains (gerekirse);
    - connect-src 'self' api domains;
    - img-src 'self' data:;
    - style-src 'self' 'unsafe-inline';
    - frame-ancestors 'self';
Not: CSP katılaştırılırken App Router ve inline stil gereksinimleri dikkate alınmalı.

CORS:

- Tek origin stratejisi (production domain)
- API route’larda yalnızca gerekli origin’e izin

***

## Performans Ayarları

- Statik varlıklar: Vercel CDN otomatik
- Görsel endpoint: SVG üretimi hafif tutulur; cache başlıkları:
    - Cache-Control: public, max-age=86400, immutable
    - ETag: parametre hash’ine dayalı
- JS ayak izi: gereksiz bağımlılıkları azaltın; bileşenleri bölün
- Lighthouse kontrolleri: Performans ve Erişilebilirlik 90+ hedef

***

## Gözlemlenebilirlik (PII’siz)

- Minimal metrikler:
    - İstek sayısı, ortalama yanıt süresi, hata oranı
- Log politikası:
    - Prompt ve çıktı metni loglanmaz
    - IP loglama yapılmaz veya anonimleştirilir
- Olay düzeyi:
    - error, warn, info (LOG_LEVEL ile kontrol)

***

## Rate Limit ve Maliyet Koruması (Opsiyonel)

- Basit kural:
    - IP/oturum başına X istek/10dk
- Tek aktif üretim kilidi:
    - UI tarafında aynı anda bir üretim
- Token bütçesi:
    - Kelime hedefi +%20 güvenlik payı
- Aşımda mesaj:
    - Kibar uyarı ve “daha sonra tekrar deneyin”

***

## QA Kontrol Listesi (Yayın Öncesi)

- Fonksiyonel
    - Seçenekler → Prompt → Üretim → Sonuç akışı çalışıyor mu?
    - “Tekrar üret” ve “Metni kopyala” butonları işliyor mu?
- Güvenlik
    - Riskli prompt’ta yumuşatma tetikleniyor mu?
    - “Daha uygun sürüm” bildirimi görünüyor mu?
- TTS
    - Play/Pause/Stop; TTS yoksa uyarı var mı?
- Görsel
    - /api/cover doğru SVG ve cache başlıkları ile dönüyor mu?
- A11y
    - Klavye navigasyonu, odak halkası, ARIA live bölgeleri
    - Kontrast AA
- Performans
    - İlk yük ve yanıt süresi hedef aralıkta
- Hata ve Dayanıklılık
    - Ağ hatasında ErrorState ve “Tekrar dene”
- Gizlilik
    - PII uyarısı UI’da
    - Gizlilik kısa metni görünür

***

## Yayın Sonrası İzleme

- Erken Uyarılar
    - Hata oranı artarsa: geçici throttling ve bakım modu
- Filtre Kaçakları
    - Negatif örnek setini güncelle; regex iyileştir
- Kullanıcı Geri Bildirimi
    - TTS hız/ton, metin uzunluğu, temalar

***

## Sürümleme ve Geri Alma

- Sürümleme
    - 0.x geliştirme; Changelog kayıtları
- Hızlı geri alma (rollback)
    - PR tabanlı dağıtım; önceki başarılı build’e dön
- Kapatma anahtarı
    - Üretimi anlık durdurmak için feature flag veya geçici bakım sayfası

***

## Sorun Giderme (Sık Karşılaşılanlar)

- 500 /api/generate
    - GEMINI_API_KEY var mı, geçerli mi?
    - Zaman aşımı: kelime hedefini düşür, tekrar dene
- 404 /api/cover
    - Query parametreleri (category, shape) doğru mu?
- TTS çalışmıyor
    - Tarayıcı desteği? voiceschanged olayı dinleniyor mu?
    - Ses listesi boşsa bilgilendirici mesaj gösteriliyor mu?
- CSP ihlali
    - Raporu kontrol et; script/style kaynaklarını CSP’ye ekle
- Yavaş ilk yük
    - Büyük bağımlılıkları gözden geçir; bileşenleri parça parça yükle

***

## Rollout Stratejisi

- Light beta
    - Sınırlı kullanıcı ile 3–7 gün
    - Geri bildirim: güvenlik mesajı anlaşılırlığı, TTS kullanım oranı
- Hızlı düzeltmeler
    - Prompt ve regex güncellemeleri; yeniden dağıtım
- Stabil sürüm
    - Faz 2 işlerine geçmeden borçların kapatılması

***

## Dokümantasyon ve Bilgilendirme

- README: kurulum, çalışma, deploy, ortam değişkenleri
- Architecture.md, Design.md, SecurityAndSafety.md güncel
- Privacy \& Terms kısa metinleri ana sayfada görünür
- Changelog: her release için özet

***

## Son Kontrol Listesi (Go/No-Go)

- [ ] Production ortam değişkenleri tanımlı (GEMINI_API_KEY)
- [ ] API’ler ve TTS temel akışları geçti
- [ ] Güvenlik yumuşatma akışı çalışıyor
- [ ] SVG kapaklar <20KB ve cache/ETag ile servis ediliyor
- [ ] A11y ve performans raporları kabul edilebilir
- [ ] Gizlilik metinleri ve PII uyarısı görünür
- [ ] Rollback planı hazır

***

Bu rehber ile MVP, Vercel üzerinde düşük maliyetle güvenli ve hızlı şekilde yayınlanabilir. İlerleyen sürümlerde premium TTS, OG görselleri ve çok dilli destek eklenirken aynı dağıtım iskeleti sürdürülebilir.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

