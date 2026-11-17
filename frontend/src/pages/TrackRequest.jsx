import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchIncidentDetails,
  cancelIncident,
  updateProviderEnquiry,
  submitFeedback,
} from '../api';
import { translations } from '../translations';

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
  const t = translations[lang] || translations.en;

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
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidentDetails(code.trim());
      setIncident(data);
    } catch (err) {
      setError(`Could not find request with code "${code}". Please check the ID.`);
      setIncident(null);
    } finally {
      setLoading(false);
    }
  }, [searchCode]);

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
      await cancelIncident(incident.id, cancelReason, cancelDetails);
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
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Top Search Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f4c5c', marginBottom: '12px' }}>
          Track Your Emergency Request
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadIncident();
          }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
        >
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, minWidth: '220px', fontWeight: 700 }}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder="Enter Incident Code (e.g. CARE-2026-101)"
          />
          <button type="submit" className="btn btn-teal" disabled={loading}>
            {loading ? 'Searching...' : 'Track Request'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '14px', color: '#b91c1c', fontSize: '13.5px', fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {incident && (
        <>
          {/* Main Status Tracker Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 800 }}>{incident.incident_code}</h3>
                  <span className={`status-badge ${incident.priority === 'Critical' ? 'badge-critical' : 'badge-high'}`}>
                    {incident.priority} Priority
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {incident.category} • {incident.location_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="status-badge badge-dispatched" style={{ fontSize: '13px', padding: '6px 14px' }}>
                  ● {incident.status}
                </span>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                  Reported: {new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Lifecycle Progress Bar */}
            {incident.status !== 'Cancelled' && (
              <div style={{ margin: '24px 0 32px' }}>
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
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? '#0f4c5c' : '#e2e8f0',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            boxShadow: isCurrent ? '0 0 0 4px rgba(15, 76, 92, 0.2)' : 'none',
                          }}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span
                          style={{
                            fontSize: '10.5px',
                            marginTop: '6px',
                            textAlign: 'center',
                            fontWeight: isCurrent ? 800 : 500,
                            color: isCurrent ? '#0f4c5c' : '#64748b',
                          }}
                        >
                          {step}
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
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                  <span>🚑</span>
                  <span>Assigned Emergency Response Unit</span>
                </div>
                {incident.assignments.map((asgn) => (
                  <div key={asgn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                        {asgn.resource?.name || 'Rapid Response Ambulance 01'}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569' }}>
                        Type: {asgn.resource?.category || 'Ambulance'} • Contact: {asgn.resource?.contact_phone || '+91 98001 00001'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                        {asgn.notes || 'En route to incident coordinates.'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Estimated Arrival</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f4c5c' }}>~6 - 8 mins</div>
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
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f4c5c', marginBottom: '12px' }}>
                Cost Transparency & External Provider Details
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>{t.platform_fee_label}:</span>
                <strong style={{ color: '#166534' }}>{t.platform_fee_free}</strong>
              </div>

              {incident.provider_enquiries && incident.provider_enquiries.length > 0 ? (
                incident.provider_enquiries.map((enq) => (
                  <div key={enq.id} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>External Partner Quotation:</span>
                      <strong style={{ color: '#0f172a' }}>₹{enq.charge_quote.toFixed(2)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                      <span>Subsidy / NGO Sponsorship:</span>
                      <strong style={{ color: '#0284c7' }}>- ₹{enq.subsidy_amount.toFixed(2)}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 700, marginBottom: '12px' }}>
                      <span>Net Payable to Service Provider:</span>
                      <strong style={{ color: '#ef4444' }}>₹{(enq.charge_quote - enq.subsidy_amount).toFixed(2)}</strong>
                    </div>

                    {/* Informed Consent Buttons */}
                    {enq.user_consent === 'Pending' && (
                      <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12.5px', color: '#92400e', fontWeight: 600, marginBottom: '8px' }}>
                          ⚠️ {t.consent_required_msg}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            className="btn btn-teal btn-sm"
                            onClick={() => handleConsentDecision(enq.id, 'Accepted')}
                          >
                            ✓ Accept Quotation & Confirm Dispatch
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleConsentDecision(enq.id, 'Declined')}
                          >
                            ✕ Decline (Seek Free Public/NGO Alternative)
                          </button>
                        </div>
                      </div>
                    )}

                    {enq.user_consent === 'Accepted' && (
                      <div className="status-badge badge-resolved" style={{ marginTop: '6px' }}>
                        ✓ {t.consent_accepted} by Reporter
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  No external paid provider assigned. Standard public/platform resources deployed at zero charge.
                </div>
              )}
            </div>

            {/* Actions: Call Coordinator & Cancel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              <button
                className="btn btn-outline"
                onClick={() => (window.location.href = 'tel:+918022334455')}
              >
                📞 Contact Command Coordinator
              </button>

              {incident.status !== 'Resolved' && incident.status !== 'Cancelled' && (
                <button
                  className="btn btn-outline"
                  style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                  onClick={() => setShowCancelModal(true)}
                >
                  ✕ {t.btn_cancel_request}
                </button>
              )}
            </div>
          </div>

          {/* Timeline of Updates */}
          <div className="card">
            <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Live Activity & Audit Timeline</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {incident.updates && incident.updates.length > 0 ? (
                incident.updates.map((upd) => (
                  <div key={upd.id} style={{ display: 'flex', gap: '12px' }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#0f4c5c',
                        marginTop: '5px',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                        <span><strong>{upd.actor}</strong> ({upd.status})</span>
                        <span>{new Date(upd.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ fontSize: '13.5px', color: '#1e293b', marginTop: '2px' }}>
                        {upd.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>Awaiting initial coordinator updates...</div>
              )}
            </div>
          </div>

          {/* Post-Resolution Feedback Module */}
          {incident.status === 'Resolved' && (
            <div className="card" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>❤️</span>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#166534' }}>
                    Emergency Resolved — Share Your Feedback
                  </h3>
                  <p style={{ fontSize: '13px', color: '#15803d' }}>
                    Thank you for sharing your experience. ❤️ Your feedback helps us make CareOn better for everyone.
                  </p>
                </div>
              </div>

              {feedbackSubmitted || incident.feedback ? (
                <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <div style={{ fontWeight: 700, color: '#166534', fontSize: '14px' }}>
                    ★ ★ ★ ★ ★ Feedback Received
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                    Thank you! Your ratings have been logged in the coordinator quality database.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="form-group">
                    <label className="form-label">How would you rate the emergency coordination? (1 - 5 Stars)</label>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '24px', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          style={{ color: star <= rating ? '#f59e0b' : '#cbd5e1' }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Feedback Tags</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Easy to use', 'Clear updates', 'Helpful coordination', 'Slow response', 'Other'].map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => {
                            if (selectedTags.includes(tag)) {
                              setSelectedTags(selectedTags.filter((t) => t !== tag));
                            } else {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          className={`btn btn-sm ${selectedTags.includes(tag) ? 'btn-teal' : 'btn-outline'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Written Comments (Optional)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share any thoughts on response speed, clarity, or coordinator support..."
                    />
                  </div>

                  <button type="submit" className="btn btn-teal btn-sm" disabled={feedbackSubmitting}>
                    {feedbackSubmitting ? 'Submitting...' : t.btn_submit_feedback}
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#b91c1c', marginBottom: '8px' }}>
              Cancel Emergency Request
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '16px' }}>
              Please let our command coordinator know why you are cancelling so we can safely release any dispatched resources for other urgent incidents.
            </p>

            <div className="form-group">
              <label className="form-label">Reason for Cancellation *</label>
              <select
                className="form-select"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option value="Emergency resolved">Emergency resolved</option>
                <option value="Help arranged independently">Help arranged independently</option>
                <option value="Request submitted by mistake">Request submitted by mistake</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Details (Optional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={cancelDetails}
                onChange={(e) => setCancelDetails(e.target.value)}
                placeholder="E.g., Local clinic doctor arrived, patient is stable..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Active
              </button>
              <button
                type="button"
                className="btn btn-primary-red"
                onClick={handleCancelSubmit}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
