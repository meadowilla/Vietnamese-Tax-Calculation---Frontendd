import { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn về thuế?' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch('http://localhost:3000/auth/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();

      const botMessage = { from: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { from: 'bot', text: '❌ Xin lỗi, có lỗi kết nối với máy chủ.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      setInput('');
    }
  };

  function parseMessageWithLinks(text) {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    return text.replace(
      emailRegex,
      '<a href="mailto:$1" style="color:#00653e; text-decoration:underline;">$1</a>'
    );
  }

  return (
    <>
      <div className="chatbot-wrapper">
        <div className="chat-tooltip">💬 Mình có thể giúp gì cho bạn?</div>
        <div className="chatbot-button bounce" onClick={() => setIsOpen(!isOpen)}>
          <img src="..\public\bot2.png" alt="Chatbot" />
        </div>
      </div>

      {isOpen && (
        <div className="chatbox">
          <div className="chat-header">💬 Tư vấn thuế</div>
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <p
                key={idx}
                style={{
                  textAlign: msg.from === 'user' ? 'right' : 'left',
                  margin: '8px 0',
                  backgroundColor: msg.from === 'user' ? '#e6f7ff' : '#f0f0f0',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  maxWidth: '85%',
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
                dangerouslySetInnerHTML={{
                  __html: `<strong>${msg.from === 'user' ? 'Bạn' : 'Bot'}:</strong> ${
                    msg.from === 'bot' ? parseMessageWithLinks(msg.text) : msg.text
                  }`
                }}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '10px', borderTop: '1px solid #ccc', display: 'flex' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập tin nhắn về thuế..."
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              disabled={isSending}
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              style={{
                marginLeft: '8px',
                padding: '10px 16px',
                backgroundColor: isSending ? '#ccc' : '#00653e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSending ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              {isSending ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
