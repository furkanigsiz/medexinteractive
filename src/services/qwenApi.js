import axios from 'axios';
import companyInfo from '../data/company_info.json';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const callQwenAPI = async (prompt, maxTokens = 150) => {
  try {
    console.log('İstek gönderiliyor:', { prompt });

    // Şirket bilgilerinden context oluştur
    const context = `
      Şirket Adı: ${companyInfo.company_name}
      Hakkımızda: ${companyInfo.about_us}
      Kuruluş Yılı: ${companyInfo.founding_year}
      Merkez: ${companyInfo.headquarters.city}, ${companyInfo.headquarters.district}
      Sektör: ${companyInfo.industry}
      Şirket Türü: ${companyInfo.type}
      Çalışan Sayısı: ${companyInfo.size}
      Website: ${companyInfo.website}

      Hizmetlerimiz:
      ${companyInfo.services.map(service => `- ${service.name}: ${service.description}`).join('\n')}

      İletişim Bilgileri:
      - E-posta: ${companyInfo.contact_info.email}
      - Telefon: ${companyInfo.contact_info.phone}
      - Adres: ${companyInfo.contact_info.address}
      - LinkedIn: ${companyInfo.social_media.linkedin}

      Sık Sorulan Sorular:
      ${companyInfo.faq.map(faq => `Soru: ${faq.question}\nCevap: ${faq.answer}`).join('\n\n')}
    `;

    const response = await axios.post(`${BASE_URL}/chat/completions`, {
      model: "qwen-turbo",
      messages: [
        {
          role: "system",
          content: `Sen MEDEX SMO'nun resmi AI asistanısın. Kullanıcı sorduğu sorulara yalnızca aşağıdaki bilgilere göre yanıt vermelisin:

${context}

Önemli Kurallar:
1. Sadece yukarıdaki bilgileri kullanarak yanıt ver
2. Bu bilgiler dışında bir şey sorulursa "Bu konuda bilgi veremem." de
3. Her zaman nazik ve profesyonel ol
4. Yanıtların kısa ve öz olsun
5. Şirket bilgilerini doğru ve eksiksiz aktar
6. Tıbbi konularda genel bilgiler yerine şirketin verdiği hizmetlere odaklan`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices[0].message) {
      const answer = response.data.choices[0].message.content;

      // Yanıtı kontrol et
      const isRelevant = checkRelevance(answer);

      if (isRelevant) {
        return {
          result: answer
        };
      } else {
        return {
          result: "Bu konuda bilgi veremem."
        };
      }
    } else {
      throw new Error('Beklenmeyen API yanıt formatı');
    }
  } catch (error) {
    console.error('API Hatası:', error);
    if (error.response) {
      console.error('API Yanıt Detayı:', error.response.data);
    }
    throw error;
  }
};

// Yanıtı kontrol etmek için yardımcı fonksiyon
function checkRelevance(answer) {
  // Şirket bilgilerinden anahtar kelimeleri otomatik oluştur
  const relevantKeywords = [
    companyInfo.company_name,
    companyInfo.about_us,
    companyInfo.industry,
    companyInfo.type,
    companyInfo.size,
    companyInfo.website,
    companyInfo.headquarters.city,
    companyInfo.headquarters.district,
    ...companyInfo.services.map(service => service.name),
    ...companyInfo.services.map(service => service.description),
    companyInfo.contact_info.email,
    companyInfo.contact_info.phone,
    companyInfo.contact_info.address,
    companyInfo.social_media.linkedin,
    ...companyInfo.faq.map(faq => faq.question),
    ...companyInfo.faq.map(faq => faq.answer),
    // Ek anahtar kelimeler
    "araştırma",
    "sağlık",
    "CRO",
    "klinik",
    "hasta",
    "tedavi",
    "ilaç",
    "çalışma",
    "SMO",
    "site",
    "yönetim",
    "hizmet"
  ];

  // Yanıtta en az bir anahtar kelime var mı kontrol et
  return relevantKeywords.some(keyword => 
    answer.toLowerCase().includes(
      keyword.toString().toLowerCase()
    )
  );
}