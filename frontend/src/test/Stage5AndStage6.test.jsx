import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import React from 'react';
import SaharaChatbot from '../components/SaharaChatbot';
import TrackRequest from '../pages/TrackRequest';
import ReportEmergency from '../pages/ReportEmergency';
import AdminDashboard from '../pages/AdminDashboard';
import { formatISTTime, formatISTDateTime, formatISTDate } from '../utils/date';
import { useTranslation } from '../translations';
import {
  sendChatMessage,
  fetchIncidentDetails,
  verifyIncidentOtp,
  requestIncidentOtp,
  fetchSystemConfig,
  requestDoctorCallback,
  fetchIncidentDoctorCallbacks,
  fetchAdminDoctorCallbacks,
  updateDoctorCallbackStatus,
  reportIncident,
} from '../api';

vi.mock('../components/LeafletMap', () => ({
  default: () => <div data-testid="mock-leaflet-map" />,
}));

// Mock API
vi.mock('../api', () => ({
  sendChatMessage: vi.fn(),
  fetchIncidentDetails: vi.fn(),
  verifyIncidentOtp: vi.fn(),
  requestIncidentOtp: vi.fn(),
  fetchSystemConfig: vi.fn().mockResolvedValue({ helpline_number: null, official_emergency_number: '112' }),
  requestDoctorCallback: vi.fn(),
  fetchIncidentDoctorCallbacks: vi.fn().mockResolvedValue([]),
  fetchAdminDoctorCallbacks: vi.fn().mockResolvedValue([]),
  updateDoctorCallbackStatus: vi.fn().mockResolvedValue({}),
  fetchAdminNotifications: vi.fn().mockResolvedValue([]),
  getMultiAllocations: vi.fn().mockResolvedValue([]),
  markAdminNotificationAsRead: vi.fn().mockResolvedValue(true),
  markAllAdminNotificationsAsRead: vi.fn().mockResolvedValue(true),
  reportIncident: vi.fn(),
  fetchIncidents: vi.fn().mockResolvedValue([]),
  fetchResources: vi.fn().mockResolvedValue([]),
  fetchProviders: vi.fn().mockResolvedValue([]),
  fetchShortages: vi.fn().mockResolvedValue({ shortages: [], available_fleet_summary: {} }),
  fetchAnalytics: vi.fn().mockResolvedValue({ active_incidents: 1 }),
  fetchPredictions: vi.fn().mockResolvedValue([]),
  fetchFeedbackList: vi.fn().mockResolvedValue([]),
  cancelIncident: vi.fn(),
  updateProviderEnquiry: vi.fn(),
  submitFeedback: vi.fn(),
  resetSimulationData: vi.fn().mockResolvedValue(true),
  getStoredUserSession: () => {
    try {
      const raw = localStorage.getItem('careon_user_info');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  getStoredAdminSession: () => {
    try {
      const raw = localStorage.getItem('careon_admin_info');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
}));

describe('Stage 5 — Sahara Voice Commands & Personalized Greetings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders Sahara with personalized greeting for logged-in citizen', async () => {
    // Mock user session
    localStorage.setItem('careon_user_info', JSON.stringify({
      id: 2,
      name: 'Rohan Sharma',
      full_name: 'Rohan Sharma',
      email: 'rohan@example.com',
      role: 'user',
    }));

    render(<SaharaChatbot lang="en" initialOpen={true} />);

    expect(screen.getByText(/Hey Rohan Sharma! ❤️/i)).toBeInTheDocument();
  });

  it('provides a voice input toggle button and handles speech recognition cleanly', async () => {
    render(<SaharaChatbot lang="en" initialOpen={true} />);

    const voiceBtn = screen.getByLabelText(/Voice input/i);
    expect(voiceBtn).toBeInTheDocument();

    // Toggle voice button
    fireEvent.click(voiceBtn);

    // In JSDOM where SpeechRecognition is not natively supported, it gracefully displays notification
    expect(screen.getByText(/Voice input is not supported in this browser/i)).toBeInTheDocument();
  });

  it('sends message passing user_name and language to backend for personalized intent triage', async () => {
    localStorage.setItem('careon_user_info', JSON.stringify({
      id: 2,
      name: 'Rohan Sharma',
      full_name: 'Rohan Sharma',
      email: 'rohan@example.com',
      role: 'user',
    }));

    sendChatMessage.mockResolvedValue({
      reply: 'I am right here with you, Rohan. Emergency dispatch is monitoring your coordinates.',
      suggested_actions: [],
    });

    render(<SaharaChatbot lang="en" initialOpen={true} />);

    const input = screen.getByPlaceholderText(/Ask Sahara/i);
    fireEvent.change(input, { target: { value: 'Where is the ambulance?' } });

    const submitBtn = screen.getByRole('button', { name: '' });
    await act(async () => {
      fireEvent.submit(input.closest('form'));
    });

    expect(sendChatMessage).toHaveBeenCalledWith(
      'Where is the ambulance?',
      'careon_user_session',
      'Rohan Sharma',
      'en'
    );
  });
});

describe('Stage 6 — Citizen Experience: Simulated OTP, Doctor Callbacks & Helpline', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const mockPendingIncident = {
    id: 101,
    incident_code: 'CARE-2026-101',
    status: 'Verification Pending',
    priority: 'Critical',
    category: 'Medical',
    location_name: 'KR Hospital Circle, Mysuru',
    contact_name: 'Rohan Sharma',
    contact_phone: '+91 98765 43210',
    is_verified: false,
    created_at: new Date().toISOString(),
    assignments: [],
    provider_enquiries: [],
    updates: [],
  };

  it('renders in-app simulated OTP verification card and verifies phone contact', async () => {
    fetchIncidentDetails.mockResolvedValue(mockPendingIncident);
    fetchSystemConfig.mockResolvedValue({ helpline_number: null, official_emergency_number: '112' });
    fetchIncidentDoctorCallbacks.mockResolvedValue([]);
    verifyIncidentOtp.mockResolvedValue({ ...mockPendingIncident, is_verified: true, status: 'Verified' });

    render(
      <TrackRequest
        lang="en"
        initialIncidentCode="CARE-2026-101"
        initialSimulatedOtp="582910"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Emergency Contact Verification \(Simulated In-App OTP\)/i)).toBeInTheDocument();
    });

    expect(screen.getByText('582910')).toBeInTheDocument();

    const otpInput = screen.getByPlaceholderText(/Enter 6-digit code/i);
    expect(otpInput.value).toBe('582910');

    const verifyBtn = screen.getByRole('button', { name: /Verify Code/i });
    await act(async () => {
      fireEvent.click(verifyBtn);
    });

    expect(verifyIncidentOtp).toHaveBeenCalledWith(101, '582910', 'user');
  });

  it('allows requesting a fresh simulated verification code via requestIncidentOtp', async () => {
    fetchIncidentDetails.mockResolvedValue(mockPendingIncident);
    fetchSystemConfig.mockResolvedValue({ helpline_number: null, official_emergency_number: '112' });
    fetchIncidentDoctorCallbacks.mockResolvedValue([]);
    requestIncidentOtp.mockResolvedValue({
      incident_id: 101,
      incident_code: 'CARE-2026-101',
      simulated_otp: '918273',
      expires_at: new Date(Date.now() + 600000).toISOString(),
    });

    render(<TrackRequest lang="en" initialIncidentCode="CARE-2026-101" />);

    await waitFor(() => {
      expect(screen.getByText(/Emergency Contact Verification/i)).toBeInTheDocument();
    });

    const requestNewBtn = screen.getByRole('button', { name: /Request New Code/i });
    await act(async () => {
      fireEvent.click(requestNewBtn);
    });

    expect(requestIncidentOtp).toHaveBeenCalledWith(101, 'user');
    await waitFor(() => {
      expect(screen.getByText('918273')).toBeInTheDocument();
    });
  });

  it('renders simple Call a Doctor option and displays unavailable notice on click without creating fake calls', async () => {
    fetchIncidentDetails.mockResolvedValue({
      ...mockPendingIncident,
      is_verified: true,
      status: 'Assistance Search',
    });
    fetchSystemConfig.mockResolvedValue({ helpline_number: '+91 821 2418000', official_emergency_number: '112' });

    render(<TrackRequest lang="en" initialIncidentCode="CARE-2026-101" />);

    await waitFor(() => {
      expect(screen.getAllByText(/Call a Doctor/i)[0]).toBeInTheDocument();
    });

    // Unavailable notice should not be visible initially
    expect(screen.queryByTestId('doctor-unavailable-notice')).not.toBeInTheDocument();

    // Click the Call a Doctor button
    const callDoctorBtn = screen.getByRole('button', { name: /Call a Doctor/i });
    fireEvent.click(callDoctorBtn);

    // Unavailable notice is displayed
    expect(screen.getByTestId('doctor-unavailable-notice')).toBeInTheDocument();
    expect(screen.getByText(/Doctor calling is currently unavailable/i)).toBeInTheDocument();

    // Verify no doctor callback API was called
    expect(requestDoctorCallback).not.toHaveBeenCalled();
  });

  it('provides official direct emergency line (112) with safety disclaimer on tracking view', async () => {
    fetchIncidentDetails.mockResolvedValue(mockPendingIncident);
    fetchIncidentDoctorCallbacks.mockResolvedValue([]);

    fetchSystemConfig.mockResolvedValue({
      official_emergency_number: '112',
      official_emergency_disclaimer: 'CareOn is a decision-support coordination prototype.',
    });

    render(<TrackRequest lang="en" initialIncidentCode="CARE-2026-101" />);

    await waitFor(() => {
      // Official 112 guidance must be present
      expect(screen.getByText(/CareOn is a decision-support coordination prototype/i)).toBeInTheDocument();
      const call112Link = screen.getByRole('link', { name: /112/i });
      expect(call112Link).toHaveAttribute('href', 'tel:112');
    });
  });

  it('formats dates and times consistently in Asia/Kolkata (IST) timezone regardless of local environment', () => {
    // 12:00:00 UTC = 17:30:00 IST (+5:30)
    const testUtcIso = '2026-05-10T12:00:00Z';

    const formattedTime = formatISTTime(testUtcIso);
    // Should contain 05:30 pm or 5:30 pm (case-insensitive)
    expect(formattedTime.toLowerCase()).toMatch(/0?5:30\s*pm/);

    const formattedDateTime = formatISTDateTime(testUtcIso);
    expect(formattedDateTime).toContain('10 May 2026');
    expect(formattedDateTime.toLowerCase()).toMatch(/0?5:30\s*pm/);

    const formattedDate = formatISTDate(testUtcIso);
    expect(formattedDate).toContain('10 May 2026');

    // Safe fallbacks for missing/invalid values
    expect(formatISTTime(null)).toBe('');
    expect(formatISTTime(undefined)).toBe('');
    expect(formatISTTime('')).toBe('');
    expect(formatISTTime('invalid-date')).toBe('');
    expect(formatISTDateTime(null)).toBe('');
    expect(formatISTDate(null)).toBe('');
  });

  it('Admin Command Centre displays doctor callbacks table and supports coordinator status update', async () => {
    fetchAdminDoctorCallbacks.mockResolvedValue([
      {
        id: 1,
        incident_id: 101,
        incident_code: 'CARE-2026-101',
        contact_name: 'Rohan Sharma',
        contact_phone: '+91 98765 43210',
        chief_complaint: 'Chest pain radiating to arm',
        status: 'Pending',
        created_at: new Date().toISOString(),
      },
    ]);
    updateDoctorCallbackStatus.mockResolvedValue({
      id: 1,
      status: 'In Progress',
    });

    render(<AdminDashboard lang="en" currentUser={{ name: 'Aastha Singh', role: 'admin' }} />);

    // Click Trust & Verification tab
    const verifTab = screen.getByRole('button', { name: /Trust/i });
    fireEvent.click(verifTab);

    await waitFor(() => {
      expect(screen.getByText(/Doctor Callbacks/i)).toBeInTheDocument();
      expect(screen.getByText('Chest pain radiating to arm')).toBeInTheDocument();
    });

    const inProgressBtn = screen.getByRole('button', { name: /In Progress/i });
    await act(async () => {
      fireEvent.click(inProgressBtn);
    });

    expect(updateDoctorCallbackStatus).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: 'In Progress' })
    );
  });

  it('removes unnecessary faculty demo and expo labels in ReportEmergency and AdminDashboard', () => {
    // In ReportEmergency, verify clean terminology without faculty demonstration text
    render(<ReportEmergency lang="en" onSubmitted={vi.fn()} />);
    expect(screen.queryByText(/For faculty demonstration, phone OTP code is pre-authorized/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Emergency Contact Verification/i)).toBeInTheDocument();

    // In AdminDashboard, verify simulation title without "Expo Demonstration"
    render(<AdminDashboard lang="en" currentUser={{ name: 'Aastha Singh', role: 'admin' }} />);
    expect(screen.queryByText(/Expo Demonstration/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Simulation/i })).toBeInTheDocument();
  });

  it('dispatches careon-otp-generated window event when fresh OTP is requested', async () => {
    fetchIncidentDetails.mockResolvedValue(mockPendingIncident);
    fetchSystemConfig.mockResolvedValue({ helpline_number: null, official_emergency_number: '112' });
    requestIncidentOtp.mockResolvedValue({
      incident_id: 101,
      incident_code: 'CARE-2026-101',
      simulated_otp: '741852',
      expires_at: new Date(Date.now() + 600000).toISOString(),
    });

    const eventListener = vi.fn();
    window.addEventListener('careon-otp-generated', eventListener);

    render(<TrackRequest lang="en" initialIncidentCode="CARE-2026-101" />);

    await waitFor(() => {
      expect(screen.getByText(/Emergency Contact Verification/i)).toBeInTheDocument();
    });

    const requestNewBtn = screen.getByRole('button', { name: /Request New Code/i });
    await act(async () => {
      fireEvent.click(requestNewBtn);
    });

    expect(eventListener).toHaveBeenCalled();
    const eventDetail = eventListener.mock.calls[0][0].detail;
    expect(eventDetail.otp).toBe('741852');
    expect(eventDetail.code).toBe('CARE-2026-101');

    window.removeEventListener('careon-otp-generated', eventListener);
  });

  it('translates in-app verification notification and OTP error states into Hindi and Kannada', () => {
    const { t: tHi } = useTranslation('hi');
    const { t: tKn } = useTranslation('kn');

    const titleEn = "Emergency Verification Code (CARE-2026-101)";
    expect(tHi(titleEn)).toBe("आपातकालीन सत्यापन कोड (CARE-2026-101)");
    expect(tKn(titleEn)).toBe("ತುರ್ತು ಪರಿಶೀಲನಾ ಕೋಡ್ (CARE-2026-101)");

    const msgEn = "Your CareOn verification code is: 123456. Enter this code in the verification box to continue. (In-App Demo OTP)";
    expect(tHi(msgEn)).toContain("123456");
    expect(tHi(msgEn)).toContain("सत्यापन कोड");
    expect(tKn(msgEn)).toContain("123456");
    expect(tKn(msgEn)).toContain("ಪರಿಶೀಲನಾ ಕೋಡ್");

    const errEn = "Invalid verification code. Attempts remaining: 3.";
    expect(tHi(errEn)).toBe("अमान्य सत्यापन कोड। शेष प्रयास: 3।");
    expect(tKn(errEn)).toBe("ಅಮಾನ್ಯ ಪರಿಶೀಲನಾ ಕೋಡ್. ಉಳಿದಿರುವ ಪ್ರಯತ್ನಗಳು: 3.");
  });
});
