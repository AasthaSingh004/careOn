import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SaharaChatbot from './components/SaharaChatbot';
import NotificationDrawer from './components/NotificationDrawer';

// Pages
import Home from './pages/Home';
import ReportEmergency from './pages/ReportEmergency';
import TrackRequest from './pages/TrackRequest';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';

import {
  fetchHealth,
  fetchStats,
  fetchNotifications,
  markNotificationAsRead,
  loginUser,
  fetchCurrentUser,
} from './api';
import './App.css';

export default function App() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, responded: 0, resolved: 0, critical: 0 });
  const [currentTab, setCurrentTab] = useState('home'); // home, report, track, admin, privacy
  const [activeIncidentCode, setActiveIncidentCode] = useState('CARE-2026-101');
  const [lang, setLang] = useState(() => localStorage.getItem('careon_lang') || 'en');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('careon_user');
      return saved ? JSON.parse(saved) : { name: 'Aastha Singh', role: 'user', email: 'aastha@example.com' };
    } catch {
      return { name: 'Aastha Singh', role: 'user', email: 'aastha@example.com' };
    }
  });

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('careon_lang', newLang);
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
    } catch (err) {
      console.error('Error fetching system data:', err);
    }
  }, []);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 8000);
    return () => clearInterval(interval);
  }, [loadSystemData]);

  // Demo user logins
  const handleLoginDemoUser = async () => {
    try {
      const res = await loginUser('aastha@example.com', 'user123');
      localStorage.setItem('careon_token', res.access_token);
      localStorage.setItem('careon_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      loadSystemData();
    } catch (err) {
      console.warn('Demo user login notice:', err);
      const fallback = { name: 'Aastha Singh', role: 'user', email: 'aastha@example.com' };
      setCurrentUser(fallback);
      localStorage.setItem('careon_user', JSON.stringify(fallback));
    }
  };

  const handleLoginDemoAdmin = async () => {
    try {
      const res = await loginUser('admin@careon.org', 'admin123');
      localStorage.setItem('careon_token', res.access_token);
      localStorage.setItem('careon_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      setCurrentTab('admin');
      loadSystemData();
    } catch (err) {
      console.warn('Demo admin login notice:', err);
      const fallback = { name: 'Coordinator Rajesh Rao', role: 'admin', email: 'admin@careon.org' };
      setCurrentUser(fallback);
      localStorage.setItem('careon_user', JSON.stringify(fallback));
      setCurrentTab('admin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('careon_token');
    localStorage.removeItem('careon_user');
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleNavigate = (tab, code = null) => {
    if (code) {
      setActiveIncidentCode(code);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmergencySubmitted = (code) => {
    setActiveIncidentCode(code);
    setCurrentTab('track');
    loadSystemData();
  };

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
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
        currentUser={currentUser}
        onLoginDemoUser={handleLoginDemoUser}
        onLoginDemoAdmin={handleLoginDemoAdmin}
        onLogout={handleLogout}
      />

      <main className="container" style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <Home lang={lang} onNavigate={handleNavigate} />
        )}

        {currentTab === 'report' && (
          <ReportEmergency
            lang={lang}
            onSubmitted={handleEmergencySubmitted}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'track' && (
          <TrackRequest
            lang={lang}
            initialIncidentCode={activeIncidentCode}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyPolicy />
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
      />

      <Footer lang={lang} onTabChange={handleNavigate} />
    </div>
  );
}
