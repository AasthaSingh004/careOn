import React, { useEffect } from 'react';
import { useTranslation } from '../translations';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export default function NotificationToast({
  toasts = [],
  onDismiss,
  onMarkAsRead,
  onOpenDrawer,
  lang = 'en'
}) {
  const { t } = useTranslation(lang);

  // Auto-dismiss each toast after 8 seconds
  useEffect(() => {
    if (!toasts || toasts.length === 0) return;

    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        onDismiss?.(toast.id);
      }, 8000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, onDismiss]);

  if (!toasts || toasts.length === 0) return null;

  return (
    <aside
      className="toast-container"
      aria-live="polite"
      aria-label={t('notification_centre_title', 'Notification Centre')}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 420,
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const isAlert = toast.type === 'alert';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        const bg = isAlert ? '#FEF3F2' : '#FFFFFF';
        const border = isAlert ? '#FECDCA' : '#DCE5EB';
        const textColor = isAlert ? '#B42318' : '#171C24';
        const iconColor = isAlert ? '#F04438' : isSuccess ? '#12B76A' : isWarning ? '#F79009' : '#171C24';

        return (
          <div
            key={toast.id}
            className="toast-item"
            style={{
              pointerEvents: 'auto',
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 12,
              padding: '12px 14px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}
          >
            {/* Header with Type Icon & Dismiss Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', color: textColor }}>
                {isAlert && <AlertTriangle size={16} color={iconColor} style={{ flexShrink: 0 }} />}
                {isSuccess && <CheckCircle size={16} color={iconColor} style={{ flexShrink: 0 }} />}
                {isWarning && <AlertTriangle size={16} color={iconColor} style={{ flexShrink: 0 }} />}
                {!isAlert && !isSuccess && !isWarning && <Info size={16} color={iconColor} style={{ flexShrink: 0 }} />}
                <span>{t(toast.title)}</span>
              </div>
              <button
                type="button"
                onClick={() => onDismiss?.(toast.id)}
                aria-label={t('dismiss', 'Dismiss')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Message Body */}
            <div style={{ fontSize: '0.85rem', color: '#344252', lineHeight: 1.45, paddingRight: 4 }}>
              {t(toast.message)}
            </div>

            {/* Actions footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 6, borderTop: `1px solid ${border}` }}>
              <button
                type="button"
                onClick={() => {
                  onDismiss?.(toast.id);
                  onOpenDrawer?.();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#171C24',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Bell size={12} />
                <span>{t('view_in_drawer', 'View in Bell')}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!toast.is_read && (
                  <button
                    type="button"
                    onClick={() => onMarkAsRead?.(toast.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#F04438',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {t('mark_read', 'Mark Read')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDismiss?.(toast.id)}
                  style={{
                    background: '#F5F6F7',
                    border: '1px solid #DCE5EB',
                    borderRadius: 4,
                    padding: '2px 8px',
                    color: '#344252',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('dismiss', 'Dismiss')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
