import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { useTranslation, translations } from '../translations';
import Home from '../pages/Home';
import UserLogin from '../pages/UserLogin';
import UserRegister from '../pages/UserRegister';
import AdminLogin from '../pages/AdminLogin';
import UserDashboard from '../pages/UserDashboard';

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
