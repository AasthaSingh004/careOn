import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchIncidents,
  fetchResources,
  fetchProviders,
  fetchShortages,
  fetchAnalytics,
  fetchPredictions,
  fetchFeedbackList,
  updateIncidentStatus,
  updateIncidentPriority,
  confirmAllocation,
  releaseAllocation,
  getMultiAllocations,
  updateResourceStatus,
  createProviderEnquiry,
  updateProviderEnquiry,
  acknowledgeCancellation,
  resolveIncident,
  resetSimulationData,
  fetchAdminDoctorCallbacks,
  updateDoctorCallbackStatus,
  fetchAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from '../api';
import { useTranslation } from '../translations';
import { formatISTTime, formatISTDateTime } from '../utils/date';
import LeafletMap from '../components/LeafletMap';
import {
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Truck,
  Building2,
  Brain,
  MapPin,
  Flame,
  Activity,
  Layers,
  FileCheck2,
  TrendingUp,
  Waves,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  X,
  Volume2,
  VolumeX,
  Stethoscope,
  Bell,
  CheckCheck
} from 'lucide-react';

// Emergency Sound Player using Web Audio API (Stage 4)
export class EmergencySoundPlayer {
  constructor() {
    this.audioCtx = null;
    this.intervalId = null;
  }

  init() {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass && !this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext not supported or restricted:', e);
    }
  }

  playBeep() {
    this.init();
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.1);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Failed to play emergency alert sound:', e);
    }
  }

  startLoop() {
    this.playBeep();
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.playBeep();
      }, 3500);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const emergencySound = new EmergencySoundPlayer();

export function getAckIncidentIds() {
  if (typeof window === 'undefined') return [];
  try {
    const val = localStorage.getItem('careon_ack_incident_ids');
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveAckIncidentId(id) {
  if (typeof window === 'undefined') return;
  try {
    const acks = getAckIncidentIds();
    if (!acks.includes(id)) {
      localStorage.setItem('careon_ack_incident_ids', JSON.stringify([...acks, id]));
    }
  } catch {}
}

export function getSeenIncidentIds() {
  if (typeof window === 'undefined') return [];
  try {
    const val = localStorage.getItem('careon_seen_incident_ids');
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveSeenIncidentIds(ids) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('careon_seen_incident_ids', JSON.stringify(ids));
  } catch {}
}

export default function AdminDashboard({ lang = 'en', currentUser, onNavigate }) {
  const { t } = useTranslation(lang);
  const [activeTab, setActiveTab] = useState('overview'); // overview, incidents, resources, allocation, providers, map, simulation, verification, disaster, analytics

  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [providers, setProviders] = useState([]);
  const [shortages, setShortages] = useState({ shortages: [], available_fleet_summary: {} });
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [doctorCallbacks, setDoctorCallbacks] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [allocRecommendations, setAllocRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshError, setRefreshError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Sound & Emergency Alert States (Stage 4)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('careon_admin_sound_enabled') === 'true';
  });
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState(null);

  // Selected Incident Drawer / Modal
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [overridePriority, setOverridePriority] = useState('Critical');
  const [priorityReason, setPriorityReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Simulation State
  const [isSimulatingMapMovement, setIsSimulatingMapMovement] = useState(false);

  const showNotice = (msg, type = 'info') => {
    setActionNotice({ msg, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const loadAllData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
      setRefreshError(null);
    }
    setLoading(true);
    try {
      // Fetch fresh data from actual APIs (Stage 3 & Stage 6)
      const inc = await fetchIncidents({}, 'admin');
      const [res, prov, short, ana, pred, fb, cbs, notifs, allocRecs] = await Promise.all([
        fetchResources({}, 'admin').catch(() => []),
        fetchProviders('admin').catch(() => []),
        fetchShortages().catch(() => ({ shortages: [], available_fleet_summary: {} })),
        fetchAnalytics().catch(() => null),
        fetchPredictions().catch(() => []),
        fetchFeedbackList().catch(() => []),
        fetchAdminDoctorCallbacks().catch(() => []),
        (typeof fetchAdminNotifications === 'function' ? fetchAdminNotifications() : Promise.resolve([])).catch(() => []),
        (typeof getMultiAllocations === 'function' ? getMultiAllocations() : Promise.resolve([])).catch(() => []),
      ]);
      setIncidents(inc || []);
      setResources(res || []);
      setProviders(prov || []);
      setShortages(short || { shortages: [], available_fleet_summary: {} });
      setAnalytics(ana);
      setPredictions(pred || []);
      setFeedbackList(fb || []);
      setDoctorCallbacks(cbs || []);
      setAdminNotifications(notifs || []);
      setAllocRecommendations(allocRecs || []);
      setLastUpdated(new Date());

      // Detect genuinely new emergency reports (Stage 4)
      if (typeof window !== 'undefined' && inc && inc.length > 0) {
        const storedSeen = localStorage.getItem('careon_seen_incident_ids');
        if (storedSeen === null) {
          saveSeenIncidentIds(inc.map((i) => i.id));
        } else {
          const seenIds = getSeenIncidentIds();
          const ackIds = getAckIncidentIds();
          const newEmergency = inc.find(
            (i) => i.status === 'Pending' && !seenIds.includes(i.id) && !ackIds.includes(i.id)
          );
          if (newEmergency) {
            setActiveEmergencyAlert(newEmergency);
            saveSeenIncidentIds([...seenIds, newEmergency.id]);
            if (soundEnabledRef.current) {
              emergencySound.startLoop();
            }
          }
        }
      }

      if (isManualRefresh) {
        showNotice(t('feed_refreshed') || 'Feed refreshed successfully with live incident data.', 'success');
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
      if (isManualRefresh) {
        setRefreshError(t('refresh_failed') || 'Failed to refresh live data from server.');
        showNotice(t('refresh_failed') || 'Failed to refresh live data from server.', 'error');
      }
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 6000); // 6s refresh
    return () => {
      clearInterval(interval);
      emergencySound.stop();
    };
  }, [loadAllData]);

  const handleAcknowledgeAlert = () => {
    if (activeEmergencyAlert) {
      saveAckIncidentId(activeEmergencyAlert.id);
      emergencySound.stop();
      setActiveEmergencyAlert(null);
      showNotice(t('alert_acknowledged') || 'Alert acknowledged and silenced.', 'success');
    }
  };

  const handleViewAlertIncident = () => {
    if (activeEmergencyAlert) {
      const target = activeEmergencyAlert;
      handleAcknowledgeAlert();
      setSelectedIncident(target);
      setActiveTab('incidents');
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careon_admin_sound_enabled', String(next));
      if (next) {
        emergencySound.init();
        emergencySound.playBeep();
      } else {
        emergencySound.stop();
      }
    }
  };

  // Actions
  const handleVerify = async (incId) => {
    try {
      await updateIncidentStatus(incId, 'Verified', 'Coordinator verified incident via direct review.');
      showNotice(`Incident #${incId} marked as Verified.`);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePriorityOverride = async (incId) => {
    if (!priorityReason.trim()) {
      alert('Please enter a coordinator reason for overriding priority.');
      return;
    }
    try {
      await updateIncidentPriority(incId, overridePriority, priorityReason);
      showNotice(`Priority updated to ${overridePriority}.`);
      setPriorityReason('');
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignResource = async (incId, resId) => {
    try {
      await confirmAllocation(incId, resId, 'Assigned by Command Centre Coordinator.');
      showNotice(`Resource successfully assigned and dispatched.`);
      await loadAllData();
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  const handleReleaseResource = async (resId) => {
    try {
      await updateResourceStatus(resId, 'Available');
      showNotice(`Resource status updated to Available.`);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAcknowledgeCancellation = async (incId) => {
    try {
      await acknowledgeCancellation(incId);
      showNotice(`Cancellation acknowledged. All attached resources safely released.`);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResolveIncident = async (incId) => {
    try {
      await resolveIncident(incId, 'Coordinator marked incident resolved onsite.');
      showNotice(`Incident #${incId} successfully resolved.`);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSimulateContactProvider = async (incId, provId) => {
    try {
      await createProviderEnquiry({
        incident_id: incId,
        provider_id: provId,
        charge_quote: 1500.0,
        subsidy_amount: 500.0,
        user_consent: 'Pending',
        response_time_minutes: 12,
        notes: 'Simulated partner enquiry - provider confirmed vehicle standby.',
      });
      showNotice(`Partner contacted. Awaiting user consent for quotation.`);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateDoctorCallback = async (callbackId, newStatus, notes = '') => {
    try {
      await updateDoctorCallbackStatus(callbackId, {
        status: newStatus,
        admin_notes: notes || undefined,
        assigned_to: currentUser?.name || 'Aastha Singh',
      });
      showNotice(`Doctor callback marked as "${newStatus}".`, 'success');
      const updated = await fetchAdminDoctorCallbacks().catch(() => []);
      setDoctorCallbacks(updated);
    } catch (err) {
      showNotice(`Failed to update callback: ${err.message}`, 'error');
    }
  };

  const handleMarkNotifRead = async (id) => {
    try {
      await markAdminNotificationAsRead(id);
      setAdminNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (e) {
      console.warn('Failed to mark notification read:', e);
    }
  };

  const handleMarkAllNotifsRead = async () => {
    try {
      await markAllAdminNotificationsAsRead();
      setAdminNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.warn('Failed to mark all notifications read:', e);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await handleMarkNotifRead(notif.id);
    }
    setShowNotifDropdown(false);
    if (notif.action_url) {
      if (notif.action_url.includes('callback') || notif.action_url.includes('verification')) {
        setActiveTab('verification');
      } else if (notif.action_url.includes('incident')) {
        setActiveTab('incidents');
      } else if (notif.action_url.includes('analytics') || notif.action_url.includes('feedback')) {
        setActiveTab('analytics');
      } else if (notif.action_url.includes('allocation')) {
        setActiveTab('allocation');
      }
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset simulation database to clean state?')) return;
    try {
      await resetSimulationData();
      showNotice('Simulation database reset successfully.', 'success');
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Toast Notice */}
      {actionNotice && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 3000,
            backgroundColor: actionNotice.type === 'error' ? '#B42318' : '#171C24',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '13.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {actionNotice.type === 'error' ? '✕ ' : '✓ '}
          {typeof actionNotice === 'string' ? actionNotice : actionNotice.msg}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#171C24', margin: 0 }}>
              {t('command_centre_title') || 'Command Centre'}
            </h1>
            <span className="status-badge badge-resolved" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} />
              <span>{currentUser?.name || 'Aastha Singh'} ({t('admin_role') || 'Coordinator'})</span>
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#344252', marginTop: '4px' }}>
            {t('command_centre_subtitle') || 'Real-time incident triage, capability matching, shortage alerts, and partner coordination across Mysuru.'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {lastUpdated && !refreshError && (
            <span style={{ fontSize: '12px', color: '#027A48', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {t('updated_just_now', 'Updated just now')}
            </span>
          )}
          {refreshError && (
            <span style={{ fontSize: '12px', color: '#B42318', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {refreshError}
            </span>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => loadAllData(true)}
            disabled={loading || refreshing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: '#DCE5EB', color: '#171C24', background: '#FFFFFF', fontWeight: 700, borderRadius: 8 }}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            <span>{refreshing ? t('refreshing') || 'Refreshing...' : t('refresh_feed') || 'Refresh Feed'}</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleToggleSound}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: soundEnabled ? '#F5F6F7' : '#FFFFFF',
              borderColor: '#DCE5EB',
              color: soundEnabled ? '#F04438' : '#344252',
              fontWeight: 700,
              borderRadius: 8
            }}
            title={soundEnabled ? t('sound_enabled', 'Sound: On') : t('sound_disabled', 'Sound: Off')}
          >
            {soundEnabled ? <Volume2 size={14} color="#F04438" /> : <VolumeX size={14} color="#667085" />}
            <span>{soundEnabled ? t('sound_enabled', 'Sound: On') : t('sound_disabled', 'Sound: Off')}</span>
          </button>

          {/* Coordinator Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: showNotifDropdown ? '#F5F6F7' : '#ffffff',
                borderColor: '#DCE5EB',
                color: '#171C24',
                position: 'relative',
                fontWeight: 700,
                borderRadius: 8
              }}
              title={t('admin_notifications_title', 'Coordinator Alerts')}
            >
              <Bell size={14} color="#F04438" />
              <span>{t('admin_notifications_title', 'Alerts')}</span>
              {adminNotifications.filter((n) => !n.is_read).length > 0 && (
                <span
                  style={{
                    backgroundColor: '#F04438',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {adminNotifications.filter((n) => !n.is_read).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown / Drawer Popover */}
            {showNotifDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  zIndex: 2500,
                  width: '360px',
                  maxWidth: '90vw',
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                  border: '1px solid #DCE5EB',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: '#F5F6F7',
                    borderBottom: '1px solid #DCE5EB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Bell size={16} color="#F04438" />
                    <strong style={{ fontSize: '13.5px', color: '#171C24' }}>
                      {t('admin_notifications_title', 'Coordinator Alerts')}
                    </strong>
                  </div>
                  {adminNotifications.some((n) => !n.is_read) && (
                    <button
                      type="button"
                      onClick={handleMarkAllNotifsRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#F04438',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <CheckCheck size={13} />
                      {t('admin_notifications_mark_all', 'Mark All Read')}
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  {adminNotifications && adminNotifications.length > 0 ? (
                    adminNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #DCE5EB',
                          backgroundColor: notif.is_read ? '#ffffff' : '#F5F6F7',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              fontWeight: notif.is_read ? 600 : 800,
                              fontSize: '13px',
                              color: notif.type === 'alert' ? '#B42318' : notif.type === 'warning' ? '#B45309' : '#171C24',
                            }}
                          >
                            {notif.title}
                          </span>
                          <span style={{ fontSize: '11px', color: '#667085', whiteSpace: 'nowrap' }}>
                            {formatISTTime(notif.created_at)}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#344252', lineHeight: 1.4 }}>
                          {notif.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: '#667085', fontSize: '13px' }}>
                      {t('admin_notifications_empty', 'No coordinator notifications yet.')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-sm" onClick={handleResetDemoData} style={{ background: '#FEE4E2', color: '#B42318', border: '1px solid #FECDCA', fontWeight: 700, borderRadius: 8, cursor: 'pointer' }}>
            ↺ {t('reset_demo_state', 'Reset Simulation')}
          </button>
        </div>
      </div>

      {/* Prominent Emergency Alert Banner (Stage 4) */}
      {activeEmergencyAlert && (
        <div
          className="emergency-alert-banner"
          role="alert"
          aria-live="assertive"
          style={{
            background: '#FEE4E2',
            border: '2px solid #F04438',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 14px rgba(240, 68, 56, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: 280 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#F04438',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#B42318' }}>
                  {t('new_emergency_alert', '🚨 New Emergency Alert: Immediate Action Required')}
                </span>
                <span className="status-badge badge-critical" style={{ fontSize: '11px', fontWeight: 800 }}>
                  {activeEmergencyAlert.incident_code}
                </span>
                <span className="status-badge badge-critical" style={{ fontSize: '11px' }}>
                  {t(activeEmergencyAlert.category)}
                </span>
                <span className="status-badge badge-critical" style={{ fontSize: '11px' }}>
                  {t(activeEmergencyAlert.priority)}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#171C24', fontWeight: 700 }}>
                {activeEmergencyAlert.location_name} • {activeEmergencyAlert.description}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7A271A', marginTop: 3 }}>
                {activeEmergencyAlert.contact_name} ({activeEmergencyAlert.contact_phone}) • {formatISTTime(activeEmergencyAlert.created_at)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleAcknowledgeAlert}
              className="btn btn-primary-red"
              style={{
                background: '#F04438',
                color: '#ffffff',
                fontWeight: 700,
                padding: '0.55rem 1.1rem',
                borderRadius: 8,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(240, 68, 56, 0.4)',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              <span>{t('acknowledge_alert', 'Acknowledge & Silence')}</span>
            </button>
            <button
              onClick={handleViewAlertIncident}
              className="btn"
              style={{
                background: '#ffffff',
                color: '#171C24',
                border: '1px solid #DCE5EB',
                fontWeight: 700,
                padding: '0.55rem 1rem',
                borderRadius: 8,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <span>{t('view_incident_triage', 'View & Triage')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Top 4 Overview Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', borderRadius: 14 }}>
          <div className="stat-icon" style={{ backgroundColor: '#FEE4E2', color: '#B42318' }}>🚨</div>
          <div>
            <div className="stat-val" style={{ color: '#171C24', fontWeight: 800 }}>{analytics?.active_incidents || incidents.filter(i => !['Resolved','Cancelled'].includes(i.status)).length}</div>
            <div className="stat-label" style={{ color: '#344252' }}>{t('stat_active_incidents') || 'Active Incidents'}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', borderRadius: 14 }}>
          <div className="stat-icon" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>⚡</div>
          <div>
            <div className="stat-val" style={{ color: '#171C24', fontWeight: 800 }}>{analytics?.critical_incidents || incidents.filter(i => i.priority === 'Critical').length}</div>
            <div className="stat-label" style={{ color: '#344252' }}>{t('stat_critical_priority') || 'Critical Priority'}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', borderRadius: 14 }}>
          <div className="stat-icon" style={{ backgroundColor: '#ECFDF3', color: '#027A48' }}>🚑</div>
          <div>
            <div className="stat-val" style={{ color: '#171C24', fontWeight: 800 }}>{resources.filter(r => r.status === 'Available').length}</div>
            <div className="stat-label" style={{ color: '#344252' }}>{t('stat_fleet_available') || 'Fleet Available'}</div>
          </div>
        </div>

        <div className="stat-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', borderRadius: 14 }}>
          <div className="stat-icon" style={{ backgroundColor: '#FEE4E2', color: '#B42318' }}>⚠️</div>
          <div>
            <div className="stat-val" style={{ color: '#171C24', fontWeight: 800 }}>{shortages.shortages?.length || 0}</div>
            <div className="stat-label" style={{ color: '#344252' }}>{t('stat_active_shortages') || 'Active Shortages'}</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '2px solid #DCE5EB',
          paddingBottom: '8px',
          marginBottom: '24px',
        }}
      >
        {[
          { id: 'overview', label: t('tab_overview', '📊 Overview') },
          { id: 'incidents', label: `${t('tab_incidents', '🚨 Incidents')} (${incidents.length})` },
          { id: 'resources', label: `${t('tab_resources', '🚑 Fleet Resources')} (${resources.length})` },
          { id: 'allocation', label: t('tab_allocations', '🧠 Smart Allocation') },
          { id: 'providers', label: `${t('tab_providers', '🏥 External Partners')} (${providers.length})` },
          { id: 'map', label: t('tab_map', '🗺️ Mysuru Live Map') },
          { id: 'simulation', label: t('tab_simulation', '🎯 Shortage Challenge') },
          { id: 'verification', label: t('tab_verification', '🔍 Trust & Verification') },
          { id: 'disaster', label: t('tab_disaster', '🌊 Disaster Relief') },
          { id: 'analytics', label: t('tab_analytics', '📈 Analytics & Predictions') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === tab.id ? '#171C24' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#344252',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#171C24' : '#DCE5EB',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: OVERVIEW */}
      {/* ==================================================================== */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Active Incidents Queue */}
          <div className="card">
            <h3 className="card-title">
              <span>{t('active_incident_queue_title', 'Active Incident Priority Queue')}</span>
              <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('incidents')}>
                {t('btn_view_all', 'View All')}
              </button>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {incidents.slice(0, 5).map((inc) => (
                <div
                  key={inc.id}
                  style={{
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: inc.status === 'Verification Pending' ? '#fffbeb' : '#ffffff',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <strong>{inc.incident_code}</strong>
                      <span className={`status-badge ${inc.priority === 'Critical' ? 'badge-critical' : 'badge-high'}`}>
                        {t(inc.priority)}
                      </span>
                      {inc.is_duplicate && (
                        <span className="status-badge badge-critical" style={{ fontSize: '10px' }}>
                          {t('duplicate_flag_badge', 'Duplicate Flag')}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      {t(`cat_${inc.category?.toLowerCase()}`) || inc.category} • {inc.location_name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedIncident(inc);
                        setActiveTab('incidents');
                      }}
                    >
                      {t('btn_inspect', 'Inspect')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Fleet & Shortage Summary */}
          <div className="card">
            <h3 className="card-title">{t('fleet_availability_title', 'Fleet Availability & Immediate Shortages')}</h3>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#171C24', marginBottom: '8px' }}>
                {t('fleet_categories_label', 'Fleet Categories:')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {resources.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{res.resource_code} ({t(`cat_${res.category?.toLowerCase()}`) || res.category})</span>
                    <strong style={{ color: res.status === 'Available' ? '#166534' : '#1e40af' }}>
                      {t(res.status)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {shortages.shortages && shortages.shortages.length > 0 && (
              <div style={{ backgroundColor: '#fff1f2', border: '1px solid #fecdd3', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 800, color: '#9f1239', fontSize: '13px', marginBottom: '4px' }}>
                  {t('critical_shortage_detected', '⚠️ Critical Shortage Detected:')}
                </div>
                <div style={{ fontSize: '12.5px', color: '#881337', lineHeight: 1.4 }}>
                  {shortages.shortages.map((s, idx) => (
                    <div key={idx}>
                      • {t('missing_label', 'Missing')} <strong>{t(s.missing_resource_type)}</strong> {t('for_incident', 'for')} {s.incident_code}. {t('recommended_action_prefix', 'Recommended action:')} {t('coordinate_with', 'coordinate with')} <strong>{s.suggested_provider?.name || t('registered_partner_badge', 'Registered Partner')}</strong>.
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: INCIDENT MANAGEMENT */}
      {/* ==================================================================== */}
      {activeTab === 'incidents' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{t('incident_mgmt_title', 'Incident Management & Verification Queue')}</h3>
          </div>

          <div className="table-wrapper">
            <table className="careon-table">
              <thead>
                <tr>
                  <th>{t('th_code', 'Code')}</th>
                  <th>{t('th_category', 'Category')}</th>
                  <th>{t('th_location', 'Location')}</th>
                  <th>{t('th_reporter', 'Reporter')}</th>
                  <th>{t('th_priority', 'Priority')}</th>
                  <th>{t('th_status', 'Status')}</th>
                  <th>{t('th_verified', 'Verified')}</th>
                  <th>{t('th_actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td><strong>{inc.incident_code}</strong></td>
                    <td>{t(`cat_${inc.category?.toLowerCase()}`) || inc.category}</td>
                    <td>{inc.location_name}</td>
                    <td>{inc.contact_name} ({inc.contact_phone})</td>
                    <td>
                      <span className={`status-badge ${inc.priority === 'Critical' ? 'badge-critical' : inc.priority === 'High' ? 'badge-high' : 'badge-low'}`}>
                        {t(inc.priority)}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge badge-dispatched">{t(inc.status)}</span>
                    </td>
                    <td>
                      {inc.is_verified ? (
                        <span style={{ color: '#166534', fontWeight: 700 }}>{t('verified_label', '✓ Verified')}</span>
                      ) : (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleVerify(inc.id)}
                          style={{ fontSize: '11px', padding: '3px 6px' }}
                        >
                          {t('btn_verify_otp', 'Verify OTP')}
                        </button>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedIncident(inc)}
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                        >
                          {t('btn_details', 'Details')}
                        </button>

                        {inc.status === 'Cancelled' && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleAcknowledgeCancellation(inc.id)}
                            style={{ fontSize: '11px', color: '#f59e0b', padding: '4px 8px' }}
                          >
                            {t('btn_release_fleet', 'Release Fleet')}
                          </button>
                        )}

                        {inc.status !== 'Resolved' && inc.status !== 'Cancelled' && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleResolveIncident(inc.id)}
                            style={{ fontSize: '11px', color: '#166534', padding: '4px 8px' }}
                          >
                            {t('btn_resolve', 'Resolve')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Incident Drawer / Details Modal */}
          {selectedIncident && (
            <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                    {t('btn_details', 'Incident Details')}: {selectedIncident.incident_code}
                  </h3>
                  <button onClick={() => setSelectedIncident(null)} style={{ fontSize: '18px' }}>✕</button>
                </div>

                <div style={{ fontSize: '13.5px', lineHeight: 1.6, marginBottom: '16px' }}>
                  <p><strong>{t('lbl_category', 'Category')}:</strong> {t(`cat_${selectedIncident.category?.toLowerCase()}`) || selectedIncident.category}</p>
                  <p><strong>{t('lbl_description', 'Description')}:</strong> {selectedIncident.description}</p>
                  <p><strong>{t('lbl_location', 'Location')}:</strong> {selectedIncident.location_name} ({selectedIncident.latitude.toFixed(4)}, {selectedIncident.longitude.toFixed(4)})</p>
                  <p><strong>{t('lbl_casualties', 'Casualties / Affected')}:</strong> {selectedIncident.affected_people} individuals</p>
                  <p><strong>{t('lbl_help_requested', 'Help Requested')}:</strong> {selectedIncident.help_required}</p>
                  <p><strong>{t('lbl_contact', 'Contact')}:</strong> {selectedIncident.contact_name} ({selectedIncident.contact_phone})</p>
                  <p><strong>{t('lbl_initial_priority_reason', 'Initial Priority Reason')}:</strong> {selectedIncident.priority_reason}</p>
                </div>

                {/* Priority Override Section */}
                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', color: '#171C24' }}>
                    {t('lbl_coordinator_priority_adj', 'Coordinator Priority Adjustment')}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <select
                      className="form-select"
                      style={{ width: '130px' }}
                      value={overridePriority}
                      onChange={(e) => setOverridePriority(e.target.value)}
                    >
                      <option value="Critical">{t('priority_critical', 'Critical')}</option>
                      <option value="High">{t('priority_high', 'High')}</option>
                      <option value="Medium">{t('priority_medium', 'Medium')}</option>
                      <option value="Low">{t('priority_low', 'Low')}</option>
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Reason for change (e.g. Multi-vehicle escalation)..."
                      value={priorityReason}
                      onChange={(e) => setPriorityReason(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handlePriorityOverride(selectedIncident.id)}
                  >
                    {t('btn_save_priority_change', 'Save Priority Change')}
                  </button>
                </div>

                {/* Conflict-Free Resource Assignment Action */}
                <div style={{ backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', color: '#166534' }}>
                    {t('lbl_available_fleet_units', 'Available Fleet Units (Direct Assignment):')}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {resources.filter(r => r.status === 'Available').map(res => (
                      <button
                        key={res.id}
                        className="btn btn-sm btn-outline"
                        style={{ backgroundColor: '#ffffff', color: '#166534', fontWeight: 600 }}
                        onClick={() => handleAssignResource(selectedIncident.id, res.id)}
                      >
                        {t('btn_assign_prefix', '+ Assign')} {res.name} ({t(`cat_${res.category?.toLowerCase()}`) || res.category})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: RESOURCE MANAGEMENT */}
      {/* ==================================================================== */}
      {activeTab === 'resources' && (
        <div className="card">
          <h3 className="card-title">{t('fleet_mgmt_title', 'Emergency Fleet Management')}</h3>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
            {t('fleet_mgmt_desc')}
          </p>

          <div className="grid-3">
            {resources.map((res) => (
              <div
                key={res.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '15px', color: '#171C24' }}>{res.name}</strong>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{t('th_code', 'Code')}: {res.resource_code}</div>
                  </div>
                  <span
                    className={`status-badge ${res.status === 'Available' ? 'badge-resolved' : res.status === 'Assigned' ? 'badge-dispatched' : 'badge-low'}`}
                  >
                    {t(res.status)}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
                  <div><strong>{t('lbl_category', 'Category')}:</strong> {t(`cat_${res.category?.toLowerCase()}`) || res.category}</div>
                  <div><strong>{t('base_label', 'Base')}:</strong> {res.location_name}</div>
                  <div><strong>{t('capabilities_label', 'Capabilities')}:</strong> {res.capabilities}</div>
                  <div><strong>{t('contact_label', 'Contact')}:</strong> {res.contact_phone}</div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {res.status !== 'Available' ? (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleReleaseResource(res.id)}
                      style={{ color: '#166534' }}
                    >
                      {t('btn_mark_available', 'Mark Available')}
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => updateResourceStatus(res.id, 'Under Maintenance')}
                      style={{ color: '#d97706' }}
                    >
                      {t('btn_set_maintenance', 'Set Maintenance')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: SMART ALLOCATION & SHORTAGES */}
      {/* ==================================================================== */}
      {activeTab === 'allocation' && (
        <div>
          {/* Explainable Allocation Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <div>
                <h3 className="card-title" style={{ margin: 0 }}>{t('smart_allocation_engine_title', 'Smart Resource Allocation Engine')}</h3>
                <p style={{ color: '#64748b', fontSize: '13.5px', margin: '4px 0 0 0' }}>
                  {t('smart_allocation_engine_desc')}
                </p>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  color: '#0f766e',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '11.5px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                ⚙️ {t('alloc_algorithm_badge', 'Rule-Based Multi-Factor Scoring Engine')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {incidents.filter(i => !['Resolved','Cancelled'].includes(i.status)).map((inc) => {
                const assigned = resources.find(r => r.current_assignment_id === inc.id);
                const rec = allocRecommendations.find(r => r.incident_id === inc.id);

                return (
                  <div
                    key={inc.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: assigned ? '#f0fdf4' : '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong>{inc.incident_code}</strong>
                        <span>({t(`cat_${inc.category?.toLowerCase()}`) || inc.category} in {inc.location_name})</span>
                        <span className={`status-badge ${inc.priority === 'Critical' ? 'badge-critical' : 'badge-high'}`}>
                          {t(inc.priority)}
                        </span>
                      </div>
                      <span className="status-badge badge-dispatched">{t(inc.status)}</span>
                    </div>

                    {assigned ? (
                      <div style={{ fontSize: '13px', color: '#166534' }}>
                        ✓ <strong>{t('assigned_resource_label', 'Assigned Resource')}:</strong> {assigned.name} ({t(`cat_${assigned.category?.toLowerCase()}`) || assigned.category}) • {t('base_label', 'Base')}: {assigned.location_name}
                      </div>
                    ) : (
                      <div>
                        {rec && rec.has_allocation ? (
                          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#171C24' }}>
                                🎯 {t('alloc_score_label', 'Confidence Score')}: <strong>{rec.confidence_percent || 85}%</strong>
                              </span>
                              {rec.auto_dispatch_recommended ? (
                                <span className="status-badge badge-resolved" style={{ fontSize: '11.5px' }}>
                                  ✓ {t('alloc_auto_dispatch', 'Safe for Auto-Dispatch')}
                                </span>
                              ) : (
                                <span className="status-badge badge-critical" style={{ fontSize: '11.5px' }}>
                                  ⚠️ {t('alloc_admin_review', 'Requires Coordinator Review')}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
                              {rec.explanation}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleAssignResource(inc.id, rec.resource_id)}
                              >
                                {t('btn_allocate', 'Allocate')} {rec.resource_code || rec.resource_name}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ fontSize: '13px', color: '#b91c1c' }}>
                              ⚠️ {t('unassigned_seeking_msg', 'Unassigned incident. Seeking specialist team match...')}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {resources.filter(r => r.status === 'Available').slice(0, 2).map((res) => (
                                <button
                                  key={res.id}
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleAssignResource(inc.id, res.id)}
                                >
                                  {t('btn_allocate', 'Allocate')} {res.resource_code}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shortage Management Panel */}
          <div className="card" style={{ backgroundColor: '#fff1f2', borderColor: '#fecdd3' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#9f1239', marginBottom: '8px' }}>
              {t('active_shortages_mgmt_title', 'Active Resource Shortage Management')}
            </h3>
            <p style={{ color: '#881337', fontSize: '13.5px', marginBottom: '16px' }}>
              {t('active_shortages_mgmt_desc')}
            </p>

            {shortages.shortages && shortages.shortages.length > 0 ? (
              shortages.shortages.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #fda4af',
                    padding: '14px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#9f1239', fontSize: '14px', marginBottom: '4px' }}>
                    {t('incident_label', 'Incident')} {s.incident_code}: {t('shortage_of_label', 'Shortage of')} {t(s.missing_resource_type)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
                    {t('lbl_location', 'Location')}: {s.location} • {t('lbl_category', 'Category')}: {t(`cat_${s.category?.toLowerCase()}`) || s.category}
                  </div>
                  {s.suggested_provider && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12.5px', color: '#171C24' }}>
                        {t('rec_partner_label', 'Recommended External Partner')}: <strong>{s.suggested_provider.name}</strong> ({t('base_label', 'Base')}: ₹{s.suggested_provider.estimated_charge})
                      </div>
                      <button
                        className="btn btn-primary-red btn-sm"
                        onClick={() => handleSimulateContactProvider(s.incident_id, s.suggested_provider.id)}
                      >
                        {t('btn_simulate_partner_contact', 'Simulate Partner Contact')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ color: '#166534', fontWeight: 600, fontSize: '13px' }}>
                {t('no_active_shortages_msg')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: EXTERNAL PROVIDERS */}
      {/* ==================================================================== */}
      {activeTab === 'providers' && (
        <div className="card">
          <h3 className="card-title">{t('external_providers_dir_title', 'Registered Partners & External Providers Directory')}</h3>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
            {t('external_providers_dir_desc')}
          </p>

          <div className="grid-2">
            {providers.map((prov) => (
              <div
                key={prov.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: prov.is_registered_partner ? '#f0fdfa' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#171C24' }}>{prov.name}</h4>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {prov.provider_type} • {prov.location_name}
                    </div>
                  </div>
                  <span className={`status-badge ${prov.is_registered_partner ? 'badge-resolved' : 'badge-low'}`}>
                    {prov.is_registered_partner ? t('registered_partner_badge', 'Registered Partner') : t('fallback_dir_badge', 'Fallback Directory')}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
                  <div><strong>{t('th_contact_person', 'Contact Person')}:</strong> {prov.contact_person} ({prov.phone})</div>
                  <div><strong>{t('capabilities_label', 'Capabilities')}:</strong> {prov.service_capabilities}</div>
                  <div><strong>{t('base_charge_label', 'Base Service Charge')}:</strong> ₹{prov.estimated_base_charge}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const firstActiveInc = incidents.find(i => !['Resolved','Cancelled'].includes(i.status));
                      if (firstActiveInc) {
                        handleSimulateContactProvider(firstActiveInc.id, prov.id);
                      } else {
                        alert('No active emergency incidents currently requiring external dispatch.');
                      }
                    }}
                  >
                    {t('btn_simulate_contact_quote', 'Simulate Contact & Quotation')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 6: LIVE MAP & DISPATCH */}
      {/* ==================================================================== */}
      {activeTab === 'map' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{t('live_map_dispatch_title', 'Live Geographical Dispatch & Tracking')}</h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>
                {t('live_map_dispatch_desc')}
              </p>
            </div>
            <button
              className="btn btn-primary-red btn-sm"
              onClick={() => setIsSimulatingMapMovement(!isSimulatingMapMovement)}
            >
              {isSimulatingMapMovement ? t('btn_pause_movement', '⏸ Pause Movement Simulation') : t('btn_simulate_movement', '▶ Simulate Live Dispatch Movement')}
            </button>
          </div>

          <LeafletMap
            incidents={incidents}
            resources={resources}
            providers={providers}
            isSimulationActive={isSimulatingMapMovement}
            lang={lang}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 7: SIMULATION CENTRE (RESOURCE SHORTAGE CHALLENGE) */}
      {/* ==================================================================== */}
      {activeTab === 'simulation' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#171C24' }}>
                {t('simulation_expo_title', '🎯 Resource Shortage Challenge — Interactive Walkthrough')}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '720px', marginTop: '4px' }}>
                {t('simulation_expo_desc')}
              </p>
            </div>
            <button className="btn btn-primary-red btn-sm" onClick={handleResetDemoData}>
              {t('btn_reset_scenario', '↺ Reset Scenario to Step 1')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#171C24', marginBottom: '6px' }}>
                {t('sim_step1_title')}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                {t('sim_step1_desc')}
              </p>
            </div>

            <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#171C24', marginBottom: '6px' }}>
                {t('sim_step2_title')}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                {t('sim_step2_desc')}
              </p>
            </div>

            <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#171C24', marginBottom: '6px' }}>
                {t('sim_step3_title')}
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '10px' }}>
                {t('sim_step3_desc')}
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const amb2 = resources.find(r => r.resource_code === 'AMB-02');
                  const inc102 = incidents.find(i => i.incident_code === 'CARE-2026-102');
                  if (amb2 && inc102) {
                    handleAssignResource(inc102.id, amb2.id);
                  }
                }}
              >
                {t('btn_assign_prefix', '+ Assign')} AMB-02 to CARE-2026-102
              </button>
            </div>

            <div style={{ padding: '16px', border: '1px solid #fecdd3', borderRadius: '8px', backgroundColor: '#fff1f2' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#9f1239', marginBottom: '6px' }}>
                {t('sim_step4_title')}
              </div>
              <p style={{ fontSize: '13px', color: '#881337', lineHeight: 1.5, marginBottom: '10px' }}>
                {t('sim_step4_desc')}
              </p>
              <button
                className="btn btn-primary-red btn-sm"
                onClick={() => {
                  const inc103 = incidents.find(i => i.incident_code === 'CARE-2026-103');
                  const prov = providers[1] || providers[0];
                  if (inc103 && prov) {
                    handleSimulateContactProvider(inc103.id, prov.id);
                  }
                }}
              >
                {t('btn_simulate_contact_quote', 'Record Partner Quote for CARE-2026-103')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 8: VERIFICATION & TRUST REVIEW */}
      {/* ==================================================================== */}
      {activeTab === 'verification' && (
        <div className="card">
          <h3 className="card-title">{t('trust_review_title', 'Reporter Verification & Trust Review')}</h3>
          <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
            {t('trust_review_desc')}
          </p>

          <div className="table-wrapper">
            <table className="careon-table">
              <thead>
                <tr>
                  <th>{t('th_incident_code', 'Incident Code')}</th>
                  <th>{t('th_contact_person', 'Contact Person')}</th>
                  <th>{t('th_phone_number', 'Phone Number')}</th>
                  <th>{t('th_otp_status', 'OTP Status')}</th>
                  <th>{t('th_duplicate_check', 'Duplicate Check')}</th>
                  <th>{t('th_trust_decision', 'Trust Decision')}</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td><strong>{inc.incident_code}</strong></td>
                    <td>{inc.contact_name}</td>
                    <td>{inc.contact_phone}</td>
                    <td>
                      {inc.is_verified ? (
                        <span style={{ color: '#166534', fontWeight: 700 }}>✓ {t('verified_label', 'Verified')}</span>
                      ) : (
                        <span style={{ color: '#b45309', fontWeight: 600 }}>{t('awaiting_otp_label', 'Awaiting OTP')}</span>
                      )}
                    </td>
                    <td>
                      {inc.is_duplicate ? (
                        <span className="status-badge badge-critical">{t('flagged_duplicate_badge', 'Flagged Proximity Duplicate')}</span>
                      ) : (
                        <span style={{ color: '#166534' }}>{t('unique_incident_badge', '✓ Unique Incident')}</span>
                      )}
                    </td>
                    <td>
                      <span className="status-badge badge-resolved">{t('genuine_incident_badge', 'Genuine Incident')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doctor Tele-Triage Callbacks Table */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
              <Stethoscope size={20} color="#F04438" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#171C24', margin: 0 }}>
                {t('tab_doctor_callbacks', '🩺 Doctor Callbacks')} & Clinical Triage Queue
              </h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '16px' }}>
              On-call medical tele-triage consultations requested by citizens. Update triage status and log coordinator guidance.
            </p>

            <div className="table-wrapper">
              <table className="careon-table">
                <thead>
                  <tr>
                    <th>{t('th_incident_code', 'Incident Code')}</th>
                    <th>{t('th_contact_person', 'Contact Person')}</th>
                    <th>{t('th_phone_number', 'Phone Number')}</th>
                    <th>{t('th_chief_complaint', 'Chief Complaint')}</th>
                    <th>{t('th_callback_status', 'Status')}</th>
                    <th>Coordinator Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorCallbacks && doctorCallbacks.length > 0 ? (
                    doctorCallbacks.map((cb) => (
                      <tr key={cb.id}>
                        <td><strong>{cb.incident_code || `#${cb.incident_id}`}</strong></td>
                        <td>{cb.contact_name}</td>
                        <td>{cb.contact_phone}</td>
                        <td style={{ maxWidth: 220 }}>
                          <span style={{ fontSize: '13px' }}>{cb.chief_complaint}</span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              cb.status === 'Completed' ? 'badge-resolved' :
                              cb.status === 'In Progress' ? 'badge-allocated' :
                              cb.status === 'Contacted' ? 'badge-allocated' : 'badge-pending'
                            }`}
                          >
                            {cb.status === 'Pending' ? (t('callback_status_pending') || 'Pending Review') :
                             cb.status === 'In Progress' ? (t('callback_status_in_progress') || 'In Progress') :
                             cb.status === 'Contacted' ? (t('callback_status_contacted') || 'Contacted') :
                             cb.status === 'Completed' ? (t('callback_status_completed') || 'Completed') : cb.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {cb.status !== 'In Progress' && cb.status !== 'Completed' && (
                              <button
                                className="btn btn-outline btn-xs"
                                onClick={() => handleUpdateDoctorCallback(cb.id, 'In Progress')}
                                title="Mark In Progress"
                              >
                                {t('btn_mark_in_progress') || 'In Progress'}
                              </button>
                            )}
                            {cb.status !== 'Contacted' && cb.status !== 'Completed' && (
                              <button
                                className="btn btn-outline btn-xs"
                                onClick={() => handleUpdateDoctorCallback(cb.id, 'Contacted')}
                                title="Mark Contacted"
                              >
                                {t('btn_mark_contacted') || 'Contacted'}
                              </button>
                            )}
                            {cb.status !== 'Completed' && (
                              <button
                                className="btn btn-primary btn-xs"
                                onClick={() => handleUpdateDoctorCallback(cb.id, 'Completed')}
                                title="Mark Completed"
                              >
                                ✓ {t('btn_mark_completed') || 'Completed'}
                              </button>
                            )}
                            {cb.status === 'Completed' && (
                              <span style={{ color: '#166534', fontSize: '12px', fontWeight: 600 }}>✓ Resolved</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>
                        No doctor callback requests logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 9: DISASTER RELIEF MODE */}
      {/* ==================================================================== */}
      {activeTab === 'disaster' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#171C24' }}>
                {t('disaster_mgmt_title', '🌊 Disaster Management & Mass Casualty Extension')}
              </h3>
              <p style={{ color: '#64748b', fontSize: '13px' }}>
                {t('disaster_mgmt_desc')}
              </p>
            </div>
          </div>

          <div className="grid-2">
            <div style={{ border: '1px solid #DCE5EB', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#171C24', marginBottom: '8px' }}>
                Active Disaster Incident: CARE-2026-104 (Hebbal Lake Catchment, Mysuru)
              </h4>
              <p style={{ fontSize: '13px', color: '#344252', lineHeight: 1.5, marginBottom: '12px' }}>
                Affected Individuals: <strong>25 residents trapped by flash flooding</strong>.<br/>
                Relief Supplies Requested: <i>Drinking water (500L), ready-to-eat meals (100 pkts), inflatable rescue rafts.</i>
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const relRes = resources.find(r => r.resource_code === 'REL-01');
                    const inc104 = incidents.find(i => i.incident_code === 'CARE-2026-104');
                    if (relRes && inc104) {
                      handleAssignResource(inc104.id, relRes.id);
                    }
                  }}
                >
                  {t('btn_dispatch_relief_van', 'Dispatch Disaster Relief Supply Van 01')}
                </button>
              </div>
            </div>

            <div style={{ border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                {t('available_relief_assets_title', 'Available Relief Assets')}
              </h4>
              <div style={{ fontSize: '13px', color: '#14532d', lineHeight: 1.6 }}>
                <div>• <strong>REL-01:</strong> Disaster Relief Van (Food & Clean Water Supply) — {t('status_available', 'Available')}</div>
                <div>• <strong>SHELTER-01:</strong> Community Relief Centre (150 capacity, Kuvempunagar, Mysuru) — {t('status_available', 'Available')}</div>
                <div>• <strong>RES-01:</strong> Urban Search & Rescue Squad (Inflatable boats) — {t('status_available', 'Available')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 10: ANALYTICS & ML PREDICTIONS */}
      {/* ==================================================================== */}
      {activeTab === 'analytics' && (
        <div>
          {/* Performance KPIs */}
          <div className="grid-3" style={{ marginBottom: '20px' }}>
            <div className="card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>{t('kpi_avg_rating', 'AVG COORDINATOR RATING')}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', margin: '6px 0' }}>
                ★ 4.9 / 5.0
              </div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>{t('kpi_from_reviews', 'From 14 verified reporter reviews')}</div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>{t('kpi_avg_eta', 'ESTIMATED AVERAGE ETA')}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#171C24', margin: '6px 0' }}>
                7.4 {t('mins_label', 'mins')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{t('kpi_eta_context', 'Urban corridor with 1.25x traffic factor')}</div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>{t('kpi_conflict_rate', 'CONFLICT PREVENTION RATE')}</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', margin: '6px 0' }}>
                100%
              </div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>{t('kpi_zero_double', '0 double-assignments recorded')}</div>
            </div>
          </div>

          {/* Rule-Based Resource Shortage Risk Predictor */}
          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#171C24', marginBottom: '8px' }}>
              {t('ml_predictor_title', '📊 Rule-Based Resource Shortage Risk Predictor')}
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
              {t('ml_predictor_desc')}
            </p>

            <div className="table-wrapper">
              <table className="careon-table">
                <thead>
                  <tr>
                    <th>{t('th_zone', 'Geographic Zone')}</th>
                    <th>{t('th_predicted_risk', 'Predicted Shortage Risk')}</th>
                    <th>{t('th_risk_score', 'Risk Score')}</th>
                    <th>{t('th_resource_in_demand', 'Resource in Demand')}</th>
                    <th>{t('th_time_context', 'Time Context')}</th>
                    <th>{t('th_recommended_action', 'Recommended Coordinator Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong>{p.zone}</strong></td>
                      <td>
                        <span className={`status-badge ${p.predicted_shortage_risk === 'High' ? 'badge-critical' : p.predicted_shortage_risk === 'Moderate' ? 'badge-high' : 'badge-resolved'}`}>
                          {p.predicted_shortage_risk} {t('risk_label', 'Risk')}
                        </span>
                      </td>
                      <td>{p.risk_score}</td>
                      <td>{p.likely_resource_in_demand}</td>
                      <td>{p.time_window_context}</td>
                      <td style={{ fontSize: '12px', color: '#171C24' }}>{p.recommended_coordinator_action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic' }}>
              {t('ml_predictor_notice', 'Notice: Sample-data predictive baseline model for university demonstration. Not an official municipal emergency forecast.')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
