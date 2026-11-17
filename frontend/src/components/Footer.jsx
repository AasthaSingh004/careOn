import React from 'react';
import { translations } from '../translations';

export default function Footer({ lang = 'en', onTabChange }) {
  const t = translations[lang] || translations.en;

  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <div style={{ maxWidth: '440px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            CareOn
          </div>
          <p style={{ lineHeight: 1.6, marginBottom: '12px' }}>
            {t.brand_tagline}
          </p>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '12px',
              lineHeight: 1.5,
            }}
          >
            ⚠️ <strong>Emergency Disclaimer:</strong> CareOn is an intelligent resource coordination decision-support prototype built for university presentation. It is not an official government dispatch system. In immediate danger, call <strong>112</strong> or <strong>108</strong>.
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Quick Navigation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => onTabChange?.('home')} style={{ color: '#94a3b8', textAlign: 'left' }}>
              Home
            </button>
            <button onClick={() => onTabChange?.('report')} style={{ color: '#94a3b8', textAlign: 'left' }}>
              Request Emergency Help
            </button>
            <button onClick={() => onTabChange?.('track')} style={{ color: '#94a3b8', textAlign: 'left' }}>
              Track Existing Request
            </button>
            <button onClick={() => onTabChange?.('admin')} style={{ color: '#94a3b8', textAlign: 'left' }}>
              Admin Command Centre
            </button>
            <button onClick={() => onTabChange?.('privacy')} style={{ color: '#94a3b8', textAlign: 'left' }}>
              Privacy, Terms & Responsible Use
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Coordinator Support</div>
          <p style={{ marginBottom: '6px' }}>Central Command Hotline: +91 80 2233 4455</p>
          <p style={{ marginBottom: '6px' }}>Coordination Email: support@careon.org</p>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '16px' }}>
            CareOn Platform Prototype &copy; 2026. Made with care for emergency decision-support.
          </p>
        </div>
      </div>
    </footer>
  );
}
