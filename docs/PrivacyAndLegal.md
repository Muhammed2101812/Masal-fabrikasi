<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# PrivacyAndLegal.md

## Amaç ve Kapsam

Bu doküman, uygulamanın gizlilik, veri işleme, hukuki sorumluluk, telif ve içerik moderasyonu ilkelerini tanımlar. Hedef: çocuklara yönelik güvenli deneyim, PII toplamayan mimari, şeffaf bilgilendirme ve düşük maliyetli bir MVP’de uygulanabilir kontroller.

***

## İlkeler

- Gizlilik-öncelikli: Hesap yok, kalıcı veri saklama yok, PII isteme/işleme yok.
- Şeffaflık: Kullanıcıya net ve sade dille bilgilendirme.
- Asgari veri: Sadece zorunlu teknik metrikler; içerik ve prompt’lar loglanmaz.
- Çocuk güvenliği: Yaşa uygunluk ve zararlı içeriklerden kaçınma.
- Uyumluluk: Yasal gerekliliklere makul ölçüde uyum; gerektikçe güncelleme.

***

## Kapsam Dışı

- Hukuki danışmanlık sağlamaz; gereksinimler yasal uzmanla gözden geçirilmelidir.
- Bölgesel mevzuat farklılıkları (KVKK/GDPR/COPPA vb.) için nihai yorum içermez; temel prensipleri uygular.

***

## Veri Yaşam Döngüsü

Veri Türleri

- Kullanıcı girişi (prompt): Sadece istek anında işlenir, kalıcı kaydedilmez.
- Üretilen hikaye metni: Yanıt olarak gönderilir, kalıcı kaydedilmez.
- Kapak görsel parametreleri: Kategori/şekil; kişisel veri içermez.
- Teknik metrikler: Zaman damgası, yanıt süresi, hata kodu. IP anonimleştirilmiş veya hiç kaydedilmez.

Saklama

- Kalıcı veritabanı yok.
- Sunucu loglarında PII yok; içerik ve prompt metni loglanmaz.
- Hata ayıklamada geçici bellek kullanımı istek ömrü ile sınırlıdır.

İşleme

- Veri yalnızca hikaye üretimi ve görsel oluşturma amacıyla, istek süresince işlenir.
- Analitik varsayılan olarak kapalıdır; açılırsa PII’siz, toplu ve anonim istatistikler kullanılır.

Silme

- Kalıcı saklama olmadığı için silme talepleri tipik olarak gereksizdir; yine de iletişim kanalı üzerinden talepler alınır ve doğrulanır.

***

## Çocuklara Yönelik Koruma

- PII talebi yok: Ad, adres, iletişim bilgisi, okul vb. istenmez.
- UI uyarısı: “Kişisel bilgi paylaşmayın.”
- İçerik güvenliği: Yaşa uygun dil ve ton; şiddet/nefret/korku/cinsellik/tehlike yok.
- Ebeveyn gözetimi: “Ebeveyn gözetiminde kullanım” uyarısı görünür.
- Geri bildirim kanalı: Uygunsuz içerik şüphesi için hızlı bildirim (e-posta/feedback formu) opsiyonel.

***

## Kullanıcı Hakları ve Tercihler

- Bilgilendirme: Ana sayfada kısa gizlilik özeti; detaylı dokümana bağlantı.
- Onay/ret: Analitik açılırsa, çerez/izleme onayı açık ve reddedilebilir.
- Erişim/düzeltme/silme: Kalıcı veri tutulmadığından tipik olarak uygulanamaz; yine de iletişim kanalı ile talepler değerlendirilir.

***

## Üçüncü Taraflar ve Aktarımlar

- Barındırma: Vercel (Hobby) — uygulama ve statik varlıklar.
- TTS: Tarayıcı içi; sunucuya ses verisi gönderilmez.
- AI metin üretimi: Model sağlayıcısına yalnızca üretim için zorunlu metin gönderilir; PII içermez.
- Aktarım ilkesi: Yalnızca hizmet sunumu için; veri minimizasyonu ve gerekli güvenlik önlemleri ile.

Not: Kullanılan üçüncü tarafların gizlilik ve kullanım şartları düzenli kontrol edilmeli; değişikliklerde politika güncellenmelidir.

***

## Güvenlik Önlemleri

- İletişim güvenliği: HTTPS zorunlu.
- Başlıklar: Güvenli varsayılanlar (CSP önerisi, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Frame-Ancestors).
- Giriş doğrulama: Yaş/kategori/uzunluk whitelist; prompt uzunluk sınırları.
- Oran sınırlama: Basit rate limit; maliyet koruması ve kötüye kullanım önleme.
- Operasyonel: Gizli anahtarlar ortam değişkenlerinde; erişim rolleri minimal.

***

## İçerik Moderasyonu ve İtiraz

- Önleme: Sistem yönergesi ile yaşa uygun üretim.
- Sonrası denetim: Anahtar kelime/ifade filtresi; ihlalde yumuşatma/yeniden üretim.
- Bildirim: “İçerik daha uygun hale getirildi.” mesajı.
- İtiraz/rapor: Uygunsuz içerik şikayetleri için iletişim adresi; hızlı değerlendirme ve gerekirse geçici kısıtlama.

***

## Telif ve Kullanım Hakları

- Üretilen içerik: Kullanıcı kendi kişisel kullanımında özgürdür; ticari kullanım koşulları model sağlayıcı ve barındırma koşulları ile sınırlanabilir.
- Görseller: SVG placeholder’lar dahili üretimdir; telif sorunu yoktur.
- Üçüncü taraf şartları: Model sağlayıcısı ve barındırma platformu kullanım şartlarına uyum zorunludur.
- Marka/Logo: Uygulama markası ve görsel kimlik üzerindeki haklar saklıdır.

Öneri: Açık lisans (ör. MIT) kod için düşünülebilir; içerik ve marka ayrı değerlendirilmeli.

***

## Yasal Uyarılar ve Sorumluluk Reddi

- Eğitim/öneri niteliği: Üretilen hikayeler bilgilendirme ve eğlence amaçlıdır; profesyonel tavsiye değildir.
- Ebeveyn sorumluluğu: Küçüklerin kullanımında ebeveyn gözetimi önerilir.
- İçerik garantisi yok: Filtrelere rağmen nadir sapmalar mümkün olabilir; geri bildirim ile düzeltme süreci çalıştırılır.
- Hizmetin kesilmesi: Ücretsiz kotaların aşılması veya bakım durumlarında hizmet geçici olarak durdurulabilir.

***

## Çerezler ve İzleme

- Varsayılan: Çerez ve izleme yok.
- İleride analitik: Privacy-first, PII’siz, çerezsiz seçenekler tercih edilir.
- Onay: Analitik/çerez etkinleştirilirse açık onay akışı sağlanır; reddetme seçeneği belirgin.

***

## Politikaların Gösterimi

- Kısa gizlilik bildirimi: Ana sayfada, basit ve anlaşılır 2–3 cümle.
- Ayrıntılı sayfalar: Privacy \& Terms ayrı sayfalar (MVP’de tek sayfa da olabilir).
- Dil: Türkçe; gerekirse İngilizce sürüm eklenir.

Örnek kısa metin:
“Bu uygulama hesap oluşturmaz ve kişisel verilerinizi kalıcı olarak saklamaz. İçerikler yalnızca istek sırasında üretilir ve çocuklara uygun güvenli bir dil hedeflenir. Daha fazla bilgi için Gizlilik \& Koşullar sayfasına göz atın.”

***

## Olay Yönetimi ve İhlal Bildirimi

- Şüpheli durum: İçerik filtre kaçakları veya teknik ihlal şüphesi.
- Aksiyonlar:
    - Hızlı kapatma anahtarı ile üretim durdurma.
    - Filtre listesinin güncellenmesi ve ek oran sınırlaması.
    - Gerekirse kısa bakım modu bilgilendirmesi.
- Bildirim: PII işlenmediğinden kişisel ihlal bildirimi tipik olarak gerekmez; yine de şeffaflık adına “değişiklik günlüğü” ile duyuru yapılabilir.

***

## Saklama ve Silme Politikaları

- Kalıcı saklama yok: Prompt ve çıktı metinleri kalıcı olarak tutulmaz.
- Log saklama: Yalnızca anonim teknik metrikler; makul kısa süre (örn. 7–30 gün).
- Yedekler: Kalıcı içerik olmadığı için kapsam dışı; platform log yedekleri PII içermez.

***

## Değişiklikler ve Bildirim

- Sürümleme: Changelog ile önemli değişiklikler not edilir.
- Bildirim: Önemli değişikliklerde ana sayfada kısa duyuru.
- Tarih damgası: Gizlilik ve koşullar dokümanında son güncelleme tarihi yer alır.

***

## İletişim

- Geri bildirim/şikayet: Uygunsuz içerik raporu ve gizlilik soruları için e-posta/iletişim formu (MVP’de opsiyonel, belirtildiğinde aktif).
- Yasal talepler: Yetkili makam talepleri usule uygun şekilde değerlendirilir; kalıcı veri olmadığı için kapsam sınırlıdır.

***

## Uygulanabilirlik ve Yol Haritası

- MVP: PII yok, anonim log, temel güvenlik başlıkları, yaşa uygun filtreler, kısa politika metinleri.
- Faz 2: Privacy-first analitik, ayrık Terms/Privacy sayfaları, çok dilli metinler.
- Faz 3: Premium TTS/kişiselleştirme eklenirse, veri kapsamı ve onay akışları yeniden gözden geçirilir.

***

Bu politika, sıfıra yakın bütçeyle çalışan bir MVP’de çocuk güvenliği, gizlilik ve şeffaflık dengesini sağlar. Üçüncü taraf koşulları ve yerel mevzuat değişiklikleri karşısında düzenli gözden geçirme önerilir.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

