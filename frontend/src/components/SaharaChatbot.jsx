import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../api';
import { useTranslation } from '../translations';
import { Heart, Send, X, Shield, PhoneCall } from 'lucide-react';

export default function SaharaChatbot({ lang = 'en', onNavigate, initialOpen = false }) {
  const { t } = useTranslation(lang);
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: t('sahara_intro') || "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a breath. We'll figure out the next step together. What happened?",
      actions: [
        { label: `🚨 ${t('hero_report_btn') || 'Request Emergency Help'}`, action: "report" },
        { label: `🔍 ${t('hero_track_btn') || 'Track Request'} (CARE-2026-101)`, action: "track_code_demo" },
        { label: `ℹ️ ${t('faq_charge_question') || 'Does CareOn charge fees?'}`, action: "fees_faq" },
        { label: `🏥 ${t('faq_categories_question') || 'What are the categories?'}`, action: "cat_faq" },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Update initial welcome message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [
          {
            sender: 'bot',
            text: t('sahara_intro') || "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a breath. We'll figure out the next step together. What happened?",
            actions: [
              { label: `🚨 ${t('hero_report_btn') || 'Request Emergency Help'}`, action: "report" },
              { label: `🔍 ${t('hero_track_btn') || 'Track Request'} (CARE-2026-101)`, action: "track_code_demo" },
              { label: `ℹ️ ${t('faq_charge_question') || 'Does CareOn charge fees?'}`, action: "fees_faq" },
              { label: `🏥 ${t('faq_categories_question') || 'What are the categories?'}`, action: "cat_faq" },
            ],
          },
        ];
      }
      return prev;
    });
  }, [lang, t]);

  // Listen to open-sahara custom event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-sahara', handleOpen);
    return () => window.removeEventListener('open-sahara', handleOpen);
  }, []);

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
          text: t('sahara_offline_reply') || "I'm right here with you. ❤️ I had a brief network glitch, but if this is an urgent emergency, please call 112 or click 'Report an Emergency' right away.",
          actions: [{ label: t('hero_report_btn') || "Request Emergency Help", action: "report" }],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (act) => {
    if (act.action === 'report') {
      onNavigate?.('user_report');
      setIsOpen(false);
    } else if (act.action === 'track_prompt') {
      onNavigate?.('user_track');
      setIsOpen(false);
    } else if (act.action === 'track_code_demo') {
      onNavigate?.('user_track', 'CARE-2026-101');
      setIsOpen(false);
    } else if (act.action === 'track' && act.code) {
      onNavigate?.('user_track', act.code);
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
          className="sahara-fab sahara-bubble-btn"
          onClick={() => setIsOpen(true)}
          title="Chat with Sahara, Emergency Support Companion"
          aria-label="Open Sahara Chat"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
            color: '#ffffff',
            borderRadius: '50px',
            padding: '0.65rem 1.25rem',
            border: 'none',
            boxShadow: '0 8px 20px rgba(13, 148, 136, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 700,
            fontSize: '0.95rem',
            zIndex: 1000
          }}
        >
          <Heart size={18} fill="#ffffff" />
          <span>Sahara</span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#22c55e',
            }}
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="sahara-chat-window"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: 360,
            maxWidth: 'calc(100vw - 2rem)',
            height: 520,
            maxHeight: 'calc(100vh - 3rem)',
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000
          }}
        >
          {/* Header */}
          <div
            className="sahara-header"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
              color: '#ffffff',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={18} fill="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>Sahara</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{t('sahara_tagline') || 'Your caring emergency companion'}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 4 }}
              title="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="sahara-messages"
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: '#f8fafc'
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '8px 10px',
                borderRadius: 8,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              🔒 <strong>{t('safe_companion') || 'Safe Companion'}:</strong> Sahara provides coordination support. For life-threatening emergencies, dial <strong>112</strong> immediately.
            </div>

            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: 12,
                    fontSize: '0.875rem',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    background: m.sender === 'user' ? '#0d9488' : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                    border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  {m.text}
                </div>

                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#0f766e',
                          padding: '4px 10px',
                          borderRadius: 14,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
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
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{t('sahara_typing') || 'Sahara is typing...'}</span>
                <Heart size={12} color="#0d9488" fill="#0d9488" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: 8,
              background: '#ffffff'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ask_sahara_placeholder') || 'Ask Sahara or enter incident code...'}
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                backgroundColor: input.trim() ? '#0d9488' : '#cbd5e1',
                color: '#ffffff',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
