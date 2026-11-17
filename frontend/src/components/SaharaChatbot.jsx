import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../api';
import { translations } from '../translations';

export default function SaharaChatbot({ lang = 'en', onNavigate, initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a breath. We'll figure out the next step together. What happened?",
      actions: [
        { label: "🚨 Request Emergency Help", action: "report" },
        { label: "🔍 Track Request (CARE-2026-101)", action: "track_code_demo" },
        { label: "ℹ️ Does CareOn charge fees?", action: "fees_faq" },
        { label: "🏥 What are the categories?", action: "cat_faq" },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply,
          actions: data.suggested_actions,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm right here with you. ❤️ I had a brief network glitch, but if this is an urgent emergency, please call 112 or click 'Request Emergency Help' right away.",
          actions: [{ label: "Request Emergency Help", action: "report" }],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (act) => {
    if (act.action === 'report') {
      onNavigate?.('report');
      setIsOpen(false);
    } else if (act.action === 'track_prompt') {
      onNavigate?.('track');
      setIsOpen(false);
    } else if (act.action === 'track' && act.code) {
      onNavigate?.('track', act.code);
      setIsOpen(false);
    } else if (act.action === 'call_112') {
      window.location.href = 'tel:112';
    } else {
      handleSend(act.label);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="sahara-fab"
          onClick={() => setIsOpen(true)}
          title="Chat with Sahara, Emergency Support Companion"
          aria-label="Open Sahara Chat"
        >
          <span style={{ fontSize: '18px' }}>❤️</span>
          <span>Sahara</span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
            }}
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="sahara-chat-window">
          {/* Header */}
          <div className="sahara-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                ❤️
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', lineHeight: 1.1 }}>Sahara</div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>Your caring emergency companion</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ color: '#ffffff', fontSize: '18px', padding: '4px 8px' }}
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="sahara-messages">
            <div
              style={{
                fontSize: '11px',
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '8px 10px',
                borderRadius: '6px',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              🔒 <strong>Safe Companion:</strong> Sahara cannot provide clinical diagnosis. For life-threatening emergencies, always dial <strong>112</strong> immediately.
            </div>

            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  className={`chat-bubble ${m.sender === 'bot' ? 'bubble-bot' : 'bubble-user'}`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {m.text}
                </div>

                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#0f4c5c',
                          padding: '5px 10px',
                          borderRadius: '16px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble bubble-bot" style={{ fontStyle: 'italic', color: '#64748b' }}>
                Sahara is typing... ❤️
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            className="sahara-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sahara or enter incident code..."
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                padding: '8px 14px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                backgroundColor: input.trim() ? '#0f4c5c' : '#cbd5e1',
                color: '#ffffff',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}
