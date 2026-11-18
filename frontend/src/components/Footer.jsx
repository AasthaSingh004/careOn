import React from 'react';
import { useTranslation } from '../translations';
import CareOnLogo from './CareOnLogo';
import { Shield, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ lang = 'en', onTabChange }) {
  const { t } = useTranslation(lang);

  return (
    <footer className="footer-root" style={{ background: '#071e24', borderTop: '1px solid #134e4a', color: '#94a3b8', padding: '2.5rem 1.25rem 2rem 1.25rem', marginTop: 'auto' }}>
      <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            <CareOnLogo size={24} />
            <span>CareOn</span>
          </div>
          <p style={{ lineHeight: 1.5, marginBottom: '1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
            {t('brand_tagline')}
          </p>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              color: '#fca5a5',
              fontSize: '0.775rem',
              lineHeight: 1.5,
            }}
          >
            ⚠️ <strong>{t('disclaimer_title') || 'Emergency Notice'}:</strong> {t('footer_disclaimer') || 'CareOn is an intelligent resource coordination decision-support prototype. It is not a replacement for official government emergency services. For immediate life-threatening situations, always dial 112 directly.'}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            {t('quick_links') || 'Portals & Services'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
            <button
              onClick={() => onTabChange?.('home')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => onTabChange?.('user_report')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              {t('nav_report')}
            </button>
            <button
              onClick={() => onTabChange?.('user_track')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              {t('nav_track')}
            </button>
            <button
              onClick={() => onTabChange?.('user_dashboard')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              {t('citizen_portal') || 'Citizen Portal'}
            </button>
            <button
              onClick={() => onTabChange?.('admin_dashboard')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              {t('nav_admin')} (Command Centre)
            </button>
            <button
              onClick={() => onTabChange?.('privacy')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', padding: 0 }}
            >
              {t('nav_privacy')}
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            {t('command_support_title') || 'Coordinator Support'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={14} color="#0d9488" />
              <span>National Helpline: <strong>112</strong> / <strong>108</strong></span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={14} color="#0d9488" />
              <span>Coordination: admin@careon.org</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
              Mysuru Command Region, Karnataka, India
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1.25rem', borderTop: '1px solid #134e4a', paddingTop: '0.75rem' }}>
            CareOn Platform Prototype &copy; 2026. {t('built_with_care') || 'Built with care for emergency decision-support.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
