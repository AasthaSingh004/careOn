import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchIncidentDetails,
  cancelIncident,
  updateProviderEnquiry,
  submitFeedback,
} from '../api';
import { useTranslation } from '../translations';
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
  ArrowRight
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

export default function TrackRequest({ lang = 'en', initialIncidentCode, onNavigate }) {
  const { t } = useTranslation(lang);

  const [searchCode, setSearchCode] = useState(initialIncidentCode || 'CARE-2026-101');
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, [searchCode, t]);

  useEffect(() => {
    if (initialIncidentCode) {
      setSearchCode(initialIncidentCode);
      loadIncident(initialIncidentCode);
    } else {
      loadIncident('CARE-2026-101');
    }
  }, [initialIncidentCode, loadIncident]);

  // Polling for updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (searchCode && incident && incident.status !== 'Resolved' && incident.status !== 'Cancelled') {
        loadIncident(searchCode);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [searchCode, incident, loadIncident]);

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
      <div className="card" style={{ padding: '1.5rem', borderRadius: 14, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#134e4a', margin: '0 0 0.75rem 0' }}>
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
            style={{ flex: 1, minWidth: 220, fontWeight: 700, textTransform: 'uppercase' }}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder={t('track_input_placeholder') || 'Enter Incident Code (e.g. CARE-2026-101)'}
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Search size={16} />
            <span>{loading ? t('loading') : (t('track_request_btn') || 'Track Request')}</span>
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            fontSize: '0.875rem',
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
          <div className="card" style={{ padding: '1.75rem', borderRadius: 14, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, fontFamily: 'monospace' }}>{incident.incident_code}</h3>
                  <span className={`badge ${incident.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>
                    {t(`priority_${incident.priority?.toLowerCase()}`) || incident.priority}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {t(`cat_${incident.category?.toLowerCase()}`) || incident.category} • {incident.location_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-info" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  ● {t(`status_${incident.status?.toLowerCase()}`) || incident.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>
                  {t('reported_at') || 'Reported'}: {new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

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
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? '#0d9488' : '#e2e8f0',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            boxShadow: isCurrent ? '0 0 0 4px rgba(13, 148, 136, 0.25)' : 'none',
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
                            color: isCurrent ? '#0f766e' : '#64748b',
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
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  padding: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#166534', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  <Truck size={18} />
                  <span>{t('assigned_unit_title') || 'Assigned Emergency Response Unit'}</span>
                </div>
                {incident.assignments.map((asgn) => (
                  <div key={asgn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a' }}>
                        {asgn.resource?.name || 'Rapid Response Ambulance 01'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#475569' }}>
                        {t('category') || 'Type'}: {asgn.resource?.category || 'Ambulance'} • Contact: {asgn.resource?.contact_phone || '+91 98001 00001'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: 4 }}>
                        {asgn.notes || 'En route to incident coordinates.'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('eta') || 'Estimated Arrival'}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f766e' }}>~6 - 8 mins</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cost Transparency & Consent Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#134e4a', margin: '0 0 0.75rem 0' }}>
                {t('cost_transparency_title') || 'Cost Transparency & External Provider Details'}
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                <span>{t('platform_fee_label') || 'CareOn Platform Commission'}:</span>
                <strong style={{ color: '#166534' }}>{t('platform_fee_free') || '₹0.00 (Always Free)'}</strong>
              </div>

              {incident.provider_enquiries && incident.provider_enquiries.length > 0 ? (
                incident.provider_enquiries.map((enq) => (
                  <div key={enq.id} style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                      <span>External Partner Quotation:</span>
                      <strong style={{ color: '#0f172a' }}>₹{enq.charge_quote?.toFixed(2)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                      <span>Subsidy / NGO Sponsorship:</span>
                      <strong style={{ color: '#0284c7' }}>- ₹{enq.subsidy_amount?.toFixed(2)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: 10 }}>
                      <span>Net Payable to Service Provider:</span>
                      <strong style={{ color: '#ef4444' }}>₹{((enq.charge_quote || 0) - (enq.subsidy_amount || 0)).toFixed(2)}</strong>
                    </div>

                    {/* Informed Consent Buttons */}
                    {enq.user_consent === 'Pending' && (
                      <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: 12, borderRadius: 8 }}>
                        <div style={{ fontSize: '0.825rem', color: '#92400e', fontWeight: 600, marginBottom: 8 }}>
                          ⚠️ {t('consent_required_msg') || 'Informed consent required for external provider service.'}
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleConsentDecision(enq.id, 'Accepted')}
                          >
                            ✓ {t('accept_quote') || 'Accept Quotation & Confirm Dispatch'}
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
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
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {t('free_public_resources') || 'No external paid provider assigned. Standard public/platform resources deployed at zero charge.'}
                </div>
              )}
            </div>

            {/* Actions: Contact Coordinator & Cancel Request */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginTop: '1rem' }}>
              <a
                href="tel:112"
                className="btn btn-outline"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Phone size={15} />
                <span>{t('contact_coordinator') || 'Contact Command Coordinator'}</span>
              </a>

              {incident.status !== 'Resolved' && incident.status !== 'Cancelled' && (
                <button
                  className="btn btn-outline"
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                  onClick={() => setShowCancelModal(true)}
                >
                  ✕ {t('btn_cancel_request') || 'Cancel Emergency Request'}
                </button>
              )}
            </div>
          </div>

          {/* Timeline of Updates */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: 14, marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
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
                        backgroundColor: '#0d9488',
                        marginTop: 5,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: '#64748b' }}>
                        <span><strong>{upd.actor}</strong> ({upd.status})</span>
                        <span>{new Date(upd.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#1e293b', margin: '3px 0 0 0' }}>
                        {upd.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {t('awaiting_updates') || 'Awaiting initial coordinator updates...'}
                </div>
              )}
            </div>
          </div>

          {/* Post-Resolution Feedback Module */}
          {incident.status === 'Resolved' && (
            <div className="card" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <CheckCircle2 size={28} color="#16a34a" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                    {t('emergency_resolved_title') || 'Emergency Resolved — Share Your Feedback'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#15803d', margin: 0 }}>
                    {t('feedback_intro') || 'Thank you for sharing your experience. Your feedback helps make CareOn better for everyone.'}
                  </p>
                </div>
              </div>

              {feedbackSubmitted || incident.feedback ? (
                <div style={{ padding: 12, backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #86efac' }}>
                  <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.9rem' }}>
                    ★ ★ ★ ★ ★ {t('feedback_received') || 'Feedback Received'}
                  </div>
                  <p style={{ fontSize: '0.825rem', color: '#475569', margin: '4px 0 0 0' }}>
                    {t('feedback_thanks') || 'Thank you! Your ratings have been logged in the coordinator quality database.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
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
                            size={26}
                            color="#f59e0b"
                            fill={star <= rating ? '#f59e0b' : 'transparent'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                      {t('written_comments') || 'Written Comments (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      className="input-field"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('feedback_comments_placeholder') || 'Share any thoughts on response speed, clarity, or coordinator support...'}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={feedbackSubmitting}>
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
          <div className="modal-content" style={{ maxWidth: 460 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b91c1c', margin: '0 0 0.5rem 0' }}>
              {t('cancel_modal_title') || 'Cancel Emergency Request'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              {t('cancel_modal_desc') || 'Please let our command coordinator know why you are cancelling so we can safely release any dispatched resources for other urgent incidents.'}
            </p>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                {t('cancel_reason_label') || 'Reason for Cancellation'} *
              </label>
              <select
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Emergency resolved">{t('reason_resolved') || 'Emergency resolved'}</option>
                <option value="Help arranged independently">{t('reason_arranged_independently') || 'Help arranged independently'}</option>
                <option value="Request submitted by mistake">{t('reason_mistake') || 'Request submitted by mistake'}</option>
                <option value="Other">{t('reason_other') || 'Other'}</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                {t('additional_details') || 'Additional Details (Optional)'}
              </label>
              <textarea
                rows={2}
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                placeholder={t('cancel_details_placeholder') || 'E.g., Local clinic doctor arrived, patient is stable...'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                {t('keep_active') || 'Keep Active'}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#e11d48' }}
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
