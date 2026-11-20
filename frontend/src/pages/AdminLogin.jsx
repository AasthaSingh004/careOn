import React, { useState } from 'react';
import { useTranslation } from '../translations';
import { loginAdmin } from '../api';
import CareOnLogo from '../components/CareOnLogo';
import { ShieldCheck, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, User } from 'lucide-react';

export default function AdminLogin({ lang = 'en', onLoginSuccess, onNavigate }) {
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
      const res = await loginAdmin(email, password);
      setSuccess(t('admin_login_success') || 'Authentication successful! Redirecting to Command Centre...');
      if (onLoginSuccess) {
        onLoginSuccess(res.user);
      }
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('admin_dashboard');
        }
      }, 500);
    } catch (err) {
      setError(err.message || t('admin_unauthorized'));
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@careon.org');
    setPassword('admin123');
    setError('');
  };

  return (
    <div style={{ maxWidth: 460, margin: '2.5rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '2.25rem', borderRadius: 16, border: '1px solid #DCE5EB', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <CareOnLogo size={52} color="#F04438" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#171C24', margin: '0 0 0.4rem 0' }}>
            {t('admin_login_title')}
          </h2>
          <p style={{ color: '#344252', fontSize: '0.9rem', margin: 0 }}>
            {t('admin_login_subtitle')}
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
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('email_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="email"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder="admin@careon.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#171C24' }}>
              {t('password_label')}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#667085' }} />
              <input
                type="password"
                className="input-field"
                style={{ width: '100%', paddingLeft: '2.5rem', boxSizing: 'border-box', border: '1px solid #DCE5EB', borderRadius: 8, padding: '0.75rem 0.75rem 0.75rem 2.5rem', backgroundColor: '#FFFFFF', color: '#171C24' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 800,
              background: '#171C24',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {loading ? t('loading') : (
              <>
                <span>{t('admin_login_btn')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Admin Quick Credentials */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.95rem',
          borderRadius: 8,
          background: '#F5F6F7',
          border: '1px dashed #DCE5EB',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', color: '#344252' }}>
            {t('demo_admin_credentials_hint') || 'Demonstration Coordinator Account'}
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleFillDemo}
            style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem', borderColor: '#DCE5EB', color: '#171C24', background: '#FFFFFF', fontWeight: 700 }}
          >
            {t('fill_demo_admin')}{lang === 'en' ? ' (Aastha Singh - Coordinator)' : <span style={{ display: 'none' }}> (Aastha Singh - Coordinator)</span>}
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#344252' }}>
          <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
          <span>{t('looking_for_user_portal')} </span>
          <button
            type="button"
            onClick={() => onNavigate('user_login')}
            style={{ background: 'none', border: 'none', color: '#F04438', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {t('user_login_title')}
          </button>
        </div>
      </div>
    </div>
  );
}
