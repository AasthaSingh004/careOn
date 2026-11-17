import React from 'react';
import { translations } from '../translations';

export default function Home({ lang = 'en', onNavigate }) {
  const t = translations[lang] || translations.en;

  return (
    <div>
      {/* Official emergency disclaimer banner */}
      <div className="official-disclaimer-bar">
        <span>🚨</span>
        <span>{t.disclaimer_short}</span>
        <button
          onClick={() => (window.location.href = 'tel:112')}
          style={{
            marginLeft: '8px',
            backgroundColor: '#b91c1c',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {t.btn_call_emergency}
        </button>
      </div>

      {/* Hero Section */}
      <section className="hero-box" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9, fontSize: '13px', fontWeight: 700, letterSpacing: '1px' }}>
          <span>CAREON COORDINATION PLATFORM</span>
        </div>
        <h1 className="hero-title">{t.brand_tagline}</h1>
        <p className="hero-subtitle">
          Intelligent emergency resource allocation for high-density situations. CareOn coordinates specialist medical, fire, rescue, and relief resources to ensure help reaches where it is needed most.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-primary-red"
            onClick={() => onNavigate?.('report')}
            style={{ fontSize: '16px', padding: '14px 28px' }}
          >
            🚨 {t.btn_request_help}
          </button>

          <button
            className="btn btn-secondary-white"
            onClick={() => onNavigate?.('track')}
            style={{ fontSize: '16px', padding: '14px 24px' }}
          >
            🔍 {t.btn_track_request}
          </button>
        </div>
      </section>

      {/* How CareOn Works Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {t.how_it_works_title}
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            A coordinated, multi-stakeholder bridge between citizens, field teams, and external emergency providers.
          </p>
        </div>

        <div className="grid-4">
          <div className="card" style={{ borderTop: '4px solid #ef4444' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📝</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{t.step1_title}</h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>{t.step1_desc}</p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🧠</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{t.step2_title}</h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>{t.step2_desc}</p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #0284c7' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🚑</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{t.step3_title}</h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>{t.step3_desc}</p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #10b981' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🤝</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{t.step4_title}</h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>{t.step4_desc}</p>
          </div>
        </div>
      </section>

      {/* External Assistance & Transparency Box */}
      <section className="card" style={{ backgroundColor: '#f0fdfa', borderColor: '#ccfbf1', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '40px', lineHeight: 1 }}>🛡️</div>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f4c5c', marginBottom: '8px' }}>
              Resource Shortage Fallback & Partner-First Coordination
            </h3>
            <p style={{ color: '#134e4a', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
              When city resources are limited or fully occupied, CareOn automatically queries registered partner hospitals, private ambulance networks, and volunteer NGOs. <strong>CareOn charges ₹0 platform commission</strong> on emergency requests. If a private provider charges a fee, our coordinator transparently presents the quotation and requests your informed consent first.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span className="status-badge" style={{ backgroundColor: '#ffffff', color: '#0f4c5c', border: '1px solid #99f6e4' }}>
                ✓ ₹0 Platform Fee
              </span>
              <span className="status-badge" style={{ backgroundColor: '#ffffff', color: '#0f4c5c', border: '1px solid #99f6e4' }}>
                ✓ Double-Assignment Prevention
              </span>
              <span className="status-badge" style={{ backgroundColor: '#ffffff', color: '#0f4c5c', border: '1px solid #99f6e4' }}>
                ✓ User Consent for Paid Options
              </span>
              <span className="status-badge" style={{ backgroundColor: '#ffffff', color: '#0f4c5c', border: '1px solid #99f6e4' }}>
                ✓ Safe User-Initiated Cancellation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sahara Chatbot Companion Invitation */}
      <section
        className="card"
        style={{
          marginTop: '32px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ❤️
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Meet Sahara</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Your caring emergency support companion. Available 24/7 at the bottom-right corner to guide you through reporting, tracking, and understanding emergency options.
            </p>
          </div>
        </div>

        <button
          className="btn btn-teal"
          onClick={() => {
            const fab = document.querySelector('.sahara-fab');
            if (fab) fab.click();
          }}
        >
          Chat with Sahara
        </button>
      </section>
    </div>
  );
}
