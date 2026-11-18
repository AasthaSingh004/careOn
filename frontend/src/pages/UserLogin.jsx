import React, { useState } from 'react';
import { useTranslation } from '../translations';
import { loginUser } from '../api';
import CareOnLogo from '../components/CareOnLogo';
import { LogIn, User, Lock, AlertCircle, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export default function UserLogin({ lang = 'en', onLoginSuccess, onNavigate }) {
  const { t } = useTranslation(lang);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError(t('fill_all_fields'));
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      setSuccess(t('login_success') || 'Login successful! Redirecting to your dashboard...');
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('user_dashboard');
        }
      }, 500);
    } catch (err) {
      setError(err.message || t('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('aastha@example.com');
    setPassword('user123');
    setError('');
  };

  return (
    <div style={{ maxWidth: 460, margin: '2.5rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ padding: '2rem', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <CareOnLogo size={52} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#134e4a', margin: '0 0 0.5rem 0' }}>
            {t('user_login_title')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            {t('user_login_subtitle')}
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: 8,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.875rem'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: '#334155' }}>
              {t('email_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="email"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: '#334155' }}>
              {t('password_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="password"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box' }}
                placeholder={t('password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            disabled={loading}
          >
            {loading ? t('loading') : (
              <>
                <span>{t('sign_in_btn')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem',
          borderRadius: 8,
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
            {t('demo_account_hint')}
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleFillDemo}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            {t('fill_demo_user')} (Demo User)
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          <span>{t('no_account_prompt')} </span>
          <button
            type="button"
            onClick={() => onNavigate('user_register')}
            style={{ background: 'none', border: 'none', color: '#0d9488', fontWeight: 600, cursor: 'pointer', padding: 0 }}
          >
            {t('register_link')}
          </button>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
          <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
          <span>{t('coordinator_access_hint')} </span>
          <button
            type="button"
            onClick={() => onNavigate('admin_login')}
            style={{ background: 'none', border: 'none', color: '#475569', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
          >
            {t('admin_login_link')}
          </button>
        </div>
      </div>
    </div>
  );
}
