import React, { useState } from 'react';
import { reportIncident } from '../api';
import { translations } from '../translations';

const CATEGORIES = [
  { id: 'Medical', title: 'Medical', icon: '🚑', desc: 'Cardiac, breathing, trauma, unconsciousness' },
  { id: 'Road accident', title: 'Road Accident', icon: '🚗', desc: 'Vehicular collision, trapped passengers' },
  { id: 'Fire', title: 'Fire Outbreak', icon: '🔥', desc: 'Structural fire, smoke, hazardous gas leak' },
  { id: 'Rescue', title: 'Rescue Needed', icon: '🦺', desc: 'Building collapse, drowning, trapped person' },
  { id: 'Disaster / Multiple affected people', title: 'Disaster / Mass Event', icon: '🌊', desc: 'Flood, storm, mass casualty disaster' },
  { id: 'Safety / Other', title: 'Safety / Other', icon: '🛡️', desc: 'Public safety distress, crowd hazard, first-aid' },
];

export default function ReportEmergency({ lang = 'en', onSubmitted, currentUser }) {
  const t = translations[lang] || translations.en;

  const [category, setCategory] = useState('Medical');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [isLocating, setIsLocating] = useState(false);
  const [affectedPeople, setAffectedPeople] = useState(1);
  const [helpRequired, setHelpRequired] = useState('');
  const [contactName, setContactName] = useState(currentUser?.name || 'Aastha Singh');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isDisaster, setIsDisaster] = useState(false);
  const [disasterDetails, setDisasterDetails] = useState('');

  // Demo OTP state
  const [otp, setOtp] = useState('123456');
  const [isOtpVerified, setIsOtpVerified] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        if (!locationName) {
          setLocationName(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not fetch location automatically. Please enter location manually.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!description.trim() || description.length < 5) {
      setError('Please provide a brief description of what happened (at least 5 characters).');
      return;
    }
    if (!locationName.trim()) {
      setError('Please specify the location or landmark.');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      setError('Contact person name and phone number are required.');
      return;
    }
    if (contactPhone.replace(/[^0-9]/g, '').length < 8) {
      setError('Please enter a valid phone number with at least 8 digits.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category,
        description,
        location_name: locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        affected_people: parseInt(affectedPeople) || 1,
        help_required: helpRequired.trim() || `${category} immediate assistance`,
        contact_name: contactName,
        contact_phone: contactPhone,
        additional_details: additionalDetails || null,
        is_disaster: isDisaster || category.startsWith('Disaster'),
        disaster_details: disasterDetails || null,
      };

      const result = await reportIncident(payload);
      onSubmitted?.(result.incident_code || result.id);
    } catch (err) {
      setError(err.message || 'Failed to submit emergency report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Official emergency reminder */}
      <div
        style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '13.5px', color: '#991b1b', lineHeight: 1.4 }}>
          🚨 <strong>Immediate Danger?</strong> If someone is in critical or life-threatening condition, call <strong>112</strong> or <strong>108</strong> directly now.
        </div>
        <button
          onClick={() => (window.location.href = 'tel:112')}
          className="btn btn-primary-red btn-sm"
        >
          Call 112
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f4c5c', marginBottom: '8px' }}>
          Request Emergency Assistance
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
          Share necessary incident details. CareOn will verify the report, assess urgency, and coordinate available resources.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Category */}
          <div className="form-group">
            <label className="form-label">1. Select Emergency Category *</label>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-card-btn ${category === cat.id ? 'selected' : ''}`}
                  onClick={() => {
                    setCategory(cat.id);
                    if (cat.id.startsWith('Disaster')) setIsDisaster(true);
                  }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-title">{cat.title}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.2 }}>{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="desc-input">2. What happened? (Short Description) *</label>
            <textarea
              id="desc-input"
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Two-wheeler slipped near junction, rider injured and unconscious on pavement..."
              required
            />
          </div>

          {/* Step 3: Location */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }} htmlFor="loc-input">3. Location / Landmark *</label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                style={{
                  color: '#0284c7',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                📍 {isLocating ? 'Detecting GPS...' : 'Use My GPS Location'}
              </button>
            </div>
            <input
              id="loc-input"
              type="text"
              className="form-input"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="E.g., MG Road Metro Station Gate 2, Bangalore"
              required
            />
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
              <span>Latitude: <strong>{Number(latitude).toFixed(4)}</strong></span>
              <span>Longitude: <strong>{Number(longitude).toFixed(4)}</strong></span>
            </div>
          </div>

          {/* Step 4: Urgency Metrics */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="affected-input">Number of Affected People *</label>
              <input
                id="affected-input"
                type="number"
                min="1"
                max="500"
                className="form-input"
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="help-input">Type of Help Required</label>
              <input
                id="help-input"
                type="text"
                className="form-input"
                value={helpRequired}
                onChange={(e) => setHelpRequired(e.target.value)}
                placeholder="E.g., Ambulance with oxygen, First aid, Fire tender"
              />
            </div>
          </div>

          {/* Disaster details if disaster is selected */}
          {category.startsWith('Disaster') && (
            <div className="form-group" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '14px', borderRadius: '8px' }}>
              <label className="form-label" style={{ color: '#0369a1' }}>Disaster Relief Supplies Needed</label>
              <input
                type="text"
                className="form-input"
                value={disasterDetails}
                onChange={(e) => setDisasterDetails(e.target.value)}
                placeholder="E.g., Drinking water (100L), rescue boats, food packets, emergency shelter"
              />
            </div>
          )}

          {/* Step 5: Contact Details */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name-input">Your / Contact Person Name *</label>
              <input
                id="contact-name-input"
                type="text"
                className="form-input"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="E.g., Aastha Singh"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-phone-input">Contact Phone Number *</label>
              <input
                id="contact-phone-input"
                type="tel"
                className="form-input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="E.g., +91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Demo Verification Box */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>
                Local Demo Verification
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                For expo demonstration, automatic phone verification code is <strong>123456</strong>.
              </div>
            </div>
            <span className="status-badge badge-resolved">
              ✓ Verified for Demo
            </span>
          </div>

          {/* Short Emergency Notice as required in Section 6 */}
          <div className="notice-box">
            {t.emergency_notice}
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary-red"
              style={{ flex: 1, padding: '14px' }}
            >
              {submitting ? 'Submitting & Classifying...' : `🚨 ${t.btn_submit}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
