import React, { useState } from 'react';
import '../styles/MedexAI.css';
import { callQwenAPI } from '../services/qwenApi';

const MedexAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { type: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await callQwenAPI(inputMessage);
      const aiMessage = {
        type: 'ai',
        content: response.result || 'Üzgünüm, yanıt oluşturulamadı. Lütfen tekrar deneyin.',
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      let errorMessage = 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'API anahtarı geçersiz. Lütfen sistem yöneticisi ile iletişime geçin.';
        } else if (error.response.status === 429) {
          errorMessage = 'Çok fazla istek gönderildi. Lütfen biraz bekleyin ve tekrar deneyin.';
        }
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
      }
      setMessages((prev) => [...prev, { type: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="medex-ai-container">
      {!isOpen ? (
        <button className="medex-ai-button" onClick={() => setIsOpen(true)}>
          MedexAI
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3>MedexAI Asistan</h3>
            <button onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="message ai welcome">Merhaba! Size nasıl yardımcı olabilirim?</div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="message ai loading">Yazıyor...</div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MedexAI;