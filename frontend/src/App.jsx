import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SaharaChatbot from './components/SaharaChatbot';
import NotificationDrawer from './components/NotificationDrawer';
import NotificationToast from './components/NotificationToast';
import InstallPwaPrompt from './components/InstallPwaPrompt';

// Pages
import Home from './pages/Home';
import ReportEmergency from './pages/ReportEmergency';
import TrackRequest from './pages/TrackRequest';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';

import {
  fetchHealth,
  fetchStats,
  fetchNotifications,
  markNotificationAsRead,
  getStoredUserSession,
  getStoredAdminSession,
  logoutUser,
  logoutAdmin,
} from './api';
import './App.css';

// Helper to determine initial tab from URL path
function getTabFromPath(pathname) {
  if (pathname === '/user/login') return 'user_login';
  if (pathname === '/user/register') return 'user_register';
  if (pathname === '/user/dashboard' || pathname === '/user/history') return 'user_dashboard';
  if (pathname === '/user/report' || pathname === '/report') return 'user_report';
  if (pathname === '/user/track' || pathname === '/track') return 'user_track';
  if (pathname === '/admin/login') return 'admin_login';
  if (pathname.startsWith('/admin')) return 'admin_dashboard';
  if (pathname === '/privacy') return 'privacy';
  return 'home';
}

function getPathFromTab(tab) {
  switch (tab) {
    case 'user_login': return '/user/login';
    case 'user_register': return '/user/register';
    case 'user_dashboard': return '/user/dashboard';
    case 'user_report':
    case 'report': return '/user/report';
    case 'user_track':
    case 'track': return '/user/track';
    case 'admin_login': return '/admin/login';
    case 'admin_dashboard':
    case 'admin': return '/admin/dashboard';
    case 'privacy': return '/privacy';
    case 'home':
    default: return '/';
  }
}

export const SUPPORTED_LANGS = ['en', 'hi', 'kn'];

export function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem('careon_lang');
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
    localStorage.setItem('careon_lang', 'en');
    return 'en';
  } catch {
    return 'en';
  }
}

export function getSeenToastIds() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('careon_seen_toast_ids');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addSeenToastId(id) {
  if (typeof window === 'undefined') return;
  try {
    const seen = getSeenToastIds();
    if (!seen.includes(id)) {
      localStorage.setItem('careon_seen_toast_ids', JSON.stringify([...seen, id]));
    }
  } catch {}
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState({ total: 5, pending: 2, responded: 2, resolved: 1, critical: 2 });
  const [currentTab, setCurrentTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'home';
  });
  const [activeIncidentCode, setActiveIncidentCode] = useState('CARE-2026-101');
  const [initialSimulatedOtp, setInitialSimulatedOtp] = useState(null);
  const [lang, setLang] = useState(getInitialLanguage);
  const [notifications, setNotifications] = useState([]);
  const [activeToasts, setActiveToasts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Independent Dual Sessions
  const [userSession, setUserSession] = useState(() => getStoredUserSession());
  const [adminSession, setAdminSession] = useState(() => getStoredAdminSession());

  // Handle URL history popstate (Back/Forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLangChange = (newLang) => {
    const normalized = SUPPORTED_LANGS.includes(newLang) ? newLang : 'en';
    setLang(normalized);
    try {
      localStorage.setItem('careon_lang', normalized);
    } catch (err) {
      console.error('Error saving language preference:', err);
    }
  };

  const loadSystemData = useCallback(async () => {
    try {
      const [healthData, statsData, notifs] = await Promise.all([
        fetchHealth().catch(() => ({ status: 'degraded' })),
        fetchStats().catch(() => ({ total: 5, pending: 2, responded: 2, resolved: 1, critical: 2 })),
        fetchNotifications().catch(() => []),
      ]);
      setHealth(healthData);
      setStats(statsData);
      setNotifications(notifs);

      // Check for new unread notifications to display as dismissible toasts
      if (typeof window !== 'undefined') {
        const storedSeen = localStorage.getItem('careon_seen_toast_ids');
        if (storedSeen === null) {
          localStorage.setItem('careon_seen_toast_ids', JSON.stringify(notifs.map((n) => n.id)));
        } else {
          const seen = getSeenToastIds();
          const newlyArrived = notifs.filter((n) => !n.is_read && !seen.includes(n.id));
          if (newlyArrived.length > 0) {
            setActiveToasts((prev) => {
              const existingIds = new Set(prev.map((t) => t.id));
              const toAdd = newlyArrived.filter((n) => !existingIds.has(n.id));
              return [...prev, ...toAdd];
            });
            newlyArrived.forEach((n) => addSeenToastId(n.id));
          }
        }
      }
    } catch (err) {
      console.error('Error fetching system data:', err);
    }
  }, []);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 8000);
    return () => clearInterval(interval);
  }, [loadSystemData]);

  const handleNavigate = (tab, code = null) => {
    if (code) {
      setActiveIncidentCode(code);
    }
    setCurrentTab(tab);
    const targetPath = getPathFromTab(tab);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserLoginSuccess = (user) => {
    setUserSession(user);
    handleNavigate('user_dashboard');
    loadSystemData();
  };

  const handleAdminLoginSuccess = (admin) => {
    setAdminSession(admin);
    handleNavigate('admin_dashboard');
    loadSystemData();
  };

  const handleLogoutUser = () => {
    logoutUser();
    setUserSession(null);
    handleNavigate('home');
  };

  const handleLogoutAdmin = () => {
    logoutAdmin();
    setAdminSession(null);
    handleNavigate('admin_login');
  };

  // Listen for OTP generation events (e.g. from TrackRequest "Request New Code")
  useEffect(() => {
    const handleOtpGenerated = (e) => {
      const { code, otp } = e.detail || {};
      if (otp) {
        const toastCode = code || activeIncidentCode;
        const otpToast = {
          id: `otp-${Date.now()}-${toastCode}`,
          title: `Emergency Verification Code (${toastCode})`,
          message: `Your CareOn verification code is: ${otp}. Enter this code in the verification box to continue. (In-App Demo OTP)`,
          type: 'alert',
          created_at: new Date().toISOString(),
          is_read: false,
        };
        setActiveToasts((prev) => [otpToast, ...prev.filter((t) => !String(t.id).startsWith('otp-'))]);
        loadSystemData();
      }
    };
    window.addEventListener('careon-otp-generated', handleOtpGenerated);
    return () => window.removeEventListener('careon-otp-generated', handleOtpGenerated);
  }, [activeIncidentCode, loadSystemData]);

  const handleEmergencySubmitted = (code, simulatedOtp = null) => {
    const updatedUser = getStoredUserSession();
    if (updatedUser && !userSession) {
      setUserSession(updatedUser);
    }
    setActiveIncidentCode(code);
    setInitialSimulatedOtp(simulatedOtp);

    if (simulatedOtp) {
      const otpToast = {
        id: `otp-${Date.now()}-${code}`,
        title: `Emergency Verification Code (${code})`,
        message: `Your CareOn verification code is: ${simulatedOtp}. Enter this code in the verification box to continue. (In-App Demo OTP)`,
        type: 'alert',
        created_at: new Date().toISOString(),
        is_read: false,
      };
      setActiveToasts((prev) => [otpToast, ...prev.filter((t) => !String(t.id).startsWith('otp-'))]);
    }

    handleNavigate('user_track', code);
    loadSystemData();
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleDismissToast = (id) => {
    // Dismiss the visible toast without deleting from notification bell history
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMarkReadFromToast = async (id) => {
    await handleMarkAsRead(id);
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        health={health}
        onRefresh={loadSystemData}
        currentTab={currentTab}
        onTabChange={handleNavigate}
        lang={lang}
        onLangChange={handleLangChange}
        unreadCount={unreadCount}
        onOpenNotifications={() => setShowNotifications(true)}
        userSession={userSession}
        adminSession={adminSession}
        onLogoutUser={handleLogoutUser}
        onLogoutAdmin={handleLogoutAdmin}
      />

      <main className="container" style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        {/* Public Home */}
        {currentTab === 'home' && (
          <Home lang={lang} onNavigate={handleNavigate} currentUser={userSession} />
        )}

        {/* User Portal Pages */}
        {currentTab === 'user_login' && (
          <UserLogin
            lang={lang}
            onLoginSuccess={handleUserLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'user_register' && (
          <UserRegister
            lang={lang}
            onRegisterSuccess={handleUserLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'user_dashboard' && (
          <UserDashboard
            lang={lang}
            currentUser={userSession}
            onNavigate={handleNavigate}
            onSelectIncident={(code) => setActiveIncidentCode(code)}
          />
        )}

        {(currentTab === 'user_report' || currentTab === 'report') && (
          <ReportEmergency
            lang={lang}
            onSubmitted={handleEmergencySubmitted}
            currentUser={userSession}
          />
        )}

        {(currentTab === 'user_track' || currentTab === 'track') && (
          <TrackRequest
            lang={lang}
            initialIncidentCode={activeIncidentCode}
            initialSimulatedOtp={initialSimulatedOtp}
            onNavigate={handleNavigate}
          />
        )}

        {/* Admin Portal Pages */}
        {currentTab === 'admin_login' && (
          <AdminLogin
            lang={lang}
            onLoginSuccess={handleAdminLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {(currentTab === 'admin_dashboard' || currentTab === 'admin') && (
          <AdminDashboard
            lang={lang}
            currentUser={adminSession}
            onNavigate={handleNavigate}
          />
        )}

        {/* Privacy & Legal */}
        {currentTab === 'privacy' && (
          <PrivacyPolicy lang={lang} />
        )}
      </main>

      <SaharaChatbot
        lang={lang}
        onNavigate={handleNavigate}
      />

      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        lang={lang}
      />

      <NotificationToast
        toasts={activeToasts}
        onDismiss={handleDismissToast}
        onMarkAsRead={handleMarkReadFromToast}
        onOpenDrawer={() => setShowNotifications(true)}
        lang={lang}
      />

      <InstallPwaPrompt lang={lang} />

      <Footer lang={lang} onTabChange={handleNavigate} />
    </div>
  );
}
