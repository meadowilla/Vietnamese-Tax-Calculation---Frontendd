import { useState } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Nút Chatbot */}
      <div className="chatbot-wrapper">
        <div className="chat-tooltip">💬 Mình có thể giúp gì cho bạn?</div>
        <div className="chatbot-button bounce" onClick={() => setIsOpen(!isOpen)}>
          <img src="..\public\bot2.png" alt="Chatbot" />
        </div>
      </div>

      {/* Hộp chat */}
      {isOpen && (
        <div className="chatbox">
          <div className="chat-header">Chat với chúng tôi</div>
          <div className="chat-body">
            <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;