import React from 'react';

export default function Header({ health, onRefresh }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo" aria-label="CareOn Logo">+</div>
        <div>
          <h1 className="header-title">CareOn</h1>
          <p className="header-subtitle">Hospital Emergency Response &amp; Real-Time Dispatch</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onRefresh}
          style={{
            background: 'none',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
          title="Refresh Data"
        >
          ↻ Refresh
        </button>
        <div className="header-status">
          <div className={`status-dot ${isHealthy ? '' : 'degraded'}`}></div>
          <span>{isHealthy ? 'System Online (v1.0.0)' : 'Connecting...'}</span>
        </div>
      </div>
    </header>
  );
}
