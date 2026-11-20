import React from 'react';
import { useTranslation } from '../translations';
import CareOnLogo from './CareOnLogo';
import { Phone, Mail } from 'lucide-react';

export default function Footer({ lang = 'en', onTabChange }) {
  const { t } = useTranslation(lang);

  return (
    <footer className="footer-root" style={{ background: '#FFFFFF', borderTop: '1px solid #DCE5EB', color: '#344252', padding: '2.5rem 1.25rem 2rem 1.25rem', marginTop: 'auto' }}>
      <div className="footer-inner" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.25rem', fontWeight: 800, color: '#171C24', marginBottom: '0.5rem' }}>
            <CareOnLogo size={24} color="#F04438" />
            <span>CareOn</span>
          </div>
          <p style={{ lineHeight: 1.5, marginBottom: '1rem', color: '#344252', fontSize: '0.9rem' }}>
            {t('brand_tagline')}
          </p>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#FEE4E2',
              border: '1px solid #FECDCA',
              borderRadius: 8,
              color: '#B42318',
              fontSize: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            ⚠️ <strong>{t('disclaimer_title') || 'Emergency Notice'}:</strong> {t('footer_disclaimer') || 'CareOn is an intelligent resource coordination decision-support prototype. It is not a replacement for official government emergency services. For immediate life-threatening situations, always dial 112 directly.'}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#171C24', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            {t('quick_links') || 'Portals & Services'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
            <button
              onClick={() => onTabChange?.('home')}
              style={{ background: 'none', border: 'none', color: '#344252', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171C24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#344252'}
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => onTabChange?.('user_report')}
              style={{ background: 'none', border: 'none', color: '#344252', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171C24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#344252'}
            >
              {t('nav_report')}
            </button>
            <button
              onClick={() => onTabChange?.('user_track')}
              style={{ background: 'none', border: 'none', color: '#344252', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171C24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#344252'}
            >
              {t('nav_track')}
            </button>
            <button
              onClick={() => onTabChange?.('user_dashboard')}
              style={{ background: 'none', border: 'none', color: '#344252', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171C24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#344252'}
            >
              {t('citizen_portal') || 'Citizen Portal'}
            </button>
            <button
              onClick={() => onTabChange?.('admin_dashboard')}
              style={{ background: 'none', border: 'none', color: '#344252', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171C24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#344252'}
            >
              {t('nav_admin')}
            </button>
            <button
              onClick={() => onTabChange?.('privacy')}
              style={{ background: 'none', border: 'none', color: '#344252', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#171C24'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#344252'}
            >
              {t('nav_privacy')}
            </button>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, color: '#171C24', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            {t('command_support_title') || 'Coordinator Support'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.875rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#171C24' }}>
              <Phone size={14} color="#F04438" />
              <span>{t('national_helpline_label', 'National Helpline')}: <strong>112</strong> / <strong>108</strong></span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#344252' }}>
              <Mail size={14} color="#F04438" />
              <span>{t('coordination_email_label', 'Coordination')}: admin@careon.org</span>
            </span>
            <span style={{ fontSize: '0.825rem', color: '#667085', marginTop: '0.5rem' }}>
              {t('mysuru_command_region', 'Mysuru Command Region, Karnataka, India')}
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: '#667085', marginTop: '1.25rem', borderTop: '1px solid #DCE5EB', paddingTop: '0.75rem' }}>
            CareOn Platform Prototype &copy; 2026. {t('built_with_care') || 'Built with care for emergency decision-support.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
