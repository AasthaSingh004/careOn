import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../translations';
import {
  fetchIncidents,
  fetchNotifications,
  markNotificationAsRead,
  submitFeedback,
  logoutUser
} from '../api';
import {
  AlertTriangle,
  Clock,
  Shield,
  User,
  Phone,
  Mail,
  PlusCircle,
  Eye,
  CheckCircle2,
  Bell,
  MessageSquare,
  LogOut,
  RefreshCw,
  ExternalLink,
  Star,
  MapPin,
  FileText
} from 'lucide-react';

export default function UserDashboard({ lang = 'en', currentUser, onNavigate, onSelectIncident }) {
  const { t } = useTranslation(lang);
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackIncidentId, setFeedbackIncidentId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const loadUserData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [incList, notifList] = await Promise.all([
        fetchIncidents({ my_requests_only: true }, 'user').catch(() => []),
        fetchNotifications('user').catch(() => []),
      ]);
      setIncidents(incList);
      setNotifications(notifList);
    } catch (err) {
      console.error('Error fetching user dashboard data:', err);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = () => {
    logoutUser();
    if (onNavigate) {
      onNavigate('user_login');
    }
  };

  const handleTrackIncident = (incidentCode) => {
    if (onSelectIncident) {
      onSelectIncident(incidentCode);
    }
    if (onNavigate) {
      onNavigate('user_track', incidentCode);
    }
  };

  const handleOpenFeedback = (incId) => {
    setFeedbackIncidentId(incId);
    setRating(5);
    setComments('');
    setFeedbackSuccess(false);
    setShowFeedbackModal(true);
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackIncidentId) return;
    try {
      await submitFeedback({
        incident_id: feedbackIncidentId,
        rating,
        comments,
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    }
  };

  const getStatusBadgeClass = (st) => {
    switch (st?.toLowerCase()) {
      case 'critical':
      case 'pending': return 'badge-warning';
      case 'verified':
      case 'dispatched':
      case 'on_scene':
      case 'responded': return 'badge-info';
      case 'resolved': return 'badge-success';
      case 'cancelled': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Top Greeting & Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
        color: '#ffffff',
        borderRadius: 16,
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 20px -5px rgba(13, 148, 136, 0.3)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Shield size={14} />
            <span>{t('authenticated_citizen_badge') || 'Verified Citizen Account'}</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            {t('welcome_back') || 'Welcome,'} {currentUser?.name || 'Citizen'}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.9rem', opacity: 0.9 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Mail size={16} />
              {currentUser?.email || 'aastha@example.com'}
            </span>
            {currentUser?.phone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Phone size={16} />
                {currentUser?.phone}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} />
              Mysuru, Karnataka
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => loadUserData(true)}
            className="btn"
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '0.6rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              fontWeight: 600
            }}
            title={t('refresh_feed')}
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            <span>{t('refresh')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn"
            style={{
              background: '#ffffff',
              color: '#0f766e',
              border: 'none',
              borderRadius: 8,
              padding: '0.6rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <LogOut size={16} />
            <span>{t('logout_btn')}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {/* Action 1: Report Emergency */}
        <div
          onClick={() => onNavigate('user_report')}
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            border: '2px solid #fecdd3',
            borderRadius: 14,
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          className="hover-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e11d48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48', background: '#ffe4e6', padding: '3px 8px', borderRadius: 12, border: '1px solid #f43f5e' }}>
              URGENT
            </span>
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#9f1239', fontSize: '1.15rem', fontWeight: 700 }}>
            {t('nav_report')}
          </h3>
          <p style={{ margin: 0, color: '#881337', fontSize: '0.875rem' }}>
            {t('user_action_report_desc') || 'Submit an urgent medical, fire, or accident emergency with GPS.'}
          </p>
        </div>

        {/* Action 2: Track Request */}
        <div
          onClick={() => onNavigate('user_track')}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 14,
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          className="hover-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '3px 8px', borderRadius: 12 }}>
              LIVE
            </span>
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 700 }}>
            {t('nav_track')}
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
            {t('user_action_track_desc') || 'View real-time dispatch progress, responder ETA, and notes.'}
          </p>
        </div>

        {/* Action 3: Sahara Companion */}
        <div
          onClick={() => {
            const chatBtn = document.querySelector('.sahara-bubble-btn');
            if (chatBtn) chatBtn.click();
          }}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 14,
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          className="hover-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#0d9488', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f766e', background: '#ccfbf1', padding: '3px 8px', borderRadius: 12 }}>
              24/7 AI
            </span>
          </div>
          <h3 style={{ margin: '0 0 0.4rem 0', color: '#0f172a', fontSize: '1.15rem', fontWeight: 700 }}>
            {t('hero_sahara_btn')}
          </h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
            {t('user_action_sahara_desc') || 'Ask Sahara for emergency guidance, triage steps, or helpline assistance.'}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: My Emergency Requests */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={20} color="#0d9488" />
              <span>{t('my_requests_title') || 'My Emergency Incidents'}</span>
            </h2>
            <button
              onClick={() => onNavigate('user_report')}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <PlusCircle size={15} />
              <span>{t('btn_report_new') || 'Report New Emergency'}</span>
            </button>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <RefreshCw size={28} className="spin" style={{ margin: '0 auto 1rem auto', display: 'block', color: '#0d9488' }} />
              <p>{t('loading')}</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', borderRadius: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0fdf4', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
                {t('no_incidents_title') || 'No Active Emergency Incidents'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto 1.5rem auto' }}>
                {t('no_incidents_desc') || 'You have not submitted any emergency requests yet. If you require medical, fire or rescue assistance, report an incident anytime.'}
              </p>
              <button
                onClick={() => onNavigate('user_report')}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <PlusCircle size={16} />
                <span>{t('hero_report_btn')}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', fontFamily: 'monospace' }}>
                          {inc.incident_code}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(inc.status)}`}>
                          {t(`status_${inc.status?.toLowerCase()}`) || inc.status}
                        </span>
                        {inc.priority && (
                          <span className={`badge ${inc.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>
                            {t(`priority_${inc.priority?.toLowerCase()}`) || inc.priority}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>
                        {t(`cat_${inc.category?.toLowerCase()}`) || inc.category}: {inc.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleTrackIncident(inc.incident_code)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <Eye size={15} />
                        <span>{t('track_incident_btn') || 'Track Live'}</span>
                      </button>
                      {inc.status === 'Resolved' && (
                        <button
                          onClick={() => handleOpenFeedback(inc.id)}
                          className="btn"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <Star size={14} color="#f59e0b" fill="#f59e0b" />
                          <span>{t('feedback') || 'Feedback'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.825rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={14} />
                      {inc.location_name || 'Mysuru, Karnataka'}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} />
                      {new Date(inc.created_at).toLocaleString()}
                    </span>
                    {inc.assigned_resource_id && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#0f766e', fontWeight: 600 }}>
                        <Shield size={14} />
                        {t('resource_dispatched') || 'Response Team Assigned'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: User Notifications & Helpline Card */}
        <div>
          {/* Notifications List */}
          <div className="card" style={{ padding: '1.25rem', borderRadius: 14, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bell size={18} color="#0d9488" />
                <span>{t('recent_notifications') || 'My Notifications'}</span>
              </h3>
              <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                {notifications.length}
              </span>
            </div>

            {notifications.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', margin: '1.5rem 0' }}>
                {t('no_notifications') || 'No new notifications.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 360, overflowY: 'auto' }}>
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 8,
                      background: n.is_read ? '#f8fafc' : '#f0fdfa',
                      borderLeft: `3px solid ${n.is_read ? '#cbd5e1' : '#0d9488'}`,
                      fontSize: '0.85rem'
                    }}
                  >
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#1e293b' }}>
                      {n.title}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#475569', fontSize: '0.8rem' }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency 112 Advisory Card */}
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1px solid #fca5a5',
            borderRadius: 14,
            padding: '1.25rem',
            color: '#991b1b'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem', fontWeight: 700 }}>
              <Phone size={16} />
              <span>{t('helpline_alert_title') || 'National Emergency Helpline'}</span>
            </h4>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.825rem', lineHeight: 1.4 }}>
              {t('helpline_alert_desc') || 'For life-threatening emergencies, dial 112 directly. CareOn is a decision-support and dispatch coordination platform.'}
            </p>
            <a
              href="tel:112"
              className="btn"
              style={{
                width: '100%',
                background: '#dc2626',
                color: '#fff',
                textAlign: 'center',
                textDecoration: 'none',
                padding: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 8,
                display: 'block',
                boxSizing: 'border-box'
              }}
            >
              {t('dial_112_btn') || 'Call 112 Now'}
            </a>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 450 }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              {t('submit_feedback_title') || 'Rate Response Coordination'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 1.25rem 0' }}>
              {t('feedback_intro') || 'Your feedback helps improve emergency dispatch times and coordinator accuracy.'}
            </p>

            {feedbackSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#16a34a' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: 600 }}>{t('feedback_thanks') || 'Thank you for your feedback!'}</p>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {t('rating_label') || 'Rating (1 - 5 stars)'}
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 4
                        }}
                      >
                        <Star
                          size={28}
                          color="#f59e0b"
                          fill={star <= rating ? '#f59e0b' : 'transparent'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    {t('comments_label') || 'Comments or Coordinator Notes'}
                  </label>
                  <textarea
                    rows={3}
                    className="input-field"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    placeholder={t('feedback_comments_placeholder') || 'How was the responder arrival and communication?'}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {t('submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
