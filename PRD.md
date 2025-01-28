Product Requirements Document (PRD): Interactive 3D Brain Navigation Website
1. Ürün Özeti

Ürün Adı: NeuroPath Interactive
Hedef Kitle: Nörobilim meraklıları, öğrenciler, araştırmacılar ve eğitim kurumları.
Amaç: Kullanıcıların 3D bir beyin modeli üzerinde belirli nöron bölgelerine tıklayarak ilgili sayfalara yönlendirildiği interaktif bir web deneyimi oluşturmak.
2. Proje Hedefleri

    Ana Hedef: Kullanıcıların 3D beyin modeli üzerinde nöronları tıklayarak bilgiye erişmesini sağlamak.

    İkincil Hedefler:

        Babylon.js kullanarak performans odaklı bir 3D render sistemi kurmak.

        Eğitim amaçlı bir araç olarak kullanılabilirlik sağlamak.

3. Kapsam (Scope)
Dahil Olanlar

    3D beyin modeli (nöronlar ve temel yapılar ile).

    Tıklanabilir nöron bölgeleri ve yönlendirme mantığı.

    Responsive tasarım (masaüstü/mobil uyumluluk).

    Temel UI/UX (yükleme ekranı, geri düğmesi vb.).

Dahil Olmayanlar

    Kullanıcı hesap yönetimi.

    Detaylı nörobilim veritabanı entegrasyonu.

    Offline erişim.

4. Kullanıcı Hikayeleri

    Kullanıcı Olarak:

        "Beynin hipokampus bölgesine tıkladığımda, bellek ile ilgili sayfaya gitmek istiyorum."

        "Mobil cihazdan eriştiğimde 3D modelin düzgün çalışmasını bekliyorum."

    Yönetici Olarak:

        "Nöronların yönlendirdiği sayfaları CMS üzerinden güncelleyebilmek istiyorum."

5. Fonksiyonel Gereksinimler
3D Beyin Modeli

    Görsel Tasarım:

        Gerçekçi veya stilize edilmiş 3D beyin modeli.

        Nöronların belirgin ve tıklanabilir olması.

    Teknik:

        Babylon.js ile optimize edilmiş render.

        GLB/glTF formatında 3D model.

Interaktivite

    Nöron Tıklama:

        Kullanıcı bir nörona tıkladığında onPickTrigger event’i tetiklenecek.

        Tıklanan nöronun ID’sine göre ilgili URL’ye yönlendirme yapılacak.

        Animasyon: Tıklanan nöron hafifçe büyüyerek vurgulanacak.

Yönlendirme Sistemi

    Dinamik URL Yönetimi:

        JSON tabanlı bir yapıda neuron_mappings.json dosyası kullanılacak.

        Örnek JSON yapısı:
        json
        Copy

        {
          "neuron_1": {
            "target_url": "/memory",
            "tooltip_text": "Bellek Mekanizmaları"
          },
          "neuron_2": {
            "target_url": "/learning",
            "tooltip_text": "Öğrenme Süreçleri"
          }
        }

Kullanıcı Arayüzü

    Yükleme Ekranı: 3D model yüklenirken progress bar gösterilecek.

    Ana Sayfa Düğmesi: Her sayfada kullanıcıyı beyin modeline geri götüren bir buton.

6. Teknik Olmayan Gereksinimler

    Performans: 3D modelin <3 saniyede yüklenmesi.

    Tarayıcı Desteği: Chrome, Firefox, Safari ve Edge’in son 2 sürümü.

    Erişilebilirlik: Klavye navigasyonu ve ARIA etiketleri.

7. Teknik Detaylar
Frontend

    3D Render Motoru: Babylon.js

    Ek Kütüphaneler:

        GUI için React.js veya vanilla JS.

        Animasyonlar için GSAP/Animation Library.

    Optimizasyon:

        Model LOD (Level of Detail) ayarları.

        WebGL2 fallback ile performans iyileştirmeleri.

Backend

    Basit API: Nöron URL eşleşmelerini çekmek için statik JSON veya Firebase Realtime DB.

    Hosting: Netlify/Vercel veya AWS S3.

8. Proje Zaman Çizelgesi
Aşama	Süre	Çıktılar
3D Model Hazırlık	2 Hafta	Optimize edilmiş GLB dosyası
Babylon Entegrasyonu	1 Hafta	Temel render ve kamera kontrolleri
Interaktivite	1 Hafta	Tıklama event’leri ve animasyonlar
Test & Deployment	1 Hafta	Cross-browser test ve canlıya alma
9. Riskler ve Çözümler

    Risk: 3D modelin performans sorunları.
    Çözüm: Model poligon sayısı düşürülecek ve LOD kullanılacak.

    Risk: Mobil cihazlarda WebGL desteği.
    Çözüm: Fallback olarak 2D harita gösterilecek.

10. Başarı Metrikleri

    Sayfada geçirilen ortalama süre > 2 dakika.

    Mobil kullanıcıların %85’i sorunsuz deneyim.