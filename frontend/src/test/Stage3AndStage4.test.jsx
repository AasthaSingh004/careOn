import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import NotificationToast from '../components/NotificationToast';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard, {
  getAckIncidentIds,
  saveAckIncidentId,
  getSeenIncidentIds,
  saveSeenIncidentIds,
  emergencySound,
} from '../pages/AdminDashboard';
import { getSeenToastIds, addSeenToastId } from '../App';
import { fetchIncidents, fetchNotifications } from '../api';

// Mock API
vi.mock('../api', () => ({
  fetchIncidents: vi.fn(),
  fetchNotifications: vi.fn(),
  fetchResources: vi.fn().mockResolvedValue([]),
  fetchProviders: vi.fn().mockResolvedValue([]),
  fetchShortages: vi.fn().mockResolvedValue({ shortages: [], available_fleet_summary: {} }),
  fetchAnalytics: vi.fn().mockResolvedValue({ active_incidents: 1 }),
  fetchPredictions: vi.fn().mockResolvedValue([]),
  fetchFeedbackList: vi.fn().mockResolvedValue([]),
  markNotificationAsRead: vi.fn().mockResolvedValue(true),
  submitFeedback: vi.fn().mockResolvedValue({ id: 1 }),
  logoutUser: vi.fn(),
  logoutAdmin: vi.fn(),
  resetSimulationData: vi.fn().mockResolvedValue(true),
  fetchAdminDoctorCallbacks: vi.fn().mockResolvedValue([]),
  updateDoctorCallbackStatus: vi.fn().mockResolvedValue({}),
  fetchAdminNotifications: vi.fn().mockResolvedValue([]),
  getMultiAllocations: vi.fn().mockResolvedValue([]),
  markAdminNotificationAsRead: vi.fn().mockResolvedValue(true),
  markAllAdminNotificationsAsRead: vi.fn().mockResolvedValue(true),
}));

describe('Stage 3 — Notifications & Refresh Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Toast Notification Dismissal vs History', () => {
    it('allows toast to be dismissed without deleting or mutating bell history', () => {
      const handleDismiss = vi.fn();
      const handleMarkAsRead = vi.fn();
      const handleOpenDrawer = vi.fn();

      const sampleToasts = [
        {
          id: 101,
          title: 'Dispatch Confirmed',
          message: 'Ambulance AMB-01 dispatched to Sayyaji Rao Road',
          type: 'alert',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 102,
          title: 'Verification Complete',
          message: 'Your emergency contact has been verified.',
          type: 'success',
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ];

      render(
        <NotificationToast
          toasts={sampleToasts}
          onDismiss={handleDismiss}
          onMarkAsRead={handleMarkAsRead}
          onOpenDrawer={handleOpenDrawer}
          lang="en"
        />
      );

      // Both toasts are visible
      expect(screen.getByText(/Ambulance AMB-01 dispatched/i)).toBeInTheDocument();
      expect(screen.getByText(/Your emergency contact has been verified/i)).toBeInTheDocument();

      // Click dismiss on the first toast
      const dismissBtns = screen.getAllByRole('button', { name: /Dismiss/i });
      fireEvent.click(dismissBtns[0]);

      // onDismiss callback fired with ID 101
      expect(handleDismiss).toHaveBeenCalledWith(101);
      // Crucial: markAsRead was NOT called by dismiss
      expect(handleMarkAsRead).not.toHaveBeenCalled();
    });

    it('prevents duplicate notification toasts via seen ID tracking', () => {
      expect(getSeenToastIds()).toEqual([]);

      addSeenToastId(501);
      expect(getSeenToastIds()).toEqual([501]);

      // Adding the same ID again does not duplicate
      addSeenToastId(501);
      expect(getSeenToastIds()).toEqual([501]);

      addSeenToastId(502);
      expect(getSeenToastIds()).toEqual([501, 502]);
    });
  });

  describe('Citizen Dashboard Refresh Success & Failure States', () => {
    it('fetches fresh data from actual APIs and shows "Updated just now" on success', async () => {
      fetchIncidents.mockResolvedValueOnce([
        {
          id: 1,
          incident_code: 'CARE-2026-101',
          category: 'Medical',
          description: 'Cardiac emergency',
          location_name: 'Mysuru',
          status: 'Pending',
          priority: 'Critical',
          created_at: new Date().toISOString(),
        },
      ]);
      fetchNotifications.mockResolvedValueOnce([]);

      await act(async () => {
        render(<UserDashboard lang="en" currentUser={{ id: 1, name: 'Demo User' }} />);
      });

      // Initially loads data
      expect(screen.getByText(/CARE-2026-101/i)).toBeInTheDocument();

      // Mock fresh data for manual refresh
      fetchIncidents.mockResolvedValueOnce([
        {
          id: 2,
          incident_code: 'CARE-2026-102',
          category: 'Fire',
          description: 'Factory fire',
          location_name: 'Hebbal, Mysuru',
          status: 'Pending',
          priority: 'High',
          created_at: new Date().toISOString(),
        },
      ]);
      fetchNotifications.mockResolvedValueOnce([]);

      const refreshBtn = screen.getByRole('button', { name: /Refresh/i });
      await act(async () => {
        fireEvent.click(refreshBtn);
      });

      // Successfully updated with fresh incident
      expect(screen.getByText(/CARE-2026-102/i)).toBeInTheDocument();
      expect(screen.getByText(/Updated just now/i)).toBeInTheDocument();
    });

    it('displays error feedback and does not claim success when refresh fails', async () => {
      fetchIncidents.mockResolvedValueOnce([]);
      fetchNotifications.mockResolvedValueOnce([]);

      await act(async () => {
        render(<UserDashboard lang="en" currentUser={{ id: 1, name: 'Demo User' }} />);
      });

      // Now mock a network failure on manual refresh
      fetchIncidents.mockRejectedValueOnce(new Error('Network offline'));
      fetchNotifications.mockRejectedValueOnce(new Error('Network offline'));

      const refreshBtn = screen.getByRole('button', { name: /Refresh/i });
      await act(async () => {
        fireEvent.click(refreshBtn);
      });

      // Shows error message without claiming success
      expect(screen.getByText(/Failed to refresh live data from server/i)).toBeInTheDocument();
      expect(screen.queryByText(/Feed refreshed successfully/i)).not.toBeInTheDocument();
    });
  });
});

describe('Stage 4 — Admin Command Centre Emergency Alerts Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('detects a genuinely new pending emergency and renders a prominent flashing alert banner', async () => {
    // Seed seen list with older incident 1 so it does not trigger alert
    saveSeenIncidentIds([1]);

    const newEmergency = {
      id: 99,
      incident_code: 'CARE-2026-999',
      category: 'Medical',
      priority: 'Critical',
      status: 'Pending',
      location_name: 'D. Devaraj Urs Road, Mysuru',
      description: 'Severe multi-vehicle accident with trapped victims',
      contact_name: 'Ravi Kumar',
      contact_phone: '+91 98765 11111',
      created_at: new Date().toISOString(),
    };

    fetchIncidents.mockResolvedValueOnce([newEmergency]);

    await act(async () => {
      render(<AdminDashboard lang="en" currentUser={{ id: 1, name: 'Coordinator Aastha' }} />);
    });

    // Renders the flashing emergency alert banner
    const alertBanner = screen.getByRole('alert');
    expect(alertBanner).toBeInTheDocument();
    expect(alertBanner).toHaveTextContent(/New Emergency Alert: Immediate Action Required/i);
    expect(alertBanner).toHaveTextContent('CARE-2026-999');
    expect(alertBanner).toHaveTextContent(/Severe multi-vehicle accident with trapped victims/i);
    expect(screen.getByRole('button', { name: /Acknowledge & Silence/i })).toBeInTheDocument();
  });

  it('acknowledging an alert stops alerting and suppresses repeated alerts without deleting the record', async () => {
    saveSeenIncidentIds([1]);

    const incident = {
      id: 77,
      incident_code: 'CARE-2026-077',
      category: 'Fire',
      priority: 'Critical',
      status: 'Pending',
      location_name: 'Vijayanagar, Mysuru',
      description: 'Residential building fire',
      contact_name: 'Priya Rao',
      contact_phone: '+91 98765 22222',
      created_at: new Date().toISOString(),
    };

    fetchIncidents.mockResolvedValueOnce([incident]);

    await act(async () => {
      render(<AdminDashboard lang="en" currentUser={{ id: 1, name: 'Coordinator Aastha' }} />);
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Click Acknowledge & Silence
    const ackBtn = screen.getByRole('button', { name: /Acknowledge & Silence/i });
    await act(async () => {
      fireEvent.click(ackBtn);
    });

    // Alert banner is removed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    // ID is saved to acknowledged list
    expect(getAckIncidentIds()).toContain(77);

    // On subsequent fetch, the acknowledged incident does not trigger an alert
    fetchIncidents.mockResolvedValueOnce([incident]);
    const refreshBtn = screen.getByRole('button', { name: /Refresh Feed/i });
    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('provides a sound enable/disable toggle that persists in localStorage', async () => {
    fetchIncidents.mockResolvedValueOnce([]);

    await act(async () => {
      render(<AdminDashboard lang="en" currentUser={{ id: 1, name: 'Coordinator Aastha' }} />);
    });

    // Initial state: Sound is off by default
    const soundBtn = screen.getByRole('button', { name: /Sound: Off/i });
    expect(soundBtn).toBeInTheDocument();
    expect(localStorage.getItem('careon_admin_sound_enabled')).not.toBe('true');

    // Click to enable sound
    await act(async () => {
      fireEvent.click(soundBtn);
    });

    expect(screen.getByRole('button', { name: /Sound: On/i })).toBeInTheDocument();
    expect(localStorage.getItem('careon_admin_sound_enabled')).toBe('true');

    // Click to disable sound
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Sound: On/i }));
    });

    expect(screen.getByRole('button', { name: /Sound: Off/i })).toBeInTheDocument();
    expect(localStorage.getItem('careon_admin_sound_enabled')).toBe('false');
  });

  it('EmergencySoundPlayer startLoop and stop manage audio lifecycle cleanly', () => {
    const playSpy = vi.spyOn(emergencySound, 'playBeep').mockImplementation(() => {});

    emergencySound.startLoop();
    expect(playSpy).toHaveBeenCalled();
    expect(emergencySound.intervalId).not.toBeNull();

    emergencySound.stop();
    expect(emergencySound.intervalId).toBeNull();
  });
});
