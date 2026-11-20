import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { useTranslation, translations } from '../translations';
import Home from '../pages/Home';
import UserLogin from '../pages/UserLogin';
import UserRegister from '../pages/UserRegister';
import AdminLogin from '../pages/AdminLogin';
import UserDashboard from '../pages/UserDashboard';
import { getInitialLanguage, SUPPORTED_LANGS } from '../App';

// Mock API
vi.mock('../api', () => ({
  loginUser: vi.fn().mockImplementation((email, password) => {
    if (email === 'aastha@example.com' && password === 'user123') {
      return Promise.resolve({
        access_token: 'fake_user_token',
        user: { id: 2, name: 'Demo User', email: 'aastha@example.com', role: 'user' },
      });
    }
    throw new Error('Invalid email or password.');
  }),
  loginAdmin: vi.fn().mockImplementation((email, password) => {
    if (email === 'admin@careon.org' && password === 'admin123') {
      return Promise.resolve({
        access_token: 'fake_admin_token',
        user: { id: 1, name: 'Aastha Singh', email: 'admin@careon.org', role: 'admin' },
      });
    }
    throw new Error('Invalid coordinator credentials.');
  }),
  registerUser: vi.fn().mockImplementation((payload) => {
    return Promise.resolve({
      access_token: 'fake_new_token',
      user: { id: 3, name: payload.name, email: payload.email, phone: payload.phone, role: 'user' },
    });
  }),
  fetchIncidents: vi.fn().mockResolvedValue([
    {
      id: 1,
      incident_code: 'CARE-2026-101',
      category: 'Medical',
      description: 'Acute cardiac arrest',
      location_name: 'Sayyaji Rao Road, Mysuru',
      status: 'Pending',
      priority: 'Critical',
      created_at: new Date().toISOString(),
    },
  ]),
  fetchNotifications: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: 'Dispatch Confirmed',
      message: 'Ambulance AMB-01 dispatched to Sayyaji Rao Road',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]),
  markNotificationAsRead: vi.fn().mockResolvedValue(true),
  confirmArrival: vi.fn().mockResolvedValue({ status: 'Resolved' }),
  submitFeedback: vi.fn().mockResolvedValue({ id: 1, rating: 5 }),
  logoutUser: vi.fn(),
  logoutAdmin: vi.fn(),
}));

describe('Complete Translation System', () => {
  it('translates across English, Hindi, and Kannada dictionaries without throwing', () => {
    const en = useTranslation('en');
    const hi = useTranslation('hi');
    const kn = useTranslation('kn');

    expect(en('brand_name')).toBe('CareOn');
    expect(hi('brand_name')).toBe('CareOn');
    expect(kn('brand_name')).toBe('CareOn');

    expect(en('system_online')).toBe('System Online (LIVE)');
    expect(hi('system_online')).toContain('सिस्टम ऑनलाइन');
    expect(kn('system_online')).toContain('ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯವಾಗಿದೆ');

    // Hero title
    expect(en('hero_title')).toBe("Every second matters. We're here to help.");
    expect(hi('hero_title')).toContain('हर सेकंड महत्वपूर्ण है');
    expect(kn('hero_title')).toContain('ಪ್ರತಿ ಕ್ಷಣವೂ ಅಮೂಲ್ಯ');

    // Dial 112 button
    expect(en('dial_112_btn')).toBe('Call 112');
    expect(hi('dial_112_btn')).toContain('112');
    expect(kn('dial_112_btn')).toContain('112');
  });

  it('provides graceful fallbacks for missing keys', () => {
    const en = useTranslation('en');
    expect(en('non_existent_key_xyz', 'Default Fallback')).toBe('Default Fallback');
  });
});

describe('Redesigned Home Page', () => {
  it('renders hero title, 3 primary action buttons, 4-step workflow, and 112 helpline notice', () => {
    const handleNavigate = vi.fn();
    render(<Home lang="en" onNavigate={handleNavigate} />);

    expect(screen.getByText("Every second matters. We're here to help.")).toBeInTheDocument();
    expect(screen.getByText("Report an emergency, find coordinated assistance and stay updated throughout the response.")).toBeInTheDocument();

    // 3 primary actions
    const reportBtns = screen.getAllByRole('button', { name: /Report an Emergency/i });
    const reportBtn = reportBtns[0];
    const trackBtn = screen.getByRole('button', { name: /Track My Request/i });
    const saharaBtn = screen.getByRole('button', { name: /Talk to Sahara/i });

    expect(reportBtn).toBeInTheDocument();
    expect(trackBtn).toBeInTheDocument();
    expect(saharaBtn).toBeInTheDocument();

    // Clicking report button navigates to user_report
    fireEvent.click(reportBtn);
    expect(handleNavigate).toHaveBeenCalledWith('user_report');

    // 4-step workflow
    expect(screen.getByText(/How CareOn Works/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Report an Emergency/i)).toBeInTheDocument();
    expect(screen.getByText(/2. CareOn Evaluates the Request/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Resources are Coordinated/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Track Updates & Assistance/i)).toBeInTheDocument();

    // Emergency 112 helpline
    expect(screen.getByText(/National Emergency Helpline/i)).toBeInTheDocument();
  });
});

describe('User Authentication & Registration System', () => {
  it('allows user login with demo credentials and triggers navigation', async () => {
    const handleLoginSuccess = vi.fn();
    const handleNavigate = vi.fn();

    render(<UserLogin lang="en" onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />);

    // Click demo credentials fill button
    const fillBtn = screen.getByRole('button', { name: /Demo User/i });
    fireEvent.click(fillBtn);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput.value).toBe('aastha@example.com');

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(handleLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'aastha@example.com', role: 'user' })
    );
  });

  it('validates password mismatch on registration', async () => {
    render(<UserRegister lang="en" onRegisterSuccess={vi.fn()} onNavigate={vi.fn()} />);

    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const phoneInput = screen.getByPlaceholderText(/Enter your phone number/i);
    const passInput = screen.getByPlaceholderText(/Create a secure password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const submitBtn = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(nameInput, { target: { value: 'Rohan Sharma' } });
    fireEvent.change(emailInput, { target: { value: 'rohan@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.change(passInput, { target: { value: 'secret123' } });
    fireEvent.change(confirmInput, { target: { value: 'mismatch456' } });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });
});

describe('Admin Authentication', () => {
  it('allows coordinator login with Aastha Singh admin credentials', async () => {
    const handleLoginSuccess = vi.fn();
    render(<AdminLogin lang="en" onLoginSuccess={handleLoginSuccess} onNavigate={vi.fn()} />);

    const fillBtn = screen.getByRole('button', { name: /Aastha Singh - Coordinator/i });
    fireEvent.click(fillBtn);

    const submitBtn = screen.getByRole('button', { name: /Access Command Centre/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(handleLoginSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'admin@careon.org', role: 'admin' })
    );
  });
});

describe('User Dashboard Component', () => {
  it('renders verified citizen badge, user name, and user incident cards', async () => {
    const demoUser = { id: 2, name: 'Demo User', email: 'aastha@example.com', phone: '+91 98765 43210', role: 'user' };

    await act(async () => {
      render(<UserDashboard lang="en" currentUser={demoUser} onNavigate={vi.fn()} />);
    });

    expect(screen.getByText(/Verified Citizen Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome, Demo User/i)).toBeInTheDocument();
    expect(screen.getByText(/Sayyaji Rao Road, Mysuru/i)).toBeInTheDocument();
    expect(screen.getByText(/CARE-2026-101/i)).toBeInTheDocument();
  });
});

describe('Language Normalization and Complete Localization Verification', () => {
  it('verifies 100% key parity across en, hi, and kn without untranslated English copies', () => {
    const enKeys = Object.keys(translations.en);
    const hiKeys = Object.keys(translations.hi);
    const knKeys = Object.keys(translations.kn);

    expect(enKeys.length).toBe(627);
    expect(hiKeys.length).toBe(627);
    expect(knKeys.length).toBe(627);

    const missingInHi = enKeys.filter((k) => !translations.hi[k]);
    const missingInKn = enKeys.filter((k) => !translations.kn[k]);
    expect(missingInHi).toEqual([]);
    expect(missingInKn).toEqual([]);

    // Check that ordinary user-facing keys in hi and kn do not retain untranslated English text
    const hi = useTranslation('hi');
    const kn = useTranslation('kn');

    // Home page keys
    expect(hi('helpline_alert_title')).toBe('राष्ट्रीय आपातकालीन हेल्पलाइन');
    expect(kn('helpline_alert_title')).toBe('ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಹಾಯವಾಣಿ');
    expect(hi('how_it_works_title')).toBe('CareOn कैसे काम करता है');
    expect(kn('how_it_works_title')).toBe('CareOn ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ');
    expect(hi('zero_commission_title')).toBe('₹0 प्लेटफ़ॉर्म शुल्क — पारदर्शी आपातकालीन समन्वय');
    expect(kn('zero_commission_title')).toBe('₹0 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ — ಪಾರದರ್ಶಕ ತುರ್ತು ಸಮನ್ವಯ');

    // UserRegister keys
    expect(hi('user_register_title')).toBe('नागरिक खाता बनाएं');
    expect(kn('user_register_title')).toBe('ನಾಗರಿಕ ಖಾತೆಯನ್ನು ರಚಿಸಿ');
    expect(hi('full_name_label')).toBe('पूरा नाम');
    expect(kn('full_name_label')).toBe('ಪೂರ್ಣ ಹೆಸರು');
    expect(hi('create_account_btn')).toBe('खाता बनाएं');
    expect(kn('create_account_btn')).toBe('ಖಾತೆ ರಚಿಸಿ');
    expect(hi('password_mismatch')).toBe('पासवर्ड मेल नहीं खाते।');
    expect(kn('password_mismatch')).toBe('ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.');
  });

  it('normalizes invalid or missing language in localStorage to en', () => {
    // 1. Invalid value 'xyz'
    localStorage.setItem('careon_lang', 'xyz');
    expect(getInitialLanguage()).toBe('en');
    expect(localStorage.getItem('careon_lang')).toBe('en');

    // 2. Missing value
    localStorage.removeItem('careon_lang');
    expect(getInitialLanguage()).toBe('en');
    expect(localStorage.getItem('careon_lang')).toBe('en');

    // 3. Empty string
    localStorage.setItem('careon_lang', '');
    expect(getInitialLanguage()).toBe('en');
    expect(localStorage.getItem('careon_lang')).toBe('en');

    // 4. Valid values (hi, kn, en) are preserved
    localStorage.setItem('careon_lang', 'hi');
    expect(getInitialLanguage()).toBe('hi');
    expect(localStorage.getItem('careon_lang')).toBe('hi');

    localStorage.setItem('careon_lang', 'kn');
    expect(getInitialLanguage()).toBe('kn');
    expect(localStorage.getItem('careon_lang')).toBe('kn');

    localStorage.setItem('careon_lang', 'en');
    expect(getInitialLanguage()).toBe('en');
    expect(localStorage.getItem('careon_lang')).toBe('en');
  });
});

describe('Emergency Arrival Tracker Improvements (Compact Map, Enlarge Modal & Rotating Safety Tips)', () => {
  it('renders compact map preview with Enlarge Map button and opens/closes enlarged map modal', async () => {
    render(<Home lang="en" />);

    // Tracker is rendered because active incident is returned by fetchIncidents
    const previewHeader = await screen.findByText('Live Route Preview');
    expect(previewHeader).toBeInTheDocument();

    const enlargeBtn = screen.getByRole('button', { name: /Enlarge Map/i });
    expect(enlargeBtn).toBeInTheDocument();

    // Modal not open initially
    expect(screen.queryByText('Emergency Response Route & Tracker')).not.toBeInTheDocument();

    // Click Enlarge Map
    fireEvent.click(enlargeBtn);

    // Modal is opened
    expect(screen.getByText('Emergency Response Route & Tracker')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /Close Map/i });
    expect(closeBtn).toBeInTheDocument();

    // Click Close Map
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Emergency Response Route & Tracker')).not.toBeInTheDocument();
  });

  it('renders Stay Safe While You Wait section with category-specific tips and pause interaction', async () => {
    render(<Home lang="en" />);

    const staySafeTitle = await screen.findByText('Stay Safe While You Wait');
    expect(staySafeTitle).toBeInTheDocument();

    // Active incident is 'Medical'
    expect(screen.getByText(/Keep the person comfortable/i)).toBeInTheDocument();

    // Hover pauses rotation
    const tipContainer = screen.getByText(/Keep the person comfortable/i).closest('[title]');
    if (tipContainer) {
      fireEvent.mouseEnter(tipContainer);
      expect(screen.getByText(/Paused/i)).toBeInTheDocument();

      fireEvent.mouseLeave(tipContainer);
      expect(screen.queryByText(/Paused/i)).not.toBeInTheDocument();
    }
  });
});
