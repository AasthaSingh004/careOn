import React, { useState, useEffect } from 'react';
import { useTranslation } from '../translations';
import CareOnLogo from '../components/CareOnLogo';
import LeafletMap from '../components/LeafletMap';
import { fetchIncidents, confirmArrival, submitFeedback } from '../api';
import {
  AlertTriangle,
  Search,
  MessageSquare,
  Shield,
  Activity,
  PhoneCall,
  CheckCircle,
  Truck,
  HeartHandshake,
  TrendingUp,
  Lock,
  ArrowRight,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  Navigation,
  Eye,
  X,
  Maximize2,
  ShieldAlert,
  Flame,
  Car,
  Stethoscope,
  LifeBuoy,
  Waves,
  HeartPulse,
  Radio
} from 'lucide-react';

function getEmergencySafetyTips(category, t) {
  const cat = (category || 'Medical').toLowerCase();
  if (cat.includes('fire')) {
    return [
      t('safety_tip_fire_1', 'Move away from smoke and fire immediately. Do not use lifts or elevators.'),
      t('safety_tip_fire_2', 'Stay low under smoke where the air is cooler and cleaner.'),
      t('safety_tip_fire_3', 'Never re-enter a burning building to retrieve belongings.'),
    ];
  }
  if (cat.includes('road') || cat.includes('accident') || cat.includes('traffic')) {
    return [
      t('safety_tip_road_1', 'Stay away from moving traffic and wait in a safe, visible spot on the sidewalk.'),
      t('safety_tip_road_2', 'Turn on vehicle hazard lights if possible to warn oncoming drivers.'),
      t('safety_tip_road_3', 'Do not move severely injured victims unless there is immediate risk of fire or collision.'),
    ];
  }
  if (cat.includes('flood') || cat.includes('disaster') || cat.includes('storm')) {
    return [
      t('safety_tip_flood_1', 'Move to higher ground immediately and avoid walking or driving through floodwater.'),
      t('safety_tip_flood_2', 'Stay clear of fallen electrical poles, wires, and structurally damaged walls.'),
      t('safety_tip_flood_3', 'Keep a torch, drinking water, and fully charged phone ready while waiting for rescue.'),
    ];
  }
  if (cat.includes('rescue') || cat.includes('collapse') || cat.includes('drowning')) {
    return [
      t('safety_tip_rescue_1', 'Stay in a stable, clear location away from falling debris or unstable structures.'),
      t('safety_tip_rescue_2', 'Make noise or signal with light if trapped, but avoid shouting unnecessarily to conserve energy.'),
      t('safety_tip_rescue_3', 'Keep access routes clear for the incoming rescue and search team.'),
    ];
  }
  if (cat.includes('medical') || cat.includes('cardiac') || cat.includes('health')) {
    return [
      t('safety_tip_med_1', 'Keep the person comfortable and avoid unnecessary movement if seriously injured.'),
      t('safety_tip_med_2', 'Ensure clear airflow around the person and loosen tight clothing.'),
      t('safety_tip_med_3', 'Stay calm, keep your phone line free, and prepare any known medical history for responders.'),
    ];
  }
  return [
    t('safety_tip_gen_1', 'Stay in a well-lit, populated location if possible until help arrives.'),
    t('safety_tip_gen_2', 'Keep your phone line free so the emergency crew or coordinator can call you.'),
    t('safety_tip_gen_3', 'Have someone watch for the vehicle and wave to guide responders to the exact scene.'),
  ];
}

export default function Home({ lang = 'en', onNavigate, currentUser }) {
  const { t } = useTranslation(lang);

  // Active Emergency & Arrival Tracker State
  const [activeIncident, setActiveIncident] = useState(null);
  const [showDemoTracker, setShowDemoTracker] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(260); // ~4m 20s
  const [isConfirming, setIsConfirming] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Poll for user's active incident
  useEffect(() => {
    let isMounted = true;
    const checkActiveIncident = async () => {
      try {
        const list = await fetchIncidents({}, 'user').catch(() => []);
        if (!isMounted) return;
        const active = list.find((inc) =>
          ['Pending', 'Verified', 'Assigned', 'Dispatched', 'On Scene'].includes(inc.status)
        );
        if (active) {
          setActiveIncident(active);
        } else {
          setActiveIncident(null);
        }
      } catch {
        // Guest or network error
      }
    };
    checkActiveIncident();
    const interval = setInterval(checkActiveIncident, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser]);

  // Real-time countdown timer
  useEffect(() => {
    if (!activeIncident && !showDemoTracker) return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeIncident, showDemoTracker]);

  // Compact map & enlarged modal state
  const [isMapEnlarged, setIsMapEnlarged] = useState(false);

  // Rotating safety suggestions state
  const safetyTips = getEmergencySafetyTips(activeIncident?.category, t);
  const [safetyTipIndex, setSafetyTipIndex] = useState(0);
  const [isTipFading, setIsTipFading] = useState(false);
  const [isTipHovered, setIsTipHovered] = useState(false);

  // Auto-rotate safety message every 4 seconds with smooth fade transition; pause on hover/interaction
  useEffect(() => {
    if (isTipHovered || safetyTips.length <= 1) return;
    const interval = setInterval(() => {
      setIsTipFading(true);
      setTimeout(() => {
        setSafetyTipIndex((prev) => (prev + 1) % safetyTips.length);
        setIsTipFading(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [isTipHovered, safetyTips.length]);

  // Reset tip index when emergency category changes
  useEffect(() => {
    setSafetyTipIndex(0);
  }, [activeIncident?.category]);

  const formatCountdown = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleConfirmArrival = async (incidentId) => {
    const confirmed = window.confirm(
      t('arrival_confirm_dialog', 'Did the emergency response unit arrive at your location?')
    );
    if (!confirmed) return;

    setIsConfirming(true);
    try {
      if (activeIncident && activeIncident.id) {
        await confirmArrival(activeIncident.id, 'Citizen confirmed responder arrival on scene.');
      }
      setShowFeedbackModal(true);
    } catch (e) {
      console.warn('Arrival confirmation notice:', e);
      setShowFeedbackModal(true);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    try {
      const incId = activeIncident?.id || 1;
      await submitFeedback({
        incident_id: incId,
        rating: feedbackRating,
        comments: feedbackComments,
        tags: 'Quick Arrival, Professional Crew',
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setActiveIncident(null);
        setShowDemoTracker(false);
      }, 2500);
    } catch (e) {
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setActiveIncident(null);
        setShowDemoTracker(false);
      }, 2500);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const openSahara = () => {
    const fab = document.querySelector('.sahara-bubble-btn') || document.querySelector('.sahara-fab');
    if (fab) {
      fab.click();
    } else {
      window.dispatchEvent(new CustomEvent('open-sahara'));
    }
  };

  // Coordinates for demo or live route
  const incidentCoords = [activeIncident?.latitude || 12.3052, activeIncident?.longitude || 76.6552];
  const resourceCoords = [12.3180, 76.6420]; // Nearest Mysuru Station
  const assignedUnit = activeIncident?.assignments?.[0]?.resource || {
    name: 'Rapid Response Ambulance AMB-01',
    category: 'Ambulance (ALS)',
    contact_phone: '+91 98001 00001',
  };

  const isTrackerVisible = Boolean(activeIncident || showDemoTracker);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '3rem', width: '100%', boxSizing: 'border-box' }}>
      {/* 112 Emergency Helpline Banner */}
      <div style={{
        background: '#FEE4E2',
        border: '1px solid #FECDCA',
        borderRadius: 12,
        padding: '0.85rem 1.25rem',
        marginTop: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: '#F04438',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <PhoneCall size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 800, color: '#B42318', fontSize: '0.95rem', marginRight: 6 }}>
              {t('helpline_alert_title') || 'National Emergency Helpline'}:
            </span>
            <span style={{ color: '#7A271A', fontSize: '0.875rem' }}>
              {t('helpline_alert_desc') || 'For immediate life-threatening situations, also dial 112 directly.'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a
            href="tel:112"
            className="btn"
            style={{
              background: '#F04438',
              color: '#FFFFFF',
              padding: '0.5rem 1.15rem',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(240, 68, 56, 0.3)'
            }}
          >
            <span>{t('dial_112_btn') || 'Call 112'}</span>
          </a>
          {!activeIncident && (
            <button
              type="button"
              onClick={() => setShowDemoTracker(!showDemoTracker)}
              style={{
                background: showDemoTracker ? '#E4E7EC' : '#FFFFFF',
                border: '1px solid #DCE5EB',
                color: '#171C24',
                padding: '0.5rem 0.85rem',
                borderRadius: 8,
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showDemoTracker ? '✕ Hide Tracker Demo' : '🚑 Preview Arrival Tracker'}
            </button>
          )}
        </div>
      </div>

      {/* Emergency Arrival Tracker Card (Citizen Experience Goal 2) */}
      {isTrackerVisible && (
        <div
          className="card arrival-tracker-card"
          style={{
            background: '#FFFFFF',
            border: '2px solid #DCE5EB',
            borderRadius: 16,
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.35rem' }}>🚑</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171C24', margin: 0 }}>
                  {t('arrival_tracker_title') || 'Help is on the way!'}
                </h3>
                <span
                  style={{
                    backgroundColor: '#171C24',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  {activeIncident?.incident_code || 'CARE-2026-101'}
                </span>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    color: '#92400E',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  [{t('arrival_tracker_demo_badge', 'DEMO SIMULATION')}]
                </span>
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#344252' }}>
                {t('arrival_tracker_subtitle') || 'Your emergency response vehicle has been dispatched and is moving toward your location.'}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#344252', fontWeight: 600 }}>
                {t('arrival_tracker_eta') || 'Estimated Arrival'}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F04438', fontFamily: 'monospace' }}>
                ~{formatCountdown(countdownSeconds)}
              </div>
            </div>
          </div>

          {/* Assigned Unit Info */}
          <div
            style={{
              backgroundColor: '#F5F6F7',
              border: '1px solid #DCE5EB',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', color: '#171C24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#171C24' }}>{assignedUnit.name}</strong>
                <div style={{ fontSize: '0.825rem', color: '#344252', marginTop: 2 }}>
                  {t('arrival_tracker_unit') || 'Assigned Unit'}: {assignedUnit.category} • 📞 {assignedUnit.contact_phone}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#FFFFFF', border: '1px solid #DCE5EB', color: '#171C24', fontWeight: 700 }}
                onClick={() => onNavigate?.('user_track', activeIncident?.incident_code || 'CARE-2026-101')}
              >
                🔍 {t('track_incident_btn') || 'Track Details'}
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#171C24', color: '#FFFFFF', fontWeight: 700 }}
                onClick={() => handleConfirmArrival(activeIncident?.id || 1)}
                disabled={isConfirming}
              >
                {isConfirming ? t('loading') : `✓ ${t('arrival_confirm_btn') || 'Confirm Help Arrived'}`}
              </button>
            </div>
          </div>

          {/* 4-Stage Journey Progress */}
          <div style={{ margin: '1.25rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { id: 'recv', label: t('arrival_stage_received') || 'Request Received', done: true },
                { id: 'disp', label: t('arrival_stage_dispatched') || 'Unit Dispatched', done: true },
                { id: 'enrt', label: t('arrival_stage_enroute') || 'On Route', done: true, active: true },
                { id: 'arrv', label: t('arrival_stage_arrived') || 'Arrived at Scene', done: false },
              ].map((stage, idx) => (
                <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: stage.active ? '#F04438' : stage.done ? '#027A48' : '#DCE5EB',
                      color: stage.done || stage.active ? '#FFFFFF' : '#667085',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      boxShadow: stage.active ? '0 0 10px rgba(240, 68, 56, 0.4)' : 'none',
                    }}
                  >
                    {stage.done ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', marginTop: 6, textAlign: 'center', fontWeight: stage.active ? 800 : 500, color: stage.active ? '#F04438' : '#344252' }}>
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tracker Bottom Section: Compact Map Preview & Emergency-Specific Safety Instructions */}
          <div className="tracker-bottom-grid">
            {/* Column 1: Compact Map Preview */}
            <div
              style={{
                backgroundColor: '#F5F6F7',
                border: '1px solid #DCE5EB',
                borderRadius: 10,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171C24', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={15} color="#F04438" />
                  <span>{t('arrival_tracker_map_preview') || 'Live Route Preview'}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsMapEnlarged(true)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderColor: '#DCE5EB',
                    color: '#171C24',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#FFFFFF',
                    fontWeight: 700
                  }}
                >
                  <Maximize2 size={12} />
                  <span>{t('enlarge_map_btn') || 'Enlarge Map'}</span>
                </button>
              </div>

              <div
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #DCE5EB',
                  height: '140px',
                  position: 'relative',
                  flex: 1,
                  minHeight: '140px',
                }}
              >
                <LeafletMap
                  height="140px"
                  lang={lang}
                  center={incidentCoords}
                  zoom={13}
                  isSimulationActive={true}
                  activeRoute={{
                    origin: resourceCoords,
                    destination: incidentCoords,
                    label: assignedUnit.name,
                  }}
                  isLiveGps={false}
                />
              </div>
            </div>

            {/* Column 2: Emergency-Specific Rotating Safety Tips ("Stay Safe While You Wait") */}
            <div
              style={{
                backgroundColor: '#F5F6F7',
                border: '1px solid #DCE5EB',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#171C24', fontWeight: 800, fontSize: '0.875rem' }}>
                    <ShieldAlert size={16} color="#F04438" />
                    <span>{t('stay_safe_title') || 'Stay Safe While You Wait'}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      backgroundColor: '#FFFFFF',
                      color: '#171C24',
                      border: '1px solid #DCE5EB',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontWeight: 700,
                    }}
                  >
                    {t(`cat_${(activeIncident?.category || 'Medical').toLowerCase().replace(/ /g, '_')}`) || activeIncident?.category || 'Medical'}
                  </span>
                </div>

                {/* Rotating Safety Message with Smooth Fade & Interaction Pause */}
                <div
                  onMouseEnter={() => setIsTipHovered(true)}
                  onMouseLeave={() => setIsTipHovered(false)}
                  onTouchStart={() => setIsTipHovered(true)}
                  onTouchEnd={() => setIsTipHovered(false)}
                  style={{
                    minHeight: '74px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DCE5EB',
                    borderRadius: 8,
                    padding: '10px 12px',
                    cursor: 'default',
                  }}
                  title={isTipHovered ? (t('safety_tips_paused') || 'Paused on interaction') : undefined}
                >
                  <div
                    style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: '#171C24',
                      lineHeight: 1.45,
                      opacity: isTipFading ? 0 : 1,
                      transition: 'opacity 300ms ease-in-out',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1 }}>🛡️</span>
                    <span style={{ fontWeight: 500 }}>
                      {safetyTips[safetyTipIndex % safetyTips.length] || safetyTips[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress dots & pause indicator */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  fontSize: '0.7rem',
                  color: '#344252',
                }}
              >
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  {safetyTips.map((_, idx) => (
                    <span
                      key={idx}
                      onClick={() => setSafetyTipIndex(idx)}
                      style={{
                        width: idx === safetyTipIndex ? 16 : 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: idx === safetyTipIndex ? '#F04438' : '#DCE5EB',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    />
                  ))}
                  <span style={{ marginLeft: 4, fontWeight: 700, color: '#171C24' }}>
                    {safetyTipIndex + 1}/{safetyTips.length}
                  </span>
                </div>
                {isTipHovered ? (
                  <span style={{ color: '#F04438', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>⏸</span>
                    <span>{t('safety_tips_paused') || 'Paused'}</span>
                  </span>
                ) : (
                  <span style={{ color: '#667085' }}>
                    ~4s
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Map Modal */}
      {isMapEnlarged && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 1100 }}
          onClick={() => setIsMapEnlarged(false)}
        >
          <div
            className="modal-content"
            style={{ maxWidth: 860, width: '92%', padding: '1.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.85rem',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.25rem' }}>🚑</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171C24', margin: 0 }}>
                    {t('enlarged_map_title') || 'Emergency Response Route & Tracker'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#344252' }}>
                    {activeIncident?.incident_code || 'CARE-2026-101'} • [{t('arrival_tracker_demo_badge', 'DEMO SIMULATION')}]
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsMapEnlarged(false)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <X size={16} />
                <span>{t('close_map_btn') || 'Close Map'}</span>
              </button>
            </div>

            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #DCE5EB' }}>
              <LeafletMap
                height="400px"
                lang={lang}
                center={incidentCoords}
                zoom={13}
                isSimulationActive={true}
                activeRoute={{
                  origin: resourceCoords,
                  destination: incidentCoords,
                  label: assignedUnit.name,
                }}
                isLiveGps={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmed Rescue Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#027A48', margin: 0 }}>
                {t('emergency_resolved_title') || 'Emergency Response Confirmed!'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#344252', margin: '6px 0 0 0' }}>
                {t('feedback_intro') || 'Thank you for confirming responder arrival. Please rate your emergency experience.'}
              </p>
            </div>

            {feedbackSuccess ? (
              <div style={{ backgroundColor: '#ECFDF3', border: '1px solid #A6F4C5', color: '#027A48', padding: '16px', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>
                  ★ ★ ★ ★ ★ {t('feedback_received') || 'Feedback Received!'}
                </div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>
                  {t('feedback_thanks') || 'Thank you! Your feedback helps us continuously improve emergency coordination.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '1.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                    >
                      <Star
                        size={32}
                        color="#F59E0B"
                        fill={star <= feedbackRating ? '#F59E0B' : 'transparent'}
                      />
                    </button>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', color: '#171C24' }}>
                    {t('written_comments') || 'Comments (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    className="input-field"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder={t('feedback_comments_placeholder') || 'How was the responder speed and coordination?'}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowFeedbackModal(false)}
                  >
                    {t('dismiss') || 'Close'}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={feedbackSubmitting}
                  >
                    {feedbackSubmitting ? t('loading') : (t('btn_submit_feedback') || 'Submit Rating')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{
        background: '#FFFFFF',
        color: '#171C24',
        border: '1px solid #DCE5EB',
        borderRadius: 20,
        padding: '3rem 2.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2.5rem'
      }}>
        {/* Subtle decorative accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: '#F04438'
        }} />

        <div style={{ maxWidth: 840, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#F5F6F7',
            border: '1px solid #DCE5EB',
            color: '#344252',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: '0.825rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
            marginBottom: '1.25rem',
            textTransform: 'uppercase'
          }}>
            <CareOnLogo size={18} color="#F04438" />
            <span>{t('brand_name')} • {t('hero_badge') || 'Intelligent Resource Coordination'}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            color: '#171C24'
          }}>
            {t('hero_title')}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.55,
            color: '#344252',
            margin: '0 0 2rem 0',
            maxWidth: 720
          }}>
            {t('hero_subtitle')}
          </p>

          {/* 3 Primary Action Buttons */}
          <div className="hero-actions">
            {/* Action 1: Report Emergency (Prominent Emergency Red) */}
            <button
              onClick={() => onNavigate?.('user_report')}
              className="btn btn-primary"
              style={{
                background: '#F04438',
                color: '#FFFFFF',
                padding: '0.95rem 1.8rem',
                borderRadius: 10,
                fontSize: '1.05rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(240, 68, 56, 0.35)'
              }}
            >
              <AlertTriangle size={22} />
              <span>{t('hero_report_btn')}</span>
            </button>

            {/* Action 2: Track Request */}
            <button
              onClick={() => onNavigate?.('user_track')}
              className="btn btn-outline"
              style={{
                background: '#FFFFFF',
                color: '#171C24',
                borderColor: '#171C24',
                padding: '0.95rem 1.6rem',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <Search size={19} />
              <span>{t('hero_track_btn')}</span>
            </button>

            {/* Action 3: Sahara Chatbot */}
            <button
              onClick={openSahara}
              className="btn"
              style={{
                background: '#F5F6F7',
                color: '#171C24',
                padding: '0.95rem 1.5rem',
                borderRadius: 10,
                fontSize: '1rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #DCE5EB',
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={19} />
              <span>{t('hero_sahara_btn')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Organised Emergency-Type Selection Grid (Palette 6 Inspiration) */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#F04438',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.35rem'
            }}>
              {t('hero_badge', 'Intelligent Resource Coordination')}
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171C24', margin: 0 }}>
              {t('emergency_category_label', 'Select Emergency Category')}
            </h2>
          </div>
          <p style={{ color: '#344252', fontSize: '0.925rem', margin: 0 }}>
            {t('report_emergency_desc', 'Provide key incident details. CareOn coordinates the closest suitable medical, fire, or rescue fleet.')}
          </p>
        </div>

        <div className="emergency-types-grid">
          {[
            { id: 'Medical', title: t('cat_medical'), icon: <HeartPulse size={26} color="#F04438" />, desc: t('cat_desc_medical') || 'Cardiac, breathing, severe injury' },
            { id: 'Road accident', title: t('cat_road_accident'), icon: <Car size={26} color="#F04438" />, desc: t('cat_desc_road') || 'Traffic crash, vehicle collision' },
            { id: 'Fire', title: t('cat_fire'), icon: <Flame size={26} color="#F04438" />, desc: t('cat_desc_fire') || 'Building fire, smoke, gas leak' },
            { id: 'Rescue', title: t('cat_rescue'), icon: <LifeBuoy size={26} color="#F04438" />, desc: t('cat_desc_rescue') || 'Building collapse, water drowning' },
            { id: 'Disaster / Multiple affected people', title: t('cat_disaster'), icon: <Waves size={26} color="#F04438" />, desc: t('cat_desc_disaster') || 'Mass flood, storm casualty' },
            { id: 'Safety / Other', title: t('cat_safety'), icon: <Shield size={26} color="#F04438" />, desc: t('cat_desc_safety') || 'Crowd hazard, first-aid assist' },
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate?.('user_report')}
              className="card hover-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCE5EB',
                borderRadius: 12,
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 10,
                  backgroundColor: '#FEE4E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem'
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.35rem 0' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#344252', lineHeight: 1.35, margin: 0 }}>
                  {cat.desc}
                </p>
              </div>
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, color: '#F04438', fontSize: '0.775rem', fontWeight: 700 }}>
                <span>{t('nav_report', 'Report Emergency')}</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How CareOn Works Section */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#F04438',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem'
          }}>
            {t('workflow_subtitle') || 'Seamless Coordination Journey'}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.5rem 0' }}>
            {t('how_it_works_title')}
          </h2>
          <p style={{ color: '#344252', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
            {t('how_it_works_desc') || 'A synchronized bridge between citizens in need, dispatch coordinators, and emergency response teams.'}
          </p>
        </div>

        <div className="how-works-grid">
          {/* Step 1 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#FEE4E2',
              color: '#F04438',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('step1_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('step1_desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('step2_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('step2_desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#EFF8FF',
              color: '#175CD3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('step3_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('step3_desc')}
            </p>
          </div>

          {/* Step 4 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#ECFDF3',
              color: '#027A48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              4
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('step4_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('step4_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 6 Capabilities & Feature Cards */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#F04438',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem'
          }}>
            {t('platform_capabilities_badge') || 'Engineered For Resilience'}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.5rem 0' }}>
            {t('features_section_title') || 'Comprehensive Resource Coordination'}
          </h2>
          <p style={{ color: '#344252', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
            {t('features_section_desc') || 'Designed to prevent resource bottlenecks, eliminate allocation conflicts, and deliver rapid response.'}
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#F5F6F7',
              border: '1px solid #DCE5EB',
              color: '#F04438',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Truck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('feature1_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('feature1_desc')}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#F5F6F7',
              border: '1px solid #DCE5EB',
              color: '#027A48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <HeartHandshake size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('feature2_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('feature2_desc')}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#F5F6F7',
              border: '1px solid #DCE5EB',
              color: '#175CD3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('feature3_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('feature3_desc')}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#F5F6F7',
              border: '1px solid #DCE5EB',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('feature4_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('feature4_desc')}
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#F5F6F7',
              border: '1px solid #DCE5EB',
              color: '#171C24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('feature5_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('feature5_desc')}
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card hover-card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 14 }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: '#F5F6F7',
              border: '1px solid #DCE5EB',
              color: '#F04438',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171C24', margin: '0 0 0.4rem 0' }}>
              {t('feature6_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', lineHeight: 1.5, margin: 0 }}>
              {t('feature6_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Zero Commission Card */}
      <section style={{
        background: '#FFFFFF',
        border: '1px solid #DCE5EB',
        borderRadius: 16,
        padding: '2rem 2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ maxWidth: 700 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.5rem 0' }}>
            {t('zero_commission_title') || '₹0 Platform Fee — Transparent Emergency Coordination'}
          </h3>
          <p style={{ color: '#344252', fontSize: '0.925rem', lineHeight: 1.5, margin: 0 }}>
            {t('zero_commission_desc') || 'CareOn does not charge any citizen commission. If external private providers or ambulances are activated during city-wide shortages, coordinators present transparent rates for your explicit consent.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate?.('user_report')}
          className="btn btn-primary"
          style={{ background: '#171C24', color: '#FFFFFF', padding: '0.85rem 1.6rem', fontSize: '0.95rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          <span>{t('hero_report_btn')}</span>
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
