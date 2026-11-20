import React, { useState } from 'react';
import { useTranslation } from '../translations';
import { registerUser } from '../api';
import CareOnLogo from '../components/CareOnLogo';
import { UserPlus, User, Mail, Phone, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UserRegister({ lang = 'en', onRegisterSuccess, onNavigate }) {
  const { t } = useTranslation(lang);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!formData.name.trim()) {
      setError(t('name_required') || 'Full name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError(t('invalid_email') || 'Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setError(t('invalid_phone') || 'Please enter a valid phone number (at least 8 digits).');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError(t('password_too_short') || 'Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError(t('password_mismatch'));
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      setSuccess(t('register_success') || 'Account created successfully! Redirecting...');
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(res.user);
        } else if (onNavigate) {
          onNavigate('user_dashboard');
        }
      }, 600);
    } catch (err) {
      setError(err.message || t('registration_failed') || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: 16, border: '1px solid #DCE5EB', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <CareOnLogo size={52} color="#F04438" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.4rem 0' }}>
            {t('user_register_title')}
          </h2>
          <p style={{ color: '#344252', fontSize: '0.9rem', margin: 0 }}>
            {t('user_register_subtitle')}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE4E2',
            border: '1px solid #FECDCA',
            color: '#B42318',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: '#ECFDF3',
            border: '1px solid #A6F4C5',
            color: '#027A48',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.875rem',
            fontWeight: 700
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('full_name_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="text"
                name="name"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder={t('full_name_placeholder') || 'Enter your full name'}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('email_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="email"
                name="email"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder={t('email_placeholder')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('phone_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="tel"
                name="phone"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder={t('phone_placeholder')}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('password_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="password"
                name="password"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder={t('password_placeholder')}
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('confirm_password_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="password"
                name="confirm_password"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder={t('confirm_password_placeholder')}
                value={formData.confirm_password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#171C24', color: '#FFFFFF', borderRadius: 8, border: 'none', cursor: 'pointer' }}
            disabled={loading}
          >
            {loading ? t('loading') : (
              <>
                <span>{t('create_account_btn')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#344252' }}>
          <span>{t('already_have_account')} </span>
          <button
            type="button"
            onClick={() => onNavigate('user_login')}
            style={{ background: 'none', border: 'none', color: '#F04438', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {t('login_link')}
          </button>
        </div>
      </div>
    </div>
  );
}
