import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getStoredUserSession, getStoredAdminSession } from '../api';
import { useTranslation } from '../translations';
import { Heart, Send, X, Shield, PhoneCall, Mic, MicOff } from 'lucide-react';

function getPersonalizedGreeting(userName, lang, t) {
  if (userName && userName.trim()) {
    const name = userName.trim();
    if (lang === 'hi') {
      return `नमस्ते ${name}! ❤️ मैं सहारा हूँ, आपकी आपातकालीन सहायता साथी। एक गहरी सांस लें। हम मिलकर अगला कदम तय करेंगे। क्या हुआ है?`;
    }
    if (lang === 'kn') {
      return `ನಮಸ್ಕಾರ ${name}! ❤️ ನಾನು ಸಹಾರಾ, ನಿಮ್ಮ ತುರ್ತು ಆರೈಕೆ ಒಡನಾಡಿ. ಆಳವಾದ ಉಸಿರು ತೆಗೆದುಕೊಳ್ಳಿ. ನಾವು ಒಟ್ಟಾಗಿ ಮುಂದಿನ ಹಂತವನ್ನು ನಿರ್ಧರಿಸುತ್ತೇವೆ. ಏನಾಯಿತು?`;
    }
    return `Hey ${name}! ❤️ I'm Sahara, your caring emergency support companion. Take a breath. We'll figure out the next step together. What happened?`;
  }
  return t('sahara_intro') || "Hey there! ❤️ I'm Sahara, your caring emergency support companion. Take a breath. We'll figure out the next step together. What happened?";
}

export default function SaharaChatbot({ lang = 'en', onNavigate, initialOpen = false }) {
  const { t } = useTranslation(lang);
  const [isOpen, setIsOpen] = useState(initialOpen);

  // Detect logged in user for personalized greetings
  const currentUser = getStoredUserSession() || getStoredAdminSession();
  const userName = currentUser?.full_name || currentUser?.name || null;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: getPersonalizedGreeting(userName, lang, t),
      actions: [
        { label: `🚨 ${t('hero_report_btn') || 'Request Emergency Help'}`, action: "report" },
        { label: `🔍 ${t('hero_track_btn') || 'Track Request'} (CARE-2026-101)`, action: "track_code" },
        { label: `ℹ️ ${t('faq_charge_question') || 'Does CareOn charge fees?'}`, action: "fees_faq" },
        { label: `🏥 ${t('faq_categories_question') || 'What are the categories?'}`, action: "cat_faq" },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Update initial welcome message when language or user session changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [
          {
            sender: 'bot',
            text: getPersonalizedGreeting(userName, lang, t),
            actions: [
              { label: `🚨 ${t('hero_report_btn') || 'Request Emergency Help'}`, action: "report" },
              { label: `🔍 ${t('hero_track_btn') || 'Track Request'} (CARE-2026-101)`, action: "track_code" },
              { label: `ℹ️ ${t('faq_charge_question') || 'Does CareOn charge fees?'}`, action: "fees_faq" },
              { label: `🏥 ${t('faq_categories_question') || 'What are the categories?'}`, action: "cat_faq" },
            ],
          },
        ];
      }
      return prev;
    });
  }, [lang, userName]);

  // Clean up voice recognition on unmount or close
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Listen to open-sahara custom event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-sahara', handleOpen);
    return () => window.removeEventListener('open-sahara', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text, 'careon_user_session', userName, lang);
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

  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRec) {
      setVoiceError(t('voice_unsupported') || 'Voice input is not supported in this browser');
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
          setIsListening(false);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setVoiceError(t('voice_permission_error') || 'Microphone access denied or unavailable');
          setTimeout(() => setVoiceError(null), 4000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceError(t('voice_permission_error') || 'Microphone access denied or unavailable');
      setTimeout(() => setVoiceError(null), 4000);
    }
  };

  const handleActionClick = (act) => {
    if (act.action === 'report') {
      onNavigate?.('user_report');
      setIsOpen(false);
    } else if (act.action === 'track_prompt') {
      onNavigate?.('user_track');
      setIsOpen(false);
    } else if (act.action === 'track_code' || act.action === 'track_code_demo') {
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
            background: '#171C24',
            color: '#ffffff',
            borderRadius: '50px',
            padding: '0.65rem 1.25rem',
            border: '1px solid #344252',
            boxShadow: '0 8px 24px rgba(23, 28, 36, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 700,
            fontSize: '0.95rem',
            zIndex: 1000
          }}
        >
          <Heart size={18} fill="#F04438" color="#F04438" />
          <span>Sahara</span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#12B76A',
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
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
            border: '1px solid #DCE5EB',
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
              background: '#171C24',
              color: '#ffffff',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #344252'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(240, 68, 56, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={18} fill="#F04438" color="#F04438" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.1 }}>Sahara</div>
                <div style={{ fontSize: '0.75rem', color: '#98A2B3' }}>{t('sahara_tagline') || 'Your caring emergency companion'}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#98A2B3', cursor: 'pointer', padding: 4 }}
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
              background: '#F5F6F7'
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: '#344252',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCE5EB',
                padding: '8px 10px',
                borderRadius: 8,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              🔒 <strong>{t('safe_companion') || 'Safe Companion'}:</strong> {t('sahara_safe_companion_desc') || 'Sahara provides coordination support. For life-threatening emergencies, dial 112 immediately.'}
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
                    background: m.sender === 'user' ? '#171C24' : '#FFFFFF',
                    color: m.sender === 'user' ? '#FFFFFF' : '#171C24',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: m.sender === 'user' ? 'none' : '1px solid #DCE5EB',
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
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #DCE5EB',
                          color: '#171C24',
                          padding: '5px 12px',
                          borderRadius: 14,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
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
                <Heart size={12} color="#F04438" fill="#F04438" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening / Voice Error Indicators */}
          {isListening && (
            <div
              style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderTop: '1px solid #fecdd3'
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  animation: 'pulse 1s infinite'
                }}
              />
              <span>{t('voice_listening') || 'Listening... Speak now'}</span>
            </div>
          )}

          {voiceError && (
            <div
              style={{
                backgroundColor: '#fffbeb',
                color: '#b45309',
                fontSize: '0.75rem',
                padding: '6px 12px',
                borderTop: '1px solid #fde68a'
              }}
            >
              {voiceError}
            </div>
          )}

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              borderTop: '1px solid #DCE5EB',
              display: 'flex',
              gap: 8,
              background: '#FFFFFF',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ask_sahara_placeholder') || 'Ask Sahara or enter incident code...'}
              style={{
                flex: 1,
                border: '1px solid #DCE5EB',
                borderRadius: 20,
                padding: '8px 14px',
                fontSize: '0.85rem',
                outline: 'none',
                color: '#171C24',
                backgroundColor: '#F5F6F7'
              }}
            />
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              title={isListening ? (t('voice_listening') || 'Listening... Click to stop') : (t('voice_input_tooltip') || 'Voice input (Speak to Sahara)')}
              aria-label="Voice input"
              style={{
                backgroundColor: isListening ? '#F04438' : '#F5F6F7',
                color: isListening ? '#FFFFFF' : '#171C24',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid ' + (isListening ? '#D92D20' : '#DCE5EB'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                backgroundColor: input.trim() ? '#171C24' : '#E4E7EC',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                flexShrink: 0
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
