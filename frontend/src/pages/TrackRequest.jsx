import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchIncidentDetails,
  cancelIncident,
  updateProviderEnquiry,
  submitFeedback,
  verifyIncidentOtp,
  requestIncidentOtp,
  fetchSystemConfig,
} from '../api';
import { useTranslation } from '../translations';
import { formatISTTime } from '../utils/date';
import {
  Search,
  AlertTriangle,
  Clock,
  Shield,
  Truck,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  Lock,
  Star,
  Activity,
  ArrowRight,
  Stethoscope,
  KeyRound,
  RotateCcw,
} from 'lucide-react';

const STATUS_STEPS = [
  'Received',
  'Verification Pending',
  'Verified',
  'Assistance Search',
  'Assignment Confirmed',
  'Team Dispatched',
  'Team Arrived',
  'Resolved',
];

export default function TrackRequest({
  lang = 'en',
  initialIncidentCode,
  initialSimulatedOtp = null,
  onNavigate,
}) {
  const { t } = useTranslation(lang);

  const [searchCode, setSearchCode] = useState(initialIncidentCode || 'CARE-2026-101');
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // System Configuration (Configurable Helpline)
  const [systemConfig, setSystemConfig] = useState(null);

  // In-App Simulated OTP State
  const [simulatedOtp, setSimulatedOtp] = useState(initialSimulatedOtp);
  const [otpValue, setOtpValue] = useState(initialSimulatedOtp || '');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Call a Doctor State (Simple info toggle; no fake calls or callbacks)
  const [showDoctorNotice, setShowDoctorNotice] = useState(false);

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Emergency resolved');
  const [cancelDetails, setCancelDetails] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Feedback State
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['Easy to use', 'Clear updates']);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  // Load system config
  useEffect(() => {
    try {
      const res = fetchSystemConfig();
      if (res && typeof res.then === 'function') {
        res.then((cfg) => setSystemConfig(cfg)).catch(() => setSystemConfig({ official_emergency_number: '112' }));
      }
    } catch {
      setSystemConfig({ official_emergency_number: '112' });
    }
  }, []);

  const loadIncident = useCallback(async (codeToLoad) => {
    const code = codeToLoad || searchCode;
    if (!code?.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidentDetails(code.trim(), 'user');
      setIncident(data);
    } catch (err) {
      if (err.message?.includes('403') || err.message?.includes('access restricted') || err.message?.includes('Access denied')) {
        setError(t('incident_privacy_restricted') || 'This incident record is private and belongs to another user.');
      } else {
        setError(`${t('incident_not_found') || 'Could not find incident'} "${code}".`);
      }
      setIncident(null);
    } finally {
      setLoading(false);
    }
  }, [searchCode]);

  useEffect(() => {
    const code = initialIncidentCode || 'CARE-2026-101';
    setSearchCode(code);
    loadIncident(code);
  }, [initialIncidentCode]);

  useEffect(() => {
    if (initialSimulatedOtp) {
      setSimulatedOtp(initialSimulatedOtp);
      setOtpValue(initialSimulatedOtp);
    }
  }, [initialSimulatedOtp]);

  // Polling for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (searchCode && incident && incident.status !== 'Resolved' && incident.status !== 'Cancelled') {
        loadIncident(searchCode);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [searchCode, incident?.status, loadIncident]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!incident || !otpValue || otpValue.trim().length !== 6) return;
    setVerifyingOtp(true);
    setOtpError(null);
    try {
      await verifyIncidentOtp(incident.id, otpValue.trim(), 'user');
      setOtpSuccess(true);
      await loadIncident(incident.incident_code);
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleRequestNewOtp = async () => {
    if (!incident) return;
    setVerifyingOtp(true);
    setOtpError(null);
    try {
      const res = await requestIncidentOtp(incident.id, 'user');
      setSimulatedOtp(res.simulated_otp);
      setOtpValue(res.simulated_otp || '');
      setOtpError(null);
      if (typeof window !== 'undefined' && res.simulated_otp) {
        window.dispatchEvent(
          new CustomEvent('careon-otp-generated', {
            detail: {
              code: incident.incident_code,
              otp: res.simulated_otp,
            },
          })
        );
      }
    } catch (err) {
      setOtpError(err.message || 'Failed to request new verification code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!incident) return;
    setCancelling(true);
    try {
      await cancelIncident(incident.id, cancelReason, cancelDetails, 'user');
      setShowCancelModal(false);
      await loadIncident(incident.incident_code);
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  const handleConsentDecision = async (enquiryId, decision) => {
    try {
      await updateProviderEnquiry(enquiryId, { user_consent: decision, status: 'Available' });
      await loadIncident(incident.incident_code);
    } catch (err) {
      alert(`Consent update failed: ${err.message}`);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!incident) return;
    setFeedbackSubmitting(true);
    try {
      await submitFeedback({
        incident_id: incident.id,
        rating: parseInt(rating),
        tags: selectedTags.join(', '),
        comments: comment,
      });
      setFeedbackSubmitted(true);
      await loadIncident(incident.incident_code);
    } catch (err) {
      alert(`Feedback submission failed: ${err.message}`);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 2;
  };

  return (
    <div style={{ maxWidth: 880, margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Top Search Card */}
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: 16, border: '1px solid #DCE5EB', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.75rem 0' }}>
          {t('track_request_title') || 'Track Emergency Request'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadIncident();
          }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
        >
          <input
            type="text"
            className="input-field"
            style={{ flex: 1, minWidth: 220, fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', color: '#171C24' }}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder={t('track_input_placeholder') || 'Enter Incident Code (e.g. CARE-2026-101)'}
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ background: '#171C24', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.75rem 1.4rem', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            <Search size={16} />
            <span>{loading ? t('loading') : (t('track_request_btn') || 'Track Request')}</span>
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1rem',
            background: '#FEE4E2',
            border: '1px solid #FECDCA',
            color: '#B42318',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Lock size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {incident && (
        <>
          {/* Main Status Tracker Card */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: 16, border: '1px solid #DCE5EB', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, fontFamily: 'monospace', color: '#171C24' }}>{incident.incident_code}</h3>
                  <span className={`badge ${incident.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>
                    {t(`priority_${incident.priority?.toLowerCase()}`) || incident.priority}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#344252' }}>
                  {t(`cat_${incident.category?.toLowerCase()}`) || incident.category} • {incident.location_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  ● {t(`status_${incident.status?.toLowerCase().replace(/ /g, '_')}`) || incident.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#667085', marginTop: 4 }}>
                  {t('reported_at') || 'Reported'}: {formatISTTime(incident.created_at)}
                </div>
              </div>
            </div>

            {/* In-App Simulated OTP Verification Box */}
            {!incident.is_verified && incident.status !== 'Resolved' && incident.status !== 'Cancelled' && (
              <div
                style={{
                  backgroundColor: '#F5F6F7',
                  border: '1px solid #DCE5EB',
                  borderRadius: 10,
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#171C24', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  <KeyRound size={18} color="#F04438" />
                  <span>{t('otp_verification_title') || 'Emergency Contact Verification (Simulated In-App OTP)'}</span>
                </div>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#344252', lineHeight: 1.4 }}>
                  {t('otp_verification_desc') || 'A secure verification code was generated for your contact number. Enter the 6-digit code below to confirm this report.'}
                </p>

                {simulatedOtp && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #DCE5EB',
                      borderRadius: 6,
                      padding: '6px 14px',
                      marginBottom: '0.85rem',
                      fontSize: '0.875rem',
                      color: '#171C24'
                    }}
                  >
                    <span>{t('simulated_otp_display') || 'Simulated Code:'}</span>
                    <strong style={{ fontSize: '1.15rem', letterSpacing: '2px', fontFamily: 'monospace', color: '#F04438' }}>{simulatedOtp}</strong>
                  </div>
                )}

                {otpError && (
                  <div style={{ color: '#B42318', fontSize: '0.85rem', marginBottom: '0.65rem', fontWeight: 600 }}>
                    {t(otpError)}
                  </div>
                )}

                {otpSuccess && (
                  <div style={{ color: '#027A48', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                    {t('otp_success_msg') || 'Emergency contact phone verified successfully.'}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('enter_otp_placeholder') || 'Enter 6-digit code'}
                    style={{
                      width: 160,
                      padding: '8px 12px',
                      border: '1px solid #DCE5EB',
                      borderRadius: 8,
                      fontSize: '1rem',
                      letterSpacing: '2px',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      color: '#171C24'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={verifyingOtp || otpValue.length !== 6}
                    style={{ background: '#171C24', color: '#FFFFFF', fontWeight: 700, borderRadius: 8, padding: '0.55rem 1.25rem', border: 'none', cursor: 'pointer' }}
                  >
                    {verifyingOtp ? (t('otp_verifying') || 'Verifying...') : (t('btn_verify_otp') || 'Verify Code')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleRequestNewOtp}
                    disabled={verifyingOtp}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderColor: '#DCE5EB', color: '#171C24', background: '#FFFFFF', borderRadius: 8, fontWeight: 600 }}
                  >
                    <RotateCcw size={14} />
                    <span>{t('btn_request_new_otp') || 'Request New Code'}</span>
                  </button>
                </form>
              </div>
            )}

            {incident.is_verified && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#ECFDF3',
                  border: '1px solid #A6F4C5',
                  color: '#027A48',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}
              >
                <CheckCircle2 size={16} />
                <span>{t('otp_verified_badge') || '✓ Phone Contact Verified'}</span>
              </div>
            )}

            {/* Lifecycle Progress Bar */}
            {incident.status !== 'Cancelled' && (
              <div style={{ margin: '1.5rem 0 2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(incident.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={step}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: isCurrent ? '#F04438' : isCompleted ? '#027A48' : '#DCE5EB',
                            color: isCompleted || isCurrent ? '#FFFFFF' : '#667085',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            boxShadow: isCurrent ? '0 0 0 4px rgba(240, 68, 56, 0.25)' : 'none',
                          }}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            marginTop: 6,
                            textAlign: 'center',
                            fontWeight: isCurrent ? 800 : 500,
                            color: isCurrent ? '#F04438' : isCompleted ? '#171C24' : '#667085',
                          }}
                        >
                          {t(`step_${step.toLowerCase().replace(/ /g, '_')}`) || step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Assignment Section */}
            {incident.assignments && incident.assignments.length > 0 && (
              <div
                style={{
                  backgroundColor: '#F5F6F7',
                  border: '1px solid #DCE5EB',
                  borderRadius: 10,
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#171C24', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <Truck size={18} color="#F04438" />
                  <span>{t('assigned_unit_title') || 'Assigned Emergency Response Unit'}</span>
                </div>
                {incident.assignments.map((asgn) => (
                  <div key={asgn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#171C24' }}>
                        {asgn.resource?.name || 'Rapid Response Ambulance 01'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#344252', marginTop: 2 }}>
                        {t('category') || 'Type'}: {t(`cat_${asgn.resource?.category?.toLowerCase()}`) || asgn.resource?.category || 'Ambulance'} • {t('contact_label', 'Contact')}: {asgn.resource?.contact_phone || '+91 98001 00001'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#027A48', marginTop: 4, fontWeight: 600 }}>
                        {asgn.notes || 'En route to incident coordinates.'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#344252' }}>{t('eta') || 'Estimated Arrival'}</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F04438' }}>~6 - 8 {t('mins_label', 'mins')}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Call a Doctor Option */}
            <div
              style={{
                backgroundColor: '#F5F6F7',
                border: '1px solid #DCE5EB',
                borderRadius: 10,
                padding: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#171C24', fontWeight: 800, fontSize: '0.95rem' }}>
                  <Stethoscope size={18} color="#F04438" />
                  <span>{t('call_doctor_title') || 'Call a Doctor'}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#DCE5EB', color: '#171C24', background: '#FFFFFF', fontWeight: 700 }}
                  onClick={() => setShowDoctorNotice((prev) => !prev)}
                >
                  📞 {t('call_doctor_title') || 'Call a Doctor'}
                </button>
              </div>

              {showDoctorNotice && (
                <div
                  data-testid="doctor-unavailable-notice"
                  style={{
                    marginTop: '0.75rem',
                    padding: '10px 14px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #DCE5EB',
                    fontSize: '0.85rem',
                    color: '#171C24',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ color: '#F04438' }}>ℹ️</span>
                  <span>{t('doctor_calling_unavailable') || 'Doctor calling is currently unavailable. For medical emergencies, dial 112 directly.'}</span>
                </div>
              )}
            </div>

            {/* Cost Transparency & Consent Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCE5EB',
                borderRadius: 10,
                padding: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.75rem 0' }}>
                {t('cost_transparency_title') || 'Cost Transparency & External Provider Details'}
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span>{t('platform_fee_label') || 'CareOn Platform Commission'}:</span>
                <strong style={{ color: '#027A48' }}>{t('platform_fee_free') || '₹0.00 (Always Free)'}</strong>
              </div>

              {incident.provider_enquiries && incident.provider_enquiries.length > 0 ? (
                incident.provider_enquiries.map((enq) => (
                  <div key={enq.id} style={{ borderTop: '1px solid #DCE5EB', paddingTop: 10, marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                      <span>{t('lbl_ext_quotation', 'External Partner Quotation')}:</span>
                      <strong style={{ color: '#171C24' }}>₹{enq.charge_quote?.toFixed(2)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                      <span>{t('lbl_subsidy_amount', 'Subsidy / NGO Sponsorship')}:</span>
                      <strong style={{ color: '#175CD3' }}>- ₹{enq.subsidy_amount?.toFixed(2)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, marginBottom: 10 }}>
                      <span>{t('lbl_net_payable', 'Net Payable to Service Provider')}:</span>
                      <strong style={{ color: '#F04438' }}>₹{((enq.charge_quote || 0) - (enq.subsidy_amount || 0)).toFixed(2)}</strong>
                    </div>

                    {/* Informed Consent Buttons */}
                    {enq.user_consent === 'Pending' && (
                      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.825rem', color: '#92400E', fontWeight: 700, marginBottom: 8 }}>
                          ⚠️ {t('consent_required_msg') || 'Informed consent required for external provider service.'}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ background: '#171C24', color: '#FFFFFF', fontWeight: 700, border: 'none', borderRadius: 6, padding: '0.45rem 0.95rem', cursor: 'pointer' }}
                            onClick={() => handleConsentDecision(enq.id, 'Accepted')}
                          >
                            ✓ {t('accept_quote') || 'Accept Quotation & Confirm Dispatch'}
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ borderColor: '#DCE5EB', color: '#171C24', background: '#FFFFFF', fontWeight: 700, borderRadius: 6, padding: '0.45rem 0.95rem' }}
                            onClick={() => handleConsentDecision(enq.id, 'Declined')}
                          >
                            ✕ {t('decline_quote') || 'Decline (Seek Free Alternative)'}
                          </button>
                        </div>
                      </div>
                    )}

                    {enq.user_consent === 'Accepted' && (
                      <div className="badge badge-success" style={{ marginTop: 6 }}>
                        ✓ {t('consent_accepted') || 'Accepted by Citizen'}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.825rem', color: '#344252' }}>
                  {t('free_public_resources') || 'No external paid provider assigned. Standard public/platform resources deployed at zero charge.'}
                </div>
              )}
            </div>

            {/* Action: Cancel Request */}
            {incident.status !== 'Resolved' && incident.status !== 'Cancelled' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  className="btn btn-outline"
                  style={{ color: '#F04438', borderColor: '#FECDCA', background: '#FFFFFF', fontWeight: 700 }}
                  onClick={() => setShowCancelModal(true)}
                >
                  ✕ {t('btn_cancel_request') || 'Cancel Emergency Request'}
                </button>
              </div>
            )}

            {/* Official 112 Emergency Guidance & Call Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: '1.25rem',
              padding: '12px 16px',
              backgroundColor: '#FEE4E2',
              borderRadius: 8,
              border: '1px solid #FECDCA',
            }}>
              <div style={{ fontSize: '0.825rem', color: '#B42318', flex: 1 }}>
                🚨 <strong>{t('direct_emergency_line', 'Official Emergency Services')}:</strong> {systemConfig?.official_emergency_disclaimer || t('disclaimer_short')}
              </div>
              <a
                href={`tel:${systemConfig?.official_emergency_number || '112'}`}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#F04438',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 6,
                  boxShadow: '0 2px 6px rgba(240, 68, 56, 0.3)'
                }}
              >
                <span>📞 {t('dial_112_btn', 'Call 112')}</span>
              </a>
            </div>
          </div>

          {/* Timeline of Updates */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: 16, border: '1px solid #DCE5EB', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', color: '#171C24' }}>
              {t('timeline_title') || 'Live Activity & Audit Timeline'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {incident.updates && incident.updates.length > 0 ? (
                incident.updates.map((upd) => (
                  <div key={upd.id} style={{ display: 'flex', gap: 12 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#F04438',
                        marginTop: 5,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#344252' }}>
                        <span><strong>{t(upd.actor)}</strong> ({t(`status_${upd.status?.toLowerCase().replace(/ /g, '_')}`) || t(upd.status)})</span>
                        <span>{formatISTTime(upd.created_at)}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#171C24', margin: '3px 0 0 0' }}>
                        {t(upd.message)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#667085', fontSize: '0.85rem' }}>
                  {t('awaiting_updates') || 'Awaiting initial coordinator updates...'}
                </div>
              )}
            </div>
          </div>

          {/* Post-Resolution Feedback Module */}
          {incident.status === 'Resolved' && (
            <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', padding: '1.75rem', borderRadius: 16, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <CheckCircle2 size={28} color="#027A48" />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171C24', margin: 0 }}>
                    {t('emergency_resolved_title') || 'Emergency Resolved — Share Your Feedback'}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#344252', margin: '4px 0 0 0' }}>
                    {t('feedback_intro') || 'Thank you for sharing your experience. Your feedback helps make CareOn better for everyone.'}
                  </p>
                </div>
              </div>

              {feedbackSubmitted || incident.feedback ? (
                <div style={{ padding: 14, backgroundColor: '#ECFDF3', borderRadius: 8, border: '1px solid #A6F4C5' }}>
                  <div style={{ fontWeight: 800, color: '#027A48', fontSize: '0.95rem' }}>
                    ★ ★ ★ ★ ★ {t('feedback_received') || 'Feedback Received'}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#027A48', margin: '4px 0 0 0' }}>
                    {t('feedback_thanks') || 'Thank you! Your ratings have been logged in the coordinator quality database.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
                      {t('rate_coordination') || 'How would you rate the emergency coordination? (1 - 5 Stars)'}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                        >
                          <Star
                            size={28}
                            color="#F59E0B"
                            fill={star <= rating ? '#F59E0B' : 'transparent'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
                      {t('written_comments') || 'Written Comments (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      className="input-field"
                      style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('feedback_comments_placeholder') || 'Share any thoughts on response speed, clarity, or coordinator support...'}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={feedbackSubmitting} style={{ background: '#171C24', color: '#FFFFFF', fontWeight: 700, borderRadius: 8, padding: '0.65rem 1.4rem', border: 'none', cursor: 'pointer' }}>
                    {feedbackSubmitting ? t('loading') : (t('btn_submit_feedback') || 'Submit Feedback')}
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 480, backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #DCE5EB', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B42318', margin: '0 0 0.5rem 0' }}>
              {t('cancel_modal_title') || 'Cancel Emergency Request'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#344252', margin: '0 0 1.25rem 0' }}>
              {t('cancel_modal_desc') || 'Please let our command coordinator know why you are cancelling so we can safely release any dispatched resources for other urgent incidents.'}
            </p>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
                {t('cancel_reason_label') || 'Reason for Cancellation'} *
              </label>
              <select
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.65rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Emergency resolved">{t('reason_resolved') || 'Emergency resolved'}</option>
                <option value="Help arranged independently">{t('reason_arranged_independently') || 'Help arranged independently'}</option>
                <option value="Request submitted by mistake">{t('reason_mistake') || 'Request submitted by mistake'}</option>
                <option value="Other">{t('reason_other') || 'Other'}</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
                {t('additional_details') || 'Additional Details (Optional)'}
              </label>
              <textarea
                rows={2}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                placeholder={t('cancel_details_placeholder') || 'E.g., Local clinic doctor arrived, patient is stable...'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ borderColor: '#DCE5EB', color: '#171C24', background: '#FFFFFF', borderRadius: 8, fontWeight: 700 }}
                onClick={() => setShowCancelModal(false)}
              >
                {t('keep_active') || 'Keep Active'}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#F04438', color: '#FFFFFF', border: 'none', borderRadius: 8, fontWeight: 800, padding: '0.65rem 1.25rem', cursor: 'pointer' }}
                onClick={handleCancelSubmit}
                disabled={cancelling}
              >
                {cancelling ? t('loading') : (t('confirm_cancellation') || 'Confirm Cancellation')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}