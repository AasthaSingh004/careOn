import React, { useState, useEffect } from 'react';
import { useTranslation } from '../translations';
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle, Info } from 'lucide-react';

/**
 * CareOn Progressive Web App Installation Component
 * Handles:
 * - Native Android/Chromium `beforeinstallprompt` capture and trigger
 * - iOS Safari step-by-step manual installation instructions
 * - Display-mode standalone detection (already installed)
 * - Dismissal state persistence (no repeated intrusive prompts)
 * - Custom window event `careon-open-install-prompt` for Header/Footer button clicks
 */
export default function InstallPwaPrompt({ lang = 'en' }) {
  const { t } = useTranslation(lang);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const deferredPromptRef = React.useRef(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const isStandaloneRef = React.useRef(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until checked
  const [showIosModal, setShowIosModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const checkIsIos = () => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent || '';
    return /iphone|ipad|ipod/i.test(userAgent) && !window.MSStream;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect if running as standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true ||
        (typeof document !== 'undefined' && typeof document.referrer === 'string' && document.referrer.includes('android-app://'));
      const active = Boolean(isStandaloneMode);
      setIsStandalone(active);
      isStandaloneRef.current = active;
      return active;
    };

    const standalone = checkStandalone();

    // 2. Check dismissal history
    const dismissed = localStorage.getItem('careon_pwa_dismissed') === 'true';
    setIsDismissed(dismissed);

    // 3. Capture native Android / Chromium install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      deferredPromptRef.current = e;
      // If user hasn't dismissed yet and not in standalone mode, reveal banner
      if (!dismissed && !standalone) {
        setIsDismissed(false);
      }
    };

    // 4. Handle appinstalled event
    const handleAppInstalled = () => {
      setIsStandalone(true);
      isStandaloneRef.current = true;
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
      setIsDismissed(true);
      localStorage.setItem('careon_pwa_dismissed', 'true');
    };

    // 5. Listen for manual "Install App" clicks from Header/Footer
    const handleManualOpenPrompt = () => {
      triggerInstall();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('careon-open-install-prompt', handleManualOpenPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('careon-open-install-prompt', handleManualOpenPrompt);
    };
  }, []);

  const triggerInstall = async () => {
    // If running in standalone mode already
    if (isStandaloneRef.current) {
      alert(t('pwa_already_installed', 'CareOn is already installed on your device.'));
      return;
    }

    // If on iOS, open iPhone installation instructions modal
    if (checkIsIos()) {
      setShowIosModal(true);
      return;
    }

    // If native prompt is captured (Android / Chrome)
    const promptEvent = deferredPromptRef.current;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsStandalone(true);
          isStandaloneRef.current = true;
          setIsDismissed(true);
          localStorage.setItem('careon_pwa_dismissed', 'true');
        }
        setDeferredPrompt(null);
        deferredPromptRef.current = null;
      } catch (err) {
        setShowHelpModal(true);
      }
      return;
    }

    // Fallback if browser doesn't support or hasn't fired beforeinstallprompt
    setShowHelpModal(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('careon_pwa_dismissed', 'true');
    } catch {}
  };

  // If already installed in standalone mode, don't show the banner
  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Banner */}
      {!isDismissed && (
        <div
          className="pwa-install-banner"
          role="region"
          aria-label={t('pwa_banner_title')}
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: 580,
            backgroundColor: '#FFFFFF',
            borderRadius: 14,
            boxShadow: '0 8px 30px rgba(16, 24, 40, 0.16)',
            border: '1px solid #DCE5EB',
            zIndex: 9990,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            animation: 'fadeInUp 0.3s ease-out',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: '#FEE4E2',
                color: '#F04438',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Smartphone size={24} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171C24', lineHeight: 1.2 }}>
                {t('pwa_banner_title')}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#475467',
                  marginTop: 3,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {t('pwa_banner_desc')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={triggerInstall}
              style={{
                backgroundColor: '#F04438',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(240, 68, 56, 0.3)'
              }}
            >
              <Download size={15} />
              <span>{t('pwa_install_btn')}</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label={t('pwa_dismiss_btn')}
              title={t('pwa_dismiss_btn')}
              style={{
                background: 'transparent',
                border: '1px solid #DCE5EB',
                borderRadius: 8,
                padding: '8px',
                color: '#667085',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* iPhone / iOS Step-by-Step Instructions Modal */}
      {showIosModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 24, 40, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
          onClick={() => setShowIosModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 440,
              width: '100%',
              padding: '24px 22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #DCE5EB',
              animation: 'fadeInScale 0.2s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  backgroundColor: '#FEE4E2',
                  color: '#F04438',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Smartphone size={22} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#171C24' }}>
                  {t('pwa_ios_title')}
                </h3>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                style={{
                  background: '#F5F6F7',
                  border: '1px solid #DCE5EB',
                  borderRadius: 6,
                  padding: 6,
                  cursor: 'pointer',
                  color: '#667085'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475467', marginTop: 0, marginBottom: 16, lineHeight: 1.4 }}>
              {t('pwa_ios_subtitle')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                backgroundColor: '#F5F6F7',
                borderRadius: 10,
                border: '1px solid #DCE5EB'
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCE5EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0BA5EC',
                  flexShrink: 0
                }}>
                  <Share size={18} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171C24' }}>
                  {t('pwa_ios_step1')}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                backgroundColor: '#F5F6F7',
                borderRadius: 10,
                border: '1px solid #DCE5EB'
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCE5EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#12B76A',
                  flexShrink: 0
                }}>
                  <PlusSquare size={18} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171C24' }}>
                  {t('pwa_ios_step2')}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                backgroundColor: '#F5F6F7',
                borderRadius: 10,
                border: '1px solid #DCE5EB'
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DCE5EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F04438',
                  flexShrink: 0
                }}>
                  <CheckCircle size={18} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171C24' }}>
                  {t('pwa_ios_step3')}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#171C24',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {t('pwa_instructions_close')}
            </button>
          </div>
        </div>
      )}

      {/* General / Browser Menu Help Modal */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 24, 40, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              maxWidth: 420,
              width: '100%',
              padding: '24px 22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #DCE5EB'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: '#EFF8FF',
                  color: '#0BA5EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Info size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#171C24' }}>
                  {t('pwa_android_other_title')}
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: '#F5F6F7',
                  border: '1px solid #DCE5EB',
                  borderRadius: 6,
                  padding: 6,
                  cursor: 'pointer',
                  color: '#667085'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475467', lineHeight: 1.5, marginBottom: 20 }}>
              {t('pwa_android_other_desc')}
            </p>

            <button
              onClick={() => setShowHelpModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#171C24',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {t('pwa_instructions_close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
