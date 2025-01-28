import React from 'react';
import { Link } from 'react-router-dom';

const MemoryPage = () => {
  return (
    <div className="memory-page">
      <header className="page-header">
        <Link to="/" className="back-button">
          ← Ana Sayfaya Dön
        </Link>
        <h1>Bellek ve Hipokampus</h1>
      </header>
      
      <main className="page-content">
        <section className="info-section">
          <h2>Hipokampus ve Bellek İlişkisi</h2>
          <p>
            Hipokampus, beynin temporal lobunda bulunan ve bellek oluşumunda 
            kritik rol oynayan bir yapıdır. Özellikle uzun süreli belleğin 
            oluşturulmasında ve mekansal öğrenmede önemli görevler üstlenir.
          </p>
          
          <h3>Temel Fonksiyonları</h3>
          <ul>
            <li>Yeni anıların oluşturulması</li>
            <li>Mekansal navigasyon</li>
            <li>Duygusal bellek</li>
            <li>Öğrenme süreçleri</li>
          </ul>
        </section>

        <section className="visual-section">
          <img 
            src="/images/hippocampus.jpg" 
            alt="Hipokampus yapısı"
            className="section-image"
          />
        </section>
      </main>
    </div>
  );
};

export default MemoryPage; 