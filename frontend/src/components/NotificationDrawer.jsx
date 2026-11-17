import React from 'react';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAsRead }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Notification Centre</h3>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#64748b' }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              No notifications yet. Updates will appear here in real time.
            </div>
          ) : (
            notifications.map((n) => {
              const bg = n.type === 'alert' ? '#fef2f2' : n.type === 'success' ? '#f0fdf4' : n.type === 'warning' ? '#fffbeb' : '#f8fafc';
              const border = n.type === 'alert' ? '#fecaca' : n.type === 'success' ? '#bbf7d0' : n.type === 'warning' ? '#fde68a' : '#e2e8f0';

              return (
                <div
                  key={n.id}
                  style={{
                    backgroundColor: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '8px',
                    padding: '12px 14px',
                    opacity: n.is_read ? 0.75 : 1,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                      {n.title}
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => onMarkAsRead?.(n.id)}
                        style={{
                          fontSize: '11px',
                          color: '#0284c7',
                          fontWeight: 600,
                          background: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.45 }}>
                    {n.message}
                  </p>

                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
