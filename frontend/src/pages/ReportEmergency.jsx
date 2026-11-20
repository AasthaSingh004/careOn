import React, { useState, useEffect } from 'react';
import { reportIncident, loginUser } from '../api';
import { useTranslation } from '../translations';
import LeafletMap from '../components/LeafletMap';
import {
  AlertTriangle,
  MapPin,
  Users,
  Heart,
  Phone,
  User,
  ShieldAlert,
  CheckCircle2,
  Send,
  Loader2,
  Flame,
  Car,
  Stethoscope,
  LifeBuoy,
  Waves,
  Shield
} from 'lucide-react';

export default function ReportEmergency({ lang = 'en', onSubmitted, currentUser }) {
  const { t } = useTranslation(lang);

  const CATEGORIES = [
    { id: 'Medical', title: t('cat_medical'), icon: <Stethoscope size={22} />, desc: t('cat_desc_medical') || 'Cardiac, breathing, trauma, severe injury' },
    { id: 'Road accident', title: t('cat_road_accident'), icon: <Car size={22} />, desc: t('cat_desc_road') || 'Vehicular collision, trapped passengers' },
    { id: 'Fire', title: t('cat_fire'), icon: <Flame size={22} />, desc: t('cat_desc_fire') || 'Building fire, smoke, gas cylinder leak' },
    { id: 'Rescue', title: t('cat_rescue'), icon: <LifeBuoy size={22} />, desc: t('cat_desc_rescue') || 'Building collapse, lake drowning, trapped victim' },
    { id: 'Disaster / Multiple affected people', title: t('cat_disaster'), icon: <Waves size={22} />, desc: t('cat_desc_disaster') || 'Heavy flood, storm, mass casualty event' },
    { id: 'Safety / Other', title: t('cat_safety'), icon: <Shield size={22} />, desc: t('cat_desc_safety') || 'Public safety distress, crowd hazard, first-aid' },
  ];

  const [category, setCategory] = useState(() => {
    try {
      const stored = sessionStorage.getItem('careon_selected_category');
      if (stored) {
        sessionStorage.removeItem('careon_selected_category');
        return stored;
      }
    } catch {}
    return 'Medical';
  });
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  // Mysuru, Karnataka default coordinates
  const [latitude, setLatitude] = useState(12.3052);
  const [longitude, setLongitude] = useState(76.6552);
  const [isLocating, setIsLocating] = useState(false);
  const [affectedPeople, setAffectedPeople] = useState(1);
  const [helpRequired, setHelpRequired] = useState('');
  const [contactName, setContactName] = useState(currentUser?.name || currentUser?.full_name || 'Demo User');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isDisaster, setIsDisaster] = useState(false);
  const [disasterDetails, setDisasterDetails] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize contact name and phone with logged-in citizen account
  useEffect(() => {
    if (currentUser?.name || currentUser?.full_name) {
      setContactName(currentUser.name || currentUser.full_name);
    }
    if (currentUser?.phone) {
      setContactPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert(t('geo_not_supported') || 'Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        if (!locationName) {
          setLocationName(`Mysuru GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        // Fallback to Mysuru center
        setLatitude(12.3052);
        setLongitude(76.6552);
        if (!locationName) {
          setLocationName('Mysuru City Center, Karnataka');
        }
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!description.trim() || description.length < 5) {
      setError(t('err_desc_required') || 'Please provide a brief description of what happened (at least 5 characters).');
      return;
    }
    if (!locationName.trim()) {
      setError(t('err_loc_required') || 'Please specify the location or landmark.');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      setError(t('err_contact_required') || 'Contact person name and phone number are required.');
      return;
    }
    if (contactPhone.replace(/[^0-9]/g, '').length < 8) {
      setError(t('invalid_phone') || 'Please enter a valid phone number with at least 8 digits.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category,
        description: description.trim(),
        location_name: locationName.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        affected_people: parseInt(affectedPeople) || 1,
        help_required: helpRequired.trim() || `${category} immediate assistance`,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        additional_details: additionalDetails || null,
        is_disaster: isDisaster || category.startsWith('Disaster'),
        disaster_details: disasterDetails || null,
      };

      // Ensure reporter has an active citizen session so in-app verification OTP is delivered and verifiable
      if (typeof localStorage !== 'undefined' && !localStorage.getItem('careon_user_token')) {
        try {
          await loginUser('aastha@example.com', 'user123');
        } catch {
          // If login fails (e.g. mock test environment), proceed with report
        }
      }

      const result = await reportIncident(payload);
      onSubmitted?.(result.incident_code || result.id, result.simulated_otp);
    } catch (err) {
      setError(err.message || t('report_failed') || 'Failed to submit emergency report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* 112 Advisory Banner */}
      <div
        style={{
          backgroundColor: '#FEE4E2',
          border: '1px solid #FECDCA',
          borderRadius: 12,
          padding: '12px 18px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ fontSize: '0.875rem', color: '#B42318', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>{t('helpline_alert_title') || 'Immediate Danger?'}:</strong> {t('helpline_alert_desc') || 'For life-threatening emergencies, dial 112 directly.'}
          </span>
        </div>
        <a
          href="tel:112"
          className="btn"
          style={{
            background: '#F04438',
            color: '#FFFFFF',
            textDecoration: 'none',
            padding: '0.45rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            borderRadius: 8,
            boxShadow: '0 2px 6px rgba(240, 68, 56, 0.3)'
          }}
        >
          {t('dial_112_btn') || 'Call 112'}
        </a>
      </div>

      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: 16, border: '1px solid #DCE5EB', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.4rem 0' }}>
            {t('report_emergency_title') || 'Report an Emergency'}
          </h2>
          <p style={{ color: '#344252', fontSize: '0.95rem', margin: 0 }}>
            {t('report_emergency_desc') || 'Provide key incident details. CareOn coordinates the closest suitable medical, fire, or rescue fleet.'}
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEE4E2',
              border: '1px solid #FECDCA',
              color: '#B42318',
              padding: '0.85rem 1rem',
              borderRadius: 8,
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Category */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem', color: '#171C24' }}>
              1. {t('emergency_category_label') || 'Select Emergency Category'} *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.85rem'
            }}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      if (cat.id.startsWith('Disaster')) setIsDisaster(true);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.95rem 1rem',
                      borderRadius: 10,
                      border: isSelected ? '2px solid #F04438' : '1px solid #DCE5EB',
                      background: isSelected ? '#F5F6F7' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: isSelected ? '#F04438' : '#344252' }}>{cat.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.925rem', color: '#171C24' }}>
                        {cat.title}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#344252', lineHeight: 1.35 }}>
                      {cat.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Description */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="desc-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#171C24' }}>
              2. {t('what_happened_label') || 'What happened? (Short Description)'} *
            </label>
            <textarea
              id="desc-input"
              rows={3}
              className="input-field"
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('desc_placeholder') || 'E.g., Severe traffic accident near junction, rider injured and unconscious on pavement...'}
              required
            />
          </div>

          {/* Step 3: Location (Mysuru) */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label htmlFor="loc-input" style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: '#171C24' }}>
                3. {t('location_label') || 'Location / Landmark in Mysuru'} *
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F04438',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer'
                }}
              >
                <MapPin size={15} />
                <span>{isLocating ? (t('locating') || 'Detecting GPS...') : (t('use_my_location') || 'Use My GPS Location')}</span>
              </button>
            </div>
            <input
              id="loc-input"
              type="text"
              className="input-field"
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder={t('location_placeholder') || 'E.g., Near KR Hospital, Sayyaji Rao Road, Mysuru'}
              required
            />
            {/* Interactive Leaflet Location Picker */}
            <div style={{ marginTop: '0.75rem', borderRadius: 10, overflow: 'hidden', border: '1px solid #DCE5EB' }}>
              <LeafletMap
                height="220px"
                center={[latitude, longitude]}
                selectable={true}
                selectedLocation={{ latitude, longitude }}
                lang={lang}
                onLocationSelect={({ latitude: lat, longitude: lng }) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  if (!locationName || locationName.startsWith('Mysuru Coordinates:') || locationName.startsWith('Mysuru Location (')) {
                    setLocationName(`Mysuru Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                  }
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', fontSize: '0.8rem', color: '#344252' }}>
              <span>{t('map_picker_hint', '📍 Click map or drag pin to select exact Mysuru coordinates')}</span>
              <span>{t('lat_label', 'Lat')}: <strong>{Number(latitude).toFixed(4)}</strong>, {t('lon_label', 'Lon')}: <strong>{Number(longitude).toFixed(4)}</strong></span>
            </div>
          </div>

          {/* Step 4: Urgency Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="form-group">
              <label htmlFor="affected-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#171C24' }}>
                {t('affected_people_label') || 'Affected People'} *
              </label>
              <input
                id="affected-input"
                type="number"
                min="1"
                max="500"
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={affectedPeople}
                onChange={(e) => setAffectedPeople(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="help-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#171C24' }}>
                {t('help_required_label') || 'Type of Help Required'}
              </label>
              <input
                id="help-input"
                type="text"
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={helpRequired}
                onChange={(e) => setHelpRequired(e.target.value)}
                placeholder={t('help_placeholder') || 'E.g., Advanced ICU ambulance, oxygen, stretcher'}
              />
            </div>
          </div>

          {/* Disaster supplies if disaster category */}
          {category.startsWith('Disaster') && (
            <div className="form-group" style={{ backgroundColor: '#F5F6F7', border: '1px solid #DCE5EB', padding: '1rem', borderRadius: 8, marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '0.9rem', color: '#171C24', marginBottom: '0.45rem' }}>
                {t('disaster_supplies_label') || 'Mass Disaster Relief Supplies'}
              </label>
              <input
                type="text"
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={disasterDetails}
                onChange={(e) => setDisasterDetails(e.target.value)}
                placeholder={t('disaster_placeholder') || 'E.g., Drinking water, rescue boats, emergency shelter'}
              />
            </div>
          )}

          {/* Step 5: Contact Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="form-group">
              <label htmlFor="contact-name-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#171C24' }}>
                {t('contact_name_label') || 'Your / Contact Name'} *
              </label>
              <input
                id="contact-name-input"
                type="text"
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t('full_name_placeholder') || 'Enter contact name'}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-phone-input" style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#171C24' }}>
                {t('contact_phone_label') || 'Contact Phone Number'} *
              </label>
              <input
                id="contact-phone-input"
                type="tel"
                className="input-field"
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem', fontSize: '0.95rem', color: '#171C24', backgroundColor: '#FFFFFF' }}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Emergency Contact Verification Notice */}
          <div
            style={{
              backgroundColor: '#F5F6F7',
              border: '1px dashed #DCE5EB',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#171C24' }}>
                {t('demo_otp_title') || 'Emergency Contact Verification'}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#344252', marginTop: 2 }}>
                {t('demo_otp_desc') || 'An emergency verification code is generated for your contact number upon submission.'}
              </div>
            </div>
            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} />
              <span>{t('pre_authorized') || 'Simulated Verification'}</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.95rem',
              fontSize: '1.05rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#F04438',
              borderRadius: 10,
              boxShadow: '0 4px 14px rgba(240, 68, 56, 0.35)',
              cursor: 'pointer'
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>{t('submitting') || 'Submitting Incident...'}</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>{t('submit_emergency_btn') || 'Submit Emergency Request'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
