import React from 'react';
import { useTranslation } from '../translations';
import CareOnLogo from '../components/CareOnLogo';
import {
  AlertTriangle,
  Search,
  MessageSquare,
  Shield,
  Activity,
  PhoneCall,
  CheckCircle,
  Truck,
  HeartHandshake,
  TrendingUp,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Home({ lang = 'en', onNavigate }) {
  const { t } = useTranslation(lang);

  const openSahara = () => {
    const fab = document.querySelector('.sahara-bubble-btn') || document.querySelector('.sahara-fab');
    if (fab) {
      fab.click();
    } else {
      // Trigger event or fallback
      window.dispatchEvent(new CustomEvent('open-sahara'));
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* 112 Emergency Helpline Banner */}
      <div style={{
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        borderRadius: 12,
        padding: '0.85rem 1.25rem',
        marginTop: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: '#e11d48',
            color: '#ffffff',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <PhoneCall size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 700, color: '#9f1239', fontSize: '0.925rem', marginRight: 6 }}>
              {t('helpline_alert_title') || 'National Emergency Helpline'}:
            </span>
            <span style={{ color: '#881337', fontSize: '0.875rem' }}>
              {t('helpline_alert_desc') || 'For immediate life-threatening situations, also dial 112 directly.'}
            </span>
          </div>
        </div>

        <a
          href="tel:112"
          className="btn"
          style={{
            background: '#e11d48',
            color: '#ffffff',
            padding: '0.45rem 1rem',
            borderRadius: 8,
            fontSize: '0.85rem',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0
          }}
        >
          <span>{t('dial_112_btn') || 'Call 112'}</span>
        </a>
      </div>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
        color: '#ffffff',
        borderRadius: 20,
        padding: '3rem 2.5rem',
        boxShadow: '0 15px 30px -10px rgba(13, 148, 136, 0.35)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '3rem'
      }}>
        {/* Decorative background circle */}
        <div style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 760, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255, 255, 255, 0.18)',
            padding: '5px 14px',
            borderRadius: 20,
            fontSize: '0.825rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '1.25rem',
            textTransform: 'uppercase'
          }}>
            <CareOnLogo size={18} color="#ffffff" />
            <span>{t('brand_name')} • {t('hero_badge') || 'Intelligent Resource Coordination'}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em'
          }}>
            {t('hero_title')}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.5,
            opacity: 0.94,
            margin: '0 0 2rem 0',
            maxWidth: 680
          }}>
            {t('hero_subtitle')}
          </p>

          {/* 3 Primary Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Action 1: Report Emergency */}
            <button
              onClick={() => onNavigate?.('user_report')}
              className="btn"
              style={{
                background: '#e11d48',
                color: '#ffffff',
                padding: '0.85rem 1.6rem',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)'
              }}
            >
              <AlertTriangle size={20} />
              <span>{t('hero_report_btn')}</span>
            </button>

            {/* Action 2: Track Request */}
            <button
              onClick={() => onNavigate?.('user_track')}
              className="btn"
              style={{
                background: '#ffffff',
                color: '#0f766e',
                padding: '0.85rem 1.5rem',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Search size={19} />
              <span>{t('hero_track_btn')}</span>
            </button>

            {/* Action 3: Sahara Chatbot */}
            <button
              onClick={openSahara}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '0.85rem 1.4rem',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              <MessageSquare size={19} />
              <span>{t('hero_sahara_btn')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* How CareOn Works Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0d9488',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem'
          }}>
            {t('workflow_subtitle') || 'Seamless Coordination Journey'}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            {t('how_it_works_title')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
            {t('how_it_works_desc') || 'A synchronized bridge between citizens in need, dispatch coordinators, and emergency response teams.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Step 1 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14, borderTop: '4px solid #ef4444' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('step1_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('step1_desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14, borderTop: '4px solid #f59e0b' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('step2_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('step2_desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14, borderTop: '4px solid #0284c7' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('step3_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('step3_desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14, borderTop: '4px solid #10b981' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#d1fae5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              4
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('step4_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('step4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 6 Capabilities & Feature Cards */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0d9488',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem'
          }}>
            {t('platform_capabilities_badge') || 'Engineered For Resilience'}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            {t('features_section_title') || 'Comprehensive Resource Coordination'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
            {t('features_section_desc') || 'Designed to prevent resource bottlenecks, eliminate allocation conflicts, and deliver rapid response.'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Feature 1 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#f0fdfa',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('feature1_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('feature1_desc')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <HeartHandshake size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('feature2_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('feature2_desc')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('feature3_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('feature3_desc')}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('feature4_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('feature4_desc')}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#fdf2f8',
              color: '#db2777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('feature5_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('feature5_desc')}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card hover-card" style={{ padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#ccfbf1',
              color: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              {t('feature6_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              {t('feature6_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Zero Commission Card */}
      <section style={{
        background: '#f0fdfa',
        border: '1px solid #ccfbf1',
        borderRadius: 16,
        padding: '2rem 2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: 700 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#134e4a', margin: '0 0 0.5rem 0' }}>
            {t('zero_commission_title') || '₹0 Platform Fee — Transparent Emergency Coordination'}
          </h3>
          <p style={{ color: '#0f766e', fontSize: '0.925rem', lineHeight: 1.5, margin: 0 }}>
            {t('zero_commission_desc') || 'CareOn does not charge any citizen commission. If external private providers or ambulances are activated during city-wide shortages, coordinators present transparent rates for your explicit consent.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate?.('user_report')}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
        >
          <span>{t('hero_report_btn')}</span>
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
