<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# PromptEngineering.md

## Amaç ve Kapsam

Bu doküman, çocuklara uygun Türkçe hikaye üretimi için uçtan uca prompt stratejisini, şablonları, değişkenleri, güvenlik eklerini ve yeniden üretim/yumuşatma akışlarını tanımlar. Hedef: yaş/kategori/uzunluk sinyallerinden yüksek uyum, güvenli ve istikrarlı metin kalitesi.

***

## İlkeler ve Hedefler

- Belirgin talimatlar: Yaş, kategori ve uzunluk hedefleri sistem mesajında açık ve ölçülebilir şekilde yer almalı.
- Güvenlik birincil: Model öncesi (instruction) ve sonrası (post-check) korumalar birlikte çalışır.
- Kısa ve net: Gereksiz bağlam yok; modelin odaklanması için yalın yönergeler.
- Determinizm artışı: Kısa, hiyerarşik talimatlar + örnekler ile sapmaları azaltma.
- Türkçe ve kültürel uyum: Dil seviyesi ve içerik referansları Türkçe’ye göre kalibre edilir.

***

## Parametreler ve Değişkenler

- ageRange: '3-5' | '6-8' | '9-12'
- category: 'uyku öncesi' | 'macera' | 'eğitici' | 'masalsı'
- length: 'kısa' | 'orta' | 'uzun'
- userPrompt: Kullanıcı bağlamı (tema/karakter/yer/öğe)
- wordTarget: Yaşa ve length’e göre dinamik hedef:
    - 3–5: 150–300
    - 6–8: 300–600
    - 9–12: 600–900
    - kısa/orta/uzun seçimiyle birlikte hesaplanır (küçük yaşta aşağı yönlü ayar).

***

## Sistem Mesajı (Ana Şablon)

Amaç: Modelin sınırlarını ve hedeflerini en baştan sabitlemek. Aşağıdaki şablon, değişkenler doldurularak kullanılır.

Şablon:
“Türk kültürüne uygun, {ageRange} yaş için güvenli bir {category} hikayesi yaz. Şiddet, nefret, cinsellik, korku ve tehlikeli davranışlar kesinlikle yok. Yaşa uygun sözcükler ve net, kısa cümleler kullan. Başlık ver. {length} uzunlukta, toplam {wordTargetMin}–{wordTargetMax} kelime aralığında 3–6 paragraf üret. Bölümleme yapma. Öğretici modüller ve soru-cevap ekleme. Belirsizlikte güvenli alternatifi seç ve pozitif bir sonla bitir.”

Notlar:

- {wordTargetMin}/{wordTargetMax} yaş ve length kombinasyonundan türetilir.
- “Öğretici modüller ekleme” ifadesi, eğitici kategoride bile didaktik bloklar yerine doğal kırıntılarla anlatımı teşvik eder.
- “Pozitif son” özellikle uyku öncesi ve küçük yaşlar için vurgulanır.

***

## Kullanıcı Bağlamı Ekleme (Context Merge)

Amaç: Kullanıcının verdiği tema/karakter/yer bilgilerinin güvenli çerçevede değerlendirilmesi.

Şablon (kısa ek blok):
“Kullanıcı bağlamı: {userPrompt}. Bu bağlamı, güvenli ve yaşa uygun biçimde kullan. Uygunsuz veya korkutucu ifadeler varsa güvenli alternatifini tercih et.”

Kurallar:

- userPrompt normalize edilir (trim, whitespace sadeleştirme, Unicode normalization).
- Çok uzun bağlamlar özetlenir: “Kullanıcı bağlamı özet: …”
- Belirsiz/uygunsuz temalar: “korkutucu” → “heyecanlı ama güvenli”; “tehlikeli eylem” → “denetimli ve güvenli etkinlik.”

***

## Kategoriye Özel İpuçları (Opsiyonel Sinyal Blokları)

- uyku öncesi:
    - “Sakin tempo, yumuşak ve huzurlu final. Korku/kabus çağrışımı yok.”
- macera:
    - “Güvenli keşif ve işbirliği; tehlike romantizasyonu yok; çözüm pozitif.”
- eğitici:
    - “Değerler ve küçük bilgi kırıntıları; ders verir gibi değil, doğal akışta.”
- masalsı:
    - “Pozitif sihir/masal ögeleri; karanlık/ürkütücü unsurlar yok.”

Bu bloklar, sistem mesajının altına kısa 1–2 satır olarak eklenir.

***

## Uzunluk ve Dil Kalibrasyonu

- length: kısa/orta/uzun → hedef kelime aralığına çeviri:
    - kısa: 200–350
    - orta: 350–650
    - uzun: 650–900
- Yaşa göre ayar:
    - 3–5 yaşta aralıklar alt banda doğru daraltılır; cümleler 6–12 kelime.
    - 6–8 yaşta orta aralık; cümleler 8–15 kelime.
    - 9–12 yaşta üst banda yaklaşım; cümleler 10–18 kelime.

Prompt’a ek sinyal:
“Cümle uzunluğunu {ageRange} yaşa uygun tut. Gerektiğinde uzun cümleleri böl.”

***

## Çıktı Yapısı ve Biçim Kuralları

- Başlık: Tek satır, tırnaksız.
- Paragraflar: 3–6 paragraf; her paragraf 2–5 cümle.
- Biçimlendirme: Madde işareti, numaralandırma, alt başlık yok.
- Ton: Sıcak, pozitif, kapsayıcı; kültürel uyumlu; basit sözcükler.
- Son: Olumlu kapanış ve güven telkin eden mesaj.

Prompt eklentisi:
“Yalnızca başlık ve paragrafları döndür. Ek açıklama ve meta bilgi yazma.”

***

## Güvenlik Ekleri (Pre-Generation)

- Sert yasaklar:
“Şiddet, nefret söylemi, cinsel içerik, korku/kabus ögeleri, tehlikeli eylem talimatı/ömürleme yok.”
- Hassas konular:
“Sağlık/psikoloji/din/siyaset gibi hassas konulara girme; gerekirse yüzeysel, nötr ve çocuk odaklı kal.”
- PII uyarısı:
“Kişisel bilgi sorma veya kullanma.”

Bu satırlar sistem mesajının sonuna kısa, maddesiz cümleler halinde eklenir.

***

## Yeniden Üretim ve Yumuşatma Akışı

- Neden tetiklenir?
    - Kelime/ton yaşa uygun değil.
    - Yasaklı/hassas içerik şüphesi (post-check regex).
    - Yapı ihlali (3–6 paragraf değil; başlık eksik).
- Nasıl yapılır?
    - “Yumuşatma promptu” ile, modelin önceki çıktısına referans vermeden yeniden üretim istenir.
    - Daha sıkı talimatlar: “Daha kısa cümleler”, “korku çağrışımlarını çıkar”, “pozitif finali güçlendir”.
- Deneme sayısı:
    - Maks 2 yeniden üretim; sonra güvenli kısa fallback şablonu.

Yumuşatma mikro-şablonu:
“Önceki yönergelere ek: Korku veya tehlike çağrışımı yapan tüm ifadeleri çıkar. Cümleleri kısalt. Pozitif ve güvenli bir finalle bitir. 3–5 paragraf hedefle; {wordTargetMin}–{wordTargetMax} kelime.”

***

## Fallback Kısa Hikaye Şablonu

“Başlık: {pozitif-kısa}
Paragraflar: 3 paragraf; her biri 2–3 cümle; toplam {wordTargetMin}–{wordTargetMid} kelime. Sakin, güvenli, kültürel uyumlu ve neşeli ton. Şiddet/korku yok.”

Kullanım: Yumuşatmada 2 deneme başarısızsa.

***

## Örnek Tam Prompt (Birleştirilmiş)

1) Sistem Mesajı:
“Türk kültürüne uygun, 6–8 yaş için güvenli bir macera hikayesi yaz. Şiddet, nefret, cinsellik, korku ve tehlikeli davranışlar kesinlikle yok. Yaşa uygun sözcükler ve net cümleler kullan. Başlık ver. orta uzunlukta, toplam 350–650 kelime aralığında 3–6 paragraf üret. Bölümleme yapma. Öğretici modüller ve soru-cevap ekleme. Belirsizlikte güvenli alternatifi seç ve pozitif bir sonla bitir.
Macera: Güvenli keşif ve işbirliği; tehlike romantizasyonu yok; çözüm pozitif.
Cümle uzunluğunu 6–8 yaşa uygun tut. Gerektiğinde uzun cümleleri böl.
Kişisel bilgi sorma veya kullanma. Hassas konulara girme; çocuk odaklı ve yüzeysel kal.”
2) Kullanıcı Bağlamı:
“Kullanıcı bağlamı: ‘Deniz kenarında martı ile küçük bir keşif.’ Bu bağlamı güvenli ve yaşa uygun biçimde kullan.”
3) Biçim Kısıtı:
“Yalnızca başlık ve paragrafları döndür; ek açıklama yazma.”

***

## Örnek İnce Ayar İpuçları

- Çok kısa çıktı geldi:
    - “Kelime sayısını {wordTargetMin} üstüne çıkar; 3–6 paragrafı koru.”
- Çok uzun/dağınık:
    - “Kelime sayısını {wordTargetMax} içinde tut; cümleleri kısalt.”
- Fazla soyut/karmaşık:
    - “Somut ve gündelik kavramlar kullan; metaforları azalt.”
- Korku çağrışımları:
    - “Korkutucu sözcükleri pozitif eşdeğerle değiştir; sakin ton koru.”
- TTS uyumsuz uzun cümleler:
    - “Cümleleri 8–15 kelime aralığında tut; virgül zincirlerini böl.”

***

## Prompt Anti-Pattern’leri

- Çok uzun, çok katmanlı talimat listeleri (modelin odağını dağıtır).
- Bir cümlede çok sayıda negatif talimat (pozitif alternatifler daha iyi yönlendirir).
- Çıktı biçimine dair belirsizlik (başlık/paragraf kuralı eksik).
- Konu dışı örnekler (modeli farklı stile çeker).

***

## Test Stratejisi (Prompt Kalitesi)

- Sentetik deneme setleri: Yaş×kategori×uzunluk kombinasyonları için 3–5 örnek.
- Kalite kontrol: Kelime sayısı, paragraf sayısı, yasaklı kelime taraması.
- İnsan değerlendirme: 10–15 örnekte ton, kültürel uyum ve TTS akıcılığı.

***

## Sürdürüm

- Gözden geçirme: Aylık prompt ayarı; kaçaklarda anında sıcak düzeltme.
- Sinyal kütüphanesi: Kategori ve yaşa özel mikrotalimatlar katalogu.
- Bilgi notları: Geri bildirimlere göre “ince ayar ipuçları” listesini güncelle.

***

## Hızlı Başlangıç (Uygulamada Entegre)

- Sistem mesajını şablondan oluştur.
- userPrompt’u normalize edip bağlam bloğuna ekle.
- Yaş+uzunlukla kelime hedeflerini hesapla ve yerleştir.
- Kategori kısa ipucunu ekle.
- Biçim kısıtını (yalnız başlık+paragraf) sonda tekrar et.
- Post-check başarısızsa yumuşatma mikro-şablonuyla yeniden üret; en fazla 2 deneme; sonra kısa fallback.

***

Bu çerçeve, kısa ve kararlı promptlarla yaş/kategori/uzunluk hedeflerine uygun, güvenli ve Türkçe odaklı hikayeler üretmeyi amaçlar. İlerleyen fazlarda kişiselleştirme ve çok dilli desteğe geçerken, aynı sistem şablonuna dil ve kültür blokları eklenerek sürdürülebilirlik korunur.
<span style="display:none">[^1]</span>

<div style="text-align: center">⁂</div>

[^1]: plan.md.md

