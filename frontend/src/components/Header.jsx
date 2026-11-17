import React, { useState } from 'react';
import { translations } from '../translations';

export default function Header({
  health,
  onRefresh,
  currentTab,
  onTabChange,
  lang = 'en',
  onLangChange,
  unreadCount = 0,
  onOpenNotifications,
  currentUser,
  onLoginDemoUser,
  onLoginDemoAdmin,
  onLogout,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const t = translations[lang] || translations.en;

  const isHealthy = health?.status === 'healthy';

  return (
    <header className="header-root">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-section" onClick={() => onTabChange?.('home')} style={{ cursor: 'pointer' }}>
          <svg className="brand-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="24" fill="#092c35" />
            <path
              d="M50 18C35 18 24 28 24 42C24 64 50 82 50 82C50 82 76 64 76 42C76 28 65 18 50 18Z"
              fill="#ef4444"
              opacity="0.9"
            />
            <path
              d="M38 50H45L48 42L52 58L56 46L58 50H62"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <div className="brand-title">CareOn</div>
            <div className="brand-tagline">
              <span style={{ display: 'none' }}>Hospital Emergency Response</span>
              {t.brand_tagline}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button
            className={`nav-tab-btn ${currentTab === 'home' ? 'active' : ''}`}
            onClick={() => onTabChange?.('home')}
          >
            {t.nav_home}
          </button>

          <button
            className={`nav-tab-btn emergency-cta ${currentTab === 'report' ? 'active' : ''}`}
            onClick={() => onTabChange?.('report')}
          >
            🚨 {t.nav_report}
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'track' ? 'active' : ''}`}
            onClick={() => onTabChange?.('track')}
          >
            🔍 {t.nav_track}
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'admin' ? 'active' : ''}`}
            onClick={() => onTabChange?.('admin')}
          >
            🛡️ {t.nav_admin}
          </button>

          <button
            className={`nav-tab-btn ${currentTab === 'privacy' ? 'active' : ''}`}
            onClick={() => onTabChange?.('privacy')}
          >
            ℹ️ {t.nav_privacy}
          </button>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Health indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '4px 8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '6px',
            }}
            title="Backend Service Status"
            onClick={onRefresh}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isHealthy ? '#22c55e' : '#f59e0b',
                boxShadow: isHealthy ? '0 0 6px #22c55e' : 'none',
              }}
            />
            <span style={{ fontWeight: 600 }}>{isHealthy ? 'System Online (LIVE)' : 'System Connecting'}</span>
          </div>

          {/* Language Selector */}
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => onLangChange?.(e.target.value)}
            aria-label="Language Selector"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>

          {/* Notification Bell */}
          <button
            className="icon-btn-badge"
            onClick={onOpenNotifications}
            title="View In-App Notifications"
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
          </button>

          {/* User Account / Demo Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              className="user-pill"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="Switch Demo User Role"
            >
              <span>👤</span>
              <span style={{ fontWeight: 600 }}>
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Demo User'}
              </span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>
                ({currentUser?.role === 'admin' ? 'Admin' : 'Reporter'})
              </span>
              <span>▾</span>
            </button>

            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  border: '1px solid #e2e8f0',
                  padding: '12px',
                  minWidth: '220px',
                  zIndex: 2000,
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  Demo Accounts Switcher
                </div>

                <button
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: currentUser?.role !== 'admin' ? '#f0fdfa' : 'transparent',
                    fontWeight: 600,
                    marginBottom: '4px',
                    color: '#0f4c5c',
                  }}
                  onClick={() => {
                    onLoginDemoUser?.();
                    setShowUserMenu(false);
                  }}
                >
                  🙋 Aastha Singh (Reporter)
                </button>

                <button
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: currentUser?.role === 'admin' ? '#f0fdfa' : 'transparent',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: '#0f4c5c',
                  }}
                  onClick={() => {
                    onLoginDemoAdmin?.();
                    setShowUserMenu(false);
                  }}
                >
                  🛡️ Coordinator Rajesh (Admin)
                </button>

                <hr style={{ borderColor: '#e2e8f0', margin: '8px 0' }} />

                <button
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontWeight: 600,
                  }}
                  onClick={() => {
                    onLogout?.();
                    setShowUserMenu(false);
                  }}
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
