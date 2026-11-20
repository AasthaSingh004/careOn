import React from 'react';
import { useTranslation } from '../translations';
import { formatISTTime } from '../utils/date';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAsRead, lang = 'en' }) {
  const { t } = useTranslation(lang);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '1px solid #DCE5EB',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #DCE5EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#171C24', margin: 0 }}>{t('notification_centre_title', 'Notification Centre')}</h3>
          </div>
          <button onClick={onClose} style={{ fontSize: '18px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              {t('no_notifications_desc', 'No notifications yet. Updates will appear here in real time.')}
            </div>
          ) : (
            notifications.map((n) => {
              const bg = n.type === 'alert' ? '#FEF3F2' : '#FFFFFF';
              const border = n.type === 'alert' ? '#FECDCA' : '#DCE5EB';

              return (
                <div
                  key={n.id}
                  style={{
                    backgroundColor: bg,
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    opacity: n.is_read ? 0.75 : 1,
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#171C24' }}>
                      {t(n.title)}
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => onMarkAsRead?.(n.id)}
                        style={{
                          fontSize: '11px',
                          color: '#F04438',
                          fontWeight: 600,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {t('mark_read', 'Mark Read')}
                      </button>
                    )}
                  </div>

                  <p style={{ fontSize: '13px', color: '#344252', lineHeight: 1.45, margin: '4px 0' }}>
                    {t(n.message)}
                  </p>

                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    {formatISTTime(n.created_at)}
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
